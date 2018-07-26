//import  site  from '../app/controllers/site';
const  bsadmin = require('../app/controllers/bsadmin');
const  bot = require('../app/controllers/bot');
const Cookie = require('cookie');

module.exports = function (app, passport) {
    //Test update when don't have api
    app.get('/check-update', function(req,res){
        var updates = {
            update: "OK",
            update_url : "sss",
            new_version: 0.2
        }
        updates = JSON.stringify(updates);
        
        res.setHeader('Content-Type', 'application/json');
        res.send(updates);
    })

    app.post('/update-to-version', bsadmin.updateToVersion);


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

        failureRedirect: '/login', // redirect back to the signup page if there is an error     
        failureFlash: true // allow flash messages

    }), function(req,res){
        // If user is "root" create cookie for check update
        if(req.session.user.email == 'root'){
            if(!req.cookies.cbv){

                res.setHeader('Set-Cookie', [      
                    Cookie.serialize('cbv', 0.1, {
                    expires: new Date(Date.now() + 900000),
                    path: '/'
                  }),
                  Cookie.serialize('cbu', true, {
                    expires: new Date(Date.now() + 900000),
                    path: '/'
                })]);

            }
        }
		
		//Create Menu
		let myMenu = JSON.stringify([{
							"id" : "10",
							"level" : "system-menu",
							"name" : "Home",
							"url" : "/home",
							"parent_id" : "-1",
							"css_class" : "fa fa-area-chart",
							"authenticate" : true,
							"plugin" : "system"		
						}]);
						
		res.setHeader('Set-Cookie', [      
						Cookie.serialize('menu', myMenu, {
						expires: new Date(Date.now() + 900000),
						path: '/'
					  })
					]);
					
        res.redirect('/home');
    });
	
	app.get('/logout', bsadmin.logout);

}
/* {
,{
        //successRedirect: '/home', // redirect to the secure profile section
        //failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }
    } */