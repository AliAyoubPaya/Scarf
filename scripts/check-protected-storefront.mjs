import { spawnSync } from "node:child_process";

const deployment = process.argv[2];
if (!deployment || !/^https:\/\/[a-z0-9.-]+\.vercel\.app$/i.test(deployment)) {
  console.error("Pass the HTTPS Vercel preview origin as the first argument.");
  process.exit(1);
}

const expectedProducts = [
  "Olive Mist Modal Hijab",
  "Cocoa Cloud Modal Hijab",
  "Soft Pearl Chiffon Hijab",
];
const args = ["--yes", "vercel@latest", "curl", "/", "--deployment", deployment, "--yes", "--", "--silent", "--show-error"];
const command = process.platform === "win32" ? "powershell.exe" : "npx";
const commandArgs = process.platform === "win32"
  ? ["-NoProfile", "-Command", `npx --yes vercel@latest curl / --deployment '${deployment}' --yes -- --silent --show-error`]
  : args;
const result = spawnSync(command, commandArgs, { encoding: "utf8" });

if (result.status !== 0) {
  console.error("Protected storefront request failed.");
  process.exit(result.status ?? 1);
}

const missing = expectedProducts.filter((name) => !result.stdout.includes(name));
if (missing.length) {
  console.error(`Storefront verification failed; missing ${missing.join(", ")}.`);
  process.exit(1);
}

console.log(JSON.stringify({ storefrontVerified: true, productsVisible: expectedProducts.length }));
