# Fast mode

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取 Markdown 版本的文档页面。

Fast 模式可提供最高 2.5 倍的更快速度以及更稳定的延迟，并采用按量付费定价。适用于流量稳定且对延迟敏感的用户面应用。

如需在 GPT-6 Astra 或 GPT-6.1 Sol 上获得更快速度，请参阅 [极速模式](https://developers.openai.com/api/docs/guides/ultrafast-mode).

Priority processing 已于 2026/07/30 更名为 Fast 模式。我们还提升了
  Fast 模式的运行速度，使其相比 `gpt-5.6-sol` 最高提升至 2.5×
  比 Standard 处理更快。你可以在请求中使用 `service_tier: "priority"`
  或 `service_tier: "fast"` 来访问该功能，对应请求中包含 API 请求字段。

## 配置 Fast 模式

你可以配置对 Responses API 或 Chat Completions API 的请求，通过请求参数或项目设置来使用 Fast 模式。

要为单个请求启用 Fast 模式，请设置 [`service_tier` 参数](https://platform.openai.com/docs/api-reference/responses/create#responses-create-service_tier) 为 `fast`。在支持的模型上设置 `service_tier` 为 `priority` 可获得相同的行为。

使用 Fast 模式创建一个 response

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-6.1-sol",
  input: "What does 'fit check for my napalm era' mean?",
  service_tier: "fast",
});

console.log(response);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-6.1-sol",
    input="What does 'fit check for my napalm era' mean?",
    service_tier="fast",
)
print(response)
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
		Model:       "gpt-6.1-sol",
		ServiceTier: "fast",
		Input:       responses.ResponseNewParamsInputUnion{OfString: openai.String("What does 'fit check for my napalm era' mean?")},
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
        .model("gpt-6.1-sol")
        .input("What does 'fit check for my napalm era' mean?")
        .serviceTier(ResponseCreateParams.ServiceTier.of("fast"))
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
  model: "gpt-6.1-sol",
  service_tier: :fast,
  input: "What does 'fit check for my napalm era' mean?"
)

puts(response.output_text)
```

```bash
curl https://api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-6.1-sol",
    "input": "What does 'fit check for my napalm era' mean?",
    "service_tier": "fast"
  }'
```


要在项目级别启用，请打开 **Settings**，选择 **General** 在 **Project**，下，然后修改 **Project Service Tier** 为 **Fast**。未指定 `service_tier` 的请求会默认使用 Fast 模式。该项目的请求会随着时间逐步过渡到 Fast 模式。

该 `service_tier` 字段在 [Responses](https://platform.openai.com/docs/api-reference/responses/object#responses/object-service_tier) 或 [Chat Completions](https://platform.openai.com/docs/api-reference/chat/object#chat/object-service_tier) response 对象标识用于处理该请求的层级。对于 GPT-5.6 及更早的模型，响应会返回 `priority` 请求是否指定了 `priority` 或 `fast`.

## 速率限制与提升速率

**基线限额**

Fast 模式的消耗计入速率限制的方式与标准处理相同。请使用你通常的重试逻辑并在两次尝试之间等待。对于同一模型，标准处理和 Fast 模式共享相同的速率限制。

**增速速率限制**

如果你的流量增速过快，系统可能会将部分 Fast 模式请求降级为标准速度，并按标准费率计费。发生这种情况时，响应中会包含 `service_tier: "default"`。作为经验法则，当你的流量达到每分钟 100 万输入 token (TPM) 后，每 15 分钟的增幅不应超过 50%。增速速率限制的具体触发点可能因模型和流量状况而异。

为避免触发增速速率限制：

- 切换模型或快照时，逐步提高流量。
- 使用功能标志在数小时内逐步转移流量，而不是立即切换。
- 避免在 Fast 模式下运行大型提取、转换和加载（ETL）或批处理作业。

## 使用注意事项

- Fast 模式在 Standard 处理的基础上按 token 收取额外费用。详见 [定价页面](https://developers.openai.com/api/docs/pricing?latest-pricing=fast) 以了解详情及支持的模型。
- Fast 模式请求仍可享受输入缓存折扣。
- Fast 模式支持多模态请求，包括图像输入。
- 要在用量仪表盘中查看 Fast 模式请求，请选择按服务层级分组。对于 GPT-5.6 及更早模型，这些请求会显示为 `priority` 即使你指定的是 `fast`.
- GPT-5.6 模型支持长上下文。Fast 模式不支持微调模型或嵌入。

## 常见问题

有关账户和政策信息，请参阅 [Fast 模式常见问题解答](https://help.openai.com/en/articles/11647665-priority-processing-faq).

### 快速模式在所有地区都可用吗？

可用性取决于各司法管辖区的法律法规。如对所在地区的可用性有疑问，请联系你的客户经理。

### Fast 模式如何与 Scale Tier 交互？

Scale Tier 与 Fast 模式相互独立。Fast 模式请求单独计费，不计入已购买的 Scale Tier TPM 套餐。Scale Tier 的溢出流量不会自动转入 Fast 模式。

### 快速模式如何计费？

与 Standard 处理相比，快速模式按 token 加价。所有处理模式均计入你的年度 Enterprise 支出承诺，符合条件的缓存输入 token 可享受与 Standard 处理相同的折扣。

对于 GPT-5.6 Sol，快速模式的费用是相应 Standard 费率的两倍。短上下文请求每 100 万个输入 token 收费 $8，每 100 万个输出 token 收费 $40；长上下文请求每 100 万个输入 token 收费 $16，每 100 万个输出 token 收费 $60。GPT-5.6 Sol 的促销定价至少适用至 2026 年 11 月 21 日。请参阅 [定价详情](https://developers.openai.com/api/docs/pricing?latest-pricing=fast).

要查看用量，请打开用量仪表板，选择 Responses 或 Chat Completions，并按服务层级分组。要查看成本，请按行项目分组。

### 哪些模型和模态支持快速模式？

快速模式支持标准处理所具备的多模态功能，包括图像输入。GPT-5.6 模型支持长上下文。快速模式不支持微调模型或嵌入。未来的 GPT 模型可能会支持快速模式，但并非所有模型都保证支持。

### 速率斜率限制是在项目还是组织之间共享？

是的。你的所有流量都会计入同一个爬坡速率限制。如果你经常遇到爬坡速率限制，请考虑购买 Scale Tier 配额。

### 如果 Fast 模式未达到其延迟目标，会发生什么？

GPT-6 Astra 的快速模式不包含延迟 SLA。对于 GPT-5.6 及更早的模型，快速模式和 Scale Tier 享有同等的服务级别协议待遇，当延迟目标未达成时，符合条件的 Enterprise 协议可能提供服务额度。如果你有疑问或顾虑，请联系你的客户总监。

### Fast 模式是否与数据驻留、零数据保留和 BAA 兼容？

快速模式兼容数据驻留、零数据保留和业务伙伴协议 (BAA)，但具体取决于模型的可用性。快速模式支持 GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 的欧盟数据驻留。GPT-6 Astra 的快速模式不支持欧盟数据驻留。现有的端点、工具、资格和合同要求仍然适用。请参阅 [你的数据指南](https://developers.openai.com/api/docs/guides/your-data) 了解详情。