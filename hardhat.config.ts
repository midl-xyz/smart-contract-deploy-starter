import "@midl/hardhat-deploy";
import { MaestroSymphonyProvider, MempoolSpaceProvider } from "@midl/core";
import "@nomicfoundation/hardhat-chai-matchers";
import { midl } from "@midl/executor";
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

const accounts = [
  process.env.MNEMONIC ||
    "test test test test test test test test test test test junk",
];

const config: HardhatUserConfig = {
  networks: {
    default: {
      url: "https://rpc.mainnet.midl.xyz",
      accounts: {
        mnemonic: accounts[0],
        path: walletsPaths.default,
      },
      chainId: midl.id,
    },
    regtest: {
      url: "https://rpc.regtest.midl.xyz",
      accounts: {
        mnemonic: accounts[0],
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
          explorerUrl: "https://mempool.space",
          id: "mainnet",
          network: "bitcoin",
        },
        provider: () =>
          new MempoolSpaceProvider({
            mainnet: "https://mempool.space",
          } as any),
        runesProvider: () =>
          new MaestroSymphonyProvider({
            mainnet: "https://runes.mainnet.midl.xyz",
          }),
      },
      regtest: {
        mnemonic: accounts[0],
        confirmationsRequired: 1,
        btcConfirmationsRequired: 1,
        hardhatNetwork: "regtest",
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
