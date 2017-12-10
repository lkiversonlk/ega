var EarthContractAbi = [{"constant":false,"inputs":[{"name":"x","type":"uint256"},{"name":"y","type":"uint256"}],"name":"BuyGrid","outputs":[],"payable":true,"type":"function","stateMutability":"payable"},{"constant":false,"inputs":[{"name":"x","type":"uint256"},{"name":"y","type":"uint256"},{"name":"price","type":"uint256"}],"name":"SellGrid","outputs":[],"payable":false,"type":"function","stateMutability":"nonpayable"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"earns","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":true,"inputs":[],"name":"mapSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":true,"inputs":[],"name":"minimalPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":false,"inputs":[],"name":"GetEarn","outputs":[],"payable":false,"type":"function","stateMutability":"nonpayable"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":true,"inputs":[],"name":"gridSold","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"ownedGrids","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"grids","outputs":[{"name":"state","type":"uint8"},{"name":"owner","type":"address"},{"name":"price","type":"uint256"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"GridsCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":false,"inputs":[{"name":"x","type":"uint256"},{"name":"y","type":"uint256"},{"name":"state","type":"uint8"}],"name":"SetGridState","outputs":[],"payable":false,"type":"function","stateMutability":"nonpayable"},{"inputs":[{"name":"_size","type":"uint256"},{"name":"_minPrice","type":"uint256"},{"name":"_fee","type":"uint256"}],"payable":false,"type":"constructor","stateMutability":"nonpayable"},{"anonymous":false,"inputs":[{"indexed":false,"name":"x","type":"uint256"},{"indexed":false,"name":"y","type":"uint256"},{"indexed":false,"name":"buyer","type":"address"},{"indexed":false,"name":"price","type":"uint256"}],"name":"GridBought","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"x","type":"uint256"},{"indexed":false,"name":"y","type":"uint256"},{"indexed":false,"name":"seller","type":"address"},{"indexed":false,"name":"price","type":"uint256"}],"name":"GridOnSell","type":"event"}];

function InitEarthContract(web3, address){
    var EarthContract = web3.eth.contract(EarthContractAbi);
    var earthInstance = EarthContract.at(address);

    return new Earth(earthInstance);
}

function Earth(instance){
    this.ins = instance;
}

[
    'mapSize',
    'minimalPrice',
    'owner',
    'gridSold',
    'fee'
].forEach(function(fname){
    Earth.prototype[fname] = function(callback){
        return this.ins[fname].call(getSingleVal(callback));
    }
});

/*
Earth.prototype.mapSize = function(callback){
    return this.ins.mapSize.call(getSingleVal(callback));
}*/


function getSingleVal(callback){
    return function(err, result){
        if(err){
            return callback(err);
        } else if(result.hasOwnProperty('c')) {
            var c = result.c;

            if(Array.isArray(c) && c.length == 1){
                return callback(null, c[0]);
            } else {
                return callback(c);
            }
        } else {
            return callback(null, result);
        }
    }
}




var networkName = {
    "1": "Mainnet",
    "3": "Ropsten testnet",
    "4": "Rinkeby testnet",
};

var registryAddresses = {
    // Mainnet
//    "1": "0x314159265dd8dbb310642f98f50c066173c1259b",
    // Ropsten
    "3": "0xb97372c7cc8dd0c78fc8408604068d77302d6bb0"
    // Rinkeby
//    "4": "0xe7410170f87102DF0055eB195163A03B7F2Bff4A",
}

window.addEventListener('load', function() {
      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
        if(registryAddresses.hasOwnProperty(web3.version.network)){
            $("#status-network").html("Connect to " + networkName[web3.version.network]);                
        } else {
            $("#status-network").html("Network " + networkName[web3.version.network] + " unsupported yet");
            return;
        }
      } else {
        console.log('No web3? You should consider trying MetaMask!')
        $("#status-network").html("no ether network found");
        return;
      }
    
      var earth = window.earth = InitEarthContract(web3, registryAddresses[web3.version.network]);
      $("#status-contract").html(registryAddresses[web3.version.network]);
      
      StartEarth(earth);
});

function StartEarth(earth){
    earth.mapSize(function(err, size){
        if(err){
            //TODO:
        } else {
            $("#status-total-grids").html(size * size);
        }
    });

    earth.gridSold(function(err, sold){
        if(err){
            //TODO:
        } else {
            $("#status-sold-grids").html(sold);
        }
    });

    earth.fee(function(err, fee){
        if(err){
            //TODO:
        } else {
            $("#status-tran-fee").html(fee/1000);
        }
    });

    earth.minimalPrice(function(err, price){
        if(err){
            //TODO:
        } else {
            $("#status-min-price").html(web3.fromWei(price) + " ETH");
        }
    });
}