"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, UserRound, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/components/cart-context";

const nav = [
  ["Elektromobiliai", "/elektromobiliai"],
  ["Saulės energetika", "/saules-energetika"],
  ["Šilumos siurbliai", "/silumos-siurbliai"],
  ["Projektai", "/projektai"],
  ["Apie mus", "/apie-mus"],
  ["Kontaktai", "/kontaktai"],
];

const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2304.611266653086!2d25.248727313013852!3d54.71646207260449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dd9b3d5d4d0885%3A0x8f5f7d05f93b0692!2sUAB%20EV%20projektas!5e0!3m2!1sen!2slt!4v1789211559776!5m2!1sen!2slt";

export function SiteHeader() {
  const { count } = useCart();
  return (
    <>
      <div className="utility-bar">
        <div className="site-shell flex items-center justify-between py-2">
          <p>UAB „EV Projects“ · Atestuota elektros energetikos įmonė</p>
          <div className="hidden items-center gap-6 md:flex">
            <a href="tel:+37065634766">+370 656 34766</a>
            <a href="mailto:info@electrocars.lt">info@electrocars.lt</a>
            <span>LT</span>
          </div>
        </div>
      </div>
      <header className="main-header">
        <div className="site-shell flex h-[76px] items-center justify-between gap-6">
          <Link href="/" className="brand" aria-label="EV Projects pradinis puslapis">
            <span className="brand-mark"><Zap size={20} strokeWidth={2.6} /></span>
            <span>EV <strong>PROJECTS</strong></span>
          </Link>
          <nav className="hidden items-center gap-6 xl:flex" aria-label="Pagrindinis meniu">
            {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/parduotuve" className="icon-button hidden sm:grid" aria-label="Ieškoti parduotuvėje"><Search size={18} /></Link>
            <Link href="/parduotuve/paskyra" className="icon-button hidden sm:grid" aria-label="Paskyra"><UserRound size={18} /></Link>
            <Button asChild className="rounded-full bg-lime-400 px-4 text-slate-950 hover:bg-lime-300">
              <Link href="/parduotuve"><ShoppingBag /> <span className="hidden sm:inline">Parduotuvė</span>{count > 0 && <b className="cart-count">{count}</b>}</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <button className="icon-button mobile-menu-button" aria-label="Atverti meniu"><Menu /></button>
              </SheetTrigger>
              <SheetContent className="w-[min(92vw,420px)] border-l-0 bg-[#0b1b2d] text-white">
                <SheetHeader className="border-b border-white/10 px-6 py-7">
                  <SheetTitle className="flex items-center gap-3 text-white"><span className="brand-mark"><Zap size={18} /></span> EV PROJECTS</SheetTitle>
                  <SheetDescription className="text-slate-400">Visi energijos sprendimai vienoje vietoje.</SheetDescription>
                </SheetHeader>
                <nav className="flex flex-col px-6 py-4 text-xl font-bold" aria-label="Mobilusis meniu">
                  {nav.map(([label, href], index) => (
                    <SheetClose asChild key={href}>
                      <Link href={href} className="flex items-center justify-between border-b border-white/10 py-5"><span>{label}</span><small>0{index + 1}</small></Link>
                    </SheetClose>
                  ))}
                </nav>
                <SheetClose className="absolute right-5 top-5" aria-label="Uždaryti meniu"><X /></SheetClose>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell grid gap-12 py-16 lg:grid-cols-[1.1fr_.7fr_.7fr_1fr]">
        <div>
          <Link href="/" className="brand text-white"><span className="brand-mark"><Zap size={20} /></span><span>EV <strong>PROJECTS</strong></span></Link>
          <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">Elektromobilių įkrovimo, saulės energetikos ir šildymo sprendimai – nuo įrangos iki profesionalaus serviso.</p>
        </div>
        <div><h3>Sprendimai</h3>{nav.slice(0, 3).map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
        <div><h3>Informacija</h3><Link href="/parduotuve">Parduotuvė</Link><Link href="/projektai">Projektai</Link><Link href="/naujienos">Naujienos</Link><Link href="/kontaktai">Kontaktai</Link></div>
        <div><h3>Kontaktai</h3><a href="tel:+37065634766">+370 656 34766</a><a href="mailto:info@electrocars.lt">info@electrocars.lt</a><p>Ukmergės g. 315A-1<br />LT-06306 Vilnius</p></div>
      </div>
      <div className="site-footer-map site-shell">
        <div className="site-footer-map-heading">
          <h3>Mus rasite čia</h3>
          <p>UAB „EV Projects“ · Ukmergės g. 315A-1, Vilnius</p>
        </div>
        <iframe
          src={mapEmbedUrl}
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="UAB EV Projects vieta Google žemėlapyje"
        />
      </div>
      <div className="site-shell flex flex-wrap items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-slate-500">
        <span>© 2026 UAB „EV Projects“ · Įmonės kodas 303185354</span>
        <div className="flex gap-5"><Link href="/privatumo-politika">Privatumas</Link><Link href="/pirkimo-taisykles">Pirkimo taisyklės</Link><Link href="/garantija-ir-grazinimas">Garantija ir grąžinimas</Link></div>
      </div>
    </footer>
  );
}
