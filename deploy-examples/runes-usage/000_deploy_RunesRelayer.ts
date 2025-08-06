import type { DeployFunction } from "hardhat-deploy/types";
import { erc20 } from "@/typechain-types/factories/@openzeppelin/contracts/token";

const deploy: DeployFunction = async ({ midl }) => {
	console.log("Starting deployment process...");

	await midl.initialize();
	console.log("Deployer BTC address: ", midl.getAccount().address);

	// Prerequisites: have a Rune that's added to the midl
	const runeId = "37535:8";
	const runeAddress = "0xb73D9EaB03bCEEE575544353407cc03a606c31bB";

	await midl.save("TERC20", {
		address: runeAddress,
		abi: [...erc20.ERC20__factory.abi],
	});
	await midl.deploy("RunesRelayer", { args: [runeAddress] });

	await midl.execute();
};

deploy.tags = ["main", "TERC20"];

export default deploy;
