/*Auth: Nospk Tran
  Botconfig Controllers
*/
const Controller            = require(global.appRoot + '/core/controller');
const Attributes = require(global.appRoot + '/core/attribute');

//bot(_id) will read form session
//bot(_id) temp
class ContentController extends Controller{
	// render view
    static botconfigdetail(req,res){
        Controller.prototype.setResponse(req,res);
        res.render("pages/attribute.ejs");
	}
	
	// user attribute config, how to use it in core/botconfig
	// running in code and resovle mess
	static async botconfigdata(req,res){
		Controller.prototype.setResponse(req,res);
		try{
			const data = await Attributes.prototype.getNameAttributes(Controller.prototype.getBotID())
			Controller.prototype.sendMessageData('success',data);
		}catch(err){
			Controller.prototype.sendError('Can\'t not find data in bot');
		}
	}
	static async newuseratt(req,res){
		Controller.prototype.setResponse(req,res);
		try{
			const result = await Attributes.prototype.createUserAttribute(Controller.prototype.getBotID(),req.body.name);
			Controller.prototype.sendMessage(result);
		}catch(err){
			Controller.prototype.sendError('Can\'t not create new user attribute in bot! - (Maybe same name)');
		}
	}
	static async edituseratt(req,res){
		Controller.prototype.setResponse(req,res);
		try{
			const result = await Attributes.prototype.updateUserAttributesName(Controller.prototype.getBotID(),req.body.old_name, req.body.new_name);
			Controller.prototype.sendMessage(result);
		}catch(err){
			Controller.prototype.sendError('Can\'t edit user attribute! - (Maybe same name)');
		}
	}
	static async deluseratt(req,res){
		Controller.prototype.setResponse(req,res);
		try{
			const result = await Attributes.prototype.delUserAttributesRoot(Controller.prototype.getBotID(),req.body.name);
			Controller.prototype.sendMessage(result);
		}catch(err){
			Controller.prototype.sendError('Can\'t deldete user attribute');
		}
	}
	// bot attribute config
	static async newbotatt(req,res){
		Controller.prototype.setResponse(req,res);
		try{
			const result = await Attributes.prototype.addBotAttributes(Controller.prototype.getBotID(),req.body.name, req.body.value);
			Controller.prototype.sendMessage(result);
		}catch(err){
			Controller.prototype.sendError('Can\'t not create new bot attribute! - (Maybe same name)');
		}
	}
	static async editbotatt(req,res){
		Controller.prototype.setResponse(req,res);
		try{
			if(req.body.new_name!=""){
				const value = await Attributes.prototype.updateBotvalueAttributes(Controller.prototype.getBotID(),req.body.old_name, req.body.value);
				const result = await Attributes.prototype.updateBotnameAttributes(Controller.prototype.getBotID(),req.body.old_name, req.body.new_name);	
				Controller.prototype.sendMessage(result);		
			}else{
				const value = await Attributes.prototype.updateBotvalueAttributes(Controller.prototype.getBotID(),req.body.old_name, req.body.value);
				Controller.prototype.sendMessage(value);
			}	
		}catch(err){
			Controller.prototype.sendError('Can\'t edit bot attribute! - (Maybe same name)');
		}
	}
	static async delbotatt(req,res){
		Controller.prototype.setResponse(req,res);
		try{
			const result = await Attributes.prototype.delBotAttributes(Controller.prototype.getBotID(),req.body.name);
			Controller.prototype.sendMessage(result);
		}catch(err){
			Controller.prototype.sendError('Can\'t deldete user attribute');
		}
	}
}
module.exports = ContentController;