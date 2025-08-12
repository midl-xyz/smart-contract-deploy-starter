import { erc20 } from "@/typechain-types/factories/@openzeppelin/contracts/token";
import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
	console.log("Starting distribute Tokens...");
	await midl.initialize();
	const EVMAddress = midl.getEVMAddress();
	console.log("Performing Admin Based minting with wallet: ", EVMAddress);

	const RuneID = {
		USDT: {
			runeId: "11893:1",
			address: "0x3eDb3dFD4C8b1bb46304F25e933816A7fDAB6FF6",
		},
	};

	await midl.save("USDT", {
		abi: erc20.ERC20__factory.abi as any,
		address: RuneID.USDT.address as any,
	});

	const runeId = RuneID["USDT"].runeId;
	const runeAddress = RuneID["USDT"].address;
	const amount = 228n;

	await midl.deploy(`USDTRunesRelayer`, { args: [runeAddress] });

	const Relayer = await midl.getDeployment(`USDTRunesRelayer`);
	console.log("Deployed Relayer Address: ", Relayer?.address);

	await midl.callContract(`USDT`, "approve", {
		args: [Relayer?.address, amount],
	});

	await midl.callContract(
		`USDTRunesRelayer`,
		"depositRune",
		{ args: [amount] },
		{
			deposit: {
				runes: [{ id: runeId, amount: amount, address: runeAddress as any }],
			},
		},
	);

	await midl.callContract(`USDTRunesRelayer`, "withdrawRune", {
		args: [amount],
	});
	await midl.execute({
		withdraw: {
			runes: [{ id: runeId, amount: amount, address: runeAddress as any }],
		},
	});

	return true;
};

deploy.tags = ["main", "TERC20"];

export default deploy;
