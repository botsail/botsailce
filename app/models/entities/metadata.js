//app/models/user.js
//load the things we need
var mongoose = require('mongoose');

//define the schema for our user model
var metadataSchema = mongoose.Schema({	
	bot_id: mongoose.Schema.Types.ObjectId,
	name: String,
	system: String,
	content: String,
	data: { type : Array , "default" : [] },
});


//create the model for users and expose it to our app
module.exports = mongoose.model('metadatas', metadataSchema, 'metadatas');