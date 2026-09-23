# Realtime transcription

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

当你的应用需要从麦克风、通话或其他实时音频流中获取文本，且不需要语音助手回应时，请使用实时转写。推荐模型会在语音到达时返回转写片段，并在你的应用提交每个音频回合时返回最终转写文本。

从 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe)。开始。使用 [文件转写](https://developers.openai.com/api/docs/guides/speech-to-text) （如果你的音频已经录制好），或者参考 [转写概述](https://developers.openai.com/api/docs/guides/transcription) 以比较各工作流。

## 创建转录会话

使用以下方式创建会话 `type: "transcription"` 并选择 `gpt-live-transcribe`。通过 [WebSocket](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime) 连接，适用于服务端音频管线，或 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) 适用于浏览器音频。

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


本示例使用 24 kHz PCM 音频。在 `gpt-live-transcribe` 转录会话中，省略 `audio.input.turn_detection` 或将其设置为 `null`。该模型不支持 `server_vad` 或 `semantic_vad`。有关完整的会话配置，请参阅 [Realtime 会话参考](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets).

## Stream audio

使用以下方式发送音频数据块 `input_audio_buffer.append`:

```javascript
ws.send(
  JSON.stringify({
    type: "input_audio_buffer.append",
    audio: base64Pcm16,
  })
);
```


发送 `input_audio_buffer.commit` 在每个音频回合结束时，以接收最终转录文本：

```javascript
ws.send(
  JSON.stringify({
    type: "input_audio_buffer.commit",
  })
);
```


使用客户端 VAD 检测语音结束，然后发送 `input_audio_buffer.commit`.

## 处理转录事件

监听增量转写 delta 事件和完成事件：

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


delta 事件包含新到达的转写文本：

```json
{
  "type": "conversation.item.input_audio_transcription.delta",
  "item_id": "item_003",
  "content_index": 0,
  "delta": "Hello,"
}
```

完成事件包含已提交条目的最终转写文本：

```json
{
  "type": "conversation.item.input_audio_transcription.completed",
  "item_id": "item_003",
  "content_index": 0,
  "transcript": "Hello, how are you?"
}
```

不同语音轮次之间的完成事件顺序无法保证。可以使用 `item_id` 将转写事件匹配到已提交的输入条目。

## 添加转录上下文

当音频中包含专业词汇或出现超过一种预期语言时，请添加上下文。发送另一个 `session.update` 事件，以在现有会话中更改转录配置。

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


- 使用 `prompt` 来描述录音或其设置。
- 使用 `keywords` 用于产品名称、缩写以及其他可能出现在音频中的字面术语。
- 使用 `languages` 用于预期的输入语言。

支持的语言代码格式包括：

- ISO 639-1 代码，例如 `en`, `es`，以及 `fr`.
- 选定的 ISO 639-3 代码，例如 `eng`, `spa`, `yue`，以及 `cmn`.
- 区域 `zh` 语言环境代码，例如 `zh-cn`, `zh-tw`，以及 `zh-hk`.

Realtime API 会拒绝不受支持或格式错误的语言代码。

关键词是提示，并非必需的输出。每个关键词单独成一行，且不要包含 `<`, `>`、回车符或换行符。如果某个关键词包含这些字符，Realtime API 会拒绝该会话更新，或者 `prompt` 超出模型的长度限制。

`gpt-live-transcribe` 使用 `languages` 字段而非单数形式的 `language` 字段。不要同时发送两者。

## 转写已提交的轮次

使用 `gpt-transcribe` 仅在需要转录在已提交的音频回合之后才开始，或需要输出检测到的语言时，才在实时会话中使用工作流。这种专门的用法需要 WebSocket 连接。

当 `gpt-transcribe` 在 Realtime API 会话中执行输入转录，或在专用的转录会话中运行时，它会自动将较早转录的回合用作上下文。

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


追加音频并发送 `input_audio_buffer.commit`。然后模型可以在最终完成事件之前发出转录增量。它的完成事件还包含检测到的语言：

```json
{
  "type": "conversation.item.input_audio_transcription.completed",
  "item_id": "item_003",
  "content_index": 0,
  "transcript": "Bonjour, pouvez-vous m'entendre ?",
  "languages": [{ "code": "fr" }]
}
```

当 `gpt-transcribe` 无法做出可靠的语言预测时， `languages` 为空数组。 `gpt-live-transcribe` 不返回检测到的语言预测。

## 调节延迟与准确率

流式转录以延迟换取转录质量。较低的延迟设置会产生更早的局部文本。较高的延迟设置会让模型在输出文本前获得更多音频上下文，从而可以降低词错误率。

首先设置 `audio.input.transcription.delay` 并针对你的真实音频进行测试。有用的起始点包括：

- `minimal` 用于对延迟最敏感的交互场景；
- `low` 用于低延迟实时字幕；
- `medium` 用于在延迟与准确率之间取得平衡；
- `high` 当准确率比即时显示更重要时；
- `xhigh` 当你的工作流可以容忍较大延迟以换取更多上下文时。

毫秒级的具体延迟会因模型配置而异，因此请使用具有代表性的音频进行基准测试，而不是假设每个级别都有固定的时序。

不要仅凭合成音频就选择某个设置。请使用具有代表性的麦克风、电话音频、口音、背景噪声、语码切换、领域词汇以及长会话进行测试。

## 处理置信度、时间戳和说话人标签

`gpt-live-transcribe` 不会返回词级时间戳、说话人标签或转录置信度分数。如果你的应用需要时间戳或说话人标签，请使用兼容的 [文件转写](https://developers.openai.com/api/docs/guides/speech-to-text) 模型或在应用层添加回退方案。

## 上线检查清单

- 在调参之前，先确定目标延迟和准确率阈值。
- 使用真实的生产音频进行测试，而不仅仅是干净的样本。
- 测试每种目标语言。
- 在评估集中加入数字、日期、货币、电子邮件地址、产品名称和领域术语。
- 将空转写、截断转写和延迟转写与词错误率分开追踪。
- 决定当后续增量修正早期文本时，你的 UI 应如何更新部分文本。
- 使用 `item_id` 用于排序和对齐最终转写文本。
- 为不支持的时间戳、说话人标签或置信度字段保留一条备用路径。

## 相关指南

[实时与音频概览



      Compare voice-agent, translation, and transcription sessions.](https://developers.openai.com/api/docs/guides/realtime)

[实时翻译



      Translate live speech with a dedicated translation session.](https://developers.openai.com/api/docs/guides/realtime-translation)

[WebSocket 连接



      Stream raw audio through a server-side media pipeline.](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime)

[语音活动检测



      Configure turn detection for live audio streams.](https://developers.openai.com/api/docs/guides/realtime-vad)