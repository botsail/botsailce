var BotSailBase = require(global.appRoot + "/core/botsailbase.js");
var Common = require(global.appRoot + "/core/common.js");

class Controller extends BotSailBase {
	setResponse(req, res) {
		this.req = req;
		this.res = res;
	}
	
	static loggedIn(req, res, next) {
		if (req.session.user) { // req.session.passport._id

			next();

		} else {

			res.redirect('/login');

		}
	}
	
	getBotID() {
		try {
		if((Common.isset(this.req.session) != null) && (Common.isset(this.req.session.bot_id) != null) && (Common.isset(this.req.session.bot_id) != "") ) return this.req.session.bot_id;
		} catch(ex) { console.dir(ex); }
		return null;
	}

	//use for middleware
	static verifyAuth(req, res, next) {
		if (req.session.user) { // req.session.passport._id

			if((req.url == '/') || (req.url.indexOf("/home") > 0) || (req.url.indexOf("/bot_list") > 0) || (req.url.indexOf("/active_bot") > 0))
				next();
			else {
				if(Common.isset(req.session.bot_id) == null) res.redirect('/');
				else next();
			}
				

		} else {

			res.redirect('/login');

		}
	}

	//use for middleware
	static checkBotActive() {
		if (this.req.session.user) { // req.session.passport._id

			if(!((this.req.url.indexOf("/") == 0) || (this.req.url.indexOf("/home") > 0) || (this.req.url.indexOf("/bot_list") > 0) || (this.req.url.indexOf("/active_bot") > 0)))
				return true;
			else 
				this.res.redirect('/');

		} else {

			this.res.redirect('/login');

		}
	}
	


	sendError(err, msg = '')	 {
		let json = {
			status : -1,
			error : err,
			message : msg
		}
		this.res.send(json);	
	};

	sendErrorMessage(msg)	 {
		let json = {
			status : -2,
			error : null,
			message : msg
		}
		this.res.send(json);	
	};

	sendErrorData(msg,data)	 {
		let json = {
			status : -2,
			error : null,
			message : msg,
			data: data
		}
		this.res.send(json);	
	};

	sendError(error)	 {
		let json = {
			status : -2,
			error : error,
		}
		this.res.send(json);	
	};

	sendMessage(msg) {
		let json = {
			status : 1,
			error : null,
			message : msg
		}
		this.res.send(json);
	};

	sendMessageData(msg, data) {
		let json = {
			status : 1,
			error : null,
			message : msg,
			data: data
		}
		this.res.send(json);
	}

	
}

module.exports = Controller;