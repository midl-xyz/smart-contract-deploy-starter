import { parseEther } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
  await midl.initialize();

  const EVMAddress = midl.getEVMAddress();
  console.log("Performing Admin Based minting with wallet: ", EVMAddress);
  await midl.callContract("RuneERC20", "mint", {
    args: [parseEther("100000000"), EVMAddress],
  });

  await midl.execute();
};
deploy.tags = ["main", "updateLQTYTokenContracts"];
deploy.dependencies = [
  "StabilityPool",
  "LQTYToken",
  "CommunityIssuance",
  "FeesRouter",
];

export default deploy;
