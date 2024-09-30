// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MilesToken is ERC1155, Ownable(msg.sender) {
    
    uint256 public constant MILES_ID = 0; // Assuming a single miles type

    constructor() ERC1155("") {
    }

    // Function to mint tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, MILES_ID, amount, "");
    }
}