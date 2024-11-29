import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider, Contract, formatEther } from "ethers";
import importedJson from "../src/contracts/FakeNefturians.sol/FakeNefturians.json"; // Corrigez le chemin si nécessaire

const BigInt = window.BigInt || Number; // Support de BigInt

function FakeNefturians() {
  const [minPrice, setMinPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const FAKE_NEFTURIANS_ADDRESS = "0x92Da472BE336A517778B86D7982e5fde0C7993c1"; // Remplacez par l'adresse correcte
  const FAKE_NEFTURIANS_ABI = importedJson["abi"];

  const fetchMinPrice = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (!window.ethereum) {
        setError("Metamask is not installed!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new Contract(
        FAKE_NEFTURIANS_ADDRESS,
        FAKE_NEFTURIANS_ABI,
        provider
      );

      // Utiliser la bonne fonction "tokenPrice" depuis l'ABI
      const tokenPrice = await contract.tokenPrice();
      setMinPrice(formatEther(tokenPrice));
    } catch (err) {
      console.error("Error fetching minimum price:", err);
      setError("An error occurred while fetching the minimum token price.");
    }
  };

  const buyToken = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setLoading(true);
        setError(null);
        setSuccess(null);

        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(
          FAKE_NEFTURIANS_ADDRESS,
          FAKE_NEFTURIANS_ABI,
          signer
        );

        const tokenPrice = await contract.tokenPrice(); // Utiliser la bonne fonction
        console.log("Contract price:", formatEther(tokenPrice), "ETH");

        const priceToSend = BigInt(tokenPrice) * BigInt(101) / BigInt(100); // Ajout de surplus
        console.log("Sending price with surplus:", formatEther(priceToSend), "ETH");

        const tx = await contract.buyAToken({
          value: priceToSend,
          gasLimit: 200000,
        });

        console.log("Transaction sent:", tx.hash);
        setSuccess("Transaction sent! Waiting for confirmation...");

        const receipt = await tx.wait();
        console.log("Transaction receipt:", receipt);

        if (receipt.status === 0) {
          throw new Error("Transaction failed");
        }

        setSuccess(
          "Token purchased successfully! Transaction hash: " + tx.hash
        );
      } catch (error) {
        console.error("Detailed error:", error);

        if (error.message.includes("insufficient funds")) {
          setError(
            "Insufficient funds to complete the transaction."
          );
        } else if (error.message.includes("user rejected")) {
          setError("Transaction was rejected by user.");
        } else if (error.data) {
          setError(`Contract error: ${error.data.message || error.message}`);
        } else {
          setError(`Transaction failed: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchMinPrice();
  }, []);

  return (
    <div>
      <h1>Fake Nefturians</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : success ? (
        <p style={{ color: "green" }}>{success}</p>
      ) : (
        <>
          <p>
            <strong>Minimum Token Price:</strong> {minPrice || "Loading..."} ETH
          </p>
          <button onClick={buyToken} disabled={loading}>
            Buy Token
          </button>
        </>
      )}
    </div>
  );
}

export default FakeNefturians;
