# 评估外部模型

> 完整文档索引请参见 [llms.txt](/llms.txt)。如需获取 Markdown 版本的文档页面，可在页面 URL 后追加 `.md` 来访问。

模型选择是一根重要杠杆，能帮助开发者改进其 AI 应用。在 OpenAI 平台上使用评估时，除了评估 OpenAI 的原生模型外，你还可以评估多种外部模型。

我们支持访问 **第三方模型** （无需 API 密钥）以及访问 **自定义端点** （需要 API 密钥）。

OpenAI 正在弃用 Evals 平台。现有评估内容在过渡期内仍然
  可用。Evals 将于 2026 年 10 月 31 日对
  现有用户转为只读，并计划于 2026 年 11 月 30 日关停平台。详见
  弃用 [页面
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) 了解当前
  时间表。

## 第三方模型

要使用第三方模型，必须满足以下条件：

- 你的 OpenAI 组织必须处于 [usage tier 1](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers) 或更高等级。
- 你的 OpenAI 组织的管理员必须通过以下路径启用此功能： [Settings > Organization > General](https://platform.openai.com/settings/organization/general). 若要启用此功能，管理员必须接受显示的使用免责声明。

对外部模型的调用会将数据传递给第三方，并且受制于与对 OpenAI 模型调用不同的条款和更弱的安全保障。
  different terms and weaker safety guarantees than calls to 该公司 models.

### 计费与使用限制

OpenAI 目前承担第三方模型的推理费用，但根据你所在组织的使用层级设有以下月度上限。

| 使用层级 | 月度消费上限（美元） |
| ---------- | ------------------------- |
| 层级 1     | $5                        |
| 层级 2     | $25                       |
| 层级 3     | $50                       |
| 层级 4     | $100                      |
| 层级 5     | $200                      |

我们通过合作伙伴 OpenRouter 提供这些模型。未来，第三方模型将作为你常规 OpenAI 计费周期的一部分进行计费，按 [OpenRouter 公开价格](https://openrouter.ai/models).

### 可用的第三方模型

我们提供对以下外部模型提供商的访问：

- Google
- Anthropic（托管在 AWS Bedrock 上）
- Together
- Fireworks

## Custom endpoints

你可以在 OpenAI Platform 上配置完全自定义的模型端点并对其运行评测。这通常用于我们未原生支持的提供方、你自行托管的模型，或你用于发起推理调用的自定义代理。

要使用此功能，你的 OpenAI 组织的管理员必须通过 [Settings > Organization > General](https://platform.openai.com/settings/organization/general)。启用“Enable custom providers for evaluations”设置。要启用此功能，管理员必须接受显示的使用免责声明。请注意，对外部模型的调用会将数据传递给第三方，并且相较于对 OpenAI 模型的调用，适用不同的条款且安全保障更弱。

一旦你具备使用自定义提供方的资格，就可以在 **Evaluations** 标签下的 [Settings](https://platform.openai.com/settings/)。中设置一个提供方。请注意，自定义提供方按项目配置。要连接你的自定义端点，你将需要：

- 一个与 [OpenAI 的 chat completions 端点兼容的端点](https://developers.openai.com/api/reference/resources/chat)
- 一个 API 密钥

为你的端点命名，提供一个端点 URL，并指定你的 API 密钥。我们要求你使用 `https://` 一个端点，并且我们会为安全起见加密你的密钥。指定你希望评估的任何模型名称（slug）。你可以点击 **“验证”** 按钮，以确保你的模型已正确设置。这将对每个模型 slug 进行一次包含最小输入的测试调用，并显示任何失败信息。

## 使用外部模型运行 evals

配置好外部模型后，你就可以在评估中使用它，只需在你的 [数据集](https://platform.openai.com/evaluation) 或你的 [评估](https://platform.openai.com/evaluation?tab=evals)。的模型选择器中选中它即可。注意，目前尚不支持工具调用。

| 模型类型  |           数据集            |             Evals             |
| ----------- | :---------------------------: | :---------------------------: |
| 第三方 | | |
| 自定义      |                               | |

## 下一步

如需更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook)，其中包含示例代码和第三方资源链接，或了解我们用于评估的工具：

[评估入门



      Uses Datasets to quickly build evals and iterate on prompts.](https://developers.openai.com/api/docs/guides/evaluation-getting-started)

[使用评估



      Evaluate against external models, interact with evals via API, and more.](https://developers.openai.com/api/docs/guides/evals)