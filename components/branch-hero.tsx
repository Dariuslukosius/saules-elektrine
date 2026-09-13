"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Branch = "ev" | "solar" | "heat";

const electrocarsSlides = [
  {
    image: "/assets/heroes/electrocars-stoteles.webp",
    title: "Įkrovimo stotelės",
    subtitle: 'UAB „EV Projects“',
    cta: "Elektroninė parduotuvė",
    href: "/parduotuve?kategorija=stoteles",
  },
  {
    image: "/assets/heroes/electrocars-saule.webp",
    title: "Saulės elektrinių montavimas",
    subtitle: 'UAB „EV Projects“ padalinys',
    cta: "„Saulės Tinklas“",
    href: "/saules-energetika",
  },
  {
    image: "/assets/heroes/electrocars-kabeliai.webp",
    title: "Įkrovimo kabeliai",
    subtitle: 'UAB „EV Projects“',
    cta: "Elektroninė parduotuvė",
    href: "/parduotuve?kategorija=ikrovimo-kabeliai",
  },
  {
    image: "/assets/heroes/electrocars-ikrovikliai.webp",
    title: "Įkrovikliai nešiojami (portatyviniai)",
    subtitle: 'UAB „EV Projects“',
    cta: "Elektroninė parduotuvė",
    href: "/parduotuve?kategorija=ikrovikliai-nesiojami",
  },
  {
    image: "/assets/heroes/electrocars-adapteriai.webp",
    title: "Įkrovimo adapteriai",
    subtitle: 'UAB „EV Projects“',
    cta: "Elektroninė parduotuvė",
    href: "/parduotuve?kategorija=ikrovimo-adapteriai",
  },
  {
    image: "/assets/heroes/electrocars-sprsun.webp",
    title: "SPRSUN Baltic",
    subtitle: 'UAB „EV Projects“ padalinys',
    cta: "Elektroninė parduotuvė",
    href: "/parduotuve?kategorija=silumos-siurbliai",
  },
] as const;

function ElectrocarsHero() {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % electrocarsSlides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const slide = electrocarsSlides[active];
  const selectSlide = (index: number) => setActive((index + electrocarsSlides.length) % electrocarsSlides.length);

  return (
    <section
      className="original-hero original-hero-ev"
      aria-roledescription="karuselė"
      aria-label="Electrocars paslaugos"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {electrocarsSlides.map((item, index) => (
        <img key={item.image} className={`original-hero-bg ev-slide ${index === active ? "active" : ""}`} src={item.image} alt="" />
      ))}
      <div className="original-hero-shade" />
      <div className="ev-hero-copy" aria-live="polite">
        <h1>{slide.title}</h1>
        <p>{slide.subtitle}</p>
        <Link href={slide.href}>{slide.cta}</Link>
      </div>
      <button className="hero-arrow hero-arrow-left" onClick={() => selectSlide(active - 1)} aria-label="Ankstesnė skaidrė"><ChevronLeft /></button>
      <button className="hero-arrow hero-arrow-right" onClick={() => selectSlide(active + 1)} aria-label="Kita skaidrė"><ChevronRight /></button>
      <div className="hero-dots" aria-label="Pasirinkti skaidrę">
        {electrocarsSlides.map((item, index) => <button key={item.title} className={index === active ? "active" : ""} onClick={() => selectSlide(index)} aria-label={`Rodyti ${index + 1} skaidrę`} aria-current={index === active ? "true" : undefined} />)}
      </div>
    </section>
  );
}

function SolarHero() {
  return (
    <section className="original-hero original-hero-solar">
      <img className="original-hero-bg" src="/assets/heroes/saules-tinklas-original.webp" alt="Saulės elektrinės montavimo darbai" />
      <div className="solar-ownership">Dėmesio! Prekinis ženklas „Saulės Tinklas“ priklauso UAB „EV Projects“ ir neturi nieko bendro su nevykdančia veiklos UAB „Saulestinklas“</div>
      <div className="original-hero-shade" />
      <img className="solar-certificate" src="/assets/legacy/saules-tinklas/hero.png" alt="Atestatas eksploatuoti elektros įrenginius Nr. 2233" />
      <div className="solar-hero-copy">
        <h1>Saulės elektrinės</h1>
        <p>Saulės elektrinių įrengimas. Importas – ranga – prekyba. Generuojančių vartotojų prijungimas prie elektros tinklų, dokumentų Valstybės paramai ruošimas. ESO ir VERT derinimai.</p>
        <div>
          <Link href="/saules-energetika/kiek-sutaupysiu">Kiek sutaupysiu?</Link>
          <Link href="#uzklausa">Noriu įsirengti</Link>
          <Link href="#uzklausa">Ar ESO galės leisti įrengti SE?</Link>
        </div>
      </div>
      <a className="solar-offer" href="#uzklausa"><strong>Gauti pasiūlymą Jūsų saulės elektrinei</strong><span>Pildyti užklausą <ChevronRight /></span></a>
    </section>
  );
}

function HeatHero() {
  return (
    <section className="original-hero original-hero-heat">
      <img className="original-hero-bg" src="/assets/heroes/sprsun-original.webp" alt="SPRSUN R290 oras–vanduo šilumos siurbliai" />
      <div className="original-hero-shade" />
      <div className="site-shell heat-hero-copy">
        <h1>SPRSUN<br />šilumos<br />siurbliai oras-<br />vanduo A+++</h1>
      </div>
    </section>
  );
}

export function BranchHero({ branch }: { branch: Branch }) {
  if (branch === "ev") return <ElectrocarsHero />;
  if (branch === "solar") return <SolarHero />;
  return <HeatHero />;
}
