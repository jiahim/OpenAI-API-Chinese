# 快速模式

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

Fast 模式可提供最高 2.5 倍的更快速度以及更稳定的延迟，并采用按量付费定价。适用于对延迟有要求且流量稳定的面向用户应用。

若要在 GPT-6 Astra 上获得更快的速度，请参阅 [Ultrafast mode](https://developers.openai.com/api/docs/guides/ultrafast-mode).

Priority processing 于 2026/07/30 更名为 Fast 模式。我们还提升了
  Fast 模式的运行速度， `gpt-5.6-sol` 最高可提升至 2.5 倍
  的速度。可以使用任一 `service_tier: "priority"`
  或 `service_tier: "fast"` 参数在API请求中访问该功能。

## 配置 Fast 模式

你可以通过请求参数或项目设置，向 Responses API 或 Chat Completions API 配置使用快速模式。

要为单个请求启用快速模式，请设置 [`service_tier` 参数](https://platform.openai.com/docs/api-reference/responses/create#responses-create-service_tier) 为 `fast`。设置 `service_tier` 为 `priority` 可为支持的模型提供相同的行为。

使用快速模式创建响应

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


要在项目级别启用，请打开 **Settings**，选择 **General** 下的 **Project**，并将 **Project Service Tier** 为 **Fast**。未指定 `service_tier` 的请求随后将默认使用快速模式。该项目的请求会随时间逐步过渡到快速模式。

该 `service_tier` 字段在 [Responses](https://platform.openai.com/docs/api-reference/responses/object#responses/object-service_tier) 或 [Chat Completions](https://platform.openai.com/docs/api-reference/chat/object#chat/object-service_tier) response 对象标识了用于处理请求的服务层级。对于 GPT-5.6 及更早的模型，响应会返回 `priority` 请求是否指定了 `priority` 或 `fast`.

## 速率限制与提升速率

**基线限额**

Fast 模式的消耗量与 Standard 处理计入速率限额的方式相同。使用你通常的重试逻辑，并在两次尝试之间等待。对于同一个模型，Standard 处理和 Fast 模式共享相同的速率限额。

**爬坡速率限额**

如果你的流量增长过快，系统可能会将部分 Fast 模式请求降级为标准速度，并按标准费率计费。发生这种情况时，响应中包含 `service_tier: "default"`。作为经验法则，当你的流量达到每分钟 100 万输入 token（TPM）后，每 15 分钟的增长幅度不要超过 50%。爬坡速率限额具体在何时生效可能因模型和流量条件而异。

为避免触发爬坡速率限额：

- 更换模型或快照时逐步放量。
- 使用功能开关在数小时内逐步迁移流量，而不是瞬间切换。
- 避免在 Fast 模式下运行大型抽取、转换和加载（ETL）或批处理作业。

## 使用注意事项

- Fast 模式在 Standard 处理的基础上按 token 收取额外费用。详见 [价格页面](https://developers.openai.com/api/docs/pricing?latest-pricing=fast) 了解详情及支持的模型。
- Fast 模式的请求仍然适用输入缓存折扣。
- Fast 模式支持多模态请求，包括图像输入。
- 要在用量面板中查看 Fast 模式请求，请选择按服务层级（service tier）分组。对于 GPT-5.6 及更早的模型，即使你在请求中指定 `priority` 这些请求也会显示为 `fast`.
- GPT-5.6 模型支持长上下文。Fast 模式不支持微调模型或嵌入。

## 常见问题

如需了解账户和政策信息，请参阅 [快速模式常见问题解答](https://help.openai.com/en/articles/11647665-priority-processing-faq).

### 所有地区都支持 Fast 模式吗？

可用性取决于各司法管辖区的法律法规。如对所在地区的可用性有疑问，请联系你的客户总监。

### Fast 模式如何与 Scale Tier 交互？

Scale Tier 与 Fast 模式是相互独立的。Fast 模式请求采用独立的计费方式，不计入已购买的 Scale Tier TPM 套餐额度。Scale Tier 的溢出流量不会自动迁移到 Fast 模式。

### Fast 模式如何计费？

Fast 模式按 token 计费，相比 Standard 处理会有溢价。所有处理模式都会计入你的年度 Enterprise 消费承诺，符合条件的缓存输入 token 享受与 Standard 处理相同的折扣。

对于 GPT-5.6 Sol，Fast 模式价格为对应 Standard 费率的两倍。短上下文请求输入 token 价格为每百万 8 美元，输出 token 价格为每百万 40 美元；长上下文请求输入 token 价格为每百万 16 美元，输出 token 价格为每百万 60 美元。GPT-5.6 Sol 的促销定价至少有效至 2026 年 11 月 21 日。详见 [定价详情](https://developers.openai.com/api/docs/pricing?latest-pricing=fast).

要查看用量，请打开用量面板，选择 Responses 或 Chat Completions，然后按服务层级分组。要查看费用，请按 line item 分组。

### 哪些模型和模态支持快速模式？

Fast 模式支持 Standard 处理所提供的多模态能力，包括图像输入。GPT-5.6 模型支持长上下文。Fast 模式不支持微调模型或嵌入模型。未来的 GPT 模型可能会支持 Fast 模式，但并非每个模型都保证支持。

### 爬坡速率限制是在项目之间还是组织之间共享的？

是的。你所有的流量都会计入同一个爬坡速率限制。如果你经常遇到爬坡速率限制，可以考虑购买 Scale Tier 配额。

### 如果 Fast 模式未达到其延迟目标会怎样？

GPT-6 Astra 的快速模式不包含延迟 SLA。对于 GPT-5.6 及更早的模型，快速模式与 Scale Tier 享有同等的服务等级协议待遇，符合条件的企业协议在延迟目标未达成时可能提供服务额度。如有疑问或顾虑，请联系你的客户总监。

### Fast 模式是否与数据驻留、零数据保留和 BAA 兼容？

Fast 模式兼容数据驻留、零数据保留和商业伙伴协议 (BAA)，但需视具体模型的可用性而定。对于 GPT-6 Astra、GPT-6.1 Sol、GPT-6 Sol 或 GPT-6 Luna，Fast 模式不适用于欧盟数据驻留。现有的端点、工具、资格和合同要求仍然适用。详见 [数据使用指南](https://developers.openai.com/api/docs/guides/your-data) 。