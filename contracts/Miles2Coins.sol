// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Imports for MilesToken and SampleCoin contracts
import "./MilesToken.sol";
import "./SampleCoin.sol";

contract Miles2Coins {

    MilesToken public milesToken; // MilesToken contract
    SampleCoin public sampleCoin; // SampleCoin contract

	uint256 public constant MILES_ID = 0; // Assuming a single miles type

    struct Offer {
        uint256 id;              // Unique offer ID
        address payable trader;  // Trader's address
        uint256 amount;          // Amount of miles or SampleCoin
        uint256 price;           // Price per mile or SampleCoin
        bool isBuying;           // True for buy offer, false for sell
        bool isActive;           // Offer status
    }

    mapping(uint256 => Offer) public offers; // Offers mapping
    uint256 public lastOfferId = 0; // Last offer ID

    event OfferPlaced(uint256 id, address indexed trader, uint256 amount, uint256 price, bool isBuying); // When an offer is placed
    event OfferAccepted(uint256 id, address indexed buyer, address indexed seller, uint256 amount, uint256 price); // When an offer is accepted

    constructor(address _milesTokenAddress, address _sampleCoinAddress) {
        milesToken = MilesToken(_milesTokenAddress);   // Initialize MilesToken
        sampleCoin = SampleCoin(_sampleCoinAddress);   // Initialize SampleCoin
    }

    function placeOffer(uint256 _amount, uint256 _price, bool _isBuying) external {
        require(_amount > 0, "Invalid amount");
        require(_price > 0, "Invalid price");

        if (_isBuying) {
            // Buyer must approve contract to use their SampleCoin
            require(sampleCoin.allowance(msg.sender, address(this)) >= _amount * _price, "Insufficient SampleCoin allowance");
         } else {
            // Seller must approve contract to use their miles
            if (!milesToken.isApprovedForAll(msg.sender, address(this))) {
                milesToken.setApprovalForAll(address(this), true);
			}
        }

        uint256 offerId = ++lastOfferId;
        offers[offerId] = Offer(offerId, payable(msg.sender), _amount, _price, _isBuying, true);

        emit OfferPlaced(offerId, msg.sender, _amount, _price, _isBuying);
    }

    function acceptOffer(uint256 _offerId) external {
        Offer storage offer = offers[_offerId];
        require(offer.isActive, "Offer is not active");
		
        // Transfer miles and funds between buyer and seller
        if (offer.isBuying) {
			require(milesToken.balanceOf(msg.sender, MILES_ID) >= offer.amount, "Seller has insufficient miles");
			require(sampleCoin.balanceOf(offer.trader) >= offer.amount * offer.price, "Buyer has insufficient funds");
			
            offer.isActive = false; // Deactivate offer before transfer
			
            try milesToken.safeTransferFrom(msg.sender, offer.trader, MILES_ID, offer.amount, "") { // Transfers miles from buyer to seller
				try sampleCoin.transferFrom(offer.trader, msg.sender, offer.amount*offer.price) { // Transfers SampleCoins from seller to buyer
					emit OfferAccepted(_offerId, offer.trader, msg.sender, offer.amount, offer.price);
				} catch {
					// Revert miles transfer if SampleCoin transfer fails
                    milesToken.safeTransferFrom(offer.trader, msg.sender, MILES_ID, offer.amount, "");
                    offer.isActive = true;
                    revert("SampleCoin transfer failed");
				}
            } catch {
                offer.isActive = true;
                revert("MilesToken transfer failed");
			}
        } else {
			require(sampleCoin.balanceOf(msg.sender) >= offer.amount*offer.price, "Buyer has insufficient funds");
			require(milesToken.balanceOf(offer.trader, MILES_ID) >= offer.amount, "Seller has insufficient miles");
			
            offer.isActive = false; // Deactivate offer before transfer
			
            try milesToken.safeTransferFrom(offer.trader, msg.sender, MILES_ID, offer.amount, "") { // Transfers miles from seller to buyer
				try sampleCoin.transferFrom(msg.sender, offer.trader, offer.amount*offer.price) { // Transfers SampleCoins from buyer to seller 
					emit OfferAccepted(_offerId, msg.sender, offer.trader, offer.amount, offer.price);
				} catch {
					// Revert miles transfer if SampleCoin transfer fails
                    milesToken.safeTransferFrom(msg.sender, offer.trader, MILES_ID, offer.amount, "");
                    offer.isActive = true;
                    revert("SampleCoin transfer failed");
				}
			} catch {
				offer.isActive = true;
                revert("MilesToken transfer failed");
			}
        }
    }
}