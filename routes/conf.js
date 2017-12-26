var express = require('express');
var router = express.Router();
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
var jsonfile = require("jsonfile");
var etherUtil = require("ethereumjs-util");
var util = require("util");

var avatar_save_path = path.join(__dirname, "..", "avatars");
var grid_avatar_save_path = path.join(__dirname, "..", "grid_avatars");
var anonymous = path.join(__dirname, "..", "public", "images", "anonymous.jpg");
var anonymous_grid = path.join(__dirname, "..", "public", "images", "flag.png");

function pre(req, res, next){
  var confService = req.app.get("configuration");
  if(!confService){
    //TODO: logging
    console.log("conf service not found");
    return res.sendStatus(500);
  } else {
    return next();
  }
}

router.get("/:category", pre, function(req, res, next){
  var category = req.params['category'];
  var confService = req.app.get("configuration");
  if(req.query.hasOwnProperty("id")){
    confService.loadConf(category, req.query.id, (err, conf) => {
      if(err){
        //TODO: logging
        console.log("fail to load conf: " + utli.inspect(err));
        return res.sendStatus(500);
      } else {
        console.log("get conf: " + JSON.stringify(conf));
        return res.json(conf);
      }
    });
  } else {
    confService.loadAllConf(category, (err, conf) => {
      if(err){
        //TODO: logging
        console.log("fail to load conf: " + utli.inspect(err));
        return res.sendStatus(500);
      } else {
        return res.json(conf);
      }
    })
  }
});

router.post("/:category", pre, function(req, res, next){
  var category = req.params['category'];
  var confService = req.app.get("configuration");
  if(req.query.hasOwnProperty("id")){
    confService.saveConf(category, req.query.id, req.body, (err, ret) => {
      if(err){
        return res.sendStatus(500);
      } else {
        return res.json(ret);
      }
    })
  } else {
    return res.sendStatus(500);
  }
});



module.exports = router;
