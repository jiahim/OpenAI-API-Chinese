# 会话 ( Chat )
通过提供一段聊天对话，模型会返回聊天接下来的补全内容。

## 创建聊天补全 ( 测试中 ) ( Create chat completion )
`POST https://api.openai.com/v1/chat/completions `

创建一个聊天消息的补全。

```bash
# Curl 请求示例
curl https://api.openai.com/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
  "model": "gpt-3.5-turbo",
  "messages": [{"role": "user", "content": "Hello!"}]
}'
```
```Python
# Python 请求示例
import os
import openai
openai.api_key = os.getenv("OPENAI_API_KEY")

completion = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
    {"role": "user", "content": "Hello!"}
  ]
)

print(completion.choices[0].message)
```
```JavaScript
// Node.js请求示例
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [{role: "user", content: "Hello world"}],
});
console.log(completion.data.choices[0].message);
```
```bash
# 参数
{
  "model": "gpt-3.5-turbo",
  "messages": [{"role": "user", "content": "Hello!"}]
}
# 响应
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "\n\nHello there, how may I assist you today?",
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
```
## 请求体

---

**model**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:red;font-size:13px;margin-left:10px'>必须</span>

要使用的模型 ID ( model ID ) ，只支持 `gpt-3.5-turbo` 和 `gpt-3.5-turbo-0301`。

---
**messages**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>array</span>
<span style='color:red;font-size:13px;margin-left:10px'>必须</span>

基于[消息格式](</指引/会话补全.md#介绍>)用于生成聊天补全内容的消息

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

为每个输入消息生成多少个聊天补全选项 ( 译者注：即在返回的参数 choices 中会返回多`n` 个)。

---

**stream**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>boolean</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：false</span>

如果设置了，将会一点点发送增量的消息，就像在 ChatGPT 中一样。 当输出结果时，返回的内容将作为[服务端推送事件]((https://developer.mozilla.org/zh-CN/docs/Web/API/Server-sent_events/Using_server-sent_events))的数据发送，流将通过`data: [DONE]`表明消息结束。请参阅 OpenAI Cookbook 查看[示例代码](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_stream_completions.ipynb)。

---

**stop**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string | array</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：null</span>

最多可以传入 4 个字符串，当模型遇到这些字符串时，API 将停止进一步生成结果。

---

**max_tokens**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>integer</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：正无穷</span>

聊天完成时生成的最大[tokens](https://platform.openai.com/tokenizer)数量。

输入的 token 和生成的 token 的总长度受模型上下文长度的限制。

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

**logit_bias**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>map</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>默认值：null</span>

修改指定的 token 在补全中出现的可能性。

接受一个json对象，该对象将 tokens ( 由标记器 ( tokenizer ) 中的 token ID 指定 ) 映射到从-100到100的关联偏差值。在数学上，模型生成样本前会将偏差添加到对数中。其精确性会因模型而异，但在 -1 到 1 的范围内的值应该会减少或增加选择的可能性；像 -100 或 100 这样的值应该会导致相关 token 被禁止选择或只能选择相关 token。

---

**user**
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>string</span>
<span style='color:#8e8ea0;font-size:13px;margin-left:10px'>可选的</span>

代表最终用户的唯一标识，用来帮助 OpenAI 监控并检测滥用。[了解更多](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids)

---