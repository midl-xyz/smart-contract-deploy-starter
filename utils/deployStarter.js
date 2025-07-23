const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const sourceDir = path.join(__dirname, "deploy-examples", "proxy");
const targetDir = path.join(__dirname, "deploy");

// Step 0: Delete all files from /deploy
if (fs.existsSync(targetDir)) {
  fs.readdirSync(targetDir).forEach((file) => {
    fs.unlinkSync(path.join(targetDir, file));
  });
} else {
  fs.mkdirSync(targetDir);
}

// Step 1 & 2: Copy files from /deploy-examples/proxy to /deploy
fs.readdirSync(sourceDir).forEach((file) => {
  const srcFile = path.join(sourceDir, file);
  const destFile = path.join(targetDir, file);
  fs.copyFileSync(srcFile, destFile);
});

// Step 3: Run pnpm hardhat deploy
try {
  execSync("pnpm hardhat deploy", { stdio: "inherit" });
} catch (err) {
  console.error("Deployment failed:", err.message);
  process.exit(1);
}
