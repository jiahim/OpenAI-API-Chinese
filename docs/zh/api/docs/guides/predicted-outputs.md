# 预测输出

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

**预测输出** 使您能够加速 API 从 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) 的响应速度，当许多输出 token 是预先已知时。这最常见于您重新生成带有轻微修改的文本或代码文件时。您可以使用 [`prediction` 请求参数在 Chat Completions](https://developers.openai.com/api/reference/resources/chat#chat-create-prediction).

预测输出现已在最新 `gpt-4o`, `gpt-4o-mini`, `gpt-4.1`, `gpt-4.1-mini`，和 `gpt-4.1-nano` 模型中可用。继续阅读以了解如何使用预测输出减少应用程序中的延迟。

## 代码重构示例

预测输出对于通过少量修改重新生成文本文档和代码文件特别有用。假设你想让 [GPT-4o 模型](https://developers.openai.com/api/docs/models#gpt-4o) 重构一段 JavaScript 代码，并将 `username` 的属性 `User` 改为 `email` ：

```javascript
class User {
  firstName = "";
  lastName = "";
  username = "";
}

export default User;
```


除了上面的第 4 行之外，文件的大部分内容将保持不变。如果你使用代码文件的当前文本作为预测，就可以以更低的延迟重新生成整个文件。对于较大的文件，这些时间节省会很快累积起来。

以下是使用 `prediction` 参数的示例，在我们的 SDK 中预测模型的最终输出将与我们的原始代码文件非常相似，我们将其用作预测文本。

使用预测输出重构 JavaScript 类

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


除了重构后的代码外，不带 `choices` 字段的精简模型响应包含如下用量数据：

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

请注意 `accepted_prediction_tokens` 和 `rejected_prediction_tokens` 在 `usage` 对象中。在此示例中，预测中的 14 个 token 被用于加速响应，而有 2 个被拒绝。

请注意，任何被拒绝的 token 仍会像其他补全 token 一样计费
  由 API 生成，因此预测输出可能会为你的
  请求带来更高的成本。

## 流式传输示例

使用流式传输API响应时，预测输出的延迟优势会更加明显。以下是同一代码重构用例的示例，但改用OpenAI SDK中的流式传输。

使用流式传输的预测输出

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


## 预测文本在响应中的位置

提供预测文本时，你的预测可以出现在生成响应的任意位置，并且仍能减少响应延迟。假设你的预测文本是简单的 [Hono](https://hono.dev/) 服务器，如下所示：

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


你可以使用如下提示词让模型重新生成该文件：

```
Add a get route to this application that responds with
the text "hello world". Generate the entire application
file again with this route added, and with no other
markdown formatting.
```

对提示词的响应可能看起来像这样：

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


精简后的模型响应如果没有 `choices` 字段，仍然会显示已接受的预测 token，即使预测文本出现在添加到响应的新内容之前和之后：

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

这一次，没有被拒绝的预测 token，因为我们预测的文件的全部内容都用于最终响应。太棒了！🔥

## 限制

使用预测输出时，你应考虑以下因素和限制。

- 预测输出仅支持 GPT-4o、GPT-4o-mini、GPT-4.1、GPT-4.1-mini 和 GPT-4.1-nano 系列模型。
- 提供预测时，任何未包含在最终补全中的 tokens 仍按补全 token 费率收费。请参阅 [`rejected_prediction_tokens` 对象的 `usage` 属性](https://developers.openai.com/api/reference/resources/chat#chat/object-usage) 查看最终响应中未使用的 token 数量。
- 以下 [API 参数](https://developers.openai.com/api/reference/resources/chat) 在使用预测输出时不支持：
  - `n`：不支持大于 1 的值
  - `logprobs`：不支持
  - `presence_penalty`：不支持大于 0 的值
  - `frequency_penalty`：不支持大于 0 的值
  - `audio`：预测输出与 [音频输入和输出](https://developers.openai.com/api/docs/guides/audio)
  - `modalities`：不兼容：仅支持 `text` 模态
  - `max_completion_tokens`：不支持
  - `tools`：函数调用目前不支持与预测输出一起使用