var express = require('express');
var router = express.Router();
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
var etherUtil = require("ethereumjs-util");

const avatar_save_path = path.join(__dirname, "..", "avatars");
const grid_avatar_save_path = path.join(__dirname, "..", "grid_avatars");
const anonymous = path.join(__dirname, "..", "public", "images", "anonymous.jpg");
const anonymous_grid = path.join(__dirname, "..", "public", "images", "flag.png");
const delay = 5 * 60 * 1000;

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
  res.setHeader('Content-Type', 'application/json');

  if (req.body && req.body.key && req.body.timestamp && req.body.address){
    const {
      key,
      address,
      timestamp: past,
    } = req.body

    const now = new Date().getTime();
    if (now - past < delay) {
      const signature = etherUtil.fromRpcSig(key);
      const pastHashed = etherUtil.sha3(past);
      const origin = Buffer.concat([prefix, new Buffer(String(pastHashed.length)), etherUtil.toBuffer(pastHashed)]);
      const originHashed = etherUtil.sha3(origin);

      const pub = etherUtil.ecrecover(originHashed, signature.v, signature.r, signature.s);
      const decryptedxs = etherUtil.bufferToHex(etherUtil.pubToAddress(pub));
      if (decryptedxs === address) {
        res.send(JSON.stringify({
          isOK: true,
          msg: 'You are lucky :)',
        }));

      } else {
        res.send(JSON.stringify({
          isOK: false,
          msg: 'Different address from agent',
        }));
      }

    } else {
      res.send(JSON.stringify({
        isOK: false,
        msg: 'Request timeout',
      }));
    }

  } else  {
    res.send(JSON.stringify({
      isOK: false,
      msg: 'Lack required arguments',
    }));
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', {
    title: '===TEST==='
  });
});

router.post('/test', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify({
    isOK: false,
    msg: 'Miao MiMi',
  }));
});

module.exports = router;
