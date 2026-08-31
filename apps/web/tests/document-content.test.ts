import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { DocumentReader } from "../components/document-reader.js";
import { generatedDocuments } from "../generated/documents.js";
import {
  loadDocumentForRoute,
  removeOfficialIndexNotice,
} from "../lib/document-content.js";
import {
  documentMetadataForRoute,
  navigation,
  sidebarNavigationGroups,
  syncReleases,
} from "../lib/documents.js";

interface SourceManifest {
  pages: Record<
    string,
    { sourceUrl: string; status: "active" | "removed" }
  >;
}

interface TranslationManifest {
  pages: Record<string, { sourceUrl: string }>;
}

interface SyncReleaseEntry {
  path: string;
  route: string;
  sourceUrl: string;
  title: string;
}

interface SyncReleaseRecord {
  added: SyncReleaseEntry[];
  generatedAt: string;
  id: string;
  modified: SyncReleaseEntry[];
  removed: SyncReleaseEntry[];
}

const repositoryRoot = fileURLToPath(new URL("../../..", import.meta.url));

test("removes the official llms.txt and Markdown boilerplate notice", () => {
  const markdown = [
    "# GPT Actions 库",
    "",
    "> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。",
    "",
    "## 目的",
    "",
    "正文",
  ].join("\n");

  assert.equal(
    removeOfficialIndexNotice(markdown),
    ["# GPT Actions 库", "", "## 目的", "", "正文"].join("\n"),
  );
});

test("keeps unrelated blockquotes", () => {
  const markdown = "> 这是需要保留的正文提示。\n\n正文";
  assert.equal(removeOfficialIndexNotice(markdown), markdown);
});

test("exposes source pull and translation timestamps for localized pages", () => {
  const localizedDocument = generatedDocuments.find(
    (document) => document.locale === "zh",
  );
  assert.ok(localizedDocument);
  const document = documentMetadataForRoute(
    "zh",
    localizedDocument.route,
  );

  assert.ok(document?.sourceUpdatedAt);
  assert.ok(document.translatedAt);
  assert.ok(Number.isFinite(Date.parse(document.sourceUpdatedAt)));
  assert.ok(Number.isFinite(Date.parse(document.translatedAt)));
});

test("never derives Chinese page metadata descriptions from article body text", async () => {
  const localizedDocuments = generatedDocuments.filter(
    (document) => document.locale === "zh",
  );
  const [sourceManifest, translationManifest] = await Promise.all([
    readFile(resolve(repositoryRoot, "docs/en/.source-manifest.json"), "utf8").then(
      (value) => JSON.parse(value) as SourceManifest,
    ),
    readFile(
      resolve(repositoryRoot, "docs/zh/.translation-manifest.json"),
      "utf8",
    ).then((value) => JSON.parse(value) as TranslationManifest),
  ]);
  const expectedLocalizedPageCount = Object.values(
    translationManifest.pages,
  ).filter((page) => sourceManifest.pages[page.sourceUrl]?.status === "active")
    .length;
  for (const [sourceUrl, page] of Object.entries(sourceManifest.pages)) {
    assert.equal(page.sourceUrl, sourceUrl);
  }
  for (const [sourceUrl, page] of Object.entries(translationManifest.pages)) {
    assert.equal(page.sourceUrl, sourceUrl);
  }
  const expectedSourceUrls = Object.values(translationManifest.pages)
    .filter((page) => sourceManifest.pages[page.sourceUrl]?.status === "active")
    .map((page) => page.sourceUrl)
    .sort();
  const actualSourceUrls = localizedDocuments
    .map((document) => document.sourceUrl)
    .sort();

  assert.ok(expectedLocalizedPageCount > 0);
  assert.equal(localizedDocuments.length, expectedLocalizedPageCount);
  assert.equal(new Set(actualSourceUrls).size, actualSourceUrls.length);
  assert.deepEqual(actualSourceUrls, expectedSourceUrls);
  for (const document of localizedDocuments) {
    assert.equal(
      document.description,
      "",
      `${document.route} has an inferred description`,
    );
  }
});

