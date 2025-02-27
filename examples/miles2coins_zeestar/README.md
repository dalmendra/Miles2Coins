# Miles2Coins Implementation Using Zeestar for Privacy

This guide provides step-by-step instructions on how to implement Miles2Coins using Zeestar (zkay v0.3) for enhanced privacy.

## Prerequisites

This implementation of Miles2Coins leverages Zeestar as the underlying privacy solution.

- Refer to the [Miles2Coins README](https://github.com/dalmendra/Miles2Coins/tree/main/README.md) for general information about Miles2Coins.
- For Zeestar (zkay v0.3) details, check the [zkay README](https://github.com/dalmendra/zeestar/blob/master/README.md) and the [zkay tutorial](https://eth-sri.github.io/zkay/tutorial.html).
- [Docker Desktop](https://www.docker.com/) was used to run Zeestar inside a container, where Miles2Coins was deployed and executed.

## Main Application

The [miles2coins.zkay](miles2coins.zkay) file contains the Miles2Coins smart contract implemented using Zeestar.

## Overview

This implementation enhances Miles2Coins by leveraging Zeestar to improve privacy in the following aspects:

- Private token minting: The minting functions reveal the minted amounts only to the respective owners.
- Confidential token balances: Balances are private and can only be accessed by their respective owners.

Implemented Flow:
1. Deploy the Miles2Coins contract (`miles2coins.zkay`): Implements the core functionalities of Miles2Coins, including the main logic for MilesToken and SurrealToken.
2. Privately mint MilesTokens to Alice.
3. Privately mint SurrealTokens to Bob.
4. Alice and Bob privately check their balances.
5. Alice places an offer to sell MilesTokens.
6. Bob lists the available offers.
7. Bob accepts Alice's offer, completing the trade.
   - Transactions 5 through 7 are repeated 10 times.
8. Alice and Bob check their balances for MilesToken and SurrealToken after the transactions.

## Step-by-Step Guide

This step-by-step guide should be followed after installing Docker and running the zkay image - refer to the documents referenced in the [prerequisites](#prerequisites) section. Steps labeled `0.x` are preparatory and must be executed before running the actual example flow.

0.1 - Compile the `miles2coins.zkay` smart contract
   ```bash
   $ zkay compile miles2coins.zkay -o miles2coins_compiled
   ```

0.2. Start the interactive transaction shell using the `w3-eth-tester` backend:
   ```bash
   $ zkay run --blockchain-backend w3-eth-tester ./miles2coins_compiled/
   Using solc version v0.6.12
   Python 3.8.12 (default, Oct  9 2024, 16:54:36)
   [GCC 8.3.0] on linux
   Type "help", "copyright", "credits" or "license" for more information.
   (InteractiveConsole)
   >>>
   ```
1. Deploy the contract, create users, and mint tokens.  
   ```bash
   >>> exec(open('01_deploy_and_mint.py').read())
   ```
2. Execute 10 transaction flows between Alice and Bob.  
   ```bash
   >>> exec(open('02_10_flows.py').read())
   ```
3. Check Alice's and Bob's token balances. 
   ```bash
   >>> exec(open('03_check_balances.py').read())
   ```

## **Additional Files and Folders in This Directory**
- **[01_deploy_and_mint.py](01_deploy_and_mint.py)**: Python script that deploys the contract, creates users, and mints MilesTokens and SurrealTokens.
- **[02_10_flows.py](02_10_flows.py)**: Python script that executes 10 trade transactions, where Alice sells 1,000 MilesTokens to Bob for 2,000 SurrealTokens.
- **[03_check_balances.py](03_check_balances.py)**: Python script that allows Alice and Bob to check their final token balances.
- **[miles2coins.zkay](miles2coins.zkay)**: The Miles2Coins smart contract implemented using Zeestar (zkay v0.3).
- **[logs folder](logs)**: Contains compilation logs, execution logs from `zkay run` command and performance logs.