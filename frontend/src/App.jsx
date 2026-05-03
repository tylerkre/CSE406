import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getContracts } from "./utils/contract";

function App() {
  const [amount, setAmount] = useState("");
  const [mtkBalance, setMtkBalance] = useState("0");
  const [shareBalance, setShareBalance] = useState("0");

  const loadBalances = async () => {
    const { vault, token } = await getContracts();

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const mtk = await token.balanceOf(address);
    const shares = await vault.balanceOf(address);

    setMtkBalance(ethers.formatEther(mtk));
    setShareBalance(ethers.formatEther(shares));
  };

  const deposit = async () => {
    const { vault, token } = await getContracts();
    const parsed = ethers.parseEther(amount);

    const tx1 = await token.approve(vault.target, parsed);
    await tx1.wait(); // wait for approval

    const tx2 = await vault.deposit(parsed);
    await tx2.wait(); // wait for deposit

    await loadBalances();
  };

  const withdraw = async () => {
    const { vault } = await getContracts();
    const parsed = ethers.parseEther(amount);

    const tx = await vault.withdraw(parsed);
    await tx.wait(); // wait for withdraw

    await loadBalances();
  };

  useEffect(() => {
    loadBalances();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>DeFi Vault</h1>

      <h3>MTK Balance: {mtkBalance}</h3>
      <h3>Vault Shares: {shareBalance}</h3>

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      <button onClick={deposit}>Deposit</button>
      <button onClick={withdraw}>Withdraw</button>
    </div>
  );
}

export default App;