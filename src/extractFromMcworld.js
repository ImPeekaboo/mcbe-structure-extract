import fs from "fs";
import { Blob } from "buffer";
import { readMcworld } from "mcbe-leveldb-reader";
import path from "path";

export async function extractFromMcworld(mcworldPath, outputDir) {
  console.log("[*] Reading mcworld:", mcworldPath);

  const raw = await fs.promises.readFile(mcworldPath);
  const blob = new Blob([raw]);
  const world = await readMcworld(blob);

  await extractFromWorldObject(world, outputDir);
}

async function extractFromWorldObject(world, outputDir) {
  let count = 0;

  for (const [keyStr, entry] of Object.entries(world)) {
    if (!entry?.value) continue;

    let rawKey;
    try {
      rawKey = Buffer.from(keyStr, "binary").toString("utf8");
    } catch {
      continue;
    }

    if (!rawKey.startsWith("structuretemplate_")) continue;

    const fullId = rawKey.substring("structuretemplate_".length);
    let namespace = "default";
    let name = fullId;

    if (fullId.includes(":")) {
      [namespace, name] = fullId.split(":");
    }

    namespace = namespace.replace(/[^\w.-]/g, "_");
    name = name.replace(/[^\w.-]/g, "_");

    const nsDir = path.join(outputDir, namespace);
    fs.mkdirSync(nsDir, { recursive: true });

    const outPath = path.join(nsDir, `${name}.mcstructure`);
    await fs.promises.writeFile(outPath, Buffer.from(entry.value));

    console.log(`[+] ${namespace}/${name}.mcstructure`);
    count++;
  }

  if (count === 0) {
    console.warn("⚠️ No structures found.");
  }
}
