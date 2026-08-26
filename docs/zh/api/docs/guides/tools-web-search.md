# 网页搜索

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

网页搜索允许模型访问互联网上的最新信息，并提供带有引用来源的答案。要启用此功能，请在 Responses API 中使用 网页搜索 工具，或在某些情况下使用 Chat Completions。

OpenAI 模型提供三种主要的 网页搜索 类型：

1. 非推理型网页搜索：非推理模型将用户的查询发送给网页搜索工具，该工具基于顶部结果返回响应。没有内部规划，模型只是直接传递搜索工具的响应。这种方法速度快，非常适合快速查询。
2. 使用推理模型进行智能体搜索是一种模型主动管理搜索过程的方法。它可以在思维链中执行网页搜索，分析结果，并决定是否继续搜索。这种灵活性使智能体搜索非常适合复杂的工作流，但也意味着搜索比快速查询耗时更长。例如，你可以在以下模型上调整推理等级 `gpt-5.5` 来同时改变搜索的深度和延迟。
3. 深度研究是一种由智能体驱动的专用方法，用于推理模型进行深入、扩展的调查。模型在思维链中执行网页搜索，通常涉及数百个来源。深度研究可能运行几分钟，最适合在后台模式下使用。使用 `gpt-5.5` 并将推理设置为 `high` 或 `xhigh`.

## 选择一个集成

| 使用场景                                      | 推荐路径                              | 备注                                                                                                       |
| --------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 新的网页搜索集成                    | Responses API 搭配 `web_search` 和 `gpt-5.5` | 支持托管的网页搜索控制，如过滤器、来源、实时访问控制以及更长时间的研究运行 |
| 现有的 Chat Completions 搜索集成  | Chat Completions 搭配 `gpt-5-search-api`      | 仅当你需要保留 Chat Completions 集成时使用此路径                                      |
| 多步骤研究或长时间运行的报告 | `gpt-5.5` 搭配 `high` 或 `xhigh` 推理    | 对于可能需要几分钟的报告，请使用后台模式                                               |

