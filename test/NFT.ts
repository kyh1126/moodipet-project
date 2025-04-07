import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

describe("NFT", function () {
  async function deployNFTFixture() {
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    // Deploy the NFT contract with the initialOwner as the deployer
    const nft = await hre.viem.deployContract("NFT", [owner.account.address]);

    const publicClient = await hre.viem.getPublicClient();

    return { nft, owner, otherAccount, publicClient };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { nft, owner } = await loadFixture(deployNFTFixture);

      expect(await nft.read.owner()).to.equal(getAddress(owner.account.address));
    });

    it("Should have the correct name and symbol", async function () {
      const { nft } = await loadFixture(deployNFTFixture);

      expect(await nft.read.name()).to.equal("DataToken");
      expect(await nft.read.symbol()).to.equal("DTT");
    });
  });

  describe("Minting", function () {
    it("Should mint an NFT and set the correct URI", async function () {
      const { nft, owner } = await loadFixture(deployNFTFixture);
      const recipient = getAddress(owner.account.address);
      const tokenURI = "ipfs://sample-uri";

      await nft.write.safeMint([recipient, tokenURI]);

      // Check if token 1 exists and has the correct URI
      expect(await nft.read.ownerOf([1n])).to.equal(recipient);
      expect(await nft.read.tokenURI([1n])).to.equal(tokenURI);
    });

    it("Should only allow the owner to mint", async function () {
      const { nft, otherAccount } = await loadFixture(deployNFTFixture);
      const recipient = getAddress(otherAccount.account.address);
      const tokenURI = "ipfs://unauthorized-uri";

      const nftAsOtherAccount = await hre.viem.getContractAt("NFT", nft.address, {
        client: { wallet: otherAccount },
      });

      await expect(nftAsOtherAccount.write.safeMint([recipient, tokenURI])).to.be.rejectedWith(
        "OwnableUnauthorizedAccount"
      );
    });
  });

  describe("Ownership Transfer", function () {
    it("Should allow the owner to transfer ownership", async function () {
      const { nft, owner, otherAccount } = await loadFixture(deployNFTFixture);

      await nft.write.transferOwnership([getAddress(otherAccount.account.address)]);

      expect(await nft.read.owner()).to.equal(getAddress(otherAccount.account.address));
    });

    it("Should prevent non-owners from transferring ownership", async function () {
      const { nft, otherAccount } = await loadFixture(deployNFTFixture);

      const nftAsOtherAccount = await hre.viem.getContractAt("NFT", nft.address, {
        client: { wallet: otherAccount },
      });

      await expect(
        nftAsOtherAccount.write.transferOwnership([getAddress(otherAccount.account.address)])
      ).to.be.rejectedWith("OwnableUnauthorizedAccount");
    });
  });
});
