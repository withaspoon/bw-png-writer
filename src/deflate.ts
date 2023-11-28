import { uint8s } from "./encoder";

export async function deflate(data: Uint8Array): Promise<Uint8Array> {
  const stream = new CompressionStream("deflate");
  const writer = stream.writable.getWriter();
  writer.write(Buffer.from(data));
  writer.close();
  return uint8s(await new Response(stream.readable).arrayBuffer());
}
