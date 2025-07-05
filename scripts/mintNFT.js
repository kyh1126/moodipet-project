const ContractManager = require("./ContractManager");

require("dotenv").config();

const main = async () => {
  const NFT_CA = "0xaF30C3c1485232d5876707cEf7bB930F0e7a89d2"; // MoodiPetNFT 컨트랙트 주소
  const HEALING_TOKEN_CA = "0x..."; // HealingToken 컨트랙트 주소 (배포 후 업데이트 필요)

  const manager = new ContractManager(NFT_CA);
  await manager.getOwner();
  
  // 감정 펫 민팅 예시
  await manager.mintMoodiPet(
    "0xEF70277aBF02aEa645F04A0689B2eC9e67CEa670", // 사용자 주소
    "https://gateway.pinata.cloud/ipfs/QmZ1YzZ3o6Qv9b5J6jyjv5zXJ6tX7k8vqgU1WbQx4m8KZm", // 메타데이터 URI
    "우울", // 감정
    "파란색", // 색깔
    1, // 진화 정도 (1-5)
    "슬라임" // 성격
  );
  
  console.log("감정 펫 NFT 민팅 완료!");
};

main();
