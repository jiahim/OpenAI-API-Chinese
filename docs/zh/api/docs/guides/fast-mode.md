# Fast mode

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾添加 `.md` 即可获取该页面的 Markdown 版本。

Fast 模式在保持按量付费灵活性的同时，可将速度提升至原来的 2.5 倍，延迟也更加稳定。对于流量稳定、延迟至关重要的高价值用户面应用，Fast 模式是理想之选。

Priority 处理已于 2026/07/30 更名为 Fast 模式。我们还提升了
  Fast 模式下的运行速度，使其相较于 Standard 处理 `gpt-5.6-sol` 最高可达 2.5×
  更快。你可以在请求中使用 service_tier 参数 `service_tier: "priority"`
  选择 `service_tier: "fast"` priority 或 fast，以便在 API 请求中启用此功能。

## 配置 Fast 模式

你可以通过请求参数或项目设置，将对 Responses API 或 Chat Completions API 的请求配置为使用 Fast 模式。

若要为单个请求启用 Fast 模式，请设置 [`service_tier` 参数](https://platform.openai.com/docs/api-reference/responses/create#responses-create-service_tier) 为 `fast`。设置 `service_tier` 为 `priority` 可为支持的模型提供相同的行为。

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


若要在项目级别启用，请打开 **Settings**，选择 **General** 下的 **Project**，并将 **Project Service Tier** 为 **Fast**。未指定 `service_tier` 的请求将默认使用 Fast 模式。该项目的请求会随着时间逐渐过渡到 Fast 模式。

该 `service_tier` 字段，详见 [Responses](https://platform.openai.com/docs/api-reference/responses/object#responses/object-service_tier) 选择 [Chat Completions](https://platform.openai.com/docs/api-reference/chat/object#chat/object-service_tier) response 对象用于标识处理请求所用的层级。对于 GPT-5.6 及更早的模型，响应返回 `priority` 请求是否指定 `priority` 选择 `fast`.

## 速率限制和爬坡速率

**基线限额**

快速模式的消耗计入速率限额的方式与标准处理相同。使用你常规的重试逻辑并在两次尝试之间等待。对于同一模型，标准处理和快速模式共享相同的速率限额。

**爬坡速率限额**

如果你的流量爬升过快，系统可能会将部分快速模式请求降级到标准速度并按标准费率计费。发生这种情况时，响应中会包含 `service_tier: "default"`。根据经验法则，一旦你的流量达到每分钟 100 万输入 token（TPM），则每 15 分钟增加的流量不超过 50%。爬坡速率限额具体在何时触发会因模型和流量状况而异。

为避免触发爬坡速率限额：

- 切换模型或快照时逐步提升流量。
- 使用特性开关（feature flag）在数小时内迁移流量，而非瞬时切换。
- 避免在 Fast 模式下运行大规模抽取、转换与加载（ETL）或批处理任务。

## 使用注意事项

- Fast 模式按 token 计费，相对于 Standard 处理有溢价。详见 [定价页面](https://developers.openai.com/api/docs/pricing?latest-pricing=fast) ，了解详情及支持的模型。
- 缓存输入的折扣仍然适用于 Fast 模式请求。
- Fast 模式支持多模态请求，包括图像输入。
- 要在用量仪表板中查看 Fast 模式请求，请选择按服务层级分组的选项。对于 GPT-5.6 及更早的模型，这些请求会显示为 `priority` ，即使你指定 `fast`.
- GPT-5.6 模型支持长上下文。Fast 模式不支持微调模型或 embeddings。

## 常见问题

有关账户和政策信息，请参阅 [快速模式 FAQ](https://help.openai.com/en/articles/11647665-priority-processing-faq).

### 快速模式在所有区域都可用吗？

可用性取决于各司法管辖区的法律法规。如对所在地区的可用性有疑问，请联系你的客户总监。

### Fast 模式如何与 Scale Tier 交互？

Scale Tier 和 Fast mode 是相互独立的。Fast mode 请求采用单独的计费方式，不计入已购买的 Scale Tier TPM 套餐额度。Scale Tier 的溢出流量也不会自动转移到 Fast mode。

### Fast 模式如何计费？

快速模式按 token 计费，相较于标准处理会有溢价。所有处理模式的用量都会计入你的年度企业支出承诺，符合条件的输入缓存 token 享有与标准处理相同的折扣。

对于 GPT-5.6 Sol，快速模式的费用是对应标准费率的两倍。短上下文请求价格为每 100 万输入 token 8 美元、每 100 万输出 token 40 美元；长上下文请求价格为每 100 万输入 token 16 美元、每 100 万输出 token 60 美元。GPT-5.6 Sol 的促销定价至少在 2026-11-21 之前有效。详见 [定价详情](https://developers.openai.com/api/docs/pricing?latest-pricing=fast).

要查看用量，请打开用量看板，选择 Responses 或 Chat Completions，然后按服务层级分组。要查看成本，请按明细项分组。

### 哪些模型和模态支持快速模式？

Fast 模式支持 Standard 处理所提供的多模态能力，包括图像输入。GPT-5.6 模型支持长上下文。Fast 模式不支持微调模型或嵌入。未来发布的 GPT 模型可能会支持 Fast 模式，但并非所有模型都保证获得支持。

### 速率上限在各项目或组织之间是否共享？

是的。你所有的流量都会计入同一个爬坡速率限制。如果你经常遇到爬坡速率限制，可以考虑购买 Scale Tier 配额。

### 如果 Fast 模式未达到其延迟目标，会发生什么？

GPT-6 Astra 的快速模式不包含延迟 SLA。对于 GPT-5.6 及更早模型，快速模式与 Scale Tier 享受同等的服务等级协议待遇；当延迟目标未能达成时，符合条件的 Enterprise 协议可能会提供服务抵扣。如有疑问或顾虑，请联系你的客户总监。

### Fast 模式是否兼容数据驻留、零数据保留和 BAA？

Fast 模式与数据驻留、零数据留存以及业务伙伴协议 (BAA) 兼容，但需视具体模型的可用性而定。对于 GPT-6 Astra、Sol 和 Luna，欧盟数据驻留仅在使用 Standard 处理时可用。现有的端点、工具、资格和合同要求仍然适用。请参阅 [你的数据指南](https://developers.openai.com/api/docs/guides/your-data) 了解详情。