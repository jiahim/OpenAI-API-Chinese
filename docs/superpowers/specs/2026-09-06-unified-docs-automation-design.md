# 统一文档自动化设计

## 目标

把现有“英文同步 PR”和“中文翻译 PR”合并为一个无人值守的文档更新流程：定期从可信 `main` 同步官方英文内容，优先翻译本轮变化，验证本轮中英文一致性，创建或继续唯一的自动化 PR，并在 `Quality gate` 通过后自动合并。

正常路径不需要人工重跑 CI、审核或点击合并。同步、翻译或验证失败时必须停止合并，保留可诊断状态，并由后续定时运行安全续跑；持续失败才需要人工处理异常。

## 背景与根因

当前仓库由两个独立 workflow 维护文档：

- `sync-docs.yml` 定时从 `main` 创建 `automation/sync-openai-docs`，只同步 `docs/en/`，然后创建英文 PR。
- `translate-docs.yml` 在独立定时任务或 `docs/en/**` 合入 `main` 后，从当时的 `main` 创建 `automation/translate-openai-docs`，只更新 `docs/zh/`，然后创建中文 PR。

两个定时任务可能从同一个旧 `main` 并行分叉。已有翻译 PR 又会让后续翻译运行提前退出，因此“英文同步 PR 已合并”不代表对应中文翻译已经生成。现有 `translate:check` 允许 `pending` 和 `stale-source`，所以绿色 CI 只证明翻译文件与 manifest 结构安全，不证明本轮英文变化已经拥有最新中文译文。

自动 PR 由默认 `GITHUB_TOKEN` 创建。其首次 `pull_request` CI 会受到 GitHub 的递归保护，实际运行记录以 `action_required` 结束，需要人工重新运行。仓库的 `main-quality-gate` Ruleset 不要求 approving review，但要求 `Quality gate`；仓库级 auto-merge 当前关闭。因此现状至少需要人工重跑 CI 和人工合并两步。

## 已确认的产品规则

1. 每轮同步与翻译必须进入同一个 PR，并以同一个 `main` 快照为基线。
2. 本轮新增或修改的英文页面没有最新中文译文时，不得合并。
3. 本轮删除的英文页面没有同步处理中文页面和翻译记录时，不得合并。
4. 翻译最终失败时停止合并，不允许先合并英文、下轮再补中文。
5. 正常路径完全自动；异常通过失败状态通知，不设置日常人工审批。
6. 所有变更继续通过 PR 和 `Quality gate` 进入 `main`，不直接推送默认分支。
7. 不依赖 force push 更新自动化分支；远端状态不满足安全续跑条件时失败并报警。
8. 继续使用默认 `GITHUB_TOKEN`，不新增 PAT 或 GitHub App 私钥。

## 能力审计

| 用户动作 | 现有入口或接口 | 权威状态与副作用 | 重叠或缺口 | 决策 | 证据或未知 |
| --- | --- | --- | --- | --- | --- |
| 同步官方英文 | `scripts/sync-docs.ts sync`、`sync-docs.yml` | `docs/en/` 与 source manifest | 已有下载、限速、重试、空索引和异常删除保护 | Reuse | 同步测试已覆盖成功、失败和删除保护 |
| 生成变化摘要 | `scripts/sync-pr-summary.ts`、`docs/updates/*.json` | Git diff 与 source manifest | 已能记录新增、修改和删除路径；需适配统一 PR 文案 | Extend | release 记录可作为本轮英文差异来源 |
| 翻译页面 | `translate:auto`、translation planner/runner | `docs/zh/` 与 translation manifest | 当前按全局优先级选择，不能保证本轮变化优先完成 | Extend | `automaticTranslationCandidates` 当前先按状态和静态优先级排序 |
| 恢复翻译 | runner checkpoint 与页面级重试 | 成功页面、manifest、临时 checkpoint | 单次运行可恢复；跨 workflow 运行依赖自动化分支持久化已完成页面 | Compose | 当前 workflow 已在部分失败后发布成功页面 |
| 验证翻译完整性 | `translate:check` | translation page state | 接受 `pending`、`stale-source`，不足以证明批次一致 | Extend | `assertTranslationIntegrity` 只拒绝 missing/modified/untracked target |
| 创建或更新 PR | 两个 workflow 内的 GitHub Script | 两个固定 automation 分支与两个 PR | 需要统一为一个分支和一个 PR | Compose | 现有 PR 查询和创建逻辑可复用 |
| 运行质量门禁 | `ci.yml` 的 `Quality gate` | PR head SHA 上的 check run | 自动 PR 首次运行被标记 `action_required` | Extend | PR #65/#66 首次均为 action_required，人工 rerun 后通过 |
| 满足后自动合并 | Ruleset + GitHub auto-merge | `main` 更新 | Ruleset 已具备，仓库 auto-merge 未启用，workflow 未请求 auto-merge | Create | Ruleset 要求 Quality gate、review count 为 0；仓库 allow_auto_merge=false |
| 失败提醒 | GitHub Actions 失败状态 | workflow run conclusion | 无需新增外部通知系统 | Reuse | GitHub 原生失败运行作为异常入口 |

