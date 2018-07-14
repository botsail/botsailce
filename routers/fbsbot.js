const fbCrtl = require(global.appRoot +'/packages/fbsbot/controllers/bfsconfigctrl');
const chatbot = require(global.appRoot + '/packages/fbsbot/controllers/chatbotCtrl');
const chatbotMsg = require(global.appRoot + '/packages/fbsbot/controllers/chatbotMsgCtrl');
const broadCase = require(global.appRoot + '/packages/fbsbot/controllers/broadCase');
const tag = require(global.appRoot + '/packages/fbsbot/controllers/tagCtrl');

module.exports = function (app, passport) {
	
	app.get('/fbsbot/testCallback', fbCrtl.verifyAuth, chatbot.testCallback);
	app.get('/fbsbot/testMessage/:bot_id', fbCrtl.verifyAuth, chatbot.testMessage);
	app.get('/fbsbot/fbconfig', fbCrtl.verifyAuth, fbCrtl.fbconfig);
	app.post('/fbsbot/fbconfig', fbCrtl.verifyAuth, fbCrtl.fbconfigData);
	app.get('/fbsbot/webhook/:bot_id',  chatbot.verifycation);
    app.post('/fbsbot/webhook/:bot_id', chatbot.messageWebhook);

    //handle chatbot messnger
    app.get('/fbsbot/chatbotMsg', fbCrtl.verifyAuth, chatbotMsg.renderView);
    app.post('/fbsbot/getAllLastMsg', fbCrtl.verifyAuth, chatbotMsg.getAllLastMsg);
    app.post('/fbsbot/getDataOneUser', fbCrtl.verifyAuth, chatbotMsg.getDataOneUser);

    //handle broadcase route
    app.get('/fbsbot/broadcase', fbCrtl.verifyAuth, broadCase.renderView);
    app.post('/fbsbot/addBroadcase', fbCrtl.verifyAuth, broadCase.addBroadcaseData);
    app.post('/fbsbot/getBroadcaseData', fbCrtl.verifyAuth, broadCase.getBroadcaseData);
    app.post('/fbsbot/getFullnameUser', fbCrtl.verifyAuth, broadCase.getFullnameUser);

    //handle tag route
    app.get('/fbsbot/tags_list', fbCrtl.verifyAuth, tag.renderTagList);
    app.get('/fbsbot/input_tag', fbCrtl.verifyAuth, tag.renderInputtagView);
    app.get('/fbsbot/edit_tag/:tagName', fbCrtl.verifyAuth, tag.renderEdittagView);
    app.get('/fbsbot/getTagsList', fbCrtl.verifyAuth, tag.getTagsList);
    app.get('/fbsbot/getAllUser', fbCrtl.verifyAuth, tag.getAllUser);
    app.post('/fbsbot/getAllUsersByTagname', fbCrtl.verifyAuth, tag.getAllUsersByTagname);
    app.post('/fbsbot/removeTag', fbCrtl.verifyAuth, tag.removeTag);
    app.post('/fbsbot/removeUserTag', fbCrtl.verifyAuth, tag.removeUserTag);
    app.post('/fbsbot/updateTagName', fbCrtl.verifyAuth, tag.updateTagName);
    app.post('/fbsbot/addTagToUsers', fbCrtl.verifyAuth, tag.addTagToUsers);    
}