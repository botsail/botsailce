var Engine = require(global.appRoot + "/core/engine.js");
var Content            = require(global.appRoot + '/app/models/entities/content');
var Block            = require(global.appRoot + '/app/models/entities/block');
var Common = require(global.appRoot + "/core/common.js");
const Communications = require(global.appRoot + '/app/models/entities/communication');
var LastMessage            = require(global.appRoot + '/app/models/entities/last_message');
var Cache            = require(global.appRoot + '/core/util/cache');
var PromiseBook            = require(global.appRoot + '/core/util/promisebook');
const { MessengerBatch } = require('messaging-api-messenger');
var RuntimeAPI            = require(global.appRoot + '/core/runtimeapi');
var dateFormat = require('dateformat');

class BSPatternEngine extends Engine { 
	constructor() {
		super();
		this.answer = null;
		this.promiseBook = null;
		this.testing = false;
		this.res = null;
	}
	
	setTesting(bool) {
		this.testing = bool;
	}
	
	query(res, client, userId, query_string, content, bot_id) {
		var myself = this;
		this.res = res;
		myself.answer = {
				type: "",
				value: []
			};
		
		myself.promiseBook = new PromiseBook(
			["query", "messageTracking"], 0, 
			function(err, data) {
				if(err) { 
					myself.sendTextToUser(client, userId, ". . . ");
					return;
				} 
				
				if(myself.answer.type == "Content") {
					myself.sendContentAnswer(bot_id, client, userId, query_string, myself.answer);
				} else {
					myself.sendBlockAnswer(bot_id, client, userId, query_string, myself.answer);
				}
			}
		);
		
		try {
			Content.findOne({bot_id : bot_id, datatype: "content", $where: "\"" + query_string +"\".match(this.query)"}, function(err, result){
				if(Common.isset(result) != null) {
					let R = Common.randomNum(0, result.answer.length - 1);
					myself.answer.value.push(result.answer[R]);
					myself.answer.type = "Content";
					myself.promiseBook.updatePointStatus("query");
					myself.messageTracking(query_string,client, bot_id, userId);
				} else {
					Block.findOne({bot_id : bot_id, datatype: "block", $where: "\"" + query_string +"\".match(this.query)"}, function(err, result){
						if(err != null)  { 
							myself.sendTextToUser(client, userId, "Hello world");
						} else  if(Common.isset(result) != null){ 
							myself.answer.value = result.value;
							myself.answer.type = "Block";
							myself.promiseBook.updatePointStatus("query");
							myself.messageTracking(query_string,client, bot_id, userId);
						}  else { 
							myself.sendTextToUser(client,  userId, ". . . ");
						}
					});
				}
			});
		} catch(ex) { 
			myself.sendTextToUser(client,  userId, ". . . ");
		}
		
		
	}
	
	messageTracking(message, bot_id, sender_id) {
		var myself = this;
		Communications.findOne({bot_id : bot_id, uid: sender_id, type: 'messager'}, function(err, comm) {
			if(Common.isset(comm) != null) {
				//this.updateCom(message, bot_id, sender_id)
				myself.promiseBook.updatePointStatus("messageTracking");
			} else {
				//this.addCom(message, bot_id, sender_id)
				myself.promiseBook.updatePointStatus("messageTracking");
			}
		} );
		
	}
	
	async updateCom(message, bot_id, uid) {
		let last_time = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
		let data = {
                                time: last_time,
                                who: 'guest',
                                message: message
                            };
		const newContent = await Communications.findOneAndUpdate({
			uid: content.uid,
			bot_id: bot_id
		}, {
			$push: {
				data: data
			}
		}, {
			new: true
		});

		const newLastmessage = 
			{
				time: last_time,
				message: message
			};

		const lastMessage = await LastMessage.findOneAndUpdate({
			datatype: 'last-message',
			'data.uid': uid,
			bot_id: bot_id
		}, {
			$set: {
				'data.$.data-member': newLastmessage
			}
		});
	}
	
