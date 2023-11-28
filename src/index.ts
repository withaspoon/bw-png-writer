import { chunk } from "./chunk";
import { deflate } from "./deflate";
import { encode32, uint8s } from "./encoder";

export default async function makeMonochromePng(data: boolean[][]) {
  const width = data[0].length;
  const height = data.length;

  const buffers: Uint8Array[] = [
    // PNG signature
    uint8s([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  ];

  const append = (b: Uint8Array[]) => buffers.push(...b);

  append(
    chunk(
      "IHDR",
      uint8s([
        ...encode32(width),
        ...encode32(height),
        1, // bit depth
        0, // color type
        0, // deflate
        0, // adaptive
        0, // no interlace
      ])
    )
  );

  const scanlineWidth = Math.ceil(width / 8) + 1;
  const img = uint8s(scanlineWidth * height);

  let offset = 0;
  function writeScanline(scanline: Uint8Array) {
    offset++;
    img.set(scanline, offset);
    offset += scanline.length;
  }

  for (let y = 0; y < height; y++) {
    const scanline = uint8s(scanlineWidth - 1);
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
  append(chunk("IEND", uint8s([])));

  return uint8s(buffers.flatMap((b) => [...b]));
}
