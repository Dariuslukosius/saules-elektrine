import { SiteRouter } from "@/components/site-pages";

export default async function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <SiteRouter segments={slug} />;
}
