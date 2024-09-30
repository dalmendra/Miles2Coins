const hre = require("hardhat");
const Miles2CoinsArtifact = require("../artifacts/contracts/Miles2Coins.sol/Miles2Coins.json");
const Miles2CoinsABI = Miles2CoinsArtifact.abi;
const MilesTokenArtifact = require("../artifacts/contracts/MilesToken.sol/MilesToken.json");
const MilesTokenABI = MilesTokenArtifact.abi;
const SampleCoinArtifact = require("../artifacts/contracts/SampleCoin.sol/SampleCoin.json");
const SampleCoinABI = SampleCoinArtifact.abi;

async function main() {
    const provider = new hre.ethers.JsonRpcProvider("http://localhost:8545");
    const network = await provider.getNetwork();
    console.log(`Connected to network: ${network.name} (chainId: ${network.chainId})`);

    const contracts = [
    new hre.ethers.Interface(Miles2CoinsABI),
    new hre.ethers.Interface(SampleCoinABI),
    new hre.ethers.Interface(MilesTokenABI)
    ];

    // Especifique o número do bloco que você deseja verificar
    const blockNumber = await provider.getBlockNumber();
    console.log(`Last block number: ${blockNumber}`);

    if (blockNumber === 0) {
        console.log("Não há blocos para exibir. Verifique se o nó está rodando corretamente e se transações foram enviadas.");
        return;
    }

    for (let i = 0; i <= blockNumber; i++) {
        console.log(`Reading transactions from block ${i}`);
        const block = await provider.getBlock(i);
        
        if (block.transactions.length === 0) {
            console.log(`No transaction found in block ${i}.`);
            continue;
        }

        for (const txHash of block.transactions) {
            const tx = await provider.getTransaction(txHash);
            console.log({
                from: tx.from,
                to: tx.to,
                value: hre.ethers.formatEther(tx.value),
                data: tx.data,
                gasPrice: tx.gasPrice.toString(),
                hash: tx.hash
            });

            let decoded = null;
            // Decoding the transaction with each available ABI
            for (const contract of contracts) {
                if (tx.to && tx.data.slice(0, 10)) {
                    try {
                        decoded = contract.parseTransaction({data: tx.data});
                        if (decoded) {
                            console.log("Decoded Transaction:", {
                                functionName: decoded.name,
                                args: decoded.args.map(arg => typeof arg === 'bigint' ? arg.toString() : arg)
                            });
                            break; // Break loop if decode is successful
                        }
                    } catch (error) {
                        // Silent fail. Tries next contract
                    }
                }
            }

            if (!decoded) {
                console.log("Failed to decode transaction with any provided ABI.");
            }
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
