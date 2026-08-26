import assert from "node:assert/strict";
import test from "node:test";

import {
  defineProvider,
  TranslationErrorCode,
  TranslationResponseError,
} from "@easy-translate/core";

import {
  createConfiguredProvider,
  createFragmentedArticleFallbackProvider,
  createLiteralBacktickProvider,
  createMissingIdRecoveryProvider,
  createPreserveTermsProvider,
  createSourceLineBreakNormalizationProvider,
  createTerminologyProvider,
} from "../translation/provider.ts";
import type { TranslationProviderProfile } from "../translation/types.ts";

const PROFILE: TranslationProviderProfile = {
  apiKeyEnv: "DEEPSEEK_API_KEY",
  id: "deepseek",
  model: "deepseek-chat",
};

test("configured DeepSeek provider requires its key without exposing credentials", () => {
  assert.throws(
    () => createConfiguredProvider(PROFILE, {}),
    /缺少环境变量 DEEPSEEK_API_KEY/u,
  );
  const secret = "should-never-appear";
  assert.doesNotThrow(() =>
    createConfiguredProvider(PROFILE, { DEEPSEEK_API_KEY: secret }),
  );
});

test("fragmented article provider completes omitted Chinese article fragments", async () => {
  const delegatedIds: string[][] = [];
  const provider = defineProvider({
    async translateBatch(request) {
      delegatedIds.push(request.items.map((item) => item.id));
      return request.items
        .filter((item) => item.id === "lead")
        .map((item) => ({ id: item.id, text: "请参阅" }));
    },
  });
  const fallbackProvider = createFragmentedArticleFallbackProvider(provider);
  const output = await fallbackProvider.translateBatch({
    items: [
      {
        context: {
          block: "body",
          end: 8,
          fragmented: true,
          kind: "text",
          policyVersion: "markdown-source-ranges-v4",
          start: 0,
        },
        id: "lead",
        text: "See",
      },
      {
        context: {
          block: "body",
          end: 12,
          fragmented: true,
          kind: "text",
          policyVersion: "markdown-source-ranges-v4",
          start: 9,
        },
        id: "article",
        text: "the",
      },
    ],
    targetLanguage: "zh-CN",
  });

  assert.deepEqual(output, [
    { id: "lead", text: "请参阅" },
    { id: "article", text: "该" },
  ]);
  assert.deepEqual(delegatedIds, [["lead"]]);
});

test("fragmented article provider skips model calls for deterministic-only batches", async () => {
  let calls = 0;
  const provider = defineProvider({
    async translateBatch() {
      calls += 1;
      return [];
    },
  });
  const fallbackProvider = createFragmentedArticleFallbackProvider(provider);
  const output = await fallbackProvider.translateBatch({
    items: [
      {
        context: {
          block: "body",
          end: 3,
          fragmented: true,
          kind: "text",
          policyVersion: "markdown-source-ranges-v4",
          start: 0,
        },
        id: "article",
        text: "the",
      },
    ],
    targetLanguage: "zh-CN",
  });

  assert.deepEqual(output, [{ id: "article", text: "该" }]);
  assert.equal(calls, 0);
});

test("fragmented article provider does not mask ordinary missing output", async () => {
  const provider = defineProvider({
    async translateBatch() {
      return [];
    },
  });
  const fallbackProvider = createFragmentedArticleFallbackProvider(provider);
  const output = await fallbackProvider.translateBatch({
    items: [
      {
        context: {
          block: "body",
          end: 17,
          fragmented: true,
          kind: "text",
          policyVersion: "markdown-source-ranges-v4",
          start: 0,
        },
        id: "ordinary",
        text: "important details",
      },
    ],
    targetLanguage: "zh-CN",
  });

  assert.deepEqual(output, []);
});

