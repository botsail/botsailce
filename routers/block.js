const  block = require('../app/controllers/block');


module.exports = function (app, passport) {

    
    app.get('/show_block', block.verifyAuth, block.showBlock);
    app.post('/save_block', block.verifyAuth, block.saveBlock);
}
