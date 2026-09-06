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
  title: '文慧 — Design Portfolio',
  description: '文慧的设计作品集：研究、视觉系统与插画创作。',
  openGraph: {
    title: 'Welcome to 文慧’s Portfolio',
    description: 'Ideas Made Visible — design, research and illustration.',
    images: [{ url: 'https://your-name-design-portfolio-demo.hikatanhui0624.chatgpt.site/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Welcome to 文慧’s Portfolio',
    description: 'Ideas Made Visible — design, research and illustration.',
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
