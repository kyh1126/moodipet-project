const { ethers } = require("hardhat");

async function main() {
  console.log("=== MoodiPet 컨트랙트 배포 시작 ===");

  // 배포자 계정 가져오기
  const [deployer] = await ethers.getSigners();
  console.log("배포자 주소:", deployer.address);

  // 계정 잔액 확인
  const balance = await deployer.getBalance();
  console.log("배포자 잔액:", ethers.utils.formatEther(balance), "ETH");

  // 1. HealingToken 배포
  console.log("\n1. HealingToken 배포 중...");
  const HealingToken = await ethers.getContractFactory("HealingToken");
  const healingToken = await HealingToken.deploy(deployer.address);
  await healingToken.deployed();
  console.log("HealingToken 배포 완료:", healingToken.address);

  // 2. MoodiPetNFT 배포
  console.log("\n2. MoodiPetNFT 배포 중...");
  const MoodiPetNFT = await ethers.getContractFactory("MoodiPetNFT");
  const moodiPetNFT = await MoodiPetNFT.deploy(deployer.address);
  await moodiPetNFT.deployed();
  console.log("MoodiPetNFT 배포 완료:", moodiPetNFT.address);

  // 배포 정보 출력
  console.log("\n=== 배포 완료 ===");
  console.log("HealingToken 주소:", healingToken.address);
  console.log("MoodiPetNFT 주소:", moodiPetNFT.address);
  console.log("배포자 주소:", deployer.address);

  // 컨트랙트 검증 정보
  console.log("\n=== 컨트랙트 검증 명령어 ===");
  console.log("HealingToken 검증:");
  console.log(`npx hardhat verify --network ${network.name} ${healingToken.address} "${deployer.address}"`);
  
  console.log("\nMoodiPetNFT 검증:");
  console.log(`npx hardhat verify --network ${network.name} ${moodiPetNFT.address} "${deployer.address}"`);

  // 환경 변수 파일 생성
  const envContent = `# MoodiPet Contract Addresses
HEALING_TOKEN_ADDRESS=${healingToken.address}
MOODIPET_NFT_ADDRESS=${moodiPetNFT.address}
DEPLOYER_ADDRESS=${deployer.address}
NETWORK=localhost
`;

  console.log("\n=== 환경 변수 파일 생성 ===");
  console.log("다음 내용을 .env 파일에 추가하세요:");
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
    console.error("배포 중 오류 발생:", error);
    process.exit(1);
  }); 