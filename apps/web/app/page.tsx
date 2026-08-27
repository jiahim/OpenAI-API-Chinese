import Link from "next/link";

import { ContactPopover } from "@/components/contact-popover";
import { UpdateBatchList } from "@/components/update-batch-list";

import {
  sourceCheckSchedule,
  sourceGeneratedAt,
  translationStatus,
  translationGeneratedAt,
} from "@/generated/documents";
import {
  bilingualPageCount,
  localizedRoute,
  navigation,
  sourcePageCount,
  syncReleases,
} from "@/lib/documents";

function formatBeijingTime(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export default function Home() {
  const sections = navigation();
  const releases = syncReleases();

  return (
    <main className="home-shell">
      <header className="home-header">
        <Link className="brand" href="/">
          <span aria-hidden="true" className="brand-line" />
          <span>
            <strong>OpenAI API 文档</strong>
            <small>中文社区翻译 · 同步官方 Markdown</small>
          </span>
        </Link>
        <nav>
          <ContactPopover />
          <a
            className="official-nav-link"
            href="https://developers.openai.com/api/"
            rel="noopener noreferrer"
            target="_blank"
          >
            OpenAI 官方文档 ↗
          </a>
          <a
            className="repository-link"
            href="https://github.com/jiahim/OpenAI-API-Chinese"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub ↗
          </a>
        </nav>
      </header>

      <section className="hero">
        <h1>OpenAI API 文档社区翻译</h1>
        <p>
          同步 OpenAI 官方 Markdown，提供中文翻译与英文原文，并按官网目录组织文档。
        </p>
        <div className="hero-actions">
          <Link href={localizedRoute("zh", "/api/docs")}>查看中文翻译</Link>
          <Link className="secondary" href={localizedRoute("en", "/api/docs")}>查看英文原文</Link>
        </div>
        <section className="translation-overview" aria-labelledby="translation-status-title">
          <header>
            <h2 id="translation-status-title">中文翻译状态</h2>
            <p><strong>{bilingualPageCount}</strong> / {sourcePageCount} 篇已有中文译文</p>
          </header>
          <div className="translation-status-grid">
            <div className="translation-state current">
              <div className="translation-state-heading">
                <span><i aria-hidden="true" />已翻译且最新</span>
                <strong>{translationStatus.current}</strong>
              </div>
              <small>内容和翻译规则均为最新</small>
            </div>
            <div className="translation-state stale">
              <div className="translation-state-heading">
                <span><i aria-hidden="true" />待更新</span>
                <strong>{translationStatus.stale}</strong>
              </div>
              <small>
                原文待同步 {translationStatus.staleSource} · 规则待重译 {translationStatus.stalePolicy}
              </small>
            </div>
            <div className="translation-state pending">
              <div className="translation-state-heading">
                <span><i aria-hidden="true" />尚未翻译</span>
                <strong>{translationStatus.pending}</strong>
              </div>
              <small>暂无可用的中文译文</small>
            </div>
          </div>
          <footer aria-label="文档更新时间">
            <span>英文同步 <time dateTime={sourceGeneratedAt}>{formatBeijingTime(sourceGeneratedAt)}</time></span>
            <span>翻译更新 <time dateTime={translationGeneratedAt}>{formatBeijingTime(translationGeneratedAt)}</time></span>
            <span>自动检查 <strong>{sourceCheckSchedule}</strong></span>
            {translationStatus.removedSource > 0 && (
              <span>已下线译文 {translationStatus.removedSource}</span>
            )}
          </footer>
        </section>
      </section>

      <section className="official-source" aria-label="官方文档来源说明">
        <p>
          内容同步自 OpenAI 官方开发者文档；本项目提供社区中文翻译与站内导航。
        </p>
        <a
          href="https://developers.openai.com/api/"
          rel="noopener noreferrer"
          target="_blank"
        >
          查看官方文档 <span>↗</span>
        </a>
      </section>

      <section className="structure-section" aria-labelledby="structure-title">
        <div className="collection-heading">
          <div>
            <p className="eyebrow">文档目录</p>
            <h2 id="structure-title">按 OpenAI 官方目录浏览</h2>
          </div>
          <span>目录与顺序来自官方 llms.txt 索引</span>
        </div>
        <div className="structure-grid">
          {sections.map((section) => {
            const pageCount = section.groups.reduce(
              (total, group) => total + group.entries.length,
              0,
            );
            return (
              <Link href={localizedRoute("zh", section.route)} key={section.key}>
                <div className="structure-card-heading">
                  <span>{section.key === "guides" ? "DOCS" : "API"}</span>
                  <strong>{section.groups.length} 个分组</strong>
                </div>
                <h3>{section.key === "guides" ? "文档指南" : "API 参考"}</h3>
                <p>
                  {section.key === "guides"
                    ? "开发指南、核心概念、模型、SDK 与教程。"
                    : "端点、资源、Responses、Realtime 与管理接口。"}
                </p>
                <div className="group-preview">
                  {section.groups.slice(0, 6).map((group) => (
                    <span key={group.title}>{group.title}</span>
                  ))}
                </div>
                <footer><strong>{pageCount}</strong> 篇页面 <span>进入目录 →</span></footer>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="updates-section" aria-labelledby="updates-title">
        <div className="collection-heading">
          <div>
            <p className="eyebrow">更新记录</p>
            <h2 id="updates-title">文档更新批次</h2>
          </div>
          <Link href="/updates">查看全部更新 →</Link>
        </div>
        <p className="updates-intro">每次自动同步都会留下批次记录，包含更新时间和具体的新增、修改、删除文章。</p>
        <UpdateBatchList releases={releases.slice(0, 8)} />
      </section>

      <footer className="home-footer">
        <span>非 OpenAI 官方项目</span>
        <span>官方内容及商标权利归其各自权利人所有</span>
      </footer>
    </main>
  );
}
