import { createHash } from "node:crypto";

import {
  TranslationErrorCode,
  TranslationResponseError,
  type DocumentAdapter,
  type TranslationPlan,
  type TranslationResult,
} from "@easy-translate/core";
import { fromMarkdown } from "mdast-util-from-markdown";
import { frontmatterFromMarkdown } from "mdast-util-frontmatter";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { mdxFromMarkdown } from "mdast-util-mdx";
import { frontmatter } from "micromark-extension-frontmatter";
import { gfm } from "micromark-extension-gfm";
import { mdxjs } from "micromark-extension-mdxjs";

import { MARKDOWN_ADAPTER_POLICY_VERSION } from "./planner.ts";

type MarkdownBlockKind = "body" | "heading" | "list" | "quote" | "table";
type MarkdownUnitKind = "image-alt" | "link-label" | "text";

interface PositionPoint {
  offset?: number | undefined;
}

interface MarkdownNode {
  type: string;
  children?: MarkdownNode[] | undefined;
  position?:
    | {
        end: PositionPoint;
        start: PositionPoint;
      }
    | undefined;
  [key: string]: unknown;
}

export interface MarkdownDocumentInput {
  content: string;
  id: string;
  sourceHash?: string | undefined;
}

export interface MarkdownTranslationContext {
  block: MarkdownBlockKind;
  end: number;
  fragmented: boolean;
  kind: MarkdownUnitKind;
  policyVersion: typeof MARKDOWN_ADAPTER_POLICY_VERSION;
  start: number;
}

export interface MarkdownSourceRange extends MarkdownTranslationContext {
  id: string;
  sourceText: string;
}

type PendingMarkdownSourceRange = Omit<
  MarkdownSourceRange,
  "fragmented" | "id"
> & { groupKey: string };

export interface MarkdownFormatState {
  documentId: string;
  policyVersion: typeof MARKDOWN_ADAPTER_POLICY_VERSION;
  ranges: readonly MarkdownSourceRange[];
  schemaVersion: 1;
  source: string;
  sourceHash: string;
  structureSignature: string;
}

const SKIPPED_SUBTREES = new Set([
  "code",
  "html",
  "inlineCode",
  "mdxFlowExpression",
  "mdxJsxFlowElement",
  "mdxJsxTextElement",
  "mdxTextExpression",
  "mdxjsEsm",
  "toml",
  "yaml",
]);

const PROTECTED_RAW_NODES = new Set(SKIPPED_SUBTREES);
const PROTECTED_TEXT_PATTERN = /\\[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]|&(?:#[xX][\da-fA-F]+|#\d+|[A-Za-z][A-Za-z\d]+);/gu;
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u001F\u007F]/u;
const LEADING_PUNCTUATION_PATTERN = /^\p{P}+/u;
const TRAILING_PUNCTUATION_PATTERN = /\p{P}+$/u;
const AUTOLINK_PATTERN = /<(?:https?:\/\/|mailto:)[^<>\r\n]+>|<[A-Za-z\d.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z\d.-]+\.[A-Za-z]{2,}>/gu;
const EMAIL_AUTOLINK_PATTERN =
  /[A-Za-z\d.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z\d.-]+\.[A-Za-z]{2,}/gu;
const HTML_COMMENT_PATTERN = /<!--[\s\S]*?-->/gu;
const GENERATED_CARD_PATTERN =
  /^[ \t]{1,3}\[([^\]\r\n]+)\r?\n(?:[ \t]*\r?\n)+[ \t]{4,}([^\]\r\n]+)\]\((https:\/\/developers\.openai\.com\/[^)\r\n]+)\)[ \t]*$/gmu;
const GENERATED_CARD_CODE_PATTERN =
  /^([ \t]{4,})[^\]\r\n]+(\]\(https:\/\/developers\.openai\.com\/[^)\r\n]+\))[ \t]*$/u;

export const MARKDOWN_STRUCTURE_ISSUE_CODE =
  "translation.markdown_structure_changed";

function markdownStructureError(documentId: string): TranslationResponseError {
  return new TranslationResponseError(
    TranslationErrorCode.ResponseInvalidItem,
    "翻译结果改变了 Markdown 受保护结构，已拒绝回填。",
    {
      details: {
        documentId,
        issueCode: MARKDOWN_STRUCTURE_ISSUE_CODE,
      },
      retryInstruction:
        "只返回对应输入单元的纯文本译文；不要新增 Markdown、HTML、链接、列表、表格或标题语法。",
    },
  );
}

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function containsMarkdownControlCharacter(value: string): boolean {
  return CONTROL_CHARACTER_PATTERN.test(value);
}

