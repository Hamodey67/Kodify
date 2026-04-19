import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const imgs = walk(PUBLIC).filter(p =>
  /\.(jpe?g|png)$/i.test(p) && !/\.min\./i.test(p)
);

console.log("Found", imgs.length, "images");

for (const p of imgs) {
  const rel = path.relative(PUBLIC, p);
  const ext = path.extname(p).toLowerCase();
  const base = p.slice(0, -ext.length);

  // WebP
  const outWebp = base + ".webp";
  if (!fs.existsSync(outWebp)) {
    await sharp(p)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(outWebp);
    console.log("✔ webp:", rel);
  }
}
console.log("Done.");
