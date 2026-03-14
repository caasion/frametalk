import type { Metadata } from "next";
import { Sora, Fraunces } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FrameTalk",
  description: "See it, say it, master it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${fraunces.variable} app-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