所有自动决策均为确定性规则：Git diff、页面状态、检查结论、PR 状态和合并资格由脚本及 GitHub API 决定。模型只负责把已选定的 Markdown 语义单元翻译为中文，不得决定批次范围、是否通过门禁、是否合并或如何处理权限。

## 方案比较

### 方案 A：保留 `GITHUB_TOKEN`，显式调度只读 CI（采用）

统一 workflow 用 `GITHUB_TOKEN` 创建 PR，然后通过 GitHub 官方允许的 `workflow_dispatch` 入口，在自动化分支的精确 head SHA 上显式启动 `CI`。CI 只读；成功后 workflow 为 PR 启用 auto-merge。

优点是无长期个人凭据、无需创建 GitHub App，并保留 GitHub 对普通 token 事件的递归保护。代价是需要给统一 workflow 增加 `actions: write`，并在上线前用真实 PR 验证 dispatched `Quality gate` 确实绑定到 PR head SHA、满足 Ruleset。

### 方案 B：GitHub App 创建 PR

GitHub App token 创建的 PR 可自然触发 `pull_request` CI，再启用 auto-merge。事件模型更接近日常 PR，但需要新建和安装 App、保存 App ID 与私钥，并显式替代原有隐式防递归。

当前没有必须新增持久凭据的能力缺口，因此不采用。

### 方案 C：自动直接推送 `main`

实现最短，但绕过 PR、Ruleset 和独立质量门禁，且违反仓库的默认分支交付约定，因此排除。

## 目标架构

### Workflow 拓扑

保留两个职责明确的 workflow：

1. `update-docs.yml` 是唯一有文档写权限的生产者，仅由 `schedule` 和 `workflow_dispatch` 触发。
2. `ci.yml` 是只读验证者，保留普通 `pull_request`、`push main`，并支持由生产者显式 `workflow_dispatch` 到指定 automation ref。

删除 `translate-docs.yml` 的独立定时触发和 `push main paths: docs/en/**` 触发；原 `sync-docs.yml` 的同步步骤并入 `update-docs.yml`。合并统一 PR 后只可能触发只读 CI，不会触发新的同步或翻译。

```text
schedule / workflow_dispatch
          |
          v
update-docs（唯一写入者）
  1. 从可信 main 准备或续跑 automation 分支
  2. 同步 docs/en
  3. 计算本轮英文差异
  4. 优先翻译本轮差异
  5. 检查批次一致性
  6. 推送并创建/更新一个 PR
          |
          v
显式 workflow_dispatch CI（只读）
          |
          v
Quality gate 成功 -> auto-merge -> main
                                  |
                                  v
                           只读 push CI，结束
```

### 分支与 PR

- 唯一分支：`automation/update-openai-docs`。
- 唯一 PR 标题：`[AI] docs: 同步并翻译 OpenAI 官方文档`。
- 无开放 PR 时，automation 分支必须不存在或可从远端 `main` fast-forward，然后从最新 `main` 开始新批次。
- 有开放 PR 时，先验证它的 head、base、作者和允许修改路径，再继续同一个分支。
- automation 分支相对 `main` 只允许修改 `docs/en/**`、`docs/zh/**` 和 `docs/updates/**`。出现 workflow、脚本、依赖或其他路径时立即失败，不执行含密钥步骤。
- 续跑前把最新 `main` fast-forward 或常规 merge 到 automation 分支；只允许 fast-forward push，不使用 `--force` 或 `--force-with-lease`。
- 如果 PR 被关闭但未合并，且远端 automation 分支不能安全 fast-forward 到 `main`，workflow 失败并提示人工处理，不自动覆盖历史。

### 可信代码与密钥边界

workflow 始终先检出受信任的 `main`，安装锁定依赖并运行同步器、翻译器和状态模型测试。只有在确认 automation 分支相对 `main` 的差异完全属于允许的生成内容路径后，才在该工作树上执行当前 `main` 提供的脚本。

翻译密钥只注入翻译步骤，不进入 PR 创建、CI dispatch 或 auto-merge 步骤。PR CI 不读取翻译密钥。workflow 权限按步骤所需收敛为：

