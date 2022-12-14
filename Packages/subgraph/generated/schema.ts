// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class ActiveItem extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ActiveItem entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ActiveItem must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("ActiveItem", id.toString(), this);
    }
  }

  static load(id: string): ActiveItem | null {
    return changetype<ActiveItem | null>(store.get("ActiveItem", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get buyer(): Bytes {
    let value = this.get("buyer");
    return value!.toBytes();
  }

  set buyer(value: Bytes) {
    this.set("buyer", Value.fromBytes(value));
  }

  get seller(): Bytes {
    let value = this.get("seller");
    return value!.toBytes();
  }

  set seller(value: Bytes) {
    this.set("seller", Value.fromBytes(value));
  }

  get nftAddress(): Bytes {
    let value = this.get("nftAddress");
    return value!.toBytes();
  }

  set nftAddress(value: Bytes) {
    this.set("nftAddress", Value.fromBytes(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value!.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get price(): BigInt | null {
    let value = this.get("price");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set price(value: BigInt | null) {
    if (!value) {
      this.unset("price");
    } else {
      this.set("price", Value.fromBigInt(<BigInt>value));
    }
  }
}

export class ItemListed extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ItemListed entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ItemListed must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("ItemListed", id.toString(), this);
    }
  }

  static load(id: string): ItemListed | null {
    return changetype<ItemListed | null>(store.get("ItemListed", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get seller(): Bytes {
    let value = this.get("seller");
    return value!.toBytes();
  }

  set seller(value: Bytes) {
    this.set("seller", Value.fromBytes(value));
  }

  get nftAddress(): Bytes {
    let value = this.get("nftAddress");
    return value!.toBytes();
  }

  set nftAddress(value: Bytes) {
    this.set("nftAddress", Value.fromBytes(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value!.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get price(): BigInt | null {
    let value = this.get("price");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set price(value: BigInt | null) {
    if (!value) {
      this.unset("price");
    } else {
      this.set("price", Value.fromBigInt(<BigInt>value));
    }
  }
}

export class ItemCanceled extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ItemCanceled entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ItemCanceled must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("ItemCanceled", id.toString(), this);
    }
  }

  static load(id: string): ItemCanceled | null {
    return changetype<ItemCanceled | null>(store.get("ItemCanceled", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get seller(): Bytes {
    let value = this.get("seller");
    return value!.toBytes();
  }

  set seller(value: Bytes) {
    this.set("seller", Value.fromBytes(value));
  }

  get nftAddress(): Bytes {
    let value = this.get("nftAddress");
    return value!.toBytes();
  }

  set nftAddress(value: Bytes) {
    this.set("nftAddress", Value.fromBytes(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value!.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }
}

export class ItemBought extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ItemBought entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ItemBought must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("ItemBought", id.toString(), this);
    }
  }

  static load(id: string): ItemBought | null {
    return changetype<ItemBought | null>(store.get("ItemBought", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get buyer(): Bytes {
    let value = this.get("buyer");
    return value!.toBytes();
  }

  set buyer(value: Bytes) {
    this.set("buyer", Value.fromBytes(value));
  }

  get nftAddress(): Bytes {
    let value = this.get("nftAddress");
    return value!.toBytes();
  }

  set nftAddress(value: Bytes) {
    this.set("nftAddress", Value.fromBytes(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value!.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get price(): BigInt | null {
    let value = this.get("price");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set price(value: BigInt | null) {
    if (!value) {
      this.unset("price");
    } else {
      this.set("price", Value.fromBigInt(<BigInt>value));
    }
  }
}

export class ActiveAuction extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ActiveAuction entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ActiveAuction must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("ActiveAuction", id.toString(), this);
    }
  }

  static load(id: string): ActiveAuction | null {
    return changetype<ActiveAuction | null>(store.get("ActiveAuction", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get bidder(): Bytes {
    let value = this.get("bidder");
    return value!.toBytes();
  }

  set bidder(value: Bytes) {
    this.set("bidder", Value.fromBytes(value));
  }

  get seller(): Bytes {
    let value = this.get("seller");
    return value!.toBytes();
  }

  set seller(value: Bytes) {
    this.set("seller", Value.fromBytes(value));
  }

  get nftAddress(): Bytes {
    let value = this.get("nftAddress");
    return value!.toBytes();
  }

  set nftAddress(value: Bytes) {
    this.set("nftAddress", Value.fromBytes(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value!.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get price(): BigInt {
    let value = this.get("price");
    return value!.toBigInt();
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }

  get expiry(): BigInt | null {
    let value = this.get("expiry");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set expiry(value: BigInt | null) {
    if (!value) {
      this.unset("expiry");
    } else {
      this.set("expiry", Value.fromBigInt(<BigInt>value));
    }
  }
}

export class ItemAuctioned extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ItemAuctioned entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ItemAuctioned must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("ItemAuctioned", id.toString(), this);
    }
  }

  static load(id: string): ItemAuctioned | null {
    return changetype<ItemAuctioned | null>(store.get("ItemAuctioned", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get seller(): Bytes {
    let value = this.get("seller");
    return value!.toBytes();
  }

  set seller(value: Bytes) {
    this.set("seller", Value.fromBytes(value));
  }

  get nftAddress(): Bytes {
    let value = this.get("nftAddress");
    return value!.toBytes();
  }

  set nftAddress(value: Bytes) {
    this.set("nftAddress", Value.fromBytes(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value!.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get price(): BigInt {
    let value = this.get("price");
    return value!.toBigInt();
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }

  get expiry(): BigInt | null {
    let value = this.get("expiry");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set expiry(value: BigInt | null) {
    if (!value) {
      this.unset("expiry");
    } else {
      this.set("expiry", Value.fromBigInt(<BigInt>value));
    }
  }
}

export class AuctionCanceled extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save AuctionCanceled entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type AuctionCanceled must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("AuctionCanceled", id.toString(), this);
    }
  }

  static load(id: string): AuctionCanceled | null {
    return changetype<AuctionCanceled | null>(store.get("AuctionCanceled", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get seller(): Bytes {
    let value = this.get("seller");
    return value!.toBytes();
  }

  set seller(value: Bytes) {
    this.set("seller", Value.fromBytes(value));
  }

  get nftAddress(): Bytes {
    let value = this.get("nftAddress");
    return value!.toBytes();
  }

  set nftAddress(value: Bytes) {
    this.set("nftAddress", Value.fromBytes(value));
  }

  get tokenId(): BigInt | null {
    let value = this.get("tokenId");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set tokenId(value: BigInt | null) {
    if (!value) {
      this.unset("tokenId");
    } else {
      this.set("tokenId", Value.fromBigInt(<BigInt>value));
    }
  }
}

export class BidSuccess extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save BidSuccess entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type BidSuccess must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("BidSuccess", id.toString(), this);
    }
  }

  static load(id: string): BidSuccess | null {
    return changetype<BidSuccess | null>(store.get("BidSuccess", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get bidder(): Bytes {
    let value = this.get("bidder");
    return value!.toBytes();
  }

  set bidder(value: Bytes) {
    this.set("bidder", Value.fromBytes(value));
  }

  get nftAddress(): Bytes {
    let value = this.get("nftAddress");
    return value!.toBytes();
  }

  set nftAddress(value: Bytes) {
    this.set("nftAddress", Value.fromBytes(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value!.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get bid(): BigInt | null {
    let value = this.get("bid");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set bid(value: BigInt | null) {
    if (!value) {
      this.unset("bid");
    } else {
      this.set("bid", Value.fromBigInt(<BigInt>value));
    }
  }
}

export class BidWithdrawn extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save BidWithdrawn entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type BidWithdrawn must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("BidWithdrawn", id.toString(), this);
    }
  }

  static load(id: string): BidWithdrawn | null {
    return changetype<BidWithdrawn | null>(store.get("BidWithdrawn", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get bidder(): Bytes {
    let value = this.get("bidder");
    return value!.toBytes();
  }

  set bidder(value: Bytes) {
    this.set("bidder", Value.fromBytes(value));
  }

  get nftAddress(): Bytes {
    let value = this.get("nftAddress");
    return value!.toBytes();
  }

  set nftAddress(value: Bytes) {
    this.set("nftAddress", Value.fromBytes(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value!.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }
}

export class AuctionComplete extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save AuctionComplete entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type AuctionComplete must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("AuctionComplete", id.toString(), this);
    }
  }

  static load(id: string): AuctionComplete | null {
    return changetype<AuctionComplete | null>(store.get("AuctionComplete", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get buyer(): Bytes {
    let value = this.get("buyer");
    return value!.toBytes();
  }

  set buyer(value: Bytes) {
    this.set("buyer", Value.fromBytes(value));
  }

  get nftAddress(): Bytes {
    let value = this.get("nftAddress");
    return value!.toBytes();
  }

  set nftAddress(value: Bytes) {
    this.set("nftAddress", Value.fromBytes(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value!.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get price(): BigInt {
    let value = this.get("price");
    return value!.toBigInt();
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }
}
