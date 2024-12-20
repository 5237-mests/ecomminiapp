'use client';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import Footer from '@/components/Footer';
// import { Providers } from "./providers";
import { CartProvider } from '../context/CartContext';
import { FavoritesProvider } from '@/context/FavoriteContext';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
// import useTelegram from "@/hooks/useTelegram";
import { useEffect } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk';

interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    try {
      const { initDataRaw } = retrieveLaunchParams();
      localStorage.setItem('initData', JSON.stringify(initDataRaw));
    } catch (error) {
      console.error('Error retrieving launch params:', error);
      localStorage.removeItem('initData');
    }
  }, []);

  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/android-chrome-192x192.png" />
          <link rel="icon" href="/favicon.ico" />
          <title>FUN SHOP</title>
          <Script
            src="https://telegram.org/js/telegram-web-app.js"
            strategy="beforeInteractive"
          />
        </head>
        <body>
          <ThemeProvider>
            <FavoritesProvider>
              <CartProvider>
                {children}
                {!isAdminRoute && <Footer />}
              </CartProvider>
            </FavoritesProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
