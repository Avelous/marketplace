// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NftMarketplace__PriceNotMet(
    address nftAddress,
    uint256 tokenId,
    uint256 price
);
error NftMarketplace__ItemNotForSale(address nftAddress, uint256 tokenId);
error NftMarketplace__NotListed(address nftAddress, uint256 tokenId);
error NftMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketplace__AlreadyAuctioned(address nftAddress, uint256 tokenId);
error NftMarketplace__StartingPriceMustBeAboveZero();
error NftMarketplace__ExpiryMustBeInTheFuture();
error NftMarketplace__NotAuctioned(address nftAddress, uint256 tokenId);
error NftMarketplace__AuctionExpired(address nftAddress, uint256 tokenId);
error NftMarketplace__NeedHigherBid(
    address nftAddress,
    uint256 tokenId,
    uint256 currentBid
);
error NftMarketplace__NoProceeds();
error NftMarketplace__NotOwner();
error NftMarketplace__CallerIsOwner();
error NftMarketplace__NotApprovedForMarketplace();
error NftMarketplace__PriceMustBeAboveZero();
error NftMarketplace__NotTheCurrentBidder();
error NftMarketplace__SellerNoLongerOwnsNft();
error NftMarketplace__NoCurrentBid();
error NftMarketPlace__AuctionNotExpired();

