/**
 * Renders the Firepanel icon set. No dependencies: shapes are rasterised as
 * booleans at a high multiple of the target size, then box-downsampled, which
 * is where the antialiasing comes from.
 */

import { deflateSync } from "zlib";
import { writeFileSync, mkdirSync } from "fs";

const SLATE = [31, 36, 48];
const TEAL = [45, 212, 191];
const MUTED = [91, 103, 122];

const crcTable = (() => {
  const table = new Uint32Array(256);

  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }

  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xff];
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])));
  return Buffer.concat([length, typeBytes, data, crc]);
}

function encodePNG(size, rgba) {
  const rowLength = 1 + size * 4;
  const raw = Buffer.alloc(size * rowLength);

  for (let y = 0; y < size; y++) {
    raw[y * rowLength] = 0;
    for (let x = 0; x < size; x++) {
      const from = (y * size + x) * 4;
      const to = y * rowLength + 1 + x * 4;
      raw[to] = rgba[from];
      raw[to + 1] = rgba[from + 1];
      raw[to + 2] = rgba[from + 2];
      raw[to + 3] = rgba[from + 3];
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

class Canvas {
  constructor(resolution) {
    this.resolution = resolution;
    this.pixels = new Uint8Array(resolution * resolution * 4);
  }

  paint(x, y, colour) {
    const at = (y * this.resolution + x) * 4;
    this.pixels[at] = colour[0];
    this.pixels[at + 1] = colour[1];
    this.pixels[at + 2] = colour[2];
    this.pixels[at + 3] = 255;
  }

  fill(colour, covers) {
    const n = this.resolution;

    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (covers((x + 0.5) / n, (y + 0.5) / n)) this.paint(x, y, colour);
      }
    }
  }

  roundedSquare(radius, colour) {
    this.fill(colour, (u, v) => {
      const dx = Math.max(radius - u, u - (1 - radius), 0);
      const dy = Math.max(radius - v, v - (1 - radius), 0);
      return dx * dx + dy * dy <= radius * radius;
    });
  }

  ring(cx, cy, outer, thickness, colour) {
    const inner = outer - thickness;

    this.fill(colour, (u, v) => {
      const distance = Math.hypot(u - cx, v - cy);
      return distance <= outer && distance >= inner;
    });
  }

  capsule(x0, y0, x1, y1, radius, colour) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const lengthSquared = dx * dx + dy * dy;

    this.fill(colour, (u, v) => {
      const t =
        lengthSquared === 0
          ? 0
          : Math.max(
              0,
              Math.min(1, ((u - x0) * dx + (v - y0) * dy) / lengthSquared),
            );

      return Math.hypot(u - (x0 + t * dx), v - (y0 + t * dy)) <= radius;
    });
  }

  downsample(size) {
    const factor = this.resolution / size;
    const out = new Uint8Array(size * size * 4);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;

        for (let sy = 0; sy < factor; sy++) {
          for (let sx = 0; sx < factor; sx++) {
            const at =
              ((y * factor + sy) * this.resolution + (x * factor + sx)) * 4;
            const alpha = this.pixels[at + 3] / 255;
            r += this.pixels[at] * alpha;
            g += this.pixels[at + 1] * alpha;
            b += this.pixels[at + 2] * alpha;
            a += alpha;
          }
        }

        const samples = factor * factor;
        const to = (y * size + x) * 4;
        out[to] = a === 0 ? 0 : Math.round(r / a);
        out[to + 1] = a === 0 ? 0 : Math.round(g / a);
        out[to + 2] = a === 0 ? 0 : Math.round(b / a);
        out[to + 3] = Math.round((a / samples) * 255);
      }
    }

    return out;
  }
}

// A magnifier over a list: the two things the extension does, and nothing
// resembling Firebase's own mark or palette.
function drawIcon(size) {
  const supersample = size <= 16 ? 16 : 8;
  const canvas = new Canvas(size * supersample);

  canvas.roundedSquare(0.22, SLATE);

  if (size > 16) {
    for (const y of [0.29, 0.43, 0.57]) {
      canvas.capsule(0.19, y, 0.6, y, 0.042, MUTED);
    }

    canvas.ring(0.6, 0.57, 0.235, 0.072, TEAL);
    canvas.capsule(0.755, 0.725, 0.865, 0.835, 0.046, TEAL);
  } else {
    canvas.ring(0.45, 0.43, 0.3, 0.11, TEAL);
    canvas.capsule(0.66, 0.64, 0.85, 0.83, 0.075, TEAL);
  }

  return encodePNG(size, canvas.downsample(size));
}

mkdirSync("public/icons", { recursive: true });

for (const size of [16, 48, 128]) {
  const png = drawIcon(size);
  writeFileSync(`public/icons/icon${size}.png`, png);
  console.log(`icon${size}.png — ${png.length} bytes`);
}
