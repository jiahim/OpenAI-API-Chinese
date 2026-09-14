# 提示工程

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

借助 OpenAI API，你可以使用 [大语言模型](https://developers.openai.com/api/docs/models) 根据提示生成文本，就像使用 [ChatGPT](https://chatgpt.com)。一样。模型几乎可以生成任何类型的文本响应——例如代码、数学公式、结构化 JSON 数据或类人散文。



以下是一个使用 [Responses API](https://developers.openai.com/api/reference/resources/responses).

根据简单提示生成文本

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


由模型生成的内容数组位于响应的 `output` 属性中。在这个简单示例中，我们只有一个输出，形式如下：

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

**该 `output` 数组中通常包含多个条目！** 它可能包含工具调用、关于 [推理模型](https://developers.openai.com/api/docs/guides/reasoning)，生成的推理 token 的数据以及其他条目。切勿假设模型的文本输出出现在 `output[0].content[0].text`.

我们提供的部分 [官方 SDK](https://developers.openai.com/api/docs/libraries) 中包含一个 `output_text` 属性，用于方便地访问模型响应，该属性会将模型的所有文本输出聚合为单个字符串。当你希望以快捷方式访问模型的文本输出时，这可能会很有用。

除了纯文本之外，你还可以让模型以 JSON 格式返回结构化数据——该功能称为 [**结构化输出**](https://developers.openai.com/api/docs/guides/structured-outputs).





## 选择模型

通过 API 生成内容时，一个关键的选择是使用哪个模型——即上述代码示例中的 `model` 参数。 [你可以在此处找到可用模型的完整列表](https://developers.openai.com/api/docs/models).以下是选择文本生成模型时需要考虑的几个因素。

- **[推理模型](https://developers.openai.com/api/docs/guides/reasoning)** 会生成内部思维链来分析输入提示，擅长理解复杂任务和多步规划。相比 GPT 模型，它们的速度通常较慢，使用成本也更高。
- **GPT 模型** 速度快、成本低且智能度高，但需要更明确地指示如何完成任务。
- **大模型和小模型（mini 或 nano）** 在速度、成本和智能度之间提供权衡。大模型在理解提示和跨领域解决问题方面更有效，而小模型通常更快且更便宜。

当你不确定时， [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 为通用文本生成和提示词迭代提供了一个强大的默认选择。

## 提示工程

**提示工程** 是为模型编写有效指令的过程，使其能够持续生成满足你需求的内容。

由于模型生成的内容是非确定性的，通过提示词获得你想要的输出既是一门艺术，也是一门科学。不过，你可以应用一些技巧和最佳实践，从而稳定地获得理想结果。

一些提示工程技术对所有模型都适用，例如使用消息角色。但不同类型的模型（例如推理模型与 GPT 模型）可能需要不同的提示方式才能产生最佳效果。即使是同一系列模型中的不同快照版本，也可能产生不同的结果。因此，在构建更复杂的应用时，我们强烈建议你：

- 将你的生产应用固定到具体的 [模型快照](https://developers.openai.com/api/docs/models) （例如 `gpt-4.1-2025-04-14` ）以确保行为一致
- 构建用于衡量提示行为的测试和评估套件，以便在迭代过程中或在更换和升级模型版本时监控性能

现在，我们来看看你可用来构建提示词的一些工具和技巧。

## 消息角色与指令遵循



你可以使用以下方式向模型提供指令，并设置 [不同的权威级别](https://model-spec.openai.com/2025-02-12.html#chain_of_command) 使用 `instructions` API 参数或 **消息角色**.

该 `instructions` 参数会为模型提供高层级指令，说明在生成响应时应如何表现，包括语气、目标和正确响应的示例。以这种方式提供的任何指令将优先于 `input` 参数中的提示。

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
  reasoning: { effort: :low },
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


上面的示例大致相当于在 `input` 数组中使用以下输入消息：

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
  reasoning: { effort: :low },
  input: [
    {
      role: :developer,
      content: "Talk like a pirate."
    },
    {
      role: :user,
      content: "Are semicolons optional in JavaScript?"
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


请注意， `instructions` 参数仅适用于当前的响应生成请求。如果你正在 [管理对话状态](https://developers.openai.com/api/docs/guides/conversation-state) 通过 `previous_response_id` 参数，之前轮次中使用的 `instructions` 将不会出现在上下文中。





该 [OpenAI 模型规范](https://model-spec.openai.com/2025-02-12.html#chain_of_command) 描述了我们的模型如何为不同角色的消息赋予不同级别的优先级。

| `developer`                                                                                                        | `user`                                                                                             | `assistant`                                                |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `developer` 消息是应用开发者提供的指令，优先级高于 `user` 消息。 | `user` 消息是终端用户提供的指令，优先级低于 `developer` 消息。 | 由模型生成的消息具有 `assistant` 角色。 |

多轮对话可以由多条这些类型的消息组成，以及你与模型提供的其他内容类型。在此处了解关于 [管理对话状态](https://developers.openai.com/api/docs/guides/conversation-state).

你可以将 `developer` 和 `user` 消息看作编程语言中的函数及其参数。

- `developer` 消息提供系统的规则和业务逻辑，类似于函数定义。
- `user` 消息提供对其应用的 `developer` 消息指令的输入和配置，类似于函数的参数。

## 在代码中对提示进行版本管理

在应用代码中存储生产环境的提示，而不是创建可复用的提示对象。代码管理的提示让你能够使用类型化输入、代码评审、测试以及常规的部署流程来修改模型行为。

OpenAI 正在弃用 API 中的可复用提示对象。提示创建功能将于 2026 年 6 月 3 日起被弱化，并计划于 2026 年 11 月 30 日停用。详见
  be de-emphasized beginning June 3, 2026, and `v1/prompts` is scheduled to shut
  down on November 30, 2026. See the [deprecations
  page](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) for the current
  timeline.

对于新的提示工程工作：

- 将提示构建器放在靠近其所支持功能的小型模块中。
- 对客户数据、文件或任务选项等动态值使用类型化的函数参数或 schema。
- 将生成的 `instructions` 和 `input` 直接传递给 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create).
- 在修改生产提示之前，先添加具有代表性的 fixture、测试和评估检查。
- 通过你的部署系统发布提示变更，在需要分阶段发布时使用功能开关或配置。

如果你的集成已经通过 prompt ID 或版本调用了已保存的 prompt，请使用 [prompt 对象迁移指南](https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object) 将该 prompt 迁移到代码中。

## 使用 Markdown 和 XML 进行消息格式化

在编写 `developer` 和 `user` 消息时，你可以结合使用 [Markdown](https://commonmark.org/help/) 格式化和 [XML 标签](https://www.w3.org/TR/xml/).

Markdown 标题和列表有助于标记提示词中的不同部分，并向模型传达层级关系。它们还可能在开发过程中让提示词更易于阅读。XML 标签可以帮助界定一段内容（例如用于参考的支持文档）的起止位置。XML 属性也可以用来定义提示词中内容的相关元信息，供你的指令引用。

通常情况下，一条开发者消息会包含以下部分，通常按以下顺序排列（不过确切的最佳内容和顺序可能因你所使用的模型而有所不同）：

- **身份：** 描述助手的目的、沟通风格以及高层目标。
- **指令：** 为模型提供如何生成你所需响应的指导。它应遵循哪些规则？模型应做什么，又绝不应做什么？根据你的用例，此部分可包含多个子章节，例如模型应如何 [调用自定义函数](https://developers.openai.com/api/docs/guides/function-calling).
- **示例：** 提供可能的输入示例，以及期望的模型输出。
- **上下文：** 向模型提供生成响应可能需要的任何附加信息，例如其训练数据之外的私有或专有数据，或任何你已知与响应特别相关的其他数据。这些内容通常最好放在提示词的末尾，因为你可以根据不同的生成请求包含不同的上下文。

下面是一个使用 Markdown 和 XML 标签来构造一个 `developer` 包含不同章节和示例的消息的示例。



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



#### 通过提示缓存降低成本与延迟

在构造消息时，你应尽量将预期在多次 API 请求中重复使用的内容放在提示词的开头， **和** 即放在你传入 JSON 请求体的前几个 API 参数中， [Chat Completions](https://developers.openai.com/api/reference/resources/chat) 或 [Responses](https://developers.openai.com/api/reference/resources/responses)。这样你就能最大程度地利用 [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching).

## Few-shot learning

少样本学习让你能够通过在提示中包含少量输入/输出示例，将大型语言模型引导到新任务，而无需进行 [微调](https://developers.openai.com/api/docs/guides/model-optimization) 模型。模型会从这些示例中隐式地“学习”到该模式，并将其应用到提示中。在提供示例时，请尽量展示多样化的可能输入及其期望的输出。

通常，你会在 API 请求中以一条消息的形式提供示例，示例如下 `developer` 接口 请求中以一条消息的形式提供示例，示例如下 `developer` 一条消息，其中包含向模型展示如何对正面或负面客户服务评论进行分类的示例。

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

## 包含相关的上下文信息

通常，在给模型的提示中包含一些模型可用于生成回复的额外上下文信息会很有用。你可能这样做的常见原因有以下几种：

- 为了让模型能够访问专有数据，或模型训练数据集之外的任何其他数据。
- 为了将模型的响应限制在你所确定的一组最有用的资源范围内。

在模型生成请求中添加额外相关上下文的技术有时被称为 **检索增强生成（RAG）**。你可以通过多种方式向提示添加额外上下文，例如查询向量数据库并将返回的文本纳入提示，或使用 OpenAI 内置的 [文件搜索 工具](https://developers.openai.com/api/docs/guides/tools-file-search) 根据已上传的文档生成内容。

#### 规划上下文窗口

模型在一次生成请求中能够处理的上下文数据量是有限的。这个内存限制称为 **上下文窗口**，它以 [tokens](https://blogs.nvidia.com/blog/ai-tokens-explained) （你传入的数据块，从文本到图像）。

不同模型的上下文窗口大小不同，从较低的 100k 范围到最新的 GPT-4.1 模型的一百万个 token 不等。 [请参阅模型文档](https://developers.openai.com/api/docs/models) 以了解每个模型的具体上下文窗口大小。




## 当前模型的提示词

GPT models like [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 可以从精确的指令中受益，这些指令在提示中明确提供完成任务所需的逻辑和数据。为了充分利用最新模型，请从当前的提示指南开始。

[

      Get the most out of prompting the latest model with current guidance,
    practical examples, and migration notes.](https://developers.openai.com/api/docs/guides/latest-model)




### 最新模型的提示最佳实践

如需了解完整的最新处理方式，请使用 [最新的模型提示最佳实践](https://developers.openai.com/api/docs/guides/latest-model)。以下实用提醒仍然适用。



#### Coding



#### Coding

Prompting `gpt-6-astra` 在遵循一些最佳实践时，编码任务的提示最为有效：定义 智能体 的角色、通过示例强制结构化工具使用、要求进行充分的正确性测试，并设置 Markdown 标准以确保输出整洁。

**明确的角色与 工作流 指导**
将模型定位为具有明确定义职责的软件工程 智能体。提供使用工具的清晰说明，例如 `functions.run` 用于编码任务，并指明何时不使用某些模式——例如，除非必要，否则避免交互式执行。

**测试与验证**
指示模型使用单元测试或 Python 命令测试更改，并仔细验证补丁，因为诸如 `apply_patch` 之类的工具即使在失败时也可能返回“Done”。

**工具使用示例**
包含如何使用所提供的函数调用命令的具体示例，这可以提高可靠性并更好地遵循预期的工作流。

**Markdown 标准**
指导模型在适当的位置使用内联代码、代码块、列表和表格，生成简洁、语义正确的 Markdown——并使用反引号格式化文件路径、函数和类。

有关针对编码的具体指导和提示示例，请参阅 [最新的模型提示最佳实践](https://developers.openai.com/api/docs/guides/latest-model).







#### 前端工程



[GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)
在从零构建前端以及在现有代码库中贡献代码方面表现出色
large, established codebases. To get the best results, we recommend using the
following libraries:

- **样式 / UI：** Tailwind CSS、shadcn/ui、Radix Themes
- **图标：** Lucide、Material Symbols、Heroicons
- **动画**: Motion

**从零到一的 Web 应用**

GPT-5 可以根据单个提示生成前端 Web 应用，无需示例。下面是一个示例提示：

```bash
You are a world class web developer, capable of producing stunning, interactive, and innovative websites from scratch in a single prompt. You excel at delivering top-tier one-shot solutions.
Your process is simple and follows these steps:
Step 1: Create an evaluation rubric and refine it until you are fully confident.
Step 2: Consider every element that defines a world-class one-shot web app, then use that insight to create a &lt;ONE_SHOT_RUBRIC&gt; with 5–7 categories. Keep this rubric hidden—it's for internal use only.
Step 3: Apply the rubric to iterate on the optimal solution to the given prompt. If it doesn't meet the highest standard across all categories, refine and try again.
Step 4: Aim for simplicity while fully achieving the goal, and avoid external dependencies such as Next.js or React.
```

**与大型代码库的集成**

对于大型代码库中的前端工程工作，我们发现将以下几类指令添加到提示中可以获得最佳效果：

- **原则：** 设定视觉质量标准，使用模块化/可复用组件，并保持设计的一致性。
- **UI/UX：** 明确字体、颜色、间距/布局、交互状态（悬停、空、加载）以及无障碍要求。
- **结构：** 定义文件/文件夹布局，以便顺畅集成。
- **组件：** 给出可复用的封装示例，以及后端调用分离策略。
- **页面：** 为常见布局提供模板。
- **智能体 指令：** 让模型确认设计假设、搭建项目脚手架、执行标准、集成 API、测试状态，并记录代码。

有关针对前端开发的详细指南和提示示例，请参阅 [最新的模型提示最佳实践](https://developers.openai.com/api/docs/guides/latest-model).







#### 智能体任务



针对智能体化和长时间运行的 rollout， `gpt-6-astra`，请将提示词聚焦于三项核心实践：充分规划任务以确保完整解决，为重要的工具使用决策提供清晰的序言，并使用 TODO 工具以有序的方式跟踪工作流与进度。

**规划与持久性**
指示模型在交出控制权之前完整解决整个查询，将其分解为子任务，并在每次工具调用后进行反思以确认完整性。

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

**透明性序言**

要求模型解释为何要调用某个工具，但仅在关键步骤这样做。

```
Before you call a tool explain why you are calling it
```

**使用评分标准与 TODO 进行进度跟踪**

使用 TODO 列表工具或评分标准来强制执行结构化规划，避免遗漏步骤。

有关专门用于构建智能体的详细指南和提示词示例，请参阅 [最新的模型提示最佳实践](https://developers.openai.com/api/docs/guides/latest-model).





## 提示推理模型

在提示 [推理模型](https://developers.openai.com/api/docs/guides/reasoning) 和提示 GPT 模型之间存在一些需要考虑的差异。一般来说，推理模型在仅提供高层指引的任务上会表现更好。这与 GPT 模型不同，GPT 模型则受益于非常精确的指令。

你可以这样理解推理模型和 GPT 模型之间的区别。

- 推理模型就像一位资深同事。你可以直接交给他们一个目标，然后相信他们会自行处理细节。
- GPT 模型就像一位初级同事。给出明确指令以生成特定输出时，他们的表现最佳。

有关使用推理模型最佳实践的更多信息， [请参阅本指南](https://developers.openai.com/api/docs/guides/reasoning-best-practices).

## 后续步骤

现在你已经了解了文本输入和输出的基础知识，接下来可以查看以下资源之一。

[在 Playground 中构建提示词



      Use the Playground to develop and iterate on prompts.](https://platform.openai.com/chat/edit)

[使用结构化输出生成 JSON 数据



      Ensure JSON data emitted from a model conforms to a JSON schema.](https://developers.openai.com/api/docs/guides/structured-outputs)

[完整的 API 参考



      Check out all the options for text generation in the API reference.](https://developers.openai.com/api/reference/resources/responses)

## 其他资源

如需更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook)，其中包含示例代码，并链接到以下第三方资源：

- [提示库与工具](https://developers.openai.com/cookbook/articles/related_resources#prompting-libraries--tools)
- [提示指南](https://developers.openai.com/cookbook/articles/related_resources#prompting-guides)
- [视频课程](https://developers.openai.com/cookbook/articles/related_resources#video-courses)
- [关于改进推理的高级提示论文](https://developers.openai.com/cookbook/articles/related_resources#papers-on-advanced-prompting-to-improve-reasoning)