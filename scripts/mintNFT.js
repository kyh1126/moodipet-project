const ContractManager = require("./ContractManager");

require("dotenv").config();

const main = async () => {
  const NFT_CA = "0xaF30C3c1485232d5876707cEf7bB930F0e7a89d2"; // MoodiPetNFT contract address
  const HEALING_TOKEN_CA = "0x..."; // HealingToken contract address (update after deployment)

  const manager = new ContractManager(NFT_CA);
  await manager.getOwner();
  
  // Emotion slime minting example
  await manager.mintMoodiPet(
    "0xEF70277aBF02aEa645F04A0689B2eC9e67CEa670", // User address
    "https://gateway.pinata.cloud/ipfs/QmZ1YzZ3o6Qv9b5J6jyjv5zXJ6tX7k8vqgU1WbQx4m8KZm", // Metadata URI
    "sad", // Emotion
    "blue", // Color
    1, // Evolution level (1-5)
    "quiet" // Personality
  );
  
  console.log("Emotion slime NFT minting completed!");
};

main();
