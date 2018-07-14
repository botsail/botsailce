var mongoose = require('mongoose');

//define schema
var blockSchema = mongoose.Schema({
	bot_id: mongoose.Schema.Types.ObjectId,
	datatype: { type : String , "default" : "Function" },
	name: String,
	script: { type : String , "default" : "" },
	procedure: { type : String , "default" : "" },
	updatetime: Number,
	
});

//create model
module.exports = mongoose.model('functions', blockSchema, 'contents');