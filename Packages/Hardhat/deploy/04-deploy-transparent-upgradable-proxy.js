const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network, ethers } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const nftMarketplace = await ethers.getContract("NftMarketplace")

    const proxyAdmin = await ethers.getContract("ProxyAdmin")

    const args = [nftMarketplace.address, proxyAdmin.address, []]

    const proxy = await deploy("TransparentUpgradeableProxy", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        log("Verifying...")
        await verify(proxy.address, args)
    }
    log("------------------------------------------------------------")
}

module.exports.tags = ["all", "nftmarketplace"]
