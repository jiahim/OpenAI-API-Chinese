# 双语文档静态站架构与抽取路线

**状态：** 当前仓库先实现并部署 OpenAI API 中文文档站；出现第二个真实翻译站后，再抽取通用生成器。

## 1. 当前决策

现阶段采用“单仓闭环、内部解耦、后续抽取”的方案：

- `OpenAI-API-Chinese` 继续负责官网英文源同步、中文翻译、质量门和内容状态。
- 同一仓库的 `apps/web` 负责首个 Next.js 静态站和 Vercel 适配。
- 站点在构建期读取仓库 Markdown，部署产物不在运行时读取 GitHub、调用翻译服务或依赖数据库。
- 官网的 `llms.txt` 索引是信息架构事实源；导航不能由已翻译页面或文件路径临时拼接。
- 首页明确把 `developers.openai.com` 展示为权威官网，本项目始终标注为社区翻译镜像。
- 通用逻辑保持清晰边界，但不因只有一个站点样本而立即拆仓。

这替代了此前“首版就必须放到独立生成器仓库”的决定。未来独立仓库仍是演进方向，不是当前实现的前置条件。

## 2. 目标与非目标

目标：

1. 将仓库中的 Markdown 生成可分享、可索引、无需服务端运行时的静态 HTML。
2. 为 `/zh` 和 `/en` 提供稳定、同构的文档路径。
3. 完整保留官网的栏目、分组、顺序、面包屑和前后页关系。
4. 把官网文档内部链接转换为本站路由，避免阅读中意外跳回源网站。
5. 在中文尚未覆盖全部页面时仍维持完整结构，并提供本站英文原文或超大页面说明。
6. 使构建产物适合 Vercel 静态部署，并能生成 sitemap、robots 和社交预览元数据。
7. 为未来 OpenAI 之外的翻译站保留可抽取的内容契约和渲染边界。

当前非目标：

- 站点不负责抓取官网、调用翻译模型、维护翻译 checkpoint 或决定翻译优先级。
- 不在浏览器中加载 89 MiB 的 Markdown 数据包。
- 不把 OpenAI 社区站伪装为官网，也不复制官方品牌标志。
- 不在只有一个站点时设计覆盖所有厂商的插件系统。
- 不在当前阶段建立统一托管多个站点的中心门户。

## 3. 当前仓库结构

```text
OpenAI-API-Chinese/
├── apps/web/
│   ├── app/                    # 首页、文档路由、SEO 文件
│   ├── components/             # 结构化导航与 Markdown 阅读器
│   ├── generated/              # 构建前生成的轻量内容元数据
│   ├── lib/                    # 内容查询、按需读取、链接转换
│   ├── scripts/                # OpenAI manifest/index 适配器
│   ├── tests/                  # 路由、链接、结构契约测试
│   ├── next.config.ts          # output: export
│   └── vercel.json             # Vercel 静态输出配置
├── docs/en/                    # 官方英文 Markdown 镜像
├── docs/zh/                    # 中文译文与 translation manifest
└── scripts/                    # 同步与翻译流水线
```

逻辑数据流：

```text
官方 llms.txt / Markdown
          ↓ 同步 PR
docs/en + source manifest
          ↓ 翻译 PR
docs/zh + translation manifest
          ↓ apps/web prebuild
结构化轻量元数据 + 逐页读取 Markdown
          ↓ Next.js static export
apps/web/out
          ↓
Vercel CDN
```

## 4. 内容事实源

站点不重新推断同步或翻译状态，直接消费现有事实源：

| 事实 | 来源 |
| --- | --- |
| 有效英文页面、URL、磁盘路径、栏目 | `docs/en/.source-manifest.json` |
| 中文页面、英文配对、审核状态 | `docs/zh/.translation-manifest.json` |
| 文档栏目分组和顺序 | `docs/en/api/docs/llms.txt` |
| API 参考分组和顺序 | `docs/en/api/reference/llms.txt` |
| Markdown 正文 | manifest 指向的磁盘文件 |

构建前生成器必须验证：

