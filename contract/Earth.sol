pragma solidity ^0.4.11;

/**
 * Earth
 * ===============================================
 *
 * this contract represents the earth which has been devided into many small grids
 * player can call this contract to buy and sell grid.
 *
 */

contract Earth {

    enum GridState {
    OnSell,
    Owned,
    NotOpenned
    }

    struct Grid {
    GridState state;
    address owner;
    uint price;   //the selling price set by the owner
    }

    event GridBought(uint x, uint y, address buyer, uint price);
    event GridOnSell(uint x, uint y, address seller, uint price);

    mapping( uint => Grid) public grids;

    //record player's earnings and owned grids
    mapping( address => uint) public earns;
    mapping( address => uint[]) public ownedGrids; //TODO:

    address public owner;
    uint public minimalPrice;
    uint public fee;
    uint public mapSize;
    uint public gridSold;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier gridIndexValid(uint x, uint y){
        require(x >= 0 && x < mapSize && y >= 0 && y < mapSize);
        _;
    }

    modifier gridOnSell(uint x, uint y) {
        require(grids[x * mapSize + y].state == GridState.OnSell);
        _;
    }

    /**
     * require the grid owner if it's owned
     * otherwise require the contract owner
     */
    modifier gridOwner(uint x, uint y){
        var gOwner = grids[x * mapSize + y].owner;
        if(gOwner != 0xDead){
            require(gOwner == msg.sender);
        } else {
            require(msg.sender == owner);
        }
        _;
    }

    //the grid must not been bought yet
    modifier noneTaken(uint x, uint y) {
        require(grids[x * mapSize + y].owner == 0);
        _;
    }

    function Earth(uint _size, uint _minPrice, uint _fee) {
        owner = msg.sender;
        mapSize = _size;
        minimalPrice = _minPrice;
        fee = _fee;
    }


    function getGrid(uint x, uint y) internal constant returns (Grid) {
        return grids[x * mapSize + y];
    }

    function gridTransfer(uint index, address prevOwner, address newOwner) internal {
        if(prevOwner == newOwner) return;

        if(prevOwner != 0) {
            var length = ownedGrids[prevOwner].length;

            for (uint i = 0; i<length; i++){
                if(ownedGrids[prevOwner][i] == index) break;
            }

            require(i != length);

            ownedGrids[prevOwner][i] = ownedGrids[prevOwner][length - 1];
            ownedGrids[prevOwner].length = length - 1;
        }

        for (i = 0; i<ownedGrids[newOwner].length; i++){
            require(index != ownedGrids[newOwner][i]);
        }

        ownedGrids[newOwner].push(index);
    }

    /**
     * if the grid is not owned yet,
     * buyer must pay the minimal price, and it all goes to the contract
     * if the grid is already owned,
     * buyer must pay larger than the required price, the fee goes to the contract
     * and the rest goes to the previous owner;
     */
    function BuyGrid(uint x, uint y) payable gridIndexValid(x, y) gridOnSell(x, y){
        var index = x * mapSize + y;
        var previousOwner = getGrid(x, y).owner;

        if(getGrid(x, y).owner == 0) {
            require(msg.value >= minimalPrice);

            //update the owner
            //keep the change in the earns
            //keep the fee to the owner


            grids[index].owner = msg.sender;
            grids[index].state = GridState.Owned;

            earns[msg.sender] += (msg.value - minimalPrice);
            earns[owner] += minimalPrice;

            gridSold ++;
            gridTransfer(index, previousOwner, msg.sender);

            GridBought(x, y, msg.sender, minimalPrice);
        } else {
            require(msg.value >= grids[index].price);

            var charge = grids[index].price / 1000 * fee;

            grids[index].owner = msg.sender;
            grids[index].state = GridState.Owned;

            earns[msg.sender] += (msg.value - grids[index].price);
            earns[owner] += charge;
            earns[previousOwner] += (grids[index].price - charge);
            gridTransfer(index, previousOwner, msg.sender);

            GridBought(x, y, msg.sender, grids[index].price);
        }
    }

    /**
     * owner can set a price to mark a grid as sell
     */
    function SellGrid(uint x, uint y, uint price) gridIndexValid(x, y) gridOwner(x, y) {
        var index = x * mapSize + y;
        grids[index].price = price;
        grids[index].state = GridState.OnSell;

        GridOnSell(x, y, msg.sender, price);
    }

    function SetGridState(uint x, uint y, GridState state) gridIndexValid(x, y) gridOwner(x, y) {
        var index = x * mapSize + y;
        grids[index].state = state;
    }

    /**
     * player could claim their earnings
     */
    function GetEarn() {
        if(earns[msg.sender] > 0) {
            var value = earns[msg.sender];
            earns[msg.sender] = 0;
            msg.sender.transfer(value);
        }
    }

    function GridsCount(address addr) constant returns (uint) {
        return ownedGrids[addr].length;
    }
}