"use client";

import * as React from "react";
import { Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

type FormKind = "contact" | "ev" | "solar" | "heat" | "product" | "register" | "fault";

const specs = {
  contact: { title: "Parašykite mums", intro: "Atsakysime ir nukreipsime į tinkamą specialistą." },
  ev: { title: "Įkrovimo sprendimo užklausa", intro: "Pateikite objekto ir automobilio informaciją – parengsime tinkamą komplektaciją." },
  solar: { title: "Saulės elektrinės pasiūlymas", intro: "Kuo daugiau informacijos pateiksite, tuo tikslesnį pasiūlymą galėsime parengti." },
  heat: { title: "Šilumos siurblio konsultacija", intro: "Pagal pastato duomenis padėsime parinkti tinkamą galią ir komplektaciją." },
  product: { title: "Klausimas apie prekę", intro: "Atsakysime dėl suderinamumo, pristatymo ar montavimo." },
  register: { title: "SPRSUN gaminio registracija", intro: "Užregistravę gaminį gausite registracijos patvirtinimą." },
  fault: { title: "Gedimo registracija", intro: "Pateikite klaidos informaciją ir nuotraukas, kad servisas galėtų pradėti vertinimą." },
} as const;

function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return <div className={wide ? "form-field md:col-span-2" : "form-field"}><Label>{label}</Label>{children}</div>;
}

