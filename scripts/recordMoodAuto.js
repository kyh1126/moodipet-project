const { ethers, network } = require("hardhat");
require("dotenv").config();

// HealingToken ABI and address
const healingTokenJson = require("../frontend/src/lib/abi/HealingToken.json");
const healingTokenAbi = healingTokenJson.abi;
// Temporarily hardcoded (restore to environment variable after testing)
const healingTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  // Use Hardhat's first account
  const [signer] = await ethers.getSigners();
  const healingToken = new ethers.Contract(healingTokenAddress, healingTokenAbi, signer);

  // Record for 10 consecutive days to earn more tokens
  for (let i = 0; i < 10; i++) {
    // Execute emotion recording transaction
    const tx = await healingToken.recordMood(signer.address, "happy");
    await tx.wait();
    console.log(`Day ${i + 1}: recordMood transaction completed`);

    // Move time by one day (86400 seconds) and mine block
    await network.provider.send("evm_increaseTime", [86400]);
    await network.provider.send("evm_mine");
  }

  // Check consecutive recording days
  const days = await healingToken.getConsecutiveDays(signer.address);
  console.log("Final consecutive recording days:", days.toString());
  
  // Check token balance
  const balance = await healingToken.balanceOf(signer.address);
  console.log("Final token balance:", balance.toString(), "HEAL");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}); 
