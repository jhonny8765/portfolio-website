import { ImageResponse } from "next/og";
import { SITE } from "@/lib/content";

export const alt = `${SITE.name} — ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #090a0f 0%, #0d0a1a 55%, #12061f 100%)",
          padding: "72px 84px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            display: "flex",
          }}
        />
        {/* glow */}
        <div
          style={{
            position: "absolute",
            top: -220,
            right: -160,
            width: 720,
            height: 720,
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(109,40,217,0.5), transparent)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#6d28d9",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            JC
          </div>
          <div
            style={{
              color: "#a1a1aa",
              fontSize: 24,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ color: "#f4f5f7", fontWeight: 600 }}>
              {SITE.name}
            </span>
            <span style={{ fontSize: 18, color: "#8b8b96" }}>
              github.com/{SITE.handle}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              color: "#a78bfa",
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            {SITE.role}
          </div>
          <div
            style={{
              color: "#f4f5f7",
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -2,
              display: "flex",
              maxWidth: 900,
            }}
          >
            I build with AI — websites, apps &amp; automations.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 26,
            color: "#8b8b96",
            fontSize: 22,
          }}
        >
          <span style={{ color: "#34d399", display: "flex", alignItems: "center", gap: 10 }}>
            ● 2 live products
          </span>
          <span>sukisuite.app</span>
          <span>barangay-arena.app</span>
          <span style={{ marginLeft: "auto", color: "#c4b5fd" }}>
            jhonreyconsolacion.vercel.app
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
