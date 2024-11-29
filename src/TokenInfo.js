import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import importedJson from '../src/contracts/FakeBAYC.sol/FakeBAYC.json';

function TokenInfo() {
  const { tokenId } = useParams(); // Récupérer le tokenId depuis l'URL
  const [metadata, setMetadata] = useState(null); // Stocker les métadonnées du token
  const [error, setError] = useState(null); // Stocker les erreurs éventuelles
  const [loading, setLoading] = useState(true); // Indiquer si les données sont en cours de chargement

  const CONTRACT_ADDRESS = "0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE"; // Adresse du contrat
  const ABI = importedJson["abi"]; // Charger l'ABI du contrat

  // Fonction pour récupérer les métadonnées du token
  const fetchMetadata = async () => {
    try {
      if (!window.ethereum) {
        setError("Metamask is not installed!");
        setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);

      // Se connecter à Metamask
      await provider.send("eth_requestAccounts", []);

      // Charger le contrat
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      // Appeler la fonction tokenURI pour récupérer l'URI des métadonnées
      const tokenURI = await contract.tokenURI(tokenId);

      // Vérifier si l'URI existe
      if (!tokenURI) {
        throw new Error("Token does not exist or has no metadata URI.");
      }

      // Récupérer les données JSON des métadonnées
      const response = await fetch(tokenURI);
      if (!response.ok) {
        throw new Error("Failed to fetch metadata.");
      }

      const data = await response.json();
      setMetadata(data); // Stocker les données des métadonnées
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false); // Marquer la fin du chargement
    }
  };

  // Appeler fetchMetadata lorsque le composant est monté
  useEffect(() => {
    fetchMetadata();
  }, [tokenId]);

  // Afficher un message de chargement
  if (loading) {
    return <p>Loading metadata...</p>;
  }

  // Afficher un message d'erreur si le token est invalide
  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  // Afficher les métadonnées si tout va bien
  return (
    <div>
      <h1>Token Information</h1>
      {metadata ? (
        <div>
          <img src={metadata.image} alt={`Token ${tokenId}`} style={{ maxWidth: "300px" }} />
          <h2>{metadata.name}</h2>
          <p>{metadata.description}</p>
          <ul>
            {metadata.attributes.map((attribute, index) => (
              <li key={index}>
                <strong>{attribute.trait_type}:</strong> {attribute.value}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No metadata available for this token.</p>
      )}
    </div>
  );
}

export default TokenInfo;
