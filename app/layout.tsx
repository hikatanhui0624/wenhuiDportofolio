import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://your-name-design-portfolio-demo.hikatanhui0624.chatgpt.site'),
  title: 'Your Name — Design Portfolio',
  description: 'A multidisciplinary design portfolio across research, visual systems, and illustration.',
  openGraph: {
    title: 'Your Name — Design Portfolio',
    description: 'Selected work across research, visual systems, and illustration.',
    images: [{ url: 'https://your-name-design-portfolio-demo.hikatanhui0624.chatgpt.site/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Name — Design Portfolio',
    description: 'Selected work across research, visual systems, and illustration.',
    images: ['https://your-name-design-portfolio-demo.hikatanhui0624.chatgpt.site/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
