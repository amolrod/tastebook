import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

let crcTable;

const OUTPUT_DIR = join(process.cwd(), 'public', 'icons');

mkdirSync(OUTPUT_DIR, { recursive: true });

const variants = [
  { size: 180, name: 'apple-touch-icon.png', color: '#f97316', alpha: 1 },
  { size: 192, name: 'icon-192.png', color: '#f97316', alpha: 1 },
  { size: 512, name: 'icon-512.png', color: '#f97316', alpha: 1 },
  { size: 512, name: 'icon-maskable-512.png', color: '#f97316', alpha: 1 }
];

for (const variant of variants) {
  const buffer = createSolidPng(variant.size, variant.size, variant.color, variant.alpha);
  writeFileSync(join(OUTPUT_DIR, variant.name), buffer);
  console.log(`Generated ${variant.name}`);
}

function createSolidPng(width, height, hexColor, alpha = 1) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const imageData = createImageData(width, height, hexColor, alpha);
  const idatData = imageData;
  const pngBuffer = Buffer.concat([
    signature,
    createChunk('IHDR', ihdrData),
    createChunk('IDAT', idatData),
    createChunk('IEND', Buffer.alloc(0))
  ]);

  return pngBuffer;
}

function createImageData(width, height, hexColor, alpha) {
  const { r, g, b, a } = hexToRgba(hexColor, alpha);
  const rowLength = width * 4 + 1;
  const raw = Buffer.alloc(rowLength * height);

  for (let y = 0; y < height; y += 1) {
    const rowStart = y * rowLength;
    raw[rowStart] = 0; // filter type 0
    for (let x = 0; x < width; x += 1) {
      const offset = rowStart + 1 + x * 4;
      raw[offset] = r;
      raw[offset + 1] = g;
      raw[offset + 2] = b;
      raw[offset + 3] = a;
    }
  }

  return deflateSync(raw, { level: 9 });
}

function createChunk(type, data) {
  const chunk = Buffer.alloc(8 + data.length + 4);
  chunk.writeUInt32BE(data.length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, 8 + data.length));
  chunk.writeUInt32BE(crc, 8 + data.length);
  return chunk;
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace('#', '');
  const bigint = Number.parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const a = Math.round((alpha ?? 1) * 255);
  return { r, g, b, a };
}

function makeCrcTable() {
  const table = new Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c >>>= 1;
      }
    }
    table[n] = c >>> 0;
  }
  return table;
}

function crc32(buf) {
  if (!crcTable) {
    crcTable = makeCrcTable();
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    const byte = buf[i];
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
