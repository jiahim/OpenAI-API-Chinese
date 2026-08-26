# 转录

> 关于完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

转录将语音转换为文本。根据你的音频是已录制还是实时到达来选择工作流。每个工作流都有一个推荐的起始模型。

## 选择转录工作流

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

流式输出和实时音频是独立的决策。你可以在不打开 Realtime 会话的情况下，流式传输已完成文件的转录。仅当音频实时到达或需要持久连接时，才使用 Realtime。

## 选择一项专门能力

从适合你工作流的推荐模型开始。只有当你的应用需要默认模型不具备的能力时，才切换模型。

| 如果你需要                                       | 使用                                                                                                                  |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| 带说话人标记的转录文本                       | `gpt-4o-transcribe-diarize` 与 [文件转录](https://developers.openai.com/api/docs/guides/speech-to-text#speaker-diarization).          |
| 词级时间戳或 `srt` 和 `vtt` 字幕      | `whisper-1` 与 [文件转录](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps).                                   |
| 将完整录音翻译成英文 | `whisper-1` 使用 [音频翻译端点](https://developers.openai.com/api/docs/guides/speech-to-text#translations).                    |
| 检测到的输入语言                          | `gpt-transcribe` 通过 [文件转录](https://developers.openai.com/api/docs/guides/speech-to-text).                                         |
| 通过 WebSocket 进行已提交轮次的转录       | `gpt-transcribe` 结合 [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription#transcribe-a-committed-turn). |

现有集成可以继续使用 [`gpt-4o-transcribe`](https://developers.openai.com/api/docs/models/gpt-4o-transcribe), [`gpt-4o-mini-transcribe`](https://developers.openai.com/api/docs/models/gpt-4o-mini-transcribe)，或 [`gpt-realtime-whisper`](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) （如果支持的话）。这些并不是新的转录集成推荐的起始模型。

参见 [转录定价](https://developers.openai.com/api/docs/pricing#transcription-and-speech) ，并在迁移生产流量之前，使用代表性音频测试推荐路径。

## 提高转录质量

`gpt-transcribe` 以及 `gpt-live-transcribe` 接受三种上下文：

- `prompt`：关于录音的自由格式上下文，例如其主题或场景。
- `keywords`：音频中可能出现的字面术语，如产品名称、药物或首字母缩写词。
- `languages`：当录音可能包含多种语言时，预期的输入语言列表。

仅将这些输入用于与音频相关的上下文；不要复述转录任务。关键词是提示，不是要求的输出。只有在音频包含关键词时，转录才应包含它。

这些模型使用 `languages` 而不是单一的 `language` 字段。现有接受单一语言提示的转录模型继续使用 `language`.

当 `gpt-transcribe` 在 Realtime API 会话中执行输入转录或运行在专用转录会话中时，它会自动使用之前转录的轮次作为上下文。

## 使用代表性音频进行测试

在应用程序将遇到的音频条件下测试转录。包括：

- 目标语言、口音和语码转换模式。
- 背景噪音、麦克风质量和电话音频。
- 姓名、数字、日期、字母数字字符串和领域术语。
- 短语音、长录音和中断的语音。

追踪对应用程序重要的错误，而不是仅依赖词错误率。例如，在医疗保健工作流中测试药物名称，或在支持工作流中测试订单号。

## 后续步骤

- [文件转录](https://developers.openai.com/api/docs/guides/speech-to-text).
- [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription).