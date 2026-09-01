# 使用评测

> 查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取 Markdown 版本的文档页面。

评估（通常称为 **evals**）用于测试模型输出，确保其符合你指定的风格和内容标准。编写评估以了解你的 LLM 应用相对于你的预期表现如何，尤其是在升级或尝试新模型时，这是构建可靠应用的重要组成部分。

在本指南中，我们将重点介绍 **如何使用 [Evals API](https://developers.openai.com/api/reference/resources/evals)**。以编程方式配置评估。如果你愿意，也可以 [在 OpenAI 仪表板中](https://platform.openai.com/evaluations).

OpenAI 正在弃用 Evals 平台。现有评估内容在过渡期内仍可
  使用。评估将于 2026 年 10 月 31 日对现有用户变为只读，该平台计划于
  2026 年 11 月 30 日下线。有关当前
  时间表的详细信息，请参阅 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) 。
  时间表。

如果你是评估新手，或者希望在构建评估时获得更具迭代性的
  实验环境，可以考虑尝试
  [数据集](https://developers.openai.com/api/docs/guides/evaluation-getting-started) 。

总体而言，为你的 LLM 应用构建并运行评估（eval）需要三个步骤。

1. 描述要作为 eval 完成的任务
1. 使用测试输入（提示和输入数据）运行你的 eval
1. 分析结果，然后迭代改进你的提示

这个过程与行为驱动开发（BDD）有些类似，你需要在实现和测试系统之前，先指定系统的预期行为。让我们看看如何使用 智能体开发工具包 完成上述每个步骤 [Evals API](https://developers.openai.com/api/reference/resources/evals).

## 为某个任务创建评估

创建评估的第一步是描述需要由模型完成的任务。假设我们希望使用一个模型，将 IT 支持工单的内容归入以下三类之一： `Hardware`, `Software`，或者 `Other`.

要实现此用例，你可以使用 [Chat Completions API](https://developers.openai.com/api/reference/resources/chat) 或 [Responses API](https://developers.openai.com/api/reference/resources/responses)。下面的两个示例都结合了一个 [开发者消息](https://developers.openai.com/api/docs/guides/text) 其中用户消息包含支持工单的文本。


  对 IT 支持工单进行分类

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const instructions = `
You are an expert in categorizing IT support tickets. Given the support
ticket below, categorize the request into one of "Hardware", "Software",
or "Other". Respond with only one of those words.
`;

const ticket = "My monitor won't turn on - help!";

const response = await client.responses.create({
  model: "gpt-5.6",
  input: [
    { role: "developer", content: instructions },
    { role: "user", content: ticket },
  ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

instructions = """
You are an expert in categorizing IT support tickets. Given the support
ticket below, categorize the request into one of "Hardware", "Software",
or "Other". Respond with only one of those words.
"""

ticket = "My monitor won't turn on - help!"

response = client.responses.create(
    model="gpt-5.6",
    input=[
        {"role": "developer", "content": instructions},
        {"role": "user", "content": ticket},
    ],
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
	instructions := "You are an expert in categorizing IT support tickets. Given the support ticket below, categorize the request into one of \"Hardware\", \"Software\", or \"Other\". Respond with only one of those words."
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMessage(instructions, responses.EasyInputMessageRoleDeveloper),
			responses.ResponseInputItemParamOfMessage("My monitor won't turn on - help!", responses.EasyInputMessageRoleUser),
		}},
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
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.List;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.DEVELOPER)
                        .content(
                            "You are an expert in categorizing IT support tickets. Categorize each request as Hardware, Software, or Other. Respond with only one of those words.")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content("My monitor won't turn on - help!")
                        .build())))
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

ResponseResult response = await client.CreateResponseAsync(
    "gpt-5.6",
    [
        ResponseItem.CreateDeveloperMessageItem(
            "Categorize the IT support ticket as Hardware, Software, or Other. Respond with only one of those words."
        ),
        ResponseItem.CreateUserMessageItem("My monitor will not turn on. Help!"),
    ]
);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
instructions = <<~INSTRUCTIONS
  You are an expert in categorizing IT support tickets. Given the support
  ticket below, categorize the request as Hardware, Software, or Other.
  Respond with only one of those words.
INSTRUCTIONS
response = client.responses.create(
  model: "gpt-5.6",
  input: [
    {role: :developer, content: instructions},
    {role: :user, content: "My monitor won't turn on - help!"}
  ]
)
puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gpt-5.6",
        "input": [
            {
                "role": "developer",
                "content": "Categorize the following support ticket into one of Hardware, Software, or Other."
            },
            {
                "role": "user",
                "content": "My monitor wont turn on - help!"
            }
        ]
    }'
