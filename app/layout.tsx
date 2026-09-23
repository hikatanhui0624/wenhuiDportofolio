import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? 'https://hikatanhui0624.github.io/wenhuiDportofolio';

const geistSans = localFont({
  src: './fonts/geist-latin.woff2',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/geist-mono-latin.woff2',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const displaySerif = localFont({
  src: [
    { path: './fonts/cormorant-garamond-latin.woff2', weight: '400 600', style: 'normal' },
    { path: './fonts/cormorant-garamond-italic-latin.woff2', weight: '400 600', style: 'italic' },
  ],
  variable: '--font-display-serif',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '文慧 — Design Portfolio',
  description: '文慧的设计作品集：研究、视觉系统与插画创作。',
  openGraph: {
    title: 'Welcome to 文慧’s Portfolio',
    description: 'Ideas Made Visible — design, research and illustration.',
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Welcome to 文慧’s Portfolio',
    description: 'Ideas Made Visible — design, research and illustration.',
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} ${displaySerif.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
