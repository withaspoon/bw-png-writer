import { crc32 } from "./crc32";
import { encode32 } from "./encoder";

export function chunk(type: string, data: Uint8Array) {
  const buffer = new Uint8Array(type.length + data.length);

  // write the name
  buffer.set(new TextEncoder().encode(type));

  // write the data
  if (data) {
    buffer.set(data, 4);
  }

  return [
    encode32(data.length),
    new TextEncoder().encode(type),
    data,
    crc32(buffer),
  ];
}
