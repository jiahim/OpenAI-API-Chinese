# 高级用法

> 关于完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

OpenAI 的文本生成模型（通常称为生成式预训练变换器或大型语言模型）经过训练，能够理解自然语言、代码和图像。这些模型根据输入提供文本输出。这些模型的文本输入也被称为“提示”。设计提示本质上就是你如何“编程”一个大型语言模型，通常是通过提供指令或一些如何成功完成任务的示例。

## 可复现的输出

Chat Completions 默认情况下是非确定性的（这意味着模型输出可能因请求而异）。尽管如此，我们通过向你提供 [`seed`](https://developers.openai.com/api/reference/resources/chat#chat-create-seed) 参数和 [`system_fingerprint`](https://developers.openai.com/api/reference/resources/completions#completions/object-system_fingerprint) 响应字段，为确定性输出提供了一些控制。

要在 API 调用中获得（大致）确定性的输出，你可以：

- 将 [seed](https://developers.openai.com/api/reference/resources/chat#chat-create-seed) 参数设置为你选择的任意整数，并在希望获得确定性输出的所有请求中使用相同的值。
- 确保所有其他参数（如 `prompt` 或 `temperature`）在每次请求中都完全相同。

有时，由于OpenAI对模型配置的必要更改，确定性可能会受到影响。为了帮助你跟踪这些更改，我们会公开 [`system_fingerprint`](https://developers.openai.com/api/reference/resources/chat#chat/object-system_fingerprint) 字段。如果该值不同，你可能会因我们系统上的更改而看到不同的输出。

[确定性输出



      Explore the new seed parameter in the OpenAI cookbook](https://developers.openai.com/cookbook/examples/reproducible_outputs_with_the_seed_parameter)

## 管理令牌

语言模型以称为 token 的块为单位读写文本。在英语中，一个 token 可以短至一个字符，也可以长至一个单词（例如， `a` 或 ` apple`），在某些语言中，token 甚至可以短于一个字符或长于一个单词。

粗略估算，1 个 token 大约相当于英语文本中的 4 个字符或 0.75 个单词。

请查看我们的 
  [Tokenizer 工具](https://platform.openai.com/tokenizer) 
  来测试特定字符串，并了解它们如何被转换为 token。

例如，字符串 `"ChatGPT is great!"` 被编码为六个 token： `["Chat", "G", "PT", " is", " great", "!"]`.

一次 API 调用中的 token 总数会影响：

- 你的API调用花费多少，因为你按令牌付费
- 你的API调用需要多长时间，因为生成更多令牌需要更多时间
- 你的API调用是否有效，因为总令牌数必须低于模型的最大限制（4097个令牌，适用于 `gpt-3.5-turbo`)

输入和输出 token 都计入这些数量。例如，如果你的API调用在消息输入中使用了 10 个 token，并且在消息输出中收到了 20 个 token，则你将按 30 个 token 计费。但请注意，对于某些模型，输入与输出 token 的每个 token 价格不同（请参阅 [定价](https://openai.com/api/pricing) 页面了解更多信息）。

要查看API调用使用了多少 token，请检查 `usage` API响应中的字段（例如， `response['usage']['total_tokens']`).

像 `gpt-3.5-turbo` 和 `gpt-4-turbo-preview` 这样的聊天模型使用 token 的方式与 completions API中的可用模型相同，但由于它们基于消息的格式，计算对话将使用多少 token 更加困难。



以下是用于计算传递到 `gpt-3.5-turbo-0613`.

消息转换为 token 的确切方式可能因模型而异。因此，当未来发布新模型版本时，此函数返回的答案可能仅是近似值。

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


接下来，创建一条消息并将其传递给上面定义的函数以查看 token 数量，这应该与API的 usage 参数返回的值匹配：

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


要确认我们上面的函数生成的数字与API返回的数字相同，请创建一个新的 Chat Completion：

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



要查看文本字符串中有多少 token 而不进行API调用，请使用OpenAI的 [tiktoken](https://github.com/openai/tiktoken) Python 库。示例代码可在OpenAI Cookbook 的指南中找到，该指南介绍了 [如何使用 tiktoken 计算 token](https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken).

传递给API的每条消息都会消耗内容、角色和其他字段中的 token 数量，外加一些用于幕后格式化的额外 token。这将来可能会略有变化。

如果对话的 token 过多，无法适应模型的最大限制（例如，对于 `gpt-3.5-turbo` 超过 4097 个 token，或对于 `gpt-4o`），超过 128k 个 token），则你必须截断、省略或以其他方式缩小文本直到其适合为止。请注意，如果从 messages 输入中删除一条消息，模型将丢失对其的所有了解。

请注意，长对话更可能收到不完整的回复。例如，一个 `gpt-3.5-turbo` 长达 4090 个标记的对话，其回复将在仅 6 个标记后被截断。

## 参数详情

### 频率与存在惩罚

在 [Chat Completions API](https://developers.openai.com/api/reference/resources/chat) 和 [旧版 Completions API](https://developers.openai.com/api/reference/resources/completions) 中发现的频率和存在惩罚可用于降低采样重复 token 序列的可能性。



它们通过直接修改 logits（未归一化的对数概率）并添加一个加性贡献来起作用。

```python
mu[j] = mu[j] - c[j] * alpha_frequency - float(c[j] > 0) * alpha_presence
```


其中：

- `mu[j]` 是第 j 个 token 的 logits
- `c[j]` 是该 token 在当前位置之前被采样的频率
- `float(c[j] > 0)` 如果 `c[j] > 0` 则为 1，否则为 0
- `alpha_frequency` 是频率惩罚系数
- `alpha_presence` 是存在性惩罚系数

如我们所见，存在惩罚是一个一次性的加性贡献，适用于所有至少被采样一次的令牌，而频率惩罚是一个与特定令牌已被采样的频率成比例的贡献。



如果目标仅是稍微减少重复采样，惩罚系数的合理值约为0.1到1。如果目标是强烈抑制重复，则可以将系数增加到2，但这会明显降低采样的质量。负值可用于增加重复的可能性。

### Token 对数概率

该 [`logprobs`](https://developers.openai.com/api/reference/resources/chat#chat-create-logprobs) 参数见于 [Chat Completions API](https://developers.openai.com/api/reference/resources/chat) 以及 [Legacy Completions API](https://developers.openai.com/api/reference/resources/completions)，中，在请求时提供每个输出 token 的对数概率，以及每个 token 位置上有限数量的最可能 token 及其对数概率。这在某些情况下有助于评估模型对其输出的置信度，或检查模型可能给出的替代响应。

### 其他参数

请参阅完整的 [API 参考文档](https://platform.openai.com/docs/api-reference/chat) 以了解更多信息。