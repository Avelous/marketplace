const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Nft Marketplace Unit Tests", function () {
          let nftMarketplace,
              nftMarketplaceContract,
              basicNft,
              basicNftContract,
              futureTime,
              block,
              pastTime,
              secondUser,
              thirdUser
          const PRICE = ethers.utils.parseEther("0.1")
          const HIGHERPRICE = ethers.utils.parseEther("0.2")
          const TOKEN_ID = 0

          beforeEach(async () => {
              accounts = await ethers.getSigners() // could also do with getNamedAccounts
              deployer = accounts[0]
              user = accounts[1]
              secondUser = accounts[2]
              thirdUser = accounts[3]
              await deployments.fixture(["all"])
              nftMarketplaceContract = await ethers.getContract(
                  "NftMarketplace"
              )
              nftMarketplace = nftMarketplaceContract.connect(deployer)
              basicNftContract = await ethers.getContract("BasicNft")
              basicNft = await basicNftContract.connect(deployer)
              await basicNft.mintNft()
              await basicNft.approve(nftMarketplaceContract.address, TOKEN_ID)
              block = await ethers.provider.getBlock()
              futureTime = block.timestamp + 24 * 60 * 60 // + 1 day
              pastTime = block.timestamp - 24 * 60 * 60 // - 1 day
          })

          describe("listItem", function () {
              it("emits an event after listing an item", async function () {
                  expect(
                      await nftMarketplace.listItem(
                          basicNft.address,
                          TOKEN_ID,
                          PRICE
                      )
                  ).to.emit("ItemListed")
              })
              it("Give an error when relisting an already listed NFT", async function () {
                  await nftMarketplace.listItem(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith(
                      `NftMarketplace__AlreadyListed("${basicNft.address}", ${TOKEN_ID})`
                  )
              })
              it("Ensures only the owner of the NFT can list it", async function () {
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  await basicNft.approve(user.address, TOKEN_ID)
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NftMarketplace__NotOwner")
              })
              it("needs approvals to list item", async function () {
                  await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID)
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith(
                      "NftMarketplace__NotApprovedForMarketplace"
                  )
              })
              it("Updates listing with seller and price", async function () {
                  await nftMarketplace.listItem(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  const listing = await nftMarketplace.getListing(
                      basicNft.address,
                      TOKEN_ID
                  )
                  assert(listing.price.toString() == PRICE.toString())
                  assert(listing.seller.toString() == deployer.address)
              })
              it("Reverts when listing an Item with Zero Price", async function () {
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, 0)
                  ).to.be.revertedWith("NftMarketplace__PriceMustBeAboveZero")
              })
          })
          describe("cancelListing", function () {
              it("reverts if there is no listing", async function () {
                  await expect(
                      nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith(
                      `NftMarketplace__NotListed("${basicNft.address}", ${TOKEN_ID})`
                  )
              })
              it("reverts if anyone but the owner tries to call", async function () {
                  await nftMarketplace.listItem(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  await basicNft.approve(user.address, TOKEN_ID)
                  await expect(
                      nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith("NftMarketplace__NotOwner")
              })
              it("emits event and removes listing", async function () {
                  await nftMarketplace.listItem(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  expect(
                      await nftMarketplace.cancelListing(
                          basicNft.address,
                          TOKEN_ID
                      )
                  ).to.emit("ItemCanceled")
                  const listing = await nftMarketplace.getListing(
                      basicNft.address,
                      TOKEN_ID
                  )
                  assert(listing.price.toString() == "0")
              })
          })
          describe("buyItem", function () {
              it("reverts if the item isnt listed", async function () {
                  await expect(
                      nftMarketplace.buyItem(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith("NftMarketplace__NotListed")
              })
              it("reverts if the price isnt met", async function () {
                  await nftMarketplace.listItem(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  await expect(
                      nftMarketplace.buyItem(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith("NftMarketplace__PriceNotMet")
              })
              it("transfers the nft to the buyer and updates internal proceeds record", async function () {
                  await nftMarketplace.listItem(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  expect(
                      await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
                          value: PRICE,
                      })
                  ).to.emit("ItemBought")
                  const newOwner = await basicNft.ownerOf(TOKEN_ID)
                  const deployerProceeds = await nftMarketplace.getProceeds(
                      deployer.address
                  )
                  assert(newOwner.toString() == user.address)
                  assert(deployerProceeds.toString() == PRICE.toString())
              })
              it("Cancels a listing if the owner no longer owns the NFT", async function () {
                  await nftMarketplace.listItem(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  await basicNft.transferFrom(
                      deployer.address,
                      secondUser.address,
                      TOKEN_ID
                  )
                  expect(
                      await nftMarketplace
                          .connect(user)
                          .buyItem(basicNft.address, TOKEN_ID, {
                              value: PRICE,
                          })
                  ).to.emit("ItemCanceled")
              })
          })
          describe("updateListing", function () {
              it("must be owner and listed", async function () {
                  await expect(
                      nftMarketplace.updateListing(
                          basicNft.address,
                          TOKEN_ID,
                          PRICE
                      )
                  ).to.be.revertedWith("NftMarketplace__NotListed")
                  await nftMarketplace.listItem(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  await expect(
                      nftMarketplace.updateListing(
                          basicNft.address,
                          TOKEN_ID,
                          PRICE
                      )
                  ).to.be.revertedWith("NftMarketplace__NotOwner")
              })
              it("Reverts if the update price is zero", async function () {
                  await nftMarketplace.listItem(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  await expect(
                      nftMarketplace.updateListing(
                          basicNft.address,
                          TOKEN_ID,
                          0
                      )
                  ).to.be.revertedWith("NftMarketplace__PriceMustBeAboveZero")
              })
              it("updates the price of the item", async function () {
                  const updatedPrice = ethers.utils.parseEther("0.2")
                  await nftMarketplace.listItem(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  expect(
                      await nftMarketplace.updateListing(
                          basicNft.address,
                          TOKEN_ID,
                          updatedPrice
                      )
                  ).to.emit("ItemListed")
                  const listing = await nftMarketplace.getListing(
                      basicNft.address,
                      TOKEN_ID
                  )
                  assert(listing.price.toString() == updatedPrice.toString())
              })
          })
          describe("createAuction", function () {
              it("emits an event after creating an auction", async function () {
                  expect(
                      await nftMarketplace.createAuction(
                          basicNft.address,
                          TOKEN_ID,
                          futureTime,
                          PRICE
                      )
                  ).to.emit("itemAuctioned")
              })
              it("reverts if anyone but the owner tries to create", async function () {
                  await expect(
                      nftMarketplace
                          .connect(user)
                          .createAuction(
                              basicNft.address,
                              TOKEN_ID,
                              futureTime,
                              PRICE
                          )
                  ).to.be.revertedWith("NftMarketplace__NotOwner")
              })
              it("Reverts When Reauctioning an already auctioned Nft", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )
                  await expect(
                      nftMarketplace.createAuction(
                          basicNft.address,
                          TOKEN_ID,
                          futureTime,
                          PRICE
                      )
                  ).to.be.revertedWith(
                      `NftMarketplace__AlreadyAuctioned("${basicNft.address}", ${TOKEN_ID})`
                  )
              })
              it("Reverts when auctioning a listed item", async function () {
                  await nftMarketplace.listItem(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  await expect(
                      nftMarketplace.createAuction(
                          basicNft.address,
                          TOKEN_ID,
                          futureTime,
                          PRICE
                      )
                  ).to.be.revertedWith(
                      `NftMarketplace__AlreadyListed("${basicNft.address}", ${TOKEN_ID})`
                  )
              })
              it("Reverts if startingprice is set at Zero & expiry time set to a past time", async function () {
                  await expect(
                      nftMarketplace.createAuction(
                          basicNft.address,
                          TOKEN_ID,
                          futureTime,
                          0
                      )
                  ).to.be.revertedWith(
                      `NftMarketplace__StartingPriceMustBeAboveZero()`
                  )
                  await expect(
                      nftMarketplace.createAuction(
                          basicNft.address,
                          TOKEN_ID,
                          pastTime,
                          PRICE
                      )
                  ).to.be.revertedWith(
                      `NftMarketplace__ExpiryMustBeInTheFuture()`
                  )
              })
              it("needs approvals to auction an item", async function () {
                  await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID)
                  await expect(
                      nftMarketplace.createAuction(
                          basicNft.address,
                          TOKEN_ID,
                          futureTime,
                          PRICE
                      )
                  ).to.be.revertedWith(
                      "NftMarketplace__NotApprovedForMarketplace"
                  )
              })
              it("Updates auction with seller, expiry and startingPrice", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )
                  const auction = await nftMarketplace.getAuction(
                      basicNft.address,
                      TOKEN_ID
                  )
                  assert(auction.startingPrice.toString() == PRICE.toString())
                  assert(auction.seller.toString() == deployer.address)
                  assert(auction.expiry.toString() == futureTime.toString())
              })
          })

          describe("cancelAuction", function () {
              it("it emits an event when an auction is canceled successfully", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )
                  expect(
                      await nftMarketplace.cancelAuction(
                          basicNft.address,
                          TOKEN_ID
                      )
                  ).to.emit("AuctionCanceled")
              })
              it("deletes an auction when it is canceled", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )
                  await nftMarketplace.cancelAuction(basicNft.address, TOKEN_ID)
                  const auction = await nftMarketplace.getAuction(
                      basicNft.address,
                      TOKEN_ID
                  )
                  assert(auction.startingPrice.toString() == "0")
                  assert(
                      auction.seller.toString() ==
                          "0x0000000000000000000000000000000000000000"
                  )
                  assert(auction.expiry.toString() == "0")
                  assert(auction.currentBid.toString() == "0")
                  assert(
                      auction.currentBidder.toString() ==
                          "0x0000000000000000000000000000000000000000"
                  )
                  assert(auction.bidExists.toString() == "false")
              })
              it("allows only an owner to cancel only auctioned items", async function () {
                  await expect(
                      nftMarketplace.cancelAuction(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith(
                      `NftMarketplace__NotAuctioned("${basicNft.address}", ${TOKEN_ID})`
                  )
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )
                  await expect(
                      nftMarketplace
                          .connect(user)
                          .cancelAuction(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith(`NftMarketplace__NotOwner()`)
              })
              it("refunds an existing bid when an auctuion is canceled", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )
                  await nftMarketplace
                      .connect(user)
                      .placeBid(basicNft.address, TOKEN_ID, { value: PRICE })
                  const userBalanceAfterBid = await ethers.provider.getBalance(
                      user.address
                  )
                  await nftMarketplace.cancelAuction(basicNft.address, TOKEN_ID)
                  const userBalanceAfterCanceledAuction =
                      await ethers.provider.getBalance(user.address)
                  expect(
                      userBalanceAfterBid.add(PRICE) ==
                          userBalanceAfterCanceledAuction
                  )
              })
          })
          describe("placeBid", function () {
              it("emits an event on a successful bid", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )
                  expect(
                      await nftMarketplace
                          .connect(user)
                          .placeBid(basicNft.address, TOKEN_ID, {
                              value: PRICE,
                          })
                  ).to.emit("BidSuccess")
              })
              it("Reverts when an item is not auctioned", async function () {
                  await expect(
                      nftMarketplace
                          .connect(user)
                          .placeBid(basicNft.address, TOKEN_ID, {
                              value: PRICE,
                          })
                  ).to.be.revertedWith(
                      `NftMarketplace__NotAuctioned("${basicNft.address}", ${TOKEN_ID})`
                  )
              })
              it("Reverts when an Nft owner places a bid on the Nft", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )
                  await expect(
                      nftMarketplace.placeBid(basicNft.address, TOKEN_ID, {
                          value: PRICE,
                      })
                  ).to.be.revertedWith(`NftMarketplace__CallerIsOwner()`)
              })
              it("Deletes an Nft Auction if the Owner no longer owns the Nft and emits an event", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )
                  await basicNft.transferFrom(
                      deployer.address,
                      secondUser.address,
                      TOKEN_ID
                  )
                  expect(
                      await nftMarketplace
                          .connect(user)
                          .placeBid(basicNft.address, TOKEN_ID, {
                              value: PRICE,
                          })
                  ).to.emit("AuctionCanceled")

                  const auction = await nftMarketplace.getAuction(
                      basicNft.address,
                      TOKEN_ID
                  )
                  assert(auction.startingPrice.toString() == "0")
                  assert(
                      auction.seller.toString() ==
                          "0x0000000000000000000000000000000000000000"
                  )
                  assert(auction.expiry.toString() == "0")
                  assert(auction.currentBid.toString() == "0")
                  assert(
                      auction.currentBidder.toString() ==
                          "0x0000000000000000000000000000000000000000"
                  )
                  assert(auction.bidExists.toString() == "false")
              })
              it("Refunds an existing Bid and reverts the new bid after canceling an auction on placing a bid", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )
                  await nftMarketplace
                      .connect(user)
                      .placeBid(basicNft.address, TOKEN_ID, {
                          value: PRICE,
                      })
                  const userBalanceAfterBid = await ethers.provider.getBalance(
                      user.address
                  )
                  const thirdUserBalanceBeforeBid =
                      await ethers.provider.getBalance(thirdUser.address)
                  await basicNft.transferFrom(
                      deployer.address,
                      secondUser.address,
                      TOKEN_ID
                  )

                  const transactionResponse = await nftMarketplace
                      .connect(thirdUser)
                      .placeBid(basicNft.address, TOKEN_ID, {
                          value: HIGHERPRICE,
                      })
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)

                  const userBalanceAfterCanceledAuction =
                      await ethers.provider.getBalance(user.address)
                  const thirdUserBalanceAfterCanceledAuction =
                      await ethers.provider.getBalance(thirdUser.address)
                  expect(
                      userBalanceAfterBid.add(PRICE) ==
                          userBalanceAfterCanceledAuction
                  )
                  expect(
                      thirdUserBalanceBeforeBid ==
                          thirdUserBalanceAfterCanceledAuction.add(gasCost)
                  )
              })
              it("Reverts if bid price is less than starting price, updates the auction on a successful bid and reverts when an auction has expired", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )
                  await expect(
                      nftMarketplace
                          .connect(user)
                          .placeBid(basicNft.address, TOKEN_ID, {
                              value: 0,
                          })
                  ).to.be.revertedWith(
                      `NftMarketplace__PriceNotMet("${basicNft.address}", ${TOKEN_ID}, ${PRICE})`
                  )
                  await nftMarketplace
                      .connect(user)
                      .placeBid(basicNft.address, TOKEN_ID, {
                          value: PRICE,
                      })
                  const auction = await nftMarketplace.getAuction(
                      basicNft.address,
                      TOKEN_ID
                  )
                  assert(auction.startingPrice.toString() == PRICE.toString())
                  assert(auction.seller.toString() == deployer.address)
                  assert(auction.expiry.toString() == futureTime.toString())
                  assert(auction.currentBid.toString() == PRICE.toString())
                  assert(auction.currentBidder.toString() == user.address)
                  assert(auction.bidExists.toString() == "true")
                  await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]) // Increase Time by one day
                  await expect(
                      nftMarketplace
                          .connect(secondUser)
                          .placeBid(basicNft.address, TOKEN_ID, {
                              value: 0,
                          })
                  ).to.be.revertedWith(
                      `NftMarketplace__AuctionExpired("${basicNft.address}", ${TOKEN_ID})`
                  )
              })
              it("Reverts when a new bid is lower than an old bid, Refunds the old bid if a higher new bid is placed and pays new bid to the marketplace", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )
                  await nftMarketplace
                      .connect(user)
                      .placeBid(basicNft.address, TOKEN_ID, {
                          value: PRICE,
                      })

                  const userBalanceAfterFirstBid =
                      await ethers.provider.getBalance(user.address)
                  const secondUserBalanceBeforeBid =
                      await ethers.provider.getBalance(secondUser.address)
                  assert(
                      (await (
                          await ethers.provider.getBalance(
                              nftMarketplace.address
                          )
                      ).toString()) == PRICE.toString()
                  )

                  await expect(
                      nftMarketplace
                          .connect(secondUser)
                          .placeBid(basicNft.address, TOKEN_ID, {
                              value: PRICE,
                          })
                  ).to.be.revertedWith(
                      `NftMarketplace__NeedHigherBid("${basicNft.address}", ${TOKEN_ID}, ${PRICE})`
                  )

                  const transactionResponse = await nftMarketplace
                      .connect(secondUser)
                      .placeBid(basicNft.address, TOKEN_ID, {
                          value: HIGHERPRICE,
                      })
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const userBalanceAfterSecondBid =
                      await ethers.provider.getBalance(user.address)
                  const secondUserBalanceAfterBid =
                      await ethers.provider.getBalance(secondUser.address)

                  expect(
                      secondUserBalanceAfterBid.add(gasCost) ==
                          secondUserBalanceBeforeBid.sub(HIGHERPRICE)
                  )

                  assert(
                      (
                          await ethers.provider.getBalance(
                              nftMarketplace.address
                          )
                      ).toString() == HIGHERPRICE.toString()
                  )
                  assert(
                      userBalanceAfterFirstBid.add(PRICE).toString() ==
                          userBalanceAfterSecondBid.toString()
                  )
              })
          })
          describe("withdrawBid", function () {
              it("Reverts if a bid is not auctioned", async function () {
                  await expect(
                      nftMarketplace.withdrawBid(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith(
                      `NftMarketplace__NotAuctioned("${basicNft.address}", ${TOKEN_ID})`
                  )
              })
              it("Reverts is caller is not the current Bidder", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )
                  await expect(
                      nftMarketplace.withdrawBid(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith(`NftMarketplace__NotTheCurrentBidder()`)
              })
              it("Reverts if Auction has not expired", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )
                  await nftMarketplace
                      .connect(user)
                      .placeBid(basicNft.address, TOKEN_ID, {
                          value: PRICE,
                      })
                  await expect(
                      nftMarketplace
                          .connect(user)
                          .withdrawBid(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith(`NftMarketPlace__AuctionNotExpired()`)
              })
              it("Deletes the acuction and emits an event if owner no longer owns the NFT", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )

                  await nftMarketplace
                      .connect(user)
                      .placeBid(basicNft.address, TOKEN_ID, {
                          value: PRICE,
                      })

                  await basicNft.transferFrom(
                      deployer.address,
                      secondUser.address,
                      TOKEN_ID
                  )
                  await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]) // Increase Time by one dayyarn ah
                  expect(
                      await nftMarketplace
                          .connect(user)
                          .withdrawBid(basicNft.address, TOKEN_ID)
                  ).to.emit("AuctionCanceled")

                  const auction = await nftMarketplace.getAuction(
                      basicNft.address,
                      TOKEN_ID
                  )
                  assert(auction.startingPrice.toString() == "0")
                  assert(
                      auction.seller.toString() ==
                          "0x0000000000000000000000000000000000000000"
                  )
                  assert(auction.expiry.toString() == "0")
                  assert(auction.currentBid.toString() == "0")
                  assert(
                      auction.currentBidder.toString() ==
                          "0x0000000000000000000000000000000000000000"
                  )
                  assert(auction.bidExists.toString() == "false")
              })
              it("Updates the auction and emits an event on a successful withdrawal", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )

                  await nftMarketplace
                      .connect(user)
                      .placeBid(basicNft.address, TOKEN_ID, {
                          value: PRICE,
                      })

                  await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]) // Increase Time by one dayyarn ah
                  expect(
                      await nftMarketplace
                          .connect(user)
                          .withdrawBid(basicNft.address, TOKEN_ID)
                  ).to.emit("BidWithdrawn")

                  const auction = await nftMarketplace.getAuction(
                      basicNft.address,
                      TOKEN_ID
                  )
                  assert(auction.startingPrice.toString() == PRICE.toString())
                  assert(auction.seller.toString() == deployer.address)
                  assert(auction.expiry.toString() == futureTime)
                  assert(auction.currentBid.toString() == "0")
                  assert(
                      auction.currentBidder.toString() ==
                          "0x0000000000000000000000000000000000000000"
                  )
                  assert(auction.bidExists.toString() == "false")
              })
              it("Refunds the bid on a successful withdrawal", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )

                  await nftMarketplace
                      .connect(user)
                      .placeBid(basicNft.address, TOKEN_ID, {
                          value: PRICE,
                      })

                  await ethers.provider.send("evm_increaseTime", [24 * 60 * 60]) // Increase Time by one dayyarn ah
                  const userBalanceBeforeWithdrawal =
                      await ethers.provider.getBalance(user.address)
                  const transactionResponse = await nftMarketplace
                      .connect(user)
                      .withdrawBid(basicNft.address, TOKEN_ID)
                  const transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const userBalanceAfterWithdrawal =
                      await ethers.provider.getBalance(user.address)
                  expect(
                      userBalanceAfterWithdrawal.add(gasCost) ==
                          userBalanceBeforeWithdrawal.add(PRICE)
                  )
              })
          })
          describe("acceptAuction", function () {
              it("Reverts if caller is not the NFT owner", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )

                  await nftMarketplace
                      .connect(user)
                      .placeBid(basicNft.address, TOKEN_ID, {
                          value: PRICE,
                      })

                  await expect(
                      nftMarketplace
                          .connect(user)
                          .acceptAuction(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith(`NftMarketplace__NotOwner()`)
              })
              it("Reverts if Nft is not Auctioned", async function () {
                  await expect(
                      nftMarketplace.acceptAuction(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith(
                      `NftMarketplace__NotAuctioned("${basicNft.address}", ${TOKEN_ID})`
                  )
              })
              it("Reverts if there is no bid", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )

                  await expect(
                      nftMarketplace.acceptAuction(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith(`NftMarketplace__NoCurrentBid()`)
              })
              it("Deletes the auction, updates the proceeds, transfer the nft and emits an event on a successful auction", async function () {
                  await nftMarketplace.createAuction(
                      basicNft.address,
                      TOKEN_ID,
                      futureTime,
                      PRICE
                  )

                  await nftMarketplace
                      .connect(user)
                      .placeBid(basicNft.address, TOKEN_ID, {
                          value: PRICE,
                      })

                  expect(
                      await nftMarketplace.acceptAuction(
                          basicNft.address,
                          TOKEN_ID
                      )
                  ).to.emit("AuctionComplete")

                  const auction = await nftMarketplace.getAuction(
                      basicNft.address,
                      TOKEN_ID
                  )
                  assert(auction.startingPrice.toString() == "0")
                  assert(
                      auction.seller.toString() ==
                          "0x0000000000000000000000000000000000000000"
                  )
                  assert(auction.expiry.toString() == "0")
                  assert(auction.currentBid.toString() == "0")
                  assert(
                      auction.currentBidder.toString() ==
                          "0x0000000000000000000000000000000000000000"
                  )
                  assert(auction.bidExists.toString() == "false")

                  assert(
                      (await basicNft.ownerOf(TOKEN_ID)).toString() ==
                          user.address
                  )

                  assert(
                      (
                          await nftMarketplace.getProceeds(deployer.address)
                      ).toString() == PRICE.toString()
                  )
              })
          })
          describe("withdrawProceeds", function () {
              it("doesn't allow 0 proceed withdrawls", async function () {
                  await expect(
                      nftMarketplace.withdrawProceeds()
                  ).to.be.revertedWith("NftMarketplace__NoProceeds")
              })
              it("withdraws proceeds", async function () {
                  await nftMarketplace.listItem(
                      basicNft.address,
                      TOKEN_ID,
                      PRICE
                  )
                  nftMarketplace = nftMarketplaceContract.connect(user)
                  await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
                      value: PRICE,
                  })
                  nftMarketplace = nftMarketplaceContract.connect(deployer)

                  const deployerProceedsBefore =
                      await nftMarketplace.getProceeds(deployer.address)
                  const deployerBalanceBefore = await deployer.getBalance()
                  const txResponse = await nftMarketplace.withdrawProceeds()
                  const transactionReceipt = await txResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const deployerBalanceAfter = await deployer.getBalance()

                  assert(
                      deployerBalanceAfter.add(gasCost).toString() ==
                          deployerProceedsBefore
                              .add(deployerBalanceBefore)
                              .toString()
                  )
              })
          })
          describe("getVerison", function () {
              it("Returns the correct Version", async function () {
                  const version = "0.0.1"

                  assert((await nftMarketplace.getVersion()) == version)
              })
          })
      })
