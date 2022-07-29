//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    //state
    address payable public immutable feeAccount; //the account that is used to deploy marketplace
    uint public itemCount;
    uint public lastUpdated;

    struct Item{
        uint itemId; //primary key for every item
        ERC721Burnable nft; //instance of nft contract
        uint tokenId; //id of nft
        bool sold;
        uint warrantyPeriod;
        uint warrantyStartPeriod;
        bool warrantyOver;
    }
    event Offered (
        uint itemId,
        address indexed nft, 
        uint tokenId,
        bool sold,
        uint warrantyPeriod,
        uint warrantyStartPeriod,
        bool warrantyOver
    ); // 'indexed' allows us to search for Offered events using nft and seller addresses as filters

    event Bought(
        uint itemId,
        address indexed nft, 
        uint tokenId,
        bool sold,
        address indexed buyer,
        uint warrantyPeriod,
        uint warrantyStartPeriod,
        bool warrantyOver
    );

    mapping(uint => Item) public items;

    constructor() { 
        feeAccount = payable(msg.sender);
        updateTimestamp();
    }
    function updateTimestamp() public {
        lastUpdated = block.timestamp;
    }

    function makeItem( ERC721Burnable _nft, uint _tokenId, uint warranty ) external nonReentrant {
        itemCount++;
        _nft.transferFrom(msg.sender, address(this), _tokenId);

        items[itemCount] = Item (
            itemCount,
            _nft,
            _tokenId,
            false,
            warranty,
            0,
            false
        );

        //emit event
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            false,
            warranty,
            0,
            false
        );
    }

    //purchaseItem is payable so that the buyer could send the ether, this ether will be sent to the seller of that item and a small part of it goes to fee account i.e. to the deployer of marketplace contract
    function purchaseItem(uint _itemId, uint warrantyStart) external payable nonReentrant { 
        updateTimestamp();
        Item storage item = items[_itemId];
        require(_itemId>0 && _itemId <= itemCount, "item doesn't exist");
        require(!item.sold, "item already sold");

        //update item warrantyStart
        item.warrantyStartPeriod= lastUpdated;

        //update item to sold
        item.sold = true;

        //transfer nft to buyer
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);

        //emit bought event
        emit Bought(
            itemCount,
            address(item.nft),
            item.tokenId,
            true,
            msg.sender,
            item.warrantyPeriod,
            warrantyStart,
            false
        );
    }

   function destroyExpiredContracts() public {
        updateTimestamp();
        for(uint i=1; i<=itemCount; i++){
            if(items[i].warrantyStartPeriod + items[i].warrantyPeriod > lastUpdated && items[i].warrantyOver==false){
                items[i].nft.burn(items[i].tokenId);
                items[i].warrantyOver=true;
            }
        }
   }

   function destroySelectedExpiredContract(uint _itemId) external payable {
    updateTimestamp();
    for(uint i=1; i<=itemCount; i++){
        if(items[i].tokenId == _itemId && items[i].warrantyStartPeriod + items[i].warrantyPeriod >lastUpdated && items[i].warrantyOver==false){
            items[i].nft.burn(items[i].tokenId); 
            items[i].warrantyOver=true;
        }
    }

   }
}