# 评估外部模型

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

模型选择是使构建者能够改进其 AI 应用的重要杠杆。在 OpenAI 平台上使用评估时，除了评估 OpenAI 的原生模型外，你还可以评估多种外部模型。

我们支持访问 **第三方模型** （无需 API 密钥）以及访问 **自定义端点** （需要 API 密钥）。

OpenAI 正在弃用 Evals 平台。现有的评估内容在
  过渡期内仍可用。Evals 将在 2026 年 10 月 31 日对
  现有用户变为只读，平台计划于 2026 年 11 月 30 日关闭。
  请参阅 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) 了解当前的
  时间表。

## 第三方模型

为了使用第三方模型，必须满足以下条件：

- 你的 OpenAI 组织必须处于 [使用层级 1](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers) 或更高。
- 你的 OpenAI 组织的管理员必须通过 [设置 > 组织 > 常规](https://platform.openai.com/settings/organization/general)。启用此功能。要启用此功能，管理员必须接受所显示的使用声明。

对外部模型的调用会将数据传递给第三方，并且
  与调用OpenAI模型相比，适用不同的条款且安全保证较弱。

### 计费与使用限制

OpenAI 目前覆盖第三方模型的推理成本，具体取决于你所在组织的使用层级对应的每月限额。

| 使用层级 | 月度消费上限（美元） |
| ---------- | ------------------------- |
| 层级 1     | $5                        |
| 层级 2     | $25                       |
| 层级 3     | $50                       |
| 层级 4     | $100                      |
| 层级 5     | $200                      |

我们通过合作伙伴 OpenRouter 提供这些模型。未来，第三方模型将作为你常规OpenAI计费周期的一部分收费，价格按 [OpenRouter 列表价格](https://openrouter.ai/models).

### 可用的第三方模型

我们提供对以下外部模型提供商的访问：

- Google
- Anthropic（托管于 AWS Bedrock）
- Together
- Fireworks

## 自定义端点

你可以在 OpenAI 平台上配置一个完全自定义的模型端点，并对其运行评估。这通常是我们原生不支持的提供商、你自己托管的模型，或你用于进行推理调用的自定义代理。

要使用此功能，你的 OpenAI 组织管理员必须通过以下路径启用“为评估启用自定义提供商”设置： [设置 > 组织 > 通用](https://platform.openai.com/settings/organization/general)。要启用此功能，管理员必须接受显示的免责声明。请注意，对外部模型的调用会将数据传递给第三方，与调用 OpenAI 模型相比，其条款不同且安全保证较弱。

一旦你有资格使用自定义提供商，就可以在 **评估** 选项卡下的 [设置](https://platform.openai.com/settings/)。中设置提供商。请注意，自定义提供商是按项目配置的。要连接你的自定义端点，你需要：

- 一个与 [OpenAI 的聊完成端点兼容的端点](https://developers.openai.com/api/reference/resources/chat)
- 一个 API 密钥

命名你的端点，提供端点 URL，并指定你的 API 密钥。我们要求你使用一个 `https://` 端点，并且我们会对你的密钥进行加密以确保安全。指定你想评估的任何模型名称（slug）。你可以点击 **“验证”** 按钮以确保你的模型设置正确。这将向每个模型 slug 发起一个包含最小输入的测试调用，并会指示任何失败。

## 使用外部模型运行评估

配置外部模型后，你可以通过从模型选择器中选择该模型，在 [数据集](https://platform.openai.com/evaluation) 或你的 [评估](https://platform.openai.com/evaluation?tab=evals)。中使用它进行评估。请注意，目前不支持工具调用。

| 模型类型  |           数据集            |             评估             |
| ----------- | :---------------------------: | :---------------------------: |
| 第三方 | | |
| 自定义      |                               | |

## 下一步

如需更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook)，其中包含示例代码和第三方资源链接，或了解我们的评估工具：

[评估入门



      Uses Datasets to quickly build evals and iterate on prompts.](https://developers.openai.com/api/docs/guides/evaluation-getting-started)

[使用评估



      Evaluate against external models, interact with evals via API, and more.](https://developers.openai.com/api/docs/guides/evals)