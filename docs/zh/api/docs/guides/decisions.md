# Decisions

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

Decisions API 可以评估文本、图像或两者，并返回类型化答案，速度比Responses API 快约 10 倍。它能够判断某个条件成立的概率、从固定选项中做出选择，或者按评分标准给出分数。你可以使用这些答案对内容进行分类、路由请求，并在应用中安排工作优先级。

在Playground中试用 Decisions API [Playground](https://platform.openai.com/decisions) 中，在编写代码之前先试验各种问题和输入。

Decisions API 目前处于公开测试阶段，预计将在未来几周内正式发布。
  `gpt-6-luna` 是当前唯一可用的模型。请使用专用的 `POST
  /v1/decisions` 端点。

## 决策的工作原理

一个请求包含三部分：

| 字段       | 用途                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| `model`     | 用于评估请求的模型。目前仅支持 `gpt-6-luna` 。                         |
| `input`     | 问题的共享证据：文本字符串或包含文本和图像的用户消息。            |
| `questions` | 评估内容，包括每个问题的类型、说明以及任何允许的选项或评分等级。 |

响应包含一个 `answers` 数组。为每个问题分配一个唯一的 `name` 用于标识其答案；API 会在响应中回显该名称。

### 选择问题类型

| 类型        | 用途                                                       | 主要结果                                                        |
| ----------- | --------------------------------------------------------------- | ------------------------------------------------------------------ |
| `predicate` | 检查某个条件，例如可见的损坏或段落相关性。 | `probability`: 一个介于 0 到 1 之间的估计值，表示该条件为真的概率。 |
| `choice`    | 从一组选项中选择一个，例如部门或内容类别。    | `choice`: 你提供的值之一。                             |
| `score`     | 按有序等级对输入进行评分，例如问题严重程度。   | `score`: 各级别索引的按概率加权平均值。    |

Both `choice` 和 `score` 都返回离散选项的概率。对无序类别（如部门）使用 `choice` 。对有序级别（如严重程度）使用 `score` ，它会取这些级别数值索引的概率加权平均，从而生成一个可落在级别之间的分数。

当你的应用需要以下某种答案类型时，可以使用 Decisions。使用 [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) 配合 Responses API 在需要根据你自己的 JSON schema 生成对象（例如抽取的字段或一段书面说明）时使用，或者 [function calling](https://developers.openai.com/api/docs/guides/function-calling) 在需要让模型请求带参数的函数调用时使用。

## 检查图像是否有可见损坏

使用一个 `predicate` 问题来检查产品照片是否有可见的损坏。该请求将图像与寻找裂纹、撕裂或凹痕的指令相结合。



```bash
IMAGE_BASE64="$(base64 < product.png | tr -d '\r\n')"

curl https://api.openai.com/v1/decisions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @- <<JSON
{
  "model": "gpt-6-luna",
  "input": [{
    "role": "user",
    "content": [
      {"type": "input_text", "text": "Inspect the product in this photo."},
      {"type": "input_image", "image_url": "data:image/png;base64,$IMAGE_BASE64"}
    ]
  }],
  "questions": [{
    "type": "predicate",
    "name": "visible_damage",
    "instructions": "Does the product have visible damage, such as a crack, tear, or dent? Ignore shadows and damage to the packaging."
  }]
}
JSON
```

一个示例响应片段：

```json
{
  "answers": [
    {
      "type": "predicate",
      "name": "visible_damage",
      "probability": 0.92
    }
  ]
}
```

该 `probability` 是模型对条件成立的估计值。可根据你选择的阈值用它来标记需要复核的照片。

图像必须为内联的 base64 数据 URL。此接口不支持托管的 HTTP 或 HTTPS 图像 URL 和 `file_id` 输入。在用户消息中合并多个 `input_text` 和 `input_image` 部分，以便结合图像与指令或其他上下文进行评估。

## 从固定选项中选择

一个 `choice` question 从你提供的选项中选取一个值。使用具有不同含义的值，并配上能够说明每个选项适用场景的描述。



该请求用于路由一条客户投诉：

```bash
curl https://api.openai.com/v1/decisions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-6-luna",
    "input": "I was charged twice for my order.",
    "questions": [{
      "type": "choice",
      "name": "department",
      "instructions": "Which department should handle this complaint?",
      "choices": [
        {"value": "billing", "description": "Payments, invoices, and refunds."},
        {"value": "technical", "description": "Problems using the product."},
        {"value": "shipping", "description": "Delivery and tracking."},
        {"value": "other", "description": "Requests outside these categories."}
      ]
    }]
  }'
```

一个示例响应片段：

```json
{
  "answers": [
    {
      "type": "choice",
      "name": "department",
      "choice": "billing",
      "probabilities": [
        { "value": "billing", "probability": 0.95 },
        { "value": "technical", "probability": 0.02 },
        { "value": "shipping", "probability": 0.01 },
        { "value": "other", "probability": 0.02 }
      ],
      "confidence": 0.93
    }
  ]
}
```

答案的 `choice` 字段包含一个提供的值，此处为 `"billing"`。它还包含一个 `probabilities` 数组，用于存放各个选项，以及一个 `confidence` 字段。参见 [解释答案](#interpret-the-answers) 获取设置阈值的指导。

包含一个兜底选项，例如 `"other"` 当你的类别无法覆盖所有可能的输入时。你的应用可以将该结果发送到一个通用审核队列。

## 根据评分标准打分

一个 `score` question 会按顺序对输入进行评估 `levels`。为每个等级定义判定标准，并按从低到高排列。



```bash
curl https://api.openai.com/v1/decisions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-6-luna",
    "input": "Export fails in Safari but works in Chrome.",
    "questions": [{
      "type": "score",
      "name": "severity",
      "instructions": "How severe is this issue?",
      "levels": [
        {"label": "Cosmetic", "description": "Appearance only; no lost functionality."},
        {"label": "Workaround available", "description": "A task fails, but another way works."},
        {"label": "Fully blocked", "description": "A task fails with no workaround."}
      ]
    }]
  }'
```

一个示例响应片段：

```json
{
  "answers": [
    {
      "type": "score",
      "name": "severity",
      "score": 1.1,
      "probabilities": [
        { "value": 0, "label": "Cosmetic", "probability": 0.1 },
        { "value": 1, "label": "Workaround available", "probability": 0.7 },
        { "value": 2, "label": "Fully blocked", "probability": 0.2 }
      ],
      "confidence": 0.55
    }
  ]
}
```

等级索引从 0 起始。这里 0 表示仅影响外观，1 表示存在可行的临时解决方案，2 表示完全阻塞。返回的 `score` 是概率加权平均值，因此可能落在两个等级之间。在本例中，0.1、0.7 和 0.2 的概率会得到 1.1 的评分。

结果还包括 `confidence` 以及每个等级的 `probabilities`。该评分汇总了跨等级的整体分布情况。可使用 `choice` 来选取单一类别。

## 询问多个问题

将独立问题放入同一个 `questions` 数组中以评估共享输入。例如，对于产品照片，你可以在一次请求中同时检查损坏情况并对产品类别进行分类。每个问题可以使用不同的类型。

如果决策依赖于先前的答案，请分别发送请求。例如，先检查损坏情况，再根据结果决定是否请求维修类别。

围绕可观察的准则撰写问题。将不同的关注点拆分为不同的问题，为选项赋予不同的含义，并定义评分等级，使相邻等级具有明确的区分准则。

## 解读回答

谓词返回某个条件成立的估计概率。Choice 和 score 答案返回概率分布以及单独的 `confidence` 字段。

使用你应用中的标注样本来设定用于路由、过滤或审查的阈值。根据误报和漏报的成本来选择阈值。

## 定价与可用性

对于 `gpt-6-luna`，输入价格为 **每 1M token $0.10**。你只需为输入 token 付费：没有缓存读取、缓存写入或输出 token 费用。

区域处理溢价和长上下文输入价格倍率适用。这些费率适用于 `/v1/decisions`；使用 `gpt-6-luna` 的其他请求遵循适用的 [模型与处理层级定价](https://developers.openai.com/api/docs/pricing).

Decisions API 支持零数据保留 (ZDR) 和 HIPAA 使用，适用于符合条件的客户。美国和欧洲 (EEA + 瑞士) 支持数据驻留和区域处理。详见 [数据控制](https://developers.openai.com/api/docs/guides/your-data) 以了解资格要求、所需协议和限制。

## 添加语音控制

使用 [客户端委托配合 Live API](https://developers.openai.com/api/docs/guides/decisions-voice) 根据语音请求选择操作，并向用户反馈结果。