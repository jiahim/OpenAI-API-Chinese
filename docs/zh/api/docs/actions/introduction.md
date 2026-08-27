# GPT Actions

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

GPT Actions 存储于 [Custom GPTs](https://openai.com/blog/introducing-gpts)，中，它们通过提供指令、附加文档作为知识，并连接第三方服务，使用户能够针对特定用例定制 ChatGPT。

GPT Actions 使 ChatGPT 用户能够直接在 ChatGPT 之外，通过自然语言与外部应用进行 RESTful API 调用交互。它们将自然语言文本转换为 API 调用所需的 json schema。GPT Actions 通常用于向 [数据检索](https://developers.openai.com/api/docs/actions/data-retrieval) ChatGPT（例如查询数据仓库）或在另一个应用中执行操作（例如提交 JIRA 工单）。

## GPT Actions 的工作原理

本质上，GPT Actions 利用 [函数调用](https://developers.openai.com/api/docs/guides/function-calling) 来执行 API 调用。

类似于 ChatGPT 的数据分析功能（该功能会生成 Python 代码并执行），GPT Actions 利用函数调用来：(1) 确定哪个 API 调用与用户的问题相关，以及 (2) 生成该 API 调用所需的 json 输入。最后，GPT Action 使用该 json 输入执行 API 调用。

开发者甚至可以指定操作的认证机制，自定义 GPT 将使用第三方应用的认证来执行 API 调用。GPT Actions 对最终用户隐藏了 API 调用的复杂性：用户仅需用自然语言提问，ChatGPT 也会以自然语言提供输出。

## GPT Actions 的强大功能

API 允许 **互操作性** ，以使你的组织能够访问其他应用程序。然而，允许用户访问第三方 API 中的正确信息可能需要开发人员付出大量额外工作。

GPT Actions 提供了一种可行的替代方案：开发人员现在只需描述一次 API 调用的架构，配置认证，并向 GPT 添加一些指令，ChatGPT 就能在用户的自然语言问题与 API 层之间架起桥梁。

## 简化示例

《 [入门指南](https://developers.openai.com/api/docs/actions/getting-started) 》通过使用两次 API 调用的示例，来演示如何从 [weather.gov](https://developers.openai.com/api/docs/actions/weather.gov) 生成天气预报：

- /points/\{latitude},\{longitude} 输入纬度-经度坐标，输出预报办公室（wfo）和 x-y 坐标
- /gridpoints/\{office}/\{gridX},\{gridY}/forecast 输入 wfo、x、y 坐标，输出预报

一旦开发者将填充这两个 API 调用所需的 json schema 编码到 GPT Action 中，用户只需询问"这个周末去华盛顿特区应该打包什么？" GPT Action 便会自动计算该地点的经纬度，依次执行这两个 API 调用，并根据返回的周末天气预报提供打包清单。

在此示例中，GPT Actions 将向 api.weather.gov 提供两个 API 输入：

/points API 调用：

```json
{
  "latitude": 38.9072,
  "longitude": -77.0369
}
```

/forecast API 调用：

```json
{
  "wfo": "LWX",
  "x": 97,
  "y": 71
}
```

## 开始构建

请查看 [入门指南](https://developers.openai.com/api/docs/actions/getting-started) 以深入了解此天气示例及我们的 [操作库](https://developers.openai.com/api/docs/actions/actions-library) ，其中包含针对最常见第三方应用的预构建示例 GPT 操作。

## 补充信息

- 熟悉我们的 [GPT 政策](https://openai.com/policies/usage-policies#:~:text=or%20educational%20purposes.-,Building%20with%20ChatGPT,-Shared%20GPTs%20allow)
- 查看 [GPT 数据隐私常见问题解答](https://help.openai.com/en/articles/8554402-gpts-data-privacy-faqs)
- 查找 [常见 GPT 问题的答案](https://help.openai.com/en/articles/8554407-gpts-faq)