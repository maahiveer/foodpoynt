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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.foodpoynt.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "foodPoynt - Culinary Adventures & Delicious Recipes",
    template: "%s | foodPoynt"
  },
  alternates: {
    canonical: './',
  },
  description: "Discover mouth-watering recipes, cooking tips, and culinary inspiration with foodPoynt. From comfort food to exotic drinks, elevate your kitchen skills today.",
  keywords: ["recipes", "cooking", "food", "drinks", "culinary", "baking", "cocktails", "classic dishes", "restaurant reviews"],
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
    siteName: 'foodPoynt',
    title: 'foodPoynt - Culinary Adventures & Delicious Recipes',
    description: "Discover mouth-watering recipes, cooking tips, and culinary inspiration with foodPoynt. From comfort food to exotic drinks, elevate your kitchen skills today.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'foodPoynt',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'foodPoynt - Culinary Adventures & Delicious Recipes',
    description: "Discover mouth-watering recipes, cooking tips, and culinary inspiration with foodPoynt.",
    images: ['/og-image.png'],
    creator: '@foodpoynt',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  verification: {
    other: {
      "p:domain_verify": "87e6d81db68e1b0059b9c64c96e18201",
    },
  },
};

import { CookieConsent } from "@/components/CookieConsent";

import { AdScripts } from "@/components/AdScripts";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

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
        <GoogleAnalytics />
      </body>
    </html>
  );
}
