var Controller = require(global.appRoot + '/core/controller');

class GalleryController extends Controller {
	
	
	static listGallery(req, res) {
		const galleryFolder = global.appRoot + '/public/uploads/bots/' + req.session.bot_ym + "/" +req.session.bot_id + "/" ;
		const fs = require('fs');
		let arr = [];
		fs.readdir(galleryFolder, (err, files) => {
		  if((files != undefined) && (files.length > 0)) {
			  files.forEach(file => {
				arr.push(file);
			  });
		  }
		  
		  let myJson = { 
			gallery : arr,
			bot_id: req.session.bot_id,
			bot_ym: req.session.bot_ym
		  }
		  res.send(myJson);
		  return;
		});
	}
	
    static uploadImg(req, res) {
		if (!req.file)
		  return res.send({success: false, msg: 'No files uploaded'});
		return res.send({success:true});
	}
  
	static checkImg(mimeType) {
		if(mimeType == null || mimeType == undefined) return false;
		if(mimeType.indexOf('jpg') > -1 || mimeType.indexOf('jpeg') > -1 || mimeType.indexOf('png') || mimeType.indexOf('gif') > -1) return true;
		return false;
	}

  
}



module.exports = GalleryController;