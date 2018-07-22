var Controller = require(global.appRoot + '/core/controller');
var mongoose   = require("mongoose");
var User    = require('../models/entities/user');
var bcrypt   = require('bcrypt-nodejs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var constants = require(global.appRoot + '/config/constants');


//captcha google if you want use
// const keycaptcha = require(global.appRoot +'/config/recaptcha.js');
// const Recaptcha = require('express-recaptcha').Recaptcha;
// const recaptcha = new Recaptcha(keycaptcha.SITE_KEY, keycaptcha.SECRET_KEY);

// mailgun
//const keymail = require(global.appRoot +'/config/mail-gun.js');
//const mailgun = require('mailgun-js')({apiKey: keymail.api_key, domain: keymail.domain});



var transporter = nodemailer.createTransport(smtpTransport(constants.smtpConfig));


const success_chang_pass = {
    from: constants.adminmail,
    to: '',
    subject: 'Success recover password',
    text: ''
};
//   mailgun.messages().send(data, function (error, body) {
//     console.log(body);
//   });


/*
Controllers user
Date: 07/05/2018
Auth: Nospk Tran
Result: show profile, edit profile
*/

class UserController extends Controller{
    static show(req, res){
        Controller.prototype.setResponse(req, res);
            var id = req.session.user._id;
            User.findOne({_id: id}, function(err, data){
                if(err){
                    res.render('404', {
                        status: err.status || 404
                      , error: err
                    });
                }else{
                    res.render("pages/profile.ejs",{data: data});
                }
            });
    }

    //save information user
    static save(req, res){

		Controller.prototype.setResponse(req,res);


		var data = JSON.parse(req.body.datasend);
		req.params = data;

		User.findOne({_id: data._id}, function(err, user) {
			if((data.password != "" || data.new_password != "" || data.re_new_password !="")  ){ // check password correct ?

				//if password not true
				if(!user.validPassword(data.password)) {
					let error = [{"location":"params","param":"password","msg":"Password Not Match"}];
					return Controller.prototype.sendError(error);
				}

				req.check('new_password','Password to short').isLength({min:6});
				req.check('re_new_password','New Password not match').equals(data.new_password);

			}

			// validator user information ============================
			//validator phone
			if(data.phone){
				req.check('phone', 'Not a phone').matches(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g);
			}

			req.check('full_name','Name not empty').notEmpty();

			var errors = req.validationErrors();
			if(errors != false) {
				return Controller.prototype.sendError(errors);
			}else{
				user.gender= data.gender;
				user.full_name = data.full_name;
				user.address= data.address;
				if(data.new_password != "") user.password = user.generateHash(data.new_password);
				user.phone = data.phone;
				user.updated_date = new Date();
				// if not have file req.file is undefined
				if((req.file != undefined) || (req.file != null)){
					user.image = req.session.user.user_public_folder + "/" + req.file.filename;
				}
				user.note = data.note;
				user.save(function(err,result){
					if(err){
						Controller.prototype.sendErrorMessage("error" + err);
					}else{
						Controller.prototype.sendMessage("success");
					}
				});
			}
		});


	}
/*
Nospk Tran
Lost pass
Date: 17/05/2018
*/

    //render pages
    static lostpass(req,res){
        Controller.prototype.setResponse(req, res);
        res.render("pages/lostpass.ejs",{
            error : req.flash("error"),
            success: req.flash("success"),
        });
    }

    static async resetpass(req,res){
        Controller.prototype.setResponse(req, res);

        // check token date
        function check_token_data(req){
            let email= req.query.email;
            let token = req.query.token;
            return new Promise(function(resolve, reject){
                User.findOne({'email':email})
                .then(user=>{
                    if(user.active_hash_times.token != token){// check token
                        reject(new Error('Token Not Incorrect, Use forgot password again'));
                    }
                    else if(user.active_hash_times.date < new Date()){// check date
                        reject(new Error('Token Expired, Use forgot password again'));
                    }
                        return user;
                    })
                .catch(err=>{
                        reject(new Error('Not have user'));
                    })
                .then(user=>{
                        let randomstring = Math.random().toString(36).slice(-8);// make passowrd random 8 characters
                        user.password = user.generateHash(randomstring);
                        user.updated_date = new Date();
                        user.save()
                        .then(success=>{
                            resolve([randomstring, user.email, user.full_name]);
                        })
                        .catch(err=>{
                            reject(new Error('Something misstake, try forgot password again'));
                        })
                    })

            });
        }

        function send_password(newpassword){
            return new Promise(function(resolve, reject){
                let password = newpassword[0];
                let email = newpassword[1];
                let full_name = newpassword[2];
                let mail = {
                    from: constants.adminmail,
                    to: email,
                    subject: 'New password',
                    html: 'Bạn ' + full_name + ' thân mến!' + "<br>"
                    + '<h3> Bạn vừa đặt lại password thành công, hiện tại password mới của bạn sẽ là: ' + password + '</h3>'
                  };
                /*
				mailgun.messages().send(mail, function (error, body) {
                    resolve();
                });
				*/
				// send mail with defined transport object
				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						reject(error);
					} else {
						resolve();
					}


				});
            });
        }
        //run ========================
        try{
            let newpassword = await check_token_data(req);
            await send_password(newpassword);

            req.flash('success', 'Reseted password, New password send to your email');
            res.render("pages/resetpass.ejs",{
                error : req.flash("error"),
                success: req.flash("success")
            });

        }catch(error){
            req.flash('error', error.message);
            res.render("pages/resetpass.ejs",{
                error : req.flash("error"),
                success: req.flash("success")
            });

        }

    }

	//check email token
	static check_email(req){
		return new Promise(function(resolve, reject){
			User.findOne({'email': req.body.email})
			.then(user=>{
				let tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				user.active_hash_times.token = user.generateHash(req.body.email);
				user.active_hash_times.date = tomorrow;
				user.save()
				.then(success=>{
					resolve([user.active_hash_times.token, user.full_name, req.body.email]);
				})
				.catch(err=>{
					reject(new Error('Something misstake, try again'));
				})
			})
			.catch(err=>{
				reject(new Error('Not have user, comfirm email again'));
			})
		});
	}

	// send token to email user
	static send_email(token){
		return new Promise(function(resolve, reject){
			let full_name = token[1];
			let token_send = token[0];
			let email = token[2];
			let mail = {
				from: constants.adminmail,
				to: req.body.email,
				subject: 'Comfirm email change password',
				html: 'Bạn ' + full_name + ' thân mến!' + "<br>" + 'Bạn vừa kích hoạt tính năng tạo lại mật khẩu, '
				+ 'để đảm bảo việc này là mong muốn của bạn xin vui lòng click vào link dưới đây chúng tôi sẽ gởi '
				+ 'lại mật khẩu mới cho bạn ngay lâp tức'
				+ " Link tạo mật khẩu mới: <a href=\'http://localhost:8042/bs-admin/resetpass?email="
				+ email + "&token=" + token_send +"'\>Link</a>" + '<br>'
				+ 'Nếu link không thành công thì hay nhập địa chỉ sau vào website của bạn: http://localhost:8042/bs-admin/resetpass?email='
				+ email + "&token=" + token_send
			  };
			 /*
			mailgun.messages().send(mail, function (error, body) {

				resolve();
			});
			*/
			// send mail with defined transport object
			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					reject(error);
				} else {
					resolve();
				}


			});
		});
	}


    //check email lostpass
    static async checklostpass(req,res){
        Controller.prototype.setResponse(req, res);
        try{
            //await check_recaptcha(req);
            let token = await UserController.check_email(req);
            await UserController.send_email(token);

            req.flash('success', 'Reset password success, check your email!!');
            res.render("pages/lostpass.ejs",{
                error : req.flash("error"),
                success: req.flash("success")
            });
        }catch(error){
            req.flash('error', error.message);
            res.render("pages/lostpass.ejs",{
                error : req.flash("error"),
                success: req.flash("success")
            });
        }
}


}
module.exports = UserController
