const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("=== 메인넷 환경 MoodiPet 슬라임 컨트랙트 배포 시작 ===");
  
  // 메인넷 배포 전 확인
  if (!process.env.MAINNET_PRIVATE_KEY) {
    console.error("❌ MAINNET_PRIVATE_KEY가 설정되지 않았습니다!");
    console.error("메인넷 배포를 위해서는 .env 파일에 MAINNET_PRIVATE_KEY를 설정해야 합니다.");
    process.exit(1);
  }

  const [deployer] = await ethers.getSigners();
  console.log(`배포자 주소: ${deployer.address}`);
  console.log(`배포자 잔액: ${ethers.formatEther(await deployer.provider.getBalance(deployer.address))} ETH`);

  // 배포 확인
  console.log("\n⚠️  메인넷 배포를 진행합니다. 계속하시겠습니까? (y/N)");
  console.log("배포자 주소:", deployer.address);
  console.log("배포자 잔액:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // 1. HealingToken 배포
  console.log("\n1. HealingToken 배포 중...");
  const HealingToken = await ethers.getContractFactory("HealingToken");
  const healingToken = await HealingToken.deploy(deployer.address);
  await healingToken.waitForDeployment();
  const healingTokenAddress = await healingToken.getAddress();
  console.log(`HealingToken 배포 완료: ${healingTokenAddress}`);

  // 2. MoodiPet 슬라임 NFT 배포
  console.log("\n2. MoodiPet 슬라임 NFT 배포 중...");
  const MoodiPetNFT = await ethers.getContractFactory("MoodiPetNFT");
  const moodiPetNFT = await MoodiPetNFT.deploy(deployer.address);
  await moodiPetNFT.waitForDeployment();
  const moodiPetNFTAddress = await moodiPetNFT.getAddress();
  console.log(`MoodiPet 슬라임 NFT 배포 완료: ${moodiPetNFTAddress}`);

  console.log("\n=== 메인넷 배포 완료 ===");
  console.log(`HealingToken 주소: ${healingTokenAddress}`);
  console.log(`MoodiPet 슬라임 NFT 주소: ${moodiPetNFTAddress}`);
  console.log(`배포자 주소: ${deployer.address}`);

  // 컨트랙트 검증 명령어
  console.log("\n=== 컨트랙트 검증 명령어 ===");
  console.log(`HealingToken 검증:`);
  console.log(`npx hardhat verify --network baseMainnet ${healingTokenAddress} "${deployer.address}"`);
  console.log(`\nMoodiPet 슬라임 NFT 검증:`);
  console.log(`npx hardhat verify --network baseMainnet ${moodiPetNFTAddress} "${deployer.address}"`);

  // 환경변수 파일 업데이트
  console.log("\n=== 메인넷 환경변수 설정 ===");
  console.log(`다음 내용을 .env 파일에 추가하세요:`);
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