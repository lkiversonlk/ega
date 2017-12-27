var DB;
if(typeof(require) != "undefined"){
  DB = require("../../db");
}

function Configuration(){
  if (typeof(window) == "undefined") {
    this.server = true;
  } else {
    this.server = false;    
  }

  this.conf = {};
}

Configuration.prototype.CATEGORY = {
  "GRID_CONF_CATEGORY" : "grid",
}

Configuration.prototype.Params = {
  "GRID_PIC_URL_BASE" : "/grid_avatar/get/",
}

/**
 * getConf load conf from cache, not trigger reload
 * @param {*} category 
 * @param {*} id 
 * @param {*} callback 
 */
Configuration.prototype.getConf = function(category, id, callback){
  var self = this;
  if(self.conf.hasOwnProperty(category)){
    if(self.conf[category].hasOwnProperty(id)){
      return callback(null, self.conf[category][id]);
    } else {
      return callback();
    }
  } else {
    //of course not existed
    self.conf[category] = {};
    return callback();
  }
}
 
/**
 * loadConf will try to read from cache, if not exists, reload and update cache
 * @param {*} category 
 * @param {*} id 
 * @param {*} callback 
 */
Configuration.prototype.loadConf = function(category, id, callback){
  var self = this;
  self.getConf(category, id, (conf) => {
    if(conf){
      return callback(null, conf);
    } else {
      self._reload(category, id, (err, conf) => {
        if(!err){
          self.conf[category][id] = conf;
        }
        return callback(err, conf);
      });
    }
  });
}

/**
 * reload and update cache
 * @param {*} category 
 * @param {*} id 
 * @param {*} callback 
 */
Configuration.prototype.forceReloadConf = function(category, id, callback){
  var self = this;
  self._reload(category, id, (err, ret) => {
    if(err){
      return callback(err);
    } else {
      self.cacheConf(category, id, ret);
      return callback(null, ret);
    }
  });
}

Configuration.prototype._reload = function(category, id, callback){
  var self = this;

  //*server side reload from database
  if(self.server){
    //TODO: database
    var db = DB.get();
    if(db){
      var collection = db.collection(category);
      collection.findOne({_id: id}, callback);
    } else {
      return callback("db not connected");
    }
  } else {
    //client side reload from server
    var n = (new Date()).getTime();

    $.get("/conf/" + category + "?id=" + id + "&t=" + n, function(ret, success, xhr){
      return callback(null, ret);
    }).fail(function(){
      console.log("fail to reloa conf " + arguments.toString());
      return callback(FAIL_LOAD_CONF);
    });
  }
}

Configuration.prototype.cacheConf = function(category, id, conf){
  var self = this;
  if(!self.conf.hasOwnProperty(category)){
    self.conf[category] = {};
  }

  self.conf[category][id] = conf;
}

Configuration.prototype.saveConf = function(category, id, conf, callback){
  var self = this;
  if(self.server){
    var db = DB.get();
    conf["_id"] = id;
    var collection = db.collection(category);

    collection.findOneAndUpdate({_id: id}, conf, {upsert: true}, (err, ret) => {
      if(err){
        return callback(err);
      } else {
        console.log("cache conf " + JSON.stringify(conf));
        self.cacheConf(category, id, conf);
        return callback(null, conf);
      }
    });
  } else {
    //post to server
    $.post("/conf/" + category + "?id=" + id, conf, (xhr, ret) => {
      self.cacheConf(category, id, ret);
      return callback(null, ret);
    }).fail(() => {
      return callback(FAIL_SAVE_CONF);
    });
  }
}


var loadAllCalled = false;
Configuration.prototype.loadAllConf = function(category, callback){
  var self = this;
  if(self.server){
    var db = DB.get();
    var collection = db.collection(category);
    collection.find().toArray((err, docs) => {
      if(err){
        return callback(err);
      } else {
        var ret = {};
        docs.forEach((doc) => {
          ret[doc._id] = doc;
        });

        self.conf[category] = ret;
        return callback(null, ret);
      }
    });
  } else {
    $.get("/conf/" + category, function(conf, success, xhr){
      self.conf[category] = conf;
      return callback(null, conf);
    }).fail((err) => {
      return callback(FAIL_LOAD_CONF);
    })
  }
}


if(typeof(module) != "undefined"){
  module.exports = Configuration;
}