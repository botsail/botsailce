
var mongoose = require('mongoose');

//define the schema for our menu json model
var configMenuJsonSchema = mongoose.Schema({	
	name: { type: String, default: 'system-menu' },
	data: [{
    id:{ type: Number },
    level:{ type: String },
    name:{ type: String },
    url:{ type: String },
    parent_id:{ type: Number },
    css_class:{ type: String },
    authenticate:{ type: Boolean }
  }],
  system: { type : String, default: 'core' },
	content: { type: String, default: 'system-menu' }
});

//create the model for menu json
const ConfigMenuJson = mongoose.model('configMenuJson', configMenuJsonSchema, 'metadatas');

module.exports = ConfigMenuJson;
