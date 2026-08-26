# OpenAI API 中文文档站

这是当前仓库内的 Next.js 静态站实现。它只在构建期读取仓库内容，产物可以直接部署到 Vercel，不依赖数据库、服务端函数或运行时跨仓库请求。

## 内容与结构

- `docs/en/.source-manifest.json` 提供 421 篇有效英文源页面；全部生成稳定静态路由，414 篇直接渲染正文，7 篇超过 1 MB 的超大参考文件暂时生成轻量说明页。
- `docs/zh/.translation-manifest.json` 提供当前中文译文；未翻译中文路径仍处于官网对应目录，并链接到本站英文原文。
- `docs/en/api/docs/llms.txt` 与 `docs/en/api/reference/llms.txt` 是导航分组和顺序的权威来源。
- `scripts/generate-content.ts` 只生成轻量元数据和内容路径；Markdown 在构建对应页面时按需读取，不会进入浏览器公共数据包。
- 首页明确展示 `developers.openai.com` 为官方权威内容源，站点本身标注为社区镜像。

## 本地命令

从仓库根目录运行：

```bash
pnpm web:dev
pnpm web:typecheck
pnpm web:lint
pnpm web:test
pnpm web:build
```

也可以在本目录运行：

```bash
pnpm dev
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

生产构建输出到 `apps/web/out`。开发、测试、类型检查和构建都会先自动刷新被 Git 忽略的 `generated/documents.ts`，避免提交易过期的派生元数据。

## Vercel 配置

在 Vercel 导入当前 Git 仓库，并使用以下设置：

| 设置 | 值 |
| --- | --- |
| Root Directory | `apps/web` |
| Framework Preset | Next.js |
| Install Command | `pnpm install` |
| Build Command | `pnpm build` |
| Output Directory | 不覆盖，由 Next.js Preset 自动检测 |
| Node.js | 22.13 或更高 |

在 Root Directory 设置中启用 **Include source files outside of the Root Directory in the Build Step**。这是必须项：Vercel 默认不允许项目读取 Root Directory 外的文件，而本项目的 Markdown 位于仓库根部 `docs/`。

不要在 Vercel Dashboard 或 `vercel.json` 中把 Output Directory 覆盖为 `out`。`output: "export"` 仍会在本地生成 `apps/web/out`，但 Vercel 的 Next.js 构建器需要自行接管框架产物；强制覆盖会使其在 `out` 中错误查找 `routes-manifest.json`。

设置环境变量：

```text
NEXT_PUBLIC_SITE_ORIGIN=https://你的正式域名
```

项目不需要部署凭据写入仓库；正式域名由 Vercel 项目或自定义域名管理。

## 路由与链接

- `/zh/api/docs/...`：中文译文；尚未翻译时显示同结构状态页并提供本站英文入口。
- `/en/api/docs/...`：仓库内英文 Markdown 的静态页面；超大事件/资源总表保留结构化路由并明确链接官网，后续按章节拆页。
- `/zh|en/api/reference/...`：同样规则的 API 参考页面。
- 官方文档内部链接转换为当前语言的本站路由；即使目标尚未翻译，也不会自动跳回官网。
- 第三方链接与非文档 OpenAI 链接保留为外部链接，并在新窗口打开。
- `docs/en` 与 `docs/zh` 原文不会为展示目的被修改。

链接转换与导航结构有自动测试；生产构建会一次性验证全部 851 个静态路由。
