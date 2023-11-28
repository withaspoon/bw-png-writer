export function uint8s(args: number[] | number | ArrayBuffer): Uint8Array {
  // @ts-ignore
  return new Uint8Array(args);
}

export function encode32(n: number): Uint8Array {
  return uint8s([
    (n >> 24) & 0xff,
    (n >> 16) & 0xff,
    (n >> 8) & 0xff,
    n & 0xff,
  ]);
}
