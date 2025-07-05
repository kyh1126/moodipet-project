const ContractManager = require("./ContractManager");

require("dotenv").config();

const main = async () => {
  const HEALING_TOKEN_CA = "0x..."; // HealingToken 컨트랙트 주소 (배포 후 업데이트 필요)
  const userAddress = "0xEF70277aBF02aEa645F04A0689B2eC9e67CEa670"; // 사용자 주소
  const emotion = "우울"; // 기록할 감정

  const manager = new ContractManager(HEALING_TOKEN_CA, "HealingToken");
  
  console.log("=== 감정 기록 시작 ===");
  
  // 사용자 현재 상태 확인
  await manager.getUserMoodRecord(userAddress);
  await manager.getConsecutiveDays(userAddress);
  
  // 감정 기록
  await manager.recordMood(userAddress, emotion);
  
  // 기록 후 상태 확인
  console.log("\n=== 기록 후 상태 ===");
  await manager.getUserMoodRecord(userAddress);
  await manager.getConsecutiveDays(userAddress);
  await manager.hasCompletedWeek(userAddress);
  
  console.log("감정 기록 완료!");
};

main(); 