function localizedBoundaryPunctuation(
  value: string,
  boundary: "leading" | "trailing",
): string {
  const localized: Readonly<Record<string, string>> = {
    "!": "！",
    "(": "（",
    ")": "）",
    ",": "，",
    ".": "。",
    ":": "：",
    ";": "；",
    "?": "？",
    "[": "［",
    "]": "］",
    "{": "｛",
    "}": "｝",
  };
  return [...value]
    .map((character) => {
      if (character === '"') return boundary === "leading" ? "“" : "”";
      if (character === "'") return boundary === "leading" ? "‘" : "’";
      return localized[character] ?? character;
    })
    .join("");
}

function restoreLiteralStrongDelimiterWhitespace(
  range: MarkdownSourceRange,
  translated: string,
): string {
  const delimiter = "**";
  const sourceParts = range.sourceText.split(delimiter);
  const translatedParts = translated.split(delimiter);
  if (sourceParts.length === 1 || sourceParts.length !== translatedParts.length) {
    return translated;
  }
  const lastIndex = sourceParts.length - 1;
  return translatedParts
    .map((translatedPart, index) => {
      const sourcePart = sourceParts[index]!;
      let normalizedPart = translatedPart;
      if (index > 0) {
        if (/^[\s]/u.test(sourcePart)) {
          if (!/^[\s]/u.test(normalizedPart)) normalizedPart = ` ${normalizedPart}`;
        } else {
          normalizedPart = normalizedPart.replace(/^[ \t]+/u, "");
        }
      }
      if (index < lastIndex) {
        if (/[\s]$/u.test(sourcePart)) {
          if (!/[\s]$/u.test(normalizedPart)) normalizedPart += " ";
        } else {
          normalizedPart = normalizedPart.replace(/[ \t]+$/u, "");
        }
      }
      return normalizedPart;
    })
    .join(delimiter);
}

function restoreFragmentBoundaryPunctuation(
  range: MarkdownSourceRange,
  translated: string,
): string {
  if (!range.fragmented) return translated;
  let restored = translated;
  const leading = range.sourceText.match(LEADING_PUNCTUATION_PATTERN)?.[0];
  if (leading && !LEADING_PUNCTUATION_PATTERN.test(restored)) {
    restored = localizedBoundaryPunctuation(leading, "leading") + restored;
  }
  const trailing = range.sourceText.match(TRAILING_PUNCTUATION_PATTERN)?.[0];
  if (trailing && !TRAILING_PUNCTUATION_PATTERN.test(restored)) {
    restored += localizedBoundaryPunctuation(trailing, "trailing");
  }
  return restored;
}

function normalizeIntroducedEmailAutolinks(
  range: MarkdownSourceRange,
  translated: string,
): string {
  const expectedEmails = range.sourceText.match(EMAIL_AUTOLINK_PATTERN)?.length ?? 0;
  let seenEmails = 0;
  return translated.replace(EMAIL_AUTOLINK_PATTERN, (email) => {
    seenEmails += 1;
    if (seenEmails <= expectedEmails) return email;
    return email.replace("@", "@\u200C");
  });
}

function parseMarkdown(source: string): MarkdownNode {
  // MDX deliberately rejects CommonMark angle-bracket autolinks and HTML
  // comments. Mask those protected ranges with equal-length text before
  // parsing so all source offsets remain valid while MDX JSX stays available.
  const parseSource = source
    .replace(HTML_COMMENT_PATTERN, (value) =>
      value.replace(/[^\r\n]/gu, " "),
    )
    .replace(AUTOLINK_PATTERN, (value) => "x".repeat(value.length));
  try {
    return fromMarkdown(parseSource, {
      extensions: [frontmatter(["yaml", "toml"]), gfm(), mdxjs()],
      mdastExtensions: [
        frontmatterFromMarkdown(["yaml", "toml"]),
        gfmFromMarkdown(),
        mdxFromMarkdown(),
      ],
    }) as MarkdownNode;
  } catch (mdxError) {
    // Official Markdown exports can contain valid raw HTML that is not valid
    // JSX, such as an intentionally unclosed icon span inside a link label.
    // Fall back to GFM so raw HTML stays protected instead of blocking the
    // entire page.
    try {
      return fromMarkdown(parseSource, {
        extensions: [frontmatter(["yaml", "toml"]), gfm()],
        mdastExtensions: [
          frontmatterFromMarkdown(["yaml", "toml"]),
          gfmFromMarkdown(),
        ],
      }) as MarkdownNode;
    } catch (gfmError) {
      throw new Error("Markdown 无法按 GFM/frontmatter 或 MDX 语法解析。", {
        cause: new AggregateError([mdxError, gfmError]),
      });
    }
  }
}

