# Predicted Outputs

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

**Predicted Outputs** enable you to speed up API responses from [Chat Completions](https://developers.openai.com/api/reference/resources/chat) when many of the output tokens are known ahead of time. This is most common when you are regenerating a text or code file with minor modifications. You can provide your prediction using the [`prediction` request parameter in Chat Completions](https://developers.openai.com/api/reference/resources/chat#chat-create-prediction).

Predicted Outputs are available today using the latest `gpt-4o`, `gpt-4o-mini`, `gpt-4.1`, `gpt-4.1-mini`, and `gpt-4.1-nano` models. Read on to learn how to use Predicted Outputs to reduce latency in your applications.

## Code refactoring example

Predicted Outputs are particularly useful for regenerating text documents and code files with small modifications. Let's say you want the [GPT-4o model](https://developers.openai.com/api/docs/models#gpt-4o) to refactor a piece of JavaScript code, and convert the `username` property of the `User` class to be `email` instead:

```javascript
class User {
  firstName = "";
  lastName = "";
  username = "";
}

export default User;
```


Most of the file will be unchanged, except for line 4 above. If you use the current text of the code file as your prediction, you can regenerate the entire file with lower latency. These time savings add up quickly for larger files.

Below is an example of using the `prediction` parameter in our SDKs to predict that the final output of the model will be very similar to our original code file, which we use as the prediction text.

Refactor a JavaScript class with a Predicted Output

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


In addition to the refactored code, an abridged model response without the `choices` field contains usage data like this:

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

Note both the `accepted_prediction_tokens` and `rejected_prediction_tokens` in the `usage` object. In this example, 14 tokens from the prediction were used to speed up the response, while 2 were rejected.

Note that any rejected tokens are still billed like other completion tokens
  generated by the API, so Predicted Outputs can introduce higher costs for your
  requests.

## Streaming example

The latency gains of Predicted Outputs are even greater when you use streaming for API responses. Here is an example of the same code refactoring use case, but using streaming in the OpenAI SDKs instead.

Predicted Outputs with streaming

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


## Position of predicted text in response

When providing prediction text, your prediction can appear anywhere within the generated response, and still provide latency reduction for the response. Let's say your predicted text is the simple [Hono](https://hono.dev/) server shown below:

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


You could prompt the model to regenerate the file with a prompt like:

```
Add a get route to this application that responds with
the text "hello world". Generate the entire application
file again with this route added, and with no other
markdown formatting.
```

The response to the prompt might look something like this:

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


An abridged model response without the `choices` field would still show accepted prediction tokens, even though the prediction text appeared both before and after the new content added to the response:

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

This time, there were no rejected prediction tokens, because the entire content of the file we predicted was used in the final response. Nice! 🔥

## Limitations

When using Predicted Outputs, you should consider the following factors and limitations.

- Predicted Outputs are only supported with the GPT-4o, GPT-4o-mini, GPT-4.1, GPT-4.1-mini, and GPT-4.1-nano series of models.
- When providing a prediction, any tokens provided that are not part of the final completion are still charged at completion token rates. See the [`rejected_prediction_tokens` property of the `usage` object](https://developers.openai.com/api/reference/resources/chat#chat/object-usage) to see how many tokens are not used in the final response.
- The following [API parameters](https://developers.openai.com/api/reference/resources/chat) are not supported when using Predicted Outputs:
  - `n`: values higher than 1 are not supported
  - `logprobs`: not supported
  - `presence_penalty`: values greater than 0 are not supported
  - `frequency_penalty`: values greater than 0 are not supported
  - `audio`: Predicted Outputs are not compatible with [audio inputs and outputs](https://developers.openai.com/api/docs/guides/audio)
  - `modalities`: Only `text` modalities are supported
  - `max_completion_tokens`: not supported
  - `tools`: Function calling is not currently supported with Predicted Outputs