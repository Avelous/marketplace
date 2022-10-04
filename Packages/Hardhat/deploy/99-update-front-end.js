const { ethers, network } = require("hardhat")
const frontEndContractsFile =
    "../nextjs/constants/networkMapping.json"
const frontEndAbiLocation = "../nextjs/constants/"
const fs = require("fs")

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log(`updating front end...`)
        await updateContractAddresses()
        await updateAbi()
    }
}

async function updateAbi() {
    const nftMarketplace = await ethers.getContract("NftMarketplace")
    const proxy = await ethers.getContractAt("TransparentUpgradeableProxy")
    const nftMarketplaceProxy = await ethers.getContract(
        "NftMarketplace",
        proxy.address
    )
    fs.writeFileSync(
        `${frontEndAbiLocation}NftMarketplace.json`,
        nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )

    const basicNft = await ethers.getContract("BasicNft")
    fs.writeFileSync(
        `${frontEndAbiLocation}BasicNft.json`,
        basicNft.interface.format(ethers.utils.FormatTypes.json)
    )

    fs.writeFileSync(
        `${frontEndAbiLocation}NftMarketplaceProxy.json`,
        nftMarketplaceProxy.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddresses() {
    const chainId = network.config.chainId.toString()
    const nftMarketplace = await ethers.getContract(
        "TransparentUpgradeableProxy"
    )
    const contractAddresses = JSON.parse(
        fs.readFileSync(frontEndContractsFile, "utf8")
    )
    if (chainId in contractAddresses) {
        if (
            !contractAddresses[chainId]["NftMarketplace"].includes(
                nftMarketplace.address
            )
        ) {
            contractAddresses[chainId]["NftMarketplace"].push(
                nftMarketplace.address
            )
        }
    } else {
        contractAddresses[chainId] = {
            NftMarketplace: [nftMarketplace.address],
        }
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
    // fs.writeFileSync(frontEndContractsFile2, JSON.stringify(contractAddresses))
}

// async function updateContractAddresses() {
//     const chainId = network.config.chainId.toString()
//     const nftMarketplace = await ethers.getContract("NftMarketplace")
//     const contractAddresses = JSON.parse(
//         fs.readFileSync(frontEndContractsFile, "utf8")
//     )
//     if (chainId in contractAddresses) {
//         if (
//             !contractAddresses[chainId]["NftMarketplace"].includes(
//                 nftMarketplace.address
//             )
//         ) {
//             contractAddresses[chainId]["NftMarketplace"].push(
//                 nftMarketplace.address
//             )
//         }
//     } else {
//         contractAddresses[chainId] = {
//             NftMarketplace: [nftMarketplace.address],
//         }
//     }
//     fs.writeFileSync(frontEndContractsFile, JSON.stringify(contractAddresses))
//     // fs.writeFileSync(frontEndContractsFile2, JSON.stringify(contractAddresses))
// }

module.exports.tags = ["all", "frontend"]
