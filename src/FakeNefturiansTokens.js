import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ethers, BrowserProvider, Contract } from "ethers";
import importedJson from "../src/contracts/FakeNefturians.sol/FakeNefturians.json"; // Corrigez le chemin si nécessaire

function FakeNefturiansTokens() {
  const { userAddress } = useParams(); // Récupère l'adresse utilisateur depuis l'URL
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const FAKE_NEFTURIANS_ADDRESS = "0x92Da472BE336A517778B86D7982e5fde0C7993c1"; // Remplacez par l'adresse correcte
  const FAKE_NEFTURIANS_ABI = importedJson["abi"];

  const fetchUserTokens = async () => {
    try {
      setLoading(true);
      setError(null);

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

      // Récupère le nombre de tokens de l'utilisateur
      const balance = await contract.balanceOf(userAddress);

      const tokensData = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i); // Récupère l'ID du token
        const tokenURI = await contract.tokenURI(tokenId); // Récupère le lien metadata

        // Fetch metadata JSON depuis le lien URI
        const response = await fetch(tokenURI);
        const metadata = await response.json();

        tokensData.push({
          tokenId: tokenId.toString(),
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
        });
      }

      setTokens(tokensData);
    } catch (err) {
      console.error("Error fetching user tokens:", err);
      setError("An error occurred while fetching user tokens.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTokens();
  }, [userAddress]);

  return (
    <div>
      <h1>Fake Nefturians - Tokens of {userAddress}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          {tokens.length === 0 ? (
            <p>No tokens found for this address.</p>
          ) : (
            tokens.map((token) => (
              <div key={token.tokenId} style={{ marginBottom: "20px" }}>
                <h2>Token ID: {token.tokenId}</h2>
                <p><strong>Name:</strong> {token.name}</p>
                <p><strong>Description:</strong> {token.description}</p>
                <img src={token.image} alt={token.name} style={{ width: "200px" }} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default FakeNefturiansTokens;
