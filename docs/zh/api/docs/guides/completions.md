# Completions API

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获得文档页面的 Markdown 版本。

`gpt-3.5-turbo-instruct`, `babbage-002`，并且 `davinci-002` 计划于 2026 年 9 月 28 日停用。下面的示例保留了旧的
  请求格式作为参考。文档中记录的替代方案
  需要迁移到， `gpt-5.6-terra`,
  Responses [Responses
  API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 或 Chat Completions；它
  不是旧版 Completions 端点的直接模型替代方案。详见
  该 [弃用
  通知](https://developers.openai.com/api/docs/deprecations#2025-09-26-legacy-gpt-model-snapshots).

Completions API 端点已于 2023 年 7 月收到最后一次更新，并且与新的 Chat Completions 端点具有不同的接口。输入不是消息列表，而是一个名为 `prompt`.

旧版 Completions API 的调用示例如下：

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

completions 端点也支持通过提供 [suffix](https://developers.openai.com/api/reference/resources/completions/methods/create#completions-create-suffix) 来插入文本，作为被视为前缀的标准提示的补充。这种需求在撰写长文本、在段落之间过渡、遵循大纲或引导模型走向特定结尾时自然产生。它同样适用于代码，可用于在函数或文件的中间位置插入内容。



为了说明 suffix 上下文如何影响生成的文本，可以考虑以下提示：“Today I decided to make a big change.”。可以想象，这句话有多种补全方式。但如果我们提供故事的结尾：“I’ve gotten many compliments on my new hair!”，那么预期的补全就变得清晰了。

> 我在波士顿大学读的大学。拿到学位后，我决定做出一个改变**。一个巨大的改变！**

> **我收拾行囊，搬到了美国的西海岸。**

> 现在，我彻底爱上了太平洋！

通过为模型提供额外的上下文，可以使模型更易于控制。然而，这对模型来说是一项约束更强、难度更大的任务。为了获得最佳效果，我们建议以下几点：

**使用 `max_tokens` > 256。** 模型更擅长插入较长的补全。如果 `max_tokens`，太小，模型可能会在能够连接到后缀之前就被截断。请注意，即使使用更大的 `max_tokens`.

**优先选择 `finish_reason` == "stop"。** 当模型到达自然停止点或用户提供停止序列时，它会将 `finish_reason` 设为 "stop"。这表明模型很好地连接到了后缀，是补全质量良好的信号。在使用 n > 1 或重采样（在下一条中介绍）在若干补全之间进行选择时，这一点尤为重要。

**重采样 3-5 次。** 虽然几乎所有补全都能连接到前缀，但在更困难的情况下，模型可能难以连接到后缀。我们发现，在这种情况下，重采样 3 或 5 次（或使用 best_of 并设置 k=3,5），然后挑选那些将 `finish_reason` 作为 "stop" 的样本，是一种有效的方法。在重采样时，你通常会希望使用更高的 temperature 来增加多样性。

注意：如果所有返回的样本的 `finish_reason` == "length"，很可能是 max_tokens 太小，模型在自然连接提示和后缀之前就用完了 token。请考虑在重采样之前增大 `max_tokens` 。

**尝试提供更多线索。** 在某些情况下，为了更好地帮助模型生成，你可以通过提供若干模式示例来给出线索，让模型能够据此判断合适的自然停止位置。

> 如何制作美味的热巧克力：
>
> 1.** 把水煮沸**
> **2. 把热巧克力放入杯中**
> **3. 将沸水倒入杯中** 4. 享用热巧克力

> 1. 狗是忠诚的动物。
> 2. 狮子是凶猛的动物。
> 3. 海豚** 是爱玩耍的动物。**
> 4. 马是雄伟的动物。



### Completions 响应格式

一个 completions API 响应的示例如下：

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

在 Python 中，可以通过以下方式提取输出 `response['choices'][0]['text']`.

响应格式与 Chat Completions API 的响应格式类似。

### 插入文本

completions 端点也支持通过提供 [suffix](https://developers.openai.com/api/reference/resources/completions/methods/create#completions-create-suffix) 来插入文本，作为被视为前缀的标准提示的补充。这种需求在撰写长文本、在段落之间过渡、遵循大纲或引导模型走向特定结尾时自然产生。它同样适用于代码，可用于在函数或文件的中间位置插入内容。



为了说明 suffix 上下文如何影响生成的文本，可以考虑以下提示：“Today I decided to make a big change.”。可以想象，这句话有多种补全方式。但如果我们提供故事的结尾：“I’ve gotten many compliments on my new hair!”，那么预期的补全就变得清晰了。

> 我在波士顿大学读的大学。拿到学位后，我决定做出一个改变**。一个巨大的改变！**

> **我收拾行囊，搬到了美国的西海岸。**

> 现在，我对太平洋简直欲罢不能！

通过为模型提供额外的上下文，可以使模型更易于控制。然而，这对模型来说是一项约束更强、难度更大的任务。为了获得最佳效果，我们建议以下几点：

**使用 `max_tokens` > 256。** 模型更擅长插入较长的补全。如果 `max_tokens`，太小，模型可能会在能够连接到后缀之前就被截断。请注意，即使使用更大的 `max_tokens`.

**优先选择 `finish_reason` == "stop"。** 当模型到达自然停止点或用户提供停止序列时，它会将 `finish_reason` 设为 "stop"。这表明模型很好地连接到了后缀，是补全质量良好的信号。在使用 n > 1 或重采样（在下一条中介绍）在若干补全之间进行选择时，这一点尤为重要。

**重采样 3-5 次。** 虽然几乎所有补全都能连接到前缀，但在更困难的情况下，模型可能难以连接到后缀。我们发现，在这种情况下，重采样 3 或 5 次（或使用 best_of 并设置 k=3,5），然后挑选那些将 `finish_reason` 作为 "stop" 的样本，是一种有效的方法。在重采样时，你通常会希望使用更高的 temperature 来增加多样性。

注意：如果所有返回的样本的 `finish_reason` == "length"，很可能是 max_tokens 太小，模型在自然连接提示和后缀之前就用完了 token。请考虑在重采样之前增大 `max_tokens` 。

**尝试提供更多线索。** 在某些情况下，为了更好地帮助模型生成，你可以通过提供若干模式示例来给出线索，让模型能够据此判断合适的自然停止位置。

> 如何制作美味的热巧克力：
>
> 1.** 把水煮沸**
> **2. 把热巧克力放入杯中**
> **3. 将沸水倒入杯中** 4. 享用热巧克力

> 1. 狗是忠诚的动物。
> 2. 狮子是凶猛的动物。
> 3. 海豚** 是爱玩耍的动物。**
> 4. 马是雄伟的动物。



## Chat Completions vs. Completions

Chat Completions 格式可以通过构造仅包含单个用户消息的请求来模拟 completions 格式。例如，可以使用以下 completions 提示词实现英译法：

```
Translate the following English text to French: "{text}"
```

等价的 chat 提示词如下：

```
[{"role": "user", "content": 'Translate the following English text to French: "{text}"'}]
```

同样，可以通过相应地构造输入，使用 completions API 来模拟用户与助手之间的对话 [相应地构造输入](https://platform.openai.com/playground/p/default-chat?model=gpt-3.5-turbo-instruct).

这些 API 之间的区别在于各自可用的底层模型。Chat Completions API 支持当前的 GPT 模型，例如 [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 以及成本更低的选项，例如 [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra).