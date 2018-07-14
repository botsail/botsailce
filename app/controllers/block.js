var Controller            = require(global.appRoot + '/core/controller');
var Block            = require('../models/entities/block');
var Common = require(global.appRoot + "/core/common.js");
const UserAttributes = require('../models/entities/userattribute');
var evalidator = require('express-validator');

class BlockController extends Controller {

	static async showBlock(req, res) {

		let id = "";
		let name = "";
		let block = null;
		if(Common.isset(req.query.id) != null) {
			block = await Block.findOne({datatype : "block", _id : req.query.id, bot_id: req.session.bot_id});
		}

		let blockList = await Block.find({datatype : "block", bot_id: req.session.bot_id});
		let attrList = await UserAttributes.find({datatype : "UserAttribute", bot_id: req.session.bot_id});

		res.render("pages/block.ejs", {blockList: blockList, attrList: attrList, block: block, id: id, name: name});
	}

	static createErrorData(err_msg,param, value) {
		let err =	{
				location : "params",
				msg : err_msg,
				param : param,
				value : value
			}

		return err;
	}

	static verifyButton(button) {
		let length = button.length;
		let errList = [];
		let err = null;
		for(let i = 0; i < length; i++) {
			err = null;
			if(button[i].type == "url") {
				if((Common.isset(button[i].title) == null) || (button[i].title == "")) {
					err = BlockController.createErrorData("Title is require", button[i].title_id, "");
					if(err != null) errList.push(err);
					err = null;
				} 

				if((Common.isset(button[i].url) == null) || (button[i].title == "")) {
					err = BlockController.createErrorData("URL is require", button[i].url_id, "");
					if(err != null) errList.push(err);
					err = null;
				} 

			} else if(button[i].type == "block") {
				if(Common.isset(button[i].block_id) == null)  {
					err = BlockController.createErrorData("Block is require", button[i].block_id, "");
					if(err != null) errList.push(err);
					err = null;
				} 
			}
		}

		return errList;

	}

	static verifyInputData(data) {
		let length = data.length;
		let errList = [];
		let err = null;
		for(let i = 0; i < length; i++) {
			err = null;
			if(data[i].type == "text") {
				if(data[i].content.length <=0) { 
					err = BlockController.createErrorData("Content is require", data[i].id_name, data[i].content);
					if(err != null) errList.push(err);
					err = null;
				}
			} else if(data[i].type == "image") {
				if(data[i].title.length <=0) { 
					err = BlockController.createErrorData("Title is require", data[i].image_title_id, data[i].title);
					if(err != null) errList.push(err);
					err = null;
				}
			} else if(data[i].type == "request") {
				if(data[i].url.length <=0) { 
					err = BlockController.createErrorData("URL is require", data[i].id_name, data[i].url);
					if(err != null) errList.push(err);
					err = null;
				} else if(Common.checkIsValidDomain(data[i].url) == null) {
					err = BlockController.createErrorData("Please input with url format", data[i].id_name, data[i].url);
					if(err != null) errList.push(err);
					err = null;
				}
			} else if(data[i].type == "jsscript") {
				if(data[i].jsscript.length <=0) { 
					err = BlockController.createErrorData("Script is require", data[i].id_name, data[i].jsscript);
					if(err != null) errList.push(err);
					err = null;
				}
			}


			if((Common.isset(data[i].button) != null) && (data[i].button.length > 0)) {
				err = BlockController.verifyButton(data[i].button);
				if(err.length > 0) errList.push(err);
				err = null;
				}
		}

		return errList;

	}

	static async saveBlock(req, res) {
		Controller.prototype.setResponse(req, res);

		let id = req.body.id;
		let name = req.body.name;
		let blockValue = req.body.value;
		let errorsList = [];
		let nameErr = null;
		//verify data
		if(name == "") {
			nameErr = BlockController.createErrorData("Block name  is require", 'name', "");
		}

		if(Common.isset(blockValue) == null) {
			errorsList = BlockController.createErrorData("Please input data", 'blocks', "");
			if(nameErr != null) errorsList.push(nameErr);
			Controller.prototype.sendError(errorsList);
 			return;
		}

		
		errorsList = BlockController.verifyInputData(blockValue);
		if(nameErr != null) errorsList.push(nameErr);
		if(errorsList.length > 0) {
 			Controller.prototype.sendError(errorsList);
 			return;
		}

		//save data
		if(id.length == 0) {
			var data = Block ({
							bot_id: req.session.bot_id,
							name: name,
							query: name,
							value: blockValue ,
							updatetime: Date.now()
							}
						);
				data.save(function(err, result){
					if(err){
						Controller.prototype.sendErrorMessage("error" + err);
					} else {
						Controller.prototype.sendMessage("success");
					}
				});
		} else {
			Block.findOne({_id: id}, function(err, found){
				if(err){
					res.send("error");
				}else{
					found.name = name;
					found.query = name,
					found.value = blockValue ;
					found.updatetime= Date.now();
					found.save(function(err){
						if(err){
							Controller.prototype.sendErrorMessage("error" + err);
						}else{
							Controller.prototype.sendMessage("success");
						}
					});
					
				}
			});
		}
	}
}

module.exports = BlockController;