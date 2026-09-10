> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 获取文档页面的 Markdown 版本。

## 创建审核

**post** `/moderations`

Classifies if text and/or image inputs are potentially harmful. Learn
more in the [moderation guide](/api/docs/guides/moderation).

### 请求体参数

- `input: string or array of string or array of object { image_url, type }  or object { text, type }`

  用于分类的输入（或多个输入）。可以是单个字符串、字符串数组，或
  与其他模型类似的多模态输入对象数组。

  - `string`

    用于内容审核分类的文本字符串。

  - `array of string`

    用于内容审核分类的字符串数组。

  - `array of object { image_url, type }  or object { text, type }`

    输入审核模型的多模态输入数组。

    - `ImageURL object { image_url, type }`

      描述待分类图像的对象。

      - `image_url: object { url }`

        包含图像 URL 或 base64 编码图像的 data URL。

        - `url: string`

          图像的 URL 或 base64 编码的图像数据。

      - `type: "image_url"`

        始终为 `image_url`.

        - `"image_url"`

    - `Text object { text, type }`

      描述待分类文本的对象。

      - `text: string`

        用于分类的文本字符串。

      - `type: "text"`

        始终为 `text`.

        - `"text"`

- `model: optional string or ModerationModel`

  希望使用的内容审核模型。详情请参阅
  [审核指南](/api/docs/guides/moderation)，并了解
  可用模型 [此处](/api/docs/guides/moderation).

  - `string`

  - `ModerationModel = "omni-moderation-latest" or "omni-moderation-2024-09-26" or "text-moderation-latest" or "text-moderation-stable"`

    - `"omni-moderation-latest"`

    - `"omni-moderation-2024-09-26"`

    - `"text-moderation-latest"`

    - `"text-moderation-stable"`

### 返回值

- `id: string`

  该审核请求的唯一标识符。

- `model: string`

  用于生成审核结果的模型。

