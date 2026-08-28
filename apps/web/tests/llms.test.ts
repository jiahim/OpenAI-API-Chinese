import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GET } from "../app/llms.txt/route.js";
import {
  catalogDocumentForRoute,
  documentMetadataForRoute,
} from "../lib/documents.js";
import { buildLlmsText } from "../lib/llms.js";

const TEST_ORIGIN = "https://docs.example.com";

function localDocumentLinks(content: string): URL[] {
  return [...content.matchAll(/\]\((https:\/\/docs\.example\.com\/[^)]+)\)/gu)]
    .map((match) => new URL(match[1] ?? TEST_ORIGIN))
    .filter((url) => /^\/(?:zh|en)\/api\/(?:docs|reference)\/.+/u.test(url.pathname));
}

describe("llms.txt", () => {
  it("builds a concise bilingual index with provenance", () => {
    const content = buildLlmsText(TEST_ORIGIN);

    assert.match(content, /^# OpenAI API 中文文档\n/u);
    assert.match(content, /社区维护/u);
    assert.match(content, /不是 OpenAI 官方网站/u);
    assert.match(content, /https:\/\/docs\.example\.com\/zh\/api\/docs/u);
    assert.match(content, /https:\/\/docs\.example\.com\/en\/api\/reference/u);
    assert.match(content, /https:\/\/developers\.openai\.com\/api\//u);
    assert.match(content, /https:\/\/github\.com\/jiahim\/OpenAI-API-Chinese/u);
    assert.doesNotMatch(content, /localhost/u);
    assert.ok(content.length < 30_000);
    assert.ok(content.endsWith("\n"));
  });

  it("only links featured pages that exist in the requested locale", () => {
    const links = localDocumentLinks(buildLlmsText(TEST_ORIGIN));

    assert.ok(links.length >= 10);
    for (const link of links) {
      const match = /^\/(zh|en)(\/api\/(?:docs|reference)\/.+)$/u.exec(link.pathname);
      assert.ok(match?.[1] && match[2]);
      const locale = match[1] as "zh" | "en";
      const route = match[2];
      assert.ok(catalogDocumentForRoute(route), `Missing catalog route: ${route}`);
      assert.ok(
        documentMetadataForRoute(locale, route),
        `Missing ${locale} document: ${route}`,
      );
    }
  });

  it("serves the generated index as UTF-8 plain text", async () => {
    const response = GET();

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "text/plain; charset=utf-8");
    assert.match(await response.text(), /^# OpenAI API 中文文档\n/u);
  });
});
