import Link from "next/link";
import {
  ArrowRight,
  Award,
  BatteryCharging,
  ChevronRight,
  Heater,
  SunMedium,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront";
import productData from "@/data/products.json";
import legacy from "@/data/legacy-content.json";

const directions = [
  {
    eyebrow: "01 / MOBILUMAS",
    title: "Elektromobilių įkrovimas ir servisas",
    text: "Stotelės namams ir verslui, projektavimas, įrengimas bei specializuotas elektromobilių remontas.",
    href: "/elektromobiliai",
    image: "/assets/legacy/electrocars/hero.webp",
    icon: BatteryCharging,
    tone: "ev",
  },
  {
    eyebrow: "02 / SAULĖ",
    title: "Saulės elektrinės nuo projekto iki paleidimo",
    text: "Konsultacija, įranga, montavimas, dokumentacija ir priežiūra vienose rankose.",
    href: "/saules-energetika",
    image: "/assets/legacy/saules-tinklas/hero.png",
    icon: SunMedium,
    tone: "solar",
  },
  {
    eyebrow: "03 / ŠILUMA",
    title: "SPRSUN šilumos siurbliai ir oficialus servisas",
    text: "Efektyvūs oras–vanduo sprendimai, profesionalus parinkimas, montavimas ir garantinis aptarnavimas.",
    href: "/silumos-siurbliai",
    image: "/assets/legacy/sprsun/hero.webp",
    icon: Heater,
    tone: "heat",
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero-grid">
        <div className="site-shell relative z-10 grid min-h-[610px] items-center gap-10 py-20 lg:grid-cols-[1.08fr_.92fr]">
          <div className="max-w-3xl">
            <p className="eyebrow"><span /> ENERGIJA JŪSŲ JUDĖJIMUI IR NAMAMS</p>
            <h1>Vienas partneris.<br /><em>Trys energijos kryptys.</em></h1>
            <p className="hero-copy">
              Projektuojame, montuojame ir prižiūrime elektromobilių įkrovimo, saulės energetikos bei šildymo sprendimus. Įranga, darbai ir servisas – vienoje vietoje.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-white px-7 text-slate-950 hover:bg-lime-300">
                <Link href="/kontaktai">Gauti pasiūlymą <ArrowRight /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-white/25 bg-transparent px-7 text-white hover:bg-white/10 hover:text-white">
                <Link href="/parduotuve">Rinktis prekes</Link>
              </Button>
            </div>
          </div>
          <div className="hero-panel">
            <div className="hero-panel-top">
              <span>VISA SISTEMA</span>
              <span>LT / 2026</span>
            </div>
            <div className="energy-orbit" aria-hidden="true">
              <span className="orbit-core"><Zap /></span>
              <span className="orbit-dot dot-one" />
              <span className="orbit-dot dot-two" />
              <span className="orbit-dot dot-three" />
            </div>
            <div className="grid grid-cols-3 border-t border-white/15">
              <div><strong>15+</strong><span>metų patirties</span></div>
              <div><strong>3</strong><span>kompetencijų kryptys</span></div>
              <div><strong>1</strong><span>atsakinga komanda</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-shell py-20 lg:py-28">
        <div className="section-heading">
          <div>
            <p className="eyebrow dark"><span /> SPRENDIMAI</p>
            <h2>Visa energijos ekosistema</h2>
          </div>
          <p>Nuo pirmos konsultacijos iki kasdienio sistemos veikimo ir garantinio aptarnavimo.</p>
        </div>

        <div className="direction-grid">
          {directions.map((direction) => {
            const Icon = direction.icon;
            return (
              <Link key={direction.title} href={direction.href} className={`direction-card ${direction.tone}`}>
                <img src={direction.image} alt="" />
                <div className="direction-overlay" />
                <div className="direction-number"><Icon size={21} /></div>
                <div className="direction-content">
                  <span>{direction.eyebrow}</span>
                  <h3>{direction.title}</h3>
                  <p>{direction.text}</p>
                  <span className="direction-link">Plačiau <ChevronRight /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="process-strip">
        <div className="site-shell grid gap-8 py-14 md:grid-cols-4">
          {["Konsultuojame", "Projektuojame", "Įrengiame", "Prižiūrime"].map((item, index) => (
            <div key={item} className="process-item"><span>0{index + 1}</span><strong>{item}</strong></div>
          ))}
        </div>
      </section>

      <section className="site-shell py-20 lg:py-28">
        <div className="section-heading">
          <div><p className="eyebrow dark"><span /> PARDUOTUVĖ</p><h2>Įranga viename kataloge</h2></div>
          <Button asChild variant="outline" className="rounded-full"><Link href="/parduotuve">Visos 93 prekės <ArrowRight /></Link></Button>
        </div>
        <div className="product-grid compact">{productData.products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>

      <section className="home-projects">
        <div className="site-shell py-20 lg:py-28">
          <div className="section-heading light"><div><p className="eyebrow"><span /> ĮGYVENDINTA</p><h2>Darbus rodo rezultatai</h2></div><p>Įkrovimo, saulės energetikos ir šildymo projektai privačiam bei verslo sektoriui.</p></div>
          <div className="project-grid home">
            {[
              ["Elektromobiliai", "Gilužio slėnio įkrovimo stotelė", "/assets/legacy/electrocars/1368-0.webp"],
              ["Saulės energetika", "10 kW elektrinė privačiam namui", "/assets/legacy/saules-tinklas/31-2.webp"],
              ["Šilumos siurbliai", "SPRSUN R290 šildymo sistema", "/assets/legacy/sprsun/installation.webp"],
            ].map(([type, title, image]) => <Link href="/projektai" className="project-card" key={title}><img src={image} alt="" /><div className="project-shade" /><div><span>{type}</span><h2>{title}</h2><p>Peržiūrėti projektą <ArrowRight /></p></div></Link>)}
          </div>
        </div>
      </section>

      <section className="site-shell home-proof py-20 lg:py-28">
        <div><p className="eyebrow dark"><span /> KODĖL MES</p><h2>Vienas atsakingas partneris visai sistemai.</h2><p>Elektros įvadas, saulės generacija, automobilio įkrovimas ir šildymas veikia kartu. Todėl juos ir projektuojame kaip vieną energijos ekosistemą.</p><Button asChild variant="outline" className="rounded-full"><Link href="/apie-mus">Apie EV Projects <ArrowRight /></Link></Button></div>
        <div className="proof-grid"><div><Award /><strong>Atestuota</strong><span>Elektros energetikos įmonė</span></div><div><BatteryCharging /><strong>15+ metų</strong><span>Elektromobilių patirties</span></div><div><Heater /><strong>Oficialus</strong><span>SPRSUN atstovas ir servisas</span></div><div><SunMedium /><strong>Vienas procesas</strong><span>Projektas, įranga ir darbai</span></div></div>
      </section>

      <section className="home-news">
        <div className="site-shell py-20 lg:py-28"><div className="section-heading"><div><p className="eyebrow dark"><span /> NAUJIENOS</p><h2>Naujausia iš mūsų darbų</h2></div><Button asChild variant="outline" className="rounded-full"><Link href="/naujienos">Visos naujienos</Link></Button></div><div className="news-grid">{legacy.electrocars.filter((item) => item.type === "post").slice(0, 3).map((post) => <Link key={post.id} href={`/naujienos/${post.slug}`} className="news-card">{post.images[0] ? <img src={post.images[0]} alt="" /> : <div className="news-placeholder"><Zap /></div>}<div><span>{new Date(post.date).toLocaleDateString("lt-LT")}</span><h2>{post.title}</h2><p>{post.excerpt.slice(0, 130)}…</p><b>Skaityti <ArrowRight /></b></div></Link>)}</div></div>
      </section>

      <section className="home-cta"><div className="site-shell"><div><p className="eyebrow"><span /> JŪSŲ PROJEKTAS</p><h2>Pradėkime nuo gero pokalbio.</h2><p>Papasakokite, ką norite įgyvendinti. Techninis specialistas padės susidėlioti kitą žingsnį.</p></div><Button asChild size="lg"><Link href="/kontaktai">Susisiekti <ArrowRight /></Link></Button></div></section>
    </main>
  );
}
