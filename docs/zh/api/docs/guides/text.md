# 文本生成

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

使用 OpenAI API，你可以 [大语言模型](https://developers.openai.com/api/docs/models) 根据提示生成文本，就像使用 [ChatGPT](https://chatgpt.com)一样。模型可以生成几乎任何类型的文本响应——例如代码、数学方程、结构化 JSON 数据或类似人类的散文。

使用 [Responses API](https://developers.openai.com/api/reference/resources/responses) 进行此类文本生成调用的直接模型请求。

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


模型生成的内容数组位于响应的 `output` 属性中。在此简单示例中，我们只有一个输出，如下所示：

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

**该 `output` 数组通常包含多个项目！** 它可能包含工具调用、关于 [推理模型](https://developers.openai.com/api/docs/guides/reasoning)生成的推理 token 的数据以及其他项目。假设模型的文本输出位于 `output[0].content[0].text`.

我们的一些 [官方 SDK](https://developers.openai.com/api/docs/libraries) 包括一个 `output_text` 属性，用于方便地聚合模型的所有文本输出为单个字符串。这可以作为获取模型文本输出的快捷方式。

除了纯文本之外，你还可以让模型返回 JSON 格式的结构化数据——这一功能称为 [**结构化输出**](https://developers.openai.com/api/docs/guides/structured-outputs).

## 提示工程

**提示工程** 是为模型编写有效指令的过程，以便其持续生成满足你要求的内容。

由于模型生成的内容具有非确定性，通过提示获得期望输出既是一门艺术，也是一门科学。然而，你可以应用技巧和最佳实践来持续获得良好的结果。

某些提示工程技术适用于所有模型，例如使用消息角色。但不同模型可能需要不同的提示方式才能产生最佳结果。即使同一系列模型的不同快照也可能产生不同结果。因此，在构建更复杂的应用时，我们强烈建议：

- 将你的生产应用固定到特定的 [模型快照](https://developers.openai.com/api/docs/models) （例如 `gpt-5.5-2026-04-23` ）以确保行为一致
- 构建测试和评估套件，衡量提示行为，以便在迭代时或更改和升级模型版本时监控性能

现在，让我们来考察一些可用于构建提示词的工具和技术。

## 选择模型和API

OpenAI 提供多种不同的 [模型](https://developers.openai.com/api/docs/models) ，以及几个 API 供你选择。 [推理模型](https://developers.openai.com/api/docs/guides/reasoning)，如 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol)，与聊天模型行为不同，对不同的提示有更好的响应。一个重要的注意事项是，当推理模型与 Responses API 配合使用时，它们表现更好，展现出更高的智能。

如果你在构建任何文本生成应用，我们建议使用 Responses API 而非较旧的 Chat Completions API。如果你在使用推理模型，尤其有用的是 [迁移到 Responses](https://developers.openai.com/api/docs/guides/migrate-to-responses).

## 消息角色与指令遵循

你可以通过 [不同级别的权限](https://model-spec.openai.com/2025-02-12.html#chain_of_command) 来向模型提供指令，方法是使用 `instructions` API 参数以及 **消息角色**.

。 `instructions` 该参数为模型提供生成响应时应当如何表现的高级指令，包括语气、目标以及正确响应的示例。通过这种方式提供的任何指令都会优先于 `input` 参数中的提示词。

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


上面的示例大致相当于在 `input` 数组中使用以下输入消息：

使用不同角色生成带消息的文本

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


请注意， `instructions` 参数仅适用于当前响应生成请求。如果你正在通过 [管理对话状态](https://developers.openai.com/api/docs/guides/conversation-state) 使用 `previous_response_id` 参数， `instructions` 之前轮次中使用的指令将不会出现在上下文中。

该 [OpenAI 模型规范](https://model-spec.openai.com/2025-02-12.html#chain_of_command) 描述我们的模型如何对不同角色的消息赋予不同的优先级。

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

多轮对话可能包含多种此类消息，以及你和模型提供的其他内容类型。了解更多 [请参见此处关于管理对话状态的信息](https://developers.openai.com/api/docs/guides/conversation-state).

你可以将 `developer` 和 `user` 消息想象为编程语言中的函数及其参数。

- `developer` messages 提供系统的规则和业务逻辑，类似于函数定义。
- `user` messages 提供输入和配置， `developer` message 指令据此应用，类似于函数的参数。

## 代码中的版本提示

将生产提示词存储在应用程序代码中，而不是创建可重用的提示词对象。代码管理的提示词让你能够使用类型化输入、代码审查、测试以及常规部署流程来更改模型行为。

OpenAI 正在弃用 API 中的可重用提示词对象。提示词创建将
  从2026年6月3日起被淡化，并且 `v1/prompts` 计划于
  2026年11月30日关闭。请参见 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) 了解当前的
  时间线。

对于新的文本生成工作：

- 将提示构建器保留在靠近其支持功能的小模块中。
- 使用类型化函数参数或模式来处理动态值，如客户数据、文件或任务选项。
- 将生成的 `instructions` 和 `input` 直接传递给 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create).
- 在更改生产提示之前添加代表性的固定装置、测试和评估检查。
- 通过您的部署系统推出提示更改，在需要分阶段发布时使用功能标志或配置。

如果你的集成已经通过提示词 ID 或版本号调用保存的提示词，请使用 [提示词对象迁移指南](https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object) 将该提示词迁移到代码中。

## 后续步骤

既然你现在已经了解了文本输入和输出的基础知识，接下来不妨看看以下这些资源。

[在 Playground 中构建提示词



      Use the Playground to develop and iterate on prompts.](https://platform.openai.com/chat/edit)

[使用结构化输出生成 JSON 数据



      Ensure JSON data emitted from a model conforms to a JSON schema.](https://developers.openai.com/api/docs/guides/structured-outputs)

[完整的 API 参考



      Check out all the options for text generation in the API reference.](https://developers.openai.com/api/reference/resources/responses)