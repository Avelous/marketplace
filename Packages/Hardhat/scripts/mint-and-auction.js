const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.utils.parseEther("1.5")

async function mintAndAuction() {
    const proxy = await ethers.getContract("TransparentUpgradeableProxy")
    const nftMarketplace = await ethers.getContractAt(
        "NftMarketplace",
        proxy.address
    )

    const basicNft = await ethers.getContract("BasicNft2")
    const currentBlock = await ethers.provider.getBlock()
    const futureTime = currentBlock.timestamp + 24 * 10 * 60 * 60

    console.log("Minting NFT...")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.events[0].args.tokenId
    console.log(tokenId)
    console.log("Approving NFT...")
    const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId)
    await approvalTx.wait(1)
    console.log("Auctioning NFT...")
    const auctionTx = await nftMarketplace.createAuction(
        basicNft.address,
        tokenId,
        futureTime,
        PRICE
    )

    console.log("NFT Auctioned!")
    if (network.config.chainId == 31337) {
     await moveBlocks(1, (sleepAmount = 1000))
    }
}

mintAndAuction()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
