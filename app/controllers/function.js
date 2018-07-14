var Controller            = require(global.appRoot + '/core/controller');
var UserAttribute            = require('../models/entities/userattribute');
var Func            = require('../models/entities/function');
var Common = require(global.appRoot + "/core/common.js");
var evalidator = require('express-validator');


class FunctionController extends Controller {
	//Home page
	static async showFunctionList(req, res) {

		let id = "";
		let name = "";
		let func = null;
		let functionList = null;
		let datatype = "Function";
		let script = "";
		
		if((Common.isset(req.query.type ) != null) && (req.query.type == "Trigger")) datatype = "UserAttribute";
		else datatype = "Function";
		
		if(Common.isset(req.query.type) == null) {
			res.redirect('/show_fnc?type=Function');
			return;
		} 
		
		if(datatype == "UserAttribute") {
			if(Common.isset(req.query.id) != null) {
				func = await UserAttribute.findOne({datatype : datatype, _id : req.query.id, bot_id: req.session.bot_id});
			}
			
			functionList = await UserAttribute.find({datatype : datatype, bot_id: req.session.bot_id});
		} else {
			if(Common.isset(req.query.id) != null) {
				func = await Func.findOne({datatype : datatype, _id : req.query.id, bot_id: req.session.bot_id});
			}
			
			functionList = await Func.find({datatype : datatype, bot_id: req.session.bot_id});
		}
		
		if(func != null) {
			id = func.id;
			name = func.name;
			script = func.script;
			
			if(datatype == "UserAttribute") name = func.attribute_name;
		}
		
		

		res.render("pages/function.ejs", {functionList: functionList, func: func, id: id, name: name, script: script, type_name: req.query.type});
	}
	
	static async save(req, res) {
		Controller.prototype.setResponse(req, res);
				
		var data = req.body;
		
		//Validation
		req.params = data;
		req.check('name','Name is require').notEmpty();
		req.check('script','Script is require').notEmpty();
		
		var errors = req.validationErrors();

 		if(errors != false) {
 			Controller.prototype.sendError(errors);
 			return;
		}
		 
		if(data.id == "") {
			FunctionController.addNewFnc(data);
		} else {
			FunctionController.editFnc(data);
		}
	}
	
	static addNewFnc(data) {
		if(data.type_name == "Trigger") {
			UserAttribute.findOne({_id: data.id, bot_id: Controller.prototype.getBotID()}, function(err, found){
				if(err){
					res.send("error");
				}else{
					found.script = data.script;
					found.updatetime= Date.now();
					found.save(function(err){
						if(err){
							Controller.prototype.sendErrorMessage("error" + err);
						}else{
							Controller.prototype.sendMessage("success");
						}
					})
					
				}
			});
		} else if(data.type_name == "Function") {
			let dataFnc = Func ({
							bot_id: Controller.prototype.getBotID(),
							name: data.name ,
							script: data.script,
							fnc : "",
							updatetime: Date.now()}
						);
						
			dataFnc.save(function(err, result){
				if(err){
					Controller.prototype.sendErrorMessage("error" + err);
				}else

					Controller.prototype.sendMessage("success");
			});
		}
	}
	
	static  editFnc(data) {
		if(data.type_name == "Trigger") {
			UserAttribute.findOne({_id: data.id, bot_id: Controller.prototype.getBotID()}, function(err, found){
				if(err){
					res.send("error");
				}else{
					found.script = data.script;
					found.updatetime= Date.now();
					found.save(function(err){
						if(err){
							Controller.prototype.sendErrorMessage("error" + err);
						}else{
							Controller.prototype.sendMessage("success");
						}
					})
					
				}
			});
		} else  if(data.type_name == "Function") {
			Func.findOne({_id: data.id, bot_id: Controller.prototype.getBotID()}, function(err, found){
				if(err){
					res.send("error");
				}else{
					found.script = data.script;
					found.updatetime= Date.now();
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
	
}

module.exports = FunctionController;