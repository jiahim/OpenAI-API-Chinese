# 流式 API 响应

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

默认情况下，当你向OpenAI API发出请求时，我们先生成模型的完整输出，再通过单个 HTTP 响应将其返回。生成较长的输出时，等待响应可能需要一些时间。流式响应允许你在模型继续生成完整响应的同时，开始打印或处理模型输出的开头部分。

本指南重点介绍基于服务器发送事件（SSE）的 HTTP 流式传输（`stream=true`）。如需使用 WebSocket 进行持久传输并通过 `previous_response_id`，增量输入，请参阅 [Responses API WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode).

## 启用流式传输


若要开始流式响应，请在向 Responses 端点发出的请求中设置 `stream=True` ：

```javascript
import { OpenAI } from "openai";
const client = new OpenAI();

const stream = await client.responses.create({
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
        .model("gpt-6-astra")
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
    "gpt-6-astra",
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
  model: "gpt-6-astra",
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


Responses API 使用语义事件进行流式传输。每个事件都带有预定义的 schema 类型，因此你可以监听自己关心的事件。

如需完整的事件类型列表，请参阅 [流式传输 API 参考](https://developers.openai.com/api/reference/resources/responses)。下面是几个示例：

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






## 阅读响应



如果你使用的是我们的 SDK，每个事件都是一个类型化实例。你还可以使用事件的 `type` 属性来识别各个事件。

某些关键生命周期事件只会发出一次，而其他事件在响应生成过程中会多次发出。流式传输文本时常见的事件包括：

```
- `response.created`
- `response.output_text.delta`
- `response.completed`
- `error`
```

有关可以监听的事件的完整列表，请参阅 [流式传输 API 参考](https://developers.openai.com/api/reference/resources/responses).





## 高级用例

如需更高级的用例，例如流式工具调用，请参阅以下专题指南：

- [流式函数调用](https://developers.openai.com/api/docs/guides/function-calling#streaming)
- [流式结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs#streaming)

## 审核风险

请注意，在生产环境中流式传输模型输出会使审核补全内容变得更加困难，因为部分补全可能更难以评估。这可能会对已批准的使用方式产生影响。

如果你请求 [带生成请求的内容审核评分](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content),评分会在完整生成输出可用后到达。它们不包含在部分输出的增量中。