const user = require('../app/controllers/user');
var multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, global.appRoot + '/public' + req.session.user.user_public_folder); // set the destination
    },
    filename: function(req, file, callback){
        callback(null, Date.now() + "_" + file.originalname); // set the file name and extension
    }
});
const upload = multer({storage: storage});

module.exports = function (app, passport) {

    app.get("/profile", user.loggedIn, user.show)// show profile when login
    app.post("/profile/save", upload.single('image'), user.save)//save information user
}