function commonMarkCodeRanges(source: string): Array<{ end: number; start: number }> {
  const tree = fromMarkdown(source, {
    extensions: [frontmatter(["yaml", "toml"]), gfm()],
    mdastExtensions: [frontmatterFromMarkdown(["yaml", "toml"]), gfmFromMarkdown()],
  }) as MarkdownNode;
  const ranges: Array<{ end: number; start: number }> = [];
  function visit(node: MarkdownNode): void {
    if (node.type === "code") {
      ranges.push(nodeOffsets(node));
      return;
    }
    for (const child of node.children ?? []) visit(child);
  }
  visit(tree);
  return ranges;
}

function nodeOffsets(node: MarkdownNode): { end: number; start: number } {
  const start = node.position?.start.offset;
  const end = node.position?.end.offset;
  if (
    typeof start !== "number" ||
    typeof end !== "number" ||
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 ||
    end < start
  ) {
    throw new Error(`Markdown ${node.type} 节点缺少有效 source position。`);
  }
  return { end, start };
}

function blockKind(ancestors: readonly MarkdownNode[]): MarkdownBlockKind {
  if (ancestors.some((node) => node.type === "heading")) return "heading";
  if (ancestors.some((node) => node.type === "tableCell")) return "table";
  if (ancestors.some((node) => node.type === "listItem")) return "list";
  if (ancestors.some((node) => node.type === "blockquote")) return "quote";
  return "body";
}

const TRANSLATION_GROUP_NODES = new Set(["heading", "paragraph", "tableCell"]);

function translationGroupKey(
  node: MarkdownNode,
  ancestors: readonly MarkdownNode[],
): string {
  const group = [...ancestors, node]
    .reverse()
    .find((candidate) => TRANSLATION_GROUP_NODES.has(candidate.type));
  const range = nodeOffsets(group ?? node);
  return `${range.start}:${range.end}`;
}

function enclosingLink(
  ancestors: readonly MarkdownNode[],
): MarkdownNode | undefined {
  return [...ancestors]
    .reverse()
    .find((node) => node.type === "link" || node.type === "linkReference");
}

function isAutolinkText(node: MarkdownNode, ancestors: readonly MarkdownNode[]): boolean {
  const link = enclosingLink(ancestors);
  if (!link || link.type !== "link") return false;
  const nodeRange = nodeOffsets(node);
  const linkRange = nodeOffsets(link);
  return (
    nodeRange.start === linkRange.start &&
    typeof node.value === "string" &&
    node.value === link.url
  );
}

function trimMarkdownLinePrefix(
  source: string,
  start: number,
  end: number,
  isContinuation: boolean,
): { end: number; start: number } | undefined {
  let contentStart = start;
  let contentEnd = end;
  if (isContinuation) {
    while (contentStart < contentEnd && /[ \t]/u.test(source[contentStart] ?? "")) {
      contentStart += 1;
    }
    while (source[contentStart] === ">") {
      contentStart += 1;
      if (source[contentStart] === " ") contentStart += 1;
      while (contentStart < contentEnd && /[ \t]/u.test(source[contentStart] ?? "")) {
        contentStart += 1;
      }
    }
  }
  while (contentStart < contentEnd && /[ \t]/u.test(source[contentStart] ?? "")) {
    contentStart += 1;
  }
  while (contentEnd > contentStart && /[ \t]/u.test(source[contentEnd - 1] ?? "")) {
    contentEnd -= 1;
  }
  return contentStart < contentEnd
    ? { end: contentEnd, start: contentStart }
    : undefined;
}

