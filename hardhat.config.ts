import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",

  networks: {
    baseSepoliaTestnet: {
      url: "https://sepolia.base.org",
      accounts: process.env.TESTNET_PRIVATE_KEY ? [process.env.TESTNET_PRIVATE_KEY] : [],
      chainId: 84532,
    },
  },
};

export default config;
