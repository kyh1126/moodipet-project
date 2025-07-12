import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

describe("MoodiPetNFT (MoodiPet NFT)", function () {
  async function deployMoodiPetFixture() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    // Deploy the MoodiPetNFT contract with the initialOwner as the deployer
    const moodiPetNFT = await hre.viem.deployContract("MoodiPetNFT", [owner.account.address]);

    const publicClient = await hre.viem.getPublicClient();

    return { moodiPetNFT, owner, otherAccount, publicClient };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { moodiPetNFT, owner } = await loadFixture(deployMoodiPetFixture);

      expect(await moodiPetNFT.read.owner()).to.equal(getAddress(owner.account.address));
    });

    it("Should have the correct name and symbol", async function () {
      const { moodiPetNFT } = await loadFixture(deployMoodiPetFixture);

      expect(await moodiPetNFT.read.name()).to.equal("MoodiPet");
      expect(await moodiPetNFT.read.symbol()).to.equal("MDP");
    });
  });

  describe("Minting MoodiPet", function () {
    it("Can mint MoodiPet slime with correct attributes", async function () {
      const { moodiPetNFT, owner } = await loadFixture(deployMoodiPetFixture);
      const recipient = getAddress(owner.account.address);
      const tokenURI = "ipfs://sample-uri";
      const emotion = "sad";
      const color = "blue";
      const evolution = 1n;
      const personality = "quiet";

      await moodiPetNFT.write.mintMoodiPet([recipient, tokenURI, emotion, color, evolution, personality]);

      // Check if token 1 exists and has the correct URI
      expect(await moodiPetNFT.read.ownerOf([1n])).to.equal(recipient);
      expect(await moodiPetNFT.read.tokenURI([1n])).to.equal(tokenURI);

      // Check pet attributes
      const attributes = await moodiPetNFT.read.getPetAttributes([1n]);
      expect(attributes.emotion).to.equal(emotion);
      expect(attributes.color).to.equal(color);
      expect(BigInt(attributes.evolution)).to.equal(evolution);
      expect(attributes.personality).to.equal(personality);
    });

    it("Only owner can mint", async function () {
      const { moodiPetNFT, otherAccount } = await loadFixture(deployMoodiPetFixture);
      const recipient = getAddress(otherAccount.account.address);
      const tokenURI = "ipfs://unauthorized-uri";
      const emotion = "happy";
      const color = "yellow";
      const evolution = 1n;
      const personality = "energetic";

      const moodiPetNFTAsOtherAccount = await hre.viem.getContractAt("MoodiPetNFT", moodiPetNFT.address, {
        client: { wallet: otherAccount },
      });

      await expect(
        moodiPetNFTAsOtherAccount.write.mintMoodiPet([recipient, tokenURI, emotion, color, evolution, personality])
      ).to.be.rejectedWith("OwnableUnauthorizedAccount");
    });

    it("Validates evolution level", async function () {
      const { moodiPetNFT, owner } = await loadFixture(deployMoodiPetFixture);
      const recipient = getAddress(owner.account.address);
      const tokenURI = "ipfs://sample-uri";
      const emotion = "angry";
      const color = "red";
      const invalidEvolution = 6n; // Invalid evolution level
      const personality = "angry";

      await expect(
        moodiPetNFT.write.mintMoodiPet([recipient, tokenURI, emotion, color, invalidEvolution, personality])
      ).to.be.rejectedWith("Evolution level must be between 1 and 5");
    });
  });

  describe("Pet Attributes", function () {
    it("Returns correct slime attributes", async function () {
      const { moodiPetNFT, owner } = await loadFixture(deployMoodiPetFixture);
      const recipient = getAddress(owner.account.address);
      const tokenURI = "ipfs://sample-uri";
      const emotion = "calm";
      const color = "green";
      const evolution = 3n;
      const personality = "calm";

      await moodiPetNFT.write.mintMoodiPet([recipient, tokenURI, emotion, color, evolution, personality]);

      const attributes = await moodiPetNFT.read.getPetAttributes([1n]);
      expect(attributes.emotion).to.equal(emotion);
      expect(attributes.color).to.equal(color);
      expect(BigInt(attributes.evolution)).to.equal(evolution);
      expect(attributes.personality).to.equal(personality);
      expect(Number(attributes.createdAt)).to.be.greaterThan(0);
    });

    it("Returns error for non-existent token", async function () {
      const { moodiPetNFT } = await loadFixture(deployMoodiPetFixture);

      await expect(moodiPetNFT.read.getPetAttributes([999n])).to.be.rejected;
    });
  });

  describe("User Pets", function () {
    it("Returns user slime list", async function () {
      const { moodiPetNFT, owner } = await loadFixture(deployMoodiPetFixture);
      const recipient = getAddress(owner.account.address);
      const tokenURI = "ipfs://sample-uri";
      const emotion = "love";
      const color = "pink";
      const evolution = 2n;
      const personality = "lovely";

      await moodiPetNFT.write.mintMoodiPet([recipient, tokenURI, emotion, color, evolution, personality]);

      const userPets = await moodiPetNFT.read.getUserPets([recipient]);
      expect(BigInt(userPets.length)).to.equal(1n);
      expect(userPets[0]).to.equal(1n);
    });
  });

  describe("Pet Evolution", function () {
    it("Owner can evolve slime", async function () {
      const { moodiPetNFT, owner } = await loadFixture(deployMoodiPetFixture);
      const recipient = getAddress(owner.account.address);
      const tokenURI = "ipfs://sample-uri";
      const emotion = "excited";
      const color = "purple";
      const evolution = 1n;
      const personality = "energetic";

      await moodiPetNFT.write.mintMoodiPet([recipient, tokenURI, emotion, color, evolution, personality]);

      // Evolve pet to level 3
      await moodiPetNFT.write.evolvePet([1n, 3n]);

      const attributes = await moodiPetNFT.read.getPetAttributes([1n]);
      expect(BigInt(attributes.evolution)).to.equal(3n);
    });

    it("Prevents invalid evolution", async function () {
      const { moodiPetNFT, owner } = await loadFixture(deployMoodiPetFixture);
      const recipient = getAddress(owner.account.address);
      const tokenURI = "ipfs://sample-uri";
      const emotion = "sad";
      const color = "gray";
      const evolution = 2n;
      const personality = "lethargic";

      await moodiPetNFT.write.mintMoodiPet([recipient, tokenURI, emotion, color, evolution, personality]);

      // Try to evolve to lower level (should fail)
      await expect(moodiPetNFT.write.evolvePet([1n, 1n])).to.be.rejectedWith("Invalid evolution level");
    });
  });

  describe("Ownership Transfer", function () {
    it("Owner can transfer ownership", async function () {
      const { moodiPetNFT, owner, otherAccount } = await loadFixture(deployMoodiPetFixture);

      await moodiPetNFT.write.transferOwnership([getAddress(otherAccount.account.address)]);

      expect(await moodiPetNFT.read.owner()).to.equal(getAddress(otherAccount.account.address));
    });

    it("Non-owner cannot transfer ownership", async function () {
      const { moodiPetNFT, otherAccount } = await loadFixture(deployMoodiPetFixture);

      const moodiPetNFTAsOtherAccount = await hre.viem.getContractAt("MoodiPetNFT", moodiPetNFT.address, {
        client: { wallet: otherAccount },
      });

      await expect(
        moodiPetNFTAsOtherAccount.write.transferOwnership([getAddress(otherAccount.account.address)])
      ).to.be.rejectedWith("OwnableUnauthorizedAccount");
    });
  });
});
