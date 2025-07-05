import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress } from "viem";

describe("HealingToken (힐링 토큰)", function () {
  async function deployHealingTokenFixture() {
    const [owner, user] = await hre.viem.getWalletClients();
    const healingToken = await hre.viem.deployContract("HealingToken", [owner.account.address]);
    return { healingToken, owner, user };
  }

  describe("Deployment", function () {
    it("올바른 오너를 설정한다", async function () {
      const { healingToken, owner } = await loadFixture(deployHealingTokenFixture);
      expect(await healingToken.read.owner()).to.equal(getAddress(owner.account.address));
    });
    it("이름과 심볼이 올바르다", async function () {
      const { healingToken } = await loadFixture(deployHealingTokenFixture);
      expect(await healingToken.read.name()).to.equal("Healing Token");
      expect(await healingToken.read.symbol()).to.equal("HEAL");
    });
  });

  describe("Mood Recording", function () {
    it("감정 기록 시 보상을 지급한다", async function () {
      const { healingToken, owner, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      const emotion = "우울";
      await healingToken.write.recordMood([userAddress, emotion]);
      const record = await healingToken.read.getUserMoodRecord([userAddress]);
      expect(record.consecutiveDays).to.equal(1n);
      expect(record.totalRecords).to.equal(1n);
      const balance = await healingToken.read.balanceOf([userAddress]);
      expect(balance).to.equal(1n);
    });
    it("오너만 감정 기록이 가능하다", async function () {
      const { healingToken, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      const emotion = "기쁨";
      const healingTokenAsUser = await hre.viem.getContractAt("HealingToken", healingToken.address, {
        client: { wallet: user },
      });
      await expect(healingTokenAsUser.write.recordMood([userAddress, emotion])).to.be.rejectedWith(
        "OwnableUnauthorizedAccount"
      );
    });
    it("연속 기록 일수를 올바르게 추적한다", async function () {
      const { healingToken, owner, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      for (let i = 0; i < 7; i++) {
        await healingToken.write.recordMood([userAddress, `감정${i}`]);
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
    it("7일 연속 기록 시 보너스 토큰을 지급한다", async function () {
      const { healingToken, owner, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      for (let i = 0; i < 7; i++) {
        await healingToken.write.recordMood([userAddress, `감정${i}`]);
        await hre.network.provider.send("evm_increaseTime", [86400]);
        await hre.network.provider.send("evm_mine");
      }
      const balance = await healingToken.read.balanceOf([userAddress]);
      expect(balance).to.equal(16n); // 6 + 10 bonus
    });
    it("7일 연속 기록 달성 여부를 확인한다", async function () {
      const { healingToken, owner, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      let completed = await healingToken.read.hasCompletedWeek([userAddress]);
      expect(completed).to.be.false;
      for (let i = 0; i < 7; i++) {
        await healingToken.write.recordMood([userAddress, `감정${i}`]);
        await hre.network.provider.send("evm_increaseTime", [86400]);
        await hre.network.provider.send("evm_mine");
      }
      completed = await healingToken.read.hasCompletedWeek([userAddress]);
      expect(completed).to.be.true;
    });
  });

  describe("User Information", function () {
    it("연속 기록 일수를 반환한다", async function () {
      const { healingToken, owner, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      for (let i = 0; i < 3; i++) {
        await healingToken.write.recordMood([userAddress, `감정${i}`]);
        await hre.network.provider.send("evm_increaseTime", [86400]);
        await hre.network.provider.send("evm_mine");
      }
      const consecutiveDays = await healingToken.read.getConsecutiveDays([userAddress]);
      expect(consecutiveDays).to.equal(3n);
    });
    it("총 기록 수를 반환한다", async function () {
      const { healingToken, owner, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      for (let i = 0; i < 5; i++) {
        await healingToken.write.recordMood([userAddress, `감정${i}`]);
        await hre.network.provider.send("evm_increaseTime", [86400]);
        await hre.network.provider.send("evm_mine");
      }
      const totalRecords = await healingToken.read.getTotalRecords([userAddress]);
      expect(totalRecords).to.equal(5n);
    });
  });

  describe("Owner Functions", function () {
    it("오너가 토큰을 민팅할 수 있다", async function () {
      const { healingToken, owner, user } = await loadFixture(deployHealingTokenFixture);
      const userAddress = getAddress(user.account.address);
      const amount = 100n;
      await healingToken.write.mint([userAddress, amount]);
      const balance = await healingToken.read.balanceOf([userAddress]);
      expect(balance).to.equal(amount);
    });
    it("오너가 아닌 사용자는 토큰을 민팅할 수 없다", async function () {
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