contract NftMarketplace is ReentrancyGuard {
    //-----Structs-----//
    struct Listing {
        uint256 price;
        address seller;
    }

    struct Auction {
        uint256 startingPrice;
        uint256 expiry;
        uint256 currentBid;
        address currentBidder;
        address seller;
        bool bidExists;
    }

    //-----Events-----//
    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event ItemBought(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event itemAuctioned(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price,
        uint256 expiry
    );

    event AuctionCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event BidSuccess(
        address indexed bidder,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 bid
    );

    event BidWithdrawn(
        address indexed bidder,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    event AuctionComplete(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    //-----Mappings-----//
    mapping(address => mapping(uint256 => Auction)) private s_auctions;
    mapping(address => uint256) private s_proceeds;
    mapping(address => mapping(uint256 => Listing)) private s_listings;

    //-----Modifiers-----//
    modifier notListed(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price > 0) {
            revert NftMarketplace__AlreadyListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = s_listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NftMarketplace__NotListed(nftAddress, tokenId);
        }
        _;
    }

    modifier isOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        if (spender != nft.ownerOf(tokenId)) {
            revert NftMarketplace__NotOwner();
        }
        _;
    }

    modifier isNotOwner(
        address nftAddress,
        uint256 tokenId,
        address spender
    ) {
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if (spender == owner) {
            revert NftMarketplace__CallerIsOwner();
        }
        _;
    }

    modifier isNotAuctioned(
        address nftAddress,
        uint256 tokenId,
        address owner
    ) {
        Auction memory auction = s_auctions[nftAddress][tokenId];
        if (auction.startingPrice > 0) {
            revert NftMarketplace__AlreadyAuctioned(nftAddress, tokenId);
        }
        _;
    }

    modifier isAuctioned(address nftAddress, uint256 tokenId) {
        Auction memory auction = s_auctions[nftAddress][tokenId];
        if (auction.startingPrice <= 0) {
            revert NftMarketplace__NotAuctioned(nftAddress, tokenId);
        }
        _;
    }

    // modifier isNotExpired(address nftAddress, uint256 tokenId) {
    //     Auction memory auction = s_auctions[nftAddress][tokenId];
    //     if (auction.expiry <= block.timestamp) {
    //         revert NftMarketplace__AuctionExpired(nftAddress, tokenId);
    //     }
    //     _;
    // }

    //-----Main Functions-----//

    /**
     * @notice Method for listing NFT
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     * @param price sale price for each item
     */
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        notListed(nftAddress, tokenId, msg.sender)
        isNotAuctioned(nftAddress, tokenId, msg.sender)
    /** isOwner(nftAddress, tokenId, msg.sender) */
    {
        if (price <= 0) {
            revert NftMarketplace__PriceMustBeAboveZero();
        }
        IERC721 nft = IERC721(nftAddress);
        if (msg.sender != nft.ownerOf(tokenId)) {
            revert NftMarketplace__NotOwner();
        }
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace__NotApprovedForMarketplace();
        }
        s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    /**
     * @notice Method for cancelling listing
     * @notice  There also is a `createAuction` functionality.
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     */
    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isListed(nftAddress, tokenId)
    {
        delete (s_listings[nftAddress][tokenId]);
        emit ItemCanceled(msg.sender, nftAddress, tokenId);
    }

    /**
     * @notice Method for buying listing
     * @notice The owner of an NFT could unapprove the marketplace,
     * instead of failing, the Nft is delisted
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     */
    function buyItem(address nftAddress, uint256 tokenId)
        external
        payable
        isListed(nftAddress, tokenId)
        isNotOwner(nftAddress, tokenId, msg.sender)
        nonReentrant
        returns (string memory nftStatus)
    {
        Listing memory listedItem = s_listings[nftAddress][tokenId];

        if (IERC721(nftAddress).ownerOf(tokenId) != listedItem.seller) {
            delete (s_listings[nftAddress][tokenId]);
            if (msg.value > 0) {
                (bool revertPurchase, ) = payable(msg.sender).call{
                    value: msg.value
                }("");
                require(revertPurchase);
            }
            emit ItemCanceled(msg.sender, nftAddress, tokenId);
            return "NFT delisted, Seller no longer owns this NFT";
        }

        if (msg.value < listedItem.price) {
            revert NftMarketplace__PriceNotMet(
                nftAddress,
                tokenId,
                listedItem.price
            );
        }
        s_proceeds[listedItem.seller] += msg.value;
        delete (s_listings[nftAddress][tokenId]);
        IERC721(nftAddress).safeTransferFrom(
            listedItem.seller,
            msg.sender,
            tokenId
        );
        emit ItemBought(msg.sender, nftAddress, tokenId, listedItem.price);
    }

    /**
     * @notice Method for updating listing
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     * @param newPrice Price in Wei of the item
     */
    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    )
        external
        isListed(nftAddress, tokenId)
        nonReentrant
        isOwner(nftAddress, tokenId, msg.sender)
    {
        if (newPrice <= 0) {
            revert NftMarketplace__PriceMustBeAboveZero();
        }
        s_listings[nftAddress][tokenId].price = newPrice;
        emit ItemListed(msg.sender, nftAddress, tokenId, newPrice);
    }

    /**
     * @notice Method for creating NFT Auction
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     * @param expiry auction expiration time
     * @param startingPrice sale starting price for bidding
     */
    function createAuction(
        address nftAddress,
        uint256 tokenId,
        uint256 expiry,
        uint256 startingPrice
    )
        external
        isNotAuctioned(nftAddress, tokenId, msg.sender)
        notListed(nftAddress, tokenId, msg.sender)
    /** isOwner(nftAddress, tokenId, msg.sender) */
    {
        if (startingPrice <= 0) {
            revert NftMarketplace__StartingPriceMustBeAboveZero();
        }
        if (expiry <= block.timestamp) {
            revert NftMarketplace__ExpiryMustBeInTheFuture();
        }
        IERC721 nft = IERC721(nftAddress);
        if (nft.ownerOf(tokenId) != msg.sender) {
            revert NftMarketplace__NotOwner();
        }
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarketplace__NotApprovedForMarketplace();
        }
        s_auctions[nftAddress][tokenId] = Auction(
            startingPrice,
            expiry,
            0,
            0x0000000000000000000000000000000000000000,
            msg.sender,
            false
        );

        emit itemAuctioned(
            msg.sender,
            nftAddress,
            tokenId,
            startingPrice,
            expiry
        );
    }

    /**
     * @notice Method for canceling Auction
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     */
    function cancelAuction(address nftAddress, uint256 tokenId)
        external
        isAuctioned(nftAddress, tokenId)
        isOwner(nftAddress, tokenId, msg.sender)
    {
        Auction memory auction = s_auctions[nftAddress][tokenId];
        delete (s_auctions[nftAddress][tokenId]);
        if (auction.bidExists) {
            (bool success, ) = payable(auction.currentBidder).call{
                value: auction.currentBid
            }("");
            require(success);
        }
        emit AuctionCanceled(msg.sender, nftAddress, tokenId);
    }

    /**
     * @notice Method for bidding NFT
     * @notice The owner of an NFT could unapprove the marketplace,
     * instead of failing, the auction is canceled
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     */
    function placeBid(address nftAddress, uint256 tokenId)
        external
        payable
        isAuctioned(nftAddress, tokenId)
        isNotOwner(nftAddress, tokenId, msg.sender)
        nonReentrant
        returns (string memory nftstatus)
    {
        Auction memory auction = s_auctions[nftAddress][tokenId];

        if (IERC721(nftAddress).ownerOf(tokenId) != auction.seller) {
            delete (s_auctions[nftAddress][tokenId]);

            if (auction.bidExists) {
                (bool noSellerSuccess, ) = payable(auction.currentBidder).call{
                    value: auction.currentBid
                }("");
                require(noSellerSuccess);
            }

            if (msg.value > 0) {
                (bool revertBid, ) = payable(msg.sender).call{value: msg.value}(
                    ""
                );
                require(revertBid);
            }
            emit AuctionCanceled(msg.sender, nftAddress, tokenId);
            return "NFT Auction Canceled, Seller No Longer Owns this NFT";
        }

        if (auction.expiry < block.timestamp) {
            revert NftMarketplace__AuctionExpired(nftAddress, tokenId);
        }

        if (msg.value < auction.startingPrice) {
            revert NftMarketplace__PriceNotMet(
                nftAddress,
                tokenId,
                auction.startingPrice
            );
        }

        if (auction.bidExists) {
            if (msg.value <= auction.currentBid) {
                revert NftMarketplace__NeedHigherBid(
                    nftAddress,
                    tokenId,
                    auction.currentBid
                );
            }

            s_auctions[nftAddress][tokenId] = Auction(
                auction.startingPrice,
                auction.expiry,
                msg.value,
                msg.sender,
                auction.seller,
                auction.bidExists
            );

            (bool success, ) = payable(auction.currentBidder).call{
                value: auction.currentBid
            }("");
            require(success);
        } else {
            s_auctions[nftAddress][tokenId] = Auction(
                auction.startingPrice,
                auction.expiry,
                msg.value,
                msg.sender,
                auction.seller,
                true
            );
        }
        emit BidSuccess(msg.sender, nftAddress, tokenId, msg.value);
        return "Bid placed Successfully";
    }

    /**
     * @notice Method for withdrawing bids
     * @notice The owner of an NFT could unapprove the marketplace,
     * instead of failing, the Nft is delisted
     * @notice Bids can only be withdrawn after auction expires
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     */
    function withdrawBid(address nftAddress, uint256 tokenId)
        external
        isAuctioned(nftAddress, tokenId)
        /** isNotOwner(nftAddress, tokenId, msg.sender) */
        nonReentrant
    {
        Auction memory auction = s_auctions[nftAddress][tokenId];
        if (msg.sender != auction.currentBidder) {
            revert NftMarketplace__NotTheCurrentBidder();
        }

        if (auction.expiry > block.timestamp) {
            revert NftMarketPlace__AuctionNotExpired();
        }

        if (IERC721(nftAddress).ownerOf(tokenId) != auction.seller) {
            delete (s_auctions[nftAddress][tokenId]);
            emit AuctionCanceled(msg.sender, nftAddress, tokenId);
        } else {
            s_auctions[nftAddress][tokenId] = Auction(
                auction.startingPrice,
                auction.expiry,
                0,
                0x0000000000000000000000000000000000000000,
                auction.seller,
                false
            );
        }

        (bool success, ) = payable(auction.currentBidder).call{
            value: auction.currentBid
        }("");
        require(success);
        emit BidWithdrawn(msg.sender, nftAddress, tokenId);
    }

    /**
     * @notice Method for accepting bids on auction
     * @param nftAddress Address of NFT contract
     * @param tokenId Token ID of NFT
     */
    function acceptAuction(address nftAddress, uint256 tokenId)
        external
        isOwner(nftAddress, tokenId, msg.sender)
        isAuctioned(nftAddress, tokenId)
        nonReentrant
    {
        Auction memory auction = s_auctions[nftAddress][tokenId];
        if (!auction.bidExists) {
            revert NftMarketplace__NoCurrentBid();
        }
        delete s_auctions[nftAddress][tokenId];
        s_proceeds[msg.sender] += auction.currentBid;
        IERC721(nftAddress).safeTransferFrom(
            msg.sender,
            auction.currentBidder,
            tokenId
        );

        emit AuctionComplete(
            msg.sender,
            nftAddress,
            tokenId,
            auction.currentBid
        );
    }

    /**
     * @notice Method for withdrawing proceeds from sales
     */
    function withdrawProceeds() external nonReentrant {
        uint256 proceeds = s_proceeds[msg.sender];
        if (proceeds <= 0) {
            revert NftMarketplace__NoProceeds();
        }
        s_proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: proceeds}("");
        require(success, "Transfer failed");
    }

    //-----Getter Functions-----//

    function getListing(address nftAddress, uint256 tokenId)
        external
        view
        returns (Listing memory)
    {
        return s_listings[nftAddress][tokenId];
    }

    function getAuction(address nftAddress, uint256 tokenId)
        external
        view
        returns (Auction memory)
    {
        return s_auctions[nftAddress][tokenId];
    }

    function getProceeds(address seller) external view returns (uint256) {
        return s_proceeds[seller];
    }

    function getVersion() external pure returns (string memory) {
        return "0.0.1";
    }
}
