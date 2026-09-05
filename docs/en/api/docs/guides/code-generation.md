# Code generation

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Writing, reviewing, editing, and answering questions about code is one of the primary use cases for OpenAI models today. This guide walks through your options for code generation with [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) and Codex.

## Get started



  - **[Use Codex for out-of-the-box coding agents](#use-codex)**: Connect your codebase to Codex and accelerate your projects using software engineering agents.
- **[Integrate with coding models](#integrate-with-coding-models)**: Use OpenAI models in your application. Add them to a model picker, for instance.



## Use Codex

[**Codex**](https://developers.openai.com/codex) is OpenAI's coding agent for software development. It helps you write, review and debug code. Interact with Codex in a variety of interfaces: in your IDE, through the CLI, on web and mobile sites, or in your CI/CD pipelines with the SDK. Codex is the best way to get agentic software engineering on your projects.

Codex works best with the latest general-purpose models, such as [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol). We offer a range of models specifically designed to work with coding agents like Codex, such as [`gpt-5.3-codex`](https://developers.openai.com/api/docs/models/gpt-5.3-codex), but we recommend using the latest general-purpose model for most code generation tasks.

See the [ChatGPT docs](https://developers.openai.com/codex) for setup guides, reference material, pricing, and more information.

## Integrate with coding models

For most API-based code generation, start with **`gpt-6-astra`**. It handles both general-purpose work and coding, which makes it a strong default when your application needs to write code, reason about requirements, inspect docs, and handle broader workflows in one place.

This example shows how you can use the [Responses API](https://developers.openai.com/api/reference/resources/responses) for a code generation use case:

Default model for most coding tasks

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const result = await openai.responses.create({
  model: "gpt-6-astra",
  input: `Find the null pointer exception in this code:

def display_name(user):
    return user.profile.name

print(display_name(None))
`,
  reasoning: { effort: "high" },
});

console.log(result.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

result = client.responses.create(
    model="gpt-6-astra",
    input="""Find the null pointer exception in this code:

def display_name(user):
    return user.profile.name

print(display_name(None))
""",
    reasoning={"effort": "high"},
)

print(result.output_text)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String(`Find the null pointer exception in this code:

def display_name(user):
    return user.profile.name

print(display_name(None))`)},
		Reasoning: shared.ReasoningParam{Effort: shared.ReasoningEffortHigh},
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
import com.openai.models.Reasoning;
import com.openai.models.ReasoningEffort;
import com.openai.models.responses.ResponseCreateParams;

String code =
    """
    def display_name(user):
        return user.profile.name

    print(display_name(None))
    """;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Find the null pointer exception in this code:\n\n" + code)
        .reasoning(Reasoning.builder().effort(ReasoningEffort.HIGH).build())
        .build();

client.responses().create(params).output().stream()
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
    ReasoningOptions = new ResponseReasoningOptions
    {
        ReasoningEffortLevel = ResponseReasoningEffortLevel.High,
    },
};
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem(
        """
        Find the null pointer exception in this code:

        def display_name(user):
            return user.profile.name

        print(display_name(None))
        """
    )
);

ResponseResult response = await client.CreateResponseAsync(options);
Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
code = <<~PYTHON
  def display_name(user):
      return user.profile.name

  print(display_name(None))
PYTHON

response = client.responses.create(
  model: "gpt-6-astra",
  input: "Find the null pointer exception in this code:\n\n#{code}",
  reasoning: {effort: :high}
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "input": "Find the null pointer exception in this code:\n\ndef display_name(user):\n    return user.profile.name\n\nprint(display_name(None))\n",
    "reasoning": { "effort": "high" }
  }'
```


## Frontend development

Our models from the GPT-5 family are especially strong at frontend development, especially when combined with a coding agent harness such as Codex.

The demo applications below were one shot generations, i.e. generated from a single prompt without hand-written code. Use them to evaluate frontend generation quality and prompt patterns for UI-heavy code generation workflows.

## Next steps

- Visit the [ChatGPT docs](https://developers.openai.com/codex) to learn what you can do with Codex, set up Codex in whichever interface you choose, or find more details.
- Read [Model guidance](https://developers.openai.com/api/docs/guides/latest-model) for model selection, features, migration guidance, and prompting patterns that work well on coding and agentic tasks.
- Compare [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) and [`gpt-5.3-codex`](https://developers.openai.com/api/docs/models/gpt-5.3-codex) on the model pages.