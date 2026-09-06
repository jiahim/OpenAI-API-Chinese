# Completions API

> 如需完整文档索引,请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

Completions API 端点在 2023 年 7 月收到最后一次更新，其接口与新的 Chat Completions 端点不同。其输入不是一个消息列表，而是一个称为的纯文本字符串 `prompt`.

一个旧版 Completions API 调用的示例如下：

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


请参阅完整 [API 参考文档](https://platform.openai.com/docs/api-reference/completions) 以了解更多信息。

#### 插入文本

completions 端点还支持通过提供 [suffix](https://developers.openai.com/api/reference/resources/completions/methods/create#completions-create-suffix) 参数来插入文本，作为对被视为前缀的标准提示的补充。这种需求在撰写长篇文本、段落之间过渡、遵循大纲或引导模型走向特定结尾时自然产生。它也适用于代码，可用于在函数或文件的中间插入内容。



为了说明 suffix 上下文如何影响生成文本，考虑这个提示：“Today I decided to make a big change.”。人们可以想象出很多种补全这句话的方式。但如果我们现在提供故事的结尾：“I’ve gotten many compliments on my new hair!”，那么预期的补全就变得明确了。

> 我在波士顿大学读的大学。拿到学位后，我决定做出一个改变**，一个巨大的改变！**

> **我收拾好行李，搬到了美国西海岸。**

> 现在，我对太平洋简直爱不释手！

为模型提供额外上下文可以让它的可控性大幅提升。然而，这对模型来说是一项更具约束性、也更困难的任务。为获得最佳效果，我们建议如下做法：

**使用 `max_tokens` > 256。** 模型在插入较长的补全时表现更好。如果 `max_tokens`，太小，模型可能还来不及连接到后缀就被截断。请注意，即使使用较大的 `max_tokens`.

**优先 `finish_reason` == "stop"。** 当模型到达自然停止点或用户提供的停止序列时，它会将 `finish_reason` 设为 "stop"。这表示模型已较好地连接到后缀，是补全质量良好的信号。在使用 n > 1 进行多次采样或重采样时，这一点对于在若干补全之间做出选择尤为重要（见下一条）。

**重采样 3-5 次。** 虽然几乎所有补全都能连接到前缀，但在较难的情形下，模型可能难以连接到后缀。我们发现，在这种情况下重采样 3 或 5 次（或使用 best_of 并设置 k=3、5），然后选择 `finish_reason` 为 "stop" 的样本，是一种有效的方法。重采样时，你通常希望使用较高的 temperature 来增加多样性。

注意：如果返回的所有样本的 `finish_reason` == "length"，很可能是 max_tokens 过小，模型还没来得及自然地将提示与后缀连接起来就用尽了 token。请考虑增大 `max_tokens` 后再进行重采样。

**尝试给出更多线索。** 在某些情况下，为了更好地帮助模型生成，你可以通过提供若干模式示例来给出线索，让模型据此判断一个自然的停止位置。

> 如何制作美味的热可可：
>
> 1.** 烧水**
> **2. 将热可可放入杯中**
> **3. 将沸水倒入杯中** 4. 享用热可可

> 1. 狗是人类忠诚的动物。
> 2. 狮子是凶猛的动物。
> 3. 海豚** 是爱嬉戏的动物。**
> 4. 马是雄伟的动物。



### Completions 响应格式

一个示例 completions API 响应如下：

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

completions 端点还支持通过提供 [suffix](https://developers.openai.com/api/reference/resources/completions/methods/create#completions-create-suffix) 参数来插入文本，作为对被视为前缀的标准提示的补充。这种需求在撰写长篇文本、段落之间过渡、遵循大纲或引导模型走向特定结尾时自然产生。它也适用于代码，可用于在函数或文件的中间插入内容。



为了说明 suffix 上下文如何影响生成文本，考虑这个提示：“Today I decided to make a big change.”。人们可以想象出很多种补全这句话的方式。但如果我们现在提供故事的结尾：“I’ve gotten many compliments on my new hair!”，那么预期的补全就变得明确了。

> 我在波士顿大学读的大学。拿到学位后，我决定做出一个改变**，一个巨大的改变！**

> **我收拾好行李，搬到了美国西海岸。**

> 现在，我对太平洋简直百看不厌！

为模型提供额外上下文可以让它的可控性大幅提升。然而，这对模型来说是一项更具约束性、也更困难的任务。为获得最佳效果，我们建议如下做法：

**使用 `max_tokens` > 256。** 模型在插入较长的补全时表现更好。如果 `max_tokens`，太小，模型可能还来不及连接到后缀就被截断。请注意，即使使用较大的 `max_tokens`.

**优先 `finish_reason` == "stop"。** 当模型到达自然停止点或用户提供的停止序列时，它会将 `finish_reason` 设为 "stop"。这表示模型已较好地连接到后缀，是补全质量良好的信号。在使用 n > 1 进行多次采样或重采样时，这一点对于在若干补全之间做出选择尤为重要（见下一条）。

**重采样 3-5 次。** 虽然几乎所有补全都能连接到前缀，但在较难的情形下，模型可能难以连接到后缀。我们发现，在这种情况下重采样 3 或 5 次（或使用 best_of 并设置 k=3、5），然后选择 `finish_reason` 为 "stop" 的样本，是一种有效的方法。重采样时，你通常希望使用较高的 temperature 来增加多样性。

注意：如果返回的所有样本的 `finish_reason` == "length"，很可能是 max_tokens 过小，模型还没来得及自然地将提示与后缀连接起来就用尽了 token。请考虑增大 `max_tokens` 后再进行重采样。

**尝试给出更多线索。** 在某些情况下，为了更好地帮助模型生成，你可以通过提供若干模式示例来给出线索，让模型据此判断一个自然的停止位置。

> 如何制作美味的热可可：
>
> 1.** 烧水**
> **2. 将热可可放入杯中**
> **3. 将沸水倒入杯中** 4. 享用热可可

> 1. 狗是人类忠诚的动物。
> 2. 狮子是凶猛的动物。
> 3. 海豚** 是爱嬉戏的动物。**
> 4. 马是雄伟的动物。



## Chat Completions 与 Completions

Chat Completions 格式可以通过使用单条用户消息构造请求来近似 completions 格式。例如，可以使用以下 completions prompt 将英文翻译成法文：

```
Translate the following English text to French: "{text}"
```

等价的 chat prompt 如下：

```
[{"role": "user", "content": 'Translate the following English text to French: "{text}"'}]
```

类似地，completions API 也可以通过对输入进行相应格式化来模拟用户与助手之间的对话 [相应地](https://platform.openai.com/playground/p/default-chat?model=gpt-3.5-turbo-instruct).

这些 API 之间的区别在于各自可用的底层模型。Chat Completions API 支持当前的 GPT 模型，例如 [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 以及成本更低的选项，例如 [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra).