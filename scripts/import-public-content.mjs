import { mkdir, writeFile, access } from "node:fs/promises";
import { extname } from "node:path";

const root = new URL("../", import.meta.url);

async function ensure(path) {
  await mkdir(new URL(path, root), { recursive: true });
}

async function getJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

function stripHtml(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&#8222;|&bdquo;/g, "„")
    .replace(/&#8220;|&ldquo;/g, "“")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanSlug(value = "asset") {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "asset";
}

function extension(url, contentType = "") {
  const ext = extname(new URL(url).pathname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".pdf"].includes(ext)) {
    return ext === ".jpeg" ? ".jpg" : ext;
  }
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("svg")) return ".svg";
  if (contentType.includes("pdf")) return ".pdf";
  return ".jpg";
}

async function download(url, targetBase) {
  if (!url || !/^https:\/\//i.test(url)) return null;
  const provisional = new URL(`${targetBase}${extension(url)}`, root);
  try {
    await access(provisional);
    return `/${provisional.pathname.split("/public/")[1]}`;
  } catch {}

  const response = await fetch(url, { redirect: "follow" });
  if (!response.ok) return null;
  const target = new URL(`${targetBase}${extension(url, response.headers.get("content-type") || "")}`, root);
  const bytes = new Uint8Array(await response.arrayBuffer());
  await writeFile(target, bytes);
  return `/${target.pathname.split("/public/")[1]}`;
}

async function mapLimit(items, limit, fn) {
  const output = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      try {
        output[index] = await fn(items[index], index);
      } catch (error) {
        console.warn(`Skipped ${index}: ${error.message}`);
        output[index] = null;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return output;
}

await ensure("data/");
await ensure("public/assets/products/");
await ensure("public/assets/legacy/electrocars/");
await ensure("public/assets/legacy/saules-tinklas/");
await ensure("public/assets/legacy/sprsun/");

const productQuery = `query ProductsForMigration {
  products(options: { take: 100 }) {
    totalItems
    items {
      id name slug description
      featuredAsset { source source preview }
      assets { id name source preview }
      facetValues { id name facet { id name code } }
      variants {
        id name sku price priceWithTax currencyCode stockLevel
        featuredAsset { source preview }
        options { id name code group { id name code } }
      }
    }
  }
}`;

const productResponse = await getJson(
  "https://vendure.electrocarsshop.com/shop-api?languageCode=lt",
  {
    method: "POST",
    headers: { "content-type": "application/json", "vendure-language-code": "lt" },
    body: JSON.stringify({ query: productQuery }),
  },
);
if (productResponse.errors) throw new Error(JSON.stringify(productResponse.errors));

const productItems = productResponse.data.products.items;
const products = await mapLimit(productItems, 6, async (product) => {
  const uniqueAssets = [];
  const seen = new Set();
  for (const asset of [product.featuredAsset, ...(product.assets || [])]) {
    const source = asset?.preview || asset?.source;
    if (source && !seen.has(source)) {
      seen.add(source);
      uniqueAssets.push(source);
    }
  }
  const gallery = (await mapLimit(uniqueAssets.slice(0, 2), 2, (url, index) =>
    download(url, `public/assets/products/${cleanSlug(product.slug)}-${index}`),
  )).filter(Boolean);
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    summary: stripHtml(product.description).slice(0, 380),
    image: gallery[0] || null,
    gallery,
    facets: product.facetValues,
    variants: product.variants,
  };
});

await writeFile(
  new URL("data/products.json", root),
  JSON.stringify({ totalItems: productResponse.data.products.totalItems, products }, null, 2),
);

const sources = [
  { key: "electrocars", base: "https://electrocars.lt", pages: true, posts: true },
  { key: "saules-tinklas", base: "https://www.saulestinklas.lt", pages: true, posts: false },
  { key: "sprsun", base: "https://www.sprsunbaltic.lt", pages: true, posts: false },
];

const legacy = {};
for (const source of sources) {
  const records = [];
  if (source.pages) {
    const pages = await getJson(`${source.base}/wp-json/wp/v2/pages?per_page=100`);
    records.push(...pages.map((page) => ({ ...page, legacyType: "page" })));
  }
  if (source.posts) {
    const posts = await getJson(`${source.base}/wp-json/wp/v2/posts?per_page=100`);
    records.push(...posts.map((post) => ({ ...post, legacyType: "post" })));
  }

  legacy[source.key] = await mapLimit(records, 4, async (record) => {
    const html = record.content?.rendered || "";
    const imageUrls = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map((match) => match[1]);
    if (record.featured_media) {
      try {
        const media = await getJson(`${source.base}/wp-json/wp/v2/media/${record.featured_media}`);
        imageUrls.unshift(media.media_details?.sizes?.large?.source_url || media.source_url);
      } catch {}
    }
    const uniqueImages = [...new Set(imageUrls.filter((url) => /^https:\/\//i.test(url)))];
    const images = (await mapLimit(uniqueImages.slice(0, 4), 3, (url, index) =>
      download(url, `public/assets/legacy/${source.key}/${record.id}-${index}`),
    )).filter(Boolean);
    return {
      id: record.id,
      type: record.legacyType,
      slug: record.slug,
      title: stripHtml(record.title?.rendered || ""),
      excerpt: stripHtml(record.excerpt?.rendered || html).slice(0, 460),
      body: stripHtml(html).slice(0, 12000),
      date: record.date,
      images,
    };
  });
}

const manualAssets = [
  ["https://electrocars.lt/wp-content/uploads/2025/04/electrocars-006-1536x727.webp", "public/assets/legacy/electrocars/hero"],
  ["https://www.saulestinklas.lt/wp-content/uploads/2020/10/Saules-elektriniu-montavimas.png", "public/assets/legacy/saules-tinklas/hero"],
  ["https://www.saulestinklas.lt/wp-content/uploads/2020/05/Saules-paneliu-montavimas.jpg", "public/assets/legacy/saules-tinklas/project-panels"],
  ["https://www.sprsunbaltic.lt/wp-content/uploads/2024/10/Sprsun-slider-1.webp", "public/assets/legacy/sprsun/hero"],
  ["https://www.sprsunbaltic.lt/wp-content/uploads/2024/10/Sprsun-slider-2.webp", "public/assets/legacy/sprsun/installation"],
  ["https://www.sprsunbaltic.lt/wp-content/uploads/2025/01/Sprsun-R290-B-series.png", "public/assets/legacy/sprsun/product"],
];

legacy.manualAssets = Object.fromEntries(
  (await mapLimit(manualAssets, 4, async ([url, target]) => [target.split("/").at(-1), await download(url, target)]))
    .filter((entry) => entry?.[1]),
);

await writeFile(new URL("data/legacy-content.json", root), JSON.stringify(legacy, null, 2));
console.log(`Imported ${products.length} products and ${Object.values(legacy).flat().length} content records.`);