function unprotectedTextRanges(
  source: string,
  start: number,
  end: number,
  sourceProtectedRanges: readonly { end: number; start: number }[],
): Array<{ end: number; start: number }> {
  const ranges: Array<{ end: number; start: number }> = [];
  const protectedRanges: Array<{ end: number; start: number }> = [];
  for (const pattern of [
    PROTECTED_TEXT_PATTERN,
    AUTOLINK_PATTERN,
    HTML_COMMENT_PATTERN,
  ]) {
    pattern.lastIndex = 0;
    for (const match of source.slice(start, end).matchAll(pattern)) {
      const matchStart = start + (match.index ?? 0);
      protectedRanges.push({ end: matchStart + match[0].length, start: matchStart });
    }
  }
  for (const range of sourceProtectedRanges) {
    if (range.start < end && range.end > start) {
      protectedRanges.push({
        end: Math.min(end, range.end),
        start: Math.max(start, range.start),
      });
    }
  }
  protectedRanges.sort((left, right) => left.start - right.start);
  let cursor = start;
  for (const protectedRange of protectedRanges) {
    if (cursor < protectedRange.start) {
      ranges.push({ end: protectedRange.start, start: cursor });
    }
    cursor = Math.max(cursor, protectedRange.end);
  }
  if (cursor < end) ranges.push({ end, start: cursor });
  return ranges
    .map((range) =>
      trimMarkdownLinePrefix(source, range.start, range.end, false),
    )
    .filter(
      (range): range is { end: number; start: number } =>
        range !== undefined && /[\p{L}\p{N}]/u.test(source.slice(range.start, range.end)),
    );
}

function textNodeRanges(
  source: string,
  node: MarkdownNode,
  sourceProtectedRanges: readonly { end: number; start: number }[],
): Array<{ end: number; start: number }> {
  const nodeRange = nodeOffsets(node);
  const ranges: Array<{ end: number; start: number }> = [];
  let lineStart = nodeRange.start;
  let continuation = false;
  while (lineStart < nodeRange.end) {
    const lf = source.indexOf("\n", lineStart);
    const lineEnd = lf === -1 || lf >= nodeRange.end ? nodeRange.end : lf;
    const withoutCr = lineEnd > lineStart && source[lineEnd - 1] === "\r" ? lineEnd - 1 : lineEnd;
    const content = trimMarkdownLinePrefix(
      source,
      lineStart,
      withoutCr,
      continuation,
    );
    if (content) {
      ranges.push(
        ...unprotectedTextRanges(
          source,
          content.start,
          content.end,
          sourceProtectedRanges,
        ),
      );
    }
    if (lf === -1 || lf >= nodeRange.end) break;
    lineStart = lf + 1;
    continuation = true;
  }
  return ranges;
}

function generatedCardTextRanges(
  source: string,
): Array<{ end: number; groupKey: string; start: number }> {
  const ranges: Array<{ end: number; groupKey: string; start: number }> = [];
  GENERATED_CARD_PATTERN.lastIndex = 0;
  for (const match of source.matchAll(GENERATED_CARD_PATTERN)) {
    const matchStart = match.index ?? 0;
    const label = match[1];
    const description = match[2];
    if (!label || !description) continue;
    const labelOffset = match[0].indexOf(label);
    const descriptionOffset = match[0].lastIndexOf(description);
    if (labelOffset < 0 || descriptionOffset < 0) continue;
    const groupKey = `${matchStart}:${matchStart + match[0].length}`;
    ranges.push(
      {
        end: matchStart + labelOffset + label.length,
        groupKey,
        start: matchStart + labelOffset,
      },
      {
        end: matchStart + descriptionOffset + description.length,
        groupKey,
        start: matchStart + descriptionOffset,
      },
    );
  }
  return ranges;
}

function imageAltRange(node: MarkdownNode, source: string): { end: number; start: number } {
  const range = nodeOffsets(node);
  if (source.slice(range.start, range.start + 2) !== "![") {
    throw new Error("图片节点的原始范围与 Markdown 语法不一致。");
  }
  let depth = 1;
  for (let cursor = range.start + 2; cursor < range.end; cursor += 1) {
    const character = source[cursor];
    if (character === "\\") {
      cursor += 1;
      continue;
    }
    if (character === "[") depth += 1;
    if (character === "]") {
      depth -= 1;
      if (depth === 0) return { end: cursor, start: range.start + 2 };
    }
  }
  throw new Error("无法定位图片 alt 的 source range。");
}

