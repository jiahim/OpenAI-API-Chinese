# Prompt engineering

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。你可以在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

通过 OpenAI API，你可以使用 [大语言模型](https://developers.openai.com/api/docs/models) 根据提示生成文本，就像使用 [ChatGPT](https://chatgpt.com)。一样。模型可以生成几乎任意类型的文本响应——比如代码、数学公式、结构化的 JSON 数据，或类人散文。



下面是一个使用 [Responses API](https://developers.openai.com/api/reference/resources/responses).

通过简单的提示生成文本

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  input: "Write a one-sentence bedtime story about a unicorn.",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    input="Write a one-sentence bedtime story about a unicorn.",
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

	resp, err := client.Responses.New(context.TODO(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Say this is a test")},
	})
	if err != nil {
		panic(err.Error())
	}

	fmt.Println(resp.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

public class Main {
  public static void main(String[] args) {
    OpenAIClient client = OpenAIOkHttpClient.fromEnv();

    ResponseCreateParams params =
        ResponseCreateParams.builder().input("Say this is a test").model("gpt-5.6").build();

    Response response = client.responses().create(params);
    response.output().stream()
        .flatMap(item -> item.message().stream())
        .flatMap(message -> message.content().stream())
        .flatMap(content -> content.outputText().stream())
        .forEach(outputText -> System.out.println(outputText.text()));
  }
}
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

ResponseResult response = await client.CreateResponseAsync(
    "gpt-5.6",
    "Say 'this is a test.'"
);

Console.WriteLine($"[ASSISTANT]: {response.GetOutputText()}");
```

```ruby
require "openai"

openai = OpenAI::Client.new

response = openai.responses.create(
  model: "gpt-5.6",
  input: "Write a one-sentence bedtime story about a unicorn."
)

puts(response.output_text)
```

```bash
openai responses create \
  --model "gpt-5.6" \
  --input "Write a one-sentence bedtime story about a unicorn." \
  --raw-output \
  --transform 'output.#(type=="message").content.0.text'
```

```bash
curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-5.6",
        "input": "Write a one-sentence bedtime story about a unicorn."
    }'
```


模型生成的内容数组位于响应的 `output` 属性中。在这个简单示例中，我们只有一个输出，形式如下：

```json
[
  {
    "id": "msg_67b73f697ba4819183a15cc17d011509",
    "type": "message",
    "role": "assistant",
    "content": [
      {
        "type": "output_text",
        "text": "Under the soft glow of the moon, Luna the unicorn danced through fields of twinkling stardust, leaving trails of dreams for every child asleep.",
        "annotations": []
      }
    ]
  }
]
```

**该 `output` 数组中通常包含不止一个条目！** 它可以包含工具调用、由 [推理模型](https://developers.openai.com/api/docs/guides/reasoning)，生成的推理 token 相关数据，以及其他条目。不能假设模型的文本输出一定出现在 `output[0].content[0].text`.

我们提供的一些 [官方 SDK](https://developers.openai.com/api/docs/libraries) 中为模型响应提供了一个 `output_text` 属性，便于使用，它会将模型的所有文本输出聚合为单个字符串。这可以作为一种快捷方式，方便地访问模型的文本输出。

除了纯文本之外，你还可以让模型以 JSON 格式返回结构化数据——这一功能称为 [**Structured Outputs**](https://developers.openai.com/api/docs/guides/structured-outputs).





## 选择模型

通过 API 生成内容时，一个关键的选择是你想使用哪个模型——也就是上面代码示例中的 `model` 参数。 [你可以在这里找到可用模型的完整列表](https://developers.openai.com/api/docs/models)。在为文本生成选择模型时，有以下几个因素需要考虑。

- **[推理模型](https://developers.openai.com/api/docs/guides/reasoning)** 会生成内部思维链来分析输入提示，擅长理解复杂任务和多步规划。但相比 GPT 模型，它们通常更慢且使用成本更高。
- **GPT 模型** 速度快、成本低且高度智能，但需要更明确的任务完成指令才能发挥最佳效果。
- **大模型和小模型（mini 或 nano）** 在速度、成本和智能水平上提供不同的权衡。大模型在理解提示和跨领域解决问题方面更有效，而小模型通常更快且使用成本更低。

如有疑问， [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 为通用文本生成和提示迭代提供了一个强大的默认选择。

## Prompt engineering

**提示工程** 是为模型编写有效指令的过程，使其能够始终如一地生成满足你需求的内容。

由于模型生成的内容具有不确定性，通过提示获得期望输出既是一门艺术，也是一门科学。不过，你可以应用一些技巧和最佳实践，持续获得良好结果。

一些提示工程技术适用于所有模型，例如使用消息角色。但不同类型的模型（例如推理模型与 GPT 模型）可能需要采用不同的提示方式才能产生最佳效果。即使是同一模型系列中的不同快照版本，也可能会产生不同的结果。因此，当你构建更复杂的应用时，我们强烈建议你：

- 将你的生产应用固定到特定的 [模型快照](https://developers.openai.com/api/docs/models) （比如 `gpt-4.1-2025-04-14` ）以确保行为一致
- 构建用于衡量提示行为的测试和评估套件，以便你在迭代时或在更改和升级模型版本时监控性能

现在，让我们来看一些可用于你构建提示词的工具和技巧。

## 消息角色与指令遵循



你可以通过 [不同级别的优先级](https://model-spec.openai.com/2025-02-12.html#chain_of_command) 使用 `instructions` API 参数或 **消息角色**.

该 `instructions` 参数向模型提供高层指令，说明它在生成响应时应如何表现，包括语气、目标以及正确响应的示例。通过此方式提供的任何指令将优先于 `input` 参数中的提示。

使用指令生成文本

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  reasoning: { effort: "low" },
  instructions: "Talk like a pirate.",
  input: "Are semicolons optional in JavaScript?",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    reasoning={"effort": "low"},
    instructions="Talk like a pirate.",
    input="Are semicolons optional in JavaScript?",
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
		Model:        "gpt-5.6",
		Instructions: openai.String("Talk like a pirate."),
		Reasoning: responses.ReasoningParam{
			Effort: responses.ReasoningEffortLow,
		},
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Are semicolons optional in JavaScript?"),
		},
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

String semicolonsDevMsg = "Talk like a pirate.";

String semicolonsPrompt = "Are semicolons optional in JavaScript?";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input(semicolonsPrompt)
        .instructions(semicolonsDevMsg)
        .reasoning(Reasoning.builder().effort(ReasoningEffort.LOW).build())
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
    Model = "gpt-5.6",
    Instructions = "Talk like a pirate.",
    ReasoningOptions = new ResponseReasoningOptions
    {
        ReasoningEffortLevel = ResponseReasoningEffortLevel.Low,
    },
};
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("Are semicolons optional in JavaScript?")
);

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  instructions: "Talk like a pirate.",
  reasoning: {effort: :low},
  input: "Are semicolons optional in JavaScript?"
)

puts(response.output_text)
```

```bash
curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-5.6",
        "reasoning": {"effort": "low"},
        "instructions": "Talk like a pirate.",
        "input": "Are semicolons optional in JavaScript?"
    }'
```


上面的示例大致等同于在 `input` 数组中使用以下输入消息：

使用不同角色的消息生成文本

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  reasoning: { effort: "low" },
  input: [
    {
      role: "developer",
      content: "Talk like a pirate.",
    },
    {
      role: "user",
      content: "Are semicolons optional in JavaScript?",
    },
  ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    reasoning={"effort": "low"},
    input=[
        {"role": "developer", "content": "Talk like a pirate."},
        {"role": "user", "content": "Are semicolons optional in JavaScript?"},
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

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Reasoning: responses.ReasoningParam{
			Effort: responses.ReasoningEffortLow,
		},
		Input: responses.ResponseNewParamsInputUnion{
			OfInputItemList: responses.ResponseInputParam{
				responses.ResponseInputItemParamOfMessage(
					"Talk like a pirate.",
					responses.EasyInputMessageRoleDeveloper,
				),
				responses.ResponseInputItemParamOfMessage(
					"Are semicolons optional in JavaScript?",
					responses.EasyInputMessageRoleUser,
				),
			},
		},
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
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.List;

String semicolonsDevMsg = "Talk like a pirate.";

String semicolonsPrompt = "Are semicolons optional in JavaScript?";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input(
            ResponseCreateParams.Input.ofResponse(
                List.of(
                    ResponseInputItem.ofEasyInputMessage(
                        EasyInputMessage.builder()
                            .role(EasyInputMessage.Role.DEVELOPER)
                            .content(semicolonsDevMsg)
                            .build()),
                    ResponseInputItem.ofEasyInputMessage(
                        EasyInputMessage.builder()
                            .role(EasyInputMessage.Role.USER)
                            .content(semicolonsPrompt)
                            .build()))))
        .reasoning(Reasoning.builder().effort(ReasoningEffort.LOW).build())
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
    Model = "gpt-5.6",
    ReasoningOptions = new ResponseReasoningOptions
    {
        ReasoningEffortLevel = ResponseReasoningEffortLevel.Low,
    },
};
options.InputItems.Add(
    ResponseItem.CreateDeveloperMessageItem("Talk like a pirate.")
);
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("Are semicolons optional in JavaScript?")
);

ResponseResult response = await client.CreateResponseAsync(options);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  reasoning: {effort: :low},
  input: [
    {role: :developer, content: "Talk like a pirate."},
    {role: :user, content: "Are semicolons optional in JavaScript?"}
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
        "reasoning": {"effort": "low"},
        "input": [
            {
                "role": "developer",
                "content": "Talk like a pirate."
            },
            {
                "role": "user",
                "content": "Are semicolons optional in JavaScript?"
            }
        ]
    }'
```


请注意， `instructions` 参数仅适用于当前的响应生成请求。如果你正在 [管理对话状态](https://developers.openai.com/api/docs/guides/conversation-state) 使用 `previous_response_id` 参数，则 `instructions` 中先前轮次使用的指令将不会出现在上下文中。





该 [OpenAI 模型规范](https://model-spec.openai.com/2025-02-12.html#chain_of_command) 描述了我们的模型如何为不同角色的消息赋予不同的优先级。

| `developer`                                                                                                        | `user`                                                                                             | `assistant`                                                |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `developer` messages 是由应用开发者提供的指令，优先级高于 `user` messages。 | `user` messages 是由终端用户提供的指令，优先级低于 `developer` messages。 | 由模型生成的消息具有 `assistant` 角色。 |

多轮对话可以由若干上述类型的消息，以及你和模型提供的其他内容类型组成。了解更多关于 [管理对话状态的信息](https://developers.openai.com/api/docs/guides/conversation-state).

你可以把 `developer` 和 `user` 消息看作是编程语言中的函数及其参数。

- `developer` message 提供系统的规则和业务逻辑，类似于函数定义。
- `user` messages 提供输入和配置，是 message 指令的应用对象，类似于函数的参数。 `developer` message 指令的应用对象，类似于函数的参数。

## Version prompts in code

将生产环境的提示词存储在应用代码中，而不是创建可复用的提示对象。代码管理的提示词可让你使用类型化输入、代码审查、测试以及常规部署流程来更改模型行为。

OpenAI 正在弃用 API 中的可复用提示对象。提示创建将
  从 2026-06-03 起逐步弱化，并于 `v1/prompts` 计划于
  2026-11-30 关停。详见 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) 以了解当前的
  时间表。

对于新的提示工程工作：

- 将提示构建器放在靠近其所支持功能的独立小模块中。
- 对动态值（例如客户数据、文件或任务选项）使用带类型的函数参数或 schema。
- 将生成的 `instructions` 和 `input` 直接传递给 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create).
- 在修改生产环境中的提示之前，先添加具有代表性的 fixtures、测试和评估检查。
- 通过你的部署系统发布提示变更；需要分阶段发布时，可使用功能开关或配置。

如果你的集成已通过提示词 ID 或版本调用已保存的提示词，请使用 [prompt 对象迁移指南](https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object) 将该提示词迁移到代码中。

## 使用 Markdown 和 XML 进行消息格式化

编写 `developer` 和 `user` 消息时，你可以结合使用 [Markdown](https://commonmark.org/help/) 格式和 [XML 标签](https://www.w3.org/TR/xml/).

Markdown 标题和列表有助于标记提示中不同的部分，并向模型传达层级结构。它们还能让提示在开发过程中更易于阅读。XML 标签可以划分一段内容（例如用于参考的支持文档）的开始和结束位置。XML 属性还可以用来定义提示中内容的元数据，以便你的指令可以引用这些元数据。

一般来说，开发者消息会包含以下几个部分，通常按以下顺序排列（但具体的最优内容和顺序可能会因所用模型而异）：

- **身份：** 描述助手的目的、沟通风格和高层目标。
- **指令：** 为模型提供指导，说明如何生成你想要的回答。它应该遵循哪些规则？模型应该做什么，又绝不应该做什么？根据你的使用场景，本节可以包含许多子节，例如模型应该如何 [调用自定义函数](https://developers.openai.com/api/docs/guides/function-calling).
- **示例：** 提供可能的输入示例，以及模型期望的输出。
- **上下文：** 向模型提供生成回答所需的任何额外信息，例如训练数据之外的私有或专有数据，或其他你知道会特别相关的数据。通常把这部分内容放在提示词的末尾附近最为合适，因为你可以针对不同的生成请求包含不同的上下文。

下面是使用 Markdown 和 XML 标签构建一个 `developer` 包含不同部分和支撑示例的 message 示例。



示例 prompt

    A developer message for code generation

```text
# Identity

You are coding assistant that helps enforce the use of snake case
variables in JavaScript code, and writing code that will run in
Internet Explorer version 6.

# Instructions

* When defining variables, use snake case names (e.g. my_variable)
  instead of camel case names (e.g. myVariable).
* To support old browsers, declare variables using the older
  "var" keyword.
* Do not give responses with Markdown formatting, just return
  the code as requested.

# Examples

<user_query>
How do I declare a string variable for a first name?
</user_query>

<assistant_response>
var first_name = "Anna";
</assistant_response>
```

  

  

    
API 请求

    Send a prompt to generate code through the API

```javascript
import fs from "fs/promises";
import OpenAI from "openai";
const client = new OpenAI();

const instructions = await fs.readFile("fixtures/prompt.txt", "utf-8");

const response = await client.responses.create({
  model: "gpt-5.6",
  instructions,
  input: "How would I declare a variable for a last name?",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

with open("prompt.txt", "r", encoding="utf-8") as f:
    instructions = f.read()

response = client.responses.create(
    model="gpt-5.6",
    instructions=instructions,
    input="How would I declare a variable for a last name?",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()

	instructions, err := os.ReadFile("prompt.txt")
	if err != nil {
		panic(err)
	}

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:        "gpt-5.6",
		Instructions: openai.String(string(instructions)),
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("How would I declare a variable for a last name?"),
		},
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
        .model("gpt-5.6")
        .instructions(
            "You are a coding assistant. Answer with concise JavaScript examples and use semicolons.")
        .input("How would I declare a variable for a last name?")
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

string instructions = await File.ReadAllTextAsync("prompt.txt");
CreateResponseOptions options = new()
{
    Model = "gpt-5.6",
    Instructions = instructions,
};
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("How would I declare a variable for a last name?")
);

ResponseResult response = await client.CreateResponseAsync(options);
Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
instructions = File.read(File.join(__dir__, "prompt.txt"))
response = client.responses.create(
  model: "gpt-5.6",
  instructions: instructions,
  input: "How would I declare a variable for a last name?"
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "instructions": "'"$(< prompt.txt)"'",
    "input": "How would I declare a variable for a last name?"
  }'
```



#### 通过提示缓存降低成本与延迟

在构建消息时，应将你预期会在多个 API 请求中反复使用的内容放在提示的开头， **和** 即放在你在 JSON 请求体中传入的前几个 API 参数中， [Chat Completions](https://developers.openai.com/api/reference/resources/chat) 或 [Responses](https://developers.openai.com/api/reference/resources/responses)。这样可以最大化节省成本和延迟，享受 [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching).

## Few-shot learning

少样本学习让你可以在提示词中加入少量输入/输出示例，从而引导大型语言模型执行新任务，而不是 [微调](https://developers.openai.com/api/docs/guides/model-optimization) 模型。模型会从这些示例中隐式“理解”规律，并将其应用于提示词。提供示例时，尝试展示各种可能的输入及其期望输出。

通常，你会将示例作为 `developer` message in your API request. 示例如下 `developer` 消息，其中包含向模型展示如何对正面或负面客户服务评论进行分类的示例。

```
# Identity

You are a helpful assistant that labels short product reviews as
Positive, Negative, or Neutral.

# Instructions

* Only output a single word in your response with no additional formatting
  or commentary.
* Your response should only be one of the words "Positive", "Negative", or
  "Neutral" depending on the sentiment of the product review you are given.

# Examples

<product_review id="example-1">
I absolutely love this headphones — sound quality is amazing!
</product_review>

<assistant_response id="example-1">
Positive
</assistant_response>

<product_review id="example-2">
Battery life is okay, but the ear pads feel cheap.
</product_review>

<assistant_response id="example-2">
Neutral
</assistant_response>

<product_review id="example-3">
Terrible customer service, I'll never buy from them again.
</product_review>

<assistant_response id="example-3">
Negative
</assistant_response>
```

## 包含相关上下文信息

在向模型提供提示时，常常需要加入一些额外的上下文信息，供模型用于生成回复。常见的理由有以下几种：

- 为模型提供对专有数据，或模型训练数据之外的任何其他数据的访问权限。
- 将模型的响应限制在你自己确定的一组最有价值的特定资源范围内。

在模型生成请求中添加额外的相关上下文这种技术有时被称为 **检索增强生成（RAG）**。你可以通过多种方式向提示中添加额外的上下文，例如查询向量数据库并将返回的文本纳入提示，或者使用 OpenAI 内置的 [文件搜索 工具](https://developers.openai.com/api/docs/guides/tools-file-search) 来根据上传的文档生成内容。

#### 规划上下文窗口

模型在一次生成请求中能够处理的上下文数据量是有限的。这个内存上限被称为 **上下文窗口**，它以 [token](https://blogs.nvidia.com/blog/ai-tokens-explained) （你传入的数据块，从文本到图像）为单位来衡量。

不同模型的上下文窗口大小不同，从较低的 100k 范围到最新的 GPT-4.1 模型的一百万个 token 不等。 [请参阅模型文档](https://developers.openai.com/api/docs/models) 以了解每个模型的具体上下文窗口大小。

## 提示当前 GPT-5 系列模型

像 GPT 这样的模型在 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 精确指令中受益，这些指令显式提供完成任务所需的逻辑和数据。要充分利用最新的 GPT-5 系列模型，请从当前的提示指南开始。

[

      Get the most out of prompting the latest GPT-5 series model with current
    guidance, practical examples, and migration notes.](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)

### GPT-5 系列模型最新版本的提示最佳实践

有关完整的最新处理方式，请参阅 [最新的 GPT-5 提示词最佳实践](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)。以下实用提醒仍然适用。



#### Coding



#### Coding

提示 `gpt-5.6` 遵循一些最佳实践时，编码任务的提示最为有效：定义智能体的角色，通过示例强制使用结构化工具，要求进行充分的正确性测试，并设置 Markdown 标准以保证输出整洁。

**明确的角色与工作流指导**
将模型定位为软件工程智能体，并明确其职责范围。提供关于使用工具的清晰说明，例如 `functions.run` 用于编码任务，并指明何时不使用某些模式——例如，除非必要，否则避免交互式执行。

**测试与验证**
指示模型使用单元测试或 Python 命令来测试变更，并仔细验证补丁，因为像 `apply_patch` 这类工具即使失败也可能返回“Done”。

**工具使用示例**
提供具体的示例，展示如何使用所提供的函数调用命令，这有助于提升可靠性以及对预期工作流的遵循程度。

**Markdown 标准**
指导模型在适当时使用行内代码、代码围栏、列表和表格生成整洁、语义正确的 markdown，并使用反引号格式化文件路径、函数和类。

有关编码相关的详细指导和提示示例，请参阅 [最新的 GPT-5 提示词最佳实践](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices).







#### 前端工程



[GPT-5.6](https://developers.openai.com/api/docs/models/gpt-5.6-sol)
在从零开始构建前端以及为
大型、成熟的代码库贡献代码方面表现出色。为获得最佳结果，我们建议使用
以下库：

- **样式 / UI：** Tailwind CSS、shadcn/ui、Radix Themes
- **图标：** Lucide、Material Symbols、Heroicons
- **动画**: Motion

**从零到一的 Web 应用**

GPT-5 只需一条提示就能生成前端 Web 应用，无需提供示例。以下是一个示例提示：

```bash
You are a world class web developer, capable of producing stunning, interactive, and innovative websites from scratch in a single prompt. You excel at delivering top-tier one-shot solutions.
Your process is simple and follows these steps:
Step 1: Create an evaluation rubric and refine it until you are fully confident.
Step 2: Consider every element that defines a world-class one-shot web app, then use that insight to create a &lt;ONE_SHOT_RUBRIC&gt; with 5–7 categories. Keep this rubric hidden—it's for internal use only.
Step 3: Apply the rubric to iterate on the optimal solution to the given prompt. If it doesn't meet the highest standard across all categories, refine and try again.
Step 4: Aim for simplicity while fully achieving the goal, and avoid external dependencies such as Next.js or React.
```

**与大型代码库的集成**

对于大型代码库中的前端工程工作，我们发现将以下几类指令加入提示中效果最佳：

- **原则：** 设定视觉质量标准，使用模块化/可复用组件，并保持设计的一致性。
- **UI/UX：** 明确字体、颜色、间距/布局、交互状态（悬停、空、加载）以及无障碍要求。
- **结构：** 定义文件/文件夹布局，以实现无缝集成。
- **组件：** 给出可复用包装示例以及后端调用分离策略。
- **页面：** 为常见布局提供模板。
- **智能体 指令：** 要求模型确认设计假设、搭建项目脚手架、执行标准、集成 API、测试各种状态并记录代码。

有关针对前端开发的详细指南和提示示例，请参阅 [最新的 GPT-5 提示词最佳实践](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices).







#### 智能体任务



对于智能体式和长时间运行的推理任务， `gpt-5.6`，请将提示词聚焦于三个核心实践：周密地规划任务以确保完整解决，为重要的工具使用决策提供清晰的前置说明，并使用 TODO 工具以有条理的方式跟踪工作流和进度。

**规划与持续推进**
指示模型在交还控制权之前完整解决整个查询，将其分解为子任务，并在每次工具调用后进行反思以确认是否完整。

```
Remember, you are an agent - please keep going until the user's
query is completely resolved, before ending your turn and yielding
back to the user. Decompose the user's query into all required
sub-requests, and confirm that each is completed. Do not stop
after completing only part of the request. Only terminate your
turn when you are sure that the problem is solved. You must be
prepared to answer multiple queries and only finish the call once
the user has confirmed they're done.

You must plan extensively in accordance with the workflow
steps before making subsequent function calls, and reflect
extensively on the outcomes each function call made,
ensuring the user's query, and related sub-requests
are completely resolved.
```

**为保持透明而设置的前置说明**

要求模型解释其调用工具的原因，但仅限于在关键步骤中说明。

```
Before you call a tool explain why you are calling it
```

**使用评分标准和 TODO 跟踪进度**

使用 TODO 列表工具或评分标准来强制结构化规划，避免遗漏步骤。

有关构建智能体的详细指导和提示示例，请参阅 [最新的 GPT-5 提示词最佳实践](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices).





## 提示推理模型

在对 [推理模型](https://developers.openai.com/api/docs/guides/reasoning) 进行提示与对 GPT 模型进行提示时，需要考虑一些差异。一般来说，推理模型在仅有高层指导的任务上会提供更好的效果。这与 GPT 模型不同——后者会从非常精确的指令中受益。

你可以这样理解推理模型与 GPT 模型之间的差异。

- 推理模型就像一位资深同事。你可以给它们设定一个目标，并相信它们能自行规划实现细节。
- GPT 模型就像一位初级同事。在给出明确指令、要求其生成特定输出时，它们会表现得最好。

关于使用推理模型时最佳实践的更多信息， [请参阅本指南](https://developers.openai.com/api/docs/guides/reasoning-best-practices).

## 后续步骤

现在你已经了解了文本输入和输出的基础知识，接下来可以查看以下资源之一。

[在 Playground 中构建提示词



      Use the Playground to develop and iterate on prompts.](https://platform.openai.com/chat/edit)

[使用 Structured Outputs 生成 JSON 数据



      Ensure JSON data emitted from a model conforms to a JSON schema.](https://developers.openai.com/api/docs/guides/structured-outputs)

[完整 API 参考



      Check out all the options for text generation in the API reference.](https://developers.openai.com/api/reference/resources/responses)

## 其他资源

如需更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook)，其中包含示例代码，并提供指向以下第三方资源的链接：

- [提示库与工具](https://developers.openai.com/cookbook/articles/related_resources#prompting-libraries--tools)
- [提示指南](https://developers.openai.com/cookbook/articles/related_resources#prompting-guides)
- [视频课程](https://developers.openai.com/cookbook/articles/related_resources#video-courses)
- [关于使用高级提示提升推理能力的论文](https://developers.openai.com/cookbook/articles/related_resources#papers-on-advanced-prompting-to-improve-reasoning)