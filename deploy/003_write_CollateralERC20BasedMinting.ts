import { parseEther } from "ethers";
import { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
	await midl.initialize();

	const RuneERC20 = await midl.getDeployment("RuneERC20");
	console.log("Performing Collateral Based Minting");

	await midl.callContract("CollateralERC20", "approve", {
		args: [RuneERC20?.address, parseEther("100000000")],
	});
	await midl.callContract("RuneERC20", "mintUsingERC20AsCollateral", {
		args: [parseEther("100000000")],
	});

	await midl.execute();
};
deploy.tags = ["main", "mintUsingERC20AsCollateral"];
deploy.dependencies = ["RuneERC20", "CollateralERC20"];

export default deploy;
