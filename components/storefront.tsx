"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Check, ChevronRight, Minus, PackageCheck, Plus, Search, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/components/cart-context";
import productData from "@/data/products.json";

type Product = (typeof productData.products)[number];

function price(product: Product) {
  return Math.min(...product.variants.map((variant) => variant.priceWithTax)) / 100;
}

function eur(value: number) {
  return new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" }).format(value);
}

function productCategories(product: Product) {
  return product.facets.filter((value) => value.facet.name === "Kategorija").map((value) => value.name);
}

const primaryCategories = [
  "Visos prekės",
  "Įkrovimo stotelės",
  "Įkrovikliai nešiojami",
  "Įkrovimo kabeliai",
  "Įkrovimo adapteriai",
  "Šilumos siurbliai",
  "Elektros komponentai",
  "Elektriniai paspirtukai",
];

export function ProductCard({ product }: { product: Product }) {
  const variant = product.variants[0];
  const { addItem } = useCart();
  return (
    <article className="product-card">
      <Link href={`/parduotuve/produktas/${product.slug}`} className="product-image">
        {product.image ? <img src={product.image} alt={product.name} loading="lazy" /> : <span><ShoppingBag /></span>}
        <small>{variant.stockLevel === "IN_STOCK" ? "Turime" : "Pagal užsakymą"}</small>
      </Link>
      <div className="product-body">
        <p>{productCategories(product)[0] || "EV Projects"}</p>
        <h3><Link href={`/parduotuve/produktas/${product.slug}`}>{product.name}</Link></h3>
        <div className="product-bottom"><strong>{product.variants.length > 1 && <small>nuo </small>}{eur(price(product))}</strong><Button size="icon" aria-label={`Įdėti ${product.name} į krepšelį`} onClick={() => addItem({ id: variant.id, productId: product.id, slug: product.slug, name: product.name, sku: variant.sku, price: variant.priceWithTax / 100, image: product.image })}><Plus /></Button></div>
      </div>
    </article>
  );
}

export function Storefront({ initialCategory }: { initialCategory?: string }) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState(initialCategory || "Visos prekės");
  const [sort, setSort] = React.useState("recommended");
  const [visible, setVisible] = React.useState(12);

  const products = React.useMemo(() => {
    const filtered = productData.products.filter((product) => {
      const matchesQuery = `${product.name} ${product.summary} ${product.variants.map(v => v.sku).join(" ")}`.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "Visos prekės" || productCategories(product).includes(category);
      return matchesQuery && matchesCategory;
    });
    return filtered.sort((a, b) => sort === "price-asc" ? price(a) - price(b) : sort === "price-desc" ? price(b) - price(a) : a.name.localeCompare(b.name, "lt"));
  }, [query, category, sort]);

  return (
    <main>
      <section className="store-hero">
        <div className="site-shell py-16 lg:py-20">
          <p className="eyebrow"><span /> 93 PRODUKTAI · 206 VARIANTAI</p>
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_420px]">
            <div><h1>Profesionali įranga jūsų energijos sistemai.</h1><p>Vienas katalogas elektromobiliams, namams ir verslui.</p></div>
            <label className="store-search"><Search /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ieškoti prekės arba SKU" aria-label="Ieškoti parduotuvėje" /></label>
          </div>
        </div>
      </section>
      <section className="site-shell py-12 lg:py-16">
        <div className="store-controls">
          <div className="category-scroll" role="group" aria-label="Produktų kategorijos">
            {primaryCategories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => { setCategory(item); setVisible(12); }}>{item}</button>)}
          </div>
          <div className="flex items-center gap-3"><span className="text-sm text-slate-500">{products.length} prekės</span><NativeSelect aria-label="Rūšiuoti" value={sort} onChange={(event) => setSort(event.target.value)}><NativeSelectOption value="recommended">Pagal pavadinimą</NativeSelectOption><NativeSelectOption value="price-asc">Kaina: nuo mažiausios</NativeSelectOption><NativeSelectOption value="price-desc">Kaina: nuo didžiausios</NativeSelectOption></NativeSelect></div>
        </div>
        {products.length ? <div className="product-grid">{products.slice(0, visible).map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><Search /><h2>Prekių neradome</h2><p>Pabandykite trumpesnį raktažodį arba pasirinkite kitą kategoriją.</p><Button variant="outline" onClick={() => { setQuery(""); setCategory("Visos prekės"); }}>Išvalyti paiešką</Button></div>}
        {visible < products.length && <div className="mt-10 text-center"><Button variant="outline" size="lg" className="rounded-full" onClick={() => setVisible((value) => value + 12)}>Rodyti daugiau</Button></div>}
      </section>
    </main>
  );
}

