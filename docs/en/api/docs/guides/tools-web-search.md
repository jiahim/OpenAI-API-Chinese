# Web search

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Web search allows models to access up-to-date information from the internet and provide answers with sourced citations. To enable this, use the web search tool in the Responses API or, in some cases, Chat Completions.

There are three main types of web search available with OpenAI models:

1. Non‑reasoning web search: The non-reasoning model sends the user’s query to the web search tool, which returns the response based on top results. There’s no internal planning and the model simply passes along the search tool’s responses. This method is fast and ideal for quick lookups.
2. Agentic search with reasoning models is an approach where the model actively manages the search process. It can perform web searches as part of its chain of thought, analyze results, and decide whether to keep searching. This flexibility makes agentic search well suited to complex workflows, but it also means searches take longer than quick lookups. For example, you can adjust reasoning levels on models like `gpt-5.5` to change both the depth and latency of the search.
3. Deep research is a specialized, agent-driven method for in-depth, extended investigations by reasoning models. The model conducts web searches as part of its chain of thought, often tapping into hundreds of sources. Deep research can run for several minutes and is best used with background mode. Use `gpt-5.5` with reasoning set to `high` or `xhigh`.

## Choose an integration

| Use case                                      | Recommended path                              | Notes                                                                                                       |
| --------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| New web search integration                    | Responses API with `web_search` and `gpt-5.5` | Supports hosted web search controls such as filters, sources, live-access control, and longer research runs |
| Existing Chat Completions search integration  | Chat Completions with `gpt-5-search-api`      | Use this only when you need to preserve a Chat Completions integration                                      |
| Multi-step research or long-running reporting | `gpt-5.5` with `high` or `xhigh` reasoning    | Use background mode for reports that can take several minutes                                               |

Using the [Responses API](https://developers.openai.com/api/reference/resources/responses), you can enable web search by configuring it in the `tools` array in an API request to generate content. Like any other tool, the model can choose to search the web or not based on the content of the input prompt.

For new Responses API integrations, use `{ "type": "web_search" }`. The earlier `web_search_preview` tool remains available for legacy integrations, but it does not support newer controls such as `filters`, `external_web_access`, and `return_token_budget`.

Web search tool example

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  tools: [{ type: "web_search" }],
  input: "What was a positive news story from today?",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    tools=[{"type": "web_search"}],
    input="What was a positive news story from today?",
)

print(response.output_text)
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
		Model: "gpt-5.6",
		Tools: []responses.ToolUnionParam{
			responses.ToolParamOfWebSearch(responses.WebSearchToolTypeWebSearch),
		},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What was a positive news story from today?")},
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
import com.openai.models.responses.WebSearchTool;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("What was a positive news story from today?")
        .addTool(WebSearchTool.builder().type(WebSearchTool.Type.WEB_SEARCH).build())
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

CreateResponseOptions options = new() { Model = "gpt-5.6" };
options.Tools.Add(ResponseTool.CreateWebSearchTool());
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("What was a positive news story from today?")
);

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

openai = OpenAI::Client.new

response = openai.responses.create(
  model: "gpt-5.6",
  tools: [{type: "web_search"}],
  input: "What was a positive news story from today?"
)

puts(response.output_text)
```

```bash
curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-5.6",
        "tools": [{"type": "web_search"}],
        "input": "what was a positive news story from today?"
}'
```

```bash
openai responses create \
  --model gpt-5.6 \
  --raw-output \
  --transform 'output.#(type=="message").content.0.text' <<'YAML'
tools:
  - type: web_search
