const hre = require("hardhat");
const Miles2CoinsArtifact = require("../artifacts/contracts/Miles2Coins.sol/Miles2Coins.json");
const Miles2CoinsABI = Miles2CoinsArtifact.abi;

async function main() {
    const provider = new hre.ethers.JsonRpcProvider("http://localhost:8545");
    const network = await provider.getNetwork();
    console.log(`Connected to network: ${network.name} (chainId: ${network.chainId})`);

    const miles2CoinsAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const miles2Coins = new hre.ethers.Contract(miles2CoinsAddress, Miles2CoinsABI, provider);

    const latestBlockNumber = await provider.getBlockNumber();
    console.log(`Last block number: ${latestBlockNumber}`);

    console.log("Reading events emitted by Miles2Coins...");
    const fromBlock = 0;
    const toBlock = latestBlockNumber;

    // Read 'OfferPlaced' events
    const offerPlacedEvents = await miles2Coins.queryFilter(miles2Coins.filters.OfferPlaced(), fromBlock, toBlock);
    for (const event of offerPlacedEvents) {
        console.log("OfferPlaced Event:", {
            blockNumber: event.blockNumber,
            transactionIndex: event.transactionIndex,
            trader: event.args.trader,
            amount: event.args.amount.toString(),
            price: event.args.price.toString(),
            isBuying: event.args.isBuying,
            eventId: event.args.id.toString()
        });
    }

    // Read 'OfferAccepted' events
    const offerAcceptedEvents = await miles2Coins.queryFilter(miles2Coins.filters.OfferAccepted(), fromBlock, toBlock);
    for (const event of offerAcceptedEvents) {
        console.log("OfferAccepted Event:", {
            blockNumber: event.blockNumber,
            transactionIndex: event.transactionIndex,
            buyer: event.args.buyer,
            seller: event.args.seller,
            amount: event.args.amount.toString(),
            price: event.args.price.toString(),
            eventId: event.args.id.toString()
        });
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
