var mongoose = require('mongoose');

var tagConfigSchema = mongoose.Schema({
    datatype: { type : String , "default" : "package-config" },
	name: { type: String, default: "fbsbot" },
	bot_id: mongoose.Schema.Types.ObjectId,
	//pageID: String,
	appID: String,
	appSecret: String,
	validationToken: String,
	pageToken: String,
	tags: [String],
});


const TagConfig = mongoose.model('tagConfig', tagConfigSchema, 'metadatas');

module.exports = TagConfig;