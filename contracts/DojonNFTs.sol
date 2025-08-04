// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract DojonNFTs is ERC1155, Ownable {
    uint256 public nextId = 1;
    mapping(uint256 => string) public metadataURI;
    constructor(string memory baseURI) ERC1155(baseURI) {}
    function mint(address to, uint256 amount, string calldata uri) external onlyOwner {
        uint256 id = nextId++;
        metadataURI[id] = uri;
        _mint(to, id, amount, "");
        _setURI(uri);
    }
    function uri(uint256 id) public view override returns (string memory) {
        return metadataURI[id];
    }
}
