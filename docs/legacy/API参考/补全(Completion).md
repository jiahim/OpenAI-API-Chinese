# 补全 ( Completion )

提供一个提示，模型会返回一个或多个预测补全，并且可以返回每个位置上的结果的概率。

## 创建补全 ( Create Completion )

`POST https://api.openai.com/v1/completions`

创建一个用于提供提示和入参的补全。

```bash
# Curl 请求示例
curl https://api.openai.com/v1/completions \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
  "model": "text-davinci-003",
  "prompt": "Say this is a test",
  "max_tokens": 7,
  "temperature": 0
}'
```

```javascript
// Node.js请求示例
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.createCompletion({
  model: "text-davinci-003",
  prompt: "Say this is a test",
  max_tokens: 7,
  temperature: 0,
});
```

```python
# Python 请求示例
import os
import openai
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.Completion.create(
  model="text-davinci-003",
  prompt="Say this is a test",
  max_tokens=7,
  temperature=0
)
```

```bash
# 通用请求参数
{
  "model": "text-davinci-003",
  "prompt": "Say this is a test",
  "max_tokens": 7,
  "temperature": 0,
  "top_p": 1,
  "n": 1,
  "stream": false,
  "logprobs": null,
  "stop": "\n"
}

# 通用响应内容
{
  "id": "cmpl-uqkvlQyYK7bGYrRHQ0eXlWi7",
  "object": "text_completion",
  "created": 1589478378,
  "model": "text-davinci-003",
  "choices": [
    {
      "text": "\n\nThis is indeed a test",
      "index": 0,
      "logprobs": null,
      "finish_reason": "length"
    }
  ],
  "usage": {
    "prompt_tokens": 5,
    "completion_tokens": 7,
    "total_tokens": 12
  }
}
```

## 请求体

---

**model**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:red;font-size:13px;margin-left:10px'>必须</span>

要使用的模型 ID ( model ID ) ，你可以使用[模型列表](https://platform.openai.com/docs/api-reference/models/list)API 来查看全部你可以使用的模型，或者查看我们的[模型概览](https://platform.openai.com/docs/models/overview)中关于它们的描述。

---

**prompt**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string | array</span>
<span style=' color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style=' color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：<|endoftext|></span>

用于生成补全的一个或多个提示，通常被编码为 string 、 string 数组、 token 数组、 token 数组的数组。

需要说明的是 <|endoftext|> 是模型在训练期间使用的分隔符，所以如果没有指定 prompt 的话，模型会自己新生成一篇文档。

---

**suffix**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：null</span>

在插入文本完成后出现的后缀。

---

**max_tokens**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>integer</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：16</span>

用于生成补全的最大[tokens](https://platform.openai.com/tokenizer)数量。

你的提示 ( prompt ) 数量加上 `max_tokens` 不能超过模型的上下文长度。大多数模型的上下文长度为 2048 个令牌(除了最新的模型，它支持 4096 个)。

---

**temperature**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>number</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：1</span>

使用什么 temperature 采样，介于 0 到 2 之间。更高的值比如 0.8 会让输出更加随机，更低的值比如 0.2 会让输出更加聚焦和明确。

我们一般推荐修改这个值或者 `top_p` 值，但不推荐同时修改两个值。

---

**top_p**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>number</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：1</span>

temperature 采样的另一种替代方案，被称为核采样( nucleus sampling )，其中模型考虑在 token 的结果中排前 `top_p` 的概率质量( probability mass )。所以 0.1 意味着只考虑包含前 10% 概率质量的 tokens 。

我们一般推荐修改这个值或者 `temperature` 值，但不推荐同时修改两个值。

---

**n**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>integer</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：1</span>

为每个 prompt 生成`n`个补全。

**提示**：因为这个参数会生成许多补全，它会大量消耗你的 token 额度。小心使用它并确保你设置了合理的 `max_tokens` 和 `stop` 。

---

**stream**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>boolean</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：false</span>

是否逐步返回部分结果。如果设置为 true，token 将会在可用的时候作为纯数据通过 sse ([server-sent events](https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events/Using_server-sent_events)) 发送，直到数据流被 `data: [DONE]` 消息结束。

---

**logprobs**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>integer</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：null</span>

将最有可能的前 `logprobs` 个 token 的对数概率以及所选的 token 放在 `logprobs` 属性中。例如，如果 `logprobs` 是 5，那 API 会返回前 5 个最可能的 token 列表。 API 会始终返回所抽样的 token 的对数概率，所以在响应中可能最多有 `logprobs+1` 个元素。

`logprobs`的最大值为 5，如果你需要的值大于这个，请通过[帮助中心](https://help.openai.com/)联系我们，并描述你的用例。

---

**echo**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>boolean</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：false</span>

将输入的提示(prompt)加回到补全(completion)的前面。

---

**stop**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string | array</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：null</span>

最多可以传入 4 个字符串，当模型遇到这些字符串时，API 将停止进一步生成结果。返回的文本将不包含传入的停止字符串。

---

**presence_penalty**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>number</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：0</span>

介于 -2.0 到 2.0 之间的值。正值会根据新 token 到目前为止，是否出现在文本中来惩罚 ( 抑制 ) 它们，从而增加模型谈论新主题的可能性。

[请参阅有关频率和存在惩罚的更多信息。](https://platform.openai.com/docs/api-reference/parameter-details)

---

**frequency_penalty**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>number</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：0</span>

介于 -2.0 到 2.0 之间的值。正值会根据新 token 到目前为止，在当前文本中出现的频率来惩罚 ( 抑制 ) 它们，从而降低模型一字不差的地重复同一行的可能性。

[请参阅有关频率和存在惩罚的更多信息。](https://platform.openai.com/docs/api-reference/parameter-details)

---

**best_of**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>integer</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：1</span>

在服务端侧生成 `best_of` 补全，并返回 "最好" ( 每个 token 都是最高的对数概率 ) 的那个。结果不能是流 ( streamed )。

当同时和 `n` 使用， `best_of` 用来控制候选补全的数量， `n` 指明要有多少个返回， `best_of` 必须大于 `n` 。

**提示**：因为这个参数会生成许多补全，它会大量消耗你的 token 额度。小心使用它并确保你设置了合理的 `max_tokens` 和 `stop` 。

---

**logit_bias**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>map</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：null</span>

修改指定的 token 在补全中出现的可能性。

接收一个 json 对象，该对象将 token (由 GPT 标记器中的 token ID 指定)映射到从-100 到 100 的关联偏差值。你可以使用 [标记器工具](https://platform.openai.com/tokenizer?view=bpe) (对 GPT-2 和 GPT-3 有效) 将文本转换为 token ID。在数学上，偏差被添加到抽样前由模型生成的对数中。确切的影响因模型而异，但 -1 之间 1 的值会减少或增加选中的可能性；像 -100 或 100 的值会导致拒绝或独占在相关 token 的选中。

举个例子，你可以通过 `{"50256": -100}` 来阻止在一开始生成 <|endoftext|> token。

---

**user**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>

代表最终用户的唯一标识，用来帮助 OpenAI 监控并检测滥用。[了解更多](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids)

---