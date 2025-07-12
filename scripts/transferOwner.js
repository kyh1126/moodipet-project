const ContractManager = require("./ContractManager");

require("dotenv").config();

const main = async () => {
  const NFT_CA = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // MoodiPetNFT contract address
  const newOwner = "0x56D110cD9D2b7c961516bCDf92b164107c044757"; // New owner address

  console.log("=== Contract Ownership Transfer ===");
  console.log(`Current contract address: ${NFT_CA}`);
  console.log(`New owner: ${newOwner}`);
  
  const manager = new ContractManager(NFT_CA, "NFT");
  
  // Check current owner
  await manager.getOwner();
  
  // Transfer ownership
  await manager.transferOwnership(newOwner);
  
  console.log("Ownership transfer completed!");
};

main().catch((error) => {
  console.error("Error occurred:", error);
  process.exit(1);
}); 