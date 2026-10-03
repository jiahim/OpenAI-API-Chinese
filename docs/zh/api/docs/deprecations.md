# 弃用

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 概述

随着我们推出更安全、更强大的模型，会定期下线较旧的模型。依赖于 OpenAI 模型的软件可能需要偶尔进行更新以保持可用。受影响的客户将始终会通过电子邮件以及在我们的文档中得到通知，并伴随 [博客文章](https://openai.com/blog) （用于较大的变更）。

本页列出了所有 API 的弃用项及建议的替代方案。

## 模型弃用通知期

我们会在停用模型之前提前通知，以便客户有时间规划并迁移。当我们宣布模型弃用时，我们会通过电子邮件通知正在使用该模型的客户，并在本页记录弃用情况。

除非出于安全或合规方面的考虑需要更快的时间表，否则我们会在模型停用前提供以下最短通知期限：

- **正式发布模型：** 至少 6 个月。
- **正式发布模型的专用变体：** 至少 3 个月。例如包括聊天变体，例如 `gpt-5.1-chat-latest`，Codex 变体，例如 `gpt-5.3-codex`，以及深度研究变体，例如 `o3-deep-research`.
- **预览模型：** 预览模型（模型名称中带有 `preview` 标识）的弃用通知可能更短，例如 2 周。例如包括 `computer-use-preview` 和 `gpt-4o-audio-preview`。除非你能够在短时间内迁移，否则我们不建议在关键业务的生产工作负载中使用预览模型。

如果出于安全或合规方面的考虑需要我们更早下线某个模型，我们会在合理可行的范围内尽可能提前通知。

这些通知期可为客户提供时间，以评估推荐替代模型、测试应用行为，并在模型不可用之前完成迁移。在某些情况下，开发者可在模型下线日期之后通过配置专用容量来继续访问。如需了解该选项， [请联系我们的销售团队](https://openai.com/contact-sales/).

## 弃用与遗留

我们使用术语“弃用”来指代停用某个模型或接口的过程。当我们宣布某个模型或接口即将被弃用时，它会立即变为已弃用状态。所有已弃用的模型和接口都会有一个关停日期。在关停日期时，该模型或接口将不再可访问。

我们交替使用术语“sunset”和“shut down”，都表示某个模型或接口不再可访问。

我们使用术语“legacy”来指代不再接收更新的模型和接口。我们将接口和模型标记为 legacy，以向开发者表明我们作为平台的发展方向，并提示他们可能应迁移到更新的模型或接口。你可以预期 legacy 模型或接口在未来的某个时间点会被弃用。

## 即将弃用

即将弃用的项如下所列，最新公告排在最前面。

### 2026-10-01：GPT-5.3-Codex、GPT-5.1、GPT-5.4-Nano

以下模型已弃用，将于 2027 年 4 月 1 日从 API 中移除，并提前六个月发出通知。请在下线日期前迁移至推荐替代模型。

| 下线日期 | 模型 / 系统  | 建议替代方案 |
| ------------- | --------------- | ----------------------- |
| 2027-04-01   | `gpt-5.3-codex` | `gpt-6-sol`             |
| 2027-04-01   | `gpt-5.4-nano`  | `gpt-6-luna`            |
| 2027-04-01   | `gpt-5.1`       | `gpt-6-sol`             |

### 2026-10-01：文本转语音模型

以下文本转语音模型已弃用，将于 2027 年 1 月 6 日从 API 中移除，并提前至少三个月发出通知。请迁移到 `gpt-realtime-2.1-mini` 在关停日期之前。请参阅 [Realtime API 指南](https://developers.openai.com/api/docs/guides/realtime) 以规划你的迁移。

| 下线日期 | 模型 / 系统               | 建议替代方案 |
| ------------- | ---------------------------- | ----------------------- |
| 2027-01-06   | `tts-1`                      | `gpt-realtime-2.1-mini` |
| 2027-01-06   | `tts-1-hd`                   | `gpt-realtime-2.1-mini` |
| 2027-01-06   | `gpt-4o-mini-tts-2025-03-20` | `gpt-realtime-2.1-mini` |
| 2027-01-06   | `gpt-4o-mini-tts-2025-12-15` | `gpt-realtime-2.1-mini` |

### 2026-09-11：GPT-5.4-Cyber

该 `gpt-5.4-cyber` model 已弃用，将于 2026 年 10 月 1 日从 API 中移除。请在该日期之前迁移到你可用的最强 cyber 模型。

| 下线日期 | 模型 / 系统  | 建议替代方案                        |
| ------------- | --------------- | ---------------------------------------------- |
| 2026-10-01   | `gpt-5.4-cyber` | 你可用的能力最强的网络模型。 |

### 2026-08-26: 转录模型

2026 年 8 月 26 日，我们通知了正在使用 `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，的开发者， `gpt-4o-transcribe-diarize` 这两项功能将于 2027 年 2 月 26 日从 API 中弃用并移除。

有关推荐替代方案的信息，请参阅 [转写指南](https://developers.openai.com/api/docs/guides/transcription).

| 下线日期 | 模型 / 系统              | 建议替代方案                   |
| ------------- | --------------------------- | ----------------------------------------- |
| Feb 26, 2027  | `whisper-1`                 | `gpt-live-transcribe` or `gpt-transcribe` |
| Feb 26, 2027  | `gpt-4o-transcribe`         | `gpt-live-transcribe` or `gpt-transcribe` |
| Feb 26, 2027  | `gpt-4o-mini-transcribe`    | `gpt-live-transcribe` or `gpt-transcribe` |
| Feb 26, 2027  | `gpt-4o-transcribe-diarize` | `gpt-live-transcribe` or `gpt-transcribe` |

### 2026-07-20: 旧版音频、实时和转录模型

2026 年 7 月 20 日，我们已通知使用旧版音频、实时和转录模型系列及快照的开发者，这些模型将于 2027 年 1 月 20 日从 API 中弃用并移除。

| 下线日期 | 模型系列 / 快照             | 建议替代方案             |
| ------------- | ----------------------------------- | ----------------------------------- |
| 2027-01-20  | `gpt-realtime`                      | `gpt-realtime-2.1`                  |
| 2027-01-20  | `gpt-audio`                         | `gpt-audio-1.5`                     |
| 2027-01-20  | `gpt-4o-audio`                      | `gpt-audio-1.5`                     |
| 2027-01-20  | `gpt-4o-realtime`                   | `gpt-realtime-2.1`                  |
| 2027-01-20  | `gpt-realtime-mini`                 | `gpt-realtime-2.1-mini`             |
| 2027-01-20  | `gpt-audio-mini`                    | `gpt-audio-1.5`                     |
| 2027-01-20  | `gpt-4o-mini-realtime`              | `gpt-realtime-2.1-mini`             |
| 2027-01-20  | `gpt-4o-mini-audio`                 | `gpt-audio-1.5`                     |
| 2027-01-20  | `gpt-4o-mini-transcribe-2025-03-20` | `gpt-4o-mini-transcribe-2025-12-15` |

### 2026-06-11：GPT-5 与 o3 模型弃用

2026 年 6 月 11 日，我们通知了使用旧版 GPT-5 和 o3 模型快照的开发者，这些快照将于 2026 年 12 月 11 日从 API 中弃用并移除。

| 下线日期 | 模型 / 系统          | 建议替代方案               |
| ------------- | ----------------------- | ------------------------------------- |
| 2026-12-11  | `gpt-5-2025-08-07`      | `gpt-5.6-sol`                         |
| 2026-12-11  | `gpt-5-mini-2025-08-07` | `gpt-5.6-terra`                       |
| 2026-12-11  | `gpt-5-nano-2025-08-07` | `gpt-5.6-luna`                        |
| 2026-12-11  | `gpt-5-pro-2025-10-06`  | `gpt-5.6-sol` (`reasoning.mode: pro`) |
| 2026-12-11  | `o3-2025-04-16`         | `gpt-5.6-sol`                         |
| 2026-12-11  | `o3-pro-2025-06-10`     | `gpt-5.6-sol` (`reasoning.mode: pro`) |

### 2026-06-03: 可复用的提示词

2026 年 6 月 3 日，我们通知了仪表板和 API 中使用可复用提示词的开发者，可复用提示词对象即将弃用。

| 日期         | 更新                                                                       |
| ------------ | ---------------------------------------------------------------------------- |
| 2026 年 6 月 3 日 | 宣布弃用，并在平台中弱化提示创建。     |
| 2026 年 11 月 30 日 | 该 `v1/prompts` API 和可复用提示对象计划关闭。 |

要迁移，请将可复用的提示内容移至你的应用代码中。参见 [从提示对象迁移](https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object).

### 2026-06-03：Evals 平台

On June 3, 2026, we notified developers using the Evals platform that the product is being deprecated.

| 日期         | 更新                                                  |
| ------------ | ------------------------------------------------------- |
| 2026 年 6 月 3 日 | 已宣布对 Evals 平台进行弃用。           |
| 2026-10-31 | 现有 evals 变为只读。                        |
| 2026 年 11 月 30 日 | Evals 仪表板和 API 计划关闭。 |

为 eval 工作流记录的评分器属于本次过渡的一部分。与微调相关的时间线仍将在下文的自助式微调部分中介绍。

请参阅 [从 OpenAI Evals 迁移到 Promptfoo](https://developers.openai.com/cookbook/examples/evaluation/moving-from-openai-evals-to-promptfoo) 的迁移路径。

### 2026-06-03: 智能体构建器

2026 年 6 月 3 日，我们已通知使用 智能体 Builder 的开发者，该产品将被弃用。ChatKit 仍然可用。

| 日期         | 更新                                   |
| ------------ | ---------------------------------------- |
| 2026 年 6 月 3 日 | 已宣布 智能体 Builder 弃用。 |
| 2026 年 11 月 30 日 | 智能体 Builder 计划下线。 |

请参阅 [从智能体构建器迁移](https://developers.openai.com/api/docs/guides/agent-builder/migrate-from-agent-builder) 以继续使用 Agents SDK 或 ChatGPT Workspace 智能体。

### 2026-06-02：GPT Image 模型弃用

2026 年 6 月 2 日，我们通知使用旧版 GPT Image 模型的开发者，这些模型将于 2026 年 12 月 1 日从 API 中弃用并移除。

| 下线日期 | 模型 / 系统         | 建议替代方案                           |
| ------------- | ---------------------- | ------------------------------------------------- |
| Dec 1, 2026   | `gpt-image-1-mini`     | `gpt-image-2.5-sunburst` or `gpt-image-2.5-flare` |
| Dec 1, 2026   | `gpt-image-1.5`        | `gpt-image-2.5-sunburst` or `gpt-image-2.5-flare` |
| Dec 1, 2026   | `chatgpt-image-latest` | `gpt-image-2.5-sunburst` or `gpt-image-2.5-flare` |

### 更新到 OpenAI 的自助微调

2026 年 5 月 7 日，我们向使用 OpenAI 自助式微调平台的开发者通知了可用性的更新。

微调模型的推理在基础模型弃用之前将持续可用。

| 日期         | 更新                                                                                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026年5月7日  | 此前未运行过微调的组织无法创建微调任务或训练。                                                                                |
| 2026年7月2日 | 过去 60 天内未对微调模型运行推理的组织将无法再创建微调任务。                                                         |
| 2027-01-06  | 现有活跃客户自该日起将无法再创建新的微调任务。只有当底层基础模型被弃用时，针对微调模型的推理才会被禁用。 |

## 过去的弃用

过去的弃用项如下所列，最新的公告位于顶部。

### 2026-05-08: `gpt-5.2-chat-latest` 和 `gpt-5.3-chat-latest` 模型快照

2026 年 5 月 8 日，我们通知了使用 `gpt-5.2-chat-latest` 和 `gpt-5.3-chat-latest` 模型快照的开发者关于其弃用及从 API 中移除的情况。

| 下线日期 | 模型 / 系统        | 建议替代方案 |
| ------------- | --------------------- | ----------------------- |
| Aug 10, 2026  | `gpt-5.2-chat-latest` | `gpt-5.6-sol`           |
| Aug 10, 2026  | `gpt-5.3-chat-latest` | `gpt-5.6-sol`           |

### 2026-04-22：Legacy GPT 模型快照

为了提升可靠性并帮助开发者更轻松地选择合适的模型，我们正在弃用一组较旧的 OpenAI 模型。这些模型的访问权限将在下述日期关闭。

| 下线日期    | 模型快照                                                         | 替代模型                                  |
| ---------------- | ---------------------------------------------------------------------- | ------------------------------------------------- |
| 2026-10-23 | `gpt-3.5-turbo-0125` \| `gpt-3.5-turbo`, `gpt-3.5-turbo-completions`   | `gpt-5.6-terra`                                   |
| 2026-10-23 | `gpt-4-0613` \| `gpt-4`, `gpt-4-0613-completions`, `gpt-4-completions` | `gpt-5.6-sol`                                     |
| 2026-10-23 | `gpt-4-1106-preview`                                                   | `gpt-5.6-sol`                                     |
| 2026-10-23 | `gpt-4-turbo` \| `gpt-4-turbo-2024-04-09`, `gpt-4-turbo-completions`   | `gpt-5.6-sol`                                     |
| 2026-10-23 | `gpt-4.1-nano` \| `gpt-4.1-nano-2025-04-14`                            | `gpt-5.6-luna`                                    |
| 2026-10-23 | `gpt-4o-2024-05-13`                                                    | `gpt-5.6-sol`                                     |
| 2026-10-23 | `gpt-image-1`                                                          | `gpt-image-2.5-sunburst` or `gpt-image-2.5-flare` |
| 2026-10-23 | `o1-2024-12-17` \| `o1`                                                | `gpt-5.6-sol`                                     |
| 2026-10-23 | `o1-pro-2025-03-19` \| `o1-pro`                                        | `gpt-5.6-sol` (`reasoning.mode: pro`)             |
| 2026-10-23 | `o3-mini-2025-01-31` \| `o3-mini`                                      | `gpt-5.6-sol`                                     |
| 2026-10-23 | `ft-o4-mini-2025-04-16`                                                | `gpt-5.6-terra`                                   |
| 2026-10-23 | `o4-mini-2025-04-16` \| `o4-mini`                                      | `gpt-5.6-terra`                                   |

我们也在移除如下微调版本：

| 下线日期    | 模型快照               | 推荐替换基础模型 |
| ---------------- | ---------------------------- | ---------------------------------- |
| 2026-10-23 | `ft-gpt-3.5-turbo`           | `gpt-5.6-terra`                    |
| 2026-10-23 | `ft-gpt-4`                   | `gpt-5.6-sol`                      |
| 2026-10-23 | `ft-gpt-4.1-nano-2025-04-14` | `gpt-5.6-luna`                     |
| 2026-10-23 | `ft-babbage-002`             | `gpt-5.6-terra`                    |
| 2026-10-23 | `ft-davinci-002`             | `gpt-5.6-terra`                    |

### 2026-04-22: 旧版 GPT 模型快照（2026 年 7 月下线）

2026 年 4 月 22 日，我们宣布弃用以下较早的 OpenAI 模型。对这些模型的访问已于 2026 年 7 月 23 日关闭。

| 下线日期 | 模型快照                                                | 替代模型        |
| ------------- | ------------------------------------------------------------- | ----------------------- |
| July 23, 2026 | `computer-use-preview-2025-03-11` \| `computer-use-preview`   | `gpt-5.6-terra`         |
| July 23, 2026 | `gpt-4o-mini-search-preview-2025-03-11`                       | `gpt-5.6-terra`         |
| July 23, 2026 | `gpt-4o-search-preview-2025-03-11`                            | `gpt-5.6-terra`         |
| July 23, 2026 | `gpt-5-chat-latest`                                           | `gpt-5.6-sol`           |
| July 23, 2026 | `gpt-5-codex`                                                 | `gpt-5.6-sol`           |
| July 23, 2026 | `gpt-5.1-chat-latest`                                         | `gpt-5.6-sol`           |
| July 23, 2026 | `gpt-5.1-codex`                                               | `gpt-5.6-sol`           |
| July 23, 2026 | `gpt-5.1-codex-max`                                           | `gpt-5.6-sol`           |
| July 23, 2026 | `gpt-5.1-codex-mini`                                          | `gpt-5.6-terra`         |
| July 23, 2026 | `gpt-audio-mini-2025-10-06`                                   | `gpt-audio-1.5`         |
| July 23, 2026 | `gpt-realtime-mini-2025-10-06`                                | `gpt-realtime-2.1-mini` |
| July 23, 2026 | `o3-deep-research-2025-06-26` \| `o3-deep-research`           | `gpt-5.6-sol`           |
| July 23, 2026 | `o4-mini-deep-research-2025-06-26` \| `o4-mini-deep-research` | `gpt-5.6-sol`           |
| July 23, 2026 | `gpt-5.2-codex`                                               | `gpt-5.6-sol`           |

### 2026-03-24：Sora 2 视频生成模型和 Videos API

2026 年 3 月 24 日，我们已通知使用 Videos API 和 Sora 2 视频生成模型别名及快照的开发者，这些别名和快照将于 2026 年 9 月 24 日在该 API 中弃用并移除。

| 下线日期 | 模型 / 系统          | 建议替代方案 |
| ------------- | ----------------------- | ----------------------- |
| 2026-09-24    | Videos API              | ---                     |
| 2026-09-24    | `sora-2`                | ---                     |
| 2026-09-24    | `sora-2-pro`            | ---                     |
| 2026-09-24    | `sora-2-2025-10-06`     | ---                     |
| 2026-09-24    | `sora-2-2025-12-08`     | ---                     |
| 2026-09-24    | `sora-2-pro-2025-10-06` | ---                     |

### 2025-11-18： `chatgpt-4o-latest` snapshot

2025 年 11 月 18 日，我们通知了正在使用的开发者 `chatgpt-4o-latest` 模型快照将被弃用，并将于 2026 年 2 月 17 日从API 中移除。

| 下线日期 | 模型 / 系统      | 建议替代方案 |
| ------------- | ------------------- | ----------------------- |
| 2026-02-17    | `chatgpt-4o-latest` | `gpt-5.1-chat-latest`   |

### 2025-11-17: `codex-mini-latest` model snapshot

2025 年 11 月 17 日，我们通知了正在使用 `codex-mini-latest` 模型的开发者该模型将被弃用并于 2026 年 2 月 12 日从API中移除。作为本次弃用的一部分，我们将不再支持原有的本地 shell 工具，该工具仅适用于 `codex-mini-latest`。对于新的使用场景，请使用我们最新的 shell 工具。

| 下线日期 | 模型 / 系统      | 建议替代方案 |
| ------------- | ------------------- | ----------------------- |
| 2026-02-12    | `codex-mini-latest` | `gpt-5-codex-mini`      |

### 2025-11-14：DALL·E 模型快照

2025 年 11 月 14 日，我们通知使用 DALL·E 模型快照的开发者，该模型将于 2026 年 5 月 12 日从 API 中弃用并移除。

| 下线日期 | 模型 / 系统 | 建议替代方案                             |
| ------------- | -------------- | --------------------------------------------------- |
| 2026-05-12    | `dall-e-2`     | `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` |
| 2026-05-12    | `dall-e-3`     | `gpt-image-2`, `gpt-image-1`，或 `gpt-image-1-mini` |

### 2025-09-26：旧版 GPT 模型快照

为了提升可靠性并帮助开发者更轻松地选择合适的模型,我们将在未来六到十二个月内弃用一批使用量持续下滑的较旧 OpenAI 模型。对这些模型的访问将在下方列出的日期关停。

| 下线日期 | 模型 / 系统           | 建议替代方案 |
| ------------- | ------------------------ | ----------------------- |
| 2026-09-28    | `gpt-3.5-turbo-instruct` | `gpt-5.6-terra`         |
| 2026-09-28    | `babbage-002`            | `gpt-5.6-terra`         |
| 2026-09-28    | `davinci-002`            | `gpt-5.6-terra`         |
| 2026-09-28    | `gpt-3.5-turbo-1106`     | `gpt-5.6-terra`         |

### 2025-09-26：旧版 GPT 模型快照（2026 年 3 月下线）

为提升可靠性并帮助开发者更轻松地选择合适的模型，我们弃用了一组使用量持续下降的较旧 OpenAI 模型。这些模型的访问权限已于 2026/3/26 关闭。

| 下线日期 | 模型 / 系统                                                                                                             | 建议替代方案 |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 2026‑03‑26    | `gpt-4-0314`                                                                                                               | `gpt-5` or `gpt-4.1*`   |
| 2026‑03‑26    | `gpt-4-1106-preview`                                                                                                       | `gpt-5` or `gpt-4.1*`   |
| 2026‑03‑26    | `gpt-4-0125-preview` （包括 `gpt-4-turbo-preview` 和 `gpt-4-turbo-preview-completions`，它们指向此快照） | `gpt-5` or `gpt-4.1*`   |

\*对于延迟特别敏感且不需要推理的任务

### 2025-09-15：Realtime API Beta

Realtime API Beta 已于 2026年5月12日弃用并从 API 中移除。

Realtime beta API 与已发布的 GA API 中的接口存在若干关键差异。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) ，了解当前的 GA 接口及相关的 Realtime 文档。

| 下线日期 | 模型 / 系统           | 建议替代方案 |
| ------------- | ------------------------ | ----------------------- |
| 2026‑05‑12    | OpenAI-Beta: realtime=v1 | Realtime API            |

### 2025-09-15: `gpt-4o-realtime-preview` models

2025 年 9 月，我们通知了相关使用 `gpt-4o-realtime-preview` 模型的开发者，这些模型将在六个月后弃用并从 API 中移除。

| 下线日期 | 模型 / 系统                       | 建议替代方案 |
| ------------- | ------------------------------------ | ----------------------- |
| 2026-05-07    | `gpt-4o-realtime-preview`            | `gpt-realtime-1.5`      |
| 2026-05-07    | `gpt-4o-realtime-preview-2025-06-03` | `gpt-realtime-1.5`      |
| 2026-05-07    | `gpt-4o-realtime-preview-2024-12-17` | `gpt-realtime-1.5`      |
| 2026-05-07    | `gpt-4o-mini-realtime-preview`       | `gpt-realtime-mini`     |
| 2026-05-07    | `gpt-4o-audio-preview`               | `gpt-audio-1.5`         |
| 2026-05-07    | `gpt-4o-mini-audio-preview`          | `gpt-audio-mini`        |

### 2025-08-20：Assistants API

2025 年 8 月 26 日，我们向使用 Assistants API 的开发者发出通知，告知该 API 将于一年后（即 2026 年 8 月 26 日）弃用并从服务中移除。

在我们发布 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) 于 [2025 年 3 月](https://developers.openai.com/api/docs/changelog)，时，我们宣布计划将 Assistants API 的所有功能迁移到更易使用的 Responses API，并设定于 2026 年正式下线。

请参阅 Assistants 迁移到 Conversations [迁移指南](https://developers.openai.com/api/docs/assistants/migration) ，详细了解如何将你当前的集成迁移到 Responses API 和 Conversations API。

| 下线日期 | 模型 / 系统 | 建议替代方案             |
| ------------- | -------------- | ----------------------------------- |
| 2026‑08‑26    | Assistants API | Responses API 和 Conversations API |

### 2025-06-10: `gpt-4o-realtime-preview-2024-10-01`

2025 年 6 月 10 日，我们通知正在使用 `gpt-4o-realtime-preview-2024-10-01` 的开发者，该 API 将于三个月后弃用并移除。

| 下线日期 | 模型 / 系统                       | 建议替代方案 |
| ------------- | ------------------------------------ | ----------------------- |
| 2025-10-10    | `gpt-4o-realtime-preview-2024-10-01` | `gpt-realtime-1.5`      |

### 2025-06-10: `gpt-4o-audio-preview-2024-10-01`

2025 年 6 月 10 日，我们通知正在使用 `gpt-4o-audio-preview-2024-10-01` 的开发者，该 API 将于三个月后弃用并移除。

| 下线日期 | 模型 / 系统                    | 建议替代方案 |
| ------------- | --------------------------------- | ----------------------- |
| 2025-10-10    | `gpt-4o-audio-preview-2024-10-01` | `gpt-audio-1.5`         |

### 2025-04-28: `text-moderation`

2025 年 4 月 28 日，我们向使用 `text-moderation` 的开发者发送了通知，告知该功能将在六个月内弃用并从 API 中移除。

| 下线日期 | 模型 / 系统           | 建议替代方案 |
| ------------- | ------------------------ | ----------------------- |
| 2025-10-27    | `text-moderation-007`    | `omni-moderation`       |
| 2025-10-27    | `text-moderation-stable` | `omni-moderation`       |
| 2025-10-27    | `text-moderation-latest` | `omni-moderation`       |

### 2025-04-28: `o1-preview` 和 `o1-mini`

2025 年 4 月 28 日，我们向使用 `o1-preview` 和 `o1-mini` 它们的弃用时间以及从 API 中移除的时间分别为三个月和六个月。

| 下线日期 | 模型 / 系统 | 建议替代方案 |
| ------------- | -------------- | ----------------------- |
| 2025-07-28    | `o1-preview`   | `o3`                    |
| 2025-10-27    | `o1-mini`      | `o4-mini`               |

### 2025-04-14：GPT-4.5-preview

2025 年 4 月 14 日，我们通知开发者 `gpt-4.5-preview` 模型已被弃用，并将在未来几个月内从 API 中移除。

| 下线日期 | 模型 / 系统    | 建议替代方案 |
| ------------- | ----------------- | ----------------------- |
| 2025-07-14    | `gpt-4.5-preview` | `gpt-4.1`               |

### 2024-10-02: Assistants API beta v1

2024 年 4 月 [2024 年 4 月](https://developers.openai.com/api/docs/assistants/migration) 我们发布了 Assistants API v2 测试版，并宣布将在 2024 年底关闭 v1 测试版的访问。v1 测试版的访问将于 2024 年 12 月 18 日终止。

请参阅 Assistants API v2 测试版 [迁移指南](https://developers.openai.com/api/docs/assistants/migration) 了解如何将你的工具使用迁移到 Assistants API 的最新版本。

| 下线日期 | 模型 / 系统             | 建议替代方案    |
| ------------- | -------------------------- | -------------------------- |
| 2024-12-18    | OpenAI-Beta: assistants=v1 | OpenAI-Beta: assistants=v2 |

### 2024-08-29：babbage-002 和 davinci-002 模型的微调训练

2024 年 8 月 29 日，我们通知正在微调的开发者 `babbage-002` 和 `davinci-002` 自 2024 年 10 月 28 日起，这些模型将不再支持新的微调训练任务。

基于这些基础模型创建的微调模型不受此次弃用影响，但你将无法再使用这些模型创建新的微调版本。

| 下线日期 | 模型 / 系统                            | 建议替代方案 |
| ------------- | ----------------------------------------- | ----------------------- |
| 2024-10-28    | 新一轮微调训练 `babbage-002` | `gpt-4o-mini`           |
| 2024-10-28    | 新一轮微调训练 `davinci-002` | `gpt-4o-mini`           |

### 2024-06-06：GPT-4-32K 和 Vision Preview 模型

2024 年 6 月 6 日，我们通知了使用 `gpt-4-32k` 和 `gpt-4-vision-preview` 的开发者这些模型将分别在一年半后弃用。自 2024 年 6 月 17 日起，仅这些模型的现有用户可继续使用。

| 下线日期 | 已废弃模型            | 已废弃模型价格                             | 建议替代方案 |
| ------------- | --------------------------- | -------------------------------------------------- | ----------------------- |
| 2025-06-06    | `gpt-4-32k`                 | $60.00 / 1M 输入 tokens + $120 / 1M 输出 tokens | `gpt-4o`                |
| 2025-06-06    | `gpt-4-32k-0613`            | $60.00 / 1M 输入 tokens + $120 / 1M 输出 tokens | `gpt-4o`                |
| 2025-06-06    | `gpt-4-32k-0314`            | $60.00 / 1M 输入 tokens + $120 / 1M 输出 tokens | `gpt-4o`                |
| 2024-12-06    | `gpt-4-vision-preview`      | $10.00 / 1M 输入 tokens + $30 / 1M 输出 tokens  | `gpt-4o`                |
| 2024-12-06    | `gpt-4-1106-vision-preview` | $10.00 / 1M 输入 tokens + $30 / 1M 输出 tokens  | `gpt-4o`                |

### 2023-11-06：Chat 模型更新

2023 年 11 月 6 日，我们 [宣布](https://openai.com/blog/new-models-and-developer-products-announced-at-devday) 发布更新后的 GPT-3.5-Turbo 模型（默认配备 16k 上下文），并弃用 `gpt-3.5-turbo-0613` 和 ` gpt-3.5-turbo-16k-0613`。自 2024 年 6 月 17 日起，仅这些模型的现有用户可继续使用。

| 下线日期 | 已废弃模型         | 已废弃模型价格                             | 建议替代方案 |
| ------------- | ------------------------ | -------------------------------------------------- | ----------------------- |
| 2024-09-13    | `gpt-3.5-turbo-0613`     | $1.50 / 1M 输入 token + $2.00 / 1M 输出 token | `gpt-3.5-turbo`         |
| 2024-09-13    | `gpt-3.5-turbo-16k-0613` | $3.00 / 1M 输入 token + $4.00 / 1M 输出 token | `gpt-3.5-turbo`         |

基于这些基础模型创建的微调模型不受此次弃用影响，但你将无法再使用这些模型创建新的微调版本。

### 2023-08-22：Fine-tunes 端点

2023 年 8 月 22 日，我们 [宣布](https://openai.com/blog/gpt-3-5-turbo-fine-tuning-and-api-updates) 全新的微调 API（`/v1/fine_tuning/jobs`），以及原有的 `/v1/fine-tunes` API 以及旧版模型（包括使用 `/v1/fine-tunes` API 微调的模型）将于 2024 年 1 月 04 日下线。这意味着使用 `/v1/fine-tunes` API 微调的模型将无法继续访问，你必须使用更新后的端点和相关基础模型重新微调新模型。

#### 微调端点

| 下线日期 | 系统           | 建议替代方案 |
| ------------- | ---------------- | ----------------------- |
| 2024-01-04    | `/v1/fine-tunes` | `/v1/fine_tuning/jobs`  |

### 2023-07-06：GPT 与 embeddings

2023 年 7 月 6 日，我们 [宣布](https://openai.com/blog/gpt-4-api-general-availability) 即将退役通过 completions 端点提供服务的旧版 GPT-3 和 GPT-3.5 模型。我们还宣布即将退役我们的第一代文本嵌入模型。这些模型将于 2024 年 1 月 4 日下线。

#### InstructGPT models

| 下线日期 | 已废弃模型   | 已废弃模型价格 | 建议替代方案  |
| ------------- | ------------------ | ---------------------- | ------------------------ |
| 2024-01-04    | `text-ada-001`     | $0.40 / 1M tokens      | `gpt-3.5-turbo-instruct` |
| 2024-01-04    | `text-babbage-001` | $0.50 / 1M tokens      | `gpt-3.5-turbo-instruct` |
| 2024-01-04    | `text-curie-001`   | $2.00 / 1M tokens      | `gpt-3.5-turbo-instruct` |
| 2024-01-04    | `text-davinci-001` | $20.00 / 1M tokens     | `gpt-3.5-turbo-instruct` |
| 2024-01-04    | `text-davinci-002` | $20.00 / 1M tokens     | `gpt-3.5-turbo-instruct` |
| 2024-01-04    | `text-davinci-003` | $20.00 / 1M tokens     | `gpt-3.5-turbo-instruct` |

替代模型的 `gpt-3.5-turbo-instruct` 定价可在 [定价页面](https://openai.com/api/pricing).

#### 基础 GPT 模型

| 下线日期 | 已废弃模型   | 已废弃模型价格 | 建议替代方案  |
| ------------- | ------------------ | ---------------------- | ------------------------ |
| 2024-01-04    | `ada`              | $0.40 / 1M tokens      | `babbage-002`            |
| 2024-01-04    | `babbage`          | $0.50 / 1M tokens      | `babbage-002`            |
| 2024-01-04    | `curie`            | $2.00 / 1M tokens      | `davinci-002`            |
| 2024-01-04    | `davinci`          | $20.00 / 1M tokens     | `davinci-002`            |
| 2024-01-04    | `code-davinci-002` | ---                    | `gpt-3.5-turbo-instruct` |

替代模型的 `babbage-002` 和 `davinci-002` 模型可在 [定价页面](https://openai.com/api/pricing).

#### 编辑模型与端点

| 下线日期 | 模型 / 系统          | 建议替代方案 |
| ------------- | ----------------------- | ----------------------- |
| 2024-01-04    | `text-davinci-edit-001` | `gpt-4o`                |
| 2024-01-04    | `code-davinci-edit-001` | `gpt-4o`                |
| 2024-01-04    | `/v1/edits`             | `/v1/chat/completions`  |

#### 微调 GPT 模型

| 下线日期 | 已废弃模型 | 训练价格     | 使用价格         | 建议替代方案                  |
| ------------- | ---------------- | ------------------ | ------------------- | ---------------------------------------- |
| 2024-01-04    | `ada`            | $0.40 / 1M tokens  | $1.60 / 1M tokens   | `babbage-002`                            |
| 2024-01-04    | `babbage`        | $0.60 / 1M tokens  | $2.40 / 1M tokens   | `babbage-002`                            |
| 2024-01-04    | `curie`          | $3.00 / 1M tokens  | $12.00 / 1M tokens  | `davinci-002`                            |
| 2024-01-04    | `davinci`        | $30.00 / 1M tokens | $120.00 / 1K tokens | `davinci-002`, `gpt-3.5-turbo`, `gpt-4o` |

#### 第一代文本嵌入模型

| 下线日期 | 已废弃模型                | 已废弃模型价格 | 建议替代方案  |
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

### 2023-06-13: 更新了聊天模型

2023 年 6 月 13 日，我们在 [函数调用及其他 API 更新](https://openai.com/blog/function-calling-and-other-api-updates) 博客文章中宣布了新的聊天模型版本。三个原始版本将于 2024 年 6 月起开始下线。自 2024 年 1 月 10 日起，仅这些模型的现有用户可继续使用。

| 下线日期          | Legacy model | Legacy model price                                   | 建议替代方案 |
| ---------------------- | ------------ | ---------------------------------------------------- | ----------------------- |
| at earliest 2024-06-13 | `gpt-4-0314` | $30.00 / 1M input tokens + $60.00 / 1M output tokens | `gpt-4o`                |

| 下线日期 | 已废弃模型     | 已废弃模型价格                                | 建议替代方案 |
| ------------- | -------------------- | ----------------------------------------------------- | ----------------------- |
| 2024-09-13    | `gpt-3.5-turbo-0301` | $15.00 / 1M input tokens + $20.00 / 1M output tokens  | `gpt-3.5-turbo`         |
| 2025-06-06    | `gpt-4-32k-0314`     | $60.00 / 1M input tokens + $120.00 / 1M output tokens | `gpt-4o`                |

### 2023-03-20: Codex models

| 下线日期 | 已废弃模型   | 建议替代方案 |
| ------------- | ------------------ | ----------------------- |
| 2023-03-23    | `code-davinci-002` | `gpt-4o`                |
| 2023-03-23    | `code-davinci-001` | `gpt-4o`                |
| 2023-03-23    | `code-cushman-002` | `gpt-4o`                |
| 2023-03-23    | `code-cushman-001` | `gpt-4o`                |

### 2022-06-03: 旧版端点

| 下线日期 | 系统                | 建议替代方案                                                                               |
| ------------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| 2022-12-03    | `/v1/engines`         | [/v1/models](https://platform.openai.com/docs/api-reference/models/list)                              |
| 2022-12-03    | `/v1/search`          | [查看迁移指南](https://help.openai.com/en/articles/6272952-search-transition-guide)          |
| 2022-12-03    | `/v1/classifications` | [查看迁移指南](https://help.openai.com/en/articles/6272941-classifications-transition-guide) |
| 2022-12-03    | `/v1/answers`         | [查看迁移指南](https://help.openai.com/en/articles/6233728-answers-transition-guide)         |

### 纯文本别名

- gpt-3.5-turbo-0125 | gpt-3.5-turbo, gpt-3.5-turbo-completions
- gpt-4-0613 | gpt-4, gpt-4-0613-completions, gpt-4-completions
- gpt-4-turbo | gpt-4-turbo-2024-04-09, gpt-4-turbo-completions
- gpt-4.1-nano | gpt-4.1-nano-2025-04-14
- o1-2024-12-17 | o1
- o1-pro-2025-03-19 | o1-pro
- o3-mini-2025-01-31 | o3-mini
- o4-mini-2025-04-16 | o4-mini
- computer-use-preview-2025-03-11 | computer-use-preview
- o3-deep-research-2025-06-26 | o3-deep-research
- o4-mini-deep-research-2025-06-26 | o4-mini-deep-research