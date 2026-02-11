import { parseEther } from "ethers";
import type { DeployFunction } from "hardhat-deploy/types";
import { erc20 } from "@/typechain-types/factories/@openzeppelin/contracts/token";

const deploy: DeployFunction = async ({ midl }) => {
  console.log("Starting deployment process...");

  await midl.initialize();
  console.log("Deployer BTC address: ", midl.account.address);

  // Prerequisites: have a Rune that's added to the midl
  const runeAddress = "0xb73D9EaB03bCEEE575544353407cc03a606c31bB";

  await midl.save("TERC20", {
    address: runeAddress,
    abi: [...erc20.ERC20__factory.abi],
  });

  await midl.deploy("RunesRelayer", [runeAddress]);

  await midl.execute();

  // Prerequisites: have a Rune that's added to the midl
  const runeId = "37535:8";
  const amount = parseEther("1");

  const Relayer = await midl.get("RunesRelayer");

  await midl.write("TERC20", "approve", [Relayer?.address, amount], {
    to: runeAddress,
  });

  await midl.write("RunesRelayer", "depositRune", [amount], undefined, {
    deposit: {
      runes: [{ id: runeId, amount: amount, address: runeAddress }],
    },
  });
  console.log("tuneAddress type", runeAddress);

  await midl.write("RunesRelayer", "withdrawRune", [amount], undefined, {
    deposit: {
      runes: [{ id: runeId, amount: amount, address: runeAddress }],
    },
  });

  await midl.execute({
    withdraw: { runes: [{ id: runeId, amount: amount, address: runeAddress }] },
  });
};

deploy.tags = ["main", "Runes"];

export default deploy;
