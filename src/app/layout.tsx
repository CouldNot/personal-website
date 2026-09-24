import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const monaspaceXenon = localFont({
  src: "./fonts/MonaspaceXenonFrozen-Regular.ttf",
  variable: "--font-monaspace-xenon",
  display: "swap",
  weight: "400",
});

const description =
  "Dale Dai is a computer science student at USC, making software in many different places.";

export const metadata: Metadata = {
  metadataBase: new URL("https://daled.ai"),
  title: "Dale Dai",
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Dale Dai",
    description,
    url: "/",
    siteName: "Dale Dai",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dale Dai",
    description,
    images: [
      {
        url: "/opengraph-image",
        alt: "Dale Dai's personal website with a harbor painting",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={monaspaceXenon.variable}>
      <body>{children}</body>
    </html>
  );
}
