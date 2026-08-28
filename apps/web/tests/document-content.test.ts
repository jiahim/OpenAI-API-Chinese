import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
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
  const document = documentMetadataForRoute(
    "zh",
    "/api/docs/actions/actions-library",
  );

  assert.ok(document?.sourceUpdatedAt);
  assert.ok(document.translatedAt);
  assert.ok(Number.isFinite(Date.parse(document.sourceUpdatedAt)));
  assert.ok(Number.isFinite(Date.parse(document.translatedAt)));
});

test("never derives Chinese page metadata descriptions from article body text", () => {
  const localizedDocuments = generatedDocuments.filter(
    (document) => document.locale === "zh",
  );

  assert.ok(localizedDocuments.length > 400);
  for (const document of localizedDocuments) {
    assert.equal(
      document.description,
      "",
      `${document.route} has an inferred description`,
    );
  }
});

test("renders every document header in title, timestamps, source notice, body order", async () => {
  const document = await loadDocumentForRoute(
    "zh",
    "/api/docs/actions/getting-started",
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
  assert.equal(
    html.match(/新南威尔士州国家气象局/gu)?.length,
    1,
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

test("ships update batches with article-level change details", () => {
  const release = syncReleases()[0];
  assert.ok(release);
  assert.equal(release.added.length, 1);
  assert.equal(release.modified.length, 56);
  assert.equal(release.removed.length, 0);
  assert.equal(release.added[0]?.title, "Mutual TLS");
});

test("keeps the requested contact image and analytics identifiers", async () => {
  const [contact, layout] = await Promise.all([
    readFile(resolve("components/contact-popover.tsx"), "utf8"),
    readFile(resolve("app/layout.tsx"), "utf8"),
  ]);

  assert.match(
    contact,
    /https:\/\/jiahim-picgo\.oss-cn-shenzhen\.aliyuncs\.com\/img\/xhs\.jpg/u,
  );
  assert.match(layout, /https:\/\/analytics\.xiexin\.dev\/script\.js/u);
  assert.match(layout, /7136f50d-7292-484d-a837-e42bddae3a5f/u);
});
