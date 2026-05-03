// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MembershipNFT is ERC721 {
    uint256 public nextId;
    address public vault;

    mapping(address => bool) public hasMembership;
    mapping(address => uint256) public memberTokenId;

    constructor() ERC721("Vault Membership", "VMEMBER") {}

    function setVault(address _vault) external {
        require(vault == address(0), "Already set");
        vault = _vault;
    }

    function mint(address user) external {
        require(msg.sender == vault, "Only vault");
        if (hasMembership[user]) return;

        uint256 id = ++nextId;
        hasMembership[user] = true;
        memberTokenId[user] = id;
        _mint(user, id);
    }

    function burn(address user) external {
        require(msg.sender == vault, "Only vault");
        if (!hasMembership[user]) return;

        uint256 id = memberTokenId[user];
        hasMembership[user] = false;
        _burn(id);
    }
}