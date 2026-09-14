# 安全最佳实践

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

有关 OpenAI 所施加的安全防护措施,请参阅 [安全分类器](https://developers.openai.com/api/docs/guides/safety-checks), [网络安全检查](https://developers.openai.com/api/docs/guides/safety-checks/cybersecurity)，以及 [失准监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring)。如果你的应用程序面向未成年人,请同时遵循 [18 岁以下用户指引](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance).

### 使用我们的免费 Moderation API

OpenAI 的 [审核 API](https://developers.openai.com/api/docs/guides/moderation) 可以免费使用，并有助于降低你补全内容中不安全内容的出现频率。或者，你也可以根据自身使用场景开发定制的内容过滤系统。

如果你的应用通过 Responses API 或 Chat Completions 生成文本，
你还可以 [在生成请求中请求审核分数
请求](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### 对抗性测试

我们推荐对你的应用进行“红队测试”，以确保它对对抗性输入具有稳健性。使用范围广泛的输入和用户行为来测试你的产品，既包括一组具有代表性的输入和行为，也包括那些反映有人试图“破坏”你应用的输入和行为。它是否会偏离主题？是否有人可以通过提示注入轻易地重定向该功能，例如“忽略之前的指令，改成这样做”？

### 人在环路 (HITL)

在条件允许的情况下，我们建议在实际使用前由人工对输出进行审核。在高风险领域以及代码生成场景中，这一点尤为关键。相关人员应了解系统的各项限制，并能够访问验证输出所需的全部信息（例如，若应用对笔记进行摘要，相关人员应能便捷地查阅原始笔记以供回溯）。

### 提示工程

“提示工程”有助于约束输出文本的主题和语气。这样即使用户尝试产生此类输出，也会降低产生非预期内容的概率。向模型提供额外的上下文（例如在新的输入之前给出几个期望行为的优质示例），可以更容易地将模型输出引导到期望的方向。

### “了解你的客户”(KYC)

用户通常需要注册并登录才能访问你的服务。将该服务关联到现有账号（如 Gmail、LinkedIn 或 Facebook 登录）可能会有所帮助，但并不一定适用于所有使用场景。要求提供信用卡或身份证可进一步降低风险。

### 约束用户输入并限制输出令牌数

限制用户在提示中输入的文本量有助于避免提示注入。限制输出 token 的数量有助于降低滥用的可能性。

缩小输入或输出的范围（尤其是来自可信来源的内容）可以减少应用程序内可能发生的滥用程度。

通过经过验证的下拉字段（例如维基百科上的电影列表）允许用户输入，比允许开放式文本输入更安全。

在可能的情况下，从后端经过验证的素材集合中返回输出，比返回新生成的内容更安全（例如，将客户查询路由到最匹配的现有客户支持文章，而不是尝试从头回答该查询）。

### 允许用户反馈问题

用户通常应当能够通过便捷的方式举报应用行为中的不当功能或其他问题（例如公开的电子邮件地址、工单提交方式等）。该方式应当由人工进行监控，并酌情作出回应。

### 理解并说明局限性

从编造不准确信息，到产生冒犯性输出，再到偏见以及其他诸多问题，语言模型可能并不适用于所有场景，除非进行重大修改。请考虑该模型是否适合你的用途，并在各种潜在输入上对 API 的表现进行评估，以识别 API 性能可能下降的情况。考虑你的客户群体及其将使用的输入范围，并确保他们的预期得到合理校准。

**安全与保障对 OpenAI 而言至关重要**.

如果你在使用 API 进行开发时，或在与 OpenAI 相关的任何其他地方发现任何安全或安保问题，请通过我们的 [协同漏洞披露计划](https://openai.com/security/disclosure/).

### 实现安全标识符

在请求中发送安全标识符可以帮助 OpenAI 监控和检测滥用行为。当我们在你的应用中发现任何违反策略的情况时，这可以让 OpenAI 为你的团队提供更具可操作性的反馈。

安全标识符还可以帮助你的团队更快地响应滥用行为。它们创建了一种稳定的方式来 追踪 活动回溯到单个终端用户，并降低某个用户的误用影响更广泛组织访问的可能性。

安全标识符应该是一个能够唯一标识每个用户的字符串。请对用户名或电子邮件地址进行哈希处理，以避免向我们发送任何识别信息。如果你向未登录的用户提供产品预览，可以改用会话 ID。

安全标识符推荐用于个人用户与
模型交互的产品，但它们并非必需。请在 API
请求中通过以下 `safety_identifier` 参数传递：

示例：提供安全标识符

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.chat.completions.create({
  model: "gpt-6-astra",
  messages: [{ role: "user", content: "This is a test" }],
  max_completion_tokens: 5,
  safety_identifier: "user_123456",
});

console.log(response.choices[0].message.content);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-6-astra",
    messages=[{"role": "user", "content": "This is a test"}],
    max_completion_tokens=5,
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
		Model:               "gpt-6-astra",
		Messages:            []openai.ChatCompletionMessageParamUnion{openai.UserMessage("This is a test")},
		MaxCompletionTokens: openai.Int(5),
		SafetyIdentifier:    openai.String("user_123456"),
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
        .model("gpt-6-astra")
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
  model: "gpt-6-astra",
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
"model": "gpt-6-astra",
"messages": [
{"role": "user", "content": "This is a test"}
],
"max_completion_tokens": 5,
"safety_identifier": "user123456"
}'
```


对于 Realtime API 请求，请通过相同的
参数提供相同的稳定且保护隐私的标识符 `OpenAI-Safety-Identifier` header。创建临时 Realtime
客户端密钥时，请在创建该密钥的服务端请求中包含此 header，以便将标识符绑定到该会话。对于来自受信后端的直接 WebSocket 或 WebRTC
连接请求，请在连接请求中包含此 header。
连接请求中包含此 header。
连接请求。

安全标识符不会在不同的 API 或会话之间传递。如果你的应用已经通过 响应接口 请求发送
了安全标识符，请在每次创建或连接 Realtime `safety_identifier` 随 Responses API 请求一起传递，请在创建或连接每个 Realtime
会话时单独传入相同的稳定值。
会话。

### 撤销已泄露的 API 密钥

如果你认为某个 API 密钥已泄露、被误用或以其他方式遭到破坏，
请立即撤销该密钥并使用新密钥替换。前往你的 [安全
settings](https://platform.openai.com/settings/profile/security) 查看所有 API
密钥并撤销任何已泄露的密钥。

### CSAM 指引

OpenAI 与 NCMEC 和 Thorn 等儿童安全领域的专家合作，为开发者提供保护儿童的实用指导。
面向开发者提供保护儿童的实用指导。 [阅读 CSAM
指南](https://developers.openai.com/api/docs/guides/csam-guidance).