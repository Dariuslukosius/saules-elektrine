import Link from "next/link";
import { ArrowRight, Award, BatteryCharging, Building2, Check, ChevronRight, CircleGauge, FileCheck2, Headphones, Heater, MapPin, PanelsTopLeft, Phone, ShieldCheck, SunMedium, Wrench, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LeadForm } from "@/components/lead-form";
import { AccountPage, CartPage, ProductCard, ProductDetail, Storefront } from "@/components/storefront";
import productData from "@/data/products.json";
import legacy from "@/data/legacy-content.json";
import { SolarKnowledge } from "@/components/solar-knowledge";
import { BranchHero } from "@/components/branch-hero";
import { QuoteBuilder } from "@/components/quote-builder";

type Branch = "ev" | "solar" | "heat";

const branchContent = {
  ev: {
    label: "ELECTROCARS",
    title: "Įkrovimo ir serviso sprendimai, kurie tiesiog veikia.",
    intro: "Padedame pasirinkti įrangą, pasirūpiname elektros dalimi, sumontuojame ir liekame šalia, kai prireikia techninės pagalbos.",
    accent: "ev",
    icon: BatteryCharging,
    cta: "Gauti stotelės pasiūlymą",
    form: "ev" as const,
    services: [
      ["Įkrovimo stotelės", "AC ir DC sprendimai namams, daugiabučiams, įmonėms bei viešoms vietoms.", Zap, "/parduotuve?kategorija=stoteles"],
      ["Projektavimas ir montavimas", "Objekto vertinimas, kabelių trasos, apsaugos, įrengimas ir paleidimas.", FileCheck2, "/elektromobiliai/ikrovimo-stoteliu-irengimas"],
      ["Dinaminis galios valdymas", "Įkrovimo galia automatiškai derinama prie pastato elektros vartojimo.", CircleGauge, "/elektromobiliai/dinaminis-galios-valdymas"],
      ["Elektromobilių servisas", "USA–EU konversijos, baterijų, inverterių ir įkrovimo sistemų remontas.", Wrench, "/elektromobiliai/servisas"],
    ],
    facts: [["15+", "metų elektromobilių patirties"], ["AC / DC", "įkrovimo sprendimai"], ["Visa LT", "montavimo geografija"]],
    faqs: [
      ["Kokios galios stotelę rinktis namams?", "Dažniausiai pasirenkama 11 arba 22 kW AC stotelė, tačiau tikroji galia priklauso nuo automobilio, įvado ir kitų namo vartotojų. Prieš pasiūlymą tai patikriname."],
      ["Ar reikalingas dinaminis galios valdymas?", "Jis ypač naudingas, kai įvado galia ribota. Sistema realiu laiku sumažina automobilio įkrovimą, kai namuose įjungiami kiti galingi prietaisai."],
      ["Ar montuojate visoje Lietuvoje?", "Taip. Paprastiems objektams pasiūlymą galime parengti pagal pateiktas nuotraukas ir ESO informaciją, sudėtingesnius apžiūrime vietoje."],
    ],
  },
  solar: {
    label: "SAULĖS TINKLAS",
    title: "Saulės elektrinė, suprojektuota jūsų vartojimui.",
    intro: "Nuo realaus poreikio skaičiavimo iki modulių, inverterio, kaupiklio, dokumentų ir paleidimo. Be perteklinių pažadų ir neaiškių prielaidų.",
    accent: "solar",
    icon: SunMedium,
    cta: "Gauti saulės elektrinės pasiūlymą",
    form: "solar" as const,
    services: [
      ["Poreikio skaičiavimas", "Vertiname metinį vartojimą, stogo galimybes ir planuojamus naujus elektros vartotojus.", CircleGauge, "/saules-energetika/kiek-sutaupysiu"],
      ["Projektas ir dokumentai", "Parengiame techninį sprendimą bei padedame sutvarkyti prijungimo dokumentus.", FileCheck2, "/saules-energetika/paslaugos"],
      ["Įranga ir montavimas", "Moduliai, inverteriai, kaupikliai ir saugus montavimas ant skirtingų tipų stogų.", PanelsTopLeft, "/saules-energetika/iranga"],
      ["Stebėsena ir priežiūra", "Paleidžiame sistemą, paaiškiname stebėseną ir pasirūpiname garantiniu aptarnavimu.", Headphones, "/kontaktai"],
    ],
    facts: [["A–Z", "projektas ir montavimas"], ["25+ m.", "modulių efektyvumo perspektyva"], ["Visa LT", "projektų geografija"]],
    faqs: [
      ["Kokios galios elektrinės man reikia?", "Galia parenkama pagal faktinį metinį suvartojimą, planuojamą elektromobilį ar šilumos siurblį, stogo kryptį ir leistiną generuoti galią."],
      ["Ar verta iš karto montuoti energijos kaupiklį?", "Tai priklauso nuo vartojimo profilio, tinklo sąlygų ir tikslų. Pasiūlyme galime atskirai parodyti sistemą su kaupikliu ir be jo."],
      ["Kiek laiko trunka įrengimas?", "Montavimo darbai tipiniame name dažniausiai atliekami per kelias dienas, tačiau visas procesas priklauso nuo ESO sąlygų, projekto ir įrangos tiekimo."],
    ],
  },
  heat: {
    label: "SPRSUN BALTIC",
    title: "Efektyvus šildymas su oficialiu atstovu šalia.",
    intro: "Parenkame SPRSUN oras–vanduo šilumos siurblius pagal pastato nuostolius, šildymo sistemą ir karšto vandens poreikį. Montuojame ir atliekame garantinį servisą.",
    accent: "heat",
    icon: Heater,
    cta: "Parinkti šilumos siurblį",
    form: "heat" as const,
    services: [
      ["Šilumos siurblio parinkimas", "Vertiname plotą, energinę klasę, šildymo temperatūras ir karšto vandens poreikį.", CircleGauge, "/silumos-siurbliai/konsultacija"],
      ["SPRSUN įranga", "R290 ir R32 serijos, boileriai, hidrauliniai blokai bei reikalingi priedai.", Heater, "/parduotuve?kategorija=silumos-siurbliai"],
      ["Montavimas ir paleidimas", "Hidraulinė bei elektros dalis, sistemos parametravimas ir naudojimo instruktažas.", Wrench, "/kontaktai"],
      ["Garantinis servisas", "Gaminio registracija, gedimo diagnostika ir oficialus garantinis aptarnavimas.", ShieldCheck, "/silumos-siurbliai/garantija"],
    ],
    facts: [["R290 / R32", "modernios produktų serijos"], ["A+++", "aukšta energinė klasė"], ["Oficialus", "atstovas ir servisas"]],
    faqs: [
      ["Kaip parenkama šilumos siurblio galia?", "Svarbiausia ne vien pastato plotas. Vertiname šilumos nuostolius, energinę klasę, lauko temperatūrą, grindinį šildymą ar radiatorius ir karšto vandens poreikį."],
      ["Ar šilumos siurblys veikia su radiatoriais?", "Taip, jei radiatoriai gali užtikrinti reikiamą šilumą prie ekonomiškos vandens temperatūros. Senesnėse sistemose kartais reikia radiatorių ar hidraulinės schemos korekcijos."],
      ["Kur registruoti gaminį ir gedimą?", "Gaminio ir garantijos duomenys registruojami šioje svetainėje. Gedimo atveju pateikite serijos numerį, klaidos kodą ir nuotraukas serviso formoje."],
    ],
  },
} as const;

