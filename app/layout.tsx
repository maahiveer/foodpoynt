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
    default: "PickPoynt - Delicious Recipes & Culinary Inspiration",
    template: "%s | PickPoynt"
  },
  alternates: {
    canonical: './',
  },
  description: "Your go-to source for delicious recipes, cooking tips, and culinary inspiration. From quick weeknight dinners to gourmet delights.",
  keywords: ["recipes", "cooking", "food blog", "culinary", "cooking tips", "meal ideas"],
  authors: [{ name: "Devika Nanda" }],
  creator: "Devika Nanda",
  publisher: "Devika Nanda",
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
    title: 'PickPoynt - Delicious Recipes & Culinary Inspiration',
    description: "Your go-to source for delicious recipes, cooking tips, and culinary inspiration.",
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
    title: 'PickPoynt - Delicious Recipes & Cooking Tips',
    description: 'Discover amazing recipes and cooking inspiration. From quick meals to gourmet dishes, find your next favorite recipe.',
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

import { CookieConsent } from "@/components/CookieConsent";

import { AdScripts } from "@/components/AdScripts";

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
          <CookieConsent />
        </AuthProvider>

        <AdScripts />
      </body>
    </html>
  );
}
