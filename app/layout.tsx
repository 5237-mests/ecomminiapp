'use client';
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";
// import { Providers } from "./providers";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "@/context/FavoriteContext";
import useTelegram from "@/hooks/useTelegram";
// import img from "./assets/img.png";

interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  // useEffect(() => {
  //   WebApp.BackButton.hide();
  // })
  useTelegram();
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head >
        {/* <script src="https://telegram.org/js/telegram-web-app.js"></script> */}
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