```





我们设置一个评测来测试此行为 [通过 API](https://developers.openai.com/api/reference/resources/evals)。一个评测需要两个关键要素：

- `data_source_config`: 配合评估使用的测试数据对应的数据格式。
- `testing_criteria`: 评分所用的 [评分器](https://developers.openai.com/api/docs/guides/graders) ，用于判断模型输出是否正确。

创建评估

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const evalObj = await openai.evals.create({
  name: "IT Ticket Categorization",
  data_source_config: {
    type: "custom",
    item_schema: {
      type: "object",
      properties: {
        ticket_text: { type: "string" },
        correct_label: { type: "string" },
      },
      required: ["ticket_text", "correct_label"],
    },
    include_sample_schema: true,
  },
  testing_criteria: [
    {
      type: "string_check",
      name: "Match output to human label",
      input: "{{ sample.output_text }}",
      operation: "eq",
      reference: "{{ item.correct_label }}",
    },
  ],
});

console.log(evalObj);
```

```python
from openai import OpenAI

client = OpenAI()

eval_obj = client.evals.create(
    name="IT Ticket Categorization",
    data_source_config={
        "type": "custom",
        "item_schema": {
            "type": "object",
            "properties": {
                "ticket_text": {"type": "string"},
                "correct_label": {"type": "string"},
            },
            "required": ["ticket_text", "correct_label"],
        },
        "include_sample_schema": True,
    },
    testing_criteria=[
        {
            "type": "string_check",
            "name": "Match output to human label",
            "input": "{{ sample.output_text }}",
            "operation": "eq",
            "reference": "{{ item.correct_label }}",
        }
    ],
)

print(eval_obj)
```

```ruby
require "openai"

client = OpenAI::Client.new
evaluation = client.evals.create(
  name: "Support answer quality",
  data_source_config: {type: :custom, item_schema: {type: :object, properties: {input: {type: :string}}, required: ["input"]}},
  testing_criteria: [{type: :string_check, name: "mentions_refund", input: "{{sample.output_text}}", operation: :contains, reference: "refund"}]
)
puts(evaluation.id)
```

```bash
curl https://api.openai.com/v1/evals \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "IT Ticket Categorization",
        "data_source_config": {
            "type": "custom",
            "item_schema": {
                "type": "object",
                "properties": {
                    "ticket_text": { "type": "string" },
                    "correct_label": { "type": "string" }
                },
                "required": ["ticket_text", "correct_label"]
            },
            "include_sample_schema": true
        },
        "testing_criteria": [
            {
                "type": "string_check",
                "name": "Match output to human label",
                "input": "{{ sample.output_text }}",
                "operation": "eq",
                "reference": "{{ item.correct_label }}"
            }
        ]
    }'
```




### 说明：data_source_config 参数



