import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  AuctionCanceled as AuctionCanceledEvent,
  AuctionComplete as AuctionCompleteEvent,
  BidSuccess as BidSuccessEvent,
  BidWithdrawn as BidWithdrawnEvent,
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
  itemAuctioned as ItemAuctionedEvent,
  itemAuctioned,
} from "../generated/NftMarketplace/NftMarketplace";
import {
  ItemBought,
  ActiveItem,
  ItemListed,
  ItemCanceled,
  AuctionCanceled,
  AuctionComplete,
  BidSuccess,
  BidWithdrawn,
  ItemAuctioned,
  ActiveAuction,
} from "../generated/schema";

export function handleAuctionCanceled(event: AuctionCanceledEvent): void {
  let auctionCanceled = AuctionCanceled.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeAuction = ActiveAuction.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );

  if (!auctionCanceled) {
    auctionCanceled = new AuctionCanceled(
      getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }

  auctionCanceled.seller = event.params.seller;
  auctionCanceled.nftAddress = event.params.nftAddress;
  auctionCanceled.tokenId = event.params.tokenId;

  activeAuction!.bidder = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );
  activeAuction!.price = BigInt.fromString("0");
  activeAuction!.expiry = BigInt.fromString("0");

  auctionCanceled.save();
  activeAuction!.save();
}

export function handleAuctionComplete(event: AuctionCompleteEvent): void {
  let auctionComplete = AuctionComplete.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeAuction = ActiveAuction.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!auctionComplete) {
    auctionComplete = new AuctionComplete(
      getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
    );

    auctionComplete.buyer = event.params.buyer;
    auctionComplete.nftAddress = event.params.nftAddress;
    auctionComplete.tokenId = event.params.tokenId;
    auctionComplete.price = event.params.price;

    activeAuction!.price = event.params.price;
    activeAuction!.bidder = event.params.buyer;
    activeAuction!.expiry = BigInt.fromString("0");
  }
}

export function handleBidSuccess(event: BidSuccessEvent): void {
  let bidSuccess = BidSuccess.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeAuction = ActiveAuction.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );

  if (!bidSuccess) {
    bidSuccess = new BidSuccess(
      getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
    );

    bidSuccess.bidder = event.params.bidder;
    bidSuccess.nftAddress = event.params.nftAddress;
    bidSuccess.tokenId = event.params.tokenId;
    bidSuccess.bid = event.params.bid;

    activeAuction!.bidder = event.params.bidder;
    activeAuction!.price = event.params.bid;

    bidSuccess.save();
    activeAuction!.save();
  }
}

export function handleBidWithdrawn(event: BidWithdrawnEvent): void {
  let bidWithdrawn = BidWithdrawn.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeAuction = ActiveAuction.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );

  if (!bidWithdrawn) {
    bidWithdrawn = new BidWithdrawn(
      getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
    );

    bidWithdrawn.bidder = event.params.bidder;
    bidWithdrawn.nftAddress = event.params.nftAddress;
    bidWithdrawn.tokenId = event.params.tokenId;

    activeAuction!.bidder = Address.fromString(
      "0x0000000000000000000000000000000000000000"
    );
    activeAuction!.price = BigInt.fromString("0");
    activeAuction!.expiry = BigInt.fromString("0");

    bidWithdrawn.save();
    activeAuction!.save();
  }
}

export function handleItemBought(event: ItemBoughtEvent): void {
  let itemBought = ItemBought.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemBought) {
    itemBought = new ItemBought(
      getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemBought.buyer = event.params.buyer;
  itemBought.nftAddress = event.params.nftAddress;
  itemBought.tokenId = event.params.tokenId;
  activeItem!.buyer = event.params.buyer;

  itemBought.save();
  activeItem!.save();
}

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemCanceled = ItemCanceled.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );

  if (!itemCanceled) {
    itemCanceled = new ItemCanceled(
      getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemCanceled.seller = event.params.seller;
  itemCanceled.nftAddress = event.params.nftAddress;
  itemCanceled.tokenId = event.params.tokenId;

  activeItem!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  );

  itemCanceled.save();
  activeItem!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemListed) {
    itemListed = new ItemListed(
      getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  if (!activeItem) {
    activeItem = new ActiveItem(
      getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemListed.seller = event.params.seller;
  activeItem.seller = event.params.seller;

  itemListed.nftAddress = event.params.nftAddress;
  activeItem.nftAddress = event.params.nftAddress;

  itemListed.tokenId = event.params.tokenId;
  activeItem.tokenId = event.params.tokenId;

  itemListed.price = event.params.price;
  activeItem.price = event.params.price;

  activeItem.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );

  itemListed.save();
  activeItem.save();
}

export function handleitemAuctioned(event: ItemAuctionedEvent): void {
  let itemAuctioned = ItemAuctioned.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeAuction = ActiveAuction.load(
    getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemAuctioned) {
    itemAuctioned = new ItemAuctioned(
      getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  if (!activeAuction) {
    activeAuction = new ActiveAuction(
      getIdFomEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }

  itemAuctioned.seller = event.params.seller;
  itemAuctioned.nftAddress = event.params.nftAddress;
  itemAuctioned.tokenId = event.params.tokenId;
  itemAuctioned.price = event.params.price;
  itemAuctioned.expiry = event.params.expiry;

  activeAuction.seller = event.params.seller;
  activeAuction.nftAddress = event.params.nftAddress;
  activeAuction.tokenId = event.params.tokenId;
  activeAuction.price = event.params.price;
  activeAuction.expiry = event.params.expiry;
  activeAuction.bidder = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );

  itemAuctioned.save();
  activeAuction.save();
}

function getIdFomEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString();
}
