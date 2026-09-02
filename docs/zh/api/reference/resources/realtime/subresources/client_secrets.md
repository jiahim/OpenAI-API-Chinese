# 客户端密钥

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

## 创建客户端密钥

**post** `/realtime/client_secrets`

创建一个 Realtime 客户端密钥，并附带会话配置。

客户端密钥是短时令牌，可以传递给客户端应用，
例如 Web 前端或移动端客户端，授予其访问 Realtime API 的权限，且不会泄露你的主 API 密钥。
你可以为每个客户端密钥配置自定义 TTL。

你也可以将会话配置选项附加到客户端密钥，这些选项将
应用于使用该客户端密钥创建的所有会话，但这些选项也会被
客户端连接覆盖。

[了解如何通过 WebRTC 使用客户端密钥进行身份验证](/docs/guides/realtime-webrtc).

返回创建的客户端密钥以及生效后的会话对象。客户端密钥是一个字符串，格式类似 `ek_1234`.

### 请求体参数

- `expires_after: optional object { anchor, seconds }`

  客户端密钥过期的配置。“过期”是指之后的时间
  客户端密钥将不再有效，无法用于创建会话。已开始的会话本身可能会
  在该时间之后继续运行。密钥在过期前可用于创建多个会话
  直到过期。

  - `anchor: optional "created_at"`

    客户端密钥过期的基准点，即 `seconds` 将添加到客户端密钥的 `created_at` 时间以生成过期时间戳。目前仅支持 `created_at` 。

    - `"created_at"`

  - `seconds: optional number`

    从基准点到过期时间的秒数。选择一个介于 `10` 和 `7200` （2 小时）之间的值。如果未指定，默认值为 600 秒（10 分钟）。

