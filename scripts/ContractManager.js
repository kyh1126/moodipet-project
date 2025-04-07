const { ethers } = require("ethers");
const { abi } = require("../artifacts/contracts/NFT.sol/NFT.json");

require("dotenv").config();

class ContractManager {
  constructor(contractAddress) {
    this.contractAddress = contractAddress;
    this.provider = new ethers.JsonRpcProvider("https://sepolia.base.org");
    this.signer = new ethers.Wallet(process.env.TESTNET_PRIVATE_KEY, this.provider);
    this.writeContract = new ethers.Contract(contractAddress, abi, this.signer);
    this.contract = new ethers.Contract(contractAddress, abi, this.provider);
  }

  async transferOwnership(newOwner) {
    try {
      console.log(`Transferring ownership to ${newOwner}...`);
      const tx = await this.contract.transferOwnership(newOwner);
      await tx.wait();
      console.log("Ownership transferred");
    } catch (error) {
      console.error("Error in transferOwnership:", error);
    }
  }

  async safeMint(to, uri) {
    try {
      console.log(`Minting NFT to ${to} with URI: ${uri}`);
      const tx = await this.writeContract.safeMint(to, uri);
      await tx.wait();
      console.log("NFT minted");
    } catch (error) {
      console.error("Error in safeMint:", error);
    }
  }

  async getOwner() {
    try {
      const owner = await this.contract.owner();
      console.log("Current Owner:", owner);
      return owner;
    } catch (error) {
      console.error("Error in getOwner:", error);
    }
  }

  async getURI(tokenId) {
    try {
      const uri = await this.contract.tokenURI(tokenId);
      console.log("URI:", uri);
      return uri;
    } catch (error) {
      console.error("Error in getURI:", error);
    }
  }
}

module.exports = ContractManager;
