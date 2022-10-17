pragma solidity ^0.4.17;

contract Lottery{

    address public manager;

    address[] public players;/*this player array will store the addresses of the players and so here we identify players
    from their addresses*/

    function Lottery() public {

        /* whoever is trying to create the lottery contract, his address will be stored in manager
        since manager can be the only one who will tell the contract to execute and give out the money o the winner and so
        its imp to specify who is the manager*/
        manager = msg.sender;// we dont have to declare global variable; its already present with our code
    }
    function enter() public payable{/*the fnc is to enter the addresses of the player into the array
    payable means that whoever will execute this fnc will send some ether along with it and so the players could send the 
    money from which they buy their entry to the lottery*/

    require(msg.value > 0.01 ether);
    /* require is used to ensure that some conditions get fulfilled before the players enter into this lottery and here
    the conditon is that they pay .01 ether and so we use msg.value to get that money
    only after the requirement has been met the next line will be executed*/

        players.push(msg.sender);//msg.sender is a global variable to get the address of the players

    }
    function random() private view returns(uint) {/* we use this method as private  because we dont anyone else to call this
    method and here on remix we are only keeping it public for testing purposes*/

    /*keccak256 is the same thing as sha3  and it reurns a hexa decimal value and so putting it in parenthesis with uint
    will convert the hexa decimal value into positive integer value and then we will return it
    keccak256 is a global fnc and so no need to import it*/
     return uint(keccak256(block.difficulty, now, players));
     /*block difficulty, now(current time), are also global variables and so no need to import them as well*/
    }

    function pickWinner() public restricted{// modifier added to pickWinner fnc
        
        
        uint index = random() % players.length;
        players[index].transfer(this.balance); 
        /*transfer fnc transfer all the balance of the lottery to the winner and this.balance refers to the total balance
        of the lottery*/

        players = new address[](0);// we set the array players to empty dynamic array of type address
    }
    modifier restricted(){// we can choose any name for our modifier instead of restricted
        require(msg.sender == manager);/* we only want the manager to pick the winner and not any other player and so
        require will check whether the address calling the pickwinner fnc is of the manager's or not*/
           _;// part of modifier syntax
    }
    function getPlayers() public view returns (address[]){
        return players;
    }
}