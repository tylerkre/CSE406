// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MembershipNFT.sol";

contract Vault is ERC20 {

    IERC20 public collateralToken;
    MembershipNFT public membership;

    address public admin;
    uint256 public withdrawalFeeBps = 50;

    constructor(address _token, address _membership)
        ERC20("Vault Share", "VSHARE")
    {
        collateralToken = IERC20(_token);
        membership = MembershipNFT(_membership);
        admin = msg.sender;
    }

    function totalAssets() public view returns (uint256) {
        return collateralToken.balanceOf(address(this));
    }

    function deposit(uint256 assets) external {
        require(assets > 0, "Invalid");

        uint256 shares;
        if (totalSupply() == 0) {
            shares = assets;
        } else {
            shares = (assets * totalSupply()) / totalAssets();
        }

        collateralToken.transferFrom(msg.sender, address(this), assets);
        _mint(msg.sender, shares);

        membership.mint(msg.sender);
    }

    function withdraw(uint256 shares) external {
        require(balanceOf(msg.sender) >= shares, "Not enough");

        uint256 assets = (shares * totalAssets()) / totalSupply();
        uint256 fee = (assets * withdrawalFeeBps) / 10000;
        uint256 payout = assets - fee;

        _burn(msg.sender, shares);

        collateralToken.transfer(admin, fee);
        collateralToken.transfer(msg.sender, payout);

        if (balanceOf(msg.sender) == 0) {
            membership.burn(msg.sender);
        }
    }
}