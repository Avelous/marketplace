require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const PRIVATE_KEY = process.env.PRIVATE_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        arbitrum: {
            url: process.env.ARBITRUM_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 42161,
            blockConfirmations: 6,
        },
        mainnet: {
            url: process.env.MAINNET_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 1,
            blockConfirmations: 6,
        },
        polygon_mainnet: {
            url: process.env.POLYGON_MAINNET_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 137,
            blockConfirmations: 6,
        },
        polygon_mumbai: {
            url: process.env.POLYGON_MUMBAI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 80001,
            blockConfirmations: 6,
        },
        goerli: {
            url: process.env.GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmations: 6,
        },
        hardhat: {
            chainId: 1337 || 31337,
            blockConfirmations: 1,
        },
        localhost: {
            chainId: 1337 || 31337,
            blockConfirmations: 1,
        },
    },
    gasReporter: {
        enabled: false,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
    },
    solidity: {
        compilers: [
            { version: "0.8.7" },
            { version: "0.6.6" },
            { version: "0.6.12" },
            { version: "0.4.19" },
        ],
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    mocha: {
        timeout: 500000,
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
}
