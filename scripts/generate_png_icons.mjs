import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, getPixel) {
  // RGBA buffer with filter byte 0 at start of each scanline
  const stride = width * 4 + 1;
  const rawData = Buffer.alloc(stride * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * stride;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pixelOffset = rowOffset + 1 + x * 4;
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = c ^ buf[i];
    for (let j = 0; j < 8; j++) {
      c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + len));
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// Indian Flag Pixel Generator with Ashoka Chakra & WhatsApp Green background
function tirangaPixel(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const radius = w * 0.44;

  // Outer circular background: WhatsApp Green #075e54
  if (dist > radius) {
    if (dist < radius + 3) return [7, 94, 84, 180];
    return [0, 0, 0, 0];
  }

  // Inside circle: Indian Flag Tri-color
  const relY = (y - (cy - radius)) / (radius * 2);

  // Ashoka Chakra in Center
  const chakraDist = Math.sqrt(dx * dx + dy * dy);
  const chakraRadius = radius * 0.32;
  if (chakraDist <= chakraRadius && chakraDist >= chakraRadius - (w > 300 ? 5 : 2.5)) {
    return [0, 0, 128, 255]; // Navy Blue rim
  }
  if (chakraDist <= (w > 300 ? 8 : 4)) {
    return [0, 0, 128, 255]; // Hub
  }

  // Spokes calculation (24 spokes = every 15 deg)
  if (chakraDist < chakraRadius) {
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 180;
    if (angle % 15 < 1.2 || angle % 15 > 13.8) {
      return [0, 0, 128, 255]; // Navy Spoke
    }
  }

  if (relY < 0.33) {
    return [255, 153, 51, 255]; // Saffron #FF9933
  } else if (relY < 0.66) {
    return [255, 255, 255, 255]; // White
  } else {
    return [19, 136, 8, 255]; // India Green #138808
  }
}

// Generate Icons
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, tirangaPixel));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, tirangaPixel));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, tirangaPixel));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, tirangaPixel));

console.log('Successfully created PWA icons in public/');
