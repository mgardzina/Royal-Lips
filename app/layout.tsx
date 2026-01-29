import type { Metadata, Viewport } from "next";
import "./globals.css";
import CookieConsent from "../components/CookieConsent";
import GoogleAnalytics from "../components/GoogleAnalytics";
import AuthProvider from "../components/AuthProvider";
import JsonLd from "../components/JsonLd";

const siteUrl = "https://royal-lips.pl";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4A4540",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Royal Lips - Makijaż Permanentny Krosno | Joanna Wielgos",
    template: "%s | Royal Lips Krosno",
  },
  description:
    "Profesjonalny makijaż permanentny brwi, ust i kresek w Krośnie. Zabiegi kwasem hialuronowym i depilacja laserowa. Naturalne efekty i bezpieczeństwo na pierwszym miejscu. Umów wizytę już dziś!",
  keywords: [
    "makijaż permanentny Krosno",
    "microblading Krosno",
    "brwi permanentne",
    "usta permanentne",
    "kreski permanentne",
    "kwas hialuronowy Krosno",
    "depilacja laserowa Krosno",
    "salon kosmetyczny Krosno",
    "Royal Lips",
    "Joanna Wielgos",
    "makijaż permanentny Podkarpacie",
    "beauty salon Krosno",
  ],
  authors: [{ name: "Royal Lips - Joanna Wielgos" }],
  creator: "Royal Lips",
  publisher: "Royal Lips",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: siteUrl,
    siteName: "Royal Lips - Joanna Wielgos",
    title: "Royal Lips - Makijaż Permanentny Krosno",
    description:
      "Profesjonalny makijaż permanentny brwi, ust i kresek w Krośnie. Zabiegi kwasem hialuronowym i depilacja laserowa. Umów wizytę już dziś!",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Royal Lips Beauty Salon Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Lips - Makijaż Permanentny Krosno",
    description:
      "Profesjonalny makijaż permanentny brwi, ust i kresek w Krośnie. Zabiegi kwasem hialuronowym i depilacja laserowa.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  category: "beauty",
  verification: {
    // Możesz dodać weryfikację Google Search Console tutaj
    // google: "twój-kod-weryfikacyjny",
  },
  other: {
    "geo.region": "PL-18",
    "geo.placename": "Krosno",
    "geo.position": "49.6886;21.7703",
    ICBM: "49.6886, 21.7703",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <head>
        <GoogleAnalytics />
        <JsonLd />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
