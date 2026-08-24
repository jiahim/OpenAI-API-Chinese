# Batch API

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Learn how to use OpenAI's Batch API to send asynchronous groups of requests with 50% lower costs, a separate pool of significantly higher rate limits, and a clear 24-hour turnaround time. The service is ideal for processing jobs that don't require immediate responses. You can also [explore the API reference directly here](https://developers.openai.com/api/reference/resources/batches).

## Overview

While some uses of the OpenAI Platform require you to send synchronous requests, there are many cases where requests do not need an immediate response or [rate limits](https://developers.openai.com/api/docs/guides/rate-limits) prevent you from executing a large number of queries quickly. Batch processing jobs are often helpful in use cases like:

1. Running evaluations
2. Classifying large datasets
3. Embedding content repositories
4. Queuing large offline video-render jobs

The Batch API offers a straightforward set of endpoints that allow you to collect a set of requests into a single file, kick off a batch processing job to execute these requests, query for the status of that batch while the underlying requests execute, and eventually retrieve the collected results when the batch is complete.

Compared to using standard endpoints directly, Batch API has:

1. **Better cost efficiency:** 50% cost discount compared to synchronous APIs
2. **Higher rate limits:** [Substantially more headroom](https://platform.openai.com/settings/organization/limits) compared to the synchronous APIs
3. **Fast completion times:** Each batch completes within 24 hours (and often more quickly)

## Getting started

### 1. Prepare your batch file

Batches start with a `.jsonl` file where each line contains the details of an individual request to the API. For now, the available endpoints are:

- `/v1/responses` ([Responses API](https://developers.openai.com/api/reference/resources/responses))
- `/v1/chat/completions` ([Chat Completions API](https://developers.openai.com/api/reference/resources/chat))
- `/v1/embeddings` ([Embeddings API](https://developers.openai.com/api/reference/resources/embeddings))
- `/v1/completions` ([Completions API](https://developers.openai.com/api/reference/resources/completions))
- `/v1/moderations` ([Moderation guide](https://developers.openai.com/api/docs/guides/moderation))
- `/v1/images/generations` ([Images API](https://developers.openai.com/api/reference/resources/images))
- `/v1/images/edits` ([Images API](https://developers.openai.com/api/reference/resources/images))
- `/v1/videos` ([Video generation guide](https://developers.openai.com/api/docs/guides/video-generation))

For a given input file, the parameters in each line's `body` field are the same as the parameters for the underlying endpoint. Each request must include a unique `custom_id` value, which you can use to reference results after completion. Here's an example of an input file with 2 requests. Note that each input file can only include requests to a single model.

For video generation in Batch:

- Batch currently supports `POST /v1/videos` only.
- Batch requests for videos must use JSON, not multipart.
- Upload assets ahead of time and pass supported asset references in the request body rather than using multipart uploads.
- Use `input_reference` for image-guided generations in Batch. In JSON requests, pass `input_reference` as an object with either `file_id` or `image_url`.
- Multipart `input_reference` uploads, including video reference inputs, aren't supported in Batch.
- Batch-generated videos are available for download for up to `24` hours after the batch completes.

When targeting `/v1/moderations`, include an `input` field in every request body. Batch accepts plain-text inputs and content arrays with text or image inputs using `omni-moderation-latest`. The Batch worker rejects requests that set `stream=true`, matching the synchronous moderation endpoint.

```jsonl
{"custom_id": "request-1", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gpt-3.5-turbo-0125", "messages": [{"role": "system", "content": "You are a helpful assistant."},{"role": "user", "content": "Hello world!"}],"max_tokens": 1000}}
{"custom_id": "request-2", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "gpt-3.5-turbo-0125", "messages": [{"role": "system", "content": "You are an unhelpful assistant."},{"role": "user", "content": "Hello world!"}],"max_tokens": 1000}}
```

#### Moderation input examples

Text-only request:

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

Request with text and image input:

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

Prefer referencing remote assets with `image_url` (instead of base64 blobs) to
  keep your `.jsonl` files well below the 200&nbsp;MB Batch upload limit,
  especially for multimodal Moderations requests.

### 2. Upload your batch input file

Similar to our [Fine-tuning API](https://developers.openai.com/api/docs/guides/model-optimization), you must first upload your input file so that you can reference it correctly when kicking off batches. Upload your `.jsonl` file using the [Files API](https://developers.openai.com/api/reference/resources/files).

Upload files for Batch API

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


### 3. Create the batch

Once you've successfully uploaded your input file, you can use the input File object's ID to create a batch. In this case, let's assume the file ID is `file-abc123`. For now, the completion window can only be set to `24h`. You can also provide custom metadata via an optional `metadata` parameter.

Create the Batch

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


This request will return a [Batch object](https://developers.openai.com/api/reference/resources/batches) with metadata about your batch:

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

### 4. Check the status of a batch

You can check the status of a batch at any time, which will also return a Batch object.

Check the status of a batch

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


The status of a given Batch object can be any of the following:

| Status        | Description                                                                    |
| ------------- | ------------------------------------------------------------------------------ |
| `validating`  | the input file is being validated before the batch can begin                   |
| `failed`      | the input file has failed the validation process                               |
| `in_progress` | the input file was successfully validated and the batch is currently being run |
| `finalizing`  | the batch has completed and the results are being prepared                     |
| `completed`   | the batch has been completed and the results are ready                         |
| `expired`     | the batch was not able to be completed within the 24-hour time window          |
| `cancelling`  | the batch is being cancelled (may take up to 10 minutes)                       |
| `cancelled`   | the batch was cancelled                                                        |

### 5. Retrieve the results

Once the batch is complete, you can download the output by making a request against the [Files API](https://developers.openai.com/api/reference/resources/files) via the `output_file_id` field from the Batch object and writing it to a file on your machine, in this case `batch_output.jsonl`

Retrieving the batch results

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


The output `.jsonl` file will have one response line for every successful request line in the input file. Any failed requests in the batch will have their error information written to an error file that can be found via the batch's `error_file_id`.

For `/v1/videos`, a completed batch result contains video objects that have already reached a terminal state such as `completed`, `failed`, or `expired`. You can use the returned video IDs to download final assets immediately after the batch finishes.

Note that the output line order **may not match** the input line order.
  Instead of relying on order to process your results, use the custom_id field
  which will be present in each line of your output file and allow you to map
  requests in your input to results in your output.

```jsonl
{"id": "batch_req_123", "custom_id": "request-2", "response": {"status_code": 200, "request_id": "req_123", "body": {"id": "chatcmpl-123", "object": "chat.completion", "created": 1711652795, "model": "gpt-3.5-turbo-0125", "choices": [{"index": 0, "message": {"role": "assistant", "content": "Hello."}, "logprobs": null, "finish_reason": "stop"}], "usage": {"prompt_tokens": 22, "completion_tokens": 2, "total_tokens": 24}, "system_fingerprint": "fp_123"}}, "error": null}
{"id": "batch_req_456", "custom_id": "request-1", "response": {"status_code": 200, "request_id": "req_789", "body": {"id": "chatcmpl-abc", "object": "chat.completion", "created": 1711652789, "model": "gpt-3.5-turbo-0125", "choices": [{"index": 0, "message": {"role": "assistant", "content": "Hello! How can I assist you today?"}, "logprobs": null, "finish_reason": "stop"}], "usage": {"prompt_tokens": 20, "completion_tokens": 9, "total_tokens": 29}, "system_fingerprint": "fp_3ba"}}, "error": null}
```

The output file will automatically be deleted 30 days after the batch is complete.

### 6. Cancel a batch

If necessary, you can cancel an ongoing batch. The batch's status will change to `cancelling` until in-flight requests are complete (up to 10 minutes), after which the status will change to `cancelled`.

Cancelling a batch

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


### 7. Get a list of all batches

At any time, you can see all your batches. For users with many batches, you can use the `limit` and `after` parameters to paginate your results.

Getting a list of all batches

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


## Model availability

The Batch API is widely available across most of our models, but not all. Please refer to the [model reference docs](https://developers.openai.com/api/docs/models) to ensure the model you're using supports the Batch API.

## Rate limits

Batch API rate limits are separate from existing per-model rate limits. The Batch API has three types of rate limits:

1. **Per-batch limits:** A single batch may include up to 50,000 requests, and a batch input file can be up to 200 MB in size. Note that `/v1/embeddings` batches are also restricted to a maximum of 50,000 embedding inputs across all requests in the batch.
2. **Queued prompt tokens per model:** Each model has a maximum number of prompt tokens that can be queued for batch processing. You can find these limits on the [Platform Settings page](https://platform.openai.com/settings/organization/limits).
3. **Batch creation rate limit:** You can create up to 2,000 batches per hour. If you need to submit more requests, increase the number of requests per batch.

The Batch API currently has no output-token limit. Because Batch API rate limits are a new, separate pool, **using the Batch API will not consume tokens from your standard per-model rate limits**, thereby offering you a convenient way to increase the number of requests and processed tokens you can use when querying our API.

## Batch expiration

Batches that do not complete in time eventually move to an `expired` state; unfinished requests within that batch are cancelled, and any responses to completed requests are made available via the batch's output file. You will be charged for tokens consumed from any completed requests.

Expired requests will be written to your error file with the message as shown below. You can use the `custom_id` to retrieve the request data for expired requests.

```jsonl
{"id": "batch_req_123", "custom_id": "request-3", "response": null, "error": {"code": "batch_expired", "message": "This request could not be executed before the completion window expired."}}
{"id": "batch_req_123", "custom_id": "request-7", "response": null, "error": {"code": "batch_expired", "message": "This request could not be executed before the completion window expired."}}
```