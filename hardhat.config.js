require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
//  unused configuration commented out for now
    // mumbai: {
    //   url: "https://rpc-mumbai.maticvigil.com",
    //   accounts: process.env.POLYGON_NETWORK_PRIVATE_KEY,
    //   gasPrice: 35000000000,
    //   saveDeployments: true,
    // },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    artifacts: "./backend/artifacts",
    sources: "./backend/contracts",
    cache: "./backend/cache",
    tests: "./backend/test"
  },
};
