import { ethers } from "ethers";
import VaultABI from "../abis/Vault.json";
import TokenABI from "../abis/MyToken.json";
import { VAULT_ADDRESS, TOKEN_ADDRESS } from "./constants";

export const getContracts = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return {
        vault: new ethers.Contract(VAULT_ADDRESS, VaultABI.abi, signer),
        token: new ethers.Contract(TOKEN_ADDRESS, TokenABI.abi, signer),
    };
};
