# 网页搜索

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

网页搜索允许模型从互联网获取最新信息，并提供带有来源引用的回答。要启用此功能，可在 Responses API 或在某些情况下在 Chat Completions 中使用 网页搜索 工具。

使用 OpenAI 模型可用的 网页搜索 主要有三种类型：

1. 非推理 网页搜索：非推理模型将用户的查询发送到 网页搜索 工具，该工具根据排名靠前的结果返回响应。该方法不进行内部规划，模型只是直接传递搜索工具的响应。这种方式速度快，非常适合快速查询。
2. 使用推理模型进行智能体搜索是一种由模型主动管理搜索过程的方法。模型可以在其思维链中执行网页搜索，分析结果，并决定是否继续搜索。这种灵活性使智能体搜索非常适合复杂工作流，但也意味着搜索所需时间比快速查询更长。例如，你可以对以下模型调整推理级别 `gpt-5.5` 来同时改变搜索的深度和延迟。
3. 深度研究是一种由推理模型驱动的、专门用于深入、长时间调查的 智能体 方法。模型会在其思维链中进行网页搜索，通常会查阅数百个来源。深度研究可能持续运行数分钟，最好与后台模式配合使用。可结合使用 `gpt-5.5` 并将推理设置为 `high` 或 `xhigh`.

## 选择集成方式

| 用例                                      | 推荐路径                              | 备注                                                                                                       |
| --------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 新增 网页搜索 集成                    | Responses API 配合 `web_search` 和 `gpt-5.5` | 支持托管 网页搜索 控制项，例如筛选器、来源、实时访问控制以及更长的研究运行 |
| 现有的 Chat Completions 搜索集成  | Chat Completions 配合 `gpt-5-search-api`      | 仅在需要保留 Chat Completions 集成时使用                                      |
| 多步研究或长时间运行的报告 | `gpt-5.5` 配合 `high` 或 `xhigh` 推理    | 对于可能耗时数分钟的报告，请使用后台模式                                               |

