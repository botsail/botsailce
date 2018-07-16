
//app/models/user.js
//load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

//define the schema for our user model
var userSchema = mongoose.Schema({	
	email: String,
	password: String,
	full_name: String,
	gender: Number,
	address: String,
	phone: Number,
	note: String,
	avatar: String,
	status: String,
	updated_date: Date,
	created_date: Date,
	active_hash: String,
	image: { type : String , "default" : "/images/default-avatar.png" },
	active_hash_times: {
		token: String,
		date: Date
	},
	ym: String,
	user_public_folder: String, 
	role: { type : String , "default" : "member" },
});


//methods ======================
//generating a hash
userSchema.methods.generateHash = function(password) {
 return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//checking if password is valid
userSchema.methods.validPassword = function(password) {
 return bcrypt.compareSync(password, this.password);
};

//create the model for users and expose it to our app
module.exports = mongoose.model('users', userSchema, 'users');