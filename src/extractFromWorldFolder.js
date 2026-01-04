import fs from "fs";
import path from "path";
import archiver from "archiver";
import { extractFromMcworld } from "./extractFromMcworld.js";
import os from "os";

export async function extractFromWorldFolder(worldDir, outputDir) {
  console.log("[*] Zipping world folder:", worldDir);

  const tmpMcworld = path.join(
    os.tmpdir(),
    `mcbe_tmp_${Date.now()}.mcworld`
  );

  await zipFolder(worldDir, tmpMcworld);
  await extractFromMcworld(tmpMcworld, outputDir);

  fs.unlinkSync(tmpMcworld);
}

function zipFolder(src, dest) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(dest);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);
    archive.directory(src, false);
    archive.finalize();

    output.on("close", resolve);
    archive.on("error", reject);
  });
}
