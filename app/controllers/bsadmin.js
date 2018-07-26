var User            = require('../models/entities/user');
var Metadata            = require('../models/entities/metadata');
var Controller            = require(global.appRoot + '/core/controller');
var fs = require('fs');
const Cookie = require('cookie');
const UpdatemModule = require('../../core/util/updatemodule')

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
		// Clear cookie
		res.setHeader("Set-Cookie", [      
			Cookie.serialize('cbv', 0.1, {
			expires: new Date(0),
			path: '/'
		}),
		  Cookie.serialize('cbu', true, {
			expires: new Date(0),
			path: '/'
		})]);
		
		req.session.destroy();
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
	
	static updateToVersion(req, res) {

		if((req.query.v > req.cookies.cbv) & (req.session.user.email == "root")){

			var urlupdate =  'http://api.botsail.org?get-bs-update?cbv=' + req.cookies.cbv + '&nbv=' + req.query.v;
			var proccess = new UpdatemModule();

			proccess.update(urlupdate, '/', function(){

				res.setHeader("Set-Cookie", [
						Cookie.serialize('cbv', req.query.v, {
						expires: new Date(Date.now() + 900000),
						path: '/'
					}),
				  		Cookie.serialize('cbu', true, {
						expires: new Date(0),
						path: '/'
					})]);

				res.send('success');
			});
		}else{
			res.send('error');
		}
	}
	
	
	
}

module.exports = BSAdminController;