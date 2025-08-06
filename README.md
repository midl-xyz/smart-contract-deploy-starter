# Smart contract deployment starter for Midl

This repository shows the **minimal** Solidity and Hardhat examples with common use cases. Such as:

### ERC20 Assets emitted with native BTC as collateral

Required to mint, burn and redeem a Bitcoin-backed asset on an EVM chain **without bridges or wrappers**.  
It implements the following flow:

1. A user sends real bitcoin to a custodian-controlled address and signs an on-chain **MintIntent**.
2. Midl validators watch the Bitcoin mempool, verify the deposit and call the EVM contract to mint the same amount of ERC-20 (`RuneERC20`).
3. The user can later burn the token to trigger **redemption**; the custodian releases the original sats.
4. A built-in **circuit-breaker** lets the custodian refuse redemptions from tainted addresses, exactly the mechanism BitGo used to stay safe during the 2021 BadgerDAO exploit.

```
deploy:base-example
```

### Proxy Contracts deployment with multiple same artifact based deployments
This example shows a base flow on deploying multiple proxies in a single hardhat script.
Developer are encouraged to use `hre.midl.save()` method in order to flexibly update
deployment files and call them at your convenience.

To execution the deploy script run:

```
deploy:proxies
```

### Interaction with RUNES:ERC20 with deposit and withdraw to & from MIDL Environment
WARN: You must add a Rune into Midl environment & update the script before executing it

1. Deploys RuneRelayer which simply allows to ERC20 deposits and withdraw to&from it
2. Save TERC20 with rune:erc20 evm address. This is required to perform approves
3. Deposit Rune into Midl environment & deposit into smart contract
4. Withdraw erc20:rune from the contract
5. Execute CompleteTx with runes & BTC withdraw

To execution the deploy script run:

```
deploy:runes-usage
```

---

## Contents

| Path                                                                    | Purpose                                                                       |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `contracts/RuneERC20.sol`                                               | Main token contract – supports minting with BTC or with the collateral token. |
| `contracts/helpers/CollateralERC20.sol`                                 | Simple ERC-20 that can act as alternative collateral.                         |
| `contracts/proxy/ProxyLogic.sol`                                        | Logic contract for proxy pattern.                                             |
| `contracts/proxy/ProxyLogicV2.sol`                                      | Example upgrade for proxy logic.                                              |
| `contracts/proxy/TransparentUpgradeableProxy.sol`                       | Transparent proxy contract implementation.                                    |
| `deploy-examples/base-example/000_deploy_CollateralERC20.ts`            | Example: deploys an ERC20 token.                                            |
| `deploy-examples/base-example/001_deploy_RuneERC20.ts`                  | Example: deploys an ERC20 and links CollateralERC2.                              |
| `deploy-examples/base-example/002_write_AdminMinting.ts`                | Example: privileged “admin mint” for initial supply.                          |
| `deploy-examples/base-example/003_write_CollateralERC20BasedMinting.ts` | Example: Approves collateral and mints RBTC using ERC‑20 path.                |
| `deploy-examples/base-example/004_write_CollateralBitcoinMinting.ts`    | Example: Mints RBTC by sending real BTC as collateral.                        |
| `deploy-examples/base-example/005_write_RequestRedemption.ts`           | Example: Burns RBTC and requests BTC redemption.                              |
| `deploy-examples/proxies/000_deploy_Proxies.ts`                         | Example: Deploys proxy contracts.                                             |
| `hardhat.config.ts`                                                     | Network + Midl plugin configuration (defaults to Midl **regtest**).           |
| `utils/deployStarter.js`                                                | Utility script for deployment starter.                                        |

---

## Prerequisites

-   **Node >= 20** (the repo is locked with Volta to `22.17.0`).
-   **pnpm** for package management.
-   **A regtest bitcoin balance** (see next section).

---

## Getting regtest bitcoin

Before you can deploy or test, you need a few testnet sats on **Midl regtest**.

1. **Use the faucet:** open <https://faucet.regtest.midl.xyz> and paste a regtest BTC address.

-   You may need to transfer BTC from your segwit address to the Taproot/Runes address.

2. **Or contact the Midl team:** ping `@midl_xyz` in the Telegram community and provide your address.

---

## Quick-start

```bash
# 1. Clone and install
git clone https://github.com/midl-xyz/smart-contract-deploy-starter.git
pnpm install            # or npm install / yarn install

# 2. Copy the env template and paste your mnemonic
cp .env.example .env
$EDITOR .env             # set MNEMONIC=...

# 3. Deploy to Midl regtest
pnpm hardhat deploy

# 4. Deploy the base example shown at deploy-examples/base-examples
pnpm deploy:base-example
```

## Explorers

-   Mempool.space: https://mempool.regtest.midl.xyz/
-   Blockscout: https://blockscout.regtest.midl.xyz/
