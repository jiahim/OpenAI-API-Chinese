# 高级用法

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

OpenAI 的文本生成模型（通常称为生成式预训练变换器或大语言模型）经过训练，能够理解自然语言、代码和图像。这些模型会根据输入提供文本输出。这些模型的文本输入也称为“提示词”。设计提示词本质上就是通过提供指令或成功完成任务的示例来“编程”大语言模型。

## 可复现的输出

聊天补全接口 默认具有非确定性（即模型输出在每次请求之间可能不同）。话虽如此，我们通过让你访问以下参数来提供对确定性输出的一些控制 [`seed`](https://developers.openai.com/api/reference/resources/chat#chat-create-seed) 参数和 [`system_fingerprint`](https://developers.openai.com/api/reference/resources/completions#completions/object-system_fingerprint) 响应字段。

要在多次 API 调用中接收（基本上是）确定性的输出，你可以：

- 设置 [seed](https://developers.openai.com/api/reference/resources/chat#chat-create-seed) 参数为任意你选择的整数,并在你希望获得确定性输出的所有请求中使用相同的值。
- 确保所有其他参数(例如 `prompt` 或 `temperature`)在各个请求之间完全相同。

有时，确定性可能会受到影响，因为 OpenAI 在我们这边对模型配置进行了必要的更改。为了帮助你跟踪这些更改，我们提供了 [`system_fingerprint`](https://developers.openai.com/api/reference/resources/chat#chat/object-system_fingerprint) 字段。如果该值不同，你可能会因为我们在系统中所做的更改而看到不同的输出。

[确定性输出



      Explore the new seed parameter in the OpenAI cookbook](https://developers.openai.com/cookbook/examples/reproducible_outputs_with_the_seed_parameter)

## 管理 token

语言模型以称为 token 的块为单位读取和写入文本。在英文中，一个 token 可能短到一个字符，也可能长到一个单词（例如， `a` 或 ` apple`），而在某些语言中，token 可能比一个字符更短，也可能比一个单词更长。

作为粗略的经验法则，对于英文文本，1 个 token 大约对应 4 个字符或 0.75 个单词。

查看我们的 
  [Tokenizer 工具](https://platform.openai.com/tokenizer) 
  以测试特定字符串并查看它们如何被转换为 token。

例如，字符串 `"ChatGPT is great!"` 被编码为六个 token： `["Chat", "G", "PT", " is", " great", "!"]`.

一次 API 调用中的 token 总数会影响：

- 由于按 token 计费，你的 API 调用的成本
- 由于生成更多 token 需要更长时间，你的 API 调用的耗时
- 由于总 token 数必须低于模型的最大限制（该模型为 4097 tokens），你的 API 调用是否能成功执行 `gpt-3.5-turbo`)

输入和输出 token 都会计入这些数量。例如，如果你的API 调用在消息输入中使用了 10 个 token，并在消息输出中收到了 20 个 token，那么将按 30 个 token 计费。但请注意，对于某些模型，输入和输出 token 的单价不同（请参阅 [定价](https://openai.com/api/pricing) 页面了解更多信息）。

若要查看 API 调用使用了多少 token，请检查 `usage` 字段（在 API 响应中，例如， `response['usage']['total_tokens']`).

等聊天模型使用 token 的方式与 `gpt-3.5-turbo` 和 `gpt-4-turbo-preview` 补全 API 中提供的模型相同，但由于它们基于消息的格式，计算一次对话会使用多少 token 会更加困难。



下面是一个针对传入 `gpt-3.5-turbo-0613`.

的消息进行 token 计数的示例函数。消息转换为 token 的具体方式可能因模型而异。因此，当未来发布新模型版本时，此函数返回的结果可能仅为近似值。

```python
def num_tokens_from_messages(messages, model="gpt-3.5-turbo-0613"):
    """Returns the number of tokens used by a list of messages."""
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")
    if model == "gpt-3.5-turbo-0613":  # note: future models may deviate from this
        num_tokens = 0
        for message in messages:
            num_tokens += (
                4  # every message follows <im_start>{role/name}\n{content}<im_end>\n
            )
            for key, value in message.items():
                num_tokens += len(encoding.encode(value))
                if key == "name":  # if there's a name, the role is omitted
                    num_tokens += -1  # role is always required and always 1 token
        num_tokens += 2  # every reply is primed with <im_start>assistant
        return num_tokens
    raise ValueError(
        f"num_tokens_from_messages() only supports gpt-3.5-turbo-0613, not {model}."
    )
```


接下来，创建一条消息并将其传递给上面定义的函数以查看 token 计数，这应与 API usage 参数返回的值一致：

```python
messages = [
    {
        "role": "system",
        "content": "You are a helpful, pattern-following assistant that translates corporate jargon into plain English.",
    },
    {
        "role": "system",
        "name": "example_user",
        "content": "New synergies will help drive top-line growth.",
    },
    {
        "role": "system",
        "name": "example_assistant",
        "content": "Things working well together will increase revenue.",
    },
    {
        "role": "system",
        "name": "example_user",
        "content": "Let's circle back when we have more bandwidth to touch base on opportunities for increased leverage.",
    },
    {
        "role": "system",
        "name": "example_assistant",
        "content": "Let's talk later when we're less busy about how to do better.",
    },
    {
        "role": "user",
        "content": "This late pivot means we don't have time to boil the ocean for the client deliverable.",
    },
]

model = "gpt-3.5-turbo-0613"

print(f"{num_tokens_from_messages(messages, model)} prompt tokens counted.")
# Should show ~126 total_tokens
```


若要确认上面函数生成的 token 数与 API 返回的相同，请创建一个新的 Chat Completion：

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.chat.completions.create({
  model,
  messages,
  temperature: 0,
});

console.log(`${response.usage.prompt_tokens} prompt tokens used.`);
```

```python
# example token count from the OpenAI API
from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model=model,
    messages=messages,
    temperature=0,
)

print(f"{response.usage.prompt_tokens} prompt tokens used.")
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.chat.completions.ChatCompletionCreateParams;

ChatCompletionCreateParams params =
    ChatCompletionCreateParams.builder()
        .model("gpt-3.5-turbo-0613")
        .addUserMessage("Translate this sentence into plain English.")
        .temperature(0)
        .build();

var completion = client.chat().completions().create(params);
var usage =
    completion.usage().orElseThrow(() -> new IllegalStateException("No usage returned"));
System.out.println(usage.promptTokens() + " prompt tokens used.");
```



若要在不发起 API 调用的情况下查看文本字符串中的 token 数，请使用 OpenAI 的 [tiktoken](https://github.com/openai/tiktoken) Python 库。示例代码可在 OpenAI Cookbook 的指南中找到，主题为 [如何使用 tiktoken 统计 token 数](https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken).

传递给 API 的每条消息会消耗其 content、role 和其他字段中的 token 数量，再加上少量用于后台格式化的 token。该数值未来可能略有变化。

如果一次对话的 token 数量超出模型的最大限制（例如，对于 `gpt-3.5-turbo` 超过 4097 个 token，或对于 `gpt-4o`），超过 128k 个 token），你将不得不截断、省略或以其他方式缩减文本，使其符合限制。请注意，如果从 messages 输入中移除了某条消息，模型将失去与之相关的所有知识。

请注意，较长的对话更容易收到不完整的回复。例如，一个 `gpt-3.5-turbo` 长度为 4090 个 token 的对话，其回复在仅生成 6 个 token 后就会被截断。

## 参数详情

### 频率与存在惩罚

频率和存在惩罚可以在 [Chat Completions API](https://developers.openai.com/api/reference/resources/chat) 和 [旧版 Completions API](https://developers.openai.com/api/reference/resources/completions) 中用于降低采样到重复 token 序列的可能性。



它们的实现方式是直接对 logits（未归一化的对数概率）施加一个加性贡献。

```python
mu[j] = mu[j] - c[j] * alpha_frequency - float(c[j] > 0) * alpha_presence
```

```ruby
mu[j] = mu[j] - c[j] * alpha_frequency - ((c[j] > 0) ? alpha_presence : 0.0)
```


其中：

- `mu[j]` 是第 j 个 token 的 logits
- `c[j]` 是该 token 在当前位置之前被采样的次数
- 存在惩罚会减去 `alpha_presence` 如果 `c[j] > 0` ，否则为 0
- `alpha_frequency` 是频率惩罚系数
- `alpha_presence` 是存在惩罚系数

如我们所见，presence penalty（存在惩罚）是一项一次性附加项，适用于所有至少已被采样过一次的 token；而 frequency penalty（频率惩罚）则是一项与特定 token 已被采样频次成正比的贡献项。



如果目标只是适度降低重复采样，惩罚系数的合理取值大约在 0.1 到 1 之间。如果目标是强烈抑制重复，可以将系数提升到 2，但这可能会明显降低采样质量。也可以使用负值来提高重复出现的可能性。

### Token log probabilities

该 [`logprobs`](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 中找到了该参数， [Chat Completions API](https://developers.openai.com/api/reference/resources/chat) 和 [旧版 Completions API](https://developers.openai.com/api/reference/resources/completions)，在请求时，会提供每个输出 token 的对数概率，以及在每个 token 位置上出现概率最高的若干 token 及其对数概率。在某些情况下，这对于评估模型对其输出的置信度，或检查模型可能给出的其他回复很有用。

### 其他参数

查看完整的 [API 参考文档](https://platform.openai.com/docs/api-reference/chat) 以了解更多信息。