使用 [Responses API](https://developers.openai.com/api/reference/resources/responses)，时，你可以通过在 `tools` 数组中配置 网页搜索，并在 API 请求中启用它来生成内容。与其他工具一样，模型可以根据输入提示词的内容选择是否进行网页搜索。

对于新的 Responses API 集成，请使用 `{ "type": "web_search" }`。较早的 `web_search_preview` 工具仍可用于旧版集成，但它不支持较新的控制项，例如 `filters`, `external_web_access`，以及 `return_token_budget`.

网页搜索工具示例

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


## 输出与引用

使用网页搜索工具的模型响应将包含两个部分：

- 一个 `web_search_call` 输出项包含搜索调用的 ID，以及所采取的操作 `web_search_call.action`。操作是以下之一：
  - `search`，代表网页搜索。它通常（但不总是）包含搜索 `queries` 被搜索的内容。搜索操作会产生工具调用费用（参见 [定价](https://developers.openai.com/api/docs/pricing#built-in-tools)).
  - `open_page`，代表打开页面。在推理模型中支持。
  - `find_in_page`，代表在页面内搜索。在推理模型中支持。
- 一个 `message` 输出项包含：
  - 文本结果位于 `message.content[0].text`
  - 注释 `message.content[0].annotations` 用于引用的 URL

默认情况下，模型的响应将包含 网页搜索结果中找到的 URL 的内联引用。除此之外， `url_citation` 注记对象将包含所引用来源的 URL、标题和位置。

当向最终用户显示网页结果或网页结果中包含的信息时
  用户必须能够清晰看到并点击应用中的内联引用，
  即在用户界面中。

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





## 从旧版网页搜索迁移

| 如果你使用                                              | 推荐路径                                                                                        | 备注                                                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `web_search_preview` 在 Responses 中                       | 迁移到 `web_search`                                                                                 | `web_search` 支持更新的控制项，如 `filters`, `external_web_access`，以及 `return_token_budget` |
| `gpt-4o-search-preview` 或 `gpt-4o-mini-search-preview` | 迁移到 Responses `web_search`，或使用 `gpt-5-search-api` 如果你必须继续使用 Chat Completions       | 预览搜索模型已弃用，将于 2026-07-23 关闭                                     |
| Chat Completions 搜索集成                    | 使用 `gpt-5-search-api`，或迁移到 Responses `web_search` 以获得更多工具控制项和可选搜索 | Chat Completions 搜索模型在响应前始终进行搜索；Responses 搜索是一个工具               |

## 搜索上下文大小

`search_context_size` 控制模型在生成响应前可从网页搜索结果中获得的上下文量。使用 `low` 适用于简单的查询， `medium` 适用于均衡的默认设置，以及 `high` 当答案可能需要从搜索结果中获取更多细节时使用。此设置不设定确切的 token 数量，也不保证特定的来源或引用数量。



设置搜索上下文大小

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




## 运行更长时间的网页研究

`return_token_budget` 控制在网页搜索过程中，工具可以返回多少Responses API搜索结果内容，当与GPT-5+推理模型一起使用时。对于大多数请求，保持默认值。将其设置为 `unlimited` 仅用于需要检查大量页面且可能因标准返回令牌上限而停止的高强度研究或评估运行。

使用 `unlimited` 时应谨慎，因为它可能增加延迟和成本。对于长时间运行的多搜索任务，使用后台模式（`background: true`）以便请求可以异步继续运行，你可以在之后检索最终响应。

| 值       | 行为                                                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `default`   | 对网页搜索结果使用标准的返回令牌预算。这与省略 `return_token_budget`. |
| `unlimited` | 移除网页搜索运行的默认返回令牌预算。                                                            |

此参数仅适用于托管Responses API `web_search` 中支持 GPT-5+ 推理的网页搜索工具。它不会改变搜索上下文窗口，也不适用于非推理网页搜索、旧版搜索API路径、容器网页搜索、Chat Completions 搜索模型或 `web_search_preview`。仅 `default` 和 `unlimited` 是支持的值； `null`、数字和其他字符串会被拒绝。



运行更长时间的网页搜索

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




## 域过滤

网页搜索中的域过滤可让你将结果限制在特定的域集合内。通过 `filters` 参数，你可以配置最多 100 个 `allowed_domains` 或最多 100 个 `blocked_domains`。格式化域时，请省略 HTTP 或 HTTPS 前缀。例如，使用 `openai.com` 而不是 `https://openai.com/`。此方法还会在搜索中包含子域。请注意，域过滤仅在 Responses API 中可用，并与 `web_search` 工具配合使用。



## 来源

要查看在网页搜索期间检索到的所有 URL，请使用 `sources` 字段。与仅显示最相关引用的内联引用不同，sources 返回模型在形成响应时查阅的完整 URL 列表。
sources 的数量通常多于引用的数量。实时第三方信息源也会在此处显示，并标记为 `oai-sports`, `oai-weather`，或 `oai-finance`。sources 字段可用于 `web_search` 和 `web_search_preview` 工具。

列出信息源

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






## 图像搜索结果

网页搜索可以在常规文本结果之外返回图像结果。当你的应用需要当前或基于网络的视觉内容（例如产品照片、地标、地点、事件或视觉参考）时，可使用图像搜索。

要使用图像搜索，请设置 `search_content_types` 以包含 `image`。添加 `text` 当你还希望获得支持性文本结果以帮助模型总结、排序或解释检索到的图像时。

使用 `image_settings` 控制图像特定行为：

- `max_results`: 请求正数的图片结果数量。
- `caption`: 在可用时请求简短的图片描述。

要检查原始图像结果，请在请求中包含 `web_search_call.results` 并读取 `web_search_call.results[]` 从响应中的内容。图像结果与助手消息分开返回，因此 `web_search_call` 项应在你的应用需要URL或元数据时直接解析。

搜索图片

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


每个 `image_result` 包括：

- `image_url`：结果的规范图片 URL。
- `source_website_url`：找到图片的页面。
- `thumbnail_url`：可用的缩略图 URL。
- `caption`：可用的简短标题或描述。

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



## 用户位置

要根据地理位置优化搜索结果，你可以使用国家、城市、地区和/或时区来指定大致的用户位置。

- 该 `city` 和 `region` 字段是自由文本字符串，如 `Minneapolis` 和 `Minnesota` 分别。
- 该 `country` 字段是两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1)，如 `US`.
- 该 `timezone` 字段是 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 如 `America/Chicago`.

请注意，使用网页
  搜索的深度研究模型不支持用户位置。



自定义用户位置

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






## 实时互联网访问

控制网页搜索工具在Responses API中是获取实时内容还是仅使用缓存/索引结果。

- 设置 `external_web_access: false` 在 `web_search` 工具以运行于离线/仅缓存模式。
- 默认值为 `true` （实时访问），如果你不设置它。
- 预览变体（`web_search_preview`）忽略此参数，行为如同 `external_web_access` 为 `true`.



控制实时互联网访问

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




## 局限性

#### Chat Completions API

Chat Completions API 仅支持专门的搜索模型用于网页搜索。这些模型不支持 Responses API `web_search` 功能，如域名过滤器、完整来源列表、实时访问控制和返回令牌预算控制。

| 模型                        | 上下文窗口 | 限制                                                                                                                                   |
| ---------------------------- | -------------: | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `gpt-5-search-api`           |           200k | 使用 聊天补全接口 搜索模型路径                                                                                                  |
| `gpt-4o-search-preview`      |           128k | 使用 聊天补全接口 搜索模型路径； [已弃用，将于 2026-07-23 关闭](https://developers.openai.com/api/docs/deprecations#2026-04-22-legacy-gpt-model-snapshots) |
| `gpt-4o-mini-search-preview` |           128k | 使用 聊天补全接口 搜索模型路径； [已弃用，将于 2026-07-23 关闭](https://developers.openai.com/api/docs/deprecations#2026-04-22-legacy-gpt-model-snapshots) |

#### Responses API

使用托管 `web_search` 工具。Responses API 仍接受 `web_search_preview` 用于旧版集成，但新集成请使用 `web_search` 。

如需更大的模型上下文窗口，请使用 `gpt-5.5`。网页搜索 的上下文窗口仍为 128k。

| 模型          | 模型上下文窗口 | 限制                                                                                                                         |
| -------------- | -------------------: | ---------------------------------------------------------------------------------------------------------------------------------- |
| `gpt-4.1`      |                   1M | 搜索上下文限制为 128k                                                                                                  |
| `gpt-4.1-mini` |                   1M | 搜索上下文限制为 128k                                                                                                  |
| `o4-mini`      |                 200k | 搜索上下文限制为 128k； [已弃用，2026-10-23 关闭](https://developers.openai.com/api/docs/deprecations#2026-04-22-legacy-gpt-model-snapshots) |

对于 Responses API 的 网页搜索，搜索上下文窗口限制为 128k，即使模型上下文窗口更大也是如此。

- 网页搜索不支持 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5) 与 `minimal` 推理。
- [`gpt-5.4`](https://developers.openai.com/api/docs/models/gpt-5.4) 当推理力度设置为 `none` 时，可能会产生较低质量的结果。
- Responses API 网页搜索 使用底层模型的分层速率限制。
- `web_search_preview` 不支持 `filters` 或 `return_token_budget`，并忽略 `external_web_access`.
- 使用 `tool_choice: "auto"`，时，搜索为可选项。请使用 `tool_choice: "required"` 或特定的 网页搜索 工具选择以确保搜索执行。

## 使用说明

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