export function ProductDetail({ slug }: { slug: string }) {
  const product = productData.products.find((item) => item.slug === slug);
  const [selectedVariant, setSelectedVariant] = React.useState(product?.variants[0]?.id || "");
  const [activeImage, setActiveImage] = React.useState(product?.image || null);
  const { addItem } = useCart();
  if (!product) return <NotFoundProduct />;
  const variant = product.variants.find((item) => item.id === selectedVariant) || product.variants[0];
  const specs = product.facets.filter((item) => item.facet.name !== "Kategorija");
  return (
    <main className="product-detail">
      <div className="site-shell py-8">
        <Link href="/parduotuve" className="back-link"><ArrowLeft /> Grįžti į parduotuvę</Link>
        <div className="product-detail-grid">
          <div className="gallery-panel">
            <div className="main-product-image">{activeImage ? <img src={activeImage} alt={product.name} /> : <ShoppingBag />}</div>
            {product.gallery.length > 1 && <div className="thumbs">{product.gallery.map((image) => <button key={image} className={activeImage === image ? "active" : ""} onClick={() => setActiveImage(image)}><img src={image} alt="" /></button>)}</div>}
          </div>
          <div className="buy-panel">
            <p className="eyebrow dark"><span /> {productCategories(product)[0] || "EV PROJECTS"}</p>
            <h1>{product.name}</h1>
            <p className="sku">SKU: {variant.sku}</p>
            <p className="detail-summary">{product.summary}</p>
            {product.variants.length > 1 && <label className="variant-select"><span>Pasirinkite variantą</span><NativeSelect value={selectedVariant} onChange={(event) => setSelectedVariant(event.target.value)}>{product.variants.map((item) => <NativeSelectOption key={item.id} value={item.id}>{item.name}</NativeSelectOption>)}</NativeSelect></label>}
            <div className="price-row"><strong>{eur(variant.priceWithTax / 100)}</strong><span><Check /> Turime sandėlyje</span></div>
            <Button size="lg" className="add-cart" onClick={() => addItem({ id: variant.id, productId: product.id, slug: product.slug, name: product.name, sku: variant.sku, price: variant.priceWithTax / 100, image: product.image })}><ShoppingBag /> Įdėti į krepšelį</Button>
            <Button asChild size="lg" variant="outline" className="mt-3 w-full rounded-full"><Link href={`/kontaktai?produktas=${product.slug}`}>Gauti pasiūlymą su montavimu</Link></Button>
            <div className="purchase-benefits"><div><Truck /><span><strong>Pristatymas visoje Lietuvoje</strong><small>Terminas patvirtinamas užsakyme</small></span></div><div><PackageCheck /><span><strong>Garantinis aptarnavimas</strong><small>Specializuotas EV Projects servisas</small></span></div></div>
          </div>
        </div>
        <div className="product-information">
          <section><p className="eyebrow dark"><span /> APRAŠYMAS</p><h2>Apie produktą</h2><p>{product.summary}</p>{product.description.length > product.summary.length && <p>{product.description.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(380, 1400)}</p>}</section>
          <aside><h3>Techniniai duomenys</h3><dl><div><dt>SKU</dt><dd>{variant.sku}</dd></div>{specs.map((item) => <div key={item.id}><dt>{item.facet.name}</dt><dd>{item.name}</dd></div>)}<div><dt>Prieinamumas</dt><dd>Sandėlyje</dd></div></dl></aside>
        </div>
        <section className="related"><div className="section-heading"><div><p className="eyebrow dark"><span /> DERINKITE KARTU</p><h2>Susijusios prekės</h2></div></div><div className="product-grid compact">{productData.products.filter((item) => item.id !== product.id && productCategories(item).some((c) => productCategories(product).includes(c))).slice(0, 4).map((item) => <ProductCard key={item.id} product={item} />)}</div></section>
      </div>
    </main>
  );
}

function NotFoundProduct() {
  return <main className="empty-state site-shell py-28"><ShoppingBag /><h1>Prekė nerasta</h1><p>Gali būti, kad produkto adresas pasikeitė.</p><Button asChild><Link href="/parduotuve">Atverti parduotuvę</Link></Button></main>;
}

