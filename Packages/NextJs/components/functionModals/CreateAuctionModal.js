import { useEffect, useState } from "react"
import { Modal, Input, useNotification, DatePicker } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../../constants/NftMarketplace.json"
import nftAbi from "../../constants/BasicNft.json"
import { ethers } from "ethers"
import { DateTimePicker } from "@mui/x-date-pickers"
import months from "../../constants/months.json"

export default function CreateAuctionModal({
    nftAddress,
    tokenId,
    isVisible,
    onClose,
    marketplaceAddress,
}) {
    const dispatch = useNotification()
    const [priceToListWith, setPriceToListWith] = useState(0)
    const [timeStamp, setTimeStamp] = useState()

    const { runContractFunction } = useWeb3Contract()

    async function approveAndAuction() {
        console.log("Approving...")

        const price = ethers.utils
            .parseUnits(priceToListWith, "ether")
            .toString()

       

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
            params: approveOptions,
            onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price),
            onError: (error) => {
                console.log(error)
            },
        })
    }

    async function handleApproveSuccess(nftAddress, tokenId, price) {
        console.log("Ok! Now time to Auction")

        const expiry = timeStamp

        const auctionOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "createAuction",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                expiry: expiry,
                startingPrice: price,
            },
        }

        await runContractFunction({
            params: auctionOptions,
            onSuccess: handleAuctionSuccess,
            onError: (error) => console.log(error),
        })
    }

    async function handleAuctionSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "NFT Auctioned",
            title: "NFT Auctioned",
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
                priceToListWith > 0 || priceToListWith == null
                    ? approveAndAuction()
                    : handleZeroEntered()
                onClose()
            }}
        >
            <Input
                style={{ marginBottom: "15px", position: "relative" }}
                label="Set Price in ETH"
                name="Listing Price"
                type="number"
                onChange={(event) => {
                    setPriceToListWith(event.target.value)
                }}
            />
            <DatePicker
                style={{ marginTop: "30px" }}
                label="Set Expiry"
                type="Date"
                onChange={(event) => {
                    console.log(event.date.getTime())
                    const stamp = event.date.getTime()
                    const stampInSeconds = stamp / 1000
                    setTimeStamp(stampInSeconds)
                    console.log(timeStamp)
                }}
            />
        </Modal>
    )
}
