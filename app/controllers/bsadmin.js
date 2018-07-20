var User            = require('../models/entities/user');
var Metadata            = require('../models/entities/metadata');
var Controller            = require(global.appRoot + '/core/controller');
var fs = require('fs');

class BSAdminController extends Controller {
	static verifyAuth(req, res, next) {
		supper(req, res, next);
	}

	static checkBotActive(req, res) {
		supper();
	}

	

	//Home page
	static async home(req, res) {

		res.render('pages/home.ejs', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session,
			data: obj
		 });

	}

	
	//Signup page
	static signup(req, res) {
		if (req.session.user) {

			res.redirect('/home');

		} else {

			res.render('pages/signup', {
				error : req.flash("error"),
				success: req.flash("success"),
				session:req.session
			});
		}

	}

	//Signup login page
	static login(req, res) {

		if (req.session.user) {
			//check user folder
			try {
				let data = req.session.user;
				if (!fs.existsSync(global.appRoot + "/public/uploads/users/" + data.ym)) {
					fs.mkdirSync(global.appRoot + "/public/uploads/users/" + data.ym);
				}

				data.user_public_folder = "/public/uploads/users/" + data.ym + "/" + data._id;
				//Crate folder for temp
				if (!fs.existsSync(global.appRoot + "/" + data.user_public_folder)) {
					fs.mkdirSync(global.appRoot + "/" + data.user_public_folder);
				}
			}catch(ex) {
				console.log("user folder not found: "+ req.session.user._id);
			}
			

			res.redirect('/home');

		} else {
			
			res.render('pages/login', {
				error : req.flash("error"),
				success: req.flash("success"),
				session:req.session
			});
		}
		
	}
	
	//logout page
	static logout(req, res) {
		req.session.user = null;
		res.redirect('/login');
	}

	

	//Menu json 
	static menu(req, res) {
		if(Controller.prototype.getBotID() != null) {
			Metadata.findOne({"content": "system-menu", "system": "core"},function(err,result){
				if (err) res.send(JSON.stringify({ 'return': '0' }, null, 3));	 
				res.send(result.data);	
			});
		} else {
			let obj = [{
				"id" : "10",
				"level" : "system-menu",
				"name" : "Home",
				"url" : "/home",
				"parent_id" : "-1",
				"css_class" : "fa fa-area-chart",
				"authenticate" : true,
				"plugin" : "system"		
			}];
			
			res.send(obj);
		}
		 
		
	}
	
	
	
	
}

module.exports = BSAdminController;