# 批处理 API

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

了解如何使用 OpenAI 的批量 API 发送异步请求组，享受 50% 更低的成本、独立且显著更高的速率限制池，以及明确的 24 小时周转时间。该服务非常适合处理不需要即时响应的作业。你也可以 [直接在此处探索 API 参考文档](https://developers.openai.com/api/reference/resources/batches).

## 概述

虽然 OpenAI 平台的某些用途需要你发送同步请求，但在许多情况下，请求并不需要立即响应，或者 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits) 会阻止你快速执行大量查询。批处理作业在以下场景中通常很有帮助：

1. 运行评估
2. 对大型数据集进行分类
3. 嵌入内容仓库
4. 排队大型离线视频渲染任务

批量API提供了一套简洁的端点，让你能够将一组请求收集到单个文件中，启动一个批处理作业来执行这些请求，在底层请求执行时查询该批处理的状态，并在批处理完成后最终检索收集到的结果。

与直接使用标准端点相比，批量API具有以下特点：

1. **更好的成本效率：** 与同步 API 相比，可享受 50% 的成本折扣
2. **更高的速率限制：** [更高的余量](https://platform.openai.com/settings/organization/limits) 与同步 API 相比
3. **更快的完成时间：** 每个批次在 24 小时内完成（通常更快）

## 开始使用

### 1. 准备你的批处理文件

批次以一个 `.jsonl` 文件开始，其中每一行包含对 API 的单个请求的详细信息。目前，可用的端点为：

- `/v1/responses` ([Responses API](https://developers.openai.com/api/reference/resources/responses))
- `/v1/chat/completions` ([Chat Completions API](https://developers.openai.com/api/reference/resources/chat))
- `/v1/embeddings` ([Embeddings API](https://developers.openai.com/api/reference/resources/embeddings))
- `/v1/completions` ([Completions API](https://developers.openai.com/api/reference/resources/completions))
- `/v1/moderations` ([审核指南](https://developers.openai.com/api/docs/guides/moderation))
- `/v1/images/generations` ([Images API](https://developers.openai.com/api/reference/resources/images))
- `/v1/images/edits` ([Images API](https://developers.openai.com/api/reference/resources/images))
- `/v1/videos` ([视频生成指南](https://developers.openai.com/api/docs/guides/video-generation))

对于给定的输入文件，每一行参数中的 `body` 字段与底层端点的参数相同。每个请求必须包含一个唯一的 `custom_id` 值，你可以使用该值在完成后引用结果。以下是一个包含 2 个请求的输入文件示例。请注意，每个输入文件只能包含对单个模型的请求。

对于批量处理中的视频生成：

- Batch 目前支持 `POST /v1/videos` 。
- 视频的批量请求必须使用 JSON，而非 multipart。
- 提前上传资源，并在请求体中传递支持的资源引用，而不是使用 multipart 上传。
- 使用 `input_reference` 进行 Batch 中的图像引导生成。在 JSON 请求中，传递 `input_reference` 作为一个包含 `file_id` 或 `image_url`.
- Multipart `input_reference` 上传，包括视频引用输入，在 Batch 中不受支持。
- 批量生成的视频可在 Batch 完成后下载最多 `24` 小时。

当目标为 `/v1/moderations`，时，在每个请求体中包含一个 `input` 字段。Batch 接受纯文本输入以及包含文本或图像输入的内容数组，使用 `omni-moderation-latest`。Batch 工作进程会拒绝设置 `stream=true`，的请求，与同步审核端点一致。

```jsonl
{"custom_id": "request-1", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gpt-3.5-turbo-0125", "messages": [{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": "Hello world!"}],"max_tokens": 1000}}
{"custom_id": "request-2", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gpt-3.5-turbo-0125", "messages": [{"role": "system", "content": "You are an unhelpful assistant."},{"role": "user", "content": "Hello world!"}],"max_tokens": 1000}}
```

#### 审核输入示例

仅文本请求：

```jsonl
{
  "custom_id": "moderation-text-1",
  "method": "POST",
  "url": "/v1/moderations",
  "body": {
    "model": "omni-moderation-latest",
    "input": "This is a harmless test sentence."
  }
}
```

带有文本和图像输入的请求：

```jsonl
{
  "custom_id": "moderation-mm-1",
  "method": "POST",
  "url": "/v1/moderations",
  "body": {
    "model": "omni-moderation-latest",
    "input": [
      {
        "type": "text",
        "text": "Describe this image"
      },
      {
        "type": "image_url",
        "image_url": {
          "url": "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg"
        }
      }
    ]
  }
}
```

建议引用远程资源，使用 `image_url` （而不是 base64 块）来
  保持你的 `.jsonl` 文件远低于 200&nbsp;MB 批量上传限制，
  尤其是对于多模态审核请求。

### 2. 上传你的批量输入文件

与我们 [微调 API](https://developers.openai.com/api/docs/guides/model-optimization)，类似，你必须首先上传输入文件，以便在启动批次时正确引用它。使用 `.jsonl` 文件，通过 [文件 API](https://developers.openai.com/api/reference/resources/files).

为批量 API 上传文件

```javascript
import fs from "fs";
import OpenAI from "openai";
const openai = new OpenAI();

const file = await openai.files.create({
  file: fs.createReadStream("fixtures/batchinput.jsonl"),
  purpose: "batch",
});

console.log(file);
```

```python
from openai import OpenAI

client = OpenAI()

batch_input_file = client.files.create(
    file=open("batchinput.jsonl", "rb"), purpose="batch"
)

print(batch_input_file)
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	file, err := os.Open("batchinput.jsonl")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	uploaded, err := client.Files.New(context.Background(), openai.FileNewParams{
		File:    file,
		Purpose: openai.FilePurposeBatch,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(uploaded.ID)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.files.FileCreateParams;
import com.openai.models.files.FilePurpose;
import java.nio.file.Path;

var file =
    client
        .files()
        .create(
            FileCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_FILE_PATH")))
                .purpose(FilePurpose.BATCH)
                .build());

System.out.println(file.id());
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
file = Pathname("batchinput.jsonl")
uploaded = client.files.create(file: file, purpose: :batch)
puts(uploaded.id)
```

```bash
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="batch" \
  -F file="@batchinput.jsonl"
```

```bash
openai files create \
  --file batchinput.jsonl \
  --purpose batch
```


### 3. 创建批次

成功上传输入文件后，你可以使用输入 File 对象的 ID 来创建批次。在此示例中，假设文件 ID 为 `file-abc123`。目前，完成窗口只能设置为 `24h`。你还可以通过可选的 `metadata` 参数提供自定义元数据。

创建批次

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const batch = await openai.batches.create({
  input_file_id: "file-abc123",
  endpoint: "/v1/chat/completions",
  completion_window: "24h",
});

console.log(batch);
```

```python
batch = client.batches.create(
    input_file_id=batch_input_file.id,
    endpoint="/v1/chat/completions",
    completion_window="24h",
    metadata={"description": "nightly eval job"},
)
print(batch)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	batch, err := client.Batches.New(context.Background(), openai.BatchNewParams{
		InputFileID:      "file-abc123",
		Endpoint:         openai.BatchNewParamsEndpointV1ChatCompletions,
		CompletionWindow: openai.BatchNewParamsCompletionWindow24h,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(batch.ID)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.batches.BatchCreateParams;

String fileId = "file-abc123";

var batch =
    client
        .batches()
        .create(
            BatchCreateParams.builder()
                .inputFileId(fileId)
                .endpoint(BatchCreateParams.Endpoint.V1_RESPONSES)
                .completionWindow(BatchCreateParams.CompletionWindow._24H)
                .build());

System.out.println(batch.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
batch = client.batches.create(input_file_id: "file-abc123", endpoint: "/v1/responses", completion_window: "24h")
puts(batch.id)
```

```bash
curl https://api.openai.com/v1/batches \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input_file_id": "file-abc123",
    "endpoint": "/v1/chat/completions",
    "completion_window": "24h"
  }'
```

```bash
openai batches create \
  --input-file-id file-abc123 \
  --endpoint /v1/chat/completions \
  --completion-window 24h
```


此请求将返回一个 [Batch 对象](https://developers.openai.com/api/reference/resources/batches) ，其中包含有关你的批次的元数据：

```json
{
  "id": "batch_abc123",
  "object": "batch",
  "endpoint": "/v1/chat/completions",
  "errors": null,
  "input_file_id": "file-abc123",
  "completion_window": "24h",
  "status": "validating",
  "output_file_id": null,
  "error_file_id": null,
  "created_at": 1714508499,
  "in_progress_at": null,
  "expires_at": 1714536634,
  "completed_at": null,
  "failed_at": null,
  "expired_at": null,
  "request_counts": {
    "total": 0,
    "completed": 0,
    "failed": 0
  },
  "metadata": null
}
```

### 4. 检查批处理的状态

你可以随时检查批次的状态，这也将返回一个 Batch 对象。

检查批次状态

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const batch = await openai.batches.retrieve("batch_abc123");
console.log(batch);
```

```python
batch = client.batches.retrieve(batch.id)
print(batch)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	batch, err := client.Batches.Get(context.Background(), "batch_abc123")
	if err != nil {
		panic(err)
	}
	fmt.Println(batch.Status)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

String batchId = "batch_abc123";

var batch = client.batches().retrieve(batchId);

System.out.println(batch.status());
```

```ruby
require "openai"

client = OpenAI::Client.new
batch = client.batches.retrieve("batch_abc123")
puts(batch.status)
```

```bash
curl https://api.openai.com/v1/batches/batch_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

```bash
openai batches retrieve \
  --batch-id batch_abc123
```


给定 Batch 对象的状态可以是以下任意一种：

| 状态        | 描述                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| `validating`  | 输入文件正在验证中，批次尚未开始                   |
| `failed`      | 输入文件未通过验证过程                               |
| `in_progress` | 输入文件已成功验证，批次当前正在运行 |
| `finalizing`  | 批次已完成，正在准备结果                     |
| `completed`   | 批次已完成，结果已就绪                         |
| `expired`     | 批次无法在24小时时间窗口内完成          |
| `cancelling`  | 批次正在被取消（可能需要最多10分钟）                       |
| `cancelled`   | 批次已被取消                                                        |

### 5. 检索结果

批次完成后，你可以通过对以下内容发起请求来下载输出 [Files API](https://developers.openai.com/api/reference/resources/files) 通过 `output_file_id` 从 Batch 对象中的字段并将其写入到你机器上的文件中，在本例中为 `batch_output.jsonl`

检索批次结果

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const fileResponse = await openai.files.content("file-xyz123");
const fileContents = await fileResponse.text();

console.log(fileContents);
```

```python
import os

from openai import OpenAI

output_file_id = os.environ["OPENAI_BATCH_OUTPUT_FILE_ID"]
client = OpenAI()

file_response = client.files.content(output_file_id)
print(file_response.text)
```

```go
package main

import (
	"context"
	"fmt"
	"io"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	response, err := client.Files.Content(context.Background(), "file-xyz123")
	if err != nil {
		panic(err)
	}
	defer response.Body.Close()
	contents, err := io.ReadAll(response.Body)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(contents))
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.HttpResponse;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

String fileId = "file-xyz123";

try (HttpResponse content = client.files().content(fileId)) {
  Files.copy(
      content.body(), Path.of("batch_output.jsonl"), StandardCopyOption.REPLACE_EXISTING);
}
```

```ruby
require "openai"

client = OpenAI::Client.new
content = client.files.content("file-xyz123")
puts(content.read)
```

```bash
curl https://api.openai.com/v1/files/file-xyz123/content \
  -H "Authorization: Bearer $OPENAI_API_KEY" > batch_output.jsonl
```

```bash
openai files content \
  --file-id file-xyz123 \
  --output batch_output.jsonl
```


输出 `.jsonl` 文件中，输入文件中的每个成功请求行将对应一个响应行。批次中任何失败的请求，其错误信息都会被写入一个错误文件，你可以通过批次的 `error_file_id`.

对于 `/v1/videos`，一个已完成的批次结果包含已达到终态（如 `completed`, `failed`，或 `expired`）的视频对象。你可以使用返回的视频 ID 在批次完成后立即下载最终资产。

请注意，输出行的顺序 **可能与** 输入行的顺序不一致。
  不要依赖顺序来处理结果，请使用 custom_id 字段，
  该字段会出现在输出文件的每一行中，使你能够将
  输入中的请求与输出中的结果对应起来。

```jsonl
{"id": "batch_req_123", "custom_id": "request-2", "response": {"status_code": 200, "request_id": "req_123", "body": {"id": "chatcmpl-123", "object": "chat.completion", "created": 1711652795, "model": "gpt-3.5-turbo-0125", "choices": [{"index": 0, "message": {"role": "assistant", "content": "Hello."}, "logprobs": null, "finish_reason": "stop"}], "usage": {"prompt_tokens": 22, "completion_tokens": 2, "total_tokens": 24}, "system_fingerprint": "fp_123"}}, "error": null}
{"id": "batch_req_456", "custom_id": "request-1", "response": {"status_code": 200, "request_id": "req_789", "body": {"id": "chatcmpl-abc", "object": "chat.completion", "created": 1711652789, "model": "gpt-3.5-turbo-0125", "choices": [{"index": 0, "message": {"role": "assistant", "content": "Hello! How can I assist you today?"}, "logprobs": null, "finish_reason": "stop"}], "usage": {"prompt_tokens": 20, "completion_tokens": 9, "total_tokens": 29}, "system_fingerprint": "fp_3ba"}}, "error": null}
```

输出文件将在批次完成后 30 天自动删除。

### 6. 取消一个批次

如有必要，你可以取消进行中的批处理。批处理的状态将变为 `cancelling` ，直到在途请求完成（最多 10 分钟），之后状态将变为 `cancelled`.

取消批处理

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const batch = await openai.batches.cancel("batch_abc123");
console.log(batch);
```

```python
import os

from openai import OpenAI

batch_id = os.environ["OPENAI_BATCH_ID"]
client = OpenAI()

client.batches.cancel(batch_id)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	batch, err := client.Batches.Cancel(context.Background(), "batch_abc123")
	if err != nil {
		panic(err)
	}
	fmt.Println(batch.Status)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

String batchId = "batch_abc123";

System.out.println(client.batches().cancel(batchId).status());
```

```ruby
require "openai"

client = OpenAI::Client.new
batch = client.batches.cancel("batch_abc123")
puts(batch.status)
```

```bash
curl https://api.openai.com/v1/batches/batch_abc123/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -X POST
```

```bash
openai batches cancel \
  --batch-id batch_abc123
```


### 7. 获取所有批次的列表

你随时可以查看所有批次。对于批次较多的用户，你可以使用 `limit` 和 `after` 参数来对结果进行分页。

获取所有批次的列表

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const list = await openai.batches.list();

for await (const batch of list) {
  console.log(batch);
}
```

```python
from openai import OpenAI

client = OpenAI()

client.batches.list(limit=10)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	list := client.Batches.ListAutoPaging(context.Background(), openai.BatchListParams{Limit: openai.Int(10)})
	for list.Next() {
		fmt.Println(list.Current().ID)
	}
	if err := list.Err(); err != nil {
		panic(err)
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.batches.BatchListParams;

client
    .batches()
    .list(BatchListParams.builder().limit(10).build())
    .autoPager()
    .forEach(batch -> System.out.println(batch.id()));
```

```ruby
require "openai"

client = OpenAI::Client.new
client.batches.list(limit: 10).auto_paging_each do |batch|
  puts(batch.id)
end
```

```bash
curl https://api.openai.com/v1/batches?limit=10 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

```bash
openai batches list \
  --limit 10
```


## 模型可用性

批量 API 在我们的绝大多数模型中广泛可用，但并非所有模型都支持。请参阅 [模型参考文档](https://developers.openai.com/api/docs/models) 以确保你所使用的模型支持批量 API。

## 速率限制

批量 API 速率限制与现有的按模型速率限制是分开的。批量 API 有三种类型的速率限制：

1. **每个批次的限制：** 单个批次最多可包含 50,000 个请求，且批次输入文件大小上限为 200 MB。请注意， `/v1/embeddings` 批次中所有请求的嵌入输入总数也限制为最多 50,000 个。
2. **每个模型的排队提示词令牌数：** 每个模型有可排队用于批处理的提示词令牌数量上限。你可以在 [平台设置页面](https://platform.openai.com/settings/organization/limits).
3. **批次创建速率限制：** 你每小时最多可创建 2,000 个批次。如需提交更多请求，请增加每个批次的请求数量。

Batch API 目前没有输出令牌限制。由于 Batch API 速率限制是一个新的独立池， **使用 Batch API 不会消耗你标准按模型速率限制中的令牌，**，从而为你提供一种便捷的方式，在查询我们的 API 时增加可用请求数和已处理令牌数。

## 批量任务过期

未及时完成的批处理最终会进入 `expired` 状态；该批处理中未完成的请求将被取消，而已完成请求的任何响应都会通过批处理的输出文件提供。你将按已完成请求消耗的令牌数被收费。

过期的请求将被写入你的错误文件，并显示如下所示的消息。你可以使用 `custom_id` 来检索过期请求的数据。

```jsonl
{"id": "batch_req_123", "custom_id": "request-3", "response": null, "error": {"code": "batch_expired", "message": "This request could not be executed before the completion window expired."}}
{"id": "batch_req_123", "custom_id": "request-7", "response": null, "error": {"code": "batch_expired", "message": "This request could not be executed before the completion window expired."}}
```