input: What was a positive news story from today?
YAML
```


## Output and citations

Model responses that use the web search tool will include two parts:

- A `web_search_call` output item with the ID of the search call, along with the action taken in `web_search_call.action`. The action is one of:
  - `search`, which represents a web search. It will usually (but not always) includes the search `queries` which were searched. Search actions incur a tool call cost (see [pricing](https://developers.openai.com/api/docs/pricing#built-in-tools)).
  - `open_page`, which represents a page being opened. Supported in reasoning models.
  - `find_in_page`, which represents searching within a page. Supported in reasoning models.
- A `message` output item containing:
  - The text result in `message.content[0].text`
  - Annotations `message.content[0].annotations` for the cited URLs

By default, the model's response will include inline citations for URLs found in the web search results. In addition to this, the `url_citation` annotation object will contain the URL, title and location of the cited source.

When displaying web results or information contained in web results to end
  users, inline citations must be made clearly visible and clickable in your
  user interface.

```json
[
  {
    "type": "web_search_call",
    "id": "ws_67c9fa0502748190b7dd390736892e100be649c1a5ff9609",
    "status": "completed",
    "action": {
      "type": "search",
      "query": "latest news about AI"
    }
  },
  {
    "id": "msg_67c9fa077e288190af08fdffda2e34f20be649c1a5ff9609",
    "type": "message",
    "status": "completed",
    "role": "assistant",
    "content": [
      {
        "type": "output_text",
        "text": "On March 6, 2025, several news...",
        "annotations": [
          {
            "type": "url_citation",
            "start_index": 2606,
            "end_index": 2758,
            "url": "https://...",
            "title": "Title..."
          }
        ]
      }
    ]
  }
]
```





## Migrating from legacy web search

| If you use                                              | Recommended path                                                                                        | Notes                                                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `web_search_preview` in Responses                       | Migrate to `web_search`                                                                                 | `web_search` supports newer controls such as `filters`, `external_web_access`, and `return_token_budget` |
| `gpt-4o-search-preview` or `gpt-4o-mini-search-preview` | Migrate to Responses `web_search`, or use `gpt-5-search-api` if you must stay on Chat Completions       | The preview search models are deprecated and shut down on 2026-07-23                                     |
| Chat Completions search integrations                    | Use `gpt-5-search-api`, or migrate to Responses `web_search` for more tool controls and optional search | Chat Completions search models always search before responding; Responses search is a tool               |

## Search context size

`search_context_size` controls how much context from web search results is made available to the model before it generates a response. Use `low` for simple lookups, `medium` for a balanced default, and `high` when the answer may require more detail from search results. This setting does not set an exact token count or guarantee a specific number of sources or citations.



Set search context size

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.6",
  tools: [
    {
      type: "web_search",
      search_context_size: "low",
    },
  ],
  input: "What movie won best picture in 2025?",
});
console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    tools=[
        {
            "type": "web_search",
            "search_context_size": "low",
        }
    ],
    input="What movie won best picture in 2025?",
)

print(response.output_text)
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
	tool := responses.ToolParamOfWebSearch(responses.WebSearchToolTypeWebSearch)
	tool.OfWebSearch.SearchContextSize = responses.WebSearchToolSearchContextSizeLow
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What movie won best picture in 2025?")},
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
import com.openai.models.responses.WebSearchTool;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("What movie won best picture in 2025?")
        .addTool(
            WebSearchTool.builder()
                .type(WebSearchTool.Type.WEB_SEARCH)
                .searchContextSize(WebSearchTool.SearchContextSize.LOW)
                .build())
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

CreateResponseOptions options = new() { Model = "gpt-5.6" };
options.Tools.Add(
    ResponseTool.CreateWebSearchTool(
        searchContextSize: WebSearchToolContextSize.Low
    )
);
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("What movie won best picture in 2025?")
);

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-5.6",
  input: "What movie won best picture in 2025?",
  tools: [{type: :web_search, search_context_size: :low}]
)

puts(response.output_text)
```

```bash
curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-5.6",
        "tools": [{
            "type": "web_search",
            "search_context_size": "low"
        }],
        "input": "What movie won best picture in 2025?"
    }'
```




## Run longer web research

`return_token_budget` controls how much web search result content the tool can return during a Responses API search run with GPT-5+ reasoning models. Keep the default for most requests. Set it to `unlimited` only for high-effort research or evaluation runs that need to inspect many pages and might otherwise stop at the standard returned-token cap.

Use `unlimited` selectively because it can increase latency and cost. For long-running multi-search tasks, use background mode (`background: true`) so the request can keep running asynchronously and you can retrieve the final response later.

| Value       | Behavior                                                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `default`   | Uses the standard returned-token budget for web search results. This is the same behavior as omitting `return_token_budget`. |
| `unlimited` | Removes the default returned-token budget for the web search run.                                                            |

This parameter applies only to the hosted Responses API `web_search` tool with GPT-5+ reasoning web search. It does not change the search context window, and it does not apply to non-reasoning web search, legacy Search API paths, container web search, Chat Completions search models, or `web_search_preview`. Only `default` and `unlimited` are supported values; `null`, numbers, and other strings are rejected.



