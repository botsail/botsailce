//import  site  from '../app/controllers/site';

const  gallery = require('../app/controllers/gallery');

const Multer = require('multer');

var storageGallery = Multer.diskStorage({
    destination: (req, file, cb) => {
      if((req.session.user != undefined) && (req.session.user != null) && (req.session.bot_id != undefined)&& (req.session.bot_id != null)) {
			cb(null, global.appRoot + '/public/uploads/bots/' + req.session.bot_ym + "/" +req.session.bot_id);
		}
    },
    filename: (req, file, cb) => {
      if((req.session.user != undefined) && (req.session.user != null) && (req.session.bot_id != undefined)&& (req.session.bot_id != null)) {
			cb(null, Date.now() + "_" + file.originalname);
		} 
    }
});

const uploadGallery = Multer({storage: storageGallery});


module.exports = function (app, passport) {
    app.post('/uploadImg', uploadGallery.single("imgUploadToServer"), gallery.uploadImg);
	app.get('/gallery', gallery.verifyAuth, gallery.listGallery);
}
