var fs = require('fs');
var appRoot = require('app-root-path');
var plugin_root_path = appRoot + '/app/plugins/';
var User            = require(appRoot + '/app/models/entities/user');

class UserBase {
	
	async getUserFromID(_id) {
		result = await User.find({"_id" : _id});

		return result;
	}

	async getUserFromUserName(UserName) {
		result = await User.find({"_id" : UserName});

		return result;
	}

	async getUserInfo(params) {
		let result = null;
		if(params['_id'] != undefined) 
			result = await User.find({"_id" : params['_id']});
		else if(params['user_name'] != undefined) 
			result = await User.find({"_id" : params['user_name']});
		else if(params['email'] != undefined) 
			result = await User.find({"email" : params['email']}); 

		return result;
	}


}

module.exports = UserBase;