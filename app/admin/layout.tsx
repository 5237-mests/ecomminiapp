'use client';
import '../../app/globals.css';
// import Footer from "@/components/Footer";

interface RootLayoutProps {
  children: React.ReactNode;
}
function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head></head>
        <body>
          {children}
          {/* <Footer /> */}
        </body>
      </html>
    </>
  );
}
export default RootLayout;
