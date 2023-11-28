import { expect, test } from "vitest";
import makeMonochromePng from ".";
import Sharp from "sharp";

test("should produce a valid png", async () => {
  const png = await makeMonochromePng([
    [true, false, true, false, true],
    [false, true, false, true, false],
    [true, false, true, false, true],
    [false, true, false, true, false],
    [true, false, true, false, true],
  ]);

  const sharp = Sharp(png);
  const metadata = await sharp.metadata();

  expect(metadata.width).toBe(5);
  expect(metadata.height).toBe(5);
  expect(metadata.format).toBe("png");
  expect(metadata.channels).toBe(1);
  expect(metadata.hasAlpha).toBe(false);
  expect(metadata.space).toBe("b-w");

  // write the png to disk for manual inspection
  await sharp.toFile("test1.png");
});

test("should produce big images too", async () => {
  const png = await makeMonochromePng(
    new Array(1000).fill(new Array(1000).fill(true))
  );

  const sharp = Sharp(png);
  const metadata = await sharp.metadata();

  expect(metadata.width).toBe(1000);
  expect(metadata.height).toBe(1000);
  expect(metadata.format).toBe("png");
  expect(metadata.channels).toBe(1);
  expect(metadata.hasAlpha).toBe(false);
  expect(metadata.space).toBe("b-w");

  // write the png to disk for manual inspection
  await sharp.toFile("test2.png");
});
