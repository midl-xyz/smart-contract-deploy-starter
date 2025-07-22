import { ethers } from "hardhat";
import { Address } from "hardhat-deploy/types";

export const getProxyAdminAddress = async (proxyAddress: Address) => {
    const provider = new ethers.JsonRpcProvider("https://rpc.regtest.midl.xyz");
    
    const transparentUpgradeableProxy = await (ethers.getContractAt("TransparentUpgradeableProxy", proxyAddress));

    return (await transparentUpgradeableProxy.getAdmin());
}