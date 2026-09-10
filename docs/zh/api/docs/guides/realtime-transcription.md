# Realtime 转写

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取文档页面的 Markdown 版本。

当你的应用需要从麦克风、通话或其他实时音频流中获取文本，并且不需要语音助手回复时，可使用实时转写。推荐模型会在语音到达时返回转写片段，并在每次提交音频轮次时返回最终转写文本。

从 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe)。使用 [文件转写](https://developers.openai.com/api/docs/guides/speech-to-text) （如果你的音频已经录制完成），或参阅 [转写概述](https://developers.openai.com/api/docs/guides/transcription) 以比较各个工作流。

## 创建一个转写会话

创建一个会话，选择 `type: "transcription"` 并选择 `gpt-live-transcribe`。通过 [WebSocket](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime) 用于 服务端 音频管线，或 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) 用于浏览器音频。

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


此示例使用 24 kHz PCM 音频，并关闭自动轮次检测，以便你可以显式提交每一轮。完整的会话配置请参见 [Realtime 会话参考](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets).

## 流式音频

发送音频分块，可使用 `input_audio_buffer.append`:

```javascript
ws.send(
  JSON.stringify({
    type: "input_audio_buffer.append",
    audio: base64Pcm16,
  })
);
```


如果关闭了自动轮次检测，请在想要结束一个音频轮次时提交缓冲区：

```javascript
ws.send(
  JSON.stringify({
    type: "input_audio_buffer.commit",
  })
);
```


若要让服务端检测并提交轮次边界，请改用 [语音活动检测](https://developers.openai.com/api/docs/guides/realtime-vad) 。

## 处理转录事件

监听增量转写内容和完成事件：

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


增量事件包含新近可用的转写文本：

```json
{
  "type": "conversation.item.input_audio_transcription.delta",
  "item_id": "item_003",
  "content_index": 0,
  "delta": "Hello,"
}
```

完成事件包含已提交项目的最终转写：

```json
{
  "type": "conversation.item.input_audio_transcription.completed",
  "item_id": "item_003",
  "content_index": 0,
  "transcript": "Hello, how are you?"
}
```

不同语音轮次之间完成事件的顺序不作保证。请使用 `item_id` 将转写事件与已提交的输入项目进行匹配。

## 添加转录上下文

当音频包含专业词汇或包含多种预期语言时添加上下文。在现有会话期间发送另一个 `session.update` 事件以更改转录配置。

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
- 使用 `keywords` 用于可能出现在音频中的产品名称、缩写以及其他字面术语。
- 使用 `languages` 用于预期的输入语言。

支持的语言代码格式包括：

- ISO 639-1 代码，例如 `en`, `es`，以及 `fr`.
- 精选的 ISO 639-3 代码，例如 `eng`, `spa`, `yue`，以及 `cmn`.
- 区域 `zh` 区域设置代码，例如 `zh-cn`, `zh-tw`，以及 `zh-hk`.

Realtime API 会拒绝不支持或格式错误的语言代码。

关键词只是提示，并非必需的输出。每个关键词占一行，且不要包含 `<`, `>`、回车符或换行符。如果关键词包含这些字符中的任何一个，Realtime API 会拒绝该会话更新，或者 `prompt` 超过了模型的长度限制。

`gpt-live-transcribe` 使用 `languages` 而不是单数的 `language` 字段。请勿同时发送两者。

## 转写已提交的轮次

仅当 `gpt-transcribe` 在 Realtime 会话中使用，并且你明确需要转录在已提交的音频轮次之后才开始，或需要输出检测到的语言时，才使用此功能。这种专用 工作流需要 WebSocket 连接。

当 `gpt-transcribe` 在 Realtime API 会话中执行输入转录，或在专用转录会话中运行时，会自动使用先前已转录的轮次作为上下文。

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


追加音频并发送 `input_audio_buffer.commit`. 模型随后可以在最终完成事件之前发出转录片段增量。其完成事件还包含检测到的语言：

```json
{
  "type": "conversation.item.input_audio_transcription.completed",
  "item_id": "item_003",
  "content_index": 0,
  "transcript": "Bonjour, pouvez-vous m'entendre ?",
  "languages": [{ "code": "fr" }]
}
```

当 `gpt-transcribe` 无法做出可靠的语言预测， `languages` 将是一个空数组。 `gpt-live-transcribe` 不会返回检测到的语言预测。

## 调整延迟与准确率

流式转录在延迟和转录质量之间进行权衡。较低的延迟设置可以更快产出部分文本。较高的延迟设置让模型在输出文本前获得更多音频上下文，从而可能改善词错误率。

首先设置 `audio.input.transcription.delay` 并针对你的实际音频进行测试。可参考以下起点值：

- `minimal` 用于对延迟最敏感的交互；
- `low` 用于低延迟的实时字幕；
- `medium` 用于在延迟和准确率之间取得平衡；
- `high` 当准确率比即时显示更重要时；
- `xhigh` 当你的工作流能够容忍更多延迟以换取更多上下文时。

实际的毫秒级延迟会因模型配置而异，因此应使用具有代表性的音频进行基准测试，而不是假设每个等级具有固定的时序。

不要仅根据合成音频来选择设置。应使用具有代表性的麦克风、电话音频、口音、背景噪声、语码转换、领域词汇以及长会话进行测试。

## 处理置信度、时间戳和说话人标签

`gpt-live-transcribe` 不返回词级时间戳、说话人标签或转录置信度分数。如果你的应用需要时间戳或说话人标签，请使用兼容的 [文件转写](https://developers.openai.com/api/docs/guides/speech-to-text) 模型或在应用层添加回退方案。

## 生产环境清单

- 在调优之前，先选定目标延迟和准确率阈值。
- 使用真实生产环境中的音频进行测试，而不仅仅是干净的样本。
- 测试每个目标语言。
- 在评估集中加入数字、日期、货币、电子邮件地址、产品名和领域术语。
- 将空、截断和延迟的转录与词错误率分开跟踪。
- 决定当后续增量更正早期文本时，你的 UI 应如何修订部分文本。
- 使用 `item_id` 用于排序和对齐最终转录。
- 为不支持的时间戳、说话人标签或置信度字段保留一条回退路径。

## 相关指南

[实时与音频概述



      Compare voice-agent, translation, and transcription sessions.](https://developers.openai.com/api/docs/guides/realtime)

[实时翻译



      Translate live speech with a dedicated translation session.](https://developers.openai.com/api/docs/guides/realtime-translation)

[WebSocket 连接



      Stream raw audio through a server-side media pipeline.](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime)

[语音活动检测



      Configure turn detection for live audio streams.](https://developers.openai.com/api/docs/guides/realtime-vad)