import { useEffect, useState } from "react"
import nftMarketplaceAbi from "../../constants/NftMarketplace.json"
import nftAbi from "../../constants/BasicNft.json"
import { useWeb3Contract, useMoralis } from "react-moralis"
import Image from "next/image"
import { Card, useNotification } from "web3uikit"
import { ethers } from "ethers"
import Link from "next/link"

const truncateString = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const seperator = "..."
    const seperatorLength = seperator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        seperator +
        fullStr.substring(fullStr.length - backChars)
    )
}

export default function NFTBoxAuction({
    price,
    nftAddress,
    tokenId,
    marketplaceAddress,
    seller,
    expiry,
    bidder,
}) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageUri, setImageUri] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => {
        setShowModal(false)
    }

    const dispatch = useNotification()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    async function updateUI() {
        const tokenURI = await getTokenURI()
        console.log(tokenURI)
        if (tokenURI) {
            const requestURL = tokenURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
            )
            const tokenURIResponse = await (await fetch(requestURL)).json()

            const imageURI = tokenURIResponse.image
            const imageURIURL = imageURI.replace(
                "ipfs://",
                "https://ipfs.io/ipfs/"
            )
            setImageUri(imageURIURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const isOwnedByUser = seller === account || seller === undefined
    const formattedSellerAddress = isOwnedByUser
        ? "you"
        : truncateString(seller || "", 15)

    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => {
                      console.log(error.code)
                      if (error.code == "INSUFFICIENT_FUNDS")
                          handleInsufficientFunds()
                  },
                  onSuccess: handleBuyItemSuccess,
              })
    }

    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Item Bought",
            title: "Item Bought",
            position: "topR",
        })
    }

    const handleInsufficientFunds = () => {
        dispatch({
            type: "error",
            message: "Insufficient Funds",
            title: "Need More Funds",
            position: "topR",
        })
    }

    const link = "/asset/" + nftAddress + "/" + tokenId

    return (
        <Link href={link}>
            <div className="cursor-pointer">
                {imageUri ? (
                    <div>
                        <div className="  rounded-md m-2 bg-zinc-900 h-max">
                            <div className="p-2">
                                <div className="flex justify-center w-full">
                                    <Image
                                        className=" flex rounded-md mb-10"
                                        loader={() => imageUri}
                                        src={imageUri}
                                        height="200"
                                        width="200"
                                        alt=""
                                    />
                                </div>
                                <div>
                                    <div>#{tokenId}</div>
                                    <div className="italic text-xs">
                                        Owned By {formattedSellerAddress}
                                    </div>
                                    <div className="text-xs truncate">
                                        {" Bid: "}
                                        {ethers.utils.formatUnits(
                                            price,
                                            "ether"
                                        )}{" "}
                                        ETH
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>Loading</div>
                )}
            </div>
        </Link>
    )
}
