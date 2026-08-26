import assert from "node:assert/strict";
import test from "node:test";

import { defineProvider } from "@easy-translate/core";

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
  const provider = defineProvider({
    async translateBatch(request) {
      observedText = request.items[0]?.text ?? "";
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
        text: "Responses API and API",
      },
    ],
    targetLanguage: "zh-CN",
  });

  assert.equal(observedText.includes("API"), false);
  assert.equal(observedText.match(/\{\{ET_KEEP_/gu)?.length, 2);
  assert.equal(output[0]?.text, "Responses API 与 API");
});
