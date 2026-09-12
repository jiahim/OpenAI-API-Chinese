# Background mode

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

智能体像 [Codex](https://openai.com/index/introducing-codex/) 和 [Deep Research](https://openai.com/index/introducing-deep-research/) 表明推理模型可能需要数分钟来解决复杂问题。后台模式使你能够在 GPT-5.2 和 GPT-5.2 Pro 等模型上可靠地执行长时间运行的任务，而不必担心超时或其他连接问题。

后台模式会异步启动这些任务，开发者可以轮询响应对象来随时查看状态。要在后台启动响应生成，请使用以下参数发起 API 请求： `background` 设置为 `true`:

来自零数据保留 (ZDR) 项目的后台请求将使用
  `store=false`。运行。响应数据会临时存储到磁盘约 10
  分钟，以支持异步执行和轮询。

对于使用 [Modified Abuse
Monitoring](https://developers.openai.com/api/docs/guides/your-data#modified-abuse-monitoring)，的项目，包括
增强版 Modified Abuse Monitoring，前台请求在以下情况下遵循标准
保留策略：当 `store` 被省略或设置为 `true`。时。后台响应仅在
轮询期之后才会被保留，当 `store=true` 被显式提供时。
如果 `store` 被省略或设置为 `false` 是后台请求，响应
大约在 10 分钟后被删除。

在后台生成响应

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
  "model": "gpt-6-astra",
  "input": "Write a very long novel about otters in space.",
  "background": true
}'
```

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const resp = await client.responses.create({
  model: "gpt-6-astra",
  input: "Write a very long novel about otters in space.",
  background: true,
});

console.log(resp.status);
```

```python
from openai import OpenAI

client = OpenAI()

resp = client.responses.create(
    model="gpt-6-astra",
    input="Write a very long novel about otters in space.",
    background=True,
)

print(resp.status)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:      "gpt-6-astra",
		Background: openai.Bool(true),
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Write a very long novel about otters in space."),
		},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(response.Status)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Write a detailed market analysis.")
        .background(true)
        .build();

var response = client.responses().create(params);
System.out.println(response.status().orElseThrow());
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new()
{
    Model = "gpt-6-astra",
    BackgroundModeEnabled = true,
};
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("Write a very long novel about otters in space.")
);

ResponseResult response = await client.CreateResponseAsync(options);
Console.WriteLine(response.Status);
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-6-astra",
  input: "Write a detailed market analysis.",
  background: true
)

puts(response.status)
```


## 轮询后台响应

若要检查后台请求的状态，请使用 Responses 的 GET 端点。在请求处于 queued 或 in_progress 状态期间持续轮询。当请求离开这些状态后，即已达到最终（终止）状态。

检索在后台执行的 response

```bash
curl https://api.openai.com/v1/responses/resp_123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

```javascript
import OpenAI from "openai";
const client = new OpenAI();

let resp = await client.responses.create({
  model: "gpt-6-astra",
  input: "Write a very long novel about otters in space.",
  background: true,
});

while (resp.status === "queued" || resp.status === "in_progress") {
  console.log("Current status: " + resp.status);
  await new Promise((resolve) => setTimeout(resolve, 2000)); // wait 2 seconds
  resp = await client.responses.retrieve(resp.id);
}

console.log("Final status: " + resp.status + "\nOutput:\n" + resp.output_text);
```

```python
from openai import OpenAI
from time import sleep

client = OpenAI()

resp = client.responses.create(
    model="gpt-6-astra",
    input="Write a very long novel about otters in space.",
    background=True,
)

while resp.status in {"queued", "in_progress"}:
    print(f"Current status: {resp.status}")
    sleep(2)
    resp = client.responses.retrieve(resp.id)

print(f"Final status: {resp.status}\nOutput:\n{resp.output_text}")
```

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:      "gpt-6-astra",
		Background: openai.Bool(true),
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Write a very long novel about otters in space."),
		},
	})
	if err != nil {
		panic(err)
	}

	for response.Status == "queued" || response.Status == "in_progress" {
		fmt.Println("Current status:", response.Status)
		time.Sleep(2 * time.Second)
		response, err = client.Responses.Get(context.Background(), response.ID, responses.ResponseGetParams{})
		if err != nil {
			panic(err)
		}
	}

	fmt.Printf("Final status: %s\nOutput:\n%s\n", response.Status, response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseStatus;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Write a very long novel about otters in space.")
        .background(true)
        .build();

var response = client.responses().create(params);
while (response.status().filter(ResponseStatus.QUEUED::equals).isPresent()
    || response.status().filter(ResponseStatus.IN_PROGRESS::equals).isPresent()) {
  System.out.println("Current status: " + response.status().orElseThrow());
  Thread.sleep(1000);
  response = client.responses().retrieve(response.id());
}
System.out.println("Final status: " + response.status().orElseThrow());
response.output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new()
{
    Model = "gpt-6-astra",
    BackgroundModeEnabled = true,
};
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("Write a very long novel about otters in space.")
);

ResponseResult created = await client.CreateResponseAsync(options);
ResponseResult response = await client.GetResponseAsync(created.Id);
while (response.Status is ResponseStatus.Queued or ResponseStatus.InProgress)
{
    await Task.Delay(TimeSpan.FromSeconds(1));
    response = await client.GetResponseAsync(response.Id);
}
if (response.Status != ResponseStatus.Completed)
{
    throw new InvalidOperationException($"Background response ended with status: {response.Status}");
}
Console.WriteLine($"Status: {response.Status}");
Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-6-astra",
  input: "Write a very long novel about otters in space.",
  background: true
)

while [:queued, :in_progress].include?(response.status)
  puts("Current status: #{response.status}")
  sleep(2)
  response = client.responses.retrieve(response.id)
end

puts("Final status: #{response.status}")
puts(response.output_text)
```


## 取消后台响应

你也可以像这样取消一个进行中的响应：

取消进行中的响应

```bash
curl -X POST https://api.openai.com/v1/responses/resp_123/cancel \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const resp = await client.responses.cancel("resp_123");

console.log(resp.status);
```

```python
import os

from openai import OpenAI

response_id = os.environ["OPENAI_RESPONSE_ID"]
client = OpenAI()

resp = client.responses.cancel(response_id)

print(resp.status)
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

	canceled, err := client.Responses.Cancel(context.Background(), "resp_123")
	if err != nil {
		panic(err)
	}

	fmt.Println(canceled.Status)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

String responseId = "resp_123";

var response = client.responses().cancel(responseId);

System.out.println(response.status());
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

// Replace this illustrative ID with the background response to cancel.
string responseId = "resp_123";

ResponseResult response = await client.CancelResponseAsync(responseId);
Console.WriteLine(response.Status);
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.cancel("resp_123")
puts(response.status)
```


重复取消是幂等的——后续调用只会简单地返回最终的 `Response` 对象。

## 流式传输后台响应

你可以创建一个后台 Response 并立即开始从中流式传输事件。如果你预期客户端可能会断开流，并希望保留稍后重新接上的选项，这会很有用。为此，请在创建 Response 时同时设置 `background` 和 `stream` 设置为 `true`。你需要持续跟踪与每个流式事件中收到的 `sequence_number` 相对应的“cursor”（游标）。

目前，从后台响应收到首个 token 的耗时
  高于从同步响应收到的耗时。我们正在努力
  在未来几周内缩小这一延迟差距。

生成并流式传输后台响应

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
  "model": "gpt-6-astra",
  "input": "Write a very long novel about otters in space.",
  "background": true,
  "stream": true
}'

