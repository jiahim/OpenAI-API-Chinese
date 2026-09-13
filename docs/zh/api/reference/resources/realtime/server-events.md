# Realtime server events

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 来获取。

这些事件是从 OpenAI Realtime WebSocket 服务器发送到客户端的事件。

<a id="error"></a>

## error

在发生错误时返回，错误可能是客户端问题或服务端
问题。大多数错误都是可恢复的，会话将保持打开状态，我们
建议实现者默认监控并记录错误消息。

### Schema

Schema name： `RealtimeServerEventError`

- `error: RealtimeError`

  错误的详细信息。

  - `message: string`

    人类可读的报错信息。

  - `type: string`

    错误的类型（例如 "invalid_request_error"、"server_error"）。

  - `code: optional string or null`

    错误代码（如果有）。

  - `event_id: optional string or null`

    导致该错误的客户端事件的 event_id（如果适用）。

  - `param: optional string or null`

    与错误相关的参数（如果有）。

- `event_id: string`

  服务器事件的唯一 ID。

- `type: "error"`

  事件类型，必须为 `error`.

  - `"error"`

### 示例

```json
{
    "event_id": "event_890",
    "type": "error",
    "error": {
        "type": "invalid_request_error",
        "code": "invalid_event",
        "message": "The 'type' field is missing.",
        "param": null,
        "event_id": "event_567"
    }
}
```

<a id="session.created"></a>

## session.created

在创建 Session 时返回。新连接建立时自动发送，作为第一个服务端事件。
该事件将包含默认的 Session 配置。
默认的 Session 配置。

### Schema

Schema name： `RealtimeServerEventSessionCreated`

- `event_id: string`

  服务器事件的唯一 ID。

