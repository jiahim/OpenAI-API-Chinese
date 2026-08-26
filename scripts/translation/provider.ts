import { createDeepSeekProvider } from "@easy-translate/providers";
import {
  TranslationErrorCode,
  TranslationResponseError,
  type TranslationBatchRequest,
  type TranslationProvider,
} from "@easy-translate/core";

import type { MarkdownTranslationContext } from "./markdown-adapter.ts";
import type { TranslationProviderProfile } from "./types.ts";

interface PreserveReplacement {
  closeToken: string;
  openToken: string;
  term: string;
}

const PRESERVE_MARKER_INSTRUCTION =
  "Paired {{ET_KEEP_*_START}} and {{ET_KEEP_*_END}} markers wrap protected source text. " +
  "Copy every marker pair and its enclosed text verbatim into the matching translation item; " +
  "never translate, omit, or move a protected span.";
const PRESERVE_MARKER_RESIDUE_PATTERN = /ET_KEEP_\d+_\d+_\d+/u;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function protectPreserveTerms(
  text: string,
  terms: readonly string[],
  requestIndex: number,
  itemIndex: number,
): { replacements: PreserveReplacement[]; text: string } {
  const replacements: PreserveReplacement[] = [];
  const pattern = new RegExp(terms.map(escapeRegExp).join("|"), "gu");
  let nextTokenIndex = 0;
  const protectedText = text.replace(pattern, (term) => {
    let tokenIndex = nextTokenIndex;
    let openToken = `{{ET_KEEP_${requestIndex}_${itemIndex}_${tokenIndex}_START}}`;
    let closeToken = `{{ET_KEEP_${requestIndex}_${itemIndex}_${tokenIndex}_END}}`;
    while (text.includes(openToken) || text.includes(closeToken)) {
      tokenIndex += 1;
      openToken = `{{ET_KEEP_${requestIndex}_${itemIndex}_${tokenIndex}_START}}`;
      closeToken = `{{ET_KEEP_${requestIndex}_${itemIndex}_${tokenIndex}_END}}`;
    }
    nextTokenIndex = tokenIndex + 1;
    replacements.push({ closeToken, openToken, term });
    return `${openToken}${term}${closeToken}`;
  });
  return { replacements, text: protectedText };
}

function restorePreserveReplacement(
  text: string,
  replacement: PreserveReplacement,
): string {
  let restored = text;
  const maximumProtectedLength = Math.max(
    replacement.term.length * 4,
    replacement.term.length + 32,
  );
  while (true) {
    const openIndex = restored.indexOf(replacement.openToken);
    if (openIndex < 0) break;
    const contentStart = openIndex + replacement.openToken.length;
    const closeIndex = restored.indexOf(replacement.closeToken, contentStart);
    if (closeIndex < 0) {
      restored =
        restored.slice(0, openIndex) +
        restored.slice(openIndex + replacement.openToken.length);
      continue;
    }
    const protectedContent = restored.slice(contentStart, closeIndex);
    if (
      protectedContent.length <= maximumProtectedLength &&
      !protectedContent.includes("{{ET_KEEP_")
    ) {
      restored =
        restored.slice(0, openIndex) +
        replacement.term +
        restored.slice(closeIndex + replacement.closeToken.length);
      continue;
    }
    restored =
      restored.slice(0, openIndex) +
      restored.slice(openIndex + replacement.openToken.length);
  }
  return restored.split(replacement.closeToken).join("");
}

function restorePreserveTerms(
  text: string,
  replacements: readonly PreserveReplacement[],
): string {
  let restored = text;
  for (const replacement of replacements) {
    restored = restorePreserveReplacement(restored, replacement);
  }
  return restored;
}

function countPreservedTerms(
  texts: readonly string[],
  terms: readonly string[],
): Map<string, number> {
  const counts = new Map(terms.map((term) => [term, 0]));
  const pattern = new RegExp(terms.map(escapeRegExp).join("|"), "gu");
  for (const text of texts) {
    for (const match of text.matchAll(pattern)) {
      const term = match[0];
      counts.set(term, (counts.get(term) ?? 0) + 1);
    }
  }
  return counts;
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
      const hasReplacements = [...replacementsById.values()].some(
        (replacements) => replacements.length > 0,
      );
      const protectedRequest: TranslationBatchRequest<TContext> = {
        ...request,
        items,
        ...(hasReplacements
          ? {
              instructions: [request.instructions, PRESERVE_MARKER_INSTRUCTION]
                .filter(Boolean)
                .join("\n"),
            }
          : {}),
      };
      const output = await provider.translateBatch(
        protectedRequest,
        signal,
        onActivity,
      );
      const allReplacements = [...replacementsById.values()].flat();
      const restoredOutput = output.map((item) => {
        // Chinese word order can move a protected span into an adjacent
        // fragmented unit. Restore every batch token regardless of which
        // output item currently contains it.
        const text = restorePreserveTerms(item.text, allReplacements);
        if (PRESERVE_MARKER_RESIDUE_PATTERN.test(text)) {
          throw new TranslationResponseError(
            TranslationErrorCode.ResponseQualityRejected,
            "保留词保护标记被模型改写。",
            {
              details: {
                issueCode: "translation.preserve_marker_changed",
                unitId: item.id,
              },
              retryInstruction: PRESERVE_MARKER_INSTRUCTION,
            },
          );
        }
        return { ...item, text };
      });
      const expectedCounts = new Map<string, number>();
      for (const replacement of allReplacements) {
        expectedCounts.set(
          replacement.term,
          (expectedCounts.get(replacement.term) ?? 0) + 1,
        );
      }
      const actualCounts = countPreservedTerms(
        restoredOutput.map((item) => item.text),
        terms,
      );
      for (const [term, expected] of expectedCounts) {
        const actual = actualCounts.get(term) ?? 0;
        if (actual === expected) continue;
        const unitId = [...replacementsById].find(([, replacements]) =>
          replacements.some((replacement) => replacement.term === term),
        )?.[0];
        throw new TranslationResponseError(
          TranslationErrorCode.ResponseQualityRejected,
          `保留词数量发生变化：${term}（期望 ${expected}，实际 ${actual}）。`,
          {
            details: {
              issueCode: "translation.preserve_count_changed",
              ...(unitId === undefined ? {} : { unitId }),
            },
            retryInstruction: PRESERVE_MARKER_INSTRUCTION,
          },
        );
      }
      return restoredOutput;
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
