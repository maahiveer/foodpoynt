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
    default: "PickPoynt - Decisions made simple",
    template: "%s | PickPoynt"
  },
  description: "Make informed purchasing decisions with PickPoynt's comprehensive product reviews, buying guides, and consumer insights. Decisions made simple.",
  keywords: ["product reviews", "buying guides", "tech reviews", "consumer insights", "software reviews", "best tools", "comparisons"],
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
    title: 'PickPoynt - Decisions made simple',
    description: 'Make informed purchasing decisions with PickPoynt\'s comprehensive product reviews and buying guides.',
    images: ['/og-image.png'],
    creator: '@pickpoynt',
  },
  verification: {
    google: "IH5cbk_KMXHppDi6kniuT3Q_zQdvrIVEBW_qWkyDPWw",
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
      <head>
        <script id="aclib" type="text/javascript" src="//acscdn.com/script/aclib.js"></script>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              aclib.runAutoTag({
                  zoneId: '1hocwjdq4f',
              });
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(s){s.dataset.zone='10327495',s.src='https://groleegni.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`
          }}
        />

        <AuthProvider>
          {children}
        </AuthProvider>

      </body>
    </html>
  );
}
