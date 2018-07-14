//app/models/user.js
//load the things we need
var mongoose = require('mongoose');

//define the schema for our user model
var pluginSchema = mongoose.Schema({	
	name: String,
	type: String,
	image: String,
	description: String,
	version: String,
    auth_email: String,
	email: String,
	version_code: String,
	version_label: String,
	plugin_code: String,
	plugin_name: String,
	package_folder: String,
	action: String,
	config: Object,
	data: Array,
	install_time: String,
	status: String,
});

//create the model for users and expose it to our app
module.exports = mongoose.model('packages', pluginSchema, 'packages');