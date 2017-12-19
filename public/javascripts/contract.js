function Contract(instance) {
  this.instance = instance;
  this.init();
}

/**
 * wrapper all the call to the instance
 */
Contract.prototype.init = function() {
  var self = this;
  self.instance.abi.forEach(function(signature) {
    self[signature.name] = function() {
      var argsABI = signature.inputs;
      var outputsABI = signature.outputs;

      var callback = Array.prototype.pop.call(arguments);
      if (typeof(callback) != "function") {
        throw "the last arguments must be an callback function!";
      }

      if (arguments.length < argsABI.length) {
        var msg = signature.name + " needs " + argsABI.length + " parameters and 1 callback at least";
        return callback({
          message: msg
        });
      }

      var options = null;
      if (arguments.length == argsABI.length + 1) {
        options = Array.prototype.pop.call(arguments);
      }

      var args = [];
      for (var i = 0; i < argsABI.length; i++) {
        var arg = arguments[i];
        var abi = argsABI[i];
        //donothing if not string
        //TODO: handle non uint value
        args.push(arguments[i]);
      }

      if (options != null) {
        args.push(options);
      }

      args.push(function(err, result) {
        if (err) {
          return callback(err);
        } else {
          if (signature.constant) {
            if (outputsABI.length == 1) {
              return callback(null, _paserOutput(result, outputsABI[0].type));
            } else {
              var ret = [];
              for (var i = 0; i < outputsABI.length; i++) {
                ret.push(_paserOutput(result[i], outputsABI[i].type));
              }
              return callback(null, ret);
            }
          } else {
            //non constant, only return tx id
            return callback(null, result);
          }
        }
      });

      self.instance[signature.name].apply(self.instance, args);
    }
  });
}

function _paserOutput(raw, type) {
  if (type == "address") {
    return raw.toString();
  } else {
    return raw.toNumber();
  }
}

if (typeof(module) != "undefined") {
  module.export = Contract;
}
