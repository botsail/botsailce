//import  site  from '../app/controllers/site';

const  package = require('../app/controllers/package');


module.exports = function (app, passport) {
    app.get('/bs-admin/packagelist', package.verifyAuth, package.packagelist);
    app.get('/bs-admin/packagelistinstalled', package.verifyAuth, package.packagelistinstalled);
    app.post('/bs-admin/updateplugin/', package.verifyAuth, package.updateplugin);
    app.post('/bs-admin/activeplugin/', package.verifyAuth, package.activeplugin);
    app.post('/bs-admin/unactiveplugin/', package.verifyAuth, package.unactiveplugin);

}
