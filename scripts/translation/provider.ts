import { createDeepSeekProvider } from "@easy-translate/providers";
import type {
  TranslationBatchRequest,
  TranslationProvider,
} from "@easy-translate/core";

import type { MarkdownTranslationContext } from "./markdown-adapter.ts";
import type { TranslationProviderProfile } from "./types.ts";

interface PreserveReplacement {
  term: string;
  token: string;
}

function protectPreserveTerms(
  text: string,
  terms: readonly string[],
  requestIndex: number,
  itemIndex: number,
): { replacements: PreserveReplacement[]; text: string } {
  let protectedText = text;
  const replacements: PreserveReplacement[] = [];
  for (const [termIndex, term] of terms.entries()) {
    if (!protectedText.includes(term)) continue;
    let tokenIndex = termIndex;
    let token = `{{ET_KEEP_${requestIndex}_${itemIndex}_${tokenIndex}}}`;
    while (protectedText.includes(token)) {
      tokenIndex += terms.length;
      token = `{{ET_KEEP_${requestIndex}_${itemIndex}_${tokenIndex}}}`;
    }
    protectedText = protectedText.split(term).join(token);
    replacements.push({ term, token });
  }
  return { replacements, text: protectedText };
}

function restorePreserveTerms(
  text: string,
  replacements: readonly PreserveReplacement[],
): string {
  let restored = text;
  for (const replacement of replacements) {
    restored = restored.split(replacement.token).join(replacement.term);
  }
  return restored;
}

export function createPreserveTermsProvider<TContext>(
  provider: TranslationProvider<TContext>,
  preserveTerms: readonly string[],
): TranslationProvider<TContext> {
  const terms = [...preserveTerms].sort(
    (left, right) => right.length - left.length || left.localeCompare(right, "en"),
  );
  if (terms.length === 0) return provider;

  let requestIndex = 0;
  return {
    name: provider.name,
    async translateBatch(request, signal, onActivity) {
      const currentRequest = requestIndex;
      requestIndex += 1;
      const replacementsById = new Map<string, PreserveReplacement[]>();
      const items = request.items.map((item, itemIndex) => {
        const protectedItem = protectPreserveTerms(
          item.text,
          terms,
          currentRequest,
          itemIndex,
        );
        replacementsById.set(item.id, protectedItem.replacements);
        return { ...item, text: protectedItem.text };
      });
      const protectedRequest: TranslationBatchRequest<TContext> = {
        ...request,
        items,
      };
      const output = await provider.translateBatch(
        protectedRequest,
        signal,
        onActivity,
      );
      return output.map((item) => ({
        ...item,
        text: restorePreserveTerms(
          item.text,
          replacementsById.get(item.id) ?? [],
        ),
      }));
    },
  };
}

export function createConfiguredProvider(
  profile: TranslationProviderProfile,
  environment: NodeJS.ProcessEnv = process.env,
  preserveTerms: readonly string[] = [],
): TranslationProvider<MarkdownTranslationContext> {
  const apiKey = environment[profile.apiKeyEnv]?.trim();
  if (!apiKey) {
    throw new Error(
      `缺少环境变量 ${profile.apiKeyEnv}；请在本地配置 DeepSeek API key 后重试。`,
    );
  }
  return createPreserveTermsProvider(
    createDeepSeekProvider({ apiKey, model: profile.model }),
    preserveTerms,
  );
}
