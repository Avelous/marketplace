import { useEffect, useState } from "react"
import { Modal, Input, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../../constants/NftMarketplace.json"
import nftAbi from "../../constants/BasicNft.json"
import { ethers } from "ethers"

export default function ListNftModal({
    nftAddress,
    tokenId,
    isVisible,
    onClose,
    marketplaceAddress,
}) {
    const dispatch = useNotification()
    const [priceToListWith, setPriceToListWith] = useState(0)

    const { runContractFunction } = useWeb3Contract()

    

    async function approveAndList() {
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
        console.log("Ok! Now time to list")
        
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            },
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: handleListSuccess,
            onError: (error) => console.log(error),
        })
    }

    async function handleListSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "NFT listing",
            title: "NFT listed",
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
                    ? approveAndList()
                    : handleZeroEntered()
                onClose()
            }}
        >
            <Input
                label="Set Price in ETH"
                name="Listing Price"
                type="number"
                onChange={(event) => {
                    setPriceToListWith(event.target.value)
                }}
            />
        </Modal>
    )
}