Run longer web searches

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  reasoning: { effort: "xhigh" },
  tools: [
    {
      type: "web_search",
      return_token_budget: "unlimited",
    },
  ],
  input: [
    "Research the economic impact of semaglutide on global healthcare systems.",
    "",
    "Do:",
    "- Include specific figures, trends, statistics, and measurable outcomes.",
    "- Prioritize reliable, up-to-date sources: peer-reviewed research, health organizations (e.g., WHO, CDC), regulatory agencies, or pharmaceutical earnings reports.",
    "- Include inline citations and return all source metadata.",
    "",
    "Be analytical, avoid generalities, and ensure that each section supports data-backed reasoning that could inform healthcare policy or financial modeling.",
  ].join("\n"),
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    reasoning={"effort": "xhigh"},
    tools=[
        {
            "type": "web_search",
            "return_token_budget": "unlimited",
        }
    ],
    input="""Research the economic impact of semaglutide on global healthcare systems.

Do:
- Include specific figures, trends, statistics, and measurable outcomes.
- Prioritize reliable, up-to-date sources: peer-reviewed research, health organizations (e.g., WHO, CDC), regulatory agencies, or pharmaceutical earnings reports.
- Include inline citations and return all source metadata.

Be analytical, avoid generalities, and ensure that each section supports data-backed reasoning that could inform healthcare policy or financial modeling.""",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	tool := responses.ToolParamOfWebSearch(responses.WebSearchToolTypeWebSearch)
	tool.OfWebSearch.SetExtraFields(map[string]any{"return_token_budget": "unlimited"})
	input := strings.Join([]string{
		"Research the economic impact of semaglutide on global healthcare systems.",
		"",
		"Do:",
		"- Include specific figures, trends, statistics, and measurable outcomes.",
		"- Prioritize reliable, up-to-date sources: peer-reviewed research, health organizations, regulatory agencies, or pharmaceutical earnings reports.",
		"- Include inline citations and return all source metadata.",
		"",
		"Be analytical, avoid generalities, and ensure that each section supports data-backed reasoning that could inform healthcare policy or financial modeling.",
	}, "\n")
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:     "gpt-5.6",
		Reasoning: shared.ReasoningParam{Effort: shared.ReasoningEffortXhigh},
		Tools:     []responses.ToolUnionParam{tool},
		Input:     responses.ResponseNewParamsInputUnion{OfString: openai.String(input)},
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
import com.openai.core.JsonValue;
import com.openai.models.Reasoning;
import com.openai.models.ReasoningEffort;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.WebSearchTool;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input(
            "Research the economic impact of semaglutide on global healthcare systems. Include current figures and citations.")
        .reasoning(Reasoning.builder().effort(ReasoningEffort.XHIGH).build())
        .addTool(
            WebSearchTool.builder()
                .type(WebSearchTool.Type.WEB_SEARCH)
                .putAdditionalProperty("return_token_budget", JsonValue.from("unlimited"))
                .build())
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
  model: "gpt-5.6",
  input: "Research the economic impact of semaglutide on global healthcare systems. Include current figures and citations.",
  reasoning: {effort: :xhigh},
  tools: [{type: :web_search, return_token_budget: :unlimited}]
)

puts(response.output_text)
```

```bash
curl "https://api.openai.com/v1/responses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "reasoning": { "effort": "xhigh" },
    "tools": [
      {
        "type": "web_search",
        "return_token_budget": "unlimited"
      }
    ],
    "input": "Research the economic impact of semaglutide on global healthcare systems.\n\nDo:\n- Include specific figures, trends, statistics, and measurable outcomes.\n- Prioritize reliable, up-to-date sources: peer-reviewed research, health organizations (e.g., WHO, CDC), regulatory agencies, or pharmaceutical earnings reports.\n- Include inline citations and return all source metadata.\n\nBe analytical, avoid generalities, and ensure that each section supports data-backed reasoning that could inform healthcare policy or financial modeling."
  }'
```




## Domain filtering

Domain filtering in web search lets you limit results to a specific set of domains. With the `filters` parameter you can configure up to 100 `allowed_domains` or up to 100 `blocked_domains`. When formatting domains, omit the HTTP or HTTPS prefix. For example, use `openai.com` instead of `https://openai.com/`. This approach also includes subdomains in the search. Note that domain filtering is only available in the Responses API with the `web_search` tool.



## Sources

