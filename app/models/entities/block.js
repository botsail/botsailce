var mongoose = require('mongoose');

//define schema
var blockSchema = mongoose.Schema({
	datatype: { type : String , "default" : "block" },
	name: String,
	query: { type : String , "default" : "" },
	bot_id: mongoose.Schema.Types.ObjectId,
	value: { type : Array , "default" : [] },
	lang: { type : String , "default" : "en" },
	updatetime: Number,
	
});

//create model
module.exports = mongoose.model('blocks', blockSchema, 'contents');