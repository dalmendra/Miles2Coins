// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Imports of necessary OpenZeppelin contracts for the ERC20 contract
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SampleCoin is ERC20, Ownable(msg.sender) {
    uint256 public blockReward;

    constructor(
        uint256 reward // Block reward
    ) ERC20("SampleCoin", "SREAL") {
        blockReward = reward * (10 ** decimals()); // Sets the block reward for the initial deployment
    }

    // Function to mint tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Internal function to mint the miner's reward
    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    // Validation of the miner's address before token transfer
    function _beforeTokenTransfer(
        address from,
        address to
    ) internal virtual {
        if (
            from != block.coinbase &&
            to != block.coinbase &&
            block.coinbase != address(0)
        ) {
            _mintMinerReward(); // Mints the miner's reward
        }
    }

    // Implementation of the contract's mint function
    function mintTokens(
        address account,
        uint256 amount
    ) internal virtual {
        ERC20._mint(account, amount);
    }
}