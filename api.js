const express = require('express');
const bodyParser = require('body-parser');
const hre = require("hardhat");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const { ethers } = require("ethers");

const path = require('path');
const Miles2CoinsArtifact = require(path.join(__dirname, './artifacts/contracts/Miles2Coins.sol/Miles2Coins.json'));
const SampleCoinArtifact = require(path.join(__dirname, './artifacts/contracts/SampleCoin.sol/SampleCoin.json'));
const MilesTokenArtifact = require(path.join(__dirname, './artifacts/contracts/MilesToken.sol/MilesToken.json'));

const miles2CoinsABI = Miles2CoinsArtifact.abi;
const sampleCoinABI = SampleCoinArtifact.abi;
const milesTokenABI = MilesTokenArtifact.abi;

const miles2CoinsInterface = new ethers.Interface(miles2CoinsABI);
const sampleCoinInterface = new ethers.Interface(sampleCoinABI);
const milesTokenInterface = new ethers.Interface(milesTokenABI);

// Set up the provider specifically for the localhost network
const provider = new ethers.JsonRpcProvider("http://localhost:8545");

provider.getNetwork().then(network => {
    console.log(`Connected to network: ${network.name} (chainId: ${network.chainId})`);
}).catch(err => {
    console.error("Failed to connect to provider:", err);
});

// Helper function to obtain contracts
async function getContract(contractName, address) {
    const Contract = await hre.ethers.getContractFactory(contractName);
    return Contract.attach(address);
}

// Deploy SampleCoin
app.post('/deploySampleCoin', async (req, res) => {
    const SampleCoin = await hre.ethers.getContractFactory("SampleCoin");
    const sampleCoin = await SampleCoin.deploy(100000000);
    await sampleCoin.waitForDeployment();
    const sampleCoinAddress = await sampleCoin.getAddress();
    console.log(`SampleCoin deployed at: ${sampleCoinAddress}`);
    res.send(`SampleCoin deployed at: ${sampleCoinAddress}`);
});

// Deploy MilesToken
app.post('/deployMiles', async (req, res) => {
    const MilesToken = await hre.ethers.getContractFactory("MilesToken");
    const milesToken = await MilesToken.deploy();
    await milesToken.waitForDeployment();
    const milesTokenAddress = await milesToken.getAddress();
    console.log(`MilesToken deployed at: ${milesTokenAddress}`);
    res.send(`MilesToken deployed at: ${milesTokenAddress}`);
});

// Route to mint SampleCoin
app.post('/mintSampleCoin', async (req, res) => {
    const { address, amount } = req.body;
    const sampleCoin = await getContract("SampleCoin", address);
    const tx = await sampleCoin.mint(req.body.account, amount);
    await tx.wait();
    res.send(`Minted ${amount} SampleCoin to ${req.body.account}`);
});

// Route to mint Miles
app.post('/mintMiles', async (req, res) => {
    const { address, amount } = req.body;
    const milesToken = await getContract("MilesToken", address);
    const tx = await milesToken.mint(req.body.account, amount);
    await tx.wait();
    res.send(`Minted ${amount} Miles to ${req.body.account}`);
});

// Deploy Miles2Coins
app.post('/deployMiles2Coins', async (req, res) => {
    const { sampleCoinAddress, milesAddress } = req.body;
    
    const Miles2Coins = await hre.ethers.getContractFactory("Miles2Coins");
    const miles2Coins = await Miles2Coins.deploy(milesAddress, sampleCoinAddress);
    await miles2Coins.waitForDeployment();
    const miles2CoinsAddress = await miles2Coins.getAddress();
    console.log(`Miles2Coins deployed at: ${miles2CoinsAddress}`);
    res.send(`Miles2Coins deployed at: ${miles2CoinsAddress}`);
});

