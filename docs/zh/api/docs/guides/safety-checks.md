# Safety classifiers

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

随着 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5), 我们加入了一些检查来发现并阻止危险信息被访问。可能会有一些用户最终尝试将你的应用用于OpenAI政策之外的事情,尤其是在用途广泛的应用中。

## 安全分类器流程

1. 我们将发往 GPT-5 的请求划分为不同的风险阈值。
1. 如果你的组织反复达到较高的阈值，OpenAI 会返回错误并发送一封警告邮件。
1. 如果请求在规定的时间阈值（通常为七天）后仍然继续，我们会停止你的组织对 GPT-5 的访问，请求将无法再成功完成。

## 如何避免错误、延迟和封禁

如果你的组织从事违反我们安全政策的可疑活动，我们可能会返回错误、限制模型访问，甚至封禁你的账户。以下安全措施有助于我们识别高风险请求的来源并封禁单个终端用户，而不是封禁你的整个组织。

- [实施安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) ，适用于个人用户与模型交互的产品。建议使用安全标识符，但并非必需。
- 如果你的用例依赖于访问我们限制较少的版本的服务，以便在生命科学领域开展有益应用，请阅读我们的 [特殊访问计划](https://help.openai.com/en/articles/11826767-life-science-research-special-access-program) ，了解你是否符合相关标准。

## 为单个用户实现安全标识符

要将某个安全标识符的警告和停用通知路由到你的调查或支持工作流，请参阅 [安全执行通知](https://developers.openai.com/api/docs/guides/safety-enforcement).

该 `safety_identifier` 参数在两者中均可用： [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) 和旧版 [Chat Completions API](https://developers.openai.com/api/reference/resources/chat)。Realtime API 通过 `OpenAI-Safety-Identifier` 标头支持同一概念。要使用安全标识符，请为你的最终用户在每次请求中提供一个稳定的 ID。对用户邮箱或内部用户 ID 进行哈希处理，以避免传入任何个人信息。

安全标识符不会在 API 之间或会话之间传递。如果你的应用已发送 `safety_identifier` 与 Responses API 请求，请在创建或连接每个 Realtime 会话时单独传递相同的稳定值。



Responses API

    Providing a safety identifier with the Responses API

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6-terra",
  input: "This is a test",
  safety_identifier: "user_123456",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6-terra",
    input="This is a test",
    safety_identifier="user_123456",
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
		Model:            "gpt-5.6-terra",
		Input:            responses.ResponseNewParamsInputUnion{OfString: openai.String("This is a test")},
		SafetyIdentifier: openai.String("user_123456"),
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
import com.openai.models.responses.ResponseCreateParams;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6-terra")
        .input("Help me plan a study schedule.")
        .safetyIdentifier("user_1234")
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
  model: "gpt-5.6-terra",
  input: "Help me plan a study schedule.",
  safety_identifier: "user_1234"
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
"model": "gpt-5.6-terra",
"input": "This is a test",
"safety_identifier": "user_123456"
}'
```

  

  

    
Chat Completions API

    Providing a safety identifier with the Chat Completions API

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.chat.completions.create({
  model: "gpt-5.6-terra",
  messages: [{ role: "user", content: "This is a test" }],
  safety_identifier: "user_123456",
});

console.log(response.choices[0].message.content);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-5.6-terra",
    messages=[{"role": "user", "content": "This is a test"}],
    safety_identifier="user_123456",
)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	response, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model:            "gpt-5.6-terra",
		Messages:         []openai.ChatCompletionMessageParamUnion{openai.UserMessage("This is a test")},
		SafetyIdentifier: openai.String("user_123456"),
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Choices[0].Message.Content)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionCreateParams;

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-5.6-terra")
        .addUserMessage("Help me plan a study schedule.")
        .safetyIdentifier("user_1234")
        .build();

client.chat().completions().create(params).choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
completion = client.chat.completions.create(
  model: "gpt-5.6-terra",
  messages: [
    {
      role: :user,
      content: "Help me plan a study schedule."
    }
  ],
  safety_identifier: "user_1234"
)

puts(completion.choices.fetch(0).message.content)
```

```bash
curl https://api.openai.com/v1/chat/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
"model": "gpt-5.6-terra",
"messages": [
{"role": "user", "content": "This is a test"}
],
"safety_identifier": "user_123456"
}'
```

  

  

    
Realtime API

    Providing a safety identifier with the Realtime API

```bash
curl https://api.openai.com/v1/realtime/client_secrets \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-H "OpenAI-Safety-Identifier: user_123456" \
-d '{
"session": {
"type": "realtime",
"model": "gpt-realtime-2.1"
}
}'
```



## 潜在后果

如果 OpenAI 的监控系统识别出潜在的滥用行为，我们可能会采取不同程度的处理措施：

- **延迟流式响应**
  - 作为针对潜在违反策略的用户所采取的初步且后果较轻的干预措施，OpenAI 可能会在运行额外检查的同时延迟流式响应，然后再向该用户返回完整响应。
  - 如果检查通过，流式响应便会开始。如果检查未通过，请求会停止——不会显示任何令牌，流式响应也不会开始。
  - 为了提供更好的最终用户体验，建议在流式响应延迟的情况下添加加载动画。
- **阻止单个用户访问模型**
  - 在高度确信违反策略的情况下，相关 `safety_identifier` 将被完全阻止访问 OpenAI 模型。
  - 该安全标识符将在 `identifier blocked` 同一标识符的所有未来 GPT-5 请求中收到错误。OpenAI 目前无法解除对单个标识符的阻止。

要使这些封禁措施生效，请确保你已部署相应的控制机制，防止被封禁的用户开设新账户。提醒一下，你所在组织若屡次违反政策，可能会导致整个组织失去访问权限。

## 我们为何要这样做

具体的执行标准可能会根据不断变化的实际使用情况或新模型的发布而调整。目前，OpenAI 可能会限制或阻止使用具有高风险或可疑生物或化学活动的安全标识符。请参阅 [博客文章](https://openai.com/index/preparing-for-future-ai-capabilities-in-biology/) ，了解我们如何在生物学领域应对更高的 AI 能力的更多信息。

## 其他类型的安全检查

有关工具和模型定制相关的具体防护措施，请参阅 [computer use 确认与同意](https://developers.openai.com/api/docs/guides/tools-computer-use#handle-user-confirmation-and-consent) 和 [微调安全](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#safety-checks)。OpenAI 还在 [模型评估中心](https://openai.com/safety/evaluations-hub).