import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const monaspaceXenon = localFont({
  src: "./fonts/MonaspaceXenonFrozen-Regular.ttf",
  variable: "--font-monaspace-xenon",
  display: "swap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Dale Dai",
  description: "An animated water scene.",
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
