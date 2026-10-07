import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Sans,
  JetBrains_Mono,
  Noto_Sans_Devanagari,
} from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Type pairing: IBM Plex Sans for prose, JetBrains Mono for labels, metadata
 * and code. Chosen over the more common Inter/Geist default because this is a
 * technical page with identifiers, endpoints and parameters all over it, and a
 * mono face gives those a distinct voice instead of flattening everything into
 * one sans.
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
  // metadataBase makes every relative OG/canonical URL absolute. Without it,
  // Next warns and social crawlers receive paths they cannot resolve.
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.creator.name, url: site.links.creator }],
  creator: site.creator.name,
  keywords: [
    "Jaynepal 1.1",
    "Nepali language model",
    "Nepali AI",
    "Nepal",
    "Devanagari",
    "Romanised Nepali",
    "LLM",
    "OpenAI-compatible API",
    "hosted inference",
    "Puja Set Nepal",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
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
