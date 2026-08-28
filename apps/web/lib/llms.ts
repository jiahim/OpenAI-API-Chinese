import {
  catalogDocumentForRoute,
  documentMetadataForRoute,
  localizedRoute,
  type Locale,
} from "@/lib/documents";
import { siteOrigin } from "@/lib/site";

interface FeaturedDocument {
  descriptions: Record<Locale, string>;
  route: string;
}

const featuredDocuments: readonly FeaturedDocument[] = [
  {
    route: "/api/docs/quickstart",
    descriptions: {
      zh: "完成首次 OpenAI API 请求。",
      en: "Make a first OpenAI API request.",
    },
  },
  {
    route: "/api/docs/models",
    descriptions: {
      zh: "查看可用模型及其能力。",
      en: "Review available models and their capabilities.",
    },
  },
  {
    route: "/api/docs/guides/text",
    descriptions: {
      zh: "使用 Responses API 生成文本。",
      en: "Generate text with the Responses API.",
    },
  },
  {
    route: "/api/docs/guides/function-calling",
    descriptions: {
      zh: "让模型调用应用提供的工具。",
      en: "Let models call tools provided by an application.",
    },
  },
  {
    route: "/api/docs/guides/tools-web-search",
    descriptions: {
      zh: "使用内置网络搜索工具获取最新信息。",
      en: "Use the built-in web search tool for current information.",
    },
  },
  {
    route: "/api/docs/guides/image-generation",
    descriptions: {
      zh: "通过 API 生成和编辑图像。",
      en: "Generate and edit images through the API.",
    },
  },
  {
    route: "/api/docs/guides/audio",
    descriptions: {
      zh: "构建语音与音频应用。",
      en: "Build speech and audio applications.",
    },
  },
  {
    route: "/api/docs/guides/realtime",
    descriptions: {
      zh: "构建低延迟多模态应用。",
      en: "Build low-latency multimodal applications.",
    },
  },
  {
    route: "/api/reference/responses/overview",
    descriptions: {
      zh: "查阅 Responses API 接口参考。",
      en: "Read the Responses API reference.",
    },
  },
] as const;

function absoluteSiteUrl(origin: string, path: string): string {
  return new URL(path, `${origin.replace(/\/$/u, "")}/`).toString();
}

function markdownText(value: string): string {
  return value
    .replace(/\s+/gu, " ")
    .trim()
    .replace(/\\/gu, "\\\\")
    .replace(/\[/gu, "\\[")
    .replace(/\]/gu, "\\]");
}

function linkLine(title: string, url: string, description: string): string {
  return `- [${markdownText(title)}](${url}): ${markdownText(description)}`;
}

function featuredDocumentLines(locale: Locale, origin: string): string[] {
  return featuredDocuments.flatMap((featured) => {
    const catalogDocument = catalogDocumentForRoute(featured.route);
    const localizedDocument = documentMetadataForRoute(locale, featured.route);
    if (!catalogDocument || !localizedDocument) return [];

    return [
      linkLine(
        localizedDocument.title || catalogDocument.title,
        absoluteSiteUrl(origin, localizedRoute(locale, featured.route)),
        featured.descriptions[locale],
      ),
    ];
  });
}

export function buildLlmsText(origin = siteOrigin): string {
  const chineseDocuments = featuredDocumentLines("zh", origin);
  const englishDocuments = featuredDocumentLines("en", origin);
  const lines = [
    "# OpenAI API 中文文档",
    "",
    "> 社区维护的 OpenAI API 中英文文档镜像，提供中文译文、英文原文和双语对照入口。",
    "",
    "本站不是 OpenAI 官方网站。接口行为、价格、限制和安全要求应以 OpenAI 官方开发者文档为准。中文页面使用 `/zh/` 前缀，英文页面使用 `/en/` 前缀；页面会标明翻译与源文档状态。",
    "",
    "## 中文入口",
    "",
    linkLine(
      "中文文档指南",
      absoluteSiteUrl(origin, "/zh/api/docs"),
      "OpenAI API 概念、指南和教程的中文入口。",
    ),
    linkLine(
      "中文 API 参考",
      absoluteSiteUrl(origin, "/zh/api/reference"),
      "OpenAI API 资源、接口和事件的中文入口。",
    ),
    "",
    "## English entry points",
    "",
    linkLine(
      "English documentation",
      absoluteSiteUrl(origin, "/en/api/docs"),
      "English guides and conceptual documentation mirrored from the official source.",
    ),
    linkLine(
      "English API reference",
      absoluteSiteUrl(origin, "/en/api/reference"),
      "English endpoint, resource, and event reference mirrored from the official source.",
    ),
    "",
    ...(chineseDocuments.length > 0
      ? ["## 常用中文文档", "", ...chineseDocuments, ""]
      : []),
    "## Common English documentation",
    "",
    ...englishDocuments,
    "",
    "## Project and authoritative source",
    "",
    linkLine(
      "OpenAI 官方开发者文档",
      "https://developers.openai.com/api/",
      "所有 API 行为和产品信息的权威来源。",
    ),
    linkLine(
      "OpenAI-API-Chinese GitHub repository",
      "https://github.com/jiahim/OpenAI-API-Chinese",
      "Source code, translation workflow, and contribution history for this community mirror.",
    ),
    linkLine(
      "站点更新记录",
      absoluteSiteUrl(origin, "/updates"),
      "查看最近同步的官方文档变更。",
    ),
    "",
  ];

  return lines.join("\n");
}
