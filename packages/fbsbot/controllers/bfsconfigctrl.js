var FBConnectSchema = require(global.appRoot + '/packages/fbsbot/models/entities/package');
var Controller = require(global.appRoot + '/core/controller');
var Common 			= 	require(global.appRoot + "/core/common.js");
var constants = require(global.appRoot + '/config/constants');

class FBSConfigController extends Controller {
	static async fbconfig(req, res) {
		Controller.prototype.setResponse(req, res);
		FBConnectSchema.findOne({ "name": "fbsbot", "datatype" : "package-config", bot_id:  Controller.prototype.getBotID()}, function(err, result) {
			let configData;
			let host = Controller.prototype.getBotID();
			if(Common.isset(constants.host)) host = constants.host+ "/fbsbot/webhook/" + Controller.prototype.getBotID()
			if(Common.isset(result) == null)  {
				configData = {
					webhook: host,
					bot_id: Controller.prototype.getBotID(),
					//pageID: '',
					appID: '',
					appSecret: '',
					validationToken: '',
					pageToken: ''
				}
			} else { 
				configData = result;
				configData["webhook"] = host;
			}

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
		//req.check('pageID','pageID  is require').notEmpty();
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

}

module.exports = FBSConfigController;