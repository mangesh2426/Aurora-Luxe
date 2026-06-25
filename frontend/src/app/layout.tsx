import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import dynamic from "next/dynamic";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import "./globals.css";

// Lazy loaded non-critical components
const Footer = dynamic(() => import("@/components/Footer"));
const JsonLd = dynamic(() => import("@/components/JsonLd"));
const ScrollToTop = dynamic(() => import("@/components/ScrollToTop"));
const PageProgressBar = dynamic(() => import("@/components/PageProgressBar"));
const MouseGlow = dynamic(() => import("@/components/MouseGlow"));

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aurora Luxe — Premium Anti-Tarnish Gold Jewellery",
    template: "%s | Aurora Luxe",
  },
  description:
    "Waterproof, skin-safe, vacuum-plated gold jewellery that lasts forever. Shop earrings, rings, necklaces & bracelets — crafted for the modern muse.",
  keywords: [
    "anti-tarnish jewellery",
    "gold plated jewellery",
    "waterproof jewellery",
    "PVD jewellery India",
    "Aurora Luxe",
  ],
  metadataBase: new URL("https://aurora-luxe.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Aurora Luxe",
    title: "Aurora Luxe — Premium Anti-Tarnish Gold Jewellery",
    description:
      "Luxurious, waterproof jewellery forged for everyday radiance. Wear it in the shower, gym, and everywhere in between.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Aurora Luxe jewellery" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurora Luxe — Premium Anti-Tarnish Gold Jewellery",
    description: "Waterproof, skin-safe gold jewellery crafted for the modern muse.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#C59F27",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${montserrat.variable} bg-white text-on-background min-h-screen flex flex-col font-body antialiased overflow-x-hidden selection:bg-primary selection:text-white`}
        suppressHydrationWarning
      >
        <MouseGlow />
        <PageProgressBar />
        <JsonLd />
        <AnnouncementBar />
        <Header />
        {children}
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
