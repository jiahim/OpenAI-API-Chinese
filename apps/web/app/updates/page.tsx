import type { Metadata } from "next";
import Link from "next/link";

import { UpdateBatchList } from "@/components/update-batch-list";
import { syncReleases } from "@/lib/documents";

export const metadata: Metadata = {
  title: "文档更新记录",
  description: "查看 OpenAI API 中文文档每次自动同步的文章变更。",
};

export default function UpdatesPage() {
  return (
    <main className="updates-shell">
      <header className="updates-header">
        <Link className="brand" href="/">
          <span aria-hidden="true" className="brand-line" />
          <span><strong>OpenAI API 文档</strong><small>中文社区翻译 · 同步官方 Markdown</small></span>
        </Link>
        <Link href="/">返回首页</Link>
      </header>
      <article className="updates-page">
        <p className="eyebrow">Release 信息</p>
        <h1>文档更新记录</h1>
        <p className="lead">按批次追踪官方文档同步结果，查看每次新增、修改和删除的具体文章。</p>
        <UpdateBatchList releases={syncReleases()} />
      </article>
    </main>
  );
}
