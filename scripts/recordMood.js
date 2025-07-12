const ContractManager = require("./ContractManager");

require("dotenv").config();

const main = async () => {
  const HEALING_TOKEN_CA = process.env.NEXT_PUBLIC_HEALING_TOKEN_ADDRESS; // HealingToken contract address
  const userAddress = process.env.NEXT_PUBLIC_USER_ADDRESS || "0xEF70277aBF02aEa645F04A0689B2eC9e67CEa670"; // User address
  const emotion = "sad"; // Emotion to record

  const manager = new ContractManager(HEALING_TOKEN_CA, "HealingToken");
  
  console.log("=== Emotion Recording Started ===");
  
  // Check user current status
  await manager.getUserMoodRecord(userAddress);
  await manager.getConsecutiveDays(userAddress);

  // Record emotion
  await manager.recordMood(userAddress, emotion);
  
  // Check status after recording
  console.log("\n=== Status After Recording ===");
  await manager.getUserMoodRecord(userAddress);
  await manager.getConsecutiveDays(userAddress);
  await manager.hasCompletedWeek(userAddress);
  
  console.log("Emotion recording completed!");
};

main(); 