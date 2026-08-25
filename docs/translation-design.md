# 中文翻译流水线设计

## 目标与边界

中文翻译流水线把 `docs/en` 中经过校验的 OpenAI 官方英文 Markdown 增量转换为 `docs/zh`，并让每一篇译文都可以追溯到源内容、翻译策略和人工校对状态。

本仓库负责 Markdown 结构保护、英文/中文路径映射、术语与提示词、翻译 manifest、增量选择和文档级质量门。批处理、并发、Provider 输出校验、重试、checkpoint、进度和取消复用已发布的 `@easy-translate/core`；OpenAI 与兼容接口复用 `@easy-translate/providers`。本仓库不复制 Provider 或通用翻译引擎。

当前本地切片提供离线的 `translate:status`、`translate:check`、`translate:plan`、Markdown adapter 和单篇 `translate:simulate`；另提供严格限定单篇的 `translate:run`，以及供受信任远端 workflow 使用的受预算约束 `translate:auto`，两者通过 `@easy-translate/providers` 接入 DeepSeek。simulate 不调用模型、不读取 API key，也不写入 `docs/zh`。

## 目录与持久化契约

```text
docs/en/                              # 只读官方英文镜像
docs/en/.source-manifest.json         # 英文来源事实
docs/zh/                              # 生成的简体中文 Markdown
docs/zh/.translation-manifest.json    # 中文翻译事实
scripts/translation.config.json       # 带 schemaVersion 的路径与语言配置
scripts/translation/                  # 翻译规划、提示词和术语表
```

中文路径严格镜像英文路径：

```text
docs/en/api/docs/guides/images-vision.md
→ docs/zh/api/docs/guides/images-vision.md
```

翻译 manifest 的每个完成记录至少保存：

- `sourceUrl`、`sourcePath`、`targetPath`。
- 本次翻译对应的 `sourceSha256`。
- 落盘中文文件的 `targetSha256`。
- 由目标语言、提示词、术语表、Markdown adapter 版本及 provider/model profile 共同计算的 `policySha256`。
- `translatedAt` 和 `reviewStatus`（`machine` 或 `reviewed`）。

manifest 不保存 API key、完整模型响应或供应商凭据。

翻译配置、术语表和 translation manifest 都使用显式的 `schemaVersion: 1`。持久化记录拒绝未知字段、非规范路径、重复 source/target 路径和无效 UTC 时间；所有读取都必须解析真实路径并拒绝逃逸仓库的符号链接。术语表以排序后的语义内容参与策略哈希，JSON 排版和对象键顺序不影响增量状态。

## 状态机与覆盖安全

状态由英文 manifest、中文 manifest 和磁盘文件共同推导，不依赖人工维护的状态字段：

| 状态 | 含义 | 自动翻译资格 |
| --- | --- | --- |
| `pending` | 没有记录，也没有中文文件 | 可以 |
| `stale-source` | 英文 SHA 已变化 | 可以 |
| `stale-policy` | 提示词、术语或 adapter 版本已变化 | 可以 |
| `missing-target` | 有完成记录，但中文文件丢失 | 可以 |
| `untracked-target` | 中文文件存在，但没有 manifest 记录 | 阻塞 |
| `modified-target` | 中文文件 SHA 与 manifest 不一致 | 阻塞 |
| `current` | 源、策略、目标文件均匹配 | 跳过 |
| `removed-source` | 英文来源已经移除 | 保留并交给维护者处理 |

`untracked-target` 必须通过后续显式 adopt 流程处理；`modified-target` 只能通过当前已实现的显式 review 流程收录。自动任务不得覆盖这两种状态，英文来源移除时也不自动删除中文文件。

## Markdown 保护策略

Markdown adapter 基于 mdast/micromark 的 GFM、frontmatter 与 MDX 语法树定位 source range，不能把整篇文档重新 stringify。它实现已发布 `@easy-translate/core@0.3.0` 的 `DocumentAdapter` 编译期契约，prepare 只输出翻译 plan 和不可变 format state，render 只对已登记区间倒序回填。以下内容必须保持字节级或语义级稳定：

