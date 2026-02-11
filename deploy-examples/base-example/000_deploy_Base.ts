import { parseEther, parseUnits } from "ethers";
import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
  console.log("Starting deployment process...");

  await midl.initialize();

  // CollateralERC20

  console.log(midl.account.address);

  await midl.deploy("CollateralERC20", ["Test Token", "TT", 100_000_000_000]);

  await midl.execute();

  // RuneERC20

  const CollateralRuneERC20 = await midl.get("CollateralERC20");

  await midl.deploy("RuneERC20", [CollateralRuneERC20?.address]);

  await midl.execute();

  // Mint

  const EVMAddress = midl.evm.address;
  console.log("Performing Admin Based minting with wallet: ", EVMAddress);
  await midl.write("RuneERC20", "mint", [parseEther("100000000"), EVMAddress]);

  await midl.execute();

  // MintUsingERC20AsCollateral

  const RuneERC20 = await midl.get("RuneERC20");
  console.log("Performing Collateral Based Minting");

  await midl.write("CollateralERC20", "approve", [
    RuneERC20?.address,
    parseEther("100000000"),
  ]);
  await midl.write("RuneERC20", "mintUsingERC20AsCollateral", [
    parseEther("100000000"),
  ]);

  await midl.execute();

  // MintUsingBitcoinAsCollateral

  await midl.write(
    "RuneERC20",
    "mintUsingBitcoinAsCollateral",
    [parseUnits("5", 16)],
    { value: parseUnits("5", 16) },
  );

  await midl.execute();

  // RequestRedemption

  await midl.write("RuneERC20", "requestRedemption", [parseUnits("2", 17)]);

  await midl.execute();
};

deploy.tags = ["main", "unified"];

export default deploy;
