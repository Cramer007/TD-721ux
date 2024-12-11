import React, { useState } from "react";
import { ethers } from "ethers";
import importedJson from "../src/contracts/FakeMeebitsClaimer.sol/FakeMeebitsClaimer.json"; // ABI du contrat
import signatures from "../src/claimerV1-tools/output-sig.json"; // Importer les signatures générées

const FakeMeebits = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [tokenId, setTokenId] = useState("");

  const FAKE_MEEBITS_ADDRESS = "0x9B6F990793347005bb8a252A67F0FA4d56521447"; // Adresse du contrat FakeMeebitsClaimer
  const FAKE_MEEBITS_ABI = importedJson.abi;

  const claimAToken = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!window.ethereum) {
        throw new Error("Metamask is not installed");
      }

      // Initialisez le fournisseur et le signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        FAKE_MEEBITS_ADDRESS,
        FAKE_MEEBITS_ABI,
        signer
      );

      // Vérifier si la signature existe pour ce token ID
      const signatureData = signatures.find(
        (sig) => sig.tokenNumber === parseInt(tokenId)
      );

      if (!signatureData) {
        throw new Error("No signature found for the given Token ID");
      }

      // Appel de la fonction claimAToken avec le tokenId et la signature
      const tx = await contract.claimAToken(tokenId, signatureData.signature);
      await tx.wait();

      setSuccess(`Token ${tokenId} minted successfully!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Fake Meebits</h2>
      <div>
        <label>
          Token ID:
          <input
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            placeholder="Enter token ID"
          />
        </label>
      </div>
      <button onClick={claimAToken} disabled={loading}>
        {loading ? "Minting..." : "Mint Token"}
      </button>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default FakeMeebits;
