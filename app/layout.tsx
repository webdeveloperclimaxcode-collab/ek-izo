import type { Metadata } from "next";
import { Kantumruy_Pro } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { StripeProvider } from "@/contexts/StripeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import CartSidebar from "@/components/CartSidebar";

const kantumruyPro = Kantumruy_Pro({
  variable: "--font-kantumruy-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = { 
  title: "EkGrup",
  description: "EkGrup is a leading provider of hydro-thermo-sound insulation solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Dark mode hydration script kept for future use.
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('izogrup_theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                localStorage.setItem('izogrup_theme', 'light');
                document.documentElement.classList.remove('dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      {/* Previous class kept for future dark mode use:
      <body className={`${kantumruyPro.variable} antialiased bg-white dark:bg-black transition-colors duration-300`} suppressHydrationWarning>
      */}
      <body className={`${kantumruyPro.variable} antialiased bg-white transition-colors duration-300`} suppressHydrationWarning>
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <CartProvider>
                <StripeProvider>
                  <Header />
                  <main className="min-h-screen">{children}</main>
                  <Footer />
                  <CartSidebar />
                </StripeProvider>
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
