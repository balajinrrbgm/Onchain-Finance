import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcSvgPath = path.join(process.cwd(), 'src', 'assets', 'afriasset-emblem-square.svg');
const srcSvg = fs.readFileSync(srcSvgPath);
const outDir = path.join(process.cwd(), 'public', 'branding');
fs.mkdirSync(outDir, { recursive: true });

async function run() {
  const pngPath = path.join(outDir, 'afriasset-emblem-480.png');
  const jpgPath = path.join(outDir, 'afriasset-emblem-480.jpg');

  const base = sharp(srcSvg).resize(480, 480, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } });
  await base.png({ compressionLevel: 9 }).toFile(pngPath);

  await sharp(srcSvg)
    .resize(480, 480, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .toFile(jpgPath);

  const pngSize = fs.statSync(pngPath).size;
  const jpgSize = fs.statSync(jpgPath).size;
  console.log('Generated logo assets:');
  console.log(pngPath, Math.round(pngSize / 1024) + 'KB');
  console.log(jpgPath, Math.round(jpgSize / 1024) + 'KB');
  if (pngSize > 2_000_000 || jpgSize > 2_000_000) {
    console.warn('Warning: One of the assets exceeds 2MB size target.');
  }
}

run().catch((err) => {
  console.error('Logo generation failed', err);
  process.exit(1);
});