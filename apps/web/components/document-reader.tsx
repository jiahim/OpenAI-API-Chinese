import Link from "next/link";
import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import type {
  DocumentMetadata,
  GeneratedDocument,
  Locale,
  NavigationSection,
} from "@/lib/documents";
import {
  bilingualPageCount,
  hasLocalizedDocument,
  headingIds,
  headingSlug,
  localizedDocumentTitle,
  localizedRoute,
  navigation,
  navigationGroupForRoute,
  navigationNeighbors,
  navigationSectionForRoute,
  oppositeLocale,
  sidebarNavigationGroups,
} from "@/lib/documents";
import { resolveDocumentAsset, rewriteDocumentLink } from "@/lib/links";

const GROUP_LABELS: Record<string, string> = {
  "Documentation sets": "文档合集",
  Actions: "Actions",
  Assistants: "Assistants",
  Bots: "爬虫",
  Changelog: "更新日志",
  Concepts: "核心概念",
  Deprecations: "弃用说明",
  Gpts: "GPT",
  Guides: "指南",
  Libraries: "开发库",
  Mcp: "MCP",
  Models: "模型",
  Pricing: "价格",
  Quickstart: "快速开始",
  "Supported Countries": "支持的国家和地区",
  Tutorials: "教程",
  Administration: "管理",
  "Chat Completions": "Chat Completions",
  Overview: "概览",
  "Realtime Beta": "Realtime Beta",
  Resources: "资源",
  Responses: "Responses",
  "Workload Identity Federation": "工作负载身份联合",
};

function sectionLabel(locale: Locale, section: NavigationSection): string {
  if (locale === "en") return section.title;
  return section.key === "reference" ? "API 参考" : "文档指南";
}

function groupLabel(locale: Locale, label: string): string {
  return locale === "zh" ? GROUP_LABELS[label] ?? label : label;
}

function nodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (node && typeof node === "object" && "props" in node) {
    return nodeText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

function formatDocumentTime(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}

function markdownComponents(document: GeneratedDocument): Components {
  const headingOccurrences = new Map<string, number>();
  const headingId = (children: ReactNode) => {
    const base = headingSlug(nodeText(children));
    const occurrence = headingOccurrences.get(base) ?? 0;
    headingOccurrences.set(base, occurrence + 1);
    return occurrence ? `${base}-${occurrence}` : base;
  };

  return {
    h1: () => null,
    h2: ({ children }) => <h2 id={headingId(children)}>{children}</h2>,
    h3: ({ children }) => <h3 id={headingId(children)}>{children}</h3>,
    a: ({ children, href }) => {
      const link = rewriteDocumentLink(href, document.locale, document.sourceUrl);
      return (
        <a
          className={link.external ? "external-link" : undefined}
          href={link.href}
          {...(link.external
            ? { rel: "noopener noreferrer", target: "_blank" }
            : {})}
        >
          {children}
          {link.external && <span className="external-mark" aria-label="外部链接">↗</span>}
        </a>
      );
    },
    img: ({ alt, src }) => {
      const resolvedSource = resolveDocumentAsset(
        typeof src === "string" ? src : undefined,
        document.sourceUrl,
      );
      return resolvedSource ? (
        // Official assets are remote and have no stable dimensions in the source Markdown.
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt || ""} loading="lazy" src={resolvedSource} />
      ) : null;
    },
  };
}

function SiteHeader({ locale, route }: { locale: Locale; route: string }) {
  const alternateLocale = oppositeLocale(locale);
  return (
    <header className="topbar">
      <Link className="brand" href="/">
        <span aria-hidden="true" className="brand-line" />
        <span>
          <strong>{locale === "zh" ? "OpenAI API 文档" : "OpenAI API Docs"}</strong>
          <small>{locale === "zh" ? "中文社区翻译 · 官网结构" : "Community translation · Official structure"}</small>
        </span>
      </Link>
      <nav className="primary-nav" aria-label={locale === "zh" ? "主导航" : "Primary navigation"}>
        {navigation().map((section) => (
          <Link
            className={route.startsWith(section.route) ? "active" : ""}
            href={localizedRoute(locale, section.route)}
            key={section.key}
          >
            {sectionLabel(locale, section)}
          </Link>
        ))}
      </nav>
      <nav className="page-actions" aria-label={locale === "zh" ? "页面操作" : "Page actions"}>
        <a
          className="official-header-link"
          href="https://developers.openai.com/api/"
          rel="noopener noreferrer"
          target="_blank"
        >
          {locale === "zh" ? "OpenAI 官网 ↗" : "Official site ↗"}
        </a>
        <Link className="language-switch" href={localizedRoute(alternateLocale, route)}>
          {alternateLocale === "zh" ? "中文" : "EN"}
        </Link>
      </nav>
    </header>
  );
}

