export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function ogTemplate({ eyebrow, title }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px",
        backgroundColor: "#0d0821",
        backgroundImage:
          "linear-gradient(135deg, #1a0d3d 0%, #150c33 45%, #0d0821 100%)",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundImage: "linear-gradient(115deg, #6d28d9 0%, #4f46e5 55%, #2563eb 100%)",
            color: "#fff",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          S3
        </div>
        <div style={{ display: "flex", fontSize: 28, fontWeight: 600, color: "#e9e5ff" }}>
          SchoolApp 360
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
        {eyebrow ? (
          <div style={{ display: "flex", fontSize: 26, fontWeight: 600, color: "#ab9aff", marginBottom: 16 }}>
            {eyebrow}
          </div>
        ) : null}
        <div style={{ display: "flex", fontSize: 60, fontWeight: 700, lineHeight: 1.15 }}>{title}</div>
      </div>
    </div>
  );
}
