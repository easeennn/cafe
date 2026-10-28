import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const display = localFont({ src: '../fonts/display.woff2', variable: '--font-display', weight: '800', display: 'swap' });
const body = localFont({ src: '../fonts/body.woff2', variable: '--font-body', weight: '500', display: 'swap' });
const mono = localFont({ src: '../fonts/mono.woff2', variable: '--font-mono', weight: '400', display: 'swap' });
const script = localFont({ src: '../fonts/script.woff2', variable: '--font-script', weight: '400', display: 'swap' });

export const viewport: Viewport = { themeColor: '#07121e', width: 'device-width', initialScale: 1 };
export const metadata: Metadata = {
  title: 'Iceland Coffee — Specialty Coffee House',
  description: 'Coffee for your moment. Small-batch roasts, daily favorites and order-ahead pickup.',
  openGraph: { title: 'Iceland Coffee — Specialty Coffee House', description: 'Coffee for your moment.', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${script.variable}`}>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'CafeOrCoffeeShop', name: 'Iceland Coffee', servesCuisine: 'Coffee', openingHours: 'Mo-Su 07:00-21:00' }) }} />
      </body>
    </html>
  );
}
