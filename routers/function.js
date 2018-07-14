const  func = require('../app/controllers/function');


module.exports = function (app, passport) {    
    app.get('/show_fnc', func.verifyAuth, func.showFunctionList);
    app.post('/save_fnc', func.verifyAuth, func.save);
}
