import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingActionButton } from '@/components/ui/FloatingActionButton';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const viewport: Viewport = {
  themeColor: '#0b192c',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.hariompipes.com'),
  title: {
    default: 'Hariom Pipe Industries Limited | Integrated Steel & Pipe Manufacturer',
    template: '%s | Hariom Pipe Industries Limited',
  },
  description:
    'Hariom Pipe Industries Limited (NSE: HARIOMPIPE | BSE: 543517) is a leading integrated steel manufacturer producing HR Pipes, CR Pipes, GI Pipes, GP Tubes, Slit Coils, Scaffolding Systems & MS Billets with 7,01,237 MTPA annual capacity across 4 plant units.',
  keywords: [
    'Hariom Pipe Industries Limited',
    'Hariom Pipes',
    'Steel Pipe Manufacturer India',
    'HR Pipes IS 1161',
    'GI Pipes IS 1239',
    'GP Pipes IS 4923',
    'Scaffolding Systems IS 2750',
    'MS Billets IS 2830',
    'Mahabubnagar Steel Plant',
    'Hyderabad Steel HQ',
    'NSE HARIOMPIPE',
    'BSE 543517',
    'Industrial Steel Tubes India',
  ],
  authors: [{ name: 'Hariom Pipe Industries Limited', url: 'https://www.hariompipes.com' }],
  creator: 'Hariom Pipe Industries Limited',
  publisher: 'Hariom Pipe Industries Limited',
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
  alternates: {
    canonical: 'https://www.hariompipes.com',
  },
  openGraph: {
    title: 'Hariom Pipe Industries Limited | Engineered for Strength. Built for What’s Next.',
    description:
      'Leading integrated steel manufacturer in South India. Producing high-grade HR/CR/GI/GP pipes, scaffolding, and MS billets across 4 plants with 7.01 Lakh MTPA capacity.',
    url: 'https://www.hariompipes.com',
    siteName: 'Hariom Pipe Industries Limited',
    images: [
      {
        url: 'https://www.hariompipes.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hariom Pipe Industries Limited Manufacturing Facilities & Product Range',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hariom Pipe Industries Limited | Steel & Pipe Manufacturing',
    description: 'Premier integrated iron and steel manufacturer with 7,01,237 MTPA annual capacity (NSE: HARIOMPIPE | BSE: 543517).',
    images: ['https://www.hariompipes.com/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

// JSON-LD Structured Data Schema for Search Engines
const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'Corporation',
  name: 'Hariom Pipe Industries Limited',
  alternateName: 'Hariom Pipes',
  url: 'https://www.hariompipes.com',
  logo: 'https://www.hariompipes.com/logo.png',
  tickerSymbol: ['NSE: HARIOMPIPE', 'BSE: 543517'],
  description:
    'Hariom Pipe Industries Limited is a premier integrated steel manufacturer operating 4 plants in South India with an aggregate capacity of 7,01,237 MTPA.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3-6-290/16, 1st Floor, Himayatnagar',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500029',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-1800-XXX-XXXX',
    contactType: 'customer service',
    email: 'info@hariompipes.com',
    areaServed: 'IN',
    availableLanguage: ['en', 'hi', 'te'],
  },
  sameAs: [
    'https://www.nseindia.com/get-quotes/equity?symbol=HARIOMPIPE',
    'https://www.bseindia.com/stock-share-price/hariom-pipe-industries-ltd/hariompipe/543517/',
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <FloatingActionButton />
        <Footer />
      </body>
    </html>
  );
}
