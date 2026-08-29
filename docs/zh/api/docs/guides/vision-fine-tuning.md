# 视觉微调

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。你可以在页面 URL 末尾添加 `.md` 来获取对应页面的 Markdown 版本。

视觉微调使用图像输入进行 [监督微调](https://developers.openai.com/api/docs/guides/supervised-fine-tuning) 以提升模型对图像输入的理解。本指南将带你了解这一 SFT 子集，并概述使用图像输入进行微调时需要注意的一些重要事项。

OpenAI 正在逐步关闭微调平台。该平台已不再
  对新用户开放，但现有微调平台的用户在未来数月内
  仍可创建训练任务。
  

  所有微调模型在其基础
  模型被 [弃用](https://developers.openai.com/api/docs/deprecations)。之前将一直可供推理使用。完整时间表请参见
  [此处](https://developers.openai.com/api/docs/deprecations).




<table>
<tbody>
<tr>
<th>How it works</th>
<th>Best for</th>
<th>Use with</th>
</tr>

<tr>
<td>
Provide image inputs for supervised fine-tuning to improve the model's understanding of image inputs.
</td>
<td>
- Image classification
- Correcting failures in instruction following for complex prompts
</td>
<td>
`gpt-4o-2024-08-06`
</td>
</tr>
</tbody>
</table>

## 数据格式

正如你可以 [发送一个或多个图像输入并基于它们创建模型响应](https://developers.openai.com/api/docs/guides/images-vision)，你可以在 JSONL 训练数据文件中包含相同的消息类型。图像可以通过 HTTP URL 或包含 Base64 编码图像的 data URL 来提供。

下面是你的 JSONL 文件中一行图像消息的示例。为方便阅读，下面的 JSON 对象做了展开处理，但在实际的数据文件中通常会单行显示：

```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are an assistant that identifies and describes artworks."
    },
    {
      "role": "user",
      "content": "Describe this artwork."
    },
    {
      "role": "user",
      "content": [
        {
          "type": "image_url",
          "image_url": {
            "url": "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg"
          }
        }
      ]
    },
    {
      "role": "assistant",
      "content": "This appears to be a traditional painted artwork with a central human subject."
    }
  ]
}
```

上传用于视觉微调的训练数据遵循 [此处描述的相同流程](https://developers.openai.com/api/docs/guides/supervised-fine-tuning).

## 图像数据要求

#### 尺寸

- 你的训练文件最多可以包含 50,000 个含图像的示例（不包括纯文本示例）。
- 每个示例最多可以包含 10 张图像。
- 每张图像最大为 10 MB。

#### 格式

- 图像必须为 JPEG、PNG 或 WEBP 格式。
- 你的图像必须使用 RGB 或 RGBA 图像模式。
- 你不能在以下角色的消息中以输出形式包含图像： `assistant` role。

#### 内容审核策略

我们会在训练前扫描你的图像，以确保它们符合我们的使用政策。这可能会在微调开始前为文件校验带来一定延迟。

包含以下内容的图像将被排除在你的数据集之外，且不会用于训练：

- 人物
- 人脸
- 儿童
- 验证码

#### 如果图片被跳过该如何处理

在以下情况下，你的图片可能会在训练中被跳过：

- **包含 CAPTCHA**, **包含人物**, **包含人脸**, **包含儿童**
  - 移除该图像。目前，我们无法对包含这些实体的图像进行模型微调。
- **无法访问的 URL**
  - 请确保图像 URL 可公开访问。
- **图像过大**
  - 请确保你的图像符合我们的 [数据集大小限制](#size).
- **无效的图像格式**
  - 请确保你的图像符合我们的 [数据集格式](#format).

## 最佳实践

#### 降低训练成本

如果设置图像的 `detail` 参数， `low`，图像将被调整为 512 x 512 像素，无论原始大小如何，仅用 85 个 token 表示。这将降低训练成本。 [请参阅此处获取更多信息。](https://developers.openai.com/api/docs/guides/images-vision#low-or-high-fidelity-image-understanding)

```json
{
  "type": "image_url",
  "image_url": {
    "url": "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg",
    "detail": "low"
  }
}
```

#### 控制图像质量

若要控制图像理解的保真度，请设置 `detail` 参数 `image_url` 为 `low`, `high`，或者 `auto` 对每张图像进行设置。这也会影响模型在训练时看到的每张图像的 token 数量，并影响训练成本。 [更多信息请参见此处](https://developers.openai.com/api/docs/guides/images-vision#low-or-high-fidelity-image-understanding).

## 安全检查

在投入生产环境之前，请先查看并遵循以下安全信息。



### 我们的安全评估方式



微调任务完成后，我们会从 13 个不同的安全类别评估所得模型的行为。每个类别代表了一个关键领域，如果 AI 输出未得到适当控制，可能会造成潜在危害。

| 名称                   | 说明                                                                                                                                                                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| advice                 | 违反我们策略的建议或指导。                                                                                                                                                                                                 |
| harassment/threatening | 包含针对任何目标的暴力或严重伤害的骚扰内容。                                                                                                                                                             |
| hate                   | 基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓表达、煽动或宣扬仇恨的内容。针对非受保护群体（例如国际象棋棋手）的仇恨内容属于骚扰。 |
| hate/threatening       | 基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓，针对目标群体的同时包含暴力或严重伤害的仇恨内容。                                               |
| highly-sensitive       | 违反我们策略的高度敏感数据。                                                                                                                                                                                              |
| illicit                | 提供如何实施违法行为的建议或指引的内容。像“如何入店行窃”这样的短语就属于此类。                                                                                                               |
| propaganda             | 对违反我们策略的意识形态的赞美或协助。                                                                                                                                                                                  |
| self-harm/instructions | 鼓励实施自我伤害行为（例如自杀、自残、饮食失调）的内容，或提供实施此类行为的指引或建议的内容。                                                                         |
| self-harm/intent       | 说话者表示自己正在或打算实施自我伤害行为（例如自杀、自残、饮食失调）的内容。                                                                                           |
| 敏感信息              | 违反我们政策的敏感数据。                                                                                                                                                                                                     |
| sexual/minors          | 包含 18 岁以下未成年人的性相关的内容。                                                                                                                                                                          |
| sexual                 | 旨在唤起性兴奋的内容，例如对性行为的描述，或推广性服务的内容（不包括性教育和性健康内容）。                                                                                |
| 暴力               | 描绘死亡、暴力或人身伤害的内容。                                                                                                                                                                                      |

每个类别都有一个预定义的通过阈值；如果某个类别中太多评估样本未通过，OpenAI 会阻止该微调模型部署。如果你的微调模型未通过安全检查，OpenAI 会在微调任务中发送一条消息，说明哪些类别未达到所需阈值。你可以在微调任务的审核检查部分查看结果。







### 如何通过安全检查



除了查看微调任务对象中任何失败的安全检查项之外，你还可以通过查询以下接口来获取失败类别的详细信息： [微调 API events 端点](https://platform.openai.com/docs/api-reference/fine-tuning/list-events)。查找类型为 `moderation_checks` 的事件以获取类别结果和强制执行情况详情。这些信息可以帮助你缩小需要针对再训练和改进的类别范围。 [模型规范](https://cdn.openai.com/spec/model-spec-2024-05-08.html#overview) 包含有助于识别额外训练数据需求领域的规则和示例。

虽然这些评估涵盖了广泛的安全类别，但你仍应对微调后的模型进行自己的评估，以确保它适用于你的用例。





## 下一步

现在你已经掌握了视觉微调的基础知识，也可以探索以下其他方法。

[监督微调



      Fine-tune a model by providing correct outputs for sample inputs.](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)

[直接偏好优化



      Fine-tune a model using direct preference optimization (DPO).](https://developers.openai.com/api/docs/guides/direct-preference-optimization)

[强化微调



      Fine-tune a reasoning model by grading its outputs.](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)