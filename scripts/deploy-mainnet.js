const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("=== Mainnet Environment MoodiPet Slime Contract Deployment Started ===");
  
  // Check before mainnet deployment
  if (!process.env.MAINNET_PRIVATE_KEY) {
    console.error("❌ MAINNET_PRIVATE_KEY is not set!");
    console.error("You need to set MAINNET_PRIVATE_KEY in .env file for mainnet deployment.");
    process.exit(1);
  }

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);
  console.log(`Deployer balance: ${ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH`);

  // Deployment confirmation
  console.log("\n⚠️  Proceeding with mainnet deployment. Continue? (y/N)");
  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // 1. Deploy HealingToken
  console.log("\n1. Deploying HealingToken...");
  const HealingToken = await ethers.getContractFactory("HealingToken");
  const healingToken = await HealingToken.deploy(deployer.address);
  await healingToken.waitForDeployment();
  const healingTokenAddress = await healingToken.getAddress();
  console.log(`HealingToken deployment completed: ${healingTokenAddress}`);

  // 2. Deploy MoodiPet Slime NFT
  console.log("\n2. Deploying MoodiPet Slime NFT...");
  const MoodiPetNFT = await ethers.getContractFactory("MoodiPetNFT");
  const moodiPetNFT = await MoodiPetNFT.deploy(deployer.address);
  await moodiPetNFT.waitForDeployment();
  const moodiPetNFTAddress = await moodiPetNFT.getAddress();
  console.log(`MoodiPet Slime NFT deployment completed: ${moodiPetNFTAddress}`);

  console.log("\n=== Mainnet Deployment Completed ===");
  console.log(`HealingToken address: ${healingTokenAddress}`);
  console.log(`MoodiPet Slime NFT address: ${moodiPetNFTAddress}`);
  console.log(`Deployer address: ${deployer.address}`);

  // Contract verification commands
  console.log("\n=== Contract Verification Commands ===");
  console.log(`HealingToken verification:`);
  console.log(`npx hardhat verify --network baseMainnet ${healingTokenAddress} "${deployer.address}"`);
  console.log(`\nMoodiPet Slime NFT verification:`);
  console.log(`npx hardhat verify --network baseMainnet ${moodiPetNFTAddress} "${deployer.address}"`);

  // Environment variables file update
  console.log("\n=== Mainnet Environment Variables Setup ===");
  console.log(`Add the following content to your .env file:`);
  console.log(`NEXT_PUBLIC_HEALING_TOKEN_ADDRESS=${healingTokenAddress}`);
  console.log(`NEXT_PUBLIC_MOODIPET_NFT_ADDRESS=${moodiPetNFTAddress}`);
  console.log(`MAINNET_PRIVATE_KEY=${process.env.MAINNET_PRIVATE_KEY}`);
  console.log(`NETWORK=baseMainnet`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 