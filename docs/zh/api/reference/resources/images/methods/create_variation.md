> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可在页面 URL 后附加 `.md` 获取。

## 创建图像变体

**post** `/images/variations`

创建给定图像的变体。此端点仅支持 `dall-e-2`.

### 返回

- `ImagesResponse object { created, background, data, 4 more }`

  图像生成端点的响应。

  - `created: number`

    图像创建时的 Unix 时间戳（以秒为单位）。

  - `background: optional "transparent" or "opaque"`

    图像生成所用的 background 参数。可选值为 `transparent` 或 `opaque`.

    - `"transparent"`

    - `"opaque"`

  - `data: optional array of Image`

    生成的图像列表。

    - `b64_json: optional string`

      生成图像的 base64 编码 JSON。对于 GPT 图像模型，默认返回；仅在 `response_format` 设为 `b64_json` 用于 `dall-e-2` 和 `dall-e-3`.

    - `revised_prompt: optional string`

      对于 `dall-e-3` ，仅返回用于生成图像的修订提示词。

    - `url: optional string`

      使用 `dall-e-2` 或 `dall-e-3`，时，生成图像的 URL（如果 `response_format` 设为 `url` （默认值））。GPT 图像模型不支持此参数。

  - `output_format: optional "png" or "webp" or "jpeg"`

    图像生成的输出格式。可选值为 `png`, `webp`、或 `jpeg`.

    - `"png"`

    - `"webp"`

    - `"jpeg"`

  - `quality: optional "low" or "medium" or "high"`

    生成图像的质量。可选值为 `low`, `medium`、或 `high`.

    - `"low"`

    - `"medium"`

    - `"high"`

  - `size: optional "1024x1024" or "1024x1536" or "1536x1024"`

    生成的图像大小。可以是 `1024x1024`, `1024x1536`，或 `1536x1024`.

    - `"1024x1024"`

    - `"1024x1536"`

    - `"1536x1024"`

  - `usage: optional object { input_tokens, input_tokens_details, output_tokens, 2 more }`

    对于 `gpt-image-1` ，图像生成的令牌用量信息。

    - `input_tokens: number`

      输入提示中的令牌数量（图像和文本）。

    - `input_tokens_details: object { image_tokens, text_tokens }`

      图像生成的输入令牌详细信息。

      - `image_tokens: number`

        输入提示中的图像令牌数量。

      - `text_tokens: number`

        输入提示中的文本令牌数量。

    - `output_tokens: number`

      模型生成的输出令牌数量。

    - `total_tokens: number`

      图像生成使用的令牌总数（图像和文本）。

    - `output_tokens_details: optional object { image_tokens, text_tokens }`

      图像生成的输出令牌详细信息。

      - `image_tokens: number`

        模型生成的图像输出令牌数量。

      - `text_tokens: number`

        模型生成的文本输出令牌数量。

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
