var mongoose = require('mongoose');

var lastMessageSchama = mongoose.Schema({	
    bot_id: mongoose.Schema.Types.ObjectId,
	datatype: { type : String , "default" : "last-message" },
    data:[{
        uid:String,
        data_bot: {
                time:Number,
                message:String
            },
		data_guest: {
                time: { type : Number , "default" : null },
                message:{ type : String , "default" : "" },
            },

    }],
});

module.exports = mongoose.model('lastmessages', lastMessageSchama, 'contents');

							
