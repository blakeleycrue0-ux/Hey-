import sharp from 'sharp';
import { mkdirSync } from 'fs';

mkdirSync('public/icons', { recursive: true });

const BRAND = '#5B4FE8';

// Flat, single-color mark: a simple flame (matches the in-app brand mark), no gradients.
const flame = 'M256 118c-6 0-11 4-13 10-8 24-30 40-30 76 0 26 21 47 47 47s47-21 47-47c0-14-6-24-13-33 12 6 30 24 30 54 0 39-32 71-71 71s-71-32-71-71c0-56 41-84 61-96 6-4 9-8 13-11z';

const svg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="112" fill="${BRAND}"/>
  <path d="${flame}" fill="white"/>
</svg>`;

const maskableSvg = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="${BRAND}"/>
  <g transform="translate(0 20) scale(0.82) translate(46 46)">
    <path d="${flame}" fill="white"/>
  </g>
</svg>`;

const sizes = [64, 192, 512];
for (const size of sizes) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(`public/icons/icon-${size}.png`);
}
await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile('public/icons/maskable-512.png');
await sharp(Buffer.from(svg)).resize(180, 180).png().toFile('public/icons/apple-touch-icon.png');
await sharp(Buffer.from(svg)).resize(32, 32).png().toFile('public/icons/favicon-32.png');

console.log('Icons generated');
