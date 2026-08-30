# 实时转写

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取文档页面的 Markdown 版本。

当你的应用需要从麦克风、通话或其他实时音频流中获取文本，且不需要语音助手回复时，可使用实时转写。推荐模型会在语音到达时返回转写增量，并在你的应用提交每个音频回合时返回最终转写。

从 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe)。开始。使用 [文件转写](https://developers.openai.com/api/docs/guides/speech-to-text) ，适用于音频已录制的场景，或参阅 [转写概述](https://developers.openai.com/api/docs/guides/transcription) 以比较不同工作流。

## 创建转录会话

创建一个会话，选择 `type: "transcription"` 并选择 `gpt-live-transcribe`。通过 [WebSocket](https://developers.openai.com/api/docs/guides/realtime-websocket) 用于 服务端 音频流水线，或使用 [WebRTC](https://developers.openai.com/api/docs/guides/realtime-webrtc) 用于浏览器音频。

```json
{
  "type": "session.update",
  "session": {
    "type": "transcription",
    "audio": {
      "input": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "transcription": {
          "model": "gpt-live-transcribe"
        },
        "turn_detection": null
      }
    }
  }
}
```


本示例使用 24 kHz PCM 音频，并禁用自动轮次检测，以便你可以显式提交每个轮次。完整的会话配置请参阅 [Realtime 会话参考](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets).

## 流式音频

发送音频块，请使用 `input_audio_buffer.append`:

```javascript
ws.send(
  JSON.stringify({
    type: "input_audio_buffer.append",
    audio: base64Pcm16,
  })
);
```


关闭自动轮次检测后，在你想结束一段音频轮次时提交缓冲区：

```javascript
ws.send(
  JSON.stringify({
    type: "input_audio_buffer.commit",
  })
);
```


若希望由服务端检测并提交轮次边界，请配置 [语音活动检测](https://developers.openai.com/api/docs/guides/realtime-vad) 。

## 处理转录事件

监听增量转录文本片段事件和完成事件：

```javascript
ws.on("message", (data) => {
  const event = JSON.parse(data);

  if (event.type === "conversation.item.input_audio_transcription.delta") {
    process.stdout.write(event.delta);
  }

  if (event.type === "conversation.item.input_audio_transcription.completed") {
    console.log("\nFinal transcript:", event.transcript);
  }
});
```


增量事件包含新可用的转录文本：

```json
{
  "type": "conversation.item.input_audio_transcription.delta",
  "item_id": "item_003",
  "content_index": 0,
  "delta": "Hello,"
}
```

完成事件包含该已提交条目的最终转录内容：

```json
{
  "type": "conversation.item.input_audio_transcription.completed",
  "item_id": "item_003",
  "content_index": 0,
  "transcript": "Hello, how are you?"
}
```

不同对话轮次之间完成事件的顺序无法保证。可使用 `item_id` 将转录事件与已提交的输入条目进行匹配。

## 添加转写上下文

当音频包含专业词汇或包含多种预期语言时，添加上下文信息。在现有会话期间发送另一个 `session.update` 事件以更改转写配置。

```json
{
  "type": "session.update",
  "session": {
    "type": "transcription",
    "audio": {
      "input": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "transcription": {
          "model": "gpt-live-transcribe",
          "prompt": "A customer support call about a premium plan and account AC-42.",
          "keywords": ["premium plan", "AC-42", "billing"],
          "languages": ["en", "fr"],
          "delay": "low"
        },
        "turn_detection": null
      }
    }
  }
}
```


- 使用 `prompt` 来描述录音或其场景。
- 使用 `keywords` 用于产品名称、缩写以及其他可能出现在音频中的字面术语。
- 使用 `languages` 用于指定预期的输入语言。

支持的语言代码格式包括：

- ISO 639-1 代码，例如 `en`, `es`，以及 `fr`.
- 选定的 ISO 639-3 代码，例如 `eng`, `spa`, `yue`，以及 `cmn`.
- 地区 `zh` 区域代码，例如 `zh-cn`, `zh-tw`，以及 `zh-hk`.

Realtime API 会拒绝不支持或格式不正确的语言代码。

关键词只是提示，并非必需的输出。每个关键词单独成一行，且不要包含 `<`, `>`、回车符或换行符。如果关键词中包含这些字符，Realtime API 会拒绝该会话更新，或者关键词 `prompt` 超出模型的长度限制。

`gpt-live-transcribe` 使用 `languages` 而不是单数形式的 `language` 字段。不要同时发送两者。

## 转写已提交的轮次

仅在 `gpt-transcribe` 实时会话中专门需要在已提交的音频轮次之后开始转录，或需要输出检测到的语言时才使用。这一专门的工作流需要 WebSocket 连接。

当 `gpt-transcribe` 在实时 API 会话中进行输入转录，或在专用转录会话中运行时，会自动使用先前已转录的轮次作为上下文。

```json
{
  "type": "session.update",
  "session": {
    "type": "transcription",
    "audio": {
      "input": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "transcription": {
          "model": "gpt-transcribe"
        },
        "turn_detection": null
      }
    }
  }
}
```


追加音频并发送 `input_audio_buffer.commit`。模型即可在最终完成事件之前发出转录增量。其完成事件还包含检测到的语言：

```json
{
  "type": "conversation.item.input_audio_transcription.completed",
  "item_id": "item_003",
  "content_index": 0,
  "transcript": "Bonjour, pouvez-vous m'entendre ?",
  "languages": [{ "code": "fr" }]
}
```

当 `gpt-transcribe` 无法可靠地预测语言， `languages` 为空数组。 `gpt-live-transcribe` 不返回检测到的语言预测。

## 调节延迟与准确度

流式转录会在延迟与转录质量之间进行权衡。较低的延迟设置可以产生更早的局部文本。较高的延迟设置会让模型在输出文本前获得更多音频上下文，从而可能降低词错误率。

首先设置 `audio.input.transcription.delay` 并基于你的真实音频进行测试。推荐的起始值如下：

- `minimal` 适用于对延迟最敏感的交互；
- `low` 适用于低延迟实时字幕；
- `medium` 适用于延迟与准确性的平衡取舍；
- `high` 当准确性比即时显示更重要时；
- `xhigh` 当你的工作流可以容忍最大延迟以换取更多上下文时。

实际的毫秒级延迟会因模型配置而异，因此请使用有代表性的音频进行基准测试，而不是为每个等级假定一个固定的时序。

不要仅凭合成音频来选择设置。请使用有代表性的麦克风、电话音频、口音、背景噪声、语码转换、领域词汇以及长时间会话进行测试。

## 处理置信度、时间戳和说话人标签

`gpt-live-transcribe` 不会返回词级时间戳、说话人标签或转录置信度分数。如果你的应用需要时间戳或说话人标签，请使用兼容的 [文件转写](https://developers.openai.com/api/docs/guides/speech-to-text) 模型，或添加应用级回退方案。

## 生产检查清单

- 在调优之前，先选定目标延迟和准确率阈值。
- 使用真实生产环境中的音频进行测试，而不仅仅使用干净的样本。
- 对每个目标语言都进行测试。
- 在你的评估集中包含数字、日期、货币、电子邮件地址、产品名称和领域术语。
- 将空转录、被截断的转录和延迟到达的转录与词错误率分开跟踪。
- 决定当后续的增量更正早期文本时，你的 UI 应该如何修正部分文本。
- 使用 `item_id` 用于对最终转录进行排序和对齐。
- 为不支持的时间戳、说话人标签或置信度字段保留一条回退路径。

## 相关指南

[实时与音频概述



      Compare voice-agent, translation, and transcription sessions.](https://developers.openai.com/api/docs/guides/realtime)

[实时翻译



      Translate live speech with a dedicated translation session.](https://developers.openai.com/api/docs/guides/realtime-translation)

[WebSocket 连接



      Stream raw audio through a server-side media pipeline.](https://developers.openai.com/api/docs/guides/realtime-websocket)

[语音活动检测



      Configure turn detection for live audio streams.](https://developers.openai.com/api/docs/guides/realtime-vad)