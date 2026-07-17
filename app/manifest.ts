import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GreenChain AI — Farm Advisor for Bhutan",
    short_name: "GreenChain AI",
    description:
      "AI-powered crop selection, plant disease diagnosis, and soil health management for Bhutanese farmers.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f5ef",
    theme_color: "#0f3826",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
