# 安全检查

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

我们会对模型及其使用方式运行多种类型的评估。本指南介绍我们如何进行安全测试，以及你可以采取哪些措施来避免违规。

## GPT-5 及后续版本的安全分类器

随着 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5)，我们添加了一些检查，用于发现并阻止危险信息的访问。有些用户最终可能会将你的应用用于OpenAI政策之外的目的，尤其是在使用场景广泛的应用中。

### 安全分类器流程

1. 我们将发往 GPT-5 的请求按风险阈值进行分类。
1. 如果你的组织反复达到高阈值，OpenAI 会返回错误并发送警告邮件。
1. 如果请求在规定的时间阈值（通常为七天）后仍然继续，就会停止你的组织对 GPT-5 的访问，请求将不再生效。

### 如何避免错误、延迟和封禁

如果你的组织从事违反我们安全政策的可疑活动，我们可能会返回错误、限制模型访问，甚至封禁你的账户。以下安全措施有助于我们识别高风险请求的来源，并封禁相应的最终用户，而不是封禁整个组织。

- [实施安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) ，用于个人用户与模型交互的产品。安全标识符是建议性的，并非必须。
- 如果你的用例需要访问限制较少的版本，以在生命科学领域开展有益应用，请阅读我们的 [特殊访问计划](https://help.openai.com/en/articles/11826767-life-science-research-special-access-program) ，了解你是否符合条件。

### 为各个用户实现安全标识符

该 `safety_identifier` 参数在 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) 和旧版 [Chat Completions API](https://developers.openai.com/api/reference/resources/chat)。Realtime API 通过以下请求头支持相同的概念： `OpenAI-Safety-Identifier` 请求头。若要使用安全标识符，请在每次请求时为你的最终用户提供一个稳定的 ID。对用户电子邮件或内部用户 ID 进行哈希处理，以避免传递任何个人信息。

安全标识符不会在不同的 API 或会话之间延续。如果你的应用已通过 `safety_identifier` 随 Responses API 请求一起发送，请在创建或连接每个 Realtime 会话时单独传递相同的稳定值。



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
  messages: [{role: :user, content: "Help me plan a study schedule."}],
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



### 潜在后果

如果 OpenAI 的监控系统发现潜在的滥用行为，我们可能会采取不同程度的措施：

- **延迟流式响应**
  - 作为针对可能违反策略的用户的初步、较低风险的干预措施，OpenAI 可能会延迟流式响应，在将完整响应返回给该用户之前运行额外的检查。
  - 如果检查通过，流式传输开始。如果检查失败，请求停止——不显示任何 token，流式响应也不会开始。
  - 为了获得更好的最终用户体验，建议在流式响应延迟时加入加载动画。
- **阻止单个用户的模型访问**
  - 在高置信度的策略违规情况下，关联的 `safety_identifier` 将被完全阻止访问 OpenAI 模型。
  - 该安全标识符会收到一个 `identifier blocked` 错误，出现在该标识符未来的所有 GPT-5 请求中。OpenAI 目前无法解除对单个标识符的阻止。

要使这些措施生效，请确保已部署相关控制，防止被封禁用户开设新账号。提醒一下，贵组织若反复违反政策，可能导致整个组织失去访问权限。

### 我们这样做的原因

具体的执行标准可能会根据不断发展的实际使用情况或新模型发布而变化。目前，OpenAI 可能会对存在风险或可疑生物或化学活动的安全标识符限制或阻止访问。详见 [博客文章](https://openai.com/index/preparing-for-future-ai-capabilities-in-biology/) ，了解我们如何在生物学领域应对更高 AI 能力的更多信息。

## 其他类型的安全检查

为了帮助确保你安全地使用 OpenAI API 和工具，我们会对我们自己的模型（包括所有微调模型）以及计算机使用工具运行安全检查。

了解更多：

- [模型评估中心](https://openai.com/safety/evaluations-hub)
- [网络安全模型](https://developers.openai.com/codex/cyber-safety)
- [微调安全性](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#safety-checks)
- [计算机使用中的安全检查](https://developers.openai.com/api/docs/guides/tools-computer-use#handle-user-confirmation-and-consent)