To view all URLs retrieved during a web search, use the `sources` field. Unlike inline citations, which show only the most relevant references, sources returns the complete list of URLs the model consulted when forming its response.
The number of sources is often greater than the number of citations. Real-time third-party feeds are also surfaced here and are labeled as `oai-sports`, `oai-weather`, or `oai-finance`. The sources field is available with both the `web_search` and `web_search_preview` tools.

List sources

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  reasoning: { effort: "low" },
  tools: [
    {
      type: "web_search",
      filters: {
        allowed_domains: [
          "pubmed.ncbi.nlm.nih.gov",
          "clinicaltrials.gov",
          "www.who.int",
          "www.cdc.gov",
          "www.fda.gov",
        ],
        blocked_domains: ["reddit.com", "quora.com", "wikipedia.org"],
      },
    },
  ],
  tool_choice: "auto",
  include: ["web_search_call.action.sources"],
  input:
    "Please perform a web search on how semaglutide is used in the treatment of diabetes.",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    reasoning={"effort": "low"},
    tools=[
        {
            "type": "web_search",
            "filters": {
                "allowed_domains": [
                    "pubmed.ncbi.nlm.nih.gov",
                    "clinicaltrials.gov",
                    "www.who.int",
                    "www.cdc.gov",
                    "www.fda.gov",
                ],
                "blocked_domains": [
                    "reddit.com",
                    "quora.com",
                    "wikipedia.org",
                ],
            },
        }
    ],
    tool_choice="auto",
    include=["web_search_call.action.sources"],
    input="Please perform a web search on how semaglutide is used in the treatment of diabetes.",
)

print(response.output_text)
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
	tool := responses.ToolParamOfWebSearch(responses.WebSearchToolTypeWebSearch)
	tool.OfWebSearch.Filters = responses.WebSearchToolFiltersParam{
		AllowedDomains: []string{"pubmed.ncbi.nlm.nih.gov", "clinicaltrials.gov", "www.who.int", "www.cdc.gov", "www.fda.gov"},
	}
	tool.OfWebSearch.Filters.SetExtraFields(map[string]any{"blocked_domains": []string{"reddit.com", "quora.com", "wikipedia.org"}})
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:     "gpt-5.6",
		Reasoning: shared.ReasoningParam{Effort: shared.ReasoningEffortLow},
		Tools:     []responses.ToolUnionParam{tool},
		Include:   []responses.ResponseIncludable{responses.ResponseIncludableWebSearchCallActionSources},
		Input:     responses.ResponseNewParamsInputUnion{OfString: openai.String("Please perform a web search on how semaglutide is used in the treatment of diabetes.")},
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
import com.openai.core.JsonValue;
import com.openai.models.Reasoning;
import com.openai.models.ReasoningEffort;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseIncludable;
import com.openai.models.responses.WebSearchTool;
import java.util.List;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("Search for how semaglutide is used in the treatment of diabetes.")
        .reasoning(Reasoning.builder().effort(ReasoningEffort.LOW).build())
        .addInclude(ResponseIncludable.of("web_search_call.action.sources"))
        .addTool(
            WebSearchTool.builder()
                .type(WebSearchTool.Type.WEB_SEARCH)
                .filters(
                    WebSearchTool.Filters.builder()
                        .allowedDomains(
                            List.of(
                                "pubmed.ncbi.nlm.nih.gov",
                                "clinicaltrials.gov",
                                "www.who.int",
                                "www.cdc.gov",
                                "www.fda.gov"))
                        .putAdditionalProperty(
                            "blocked_domains",
                            JsonValue.from(List.of("reddit.com", "quora.com", "wikipedia.org")))
                        .build())
                .build())
        .build();

var response = client.responses().create(params);
response.output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
response.output().stream()
    .flatMap(item -> item.webSearchCall().stream())
    .flatMap(call -> call.action().search().stream())
    .flatMap(action -> action.sources().stream())
    .flatMap(List::stream)
    .forEach(source -> System.out.println(source.url()));
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-5.6",
  reasoning: {effort: :low},
  input: "Search for how semaglutide is used in the treatment of diabetes.",
  include: ["web_search_call.action.sources"],
  tools: [
    {
      type: :web_search,
      filters: {
        allowed_domains: [
          "pubmed.ncbi.nlm.nih.gov",
          "clinicaltrials.gov",
          "www.who.int",
          "www.cdc.gov",
          "www.fda.gov"
        ],
        blocked_domains: ["reddit.com", "quora.com", "wikipedia.org"]
      }
    }
  ]
)

