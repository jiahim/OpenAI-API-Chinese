# 安全最佳实践

> 完整文档索引请参阅 [llms.txt](/llms.txt)。如需获取页面的 Markdown 版本，可在页面 URL 末尾添加 `.md` 。

### 使用我们免费的 Moderation API

OpenAI的 [审核 API](https://developers.openai.com/api/docs/guides/moderation) 可以免费使用，并能帮助你降低补全结果中出现不安全内容的频率。你也可以根据自己的用例开发定制的内容过滤系统。

如果你的应用使用 Responses API 或 Chat Completions 生成文本，
你还可以 [在生成时请求审核打分
请求](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### 对抗性测试

我们建议对你的应用进行“红队测试”，以确保它在面对对抗性输入时具有足够的稳健性。使用各种输入和用户行为来测试你的产品，既包括一组具有代表性的用例，也包括那些试图“破坏”你应用的行为。它是否会偏离主题？是否有人可以通过提示注入轻易地重定向该功能，例如“忽略之前的指令，改成执行这个”？

### 人在回路（HITL）

在可能的情况下，我们建议在实际使用前由人工对输出进行审核。在高风险领域以及代码生成场景中，这一点尤为关键。相关人员应了解系统的局限性，并能够访问验证输出所需的任何信息（例如，如果应用对笔记进行摘要，相应人员应能便捷地查阅原始笔记以便回溯）。

### 提示工程

“提示工程”有助于约束输出文本的主题和语气。这降低了生成不良内容的几率，即使有用户试图生成此类内容。为模型提供额外上下文（例如在新的输入之前给出几个期望行为的高质量示例）可以更轻松地将模型输出引导到期望的方向。

### “了解你的客户”（KYC）

用户通常需要注册并登录才能访问你的服务。可以将此服务关联到现有账号（例如 Gmail、LinkedIn 或 Facebook 登录），这可能会有所帮助，但并非适用于所有用例。要求提供信用卡或身份证件可进一步降低风险。

### 约束用户输入并限制输出 token

限制用户在提示中可以输入的文本量有助于避免提示注入。限制输出令牌的数量有助于降低滥用的可能性。

收窄输入或输出的范围，尤其是来自可信来源的内容，可以减少应用内可能发生的滥用程度。

通过经过验证的下拉字段（例如维基百科上的电影列表）允许用户输入，比允许开放式文本输入更安全。

在后端从经过验证的材料集合中返回输出（如果可能）比返回新生成的内容更安全（例如，将客户查询路由到最匹配的现有客户支持文章，而不是从头尝试回答该查询）。

### 允许用户报告问题

用户通常应可通过便捷的方式报告应用行为中的异常功能或其他问题（例如提供电子邮箱地址、工单提交方式等）。该渠道应由人工监控，并酌情予以回应。

### 理解并说明各项限制

从生成不准确的信息，到产生不当输出，再到出现偏见等等，原始的语言模型未必适合每一种使用场景，需要进行大量修改。请考虑模型是否适合你的用途，并在广泛的潜在输入范围内评估 API 的性能，以识别 API 性能可能下降的情况。请考虑你的客户群体以及他们将使用的输入范围，并确保他们的期望得到合理的校准。

**安全与保障对 OpenAI 而言至关重要**.

如果你在使用 API 进行开发的过程中发现任何安全或保障相关的问题，或任何与 OpenAI 相关的问题，请通过我们的 [协调漏洞披露计划](https://openai.com/security/disclosure/).

### 实现安全标识符

在你的请求中发送安全标识符可以帮助 OpenAI 监控和检测滥用行为。当我们检测到你的应用存在任何违规行为时，这可以让 OpenAI 为你的团队提供更具可操作性的反馈。

安全标识符还可以帮助你的团队更快地应对滥用行为。它们提供了一种稳定的方式来 追踪 活动到单个终端用户，并降低某个用户的误用影响更广泛组织访问的可能性。

安全标识符应当是一个能够唯一标识每个用户的字符串。对用户名或电子邮件地址进行哈希处理，以避免向我们发送任何身份信息。如果你向未登录的用户提供产品预览，你可以改为发送会话 ID。

安全标识符推荐用于存在用户与模型交互的产品，
但并非强制要求。请在你的 API
请求中通过以下 `safety_identifier` 参数包含安全标识符：

示例：提供安全标识符

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.chat.completions.create({
  model: "gpt-5.6",
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


对于 Realtime API 请求，提供同样的稳定且保护隐私的标识符
，使用 `OpenAI-Safety-Identifier` 请求头。当你创建一个临时的 Realtime
客户端密钥时，请在创建该密钥的 服务端 请求中包含该请求头，
以便将标识符绑定到该会话。对于从受信后端发起的直接 WebSocket 或 WebRTC
连接请求，请在
连接请求中包含该请求头。

安全标识符不会在不同的 API 或会话之间传递。如果你的
应用已经使用 `safety_identifier` 随 Responses API 请求一起发送，请在创建或连接每个 Realtime
会话时单独传递相同的稳定值。
。

### 撤销已泄露的 API 密钥

如果你认为某个 API 密钥已被泄露、误用或以其他方式遭到破坏，
请立即撤销该密钥并用新密钥替换。进入你的 [Security
settings](https://platform.openai.com/settings/profile/security) 查看所有 API
密钥并撤销任何已泄露的密钥。

### CSAM 指南

OpenAI 与儿童安全领域的专家(包括 NCMEC 和 Thorn)合作,为开发者提供
保护儿童的实用指导。 [阅读 CSAM
指南](https://developers.openai.com/api/docs/guides/csam-guidance).