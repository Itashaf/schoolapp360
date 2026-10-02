import { ImageResponse } from "next/og";
import { ogTemplate, ogSize, ogContentType } from "@/lib/og";

export const alt = "SchoolApp 360 — Launching soon";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return new ImageResponse(
    ogTemplate({
      eyebrow: "Launching soon",
      title: "Early access for a limited number of schools.",
    }),
    { ...size }
  );
}
