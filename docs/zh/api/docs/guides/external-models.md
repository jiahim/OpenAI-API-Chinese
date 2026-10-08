# 评估外部模型

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取相应页面的 Markdown 版本。

模型选择是帮助构建者改进其 AI 应用的重要手段。在 OpenAI 平台上使用 Evaluations 时，除了评估 OpenAI 的原生模型外，你还可以评估多种外部模型。

我们支持访问 **第三方模型** （无需 API 密钥），以及访问 **自定义端点** （需要 API 密钥）。

OpenAI 正在弃用 Evals 平台。现有 evals 内容在
  过渡期内仍然可用。Evals 将于 2026 年 10 月 31 日对
  现有用户变为只读，并计划于 2026 年 11 月 30 日关停平台，
  请参阅 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) 了解当前的
  时间表。

## 第三方模型

要使用第三方模型，必须满足以下条件：

- 你的 OpenAI 组织必须处于 [Build](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers) 或更高等级。
- 你所在 OpenAI 组织的管理员必须通过以下方式启用此功能： [Settings > Organization > General](https://platform.openai.com/settings/organization/general)。要启用此功能，管理员必须接受显示的使用免责声明。

对外部模型的调用会将数据传递给第三方，并受以下条款约束
  与调用 OpenAI 模型相比，这些工具有不同的使用条款且安全性保障较弱。

### 账单与使用限额

OpenAI 目前承担第三方模型的推理费用，但根据你所在组织的使用层级设有以下月度限额。

| 使用层级 | 每月消费上限（美元） |
| ---------- | ------------------------- |
| 构建      | $25                       |
| 发布     | $100                      |
| 增长       | $200                      |

我们通过合作伙伴 OpenRouter 提供这些模型。未来，第三方模型将计入你的常规 OpenAI 账单周期，按 [OpenRouter 公开定价](https://openrouter.ai/models).

### 可用的第三方模型

我们提供对以下外部模型提供商的访问：

- Google
- Anthropic（托管于 AWS Bedrock）
- Together
- Fireworks

## 自定义端点

你可以在 OpenAI 平台上配置完全自定义的模型端点，并对其运行评估。通常这是我们未原生支持的提供商、你自行托管的模型，或你用于发起推理调用的自定义代理。

若要使用此功能，你的 OpenAI 组织的管理员必须通过 [Settings > Organization > General](https://platform.openai.com/settings/organization/general)。启用“Enable custom providers for evaluations”设置。要启用此功能，管理员必须接受所显示的使用免责声明。请注意，调用外部模型会将数据传递给第三方，并受与调用 OpenAI 模型不同的条款约束，且安全保证较弱。

一旦你具备使用自定义提供商的资格，你可以在 **Evaluations** 选项卡下的 [Settings](https://platform.openai.com/settings/)。下设置提供商。请注意，自定义提供商按项目进行配置。要连接你的自定义端点，你将需要：

- 兼容以下端点： [OpenAI 的 chat completions 端点](https://developers.openai.com/api/reference/resources/chat)
- 一个 API 密钥

为你的端点命名，提供一个端点 URL，并指定你的API 密钥。我们要求你使用 `https://` 端点，并且我们会加密你的密钥以保证安全。指定你希望评估的任何模型名称（slug）。你可以点击 **Verify** 按钮，以确保你的模型已正确设置。这将向每个模型 slug 发送一次包含最简输入的测试调用，并指出任何失败情况。

## 使用外部模型运行 evals

配置好外部模型后，你就可以在以下位置通过模型选择器将其用于评估： [数据集](https://platform.openai.com/evaluation) 或你的 [评估](https://platform.openai.com/evaluation?tab=evals)。请注意，目前不支持工具调用。

| 模型类型  |          数据集           |            Evals            |
| ----------- | :-------------------------: | :-------------------------: |
| 第三方 | | |
| 自定义      |                             | |

## 后续步骤

如需更多灵感,请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook),其中包含示例代码和第三方资源链接,或者了解我们用于评估的更多工具:

[评估入门



      Uses Datasets to quickly build evals and iterate on prompts.](https://developers.openai.com/api/docs/guides/evaluation-getting-started)

[使用评估



      Evaluate against external models, interact with evals via API, and more.](https://developers.openai.com/api/docs/guides/evals)