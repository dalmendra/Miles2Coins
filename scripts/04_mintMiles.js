const hre = require("hardhat");

async function main() {
    const [deployer, account1, account2] = await hre.ethers.getSigners();

    const milesTokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const MilesToken = await hre.ethers.getContractFactory("MilesToken");
    const milesToken = MilesToken.attach(milesTokenAddress);

    console.log("Minting MilesTokens to account2...");
    const mintAmount = hre.ethers.parseUnits("5000", 18); // Mint 5000 MILES
    await milesToken.connect(deployer).mint(account2.address, mintAmount);

    console.log(`Minted ${mintAmount.toString()} MilesTokens to ${account2.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});