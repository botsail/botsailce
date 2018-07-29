var express = require('express');
var path = require('path');
global.appRoot = path.resolve(__dirname);

var app = express();
//var multer = require('multer');
var constants = require('constants');
var constant = require('./config/constants');
var Package = require('./app/models/entities/package');     //Main controller

var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var fs = require('fs');
//var morgan = require('morgan');
//var rfs = require('rotating-file-stream');
var logger = require('express-logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var LokiStore = require('connect-loki')(session);
var validator = require('express-validator');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


/***************Mongodb configuratrion********************/
var mongoose = require('mongoose');
var configDB = null;
//configuration ===============================================================

if (fs.existsSync(appRoot + "/config/database.js")) {

  configDB = require('./config/database.js');

  console.log('appRoot', appRoot);
  console.log(configDB);
  mongoose.connect(
    configDB.url,
    {
      dbName: configDB.dbName,
      user: configDB.user,
      pass: configDB.pass,
      reconnectInterval: 500,
      reconnectTries: 100
    }
  )


  .then(
    () => { console.log('connect to db: success') },
    err => {
      console.error('connect to db: fail');
      console.error(err)
    }
  );

}

require('./app/models/process/passport')(passport); // pass passport for configuration


//Write logs **************************************************
/*
var logDirectory = global.appRoot + '/logs';
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
var accessLogStream = rfs('access_logs', {
  interval: '1d', // rotate daily
  path: logDirectory
})

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}))
*/
//**************************************************


app.use(validator());     //use validator
app.use(cookieParser()); // read cookies (needed for auth)


//view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');


app.use(session({
    store: new LokiStore({}),
    secret: 'I Love Bot Sail',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


//launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

// load our routes and pass in our app and fully configured passport
var routePath="./routers/"; //add one folder then put your route files there my router folder name is routers
fs.readdirSync(routePath).forEach(function(file) {
    var route=routePath+file;
    require(route)(app, passport);
});
app.use(function(req, res, next) {
  if((req.session != undefined) && (req.session != null) && (req.session.user != undefined)) res.locals.user = req.session.user;
  next();
});


Package.findOne({"type": "chatbot-engine", "status": "active"},function(err,result){
  if (err) return console.error(err);

	global.appChatbotEngineConfig = {};
	global.appClient = {};

  global.serverUrl = constant.host;
  global.appChatbotEnginePath = result.package_folder;
  global.appChatbotEngineAction = result.action;
  const ChatbotEngine = require(global.appRoot + '/packages/' + global.appChatbotEnginePath + '/' + global.appChatbotEngineAction);
  global.appFBChatbotEngine = new ChatbotEngine();


  var app = require('express')();
  var server = require('http').Server(app);
});

exports = module.exports = app;
