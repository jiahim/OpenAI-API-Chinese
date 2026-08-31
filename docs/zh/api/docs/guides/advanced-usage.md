# 高级用法

> 完整文档索引请参见 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

OpenAI 的文本生成模型（通常被称为生成式预训练变换器或大语言模型）经过训练，能够理解自然语言、代码和图像。这些模型会根据输入提供文本输出。发送给这些模型的文本输入也称为“提示词”。设计提示词本质上就是你对大语言模型进行“编程”的方式，通常是通过提供指令或一些成功完成任务的示例来实现。

## Reproducible outputs

Chat Completions 默认情况下是非确定性的（这意味着模型输出可能因请求而异）。尽管如此，我们通过让你能够访问以下参数来提供对确定性输出的一定控制： [`seed`](https://developers.openai.com/api/reference/resources/chat#chat-create-seed) 参数和 [`system_fingerprint`](https://developers.openai.com/api/reference/resources/completions#completions/object-system_fingerprint) response 字段。

若要在 API 调用之间获得（大致）确定性的输出，你可以：

- 设置 [seed](https://developers.openai.com/api/reference/resources/chat#chat-create-seed) 参数为任意你选择的整数，并在你希望获得确定性输出的所有请求中使用相同的值。
- 确保所有其他参数（例如 `prompt` 或 `temperature`）在各请求之间完全一致。

有时，由于我们 OpenAI 端对模型配置进行必要更改，确定性可能会受到影响。为了帮助你跟踪这些更改，我们提供了 [`system_fingerprint`](https://developers.openai.com/api/reference/resources/chat#chat/object-system_fingerprint) 字段。如果该值不同，你可能会因我们系统在系统层面所做的更改而看到不同的输出。

[确定性输出



      Explore the new seed parameter in the OpenAI cookbook](https://developers.openai.com/cookbook/examples/reproducible_outputs_with_the_seed_parameter)

## 管理令牌

语言模型按称为 token 的文本块读写文本。在英文中，一个 token 可以短到一个字符，也可以长到一个单词（例如， `a` 或 ` apple`），而在某些语言中，token 甚至可以比一个字符更短，或比一个单词更长。

作为一个粗略的经验法则，对于英文文本，1 个 token 大约对应 4 个字符或 0.75 个单词。

查看我们的 
  [Tokenizer 工具](https://platform.openai.com/tokenizer) 
  以测试特定字符串并查看它们如何被转换为 token。

例如，字符串 `"ChatGPT is great!"` 被编码为六个 token： `["Chat", "G", "PT", " is", " great", "!"]`.

在一次 API 调用中，token 的总数量会影响：

- 你的 API 调用花费多少，因为你是按 token 计费的
- 你的 API 调用耗时多久，因为生成的 token 越多，所需时间越长
- 你的 API 调用是否能够成功，因为总 token 必须低于模型的最大限制（ `gpt-3.5-turbo`)

输入和输出 token 都会计入这些数量。例如，如果你的API调用在消息输入中使用了 10 个 token，并在消息输出中收到了 20 个 token，那么将按 30 个 token 计费。但请注意，对于某些模型，输入和输出 token 的单价不同（请参阅 [定价](https://openai.com/api/pricing) 页面了解更多信息）。

要查看 API 调用使用了多少 token，请检查 `usage` 字段（在 API 响应中，例如， `response['usage']['total_tokens']`).

类聊天模型 `gpt-3.5-turbo` 和 `gpt-4-turbo-preview` 使用 token 的方式与 completions API 中可用的模型相同，但由于其基于消息的格式，要计算一次对话将使用多少 token 会更加困难。



下面是一个计算传入消息 token 数量的示例函数 `gpt-3.5-turbo-0613`.

消息转换为 token 的具体方式可能因模型而异。因此，当未来发布新模型版本时，此函数返回的结果可能只是近似值。

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


接下来，创建一条消息并将其传递给上面定义的函数以查看 token 计数，这应该与 API usage 参数返回的值一致：

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


为了确认上面函数生成的数量与 API 返回的数量一致，请创建一个新的 Chat Completion：

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



要查看文本字符串中的 token 数量而不发起 API 调用，可以使用 OpenAI 的 [tiktoken](https://github.com/openai/tiktoken) Python 库。示例代码可以在 OpenAI Cookbook 中关于 [如何使用 tiktoken 计算 token 的指南](https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken).

传递给 API 的每条消息会消耗 content、role 和其他字段中的 token 数量，以及一些用于后台格式化的额外 token。这一数字未来可能会略有变化。

如果对话的 token 数量超出模型的最大限制（例如，对于 `gpt-3.5-turbo` 超过 4097 个 token，或者对于 `gpt-4o`），超过 128k 个 token），你必须截断、省略或以其他方式缩减文本，直到其符合要求。请注意，如果从消息输入中移除某条消息，模型将完全失去与之相关的知识。

请注意，较长的对话更有可能收到不完整的回复。例如，一个 `gpt-3.5-turbo` 长度为 4090 个 token 的对话，其回复在仅生成 6 个 token 后就会被截断。

## 参数详情

### 频率和存在惩罚

Chat Completions API 和旧版 Completions 中提供的 frequency 与 presence 惩罚参数，可用于降低对重复 token 序列进行采样的概率。 [聊天补全接口](https://developers.openai.com/api/reference/resources/chat) 和 [旧版 Completions API](https://developers.openai.com/api/reference/resources/completions) 可用于降低对重复 token 序列进行采样的概率。



它们的实现方式是直接对 logits（未经归一化的对数概率）施加一个加性贡献。

```python
mu[j] = mu[j] - c[j] * alpha_frequency - float(c[j] > 0) * alpha_presence
```


其中：

- `mu[j]` 是第 j 个 token 的 logits
- `c[j]` 是该 token 在当前位置之前被采样的频率
- `float(c[j] > 0)` 为 1 当 `c[j] > 0` ，否则为 0
- `alpha_frequency` 是频率惩罚系数
- `alpha_presence` 是存在惩罚系数

可以看到，presence 惩罚是一次性加性贡献，适用于所有至少被采样过一次的 token；而 frequency 惩罚的贡献与某个特定 token 已经被采样的频率成正比。



如果目标只是适度减少重复样本，惩罚系数的合理取值在 0.1 到 1 左右。如果目标是强力抑制重复，则可以将系数提升到 2，但这样做会明显降低样本质量。使用负值可以提高重复出现的可能性。

### Token log probabilities

该 [`logprobs`](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) parameter found in the [聊天补全接口](https://developers.openai.com/api/reference/resources/chat) 和 [旧版 Completions API](https://developers.openai.com/api/reference/resources/completions), when requested, provides the log probabilities of each output token, and a limited number of the most likely tokens at each token position alongside their log probabilities. This can be useful in some cases to assess the confidence of the model in its output, or to examine alternative responses the model might have given.

### 其他参数

请参阅完整的 [API 参考文档](https://platform.openai.com/docs/api-reference/chat) 以了解更多信息。