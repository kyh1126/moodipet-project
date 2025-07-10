const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("=== 로컬 환경 MoodiPet 슬라임 컨트랙트 배포 시작 ===");
  
  const [deployer] = await ethers.getSigners();
  console.log(`배포자 주소: ${deployer.address}`);
  const balance = await deployer.getBalance();
  console.log(`배포자 잔액: ${ethers.utils.formatEther(balance)} ETH`);

  // 1. HealingToken 배포
  console.log("\n1. HealingToken 배포 중...");
  const HealingToken = await ethers.getContractFactory("HealingToken");
  const healingToken = await HealingToken.deploy(deployer.address);
  await healingToken.deployed();
  const healingTokenAddress = healingToken.address;
  console.log(`HealingToken 배포 완료: ${healingTokenAddress}`);

  // 2. MoodiPet 슬라임 NFT 배포
  console.log("\n2. MoodiPet 슬라임 NFT 배포 중...");
  const MoodiPetNFT = await ethers.getContractFactory("MoodiPetNFT");
  const moodiPetNFT = await MoodiPetNFT.deploy(deployer.address);
  await moodiPetNFT.deployed();
  const moodiPetNFTAddress = moodiPetNFT.address;
  console.log(`MoodiPet 슬라임 NFT 배포 완료: ${moodiPetNFTAddress}`);

  console.log("\n=== 로컬 배포 완료 ===");
  console.log(`HealingToken 주소: ${healingTokenAddress}`);
  console.log(`MoodiPet 슬라임 NFT 주소: ${moodiPetNFTAddress}`);
  console.log(`배포자 주소: ${deployer.address}`);

  // 환경변수 파일 업데이트
  console.log("\n=== 로컬 환경변수 설정 ===");
  console.log(`다음 내용을 .env 파일에 추가하세요:`);
  console.log(`NEXT_PUBLIC_HEALING_TOKEN_ADDRESS=${healingTokenAddress}`);
  console.log(`NEXT_PUBLIC_MOODIPET_NFT_ADDRESS=${moodiPetNFTAddress}`);
  console.log(`LOCAL_PRIVATE_KEY=${process.env.LOCAL_PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"}`);
  console.log(`NETWORK=localhost`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 