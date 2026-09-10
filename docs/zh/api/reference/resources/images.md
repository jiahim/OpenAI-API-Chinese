# Images

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取对应文档页面的 Markdown 版本。

## 创建图像变体

**post** `/images/variations`

基于给定图像生成其变体。该端点仅支持 `dall-e-2`.

### Returns

- `ImagesResponse object { created, background, data, 4 more }`

  图像生成端点的响应。

  - `created: number`

    图像创建时的 Unix 时间戳（以秒为单位）。

  - `background: optional "transparent" or "opaque"`

    用于图像生成的 background 参数。可为 `transparent` 或 `opaque`.

    - `"transparent"`

    - `"opaque"`

  - `data: optional array of Image`

    生成的图像列表。

    - `b64_json: optional string`

      生成图像的 base64 编码 JSON。默认在 GPT 图像模型下返回，并且仅当 `response_format` 设置为 `b64_json` 时 `dall-e-2` 以及 `dall-e-3`.

    - `revised_prompt: optional string`

      仅 `dall-e-3` 时，用于生成图像的修订后提示词。

    - `url: optional string`

      当使用 `dall-e-2` 或 `dall-e-3`，时，如果 `response_format` 设置为 `url` （默认值），则为生成图像的 URL。GPT 图像模型不支持。

  - `output_format: optional "png" or "webp" or "jpeg"`

    图像生成的输出格式。可为 `png`, `webp`，或 `jpeg`.

    - `"png"`

    - `"webp"`

    - `"jpeg"`

  - `quality: optional "low" or "medium" or "high" or 2 more`

    生成图像的质量。可为以下之一： `low`, `medium`, `high`, `xhigh`，或 `max`.

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

    仅 `gpt-image-1` 时，图像生成的 token 使用信息。

    - `input_tokens: number`

      输入提示词中的 token（图像和文本）数量。

    - `input_tokens_details: object { image_tokens, text_tokens }`

      用于图像生成的输入 token 详细信息。

      - `image_tokens: number`

        输入提示词中的图像 token 数量。

      - `text_tokens: number`

        输入提示词中的文本 token 数量。

    - `output_tokens: number`

      模型生成的输出 token 数量。

    - `total_tokens: number`

      用于图像生成的 token（图像和文本）总数。

    - `output_tokens_details: optional object { image_tokens, text_tokens }`

      图像生成的输出 token 详细信息。

      - `image_tokens: number`

        模型生成的图像输出 token 数量。

      - `text_tokens: number`

        模型生成的文本输出 token 数量。

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

根据一个或多个源图像和提示词创建编辑或扩展后的图像。该端点支持 GPT Image 模型以及 `dall-e-2`.

### 请求体参数

- `images: array of object { file_id, image_url }`

  用于编辑的输入图像引用。
  对于 GPT 图像模型，你最多可以提供 16 张图像。

  - `file_id: optional string`

    用作输入的已上传图像的 File API ID。

  - `image_url: optional string`

    完整的 URL 或 base64 编码的数据 URL。

- `prompt: string`

  对期望的图像编辑的文字描述。

- `background: optional "transparent" or "opaque" or "auto" or null`

  设置生成图像输出的背景。 `gpt-image-2.5-sunburst` 以及 `gpt-image-2.5-flare`，包括它们的 `2026-09-08` 快照，支持 `opaque` 以及 `transparent` 背景。受支持的 GPT Image 模型可使用透明背景。对于 `gpt-image-2` 以及 `gpt-image-2-2026-04-21`，此支持处于预览阶段。当使用 `transparent`，时，将输出格式设置为 `png` 或 `webp`.

  - `"transparent"`

  - `"opaque"`

  - `"auto"`

- `input_fidelity: optional "high" or "low" or null`

  控制对原始输入图像的保真度。

  - `"high"`

  - `"low"`

- `mask: optional object { file_id, image_url }`

  通过 URL 或已上传文件 ID 引用输入图像。
  提供以下其中之一 `image_url` 或 `file_id`.

  - `file_id: optional string`

    用作输入的已上传图像的 File API ID。

  - `image_url: optional string`

    完整的 URL 或 base64 编码的数据 URL。