	async addCom(message, bot_id, uid) {
		let last_time = dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
		let data = {
			type:'messager',
			bot_id: bot_id,
			uid:uid,
			fullname:"chua-lam",
			gender:"chua-lam",
			data: [{
				time:last_time,
				who:"guest",//guest, bot
				message:message
			}],
		};
		

		const newUser = new Communications(content);
		await newUser.save();

		const lastMessageData = {
			uid:uid,
			data_bot: {
					time:last_time,
					message:message
				},
			data_guest: {
					time: null,
					message:"",
				},

		}
		
		let data = await LastMessage.findOne({datatype: 'last-message', bot_id: bot_id, "data.uid" : uid},{'data.$': 1});
		if((data != undefined) || (data != null)) {
			await LastMessage.update({datatype: 'last-message', bot_id: bot_id, "data.uid" : uid},{"data.$.data-bot" : lastMessageData.data_bot, "data.$.data_guest" : lastMessageData.data_guest }
			);
		} else {	//If key not exits, insert
			
			data = await LastMessage.update(
			  {datatype: 'last-message', bot_id: bot_id  },
			  {$push: { "data" : lastMessageData}},
			);
		}

	}
	


	
	sendContentAnswer(bot_id, client, userId, query_string, answer) {
        try {
			//if single message
			var myself = this;
			if(answer.value[0].type == "text") this.sendTextToUser(client, userId, answer.value[0].content);
			else if(answer.value[0].type == "image") this.sendImageToUser(client, userId, answer.value[0].image_path);
			else if(answer.value[0].type == "block") {
				Block.findOne({bot_id : bot_id, datatype: "block", _id: answer.value[0].block_id}, function(err, result) {
					if(Common.isset(result) != null) {
						myself.answer.value = result.value;
						myself.answer.type = "Block";
						
						myself.sendBlockAnswer(bot_id, client, userId, query_string, myself.answer)
					}
				});
            }
        }catch(ex) {
            this.sendTextToUser(client, userId, query_string);
        }
        
    }
	
	sendBlockAnswer(bot_id, client, userId, query_string, answer) {
        try {
			//if single message
			let respone = [];
			this.runScript(answer.value, bot_id, client);
			this.createTextMessage(userId,answer.value,respone);
			this.createGenericTemplate(userId,answer.value,respone);
			if(this.testing == true) { this.res.send(JSON.stringify(respone)); return;}
			client.sendBatch(respone);// Send respone
			this.res.status(200).end();
        }catch(ex) {
            this.sendTextToUser(client, userId, query_string);
        }
        
    }
	
	
	runScript(answer, bot_id, client) {
		let runtimeAPI = new RuntimeAPI(bot_id, client)
		for(let i = 0; i < answer.length; i++) {
			if(answer[i].type == "jsscript") runtimeAPI.runSanbox(answer[i].jsscript);
		}
	}

    //this function is to send text to user
    sendTextToUser(client, userId, content) {
		if(this.testing == true) { this.res.send(JSON.stringify(content)); return;}
        client.sendText(userId, content);
		this.res.status(200).end();
    }

    //this function is to send image to user
    sendImageToUser(client, userId, image_path) {
		if(this.testing == true) { this.res.send(image_path); return;}
        image_path = global.serverUrl + image_path;
        client.sendImage(userId, image_path);
		this.res.status(200).end();
    }
	
	getImageURL(image_url) {
		if((image_url.indexOf('http://') != 0) || (image_url.indexOf('https://') != 0))
			image_url = Controller.prototype.getSystemConstants()["host"] + image_url;
		
		return image_url;
	}
	
	getFullURL(url) {
		if((url.indexOf('http://') != 0) || (url.indexOf('https://') != 0))
			url = "http://" + url;
		
		return url;
	}

    createTextMessage(sender,obj,respone) {
		var newobj = obj.slice();
		let message = [];

		//Get data type 'text' in array
		for(var i=0;i<newobj.length;i++){
		  if(newobj[i].type == 'text'){
			message.push(newobj[i])
		  }
		}
		//Make form for respone from object
		message = this.batchmessage(message);

		for(var i=0; i<message.length;i++){
		  respone.push(MessengerBatch.sendButtonTemplate(sender,message[i].content,message[i].button)); 
		}
	}
	  
