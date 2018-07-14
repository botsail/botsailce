//app/models/user.js
//load the things we need
var mongoose = require('mongoose');

//define the schema for our user model
var botSchema = mongoose.Schema({	
	name: { type: String, default: "bot" },
    bot_name: String,
    description: String,
    image: { type: String, default: "" },
    auth: {type: mongoose.Schema.Types.ObjectId}, 
    manager: [{
        _id : false,
        user_id: { type: mongoose.Schema.Types.ObjectId },
        role: { type: String }
    }],
    user_attribute: [{ 
        _id : false,
        name: { type: String },
        att_id: mongoose.Schema.Types.ObjectId }],
    bot_attribute: [{
        _id : false,
        name: { type: String },
        value: { type: String },
    }],
	ym: String,
	user_public_folder: String
});


//create the model for users and expose it to our app
module.exports = mongoose.model('bot', botSchema, 'metadatas');