var mongoose = require('mongoose');

var lastMessageSchama = mongoose.Schema({	
    bot_id: mongoose.Schema.Types.ObjectId,
	datatype: { type : String , "default" : "messager" },
    last_message: String,
	last_time_message: Date,
    tag:[String]
});

module.exports = mongoose.model('lastmessages', lastMessageSchama, 'communications');

							
