# 统计令牌数

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

令牌计数可让你在向模型发送请求之前，确定该请求将使用多少个输入令牌。可用于：

- **优化提示词** 以适配上下文限制
- **估算成本** 在发起API调用前
- **路由请求** 基于大小（例如，将较小的提示词路由到较快的模型）
- **避免意外** 对于图像和文件——不再基于字符进行估算

该 [输入令牌计数端点](https://developers.openai.com/api/reference/python/resources/responses/subresources/input_tokens/methods/count) 接受与 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create)。相同的输入格式。传递文本、消息、图像、文件、工具或对话——API 会返回模型将接收到的精确数量。

该数量包括用于表示请求结构的格式令牌，如消息角色和边界。这些令牌可能不会出现在你本地进行分词处理的文本或字段中。

## 为何使用令牌计数API？

像 tiktoken 这样的本地分词器 [tiktoken](https://github.com/openai/tiktoken) 适用于纯文本，但存在一定限制：

- **图像和文件** 不受支持——像 `characters / 4` 这样的估算不准确
- **工具和模式** 会增加难以在本地计算的令牌数
- **模型特定行为** 可能改变令牌化（例如，推理、缓存）

令牌计数 API 处理所有这些情况。使用你本会发送的相同请求负载 `responses.create` ，即可获得准确计数。然后将结果用于你的消息验证或成本估算流程。

## 统计基础消息中的 token 数

简单文本输入

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.inputTokens.count({
  model: "gpt-5.6",
  input: "Tell me a joke.",
});

console.log(response.input_tokens);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.input_tokens.count(
    model="gpt-5.6", input="Tell me a joke."
)
print(response.input_tokens)
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
	count, err := client.Responses.InputTokens.Count(context.Background(), responses.InputTokenCountParams{
		Model: openai.String("gpt-5.6"),
		Input: responses.InputTokenCountParamsInputUnion{OfString: openai.String("Tell me a joke.")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(count.InputTokens)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.inputtokens.InputTokenCountParams;

var count =
    client
        .responses()
        .inputTokens()
        .count(
            InputTokenCountParams.builder()
                .model("gpt-5.6")
                .input("Tell me a joke.")
                .build());

System.out.println(count.inputTokens());
```

```ruby
require "openai"

client = OpenAI::Client.new

count = client.responses.input_tokens.count(
  model: "gpt-5.6",
  input: "Tell me a joke."
)

puts(count.input_tokens)
```

```bash
curl https://api.openai.com/v1/responses/input_tokens \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "input": "Tell me a joke."
  }'
```

```bash
openai responses:input-tokens count \
  --model gpt-5.6 \
  --input "Tell me a joke." \
  --raw-output \
  --transform input_tokens
```


## 统计对话中的 token 数量

多轮对话

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.inputTokens.count({
  model: "gpt-5.6",
  input: [
    { role: "user", content: "What is 2 + 2?" },
    { role: "assistant", content: "2 + 2 equals 4." },
    { role: "user", content: "What about 3 + 3?" },
  ],
});

console.log(response.input_tokens);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.input_tokens.count(
    model="gpt-5.6",
    input=[
        {"role": "user", "content": "What is 2 + 2?"},
        {"role": "assistant", "content": "2 + 2 equals 4."},
        {"role": "user", "content": "What about 3 + 3?"},
    ],
)
print(response.input_tokens)
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
	input := []responses.ResponseInputItemUnionParam{
		responses.ResponseInputItemParamOfMessage("What is 2 + 2?", responses.EasyInputMessageRoleUser),
		responses.ResponseInputItemParamOfMessage("2 + 2 equals 4.", responses.EasyInputMessageRoleAssistant),
		responses.ResponseInputItemParamOfMessage("What about 3 + 3?", responses.EasyInputMessageRoleUser),
	}
	count, err := client.Responses.InputTokens.Count(context.Background(), responses.InputTokenCountParams{
		Model: openai.String("gpt-5.6"),
		Input: responses.InputTokenCountParamsInputUnion{OfResponseInputItemArray: input},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(count.InputTokens)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.inputtokens.InputTokenCountParams;
import java.util.List;

var count =
    client
        .responses()
        .inputTokens()
        .count(
            InputTokenCountParams.builder()
                .model("gpt-5.6")
                .inputOfResponseInputItems(
                    List.of(
                        ResponseInputItem.ofEasyInputMessage(
                            EasyInputMessage.builder()
                                .role(EasyInputMessage.Role.USER)
                                .content("What is 2 + 2?")
                                .build()),
                        ResponseInputItem.ofEasyInputMessage(
                            EasyInputMessage.builder()
                                .role(EasyInputMessage.Role.ASSISTANT)
                                .content("2 + 2 equals 4.")
                                .build()),
                        ResponseInputItem.ofEasyInputMessage(
                            EasyInputMessage.builder()
                                .role(EasyInputMessage.Role.USER)
                                .content("What about 3 + 3?")
                                .build())))
                .build());

System.out.println(count.inputTokens());
```

```ruby
require "openai"

client = OpenAI::Client.new
conversation = [
  {role: :user, content: "What is 2 + 2?"},
  {role: :assistant, content: "2 + 2 equals 4."},
  {role: :user, content: "What about 3 + 3?"}
]

count = client.responses.input_tokens.count(
  model: "gpt-5.6",
  input: conversation
)

puts(count.input_tokens)
```

```bash
curl https://api.openai.com/v1/responses/input_tokens \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "input": [
      {"role": "user", "content": "What is 2 + 2?"},
      {"role": "assistant", "content": "2 + 2 equals 4."},
      {"role": "user", "content": "What about 3 + 3?"}
    ]
  }'
```

```bash
openai responses:input-tokens count \
  --raw-output \
  --transform input_tokens <<'YAML'
model: gpt-5.6
input:
  - role: user
    content: What is 2 + 2?
  - role: assistant
    content: 2 + 2 equals 4.
  - role: user
    content: What about 3 + 3?
YAML
```


## 使用指令统计 token 数

带系统指令的输入

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.inputTokens.count({
  model: "gpt-5.6",
  instructions: "You are a helpful assistant that explains concepts simply.",
  input: "Explain quantum computing in one sentence.",
});

console.log(response.input_tokens);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.input_tokens.count(
    model="gpt-5.6",
    instructions="You are a helpful assistant that explains concepts simply.",
    input="Explain quantum computing in one sentence.",
)
print(response.input_tokens)
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
	count, err := client.Responses.InputTokens.Count(context.Background(), responses.InputTokenCountParams{
		Model:        openai.String("gpt-5.6"),
		Instructions: openai.String("You are a helpful assistant that explains concepts simply."),
		Input:        responses.InputTokenCountParamsInputUnion{OfString: openai.String("Explain quantum computing in one sentence.")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(count.InputTokens)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.inputtokens.InputTokenCountParams;

var count =
    client
        .responses()
        .inputTokens()
        .count(
            InputTokenCountParams.builder()
                .model("gpt-5.6")
                .input("Explain quantum computing in one sentence.")
                .instructions("You are a helpful assistant that explains concepts simply.")
                .build());

System.out.println(count.inputTokens());
```

```ruby
require "openai"

client = OpenAI::Client.new

count = client.responses.input_tokens.count(
  model: "gpt-5.6",
  instructions: "You are a helpful assistant that explains concepts simply.",
  input: "Explain quantum computing in one sentence."
)

puts(count.input_tokens)
```

```bash
curl https://api.openai.com/v1/responses/input_tokens \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "instructions": "You are a helpful assistant that explains concepts simply.",
    "input": "Explain quantum computing in one sentence."
  }'
```

```bash
openai responses:input-tokens count \
  --raw-output \
  --transform input_tokens <<'YAML'
model: gpt-5.6
instructions: You are a helpful assistant that explains concepts simply.
input: Explain quantum computing in one sentence.
YAML
```


## 使用图像统计令牌数

图像根据大小和细节级别消耗令牌。令牌计数 API 返回精确计数，无需猜测。

带图像的输入

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.inputTokens.count({
  model: "gpt-5.6",
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_image",
          image_url: "https://example.com/chart.png",
          detail: "auto",
        },
        { type: "input_text", text: "Summarize this chart." },
      ],
    },
  ],
});

console.log(response.input_tokens);
```

```python
from openai import OpenAI

client = OpenAI()

# Use file_id from uploaded file, or image_url for a URL
response = client.responses.input_tokens.count(
    model="gpt-5.6",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_image",
                    "image_url": "https://example.com/chart.png",
                },
                {"type": "input_text", "text": "Summarize this chart."},
            ],
        }
    ],
)
print(response.input_tokens)
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
	input := []responses.ResponseInputItemUnionParam{
		responses.ResponseInputItemParamOfMessage(
			responses.ResponseInputMessageContentListParam{
				{OfInputImage: &responses.ResponseInputImageParam{ImageURL: openai.String("https://example.com/chart.png"), Detail: responses.ResponseInputImageDetailAuto}},
				{OfInputText: &responses.ResponseInputTextParam{Text: "Summarize this chart."}},
			},
			responses.EasyInputMessageRoleUser,
		),
	}
	count, err := client.Responses.InputTokens.Count(context.Background(), responses.InputTokenCountParams{
		Model: openai.String("gpt-5.6"),
		Input: responses.InputTokenCountParamsInputUnion{OfResponseInputItemArray: input},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(count.InputTokens)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseInputImage;
import com.openai.models.responses.ResponseInputItem;
import com.openai.models.responses.inputtokens.InputTokenCountParams;
import java.util.List;

var count =
    client
        .responses()
        .inputTokens()
        .count(
            InputTokenCountParams.builder()
                .model("gpt-5.6")
                .inputOfResponseInputItems(
                    List.of(
                        ResponseInputItem.ofMessage(
                            ResponseInputItem.Message.builder()
                                .role(ResponseInputItem.Message.Role.USER)
                                .addContent(
                                    ResponseInputImage.builder()
                                        .detail(ResponseInputImage.Detail.AUTO)
                                        .imageUrl(
                                            "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg")
                                        .build())
                                .addInputTextContent("Summarize this chart.")
                                .build())))
                .build());

System.out.println(count.inputTokens());
```

```ruby
require "openai"

client = OpenAI::Client.new

count = client.responses.input_tokens.count(
  model: "gpt-5.6",
  input: [
    {
      role: :user,
      content: [
        {
          type: :input_image,
          image_url: "https://api.nga.gov/iiif/a2e6da57-3cd1-4235-b20e-95dcaefed6c8/full/!800,800/0/default.jpg",
          detail: :auto
        },
        {type: :input_text, text: "Summarize this chart."}
      ]
    }
  ]
)

puts(count.input_tokens)
```

```bash
curl https://api.openai.com/v1/responses/input_tokens \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "input": [{
      "role": "user",
      "content": [
        {"type": "input_image", "image_url": "https://example.com/chart.png"},
        {"type": "input_text", "text": "Summarize this chart."}
      ]
    }]
  }'
```

```bash
openai responses:input-tokens count \
  --raw-output \
  --transform input_tokens <<'YAML'
model: gpt-5.6
input:
  - role: user
    content:
      - type: input_image
        image_url: https://example.com/chart.png
      - type: input_text
        text: Summarize this chart.
YAML
```


你可以使用 `file_id` （来自 [文件 API](https://developers.openai.com/api/reference/resources/files)）或 `image_url` （一个 URL 或 base64 数据 URL）。请参阅 [图像与视觉](https://developers.openai.com/api/docs/guides/images-vision) 了解详情。

## 使用工具计算 token 数

工具定义（函数架构、MCP 服务器等）会向上下文中添加令牌。请将它们与你的输入一起计算：

带函数工具的输入

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.inputTokens.count({
  model: "gpt-5.6",
  tools: [
    {
      type: "function",
      name: "get_weather",
      description: "Get the current weather in a location",
      strict: true,
      parameters: {
        type: "object",
        properties: { location: { type: "string" } },
        required: ["location"],
        additionalProperties: false,
      },
    },
  ],
  input: "What is the weather in San Francisco?",
});

console.log(response.input_tokens);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.input_tokens.count(
    model="gpt-5.6",
    tools=[
        {
            "type": "function",
            "name": "get_weather",
            "description": "Get the current weather in a location",
            "parameters": {
                "type": "object",
                "properties": {"location": {"type": "string"}},
                "required": ["location"],
            },
        }
    ],
    input="What is the weather in San Francisco?",
)
print(response.input_tokens)
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
	parameters := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"location": map[string]any{"type": "string"},
		},
		"required":             []string{"location"},
		"additionalProperties": false,
	}
	tool := responses.ToolParamOfFunction("get_weather", parameters, true)
	tool.OfFunction.Description = openai.String("Get the current weather in a location")
	count, err := client.Responses.InputTokens.Count(context.Background(), responses.InputTokenCountParams{
		Model: openai.String("gpt-5.6"),
		Input: responses.InputTokenCountParamsInputUnion{OfString: openai.String("What is the weather in San Francisco?")},
		Tools: []responses.ToolUnionParam{tool},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(count.InputTokens)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.FunctionTool;
import com.openai.models.responses.inputtokens.InputTokenCountParams;
import java.util.List;
import java.util.Map;

var count =
    client
        .responses()
        .inputTokens()
        .count(
            InputTokenCountParams.builder()
                .model("gpt-5.6")
                .input("What is the weather in San Francisco?")
                .addTool(
                    FunctionTool.builder()
                        .name("get_weather")
                        .description("Get the current weather in a location")
                        .strict(true)
                        .parameters(
                            FunctionTool.Parameters.builder()
                                .putAdditionalProperty("type", JsonValue.from("object"))
                                .putAdditionalProperty(
                                    "properties",
                                    JsonValue.from(
                                        Map.of("location", Map.of("type", "string"))))
                                .putAdditionalProperty(
                                    "required", JsonValue.from(List.of("location")))
                                .putAdditionalProperty(
                                    "additionalProperties", JsonValue.from(false))
                                .build())
                        .build())
                .build());

System.out.println(count.inputTokens());
```

```ruby
require "openai"

client = OpenAI::Client.new

count = client.responses.input_tokens.count(
  model: "gpt-5.6",
  input: "What is the weather in San Francisco?",
  tools: [
    {
      type: :function,
      name: "get_weather",
      description: "Get the current weather in a location",
      strict: true,
      parameters: {
        type: "object",
        properties: {location: {type: "string"}},
        required: ["location"],
        additionalProperties: false
      }
    }
  ]
)

puts(count.input_tokens)
```

```bash
curl https://api.openai.com/v1/responses/input_tokens \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "tools": [{
      "type": "function",
      "name": "get_weather",
      "description": "Get the current weather in a location",
      "parameters": {
        "type": "object",
        "properties": {"location": {"type": "string"}},
        "required": ["location"]
      }
    }],
    "input": "What is the weather in San Francisco?"
  }'
```

```bash
openai responses:input-tokens count \
  --raw-output \
  --transform input_tokens <<'YAML'
model: gpt-5.6
tools:
  - type: function
    name: get_weather
    description: Get the current weather in a location
    parameters:
      type: object
      properties:
        location:
          type: string
      required:
        - location
input: What is the weather in San Francisco?
YAML
```


## 使用文件计算令牌数

[文件输入](https://developers.openai.com/api/docs/guides/file-inputs)——目前支持 PDF——。传入 `file_id`, `file_url`，或 `file_data` 正如你为 `responses.create`。令牌计数反映模型处理的完整输入。

## 了解输出 token 数量

报告的输出 token 用量包括模型生成的所有 token，而不仅仅是响应中可见的文本。Responses API 将此总数报告为 `output_tokens`，而 Chat Completions API 则将其报告为 `completion_tokens`.

某些模型（包括 GPT-5 模型）会生成用于格式化或分隔响应通道、工具调用和其他消息结构的 token。这些格式化 token 不会出现在消息内容或 `logprobs`，中，也不一定在用量中单独列出。因此，报告的输出或完成 token 计数可能高于可见 token 的数量或包含在 `logprobs`，中的 token 数量，即使报告的 `reasoning_tokens` 值为 `0`.

该 `max_output_tokens` 和 `max_completion_tokens` 参数限制了模型生成的所有 token，包括不可见的 token。不可见 token 的数量因模型和响应形态而异，因此不要假设报告用量与可见输出之间存在固定的差异。当你需要特定数量的可见输出时，请在这些限制中留出余量。

## API 参考

有关完整参数和响应结构，请参阅 [计算输入令牌 API 参考](https://developers.openai.com/api/reference/python/resources/responses/subresources/input_tokens/methods/count)。端点为：

```
POST /v1/responses/input_tokens
```

响应包括 `input_tokens` （整数）和 `object: "response.input_tokens"`.