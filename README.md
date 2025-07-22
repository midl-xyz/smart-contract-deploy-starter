# RuneERC20 – Bitcoin-Standard ERC-20 Example with Midl

This repository shows the **minimal** Solidity and Hardhat examples with common use cases. Such as:

### Proxy Contracts deployment with multiple same artifact based deployments

### ERC20 Assets emitted with native BTC as collateral
Required to mint, burn and redeem a Bitcoin-backed asset on an EVM chain **without bridges or wrappers**.  
It implements the following flow:

1. A user sends real bitcoin to a custodian-controlled address and signs an on-chain **MintIntent**.  
2. Midl validators watch the Bitcoin mempool, verify the deposit and call the EVM contract to mint the same amount of ERC-20 (`RuneERC20`).  
3. The user can later burn the token to trigger **redemption**; the custodian releases the original sats.  
4. A built-in **circuit-breaker** lets the custodian refuse redemptions from tainted addresses, exactly the mechanism BitGo used to stay safe during the 2021 BadgerDAO exploit.

---

## Contents

| Path | Purpose |
|------|---------|
| `contracts/CollateralERC20.sol` | Simple ERC-20 that can act as alternative collateral. |
| `contracts/RuneERC20.sol`      | Main token contract – supports minting with BTC or with the collateral token. |
| `deploy/000_deploy_CollateralERC20.ts` | Hardhat‑deploy script for the collateral token. |
| `deploy/001_deploy_RuneERC20.ts`      | Deploys `RuneERC20` and wires it to the collateral token. |
| `deploy/002_writeAdminMinting.ts`     | Shows a privileged “admin mint” used to seed initial supply. |
| `deploy/003_write_CollateralERC20BasedMinting.ts` | Approves collateral and mints RBTC using the ERC‑20 path. |
| `deploy/004_write_CollateralBitcoinMinting.ts`    | Mints RBTC by sending real BTC as collateral. |
| `deploy/005_write_RequestRedemption.ts`           | Burns RBTC and requests release of the underlying sats. |
| `hardhat.config.ts` | Network + Midl plugin configuration (defaults to Midl **regtest**). |

---

## Prerequisites

* **Node >= 20** (the repo is locked with Volta to `22.17.0`).  
* **Yarn or npm** for package management.  
* **A regtest bitcoin balance** (see next section).  

---

## Getting regtest bitcoin

Before you can deploy or test, you need a few testnet sats on **Midl regtest**.

1. **Use the faucet:** open <https://faucet.etna.midl.xyz> and paste a regtest BTC address.  
2. **Or contact the Midl team:** ping `@midl_xyz` in the Telegram community and provide your address.

---

## Quick-start

```bash
# 1. Clone and install
git clone https://github.com/midl-xyz/midl-solidity-on-bitcoin-example.git
cd midl-solidity-on-bitcoin-example
pnpm install            # or npm install / yarn install

# 2. Copy the env template and paste your mnemonic
cp .env.example .env
$EDITOR .env             # set MNEMONIC=...

# 3. Deploy to Midl regtest
pnpm hardhat deploy