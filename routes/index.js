var express = require('express');
var router = express.Router();
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");


var avatar_save_path = path.join(__dirname, "..", "avatars");
var anonymous = path.join(__dirname, "..", "public", "images", "anonymous.jpg");
router.post('/avatar/upload', function(req, res, next){
    console.log("request");
    // create an incoming form object
    var form = new formidable.IncomingForm();
    //form.uploadDir = path.join(__dirname, "..", "avatars");
    form.parse(req, function(err, fields, files){
        console.log("receive avatar");
        var address = fields.address;
        var image = files.upload;
        var err = fs.renameSync(image.path, path.join(avatar_save_path, address));
        return res.sendStatus(200);
    });  
});

router.get("/avatar/get/:address", function(req, res, next){
    if(fs.existsSync(path.join(avatar_save_path, req.params.address))){
        return res.sendFile(path.join(avatar_save_path, req.params.address));
    } else {
        return res.sendFile(anonymous);
    }
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home', {title: '===TEST==='});
});

module.exports = router;
