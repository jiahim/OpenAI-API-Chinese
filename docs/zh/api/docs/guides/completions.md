# 补全 API

> 完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

completions API 端点在 2023 年 7 月进行了最后一次更新，其接口与新的 Chat Completions 端点不同。输入不再是消息列表，而是一个自由格式的文本字符串，称为 `prompt`.

一个旧的 Completions API 调用示例如下：

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


查看完整 [API 参考文档](https://platform.openai.com/docs/api-reference/completions) 以了解更多信息。

#### 插入文本

完成端点（completions endpoint）还支持通过提供 [suffix](https://developers.openai.com/api/reference/resources/completions/methods/create#completions-create-suffix) 来插入文本，而标准提示词则被视为前缀。这种需求自然出现在编写长文本、段落过渡、遵循大纲或引导模型走向结尾时。这也适用于代码，可用于在函数或文件中间插入。



为了说明后缀上下文如何影响生成的文本，考虑提示词：“今天我决定做出重大改变。”想象完成这个句子的方式有很多种。但如果我们现在提供故事结尾：“我的新发型得到了很多赞美！”那么预期的完成方式就变得清晰了。

> 我在波士顿大学读的大学。拿到学位后，我决定做出改变**。一个巨大的改变！**

> **我收拾好行囊，搬到了美国西海岸。**

> 现在，我对太平洋的喜爱简直欲罢不能！

通过为模型提供额外的上下文，它可以更具可引导性。然而，这对模型来说是一项更受约束且更具挑战性的任务。为了获得最佳结果，我们建议如下：

**使用 `max_tokens` > 256。** 模型更擅长插入较长的补全内容。如果 `max_tokens`，过小，模型可能在连接后缀之前就被截断。请注意，即使使用较大的 `max_tokens`.

**，也只需为生成的 token 数量付费。优先选择 `finish_reason` == "stop"。** 当模型达到自然的停止点或用户提供的停止序列时，它会将 `finish_reason` 设置为"stop"。这表示模型已成功连接到后缀，是补全质量的良好信号。这在 n > 1 或重新采样时（参见下一点）选择几个补全结果时尤其重要。

**重新采样 3-5 次。** 虽然几乎所有补全都能连接到前缀，但在较难的情况下，模型可能难以连接后缀。我们发现重新采样 3 或 5 次（或使用 k=3,5 的 best_of），并选择 `finish_reason` 为"stop"的样本，在这种情况下可能是一种有效的方法。在重新采样时，通常会希望使用更高的温度来增加多样性。

注意：如果所有返回的样本的 `finish_reason` == "length"，则可能是 max_tokens 过小，模型在自然连接提示和后缀之前就用完了 token。请考虑在重新采样之前增加 `max_tokens` 。

**尝试提供更多线索。** 在某些情况下，为了更好地帮助模型生成，你可以通过给出一些模型可以遵循的模式示例来提供线索，以决定自然停止的位置。

> 如何制作一杯美味的热巧克力：
>
> 1.** 烧开水**
> **2. 将热巧克力放入杯中**
> **3. 将开水倒入杯中** 4. 享用热巧克力

> 1. 狗是忠诚的动物。
> 2. 狮子是凶猛的动物。
> 3. 海豚** 是顽皮的动物。**
> 4. 马是威武的动物。



### 补全响应格式

一个示例性补全 API 响应如下所示：

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

在 Python 中，可以使用以下方式提取输出： `response['choices'][0]['text']`.

响应格式与 Chat Completions API 的响应格式类似。

### 插入文本

completions 端点还支持通过提供 [suffix](https://developers.openai.com/api/reference/resources/completions/methods/create#completions-create-suffix) 来插入文本，此外还有被视为前缀的标准提示词。这种需求在撰写长文、段落间过渡、遵循大纲或引导模型走向结尾时自然会出现。这也适用于代码，并且可以用于在函数或文件的中间插入内容。



为了说明后缀上下文如何影响生成的文本，请考虑提示词：“今天我决定做出一个重大改变。”可以想象完成这个句子的方式有很多种。但如果我们现在提供故事的结尾：“我的新发型收到了很多赞美！”，预期的完成方式就变得清晰了。

> 我在波士顿大学上的大学。拿到学位后，我决定做出改变**。一个巨大的改变！**

> **我收拾好行李，搬到了美国西海岸。**

> 现在，我对太平洋怎么也看不够！

通过为模型提供更多上下文，可以使其更容易操控。然而，这对模型来说是一项更具约束性和挑战性的任务。为获得最佳结果，我们建议如下：

**使用 `max_tokens` > 256。** 模型在插入较长的补全时表现更好。如果 `max_tokens`，太小，模型可能在连接到后缀之前就被截断。请注意，即使使用更大的 `max_tokens`.

**优先选择 `finish_reason` == "stop"。** 当模型达到自然停止点或用户提供的停止序列时，它会将 `finish_reason` 设置为"stop"。这表明模型已良好地连接到后缀，是补全质量的良好信号。这在选择 n > 1 或重采样时的几个补全中尤其相关（见下一点）。

**重采样 3-5 次。** 虽然几乎所有的补全都能连接到前缀，但在更复杂的情况下，模型可能难以连接到后缀。我们发现重采样 3 或 5 次（或使用 k=3,5 的 best_of）并选择 `finish_reason` 为"stop"的样本，在这种情况下是一种有效的方法。在重采样时，你通常需要更高的温度以增加多样性。

注意：如果所有返回的样本的 `finish_reason` == "length"，则可能是 max_tokens 太小，模型在自然连接提示和后缀之前就用完了令牌。考虑在重采样前增加 `max_tokens` 。

**尝试提供更多线索。** 在某些情况下，为了更好地帮助模型生成，你可以通过提供一些模式示例来给出线索，让模型遵循这些模式来决定自然的停止位置。

> 如何制作一杯美味的热巧克力：
>
> 1.** 烧水**
> **2. 将热巧克力放入杯中**
> **3. 将沸水倒入杯中** 4. 享用热巧克力

> 1. 狗是忠诚的动物。
> 2. 狮子是凶猛的动物。
> 3. 海豚** 是顽皮的动物。**
> 4. 马是高贵的动物。



## Chat Completions 与 Completions

通过使用单条用户消息构造请求，可以使 Chat Completions 格式与 completions 格式相似。例如，可以通过以下 completions 提示将英语翻译为法语：

```
Translate the following English text to French: "{text}"
```

等效的聊天提示为：

```
[{"role": "user", "content": 'Translate the following English text to French: "{text}"'}]
```

同样，completions API 可以通过格式化输入来模拟用户与助手之间的聊天， [相应地](https://platform.openai.com/playground/p/default-chat?model=gpt-3.5-turbo-instruct).

这些 API 之间的区别在于各自可用的底层模型。Chat Completions API 支持当前的 GPT 模型，例如 [`gpt-5.6`](https://developers.openai.com/api/docs/models/gpt-5.6-sol) 以及成本较低的选择，例如 [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra).