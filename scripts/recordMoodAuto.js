const { ethers, network } = require("hardhat");
require("dotenv").config();

// HealingToken ABI 및 주소
const healingTokenJson = require("../frontend/src/lib/abi/HealingToken.json");
const healingTokenAbi = healingTokenJson.abi;
// 임시로 하드코딩 (테스트 후 환경 변수로 복구)
const healingTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  // Hardhat의 첫 번째 계정 사용
  const [signer] = await ethers.getSigners();
  const healingToken = new ethers.Contract(healingTokenAddress, healingTokenAbi, signer);

  for (let i = 0; i < 3; i++) {
    // 감정 기록 트랜잭션 실행
    const tx = await healingToken.recordMood(signer.address, "기쁨");
    await tx.wait();
    console.log(`Day ${i + 1}: recordMood 트랜잭션 완료`);

    // 하루(86400초) 시간 이동 및 블록 마이닝
    await network.provider.send("evm_increaseTime", [86400]);
    await network.provider.send("evm_mine");
  }

  // 연속 기록 일수 확인
  const days = await healingToken.getConsecutiveDays(signer.address);
  console.log("최종 연속 기록 일수:", days.toString());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}); 
