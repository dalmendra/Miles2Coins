// Import the Hardhat Runtime Environment (HRE) module
const hre = require("hardhat");

// Main asynchronous function that deploys the contract
async function main() {
  // Gets the SampleCoin contract factory from Hardhat
  const SampleCoin = await hre.ethers.getContractFactory("SampleCoin");
  
  // Deploys the SampleCoin contract with the reward parameter
  const sampleCoin = await SampleCoin.deploy(100000000);
  
  // Waits until the contract is deployed
  await sampleCoin.waitForDeployment();
  

  // Prints the address of the successfully deployed token contract
  const sampleCoinAddress = await sampleCoin.getAddress();
  console.log("SampleCoin deployed: ", sampleCoinAddress);
}

// Calls the main function and catches any errors that occurred
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
