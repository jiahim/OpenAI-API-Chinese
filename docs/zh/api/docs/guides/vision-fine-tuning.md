# 视觉微调

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

视觉微调使用图像输入进行 [监督微调](https://developers.openai.com/api/docs/guides/supervised-fine-tuning) ，以提升模型对图像输入的理解能力。本指南将带你了解 SFT 的这一子集，并概述使用图像输入进行微调时的一些重要考量。

OpenAI 正在逐步关闭微调平台。该平台不再
  对新用户开放，但现有微调平台用户仍将
  能够在未来数月内创建训练任务。
  

  所有微调后的模型在其基础
  模型 [弃用](https://developers.openai.com/api/docs/deprecations)。之前，仍可用于推理。完整的时间线请参见
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

正如你可以 [发送一个或多个图像输入并基于它们创建模型响应](https://developers.openai.com/api/docs/guides/images-vision)，你也可以在 JSONL 训练数据文件中包含这些相同的消息类型。图像既可以作为 HTTP URL 提供，也可以作为包含 Base64 编码图像的数据 URL 提供。

以下是 JSONL 文件一行中图像消息的示例。下面，JSON 对象为了可读性而展开，但通常此 JSON 会出现在数据文件的单行中：

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

为视觉微调上传训练数据遵循 [此处描述的相同流程](https://developers.openai.com/api/docs/guides/supervised-fine-tuning).

## 图像数据要求

#### 大小

- 你的训练文件最多可包含 50,000 个含有图片的示例（不包括纯文本示例）。
- 每个示例最多可包含 10 张图片。
- 每张图片大小最大为 10 MB。

#### 格式

- 图像必须为 JPEG、PNG 或 WEBP 格式。
- 你的图像必须采用 RGB 或 RGBA 图像模式。
- 你不能在具有 `assistant` 角色的消息中输出图像。

#### 内容审核政策

我们会在训练前扫描你的图像，以确保它们符合我们的使用政策。这可能会在微调开始前的文件验证阶段引入延迟。

包含以下内容的图像将从你的数据集中排除，不会用于训练：

- 人物
- 人脸
- 儿童
- 验证码

#### 如果图片被跳过该怎么办

由于以下原因，你的图像在训练期间可能会被跳过：

- **包含 CAPTCHA**, **包含人物**, **包含人脸**, **包含儿童**
  - 请移除该图像。目前，我们无法对包含这些实体的图像进行模型微调。
- **无法访问的 URL**
  - 请确保图像 URL 可公开访问。
- **图像过大**
  - 请确保你的图像符合我们的 [数据集大小限制](#size).
- **无效的图像格式**
  - 请确保你的图像符合我们的 [数据集格式](#format).

## 最佳实践

#### 降低训练成本

如果你将图片的 `detail` 参数设置为 `low`，图片会被调整为 512 x 512 像素，并且不论其原始尺寸如何，仅由 85 个 token 表示。这将降低训练成本。 [点击此处了解更多信息。](https://developers.openai.com/api/docs/guides/images-vision#low-or-high-fidelity-image-understanding)

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

要控制图像理解的保真度，请设置 `detail` 参数为 `image_url` 为 `low`, `high`，或 `auto` 对每张图像。这还会影响模型在训练时看到的每张图像的 token 数量，并影响训练成本。 [点击此处了解更多信息](https://developers.openai.com/api/docs/guides/images-vision#low-or-high-fidelity-image-understanding).

## 安全检查

在生产环境启动之前，请查阅并遵循以下安全信息。



### 我们如何评估安全性



微调作业完成后，我们会评估所生成模型在13个不同安全类别中的行为。每个类别都代表一个关键领域，若未妥善控制，AI输出在这些领域可能造成危害。

| 名称                   | 描述                                                                                                                                                                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| advice                 | 违反我们政策的建议或指导。                                                                                                                                                                                                 |
| harassment/threatening | 包含针对任何目标的暴力或严重伤害的骚扰内容。                                                                                                                                                             |
| hate                   | 表达、煽动或宣扬基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓的仇恨的内容。针对非受保护群体（例如棋手）的仇恨内容属于骚扰。 |
| hate/threatening       | 包含针对基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓的目标群体的暴力或严重伤害的仇恨内容。                                               |
| highly-sensitive       | 违反我们政策的高度敏感数据。                                                                                                                                                                                              |
| illicit                | 提供如何实施非法行为建议或指导的内容。像“如何入店行窃”这样的短语就属于此类。                                                                                                               |
| propaganda             | 对违反我们政策的意识形态的赞扬或帮助。                                                                                                                                                                                  |
| self-harm/instructions | 鼓励实施自残行为（如自杀、割伤和饮食失调）的内容，或提供如何实施此类行为的指导或建议的内容。                                                                         |
| self-harm/intent       | 说话者表示自己正在或打算实施自残行为（如自杀、割伤和饮食失调）的内容。                                                                                           |
| 敏感              | 违反我们政策的敏感数据。                                                                                                                                                                                                     |
| 性/未成年人          | 包含未满18岁个人的性内容。                                                                                                                                                                          |
| 性                 | 旨在引起性兴奋的内容，例如性活动描述，或推广性服务（不包括性教育和健康内容）。                                                                                |
| 暴力               | 描绘死亡、暴力或身体伤害的内容。                                                                                                                                                                                      |

每个类别都有预定义的通过阈值；如果某个给定类别中评估失败的示例过多，OpenAI将阻止微调模型部署。如果你的微调模型未通过安全检查，OpenAI会在微调作业中发送一条消息，说明哪些类别未达到所需阈值。你可以在微调作业的审核检查部分查看结果。







### 如何通过安全检查



除查看微调作业对象中任何失败的安全检查之外，你还可以通过查询 [微调 API 事件端点](https://platform.openai.com/docs/api-reference/fine-tuning/list-events)，来检索有关哪些类别失败的详细信息。查找类型为 `moderation_checks` 的事件，以了解类别结果和执行的详细信息。此信息可以帮助你缩小哪些类别需要针对再训练和改进。模型规范 [模型规范](https://cdn.openai.com/spec/model-spec-2024-05-08.html#overview) 包含的规则和示例可以帮助识别需要额外训练数据的领域。

虽然这些评估涵盖广泛的安全类别，但你仍需对微调后的模型进行自己的评估，以确保其适合你的用例。





## 后续步骤

既然你已经掌握了视觉微调的基础知识，不妨也探索其他这些方法。

[监督式微调



      Fine-tune a model by providing correct outputs for sample inputs.](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)

[直接偏好优化



      Fine-tune a model using direct preference optimization (DPO).](https://developers.openai.com/api/docs/guides/direct-preference-optimization)

[强化微调



      Fine-tune a reasoning model by grading its outputs.](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)