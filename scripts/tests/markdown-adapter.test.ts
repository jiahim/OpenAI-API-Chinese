import assert from "node:assert/strict";
import { test } from "node:test";

import type { TranslationResult } from "@easy-translate/core";

import {
  markdownDocumentAdapter,
  type MarkdownFormatState,
} from "../translation/markdown-adapter.ts";
import { MARKDOWN_ADAPTER_POLICY_VERSION } from "../translation/planner.ts";

function result(translations: ReadonlyMap<string, string>): TranslationResult {
  return {
    checkpoint: {
      documentId: "test",
      schemaVersion: 1,
      targetLanguage: "zh-CN",
      translations: [],
    },
    stats: {
      batches: 0,
      characters: 0,
      freshlyTranslatedUnits: 0,
      fromCheckpointUnits: 0,
      translatedUnits: translations.size,
      uniqueUnits: translations.size,
    },
    translations,
  };
}

async function identity(source: string): Promise<string> {
  const prepared = await markdownDocumentAdapter.prepare({
    content: source,
    id: "fixture.md",
  });
  return markdownDocumentAdapter.render(
    prepared.formatState,
    result(new Map(prepared.plan.units.map((unit) => [unit.id, unit.text]))),
  );
}

test("identity render preserves every Markdown byte and excludes protected content", async () => {
  const source = `---
title: Never translate
---
# Translate this

Paragraph with \`inline_code()\` and <https://example.com/raw>.

Visible before<!-- protected HTML comment -->visible after.

    indented_code("never")

\`\`\`ts
const secret = "never";
\`\`\`

<Callout title="Never">Hidden **MDX body**</Callout>

{/* MDX comment */}
`;
  const prepared = await markdownDocumentAdapter.prepare({ content: source, id: "fixture.md" });
  const texts = prepared.plan.units.map((unit) => unit.text).join("|");
  assert.match(texts, /Translate this/u);
  assert.doesNotMatch(
    texts,
    /Never translate|inline_code|indented_code|secret|MDX body|example\.com|protected HTML comment/u,
  );
  assert.ok(prepared.plan.units.some((unit) => unit.text === "Visible before"));
  assert.ok(prepared.plan.units.some((unit) => unit.text === "visible after."));
  assert.ok(
    prepared.plan.units.every((unit) => unit.text.trim() === unit.text),
  );
  assert.equal(prepared.formatState.policyVersion, MARKDOWN_ADAPTER_POLICY_VERSION);
  assert.equal(await identity(source), source);
});

