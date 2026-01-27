import type { Metadata } from "next";
import "./globals.css";
import CookieConsent from "../components/CookieConsent";
import AuthProvider from "../components/AuthProvider";

export const metadata: Metadata = {
  title: "Royal Lips - Joanna Wielgos",
  description:
    "Profesjonalny makijaż permanentny brwi, ust i kresek w Krośnie. Naturalne efekty i bezpieczeństwo na pierwszym miejscu.",
  keywords: "makijaż permanentny, microblading, brwi, usta, kreski, Krosno",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>
        <AuthProvider>{children}</AuthProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
