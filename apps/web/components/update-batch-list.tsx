import Link from "next/link";

import type { SyncRelease } from "@/lib/documents";

function formatBatchTime(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Asia/Shanghai",
  }).format(new Date(value));
}

export function UpdateBatchList({
  releases,
}: {
  releases: readonly SyncRelease[];
}) {
  return (
    <div className="update-batch-list">
      {releases.map((release) => (
        <Link href={`/updates/${release.id}`} key={release.id}>
          <div>
            <time dateTime={release.generatedAt}>{formatBatchTime(release.generatedAt)}</time>
            <strong>官方文档同步批次</strong>
          </div>
          <dl>
            <div className="added"><dt>新增</dt><dd>{release.added.length}</dd></div>
            <div className="modified"><dt>修改</dt><dd>{release.modified.length}</dd></div>
            <div className="removed"><dt>删除</dt><dd>{release.removed.length}</dd></div>
          </dl>
          <span>查看详情 →</span>
        </Link>
      ))}
    </div>
  );
}
