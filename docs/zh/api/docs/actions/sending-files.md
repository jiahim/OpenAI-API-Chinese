# 使用 GPT Actions 发送和返回文件

> 完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 发送文件

POST 请求最多可包含来自对话的十个文件（包括 DALL-E 生成的图像）。它们将以 URL 形式发送，且有效期为五分钟。

要使文件成为 POST 请求的一部分，参数必须命名为 `openaiFileIdRefs` 并且描述应告知模型你的 API 期望接收的文件的类型和数量。

该 `openaiFileIdRefs` 参数将填充为一个 JSON 对象数组。每个对象包含：

- `name` 文件的名称。由 DALL-E 创建时，这将是一个自动生成的名称。
- `id` 文件的稳定标识符。
- `mime_type` 文件的 MIME 类型。对于用户上传的文件，这基于文件扩展名。
- `download_link` 用于获取文件的 URL，有效期为五分钟。

以下是一个 `openaiFileIdRefs` 包含两个元素的数组示例：

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

操作可以包括用户上传的文件、DALL-E 生成的图像，以及 Code Interpreter 创建的文件。

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

虽然此架构将 `openaiFileIdRefs` 显示为类型为 `string`，的数组，但在运行时，这将如前所示填充为 JSON 对象的数组。

## 返回文件

请求最多可返回 10 个文件。每个文件最大可为 10 MB，且不能是图片或视频。

这些文件将像用户上传的文件一样成为对话的一部分，这意味着它们可能可供代码解释器、文件搜索使用，并作为后续操作调用的一部分发送。在 Web 应用中，用户将看到文件已被返回，并可以下载它们。

要返回文件，响应的正文必须包含一个 `openaiFileResponse` 参数。此参数必须始终是一个数组，且必须以两种方式之一进行填充。

### 行内选项

数组中的每个元素都是一个 JSON 对象，其中包含：

- `name` 文件名。这将向用户可见。
- `mime_type` 文件的 MIME 类型。这用于确定资格以及哪些功能可以访问该文件。
- `content` 文件的 base64 编码内容。

以下是一个包含两个元素的 openaiFileResponse 数组示例：

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

### URL 选项

数组中的每个元素都是一个 URL，指向要下载的文件。请求头 `Content-Disposition` 以及 `Content-Type` 必须进行设置，以便能够确定文件名和 MIME 类型。文件名将对用户可见。文件的 MIME 类型决定了其资格以及哪些功能可以访问该文件。

获取每个文件有 10 秒的超时时间。

以下是一个包含两个元素的 `openaiFileResponse` 数组示例：

```json
[
  "https://example.com/f/dca89f18-16d4-4a65-8ea2-ededced01646",
  "https://example.com/f/01fad6b0-635b-4803-a583-0f678b2e6153"
]
```

以下是为每个 URL 所需的请求头示例：

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