import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import { ExitIntentProvider } from "@/components/ExitIntentProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "House31 - Viral News, AI, and Military Content",
  description: "Watch viral videos and stories on war tech, AI, conspiracy, and power. The truth is louder here.",
  keywords: ["viral news", "AI technology", "military tech", "conspiracy", "trending videos", "breaking news"],
  authors: [{ name: "House31" }],
  creator: "House31",
  publisher: "House31",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://house31.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://house31.com',
    title: 'House31 - Viral News, AI, and Military Content',
    description: 'Watch viral videos and stories on war tech, AI, conspiracy, and power. The truth is louder here.',
    siteName: 'House31',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'House31 - Viral News and Content',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House31 - Viral News, AI, and Military Content',
    description: 'Watch viral videos and stories on war tech, AI, conspiracy, and power. The truth is louder here.',
    images: ['/og-image.jpg'],
    creator: '@house31',
  },
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
  verification: {
    google: 'google-site-verification-code-here',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#18181b" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        
        {/* Font preloading for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap"
        />
        
        {/* DNS prefetching for external resources */}
        <link rel="dns-prefetch" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Resource hints for better performance */}
        <link rel="preconnect" href="https://picsum.photos" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "House31",
              "description": "Watch viral videos and stories on war tech, AI, conspiracy, and power. The truth is louder here.",
              "url": "https://house31.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://house31.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        {process.env.NEXT_PUBLIC_GA_TRACKING_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="house31-ui-theme"
        >
          <AnalyticsProvider>
            <ExitIntentProvider enabled={process.env.NODE_ENV === 'production'}>
              {children}
            </ExitIntentProvider>
          </AnalyticsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