- `model: optional string or "gpt-image-1.5" or "gpt-image-2" or "gpt-image-2-2026-04-21" or 7 more or null`

  用于图像编辑的 GPT 图像模型，包括 `gpt-image-2`，其日期快照 `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`.

  - `string`

  - `"gpt-image-1.5" or "gpt-image-2" or "gpt-image-2-2026-04-21" or 7 more`

    用于图像编辑的 GPT 图像模型，包括 `gpt-image-2`，其日期快照 `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`.

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

  输出图像格式。GPT 图像模型支持。

  - `"png"`

  - `"jpeg"`

  - `"webp"`

- `partial_images: optional number or null`

  要生成的局部图像数量。此参数用于
  返回局部图像的流式响应。值必须在 0 到 3 之间。
  当设置为 0 时，响应将是在单个流式事件中发送的一张图像。

  请注意，如果完整图像生成得更快，最终图像可能会在生成完所有局部图像之前发送。
  更快地被生成。

- `quality: optional "low" or "medium" or "high" or 3 more or null`

  GPT 图像模型的输出质量。GPT 图像模型支持 `low`, `medium`,
  以及 `high`. `gpt-image-2.5-sunburst` 以及 `gpt-image-2.5-flare`，包括它们的
  `2026-09-08` 快照，也支持 `xhigh` 以及 `max`。默认为 `auto`.

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

  - `"auto"`

- `size: optional string or "auto" or "1024x1024" or "1536x1024" or "1024x1536" or null`

  生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以 `WIDTHxHEIGHT` 字符串形式指定任意分辨率，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。

  - `string`

  - `"auto" or "1024x1024" or "1536x1024" or "1024x1536"`

    生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以 `WIDTHxHEIGHT` 字符串形式指定任意分辨率，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。

    - `"auto"`

    - `"1024x1024"`

    - `"1536x1024"`

    - `"1024x1536"`

- `stream: optional boolean or null`

  以事件形式流式返回部分图像结果。

- `user: optional string`

  代表你最终用户的唯一标识符，可以帮助 OpenAI
  监控并检测滥用行为。

### Returns

- `ImagesResponse object { created, background, data, 4 more }`

  图像生成端点的响应。

  - `created: number`

    图像创建时的 Unix 时间戳（以秒为单位）。

  - `background: optional "transparent" or "opaque"`

    用于图像生成的 background 参数。可为 `transparent` 或 `opaque`.

    - `"transparent"`

    - `"opaque"`

  - `data: optional array of Image`

    生成的图像列表。

    - `b64_json: optional string`

      生成图像的 base64 编码 JSON。默认在 GPT 图像模型下返回，并且仅当 `response_format` 设置为 `b64_json` 时 `dall-e-2` 以及 `dall-e-3`.

    - `revised_prompt: optional string`

      仅 `dall-e-3` 时，用于生成图像的修订后提示词。

    - `url: optional string`

      当使用 `dall-e-2` 或 `dall-e-3`，时，如果 `response_format` 设置为 `url` （默认值），则为生成图像的 URL。GPT 图像模型不支持。

  - `output_format: optional "png" or "webp" or "jpeg"`

    图像生成的输出格式。可为 `png`, `webp`，或 `jpeg`.

    - `"png"`

    - `"webp"`

    - `"jpeg"`

  - `quality: optional "low" or "medium" or "high" or 2 more`

    生成图像的质量。可为以下之一： `low`, `medium`, `high`, `xhigh`，或 `max`.

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

    仅 `gpt-image-1` 时，图像生成的 token 使用信息。

    - `input_tokens: number`

      输入提示词中的 token（图像和文本）数量。

    - `input_tokens_details: object { image_tokens, text_tokens }`

      用于图像生成的输入 token 详细信息。

      - `image_tokens: number`

        输入提示词中的图像 token 数量。

      - `text_tokens: number`

        输入提示词中的文本 token 数量。

    - `output_tokens: number`

      模型生成的输出 token 数量。

    - `total_tokens: number`

      用于图像生成的 token（图像和文本）总数。

    - `output_tokens_details: optional object { image_tokens, text_tokens }`

      图像生成的输出 token 详细信息。

      - `image_tokens: number`

        模型生成的图像输出 token 数量。

      - `text_tokens: number`

        模型生成的文本输出 token 数量。

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

根据提示词创建图像。 [了解详情](/api/docs/guides/images-vision).

### 请求体参数

