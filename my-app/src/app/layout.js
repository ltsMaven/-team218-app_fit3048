import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.SITE_URL ||
  "http://localhost:3000";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ability to Thrive | Counselling, Coaching & NDIS Support",
    template: "%s | Ability to Thrive",
  },
  description:
    "Ability to Thrive offers counselling, life coaching, clinical supervision, and NDIS support to help clients navigate life with confidence and care.",
  keywords: [
    "Ability to Thrive",
    "counselling",
    "life coaching",
    "NDIS support",
    "clinical supervision",
    "online counselling",
    "mental health support",
  ],
  authors: [{ name: "Ability to Thrive" }],
  creator: "Ability to Thrive",
  publisher: "Ability to Thrive",
  category: "health",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteUrl,
    siteName: "Ability to Thrive",
    title: "Ability to Thrive | Counselling, Coaching & NDIS Support",
    description:
      "Compassionate counselling, coaching, clinical supervision, and NDIS support designed to help clients build resilience and wellbeing.",
    images: [
      {
        url: "/assets/abilityToThriveLogo.webp",
        width: 1200,
        height: 630,
        alt: "Ability to Thrive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ability to Thrive | Counselling, Coaching & NDIS Support",
    description:
      "Compassionate counselling, coaching, clinical supervision, and NDIS support designed to help clients build resilience and wellbeing.",
    images: ["/assets/abilityToThriveLogo.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
