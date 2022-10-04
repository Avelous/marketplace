import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  NftMarketplace,
  ItemBought as ItemBoughtEvent,
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
} from "../generated/NftMarketplace/NftMarketplace";
import {
  ItemBought,
  ActiveItem,
  ItemListed,
  ItemCanceled,
} from "../generated/schema";

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

function getIdFomEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString();
}
