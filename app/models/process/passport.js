var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../entities/user');
var bcrypt = require('bcrypt-nodejs');

//var configAuth = require('./auth.js');
var constant = require(appRoot + '/config/constants');
var dateFormat = require('dateformat');
var fs = require('fs');

var bcrypt = require('bcrypt-nodejs');


//expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        fullnameField : 'full_name',
        usernameField : 'email',
        passwordField : 'password',
        rePasswordField : 'repassword',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    async function(req, email, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        full_name = req.body.full_name;
        password = req.body.password;
        repassword = req.body.repassword;

        if(password != repassword) {
            return done(null, false, req.flash('error', 'Password and repassword not match'));
        }

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('error', 'That email is already taken.'));
            } else {
            	
            	
           User.find().sort([['_id', 'descending']]).limit(1).exec(function(err, userdata) {	

        	   
                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                
           	    var day =dateFormat(Date.now(), "yyyy-mm-dd HH:MM:ss");
                var ym = dateFormat(Date.now(), "yyyymm");
           	 
           	    var active_code=bcrypt.hashSync(Math.floor((Math.random() * 99999999) *54), null, null);
				newUser.full_name    = full_name;
				newUser.email    = email;
				newUser.password = newUser.generateHash(password);
				newUser.created_date = day;
				newUser.updated_date = day;
				newUser.status = 'active'; //inactive for email actiavators
				newUser.active_hash = active_code;
				newUser.ym = ym;
				newUser.user_public_folder = "";


                // save the user
                newUser.save(function(err, data) {
                    if (err)
                        throw err;

					//create User Folder
					try {
						if (!fs.existsSync(global.appRoot + "/public/uploads/")) {
							fs.mkdirSync(global.appRoot + "/public/uploads/" );
						}
						
						if (!fs.existsSync(global.appRoot + "/public/uploads/users/")) {
							fs.mkdirSync(global.appRoot + "/public/uploads/users/" );
						}
					
						if (!fs.existsSync(global.appRoot + "/public/uploads/users/" + data.ym)) {
							fs.mkdirSync(global.appRoot + "/public/uploads/users/" + data.ym);
						}
						
						data.user_public_folder = "/public/uploads/users/" + data.ym + "/" + data.id;
						//Crate folder for temp
						if (!fs.existsSync(global.appRoot + "/" + data.user_public_folder)) {
							fs.mkdirSync(global.appRoot + "/" + data.user_public_folder);
						}

					}catch(ex) {
						console.log("can't create user folder: " + data.id);
						console.log("Err: " + ex);
					}
					
                    data.user_public_folder = "/uploads/users/"  + data.ym + "/" + data.id;

                    data.save(function(err){
                        return done(null, newUser,req.flash('success', 'Account Created Successfully'));
                    
                        req.session.destroy();
                    });
                });
                
              });
           
                
            }

        });    

        });

        
    }));
    
    
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

		
    	
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            
            if (err)
            return done(null, false, req.flash('error', err)); // req.flash is the way to set flashdata using connect-flash


            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('error', 'Sorry Your Account Not Exits ,Please Create Account.')); // req.flash is the way to set flashdata using connect-flash

            
            
            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('error', 'Email and Password Does Not Match.')); // create the loginMessage and save it to session as flashdata

            if(user.status === 'inactive')
             return done(null, false, req.flash('error', 'Your Account Not Activated ,Please Check Your Email')); // create the loginMessage and save it to session as flashdata
		 
			//Check and create user folder 
			//create User Folder
					try {
						if (!fs.existsSync(global.appRoot + "/public/uploads/")) {
							fs.mkdirSync(global.appRoot + "/public/uploads/" );
						}
						
						if (!fs.existsSync(global.appRoot + "/public/uploads/users/")) {
							fs.mkdirSync(global.appRoot + "/public/uploads/users/" );
						}
					
						if (!fs.existsSync(global.appRoot + "/public/uploads/users/" + user.ym)) {
							fs.mkdirSync(global.appRoot + "/public/uploads/users/" + user.ym);
						}
						
						let user_public_folder = "/public/uploads/users/" + user.ym + "/" + user.id;
						//Crate folder for temp
						if (!fs.existsSync(global.appRoot + "/" + user_public_folder)) {
							fs.mkdirSync(global.appRoot + "/" + user_public_folder);
						}

					}catch(ex) {
						console.log("can't create user folder: " + user.id);
						console.log("Err: " + ex);
					}
            
            
            // all is well, return successful user
            req.session.user = user;
		
            return done(null, user);
        });

    }));

};

    
    





