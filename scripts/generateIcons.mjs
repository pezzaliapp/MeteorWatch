// Pure-Node PNG generator (no external deps).
// Creates the MeteorWatch icon set as solid-color PNGs with a gradient + glyph.
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '..', 'public', 'icons');

if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePng(width, height, pixels) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter none
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });

  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function lerpColor(c1, c2, t) {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ];
}

function setPixel(buf, w, x, y, r, g, b, a) {
  const i = (y * w + x) * 4;
  buf[i] = r;
  buf[i + 1] = g;
  buf[i + 2] = b;
  buf[i + 3] = a;
}

function drawIcon(size, { maskable = false } = {}) {
  const px = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const inset = maskable ? size * 0.1 : 0;
  // Background gradient (top space-700 -> bottom space-900)
  const cTop = [11, 17, 41];
  const cBot = [3, 5, 12];
  // Stars positions
  const stars = [
    { x: 0.18, y: 0.22, r: 0.012, c: [255, 255, 255] },
    { x: 0.74, y: 0.18, r: 0.014, c: [255, 92, 208] },
    { x: 0.82, y: 0.7, r: 0.011, c: [251, 191, 36] },
    { x: 0.28, y: 0.78, r: 0.011, c: [255, 255, 255] },
    { x: 0.62, y: 0.62, r: 0.014, c: [92, 240, 255] },
  ];
  // Comet meteor: from upper-right to lower-left
  const cometStart = { x: 0.78, y: 0.22, r: 0.085, c: [255, 255, 255] };
  const tailStart = { x: 0.78, y: 0.22 };
  const tailEnd = { x: 0.18, y: 0.82 };

  for (let y = 0; y < size; y++) {
    const t = y / (size - 1);
    const [r, g, b] = lerpColor(cTop, cBot, t);
    for (let x = 0; x < size; x++) {
      // outside rounded corners → transparent
      let alpha = 255;
      if (!maskable) {
        const radius = size * 0.22;
        const dx = Math.max(0, Math.abs(x - cx) - (cx - radius));
        const dy = Math.max(0, Math.abs(y - cy) - (cy - radius));
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > radius) alpha = 0;
        else if (d > radius - 1) alpha = Math.round(255 * (radius - d));
      }
      if (alpha > 0) {
        // background tint slightly redder near the comet head
        const dxc = (x / size - cometStart.x) * 1.2;
        const dyc = (y / size - cometStart.y) * 1.2;
        const dc = Math.sqrt(dxc * dxc + dyc * dyc);
        const tint = Math.max(0, 1 - dc * 4);
        setPixel(
          px,
          size,
          x,
          y,
          Math.min(255, Math.round(r + 30 * tint)),
          Math.min(255, Math.round(g + 25 * tint)),
          Math.min(255, Math.round(b + 60 * tint)),
          alpha,
        );
      } else {
        setPixel(px, size, x, y, 0, 0, 0, 0);
      }
    }
  }

  // draw comet tail (line)
  const steps = size * 2;
  for (let s = 0; s < steps; s++) {
    const ts = s / (steps - 1);
    const x = lerp(tailStart.x, tailEnd.x, ts) * size;
    const y = lerp(tailStart.y, tailEnd.y, ts) * size;
    const tailR = (1 - ts) * size * 0.06 + 1;
    const c = lerpColor([92, 240, 255], [255, 92, 208], ts);
    const a = Math.round(180 * (1 - ts));
    drawDisk(px, size, x, y, tailR, c[0], c[1], c[2], a);
  }
  // comet head bright
  drawDisk(px, size, cometStart.x * size, cometStart.y * size, size * cometStart.r, 255, 255, 255, 255);
  drawDisk(px, size, cometStart.x * size, cometStart.y * size, size * cometStart.r * 1.6, 92, 240, 255, 80);

  // stars
  for (const s of stars) {
    drawDisk(px, size, s.x * size, s.y * size, size * s.r, s.c[0], s.c[1], s.c[2], 230);
    drawDisk(px, size, s.x * size, s.y * size, size * s.r * 2.5, s.c[0], s.c[1], s.c[2], 60);
  }

  // safe inset for maskable
  if (maskable) {
    // dim outside the safe zone
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (
          x < inset ||
          y < inset ||
          x > size - inset ||
          y > size - inset
        ) {
          const i = (y * size + x) * 4;
          px[i] = Math.round(px[i] * 0.6);
          px[i + 1] = Math.round(px[i + 1] * 0.6);
          px[i + 2] = Math.round(px[i + 2] * 0.6);
        }
      }
    }
  }

  return makePng(size, size, px);
}

function drawDisk(buf, size, cx, cy, r, R, G, B, A) {
  const r2 = r * r;
  const minX = Math.max(0, Math.floor(cx - r));
  const maxX = Math.min(size - 1, Math.ceil(cx + r));
  const minY = Math.max(0, Math.floor(cy - r));
  const maxY = Math.min(size - 1, Math.ceil(cy + r));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const d2 = dx * dx + dy * dy;
      if (d2 > r2) continue;
      const i = (y * size + x) * 4;
      const dist = Math.sqrt(d2);
      const edge = Math.max(0, 1 - Math.max(0, dist - (r - 1)));
      const a = Math.round((A * edge) / 1);
      // alpha-over composite
      const srcA = a / 255;
      const dstA = buf[i + 3] / 255;
      const outA = srcA + dstA * (1 - srcA);
      if (outA === 0) continue;
      buf[i] = Math.round((R * srcA + buf[i] * dstA * (1 - srcA)) / outA);
      buf[i + 1] = Math.round((G * srcA + buf[i + 1] * dstA * (1 - srcA)) / outA);
      buf[i + 2] = Math.round((B * srcA + buf[i + 2] * dstA * (1 - srcA)) / outA);
      buf[i + 3] = Math.round(outA * 255);
    }
  }
}

const TARGETS = [
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
  { name: 'icon-maskable-512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180 },
];

for (const t of TARGETS) {
  const png = drawIcon(t.size, { maskable: t.maskable });
  await writeFile(path.join(outDir, t.name), png);
  console.log(`  ✓ ${t.name} (${t.size}×${t.size}, ${png.length.toLocaleString()} bytes)`);
}
console.log('Icons generated in', outDir);