test("headings, body, lists, quotes, tables, link labels and image alt are replaceable", async () => {
  const source = `# Heading

Body text.

- List item

> Quote text

| Name | Value |
| --- | --- |
| Alpha | One |

[OpenAI docs](https://example.com/path?q=1) and ![A chart](./chart.png "title")
`;
  const prepared = await markdownDocumentAdapter.prepare({ content: source, id: "fixture.md" });
  const replacements = new Map([
    ["Heading", "标题"],
    ["Body text.", "正文。"],
    ["List item", "列表项"],
    ["Quote text", "引用文本"],
    ["Name", "名称"],
    ["Value", "值"],
    ["Alpha", "阿尔法"],
    ["One", "一"],
    ["OpenAI docs", "OpenAI 文档"],
    ["and", "以及"],
    ["A chart", "一张图表"],
  ]);
  const translations = new Map(
    prepared.plan.units.map((unit) => [
      unit.id,
      replacements.get(unit.text) ?? unit.text,
    ]),
  );
  const rendered = await markdownDocumentAdapter.render(
    prepared.formatState,
    result(translations),
  );
  assert.match(rendered, /^# 标题$/mu);
  assert.match(rendered, /^- 列表项$/mu);
  assert.match(rendered, /^> 引用文本$/mu);
  assert.match(rendered, /\| 名称 \| 值 \|/u);
  assert.match(rendered, /\[OpenAI 文档\]\(https:\/\/example\.com\/path\?q=1\)/u);
  assert.match(rendered, /!\[一张图表\]\(\.\/chart\.png "title"\)/u);
  assert.deepEqual(
    new Set(prepared.plan.units.map((unit) => unit.context.block)),
    new Set(["heading", "body", "list", "quote", "table"]),
  );
  assert.equal(
    prepared.plan.units.find((unit) => unit.text === "OpenAI docs")?.context.kind,
    "link-label",
  );
  assert.equal(
    prepared.plan.units.find((unit) => unit.text === "A chart")?.context.kind,
    "image-alt",
  );
  assert.equal(
    prepared.plan.units.find((unit) => unit.text === "Body text.")?.context.fragmented,
    false,
  );
  assert.ok(
    prepared.plan.units
      .filter((unit) => ["OpenAI docs", "and", "A chart"].includes(unit.text))
      .every((unit) => unit.context.fragmented),
  );
  assert.equal(
    prepared.plan.units.find((unit) => unit.text === "OpenAI docs")?.batchKey,
    prepared.plan.units.find((unit) => unit.text === "and")?.batchKey,
  );
});

test("multiline list and quote source ranges never consume continuation markers", async () => {
  const source = `- first line
  second line

> quoted first
> quoted second
`;
  const prepared = await markdownDocumentAdapter.prepare({ content: source, id: "fixture.md" });
  assert.deepEqual(
    prepared.plan.units.map((unit) => unit.text),
    ["first line", "second line", "quoted first", "quoted second"],
  );
  const rendered = await markdownDocumentAdapter.render(
    prepared.formatState,
    result(
      new Map(
        prepared.plan.units.map((unit) => [unit.id, `译:${unit.text}`]),
      ),
    ),
  );
  assert.equal(
    rendered,
    `- 译:first line
  译:second line

> 译:quoted first
> 译:quoted second
`,
  );
});

test("generated multiline navigation cards translate labels and descriptions", async () => {
  const source = `  [Agent definitions



        Shape one specialist cleanly before you scale the workflow.](https://developers.openai.com/api/docs/guides/agents/define-agents)
`;
  const prepared = await markdownDocumentAdapter.prepare({
    content: source,
    id: "fixture.md",
  });
  assert.deepEqual(
    prepared.plan.units.map((unit) => unit.text),
    [
      "Agent definitions",
      "Shape one specialist cleanly before you scale the workflow.",
    ],
  );
  assert.ok(
    prepared.plan.units.every((unit) => unit.context.kind === "link-label"),
  );
  assert.ok(prepared.plan.units.every((unit) => unit.context.fragmented));
  const rendered = await markdownDocumentAdapter.render(
    prepared.formatState,
    result(
      new Map([
        [prepared.plan.units[0]!.id, "智能体定义"],
        [prepared.plan.units[1]!.id, "在扩展工作流之前，先清晰地定义一个专家。"],
      ]),
    ),
  );
  assert.equal(
    rendered,
    `  [智能体定义



        在扩展工作流之前，先清晰地定义一个专家。](https://developers.openai.com/api/docs/guides/agents/define-agents)
`,
  );
});

test("render normalizes boundary whitespace and rejects unsafe results", async () => {
  const prepared = await markdownDocumentAdapter.prepare({
    content: "# Realtime API with WebRTC\n\nBody text.\n",
    id: "fixture.md",
  });
  const [first, second] = prepared.plan.units;
  assert.ok(first && second);
  assert.equal(first.id, "markdown-1-2-26");
  await assert.rejects(
    markdownDocumentAdapter.render(
      prepared.formatState,
      result(new Map([[first.id, first.text]])),
    ),
    /缺少单元/u,
  );
  await assert.rejects(
    markdownDocumentAdapter.render(
      prepared.formatState,
      result(
        new Map([
          [first.id, first.text],
          [second.id, second.text],
          ["unknown", "未知"],
        ]),
      ),
    ),
    /未知单元/u,
  );
  await assert.rejects(
    markdownDocumentAdapter.render(
      prepared.formatState,
      result(
        new Map([
          [first.id, "line one\nline two"],
          [second.id, second.text],
        ]),
      ),
    ),
    /换行/u,
  );
  assert.equal(
    await markdownDocumentAdapter.render(
      prepared.formatState,
      result(
        new Map([
          [first.id, "\r\n  使用 WebRTC 的 Realtime API \t"],
          [second.id, second.text],
        ]),
      ),
    ),
    "# 使用 WebRTC 的 Realtime API\n\nBody text.\n",
  );
  for (const invalid of ["   ", "control\u0001character"]) {
    await assert.rejects(
      markdownDocumentAdapter.render(
        prepared.formatState,
        result(
          new Map([
            [first.id, invalid],
            [second.id, second.text],
          ]),
        ),
      ),
      /空文本|控制字符/u,
    );
  }
  await assert.rejects(
    markdownDocumentAdapter.render(
      prepared.formatState,
      result(
        new Map([
          [first.id, "**injected**"],
          [second.id, second.text],
        ]),
      ),
    ),
    /受保护结构/u,
  );
});

test("render restores punctuation at fragmented Markdown boundaries", async () => {
  const source = "Use **`gpt-5.6`**. It works.\n";
  const prepared = await markdownDocumentAdapter.prepare({
    content: source,
    id: "fixture.md",
  });
  const translations = new Map(
    prepared.plan.units.map((unit) => [
      unit.id,
      unit.text === "Use" ? "使用" : "它可以工作。",
    ]),
  );

  assert.equal(
    await markdownDocumentAdapter.render(
      prepared.formatState,
      result(translations),
    ),
    "使用 **`gpt-5.6`**。它可以工作。\n",
  );
});

test("render preserves literal strong-delimiter whitespace", async () => {
  const source =
    "> 1.** Boil water**\n\n> Dolphins** are playful animals.**\n";
  const prepared = await markdownDocumentAdapter.prepare({
    content: source,
    id: "fixture.md",
  });
  const translations = new Map(
    prepared.plan.units.map((unit) => [
      unit.id,
      unit.text.startsWith("1.") ? "1. **烧开水**" : "海豚**是顽皮的动物。**",
    ]),
  );

  assert.equal(
    await markdownDocumentAdapter.render(
      prepared.formatState,
      result(translations),
    ),
    "> 1.** 烧开水**\n\n> 海豚** 是顽皮的动物。**\n",
  );
});

test("render rejects tampered ranges and prepare rejects invalid source hashes", async () => {
  const prepared = await markdownDocumentAdapter.prepare({
    content: "Body text.\n",
    id: "fixture.md",
  });
  const unit = prepared.plan.units[0];
  assert.ok(unit);
  const tampered: MarkdownFormatState = {
    ...prepared.formatState,
    ranges: [{ ...prepared.formatState.ranges[0]!, end: 999 }],
  };
  await assert.rejects(
    markdownDocumentAdapter.render(tampered, result(new Map([[unit.id, "正文"]]))),
    /区间无效/u,
  );
  await assert.rejects(
    markdownDocumentAdapter.render(
      { ...prepared.formatState, structureSignature: "0".repeat(64) },
      result(new Map([[unit.id, "正文"]])),
    ),
    /结构签名不匹配/u,
  );
  await assert.rejects(
    markdownDocumentAdapter.prepare({
      content: "Body text.\n",
      id: "fixture.md",
      sourceHash: "0".repeat(64),
    }),
    /sourceHash/u,
  );
});
