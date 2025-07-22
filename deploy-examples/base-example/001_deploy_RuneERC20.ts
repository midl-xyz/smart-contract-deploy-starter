import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
    console.log("Starting deployment process...");

    await midl.initialize();
    const RuneERC20 = await midl.getDeployment("CollateralERC20");

    console.log(midl.getConfig()?.getState().accounts);
    await midl.deploy("RuneERC20", { args: [RuneERC20?.address] });

    await midl.execute();
};

deploy.tags = ["main", "RuneERC20"]; 

export default deploy;