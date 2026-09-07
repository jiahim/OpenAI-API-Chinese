# Fast mode

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

Fast 模式可提供高达 2.5× 的更快速度与更稳定的延迟,同时保留按量付费的灵活性。Fast 模式非常适合对延迟要求极高的高价值、面向用户且流量稳定的应用。

Priority processing 已于 2026-07-30 重命名为 Fast 模式。我们还提升了 Fast 模式在
  上的运行速度,使其相比 Standard 处理最高可快 `gpt-5.6-sol` 至 2.5×。
  你可以在 API 请求中使用 `service_tier: "priority"`
  或 `service_tier: "fast"` 来访问该功能。

## 配置 Fast 模式

你可以配置对 Responses API 或 Chat Completions API 的请求，通过请求参数或项目设置来使用 Fast 模式。

要为单个请求启用 Fast 模式，请设置 [`service_tier` 参数](https://platform.openai.com/docs/api-reference/responses/create#responses-create-service_tier) 为 `fast`。设置 `service_tier` 为 `priority` 为支持的模型提供相同的行为。

使用 Fast 模式创建响应

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.6-sol",
  input: "What does 'fit check for my napalm era' mean?",
  service_tier: "fast",
});

console.log(response);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6-sol",
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
		Model:       "gpt-5.6-sol",
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
        .model("gpt-5.6-sol")
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
  model: "gpt-5.6-sol",
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
    "model": "gpt-5.6-sol",
    "input": "What does 'fit check for my napalm era' mean?",
    "service_tier": "fast"
  }'
```


要在项目级别启用，请打开 **Settings**，选择 **General** 在 **Project**，下，并将 **Project Service Tier** 为 **Fast**。未指定 `service_tier` 的请求将默认使用 Fast 模式。该项目的请求会随时间逐步过渡到 Fast 模式。

该 `service_tier` 字段在 [Responses](https://platform.openai.com/docs/api-reference/responses/object#responses/object-service_tier) 或 [Chat Completions](https://platform.openai.com/docs/api-reference/chat/object#chat/object-service_tier) response 对象用于标识处理该请求所用的层级。对于 GPT-5.6 及更早的模型，响应会返回 `priority` 请求是否指定了 `priority` 或 `fast`.

## 速率限制与速率提升

**基线限额**

快速模式的用量计入速率限额的方式与标准处理相同。使用你平时的重试逻辑并在重试之间等待。对于同一个模型，标准处理和快速模式共享相同的速率限额。

**爬坡速率限制**

如果你的流量增长过快，系统可能会将部分快速模式请求降级为标准速度并按标准费率计费。发生这种情况时，响应中包含 `service_tier: "default"`。作为经验法则，当你的流量达到每分钟 100 万输入 token（TPM）后，每 15 分钟的增长幅度不要超过 50%。爬坡速率限制的精确触发阈值可能因模型和流量情况而异。

为避免触发爬坡速率限制：

- 更换模型或快照时逐步加大流量。
- 使用特性开关在数小时内逐步转移流量，而不是瞬时切换。
- 避免在 Fast 模式下运行大型抽取、转换和加载 (ETL) 或批处理作业。

## 使用注意事项

- Fast 模式按令牌收取相比 Standard 处理方式的溢价。详见 [定价页面](https://developers.openai.com/api/docs/pricing?latest-pricing=fast) 了解详情和支持的模型。
- 缓存输入折扣仍然适用于 Fast 模式请求。
- Fast 模式支持多模态请求，包括图像输入。
- 要在用量仪表板中查看 Fast 模式请求，请选择按服务层级分组的选项。对于 GPT-5.6 及更早模型，这些请求会显示为 `priority` 即使你在请求中指定 `fast`.
- GPT-5.6 模型支持长上下文。Fast 模式不支持微调模型或嵌入。

## 常见问题

有关账户和政策信息，请参阅 [Fast mode FAQ](https://help.openai.com/en/articles/11647665-priority-processing-faq).

### 快速模式是否在所有地区可用？

可用性取决于各司法管辖区的法律法规。如有关于所在地区可用性的问题，请联系你的客户总监。

### Fast 模式如何与 Scale Tier 交互？

Scale Tier 和 Fast mode 是分开的。Fast mode 请求单独计费，不计入已购买的 Scale Tier TPM 套餐。Scale Tier 的溢出流量不会自动转移到 Fast mode。

### Fast 模式如何计费？

Fast 模式按 token 收取溢价，费率高于 Standard 处理。所有处理模式都会计入你的年度 Enterprise 消费承诺，且符合资格的缓存输入 token 享有与 Standard 处理相同的折扣。

对于 GPT-5.6 Sol，Fast 模式的价格是相应 Standard 费率的两倍。短上下文请求的输入 token 价格为每 100 万 $8，输出 token 价格为每 100 万 $40；长上下文请求的输入 token 价格为每 100 万 $16，输出 token 价格为每 100 万 $60。GPT-5.6 Sol 的促销定价至少持续到 2026 年 11 月 21 日。详见 [定价详情](https://developers.openai.com/api/docs/pricing?latest-pricing=fast).

要查看用量，请打开用量面板，选择 Responses 或 Chat Completions，并按服务层级分组。要查看费用，请按账单条目分组。

### 哪些模型和模态支持 Fast 模式？

快速模式支持标准处理可用的多模态能力，包括图像输入。GPT-5.6 模型支持长上下文。快速模式不支持微调模型或 embeddings。未来的 GPT 模型可能会支持快速模式，但并非每个模型都保证支持。

### 速率增长限制是在项目之间还是组织之间共享？

是的。你所有的流量都会计入同一个 ramp rate limit。如果经常遇到 ramp rate limit，可以考虑购买 Scale Tier 配额。

### 如果 Fast 模式未达到其延迟目标会发生什么？

GPT-6 Astra 的快速模式不包含延迟 SLA。对于 GPT-5.6 及更早模型，快速模式和 Scale Tier 享有相同的服务等级协议待遇，当延迟目标未达成时，符合条件的 Enterprise 协议可能会提供服务额度。如果你有疑问或顾虑，请联系你的客户总监。

### Fast 模式是否与数据驻留、零数据留存和 BAA 兼容？

Fast 模式兼容数据驻留、零数据保留和业务合作协议 (BAA)，具体取决于各模型的可用性。GPT-6 Astra 不支持在 EU 数据驻留下使用 Fast 模式。现有端点、工具、资格和合同要求仍然适用。详见 [数据指南](https://developers.openai.com/api/docs/guides/your-data) 了解详情。