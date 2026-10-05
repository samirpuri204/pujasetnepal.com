import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Sans,
  JetBrains_Mono,
  Noto_Sans_Devanagari,
} from "next/font/google";
import "./globals.css";

/**
 * Type pairing: IBM Plex Sans for prose, JetBrains Mono for labels, metadata
 * and code. Chosen over the more common Inter/Geist default because this is a
 * tool with status, counters and identifiers all over it, and a mono face gives
 * those a distinct voice instead of flattening everything into one sans.
 *
 * Noto Sans Devanagari is not decorative. IBM Plex Sans ships no Devanagari
 * glyphs, so without a dedicated face the browser substitutes whatever the
 * operating system happens to have — and the same Nepali sentence then looks
 * different on macOS, Windows and Android, at inconsistent sizes. For a
 * Nepali-first model that is a correctness problem, not a taste one.
 */
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono-jb",
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-deva",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jaynepal 1.1 — Nepali AI chat",
  description:
    "Chat with Jaynepal 1.1, a Nepali language model made in Nepal by Samir Puri. Ask in Nepali, Romanised Nepali, or English.",
  applicationName: "Jaynepal",
  authors: [{ name: "Samir Puri", url: "https://samirpuri.com.np" }],
  openGraph: {
    title: "Jaynepal 1.1 — Nepali AI chat",
    description:
      "A Nepali language model made in Nepal. Ask in Nepali, Romanised Nepali, or English.",
    url: "https://samirpuri.com.np",
    siteName: "Jaynepal 1.1",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Never disable zoom: blocking it fails WCAG 1.4.4 and is the single most
  // common viewport mistake in generated layouts.
  maximumScale: 5,
  themeColor: "#0B1017",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plex.variable} ${mono.variable} ${devanagari.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