- `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

  会话配置。

  - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

    Realtime 会话配置对象。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `object: "realtime.session"`

      对象类型。始终为 `realtime.session`.

      - `"realtime.session"`

    - `type: "realtime"`

      要创建的会话类型。始终为 `realtime` ，用于 Realtime API。

      - `"realtime"`

    - `audio: optional object { input, output }`

      输入和输出音频的配置。

      - `input: optional object { format, noise_reduction, transcription, turn_detection }`

        - `format: optional RealtimeAudioFormats`

          输入音频的格式。

          - `PCMAudio object { rate, type }`

            PCM 音频格式。仅支持 24kHz 采样率。

            - `rate: optional 24000`

              音频的采样率。始终为 `24000`.

              - `24000`

            - `type: optional "audio/pcm"`

              音频格式。始终为 `audio/pcm`.

              - `"audio/pcm"`

          - `PCMUAudio object { type }`

            G.711 μ-law 格式。

            - `type: optional "audio/pcmu"`

              音频格式。始终为 `audio/pcmu`.

              - `"audio/pcmu"`

          - `PCMAAudio object { type }`

            G.711 A-law 格式。

            - `type: optional "audio/pcma"`

              音频格式。始终为 `audio/pcma`.

              - `"audio/pcma"`

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。可以将其设置为 `null` 以关闭。
          降噪会在输入音频发送到 VAD 和模型之前，过滤添加到输入音频缓冲区中的音频。
          对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报），并改善模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { language, languages, model, prompt }`

          输入音频转写配置，默认关闭，可以设置为 `null` 以在开启后关闭。由于模型直接消费音频，因此输入音频转写并非模型原生功能。转写通过 [/audio/transcriptions 端点](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步执行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写所用的语言和提示词，这些可向转写服务提供额外指引。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转写配置的输入音频可选语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前可选模型包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转写的模型。当前可选模型包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            在提供时，为输入音频转写配置的提示词。

        - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

          轮次检测配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于这一概率动态设置超时。例如，如果用户音频以 “uhhm” 收尾，模型将给出较低的轮次结束概率，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话，轮次检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              turn 检测的类型， `server_vad` 用于开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已经在响应时可能会导致创建响应失败。

              如果同时将 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过该时间后将自动触发一次模型响应。这在
              用户出现长时间停顿属于异常情况的场景下很有用，例如电话
              通话。模型将根据当前上下文有效地提示用户继续对话。
              当前上下文。

              该超时值将在最后一次模型响应的音频播放完毕之后开始计时，
              也就是说，它被设置为该 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的事件
              ）将在达到超时时间时触发。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当发生 VAD start 事件时，是否自动中断（取消）任何正在进行的、向默认
              会话输出内容的响应（即。 `conversation` 基于 `auto`)。如果 `true` 为 true，则响应将被取消；否则响应将一直继续直到完成。

              如果同时将 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。包含在 VAD 检测到的语音之前的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认为
              to 500ms. With shorter values the model will respond more quickly,
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` mode. Activation threshold for VAD (0.0 to 1.0), this defaults to 0.5. A
              higher threshold will require louder audio to activate the model, and
              因此在嘈杂环境下表现可能更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              turn 检测的类型， `semantic_vad` to turn on Semantic VAD.

              - `"semantic_vad"`

            - `create_response: optional boolean`

              Whether or not to automatically generate a response when a VAD stop event occurs.

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` mode. The eagerness of the model to respond. `low` will wait longer for the user to continue speaking, `high` 响应速度更快。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当检测到 VAD 开始事件时，是否自动中断任何正在进行的响应并输出到默认
              会话输出内容的响应（即。 `conversation` 基于 `auto`)当检测到 VAD 开始事件时。

      - `output: optional object { format, speed, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音回复的速度，为原始速度的倍数。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中更改。

          此参数是对生成后音频的后处理调整，
          也可以提示模型讲得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的声音。一旦模型至少回复过一次音频，
          会话中就无法再更改声音。当前
          可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。一旦模型至少回复过一次音频，
            会话中就无法再更改声音。当前
            可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `"alloy"`

            - `"ash"`

            - `"ballad"`

            - `"coral"`

            - `"echo"`

            - `"sage"`

            - `"shimmer"`

            - `"verse"`

            - `"marin"`

            - `"cedar"`

    - `expires_at: optional number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      包含在服务端输出中的其他字段。

      `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      在模型调用之前添加的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的回复。可以指示模型回复的内容和格式（例如 "be extremely succinct"、"act friendly"、"here are examples of good responses"）以及音频行为（例如 "talk quickly"、"inject emotion into your voice"、"laugh frequently"）。模型不保证遵循这些指令，但它们为模型提供了所需行为的指导。

      注意，服务端会设置默认指令，如果未设置该字段，则会使用这些默认指令，并可在 `session.created` 会话开始时的事件中查看。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包含工具调用。可传入 1 到 4096 之间的整数来
      限制输出 token，或传入 `inf` 以使用指定模型支持的最大
      token 数。默认值为 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      此会话使用的 Realtime 模型。

      - `string`

      - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        此会话使用的 Realtime 模型。

        - `"gpt-realtime"`

        - `"gpt-realtime-1.5"`

        - `"gpt-realtime-2"`

        - `"gpt-realtime-2.1"`

        - `"gpt-realtime-2.1-mini"`

        - `"gpt-realtime-2025-08-28"`

        - `"gpt-4o-realtime-preview"`

        - `"gpt-4o-realtime-preview-2024-10-01"`

        - `"gpt-4o-realtime-preview-2024-12-17"`

        - `"gpt-4o-realtime-preview-2025-06-03"`

        - `"gpt-4o-mini-realtime-preview"`

        - `"gpt-4o-mini-realtime-preview-2024-12-17"`

        - `"gpt-realtime-mini"`

        - `"gpt-realtime-mini-2025-10-06"`

        - `"gpt-realtime-mini-2025-12-15"`

        - `"gpt-audio-1.5"`

        - `"gpt-audio-mini"`

        - `"gpt-audio-mini-2025-10-06"`

        - `"gpt-audio-mini-2025-12-15"`

    - `output_modalities: optional array of "text" or "audio"`

      模型可用于响应的模态集合。默认值为 `["audio"]`，表示
      模型将以音频加文字转录的方式响应。 `["text"]` 可用于让
      模型仅以文本进行响应。无法同时请求 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解详情](https://developers.openai.com/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的映射，用于替换提示中变量的
        值。替换值可以是字符串，也可以是其他
        Response 输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          模型的图像输入。了解 [图像输入](https://developers.openai.com/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            要发送给模型的文件的 ID。

          - `image_url: optional string or null`

            要发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            要发送给模型的文件内容。

          - `file_id: optional string or null`

            要发送给模型的文件的 ID。

          - `file_url: optional string`

            要发送给模型的文件的 URL。

          - `filename: optional string`

            要发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示词模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      用于具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制具备推理能力的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型选择工具的方式。可提供字符串模式之一，或强制使用指定的
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（如果有）。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息与调用一个或
        更多工具。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项强制模型调用特定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项强制模型调用远程 MCP 服务器上的特定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具名称。

    - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何调用的指导
          ，以及调用时应当向用户说明的内容
          （如有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          函数的参数，采用 JSON Schema 格式。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol（MCP）服务器为模型提供额外的工具
        （访问能力。 [了解更多关于 MCP 的信息](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中识别它。

        - `type: "mcp"`

          MCP 工具的类型。总是为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

          允许的工具名称列表或过滤器对象。

          - `McpAllowedTools = array of string`

            允许的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的过滤器对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据，或是只读的。如果 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可以与
          自定义 MCP 服务器 URL 或服务连接器配合使用。你的应用
          必须处理 OAuth 授权流程并在此提供该令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的那些。必须提供其中
          `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
          关于服务连接器 [此处](https://developers.openai.com/api/docs/guides/tools-connectors-mcp#connectors).

          目前支持的 `connector_id` 值包括：

          - Dropbox: `connector_dropbox`
          - Gmail: `connector_gmail`
          - Google Calendar: `connector_googlecalendar`
          - Google Drive: `connector_googledrive`
          - Microsoft Teams: `connector_microsoftteams`
          - Outlook Calendar: `connector_outlookcalendar`
          - Outlook Email: `connector_outlookemail`
          - SharePoint: `connector_sharepoint`

          - `"connector_dropbox"`

          - `"connector_gmail"`

          - `"connector_googlecalendar"`

          - `"connector_googledrive"`

          - `"connector_microsoftteams"`

          - `"connector_outlookcalendar"`

          - `"connector_outlookemail"`

          - `"connector_sharepoint"`

        - `defer_loading: optional boolean`

          此 MCP 工具是否被延迟，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中需要审批的工具。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中需要审批的工具。可以是
            `always`, `never`，或是与需要审批的工具关联的筛选对象
            。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据，或是只读的。如果 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据，或是只读的。如果 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值为 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
          `tunnel_id` 。

        - `tunnel_id: optional string`

          用于代替直接服务器 URL 的安全 MCP 隧道 ID。需提供以下之一：
          `server_url`, `connector_id`，或 `tunnel_id` 。

    - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

      Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 以禁用追踪。一旦为某个会话启用了
      追踪，便无法再修改该配置。

      `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
      工作流名称、分组 ID 和元数据。

      - `Auto = "auto"`

        启用追踪，并设置追踪配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        用于 追踪 的细粒度配置。

        - `group_id: optional string`

          附加到此 追踪 的组 ID，用于在 Traces Dashboard 中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此 追踪 的任意元数据，用于在 Traces Dashboard 中启用
          筛选。

        - `workflow_name: optional string`

          附加到此 追踪追踪 工作流名称。该名称用于
          在 Traces Dashboard 中命名此 追踪。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 限制时，对话将被截断，意味着部分消息（从最早的消息开始）将不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断之前，上下文中最多只能包含 28,224 个 token。

      客户端可以将截断行为配置为使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方式。

      截断会减少下一轮中的缓存 token 数量（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为保留最大上下文大小一定比例的消息，从而减少未来截断的次数，进而提高缓存命中率。

      截断可以被完全禁用，这意味着服务端将永远不会进行截断，但如果对话超过模型的输入 token 限制，则会返回错误。

      - `"auto" or "disabled"`

        会话所使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 限制时返回错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入 token 限制时，保留一定比例的对话 token。这允许你将截断分摊到多轮对话中，有助于提升缓存 token 的使用效率。

        - `retention_ratio: number`

          超出指令部分后保留的对话 token 比例 (`0.0` - `1.0`)，当对话超过输入 token 限制时生效。将其设置为 `0.8` 表示会持续丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

          - `post_instructions: optional number`

            指令（包括工具定义）之后对话中允许的最大 token 数。例如，将其设置为 5,000 意味着当对话在指令之后超过 5,000 个 token 时会发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

    Realtime 转写会话配置对象。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `object: string`

      对象类型。始终为 `realtime.transcription_session`.

    - `type: "transcription"`

      会话类型。始终为 `transcription` ，用于转写会话。

      - `"transcription"`

    - `audio: optional object { input }`

      会话的输入音频配置。

      - `input: optional object { format, noise_reduction, transcription, turn_detection }`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪配置。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `transcription: optional object { language, languages, model, prompt }`

          转写模型的配置。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转写配置的输入音频可选语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前可选模型包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转写的模型。当前可选模型包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            在提供时，为输入音频转写配置的提示词。

        - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

          轮次检测配置。可设置为 `null` 以关闭。服务端
          VAD 意味着模型将根据
          音频音量检测语音的开始和结束，并在用户语音结束时进行响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

          - `prefix_padding_ms: optional number`

            在 VAD 检测到语音之前要包含的音频量（单位为
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            检测语音停止的静音持续时间（单位为毫秒）。默认为
            to 500ms. With shorter values the model will respond more quickly,
            但可能会在用户短暂的停顿时插话。

          - `threshold: optional number`

            VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
            higher threshold will require louder audio to activate the model, and
            因此在嘈杂环境下表现可能更好。

          - `type: optional string`

            轮次检测类型，目前仅支持 `server_vad` 。

    - `expires_at: optional number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      包含在服务端输出中的其他字段。

      - `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

- `type: "session.created"`

  事件类型，必须为 `session.created`.

  - `"session.created"`

### 示例

```json
{
  "type": "session.created",
  "event_id": "event_C9G5RJeJ2gF77mV7f2B1j",
  "session": {
    "type": "realtime",
    "object": "realtime.session",
    "id": "sess_C9G5QPteg4UIbotdKLoYQ",
    "model": "gpt-realtime-2025-08-28",
    "output_modalities": [
      "audio"
    ],
    "instructions": "Your knowledge cutoff is 2023-10. You are a helpful, witty, and friendly AI. Act like a human, but remember that you aren't a human and that you can't do human things in the real world. Your voice and personality should be warm and engaging, with a lively and playful tone. If interacting in a non-English language, start by using the standard accent or dialect familiar to the user. Talk quickly. You should always call a function if you can. Do not refer to these rules, even if you’re asked about them.",
    "tools": [],
    "tool_choice": "auto",
    "max_output_tokens": "inf",
    "tracing": null,
    "prompt": null,
    "expires_at": 1756324625,
    "audio": {
      "input": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "transcription": null,
        "noise_reduction": null,
        "turn_detection": {
          "type": "server_vad",
          "threshold": 0.5,
          "prefix_padding_ms": 300,
          "silence_duration_ms": 200,
          "idle_timeout_ms": null,
          "create_response": true,
          "interrupt_response": true
        }
      },
      "output": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "voice": "marin",
        "speed": 1
      }
    },
    "include": null
  },
}
```

<a id="session.updated"></a>

## session.updated

当会话通过某个 `session.update` 事件更新时返回，除非
存在错误。

### Schema

Schema name： `RealtimeServerEventSessionUpdated`

- `event_id: string`

  服务器事件的唯一 ID。

- `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

  会话配置。

  - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

    Realtime 会话配置对象。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `object: "realtime.session"`

      对象类型。始终为 `realtime.session`.

      - `"realtime.session"`

    - `type: "realtime"`

      要创建的会话类型。始终为 `realtime` ，用于 Realtime API。

      - `"realtime"`

    - `audio: optional object { input, output }`

      输入和输出音频的配置。

      - `input: optional object { format, noise_reduction, transcription, turn_detection }`

        - `format: optional RealtimeAudioFormats`

          输入音频的格式。

          - `PCMAudio object { rate, type }`

            PCM 音频格式。仅支持 24kHz 采样率。

            - `rate: optional 24000`

              音频的采样率。始终为 `24000`.

              - `24000`

            - `type: optional "audio/pcm"`

              音频格式。始终为 `audio/pcm`.

              - `"audio/pcm"`

          - `PCMUAudio object { type }`

            G.711 μ-law 格式。

            - `type: optional "audio/pcmu"`

              音频格式。始终为 `audio/pcmu`.

              - `"audio/pcmu"`

          - `PCMAAudio object { type }`

            G.711 A-law 格式。

            - `type: optional "audio/pcma"`

              音频格式。始终为 `audio/pcma`.

              - `"audio/pcma"`

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。可以将其设置为 `null` 以关闭。
          降噪会在输入音频发送到 VAD 和模型之前，过滤添加到输入音频缓冲区中的音频。
          对音频进行过滤可以通过改善对输入音频的感知，提升 VAD 和轮次检测的准确性（减少误报），并改善模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { language, languages, model, prompt }`

          输入音频转写配置，默认关闭，可以设置为 `null` 以在开启后关闭。由于模型直接消费音频，因此输入音频转写并非模型原生功能。转写通过 [/audio/transcriptions 端点](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) 异步执行，应被视为对输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写所用的语言和提示词，这些可向转写服务提供额外指引。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转写配置的输入音频可选语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前可选模型包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转写的模型。当前可选模型包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            在提供时，为输入音频转写配置的提示词。

        - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

          轮次检测配置，可以是 Server VAD 或 Semantic VAD。可以设置为 `null` 以关闭，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型将根据音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更为先进，它使用轮次检测模型（与 VAD 配合）从语义上估计用户是否已说完，然后基于这一概率动态设置超时。例如，如果用户音频以 “uhhm” 收尾，模型将给出较低的轮次结束概率，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能具有更高的延迟。

          对于 `gpt-realtime-whisper` 转写会话，轮次检测必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              turn 检测的类型， `server_vad` 用于开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时是否自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已经在响应时可能会导致创建响应失败。

              如果同时将 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选的超时时间，超过该时间后将自动触发一次模型响应。这在
              用户出现长时间停顿属于异常情况的场景下很有用，例如电话
              通话。模型将根据当前上下文有效地提示用户继续对话。
              当前上下文。

              该超时值将在最后一次模型响应的音频播放完毕之后开始计时，
              也就是说，它被设置为该 `response.done` 时间加上音频播放时长。

              一个 `input_audio_buffer.timeout_triggered` 事件（以及与该 Response 关联的事件
              ）将在达到超时时间时触发。
              空闲超时目前仅支持 `server_vad` 模式。

            - `interrupt_response: optional boolean`

              当发生 VAD start 事件时，是否自动中断（取消）任何正在进行的、向默认
              会话输出内容的响应（即。 `conversation` 基于 `auto`)。如果 `true` 为 true，则响应将被取消；否则响应将一直继续直到完成。

              如果同时将 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              仅用于 `server_vad` 模式。包含在 VAD 检测到的语音之前的音频量（以
              毫秒为单位）。默认为 300ms。

            - `silence_duration_ms: optional number`

              仅用于 `server_vad` 模式。用于检测语音停止的静默时长（以毫秒为单位）。默认为
              to 500ms. With shorter values the model will respond more quickly,
              但可能会在用户短暂的停顿时插话。

            - `threshold: optional number`

              仅用于 `server_vad` mode. Activation threshold for VAD (0.0 to 1.0), this defaults to 0.5. A
              higher threshold will require louder audio to activate the model, and
              因此在嘈杂环境下表现可能更好。

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，使用一个模型来判断用户何时结束说话。

            - `type: "semantic_vad"`

              turn 检测的类型， `semantic_vad` to turn on Semantic VAD.

              - `"semantic_vad"`

            - `create_response: optional boolean`

              Whether or not to automatically generate a response when a VAD stop event occurs.

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              仅用于 `semantic_vad` mode. The eagerness of the model to respond. `low` will wait longer for the user to continue speaking, `high` 响应速度更快。 `auto` 是默认值，等价于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当检测到 VAD 开始事件时，是否自动中断任何正在进行的响应并输出到默认
              会话输出内容的响应（即。 `conversation` 基于 `auto`)当检测到 VAD 开始事件时。

      - `output: optional object { format, speed, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型语音回复的速度，为原始速度的倍数。
          1.0 是默认速度。0.25 是最低速度。1.5 是最高速度。该值只能在模型轮次之间更改，不能在响应进行中更改。

          此参数是对生成后音频的后处理调整，
          也可以提示模型讲得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的声音。一旦模型至少回复过一次音频，
          会话中就无法再更改声音。当前
          可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回复的声音。一旦模型至少回复过一次音频，
            会话中就无法再更改声音。当前
            可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `"alloy"`

            - `"ash"`

            - `"ballad"`

            - `"coral"`

            - `"echo"`

            - `"sage"`

            - `"shimmer"`

            - `"verse"`

            - `"marin"`

            - `"cedar"`

    - `expires_at: optional number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      包含在服务端输出中的其他字段。

      `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      在模型调用之前添加的默认系统指令（即系统消息）。该字段允许客户端引导模型给出期望的回复。可以指示模型回复的内容和格式（例如 "be extremely succinct"、"act friendly"、"here are examples of good responses"）以及音频行为（例如 "talk quickly"、"inject emotion into your voice"、"laugh frequently"）。模型不保证遵循这些指令，但它们为模型提供了所需行为的指导。

      注意，服务端会设置默认指令，如果未设置该字段，则会使用这些默认指令，并可在 `session.created` 会话开始时的事件中查看。

    - `max_output_tokens: optional number or "inf"`

      单次助手响应的最大输出 token 数，
      包含工具调用。可传入 1 到 4096 之间的整数来
      限制输出 token，或传入 `inf` 以使用指定模型支持的最大
      token 数。默认值为 `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      此会话使用的 Realtime 模型。

      - `string`

      - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        此会话使用的 Realtime 模型。

        - `"gpt-realtime"`

        - `"gpt-realtime-1.5"`

        - `"gpt-realtime-2"`

        - `"gpt-realtime-2.1"`

        - `"gpt-realtime-2.1-mini"`

        - `"gpt-realtime-2025-08-28"`

        - `"gpt-4o-realtime-preview"`

        - `"gpt-4o-realtime-preview-2024-10-01"`

        - `"gpt-4o-realtime-preview-2024-12-17"`

        - `"gpt-4o-realtime-preview-2025-06-03"`

        - `"gpt-4o-mini-realtime-preview"`

        - `"gpt-4o-mini-realtime-preview-2024-12-17"`

        - `"gpt-realtime-mini"`

        - `"gpt-realtime-mini-2025-10-06"`

        - `"gpt-realtime-mini-2025-12-15"`

        - `"gpt-audio-1.5"`

        - `"gpt-audio-mini"`

        - `"gpt-audio-mini-2025-10-06"`

        - `"gpt-audio-mini-2025-12-15"`

    - `output_modalities: optional array of "text" or "audio"`

      模型可用于响应的模态集合。默认值为 `["audio"]`，表示
      模型将以音频加文字转录的方式响应。 `["text"]` 可用于让
      模型仅以文本进行响应。无法同时请求 `text` 和 `audio` 。

      - `"text"`

      - `"audio"`

    - `prompt: optional ResponsePrompt or null`

      对提示模板及其变量的引用。
      [了解详情](https://developers.openai.com/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

      - `id: string`

        要使用的提示模板的唯一标识符。

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        可选的映射，用于替换提示中变量的
        值。替换值可以是字符串，也可以是其他
        Response 输入类型，例如图像或文件。

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          模型的图像输入。了解 [图像输入](https://developers.openai.com/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            要发送给模型的文件的 ID。

          - `image_url: optional string or null`

            要发送给模型的图像的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            要发送给模型的文件内容。

          - `file_id: optional string or null`

            要发送给模型的文件的 ID。

          - `file_url: optional string`

            要发送给模型的文件的 URL。

          - `filename: optional string`

            要发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        提示词模板的可选版本。

    - `reasoning: optional RealtimeReasoning`

      用于具备推理能力的 Realtime 模型（例如 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制具备推理能力的 Realtime 模型（例如
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型选择工具的方式。可提供字符串模式之一，或强制使用指定的
      函数/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（如果有）。

        `none` 表示模型不会调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息与调用一个或
        更多工具。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项强制模型调用特定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项强制模型调用远程 MCP 服务器上的特定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具名称。

    - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的描述，包括何时以及如何调用的指导
          ，以及调用时应当向用户说明的内容
          （如有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          函数的参数，采用 JSON Schema 格式。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol（MCP）服务器为模型提供额外的工具
        （访问能力。 [了解更多关于 MCP 的信息](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中识别它。

        - `type: "mcp"`

          MCP 工具的类型。总是为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

          允许的工具名称列表或过滤器对象。

          - `McpAllowedTools = array of string`

            允许的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的过滤器对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据，或是只读的。如果 MCP
              服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          可用于远程 MCP 服务器的 OAuth 访问令牌，可以与
          自定义 MCP 服务器 URL 或服务连接器配合使用。你的应用
          必须处理 OAuth 授权流程并在此提供该令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的那些。必须提供其中
          `server_url`, `connector_id`，或 `tunnel_id` 之一。详细了解
          关于服务连接器 [此处](https://developers.openai.com/api/docs/guides/tools-connectors-mcp#connectors).

          目前支持的 `connector_id` 值包括：

          - Dropbox: `connector_dropbox`
          - Gmail: `connector_gmail`
          - Google Calendar: `connector_googlecalendar`
          - Google Drive: `connector_googledrive`
          - Microsoft Teams: `connector_microsoftteams`
          - Outlook Calendar: `connector_outlookcalendar`
          - Outlook Email: `connector_outlookemail`
          - SharePoint: `connector_sharepoint`

          - `"connector_dropbox"`

          - `"connector_gmail"`

          - `"connector_googlecalendar"`

          - `"connector_googledrive"`

          - `"connector_microsoftteams"`

          - `"connector_outlookcalendar"`

          - `"connector_outlookemail"`

          - `"connector_sharepoint"`

        - `defer_loading: optional boolean`

          此 MCP 工具是否被延迟，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中需要审批的工具。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中需要审批的工具。可以是
            `always`, `never`，或是与需要审批的工具关联的筛选对象
            。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据，或是只读的。如果 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据，或是只读的。如果 MCP
                服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值为 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当设置为
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。需提供以下之一： `server_url`, `connector_id`，或
          `tunnel_id` 。

        - `tunnel_id: optional string`

          用于代替直接服务器 URL 的安全 MCP 隧道 ID。需提供以下之一：
          `server_url`, `connector_id`，或 `tunnel_id` 。

    - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

      Realtime API 可以将会话追踪写入到 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 以禁用追踪。一旦为某个会话启用了
      追踪，便无法再修改该配置。

      `auto` 将为该会话创建一个使用默认值的追踪，包括默认的
      工作流名称、分组 ID 和元数据。

      - `Auto = "auto"`

        启用追踪，并设置追踪配置选项的默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        用于 追踪 的细粒度配置。

        - `group_id: optional string`

          附加到此 追踪 的组 ID，用于在 Traces Dashboard 中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此 追踪 的任意元数据，用于在 Traces Dashboard 中启用
          筛选。

        - `workflow_name: optional string`

          附加到此 追踪追踪 工作流名称。该名称用于
          在 Traces Dashboard 中命名此 追踪。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 限制时，对话将被截断，意味着部分消息（从最早的消息开始）将不会包含在模型的上下文中。一个 32k 上下文、4,096 最大输出 token 的模型，在发生截断之前，上下文中最多只能包含 28,224 个 token。

      客户端可以将截断行为配置为使用更低的最大 token 限制进行截断，这是控制 token 使用和成本的有效方式。

      截断会减少下一轮中的缓存 token 数量（导致缓存失效），因为消息会从上下文的开头被丢弃。然而，客户端也可以将截断配置为保留最大上下文大小一定比例的消息，从而减少未来截断的次数，进而提高缓存命中率。

      截断可以被完全禁用，这意味着服务端将永远不会进行截断，但如果对话超过模型的输入 token 限制，则会返回错误。

      - `"auto" or "disabled"`

        会话所使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 将禁用截断，并在对话超过输入 token 限制时返回错误。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        当对话超过输入 token 限制时，保留一定比例的对话 token。这允许你将截断分摊到多轮对话中，有助于提升缓存 token 的使用效率。

        - `retention_ratio: number`

          超出指令部分后保留的对话 token 比例 (`0.0` - `1.0`)，当对话超过输入 token 限制时生效。将其设置为 `0.8` 表示会持续丢弃消息，直到使用了最大允许 token 的 80%。这有助于降低截断频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 限制。如果未提供，将使用模型的默认 token 限制。

          - `post_instructions: optional number`

            指令（包括工具定义）之后对话中允许的最大 token 数。例如，将其设置为 5,000 意味着当对话在指令之后超过 5,000 个 token 时会发生截断。该值不能高于模型上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

    Realtime 转写会话配置对象。

    - `id: string`

      会话的唯一标识符，形如 `sess_1234567890abcdef`.

    - `object: string`

      对象类型。始终为 `realtime.transcription_session`.

    - `type: "transcription"`

      会话类型。始终为 `transcription` ，用于转写会话。

      - `"transcription"`

    - `audio: optional object { input }`

      会话的输入音频配置。

      - `input: optional object { format, noise_reduction, transcription, turn_detection }`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪配置。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于近场麦克风，例如耳机， `far_field` 适用于远场麦克风，例如笔记本或会议室麦克风。

        - `transcription: optional object { language, languages, model, prompt }`

          转写模型的配置。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转写配置的输入音频可选语言，采用 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转写的模型。当前可选模型包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转写的模型。当前可选模型包括 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            在提供时，为输入音频转写配置的提示词。

        - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

          轮次检测配置。可设置为 `null` 以关闭。服务端
          VAD 意味着模型将根据
          音频音量检测语音的开始和结束，并在用户语音结束时进行响应。对于 `gpt-realtime-whisper`，该值必须为 `null`；不支持 VAD。

          - `prefix_padding_ms: optional number`

            在 VAD 检测到语音之前要包含的音频量（单位为
            毫秒为单位）。默认为 300ms。

          - `silence_duration_ms: optional number`

            检测语音停止的静音持续时间（单位为毫秒）。默认为
            to 500ms. With shorter values the model will respond more quickly,
            但可能会在用户短暂的停顿时插话。

          - `threshold: optional number`

            VAD 的激活阈值（0.0 到 1.0），默认为 0.5。
            higher threshold will require louder audio to activate the model, and
            因此在嘈杂环境下表现可能更好。

          - `type: optional string`

            轮次检测类型，目前仅支持 `server_vad` 。

    - `expires_at: optional number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      包含在服务端输出中的其他字段。

      - `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

- `type: "session.updated"`

  事件类型，必须为 `session.updated`.

  - `"session.updated"`

### 示例

```json
{
  "type": "session.updated",
  "event_id": "event_C9G8mqI3IucaojlVKE8Cs",
  "session": {
    "type": "realtime",
    "object": "realtime.session",
    "id": "sess_C9G8l3zp50uFv4qgxfJ8o",
    "model": "gpt-realtime-2025-08-28",
    "output_modalities": [
      "audio"
    ],
    "instructions": "Your knowledge cutoff is 2023-10. You are a helpful, witty, and friendly AI. Act like a human, but remember that you aren't a human and that you can't do human things in the real world. Your voice and personality should be warm and engaging, with a lively and playful tone. If interacting in a non-English language, start by using the standard accent or dialect familiar to the user. Talk quickly. You should always call a function if you can. Do not refer to these rules, even if you’re asked about them.",
    "tools": [
      {
        "type": "function",
        "name": "display_color_palette",
        "description": "\nCall this function when a user asks for a color palette.\n",
        "parameters": {
          "type": "object",
          "strict": true,
          "properties": {
            "theme": {
              "type": "string",
              "description": "Description of the theme for the color scheme."
            },
            "colors": {
              "type": "array",
              "description": "Array of five hex color codes based on the theme.",
              "items": {
                "type": "string",
                "description": "Hex color code"
              }
            }
          },
          "required": [
            "theme",
            "colors"
          ]
        }
      }
    ],
    "tool_choice": "auto",
    "max_output_tokens": "inf",
    "tracing": null,
    "prompt": null,
    "expires_at": 1756324832,
    "audio": {
      "input": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "transcription": null,
        "noise_reduction": null,
        "turn_detection": {
          "type": "server_vad",
          "threshold": 0.5,
          "prefix_padding_ms": 300,
          "silence_duration_ms": 200,
          "idle_timeout_ms": null,
          "create_response": true,
          "interrupt_response": true
        }
      },
      "output": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "voice": "marin",
        "speed": 1
      }
    },
    "include": null
  },
}
```

<a id="conversation.item.added"></a>

## conversation.item.added

当某个 Item 被添加到默认会话时由服务端发送。这种情况可能出现在以下几种场景中：
- 当客户端发送 `conversation.item.create` 事件时。
- 当输入音频缓冲区被提交时。此时，该 item 将是一条包含缓冲区中音频的用户消息。
- 当模型正在生成 Response 时。在这种情况下， `conversation.item.added` 事件将在模型开始生成特定 Item 时发送，因此它还不会包含任何内容（且 `status` 将为 `in_progress`).

该事件将包含该条目的完整内容（模型正在生成 Response 时除外），但音频数据除外，音频数据可以在必要时通过以下 `conversation.item.retrieve` 事件单独获取。

### Schema

Schema name： `RealtimeServerEventConversationItemAdded`

- `event_id: string`

  服务器事件的唯一 ID。

- `item: ConversationItem`

  Realtime 对话中的单个条目。

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话的任何位置添加。对于对话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。始终为 `input_text` （用于系统消息）。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。始终为 `system`.

      - `"system"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

    Realtime 对话中的用户消息条目。

    - `content: array of object { audio, detail, image_url, 3 more }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

      - `detail: optional "auto" or "low" or "high"`

        图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

      - `text: optional string`

        文本内容（针对 `input_text`).

      - `transcript: optional string`

        音频的文字记录（针对 `input_audio`）。该内容不会发送给模型，但会附加到消息条目中以供参考。

      - `type: optional "input_text" or "input_audio" or "input_image"`

        内容类型（`input_text`, `input_audio`，或 `input_image`).

        - `"input_text"`

        - `"input_audio"`

        - `"input_image"`

    - `role: "user"`

      消息发送者的角色。始终为 `user`.

      - `"user"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

    Realtime 对话中的一条助手消息条目。

    - `content: array of object { audio, text, transcript, type }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的文字记录，当输出类型为 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送者的角色。始终为 `assistant`.

      - `"assistant"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    Realtime 对话中的一条函数调用条目。

    - `arguments: string`

      函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      被调用函数的名称。

    - `type: "function_call"`

      条目的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    Realtime 对话中的一条函数调用输出条目。

    - `call_id: string`

      此输出对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，可以是任意文本，包含任意信息，也可以为空。

    - `type: "function_call_output"`

      条目的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    响应 MCP 审批请求的 Realtime 条目。

    - `id: string`

      审批响应的唯一 ID。

    - `approval_request_id: string`

      正在回复的审批请求的 ID。

    - `approve: boolean`

      请求是否已批准。

    - `type: "mcp_approval_response"`

      条目的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      决策的可选原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    一个 Realtime 条目，用于列出 MCP 服务器上可用的工具。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述该工具输入的 JSON schema。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        关于该工具的附加注解。

      - `description: optional string or null`

        该工具的描述。

    - `type: "mcp_list_tools"`

      条目的类型。始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      该列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

    - `id: string`

      该工具调用的唯一 ID。

    - `arguments: string`

      传递给该工具的参数的 JSON 字符串。

    - `name: string`

      已运行工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      条目的类型。始终为 `mcp_call`.

      - `"mcp_call"`

    - `approval_request_id: optional string or null`

      关联的批准请求的 ID（如果有）。

    - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

      工具调用的错误（如果有）。

      - `RealtimeMcpProtocolError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "protocol_error"`

          - `"protocol_error"`

      - `RealtimeMcpToolExecutionError object { message, type }`

        - `message: string`

        - `type: "tool_execution_error"`

          - `"tool_execution_error"`

      - `RealtimeMcphttpError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "http_error"`

          - `"http_error"`

    - `output: optional string or null`

      工具调用的输出。

  - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

    一个 Realtime 条目，请求人工批准一次工具调用。

    - `id: string`

      该批准请求的唯一 ID。

    - `arguments: string`

      该工具的参数，为 JSON 字符串。

    - `name: string`

      要运行的工具名称。

    - `server_label: string`

      发起请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      条目的类型。始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

