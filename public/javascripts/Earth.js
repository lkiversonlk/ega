var EarthContractAbi = [
	{
		"constant": true,
		"inputs": [
			{
				"name": "addr",
				"type": "address"
			}
		],
		"name": "gridsCount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "gridsSoldOut",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "earns",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "mapSize",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "minimalPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "gridIdx",
				"type": "uint256"
			},
			{
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "sellGrid",
		"outputs": [],
		"payable": false,
		"type": "function",
		"stateMutability": "nonpayable"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "gridIdx",
				"type": "uint256"
			},
			{
				"name": "state",
				"type": "uint8"
			}
		],
		"name": "setGridState",
		"outputs": [],
		"payable": false,
		"type": "function",
		"stateMutability": "nonpayable"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "buyGrid",
		"outputs": [],
		"payable": true,
		"type": "function",
		"stateMutability": "payable"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ownedGrids",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "grids",
		"outputs": [
			{
				"name": "state",
				"type": "uint8"
			},
			{
				"name": "owner",
				"type": "address"
			},
			{
				"name": "price",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "setMinimalPrice",
		"outputs": [],
		"payable": false,
		"type": "function",
		"stateMutability": "nonpayable"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "gridSold",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "getEarn",
		"outputs": [],
		"payable": false,
		"type": "function",
		"stateMutability": "nonpayable"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "fee",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"inputs": [
			{
				"name": "_size",
				"type": "uint256"
			},
			{
				"name": "_minPrice",
				"type": "uint256"
			},
			{
				"name": "_fee",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "constructor",
		"stateMutability": "nonpayable"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "gridIdx",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "buyer",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "GridBought",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "gridIdx",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "price",
				"type": "uint256"
			}
		],
		"name": "GridOnSell",
		"type": "event"
	}
];

function InitEarthContract(web3, address){
    var EarthContract = web3.eth.contract(EarthContractAbi);
    var earthInstance = EarthContract.at(address);

    return new Contract(earthInstance);
}

var registryAddresses = {
  "3": "0xf6366d46ce03ffc7afa2f029ccbeb9a45be7fccb"
}

var networkName = {
    "1": "Mainnet",
    "3": "Ropsten testnet",
    "4": "Rinkeby testnet",
};

if(typeof(exports) != "undefined"){
	exports.abi = EarthContractAbi;
	exports.contractAddrs = registryAddresses;
}
