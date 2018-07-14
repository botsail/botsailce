var mongoose = require('mongoose');

//define schema
var contentSchema = mongoose.Schema({
	bot_id: mongoose.Schema.Types.ObjectId,
	datatype: { type : String , "default" : "content" },
	user_say: String,
	pattern: { type : String , "default" : "no" },
	query: { type : String , "default" : "" },
	answer: { type : Array , "default" : [] },
	lang: { type : String , "default" : "en" },
	updatetime: Number,
	value: { type : [String] , "default" : "[]" }
});

//create model
module.exports = mongoose.model('contents', contentSchema, 'contents');