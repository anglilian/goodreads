import type { Metadata } from "next";
import { Merriweather, Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ subsets: ["latin"], weight: "300" });
const merriweather = Merriweather({ subsets: ["latin"], weight: "300" });

export const metadata: Metadata = {
  title: "Goodreads Wrapped",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
  );
}