- 只接受 `status=active` 的 source 页面。
- source URL 必须属于 `https://developers.openai.com`。
- 磁盘路径解析后必须位于仓库允许根目录内。
- translation 记录必须能对应一个有效 source 页面。
- 两份 `llms.txt` 解析后的页面集合必须与全部 active 页面一一对应。
- 分组、页面顺序来自索引出现顺序，不能按路径重新排序。

当前 421 个有效页面必须全部进入结构化导航；索引少一页或重复一页都应使构建失败。

## 5. 构建期内容模型

`apps/web/scripts/generate-content.ts` 将项目专属 manifest 转换为站点内部模型。建议未来抽取时稳定为如下 TypeScript 契约：

```ts
export interface SiteContentManifest {
  schemaVersion: 1;
  site: {
    id: string;
    title: string;
    sourceName: string;
    sourceHomeUrl: string;
    defaultLocale: string;
    locales: readonly string[];
  };
  sections: readonly SiteSection[];
  documents: readonly SiteDocument[];
}

export interface SiteSection {
  id: string;
  route: string;
  title: string;
  groups: readonly SiteGroup[];
}

export interface SiteGroup {
  id: string;
  title: string;
  documents: readonly string[];
}

export interface SiteDocument {
  id: string;
  canonicalSourceUrl: string;
  sectionId: string;
  variants: readonly {
    locale: string;
    sourcePath: string;
    title: string;
    description?: string;
    reviewStatus?: "source" | "machine" | "reviewed";
  }[];
}
```

契约原则：

- `id` 在一个内容仓库内稳定且不随语言变化。
- 清单只保存元数据与文件路径，不内嵌 Markdown 正文。
- Markdown 在生成对应页面时按需读取，静态 HTML 生成后不进入客户端公共数据包。
- `canonicalSourceUrl` 用于解析正文中的相对链接。
- 导出器和消费者都必须拒绝路径穿越及符号链接逃逸。
- 未翻译文档可以只有源语言 variant，但仍保留目标语言占位路由。

## 6. 信息架构规则

API 文档不能以“几张已翻译页面卡片”作为主要入口。所有阅读页面共享同一结构：

```text
文档 / API 参考
  └── 官网分组
       └── 官网顺序的页面
            ├── 面包屑
            ├── 正文标题与审核状态
            ├── 页内目录
            └── 上一篇 / 下一篇
```

页面要求：

- 首页先提供“文档指南”和“API 参考”两个结构化入口，再展示当前中文译文。
- 章节首页展示全部官网分组、组内页面和翻译可用状态。
- 侧边栏按当前章节显示官网分组；当前页面所属分组默认展开。
- 中文标题只在已有中文 variant 时替换；未翻译页面继续显示官方英文标题，避免伪造翻译。
- 前后页关系由官网索引扁平顺序计算，不由字母或路径排序计算。
- 页面内目录从 Markdown 的二、三级标题生成。

## 7. 路由与缺失翻译

稳定路由直接继承官网文档路径，并增加 locale 前缀：

```text
https://developers.openai.com/api/docs/guides/agents.md
→ /en/api/docs/guides/agents
→ /zh/api/docs/guides/agents

https://developers.openai.com/api/reference/responses/overview.md
→ /en/api/reference/responses/overview
→ /zh/api/reference/responses/overview
```

规则：

- 英文 active 页面全部生成静态路径；默认直接渲染 Markdown 正文。
- 超过 1 MB 的事件/资源总表暂时生成轻量说明页并明确链接官网，避免数十 MiB 单页 HTML；后续按二、三级标题拆成结构化子页。
- 有中文译文时，`/zh` 渲染中文 Markdown。
- 无中文译文时，`/zh` 仍生成轻量状态页，并提供本站 `/en` 对应路径作为首选入口。
- 官网原文是明确的外部操作，不自动重定向。
- `/zh/api/docs`、`/en/api/docs`、`/zh/api/reference`、`/en/api/reference` 是结构化章节首页。
- 未知且不在 source manifest 的路由构建为 404，不能伪装成待翻译页面。

## 8. Markdown 链接转换

链接转换发生在渲染层，不修改 `docs/en` 或 `docs/zh` 原文。

算法：

