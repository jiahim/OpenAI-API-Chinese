# 转录

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

转录将语音转换为文字。根据你的音频是已经录制好的还是实时传入的，选择相应的工作流。每个工作流都有一个推荐的起始模型。

## 选择转写工作流

<table>
  <thead>
    <tr>
      <th>Workflow</th>
      <th>Use when</th>
      <th>Recommended model</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        [File transcription](https://developers.openai.com/api/docs/guides/speech-to-text)
      </td>
      <td>
        You have a completed recording or a bounded audio request. Upload the
        file and receive a final transcript, or stream text while the file is
        processed.
      </td>
      <td>
        [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)
      </td>
    </tr>
    <tr>
      <td>
        [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription)
      </td>
      <td>
        You have a microphone, call, or other live audio stream and need text as
        speech arrives.
      </td>
      <td>
        [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe)
      </td>
    </tr>
  </tbody>
</table>

流式输出和实时音频是相互独立的决定。你可以流式转写已完成的文件，而无需开启 Realtime 会话。仅当你的音频是实时到达或你需要持久连接时，才使用 Realtime。

## 选择专业能力

从适用于你的工作流的推荐模型开始。仅当你的应用需要默认模型未提供的能力时，才更换模型。

| 如果你需要                                       | 使用                                                                                                                  |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 带说话人标签的转录文本                       | `gpt-4o-transcribe-diarize` 通过 [文件转录](https://developers.openai.com/api/docs/guides/speech-to-text#speaker-diarization).          |
| 词级时间戳或 `srt` 和 `vtt` 字幕      | `whisper-1` 通过 [文件转录](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps).                                   |
| 将已完成的录音翻译成英文 | `whisper-1` 使用 [音频翻译接口](https://developers.openai.com/api/docs/guides/speech-to-text#translations).                    |
| 检测到的输入语言                          | `gpt-transcribe` 通过 [文件转录](https://developers.openai.com/api/docs/guides/speech-to-text).                                         |
| 通过 WebSocket 进行已提交回合的转录       | `gpt-transcribe` 通过 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription#transcribe-a-committed-turn). |

现有集成可继续使用 [`gpt-4o-transcribe`](https://developers.openai.com/api/docs/models/gpt-4o-transcribe), [`gpt-4o-mini-transcribe`](https://developers.openai.com/api/docs/models/gpt-4o-mini-transcribe)，或 [`gpt-realtime-whisper`](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) 在受支持的情况下。这些不是新转写集成推荐的起始模型。

请参阅 [转写定价](https://developers.openai.com/api/docs/pricing#transcription-and-speech) 并在使用代表性音频测试推荐路径后，再将生产流量迁移过去。

## 提升转录质量

`gpt-transcribe` 和 `gpt-live-transcribe` 接受三种上下文：

- `prompt`：关于录制的自由形式上下文，例如其主题或场景。
- `keywords`：音频中可能出现的字面术语，例如产品名称、药物或缩写。
- `languages`：当录制内容可能包含多种语言时，预期输入语言的列表。

仅将这些输入用于与音频相关的上下文；不要复述转写任务。关键词只是提示，并非必须输出的内容。转写文本应仅在音频中确实包含某个关键词时才将其纳入。

这些模型使用 `languages` 字段，而不是单数形式的 `language` 字段。接受单一语言提示的现有转写模型将继续使用 `language`.

当 `gpt-transcribe` 在 Realtime API 会话中执行输入转写，或在专用转写会话中运行时，会自动将先前已转写的轮次用作上下文。

## 使用有代表性的音频进行测试

在你的应用将遇到的音频条件下测试转录。需包括：

- 目标语言、口音以及语码转换模式。
- 背景噪声、麦克风质量以及电话音频。
- 名称、数字、日期、字母数字字符串以及领域术语。
- 短语音、长录音以及被中断的语音。

追踪对应用真正重要的错误，而不是仅依赖词错误率。例如，在医疗工作流中测试药品名称，或在支持工作流中测试订单号。

## Next steps

- [文件转录](https://developers.openai.com/api/docs/guides/speech-to-text).
- [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription).