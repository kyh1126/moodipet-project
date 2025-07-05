const ContractManager = require("./ContractManager");

require("dotenv").config();

const main = async () => {
  const NFT_CA = "0xaF30C3c1485232d5876707cEf7bB930F0e7a89d2"; // MoodiPetNFT 컨트랙트 주소
  const tokenId = 1; // 진화시킬 펫의 토큰 ID
  const newEvolution = 2; // 새로운 진화 레벨 (1-5)

  const manager = new ContractManager(NFT_CA, "NFT");
  
  console.log("=== 펫 진화 시작 ===");
  
  // 진화 전 펫 정보 확인
  console.log("진화 전 펫 정보:");
  await manager.getPetAttributes(tokenId);
  
  // 펫 진화
  await manager.evolvePet(tokenId, newEvolution);
  
  // 진화 후 펫 정보 확인
  console.log("\n진화 후 펫 정보:");
  await manager.getPetAttributes(tokenId);
  
  console.log("펫 진화 완료!");
};

main(); 