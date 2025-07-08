import { parseUnits } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
  await midl.initialize();

  await midl.callContract("RuneERC20", "mintUsingBitcoinAsCollateral", {
    args: [parseUnits("5", 16)],
    value: parseUnits("5", 16)
  });


  await midl.execute();
};
deploy.tags = ["main", "mintUsingBitcoinAsCollateral"];
deploy.dependencies = ["RuneERC20", "CollateralERC20"];

export default deploy;
