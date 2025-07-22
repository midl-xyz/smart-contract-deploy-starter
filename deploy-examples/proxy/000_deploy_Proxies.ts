import { getProxyAdminAddress } from "@/utils";
import type { DeployFunction } from "hardhat-deploy/types";
import { ProxyAdmin, ProxyAdmin__factory } from "@/typechain-types";

const deploy: DeployFunction = async ({ midl }) => {
  console.log("Starting deployment process...");

  await midl.initialize();
  console.log(
    "Deployer BTC address: ",
    midl.getConfig()?.getState()?.accounts?.[0].address
  );
  await midl.deploy("ProxyLogic", { args: [] });

  await midl.execute();

  await midl.deploy("TransparentUpgradeableProxy", {
    args: [
      (await midl.getDeployment("ProxyLogic"))?.address,
      midl.getEVMAddress(),
      "0x",
    ],
  });

  await midl.execute();

  // Save ProxyLogic ABI into the "ProxyLogic.json" file with TransparentUpgradeableProxy address
  await midl.save("ProxyLogic", {
    abi: (await midl.getDeployment("ProxyLogic"))?.abi!,
    address: (
      await midl.getDeployment("TransparentUpgradeableProxy")
    )?.address!,
  });

  // Create a new file with name "Proxy2" with ProxyLogic ABI and TransparentUpgradeableProxy address
  await midl.save("Proxy2", {
    abi: (await midl.getDeployment("ProxyLogic"))?.abi!,
    address: (
      await midl.getDeployment("TransparentUpgradeableProxy")
    )?.address!,
  });

  // Delete existing deployment to be able to deploy contract once again
  await midl.deleteDeployment("TransparentUpgradeableProxy");

  await midl.deploy("TransparentUpgradeableProxy", {
    args: [
      (await midl.getDeployment("ProxyLogic"))?.address,
      midl.getEVMAddress(),
      "0x",
    ],
  });

  await midl.execute();

  // Rewrite "Proxy2" with newly deployed TransparentUpgradeableProxy address
  await midl.save("Proxy2", {
    abi: (await midl.getDeployment("ProxyLogic"))?.abi!,
    address: (
      await midl.getDeployment("TransparentUpgradeableProxy")
    )?.address!,
  });
};

deploy.tags = ["main", "ProxyDeployments"];

export default deploy;
