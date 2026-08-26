import assert from "node:assert/strict";
import test from "node:test";

import { defineProvider, TranslationResponseError } from "@easy-translate/core";

import {
  createConfiguredProvider,
  createPreserveTermsProvider,
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
