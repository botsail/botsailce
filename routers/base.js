//import  site  from '../app/controllers/site';
const  bsadmin = require('../app/controllers/bsadmin');
const  bot = require('../app/controllers/bot');

module.exports = function (app, passport) {

    app.get('/login', bsadmin.login);
    app.get('/signup', bsadmin.signup);

    app.get('/', bsadmin.loggedIn, bot.listBot);//home
    app.get('/home', bsadmin.loggedIn, bot.listBot);//home


    app.get('/editBot', bsadmin.verifyAuth, bot.editBot);
	
    app.get('/json', bsadmin.loggedIn, bsadmin.menu);

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/home', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/home', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));
	
	app.get('/logout', bsadmin.logout);

}
