pragma solidity ^0.4.11;

/**
 * Earth
 * ===============================================
 *
 * this contract represents the earth planet run by eegalaxy
 * 
 * grids[address] store the status of each grid
 * earns[address] recored player earnings
 * ownedGrids[address] record the grid player owned
 * owner contract owner
 * minimalPrice current minimal Price
 */

contract Earth {
    function safeAdd(uint x, uint y) internal pure returns (uint) {
        uint ret = x + y;
        assert(ret >= x && ret >= y);
        return ret;
    }

    function safeMinus(uint x, uint y) internal pure returns (uint) {
        var ret = x - y;
        assert(ret >= 0 && ret <= x);
        return ret;
    }

    enum GridState {
        OnSell,
        Owned,
        NotOpenned
    }

    struct Grid {
        GridState state;
        address owner;
        uint price;       //the selling price set by the owner
        uint withdrawal;   //value withdrawal
    }

    event GridBought(uint gridIdx, address prevOwner, address buyer, uint price);
    event GridOnSell(uint gridIdx, address seller, uint price);

    bool public tradable;
    address public owner;
    uint public minimalPrice;
    uint public fee;
    uint public mapSize;  //how many grids per side
    uint public gridValue;
    //record player's earnings and owned grids
    mapping(address => uint[]) public ownedGrids;
    mapping(address => uint) public earns;
    mapping(uint => Grid) public grids;
    uint public gridSold;

    modifier onlyTradable() {
        require(tradable);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier gridIndexValid(uint gridIdx){
        require(gridIdx >= 0 && gridIdx < mapSize * mapSize);
        _;
    }

    modifier gridOnSell(uint gridIdx) {
        require(grids[gridIdx].state == GridState.OnSell);
        _;
    }

    /**
     * require grid owner if owned
     * contract owner if wild
     */
    modifier gridOwner(uint gridIdx){
        var gOwner = grids[gridIdx].owner;
        if (gOwner != 0) {
            require(gOwner == msg.sender);
        } else {
            require(msg.sender == owner);
        }
        _;
    }

    function Earth(uint _size, uint _minPrice, uint _fee) public {
        owner = msg.sender;
        mapSize = _size;
        require(_size * _size > _size);
        require(_size * _size / _size == _size);

        minimalPrice = _minPrice;
        fee = _fee;
        tradable = true;
    }

    /**
     * this function is only used for change the ownership of grids
     */
    function gridTransfer(uint index, address prevOwner, address newOwner) internal {
        if (prevOwner == newOwner) {
            return;
        }

        if (prevOwner != 0) {
            //remove the grid from prevOwner's owned grids
            var length = ownedGrids[prevOwner].length;

            for (uint i = 0; i<length; i++) {
                if (ownedGrids[prevOwner][i] == index) {
                    break;
                }
            }
            require(i != length);
            ownedGrids[prevOwner][i] = ownedGrids[prevOwner][length - 1];
            ownedGrids[prevOwner].length = length - 1;

            earns[prevOwner] += safeMinus(gridValue, grids[index].withdrawal);
        }
        
        grids[index].withdrawal = gridValue;

        //make sure the new owner doesn't have the grids
        for (i = 0; i<ownedGrids[newOwner].length; i++) {
            require(index != ownedGrids[newOwner][i]);
        }

        ownedGrids[newOwner].push(index);
    }

    //spread the money to gridValue
    function updateGridBase(uint money, address buyer) internal returns (uint) {
        var gridCount = gridSold - ownedGrids[buyer].length;
        uint baseAdd = 0;
        if (gridCount != 0) {
            baseAdd = money / gridCount;
        }
        gridValue += baseAdd;
        for (uint i = 0; i < ownedGrids[buyer].length; i ++){
            grids[ownedGrids[buyer][i]].withdrawal += baseAdd;
        }
        return gridCount * baseAdd;
    }

    /**
     * money except the fee goes to the prev owner;
     * fee will be shared by system and the current owner;
     * update gridValue so each grid's value is promoted
     * then withdrawal all the money in the grid and transfer it to prevOwner
     */
    function buyGrid(uint index) public payable gridIndexValid(index) gridOnSell(index) onlyTradable {
        var grid = grids[index];
        address prevOwner = grid.owner;
        uint price;
        uint charge;
        if (prevOwner == 0) {
            require(msg.value >= minimalPrice);
            price = minimalPrice;
            charge = price;
            gridSold += 1;
        } else {
            require(msg.value >= grid.price);
            price = grid.price;
            charge = grid.price / 1000 * fee;
        }
        grid.owner = msg.sender;
        grid.state = GridState.Owned;
        earns[msg.sender] += (msg.value - price); //return extra
        if (price > charge) {
            earns[prevOwner] += (price - charge); 
        }

        gridTransfer(index, prevOwner, msg.sender);
        charge = safeMinus(charge, updateGridBase(charge/2, msg.sender));
        //grid.withdrawal = gridValue; //empty the sold grid
        earns[owner] += charge;

        GridBought(index, prevOwner, msg.sender, price);
    }

    /**
     * owner can set a price to mark a grid as sell
     */
    function sellGrid(uint gridIdx, uint price) public gridIndexValid(gridIdx) gridOwner(gridIdx) onlyTradable {
        grids[gridIdx].price = price;
        grids[gridIdx].state = GridState.OnSell;

        GridOnSell(gridIdx, msg.sender, price);
    }

    function setGridOwned(uint gridIdx) public gridIndexValid(gridIdx) gridOwner(gridIdx) onlyTradable {
        grids[gridIdx].state = GridState.Owned;
    }

    /* only admin can forbidden non-sold grid */
    function forbiddenGrid(uint gridIdx) public gridIndexValid(gridIdx) onlyOwner {
        assert(grids[gridIdx].owner == 0);
        grids[gridIdx].state = GridState.NotOpenned;
    }

    /**
     * player could claim their earnings
     */
    function withdrawal() public onlyTradable {
        uint value = earns[msg.sender];
        earns[msg.sender] = 0;

        for (uint i = 0; i < ownedGrids[msg.sender].length; i ++) {
            value = safeAdd(value, safeMinus(gridValue, grids[ownedGrids[msg.sender][i]].withdrawal));
            grids[ownedGrids[msg.sender][i]].withdrawal = gridValue;
        }

        if (value > 0) {
            msg.sender.transfer(value);
        }
    }

    function withdrawalGrid(uint gridIdx) public gridIndexValid(gridIdx) gridOwner(gridIdx) onlyTradable {
        require(grids[gridIdx].owner != 0);
        uint value = safeMinus(gridValue, grids[gridIdx].withdrawal);
        grids[gridIdx].withdrawal = gridValue;
        msg.sender.transfer(value);
    }
    
    function totalEarned() public constant returns (uint) {
        uint value = earns[msg.sender];

        for (uint i = 0; i < ownedGrids[msg.sender].length; i ++) {
            value = safeAdd(value, safeMinus(gridValue, grids[ownedGrids[msg.sender][i]].withdrawal));
        }

        return value;
    }

    function gridsCount(address addr) public constant returns (uint) {
        return ownedGrids[addr].length;
    }

    function setMinimalPrice(uint price) public onlyOwner {
        minimalPrice = price;
    }
}