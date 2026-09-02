# Batch API

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

了解如何使用 OpenAI 的 Batch API 以 50% 的更低成本发送异步请求组，享受独立的更高额度速率限制，以及明确的 24 小时周转时间。该服务非常适合处理不需要立即响应的任务。你还可以 [在此直接浏览 API 参考](https://developers.openai.com/api/reference/resources/batches).

## 概述

虽然 OpenAI 平台的某些用法要求你发送同步请求，但在许多情况下请求并不需要立即响应，或者 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits) 会阻止你快速执行大量查询。批处理任务在以下用例中通常很有用：

1. 运行评测
2. 对大型数据集进行分类
3. 嵌入内容存储库
4. 对大型离线视频渲染任务进行排队

Batch API 提供了一组简洁的接口，允许你将一组请求打包到单个文件中，启动批处理任务来执行这些请求，在底层请求执行过程中查询批处理任务的状态，并在批处理完成后检索汇总结果。

与直接使用标准接口相比，Batch API 具有以下特点：

1. **更优的成本效率：** 相比同步 API，成本折扣 50%
2. **更高的速率限制：** [显著更大的余量](https://platform.openai.com/settings/organization/limits) 相比同步 API
3. **更快的完成时间：** 每个批次在 24 小时内完成（通常更快）

## 入门

### 1. 准备批处理文件

批次从一个 `.jsonl` 文件开始，其中每行包含一个发往 API 的单个请求的详细信息。目前可用的端点包括：

- `/v1/responses` ([Responses API](https://developers.openai.com/api/reference/resources/responses))
- `/v1/chat/completions` ([Chat Completions API](https://developers.openai.com/api/reference/resources/chat))
- `/v1/embeddings` ([Embeddings API](https://developers.openai.com/api/reference/resources/embeddings))
- `/v1/completions` ([Completions API](https://developers.openai.com/api/reference/resources/completions))
- `/v1/moderations` ([审核指南](https://developers.openai.com/api/docs/guides/moderation))
- `/v1/images/generations` ([Images API](https://developers.openai.com/api/reference/resources/images))
- `/v1/images/edits` ([Images API](https://developers.openai.com/api/reference/resources/images))
- `/v1/videos` ([视频生成指南](https://developers.openai.com/api/docs/guides/video-generation))

对于给定的输入文件，每一行的 `body` 字段与底层端点的参数相同。每个请求必须包含唯一的 `custom_id` 值，你可以在完成后用它来引用结果。下面是一个包含 2 个请求的输入文件示例。请注意，每个输入文件只能包含发往同一模型的请求。

关于 Batch 中的视频生成：

- Batch 目前仅支持 `POST /v1/videos` 。
- 视频的 Batch 请求必须使用 JSON，不能使用 multipart。
- 请提前上传素材，并在请求体中传入受支持的素材引用，而不是使用 multipart 上传。
- 在 Batch 中用于 `input_reference` 的图像引导生成。在 JSON 请求中，传入作为对象的 `input_reference` ，其中包含 `file_id` 或 `image_url`.
- Multipart `input_reference` 上传（包括视频参考输入）在 Batch 中不受支持。
- Batch 生成的视频在批处理完成后可供下载，时长最长为 `24` 小时。

在针对 `/v1/moderations`，时，请在每个请求体中包含 `input` 字段。Batch 接受纯文本输入以及使用文本或图像输入的内容数组。 `omni-moderation-latest`。Batch 工作进程会拒绝设置这些参数的请求 `stream=true`，与同步的 moderation 端点一致。

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

包含文本和图像输入的请求：

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

推荐使用 `image_url` （而不是 base64 blob）来
  保持你的 `.jsonl` 文件大小远低于 200&nbsp;MB 的批量上传限制，
  特别是针对多模态 Moderations 请求。

### 2. 上传你的批量输入文件

与我们的 [微调 API](https://developers.openai.com/api/docs/guides/model-optimization)，类似，你需要先上传输入文件，以便在启动批次时正确引用它。上传你的 `.jsonl` 使用文件 [Files API](https://developers.openai.com/api/reference/resources/files).

上传文件用于 Batch API

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

成功上传输入文件后，你可以使用输入的 File 对象 ID 来创建 batch。这里，我们假设文件 ID 为 `file-abc123`。目前，completion window 只能设置为 `24h`。你还可以通过可选的 `metadata` 参数来提供自定义元数据。

创建 Batch

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


该请求将返回一个 [Batch 对象](https://developers.openai.com/api/reference/resources/batches) ，其中包含有关你 batch 的元数据：

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

### 4. 查看批量任务的状态

你可以随时检查批处理的状态，这也会返回一个 Batch 对象。

检查批处理的状态

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


给定的 Batch 对象的状态可以是以下任意一种：

| 状态        | 描述                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| `validating`  | 正在校验输入文件，然后才能开始批量任务                   |
| `failed`      | 输入文件未通过校验                               |
| `in_progress` | 输入文件已成功校验，正在执行批量任务 |
| `finalizing`  | 批量任务已完成，正在准备结果                     |
| `completed`   | 批量任务已完成，结果已就绪                         |
| `expired`     | 批量任务未能在 24 小时时间窗口内完成          |
| `cancelling`  | 批量任务正在取消（最长可能需要 10 分钟）                       |
| `cancelled`   | 批量任务已取消                                                        |

### 5. 获取结果

批次完成后，你可以通过向以下接口发起请求来下载输出 [Files API](https://developers.openai.com/api/reference/resources/files) 通过 `output_file_id` 字段（来自 Batch 对象）获取，并将内容写入你本地的文件，例如 `batch_output.jsonl`

获取批次结果

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


输出 `.jsonl` 文件中，输入文件里每一条成功的请求都会对应一行响应。批次中任何失败的请求，其错误信息会被写入一个错误文件，可通过该批次的 `error_file_id`.

对于 `/v1/videos`，已完成的批次结果包含已达到终止状态的视频对象，例如 `completed`, `failed`，或 `expired`。你可以使用返回的 video ID 在批次结束后立即下载最终资源。

请注意，输出行的顺序 **可能与** 输入行的顺序不一致。
  不要依赖顺序来处理结果，而是使用 custom_id 字段
  ，该字段会出现在输出文件的每一行中，方便你将
  输入中的请求映射到输出中的结果。

```jsonl
{"id": "batch_req_123", "custom_id": "request-2", "response": {"status_code": 200, "request_id": "req_123", "body": {"id": "chatcmpl-123", "object": "chat.completion", "created": 1711652795, "model": "gpt-3.5-turbo-0125", "choices": [{"index": 0, "message": {"role": "assistant", "content": "Hello."}, "logprobs": null, "finish_reason": "stop"}], "usage": {"prompt_tokens": 22, "completion_tokens": 2, "total_tokens": 24}, "system_fingerprint": "fp_123"}}, "error": null}
{"id": "batch_req_456", "custom_id": "request-1", "response": {"status_code": 200, "request_id": "req_789", "body": {"id": "chatcmpl-abc", "object": "chat.completion", "created": 1711652789, "model": "gpt-3.5-turbo-0125", "choices": [{"index": 0, "message": {"role": "assistant", "content": "Hello! How can I assist you today?"}, "logprobs": null, "finish_reason": "stop"}], "usage": {"prompt_tokens": 20, "completion_tokens": 9, "total_tokens": 29}, "system_fingerprint": "fp_3ba"}}, "error": null}
```

输出文件将在批次完成后 30 天被自动删除。

### 6. 取消批量任务

如果需要，你可以取消正在进行的批量任务。批量任务的状态将变为 `cancelling` ，直至所有进行中的请求完成（最多 10 分钟），之后状态将变为 `cancelled`.

取消批量任务

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


### 7. 获取所有批处理列表

你可以随时查看所有的批次。对于拥有大量批次的用户，你可以使用 `limit` 和 `after` 参数对结果进行分页。

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

Batch API 在我们的大多数模型中可用，但并非全部。请参阅 [模型参考文档](https://developers.openai.com/api/docs/models) 以确认你使用的模型支持 Batch API。

## 速率限制

Batch API 速率限制与现有的按模型速率限制是分开的。Batch API 有三种速率限制类型：

1. **每个批次的限制：** 单个批次最多可包含 50,000 个请求，批次输入文件大小最大为 200 MB。请注意， `/v1/embeddings` 批次中所有请求的 embedding 输入总数也限制为最多 50,000 个。
2. **每个模型的已排队 prompt token 数：** 每个模型都有一个可排队用于批处理的最大 prompt token 数。你可以在 [Platform Settings 页面](https://platform.openai.com/settings/organization/limits).
3. **批次创建速率限制：** 你每小时最多可以创建 2,000 个批次。如果需要提交更多请求，请增加每个批次的请求数量。

Batch API 目前没有输出 token 限制。由于 Batch API 速率限制是一个全新的独立池， **使用 Batch API 不会消耗你标准按模型速率限制中的 token**，从而为你提供了一种便捷的方式，可以在调用我们的 API 时增加可用请求数和已处理的 token 数。

## Batch 过期

未能在时限内完成的批次最终会转入 `expired` 状态；该批次中未完成的请求将被取消，已完成请求的任何响应可通过批次的输出文件获取。你将按已完成请求所消耗的 token 计费。

过期的请求将按下方所示消息写入你的错误文件。你可以使用 `custom_id` 检索过期请求的请求数据。

```jsonl
{"id": "batch_req_123", "custom_id": "request-3", "response": null, "error": {"code": "batch_expired", "message": "This request could not be executed before the completion window expired."}}
{"id": "batch_req_123", "custom_id": "request-7", "response": null, "error": {"code": "batch_expired", "message": "This request could not be executed before the completion window expired."}}
```