function collectRanges(root: MarkdownNode, source: string): MarkdownSourceRange[] {
  const generatedCardRanges = generatedCardTextRanges(source);
  const pending: PendingMarkdownSourceRange[] = generatedCardRanges.map(
    ({ groupKey, ...range }) => ({
      block: "body",
      end: range.end,
      groupKey,
      kind: "link-label",
      policyVersion: MARKDOWN_ADAPTER_POLICY_VERSION,
      sourceText: source.slice(range.start, range.end),
      start: range.start,
    }),
  );
  const sourceProtectedRanges = [
    ...commonMarkCodeRanges(source),
    ...generatedCardRanges,
  ];

  function visit(node: MarkdownNode, ancestors: readonly MarkdownNode[]): void {
    if (SKIPPED_SUBTREES.has(node.type)) return;
    const contextBlock = blockKind(ancestors);
    if (node.type === "text" && !isAutolinkText(node, ancestors)) {
      const kind: MarkdownUnitKind = enclosingLink(ancestors) ? "link-label" : "text";
      const groupKey = translationGroupKey(node, ancestors);
      for (const range of textNodeRanges(source, node, sourceProtectedRanges)) {
        pending.push({
          block: contextBlock,
          end: range.end,
          groupKey,
          kind,
          policyVersion: MARKDOWN_ADAPTER_POLICY_VERSION,
          sourceText: source.slice(range.start, range.end),
          start: range.start,
        });
      }
    } else if (node.type === "image" || node.type === "imageReference") {
      const range = imageAltRange(node, source);
      if (/\S/u.test(source.slice(range.start, range.end))) {
        pending.push({
          block: contextBlock,
          end: range.end,
          groupKey: translationGroupKey(node, ancestors),
          kind: "image-alt",
          policyVersion: MARKDOWN_ADAPTER_POLICY_VERSION,
          sourceText: source.slice(range.start, range.end),
          start: range.start,
        });
      }
      return;
    }
    for (const child of node.children ?? []) visit(child, [...ancestors, node]);
  }

  visit(root, []);
  pending.sort((left, right) => left.start - right.start || left.end - right.end);
  const groupSizes = new Map<string, number>();
  for (const range of pending) {
    groupSizes.set(range.groupKey, (groupSizes.get(range.groupKey) ?? 0) + 1);
  }
  return pending.map(({ groupKey, ...range }, index) => ({
    ...range,
    fragmented: (groupSizes.get(groupKey) ?? 0) > 1,
    id: `markdown-${index + 1}-${range.start}-${range.end}`,
  }));
}

function normalizedProtectedRaw(node: MarkdownNode, source: string): string {
  const range = nodeOffsets(node);
  const raw = source.slice(range.start, range.end);
  return node.type === "code"
    ? raw.replace(
        GENERATED_CARD_CODE_PATTERN,
        "$1<generated-card-description>$2",
      )
    : raw;
}

function protectedStructure(node: MarkdownNode, source: string): unknown {
  if (PROTECTED_RAW_NODES.has(node.type)) {
    return { raw: normalizedProtectedRaw(node, source), type: node.type };
  }
  const record: Record<string, unknown> = { type: node.type };
  for (const key of [
    "align",
    "checked",
    "depth",
    "identifier",
    "label",
    "ordered",
    "referenceType",
    "spread",
    "start",
    "title",
    "url",
  ]) {
    if (node[key] !== undefined) record[key] = node[key];
  }
  if (node.type === "text") return record;
  if (node.children) {
    record.children = node.children.map((child) => protectedStructure(child, source));
  }
  return record;
}

function structureSignature(root: MarkdownNode, source: string): string {
  const commonMarkCode = commonMarkCodeRanges(source).map((range) => {
    const raw = source.slice(range.start, range.end);
    return raw.replace(
      GENERATED_CARD_CODE_PATTERN,
      "$1<generated-card-description>$2",
    );
  });
  return sha256(
    JSON.stringify({ commonMarkCode, tree: protectedStructure(root, source) }),
  );
}

