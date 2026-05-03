import { useState } from "react";
import { getContracts } from "./utils/contract";
import { ethers } from "ethers";

function App() {
  const [amount, setAmount] = useState("");

  const deposit = async () => {
    const { vault, token } = await getContracts();
    const parsed = ethers.parseEther(amount);

    await token.approve(vault.target, parsed);
    await vault.deposit(parsed);
  };

  const withdraw = async () => {
    const { vault } = await getContracts();
    const parsed = ethers.parseEther(amount);
    await vault.withdraw(parsed);
  };

  return (
    <div>
      <h1>DeFi Vault</h1>
      <input value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={deposit}>Deposit</button>
      <button onClick={withdraw}>Withdraw</button>
    </div>
  );
}

export default App;
