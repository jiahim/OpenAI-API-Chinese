# 图像编辑流式事件

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

通过服务端发送事件实时流式生成和编辑图像。
[了解有关图像流式处理的更多信息](https://developers.openai.com/api/docs/guides/image-generation).

<a id="image_edit.partial_image"></a>

## image_edit.partial_image

在图像编辑流式传输过程中，当可用的部分图像时触发。

### Schema

Schema name: `ImageEditPartialImageEvent`

- `b64_json: string`

  Base64 编码的部分图像数据，适合渲染为图像。

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

  部分图像（流式）的 0 基索引。

- `quality: "low" or "medium" or "high" or 3 more`

  所请求编辑图像的质量设置。

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

  - `"auto"`

- `size: string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

  图像尺寸，以 `WIDTHxHEIGHT` 字符串形式表示，例如 `1536x864`.

  - `string`

  - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

    图像尺寸，以 `WIDTHxHEIGHT` 字符串形式表示，例如 `1536x864`.

    - `"1024x1024"`

    - `"1024x1536"`

    - `"1536x1024"`

    - `"auto"`

- `type: "image_edit.partial_image"`

  事件的类型，始终为 `image_edit.partial_image`.

  - `"image_edit.partial_image"`

### 示例

```json
{
  "type": "image_edit.partial_image",
  "b64_json": "...",
  "created_at": 1620000000,
  "size": "1024x1024",
  "quality": "high",
  "background": "transparent",
  "output_format": "png",
  "partial_image_index": 0
}
```

<a id="image_edit.completed"></a>

## image_edit.completed

当图像编辑完成且最终图像可用时发出。

### Schema

Schema name: `ImageEditCompletedEvent`

- `b64_json: string`

  Base64 编码的最终编辑图像数据，适合渲染为图像。

- `background: "transparent" or "opaque" or "auto"`

  编辑图像的背景设置。

  - `"transparent"`

  - `"opaque"`

  - `"auto"`

- `created_at: number`

  事件创建时的 Unix 时间戳。

- `output_format: "png" or "webp" or "jpeg"`

  编辑图像的输出格式。

  - `"png"`

  - `"webp"`

  - `"jpeg"`

- `quality: "low" or "medium" or "high" or 3 more`

  编辑图像的质量设置。

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

  - `"auto"`

- `size: string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

  图像尺寸，以 `WIDTHxHEIGHT` 字符串形式表示，例如 `1536x864`.

  - `string`

  - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

    图像尺寸，以 `WIDTHxHEIGHT` 字符串形式表示，例如 `1536x864`.

    - `"1024x1024"`

    - `"1024x1536"`

    - `"1536x1024"`

    - `"auto"`

- `type: "image_edit.completed"`

  事件的类型，始终为 `image_edit.completed`.

  - `"image_edit.completed"`

- `usage: object { input_tokens, input_tokens_details, output_tokens, total_tokens }`

  仅适用于 GPT 图像模型，图像生成的令牌使用信息。

  - `input_tokens: number`

    输入提示中的令牌（图像和文本）数量。

  - `input_tokens_details: object { image_tokens, text_tokens }`

    图像生成的输入令牌详细信息。

    - `image_tokens: number`

      输入提示中的图像令牌数量。

    - `text_tokens: number`

      输入提示中的文本令牌数量。

  - `output_tokens: number`

    输出图像中的图像令牌数量。

  - `total_tokens: number`

    用于图像生成的令牌（图像和文本）总数。

### 示例

```json
{
  "type": "image_edit.completed",
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
