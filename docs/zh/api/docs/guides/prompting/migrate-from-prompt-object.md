# 从 prompt 对象迁移

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取对应文档页面的 Markdown 版本。

OpenAI 将弃用 API 中的可复用提示对象。提示创建功能将于
  2026 年 6 月 3 日起弱化，并于 `v1/prompts` 计划于
  2026 年 11 月 30 日关闭。参见 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) 针对当前
  时间线。

若要从 **Prompts** 迁移到 OpenAI API 平台中的托管对象，请把提示内容移出托管对象，并写入到你的应用代码里。 `prompt` 这样你可以更自由地控制审核、测试、部署和版本管理。

## Before: using a Prompt Object

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


## 之后：将提示内联到代码中

将提示内联到代码中

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
        .model("gpt-5.6")
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

```ruby
require "openai"

client = OpenAI::Client.new

response = client.responses.create(
  model: "gpt-5.6",
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
    "model": "gpt-5.6",
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

无需在 API 请求中引用已保存的提示对象，而是将提示文本存放在你的代码库中，并把生成的消息直接作为 `input` 传入 Responses API 调用。

- **将提示内容移入源代码** 以便提示的修改与产品逻辑走同一套评审与发布流程。
- **用函数参数替换提示变量** 从而让动态值在你的应用中显式且具有类型。
- **通过 Responses API 调用传递 messages `input`** ，而不是使用 `prompt` 对象。
- **将版本管理迁移到你的代码仓库** ，借助 git 提交、PR 评审以及测试或评测。
- **将静态内容放在前面，动态内容放在后面** ，以保留提示缓存带来的好处，因为缓存命中依赖于精确的前缀匹配。

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
  model: "gpt-5.6",
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
    model="gpt-5.6",
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
		Model: "gpt-5.6",
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
        .model("gpt-5.6")
        .inputOfResponse(buildSupportPrompt("Acme", "billing question"))
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
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
  model: "gpt-5.6",
  input: build_support_prompt("Acme", "billing question")
)

puts(response.output_text)
```


## 你能获得什么

你可以获得更精细的工程控制：提示与产品代码放在同一处，更改通过 PR 流程进行，测试和评估可在 CI 中运行，上线或实验可通过你自己的配置或功能开关来管理。

不要把提示零散地散布在代码库各处。创建一个小的 `prompts/` 模块，将每个提示作为命名良好的 builder 函数，并为评估添加轻量级的 fixture，使提示变更像产品逻辑一样接受评审。