# Completions API

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。页面的 Markdown 版本可通过在 `.md` 追加到页面 URL 来获取。

`gpt-3.5-turbo-instruct`, `babbage-002`，以及 `davinci-002` 计划于
  2026 年 9 月 28 日停服。下方的示例仍保留旧的
  请求格式以供参考。文档化的替代方案， `gpt-5.6-terra`,
  需要迁移到 [Responses
  API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 或 Chat Completions；它
  并非旧版 Completions 端点的可直接替换模型。详见
  该 [弃用
  通知](https://developers.openai.com/api/docs/deprecations#2025-09-26-legacy-gpt-model-snapshots).

Completions API 端点已于 2023 年 7 月完成最后一次更新，其接口与新的 Chat Completions 端点不同。其输入不是消息列表，而是一段自由格式的文本字符串，称为 `prompt`.

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

```java
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.completions.CompletionCreateParams;

var completion =
    client
        .completions()
        .create(
            CompletionCreateParams.builder()
                .model("gpt-3.5-turbo-instruct")
                .prompt("Write a tagline for an ice cream shop.")
                .build());
completion.choices().forEach(choice -> System.out.println(choice.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
completion = client.completions.create(model: "gpt-3.5-turbo-instruct", prompt: "Write a tagline for a bakery.", max_tokens: 24)
puts(completion.choices.fetch(0).text)
```


请参阅完整的 [API 参考文档](https://platform.openai.com/docs/api-reference/completions) 以了解更多。

#### 插入文本

completions 端点除了支持标准的 prompt（视为前缀）之外，还支持通过提供 [suffix](https://developers.openai.com/api/reference/resources/completions/methods/create#completions-create-suffix) 来插入文本。这种需求在撰写长篇文本、在段落之间过渡、遵循大纲或引导模型走向特定结尾时自然产生。它同样适用于代码，可用于在函数或文件中间插入内容。



为了说明 suffix 上下文对生成文本的影响，考虑这样一个 prompt：“Today I decided to make a big change.”（今天我决定做出一个重大改变。）人们可以想象出多种完成这句话的方式。但如果我们现在提供故事的结尾：“I’ve gotten many compliments on my new hair!”（我的新发型收到了很多赞美！），那么预期的续写就变得清晰了。

> 我在波士顿大学读的大学。拿到学位后，我决定做出一个改变**。一个巨大的改变！**

> **我收拾行囊，搬到了美国西海岸。**

> 现在，我对太平洋简直欲罢不能！

为模型提供额外上下文可以使其更易于引导。然而，这对模型来说是一项更受约束且更具挑战性的任务。为了获得最佳效果，我们建议你遵循以下几点：

**使用 `max_tokens` > 256。** 模型更擅长插入较长的补全。如果 `max_tokens`，过小，模型可能会在被截断之前无法连接到后缀。请注意，即便使用更大的 `max_tokens`.

**优先选择 `finish_reason` == "stop"。** 当模型到达自然停止点或用户提供的停止序列时，它会将 `finish_reason` 设置为 "stop"。这表明模型已较好地连接到后缀，是补全质量良好的信号。在使用 n > 1 或重采样（见下一点）从若干补全中进行选择时，这一点尤为重要。

**重采样 3 到 5 次。** 虽然几乎所有补全都能连接到前缀，但在较难的情况下，模型可能会难以连接到后缀。我们发现，在这种情况下，重采样 3 或 5 次（或使用 best_of 并设 k=3,5），然后选择将 `finish_reason` 设为 "stop" 的样本，是一种有效的方法。重采样时，通常会希望使用较高的 temperature 来增加多样性。

注意：如果所有返回的样本其 `finish_reason` == "length"，很可能是 max_tokens 过小，模型在自然地连接提示和后缀之前就用完了 token。请考虑在重采样前增大 `max_tokens` 再进行重采样。

**尝试提供更多线索。** 在某些情况下，为了更好地帮助模型生成，你可以通过给出若干模式示例来提供线索，让模型能够据此判断自然的停止位置。

> 如何制作一杯美味的热巧克力：
>
> 1.** 把水煮沸**
> **2. 把热巧克力粉倒入杯中**
> **3. 将沸水倒入杯中** 4. 享用这杯热巧克力

> 1. 狗是忠诚的动物。
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

completions 端点除了支持标准的 prompt（视为前缀）之外，还支持通过提供 [suffix](https://developers.openai.com/api/reference/resources/completions/methods/create#completions-create-suffix) 来插入文本。这种需求在撰写长篇文本、在段落之间过渡、遵循大纲或引导模型走向特定结尾时自然产生。它同样适用于代码，可用于在函数或文件中间插入内容。



为了说明 suffix 上下文对生成文本的影响，考虑这样一个 prompt：“Today I decided to make a big change.”（今天我决定做出一个重大改变。）人们可以想象出多种完成这句话的方式。但如果我们现在提供故事的结尾：“I’ve gotten many compliments on my new hair!”（我的新发型收到了很多赞美！），那么预期的续写就变得清晰了。

> 我在波士顿大学读的大学。拿到学位后，我决定做出一个改变**。一个巨大的改变！**

> **我收拾行囊，搬到了美国西海岸。**

> 现在，我对太平洋简直着了迷！

为模型提供额外上下文可以使其更易于引导。然而，这对模型来说是一项更受约束且更具挑战性的任务。为了获得最佳效果，我们建议你遵循以下几点：

**使用 `max_tokens` > 256。** 模型更擅长插入较长的补全。如果 `max_tokens`，过小，模型可能会在被截断之前无法连接到后缀。请注意，即便使用更大的 `max_tokens`.

**优先选择 `finish_reason` == "stop"。** 当模型到达自然停止点或用户提供的停止序列时，它会将 `finish_reason` 设置为 "stop"。这表明模型已较好地连接到后缀，是补全质量良好的信号。在使用 n > 1 或重采样（见下一点）从若干补全中进行选择时，这一点尤为重要。

**重采样 3 到 5 次。** 虽然几乎所有补全都能连接到前缀，但在较难的情况下，模型可能会难以连接到后缀。我们发现，在这种情况下，重采样 3 或 5 次（或使用 best_of 并设 k=3,5），然后选择将 `finish_reason` 设为 "stop" 的样本，是一种有效的方法。重采样时，通常会希望使用较高的 temperature 来增加多样性。

注意：如果所有返回的样本其 `finish_reason` == "length"，很可能是 max_tokens 过小，模型在自然地连接提示和后缀之前就用完了 token。请考虑在重采样前增大 `max_tokens` 再进行重采样。

**尝试提供更多线索。** 在某些情况下，为了更好地帮助模型生成，你可以通过给出若干模式示例来提供线索，让模型能够据此判断自然的停止位置。

> 如何制作一杯美味的热巧克力：
>
> 1.** 把水煮沸**
> **2. 把热巧克力粉倒入杯中**
> **3. 将沸水倒入杯中** 4. 享用这杯热巧克力

> 1. 狗是忠诚的动物。
> 2. 狮子是凶猛的动物。
> 3. 海豚** 是爱嬉戏的动物。**
> 4. 马是雄伟的动物。



## Chat Completions vs. Completions

通过使用单个用户消息构造请求，可以让 Chat Completions 格式与 completions 格式类似。例如，可以使用以下 completions 提示词完成从英文到法文的翻译：

```
Translate the following English text to French: "{text}"
```

等价的 chat 提示词如下：

```
[{"role": "user", "content": 'Translate the following English text to French: "{text}"'}]
```

同样地，completions API 也可以通过相应地格式化输入来模拟用户与助手之间的对话 [相应地](https://platform.openai.com/playground/p/default-chat?model=gpt-3.5-turbo-instruct).

这些 API 之间的区别在于各自可用的底层模型。Chat Completions API 支持当前一代的 GPT 模型，例如 [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 以及更低成本的选项，例如 [`gpt-5.6-terra`](https://developers.openai.com/api/docs/models/gpt-5.6-terra).