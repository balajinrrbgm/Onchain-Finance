import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const srcSvg = readFileSync(join(process.cwd(), 'src', 'assets', 'afriasset-emblem-square.svg'));
const outDir = join(process.cwd(), 'public', 'branding');
mkdirSync(outDir, { recursive: true });

async function run() {
  const pngPath = join(outDir, 'afriasset-emblem-480.png');
  const jpgPath = join(outDir, 'afriasset-emblem-480.jpg');

  // Base rasterization
  const base = sharp(srcSvg).resize(480, 480, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } });

  // PNG (transparent)
  await base.png({ compressionLevel: 9 }).toFile(pngPath);

  // JPEG (white background)
  await sharp(srcSvg)
    .resize(480, 480, { fit: 'contain', background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .toFile(jpgPath);

  console.log('Generated logo assets:\n', pngPath, '\n', jpgPath);
}

run().catch((err) => {
  console.error('Logo generation failed', err);
  process.exit(1);
});
