const { ethers, network } = require("hardhat")
const { moveBlocks } = require("../utils/move-blocks")

const PRICE = ethers.utils.parseEther("0.01")

async function mintAndList() {
    const proxy = await ethers.getContract("TransparentUpgradeableProxy")
    const nftMarketplace = await ethers.getContractAt(
        "NftMarketplace",
        proxy.address
    )

    const randomNumber = Math.floor(Math.random() * 2)
    const basicNft = await ethers.getContract("BasicNft2")

    console.log("Minting NFT...")
    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.events[0].args.tokenId
    console.log(tokenId)
    console.log("Approving NFT...")
    const approvalTx = await basicNft.approve(nftMarketplace.address, tokenId)
    await approvalTx.wait(1)
    console.log("Listing NFT...")
    const listTx = await nftMarketplace.listItem(
        basicNft.address,
        tokenId,
        PRICE
    )

    console.log("NFT Listed!")
    if (network.config.chainId == 31337) {
        // Moralis has a hard time if you move more than 1 at once!
        await moveBlocks(1, (sleepAmount = 1000))
    }
}

mintAndList()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
