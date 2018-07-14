const  attribute = require('../app/controllers/attribute');


module.exports = function (app, passport) {
    app.get("/attribute_list", attribute.botconfigdetail)// render page default
	app.post("/attribute_show", attribute.botconfigdata)// send json data
    app.post("/newuseratt", attribute.newuseratt)//make user attribute
    app.post("/edituseratt", attribute.edituseratt)//edit user attribute
    app.post("/deluseratt", attribute.deluseratt)//delete user attribute
    app.post("/newbotatt", attribute.newbotatt)// make bit attribute
    app.post("/editbotatt", attribute.editbotatt)// edit bot attribute
    app.post("/delbotatt", attribute.delbotatt)// delete bot attribute
}
