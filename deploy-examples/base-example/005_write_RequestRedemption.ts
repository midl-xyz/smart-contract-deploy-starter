import { parseUnits } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
  await midl.initialize();

  await midl.callContract("RuneERC20", "requestRedemption", {
    args: [parseUnits("2", 17)]
  });


  await midl.execute();
};
deploy.tags = ["main", "requestRedemption"];
deploy.dependencies = ["RuneERC20", "CollateralERC20"];

export default deploy;
