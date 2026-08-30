# 使用 GPT Actions 发送和返回文件

> 完整的文档索引请参见 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 来获取。

## 发送文件

POST 请求可以包含来自对话的最多十个文件（包括 DALL-E 生成的图像）。它们将以 URL 的形式发送，这些 URL 在五分钟内有效。

要使文件成为你 POST 请求的一部分，参数必须命名为 `openaiFileIdRefs` ，并且描述应向模型说明你的 API 期望的文件类型和数量。

该 `openaiFileIdRefs` 参数将被填充为一个 JSON 对象数组。每个对象包含：

- `name` 文件的名称。由 DALL-E 创建时将自动生成该名称。
- `id` 文件的稳定标识符。
- `mime_type` 文件的 MIME 类型。对于用户上传的文件，该类型基于文件扩展名确定。
- `download_link` 用于获取文件的 URL，有效期为五分钟。

下面是一个 `openaiFileIdRefs` 包含两个元素的数组：

```json
[
  {
    "name": "dalle-Lh2tg7WuosbyR9hk",
    "id": "file-XFlOqJYTPBPwMZE3IopCBv1Z",
    "mime_type": "image/webp",
    "download_link": "https://files.oaiusercontent.com/file-XFlOqJYTPBPwMZE3IopCBv1Z?se=2024-03-11T20%3A29%3A52Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3Da580bae6-ea30-478e-a3e2-1f6c06c3e02f.webp&sig=ZPWol5eXACxU1O9azLwRNgKVidCe%2BwgMOc/TdrPGYII%3D"
  },
  {
    "name": "2023 Benefits Booklet.pdf",
    "id": "file-s5nX7o4junn2ig0J84r8Q0Ew",
    "mime_type": "application/pdf",
    "download_link": "https://files.oaiusercontent.com/file-s5nX7o4junn2ig0J84r8Q0Ew?se=2024-03-11T20%3A29%3A52Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D299%2C%20immutable&rscd=attachment%3B%20filename%3D2023%2520Benefits%2520Booklet.pdf&sig=Ivhviy%2BrgoyUjxZ%2BingpwtUwsA4%2BWaRfXy8ru9AfcII%3D"
  }
]
```

Actions 可以包括用户上传的文件、由 DALL-E 生成的图像，以及由 Code Interpreter 创建的文件。

### OpenAPI 示例

```yaml
/createWidget:
  post:
    operationId: createWidget
    summary: Creates a widget based on an image.
    description: Uploads a file reference using its file id. This file should be an image created by DALL·E or uploaded by the user. JPG, WEBP, and PNG are supported for widget creation.
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              openaiFileIdRefs:
                type: array
                items:
                  type: string
```

虽然此架构显示 `openaiFileIdRefs` 为一个数组，类型为 `string`，但在运行时，它将填充为前面所示的 JSON 对象数组。

## 返回文件

单个请求最多可返回 10 个文件。每个文件最大 10 MB，且不能是图片或视频。

这些文件将像用户上传的一样成为对话的一部分，意味着它们可能会被提供给代码解释器、文件搜索，并在后续的操作调用中一并发送。在网页应用中，用户会看到这些文件已被返回，并可以下载它们。

要返回文件，响应体必须包含一个 `openaiFileResponse` 参数。此参数必须始终是数组，并且必须以下面两种方式之一填充。

### 内联选项

数组的每个元素都是一个 JSON 对象，包含:

- `name` 文件的名称。用户可以看到此名称。
- `mime_type` 文件的 MIME 类型。用于确定文件是否符合使用条件以及哪些功能可以访问该文件。
- `content` 文件的 base64 编码内容。

下面是一个包含两个元素的 openaiFileResponse 数组示例：

```json
[
  {
    "name": "example_document.pdf",
    "mime_type": "application/pdf",
    "content": "JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PC9MZW5ndGggNiAwIFIvRmlsdGVyIC9GbGF0ZURlY29kZT4+CnN0cmVhbQpHhD93PQplbmRzdHJlYW0KZW5kb2JqCg=="
  },
  {
    "name": "sample_spreadsheet.csv",
    "mime_type": "text/csv",
    "content": "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=="
  }
]
```

OpenAPI 示例

```yaml
/papers:
  get:
    operationId: findPapers
    summary: Retrieve PDFs of relevant academic papers.
    description: Provided an academic topic, up to five relevant papers will be returned as PDFs.
    parameters:
      - in: query
        name: topic
        required: true
        schema:
          type: string
        description: The topic the papers should be about.
    responses:
      "200":
        description: Zero to five academic paper PDFs
        content:
          application/json:
            schema:
              type: object
              properties:
                openaiFileResponse:
                  type: array
                  items:
                    type: object
                    properties:
                      name:
                        type: string
                        description: The name of the file.
                      mime_type:
                        type: string
                        description: The MIME type of the file.
                      content:
                        type: string
                        format: byte
                        description: The content of the file in base64 encoding.
```

### URL option

数组的每个元素都是一个 URL，引用要下载的文件。请求头 `Content-Disposition` 和 `Content-Type` 必须设置为可以确定文件名和 MIME 类型的值。文件名对用户可见。文件的 MIME 类型决定其资格以及哪些功能可以访问该文件。

每个文件的获取有 10 秒的超时限制。

下面是一个 `openaiFileResponse` 包含两个元素的数组：

```json
[
  "https://example.com/f/dca89f18-16d4-4a65-8ea2-ededced01646",
  "https://example.com/f/01fad6b0-635b-4803-a583-0f678b2e6153"
]
```

以下是每个 URL 所需请求头的示例：

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="example_document.pdf"
```

OpenAPI 示例

```yaml
/papers:
  get:
    operationId: findPapers
    summary: Retrieve PDFs of relevant academic papers.
    description: Provided an academic topic, up to five relevant papers will be returned as PDFs.
    parameters:
      - in: query
        name: topic
        required: true
        schema:
          type: string
        description: The topic the papers should be about.
    responses:
      '200':
        description: Zero to five academic paper PDFs
        content:
            application/json:
              schema:
                type: object
                properties:
                  openaiFileResponse:
                    type: array
                    items:
                    type: string
                    format: uri
                    description: URLs to fetch the files.
```