1. 使用当前页面的 `canonicalSourceUrl` 解析相对链接。
2. 若目标 host 是 `developers.openai.com`，且路径位于 `/api/docs/` 或 `/api/reference/`，移除 `.md` 后增加当前 locale 前缀。
3. `/api/docs/llms.txt` 和 `/api/reference/llms.txt` 分别转换为本站对应章节首页。
4. 保留 query 与 hash。
5. 其他 HTTP(S)、`mailto:` 和 `tel:` 链接标为外部链接并在新窗口打开。
6. 拒绝 `javascript:` 等不安全协议。
7. 图片相对 URL 以官方页面 URL 解析；当前默认远程加载官方 HTTPS 资源。

示例：

```text
当前页面：https://developers.openai.com/api/docs/guides/agents/quickstart.md
正文链接：../tools.md#usage
中文结果：/zh/api/docs/guides/tools#usage
英文结果：/en/api/docs/guides/tools#usage
```

构建后应增加内部链接存在性检查：所有本地文档链接必须命中正文页、目标语言状态页或章节首页。

## 9. 官网地位与品牌边界

社区镜像必须帮助用户区分“内容权威来源”和“阅读辅助站”：

- 首页头部与独立来源卡片展示 `developers.openai.com` 和官网入口。
- 文档页提供“在 OpenAI 官网核对”链接。
- 页脚明确“非 OpenAI 官方项目”。
- 社交卡片使用本站文字标识，不使用 OpenAI 官方 logo 制造官方归属感。
- 接口行为、价格、限制和安全要求均提醒用户以官网为准。
- canonical URL 指向本站当前静态页；官网来源通过可见链接表达，不把社区页面声明为官网 canonical。

## 10. Vercel 静态部署

当前站点使用 Next.js `output: "export"`，生产产物为 `apps/web/out`。

Vercel 项目设置：

| 项目设置 | 值 |
| --- | --- |
| Root Directory | `apps/web` |
| Framework Preset | Next.js |
| Install Command | `pnpm install` |
| Build Command | `pnpm build` |
| Output Directory | `out` |
| 环境变量 | `NEXT_PUBLIC_SITE_ORIGIN=https://正式域名` |

Root Directory 设置必须启用 **Include source files outside of the Root Directory in the Build Step**；Vercel 默认禁止项目访问 Root Directory 外的文件，而当前内容位于仓库根部 `docs/`。

部署原则：

- Vercel 通过 GitHub PR Preview 验证变更，生产部署只来自受保护默认分支。
- 不把 Vercel token、项目 ID 或自定义域名凭据提交到仓库。
- 构建需要完整 Git checkout 和上述 Root Directory 外文件开关，以便 `apps/web` 读取仓库根部 `docs/`。
- 静态产物包含 sitemap、robots、Open Graph 图片和全部已知路由。
- 正文 Markdown 只在构建期读取，不复制到公共 JSON 或 JavaScript chunk。
- 回滚使用 Vercel 已有 deployment 或回滚 Git commit，不在站点内实现内容版本数据库。

## 11. 当前代码边界

虽然当前同仓，仍应保持以下依赖方向：

```text
OpenAI manifest / llms.txt
        ↓ 仅项目适配器理解
generated content metadata
        ↓
通用内容查询与 Markdown loader
        ↓
通用链接转换与页面组件
        ↓
Next.js / Vercel adapter
```

约束：

- React 组件不能直接理解 source/translation manifest 字段。
- Markdown 渲染器不能直接读取 OpenAI 的 `llms.txt`。
- 链接转换依赖由站点配置提供的 source host/path 规则；当前实现可以先固定 OpenAI，抽取时再参数化。
- 部署配置不能参与同步或翻译状态机。
- 翻译流水线不能为了 UI 修改原文 Markdown。

## 12. 何时抽取独立生成器

满足以下任一条件后启动抽取：

1. 第二个非 OpenAI 官网翻译仓库进入真实开发，而不是概念验证。
2. 当前站点的内容模型、路由和导航规则连续多个迭代保持稳定。
3. 多个内容仓库需要统一升级渲染、安全或主题能力。

不要仅为了目录整洁提前拆仓。真实第二站会暴露哪些能力通用、哪些能力只是 OpenAI 适配。

## 13. 抽取后的建议结构

