# 弃用

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 概述

随着我们推出更安全、更强大的模型，我们会定期淘汰较旧的模型。依赖 OpenAI 模型的软件可能需要偶尔更新才能继续工作。受影响的客户将始终通过电子邮件和我们的文档收到通知，同时还有 [博客文章](https://openai.com/blog) 以了解更大的变更。

此页面列出了所有 API 弃用项及推荐的替代方案。

## 模型弃用通知期限

我们在停用模型前会提前通知，以便客户有时间规划和迁移。当我们宣布模型弃用时，会通过电子邮件通知正在积极使用该模型的客户，并在本页记录弃用信息。

除非安全或合规问题要求更快的时间表，否则我们会在模型停用前提供以下最短通知期：

- **正式可用模型：** 至少 6 个月。
- **正式可用模型的专门变体：** 至少 3 个月。示例包括聊天变体，如 `gpt-5.1-chat-latest`、Codex 变体，如 `gpt-5.3-codex`，以及深度研究变体，如 `o3-deep-research`.
- **预览模型：** 预览模型，通过模型名称中的 `preview` 标识，可能会以更短的通知期被停用，例如 2 周。示例包括 `computer-use-preview` 和 `gpt-4o-audio-preview`。我们不建议将预览模型用于业务关键型生产工作负载，除非你可以短时间通知后迁移。

如果出于安全或合规方面的考虑，我们需要提前停用某个模型，我们会尽可能提前通知。

这些通知期让客户有时间评估推荐的替代模型、测试应用行为，并在模型不再可用之前完成迁移。在某些情况下，开发者或许可以配置专用容量，以便在模型停用日期之后继续访问。要了解这一选项， [请联系我们的销售团队](https://openai.com/contact-sales/).

## 弃用与旧版

我们使用“弃用”一词来指代停用某个模型或端点的过程。当我们宣布某个模型或端点被弃用时，它立即可被视为已弃用。所有已弃用的模型和端点也将有一个关闭日期。在关闭时，该模型或端点将不再可访问。

我们将“sunset”和“shut down”这两个术语互换使用，均指模型或端点不再可访问。

我们使用“legacy”一词来指代不再接收更新的模型和端点。我们将端点与模型标记为legacy，是为了向开发者表明我们平台的发展方向，并提示开发者应迁移至更新的模型或端点。你可以预期，legacy模型或端点将在未来的某个时间点被弃用。

## 即将弃用

即将弃用的功能列示如下，最新公告位于顶部。

### 2026-07-20：旧版音频、实时和转录模型

2026年7月20日，我们通知了使用遗留音频、实时和转录模型系列及快照的开发者，这些内容将于2027年1月20日从API中弃用并移除。

| 停用日期 | 模型系列/快照             | 推荐替代方案             |
| ------------- | ----------------------------------- | ----------------------------------- |
| 2027年1月20日  | `gpt-realtime`                      | `gpt-realtime-2.1`                  |
| 2027年1月20日  | `gpt-audio`                         | `gpt-audio-1.5`                     |
| 2027年1月20日  | `gpt-4o-audio`                      | `gpt-audio-1.5`                     |
| 2027年1月20日  | `gpt-4o-realtime`                   | `gpt-realtime-2.1`                  |
| 2027年1月20日  | `gpt-realtime-mini`                 | `gpt-realtime-2.1-mini`             |
| 2027年1月20日  | `gpt-audio-mini`                    | `gpt-audio-1.5`                     |
| 2027年1月20日  | `gpt-4o-mini-realtime`              | `gpt-realtime-2.1-mini`             |
| 2027年1月20日  | `gpt-4o-mini-audio`                 | `gpt-audio-1.5`                     |
| 2027年1月20日  | `gpt-4o-mini-transcribe-2025-03-20` | `gpt-4o-mini-transcribe-2025-12-15` |

### 2026-06-11: GPT-5 和 o3 模型弃用

2026年6月11日，我们通知使用较旧GPT-5和o3模型快照的开发者，这些快照将于2026年12月11日从API中弃用并移除。

| 停用日期 | 模型 / 系统          | 推荐替代方案               |
| ------------- | ----------------------- | ------------------------------------- |
| 2026-12-11  | `gpt-5-2025-08-07`      | `gpt-5.6-sol`                         |
| 2026-12-11  | `gpt-5-mini-2025-08-07` | `gpt-5.6-terra`                       |
| 2026-12-11  | `gpt-5-nano-2025-08-07` | `gpt-5.6-luna`                        |
| 2026-12-11  | `gpt-5-pro-2025-10-06`  | `gpt-5.6-sol` (`reasoning.mode: pro`) |
| 2026-12-11  | `o3-2025-04-16`         | `gpt-5.6-sol`                         |
| 2026-12-11  | `o3-pro-2025-06-10`     | `gpt-5.6-sol` (`reasoning.mode: pro`) |

### 2026-06-03：可复用提示词

2026年6月3日，我们通知了在仪表板和API中使用可复用提示词的开发者，可复用提示词对象即将弃用。

| 日期         | 更新                                                                       |
| ------------ | ---------------------------------------------------------------------------- |
| 2026年6月3日 | 宣布弃用，并降低提示词创建在平台中的权重。     |
| 2026年11月30日 | 该 `v1/prompts` API 和可重复使用的提示词对象计划关闭。 |

要迁移，请将可复用的提示内容移入你的应用程序代码。参见 [从提示对象迁移](https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object).

### 2026-06-03：Evals 平台

2026年6月3日，我们通知了使用Evals平台的开发者，该产品将被弃用。

| 日期         | 更新                                                  |
| ------------ | ------------------------------------------------------- |
| 2026年6月3日 | 宣布弃用Evals平台。           |
| 2026年10月31日 | 现有evals变为只读。                        |
| 2026年11月30日 | Evals仪表板和API计划关闭。 |

用于评估工作流而记录的评估器属于这一过渡的一部分。微调相关的时间线仍在下面的自助微调部分中涵盖。

参见 [从 OpenAI Evals 迁移到 Promptfoo](https://developers.openai.com/cookbook/examples/evaluation/moving-from-openai-evals-to-promptfoo) 了解迁移路径。

### 2026-06-03：智能体构建器

2026年6月3日，我们通知使用智能体 Builder的开发者，该产品已被弃用。ChatKit仍可使用。

| 日期         | 更新                                   |
| ------------ | ---------------------------------------- |
| 2026年6月3日 | 已宣布智能体构建器弃用。 |
| 2026年11月30日 | 智能体构建器计划关闭。 |

参见 [从 智能体 Builder 迁移](https://developers.openai.com/api/docs/guides/agent-builder/migrate-from-agent-builder) ，以继续使用 Agents SDK 或 ChatGPT Workspace 智能体。

### 2026-06-02：GPT Image 模型弃用

2026年6月2日，我们通知使用旧版 GPT Image 模型的开发者，这些模型将于2026年12月1日弃用并从 API 中移除。

| 停用日期 | 模型/系统         | 推荐替代方案 |
| ------------- | ---------------------- | ----------------------- |
| 2026-12-01   | `gpt-image-1-mini`     | `gpt-image-2`           |
| 2026-12-01   | `gpt-image-1.5`        | `gpt-image-2`           |
| 2026-12-01   | `chatgpt-image-latest` | `gpt-image-2`           |

### 更新至OpenAI的自助微调

2026年5月7日，我们通知使用 OpenAI 自助微调平台的开发者有关可用性的更新。

在对基础模型弃用之前，微调模型的推理将继续可用。

| 日期         | 更新                                                                                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026年5月7日  | 对于未曾运行过微调的组织，将无法创建微调任务或进行训练。                                                                                |
| 2026年7月2日 | 对于在过去60天内未对微调模型进行推理的组织，将不再允许创建微调任务。                                                         |
| 2027年1月6日  | 现有的活跃客户自该日期起将无法再创建新的微调任务。仅当底层基础模型弃用时，对微调模型的推理才会被禁用。 |

### 2026-04-22：旧版 GPT 模型快照

为了提高可靠性并让开发者更容易选择合适的模型，我们将弃用一组较旧的 OpenAI 模型。对这些模型的访问将在以下日期关闭。

| 关停日期    | 模型快照                                                         | 替代模型                      |
| ---------------- | ---------------------------------------------------------------------- | ------------------------------------- |
| 2026-10-23 | `gpt-3.5-turbo-0125` \| `gpt-3.5-turbo`, `gpt-3.5-turbo-completions`   | `gpt-5.6-terra`                       |
| 2026-10-23 | `gpt-4-0613` \| `gpt-4`, `gpt-4-0613-completions`, `gpt-4-completions` | `gpt-5.6-sol`                         |
| 2026-10-23 | `gpt-4-1106-preview`                                                   | `gpt-5.6-sol`                         |
| 2026-10-23 | `gpt-4-turbo` \| `gpt-4-turbo-2024-04-09`, `gpt-4-turbo-completions`   | `gpt-5.6-sol`                         |
| 2026-10-23 | `gpt-4.1-nano` \| `gpt-4.1-nano-2025-04-14`                            | `gpt-5.6-luna`                        |
| 2026-10-23 | `gpt-4o-2024-05-13`                                                    | `gpt-5.6-sol`                         |
| 2026-10-23 | `gpt-image-1`                                                          | `gpt-image-2`                         |
| 2026-10-23 | `o1-2024-12-17` \| `o1`                                                | `gpt-5.6-sol`                         |
| 2026-10-23 | `o1-pro-2025-03-19` \| `o1-pro`                                        | `gpt-5.6-sol` (`reasoning.mode: pro`) |
| 2026-10-23 | `o3-mini-2025-01-31` \| `o3-mini`                                      | `gpt-5.6-sol`                         |
| 2026-10-23 | `ft-o4-mini-2025-04-16`                                                | `gpt-5.6-terra`                       |
| 2026-10-23 | `o4-mini-2025-04-16` \| `o4-mini`                                      | `gpt-5.6-terra`                       |

我们还移除了以下微调版本：

| 停用日期    | 模型快照               | 推荐的替代基础模型 |
| ---------------- | ---------------------------- | ---------------------------------- |
| 2026-10-23 | `ft-gpt-3.5-turbo`           | `gpt-5.6-terra`                    |
| 2026-10-23 | `ft-gpt-4`                   | `gpt-5.6-sol`                      |
| 2026-10-23 | `ft-gpt-4.1-nano-2025-04-14` | `gpt-5.6-luna`                     |
| 2026-10-23 | `ft-babbage-002`             | `gpt-5.6-terra`                    |
| 2026-10-23 | `ft-davinci-002`             | `gpt-5.6-terra`                    |

### 2026-03-24：Sora 2 视频生成模型和 Videos API

2026年3月24日，我们通知使用Videos API和Sora 2视频生成模型别名及快照的开发者，它们将于2026年9月24日从API中弃用并移除。

| 停用日期 | 模型 / 系统          | 推荐替代方案 |
| ------------- | ----------------------- | ----------------------- |
| 2026-09-24    | Videos API              | ---                     |
| 2026-09-24    | `sora-2`                | ---                     |
| 2026-09-24    | `sora-2-pro`            | ---                     |
| 2026-09-24    | `sora-2-2025-10-06`     | ---                     |
| 2026-09-24    | `sora-2-2025-12-08`     | ---                     |
| 2026-09-24    | `sora-2-pro-2025-10-06` | ---                     |

### 2025-09-26：旧版 GPT 模型快照

为了提高可靠性，并让开发者更容易选择合适的模型，我们将在未来六到十二个月内逐步弃用一组使用率不断下降的 OpenAI 旧模型。这些模型的访问权限将在以下日期关闭。

| 停用日期 | 模型/系统           | 建议的替代方案 |
| ------------- | ------------------------ | ----------------------- |
| 2026-09-28    | `gpt-3.5-turbo-instruct` | `gpt-5.6-terra`         |
| 2026-09-28    | `babbage-002`            | `gpt-5.6-terra`         |
| 2026-09-28    | `davinci-002`            | `gpt-5.6-terra`         |
| 2026-09-28    | `gpt-3.5-turbo-1106`     | `gpt-5.6-terra`         |

### 2025-08-20：助手 API

2025 年 8 月 26 日，我们通知了使用 Assistants API 的开发者，该 API 将在一年后，即 2026 年 8 月 26 日被弃用并从平台移除。

当我们于 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) 发布 [2025 年 3 月](https://developers.openai.com/api/docs/changelog)，时，我们宣布计划将所有 Assistants API 功能迁移到更易用的 Responses API，并设定了 2026 年的日落日期。

请参阅《Assistants 到 Conversations 的 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) 》，了解如何将当前集成迁移到 Responses API 和 Conversations API。

| 停用日期 | 模型/系统 | 推荐替代方案             |
| ------------- | -------------- | ----------------------------------- |
| 2026‑08‑26    | Assistants API | Responses API 与 Conversations API |

## 过往弃用

过去的弃用公告列表如下，最新的公告位于顶部。

### 2026-05-08：gpt-5.2-chat-latest 和 gpt-5.3-chat-latest 模型快照

2026 年 5 月 8 日，我们已通知使用 API 的开发者 `gpt-5.2-chat-latest` 以及 `gpt-5.3-chat-latest` 模型快照的弃用及移除。

| 停用日期 | 模型/系统        | 推荐替代 |
| ------------- | --------------------- | ----------------------- |
| 2026-08-10  | `gpt-5.2-chat-latest` | `gpt-5.6-sol`           |
| 2026-08-10  | `gpt-5.3-chat-latest` | `gpt-5.6-sol`           |

### 2026-04-22：旧版 GPT 模型快照（2026 年 7 月关闭）

2026年4月22日，我们宣布弃用以下旧版 OpenAI 模型。这些模型的访问已于2026年7月23日关闭。

| 关闭日期 | 模型快照                                                | 替代模型        |
| ------------- | ------------------------------------------------------------- | ----------------------- |
| 2026-07-23 | `computer-use-preview-2025-03-11` \| `computer-use-preview`   | `gpt-5.6-terra`         |
| 2026-07-23 | `gpt-4o-mini-search-preview-2025-03-11`                       | `gpt-5.6-terra`         |
| 2026-07-23 | `gpt-4o-search-preview-2025-03-11`                            | `gpt-5.6-terra`         |
| 2026-07-23 | `gpt-5-chat-latest`                                           | `gpt-5.6-sol`           |
| 2026-07-23 | `gpt-5-codex`                                                 | `gpt-5.6-sol`           |
| 2026-07-23 | `gpt-5.1-chat-latest`                                         | `gpt-5.6-sol`           |
| 2026-07-23 | `gpt-5.1-codex`                                               | `gpt-5.6-sol`           |
| 2026-07-23 | `gpt-5.1-codex-max`                                           | `gpt-5.6-sol`           |
| 2026-07-23 | `gpt-5.1-codex-mini`                                          | `gpt-5.6-terra`         |
| 2026-07-23 | `gpt-audio-mini-2025-10-06`                                   | `gpt-audio-1.5`         |
| 2026-07-23 | `gpt-realtime-mini-2025-10-06`                                | `gpt-realtime-2.1-mini` |
| 2026-07-23 | `o3-deep-research-2025-06-26` \| `o3-deep-research`           | `gpt-5.6-sol`           |
| 2026-07-23 | `o4-mini-deep-research-2025-06-26` \| `o4-mini-deep-research` | `gpt-5.6-sol`           |
| 2026-07-23 | `gpt-5.2-codex`                                               | `gpt-5.6-sol`           |

### 2025-11-18：chatgpt-4o-latest 快照

2025 年 11 月 18 日，我们通知使用 `chatgpt-4o-latest` 模型快照的开发者，该模型将于 2026 年 2 月 17 日从 API 中弃用并移除。

| 停用日期 | 模型/系统      | 推荐替代方案 |
| ------------- | ------------------- | ----------------------- |
| 2026-02-17    | `chatgpt-4o-latest` | `gpt-5.1-chat-latest`   |

### 2025-11-17：codex-mini-latest 模型快照

2025 年 11 月 17 日，我们通知使用 `codex-mini-latest` 模型的开发者，该模型将于 2026 年 2 月 12 日停止使用并从 API 中移除。作为此弃用的一部分，我们将不再支持旧的本地 shell 工具，该工具仅可用于 `codex-mini-latest`。对于新的用例，请使用我们最新的 shell 工具。

| 停用日期 | 模型/系统      | 建议的替代方案 |
| ------------- | ------------------- | ----------------------- |
| 2026-02-12    | `codex-mini-latest` | `gpt-5-codex-mini`      |

### 2025-11-14: DALL·E 模型快照

2025年11月14日，我们通知使用DALL·E模型快照的开发者，这些快照将于2026年5月12日从API中弃用并移除。

| 停用日期 | 模型/系统 | 推荐替代方案                             |
| ------------- | -------------- | --------------------------------------------------- |
| 2026-05-12    | `dall-e-2`     | `gpt-image-2`, `gpt-image-1`或 `gpt-image-1-mini` |
| 2026-05-12    | `dall-e-3`     | `gpt-image-2`, `gpt-image-1`或 `gpt-image-1-mini` |

### 2025-09-26：旧版 GPT 模型快照（2026 年 3 月停用）

为提高可靠性并让开发者更容易选择合适的模型，我们弃用了一批使用量下降的旧版 OpenAI 模型。这些模型的访问已于 2026 年 3 月 26 日关闭。

| 停用日期 | 模型 / 系统                                                                                                             | 推荐替代方案 |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 2026-03-26    | `gpt-4-0314`                                                                                                               | `gpt-5` 或 `gpt-4.1*`   |
| 2026-03-26    | `gpt-4-1106-preview`                                                                                                       | `gpt-5` 或 `gpt-4.1*`   |
| 2026-03-26    | `gpt-4-0125-preview` （包括 `gpt-4-turbo-preview` 和 `gpt-4-turbo-preview-completions`，这些均指向此快照） | `gpt-5` 或 `gpt-4.1*`   |

\*对于特别注重延迟且不需要推理的任务

### 2025-09-15：Realtime API Beta

Realtime API Beta 已弃用，并于 2026 年 5 月 12 日从 API 中移除。

Realtime beta API 与已发布的 GA API 接口之间存在几个关键差异。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) 以了解当前的 GA 接口及相关的 Realtime 文档。

| 停用日期 | 模型 / 系统           | 推荐替代 |
| ------------- | ------------------------ | ----------------------- |
| 2026-05-12    | OpenAI-Beta: realtime=v1 | Realtime API            |

### 2025-09-15：gpt-4o-realtime-preview 模型

2025年9月，我们通知使用gpt-4o-realtime-preview模型的开发者，这些模型将在六个月内从API中弃用并移除。

| 停用日期 | 模型/系统                     | 推荐替代方案 |
| ------------- | ---------------------------------- | ----------------------- |
| 2026-05-07    | gpt-4o-realtime-preview            | gpt-realtime-1.5        |
| 2026-05-07    | gpt-4o-realtime-preview-2025-06-03 | gpt-realtime-1.5        |
| 2026-05-07    | gpt-4o-realtime-preview-2024-12-17 | gpt-realtime-1.5        |
| 2026-05-07    | gpt-4o-mini-realtime-preview       | gpt-realtime-mini       |
| 2026-05-07    | gpt-4o-audio-preview               | gpt-audio-1.5           |
| 2026-05-07    | gpt-4o-mini-audio-preview          | gpt-audio-mini          |

### 2025-06-10：gpt-4o-realtime-preview-2024-10-01

2025年6月10日，我们通知使用gpt-4o-realtime-preview-2024-10-01的开发者，该模型将在三个月后从API中弃用并移除。

| 停用日期 | 模型 / 系统                     | 建议的替代方案 |
| ------------- | ---------------------------------- | ----------------------- |
| 2025-10-10    | gpt-4o-realtime-preview-2024-10-01 | gpt-realtime-1.5        |

### 2025-06-10：gpt-4o-audio-preview-2024-10-01

2025年6月10日，我们通知使用 `gpt-4o-audio-preview-2024-10-01` 的开发人员，该功能将在三个月后从API中弃用并移除。

| 停用日期 | 模型 / 系统                    | 推荐替代方案 |
| ------------- | --------------------------------- | ----------------------- |
| 2025-10-10    | `gpt-4o-audio-preview-2024-10-01` | `gpt-audio-1.5`         |

### 2025-04-28：text-moderation

2025年4月28日，我们通知使用 `text-moderation` 的开发者，该功能将在六个月后从 API 中弃用并移除。

| 停用日期 | 模型/系统           | 推荐替代方案 |
| ------------- | ------------------------ | ----------------------- |
| 2025-10-27    | `text-moderation-007`    | `omni-moderation`       |
| 2025-10-27    | `text-moderation-stable` | `omni-moderation`       |
| 2025-10-27    | `text-moderation-latest` | `omni-moderation`       |

### 2025-04-28：o1-preview 和 o1-mini

2025年4月28日，我们通知了使用 `o1-preview` 和 `o1-mini` 的开发者，它们分别将在三个月和六个月后从 API 中弃用并移除。

| 下线日期 | 模型/系统 | 推荐的替代方案 |
| ------------- | -------------- | ----------------------- |
| 2025-07-28    | `o1-preview`   | `o3`                    |
| 2025-10-27    | `o1-mini`      | `o4-mini`               |

### 2025-04-14：GPT-4.5-preview

2025年4月14日，我们通知开发者， `gpt-4.5-preview` 该模型已弃用，并将在未来几个月内从 API 中移除。

| 停用日期 | 模型/系统    | 建议替代方案 |
| ------------- | ----------------- | ----------------------- |
| 2025-07-14    | `gpt-4.5-preview` | `gpt-4.1`               |

### 2024-10-02：Assistants API beta v1

在 [2024年4月](https://developers.openai.com/api/docs/assistants/migration) ，当我们发布Assistants API v2测试版时，我们宣布v1测试版的访问权限将在2024年底前关闭。v1测试版的访问权限将于2024年12月18日停止。

请参阅Assistants API v2测试版的 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) ，以了解如何将你的工具使用迁移到最新版本的Assistants API。

| 停用日期 | 模型/系统             | 建议替换方案    |
| ------------- | -------------------------- | -------------------------- |
| 2024-12-18    | OpenAI-Beta: assistants=v1 | OpenAI-Beta: assistants=v2 |

### 2024-08-29：关于 babbage-002 和 davinci-002 模型的微调训练

2024年8月29日，我们通知开发者，基于这些模型的微调 `babbage-002` 和 `davinci-002` 将于2024年10月28日起不再支持新的微调训练运行。

从这些基础模型创建的微调模型不受此弃用影响，但你将无法再使用这些模型创建新的微调版本。

| 停用日期 | 模型/系统                            | 推荐替代方案 |
| ------------- | ----------------------------------------- | ----------------------- |
| 2024-10-28    | 新的微调训练 `babbage-002` | `gpt-4o-mini`           |
| 2024-10-28    | 新的微调训练 `davinci-002` | `gpt-4o-mini`           |

### 2024-06-06：GPT-4-32K 和 Vision 预览模型

2024年6月6日，我们通知使用 `gpt-4-32k` 和 `gpt-4-vision-preview` 的开发人员，它们将分别在一年和六个月内逐步弃用。截至2024年6月17日，只有这些模型的现有用户才能继续使用它们。

| 停用日期 | 已弃用模型            | 已弃用模型价格                             | 推荐替代品 |
| ------------- | --------------------------- | -------------------------------------------------- | ----------------------- |
| 2025-06-06    | `gpt-4-32k`                 | $60.00 / 1M 输入 tokens + $120 / 1M 输出 tokens | `gpt-4o`                |
| 2025-06-06    | `gpt-4-32k-0613`            | $60.00 / 1M 输入 tokens + $120 / 1M 输出 tokens | `gpt-4o`                |
| 2025-06-06    | `gpt-4-32k-0314`            | $60.00 / 1M 输入 tokens + $120 / 1M 输出 tokens | `gpt-4o`                |
| 2024-12-06    | `gpt-4-vision-preview`      | $10.00 / 1M 输入 tokens + $30 / 1M 输出 tokens  | `gpt-4o`                |
| 2024-12-06    | `gpt-4-1106-vision-preview` | $10.00 / 1M 输入 tokens + $30 / 1M 输出 tokens  | `gpt-4o`                |

### 2023-11-06：聊天模型更新

2023 年 11 月 6 日，我们 [宣布](https://openai.com/blog/new-models-and-developer-products-announced-at-devday) 发布更新后的 GPT-3.5-Turbo 模型（现在默认提供 16k 上下文），同时弃用 `gpt-3.5-turbo-0613` 和 ` gpt-3.5-turbo-16k-0613`。自 2024 年 6 月 17 日起，只有这些模型的现有用户才能继续使用它们。

| 停用日期 | 已弃用模型         | 已弃用模型价格                             | 推荐替代模型 |
| ------------- | ------------------------ | -------------------------------------------------- | ----------------------- |
| 2024-09-13    | `gpt-3.5-turbo-0613`     | $1.50 / 1M 输入 token + $2.00 / 1M 输出 token | `gpt-3.5-turbo`         |
| 2024-09-13    | `gpt-3.5-turbo-16k-0613` | $3.00 / 1M 输入 token + $4.00 / 1M 输出 token | `gpt-3.5-turbo`         |

从这些基础模型创建的微调模型不受此弃用影响，但你将无法再使用这些模型创建新的微调版本。

### 2023-08-22：微调端点

2023年8月22日，我们 [宣布](https://openai.com/blog/gpt-3-5-turbo-fine-tuning-and-api-updates) 了新的微调 API（`/v1/fine_tuning/jobs`），并且原来的 `/v1/fine-tunes` API 以及旧版模型（包括那些使用 `/v1/fine-tunes` API 微调的模型）将于2024年1月4日关闭。这意味着使用 `/v1/fine-tunes` API 微调的模型将不再可访问，你需要使用更新的端点和相关基础模型重新微调新模型。

#### 微调端点

| 停用日期 | 系统           | 推荐替代方案 |
| ------------- | ---------------- | ----------------------- |
| 2024-01-04    | `/v1/fine-tunes` | `/v1/fine_tuning/jobs`  |

### 2023-07-06：GPT 与嵌入

2023 年 7 月 6 日，我们 [宣布](https://openai.com/blog/gpt-4-api-general-availability) 即将退役通过 completions 端点提供服务的旧版 GPT-3 和 GPT-3.5 模型。我们还宣布了第一代文本嵌入模型即将退役。它们将于 2024 年 1 月 4 日关闭。

#### InstructGPT 模型

| 关停日期 | 已弃用模型   | 已弃用模型价格 | 建议替代模型  |
| ------------- | ------------------ | ---------------------- | ------------------------ |
| 2024-01-04    | `text-ada-001`     | $0.40 / 1M tokens      | `gpt-3.5-turbo-instruct` |
| 2024-01-04    | `text-babbage-001` | $0.50 / 1M tokens      | `gpt-3.5-turbo-instruct` |
| 2024-01-04    | `text-curie-001`   | $2.00 / 1M tokens      | `gpt-3.5-turbo-instruct` |
| 2024-01-04    | `text-davinci-001` | $20.00 / 1M tokens     | `gpt-3.5-turbo-instruct` |
| 2024-01-04    | `text-davinci-002` | $20.00 / 1M tokens     | `gpt-3.5-turbo-instruct` |
| 2024-01-04    | `text-davinci-003` | $20.00 / 1M tokens     | `gpt-3.5-turbo-instruct` |

替代产品的定价 `gpt-3.5-turbo-instruct` 模型可在 [定价页面](https://openai.com/api/pricing).

#### 基础 GPT 模型

| 停用日期 | 已弃用模型   | 已弃用模型价格 | 推荐替代品  |
| ------------- | ------------------ | ---------------------- | ------------------------ |
| 2024-01-04    | `ada`              | $0.40 / 1M tokens      | `babbage-002`            |
| 2024-01-04    | `babbage`          | $0.50 / 1M tokens      | `babbage-002`            |
| 2024-01-04    | `curie`            | $2.00 / 1M tokens      | `davinci-002`            |
| 2024-01-04    | `davinci`          | $20.00 / 1M tokens     | `davinci-002`            |
| 2024-01-04    | `code-davinci-002` | ---                    | `gpt-3.5-turbo-instruct` |

替换版 `babbage-002` 和 `davinci-002` 模型的定价可在 [定价页面](https://openai.com/api/pricing).

#### 编辑模型与端点

| 停用日期 | 模型/系统          | 推荐替代方案 |
| ------------- | ----------------------- | ----------------------- |
| 2024-01-04    | `text-davinci-edit-001` | `gpt-4o`                |
| 2024-01-04    | `code-davinci-edit-001` | `gpt-4o`                |
| 2024-01-04    | `/v1/edits`             | `/v1/chat/completions`  |

#### 微调 GPT 模型

| 停用日期 | 已弃用模型 | 训练价格     | 使用价格         | 建议替代方案                  |
| ------------- | ---------------- | ------------------ | ------------------- | ---------------------------------------- |
| 2024-01-04    | `ada`            | $0.40 / 1M tokens  | $1.60 / 1M tokens   | `babbage-002`                            |
| 2024-01-04    | `babbage`        | $0.60 / 1M tokens  | $2.40 / 1M tokens   | `babbage-002`                            |
| 2024-01-04    | `curie`          | $3.00 / 1M tokens  | $12.00 / 1M tokens  | `davinci-002`                            |
| 2024-01-04    | `davinci`        | $30.00 / 1M tokens | $120.00 / 1K tokens | `davinci-002`, `gpt-3.5-turbo`, `gpt-4o` |

#### 第一代文本嵌入模型

| 停用日期 | 已弃用模型                | 已弃用模型价格 | 推荐替代方案  |
| ------------- | ------------------------------- | ---------------------- | ------------------------ |
| 2024-01-04    | `text-similarity-ada-001`       | $4.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `text-search-ada-doc-001`       | $4.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `text-search-ada-query-001`     | $4.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `code-search-ada-code-001`      | $4.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `code-search-ada-text-001`      | $4.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `text-similarity-babbage-001`   | $5.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `text-search-babbage-doc-001`   | $5.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `text-search-babbage-query-001` | $5.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `code-search-babbage-code-001`  | $5.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `code-search-babbage-text-001`  | $5.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `text-similarity-curie-001`     | $20.00 / 1M tokens     | `text-embedding-3-small` |
| 2024-01-04    | `text-search-curie-doc-001`     | $20.00 / 1M tokens     | `text-embedding-3-small` |
| 2024-01-04    | `text-search-curie-query-001`   | $20.00 / 1M tokens     | `text-embedding-3-small` |
| 2024-01-04    | `text-similarity-davinci-001`   | $200.00 / 1M tokens    | `text-embedding-3-small` |
| 2024-01-04    | `text-search-davinci-doc-001`   | $200.00 / 1M tokens    | `text-embedding-3-small` |
| 2024-01-04    | `text-search-davinci-query-001` | $200.00 / 1M tokens    | `text-embedding-3-small` |

### 2023-06-13：更新聊天模型

2023年6月13日，我们在 [函数调用及其他 API 更新](https://openai.com/blog/function-calling-and-other-api-updates) 博客文章中宣布了新的聊天模型版本。这三个原始版本将最早于2024年6月退役。截至2024年1月10日，只有这些模型的现有用户才能继续使用它们。

| 停用日期          | 旧版模型 | 旧版模型价格                                   | 推荐替代方案 |
| ---------------------- | ------------ | ---------------------------------------------------- | ----------------------- |
| 最早 2024-06-13 | `gpt-4-0314` | $30.00 / 1M 输入 tokens + $60.00 / 1M 输出 tokens | `gpt-4o`                |

| 停用日期 | 已弃用模型     | 已弃用模型价格                                | 推荐替代方案 |
| ------------- | -------------------- | ----------------------------------------------------- | ----------------------- |
| 2024-09-13    | `gpt-3.5-turbo-0301` | $15.00 / 1M 输入 tokens + $20.00 / 1M 输出 tokens  | `gpt-3.5-turbo`         |
| 2025-06-06    | `gpt-4-32k-0314`     | $60.00 / 1M 输入 tokens + $120.00 / 1M 输出 tokens | `gpt-4o`                |

### 2023-03-20：Codex 模型

| 停用日期 | 已弃用模型   | 推荐替代 |
| ------------- | ------------------ | ----------------------- |
| 2023-03-23    | `code-davinci-002` | `gpt-4o`                |
| 2023-03-23    | `code-davinci-001` | `gpt-4o`                |
| 2023-03-23    | `code-cushman-002` | `gpt-4o`                |
| 2023-03-23    | `code-cushman-001` | `gpt-4o`                |

### 2022-06-03：旧版端点

| 停用日期 | 系统                | 推荐替代方案                                                                               |
| ------------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| 2022-12-03    | `/v1/engines`         | [/v1/models](https://platform.openai.com/docs/api-reference/models/list)                              |
| 2022-12-03    | `/v1/search`          | [查看迁移指南](https://help.openai.com/en/articles/6272952-search-transition-guide)          |
| 2022-12-03    | `/v1/classifications` | [查看迁移指南](https://help.openai.com/en/articles/6272941-classifications-transition-guide) |
| 2022-12-03    | `/v1/answers`         | [查看迁移指南](https://help.openai.com/en/articles/6233728-answers-transition-guide)         |

### 纯文本别名

- gpt-3.5-turbo-0125 | gpt-3.5-turbo、gpt-3.5-turbo-completions
- gpt-4-0613 | gpt-4、gpt-4-0613-completions、gpt-4-completions
- gpt-4-turbo | gpt-4-turbo-2024-04-09、gpt-4-turbo-completions
- gpt-4.1-nano | gpt-4.1-nano-2025-04-14
- o1-2024-12-17 | o1
- o1-pro-2025-03-19 | o1-pro
- o3-mini-2025-01-31 | o3-mini
- o4-mini-2025-04-16 | o4-mini
- computer-use-preview-2025-03-11 | computer-use-preview
- o3-deep-research-2025-06-26 | o3-deep-research
- o4-mini-deep-research-2025-06-26 | o4-mini-deep-research