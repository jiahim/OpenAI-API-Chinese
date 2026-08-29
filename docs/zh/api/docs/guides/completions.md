# Completions API

> 如需完整的文档索引,请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

completions API 端点在 2023 年 7 月收到了最后一次更新，其接口与新的 Chat Completions 端点不同。输入不是一个消息列表，而是一段自由格式的文本字符串，称为 `prompt`.

一个旧版 Completions API 调用示例如下：

```javascript
const completion = await openai.completions.create({
  model: "gpt-3.5-turbo-instruct",
  prompt: "Write a tagline for an ice cream shop.",
});
```

```python
from openai import OpenAI

client = OpenAI()

response = client.completions.create(
    model="gpt-3.5-turbo-instruct", prompt="Write a tagline for an ice cream shop."
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
	response, err := client.Completions.New(context.Background(), openai.CompletionNewParams{
		Model:  "gpt-3.5-turbo-instruct",
		Prompt: openai.CompletionNewParamsPromptUnion{OfString: openai.String("Write a tagline for an ice cream shop.")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Choices[0].Text)
}
```

```ruby
require "openai"

client = OpenAI::Client.new
completion = client.completions.create(model: "gpt-3.5-turbo-instruct", prompt: "Write a tagline for a bakery.", max_tokens: 24)
puts(completion.choices.fetch(0).text)
```