- `results: array of Moderation`

  审核对象的列表。

  - `categories: object { harassment, "harassment/threatening", hate, 10 more }`

    类别及其是否被标记的列表。

    - `harassment: boolean`

      针对任何目标表达、煽动或宣扬骚扰性语言的内容。

    - `"harassment/threatening": boolean`

      针对任何目标包含暴力或严重伤害的骚扰内容。

    - `hate: boolean`

      基于种族、性别、族裔、宗教、国籍、性取向、残障状况或种姓而表达、煽动或宣扬仇恨的内容。针对非受保护群体（例如国际象棋棋手）的仇恨内容属于骚扰。

    - `"hate/threatening": boolean`

      基于种族、性别、族裔、宗教、国籍、性取向、残障状况或种姓，针对目标群体同时包含暴力或严重伤害的仇恨内容。

    - `illicit: boolean or null`

      包含有助于策划或实施不法行为的指导或建议的内容，或提供关于如何实施违法行为的指导或建议的内容。例如，“如何入店行窃”就属于此类。

    - `"illicit/violent": boolean or null`

      包含有助于策划或实施同时涉及暴力的不法行为的指导或建议的内容，或提供关于获取任何武器的指导或建议的内容。

    - `"self-harm": boolean`

      宣扬、鼓励或描绘自我伤害行为（例如自杀、自残和饮食失调）的内容。

    - `"self-harm/instructions": boolean`

      鼓励实施自我伤害行为（例如自杀、自残和饮食失调），或提供关于如何实施此类行为的指导或建议的内容。

    - `"self-harm/intent": boolean`

      说话者表示正在或意图实施自我伤害行为（例如自杀、自残和饮食失调）的内容。

    - `sexual: boolean`

      旨在唤起性兴奋的内容，例如对性行为的描述，或推广性服务的内容（不包括性教育和健康内容）。

    - `"sexual/minors": boolean`

      包含未满 18 岁未成年人的性内容。

    - `violence: boolean`

      描绘死亡、暴力或人身伤害的内容。

    - `"violence/graphic": boolean`

      以详细且生动的细节描绘死亡、暴力或人身伤害的内容。

  - `category_applied_input_types: object { harassment, "harassment/threatening", hate, 10 more }`

    类别及其分数所适用的输入类型列表。

    - `harassment: array of "text"`

      “harassment”类别所适用的输入类型。

      - `"text"`

    - `"harassment/threatening": array of "text"`

      “harassment/threatening”类别所适用的输入类型。

      - `"text"`

    - `hate: array of "text"`

      类别 'hate' 所应用的输入类型。

      - `"text"`

    - `"hate/threatening": array of "text"`

      类别 'hate/threatening' 所应用的输入类型。

      - `"text"`

    - `illicit: array of "text"`

      类别 'illicit' 所应用的输入类型。

      - `"text"`

    - `"illicit/violent": array of "text"`

      类别 'illicit/violent' 所应用的输入类型。

      - `"text"`

    - `"self-harm": array of "text" or "image"`

      类别 'self-harm' 所应用的输入类型。

      - `"text"`

      - `"image"`

    - `"self-harm/instructions": array of "text" or "image"`

      类别 'self-harm/instructions' 所应用的输入类型。

      - `"text"`

      - `"image"`

    - `"self-harm/intent": array of "text" or "image"`

      类别 'self-harm/intent' 所应用的输入类型。

      - `"text"`

      - `"image"`

    - `sexual: array of "text" or "image"`

      类别 'sexual' 所应用的输入类型。

      - `"text"`

      - `"image"`

    - `"sexual/minors": array of "text"`

      类别 'sexual/minors' 所应用的输入类型。

      - `"text"`

    - `violence: array of "text" or "image"`

      类别 'violence' 所应用的输入类型。

      - `"text"`

      - `"image"`

    - `"violence/graphic": array of "text" or "image"`

      类别 'violence/graphic' 所应用的输入类型。

      - `"text"`

      - `"image"`

  - `category_scores: object { harassment, "harassment/threatening", hate, 10 more }`

    由模型预测的类别及其对应分数的列表。

    - `harassment: number`

      类别 'harassment' 的分数。

    - `"harassment/threatening": number`

      类别 'harassment/threatening' 的分数。

    - `hate: number`

      类别 'hate' 的分数。

    - `"hate/threatening": number`

      类别 'hate/threatening' 的分数。

    - `illicit: number`

      类别 'illicit' 的分数。

    - `"illicit/violent": number`

      类别 'illicit/violent' 的分数。

    - `"self-harm": number`

      类别 'self-harm' 的分数。

    - `"self-harm/instructions": number`

      类别 'self-harm/instructions' 的分数。

    - `"self-harm/intent": number`

      类别“self-harm/intent”的得分。

    - `sexual: number`

      类别“sexual”的得分。

    - `"sexual/minors": number`

      类别“sexual/minors”的得分。

    - `violence: number`

      类别“violence”的得分。

    - `"violence/graphic": number`

      类别“violence/graphic”的得分。

  - `flagged: boolean`

    以下任意类别是否被标记。

### 示例

```http
curl https://api.openai.com/v1/moderations \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "input": "I want to kill them."
        }'
```

#### 响应

```json
{
  "id": "id",
  "model": "model",
  "results": [
    {
      "categories": {
        "harassment": true,
        "harassment/threatening": true,
        "hate": true,
        "hate/threatening": true,
        "illicit": true,
        "illicit/violent": true,
        "self-harm": true,
        "self-harm/instructions": true,
        "self-harm/intent": true,
        "sexual": true,
        "sexual/minors": true,
        "violence": true,
        "violence/graphic": true
      },
      "category_applied_input_types": {
        "harassment": [
          "text"
        ],
        "harassment/threatening": [
          "text"
        ],
        "hate": [
          "text"
        ],
        "hate/threatening": [
          "text"
        ],
        "illicit": [
          "text"
        ],
        "illicit/violent": [
          "text"
        ],
        "self-harm": [
          "text"
        ],
        "self-harm/instructions": [
          "text"
        ],
        "self-harm/intent": [
          "text"
        ],
        "sexual": [
          "text"
        ],
        "sexual/minors": [
          "text"
        ],
        "violence": [
          "text"
        ],
        "violence/graphic": [
          "text"
        ]
      },
      "category_scores": {
        "harassment": 0,
        "harassment/threatening": 0,
        "hate": 0,
        "hate/threatening": 0,
        "illicit": 0,
        "illicit/violent": 0,
        "self-harm": 0,
        "self-harm/instructions": 0,
        "self-harm/intent": 0,
        "sexual": 0,
        "sexual/minors": 0,
        "violence": 0,
        "violence/graphic": 0
      },
      "flagged": true
    }
  ]
}
```

