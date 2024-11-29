import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import importedJson from "../src/contracts/FakeBAYC.sol/FakeBAYC.json";

function FakeBayc() {
  const [name, setName] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const CONTRACT_ADDRESS = "0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE"; // Address of FakeBAYC contract
  const ABI = importedJson["abi"];

  const fetchContractData = async () => {
    try {
      // Check if Metamask is installed
      if (!window.ethereum) {
        setError("Metamask is not installed!");
        return;
      }

      // Initialize ethers.js
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Connect to Metamask
      await provider.send("eth_requestAccounts", []);

      // Load the contract
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      // Call the contract functions
      const contractName = await contract.name();
      const contractTotalSupply = await contract.totalSupply();

      setName(contractName);
      setTotalSupply(contractTotalSupply.toString());
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching contract data.");
    }
  };

  const claimToken = async () => {
    try {
      // Check if Metamask is installed
      if (!window.ethereum) {
        setError("Metamask is not installed!");
        return;
      }

      // Initialize ethers.js
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Get the signer (connected user)
      const signer = await provider.getSigner();

      // Load the contract with signer
      const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Call the `claimAToken` function
      const tx = await contractWithSigner.claimAToken();
      await tx.wait(); // Wait for the transaction to be mined

      setSuccess("Token claimed successfully!");
      console.log("Token claimed successfully!");
    } catch (err) {
      console.error("An error occurred while claiming the token:", err);
      setError("An error occurred while claiming the token.");
    }
  };

  useEffect(() => {
    fetchContractData();
  }, []);

  return (
    <div>
      <h1>Fake BAYC</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      {!error && (
        <div>
          <p>
            <strong>Name:</strong> {name || "Loading..."}
          </p>
          <p>
            <strong>Total Tokens:</strong> {totalSupply || "Loading..."}
          </p>
          <button onClick={claimToken} style={{ marginTop: "20px" }}>
            Claim Token
          </button>
        </div>
      )}
    </div>
  );
}

export default FakeBayc;
