const hre = require("hardhat");
require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss.l');

async function main() {
	console.log("Listing offers...");
    const miles2CoinsAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const Miles2Coins = await hre.ethers.getContractFactory("Miles2Coins");
    const miles2Coins = await Miles2Coins.attach(miles2CoinsAddress);

    const lastOfferId = await miles2Coins.lastOfferId();
    console.log(`Total offers available: ${lastOfferId}`);

    console.log("Fetching all offers...");
    for (let i = 1; i <= lastOfferId; i++) {
        const offer = await miles2Coins.offers(i);
        if (offer.isActive) {
            console.log(`Offer ID: ${i}`);
            console.log(`  Trader: ${offer.trader}`);
            console.log(`  Amount: ${offer.amount.toString()}`);
            console.log(`  Price per mile/SampleCoin: ${offer.price.toString()}`);
            console.log(`  Is Buying: ${offer.isBuying}`);
            console.log(`  Is Active: ${offer.isActive}`);
        }
        else {
            console.log(`Offer ID: ${i} is inactive.`)
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});