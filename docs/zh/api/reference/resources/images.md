# 图像

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 获取文档页面的 Markdown 版本。

## 创建图像变体

**post** `/images/variations`

此端点已弃用，无法再使用。请使用 image edits 端点配合 GPT Image 模型和提示词来创建图像变体。下面的请求和响应模式描述的是旧版契约。

### 返回值

- `ImagesResponse object { created, background, data, 4 more }`

  图像生成端点的响应。

  - `created: number`

    图像创建时间的 Unix 时间戳（单位：秒）。

  - `background: optional "transparent" or "opaque"`

    用于图像生成的 background 参数。取值为 `transparent` 或 `opaque`.

    - `"transparent"`

    - `"opaque"`

  - `data: optional array of Image`

    生成的图像列表。

    - `b64_json: optional string`

      生成图像的 base64 编码 JSON。GPT 图像模型默认返回此字段，或当 `response_format` 设置为 `b64_json` 时也会返回（仅限支持该参数的模型）。

    - `revised_prompt: optional string`

      用于生成图像的修订后提示词，适用于支持提示词修订的模型。GPT 图像模型不返回此字段。

    - `url: optional string`

      生成图像的 URL，当 `response_format` 设置为 `url` 时返回（仅限支持该参数的模型）。GPT 图像模型不支持此字段。

  - `output_format: optional "png" or "webp" or "jpeg"`

    图像生成的输出格式。取值为 `png`, `webp`、或 `jpeg`.

    - `"png"`

    - `"webp"`

    - `"jpeg"`

  - `quality: optional "low" or "medium" or "high" or 2 more`

    生成图像的质量。取值为 `low`, `medium`, `high`, `xhigh`、或 `max`.

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

    - `"max"`

  - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024"`

    以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

    - `string`

    - `"1024x1024" or "1024x1536" or "1536x1024"`

      以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

      - `"1024x1024"`

      - `"1024x1536"`

      - `"1536x1024"`

  - `usage: optional object { input_tokens, input_tokens_details, output_tokens, 2 more }`

    对于 `gpt-image-1` ，表示图像生成的令牌使用信息。

    - `input_tokens: number`

      输入提示词中的令牌（图像和文本）数量。

    - `input_tokens_details: object { image_tokens, text_tokens }`

      图像生成的输入令牌的详细信息。

      - `image_tokens: number`

        输入提示中的图像 token 数。

      - `text_tokens: number`

        输入提示中的文本 token 数。

    - `output_tokens: number`

      模型生成的输出 token 数。

    - `total_tokens: number`

      用于图像生成的总 token 数（图像和文本）。

    - `output_tokens_details: optional object { image_tokens, text_tokens }`

      图像生成的输出 token 详情。

      - `image_tokens: number`

        模型生成的图像输出 token 数。

      - `text_tokens: number`

        模型生成的文本输出 token 数。

### 示例

```http
curl https://api.openai.com/v1/images/variations \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'image=@/path/to/image' \
    -F n=1 \
    -F response_format=url \
    -F size=1024x1024 \
    -F user=user-1234
```

#### 响应

```json
{
  "created": 0,
  "background": "transparent",
  "data": [
    {
      "b64_json": "b64_json",
      "revised_prompt": "revised_prompt",
      "url": "https://example.com"
    }
  ],
  "output_format": "png",
  "quality": "low",
  "size": "1024x1024",
  "usage": {
    "input_tokens": 0,
    "input_tokens_details": {
      "image_tokens": 0,
      "text_tokens": 0
    },
    "output_tokens": 0,
    "total_tokens": 0,
    "output_tokens_details": {
      "image_tokens": 0,
      "text_tokens": 0
    }
  }
}
```

### 示例

```http
curl https://api.openai.com/v1/images/variations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F image="@otter.png" \
  -F n=2 \
  -F size="1024x1024"
```

#### 响应

```json
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://..."
    },
    {
      "url": "https://..."
    }
  ]
}
```

## 创建图片编辑

**post** `/images/edits`

根据一个或多个源图像和提示词创建编辑或扩展后的图像。此接口支持 GPT Image 模型。

### Body 参数

- `images: array of object { file_id, image_url }`

  用于编辑的输入图像引用。
  对于 GPT 图像模型，你最多可以提供 16 张图像。

  - `file_id: optional string`

    用作输入的上传图像的 File API ID。

  - `image_url: optional string`

    完整的 URL 或 base64 编码的数据 URL。

- `prompt: string`

  对期望的图像编辑的文字描述。

