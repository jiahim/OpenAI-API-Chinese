import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import {
  generatedDocuments,
  sourceCheckSchedule,
  sourceGeneratedAt,
  translationStatus,
  translationGeneratedAt,
} from "../generated/documents.js";
import {
  bilingualPageCount,
  catalogDocumentForRoute,
  documentMetadataForRoute,
  navigation,
  sourcePageCount,
  translationStateForRoute,
} from "../lib/documents.js";
import { loadDocumentForRoute } from "../lib/document-content.js";
import { rewriteDocumentLink } from "../lib/links.js";

const SOURCE =
  "https://developers.openai.com/api/docs/guides/agents/quickstart.md";
const repositoryRoot = fileURLToPath(new URL("../../..", import.meta.url));

describe("document link rewriting", () => {
  it("rewrites absolute official Markdown links to the current local language", () => {
    assert.deepEqual(
      rewriteDocumentLink(
        "https://developers.openai.com/api/docs/guides/tools.md#usage",
        "zh",
        SOURCE,
      ),
      {
        external: false,
        href: "/zh/api/docs/guides/tools#usage",
        sourceMirror: true,
      },
    );
  });

  it("resolves relative and root-relative official links locally", () => {
    assert.equal(
      rewriteDocumentLink("../tools.md", "en", SOURCE).href,
      "/en/api/docs/guides/tools",
    );
    assert.equal(
      rewriteDocumentLink("/api/reference/responses", "zh", SOURCE).href,
      "/zh/api/reference/responses",
    );
    assert.equal(
      rewriteDocumentLink("/api/docs/llms.txt", "zh", SOURCE).href,
      "/zh/api/docs",
    );
    assert.equal(
      rewriteDocumentLink("/api/docs/llms-full.txt", "zh", SOURCE).external,
      true,
    );
  });

  it("marks real external links and rejects unsafe protocols", () => {
    const external = rewriteDocumentLink(
      "https://platform.openai.com/traces",
      "zh",
      SOURCE,
    );
    assert.equal(external.external, true);
    assert.equal(external.href, "https://platform.openai.com/traces");
    assert.equal(
      rewriteDocumentLink("javascript:alert(1)", "zh", SOURCE).href,
      "#unsupported-link",
    );
  });

  it("ships all English sources while retaining translated Chinese pages", async () => {
    const [sourceManifest, translationManifest] = await Promise.all([
      readFile(resolve(repositoryRoot, "docs/en/.source-manifest.json"), "utf8").then(
        (value) => JSON.parse(value) as {
          pages: Record<
            string,
            { sourceUrl: string; status: "active" | "removed" }
          >;
        },
      ),
      readFile(
        resolve(repositoryRoot, "docs/zh/.translation-manifest.json"),
        "utf8",
      ).then((value) => JSON.parse(value) as {
        pages: Record<string, { sourceUrl: string }>;
      }),
    ]);
    for (const [sourceUrl, page] of Object.entries(sourceManifest.pages)) {
      assert.equal(page.sourceUrl, sourceUrl);
    }
    for (const [sourceUrl, page] of Object.entries(translationManifest.pages)) {
      assert.equal(page.sourceUrl, sourceUrl);
    }
    const activeSourceUrls = new Set(
      Object.values(sourceManifest.pages)
        .filter((page) => page.status === "active")
        .map((page) => page.sourceUrl),
    );
    const activeTranslationSourceUrls = Object.values(translationManifest.pages)
      .filter((page) => activeSourceUrls.has(page.sourceUrl))
      .map((page) => page.sourceUrl)
      .sort();
    const generatedEnglishSourceUrls = generatedDocuments
      .filter((document) => document.locale === "en")
      .map((document) => document.sourceUrl)
      .sort();
    const generatedChineseSourceUrls = generatedDocuments
      .filter((document) => document.locale === "zh")
      .map((document) => document.sourceUrl)
      .sort();

    assert.ok(activeSourceUrls.size > 0);
    assert.ok(activeTranslationSourceUrls.length > 0);
    assert.equal(new Set(generatedEnglishSourceUrls).size, generatedEnglishSourceUrls.length);
    assert.equal(new Set(generatedChineseSourceUrls).size, generatedChineseSourceUrls.length);
    assert.deepEqual(generatedEnglishSourceUrls, [...activeSourceUrls].sort());
    assert.deepEqual(generatedChineseSourceUrls, activeTranslationSourceUrls);
    assert.equal(sourcePageCount, activeSourceUrls.size);
    assert.equal(bilingualPageCount, activeTranslationSourceUrls.length);

    const representativeSourceUrl = activeTranslationSourceUrls[0];
    assert.ok(representativeSourceUrl);
    const representativeRoute = new URL(representativeSourceUrl).pathname.replace(
      /\.md$/u,
      "",
    );
    assert.ok(documentMetadataForRoute("zh", representativeRoute));
    assert.ok(documentMetadataForRoute("en", representativeRoute));
    const loaded = await loadDocumentForRoute("en", representativeRoute);
    assert.match(loaded?.markdown ?? "", /^#/u);
    assert.ok(catalogDocumentForRoute(representativeRoute));
  });

  it("preserves the complete official grouping and order", () => {
    const sections = navigation();
    assert.deepEqual(sections.map((section) => section.route), [
      "/api/docs",
      "/api/reference",
    ]);
    assert.equal(
      sections.flatMap((section) => section.groups.flatMap((group) => group.entries)).length,
      sourcePageCount,
    );
    assert.equal(sections[0]?.groups[0]?.title, "Documentation sets");
    assert.equal(sections[1]?.groups[0]?.title, "Documentation sets");
    assert.equal(sections[0]?.groups[0]?.externalEntries.length, 1);
  });

  it("derives homepage timestamps and schedule from repository facts", async () => {
    const [sourceManifest, translationManifest, workflow] = await Promise.all([
      readFile(resolve(repositoryRoot, "docs/en/.source-manifest.json"), "utf8").then(JSON.parse),
      readFile(resolve(repositoryRoot, "docs/zh/.translation-manifest.json"), "utf8").then(JSON.parse),
      readFile(resolve(repositoryRoot, ".github/workflows/sync-docs.yml"), "utf8"),
    ]);
    assert.equal(sourceGeneratedAt, sourceManifest.generatedAt);
    assert.equal(translationGeneratedAt, translationManifest.generatedAt);

    const cron = /- cron:\s*["']?(\d{1,2})\s+(\d{1,2})\s+\*\s+\*\s+\*/u.exec(workflow);
    assert.ok(cron?.[1] && cron[2]);
    const expectedHour = (Number(cron[2]) + 8) % 24;
    const expectedSchedule = `每天 ${String(expectedHour).padStart(2, "0")}:${cron[1].padStart(2, "0")} · 北京时间`;
    assert.equal(sourceCheckSchedule, expectedSchedule);
  });

  it("derives mutually exclusive homepage translation states", () => {
    assert.equal(
      translationStatus.current + translationStatus.stale,
      bilingualPageCount,
    );
    assert.equal(
      translationStatus.current +
        translationStatus.stale +
        translationStatus.pending,
      sourcePageCount,
    );
    assert.equal(
      translationStatus.stale,
      translationStatus.staleSource + translationStatus.stalePolicy,
    );
    assert.equal(translationStatus.totalActive, sourcePageCount);
  });

  it("exposes the same translation state for navigation and document badges", () => {
    const states = navigation().flatMap((section) =>
      section.groups.flatMap((group) =>
        group.entries.map((entry) => translationStateForRoute(entry.route)),
      ),
    );
    assert.equal(states.filter((state) => state === "current").length, translationStatus.current);
    assert.equal(states.filter((state) => state === "pending").length, translationStatus.pending);
    assert.equal(
      states.filter((state) => state === "stale-source" || state === "stale-policy").length,
      translationStatus.stale,
    );
  });

  it("leaves Vercel output detection to the Next.js preset", async () => {
    const vercelConfig = JSON.parse(
      await readFile(resolve(repositoryRoot, "apps/web/vercel.json"), "utf8"),
    ) as Record<string, unknown>;
    assert.equal(vercelConfig.framework, "nextjs");
    assert.equal(vercelConfig.buildCommand, "pnpm build");
    assert.equal("outputDirectory" in vercelConfig, false);
  });
});