- `prompt: string`

  所需图像的文字描述。GPT 图像模型的最大长度为 32000 个字符，对于 `dall-e-2` 为 1000 个字符，对于 `dall-e-3`.

- `background: optional "transparent" or "opaque" or "auto" or null`

  设置生成图像的背景。此参数仅支持
  GPT 图像模型。必须是以下值之一： `transparent`, `opaque`，或 `auto` （默认值
  ）。当使用 `auto` 时，模型将自动确定最佳的
  图像背景。

  `gpt-image-2.5-sunburst` 以及 `gpt-image-2.5-flare`，包括它们的 `2026-09-08`
  快照，支持 `opaque` 以及 `transparent` 背景。支持 GPT 图像模型可使用透明
  背景。对于 `gpt-image-2` 以及
  `gpt-image-2-2026-04-21`，此支持处于预览阶段。当使用 `transparent`,
  请将输出格式设置为 `png` 或 `webp`.

  - `"transparent"`

  - `"opaque"`

  - `"auto"`

- `model: optional string or ImageModel or null`

  用于图像生成的模型。可为以下之一： `dall-e-2`, `dall-e-3`，或 GPT 图像模型（`gpt-image-1`, `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, `gpt-image-2.5-flare-2026-09-08`）。默认为 `dall-e-2` ，除非使用了 GPT 图像模型特有的参数。

  - `string`

  - `ImageModel = "gpt-image-1.5" or "gpt-image-2" or "gpt-image-2-2026-04-21" or 8 more`

    - `"gpt-image-1.5"`

    - `"gpt-image-2"`

    - `"gpt-image-2-2026-04-21"`

    - `"gpt-image-2.5-sunburst"`

    - `"gpt-image-2.5-sunburst-2026-09-08"`

    - `"gpt-image-2.5-flare"`

    - `"gpt-image-2.5-flare-2026-09-08"`

    - `"dall-e-2"`

    - `"dall-e-3"`

    - `"gpt-image-1"`

    - `"gpt-image-1-mini"`

- `moderation: optional "low" or "auto" or null`

  控制 GPT 图像模型生成图像的内容审核级别。必须为 `low` （限制较少的过滤）或 `auto` （默认值）。

  - `"low"`

  - `"auto"`

- `n: optional number or null`

  要生成的图像数量。必须介于 1 到 10 之间。对于 `dall-e-3`，仅 `n=1` 受支持。

- `output_compression: optional number or null`

  生成图像的压缩级别（0–100%）。该参数仅对 GPT 图像模型的 `webp` 或 `jpeg` 输出格式支持，默认为 100。

- `output_format: optional "png" or "jpeg" or "webp" or null`

  返回生成图像的格式。该参数仅对 GPT 图像模型支持。必须是以下之一 `png`, `jpeg`，或 `webp`.

  - `"png"`

  - `"jpeg"`

  - `"webp"`

- `partial_images: optional number or null`

  要生成的局部图像数量。此参数用于
  返回局部图像的流式响应。值必须在 0 到 3 之间。
  当设置为 0 时，响应将是在单个流式事件中发送的一张图像。

  请注意，如果完整图像生成得更快，最终图像可能会在生成完所有局部图像之前发送。
  更快地被生成。

- `quality: optional "standard" or "hd" or "low" or 5 more or null`

  将生成图像的质量。

  - `auto` （默认值）将自动为给定的
    模型选择最佳质量。
  - `high`, `medium` 以及 `low` 受 GPT 图像模型支持。
  - `gpt-image-2.5-sunburst` 以及 `gpt-image-2.5-flare`，包括它们的 `2026-09-08`
    快照，也支持 `xhigh` 以及 `max`.
  - `hd` 以及 `standard` 受支持，适用于 `dall-e-3`.
  - `standard` 是唯一选项，适用于 `dall-e-2`.

  - `"standard"`

  - `"hd"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

  - `"auto"`

- `response_format: optional "url" or "b64_json" or null`

  生成图像所采用的返回格式 `dall-e-2` 以及 `dall-e-3` 可为以下值之一 `url` 或 `b64_json`。URL 仅在图像生成后的 60 分钟内有效。此参数不被 GPT 图像模型支持，这些模型始终返回 base64 编码的图像。

  - `"url"`

  - `"b64_json"`