puts(response.output_text)
response.output
  .grep(OpenAI::Models::Responses::ResponseFunctionWebSearch)
  .each do |search_call|
    action = search_call.action
    next unless action.is_a?(
      OpenAI::Models::Responses::ResponseFunctionWebSearch::Action::Search
    )

    Array(action.sources).each { |source| puts(source.url) }
  end
```

```bash
curl "https://api.openai.com/v1/responses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "reasoning": { "effort": "low" },
    "tools": [
      {
        "type": "web_search",
        "filters": {
          "allowed_domains": [
            "pubmed.ncbi.nlm.nih.gov",
            "clinicaltrials.gov",
            "www.who.int",
            "www.cdc.gov",
            "www.fda.gov"
          ],
          "blocked_domains": [
            "reddit.com",
            "quora.com",
            "wikipedia.org"
          ]
        }
      }
    ],
    "tool_choice": "auto",
    "include": ["web_search_call.action.sources"],
    "input": "Please perform a web search on how semaglutide is used in the treatment of diabetes."
  }'
```






## Image search results

Web search can return image results alongside regular text results. Use image search when your application needs current or web-grounded visuals, such as product photos, landmarks, places, events, or visual references.

To use image search, set `search_content_types` to include `image`. Add `text` when you also want supporting text results that help the model summarize, rank, or explain the retrieved images.

Use `image_settings` to control image-specific behavior:

- `max_results`: Request a positive number of image results.
- `caption`: Ask for short image descriptions when available.

To inspect raw image results, include `web_search_call.results` in the request and read `web_search_call.results[]` from the response. Image results are returned separately from the assistant message, so parse the `web_search_call` item directly when your application needs the URLs or metadata.

Search for images

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  reasoning: { effort: "low" },
  tools: [
    {
      type: "web_search",
      search_content_types: ["image", "text"],
      image_settings: {
        max_results: 3,
        caption: true,
      },
    },
  ],
  include: ["web_search_call.results"],
  input:
    "Search for recent images and supporting text sources about the Golden Gate Bridge at sunset.",
});

console.log(response.output);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    reasoning={"effort": "low"},
    tools=[
        {
            "type": "web_search",
            "search_content_types": ["image", "text"],
            "image_settings": {
                "max_results": 3,
                "caption": True,
            },
        }
    ],
    include=["web_search_call.results"],
    input="Search for recent images and supporting text sources about the Golden Gate Bridge at sunset.",
)

print(response.output)
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
	tool := responses.ToolParamOfWebSearch(responses.WebSearchToolTypeWebSearch)
	tool.OfWebSearch.SetExtraFields(map[string]any{
		"search_content_types": []string{"image", "text"},
		"image_settings":       map[string]any{"max_results": 3, "caption": true},
	})
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:     "gpt-5.6",
		Reasoning: shared.ReasoningParam{Effort: shared.ReasoningEffortLow},
		Tools:     []responses.ToolUnionParam{tool},
		Include:   []responses.ResponseIncludable{responses.ResponseIncludableWebSearchCallResults},
		Input:     responses.ResponseNewParamsInputUnion{OfString: openai.String("Search for recent images and supporting text sources about the Golden Gate Bridge at sunset.")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Output)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.Reasoning;
import com.openai.models.ReasoningEffort;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseIncludable;
import com.openai.models.responses.WebSearchTool;
import java.util.List;
import java.util.Map;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input(
            "Search for recent images and supporting text sources about the Golden Gate Bridge at sunset.")
        .reasoning(Reasoning.builder().effort(ReasoningEffort.LOW).build())
        .addInclude(ResponseIncludable.of("web_search_call.results"))
        .addTool(
            WebSearchTool.builder()
                .type(WebSearchTool.Type.WEB_SEARCH)
                .putAdditionalProperty(
                    "search_content_types", JsonValue.from(List.of("image", "text")))
                .putAdditionalProperty(
                    "image_settings", JsonValue.from(Map.of("max_results", 3, "caption", true)))
                .build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.webSearchCall().stream())
    .map(call -> call._additionalProperties().get("results"))
    .filter(java.util.Objects::nonNull)
    .forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-5.6",
  reasoning: {effort: :low},
  input: "Search for recent images and supporting text sources about the Golden Gate Bridge at sunset.",
  include: ["web_search_call.results"],
  tools: [
    {
      type: :web_search,
      search_content_types: ["image", "text"],
      image_settings: {max_results: 3, caption: true}
    }
  ]
)

puts(response.output)
```

