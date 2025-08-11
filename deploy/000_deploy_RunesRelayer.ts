import type { DeployFunction } from "hardhat-deploy/types";
import { erc20 } from "@/typechain-types/factories/@openzeppelin/contracts/token";
import { MaxUint256, parseEther } from "ethers";

const deploy: DeployFunction = async ({ midl }) => {
	console.log("Starting distribute Tokens...");

	// Initialize Midl
	await midl.initialize();
	const EVMAddress = midl.getEVMAddress();
	console.log("Performing Admin Based minting with wallet: ", EVMAddress);

	// const poolConfig = PoolConfig;
	// const reservesConfig = poolConfig.ReservesConfig;
	// const reserveSymbols = Object.keys(reservesConfig);

	// if (reserveSymbols.length === 0 || !IsDeployNewContract) {
	// 	console.warn(
	// 		"[TokenDistribution] PASS! # Token Symbol in Config is zero or Token is not deployed on Testnet",
	// 		IsDeployNewContract,
	// 		reserveSymbols,
	// 	);
	// 	return;
	// }

	const RuneID = {
		// USDC: {
		// 	runeId: "37535:8",
		// 	address: "0xb73D9EaB03bCEEE575544353407cc03a606c31bB",
		// },
		USDT: {
			runeId: "11893:1",
			address: "0x3eDb3dFD4C8b1bb46304F25e933816A7fDAB6FF6",
		},
	};

	await midl.save("USDT", {
		abi: erc20.ERC20__factory.abi as any,
		address: RuneID.USDT.address as any,
	});
	// await midl.save("USDC", {
	// 	abi: erc20.ERC20__factory.abi as any,
	// 	address: RuneID.USDC.address as any,
	// });

	// for (const symbol of ["USDT", "USDC"] as const) {
	const runeId = RuneID["USDT"].runeId;
	const runeAddress = RuneID["USDT"].address;
	const amount = 228n;
	console.log("USDT", runeId, runeAddress);

	await midl.deploy(`USDTRunesRelayer`, { args: [runeAddress] });
	await midl.execute(); // Run callContract

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
		options: {
			withdraw: {
				runes: [{ id: runeId, amount: amount, address: runeAddress as any }],
			},
		},
	});

	return true;
};

deploy.tags = ["main", "TERC20"];

export default deploy;
