var home = require('../app/controllers/home');
var json = require('../app/controllers/json');
var plugin = require('../app/controllers/plugin');
var site = require('../app/controllers/site');

//you can include all your controllers

module.exports = function (app, passport) {

    app.get('/login', home.login);
    app.get('/signup', home.signup);

    app.get('/', home.loggedIn, home.home);//home
    app.get('/home', home.loggedIn, home.home);//home
    app.get('/json', json.menu);
    //app.get('/topic', home.loggedIn, home.topic);//topic
    //app.get('/content', home.loggedIn, home.content);//content

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

    app.get('/pluginlist', home.loggedIn, plugin.pluginlist);//dashboard
    app.get('/action',  plugin.action);//run plugin at Get method
    app.post('/action',  plugin.action);//run plugin at Post method
    app.get('/install',  plugin.install);//install plugin
    app.get('/uninstall',  plugin.uninstall);//install plugin
}
