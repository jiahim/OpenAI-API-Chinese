import { createDeepSeekProvider } from "@easy-translate/providers";
import type { TranslationProvider } from "@easy-translate/core";

import type { MarkdownTranslationContext } from "./markdown-adapter.ts";
import type { TranslationProviderProfile } from "./types.ts";

export function createConfiguredProvider(
  profile: TranslationProviderProfile,
  environment: NodeJS.ProcessEnv = process.env,
): TranslationProvider<MarkdownTranslationContext> {
  const apiKey = environment[profile.apiKeyEnv]?.trim();
  if (!apiKey) {
    throw new Error(
      `缺少环境变量 ${profile.apiKeyEnv}；请在本地配置 DeepSeek API key 后重试。`,
    );
  }
  return createDeepSeekProvider({ apiKey, model: profile.model });
}
