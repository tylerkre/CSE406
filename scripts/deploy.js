const hre = require("hardhat");

async function main() {
    const [admin, user] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("MyToken");
    const token = await Token.deploy();
    await token.waitForDeployment();

    const NFT = await hre.ethers.getContractFactory("MembershipNFT");
    const nft = await NFT.deploy();
    await nft.waitForDeployment();

    const Vault = await hre.ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(token.target, nft.target);
    await vault.waitForDeployment();

    await nft.setVault(vault.target);

    await token.transfer(user.address, hre.ethers.parseEther("1000"));

    console.log("Token:", token.target);
    console.log("Vault:", vault.target);
    console.log("NFT:", nft.target);
}

main();