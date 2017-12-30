var config = require("../config/config.json");
var DB = require("../db");
var Conf = require("../public/javascripts/configuration");
var inquirer = require('inquirer');

debugger;
/**
 * Listen on provided port, on all network interfaces.
 */
DB.connect(config.db_url, config.database, (err) => {
  if(err){
    console.log("connect mongo db failed: " + util.inspect(err));
    process.exit(-1);
  } else {
    var confService = new Conf();
    console.log(`connected to database ${config.database}`);
    console.log("connecting to db: " + DB.get());

    inquirer.prompt([
      {
        type: 'input',
        name: 'grid_idx',
        message: "input the grid number"
      }
    ]).then(answers => {
      if(false){
        console.log("program error" + JSON.stringify(answers));
      } else {

        var grid_idx = parseInt(answers.grid_idx)
        if(isNaN(grid_idx)){
          console.log(answers[0] + " is not valid");
        } else {
          console.log("delete grid " + grid_idx + " avatar");
          confService.forceReloadConf(confService.CATEGORY["GRID_CONF_CATEGORY"], grid_idx.toString(), (err, conf) => {
            if(err){
              console.log("failed: " + err);
            } else {
              console.log("current conf:" + JSON.stringify(conf));
              if(conf) {
                delete conf.avatar;
                confService.saveConf(confService.CATEGORY["GRID_CONF_CATEGORY"], grid_idx, conf, (err, conf) => {
                  if(err){
                    console.log("save conf fail: " + err);
                  } else {
                    console.log("saved conf: " + JSON.stringify(conf));
                  }
                });
              } else {
                console.log("conf is null");
              }
            }
          });
        }
      }
    });
  }
});