使用 [Responses API](https://developers.openai.com/api/reference/resources/responses)，你可以通过在 API 请求的数组中配置来启用网页搜索。 `tools` 与任何其他工具一样，模型可以根据输入提示的内容自行决定是否进行网页搜索。

对于新的Responses API集成，请使用 `{ "type": "web_search" }`。此前的 `web_search_preview` 工具仍然可用于旧版集成，但它不支持较新的控件，例如 `filters`, `external_web_access`，以及 `return_token_budget`.

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

- 一个 `web_search_call` 包含搜索调用 ID 的输出项，以及所执行的操作 `web_search_call.action`。该操作是以下之一：
  - `search`，表示一次网页搜索。通常（但不总是）包含搜索查询以及被搜索的域名列表。 `queries` 被搜索的内容。搜索操作会产生工具调用费用（参见 [定价](https://developers.openai.com/api/docs/pricing#built-in-tools)).
  - `open_page`，表示打开了一个页面。推理模型支持此操作。
  - `find_in_page`，表示在页面内进行搜索。推理模型支持此操作。
- 一个 `message` 包含以下内容的输出项：
  - 文本结果位于 `message.content[0].text`
  - 批注 `message.content[0].annotations` 中，用于引用来源的 URL

默认情况下，模型的响应将包含对 网页搜索 结果中所含 URL 的内联引用。除此之外， `url_citation` annotation 对象将包含所引用来源的 URL、标题和位置。

当向最终用户展示网页结果或网页结果中包含的信息时，
  内联引用必须在你的用户界面中清晰可见且可点击。
  用户界面。

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





## 从旧版 网页搜索 迁移

| 如果你使用                                              | 推荐路径                                                                                        | 备注                                                                                                    |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `web_search_preview` 在 Responses 中                       | 迁移到 `web_search`                                                                                 | `web_search` 支持较新的控制项，例如 `filters`, `external_web_access`，以及 `return_token_budget` |
| `gpt-4o-search-preview` 或 `gpt-4o-mini-search-preview` | 迁移到 Responses `web_search`，或使用 `gpt-5-search-api` 如果你必须继续使用 Chat Completions       | 预览版搜索模型已弃用并于 2026-07-23 下线                                     |
| Chat Completions 搜索集成                    | 使用 `gpt-5-search-api`，或迁移到 Responses `web_search` 以获得更多工具控制和可选的搜索功能 | Chat Completions 搜索模型总是在响应前执行搜索；Responses 中的搜索是一个工具               |

## 搜索上下文大小

`search_context_size` 控制在模型生成响应之前，网页搜索结果中有多少上下文可供模型使用。使用 `low` 进行简单查询， `medium` 作为平衡的默认值，以及 `high` 在答案可能需要更多搜索结果细节时使用。此设置不会设定确切的 token 数量，也无法保证具体的来源或引用数量。



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




## 运行更长时间的网络研究

`return_token_budget` 控制工具在 GPT-5+ 推理模型运行的 Responses API 搜索过程中可以返回多少 网页搜索 结果内容。对于大多数请求，请保留默认值。将其设置为 `unlimited` 仅适用于需要查看多个页面且可能在标准返回 token 上限处停止的高强度研究或评估运行。

请谨慎使用 `unlimited` ，因为它可能会增加延迟和成本。对于长时间运行的多搜索任务，请使用后台模式（`background: true`），以便请求可以异步持续运行，并在稍后获取最终响应。

| 值       | 行为                                                                                                                     |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `default`   | 对 网页搜索 结果使用标准的返回 token 预算。这与省略时的行为相同 `return_token_budget`. |
| `unlimited` | 移除 网页搜索 运行的默认返回 token 预算。                                                            |

此参数仅适用于托管的Responses API `web_search` 工具中的 GPT-5+ 推理 网页搜索。它不会更改搜索上下文窗口，也不适用于非推理 网页搜索、旧版 Search API 路径、容器 网页搜索、Chat Completions 搜索模型或 `web_search_preview`. Only `default` 和 `unlimited` 是受支持的值； `null`，数字和其他字符串将被拒绝。



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




## Domain filtering

在 网页搜索 中进行域名过滤可将结果限制在特定的域名集合内。通过 `filters` 参数，你可以配置最多 100 个 `allowed_domains` ，或者最多 100 个 `blocked_domains`。在格式化域名时，请省略 HTTP 或 HTTPS 前缀。例如，使用 `openai.com` 而不是 `https://openai.com/`。这种方式还会将子域名纳入搜索范围。请注意，域名过滤仅在使用 Responses API 的 `web_search` 工具时可用。



## 来源

若要查看 网页搜索 期间检索到的所有 URL，请使用 `sources` 字段。与内联引用不同，内联引用仅展示最相关的参考资料，而 sources 会返回模型在生成回答时所参考的完整 URL 列表。
来源的数量通常大于引用的数量。实时第三方信息源也会在此处显示，并标记为 `oai-sports`, `oai-weather`，或 `oai-finance`。sources 字段在以下两种情况下都可用： `web_search` 和 `web_search_preview` 工具。

来源列表

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

网页搜索除了返回常规文本结果外，还可以返回图片结果。当你的应用需要基于网络的最新视觉内容时，可使用图片搜索，例如商品照片、地标、地点、事件或视觉参考资料。

要使用图片搜索,请设置 `search_content_types` 以包含 `image`,再添加 `text` ,即可同时获取帮助模型总结、排序或解释检索到的图片的支持性文本结果。

请谨慎使用 `image_settings` 参数来控制与图片相关的行为:

- `max_results`: 请求返回正数的图片结果。
- `caption`: 在可用时请求简短的图片描述。

若要检查原始图片结果，请在请求中传入 `web_search_call.results` ，并从响应中读取 `web_search_call.results[]` 。图片结果与助手消息分开返回，因此当你的应用需要这些 URL 或元数据时，请直接解析 `web_search_call` 项。

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


每个 `image_result` 包含：

- `image_url`：结果的规范图片 URL。
- `source_website_url`：找到该图片的页面。
- `thumbnail_url`：可用时的缩略图 URL。
- `caption`：可用时的简短标题或描述。

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

若要根据地理位置优化搜索结果，你可以使用国家、城市、地区和/或时区来指定一个近似用户位置。

- 该 `city` 以及 `region` 字段为自由文本字符串，例如 `Minneapolis` 以及 `Minnesota` 。
- 该 `country` 字段是一个两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1)，例如 `US`.
- 该 `timezone` 字段是一个 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如 `America/Chicago`.

请注意，使用网页搜索的深度研究模型不支持用户位置。
  search.



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






## 实时联网访问

控制 网页搜索 工具是抓取实时内容，还是仅使用缓存或索引结果，在 Responses API 中。

- Set `external_web_access: false` on the `web_search` tool to run in offline/cache‑only mode.
- Default is `true` (live access) if you do not set it.
- Preview variants (`web_search_preview`) ignore this parameter and behave as if `external_web_access` is `true`.



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




## 限制

#### Chat Completions API

Chat Completions API 仅支持用于网页搜索 的专用搜索模型。这些模型不支持 Responses API `web_search` 特性，例如域名过滤器、完整的来源列表、实时访问控制以及返回令牌预算控制。

| 模型                        | 上下文窗口 | 限制                                                                                                                                   |
| ---------------------------- | -------------: | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `gpt-5-search-api`           |           200k | 使用 Chat Completions 搜索模型路径                                                                                                  |
| `gpt-4o-search-preview`      |           128k | 使用 Chat Completions 搜索模型路径； [已弃用，将于 2026-07-23 停止服务](https://developers.openai.com/api/docs/deprecations#2026-04-22-legacy-gpt-model-snapshots) |
| `gpt-4o-mini-search-preview` |           128k | 使用 Chat Completions 搜索模型路径； [已弃用，将于 2026-07-23 停止服务](https://developers.openai.com/api/docs/deprecations#2026-04-22-legacy-gpt-model-snapshots) |

#### Responses API

使用托管 `web_search` 工具。Responses API 仍然接受 `web_search_preview` 用于旧版集成，但请使用 `web_search` 用于新的集成。

如果需要更大的模型上下文窗口，请使用 `gpt-5.5`。网页搜索 的上下文窗口仍为 128k。

| 模型          | 模型上下文窗口 | 限制                                                                                                                         |
| -------------- | -------------------: | ---------------------------------------------------------------------------------------------------------------------------------- |
| `gpt-4.1`      |                   1M | 搜索上下文限制为 128k                                                                                                  |
| `gpt-4.1-mini` |                   1M | 搜索上下文限制为 128k                                                                                                  |
| `o4-mini`      |                 200k | 搜索上下文限制为 128k； [已弃用，2026-10-23 关停](https://developers.openai.com/api/docs/deprecations#2026-04-22-legacy-gpt-model-snapshots) |

对于 Responses API 网页搜索，搜索上下文窗口上限为 128k，即使模型上下文窗口更大也是如此。

- 网页搜索不支持 [`gpt-5`](https://developers.openai.com/api/docs/models/gpt-5) 配合 `minimal` 推理。
- [`gpt-5.4`](https://developers.openai.com/api/docs/models/gpt-5.4) 在推理力度设置为 `none` 时，可能会产生质量较低的结果。
- Responses API 网页搜索 使用底层模型的分级速率限制。
- `web_search_preview` 不支持 `filters` 或 `return_token_budget`，并忽略 `external_web_access`.
- 使用 `tool_choice: "auto"`，时，搜索为可选项。当必须执行搜索时，请使用 `tool_choice: "required"` 或特定的 网页搜索 工具选择。

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