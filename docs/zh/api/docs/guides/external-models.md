# Evaluate external models

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 来获取。

模型选择是一项重要杠杆，可帮助构建者改进其 AI 应用。在 OpenAI Platform 上使用 Evals 时，除了评估 OpenAI 的原生模型外，你还可以评估各种外部模型。

我们支持访问 **第三方模型** （无需 API 密钥）以及访问 **自定义端点** （需要 API 密钥）。

OpenAI 正在弃用 Evals 平台。在过渡期内，现有 evals 内容仍可
  访问。Evals 将于 2026 年 10 月 31 日对
  现有用户转为只读，并计划于 2026 年 11 月 30 日关闭平台
  。请参阅 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) 以了解当前
  时间表。

## 第三方模型

要使用第三方模型，必须满足以下条件：

- 你的 OpenAI 组织必须属于 [使用层级 1](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers) 或更高层级。
- 你的 OpenAI 组织的管理员必须在 [Settings > Organization > General](https://platform.openai.com/settings/organization/general)。中启用此功能。要启用此功能，管理员必须接受显示的使用免责声明。

对外部模型的调用会将数据传递给第三方，并受以下条款约束：
  与调用 OpenAI 模型相比，它们具有不同的条款和更弱的安全保证。

### 计费与使用限额

OpenAI 目前承担第三方模型的推理费用，但有根据你所在组织使用层级设定的每月额度限制。

| 使用层级 | 月度消费上限（美元） |
| ---------- | ------------------------- |
| 层级 1     | $5                        |
| 层级 2     | $25                       |
| 层级 3     | $50                       |
| 层级 4     | $100                      |
| 层级 5     | $200                      |

我们通过合作伙伴 OpenRouter 提供这些模型。未来，第三方模型将计入你的常规 OpenAI 计费周期，按 [OpenRouter 公开定价](https://openrouter.ai/models).

### 可用的第三方模型

我们提供对以下外部模型提供商的访问：

- Google
- Anthropic（托管在 AWS Bedrock 上）
- Together
- Fireworks

## 自定义端点

你可以在 OpenAI Platform 上配置完全自定义的模型端点，并对其运行评估。这通常是一个我们未原生支持的提供方、你自行托管的模型，或你用于发起推理调用的自定义代理。

要使用此功能，你的 OpenAI 组织的管理员必须通过以下位置启用“Enable custom providers for evaluations”设置： [Settings > Organization > General](https://platform.openai.com/settings/organization/general)。要启用此功能，管理员必须接受所显示的使用免责声明。请注意，向外部模型发起的调用会将数据传递给第三方，并且与对 OpenAI 模型的调用相比，它们受不同的条款约束，且安全保证更弱。

一旦你符合使用自定义提供方的资格，你就可以在以下位置下的 **Evaluations** 选项卡下的 [Settings](https://platform.openai.com/settings/)。中设置提供方。请注意，自定义提供方按项目进行配置。要连接你的自定义端点，你需要：

- 兼容以下端点： [OpenAI 的 chat completions 端点](https://developers.openai.com/api/reference/resources/chat)
- 一个 API 密钥

为你的端点命名，提供一个端点 URL，并指定你的 API 密钥。我们要求你使用一个 `https://` 端点，并出于安全考虑对你的密钥进行加密。请指定你希望评估的模型名称（slug）。你可以点击 **Verify** 按钮以确保你的模型已正确配置。该操作会对每个模型 slug 发起一次仅包含最少输入的测试调用，并显示任何失败情况。

## 使用外部模型运行评估

配置好外部模型后，你可以在你的 [数据集](https://platform.openai.com/evaluation) 或你的 [评估](https://platform.openai.com/evaluation?tab=evals)。的模型选择器中选择该模型以用于评估。注意，目前尚不支持工具调用。

| 模型类型  |          数据集           |            Evals            |
| ----------- | :-------------------------: | :-------------------------: |
| 第三方 | | |
| 自定义      |                             | |

## 后续步骤

如需更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook)，其中包含示例代码和第三方资源链接，或了解我们关于评估的更多工具：

[评估入门



      Uses Datasets to quickly build evals and iterate on prompts.](https://developers.openai.com/api/docs/guides/evaluation-getting-started)

[使用评估



      Evaluate against external models, interact with evals via API, and more.](https://developers.openai.com/api/docs/guides/evals)