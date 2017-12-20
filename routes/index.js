var express = require('express');
var router = express.Router();
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
var etherUtil = require("ethereumjs-util");

var avatar_save_path = path.join(__dirname, "..", "avatars");
var grid_avatar_save_path = path.join(__dirname, "..", "grid_avatars");
var anonymous = path.join(__dirname, "..", "public", "images", "anonymous.jpg");
var anonymous_grid = path.join(__dirname, "..", "public", "images", "flag.png");

router.post('/avatar/upload', function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    console.log("receive avatar");
    var address = fields.address;
    var image = files.upload;
    var err = fs.renameSync(image.path, path.join(avatar_save_path, address));
    return res.sendStatus(200);
  });
});

router.get("/avatar/get/:address", function(req, res, next) {

  if (req.params.address == "0x0000000000000000000000000000000000000000") {
    return res.sendFile(anonymous);
  }

  if (fs.existsSync(path.join(avatar_save_path, req.params.address))) {
    return res.sendFile(path.join(avatar_save_path, req.params.address));
  } else {
    return res.sendFile(anonymous);
  }
});

router.post("/grid_avatar/upload", function(req, res, next) {
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    console.log("receive avatar from grid");
    var address = fields.grid_idx;
    var image = files.upload;
    var err = fs.renameSync(image.path, path.join(grid_avatar_save_path, address));
    return res.sendStatus(200);
  });
});

router.get("/grid_avatar/get/:grid_idx", function(req, res, next) {
  if (fs.existsSync(path.join(grid_avatar_save_path, req.params.grid_idx))) {
    return res.sendFile(path.join(grid_avatar_save_path, req.params.grid_idx));
  } else {
    return res.sendFile(anonymous_grid);
  }
});

router.post('/locale', function(req, res) {
  var lan = req.param('lan');
  res.cookie('locale', lan || 'ch', {
    maxAge: 900000,
    httpOnly: true
  });
  return res.sendStatus(200);
});

const prefix = new Buffer("\x19Ethereum Signed Message:\n");

router.post("/sign", function(req, res){

  if(req.body && req.body.data && req.body.timestamp && req.body.address){
    var data = req.body.data;
    var timestamp = req.body.timestamp;
    var addr = req.body.address;

    var a = new Date();
    var real_time = a.getTime();

    //first validate 
    var signs = etherUtil.fromRpcSig(data);
    var hashed = etherUtil.sha3(timestamp);
    var origin = Buffer.concat([prefix, new Buffer(String(hashed.length)), etherUtil.toBuffer(hashed)]);
    origin = etherUtil.sha3(origin);

    var pub = etherUtil.ecrecover(origin, signs.v, signs.r, signs.s);
    var decryptedxs = etherUtil.bufferToHex(etherUtil.pubToAddress(pub));
    
  }
  return res.sendStatus(200);
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', {
    title: '===TEST==='
  });
});

module.exports = router;
