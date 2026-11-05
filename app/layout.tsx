import type { Metadata } from 'next';
import { DM_Sans, Syne } from 'next/font/google';
import './globals.css';
import './obscura.css';
import './archive.css';
import './admin.css';
import PageTransitionProvider from '@/components/PageTransitionProvider';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm' });

export const metadata: Metadata = {
  title: 'Yuki — Movement in form',
  description: 'Dancer, model, producer, and fashion consultant based in Jakarta.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${syne.variable} ${dmSans.variable}`}><PageTransitionProvider>{children}</PageTransitionProvider></body></html>;
}
