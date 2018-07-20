const  attribute = require('../app/controllers/attribute');


module.exports = function (app, passport) {
    app.get("/attribute_list",attribute.verifyAuth,  attribute.botconfigdetail)// render page default
	app.post("/attribute_show", attribute.verifyAuth, attribute.botconfigdata)// send json data
    app.post("/newuseratt", attribute.verifyAuth, attribute.newuseratt)//make user attribute
    app.post("/edituseratt", attribute.verifyAuth, attribute.edituseratt)//edit user attribute
    app.post("/deluseratt", attribute.verifyAuth, attribute.deluseratt)//delete user attribute
    app.post("/newbotatt", attribute.verifyAuth, attribute.newbotatt)// make bit attribute
    app.post("/editbotatt", attribute.verifyAuth, attribute.editbotatt)// edit bot attribute
    app.post("/delbotatt", attribute.verifyAuth, attribute.delbotatt)// delete bot attribute
}
