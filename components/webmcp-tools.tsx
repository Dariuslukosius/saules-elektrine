"use client";

import * as React from "react";
import productData from "@/data/products.json";
import { useCart } from "@/components/cart-context";

type WebMcpContext = {
  registerTool: (tool: {
    name: string;
    title?: string;
    description: string;
    inputSchema: object;
    annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
    execute: (input: unknown) => unknown | Promise<unknown>;
  }, options?: { signal?: AbortSignal }) => void | Promise<void>;
};

declare global {
  interface Document { modelContext?: WebMcpContext }
}

export function WebMcpTools() {
  const cart = useCart();
  React.useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = (tool: Parameters<WebMcpContext["registerTool"]>[0]) => {
      try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch {}
    };

    register({
      name: "search_products",
      title: "Ieškoti EV Projects prekių",
      description: "Ieško prekių dabartiniame EV Projects kataloge pagal pavadinimą arba SKU.",
      inputSchema: { type: "object", properties: { query: { type: "string", minLength: 1 } }, required: ["query"], additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input) {
        const query = typeof input === "object" && input && "query" in input ? String((input as { query: unknown }).query).trim().toLowerCase() : "";
        if (!query) throw new Error("Paieškos tekstas negali būti tuščias.");
        return productData.products.filter((product) => `${product.name} ${product.variants.map(v => v.sku).join(" ")}`.toLowerCase().includes(query)).slice(0, 10).map((product) => ({ name: product.name, slug: product.slug, price_eur: Math.min(...product.variants.map(v => v.priceWithTax)) / 100, variants: product.variants.length }));
      },
    });

    register({
      name: "add_product_to_cart",
      title: "Įdėti prekę į krepšelį",
      description: "Įdeda pasirinktą produkto variantą į tą patį krepšelį, kurį mato svetainės lankytojas.",
      inputSchema: { type: "object", properties: { slug: { type: "string" }, sku: { type: "string" } }, required: ["slug"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const value = input as { slug?: string; sku?: string };
        const product = productData.products.find((item) => item.slug === value?.slug);
        if (!product) throw new Error("Produktas nerastas.");
        const variant = (value.sku ? product.variants.find((item) => item.sku === value.sku) : product.variants[0]);
        if (!variant) throw new Error("Produkto variantas nerastas.");
        cart.addItem({ id: variant.id, productId: product.id, slug: product.slug, name: product.name, sku: variant.sku, price: variant.priceWithTax / 100, image: product.image });
        return { status: "added", product: product.name, sku: variant.sku };
      },
    });

    register({
      name: "read_cart",
      title: "Peržiūrėti krepšelį",
      description: "Grąžina lankytojo dabartinio krepšelio prekes ir bendrą sumą.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute() { return { count: cart.count, total_eur: cart.total, items: cart.items.map((item) => ({ name: item.name, sku: item.sku, quantity: item.quantity, price_eur: item.price })) }; },
    });

    return () => lifecycle.abort();
  }, [cart]);
  return null;
}
