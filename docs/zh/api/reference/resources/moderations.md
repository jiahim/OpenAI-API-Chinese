# Moderations

> 查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取相应页面的 Markdown 版本。

## 创建审核

**post** `/moderations`

分类判断文本和/或图像输入是否具有潜在危害。在
moderation guide [审核指南](/api/docs/guides/moderation).

### 请求体参数

- `input: string or array of string or array of object { image_url, type }  or object { text, type }`

  用于分类的输入（可以是一个或多个）。可以是单个字符串、字符串数组，或
  与其他模型类似的多模态输入对象数组。

  - `string`

    需要进行审核分类的文本字符串。

  - `array of string`

    需要进行审核分类的字符串数组。

  - `array of object { image_url, type }  or object { text, type }`

    传递给审核模型的多模态输入数组。

    - `ImageURL object { image_url, type }`

      描述待分类图像的对象。

      - `image_url: object { url }`

        包含图像的 URL 或 base64 编码图像的 data URL。

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

  你想要使用的内容审核模型。可在
  [审核指南](/api/docs/guides/moderation)，中了解更多，并了解
  可用模型 [此处](/api/docs/guides/moderation).

  - `string`

  - `ModerationModel = "omni-moderation-latest" or "omni-moderation-2024-09-26" or "text-moderation-latest" or "text-moderation-stable"`

    - `"omni-moderation-latest"`

    - `"omni-moderation-2024-09-26"`

    - `"text-moderation-latest"`

    - `"text-moderation-stable"`

### 返回值

- `id: string`

  审核请求的唯一标识符。

- `model: string`

  用于生成审核结果的模型。

- `results: array of Moderation`

  审核对象的列表。

  - `categories: object { harassment, "harassment/threatening", hate, 10 more }`

    类别及其是否被标记的列表。

    - `harassment: boolean`

      表达、煽动或推广针对任何目标的骚扰性语言的内容。

    - `"harassment/threatening": boolean`

      同时包含针对任何目标的暴力或严重伤害的骚扰内容。

    - `hate: boolean`

      基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓表达、煽动或推广仇恨的内容。针对非受保护群体（例如，国际象棋棋手）的仇恨内容属于骚扰。

    - `"hate/threatening": boolean`

      同时包含针对基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓的目标群体的暴力或严重伤害的仇恨内容。

    - `illicit: boolean or null`

      包含有助于规划或实施违法行为的指示或建议的内容，或就如何实施非法行为提供建议或指示的内容。例如，“如何在商店行窃”属于此类别。

    - `"illicit/violent": boolean or null`

      包含有助于规划或实施同时涉及暴力的违法行为的指示或建议的内容，或就获取任何武器提供建议或指示的内容。

    - `"self-harm": boolean`

      推广、鼓励或描述自残行为（如自杀、自残和饮食失调）的内容。

    - `"self-harm/instructions": boolean`

      鼓励实施自残行为（如自杀、自残和饮食失调），或就如何实施此类行为提供指示或建议的内容。

    - `"self-harm/intent": boolean`

      说话者表示其正在或打算实施自残行为（如自杀、自残和饮食失调）的内容。

    - `sexual: boolean`

      旨在唤起性兴奋的内容，例如对性行为的描述，或推广性服务的内容（不包括性教育和健康内容）。

    - `"sexual/minors": boolean`

      包含未满 18 岁个人的性内容。

    - `violence: boolean`

      描述死亡、暴力或人身伤害的内容。

    - `"violence/graphic": boolean`

      以生动的细节描述死亡、暴力或人身伤害的内容。

  - `category_applied_input_types: object { harassment, "harassment/threatening", hate, 10 more }`

    类别及其分数所适用的输入类型的列表。

    - `harassment: array of "text"`

      类别“harassment”所适用的输入类型。

      - `"text"`

    - `"harassment/threatening": array of "text"`

      类别“harassment/threatening”所适用的输入类型。

      - `"text"`

    - `hate: array of "text"`

      针对类别 'hate' 应用的输入类型。

      - `"text"`

    - `"hate/threatening": array of "text"`

      针对类别 'hate/threatening' 应用的输入类型。

      - `"text"`

    - `illicit: array of "text"`

      针对类别 'illicit' 应用的输入类型。

      - `"text"`

    - `"illicit/violent": array of "text"`

      针对类别 'illicit/violent' 应用的输入类型。

      - `"text"`

    - `"self-harm": array of "text" or "image"`

      针对类别 'self-harm' 应用的输入类型。

      - `"text"`

      - `"image"`

    - `"self-harm/instructions": array of "text" or "image"`

      针对类别 'self-harm/instructions' 应用的输入类型。

      - `"text"`

      - `"image"`

    - `"self-harm/intent": array of "text" or "image"`

      针对类别 'self-harm/intent' 应用的输入类型。

      - `"text"`

      - `"image"`

    - `sexual: array of "text" or "image"`

      针对类别 'sexual' 应用的输入类型。

      - `"text"`

      - `"image"`

    - `"sexual/minors": array of "text"`

      针对类别 'sexual/minors' 应用的输入类型。

      - `"text"`

    - `violence: array of "text" or "image"`

      针对类别 'violence' 应用的输入类型。

      - `"text"`

      - `"image"`

    - `"violence/graphic": array of "text" or "image"`

      针对类别 'violence/graphic' 应用的输入类型。

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

      类别 'self-harm/intent' 的分数。

    - `sexual: number`

      类别 'sexual' 的分数。

    - `"sexual/minors": number`

      类别 'sexual/minors' 的分数。

    - `violence: number`

      类别 'violence' 的分数。

    - `"violence/graphic": number`

      类别 'violence/graphic' 的分数。

  - `flagged: boolean`

    下面的任意类别是否被标记。

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

