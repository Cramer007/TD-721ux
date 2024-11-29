import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom'; // Pour gérer la redirection

function ChainInfo() {
  const [chainId, setChainId] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Utilisé pour rediriger

  const HOLKESKY_CHAIN_ID = "17000"; // Remplace par le vrai Chain ID de Holesky

  // Fonction pour se connecter à Metamask et récupérer les informations
  const connectMetamask = async () => {
    try {
      // Vérifier si Metamask est installé
      if (!window.ethereum) {
        setError("Metamask is not installed!");
        return;
      }

      // Initialiser le fournisseur Ethers.js
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Demander à l'utilisateur de se connecter
      const accounts = await provider.send("eth_requestAccounts", []);
      setUserAddress(accounts[0]); // Récupérer l'adresse utilisateur

      // Récupérer les informations réseau
      const network = await provider.getNetwork();
      setChainId(network.chainId.toString());
      console.log(network); // Debug pour afficher les infos du réseau

      // Rediriger vers la page d'erreur si ce n'est pas Holesky
      if (network.chainId.toString() !== HOLKESKY_CHAIN_ID) {
        navigate("/error"); // Redirection
      }

      // Récupérer le dernier numéro de bloc
      const blockNumber = await provider.getBlockNumber();
      setBlockNumber(blockNumber);
    } catch (err) {
      console.error(err);
      setError("An error occurred while connecting to Metamask.");
    }
  };

  // Appeler la fonction connectMetamask lors du chargement du composant
  useEffect(() => {
    connectMetamask();
  }, []);

  return (
    <div>
      <h1>Chain Info</h1>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div>
          <p><strong>ChainId:</strong> {chainId || "Loading..."}</p>
          <p><strong>Last Block Number:</strong> {blockNumber || "Loading..."}</p>
          <p><strong>User Address:</strong> {userAddress || "Loading..."}</p>
        </div>
      )}
    </div>
  );
}

export default ChainInfo;