- `background: optional "transparent" or "opaque" or "auto" or null`

  设置生成图像输出的背景。 `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括它们的 `2026-09-08` 快照，支持 `opaque` 和 `transparent` 背景。支持的部分 GPT Image 模型可使用透明背景。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，该支持目前处于预览阶段。使用 `transparent`，时，将输出格式设置为 `png` 或 `webp`.

  - `"transparent"`

  - `"opaque"`

  - `"auto"`

- `input_fidelity: optional "high" or "low" or null`

  控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所投入的精力。支持 `high` 和 `low` 为 `gpt-image-1` 和 `gpt-image-1.5`; `gpt-image-1-mini` 仅支持 `low`。对于 `gpt-image-2`，请省略此参数。在受支持的模型上默认为 `low` 。

  - `"high"`

  - `"low"`

- `mask: optional object { file_id, image_url }`

  通过 URL 或上传的文件 ID 引用输入图像。
  在以下项中提供且仅提供一项： `image_url` 或 `file_id`.

  - `file_id: optional string`

    用作输入的上传图像的 File API ID。

  - `image_url: optional string`

    完整的 URL 或 base64 编码的数据 URL。

- `model: optional string or "gpt-image-1.5" or "gpt-image-2" or "gpt-image-2-2026-04-21" or 7 more or null`

  用于图像编辑的 GPT 图像模型，包括 `gpt-image-2`，其带日期的快照版本 `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`。默认为 `gpt-image-2.5-sunburst`.

  - `string`

  - `"gpt-image-1.5" or "gpt-image-2" or "gpt-image-2-2026-04-21" or 7 more`

    用于图像编辑的 GPT 图像模型，包括 `gpt-image-2`，其带日期的快照版本 `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`。默认为 `gpt-image-2.5-sunburst`.

    - `"gpt-image-1.5"`

    - `"gpt-image-2"`

    - `"gpt-image-2-2026-04-21"`

    - `"gpt-image-2.5-sunburst"`

    - `"gpt-image-2.5-sunburst-2026-09-08"`

    - `"gpt-image-2.5-flare"`

    - `"gpt-image-2.5-flare-2026-09-08"`

    - `"gpt-image-1"`

    - `"gpt-image-1-mini"`

    - `"chatgpt-image-latest"`

- `moderation: optional "low" or "auto" or null`

  GPT 图像模型的内容审核级别。

  - `"low"`

  - `"auto"`

- `n: optional number or null`

  要生成的编辑图像数量。

- `output_compression: optional number or null`

  压缩级别，用于 `jpeg` 或 `webp` 输出。

- `output_format: optional "png" or "jpeg" or "webp" or null`

  输出图像格式。GPT 图像模型支持该参数。

  - `"png"`

  - `"jpeg"`

  - `"webp"`

- `partial_images: optional number or null`

  要生成的局部图像数量。此参数用于
  返回局部图像的流式响应。取值必须在 0 到 3 之间。
  当设置为 0 时，响应将是在单个流式事件中发送的一张图像。

  请注意，如果完整图像生成得更快，最终图像可能会在生成全部局部图像
  之前提前发送。

- `quality: optional "low" or "medium" or "high" or 3 more or null`

  GPT 图像模型的输出质量。GPT 图像模型支持 `low`, `medium`,
  和 `high`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括它们的
  `2026-09-08` 快照版本，也支持 `xhigh` 和 `max`。默认为 `auto`.

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

  - `"auto"`

- `size: optional string or "auto" or "1024x1024" or "1536x1024" or "1024x1536" or null`

  所生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以字符串形式指定任意分辨率，例如 `WIDTHxHEIGHT` 。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `1536x864`。的分辨率受 GPU 显存等系统限制，可能无法成功生成。 `2560x1440` 为实验性功能，且所支持的最大分辨率为 `3840x2160`。所请求的尺寸也必须满足该模型当前的像素与边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。

  - `string`

  - `"auto" or "1024x1024" or "1536x1024" or "1024x1536"`

    所生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以字符串形式指定任意分辨率，例如 `WIDTHxHEIGHT` 。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `1536x864`。的分辨率受 GPU 显存等系统限制，可能无法成功生成。 `2560x1440` 为实验性功能，且所支持的最大分辨率为 `3840x2160`。所请求的尺寸也必须满足该模型当前的像素与边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。

    - `"auto"`

    - `"1024x1024"`

    - `"1536x1024"`

    - `"1024x1536"`

- `stream: optional boolean or null`

  将部分图像结果作为事件流式返回。

- `user: optional string`

  用于标识你终端用户的唯一标识符，可帮助 OpenAI
  监控并检测滥用行为。

### 返回值

- `ImagesResponse object { created, background, data, 4 more }`

  图像生成端点的响应。

  - `created: number`

    图像创建时间的 Unix 时间戳（单位：秒）。

  - `background: optional "transparent" or "opaque"`

    用于图像生成的 background 参数。取值为 `transparent` 或 `opaque`.

    - `"transparent"`

    - `"opaque"`

  - `data: optional array of Image`

    生成的图像列表。

    - `b64_json: optional string`

      生成图像的 base64 编码 JSON。GPT 图像模型默认返回此字段，或当 `response_format` 设置为 `b64_json` 时也会返回（仅限支持该参数的模型）。

    - `revised_prompt: optional string`

      用于生成图像的修订后提示词，适用于支持提示词修订的模型。GPT 图像模型不返回此字段。

    - `url: optional string`

      生成图像的 URL，当 `response_format` 设置为 `url` 时返回（仅限支持该参数的模型）。GPT 图像模型不支持此字段。

  - `output_format: optional "png" or "webp" or "jpeg"`

    图像生成的输出格式。取值为 `png`, `webp`、或 `jpeg`.

    - `"png"`

    - `"webp"`

    - `"jpeg"`

  - `quality: optional "low" or "medium" or "high" or 2 more`

    生成图像的质量。取值为 `low`, `medium`, `high`, `xhigh`、或 `max`.

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

    - `"max"`

  - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024"`

    以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

    - `string`

    - `"1024x1024" or "1024x1536" or "1536x1024"`

      以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

      - `"1024x1024"`

      - `"1024x1536"`

      - `"1536x1024"`

  - `usage: optional object { input_tokens, input_tokens_details, output_tokens, 2 more }`

    对于 `gpt-image-1` ，表示图像生成的令牌使用信息。

    - `input_tokens: number`

      输入提示词中的令牌（图像和文本）数量。

    - `input_tokens_details: object { image_tokens, text_tokens }`

      图像生成的输入令牌的详细信息。

      - `image_tokens: number`

        输入提示中的图像 token 数。

      - `text_tokens: number`

        输入提示中的文本 token 数。

    - `output_tokens: number`

      模型生成的输出 token 数。

    - `total_tokens: number`

      用于图像生成的总 token 数（图像和文本）。

    - `output_tokens_details: optional object { image_tokens, text_tokens }`

      图像生成的输出 token 详情。

      - `image_tokens: number`

        模型生成的图像输出 token 数。

      - `text_tokens: number`

        模型生成的文本输出 token 数。