const solarInstallationGroups = [
  {
    number: "01",
    title: "Saulės elektrinių konsultacijos",
    intro: "Sprendimą pradedame nuo realaus poreikio ir objekto techninių galimybių.",
    icon: CircleGauge,
    items: [
      "Jūsų reikalavimų ir objekto įvertinimas",
      "Preliminarios saulės elektrinės kainos apskaičiavimas",
      "PREMIUM ir ECONOMY pasiūlymų parengimas",
      "Energijos vartojimo optimizavimas",
      "Konsultacija dėl valstybės paramos saulės elektrinėms",
    ],
  },
  {
    number: "02",
    title: "Saulės elektrinių montavimas",
    intro: "Įrangą, konstrukcijas ir elektros dalį įrengiame kaip vieną saugią sistemą.",
    icon: PanelsTopLeft,
    items: [
      "Tinkamos įrangos parinkimas pagal PREMIUM arba ECONOMY komplektaciją",
      "Laikančiųjų konstrukcijų tvirtinimas prie stogo",
      "Saulės modulių montavimas",
      "DC/AC keitiklio (inverterio) montavimas",
      "AC/DC viršįtampių apsaugos įrengimas",
      "Saulės elektrinės prijungimas prie elektros tinklų",
      "Garantinis ir pogarantinis saulės elektrinių aptarnavimas",
    ],
  },
  {
    number: "03",
    title: "Dokumentų parengimas",
    intro: "Pasirūpiname dokumentais, kurių reikia elektrinės prijungimui ir paramai.",
    icon: FileCheck2,
    items: [
      "Saulės elektrinės dokumentai ESO tinklams",
      "Elektros įrenginių ir įžeminimo varžų matavimai",
      "Dokumentai valstybės paramai gauti (APVA parama)",
    ],
  },
] as const;