// Endpoint to place an offer
app.post('/placeOffer', async (req, res) => {
    const {
        miles2CoinsAddress, 
        milesTokenAddress, 
        sampleCoinAddress, 
        amount, 
        price, 
        isBuying, 
        accountIndex
    } = req.body;

    // Check if the account index is valid
    const accounts = await hre.ethers.getSigners();
    if (accountIndex < 0 || accountIndex >= accounts.length) {
        return res.status(400).send("Invalid account index");
    }

    const account = accounts[accountIndex];
    const miles2Coins = await getContract("Miles2Coins", miles2CoinsAddress);
    const milesToken = await getContract("MilesToken", milesTokenAddress);
    const sampleCoin = await getContract("SampleCoin", sampleCoinAddress);

    // Set up approval depending on the type of offer
    try {
        if (isBuying) {
            // If buying miles, approve SampleCoin
            await sampleCoin.connect(account).approve(miles2CoinsAddress, amount * price);
        } else {
            // If selling miles, approve MilesToken
            await milesToken.connect(account).setApprovalForAll(miles2CoinsAddress, amount);
        }

        // Place the offer after approval
        const tx = await miles2Coins.connect(account).placeOffer(amount, price, isBuying);
        await tx.wait();
        res.send(`Offer placed with amount: ${amount}, price: ${price}, by account index: ${accountIndex}`);
    } catch (error) {
        console.error("Error placing offer or setting allowance:", error);
        res.status(500).send("Failed to place offer or set allowance");
    }
});

// Endpoint to accept an offer
app.post('/acceptOffer', async (req, res) => {
    const {
        miles2CoinsAddress,
        milesTokenAddress,
        sampleCoinAddress,
        offerId,
        accountIndex
    } = req.body;

    // Check if the account index is valid
    const accounts = await hre.ethers.getSigners();
    if (accountIndex < 0 || accountIndex >= accounts.length) {
        return res.status(400).send("Invalid account index");
    }

    const account = accounts[accountIndex];
    console.log('Account:', account);
    const miles2Coins = await getContract("Miles2Coins", miles2CoinsAddress);
    const milesToken = await getContract("MilesToken", milesTokenAddress);
    const sampleCoin = await getContract("SampleCoin", sampleCoinAddress);

    try {
        // Retrieve offer details
        const offer = await miles2Coins.offers(offerId);
        
        // Set up approval depending on the type of offer
        if (offer.isBuying) {
            // Approve the transfer of MilesToken if it's a sale
            await milesToken.connect(account).setApprovalForAll(miles2CoinsAddress, offer.amount);
        } else {
            // Approve the transfer of SampleCoin if it's a purchase
            await sampleCoin.connect(account).approve(miles2CoinsAddress, offer.amount * offer.price);
        }

        // Accept the offer
        const tx = await miles2Coins.connect(account).acceptOffer(offerId);
        await tx.wait();
        res.send(`Offer ${offerId} accepted and marked as inactive by account index: ${accountIndex}`);
    } catch (error) {
        console.error("Error accepting offer or setting allowance:", error);
        res.status(500).send("Failed to accept offer or set allowance");
    }
});

// Endpoint to list all offers
app.get('/listOffers', async (req, res) => {
    const miles2CoinsAddress = req.query.miles2CoinsAddress;
    if (!miles2CoinsAddress) {
        return res.status(400).send("Miles2Coins contract address is required");
    }

    try {
        const miles2Coins = await getContract("Miles2Coins", miles2CoinsAddress);
        const lastOfferId = await miles2Coins.lastOfferId();
        const offers = [];

        for (let i = 1; i <= lastOfferId; i++) {
            const offer = await miles2Coins.offers(i);
            offers.push({
                id: i,
                trader: offer.trader,
                amount: offer.amount.toString(),
                price: offer.price.toString(),
                isBuying: offer.isBuying,
                isActive: offer.isActive
            });
        }

        res.json({
            totalOffers: lastOfferId.toString(),
            offers: offers
        });
    } catch (error) {
        console.error("Error fetching offers:", error);
        res.status(500).send("Failed to fetch offers");
    }
});

// Endpoint to check balances of SampleCoin and MilesToken
app.get('/checkBalances', async (req, res) => {
    const milesTokenAddress = req.query.milesTokenAddress;
    const sampleCoinAddress = req.query.sampleCoinAddress;
    
    const MILES_ID = 0;
    try {
        const [deployer, account1, account2] = await hre.ethers.getSigners();

        const milesToken = await getContract("MilesToken", milesTokenAddress);
        const sampleCoin = await getContract("SampleCoin", sampleCoinAddress);

        const balanceMilesAccount1 = await milesToken.balanceOf(account1.address, MILES_ID);
        const balanceMilesAccount2 = await milesToken.balanceOf(account2.address, MILES_ID);
        const balanceSampleCoinAccount1 = await sampleCoin.balanceOf(account1.address);
        const balanceSampleCoinAccount2 = await sampleCoin.balanceOf(account2.address);

        res.json({
            account1: {
                address: account1.address.toString(),
                miles: balanceMilesAccount1.toString(),
                sampleCoin: balanceSampleCoinAccount1.toString()
            },
            account2: {
                address: account2.address.toString(),
                miles: balanceMilesAccount2.toString(),
                sampleCoin: balanceSampleCoinAccount2.toString()
            }
        });
    } catch (error) {
        console.error("Error fetching balances:", error);
        res.status(500).send("Failed to fetch balances");
    }
});

