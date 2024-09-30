const hre = require("hardhat");

async function main() {
    const [deployer, account1] = await hre.ethers.getSigners();

    const sampleCoinAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const SampleCoin = await hre.ethers.getContractFactory("SampleCoin");
    const sampleCoin = SampleCoin.attach(sampleCoinAddress);

    console.log("Minting SampleCoins to account1...");
    const mintAmount = hre.ethers.parseUnits("1000",18); // Mint 1000 SampleCoins
    await sampleCoin.connect(deployer).mint(account1.address, mintAmount);

    console.log(`Minted ${mintAmount.toString()} SampleCoins to ${account1.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});