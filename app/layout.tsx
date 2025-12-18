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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pickpoynt.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PickPoynt - Elevate Your Game",
    template: "%s | PickPoynt"
  },
  alternates: {
    canonical: './',
  },
  description: "Your go-to source for Pickleball insights, gear guides, and court-side stories. Honest advice for players, by players.",
  keywords: ["pickleball", "pickleball gear", "sports", "blog"],
  authors: [{ name: "Manish Kumar Jain" }],
  creator: "Manish Kumar Jain",
  publisher: "Manish Kumar Jain",
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
    title: 'PickPoynt - Elevate Your Game',
    description: "Your go-to source for Pickleball insights, gear guides, and court-side stories.",
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
    title: 'PickPoynt - Decisions made simple',
    description: 'Make informed purchasing decisions with PickPoynt\'s comprehensive product reviews and buying guides.',
    images: ['/og-image.png'],
    creator: '@pickpoynt',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
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
