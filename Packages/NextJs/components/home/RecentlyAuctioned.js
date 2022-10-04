import Head from "next/head"
import Image from "next/image"
import { useMoralisQuery, useMoralis } from "react-moralis"
import NFTBoxAuction from "./NFTBoxAuction"
import Moralis from "moralis"
import networkMapping from "../../constants/networkMapping.json"
import * as queries from "../../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import { DatePicker } from "web3uikit"

export default function RecentlyAuctioned() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    let marketplaceAddress

    if (networkMapping[chainString]) {
        marketplaceAddress = networkMapping[chainString]["NftMarketplace"][0]
    }

    const {
        loading,
        error,
        data: auctionedNfts,
    } = useQuery(queries.GET_ACTIVE_AUCTIONS)
    console.log(auctionedNfts)

    return (
        <div className="">
            <h1 className="py-4 px-4 font-bold "> Recently Auctioned</h1>
            <div>
                {loading ? (
                    <div></div>
                ) : (
                    <div className="flex flex-auto overflow-x-auto  p-5">
                        {auctionedNfts.activeAuctions.map((nft) => {
                            const {
                                price,
                                nftAddress,
                                tokenId,
                                seller,
                                bidder,
                                expiry,
                            } = nft
                            console.log(new Date().getTime())
                            if (expiry * 1000 > new Date().getTime()) {
                                return (
                                    <NFTBoxAuction
                                        price={price}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        seller={seller}
                                        expiry={expiry}
                                        bidder={bidder}
                                        key={`${nftAddress}${tokenId}`}
                                    />
                                )
                            }
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
