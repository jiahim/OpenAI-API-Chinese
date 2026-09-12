# 代码生成

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

编写、审查、编辑代码，以及回答与代码相关的问题，是 OpenAI 模型如今最主要的用途之一。本指南将介绍你使用 [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 和 Codex 进行代码生成的各项选项。

## 开始使用



  - **[使用 Codex 开箱即用的编程智能体](#use-codex)**：将你的代码库接入 Codex，借助软件工程智能体加速项目进展。
- **[集成编程模型](#integrate-with-coding-models)**：在你的应用中使用OpenAI模型，例如将它们加入模型选择器。



## 使用 Codex

[**Codex**](https://developers.openai.com/codex) 是 OpenAI 面向软件开发的编程 智能体，可帮助你编写、审查和调试代码。你可以在多种界面中使用 Codex：在 IDE 中、通过 CLI、在 Web 和移动端网站上，或在 CI/CD 流水线中通过 SDK 使用。Codex 是为你的项目获得智能体化软件工程能力的最佳方式。

Codex 与最新的通用模型配合使用效果最佳，例如 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol)。我们提供了一系列专为 Codex 这类编程 智能体 设计的模型，例如 [`gpt-5.3-codex`](https://developers.openai.com/api/docs/models/gpt-5.3-codex)，但对于大多数代码生成任务，我们推荐使用最新的通用模型。

请参阅 [ChatGPT 文档](https://developers.openai.com/codex) 以获取设置指南、参考资料、定价及更多信息。

## 与编程模型集成

对于大多数基于 API 的代码生成任务，可从 **`gpt-6-astra`**。开始。它既能处理通用任务，也能处理编码任务，因此当你的应用需要在同一处完成代码编写、需求分析、文档查阅以及更广泛的工作流时，它是一个稳妥的默认选择。

下面的示例展示如何在代码生成场景中使用 [Responses API](https://developers.openai.com/api/reference/resources/responses) :

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
  reasoning: { effort: :high }
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

我们的 GPT-5 系列模型在前端开发方面尤为出色，尤其是与 Codex 等编码智能体工具链配合时。

以下演示应用均为一次性生成，即由单个提示生成，不含手写代码。可用于评估前端生成质量以及面向 UI 的代码生成工作流的提示模式。

## Next steps

- 访问 [ChatGPT 文档](https://developers.openai.com/codex) 以了解你可以用 Codex 做什么，在任意你选择的界面中设置 Codex，或查找更多详细信息。
- 阅读 [模型指南](https://developers.openai.com/api/docs/guides/latest-model) 获取模型选择、功能、迁移指南以及在编程和智能体任务中效果良好的提示模式。
- 比较 [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 并 [`gpt-5.3-codex`](https://developers.openai.com/api/docs/models/gpt-5.3-codex) 在模型页面中查看。