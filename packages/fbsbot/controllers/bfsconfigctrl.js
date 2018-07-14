var FBConnectSchema = require(global.appRoot + '/packages/fbsbot/models/entities/package');
var Controller = require(global.appRoot + '/core/controller');
var Common 			= 	require(global.appRoot + "/core/common.js");

class FBSConfigController extends Controller {
	static async fbconfig(req, res) {
		Controller.prototype.setResponse(req, res);
		FBConnectSchema.findOne({ "name": "fbsbot", "datatype" : "package-config", bot_id:  Controller.prototype.getBotID()}, function(err, result) {
			let configData;
			if(Common.isset(result) == null)  {
				configData = {
					bot_id: Controller.prototype.getBotID(),
					pageID: '',
					appID: '',
					appSecret: '',
					validationToken: '',
					pageToken: ''
				}
			} else configData = result;

	        let viewsPath = global.appRoot + '/packages/fbsbot/views/fbconfig.ejs';
			
	        res.render(viewsPath, {
								configData: configData
							 });
	    });
	}
	
	//Process database
	static fbconfigData(req, res){  //save 
		Controller.prototype.setResponse(req, res);
		
		var fbconfig = req.body;
		
		//Validation
		req.params = fbconfig;
		req.check('pageID','pageID  is require').notEmpty();
		req.check('appID','appID  is require').notEmpty();
		req.check('appSecret','appSecret  is require').notEmpty();
		req.check('validationToken','validationToken  is require').notEmpty();
		req.check('pageToken','pageToken  is require').notEmpty();

 		var errors = req.validationErrors();

 		if(errors != false) {
 			Controller.prototype.sendError(errors);
 			return;
		}
		
		//if req.body.id has id. We will update else we will create a new one
		if(fbconfig.id == "" || fbconfig.id == null){
			var data = FBConnectSchema ({
							"bot_id": Controller.prototype.getBotID(),
							"pageID": req.body.pageID,
							"appID": req.body.appID,
							"appSecret": req.body.appSecret,
							"validationToken": req.body.validationToken,
							"pageToken": req.body.pageToken}
						);
			data.save(function(err, result){
				if(err){
					Controller.prototype.sendErrorMessage("error" + err);
				}else

					Controller.prototype.sendMessage("success");
			});
		}else{
			FBConnectSchema.findOne({_id: fbconfig.id, bot_id: req.session.bot_id}, function(err, found){
				if(err){
					res.send("error");
				}else{
					found.pageID = req.body.pageID;
					found.appID = req.body.appID;
					found.appSecret = req.body.appSecret;
					found.validationToken = req.body.validationToken;
					found.pageToken = req.body.pageToken;
					
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
/*
	static fbconfigData(req, res) {
		
		//var validate = this.validation(this.req.body);
		var validate = { result : 1 };
		if(validate.result == 1) {
			var configObj = {
				"bot_id": Controller.prototype.getBotID(),
				"pageID": req.body.pageID,
				"appID": req.body.appID,
				"appSecret": req.body.appSecret,
				"validationToken": req.body.validationToken,
				"pageToken": req.body.pageToken
			}

			FBConnectSchema.findOneAndUpdate(
			    { "package_name": "fbsbot"},
			    { 
			        "$set": {
			            "config": configObj
			        }
			    },
			    function(err,doc) {
			    	let json = {
						message: "Update successfull!",
						status: 1
					}

					if(err != null) {
						json.message = "Update faild!";
						json.status = -1;
					}

					Plugin.prototype.returnJson(res, json);
					return;
			    }
			);

		} else {
			Plugin.prototype.returnJson(res, validate);
		}
	}*/
}

module.exports = FBSConfigController;