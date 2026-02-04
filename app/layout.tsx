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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.decorpoynt.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "decorPoynt - Modern Home Decor & Interior Design Inspiration",
    template: "%s | decorPoynt"
  },
  alternates: {
    canonical: './',
  },
  description: "Transform your living space with decorPoynt. Discover modern home decor ideas, interior design tips, and DIY styling guides for every room.",
  keywords: ["home decor", "interior design", "modern furniture", "lighting ideas", "room styling", "DIY decor"],
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
    siteName: 'decorPoynt',
    title: 'decorPoynt - Modern Home Decor & Interior Design Inspiration',
    description: "Transform your living space with decorPoynt. Discover modern home decor ideas and room styling guides.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'decorPoynt',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'decorPoynt - Modern Home Decor & Interior Design Inspiration',
    description: 'Transform your living space with decorPoynt. Discover modern home decor ideas and room styling guides.',
    images: ['/og-image.png'],
    creator: '@decorpoynt',
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
