import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import importedJson from '../src/contracts/FakeBAYC.sol/FakeBAYC.json';

function FakeBayc() {
  const [name, setName] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // To track claim success

  const CONTRACT_ADDRESS = "0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE"; // Replace with your contract address
  var ABI = importedJson["abi"];

  const fetchContractData = async () => {
    try {
      if (!window.ethereum) {
        setError("Metamask is not installed!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

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
      if (!window.ethereum) {
        setError("Metamask is not installed!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner(); // Get the signer for transaction signing

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // Call the claim function
      const tx = await contract.claim(); // Assuming 'claim()' exists in the contract
      await tx.wait(); // Wait for the transaction to be mined

      setSuccess("Token claimed successfully!"); // Show success message
      fetchContractData(); // Refresh contract data
    } catch (err) {
      console.error(err);
      setError("An error occurred while claiming the token.");
    }
  };

  useEffect(() => {
    fetchContractData();
  }, []);

  return (
    <div>
      <h1>Fake BAYC</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          <p><strong>Name:</strong> {name || "Loading..."}</p>
          <p><strong>Total Tokens:</strong> {totalSupply || "Loading..."}</p>
          <button onClick={claimToken}>Claim Token</button> {/* Claim button */}
          {success && <p style={{ color: "green" }}>{success}</p>} {/* Success message */}
        </div>
      )}
    </div>
  );
}

export default FakeBayc;
