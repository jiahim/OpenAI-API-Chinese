import type { TranslationProviderProfile } from "./types.ts";

type TranslationProviderId = TranslationProviderProfile["id"];

const DEFAULT_MODELS: Readonly<Record<TranslationProviderId, string>> = {
  deepseek: "deepseek-chat",
  minimax: "MiniMax-M3",
  "minimax-cn": "MiniMax-M3",
};

function configuredKey(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

function isProviderId(value: string): value is TranslationProviderId {
  return (
    value === "deepseek" || value === "minimax" || value === "minimax-cn"
  );
}

function selectedProviderId(
  profile: TranslationProviderProfile,
  environment: NodeJS.ProcessEnv,
): TranslationProviderId {
  if (!profile.providerEnv) return profile.id;

  const explicit = environment[profile.providerEnv]?.trim();
  if (explicit) {
    if (!isProviderId(explicit)) {
      throw new Error(
        "TRANSLATION_PROVIDER 必须是 deepseek、minimax 或 minimax-cn。",
      );
    }
    return explicit;
  }

  const hasDeepSeek = configuredKey(environment.DEEPSEEK_API_KEY);
  const hasMinimax = configuredKey(environment.MINIMAX_API_KEY);
  if (hasDeepSeek && hasMinimax) {
    throw new Error(
      "检测到多个翻译 API Key；请设置 TRANSLATION_PROVIDER 指明本次使用 deepseek、minimax 或 minimax-cn。",
    );
  }
  if (hasDeepSeek) return "deepseek";
  if (hasMinimax) {
    return profile.id === "minimax" || profile.id === "minimax-cn"
      ? profile.id
      : "minimax-cn";
  }
  return profile.id;
}

export function resolveTranslationProviderProfile(
  profile: TranslationProviderProfile,
  environment: NodeJS.ProcessEnv = process.env,
): TranslationProviderProfile {
  const id = selectedProviderId(profile, environment);
  const apiKeyEnv =
    id === "deepseek" ? "DEEPSEEK_API_KEY" : "MINIMAX_API_KEY";
  const modelEnv = id === "deepseek" ? "DEEPSEEK_MODEL" : "MINIMAX_MODEL";
  const defaultModel = id === profile.id ? profile.model : DEFAULT_MODELS[id];
  const model = environment[modelEnv]?.trim() || defaultModel;
  const environmentSettings = profile.providerEnv
    ? { modelEnv, providerEnv: profile.providerEnv }
    : profile.modelEnv
      ? { modelEnv: profile.modelEnv }
      : {};

  return {
    apiKeyEnv,
    id,
    model,
    ...environmentSettings,
  } as TranslationProviderProfile;
}
