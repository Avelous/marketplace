import Head from "next/head"
import Image from "next/image"
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBox from "./NFTBox"
import Moralis from "moralis"
import networkMapping from "../../constants/networkMapping.json"
import * as queries from "../../constants/subgraphQueries"
import { useQuery } from "@apollo/client"

export default function RecentlyListed() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    let marketplaceAddress

    if (networkMapping[chainString]) {
        marketplaceAddress = networkMapping[chainString]["NftMarketplace"][0]
    }

    const {
        loading,
        error,
        data: listedNfts,
    } = useQuery(queries.GET_ACTIVE_ITEMS)

    return (
        <div className="">
            <h1 className="py-4 px-4 font-bold "> Recently Listed</h1>
            <div>
                {loading ? (
                    <div></div>
                ) : (
                    <div className="flex flex-auto overflow-x-auto p-5">
                        {listedNfts.activeItems.map((nft) => {
                            const { price, nftAddress, tokenId, seller } = nft
                            return (
                                <NFTBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