```bash
curl "https://api.openai.com/v1/responses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "reasoning": { "effort": "low" },
    "tools": [
      {
        "type": "web_search",
        "search_content_types": ["image", "text"],
        "image_settings": {
          "max_results": 3,
          "caption": true
        }
      }
    ],
    "include": ["web_search_call.results"],
    "input": "Search for recent images and supporting text sources about the Golden Gate Bridge at sunset."
  }'
```


Each `image_result` includes:

- `image_url`: The canonical image URL for the result.
- `source_website_url`: The page where the image was found.
- `thumbnail_url`: A thumbnail URL when available.
- `caption`: A short caption or description when available.

```json
{
  "output": [
    {
      "type": "web_search_call",
      "status": "completed",
      "results": [
        {
          "type": "image_result",
          "image_url": "https://cdn.example/golden-gate-sunset.jpg",
          "thumbnail_url": "https://cdn.example/golden-gate-sunset-thumb.jpg",
          "source_website_url": "https://example.com/source-page",
          "caption": "Golden Gate Bridge at sunset"
        }
      ]
    }
  ]
}
```



## User location

To refine search results based on geography, you can specify an approximate user location using country, city, region, and/or timezone.

- The `city` and `region` fields are free text strings, like `Minneapolis` and `Minnesota` respectively.
- The `country` field is a two-letter [ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1), like `US`.
- The `timezone` field is an [IANA timezone](https://timeapi.io/documentation/iana-timezones) like `America/Chicago`.

Note that user location is not supported for deep research models using web
  search.



Customizing user location

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.6",
  tools: [
    {
      type: "web_search",
      user_location: {
        type: "approximate",
        country: "GB",
        city: "London",
        region: "London",
      },
    },
  ],
  input: "What are the best restaurants near me?",
});
console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    tools=[
        {
            "type": "web_search",
            "user_location": {
                "type": "approximate",
                "country": "GB",
                "city": "London",
                "region": "London",
            },
        }
    ],
    input="What are the best restaurants near me?",
)

print(response.output_text)
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
	tool := responses.ToolParamOfWebSearch(responses.WebSearchToolTypeWebSearch)
	tool.OfWebSearch.UserLocation = responses.WebSearchToolUserLocationParam{
		Type:    "approximate",
		Country: openai.String("GB"),
		City:    openai.String("London"),
		Region:  openai.String("London"),
	}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What are the best restaurants near me?")},
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
import com.openai.models.responses.WebSearchTool;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("What are the best restaurants near me?")
        .addTool(
            WebSearchTool.builder()
                .type(WebSearchTool.Type.WEB_SEARCH)
                .userLocation(
                    WebSearchTool.UserLocation.builder()
                        .type(WebSearchTool.UserLocation.Type.APPROXIMATE)
                        .city("London")
                        .country("GB")
                        .region("London")
                        .build())
                .build())
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

CreateResponseOptions options = new() { Model = "gpt-5.6" };
options.Tools.Add(
    ResponseTool.CreateWebSearchTool(
        userLocation: WebSearchToolLocation.CreateApproximateLocation(
            country: "GB",
            city: "London",
            region: "London"
        )
    )
);
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("What are the best restaurants near me?")
);

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-5.6",
  input: "What are the best restaurants near me?",
  tools: [
    {
      type: :web_search,
      user_location: {
        type: :approximate,
        country: "GB",
        city: "London",
        region: "London"
      }
    }
  ]
)

puts(response.output_text)
```

```bash
curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-5.6",
        "tools": [{
            "type": "web_search",
            "user_location": {
                "type": "approximate",
                "country": "GB",
                "city": "London",
                "region": "London"
            }
        }],
        "input": "What are the best restaurants near me?"
    }'
```






## Live internet access

Control whether the web search tool fetches live content or uses only cached/indexed results in the Responses API.

- Set `external_web_access: false` on the `web_search` tool to run in offline/cache‑only mode.
- Default is `true` (live access) if you do not set it.
- Preview variants (`web_search_preview`) ignore this parameter and behave as if `external_web_access` is `true`.



Control live internet access

```bash
curl "https://api.openai.com/v1/responses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "tools": [
      { "type": "web_search", "external_web_access": false }
    ],
    "tool_choice": "auto",
    "input": "Find when the Eiffel Tower opened to the public and cite the source."
  }'
