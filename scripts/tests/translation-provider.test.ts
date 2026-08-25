import assert from "node:assert/strict";
import test from "node:test";

import { createConfiguredProvider } from "../translation/provider.ts";
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
