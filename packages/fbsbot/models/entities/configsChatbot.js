var mongoose = require('mongoose');

var configChatSchama = mongoose.Schema({	
    name:{type:String, default:'last-message'},
    data:[{
        _id: mongoose.Schema.Types.ObjectId,
        type: {type:String, default: 'messager'},
        uid:String,
        fullname:String,
        gender:String,
        data:[ //just 2 elements
            {
                time:Number,
                who:String,
                message:String
            }
        ]
    }],
    system : {type: String, default: 'core'},
    content:{type:String, default: 'last-message'}
});


const ConfigChat = mongoose.model('configsChatbot', configChatSchama, 'metadatas');

module.exports = ConfigChat;

							
