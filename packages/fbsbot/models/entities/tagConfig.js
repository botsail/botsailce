var mongoose = require('mongoose');

var tagConfigSchema = mongoose.Schema({
    name:{ type:String, default:'tag' },
    data:[String],
    system:{ type:String, default:'core' },
    content:{ type:String, default:'tag' }
});


const TagConfig = mongoose.model('tagConfig', tagConfigSchema, 'tagConfig');

module.exports = TagConfig;