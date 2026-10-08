# 使用评估与处理指南

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

评测（通常称为 **evals**）会对模型输出进行测试，以确保其满足你指定的风格和内容标准。编写评测以了解你的 LLM 应用相对于你的预期表现，尤其是在升级或尝试新模型时，这是构建可靠应用的重要组成部分。

在本指南中，我们将重点介绍 **如何通过编程方式使用 [Evals API](https://developers.openai.com/api/reference/resources/evals)**。来配置评测。如果需要，你也可以 [在 OpenAI 仪表板中](https://platform.openai.com/evaluations).

OpenAI 正在弃用 Evals 平台。现有评测内容在过渡期内仍然
  可用。Evals 将于 2026 年 10 月 31 日起对
  现有用户转为只读，并计划于 2026 年 11 月 30 日关停平台。
  有关当前的 [时间线
  ，请参阅](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) 弃用
  页面。

如果你是第一次接触评测，或者希望在构建评测时使用更具迭代性的
  环境，可以尝试使用
  [Datasets](https://developers.openai.com/api/docs/guides/evaluation-getting-started) 。

概括而言，为你的 LLM 应用构建并运行评估可分为三个步骤。

1. 将要完成的任务描述为评估
1. 使用测试输入（提示词和输入数据）运行你的评估
1. 分析结果，然后迭代改进你的提示词

这个过程与行为驱动开发（BDD）有些类似，即先指定系统的预期行为，再进行实现和测试。下面我们来看看如何使用 [Evals API](https://developers.openai.com/api/reference/resources/evals).

## 为某个任务创建评估

创建评估的第一步是描述要让模型完成的任务。假设我们希望使用一个模型将 IT 支持工单的内容分类到以下三类之一： `Hardware`, `Software`，或者 `Other`.

要实现此用例，你可以使用 [Chat Completions API](https://developers.openai.com/api/reference/resources/chat) 或 [Responses API](https://developers.openai.com/api/reference/resources/responses)。以下两个示例都结合了 [开发者消息](https://developers.openai.com/api/docs/guides/text) 其中用户消息包含支持工单的文本。


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
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
        .model("gpt-6-astra")
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
    "gpt-6-astra",
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
  model: "gpt-6-astra",
  input: [
    {
      role: :developer,
      content: instructions
    },
    {
      role: :user,
      content: "My monitor won't turn on - help!"
    }
  ]
)
puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
        "model": "gpt-6-astra",
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





我们来设置一个评估来测试此行为 [通过 API](https://developers.openai.com/api/reference/resources/evals)。一个评估需要两个关键要素：

- `data_source_config`: 用于评测时所用测试数据的 schema。
- `testing_criteria`: 用于判定模型输出是否正确的 [评分器](https://developers.openai.com/api/docs/guides/graders) 。

创建一个评估

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

```java
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.evals.EvalCreateParams;
import com.openai.models.graders.gradermodels.StringCheckGrader;
import java.util.List;
import java.util.Map;

var eval =
    client
        .evals()
        .create(
            EvalCreateParams.builder()
                .name("IT Ticket Categorization")
                .dataSourceConfig(
                    EvalCreateParams.DataSourceConfig.Custom.builder()
                        .itemSchema(
                            EvalCreateParams.DataSourceConfig.Custom.ItemSchema.builder()
                                .additionalProperties(
                                    Map.of(
                                        "type", JsonValue.from("object"),
                                        "properties",
                                            JsonValue.from(
                                                Map.of(
                                                    "ticket_text",
                                                    Map.of("type", "string"),
                                                    "correct_label",
                                                    Map.of("type", "string"))),
                                        "required",
                                            JsonValue.from(
                                                List.of("ticket_text", "correct_label"))))
                                .build())
                        .includeSampleSchema(true)
                        .build())
                .addTestingCriterion(
                    StringCheckGrader.builder()
                        .name("Match output to human label")
                        .input("{{ sample.output_text }}")
                        .operation(StringCheckGrader.Operation.EQ)
                        .reference("{{ item.correct_label }}")
                        .build())
                .build());
System.out.println(eval);
```

```ruby
require "openai"

client = OpenAI::Client.new
evaluation = client.evals.create(
  name: "Support answer quality",
  data_source_config: {
    type: :custom,
    item_schema: {
      type: :object,
      properties: { input: { type: :string } },
      required: ["input"]
    }
  },
  testing_criteria: [
    {
      type: :string_check,
      name: "mentions_refund",
      input: "{{sample.output_text}}",
      operation: :contains,
      reference: "refund"
    }
  ]
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



运行此评估需要一个测试数据集，该数据集应代表你希望提示处理的输入数据类型（关于如何创建测试数据集将在本指南后续部分详述）。在我们的 `data_source_config` 参数中，我们指定每个 **项目** 数据集中的内容将符合一个 [JSON schema](https://json-schema.org/) 其中包含两个属性：

- `ticket_text`: 一段文本，内容为支持工单的内容
- `correct_label`: 模型应当匹配的“标准答案”输出，由人工提供

由于我们将引用 **sample** 作为我们的测试标准（模型根据我们提示生成的输出），因此还设置了 `include_sample_schema` 为 `true`.

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







### 说明：testing_criteria 参数



在我们的 `testing_criteria`，我们定义了在数据集中每个条目上模型输出如何满足我们的要求时的判定方式。在本例中，我们只希望模型根据输入工单输出三个类别字符串中的一个。它输出的字符串应与测试数据中人工标注的 `correct_label` 字段完全匹配。因此在这种情况下，我们需要使用一个 `string_check` 评分器来评估输出。

在测试配置中，我们将引入模板语法，由下面的 `{{` 和 `}}` 括号表示。这就是我们将动态内容插入到本次评估测试中的方式。

- `{{ item.correct_label }}` 指我们测试数据中的真实值。
- `{{ sample.output_text }}` 指我们将从模型生成以评估我们提示的内容——当我们真正启动评估运行时会演示如何操作。

```json
{
  "type": "string_check",
  "name": "Category string match",
  "input": "{{ sample.output_text }}",
  "operation": "eq",
  "reference": "{{ item.category }}"
}
```





创建评估后，系统会为其分配一个 UUID，后续在启动运行时你需要使用它来定位该评估。

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

现在我们已经创建了一个描述应用程序期望行为的评估，接下来让我们用一组测试数据来测试一个提示。

## 使用你的评估测试提示词

现在我们已经定义了应用在评估中的预期行为，接下来构建一个能够针对代表性测试数据样本稳定生成正确输出的提示。

### 上传测试数据

你可以通过多种方式为评估运行提供测试数据，但上传一个 [JSONL](https://jsonlines.org/) 该文件包含我们创建评估时指定的数据结构的数据。下面是一个符合我们所设置数据结构的示例 JSONL 文件：

```json
{ "item": { "ticket_text": "My monitor won't turn on!", "correct_label": "Hardware" } }
{ "item": { "ticket_text": "I'm in vim and I can't quit!", "correct_label": "Software" } }
{ "item": { "ticket_text": "Best restaurants in Cleveland?", "correct_label": "Other" } }
```

该数据集同时包含测试输入和真实标签，用于将模型输出与这些真实标签进行比较。

接下来，让我们把测试数据文件上传到 OpenAI 平台，方便后续引用。你可以 [在此处的控制台中上传文件](https://platform.openai.com/storage/files)，但也可以通过 [API 上传文件](https://developers.openai.com/api/reference/resources/files/methods/create) 。下面的示例假设你在运行命令的目录中已将上面的示例 JSON 数据保存到一个名为 `tickets.jsonl`:

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


上传文件时，请注意响应负载中唯一的 `id` 属性（如果你通过浏览器上传，也可以在界面中查看）——稍后我们将引用该值：

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

准备好测试数据后，让我们评估一个提示并查看它在测试标准下的表现。通过 API，我们可以通过 [创建评测运行](https://developers.openai.com/api/reference/resources/evals/methods/create).

请确保将 `YOUR_EVAL_ID` 和 `YOUR_FILE_ID` 替换为你在上述步骤中创建的评测配置和测试数据文件的唯一 ID。


  创建评测运行

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const run = await openai.evals.runs.create("YOUR_EVAL_ID", {
  name: "Categorization text run",
  data_source: {
    type: "responses",
    model: "gpt-6-astra",
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
        "model": "gpt-6-astra",
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

```java
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.evals.runs.*;

// Replace these illustrative IDs with your eval and uploaded dataset file.
var run =
    client
        .evals()
        .runs()
        .create(
            RunCreateParams.builder()
                .evalId("YOUR_EVAL_ID")
                .name("Categorization text run")
                .dataSource(
                    RunCreateParams.DataSource.CreateEvalResponsesRunDataSource.builder()
                        .type(
                            RunCreateParams.DataSource.CreateEvalResponsesRunDataSource.Type
                                .RESPONSES)
                        .model("gpt-6-astra")
                        .inputMessages(
                            RunCreateParams.DataSource.CreateEvalResponsesRunDataSource
                                .InputMessages.Template.builder()
                                .addTemplate(
                                    RunCreateParams.DataSource.CreateEvalResponsesRunDataSource
                                        .InputMessages.Template.InnerTemplate.ChatMessage
                                        .builder()
                                        .role("developer")
                                        .content(
                                            "You are an expert in categorizing IT support tickets. Given the support ticket below, categorize the request into one of 'Hardware', 'Software', or 'Other'. Respond with only one of those words.")
                                        .build())
                                .addTemplate(
                                    RunCreateParams.DataSource.CreateEvalResponsesRunDataSource
                                        .InputMessages.Template.InnerTemplate.ChatMessage
                                        .builder()
                                        .role("user")
                                        .content("{{ item.ticket_text }}")
                                        .build())
                                .build())
                        .source(
                            RunCreateParams.DataSource.CreateEvalResponsesRunDataSource.Source
                                .FileId.builder()
                                .id("YOUR_FILE_ID")
                                .build())
                        .build())
                .build());
System.out.println(run);
```

```ruby
require "openai"

client = OpenAI::Client.new
run = client.evals.runs.create(
  "YOUR_EVAL_ID",
  name: "Categorization text run",
  data_source: {
    type: :responses,
    source: {
      type: :file_id,
      id: "YOUR_FILE_ID"
    },
    input_messages: {
      type: :template,
      template: [
        {
          role: :developer,
          content: "Categorize the ticket as Hardware, Software, or Other."
        },
        {
          role: :user,
          content: "{{ item.ticket_text }}"
        }
      ]
    },
    model: "gpt-6-astra"
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
            "model": "gpt-6-astra",
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





创建运行后，我们使用 [Chat Completions](https://developers.openai.com/api/docs/guides/text?api-mode=chat) 消息数组或 [Responses](https://developers.openai.com/api/reference/resources/responses) 输入来配置 prompt。该提示用于为数据集中每一行测试数据生成模型响应。我们可以使用双花括号语法将动态变量 `item.ticket_text`，模板化进来，该变量取自当前的测试数据项。

如果评测运行创建成功，将收到如下所示的 API 响应：


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




你的评测运行现已加入队列，并将异步执行，处理数据集中的每一行，使用我们指定的 prompt 和模型生成响应以进行测试。

## 分析结果

若要在运行成功、失败或被取消时接收更新，请创建一个 webhook 端点并订阅 `eval.run.succeeded`, `eval.run.failed`，以及 `eval.run.canceled` 事件。详见 [webhook 指南](https://developers.openai.com/api/docs/guides/webhooks) 了解更多详情。

根据数据集的大小，评估运行可能需要一些时间才能完成。你可以在仪表板中查看当前状态，也可以 [通过 API 获取评估运行的当前状态](https://developers.openai.com/api/reference/resources/evals/methods/retrieve):

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

```java
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.evals.runs.RunRetrieveParams;

// Replace these illustrative IDs with your eval and run.
var run =
    client
        .evals()
        .runs()
        .retrieve(
            RunRetrieveParams.builder().evalId("YOUR_EVAL_ID").runId("YOUR_RUN_ID").build());
System.out.println(run);
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


你需要评估和评估运行的 UUID 才能获取其状态。获取后，你会看到类似如下的评估运行数据：


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




该 API 响应包含测试标准结果的详细信息、用于生成模型响应的 API 使用情况，以及一个 `report_url` 属性，该属性会带你跳转到仪表板中的一个页面，你可以在其中以可视化方式查看结果。

在我们的测试中，模型针对一个小型测试用例样本可靠地生成了我们期望的内容。实际上，你通常需要使用更多标准、不同提示和不同数据集来运行评估。但上述过程已为你提供了为 LLM 应用构建稳健评估所需的全部工具！

## Next steps

现在你已经了解如何通过 API 以及仪表盘来创建和运行 evals！下面是一些其他资源，在你持续改进模型结果时可能对你有所帮助。

[Cookbook：检测提示词回归



      Keep tabs on the performance of your prompts as you iterate on them.](https://developers.openai.com/cookbook/examples/evaluation/use-cases/regression)

[Cookbook：批量模型与提示词实验



      Compare the results of many different prompts and models at once.](https://developers.openai.com/cookbook/examples/evaluation/use-cases/bulk-experimentation)

[Cookbook：监控已存储的 completions



      Examine stored completions to test for prompt regressions.](https://developers.openai.com/cookbook/examples/evaluation/use-cases/completion-monitoring)

[微调



      Improve a model's ability to generate responses tailored to your use case.](https://developers.openai.com/api/docs/guides/model-optimization)
[模型蒸馏



      Learn how to distill large model results to smaller, cheaper, and faster
    models.](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model)