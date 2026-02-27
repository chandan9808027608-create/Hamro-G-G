import type {Metadata} from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StickyBottomBar } from '@/components/layout/StickyBottomBar';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Hamro G&G auto enterprises - Best Second Hand Bikes in Kathmandu',
  description: 'Hamro G&G auto enterprises provides reliable, inspected, and fairly priced second-hand two-wheelers in Kathmandu, Nepal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pb-16 md:pb-0">
          {children}
        </main>
        <Footer />
        <StickyBottomBar />
        <Toaster />
      </body>
    </html>
  );
}
