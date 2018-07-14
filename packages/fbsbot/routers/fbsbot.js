const fbCrtl = require(global.appRoot +'/packages/fbsbot/bfsconfigctrl');
const chatbot = require(global.appRoot + '/packages/fbsbot/controllers/chatbotCtrl');
const chatbotMsg = require(global.appRoot + '/packages/fbsbot/controllers/chatbotMsgCtrl');
const broadCase = require(global.appRoot + '/packages/fbsbot/controllers/broadCase');
const tag = require(global.appRoot + '/packages/fbsbot/controllers/tagCtrl');

module.exports = function (app, passport) {
	
	app.get('/fbsbot/fbconfig', fbCrtl.fbconfig);
	app.post('/fbsbot/fbconfig', fbCrtl.fbconfigData);
	app.get('/fbsbot/webhook', fbChatbot.verifycation);
    app.post('/fbsbot/webhook', fbChatbot.messageWebhook);

    //handle chatbot messnger
    app.get('/fbsbot/chatbotMsg', chatbotMsg.renderView);
    app.post('/fbsbot/getAllLastMsg', chatbotMsg.getAllLastMsg);
    app.post('/fbsbot/getDataOneUser', chatbotMsg.getDataOneUser);

    //handle broadcase route
    app.get('/fbsbot/broadcase', broadCase.renderView);
    app.post('/fbsbot/addBroadcase', broadCase.addBroadcaseData);
    app.post('/fbsbot/getBroadcaseData', broadCase.getBroadcaseData);
    app.post('/fbsbot/getFullnameUser', broadCase.getFullnameUser);

    //handle tag route
    app.get('/fbsbot/tags_list', tag.renderTagList);
    app.get('/fbsbot/input_tag', tag.renderInputtagView);
    app.get('/fbsbot/edit_tag/:tagName', tag.renderEdittagView);
    app.get('/fbsbot/getTagsList', tag.getTagsList);
    app.get('/fbsbot/getAllUser', tag.getAllUser);
    app.post('/fbsbot/getAllUsersByTagname', tag.getAllUsersByTagname);
    app.post('/fbsbot/removeTag', tag.removeTag);
    app.post('/fbsbot/removeUserTag', tag.removeUserTag);
    app.post('/fbsbot/updateTagName', tag.updateTagName);
    app.post('/fbsbot/addTagToUsers', tag.addTagToUsers);    
}