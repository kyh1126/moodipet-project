import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

describe("MoodiPetNFT (무디펫 NFT)", function () {
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
    it("올바른 속성으로 MoodiPet 슬라임을 민팅할 수 있다", async function () {
      const { moodiPetNFT, owner } = await loadFixture(deployMoodiPetFixture);
      const recipient = getAddress(owner.account.address);
      const tokenURI = "ipfs://sample-uri";
      const emotion = "우울";
      const color = "파란색";
      const evolution = 1n;
      const personality = "조용한";

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

    it("오너만 민팅할 수 있다", async function () {
      const { moodiPetNFT, otherAccount } = await loadFixture(deployMoodiPetFixture);
      const recipient = getAddress(otherAccount.account.address);
      const tokenURI = "ipfs://unauthorized-uri";
      const emotion = "기쁨";
      const color = "노란색";
      const evolution = 1n;
      const personality = "활발한";

      const moodiPetNFTAsOtherAccount = await hre.viem.getContractAt("MoodiPetNFT", moodiPetNFT.address, {
        client: { wallet: otherAccount },
      });

      await expect(
        moodiPetNFTAsOtherAccount.write.mintMoodiPet([recipient, tokenURI, emotion, color, evolution, personality])
      ).to.be.rejectedWith("OwnableUnauthorizedAccount");
    });

    it("진화 레벨을 검증한다", async function () {
      const { moodiPetNFT, owner } = await loadFixture(deployMoodiPetFixture);
      const recipient = getAddress(owner.account.address);
      const tokenURI = "ipfs://sample-uri";
      const emotion = "화남";
      const color = "빨간색";
      const invalidEvolution = 6n; // Invalid evolution level
      const personality = "화난";

      await expect(
        moodiPetNFT.write.mintMoodiPet([recipient, tokenURI, emotion, color, invalidEvolution, personality])
      ).to.be.rejectedWith("Evolution level must be between 1 and 5");
    });
  });

  describe("Pet Attributes", function () {
    it("올바른 슬라임 속성을 반환한다", async function () {
      const { moodiPetNFT, owner } = await loadFixture(deployMoodiPetFixture);
      const recipient = getAddress(owner.account.address);
      const tokenURI = "ipfs://sample-uri";
      const emotion = "평온";
      const color = "초록색";
      const evolution = 3n;
      const personality = "평온한";

      await moodiPetNFT.write.mintMoodiPet([recipient, tokenURI, emotion, color, evolution, personality]);

      const attributes = await moodiPetNFT.read.getPetAttributes([1n]);
      expect(attributes.emotion).to.equal(emotion);
      expect(attributes.color).to.equal(color);
      expect(BigInt(attributes.evolution)).to.equal(evolution);
      expect(attributes.personality).to.equal(personality);
      expect(Number(attributes.createdAt)).to.be.greaterThan(0);
    });

    it("존재하지 않는 토큰에 대해 오류를 반환한다", async function () {
      const { moodiPetNFT } = await loadFixture(deployMoodiPetFixture);

      await expect(moodiPetNFT.read.getPetAttributes([999n])).to.be.rejected;
    });
  });

  describe("User Pets", function () {
    it("사용자 슬라임 목록을 반환한다", async function () {
      const { moodiPetNFT, owner } = await loadFixture(deployMoodiPetFixture);
      const recipient = getAddress(owner.account.address);
      const tokenURI = "ipfs://sample-uri";
      const emotion = "사랑";
      const color = "분홍색";
      const evolution = 2n;
      const personality = "사랑스러운";

      await moodiPetNFT.write.mintMoodiPet([recipient, tokenURI, emotion, color, evolution, personality]);

      const userPets = await moodiPetNFT.read.getUserPets([recipient]);
      expect(BigInt(userPets.length)).to.equal(1n);
      expect(userPets[0]).to.equal(1n);
    });
  });

  describe("Pet Evolution", function () {
    it("오너가 슬라임을 진화시킬 수 있다", async function () {
      const { moodiPetNFT, owner } = await loadFixture(deployMoodiPetFixture);
      const recipient = getAddress(owner.account.address);
      const tokenURI = "ipfs://sample-uri";
      const emotion = "신남";
      const color = "보라색";
      const evolution = 1n;
      const personality = "에너지 넘치는";

      await moodiPetNFT.write.mintMoodiPet([recipient, tokenURI, emotion, color, evolution, personality]);

      // Evolve pet to level 3
      await moodiPetNFT.write.evolvePet([1n, 3n]);

      const attributes = await moodiPetNFT.read.getPetAttributes([1n]);
      expect(BigInt(attributes.evolution)).to.equal(3n);
    });

    it("잘못된 진화는 방지한다", async function () {
      const { moodiPetNFT, owner } = await loadFixture(deployMoodiPetFixture);
      const recipient = getAddress(owner.account.address);
      const tokenURI = "ipfs://sample-uri";
      const emotion = "슬픔";
      const color = "회색";
      const evolution = 2n;
      const personality = "무기력한";

      await moodiPetNFT.write.mintMoodiPet([recipient, tokenURI, emotion, color, evolution, personality]);

      // Try to evolve to lower level (should fail)
      await expect(moodiPetNFT.write.evolvePet([1n, 1n])).to.be.rejectedWith("Invalid evolution level");
    });
  });

  describe("Ownership Transfer", function () {
    it("오너가 소유권을 이전할 수 있다", async function () {
      const { moodiPetNFT, owner, otherAccount } = await loadFixture(deployMoodiPetFixture);

      await moodiPetNFT.write.transferOwnership([getAddress(otherAccount.account.address)]);

      expect(await moodiPetNFT.read.owner()).to.equal(getAddress(otherAccount.account.address));
    });

    it("오너가 아닌 사용자는 소유권을 이전할 수 없다", async function () {
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