// Endpoint to read and decode transactions
app.get('/readTransactions', async (req, res) => {
    const blockNumber = await provider.getBlockNumber();
    if (blockNumber === 0) {
        res.send("There are no blocks to display. Check if the node is running correctly and if transactions have been sent.");
        return;
    }

    let allTransactions = [];

    for (let i = 0; i <= blockNumber; i++) {
        const block = await provider.getBlock(i);
        if (block.transactions.length === 0) {
            continue;
        }

        for (const txHash of block.transactions) {
            const tx = await provider.getTransaction(txHash);
            const value = tx.value ? ethers.utils.formatEther(tx.value) : "0";
            let transactionDetail = {
                from: tx.from,
                to: tx.to,
                value: value,
                data: tx.data,
                gasPrice: tx.gasPrice.toString(),
                hash: tx.hash,
                decoded: null
            };

            // Try to decode the transaction with each contract
            [miles2CoinsInterface, sampleCoinInterface, milesTokenInterface].forEach(contractInterface => {
                if (!transactionDetail.decoded && tx.to && tx.data.slice(0, 10)) {
                    try {
                        const decoded = contractInterface.parseTransaction({ data: tx.data });
                        transactionDetail.decoded = {
                            contract: contractInterface.format(),
                            functionName: decoded.name,
                            args: decoded.args.map(arg => typeof arg === 'bigint' ? arg.toString() : arg)
                        };
                    } catch (error) {
                        // Do nothing if it fails, try the next one
                    }
                }
            });

            if (!transactionDetail.decoded) {
                transactionDetail.decoded = "Failed to decode transaction with any known ABI.";
            }

            allTransactions.push(transactionDetail);
        }
    }

    res.json(allTransactions);
});

// Endpoint to read events emitted by the Miles2Coins contract
app.get('/readEvents', async (req, res) => {
    const miles2CoinsAddress = req.query.miles2CoinsAddress; // The address must be passed via query string
    if (!miles2CoinsAddress) {
        return res.status(400).send("Miles2Coins contract address is required.");
    }

    try {
        const contract = new ethers.Contract(miles2CoinsAddress, miles2CoinsABI, provider);
        const latestBlockNumber = await provider.getBlockNumber();
        const fromBlock = 0; // Adjust as needed to avoid always reading from block 0
        const toBlock = latestBlockNumber;

        // Arrays to store events
        const offerPlacedEvents = await contract.queryFilter(contract.filters.OfferPlaced(), fromBlock, toBlock);
        const offerAcceptedEvents = await contract.queryFilter(contract.filters.OfferAccepted(), fromBlock, toBlock);

        // Format events for JSON output
        const formattedOfferPlaced = offerPlacedEvents.map(event => ({
            type: 'OfferPlaced',
            blockNumber: event.blockNumber,
            transactionIndex: event.transactionIndex,
            id: event.args.id.toString(),
            trader: event.args.trader,
            amount: event.args.amount.toString(),
            price: event.args.price.toString(),
            isBuying: event.args.isBuying
        }));

        const formattedOfferAccepted = offerAcceptedEvents.map(event => ({
            type: 'OfferAccepted',
            blockNumber: event.blockNumber,
            transactionIndex: event.transactionIndex,
            id: event.args.id.toString(),
            buyer: event.args.buyer,
            seller: event.args.seller,
            amount: event.args.amount.toString(),
            price: event.args.price.toString()
        }));

        // Combine all events into a response
        res.json({
            offerPlaced: formattedOfferPlaced,
            offerAccepted: formattedOfferAccepted
        });
    } catch (error) {
        console.error("Error reading events:", error);
        res.status(500).send("Failed to read events");
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