test("missing-id provider recursively splits a failed multi-item batch", async () => {
  const batchSizes: number[] = [];
  const provider = defineProvider({
    async translateBatch(request) {
      batchSizes.push(request.items.length);
      if (request.items.length > 1) {
        throw new TranslationResponseError(
          TranslationErrorCode.ResponseMissingId,
          "missing id",
        );
      }
      return request.items.map((item) => ({
        id: item.id,
        text: `译文:${item.text}`,
      }));
    },
  });
  const recoveryProvider = createMissingIdRecoveryProvider(provider);
  const output = await recoveryProvider.translateBatch({
    items: [
      { context: {}, id: "one", text: "one" },
      { context: {}, id: "two", text: "two" },
      { context: {}, id: "three", text: "three" },
    ],
    targetLanguage: "zh-CN",
  });

  assert.deepEqual(output, [
    { id: "one", text: "译文:one" },
    { id: "two", text: "译文:two" },
    { id: "three", text: "译文:three" },
  ]);
  assert.deepEqual(batchSizes, [3, 2, 1, 1, 1]);
});

test("missing-id provider preserves a terminal single-item failure", async () => {
  const expected = new TranslationResponseError(
    TranslationErrorCode.ResponseMissingId,
    "missing id",
  );
  const provider = defineProvider({
    async translateBatch() {
      throw expected;
    },
  });
  const recoveryProvider = createMissingIdRecoveryProvider(provider);

  await assert.rejects(
    recoveryProvider.translateBatch({
      items: [{ context: {}, id: "one", text: "one" }],
      targetLanguage: "zh-CN",
    }),
    (error: unknown) => error === expected,
  );
});

test("source line-break provider flattens matching translated layout breaks", async () => {
  const provider = defineProvider({
    async translateBatch(request) {
      return request.items.map((item) => ({
        id: item.id,
        text: item.id === "multiline" ? "OpenAI 托管的\n ChatKit" : "新增\n换行",
      }));
    },
  });
  const normalizedProvider = createSourceLineBreakNormalizationProvider(provider);
  const output = await normalizedProvider.translateBatch({
    items: [
      { context: {}, id: "multiline", text: "OpenAI-hosted\nChatKit" },
      { context: {}, id: "single-line", text: "Added line break" },
    ],
    targetLanguage: "zh-CN",
  });

  assert.deepEqual(output, [
    { id: "multiline", text: "OpenAI 托管的 ChatKit" },
    { id: "single-line", text: "新增\n换行" },
  ]);
});

test("literal-backtick provider restores exact runs in their original item", async () => {
  let observedInstructions = "";
  let observedText = "";
  const provider = defineProvider({
    async translateBatch(request) {
      observedInstructions = request.instructions ?? "";
      observedText = request.items[0]?.text ?? "";
      return request.items.map((item) => ({
        id: item.id,
        text: item.text.replace("IDs for the", "用于"),
      }));
    },
  });
  const protectedProvider = createLiteralBacktickProvider(provider);
  const output = await protectedProvider.translateBatch({
    items: [
      {
        context: {},
        id: "unit",
        text: "IDs for the `code_interpreter`` tool",
      },
    ],
    targetLanguage: "zh-CN",
  });

  assert.doesNotMatch(observedText, /`/u);
  assert.match(observedText, /ET_BT_0_0_0/u);
  assert.match(observedInstructions, /same response item/u);
  assert.deepEqual(output, [
    { id: "unit", text: "用于 `code_interpreter`` tool" },
  ]);
});

test("literal-backtick provider rejects markers moved across items", async () => {
  const provider = defineProvider({
    async translateBatch(request) {
      const token = request.items[0]?.text.match(/\{\{ET_BT_[^{}]+\}\}/u)?.[0];
      assert.ok(token);
      return [
        { id: request.items[0]!.id, text: "第一段" },
        { id: request.items[1]!.id, text: `第二段 ${token}` },
      ];
    },
  });
  const protectedProvider = createLiteralBacktickProvider(provider);

  await assert.rejects(
    protectedProvider.translateBatch({
      items: [
        { context: {}, id: "first", text: "Use `code`" },
        { context: {}, id: "second", text: "here" },
      ],
      targetLanguage: "zh-CN",
    }),
    /保护标记被遗漏、复制、移动或改写/u,
  );
});

