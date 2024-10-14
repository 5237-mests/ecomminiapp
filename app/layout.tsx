"use client";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Footer from "@/components/Footer";
// import { Providers } from "./providers";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "@/context/FavoriteContext";
import Script from "next/script";
import { usePathname } from "next/navigation";
// import useTelegram from "@/hooks/useTelegram";

interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head>
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
