import fs from "fs";
import path from "path";
import { readWorldFolder } from "mcbe-leveldb-reader"; // dari fork

export async function extractFromWorldFolder(worldDir, outputDir) {
  console.log("[*] Reading world folder directly:", worldDir);

  const world = await readWorldFolder(worldDir);

  let count = 0;

  for (const [key, value] of Object.entries(world)) {
    const keyStr = key.toString();

    if (!keyStr.startsWith("structuretemplate_")) continue;

    const fullId = keyStr.substring("structuretemplate_".length);
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
    fs.writeFileSync(outPath, Buffer.from(value.value));

    console.log(`[+] ${namespace}/${name}.mcstructure`);
    count++;
  }

  if (count === 0) {
    console.warn("⚠️ No structures found.");
  }
}