test("preserve-term provider masks longest matches and restores exact terms", async () => {
  let observedText = "";
  let observedInstructions = "";
  const provider = defineProvider({
    async translateBatch(request) {
      observedText = request.items[0]?.text ?? "";
      observedInstructions = request.instructions ?? "";
      return request.items.map((item) => ({
        id: item.id,
        text: item.text.replace(" and ", " 与 "),
      }));
    },
  });
  const protectedProvider = createPreserveTermsProvider(provider, [
    "API",
    "Responses API",
  ]);
  const output = await protectedProvider.translateBatch({
    items: [
      {
        context: {},
        id: "unit",
        text: "Responses API and API&#x20;",
      },
    ],
    instructions: "Translate accurately.",
    targetLanguage: "zh-CN",
  });

  assert.equal(
    observedText,
    "{{ET_KEEP_0_0_0_START}}Responses API{{ET_KEEP_0_0_0_END}} and " +
      "{{ET_KEEP_0_0_1_START}}API{{ET_KEEP_0_0_1_END}}&#x20;",
  );
  assert.match(observedInstructions, /Emit every protected span exactly once/u);
  assert.match(observedInstructions, /Do not introduce additional unmarked occurrences/u);
  assert.equal(output[0]?.text, "Responses API 与 API&#x20;");
});

test("preserve-term provider recovers when markers or protected text change", async () => {
  const markerPattern = /\{\{ET_KEEP_\d+_\d+_\d+_(?:START|END)\}\}/gu;
  const pairedContentPattern =
    /(\{\{ET_KEEP_\d+_\d+_\d+_START\}\})[^{}]*(\{\{ET_KEEP_\d+_\d+_\d+_END\}\})/gu;
  const provider = defineProvider({
    async translateBatch(request) {
      return request.items.map((item) => ({
        id: item.id,
        text:
          item.id === "markers-removed"
            ? item.text.replace(markerPattern, "")
            : item.text.replace(pairedContentPattern, "$1接口$2"),
      }));
    },
  });
  const protectedProvider = createPreserveTermsProvider(provider, ["API"]);
  const output = await protectedProvider.translateBatch({
    items: [
      { context: {}, id: "markers-removed", text: "Realtime API rejects it." },
      { context: {}, id: "content-changed", text: "Realtime API rejects it." },
    ],
    targetLanguage: "zh-CN",
  });

  assert.deepEqual(
    output.map((item) => item.text),
    ["Realtime API rejects it.", "Realtime API rejects it."],
  );
});

test("preserve-term provider restores spans moved across fragmented items", async () => {
  const protectedSpanPattern =
    /\{\{ET_KEEP_\d+_\d+_\d+_START\}\}API\{\{ET_KEEP_\d+_\d+_\d+_END\}\}/u;
  const provider = defineProvider({
    async translateBatch(request) {
      const protectedSpan = request.items[0]?.text.match(protectedSpanPattern)?.[0];
      assert.ok(protectedSpan);
      return [
        { id: request.items[0]!.id, text: "实时转录服务会拒绝请求" },
        { id: request.items[1]!.id, text: `${protectedSpan} 超出模型长度限制。` },
      ];
    },
  });
  const protectedProvider = createPreserveTermsProvider(provider, ["API"]);
  const output = await protectedProvider.translateBatch({
    items: [
      { context: {}, id: "fragment-1", text: "The Realtime API rejects it or" },
      { context: {}, id: "fragment-2", text: "exceeds the model length limit." },
    ],
    targetLanguage: "zh-CN",
  });

  assert.deepEqual(
    output.map((item) => item.text),
    ["实时转录服务会拒绝请求", "API 超出模型长度限制。"],
  );
});

