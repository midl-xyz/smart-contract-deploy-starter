import { parseEther } from "ethers";
import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
	console.log("Starting deployment process...");

	await midl.initialize();
	console.log("Deployer BTC address: ", midl.getAccount().address);

	// Prerequisites: have a Rune that's added to the midl
	const runeId = "37535:8";
	const runeAddress = "0xb73D9EaB03bCEEE575544353407cc03a606c31bB";
	const amount = parseEther("1");

	await midl.deploy("RunesRelayer", { args: [runeAddress] });

	const Relayer = await midl.getDeployment("RunesRelayer");

	await midl.callContract("TERC20", "approve", {
		args: [Relayer?.address, amount],
		//to: runeAddress,
	});

	await midl.callContract(
		"RunesRelayer",
		"depositRune",
		{ args: [amount] },
		{
			hasRunesDeposit: true,
			runes: [{ id: runeId, value: amount, address: runeAddress }],
		},
	);

	await midl.callContract(
		"RunesRelayer",
		"withdrawRune",
		{ args: [amount] },
		{
			hasRunesWithdraw: true,
			runes: [{ id: runeId, value: amount, address: runeAddress }],
		},
	);

	await midl.execute({ assetsToWithdraw: [runeAddress], shouldComplete: true });
};

deploy.tags = ["main", "TERC20"];

export default deploy;
