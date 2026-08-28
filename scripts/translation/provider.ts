import {
  createDeepSeekProvider,
  createMinimaxCNProvider,
  createMinimaxProvider,
} from "@easy-translate/providers";
import {
  TranslationErrorCode,
  TranslationResponseError,
  type TranslationBatchRequest,
  type TranslationOutputItem,
  type TranslationProvider,
} from "@easy-translate/core";

import type { MarkdownTranslationContext } from "./markdown-adapter.ts";
import { resolveTranslationProviderProfile } from "./provider-profile.ts";
import type { TranslationProviderProfile } from "./types.ts";

interface PreserveReplacement {
  closeToken: string;
  openToken: string;
  term: string;
}

interface TerminologyReplacement extends PreserveReplacement {
  source: string;
}

interface LiteralBacktickReplacement {
  backticks: string;
  itemId: string;
  token: string;
}

interface LiteralMarkdownDelimiterReplacement {
  delimiter: string;
  itemId: string;
  token: string;
}

const PRESERVE_MARKER_INSTRUCTION =
  "Paired {{ET_KEEP_*_START}} and {{ET_KEEP_*_END}} markers wrap protected source text. " +
  "Emit every protected span exactly once and copy the complete marker pair with its enclosed text verbatim. " +
  "Keep it in the matching item when possible; if Chinese word order requires moving it across adjacent " +
  "fragmented items, move the entire pair instead of copying it. Never translate, omit, duplicate, or split a protected span." +
  " Do not introduce additional unmarked occurrences of protected terms, including by expanding generic or " +
  "possessive references into product or company names.";
const PRESERVE_MISSING_RECOVERY_INSTRUCTION =
  "MISSING PROTECTED SPAN RECOVERY: This request contains only response items that omitted one or more protected terms. " +
  "Translate every item again and copy every complete {{ET_KEEP_*_START}}...{{ET_KEEP_*_END}} span exactly once.";
const PRESERVE_MARKER_RESIDUE_PATTERN = /ET_KEEP_\d+_\d+_\d+/u;
const TERMINOLOGY_MARKER_INSTRUCTION =
  "Paired {{ET_TERM_*_START}} and {{ET_TERM_*_END}} markers wrap glossary source terms. " +
  "Copy every complete marker pair exactly once; never translate, omit, duplicate, split, or alter a marker pair. " +
  "The application replaces each marked span with the configured target term after translation.";
const TERMINOLOGY_MARKER_RESIDUE_PATTERN = /ET_TERM_\d+_\d+_\d+/u;
const LITERAL_BACKTICK_INSTRUCTION =
  "{{ET_BT_*}} tokens represent protected literal Markdown backtick runs. " +
  "Copy every token exactly once in the same response item. Never omit, duplicate, move, split, or alter a token.";
const INVALID_ID_RECOVERY_INSTRUCTION =
  "INVALID ID RECOVERY: This request is a smaller recovery sub-batch. " +
  "Return every requested id exactly once, even when adjacent text fragments form one sentence.";
const LITERAL_BACKTICK_PATTERN = /`+/gu;
const LITERAL_MARKDOWN_DELIMITER_INSTRUCTION =
  "{{ET_MD_*}} tokens represent protected literal Markdown emphasis or strikethrough delimiter runs. " +
  "Copy every token exactly once in the same response item. Do not add unmarked **, __, or ~~ formatting.";
const LITERAL_MARKDOWN_DELIMITER_PATTERN = /\*{2,}|_{2,}|~{2,}/gu;
const TERMINOLOGY_EXCLUSIONS = [
  "USER AGENT",
  "USER AGENTS",
  "User agent",
  "User agents",
  "user agent",
  "user agents",
  "user-agent",
  "user-agents",
] as const;
const FRAGMENTED_ARTICLE_FALLBACKS: Readonly<Record<string, string>> = {
  a: "一个",
  an: "一个",
  the: "该",
};
const SURPLUS_PRESERVE_TERM_REPLACEMENTS: Readonly<Record<string, string>> = {
  API: "接口",
  "Agents SDK": "智能体开发工具包",
  "Chat Completions API": "聊天补全接口",
  OpenAI: "该公司",
  "Responses API": "响应接口",
  SDK: "开发工具包",
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function completeSourcePattern(sources: readonly string[]): RegExp {
  const wordCharacter = "[\\p{L}\\p{N}_]";
  const alternatives = [...new Set(sources)]
    .sort(
      (left, right) =>
        right.length - left.length || left.localeCompare(right, "en"),
    )
    .map((source) => {
      const startsWithWord = /^[\p{L}\p{N}_]/u.test(source);
      const endsWithWord = /[\p{L}\p{N}_]$/u.test(source);
      return (
        `${startsWithWord ? `(?<!${wordCharacter})` : ""}` +
        `${escapeRegExp(source)}` +
        `${endsWithWord ? `(?!${wordCharacter})` : ""}`
      );
    });
  return new RegExp(alternatives.join("|"), "gu");
}

function protectTerminology(
  text: string,
  preserveTerms: ReadonlySet<string>,
  terminology: Readonly<Record<string, string>>,
  requestIndex: number,
  itemIndex: number,
): { replacements: TerminologyReplacement[]; text: string } {
  const replacements: TerminologyReplacement[] = [];
  const pattern = completeSourcePattern([
    ...preserveTerms,
    ...TERMINOLOGY_EXCLUSIONS,
    ...Object.keys(terminology),
  ]);
  let nextTokenIndex = 0;
  const protectedText = text.replace(pattern, (source) => {
    if (preserveTerms.has(source) || /^user(?:\s+|-+)agents?$/iu.test(source)) {
      return source;
    }
    const target = terminology[source];
    if (target === undefined) return source;
    let tokenIndex = nextTokenIndex;
    let openToken = `{{ET_TERM_${requestIndex}_${itemIndex}_${tokenIndex}_START}}`;
    let closeToken = `{{ET_TERM_${requestIndex}_${itemIndex}_${tokenIndex}_END}}`;
    while (text.includes(openToken) || text.includes(closeToken)) {
      tokenIndex += 1;
      openToken = `{{ET_TERM_${requestIndex}_${itemIndex}_${tokenIndex}_START}}`;
      closeToken = `{{ET_TERM_${requestIndex}_${itemIndex}_${tokenIndex}_END}}`;
    }
    nextTokenIndex = tokenIndex + 1;
    replacements.push({ closeToken, openToken, source, term: target });
    return `${openToken}${source}${closeToken}`;
  });
  return { replacements, text: protectedText };
}

function replaceRawTerminology(
  text: string,
  preserveTerms: ReadonlySet<string>,
  terminology: Readonly<Record<string, string>>,
): string {
  const pattern = completeSourcePattern([
    ...preserveTerms,
    ...TERMINOLOGY_EXCLUSIONS,
    ...Object.keys(terminology),
  ]);
  return text.replace(pattern, (source) => {
    if (preserveTerms.has(source) || /^user(?:\s+|-+)agents?$/iu.test(source)) {
      return source;
    }
    return terminology[source] ?? source;
  });
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

function normalizeSurplusUnmarkedPreserveTerms(
  output: readonly TranslationOutputItem[],
  replacements: readonly PreserveReplacement[],
  terms: readonly string[],
  targetLanguage: string,
): TranslationOutputItem[] {
  if (!targetLanguage.toLowerCase().startsWith("zh")) return [...output];

  const protectedCounts = new Map(terms.map((term) => [term, 0]));
  const seenProtectedReplacements = new Set<PreserveReplacement>();
  let nextSpanIndex = 0;
  const masked = output.map((item) => {
    const spans = new Map<string, string>();
    let text = item.text;
    for (const replacement of replacements) {
      const maximumProtectedLength = Math.max(
        replacement.term.length * 4,
        replacement.term.length + 32,
      );
      const pattern = new RegExp(
        `${escapeRegExp(replacement.openToken)}([\\s\\S]{0,${maximumProtectedLength}}?)${escapeRegExp(replacement.closeToken)}`,
        "gu",
      );
      text = text.replace(pattern, (span, protectedContent: string) => {
        if (protectedContent.includes("{{ET_KEEP_")) return span;
        if (seenProtectedReplacements.has(replacement)) {
          return (
            SURPLUS_PRESERVE_TERM_REPLACEMENTS[replacement.term] ?? "该术语"
          );
        }
        seenProtectedReplacements.add(replacement);
        let token = `\uE000ET_SPAN_${nextSpanIndex}\uE001`;
        while (output.some((candidate) => candidate.text.includes(token))) {
          nextSpanIndex += 1;
          token = `\uE000ET_SPAN_${nextSpanIndex}\uE001`;
        }
        nextSpanIndex += 1;
        spans.set(token, span);
        protectedCounts.set(
          replacement.term,
          (protectedCounts.get(replacement.term) ?? 0) + 1,
        );
        return token;
      });
    }
    return { item, spans, text };
  });

  const expectedCounts = new Map(terms.map((term) => [term, 0]));
  for (const replacement of replacements) {
    expectedCounts.set(
      replacement.term,
      (expectedCounts.get(replacement.term) ?? 0) + 1,
    );
  }
  const allowedRawCounts = new Map(
    terms.map((term) => [
      term,
      Math.max(
        0,
        (expectedCounts.get(term) ?? 0) - (protectedCounts.get(term) ?? 0),
      ),
    ]),
  );
  const seenRawCounts = new Map(terms.map((term) => [term, 0]));
  const pattern = new RegExp(terms.map(escapeRegExp).join("|"), "gu");

  return masked.map(({ item, spans, text }) => {
    let normalized = text.replace(pattern, (term) => {
      const seen = seenRawCounts.get(term) ?? 0;
      seenRawCounts.set(term, seen + 1);
      if (seen < (allowedRawCounts.get(term) ?? 0)) return term;
      return SURPLUS_PRESERVE_TERM_REPLACEMENTS[term] ?? "该术语";
    });
    for (const [token, span] of spans) {
      normalized = normalized.split(token).join(span);
    }
    return { ...item, text: normalized };
  });
}

function preserveOnlyPunctuationFallback(
  text: string,
  terms: readonly string[],
): string | undefined {
  const withoutTerms = text.replace(
    new RegExp(terms.map(escapeRegExp).join("|"), "gu"),
    "",
  );
  if (withoutTerms.replace(/[\p{P}\p{S}\s]+/gu, "")) return undefined;
  const punctuation = [...withoutTerms]
    .filter((character) => /[\p{P}\p{S}]/u.test(character))
    .join("");
  return punctuation || undefined;
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
  async function translateBatch(
    request: TranslationBatchRequest<TContext>,
    signal?: AbortSignal,
    onActivity?: Parameters<TranslationProvider<TContext>["translateBatch"]>[2],
    allowMissingRecovery = true,
  ): Promise<TranslationOutputItem[]> {
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
      const rawOutput = await provider.translateBatch(
        protectedRequest,
        signal,
        onActivity,
      );
      const output = [...rawOutput];
      for (const item of request.items) {
        if ((replacementsById.get(item.id)?.length ?? 0) === 0) continue;
        const matches = output
          .map((translated, index) => ({ index, translated }))
          .filter(({ translated }) => translated.id === item.id);
        if (matches.length > 1) continue;
        const fallback = preserveOnlyPunctuationFallback(item.text, terms);
        if (!fallback) continue;
        if (matches.length === 0) {
          output.push({ id: item.id, text: fallback });
        } else if (!matches[0]!.translated.text.trim()) {
          output[matches[0]!.index] = { id: item.id, text: fallback };
        }
      }
      const allReplacements = [...replacementsById.values()].flat();
      const normalizedOutput = normalizeSurplusUnmarkedPreserveTerms(
        output,
        allReplacements,
        terms,
        request.targetLanguage,
      );
      const restoredOutput = normalizedOutput.map((item) => {
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
      let countMismatch = [...expectedCounts].find(
        ([term, expected]) => (actualCounts.get(term) ?? 0) !== expected,
      );
      if (
        allowMissingRecovery &&
        countMismatch !== undefined &&
        (actualCounts.get(countMismatch[0]) ?? 0) < countMismatch[1]
      ) {
        const deficitTerms = new Set(
          [...expectedCounts].flatMap(([term, expected]) =>
            (actualCounts.get(term) ?? 0) < expected ? [term] : [],
          ),
        );
        const presentReplacementTokens = new Set(
          allReplacements.flatMap((replacement) =>
            normalizedOutput.some(
              (item) =>
                item.text.includes(replacement.openToken) &&
                item.text.includes(replacement.closeToken),
            )
              ? [replacement.openToken]
              : [],
          ),
        );
        const outputById = new Map(
          restoredOutput.map((item) => [item.id, item.text]),
        );
        const recoveryIds = new Set<string>();
        for (const item of request.items) {
          const replacements = replacementsById.get(item.id) ?? [];
          if (replacements.length === 0) continue;
          const itemExpectedCounts = new Map<string, number>();
          for (const replacement of replacements) {
            itemExpectedCounts.set(
              replacement.term,
              (itemExpectedCounts.get(replacement.term) ?? 0) + 1,
            );
          }
          const itemActualCounts = countPreservedTerms(
            [outputById.get(item.id) ?? ""],
            terms,
          );
          if (
            [...itemExpectedCounts].some(
              ([term, expected]) =>
                deficitTerms.has(term) &&
                (itemActualCounts.get(term) ?? 0) < expected &&
                replacements.some(
                  (replacement) =>
                    replacement.term === term &&
                    !presentReplacementTokens.has(replacement.openToken),
                ),
            )
          ) {
            recoveryIds.add(item.id);
          }
        }
        if (recoveryIds.size > 0) {
          const recovered = await translateBatch(
            {
              ...request,
              instructions: [
                request.instructions,
                PRESERVE_MISSING_RECOVERY_INSTRUCTION,
              ]
                .filter(Boolean)
                .join("\n"),
              items: request.items.filter((item) => recoveryIds.has(item.id)),
            },
            signal,
            onActivity,
            false,
          );
          const recoveredById = new Map(
            recovered.map((item) => [item.id, item]),
          );
          const combinedOutput = restoredOutput.map(
            (item) => recoveredById.get(item.id) ?? item,
          );
          const combinedCounts = countPreservedTerms(
            combinedOutput.map((item) => item.text),
            terms,
          );
          countMismatch = [...expectedCounts].find(
            ([term, expected]) => (combinedCounts.get(term) ?? 0) !== expected,
          );
          if (countMismatch === undefined) return combinedOutput;
          for (const [term, count] of combinedCounts) {
            actualCounts.set(term, count);
          }
        }
      }
      if (countMismatch !== undefined) {
        const [term, expected] = countMismatch;
        const actual = actualCounts.get(term) ?? 0;
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
            retryInstruction:
              `${PRESERVE_MARKER_INSTRUCTION} The previous response emitted ${actual} ` +
              `occurrence(s) of ${JSON.stringify(term)}; emit exactly ${expected}.`,
          },
        );
      }
      return restoredOutput;
  }
  return {
    name: provider.name,
    translateBatch(request, signal, onActivity) {
      return translateBatch(request, signal, onActivity);
    },
  };
}

export function createInvalidIdRecoveryProvider<TContext>(
  provider: TranslationProvider<TContext>,
): TranslationProvider<TContext> {
  async function translateBatch(
    request: TranslationBatchRequest<TContext>,
    signal?: AbortSignal,
    onActivity?: Parameters<TranslationProvider<TContext>["translateBatch"]>[2],
  ): Promise<TranslationOutputItem[]> {
    try {
      return await provider.translateBatch(request, signal, onActivity);
    } catch (error) {
      const recoverableIdError =
        error instanceof TranslationResponseError &&
        (error.code === TranslationErrorCode.ResponseMissingId ||
          error.code === TranslationErrorCode.ResponseUnexpectedId ||
          error.code === TranslationErrorCode.ResponseDuplicateId);
      if (!recoverableIdError || request.items.length < 2) {
        throw error;
      }
      const midpoint = Math.ceil(request.items.length / 2);
      const instructions = [
        request.instructions,
        INVALID_ID_RECOVERY_INSTRUCTION,
      ]
        .filter(Boolean)
        .join("\n");
      const left = await translateBatch(
        { ...request, instructions, items: request.items.slice(0, midpoint) },
        signal,
        onActivity,
      );
      const right = await translateBatch(
        { ...request, instructions, items: request.items.slice(midpoint) },
        signal,
        onActivity,
      );
      return [...left, ...right];
    }
  }

  return { name: provider.name, translateBatch };
}

export function createTerminologyProvider<TContext>(
  provider: TranslationProvider<TContext>,
  preserveTerms: readonly string[],
  terminology: Readonly<Record<string, string>>,
): TranslationProvider<TContext> {
  if (Object.keys(terminology).length === 0) return provider;
  const preserve = new Set(preserveTerms);
  let requestIndex = 0;
  return {
    name: provider.name,
    async translateBatch(request, signal, onActivity) {
      const currentRequest = requestIndex;
      requestIndex += 1;
      const replacementsById = new Map<string, TerminologyReplacement[]>();
      const items = request.items.map((item, itemIndex) => {
        const protectedItem = protectTerminology(
          item.text,
          preserve,
          terminology,
          currentRequest,
          itemIndex,
        );
        replacementsById.set(item.id, protectedItem.replacements);
        return { ...item, text: protectedItem.text };
      });
      const allReplacements = [...replacementsById.values()].flat();
      const protectedRequest: TranslationBatchRequest<TContext> = {
        ...request,
        items,
        ...(allReplacements.length > 0
          ? {
              instructions: [request.instructions, TERMINOLOGY_MARKER_INSTRUCTION]
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
      return output.map((item) => {
        const restored = restorePreserveTerms(item.text, allReplacements);
        if (TERMINOLOGY_MARKER_RESIDUE_PATTERN.test(restored)) {
          throw new TranslationResponseError(
            TranslationErrorCode.ResponseQualityRejected,
            "指定译法保护标记被模型改写。",
            {
              details: {
                issueCode: "translation.terminology_marker_changed",
                unitId: item.id,
              },
              retryInstruction: TERMINOLOGY_MARKER_INSTRUCTION,
            },
          );
        }
        return {
          ...item,
          text: replaceRawTerminology(restored, preserve, terminology),
        };
      });
    },
  };
}

function fragmentedArticleFallback(
  item: TranslationBatchRequest<MarkdownTranslationContext>["items"][number],
  targetLanguage: string,
): string | undefined {
  if (!targetLanguage.toLowerCase().startsWith("zh")) return undefined;
  if (!item.context.fragmented || item.context.kind !== "text") {
    return undefined;
  }
  return FRAGMENTED_ARTICLE_FALLBACKS[item.text.trim().toLowerCase()];
}

export function createFragmentedArticleFallbackProvider(
  provider: TranslationProvider<MarkdownTranslationContext>,
): TranslationProvider<MarkdownTranslationContext> {
  return {
    name: provider.name,
    async translateBatch(request, signal, onActivity) {
      const fallbackById = new Map(
        request.items.flatMap((item) => {
          const fallback = fragmentedArticleFallback(
            item,
            request.targetLanguage,
          );
          return fallback === undefined ? [] : [[item.id, fallback] as const];
        }),
      );
      const delegatedItems = request.items.filter(
        (item) => !fallbackById.has(item.id),
      );
      const output =
        delegatedItems.length === 0
          ? []
          : await provider.translateBatch(
              { ...request, items: delegatedItems },
              signal,
              onActivity,
            );
      return [
        ...output,
        ...request.items.flatMap((item) => {
          const fallback = fallbackById.get(item.id);
          return fallback === undefined ? [] : [{ id: item.id, text: fallback }];
        }),
      ];
    },
  };
}

export function createSourceLineBreakNormalizationProvider<TContext>(
  provider: TranslationProvider<TContext>,
): TranslationProvider<TContext> {
  return {
    name: provider.name,
    async translateBatch(request, signal, onActivity) {
      const output = await provider.translateBatch(request, signal, onActivity);
      const sourceById = new Map(
        request.items.map((item) => [item.id, item.text]),
      );
      return output.map((item) => {
        const source = sourceById.get(item.id);
        if (source === undefined || !/[\r\n]/u.test(source)) return item;
        return {
          ...item,
          text: item.text.replace(/[ \t]*\r?\n[ \t]*/gu, " "),
        };
      });
    },
  };
}

export function createLiteralBacktickProvider<TContext>(
  provider: TranslationProvider<TContext>,
): TranslationProvider<TContext> {
  let requestIndex = 0;
  return {
    name: provider.name,
    async translateBatch(request, signal, onActivity) {
      const currentRequest = requestIndex;
      requestIndex += 1;
      const replacements: LiteralBacktickReplacement[] = [];
      const items = request.items.map((item, itemIndex) => {
        let tokenIndex = 0;
        return {
          ...item,
          text: item.text.replace(LITERAL_BACKTICK_PATTERN, (backticks) => {
            let token = `{{ET_BT_${currentRequest}_${itemIndex}_${tokenIndex}}}`;
            while (request.items.some((candidate) => candidate.text.includes(token))) {
              tokenIndex += 1;
              token = `{{ET_BT_${currentRequest}_${itemIndex}_${tokenIndex}}}`;
            }
            tokenIndex += 1;
            replacements.push({ backticks, itemId: item.id, token });
            return token;
          }),
        };
      });
      const protectedRequest: TranslationBatchRequest<TContext> = {
        ...request,
        items,
        ...(replacements.length > 0
          ? {
              instructions: [request.instructions, LITERAL_BACKTICK_INSTRUCTION]
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
      for (const replacement of replacements) {
        let totalOccurrences = 0;
        let matchingOccurrences = 0;
        for (const item of output) {
          const occurrences = item.text.split(replacement.token).length - 1;
          totalOccurrences += occurrences;
          if (item.id === replacement.itemId) matchingOccurrences += occurrences;
        }
        if (totalOccurrences === 1 && matchingOccurrences === 1) continue;
        throw new TranslationResponseError(
          TranslationErrorCode.ResponseQualityRejected,
          "字面 Markdown 反引号保护标记被遗漏、复制、移动或改写。",
          {
            details: {
              issueCode: "translation.literal_backtick_marker_changed",
              unitId: replacement.itemId,
            },
            retryInstruction: LITERAL_BACKTICK_INSTRUCTION,
          },
        );
      }
      return output.map((item) => {
        let text = item.text.replace(LITERAL_BACKTICK_PATTERN, "");
        for (const replacement of replacements) {
          if (replacement.itemId !== item.id) continue;
          text = text.split(replacement.token).join(replacement.backticks);
        }
        return { ...item, text };
      });
    },
  };
}

export function createLiteralMarkdownDelimiterProvider<TContext>(
  provider: TranslationProvider<TContext>,
): TranslationProvider<TContext> {
  let requestIndex = 0;
  return {
    name: provider.name,
    async translateBatch(request, signal, onActivity) {
      const currentRequest = requestIndex;
      requestIndex += 1;
      const replacements: LiteralMarkdownDelimiterReplacement[] = [];
      const items = request.items.map((item, itemIndex) => {
        let tokenIndex = 0;
        return {
          ...item,
          text: item.text.replace(
            LITERAL_MARKDOWN_DELIMITER_PATTERN,
            (delimiter) => {
              let token = `{{ET_MD_${currentRequest}_${itemIndex}_${tokenIndex}}}`;
              while (
                request.items.some((candidate) => candidate.text.includes(token))
              ) {
                tokenIndex += 1;
                token = `{{ET_MD_${currentRequest}_${itemIndex}_${tokenIndex}}}`;
              }
              tokenIndex += 1;
              replacements.push({ delimiter, itemId: item.id, token });
              return token;
            },
          ),
        };
      });
      const protectedRequest: TranslationBatchRequest<TContext> = {
        ...request,
        items,
        instructions: [
          request.instructions,
          LITERAL_MARKDOWN_DELIMITER_INSTRUCTION,
        ]
          .filter(Boolean)
          .join("\n"),
      };
      const output = await provider.translateBatch(
        protectedRequest,
        signal,
        onActivity,
      );
      for (const replacement of replacements) {
        let totalOccurrences = 0;
        let matchingOccurrences = 0;
        for (const item of output) {
          const occurrences = item.text.split(replacement.token).length - 1;
          totalOccurrences += occurrences;
          if (item.id === replacement.itemId) matchingOccurrences += occurrences;
        }
        if (totalOccurrences === 1 && matchingOccurrences === 1) continue;
        throw new TranslationResponseError(
          TranslationErrorCode.ResponseQualityRejected,
          "字面 Markdown 分隔符保护标记被遗漏、复制、移动或改写。",
          {
            details: {
              issueCode: "translation.literal_markdown_marker_changed",
              unitId: replacement.itemId,
            },
            retryInstruction: LITERAL_MARKDOWN_DELIMITER_INSTRUCTION,
          },
        );
      }
      return output.map((item) => {
        let text = item.text.replace(LITERAL_MARKDOWN_DELIMITER_PATTERN, "");
        for (const replacement of replacements) {
          if (replacement.itemId !== item.id) continue;
          text = text.split(replacement.token).join(replacement.delimiter);
        }
        return { ...item, text };
      });
    },
  };
}

export function createConfiguredProvider(
  profile: TranslationProviderProfile,
  environment: NodeJS.ProcessEnv = process.env,
  preserveTerms: readonly string[] = [],
  terminology: Readonly<Record<string, string>> = {},
): TranslationProvider<MarkdownTranslationContext> {
  const resolvedProfile = resolveTranslationProviderProfile(
    profile,
    environment,
  );
  const apiKey = environment[resolvedProfile.apiKeyEnv]?.trim();
  if (!apiKey) {
    throw new Error(
      `缺少环境变量 ${resolvedProfile.apiKeyEnv}；请配置 ${resolvedProfile.id} API key 后重试。`,
    );
  }
  const provider =
    resolvedProfile.id === "deepseek"
      ? createDeepSeekProvider({ apiKey, model: resolvedProfile.model })
      : resolvedProfile.id === "minimax-cn"
        ? createMinimaxCNProvider({
            apiKey,
            model: resolvedProfile.model,
            extraBody: {
              reasoning_split: true,
              ...(resolvedProfile.model.startsWith("MiniMax-M3")
                ? { thinking: { type: "disabled" } }
                : {}),
            },
          })
        : createMinimaxProvider({
            apiKey,
            model: resolvedProfile.model,
            extraBody: {
              reasoning_split: true,
              ...(resolvedProfile.model.startsWith("MiniMax-M3")
                ? { thinking: { type: "disabled" } }
                : {}),
            },
          });
  return createSourceLineBreakNormalizationProvider(
    createFragmentedArticleFallbackProvider(
      createLiteralMarkdownDelimiterProvider(
        createLiteralBacktickProvider(
          createPreserveTermsProvider(
            createTerminologyProvider(
              createInvalidIdRecoveryProvider(
                provider,
              ),
              preserveTerms,
              terminology,
            ),
            preserveTerms,
          ),
        ),
      ),
    ),
  );
}
