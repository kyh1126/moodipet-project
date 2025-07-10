const { ethers } = require("ethers");
const { abi: nftAbi } = require("../artifacts/contracts/NFT.sol/MoodiPetNFT.json");
const { abi: healingTokenAbi } = require("../artifacts/contracts/HealingToken.sol/HealingToken.json");

require("dotenv").config();

class ContractManager {
  constructor(contractAddress, contractType = "NFT") {
    this.contractAddress = contractAddress;
    this.contractType = contractType;
    this.provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL || "http://localhost:8545");
    this.signer = new ethers.Wallet(process.env.TESTNET_PRIVATE_KEY, this.provider);
    
    // 컨트랙트 타입에 따라 다른 ABI 사용
    const abi = contractType === "NFT" ? nftAbi : healingTokenAbi;
    
    this.writeContract = new ethers.Contract(contractAddress, abi, this.signer);
    this.contract = new ethers.Contract(contractAddress, abi, this.provider);
  }

  // NFT 관련 함수들
  async mintMoodiPet(to, uri, emotion, color, evolution, personality) {
    try {
      console.log(`MoodiPet NFT를 ${to}에게 민팅합니다.`);
      console.log(`속성: 감정=${emotion}, 색상=${color}, 진화=${evolution}, 성격=${personality}`);
      const tx = await this.writeContract.mintMoodiPet(to, uri, emotion, color, evolution, personality);
      await tx.wait();
      console.log("MoodiPet NFT 민팅 완료");
    } catch (error) {
      console.error("mintMoodiPet 오류:", error);
    }
  }

  async getPetAttributes(tokenId) {
    try {
      const attributes = await this.contract.getPetAttributes(tokenId);
      console.log("펫 속성:", {
        emotion: attributes.emotion,
        color: attributes.color,
        evolution: attributes.evolution,
        createdAt: new Date(attributes.createdAt * 1000).toLocaleString(),
        personality: attributes.personality
      });
      return attributes;
    } catch (error) {
      console.error("getPetAttributes 오류:", error);
    }
  }

  async getUserPets(userAddress) {
    try {
      const pets = await this.contract.getUserPets(userAddress);
      console.log(`사용자 ${userAddress}의 펫 수: ${pets.length}, 목록:`, pets);
      return pets;
    } catch (error) {
      console.error("getUserPets 오류:", error);
    }
  }

  async evolvePet(tokenId, newEvolution) {
    try {
      console.log(`펫 ${tokenId}를 진화 레벨 ${newEvolution}로 진화시킵니다.`);
      const tx = await this.writeContract.evolvePet(tokenId, newEvolution);
      await tx.wait();
      console.log("펫 진화 완료");
    } catch (error) {
      console.error("evolvePet 오류:", error);
    }
  }

  // Healing Token 관련 함수들
  async recordMood(userAddress, emotion) {
    try {
      console.log(`사용자 ${userAddress}의 감정 기록: ${emotion}`);
      const tx = await this.writeContract.recordMood(userAddress, emotion);
      await tx.wait();
      console.log("감정 기록 완료");
    } catch (error) {
      console.error("recordMood 오류:", error);
    }
  }

  async getUserMoodRecord(userAddress) {
    try {
      const record = await this.contract.getUserMoodRecord(userAddress);
      console.log("사용자 감정 기록:", {
        마지막기록시간: new Date(record.lastRecordTime * 1000).toLocaleString(),
        연속일수: record.consecutiveDays.toString(),
        총기록수: record.totalRecords.toString()
      });
      return record;
    } catch (error) {
      console.error("getUserMoodRecord 오류:", error);
    }
  }

  async getConsecutiveDays(userAddress) {
    try {
      const days = await this.contract.getConsecutiveDays(userAddress);
      console.log(`사용자 ${userAddress}의 연속 기록 일수: ${days}`);
      return days;
    } catch (error) {
      console.error("getConsecutiveDays 오류:", error);
    }
  }

  async hasCompletedWeek(userAddress) {
    try {
      const completed = await this.contract.hasCompletedWeek(userAddress);
      console.log(`사용자 ${userAddress}의 7일 연속 기록 달성 여부: ${completed}`);
      return completed;
    } catch (error) {
      console.error("hasCompletedWeek 오류:", error);
    }
  }

  // 기존 함수들 (하위 호환성)
  async transferOwnership(newOwner) {
    try {
      console.log(`소유권을 ${newOwner}에게 이전합니다...`);
      const tx = await this.writeContract.transferOwnership(newOwner);
      await tx.wait();
      console.log("소유권 이전 완료");
    } catch (error) {
      console.error("transferOwnership 오류:", error);
    }
  }

  async safeMint(to, uri) {
    try {
      console.log(`NFT를 ${to}에게 민팅합니다. URI: ${uri}`);
      const tx = await this.writeContract.safeMint(to, uri);
      await tx.wait();
      console.log("NFT 민팅 완료");
    } catch (error) {
      console.error("safeMint 오류:", error);
    }
  }

  async getOwner() {
    try {
      const owner = await this.contract.owner();
      console.log("현재 소유자:", owner);
      return owner;
    } catch (error) {
      console.error("getOwner 오류:", error);
    }
  }

  async getURI(tokenId) {
    try {
      const uri = await this.contract.tokenURI(tokenId);
      console.log("URI:", uri);
      return uri;
    } catch (error) {
      console.error("getURI 오류:", error);
    }
  }
}

module.exports = ContractManager;
