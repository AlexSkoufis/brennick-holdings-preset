// Builds responsive WebP ladders and blur placeholders from assets-src/
// into public/img/, and writes src/data/image-manifest.json.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const srcDirs = ["assets-src/photo"];
const outDir = path.join(root, 'public/img');
const WIDTHS = [480, 800, 1200, 1800, 2400];

fs.mkdirSync(outDir, { recursive: true });
const manifest = {};

for (const dir of srcDirs) {
  for (const file of fs.readdirSync(path.join(root, dir))) {
    if (!/\.(jpe?g|png)$/i.test(file)) continue;
    const slug = file.replace(/\.\w+$/, '');
    const input = path.join(root, dir, file);
    const meta = await sharp(input).metadata();
    const widths = WIDTHS.filter((w) => w < meta.width);
    if (!widths.length || widths.at(-1) < meta.width * 0.9) widths.push(Math.min(meta.width, 2400));
    const sources = [];
    for (const w of [...new Set(widths)]) {
      const name = `${slug}-${w}.webp`;
      const out = path.join(outDir, name);
      if (!fs.existsSync(out)) {
        await sharp(input).resize({ width: w, withoutEnlargement: true }).webp({ quality: w > 1500 ? 72 : 78 }).toFile(out);
      }
      sources.push({ w, src: `/img/${name}` });
    }
    const blur = await sharp(input).resize(24).blur(1.2).webp({ quality: 40 }).toBuffer();
    manifest[slug] = {
      width: meta.width,
      height: meta.height,
      sources,
      blur: `data:image/webp;base64,${blur.toString('base64')}`,
    };
    console.log(slug, meta.width, 'x', meta.height, sources.map((s) => s.w).join(','));
  }
}

fs.writeFileSync(path.join(root, 'src/data/image-manifest.json'), JSON.stringify(manifest, null, 1));