### 示例

```http
curl https://api.openai.com/v1/images/edits \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "images": [
            {
              "image_url": "https://example.com/source-image.png"
            }
          ],
          "prompt": "Add a watercolor effect to this image",
          "model": "gpt-image-1.5",
          "quality": "high",
          "size": "1024x1024"
        }'
```

#### 响应

```json
{
  "created": 0,
  "background": "transparent",
  "data": [
    {
      "b64_json": "b64_json",
      "revised_prompt": "revised_prompt",
      "url": "https://example.com"
    }
  ],
  "output_format": "png",
  "quality": "low",
  "size": "1024x1024",
  "usage": {
    "input_tokens": 0,
    "input_tokens_details": {
      "image_tokens": 0,
      "text_tokens": 0
    },
    "output_tokens": 0,
    "total_tokens": 0,
    "output_tokens_details": {
      "image_tokens": 0,
      "text_tokens": 0
    }
  }
}
```

### Edit image

```http
curl -s -D >(grep -i x-request-id >&2) \
  -o >(jq -r '.data[0].b64_json' | base64 --decode > gift-basket.png) \
  -X POST "https://api.openai.com/v1/images/edits" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "model=gpt-image-1.5" \
  -F "image[]=@body-lotion.png" \
  -F "image[]=@bath-bomb.png" \
  -F "image[]=@incense-kit.png" \
  -F "image[]=@soap.png" \
  -F 'prompt=Create a lovely gift basket with these four items in it'
```

### Streaming

```http
curl -s -N -X POST "https://api.openai.com/v1/images/edits" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "model=gpt-image-1.5" \
  -F "image[]=@body-lotion.png" \
  -F "image[]=@bath-bomb.png" \
  -F "image[]=@incense-kit.png" \
  -F "image[]=@soap.png" \
  -F 'prompt=Create a lovely gift basket with these four items in it' \
  -F "stream=true"
```

#### 响应

```json
event: image_edit.partial_image
data: {"type":"image_edit.partial_image","b64_json":"...","partial_image_index":0}

event: image_edit.completed
data: {"type":"image_edit.completed","b64_json":"...","usage":{"total_tokens":100,"input_tokens":50,"output_tokens":50,"input_tokens_details":{"text_tokens":10,"image_tokens":40}}}
```

## Create image

**post** `/images/generations`

使用 GPT Image 模型根据提示词生成图像。 [了解更多](/api/docs/guides/images-vision).

### Body 参数

- `model: string or ImageModel`

  用于图像生成的 GPT 图像模型。请明确指定一个模型。支持的模型包括 `gpt-image-1`, `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`，以及 `chatgpt-image-latest`.

  - `string`

  - `ImageModel = "gpt-image-1.5" or "gpt-image-2" or "gpt-image-2-2026-04-21" or 9 more`

    - `"gpt-image-1.5"`

    - `"gpt-image-2"`

    - `"gpt-image-2-2026-04-21"`

    - `"gpt-image-2.5-sunburst"`

    - `"gpt-image-2.5-sunburst-2026-09-08"`

    - `"gpt-image-2.5-flare"`

    - `"gpt-image-2.5-flare-2026-09-08"`

    - `"gpt-image-1"`

    - `"gpt-image-1-mini"`

    - `"chatgpt-image-latest"`

    - `"dall-e-2"`

    - `"dall-e-3"`

- `prompt: string`

  对所需图像的文字描述。最大长度为 32000 个字符。

