"use client";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";
// import { Providers } from "./providers";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "@/context/FavoriteContext";
import Script from "next/script";

interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <FavoritesProvider>
              <CartProvider>
                {children}
                <Footer />
              </CartProvider>
            </FavoritesProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
