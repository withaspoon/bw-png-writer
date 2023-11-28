import { encode32, uint8s } from "./encoder";

let n = 256;
const crcTable = uint8s(n);
while (n--) {
  let c = n;
  let k = 8;
  while (k--) {
    crcTable[n] = c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
}

export function crc32(data: Uint8Array): Uint8Array {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = crcTable[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }

  crc ^= 0xffffffff;
  return encode32(crc);
}
