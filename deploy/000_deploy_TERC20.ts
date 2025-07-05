import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
    console.log("Starting deployment process...");

    await midl.initialize();

    await midl.deploy("TERC20", {});

    await midl.execute();
};

deploy.tags = ["main", "TERC20"];

export default deploy;