请参阅完整的 [API 参考文档](https://platform.openai.com/docs/api-reference/completions) 以了解更多信息。

#### 插入文本

completions 端点还支持通过提供 [suffix](https://developers.openai.com/api/reference/resources/completions/methods/create#completions-create-suffix) 来插入文本，作为被视为前缀的标准提示的补充。这种需求在撰写长篇文本、在段落之间过渡、遵循大纲或将模型引导至结尾时自然产生。它同样适用于代码，可用于在函数或文件的中间插入内容。



为了说明后缀上下文如何影响生成的文本，可以考虑提示“Today I decided to make a big change.”这个句子有许多种可以想象的补全方式。但如果我们提供故事的结尾：“I’ve gotten many compliments on my new hair!”，那么预期的补全内容就变得清晰了。

> 我在波士顿大学读的大学。拿到学位后，我决定做出一个改变**。一个巨大的改变**

> **我收拾行囊，搬到了美国西海岸。**

> 现在，我对太平洋简直爱不释手！

为模型提供额外上下文，可以显著提升其可控性。不过，这对模型而言是更具约束性、更具挑战性的任务。为获得最佳效果，我们建议你遵循以下几点：

**使用 `max_tokens` > 256。** 模型在插入较长的补全内容时表现更好。如果 `max_tokens`，设置过小，模型可能还没来得及连接到后缀就被截断。请注意，即使使用更大的 `max_tokens`.

**优先选择 `finish_reason` == "stop"。** 当模型到达自然停止点或用户提供 stop 序列时，它会将 `finish_reason` 设为 "stop"。这表明模型已经很好地连接到了后缀，也是补全质量的一个良好信号。在 n > 1 或重采样的多个补全中进行选择时，这一点尤为相关（见下一条）。

**重采样 3 到 5 次。** 虽然几乎所有补全都能连接到前缀，但在较难的情况下，模型可能难以连接到后缀。我们发现，在这种情况下，重采样 3 次或 5 次（或使用 k=3、5 的 best_of），并挑选将 "stop" 作为其 `finish_reason` 的样本，是一种有效的方式。在重采样时，通常可以适当提高 temperature 以增加多样性。

注意：如果所有返回的样本都是 `finish_reason` == "length"，这很可能意味着 max_tokens 过小，模型在自然连接上 prompt 和后缀之前就用尽了 token。请考虑在重采样之前增大 `max_tokens` 。

**尝试给出更多提示。** 在某些情况下，为了更好地引导模型的生成，你可以给出一些模式示例作为提示，让模型据此判断一个自然的停止位置。

> 如何制作美味的热巧克力：
>
> 1.** 烧水**
> **2. 将热巧克力粉倒入杯中**
> **3. 把沸水倒入杯中** 4. 享用热巧克力

> 1. 狗是忠诚的动物。
> 2. 狮子是凶猛的动物。
> 3. 海豚** 是爱玩耍的动物。**
> 4. 马是雄伟的动物。



### Completions 响应格式

一个示例 completions API 响应如下所示：

```
{
  "choices": [
    {
      "finish_reason": "length",
      "index": 0,
      "logprobs": null,
      "text": "\n\n\"Let Your Sweet Tooth Run Wild at Our Creamy Ice Cream Shack"
    }
  ],
  "created": 1683130927,
  "id": "cmpl-7C9Wxi9Du4j1lQjdjhxBlO22M61LD",
  "model": "gpt-3.5-turbo-instruct",
  "object": "text_completion",
  "usage": {
    "completion_tokens": 16,
    "prompt_tokens": 10,
    "total_tokens": 26
  }
}
```

在 Python 中，可以使用以下方式提取输出 `response['choices'][0]['text']`.

响应格式与 Chat Completions API 的响应格式类似。

### 插入文本

completions 端点还支持通过提供 [suffix](https://developers.openai.com/api/reference/resources/completions/methods/create#completions-create-suffix) 来插入文本，作为被视为前缀的标准提示的补充。这种需求在撰写长篇文本、在段落之间过渡、遵循大纲或将模型引导至结尾时自然产生。它同样适用于代码，可用于在函数或文件的中间插入内容。



为了说明后缀上下文如何影响生成的文本，可以考虑提示“Today I decided to make a big change.”这个句子有许多种可以想象的补全方式。但如果我们提供故事的结尾：“I’ve gotten many compliments on my new hair!”，那么预期的补全内容就变得清晰了。

> 我在波士顿大学读的大学。拿到学位后，我决定做出一个改变**。一个巨大的改变**

> **我收拾行囊，搬到了美国西海岸。**

> 现在，我对太平洋简直着迷了！

为模型提供额外上下文，可以显著提升其可控性。不过，这对模型而言是更具约束性、更具挑战性的任务。为获得最佳效果，我们建议你遵循以下几点：

**使用 `max_tokens` > 256。** 模型在插入较长的补全内容时表现更好。如果 `max_tokens`，设置过小，模型可能还没来得及连接到后缀就被截断。请注意，即使使用更大的 `max_tokens`.

**优先选择 `finish_reason` == "stop"。** 当模型到达自然停止点或用户提供 stop 序列时，它会将 `finish_reason` 设为 "stop"。这表明模型已经很好地连接到了后缀，也是补全质量的一个良好信号。在 n > 1 或重采样的多个补全中进行选择时，这一点尤为相关（见下一条）。

**重采样 3 到 5 次。** 虽然几乎所有补全都能连接到前缀，但在较难的情况下，模型可能难以连接到后缀。我们发现，在这种情况下，重采样 3 次或 5 次（或使用 k=3、5 的 best_of），并挑选将 "stop" 作为其 `finish_reason` 的样本，是一种有效的方式。在重采样时，通常可以适当提高 temperature 以增加多样性。

注意：如果所有返回的样本都是 `finish_reason` == "length"，这很可能意味着 max_tokens 过小，模型在自然连接上 prompt 和后缀之前就用尽了 token。请考虑在重采样之前增大 `max_tokens` 。

**尝试给出更多提示。** 在某些情况下，为了更好地引导模型的生成，你可以给出一些模式示例作为提示，让模型据此判断一个自然的停止位置。

> 如何制作美味的热巧克力：
>
> 1.** 烧水**
> **2. 将热巧克力粉倒入杯中**
> **3. 把沸水倒入杯中** 4. 享用热巧克力

> 1. 狗是忠诚的动物。
> 2. 狮子是凶猛的动物。
> 3. 海豚** 是爱玩耍的动物。**
> 4. 马是雄伟的动物。



## Chat Completions vs. Completions

Chat Completions 格式可以通过构造只包含单个用户消息的请求，使其与 completions 格式类似。例如，可以使用以下 completions 提示词实现从英语到法语的翻译：

```
Translate the following English text to French: "{text}"
```

与之等价的 chat 提示词如下：

```
[{"role": "user", "content": 'Translate the following English text to French: "{text}"'}]
```

同理，completions API 也可以通过对输入进行相应格式化来模拟用户与助手之间的对话， [如下所示](https://platform.openai.com/playground/p/default-chat?model=gpt-3.5-turbo-instruct).

这些 API 之间的区别在于各自可用的底层模型。Chat Completions API 支持当前的 GPT 模型，例如 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 以及更低成本的选项，例如 [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra).