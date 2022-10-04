import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AuctionCanceled,
  AuctionComplete,
  BidSuccess,
  BidWithdrawn,
  ItemBought,
  ItemCanceled,
  ItemListed,
  itemAuctioned
} from "../generated/NftMarketplace/NftMarketplace"

export function createAuctionCanceledEvent(
  seller: Address,
  nftAddress: Address,
  tokenId: BigInt
): AuctionCanceled {
  let auctionCanceledEvent = changetype<AuctionCanceled>(newMockEvent())

  auctionCanceledEvent.parameters = new Array()

  auctionCanceledEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  auctionCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  auctionCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return auctionCanceledEvent
}

export function createAuctionCompleteEvent(
  buyer: Address,
  nftAddress: Address,
  tokenId: BigInt,
  price: BigInt
): AuctionComplete {
  let auctionCompleteEvent = changetype<AuctionComplete>(newMockEvent())

  auctionCompleteEvent.parameters = new Array()

  auctionCompleteEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  auctionCompleteEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  auctionCompleteEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  auctionCompleteEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return auctionCompleteEvent
}

export function createBidSuccessEvent(
  bidder: Address,
  nftAddress: Address,
  tokenId: BigInt,
  bid: BigInt
): BidSuccess {
  let bidSuccessEvent = changetype<BidSuccess>(newMockEvent())

  bidSuccessEvent.parameters = new Array()

  bidSuccessEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )
  bidSuccessEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  bidSuccessEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  bidSuccessEvent.parameters.push(
    new ethereum.EventParam("bid", ethereum.Value.fromUnsignedBigInt(bid))
  )

  return bidSuccessEvent
}

export function createBidWithdrawnEvent(
  bidder: Address,
  nftAddress: Address,
  tokenId: BigInt
): BidWithdrawn {
  let bidWithdrawnEvent = changetype<BidWithdrawn>(newMockEvent())

  bidWithdrawnEvent.parameters = new Array()

  bidWithdrawnEvent.parameters.push(
    new ethereum.EventParam("bidder", ethereum.Value.fromAddress(bidder))
  )
  bidWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  bidWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return bidWithdrawnEvent
}

export function createItemBoughtEvent(
  buyer: Address,
  nftAddress: Address,
  tokenId: BigInt,
  price: BigInt
): ItemBought {
  let itemBoughtEvent = changetype<ItemBought>(newMockEvent())

  itemBoughtEvent.parameters = new Array()

  itemBoughtEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  itemBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  itemBoughtEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemBoughtEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return itemBoughtEvent
}

export function createItemCanceledEvent(
  seller: Address,
  nftAddress: Address,
  tokenId: BigInt
): ItemCanceled {
  let itemCanceledEvent = changetype<ItemCanceled>(newMockEvent())

  itemCanceledEvent.parameters = new Array()

  itemCanceledEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  itemCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  itemCanceledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return itemCanceledEvent
}

export function createItemListedEvent(
  seller: Address,
  nftAddress: Address,
  tokenId: BigInt,
  price: BigInt
): ItemListed {
  let itemListedEvent = changetype<ItemListed>(newMockEvent())

  itemListedEvent.parameters = new Array()

  itemListedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemListedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return itemListedEvent
}

export function createitemAuctionedEvent(
  seller: Address,
  nftAddress: Address,
  tokenId: BigInt,
  price: BigInt,
  expiry: BigInt
): itemAuctioned {
  let itemAuctionedEvent = changetype<itemAuctioned>(newMockEvent())

  itemAuctionedEvent.parameters = new Array()

  itemAuctionedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  itemAuctionedEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  itemAuctionedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  itemAuctionedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  itemAuctionedEvent.parameters.push(
    new ethereum.EventParam("expiry", ethereum.Value.fromUnsignedBigInt(expiry))
  )

  return itemAuctionedEvent
}
