import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

export const alt = "Harbor painting by Yoshida Hiroshi";
// Matches the painting's 3000×2044 aspect ratio so nothing is cropped or padded.
export const size = { width: 1200, height: 818 };
export const contentType = "image/jpeg";

export default async function Image() {
  const painting = await sharp(await readFile(
    join(process.cwd(), "public/media/yoshida_hiroshi-paper-q98.webp"),
  )).resize(size.width, size.height, { fit: "cover" }).jpeg({ quality: 90 }).toBuffer();

  return new Response(new Uint8Array(painting), {
    headers: { "Content-Type": contentType },
  });
}
