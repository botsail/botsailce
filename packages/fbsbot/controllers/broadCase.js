var Controller = require(global.appRoot + '/core/controller');

const Chatbot = require(global.appRoot + '/packages/fbsbot/models/services/chatbot.service');

var commonCore = require(global.appRoot + '/core/common');

var Broadcase = require(global.appRoot + '/packages/fbsbot/models/entities/configsBroadcase');

var Communication = require(global.appRoot + '/app/models/entities/communication');

var chatbotCtrl = require(global.appRoot + '/packages/fbsbot/controllers/chatbotCtrl');

var pageAccessToken = 'EAAbDiy3KJSkBAJqApRqIbSvJ1kr3EaIZCJrkZB6uczpDJKyZB6QQT5kx7DbjJ6pQZCvro76xNhvUXzRMVH8V1Gwv3dSKFoBW8acOv3bUBsPD7byn0zoIZCBn3Rh7dvD1qtamUZBnCRmZAfbto3EZAg887GgPJQTI3YXl7Ti3EInRVQZDZD';

var { MessengerClient } = require('messaging-api-messenger');
var client = MessengerClient.connect(pageAccessToken);

class BroadcaseController extends Controller {

  static renderView(req, res){
    console.log('broadcase started');
    res.render(global.appRoot + '/packages/fbsbot/views/broadCase');
  }

  static getBroadcaseData(req, res){
    Broadcase.findOne({name:'facebook-broadcase'})
    .then(success => {
      if(success){
        res.send({success: true, data: success.data});
      }
      res.send({success: false, data: null});
    })
    .catch(err => {
      res.send({success: false, data: null});
    })
  }

  static addBroadcaseData(req, res){
    let { broadCase } = req.body;

    Broadcase.findOneAndUpdate({name: 'facebook-broadcase'}, {$push: {data: broadCase}})
    .then(success => {
      if(success){
        res.send({success: true})
      } else{

        let newBroadcase = new Broadcase({
          data: [broadCase],
        })

        newBroadcase.save().then(success => {
          res.send({success: true});
        })
        .catch(err => {
          res.send({success: false});
        })
      }
      broadCase.member.forEach(uid => {
        chatbotCtrl.sendTextToUser(client, uid, broadCase.content);
      })
      
    Chatbot.saveMsgBotSendToUser(broadCase.member, broadCase.content);
    })
    .catch(err => {
      res.send({success: false});
    })
  }

  static async getFullnameUser(req, res){
    const { uidArr } = req.body;
   
    await Promise.all(uidArr.map(item => Communication.findOne({uid: item})))
    .then(value => {
      let usernameArr = value.map(user => user.fullname);
      res.send({success: true, data: usernameArr});
    })
    .catch(err => console.log(err.message));

  }

}

module.exports = BroadcaseController;