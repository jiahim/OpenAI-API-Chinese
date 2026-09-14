# 网页搜索

> 完整文档索引请参阅 [llms.txt](/llms.txt)。如需获取页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 。

当你的智能体需要查找信息来回答问题或完成任务时，可使用网页搜索。

## 示例：解释为什么火星看起来是红色的

将此 JSON 请求体发送至 `POST /v1/agents/sessions` 以创建一个会话并流式返回答案。它会在响应中启用网页搜索 `live` 模式：

```json
{
  "agent": {
    "model": "gpt-6-astra",
    "reasoning": { "effort": "low" },
    "tools": [{ "type": "web_search", "mode": "live" }]
  },
  "environment": { "type": "none" },
  "input": "Search NASA's website for why Mars looks red. Explain it in two sentences and include a source link.",
  "stream": true
}
```

### Result

在 2026 年 9 月 10 日的测试运行中，智能体搜索了 NASA 的网站并流式返回了以下答案：

> 火星呈现红色，是因为其土壤中的铁矿物发生了氧化（即生锈），从而让地表呈现出偏红的颜色。正是这种锈红色的外观，使它被称为“红色行星”，资料来源： [NASA 火星科普资料](https://science.nasa.gov/mars/facts/).

这是一个已录制的示例。你的答案可能会有所不同。

如果你离开 `web_search` 出 `agent.tools`, 内置的网页搜索将关闭。在提示中要求搜索并不会将其开启。

## 搜索模式

- **`live` (default)**: 允许搜索访问实时互联网。在你包含 `web_search` 但省略 `mode`.
- **`cached`**: 搜索已保存的网页内容，不访问实时互联网。
- **`disabled`**: 关闭内置网页搜索,与不包含该工具的效果相同。

## 可选设置

将这些字段添加到同一个 `web_search` 条目中:

| 设置           | 作用                                                                                                        | 若省略                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `context_size`    | 模型从搜索中接收的信息量： `low`, `medium`，或 `high`.                                    | 用途 `medium`.                                                                                                                         |
| `allowed_domains` | 搜索可能包含的网站。最多提供 **100 个域名**，例如 `["python.org", "docs.python.org"]`. | 不应用域名过滤。                                                                                                           |
| `location`        | 帮助根据地点定制结果。接受 `country`, `region`, `city`，和 `timezone`.                               | 搜索未提供位置信息。缺少位置详情可能导致本地搜索结果的相关性降低，或找不到有用的匹配项。 |