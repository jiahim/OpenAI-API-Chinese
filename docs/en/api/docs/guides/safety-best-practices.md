# Safety best practices

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

### Use our free Moderation API

OpenAI's [Moderation API](https://developers.openai.com/api/docs/guides/moderation) is free-to-use and can help reduce the frequency of unsafe content in your completions. Alternatively, you may wish to develop your own content filtration system tailored to your use case.

If your application generates text with the Responses API or Chat Completions,
you can also [request moderation scores in the generation
request](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### Adversarial testing

We recommend “red-teaming” your application to ensure it's robust to adversarial input. Test your product over a wide range of inputs and user behaviors, both a representative set and those reflective of someone trying to ‘break' your application. Does it wander off topic? Can someone easily redirect the feature via prompt injections, e.g. “ignore the previous instructions and do this instead”?

### Human in the loop (HITL)

Wherever possible, we recommend having a human review outputs before they are used in practice. This is especially critical in high-stakes domains, and for code generation. Humans should be aware of the limitations of the system, and have access to any information needed to verify the outputs (for example, if the application summarizes notes, a human should have easy access to the original notes to refer back).

### Prompt engineering

“Prompt engineering” can help constrain the topic and tone of output text. This reduces the chance of producing undesired content, even if a user tries to produce it. Providing additional context to the model (such as by giving a few high-quality examples of desired behavior prior to the new input) can make it easier to steer model outputs in desired directions.

### “Know your customer” (KYC)

Users should generally need to register and log-in to access your service. Linking this service to an existing account, such as a Gmail, LinkedIn, or Facebook log-in, may help, though may not be appropriate for all use-cases. Requiring a credit card or ID card reduces risk further.

### Constrain user input and limit output tokens

Limiting the amount of text a user can input into the prompt helps avoid prompt injection. Limiting the number of output tokens helps reduce the chance of misuse.

Narrowing the ranges of inputs or outputs, especially drawn from trusted sources, reduces the extent of misuse possible within an application.

Allowing user inputs through validated dropdown fields (e.g., a list of movies on Wikipedia) can be more secure than allowing open-ended text inputs.

Returning outputs from a validated set of materials on the backend, where possible, can be safer than returning novel generated content (for instance, routing a customer query to the best-matching existing customer support article, rather than attempting to answer the query from-scratch).

### Allow users to report issues

Users should generally have an easily-available method for reporting improper functionality or other concerns about application behavior (listed email address, ticket submission method, etc). This method should be monitored by a human and responded to as appropriate.

### Understand and communicate limitations

From hallucinating inaccurate information, to offensive outputs, to bias, and much more, language models may not be suitable for every use case without significant modifications. Consider whether the model is fit for your purpose, and evaluate the performance of the API on a wide range of potential inputs in order to identify cases where the API's performance might drop. Consider your customer base and the range of inputs that they will be using, and ensure their expectations are calibrated appropriately.

**Safety and security are very important to us at OpenAI**.

If you notice any safety or security issues while developing with the API or anything else related to OpenAI, please submit it through our [Coordinated Vulnerability Disclosure Program](https://openai.com/security/disclosure/).

### Implement safety identifiers

Sending safety identifiers in your requests can help OpenAI monitor and detect abuse. This allows OpenAI to provide your team with more actionable feedback in the event that we detect any policy violations in your application.

Safety identifiers can also help your team respond to abuse faster. They create a stable way to trace activity back to an individual end user and reduce the chance that one user's misuse disrupts access for your broader organization.

A safety identifier should be a string that uniquely identifies each user. Hash the username or email address in order to avoid sending us any identifying information. If you offer a preview of your product to non-logged in users, you can send a session ID instead.

Safety identifiers are recommended for products where individual users interact
with a model, but they are not required. Include safety identifiers in your API
requests with the `safety_identifier` parameter:

Example: Providing a safety identifier

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-5.6",
    messages=[{"role": "user", "content": "This is a test"}],
    max_completion_tokens=5,
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
		Model:               "gpt-5.6",
		Messages:            []openai.ChatCompletionMessageParamUnion{openai.UserMessage("This is a test")},
		MaxCompletionTokens: openai.Int(5),
		SafetyIdentifier:    openai.String("user_123456"),
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
        .model("gpt-5.6")
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
  model: "gpt-5.6",
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
"model": "gpt-5.6",
"messages": [
{"role": "user", "content": "This is a test"}
],
"max_completion_tokens": 5,
"safety_identifier": "user123456"
}'
```


For Realtime API requests, provide the same stable, privacy-preserving identifier
with the `OpenAI-Safety-Identifier` header. When you create an ephemeral Realtime
client secret, include the header on the server-side request that creates the
secret so the identifier is bound to that session. For direct WebSocket or WebRTC
connection requests made from a trusted backend, include the header on the
connection request.

Safety identifiers do not carry over between APIs or sessions. If your
application already sends `safety_identifier` with Responses API requests, pass
the same stable value separately when you create or connect each Realtime
session.

### Revoke compromised API keys

If you believe an API key has been exposed, misused, or otherwise compromised,
revoke it promptly and replace it with a new key. Go to your [Security
settings](https://platform.openai.com/settings/profile/security) to view all API
keys and revoke any compromised keys.

### CSAM guidance

OpenAI has worked with child safety experts, including NCMEC and Thorn, to offer
developers practical guidance for protecting children. [Read the CSAM
guidance](https://developers.openai.com/api/docs/guides/csam-guidance).