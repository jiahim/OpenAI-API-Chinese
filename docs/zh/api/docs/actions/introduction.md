# GPT Actions

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

GPT Actions 存储在 [自定义 GPT](https://openai.com/blog/introducing-gpts)，中，它允许用户通过提供指令、将文档作为知识附件以及连接第三方服务，将 ChatGPT 定制为特定用例。

GPT Actions 使 ChatGPT 用户能够在 ChatGPT 之外，通过自然语言与外部应用进行基于 RESTful API 调用的交互。它们将自然语言文本转换为进行 API 调用所需的 JSON schema。GPT Actions 通常用于执行 [数据检索](https://developers.openai.com/api/docs/actions/data-retrieval) （例如查询数据仓库），或在另一个应用中执行操作（例如提交一个 JIRA 工单）。

## GPT Actions 的工作原理

GPT Actions 的核心是利用 [Function Calling](https://developers.openai.com/api/docs/guides/function-calling) 来执行 API 调用。

与 ChatGPT 的 Data Analysis 功能（它会生成 Python 代码并执行）类似，它们利用 Function Calling 来（1）确定哪个 API 调用与用户的问题相关，以及（2）生成该 API 调用所需的 json 输入。最后，GPT Action 使用该 json 输入执行 API 调用。

开发者甚至可以指定某个 action 的身份验证机制，Custom GPT 将使用第三方应用的认证来执行该 API 调用。GPT Actions 向最终用户隐藏了 API 调用的复杂性：用户只需用自然语言提问，ChatGPT 也会用自然语言返回结果。

## GPT Actions 的强大之处

API 允许 **实现互操作，以便你的组织能够访问其他应用。然而，让用户从第三方 API 中获取正确信息可能会给开发者带来大量额外工作。** to enable your organization to access other applications. However, enabling users to access the right information from 3rd-party 接口s can require significant overhead from developers.

GPT Actions 提供了一个可行的替代方案：开发者现在只需描述一次 API 调用的模式（schema），配置好身份验证，并向 GPT 提供一些指令，ChatGPT 就会在用户的自然语言问题与 API 层之间架起桥梁。

## 简化示例

该 [入门指南](https://developers.openai.com/api/docs/actions/getting-started) 通过来自的两次 API 调用演示一个示例 [weather.gov](https://developers.openai.com/api/docs/actions/weather.gov) 以生成天气预报：

- /points/\{latitude},\{longitude} 输入经纬度坐标，并输出预报办公室 (wfo) 以及 x-y 坐标
- /gridpoints/\{office}/\{gridX},\{gridY}/forecast 输入 wfo,x,y 坐标，并输出预报结果

一旦开发者把填充这两个 API 调用所需的 json schema 编码到 GPT Action 中，用户就可以直接问"我这个周末去华盛顿特区旅行该带什么？"。GPT Action 会自动获取该地点的经纬度，按顺序执行这两个 API 调用，并根据返回的周末天气情况给出打包清单。

在这个示例中，GPT Actions 会向 api.weather.gov 提供两个 API 输入：

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

查看 [入门指南](https://developers.openai.com/api/docs/actions/getting-started) ，深入了解这个天气示例以及我们的 [actions 库](https://developers.openai.com/api/docs/actions/actions-library) ，其中包含最常见的第三方应用的预构建 GPT Actions 示例。

## 其他信息

- 请先了解我们的 [GPT 政策](https://openai.com/policies/usage-policies#:~:text=or%20educational%20purposes.-,Building%20with%20ChatGPT,-Shared%20GPTs%20allow)
- 查看 [GPT 数据隐私常见问题解答](https://help.openai.com/en/articles/8554402-gpts-data-privacy-faqs)
- 查找 [常见 GPT 问题](https://help.openai.com/en/articles/8554407-gpts-faq)