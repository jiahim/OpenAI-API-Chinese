# Batch API

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾添加 `.md` 来获取。

了解如何使用 OpenAI 的 Batch API 异步发送请求组，成本降低 50%，并使用独立的更高速率限制池，以及明确的 24 小时周转时间。该服务非常适合处理不需要立即响应的任务。你还可以 [直接在此浏览 API 参考](https://developers.openai.com/api/reference/resources/batches).

## 概述

虽然 OpenAI 平台的某些用法要求你发送同步请求，但在许多情况下请求不需要立即响应，或者 [速率限制](https://developers.openai.com/api/docs/guides/rate-limits) 防止你过快执行大量查询。批处理作业在以下用例中通常很有帮助：

1. 运行评测
2. 对大型数据集进行分类
3. 为内容仓库生成嵌入

Batch API 提供了一组简洁的接口,允许你将一组请求整合到单个文件中,启动一个批处理作业来执行这些请求,在底层请求执行期间查询该批处理的状态,并在批处理完成后取回已收集的结果。

与直接使用标准接口相比,Batch API 具有以下优势:

1. **更好的成本效益：** 相比同步 API 价格降低 50%
2. **更高的速率限制：** [大幅提升的可用容量](https://platform.openai.com/settings/organization/limits) 相比同步 API
3. **快速的完成时间：** 每个批次在 24 小时内完成（且通常更快）

## 入门

### 1. 准备你的批处理文件

批处理从一个文件开始，该文件中每一行包含对 `.jsonl` 文件，其中每行包含对 API 的单个请求的详细信息。目前可用的端点包括：

- `/v1/responses` ([Responses API](https://developers.openai.com/api/reference/resources/responses))
- `/v1/chat/completions` ([Chat Completions API](https://developers.openai.com/api/reference/resources/chat))
- `/v1/embeddings` ([Embeddings API](https://developers.openai.com/api/reference/resources/embeddings))
- `/v1/completions` ([Completions API](https://developers.openai.com/api/reference/resources/completions))
- `/v1/moderations` ([审核指南](https://developers.openai.com/api/docs/guides/moderation))
- `/v1/images/generations` ([Images API](https://developers.openai.com/api/reference/resources/images))
- `/v1/images/edits` ([Images API](https://developers.openai.com/api/reference/resources/images))

对于给定的输入文件，每行的 `body` 字段参数与对应底层端点的参数相同。每个请求必须包含一个唯一的 `custom_id` 值，你可以在请求完成后使用该值来引用结果。下面是一个包含 2 个请求的输入文件示例。请注意，每个输入文件只能包含针对单个模型的请求。

当指定 `/v1/moderations`，时，请在每个请求体中包含一个 `input` 字段。Batch 接受纯文本输入以及使用 `omni-moderation-latest`。的文本或图像输入内容数组。Batch worker 会拒绝设置 `stream=true`，的请求，这与同步 moderation endpoint 一致。

```jsonl
{"custom_id": "request-1", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gpt-3.5-turbo-0125", "messages": [{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": "Hello world!"}],"max_tokens": 1000}}
{"custom_id": "request-2", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gpt-3.5-turbo-0125", "messages": [{"role": "system", "content": "You are an unhelpful assistant."},{"role": "user", "content": "Hello world!"}],"max_tokens": 1000}}
```

#### 审核输入示例

纯文本请求：

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

优先使用以下方式引用远程资源 `image_url` （而不是 base64 blob），以便
  将你的 `.jsonl` 文件控制在 200&nbsp;MB 批量上传上限以内，
  尤其是多模态 Moderations 请求。

### 2. 上传你的批量输入文件

与我们的 [微调 API](https://developers.openai.com/api/docs/guides/model-optimization)，类似，你必须先上传输入文件，以便在启动批量任务时能够正确引用它。通过 `.jsonl` 文件 [API 上传你的文件](https://developers.openai.com/api/reference/resources/files).

为 Batch API 上传文件

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

成功上传输入文件后，你可以使用输入 File 对象的 ID 来创建批量任务。这里我们假设文件 ID 为 `file-abc123`。目前，completion window 只能设置为 `24h`。你还可以通过可选的 `metadata` 参数提供自定义元数据。

创建批量任务

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


该请求将返回一个 [Batch 对象](https://developers.openai.com/api/reference/resources/batches) ，其中包含关于你的批量任务的元数据：

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

你可以随时查看批处理的状态，响应中也会返回一个 Batch 对象。

查看批处理状态

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


指定的 Batch 对象的状态可以是以下任意一种：

| 状态        | 说明                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| `validating`  | 输入文件正在验证中，需通过验证后批次才会开始                   |
| `failed`      | 输入文件未通过验证流程                               |
| `in_progress` | 输入文件已成功验证，批次目前正在执行中 |
| `finalizing`  | 批次已执行完毕，正在准备结果                     |
| `completed`   | 批次已执行完毕，结果已就绪                         |
| `expired`     | 批次在 24 小时时间窗口内未能完成          |
| `cancelling`  | 批次正在被取消（可能需要最长 10 分钟）                       |
| `cancelled`   | 批次已被取消                                                        |

### 5. 检索结果

批量任务完成后，你可以通过对 [API 上传你的文件](https://developers.openai.com/api/reference/resources/files) 发起 `output_file_id` 字段发起请求，将 Batch 对象中的输出文件下载到本地，本例中为 `batch_output.jsonl`

检索批量结果

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const fileResponse = await openai.files.content("file-xyz123");
const fileContents = await fileResponse.text();

console.log(fileContents);
```

```python
# Replace the illustrative IDs and URLs below with your own resource values.

from openai import OpenAI

output_file_id = "file_123"
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


输出 `.jsonl` 文件将为输入文件中的每个成功请求行生成一条对应的响应行。批量中任何失败的请求，其错误信息会被写入一个错误文件，可通过批量的 `error_file_id`.

请注意，输出行的顺序 **可能与** 输入行的顺序不一致。
  不要依赖顺序来处理结果，而应使用 custom_id 字段，
  该字段会出现在输出文件的每一行中，使你能够将
  输入中的请求与输出中的结果进行映射。

```jsonl
{"id": "batch_req_123", "custom_id": "request-2", "response": {"status_code": 200, "request_id": "req_123", "body": {"id": "chatcmpl-123", "object": "chat.completion", "created": 1711652795, "model": "gpt-3.5-turbo-0125", "choices": [{"index": 0, "message": {"role": "assistant", "content": "Hello."}, "logprobs": null, "finish_reason": "stop"}], "usage": {"prompt_tokens": 22, "completion_tokens": 2, "total_tokens": 24}, "system_fingerprint": "fp_123"}}, "error": null}
{"id": "batch_req_456", "custom_id": "request-1", "response": {"status_code": 200, "request_id": "req_789", "body": {"id": "chatcmpl-abc", "object": "chat.completion", "created": 1711652789, "model": "gpt-3.5-turbo-0125", "choices": [{"index": 0, "message": {"role": "assistant", "content": "Hello! How can I assist you today?"}, "logprobs": null, "finish_reason": "stop"}], "usage": {"prompt_tokens": 20, "completion_tokens": 9, "total_tokens": 29}, "system_fingerprint": "fp_3ba"}}, "error": null}
```

输出文件将在批量完成后 30 天被自动删除。

### 6. 取消批量任务

必要时，你可以取消正在进行的批量任务。批量任务的状态将变为 `cancelling` ，直至所有进行中的请求完成（最多 10 分钟），之后状态将变为 `cancelled`.

取消批量任务

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const batch = await openai.batches.cancel("batch_abc123");
console.log(batch);
```

```python
# Replace the illustrative IDs and URLs below with your own resource values.

from openai import OpenAI

batch_id = "batch_123"
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

你可以随时查看所有的批量任务。对于拥有较多批量任务的用户，可以使用 `limit` 和 `after` 参数对结果进行分页。

获取所有批量任务的列表

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

Batch API 已在我们的绝大多数模型中广泛可用，但并非全部模型都支持。请参阅 [模型参考文档](https://developers.openai.com/api/docs/models) 以确认你使用的模型支持 Batch API。对于 GPT-6 Sol 和 Luna，欧盟数据驻留仅在使用 Standard 处理时可用。参见 [数据驻留适用资格](https://developers.openai.com/api/docs/guides/your-data#which-models-and-features-are-eligible-for-data-residency).

## 速率限制

Batch API 速率限制与现有的各模型速率限制是分开的。Batch API 有三类速率限制：

1. **每批次限制：** 单个批次最多可包含 50,000 个请求，批次输入文件最大为 200 MB。请注意， `/v1/embeddings` 批次中所有请求的 embedding 输入总数也限制为最多 50,000 个。
2. **每个模型的已排队提示令牌数：** 每个模型都有一个可用于批次排队的提示令牌数上限。你可以在 [平台设置页面](https://platform.openai.com/settings/organization/limits).
3. **批次创建速率限制：** 你每小时最多可创建 2,000 个批次。如果需要提交更多请求，请增加每个批次中的请求数。

Batch API 目前没有输出 token 上限。由于 Batch API 的速率限制是一个全新的独立资源池， **使用 Batch API 不会消耗你标准按模型速率限制中的 token**，从而为你提供一种便捷的方式来增加在调用我们的 API 时可使用的请求数量和处理 token 数。

## 批量过期

无法在时限内完成的批次最终将转为 `expired` 状态；该批次中未完成的请求将被取消，任何已完成的请求所对应的响应会通过该批次的输出文件提供。已完成请求所产生的 token 消耗都将向你收取费用。

过期请求将被写入你的错误文件，并附带如下所示的消息。你可以使用 `custom_id` 来检索过期请求的请求数据。

```jsonl
{"id": "batch_req_123", "custom_id": "request-3", "response": null, "error": {"code": "batch_expired", "message": "This request could not be executed before the completion window expired."}}
{"id": "batch_req_123", "custom_id": "request-7", "response": null, "error": {"code": "batch_expired", "message": "This request could not be executed before the completion window expired."}}
```