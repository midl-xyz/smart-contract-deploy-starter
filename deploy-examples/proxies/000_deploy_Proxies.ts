import type { DeploymentData } from "@midl/hardhat-deploy/dist/actions/saveDeployment.cjs";
import type { DeployFunction } from "hardhat-deploy/types";

const deploy: DeployFunction = async ({ midl }) => {
  console.log("Starting deployment process...");

  await midl.initialize();
  console.log("Deployer BTC address: ", midl.account.address);
  await midl.deploy("ProxyLogic");

  await midl.execute();

  await midl.deploy("TransparentUpgradeableProxy", [
    (await midl.get("ProxyLogic"))?.address,
    midl.evm.address,
    "0x",
  ]);

  await midl.execute();

  // Save ProxyLogic ABI into the "ProxyLogic.json" file with TransparentUpgradeableProxy address
  await midl.save("ProxyLogic", {
    abi: (await midl.get("ProxyLogic"))?.abi,
    address: ((await midl.get("TransparentUpgradeableProxy")) as DeploymentData)
      .address,
  });

  // Create a new file with name "Proxy2" with ProxyLogic ABI and TransparentUpgradeableProxy address
  await midl.save("Proxy2", {
    abi: (await midl.get("ProxyLogic"))?.abi,
    address: ((await midl.get("TransparentUpgradeableProxy")) as DeploymentData)
      .address,
  });

  // Delete existing deployment to be able to deploy contract once again
  await midl.delete("TransparentUpgradeableProxy");

  await midl.deploy("TransparentUpgradeableProxy", [
    (await midl.get("ProxyLogic"))?.address,
    midl.evm.address,
    "0x",
  ]);

  await midl.execute();

  // Rewrite "Proxy2" with newly deployed TransparentUpgradeableProxy address
  await midl.save("Proxy2", {
    abi: (await midl.get("ProxyLogic"))?.abi,
    address: ((await midl.get("TransparentUpgradeableProxy")) as DeploymentData)
      .address,
  });
};

deploy.tags = ["main", "ProxyDeployments"];

export default deploy;
