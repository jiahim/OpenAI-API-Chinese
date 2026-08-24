#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export interface SyncDiffSummary {
  added: string[];
  modified: string[];
  removed: string[];
}

interface CliOptions {
  baseRef: string;
  outputPath: string;
}

function sorted(paths: string[]): string[] {
  return paths.sort((left, right) => left.localeCompare(right, "en"));
}

export function parseNameStatus(output: string): SyncDiffSummary {
  const fields = output.split("\0");
  if (fields.at(-1) === "") fields.pop();

  if (fields.length % 2 !== 0) {
    throw new Error("Git 差异输出不完整，无法生成同步摘要。");
  }

  const summary: SyncDiffSummary = {
    added: [],
    modified: [],
    removed: [],
  };

  for (let index = 0; index < fields.length; index += 2) {
    const status = fields[index];
    const filePath = fields[index + 1];
    if (!status || !filePath) {
      throw new Error("Git 差异输出包含空状态或空路径。");
    }

    if (status === "A") summary.added.push(filePath);
    else if (status === "M") summary.modified.push(filePath);
    else if (status === "D") summary.removed.push(filePath);
    else throw new Error(`不支持的 Git 文件状态：${status}（${filePath}）`);
  }

  return {
    added: sorted(summary.added),
    modified: sorted(summary.modified),
    removed: sorted(summary.removed),
  };
}

function markdownPath(filePath: string): string {
  return `- \`${filePath.replaceAll("`", "\\`")}\``;
}

function renderFileSection(title: string, paths: string[]): string[] {
  return [
    `## ${title}（${paths.length}）`,
    "",
    ...(paths.length === 0 ? ["无。"] : paths.map(markdownPath)),
  ];
}

export function renderSyncPullRequestBody(summary: SyncDiffSummary): string {
  return [
    "## 同步摘要",
    "",
    "本 PR 由 GitHub Actions 根据 OpenAI 官方 Markdown 索引自动生成。",
    "",
    `- 新增文件：${summary.added.length}`,
    `- 修改文件：${summary.modified.length}`,
    `- 删除文件：${summary.removed.length}`,
    "",
    ...renderFileSection("新增文件", summary.added),
    "",
    ...renderFileSection("修改文件", summary.modified),
    "",
    ...renderFileSection("删除文件", summary.removed),
    "",
    "## 合入要求",
    "",
    "- 同步器已在写入前校验官方索引和页面响应。",
    "- 自动任务不会绕过异常大规模删除保护。",
    "- 仅在 `Quality gate` 通过后合入。",
    "",
  ].join("\n");
}

function parseCliOptions(argv: string[]): CliOptions {
  let baseRef: string | undefined;
  let outputPath: string | undefined;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--base-ref") baseRef = argv[++index];
    else if (argument === "--output") outputPath = argv[++index];
    else throw new Error(`未知参数：${argument}`);
  }

  if (!baseRef) throw new Error("缺少 --base-ref。");
  if (!outputPath) throw new Error("缺少 --output。");
  return { baseRef, outputPath };
}

export async function main(argv = process.argv.slice(2)): Promise<void> {
  const options = parseCliOptions(argv);
  const diff = execFileSync(
    "git",
    [
      "diff",
      "--name-status",
      "-z",
      "--no-renames",
      `${options.baseRef}...HEAD`,
      "--",
      "docs/en",
    ],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
  );
  const summary = parseNameStatus(diff);
  await writeFile(options.outputPath, renderSyncPullRequestBody(summary), "utf8");
  console.log(
    `同步 PR 摘要：新增=${summary.added.length} 修改=${summary.modified.length} 删除=${summary.removed.length}`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
