const Web3 = require("web3");
const fs = require("fs");
const HDWalletProvider = require("@truffle/hdwallet-provider");

///// Configuration
const ERC721ContractAddress = "0x750e319C15EDaD2C5a8260C0bf70314A178Fc40B"; // Remplacez par l'adresse du contrat ERC721
const alchemyApiKey = "AwXNQB1sZceWq5qoYpeR7U0jsYYvoBHv"; // Votre clé API Alchemy
const privateKey = "03771d4edf1ec9eeb581e8b2b3b6cc3b7c259473213165bf3dea7bef0ae951a1"; // Votre clé privée

// Configuration du provider avec Alchemy pour Holesky
let provider = new HDWalletProvider({
  privateKeys: [privateKey],
  providerOrUrl: `https://eth-holesky.g.alchemy.com/v2/${alchemyApiKey}`, // URL pour Holesky
});

const web3 = new Web3(provider);

async function signAllTokens() {
  console.log("Adresse du signataire :", provider.addresses[0]);

  let signaturesDictionnary = [];
  for (let i = 0; i < 20000; i++) {
    // Encodage des paramètres
    const parametersEncoded = web3.eth.abi.encodeParameters(
      ["address", "uint256"],
      [ERC721ContractAddress, i]
    );

    // Calcul du hash à signer
    const hashToSign = web3.utils.keccak256(parametersEncoded);

    // Génération de la signature
    const signature = await web3.eth.sign(hashToSign, provider.addresses[0]);

    // Ajout de la signature au dictionnaire
    signaturesDictionnary.push({
      tokenNumber: i,
      signature: signature,
    });

    // Affichage de progression tous les 100 tokens
    if (i % 100 === 0) {
      console.log(`Progress: Signed ${i} tokens`);
    }
  }

  // Sauvegarde dans un fichier JSON
  fs.writeFile("output-sig.json", JSON.stringify(signaturesDictionnary), (err) => {
    if (err) throw err;
    console.log("Signatures générées et sauvegardées dans output-sig.json");
  });
}

signAllTokens();
