import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

describe("HealingToken (Healing Token)", function () {
  async function deployHealingTokenFixture() {
    const [owner, user] = await hre.viem.getWalletClients();
    const healingToken = await hre.viem.deployContract("HealingToken", [owner.account.address]);
    return { healingToken, owner, user };
  }

  describe("Deployment", function () {
    it("Sets correct owner", async function () {
      const { healingToken, owner } = await loadFixture(deployHealingTokenFixture);
      expect(await healingToken.read.owner()).to.equal(getAddress(owner.account.address));
    });
    it("Has correct name and symbol", async function () {
      const { healingToken } = await loadFixture(deployHealingTokenFixture);
      expect(await healingToken.read.name()).to.equal("Healing Token");
      expect(await healingToken.read.symbol()).to.equal("HEAL");
    });
  });

  describe("Mood Recording", function () {
    it("Gives reward when recording emotion", async function () {
      const { healingToken, owner, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      const emotion = "sad";
      await healingToken.write.recordMood([userAddress, emotion]);
      const record = await healingToken.read.getUserMoodRecord([userAddress]);
      expect(record.consecutiveDays).to.equal(1n);
      expect(record.totalRecords).to.equal(1n);
      const balance = await healingToken.read.balanceOf([userAddress]);
      expect(balance).to.equal(1n);
    });
    it("Only owner can record emotion", async function () {
      const { healingToken, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      const emotion = "happy";
      const healingTokenAsUser = await hre.viem.getContractAt("HealingToken", healingToken.address, {
        client: { wallet: user },
      });
      await expect(healingTokenAsUser.write.recordMood([userAddress, emotion])).to.be.rejectedWith(
        "OwnableUnauthorizedAccount"
      );
    });
    it("Correctly tracks consecutive recording days", async function () {
      const { healingToken, owner, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      for (let i = 0; i < 7; i++) {
        await healingToken.write.recordMood([userAddress, `emotion${i}`]);
        await hre.network.provider.send("evm_increaseTime", [86400]);
        await hre.network.provider.send("evm_mine");
      }
      const record = await healingToken.read.getUserMoodRecord([userAddress]);
      expect(record.consecutiveDays).to.equal(7n);
      expect(record.totalRecords).to.equal(7n);
      const balance = await healingToken.read.balanceOf([userAddress]);
      expect(Number(balance)).to.be.greaterThan(7);
    });
  });

  describe("Token Rewards", function () {
    it("Gives bonus tokens for 7 consecutive days", async function () {
      const { healingToken, owner, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      for (let i = 0; i < 7; i++) {
        await healingToken.write.recordMood([userAddress, `emotion${i}`]);
        await hre.network.provider.send("evm_increaseTime", [86400]);
        await hre.network.provider.send("evm_mine");
      }
      const balance = await healingToken.read.balanceOf([userAddress]);
      expect(balance).to.equal(16n); // 6 + 10 bonus
    });
    it("Checks if 7 consecutive days are completed", async function () {
      const { healingToken, owner, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      let completed = await healingToken.read.hasCompletedWeek([userAddress]);
      expect(completed).to.be.false;
      for (let i = 0; i < 7; i++) {
        await healingToken.write.recordMood([userAddress, `emotion${i}`]);
        await hre.network.provider.send("evm_increaseTime", [86400]);
        await hre.network.provider.send("evm_mine");
      }
      completed = await healingToken.read.hasCompletedWeek([userAddress]);
      expect(completed).to.be.true;
    });
  });

  describe("User Information", function () {
    it("Returns consecutive recording days", async function () {
      const { healingToken, owner, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      for (let i = 0; i < 3; i++) {
        await healingToken.write.recordMood([userAddress, `emotion${i}`]);
        await hre.network.provider.send("evm_increaseTime", [86400]);
        await hre.network.provider.send("evm_mine");
      }
      const consecutiveDays = await healingToken.read.getConsecutiveDays([userAddress]);
      expect(consecutiveDays).to.equal(3n);
    });
    it("Returns total record count", async function () {
      const { healingToken, owner, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      for (let i = 0; i < 5; i++) {
        await healingToken.write.recordMood([userAddress, `emotion${i}`]);
        await hre.network.provider.send("evm_increaseTime", [86400]);
        await hre.network.provider.send("evm_mine");
      }
      const totalRecords = await healingToken.read.getTotalRecords([userAddress]);
      expect(totalRecords).to.equal(5n);
    });
  });

  describe("Owner Functions", function () {
    it("Owner can mint tokens", async function () {
      const { healingToken, owner, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      const amount = 100n;
      await healingToken.write.mint([userAddress, amount]);
      const balance = await healingToken.read.balanceOf([userAddress]);
      expect(balance).to.equal(amount);
    });
    it("Non-owner cannot mint tokens", async function () {
      const { healingToken, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      const amount = 100n;
      const healingTokenAsUser = await hre.viem.getContractAt("HealingToken", healingToken.address, {
        client: { wallet: user },
      });
      await expect(healingTokenAsUser.write.mint([userAddress, amount])).to.be.rejectedWith(
        "OwnableUnauthorizedAccount"
      );
    });
  });
}); 