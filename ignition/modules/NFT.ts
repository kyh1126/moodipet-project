import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("NFTModule", (m) => {
  const nftContract = m.contract("NFT", ["0xef70277abf02aea645f04a0689b2ec9e67cea670"]);

  return { nftContract };
});
