var Controller            = require(global.appRoot + '/core/controller');
var Bot = require('../models/entities/bot');
var Communication = require('../models/entities/communication');
var Content            = require('../models/entities/content');
var ObjectId = require('mongodb').ObjectID;
var Backup = require('mongodb-backup');
var urldb = require('../../config/database');
var User = require('../models/entities/user');
var fs = require('fs');
var fse = require('fs-extra');
var Common = require(global.appRoot + "/core/common.js");
var dateFormat = require('dateformat');
const Cookie = require('cookie');
var Metadata            = require('../models/entities/metadata');

class BotController extends Controller {
	

	//Home page
	static async listBot(req, res) {
		Controller.prototype.setResponse(req, res);
		
		let dataget;
		let active_bot_id = Controller.prototype.getBotID();
		
		if((Common.isset(req.user) == null)  || (Common.isset(req.user._id) == null)) res.redirect('/login');

		//Find data in collection packages
		Bot.find({name: "bot", "manager.user_id" : req.user._id}, (err,found) => {
			res.render('pages/bot_list', {data:found, active_bot_id: active_bot_id});
		})
	}

	//Edit Page
	static async editBot(req, res) {
		const id = req.params.id;

		Bot.findOne({_id: id, "manager.user_id" : req.user._id}, (err, data) => {
			res.render('pages/bot_edit.ejs', {data: data});
		})
	}

	static async showeditBot(req, res) {
		const data = {
			id: ''
		};
		res.render('pages/bot_edit.ejs', {data: data});
	}

	static async saveBot(req, res) {
		Controller.prototype.setResponse(req, res);

		console.log(req.body);
		req.params = req.body;
		req.check('topicName','Bot name  is require').notEmpty();
		req.check('topicDes','Description is require').notEmpty();
		var errors = req.validationErrors();

		if(errors != false) {
			Controller.prototype.sendError(errors);
			return;
		}
		
		let id = req.body._id;
		let imageurl = '/uploads/bots/' + req.session.bot_id;
		
		var data = {
			name: 'bot',
			bot_name: req.body.topicName,
			description: req.body.topicDes,
			language: req.body.topicLng,
		}
		if(req.file){
			data.image = imageurl + "/" + req.file.filename;
		}else{
			if(req.body.currentimage == ''){
				data.image = '';
			}else{
				data.image = req.body.currentimage;
			}
		}

		if(id != ''){
			//Update new Bot
			id = new ObjectId(id);
			Bot.findOne({_id: id, "manager.user_id" : req.user._id}, function(err, found){
				if(err) throw err;
				found.bot_name = data.bot_name;
				found.description = data.description;

				if(found.image != data.image){
					let path = global.appRoot + '/public' + found.image;
					//fs.unlinkSync(path);
					Common.removeFile(path);
				}
				
				if(req.file) {
					let srcpath = global.appRoot + '/temps/' + req.file.filename;
					let dstpath = global.appRoot + '/public/uploads/bots/' + req.session.bot_id + "/" + req.file.filename;
					fse.move(srcpath, dstpath);
				}

				found.image = data.image;
				found.save(err => {
					if(err) throw err;
					res.redirect('/bot_list');
				});
			})
		}else{
			
			
			let dataBot = Bot({
				bot_name: data.bot_name,
				description: data.description,
				image: "",
				auth: new ObjectId(req.session.user._id), 
				manager: [{
					_id : false,
					user_id: new ObjectId(req.session.user._id),
					role: "admin"
				}],
				user_attribute: [],
				bot_attribute: [],
				ym : dateFormat(Date.now(), "yyyymm")
			});
			
			dataBot.save(function(err, result){
				if(err){
					Controller.prototype.sendErrorMessage("error" + err);
				}else {
					//create folder
					BotController.createBotFolder(result);
					
					if(req.file) {
						let srcpath = global.appRoot + '/temps/' + req.file.filename;
						let dstpath = global.appRoot + '/public/uploads/bots/' + result.ym + "/" + result.id + "/" + req.file.filename;
						fse.move(srcpath, dstpath);
						result.bot_public_folder = "/uploads/bots/" + result.ym + "/" + result.id;
						result.image = result.bot_public_folder + "/" + req.file.filename;

						result.save(function(err){
							if(err){
								Controller.prototype.sendErrorMessage("error" + err);
								return;
							}else{
								Controller.prototype.sendMessage("success");
								return;
							}
						});
					} else {
						console.log(result);
						Controller.prototype.sendMessage("success");
					}
					
				}

					
			});
			
			
		}
	}

