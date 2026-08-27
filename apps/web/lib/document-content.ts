import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";

import {
  documentMetadataForRoute,
  type GeneratedDocument,
  type Locale,
} from "@/lib/documents";

function markdownHeadings(markdown: string): Array<{ depth: 2 | 3; text: string }> {
  let inFence = false;
  const result: Array<{ depth: 2 | 3; text: string }> = [];
  for (const rawLine of markdown.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+)$/u.exec(line);
    if (!match?.[1] || !match[2]) continue;
    result.push({
      depth: match[1].length as 2 | 3,
      text: match[2].replace(/[*_`]/gu, "").trim(),
    });
  }
  return result;
}

export function removeOfficialIndexNotice(markdown: string): string {
  return markdown
    .split(/\r?\n/u)
    .filter((line) => {
      const normalized = line.trim();
      return !(
        normalized.startsWith(">") &&
        normalized.includes("[llms.txt](/llms.txt)") &&
        normalized.includes("`.md`")
      );
    })
    .join("\n")
    .replace(/\n{3,}/gu, "\n\n");
}

export async function loadDocumentForRoute(
  locale: Locale,
  route: string,
): Promise<GeneratedDocument | undefined> {
  const metadata = documentMetadataForRoute(locale, route);
  if (!metadata) return undefined;

  const repositoryRoot = resolve(process.cwd(), "../..");
  const isEnglish = metadata.contentPath.startsWith("docs/en/");
  const isChinese = metadata.contentPath.startsWith("docs/zh/");
  if (!isEnglish && !isChinese) {
    throw new Error(`文档路径越界：${metadata.contentPath}`);
  }
  const contentRoot = resolve(repositoryRoot, isEnglish ? "docs/en" : "docs/zh");
  const relativePath = metadata.contentPath.slice("docs/xx/".length);
  const contentPath = resolve(contentRoot, relativePath);
  if (!contentPath.startsWith(contentRoot + sep)) {
    throw new Error(`文档路径越界：${metadata.contentPath}`);
  }
  const markdown = removeOfficialIndexNotice(await readFile(contentPath, "utf8"));
  return { ...metadata, markdown, headings: markdownHeadings(markdown) };
}