function assertValidState(state: MarkdownFormatState): void {
  if (state.schemaVersion !== 1) throw new Error("Markdown format state 版本无效。");
  if (state.policyVersion !== MARKDOWN_ADAPTER_POLICY_VERSION) {
    throw new Error("Markdown adapter 策略版本不匹配。");
  }
  if (sha256(state.source) !== state.sourceHash) {
    throw new Error("Markdown format state 的源内容哈希不匹配。");
  }
  if (
    structureSignature(parseMarkdown(state.source), state.source) !==
    state.structureSignature
  ) {
    throw new Error("Markdown format state 的结构签名不匹配。");
  }
  const ids = new Set<string>();
  let previousEnd = 0;
  for (const range of state.ranges) {
    if (
      ids.has(range.id) ||
      !Number.isSafeInteger(range.start) ||
      !Number.isSafeInteger(range.end) ||
      range.start < previousEnd ||
      range.end <= range.start ||
      range.end > state.source.length ||
      state.source.slice(range.start, range.end) !== range.sourceText ||
      typeof range.fragmented !== "boolean" ||
      range.policyVersion !== MARKDOWN_ADAPTER_POLICY_VERSION
    ) {
      throw new Error(`Markdown 翻译区间无效：${range.id}`);
    }
    ids.add(range.id);
    previousEnd = range.end;
  }
}

function translatedEntries(result: TranslationResult): Map<string, string> {
  if (
    typeof result !== "object" ||
    result === null ||
    !(result.translations instanceof Map)
  ) {
    throw new Error("翻译结果必须提供 translations Map。");
  }
  return result.translations;
}

export const markdownDocumentAdapter: DocumentAdapter<
  MarkdownDocumentInput,
  MarkdownFormatState,
  string,
  MarkdownTranslationContext
> = {
  async prepare(input) {
    if (
      typeof input !== "object" ||
      input === null ||
      typeof input.id !== "string" ||
      input.id.trim() !== input.id ||
      !input.id ||
      typeof input.content !== "string"
    ) {
      throw new Error("Markdown 输入必须包含有效 id 和 content。");
    }
    const sourceHash = sha256(input.content);
    if (input.sourceHash !== undefined && input.sourceHash !== sourceHash) {
      throw new Error("Markdown 输入的 sourceHash 与 content 不匹配。");
    }
    const tree = parseMarkdown(input.content);
    const ranges = collectRanges(tree, input.content);
    const units: TranslationPlan<MarkdownTranslationContext>["units"] = ranges.map(
      ({ id, sourceText, ...context }) => ({
        // Keep adjacent prose and inline link labels together so the provider
        // can translate the complete sentence instead of isolated fragments.
        batchKey: context.block,
        context,
        dedupeKey: sha256(
          JSON.stringify([
            context.block,
            context.kind,
            context.fragmented,
            sourceText,
          ]),
        ),
        id,
        text: sourceText,
      }),
    );
    return {
      formatState: {
        documentId: input.id,
        policyVersion: MARKDOWN_ADAPTER_POLICY_VERSION,
        ranges,
        schemaVersion: 1,
        source: input.content,
        sourceHash,
        structureSignature: structureSignature(tree, input.content),
      },
      plan: {
        document: {
          format: "markdown",
          id: input.id,
          sourceHash,
        },
        schemaVersion: 1,
        units,
      },
    };
  },

  async render(state, result) {
    assertValidState(state);
    const translations = translatedEntries(result);
    const expectedIds = new Set(state.ranges.map((range) => range.id));
    for (const id of translations.keys()) {
      if (!expectedIds.has(id)) throw new Error(`翻译结果包含未知单元：${id}`);
    }
    const replacements = state.ranges.map((range) => {
      const translated = translations.get(range.id);
      if (typeof translated !== "string") {
        throw new Error(`翻译结果缺少单元：${range.id}`);
      }
      let normalized = translated.trim();
      if (
        !normalized ||
        containsMarkdownControlCharacter(normalized)
      ) {
        throw new Error(
          `翻译结果包含空文本、内部换行或控制字符：${range.id}`,
        );
      }
      normalized = restoreLiteralStrongDelimiterWhitespace(range, normalized);
      normalized = restoreFragmentBoundaryPunctuation(range, normalized);
      normalized = normalizeIntroducedEmailAutolinks(range, normalized);
      return { ...range, translated: normalized };
    });
    let rendered = state.source;
    for (const replacement of replacements.reverse()) {
      rendered =
        rendered.slice(0, replacement.start) +
        replacement.translated +
        rendered.slice(replacement.end);
    }
    const renderedTree = parseMarkdown(rendered);
    if (structureSignature(renderedTree, rendered) !== state.structureSignature) {
      throw markdownStructureError(state.documentId);
    }
    return rendered;
  },
};
