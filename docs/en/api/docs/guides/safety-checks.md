# Safety classifiers

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

With the introduction of [GPT-5](https://developers.openai.com/api/docs/models/gpt-5), we added some checks to find and halt hazardous information from being accessed. It's likely some users will eventually try to use your application for things outside of OpenAI’s policies, especially in applications with a wide range of use cases.

## The safety classifier process

1. We classify requests to GPT-5 into risk thresholds.
1. If your org hits high thresholds repeatedly, OpenAI returns an error and sends a warning email.
1. If the requests continue past the stated time threshold (usually seven days), we stop your org's access to GPT-5. Requests will no longer work.

## How to avoid errors, latency, and bans

If your org engages in suspicious activity that violates our safety policies, we may return an error, limit model access, or even block your account. The following safety measures help us identify where high-risk requests are coming from and block individual end users, rather than blocking your entire org.

- [Implement safety identifiers](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) for products where individual users interact with a model. Safety identifiers are recommended but not required.
- If your use case depends on accessing a less restricted version of our services in order to engage in beneficial applications across the life sciences, read about our [special access program](https://help.openai.com/en/articles/11826767-life-science-research-special-access-program) to see if you meet criteria.

## Implementing safety identifiers for individual users

The `safety_identifier` parameter is available in both the [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) and older [Chat Completions API](https://developers.openai.com/api/reference/resources/chat). The Realtime API supports the same concept through the `OpenAI-Safety-Identifier` header. To use safety identifiers, provide a stable ID for your end user on each request. Hash user email or internal user IDs to avoid passing any personal information.

Safety identifiers do not carry over between APIs or sessions. If your application already sends `safety_identifier` with Responses API requests, pass the same stable value separately when you create or connect each Realtime session.



Responses API

    Providing a safety identifier with the Responses API

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6-terra",
  input: "This is a test",
  safety_identifier: "user_123456",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6-terra",
    input="This is a test",
    safety_identifier="user_123456",
)
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
		Model:            "gpt-5.6-terra",
		Input:            responses.ResponseNewParamsInputUnion{OfString: openai.String("This is a test")},
		SafetyIdentifier: openai.String("user_123456"),
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6-terra")
        .input("Help me plan a study schedule.")
        .safetyIdentifier("user_1234")
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6-terra",
  input: "Help me plan a study schedule.",
  safety_identifier: "user_1234"
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
"model": "gpt-5.6-terra",
"input": "This is a test",
"safety_identifier": "user_123456"
}'
```

  

  

    
Chat Completions API

    Providing a safety identifier with the Chat Completions API

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.chat.completions.create({
  model: "gpt-5.6-terra",
  messages: [{ role: "user", content: "This is a test" }],
  safety_identifier: "user_123456",
});

console.log(response.choices[0].message.content);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-5.6-terra",
    messages=[{"role": "user", "content": "This is a test"}],
    safety_identifier="user_123456",
)
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
	response, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model:            "gpt-5.6-terra",
		Messages:         []openai.ChatCompletionMessageParamUnion{openai.UserMessage("This is a test")},
		SafetyIdentifier: openai.String("user_123456"),
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Choices[0].Message.Content)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionCreateParams;

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-5.6-terra")
        .addUserMessage("Help me plan a study schedule.")
        .safetyIdentifier("user_1234")
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
completion = client.chat.completions.create(
  model: "gpt-5.6-terra",
  messages: [{role: :user, content: "Help me plan a study schedule."}],
  safety_identifier: "user_1234"
)

puts(completion.choices.fetch(0).message.content)
```

```bash
curl https://api.openai.com/v1/chat/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
"model": "gpt-5.6-terra",
"messages": [
{"role": "user", "content": "This is a test"}
],
"safety_identifier": "user_123456"
}'
```

  

  

    
Realtime API

    Providing a safety identifier with the Realtime API

```bash
curl https://api.openai.com/v1/realtime/client_secrets \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-H "OpenAI-Safety-Identifier: user_123456" \
-d '{
"session": {
"type": "realtime",
"model": "gpt-realtime-2.1"
}
}'
```



## Potential consequences

If OpenAI monitoring systems identify potential abuse, we may take different levels of action:

- **Delayed streaming responses**
  - As an initial, lower-consequence intervention for a user potentially violating policies, OpenAI may delay streaming responses while running additional checks before returning the full response to that user.
  - If the check passes, streaming begins. If the check fails, the request stops—no tokens show up, and the streamed response does not begin.
  - For a better end user experience, consider adding a loading spinner for cases where streaming is delayed.
- **Blocked model access for individual users**
  - In a high confidence policy violation, the associated `safety_identifier` is completely blocked from OpenAI model access.
  - The safety identifier receives an `identifier blocked` error on all future GPT-5 requests for the same identifier. OpenAI cannot currently unblock an individual identifier.

For these blocks to be effective, ensure you have controls in place to prevent blocked users from opening a new account. As a reminder, repeated policy violations from your organization can lead to losing access for your entire organization.

## Why we're doing this

The specific enforcement criteria may change based on evolving real-world usage or new model releases. Currently, OpenAI may restrict or block access for safety identifiers with risky or suspicious biology or chemical activity. See the [blog post](https://openai.com/index/preparing-for-future-ai-capabilities-in-biology/) for more information about how we’re approaching higher AI capabilities in biology.

## Other types of safety checks

For safeguards specific to tools and model customization, see [computer use confirmation and consent](https://developers.openai.com/api/docs/guides/tools-computer-use#handle-user-confirmation-and-consent) and [fine-tuning safety](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#safety-checks). OpenAI also publishes results in the [model evaluations hub](https://openai.com/safety/evaluations-hub).