- `type: "conversation.item.added"`

  事件类型，必须为 `conversation.item.added`.

  - `"conversation.item.added"`

- `previous_item_id: optional string or null`

  位于此项之前的条目 ID（如果有）。该 ID 用于
  在插入条目时保持顺序。

### 示例

```json
{
  "type": "conversation.item.added",
  "event_id": "event_C9G8pjSJCfRNEhMEnYAVy",
  "previous_item_id": null,
  "item": {
    "id": "item_C9G8pGVKYnaZu8PH5YQ9O",
    "type": "message",
    "status": "completed",
    "role": "user",
    "content": [
      {
        "type": "input_text",
        "text": "hi"
      }
    ]
  }
}
```

<a id="conversation.item.done"></a>

## conversation.item.done

当对话项最终确定时返回。

该事件将包含该项的完整内容，但音频数据除外，音频数据可在需要时通过以下事件单独检索： `conversation.item.retrieve` 事件（如果需要）。

### Schema

Schema name： `RealtimeServerEventConversationItemDone`

- `event_id: string`

  服务器事件的唯一 ID。

- `item: ConversationItem`

  Realtime 对话中的单个条目。

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话的任何位置添加。对于对话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。始终为 `input_text` （用于系统消息）。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。始终为 `system`.

      - `"system"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

    Realtime 对话中的用户消息条目。

    - `content: array of object { audio, detail, image_url, 3 more }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

      - `detail: optional "auto" or "low" or "high"`

        图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

      - `text: optional string`

        文本内容（针对 `input_text`).

      - `transcript: optional string`

        音频的文字记录（针对 `input_audio`）。该内容不会发送给模型，但会附加到消息条目中以供参考。

      - `type: optional "input_text" or "input_audio" or "input_image"`

        内容类型（`input_text`, `input_audio`，或 `input_image`).

        - `"input_text"`

        - `"input_audio"`

        - `"input_image"`

    - `role: "user"`

      消息发送者的角色。始终为 `user`.

      - `"user"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

    Realtime 对话中的一条助手消息条目。

    - `content: array of object { audio, text, transcript, type }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的文字记录，当输出类型为 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送者的角色。始终为 `assistant`.

      - `"assistant"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    Realtime 对话中的一条函数调用条目。

    - `arguments: string`

      函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      被调用函数的名称。

    - `type: "function_call"`

      条目的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    Realtime 对话中的一条函数调用输出条目。

    - `call_id: string`

      此输出对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，可以是任意文本，包含任意信息，也可以为空。

    - `type: "function_call_output"`

      条目的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    响应 MCP 审批请求的 Realtime 条目。

    - `id: string`

      审批响应的唯一 ID。

    - `approval_request_id: string`

      正在回复的审批请求的 ID。

    - `approve: boolean`

      请求是否已批准。

    - `type: "mcp_approval_response"`

      条目的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      决策的可选原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    一个 Realtime 条目，用于列出 MCP 服务器上可用的工具。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述该工具输入的 JSON schema。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        关于该工具的附加注解。

      - `description: optional string or null`

        该工具的描述。

    - `type: "mcp_list_tools"`

      条目的类型。始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      该列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

    - `id: string`

      该工具调用的唯一 ID。

    - `arguments: string`

      传递给该工具的参数的 JSON 字符串。

    - `name: string`

      已运行工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      条目的类型。始终为 `mcp_call`.

      - `"mcp_call"`

    - `approval_request_id: optional string or null`

      关联的批准请求的 ID（如果有）。

    - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

      工具调用的错误（如果有）。

      - `RealtimeMcpProtocolError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "protocol_error"`

          - `"protocol_error"`

      - `RealtimeMcpToolExecutionError object { message, type }`

        - `message: string`

        - `type: "tool_execution_error"`

          - `"tool_execution_error"`

      - `RealtimeMcphttpError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "http_error"`

          - `"http_error"`

    - `output: optional string or null`

      工具调用的输出。

  - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

    一个 Realtime 条目，请求人工批准一次工具调用。

    - `id: string`

      该批准请求的唯一 ID。

    - `arguments: string`

      该工具的参数，为 JSON 字符串。

    - `name: string`

      要运行的工具名称。

    - `server_label: string`

      发起请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      条目的类型。始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

- `type: "conversation.item.done"`

  事件类型，必须为 `conversation.item.done`.

  - `"conversation.item.done"`

- `previous_item_id: optional string or null`

  位于此项之前的条目 ID（如果有）。该 ID 用于
  在插入条目时保持顺序。

### 示例

```json
{
  "type": "conversation.item.done",
  "event_id": "event_CCXLgMZPo3qioWCeQa4WH",
  "previous_item_id": "item_CCXLecNJVIVR2HUy3ABLj",
  "item": {
    "id": "item_CCXLfxmM5sXVJVz4mCa2S",
    "type": "message",
    "status": "completed",
    "role": "assistant",
    "content": [
      {
        "type": "output_audio",
        "transcript": "Oh, I can hear you loud and clear! Sounds like we're connected just fine. What can I help you with today?"
      }
    ]
  }
}
```

<a id="conversation.item.retrieved"></a>

## conversation.item.retrieved

在使用以下方式检索某个会话条目时返回: `conversation.item.retrieve`。这是一种获取服务器对该条目表示的方式，例如用于访问经降噪和 VAD 后处理后的音频数据。它包含该条目的完整内容，包括音频数据。

### Schema

Schema name： `RealtimeServerEventConversationItemRetrieved`

- `event_id: string`

  服务器事件的唯一 ID。

- `item: ConversationItem`

  Realtime 对话中的单个条目。

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话的任何位置添加。对于对话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。始终为 `input_text` （用于系统消息）。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。始终为 `system`.

      - `"system"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

    Realtime 对话中的用户消息条目。

    - `content: array of object { audio, detail, image_url, 3 more }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

      - `detail: optional "auto" or "low" or "high"`

        图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

      - `text: optional string`

        文本内容（针对 `input_text`).

      - `transcript: optional string`

        音频的文字记录（针对 `input_audio`）。该内容不会发送给模型，但会附加到消息条目中以供参考。

      - `type: optional "input_text" or "input_audio" or "input_image"`

        内容类型（`input_text`, `input_audio`，或 `input_image`).

        - `"input_text"`

        - `"input_audio"`

        - `"input_image"`

    - `role: "user"`

      消息发送者的角色。始终为 `user`.

      - `"user"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

    Realtime 对话中的一条助手消息条目。

    - `content: array of object { audio, text, transcript, type }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的文字记录，当输出类型为 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送者的角色。始终为 `assistant`.

      - `"assistant"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    Realtime 对话中的一条函数调用条目。

    - `arguments: string`

      函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      被调用函数的名称。

    - `type: "function_call"`

      条目的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    Realtime 对话中的一条函数调用输出条目。

    - `call_id: string`

      此输出对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，可以是任意文本，包含任意信息，也可以为空。

    - `type: "function_call_output"`

      条目的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    响应 MCP 审批请求的 Realtime 条目。

    - `id: string`

      审批响应的唯一 ID。

    - `approval_request_id: string`

      正在回复的审批请求的 ID。

    - `approve: boolean`

      请求是否已批准。

    - `type: "mcp_approval_response"`

      条目的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      决策的可选原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    一个 Realtime 条目，用于列出 MCP 服务器上可用的工具。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述该工具输入的 JSON schema。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        关于该工具的附加注解。

      - `description: optional string or null`

        该工具的描述。

    - `type: "mcp_list_tools"`

      条目的类型。始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      该列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

    - `id: string`

      该工具调用的唯一 ID。

    - `arguments: string`

      传递给该工具的参数的 JSON 字符串。

    - `name: string`

      已运行工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      条目的类型。始终为 `mcp_call`.

      - `"mcp_call"`

    - `approval_request_id: optional string or null`

      关联的批准请求的 ID（如果有）。

    - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

      工具调用的错误（如果有）。

      - `RealtimeMcpProtocolError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "protocol_error"`

          - `"protocol_error"`

      - `RealtimeMcpToolExecutionError object { message, type }`

        - `message: string`

        - `type: "tool_execution_error"`

          - `"tool_execution_error"`

      - `RealtimeMcphttpError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "http_error"`

          - `"http_error"`

    - `output: optional string or null`

      工具调用的输出。

  - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

    一个 Realtime 条目，请求人工批准一次工具调用。

    - `id: string`

      该批准请求的唯一 ID。

    - `arguments: string`

      该工具的参数，为 JSON 字符串。

    - `name: string`

      要运行的工具名称。

    - `server_label: string`

      发起请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      条目的类型。始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

