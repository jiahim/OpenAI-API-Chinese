# Counting tokens

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Token counting lets you determine how many input tokens a request will use before you send it to the model. Use it to:

- **Optimize prompts** to fit within context limits
- **Estimate costs** before making API calls
- **Route requests** based on size (e.g., smaller prompts to faster models)
- **Avoid surprises** with images and files—no more character-based estimation

The [input token count endpoint](https://developers.openai.com/api/reference/python/resources/responses/subresources/input_tokens/methods/count) accepts the same input format as the [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create). Pass text, messages, images, files, tools, or conversations—the API returns the exact count the model will receive.

The count includes formatting tokens used to represent request structure, such as message roles and boundaries. These tokens might not appear in the text or fields you tokenize locally.

## Why use the token counting API?

Local tokenizers like [tiktoken](https://github.com/openai/tiktoken) work for plain text, but they have limitations:

- **Images and files** are not supported—estimates like `characters / 4` are inaccurate
- **Tools and schemas** add tokens that are hard to count locally
- **Model-specific behavior** can change tokenization (e.g., reasoning, caching)

The token counting API handles all of these. Use the same payload you would send to `responses.create` and get an accurate count. Then plug the result into your message validation or cost estimation flow.

## Count tokens in basic messages

Simple text input

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


## Count tokens in conversations

Multi-turn conversation

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


## Count tokens with instructions

Input with system instructions

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


## Count tokens with images

Images consume tokens based on size and detail level. The token counting API returns the exact count—no guesswork.

Input with an image

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


You can use `file_id` (from the [Files API](https://developers.openai.com/api/reference/resources/files)) or `image_url` (a URL or base64 data URL). See [images and vision](https://developers.openai.com/api/docs/guides/images-vision) for details.

## Count tokens with tools

Tool definitions (function schemas, MCP servers, etc.) add tokens to the context. Count them together with your input:

Input with function tools

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


## Count tokens with files

[File inputs](https://developers.openai.com/api/docs/guides/file-inputs)—currently PDFs—are supported. Pass `file_id`, `file_url`, or `file_data` as you would for `responses.create`. The token count reflects the model’s full processed input.

## Understand output token counts

Reported output token usage includes all tokens generated by the model, not only the text visible in a response. The Responses API reports this total as `output_tokens`, while the Chat Completions API reports it as `completion_tokens`.

Some models, including GPT-5 models, generate tokens used to format or delimit response channels, tool calls, and other message structure. These formatting tokens don't appear in message content or `logprobs`, and they aren't necessarily itemized separately in usage. As a result, the reported output or completion token count can be higher than the number of visible tokens or tokens included in `logprobs`, even when the reported `reasoning_tokens` value is `0`.

The `max_output_tokens` and `max_completion_tokens` parameters limit all tokens generated by the model, including non-visible tokens. The number of non-visible tokens varies by model and response shape, so don't assume a fixed difference between reported usage and visible output. Leave headroom in these limits when you need a specific amount of visible output.

## API reference

For full parameters and response shape, see the [Count input tokens API reference](https://developers.openai.com/api/reference/python/resources/responses/subresources/input_tokens/methods/count). The endpoint is:

```
POST /v1/responses/input_tokens
```

The response includes `input_tokens` (integer) and `object: "response.input_tokens"`.