export function LeadForm({ kind = "contact", product }: { kind?: FormKind; product?: string }) {
  const [sent, setSent] = React.useState(false);
  const info = specs[kind];
  if (sent) return (
    <div className="form-success" role="status"><span><Check /></span><h3>Užklausa paruošta</h3><p>Demonstracinėje versijoje duomenys nesiunčiami. Prijungus el. pašto arba CRM integraciją, čia bus rodomas registracijos numeris.</p><Button variant="outline" onClick={() => setSent(false)}>Pildyti dar kartą</Button></div>
  );

  return (
    <form className="lead-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
      <div className="mb-7"><p className="eyebrow dark"><span /> UŽKLAUSA</p><h2>{info.title}</h2><p>{info.intro}</p></div>
      {product && <input type="hidden" name="product" value={product} />}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label={kind === "register" || kind === "fault" ? "Vardas, pavardė / įmonė *" : "Vardas ir pavardė *"}><Input required name="name" autoComplete="name" /></Field>
        <Field label="El. paštas *"><Input required type="email" name="email" autoComplete="email" /></Field>
        <Field label="Telefono numeris *"><Input required type="tel" name="phone" autoComplete="tel" /></Field>

        {kind === "ev" && <>
          <Field label="Automobilis"><Input name="car" placeholder="Markė, modelis, metai" /></Field>
          <Field label="Esamas elektros įvadas"><NativeSelect name="power"><NativeSelectOption>Pasirinkite</NativeSelectOption>{["16 A", "20 A", "25 A", "32 A", "40 A", "Daugiau nei 40 A"].map(x => <NativeSelectOption key={x}>{x}</NativeSelectOption>)}</NativeSelect></Field>
          <Field label="Jungties tipas"><NativeSelect name="connector"><NativeSelectOption>Pasirinkite</NativeSelectOption>{["TYPE1", "TYPE2", "Tesla USA", "CCS1", "CCS2"].map(x => <NativeSelectOption key={x}>{x}</NativeSelectOption>)}</NativeSelect></Field>
          <Field label="Naudojimo vieta"><NativeSelect name="use"><NativeSelectOption>Privatus namas</NativeSelectOption><NativeSelectOption>Daugiabučio aikštelė</NativeSelectOption><NativeSelectOption>Įmonė</NativeSelectOption><NativeSelectOption>Vieša vieta</NativeSelectOption></NativeSelect></Field>
          <Field label="Objekto miestas / adresas"><Input name="address" /></Field>
        </>}

        {kind === "solar" && <>
          <Field label="Planuojama galia"><NativeSelect name="power"><NativeSelectOption>Iki 5 kW</NativeSelectOption>{["6–8 kW", "9–10 kW", "11–15 kW", "16 kW ir daugiau"].map(x => <NativeSelectOption key={x}>{x}</NativeSelectOption>)}</NativeSelect></Field>
          <Field label="Stogo tipas"><NativeSelect name="roof">{["Šiferis", "Čerpės", "Plokščias stogas", "Bituminės čerpės", "Trapecinė / klasikinė skarda", "Antžeminė", "Keli stogai", "Kita"].map(x => <NativeSelectOption key={x}>{x}</NativeSelectOption>)}</NativeSelect></Field>
          <Field label="Paramos būsena"><NativeSelect name="support">{["Gauta", "Planuoju pildyti", "Laukiu patvirtinimo", "Tik domiuosi", "Be paramos"].map(x => <NativeSelectOption key={x}>{x}</NativeSelectOption>)}</NativeSelect></Field>
          <Field label="Įrengimo terminas"><NativeSelect name="timeline">{["Kuo greičiau", "Iki 3 mėn.", "Iki 6 mėn.", "Iki metų", "Tik domiuosi"].map(x => <NativeSelectOption key={x}>{x}</NativeSelectOption>)}</NativeSelect></Field>
          <Field label="Metinis elektros suvartojimas"><Input name="consumption" placeholder="kWh per metus" /></Field>
          <Field label="Apskritis"><Input name="county" /></Field>
        </>}

        {kind === "heat" && <>
          <Field label="Šildomas plotas"><Input name="area" placeholder="m²" /></Field>
          <Field label="Energinė klasė"><NativeSelect name="class">{["A++", "A+", "A", "B", "C", "D", "E", "F", "G", "Nežinau"].map(x => <NativeSelectOption key={x}>{x}</NativeSelectOption>)}</NativeSelect></Field>
          <Field label="Pastato tipas"><NativeSelect name="building"><NativeSelectOption>Nauja statyba</NativeSelectOption><NativeSelectOption>Renovacija</NativeSelectOption><NativeSelectOption>Esamas pastatas</NativeSelectOption></NativeSelect></Field>
          <Field label="Šildymo sistema"><NativeSelect name="heating"><NativeSelectOption>Grindinis šildymas</NativeSelectOption><NativeSelectOption>Radiatoriai</NativeSelectOption><NativeSelectOption>Mišri sistema</NativeSelectOption></NativeSelect></Field>
          <Field label="Gyventojų skaičius"><Input name="people" type="number" min="1" /></Field>
          <Field label="Objekto vieta"><Input name="location" /></Field>
        </>}

        {kind === "register" && <>
          <Field label="Montavimo adresas *"><Input required name="address" /></Field>
          <Field label="Serijos numeris *"><Input required name="serial" /></Field>
          <Field label="Pirkimo data *"><Input required type="date" name="purchaseDate" /></Field>
          <Field label="Pirmojo paleidimo data"><Input type="date" name="launchDate" /></Field>
          <Field label="Sąskaitos numeris"><Input name="invoice" /></Field>
          <Field label="Garantijos pratęsimas"><NativeSelect name="warranty"><NativeSelectOption>Ne</NativeSelectOption><NativeSelectOption>36 mėn.</NativeSelectOption><NativeSelectOption>48 mėn.</NativeSelectOption><NativeSelectOption>60 mėn.</NativeSelectOption></NativeSelect></Field>
          <Field label="Montuotojas"><Input name="installer" /></Field>
          <Field label="Sąskaita / paleidimo aktas"><Input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" /></Field>
        </>}

        {kind === "fault" && <>
          <Field label="Serijos numeris *"><Input required name="serial" /></Field>
          <Field label="Pirkimo data"><Input type="date" name="purchaseDate" /></Field>
          <Field label="Tikslus objekto adresas *"><Input required name="address" /></Field>
          <Field label="Montavusi įmonė"><Input name="installer" /></Field>
          <Field label="Klaidos kodas"><Input name="errorCode" /></Field>
          <Field label="Gedimo kritiškumas"><NativeSelect name="severity"><NativeSelectOption>Įrenginys veikia</NativeSelectOption><NativeSelectOption>Veikia ribotai</NativeSelectOption><NativeSelectOption>Neveikia</NativeSelectOption></NativeSelect></Field>
          <Field label="Nuotraukos ir QR kodas" wide><Input type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf" /></Field>
        </>}

        <Field label={kind === "fault" ? "Gedimo aprašymas *" : "Papildoma informacija"} wide><Textarea required={kind === "fault"} name="message" rows={5} /></Field>
        <div className="md:col-span-2 flex items-start gap-3"><Checkbox required id={`privacy-${kind}`} /><Label htmlFor={`privacy-${kind}`} className="font-normal leading-6">Sutinku, kad mano duomenys būtų naudojami atsakant į šią užklausą. Susipažinau su privatumo politika. *</Label></div>
      </div>
      <Button type="submit" size="lg" className="mt-7 rounded-full bg-[#0b1b2d] px-7 hover:bg-[#182b40]">Siųsti užklausą <Send /></Button>
    </form>
  );
}
