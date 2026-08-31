# 代码生成

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

编写、审查、编辑代码以及回答与代码相关的问题是 OpenAI 模型如今最主要的用途之一。本指南将介绍你使用 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 和 Codex 进行代码生成的多种方案。

## 入门



  - **[使用 Codex 开箱即用的编码智能体](#use-codex)**: 将你的代码库接入 Codex，使用软件工程智能体加速你的项目。
- **[集成编码模型](#integrate-with-coding-models)**: 在你的应用中使用OpenAI模型，例如将它们添加到模型选择器中。



## 使用 Codex

[**Codex**](https://developers.openai.com/codex) 是 OpenAI 面向软件开发的编码智能体。它可以帮助你编写、审查和调试代码。你可以在多种界面中使用 Codex：在 IDE 中、通过 CLI、在 Web 和移动端网站上，或在 CI/CD 流水线中配合 SDK 使用。Codex 是在你的项目上获得智能体式软件工程能力的最佳方式。

Codex 与 GPT-5 系列的最新模型配合效果最佳，例如 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol)。我们提供了一系列专为 Codex 这类编码智能体设计的模型，例如 [`gpt-5.3-codex`](https://developers.openai.com/api/docs/models/gpt-5.3-codex)，但我们建议在大多数代码生成任务中使用最新的通用模型。

请参阅 [ChatGPT 文档](https://developers.openai.com/codex) ，获取设置指南、参考资料、定价及更多信息。

## 与编程模型集成

对于大多数基于 API 的代码生成任务，可以从 **`gpt-5.6`**。入手。它既适用于通用任务，也适用于编码任务，因此当你的应用需要在一个地方完成编写代码、推理需求、检查文档以及处理更广泛的工作流时，它是稳妥的默认选择。

以下示例展示了你如何将 [Responses API](https://developers.openai.com/api/reference/resources/responses) 用于代码生成场景：

大多数编码任务的默认模型

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const result = await openai.responses.create({
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
        .model("gpt-5.6")
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
    Model = "gpt-5.6",
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
  model: "gpt-5.6",
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
    "model": "gpt-5.6",
    "input": "Find the null pointer exception in this code:\n\ndef display_name(user):\n    return user.profile.name\n\nprint(display_name(None))\n",
    "reasoning": { "effort": "high" }
  }'
```


## 前端开发

我们 GPT-5 系列模型在前端开发方面表现出色，尤其是与 Codex 这类编码智能体框架配合使用时。

下面的演示应用都是一次性生成的，即由单个提示生成，没有手写代码。可用于评估前端生成质量以及面向 UI 密集型代码生成工作流的提示模式。

## Next steps

- 访问 [ChatGPT 文档](https://developers.openai.com/codex) 了解你可以使用 Codex 做什么，在你选择的任意界面中设置 Codex，或查找更多详细信息。
- 阅读 [模型指南](https://developers.openai.com/api/docs/guides/latest-model) 获取模型选择、功能、迁移指南以及在编码和智能体任务中效果良好的提示模式。
- 比较 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 并 [`gpt-5.3-codex`](https://developers.openai.com/api/docs/models/gpt-5.3-codex) ，详见模型页面。