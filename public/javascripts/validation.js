function signWithTimestamp(web3, callback){
  if(web3 && web3.personal && web3.eth && web3.eth.coinbase){
    var a = new Date();
    var timestamp = a.getTime().toString()
    
    web3.personal.sign(web3.sha3(timestamp), web3.eth.coinbase, function(err, data){
      if(err){
        return callback(err);
      } else {
        return callback(null, {
          timestamp: timestamp,
          data: data,
          address: web3.eth.coinbase
        });
      }
    });
  } else {
    return callback("condition")
  }
}