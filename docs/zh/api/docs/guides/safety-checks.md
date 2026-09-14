# Safety classifiers

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 。

随着 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5)，我们添加了一些检查以发现并阻止访问有害信息。在使用场景广泛的应用中，部分用户最终很可能会尝试将你的应用用于OpenAI政策之外的目的。

## 安全分类器流程

1. 我们将发往 GPT-5 的请求按风险阈值进行分类。
1. 如果你的组织反复达到高阈值，OpenAI 会返回错误，同时发送一封警告邮件。
1. 如果请求在规定的时间阈值（通常为七天）后仍然继续，我们会停止你的组织对 GPT-5 的访问。请求将无法再成功。

## 如何避免错误、延迟和封禁

如果你的组织从事违反安全策略的可疑活动，我们可能会返回错误、限制模型访问，甚至封禁你的账户。以下安全措施可帮助我们识别高风险请求的来源，并封禁单个终端用户，而不是封禁整个组织。

- [实施安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) 用于个人用户与模型交互的产品。安全标识符为推荐使用，但并非强制要求。
- 如果你的用例需要访问限制较少的版本，以开展生命科学领域的有益应用，请了解我们的 [特殊访问计划](https://help.openai.com/en/articles/11826767-life-science-research-special-access-program) ，查看你是否符合相关条件。

## 为单个用户实现安全标识符

该 `safety_identifier` 参数在 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) 和较早的 [Chat Completions API](https://developers.openai.com/api/reference/resources/chat)。中均可用。Realtime API 通过 `OpenAI-Safety-Identifier` 标头支持相同的概念。要使用安全标识符，请在每个请求中为你的最终用户提供一个稳定的 ID。对用户邮箱或内部用户 ID 进行哈希处理，以避免传递任何个人信息。

安全标识符不会在不同的 API 或会话之间延续。如果你的应用程序已经在 `safety_identifier` 随 Responses API 请求一起发送，请在创建或连接每个 Realtime 会话时单独传递相同的稳定值。



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

如果 OpenAI 监控系统发现潜在的滥用行为，我们可能会采取不同程度的处理措施：

- **延迟流式响应**
  - 作为针对潜在违反策略用户的初步、较低后果的干预措施，OpenAI 可能会延迟流式响应，在向该用户返回完整响应之前运行额外的检查。
  - 如果检查通过，则开始流式传输。如果检查失败，则请求停止——不会出现任何令牌，流式响应也不会开始。
  - 为了提供更好的最终用户体验，建议在流式传输延迟的情况下添加加载指示器。
- **对个别用户的模型访问进行封禁**
  - 在高置信度的策略违规情况下，关联的 `safety_identifier` 将被完全禁止访问 OpenAI 模型。
  - 该安全标识符会在所有 `identifier blocked` 未来针对同一标识符的 GPT-5 请求中收到错误。OpenAI 目前无法解除对单个标识符的封禁。

要使这些措施生效，请确保已部署相应的控制手段，防止被封禁的用户开设新账户。需要提醒的是，贵组织的反复违规行为可能导致整个组织失去访问权限。

## 我们为何要这样做

具体的执行标准可能会根据不断发展的实际使用情况或新模型的发布而变化。目前，OpenAI 可能会限制或阻止具有危险或可疑生物或化学活动的安全标识符访问。请参阅 [博客文章](https://openai.com/index/preparing-for-future-ai-capabilities-in-biology/) 了解我们如何应对生物学领域更高 AI 能力的更多信息。

## 其他类型的安全检查

有关工具和模型定制相关的安全措施，请参阅 [计算机使用确认与同意](https://developers.openai.com/api/docs/guides/tools-computer-use#handle-user-confirmation-and-consent) 以及 [微调安全性](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#safety-checks)。OpenAI 也会在 [模型评估中心](https://openai.com/safety/evaluations-hub).