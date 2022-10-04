import { useState, useEffect } from "react"
import { useMoralis } from "react-moralis"
import NFTBoxProfile from "./NFTBoxProfile"
import { NftExcludeFilters, Alchemy, Network } from "alchemy-sdk"
import chains from "../../constants/chains.json"
// import { createAlchemyWeb3 } from "@alch/alchemy-web3"

export default function Collected() {
    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const [nfts, setNfts] = useState({})
    const chainId = parseInt(chainIdHex).toString()
    const chainName = chains[`${chainId}`]
    const apiKey = process.env.NEXT_PUBLIC_ETH_GOERLI_API_ID

    console.log(process.env.NEXT_PUBLIC_ETH_GOERLI_API_ID)

    const settings = {
        apiKey: "oDlM2BQHkUXNoOR8AG8TJa8H-eMLRaud",
        network: Network[`${chainName}`],
    }

    let nftArray = []
    const alchemy = new Alchemy(settings)

    const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS

    // Get how many NFTs an address owns.
    async function getNfts() {
        const nftsObject = await alchemy.nft.getNftsForOwner(account)
        setNfts(nftsObject)
    }

    const ownedNfts = nfts.ownedNfts

    for (const user in ownedNfts) {
        const token = ownedNfts[user]
        const imageUri = token.media[0].gateway
        const nftAddress = token.contract.address.toString()
        const tokenId = token.tokenId
        const title = token.title
        const description = token.description

        const attributes = {
            imageUri: imageUri,
            nftAddress: nftAddress,
            tokenId: tokenId,
            title: title,
            description: description,
        }
        nftArray.push({ attributes: attributes })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            getNfts()
        }
    }, [account])

    return (
        <div className="flex items-center justify-center ">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5  p-5 ">
                {isWeb3Enabled ? (
                    nftArray.map((nft) => {
                        const {
                            imageUri,
                            tokenId,
                            nftAddress,
                            title,
                            description,
                        } = nft.attributes
                        const nftKey = nftAddress + "_#" + tokenId
                        return (
                            <NFTBoxProfile
                                imageUri={imageUri}
                                nftAddress={nftAddress}
                                tokenId={tokenId}
                                title={title}
                                description={description}
                                marketplaceAddress={marketplaceAddress}
                                nftKey={nftKey}
                                key={nftKey}
                            />
                        )
                    })
                ) : (
                    <div> Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
