export function encode32(n: number): Uint8Array {
  return new Uint8Array([
    (n >> 24) & 0xff,
    (n >> 16) & 0xff,
    (n >> 8) & 0xff,
    n & 0xff,
  ]);
}
