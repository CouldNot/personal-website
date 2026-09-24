import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

export const alt = "Dale Dai — personal website with a harbor painting";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const painting = await sharp(await readFile(
    join(process.cwd(), "public/media/yoshida_hiroshi-paper-q98.webp"),
  )).resize(760, 518, { fit: "contain" }).png().toBuffer();

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "100%",
        padding: 44,
        gap: 44,
        background: "#f3f1e8",
        color: "#111",
        fontFamily: "monospace",
      }}
    >
      {/* Keep the full painting visible in social cards, without cropping it. */}
      <img
        src={`data:image/png;base64,${painting.toString("base64")}`}
        alt=""
        width={760}
        height={518}
        style={{ objectFit: "contain" }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          flex: 1,
          minWidth: 0,
          height: "100%",
        }}
      >
        <div style={{ fontSize: 52, lineHeight: 1.1 }}>Dale Dai</div>
        <div style={{ fontSize: 22, lineHeight: 1.4, marginTop: 28 }}>
          Building software for many different reasons.
        </div>
        <div style={{ fontSize: 18, marginTop: 48 }}>daled.ai</div>
      </div>
    </div>,
    size,
  );
}
