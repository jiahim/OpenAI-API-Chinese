# Predicted Outputs

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取该页面的 Markdown 版本。

**Predicted Outputs** 使你能够在许多输出 token 已知的情况下，加快 API 来自 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) 的响应速度。这在你重新生成仅有少量修改的文本或代码文件时最为常见。你可以使用以下参数提供预测内容： [`prediction` Chat Completions 中的 request 参数](https://developers.openai.com/api/reference/resources/chat#chat-create-prediction).

Predicted Outputs 现已可通过最新的 `gpt-4o`, `gpt-4o-mini`, `gpt-4.1`, `gpt-4.1-mini`，模型使用，且 `gpt-4.1-nano` 。请继续阅读，了解如何使用 Predicted Outputs 降低应用的延迟。

## 代码重构示例

Predicted Outputs 特别适合用于在少量修改的情况下重新生成文本文档和代码文件。假设你希望让 [GPT-4o 模型](https://developers.openai.com/api/docs/models#gpt-4o) 重构一段 JavaScript 代码，并将该类的 `username` 属性转换为 `User` ： `email` ：

```javascript
class User {
  firstName = "";
  lastName = "";
  username = "";
}

export default User;
```


除了上面第 4 行之外，文件的大部分内容保持不变。如果你使用代码文件的当前文本作为预测，就可以以更低的延迟重新生成整个文件。对于较大的文件来说，这些节省的时间会迅速累积。

下面是一个示例，展示如何在我们的 `prediction` 开发工具包 中使用该参数来预测模型的最终输出将与我们的原始代码文件非常相似，我们将其用作预测文本。SDK。

使用 Predicted Output 重构 JavaScript 类

```javascript
import OpenAI from "openai";

const code = `
class User {
  firstName = "";
  lastName = "";
  username = "";
}

export default User;
`.trim();

const openai = new OpenAI();

const refactorPrompt = `
Replace the "username" property with an "email" property. Respond only
with code, and with no markdown formatting.
`;

const completion = await openai.chat.completions.create({
  model: "gpt-4.1",
  messages: [
    {
      role: "user",
      content: refactorPrompt,
    },
    {
      role: "user",
      content: code,
    },
  ],
  store: true,
  prediction: {
    type: "content",
    content: code,
  },
});

// Inspect returned data
console.log(completion);
console.log(completion.choices[0].message.content);
```

```python
from openai import OpenAI

code = """
class User {
  firstName = "";
  lastName = "";
  username = "";
}

export default User;
""".strip()

refactor_prompt = """
Replace the "username" property with an "email" property. Respond only
with code, and with no markdown formatting.
"""

client = OpenAI()

completion = client.chat.completions.create(
    model="gpt-4.1",
    messages=[
        {"role": "user", "content": refactor_prompt},
        {"role": "user", "content": code},
    ],
    prediction={"type": "content", "content": code},
)

print(completion)
print(completion.choices[0].message.content)
```

```go
package main

import (
	"context"
	"fmt"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	code := strings.TrimSpace(`
class User {
  firstName = "";
  lastName = "";
  username = "";
}

export default User;
`)
	refactorPrompt := strings.TrimSpace(`
Replace the "username" property with an "email" property. Respond only
with code, and with no markdown formatting.
`)
	completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model: shared.ChatModelGPT4_1,
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.UserMessage(refactorPrompt),
			openai.UserMessage(code),
		},
		Store: openai.Bool(true),
		Prediction: openai.ChatCompletionPredictionContentParam{
			Content: openai.ChatCompletionPredictionContentContentUnionParam{OfString: openai.String(code)},
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(completion.Choices[0].Message.Content)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import com.openai.models.chat.completions.ChatCompletionPredictionContent;

String code =
    """
    class User {
      firstName: string = "";
      lastName: string = "";
      username: string = "";
    }

    export default User;
    """;
String refactorPrompt =
    "Replace the \"username\" property with an \"email\" property. "
        + "Respond only with code, and with no markdown formatting.";

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-4.1")
        .addUserMessage(refactorPrompt)
        .addUserMessage(code)
        .prediction(ChatCompletionPredictionContent.builder().content(code).build())
        .store(true)
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

```csharp
using OpenAI.Chat;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-4.1";
ChatClient client = new(model, key);

string code =
    """
    class User {
      firstName = "";
      lastName = "";
      username = "";
    }

    export default User;
    """;
ChatCompletionOptions options = new()
{
    OutputPrediction = ChatOutputPrediction.CreateStaticContentPrediction(code),
};
ChatCompletion completion = await client.CompleteChatAsync(
    [
        new UserChatMessage(
            "Replace the username property with an email property. Respond only with code, and with no markdown formatting."
        ),
        new UserChatMessage(code),
    ],
    options
);

Console.WriteLine(completion.Content[0].Text);
```

```ruby
require "openai"

client = OpenAI::Client.new
code = <<~CODE
  class User {
    firstName: string = "";
    lastName: string = "";
    username: string = "";
  }

  export default User;
CODE
refactor_prompt = <<~PROMPT
  Replace the "username" property with an "email" property. Respond only
  with code, and with no markdown formatting.
PROMPT
completion = client.chat.completions.create(
  model: "gpt-4.1",
  messages: [
    {role: :user, content: refactor_prompt},
    {role: :user, content: code}
  ],
  prediction: {type: :content, content: code},
  store: true
)

puts(completion.choices.fetch(0).message.content)
```

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4.1",
    "messages": [
      {
        "role": "user",
        "content": "Replace the username property with an email property. Respond only with code, and with no markdown formatting."
      },
      {
        "role": "user",
        "content": "$CODE_CONTENT_HERE"
      }
    ],
    "prediction": {
        "type": "content",
        "content": "$CODE_CONTENT_HERE"
    }
  }'
```


除了重构后的代码之外，缺少 `choices` 字段的精简模型响应具有如下使用数据：

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1786652188,
  "model": "gpt-4.1-2025-04-14",
  "usage": {
    "prompt_tokens": 59,
    "completion_tokens": 24,
    "total_tokens": 83,
    "prompt_tokens_details": { "cached_tokens": 0, "audio_tokens": 0 },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 14,
      "rejected_prediction_tokens": 2
    }
  },
  "system_fingerprint": "fp_6ddb4f7408"
}
```

请注意 `accepted_prediction_tokens` 和 `rejected_prediction_tokens` 对象中的 `usage` 。在此示例中，预测中有 14 个 token 被用于加速响应，另有 2 个被拒绝。

请注意，任何被拒绝的 token 与其他补全 token 一样仍然会计费
  ，这些 token 由 API 生成，因此 Predicted Outputs 可能会带来更高的
  请求成本。

## 流式传输示例

当你对 API 响应使用流式传输时，Predicted Outputs 的延迟优势会更为显著。下面是同一个代码重构用例的示例，但改为在 OpenAI SDK 中使用流式传输。

使用流式传输的 Predicted Outputs

```javascript
import OpenAI from "openai";

