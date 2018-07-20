// Auth: Nospk Tran
// user attribute

const mongoose = require('mongoose');
const userAttributeSchema = mongoose.Schema({
	bot_id: mongoose.Schema.Types.ObjectId,
	name: String,
	datatype: { type : String , "default" : "UserAttribute" },
	attribute_name: String,
	data: { type : Array , "default" : [] },
	script: { type : String , "default" : "" },
	trigger: { type : String , "default" : "" },
});

module.exports = mongoose.model('userAttribute', userAttributeSchema, 'contents');