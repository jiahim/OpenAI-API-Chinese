# Prompt engineering

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

使用 OpenAI API，你可以使用一个 [大语言模型](https://developers.openai.com/api/docs/models) 根据提示词生成文本，就像你使用 [ChatGPT](https://chatgpt.com)。模型可以生成几乎任意类型的文本响应——比如代码、数学公式、结构化的 JSON 数据，或类似人类的散文。



下面是一个使用 [Responses API](https://developers.openai.com/api/reference/resources/responses).

通过简单的提示词生成文本

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
  input: "Write a one-sentence bedtime story about a unicorn.",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
        ResponseCreateParams.builder().input("Say this is a test").model("gpt-6-astra").build();

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
    "gpt-6-astra",
    "Say 'this is a test.'"
);

Console.WriteLine($"[ASSISTANT]: {response.GetOutputText()}");
```

```ruby
require "openai"

openai = OpenAI::Client.new

response = openai.responses.create(
  model: "gpt-6-astra",
  input: "Write a one-sentence bedtime story about a unicorn."
)

puts(response.output_text)
```

```bash
openai responses create \
  --model "gpt-6-astra" \
  --input "Write a one-sentence bedtime story about a unicorn." \
  --raw-output \
  --transform 'output.#(type=="message").content.0.text'
```

```bash
curl "https://api.openai.com/v1/responses" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
        "model": "gpt-6-astra",
        "input": "Write a one-sentence bedtime story about a unicorn."
    }'
```


模型生成的内容数组位于响应的 `output` 属性中。在这个简单的示例中，我们只有一个输出，如下所示：

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

**该 `output` 数组通常包含多个条目！** 它可能包含工具调用，以及关于 [推理模型](https://developers.openai.com/api/docs/guides/reasoning)，生成的推理 token 的相关信息等其他条目。不能假定模型的文本输出一定出现在 `output[0].content[0].text`.

我们的一些 [官方 SDK](https://developers.openai.com/api/docs/libraries) 在模型响应中提供了一个 `output_text` 属性作为便利，它会将模型的所有文本输出聚合成单个字符串。这可以作为一种访问模型文本输出的便捷方式。

除了纯文本之外，你还可以让模型以 JSON 格式返回结构化数据——这个功能称为 [**结构化输出**](https://developers.openai.com/api/docs/guides/structured-outputs).





## 选择模型

通过 API 生成内容时，一个关键的选择是决定使用哪个模型——即上述代码示例中的 `model` 参数。 [你可以在这里找到可用模型的完整列表](https://developers.openai.com/api/docs/models)。在为文本生成选择模型时，可以参考以下几个因素。

- **[推理模型](https://developers.openai.com/api/docs/guides/reasoning)** 会生成内部思维链来分析输入提示，擅长理解复杂任务和多步规划。它们通常也比 GPT 模型更慢、成本更高。
- **GPT 模型** 速度快、成本效益高且非常智能，但需要更明确的指令来完成各项任务。
- **大模型与小模型（mini 或 nano）** 在速度、成本和智能水平之间提供不同的取舍。大模型在理解提示和跨领域解决问题方面更有效，而小模型通常更快、成本更低。

如有疑问， [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 为通用文本生成和提示迭代提供了一个强大的默认选择。

## Prompt engineering

**提示工程** 是指为模型编写有效指令的过程，使其能够一致地生成满足你需求的内容。

由于模型生成的内容具有不确定性，因此通过提示获得期望输出既是一门艺术，也是一门科学。不过，你可以应用一些技巧和最佳实践来稳定地获得良好的结果。

一些提示工程技巧对所有模型都适用，例如使用消息角色。但不同的模型类型（例如推理模型与 GPT 模型）可能需要不同的提示方式才能产生最佳效果。即使是同一系列中不同快照的模型，生成的结果也可能不同。因此，在构建更复杂的应用时，我们强烈建议你：

- 将你的生产应用固定到特定的 [模型快照](https://developers.openai.com/api/docs/models) （比如 `gpt-4.1-2025-04-14` ）以确保行为一致
- 构建用于衡量提示行为的测试和评估套件，以便在迭代过程中或更换、升级模型版本时监控性能

现在，我们来看一些可用的工具和技术，帮助你构建提示词。

## 消息角色与指令遵循



你可以通过以下方式向模型提供指令： [不同优先级的指令](https://model-spec.openai.com/2025-02-12.html#chain_of_command) 使用 `instructions` API 参数或 **消息角色**.

该 `instructions` 参数为模型提供高层级指令，说明它在生成响应时应该如何表现，包括语气、目标以及正确响应的示例。以此方式提供的任何指令将优先于 `input` 参数中的提示。

使用指令生成文本

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model:        "gpt-6-astra",
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
        .model("gpt-6-astra")
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
    Model = "gpt-6-astra",
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
  model: "gpt-6-astra",
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
        "model": "gpt-6-astra",
        "reasoning": {"effort": "low"},
        "instructions": "Talk like a pirate.",
        "input": "Are semicolons optional in JavaScript?"
    }'
```


