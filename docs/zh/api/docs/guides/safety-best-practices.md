# 安全最佳实践

> 完整的文档索引请参见 [llms.txt](/llms.txt)。通过在页面 URL 末尾添加 `.md` 可获取文档页面的 Markdown 版本。

有关 OpenAI 应用的安全措施，请参阅 [安全分类器](https://developers.openai.com/api/docs/guides/safety-checks), [网络安全检查](https://developers.openai.com/api/docs/guides/safety-checks/cybersecurity)，以及 [错位行为监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring)。如果你的应用面向未成年人，还应遵循 [18 岁以下用户指南](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance).

### 使用我们的免费 Moderation API

OpenAI 的 [Moderation API](https://developers.openai.com/api/docs/guides/moderation) 可免费使用，有助于降低你的补全中出现不安全内容的频率。或者，你也可以根据自身用例开发定制的内容过滤系统。

如果你的应用使用 Responses API 或 Chat Completions 生成文本，
你还可以 [在生成请求中请求审核评分
请求](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### 对抗性测试

建议对你的应用进行“红队测试”，以确保它能够抵御对抗性输入。在多样化的输入和用户行为下测试你的产品，既要覆盖具有代表性的用例，也要涵盖那些试图“破坏”你应用的行为。它是否会偏离主题？有人能否通过提示注入轻易地改变功能，例如“忽略之前的指令，改成执行这个”？

### Human in the loop (HITL)

我们建议尽可能在使用之前由人工审查输出。在高风险领域以及代码生成场景中，这一点尤为关键。人工应了解系统的各项限制，并能够访问验证输出所需的任何信息（例如，如果应用对笔记进行摘要，人工应能便捷地访问原始笔记以便回溯核对）。

### 提示工程

“提示工程”有助于约束输出文本的主题和语气。即便用户试图生成不良内容，这也能降低生成此类内容的概率。为模型提供额外的上下文（例如在新输入之前给出几个高质量的期望行为示例），可以更容易地将模型输出引导到期望的方向。

### “了解你的客户”（KYC）

通常情况下，用户需要注册并登录才能访问你的服务。将此服务关联到现有账户（例如 Gmail、LinkedIn 或 Facebook 账户）可能会有所帮助，但可能并不适合所有用例。要求提供信用卡或身份证可进一步降低风险。

### 约束用户输入并限制输出 tokens

限制用户在提示中输入的文本量有助于避免提示注入。限制输出 token 的数量有助于降低滥用风险。

缩小输入或输出的范围，尤其是从可信来源中选取的范围，可以减少应用内可能出现的滥用程度。

通过经过校验的下拉字段（例如维基百科上的电影列表）允许用户输入，比允许开放式文本输入更安全。

在可能的情况下，从后端一组经过校验的素材中返回输出，比返回新生成的内容更安全（例如，将客户查询路由到最匹配的现有客户支持文章，而不是尝试从头开始回答该查询）。

### 允许用户上报问题

用户通常应能通过便捷的方式（例如公开的电子邮件地址、工单提交方式等）报告应用行为中的异常功能或其他问题。该方式应由人工监控并根据需要作出响应。

### Understand and communicate limitations

从产生不准确信息（即“幻觉”），到输出带有冒犯性的内容，再到偏见，语言模型可能并不适合所有场景，除非经过重大改造。请考虑模型是否适合你的用途，并在各种潜在输入上评估该 API 的表现，以识别该 API 性能可能下降的情况。请考虑你的客户群体以及他们将使用的输入范围，并确保他们的期望得到合理的校准。

**在 OpenAI，安全与保障对我们至关重要**.

如果你在使用 API 进行开发或任何与 OpenAI 相关的事务时发现任何安全或安保问题，请通过我们的 [协同漏洞披露计划](https://openai.com/security/disclosure/).

### 实现安全标识符

在请求中发送安全标识符可以帮助 OpenAI 监控和检测滥用行为。这使得 OpenAI 能够在检测到你的应用存在任何违规行为时，为你的团队提供更具可操作性的反馈。

安全标识符还可以帮助你的团队更快地响应滥用行为。它们提供了一种稳定的方式来 追踪 活动到单个最终用户，从而降低单个用户的滥用行为干扰你更广泛组织的访问的可能性。

安全标识符应该是一个能唯一标识每个用户的字符串。请对用户名或电子邮件地址进行哈希处理，以避免向我们发送任何身份信息。如果你向未登录的用户提供产品预览，可以改为发送会话 ID。

对于个人用户与模型交互的产品，建议使用安全标识符，
但它们不是必需的。在你的 API
请求中通过以下 `safety_identifier` 参数传入：

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
"model": "gpt-6-astra",
"messages": [
{"role": "user", "content": "This is a test"}
],
"max_completion_tokens": 5,
"safety_identifier": "user123456"
}'
```


对于 Realtime API 请求，请通过
请求头提供相同的稳定且保护隐私的标识符。当你创建一个临时的 Realtime `OpenAI-Safety-Identifier` 客户端密钥时，在创建该
密钥的 服务端 请求中包含该请求头，
以便将标识符绑定到该会话。对于从受信后端发起的直接 WebSocket 或 WebRTC
连接请求，请在
连接请求中包含该请求头。

安全标识符不会在不同的 API 或会话之间传递。如果你的
应用已经通过 `safety_identifier` 随 Responses API 请求一起发送，请在创建或连接每个 Realtime
会话时单独传入相同的稳定值。
。

### 撤销已泄露的 API 密钥

如果你认为某个 API 密钥已经泄露、被滥用或以其他方式遭到破坏，
请立即撤销它并用新密钥替换。请前往你的 [安全
设置](https://platform.openai.com/settings/profile/security) 查看所有 API
密钥并撤销所有已泄露的密钥。

### CSAM 指南

OpenAI 与儿童安全领域的专家合作，包括 NCMEC 和 Thorn，为开发者提供
保护儿童的实用指南。 [阅读 CSAM
指南](https://developers.openai.com/api/docs/guides/csam-guidance).