运行此评估需要一个测试数据集，该数据集应代表你希望你的提示所处理的数据类型（关于如何创建测试数据集的更多内容将在本指南后面介绍）。在我们的 `data_source_config` 参数中，我们指定数据集中每个 **item** 都将符合一个 [JSON schema](https://json-schema.org/) ，该模式包含两个属性：

- `ticket_text`: 包含支持工单内容的文本字符串
- `correct_label`: 由人工提供的、模型应当匹配的“标准答案”输出

由于我们将在测试标准中引用一个 **示例** （即给定我们的提示时由模型生成的输出），我们还将 `include_sample_schema` 设置为 `true`.

```json
{
  "type": "custom",
  "item_schema": {
    "type": "object",
    "properties": {
      "ticket": { "type": "string" },
      "category": { "type": "string" }
    },
    "required": ["ticket", "category"]
  },
  "include_sample_schema": true
}
```







### Explanation: testing_criteria parameter



在我们的 `testing_criteria`，我们定义了如何判定模型输出是否满足数据集中每个条目的要求。在这个示例中，我们希望模型根据输入的工单输出三个类别字符串中的一个。其输出的字符串应与测试数据中人工标注的 `correct_label` 字段完全一致。因此在这种情况下，我们需要使用一个 `string_check` 评分器来评估输出。

在测试配置中，我们将使用由 `{{` 和 `}}` 方括号表示的模板语法。这是我们在此评测中向测试插入动态内容的方式。

- `{{ item.correct_label }}` 指我们测试数据中的真实值。
- `{{ sample.output_text }}` 指我们将从模型生成用于评估提示的内容——我们将在实际启动评估运行时演示如何做到这一点。

```json
{
  "type": "string_check",
  "name": "Category string match",
  "input": "{{ sample.output_text }}",
  "operation": "eq",
  "reference": "{{ item.category }}"
}
```





创建评估后，它将被分配一个 UUID，你将在稍后启动运行（run）时需要使用该 UUID 来引用它。

```json
{
  "object": "eval",
  "id": "eval_67e321d23b54819096e6bfe140161184",
  "data_source_config": {
    "type": "custom",
    "schema": { ... omitted for brevity... }
  },
  "testing_criteria": [
    {
      "name": "Match output to human label",
      "id": "Match output to human label-c4fdf789-2fa5-407f-8a41-a6f4f9afd482",
      "type": "string_check",
      "input": "{{ sample.output_text }}",
      "reference": "{{ item.correct_label }}",
      "operation": "eq"
    }
  ],
  "name": "IT Ticket Categorization",
  "created_at": 1742938578,
  "metadata": {}
}
```

既然我们已经创建了一个描述应用程序期望行为的评估，下面让我们使用一组测试数据来测试一个提示。

## Test a prompt with your eval

既然我们已经定义了应用在评估中的期望行为，接下来就构造一个提示词，使其能够针对具有代表性的测试数据样本稳定地生成正确的输出。

### 上传测试数据

有几种方法可以为评估运行提供测试数据，但上传一个 [JSONL](https://jsonlines.org/) 文件可能会很方便，该文件包含的数据符合我们创建评估时指定的架构。下面是一个符合我们设置的架构的示例 JSONL 文件：

```json
{ "item": { "ticket_text": "My monitor won't turn on!", "correct_label": "Hardware" } }
{ "item": { "ticket_text": "I'm in vim and I can't quit!", "correct_label": "Software" } }
{ "item": { "ticket_text": "Best restaurants in Cleveland?", "correct_label": "Other" } }
```

该数据集同时包含测试输入和用于与模型输出进行比较的真实标签。

接下来，让我们将测试数据文件上传到 OpenAI 平台，以便稍后引用它。你可以上传文件 [在控制台中此处](https://platform.openai.com/storage/files)，但也可以 [通过 API 上传文件](https://developers.openai.com/api/reference/resources/files/methods/create) 。下面的示例假设你在一个目录中运行该命令，并将上面的示例 JSON 数据保存到一个名为 `tickets.jsonl`:

上传测试数据文件

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const file = await openai.files.create({
  file: fs.createReadStream("fixtures/tickets.jsonl"),
  purpose: "evals",
});

console.log(file);
```

```python
from openai import OpenAI

client = OpenAI()

file = client.files.create(file=open("tickets.jsonl", "rb"), purpose="evals")

print(file)
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	file, err := os.Open("tickets.jsonl")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	uploaded, err := client.Files.New(context.Background(), openai.FileNewParams{
		File:    file,
		Purpose: openai.FilePurposeEvals,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(uploaded.ID)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.files.FileCreateParams;
import com.openai.models.files.FilePurpose;
import java.nio.file.Path;

var file =
    client
        .files()
        .create(
            FileCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_FILE_PATH")))
                .purpose(FilePurpose.EVALS)
                .build());

System.out.println(file.id());
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
file = Pathname("tickets.jsonl")
uploaded = client.files.create(file: file, purpose: :evals)
puts(uploaded.id)
```

```bash
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="evals" \
  -F file="@tickets.jsonl"
```


上传文件时，请记下响应负载中唯一的 `id` 属性（如果通过浏览器上传，在界面中也可以看到该属性）——稍后我们将需要引用该值：

```json
{
  "object": "file",
  "id": "file-CwHg45Fo7YXwkWRPUkLNHW",
  "purpose": "evals",
  "filename": "tickets.jsonl",
  "bytes": 208,
  "created_at": 1742834798,
  "expires_at": null,
  "status": "processed",
  "status_details": null
}
```

### 创建评估运行

准备好测试数据后，让我们评估一个提示词，看看它针对测试标准的表现。通过 API，我们可以通过以下方式 [创建评估运行](https://developers.openai.com/api/reference/resources/evals/methods/create).

请确保将 `YOUR_EVAL_ID` 和 `YOUR_FILE_ID` 替换为你在上述步骤中创建的评估配置和测试数据文件的唯一 ID。


  创建评估运行

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const run = await openai.evals.runs.create("YOUR_EVAL_ID", {
  name: "Categorization text run",
  data_source: {
    type: "responses",
    model: "gpt-5.6",
    input_messages: {
      type: "template",
      template: [
        {
          role: "developer",
          content:
            "You are an expert in categorizing IT support tickets. Given the support ticket below, categorize the request into one of 'Hardware', 'Software', or 'Other'. Respond with only one of those words.",
        },
        { role: "user", content: "{{ item.ticket_text }}" },
      ],
    },
    source: { type: "file_id", id: "YOUR_FILE_ID" },
  },
});

console.log(run);
```

```python
from openai import OpenAI

client = OpenAI()

run = client.evals.runs.create(
    "YOUR_EVAL_ID",
    name="Categorization text run",
    data_source={
        "type": "responses",
        "model": "gpt-5.6",
        "input_messages": {
            "type": "template",
            "template": [
                {
                    "role": "developer",
                    "content": "You are an expert in categorizing IT support tickets. Given the support ticket below, categorize the request into one of 'Hardware', 'Software', or 'Other'. Respond with only one of those words.",
                },
                {"role": "user", "content": "{{ item.ticket_text }}"},
            ],
        },
        "source": {"type": "file_id", "id": "YOUR_FILE_ID"},
    },
)

print(run)
```

```ruby
require "openai"

client = OpenAI::Client.new
run = client.evals.runs.create(
  "YOUR_EVAL_ID",
  name: "Categorization text run",
  data_source: {
    type: :responses,
    source: {type: :file_id, id: "YOUR_FILE_ID"},
    input_messages: {
      type: :template,
      template: [
        {
          role: :developer,
          content: "Categorize the ticket as Hardware, Software, or Other."
        },
        {role: :user, content: "{{ item.ticket_text }}"}
      ]
    },
    model: "gpt-5.6"
  }
)
puts(run.id)
```

```bash
curl https://api.openai.com/v1/evals/YOUR_EVAL_ID/runs \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Categorization text run",
        "data_source": {
            "type": "responses",
            "model": "gpt-5.6",
            "input_messages": {
                "type": "template",
                "template": [
                    {"role": "developer", "content": "You are an expert in categorizing IT support tickets. Given the support ticket below, categorize the request into one of Hardware, Software, or Other. Respond with only one of those words."},
                    {"role": "user", "content": "{{ item.ticket_text }}"}
                ]
            },
            "source": { "type": "file_id", "id": "YOUR_FILE_ID" }
        }
    }'
```





创建运行时，我们会使用以下两种方式之一来设置提示词： [Chat Completions](https://developers.openai.com/api/docs/guides/text?api-mode=chat) 的 messages 数组，或者 [Responses](https://developers.openai.com/api/reference/resources/responses) 的 input。该提示词用于为数据集中的每一行测试数据生成模型响应。我们可以使用双花括号语法来插入动态变量 `item.ticket_text`，该变量取自当前的测试数据条目。

如果评估运行创建成功，你将收到如下所示的 API 响应：


```json
{
    "object": "eval.run",
    "id": "evalrun_67e44c73eb6481909f79a457749222c7",
    "eval_id": "eval_67e44c5becec81909704be0318146157",
    "report_url": "https://platform.openai.com/evaluation/evals/abc123",
    "status": "queued",
    "model": "gpt-4.1",
    "name": "Categorization text run",
    "created_at": 1743015028,
    "result_counts": { ... },
    "per_model_usage": null,
    "per_testing_criteria_results": null,
    "data_source": {
        "type": "responses",
        "source": {
            "type": "file_id",
            "id": "file-J7MoX9ToHXp2TutMEeYnwj"
        },
        "input_messages": {
            "type": "template",
            "template": [
                {
                    "type": "message",
                    "role": "developer",
                    "content": {
                        "type": "input_text",
                        "text": "You are an expert in...."
                    }
                },
                {
                    "type": "message",
                    "role": "user",
                    "content": {
                        "type": "input_text",
                        "text": "{{item.ticket_text}}"
                    }
                }
            ]
        },
        "model": "gpt-4.1",
        "sampling_params": null
    },
    "error": null,
    "metadata": {}
}
```




你的评估运行现已排队，它将以异步方式执行，遍历数据集中的每一行，使用我们指定的提示词和模型生成响应用于测试。

## 分析结果

要在运行成功、失败或取消时接收更新，请创建一个 webhook 端点并订阅 `eval.run.succeeded`, `eval.run.failed`，和 `eval.run.canceled` 事件。详情请参阅 [webhook 指南](https://developers.openai.com/api/docs/guides/webhooks) 。

根据数据集大小，评估运行可能需要一些时间才能完成。你可以在仪表板中查看当前状态，也可以 [通过 API 获取评估运行的当前状态](https://developers.openai.com/api/reference/resources/evals/methods/retrieve):

获取评估运行状态

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const run = await openai.evals.runs.retrieve("YOUR_RUN_ID", {
  eval_id: "YOUR_EVAL_ID",
});
console.log(run);
```

```python
from openai import OpenAI
client = OpenAI()

run = client.evals.runs.retrieve("YOUR_RUN_ID", eval_id="YOUR_EVAL_ID")
print(run)
```

```ruby
require "openai"

client = OpenAI::Client.new
run = client.evals.runs.retrieve("YOUR_RUN_ID", eval_id: "YOUR_EVAL_ID")
puts(run.id)
```

```bash
curl https://api.openai.com/v1/evals/YOUR_EVAL_ID/runs/YOUR_RUN_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json"
```


你需要评估和评估运行二者的 UUID，才能获取其状态。获取后，你会看到如下所示的评估运行数据：


```json
{
    "object": "eval.run",
    "id": "evalrun_67e44c73eb6481909f79a457749222c7",
    "eval_id": "eval_67e44c5becec81909704be0318146157",
    "report_url": "https://platform.openai.com/evaluation/evals/xxx",
    "status": "completed",
    "model": "gpt-4.1",
    "name": "Categorization text run",
    "created_at": 1743015028,
    "result_counts": {
        "total": 3,
        "errored": 0,
        "failed": 0,
        "passed": 3
    },
    "per_model_usage": [
        {
            "model_name": "gpt-4o-2024-08-06",
            "invocation_count": 3,
            "prompt_tokens": 166,
            "completion_tokens": 6,
            "total_tokens": 172,
            "cached_tokens": 0
        }
    ],
    "per_testing_criteria_results": [
        {
            "testing_criteria": "Match output to human label-40d67441-5000-4754-ab8c-181c125803ce",
            "passed": 3,
            "failed": 0
        }
    ],
    "data_source": {
        "type": "responses",
        "source": {
            "type": "file_id",
            "id": "file-J7MoX9ToHXp2TutMEeYnwj"
        },
        "input_messages": {
            "type": "template",
            "template": [
                {
                    "type": "message",
                    "role": "developer",
                    "content": {
                        "type": "input_text",
                        "text": "You are an expert in categorizing IT support tickets. Given the support ticket below, categorize the request into one of Hardware, Software, or Other. Respond with only one of those words."
                    }
                },
                {
                    "type": "message",
                    "role": "user",
                    "content": {
                        "type": "input_text",
                        "text": "{{item.ticket_text}}"
                    }
                }
            ]
        },
        "model": "gpt-4.1",
        "sampling_params": null
    },
    "error": null,
    "metadata": {}
}
```




API 响应包含测试标准结果的详细信息、用于生成模型响应的 API 用量，以及一个 `report_url` 属性，该属性会带你进入仪表板中的一个页面，你可以在其中以可视化方式浏览结果。

在这个简单测试中，模型针对一小部分测试用例可靠地生成了我们想要的内容。实际上，你通常需要使用更多标准、不同提示词和不同数据集来运行评估。但上述过程为你构建稳健的 LLM 应用评估提供了所需的全部工具！

## 下一步

现在你已经了解了如何通过 API 以及使用仪表板来创建和运行 evals！以下是一些其他资源，在你持续改进模型效果的过程中可能会对你有所帮助。

[Cookbook：检测提示词回归



      Keep tabs on the performance of your prompts as you iterate on them.](https://developers.openai.com/cookbook/examples/evaluation/use-cases/regression)

[Cookbook：批量模型与提示词实验



      Compare the results of many different prompts and models at once.](https://developers.openai.com/cookbook/examples/evaluation/use-cases/bulk-experimentation)

[Cookbook：监控已存储的补全



      Examine stored completions to test for prompt regressions.](https://developers.openai.com/cookbook/examples/evaluation/use-cases/completion-monitoring)

[微调



      Improve a model's ability to generate responses tailored to your use case.](https://developers.openai.com/api/docs/guides/model-optimization)
[模型蒸馏



      Learn how to distill large model results to smaller, cheaper, and faster
    models.](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model)