- `type: "conversation.item.retrieved"`

  事件类型，必须为 `conversation.item.retrieved`.

  - `"conversation.item.retrieved"`

### 示例

```json
{
  "type": "conversation.item.retrieved",
  "event_id": "event_CCXGSizgEppa2d4XbKA7K",
  "item": {
    "id": "item_CCXGRxbY0n6WE4EszhF5w",
    "object": "realtime.item",
    "type": "message",
    "status": "completed",
    "role": "assistant",
    "content": [
      {
        "type": "audio",
        "transcript": "Yes, I can hear you loud and clear. How can I help you today?",
        "audio": "8//2//v/9//q/+//+P/s...",
        "format": "pcm16"
      }
    ]
  }
}
```

<a id="conversation.item.input_audio_transcription.completed"></a>

## conversation.item.input_audio_transcription.completed

该事件是写入
用户音频缓冲区的用户音频转录输出。当输入音频缓冲区被
客户端或服务端（启用 VAD 时）提交时，转录开始。转录与
Response 创建异步进行，因此该事件可能早于或晚于
Response 事件到达。

Realtime API 模型原生接受音频，因此输入转录是
在另一个 ASR（自动语音识别）模型上运行的独立过程。
转录文本可能与模型的理解略有差异，并且
应被视为一个粗略的参考。

### Schema

Schema name： `RealtimeServerEventConversationItemInputAudioTranscriptionCompleted`

- `content_index: number`

  包含音频的内容部分的索引。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  包含正在转录的音频的项目的 ID。

- `transcript: string`

  转录的文本。

- `type: "conversation.item.input_audio_transcription.completed"`

  事件类型，必须为
  `conversation.item.input_audio_transcription.completed`.

  - `"conversation.item.input_audio_transcription.completed"`

