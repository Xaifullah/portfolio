import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'docs', 'public');
const inputImage = path.join(publicDir, 'profile.jpeg');

// Sizes for various favicon uses
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

async function createCircularFavicon(inputPath, outputPath, size) {
  // Create a circular mask
  const circleShape = Buffer.from(
    `<svg><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/></svg>`
  );

  // Get image metadata to determine crop dimensions
  const metadata = await sharp(inputPath).metadata();
  const minDim = Math.min(metadata.width, metadata.height);

  // Calculate crop position for center crop
  const left = Math.floor((metadata.width - minDim) / 2);
  const top = Math.floor((metadata.height - minDim) / 2);

  await sharp(inputPath)
    .extract({ left, top, width: minDim, height: minDim }) // Center crop to square
    .resize(size, size)
    .composite([{
      input: circleShape,
      blend: 'dest-in'
    }])
    .png()
    .toFile(outputPath);

  console.log(`Created: ${path.basename(outputPath)} (${size}x${size})`);
}

async function main() {
  console.log('Processing profile picture into circular favicons...\n');

  for (const { size, name } of sizes) {
    const outputPath = path.join(publicDir, name);
    await createCircularFavicon(inputImage, outputPath, size);
  }

  // Also create favicon.png (32x32 is standard)
  const faviconPath = path.join(publicDir, 'favicon.png');
  await createCircularFavicon(inputImage, faviconPath, 32);
  console.log(`Created: favicon.png (32x32)`);

  // Create logo for navbar (36x36)
  const logoPath = path.join(publicDir, 'logo.png');
  await createCircularFavicon(inputImage, logoPath, 36);
  console.log(`Created: logo.png (36x36)`);

  console.log('\nDone! Update your VitePress config to use these favicons.');
}

main().catch(console.error);
