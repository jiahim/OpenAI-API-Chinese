# 视觉微调

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

视觉微调使用图像输入来 [监督微调](https://developers.openai.com/api/docs/guides/supervised-fine-tuning) ，以提升模型对图像输入的理解。本指南将带你了解 SFT 的这一子集，并概述使用图像输入进行微调的一些重要注意事项。

OpenAI 正在逐步关闭微调平台。该平台不再
  对新用户开放，但微调平台的现有用户仍将
  能够在未来几个月内创建训练作业。
  

  所有微调模型在其基础
  模型 [弃用](https://developers.openai.com/api/docs/deprecations)。之前，仍可用于推理。完整时间线见
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

正如你可以 [发送一个或多个图像输入并基于它们创建模型响应](https://developers.openai.com/api/docs/guides/images-vision)，你可以在 JSONL 训练数据文件中包含这些相同的消息类型。图像可以通过 HTTP URL 或包含 Base64 编码图像的数据 URL 提供。

以下是一个示例，展示 JSONL 文件一行中的图像消息。下面，为便于阅读，JSON 对象已展开，但通常此 JSON 会出现在数据文件的单行中：

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

上传视觉微调训练数据遵循 [此处描述的相同流程](https://developers.openai.com/api/docs/guides/supervised-fine-tuning).

## 图像数据要求

#### 大小

- 你的训练文件最多可包含 50,000 个包含图像的示例（不包括文本示例）。
- 每个示例最多可有 10 张图像。
- 每张图像最大可为 10 MB。

#### 格式

- 图像必须为 JPEG、PNG 或 WEBP 格式。
- 你的图像必须采用 RGB 或 RGBA 图像模式。
- 你无法将图像作为来自以下消息的输出包含在内， `assistant` 角色。

#### 内容审核政策

我们会在训练前扫描你的图片，以确保其符合我们的使用政策。这可能会导致微调开始前的文件验证出现延迟。

包含以下内容的图片将被从你的数据集中排除，且不会用于训练：

- 人物
- 面部
- 儿童
- 验证码

#### 如果您的图像被跳过该怎么办

你的图片可能因以下原因在训练过程中被跳过：

- **包含 CAPTCHA**, **包含人物**, **包含面部**, **包含儿童**
  - 移除该图像。目前，我们无法对包含这些实体的图像进行模型微调。
- **无法访问的 URL**
  - 请确保图像 URL 可公开访问。
- **图像过大**
  - 请确保你的图像符合我们的 [数据集大小限制](#size).
- **无效的图像格式**
  - 请确保你的图像符合我们的 [数据集格式](#format).

## 最佳实践

#### 降低训练成本

如果你将 `detail` 参数用于图像 `low`，图像会被调整为 512×512 像素，无论其原始大小如何，仅由 85 个 token 表示。这将降低训练成本。 [点击此处了解更多信息。](https://developers.openai.com/api/docs/guides/images-vision#low-or-high-fidelity-image-understanding)

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

要控制图像理解的保真度，请设置 `detail` 参数为 `image_url` ，或 `low`, `high`，或 `auto` 用于每张图像。这也会影响模型在训练期间看到的每张图像的令牌数量，并影响训练成本。 [点击此处了解更多信息](https://developers.openai.com/api/docs/guides/images-vision#low-or-high-fidelity-image-understanding).

## 安全检查

在生产环境中启动之前，请审阅并遵循以下安全信息。

我们如何进行安全评估

一旦微调作业完成，我们会在13个不同的安全类别中评估所得模型的行为。每个类别代表一个关键领域，如果控制不当，AI输出可能在这些领域造成伤害。

| 名称                   | 描述                                                                                                                                                                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| advice                 | 违反我们政策的建议或指导。                                                                                                                                                                                                 |
| harassment/threatening | 包含针对任何目标的暴力或严重伤害的骚扰内容。                                                                                                                                                             |
| hate                   | 基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓表达、煽动或宣扬仇恨的内容。针对非受保护群体（例如棋手）的仇恨内容属于骚扰。 |
| hate/threatening       | 基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓，针对目标群体包含暴力或严重伤害的仇恨内容。                                               |
| highly-sensitive       | 违反我们政策的高敏感数据。                                                                                                                                                                                              |
| illicit                | 就如何实施违法行为提供建议或指导的内容。像“如何入店行窃”这样的短语就属于此类。                                                                                                               |
| propaganda             | 对违反我们政策的意识形态的赞扬或协助。                                                                                                                                                                                  |
| self-harm/instructions | 鼓励实施自残行为（如自杀、割伤和饮食失调）或就如何实施此类行为提供指导或建议的内容。                                                                         |
| self-harm/intent       | 说话者表示正在或打算实施自残行为（如自杀、割伤和饮食失调）的内容。                                                                                           |
| 敏感              | 违反我们政策的敏感数据。                                                                                                                                                                                                     |
| 涉及未成年人的性内容          | 包含未满18岁个体的性内容。                                                                                                                                                                          |
| 色情                 | 旨在引起性兴奋的内容，例如性活动描述，或推广性服务（不包括性教育和健康内容）。                                                                                |
| 暴力               | 描绘死亡、暴力或身体伤害的内容。                                                                                                                                                                                      |

每个类别都有一个预定义的通过阈值；如果某个给定类别中评估的示例过多未通过，OpenAI将阻止微调模型部署。如果你的微调模型未通过安全检查，OpenAI会在微调作业中发送一条消息，说明哪些类别未达到所需阈值。你可以在微调作业的审核检查部分查看结果。

如何通过安全检查

除了查看微调作业对象中未通过的安全检查之外，你还可以通过查询 [微调 API 事件端点](https://platform.openai.com/docs/api-reference/fine-tuning/list-events)。来检索哪些类别未通过的详细信息。查找类型为 `moderation_checks` 的事件，以获取类别结果和执行详情。这些信息可以帮助你缩小要针对哪些类别进行重新训练和改进。模型规范 [模型规范](https://cdn.openai.com/spec/model-spec-2024-05-08.html#overview) 包含规则和示例，有助于识别需要补充训练数据的领域。

虽然这些评估涵盖广泛的安全类别，但你需要自行对微调模型进行评估，以确保它适合你的用例。

## 后续步骤

既然你已经了解了视觉微调的基础知识，也来探索一下这些其他方法。

[监督式微调



      Fine-tune a model by providing correct outputs for sample inputs.](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)

[直接偏好优化



      Fine-tune a model using direct preference optimization (DPO).](https://developers.openai.com/api/docs/guides/direct-preference-optimization)

[强化微调



      Fine-tune a reasoning model by grading its outputs.](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)