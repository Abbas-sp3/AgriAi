const fs = require("node:fs");
const path = require("node:path");

function rmIfExists(p) {
  try {
    fs.rmSync(p, { force: true });
  } catch {
    // ignore
  }
}

const ua = process.env.npm_config_user_agent ?? "";
if (!ua.startsWith("pnpm/")) {
  console.error("Use pnpm instead");
  process.exit(1);
}

const root = path.resolve(__dirname, "..");
rmIfExists(path.join(root, "package-lock.json"));
rmIfExists(path.join(root, "yarn.lock"));

