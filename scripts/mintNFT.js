const ContractManager = require("./ContractManager");

require("dotenv").config();

const main = async () => {
  const CA = "0xaF30C3c1485232d5876707cEf7bB930F0e7a89d2";

  const manager = new ContractManager(CA);
  await manager.getOwner();
  await manager.safeMint(
    "0xEF70277aBF02aEa645F04A0689B2eC9e67CEa670",
    "https://gateway.pinata.cloud/ipfs/QmZ1YzZ3o6Qv9b5J6jyjv5zXJ6tX7k8vqgU1WbQx4m8KZm"
  );
};

main();
