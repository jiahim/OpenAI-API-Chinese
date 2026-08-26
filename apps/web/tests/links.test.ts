import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, it } from "node:test";

import {
  generatedDocuments,
  sourceCheckSchedule,
  sourceGeneratedAt,
  translationGeneratedAt,
} from "../generated/documents.js";
import {
  bilingualPageCount,
  catalogDocumentForRoute,
  documentMetadataForRoute,
  navigation,
  sourcePageCount,
} from "../lib/documents.js";
import { loadDocumentForRoute } from "../lib/document-content.js";
import { rewriteDocumentLink } from "../lib/links.js";

const SOURCE =
  "https://developers.openai.com/api/docs/guides/agents/quickstart.md";

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
    assert.equal(
      generatedDocuments.filter((document) => document.locale === "en").length,
      sourcePageCount,
    );
    assert.ok(bilingualPageCount >= 3);
    assert.ok(sourcePageCount >= 400);
    assert.ok(documentMetadataForRoute("zh", "/api/docs/models"));
    assert.ok(documentMetadataForRoute("en", "/api/docs/guides/tools"));
    const loaded = await loadDocumentForRoute("en", "/api/docs/guides/tools");
    assert.match(loaded?.markdown ?? "", /^#/u);
    assert.ok(catalogDocumentForRoute("/api/docs/guides/tools"));
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
    const repositoryRoot = resolve(process.cwd(), "../..");
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

  it("leaves Vercel output detection to the Next.js preset", async () => {
    const vercelConfig = JSON.parse(
      await readFile(resolve(process.cwd(), "vercel.json"), "utf8"),
    ) as Record<string, unknown>;
    assert.equal(vercelConfig.framework, "nextjs");
    assert.equal(vercelConfig.buildCommand, "pnpm build");
    assert.equal("outputDirectory" in vercelConfig, false);
  });
});
