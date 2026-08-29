# 安全最佳实践

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。你也可以在页面 URL 末尾追加 `.md` 来获取对应页面的 Markdown 版本。

### 使用我们的免费 Moderation API

OpenAI 的 [Moderation API](https://developers.openai.com/api/docs/guides/moderation) 可免费使用，并有助于降低补全内容中出现不安全内容的频率。你也可以自行构建适合你用例的内容过滤系统。

如果你的应用使用 Responses API 或 Chat Completions 生成文本，
你还可以 [在生成请求中请求 moderation 评分
请求](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### 对抗性测试

我们建议对应用进行“红队测试”，以确保它对对抗性输入具有鲁棒性。在广泛且多样化的输入和用户行为上测试你的产品，既要覆盖有代表性的样本，也要覆盖那些试图“破坏”你应用的行为。它是否会偏离主题？是否有人能通过提示注入轻松重定向该功能，例如“忽略之前的指令，改做这件事”？

### 人在回路（HITL）

只要条件允许，我们建议在实际使用前由人工对输出进行审核。这在高风险领域以及代码生成场景中尤为关键。审核人员应了解系统的局限性，并能够访问验证输出所需的全部信息（例如，如果应用是对笔记进行摘要，审核人员应能方便地查阅原始笔记以做参照）。

### Prompt engineering

“提示工程”有助于约束输出文本的主题和语气。这样即使用户试图生成不希望出现的内容，也能降低生成此类内容的概率。为模型提供额外上下文（例如在新的输入之前给出几个高质量的期望行为示例），可以更容易地将模型输出引导到期望的方向上。

### “Know your customer”（KYC）

用户通常需要注册并登录才能访问你的服务。将此服务链接到现有账号（例如 Gmail、LinkedIn 或 Facebook 登录）可能会有所帮助，但并非适用于所有用例。要求提供信用卡或身份证件可进一步降低风险。

### 约束用户输入并限制输出 token 数量

限制用户在提示中可输入的文本量有助于避免提示注入。限制输出 token 的数量有助于减少滥用的可能。

缩小输入或输出的范围，尤其是来自可信来源的范围，可以降低应用内可能出现的滥用程度。

通过经过验证的下拉字段（例如，维基百科上的电影列表）允许用户输入，比允许开放式文本输入更安全。

在可能的情况下，从后端一组经过验证的资料中返回输出，比返回全新生成的内容更安全（例如，将客户查询路由到最匹配的现有客户支持文章，而不是尝试从头回答该查询）。

### 允许用户报告问题

用户通常应有一种便捷的方法来举报应用功能异常或对应用行为的其他顾虑（例如公开的电子邮件地址、工单提交方式等）。该方法应有人工监控并酌情予以响应。

### 理解并传达各项限制

从虚构不准确的信息，到具有攻击性的输出，再到偏见以及其他诸多问题，语言模型如果不进行大量修改，可能并不适合每一种使用场景。请考虑模型是否适合你的用途，并在尽可能广泛的潜在输入范围内评估 API 的性能，以识别 API 性能可能下降的场景。请考虑你的用户群体以及他们将使用的输入范围，并确保他们的期望得到恰当的校准。

**安全与保障对 OpenAI 而言至关重要。**.

如果你在使用 API 开发的过程中，或在任何与 OpenAI 相关的内容中，发现任何安全或保障问题，请通过我们的 [协调漏洞披露计划](https://openai.com/security/disclosure/).

### 实现安全标识符

在请求中发送安全标识符可以帮助 OpenAI 监控和检测滥用行为。这使得 OpenAI 能够在检测到你的应用存在任何策略违规时，向你的团队提供更具可操作性的反馈。

安全标识符还可以帮助你的团队更快地响应滥用行为。它们创建了一种稳定的方式来 追踪 与单个最终用户相关的活动，并降低因某个用户的误用而影响整个组织访问的可能性。

安全标识符应该是一个能够唯一标识每个用户的字符串。对用户名或电子邮件地址进行哈希处理，以避免向我们发送任何可识别信息。如果你向未登录的用户提供产品预览，可以改为发送会话 ID。

对于单个用户与模型交互的产品，建议使用安全标识符，
但并非必需。请将安全标识符包含在你的 API 请求中。
使用 `safety_identifier` 参数：

示例：提供安全标识符

```python
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-5.6",
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
		Model:               "gpt-5.6",
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
        .model("gpt-5.6")
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
  model: "gpt-5.6",
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
"model": "gpt-5.6",
"messages": [
{"role": "user", "content": "This is a test"}
],
"max_completion_tokens": 5,
"safety_identifier": "user123456"
}'
```


对于 Realtime API 请求，请提供相同的稳定且保护隐私的标识符
使用 `OpenAI-Safety-Identifier` 请求头。当你创建一个临时 Realtime
客户端密钥时，请在创建该密钥的服务端请求中携带该请求头，以便将标识符绑定到该会话。对于从受信后端发起的直接 WebSocket 或 WebRTC
连接请求，请在创建该密钥的请求中携带该请求头，以便将标识符绑定到该会话。对于从受信后端发起的直接 WebSocket 或 WebRTC
连接请求中携带该请求头。
连接请求。

安全标识符不会在 API 或会话之间传递。如果你的
应用程序已经发送 `safety_identifier` 随 Responses API 请求一起发送，请在创建或连接每个 Realtime
会话时单独传入相同的稳定值，
会话。

### 撤销已泄露的 API 密钥

如果你认为某个 API 密钥已泄露、被滥用或以其他方式遭到破坏，
请立即撤销该密钥并替换为新密钥。请前往你的 [安全
设置](https://platform.openai.com/settings/profile/security) 查看所有 API
密钥并撤销任何已泄露的密钥。

### CSAM 指南

OpenAI 与 NCMEC、Thorn 等儿童安全领域的专家合作，为
开发者提供保护儿童的实用指引。 [阅读 CSAM
指引](https://developers.openai.com/api/docs/guides/csam-guidance).