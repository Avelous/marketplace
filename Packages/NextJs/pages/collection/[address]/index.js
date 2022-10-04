import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { useMoralis } from "react-moralis"
import NFTBox from "../../../components/home/NFTBox"
import { NftExcludeFilters, Alchemy, Network } from "alchemy-sdk"
import chains from "../../../constants/chains.json"

export default function NftCollection() {
    // const router = useRouter()
    // const { address } = router.query

    // const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    // const [nfts, setNfts] = useState([])
    // const chainId = parseInt(chainIdHex).toString()
    // const chainName = chains[`${chainId}`]
    // const apiKey = process.env.NEXT_PUBLIC_ETH_GOERLI_API_ID

    // const settings = {
    //     apiKey: "oDlM2BQHkUXNoOR8AG8TJa8H-eMLRaud",
    //     network: Network[`${chainName}`],
    // }

    // let nftArray = []
    // const alchemy = new Alchemy(settings)

    // const marketplaceAddress = process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS

    // // Get how many NFTs an address owns.
    // async function getNfts() {
    //     const nftsObject = await alchemy.nft.getNftsForContract(address)
    //     setNfts(nftsObject.nfts)
    // }

    // console.log(nfts)

    // useEffect(() => {
    //     if (isWeb3Enabled) {
    //         getNfts()
    //     }
    // }, [account])

    // {
    //     if (address)
    //         return (
    //             <di>
    //                 {address}
    //                 <div className="flex items-center justify-center border-2">
    //                     <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5  p-5 ">
    //                         {isWeb3Enabled && nfts ? (
    //                             nfts.map((nft) => {
    //                                 const imageUri = nft.media[0].gateway
    //                                 const nftAddress = nft.contract.address
    //                                 const tokenId = nft.tokenId
    //                                 return (
    //                                     <NFTBox
    //                                         imageUri={imageUri}
    //                                         nftAddress={nftAddress}
    //                                         tokenId={tokenId}
    //                                         marketplaceAddress={
    //                                             marketplaceAddress
    //                                         }
    //                                     />
    //                                 )
    //                             })
    //                         ) : (
    //                             <div> Web3 Currently Not Enabled</div>
    //                         )}
    //                     </div>
    //                 </div>
    //             </di>
    //         )
    // }
}
