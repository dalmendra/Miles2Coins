const hre = require("hardhat");

async function main() {
    const Miles2Coins = await hre.ethers.getContractFactory("Miles2Coins");
    const miles2Coins = await Miles2Coins.deploy(
        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );
    
    await miles2Coins.waitForDeployment();
    const miles2CoinsAddress = await miles2Coins.getAddress();
    console.log("Miles2Coins deployed to:", miles2CoinsAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});