function DocsSidebar({ locale, route }: { locale: Locale; route: string }) {
  const section = navigationSectionForRoute(route) ?? navigation()[0];
  const activeGroup = navigationGroupForRoute(route);

  return (
    <aside className="sidebar" aria-label={locale === "zh" ? "文档目录" : "Documentation navigation"}>
      <div className="sidebar-heading">
        <span>{sectionLabel(locale, section)}</span>
        <strong>{section.groups.reduce((total, group) => total + group.entries.length, 0)}</strong>
      </div>
      <div className="sidebar-groups">
        {sidebarNavigationGroups(section).map((group) => (
          <details key={group.title} open={activeGroup?.title === group.title}>
            <summary>
              <span>{groupLabel(locale, group.title)}</span>
              <small>{group.entries.length}</small>
            </summary>
            <div className="sidebar-links">
              {group.entries.map((entry) => {
                const available = hasLocalizedDocument(locale, entry.route);
                return (
                  <Link
                    className={entry.route === route ? "active" : ""}
                    href={localizedRoute(locale, entry.route)}
                    key={entry.route}
                  >
                    <span>{localizedDocumentTitle(locale, entry)}</span>
                    {locale === "zh" && available && <i aria-label="已有中文译文" />}
                  </Link>
                );
              })}
            </div>
          </details>
        ))}
      </div>
      <div className="sidebar-note">
        <strong>{locale === "zh" ? "结构跟随官网" : "Official structure"}</strong>
        <span>
          {locale === "zh"
            ? "目录顺序来自 OpenAI 官方 llms.txt，站内链接会保留在本站。"
            : "Navigation order comes from OpenAI's official llms.txt indexes."}
        </span>
      </div>
    </aside>
  );
}

function DocsShell({
  children,
  locale,
  route,
  toc,
}: {
  children: ReactNode;
  locale: Locale;
  route: string;
  toc?: ReactNode;
}) {
  return (
    <main className="site-shell">
      <SiteHeader locale={locale} route={route} />
      <div className={`docs-layout${toc ? "" : " without-toc"}`}>
        <DocsSidebar locale={locale} route={route} />
        {children}
        {toc}
      </div>
    </main>
  );
}

