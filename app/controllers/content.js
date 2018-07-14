var mongoose = require("mongoose");
var Content            = require('../models/entities/content');
var Controller            = require(global.appRoot + '/core/controller');
var Block            = require('../models/entities/block');
var evalidator = require('express-validator');



class ContentController extends Controller{
	
	static async contentdetail(req, res) {
		let data = {
			id: '',
			user_say: '',
			answer : [''],
		};
		let contentList = await Content.findOne({"datatype" : "content", bot_id: req.session.bot_id});
		let blockList = await Block.find({datatype : "block", bot_id: req.session.bot_id});
		res.render("pages/content.ejs", {bot_id: req.session.bot_id, data: data, contentList: contentList,  answer: [], blockList: blockList});
	}

	static async editdetail(req, res){
		Controller.prototype.setResponse(req, res);
		
		var id = mongoose.Types.ObjectId(req.query.id);
		
		let blockList = await Block.find({datatype : "block", bot_id: req.session.bot_id});

		Content.findOne({_id: id, bot_id: req.session.bot_id}, function(err, data){
			if(err){
				Controller.prototype.sendErrorMessage("error" + err);
			}else{
				

				res.render("pages/content.ejs", {data: data, blockList: blockList});
			}
		})
	}

	//return the Content to client to edit
	static edit(req, res){
		var id = mongoose.Types.ObjectId(req.body.id);
		Content.findOne({_id: id, bot_id: req.session.bot_id}, function(err, found){
			if(err){
				Controller.prototype.sendErrorMessage("error" + err);
			}else{
				Controller.prototype.sendMessageData("success",found);
			}
		})
	}


	//Process database
	static save(req, res){  //save 
		Controller.prototype.setResponse(req, res);
		
		var answer = [];
		var content = req.body;
		
		//Validation
		req.params = content;
		req.check('user_say','User says  is require').notEmpty();

 		var errors = req.validationErrors();
		
		if(content.answer.length == 0) {
			let err =	{
				location : "params",
				msg : "Please add user answer data",
				param : "user-answer",
				value : null
			}
			
		}

 		if(errors != false) {
 			Controller.prototype.sendError(errors);
 			return;
		 }
		
		
		let query = content.user_say;
		if(content.pattern == 'no') {
			query = '(' + query.replace(/,/g , "|") + ')';
		}
		var data = Content ({
							bot_id: req.session.bot_id,
							user_say: content.user_say ,
							query: query,
							pattern: content.pattern,
							answer: content.answer,
							updatetime: Date.now()}
						);

		//if req.body.id has id. We will update else we will create a new one
		if(content.id == "" || content.id == null){
			data.save(function(err, result){
				if(err){
					Controller.prototype.sendErrorMessage("error" + err);
				}else

					Controller.prototype.sendMessage("success");
			});
		}else{
			var id = mongoose.Types.ObjectId(content.id);
			Content.findOne({_id: id, bot_id: req.session.bot_id}, function(err, found){
				if(err){
					res.send("error");
				}else{
					found.query = data.query;
					found.user_say = data.user_say;
					found.pattern = data.pattern;
					found.answer = data.answer;
					found.updatetime= Date.now()
					found.save(function(err){
						if(err){
							Controller.prototype.sendErrorMessage("error" + err);
						}else{
							Controller.prototype.sendMessage("success");
						}
					})
					
				}
			});
		}
	}

	//return the Content having the topic = req.body.topic
	static show(req, res){ 
		Controller.prototype.setResponse(req, res);
		Content.find({bot_id: req.session.bot_id, datatype: "content"}, function(err, found){
			if(err){
				Controller.prototype.sendErrorMessage("error" + err);
			}else{
				Controller.prototype.sendMessageData("success",found);
			}
		});
		return res;
	}


	//delete the tuple having same id
	static delete(req, res){
		Controller.prototype.setResponse(req, res);

		var id = mongoose.Types.ObjectId(req.body.id);
		Content.remove({_id: id, bot_id: req.session.bot_id}, function(err){
			if(err){
				Controller.prototype.sendErrorMessage("error" + err);
			}else{
				Controller.prototype.sendMessage("success");
			}
		});

	}


	
}

module.exports = ContentController;