const Controller = require(global.appRoot + '/core/controller');
const FBConnectSchema = require(global.appRoot + '/packages/fbsbot/models/entities/package');
var Comm = require(global.appRoot + '/app/models/entities/communication');
const Common = require(global.appRoot + '/core/common');
const { MessengerClient } = require('messaging-api-messenger');


class ChatbotController extends Controller {
    
    static async loadConfig(bot_id) {
        //load config         
		return new Promise((resolve, reject)=>{ 
			FBConnectSchema.find({ "name": "fbsbot", "bot_id": bot_id}, function(err, fbConnectSchema){
				if(err != null) {
					reject(false);
					return;
				};
				if(fbConnectSchema == null) { reject(false); return null; }
				let bot_id = "";
				global.appChatbotEngineConfig = {};
				let i = 0;
				fbConnectSchema.forEach(function(fbConnect) {
					bot_id = fbConnect.bot_id + "";
					global.appChatbotEngineConfig[bot_id] = fbConnect;
					global.appClient[bot_id] = MessengerClient.connect(fbConnect.pageToken);
					i++;
				});
				
				resolve(true);
			});
		});
		
		
    }

    static async verifycation(req, res){
		let bot_id = req.params.bot_id;
        if(global.appFBChatbotEngine == null) {
            var ChatbotEngine = require(global.appRoot + '/packages/' + global.appChatbotEnginePath + '/' + global.appChatbotEngineAction);  
            global.appFBChatbotEngine = new ChatbotEngine();
        } 

        if(Common.isset(global.appClient[bot_id]) == null) await ChatbotController.loadConfig(bot_id);
        if((global.appChatbotEngineConfig == null) || (global.appChatbotEngineConfig.length == 0)) res.sendStatus(403);
        if (
            req.query['hub.mode'] === 'subscribe' &&
            req.query['hub.verify_token'] === global.appChatbotEngineConfig[bot_id].validationToken
        ) {
            res.send(req.query['hub.challenge']);
        } else {
            //console.error('Failed validation. Make sure the validation tokens match.');
            res.sendStatus(403);
        }
    }


    //this function is to handle post method when user inbox chatbot
    static  messageWebhook(req, res) {
		let bot_id = req.params.bot_id;
		if(Common.isset(req.params.bot_id) != null) bot_id = req.params.bot_id;
		
        if(Common.isset(global.appChatbotEngineConfig[bot_id]) != null) {
			ChatbotController.query(req, res, bot_id);
		} else {
			ChatbotController.loadConfig(bot_id).then(result => {
				ChatbotController.query(req, res, bot_id);
			});
		}

    }
	
	static  query(req, res, bot_id) {
		if(Common.isset(global.appClient) == null)  return;
		if(Common.isset(global.appClient[bot_id]) == null) { res.status(200).end(); return; }

		
		var client = global.appClient[bot_id];
        const event = req.body.entry[0].messaging[0];
        const userId = event.sender.id;

        if (req.body.object === 'page') {
            req.body.entry.forEach(entry => {
                entry.messaging.forEach(event => {
                    if (event.message && event.message.text) {

                        const {
                            recipient,
                            sender,
                            timestamp,
                            message
                        } = event;

                        if (sender.id) {
                            let data = {
                                time: timestamp,
                                who: 'guest',
                                message: message.text
                            };

                            let content = {
                                type: 'messager',
                                uid: sender.id,
                                data: data
                            };
							
							global.appFBChatbotEngine.query(res,client, userId, event.message.text, content, bot_id);
							
                        }
             					
                    } 
                });
            });
        }
	}
	
	//this function is to handle post method when user inbox chatbot
    static testMessage(req, res) {
		let bot_id = req.params.bot_id;
		let query_string = "hello";
		if(Common.isset(req.params.bot_id) != null) bot_id = req.params.bot_id;
		
		
		if(Common.isset(req.query.query_string) != null) query_string = req.query.query_string;
		global.appFBChatbotEngine.setTesting(true);
		
		
		let data = {
			time: null,
			who: 'guest',
			message: query_string
		};

		let content = {
			type: 'messager',
			uid: "botsail",
			data: data
		};
		let userId = "botsail";
		
		if(Common.isset(global.appChatbotEngineConfig[bot_id]) != null) {
			let client = global.appClient[bot_id];
			global.appFBChatbotEngine.query(res,client, userId, query_string, content, bot_id);
		} else {
			ChatbotController.loadConfig().then(result => {
				let client = global.appClient[bot_id];
				global.appFBChatbotEngine.query(res,client, userId, query_string, content, bot_id);
			});
		}
		
		

    }
	
	static async testCallback(req, res) {
		Controller.prototype.setResponse(req, res);
		ChatbotController.callCom(function (data) {
			console.dir(data);
			Controller.prototype.sendMessage("success");
		});
	}
	
	static async callCom(callback) {
		let result = await ChatbotController.getCom();
		callback(result);
	}
	
	static async getCom() {
		return new Promise((resolve, reject)=>{
			FBConnectSchema.findOne({"name": "fbsbot"})
                .then(data=>{
                    if(data){
						resolve(data);
                    }else{
                        reject(null);
                    }
                })
		});
	}
	
    
}

module.exports = ChatbotController;