const code = `
class User {
  firstName = "";
  lastName = "";
  username = "";
}

export default User;
`.trim();

const openai = new OpenAI();

const refactorPrompt = `
Replace the "username" property with an "email" property. Respond only
with code, and with no markdown formatting.
`;

const completion = await openai.chat.completions.create({
  model: "gpt-4.1",
  messages: [
    {
      role: "user",
      content: refactorPrompt,
    },
    {
      role: "user",
      content: code,
    },
  ],
  store: true,
  prediction: {
    type: "content",
    content: code,
  },
  stream: true,
});

// Inspect returned data
for await (const chunk of completion) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}
```

```python
from openai import OpenAI

code = """
class User {
  firstName = "";
  lastName = "";
  username = "";
}

export default User;
""".strip()

refactor_prompt = """
Replace the "username" property with an "email" property. Respond only
with code, and with no markdown formatting.
"""

client = OpenAI()

stream = client.chat.completions.create(
    model="gpt-4.1",
    messages=[
        {"role": "user", "content": refactor_prompt},
        {"role": "user", "content": code},
    ],
    prediction={"type": "content", "content": code},
    stream=True,
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")
```

```go
package main

import (
	"context"
	"fmt"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	code := strings.TrimSpace(`
class User {
  firstName = "";
  lastName = "";
  username = "";
}

export default User;
`)
	refactorPrompt := strings.TrimSpace(`
Replace the "username" property with an "email" property. Respond only
with code, and with no markdown formatting.
`)
	stream := client.Chat.Completions.NewStreaming(context.Background(), openai.ChatCompletionNewParams{
		Model: shared.ChatModelGPT4_1,
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.UserMessage(refactorPrompt),
			openai.UserMessage(code),
		},
		Store: openai.Bool(true),
		Prediction: openai.ChatCompletionPredictionContentParam{
			Content: openai.ChatCompletionPredictionContentContentUnionParam{OfString: openai.String(code)},
		},
	})
	for stream.Next() {
		if len(stream.Current().Choices) > 0 {
			fmt.Print(stream.Current().Choices[0].Delta.Content)
		}
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
import com.openai.models.chat.completions.ChatCompletionChunk;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import com.openai.models.chat.completions.ChatCompletionPredictionContent;

String code =
    """
    class User {
      firstName: string = "";
      lastName: string = "";
      username: string = "";
    }

    export default User;
    """;
String refactorPrompt =
    "Replace the \"username\" property with an \"email\" property. "
        + "Respond only with code, and with no markdown formatting.";

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-4.1")
        .addUserMessage(refactorPrompt)
        .addUserMessage(code)
        .prediction(ChatCompletionPredictionContent.builder().content(code).build())
        .store(true)
        .build();

try (StreamResponse<ChatCompletionChunk> stream =
    client.chat().completions().createStreaming(params)) {
  stream.stream()
      .flatMap(chunk -> chunk.choices().stream())
      .flatMap(choice -> choice.delta().content().stream())
      .forEach(System.out::print);
}
```

```csharp
using OpenAI.Chat;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-4.1";
ChatClient client = new(model, key);

string code =
    """
    class User {
      firstName = "";
      lastName = "";
      username = "";
    }

    export default User;
    """;
ChatCompletionOptions options = new()
{
    OutputPrediction = ChatOutputPrediction.CreateStaticContentPrediction(code),
};

await foreach (
    StreamingChatCompletionUpdate update in client.CompleteChatStreamingAsync(
        [
            new UserChatMessage(
                "Replace the username property with an email property. Respond only with code, and with no markdown formatting."
            ),
            new UserChatMessage(code),
        ],
        options
    )
)
{
    foreach (ChatMessageContentPart part in update.ContentUpdate)
    {
        Console.Write(part.Text);
    }
}
```

```ruby
require "openai"

client = OpenAI::Client.new
code = <<~CODE
  class User {
    firstName: string = "";
    lastName: string = "";
    username: string = "";
  }

  export default User;
CODE
refactor_prompt = <<~PROMPT
  Replace the "username" property with an "email" property. Respond only
  with code, and with no markdown formatting.
PROMPT
stream = client.chat.completions.stream(
  model: "gpt-4.1",
  messages: [
    {role: :user, content: refactor_prompt},
    {role: :user, content: code}
  ],
  prediction: {type: :content, content: code},
  store: true
)

stream.text.each { |text| print(text) }
```


## 响应中预测文本的位置

提供预测文本时，你的预测可以出现在生成响应中的任何位置，并仍然为该响应降低延迟。假设你预测的文本是简单的 [Hono](https://hono.dev/) 服务器，如下所示：

```javascript
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

const app = new Hono();

app.get("/api", (c) => {
  return c.text("Hello Hono!");
});

// You will need to build the client code first: `pnpm run ui:build`.
app.use(
  "/*",
  serveStatic({
    rewriteRequestPath: (path) => `./dist${path}`,
  })
);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
```


你可以使用如下提示让模型重新生成该文件：

```
Add a get route to this application that responds with
the text "hello world". Generate the entire application
file again with this route added, and with no other
markdown formatting.
```

对该提示的响应可能类似于：

```javascript
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

const app = new Hono();

app.get("/api", (c) => {
  return c.text("Hello Hono!");
});

app.get("/hello", (c) => {
  return c.text("hello world");
});

// You will need to build the client code first: `pnpm run ui:build`.
app.use(
  "/*",
  serveStatic({
    rewriteRequestPath: (path) => `./dist${path}`,
  })
);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
```


不包含 `choices` 字段的简化版模型响应仍然会显示被接受的预测 token，尽管预测文本既出现在响应中新增内容之前，也出现在之后：

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1731014771,
  "model": "gpt-4o-2024-08-06",
  "usage": {
    "prompt_tokens": 203,
    "completion_tokens": 159,
    "total_tokens": 362,
    "prompt_tokens_details": { "cached_tokens": 0, "audio_tokens": 0 },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 60,
      "rejected_prediction_tokens": 0
    }
  },
  "system_fingerprint": "fp_9ee9e968ea"
}
```

这一次没有被拒绝的预测 token，因为我们预测的文件全部内容都被用于最终响应。太好了！🔥

## 限制

在使用 Predicted Outputs 时，你应当考虑以下因素与限制。

- Predicted Outputs 仅在 GPT-4o、GPT-4o-mini、GPT-4.1、GPT-4.1-mini 和 GPT-4.1-nano 系列模型中受支持。
- 提供预测时，任何未出现在最终补全中的 token 仍按补全 token 费率计费。请参阅 [`rejected_prediction_tokens` 对象的 `usage` 属性](https://developers.openai.com/api/reference/resources/chat#chat/object-usage) 以查看最终响应中有多少 token 未被使用。
- 以下 [API 参数](https://developers.openai.com/api/reference/resources/chat) 在使用时不支持 Predicted Outputs：
  - `n`: 不支持高于 1 的值
  - `logprobs`: 不支持
  - `presence_penalty`: 不支持大于 0 的值
  - `frequency_penalty`: 不支持大于 0 的值
  - `audio`: Predicted Outputs 与 [音频输入和输出](https://developers.openai.com/api/docs/guides/audio)
  - `modalities`: 仅支持 `text` 模态
  - `max_completion_tokens`: 不支持
  - `tools`: 当前 Predicted Outputs 不支持函数调用