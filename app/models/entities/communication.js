var mongoose = require('mongoose');

var communicationSchama = mongoose.Schema({	
    type:{type:String, default:'messager'},
	bot_id: mongoose.Schema.Types.ObjectId,
    uid:String,
    fullname:String,
    gender:String,
    data: [{
        time:Number,
        who:String,//guest, bot
        message:String
    }],
    tag:[String]
});


module.exports = mongoose.model('communications', communicationSchama, 'communications');

//module.exports = Communication;

							
