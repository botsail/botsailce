var Controller    = require(global.appRoot + '/core/controller');

const Communication = require(global.appRoot + '/app/models/entities/communication');
const LastMsg = require(global.appRoot + '/packages/fbsbot/models/entities/configsChatbot');

class ChatbotMsgController extends Controller{

    static renderView(req, res){
        console.log('started');
        res.render(global.appRoot + '/packages/fbsbot/views/msgChatbot.ejs');
    }

    static getAllLastMsg(req, res){
        LastMsg.find({name: 'last-message'})
        .then(success => {
            if(success) {
                res.send({success: true, data: success[0].data});
            } 
            else res.send({success: false, data: null});
        })
        .catch(err => {
            console.log('err')
            console.log(err.message);
            res.send({success: false, data: null});
        })  
    }

    static getDataOneUser(req, res){
        Communication.findById(req.body._id)
        .then(success => {
            if(success) return res.send({success: true, data: success});
            res.send({success: false, data: null});
        })
        .catch(err => {
            console.log(err.message);
            res.send({success: false, data: null});
        })
    }

}

module.exports = ChatbotMsgController
