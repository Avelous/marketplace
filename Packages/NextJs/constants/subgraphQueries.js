import { gql } from "@apollo/client"
import { Hero } from "web3uikit"

export const GET_ACTIVE_ITEMS = gql`
    {
        activeItems(
            first: 30
            where: { buyer: "0x0000000000000000000000000000000000000000" }
        ) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`
export const GET_ACTIVE_AUCTIONS = gql`
    {
        activeAuctions(first: 30, where: { expiry_gt: "0" }) {
            id
            bidder
            seller
            nftAddress
            tokenId
            price
            expiry
        }
    }
`

export const GET_SINGLE_AUCTION = gql`
    query getAuction($nftAddress: String, $tokenId: String!) {
        activeAuctions(where: { nftAddress: $nftAddress, tokenId: $tokenId }) {
            id
            bidder
            seller
            nftAddress
            tokenId
            price
            expiry
        }
    }
`

export const GET_SINGLE_ITEM = gql`
    query getItem($tokenId: String!, $nftAddress: String) {
        activeItems(where: { tokenId: $tokenId, nftAddress: $nftAddress }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`
