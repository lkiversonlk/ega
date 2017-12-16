var express = require('express');
var router = express.Router();
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");

router.post('/avatar/upload', function (req, res, next) {
    console.log("request");
    // create an incoming form object
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, "..", "public", "avatars");
    form.parse(req, function (err, fields, files) {
        console.log("receive avatar");
        var address = fields.address;
        var image = files.upload;
        var err = fs.renameSync(image.path, path.join(__dirname, "..", "public", "avatars", address));
        return res.sendStatus(200);
    });
});

router.post('/locale', function (req, res) {
    var lan = req.param('lan');
    res.cookie('locale', lan || 'ch', {maxAge: 900000, httpOnly: true});
    return res.sendStatus(200);
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home', {
        title: '===TEST===',
        locale: 'en'
    });
});

module.exports = router;
