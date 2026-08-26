# 代码生成

> 要查看完整的文档索引，请参见 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

编写、审查、编辑以及回答关于代码的问题，是当今 OpenAI 模型的主要用例之一。本指南将带你了解使用以下工具进行代码生成的选项 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 和 Codex。

## 开始使用



  - **[使用 Codex 获取开箱即用的编码智能体](#use-codex)**：将你的代码库连接到 Codex，并使用软件工程智能体加速你的项目。
- **[与编码模型集成](#integrate-with-coding-models)**：在应用程序中使用 OpenAI 模型。例如，将它们添加到模型选择器中。



## 使用 Codex

[**Codex**](https://developers.openai.com/codex) 是 OpenAI 用于软件开发的编码智能体。它帮助你编写、审查和调试代码。你可以通过各种界面与 Codex 交互：在 IDE 中、通过 CLI、在网页和移动网站上，或在你的 CI/CD 管道中使用 SDK。Codex 是在你的项目中实现智能体软件工程的最佳方式。

Codex 与 GPT-5 系列的最新模型配合最佳，例如 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol)。我们提供一系列专为与 Codex 等编码智能体配合而设计的模型，例如 [`gpt-5.3-codex`](https://developers.openai.com/api/docs/models/gpt-5.3-codex)，但我们建议在大多数代码生成任务中使用最新的通用模型。

参见 [ChatGPT 文档](https://developers.openai.com/codex) 以获取设置指南、参考材料、定价和更多信息。

## 与编码模型集成

对于大多数基于 API 的代码生成，从 **`gpt-5.6`**。开始。它同时处理通用任务和编码，使其成为你的应用程序需要在同一处编写代码、推理需求、查阅文档和处理更广泛工作流时的强默认选择。

此示例展示了如何使用 [Responses API](https://developers.openai.com/api/reference/resources/responses) 来处理代码生成用例：

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

我们来自 GPT-5 系列的模型在前端开发方面尤为出色，尤其是在与诸如 Codex 等编码智能体框架结合使用时。

下面的演示应用是单次生成的，即仅通过单个提示词生成，没有手写代码。使用它们来评估前端生成质量和界面密集型代码生成工作流的提示词模式。

## 后续步骤

- 请访问 [ChatGPT 文档](https://developers.openai.com/codex) 了解你可以用 Codex 做什么，在你选择的界面中设置 Codex，或查找更多详细信息。
- 阅读 [模型指南](https://developers.openai.com/api/docs/guides/latest-model) 了解适用于编码和智能体任务中的模型选择、功能、迁移指南和提示模式。
- 在模型页面上比较 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 和 [`gpt-5.3-codex`](https://developers.openai.com/api/docs/models/gpt-5.3-codex) 。