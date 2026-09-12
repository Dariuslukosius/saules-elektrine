import { SiteRouter } from "@/components/site-pages";

export default async function DynamicPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ kategorija?: string | string[] }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const category = Array.isArray(query.kategorija) ? query.kategorija[0] : query.kategorija;
  return <SiteRouter segments={slug} storeCategory={category} />;
}
