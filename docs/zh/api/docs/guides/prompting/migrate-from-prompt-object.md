# 从提示对象迁移

> 关于完整的文档索引，请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获得。

OpenAI 正在弃用 API 中的可复用提示对象。提示创建将
  自 2026 年 6 月 3 日起不再重点支持，且 `v1/prompts` 计划于
  2026 年 11 月 30 日关闭。请参阅 [弃用
  页面](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) 了解当前
  时间线。

要从 **Prompts** 迁移到 OpenAI API 平台，请将提示内容从托管 `prompt` 对象移至你的应用程序代码中。这样你就能更好地控制审查、测试、部署和版本管理。

## 之前：使用提示对象

使用提示对象

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


## 之后：在代码中内联提示词

在代码中内联提示

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

使用 [OpenAI 开发者插件](https://developers.openai.com/learn/developers-codex-plugin) 和 [OpenAI 文档技能](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs) 来自动化你的迁移，并使用 OpenAI API 加速构建。

```text
$openai-docs update this project to store prompts in code instead of using a prompts object
```

## 有何变更

与其从 API 请求中引用已保存的提示词对象，不如将提示词文本存储在代码库中，并将生成的 messages 直接作为 `input` 传入 Responses API 调用。

- **将提示词内容移入源代码中** ，使提示词更改与产品逻辑遵循相同的审查和发布流程。
- **用函数参数替换提示词变量** ，使动态值在应用中显式且类型化。
- **直接在 `input`** Responses API 调用中传入消息，而非使用 `prompt` 对象。
- **将版本管理迁至你的仓库** ，使用 git 提交、PR 审查以及测试或评估。
- **将静态内容前置，动态内容后置** ，以保留提示词缓存优势，因为缓存命中依赖于精确的前缀匹配。

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


## 你将获得

你能获得更严格的工程控制：提示词与产品代码放在一起，变更经由 PR 审查，测试与评估可在 CI 中运行，发布或实验可通过你自己的配置或功能开关来管理。

不要将提示词内联散落在代码库各处。创建一个小的 `prompts/` 模块，将每个提示词保留为具名构建函数，并添加轻量级评估夹具，使提示词变更像产品逻辑一样接受审查。