;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return (root.$validation = factory());
    });
  } else {
    root.$validation = factory();
  }
})(this, function() {
  return {
    signWithTimestamp: function(web3, callback) {
      if (web3 && web3.personal && web3.eth && web3.eth.coinbase) {
        var date = new Date();
        var timestamp = date.getTime().toString()

        web3.personal.sign(web3.sha3(timestamp), web3.eth.coinbase, function(err, key) {
          if (err) {
            return callback(err);
          } else {
            return callback(null, {
              key,
              timestamp: timestamp,
              address: web3.eth.coinbase,
            });
          }
        });
      } else {
        return callback("condition")
      }
    },
  };
})
