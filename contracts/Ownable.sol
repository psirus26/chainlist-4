pragma solidity ^0.4.18;

contract Ownable {
    //state variables
    address contractOwner;

    //modifiers
    modifier onlyOwner() {
        require(msg.sender == contractOwner);
        _;
    }

    function Ownable() public {
        contractOwner = msg.sender;
    }
}