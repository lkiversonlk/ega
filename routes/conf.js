var express = require('express');
var router = express.Router();
var formidable = require("formidable");
var path = require("path");
var fs = require("fs");
var jsonfile = require("jsonfile");
var etherUtil = require("ethereumjs-util");

var avatar_save_path = path.join(__dirname, "..", "avatars");
var grid_avatar_save_path = path.join(__dirname, "..", "grid_avatars");
var anonymous = path.join(__dirname, "..", "public", "images", "anonymous.jpg");
var anonymous_grid = path.join(__dirname, "..", "public", "images", "flag.png");

router.get("/:category", function(req, res, next){
  var category = req.params['category'];

  var gridS = req.app.get("grid");

  if(gridS){
    gridS.GetConf(category, function(err, conf){
      if(err){
        //TODO: logging
        return res.sendStatus(500);
      } else {
        return res.json(conf);
      }
    });
  } else {
    return res.sendStatus(500);
  }
});



module.exports = router;