// To resume:
curl "https://api.openai.com/v1/responses/resp_123?stream=true&starting_after=42" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY"
```

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const stream = await client.responses.create({
  model: "gpt-6-astra",
  input: "Write a very long novel about otters in space.",
  background: true,
  stream: true,
});

let cursor = null;
for await (const event of stream) {
  console.log(event);
  cursor = event.sequence_number;
}

// If the connection drops, you can resume streaming from the last cursor (SDK support coming soon):
// const resumedStream = await client.responses.stream(resp.id, { starting_after: cursor });
// for await (const event of resumedStream) { ... }
```

```python
from openai import OpenAI

client = OpenAI()

# Fire off an async response but also start streaming immediately
stream = client.responses.create(
    model="gpt-6-astra",
    input="Write a very long novel about otters in space.",
    background=True,
    stream=True,
)

cursor = None
for event in stream:
    print(event)
    cursor = event.sequence_number

# If your connection drops, the response continues running and you can reconnect:
# SDK support for resuming the stream is coming soon.
# for event in client.responses.stream(resp.id, starting_after=cursor):
#     print(event)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()

	stream := client.Responses.NewStreaming(context.Background(), responses.ResponseNewParams{
		Model:      "gpt-6-astra",
		Background: openai.Bool(true),
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Write a very long novel about otters in space."),
		},
	})
	var cursor int64
	var responseID string
	for stream.Next() {
		event := stream.Current()
		fmt.Println(event.Type)
		cursor = event.SequenceNumber
		if event.Response.ID != "" {
			responseID = event.Response.ID
		}
	}
	if err := stream.Err(); err != nil {
		panic(err)
	}
	fmt.Printf("response %s last cursor %d\n", responseID, cursor)

	// If the connection drops, resume streaming from the last cursor:
	// resumed := client.Responses.GetStreaming(
	// 	context.Background(),
	// 	responseID,
	// 	responses.ResponseGetParams{StartingAfter: openai.Int(cursor)},
	// )
	// for resumed.Next() {
	// 	fmt.Println(resumed.Current().Type)
	// }
}
```

