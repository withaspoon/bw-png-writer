import { chunk } from "./chunk";
import { deflate } from "./deflate";
import { encode32 } from "./encoder";

export async function makeMonochromePng(data: boolean[][]) {
  const width = data[0].length;
  const height = data.length;

  const buffers: Uint8Array[] = [
    // PNG signature
    new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  ];

  const append = (b: Uint8Array[]) => buffers.push(...b);

  const bitDepth = 1;
  const colorType = 0; // grayscale
  const compressionMethod = 0; // deflate
  const filterMethod = 0; // adaptive
  const interlaceMethod = 0; // none

  append(
    chunk(
      "IHDR",
      new Uint8Array([
        ...encode32(width),
        ...encode32(height),
        bitDepth,
        colorType,
        compressionMethod,
        filterMethod,
        interlaceMethod,
      ])
    )
  );

  const scanlineWidth = Math.ceil(width / 8) + 1;
  const img = new Uint8Array(scanlineWidth * height);

  let offset = 0;
  function writeScanline(scanline: Uint8Array) {
    offset++;
    img.set(scanline, offset);
    offset += scanline.length;
  }

  for (let y = 0; y < height; y++) {
    const scanline = new Uint8Array(scanlineWidth - 1);
    for (let x = 0; x < width; x++) {
      const byte = Math.floor(x / 8);
      const bit = x % 8;
      if (data[y][x]) {
        scanline[byte] |= 1 << (7 - bit);
      }
    }
    writeScanline(scanline);
  }

  append(chunk("IDAT", await deflate(img)));
  append(chunk("IEND", new Uint8Array([])));

  return new Uint8Array(buffers.flatMap((b) => [...b]));
}
