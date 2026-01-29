import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin salonu Royal Lips. Zasady rezerwacji wizyt, przeciwwskazania do zabiegów makijażu permanentnego, informacje o płatnościach i reklamacjach.",
  alternates: {
    canonical: "https://royal-lips.pl/regulamin",
  },
  openGraph: {
    title: "Regulamin | Royal Lips Krosno",
    description:
      "Regulamin salonu Royal Lips - zasady korzystania z usług makijażu permanentnego.",
    url: "https://royal-lips.pl/regulamin",
  },
};

export default function RegulaminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
