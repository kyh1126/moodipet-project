const ContractManager = require("./ContractManager");

require("dotenv").config();

const main = async () => {
  const NFT_CA = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // MoodiPetNFT 컨트랙트 주소
  const newOwner = "0x56D110cD9D2b7c961516bCDf92b164107c044757"; // 새로운 소유자 주소

  console.log("=== 컨트랙트 소유권 이전 ===");
  console.log(`현재 컨트랙트 주소: ${NFT_CA}`);
  console.log(`새로운 소유자: ${newOwner}`);
  
  const manager = new ContractManager(NFT_CA, "NFT");
  
  // 현재 소유자 확인
  await manager.getOwner();
  
  // 소유권 이전
  await manager.transferOwnership(newOwner);
  
  console.log("소유권 이전 완료!");
};

main().catch((error) => {
  console.error("오류 발생:", error);
  process.exit(1);
}); 