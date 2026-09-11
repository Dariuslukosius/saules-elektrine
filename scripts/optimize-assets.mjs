import { readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { extname, join, relative } from "node:path";

const root = process.cwd();
const assetsRoot = join(root, "public", "assets");
const sourceRoots = [join(root, "app"), join(root, "components"), join(root, "data")];
const convertible = new Set([".jpg", ".jpeg", ".png"]);
const editable = new Set([".tsx", ".ts", ".jsx", ".js", ".json", ".css"]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

const images = (await walk(assetsRoot)).filter((file) => convertible.has(extname(file).toLowerCase()));
const replacements = new Map();
let bytesBefore = 0;
let bytesAfter = 0;

for (const image of images) {
  const before = await stat(image);
  bytesBefore += before.size;
  const output = image.replace(/\.(?:jpe?g|png)$/i, ".webp");

  try {
    execFileSync("cwebp", ["-quiet", "-q", "82", "-m", "6", "-alpha_q", "90", image, "-o", output]);
    const after = await stat(output);
    if (after.size >= before.size) {
      await unlink(output);
      bytesAfter += before.size;
      continue;
    }

    const oldUrl = `/assets/${relative(assetsRoot, image).split("\\").join("/")}`;
    const newUrl = `/assets/${relative(assetsRoot, output).split("\\").join("/")}`;
    replacements.set(oldUrl, newUrl);
    bytesAfter += after.size;
  } catch {
    bytesAfter += before.size;
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

for (const image of images) {
  const oldUrl = `/assets/${relative(assetsRoot, image).split("\\").join("/")}`;
  if (replacements.has(oldUrl)) await unlink(image);
}

const mb = (value) => `${(value / 1024 / 1024).toFixed(1)} MB`;
console.log(`Optimized ${replacements.size}/${images.length} images: ${mb(bytesBefore)} -> ${mb(bytesAfter)}.`);