const solarEquipment = [
  {
    label: "PREMIUM-1",
    title: "DAH Solar Full Screen + SolaX",
    text: "440 W berėmiai Full Screen moduliai su SolaX 10 kW G2 inverteriu. Modulio konstrukcija padeda vandeniui ir nešvarumams lengviau nutekėti.",
    image: "/assets/legacy/saules-tinklas/31-2.webp",
    facts: ["DAH Solar 440 W", "SolaX 10 kW G2", "Individuali komplektacija"],
  },
  {
    label: "PREMIUM-2",
    title: "BlueSun + Sofar Solar",
    text: "Visiškai juodi BlueSun 440 W moduliai ir kompaktiškas 8,8–11 kW Sofar Solar inverteris estetiškai namo saulės elektrinei.",
    image: "/assets/legacy/saules-tinklas/project-panels.jpg",
    facts: ["BlueSun 440 W", "Sofar Solar 8,8–11 kW", "Pilnai juodi moduliai"],
  },
  {
    label: "DIY SPRENDIMAS",
    title: "SolarUnit 800–1500 W",
    text: "Kompaktiška mini saulės elektrinė balkonui, pavėsinei, tvorai ar kitai tinkamai konstrukcijai. Komplektacija tikslinama pagal objektą.",
    image: "/assets/legacy/saules-tinklas/402-0.webp",
    facts: ["800–1500 W", "Kompaktiškas sprendimas", "Balkonui ar pavėsinei"],
  },
  {
    label: "SAULĖS STOGINĖ",
    title: "Carport 5,46 arba 8,19 kW",
    text: "Stoginė vienam arba dviem automobiliams, kuri vienoje vietoje sujungia elektros gamybą, automobilio apsaugą ir galimybę įkrauti elektromobilį.",
    image: "/assets/legacy/saules-tinklas/31-0.jpg",
    facts: ["5,46 arba 8,19 kW", "1–2 automobiliams", "Galima integruoti įkrovimą"],
  },
] as const;

function SolarInstallationServices() {
  return (
    <section className="solar-installation-services">
      <div className="site-shell py-20 lg:py-28">
        <div className="solar-services-heading">
          <div><p className="eyebrow dark"><span /> VISAS DARBŲ CIKLAS</p><h2>Saulės elektrinių montavimo paslaugos</h2></div>
          <p>Nuo pirmojo objekto įvertinimo iki prijungimo prie tinklo, dokumentų ir ilgalaikio aptarnavimo.</p>
        </div>
        <div className="solar-services-grid">
          {solarInstallationGroups.map((group) => {
            const ServiceIcon = group.icon;
            return <article key={group.title} className="solar-service-detail"><div className="solar-service-top"><span>{group.number}</span><ServiceIcon /></div><h3>{group.title}</h3><p>{group.intro}</p><ul>{group.items.map((item) => <li key={item}><Check /> <span>{item}</span></li>)}</ul></article>;
          })}
        </div>
        <div className="solar-services-cta"><div><strong>Reikia preliminaraus skaičiavimo?</strong><span>Pateikite metinį suvartojimą, stogo tipą ir objekto vietą.</span></div><Button asChild size="lg"><a href="#uzklausa">Gauti pasiūlymą <ArrowRight /></a></Button></div>
      </div>
    </section>
  );
}

