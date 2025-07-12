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
    
    // Use different ABI based on contract type
    const abi = contractType === "NFT" ? nftAbi : healingTokenAbi;
    
    this.writeContract = new ethers.Contract(contractAddress, abi, this.signer);
    this.contract = new ethers.Contract(contractAddress, abi, this.provider);
  }

  // NFT related functions
  async mintMoodiPet(to, uri, emotion, color, evolution, personality) {
    try {
      console.log(`Minting MoodiPet NFT to ${to}.`);
      console.log(`Attributes: emotion=${emotion}, color=${color}, evolution=${evolution}, personality=${personality}`);
      const tx = await this.writeContract.mintMoodiPet(to, uri, emotion, color, evolution, personality);
      await tx.wait();
      console.log("MoodiPet NFT minting completed");
    } catch (error) {
      console.error("mintMoodiPet error:", error);
    }
  }

  async getPetAttributes(tokenId) {
    try {
      const attributes = await this.contract.getPetAttributes(tokenId);
      console.log("Pet attributes:", {
        emotion: attributes.emotion,
        color: attributes.color,
        evolution: attributes.evolution,
        createdAt: new Date(attributes.createdAt * 1000).toLocaleString(),
        personality: attributes.personality
      });
      return attributes;
    } catch (error) {
      console.error("getPetAttributes error:", error);
    }
  }

  async getUserPets(userAddress) {
    try {
      const pets = await this.contract.getUserPets(userAddress);
      console.log(`User ${userAddress} pet count: ${pets.length}, list:`, pets);
      return pets;
    } catch (error) {
      console.error("getUserPets error:", error);
    }
  }

  async evolvePet(tokenId, newEvolution) {
    try {
      console.log(`Evolving pet ${tokenId} to evolution level ${newEvolution}.`);
      const tx = await this.writeContract.evolvePet(tokenId, newEvolution);
      await tx.wait();
      console.log("Pet evolution completed");
    } catch (error) {
      console.error("evolvePet error:", error);
    }
  }

  // Healing Token related functions
  async recordMood(userAddress, emotion) {
    try {
      console.log(`Recording emotion for user ${userAddress}: ${emotion}`);
      const tx = await this.writeContract.recordMood(userAddress, emotion);
      await tx.wait();
      console.log("Emotion recording completed");
    } catch (error) {
      console.error("recordMood error:", error);
    }
  }

  async getUserMoodRecord(userAddress) {
    try {
      const record = await this.contract.getUserMoodRecord(userAddress);
      console.log("User emotion record:", {
        lastRecordTime: new Date(record.lastRecordTime * 1000).toLocaleString(),
        consecutiveDays: record.consecutiveDays.toString(),
        totalRecords: record.totalRecords.toString()
      });
      return record;
    } catch (error) {
      console.error("getUserMoodRecord error:", error);
    }
  }

  async getConsecutiveDays(userAddress) {
    try {
      const days = await this.contract.getConsecutiveDays(userAddress);
      console.log(`User ${userAddress} consecutive recording days: ${days}`);
      return days;
    } catch (error) {
      console.error("getConsecutiveDays error:", error);
    }
  }

  async hasCompletedWeek(userAddress) {
    try {
      const completed = await this.contract.hasCompletedWeek(userAddress);
      console.log(`User ${userAddress} 7-day consecutive record achievement: ${completed}`);
      return completed;
    } catch (error) {
      console.error("hasCompletedWeek error:", error);
    }
  }

  // Legacy functions (backward compatibility)
  async transferOwnership(newOwner) {
    try {
      console.log(`Transferring ownership to ${newOwner}...`);
      const tx = await this.writeContract.transferOwnership(newOwner);
      await tx.wait();
      console.log("Ownership transfer completed");
    } catch (error) {
      console.error("transferOwnership error:", error);
    }
  }

  async safeMint(to, uri) {
    try {
      console.log(`Minting NFT to ${to}. URI: ${uri}`);
      const tx = await this.writeContract.safeMint(to, uri);
      await tx.wait();
      console.log("NFT minting completed");
    } catch (error) {
      console.error("safeMint error:", error);
    }
  }

  async getOwner() {
    try {
      const owner = await this.contract.owner();
      console.log("Current owner:", owner);
      return owner;
    } catch (error) {
      console.error("getOwner error:", error);
    }
  }

  async getURI(tokenId) {
    try {
      const uri = await this.contract.tokenURI(tokenId);
      console.log("URI:", uri);
      return uri;
    } catch (error) {
      console.error("getURI error:", error);
    }
  }
}

module.exports = ContractManager;
