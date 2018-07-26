const Controller = require(global.appRoot + '/core/controller');

const Chatbot = require(global.appRoot + '/packages/fbsbot/models/services/chatbot.service');

const commonCore = require(global.appRoot + '/core/common');

//require model database
const TagConfig = require(global.appRoot + '/packages/fbsbot/models/entities/tagConfig');//tga info
const Communication = require(global.appRoot + '/app/models/entities/communication');//message of user
const ConfigsChatbot = require(global.appRoot + '/packages/fbsbot/models/entities/configsChatbot');//last message

class TagsListController extends Controller {

    static renderTagList(req, res){
      res.render(global.appRoot + '/packages/fbsbot/views/tagPage/tags_list');
    }

    static renderInputtagView(req, res){
       res.render(global.appRoot + '/packages/fbsbot/views/tagPage/input_tag');
    }

    static renderEdittagView(req, res){
      const { tagName } = req.params;
      console.log(tagName);
      res.render(global.appRoot + '/packages/fbsbot/views/tagPage/edit_tag', { tagName });
    }

    static async getAllUsersByTagname(req, res){
      let { tagName } = req.body;
      if(tagName) tagName = tagName.trim();
      console.log('tagname ' + tagName);
      Communication.find({bot_id: req.session.bot_id, tag: tagName})
      .then( async (success) => {
        if(success){
          console.log('communication: ' + success);


          res.send({success: true, data: success});
        }
      })
      .catch(err => {
        console.log(err.message);
        res.send({success: false});
      })
    }

    static async getTagsList(req, res){
      TagConfig.findOne({"name": "fbsbot", "datatype" : "package-config",bot_id: req.session.bot_id})
      .then(success => {
        if(success) res.send({success: true, data: success.tags})
        else res.send({success: true, data: []})
      })
      .catch(err => {
        console.log(err.message);
        res.send({success: false, data: null})
      })
    }

    static async removeTag(req, res){
      let { tagName } = req.body;
      if(tagName) tagName = tagName.trim();
      console.log(tagName);
      //delete tag name in data array
      const tagUpdated = await TagConfig.findOneAndUpdate({"name": "fbsbot", "datatype" : "package-config",bot_id: req.session.bot_id}, {$pull: {data: tagName}}, {new: true});

      if(tagUpdated){
        Communication.updateMany({ bot_id: req.session.bot_id}, {$pull:  { tag: tagName }}, { multi: true })
        .then(success => {
          if(success) {
            return res.send({success: true}); 
          }
        })
        .catch(err => {
          console.log(err.message);
          res.send({success: false});
        })
      }
    }

    static async removeUserTag(req, res){
      let { idUser, tagName } = req.body;
      if(tagName) tagName = tagName.trim();
      Communication.findByIdAndUpdate(idUser, {$pull: {tag: tagName}})
      .then(success => {
        if(success) return res.send({success: true});
      })
      .catch(err => {
        console.log(err.message);
        res.send({success: false});
      })
    }

    static async updateTagName(req, res){
      const {oldTagName, newTagName} = req.body;
      TagConfig.findOneAndUpdate({name:'tag', data: oldTagName}, {$set: {'data.$':newTagName}})
      .then(async (success) => {
        if(success) {
          const updateCom = await Communication.updateMany({ tag: oldTagName }, { $set: { 'tag.$': newTagName } });
          if(updateCom){
            res.send({success: true})
          }
        }
      })
      .catch(err => {
        console.log(err.message);
        res.send({success: false});
      })
    }

    static async addTagToUsers(req, res){
      let { tagName, idUsers } = req.body;

      if(tagName && idUsers){
          let tag = await TagConfig.findOneAndUpdate({"name": "fbsbot", "datatype" : "package-config", bot_id:  req.session.bot_id, 'tags': { $ne: tagName }}, {$push: {tags: tagName}})
          //if(tag){
            idUsers.forEach(async (idUser) => {
              let userAddedtag = await Communication.findOneAndUpdate({_id: idUser , bot_id:  req.session.bot_id, 'tags': { $ne: tagName }}, {$push : {tags: tagName}});
            })
            res.send({success: true});
          //}
      }else{
        res.send({success: false, msg: 'NO_TAGNAME_OR_NO_IDUSER'})
      }
    }

    static async getAllUser(req, res){
      Communication.find({ })
      .then(success => {
        if(success)
        return res.send({success: true, data: success});
        res.send({success: false});
      })
      .catch(err => {
        console.log(err.message);
        res.send({success: false});
      })
    }

}

module.exports = TagsListController;