test("renders every document header in title, timestamps, source notice, body order", async () => {
  const localizedDocument = generatedDocuments
    .filter((document) => document.locale === "zh")
    .sort((left, right) => left.sourceUrl.localeCompare(right.sourceUrl))[0];
  assert.ok(localizedDocument);
  const document = await loadDocumentForRoute(
    "zh",
    localizedDocument.route,
  );
  assert.ok(document);

  const html = renderToStaticMarkup(createElement(DocumentReader, { document }));
  const titleIndex = html.indexOf("<h1>");
  const timestampsIndex = html.indexOf('class="document-timestamps"');
  const sourceNoticeIndex = html.indexOf('class="source-notice"');
  const bodyIndex = html.indexOf('class="markdown-body"');

  assert.ok(titleIndex >= 0);
  assert.ok(titleIndex < timestampsIndex);
  assert.ok(timestampsIndex < sourceNoticeIndex);
  assert.ok(sourceNoticeIndex < bodyIndex);
  const representativeBodyParagraph = [
    ...html.slice(bodyIndex).matchAll(/<p>([\s\S]*?)<\/p>/gu),
  ]
    .map((match) => (match[1] ?? "").replace(/<[^>]+>/gu, "").trim())
    .filter((paragraph) => paragraph.length > 0)
    .sort((left, right) => right.length - left.length)[0];
  assert.ok(representativeBodyParagraph);
  assert.equal(
    html.slice(0, bodyIndex).includes(representativeBodyParagraph),
    false,
    "article body must not be duplicated into the document header",
  );
  assert.match(html, /translation-status-badge/u);
  assert.match(
    html,
    document.translationState === "current" ? /译文为最新/u : /译文待更新/u,
  );
});

test("keeps external document bundles out of the ordinary article sidebar", () => {
  for (const section of navigation()) {
    const sidebarGroups = sidebarNavigationGroups(section);
    assert.ok(sidebarGroups.every((group) => group.entries.length > 0));
    assert.ok(
      sidebarGroups.every((group) => group.externalEntries.length === 0),
    );
  }
});

test("ships update batches with article-level change details", async () => {
  const release = syncReleases()[0];
  const updateDirectory = resolve(repositoryRoot, "docs/updates");
  const sourceReleases = await Promise.all(
    (await readdir(updateDirectory))
      .filter((fileName) => fileName.endsWith(".json"))
      .map((fileName) =>
        readFile(resolve(updateDirectory, fileName), "utf8").then(
          (value) => {
            const sourceRelease = JSON.parse(value) as SyncReleaseRecord;
            const timestamp = Date.parse(sourceRelease.generatedAt);
            assert.ok(Number.isFinite(timestamp));
            const expectedId = new Date(timestamp)
              .toISOString()
              .replace(/[.:]/gu, "-");
            assert.equal(sourceRelease.id, expectedId);
            assert.equal(fileName, `${expectedId}.json`);
            return { release: sourceRelease, timestamp };
          },
        ),
      ),
  );
  assert.equal(
    new Set(sourceReleases.map(({ release: item }) => item.id)).size,
    sourceReleases.length,
  );
  assert.equal(
    new Set(sourceReleases.map(({ timestamp }) => timestamp)).size,
    sourceReleases.length,
  );
  const expectedRelease = sourceReleases.reduce<
    { release: SyncReleaseRecord; timestamp: number } | undefined
  >(
    (latest, candidate) =>
      !latest || candidate.timestamp > latest.timestamp ? candidate : latest,
    undefined,
  )?.release;

  assert.ok(release);
  assert.ok(expectedRelease);
  assert.deepEqual(release, expectedRelease);

  const entries = [...release.added, ...release.modified, ...release.removed];
  assert.ok(entries.length > 0);
  assert.equal(new Set(entries.map((entry) => entry.path)).size, entries.length);
  assert.equal(new Set(entries.map((entry) => entry.route)).size, entries.length);
  assert.equal(new Set(entries.map((entry) => entry.sourceUrl)).size, entries.length);
  for (const entry of entries) {
    assert.match(entry.path, /^docs\/en\/api\/(?:docs|reference)\/.+\.md$/u);
    const source = new URL(entry.sourceUrl);
    assert.equal(source.origin, "https://developers.openai.com");
    assert.equal(source.search, "");
    assert.equal(source.hash, "");
    assert.equal(entry.sourceUrl, `${source.origin}${source.pathname}`);
    assert.equal(entry.path, `docs/en${source.pathname}`);
    assert.equal(entry.route, source.pathname.replace(/\.md$/u, ""));
    assert.ok(entry.title.trim());
  }
});

test("keeps the requested contact image and analytics identifiers", async () => {
  const [contact, layout] = await Promise.all([
    readFile(
      resolve(repositoryRoot, "apps/web/components/contact-popover.tsx"),
      "utf8",
    ),
    readFile(resolve(repositoryRoot, "apps/web/app/layout.tsx"), "utf8"),
  ]);

  assert.match(
    contact,
    /https:\/\/jiahim-picgo\.oss-cn-shenzhen\.aliyuncs\.com\/img\/xhs\.jpg/u,
  );
  assert.match(layout, /https:\/\/analytics\.xiexin\.dev\/script\.js/u);
  assert.match(layout, /7136f50d-7292-484d-a837-e42bddae3a5f/u);
});
