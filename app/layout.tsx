import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/cookie-banner";
import { WebMcpTools } from "@/components/webmcp-tools";

export const metadata: Metadata = {
  title: "EV Projects | Elektromobiliai, saulės energetika ir šilumos siurbliai",
  description: "Elektromobilių įkrovimas ir servisas, saulės elektrinės, SPRSUN šilumos siurbliai bei bendra specializuota parduotuvė.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt">
      <body className="antialiased">
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <CookieBanner />
          <WebMcpTools />
          <Toaster richColors position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}
