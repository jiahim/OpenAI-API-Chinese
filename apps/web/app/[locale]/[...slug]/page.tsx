import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  DocumentReader,
  LargeDocument,
  MissingDocument,
  SectionIndex,
} from "@/components/document-reader";
import {
  catalogDocumentForRoute,
  documentMetadataForRoute,
  isLocale,
  navigation,
  maxInlineMarkdownBytes,
  routeFromSlug,
} from "@/lib/documents";
import { loadDocumentForRoute } from "@/lib/document-content";

interface DocumentPageProps {
  params: Promise<{ locale: string; slug: string[] }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  const routes = navigation().flatMap((section) => [
    section.route,
    ...section.groups.flatMap((group) => group.entries.map((entry) => entry.route)),
  ]);
  return (["zh", "en"] as const).flatMap((locale) =>
    routes.map((route) => ({ locale, slug: route.split("/").filter(Boolean) })),
  );
}

export async function generateMetadata({ params }: DocumentPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const route = routeFromSlug(slug);
  const document = documentMetadataForRoute(rawLocale, route);
  const catalogDocument = catalogDocumentForRoute(route);
  const section = navigation().find((entry) => entry.route === route);
  const title = document?.title ?? catalogDocument?.title ?? section?.title ?? "文档尚未收录";
  const description = document?.description ?? catalogDocument?.description ?? section?.description;
  return {
    title,
    description,
    alternates: {
      canonical: `/${rawLocale}${route}`,
      languages: {
        "zh-CN": `/zh${route}`,
        en: `/en${route}`,
      },
    },
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const route = routeFromSlug(slug);
  const section = navigation().find((entry) => entry.route === route);
  if (section) return <SectionIndex locale={rawLocale} section={section} />;

  const metadata = documentMetadataForRoute(rawLocale, route);
  if (metadata && metadata.bytes > maxInlineMarkdownBytes) {
    return <LargeDocument document={metadata} />;
  }
  const document = await loadDocumentForRoute(rawLocale, route);
  if (document) return <DocumentReader document={document} />;

  const catalogDocument = catalogDocumentForRoute(route);
  if (!catalogDocument) notFound();
  return (
    <MissingDocument
      locale={rawLocale}
      route={route}
      sourceUrl={catalogDocument?.sourceUrl}
      title={catalogDocument?.title ?? (rawLocale === "zh" ? "文档尚未收录" : "Document not bundled")}
    />
  );
}
