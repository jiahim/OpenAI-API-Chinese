# 从 prompt 对象迁移

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取该页面的 Markdown 版本。

OpenAI 正在弃用 API 中的可复用提示对象。提示创建将于
  2026 年 6 月 3 日起被弱化，并且 `v1/prompts` 计划于
  2026 年 11 月 30 日关停。请参阅 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) 了解当前的
  时间表。

若要从 **Prompts** 迁移，请在 OpenAI API 平台中将提示内容从托管 `prompt` 对象移至你的应用代码中。这样你可以更好地掌控审查、测试、部署和版本管理。

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
# Replace the illustrative IDs and URLs below with your own resource values.

from openai import OpenAI

client = OpenAI()
prompt_id = "pmpt_123"

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


## After：以内联方式将提示写入代码中

在代码中内联提示

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

使用 [OpenAI Developers 插件](https://developers.openai.com/learn/developers-codex-plugin) 和 [OpenAI Docs 技能](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs) 来自动化你的迁移，并加速基于 OpenAI API 的构建。

```text
$openai-docs update this project to store prompts in code instead of using a prompts object
```

## 变更内容

你无需在 API 请求中引用已保存的提示对象，而是将提示文本存放在代码库中，并将生成的消息直接作为参数传入 `input` 到 Responses API 调用中。

- **将提示内容移入源代码** 以便提示变更与产品逻辑走相同的评审和发布流程。
- **用函数参数替换提示变量** 以便动态值在你的应用中是显式且有类型的。
- **在Responses API 调用中传入 `input`** in the 响应接口 call instead of using the `prompt` 对象。
- **把版本管理放到你的代码仓库中** 使用 git 提交、PR 评审以及测试或评测。
- **将静态内容放在前面，动态内容放在后面** 以保留提示缓存带来的收益，因为缓存命中依赖于精确的前缀匹配。

## 示例

使用辅助函数构建提示词

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

你可以获得更紧密的工程控制：提示与产品代码一起存放，变更通过 PR 流程提交，测试与评估可在 CI 中运行，上线或实验可通过你自己的配置或功能开关来管理。

不要把提示零散地散布在代码库中。创建一个小的 `prompts/` 模块，将每个提示作为具名的构建函数，并加入轻量的评估测试夹具，使提示变更像产品逻辑一样接受评审。