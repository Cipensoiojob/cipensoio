import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { SITE_URL } from "@/lib/types";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CiPensoIo — Trova il lavoro o la persona giusta vicino a te",
    template: "%s | CiPensoIo",
  },
  description:
    "Portale gratuito per badanti, colf, babysitter, pet & home care e offerte di lavoro di nicchia. Vicino a casa tua.",
  keywords: [
    "badante",
    "colf",
    "babysitter",
    "dog sitter",
    "lavoro vicino a me",
    "offerte di lavoro",
    "assistenza anziani",
    "CiPensoIo",
  ],
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: SITE_URL,
    siteName: "CiPensoIo",
    title: "CiPensoIo — Vicino a casa tua",
    description:
      "Trova il lavoro o la persona giusta per te, vicino a casa tua.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "nuSff8QVYBLQA1QL90MSurzKFD3x4IQR_Fq1B8B3SgE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${dmSans.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-foreground">
        <AnalyticsProvider />
        {children}
      </body>
    </html>
  );
}
