import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "AURORA LUXE - Premium Anti-Tarnish Jewellery",
  description: "Enduring elegance for the modern muse. Crafted to last, designed to inspire.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${montserrat.variable} bg-white text-on-background min-h-screen flex flex-col font-body antialiased overflow-x-hidden selection:bg-primary selection:text-white`}
        suppressHydrationWarning
      >
        <AnnouncementBar />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
