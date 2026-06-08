import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const targetDir = new URL("../target/", import.meta.url);
const coverageDir = new URL("../target/frontend-v8/", import.meta.url);
const repoDir = fileURLToPath(new URL("../", import.meta.url));
await mkdir(targetDir, { recursive: true });
await mkdir(coverageDir, { recursive: true });

const child = spawn(process.execPath, [
    "--test",
    "--test-reporter=tap",
    "--experimental-test-coverage",
    "src/test/frontend/app-core.test.mjs"
], {
    cwd: repoDir,
    env: {
        ...process.env,
        NODE_V8_COVERAGE: fileURLToPath(coverageDir)
    },
    stdio: ["ignore", "pipe", "pipe"]
});

let output = "";
child.stdout.on("data", (chunk) => {
    const text = chunk.toString();
    output += text;
    process.stdout.write(text);
});
child.stderr.on("data", (chunk) => {
    const text = chunk.toString();
    output += text;
    process.stderr.write(text);
});

const exitCode = await new Promise((resolve) => child.on("close", resolve));
const coverageMatch = output.match(/app-core\.js\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)/);
const summary = coverageMatch
    ? [
        "Frontend coverage summary",
        `Line coverage: ${coverageMatch[1]}%`,
        `Branch coverage: ${coverageMatch[2]}%`,
        `Function coverage: ${coverageMatch[3]}%`,
        "",
        output
    ].join("\n")
    : output;
await writeFile(new URL("../target/frontend-coverage.txt", import.meta.url), summary, "utf8");
process.exit(exitCode ?? 1);
