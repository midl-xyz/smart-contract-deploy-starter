import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
    console.log("Starting deployment process...");

    await midl.initialize();
    console.log("Deployer BTC address: ",  midl.getConfig()?.getState()?.accounts?.[0].address);
    await midl.deploy("CollateralERC20", { args: ["Test Token", "TT", 100_000_000_000] });

    await midl.execute();
};

deploy.tags = ["main", "TERC20"]; 

export default deploy;