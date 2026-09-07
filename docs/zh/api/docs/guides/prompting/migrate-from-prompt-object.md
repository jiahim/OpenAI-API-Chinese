# 从 prompt 对象迁移

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。你可以通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

OpenAI 正在弃用 API 中可复用的 prompt 对象。Prompt 创建功能
  将于 2026 年 6 月 3 日起被弱化，并 `v1/prompts` 计划于
  2026 年 11 月 30 日关闭。详见 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) 以了解当前的
  时间表。

要从 **Prompts** 迁出 OpenAI API 平台，请将 prompt 内容从托管 `prompt` 对象移至你的应用代码中。这样你可以更灵活地控制审核、测试、部署和版本管理。

## Before：使用 Prompt 对象

使用 prompt 对象

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  prompt: {
    id: "pmpt_123",
    version: "1",
    variables: {
      customer_name: "Acme",
      issue: "billing question",
    },
  },
});
```

```python
import os

from openai import OpenAI

client = OpenAI()
prompt_id = os.environ["OPENAI_PROMPT_ID"]

response = client.responses.create(
    prompt={
        "prompt_id": prompt_id,
        "version": "1",
        "variables": {
            "customer_name": "Acme",
            "issue": "billing question",
        },
    }
)
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
		Prompt: responses.ResponsePromptParam{
			ID:      "pmpt_123",
			Version: openai.String("1"),
			Variables: map[string]responses.ResponsePromptVariableUnionParam{
				"customer_name": {OfString: openai.String("Acme")},
				"issue":         {OfString: openai.String("billing question")},
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
import com.openai.core.JsonValue;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponsePrompt;

String promptId = "pmpt_123";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .prompt(
            ResponsePrompt.builder()
                .id(promptId)
                .version("1")
                .variables(
                    ResponsePrompt.Variables.builder()
                        .putAdditionalProperty("customer_name", JsonValue.from("Acme"))
                        .putAdditionalProperty("issue", JsonValue.from("billing question"))
                        .build())
                .build())
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
  prompt: {
    id: "pmpt_123",
    version: "1",
    variables: {
      customer_name: "Acme",
      issue: "billing question"
    }
  }
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "prompt": {
      "prompt_id": "pmpt_123",
      "version": "1",
      "variables": {
        "customer_name": "Acme",
        "issue": "billing question"
      }
    }
  }'
```


## After：在代码中内联提示词

在代码中内联该提示词

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-6-astra",
  input: [
    {
      role: "system",
      content:
        "You are a helpful support assistant. Be concise, accurate, and friendly.",
    },
    {
      role: "user",
      content:
        "Customer name: Acme. Issue: billing question. Write a response to the customer.",
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
    input=[
        {
            "role": "system",
            "content": "You are a helpful support assistant. Be concise, accurate, and friendly.",
        },
        {
            "role": "user",
            "content": "Customer name: Acme. Issue: billing question. Write a response to the customer.",
        },
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
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			responses.ResponseInputItemParamOfMessage("You are a helpful support assistant. Be concise, accurate, and friendly.", responses.EasyInputMessageRoleSystem),
			responses.ResponseInputItemParamOfMessage("Customer name: Acme. Issue: billing question. Write a response to the customer.", responses.EasyInputMessageRoleUser),
		}},
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
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.List;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .inputOfResponse(
            List.of(
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.SYSTEM)
                        .content(
                            "You are a helpful support assistant. Be concise, accurate, and friendly.")
                        .build()),
                ResponseInputItem.ofEasyInputMessage(
                    EasyInputMessage.builder()
                        .role(EasyInputMessage.Role.USER)
                        .content(
                            "Customer name: Acme. Issue: billing question. Write a response to the customer.")
                        .build())))
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

ResponseResult response = await client.CreateResponseAsync(
    "gpt-6-astra",
    [
        ResponseItem.CreateSystemMessageItem(
            "You are a helpful support assistant. Be concise, accurate, and friendly."
        ),
        ResponseItem.CreateUserMessageItem(
            "Customer name: Acme. Issue: billing question. Write a response to the customer."
        ),
    ]
);

Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-6-astra",
  input: [
    {
      role: :system,
      content: "You are a helpful support assistant. Be concise, accurate, and friendly."
    },
    {
      role: :user,
      content: "Customer name: Acme. Issue: billing question. Write a response to the customer."
    }
  ]
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "input": [
      {
        "role": "system",
        "content": "You are a helpful support assistant. Be concise, accurate, and friendly."
      },
      {
        "role": "user",
        "content": "Customer name: Acme. Issue: billing question. Write a response to the customer."
      }
    ]
  }'
```


## 使用 Codex 进行迁移

使用 [OpenAI Developers 插件](https://developers.openai.com/learn/developers-codex-plugin) 和 [OpenAI Docs 技能](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs) 自动化迁移并加速基于 OpenAI API 的开发。

```text
$openai-docs update this project to store prompts in code instead of using a prompts object
```

## 变更内容

不要从API请求中引用已保存的提示对象，而是将提示文本存储在代码库中，并将生成的消息直接作为 `input` 参数传递给 Responses API 调用。

- **将提示词内容移入源代码** 以便提示词的变更与产品逻辑遵循相同的评审和发布流程。
- **将提示词变量替换为函数参数** 以便动态值在你的应用中显式声明并带有类型。
- **在调用 Responses API 时传递消息， `input`** 而不是使用该对象 `prompt` （object）。
- **将版本管理迁移到你的代码仓库** 使用 git 提交、PR 评审以及测试或评估。
- **将静态内容放在前面，动态内容放在后面** 以保留提示词缓存带来的收益，因为缓存命中依赖于精确的前缀匹配。

## 示例

使用辅助函数构建提示

```javascript
import OpenAI from "openai";

const client = new OpenAI();

/** @returns {OpenAI.Responses.ResponseInput} */
function buildSupportPrompt({ customerName, issue }) {
  return [
    {
      role: "system",
      content:
        "You are a helpful support assistant. Be concise, accurate, and friendly. Do not invent policy details.",
    },
    {
      role: "user",
      content: `Customer name: ${customerName}. Issue: ${issue}. Write a response to the customer.`,
    },
  ];
}

const response = await client.responses.create({
  model: "gpt-6-astra",
  input: buildSupportPrompt({
    customerName: "Acme",
    issue: "billing question",
  }),
});
```

```python
from openai import OpenAI

client = OpenAI()


def build_support_prompt(customer_name, issue):
    return [
        {
            "role": "system",
            "content": "You are a helpful support assistant. Be concise, accurate, and friendly. Do not invent policy details.",
        },
        {
            "role": "user",
            "content": f"Customer name: {customer_name}. Issue: {issue}. Write a response to the customer.",
        },
    ]


response = client.responses.create(
    model="gpt-6-astra",
    input=build_support_prompt(
        customer_name="Acme",
        issue="billing question",
    ),
)
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
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: buildSupportPrompt("Acme", "billing question")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}

func buildSupportPrompt(customerName string, issue string) responses.ResponseInputParam {
	return responses.ResponseInputParam{
		responses.ResponseInputItemParamOfMessage("You are a helpful support assistant. Be concise, accurate, and friendly. Do not invent policy details.", responses.EasyInputMessageRoleSystem),
		responses.ResponseInputItemParamOfMessage(fmt.Sprintf("Customer name: %s. Issue: %s. Write a response to the customer.", customerName, issue), responses.EasyInputMessageRoleUser),
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.EasyInputMessage;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ResponseInputItem;
import java.util.List;

private static List<ResponseInputItem> buildSupportPrompt(String customerName, String issue) {
  return List.of(
      ResponseInputItem.ofEasyInputMessage(
          EasyInputMessage.builder()
              .role(EasyInputMessage.Role.SYSTEM)
              .content(
                  "You are a helpful support assistant. Be concise, accurate, and friendly. Do not invent policy details.")
              .build()),
      ResponseInputItem.ofEasyInputMessage(
          EasyInputMessage.builder()
              .role(EasyInputMessage.Role.USER)
              .content(
                  "Customer name: "
                      + customerName
                      + ". Issue: "
                      + issue
                      + ". Write a response to the customer.")
              .build()));
}

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .inputOfResponse(buildSupportPrompt("Acme", "billing question"))
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

static ResponseItem[] BuildSupportPrompt(string customerName, string issue) =>
[
    ResponseItem.CreateSystemMessageItem(
        "You are a helpful support assistant. Be concise, accurate, and friendly. Do not invent policy details."
    ),
    ResponseItem.CreateUserMessageItem(
        $"Customer name: {customerName}. Issue: {issue}. Write a response to the customer."
    ),
];

ResponseResult response = await client.CreateResponseAsync(
    "gpt-6-astra",
    BuildSupportPrompt("Acme", "billing question")
);
Console.WriteLine(response.GetOutputText());
```

```ruby
require "openai"

def build_support_prompt(customer_name, issue)
  [
    {
      role: :system,
      content: "You are a helpful support assistant. Be concise, accurate, and friendly. Do not invent policy details."
    },
    {
      role: :user,
      content: "Customer name: #{customer_name}. Issue: #{issue}. Write a response to the customer."
    }
  ]
end

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-6-astra",
  input: build_support_prompt("Acme", "billing question")
)

puts(response.output_text)
```


## 你能获得什么

你将获得更精细的工程控制：提示与产品代码放在一起，变更通过 PR 流程进行，测试和评估可以在 CI 中运行，上线或实验可以通过你自己的配置或功能开关来管理。

不要把提示零散地散落在代码库各处。创建一个小的 `prompts/` 模块，把每个提示作为命名的构建函数，并加入轻量的评估固件，使提示的变更能像产品逻辑一样被评审。