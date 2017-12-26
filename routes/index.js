var express = require('express');
var router = express.Router();
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
var etherUtil = require("ethereumjs-util");
var Grid = require("../public/javascripts/grids");

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

// Upload image together with validation address from user agent
const prefix = new Buffer("\x19Ethereum Signed Message:\n");

const verifyUser = (key, address, past) => {
  if (key && address && past) {
    const now = new Date().getTime();
    if (now - past < delay && past - now < delay) {
      const signs = etherUtil.fromRpcSig(key);
      const pastHashed = etherUtil.sha3(past);
      const origin = Buffer.concat([prefix, new Buffer(String(pastHashed.length)), etherUtil.toBuffer(pastHashed)]);
      const originHashed = etherUtil.sha3(origin);

      const pub = etherUtil.ecrecover(originHashed, signs.v, signs.r, signs.s);
      const decryptedxs = etherUtil.bufferToHex(etherUtil.pubToAddress(pub));
      if (decryptedxs === address) {
        return true

      } else {
        return false
      }
    } else {
      return false
    }
  } else {
    return false
  }
};

function uplodFail(res){
  res.send(JSON.stringify({
    isOK: false,
    msg: 'Server Error',
  }));
}

function uploadSuccess(res, ret){
  res.send(JSON.stringify({
    isOK: true,
    msg: 'You are lucky :)',
    data: ret,
  }));
}

router.post("/grid_avatar/upload", function(req, res, next) {  
  const form = new formidable.IncomingForm();
  var confService = req.app.get("configuration");
  form.parse(req, function(err, fields, files) {
    console.log("receive avatar from grid")

    const {
      grid_idx,
      signature,
    } = fields
    const {
      key,
      address: addr,
      timestamp: past,
    } = JSON.parse(signature)

    const isOK = verifyUser(key, addr, past);
    if (isOK === true) {
      const image = files.upload
      
      var filename = grid_idx + "-" + (new Date()).getTime();
      var err = fs.renameSync(image.path, path.join(grid_avatar_save_path, filename));

      if(err){
        return uplodFail(res);
      } else {
        confService.loadConf(
          confService.CATEGORY["GRID_CONF_CATEGORY"],
          grid_idx,
          (err, conf) => {
            if(err){
              return uplodFail(res);
            } else {
              if(!conf) conf = {};
              conf.avatar = filename;
              confService.saveConf(
                confService.CATEGORY["GRID_CONF_CATEGORY"],
                grid_idx,
                conf,
                (err, ret) => {
                  if(err){
                    return uplodFail(res);
                  } else {
                    return uplodFail(res, ret);
                  }
                }
              )
            }
          }
        )
      }
    } else {
      return uplodFail(res);
    }
  })
});

// End upload image together with validation address from user agent

router.get("/grid_avatar/get/:grid_idx", function(req, res, next) {
  if (fs.existsSync(path.join(grid_avatar_save_path, req.params.grid_idx))) {
    return res.sendFile(path.join(grid_avatar_save_path, req.params.grid_idx));
  } else {
    return res.sendFile(anonymous_grid);
  }
});

function delFail(res){
  return res.json(
    {
      isOK: false,
    });
}

router.post('/grid_avatar/del', function(req, res, next) {
  const {
    grid_idx,
    signature,
  } = req.body

  const {
    key,
    address: addr,
    timestamp: past,
  } = JSON.parse(signature)

  const isOK = verifyUser(key, addr, past);
  var confService = req.app.get("configuration");

  if (isOK === true) {
    //just remove the config
    confService.forceReloadConf(
      confService.CATEGORY["GRID_CONF_CATEGORY"],
      grid_idx,
      (err, conf) => {
        if(err){
          console.log("fail err" + err);
          return delFail(res);
        } else {
          if(!conf) conf = {};
          delete conf.avatar;
          confService.saveConf(
            confService.CATEGORY["GRID_CONF_CATEGORY"],
            grid_idx,
            conf,
            (err, conf) => {
              if(err) {
                console.log("del fail " + err);
                return delFail(res);
              } else {
                return res.json(
                  {
                    isOK: true
                  }
                );
              }
            }
          )
        }
      }
    )
    

  } else {
    return delFail(res);
  }
})

router.post('/locale', function(req, res) {
  var lan = req.param('lan');
  res.cookie('locale', lan || 'ch', {
    maxAge: 900000,
    httpOnly: true
  });
  return res.sendStatus(200);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  let env = req.app.get('env')

  if (env === 'development')
    env = false
  else
    env = true

  res.render('home', {
    production: env,
  });
});

module.exports = router;