### 图像与文本

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

## 域类型

### 审核

- `Moderation object { categories, category_applied_input_types, category_scores, flagged }`

  - `categories: object { harassment, "harassment/threatening", hate, 10 more }`

    类别及其是否被标记的列表。

    - `harassment: boolean`

      表达、煽动或推广针对任何目标的骚扰性语言的内容。

    - `"harassment/threatening": boolean`

      同时包含针对任何目标的暴力或严重伤害的骚扰内容。

    - `hate: boolean`

      基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓表达、煽动或推广仇恨的内容。针对非受保护群体（例如，国际象棋棋手）的仇恨内容属于骚扰。

    - `"hate/threatening": boolean`

      同时包含针对基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓的目标群体的暴力或严重伤害的仇恨内容。

    - `illicit: boolean or null`

      包含有助于规划或实施违法行为的指示或建议的内容，或就如何实施非法行为提供建议或指示的内容。例如，“如何在商店行窃”属于此类别。

    - `"illicit/violent": boolean or null`

      包含有助于规划或实施同时涉及暴力的违法行为的指示或建议的内容，或就获取任何武器提供建议或指示的内容。

    - `"self-harm": boolean`

      推广、鼓励或描述自残行为（如自杀、自残和饮食失调）的内容。

    - `"self-harm/instructions": boolean`

      鼓励实施自残行为（如自杀、自残和饮食失调），或就如何实施此类行为提供指示或建议的内容。

    - `"self-harm/intent": boolean`

      说话者表示其正在或打算实施自残行为（如自杀、自残和饮食失调）的内容。

    - `sexual: boolean`

      旨在唤起性兴奋的内容，例如对性行为的描述，或推广性服务的内容（不包括性教育和健康内容）。

    - `"sexual/minors": boolean`

      包含未满 18 岁个人的性内容。

    - `violence: boolean`

      描述死亡、暴力或人身伤害的内容。

    - `"violence/graphic": boolean`

      以生动的细节描述死亡、暴力或人身伤害的内容。

  - `category_applied_input_types: object { harassment, "harassment/threatening", hate, 10 more }`

    类别及其分数所适用的输入类型的列表。

    - `harassment: array of "text"`

      类别“harassment”所适用的输入类型。

      - `"text"`

    - `"harassment/threatening": array of "text"`

      类别“harassment/threatening”所适用的输入类型。

      - `"text"`

    - `hate: array of "text"`

      针对类别 'hate' 应用的输入类型。

      - `"text"`

    - `"hate/threatening": array of "text"`

      针对类别 'hate/threatening' 应用的输入类型。

      - `"text"`

    - `illicit: array of "text"`

      针对类别 'illicit' 应用的输入类型。

      - `"text"`

    - `"illicit/violent": array of "text"`

      针对类别 'illicit/violent' 应用的输入类型。

      - `"text"`

    - `"self-harm": array of "text" or "image"`

      针对类别 'self-harm' 应用的输入类型。

      - `"text"`

      - `"image"`

    - `"self-harm/instructions": array of "text" or "image"`

      针对类别 'self-harm/instructions' 应用的输入类型。

      - `"text"`

      - `"image"`

    - `"self-harm/intent": array of "text" or "image"`

      针对类别 'self-harm/intent' 应用的输入类型。

      - `"text"`

      - `"image"`

    - `sexual: array of "text" or "image"`

      针对类别 'sexual' 应用的输入类型。

      - `"text"`

      - `"image"`

    - `"sexual/minors": array of "text"`

      针对类别 'sexual/minors' 应用的输入类型。

      - `"text"`

    - `violence: array of "text" or "image"`

      针对类别 'violence' 应用的输入类型。

      - `"text"`

      - `"image"`

    - `"violence/graphic": array of "text" or "image"`

      针对类别 'violence/graphic' 应用的输入类型。

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

      类别 'self-harm/intent' 的分数。

    - `sexual: number`

      类别 'sexual' 的分数。

    - `"sexual/minors": number`

      类别 'sexual/minors' 的分数。

    - `violence: number`

      类别 'violence' 的分数。

    - `"violence/graphic": number`

      类别 'violence/graphic' 的分数。

  - `flagged: boolean`

    下面的任意类别是否被标记。