function SolarEquipment() {
  return (
    <section className="solar-equipment-section">
      <div className="site-shell py-20 lg:py-28">
        <div className="section-heading"><div><p className="eyebrow dark"><span /> ĮRANGA IR KOMPLEKTACIJOS</p><h2>Montuojama saulės elektrinių įranga</h2></div><p>Komplektaciją galutinai parenkame pagal elektros vartojimą, stogą, ESO sąlygas ir kliento biudžetą.</p></div>
        <div className="solar-equipment-grid">
          {solarEquipment.map((item) => <article className="solar-equipment-card" key={item.title}><div className="solar-equipment-image"><img src={item.image} alt={item.title} /><span>{item.label}</span></div><div className="solar-equipment-copy"><h3>{item.title}</h3><p>{item.text}</p><ul>{item.facts.map((fact) => <li key={fact}><Check /> {fact}</li>)}</ul><a href="#uzklausa">Gauti individualų pasiūlymą <ChevronRight /></a></div></article>)}
        </div>
        <p className="solar-equipment-note">Įrangos modeliai, techninės charakteristikos, garantija, kaina ir prieinamumas patvirtinami individualiame pasiūlyme.</p>
      </div>
    </section>
  );
}

function relevantProducts(branch: Branch) {
  if (branch === "heat") {
    return ["Šilumos siurbliai", "Boileriai", "Baseinų šildymo sistemos", "Hidrauliniai blokai"]
      .map((category) => productData.products.find((product) => product.facets.some((facet) => facet.facet.name === "Kategorija" && facet.name === category)))
      .filter((product): product is (typeof productData.products)[number] => Boolean(product));
  }
  const words = branch === "ev" ? ["Įkrovimo"] : ["Solax"];
  const matches = productData.products.filter((product) => words.some((word) => `${product.name} ${product.facets.map(f => f.name).join(" ")}`.includes(word)));
  return (matches.length ? matches : productData.products).slice(0, 4);
}

