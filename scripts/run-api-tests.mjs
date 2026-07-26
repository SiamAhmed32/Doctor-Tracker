import { spawn } from "node:child_process";
import net from "node:net";
import { setTimeout as wait } from "node:timers/promises";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const port = process.env.TEST_PORT || "3000";
const baseUrl = `http://127.0.0.1:${port}/api`;
const nextBin = "node_modules/next/dist/bin/next";
const npxBin = process.platform === "win32" ? "npx.cmd" : "npx";

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required. Copy .env.test.example first.`);
  return value;
}

const testEnv = {
  ...process.env,
  MONGODB_URI: required("TEST_MONGODB_URI"),
  JWT_SECRET: required("TEST_JWT_SECRET"),
  SEED_ADMIN_EMAIL: required("TEST_ADMIN_EMAIL"),
  SEED_ADMIN_PASSWORD: required("TEST_ADMIN_PASSWORD"),
  API_BASE_URL: baseUrl,
  TEST_ADMIN_EMAIL: required("TEST_ADMIN_EMAIL"),
  TEST_ADMIN_PASSWORD: required("TEST_ADMIN_PASSWORD"),
  CLIENT_ORIGIN: `http://127.0.0.1:${port}`,
  NODE_ENV: "development",
};

function run(command, args, env = testEnv) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env,
      stdio: "inherit",
      // Windows cannot spawn .cmd shims without a shell.
      shell: process.platform === "win32",
    });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${args.join(" ")} failed (${code})`));
    });
  });
}

async function waitForApi() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/health`);
      if (response.ok) return;
    } catch {
      // The Next.js dev server is still starting.
    }
    await wait(1000);
  }
  throw new Error(`API did not become ready at ${baseUrl}/health.`);
}

function assertPortAvailable() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.once("error", () => {
      reject(
        new Error(
          `Port ${port} is already in use. Stop the running app before npm test.`,
        ),
      );
    });
    probe.listen(Number(port), "127.0.0.1", () => {
      probe.close(resolve);
    });
  });
}

async function stopServer(server) {
  if (!server?.pid || server.exitCode !== null) return;

  await new Promise((resolve) => {
    const timeout = setTimeout(resolve, 5000);
    server.once("exit", () => {
      clearTimeout(timeout);
      resolve();
    });
    server.kill("SIGTERM");
  });
}

async function main() {
  let server;
  try {
    await assertPortAvailable();
    await run(npxBin, ["tsx", "scripts/prepare-test-db.ts", "--setup"]);
    server = spawn(process.execPath, [nextBin, "dev", "--webpack", "--port", port], {
      env: testEnv,
      stdio: "inherit",
    });
    await waitForApi();
    await run(process.execPath, ["--test", "tests/api.test.mjs"]);
  } finally {
    await stopServer(server);
    await run(npxBin, ["tsx", "scripts/prepare-test-db.ts"], testEnv).catch(() => {
      process.exitCode = 1;
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
