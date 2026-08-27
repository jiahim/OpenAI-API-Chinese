import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  documentMetadataForRoute,
  localizedRoute,
  syncReleaseById,
  syncReleases,
  type SyncReleaseEntry,
} from "@/lib/documents";

function formatBatchTime(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}

function ChangeSection({
  entries,
  kind,
  title,
}: {
  entries: readonly SyncReleaseEntry[];
  kind: "added" | "modified" | "removed";
  title: string;
}) {
  const titleFor = (entry: SyncReleaseEntry) =>
    documentMetadataForRoute("zh", entry.route)?.title ?? entry.title;

  return (
    <section className={`update-change-section ${kind}`}>
      <header><h2>{title}</h2><span>{entries.length}</span></header>
      {entries.length === 0 ? <p>本批次没有{title}。</p> : (
        <div className="update-change-list">
          {entries.map((entry) => kind === "removed" ? (
            <div key={entry.path}><strong>{titleFor(entry)}</strong><small>{entry.path}</small></div>
          ) : (
            <Link href={localizedRoute("zh", entry.route)} key={entry.path}>
              <strong>{titleFor(entry)}</strong><small>{entry.path}</small><span>打开文档 →</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export function generateStaticParams() {
  return syncReleases().map((release) => ({ id: release.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const release = syncReleaseById((await params).id);
  return release ? {
    title: `文档更新 · ${formatBatchTime(release.generatedAt)}`,
    description: `新增 ${release.added.length} 篇，修改 ${release.modified.length} 篇，删除 ${release.removed.length} 篇。`,
  } : {};
}

export default async function UpdateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const release = syncReleaseById((await params).id);
  if (!release) notFound();

  return (
    <main className="updates-shell">
      <header className="updates-header">
        <Link className="brand" href="/">
          <span aria-hidden="true" className="brand-line" />
          <span><strong>OpenAI API 文档</strong><small>中文社区翻译 · 同步官方 Markdown</small></span>
        </Link>
        <Link href="/updates">全部更新</Link>
      </header>
      <article className="update-detail-page">
        <div className="breadcrumbs"><Link href="/">首页</Link><span>/</span><Link href="/updates">文档更新</Link></div>
        <p className="eyebrow">同步批次</p>
        <h1>{formatBatchTime(release.generatedAt)}</h1>
        <div className="update-detail-summary">
          <span>新增 <strong>{release.added.length}</strong></span>
          <span>修改 <strong>{release.modified.length}</strong></span>
          <span>删除 <strong>{release.removed.length}</strong></span>
          <small>北京时间</small>
        </div>
        <ChangeSection entries={release.added} kind="added" title="新增文章" />
        <ChangeSection entries={release.modified} kind="modified" title="修改文章" />
        <ChangeSection entries={release.removed} kind="removed" title="删除文章" />
      </article>
    </main>
  );
}