- `usage: object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

  转录的使用情况统计，按 ASR 模型的定价计费，而非 realtime 模型的定价。

  - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

    按 token 用量计费的模型的使用情况统计。

    - `input_tokens: number`

      本次请求计费的输入 token 数。

    - `output_tokens: number`

      生成的输出 token 数。

    - `total_tokens: number`

      使用的 token 总数（输入 + 输出）。

    - `type: "tokens"`

      使用情况对象的类型。始终为 `tokens` 用于此变体。

      - `"tokens"`

    - `input_token_details: optional object { audio_tokens, text_tokens }`

      本次请求计费输入 token 的详细信息。

      - `audio_tokens: optional number`

        本次请求计费的音频 token 数。

      - `text_tokens: optional number`

        本次请求计费的文本 token 数。

  - `Duration object { seconds, type }`

    按音频输入时长计费的模型的使用情况统计。

    - `seconds: number`

      输入音频的时长（以秒为单位）。

    - `type: "duration"`

      使用情况对象的类型。始终为 `duration` 用于此变体。

      - `"duration"`

- `languages: optional array of TranscriptionLanguage`

  在音频中检测到的语言。由 `gpt-transcribe`。返回。空数组表示未能可靠地检测到任何语言。

  - `code: string`

    在音频中检测到的语言的代码。

- `logprobs: optional array of LogProbProperties or null`

  转录的对数概率。

  - `token: string`

    用于生成对数概率的 token。

  - `bytes: array of number`

    用于生成对数概率的字节。

  - `logprob: number`

    该 token 的对数概率。

### 示例

```json
{
  "type": "conversation.item.input_audio_transcription.completed",
  "event_id": "event_CCXGRvtUVrax5SJAnNOWZ",
  "item_id": "item_CCXGQ4e1ht4cOraEYcuR2",
  "content_index": 0,
  "transcript": "Hey, can you hear me?",
  "usage": {
    "type": "tokens",
    "total_tokens": 22,
    "input_tokens": 13,
    "input_token_details": {
      "text_tokens": 0,
      "audio_tokens": 13
    },
    "output_tokens": 9
  }
}
```

<a id="conversation.item.input_audio_transcription.delta"></a>

## conversation.item.input_audio_transcription.delta

当输入音频转录内容部分的文本值通过增量转录结果更新时返回。

### Schema

Schema name： `RealtimeServerEventConversationItemInputAudioTranscriptionDelta`

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  包含正在转录的音频的项目的 ID。

- `type: "conversation.item.input_audio_transcription.delta"`

  事件类型，必须为 `conversation.item.input_audio_transcription.delta`.

  - `"conversation.item.input_audio_transcription.delta"`

- `content_index: optional number`

  该项 content 数组中内容部分的索引。

- `delta: optional string`

  文本增量。

- `logprobs: optional array of LogProbProperties or null`

  转录的对数概率。可以通过以下方式配置会话来启用它们 `"include": ["item.input_audio_transcription.logprobs"]`。数组中的每个条目对应于该转录片段所选 token 的一个对数概率。这有助于识别在给定转录片段中是否存在多个有效选项的可能性。

  - `token: string`

    用于生成对数概率的 token。

  - `bytes: array of number`

    用于生成对数概率的字节。

  - `logprob: number`

    该 token 的对数概率。

### 示例

```json
{
  "type": "conversation.item.input_audio_transcription.delta",
  "event_id": "event_CCXGRxsAimPAs8kS2Wc7Z",
  "item_id": "item_CCXGQ4e1ht4cOraEYcuR2",
  "content_index": 0,
  "delta": "Hey",
  "obfuscation": "aLxx0jTEciOGe"
}
```

<a id="conversation.item.input_audio_transcription.segment"></a>

## conversation.item.input_audio_transcription.segment

当为某个 item 识别出输入音频转写片段时返回。

### Schema

Schema name： `RealtimeServerEventConversationItemInputAudioTranscriptionSegment`

- `id: string`

  分段标识符。

- `content_index: number`

  输入音频内容部分在该条目中的索引。

- `end: number`

  分段的结束时间，单位为秒。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  包含输入音频内容的条目 ID。

- `speaker: string`

  该分段检测到的说话人标签。

- `start: number`

  分段的开始时间，单位为秒。

- `text: string`

  该分段对应的文本。

- `type: "conversation.item.input_audio_transcription.segment"`

  事件类型，必须为 `conversation.item.input_audio_transcription.segment`.

  - `"conversation.item.input_audio_transcription.segment"`

### 示例

```json
{
    "event_id": "event_6501",
    "type": "conversation.item.input_audio_transcription.segment",
    "item_id": "msg_011",
    "content_index": 0,
    "text": "hello",
    "id": "seg_0001",
    "speaker": "spk_1",
    "start": 0.0,
    "end": 0.4
}
```

<a id="conversation.item.input_audio_transcription.failed"></a>

## conversation.item.input_audio_transcription.failed

在已配置输入音频转录、且针对某条用户消息的转录
请求失败时返回。这些事件与其他事件相互独立,客户端可据此识别关联的 Item。
`error` 事件相互分离,便于客户端识别相关的 Item。

### Schema

Schema name： `RealtimeServerEventConversationItemInputAudioTranscriptionFailed`

- `content_index: number`

  包含音频的内容部分的索引。

- `error: object { code, message, param, type }`

  转写错误的详细信息。

  - `code: optional string`

    错误代码（如果有）。

  - `message: optional string`

    人类可读的报错信息。

  - `param: optional string`

    与错误相关的参数（如果有）。

  - `type: optional string`

    错误类型。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  用户消息项的 ID。

- `type: "conversation.item.input_audio_transcription.failed"`

  事件类型，必须为
  `conversation.item.input_audio_transcription.failed`.

  - `"conversation.item.input_audio_transcription.failed"`

### 示例

```json
{
    "event_id": "event_2324",
    "type": "conversation.item.input_audio_transcription.failed",
    "item_id": "msg_003",
    "content_index": 0,
    "error": {
        "type": "transcription_error",
        "code": "audio_unintelligible",
        "message": "The audio could not be transcribed.",
        "param": null
    }
}
```

<a id="conversation.item.truncated"></a>

## conversation.item.truncated

当较早的助手音频消息项被客户端通过截断事件截断时返回。
携带一个 `conversation.item.truncate` 事件。此事件用于
使服务端对音频的理解与客户端的播放保持同步。

此操作将截断音频并移除服务端文本转录
以确保上下文中不存在用户尚未听到的文本。

### Schema

Schema name： `RealtimeServerEventConversationItemTruncated`

- `audio_end_ms: number`

  音频被截断的时长上限，以毫秒为单位。

- `content_index: number`

  被截断的内容部分的索引。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  被截断的助手消息项的 ID。

- `type: "conversation.item.truncated"`

  事件类型，必须为 `conversation.item.truncated`.

  - `"conversation.item.truncated"`

### 示例

```json
{
    "event_id": "event_2526",
    "type": "conversation.item.truncated",
    "item_id": "msg_004",
    "content_index": 0,
    "audio_end_ms": 1500
}
```

<a id="conversation.item.deleted"></a>

## conversation.item.deleted

当对话中的某个条目被客户端通过以下事件删除时返回：
`conversation.item.delete` 事件。该事件用于同步
服务端对对话历史的理解与客户端的视图一致。

### Schema

Schema name： `RealtimeServerEventConversationItemDeleted`

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  已删除项的 ID。

- `type: "conversation.item.deleted"`

  事件类型，必须为 `conversation.item.deleted`.

  - `"conversation.item.deleted"`

### 示例

```json
{
    "event_id": "event_2728",
    "type": "conversation.item.deleted",
    "item_id": "msg_005"
}
```

<a id="input_audio_buffer.committed"></a>

## input_audio_buffer.committed

当输入音频缓冲区被提交时返回，可以由客户端触发，也可以由
服务端 VAD 模式自动触发。The `item_id` 属性是用户消息项的 ID，
该项将被创建，因此也会向客户端发送一个 `conversation.item.created` event
事件。

### Schema

Schema name： `RealtimeServerEventInputAudioBufferCommitted`

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  将要创建的用户消息条目的 ID。

- `type: "input_audio_buffer.committed"`

  事件类型，必须为 `input_audio_buffer.committed`.

  - `"input_audio_buffer.committed"`

- `previous_item_id: optional string or null`

  新条目将插入到其之后的前一个条目的 ID。
  可以是 `null` ，表示该条目没有前驱条目。

### 示例

```json
{
    "event_id": "event_1121",
    "type": "input_audio_buffer.committed",
    "previous_item_id": "msg_001",
    "item_id": "msg_002"
}
```

<a id="input_audio_buffer.dtmf_event_received"></a>

## input_audio_buffer.dtmf_event_received

**仅 SIP：** 在收到 DTMF 事件时返回。DTMF 事件是一条表示电话
键盘按键（0–9、*、#、A–D）的消息。该 `event` 属性
为用户按下的键。该 `received_at` 为服务端收到事件的 UTC Unix 时间戳
。

### Schema

Schema name： `RealtimeServerEventInputAudioBufferDtmfEventReceived`

- `event: string`

  用户按下的电话按键。

- `received_at: number`

  服务端接收到 DTMF 事件的 UTC Unix 时间戳。

- `type: "input_audio_buffer.dtmf_event_received"`

  事件类型，必须为 `input_audio_buffer.dtmf_event_received`.

  - `"input_audio_buffer.dtmf_event_received"`

### 示例

```json
{
    "type":" input_audio_buffer.dtmf_event_received",
    "event": "9",
    "received_at": 1763605109,
}
```

<a id="input_audio_buffer.cleared"></a>

## input_audio_buffer.cleared

当客户端使用以下操作清除输入音频缓冲区时返回：
`input_audio_buffer.clear` 事件。

### Schema

Schema name： `RealtimeServerEventInputAudioBufferCleared`

- `event_id: string`

  服务器事件的唯一 ID。

- `type: "input_audio_buffer.cleared"`

  事件类型，必须为 `input_audio_buffer.cleared`.

  - `"input_audio_buffer.cleared"`

### 示例

```json
{
    "event_id": "event_1314",
    "type": "input_audio_buffer.cleared"
}
```

<a id="input_audio_buffer.speech_started"></a>

## input_audio_buffer.speech_started

由服务端在处于 `server_vad` 模式下发送，表示音频缓冲区中已检测到语音。只要有音频被添加到
缓冲区（除非已检测到语音），就可能发生此事件。客户端可以使用此事件来中断音频播放或向用户提供可视化反馈。
事件（除非已检测到语音），就可能发生此事件。客户端可以使用此事件来中断音频播放或向用户提供可视化反馈。
事件来中断音频播放或向用户提供可视化反馈。

客户端应预期在语音停止时收到一个 `input_audio_buffer.speech_stopped` event
事件。 `item_id` 属性是将在语音停止时创建的用户消息项的 ID，该 ID 也会包含在
语音停止时创建的用户消息项的 ID，该 ID 也会包含在
`input_audio_buffer.speech_stopped` 事件中（除非客户端在 VAD 激活期间手动提交
音频缓冲区）。

### Schema

Schema name： `RealtimeServerEventInputAudioBufferSpeechStarted`

- `audio_start_ms: number`

  从会话开始首次检测到语音时写入缓冲区的所有音频所经过的毫秒数。该时间对应于
  发送给模型的音频开头，因此包含在 Session 中配置的
  开头部分。
  `prefix_padding_ms` 在 Session 中配置的。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  语音停止时将创建的用户消息项的 ID。

- `type: "input_audio_buffer.speech_started"`

  事件类型，必须为 `input_audio_buffer.speech_started`.

  - `"input_audio_buffer.speech_started"`

### 示例

```json
{
    "event_id": "event_1516",
    "type": "input_audio_buffer.speech_started",
    "audio_start_ms": 1000,
    "item_id": "msg_003"
}
```

<a id="input_audio_buffer.speech_stopped"></a>

## input_audio_buffer.speech_stopped

在以下情况下返回 `server_vad` 当服务端检测到语音结束时使用该
音频缓冲区。服务器还会发送一个 `conversation.item.created`
事件，该事件包含从音频缓冲区创建的用户消息条目。

### Schema

Schema name： `RealtimeServerEventInputAudioBufferSpeechStopped`

- `audio_end_ms: number`

  自会话开始至语音停止的毫秒数。这将
  对应于发送到模型的音频末尾，因此包括
  `min_silence_duration_ms` 在 Session 中配置的。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  将要创建的用户消息条目的 ID。

- `type: "input_audio_buffer.speech_stopped"`

  事件类型，必须为 `input_audio_buffer.speech_stopped`.

  - `"input_audio_buffer.speech_stopped"`

### 示例

```json
{
    "event_id": "event_1718",
    "type": "input_audio_buffer.speech_stopped",
    "audio_end_ms": 2000,
    "item_id": "msg_003"
}
```

<a id="input_audio_buffer.timeout_triggered"></a>

## input_audio_buffer.timeout_triggered

当输入音频缓冲区触发 Server VAD 超时时返回。该超时通过会话的
会话 `idle_timeout_ms` 中进行设置， `turn_detection` settings 中配置，表示在配置的时长内未检测到
任何语音。

该 `audio_start_ms` 和 `audio_end_ms` 字段表示从最后一次模型响应之后到触发时刻为止的音频段，
其偏移量是相对于写入输入音频缓冲区的音频起始位置计算的。
这意味着它划定了处于静默状态的音频段，且起始值与结束值
之间的差值大致与所配置的超时时长一致。

这段空音频将作为 `input_audio` （将会有一个
`input_audio_buffer.committed` 事件）提交到对话中，并生成一次模型响应。可能会存在
未触发 VAD 但仍被模型检测到的语音，因此模型可能会给出与对话
相关的内容，或提示用户继续发言。

### Schema

Schema name： `RealtimeServerEventInputAudioBufferTimeoutTriggered`

- `audio_end_ms: number`

  触发超时时刻已写入输入音频缓冲区的音频的毫秒偏移量。

- `audio_start_ms: number`

  写入输入音频缓冲区中、位于上一次模型响应播放时间之后的音频的毫秒偏移量。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  与此片段关联的条目 ID。

- `type: "input_audio_buffer.timeout_triggered"`

  事件类型，必须为 `input_audio_buffer.timeout_triggered`.

  - `"input_audio_buffer.timeout_triggered"`

### 示例

```json
{
    "type":"input_audio_buffer.timeout_triggered",
    "event_id":"event_CEKKrf1KTGvemCPyiJTJ2",
    "audio_start_ms":13216,
    "audio_end_ms":19232,
    "item_id":"item_CEKKrWH0GiwN0ET97NUZc"
}
```

<a id="output_audio_buffer.started"></a>

## output_audio_buffer.started

**仅限 WebRTC/SIP：** 当服务器开始向客户端流式传输音频时发出。该事件在将音频内容部分添加（
）到响应之后发出。`response.content_part.added`)
响应之后发出。
[了解更多](https://developers.openai.com/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

### Schema

Schema name： `RealtimeServerEventOutputAudioBufferStarted`

- `event_id: string`

  服务器事件的唯一 ID。

- `response_id: string`

  生成该音频的响应的唯一 ID。

- `type: "output_audio_buffer.started"`

  事件类型，必须为 `output_audio_buffer.started`.

  - `"output_audio_buffer.started"`

### 示例

```json
{
    "event_id": "event_abc123",
    "type": "output_audio_buffer.started",
    "response_id": "resp_abc123"
}
```

<a id="output_audio_buffer.stopped"></a>

## output_audio_buffer.stopped

**仅限 WebRTC/SIP：** 当服务端输出音频缓冲区已被完全排空时触发，
并且不再有音频输出。该事件在完整响应数据已发送到客户端后触发（
)`response.done`).
[了解更多](https://developers.openai.com/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

### Schema

Schema name： `RealtimeServerEventOutputAudioBufferStopped`

- `event_id: string`

  服务器事件的唯一 ID。

- `response_id: string`

  生成该音频的响应的唯一 ID。

- `type: "output_audio_buffer.stopped"`

  事件类型，必须为 `output_audio_buffer.stopped`.

  - `"output_audio_buffer.stopped"`

### 示例

```json
{
    "event_id": "event_abc123",
    "type": "output_audio_buffer.stopped",
    "response_id": "resp_abc123"
}
```

<a id="output_audio_buffer.cleared"></a>

## output_audio_buffer.cleared

**仅限 WebRTC/SIP：** 当输出音频缓冲区被清空时触发。这可能发生在 VAD
模式下用户中断时（`input_audio_buffer.speech_started`),
），或客户端发出 `output_audio_buffer.clear` 事件以手动
切断当前的音频响应。
[了解更多](https://developers.openai.com/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

### Schema

Schema name： `RealtimeServerEventOutputAudioBufferCleared`

- `event_id: string`

  服务器事件的唯一 ID。

- `response_id: string`

  生成该音频的响应的唯一 ID。

- `type: "output_audio_buffer.cleared"`

  事件类型，必须为 `output_audio_buffer.cleared`.

  - `"output_audio_buffer.cleared"`

### 示例

```json
{
    "event_id": "event_abc123",
    "type": "output_audio_buffer.cleared",
    "response_id": "resp_abc123"
}
```

<a id="response.created"></a>

## response.created

在创建新的 Response 时返回。这是 response 创建过程中的第一个事件，
此时 response 处于初始状态 `in_progress`.

### Schema

Schema name： `RealtimeServerEventResponseCreated`

- `event_id: string`

  服务器事件的唯一 ID。

- `response: RealtimeResponse`

  响应资源。

  - `id: optional string`

    响应的唯一 ID，格式类似 `resp_1234`.

  - `audio: optional object { output }`

    音频输出的配置。

    - `output: optional object { format, voice }`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

        - `PCMAudio object { rate, type }`

          PCM 音频格式。仅支持 24kHz 采样率。

          - `rate: optional 24000`

            音频的采样率。始终为 `24000`.

            - `24000`

          - `type: optional "audio/pcm"`

            音频格式。始终为 `audio/pcm`.

            - `"audio/pcm"`

        - `PCMUAudio object { type }`

          G.711 μ-law 格式。

          - `type: optional "audio/pcmu"`

            音频格式。始终为 `audio/pcmu`.

            - `"audio/pcmu"`

        - `PCMAAudio object { type }`

          G.711 A-law 格式。

          - `type: optional "audio/pcma"`

            音频格式。始终为 `audio/pcma`.

            - `"audio/pcma"`

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

        模型用于回复的声音。一旦模型至少回复过一次音频，
        会话中就无法再更改声音。当前
        可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
        最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的声音。一旦模型至少回复过一次音频，
          会话中就无法再更改声音。当前
          可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `"alloy"`

          - `"ash"`

          - `"ballad"`

          - `"coral"`

          - `"echo"`

          - `"sage"`

          - `"shimmer"`

          - `"verse"`

          - `"marin"`

          - `"cedar"`

  - `conversation_id: optional string`

    响应被添加到的会话，由 `conversation`
    事件中的 `response.create` 字段决定。如果 `auto`，响应将被添加到
    默认会话，并且 `conversation_id` 的值将是一个类似
    `conv_1234`。的 ID。如果 `none`，响应将不会被添加到任何会话，并且
    的值 `conversation_id` 将为 `null`。如果响应是由 VAD
    自动触发的，则响应将被添加到默认会话

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    中，包含此次响应中使用过的工具调用。

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对。可用于
    以结构化格式存储关于对象的附加信息，并通过 API 或仪表板查询对象。
    以结构化格式存储关于对象的附加信息，并通过 接口 或仪表板查询对象。

    键是字符串，最长 64 个字符；值是字符串，最长
    512 个字符。

  - `object: optional "realtime.response"`

    对象类型，必须为 `realtime.response`.

    - `"realtime.response"`

  - `output: optional array of ConversationItem`

    由响应生成的输出项列表。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话的任何位置添加。对于对话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` （用于系统消息）。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

      Realtime 对话中的用户消息条目。

      - `content: array of object { audio, detail, image_url, 3 more }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的文字记录（针对 `input_audio`）。该内容不会发送给模型，但会附加到消息条目中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息条目。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录，当输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一条函数调用条目。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一条函数调用输出条目。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意文本，包含任意信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的 Realtime 条目。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        决策的可选原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 条目，用于列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注解。

        - `description: optional string or null`

          该工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        已运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联的批准请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        工具调用的错误（如果有）。

        - `RealtimeMcpProtocolError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "protocol_error"`

            - `"protocol_error"`

        - `RealtimeMcpToolExecutionError object { message, type }`

          - `message: string`

          - `type: "tool_execution_error"`

            - `"tool_execution_error"`

        - `RealtimeMcphttpError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "http_error"`

            - `"http_error"`

      - `output: optional string or null`

        工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      一个 Realtime 条目，请求人工批准一次工具调用。

      - `id: string`

        该批准请求的唯一 ID。

      - `arguments: string`

        该工具的参数，为 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前唯一可能的取值包括
    `[\"audio\"]`, `[\"text\"]`. 音频输出始终包含文本转录。将
    输出设置为模式 `text` 将禁用模型的音频输出。

    - `"text"`

    - `"audio"`

  - `status: optional "completed" or "cancelled" or "failed" or 2 more`

    响应的最终状态（`completed`, `cancelled`, `failed`，或
    `incomplete`, `in_progress`).

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

    - `"incomplete"`

    - `"in_progress"`

  - `status_details: optional RealtimeResponseStatus`

    有关该状态的更多详细信息。

    - `error: optional object { code, type }`

      导致响应失败错误的描述，
      在以下情况下填充： `status` 为 `failed`.

      - `code: optional string`

        错误代码（如果有）。

      - `type: optional string`

        错误类型。

    - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

      Response 未完成的原因。对于 `cancelled` Response，取值之一为 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` Response，取值之一为 `max_output_tokens` 或 `content_filter`  （服务端 安全过滤器触发并截断了响应）。

      - `"turn_detected"`

      - `"client_cancelled"`

      - `"max_output_tokens"`

      - `"content_filter"`

    - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

      导致响应失败的错误类型，对应
      的 `status` 字段（`completed`, `cancelled`, `incomplete`,
      `failed`).

      - `"completed"`

      - `"cancelled"`

      - `"failed"`

      - `"incomplete"`

  - `usage: optional RealtimeResponseUsage`

    Response 的使用统计信息，对应计费。A
    Realtime API 会话将维护会话上下文，并将新的
    Items 追加到会话中，从而将先前轮次的输出（文本和
    音频 token）作为后续轮次的输入。

    - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

      Response 中输入 token 的详细信息。缓存 token 是指来自会话先前轮次、作为当前 Response 上下文包含在内的 token。此处的缓存 token 被计为输入 token 的一个子集，这意味着输入 token 包括缓存 token 和未缓存 token。

      - `audio_tokens: optional number`

        用作 Response 输入的音频 token 数量。

      - `cached_tokens: optional number`

        用作 Response 输入的缓存 token 数量。

      - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

        用作 Response 输入的缓存 token 的详细信息。

        - `audio_tokens: optional number`

          用作 Response 输入的缓存音频 token 数量。

        - `image_tokens: optional number`

          用作 Response 输入的缓存图像 token 数量。

        - `text_tokens: optional number`

          用作 Response 输入的缓存文本 token 数量。

      - `image_tokens: optional number`

        用作 Response 输入的图像 token 数量。

      - `text_tokens: optional number`

        用作 Response 输入的文本 token 数量。

    - `input_tokens: optional number`

      Response 中使用的输入 token 数量，包括文本和
      音频 token。

    - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

      Response 中输出 token 的详细信息。

      - `audio_tokens: optional number`

        Response 中使用的音频 token 数量。

      - `text_tokens: optional number`

        Response 中使用的文本 token 数量。

    - `output_tokens: optional number`

      Response 中发送的输出 token 数量，包括文本和
      音频 token。

    - `total_tokens: optional number`

      Response 中的 token 总数，包括输入和输出
      文本和音频 token。

- `type: "response.created"`

  事件类型，必须为 `response.created`.

  - `"response.created"`

### 示例

```json
{
  "type": "response.created",
  "event_id": "event_C9G8pqbTEddBSIxbBN6Os",
  "response": {
    "object": "realtime.response",
    "id": "resp_C9G8p7IH2WxLbkgPNouYL",
    "status": "in_progress",
    "status_details": null,
    "output": [],
    "conversation_id": "conv_C9G8mmBkLhQJwCon3hoJN",
    "output_modalities": [
      "audio"
    ],
    "max_output_tokens": "inf",
    "audio": {
      "output": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "voice": "marin"
      }
    },
    "usage": null,
    "metadata": null
  },
}
```

<a id="response.done"></a>

## response.done

当 Response 完成流式传输时返回。无论
最终状态如何都会发送。Response 对象中包含在该 `response.done` 事件
中，会包含 Response 中的所有输出 Item，但会省略原始音频数据。

客户端应检查 Response 的 `status` 字段，以判断请求是否成功
(`completed`）还是发生了其他结果： `cancelled`, `failed`，或 `incomplete`.

响应将包含该响应期间生成的所有输出项，但不包括
任何音频内容。

### Schema

Schema name： `RealtimeServerEventResponseDone`

- `event_id: string`

  服务器事件的唯一 ID。

- `response: RealtimeResponse`

  响应资源。

  - `id: optional string`

    响应的唯一 ID，格式类似 `resp_1234`.

  - `audio: optional object { output }`

    音频输出的配置。

    - `output: optional object { format, voice }`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

        - `PCMAudio object { rate, type }`

          PCM 音频格式。仅支持 24kHz 采样率。

          - `rate: optional 24000`

            音频的采样率。始终为 `24000`.

            - `24000`

          - `type: optional "audio/pcm"`

            音频格式。始终为 `audio/pcm`.

            - `"audio/pcm"`

        - `PCMUAudio object { type }`

          G.711 μ-law 格式。

          - `type: optional "audio/pcmu"`

            音频格式。始终为 `audio/pcmu`.

            - `"audio/pcmu"`

        - `PCMAAudio object { type }`

          G.711 A-law 格式。

          - `type: optional "audio/pcma"`

            音频格式。始终为 `audio/pcma`.

            - `"audio/pcma"`

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

        模型用于回复的声音。一旦模型至少回复过一次音频，
        会话中就无法再更改声音。当前
        可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
        最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回复的声音。一旦模型至少回复过一次音频，
          会话中就无法再更改声音。当前
          可用的声音选项包括 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `"alloy"`

          - `"ash"`

          - `"ballad"`

          - `"coral"`

          - `"echo"`

          - `"sage"`

          - `"shimmer"`

          - `"verse"`

          - `"marin"`

          - `"cedar"`

  - `conversation_id: optional string`

    响应被添加到的会话，由 `conversation`
    事件中的 `response.create` 字段决定。如果 `auto`，响应将被添加到
    默认会话，并且 `conversation_id` 的值将是一个类似
    `conv_1234`。的 ID。如果 `none`，响应将不会被添加到任何会话，并且
    的值 `conversation_id` 将为 `null`。如果响应是由 VAD
    自动触发的，则响应将被添加到默认会话

  - `max_output_tokens: optional number or "inf"`

    单次助手响应的最大输出 token 数，
    中，包含此次响应中使用过的工具调用。

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对。可用于
    以结构化格式存储关于对象的附加信息，并通过 API 或仪表板查询对象。
    以结构化格式存储关于对象的附加信息，并通过 接口 或仪表板查询对象。

    键是字符串，最长 64 个字符；值是字符串，最长
    512 个字符。

  - `object: optional "realtime.response"`

    对象类型，必须为 `realtime.response`.

    - `"realtime.response"`

  - `output: optional array of ConversationItem`

    由响应生成的输出项列表。

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话的任何位置添加。对于对话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

      - `content: array of object { text, type }`

        消息的内容。

        - `text: optional string`

          文本内容。

        - `type: optional "input_text"`

          内容类型。始终为 `input_text` （用于系统消息）。

          - `"input_text"`

      - `role: "system"`

        消息发送者的角色。始终为 `system`.

        - `"system"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

      Realtime 对话中的用户消息条目。

      - `content: array of object { audio, detail, image_url, 3 more }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

        - `detail: optional "auto" or "low" or "high"`

          图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

        - `text: optional string`

          文本内容（针对 `input_text`).

        - `transcript: optional string`

          音频的文字记录（针对 `input_audio`）。该内容不会发送给模型，但会附加到消息条目中以供参考。

        - `type: optional "input_text" or "input_audio" or "input_image"`

          内容类型（`input_text`, `input_audio`，或 `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        消息发送者的角色。始终为 `user`.

        - `"user"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      Realtime 对话中的一条助手消息条目。

      - `content: array of object { audio, text, transcript, type }`

        消息的内容。

        - `audio: optional string`

          Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

        - `text: optional string`

          文本内容。

        - `transcript: optional string`

          音频内容的文字记录，当输出类型为 `audio`.

        - `type: optional "output_text" or "output_audio"`

          内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        消息发送者的角色。始终为 `assistant`.

        - `"assistant"`

      - `type: "message"`

        条目的类型。始终为 `message`.

        - `"message"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      Realtime 对话中的一条函数调用条目。

      - `arguments: string`

        函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        被调用函数的名称。

      - `type: "function_call"`

        条目的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `call_id: optional string`

        函数调用的 ID。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      Realtime 对话中的一条函数调用输出条目。

      - `call_id: string`

        此输出对应的函数调用的 ID。

      - `output: string`

        函数调用的输出，可以是任意文本，包含任意信息，也可以为空。

      - `type: "function_call_output"`

        条目的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

      - `object: optional "realtime.item"`

        所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        条目的状态。对对话没有影响。

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      响应 MCP 审批请求的 Realtime 条目。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        条目的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        决策的可选原因。

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      一个 Realtime 条目，用于列出 MCP 服务器上可用的工具。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注解。

        - `description: optional string or null`

          该工具的描述。

      - `type: "mcp_list_tools"`

        条目的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        该列表的唯一 ID。

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        已运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        关联的批准请求的 ID（如果有）。

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        工具调用的错误（如果有）。

        - `RealtimeMcpProtocolError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "protocol_error"`

            - `"protocol_error"`

        - `RealtimeMcpToolExecutionError object { message, type }`

          - `message: string`

          - `type: "tool_execution_error"`

            - `"tool_execution_error"`

        - `RealtimeMcphttpError object { code, message, type }`

          - `code: number`

          - `message: string`

          - `type: "http_error"`

            - `"http_error"`

      - `output: optional string or null`

        工具调用的输出。

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      一个 Realtime 条目，请求人工批准一次工具调用。

      - `id: string`

        该批准请求的唯一 ID。

      - `arguments: string`

        该工具的参数，为 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `output_modalities: optional array of "text" or "audio"`

    模型用于响应的模态集合，目前唯一可能的取值包括
    `[\"audio\"]`, `[\"text\"]`. 音频输出始终包含文本转录。将
    输出设置为模式 `text` 将禁用模型的音频输出。

    - `"text"`

    - `"audio"`

  - `status: optional "completed" or "cancelled" or "failed" or 2 more`

    响应的最终状态（`completed`, `cancelled`, `failed`，或
    `incomplete`, `in_progress`).

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

    - `"incomplete"`

    - `"in_progress"`

  - `status_details: optional RealtimeResponseStatus`

    有关该状态的更多详细信息。

    - `error: optional object { code, type }`

      导致响应失败错误的描述，
      在以下情况下填充： `status` 为 `failed`.

      - `code: optional string`

        错误代码（如果有）。

      - `type: optional string`

        错误类型。

    - `reason: optional "turn_detected" or "client_cancelled" or "max_output_tokens" or "content_filter"`

      Response 未完成的原因。对于 `cancelled` Response，取值之一为 `turn_detected` （服务端 VAD 检测到新的语音开始）或 `client_cancelled` （客户端发送了取消事件）。对于  `incomplete` Response，取值之一为 `max_output_tokens` 或 `content_filter`  （服务端 安全过滤器触发并截断了响应）。

      - `"turn_detected"`

      - `"client_cancelled"`

      - `"max_output_tokens"`

      - `"content_filter"`

    - `type: optional "completed" or "cancelled" or "failed" or "incomplete"`

      导致响应失败的错误类型，对应
      的 `status` 字段（`completed`, `cancelled`, `incomplete`,
      `failed`).

      - `"completed"`

      - `"cancelled"`

      - `"failed"`

      - `"incomplete"`

  - `usage: optional RealtimeResponseUsage`

    Response 的使用统计信息，对应计费。A
    Realtime API 会话将维护会话上下文，并将新的
    Items 追加到会话中，从而将先前轮次的输出（文本和
    音频 token）作为后续轮次的输入。

    - `input_token_details: optional RealtimeResponseUsageInputTokenDetails`

      Response 中输入 token 的详细信息。缓存 token 是指来自会话先前轮次、作为当前 Response 上下文包含在内的 token。此处的缓存 token 被计为输入 token 的一个子集，这意味着输入 token 包括缓存 token 和未缓存 token。

      - `audio_tokens: optional number`

        用作 Response 输入的音频 token 数量。

      - `cached_tokens: optional number`

        用作 Response 输入的缓存 token 数量。

      - `cached_tokens_details: optional object { audio_tokens, image_tokens, text_tokens }`

        用作 Response 输入的缓存 token 的详细信息。

        - `audio_tokens: optional number`

          用作 Response 输入的缓存音频 token 数量。

        - `image_tokens: optional number`

          用作 Response 输入的缓存图像 token 数量。

        - `text_tokens: optional number`

          用作 Response 输入的缓存文本 token 数量。

      - `image_tokens: optional number`

        用作 Response 输入的图像 token 数量。

      - `text_tokens: optional number`

        用作 Response 输入的文本 token 数量。

    - `input_tokens: optional number`

      Response 中使用的输入 token 数量，包括文本和
      音频 token。

    - `output_token_details: optional RealtimeResponseUsageOutputTokenDetails`

      Response 中输出 token 的详细信息。

      - `audio_tokens: optional number`

        Response 中使用的音频 token 数量。

      - `text_tokens: optional number`

        Response 中使用的文本 token 数量。

    - `output_tokens: optional number`

      Response 中发送的输出 token 数量，包括文本和
      音频 token。

    - `total_tokens: optional number`

      Response 中的 token 总数，包括输入和输出
      文本和音频 token。

