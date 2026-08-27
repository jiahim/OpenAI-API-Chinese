import {
  documentCatalog,
  generatedDocuments,
  navigationSections,
  syncReleases as generatedSyncReleases,
} from "@/generated/documents";

export type Locale = "en" | "zh";

export interface DocumentMetadata {
  bytes: number;
  locale: Locale;
  route: string;
  title: string;
  description: string;
  contentPath: string;
  section: "guides" | "reference";
  sourceUrl: string;
  sourceUpdatedAt: string;
  translatedAt?: string;
  reviewStatus: "machine" | "reviewed" | "source";
}

export interface GeneratedDocument extends DocumentMetadata {
  markdown: string;
  headings: readonly { depth: 2 | 3; text: string }[];
}

export interface CatalogDocument {
  bytes: number;
  route: string;
  title: string;
  description: string;
  contentPath: string;
  section: "guides" | "reference";
  sourceUrl: string;
  sourceUpdatedAt: string;
}

export type NavigationEntry = CatalogDocument;

export interface NavigationGroup {
  title: string;
  entries: readonly NavigationEntry[];
  externalEntries: readonly {
    description: string;
    sourceUrl: string;
    title: string;
  }[];
}

export interface NavigationSection {
  key: "guides" | "reference";
  route: "/api/docs" | "/api/reference";
  title: string;
  description: string;
  groups: readonly NavigationGroup[];
}

export interface SyncReleaseEntry {
  path: string;
  route: string;
  sourceUrl: string;
  title: string;
}

export interface SyncRelease {
  added: readonly SyncReleaseEntry[];
  generatedAt: string;
  id: string;
  modified: readonly SyncReleaseEntry[];
  removed: readonly SyncReleaseEntry[];
}

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "zh";
}

export function localizedRoute(locale: Locale, route: string): string {
  return `/${locale}${route.startsWith("/") ? route : `/${route}`}`;
}

export function routeFromSlug(slug: readonly string[]): string {
  return `/${slug.map((part) => decodeURIComponent(part)).join("/")}`;
}

export function documentMetadataForRoute(
  locale: Locale,
  route: string,
): DocumentMetadata | undefined {
  return generatedDocuments.find(
    (document) => document.locale === locale && document.route === route,
  ) as DocumentMetadata | undefined;
}

export function catalogDocumentForRoute(
  route: string,
): CatalogDocument | undefined {
  return documentCatalog.find((document) => document.route === route) as
    | CatalogDocument
    | undefined;
}

export function availableDocuments(locale: Locale): DocumentMetadata[] {
  return generatedDocuments.filter(
    (document) => document.locale === locale,
  ) as unknown as DocumentMetadata[];
}

export function navigation(): readonly NavigationSection[] {
  return navigationSections as readonly NavigationSection[];
}

export function sidebarNavigationGroups(
  section: NavigationSection,
): readonly NavigationGroup[] {
  return section.groups
    .filter((group) => group.entries.length > 0)
    .map((group) => ({ ...group, externalEntries: [] }));
}

export function syncReleases(): readonly SyncRelease[] {
  return generatedSyncReleases as readonly SyncRelease[];
}

export function syncReleaseById(id: string): SyncRelease | undefined {
  return syncReleases().find((release) => release.id === id);
}

export function navigationSectionForRoute(
  route: string,
): NavigationSection | undefined {
  return navigation().find(
    (section) => route === section.route || route.startsWith(`${section.route}/`),
  );
}

export function navigationGroupForRoute(
  route: string,
): NavigationGroup | undefined {
  return navigationSectionForRoute(route)?.groups.find((group) =>
    group.entries.some((entry) => entry.route === route),
  );
}

export function navigationNeighbors(route: string): {
  next?: NavigationEntry;
  previous?: NavigationEntry;
} {
  const entries = navigationSectionForRoute(route)?.groups.flatMap(
    (group) => group.entries,
  ) ?? [];
  const index = entries.findIndex((entry) => entry.route === route);
  if (index < 0) return {};
  return {
    previous: entries[index - 1],
    next: entries[index + 1],
  };
}

export function localizedDocumentTitle(locale: Locale, entry: NavigationEntry): string {
  return documentMetadataForRoute(locale, entry.route)?.title ?? entry.title;
}

export function hasLocalizedDocument(locale: Locale, route: string): boolean {
  return Boolean(documentMetadataForRoute(locale, route));
}

export function allGeneratedDocuments(): DocumentMetadata[] {
  return generatedDocuments as unknown as DocumentMetadata[];
}

export function oppositeLocale(locale: Locale): Locale {
  return locale === "zh" ? "en" : "zh";
}

export const sourcePageCount = documentCatalog.length;
export const maxInlineMarkdownBytes = 1_000_000;
export const bilingualPageCount = generatedDocuments.filter(
  (document) => document.locale === "zh",
).length;

export function headingSlug(text: string): string {
  const normalized = text
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/gu, "")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .replace(/\s+/gu, "-")
    .replace(/-+/gu, "-")
    .replace(/^-|-$/gu, "");
  return normalized || "section";
}

export function headingIds(
  headings: readonly { depth: number; text: string }[],
): Array<{ depth: number; id: string; text: string }> {
  const occurrences = new Map<string, number>();
  return headings.map((heading) => {
    const base = headingSlug(heading.text);
    const occurrence = occurrences.get(base) ?? 0;
    occurrences.set(base, occurrence + 1);
    return {
      ...heading,
      id: occurrence ? `${base}-${occurrence}` : base,
    };
  });
}
