const ContractManager = require("./ContractManager");

const main = async () => {
  const CA = "0xaF30C3c1485232d5876707cEf7bB930F0e7a89d2";

  const manager = new ContractManager(CA);
  await manager.transferOwnership("0x56D110cD9D2b7c961516bCDf92b164107c044757");
};

main();