- `background: optional "transparent" or "opaque" or "auto" or null`

  设置所生成图像的背景。该参数仅
  GPT 图像模型支持。必须是以下值之一 `transparent`, `opaque`、或 `auto` （默认
  值）。当使用 `auto` 时，模型将自动为图像确定最佳的
  背景。

  `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括它们的 `2026-09-08`
  快照，支持 `opaque` 和 `transparent` 背景。支持 GPT Image 模型的
  可使用透明背景。 `gpt-image-2` 和
  `gpt-image-2-2026-04-21`，该支持目前处于预览阶段。使用 `transparent`,
  将输出格式设置为 `png` 或 `webp`.

  - `"transparent"`

  - `"opaque"`

  - `"auto"`

- `moderation: optional "low" or "auto" or null`

  控制由 GPT 图像模型生成图像的内容审核级别。必须是 `low` （过滤较少）或 `auto` （默认值）。

  - `"low"`

  - `"auto"`

- `n: optional number or null`

  要生成的图像数量，必须介于 1 到 10 之间。

- `output_compression: optional number or null`

  生成图像的压缩级别（0-100%）。此参数仅支持使用 `webp` 或 `jpeg` 输出格式的 GPT 图像模型，默认为 100。

- `output_format: optional "png" or "jpeg" or "webp" or null`

  返回生成图像的格式。此参数仅支持 GPT 图像模型。必须是以下之一 `png`, `jpeg`、或 `webp`.

  - `"png"`

  - `"jpeg"`

  - `"webp"`

- `partial_images: optional number or null`

  要生成的局部图像数量。此参数用于
  返回局部图像的流式响应。取值必须在 0 到 3 之间。
  当设置为 0 时，响应将是在单个流式事件中发送的一张图像。

  请注意，如果完整图像生成得更快，最终图像可能会在生成全部局部图像
  之前提前发送。

- `quality: optional "low" or "medium" or "high" or 5 more or null`

  生成图像的质量。

  - `auto` （默认值）将根据给定的
    模型。
  - `high`, `medium` 和 `low` 适用于 GPT 图像模型。
  - `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括它们的 `2026-09-08`
    快照版本，也支持 `xhigh` 和 `max`.

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

  - `"auto"`

  - `"standard"`

  - `"hd"`

- `response_format: optional "url" or "b64_json" or null`

  已废弃图像模型的旧版响应格式参数。GPT 图像模型不支持该参数，它们始终返回 base64 编码的图像。

  - `"url"`

  - `"b64_json"`

- `size: optional string or "auto" or "1024x1024" or "1536x1024" or 5 more or null`

  所生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以字符串形式指定任意分辨率，例如 `WIDTHxHEIGHT` 。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `1536x864`。的分辨率受 GPU 显存等系统限制，可能无法成功生成。 `2560x1440` 为实验性功能，且所支持的最大分辨率为 `3840x2160`。所请求的尺寸也必须满足该模型当前的像素与边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。

  - `string`

  - `"auto" or "1024x1024" or "1536x1024" or 5 more`

    所生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以字符串形式指定任意分辨率，例如 `WIDTHxHEIGHT` 。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `1536x864`。的分辨率受 GPU 显存等系统限制，可能无法成功生成。 `2560x1440` 为实验性功能，且所支持的最大分辨率为 `3840x2160`。所请求的尺寸也必须满足该模型当前的像素与边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。

    - `"auto"`

    - `"1024x1024"`

    - `"1536x1024"`

    - `"1024x1536"`

    - `"256x256"`

    - `"512x512"`

    - `"1792x1024"`

    - `"1024x1792"`

- `stream: optional boolean or null`

  以流式模式生成图像。默认为 `false`。请参阅
  [图像生成指南](/api/docs/guides/image-generation) 了解更多信息。
  该参数仅适用于 GPT 图像模型。

- `style: optional "vivid" or "natural" or null`

  已废弃图像模型的旧版风格参数。GPT 图像模型不支持该参数；请改为在提示词中描述期望的风格。

  - `"vivid"`

  - `"natural"`

