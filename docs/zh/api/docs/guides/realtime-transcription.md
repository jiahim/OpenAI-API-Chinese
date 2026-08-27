# 实时转录

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

当你的应用需要从麦克风、电话或其他实时音频流中获取文本，且无需语音助手回复时，请使用实时转录。推荐的模型会在语音到达时返回转录增量，并在你的应用提交每个音频轮次时返回最终转录。

从 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe)开始。若音频已录制，请使用 [文件转录](https://developers.openai.com/api/docs/guides/speech-to-text) ，或参阅 [转录概览](https://developers.openai.com/api/docs/guides/transcription) 以比较这两种工作流。

## 创建转录会话

创建一个会话 `type: "transcription"` 并选择 `gpt-live-transcribe`。通过 [WebSocket](https://developers.openai.com/api/docs/guides/realtime-websocket) 连接，用于服务端音频管道，或 [WebRTC](https://developers.openai.com/api/docs/guides/realtime-webrtc) 用于浏览器音频。

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


此示例使用 24 kHz PCM 音频并禁用自动轮次检测，以便你可以显式提交每个轮次。有关完整的会话配置，请参阅 [Realtime 会话参考](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets).

## 流式传输音频

发送音频块，使用 `input_audio_buffer.append`:

```javascript
ws.send(
  JSON.stringify({
    type: "input_audio_buffer.append",
    audio: base64Pcm16,
  })
);
```


关闭自动语音活动检测后，在你想要结束音频轮次时提交缓冲区：

```javascript
ws.send(
  JSON.stringify({
    type: "input_audio_buffer.commit",
  })
);
```


若要由服务器检测并提交轮次边界，请配置 [语音活动检测](https://developers.openai.com/api/docs/guides/realtime-vad) 来代替。

## 处理文本记录事件

监听增量转录增量事件和完成事件：

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

完成事件包含已提交条目的最终转录文本：

```json
{
  "type": "conversation.item.input_audio_transcription.completed",
  "item_id": "item_003",
  "content_index": 0,
  "transcript": "Hello, how are you?"
}
```

不同语音轮次之间的完成事件排序不保证。使用 `item_id` 将转录事件与已提交的输入条目匹配。

## 添加转录上下文

当音频包含专业词汇或多种预期语言时，请添加上下文。发送另一条 `session.update` 事件来在现有会话期间更改转录配置。

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
- 使用 `keywords` 来表示可能出现在音频中的产品名称、缩略词及其他字面术语。
- 使用 `languages` 来表示预期的输入语言。

支持的语言代码格式包括：

- ISO 639-1 代码，例如 `en`, `es`，以及 `fr`.
- 部分 ISO 639-3 代码，例如 `eng`, `spa`, `yue`，以及 `cmn`.
- 区域 `zh` 区域代码，例如 `zh-cn`, `zh-tw`，以及 `zh-hk`.

Realtime API 会拒绝不受支持或格式不正确的语言代码。

关键词是提示，不是必需输出。保持每个关键词占一行，且不要包含 `<`, `>`、回车符或换行符。如果关键词包含这些字符之一或 `prompt` 超过模型的长度限制，Realtime API 会拒绝该会话更新。

`gpt-live-transcribe` 使用 `languages` 而不是单数 `language` 字段。不要同时发送两者。

## 转录已提交的回合

使用 `gpt-transcribe` 仅在您特别需要在已提交的音频轮次之后开始转录，或需要检测语言输出时，才在 Realtime 会话中使用。这种专门的流程需要 WebSocket 连接。

当 `gpt-transcribe` 在 Realtime API 会话中执行输入转录，或在专门的转录会话中运行时，它会自动使用之前转录的轮次作为上下文。

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


追加音频并发送 `input_audio_buffer.commit`。然后，模型可以在最终完成事件之前发出转录增量。其完成事件还包括检测到的语言：

```json
{
  "type": "conversation.item.input_audio_transcription.completed",
  "item_id": "item_003",
  "content_index": 0,
  "transcript": "Bonjour, pouvez-vous m'entendre ?",
  "languages": [{ "code": "fr" }]
}
```

当 `gpt-transcribe` 无法做出可靠的语言预测时， `languages` 是一个空数组。 `gpt-live-transcribe` 不返回检测到的语言预测。

## 调整延迟和准确性

流式转录会在延迟与转录质量之间进行权衡。较低的延迟设置可以更早地产生部分文本。较高的延迟设置会在输出文本前为模型提供更多的音频上下文，并可能改善词错误率。

首先从设置 `audio.input.transcription.delay` 开始，并针对你的真实音频进行测试。有用的起始点包括：

- `minimal` 用于对延迟最敏感的交互；
- `low` 用于低延迟实时字幕；
- `medium` 用于在延迟与准确性之间取得平衡；
- `high` 当准确性比即时显示更重要时；
- `xhigh` 当你的工作流可容忍最大延迟以获取更多上下文时。

确切的延迟毫秒数可能因模型配置而异，因此请使用具有代表性的音频进行基准测试，而不是假设每个层级都有固定的时间。

不要仅凭合成音频选择设置。请使用具有代表性的麦克风、电话音频、口音、背景噪音、语码转换、领域词汇和长时间会话进行测试。

## 处理置信度、时间戳和说话人标签

`gpt-live-transcribe` 不返回词级时间戳、说话人标签或转录置信度分数。如果你的应用需要时间戳或说话人标签，请使用兼容的 [文件转录](https://developers.openai.com/api/docs/guides/speech-to-text) 模型或添加应用级回退。

## 生产环境检查清单

- 在调优前先设定目标延迟和准确率阈值。
- 使用真实生产音频进行测试，而不只是干净样本。
- 测试每种目标语言。
- 在评测集中包含数字、日期、货币、电子邮件地址、产品名和领域术语。
- 除词错误率外，还要单独追踪空白、截断和延迟的转录文本。
- 决定当后续增量修正先前文本时，你的 UI 应如何修订部分文本。
- 使用 `item_id` 对最终转录文本进行排序和对齐。
- 为不支持的时间戳、说话人标签或置信度字段保留后备路径。

## 相关指南

[Realtime 与音频概述



      Compare voice-agent, translation, and transcription sessions.](https://developers.openai.com/api/docs/guides/realtime)

[Realtime 翻译



      Translate live speech with a dedicated translation session.](https://developers.openai.com/api/docs/guides/realtime-translation)

[WebSocket 连接



      Stream raw audio through a server-side media pipeline.](https://developers.openai.com/api/docs/guides/realtime-websocket)

[语音活动检测



      Configure turn detection for live audio streams.](https://developers.openai.com/api/docs/guides/realtime-vad)