- `type: "response.done"`

  事件类型，必须为 `response.done`.

  - `"response.done"`

### 示例

```json
{
  "type": "response.done",
  "event_id": "event_CCXHxcMy86rrKhBLDdqCh",
  "response": {
    "object": "realtime.response",
    "id": "resp_CCXHw0UJld10EzIUXQCNh",
    "status": "completed",
    "status_details": null,
    "output": [
      {
        "id": "item_CCXHwGjjDUfOXbiySlK7i",
        "type": "message",
        "status": "completed",
        "role": "assistant",
        "content": [
          {
            "type": "output_audio",
            "transcript": "Loud and clear! I can hear you perfectly. How can I help you today?"
          }
        ]
      }
    ],
    "conversation_id": "conv_CCXHsurMKcaVxIZvaCI5m",
    "output_modalities": [
      "audio"
    ],
    "max_output_tokens": "inf",
    "audio": {
      "output": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "voice": "alloy"
      }
    },
    "usage": {
      "total_tokens": 253,
      "input_tokens": 132,
      "output_tokens": 121,
      "input_token_details": {
        "text_tokens": 119,
        "audio_tokens": 13,
        "image_tokens": 0,
        "cached_tokens": 64,
        "cached_tokens_details": {
          "text_tokens": 64,
          "audio_tokens": 0,
          "image_tokens": 0
        }
      },
      "output_token_details": {
        "text_tokens": 30,
        "audio_tokens": 91
      }
    },
    "metadata": null
  }
}
```

<a id="response.output_item.added"></a>

## response.output_item.added

在 Response 生成期间创建新的 Item 时返回。

### Schema

Schema name： `RealtimeServerEventResponseOutputItemAdded`

- `event_id: string`

  服务器事件的唯一 ID。

- `item: ConversationItem`

  Realtime 对话中的单个条目。

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话的任何位置添加。对于对话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。始终为 `input_text` （用于系统消息）。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。始终为 `system`.

      - `"system"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

    Realtime 对话中的用户消息条目。

    - `content: array of object { audio, detail, image_url, 3 more }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

      - `detail: optional "auto" or "low" or "high"`

        图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

      - `text: optional string`

        文本内容（针对 `input_text`).

      - `transcript: optional string`

        音频的文字记录（针对 `input_audio`）。该内容不会发送给模型，但会附加到消息条目中以供参考。

      - `type: optional "input_text" or "input_audio" or "input_image"`

        内容类型（`input_text`, `input_audio`，或 `input_image`).

        - `"input_text"`

        - `"input_audio"`

        - `"input_image"`

    - `role: "user"`

      消息发送者的角色。始终为 `user`.

      - `"user"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

    Realtime 对话中的一条助手消息条目。

    - `content: array of object { audio, text, transcript, type }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的文字记录，当输出类型为 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送者的角色。始终为 `assistant`.

      - `"assistant"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    Realtime 对话中的一条函数调用条目。

    - `arguments: string`

      函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      被调用函数的名称。

    - `type: "function_call"`

      条目的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    Realtime 对话中的一条函数调用输出条目。

    - `call_id: string`

      此输出对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，可以是任意文本，包含任意信息，也可以为空。

    - `type: "function_call_output"`

      条目的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    响应 MCP 审批请求的 Realtime 条目。

    - `id: string`

      审批响应的唯一 ID。

    - `approval_request_id: string`

      正在回复的审批请求的 ID。

    - `approve: boolean`

      请求是否已批准。

    - `type: "mcp_approval_response"`

      条目的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      决策的可选原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    一个 Realtime 条目，用于列出 MCP 服务器上可用的工具。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述该工具输入的 JSON schema。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        关于该工具的附加注解。

      - `description: optional string or null`

        该工具的描述。

    - `type: "mcp_list_tools"`

      条目的类型。始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      该列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

    - `id: string`

      该工具调用的唯一 ID。

    - `arguments: string`

      传递给该工具的参数的 JSON 字符串。

    - `name: string`

      已运行工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      条目的类型。始终为 `mcp_call`.

      - `"mcp_call"`

    - `approval_request_id: optional string or null`

      关联的批准请求的 ID（如果有）。

    - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

      工具调用的错误（如果有）。

      - `RealtimeMcpProtocolError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "protocol_error"`

          - `"protocol_error"`

      - `RealtimeMcpToolExecutionError object { message, type }`

        - `message: string`

        - `type: "tool_execution_error"`

          - `"tool_execution_error"`

      - `RealtimeMcphttpError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "http_error"`

          - `"http_error"`

    - `output: optional string or null`

      工具调用的输出。

  - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

    一个 Realtime 条目，请求人工批准一次工具调用。

    - `id: string`

      该批准请求的唯一 ID。

    - `arguments: string`

      该工具的参数，为 JSON 字符串。

    - `name: string`

      要运行的工具名称。

    - `server_label: string`

      发起请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      条目的类型。始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

- `output_index: number`

  输出项在 Response 中的索引。

- `response_id: string`

  该项所属 Response 的 ID。

- `type: "response.output_item.added"`

  事件类型，必须为 `response.output_item.added`.

  - `"response.output_item.added"`

### 示例

```json
{
    "event_id": "event_3334",
    "type": "response.output_item.added",
    "response_id": "resp_001",
    "output_index": 0,
    "item": {
        "id": "msg_007",
        "object": "realtime.item",
        "type": "message",
        "status": "in_progress",
        "role": "assistant",
        "content": []
    }
}
```

<a id="response.output_item.done"></a>

## response.output_item.done

在 Item 完成流式传输时返回。当 Response 被
中断、未完成或取消时也会发送。

### Schema

Schema name： `RealtimeServerEventResponseOutputItemDone`

- `event_id: string`

  服务器事件的唯一 ID。

- `item: ConversationItem`

  Realtime 对话中的单个条目。

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话的任何位置添加。对于对话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。始终为 `input_text` （用于系统消息）。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。始终为 `system`.

      - `"system"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

    Realtime 对话中的用户消息条目。

    - `content: array of object { audio, detail, image_url, 3 more }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

      - `detail: optional "auto" or "low" or "high"`

        图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

      - `text: optional string`

        文本内容（针对 `input_text`).

      - `transcript: optional string`

        音频的文字记录（针对 `input_audio`）。该内容不会发送给模型，但会附加到消息条目中以供参考。

      - `type: optional "input_text" or "input_audio" or "input_image"`

        内容类型（`input_text`, `input_audio`，或 `input_image`).

        - `"input_text"`

        - `"input_audio"`

        - `"input_image"`

    - `role: "user"`

      消息发送者的角色。始终为 `user`.

      - `"user"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

    Realtime 对话中的一条助手消息条目。

    - `content: array of object { audio, text, transcript, type }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的文字记录，当输出类型为 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送者的角色。始终为 `assistant`.

      - `"assistant"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    Realtime 对话中的一条函数调用条目。

    - `arguments: string`

      函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      被调用函数的名称。

    - `type: "function_call"`

      条目的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    Realtime 对话中的一条函数调用输出条目。

    - `call_id: string`

      此输出对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，可以是任意文本，包含任意信息，也可以为空。

    - `type: "function_call_output"`

      条目的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    响应 MCP 审批请求的 Realtime 条目。

    - `id: string`

      审批响应的唯一 ID。

    - `approval_request_id: string`

      正在回复的审批请求的 ID。

    - `approve: boolean`

      请求是否已批准。

    - `type: "mcp_approval_response"`

      条目的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      决策的可选原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    一个 Realtime 条目，用于列出 MCP 服务器上可用的工具。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述该工具输入的 JSON schema。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        关于该工具的附加注解。

      - `description: optional string or null`

        该工具的描述。

    - `type: "mcp_list_tools"`

      条目的类型。始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      该列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

    - `id: string`

      该工具调用的唯一 ID。

    - `arguments: string`

      传递给该工具的参数的 JSON 字符串。

    - `name: string`

      已运行工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      条目的类型。始终为 `mcp_call`.

      - `"mcp_call"`

    - `approval_request_id: optional string or null`

      关联的批准请求的 ID（如果有）。

    - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

      工具调用的错误（如果有）。

      - `RealtimeMcpProtocolError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "protocol_error"`

          - `"protocol_error"`

      - `RealtimeMcpToolExecutionError object { message, type }`

        - `message: string`

        - `type: "tool_execution_error"`

          - `"tool_execution_error"`

      - `RealtimeMcphttpError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "http_error"`

          - `"http_error"`

    - `output: optional string or null`

      工具调用的输出。

  - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

    一个 Realtime 条目，请求人工批准一次工具调用。

    - `id: string`

      该批准请求的唯一 ID。

    - `arguments: string`

      该工具的参数，为 JSON 字符串。

    - `name: string`

      要运行的工具名称。

    - `server_label: string`

      发起请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      条目的类型。始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

- `output_index: number`

  输出项在 Response 中的索引。

- `response_id: string`

  该项所属 Response 的 ID。

- `type: "response.output_item.done"`

  事件类型，必须为 `response.output_item.done`.

  - `"response.output_item.done"`

### 示例

```json
{
    "event_id": "event_3536",
    "type": "response.output_item.done",
    "response_id": "resp_001",
    "output_index": 0,
    "item": {
        "id": "msg_007",
        "object": "realtime.item",
        "type": "message",
        "status": "completed",
        "role": "assistant",
        "content": [
            {
                "type": "text",
                "text": "Sure, I can help with that."
            }
        ]
    }
}
```

<a id="response.content_part.added"></a>

## response.content_part.added

当在助手消息项中添加新的内容部分时返回
响应生成。

### Schema

Schema name： `RealtimeServerEventResponseContentPartAdded`

- `content_index: number`

  该项 content 数组中内容部分的索引。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  被添加内容部分的项的 ID。

- `output_index: number`

  响应中输出项的索引。

- `part: object { audio, text, transcript, type }`

  被添加的内容部分。

  - `audio: optional string`

    Base64 编码的音频数据（如果类型为 "audio"）。

  - `text: optional string`

    文本内容（如果类型为 "text"）。

  - `transcript: optional string`

    音频的转录文本（如果类型为 "audio"）。

  - `type: optional "audio" or "text"`

    内容类型（"text"、"audio"）。

    - `"audio"`

    - `"text"`

- `response_id: string`

  响应的 ID。

- `type: "response.content_part.added"`

  事件类型，必须为 `response.content_part.added`.

  - `"response.content_part.added"`

### 示例

```json
{
    "event_id": "event_3738",
    "type": "response.content_part.added",
    "response_id": "resp_001",
    "item_id": "msg_007",
    "output_index": 0,
    "content_index": 0,
    "part": {
        "type": "text",
        "text": ""
    }
}
```

<a id="response.content_part.done"></a>

## response.content_part.done

当某个内容部分在助手消息条目中流式传输完成时返回。
在 Response 被中断、未完成或被取消时也会发出。

### Schema

Schema name： `RealtimeServerEventResponseContentPartDone`

- `content_index: number`

  该项 content 数组中内容部分的索引。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  该项的 ID。

- `output_index: number`

  响应中输出项的索引。

- `part: object { audio, text, transcript, type }`

  已完成的内容部分。

  - `audio: optional string`

    Base64 编码的音频数据（如果类型为 "audio"）。

  - `text: optional string`

    文本内容（如果类型为 "text"）。

  - `transcript: optional string`

    音频的转录文本（如果类型为 "audio"）。

  - `type: optional "audio" or "text"`

    内容类型（"text"、"audio"）。

    - `"audio"`

    - `"text"`

- `response_id: string`

  响应的 ID。

- `type: "response.content_part.done"`

  事件类型，必须为 `response.content_part.done`.

  - `"response.content_part.done"`

### 示例

```json
{
    "event_id": "event_3940",
    "type": "response.content_part.done",
    "response_id": "resp_001",
    "item_id": "msg_007",
    "output_index": 0,
    "content_index": 0,
    "part": {
        "type": "text",
        "text": "Sure, I can help with that."
    }
}
```

<a id="response.output_text.delta"></a>

## response.output_text.delta

在 "output_text" 内容部分的文本值被更新时返回。

### Schema

Schema name： `RealtimeServerEventResponseTextDelta`

- `content_index: number`

  该项 content 数组中内容部分的索引。

- `delta: string`

  文本增量。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  该项的 ID。

- `output_index: number`

  响应中输出项的索引。

- `response_id: string`

  响应的 ID。

- `type: "response.output_text.delta"`

  事件类型，必须为 `response.output_text.delta`.

  - `"response.output_text.delta"`

### 示例

```json
{
    "event_id": "event_4142",
    "type": "response.output_text.delta",
    "response_id": "resp_001",
    "item_id": "msg_007",
    "output_index": 0,
    "content_index": 0,
    "delta": "Sure, I can h"
}
```

<a id="response.output_text.done"></a>

## response.output_text.done

当 "output_text" 内容部分的文本值流式传输完毕时返回。此外
在 Response 被中断、未完成或取消时也会发出。

### Schema

Schema name： `RealtimeServerEventResponseTextDone`

- `content_index: number`

  该项 content 数组中内容部分的索引。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  该项的 ID。

- `output_index: number`

  响应中输出项的索引。

- `response_id: string`

  响应的 ID。

- `text: string`

  最终的文本内容。

- `type: "response.output_text.done"`

  事件类型，必须为 `response.output_text.done`.

  - `"response.output_text.done"`

### 示例

```json
{
    "event_id": "event_4344",
    "type": "response.output_text.done",
    "response_id": "resp_001",
    "item_id": "msg_007",
    "output_index": 0,
    "content_index": 0,
    "text": "Sure, I can help with that."
}
```

<a id="response.output_audio_transcript.delta"></a>

## response.output_audio_transcript.delta

当音频输出的模型生成转写被更新时返回。

### Schema

Schema name： `RealtimeServerEventResponseAudioTranscriptDelta`

- `content_index: number`

  该项 content 数组中内容部分的索引。

- `delta: string`

  转录文本增量。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  该项的 ID。

- `output_index: number`

  响应中输出项的索引。

- `response_id: string`

  响应的 ID。

- `type: "response.output_audio_transcript.delta"`

  事件类型，必须为 `response.output_audio_transcript.delta`.

  - `"response.output_audio_transcript.delta"`

### 示例

```json
{
    "event_id": "event_4546",
    "type": "response.output_audio_transcript.delta",
    "response_id": "resp_001",
    "item_id": "msg_008",
    "output_index": 0,
    "content_index": 0,
    "delta": "Hello, how can I a"
}
```

<a id="response.output_audio_transcript.done"></a>

## response.output_audio_transcript.done

当模型生成的音频输出转写完成时返回
流式传输。也会在 Response 被中断、未完成或被取
消时发出。

### Schema

Schema name： `RealtimeServerEventResponseAudioTranscriptDone`

- `content_index: number`

  该项 content 数组中内容部分的索引。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  该项的 ID。

- `output_index: number`

  响应中输出项的索引。

- `response_id: string`

  响应的 ID。

- `transcript: string`

  该音频的最终转录文本。

- `type: "response.output_audio_transcript.done"`

  事件类型，必须为 `response.output_audio_transcript.done`.

  - `"response.output_audio_transcript.done"`

### 示例

```json
{
    "event_id": "event_4748",
    "type": "response.output_audio_transcript.done",
    "response_id": "resp_001",
    "item_id": "msg_008",
    "output_index": 0,
    "content_index": 0,
    "transcript": "Hello, how can I assist you today?"
}
```

<a id="response.output_audio.delta"></a>

## response.output_audio.delta

在模型生成的音频更新时返回。

### Schema

Schema name： `RealtimeServerEventResponseAudioDelta`

- `content_index: number`

  该项 content 数组中内容部分的索引。

- `delta: string`

  Base64 编码的音频数据增量。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  该项的 ID。

- `output_index: number`

  响应中输出项的索引。

- `response_id: string`

  响应的 ID。

- `type: "response.output_audio.delta"`

  事件类型，必须为 `response.output_audio.delta`.

  - `"response.output_audio.delta"`

### 示例

```json
{
    "event_id": "event_4950",
    "type": "response.output_audio.delta",
    "response_id": "resp_001",
    "item_id": "msg_008",
    "output_index": 0,
    "content_index": 0,
    "delta": "Base64EncodedAudioDelta"
}
```

<a id="response.output_audio.done"></a>

## response.output_audio.done

当模型生成的音频完成时返回。也会在某个 Response
被中断、未完成或已取消。

### Schema

Schema name： `RealtimeServerEventResponseAudioDone`

- `content_index: number`

  该项 content 数组中内容部分的索引。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  该项的 ID。

- `output_index: number`

  响应中输出项的索引。

- `response_id: string`

  响应的 ID。

- `type: "response.output_audio.done"`

  事件类型，必须为 `response.output_audio.done`.

  - `"response.output_audio.done"`

### 示例

```json
{
    "event_id": "event_5152",
    "type": "response.output_audio.done",
    "response_id": "resp_001",
    "item_id": "msg_008",
    "output_index": 0,
    "content_index": 0
}
```

<a id="response.function_call_arguments.delta"></a>

## response.function_call_arguments.delta

当模型生成的函数调用参数被更新时返回。

### Schema

Schema name： `RealtimeServerEventResponseFunctionCallArgumentsDelta`

- `call_id: string`

  函数调用的 ID。

- `delta: string`

  作为 JSON 字符串的参数增量。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  函数调用项的 ID。

- `output_index: number`

  响应中输出项的索引。

- `response_id: string`

  响应的 ID。

- `type: "response.function_call_arguments.delta"`

  事件类型，必须为 `response.function_call_arguments.delta`.

  - `"response.function_call_arguments.delta"`

### 示例

```json
{
    "event_id": "event_5354",
    "type": "response.function_call_arguments.delta",
    "response_id": "resp_002",
    "item_id": "fc_001",
    "output_index": 0,
    "call_id": "call_001",
    "delta": "{\"location\": \"San\""
}
```

<a id="response.function_call_arguments.done"></a>

## response.function_call_arguments.done

当模型生成的函数调用参数流式传输完成时返回。
在 Response 被中断、未完成或被取消时也会发出。

### Schema

Schema name： `RealtimeServerEventResponseFunctionCallArgumentsDone`

- `arguments: string`

  最终的参数，以 JSON 字符串形式表示。

- `call_id: string`

  函数调用的 ID。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  函数调用项的 ID。

- `name: string`

  被调用的函数的名称。

- `output_index: number`

  响应中输出项的索引。

- `response_id: string`

  响应的 ID。

- `type: "response.function_call_arguments.done"`

  事件类型，必须为 `response.function_call_arguments.done`.

  - `"response.function_call_arguments.done"`