- `user: optional string`

  代表最终用户的唯一标识符，可帮助 OpenAI 监控和检测滥用行为。 [了解更多](/api/docs/guides/safety-best-practices#implement-safety-identifiers).

### 返回值

- `ImagesResponse object { created, background, data, 4 more }`

  图像生成端点的响应。

  - `created: number`

    图像创建时间的 Unix 时间戳（单位：秒）。

  - `background: optional "transparent" or "opaque"`

    用于图像生成的 background 参数。取值为 `transparent` 或 `opaque`.

    - `"transparent"`

    - `"opaque"`

  - `data: optional array of Image`

    生成的图像列表。

    - `b64_json: optional string`

      生成图像的 base64 编码 JSON。GPT 图像模型默认返回此字段，或当 `response_format` 设置为 `b64_json` 时也会返回（仅限支持该参数的模型）。

    - `revised_prompt: optional string`

      用于生成图像的修订后提示词，适用于支持提示词修订的模型。GPT 图像模型不返回此字段。

    - `url: optional string`

      生成图像的 URL，当 `response_format` 设置为 `url` 时返回（仅限支持该参数的模型）。GPT 图像模型不支持此字段。

  - `output_format: optional "png" or "webp" or "jpeg"`

    图像生成的输出格式。取值为 `png`, `webp`、或 `jpeg`.

    - `"png"`

    - `"webp"`

    - `"jpeg"`

  - `quality: optional "low" or "medium" or "high" or 2 more`

    生成图像的质量。取值为 `low`, `medium`, `high`, `xhigh`、或 `max`.

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

    - `"max"`

  - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024"`

    以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

    - `string`

    - `"1024x1024" or "1024x1536" or "1536x1024"`

      以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

      - `"1024x1024"`

      - `"1024x1536"`

      - `"1536x1024"`

  - `usage: optional object { input_tokens, input_tokens_details, output_tokens, 2 more }`

    对于 `gpt-image-1` ，表示图像生成的令牌使用信息。

    - `input_tokens: number`

      输入提示词中的令牌（图像和文本）数量。

    - `input_tokens_details: object { image_tokens, text_tokens }`

      图像生成的输入令牌的详细信息。

      - `image_tokens: number`

        输入提示中的图像 token 数。

      - `text_tokens: number`

        输入提示中的文本 token 数。

    - `output_tokens: number`

      模型生成的输出 token 数。

    - `total_tokens: number`

      用于图像生成的总 token 数（图像和文本）。

    - `output_tokens_details: optional object { image_tokens, text_tokens }`

      图像生成的输出 token 详情。

      - `image_tokens: number`

        模型生成的图像输出 token 数。

      - `text_tokens: number`

        模型生成的文本输出 token 数。

### 示例

```http
curl https://api.openai.com/v1/images/generations \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "model": "gpt-image-2.5-flare",
          "prompt": "A cute baby sea otter",
          "background": "transparent",
          "moderation": "low",
          "n": 1,
          "output_compression": 100,
          "output_format": "png",
          "partial_images": 1,
          "quality": "medium",
          "size": "1024x1024",
          "style": "vivid",
          "user": "user-1234"
        }'
```

#### 响应

```json
{
  "created": 0,
  "background": "transparent",
  "data": [
    {
      "b64_json": "b64_json",
      "revised_prompt": "revised_prompt",
      "url": "https://example.com"
    }
  ],
  "output_format": "png",
  "quality": "low",
  "size": "1024x1024",
  "usage": {
    "input_tokens": 0,
    "input_tokens_details": {
      "image_tokens": 0,
      "text_tokens": 0
    },
    "output_tokens": 0,
    "total_tokens": 0,
    "output_tokens_details": {
      "image_tokens": 0,
      "text_tokens": 0
    }
  }
}
```

### 生成图片

```http
curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-image-2.5-flare",
    "prompt": "A cute baby sea otter",
    "n": 1,
    "size": "1024x1024"
  }'
```

#### 响应

```json
{
  "created": 1713833628,
  "data": [
    {
      "b64_json": "..."
    }
  ],
  "usage": {
    "total_tokens": 100,
    "input_tokens": 50,
    "output_tokens": 50,
    "input_tokens_details": {
      "text_tokens": 10,
      "image_tokens": 40
    }
  }
}
```

### Streaming

```http
curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-image-2.5-flare",
    "prompt": "A cute baby sea otter",
    "n": 1,
    "size": "1024x1024",
    "stream": true
  }' \
  --no-buffer
```

#### 响应

```json
event: image_generation.partial_image
data: {"type":"image_generation.partial_image","b64_json":"...","partial_image_index":0}

event: image_generation.completed
data: {"type":"image_generation.completed","b64_json":"...","usage":{"total_tokens":100,"input_tokens":50,"output_tokens":50,"input_tokens_details":{"text_tokens":10,"image_tokens":40}}}
```

## 域名类型

### 图片

- `Image object { b64_json, revised_prompt, url }`

  表示由 OpenAI API 生成的图像的内容或 URL。

  - `b64_json: optional string`

    生成图像的 base64 编码 JSON。GPT 图像模型默认返回此字段，或当 `response_format` 设置为 `b64_json` 时也会返回（仅限支持该参数的模型）。

  - `revised_prompt: optional string`

    用于生成图像的修订后提示词，适用于支持提示词修订的模型。GPT 图像模型不返回此字段。

  - `url: optional string`

    生成图像的 URL，当 `response_format` 设置为 `url` 时返回（仅限支持该参数的模型）。GPT 图像模型不支持此字段。

### 图像编辑完成事件

- `ImageEditCompletedEvent object { b64_json, background, created_at, 5 more }`

  在图像编辑完成且最终图像可用时发出。

  - `b64_json: string`

    Base64 编码的最终编辑图像数据，可直接用于渲染为图像。

  - `background: "transparent" or "opaque" or "auto"`

    编辑后图像的背景设置。

    - `"transparent"`

    - `"opaque"`

    - `"auto"`

  - `created_at: number`

    事件创建时的 Unix 时间戳。

  - `output_format: "png" or "webp" or "jpeg"`

    编辑后图像的输出格式。

    - `"png"`

    - `"webp"`

    - `"jpeg"`

  - `quality: "low" or "medium" or "high" or 3 more`

    编辑后图像的质量设置。

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

    - `"max"`

    - `"auto"`

  - `size: string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

    以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

    - `string`

    - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

      以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

      - `"1024x1024"`

      - `"1024x1536"`

      - `"1536x1024"`

      - `"auto"`

  - `type: "image_edit.completed"`

    事件的类型。始终为 `image_edit.completed`.

    - `"image_edit.completed"`

  - `usage: object { input_tokens, input_tokens_details, output_tokens, total_tokens }`

    仅适用于 GPT 图像模型，用于图像生成的 token 使用信息。

    - `input_tokens: number`

      输入提示词中的令牌（图像和文本）数量。

    - `input_tokens_details: object { image_tokens, text_tokens }`

      图像生成的输入令牌的详细信息。

      - `image_tokens: number`

        输入提示中的图像 token 数。

      - `text_tokens: number`

        输入提示中的文本 token 数。

    - `output_tokens: number`

      输出图像中的图像 token 数量。

    - `total_tokens: number`

      用于图像生成的总 token 数（图像和文本）。

### 图片编辑部分图片事件

- `ImageEditPartialImageEvent object { b64_json, background, created_at, 5 more }`

  在图像编辑流式传输过程中，当有部分图像可用时发出。

  - `b64_json: string`

    Base64 编码的部分图像数据，可直接渲染为图像。

  - `background: "transparent" or "opaque" or "auto"`

    所请求编辑图像的背景设置。

    - `"transparent"`

    - `"opaque"`

    - `"auto"`

  - `created_at: number`

    事件创建时的 Unix 时间戳。

  - `output_format: "png" or "webp" or "jpeg"`

    所请求编辑图像的输出格式。

    - `"png"`

    - `"webp"`

    - `"jpeg"`

  - `partial_image_index: number`

    部分图像的基于 0 的索引（流式传输）。

  - `quality: "low" or "medium" or "high" or 3 more`

    所请求编辑图像的质量设置。

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

    - `"max"`

    - `"auto"`

  - `size: string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

    以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

    - `string`

    - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

      以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

      - `"1024x1024"`

      - `"1024x1536"`

      - `"1536x1024"`

      - `"auto"`

  - `type: "image_edit.partial_image"`

    事件的类型。始终为 `image_edit.partial_image`.

    - `"image_edit.partial_image"`

### 图片编辑流事件

- `ImageEditStreamEvent = ImageEditPartialImageEvent or ImageEditCompletedEvent`

  在图像编辑流式传输过程中，当有部分图像可用时发出。

  - `ImageEditPartialImageEvent object { b64_json, background, created_at, 5 more }`

    在图像编辑流式传输过程中，当有部分图像可用时发出。

    - `b64_json: string`

      Base64 编码的部分图像数据，可直接渲染为图像。

    - `background: "transparent" or "opaque" or "auto"`

      所请求编辑图像的背景设置。

      - `"transparent"`

      - `"opaque"`

      - `"auto"`

    - `created_at: number`

      事件创建时的 Unix 时间戳。

    - `output_format: "png" or "webp" or "jpeg"`

      所请求编辑图像的输出格式。

      - `"png"`

      - `"webp"`

      - `"jpeg"`

    - `partial_image_index: number`

      部分图像的基于 0 的索引（流式传输）。

    - `quality: "low" or "medium" or "high" or 3 more`

      所请求编辑图像的质量设置。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

      - `"max"`

      - `"auto"`

    - `size: string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

      以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

      - `string`

      - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

        以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

        - `"1024x1024"`

        - `"1024x1536"`

        - `"1536x1024"`

        - `"auto"`

    - `type: "image_edit.partial_image"`

      事件的类型。始终为 `image_edit.partial_image`.

      - `"image_edit.partial_image"`

  - `ImageEditCompletedEvent object { b64_json, background, created_at, 5 more }`

    在图像编辑完成且最终图像可用时发出。

    - `b64_json: string`

      Base64 编码的最终编辑图像数据，可直接用于渲染为图像。

    - `background: "transparent" or "opaque" or "auto"`

      编辑后图像的背景设置。

      - `"transparent"`

      - `"opaque"`

      - `"auto"`

    - `created_at: number`

      事件创建时的 Unix 时间戳。

    - `output_format: "png" or "webp" or "jpeg"`

      编辑后图像的输出格式。

      - `"png"`

      - `"webp"`

      - `"jpeg"`

    - `quality: "low" or "medium" or "high" or 3 more`

      编辑后图像的质量设置。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

      - `"max"`

      - `"auto"`

    - `size: string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

      以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

      - `string`

      - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

        以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

        - `"1024x1024"`

        - `"1024x1536"`

        - `"1536x1024"`

        - `"auto"`

    - `type: "image_edit.completed"`

      事件的类型。始终为 `image_edit.completed`.

      - `"image_edit.completed"`

    - `usage: object { input_tokens, input_tokens_details, output_tokens, total_tokens }`

      仅适用于 GPT 图像模型，用于图像生成的 token 使用信息。

      - `input_tokens: number`

        输入提示词中的令牌（图像和文本）数量。

      - `input_tokens_details: object { image_tokens, text_tokens }`

        图像生成的输入令牌的详细信息。

        - `image_tokens: number`

          输入提示中的图像 token 数。

        - `text_tokens: number`

          输入提示中的文本 token 数。

      - `output_tokens: number`

        输出图像中的图像 token 数量。

      - `total_tokens: number`

        用于图像生成的总 token 数（图像和文本）。

### 图片生成完成事件

- `ImageGenCompletedEvent object { b64_json, background, created_at, 5 more }`

  当图像生成完成且最终图像可用时触发。

  - `b64_json: string`

    Base64 编码的图像数据，适合作为图像进行渲染。

  - `background: "transparent" or "opaque" or "auto"`

    生成图像的背景设置。

    - `"transparent"`

    - `"opaque"`

    - `"auto"`

  - `created_at: number`

    事件创建时的 Unix 时间戳。

  - `output_format: "png" or "webp" or "jpeg"`

    生成图像的输出格式。

    - `"png"`

    - `"webp"`

    - `"jpeg"`

  - `quality: "low" or "medium" or "high" or 3 more`

    生成图像的质量设置。

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

    - `"max"`

    - `"auto"`

  - `size: string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

    以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

    - `string`

    - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

      以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

      - `"1024x1024"`

      - `"1024x1536"`

      - `"1536x1024"`

      - `"auto"`

  - `type: "image_generation.completed"`

    事件的类型。始终为 `image_generation.completed`.

    - `"image_generation.completed"`

  - `usage: object { input_tokens, input_tokens_details, output_tokens, total_tokens }`

    仅适用于 GPT 图像模型，用于图像生成的 token 使用信息。

    - `input_tokens: number`

      输入提示词中的令牌（图像和文本）数量。

    - `input_tokens_details: object { image_tokens, text_tokens }`

      图像生成的输入令牌的详细信息。

      - `image_tokens: number`

        输入提示中的图像 token 数。

      - `text_tokens: number`

        输入提示中的文本 token 数。

    - `output_tokens: number`

      输出图像中的图像 token 数量。

    - `total_tokens: number`

      用于图像生成的总 token 数（图像和文本）。

### 图像生成 部分图像事件

- `ImageGenPartialImageEvent object { b64_json, background, created_at, 5 more }`

  在图像生成流式传输期间，当有部分图像可用时发出。

  - `b64_json: string`

    Base64 编码的部分图像数据，可直接渲染为图像。

  - `background: "transparent" or "opaque" or "auto"`

    所请求图像的背景设置。

    - `"transparent"`

    - `"opaque"`

    - `"auto"`

  - `created_at: number`

    事件创建时的 Unix 时间戳。

  - `output_format: "png" or "webp" or "jpeg"`

    所请求图像的输出格式。

    - `"png"`

    - `"webp"`

    - `"jpeg"`

  - `partial_image_index: number`

    部分图像的基于 0 的索引（流式传输）。

  - `quality: "low" or "medium" or "high" or 3 more`

    所请求图像的质量设置。

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

    - `"max"`

    - `"auto"`

  - `size: string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

    以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

    - `string`

    - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

      以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

      - `"1024x1024"`

      - `"1024x1536"`

      - `"1536x1024"`

      - `"auto"`

  - `type: "image_generation.partial_image"`

    事件的类型。始终为 `image_generation.partial_image`.

    - `"image_generation.partial_image"`

### 图像生成流事件

- `ImageGenStreamEvent = ImageGenPartialImageEvent or ImageGenCompletedEvent`

  在图像生成流式传输期间，当有部分图像可用时发出。

  - `ImageGenPartialImageEvent object { b64_json, background, created_at, 5 more }`

    在图像生成流式传输期间，当有部分图像可用时发出。

    - `b64_json: string`

      Base64 编码的部分图像数据，可直接渲染为图像。

    - `background: "transparent" or "opaque" or "auto"`

      所请求图像的背景设置。

      - `"transparent"`

      - `"opaque"`

      - `"auto"`

    - `created_at: number`

      事件创建时的 Unix 时间戳。

    - `output_format: "png" or "webp" or "jpeg"`

      所请求图像的输出格式。

      - `"png"`

      - `"webp"`

      - `"jpeg"`

    - `partial_image_index: number`

      部分图像的基于 0 的索引（流式传输）。

    - `quality: "low" or "medium" or "high" or 3 more`

      所请求图像的质量设置。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

      - `"max"`

      - `"auto"`

    - `size: string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

      以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

      - `string`

      - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

        以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

        - `"1024x1024"`

        - `"1024x1536"`

        - `"1536x1024"`

        - `"auto"`

    - `type: "image_generation.partial_image"`

      事件的类型。始终为 `image_generation.partial_image`.

      - `"image_generation.partial_image"`

  - `ImageGenCompletedEvent object { b64_json, background, created_at, 5 more }`

    当图像生成完成且最终图像可用时触发。

    - `b64_json: string`

      Base64 编码的图像数据，适合作为图像进行渲染。

    - `background: "transparent" or "opaque" or "auto"`

      生成图像的背景设置。

      - `"transparent"`

      - `"opaque"`

      - `"auto"`

    - `created_at: number`

      事件创建时的 Unix 时间戳。

    - `output_format: "png" or "webp" or "jpeg"`

      生成图像的输出格式。

      - `"png"`

      - `"webp"`

      - `"jpeg"`

    - `quality: "low" or "medium" or "high" or 3 more`

      生成图像的质量设置。

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

      - `"max"`

      - `"auto"`

    - `size: string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

      以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

      - `string`

      - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

        以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

        - `"1024x1024"`

        - `"1024x1536"`

        - `"1536x1024"`

        - `"auto"`

    - `type: "image_generation.completed"`

      事件的类型。始终为 `image_generation.completed`.

      - `"image_generation.completed"`

    - `usage: object { input_tokens, input_tokens_details, output_tokens, total_tokens }`

      仅适用于 GPT 图像模型，用于图像生成的 token 使用信息。

      - `input_tokens: number`

        输入提示词中的令牌（图像和文本）数量。

      - `input_tokens_details: object { image_tokens, text_tokens }`

        图像生成的输入令牌的详细信息。

        - `image_tokens: number`

          输入提示中的图像 token 数。

        - `text_tokens: number`

          输入提示中的文本 token 数。

      - `output_tokens: number`

        输出图像中的图像 token 数量。

      - `total_tokens: number`

        用于图像生成的总 token 数（图像和文本）。

### 图像模型

- `ImageModel = "gpt-image-1.5" or "gpt-image-2" or "gpt-image-2-2026-04-21" or 9 more`

  - `"gpt-image-1.5"`

  - `"gpt-image-2"`

  - `"gpt-image-2-2026-04-21"`

  - `"gpt-image-2.5-sunburst"`

  - `"gpt-image-2.5-sunburst-2026-09-08"`

  - `"gpt-image-2.5-flare"`

  - `"gpt-image-2.5-flare-2026-09-08"`

  - `"gpt-image-1"`

  - `"gpt-image-1-mini"`

  - `"chatgpt-image-latest"`

  - `"dall-e-2"`

  - `"dall-e-3"`

### 图像响应

- `ImagesResponse object { created, background, data, 4 more }`

  图像生成端点的响应。

  - `created: number`

    图像创建时间的 Unix 时间戳（单位：秒）。

  - `background: optional "transparent" or "opaque"`

    用于图像生成的 background 参数。取值为 `transparent` 或 `opaque`.

    - `"transparent"`

    - `"opaque"`

  - `data: optional array of Image`

    生成的图像列表。

    - `b64_json: optional string`

      生成图像的 base64 编码 JSON。GPT 图像模型默认返回此字段，或当 `response_format` 设置为 `b64_json` 时也会返回（仅限支持该参数的模型）。

    - `revised_prompt: optional string`

      用于生成图像的修订后提示词，适用于支持提示词修订的模型。GPT 图像模型不返回此字段。

    - `url: optional string`

      生成图像的 URL，当 `response_format` 设置为 `url` 时返回（仅限支持该参数的模型）。GPT 图像模型不支持此字段。

  - `output_format: optional "png" or "webp" or "jpeg"`

    图像生成的输出格式。取值为 `png`, `webp`、或 `jpeg`.

    - `"png"`

    - `"webp"`

    - `"jpeg"`

  - `quality: optional "low" or "medium" or "high" or 2 more`

    生成图像的质量。取值为 `low`, `medium`, `high`, `xhigh`、或 `max`.

    - `"low"`

    - `"medium"`

    - `"high"`

    - `"xhigh"`

    - `"max"`

  - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024"`

    以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

    - `string`

    - `"1024x1024" or "1024x1536" or "1536x1024"`

      以 `WIDTHxHEIGHT` 字符串表示的图像尺寸，例如 `1536x864`.

      - `"1024x1024"`

      - `"1024x1536"`

      - `"1536x1024"`

  - `usage: optional object { input_tokens, input_tokens_details, output_tokens, 2 more }`

    对于 `gpt-image-1` ，表示图像生成的令牌使用信息。

    - `input_tokens: number`

      输入提示词中的令牌（图像和文本）数量。

    - `input_tokens_details: object { image_tokens, text_tokens }`

      图像生成的输入令牌的详细信息。

      - `image_tokens: number`

        输入提示中的图像 token 数。

      - `text_tokens: number`

        输入提示中的文本 token 数。

    - `output_tokens: number`

      模型生成的输出 token 数。

    - `total_tokens: number`

      用于图像生成的总 token 数（图像和文本）。

    - `output_tokens_details: optional object { image_tokens, text_tokens }`

      图像生成的输出 token 详情。

      - `image_tokens: number`

        模型生成的图像输出 token 数。

      - `text_tokens: number`

        模型生成的文本输出 token 数。