### Moderation Create Response

- `ModerationCreateResponse object { id, model, results }`

  表示给定的文本输入是否可能有害。

  - `id: string`

    审核请求的唯一标识符。

  - `model: string`

    用于生成审核结果的模型。

  - `results: array of Moderation`

    审核对象的列表。

    - `categories: object { harassment, "harassment/threatening", hate, 10 more }`

      类别及其是否被标记的列表。

      - `harassment: boolean`

        表达、煽动或推广针对任何目标的骚扰性语言的内容。

      - `"harassment/threatening": boolean`

        同时包含针对任何目标的暴力或严重伤害的骚扰内容。

      - `hate: boolean`

        基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓表达、煽动或推广仇恨的内容。针对非受保护群体（例如，国际象棋棋手）的仇恨内容属于骚扰。

      - `"hate/threatening": boolean`

        同时包含针对基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓的目标群体的暴力或严重伤害的仇恨内容。

      - `illicit: boolean or null`

        包含有助于规划或实施违法行为的指示或建议的内容，或就如何实施非法行为提供建议或指示的内容。例如，“如何在商店行窃”属于此类别。

      - `"illicit/violent": boolean or null`

        包含有助于规划或实施同时涉及暴力的违法行为的指示或建议的内容，或就获取任何武器提供建议或指示的内容。

      - `"self-harm": boolean`

        推广、鼓励或描述自残行为（如自杀、自残和饮食失调）的内容。

      - `"self-harm/instructions": boolean`

        鼓励实施自残行为（如自杀、自残和饮食失调），或就如何实施此类行为提供指示或建议的内容。

      - `"self-harm/intent": boolean`

        说话者表示其正在或打算实施自残行为（如自杀、自残和饮食失调）的内容。

      - `sexual: boolean`

        旨在唤起性兴奋的内容，例如对性行为的描述，或推广性服务的内容（不包括性教育和健康内容）。

      - `"sexual/minors": boolean`

        包含未满 18 岁个人的性内容。

      - `violence: boolean`

        描述死亡、暴力或人身伤害的内容。

      - `"violence/graphic": boolean`

        以生动的细节描述死亡、暴力或人身伤害的内容。

    - `category_applied_input_types: object { harassment, "harassment/threatening", hate, 10 more }`

      类别及其分数所适用的输入类型的列表。

      - `harassment: array of "text"`

        类别“harassment”所适用的输入类型。

        - `"text"`

      - `"harassment/threatening": array of "text"`

        类别“harassment/threatening”所适用的输入类型。

        - `"text"`

      - `hate: array of "text"`

        针对类别 'hate' 应用的输入类型。

        - `"text"`

      - `"hate/threatening": array of "text"`

        针对类别 'hate/threatening' 应用的输入类型。

        - `"text"`

      - `illicit: array of "text"`

        针对类别 'illicit' 应用的输入类型。

        - `"text"`

      - `"illicit/violent": array of "text"`

        针对类别 'illicit/violent' 应用的输入类型。

        - `"text"`

      - `"self-harm": array of "text" or "image"`

        针对类别 'self-harm' 应用的输入类型。

        - `"text"`

        - `"image"`

      - `"self-harm/instructions": array of "text" or "image"`

        针对类别 'self-harm/instructions' 应用的输入类型。

        - `"text"`

        - `"image"`

      - `"self-harm/intent": array of "text" or "image"`

        针对类别 'self-harm/intent' 应用的输入类型。

        - `"text"`

        - `"image"`

      - `sexual: array of "text" or "image"`

        针对类别 'sexual' 应用的输入类型。

        - `"text"`

        - `"image"`

      - `"sexual/minors": array of "text"`

        针对类别 'sexual/minors' 应用的输入类型。

        - `"text"`

      - `violence: array of "text" or "image"`

        针对类别 'violence' 应用的输入类型。

        - `"text"`

        - `"image"`

      - `"violence/graphic": array of "text" or "image"`

        针对类别 'violence/graphic' 应用的输入类型。

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

        类别 'self-harm/intent' 的分数。

      - `sexual: number`

        类别 'sexual' 的分数。

      - `"sexual/minors": number`

        类别 'sexual/minors' 的分数。

      - `violence: number`

        类别 'violence' 的分数。

      - `"violence/graphic": number`

        类别 'violence/graphic' 的分数。

    - `flagged: boolean`

      下面的任意类别是否被标记。

### Moderation Model

- `ModerationModel = "omni-moderation-latest" or "omni-moderation-2024-09-26" or "text-moderation-latest" or "text-moderation-stable"`

  - `"omni-moderation-latest"`

  - `"omni-moderation-2024-09-26"`

  - `"text-moderation-latest"`

  - `"text-moderation-stable"`