```text
translated-docs-site/
├── packages/
│   ├── contracts/       # SiteContentManifest 与 schema 校验
│   ├── core/            # 路由、链接转换、Markdown、安全检查
│   ├── theme-default/   # 结构化文档 UI
│   └── cli/             # build/validate 命令
├── adapters/
│   └── manifest-json/   # 通用清单读取器
├── examples/
│   └── fixture-site/
└── tests/

OpenAI-API-Chinese/
├── docs/
├── scripts/
├── site-content.config.ts
└── apps/web/            # 仅薄集成层，或抽取稳定后移除
```

生成器推荐发布为固定版本的 npm 包/CLI。每个内容仓库在自己的 CI 中固定版本构建和独立部署，生成器 `main` 的变化不能自动影响全部线上站点。

## 14. 抽取步骤

### M1：稳定当前站

- 完成 Vercel Preview/Production 部署。
- 保持完整官网结构、英文全量路由和中文渐进覆盖。
- 将超过 1 MB 的事件/资源总表按标题拆成多个静态子页，替换当前轻量说明页。
- 增加代表性 guides/reference 大页面构建验证。
- 建立内部链接、sitemap 和静态产物体积检查。

### M2：冻结内容契约

- 将当前 generated metadata 显式升级为 `schemaVersion: 1`。
- 增加 JSON Schema 或 TypeScript runtime validator。
- 让 OpenAI 适配器输出契约，不再让 UI 依赖内部 manifest。
- 用 fixture 验证不含 OpenAI 字段也能构建。

### M3：提取无框架核心

- 提取 URL/route、链接转换、locale fallback、导航顺序和路径安全。
- 保持纯 TypeScript，避免核心包依赖 Next.js。
- 将现有测试随实现迁移，确保行为不变。

### M4：提取主题与 CLI

- 提取页面组件、CSS、SEO 和静态构建入口。
- 内容仓库只保留薄配置、适配器和部署工作流。
- OpenAI 站点先作为第一个外部消费者回归验证。

### M5：接入第二站

- 使用第二个官网自己的同步/翻译仓库生成同一契约。
- 禁止在 core/theme 中加入该官网的硬编码分支。
- 差异通过配置、内容元数据或站点专属薄适配器表达。

## 15. 质量门与验收标准

当前站每次合入至少验证：

- 内容元数据生成成功，421 个 active 页面全部出现在官方分组中。
- 英文 variant 和静态路径数等于 active source 页面数；普通页面正文可读，超大页面明确说明拆页状态。
- 中文 variant 数等于 translation manifest 的有效页面数。
- 官方绝对/相对链接、本地 hash、外部链接和危险协议测试通过。
- TypeScript、ESLint 和单元测试通过。
- `next build` 成功生成全部静态路径。
- `out` 不包含源 Markdown 公共数据包、secret、checkpoint 或 `.pnpm-store`。
- 首页可见官网来源、社区属性、两大文档入口和翻译进度。
- 文档页可见官网分组、面包屑、页内目录、语言切换及前后页。
- 未翻译中文页面首先链接本站英文页，不自动跳回官网。

未来通用生成器首个稳定版还应满足：

- 同一输入、配置和生成器版本得到可复现输出。
- 至少两个真实内容仓库无需修改 core 即可构建。
- 内容仓库独立固定生成器版本、部署和回滚。
- 生成器不负责抓取、翻译或内容优先级。

## 16. 安全与性能

- 所有内容路径先规范化，再验证位于允许根目录内。
- Markdown 默认不执行原始 HTML；脚本协议被拒绝。
- 外部链接使用 `noopener noreferrer`。
- 构建日志不得输出 secret、翻译 Provider 请求正文或凭据。
- `.pnpm-store/`、`node_modules/`、`.next/` 和 `out/` 必须忽略 Git。
- 421 篇 Markdown 按页面读取，不聚合进单个 TypeScript/JSON 内容文件。
- 完整侧边导航应评估 HTML 体积；需要搜索时优先生成轻量索引，而不是把 Markdown 发到浏览器。
- 官方远程图片后续可增加固定域名白名单、下载缓存和资源完整性策略。

这份文档同时是当前实现说明和未来新仓库的迁移依据。抽取时应迁移已经被第二站验证的稳定能力，而不是重新设计一套与线上行为不兼容的系统。
