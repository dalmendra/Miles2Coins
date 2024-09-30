const hre = require("hardhat");

async function main() {
    const [deployer,account1,account2] = await hre.ethers.getSigners();

    const sampleCoinAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const milesTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

    const SampleCoin = await hre.ethers.getContractFactory("SampleCoin");
    const MilesToken = await hre.ethers.getContractFactory("MilesToken");

    const sampleCoin = SampleCoin.attach(sampleCoinAddress);
    const milesToken = MilesToken.attach(milesTokenAddress);

    const balanceSampleCoin = await sampleCoin.balanceOf(account1.address);
    const balanceMiles = await milesToken.balanceOf(account1.address);

    console.log(`Balance of SampleCoin for ${account1.address}: ${hre.ethers.formatUnits(balanceSampleCoin, 18)} SampleCoins`);
    console.log(`Balance of MilesToken for ${account1.address}: ${hre.ethers.formatUnits(balanceMiles, 18)} Miles`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});