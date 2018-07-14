const  bot = require('../app/controllers/bot');
const  bsadmin = require('../app/controllers/bsadmin');
const Multer = require('multer');

var storagebot = Multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, global.appRoot + '/temps/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_" + file.originalname)
    }
});

const uploadbotimage = Multer({storage: storagebot});

module.exports = function (app, passport) {

    app.get("/active_bot", bsadmin.loggedIn,  bot.activeBot); 
    app.get("/bot_list", bsadmin.loggedIn, bsadmin.loggedIn,  bot.listBot); //get the found and send GET request to render the bot list
    app.get("/bot_edit/:id", bsadmin.loggedIn,  bot.editBot); //get the found and send GET request to render the bot edit
    app.get("/bot_edit", bsadmin.loggedIn,  bot.showeditBot);
	app.post("/bot_edit",  uploadbotimage.single('imageupload'), bot.saveBot);
    app.post("/deletebot", bsadmin.loggedIn,  bot.deletebot); //post the found and send POST request to render the delete bot
    app.post("/clonebot", bsadmin.loggedIn,  bot.clonebot); //post the found and send POST request to render the clone bot
    app.post("/exportbot", bsadmin.loggedIn,  bot.exportbot); //post the found and send POST request to render the export bot
    app.get("/exportbotdata/:filename", bsadmin.loggedIn,  bot.exportbotdownload); //get the found and send POST request to render the download export file
}
