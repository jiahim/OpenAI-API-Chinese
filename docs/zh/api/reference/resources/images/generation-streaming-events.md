# 图像生成流式事件

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 获取文档页面的 Markdown 版本。

通过服务端发送事件实时流式生成和编辑图像。
[了解有关图像流式处理的更多信息](https://developers.openai.com/api/docs/guides/image-generation).

<a id="image_generation.partial_image"></a>

## image_generation.partial_image

在图像生成流式传输期间，当有部分图像可用时触发。

### Schema

Schema name: `ImageGenPartialImageEvent`

- `b64_json: string`

  经过 Base64 编码的部分图像数据，适合作为图像进行渲染。

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

  部分图像的 0-based 索引（流式）。

- `quality: "low" or "medium" or "high" or 3 more`

  所请求图像的质量设置。

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

  - `"auto"`

- `size: string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

  以 `WIDTHxHEIGHT` 字符串形式表示的图像尺寸，例如 `1536x864`.

  - `string`

  - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

    以 `WIDTHxHEIGHT` 字符串形式表示的图像尺寸，例如 `1536x864`.

    - `"1024x1024"`

    - `"1024x1536"`

    - `"1536x1024"`

    - `"auto"`

- `type: "image_generation.partial_image"`

  事件的类型。始终为 `image_generation.partial_image`.

  - `"image_generation.partial_image"`

### 示例

```json
{
  "type": "image_generation.partial_image",
  "b64_json": "...",
  "created_at": 1620000000,
  "size": "1024x1024",
  "quality": "high",
  "background": "transparent",
  "output_format": "png",
  "partial_image_index": 0
}
```

<a id="image_generation.completed"></a>

## image_generation.completed

在图像生成已完成且最终图像可用时发出。

### Schema

Schema name: `ImageGenCompletedEvent`

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

  以 `WIDTHxHEIGHT` 字符串形式表示的图像尺寸，例如 `1536x864`.

  - `string`

  - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

    以 `WIDTHxHEIGHT` 字符串形式表示的图像尺寸，例如 `1536x864`.

    - `"1024x1024"`

    - `"1024x1536"`

    - `"1536x1024"`

    - `"auto"`

- `type: "image_generation.completed"`

  事件的类型。始终为 `image_generation.completed`.

  - `"image_generation.completed"`

- `usage: object { input_tokens, input_tokens_details, output_tokens, total_tokens }`

  仅适用于 GPT 图像模型，图像生成的 token 使用信息。

  - `input_tokens: number`

    输入提示中的 token（图像和文本）数量。

  - `input_tokens_details: object { image_tokens, text_tokens }`

    图像生成的输入 token 详细信息。

    - `image_tokens: number`

      输入提示中的图像 token 数量。

    - `text_tokens: number`

      输入提示中的文本 token 数量。

  - `output_tokens: number`

    输出图像中的图像 token 数量。

  - `total_tokens: number`

    用于图像生成的 token（图像和文本）总数。

### 示例

```json
{
  "type": "image_generation.completed",
  "b64_json": "...",
  "created_at": 1620000000,
  "size": "1024x1024",
  "quality": "high",
  "background": "transparent",
  "output_format": "png",
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