- `contents: write`：推送 automation 分支；
- `pull-requests: write`：创建、更新 PR 和请求 auto-merge；
- `actions: write`：显式 dispatch `CI`；
- 其他权限保持 `none` 或 `read` 的最小值。

`translation-production` Environment 当前没有审批规则，继续用于隔离翻译 secrets 和 variables，不新增人工 reviewer。

## 批次差异与翻译顺序

本轮必需集合由 automation 分支相对最新 `origin/main` 的 `docs/en/**` 差异确定，而不是由固定文章清单决定：

- added/modified：必须翻译到与当前 source SHA 和 policy SHA 匹配的 `current` 状态；
- removed：必须同步移除或终止对应中文页面记录，不能留下仍可导航的孤立译文；
- manifest-only 变化：按实际页面 SHA 判断，不能仅因 manifest 时间戳变化触发重翻。

翻译选择顺序调整为：

1. 本轮 added/modified 页面；
2. 本轮删除清理；
3. 现有 `stale-source`；
4. `stale-policy`；
5. 其他 pending 页面。

现有预算和预计耗时限制继续有效。预算耗尽不是质量失败：若本轮必需集合尚未完成，PR 保持 draft 并等待下轮续跑；若本轮必需集合已完成，历史积压尚未完成不阻止合并。任何已开始页面的最终翻译错误属于失败，必须阻止合并。

## 一致性门禁

新增面向本轮差异的确定性检查，不改变 `translate:check` 作为全仓结构完整性检查的职责。

统一 PR 只有同时满足以下条件才可进入 ready 状态：

1. `docs:status` 和现有同步完整性检查通过。
2. `translate:check` 通过，没有 `missing-target`、`modified-target` 或 `untracked-target`。
3. 本轮所有 added/modified 英文页面的翻译状态均为 `current`。
4. 本轮 removed 页面已经按删除策略处理，不存在孤立目标或活动记录。
5. automation 分支只修改允许的生成内容路径。
6. 翻译步骤没有最终错误。
7. PR head SHA 与即将 dispatch CI、启用 auto-merge 的 SHA 完全一致。

检查输出必须列出阻塞页面及状态，不能只返回布尔值。检查失败时不得 dispatch CI，也不得启用 auto-merge。

## PR 生命周期与失败续跑

统一 PR 使用以下状态机：

```text
IDLE
  -> RUNNING
       -> BLOCKED_DRAFT（翻译失败、预算不足或一致性未通过）
       -> READY_FOR_CI
              -> CI_FAILED
              -> AUTO_MERGE_PENDING
                     -> MERGED
```

- `BLOCKED_DRAFT`：提交并推送已成功生成的内容，创建或保持 draft PR，PR 摘要列出阻塞原因。若原因是页面最终翻译错误，workflow 以失败结束；若只是预算在必需集合完成前正常耗尽，workflow 成功结束但明确输出 `required_complete=false`，且不得 dispatch CI 或请求 auto-merge。
- 后续定时运行遇到该 PR 时，验证来源与路径后继续该分支，不创建第二个 PR。
- `READY_FOR_CI`：将 PR 转为 ready，显式 dispatch `CI` 到精确 automation ref，并为当前 head 请求 auto-merge。
- `CI_FAILED`：GitHub Ruleset 保持 PR 未合并；下一次生成新 head 后必须重新 dispatch CI。
- `AUTO_MERGE_PENDING`：只有当前 head 的 `Quality gate` 成功才由 GitHub 合并。
- PR 被人工关闭、head 被非预期 actor 修改、base 改变或允许路径外出现文件时，workflow fail closed，不尝试修复远端历史。

每次运行都使用同一 `concurrency.group`，设置 `cancel-in-progress: false`，保证任意时刻只有一个写入者。PR 查询、分支验证和 push 使用 head SHA/lease 条件避免检查后状态变化；条件不满足时失败，不覆盖对方更新。

## CI 显式调度与防递归

`ci.yml` 增加 `workflow_dispatch` 输入，用于记录 automation PR number、预期 head SHA、head ref 和标题。CI 开始时必须验证：

- 当前 `GITHUB_SHA` 等于预期 head SHA；
- ref 是 `automation/update-openai-docs`；
- 对应开放 PR 的 base 是 `main`，标题具有 `[AI] ` 前缀；
- PR 实际 head SHA 未在 dispatch 后变化。

验证通过后运行与普通 PR 相同的完整 `Quality gate`。CI 不拥有 contents、PR 或 actions 写权限。

防递归来自明确拓扑，而不是 actor 字符串判断：

- writer 不监听 `push` 或 `pull_request`；
- CI 不写仓库和 PR；
- writer 只 dispatch CI，CI 不 dispatch writer；
- 合并后的 main push 不触发 writer；
- 独立翻译 schedule 和 docs/en push trigger 被删除。

