# Text generation

> 完整文档索引请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

通过 OpenAI API，你可以使用 [大语言模型](https://developers.openai.com/api/docs/models) 根据提示词生成文本，就像使用 [ChatGPT](https://chatgpt.com)。一样。模型可以生成几乎任何类型的文本回复——例如代码、数学公式、结构化的 JSON 数据，或类人风格的散文。

请使用 [Responses API](https://developers.openai.com/api/reference/resources/responses) 来发起此类直接模型请求，例如本节的文本生成调用。

使用简单提示词生成文本

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


模型生成的内容数组位于响应的 `output` 属性中。在本例中，我们只有一个输出，内容如下：

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

**该 `output` 数组中通常不止一个条目！** 它可能包含工具调用、与 [推理模型](https://developers.openai.com/api/docs/guides/reasoning)，生成的推理 token 相关的数据，以及其他条目。不能假设模型的文本输出一定出现在 `output[0].content[0].text`.

我们提供的部分 [官方 SDK](https://developers.openai.com/api/docs/libraries) 中包含一个 `output_text` 便捷属性，用于聚合模型返回的所有文本输出为单个字符串，便于快速访问模型的文本输出。

除了纯文本外，你还可以让模型以 JSON 格式返回结构化数据——该功能称为 [**结构化输出**](https://developers.openai.com/api/docs/guides/structured-outputs).

## 提示工程

**提示工程** 是为模型编写有效指令的过程，使其能够持续生成符合你需求的内容。

由于模型生成的内容具有不确定性，通过提示获得你期望的输出既是一门艺术，也是一门科学。不过，你可以应用一些技巧和最佳实践来持续获得良好结果。

有些提示工程技术适用于所有模型，例如使用消息角色。但不同的模型可能需要不同的提示方式才能产生最佳结果。即使是同一系列模型中的不同快照版本，也可能会产生不同的结果。因此，在构建更复杂的应用时，我们强烈建议你：

- 将你的生产应用固定到特定的 [模型快照](https://developers.openai.com/api/docs/models) （例如 `gpt-5.5-2026-04-23` ，以此确保行为一致
- 构建测试和评估套件来衡量提示行为，以便在迭代过程中或更换和升级模型版本时监控性能

现在，我们来看一下可用于你构建提示词的工具和技术。

## 选择模型和 API

OpenAI 拥有许多不同的 [模型](https://developers.openai.com/api/docs/models) 以及多个可供选择的 API。 [推理模型](https://developers.openai.com/api/docs/guides/reasoning)（如 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol)）的行为与聊天模型不同，对不同的提示也有不同的响应。需要注意的一点是，推理模型在与 Responses API 一起使用时表现更佳，且展现出更高的智能水平。

如果你正在构建任何文本生成应用，我们建议使用 Responses API 而非旧的 Chat Completions API。而如果你使用的是推理模型， [迁移到 Responses](https://developers.openai.com/api/docs/guides/migrate-to-responses).

## 消息角色与指令遵循

你可以通过 [不同权限级别](https://model-spec.openai.com/2025-02-12.html#chain_of_command) 使用 `instructions` API 参数以及 **消息角色**.

该 `instructions` 参数为模型提供关于其在生成响应时应该如何表现的高级指令，包括语气、目标以及正确响应的示例。以这种方式提供的任何指令将优先于 `input` 参数中的提示。

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


上面的示例大致相当于在 `input` 数组中使用以下输入消息：

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


请注意， `instructions` 参数仅适用于当前的响应生成请求。如果你正在 [管理对话状态](https://developers.openai.com/api/docs/guides/conversation-state) 使用 `previous_response_id` 参数，之前轮次中使用的 `instructions` 将不会出现在上下文中。

该 [OpenAI 模型规范](https://model-spec.openai.com/2025-02-12.html#chain_of_command) 描述了我们的模型如何为不同角色的消息赋予不同的优先级。

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

多轮对话可以由多条这些类型的消息以及你与模型提供的其他内容类型组成。详细了解 [管理对话状态](https://developers.openai.com/api/docs/guides/conversation-state).

你可以把 `developer` 和 `user` 消息看作是编程语言中的函数及其参数。

- `developer` 消息提供系统的规则和业务逻辑，例如函数定义。
- `user` 消息提供输入和配置， `developer` message 说明会像函数参数一样被应用。

## 在代码中对提示进行版本管理

将生产环境的提示词存储在应用代码中，而不是创建可复用的提示词对象。通过代码管理提示词，便于使用类型化输入、代码审查、测试以及常规的部署流程来修改模型行为。

OpenAI 正在弃用 API 中的可复用提示词对象。提示词创建功能将
  自 2026-06-03 起逐步弱化，并于 `v1/prompts` 计划于
  2026-11-30 关停。详见 [deprecations
  page](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) 以查看当前的
  时间线。

如需进行新的文本生成工作：

- 将提示构建器保存在靠近其所支持功能的小模块中。
- 对动态值（例如客户数据、文件或任务选项）使用带类型的函数参数或 schema。
- 将生成的 `instructions` 和 `input` 直接传递给 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create).
- 在修改生产环境的提示之前，添加有代表性的 fixtures、测试和评估检查。
- 通过你的部署系统推出提示变更，在需要分阶段发布时使用功能开关或配置。

如果你的集成已经使用提示 ID 或版本调用已保存的提示，请参考 [prompt 对象迁移指南](https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object) 将该提示迁移到代码中。

## 下一步

现在你已经了解了文本输入和输出的基础知识，接下来可以查看以下资源。

[在 Playground 中构建提示



      Use the Playground to develop and iterate on prompts.](https://platform.openai.com/chat/edit)

[使用 Structured Outputs 生成 JSON 数据



      Ensure JSON data emitted from a model conforms to a JSON schema.](https://developers.openai.com/api/docs/guides/structured-outputs)

[完整 API 参考



      Check out all the options for text generation in the API reference.](https://developers.openai.com/api/reference/resources/responses)