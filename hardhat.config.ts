import "@midl/hardhat-deploy";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "dotenv";
import { config as dotenvConfig } from "dotenv";
import "hardhat-deploy";
import type { HardhatUserConfig } from "hardhat/config";
import { resolve } from "path";
import "solidity-coverage";
import "tsconfig-paths/register";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const walletsPaths = {
	default: "m/86'/1'/0'/0/0",
};

const accounts = [process.env.MNEMONIC as string];

const config: HardhatUserConfig = {
	networks: {
		default: {
			url: "https://rpc.regtest.midl.xyz",
			accounts: {
				mnemonic: process.env.MNEMONIC,
				path: walletsPaths.default,
			},
			chainId: 777,
		},
	},
	midl: {
		path: "deployments",
		networks: {
			default: {
				mnemonic: accounts[0],
				confirmationsRequired: 1,
				btcConfirmationsRequired: 1,
				hardhatNetwork: "default",
				network: {
					explorerUrl: "https://mempool.regtest.midl.xyz",
					id: "regtest",
					network: "regtest",
				},
			},
		},
	},
	solidity: {
		compilers: [
			{
				version: "0.8.24",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		],
	},
};

export default config;
