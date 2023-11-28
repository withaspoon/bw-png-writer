import { crc32 } from "./crc32";
import { encode32, uint8s } from "./encoder";

export function chunk(type: string, data: Uint8Array) {
  const buffer = uint8s(type.length + data.length);

  // write the name
  buffer.set(new TextEncoder().encode(type));

  // write the data
  if (data) {
    buffer.set(data, 4);
  }

  return [encode32(data.length), buffer, crc32(buffer)];
}
