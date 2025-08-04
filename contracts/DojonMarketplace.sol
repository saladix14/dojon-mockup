// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract DojonMarketplace is ReentrancyGuard, Ownable {
    IERC20 public usdt;
    uint256 public feePercent = 300; // 3%
    struct Listing { address seller; uint256 tokenId; uint256 amount; uint256 price; }
    mapping(address => mapping(uint256 => Listing)) public listings;
    event Listed(address seller, uint256 tokenId, uint256 amount, uint256 price);
    event Bought(address buyer, uint256 tokenId, uint256 amount, uint256 price);
    event Cancelled(address seller, uint256 tokenId);
    constructor(address _usdt) { usdt = IERC20(_usdt); }
    function list(address nftContract, uint256 tokenId, uint256 amount, uint256 price) external nonReentrant {
        IERC1155(nftContract).safeTransferFrom(msg.sender, address(this), tokenId, amount, "");
        listings[nftContract][tokenId] = Listing(msg.sender, tokenId, amount, price);
        emit Listed(msg.sender, tokenId, amount, price);
    }
    function buy(address nftContract, uint256 tokenId) external nonReentrant {
        Listing memory lst = listings[nftContract][tokenId];
        uint256 total = lst.price * lst.amount;
        uint256 fee = (total * feePercent) / 10000;
        usdt.transferFrom(msg.sender, lst.seller, total - fee);
        usdt.transferFrom(msg.sender, owner(), fee);
        IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, lst.amount, "");
        delete listings[nftContract][tokenId];
        emit Bought(msg.sender, tokenId, lst.amount, lst.price);
    }
    function cancel(address nftContract, uint256 tokenId) external {
        Listing memory lst = listings[nftContract][tokenId];
        require(lst.seller == msg.sender, "Not seller");
        IERC1155(nftContract).safeTransferFrom(address(this), msg.sender, tokenId, lst.amount, "");
        delete listings[nftContract][tokenId];
        emit Cancelled(msg.sender, tokenId);
    }
}
