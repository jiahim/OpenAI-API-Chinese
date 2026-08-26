# 安全最佳实践

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过附加 .md 后缀，可获取文档页面的 Markdown 版本，只需在页面 URL 后加上 `.md` 即可。

### 使用我们的免费审核 API。

OpenAI 的 [审核 API](https://developers.openai.com/api/docs/guides/moderation) 可免费使用，有助于减少你的输出中不安全内容的出现频率。或者，你也可以开发适合自身用例的自定义内容过滤系统。

如果你的应用使用 Responses API 或 Chat Completions 生成文本，
你还可以在生成时 [请求审核分数
请求](https://developers.openai.com/api/docs/guides/moderation#moderate-generated-content).

### 对抗性测试

我们建议对你的应用进行“红队测试”，以确保它能够抵御对抗性输入。在广泛的输入和用户行为范围内测试你的产品，既要覆盖代表性样本，也要涵盖那些试图“破解”你应用的行为。它是否会偏离主题？有人是否能通过提示注入轻易地重定向该功能，例如“忽略之前的指令，改为执行这个”？

### 人在回路（HITL）

在可行的情况下，我们建议在实际使用前由人工审查输出。这在高风险领域以及代码生成中尤为关键。人工应了解系统的局限性，并能获取验证输出所需的任何信息（例如，如果应用程序总结笔记，人工应能轻松访问原始笔记以供参考）。

### 提示词工程

“提示工程”可以帮助约束输出文本的主题和语气。这降低了产生不良内容的风险，即使有用户试图诱导产生此类内容。向模型提供更多上下文（例如在新输入之前给出几个期望行为的高质量示例）可以更轻松地将模型输出引导至期望方向。

### “了解你的客户”(KYC)

用户通常需要注册并登录才能访问你的服务。将此服务与现有账户关联，例如 Gmail、LinkedIn 或 Facebook 登录，可能会有帮助，但可能不适用于所有用例。要求信用卡或身份证进一步降低风险。

### 限制用户输入并限制输出令牌

限制用户可以在提示中输入的文字量有助于避免提示注入。限制输出 token 的数量有助于降低滥用风险。

缩小输入或输出的范围，尤其是来自可信来源的内容，可以降低应用程序内可能发生的滥用程度。

允许用户通过经过验证的下拉字段输入（例如，维基百科上的电影列表）可能比允许开放式文本输入更安全。

在可能的情况下，从经过验证的后端材料集中返回输出，比返回新颖的生成内容更安全（例如，将客户查询路由到最佳匹配的现有客户支持文章，而不是尝试从头开始回答该查询）。

### 允许用户报告问题

用户通常应有一种便于使用的方式来报告不当功能或其他与应用行为相关的问题（如列出的邮箱地址、工单提交方式等）。该方法应由人工监控，并酌情予以回应。

### 理解并沟通限制

从产生不准确信息的幻觉，到冒犯性输出，再到偏见等等，语言模型在未经重大修改的情况下可能并不适合所有用例。请考虑模型是否适合你的用途，并在广泛的潜在输入上评估API的性能，以识别API性能可能下降的情况。考虑你的客户群以及他们将使用的输入范围，并确保他们的期望得到适当校准。

**安全与安保对我们OpenAI而言非常重要**.

如果在使用API开发或与OpenAI相关的其他方面发现任何安全或安保问题，请通过我们的 [协调漏洞披露计划](https://openai.com/security/disclosure/).

### 实现安全标识符

在请求中发送安全标识符可以帮助 OpenAI 监控并检测滥用行为。这样，当我们在你的应用程序中检测到任何违反政策的情况时，OpenAI 可以为你的团队提供更具可操作性的反馈。

安全标识符还可以帮助你的团队更快地响应滥用事件。它们提供了一种稳定的方式，将活动追踪到单个最终用户，并降低一个用户的滥用行为对更广泛组织访问造成干扰的风险。

安全标识符应是一个能唯一标识每个用户的字符串。对用户名或电子邮件地址进行哈希处理，以避免向我们发送任何身份识别信息。如果你向未登录用户提供产品预览，可以改为发送会话 ID。

对于单个用户与模型
交互的产品，建议使用安全标识符，但并非必需。在你的 API
请求中通过 `safety_identifier` 参数包含安全标识符：

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


对于 Realtime API 请求，请提供相同的、隐私保护的稳定标识符
通过 `OpenAI-Safety-Identifier` 请求头。当你创建临时的 Realtime
客户端密钥时，请在创建该密钥的服务端请求中包含此请求头，
以便标识符绑定到该会话。对于从受信任的后端发起的直接 WebSocket 或 WebRTC
连接请求，请在
连接请求中包含此请求头。

安全标识符不会在 API 或会话之间传递。如果你的
应用程序已经在 `safety_identifier` Responses API 请求中发送了
，请在创建或连接每个 Realtime
会话时单独传递相同的稳定值。

### 撤销已泄露的 API 密钥

如果你认为某个API密钥已被泄露、误用或遭到其他方式破坏，
请立即撤销该密钥并用新密钥替换。前往你的 [安全
设置](https://platform.openai.com/settings/profile/security) 查看所有API
密钥并撤销任何已遭破坏的密钥。

### CSAM 指南

OpenAI 已与儿童安全专家（包括 NCMEC 和 Thorn）合作，为
开发者提供保护儿童的实用指南。 [阅读 CSAM
指南](https://developers.openai.com/api/docs/guides/csam-guidance).