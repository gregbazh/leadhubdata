import { ImageResponse } from "next/og";

export const alt = "LeadHubData public-record business lead lists";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #ffffff 0%, #edf4ff 100%)",
          color: "#0a0a0a",
          padding: "72px 82px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#0055ff",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 900,
            }}
          >
            L
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 900, letterSpacing: -1 }}>
            LEADHUB<span style={{ color: "#0055ff" }}>DATA</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 940 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 78,
              lineHeight: 0.98,
              letterSpacing: -4,
              fontWeight: 900,
            }}
          >
            <span>Florida public records,</span>
            <span>ready to use.</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 29, lineHeight: 1.35, color: "#3e4c63" }}>
            Documented sources. Practical CSV files. Clear limitations.
          </div>
        </div>
        <div style={{ display: "flex", gap: 18, fontSize: 21, color: "#0055ff", fontWeight: 700 }}>
          Contractor licenses <span style={{ color: "#9aa6b8" }}>•</span> New food businesses
          <span style={{ color: "#9aa6b8" }}>•</span> Updated methodology
        </div>
      </div>
    ),
    size,
  );
}