- `session: optional RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  用于客户端密钥的会话配置。选择实时
  会话或转写会话。

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    实时会话对象配置。

    - `type: "realtime"`

      要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

      - `"realtime"`

    - `audio: optional RealtimeAudioConfig`

      输入和输出音频的配置。

      - `input: optional RealtimeAudioConfigInput`

        - `format: optional RealtimeAudioFormats`

          输入音频的格式。

          - `PCMAudio object { rate, type }`

            PCM 音频格式。仅支持 24kHz 采样率。

            - `rate: optional 24000`

              音频的采样率。始终为 `24000`.

              - `24000`

            - `type: optional "audio/pcm"`

              音频格式。始终 `audio/pcm`.

              - `"audio/pcm"`

          - `PCMUAudio object { type }`

            G.711 μ-law 格式。

            - `type: optional "audio/pcmu"`

              音频格式。始终 `audio/pcmu`.

              - `"audio/pcmu"`

          - `PCMAAudio object { type }`

            G.711 A-law 格式。

            - `type: optional "audio/pcma"`

              音频格式。始终 `audio/pcma`.

              - `"audio/pcma"`

        - `noise_reduction: optional object { type }`

          输入音频降噪配置。可设置为 `null` 以关闭。
          降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行处理。
          对音频进行过滤可以通过改善对输入音频的感知，从而提高 VAD 和打断检测的准确率（减少误报），并提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本电脑或会议室麦克风等远场麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          输入音频转写配置，默认为关闭状态，可设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应将其视为输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写所用的语言和提示词，这些为转写服务提供了额外的指引。

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            控制模型在输出转写文本之前等待的时间。
            较高的值可以提高转写准确率，但会增加延迟。
            仅在 `gpt-realtime-whisper` 在 GA Realtime 会话中受支持。

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            用于引导输入音频转写的词语或短语。支持 `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `language: optional string`

            输入音频的语言。在
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) （例如。 `en`）格式
            可提升准确率并降低延迟。

          - `languages: optional array of string`

            输入音频可能的语言，格式为 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式。支持模型： `gpt-transcribe` 和 `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 并附带说话人标签的说话人分离时使用。

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值有 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`。在需要 `gpt-4o-transcribe-diarize` 并附带说话人标签的说话人分离时使用。

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            用于引导模型风格或延续上一段音频的可选文本
            片段。
            对于 `whisper-1`，该 [prompt 是一个关键词列表](/docs/guides/speech-to-text#prompting).
            对于 `gpt-4o-transcribe` 模型（不包括 `gpt-4o-transcribe-diarize`），prompt 为一段自由文本，例如“expect words related to technology”。
            以下模型不支持 prompt： `gpt-realtime-whisper` 在 GA Realtime 会话中受支持。

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭该功能，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型会基于音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更先进，它会结合 VAD 使用一个轮次判断模型来语义层面估计用户是否已说完，然后基于该概率动态设置一个超时时间。例如，如果用户的语音以“嗯……”之类的语气词收尾，模型会给出一个较低的轮次结束概率，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` transcription 会话中，turn detection 必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              turn detection 类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已经正在响应时可能会无法创建响应。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选超时时间，到达后将自动触发一次响应。
              这在用户长时间停顿出乎意料的情况下很有用，例如电话
              通话。模型会根据当前上下文有效地提示用户继续对话。
              于当前上下文。

              该超时值会在最后一次模型响应的音频播放结束后应用，
              即它被设置为 `response.done` time plus audio playback duration.

              一个 `input_audio_buffer.timeout_triggered` event (plus events
              associated with the Response) will be emitted when the timeout is reached.
              Idle timeout is currently only supported for `server_vad` mode.

            - `interrupt_response: optional boolean`

              Whether or not to automatically interrupt (cancel) any ongoing response with output to the default
              conversation (i.e. `conversation` of `auto`) when a VAD start event occurs. If `true` then the response will be cancelled, otherwise it will continue until complete.

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              Used only for `server_vad` mode. Amount of audio to include before the VAD detected speech (in
              milliseconds). Defaults to 300ms.

            - `silence_duration_ms: optional number`

              Used only for `server_vad` mode. Duration of silence to detect speech stop (in milliseconds). Defaults
              to 500ms. With shorter values the model will respond more quickly,
              but may jump in on short pauses from the user.

            - `threshold: optional number`

              Used only for `server_vad` mode. Activation threshold for VAD (0.0 to 1.0), this defaults to 0.5. A
              higher threshold will require louder audio to activate the model, and
              thus might perform better in noisy environments.

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，通过模型判断用户何时已结束发言。

            - `type: "semantic_vad"`

              turn detection 类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              Used only for `semantic_vad` 模式。模型响应的积极程度。 `low` 会等待更长时间以便用户继续发言， `high` 会更快地作出响应。 `auto` 为默认值，相当于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当存在输出到默认
              conversation (i.e. `conversation` of `auto`) 时，是否自动中断任何正在进行的响应。

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型口语化响应的速度，相对于原始速度的倍数。
          1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

          此参数是对生成后音频的后处理调整，也
          可以通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

          模型用于响应的声音。支持的内置声音包括
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`，以及 `cedar`。你也可以使用
          一个 `id`，例如 `{ "id": "voice_1234" }`。声音无法更改
          在会话期间，一旦模型至少响应过一次音频。
          我们建议 `marin` 和 `cedar` 以获得最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

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

          - `ID object { id }`

            自定义语音参考。

            - `id: string`

              自定义语音 ID，例如 `voice_1234`.

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要包含在服务端输出中的额外字段。

      `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      预先添加到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型关于响应内容和格式（例如"极其简洁"、"表现得友好"、"以下是良好响应的示例"），以及关于音频行为（例如"快速讲话"、"在声音中注入情感"、"经常笑"）。指令不保证被模型遵循，但它们为模型提供了关于期望行为的指导。

      请注意，服务端会设置默认指令，如果未设置此字段将使用默认指令，并且这些指令在 `session.created` 事件中于会话开始时可见。

    - `max_output_tokens: optional number or "inf"`

      单个助手响应的最大输出令牌数，
      包括工具调用。提供介于 1 和 4096 之间的整数以
      限制输出令牌，或 `inf` 以获取给定模型的可用
      最大令牌数。默认为 `inf`.

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

      模型可以响应的模态集合。默认为 `["audio"]`,表示
      模型将响应音频加文字转录。 `["text"]` 可用于使
      the model respond with text only. It is not possible to request both `text` 和 `audio` at the same time.

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      Whether the model may call multiple tools in parallel. Only supported by
      reasoning Realtime models such as `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      Reference to a prompt template and its variables.
      [Learn more](/docs/guides/text?api-mode=responses#reusable-prompts).

      - `id: string`

        The unique identifier of the prompt template to use.

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        Optional map of values to substitute in for variables in your
        prompt. The substitution values can either be strings, or other
        Response input types like images or files.

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          A text input to the model.

          - `text: string`

            The text input to the model.

          - `type: "input_text"`

            The type of the input item. Always `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

            - `mode: "explicit"`

              The breakpoint mode. Always `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          An image input to the model. Learn about [image inputs](/docs/guides/vision).

          - `detail: ImageDetail`

            The detail level of the image to be sent to the model. One of `high`, `low`, `auto`, or `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            The type of the input item. Always `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件 ID。

          - `image_url: optional string or null`

            发送给模型的图片 URL。可以是完整的 URL，也可以是 base64 编码的图片数据 URL。

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

            - `mode: "explicit"`

              The breakpoint mode. Always `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          模型的输入文件。

          - `type: "input_file"`

            The type of the input item. Always `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 使用量。使用 `low` 可使用较低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            发送给模型的文件内容。

          - `file_id: optional string or null`

            发送给模型的文件 ID。

          - `file_url: optional string`

            要发送到模型的文件的 URL。

          - `filename: optional string`

            要发送到模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

            - `mode: "explicit"`

              The breakpoint mode. Always `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        可选的提示模板版本。

    - `reasoning: optional RealtimeReasoning`

      面向支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如）的推理力度
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional RealtimeToolChoiceConfig`

      模型如何选择工具。提供一个字符串模式，或强制使用特定的
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（如果有的话）。

        `none` 表示模型将不调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或
        更多工具。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可强制模型调用指定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

        - `server_label: string`

          要使用的 MCP 服务器的标签。

        - `type: "mcp"`

          对于 MCP 工具，类型始终为 `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          要在服务器上调用的工具名称。

    - `tools: optional RealtimeToolsConfig`

      模型可用的工具。

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          函数的说明，包括何时以及如何调用的指导，
          以及调用时向用户说明哪些内容的指导
          （如有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          函数的参数，采用 JSON Schema 格式。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程模型上下文协议 (MCP) 服务器让模型访问额外的工具。
        （了解有关 MCP 的更多信息。 [了解有关 MCP 的更多信息](/docs/guides/tools-remote-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中标识它。

        - `type: "mcp"`

          MCP 工具的类型。始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

          允许使用的工具名称列表或筛选器对象。

          - `McpAllowedTools = array of string`

            允许使用的工具名称字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许使用哪些工具的筛选器对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果某个
              MCP 服务器已 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将与此筛选器匹配。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可与远程 MCP 服务器配合使用的 OAuth 访问令牌，可用于
          自定义 MCP 服务器 URL 或服务连接器。你的应用
          必须处理 OAuth 授权流程，并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供其中
          `server_url`, `connector_id`, or `tunnel_id` 之一。详细了解
          服务连接器 [请参阅此处](/docs/guides/tools-remote-mcp#connectors).

          目前支持 `connector_id` 的值为：

          - Dropbox： `connector_dropbox`
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

          此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`,或与工具关联的筛选器对象
            这些工具需要审批。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的筛选器对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器已 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将与此筛选器匹配。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的筛选器对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器已 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将与此筛选器匹配。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值为 `always` 或
            `never`。当设置为 `always`，时,所有工具都需要审批。当设置为
            设置为 `never`，时,所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。需提供以下之一 `server_url`, `connector_id`, or
          `tunnel_id` 。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一
          `server_url`, `connector_id`, or `tunnel_id` 。

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦为会话启用了 追踪，便无法再修改该配置。
      追踪。

      `auto` 将使用默认值创建一个会话 追踪，包括
      工作流 名称、group id 和元数据。

      - `Auto = "auto"`

        启用 追踪 并为 追踪 配置选项设置默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        对 追踪 的细粒度配置。

        - `group_id: optional string`

          附加到此 追踪 的 group id，用于在追踪仪表板中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
          筛选。

        - `workflow_name: optional string`

          附加到此 追踪 的 工作流 名称。它用于在追踪仪表板中
          为该 追踪 命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）将不会包含在模型的上下文中。拥有 32k 上下文、最大输出 token 为 4,096 的模型，在发生截断之前，其上下文中最多只能包含 28,224 个 token。

      客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是一种有效控制 token 使用量和成本的方式。

      截断会减少下一轮中缓存的 token 数量（破坏缓存），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多占最大上下文大小一定比例的消息，从而减少后续截断的需要，进而提升缓存命中率。

      可以完全禁用截断，这意味着服务端永远不会进行截断，但如果对话超出模型的输入 token 上限，将改为返回错误。

      - `"auto" or "disabled"`

        会话所使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超出输入 token 上限时报错。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        在对话超出输入 token 上限后，保留其中一部分会话 token。这可以让你将截断分摊到多轮对话中，有助于改善缓存 token 的使用率。

        - `retention_ratio: number`

          在对话超出输入 token 上限时，要保留的指令后会话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时，将该值设置为 `0.8` 意味着会丢弃消息，直到使用到最大允许 token 的 80%。这有助于降低截断发生频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。如果未提供，将使用模型的默认 token 上限。

          - `post_instructions: optional number`

            指令之后（其中包括工具定义）会话所允许的最大 token 数。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 token 时就会发生截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

    实时转录会话对象配置。

    - `type: "transcription"`

      要创建的会话类型。对于 Realtime API，始终为 `transcription` 用于转录会话。

      - `"transcription"`

    - `audio: optional RealtimeTranscriptionSessionAudio`

      输入和输出音频的配置。

      - `input: optional RealtimeTranscriptionSessionAudioInput`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪配置。可设置为 `null` 以关闭。
          降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行处理。
          对音频进行过滤可以通过改善对输入音频的感知，从而提高 VAD 和打断检测的准确率（减少误报），并提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本电脑或会议室麦克风等远场麦克风。

        - `transcription: optional AudioTranscription`

          输入音频转写配置，默认为关闭状态，可设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应将其视为输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写所用的语言和提示词，这些为转写服务提供了额外的指引。

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭该功能，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型会基于音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更先进，它会结合 VAD 使用一个轮次判断模型来语义层面估计用户是否已说完，然后基于该概率动态设置一个超时时间。例如，如果用户的语音以“嗯……”之类的语气词收尾，模型会给出一个较低的轮次结束概率，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` transcription 会话中，turn detection 必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              turn detection 类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已经正在响应时可能会无法创建响应。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选超时时间，到达后将自动触发一次响应。
              这在用户长时间停顿出乎意料的情况下很有用，例如电话
              通话。模型会根据当前上下文有效地提示用户继续对话。
              于当前上下文。

              该超时值会在最后一次模型响应的音频播放结束后应用，
              即它被设置为 `response.done` time plus audio playback duration.

              一个 `input_audio_buffer.timeout_triggered` event (plus events
              associated with the Response) will be emitted when the timeout is reached.
              Idle timeout is currently only supported for `server_vad` mode.

            - `interrupt_response: optional boolean`

              Whether or not to automatically interrupt (cancel) any ongoing response with output to the default
              conversation (i.e. `conversation` of `auto`) when a VAD start event occurs. If `true` then the response will be cancelled, otherwise it will continue until complete.

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              Used only for `server_vad` mode. Amount of audio to include before the VAD detected speech (in
              milliseconds). Defaults to 300ms.

            - `silence_duration_ms: optional number`

              Used only for `server_vad` mode. Duration of silence to detect speech stop (in milliseconds). Defaults
              to 500ms. With shorter values the model will respond more quickly,
              but may jump in on short pauses from the user.

            - `threshold: optional number`

              Used only for `server_vad` mode. Activation threshold for VAD (0.0 to 1.0), this defaults to 0.5. A
              higher threshold will require louder audio to activate the model, and
              thus might perform better in noisy environments.

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，通过模型判断用户何时已结束发言。

            - `type: "semantic_vad"`

              turn detection 类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              Used only for `semantic_vad` 模式。模型响应的积极程度。 `low` 会等待更长时间以便用户继续发言， `high` 会更快地作出响应。 `auto` 为默认值，相当于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当存在输出到默认
              conversation (i.e. `conversation` of `auto`) 时，是否自动中断任何正在进行的响应。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要包含在服务端输出中的额外字段。

      `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

### Returns

- `expires_at: number`

  客户端密钥的过期时间戳，以自纪元起的秒数表示。

- `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

  实时会话或转录会话的会话配置。

  - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

    Realtime 会话配置对象。

    - `id: string`

      会话的唯一标识符，类似于 `sess_1234567890abcdef`.

    - `object: "realtime.session"`

      对象类型。始终为 `realtime.session`.

      - `"realtime.session"`

    - `type: "realtime"`

      要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

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

              音频格式。始终 `audio/pcm`.

              - `"audio/pcm"`

          - `PCMUAudio object { type }`

            G.711 μ-law 格式。

            - `type: optional "audio/pcmu"`

              音频格式。始终 `audio/pcmu`.

              - `"audio/pcmu"`

          - `PCMAAudio object { type }`

            G.711 A-law 格式。

            - `type: optional "audio/pcma"`

              音频格式。始终 `audio/pcma`.

              - `"audio/pcma"`

        - `noise_reduction: optional object { type }`

          输入音频降噪配置。可设置为 `null` 以关闭。
          降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行处理。
          对音频进行过滤可以通过改善对输入音频的感知，从而提高 VAD 和打断检测的准确率（减少误报），并提升模型表现。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本电脑或会议室麦克风等远场麦克风。

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional object { language, languages, model, prompt }`

          输入音频转写配置，默认为关闭状态，可设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应将其视为输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写所用的语言和提示词，这些为转写服务提供了额外的指引。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可用输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            为输入音频转录配置的提示词（如果存在）。

        - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

          轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭该功能，此时客户端必须手动触发模型响应。

          Server VAD 意味着模型会基于音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

          Semantic VAD 更先进，它会结合 VAD 使用一个轮次判断模型来语义层面估计用户是否已说完，然后基于该概率动态设置一个超时时间。例如，如果用户的语音以“嗯……”之类的语气词收尾，模型会给出一个较低的轮次结束概率，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

          对于 `gpt-realtime-whisper` transcription 会话中，turn detection 必须
          设置为 `null`；不支持 VAD。

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

            - `type: "server_vad"`

              turn detection 类型， `server_vad` 以开启简单的 Server VAD。

              - `"server_vad"`

            - `create_response: optional boolean`

              是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已经正在响应时可能会无法创建响应。

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `idle_timeout_ms: optional number or null`

              可选超时时间，到达后将自动触发一次响应。
              这在用户长时间停顿出乎意料的情况下很有用，例如电话
              通话。模型会根据当前上下文有效地提示用户继续对话。
              于当前上下文。

              该超时值会在最后一次模型响应的音频播放结束后应用，
              即它被设置为 `response.done` time plus audio playback duration.

              一个 `input_audio_buffer.timeout_triggered` event (plus events
              associated with the Response) will be emitted when the timeout is reached.
              Idle timeout is currently only supported for `server_vad` mode.

            - `interrupt_response: optional boolean`

              Whether or not to automatically interrupt (cancel) any ongoing response with output to the default
              conversation (i.e. `conversation` of `auto`) when a VAD start event occurs. If `true` then the response will be cancelled, otherwise it will continue until complete.

              如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

            - `prefix_padding_ms: optional number`

              Used only for `server_vad` mode. Amount of audio to include before the VAD detected speech (in
              milliseconds). Defaults to 300ms.

            - `silence_duration_ms: optional number`

              Used only for `server_vad` mode. Duration of silence to detect speech stop (in milliseconds). Defaults
              to 500ms. With shorter values the model will respond more quickly,
              but may jump in on short pauses from the user.

            - `threshold: optional number`

              Used only for `server_vad` mode. Activation threshold for VAD (0.0 to 1.0), this defaults to 0.5. A
              higher threshold will require louder audio to activate the model, and
              thus might perform better in noisy environments.

          - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

            服务端语义轮次检测，通过模型判断用户何时已结束发言。

            - `type: "semantic_vad"`

              turn detection 类型， `semantic_vad` 以开启 Semantic VAD。

              - `"semantic_vad"`

            - `create_response: optional boolean`

              当 VAD 停止事件发生时，是否自动生成响应。

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              Used only for `semantic_vad` 模式。模型响应的积极程度。 `low` 会等待更长时间以便用户继续发言， `high` 会更快地作出响应。 `auto` 为默认值，相当于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              当存在输出到默认
              conversation (i.e. `conversation` of `auto`) 时，是否自动中断任何正在进行的响应。

      - `output: optional object { format, speed, voice }`

        - `format: optional RealtimeAudioFormats`

          输出音频的格式。

        - `speed: optional number`

          模型口语化响应的速度，相对于原始速度的倍数。
          1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

          此参数是对生成后音频的后处理调整，也
          可以通过提示让模型说得更快或更慢。

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

          模型用于回应的声音。一旦模型已经以音频回应过至少一次，会话期间就无法再更改声音。当前
          会话中的声音选项包括
          声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
          `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
          最佳质量。

          - `string`

          - `"alloy" or "ash" or "ballad" or 7 more`

            模型用于回应的声音。一旦模型已经以音频回应过至少一次，会话期间就无法再更改声音。当前
            会话中的声音选项包括
            声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

      要包含在服务端输出中的额外字段。

      `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      预先添加到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型关于响应内容和格式（例如"极其简洁"、"表现得友好"、"以下是良好响应的示例"），以及关于音频行为（例如"快速讲话"、"在声音中注入情感"、"经常笑"）。指令不保证被模型遵循，但它们为模型提供了关于期望行为的指导。

      请注意，服务端会设置默认指令，如果未设置此字段将使用默认指令，并且这些指令在 `session.created` 事件中于会话开始时可见。

    - `max_output_tokens: optional number or "inf"`

      单个助手响应的最大输出令牌数，
      包括工具调用。提供介于 1 和 4096 之间的整数以
      限制输出令牌，或 `inf` 以获取给定模型的可用
      最大令牌数。默认为 `inf`.

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

      模型可以响应的模态集合。默认为 `["audio"]`,表示
      模型将响应音频加文字转录。 `["text"]` 可用于使
      the model respond with text only. It is not possible to request both `text` 和 `audio` at the same time.

      - `"text"`

      - `"audio"`

    - `prompt: optional ResponsePrompt or null`

      Reference to a prompt template and its variables.
      [Learn more](/docs/guides/text?api-mode=responses#reusable-prompts).

      - `id: string`

        The unique identifier of the prompt template to use.

      - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

        Optional map of values to substitute in for variables in your
        prompt. The substitution values can either be strings, or other
        Response input types like images or files.

        - `string`

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          A text input to the model.

          - `text: string`

            The text input to the model.

          - `type: "input_text"`

            The type of the input item. Always `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

            - `mode: "explicit"`

              The breakpoint mode. Always `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          An image input to the model. Learn about [image inputs](/docs/guides/vision).

          - `detail: ImageDetail`

            The detail level of the image to be sent to the model. One of `high`, `low`, `auto`, or `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            The type of the input item. Always `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件 ID。

          - `image_url: optional string or null`

            发送给模型的图片 URL。可以是完整的 URL，也可以是 base64 编码的图片数据 URL。

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

            - `mode: "explicit"`

              The breakpoint mode. Always `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          模型的输入文件。

          - `type: "input_file"`

            The type of the input item. Always `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 使用量。使用 `low` 可使用较低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            发送给模型的文件内容。

          - `file_id: optional string or null`

            发送给模型的文件 ID。

          - `file_url: optional string`

            要发送到模型的文件的 URL。

          - `filename: optional string`

            要发送到模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

            - `mode: "explicit"`

              The breakpoint mode. Always `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        可选的提示模板版本。

    - `reasoning: optional RealtimeReasoning`

      面向支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        限制支持推理的 Realtime 模型（例如）的推理力度
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

      模型如何选择工具。提供一个字符串模式，或强制使用特定的
      function/MCP 工具。

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        控制模型调用哪个工具（如果有的话）。

        `none` 表示模型将不调用任何工具，而是生成一条消息。

        `auto` 表示模型可以在生成消息或调用一个或
        更多工具。

        `required` 表示模型必须调用一个或多个工具。

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        使用此选项可强制模型调用指定的函数。

        - `name: string`

          要调用的函数名称。

        - `type: "function"`

          对于函数调用，类型始终为 `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

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

          函数的说明，包括何时以及如何调用的指导，
          以及调用时向用户说明哪些内容的指导
          （如有）。

        - `name: optional string`

          函数的名称。

        - `parameters: optional unknown`

          函数的参数，采用 JSON Schema 格式。

        - `type: optional "function"`

          工具的类型，即 `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        通过远程模型上下文协议 (MCP) 服务器让模型访问额外的工具。
        （了解有关 MCP 的更多信息。 [了解有关 MCP 的更多信息](/docs/guides/tools-remote-mcp).

        - `server_label: string`

          此 MCP 服务器的标签，用于在工具调用中标识它。

        - `type: "mcp"`

          MCP 工具的类型。始终为 `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

          允许使用的工具名称列表或筛选器对象。

          - `McpAllowedTools = array of string`

            允许使用的工具名称字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许使用哪些工具的筛选器对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果某个
              MCP 服务器已 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将与此筛选器匹配。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可与远程 MCP 服务器配合使用的 OAuth 访问令牌，可用于
          自定义 MCP 服务器 URL 或服务连接器。你的应用
          必须处理 OAuth 授权流程，并在此处提供令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供其中
          `server_url`, `connector_id`, or `tunnel_id` 之一。详细了解
          服务连接器 [请参阅此处](/docs/guides/tools-remote-mcp#connectors).

          目前支持 `connector_id` 的值为：

          - Dropbox： `connector_dropbox`
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

          此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器中哪些工具需要审批。可以是
            `always`, `never`,或与工具关联的筛选器对象
            这些工具需要审批。

            - `always: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的筛选器对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器已 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将与此筛选器匹配。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许使用哪些工具的筛选器对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器已 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将与此筛选器匹配。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定统一的审批策略。可选值为 `always` 或
            `never`。当设置为 `always`，时,所有工具都需要审批。当设置为
            设置为 `never`，时,所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。需提供以下之一 `server_url`, `connector_id`, or
          `tunnel_id` 。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一
          `server_url`, `connector_id`, or `tunnel_id` 。

    - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

      Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦为会话启用了 追踪，便无法再修改该配置。
      追踪。

      `auto` 将使用默认值创建一个会话 追踪，包括
      工作流 名称、group id 和元数据。

      - `Auto = "auto"`

        启用 追踪 并为 追踪 配置选项设置默认值。始终 `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        对 追踪 的细粒度配置。

        - `group_id: optional string`

          附加到此 追踪 的 group id，用于在追踪仪表板中进行筛选和
          分组。

        - `metadata: optional unknown`

          附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
          筛选。

        - `workflow_name: optional string`

          附加到此 追踪 的 工作流 名称。它用于在追踪仪表板中
          为该 追踪 命名。

    - `truncation: optional RealtimeTruncation`

      当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）将不会包含在模型的上下文中。拥有 32k 上下文、最大输出 token 为 4,096 的模型，在发生截断之前，其上下文中最多只能包含 28,224 个 token。

      客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是一种有效控制 token 使用量和成本的方式。

      截断会减少下一轮中缓存的 token 数量（破坏缓存），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多占最大上下文大小一定比例的消息，从而减少后续截断的需要，进而提升缓存命中率。

      可以完全禁用截断，这意味着服务端永远不会进行截断，但如果对话超出模型的输入 token 上限，将改为返回错误。

      - `"auto" or "disabled"`

        会话所使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超出输入 token 上限时报错。

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        在对话超出输入 token 上限后，保留其中一部分会话 token。这可以让你将截断分摊到多轮对话中，有助于改善缓存 token 的使用率。

        - `retention_ratio: number`

          在对话超出输入 token 上限时，要保留的指令后会话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时，将该值设置为 `0.8` 意味着会丢弃消息，直到使用到最大允许 token 的 80%。这有助于降低截断发生频率并提升缓存命中率。

        - `type: "retention_ratio"`

          使用保留比例截断。

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          此截断策略的可选自定义 token 上限。如果未提供，将使用模型的默认 token 上限。

          - `post_instructions: optional number`

            指令之后（其中包括工具定义）会话所允许的最大 token 数。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 token 时就会发生截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

  - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

    Realtime 转录会话配置对象。

    - `id: string`

      会话的唯一标识符，类似于 `sess_1234567890abcdef`.

    - `object: string`

      对象类型。始终为 `realtime.transcription_session`.

    - `type: "transcription"`

      会话类型。始终为 `transcription` 用于转录会话。

      - `"transcription"`

    - `audio: optional object { input }`

      会话的输入音频配置。

      - `input: optional object { format, noise_reduction, transcription, turn_detection }`

        - `format: optional RealtimeAudioFormats`

          PCM 音频格式。仅支持 24kHz 采样率。

        - `noise_reduction: optional object { type }`

          输入音频降噪的配置。

          - `type: optional NoiseReductionType`

            降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本电脑或会议室麦克风等远场麦克风。

        - `transcription: optional object { language, languages, model, prompt }`

          转录模型的配置。

          - `language: optional string`

            输入音频的语言。

          - `languages: optional array of string`

            为转录配置的可用输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            为输入音频转录配置的提示词（如果存在）。

        - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

          轮次检测的配置。可设置为 `null` 以关闭。服务端
          VAD 意味着模型将根据
          音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`,这必须是 `null`；不支持 VAD。

          - `prefix_padding_ms: optional number`

            VAD 检测到语音之前要包含的音频量（以
            milliseconds). Defaults to 300ms.

          - `silence_duration_ms: optional number`

            用于检测语音停止的静默时长（以毫秒为单位）。默认为
            to 500ms. With shorter values the model will respond more quickly,
            but may jump in on short pauses from the user.

          - `threshold: optional number`

            VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较高的
            higher threshold will require louder audio to activate the model, and
            thus might perform better in noisy environments.

          - `type: optional string`

            轮次检测类型，仅 `server_vad` 。

    - `expires_at: optional number`

      会话的过期时间戳，以自纪元起的秒数表示。

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      要包含在服务端输出中的额外字段。

      - `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

      - `"item.input_audio_transcription.logprobs"`

- `value: string`

  生成的客户端密钥值。

### 示例

```http
curl https://api.openai.com/v1/realtime/client_secrets \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{}'
```

#### 响应

```json
{
  "expires_at": 0,
  "session": {
    "id": "id",
    "object": "realtime.session",
    "type": "realtime",
    "audio": {
      "input": {
        "format": {
          "rate": 24000,
          "type": "audio/pcm"
        },
        "noise_reduction": {
          "type": "near_field"
        },
        "transcription": {
          "language": "language",
          "languages": [
            "string"
          ],
          "model": "whisper-1",
          "prompt": "prompt"
        },
        "turn_detection": {
          "type": "server_vad",
          "create_response": true,
          "idle_timeout_ms": 5000,
          "interrupt_response": true,
          "prefix_padding_ms": 0,
          "silence_duration_ms": 0,
          "threshold": 0
        }
      },
      "output": {
        "format": {
          "rate": 24000,
          "type": "audio/pcm"
        },
        "speed": 0.25,
        "voice": "ash"
      }
    },
    "expires_at": 0,
    "include": [
      "item.input_audio_transcription.logprobs"
    ],
    "instructions": "instructions",
    "max_output_tokens": "inf",
    "model": "gpt-realtime",
    "output_modalities": [
      "text"
    ],
    "prompt": {
      "id": "id",
      "variables": {
        "foo": "string"
      },
      "version": "version"
    },
    "reasoning": {
      "effort": "minimal"
    },
    "tool_choice": "none",
    "tools": [
      {
        "description": "description",
        "name": "name",
        "parameters": {},
        "type": "function"
      }
    ],
    "tracing": "auto",
    "truncation": "auto"
  },
  "value": "value"
}
```

### 示例

```http
curl -X POST https://api.openai.com/v1/realtime/client_secrets \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "expires_after": {
      "anchor": "created_at",
      "seconds": 600
    },
    "session": {
      "type": "realtime",
      "model": "gpt-realtime",
      "instructions": "You are a friendly assistant."
    }
  }'
```

#### 响应

```json
{
  "value": "ek_68af296e8e408191a1120ab6383263c2",
  "expires_at": 1756310470,
  "session": {
    "type": "realtime",
    "object": "realtime.session",
    "id": "sess_C9CiUVUzUzYIssh3ELY1d",
    "model": "gpt-realtime",
    "output_modalities": [
      "audio"
    ],
    "instructions": "You are a friendly assistant.",
    "tools": [],
    "tool_choice": "auto",
    "max_output_tokens": "inf",
    "tracing": null,
    "truncation": "auto",
    "prompt": null,
    "expires_at": 0,
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
        }
      },
      "output": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "voice": "alloy",
        "speed": 1.0
      }
    },
    "include": null
  }
}
```

## 域类型

### 客户端密钥创建响应

- `ClientSecretCreateResponse object { expires_at, session, value }`

  为 Realtime API 创建会话和客户端密钥的响应。

  - `expires_at: number`

    客户端密钥的过期时间戳，以自纪元起的秒数表示。

  - `session: RealtimeSessionCreateResponse or RealtimeTranscriptionSessionCreateResponse`

    实时会话或转录会话的会话配置。

    - `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

      Realtime 会话配置对象。

      - `id: string`

        会话的唯一标识符，类似于 `sess_1234567890abcdef`.

      - `object: "realtime.session"`

        对象类型。始终为 `realtime.session`.

        - `"realtime.session"`

      - `type: "realtime"`

        要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

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

                音频格式。始终 `audio/pcm`.

                - `"audio/pcm"`

            - `PCMUAudio object { type }`

              G.711 μ-law 格式。

              - `type: optional "audio/pcmu"`

                音频格式。始终 `audio/pcmu`.

                - `"audio/pcmu"`

            - `PCMAAudio object { type }`

              G.711 A-law 格式。

              - `type: optional "audio/pcma"`

                音频格式。始终 `audio/pcma`.

                - `"audio/pcma"`

          - `noise_reduction: optional object { type }`

            输入音频降噪配置。可设置为 `null` 以关闭。
            降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行处理。
            对音频进行过滤可以通过改善对输入音频的感知，从而提高 VAD 和打断检测的准确率（减少误报），并提升模型表现。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本电脑或会议室麦克风等远场麦克风。

              - `"near_field"`

              - `"far_field"`

          - `transcription: optional object { language, languages, model, prompt }`

            输入音频转写配置，默认为关闭状态，可设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应将其视为输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写所用的语言和提示词，这些为转写服务提供了额外的指引。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示词（如果存在）。

          - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

            轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭该功能，此时客户端必须手动触发模型响应。

            Server VAD 意味着模型会基于音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

            Semantic VAD 更先进，它会结合 VAD 使用一个轮次判断模型来语义层面估计用户是否已说完，然后基于该概率动态设置一个超时时间。例如，如果用户的语音以“嗯……”之类的语气词收尾，模型会给出一个较低的轮次结束概率，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

            对于 `gpt-realtime-whisper` transcription 会话中，turn detection 必须
            设置为 `null`；不支持 VAD。

            - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

              服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

              - `type: "server_vad"`

                turn detection 类型， `server_vad` 以开启简单的 Server VAD。

                - `"server_vad"`

              - `create_response: optional boolean`

                是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已经正在响应时可能会无法创建响应。

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `idle_timeout_ms: optional number or null`

                可选超时时间，到达后将自动触发一次响应。
                这在用户长时间停顿出乎意料的情况下很有用，例如电话
                通话。模型会根据当前上下文有效地提示用户继续对话。
                于当前上下文。

                该超时值会在最后一次模型响应的音频播放结束后应用，
                即它被设置为 `response.done` time plus audio playback duration.

                一个 `input_audio_buffer.timeout_triggered` event (plus events
                associated with the Response) will be emitted when the timeout is reached.
                Idle timeout is currently only supported for `server_vad` mode.

              - `interrupt_response: optional boolean`

                Whether or not to automatically interrupt (cancel) any ongoing response with output to the default
                conversation (i.e. `conversation` of `auto`) when a VAD start event occurs. If `true` then the response will be cancelled, otherwise it will continue until complete.

                如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

              - `prefix_padding_ms: optional number`

                Used only for `server_vad` mode. Amount of audio to include before the VAD detected speech (in
                milliseconds). Defaults to 300ms.

              - `silence_duration_ms: optional number`

                Used only for `server_vad` mode. Duration of silence to detect speech stop (in milliseconds). Defaults
                to 500ms. With shorter values the model will respond more quickly,
                but may jump in on short pauses from the user.

              - `threshold: optional number`

                Used only for `server_vad` mode. Activation threshold for VAD (0.0 to 1.0), this defaults to 0.5. A
                higher threshold will require louder audio to activate the model, and
                thus might perform better in noisy environments.

            - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

              服务端语义轮次检测，通过模型判断用户何时已结束发言。

              - `type: "semantic_vad"`

                turn detection 类型， `semantic_vad` 以开启 Semantic VAD。

                - `"semantic_vad"`

              - `create_response: optional boolean`

                当 VAD 停止事件发生时，是否自动生成响应。

              - `eagerness: optional "low" or "medium" or "high" or "auto"`

                Used only for `semantic_vad` 模式。模型响应的积极程度。 `low` 会等待更长时间以便用户继续发言， `high` 会更快地作出响应。 `auto` 为默认值，相当于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

                - `"low"`

                - `"medium"`

                - `"high"`

                - `"auto"`

              - `interrupt_response: optional boolean`

                当存在输出到默认
                conversation (i.e. `conversation` of `auto`) 时，是否自动中断任何正在进行的响应。

        - `output: optional object { format, speed, voice }`

          - `format: optional RealtimeAudioFormats`

            输出音频的格式。

          - `speed: optional number`

            模型口语化响应的速度，相对于原始速度的倍数。
            1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

            此参数是对生成后音频的后处理调整，也
            可以通过提示让模型说得更快或更慢。

          - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

            模型用于回应的声音。一旦模型已经以音频回应过至少一次，会话期间就无法再更改声音。当前
            会话中的声音选项包括
            声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
            `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
            最佳质量。

            - `string`

            - `"alloy" or "ash" or "ballad" or 7 more`

              模型用于回应的声音。一旦模型已经以音频回应过至少一次，会话期间就无法再更改声音。当前
              会话中的声音选项包括
              声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

        要包含在服务端输出中的额外字段。

        `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

      - `instructions: optional string`

        预先添加到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型关于响应内容和格式（例如"极其简洁"、"表现得友好"、"以下是良好响应的示例"），以及关于音频行为（例如"快速讲话"、"在声音中注入情感"、"经常笑"）。指令不保证被模型遵循，但它们为模型提供了关于期望行为的指导。

        请注意，服务端会设置默认指令，如果未设置此字段将使用默认指令，并且这些指令在 `session.created` 事件中于会话开始时可见。

      - `max_output_tokens: optional number or "inf"`

        单个助手响应的最大输出令牌数，
        包括工具调用。提供介于 1 和 4096 之间的整数以
        限制输出令牌，或 `inf` 以获取给定模型的可用
        最大令牌数。默认为 `inf`.

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

        模型可以响应的模态集合。默认为 `["audio"]`,表示
        模型将响应音频加文字转录。 `["text"]` 可用于使
        the model respond with text only. It is not possible to request both `text` 和 `audio` at the same time.

        - `"text"`

        - `"audio"`

      - `prompt: optional ResponsePrompt or null`

        Reference to a prompt template and its variables.
        [Learn more](/docs/guides/text?api-mode=responses#reusable-prompts).

        - `id: string`

          The unique identifier of the prompt template to use.

        - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

          Optional map of values to substitute in for variables in your
          prompt. The substitution values can either be strings, or other
          Response input types like images or files.

          - `string`

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            A text input to the model.

            - `text: string`

              The text input to the model.

            - `type: "input_text"`

              The type of the input item. Always `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

              - `mode: "explicit"`

                The breakpoint mode. Always `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            An image input to the model. Learn about [image inputs](/docs/guides/vision).

            - `detail: ImageDetail`

              The detail level of the image to be sent to the model. One of `high`, `low`, `auto`, or `original`。默认为 `auto`.

              - `"low"`

              - `"high"`

              - `"auto"`

              - `"original"`

            - `type: "input_image"`

              The type of the input item. Always `input_image`.

              - `"input_image"`

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图片 URL。可以是完整的 URL，也可以是 base64 编码的图片数据 URL。

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

              - `mode: "explicit"`

                The breakpoint mode. Always `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            模型的输入文件。

            - `type: "input_file"`

              The type of the input item. Always `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 使用量。使用 `low` 可使用较低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送给模型的文件内容。

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `file_url: optional string`

              要发送到模型的文件的 URL。

            - `filename: optional string`

              要发送到模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

              - `mode: "explicit"`

                The breakpoint mode. Always `explicit`.

                - `"explicit"`

        - `version: optional string or null`

          可选的提示模板版本。

      - `reasoning: optional RealtimeReasoning`

        面向支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

        - `effort: optional RealtimeReasoningEffort`

          限制支持推理的 Realtime 模型（例如）的推理力度
          `gpt-realtime-2`.

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

      - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

        模型如何选择工具。提供一个字符串模式，或强制使用特定的
        function/MCP 工具。

        - `ToolChoiceOptions = "none" or "auto" or "required"`

          控制模型调用哪个工具（如果有的话）。

          `none` 表示模型将不调用任何工具，而是生成一条消息。

          `auto` 表示模型可以在生成消息或调用一个或
          更多工具。

          `required` 表示模型必须调用一个或多个工具。

          - `"none"`

          - `"auto"`

          - `"required"`

        - `ToolChoiceFunction object { name, type }`

          使用此选项可强制模型调用指定的函数。

          - `name: string`

            要调用的函数名称。

          - `type: "function"`

            对于函数调用，类型始终为 `function`.

            - `"function"`

        - `ToolChoiceMcp object { server_label, type, name }`

          使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

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

            函数的说明，包括何时以及如何调用的指导，
            以及调用时向用户说明哪些内容的指导
            （如有）。

          - `name: optional string`

            函数的名称。

          - `parameters: optional unknown`

            函数的参数，采用 JSON Schema 格式。

          - `type: optional "function"`

            工具的类型，即 `function`.

            - `"function"`

        - `McpTool object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议 (MCP) 服务器让模型访问额外的工具。
          （了解有关 MCP 的更多信息。 [了解有关 MCP 的更多信息](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许使用的工具名称列表或筛选器对象。

            - `McpAllowedTools = array of string`

              允许使用的工具名称字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许使用哪些工具的筛选器对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是否为只读。如果某个
                MCP 服务器已 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将与此筛选器匹配。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可与远程 MCP 服务器配合使用的 OAuth 访问令牌，可用于
            自定义 MCP 服务器 URL 或服务连接器。你的应用
            必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供其中
            `server_url`, `connector_id`, or `tunnel_id` 之一。详细了解
            服务连接器 [请参阅此处](/docs/guides/tools-remote-mcp#connectors).

            目前支持 `connector_id` 的值为：

            - Dropbox： `connector_dropbox`
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

            此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`,或与工具关联的筛选器对象
              这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的筛选器对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果某个
                  MCP 服务器已 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将与此筛选器匹配。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许使用哪些工具的筛选器对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是否为只读。如果某个
                  MCP 服务器已 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将与此筛选器匹配。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`。当设置为 `always`，时,所有工具都需要审批。当设置为
              设置为 `never`，时,所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。需提供以下之一 `server_url`, `connector_id`, or
            `tunnel_id` 。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一
            `server_url`, `connector_id`, or `tunnel_id` 。

      - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

        Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦为会话启用了 追踪，便无法再修改该配置。
        追踪。

        `auto` 将使用默认值创建一个会话 追踪，包括
        工作流 名称、group id 和元数据。

        - `Auto = "auto"`

          启用 追踪 并为 追踪 配置选项设置默认值。始终 `auto`.

          - `"auto"`

        - `TracingConfiguration object { group_id, metadata, workflow_name }`

          对 追踪 的细粒度配置。

          - `group_id: optional string`

            附加到此 追踪 的 group id，用于在追踪仪表板中进行筛选和
            分组。

          - `metadata: optional unknown`

            附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
            筛选。

          - `workflow_name: optional string`

            附加到此 追踪 的 工作流 名称。它用于在追踪仪表板中
            为该 追踪 命名。

      - `truncation: optional RealtimeTruncation`

        当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）将不会包含在模型的上下文中。拥有 32k 上下文、最大输出 token 为 4,096 的模型，在发生截断之前，其上下文中最多只能包含 28,224 个 token。

        客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是一种有效控制 token 使用量和成本的方式。

        截断会减少下一轮中缓存的 token 数量（破坏缓存），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多占最大上下文大小一定比例的消息，从而减少后续截断的需要，进而提升缓存命中率。

        可以完全禁用截断，这意味着服务端永远不会进行截断，但如果对话超出模型的输入 token 上限，将改为返回错误。

        - `"auto" or "disabled"`

          会话所使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超出输入 token 上限时报错。

          - `"auto"`

          - `"disabled"`

        - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

          在对话超出输入 token 上限后，保留其中一部分会话 token。这可以让你将截断分摊到多轮对话中，有助于改善缓存 token 的使用率。

          - `retention_ratio: number`

            在对话超出输入 token 上限时，要保留的指令后会话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时，将该值设置为 `0.8` 意味着会丢弃消息，直到使用到最大允许 token 的 80%。这有助于降低截断发生频率并提升缓存命中率。

          - `type: "retention_ratio"`

            使用保留比例截断。

            - `"retention_ratio"`

          - `token_limits: optional object { post_instructions }`

            此截断策略的可选自定义 token 上限。如果未提供，将使用模型的默认 token 上限。

            - `post_instructions: optional number`

              指令之后（其中包括工具定义）会话所允许的最大 token 数。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 token 时就会发生截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

    - `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

      Realtime 转录会话配置对象。

      - `id: string`

        会话的唯一标识符，类似于 `sess_1234567890abcdef`.

      - `object: string`

        对象类型。始终为 `realtime.transcription_session`.

      - `type: "transcription"`

        会话类型。始终为 `transcription` 用于转录会话。

        - `"transcription"`

      - `audio: optional object { input }`

        会话的输入音频配置。

        - `input: optional object { format, noise_reduction, transcription, turn_detection }`

          - `format: optional RealtimeAudioFormats`

            PCM 音频格式。仅支持 24kHz 采样率。

          - `noise_reduction: optional object { type }`

            输入音频降噪的配置。

            - `type: optional NoiseReductionType`

              降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本电脑或会议室麦克风等远场麦克风。

          - `transcription: optional object { language, languages, model, prompt }`

            转录模型的配置。

            - `language: optional string`

              输入音频的语言。

            - `languages: optional array of string`

              为转录配置的可用输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

            - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

              - `string`

              - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

                用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

                - `"whisper-1"`

                - `"gpt-transcribe"`

                - `"gpt-live-transcribe"`

                - `"gpt-4o-mini-transcribe"`

                - `"gpt-4o-mini-transcribe-2025-12-15"`

                - `"gpt-4o-transcribe"`

                - `"gpt-4o-transcribe-diarize"`

                - `"gpt-realtime-whisper"`

            - `prompt: optional string`

              为输入音频转录配置的提示词（如果存在）。

          - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

            轮次检测的配置。可设置为 `null` 以关闭。服务端
            VAD 意味着模型将根据
            音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`,这必须是 `null`；不支持 VAD。

            - `prefix_padding_ms: optional number`

              VAD 检测到语音之前要包含的音频量（以
              milliseconds). Defaults to 300ms.

            - `silence_duration_ms: optional number`

              用于检测语音停止的静默时长（以毫秒为单位）。默认为
              to 500ms. With shorter values the model will respond more quickly,
              but may jump in on short pauses from the user.

            - `threshold: optional number`

              VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较高的
              higher threshold will require louder audio to activate the model, and
              thus might perform better in noisy environments.

            - `type: optional string`

              轮次检测类型，仅 `server_vad` 。

      - `expires_at: optional number`

        会话的过期时间戳，以自纪元起的秒数表示。

      - `include: optional array of "item.input_audio_transcription.logprobs"`

        要包含在服务端输出中的额外字段。

        - `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

        - `"item.input_audio_transcription.logprobs"`

  - `value: string`

    生成的客户端密钥值。

### Realtime Session Create Response

- `RealtimeSessionCreateResponse object { id, object, type, 13 more }`

  Realtime 会话配置对象。

  - `id: string`

    会话的唯一标识符，类似于 `sess_1234567890abcdef`.

  - `object: "realtime.session"`

    对象类型。始终为 `realtime.session`.

    - `"realtime.session"`

  - `type: "realtime"`

    要创建的会话类型。对于 Realtime API，始终为 `realtime` 。

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

            音频格式。始终 `audio/pcm`.

            - `"audio/pcm"`

        - `PCMUAudio object { type }`

          G.711 μ-law 格式。

          - `type: optional "audio/pcmu"`

            音频格式。始终 `audio/pcmu`.

            - `"audio/pcmu"`

        - `PCMAAudio object { type }`

          G.711 A-law 格式。

          - `type: optional "audio/pcma"`

            音频格式。始终 `audio/pcma`.

            - `"audio/pcma"`

      - `noise_reduction: optional object { type }`

        输入音频降噪配置。可设置为 `null` 以关闭。
        降噪会在输入音频缓冲区中的音频发送给 VAD 和模型之前对其进行处理。
        对音频进行过滤可以通过改善对输入音频的感知，从而提高 VAD 和打断检测的准确率（减少误报），并提升模型表现。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本电脑或会议室麦克风等远场麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        输入音频转写配置，默认为关闭状态，可设置为 `null` 以在启用后关闭。输入音频转写并非模型原生功能，因为模型直接消费音频。转写通过 [/audio/transcriptions 端点](/docs/api-reference/audio/createTranscription) 异步运行，应将其视为输入音频内容的指引，而非模型实际听到的精确内容。客户端可以可选地设置转写所用的语言和提示词，这些为转写服务提供了额外的指引。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可用输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          为输入音频转录配置的提示词（如果存在）。

      - `turn_detection: optional object { type, create_response, idle_timeout_ms, 4 more }  or object { type, create_response, eagerness, interrupt_response }  or null`

        轮次检测的配置，可选 Server VAD 或 Semantic VAD。可设置为 `null` 以关闭该功能，此时客户端必须手动触发模型响应。

        Server VAD 意味着模型会基于音频音量检测语音的开始和结束，并在用户语音结束时进行响应。

        Semantic VAD 更先进，它会结合 VAD 使用一个轮次判断模型来语义层面估计用户是否已说完，然后基于该概率动态设置一个超时时间。例如，如果用户的语音以“嗯……”之类的语气词收尾，模型会给出一个较低的轮次结束概率，并等待更长时间以便用户继续说话。这对于更自然的对话很有用，但可能会带来更高的延迟。

        对于 `gpt-realtime-whisper` transcription 会话中，turn detection 必须
        设置为 `null`；不支持 VAD。

        - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

          服务端语音活动检测（VAD），在检测到用户语音时开启，并在静默一段时间后关闭。

          - `type: "server_vad"`

            turn detection 类型， `server_vad` 以开启简单的 Server VAD。

            - `"server_vad"`

          - `create_response: optional boolean`

            是否在 VAD 停止事件发生时自动生成响应。如果 `interrupt_response` 设置为 `false` ，在模型已经正在响应时可能会无法创建响应。

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `idle_timeout_ms: optional number or null`

            可选超时时间，到达后将自动触发一次响应。
            这在用户长时间停顿出乎意料的情况下很有用，例如电话
            通话。模型会根据当前上下文有效地提示用户继续对话。
            于当前上下文。

            该超时值会在最后一次模型响应的音频播放结束后应用，
            即它被设置为 `response.done` time plus audio playback duration.

            一个 `input_audio_buffer.timeout_triggered` event (plus events
            associated with the Response) will be emitted when the timeout is reached.
            Idle timeout is currently only supported for `server_vad` mode.

          - `interrupt_response: optional boolean`

            Whether or not to automatically interrupt (cancel) any ongoing response with output to the default
            conversation (i.e. `conversation` of `auto`) when a VAD start event occurs. If `true` then the response will be cancelled, otherwise it will continue until complete.

            如果两者 `create_response` 和 `interrupt_response` 都设置为 `false`，模型将永远不会自动响应，但仍会发出 VAD 事件。

          - `prefix_padding_ms: optional number`

            Used only for `server_vad` mode. Amount of audio to include before the VAD detected speech (in
            milliseconds). Defaults to 300ms.

          - `silence_duration_ms: optional number`

            Used only for `server_vad` mode. Duration of silence to detect speech stop (in milliseconds). Defaults
            to 500ms. With shorter values the model will respond more quickly,
            but may jump in on short pauses from the user.

          - `threshold: optional number`

            Used only for `server_vad` mode. Activation threshold for VAD (0.0 to 1.0), this defaults to 0.5. A
            higher threshold will require louder audio to activate the model, and
            thus might perform better in noisy environments.

        - `SemanticVad object { type, create_response, eagerness, interrupt_response }`

          服务端语义轮次检测，通过模型判断用户何时已结束发言。

          - `type: "semantic_vad"`

            turn detection 类型， `semantic_vad` 以开启 Semantic VAD。

            - `"semantic_vad"`

          - `create_response: optional boolean`

            当 VAD 停止事件发生时，是否自动生成响应。

          - `eagerness: optional "low" or "medium" or "high" or "auto"`

            Used only for `semantic_vad` 模式。模型响应的积极程度。 `low` 会等待更长时间以便用户继续发言， `high` 会更快地作出响应。 `auto` 为默认值，相当于 `medium`. `low`, `medium`，以及 `high` 的最大超时分别为 8 秒、4 秒和 2 秒。

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `interrupt_response: optional boolean`

            当存在输出到默认
            conversation (i.e. `conversation` of `auto`) 时，是否自动中断任何正在进行的响应。

    - `output: optional object { format, speed, voice }`

      - `format: optional RealtimeAudioFormats`

        输出音频的格式。

      - `speed: optional number`

        模型口语化响应的速度，相对于原始速度的倍数。
        1.0 为默认速度。0.25 为最低速度。1.5 为最高速度。此值只能在模型轮次之间更改，不能在响应进行中修改。

        此参数是对生成后音频的后处理调整，也
        可以通过提示让模型说得更快或更慢。

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more`

        模型用于回应的声音。一旦模型已经以音频回应过至少一次，会话期间就无法再更改声音。当前
        会话中的声音选项包括
        声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
        `shimmer`, `verse`, `marin`，以及 `cedar`。我们推荐 `marin` 和 `cedar` 以获得
        最佳质量。

        - `string`

        - `"alloy" or "ash" or "ballad" or 7 more`

          模型用于回应的声音。一旦模型已经以音频回应过至少一次，会话期间就无法再更改声音。当前
          会话中的声音选项包括
          声音选项有 `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`,
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

    要包含在服务端输出中的额外字段。

    `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

  - `instructions: optional string`

    预先添加到模型调用的默认系统指令（即系统消息）。此字段允许客户端引导模型给出期望的响应。可以指示模型关于响应内容和格式（例如"极其简洁"、"表现得友好"、"以下是良好响应的示例"），以及关于音频行为（例如"快速讲话"、"在声音中注入情感"、"经常笑"）。指令不保证被模型遵循，但它们为模型提供了关于期望行为的指导。

    请注意，服务端会设置默认指令，如果未设置此字段将使用默认指令，并且这些指令在 `session.created` 事件中于会话开始时可见。

  - `max_output_tokens: optional number or "inf"`

    单个助手响应的最大输出令牌数，
    包括工具调用。提供介于 1 和 4096 之间的整数以
    限制输出令牌，或 `inf` 以获取给定模型的可用
    最大令牌数。默认为 `inf`.

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

    模型可以响应的模态集合。默认为 `["audio"]`,表示
    模型将响应音频加文字转录。 `["text"]` 可用于使
    the model respond with text only. It is not possible to request both `text` 和 `audio` at the same time.

    - `"text"`

    - `"audio"`

  - `prompt: optional ResponsePrompt or null`

    Reference to a prompt template and its variables.
    [Learn more](/docs/guides/text?api-mode=responses#reusable-prompts).

    - `id: string`

      The unique identifier of the prompt template to use.

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      Optional map of values to substitute in for variables in your
      prompt. The substitution values can either be strings, or other
      Response input types like images or files.

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        A text input to the model.

        - `text: string`

          The text input to the model.

        - `type: "input_text"`

          The type of the input item. Always `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

          - `mode: "explicit"`

            The breakpoint mode. Always `explicit`.

            - `"explicit"`

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        An image input to the model. Learn about [image inputs](/docs/guides/vision).

        - `detail: ImageDetail`

          The detail level of the image to be sent to the model. One of `high`, `low`, `auto`, or `original`。默认为 `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          The type of the input item. Always `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `image_url: optional string or null`

          发送给模型的图片 URL。可以是完整的 URL，也可以是 base64 编码的图片数据 URL。

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

          - `mode: "explicit"`

            The breakpoint mode. Always `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        模型的输入文件。

        - `type: "input_file"`

          The type of the input item. Always `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          发送给模型的文件细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 使用量。使用 `low` 可使用较低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          发送给模型的文件内容。

        - `file_id: optional string or null`

          发送给模型的文件 ID。

        - `file_url: optional string`

          要发送到模型的文件的 URL。

        - `filename: optional string`

          要发送到模型的文件的名称。

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

          - `mode: "explicit"`

            The breakpoint mode. Always `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      可选的提示模板版本。

  - `reasoning: optional RealtimeReasoning`

    面向支持推理的 Realtime 模型（例如）的配置 `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      限制支持推理的 Realtime 模型（例如）的推理力度
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    模型如何选择工具。提供一个字符串模式，或强制使用特定的
    function/MCP 工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个工具（如果有的话）。

      `none` 表示模型将不调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或
      更多工具。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      使用此选项可强制模型调用指定的函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项可强制模型调用远程 MCP 服务器上的指定工具。

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

        函数的说明，包括何时以及如何调用的指导，
        以及调用时向用户说明哪些内容的指导
        （如有）。

      - `name: optional string`

        函数的名称。

      - `parameters: optional unknown`

        函数的参数，采用 JSON Schema 格式。

      - `type: optional "function"`

        工具的类型，即 `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      通过远程模型上下文协议 (MCP) 服务器让模型访问额外的工具。
      （了解有关 MCP 的更多信息。 [了解有关 MCP 的更多信息](/docs/guides/tools-remote-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中标识它。

      - `type: "mcp"`

        MCP 工具的类型。始终为 `mcp`.

        - `"mcp"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

      - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

        允许使用的工具名称列表或筛选器对象。

        - `McpAllowedTools = array of string`

          允许使用的工具名称字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许使用哪些工具的筛选器对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或是否为只读。如果某个
            MCP 服务器已 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将与此筛选器匹配。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `authorization: optional string`

        可与远程 MCP 服务器配合使用的 OAuth 访问令牌，可用于
        自定义 MCP 服务器 URL 或服务连接器。你的应用
        必须处理 OAuth 授权流程，并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供其中
        `server_url`, `connector_id`, or `tunnel_id` 之一。详细了解
        服务连接器 [请参阅此处](/docs/guides/tools-remote-mcp#connectors).

        目前支持 `connector_id` 的值为：

        - Dropbox： `connector_dropbox`
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

        此 MCP 工具是否为延迟加载的工具，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`,或与工具关联的筛选器对象
          这些工具需要审批。

          - `always: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的筛选器对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果某个
              MCP 服务器已 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将与此筛选器匹配。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许使用哪些工具的筛选器对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或是否为只读。如果某个
              MCP 服务器已 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将与此筛选器匹配。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值为 `always` 或
          `never`。当设置为 `always`，时,所有工具都需要审批。当设置为
          设置为 `never`，时,所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。需提供以下之一 `server_url`, `connector_id`, or
        `tunnel_id` 。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的 Secure MCP Tunnel ID。需提供以下之一
        `server_url`, `connector_id`, or `tunnel_id` 。

  - `tracing: optional "auto" or object { group_id, metadata, workflow_name }  or null`

    Realtime API 可以将会话追踪写入 [追踪仪表板](https://platform.openai.com/logs?api=traces)。设置为 null 可禁用 追踪。一旦为会话启用了 追踪，便无法再修改该配置。
    追踪。

    `auto` 将使用默认值创建一个会话 追踪，包括
    工作流 名称、group id 和元数据。

    - `Auto = "auto"`

      启用 追踪 并为 追踪 配置选项设置默认值。始终 `auto`.

      - `"auto"`

    - `TracingConfiguration object { group_id, metadata, workflow_name }`

      对 追踪 的细粒度配置。

      - `group_id: optional string`

        附加到此 追踪 的 group id，用于在追踪仪表板中进行筛选和
        分组。

      - `metadata: optional unknown`

        附加到此 追踪 的任意元数据，用于在追踪仪表板中进行
        筛选。

      - `workflow_name: optional string`

        附加到此 追踪 的 工作流 名称。它用于在追踪仪表板中
        为该 追踪 命名。

  - `truncation: optional RealtimeTruncation`

    当对话中的 token 数量超过模型的输入 token 上限时，对话将被截断，这意味着部分消息（从最早的消息开始）将不会包含在模型的上下文中。拥有 32k 上下文、最大输出 token 为 4,096 的模型，在发生截断之前，其上下文中最多只能包含 28,224 个 token。

    客户端可以配置截断行为，使用更低的最大 token 限制进行截断，这是一种有效控制 token 使用量和成本的方式。

    截断会减少下一轮中缓存的 token 数量（破坏缓存），因为消息会从上下文的开头被丢弃。不过，客户端也可以将截断配置为保留最多占最大上下文大小一定比例的消息，从而减少后续截断的需要，进而提升缓存命中率。

    可以完全禁用截断，这意味着服务端永远不会进行截断，但如果对话超出模型的输入 token 上限，将改为返回错误。

    - `"auto" or "disabled"`

      会话所使用的截断策略。 `auto` 是默认的截断策略。 `disabled` 会禁用截断，并在对话超出输入 token 上限时报错。

      - `"auto"`

      - `"disabled"`

    - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

      在对话超出输入 token 上限后，保留其中一部分会话 token。这可以让你将截断分摊到多轮对话中，有助于改善缓存 token 的使用率。

      - `retention_ratio: number`

        在对话超出输入 token 上限时，要保留的指令后会话 token 比例（`0.0` - `1.0`）。当对话超出输入 token 上限时，将该值设置为 `0.8` 意味着会丢弃消息，直到使用到最大允许 token 的 80%。这有助于降低截断发生频率并提升缓存命中率。

      - `type: "retention_ratio"`

        使用保留比例截断。

        - `"retention_ratio"`

      - `token_limits: optional object { post_instructions }`

        此截断策略的可选自定义 token 上限。如果未提供，将使用模型的默认 token 上限。

        - `post_instructions: optional number`

          指令之后（其中包括工具定义）会话所允许的最大 token 数。例如，将其设置为 5,000 意味着当指令之后的会话超过 5,000 token 时就会发生截断。该值不能高于模型的上下文窗口大小减去最大输出 token 数。

### Realtime Transcription Session Create Response

- `RealtimeTranscriptionSessionCreateResponse object { id, object, type, 3 more }`

  Realtime 转录会话配置对象。

  - `id: string`

    会话的唯一标识符，类似于 `sess_1234567890abcdef`.

  - `object: string`

    对象类型。始终为 `realtime.transcription_session`.

  - `type: "transcription"`

    会话类型。始终为 `transcription` 用于转录会话。

    - `"transcription"`

  - `audio: optional object { input }`

    会话的输入音频配置。

    - `input: optional object { format, noise_reduction, transcription, turn_detection }`

      - `format: optional RealtimeAudioFormats`

        PCM 音频格式。仅支持 24kHz 采样率。

        - `PCMAudio object { rate, type }`

          PCM 音频格式。仅支持 24kHz 采样率。

          - `rate: optional 24000`

            音频的采样率。始终为 `24000`.

            - `24000`

          - `type: optional "audio/pcm"`

            音频格式。始终 `audio/pcm`.

            - `"audio/pcm"`

        - `PCMUAudio object { type }`

          G.711 μ-law 格式。

          - `type: optional "audio/pcmu"`

            音频格式。始终 `audio/pcmu`.

            - `"audio/pcmu"`

        - `PCMAAudio object { type }`

          G.711 A-law 格式。

          - `type: optional "audio/pcma"`

            音频格式。始终 `audio/pcma`.

            - `"audio/pcma"`

      - `noise_reduction: optional object { type }`

        输入音频降噪的配置。

        - `type: optional NoiseReductionType`

          降噪类型。 `near_field` 适用于耳机等近讲麦克风， `far_field` 适用于笔记本电脑或会议室麦克风等远场麦克风。

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { language, languages, model, prompt }`

        转录模型的配置。

        - `language: optional string`

          输入音频的语言。

        - `languages: optional array of string`

          为转录配置的可用输入音频语言，以 [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) 格式表示。

        - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

          用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

          - `string`

          - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            用于转录的模型。当前可选值为 `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`，以及 `gpt-realtime-whisper`.

            - `"whisper-1"`

            - `"gpt-transcribe"`

            - `"gpt-live-transcribe"`

            - `"gpt-4o-mini-transcribe"`

            - `"gpt-4o-mini-transcribe-2025-12-15"`

            - `"gpt-4o-transcribe"`

            - `"gpt-4o-transcribe-diarize"`

            - `"gpt-realtime-whisper"`

        - `prompt: optional string`

          为输入音频转录配置的提示词（如果存在）。

      - `turn_detection: optional RealtimeTranscriptionSessionTurnDetection or null`

        轮次检测的配置。可设置为 `null` 以关闭。服务端
        VAD 意味着模型将根据
        音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`,这必须是 `null`；不支持 VAD。

        - `prefix_padding_ms: optional number`

          VAD 检测到语音之前要包含的音频量（以
          milliseconds). Defaults to 300ms.

        - `silence_duration_ms: optional number`

          用于检测语音停止的静默时长（以毫秒为单位）。默认为
          to 500ms. With shorter values the model will respond more quickly,
          but may jump in on short pauses from the user.

        - `threshold: optional number`

          VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较高的
          higher threshold will require louder audio to activate the model, and
          thus might perform better in noisy environments.

        - `type: optional string`

          轮次检测类型，仅 `server_vad` 。

  - `expires_at: optional number`

    会话的过期时间戳，以自纪元起的秒数表示。

  - `include: optional array of "item.input_audio_transcription.logprobs"`

    要包含在服务端输出中的额外字段。

    - `item.input_audio_transcription.logprobs`:为输入音频转录包含 logprobs。

    - `"item.input_audio_transcription.logprobs"`

### Realtime Transcription Session Turn Detection

- `RealtimeTranscriptionSessionTurnDetection object { prefix_padding_ms, silence_duration_ms, threshold, type }`

  轮次检测的配置。可设置为 `null` 以关闭。服务端
  VAD 意味着模型将根据
  音频音量检测语音的开始和结束，并在用户语音结束时作出响应。对于 `gpt-realtime-whisper`,这必须是 `null`；不支持 VAD。

  - `prefix_padding_ms: optional number`

    VAD 检测到语音之前要包含的音频量（以
    milliseconds). Defaults to 300ms.

  - `silence_duration_ms: optional number`

    用于检测语音停止的静默时长（以毫秒为单位）。默认为
    to 500ms. With shorter values the model will respond more quickly,
    but may jump in on short pauses from the user.

  - `threshold: optional number`

    VAD 的激活阈值（0.0 到 1.0），默认为 0.5。较高的
    higher threshold will require louder audio to activate the model, and
    thus might perform better in noisy environments.

  - `type: optional string`

    轮次检测类型，仅 `server_vad` 。
