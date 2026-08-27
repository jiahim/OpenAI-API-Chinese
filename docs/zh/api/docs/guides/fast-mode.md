# 快速模式

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过将 `.md` 附加到页面 URL 获取 Markdown 版本的文档页面。

快速模式可提供高达 2.5 倍的速度和更一致的延迟，同时保持按需付费的灵活性。快速模式非常适合流量稳定、延迟要求高的高价值面向用户应用。

优先处理已于 2026 年 7 月 30 日更名为快速模式。我们还提升了
  快速模式的操作速度， `gpt-5.6-sol` 使其比标准处理快高达 2.5 倍。
  你可以在 API 请求中使用 `service_tier: "priority"`
  或 `service_tier: "fast"` 来访问此功能。

## 配置快速模式

你可以通过请求参数或项目设置，将发送至 Responses API 或 Chat Completions API 的请求配置为使用快速模式。

要为单个请求启用快速模式，请设置 [`service_tier` 参数](https://platform.openai.com/docs/api-reference/responses/create#responses-create-service_tier) 为 `fast`。设置 `service_tier` 为 `priority` 可为支持的模型提供相同的行为。

使用快速模式创建响应

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


要在项目级别启用，请打开 **设置**，选择 **常规** 下的 **项目**，并将 **项目服务层级** 更改为 **快速**。未指定 `service_tier` 的请求随后将默认使用快速模式。随着时间的推移，项目的请求将逐步过渡到快速模式。

该 `service_tier` 字段在 [Responses](https://platform.openai.com/docs/api-reference/responses/object#responses/object-service_tier) 或 [Chat Completions](https://platform.openai.com/docs/api-reference/chat/object#chat/object-service_tier) 响应对象中标识了用于处理请求的层级。对于 GPT-5.6 及更早的模型，响应返回 `priority` 请求是否指定 `priority` 或 `fast`.

## 速率限制与爬坡速率

**基线限制**

快速模式的消耗与标准处理一样计入速率限制。使用你惯用的重试逻辑，并在尝试之间等待。对于给定模型，标准处理和快速模式共享同一速率限制。

**爬升速率限制**

如果你的流量爬升过快，系统可能会将某些快速模式请求降级为标准速度并按标准费率收费。发生这种情况时，响应包含 `service_tier: "default"`。如果你每分钟发送至少100万token（TPM），并且在15分钟内将TPM增加超过50%，则可能适用爬升速率限制。

为避免触发爬升速率限制：

- 更换模型或快照时，应逐步提升流量。
- 使用功能开关在数小时内逐步转移流量，而非立即切换。
- 避免在 Fast 模式下运行大型提取、转换、加载（ETL）或批处理作业。

## 使用注意事项

- 快速模式按每个令牌收取高于标准处理费用的额外费用。详情请参阅 [定价页面](https://developers.openai.com/api/docs/pricing?latest-pricing=fast) 及支持的模型。
- 缓存输入折扣仍适用于快速模式请求。
- 快速模式支持多模态请求，包括图像输入。
- 要在使用情况仪表板中查看快速模式请求，请选择按服务层级分组的选项。对于GPT-5.6及更早的模型，这些请求显示为 `priority` 即使你指定 `fast`.
- GPT-5.6模型支持长上下文。快速模式不支持微调模型或嵌入。

## 常见问题

有关账户与政策信息，请参阅 [快速模式常见问题解答](https://help.openai.com/en/articles/11647665-priority-processing-faq).

### 快速模式是否在所有区域均可用？

可用性取决于各司法管辖区的法律法规。如果你对你所在地区的可用性有疑问，请联系你的客户总监。

### 快速模式如何与规模层级交互？

规模层级和快速模式是独立的。快速模式请求具有独立的计费，不计入已购买的规模层级 TPM 套餐。规模层级的溢出流量不会自动转移至快速模式。

### Fast 模式如何计费？

快速模式相比于标准处理，按每 token 收取额外费用。所有处理模式均计入年度企业支出承诺，符合条件的缓存输入 token 可享受与标准处理相同的折扣。

对于 GPT-5.6 Sol，快速模式的费用是相应标准费率的两倍。短上下文请求每 100 万输入 token 收费 8 美元，每 100 万输出 token 收费 40 美元；长上下文请求每 100 万输入 token 收费 16 美元，每 100 万输出 token 收费 60 美元。GPT-5.6 Sol 的促销定价至少持续到 2026 年 11 月 21 日。详见 [定价详情](https://developers.openai.com/api/docs/pricing?latest-pricing=fast).

要查看使用情况，请打开使用仪表盘，选择 Responses 或 Chat Completions，并按服务层级分组。要查看成本，请按计费项分组。

### 哪些模型和模态支持快速模式？

快速模式支持标准处理可用的多模态能力，包括图像输入。GPT-5.6 模型支持长上下文。快速模式不支持微调模型或嵌入。未来的 GPT 模型可能支持快速模式，但并非每个模型都保证支持。

### 爬坡速率限制是否在项目或组织之间共享？

是的。你的所有流量都计入相同的逐步提升速率限制（ramp rate limit）。如果你经常遇到逐步提升速率限制，可以考虑购买 Scale Tier 配额。

### 如果 Fast 模式未达到其延迟目标，会发生什么？

如有疑问或顾虑，请联系你的客户总监。快速模式与规模层级享受相同的服务等级协议待遇，符合条件的企业协议在未达到这些目标时可能提供服务积分。

### 快速模式是否与数据驻留、零数据保留和 BAA 兼容？

是的。快速模式与数据驻留、零数据保留以及业务伙伴协议（BAA）兼容。现有的端点、工具、资格和合同要求仍然适用。请参阅 [您的数据指南](https://developers.openai.com/api/docs/guides/your-data) 了解详情。