test("preserve-term provider completes an omitted preserve-only punctuation item", async () => {
  const protectedSpanPattern =
    /\{\{ET_KEEP_\d+_\d+_\d+_START\}\}API\{\{ET_KEEP_\d+_\d+_\d+_END\}\}/u;
  const provider = defineProvider({
    async translateBatch(request) {
      const protectedSpan = request.items[1]?.text.match(protectedSpanPattern)?.[0];
      assert.ok(protectedSpan);
      return [
        {
          id: request.items[0]!.id,
          text: `来源信号由 ${protectedSpan} 检查`,
        },
      ];
    },
  });
  const protectedProvider = createPreserveTermsProvider(provider, ["API"]);
  const output = await protectedProvider.translateBatch({
    items: [
      { context: {}, id: "fragment-1", text: "signals checked by the" },
      { context: {}, id: "fragment-2", text: "API." },
    ],
    targetLanguage: "zh-CN",
  });

  assert.deepEqual(output, [
    { id: "fragment-1", text: "来源信号由 API 检查" },
    { id: "fragment-2", text: "." },
  ]);
});

test("preserve-term provider rejects a missing protected span", async () => {
  const protectedSpanPattern =
    /\{\{ET_KEEP_\d+_\d+_\d+_START\}\}API\{\{ET_KEEP_\d+_\d+_\d+_END\}\}/u;
  const provider = defineProvider({
    async translateBatch(request) {
      return request.items.map((item) => ({
        id: item.id,
        text: item.text.replace(protectedSpanPattern, ""),
      }));
    },
  });
  const protectedProvider = createPreserveTermsProvider(provider, ["API"]);

  await assert.rejects(
    protectedProvider.translateBatch({
      items: [{ context: {}, id: "unit", text: "Realtime API rejects it." }],
      targetLanguage: "zh-CN",
    }),
    (error: unknown) => {
      assert.ok(error instanceof TranslationResponseError);
      assert.match(error.message, /保留词数量发生变化：API/u);
      assert.match(error.retryInstruction ?? "", /emit exactly 1/u);
      return true;
    },
  );
});

test("preserve-term provider rejects marker residue instead of leaking it", async () => {
  const provider = defineProvider({
    async translateBatch(request) {
      return request.items.map((item) => ({
        id: item.id,
        text: item.text.replace("_START}}", "_START_CHANGED}}"),
      }));
    },
  });
  const protectedProvider = createPreserveTermsProvider(provider, ["API"]);

  await assert.rejects(
    protectedProvider.translateBatch({
      items: [{ context: {}, id: "unit", text: "Realtime API rejects it." }],
      targetLanguage: "zh-CN",
    }),
    /保留词保护标记被模型改写/u,
  );
});

test("terminology provider applies target terms without touching exclusions", async () => {
  let observedText = "";
  const provider = defineProvider({
    async translateBatch(request) {
      observedText = request.items[0]?.text ?? "";
      return request.items.map((item) => ({
        id: item.id,
        text: item.text.replace("Open ", "打开 "),
      }));
    },
  });
  const terminologyProvider = createTerminologyProvider(
    provider,
    ["Agents SDK"],
    { Agent: "智能体", Agents: "智能体", agent: "智能体", agents: "智能体" },
  );
  const output = await terminologyProvider.translateBatch({
    items: [
      {
        context: {},
        id: "unit",
        text: "Open Agent Builder with Agents SDK and user agents.",
      },
    ],
    targetLanguage: "zh-CN",
  });

  assert.match(observedText, /ET_TERM_0_0_0_START/u);
  assert.doesNotMatch(observedText, /ET_TERM[^}]*Agents SDK/u);
  assert.equal(
    output[0]?.text,
    "打开 智能体 Builder with Agents SDK and user agents.",
  );
});
