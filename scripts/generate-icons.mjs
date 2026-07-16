import sharp from 'sharp';
import { mkdirSync } from 'fs';

mkdirSync('public/icons', { recursive: true });

const SOURCE = 'scripts/assets/logo-source.jpeg';

// Recolor the navy glyph to pure black on a pure white background, preserving
// anti-aliased edges (grayscale + contrast stretch, no hard threshold).
const glyph = sharp(SOURCE).grayscale().normalize();

// Pad onto a square white canvas with a safe margin so the mark doesn't touch
// the edges once iOS applies its own rounded-corner mask.
const withMargin = async (size) => {
  const inner = Math.round(size * 0.72);
  const pane = await glyph.clone().resize(inner, inner, { fit: 'contain', background: '#ffffff' }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 3, background: '#ffffff' } })
    .composite([{ input: pane, gravity: 'center' }])
    .png();
};

const sizes = [64, 192, 512];
for (const size of sizes) {
  await (await withMargin(size)).toFile(`public/icons/icon-${size}.png`);
}
await (await withMargin(512)).toFile('public/icons/maskable-512.png');
await (await withMargin(180)).toFile('public/icons/apple-touch-icon.png');
await (await withMargin(32)).toFile('public/icons/favicon-32.png');

// Standalone in-app mark (used on the login/onboarding/paywall screens).
await (await withMargin(256)).toFile('public/icons/mark.png');

console.log('Icons generated');