```

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  tools: [{ type: "web_search", external_web_access: false }],
  tool_choice: "auto",
  input: "Find when the Eiffel Tower opened to the public and cite the source.",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

resp = client.responses.create(
    model="gpt-5.6",
    tools=[{"type": "web_search", "external_web_access": False}],
    tool_choice="auto",
    input="Find when the Eiffel Tower opened to the public and cite the source.",
)
print(resp.output_text)
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
	tool := responses.ToolParamOfWebSearch(responses.WebSearchToolTypeWebSearch)
	tool.OfWebSearch.SetExtraFields(map[string]any{"external_web_access": false})
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Find when the Eiffel Tower opened to the public and cite the source.")},
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
import com.openai.core.JsonValue;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.WebSearchTool;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("Find when the Eiffel Tower opened to the public and cite the source.")
        .addTool(
            WebSearchTool.builder()
                .type(WebSearchTool.Type.WEB_SEARCH)
                .putAdditionalProperty("external_web_access", JsonValue.from(false))
                .build())
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
  model: "gpt-5.6",
  input: "Find when the Eiffel Tower opened to the public and cite the source.",
  tools: [{type: :web_search, external_web_access: false}]
)

puts(response.output_text)
```




## Limitations

#### Chat Completions API

The Chat Completions API supports only specialized search models for web search. These models do not support Responses API `web_search` features such as domain filters, complete source lists, live-access control, and returned-token budget control.

| Model                        | Context window | Limitation                                                                                                                                   |
| ---------------------------- | -------------: | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `gpt-5-search-api`           |           200k | Uses the Chat Completions search model path                                                                                                  |
| `gpt-4o-search-preview`      |           128k | Uses the Chat Completions search model path; [deprecated, shutdown 2026-07-23](https://developers.openai.com/api/docs/deprecations#2026-04-22-legacy-gpt-model-snapshots) |
| `gpt-4o-mini-search-preview` |           128k | Uses the Chat Completions search model path; [deprecated, shutdown 2026-07-23](https://developers.openai.com/api/docs/deprecations#2026-04-22-legacy-gpt-model-snapshots) |

#### Responses API

Use the hosted `web_search` tool. The Responses API still accepts `web_search_preview` for legacy integrations, but use `web_search` for new integrations.

For a larger model context window, use `gpt-5.5`. The web search context window remains 128k.

| Model          | Model context window | Limitation                                                                                                                         |
| -------------- | -------------------: | ---------------------------------------------------------------------------------------------------------------------------------- |
| `gpt-4.1`      |                   1M | Search context is limited to 128k                                                                                                  |
| `gpt-4.1-mini` |                   1M | Search context is limited to 128k                                                                                                  |
| `o4-mini`      |                 200k | Search context is limited to 128k; [deprecated, shutdown 2026-10-23](https://developers.openai.com/api/docs/deprecations#2026-04-22-legacy-gpt-model-snapshots) |

For Responses API web search, the search context window is limited to 128k, even when the model context window is larger.

- Web search does not support [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5) with `minimal` reasoning.
- [`gpt-5.4`](https://developers.openai.com/api/docs/models/gpt-5.4) with reasoning effort set to `none` may produce lower-quality results.
- Responses API web search uses the underlying model's tiered rate limits.
- `web_search_preview` does not support `filters` or `return_token_budget`, and ignores `external_web_access`.
- With `tool_choice: "auto"`, search is optional. Use `tool_choice: "required"` or a specific web search tool choice when search must run.

## Usage notes

<table>
<tbody>

<tr>
  <th>API Availability</th>
  <th>Rate limits</th>
  <th>Notes</th>
</tr>

<tr>
  <td>
    

      [Responses](https://developers.openai.com/api/reference/resources/responses)
    

    

      [Chat Completions](https://developers.openai.com/api/reference/resources/chat)
    

    

      [Assistants](https://developers.openai.com/api/reference/resources/beta/subresources/assistants)
    

  </td>
  <td style={{ maxWidth: "150px" }}>
    Same as tiered rate limits for underlying [model](https://developers.openai.com/api/docs/models) used
    with the tool.
  </td>
  <td style={{ maxWidth: "150px" }}>
    [Pricing](https://developers.openai.com/api/docs/pricing#built-in-tools) 

    [ZDR and data residency](https://developers.openai.com/api/docs/guides/your-data)
  </td>
</tr>

</tbody>
</table>