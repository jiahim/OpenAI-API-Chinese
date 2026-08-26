import Link from "next/link";

import {
  sourceCheckSchedule,
  sourceGeneratedAt,
  translationGeneratedAt,
} from "@/generated/documents";
import {
  availableDocuments,
  bilingualPageCount,
  localizedRoute,
  navigation,
  sourcePageCount,
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
  const translatedDocuments = availableDocuments("zh");
  const sections = navigation();

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
          <span>{sourcePageCount} 篇英文原文 · {bilingualPageCount} 篇中文译文</span>
        </div>
        <div className="update-panel">
          <div className="update-status" aria-label="文档更新时间">
            <div>
              <span>英文文档同步</span>
              <time dateTime={sourceGeneratedAt}>{formatBeijingTime(sourceGeneratedAt)}</time>
            </div>
            <div>
              <span>中文翻译更新</span>
              <time dateTime={translationGeneratedAt}>{formatBeijingTime(translationGeneratedAt)}</time>
            </div>
            <div>
              <span>预计下次检查</span>
              <strong>{sourceCheckSchedule}</strong>
            </div>
          </div>
          <p>依据仓库同步记录、翻译清单与自动检查计划</p>
        </div>
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

      <section className="translated-section" aria-labelledby="translated-title">
        <div className="collection-heading">
          <div>
            <p className="eyebrow">中文翻译</p>
            <h2 id="translated-title">当前可读的中文译文</h2>
          </div>
          <span>译文会留在对应官网目录位置，并持续随同步流程增加</span>
        </div>
        <div className="translation-list">
          {translatedDocuments.map((document) => (
            <Link href={localizedRoute("zh", document.route)} key={document.route}>
              <span>{document.section === "reference" ? "API 参考" : "文档指南"}</span>
              <strong>{document.title}</strong>
              <small>{document.reviewStatus === "reviewed" ? "人工校对" : "机器翻译"} →</small>
            </Link>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <span>非 OpenAI 官方项目</span>
        <span>官方内容及商标权利归其各自权利人所有</span>
      </footer>
    </main>
  );
}
