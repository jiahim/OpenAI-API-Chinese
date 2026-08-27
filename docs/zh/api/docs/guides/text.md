# 文本生成

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过向页面 URL 追加 `.md` 可获取文档页面的 Markdown 版本。

使用 OpenAI API，你可以使用 [大型语言模型](https://developers.openai.com/api/docs/models) 根据提示生成文本，就像你使用 [ChatGPT](https://chatgpt.com)。一样。模型可以生成几乎任何类型的文本响应——如代码、数学方程、结构化 JSON 数据或类人散文。

对于此类文本生成调用等直接模型请求，请使用 [Responses API](https://developers.openai.com/api/reference/resources/responses) 。

从简单提示生成文本

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


响应中的 `output` 属性包含模型生成的内容数组。在这个简单示例中，我们只有一个输出，如下所示：

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

**该 `output` 数组通常包含多个项目！** 它可能包含工具调用、关于 [推理模型](https://developers.openai.com/api/docs/guides/reasoning)，生成的推理令牌数据，以及其他项目。假设模型的文本输出位于 `output[0].content[0].text`.

我们的一些 [官方 SDK](https://developers.openai.com/api/docs/libraries) 包含一个 `output_text` 属性，用于便捷地将模型的所有文本输出聚合为单个字符串。这可以作为访问模型文本输出的快捷方式。

除了纯文本外，你还可以让模型以 JSON 格式返回结构化数据——此功能称为 [**结构化输出**](https://developers.openai.com/api/docs/guides/structured-outputs).

## 提示词工程

**提示词工程** 是为模型编写有效指令的过程，使其能持续生成满足你需求的内容。

由于模型生成的内容具有非确定性，通过提示词获得预期输出既是艺术也是科学。不过，你可以运用技巧和最佳实践，持续获得良好结果。

某些提示词工程技术适用于所有模型，例如使用消息角色。但不同模型可能需要不同的提示方式才能产生最佳结果。即便是同一系列中不同快照的模型，也可能产生不同结果。因此，随着你构建更复杂的应用，我们强烈建议：

- 将你的生产应用固定到特定 [模型快照](https://developers.openai.com/api/docs/models) （例如 `gpt-5.5-2026-04-23` ）以确保行为一致
- 构建测试和评估套件，以测量提示行为，以便你在迭代或更改和升级模型版本时监控性能

现在，让我们看看可用于构建提示词的一些工具和技巧。

## 选择模型与API

OpenAI 有许多不同的 [模型](https://developers.openai.com/api/docs/models) 以及几个可选的 API。 [推理模型](https://developers.openai.com/api/docs/guides/reasoning)，例如 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol)，与聊天模型行为不同，对不同的提示反应也更好。一个重要注意事项是，推理模型在与 Responses API 一起使用时表现更好，并展现出更高的智能。

如果你正在构建任何文本生成应用，我们建议使用 Responses API 而不是较旧的 Chat Completions API。而如果你使用推理模型，特别有助于 [迁移到 Responses](https://developers.openai.com/api/docs/guides/migrate-to-responses).

## 消息角色与指令遵循

你可以通过 [不同级别的权限](https://model-spec.openai.com/2025-02-12.html#chain_of_command) 使用 `instructions` API 参数以及 **消息角色**.

该 `instructions` 向模型提供指令。该参数为模型提供生成响应时如何表现的高级指令，包括语气、目标以及正确响应的示例。以此方式提供的任何指令将优先于 `input` 参数中的提示。

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


请注意， `instructions` 参数仅适用于当前响应生成请求。如果你正在 [管理会话状态](https://developers.openai.com/api/docs/guides/conversation-state) 通过 `previous_response_id` 参数，则 `instructions` 在之前轮次中使用的将不会出现在上下文中。

该 [OpenAI 模型规范](https://model-spec.openai.com/2025-02-12.html#chain_of_command) 描述了我们的模型如何对不同角色的消息给予不同级别的优先级。

<table>
  <thead>
    <tr>
      <th>developer</th>
      <th>user</th>
      <th>assistant</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        `developer` messages are instructions provided by the application
        developer, prioritized ahead of user messages.
      </td>
      <td>
        `user` messages are instructions provided by an end user, prioritized
        behind developer messages.
      </td>
      <td>
        Messages generated by the model have the `assistant` role.
      </td>
    </tr>
  </tbody>
</table>

多轮对话可能包含多个此类消息，以及你和模型提供的其他内容类型。了解更多关于 [在此处管理对话状态](https://developers.openai.com/api/docs/guides/conversation-state).

你可以将 `developer` 和 `user` 视为编程语言中的函数及其参数。

- `developer` 消息提供系统的规则和业务逻辑，类似于函数定义。
- `user` 消息提供输入和配置， `developer` 消息指令将应用于这些输入和配置，类似于函数的参数。

## 在代码中版本化提示词

将生产环境提示词存储在应用程序代码中，而不是创建可重复使用的提示词对象。由代码管理的提示词让你能够使用类型化输入、代码审查、测试以及常规部署流程来改变模型行为。

OpenAI 正在弃用API中的可重复使用提示词对象。提示词创建将
  于2026年6月3日起逐步取消重点支持，并 `v1/prompts` 计划于2026年11月30日
  关闭。请参阅 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) 了解当前
  时间线。

对于新的文本生成工作：

- 将提示词构建器放在其支持的功能附近的小模块中。
- 对动态值（如客户数据、文件或任务选项）使用类型化函数参数或模式。
- 将生成的 `instructions` 和 `input` 直接传递给 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create).
- 在更改生产提示词之前，添加具有代表性的固定测试数据和评估检查。
- 通过部署系统推出提示词更改，在需要分阶段发布时使用功能标记或配置。

如果你的集成已经通过提示词 ID 或版本来调用已保存的提示词，请使用 [提示词对象迁移指南](https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object) 将该提示词移至代码中。

## 后续步骤

现在你已经了解了文本输入和输出的基础知识，接下来可以查看以下资源之一。

[在 Playground 中构建提示



      Use the Playground to develop and iterate on prompts.](https://platform.openai.com/chat/edit)

[使用结构化输出生成 JSON 数据



      Ensure JSON data emitted from a model conforms to a JSON schema.](https://developers.openai.com/api/docs/guides/structured-outputs)

[完整 API 参考



      Check out all the options for text generation in the API reference.](https://developers.openai.com/api/reference/resources/responses)