// scripts/placeOffer.js
const hre = require("hardhat");
require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss.l');

async function main() {
	console.log("Placing offer...");
    const [deployer, account1, account2] = await hre.ethers.getSigners();

	const buyingOffer = 0
	const milesAmount = 1000
	const pricePerMile = 2

    const miles2CoinsAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const milesTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const sampleCoinAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const Miles2Coins = await hre.ethers.getContractFactory("Miles2Coins");
    const miles2Coins = await Miles2Coins.attach(miles2CoinsAddress);

    const MilesToken = await hre.ethers.getContractFactory("MilesToken");
    const milesToken = await MilesToken.attach(milesTokenAddress);

    const SampleCoin = await hre.ethers.getContractFactory("SampleCoin");
    const sampleCoin = await SampleCoin.attach(sampleCoinAddress);

    const totalPrice = milesAmount * pricePerMile;
    console.log(`totalPrice = ${totalPrice}`);

    if (buyingOffer) { // Buying: approve and spend SampleCoin
        console.log(`Approving Miles2Coins to spend ${totalPrice} SampleCoin...`);
        await sampleCoin.connect(account1).approve(miles2CoinsAddress, totalPrice);
        console.log(`Account1 is placing an offer to buy ${milesAmount} miles at ${pricePerMile} SREAL each...`);
    } else { // Selling: approve and spend MilesToken
        console.log(`Approving Miles2Coins to spend ${milesAmount} MilesToken...`);
        await milesToken.connect(account1).setApprovalForAll(miles2CoinsAddress, milesAmount);
        console.log(`Account1 is placing an offer to sell ${milesAmount} miles at ${pricePerMile} SREAL each...`);
    }
    
    const tx = await miles2Coins.connect(account1).placeOffer(milesAmount, pricePerMile, buyingOffer);
    await tx.wait();

    console.log("Offer placed successfully.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
