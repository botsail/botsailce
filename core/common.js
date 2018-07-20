const request = require('request');
const fs = require('fs');
const unzip = require('unzip');
const mongoose = require('mongoose');

class Common {
	
	//Check object is exit
	static isset(object) {
		if((typeof object == "undefined") || (object == null))
			return null;
		return object;
	};

	static  checkIsValidDomain(domain) { 
	    var regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127|localhost)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
	    return regexp.test(domain);
	} 

	//Send request to other website via URL
	static async doRequest(requestData) {
		return new Promise(function (resolve, reject) {
			request(requestData, function (error, res, body) {
				if (!error && res.statusCode == 200) {
					resolve(body);
				} else {
					reject(error);
				}
			});
		});

	}

	//Get file form URL
	static async getFileFromURL(url, directory, filename) {
		var download = require('download-file');

		var options = {
			directory: directory,
			filename: filename
		}

		return new Promise(function (resolve, reject) {
			//download from url
			download(url, options, function(err){
				    if (err) {
				    	reject(error);
				    } else {
				    	resolve(true);
				    }
				    
				});
		});
	}
	
	static removeFile(path) {
		try {
			fs.unlinkSync(path);
		} catch(ex) {
			return false;
		}
		
		return true;
	}

	//extract file
	static async extract(filename, outputPath) {
		const stream = fs.createReadStream(zipFile).pipe(unzip.Extract({ path: outputPath }));
		return new Promise((resolve, reject) => {
			let hasError;
			stream.on('error', err => {
				hasError = true;
			});
			stream.on('close', () => {
				if (hasError) {
					reject(false);
					
				} else {
					resolve(true);
				}
			})
		});
	}

	//Create user folder, folder is <User_ID>/topics and <User_ID>/templates
	static createUserFolder(req) {
		let userId = req.session.user._id;
		let userDir = global.appRoot + "/" + userId;
		if (!fs.existsSync(userDir)){
		    fs.mkdirSync(userDir);

		    userDirTopic = userDir + "/topics";
		    userDirTemplates = userDir + "/templates";
		}
	}

	//Create Folder
	static createFolder(path, folderName) {
		let dir = path + "/" + folderName;
		if (!fs.existsSync(dir)){
		    fs.mkdirSync(dir);
		}
	}

	static randomNum(startNum, endNum) {
		let L = endNum - startNum;
		let num = Math.floor(Math.random() * L) + 1  + startNum;
		if(num < startNum)  num = startNum;
		if(num > endNum)  num = endNum;
		return num;
	}
	
	static ObjectID(strID) {
		 return mongoose.mongo.BSONPure.ObjectID.fromHexString(strID);
	}

}

module.exports = Common;