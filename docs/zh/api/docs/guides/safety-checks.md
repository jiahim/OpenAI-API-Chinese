# 安全检查

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

我们会对模型及其使用方式运行多种类型的评估。本指南介绍我们如何进行安全测试，以及你可以采取哪些措施来避免违规。

## GPT-5 及后续版本的安全分类器

随着 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5),我们新增了一些检查机制,以发现并阻止危险信息的访问。在使用场景广泛的应用程序中,用户可能会尝试将你的应用用于OpenAI策略之外的目的。

### 安全分类器流程

1. 我们将发往 GPT-5 的请求按风险阈值进行分级。
1. 如果你的组织反复触及高阈值，OpenAI 会返回错误并发送一封告警邮件。
1. 如果请求在规定的时间阈值（通常为七天）后仍然继续，我们会停止你的组织对 GPT-5 的访问。请求将不再可用。

### 如何避免错误、延迟和封禁

如果你的组织从事违反我们安全策略的可疑活动，我们可能会返回错误、限制模型访问，甚至封禁你的账户。以下安全措施可帮助我们识别高风险请求的来源，并封禁个别终端用户，而不是封禁你的整个组织。

- [实施安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) ，适用于个人用户与模型交互的产品。建议使用安全标识符，但这不是必需的。
- 如果你的用例依赖于访问我们限制较少的版本，以在生命科学领域开展有益的应用，请阅读我们的 [特别访问计划](https://help.openai.com/en/articles/11826767-life-science-research-special-access-program) ，看看你是否符合条件。

### 为单个用户实现安全标识符

该 `safety_identifier` 参数在 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) 和更早的 [Chat Completions API](https://developers.openai.com/api/reference/resources/chat)。中均可用。Realtime API 通过 `OpenAI-Safety-Identifier` 请求头支持同样的概念。要使用安全标识符，请为每个请求的最终用户提供一个稳定的 ID。对用户邮箱或内部用户 ID 进行哈希处理，以避免传递任何个人信息。

安全标识符不会在 API 或会话之间传递。如果你的应用已经随 `safety_identifier` 和 Responses API 请求一起发送，请在创建或连接每个 Realtime 会话时单独传入相同的稳定值。



Responses API

    Providing a safety identifier with the Responses API

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

如果 OpenAI 的监控系统识别出潜在的滥用行为，我们可能会采取不同级别的应对措施：

- **延迟流式响应**
  - 作为针对潜在违反策略用户的初步、后果较轻的干预措施，OpenAI 可能会在返回完整响应之前延迟流式响应，以便运行额外的检查。
  - 如果检查通过，则开始流式传输。如果检查失败，则请求停止——不会显示任何 token，流式响应也不会开始。
  - 为了提供更好的最终用户体验，建议在流式传输延迟的情况下添加加载旋转指示器。
- **针对单个用户阻止模型访问**
  - 在高置信度的策略违规情况下，相关的 `safety_identifier` 将被完全阻止访问 OpenAI 模型。
  - 该安全标识符会在所有针对相同标识符的 GPT-5 请求上收到 `identifier blocked` 错误。OpenAI 目前无法解除对单个标识符的阻止。

要让这些措施生效，请确保已部署相关控制，防止被封禁的用户开设新账号。提醒一下，你的组织若反复违反政策，可能会导致整个组织失去访问权限。

### 我们为何要这样做

具体的强制执行标准可能会根据不断变化的实际使用情况或新模型的发布而调整。目前，OpenAI 可能会限制或阻止具有风险性或可疑生物或化学活动的安全标识符的访问。请参阅 [博客文章](https://openai.com/index/preparing-for-future-ai-capabilities-in-biology/) 了解关于我们如何应对生物领域更高级 AI 能力的更多信息。

## 其他类型的安全检查

为了帮助你安全地使用 OpenAI API 和工具，我们会对我们的自有模型（包括所有微调模型）以及计算机使用工具运行安全检查。

了解更多信息：

- [模型评估中心](https://openai.com/safety/evaluations-hub)
- [网络安全模型](https://developers.openai.com/codex/cyber-safety)
- [微调安全性](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#safety-checks)
- [计算机使用中的安全检查](https://developers.openai.com/api/docs/guides/tools-computer-use#handle-user-confirmation-and-consent)