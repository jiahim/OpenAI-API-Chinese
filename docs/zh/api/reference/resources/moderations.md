# Moderations

> 完整文档索引请参阅 [llms.txt](/llms.txt). 你可以在页面 URL 末尾追加 `.md` 来获取页面的 Markdown 版本。

## 创建审核

**post** `/moderations`

对文本和/或图像输入是否可能有害进行分类。详细了解请参阅
更多内容请参阅 [审核指南](/docs/guides/moderation).

### 请求体参数

- `input: string or array of string or array of object { image_url, type }  or object { text, type }`

  用于分类的输入（或多个输入）。可以是单个字符串、字符串数组，或
  与其他模型类似的、多模态输入对象的数组。

  - `string`

    一段需要进行审核分类的文本。

  - `array of string`

    需要进行审核分类的字符串数组。

  - `array of object { image_url, type }  or object { text, type }`

    传递给审核模型的多模态输入数组。

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

        需要进行分类的文本字符串。

      - `type: "text"`

        始终为 `text`.

        - `"text"`

- `model: optional string or ModerationModel`

  你想要使用的审核模型。详情请参阅
  [审核指南](/docs/guides/moderation)，并了解
  可用模型 [此处](/docs/models#moderation).

  - `string`

  - `ModerationModel = "omni-moderation-latest" or "omni-moderation-2024-09-26" or "text-moderation-latest" or "text-moderation-stable"`

    - `"omni-moderation-latest"`

    - `"omni-moderation-2024-09-26"`

    - `"text-moderation-latest"`

    - `"text-moderation-stable"`

### Returns

- `id: string`

  审核请求的唯一标识符。

- `model: string`

  用于生成审核结果的模型。

- `results: array of Moderation`

  审核对象的列表。

  - `categories: object { harassment, "harassment/threatening", hate, 10 more }`

    类别列表，以及它们是否被标记。

    - `harassment: boolean`

      针对任何目标表达、煽动或宣扬骚扰性语言的内容。

    - `"harassment/threatening": boolean`

      针对任何目标包含暴力或严重伤害的骚扰内容。

    - `hate: boolean`

      基于种族、性别、民族、宗教、国籍、性取向、残障状况或种姓表达、煽动或宣扬仇恨的内容。针对非受保护群体（例如国际象棋选手）的仇恨内容属于骚扰。

    - `"hate/threatening": boolean`

      针对目标群体的暴力或严重伤害的仇恨内容，基于种族、性别、民族、宗教、国籍、性取向、残障状况或种姓。

    - `illicit: boolean or null`

      包含便于策划或实施违法行为的说明或建议的内容，或提供关于如何实施非法行为的建议或说明。例如，“如何商店行窃”属于此类。

    - `"illicit/violent": boolean or null`

      包含便于策划或实施违法行为的说明或建议（同时涉及暴力），或提供关于采购任何武器的建议或说明的内容。

    - `"self-harm": boolean`

      宣扬、鼓励或描述自残行为（如自杀、自残和进食障碍）的内容。

    - `"self-harm/instructions": boolean`

      鼓励实施自残行为（如自杀、自残和进食障碍），或提供关于如何实施此类行为的说明或建议的内容。

    - `"self-harm/intent": boolean`

      说话者表示正在或打算进行自残行为（如自杀、自残和进食障碍）的内容。

    - `sexual: boolean`

      旨在唤起性兴奋的内容，例如对性行为的描述，或推广性服务的内容（不包括性教育和健康内容）。

    - `"sexual/minors": boolean`

      包含 18 岁以下个人的性内容。

    - `violence: boolean`

      描绘死亡、暴力或人身伤害的内容。

    - `"violence/graphic": boolean`

      以细致图形化方式描绘死亡、暴力或人身伤害的内容。

  - `category_applied_input_types: object { harassment, "harassment/threatening", hate, 10 more }`

    类别列表以及该分数所适用的输入类型。

    - `harassment: array of "text"`

      适用于“harassment”类别的输入类型。

      - `"text"`

    - `"harassment/threatening": array of "text"`

      适用于“harassment/threatening”类别的输入类型。

      - `"text"`

    - `hate: array of "text"`

      类别 'hate' 的已应用输入类型。

      - `"text"`

    - `"hate/threatening": array of "text"`

      类别 'hate/threatening' 的已应用输入类型。

      - `"text"`

    - `illicit: array of "text"`

      类别 'illicit' 的已应用输入类型。

      - `"text"`

    - `"illicit/violent": array of "text"`

      类别 'illicit/violent' 的已应用输入类型。

      - `"text"`

    - `"self-harm": array of "text" or "image"`

      类别 'self-harm' 的已应用输入类型。

      - `"text"`

      - `"image"`

    - `"self-harm/instructions": array of "text" or "image"`

      类别 'self-harm/instructions' 的已应用输入类型。

      - `"text"`

      - `"image"`

    - `"self-harm/intent": array of "text" or "image"`

      类别 'self-harm/intent' 的已应用输入类型。

      - `"text"`

      - `"image"`

    - `sexual: array of "text" or "image"`

      类别 'sexual' 的已应用输入类型。

      - `"text"`

      - `"image"`

    - `"sexual/minors": array of "text"`

      类别 'sexual/minors' 的已应用输入类型。

      - `"text"`

    - `violence: array of "text" or "image"`

      类别 'violence' 的已应用输入类型。

      - `"text"`

      - `"image"`

    - `"violence/graphic": array of "text" or "image"`

      类别 'violence/graphic' 的已应用输入类型。

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

    下列任一类别是否被标记。

### 示例

```http
curl https://api.openai.com/v1/moderations \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "input": "I want to kill them."
        }'
```

#### Response

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

### 图片与文本

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

#### Response

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

#### Response

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

## Domain 类型

### Moderation

- `Moderation object { categories, category_applied_input_types, category_scores, flagged }`

  - `categories: object { harassment, "harassment/threatening", hate, 10 more }`

    类别列表，以及它们是否被标记。

    - `harassment: boolean`

      针对任何目标表达、煽动或宣扬骚扰性语言的内容。

    - `"harassment/threatening": boolean`

      针对任何目标包含暴力或严重伤害的骚扰内容。

    - `hate: boolean`

      基于种族、性别、民族、宗教、国籍、性取向、残障状况或种姓表达、煽动或宣扬仇恨的内容。针对非受保护群体（例如国际象棋选手）的仇恨内容属于骚扰。

    - `"hate/threatening": boolean`

      针对目标群体的暴力或严重伤害的仇恨内容，基于种族、性别、民族、宗教、国籍、性取向、残障状况或种姓。

    - `illicit: boolean or null`

      包含便于策划或实施违法行为的说明或建议的内容，或提供关于如何实施非法行为的建议或说明。例如，“如何商店行窃”属于此类。

    - `"illicit/violent": boolean or null`

      包含便于策划或实施违法行为的说明或建议（同时涉及暴力），或提供关于采购任何武器的建议或说明的内容。

    - `"self-harm": boolean`

      宣扬、鼓励或描述自残行为（如自杀、自残和进食障碍）的内容。

    - `"self-harm/instructions": boolean`

      鼓励实施自残行为（如自杀、自残和进食障碍），或提供关于如何实施此类行为的说明或建议的内容。

    - `"self-harm/intent": boolean`

      说话者表示正在或打算进行自残行为（如自杀、自残和进食障碍）的内容。

    - `sexual: boolean`

      旨在唤起性兴奋的内容，例如对性行为的描述，或推广性服务的内容（不包括性教育和健康内容）。

    - `"sexual/minors": boolean`

      包含 18 岁以下个人的性内容。

    - `violence: boolean`

      描绘死亡、暴力或人身伤害的内容。

    - `"violence/graphic": boolean`

      以细致图形化方式描绘死亡、暴力或人身伤害的内容。

  - `category_applied_input_types: object { harassment, "harassment/threatening", hate, 10 more }`

    类别列表以及该分数所适用的输入类型。

    - `harassment: array of "text"`

      适用于“harassment”类别的输入类型。

      - `"text"`

    - `"harassment/threatening": array of "text"`

      适用于“harassment/threatening”类别的输入类型。

      - `"text"`

    - `hate: array of "text"`

      类别 'hate' 的已应用输入类型。

      - `"text"`

    - `"hate/threatening": array of "text"`

      类别 'hate/threatening' 的已应用输入类型。

      - `"text"`

    - `illicit: array of "text"`

      类别 'illicit' 的已应用输入类型。

      - `"text"`

    - `"illicit/violent": array of "text"`

      类别 'illicit/violent' 的已应用输入类型。

      - `"text"`

    - `"self-harm": array of "text" or "image"`

      类别 'self-harm' 的已应用输入类型。

      - `"text"`

      - `"image"`

    - `"self-harm/instructions": array of "text" or "image"`

      类别 'self-harm/instructions' 的已应用输入类型。

      - `"text"`

      - `"image"`

    - `"self-harm/intent": array of "text" or "image"`

      类别 'self-harm/intent' 的已应用输入类型。

      - `"text"`

      - `"image"`

    - `sexual: array of "text" or "image"`

      类别 'sexual' 的已应用输入类型。

      - `"text"`

      - `"image"`

    - `"sexual/minors": array of "text"`

      类别 'sexual/minors' 的已应用输入类型。

      - `"text"`

    - `violence: array of "text" or "image"`

      类别 'violence' 的已应用输入类型。

      - `"text"`

      - `"image"`

    - `"violence/graphic": array of "text" or "image"`

      类别 'violence/graphic' 的已应用输入类型。

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

    下列任一类别是否被标记。

### Moderation 创建 Response

- `ModerationCreateResponse object { id, model, results }`

  表示给定文本输入是否具有潜在危害性。

  - `id: string`

    审核请求的唯一标识符。

  - `model: string`

    用于生成审核结果的模型。

  - `results: array of Moderation`

    审核对象的列表。

    - `categories: object { harassment, "harassment/threatening", hate, 10 more }`

      类别列表，以及它们是否被标记。

      - `harassment: boolean`

        针对任何目标表达、煽动或宣扬骚扰性语言的内容。

      - `"harassment/threatening": boolean`

        针对任何目标包含暴力或严重伤害的骚扰内容。

      - `hate: boolean`

        基于种族、性别、民族、宗教、国籍、性取向、残障状况或种姓表达、煽动或宣扬仇恨的内容。针对非受保护群体（例如国际象棋选手）的仇恨内容属于骚扰。

      - `"hate/threatening": boolean`

        针对目标群体的暴力或严重伤害的仇恨内容，基于种族、性别、民族、宗教、国籍、性取向、残障状况或种姓。

      - `illicit: boolean or null`

        包含便于策划或实施违法行为的说明或建议的内容，或提供关于如何实施非法行为的建议或说明。例如，“如何商店行窃”属于此类。

      - `"illicit/violent": boolean or null`

        包含便于策划或实施违法行为的说明或建议（同时涉及暴力），或提供关于采购任何武器的建议或说明的内容。

      - `"self-harm": boolean`

        宣扬、鼓励或描述自残行为（如自杀、自残和进食障碍）的内容。

      - `"self-harm/instructions": boolean`

        鼓励实施自残行为（如自杀、自残和进食障碍），或提供关于如何实施此类行为的说明或建议的内容。

      - `"self-harm/intent": boolean`

        说话者表示正在或打算进行自残行为（如自杀、自残和进食障碍）的内容。

      - `sexual: boolean`

        旨在唤起性兴奋的内容，例如对性行为的描述，或推广性服务的内容（不包括性教育和健康内容）。

      - `"sexual/minors": boolean`

        包含 18 岁以下个人的性内容。

      - `violence: boolean`

        描绘死亡、暴力或人身伤害的内容。

      - `"violence/graphic": boolean`

        以细致图形化方式描绘死亡、暴力或人身伤害的内容。

    - `category_applied_input_types: object { harassment, "harassment/threatening", hate, 10 more }`

      类别列表以及该分数所适用的输入类型。

      - `harassment: array of "text"`

        适用于“harassment”类别的输入类型。

        - `"text"`

      - `"harassment/threatening": array of "text"`

        适用于“harassment/threatening”类别的输入类型。

        - `"text"`

      - `hate: array of "text"`

        类别 'hate' 的已应用输入类型。

        - `"text"`

      - `"hate/threatening": array of "text"`

        类别 'hate/threatening' 的已应用输入类型。

        - `"text"`

      - `illicit: array of "text"`

        类别 'illicit' 的已应用输入类型。

        - `"text"`

      - `"illicit/violent": array of "text"`

        类别 'illicit/violent' 的已应用输入类型。

        - `"text"`

      - `"self-harm": array of "text" or "image"`

        类别 'self-harm' 的已应用输入类型。

        - `"text"`

        - `"image"`

      - `"self-harm/instructions": array of "text" or "image"`

        类别 'self-harm/instructions' 的已应用输入类型。

        - `"text"`

        - `"image"`

      - `"self-harm/intent": array of "text" or "image"`

        类别 'self-harm/intent' 的已应用输入类型。

        - `"text"`

        - `"image"`

      - `sexual: array of "text" or "image"`

        类别 'sexual' 的已应用输入类型。

        - `"text"`

        - `"image"`

      - `"sexual/minors": array of "text"`

        类别 'sexual/minors' 的已应用输入类型。

        - `"text"`

      - `violence: array of "text" or "image"`

        类别 'violence' 的已应用输入类型。

        - `"text"`

        - `"image"`

      - `"violence/graphic": array of "text" or "image"`

        类别 'violence/graphic' 的已应用输入类型。

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

      下列任一类别是否被标记。

### 审核模型

- `ModerationModel = "omni-moderation-latest" or "omni-moderation-2024-09-26" or "text-moderation-latest" or "text-moderation-stable"`

  - `"omni-moderation-latest"`

  - `"omni-moderation-2024-09-26"`

  - `"text-moderation-latest"`

  - `"text-moderation-stable"`
