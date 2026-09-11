"use client";

import * as React from "react";
import { AlertTriangle, BatteryCharging, CircleDollarSign, Gauge, Play, SunMedium, Zap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

const faq = [
  ["Ar montuojate saulės elektrines verslui?", "Taip. Saulės elektrines įrengiame tiek fiziniams, tiek juridiniams asmenims. Įrangos komplektacija ir atsiskaitymo modelis parenkami pagal objekto technines galimybes bei užsakovo biudžetą."],
  ["Kaip saulės elektrinė prisideda prie taršos mažinimo?", "Originaliame „Saulės tinklo“ pavyzdyje nurodoma, kad 10 kW saulės elektrinė gali sumažinti su elektros gamyba siejamą CO₂ pėdsaką iki maždaug 0,4 tonos per mėnesį. Tikslus rezultatas priklauso nuo gamybos ir vartojamos elektros kilmės."],
  ["Nuo ko priklauso saulės elektrinės įrengimo kaina?", "Kainą lemia elektrinės galia, stogo tipas, montavimo konstrukcija, kabelių trasos, moduliai, inverteris, apsaugos, energijos kaupiklis ir konkretaus objekto darbų sudėtingumas."],
  ["Kiek laiko trunka montavimas ant stogo?", "Tipinės 5–10 kW elektrinės stogo konstrukcijų ir modulių montavimo darbai dažniausiai trunka 1–2 darbo dienas. Trukmę veikia stogo danga, oro sąlygos, kabelių trasos ir elektros dalies apimtis."],
  ["Nuo ko pradėti saulės elektrinės įrengimą?", "Pradėkite nuo metinio elektros suvartojimo, būsimo elektromobilio ar šilumos siurblio poreikio, ESO sąlygų ir stogo įvertinimo. Gavę šiuos duomenis galime pasiūlyti tinkamą galią bei komplektaciją."],
  ["Ar įrangą verta rinktis tik pagal kainą?", "Ne. Sistema veiks dešimtmečius, todėl svarbios gamintojo garantijos, efektyvumo mažėjimas, inverterio aptarnavimas, konstrukcijų patikimumas ir rangovo galimybė suteikti servisą."],
  ["Ar valstybė kompensuoja saulės elektrinės išlaidas?", "Paramos sąlygos, dydžiai ir kvietimų datos keičiasi. Prieš teikiant pasiūlymą reikia tikrinti tuo metu galiojančią APVA informaciją. Svetainėje negalima rodyti pasenusios sumos kaip šiuo metu galiojančio fakto."],
  ["Kada skelbiami APVA kvietimai?", "Kvietimai neturi pastovaus grafiko. Aktualias datas, likusias lėšas ir tinkamas išlaidas reikia tikrinti oficialioje APVIS sistemoje. 2024 m. informacija iš senojo puslapio saugoma tik kaip istorinis pavyzdys."],
  ["Kokius saulės modulius montuojate?", "Komplektacija sudaroma iš tuo metu tiekiamų ir patikrintų modulių, inverterių bei konstrukcijų. Prieš užsakymą pateikiame konkretų gamintoją, modelį, techninį lapą ir garantines sąlygas."],
  ["Ar turite elektros darbų atestatą?", "Taip. Darbus atlieka UAB „EV Projects“ komanda – atestuota elektros energetikos įmonė. Konkretūs atestato duomenys ir galiojimas turi būti rodomi sertifikatų skiltyje."],
  ["Kaip užtikrinamas saulės elektrinės saugumas?", "Moduliai ir konstrukcijos montuojami pagal gamintojų reikalavimus, numatomas įžeminimas, DC ir AC viršįtampių apsauga, grandinių atjungimas bei tinkamai parinkti kabeliai ir automatiniai jungikliai."],
  ["Kuo skiriasi saulės moduliai, baterijos ir kolektoriai?", "Saulės moduliai gamina elektros energiją. Energijos kaupiklis saugo pagamintą elektrą vėlesniam naudojimui. Saulės kolektoriai naudoja saulės šilumą vandeniui šildyti – tai kita technologija."],
] as const;

export function SolarKnowledge({ standalone = false }: { standalone?: boolean }) {
  const [power, setPower] = React.useState(10);
  const [consumption, setConsumption] = React.useState(400);
  const annualGeneration = Math.round(power * 950);
  const coverage = Math.min(100, Math.round((annualGeneration / (consumption * 12)) * 100));

  return (
    <div className={standalone ? "solar-knowledge standalone" : "solar-knowledge"}>
      <section id="kiek-sutaupysiu" className="solar-savings">
        <div className="site-shell py-20 lg:py-28">
          <div className="section-heading"><div><p className="eyebrow dark"><span /> KIEK SUTAUPYSIU?</p><h2>Saulės energija – skaičiais ir aiškiai.</h2></div><p>Atkurta visa originali „Saulės tinklo“ skiltis su jos iliustracijomis. Skaičiai pateikiami kaip pavyzdžiai, o ne individualus finansinis pažadas.</p></div>

          <div className="solar-calculator">
            <div className="calculator-controls">
              <div><label>Planuojama elektrinės galia <strong>{power} kW</strong></label><Slider value={[power]} onValueChange={(value) => setPower(value[0])} min={3} max={20} step={1} /></div>
              <div><label>Vidutinis mėnesio suvartojimas <strong>{consumption} kWh</strong></label><Slider value={[consumption]} onValueChange={(value) => setConsumption(value[0])} min={150} max={1500} step={50} /></div>
              <p>Orientacinė metinė gamyba apskaičiuota taikant 950 kWh vienam įrengtam kW. Faktinė gamyba priklauso nuo vietos, krypties, kampo, šešėlių ir įrangos.</p>
            </div>
            <div className="calculator-results"><div><SunMedium /><span>Orientacinė gamyba</span><strong>{annualGeneration.toLocaleString("lt-LT")} kWh / metus</strong></div><div><Gauge /><span>Metinio poreikio dalis</span><strong>{coverage}%</strong></div><div><Zap /><span>Sistema</span><strong>{power <= 10 ? "Namams" : "Didesniam objektui"}</strong></div></div>
          </div>

          <div className="solar-illustration-grid">
            <div className="solar-copy"><span className="solar-index">01</span><h3>Kiek kilometrų gali pagaminti saulė?</h3><p>Originaliame 10 kW elektrinės pavyzdyje elektros kiekis perskaičiuotas į elektromobilio nuvažiuojamus kilometrus. Nuo balandžio iki rugpjūčio iliustracijoje rodoma daugiau kaip 7 500 km per mėnesį.</p><div className="assumption"><BatteryCharging /><span><strong>10 kW elektrinė</strong><small>Elektromobiliui važiuojant įprastu miesto režimu</small></span></div></div>
            <figure><img src="/assets/legacy/saules-tinklas/saules-elektra-varomas-auto.webp" alt="Mėnesinis 10 kW saulės elektrinės energijos kiekis, perskaičiuotas į elektromobilio kilometrus" /><figcaption>Originali „Saulės tinklo“ iliustracija: 2 500–7 500 km per mėnesį.</figcaption></figure>
          </div>
        </div>
      </section>

      <section id="atsipirkimas" className="solar-payback">
        <div className="site-shell grid items-center gap-14 py-20 lg:grid-cols-[.95fr_1.05fr] lg:py-28">
          <figure><img src="/assets/legacy/saules-tinklas/saules-elektrines-atsiperkamumas.webp" alt="Originalus 10 kW saulės elektrinės atsiperkamumo grafikas" /><figcaption>Originalus istorinis 10 kW elektrinės atsiperkamumo grafikas.</figcaption></figure>
          <div><p className="eyebrow"><span /> PER KIEK LAIKO ATSIPIRKS?</p><h2>Originalus pavyzdys rodė lūžio tašką po penkerių metų.</h2><p>Senojoje svetainėje skaičiuota, kad 400 kWh per mėnesį vartojantis namų ūkis vietoje maždaug 100 Eur už elektrą mokėtų apie 25 Eur už pagamintos energijos pasaugojimą, o skirtumą kauptų. Taikant tuometinę APVA paramą grafikas į teigiamą pusę pereina maždaug penktais metais.</p><div className="legacy-warning"><AlertTriangle /><div><strong>Istorinis skaičiavimo pavyzdys</strong><span>Šios kainos ir 2024 m. paramos prielaidos nėra laikomos aktualiu pasiūlymu. Prieš viešą paleidimą jos turi būti atnaujintos pagal dabartinius tarifus, rangos kainą ir galiojantį APVA kvietimą.</span></div></div></div>
        </div>
      </section>

      <section id="se-veikimas" className="solar-video-section">
        <div className="site-shell py-20 lg:py-28">
          <div className="section-heading light"><div><p className="eyebrow"><span /> SAULĖS ELEKTRINĖS VEIKIMAS</p><h2>Kur keliauja pagaminta energija?</h2></div><p>Originalus prezentacinis vaizdo įrašas rodo vasaros ir žiemos energijos srautus tarp elektrinės, namo, elektromobilio ir elektros tinklo.</p></div>
          <div className="video-layout"><div className="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/68cobA9rPXQ?rel=0" title="Saulės elektrinės veikimas – energijos srautų prezentacija" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div><div className="energy-costs"><div><span><SunMedium /></span><div><strong>Tiesioginis vartojimas</strong><p>Energija naudojama tuo metu, kai ją gamina saulės elektrinė.</p></div></div><div><span><CircleDollarSign /></span><div><strong>Atgauta iš tinklo</strong><p>Perteklinė energija perduodama į tinklą ir pagal pasirinktą planą atgaunama vakare, naktį ar žiemą.</p></div></div><div><span><Zap /></span><div><strong>Pirkimas iš tinklo</strong><p>Kai sukaupto energijos kiekio nepakanka, trūkstama elektra perkama pagal tiekėjo tarifą.</p></div></div><p className="video-note"><Play /> Vaizdo įraše pateikiami septyni vasaros ir aštuoni žiemos energijos pasiskirstymo scenarijai.</p></div></div>
        </div>
      </section>

      <section id="duk" className="solar-faq-full">
        <div className="site-shell grid gap-12 py-20 lg:grid-cols-[.68fr_1.32fr] lg:py-28"><div><p className="eyebrow dark"><span /> DAŽNAI UŽDUODAMI KLAUSIMAI</p><h2>Apie saulės elektrines</h2><p>Perkeltas visas senojo puslapio DUK turinys, suredaguojant kalbą ir aiškiai pažymint informaciją, kuri gali keistis.</p></div><Accordion type="single" collapsible className="faq-list">{faq.map(([question, answer], index) => <AccordionItem key={question} value={`solar-${index}`}><AccordionTrigger>{question}</AccordionTrigger><AccordionContent>{answer}</AccordionContent></AccordionItem>)}</Accordion></div>
      </section>
    </div>
  );
}
