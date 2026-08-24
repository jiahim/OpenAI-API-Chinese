# 会话补全 ( 测试版 )
[ChatGPT](https://chat.openai.com/chat) 基于 OpenAI 最先进的语言模型 `gpt-3.5-turbo`。

使用 OpenAI 的 API，你可以使用 `gpt-3.5-turbo` 构建你自己的应用来做这些事情:
- 起草一份邮件或者其他文字内容
- 写 Python 代码
- 回答关于一组文档的问题
- 创建会话代理 ( conversational agents )
- 给你的软件提供一个自然语言的接口
- 辅导各种学科
- 语言翻译
- 假扮成游戏中货其他内容的角色

这个指引说明了如何[调用基于聊天的语音模型的API](</API参考/会话(Chat).md>)并分享了一些能获取到更好结果的技巧。你也可以体验新的[ OpenAI 在线编辑器的聊天格式](https://platform.openai.com/playground?mode=chat)。

## **介绍**
聊天模型通过一串聊天对话作为输入，并返回一个模型生成的消息作为输出。

尽管聊天格式的设计是为了多轮对话更简单，但它对于没有任何对话的单轮任务同样有用(例如以前由 `text-davinci-003` 等指令遵循模型提供的任务)。

下面是一个 API 调用的例子:
```Python
# 提示: 你需要使用 OpenAI Python v0.27.0 版本来运行下面的代码
import openai

openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
        {"role": "system", "content": "你是一个能干的助手."},
        {"role": "user", "content": "谁赢得了2020年的世界职业棒球大赛?"},
        {"role": "assistant", "content": "洛杉矶道奇队在2020年赢得了世界职业棒球大赛冠军."},
        {"role": "user", "content": "它在哪里举办的?"}
    ]
)
```

messages 参数是主要的输入。 messages 必须是一哥的消息对象  ( message object )数组，每个对象拥有一个 role ( “system”, “user”, 或 “assistant” ) 和 content ( 消息的内容 )。会话可以少至 1 条消息或者是有许多条。

通常，会话首先使用系统消息 ( “system” ) 格式化，然后交替使用用户消息 ( “user” ) 和助手消息 ( “assistant” )。

系统消息有助于设定助手的行为。在上面的例子中，助手被说明为“你是一个能干的助手”。

用户消息帮助指示助手。它们可以由应用的用户生成，也可以由开发者设置为指令。

助手消息用于存储之前的响应。它们也可以是由开发者编写用于获取期望响应的示例。

当用户的指令是关于之前的消息时，包含聊天历史记录将有所帮助。在前面的例子中，用户最后的问题“在哪里举办的?”只有在前面关于世界职业棒球大赛的上下文中有意义。因为模型不能记住前面的请求，所以全部的相关信息必须在会话中提供。如果会话包含的 token 超出了模型的限制，则需要用一些方法去缩减会话。

### **响应格式**
下面是一个 API 响应的格式示例:
```Bash
{
 'id': 'chatcmpl-6p9XYPYSTTRi0xEviKjjilqrWU2Ve',
 'object': 'chat.completion',
 'created': 1677649420,
 'model': 'gpt-3.5-turbo',
 'usage': {'prompt_tokens': 56, 'completion_tokens': 31, 'total_tokens': 87},
 'choices': [
   {
    'message': {
      'role': 'assistant',
      'content': 'The 2020 World Series was played in Arlington, Texas at the Globe Life Field, which was the new home stadium for the Texas Rangers.'},
    'finish_reason': 'stop',
    'index': 0
   }
  ]
}
```

在 Python 中，助手的返回可以通过 `response[‘choices’][0][‘message’][‘content’]` 来取值。

每个返回都会包含 `finish_reason`。`finish_reason` 的值有可能是:
- `stop`: API 返回完整的模型输出
- `length`: 因为 `max_tokens` 参数或 token 限制，导致不完整的模型输出
- `content_filter`: 因为我们的内容过滤的标记，删掉了内容
- `null`: API 响应还在进行中或未完成

### **管理 tokens**
语言模型会将文本分块阅读，这些分块被称为记。在英语中，一个 token 可以很短，只有一个字符，也可以很长可以是一个单词（例如， `a` 或 `apple` ）；在一些语言中，一个 token 可以比一个字符还要短，也可以比一个单词还要。

例如，字符串 `“ChatGPT is great！”` 被解成了六个记 `[“Chat”, “G”, “PT”, “ is “ great”, “!”]`。

 API 中调用的 token 数会受以下方面影响：你所用 API 的价格，因为你是按记数付费；API调用时间长度，因为写入更多的记需要更的时间；API调用是否能够正常工作，因为总记数必须于模型的最大限制（例如gpt-3.5-tur-0301限制为4096个记）。

在 API 中调用的 token 数量的多少会产生这些影响： 影响你调用 API 将花费的金额，因为你要为每个 token 买单；影响你调用 API 所花费的时间，因为写更多的内容需要更多时间；影响 API 调用是否能够正常运行，因为 token 总数必须小于模型的最大限制 ( 例如 `gpt-3.5-tur-0301` 的限制为4096个 tokens )

输入和输出的 token 数都会被统计。例如，如果你的 API 在消息中使用了 10 tokens 并且你接收到 20 tokens 的响应输出，你的账单会计入 30 tokens。

要查看 API 调用所使用的 token 数量，可以从响应体中的 `usage` 字段获取 ( 例如，`response[‘usage’][‘total_tokens’]` )。

要在不调用API的情况下，查看文本字符串中有多少 token，请使用OpenAI的 [tiktoken](https://github.com/openai/tiktoken) Python库。可以在 OpenAI 的 Cookbook 的指引 [ 如何使用 tiktoken 计算 token 数 ](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb) 中找到示例代码。

发送给API的每条消息都会消耗 `content` 、 `role` 和其他字段中的 token 数量，以及一些用于隐式格式化的额外 token。这种情况在未来可能会略有改变。

如果一个对话有太多的 token ，无法满足模型的最大限制的话 ( 比如 `gpt-3.5-turbo` 中超过4096个 token)，你必须截断、省略、或以其他方式缩小你的文本，直到它适合模型未知。要注意的是，如果消息从模型的输入中移除的话，模型就无法掌握这些消息的内容了。

还要注意的是，输入太长的会话可能会导致接收的响应不完整。例如，一个 `gpt-3.5-turbo` 模型输入的会话是4090个 token 的话，响应会在6个 token 的时候被截断。

### **给聊天模型进行说明指引**
随着模型的版本变化，给模型进行说明指引的最佳实践也会变化。下面适用于 gpt-3.5-turbo-0301 模型的建议可能不适用于未来的模型。

许多对话都以系统消息 ( system message ) 开始，以隐式地指示助手 ( assistant )。比如这里是一个用来指示 ChatGPT 的系统消息:
```
You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible. Knowledge cutoff: {knowledge_cutoff} Current date: {current_date}
```

一般来说，`gpt-3.5-turbo-0301` 不需要太过于关注系统消息，所以更重要的说明指示消息通常放在用户消息 ( user message ) 中。

如果模型生成的不是你想要的结果，你可以随意迭代并进行潜在的改进，你可以尝试这样处理:
- 让你的说明更详细
- 指明你在答案中想要的格式
- 让模型一步一步地思考，或者在确定答案之前讨论正反两方面

想要获得更多的工程想法，请阅读 OpenAI Cookbook 关于[提高可靠性的技术指南](https://github.com/openai/openai-cookbook/blob/main/techniques_to_improve_reliability.md)。

除了系统消息，`temperature` 和 `max_tokens` 是在[许多配置中](</API参考/会话(Chat).md>)开发者用来影响聊天模型输出的两个。对于 `temperature` ，更高的值比如0.8，会让结果更加随机，而更低的值比如0.2会让结果更加聚焦和明确。对于 `max_tokens` ，如果希望将响应限制在某个长度，则可以将 `max_tokens` 设置为某个值。比如如果你将 `max_tokens` 的值设为5，而输出的值将会被截断并且结果对用户来说是没有意义的。

## **聊天模型 vs 补全模型**
`gpt-3.5-turbo ` 和 `text-davinci-003` 两个模型拥有相似的能力，但前者的价格只是后者的十分之一，在大部分情况下，我们更推荐使用 `gpt-3.5-turbo`。

对于许多开发者来说，转换就像重写和重新测试 `prompt` 一样简单。

例如，假设你使用下面的补全 prompt 来让英语转换成法语:
```
翻译接下来的英文文本为法语: “{text}”
```

一个对应的对话会话是这样的:
```
[
  {“role”: “system”, “content”: “你是一个善于将英语翻译成法语的人工智能助手.”},
  {“role”: “user”, “content”: ‘翻译接下来的英文文本为法语: “{text}”’}
]
```

或者甚至只要用户消息:
```
[
  {“role”: “user”, “content”: ‘翻译接下来的英文文本为法语: “{text}”’}
]
```

## **常见问题**
### **gpt-3.5-turbo 模型支持微调 ( fine-tuning ) 吗?**
不支持。从 2023年3月1日起，你只能对基于 GPT-3.5 的模型进行微调。有关如何使用微调模型的更多细节，请参[阅微调指南](</指引/微调(Fine tuning).md>)

### **你们会把通过 API 获取到的数据进行保存吗?**
从2023年3月1日起，我们会将你通过 API 发送给我们的数据保留30天但不会使用这些数据来提升模型。了解更多关于我们的[数据使用条款](https://platform.openai.com/docs/data-usage-policies)。

### **添加调节层**
如果你想要给聊天 API 的输出添加一个调节层，你可以根据我们的[调节指南](<../指引/调节(moderation).md>)，以避免违反OpenAI使用政策的内容被展示出来。