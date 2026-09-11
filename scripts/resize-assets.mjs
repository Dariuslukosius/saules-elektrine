import { readdir, readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const assetsRoot = join(root, "public", "assets");
const sourceRoots = [join(root, "app"), join(root, "components"), join(root, "data")];
const supported = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const editable = new Set([".tsx", ".ts", ".jsx", ".js", ".json", ".css"]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    files.push(...(entry.isDirectory() ? await walk(path) : [path]));
  }
  return files;
}

const candidates = (await walk(assetsRoot)).filter((file) => supported.has(extname(file).toLowerCase()));
const replacements = new Map();
let optimized = 0;

for (const input of candidates) {
  const before = await stat(input);
  if (before.size < 350 * 1024) continue;

  const details = execFileSync("sips", ["-g", "pixelWidth", "-g", "pixelHeight", input], { encoding: "utf8" });
  const width = Number(details.match(/pixelWidth: (\d+)/)?.[1] ?? 0);
  const height = Number(details.match(/pixelHeight: (\d+)/)?.[1] ?? 0);
  const needsResize = Math.max(width, height) > 2000;
  const output = input + ".optimized.webp";
  const args = ["-quiet", "-q", "80", "-m", "6", "-alpha_q", "88"];
  if (needsResize) args.push("-resize", width >= height ? "2000" : "0", width >= height ? "0" : "2000");
  args.push(input, "-o", output);

  try {
    execFileSync("cwebp", args);
    const after = await stat(output);
    if (after.size >= before.size) {
      await unlink(output);
      continue;
    }

    const final = input.replace(/\.(?:jpe?g|png|webp)$/i, ".webp");
    if (final === input) {
      await unlink(input);
      await rename(output, input);
    } else {
      const oldUrl = "/assets/" + relative(assetsRoot, input).split("\\").join("/");
      const newUrl = "/assets/" + relative(assetsRoot, final).split("\\").join("/");
      replacements.set(oldUrl, newUrl);
      await unlink(input);
      await rename(output, final);
    }
    optimized += 1;
  } catch {
    await unlink(output).catch(() => {});
  }
}

for (const sourceRoot of sourceRoots) {
  for (const file of await walk(sourceRoot)) {
    if (!editable.has(extname(file).toLowerCase())) continue;
    const original = await readFile(file, "utf8");
    let updated = original;
    for (const [from, to] of replacements) updated = updated.split(from).join(to);
    if (updated !== original) await writeFile(file, updated);
  }
}

console.log("Resized or recompressed " + optimized + " images; updated " + replacements.size + " source paths.");
