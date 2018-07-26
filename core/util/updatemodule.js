var fs = require('fs');
var ncp = require('ncp').ncp;
var common = require('../../core/common');
var rimraf = require('rimraf');

class UpdateModule {
	async update(url,foldertarget,callback){
		console.log("Downloading.....");
		var source = process.cwd() + '/temps/update' + (Date.now() / 1000);
		var target = process.cwd();
		var zipfile;
		var filezip;
		
		//Crate folder for temp
		if (!fs.existsSync(source)) {
			fs.mkdirSync(source);
		}

		if(foldertarget != ''){
			target = process.cwd() + foldertarget;
		}
		
		//if target folder not exit, stop update process
		if (!fs.existsSync(source)) {
			return false;
		}

		//download from url and overwrite file zip
		var downloadfile = await common.getFileFromURL(url,source);
		if(downloadfile == false){
			return false;
		}
		
		zipfile = await this.readDirPromise(source);
		if(zipfile == false){
			return false;
		}
		var filename = source + '/' + zipfile[0];
		
		//extract file zip 
		console.log("Extracting.....");
		var extractfile = await common.extract(filename,'temps/update');
		if(extractfile == false){
			return false;
		}

		//Delete File Zip download
		filezip = await this.readDirPromise(source);
		if(filezip == false){
			return false;
		}
		
		filezip = filezip.slice(filezip.indexOf(zipfile[0]),1);
		filezip = source + '/' + filezip[0];
		fs.unlink(filezip,function(err){
			if (err) throw err;
		});
		
		//Copy to target folder
		ncp(source,target,function(err){
			if (err) throw err;
			//delete all file in temps
			console.log(target);
			fs.readdir(source,function(err,files){
				for(var i = 0;i<files.length;i++){
					var rmdir = source + '/' + files[i];
					rimraf(rmdir,function(err){
						if (err) throw err;
					})
				}
			})
			
			//remove temp folder
			rimraf(source, function () { 
				console.log('Updated done'); 
				callback();
			});
			
		})
	}
	
	//Find name zip file
	readDirPromise(path) {
		return new Promise(function(ok, notOk) {
		  fs.readdir(path, function(err, data) {
			  if (err) {
				notOk(err)
			  } else {
				ok(data)
			  }
		  })
		})
	}

	
}

module.exports = UpdateModule;