# Miles2Coins

Miles2Coins is a platform designed for trading tokenized airline miles (MilesToken) through Delivery versus Payment (DvP) transactions using a fictional stablecoin called SampleCoin. Built to operate on blockchain technology (currently supporting Ethereum only), Miles2Coins is presently intended for testing purposes and for experimenting with privacy solution integrations to protect user privacy.

## Overview

Miles2Coins consists of one Solidity smart contract (`Miles2Coins.sol`) and scripts written in JavaScript to interact with the application. Additionally, two smart contracts are used to manage tokens:
* **SampleCoin (`SampleCoin.sol`)** - Implements a fictional stablecoin.
* **MilesToken (`MilesToken.sol`)** - Manages tokenized airline miles.

The key functionalities supported by Miles2Coins include:
* `placeOffer` - Registers an offer to trade MilesTokens for SampleCoins or vice-versa.
* `listOffers` - Displays available offers.
* `acceptOffer` - Accepts an active offer and completes the trade.

The tokens created for use within Miles2Coins are:
* **MilesToken** - based on the ERC-1155 standard.
* **SampleCoin** - based on the ERC-20 standard.

## Prerequisites

The application is designed to run on a local Ethereum test network, with JavaScript code acting as a client to interact with the smart contracts. The required tools are:
* [Node.js](https://nodejs.org/en/download/) - tested with version v20.12.0.
* [Hardhat Network](https://github.com/NomicFoundation/hardhat) - tested with version v2.22.12.
* [Postman](https://www.postman.com/downloads/) can be used to simplify the process of sending HTTP requests and analyzing responses.

## Running the application

1. Install [Node.js](https://nodejs.org/en/download/).
2. Install [Postman](https://www.postman.com/downloads/) (optional).
3. Navigate to the application directory.
4. Install the necessary packages, including Hardhat:
   ```bash
   npm install
   ```
5. Compile the smart contracts using Hardhat:
   ```bash
   npx hardhat compile
   ```
6. Run the Hardhat Network Node:
   ```bash
   npx hardhat node
   ```
7. Start the Miles2Coins API:
   ```bash
   node api.js
   ```
8. (Optional) Start Postman and import the [Miles2Coins Collection](Miles2Coins_postman_collection.json). Send requests, modifying parameters as necessary.

## Private Miles2Coins DvP transactions

To enhance privacy during the DvP transaction process (trading MilesTokens for SampleCoins or vice versa), the privacy-preserving solution Anonymous Zether can be integrated into the application. For more details on Anonymous Zether, refer to its repository. Both [Anonymous Zether](https://github.com/dalmendra/anonymous-zether) and its [front-end client](https://github.com/dalmendra/anonymous-zether-client) have been added as submodules in the Miles2Coins project — you can find them in the [external](external) folder.