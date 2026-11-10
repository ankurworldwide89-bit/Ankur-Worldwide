import { ImageResponse } from "next/og";

export const alt = "Ankur Worldwide — From one shop counter to the world.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Built once at build time. Uses the same wordmark treatment as components/Logo.tsx.
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "#120d0b",
          color: "#f4ecdf",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 10 }}>
          <span style={{ fontWeight: 700 }}>ANKUR</span>
          <span style={{ marginLeft: 20, opacity: 0.8 }}>WORLDWIDE</span>
        </div>
        <div style={{ display: "flex", fontSize: 92, lineHeight: 1.05, maxWidth: 900 }}>
          From one shop counter to the world.
        </div>
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 6, color: "#e2b25c" }}>
          IMPORT · EXPORT · GUJARAT, INDIA
        </div>
      </div>
    ),
    size,
  );
}