上面的示例大致等价于在 `input` 数组中使用以下输入消息：

使用不同角色的消息生成文本

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model: "gpt-6-astra",
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
        .model("gpt-6-astra")
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
    Model = "gpt-6-astra",
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
  model: "gpt-6-astra",
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
        "model": "gpt-6-astra",
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


请注意， `instructions` 参数仅适用于当前的响应生成请求。如果你正在 [管理对话状态](https://developers.openai.com/api/docs/guides/conversation-state) 使用 `previous_response_id` 参数，则先前轮次中使用的 `instructions` 将不会出现在上下文中。





该 [OpenAI 模型规范](https://model-spec.openai.com/2025-02-12.html#chain_of_command) 描述了我们的模型如何为不同角色的消息赋予不同的优先级。

| `developer`                                                                                                        | `user`                                                                                             | `assistant`                                                |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `developer` 消息是由应用开发者提供的指令，其优先级高于 `user` 消息。 | `user` 消息是由终端用户提供的指令，其优先级低于 `developer` 消息。 | 由模型生成的消息具有 `assistant` 角色。 |

多轮对话可以由多条这些类型的消息以及你与模型共同提供的其他内容类型组成。了解更多关于 [管理对话状态的信息](https://developers.openai.com/api/docs/guides/conversation-state).

你可以这样理解： `developer` 和 `user` 消息就像编程语言中的函数及其参数。

- `developer` 消息提供系统的规则和业务逻辑，就像函数定义一样。
- `user` 消息提供要应用消息指令的输入和配置，就像函数的参数一样。 `developer` 消息提供要应用消息指令的输入和配置，就像函数的参数一样。

## Version prompts in code

将生产环境中的提示存储在应用代码中，而不是创建可复用的 prompt 对象。通过代码管理提示，你可以使用类型化输入、代码审查、测试以及常规的部署流程来更改模型行为。

OpenAI 正在弃用 API 中的可复用 prompt 对象。Prompt 创建功能将于
  2026-06-03 起弱化，并 `v1/prompts` 计划于
  2026-11-30 下线。有关当前 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) 的时间表，请参阅
  。

对于新的提示工程工作：

- 将提示构建器放在它们所支持的功能附近的一个小模块中。
- 对客户数据、文件或任务选项等动态值使用类型化的函数参数或 schema。
- 将生成的 `instructions` 和 `input` 直接传递给 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create).
- 在更改生产提示之前，添加具有代表性的 fixtures、测试和评估检查。
- 通过你的部署系统推广提示变更，在需要分阶段发布时使用功能开关或配置。

如果你的集成已经通过提示词 ID 或版本调用了已保存的提示词，请使用 [提示词对象迁移指南](https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object) 将该提示词迁移到代码中。

## 使用 Markdown 和 XML 的消息格式

在编写 `developer` 和 `user` 消息时，你可以通过结合使用 [Markdown](https://commonmark.org/help/) 格式化和 [XML 标签](https://www.w3.org/TR/xml/).

Markdown 标题和列表有助于在提示中标记不同的部分，并向模型传达层级结构。它们还可能在开发过程中让提示更易读。XML 标签可以帮助界定一段内容的开始和结束（例如用作参考的支持文档）。XML 属性也可用于定义提示中内容的元数据，供你的指令引用。

通常，开发者消息会包含以下部分，通常按此顺序排列（不过确切的最佳内容和顺序可能因所使用的模型而异）：

- **身份：** 描述助手的目的、沟通风格和高层目标。
- **指令：** 为模型提供如何生成你所需回复的指导。它应遵循哪些规则？模型应该做什么，以及模型绝对不应该做什么？根据你的用例，本节可以包含许多子节，例如模型应如何 [调用自定义函数](https://developers.openai.com/api/docs/guides/function-calling).
- **示例：** 提供可能的输入示例，以及模型期望的输出。
- **上下文：** 向模型提供生成回复所需的任何额外信息，例如其训练数据之外的私有/专有数据，或任何你知道将特别相关的数据。这些内容通常最好放在提示词的末尾附近，因为你可以针对不同的生成请求包含不同的上下文。

下面是使用 Markdown 和 XML 标签构造包含不同部分和支撑示例的 `developer` 消息的示例。



示例提示词

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
  model: "gpt-6-astra",
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
    model="gpt-6-astra",
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
		Model:        "gpt-6-astra",
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
        .model("gpt-6-astra")
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
    Model = "gpt-6-astra",
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
  model: "gpt-6-astra",
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
    "model": "gpt-6-astra",
    "instructions": "'"$(< prompt.txt)"'",
    "input": "How would I declare a variable for a last name?"
  }'
```



#### 通过提示缓存节省成本并降低延迟

在构造消息时，应尽量把预计会在多次 API 请求中重复使用的内容放在提示的开头， **和** 你在 JSON 请求体中传入的第一个 API 参数中 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) 或 [Responses](https://developers.openai.com/api/reference/resources/responses). 这使你能够最大化来自 [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching).

## Few-shot learning

少样本学习让你可以通过在提示中包含少量输入/输出示例来引导大型语言模型完成新任务，而不是 [微调](https://developers.openai.com/api/docs/guides/model-optimization) 模型。模型会从这些示例中隐式地“识别”模式，并将其应用到提示中。提供示例时，尽量展示多样化范围的可能的输入及其期望的输出。

通常，你会在 API 请求中以一条 `developer` 消息的形式提供示例。下面是一个包含示例的 `developer` 消息，展示了如何让模型对正面或负面的客服评价进行分类。

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

在向模型提供提示时，常常需要加入一些额外的上下文信息，供模型在生成回答时使用。你可能会这样做的原因有以下几种：

- 为了让模型能够访问专有数据，或访问模型训练数据集之外的任何其他数据。
- 为了将模型的响应限制在你已确定最有价值的一组特定资源范围内。

向模型生成请求中添加额外相关上下文的技术有时被称为 **检索增强生成（RAG）**。你可以通过多种方式向提示中添加额外的上下文，比如查询向量数据库并将返回的文本纳入提示，或者使用 OpenAI 内置的 [文件搜索工具](https://developers.openai.com/api/docs/guides/tools-file-search) 基于已上传的文档生成内容。

#### 为上下文窗口进行规划

模型在一次生成请求中所能考虑的上下文数据量是有限的。这个内存限制称为 **上下文窗口**，它以 [tokens](https://blogs.nvidia.com/blog/ai-tokens-explained) （你传入的数据块，可以是文本或图像）为单位来定义。

不同模型的上下文窗口大小各不相同，从较低的 10 万 tokens 范围到较新的 GPT-4.1 模型的一百万 tokens 不等。 [请参阅模型文档](https://developers.openai.com/api/docs/models) 以了解每个模型的具体上下文窗口大小。




## 当前模型的提示工程

像 GPT 这样的模型 [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 受益于精确的指令，这些指令在提示词中明确提供完成任务所需的逻辑和数据。要充分发挥最新模型的性能，请从当前的提示词指南开始。

[

      Get the most out of prompting the latest model with current guidance,
    practical examples, and migration notes.](https://developers.openai.com/api/docs/guides/latest-model)




### 针对最新模型的提示词最佳实践

如需了解完整的最新说明，请参阅 [最新的模型提示最佳实践](https://developers.openai.com/api/docs/guides/latest-model)。以下实用的注意事项仍然适用。



#### Coding



#### Coding

提示词 `gpt-6-astra` 用于编码任务时，遵循一些最佳实践最为有效：定义智能体的角色，通过示例强制结构化工具使用，要求进行充分的正确性测试，并为干净输出设定 Markdown 标准。

**明确的角色与工作流指导**
将模型定位为一名职责明确的软件工程智能体。提供使用工具的清晰说明，例如 `functions.run` 用于代码任务，并指明何时不应使用某些模式——例如，除非必要，避免交互式执行。

**测试与验证**
指示模型使用单元测试或 Python 命令来测试更改，并仔细验证补丁，因为像 `apply_patch` 这样的工具即使在失败时也可能返回“Done”。

**工具使用示例**
提供具体示例展示如何使用所提供的函数调用命令，这能提高可靠性并增强对预期工作流的遵循。

**Markdown 标准**
指导模型在适当处使用内联代码、代码围栏、列表和表格生成干净、语义正确的 markdown——并使用反引号格式化文件路径、函数和类。

有关编码相关的详细指导和提示词示例，请参阅 [最新的模型提示最佳实践](https://developers.openai.com/api/docs/guides/latest-model).







#### 前端工程



[GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)
在从零开始构建前端以及为大型、既有代码库贡献代码方面表现良好。为了获得最佳效果，我们建议使用
以下库：
以下库：

- **样式 / UI：** Tailwind CSS、shadcn/ui、Radix Themes
- **图标：** Lucide、Material Symbols、Heroicons
- **动画**：Motion

**从零到一的 Web 应用**

GPT-5 可以根据单个提示生成前端 Web 应用，无需示例。以下是一个示例提示：

```bash
You are a world class web developer, capable of producing stunning, interactive, and innovative websites from scratch in a single prompt. You excel at delivering top-tier one-shot solutions.
Your process is simple and follows these steps:
Step 1: Create an evaluation rubric and refine it until you are fully confident.
Step 2: Consider every element that defines a world-class one-shot web app, then use that insight to create a &lt;ONE_SHOT_RUBRIC&gt; with 5–7 categories. Keep this rubric hidden—it's for internal use only.
Step 3: Apply the rubric to iterate on the optimal solution to the given prompt. If it doesn't meet the highest standard across all categories, refine and try again.
Step 4: Aim for simplicity while fully achieving the goal, and avoid external dependencies such as Next.js or React.
```

**与大型代码库的集成**

对于更大代码库中的前端工程工作，我们发现将以下类别的指令添加到你的提示中可以获得最佳效果：

- **原则：** 设定视觉质量标准，使用模块化/可复用组件，并保持设计一致性。
- **UI/UX：** 明确字体、颜色、间距/布局、交互状态（悬停、空状态、加载）以及可访问性。
- **结构：** 定义文件/文件夹布局以实现无缝集成。
- **组件：** 提供可复用的封装示例以及后端调用分离策略。
- **页面：** 为常见布局提供模板。
- **智能体指令：** 让模型确认设计假设、搭建项目脚手架、执行标准、集成API、测试各种状态，并编写代码文档。

有关针对前端开发的详细指南和提示词示例，请参阅 [最新的模型提示最佳实践](https://developers.openai.com/api/docs/guides/latest-model).







#### 智能体任务



针对智能体和长时间运行的 `gpt-6-astra`，请将提示词聚焦于三项核心实践：充分规划任务以确保完整解决，为重要的工具使用决策提供清晰的说明，并使用 TODO 工具以有序方式跟踪工作流与进度。

**规划与持久性**
指示模型在交出控制权之前解决完整查询，将其分解为子任务，并在每次工具调用后进行反思以确认完整性。

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

**保持透明的前置说明**

要求模型解释调用工具的原因，但仅在关键步骤中说明。

```
Before you call a tool explain why you are calling it
```

**使用评分标准与 TODO 进行进度跟踪**

使用 TODO 列表工具或评分标准来强制执行结构化规划，避免遗漏步骤。

有关构建智能体的详细指导和提示词示例，请参阅 [最新的模型提示最佳实践](https://developers.openai.com/api/docs/guides/latest-model).





## 对推理模型进行提示

在向 [推理模型](https://developers.openai.com/api/docs/guides/reasoning) 发起提示词请求时，与向 GPT 模型发起提示词请求存在一些差异。一般来说，推理模型在仅有高层指引的任务上会给出更好的效果；而 GPT 模型则能从非常精确的指令中受益。

你可以这样理解推理模型与 GPT 模型之间的差异。

- 推理模型就像一位资深同事。你可以给它们设定一个目标，并信任它们自行处理细节。
- GPT 模型就像一位初级同事。它们需要明确的指令才能产出最佳的具体输出。

有关使用推理模型时最佳实践的更多信息， [请参阅本指南](https://developers.openai.com/api/docs/guides/reasoning-best-practices).

## 下一步

现在你已经了解了文本输入和输出的基础知识，接下来可以查看以下资源。

[在 Playground 中构建提示词



      Use the Playground to develop and iterate on prompts.](https://platform.openai.com/chat/edit)

[使用结构化输出生成 JSON 数据



      Ensure JSON data emitted from a model conforms to a JSON schema.](https://developers.openai.com/api/docs/guides/structured-outputs)

[完整的 API 参考文档



      Check out all the options for text generation in the API reference.](https://developers.openai.com/api/reference/resources/responses)

## 其他资源

如需更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook)，其中包含示例代码，还链接了以下第三方资源：

- [提示库与工具](https://developers.openai.com/cookbook/articles/related_resources#prompting-libraries--tools)
- [提示指南](https://developers.openai.com/cookbook/articles/related_resources#prompting-guides)
- [视频课程](https://developers.openai.com/cookbook/articles/related_resources#video-courses)
- [关于改进推理的高级提示论文](https://developers.openai.com/cookbook/articles/related_resources#papers-on-advanced-prompting-to-improve-reasoning)