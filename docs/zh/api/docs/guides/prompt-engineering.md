# 提示工程

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

使用 OpenAI API，你可以 [大型语言模型](https://developers.openai.com/api/docs/models) 根据提示生成文本，就像你使用 [ChatGPT](https://chatgpt.com)。一样。模型可以生成几乎任何类型的文本响应——如代码、数学方程式、结构化 JSON 数据或类似人类的散文。



以下是一个使用 [Responses API](https://developers.openai.com/api/reference/resources/responses).

的简单示例。

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


模型生成的内容数组位于响应的 `output` 属性中。在这个简单示例中，我们只有一个输出，看起来像这样：

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

**该 `output` 数组通常包含多个项目！** 它可以包含工具调用、由 [推理模型](https://developers.openai.com/api/docs/guides/reasoning)，生成的推理 token 数据以及其他项目。不能假设模型的文本输出一定位于 `output[0].content[0].text`.

我们的一些 [官方 SDK](https://developers.openai.com/api/docs/libraries) 包含一个 `output_text` 模型响应上的属性，方便起见，它聚合模型的所有文本输出为一个字符串。这可能有助于快速访问模型的文本输出。

除了纯文本，你还可以让模型返回 JSON 格式的结构化数据——此功能称为 [**结构化输出**](https://developers.openai.com/api/docs/guides/structured-outputs).





## 选择模型

通过 API 生成内容时，一个关键的选择是使用哪个模型 - `model` 上述代码示例中的参数。 [你可以在这里找到可用模型的完整列表](https://developers.openai.com/api/docs/models)。以下是选择用于文本生成的模型时需要考虑的几个因素。

- **[推理模型](https://developers.openai.com/api/docs/guides/reasoning)** 生成内部思维链来分析输入提示，擅长理解复杂任务和多步规划。它们通常也比 GPT 模型使用起来更慢、成本更高。
- **GPT 模型** 快速、成本效益高且高度智能，但受益于关于如何完成任务更明确的指示。
- **大型和中小型（mini 或 nano）模型** 提供速度、成本和智能之间的权衡。大型模型在理解提示和跨领域解决问题方面更有效，而小型模型通常使用起来更快、更便宜。

如有疑问时， [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 为通用文本生成和提示迭代提供强大的默认选择。

## 提示工程

**提示词工程** 是撰写有效模型指令的过程，通过这种方式让模型持续生成符合你要求的内容。

由于模型生成的内容具有不确定性，通过提示词来获得理想输出既是一门艺术，也是一门科学。不过，你可以应用一些技巧和最佳实践来持续获得良好结果。

有些提示词工程技巧适用于所有模型，比如使用消息角色。但不同类型的模型（如推理模型与GPT模型）可能需要不同的提示方式才能产生最佳结果。即使是同一模型家族中的不同快照也可能产生不同的结果。因此，在构建更复杂的应用时，我们强烈建议：

- 将你的生产应用程序固定到特定的 [模型快照](https://developers.openai.com/api/docs/models) （如 `gpt-4.1-2025-04-14` 等）以确保行为一致
- 构建测试和评估套件，以衡量提示行为，使你在迭代或更改和升级模型版本时能够监控性能

现在，让我们考察一些可用于构建提示词的工具和技术。

## 消息角色与指令遵循



你可以通过以下方式向模型提供指令： [不同级别的权限](https://model-spec.openai.com/2025-02-12.html#chain_of_command) 使用 `instructions` API 参数或 **消息角色**.

该 `instructions` 参数为模型提供高层级指令，指导其在生成响应时应如何表现，包括语气、目标以及正确响应的示例。通过这种方式提供的任何指令都将优先于 `input` 参数中的提示。

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


上述示例大致等同于在 `input` 数组中使用以下输入消息：

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


请注意， `instructions` 参数仅适用于当前响应生成请求。如果你正在 [管理对话状态](https://developers.openai.com/api/docs/guides/conversation-state) 使用 `previous_response_id` 参数，则 `instructions` 在之前轮次中使用的将不会出现在上下文中。





该 [OpenAI 模型规范](https://model-spec.openai.com/2025-02-12.html#chain_of_command) 描述了我们的模型如何对不同角色的消息给予不同的优先级。

| `developer`                                                                                                        | `user`                                                                                             | `assistant`                                                |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `developer` 消息是由应用程序开发者提供的指令，优先级排在 `user` 消息之前。 | `user` 消息是由最终用户提供的指令，优先级排在 `developer` 消息之后。 | 模型生成的消息具有 `assistant` 角色。 |

多轮对话可以包含这些类型的多条消息，以及由你和模型提供的其他内容类型。了解有关 [在此处管理对话状态](https://developers.openai.com/api/docs/guides/conversation-state).

你可以将 `developer` 和 `user` 消息视为编程语言中的函数及其参数。

- `developer` 消息提供了系统的规则和业务逻辑，类似于函数定义。
- `user` 消息提供了输入和配置，这些 `developer` 消息指令将应用于此，类似于函数的参数。

## 代码中的版本提示

将生产提示词存储在你的应用程序代码中，而不是创建可复用的提示词对象。由代码管理的提示词让你可以使用类型化输入、代码审查、测试以及正常的部署流程来改变模型行为。

OpenAI 正在弃用 API 中的可复用提示词对象。提示词创建将
  自 2026 年 6 月 3 日起弱化， `v1/prompts` 并计划于
  2026 年 11 月 30 日关闭。请参阅 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) 以查看当前
  时间线。

对于新的提示工程工作：

- 将提示词构建器放在其所支持功能附近的小模块中。
- 对于动态值（如客户数据、文件或任务选项），使用类型化的函数参数或模式。
- 将生成的 `instructions` 和 `input` 直接传递到 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create).
- 在更改生产提示词之前，添加代表性的固定样本、测试和评估检查。
- 通过你的部署系统推出提示词更改，在需要分阶段发布时使用功能标志或配置。

如果你的集成已经通过提示词 ID 或版本调用保存的提示词，请使用 [提示词对象迁移指南](https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object) 将该提示词迁移到代码中。

## 使用 Markdown 和 XML 进行消息格式化

当编写 `developer` 和 `user` 消息时，你可以通过组合使用 [Markdown](https://commonmark.org/help/) 格式和 [XML 标签](https://www.w3.org/TR/xml/).

来帮助模型理解提示词和上下文数据的逻辑边界。Markdown 标题和列表有助于标记提示词的不同部分，并向模型传达层级结构。它们也可能在开发过程中让你的提示词更易读。XML 标签可以帮助界定一段内容（如用于参考的支持文档）的起始和结束。XML 属性也可用于定义提示词中内容的元数据，供你的指令引用。

通常，开发者消息将包含以下部分，一般按此顺序排列（不过具体的最佳内容和顺序可能因你使用的模型而异）：

- **身份：** 描述助手的用途、沟通风格和总体目标。
- **指令：** 为模型提供指导，说明如何生成你想要的响应。它应该遵循哪些规则？模型应该做什么，以及绝对不应该做什么？本节可根据你的用例包含许多相关子部分，例如模型应如何 [调用自定义函数](https://developers.openai.com/api/docs/guides/function-calling).
- **示例：** 提供可能输入的示例，以及来自模型的期望输出。
- **上下文：** 为模型提供生成响应所需的任何额外信息，例如训练数据之外的私有/专有数据，或你知道将特别相关的任何其他数据。此内容通常最好放在提示词的末尾附近，因为你可能为不同的生成请求包含不同的上下文。

以下是使用 Markdown 和 XML 标签构建 `developer` 包含不同部分及相应示例的消息。



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



#### 通过提示词缓存降低成本与延迟

在构造消息时，你应该尽量将你期望在API请求中反复使用的内容放在提示词的开头， **并** 放在你在JSON请求体中传给API的最早的 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) 或 [Responses](https://developers.openai.com/api/reference/resources/responses)。参数之中。这样你可以最大限度地利用 [提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching).

## 少样本学习

少样本学习让你通过在提示中提供少量输入/输出示例来引导大型语言模型完成新任务，而不是 [微调](https://developers.openai.com/api/docs/guides/model-optimization) 模型。模型会隐含地"领会"这些示例中的模式并将其应用于提示。提供示例时，尽量展示具有期望输出的多样化输入范围。

通常，你会在 `developer` API请求中提供消息部分的示例。以下是一个示例 `developer` 消息包含示例，展示模型如何对正面或负面客户服务评价进行分类。

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

在向模型提供的提示词中加入额外的上下文信息供其用于生成响应，通常很有用。你可能出于以下几个常见原因这样做：

- 为了让模型能够访问专有数据，或模型训练数据集之外的任何其他数据。
- 为了将模型的响应限制在你已确定将最为有益的一组特定资源上。

向模型生成请求添加额外相关上下文的技术有时被称为 **检索增强生成（RAG）**。你可以通过多种方式向提示中添加额外上下文，例如查询向量数据库并将返回的文本纳入提示中，或使用OpenAI内置的 [文件搜索工具](https://developers.openai.com/api/docs/guides/tools-file-search) 来根据上传的文档生成内容。

#### 规划上下文窗口

模型在一次生成请求中只能在其所考虑的背景内处理这么多数据。这个记忆限制被称为 **上下文窗口**，其定义基于 [令牌](https://blogs.nvidia.com/blog/ai-tokens-explained) （你传入的数据块，从文本到图像）。

模型有不同的上下文窗口大小，从低至10万级别到最新的GPT-4.1模型支持的一百万个令牌。 [请参阅模型文档](https://developers.openai.com/api/docs/models) 以了解每个模型的具体上下文窗口大小。

## 提示当前 GPT-5 系列模型

类似 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 的GPT模型受益于精确的指令，这些指令在提示中明确提供了完成任务所需的逻辑和数据。为了充分利用最新的GPT-5系列模型，请从当前的提示指南开始。

[

      Get the most out of prompting the latest GPT-5 series model with current
    guidance, practical examples, and migration notes.](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)

### 最新 GPT-5 系列模型的提示词最佳实践

如需了解当前完整的最佳实践，请参阅 [最新的 GPT-5 提示词最佳实践](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices)。以下实用提醒仍然适用。

编码

#### 编程

提示 `gpt-5.6` 在编码任务中，遵循一些最佳实践最为有效：定义智能体的角色，通过示例强制执行结构化工具使用，要求进行全面测试以确保正确性，并设定 Markdown 标准以产出整洁的输出。

**明确角色与工作流指导**
将模型视为具有明确定义职责的软件工程智能体。提供使用工具的清晰说明，例如 `functions.run` 用于编码任务，并指定何时不应使用某些模式——例如，除非必要，否则避免交互式执行。

**测试与验证**
指示模型使用单元测试或 Python 命令测试更改，并仔细验证补丁，因为工具如 `apply_patch` 即使在失败时也可能返回“完成”。

**工具使用示例**
包含如何使用提供函数调用命令的具体示例，这提高了可靠性并确保遵循预期工作流。

**Markdown 标准**
指导模型生成整洁、语义正确的 markdown，在适当的情况下使用内联代码、代码围栏、列表和表格——并使用反引号格式化文件路径、函数和类。

有关编码的详细指导和提示示例，请参阅 [最新的 GPT-5 提示最佳实践](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices).

前端工程

[GPT-5.6](https://developers.openai.com/api/docs/models/gpt-5.6-sol)
在从头构建前端以及为
大型、成熟的代码库做出贡献方面表现出色。为获得最佳效果，我们建议使用
以下库：

- **样式 / UI：** Tailwind CSS、shadcn/ui、Radix Themes
- **图标：** Lucide、Material Symbols、Heroicons
- **动画**：Motion

**零到一的 Web 应用**

GPT-5 可以通过单个提示生成前端 Web 应用，无需示例。以下是示例提示：

```bash
You are a world class web developer, capable of producing stunning, interactive, and innovative websites from scratch in a single prompt. You excel at delivering top-tier one-shot solutions.
Your process is simple and follows these steps:
Step 1: Create an evaluation rubric and refine it until you are fully confident.
Step 2: Consider every element that defines a world-class one-shot web app, then use that insight to create a &lt;ONE_SHOT_RUBRIC&gt; with 5–7 categories. Keep this rubric hidden—it's for internal use only.
Step 3: Apply the rubric to iterate on the optimal solution to the given prompt. If it doesn't meet the highest standard across all categories, refine and try again.
Step 4: Aim for simplicity while fully achieving the goal, and avoid external dependencies such as Next.js or React.
```

**与大型代码库集成**

对于大型代码库中的前端工程工作，我们发现向提示中添加这些类别的指令会带来最佳结果：

- **原则：** 设定视觉质量标准，使用模块化/可复用组件，并保持设计一致性。
- **UI/UX：** 指定排版、颜色、间距/布局、交互状态（悬停、空、加载）以及可访问性。
- **结构：** 定义文件/文件夹布局，以便无缝集成。
- **组件：** 提供可复用包装示例和后端调用分离策略。
- **页面：** 提供常见布局的模板。
- **智能体 指令：** 要求模型确认设计假设、搭建项目脚手架、执行标准、集成 API、测试状态，并记录代码。

有关前端开发的具体指导和提示示例，请参阅 [最新的 GPT-5 提示最佳实践](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices).

智能体任务

对于使用 `gpt-5.6`，的智能体和长期运行场景，请将提示重点放在三个核心实践上：彻底规划任务以确保完整解决，为主要工具使用决策提供清晰的前言，并使用 TODO 工具以有条理的方式跟踪工作流和进度。

**规划与持久性**
指示模型在交出控制权之前解决完整查询，将其分解为子任务，并在每次工具调用后反思以确认完整性。

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

**透明性前言**

要求模型解释为何调用工具，但仅在关键步骤时。

```
Before you call a tool explain why you are calling it
```

**使用评分标准和 TODO 跟踪进度**

使用 TODO 列表工具或评分标准来强制结构化规划并避免遗漏步骤。

有关构建智能体的具体指导和提示示例，请参阅 [最新的 GPT-5 提示最佳实践](https://developers.openai.com/api/docs/guides/latest-model#prompting-best-practices).

## 提示推理模型

在提示 [推理模型](https://developers.openai.com/api/docs/guides/reasoning) 与提示 GPT 模型时，有一些差异需要考虑。一般来说，推理模型在仅需高层级指导的任务上会提供更好的结果。这与 GPT 模型不同，GPT 模型受益于非常精确的指令。

你可以这样理解推理模型与 GPT 模型之间的区别。

- 推理模型就像一位资深同事。你可以设定一个目标交给他们，并信任他们能自行处理细节。
- GPT 模型则像一位初级同事。他们最适合在明确的指令下生成特定的输出。

关于使用推理模型时的最佳实践，更多信息请， [参阅本指南](https://developers.openai.com/api/docs/guides/reasoning-best-practices).

## 后续步骤

现在你已经了解了文本输入和输出的基础知识，接下来可以查看以下资源之一。

[在 Playground 中构建提示词



      Use the Playground to develop and iterate on prompts.](https://platform.openai.com/chat/edit)

[使用结构化输出生成 JSON 数据



      Ensure JSON data emitted from a model conforms to a JSON schema.](https://developers.openai.com/api/docs/guides/structured-outputs)

[完整的 API 参考



      Check out all the options for text generation in the API reference.](https://developers.openai.com/api/reference/resources/responses)

## 其他资源

如需更多灵感，请访问 [OpenAI Cookbook](https://developers.openai.com/cookbook)，其中包含示例代码，还链接到第三方资源，例如：

- [提示词库与工具](https://developers.openai.com/cookbook/articles/related_resources#prompting-libraries--tools)
- [提示词指南](https://developers.openai.com/cookbook/articles/related_resources#prompting-guides)
- [视频课程](https://developers.openai.com/cookbook/articles/related_resources#video-courses)
- [关于高级提示词以提升推理能力的论文](https://developers.openai.com/cookbook/articles/related_resources#papers-on-advanced-prompting-to-improve-reasoning)