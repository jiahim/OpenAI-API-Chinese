# 高级用法

> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

OpenAI 的文本生成模型（通常称为生成式预训练 Transformer 或大语言模型）已经过训练，能够理解自然语言、代码和图像。这些模型会针对输入提供文本输出。这些模型的文本输入也称为“提示词”。设计提示词本质上就是你对大语言模型进行“编程”的方式，通常通过提供指令或一些成功完成任务的示例来实现。

## 可复现输出

Chat Completions 默认是非确定性的（即模型输出在每次请求之间可能不同）。尽管如此，我们通过提供对以下内容的访问权限，为你提供一些对确定性输出的控制： [`seed`](https://developers.openai.com/api/reference/resources/chat#chat-create-seed) 参数以及 [`system_fingerprint`](https://developers.openai.com/api/reference/resources/completions#completions/object-system_fingerprint) 响应字段。

要在多次 API 调用之间获得（大体上）确定性的输出，你可以：

- Set the [seed](https://developers.openai.com/api/reference/resources/chat#chat-create-seed) 参数设为任意整数，并在你希望获得确定性输出的所有请求中使用相同的值。
- 确保所有其他参数（例如 `prompt` 或 `temperature`）在所有请求中保持完全一致。

有时，确定性可能会受到影响，因为 OpenAI 会在我们这边对模型配置进行必要的更改。为了帮助你跟踪这些更改，我们暴露了 [`system_fingerprint`](https://developers.openai.com/api/reference/resources/chat#chat/object-system_fingerprint) 字段。如果该值不同，你可能会看到由于我们在系统中所做的更改而产生的不同输出。

[确定性输出



      Explore the new seed parameter in the OpenAI cookbook](https://developers.openai.com/cookbook/examples/reproducible_outputs_with_the_seed_parameter)

## 管理 tokens

语言模型以称为 token 的文本块为单位读取和生成文本。在英文中，一个 token 可能短到一个字符，也可能长到一个词（例如， `a` 或 ` apple`），而在某些语言中，token 可能比一个字符更短，甚至比一个词更长。

作为粗略的经验法则，对于英文文本，1 个 token 大约对应 4 个字符或 0.75 个词。

查看我们的 
  [Tokenizer 工具](https://platform.openai.com/tokenizer) 
  ，针对特定字符串进行测试，看看它们如何被转换 token。

例如，字符串 `"ChatGPT is great!"` 会被编码为六个 token： `["Chat", "G", "PT", " is", " great", "!"]`.

一次 API 调用中的 token 总数会影响：

- 你的 API 调用的成本，因为你按 token 付费
- 你的 API 调用耗时，因为生成的 token 越多，所需时间也越长
- 你的 API 调用是否能够成功，因为总 token 数必须低于模型的最大限制（ `gpt-3.5-turbo`)

输入和输出 token 都会计入这些数量。例如，如果你的 API 调用在消息输入中使用了 10 个 token，并在消息输出中收到了 20 个 token，你将被计费 30 个 token。但请注意，对于某些模型，输入 token 与输出 token 的单价可能不同（详见 [定价](https://openai.com/api/pricing) 页面）。

要查看一次 API 调用所使用的 token 数，请检查响应中的 `usage` 字段（例如，API 响应中的， `response['usage']['total_tokens']`).

等聊天模型 `gpt-3.5-turbo` 和 `gpt-4-turbo-preview` 使用 token 的方式与 completions API 中可用的模型相同，但由于它们基于消息的格式，要统计一次对话将使用多少 token 会更困难一些。



下方是一个针对传入 `gpt-3.5-turbo-0613`.

的消息进行 token 计数的示例函数。将消息转换为 token 的具体方式可能会因模型而异。因此，当未来发布新模型版本时，该函数返回的结果可能仅为近似值。

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


接下来，创建一条消息并将其传入上面定义的函数以查看 token 计数，结果应与 API 用量参数返回的值一致：

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


为确认上述函数生成的 token 数与 API 返回的结果一致，请创建一个新的 Chat Completion：

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



若要在不发起 API 调用的情况下统计文本字符串中的 token 数，可使用 OpenAI 的 [tiktoken](https://github.com/openai/tiktoken) Python 库。示例代码可在 OpenAI Cookbook 关于 [如何使用 tiktoken 统计 token](https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken).

传入 API 的每条消息都会消耗内容、角色及其他字段中的 token 数，再加上少量用于后台格式化的额外 token。该数值在未来可能会略有变化。

如果一次对话中的 token 数量超出模型的最大限制（例如，对于 `gpt-3.5-turbo` 超过 4097 个 token，或对于 `gpt-4o`），超过 128k 个 token），你必须对文本进行截断、省略或其他方式的缩减，直到其符合限制。请注意，如果某条消息从 messages 输入中被移除，模型将失去与之相关的全部上下文。

请注意，较长的对话更容易收到不完整的回复。例如，一个 `gpt-3.5-turbo` 长度为 4090 个 token 的对话，其回复在仅生成 6 个 token 后就会被截断。

## 参数详情

### 频率和存在惩罚

在 [Chat Completions API](https://developers.openai.com/api/reference/resources/chat) 和 [旧版 Completions API](https://developers.openai.com/api/reference/resources/completions) 中存在的频率和存在惩罚，可用于降低采样出重复词元序列的可能性。



它们的工作原理是直接对 logits（未归一化的对数概率）施加一个加性贡献来修改其值。

```python
mu[j] = mu[j] - c[j] * alpha_frequency - float(c[j] > 0) * alpha_presence
```


其中：

- `mu[j]` 是第 j 个 token 的 logits
- `c[j]` 是在当前位置之前该 token 被采样的次数
- `float(c[j] > 0)` 为 1 如果 `c[j] > 0` 否则为 0
- `alpha_frequency` 是频率惩罚系数
- `alpha_presence` 是存在惩罚系数

可以看到，存在惩罚是一次性累加的贡献，会作用于所有至少被采样过一次的 token；而频率惩罚则按某个 token 已被采样的频率成比例地施加贡献。



如果目标只是适度减少重复采样，惩罚系数的合理取值大约在 0.1 到 1 之间。如果目标是强力抑制重复，可以把系数提高到 2，但这会明显降低样本质量。使用负值则可以提高重复出现的可能性。

### Token log probabilities

该 [`logprobs`](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) parameter found in the [Chat Completions API](https://developers.openai.com/api/reference/resources/chat) 和 [旧版 Completions API](https://developers.openai.com/api/reference/resources/completions), when requested, provides the log probabilities of each output token, and a limited number of the most likely tokens at each token position alongside their log probabilities. This can be useful in some cases to assess the confidence of the model in its output, or to examine alternative responses the model might have given.

### 其他参数

请参阅完整 [API 参考文档](https://platform.openai.com/docs/api-reference/chat) 以了解更多信息。