import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dale Dai",
    short_name: "Dale Dai",
    description: "Personal site of Dale Dai.",
    start_url: "/",
    display: "standalone",
    background_color: "#fefef4",
    theme_color: "#fefef4",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
