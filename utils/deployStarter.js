// scripts/deploy-from.js
const fs = require("fs");
const path = require("path");

const sourceName = process.argv[2];
if (!sourceName) {
  console.error(
    "❌ Missing source folder name. Usage: node scripts/deploy-from.js <source>"
  );
  process.exit(1);
}

const sourceDir = path.join(__dirname, "..", "deploy-examples", sourceName);
const targetDir = path.join(__dirname, "..", "deploy");

// Ensure source exists
if (!fs.existsSync(sourceDir)) {
  console.error(`❌ Source folder does not exist: ${sourceDir}`);
  process.exit(1);
}

// Step 0: Clear /deploy
if (fs.existsSync(targetDir)) {
  fs.readdirSync(targetDir).forEach((file) => {
    fs.unlinkSync(path.join(targetDir, file));
  });
} else {
  fs.mkdirSync(targetDir);
}

// Step 1–2: Copy files to /deploy
fs.readdirSync(sourceDir).forEach((file) => {
  const srcFile = path.join(sourceDir, file);
  const destFile = path.join(targetDir, file);
  fs.copyFileSync(srcFile, destFile);
});

console.log(`✅ Copied files from ${sourceName} to /deploy`);
