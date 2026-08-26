# 使用评估

> 如需查看完整的文档索引，请参见 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

评估（通常称为 **evals**）用于测试模型输出，以确保它们符合你指定的风格和内容标准。编写 evals 来了解你的 LLM 应用是否符合你的期望，尤其是在升级或尝试新模型时，是构建可靠应用的重要组成部分。

在本指南中，我们将重点介绍如何 **使用 [Evals API](https://developers.openai.com/api/reference/resources/evals)**。以编程方式配置 evals。 [如果你愿意，也可以在 OpenAI 控制台中配置 evals](https://platform.openai.com/evaluations).

OpenAI 正在弃用 Evals 平台。现有 evals 内容在过渡期内仍然
  可用。对于
  现有用户，Evals 将于 2026 年 10 月 31 日变为只读状态，该平台计划于
  2026 年 11 月 30 日关闭。请参阅 [deprecations
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) 了解当前
  的时间表。

如果你刚开始接触评估，或者希望有更具迭代性的环境来
  在构建 eval 时进行实验，可以考虑尝试
  [Datasets](https://developers.openai.com/api/docs/guides/evaluation-getting-started) 。

总的来说，为你的 LLM 应用构建和运行评估有三个步骤。

1. 将待完成的任务描述为一次评估
1. 使用测试输入（提示词和输入数据）运行你的评估
1. 分析结果，然后迭代并改进你的提示词

这个过程与行为驱动开发（BDD）有些类似，在实施和测试系统之前，你先要规定系统应如何运作。下面我们看看如何使用 [Evals API](https://developers.openai.com/api/reference/resources/evals).

## 为任务创建评估

创建评估从描述模型需要执行的任务开始。假设我们想用一个模型将IT支持工单的内容分为三类： `Hardware`, `Software`，或 `Other`.

要实现这个用例，你可以使用 [Chat Completions API](https://developers.openai.com/api/reference/resources/chat) 或 [Responses API](https://developers.openai.com/api/reference/resources/responses)。下面的两个示例都将 [开发者消息](https://developers.openai.com/api/docs/guides/text) 与包含支持工单文本的用户消息结合使用。


  对IT支持工单进行分类

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





让我们设置一个评估来测试这一行为 [通过 API](https://developers.openai.com/api/reference/resources/evals)。评估需要两个关键要素：

- `data_source_config`：用于随评测一起使用的测试数据的架构。
- `testing_criteria`： [评分器](https://developers.openai.com/api/docs/guides/graders) ，用于确定模型输出是否正确。

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


说明：data_source_config 参数

运行此评估需要一组测试数据，代表你期望提示词处理的数据类型（本指南稍后将详细介绍如何创建测试数据集）。在我们的 `data_source_config` 参数中，我们指定数据集中的每个 **项目** 将符合 [JSON schema](https://json-schema.org/) ，包含两个属性：

- `ticket_text`：一段包含支持工单内容的文本字符串
- `correct_label`：由人类提供的模型应匹配的“真实答案”输出

由于我们将在测试标准中引用一个 **样本** （即模型根据提示生成的输出），我们还需要设置 `include_sample_schema` 为 `true`.

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

解释：testing_criteria 参数

在我们的 `testing_criteria`，中，我们定义如何判断模型输出是否满足数据集中每个项目的要求。在这种情况下，我们只希望模型根据输入工单输出三个类别字符串之一。模型输出的字符串应与人标注的 `correct_label` 字段完全匹配。因此，在这种情况下，我们需要使用 `string_check` 评分器来评估输出。

在测试配置中，我们将引入模板语法，用以下 `{{` 和 `}}` 括号表示。通过这种方式，我们将在该评估的测试中插入动态内容。

- `{{ item.correct_label }}` 指的是我们测试数据中的真实值。
- `{{ sample.output_text }}` 指的是我们将从模型中生成用来评估我们提示词的内容——我们会在实际启动评估运行时展示如何操作。

```json
{
  "type": "string_check",
  "name": "Category string match",
  "input": "{{ sample.output_text }}",
  "operation": "eq",
  "reference": "{{ item.category }}"
}
```

创建评测后，系统会为其分配一个 UUID，后续启动运行时你需要使用该 UUID 来引用它。

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

既然我们已经创建了描述应用预期行为的评测，接下来让我们用一组测试数据来测试提示词。

## 使用你的评估测试提示词

现在我们已经定义了应用在评测中应如何表现，接下来让我们构建一个提示词，以便为代表性的测试数据样本可靠地生成正确输出。

### 上传测试数据

为评测运行提供测试数据的方法有几种，但上传一个 [JSONL](https://jsonlines.org/) 文件可能更方便，该文件包含我们创建评测时指定的模式中的数据。下面是一个符合我们设置模式的示例 JSONL 文件：

```json
{ "item": { "ticket_text": "My monitor won't turn on!", "correct_label": "Hardware" } }
{ "item": { "ticket_text": "I'm in vim and I can't quit!", "correct_label": "Software" } }
{ "item": { "ticket_text": "Best restaurants in Cleveland?", "correct_label": "Other" } }
```

此数据集包含测试输入和真实标签，用于比较模型输出。

接下来，我们将测试数据文件上传到 OpenAI 平台，以便稍后引用它。你可以在此 [仪表板中上传文件](https://platform.openai.com/storage/files)，但也可以 [通过 API 上传文件](https://developers.openai.com/api/reference/resources/files/methods/create) 。下面的示例假设你在保存了上述示例 JSON 数据并命名为 `tickets.jsonl`:

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


上传文件时，请记下响应负载中的唯一 `id` 属性（如果你通过浏览器上传，也可在界面中查看）——我们稍后需要引用该值：

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

有了测试数据，让我们评估一个提示词，看看它如何根据我们的测试标准表现。通过 API，我们可以通过 [创建评估运行](https://developers.openai.com/api/reference/resources/evals/methods/create).

确保替换 `YOUR_EVAL_ID` 以及 `YOUR_FILE_ID` 使用你在上述步骤中创建的评估配置和测试数据文件的唯一 ID。


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





当我们创建运行时，我们使用 [Chat Completions](https://developers.openai.com/api/docs/guides/text?api-mode=chat) 消息数组或 [Responses](https://developers.openai.com/api/reference/resources/responses) 输入来设置提示词。此提示词用于为数据集中的每一行测试数据生成模型响应。我们可以使用双花括号语法来模板化动态变量 `item.ticket_text`，该变量取自当前测试数据项。

如果评估运行成功创建，你将收到一个如下所示的 API 响应：


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




你的评估运行现在已排队，它将异步执行，处理数据集中的每一行，使用我们指定的提示词和模型生成响应进行测试。

## 分析结果

要在运行成功、失败或被取消时收到更新，请创建一个 webhook 端点并订阅 `eval.run.succeeded`, `eval.run.failed`，和 `eval.run.canceled` 事件。请参阅 [webhooks 指南](https://developers.openai.com/api/docs/guides/webhooks) 了解更多详情。

根据数据集的大小，评估运行可能需要一些时间才能完成。你可以查看仪表板中的当前状态，但你也可以通过 [API 获取评估运行的当前状态](https://developers.openai.com/api/reference/resources/evals/methods/retrieve):

检索评估运行状态

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


你需要评估和评估运行的 UUID 来获取其状态。当你这样做时，你会看到类似这样的评估运行数据：


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




API 响应包含关于测试标准结果的详细信息、用于生成模型响应的 API 使用情况，以及一个 `report_url` 属性，该属性会带你进入仪表板中的一个页面，你可以在其中直观地探索结果。

在我们的简单测试中，模型可靠地为一个小型测试用例样本生成了我们想要的内容。实际上，你通常需要使用更多标准、不同提示和不同数据集来运行评估。但上述过程为你提供了构建健壮的 LLM 应用评估所需的所有工具！

## 后续步骤

现在你已经知道如何通过API以及使用仪表板来创建和运行评估！这里还有一些其他资源，可能在你继续改进模型结果时对你有用。

[食谱：检测提示词回归



      Keep tabs on the performance of your prompts as you iterate on them.](https://developers.openai.com/cookbook/examples/evaluation/use-cases/regression)

[食谱：批量模型和提示词实验



      Compare the results of many different prompts and models at once.](https://developers.openai.com/cookbook/examples/evaluation/use-cases/bulk-experimentation)

[食谱：监控存储的完成



      Examine stored completions to test for prompt regressions.](https://developers.openai.com/cookbook/examples/evaluation/use-cases/completion-monitoring)

[微调



      Improve a model's ability to generate responses tailored to your use case.](https://developers.openai.com/api/docs/guides/model-optimization)
[模型蒸馏



      Learn how to distill large model results to smaller, cheaper, and faster
    models.](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model)