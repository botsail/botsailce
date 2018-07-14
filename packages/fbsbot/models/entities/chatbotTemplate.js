
var mongoose = require('mongoose');

var chatbotTemplateSchema = mongoose.Schema({
    button_label: [String],
    button_url: [String],
    name: {
        type: String
    },
    title: {
        type: String
    },
    subtitle: {
        type: String
    }
});


const ChatbotTemplate = mongoose.model('chatbotTemplate', chatbotTemplateSchema, 'chatbotTemplate');

module.exports = ChatbotTemplate;