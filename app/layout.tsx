import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tracksatscale.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PickPoynt - Decisions made simple",
    template: "%s | PickPoynt"
  },
  description: "Make informed purchasing decisions with PickPoynt's comprehensive product reviews, buying guides, and consumer insights. Decisions made simple.",
  keywords: ["tracking", "analytics", "productivity", "growth", "scaling", "business", "insights"],
  authors: [{ name: "PickPoynt Team" }],
  creator: "PickPoynt",
  publisher: "PickPoynt",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'PickPoynt',
    title: 'PickPoynt - Decisions made simple',
    description: "Make informed purchasing decisions with PickPoynt's comprehensive product reviews and buying guides.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PickPoynt',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrackScale Blog - Track Your Success at Scale',
    description: 'Discover insights, tips, and strategies to track and scale your success.',
    images: ['/og-image.png'],
    creator: '@trackscale',
  },
  verification: {
    google: "IH5cbk_KMXHppDi6kniuT3Q_zQdvrIVEBW_qWkyDPWw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
