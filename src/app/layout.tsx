import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import styles from "./layout.module.css";

const caslon = localFont({
  src: [
    {
      path: "../../public/fonts/LibreCaslonCondensed-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/LibreCaslonCondensed-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/LibreCaslonCondensed-Medium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-caslon",
});

const grotesk = localFont({
  src: [
    {
      path: "../../public/fonts/OverusedGrotesk-Roman.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/OverusedGrotesk-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/OverusedGrotesk-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: "Dale Dai",
  description: "Description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${caslon.variable} ${grotesk.variable}`}>
      <body>
        <div className={styles.container}>{children}</div>
      </body>
    </html>
  );
}
