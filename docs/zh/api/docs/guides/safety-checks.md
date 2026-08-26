# 安全检查

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

我们对模型及其使用方式运行多种类型的评估。本指南介绍我们如何进行安全测试，以及你可以采取哪些措施来避免违规。

## GPT-5 及后续版本的安全分类器

随着 [GPT-5](https://developers.openai.com/api/docs/models/gpt-5)，的推出，我们增加了一些检查，以发现并阻止访问危险信息。很可能有些用户最终会尝试将你的应用用于OpenAI政策之外的目的，尤其是在具有广泛用例的应用中。

### 安全分类器流程

1. 我们将对 GPT-5 的请求分类为风险阈值。
1. 如果你的组织反复达到高风险阈值，OpenAI 会返回错误并发送警告邮件。
1. 如果请求在规定的时限（通常为七天）后继续进行，我们将停止你组织对 GPT-5 的访问。请求将不再工作。

### 如何避免错误、延迟和封禁

如果你的组织从事违反我们安全政策的可疑活动，我们可能会返回错误、限制模型访问，甚至封禁你的账户。以下安全措施有助于我们识别高风险请求的来源，并阻止单个最终用户，而不是阻止你的整个组织。

- [实现安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) 适用于个别用户与模型交互的产品。建议但不强制要求使用安全标识符。
- 如果你的用例依赖于访问我们服务的受限较少的版本，以便在生命科学领域开展有益应用，请阅读我们的 [特殊访问计划](https://help.openai.com/en/articles/11826767-life-science-research-special-access-program) 以了解你是否符合条件。

### 为个体用户实现安全标识符

该 `safety_identifier` 参数在 [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) 和较旧的 [Chat Completions API](https://developers.openai.com/api/reference/resources/chat)。中均可用。Realtime API 通过 `OpenAI-Safety-Identifier` 标头支持相同的概念。要使用安全标识符，请在每次请求中为最终用户提供稳定 ID。对用户电子邮件或内部用户 ID 进行哈希处理，以避免传递任何个人信息。

安全标识符不会在 API 或会话之间延续。如果你的应用已向 `safety_identifier` 请求发送带有 Responses API 的相同稳定值，请在创建或连接每个 Realtime 会话时单独传递该值。



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

如果OpenAI监控系统识别到潜在的滥用行为，我们可能会采取不同级别的措施：

- **延迟流式响应**
  - 作为对可能违反政策的用户的初步低影响干预，OpenAI 可能会延迟流式响应，同时运行额外检查，然后再向该用户返回完整响应。
  - 如果检查通过，流式传输开始。如果检查失败，请求停止——不会显示任何 token，流式响应也不会开始。
  - 为了更好的最终用户体验，可考虑在流式传输延迟时添加加载指示器。
- **对个别用户的模型访问封锁**
  - 在高置信度的政策违规情况下，相关 `safety_identifier` 将被完全阻止访问 OpenAI 模型。
  - 该安全标识符在之后所有针对同一标识符的 GPT-5 请求中都会收到 `identifier blocked` 错误。OpenAI 目前无法解除对单个标识符的封锁。

为了使这些屏蔽机制有效，请确保你已部署相应控制措施，防止被屏蔽的用户重新注册新账户。提醒一下，你所在组织若屡次违反政策，可能导致整个组织失去访问权限。

### 我们为什么这样做

具体的执行标准可能会随着现实世界使用情况的变化或新模型的发布而调整。目前，OpenAI 可能会对具有高风险或可疑生物学或化学活性的安全标识符限制或阻止访问。请参阅 [博客文章](https://openai.com/index/preparing-for-future-ai-capabilities-in-biology/) 以获取更多关于我们如何处理生物学中更高 AI 能力的信息。

## 其他类型的安全检查

为确保你在使用 OpenAI API 和工具时的安全，我们会对自己的模型（包括所有微调模型）以及计算机使用工具运行安全检查。

了解更多：

- [模型评估中心](https://openai.com/safety/evaluations-hub)
- [网络安全模型](https://developers.openai.com/codex/cyber-safety)
- [微调安全](https://developers.openai.com/api/docs/guides/supervised-fine-tuning#safety-checks)
- [计算机使用中的安全检查](https://developers.openai.com/api/docs/guides/tools-computer-use#handle-user-confirmation-and-consent)