import type { Locale } from "@/lib/documents";
import { localizedRoute } from "@/lib/documents";

const SOURCE_HOST = "developers.openai.com";

export interface RewrittenDocumentLink {
  external: boolean;
  href: string;
  sourceMirror: boolean;
}

function localSourcePath(pathname: string): string | null {
  if (pathname === "/llms.txt") return "/";
  if (pathname === "/api/docs/llms.txt") return "/api/docs";
  if (pathname === "/api/reference/llms.txt") return "/api/reference";
  if (pathname.endsWith(".txt")) return null;
  if (
    !pathname.startsWith("/api/docs/") &&
    !pathname.startsWith("/api/reference/")
  ) {
    return null;
  }
  return pathname.replace(/\.md$/u, "").replace(/\/$/u, "");
}

export function rewriteDocumentLink(
  rawHref: string | undefined,
  locale: Locale,
  sourceUrl: string,
): RewrittenDocumentLink {
  if (!rawHref || rawHref.startsWith("#")) {
    return { external: false, href: rawHref || "#", sourceMirror: false };
  }

  let resolved: URL;
  try {
    resolved = new URL(rawHref, sourceUrl);
  } catch {
    return { external: false, href: "#invalid-link", sourceMirror: false };
  }

  if (resolved.protocol !== "http:" && resolved.protocol !== "https:") {
    if (resolved.protocol === "mailto:" || resolved.protocol === "tel:") {
      return { external: true, href: resolved.toString(), sourceMirror: false };
    }
    return { external: false, href: "#unsupported-link", sourceMirror: false };
  }

  if (resolved.hostname === SOURCE_HOST) {
    const localPath = localSourcePath(resolved.pathname);
    if (localPath) {
      return {
        external: false,
        href: `${localizedRoute(locale, localPath)}${resolved.search}${resolved.hash}`,
        sourceMirror: true,
      };
    }
  }

  return { external: true, href: resolved.toString(), sourceMirror: false };
}

export function resolveDocumentAsset(
  rawSource: string | undefined,
  sourceUrl: string,
): string | undefined {
  if (!rawSource) return undefined;
  try {
    const resolved = new URL(rawSource, sourceUrl);
    return resolved.protocol === "https:" ? resolved.toString() : undefined;
  } catch {
    return undefined;
  }
}
