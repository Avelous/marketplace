import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { Alchemy, Network } from "alchemy-sdk"
import chains from "../../../../constants/chains.json"
import Image from "next/image"
import * as queries from "../../../../constants/subgraphQueries"
import { useQuery } from "@apollo/client"
import { ethers } from "ethers"
import UpdateListingModal from "../../../../components/functionModals/UpdateListingModal"
import networkMapping from "../../../../constants/networkMapping.json"
import { useNotification } from "web3uikit"
import nftMarketplaceAbi from "../../../../constants/NftMarketplace.json"
import ListNftModal from "../../../../components/functionModals/ListNftModal"
import CreateAuctionModal from "../../../../components/functionModals/CreateAuctionModal"
import BidNftModal from "../../../../components/functionModals/BidNftModal"

export default function Id() {
    const router = useRouter()
    const { address, id } = router.query

    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    const [nft, setNft] = useState({})
    const [owner, setOwner] = useState()
    const [showModal, setShowModal] = useState(false)
    const [showBidModal, setShowBidModal] = useState(false)
    const [auctionModal, setAuctionModal] = useState(false)
    const hideModal = () => {
        setShowModal(false)
    }
    const hideBidModal = () => {
        setShowBidModal(false)
    }
    const hideAuctionModal = () => {
        setAuctionModal(false)
    }

    const chainId = parseInt(chainIdHex).toString()
    const chainName = chains[`${chainId}`]
    const apiKey = process.env.NEXT_PUBLIC_ETH_GOERLI_API_ID

    const settings = {
        apiKey: process.env.NEXT_PUBLIC_ETH_GOERLI_API_ID,
        network: Network[`${chainName}`],
        maxRetries: 10,
    }

    const {
        loading: auctionLoading,
        error: auctionError,
        data: auction,
    } = useQuery(queries.GET_SINGLE_AUCTION, {
        variables: { nftAddress: address, tokenId: id },
    })

    const {
        loading: itemLoading,
        error: itemError,
        data: item,
    } = useQuery(queries.GET_SINGLE_ITEM, {
        variables: { tokenId: id, nftAddress: address },
    })

    const alchemy = new Alchemy(settings)

    async function getNft() {
        const nft = await alchemy.nft.getNftMetadata(address, id)
        setNft(nft)
        const owner = await alchemy.nft.getOwnersForNft(address, id)
        setOwner(owner)
    }

    let imageUri,
        description,
        attributes = [],
        tokenStandard,
        tokenId,
        blockchain,
        tokenOwner,
        contractAddress,
        nftName,
        addressMap,
        marketplaceAddress

    if (owner) {
        tokenOwner = owner.owners[0]
    }

    const data = nft.rawMetadata

    if (data) {
        imageUri = nft.media[0].gateway
        description = data.description
        attributes = data.attributes
        tokenId = nft.tokenId
        contractAddress = nft.contract.address
        tokenStandard = nft.tokenType
        nftName = nft.contract.name
        console.log(nft)
        console.log(imageUri)
    }

    addressMap
    if (networkMapping[chainId]) {
        addressMap = networkMapping[chainId]["NftMarketplace"]
        if (addressMap) {
            marketplaceAddress = addressMap[0]
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            getNft()
        }
    }, [account, auction, item])

    async function cancelListing() {
        const cancelOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "cancelListing",
            params: {
                nftAddress: address,
                tokenId: id,
            },
        }

        await runContractFunction({
            params: cancelOptions,
            onSuccess: () => handleCancelSuccess,
            onError: (error) => {
                console.log(error)
            },
        })

        async function handleCancelSuccess(tx) {
            console.log(tx)
            await tx.wait(1)
            dispatch({
                type: "Success",
                message: "listing Canceled",
                title: "NFT Delisted",
                position: "topR",
            })
        }
    }

    console.log(item)

    async function cancelAucton() {
        const cancelOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "cancelAuction",
            params: {
                nftAddress: address,
                tokenId: id,
            },
        }

        await runContractFunction({
            params: cancelOptions,
            onSuccess: () => handleCancelSuccess,
            onError: (error) => {
                console.log(error)
            },
        })

        async function handleCancelSuccess(tx) {
            console.log(tx)
            await tx.wait(1)
            dispatch({
                type: "Success",
                message: "Auction Canceled",
                title: "NFT Delisted",
                position: "topR",
            })
        }
    }

    async function buyItem() {
        const price = item.activeItems[0].price
        const buyOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "buyItem",
            msgValue: price,
            params: {
                nftAddress: address,
                tokenId: id,
            },
        }

        await runContractFunction({
            params: buyOptions,
            onSuccess: () => handleBuySuccess,
            onError: (error) => {
                console.log(error)
            },
        })

        async function handleBuySuccess(tx) {
            console.log(tx)
            await tx.wait(1)
            dispatch({
                type: "Success",
                message: "Item Bought",
                title: "NFT Delisted",
                position: "topR",
            })
        }
    }

    async function acceptAuction() {
        const cancelOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "acceptAuction",
            params: {
                nftAddress: address,
                tokenId: id,
            },
        }

        await runContractFunction({
            params: cancelOptions,
            onSuccess: () => handleAuctionSuccess,
            onError: (error) => {
                console.log(error)
            },
        })

        async function handleAuctionSuccess(tx) {
            console.log(tx)
            await tx.wait(1)
            dispatch({
                type: "Success",
                message: "Auction Success",
                title: "Auction Complete",
                position: "topR",
            })
        }
    }

    return (
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 col-auto  p-20 xs:flex xs:items-center ">
            <div className="mb-3 m-1 rounded-sm flex ">
                <Image
                    className=" mx-auto rounded-md mb-10"
                    loader={() => imageUri}
                    src={imageUri}
                    height="500"
                    width="450"
                    alt=""
                />
            </div>
            <div className="flex flex-col justify-center mb-3">
                <div>
                    <p className="text-xl">
                        {nftName} #{tokenId}
                    </p>
                </div>
                {tokenOwner == account && !itemLoading && !auctionLoading ? (
                    item.activeItems.length > 0 &&
                    item.activeItems[0].buyer !=
                        0x000000000000000000000000000000000000dead ? (
                        <div>
                            <UpdateListingModal
                                isVisible={showModal}
                                tokenId={tokenId}
                                marketplaceAddress={marketplaceAddress}
                                nftAddress={address}
                                onClose={hideModal}
                            />
                            <p className="text-4xl">
                                Price:{" "}
                                {ethers.utils.formatUnits(
                                    item.activeItems[0].price,
                                    "ether"
                                )}{" "}
                                ETH
                            </p>
                            <button
                                className="border rounded-lg mr-2 mt-2 p-1 px-2"
                                onClick={() => {
                                    setShowModal(true)
                                }}
                            >
                                Update Listing
                            </button>
                            <button
                                className="border rounded-lg mr-2 mt-2 p-1 px-2"
                                onClick={cancelListing}
                            >
                                Cancel Listing
                            </button>
                        </div>
                    ) : auction.activeAuctions.length > 0 &&
                      auction.activeAuctions[0].expiry > 0 ? (
                        <div>
                            <p className="text-4xl">
                                Current Bid:{" "}
                                {ethers.utils.formatUnits(
                                    auction.activeAuctions[0].price,
                                    "ether"
                                )}{" "}
                                ETH
                            </p>
                            <p className="text-xl my-1">
                                Expiry:{" "}
                                {new Date(
                                    auction.activeAuctions[0].expiry * 1000
                                ).toDateString()}{" "}
                            </p>
                            <button
                                className="border rounded-lg mr-2 mt-2 p-1 px-2"
                                onClick={cancelAucton}
                            >
                                Cancel Auction
                            </button>
                            {auction.activeAuctions[0].bidder ==
                            0x0000000000000000000000000000000000000000 ? (
                                <div></div>
                            ) : (
                                <button
                                    className="border rounded-lg mr-2 mt-2 p-1 px-2"
                                    onClick={acceptAuction}
                                >
                                    Accept Auction
                                </button>
                            )}
                        </div>
                    ) : (
                        <div>
                            <ListNftModal
                                isVisible={showModal}
                                tokenId={tokenId}
                                marketplaceAddress={marketplaceAddress}
                                nftAddress={address}
                                onClose={hideModal}
                            />
                            <CreateAuctionModal
                                isVisible={auctionModal}
                                tokenId={tokenId}
                                marketplaceAddress={marketplaceAddress}
                                nftAddress={address}
                                onClose={hideAuctionModal}
                            />
                            <button
                                className="border rounded-lg mr-2 mt-2 p-1 px-2"
                                onClick={() => {
                                    setAuctionModal(true)
                                }}
                            >
                                Create Auction
                            </button>
                            <button
                                className="border rounded-lg mr-2 mt-2 p-1 px-2"
                                onClick={() => {
                                    setShowModal(true)
                                }}
                            >
                                List Item
                            </button>
                        </div>
                    )
                ) : item &&
                  item.activeItems.length > 0 &&
                  item.activeItems[0].buyer !=
                      0x000000000000000000000000000000000000dead ? (
                    <div>
                        <button
                            className="border rounded-lg mr-2 mt-2 p-1 px-2"
                            onClick={buyItem}
                        >
                            Buy Item
                        </button>
                    </div>
                ) : auction &&
                  auction.activeAuctions.length > 0 &&
                  auction.activeAuctions[0].expiry > 0 ? (
                    <div>
                        {" "}
                        <BidNftModal
                            isVisible={showBidModal}
                            tokenId={tokenId}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={address}
                            onClose={hideBidModal}
                            currentBid={auction.activeAuctions[0].price}
                            onCloseButtonPressed={hideBidModal}
                        />
                        <p className="text-4xl">
                            Current Bid:{" "}
                            {ethers.utils.formatUnits(
                                auction.activeAuctions[0].price,
                                "ether"
                            )}{" "}
                            ETH
                        </p>
                        <p className="text-xl my-1">
                            Expiry:{" "}
                            {new Date(
                                auction.activeAuctions[0].expiry * 1000
                            ).toDateString()}{" "}
                        </p>
                        <button
                            className="border rounded-lg mr-2 mt-2 p-1 px-2"
                            onClick={() => {
                                setShowBidModal(true)
                            }}
                        >
                            Place Bid
                        </button>
                    </div>
                ) : (
                    <div>Nft Not Listed or Auctioned</div>
                )}
            </div>
            <div className="mb-3 flex flex-col justify-center">
                <p className="mb-2 ">Description</p>
                <p className="text-sm">{description}</p>
            </div>
            <div className="mb-3 ">
                <p className="mb-2">Properties</p>
                {attributes ? (
                    attributes.map((attribute) => {
                        const { trait_type, value } = attribute
                        return (
                            <div
                                className=" grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3  "
                                key={value + trait_type}
                            >
                                <div className="text-sm border flex flex-col items-center p-2">
                                    <p className="mb-2">{trait_type}</p>
                                    <p>{value}% has this feature</p>
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div></div>
                )}
            </div>
            <div className="mb-3">
                <p>Details</p>
                <div>
                    <p>Contract Address:</p>
                    <p>{contractAddress}</p>
                </div>
                <div className="mb-1">
                    <p>Token Owner:</p>
                    <p>{tokenOwner}</p>
                </div>
                <div className="mb-1">
                    <p>Token Standard:</p>
                    <p>{tokenStandard}</p>
                </div>
            </div>
        </div>
    )
}