### 示例

```json
{
    "event_id": "event_5556",
    "type": "response.function_call_arguments.done",
    "response_id": "resp_002",
    "item_id": "fc_001",
    "output_index": 0,
    "call_id": "call_001",
    "name": "get_weather",
    "arguments": "{\"location\": \"San Francisco\"}"
}
```

<a id="response.mcp_call_arguments.delta"></a>

## response.mcp_call_arguments.delta

当 MCP 工具调用参数在响应生成过程中被更新时返回。

### Schema

Schema name： `RealtimeServerEventResponseMCPCallArgumentsDelta`

- `delta: string`

  JSON 编码的参数增量。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  MCP 工具调用项的 ID。

- `output_index: number`

  响应中输出项的索引。

- `response_id: string`

  响应的 ID。

- `type: "response.mcp_call_arguments.delta"`

  事件类型，必须为 `response.mcp_call_arguments.delta`.

  - `"response.mcp_call_arguments.delta"`

- `obfuscation: optional string or null`

  如果存在，表示该增量文本经过了混淆处理。

### 示例

```json
{
    "event_id": "event_6201",
    "type": "response.mcp_call_arguments.delta",
    "response_id": "resp_001",
    "item_id": "mcp_call_001",
    "output_index": 0,
    "delta": "{\"partial\":true}"
}
```

<a id="response.mcp_call_arguments.done"></a>

## response.mcp_call_arguments.done

Returned when MCP tool call arguments are finalized during response generation.

### Schema

Schema name： `RealtimeServerEventResponseMCPCallArgumentsDone`

- `arguments: string`

  最终的 JSON 编码参数字符串。

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  MCP 工具调用项的 ID。

- `output_index: number`

  响应中输出项的索引。

- `response_id: string`

  响应的 ID。

- `type: "response.mcp_call_arguments.done"`

  事件类型，必须为 `response.mcp_call_arguments.done`.

  - `"response.mcp_call_arguments.done"`

### 示例

```json
{
    "event_id": "event_6202",
    "type": "response.mcp_call_arguments.done",
    "response_id": "resp_001",
    "item_id": "mcp_call_001",
    "output_index": 0,
    "arguments": "{\"q\":\"docs\"}"
}
```

<a id="response.mcp_call.in_progress"></a>

## response.mcp_call.in_progress

当 MCP 工具调用已开始且正在进行时返回。

### Schema

Schema name： `RealtimeServerEventResponseMCPCallInProgress`

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  MCP 工具调用项的 ID。

- `output_index: number`

  响应中输出项的索引。

- `type: "response.mcp_call.in_progress"`

  事件类型，必须为 `response.mcp_call.in_progress`.

  - `"response.mcp_call.in_progress"`

### 示例

```json
{
    "event_id": "event_6301",
    "type": "response.mcp_call.in_progress",
    "output_index": 0,
    "item_id": "mcp_call_001"
}
```

<a id="response.mcp_call.completed"></a>

## response.mcp_call.completed

当 MCP 工具调用成功完成时返回。

### Schema

Schema name： `RealtimeServerEventResponseMCPCallCompleted`

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  MCP 工具调用项的 ID。

- `output_index: number`

  响应中输出项的索引。

- `type: "response.mcp_call.completed"`

  事件类型，必须为 `response.mcp_call.completed`.

  - `"response.mcp_call.completed"`

### 示例

```json
{
    "event_id": "event_6302",
    "type": "response.mcp_call.completed",
    "output_index": 0,
    "item_id": "mcp_call_001"
}
```

<a id="response.mcp_call.failed"></a>

## response.mcp_call.failed

当 MCP 工具调用失败时返回。

### Schema

Schema name： `RealtimeServerEventResponseMCPCallFailed`

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  MCP 工具调用项的 ID。

- `output_index: number`

  响应中输出项的索引。

- `type: "response.mcp_call.failed"`

  事件类型，必须为 `response.mcp_call.failed`.

  - `"response.mcp_call.failed"`

### 示例

```json
{
    "event_id": "event_6303",
    "type": "response.mcp_call.failed",
    "output_index": 0,
    "item_id": "mcp_call_001"
}
```

<a id="mcp_list_tools.in_progress"></a>

## mcp_list_tools.in_progress

当某个条目正在列出 MCP 工具时返回。

### Schema

Schema name： `RealtimeServerEventMCPListToolsInProgress`

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  MCP list tools 条目的 ID。

- `type: "mcp_list_tools.in_progress"`

  事件类型，必须为 `mcp_list_tools.in_progress`.

  - `"mcp_list_tools.in_progress"`

### 示例

```json
{
    "event_id": "event_6101",
    "type": "mcp_list_tools.in_progress",
    "item_id": "mcp_list_tools_001"
}
```

<a id="mcp_list_tools.completed"></a>

## mcp_list_tools.completed

当某个项目的 MCP 工具列表返回完成时返回。

### Schema

Schema name： `RealtimeServerEventMCPListToolsCompleted`

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  MCP list tools 条目的 ID。

- `type: "mcp_list_tools.completed"`

  事件类型，必须为 `mcp_list_tools.completed`.

  - `"mcp_list_tools.completed"`

### 示例

```json
{
    "event_id": "event_6102",
    "type": "mcp_list_tools.completed",
    "item_id": "mcp_list_tools_001"
}
```

<a id="mcp_list_tools.failed"></a>

## mcp_list_tools.failed

在列出某个项目的 MCP 工具失败时返回。

### Schema

Schema name： `RealtimeServerEventMCPListToolsFailed`

- `event_id: string`

  服务器事件的唯一 ID。

- `item_id: string`

  MCP list tools 条目的 ID。

- `type: "mcp_list_tools.failed"`

  事件类型，必须为 `mcp_list_tools.failed`.

  - `"mcp_list_tools.failed"`

### 示例

```json
{
    "event_id": "event_6103",
    "type": "mcp_list_tools.failed",
    "item_id": "mcp_list_tools_001"
}
```

<a id="rate_limits.updated"></a>

## rate_limits.updated

在 Response 开始时发出，用于指示已更新的速率限制。
当创建 Response 时，会为输出"预留"一部分 tokens
tokens，此处显示的速率限制反映了该预留，
待 Response 完成后会进行相应调整。

### Schema

Schema name： `RealtimeServerEventRateLimitsUpdated`

- `event_id: string`

  服务器事件的唯一 ID。

- `rate_limits: array of object { limit, name, remaining, reset_seconds }`

  速率限制信息列表。

  - `limit: optional number`

    该速率限制允许的最大值。

  - `name: optional "requests" or "tokens"`

    速率限制的名称（`requests`, `tokens`).

    - `"requests"`

    - `"tokens"`

  - `remaining: optional number`

    达到限制前的剩余值。

  - `reset_seconds: optional number`

    速率限制重置前的秒数。

- `type: "rate_limits.updated"`

  事件类型，必须为 `rate_limits.updated`.

  - `"rate_limits.updated"`

### 示例

```json
{
    "event_id": "event_5758",
    "type": "rate_limits.updated",
    "rate_limits": [
        {
            "name": "requests",
            "limit": 1000,
            "remaining": 999,
            "reset_seconds": 60
        },
        {
            "name": "tokens",
            "limit": 50000,
            "remaining": 49950,
            "reset_seconds": 60
        }
    ]
}
```

<a id="conversation.created"></a>

## conversation.created

在会话创建时返回。在会话创建后立即发出。

### Schema

Schema name： `RealtimeServerEventConversationCreated`

- `conversation: object { id, object }`

  会话资源。

  - `id: optional string`

    会话的唯一 ID。

  - `object: optional string`

    对象类型，必须为 `realtime.conversation`.

- `event_id: string`

  服务器事件的唯一 ID。

- `type: "conversation.created"`

  事件类型，必须为 `conversation.created`.

  - `"conversation.created"`

### 示例

```json
{
    "event_id": "event_9101",
    "type": "conversation.created",
    "conversation": {
        "id": "conv_001",
        "object": "realtime.conversation"
    }
}
```

<a id="conversation.item.created"></a>

## conversation.item.created

在对话项被创建时返回。产生此事件的情形有以下几种：
  - 服务器正在生成 Response，如果成功将产出
    一个或两个 Item，其类型为 `message`
    （role `assistant`）或类型为 `function_call`.
  - 输入音频缓冲区已被提交，提交方可以是客户端，也可以是
    服务器（位于 `server_vad` 模式）。服务器将获取输入音频缓冲区中的
    内容，并将其添加到一个新的用户消息 Item 中。
  - 客户端已发送 `conversation.item.create` 事件以添加一个新 Item
    到 Conversation 中。

### Schema

Schema name： `RealtimeServerEventConversationItemCreated`

- `event_id: string`

  服务器事件的唯一 ID。

- `item: ConversationItem`

  Realtime 对话中的单个条目。

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    Realtime 对话中的系统消息可用于向模型提供额外的上下文或指令。这与对话开始时提供的指令提示类似但不同，因为系统消息可以在对话的任何位置添加。对于对话行为的重大更改，请使用 instructions；对于较小的更新（例如“用户现在正在询问另一个主题”），请使用系统消息。

    - `content: array of object { text, type }`

      消息的内容。

      - `text: optional string`

        文本内容。

      - `type: optional "input_text"`

        内容类型。始终为 `input_text` （用于系统消息）。

        - `"input_text"`

    - `role: "system"`

      消息发送者的角色。始终为 `system`.

      - `"system"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

    Realtime 对话中的用户消息条目。

    - `content: array of object { audio, detail, image_url, 3 more }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节（用于 `input_audio`），这些字节将按照会话输入音频类型配置中指定的格式进行解析。如果未指定，则默认为 PCM 16 位 24kHz 单声道。

      - `detail: optional "auto" or "low" or "high"`

        图像的详细程度（用于 `input_image`). `auto` 将默认为 `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64 编码的图像字节（用于 `input_image`）作为数据 URI。例如 `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`。支持的格式为 PNG 和 JPEG。

      - `text: optional string`

        文本内容（针对 `input_text`).

      - `transcript: optional string`

        音频的文字记录（针对 `input_audio`）。该内容不会发送给模型，但会附加到消息条目中以供参考。

      - `type: optional "input_text" or "input_audio" or "input_image"`

        内容类型（`input_text`, `input_audio`，或 `input_image`).

        - `"input_text"`

        - `"input_audio"`

        - `"input_image"`

    - `role: "user"`

      消息发送者的角色。始终为 `user`.

      - `"user"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

    Realtime 对话中的一条助手消息条目。

    - `content: array of object { audio, text, transcript, type }`

      消息的内容。

      - `audio: optional string`

        Base64 编码的音频字节，会按照会话输出音频类型配置中指定的格式进行解析。如果未指定，默认采用 PCM 16 位 24kHz 单声道。

      - `text: optional string`

        文本内容。

      - `transcript: optional string`

        音频内容的文字记录，当输出类型为 `audio`.

      - `type: optional "output_text" or "output_audio"`

        内容类型， `output_text` 或 `output_audio` 取决于会话的 `output_modalities` 配置。

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      消息发送者的角色。始终为 `assistant`.

      - `"assistant"`

    - `type: "message"`

      条目的类型。始终为 `message`.

      - `"message"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    Realtime 对话中的一条函数调用条目。

    - `arguments: string`

      函数调用的参数。这是一个 JSON 编码的字符串，表示传递给函数的参数，例如 `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      被调用函数的名称。

    - `type: "function_call"`

      条目的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `call_id: optional string`

      函数调用的 ID。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    Realtime 对话中的一条函数调用输出条目。

    - `call_id: string`

      此输出对应的函数调用的 ID。

    - `output: string`

      函数调用的输出，可以是任意文本，包含任意信息，也可以为空。

    - `type: "function_call_output"`

      条目的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      条目的唯一 ID。这可以由客户端提供，也可以由服务器生成。

    - `object: optional "realtime.item"`

      所返回的 API 对象的标识符 —— 始终为 `realtime.item`。创建新条目时可选。

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      条目的状态。对对话没有影响。

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    响应 MCP 审批请求的 Realtime 条目。

    - `id: string`

      审批响应的唯一 ID。

    - `approval_request_id: string`

      正在回复的审批请求的 ID。

    - `approve: boolean`

      请求是否已批准。

    - `type: "mcp_approval_response"`

      条目的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      决策的可选原因。

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    一个 Realtime 条目，用于列出 MCP 服务器上可用的工具。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述该工具输入的 JSON schema。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        关于该工具的附加注解。

      - `description: optional string or null`

        该工具的描述。

    - `type: "mcp_list_tools"`

      条目的类型。始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      该列表的唯一 ID。

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    一个 Realtime 条目，表示对 MCP 服务器上某个工具的调用。

    - `id: string`

      该工具调用的唯一 ID。

    - `arguments: string`

      传递给该工具的参数的 JSON 字符串。

    - `name: string`

      已运行工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      条目的类型。始终为 `mcp_call`.

      - `"mcp_call"`

    - `approval_request_id: optional string or null`

      关联的批准请求的 ID（如果有）。

    - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

      工具调用的错误（如果有）。

      - `RealtimeMcpProtocolError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "protocol_error"`

          - `"protocol_error"`

      - `RealtimeMcpToolExecutionError object { message, type }`

        - `message: string`

        - `type: "tool_execution_error"`

          - `"tool_execution_error"`

      - `RealtimeMcphttpError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "http_error"`

          - `"http_error"`

    - `output: optional string or null`

      工具调用的输出。

  - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

    一个 Realtime 条目，请求人工批准一次工具调用。

    - `id: string`

      该批准请求的唯一 ID。

    - `arguments: string`

      该工具的参数，为 JSON 字符串。

    - `name: string`

      要运行的工具名称。

    - `server_label: string`

      发起请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      条目的类型。始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

- `type: "conversation.item.created"`

  事件类型，必须为 `conversation.item.created`.

  - `"conversation.item.created"`

- `previous_item_id: optional string or null`

  Conversation 上下文中前一个 Item 的 ID，可帮助客户端
  理解对话顺序。可以为 `null` ，如果该
  Item 没有前驱项。

### 示例

```json
{
    "event_id": "event_1920",
    "type": "conversation.item.created",
    "previous_item_id": "msg_002",
    "item": {
        "id": "msg_003",
        "object": "realtime.item",
        "type": "message",
        "status": "completed",
        "role": "user",
        "content": []
    }
}
```
