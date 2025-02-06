# Miles2Coins/Anonymous Zether Private DvP Transaction Flow

The instructions below describe how to execute a DvP transaction with privacy using Anonymous Zether, after a user accepts an active offer in the Miles2Coins application.

## Prerequisites
- See the [README.md](https://github.com/dalmendra/Miles2Coins/tree/main) in the `main` directory for instructions on installing the prerequisites for Miles2Coins.
- See the [README.md](https://github.com/dalmendra/anonymous-zether/blob/hardhat/README.md) for the Anonymous Zether prerequisites.
- See the [README.md](https://github.com/dalmendra/anonymous-zether-client/blob/dvp/README.md) for the Anonymous Zether Client prerequisites.

## Overview

This flow demonstrates the DvP transaction executed through Anonymous Zether. It assumes that users Alice and Bob have already negotiated the parameters for performing a private DvP transaction.

1. Create an Ethereum account and a Zether shielded account for both the seller (Alice) and the buyer (Bob).
2. Authorize both accounts in Zether.
3. Mint MilesTokens (Erc1155Token) to Alice.
4. Mint SampleCoins (CashToken) to Bob.
5. Register Alice's and Bob's accounts to interact with ZSC tokens.
6. Deposit Zether tokens into Alice’s and Bob’s accounts. This funds the private ZSC contracts (ZSCRestricted and ZSCERC1155Restricted, representing the private versions of SampleCoins - CashToken - and MilesTokens - Erc1155Token -, respectively).
7. Create one-time Ethereum accounts for Alice and Bob.
8. At roughly the same time, Alice and Bob should execute the `StartDvP` function to initiate the private DvP transaction.
9. At roughly the same time, Alice and Bob should execute the `ExecuteDvP` function to complete the private DvP transaction.
10. Check Alice’s and Bob’s balances after the DvP transaction.

## Step-by-step Example Execution

This step-by-step guide should be followed after installing the [prerequisites](#prerequisites). Steps labeled `0.x` are preparatory and must be executed before running the actual example flow.

> **Note:** To simulate Alice (seller) and Bob (buyer), create two separate directories for the Anonymous Zether Client, as described [here](https://github.com/dalmendra/anonymous-zether-client/blob/dvp/README.md#configurations).

0.1. Open a terminal and navigate to the `anonymous-zether/packages/protocol` directory.
0.2. Compile the smart contracts using Hardhat:
   ```bash
   $ npx hardhat compile
   ```
0.3. Start the Hardhat Network Node:
   ```bash
   $ npx hardhat node
   Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
   Accounts
   ========
   WARNING: These accounts, and their private keys, are publicly known.
   Any funds sent to them on Mainnet or any other live network WILL BE LOST.
   Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
   Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
   Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
   Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
   Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
   (...)
   ```
0.4. Open a new terminal window, navigate again to `anonymous-zether/packages/protocol`, and deploy the Zether contracts:
   ```bash
   $ npm run deploy:local
   > @anonymous-zether/protocol@0.1.0 deploy:local
> npx hardhat run scripts/deploy.js --network localTest

Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Deployer private key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CashToken contract deployed to  0x5FbDB2315678afecb367f032d93F642f64180aa3
CashToken owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
ERC1155Token contract deployed to  0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
ERC1155Token owner: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
InnerProductVerifier deployed to  0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
ZetherVerifier deployed to  0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
BurnVerifier deployed to  0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
ZSCRestricted deployed to  0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
ZSCERC1155Restricted deployed to  0x0165878A594ca255338adfa4d48449f69242Eb8F
DvpZSC deployed to  0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
   ```
> **Important:** Before proceeding, make sure to set up the client directories and configurations for Alice and Bob, as described [here](https://github.com/dalmendra/anonymous-zether-client/blob/dvp/README.md#configurations). Additionally, ensure that the `NODE_PATH` variable is correctly set up, as explained [here](https://github.com/dalmendra/anonymous-zether-client/blob/dvp/README.md#dependencies).

0.5. Open another terminal window, navigate to the Anonymous Zether Client directory for Alice (seller), and start the client API:  
   ```bash
   $ node app.js
   (...)
   2025-02-06T21:20:11.639Z [INFO] Listening on port 3000
   ```

0.6. In another terminal window, navigate to the Anonymous Zether Client directory for Bob (buyer) and start the client API:
   ```bash
   $ node app.js
   (...)
   2025-02-06T21:22:26.404Z [INFO] Listening on port 3001
   ```
0.7. Open Postman and import the [anonzether-client-DvP collection](anonzether-client-DvP.postman_collection.json).  

> *Note:* The [anonzether-client-DvP collection](anonzether-client-DvP.postman_collection.json) is used in this guide to simplify HTTP requests through Postman, but the requests could also be made using `curl` or any other HTTP client.

0.8. Import the [anonzether-client environment](AnonZether.postman_environment.json) into Postman to configure the necessary variables.

0.9. In Postman, select the imported collection and associate it with the environment from step 0.8 to ensure the variables are correctly assigned.

1. Create Ethereum accounts and Zether Shielded Accounts. In Postman, run:  
	```bash
	01_Seller_CreateAccount
	01_Buyer_CreateAccount
	```
2. Authorize the accounts in Zether. In Postman, run:  
	```bash
	02_Seller_EnableAccount
	02_Buyer_EnableAccount
	``` 
3. Mint MilesTokens to Alice. In Postman, run:  
	```bash
	03_Seller_MintERC1155
	```
4. Mint SampleCoins to Bob. In Postman, run:  
	```bash
	04_Buyer_MintERC20
	```
5. Register Alice's and Bob's accounts to interact with ZSC tokens. In Postman, run:  
	```bash
	05_Seller_RegisterZSC1155Restricted
	05_Buyer_RegisterZSC1155Restricted
	05_Seller_RegisterZSCRestricted
	05_Buyer_RegisterZSCRestricted
	```
6. Deposit Zether Tokens to Alice and Bob. In Postman, run:  
	```bash
	06_Seller_FundShieldedAccountZSCERC1155Restricted
	06_Buyer_FundShieldedAccountZSCRestricted
	```
7. Create One-Time Ethereum Accounts. In Postman, run:  
	```bash
	07_Seller_CreateOnetimeSigner
	07_Buyer_CreateOnetimeSigner
	```
8. At roughly the same time, Alice and Bob should initiate the Private DvP Transaction. In Postman, run:  
	```bash
	08_Seller_StartDvP
	08_Buyer_StartDvP
	```
9. At roughly the same time, Alice and Bob should complete the Private DvP Transaction. In Postman, run:  
	```bash
	09_Seller_ExecuteDvP
	09_Buyer_ExecuteDvP
	```
10. Check Balances After the DvP Transaction. In Postman, run:  
	```bash
	10_Seller_GetBalanceZSCERC1155Restricted
	10_Buyer_GetBalanceZSCERC1155Restricted
	10_Seller_GetBalanceZSCRestricted
	10_Buyer_GetBalanceZSCRestricted
	```

## **Additional Files in This Example**
- **[anonzether-client-DvP.postman_collection.json](anonzether-client-DvP.postman_collection.json)**: JSON collection file to be imported into Postman for simplified HTTP request execution.
- **[AnonZether.postman_environment.json](AnonZether.postman_environment.json)**: JSON environment file to be imported and associated to the `anonzether-client-DvP` collection in Postman.
- **[hardhat_output.log](hardhat_output.log)**: Contains the full output from the Hardhat node, showing blockchain activities.
- **[anonzether_deploy.log](anonzether_deploy.log)**: Includes the output from the `npm run deploy:local` command.
- **[seller_client_app.log](seller_client_app.log)**: Contains all logs from the seller's client API.
- **[buyer_client_app.log](buyer_client_app.log)**: Contains all logs from the buyer's client API.
- **[requests_and_responses.log](requests_and_responses.log)**: A complete log of all executed requests and their corresponding responses.

---