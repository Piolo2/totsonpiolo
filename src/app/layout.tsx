import type { Metadata } from 'next';
import { Nunito, Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const nunito = Nunito({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TOTS on Piolo — Anonymous Messaging',
  description: 'Got something to tell me? Send anonymous messages to Piolo in a safe and friendly space ♡',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${nunito.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F7F7FC] text-[#17171C] font-sans antialiased selection:bg-[#DDE0FA] selection:text-[#17171C]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
