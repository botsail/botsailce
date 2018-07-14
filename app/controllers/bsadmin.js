var User            = require('../models/entities/user');
var Metadata            = require('../models/entities/metadata');
var Controller            = require(global.appRoot + '/core/controller');
var BSPatternEngine = require(global.appRoot + '/packages' + '/BSPatternEngine/bspatternengine');
var Cache            = require(global.appRoot + '/core/util/cache');
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
		/*
		let bsPatternEngine = new BSPatternEngine();
		let answer = await bsPatternEngine.query(111,"mấy giờ rồi");
		if(answer == null) answer = "Tôi giúp gì được cho bạn";
		*/
/*
		let data = await Cache.setKey('12344444', {a: "sdfeds4444", b: 22323222});
		let data2 = await Cache.getValue('1234');
*/
		//let obj = await DashboardProcess.getDashboarData();

		res.render('pages/home.ejs', {
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session,
			data: obj
		 });

	}

	
	//Signup page
	static signup(req, res) {
		var Update = require(global.appRoot + '/core/util/updatemodule');
		//Update.updateNguyen();

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
			
		Metadata.findOne({"content": "system-menu", "system": "core"},function(err,result){
	        if (err) res.send(JSON.stringify({ 'return': '0' }, null, 3));	 
			res.send(result.data);	
		}); 
		
	}
	
	
	
	
}

module.exports = BSAdminController;