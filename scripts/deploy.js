const { ethers } = require("hardhat");

async function main() {
  console.log("=== MoodiPet Slime Contract Deployment Started ===");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  // Check account balance
  const balance = await deployer.getBalance();
  console.log("Deployer balance:", ethers.utils.formatEther(balance), "ETH");

  // 1. Deploy HealingToken
  console.log("\n1. Deploying HealingToken...");
  const HealingToken = await ethers.getContractFactory("HealingToken");
  const healingToken = await HealingToken.deploy(deployer.address);
  await healingToken.deployed();
  console.log("HealingToken deployment completed:", healingToken.address);

  // 2. Deploy MoodiPetNFT
  console.log("\n2. Deploying MoodiPet Slime NFT...");
  const MoodiPetNFT = await ethers.getContractFactory("MoodiPetNFT");
  const moodiPetNFT = await MoodiPetNFT.deploy(deployer.address);
  await moodiPetNFT.deployed();
  console.log("MoodiPet Slime NFT deployment completed:", moodiPetNFT.address);

  // Output deployment information
  console.log("\n=== Deployment Completed ===");
  console.log("HealingToken address:", healingToken.address);
  console.log("MoodiPet Slime NFT address:", moodiPetNFT.address);
  console.log("Deployer address:", deployer.address);

  // Contract verification information
  console.log("\n=== Contract Verification Commands ===");
  console.log("HealingToken verification:");
  console.log(`npx hardhat verify --network ${network.name} ${healingToken.address} "${deployer.address}"`);
  
  console.log("\nMoodiPet Slime NFT verification:");
  console.log(`npx hardhat verify --network ${network.name} ${moodiPetNFT.address} "${deployer.address}"`);

  // Environment variables file creation
  const envContent = `# MoodiPet Slime Contract Addresses
HEALING_TOKEN_ADDRESS=${healingToken.address}
MOODIPET_NFT_ADDRESS=${moodiPetNFT.address}
DEPLOYER_ADDRESS=${deployer.address}
NETWORK=localhost
`;

  console.log("\n=== Environment Variables File Creation ===");
  console.log("Add the following content to your .env file:");
  console.log(envContent);

  return {
    healingToken: healingToken.address,
    moodiPetNFT: moodiPetNFT.address,
    deployer: deployer.address
  };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error occurred during deployment:", error);
    process.exit(1);
  }); 