	//Clone Bot 
	static async clonebot(req, res, next){
		Controller.prototype.setResponse(req, res);

		const id = req.body.id;
		let newid = new ObjectId();

		let bot = await FindAndInsert(Bot, newid);
		if(bot == false){
			return false;
		}

		let content = await FindAndInsert(Content, newid);
		if(content == false){
			return false;
		}

		let communication = await FindAndInsert(Communication, newid);
		if(communication == false){
			return false;
		}

		Controller.prototype.sendMessage("success");

		function FindAndInsert(model, newid){
			return new Promise(function(ok, notok){
				model.find({_id: id, "manager.user_id" : req.user._id}, (err, data) => {
					if(err) throw err;
					if(data[0] == null){
						ok();
					}else{
						data = data[0];
						data._id = newid;
						model.insertMany(data, ok());
					}

				})
			})
		}
	}
	//Delete Bot	
	static deletebot(req, res, next) {
		Controller.prototype.setResponse(req, res);

		const id = req.body.id;
		//If image is not use for another Bot => Delete Image
		Bot.find({_id: id, name: "bot", "manager.user_id" : req.user._id}, (err, result) => {
			
			Bot.remove({_id: id, name: "bot", "manager.user_id" : req.user._id}, (err) => {
				Content.remove({_id: id}, (err) => {
					Communication.remove({_id: id}, (err) => {
						if(err){
							Controller.prototype.sendErrorMessage("error" + err);
						}else{
							let path = global.appRoot + "/public/uploads/bots/" + id;
							var rimraf = require('rimraf');
							rimraf.sync(path);
							if(id == Controller.prototype.getBotID()) {
								req.session.bot_id = "";
							}
							//Controller.prototype.sendMessage("success");
							res.send(200);
						}
					})
				})
			})
			
		})

	}
	//Export Bot
	static exportbot(req, res, next) {
		Controller.prototype.setResponse(req, res);

		let id = req.body.id;
		id = new ObjectId(id);
		let choice = req.body.choice;
		let url = urldb.url;
		let namedb = url.slice(url.lastIndexOf('/')+1);
		let namefile = namedb + '.tar';

		// Choice is Yes will export collection communications too
		if(choice == 'yes'){
			Backup({
				uri: url,
				root: process.cwd() + '/temps/',
				collections: ['metadatas', 'communications', 'contents'],
				parser: 'json',
				query: {_id: id},
				tar: namefile,
				callback: function(err){
					if(err) throw err;
					Controller.prototype.sendMessageData("success", {namefile: namefile});
				}	
			})
		}else{
			Backup({
				uri: 'mongodb://127.0.0.1:27017/bsf',
				root: process.cwd() + '/temps/',
				collections: ['metadatas', 'contents'],
				parser: 'json',
				query: {_id: id},
				tar: namefile,
				callback: function(err){
					if(err) throw err;
					Controller.prototype.sendMessageData("success", {namefile: namefile});
				}
			})
		}
	}

	static exportbotdownload(req, res, next) {
		var path = process.cwd() + "/temps/" + req.params.filename;
		res.download(path);
	}
	
	static activeBot(req, res) {
		var id = req.query.id
		Bot.findOne({_id: id, name: "bot", "manager.user_id" : req.user._id}, (err,found) => {
			if((found!= undefined) && (found!= null)) {
				//Create bot folder
				req.session.bot_id = id;
				req.session.bot_ym = found.ym;
				BotController.createBotFolder(found);
				
				Metadata.findOne({"content": "system-menu", "system": "core"},function(err,result){
					let myMenu = JSON.stringify([{
							"id" : "10",
							"level" : "system-menu",
							"name" : "Home",
							"url" : "/home",
							"parent_id" : "-1",
							"css_class" : "fa fa-area-chart",
							"authenticate" : true,
							"plugin" : "system"		
						}]);
					
					if((Common.isset(result) != null) && (Common.isset(result.data) != null)) myMenu = JSON.stringify(result.data);
					
					
					res.setHeader('Set-Cookie', [      
						Cookie.serialize('menu', myMenu, {
						maxAge: 24 * 60 * 60 * 1000,
						path: '/'
					  })
					]);
					
					res.send(result.data);	
				});
				
			} 
		})
	}
	
	static createBotFolder(bot) {
		try {
			if (!fs.existsSync(global.appRoot + "/public/uploads/")) {
					fs.mkdirSync(global.appRoot + "/public/uploads/");
				}
				
			if (!fs.existsSync(global.appRoot + "/public/uploads/bots/")) {
					fs.mkdirSync(global.appRoot + "/public/uploads/bots/");
				}
				
			if (!fs.existsSync(global.appRoot + "/public/uploads/bots/" + bot.ym)) {
					fs.mkdirSync(global.appRoot + "/public/uploads/bots/" + bot.ym);
				}

				let bot_public_folder = "/public/uploads/bots/" + bot.ym + "/" + bot.id;
				//Crate folder for temp
				if (!fs.existsSync(global.appRoot + "/" + bot_public_folder)) {
					fs.mkdirSync(global.appRoot + "/" + bot_public_folder);
				}
		} catch (ex) {
			console.log("can't create bot folder: " + bot.id);
			console.log("Err: " + ex);
		}
	}
}

module.exports = BotController;