const hre = require("hardhat");
require('console-stamp')(console, 'yyyy-mm-dd HH:MM:ss.l');

async function main() {
	console.log("Accepting order...");
    const [deployer, account1, account2] = await hre.ethers.getSigners();

    const offerId = 1;
    const miles2CoinsAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const milesTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const sampleCoinAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const Miles2Coins = await hre.ethers.getContractFactory("Miles2Coins");
    const miles2Coins = Miles2Coins.attach(miles2CoinsAddress);

    const MilesToken = await hre.ethers.getContractFactory("MilesToken");
    const milesToken = await MilesToken.attach(milesTokenAddress);

    const SampleCoin = await hre.ethers.getContractFactory("SampleCoin");
    const sampleCoin = await SampleCoin.attach(sampleCoinAddress);

    // Retrieving the offer by ID
    const offer = await miles2Coins.offers(offerId);
	
    if (offer.isBuying) {
        // The offer is a purchase, so account2 is selling miles
        console.log(`Approving ${offer.amount} MilesToken for the contract to handle...`);
        await milesToken.connect(account2).setApprovalForAll(miles2CoinsAddress, offer.amount);
    } else {
        // The offer is a sale, so account2 is buying miles
        const totalPrice = offer.amount * offer.price;
        console.log(`Approving ${totalPrice} SampleCoin for the contract to handle...`);
        await sampleCoin.connect(account2).approve(miles2CoinsAddress, totalPrice);
    }

    console.log(`Account2 is accepting the offer with ID ${offerId}...`);
    const tx = await miles2Coins.connect(account2).acceptOffer(offerId);
    await tx.wait();

    console.log("Offer accepted successfully. Transaction has been processed.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
