# Fast mode

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

Fast 模式可提供最高 2.5 倍的更快速度以及更稳定的延迟，同时保持按需付费的灵活性。Fast 模式非常适合对延迟有严格要求、流量稳定且面向用户的高价值应用。

Priority processing 已于 2026-07-30 更名为 Fast 模式。我们还提升了
  Fast 模式的运行速度，使其相比 `gpt-5.6-sol` 最高可达 2.5 倍
  快于 Standard 处理。你可以在请求中使用以下任一参数 `service_tier: "priority"`
  或 `service_tier: "fast"` 来访问该功能：API 请求。

## 配置 Fast 模式

你可以通过请求参数或项目设置，将对 Responses API 或 Chat Completions API 发起的请求配置为使用 Fast 模式。

若要为单个请求启用 Fast 模式，请设置 [`service_tier` 参数](https://platform.openai.com/docs/api-reference/responses/create#responses-create-service_tier) 为 `fast`。在项目设置中将 `service_tier` 为 `priority` 可为支持的模型提供相同的行为。

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


若要在项目级别启用，请打开 **设置**，选择 **通用** 下的 **项目**，并将 **项目服务层级** 为 **Fast**。未指定 `service_tier` 的请求将默认使用 Fast 模式。该项目的请求将随时间逐步迁移到 Fast 模式。

该 `service_tier` 字段在 [Responses](https://platform.openai.com/docs/api-reference/responses/object#responses/object-service_tier) 或 [Chat Completions](https://platform.openai.com/docs/api-reference/chat/object#chat/object-service_tier) response 对象标识了用于处理请求的层级。对于 GPT-5.6 及更早的模型，response 返回 `priority` 请求是否指定 `priority` 或 `fast`.

## 速率限制与爬升速率

**基线限制**

快速模式的消耗计入速率限制的方式与标准处理相同。使用你通常的重试逻辑，并在两次尝试之间稍作等待。对于同一模型，标准处理与快速模式共享同一速率限制。

**爬坡速率限制**

如果你的流量增长过快，系统可能会将部分快速模式请求降级为标准速度并按标准费率计费。发生这种情况时，响应中会包含 `service_tier: "default"`。如果你每分钟发送至少 100 万个 token（TPM），并在 15 分钟内将 TPM 提升超过 50%，则可能触发爬坡速率限制。

为避免触发爬坡速率限制：

- 在更换模型或快照时逐步增加流量。
- 使用功能开关在数小时内逐步迁移流量，而不是瞬时切换。
- 避免在 Fast 模式下运行大规模的抽取、转换和加载 (ETL) 或批处理任务。

## 使用注意事项

- Fast 模式按 token 在 Standard 处理基础上收取额外费用。详见 [定价页面](https://developers.openai.com/api/docs/pricing?latest-pricing=fast) 了解详情及支持的模型。
- 缓存输入折扣仍适用于 Fast 模式请求。
- Fast 模式支持多模态请求，包括图像输入。
- 要在用量面板中查看 Fast 模式请求，请选择按服务层级分组。对于 GPT-5.6 及更早的模型，这些请求会显示为 `priority` ，即使你指定了 `fast`.
- GPT-5.6 模型支持长上下文。Fast 模式不支持微调模型或嵌入。

## 常见问题解答

有关账户和政策信息，请参阅 [快速模式常见问题解答](https://help.openai.com/en/articles/11647665-priority-processing-faq).

### 快速模式在所有地区都可用吗？

可用性取决于各司法管辖区的法律法规。如果你对所在地区的可用性有疑问，请联系你的客户总监。

### Fast 模式如何与 Scale Tier 交互？

Scale Tier 和 Fast 模式是分开的。Fast 模式请求单独计费，不计入已购买的 Scale Tier TPM 套餐。Scale Tier 溢出流量不会自动转入 Fast 模式。

### Fast 模式如何计费？

Fast 模式相比 Standard 处理按 token 收取额外费用。所有处理模式都会计入你的年度 Enterprise 消费承诺，符合条件的输入缓存 token 可享受与 Standard 处理相同的折扣。

对于 GPT-5.6 Sol，Fast 模式的价格是相应 Standard 费率的两倍。短上下文请求的输入 token 价格为每 100 万 token 8 美元，输出 token 价格为每 100 万 token 40 美元；长上下文请求的输入 token 价格为每 100 万 token 16 美元，输出 token 价格为每 100 万 token 60 美元。GPT-5.6 Sol 的促销定价至少有效至 2026 年 11 月 21 日。详见 [定价详情](https://developers.openai.com/api/docs/pricing?latest-pricing=fast).

要查看用量，请打开用量仪表板，选择 Responses 或 Chat Completions，并按服务层级分组。要查看成本，请按条目分组。

### 哪些模型和模态支持 Fast 模式？

Fast 模式支持 Standard 处理所具备的多模态能力，包括图像输入。GPT-5.6 模型支持长上下文。Fast 模式不支持微调模型或 embeddings。未来推出的 GPT 模型可能会支持 Fast 模式，但并非每个模型都能保证获得支持。

### 增速限制是在项目还是组织之间共享？

是的，你所有的流量都会计入同一个 ramp rate 限制。如果你经常遇到 ramp rate 限制，可以考虑购买 Scale Tier 配额。

### 如果 Fast 模式未达到其延迟目标会怎样？

如果你有任何疑问或顾虑，请联系你的客户总监。Fast 模式和 Scale Tier 享有同等的服务级别协议待遇，当未达成相应目标时，符合条件的企业协议可能会提供服务积分。

### Fast 模式是否与数据驻留、零数据保留（Zero Data Retention）和 BAA 兼容？

是的。Fast 模式兼容数据驻留、零数据留存（Zero Data Retention）以及业务伙伴协议（BAA）。现有的端点、工具、资格和合同要求仍然适用。请参阅 [数据指南](https://developers.openai.com/api/docs/guides/your-data) 了解详情。