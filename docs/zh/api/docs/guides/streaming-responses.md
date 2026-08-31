# 流式 API 响应

> 完整的文档索引请参阅 [llms.txt](/llms.txt). 你可以在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

默认情况下，当你向 OpenAI API 发起请求时，我们会先生成模型的完整输出，再通过单个 HTTP 响应一次性返回。在生成长输出时，等待响应可能需要较长时间。流式响应允许你在模型继续生成完整响应的同时，开始打印或处理模型输出开头的内容。

本指南重点介绍基于服务端发送事件（SSE）的 HTTP 流式传输。`stream=true`）。如需使用支持通过增量输入的持久 WebSocket 传输，请参阅 `previous_response_id`，请参阅 [Responses API 的 WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode).

## 启用流式传输


要开始流式响应，请在向 Responses 端点发出的请求中设置 `stream=True` ：

```javascript
import { OpenAI } from "openai";
const client = new OpenAI();

const stream = await client.responses.create({
  model: "gpt-5.6",
  input: [
    {
      role: "user",
      content: "Say 'double bubble bath' ten times fast.",
    },
  ],
  stream: true,
});

for await (const event of stream) {
  console.log(event);
}
```

```python
from openai import OpenAI

client = OpenAI()

stream = client.responses.create(
    model="gpt-5.6",
    input=[
        {
            "role": "user",
            "content": "Say 'double bubble bath' ten times fast.",
        },
    ],
    stream=True,
)

for event in stream:
    print(event)
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
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Say 'double bubble bath' ten times fast.")},
	})
	for stream.Next() {
		fmt.Println(stream.Current().Type)
	}
	if err := stream.Err(); err != nil {
		panic(err)
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.StreamResponse;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseStreamEvent;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("Say 'double bubble bath' ten times fast.")
        .build();

try (StreamResponse<ResponseStreamEvent> stream = client.responses().createStreaming(params)) {
  stream.stream().forEach(System.out::println);
}
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

var responses = client.CreateResponseStreamingAsync(
    "gpt-5.6",
    "Say 'double bubble bath' ten times fast."
);

await foreach (StreamingResponseUpdate response in responses)
{
    if (response is StreamingResponseOutputTextDeltaUpdate delta)
    {
        Console.Write(delta.Delta);
    }
}
```

```ruby
require "openai"

openai = OpenAI::Client.new

stream = openai.responses.stream(
  model: "gpt-5.6",
  input: [
    {
      role: "user",
      content: "Say 'double bubble bath' ten times fast."
    }
  ]
)

stream.each do |event|
  puts(event)
end
```


Responses API 使用语义事件进行流式传输。每个事件都带有预定义的类型架构，因此你可以监听你关心的事件。

有关完整的事件类型列表，请参阅 [流式传输的 API 参考](https://developers.openai.com/api/reference/resources/responses)。以下是一些示例：

```javascript
for await (const event of stream) {
  if (event.type === "response.output_text.delta") {
    process.stdout.write(event.delta);
  } else if (event.type === "response.completed") {
    console.log("\nResponse completed.");
  } else if (event.type === "error") {
    console.error(event.message);
  }
}
```

```python
StreamingEvent = (
    ResponseCreatedEvent
    | ResponseInProgressEvent
    | ResponseFailedEvent
    | ResponseCompletedEvent
    | ResponseOutputItemAdded
    | ResponseOutputItemDone
    | ResponseContentPartAdded
    | ResponseContentPartDone
    | ResponseOutputTextDelta
    | ResponseOutputTextAnnotationAdded
    | ResponseTextDone
    | ResponseRefusalDelta
    | ResponseRefusalDone
    | ResponseFunctionCallArgumentsDelta
    | ResponseFunctionCallArgumentsDone
    | ResponseFileSearchCallInProgress
    | ResponseFileSearchCallSearching
    | ResponseFileSearchCallCompleted
    | ResponseCodeInterpreterInProgress
    | ResponseCodeInterpreterCallCodeDelta
    | ResponseCodeInterpreterCallCodeDone
    | ResponseCodeInterpreterCallInterpreting
    | ResponseCodeInterpreterCallCompleted
    | Error
)
```

```go
type StreamingEvent = responses.ResponseStreamEventUnion
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.StreamResponse;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseStreamEvent;

ResponseCreateParams params =
    ResponseCreateParams.builder().model("gpt-5.5").input("Say hello.").build();

try (StreamResponse<ResponseStreamEvent> stream = client.responses().createStreaming(params)) {
  stream.stream().forEach(System.out::println);
}
```

```ruby
require "openai"

client = OpenAI::Client.new
stream = client.responses.stream(model: "gpt-5.5", input: "Say hello.")
stream.each { |event| puts(event) }
```






## Read the responses



如果你使用的是我们的 SDK，每个事件都是一个类型化实例。你也可以使用事件的 `type` 属性来识别各个事件。

一些关键的生命周期事件只会触发一次，而其他事件会在响应生成过程中触发多次。流式输出文本时常见的事件包括：

```
- `response.created`
- `response.output_text.delta`
- `response.completed`
- `error`
```

如需完整可监听的事件列表，请参阅 [流式传输的 API 参考](https://developers.openai.com/api/reference/resources/responses).





## 进阶用例

如需更高级的用例，例如流式工具调用，请参阅以下专题指南：

- [流式函数调用](https://developers.openai.com/api/docs/guides/function-calling#streaming)
- [流式结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs#streaming)

## 审核风险

请注意，在生产应用中流式输出模型的补全会使审核补全内容变得更加困难，因为部分补全可能更难评估。这可能会对已批准的使用产生影响。

如果你请求 [在生成请求中同时获取审核分数](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content),这些分数会在完整生成输出可用后才返回，不会随部分输出增量一起提供。