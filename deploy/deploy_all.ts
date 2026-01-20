import { parseEther, parseUnits } from "ethers";
import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
  console.log("Starting deployment process...");

  await midl.initialize();

  // CollateralERC20

  console.log(
    "Deployer BTC address: ",
    midl.getConfig()?.getState()?.accounts?.[0].address,
  );

  await midl.deploy("CollateralERC20", {
    args: ["Test Token", "TT", 100_000_000_000],
  });

  await midl.execute();

  // RuneERC20

  const CollateralRuneERC20 = await midl.getDeployment("CollateralERC20");

  await midl.deploy("RuneERC20", { args: [CollateralRuneERC20?.address] });

  await midl.execute();

  // Mint

  const EVMAddress = midl.getEVMAddress();
  console.log("Performing Admin Based minting with wallet: ", EVMAddress);
  await midl.callContract("RuneERC20", "mint", {
    args: [parseEther("100000000"), EVMAddress],
  });

  await midl.execute();

  // MintUsingERC20AsCollateral

  const RuneERC20 = await midl.getDeployment("RuneERC20");
  console.log("Performing Collateral Based Minting");

  await midl.callContract("CollateralERC20", "approve", {
    args: [RuneERC20?.address, parseEther("100000000")],
  });
  await midl.callContract("RuneERC20", "mintUsingERC20AsCollateral", {
    args: [parseEther("100000000")],
  });

  await midl.execute();

  // MintUsingBitcoinAsCollateral

  await midl.callContract("RuneERC20", "mintUsingBitcoinAsCollateral", {
    args: [parseUnits("5", 16)],
    value: parseUnits("5", 16),
  });

  await midl.execute();

  // RequestRedemption

  await midl.callContract("RuneERC20", "requestRedemption", {
    args: [parseUnits("2", 17)],
  });

  await midl.execute();
};

deploy.tags = ["main", "unified"];

export default deploy;
