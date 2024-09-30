const hre = require("hardhat");

async function main() {
    const MilesToken = await hre.ethers.getContractFactory("MilesToken");
    console.log("Deploying MilesToken...");

    const milesToken = await MilesToken.deploy();
    await milesToken.waitForDeployment();
  
    const milesTokenAddress = await milesToken.getAddress();
    console.log("MilesToken deployed to:", milesTokenAddress);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});