- `size: optional string or "auto" or "1024x1024" or "1536x1024" or 5 more or null`

  生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以 `WIDTHxHEIGHT` 字符串形式指定任意分辨率，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，请使用以下任一值 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下任一值 `1024x1024`, `1792x1024`，或 `1024x1792`.

  - `string`

  - `"auto" or "1024x1024" or "1536x1024" or 5 more`

    生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以 `WIDTHxHEIGHT` 字符串形式指定任意分辨率，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，请使用以下任一值 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下任一值 `1024x1024`, `1792x1024`，或 `1024x1792`.

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
  此参数仅适用于 GPT 图像模型。

- `style: optional "vivid" or "natural" or null`

  生成图像的风格。此参数仅适用于 `dall-e-3`。必须是以下之一： `vivid` 或 `natural`。Vivid 使模型倾向于生成超现实且戏剧化的图像。Natural 使模型生成更加自然、不那么超现实外观的图像。

  - `"vivid"`

  - `"natural"`

- `user: optional string`

  代表最终用户的唯一标识符，有助于 OpenAI 监控和检测滥用行为。 [了解更多](/api/docs/guides/safety-best-practices#implement-safety-identifiers).

### Returns

- `ImagesResponse object { created, background, data, 4 more }`

  图像生成端点的响应。

  - `created: number`

    图像创建时的 Unix 时间戳（以秒为单位）。

  - `background: optional "transparent" or "opaque"`

    用于图像生成的 background 参数。可为 `transparent` 或 `opaque`.

    - `"transparent"`

    - `"opaque"`

  - `data: optional array of Image`

    生成的图像列表。

    - `b64_json: optional string`

      生成图像的 base64 编码 JSON。默认在 GPT 图像模型下返回，并且仅当 `response_format` 设置为 `b64_json` 时 `dall-e-2` 以及 `dall-e-3`.

    - `revised_prompt: optional string`

      仅 `dall-e-3` 时，用于生成图像的修订后提示词。

    - `url: optional string`

      当使用 `dall-e-2` 或 `dall-e-3`，时，如果 `response_format` 设置为 `url` （默认值），则为生成图像的 URL。GPT 图像模型不支持。

  - `output_format: optional "png" or "webp" or "jpeg"`

    图像生成的输出格式。可为 `png`, `webp`，或 `jpeg`.

    - `"png"`

    - `"webp"`

    - `"jpeg"`

  - `quality: optional "low" or "medium" or "high" or 2 more`

    生成图像的质量。可为以下之一： `low`, `medium`, `high`, `xhigh`，或 `max`.

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

    仅 `gpt-image-1` 时，图像生成的 token 使用信息。

    - `input_tokens: number`

      输入提示词中的 token（图像和文本）数量。

    - `input_tokens_details: object { image_tokens, text_tokens }`

      用于图像生成的输入 token 详细信息。

      - `image_tokens: number`

        输入提示词中的图像 token 数量。

      - `text_tokens: number`

        输入提示词中的文本 token 数量。

    - `output_tokens: number`

      模型生成的输出 token 数量。

    - `total_tokens: number`

      用于图像生成的 token（图像和文本）总数。

    - `output_tokens_details: optional object { image_tokens, text_tokens }`

      图像生成的输出 token 详细信息。

      - `image_tokens: number`

        模型生成的图像输出 token 数量。

      - `text_tokens: number`

        模型生成的文本输出 token 数量。

### 示例

```http
curl https://api.openai.com/v1/images/generations \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "prompt": "A cute baby sea otter",
          "background": "transparent",
          "moderation": "low",
          "n": 1,
          "output_compression": 100,
          "output_format": "png",
          "partial_images": 1,
          "quality": "medium",
          "response_format": "url",
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

### 生成图像

```http
curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-image-1.5",
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
    "model": "gpt-image-1.5",
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

### 图像

- `Image object { b64_json, revised_prompt, url }`

  表示由 OpenAI API 生成的图像内容或图像 URL。

  - `b64_json: optional string`

    生成图像的 base64 编码 JSON。默认在 GPT 图像模型下返回，并且仅当 `response_format` 设置为 `b64_json` 时 `dall-e-2` 以及 `dall-e-3`.

  - `revised_prompt: optional string`

    仅 `dall-e-3` 时，用于生成图像的修订后提示词。

  - `url: optional string`

    当使用 `dall-e-2` 或 `dall-e-3`，时，如果 `response_format` 设置为 `url` （默认值），则为生成图像的 URL。GPT 图像模型不支持。

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

    事件类型。始终为 `image_edit.completed`.

    - `"image_edit.completed"`

  - `usage: object { input_tokens, input_tokens_details, output_tokens, total_tokens }`

    仅适用于 GPT 图像模型，表示图像生成的令牌用量信息。

    - `input_tokens: number`

      输入提示词中的 token（图像和文本）数量。

    - `input_tokens_details: object { image_tokens, text_tokens }`

      用于图像生成的输入 token 详细信息。

      - `image_tokens: number`

        输入提示词中的图像 token 数量。

      - `text_tokens: number`

        输入提示词中的文本 token 数量。

    - `output_tokens: number`

      输出图像中的图像令牌数量。

    - `total_tokens: number`

      用于图像生成的 token（图像和文本）总数。

### 图片编辑部分图片事件

- `ImageEditPartialImageEvent object { b64_json, background, created_at, 5 more }`

  在图像编辑流式传输过程中，当有部分图像可用时触发。

  - `b64_json: string`

    Base64 编码的部分图像数据，适合作为图像进行渲染。

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

    部分图像的 0 基索引（流式传输）。

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

    事件类型。始终为 `image_edit.partial_image`.

    - `"image_edit.partial_image"`

### 图像编辑流事件

- `ImageEditStreamEvent = ImageEditPartialImageEvent or ImageEditCompletedEvent`

  在图像编辑流式传输过程中，当有部分图像可用时触发。

  - `ImageEditPartialImageEvent object { b64_json, background, created_at, 5 more }`

    在图像编辑流式传输过程中，当有部分图像可用时触发。

    - `b64_json: string`

      Base64 编码的部分图像数据，适合作为图像进行渲染。

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

      部分图像的 0 基索引（流式传输）。

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

      事件类型。始终为 `image_edit.partial_image`.

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

      事件类型。始终为 `image_edit.completed`.

      - `"image_edit.completed"`

    - `usage: object { input_tokens, input_tokens_details, output_tokens, total_tokens }`

      仅适用于 GPT 图像模型，表示图像生成的令牌用量信息。

      - `input_tokens: number`

        输入提示词中的 token（图像和文本）数量。

      - `input_tokens_details: object { image_tokens, text_tokens }`

        用于图像生成的输入 token 详细信息。

        - `image_tokens: number`

          输入提示词中的图像 token 数量。

        - `text_tokens: number`

          输入提示词中的文本 token 数量。

      - `output_tokens: number`

        输出图像中的图像令牌数量。

      - `total_tokens: number`

        用于图像生成的 token（图像和文本）总数。

### 图像生成完成事件

- `ImageGenCompletedEvent object { b64_json, background, created_at, 5 more }`

  在图像生成完成且最终图像可用时发出。

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

    事件类型。始终为 `image_generation.completed`.

    - `"image_generation.completed"`

  - `usage: object { input_tokens, input_tokens_details, output_tokens, total_tokens }`

    仅适用于 GPT 图像模型，表示图像生成的令牌用量信息。

    - `input_tokens: number`

      输入提示词中的 token（图像和文本）数量。

    - `input_tokens_details: object { image_tokens, text_tokens }`

      用于图像生成的输入 token 详细信息。

      - `image_tokens: number`

        输入提示词中的图像 token 数量。

      - `text_tokens: number`

        输入提示词中的文本 token 数量。

    - `output_tokens: number`

      输出图像中的图像令牌数量。

    - `total_tokens: number`

      用于图像生成的 token（图像和文本）总数。

### 图像生成 部分图像事件

- `ImageGenPartialImageEvent object { b64_json, background, created_at, 5 more }`

  在图像生成流式传输期间，当有部分图像可用时发出。

  - `b64_json: string`

    Base64 编码的部分图像数据，适合作为图像进行渲染。

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

    部分图像的 0 基索引（流式传输）。

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

    事件类型。始终为 `image_generation.partial_image`.

    - `"image_generation.partial_image"`

### Image Gen Stream Event

- `ImageGenStreamEvent = ImageGenPartialImageEvent or ImageGenCompletedEvent`

  在图像生成流式传输期间，当有部分图像可用时发出。

  - `ImageGenPartialImageEvent object { b64_json, background, created_at, 5 more }`

    在图像生成流式传输期间，当有部分图像可用时发出。

    - `b64_json: string`

      Base64 编码的部分图像数据，适合作为图像进行渲染。

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

      部分图像的 0 基索引（流式传输）。

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

      事件类型。始终为 `image_generation.partial_image`.

      - `"image_generation.partial_image"`

  - `ImageGenCompletedEvent object { b64_json, background, created_at, 5 more }`

    在图像生成完成且最终图像可用时发出。

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

      事件类型。始终为 `image_generation.completed`.

      - `"image_generation.completed"`

    - `usage: object { input_tokens, input_tokens_details, output_tokens, total_tokens }`

      仅适用于 GPT 图像模型，表示图像生成的令牌用量信息。

      - `input_tokens: number`

        输入提示词中的 token（图像和文本）数量。

      - `input_tokens_details: object { image_tokens, text_tokens }`

        用于图像生成的输入 token 详细信息。

        - `image_tokens: number`

          输入提示词中的图像 token 数量。

        - `text_tokens: number`

          输入提示词中的文本 token 数量。

      - `output_tokens: number`

        输出图像中的图像令牌数量。

      - `total_tokens: number`

        用于图像生成的 token（图像和文本）总数。

### Image Model

- `ImageModel = "gpt-image-1.5" or "gpt-image-2" or "gpt-image-2-2026-04-21" or 8 more`

  - `"gpt-image-1.5"`

  - `"gpt-image-2"`

  - `"gpt-image-2-2026-04-21"`

  - `"gpt-image-2.5-sunburst"`

  - `"gpt-image-2.5-sunburst-2026-09-08"`

  - `"gpt-image-2.5-flare"`

  - `"gpt-image-2.5-flare-2026-09-08"`

  - `"dall-e-2"`

  - `"dall-e-3"`

  - `"gpt-image-1"`

  - `"gpt-image-1-mini"`

### Images Response

- `ImagesResponse object { created, background, data, 4 more }`

  图像生成端点的响应。

  - `created: number`

    图像创建时的 Unix 时间戳（以秒为单位）。

  - `background: optional "transparent" or "opaque"`

    用于图像生成的 background 参数。可为 `transparent` 或 `opaque`.

    - `"transparent"`

    - `"opaque"`

  - `data: optional array of Image`

    生成的图像列表。

    - `b64_json: optional string`

      生成图像的 base64 编码 JSON。默认在 GPT 图像模型下返回，并且仅当 `response_format` 设置为 `b64_json` 时 `dall-e-2` 以及 `dall-e-3`.

    - `revised_prompt: optional string`

      仅 `dall-e-3` 时，用于生成图像的修订后提示词。

    - `url: optional string`

      当使用 `dall-e-2` 或 `dall-e-3`，时，如果 `response_format` 设置为 `url` （默认值），则为生成图像的 URL。GPT 图像模型不支持。

  - `output_format: optional "png" or "webp" or "jpeg"`

    图像生成的输出格式。可为 `png`, `webp`，或 `jpeg`.

    - `"png"`

    - `"webp"`

    - `"jpeg"`

  - `quality: optional "low" or "medium" or "high" or 2 more`

    生成图像的质量。可为以下之一： `low`, `medium`, `high`, `xhigh`，或 `max`.

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

    仅 `gpt-image-1` 时，图像生成的 token 使用信息。

    - `input_tokens: number`

      输入提示词中的 token（图像和文本）数量。

    - `input_tokens_details: object { image_tokens, text_tokens }`

      用于图像生成的输入 token 详细信息。

      - `image_tokens: number`

        输入提示词中的图像 token 数量。

      - `text_tokens: number`

        输入提示词中的文本 token 数量。

    - `output_tokens: number`

      模型生成的输出 token 数量。

    - `total_tokens: number`

      用于图像生成的 token（图像和文本）总数。

    - `output_tokens_details: optional object { image_tokens, text_tokens }`

      图像生成的输出 token 详细信息。

      - `image_tokens: number`

        模型生成的图像输出 token 数量。

      - `text_tokens: number`

        模型生成的文本输出 token 数量。