export function DocumentReader({ document }: { document: GeneratedDocument }) {
  const locale = document.locale;
  const section = navigationSectionForRoute(document.route)!;
  const group = navigationGroupForRoute(document.route);
  const neighbors = navigationNeighbors(document.route);
  const toc = headingIds(document.headings);
  const isSource = document.reviewStatus === "source";

  return (
    <DocsShell
      locale={locale}
      route={document.route}
      toc={
        <aside className="toc" aria-label={locale === "zh" ? "页内目录" : "On this page"}>
          <p>{locale === "zh" ? "本页内容" : "On this page"}</p>
          {toc.slice(0, 18).map((heading) => (
            <a className={heading.depth === 3 ? "nested" : ""} href={`#${heading.id}`} key={heading.id}>
              {heading.text}
            </a>
          ))}
        </aside>
      }
    >
      <article className="document">
        <div className="breadcrumbs">
          <Link href={localizedRoute(locale, section.route)}>{sectionLabel(locale, section)}</Link>
          <span>/</span>
          <span>{group ? groupLabel(locale, group.title) : sectionLabel(locale, section)}</span>
        </div>
        <div className="document-heading">
          <div>
            <p className="eyebrow">{group ? groupLabel(locale, group.title) : sectionLabel(locale, section)}</p>
            <h1>{document.title}</h1>
          </div>
          <span className={`reviewed-badge ${document.reviewStatus}`}>
            {isSource
              ? "English source"
              : document.reviewStatus === "reviewed"
                ? locale === "zh" ? "人工校对" : "Human reviewed"
                : locale === "zh" ? "机器翻译" : "Machine translated"}
          </span>
        </div>

        <dl className="document-timestamps">
          <div>
            <dt>{locale === "zh" ? "英文原文拉取" : "English source pulled"}</dt>
            <dd>
              <time dateTime={document.sourceUpdatedAt}>
                {formatDocumentTime(document.sourceUpdatedAt, locale)}
              </time>
            </dd>
          </div>
          {locale === "zh" && document.translatedAt && (
            <div>
              <dt>中文翻译完成</dt>
              <dd>
                <time dateTime={document.translatedAt}>
                  {formatDocumentTime(document.translatedAt, locale)}
                </time>
              </dd>
            </div>
          )}
          <span>{locale === "zh" ? "北京时间" : "China Standard Time"}</span>
        </dl>

        <div className="source-notice">
          <span>
            {locale === "zh"
              ? "当前显示中文译文；站内文档链接会转换为本站中文路径。"
              : "This English page is rendered from the official Markdown mirror in this repository."}
          </span>
          <a href={document.sourceUrl.replace(/\.md$/u, "")} rel="noopener noreferrer" target="_blank">
            {locale === "zh" ? "核对官方原文 ↗" : "View on OpenAI ↗"}
          </a>
        </div>

        <div className="markdown-body">
          <ReactMarkdown
            components={markdownComponents(document)}
            remarkPlugins={[remarkGfm]}
            skipHtml
          >
            {document.markdown}
          </ReactMarkdown>
        </div>

        <nav className="document-neighbors" aria-label={locale === "zh" ? "前后文档" : "Adjacent documents"}>
          {neighbors.previous ? (
            <Link href={localizedRoute(locale, neighbors.previous.route)}>
              <small>{locale === "zh" ? "上一篇" : "Previous"}</small>
              <strong>{localizedDocumentTitle(locale, neighbors.previous)}</strong>
            </Link>
          ) : <span />}
          {neighbors.next && (
            <Link href={localizedRoute(locale, neighbors.next.route)}>
              <small>{locale === "zh" ? "下一篇" : "Next"}</small>
              <strong>{localizedDocumentTitle(locale, neighbors.next)}</strong>
            </Link>
          )}
        </nav>
      </article>
    </DocsShell>
  );
}

