const { spawnSync } = require("node:child_process");

const next = require.resolve("next/dist/bin/next");
const result = spawnSync(process.execPath, [next, "build", ...process.argv.slice(2)], {
  env: { ...process.env, CI: "1" },
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
