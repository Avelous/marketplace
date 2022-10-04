import { useEffect, useState } from "react"
import { Modal, Input, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../../constants/NftMarketplace.json"
import nftAbi from "../../constants/BasicNft.json"
import { ethers } from "ethers"

export default function BidNftModal({
    nftAddress,
    tokenId,
    isVisible,
    onClose,
    marketplaceAddress,
    currentBid,
}) {
    const dispatch = useNotification()
    const [priceToBidWith, setPriceToBidWith] = useState(0)

    const { runContractFunction } = useWeb3Contract()

    async function placeBid() {
        console.log("Bidding...")

        const price = ethers.utils
            .parseUnits(priceToBidWith, "ether")
            .toString()

        const bidOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "placeBid",
            msgValue: price,
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: bidOptions,
            onSuccess: () => handleBidSuccess(),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function handleBidSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Bid Success",
            title: "",
            position: "topR",
        })
    }

    async function handleNeedHigherBid() {
        dispatch({
            type: "failure",
            message: "Enter a higher Bid",
            title: "Need Higher Bid",
            position: "topR",
        })
    }

    async function handleZeroEntered() {
        dispatch({
            type: "failure",
            message: "No Value Entered",
            title: "Enter A value",
            position: "topR",
        })
    }

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                priceToBidWith < ethers.utils.formatEther(currentBid)
                    ? handleNeedHigherBid()
                    : priceToBidWith > 0 || priceToBidWith == null
                    ? placeBid()
                    : handleZeroEntered()
                onClose()
            }}
        >
            <Input
                label="Bid Price in ETH"
                name="Listing Price"
                type="number"
                onChange={(event) => {
                    setPriceToBidWith(event.target.value)
                }}
            />
        </Modal>
    )
}