export function CartPage({ checkout = false }: { checkout?: boolean }) {
  const { items, total, removeItem, setQuantity, clear } = useCart();
  const [placed, setPlaced] = React.useState(false);
  if (placed) return <main className="site-shell py-28"><div className="form-success"><span><Check /></span><h1>Užsakymas paruoštas</h1><p>Tai demonstracinė versija: mokėjimas nebuvo atliktas. Prijungus „Vendure“, „Paysera“ ir pristatymo būdus, čia bus tikras užsakymo numeris.</p><Button asChild onClick={clear}><Link href="/parduotuve">Grįžti į parduotuvę</Link></Button></div></main>;
  if (!items.length) return <main className="empty-state site-shell py-28"><ShoppingBag /><h1>Krepšelis tuščias</h1><p>Peržiūrėkite bendrą įrangos katalogą ir pasirinkite tinkamą produktą.</p><Button asChild><Link href="/parduotuve">Rinktis prekes</Link></Button></main>;
  return (
    <main className="site-shell py-12 lg:py-20">
      <p className="eyebrow dark"><span /> {checkout ? "ATSISKAITYMAS" : "KREPŠELIS"}</p><h1 className="page-title">{checkout ? "Užsakymo informacija" : "Jūsų krepšelis"}</h1>
      <div className="cart-layout">
        <div>
          {!checkout && <div className="cart-items">{items.map((item) => <article key={item.id} className="cart-item">{item.image ? <img src={item.image} alt="" /> : <span className="cart-placeholder"><ShoppingBag /></span>}<div><h2>{item.name}</h2><p>SKU: {item.sku}</p><div className="quantity"><button onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="Sumažinti"><Minus /></button><span>{item.quantity}</span><button onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="Padidinti"><Plus /></button></div></div><strong>{eur(item.price * item.quantity)}</strong><button className="remove" onClick={() => removeItem(item.id)} aria-label={`Pašalinti ${item.name}`}><Trash2 /></button></article>)}</div>}
          {checkout && <form className="checkout-form" id="checkout-form" onSubmit={(event) => { event.preventDefault(); setPlaced(true); }}><h2>Kontaktinė informacija</h2><div className="grid gap-5 md:grid-cols-2"><label>Vardas ir pavardė *<Input required name="name" /></label><label>El. paštas *<Input required name="email" type="email" /></label><label>Telefonas *<Input required name="phone" /></label><label>Pirkėjo tipas<NativeSelect><NativeSelectOption>Fizinis asmuo</NativeSelectOption><NativeSelectOption>Juridinis asmuo</NativeSelectOption></NativeSelect></label><label className="md:col-span-2">Pristatymo adresas *<Input required name="address" /></label><label>Pristatymas<NativeSelect><NativeSelectOption>Kurjeris</NativeSelectOption><NativeSelectOption>Atsiėmimas Vilniuje</NativeSelectOption><NativeSelectOption>Paštomatas (kai galima)</NativeSelectOption></NativeSelect></label><label>Mokėjimas<NativeSelect><NativeSelectOption>Paysera</NativeSelectOption><NativeSelectOption>Bankinis pavedimas</NativeSelectOption></NativeSelect></label></div></form>}
        </div>
        <aside className="order-summary"><h2>Užsakymo santrauka</h2>{items.map((item) => <div key={item.id}><span>{item.name} × {item.quantity}</span><strong>{eur(item.price * item.quantity)}</strong></div>)}<div><span>Pristatymas</span><strong>Bus apskaičiuotas</strong></div><div className="total"><span>Iš viso</span><strong>{eur(total)}</strong></div>{checkout ? <Button form="checkout-form" type="submit" size="lg">Patvirtinti demonstracinį užsakymą</Button> : <Button asChild size="lg"><Link href="/parduotuve/atsiskaitymas">Tęsti užsakymą <ChevronRight /></Link></Button>}<p>Galutinė pristatymo kaina ir mokėjimo prievolė patvirtinama atsiskaitymo žingsnyje.</p></aside>
      </div>
    </main>
  );
}

export function AccountPage() {
  return (
    <main className="account-page site-shell py-16 lg:py-24">
      <div className="account-panel">
        <div className="account-intro"><p className="eyebrow"><span /> KLIENTO ERDVĖ</p><h1>Jūsų užsakymai ir adresai vienoje vietoje.</h1><p>Prisijungę galėsite stebėti užsakymų būsenas, išsaugoti pristatymo adresus ir greičiau apsipirkti.</p></div>
        <Tabs defaultValue="login" className="account-tabs">
          <TabsList><TabsTrigger value="login">Prisijungti</TabsTrigger><TabsTrigger value="register">Registruotis</TabsTrigger></TabsList>
          <TabsContent value="login"><form onSubmit={(event) => event.preventDefault()}><label>El. paštas<Input required type="email" /></label><label>Slaptažodis<Input required type="password" /></label><Button type="submit">Prisijungti demonstraciniu režimu</Button><button type="button" className="forgot">Pamiršote slaptažodį?</button></form></TabsContent>
          <TabsContent value="register"><form onSubmit={(event) => event.preventDefault()}><label>Vardas ir pavardė<Input required /></label><label>El. paštas<Input required type="email" /></label><label>Slaptažodis<Input required type="password" minLength={8} /></label><Button type="submit">Sukurti demonstracinę paskyrą</Button></form></TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
