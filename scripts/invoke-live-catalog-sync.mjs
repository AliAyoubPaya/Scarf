import { spawnSync } from "node:child_process";

const deployment = process.argv[2];
if (!deployment || !/^https:\/\/[a-z0-9.-]+\.vercel\.app$/i.test(deployment)) {
  console.error("Pass the HTTPS Vercel preview origin as the first argument.");
  process.exit(1);
}

const secret = process.env.CATALOG_SYNC_SECRET;
if (!secret || secret.length < 32) {
  console.error("CATALOG_SYNC_SECRET is not configured.");
  process.exit(1);
}

const args = [
  "--yes", "vercel@latest", "curl", "/api/catalog/sync",
  "--deployment", deployment, "--yes", "--",
  "--silent", "--show-error",
  "--header", `x-catalog-sync-secret:${secret}`,
  "--header", "content-type:application/json",
  "--request", "POST", "--data-binary", "@-",
];
const command = process.platform === "win32" ? "powershell.exe" : "npx";
const commandArgs = process.platform === "win32"
  ? ["-NoProfile", "-Command", `npx --yes vercel@latest curl /api/catalog/sync --deployment '${deployment}' --yes -- --silent --show-error --header \"x-catalog-sync-secret:$env:CATALOG_SYNC_SECRET\" --header \"content-type:application/json\" --request POST --data-binary '@-'`]
  : args;
const result = spawnSync(command, commandArgs, {
  input: '{"page":1}',
  stdio: ["pipe", "inherit", "inherit"],
});

if (result.error) console.error(`Failed to launch Vercel CLI (${result.error.code || "unknown error"}).`);
process.exit(result.status ?? 1);