- fenced/indented code、inline code、命令、JSON、类型签名和模型 ID。
- 链接目标、锚点、图片地址、HTML/MDX 标签和属性。
- Markdown 标记、表格结构、列表层级和空白意图。
- 占位符、环境变量、文件路径、URL、版本号和 API 字段名。

adapter 为每个文本单元提供 `heading/body/table/list/quote` block context，以及 `text/link-label/image-alt` kind；链接标签和图片 alt 可翻译，链接、图片目标和 title 不进入翻译单元。相邻正文与链接标签共享批次，使模型能结合完整句子翻译分段内容。fenced/indented code、inline code、HTML/MDX 整棵子树、frontmatter、自动链接、HTML 注释、转义符和字符实体都受到保护。由于 MDX 规范禁用缩进代码并拒绝 CommonMark 角括号自动链接，适配器会额外用 CommonMark AST 识别代码区间，并对自动链接/HTML 注释做等长掩码；等长掩码只用于解析，原始字节始终保存在 format state。官方索引页使用的多行导航卡片会被受限模式单独识别，只开放标签和说明文本，仍保护缩进、闭合标记和官方 URL。

render 拒绝缺失或多余单元、空文本、换行/控制字符、被篡改或重叠的区间和策略版本不匹配；回填后再次解析并比较受保护结构签名，结构、代码或 URL 变化时拒绝输出。恒等翻译不会改动任何字节。

## 增量、恢复与质量门

- 文档级选择由源 SHA 和 `policySha256` 决定。
- 单篇文档内部使用 Easy Translate checkpoint；只有整篇 render 和质量检查成功后才原子更新译文与 manifest。
- 批量任务默认低并发，先支持 `--section`、`--match` 和 `--limit`，再开放全量运行。
- 质量检查至少覆盖：Markdown 可重新解析、保护内容一致、无空译文、链接目标一致、代码块一致、manifest/文件 SHA 一致。
- 机器译文以 PR 形式进入 `main`；人工校对只提升 `reviewStatus`，英文或策略变化后仍会重新标记 stale。
- 人工润色会先自然进入 `modified-target`；显式 `translate:review` 只在源与策略仍有效、且中英文 Markdown 受保护结构一致时收录新的目标 SHA，并把记录提升为 `reviewed`。

Runner 只接受 Planner 判定为 `pending`、`stale-source`、`stale-policy` 或 `missing-target` 的单篇页面。checkpoint 位于 Git 忽略的 `.cache/translation-checkpoints/`；提交前重新加载工作区并再次验证状态、源 SHA、策略 SHA 和目标路径。写入顺序固定为译文后 manifest，因此异常中断会转化为可检测的阻塞状态，而不会产生虚假的 current 记录。

真实 profile 固定为 `deepseek` / `deepseek-chat`，key 只从 `DEEPSEEK_API_KEY` 注入；`translate:run` 自动加载仓库根目录下被 Git 忽略的 `.env`，现有进程环境优先。该命令必须提供 `--match` 与 `--limit 1`；默认调用模型但不写 `docs/zh` 或 manifest（可能更新 Git 忽略的 checkpoint），只有显式 `--commit` 才原子写入译文与 manifest。API key 不进入配置、策略哈希、日志、checkpoint 或 manifest；provider/model 变更会产生新的策略 SHA 和 checkpoint 路径。

## 分阶段交付

1. **规划基础（当前）**：配置、路径映射、策略哈希、manifest contract、状态/计划 CLI。
2. **Markdown adapter（当前本地分支）**：source-position 提取/还原、保护不变量、fixture 测试，并对齐 `@easy-translate/core` 的 `DocumentAdapter`。
3. **本地翻译执行器（当前本地分支）**：已完成 Core、checkpoint、单篇选择、质量策略、DeepSeek profile 和显式原子提交。
4. **质量与人工校对（当前本地分支）**：结构检查、术语检查、显式 review 收录和 stale 传播；后续补充未登记文件的 adopt 流程。
5. **自动翻译 PR（当前本地分支）**：英文变化合入 `main` 后立即触发，并每天补充执行；每轮一篇、20,000 源字符上限、单一待审核 PR，继续服从 `Quality gate` 和 `main` Ruleset。

任何阶段都不得把模型凭据写入仓库，也不得直接 push `main`。
