#!/usr/bin/env node

import path from "path";
import fs from "fs";
import { extractFromMcworld } from "../src/extractFromMcworld.js";
import { extractFromWorldFolder } from "../src/extractFromWorldFolder.js";

function printUsage() {
  console.log(`
mcbe-structure-extract <input> [--output <dir>]

<input> :
  - Path to .mcworld file
  - OR path to Bedrock world folder (contains level.dat & db/)

--output <dir> :
  Optional output directory
  Structures will be written to <dir>/structures
  Default: current directory
`);
}

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error("❌ No input provided.");
  printUsage();
  process.exit(1);
}

let input = null;
let outputBase = process.cwd();

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--output") {
    outputBase = args[i + 1];
    i++;
  } else if (!input) {
    input = args[i];
  }
}

if (!input) {
  console.error("❌ Input is required.");
  printUsage();
  process.exit(1);
}

const outputDir = path.join(outputBase, "structures");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

(async () => {
  try {
    const stat = fs.statSync(input);

    if (stat.isFile() && input.endsWith(".mcworld")) {
      await extractFromMcworld(input, outputDir);
    } else if (stat.isDirectory()) {
      await extractFromWorldFolder(input, outputDir);
    } else {
      throw new Error("Invalid input type.");
    }

    console.log("✅ Extraction finished.");
    console.log("📁 Output:", outputDir);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();
