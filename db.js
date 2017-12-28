var MongoClient = require("mongodb").MongoClient;

var state = {
  db: null,
}

exports.connect = function(url, database, done){
  if(state.db) return done();
  else {
    MongoClient.connect(url, (err, db) => {
      if(err){
        return done(err);
      } else {
        state.db = db.db(database);
        return done();
      }
    });
  }
}

exports.get = function(){
  return state.db;
}

exports.close = function(done){
  if(state.db){
    state.db.close((err, result) => {
      state.db = null;
      state.mode = null;
      done(err);
    });
  }
}