const content = require('../app/controllers/content');
const  bsadmin = require('../app/controllers/bsadmin');


module.exports = function (app, passport) {

    app.get('/content/show', content.verifyAuth,  content.contentdetail);//content
    app.get('/content/edit', content.verifyAuth,   content.editdetail);//content
    app.post("/content/save", content.verifyAuth, content.save); // save the information  
    app.post("/content/show", content.verifyAuth,  content.show); //show data to content table
    app.post("/content/delete", content.verifyAuth,  content.delete); //delete record
    app.post("/content/edit", content.verifyAuth,  content.edit); //get the found and send GET request to render the found

}
