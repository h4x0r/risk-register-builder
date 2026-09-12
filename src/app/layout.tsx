import type { Metadata } from "next";
import { Newsreader, IBM_Plex_Sans, IBM_Plex_Mono, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

/**
 * A register is a document, so the headings are set in a text face rather than a UI
 * sans. Newsreader carries that without tipping into pastiche.
 */
const display = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/** Plex is engineered for dense interface text and holds up at the sizes tables need. */
const body = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/** Scores, coordinates and formulas. Data should look like data. */
const monoData = IBM_Plex_Mono({
  variable: "--font-mono-data",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/**
 * Traditional Chinese, which none of the faces above cover. Without this the zh-TW
 * half of a bilingual tool renders in whatever the OS happens to substitute — the
 * kind of detail that reads as unfinished to the audience that actually uses it.
 * Google serves CJK in unicode-range slices, so only the glyphs in use are fetched.
 */
const cjk = Noto_Sans_TC({
  variable: "--font-cjk",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "風險登記冊建置工具 | Risk Register Builder",
  description: "A web-based tool for building risk registers based on TVRA methodology",
  icons: {
    icon: "/hkios-logo.png",
    apple: "/hkios-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body
        className={`${display.variable} ${body.variable} ${monoData.variable} ${cjk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
