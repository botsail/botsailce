var User            = require('../models/entities/user');
var Metadata            = require('../models/entities/metadata');
var Controller            = require(global.appRoot + '/core/controller');
var Package				= require('../models/entities/package');
var request = require('request');
var fs = require('fs');
var Update = require("../../core/util/updatemodule");
var ncp = require('ncp').ncp;

class PackageController extends Controller {
	static verifyAuth(req, res, next) {
		supper(req, res, next);
	}

	static packagelist(req, res){

		let dataget;

		//Find data in collection packages
		Package.find({}, (err,found) => {

			let clientServerOptions = PackageController.senddatatoserver(found);

			request(clientServerOptions, (error, response, body) => {

				if (err) throw err;

				dataget = JSON.parse(body);
				dataget = dataget.table;

				res.render('pages/package_list', {data:dataget});
			});
		})
	}

	static packagelistinstalled(req, res){

		let datasend;
		let dataget;
		//Find data in collection packages
		Package.find({}, (err,found) => {
			
			let clientServerOptions = PackageController.senddatatoserver(found);

			//Send GET to server (POST in future)
			request(clientServerOptions, (error, response,body) => {
				if (err) throw err;

				dataget = JSON.parse(body);
				dataget = dataget.table;
				//Check data get from server with data send
				for(var i = 0;i<found.length;i++){
					for(var j = 0;j<dataget.length;j++){
						if( found[i].package_code == dataget[j].package_code){
							if(dataget[j].version_code > found[i].version_code){
								found[i].action_type = 'Update';
								found[i].path = dataget[j].path;
							}else{
								found[i].action_type = '';
							}
						}
					}
					if(found[i].status == 'active'){
						found[i].statusview = 'unactive';
					}else{
						found[i].statusview = 'active';
					}
				}

				res.render('pages/package_list_installed', {data:found});
			})
		})
	}

	//Update plugin
	static updateplugin(req, res){

		Controller.prototype.setResponse(req, res);

		const folder = req.body.packfolder;
		const pathfileunactive = fs.readFileSync(process.cwd() + '/packages/'+ folder + '/run/unactive.js', 'utf8');
		const pathfileactive = fs.readFileSync(process.cwd() + '/packages/' + folder + '/run/active.js', 'utf8');
		const urlfilezip = req.body.path;

		eval(pathfileunactive);
		Update.update(urlfilezip,'packages/'+folder, () => {
			eval(pathfileactive);

			Controller.prototype.sendMessage("success");
		});
		
	}
	//Unactive Plugin
	static unactiveplugin(req, res){

		Controller.prototype.setResponse(req, res);

		const folder = req.body.packfolder;
		const packname = req.body.packname;
		const target = process.cwd() + '/routers/' + packname + '.js';
		const pathfileactive = fs.readFileSync(process.cwd() + '/packages/'+ folder + '/run/active.js', 'utf8');
		//Change status active to unactive
		Package.update({'package_name': packname}, {$set: {status: 'unactive'}}, (err,found) => {
			if(fs.existsSync(target)){
				fs.unlink(target, err => {
					if (err) throw err;
				})
			}
			eval(pathfileactive);

			Controller.prototype.sendMessage("success");
		})
	}

	//Active Plugin
	static activeplugin(req, res){
		
		Controller.prototype.setResponse(req, res);

		const folder = req.body.packfolder;
		const packname = req.body.packname;
		const source = process.cwd() + '/packages/' + folder + '/routers/' + packname + '.js';
		const target = process.cwd() + '/routers/' + packname + '.js';		
		const pathfileunactive = fs.readFileSync(process.cwd() + '/packages/' + folder + '/run/unactive.js', 'utf8');
		//Change status unactive to active
		Package.update({'package_name': packname}, {$set: {status: 'active'}}, (err,found) => {
			ncp(source, target, err => {
				if (err) throw err;
				eval(pathfileunactive);
				
				Controller.prototype.sendMessage("success");
			})
		})
	}

	static senddatatoserver(found){
		let datasend;

		datasend = {
			package_code: [],
			version_code: []
		}

		found.forEach( pack => {
			datasend.package_code.push(pack.package_code);
			datasend.version_code.push(pack.version_code);
		})
		let clientServerOptions = {
			uri: 'http://localhost:8042/packages.json',
			qs: JSON.stringify(datasend),
			method: 'GET',
			/*headers: {
				'Content-Type': 'application/json'
			}*/
		}
		return clientServerOptions;
	}

}

module.exports = PackageController;