# Fast mode

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

Fast 模式可提速高达 2.5 倍，并能保持更稳定的延迟，同时保留按量付费的灵活性。对于高价值、面向用户且流量稳定、对延迟要求极高的应用，Fast 模式是理想之选。

Priority 处理已于 2026 年 7 月 30 日更名为 Fast 模式。我们还提升了
  Fast 模式的运行速度，达到 `gpt-5.6-sol` 最高 2.5 倍
  比 Standard 处理速度更快。你可以使用以下任一方式 `service_tier: "priority"`
  或 `service_tier: "fast"` 在你的 API 请求中使用，以访问此功能。

## 配置 Fast 模式

你可以通过请求参数或项目设置，将发往 Responses API 或 Chat Completions API 的请求配置为使用 Fast 模式。

要为单个请求启用 Fast 模式，请设置 [`service_tier` 参数](https://platform.openai.com/docs/api-reference/responses/create#responses-create-service_tier) 为 `fast`。设置 `service_tier` 为 `priority` 可为支持的模型提供相同的行为。

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


要在项目级别启用，请打开 **Settings**，在 **General** 下选择 **Project**，并将 **Project Service Tier** 为 **Fast**。未指定 `service_tier` 的请求随后将默认为 Fast 模式。该项目的请求会随时间逐步切换到 Fast 模式。

该 `service_tier` 字段（在 [Responses](https://platform.openai.com/docs/api-reference/responses/object#responses/object-service_tier) 或 [Chat Completions](https://platform.openai.com/docs/api-reference/chat/object#chat/object-service_tier) response 对象用于标识处理请求所使用的层级。对于 GPT-5.6 及更早的模型，响应会返回 `priority` 请求是否指定了 `priority` 或 `fast`.

## 速率限制与速率爬升

**基线限额**

Fast 模式的消耗计入速率限额的方式与 Standard 处理相同。使用你通常的重试逻辑并在两次尝试之间等待。对于给定的模型，Standard 处理和 Fast 模式共享相同的速率限额。

**速率增幅限制**

如果你的流量增速过快，系统可能会将部分 Fast 模式请求降级为标准速度并按标准费率计费。发生这种情况时，响应中会包含 `service_tier: "default"`。一般来说，当你的流量达到每分钟 100 万个输入 token（TPM）时，每 15 分钟的增加幅度不应超过 50%。速率增幅限制的具体触发点可能因模型和流量状况而异。

为避免触发速率增幅限制：

- 更换模型或快照时逐步提升流量。
- 使用特性开关在数小时内迁移流量，而非瞬时切换。
- 避免在 Fast 模式下运行大规模的抽取、转换和加载 (ETL) 或批处理作业。

## 使用注意事项

- Fast 模式在按 token 计费上比 Standard 处理收取溢价。详见 [定价页面](https://developers.openai.com/api/docs/pricing?latest-pricing=fast) 了解详情和支持的模型。
- 缓存输入折扣仍然适用于 Fast 模式请求。
- Fast 模式支持多模态请求，包括图像输入。
- 要在用量面板中查看 Fast 模式请求，请选择按服务层级分组。对于 GPT-5.6 及更早的模型，这些请求会显示为 `priority` 即使你指定了 `fast`.
- GPT-5.6 模型支持长上下文。Fast 模式不支持微调模型或嵌入模型。

## 常见问题

有关账户和政策信息，请参阅 [Fast mode FAQ](https://help.openai.com/en/articles/11647665-priority-processing-faq).

### 快速模式在所有地区都可用吗？

可用性取决于各司法管辖区的法律法规。如果你对所在地区的可用性有疑问，请联系你的客户总监。

### 快速模式如何与规模层级交互？

Scale Tier 与 Fast 模式相互独立。Fast 模式请求单独计费，不计入已购买的 Scale Tier TPM 套餐额度。Scale Tier 的溢出流量不会自动迁移到 Fast 模式。

### Fast 模式如何计费？

Fast 模式相比 Standard 处理按 token 收取溢价。所有处理模式都计入你的年度 Enterprise 消费承诺，符合条件的缓存输入 token 享受与 Standard 处理相同的折扣。

对于 GPT-5.6 Sol，Fast 模式的费用是相应 Standard 费率的两倍。短上下文请求的输入 token 价格为每百万 8 美元，输出 token 价格为每百万 40 美元；长上下文请求的输入 token 价格为每百万 16 美元，输出 token 价格为每百万 60 美元。GPT-5.6 Sol 的促销定价至少在 2026 年 11 月 21 日之前有效。详见 [定价详情](https://developers.openai.com/api/docs/pricing?latest-pricing=fast).

要查看用量，请打开用量仪表板，选择 Responses 或 Chat Completions，然后按服务层级分组。要查看成本，请按明细科目分组。

### 哪些模型和模态支持快速模式？

Fast 模式支持 Standard 处理所提供的多模态能力，包括图像输入。GPT-5.6 模型支持长上下文。Fast 模式不支持微调模型或嵌入。未来推出的 GPT 模型可能会支持 Fast 模式，但并不保证每个模型都支持。

### 速率提升限制是跨项目还是跨组织共享？

是的，所有你的流量都会计入同一个 ramp rate 限制。如果经常遇到 ramp rate 限制，可以考虑购买 Scale Tier 配额。

### 如果 Fast 模式未达到其延迟目标，会发生什么？

如果你有任何问题或疑虑，请联系你的客户总监。Fast 模式和 Scale Tier 享有相同的服务等级协议（SLA）待遇，当未达成相应目标时，符合条件的 Enterprise 协议可提供服务积分。

### Fast 模式是否与数据驻留、零数据保留和 BAA 兼容？

是的。Fast 模式与数据驻留、零数据保留 (Zero Data Retention) 以及业务合作协议 (BAA) 兼容。现有的 endpoint、工具、资格和合同要求仍然适用。请参阅 [数据指南](https://developers.openai.com/api/docs/guides/your-data) 了解详情。