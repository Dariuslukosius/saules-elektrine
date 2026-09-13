"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, Clipboard, FileDown, ImageIcon, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/components/cart-context";
import productData from "@/data/products.json";

type QuoteDetails = {
  provider: string;
  phone: string;
  email: string;
  client: string;
  project: string;
  offerNumber: string;
  validUntil: string;
  notes: string;
};

const detailsStorageKey = "ev-projects-quote-details";

function dateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function defaultDetails(): QuoteDetails {
  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(validUntil.getDate() + 14);
  return {
    provider: "",
    phone: "",
    email: "",
    client: "",
    project: "",
    offerNumber: `P-${dateValue(today).replaceAll("-", "")}`,
    validUntil: dateValue(validUntil),
    notes: "Pasiūlymas galioja iki nurodytos datos. Pristatymo terminas derinamas užsakymo metu.",
  };
}

function eur(value: number) {
  return new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" }).format(value);
}

function displayDate(value: string) {
  if (!value) return "-";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("lt-LT");
}

export function QuoteBuilder() {
  const { items, setQuantity, removeItem } = useCart();
  const [details, setDetails] = React.useState<QuoteDetails>(() => defaultDetails());
  const [prices, setPrices] = React.useState<Record<string, number>>({});
  const [showPrices, setShowPrices] = React.useState(true);
  const [showVat, setShowVat] = React.useState(true);
  const [showImages, setShowImages] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [detailsLoaded, setDetailsLoaded] = React.useState(false);
  const [printImages, setPrintImages] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    let savedDetails: Partial<QuoteDetails> | null = null;
    try {
      const saved = localStorage.getItem(detailsStorageKey);
      if (saved) savedDetails = JSON.parse(saved);
    } catch {}
    queueMicrotask(() => {
      if (savedDetails) setDetails((current) => ({ ...current, ...savedDetails }));
      setDetailsLoaded(true);
    });
  }, []);

  React.useEffect(() => {
    if (detailsLoaded) localStorage.setItem(detailsStorageKey, JSON.stringify(details));
  }, [details, detailsLoaded]);

  const imageKey = items.map((item) => item.image || "").join("|");
  const imageSources = React.useMemo(() => [...new Set(imageKey.split("|").filter(Boolean))], [imageKey]);
  React.useEffect(() => {
    let cancelled = false;
    Promise.all(imageSources.map((source) => new Promise<[string, string]>((resolve) => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(1, 260 / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) return resolve([source, source]);
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve([source, canvas.toDataURL("image/jpeg", 0.76)]);
      };
      image.onerror = () => resolve([source, source]);
      image.src = source;
    }))).then((entries) => {
      if (!cancelled) {
        setPrintImages(Object.fromEntries(entries));
      }
    });
    return () => { cancelled = true; };
  }, [imageSources]);

  const updateDetail = (key: keyof QuoteDetails, value: string) => setDetails((current) => ({ ...current, [key]: value }));
  const products = React.useMemo(() => new Map(productData.products.map((product) => [product.id, product])), []);
  const total = items.reduce((sum, item) => sum + (prices[item.id] ?? item.price) * item.quantity, 0);
  const net = total / 1.21;
  const vat = total - net;
  const issuedAt = new Date().toLocaleDateString("lt-LT");
  const hasProvider = Boolean(details.provider || details.phone || details.email);
  const imagesReady = imageSources.every((source) => Boolean(printImages[source]));

  const handlePrint = () => {
    const previousTitle = document.title;
    document.title = `${details.offerNumber || "Pasiulymas"}-${details.client || "klientui"}`.replace(/[^a-zA-Z0-9ąčęėįšųūžĄČĘĖĮŠŲŪŽ-]+/g, "-");
    window.print();
    window.setTimeout(() => { document.title = previousTitle; }, 600);
  };

  const copySummary = async () => {
    const lines = [
      `PASIŪLYMAS ${details.offerNumber}`,
      details.client ? `Klientas: ${details.client}` : "",
      details.project ? `Objektas: ${details.project}` : "",
      "",
      ...items.map((item, index) => {
        const price = prices[item.id] ?? item.price;
        return `${index + 1}. ${item.name}${item.variantName && item.variantName !== item.name ? ` - ${item.variantName}` : ""} | SKU ${item.sku} | ${item.quantity} vnt.${showPrices ? ` | ${eur(price * item.quantity)}` : ""}`;
      }),
      showPrices ? `Iš viso: ${eur(total)}` : "",
      details.notes ? `Pastabos: ${details.notes}` : "",
      hasProvider ? `Pasiūlymą pateikė: ${[details.provider, details.phone, details.email].filter(Boolean).join(" | ")}` : "",
    ].filter((line) => line !== "");
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  if (!items.length) {
    return (
      <main className="empty-state site-shell py-28">
        <ShoppingBag />
        <h1>Pasiūlymui dar nepasirinkta prekių</h1>
        <p>Įdėkite norimus produktus į krepšelį, tada čia paruošite klientui skirtą sąrašą.</p>
        <Button asChild><Link href="/parduotuve">Rinktis produktus</Link></Button>
      </main>
    );
  }

  return (
    <main className="quote-page site-shell">
      <div className="quote-page-head no-print">
        <div>
          <Link href="/parduotuve/krepselis" className="back-link"><ArrowLeft /> Grįžti į krepšelį</Link>
          <p className="eyebrow dark"><span /> ELEKTRIKO DARBO ĮRANKIS</p>
          <h1>Pasiūlymas klientui</h1>
          <p>Paruoškite savo vardu, išsaugokite PDF arba atsispausdinkite. EV Projects rekvizitai į dokumentą nededami.</p>
        </div>
        <div className="quote-head-actions">
          <Button variant="outline" onClick={copySummary}>{copied ? <Check /> : <Clipboard />} {copied ? "Nukopijuota" : "Kopijuoti sąrašą"}</Button>
          <Button onClick={handlePrint} disabled={showImages && !imagesReady}><FileDown /> {showImages && !imagesReady ? "Ruošiamos nuotraukos…" : "PDF / spausdinti"}</Button>
        </div>
      </div>

      <div className="quote-layout">
        <aside className="quote-editor no-print">
          <section>
            <span className="quote-editor-index">01</span>
            <h2>Jūsų duomenys</h2>
            <p>Šie duomenys išsaugomi tik šiame įrenginyje ir bus naudojami kitam pasiūlymui.</p>
            <label>Elektrikas arba įmonė<Input value={details.provider} onChange={(event) => updateDetail("provider", event.target.value)} placeholder="Vardas, pavardė arba įmonė" /></label>
            <div className="quote-field-pair">
              <label>Telefonas<Input value={details.phone} onChange={(event) => updateDetail("phone", event.target.value)} placeholder="+370..." /></label>
              <label>El. paštas<Input type="email" value={details.email} onChange={(event) => updateDetail("email", event.target.value)} /></label>
            </div>
          </section>

          <section>
            <span className="quote-editor-index">02</span>
            <h2>Klientas ir pasiūlymas</h2>
            <label>Kliento vardas / įmonė<Input value={details.client} onChange={(event) => updateDetail("client", event.target.value)} placeholder="Kam teikiamas pasiūlymas" /></label>
            <label>Objektas arba adresas<Input value={details.project} onChange={(event) => updateDetail("project", event.target.value)} placeholder="Pvz., privatus namas Vilniuje" /></label>
            <div className="quote-field-pair">
              <label>Pasiūlymo Nr.<Input value={details.offerNumber} onChange={(event) => updateDetail("offerNumber", event.target.value)} /></label>
              <label>Galioja iki<Input type="date" value={details.validUntil} onChange={(event) => updateDetail("validUntil", event.target.value)} /></label>
            </div>
            <label>Pastabos ir sąlygos<Textarea rows={4} value={details.notes} onChange={(event) => updateDetail("notes", event.target.value)} /></label>
          </section>

          <section>
            <span className="quote-editor-index">03</span>
            <h2>Dokumento vaizdas</h2>
            <label className="quote-toggle"><input type="checkbox" checked={showPrices} onChange={(event) => setShowPrices(event.target.checked)} /><span><strong>Rodyti kainas</strong><small>Galite pateikti ir tik produktų komplektaciją.</small></span></label>
            <label className="quote-toggle"><input type="checkbox" checked={showVat} disabled={!showPrices} onChange={(event) => setShowVat(event.target.checked)} /><span><strong>Rodyti PVM išskaidymą</strong><small>Klientui rodomos kainos laikomos kainomis su PVM.</small></span></label>
            <label className="quote-toggle"><input type="checkbox" checked={showImages} onChange={(event) => setShowImages(event.target.checked)} /><span><strong>Rodyti nuotraukas</strong><small>Patogu klientui atpažinti siūlomą įrangą.</small></span></label>
          </section>

          <section>
            <span className="quote-editor-index">04</span>
            <h2>Produktai ir jūsų kainos</h2>
            <div className="quote-product-editor">
              {items.map((item) => (
                <div className="quote-product-edit" key={item.id}>
                  {item.image ? <img src={item.image} alt="" /> : <span className="quote-product-placeholder"><ImageIcon /></span>}
                  <div><strong>{item.name}</strong><small>SKU: {item.sku}</small></div>
                  <div className="quote-edit-quantity">
                    <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="Sumažinti kiekį"><Minus /></button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="Padidinti kiekį"><Plus /></button>
                  </div>
                  <label>Kaina klientui, €<Input type="number" min="0" step="0.01" value={prices[item.id] ?? item.price} onChange={(event) => setPrices((current) => ({ ...current, [item.id]: Number(event.target.value) || 0 }))} /></label>
                  <button type="button" className="quote-remove" onClick={() => removeItem(item.id)} aria-label={`Pašalinti ${item.name}`}><Trash2 /></button>
                </div>
              ))}
            </div>
          </section>
        </aside>

        <article className="quote-document" aria-label="Pasiūlymo peržiūra">
          <header className="quote-document-header">
            <div><span>KOMERCINIS</span><h2>Pasiūlymas</h2></div>
            <dl>
              <div><dt>Numeris</dt><dd>{details.offerNumber || "-"}</dd></div>
              <div><dt>Data</dt><dd>{issuedAt}</dd></div>
              <div><dt>Galioja iki</dt><dd>{displayDate(details.validUntil)}</dd></div>
            </dl>
          </header>

          {(hasProvider || details.client || details.project) && <section className="quote-parties">
            <div><small>PASIŪLYMĄ PATEIKĖ</small>{hasProvider ? <><strong>{details.provider || "Elektrikas"}</strong>{details.phone && <span>{details.phone}</span>}{details.email && <span>{details.email}</span>}</> : <span>-</span>}</div>
            <div><small>KLIENTAS / OBJEKTAS</small><strong>{details.client || "Klientas"}</strong>{details.project && <span>{details.project}</span>}</div>
          </section>}

          <section className={`quote-lines ${showImages ? "with-images" : "without-images"}`}>
            <div className="quote-lines-head"><span>Nr.</span>{showImages && <span>Prekė</span>}<span>Aprašymas</span><span>Kiekis</span>{showPrices && <><span>Vnt. kaina</span><span>Suma</span></>}</div>
            {items.map((item, index) => {
              const product = products.get(item.productId);
              const unitPrice = prices[item.id] ?? item.price;
              return (
                <div className="quote-line" key={item.id}>
                  <span className="quote-line-number">{String(index + 1).padStart(2, "0")}</span>
                  {showImages && <div className="quote-line-image">{item.image ? <img src={printImages[item.image] || item.image} alt="" /> : <ImageIcon />}</div>}
                  <div className="quote-line-copy">
                    <strong>{item.name}</strong>
                    {item.variantName && item.variantName !== item.name && <em>{item.variantName}</em>}
                    <small>SKU: {item.sku}</small>
                    {product?.summary && <p>{product.summary.slice(0, 180)}{product.summary.length > 180 ? "…" : ""}</p>}
                  </div>
                  <strong className="quote-line-quantity">{item.quantity} vnt.</strong>
                  {showPrices && <><span className="quote-line-price">{eur(unitPrice)}</span><strong className="quote-line-total">{eur(unitPrice * item.quantity)}</strong></>}
                </div>
              );
            })}
          </section>

          {showPrices && <section className="quote-totals">
            {showVat && <><div><span>Suma be PVM</span><strong>{eur(net)}</strong></div><div><span>PVM 21 %</span><strong>{eur(vat)}</strong></div></>}
            <div className="quote-grand-total"><span>Bendra suma su PVM</span><strong>{eur(total)}</strong></div>
          </section>}

          {details.notes && <section className="quote-notes"><small>PASTABOS IR SĄLYGOS</small><p>{details.notes}</p></section>}
          <footer className="quote-document-footer"><span>Ačiū, kad kreipėtės.</span><span>{details.offerNumber || "Komercinis pasiūlymas"}</span></footer>
        </article>
      </div>
      <div className="quote-mobile-actions no-print">
        <Button variant="outline" onClick={copySummary}>{copied ? <Check /> : <Clipboard />} {copied ? "Nukopijuota" : "Kopijuoti"}</Button>
        <Button onClick={handlePrint} disabled={showImages && !imagesReady}><FileDown /> {showImages && !imagesReady ? "Ruošiama…" : "PDF / spausdinti"}</Button>
      </div>
    </main>
  );
}
