> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 获取文档页面的 Markdown 版本。

## 创建图像变体

**post** `/images/variations`

创建指定图片的变体。该接口仅支持 `dall-e-2`.

### Returns

- `ImagesResponse object { created, background, data, 4 more }`

  图像生成端点的响应。

  - `created: number`

    图像创建时的 Unix 时间戳（以秒为单位）。

  - `background: optional "transparent" or "opaque"`

    用于图像生成的 background 参数。可以是 `transparent` 或 `opaque`.

    - `"transparent"`

    - `"opaque"`

  - `data: optional array of Image`

    生成的图像列表。

    - `b64_json: optional string`

      生成图像的 base64 编码 JSON。GPT 图像模型默认返回，并且仅当 `response_format` 设置为 `b64_json` 时才 `dall-e-2` 出现 `dall-e-3`.

    - `revised_prompt: optional string`

      仅 `dall-e-3` 时，用于生成图像的修订后提示词。

    - `url: optional string`

      当使用 `dall-e-2` 或 `dall-e-3`，时，如果 `response_format` 设置为 `url` （默认值），则为生成图像的 URL。GPT 图像模型不支持。

  - `output_format: optional "png" or "webp" or "jpeg"`

    图像生成的输出格式。可以是 `png`, `webp`，或 `jpeg`.

    - `"png"`

    - `"webp"`

    - `"jpeg"`

  - `quality: optional "low" or "medium" or "high"`

    生成图像的质量。可以是 `low`, `medium`，或 `high`.

    - `"low"`

    - `"medium"`

    - `"high"`

  - `size: optional "1024x1024" or "1024x1536" or "1536x1024"`

    生成图像的尺寸。可以是 `1024x1024`, `1024x1536`，或 `1536x1024`.

    - `"1024x1024"`

    - `"1024x1536"`

    - `"1536x1024"`

  - `usage: optional object { input_tokens, input_tokens_details, output_tokens, 2 more }`

    仅 `gpt-image-1` 时，图像生成的 token 用量信息。

    - `input_tokens: number`

      输入提示词中的 token（图像和文本）数量。

    - `input_tokens_details: object { image_tokens, text_tokens }`

      图像生成的输入 token 详细信息。

      - `image_tokens: number`

        输入提示中的图像 token 数量。

      - `text_tokens: number`

        输入提示中的文本 token 数量。

    - `output_tokens: number`

      模型生成的输出 token 数量。

    - `total_tokens: number`

      用于图像生成的 token（图像和文本）总数量。

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