### 图像和文本

```http
curl https://api.openai.com/v1/moderations \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "omni-moderation-latest",
    "input": [
      { "type": "text", "text": "...text to classify goes here..." },
      {
        "type": "image_url",
        "image_url": {
          "url": "https://example.com/image.png"
        }
      }
    ]
  }'
```

#### 响应

```json
{
  "id": "modr-0d9740456c391e43c445bf0f010940c7",
  "model": "omni-moderation-latest",
  "results": [
    {
      "flagged": true,
      "categories": {
        "harassment": true,
        "harassment/threatening": true,
        "sexual": false,
        "hate": false,
        "hate/threatening": false,
        "illicit": false,
        "illicit/violent": false,
        "self-harm/intent": false,
        "self-harm/instructions": false,
        "self-harm": false,
        "sexual/minors": false,
        "violence": true,
        "violence/graphic": true
      },
      "category_scores": {
        "harassment": 0.8189693396524255,
        "harassment/threatening": 0.804985420696006,
        "sexual": 1.573112165348997e-6,
        "hate": 0.007562942636942845,
        "hate/threatening": 0.004208854591835476,
        "illicit": 0.030535955153511665,
        "illicit/violent": 0.008925306722380033,
        "self-harm/intent": 0.00023023930975076432,
        "self-harm/instructions": 0.0002293869201073356,
        "self-harm": 0.012598046106750154,
        "sexual/minors": 2.212566909570261e-8,
        "violence": 0.9999992735124786,
        "violence/graphic": 0.843064871157054
      },
      "category_applied_input_types": {
        "harassment": [
          "text"
        ],
        "harassment/threatening": [
          "text"
        ],
        "sexual": [
          "text",
          "image"
        ],
        "hate": [
          "text"
        ],
        "hate/threatening": [
          "text"
        ],
        "illicit": [
          "text"
        ],
        "illicit/violent": [
          "text"
        ],
        "self-harm/intent": [
          "text",
          "image"
        ],
        "self-harm/instructions": [
          "text",
          "image"
        ],
        "self-harm": [
          "text",
          "image"
        ],
        "sexual/minors": [
          "text"
        ],
        "violence": [
          "text",
          "image"
        ],
        "violence/graphic": [
          "text",
          "image"
        ]
      }
    }
  ]
}
```

### 单个字符串

```http
curl https://api.openai.com/v1/moderations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "input": "I want to kill them."
  }'
```

#### 响应

```json
{
  "id": "modr-AB8CjOTu2jiq12hp1AQPfeqFWaORR",
  "model": "text-moderation-007",
  "results": [
    {
      "flagged": true,
      "categories": {
        "sexual": false,
        "hate": false,
        "harassment": true,
        "self-harm": false,
        "sexual/minors": false,
        "hate/threatening": false,
        "violence/graphic": false,
        "self-harm/intent": false,
        "self-harm/instructions": false,
        "harassment/threatening": true,
        "violence": true
      },
      "category_scores": {
        "sexual": 0.000011726012417057063,
        "hate": 0.22706663608551025,
        "harassment": 0.5215635299682617,
        "self-harm": 2.227119921371923e-6,
        "sexual/minors": 7.107352217872176e-8,
        "hate/threatening": 0.023547329008579254,
        "violence/graphic": 0.00003391829886822961,
        "self-harm/intent": 1.646940972932498e-6,
        "self-harm/instructions": 1.1198755256458526e-9,
        "harassment/threatening": 0.5694745779037476,
        "violence": 0.9971134662628174
      }
    }
  ]
}
```
