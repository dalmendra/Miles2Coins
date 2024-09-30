require("@nomicfoundation/hardhat-toolbox");
require('hardhat-gas-reporter');

module.exports = {
  defaultNetwork: "localhost",
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://localhost:8545",
      },
    hardhat: {
	  chainId: 1337,
	  hardfork: 'cancun',
	  initialDate: new Date().toString(),
      },
  },
  //solidity: "0.8.24",
  paths: {
    scripts: "./scripts",
  },
  mocha: {
    timeout: 20000,
  },
  gasReporter: {
	  enabled: true,
	  outputFile: "gas-report.txt",
	  noColors: true,
  }
};
