import type { Metadata } from "next";
import { Kantumruy_Pro } from "next/font/google";
import "./globals.css";

const kantumruyPro = Kantumruy_Pro({
  variable: "--font-kantumruy-pro",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "IZOGRUP - Hydro Thermo Sound Insulation",
  description: "Leading provider of hydro-thermo-sound insulation solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${kantumruyPro.variable} antialiased bg-white dark:bg-black transition-colors duration-300`} suppressHydrationWarning>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
