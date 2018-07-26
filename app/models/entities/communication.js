var mongoose = require('mongoose');

var communicationSchama = mongoose.Schema({	
    type:{type:String, default:'messager'},
	bot_id: mongoose.Schema.Types.ObjectId,
    uid:String,
    fullname:String,
    gender:String,
    data: [{
        time:Date,
        who:String,//guest, bot
        message:String
    }],
	last_message: String,
	last_time_message: Date,
    tags:[String]
});


module.exports = mongoose.model('communications', communicationSchama, 'communications');

//module.exports = Communication;

							
