var express = require('express');
var router = express.Router();
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");


var avatar_save_path = path.join(__dirname, "..", "avatars");
var grid_avatar_save_path = path.join(__dirname, "..", "grid_avatars");
var anonymous = path.join(__dirname, "..", "public", "images", "anonymous.jpg");

router.post('/avatar/upload', function(req, res, next){
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

    if(req.params.address == "0x0000000000000000000000000000000000000000"){
        return res.sendFile(anonymous);
    }

    if(fs.existsSync(path.join(avatar_save_path, req.params.address))){
        return res.sendFile(path.join(avatar_save_path, req.params.address));
    } else {
        return res.sendFile(anonymous);
    }
});

router.post("/grid_avatar/upload", function(req, res, next){
    // create an incoming form object
    var form = new formidable.IncomingForm();
    //form.uploadDir = path.join(__dirname, "..", "avatars");
    form.parse(req, function(err, fields, files){
        console.log("receive avatar");
        var address = fields.grid_idx;
        var image = files.upload;
        var err = fs.renameSync(image.path, path.join(grid_avatar_save_path, address));
        return res.sendStatus(200);
    });
});

router.get("/grid_avatar/get/:grid_idx", function(req, res, next){
    if(fs.existsSync(path.join(grid_avatar_save_path, req.params.grid_idx))){
        return res.sendFile(path.join(avatar_save_path, req.params.grid_idx));
    } else {
        return res.sendFile(anonymous);
    }
});

router.post('/locale', function (req, res) {
    var lan = req.param('lan');
    res.cookie('locale', lan || 'ch', {maxAge: 900000, httpOnly: true});
    return res.sendStatus(200);
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home', {title: '===TEST==='});
});

module.exports = router;