上线前必须通过一次真实 canary 证明 dispatched `Quality gate` 绑定在 automation PR 的当前 head，并满足 `main-quality-gate`。若这一事实未被验证，不得启用该 PR 的 auto-merge；不能用测试通过推断 GitHub Ruleset 已识别正确的 check run。

## GitHub 设置

审计结果：

- `main-quality-gate` Ruleset 已启用 PR 要求和 `Quality gate`，required approving review count 为 0；保持不变。
- `translation-production` 没有 required reviewer；保持不变。
- Actions 默认权限为 read，workflow 使用显式 permissions；保持仓库默认值。
- 仓库 `Allow auto-merge` 当前关闭；需要启用。

启用 auto-merge 是唯一预期的 GitHub UI 设置变更。该设置只开放“PR 可请求自动合并”的能力，不绕过 Ruleset；具体 automation PR 仍须由 workflow 请求 auto-merge，且必须等待 `Quality gate` 成功。

设置修改通过内置浏览器完成。保存前重新核对仓库 `jiahim/OpenAI-API-Chinese`、当前开关值和 Ruleset，并按浏览器确认策略取得即时确认。

## 测试与真实验收

### 自动测试

- 为本轮 source diff 解析增加 added/modified/removed、manifest-only、非法路径和空差异测试。
- 为 required-first 翻译选择增加预算不足、历史积压、本轮页面失败和删除页面测试。
- 为批次一致性检查增加 `current` 通过以及 pending、stale-source、missing-target、孤立删除失败测试。
- 为 PR 状态机增加首次创建、draft 续跑、head 漂移、关闭未合并、非法文件和 CI 失败测试。
- 为 workflow 输入与权限增加静态契约测试，确保 writer 没有 push/pull_request trigger，CI 没有写权限。
- 运行根目录 typecheck、tests、translation check，以及 web typecheck、lint、tests、build。

### 真实产品验收

这是跨 GitHub Actions、Ruleset、PR 和 Vercel 的真实发布链路，自动测试不能替代真实验收。上线时使用一个可控的小批次执行：

1. 手动 dispatch 统一 workflow。
2. 确认只出现一个 automation 分支和一个 PR。
3. 确认 PR 同时包含英文、中文和两个 manifest 的一致变更。
4. 确认 PR 无人工 rerun 即获得当前 head 的 `Quality gate`。
5. 确认 auto-merge 只在检查成功后执行。
6. 确认合并后没有启动第二个同步或翻译 PR。
7. 确认生产站点部署并能读取合并后的中英文内容。
8. 再用 Fake/Echo Provider 或受控失败验证 draft、停止合并和下轮续跑。

## 发布顺序

1. 合入脚本、测试和统一 workflow；旧 workflow 保持关闭或在同一提交中移除其生产触发，避免双写。
2. 通过内置浏览器启用仓库 auto-merge。
3. 手动 dispatch canary，先验证显式 CI 与 Ruleset 的关联。
4. canary 全部通过后保留 schedule；任何一步不通过都关闭统一 workflow 的 schedule 或禁用 auto-merge 请求路径。
5. 观察至少一个完整定时周期，确认没有重复 PR、错位或递归触发。

## 回滚

- 禁用 `update-docs.yml` 的 schedule 或临时将 workflow 设为仅 `workflow_dispatch`，可立即停止自动写入。
- 关闭仓库 auto-merge，所有已有 PR 将恢复为人工合并，不影响 Ruleset。
- 不自动删除 automation 分支或关闭 PR；保留现场供诊断。
- 恢复旧 workflow 前必须确认统一 workflow 已停用，禁止两个 writer 同时运行。

## 非目标

- 不自动绕过 `main-quality-gate`。
- 不自动合并代码功能 PR，只处理固定 automation 分支的文档 PR。
- 不让模型决定是否合并或修改 GitHub 权限。
- 不保证一次运行清空全部历史翻译积压；只保证本轮官方变化在合并前一致。
- 不自动修复被人工修改、关闭或改变 base 的 automation PR。

## 实施前必须满足的证据

1. 单元和集成测试证明本轮 required 集合不会被历史优先级或预算跳过。
2. 失败路径证明 PR 保持 draft 且不会请求 auto-merge。
3. 真实 canary 证明 `workflow_dispatch` 产生的 `Quality gate` 被 Ruleset 识别为 automation PR 当前 head 的 required check。
4. 真实 canary 证明合并后不会再次触发 writer。
5. 浏览器中确认 auto-merge 已启用，Ruleset 和 Environment 审批配置未被意外修改。