export function SectionIndex({
  locale,
  section,
}: {
  locale: Locale;
  section: NavigationSection;
}) {
  const pageCount = section.groups.reduce((total, group) => total + group.entries.length, 0);
  return (
    <DocsShell locale={locale} route={section.route}>
      <article className="section-index">
        <p className="eyebrow">OpenAI API</p>
        <h1>{sectionLabel(locale, section)}</h1>
        <p className="lead">
          {locale === "zh"
            ? section.key === "reference"
              ? "按 OpenAI 官网结构整理的 API 端点与资源参考。"
              : "按 OpenAI 官网结构整理的开发指南、概念文档与教程。"
            : section.description}
        </p>
        <div className="section-summary">
          <strong>{section.groups.length}</strong><span>{locale === "zh" ? "个分组" : "groups"}</span>
          <strong>{pageCount}</strong><span>{locale === "zh" ? "篇页面" : "pages"}</span>
          <strong>{bilingualPageCount}</strong><span>{locale === "zh" ? "篇中文译文" : "Chinese translations"}</span>
        </div>
        <div className="section-groups">
          {section.groups.map((group) => (
            <section id={headingSlug(group.title)} key={group.title}>
              <header>
                <h2>{groupLabel(locale, group.title)}</h2>
                {locale === "zh" && groupLabel(locale, group.title) !== group.title && <small>{group.title}</small>}
                <span>{group.entries.length + group.externalEntries.length}</span>
              </header>
              <div className="section-entry-list">
                {group.entries.map((entry) => (
                  <Link href={localizedRoute(locale, entry.route)} key={entry.route}>
                    <span>{localizedDocumentTitle(locale, entry)}</span>
                    <small>
                      {locale === "zh" && hasLocalizedDocument("zh", entry.route)
                        ? "中文可读"
                        : locale === "zh" ? "英文原文" : "Open page"}
                    </small>
                  </Link>
                ))}
                {group.externalEntries.map((entry) => (
                  <a href={entry.sourceUrl} key={entry.sourceUrl} rel="noopener noreferrer" target="_blank">
                    <span>{entry.title}</span>
                    <small>{locale === "zh" ? "官网合集 ↗" : "Official bundle ↗"}</small>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </DocsShell>
  );
}

export function MissingDocument({
  locale,
  route,
  title,
  sourceUrl,
}: {
  locale: Locale;
  route: string;
  title: string;
  sourceUrl?: string;
}) {
  const section = navigationSectionForRoute(route);
  const group = navigationGroupForRoute(route);
  return (
    <DocsShell locale={locale} route={route}>
      <article className="missing-page">
        <div className="breadcrumbs">
          {section && <Link href={localizedRoute(locale, section.route)}>{sectionLabel(locale, section)}</Link>}
          {group && <><span>/</span><span>{groupLabel(locale, group.title)}</span></>}
        </div>
        <p className="eyebrow">{locale === "zh" ? "中文翻译进行中" : "Not bundled yet"}</p>
        <h1>{title}</h1>
        <p>
          {locale === "zh"
            ? "这篇页面已处于和官网一致的目录位置，但中文译文尚未生成。你可以先阅读本站静态渲染的英文原文，不会被自动带离本站。"
            : "This page is part of the official structure, but its content is not available in this build."}
        </p>
        <div className="missing-actions">
          {locale === "zh" && (
            <Link href={localizedRoute("en", route)}>阅读本站英文原文</Link>
          )}
          {sourceUrl && (
            <a href={sourceUrl.replace(/\.md$/u, "")} rel="noopener noreferrer" target="_blank">
              {locale === "zh" ? "在 OpenAI 官网查看 ↗" : "Open official source ↗"}
            </a>
          )}
        </div>
      </article>
    </DocsShell>
  );
}

export function LargeDocument({ document }: { document: DocumentMetadata }) {
  const locale = document.locale;
  const section = navigationSectionForRoute(document.route);
  const group = navigationGroupForRoute(document.route);
  const size = `${(document.bytes / 1024 / 1024).toFixed(1)} MiB`;
  return (
    <DocsShell locale={locale} route={document.route}>
      <article className="missing-page large-source-page">
        <div className="breadcrumbs">
          {section && <Link href={localizedRoute(locale, section.route)}>{sectionLabel(locale, section)}</Link>}
          {group && <><span>/</span><span>{groupLabel(locale, group.title)}</span></>}
        </div>
        <p className="eyebrow">{locale === "zh" ? "超大参考页面" : "Oversized reference page"}</p>
        <h1>{document.title}</h1>
        <p>
          {locale === "zh"
            ? `这份官方 Markdown 大小为 ${size}，当前静态站暂不把它整体内嵌进单个页面，以避免 Vercel 产物和浏览器加载异常。页面仍保留在官网对应目录中。`
            : `This official Markdown file is ${size}. It remains in the complete navigation, but this build does not inline it into one HTML page to keep the Vercel deployment and browser loading reliable.`}
        </p>
        <div className="missing-actions">
          <a href={document.sourceUrl.replace(/\.md$/u, "")} rel="noopener noreferrer" target="_blank">
            {locale === "zh" ? "在 OpenAI 官网阅读 ↗" : "Read on OpenAI ↗"}
          </a>
        </div>
        <p className="large-page-note">
          {locale === "zh"
            ? "后续会把这类事件目录按结构拆成多个静态子页，而不是生成几十 MiB 的单页 HTML。"
            : "A later iteration can split event catalogs into structured static subpages instead of emitting multi-megabyte HTML."}
        </p>
      </article>
    </DocsShell>
  );
}
