// Save trong [configs].data[]
// mỗi lần broadcase sẽ lưu vào array của configs
var mongoose = require('mongoose');

var broadcaseSchama = mongoose.Schema({	
    name:{type:String, default:'facebook-broadcase'},
    data:[{
        _id: mongoose.Schema.Types.ObjectId,
        title:String,
        description:String,
        content:String,
        member:[String],
    }],
    system : {type: String, default: 'core'},
    content:{type:String, default: 'facebook-broadcase'}
});


const Broadcase = mongoose.model('broadcase', broadcaseSchama, 'communications');

module.exports = Broadcase;