```java
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.StreamResponse;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseRetrieveParams;
import com.openai.models.responses.ResponseStreamEvent;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Write a very long novel about otters in space.")
        .background(true)
        .build();

AtomicLong lastSequenceNumber = new AtomicLong(-1);
AtomicReference<String> responseId = new AtomicReference<>("");
AtomicBoolean streamCompleted = new AtomicBoolean(false);
JsonMapper json = new JsonMapper();
try (StreamResponse<ResponseStreamEvent> stream = client.responses().createStreaming(params)) {
  stream.stream()
      .forEach(
          event -> {
            lastSequenceNumber.set(json.valueToTree(event).path("sequence_number").asLong());
            event
                .created()
                .ifPresent(
                    created -> {
                      responseId.set(created.response().id());
                      System.out.println("response.created");
                    });
            event
                .outputTextDelta()
                .ifPresent(
                    delta -> {
                      System.out.println("response.output_text.delta");
                    });
            event
                .completed()
                .ifPresent(
                    completed -> {
                      streamCompleted.set(true);
                      System.out.println("response.completed");
                    });
          });
}
System.out.println(
    "Response " + responseId.get() + "; last sequence number " + lastSequenceNumber.get());
if (!streamCompleted.get()) {
  try (StreamResponse<ResponseStreamEvent> resumed =
      client
          .responses()
          .retrieveStreaming(
              ResponseRetrieveParams.builder()
                  .responseId(responseId.get())
                  .startingAfter(lastSequenceNumber.get())
                  .build())) {
    resumed.stream()
        .forEach(
            event ->
                event.outputTextDelta().ifPresent(delta -> System.out.println(delta.delta())));
  }
}
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new()
{
    Model = "gpt-6-astra",
    BackgroundModeEnabled = true,
    StreamingEnabled = true,
};
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("Write a very long novel about otters in space.")
);

string? responseId = null;
int lastSequenceNumber = -1;
bool completed = false;

void HandleUpdate(StreamingResponseUpdate update)
{
    lastSequenceNumber = update.SequenceNumber;
    switch (update)
    {
        case StreamingResponseCreatedUpdate created:
            responseId = created.Response.Id;
            break;
        case StreamingResponseOutputTextDeltaUpdate text:
            Console.Write(text.Delta);
            break;
        case StreamingResponseCompletedUpdate:
            completed = true;
            break;
        case StreamingResponseFailedUpdate:
            throw new InvalidOperationException("The background response failed.");
        case StreamingResponseIncompleteUpdate:
            throw new InvalidOperationException("The background response was incomplete.");
        case StreamingResponseErrorUpdate error:
            throw new InvalidOperationException($"The response stream failed: {error.Message}");
    }
}

try
{
    await foreach (
        StreamingResponseUpdate update in client.CreateResponseStreamingAsync(options)
    )
    {
        HandleUpdate(update);
    }
}
catch (Exception error)
    when (error is HttpRequestException or IOException && responseId is not null)
{
    // The background response continues after its streaming connection is interrupted.
}

if (!completed)
{
    if (responseId is null)
    {
        throw new InvalidOperationException("The response stream ended before providing its ID.");
    }

    GetResponseOptions resumeOptions = new(responseId)
    {
        StartingAfter = lastSequenceNumber,
        StreamingEnabled = true,
    };
    await foreach (StreamingResponseUpdate update in client.GetResponseStreamingAsync(resumeOptions))
    {
        HandleUpdate(update);
    }

    if (!completed)
    {
        throw new InvalidOperationException(
            "The resumed response stream ended before the background response completed."
        );
    }
}
```

```ruby
require "openai"

client = OpenAI::Client.new
stream = client.responses.stream(
  model: "gpt-6-astra",
  input: "Write a very long novel about otters in space.",
  background: true
)

last_sequence_number = -1
response_id = ""
stream.each do |event|
  puts(event.type)
  last_sequence_number = event.sequence_number || last_sequence_number
  if event.is_a?(OpenAI::Models::Responses::ResponseCreatedEvent)
    response_id = event.response.id
  end
end

puts("Response #{response_id}; last sequence number #{last_sequence_number}")

# If the connection drops, resume from the last sequence number:
# client.responses.stream(response_id: response_id, starting_after: last_sequence_number).each do |event|
#   puts(event.type)
# end
```


## 限制

1. 后台请求可以使用 `store=false`，但响应数据会被临时
   存储以支持异步执行和轮询。
2. 若要取消同步响应，请终止连接
3. 只有使用 `stream=true`.