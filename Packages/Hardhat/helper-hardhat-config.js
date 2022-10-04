const networkConfig = {
    31337: {
        name: "localhost",
    },
    1337: {
        name: "localhost",
    },
    137: {
        name: "polygon_mainnet",
    },
    5: {
        name: "goerli",
    },
    80001: {
        name: "polygon_mumbai",
    },
    1: {
        name: "mainnet",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