	createGenericTemplate(sender,obj,respone) {
		var newobj = obj.slice();
		let image = [];
		let groupid = {};

		for(var i=0;i<newobj.length;i++){
			//Get image without group id
		  if(newobj[i].type == 'image' && newobj[i].group_id == ''){
				image.push(newobj[i]);
			}
			//Get image and combine to gallery when same group id
		  if(newobj[i].type == 'image' && newobj[i].group_id != ''){
				if(!groupid[newobj[i].group_id]){
					groupid[newobj[i].group_id] = [];
					groupid[newobj[i].group_id].push(newobj[i]);
				}else{
					groupid[newobj[i].group_id].push(newobj[i]);
				}
		  }
		}
		//Make form for respone from object
		let gallery = this.batchgallery(groupid);
		//Make form for respone from object
		image = this.batchimage(image);

		for(var i=0;i<image.length;i++){
		  respone.push(MessengerBatch.sendGenericTemplate(sender, [image[i]],{ image_aspect_ratio: 'square'}));
		}
		for (var property1 in gallery) {
		  console.log(gallery[property1]);
		  respone.push(MessengerBatch.sendGenericTemplate(sender, gallery[property1],{ image_aspect_ratio: 'square'}));
		}
	}

	batchgallery(groupid){
		var gallery = {};

		for (var property1 in groupid) {
			var usedata = [];
			//Array usedata have objects will be send, this is gallery
		  for(var i=0;i<groupid[property1].length;i++){
				var element = groupid[property1];
				let use = {
					title: element[i].title,
					image_url: element[i].image_url,
					subtitle: element[i].sub_title,
				}
				usedata.push(use);
		  }
		  gallery[property1] = usedata;
		}
		return gallery;
	}

	batchimage(obj){
		var usedata = [];
		//Array usedata have objects will be send, this is image
		for(var i=0;i<obj.length;i++){
		  let use = {
				title: obj[i].title,
				image_url: obj[i].image_path,
				subtitle: obj[i].sub_title,
				buttons: []
			}
			//Button
			if(obj[i].type == "button") {
				for(var j=0; j<obj[i].button.length;j++){
					let button = {
						type : obj[i].button[j].type,
						title : obj[i].button[j].title,
						url : obj[i].button[j].url,
					}
					use.buttons.push(button);
				}		
			}
		  
			
		  usedata.push(use);
		}
		return usedata;
	  }


	batchmessage(obj){
		var usedata = [];
		//Array usedata have objects will be send, this is message
		for(var i=0;i<obj.length;i++){
		  let use = {
				content: obj[i].content,
				button: []
			}
			//Button
		  for(var j=0; j<obj[i].button.length;j++){
				let button = {
					type : obj[i].button[j].type,
					title : obj[i].button[j].title,
					url : obj[i].button[j].url,
				}
				use.button.push(button);
			}
			
		  usedata.push(use);
		}
		return usedata;
	}
	
	
	

	runCallback(patternData, chatInfo) {
		var callback_value = [];
		try {
			let k = null;
			let index = 0;
			try {
				eval(patternData.callback);	
			} catch(ex) { 
				return null;
			}
			
			for (k in callback_value){
			    if (callback_value.hasOwnProperty(k)) {
			    	for (let j in chatInfo.needValue){
			    		if(chatInfo.needValue[j].name == k) {
			    			chatInfo.needValue[j]['value'] = callback_value[k] ;
			    		}
			    	}

			        index++;
			    }
			}

		} catch(ex) {
			console.log(ex);
			return null;
		}

		return chatInfo;
	}
	
	
	
	

	

	setAllData() {

		if(this.req.session.params == undefined) this.req.session.params = {};
		//Nếu request của có value nào, thêm đối tượng value vào
		if((this.req.session.value == undefined) || (this.req.session.value == null)) this.req.session.value = [];
		
		//When 	patternData store value
		if(Common.isset(patternData.value) && patternData.value.length > 0) {
			for(let index in patternData.value) { 
				this.addPatternValueToReuqest(patternData.value[index]);
			}

			let obj =  this.getRandomNextQuestion(patternData.topic, this.req.params, "vi");
			return obj;
		}

		return null;
	}

	//Lấy field value trong DB, kết hợp với pattern để lấy được key_value
	addPatternValueToReuqest(items) {
		if(!Common.isset(items)) return;
		let objValue = this.getItemValue(items);
		this.req.params[objValue.name] = objValue.value;
	}

	getNextValue(items) {
		if(!Common.isset(items)) return;
		this.nextValue = items;			//Value còn thiếu, sẽ phải bổ xung
	}
}

module.exports = BSPatternEngine;