# Code generation

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

编写、审查、编辑代码以及回答与代码相关的问题，是当下 OpenAI 模型的主要用例之一。本指南将介绍你使用以下方式生成代码的选项： [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 以及 Codex。

## 入门



  - **[使用 Codex 开箱即用的编程智能体](#use-codex)**：将你的代码库接入 Codex，使用软件工程智能体加速你的项目。
- **[与编程模型集成](#integrate-with-coding-models)**：在应用中接入OpenAI模型，例如将它们加入模型选择器。



## 使用 Codex

[**Codex**](https://developers.openai.com/codex) 是 OpenAI 用于软件开发的编码 智能体。它能帮助你编写、审查和调试代码。你可以在多种界面中使用 Codex：在你的 IDE 中、通过 CLI、在网页和移动端站点，或者在 CI/CD 流水线中配合 SDK 使用。Codex 是在你的项目中获得智能体式软件工程能力的最佳方式。

Codex 与最新的通用模型配合使用效果最佳，例如 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol)。我们提供了一系列专为 Codex 这样的编码 智能体 设计的模型，例如 [`gpt-5.3-codex`](https://developers.openai.com/api/docs/models/gpt-5.3-codex)，但我们建议在大多数代码生成任务中使用最新的通用模型。

请参阅 [ChatGPT 文档](https://developers.openai.com/codex) 获取设置指南、参考材料、定价以及更多信息。

## 与编程模型集成

对于大多数基于 API 的代码生成任务，可从 **`gpt-6-astra`**。开始。它既能处理通用工作，也能处理编码任务，因此当你的应用需要在一个地方完成代码编写、需求推理、文档检查以及更广泛的工作流处理时，它是一个理想默认选择。

下面的示例展示了如何将 [Responses API](https://developers.openai.com/api/reference/resources/responses) 用于代码生成场景：

大多数编码任务的默认模型

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const result = await openai.responses.create({
  model: "gpt-6-astra",
  input: `Find the null pointer exception in this code:

def display_name(user):
    return user.profile.name

print(display_name(None))
`,
  reasoning: { effort: "high" },
});

console.log(result.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

result = client.responses.create(
    model="gpt-6-astra",
    input="""Find the null pointer exception in this code:

def display_name(user):
    return user.profile.name

print(display_name(None))
""",
    reasoning={"effort": "high"},
)

print(result.output_text)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-6-astra",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String(`Find the null pointer exception in this code:

def display_name(user):
    return user.profile.name

print(display_name(None))`)},
		Reasoning: shared.ReasoningParam{Effort: shared.ReasoningEffortHigh},
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

String code =
    """
    def display_name(user):
        return user.profile.name

    print(display_name(None))
    """;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Find the null pointer exception in this code:\n\n" + code)
        .reasoning(Reasoning.builder().effort(ReasoningEffort.HIGH).build())
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
        ReasoningEffortLevel = ResponseReasoningEffortLevel.High,
    },
};
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem(
        """
        Find the null pointer exception in this code:

        def display_name(user):
            return user.profile.name

        print(display_name(None))
        """
    )
);

ResponseResult response = await client.CreateResponseAsync(options);
Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new
code = <<~PYTHON
  def display_name(user):
      return user.profile.name

  print(display_name(None))
PYTHON

response = client.responses.create(
  model: "gpt-6-astra",
  input: "Find the null pointer exception in this code:\n\n#{code}",
  reasoning: {effort: :high}
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "input": "Find the null pointer exception in this code:\n\ndef display_name(user):\n    return user.profile.name\n\nprint(display_name(None))\n",
    "reasoning": { "effort": "high" }
  }'
```


## 前端开发

我们 GPT-5 系列模型在前端开发方面尤为强大，尤其是在与 Codex 等编码智能体框架结合使用时。

以下演示应用都是一次性生成的，即由单个提示生成，不含手写代码。可用于评估前端生成质量以及面向 UI 重度代码生成工作流的提示模式。

## 后续步骤

- 访问 [ChatGPT 文档](https://developers.openai.com/codex) 以了解你可以使用 Codex 做什么，在你选择的界面中设置 Codex，或查找更多详情。
- 阅读 [模型指南](https://developers.openai.com/api/docs/guides/latest-model) ，获取模型选择、功能、迁移指南以及在编程和智能体任务中行之有效的提示模式。
- 对比 [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 和 [`gpt-5.3-codex`](https://developers.openai.com/api/docs/models/gpt-5.3-codex) （见模型页面）。