export function BranchPage({ branch }: { branch: Branch }) {
  const content = branchContent[branch];
  const Icon = content.icon;
  return (
    <main className={`branch-page branch-${content.accent}`}>
      <BranchHero branch={branch} />
      <section className="branch-intro-strip">
        <div className="site-shell branch-intro-grid">
          <div><p className="eyebrow dark"><span /> {content.label}</p><h2>{content.title}</h2><p>{content.intro}</p></div>
          <div className="branch-facts">{content.facts.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
        </div>
      </section>

      <section className="site-shell py-20 lg:py-28">
        <div className="section-heading"><div><p className="eyebrow dark"><span /> KĄ ATLIEKAME</p><h2>Vienas procesas.<br />Visa atsakomybė.</h2></div><p>Nereikia atskirai ieškoti projektuotojo, įrangos pardavėjo, montuotojo ir serviso.</p></div>
        <div className="service-grid">{content.services.map(([title, text, ServiceIcon, href], index) => <Link key={title} href={href} className="service-card"><span>0{index + 1}</span><ServiceIcon /><h3>{title}</h3><p>{text}</p><b>Plačiau <ChevronRight /></b></Link>)}</div>
      </section>

      {branch === "solar" && <SolarInstallationServices />}

      <section className="dark-split">
        <div className="site-shell grid items-center gap-14 py-20 lg:grid-cols-2 lg:py-28">
          <div className="split-image"><img src={branch === "ev" ? "/assets/legacy/electrocars/9-1.webp" : branch === "solar" ? "/assets/legacy/saules-tinklas/project-panels.jpg" : "/assets/legacy/sprsun/installation.webp"} alt="Įgyvendinamas EV Projects projektas" /><div><Icon /><span>{content.label}</span></div></div>
          <div><p className="eyebrow"><span /> NUO IDĖJOS IKI VEIKIANČIOS SISTEMOS</p><h2>Techninis sprendimas prasideda nuo gero klausimo.</h2><p className="large-copy">Pirmiausia išsiaiškiname situaciją, tuomet pateikiame suprantamą komplektaciją ir darbų apimtį. Aiškiai matote, ką gaunate ir kas už ką atsakingas.</p><ol className="steps"><li><span>01</span><div><strong>Poreikio įvertinimas</strong><p>Objektas, vartojimas, esama sistema ir jūsų tikslas.</p></div></li><li><span>02</span><div><strong>Techninis pasiūlymas</strong><p>Įranga, darbai, terminai ir aiški sąmata.</p></div></li><li><span>03</span><div><strong>Įrengimas ir priežiūra</strong><p>Paleidimas, instruktažas, garantinis bei pogarantinis servisas.</p></div></li></ol></div>
        </div>
      </section>

      {branch === "solar" ? <SolarEquipment /> : <section className="site-shell py-20 lg:py-28">
        <div className="section-heading"><div><p className="eyebrow dark"><span /> ĮRANGA</p><h2>Patikrinti produktai</h2></div><Button asChild variant="outline" className="rounded-full"><Link href="/parduotuve">Visas katalogas <ArrowRight /></Link></Button></div>
        <div className="product-grid compact">{relevantProducts(branch).map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>}

      {branch === "solar" && <SolarKnowledge />}

      {branch !== "solar" && <section className="faq-section"><div className="site-shell grid gap-12 py-20 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow dark"><span /> DUK</p><h2>Dažniausi klausimai</h2><p>Jei savo situacijos čia nerandate, parašykite – atsakys techninis specialistas.</p></div><Accordion type="single" collapsible className="faq-list">{content.faqs.map(([question, answer], index) => <AccordionItem key={question} value={`q-${index}`}><AccordionTrigger>{question}</AccordionTrigger><AccordionContent>{answer}</AccordionContent></AccordionItem>)}</Accordion></div></section>}
      <section id="uzklausa" className="site-shell py-20 lg:py-28"><div className="form-layout"><div className="form-aside"><Icon /><h2>Pradėkime nuo jūsų situacijos.</h2><p>Pateikite pagrindinius duomenis. Užklausa bus nukreipta tiesiai atitinkamos krypties specialistui.</p><ul><li><Check /> Aiškus poreikio įvertinimas</li><li><Check /> Derinama įranga ir montavimas</li><li><Check /> Jokio įsipareigojimo pirkti</li></ul></div><LeadForm kind={content.form} /></div></section>
    </main>
  );
}

export function ProjectsPage() {
  const projects = [
    ["Elektromobiliai", "Gilužio slėnio įkrovimo stotelė", "Vilnius", "/assets/legacy/electrocars/1368-0.webp"],
    ["Saulės energetika", "10 kW saulės elektrinė privačiam namui", "Vilnius", "/assets/legacy/saules-tinklas/31-2.webp"],
    ["Saulės energetika", "PREMIUM komplektacijos montavimas", "Vilniaus r.", "/assets/legacy/saules-tinklas/31-0.jpg"],
    ["Šilumos siurbliai", "SPRSUN R290 šildymo sistema", "Lietuva", "/assets/legacy/sprsun/installation.webp"],
    ["Elektromobiliai", "Verslo įkrovimo infrastruktūra", "Vilnius", "/assets/legacy/electrocars/9-0.webp"],
    ["Saulės energetika", "Antžeminė saulės elektrinė", "Senoji Varėna", "/assets/legacy/saules-tinklas/project-panels.jpg"],
  ];
  return <main><PageIntro label="ATLIKTI DARBAI" title="Projektai, kuriuos galima pamatyti veikiant." text="Skirtingos technologijos, tas pats principas – sprendimas turi būti aiškus, saugus ir prižiūrimas." /><section className="site-shell pb-24"><div className="project-grid">{projects.map(([type, title, place, image], index) => <article className={index === 0 || index === 3 ? "project-card wide" : "project-card"} key={title}><img src={image} alt="" /><div className="project-shade" /><div><span>{type}</span><h2>{title}</h2><p><MapPin /> {place}</p></div></article>)}</div></section></main>;
}

export function NewsPage() {
  const posts = legacy.electrocars.filter((item) => item.type === "post");
  return <main><PageIntro label="NAUJIENOS IR ŽINIOS" title="Technika, projektai ir svarbi informacija." text="Visas ankstesnių svetainių turinys viename bendrame archyve." /><section className="site-shell pb-24"><div className="news-grid">{posts.map((post) => <Link key={post.id} href={`/naujienos/${post.slug}`} className="news-card">{post.images[0] ? <img src={post.images[0]} alt="" /> : <div className="news-placeholder"><Zap /></div>}<div><span>{new Date(post.date).toLocaleDateString("lt-LT")}</span><h2>{post.title.replace("&#8221;", "”")}</h2><p>{post.excerpt.slice(0, 150)}…</p><b>Skaityti <ArrowRight /></b></div></Link>)}</div></section></main>;
}

export function ArticlePage({ slug }: { slug: string }) {
  const post = legacy.electrocars.find((item) => item.slug === slug);
  if (!post) return <NotFoundPage />;
  return <main className="article-page"><div className="site-shell article-shell"><Link href="/naujienos" className="back-link">← Visos naujienos</Link><p className="eyebrow dark"><span /> {post.type === "post" ? "NAUJIENA / PASLAUGA" : "INFORMACIJA"}</p><h1>{post.title.replace("&#8221;", "”")}</h1><p className="article-date">{new Date(post.date).toLocaleDateString("lt-LT")}</p>{post.images[0] && <img className="article-hero" src={post.images[0]} alt="" />}<div className="article-body">{post.body.match(/.{1,550}(?:\s|$)/g)?.slice(0, 12).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><div className="article-cta"><h2>Turite panašų klausimą?</h2><p>Susisiekite su mūsų techniniu specialistu.</p><Button asChild><Link href="/kontaktai">Susisiekti <ArrowRight /></Link></Button></div></div></main>;
}

export function ContactPage({ form = "contact" as const }: { form?: "contact" | "ev" | "solar" | "heat" | "register" | "fault" }) {
  return <main><PageIntro label="KONTAKTAI" title={form === "register" ? "Užregistruokite SPRSUN gaminį." : form === "fault" ? "Registruokite gedimą serviso komandai." : "Pasikalbėkime apie jūsų projektą."} text={form === "register" || form === "fault" ? "Visi duomenys pateikiami vienoje saugioje formoje." : "Pasirinkite jums patogiausią būdą arba iš karto pateikite užklausą."} /><section className="site-shell contact-grid pb-24"><div className="contact-cards"><a href="tel:+37065634766"><Phone /><span><small>Bendras telefonas</small><strong>+370 656 34766</strong></span></a><a href="mailto:info@electrocars.lt"><Headphones /><span><small>Bendras el. paštas</small><strong>info@electrocars.lt</strong></span></a><div><MapPin /><span><small>Biuras ir prekių atsiėmimas</small><strong>Ukmergės g. 315A-1, Vilnius</strong><em>I–V 9:00–17:00</em></span></div><div><Building2 /><span><small>SPRSUN centrinis sandėlis</small><strong>Galinės g. 1, Galinės k.</strong><em>Vilniaus raj.</em></span></div></div><LeadForm kind={form} /></section></main>;
}

export function AboutPage() {
  return <main><PageIntro label="APIE EV PROJECTS" title="Technologijos keičiasi. Atsakomybė lieka." text="UAB „EV Projects“ vienoje komandoje sujungia elektromobilių, elektros, saulės energetikos ir šildymo kompetencijas." /><section className="site-shell story-grid pb-24"><div className="story-image"><img src="/assets/legacy/electrocars/9-0.webp" alt="EV Projects komandos įgyvendintas projektas" /></div><div><p className="eyebrow dark"><span /> VIENA KOMANDA</p><h2>Nuo elektromobilių serviso iki visos namo energijos sistemos.</h2><p>Veiklą auginome spręsdami realias technines problemas: įkrovimo standartų skirtumus, ribotą įvado galią, saulės generacijos panaudojimą ir efektyvų pastatų šildymą.</p><p>Šiandien mūsų klientui nereikia derinti kelių nesusijusių rangovų. Projektavimą, įrangą, montavimą ir aptarnavimą galime valdyti kaip vieną sistemą.</p><div className="credential-grid"><div><Award /><strong>Atestuota įmonė</strong><span>Elektros energetikos darbams</span></div><div><ShieldCheck /><strong>Oficialus servisas</strong><span>SPRSUN įrangai Lietuvoje</span></div></div></div></section></main>;
}

export function LegalPage({ kind }: { kind: string }) {
  const page = kind === "privatumo-politika" ? legacy.electrocars.find(p => p.slug === "privatumo-politika") : kind === "garantija-ir-grazinimas" ? legacy.electrocars.find(p => p.slug === "garantinis-prekiu-aptarnavimas-ir-prekiu-grazinimas") : legacy.electrocars.find(p => p.slug === "shipping");
  const title = kind === "privatumo-politika" ? "Privatumo politika" : kind === "garantija-ir-grazinimas" ? "Garantija ir prekių grąžinimas" : "Pirkimo, pristatymo ir apmokėjimo taisyklės";
  return <main className="article-page"><div className="site-shell article-shell"><p className="eyebrow dark"><span /> TEISINĖ INFORMACIJA</p><h1>{title}</h1><p className="article-date">Turinį prieš viešą paleidimą turi patvirtinti atsakingas asmuo.</p><div className="article-body">{(page?.body || "Šiame puslapyje bus pateiktos sujungtos ir atnaujintos svetainės taisyklės.").match(/.{1,650}(?:\s|$)/g)?.map((text, index) => <p key={index}>{text}</p>)}</div></div></main>;
}

function PageIntro({ label, title, text }: { label: string; title: string; text: string }) {
  return <section className="page-intro"><div className="site-shell py-16 lg:py-24"><p className="eyebrow"><span /> {label}</p><h1>{title}</h1><p>{text}</p></div></section>;
}

const storeCategoryBySlug: Record<string, string> = {
  "stoteles": "Įkrovimo stotelės",
  "ikrovimo-kabeliai": "Įkrovimo kabeliai",
  "ikrovikliai-nesiojami": "Įkrovikliai nešiojami",
  "ikrovimo-adapteriai": "Įkrovimo adapteriai",
  "silumos-siurbliai": "Šilumos siurbliai",
  "boileriai": "Boileriai",
  "baseinu-sildymo-sistemos": "Baseinų šildymo sistemos",
  "hidrauliniai-blokai": "Hidrauliniai blokai",
};

export function SiteRouter({ segments, storeCategory }: { segments: string[]; storeCategory?: string }) {
  const [first, second, third] = segments;
  if (first === "elektromobiliai") {
    if (second === "servisas" && third) return <ArticlePage slug={third} />;
    if (second && legacy.electrocars.some((post) => post.slug === second)) return <ArticlePage slug={second} />;
    return <BranchPage branch="ev" />;
  }
  if (first === "saules-energetika") {
    if (second === "gauti-pasiulyma") return <ContactPage form="solar" />;
    if (second === "kiek-sutaupysiu") return <main><PageIntro label="SKAIČIAVIMAI IR VEIKIMO PRINCIPAS" title="Kiek gali sutaupyti saulės elektrinė?" text="Orientacinė gamyba, originalios iliustracijos, istorinis atsipirkimo pavyzdys, prezentacinis vaizdo įrašas ir visi dažniausi klausimai." /><SolarKnowledge standalone /><section className="site-shell pb-24"><div className="form-layout"><div className="form-aside"><SunMedium /><h2>Gaukite skaičiavimą savo objektui.</h2><p>Viešas pavyzdys negali pakeisti individualaus pasiūlymo. Įvertinsime suvartojimą, stogą, ESO sąlygas ir galimą kaupiklį.</p></div><LeadForm kind="solar" /></div></section></main>;
    return <BranchPage branch="solar" />;
  }
  if (first === "silumos-siurbliai") {
    if (second === "gaminio-registracija") return <ContactPage form="register" />;
    if (second === "gedimo-registracija") return <ContactPage form="fault" />;
    if (second === "konsultacija") return <ContactPage form="heat" />;
    if (second === "garantija") return <LegalPage kind="garantija-ir-grazinimas" />;
    return <BranchPage branch="heat" />;
  }
  if (first === "parduotuve") {
    if (second === "produktas" && third) return <ProductDetail slug={third} />;
    if (second === "krepselis") return <CartPage />;
    if (second === "pasiulymas") return <QuoteBuilder />;
    if (second === "atsiskaitymas") return <CartPage checkout />;
    if (second === "paskyra") return <AccountPage />;
    return <Storefront initialCategory={storeCategoryBySlug[storeCategory || ""] || storeCategory} />;
  }
  if (first === "projektai") return <ProjectsPage />;
  if (first === "naujienos" && second) return <ArticlePage slug={second} />;
  if (first === "naujienos") return <NewsPage />;
  if (first === "apie-mus") return <AboutPage />;
  if (first === "kontaktai") return <ContactPage />;
  if (["privatumo-politika", "pirkimo-taisykles", "garantija-ir-grazinimas"].includes(first)) return <LegalPage kind={first} />;
  return <NotFoundPage />;
}

function NotFoundPage() {
  return <main className="empty-state site-shell py-28"><Zap /><p className="eyebrow dark"><span /> 404</p><h1>Puslapio čia nėra</h1><p>Galbūt pasikeitė jo adresas. Visos veiklos kryptys pasiekiamos iš pagrindinio puslapio.</p><Button asChild><Link href="/">Grįžti į pradžią</Link></Button></main>;
}
