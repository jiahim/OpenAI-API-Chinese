# Realtime client events

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

These are events that the OpenAI Realtime WebSocket server will accept from the client.

<a id="session.update"></a>

## session.update

Send this event to update the session’s configuration.
The client may send this event at any time to update any field
except for `voice` and `model`. `voice` can be updated only if there have been no other audio outputs yet.

When the server receives a `session.update`, it will respond
with a `session.updated` event showing the full, effective configuration.
Only the fields that are present in the `session.update` are updated. To clear a field like
`instructions`, pass an empty string. To clear a field like `tools`, pass an empty array.
To clear a field like `turn_detection`, pass `null`.

### Schema

Schema name: `RealtimeClientEventSessionUpdate`

- `session: RealtimeSessionCreateRequest or RealtimeTranscriptionSessionCreateRequest`

  Update the Realtime session. Choose either a realtime
  session or a transcription session.

  - `RealtimeSessionCreateRequest object { type, audio, include, 11 more }`

    Realtime session object configuration.

    - `type: "realtime"`

      The type of session to create. Always `realtime` for the Realtime API.

      - `"realtime"`

    - `audio: optional RealtimeAudioConfig`

      Configuration for input and output audio.

      - `input: optional RealtimeAudioConfigInput`

        - `format: optional RealtimeAudioFormats`

          The format of the input audio.

          - `PCMAudio object { rate, type }`

            The PCM audio format. Only a 24kHz sample rate is supported.

            - `rate: optional 24000`

              The sample rate of the audio. Always `24000`.

              - `24000`

            - `type: optional "audio/pcm"`

              The audio format. Always `audio/pcm`.

              - `"audio/pcm"`

          - `PCMUAudio object { type }`

            The G.711 μ-law format.

            - `type: optional "audio/pcmu"`

              The audio format. Always `audio/pcmu`.

              - `"audio/pcmu"`

          - `PCMAAudio object { type }`

            The G.711 A-law format.

            - `type: optional "audio/pcma"`

              The audio format. Always `audio/pcma`.

              - `"audio/pcma"`

        - `noise_reduction: optional object { type }`

          Configuration for input audio noise reduction. This can be set to `null` to turn off.
          Noise reduction filters audio added to the input audio buffer before it is sent to VAD and the model.
          Filtering the audio can improve VAD and turn detection accuracy (reducing false positives) and model performance by improving perception of the input audio.

          - `type: optional NoiseReductionType`

            Type of noise reduction. `near_field` is for close-talking microphones such as headphones, `far_field` is for far-field microphones such as laptop or conference room microphones.

            - `"near_field"`

            - `"far_field"`

        - `transcription: optional AudioTranscription`

          Configuration for input audio transcription, defaults to off and can be set to `null` to turn off once on. Input audio transcription is not native to the model, since the model consumes audio directly. Transcription runs asynchronously through [the /audio/transcriptions endpoint](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) and should be treated as guidance of input audio content rather than precisely what the model heard. The client can optionally set the language and prompt for transcription, these offer additional guidance to the transcription service.

          - `delay: optional "minimal" or "low" or "medium" or 2 more`

            Controls how long the model waits before emitting transcription text.
            Higher values can improve transcription accuracy at the cost of latency.
            Only supported with `gpt-realtime-whisper` in GA Realtime sessions.

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `keywords: optional array of string`

            Words or phrases to guide transcription of the input audio. Supported by `gpt-transcribe` and `gpt-live-transcribe`.

          - `language: optional string`

            The language of the input audio. Supplying the input language in
            [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) (e.g. `en`) format
            will improve accuracy and latency.

          - `languages: optional array of string`

            Possible languages of the input audio, in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) format. Supported by `gpt-transcribe` and `gpt-live-transcribe`.

          - `model: optional string or "whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

            The model to use for transcription. Current options are `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`, and `gpt-realtime-whisper`. Use `gpt-4o-transcribe-diarize` when you need diarization with speaker labels.

            - `string`

            - `"whisper-1" or "gpt-transcribe" or "gpt-live-transcribe" or 5 more`

              The model to use for transcription. Current options are `whisper-1`, `gpt-transcribe`, `gpt-live-transcribe`, `gpt-4o-mini-transcribe`, `gpt-4o-mini-transcribe-2025-12-15`, `gpt-4o-transcribe`, `gpt-4o-transcribe-diarize`, and `gpt-realtime-whisper`. Use `gpt-4o-transcribe-diarize` when you need diarization with speaker labels.

              - `"whisper-1"`

              - `"gpt-transcribe"`

              - `"gpt-live-transcribe"`

              - `"gpt-4o-mini-transcribe"`

              - `"gpt-4o-mini-transcribe-2025-12-15"`

              - `"gpt-4o-transcribe"`

              - `"gpt-4o-transcribe-diarize"`

              - `"gpt-realtime-whisper"`

          - `prompt: optional string`

            An optional text to guide the model's style or continue a previous audio
            segment.
            For `whisper-1`, the [prompt is a list of keywords](https://developers.openai.com/api/docs/guides/speech-to-text#prompting).
            For `gpt-4o-transcribe` models (excluding `gpt-4o-transcribe-diarize`), the prompt is a free text string, for example "expect words related to technology".
            Prompt is not supported with `gpt-realtime-whisper` in GA Realtime sessions.

        - `turn_detection: optional RealtimeAudioInputTurnDetection or null`

          Configuration for turn detection, ether Server VAD or Semantic VAD. This can be set to `null` to turn off, in which case the client must manually trigger model response.

          Server VAD means that the model will detect the start and end of speech based on audio volume and respond at the end of user speech.

          Semantic VAD is more advanced and uses a turn detection model (in conjunction with VAD) to semantically estimate whether the user has finished speaking, then dynamically sets a timeout based on this probability. For example, if user audio trails off with "uhhm", the model will score a low probability of turn end and wait longer for the user to continue speaking. This can be useful for more natural conversations, but may have a higher latency.

          For `gpt-realtime-whisper` transcription sessions, turn detection must be
          set to `null`; VAD is not supported.

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            Server-side voice activity detection (VAD) which flips on when user speech is detected and off after a period of silence.

            - `type: "server_vad"`

              Type of turn detection, `server_vad` to turn on simple Server VAD.

              - `"server_vad"`

            - `create_response: optional boolean`

              Whether or not to automatically generate a response when a VAD stop event occurs. If `interrupt_response` is set to `false` this may fail to create a response if the model is already responding.

              If both `create_response` and `interrupt_response` are set to `false`, the model will never respond automatically but VAD events will still be emitted.

            - `idle_timeout_ms: optional number or null`

              Optional timeout after which a model response will be triggered automatically. This is
              useful for situations in which a long pause from the user is unexpected, such as a phone
              call. The model will effectively prompt the user to continue the conversation based
              on the current context.

              The timeout value will be applied after the last model response's audio has finished playing,
              i.e. it's set to the `response.done` time plus audio playback duration.

              An `input_audio_buffer.timeout_triggered` event (plus events
              associated with the Response) will be emitted when the timeout is reached.
              Idle timeout is currently only supported for `server_vad` mode.

            - `interrupt_response: optional boolean`

              Whether or not to automatically interrupt (cancel) any ongoing response with output to the default
              conversation (i.e. `conversation` of `auto`) when a VAD start event occurs. If `true` then the response will be cancelled, otherwise it will continue until complete.

              If both `create_response` and `interrupt_response` are set to `false`, the model will never respond automatically but VAD events will still be emitted.

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

            Server-side semantic turn detection which uses a model to determine when the user has finished speaking.

            - `type: "semantic_vad"`

              Type of turn detection, `semantic_vad` to turn on Semantic VAD.

              - `"semantic_vad"`

            - `create_response: optional boolean`

              Whether or not to automatically generate a response when a VAD stop event occurs.

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              Used only for `semantic_vad` mode. The eagerness of the model to respond. `low` will wait longer for the user to continue speaking, `high` will respond more quickly. `auto` is the default and is equivalent to `medium`. `low`, `medium`, and `high` have max timeouts of 8s, 4s, and 2s respectively.

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              Whether or not to automatically interrupt any ongoing response with output to the default
              conversation (i.e. `conversation` of `auto`) when a VAD start event occurs.

      - `output: optional RealtimeAudioConfigOutput`

        - `format: optional RealtimeAudioFormats`

          The format of the output audio.

        - `speed: optional number`

          The speed of the model's spoken response as a multiple of the original speed.
          1.0 is the default speed. 0.25 is the minimum speed. 1.5 is the maximum speed. This value can only be changed in between model turns, not while a response is in progress.

          This parameter is a post-processing adjustment to the audio after it is generated, it's
          also possible to prompt the model to speak faster or slower.

        - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

          The voice the model uses to respond. Supported built-in voices are
          `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
          `marin`, and `cedar`. You may also provide a custom voice object with
          an `id`, for example `{ "id": "voice_1234" }`. Voice cannot be changed
          during the session once the model has responded with audio at least once.
          We recommend `marin` and `cedar` for best quality.

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

            Custom voice reference.

            - `id: string`

              The custom voice ID, e.g. `voice_1234`.

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      Additional fields to include in server outputs.

      `item.input_audio_transcription.logprobs`: Include logprobs for input audio transcription.

      - `"item.input_audio_transcription.logprobs"`

    - `instructions: optional string`

      The default system instructions (i.e. system message) prepended to model calls. This field allows the client to guide the model on desired responses. The model can be instructed on response content and format, (e.g. "be extremely succinct", "act friendly", "here are examples of good responses") and on audio behavior (e.g. "talk quickly", "inject emotion into your voice", "laugh frequently"). The instructions are not guaranteed to be followed by the model, but they provide guidance to the model on the desired behavior.

      Note that the server sets default instructions which will be used if this field is not set and are visible in the `session.created` event at the start of the session.

    - `max_output_tokens: optional number or "inf"`

      Maximum number of output tokens for a single assistant response,
      inclusive of tool calls. Provide an integer between 1 and 4096 to
      limit output tokens, or `inf` for the maximum available tokens for a
      given model. Defaults to `inf`.

      - `number`

      - `"inf"`

        - `"inf"`

    - `model: optional string or "gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

      The Realtime model used for this session.

      - `string`

      - `"gpt-realtime" or "gpt-realtime-1.5" or "gpt-realtime-2" or 16 more`

        The Realtime model used for this session.

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

      The set of modalities the model can respond with. It defaults to `["audio"]`, indicating
      that the model will respond with audio plus a transcript. `["text"]` can be used to make
      the model respond with text only. It is not possible to request both `text` and `audio` at the same time.

      - `"text"`

      - `"audio"`

    - `parallel_tool_calls: optional boolean`

      Whether the model may call multiple tools in parallel. Only supported by
      reasoning Realtime models such as `gpt-realtime-2`.

    - `prompt: optional ResponsePrompt or null`

      Reference to a prompt template and its variables.
      [Learn more](https://developers.openai.com/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

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

          An image input to the model. Learn about [image inputs](https://developers.openai.com/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            The detail level of the image to be sent to the model. One of `high`, `low`, `auto`, or `original`. Defaults to `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            The type of the input item. Always `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            The ID of the file to be sent to the model.

          - `image_url: optional string or null`

            The URL of the image to be sent to the model. A fully qualified URL or base64 encoded image in a data URL.

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

            - `mode: "explicit"`

              The breakpoint mode. Always `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          A file input to the model.

          - `type: "input_file"`

            The type of the input item. Always `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            The detail level of the file to be sent to the model. Use `auto` to let the system select the detail level; for GPT-5.6 and later models, `auto` uses high-quality rendering, which may increase input token usage. Use `low` for lower-cost rendering, or `high` to render the file at higher quality. Defaults to `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            The content of the file to be sent to the model.

          - `file_id: optional string or null`

            The ID of the file to be sent to the model.

          - `file_url: optional string`

            The URL of the file to be sent to the model.

          - `filename: optional string`

            The name of the file to be sent to the model.

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

            - `mode: "explicit"`

              The breakpoint mode. Always `explicit`.

              - `"explicit"`

      - `version: optional string or null`

        Optional version of the prompt template.

    - `reasoning: optional RealtimeReasoning`

      Configuration for reasoning-capable Realtime models such as `gpt-realtime-2`.

      - `effort: optional RealtimeReasoningEffort`

        Constrains effort on reasoning for reasoning-capable Realtime models such as
        `gpt-realtime-2`.

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

    - `tool_choice: optional RealtimeToolChoiceConfig`

      How the model chooses tools. Provide one of the string modes or force a specific
      function/MCP tool.

      - `ToolChoiceOptions = "none" or "auto" or "required"`

        Controls which (if any) tool is called by the model.

        `none` means the model will not call any tool and instead generates a message.

        `auto` means the model can pick between generating a message or calling one or
        more tools.

        `required` means the model must call one or more tools.

        - `"none"`

        - `"auto"`

        - `"required"`

      - `ToolChoiceFunction object { name, type }`

        Use this option to force the model to call a specific function.

        - `name: string`

          The name of the function to call.

        - `type: "function"`

          For function calling, the type is always `function`.

          - `"function"`

      - `ToolChoiceMcp object { server_label, type, name }`

        Use this option to force the model to call a specific tool on a remote MCP server.

        - `server_label: string`

          The label of the MCP server to use.

        - `type: "mcp"`

          For MCP tools, the type is always `mcp`.

          - `"mcp"`

        - `name: optional string or null`

          The name of the tool to call on the server.

    - `tools: optional RealtimeToolsConfig`

      Tools available to the model.

      - `RealtimeFunctionTool object { description, name, parameters, type }`

        - `description: optional string`

          The description of the function, including guidance on when and how
          to call it, and guidance about what to tell the user when calling
          (if anything).

        - `name: optional string`

          The name of the function.

        - `parameters: optional unknown`

          Parameters of the function in JSON Schema.

        - `type: optional "function"`

          The type of the tool, i.e. `function`.

          - `"function"`

      - `McpTool object { server_label, type, allowed_callers, 9 more }`

        Give the model access to additional tools via remote Model Context Protocol
        (MCP) servers. [Learn more about MCP](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

        - `server_label: string`

          A label for this MCP server, used to identify it in tool calls.

        - `type: "mcp"`

          The type of the MCP tool. Always `mcp`.

          - `"mcp"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          The tool invocation context(s).

          - `"direct"`

          - `"programmatic"`

        - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

          List of allowed tool names or a filter object.

          - `McpAllowedTools = array of string`

            A string array of allowed tool names

          - `McpToolFilter object { read_only, tool_names }`

            A filter object to specify which tools are allowed.

            - `read_only: optional boolean`

              Indicates whether or not a tool modifies data or is read-only. If an
              MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              it will match this filter.

            - `tool_names: optional array of string`

              List of allowed tool names.

        - `authorization: optional string`

          An OAuth access token that can be used with a remote MCP server, either
          with a custom MCP server URL or a service connector. Your application
          must handle the OAuth authorization flow and provide the token here.

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          Identifier for service connectors, like those available in ChatGPT. One of
          `server_url`, `connector_id`, or `tunnel_id` must be provided. Learn more
          about service connectors [here](https://developers.openai.com/api/docs/guides/tools-connectors-mcp#connectors).

          Currently supported `connector_id` values are:

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

          Whether this MCP tool is deferred and discovered via tool search.

        - `headers: optional map[string] or null`

          Optional HTTP headers to send to the MCP server. Use for authentication
          or other purposes.

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          Specify which of the MCP server's tools require approval.

          - `McpToolApprovalFilter object { always, never }`

            Specify which of the MCP server's tools require approval. Can be
            `always`, `never`, or a filter object associated with tools
            that require approval.

            - `always: optional object { read_only, tool_names }`

              A filter object to specify which tools are allowed.

              - `read_only: optional boolean`

                Indicates whether or not a tool modifies data or is read-only. If an
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                it will match this filter.

              - `tool_names: optional array of string`

                List of allowed tool names.

            - `never: optional object { read_only, tool_names }`

              A filter object to specify which tools are allowed.

              - `read_only: optional boolean`

                Indicates whether or not a tool modifies data or is read-only. If an
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                it will match this filter.

              - `tool_names: optional array of string`

                List of allowed tool names.

          - `McpToolApprovalSetting = "always" or "never"`

            Specify a single approval policy for all tools. One of `always` or
            `never`. When set to `always`, all tools will require approval. When
            set to `never`, all tools will not require approval.

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          Optional description of the MCP server, used to provide more context.

        - `server_url: optional string`

          The URL for the MCP server. One of `server_url`, `connector_id`, or
          `tunnel_id` must be provided.

        - `tunnel_id: optional string`

          The Secure MCP Tunnel ID to use instead of a direct server URL. One of
          `server_url`, `connector_id`, or `tunnel_id` must be provided.

    - `tracing: optional RealtimeTracingConfig or null`

      Realtime API can write session traces to the [Traces Dashboard](https://platform.openai.com/logs?api=traces). Set to null to disable tracing. Once
      tracing is enabled for a session, the configuration cannot be modified.

      `auto` will create a trace for the session with default values for the
      workflow name, group id, and metadata.

      - `Auto = "auto"`

        Enables tracing and sets default values for tracing configuration options. Always `auto`.

        - `"auto"`

      - `TracingConfiguration object { group_id, metadata, workflow_name }`

        Granular configuration for tracing.

        - `group_id: optional string`

          The group id to attach to this trace to enable filtering and
          grouping in the Traces Dashboard.

        - `metadata: optional unknown`

          The arbitrary metadata to attach to this trace to enable
          filtering in the Traces Dashboard.

        - `workflow_name: optional string`

          The name of the workflow to attach to this trace. This is used to
          name the trace in the Traces Dashboard.

    - `truncation: optional RealtimeTruncation`

      When the number of tokens in a conversation exceeds the model's input token limit, the conversation be truncated, meaning messages (starting from the oldest) will not be included in the model's context. A 32k context model with 4,096 max output tokens can only include 28,224 tokens in the context before truncation occurs.

      Clients can configure truncation behavior to truncate with a lower max token limit, which is an effective way to control token usage and cost.

      Truncation will reduce the number of cached tokens on the next turn (busting the cache), since messages are dropped from the beginning of the context. However, clients can also configure truncation to retain messages up to a fraction of the maximum context size, which will reduce the need for future truncations and thus improve the cache rate.

      Truncation can be disabled entirely, which means the server will never truncate but would instead return an error if the conversation exceeds the model's input token limit.

      - `"auto" or "disabled"`

        The truncation strategy to use for the session. `auto` is the default truncation strategy. `disabled` will disable truncation and emit errors when the conversation exceeds the input token limit.

        - `"auto"`

        - `"disabled"`

      - `RetentionRatioTruncation object { retention_ratio, type, token_limits }`

        Retain a fraction of the conversation tokens when the conversation exceeds the input token limit. This allows you to amortize truncations across multiple turns, which can help improve cached token usage.

        - `retention_ratio: number`

          Fraction of post-instruction conversation tokens to retain (`0.0` - `1.0`) when the conversation exceeds the input token limit. Setting this to `0.8` means that messages will be dropped until 80% of the maximum allowed tokens are used. This helps reduce the frequency of truncations and improve cache rates.

        - `type: "retention_ratio"`

          Use retention ratio truncation.

          - `"retention_ratio"`

        - `token_limits: optional object { post_instructions }`

          Optional custom token limits for this truncation strategy. If not provided, the model's default token limits will be used.

          - `post_instructions: optional number`

            Maximum tokens allowed in the conversation after instructions (which including tool definitions). For example, setting this to 5,000 would mean that truncation would occur when the conversation exceeds 5,000 tokens after instructions. This cannot be higher than the model's context window size minus the maximum output tokens.

  - `RealtimeTranscriptionSessionCreateRequest object { type, audio, include }`

    Realtime transcription session object configuration.

    - `type: "transcription"`

      The type of session to create. Always `transcription` for transcription sessions.

      - `"transcription"`

    - `audio: optional RealtimeTranscriptionSessionAudio`

      Configuration for input and output audio.

      - `input: optional RealtimeTranscriptionSessionAudioInput`

        - `format: optional RealtimeAudioFormats`

          The PCM audio format. Only a 24kHz sample rate is supported.

        - `noise_reduction: optional object { type }`

          Configuration for input audio noise reduction. This can be set to `null` to turn off.
          Noise reduction filters audio added to the input audio buffer before it is sent to VAD and the model.
          Filtering the audio can improve VAD and turn detection accuracy (reducing false positives) and model performance by improving perception of the input audio.

          - `type: optional NoiseReductionType`

            Type of noise reduction. `near_field` is for close-talking microphones such as headphones, `far_field` is for far-field microphones such as laptop or conference room microphones.

        - `transcription: optional AudioTranscription`

          Configuration for input audio transcription, defaults to off and can be set to `null` to turn off once on. Input audio transcription is not native to the model, since the model consumes audio directly. Transcription runs asynchronously through [the /audio/transcriptions endpoint](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) and should be treated as guidance of input audio content rather than precisely what the model heard. The client can optionally set the language and prompt for transcription, these offer additional guidance to the transcription service.

        - `turn_detection: optional RealtimeTranscriptionSessionAudioInputTurnDetection or null`

          Configuration for turn detection, ether Server VAD or Semantic VAD. This can be set to `null` to turn off, in which case the client must manually trigger model response.

          Server VAD means that the model will detect the start and end of speech based on audio volume and respond at the end of user speech.

          Semantic VAD is more advanced and uses a turn detection model (in conjunction with VAD) to semantically estimate whether the user has finished speaking, then dynamically sets a timeout based on this probability. For example, if user audio trails off with "uhhm", the model will score a low probability of turn end and wait longer for the user to continue speaking. This can be useful for more natural conversations, but may have a higher latency.

          For `gpt-realtime-whisper` transcription sessions, turn detection must be
          set to `null`; VAD is not supported.

          - `ServerVad object { type, create_response, idle_timeout_ms, 4 more }`

            Server-side voice activity detection (VAD) which flips on when user speech is detected and off after a period of silence.

            - `type: "server_vad"`

              Type of turn detection, `server_vad` to turn on simple Server VAD.

              - `"server_vad"`

            - `create_response: optional boolean`

              Whether or not to automatically generate a response when a VAD stop event occurs. If `interrupt_response` is set to `false` this may fail to create a response if the model is already responding.

              If both `create_response` and `interrupt_response` are set to `false`, the model will never respond automatically but VAD events will still be emitted.

            - `idle_timeout_ms: optional number or null`

              Optional timeout after which a model response will be triggered automatically. This is
              useful for situations in which a long pause from the user is unexpected, such as a phone
              call. The model will effectively prompt the user to continue the conversation based
              on the current context.

              The timeout value will be applied after the last model response's audio has finished playing,
              i.e. it's set to the `response.done` time plus audio playback duration.

              An `input_audio_buffer.timeout_triggered` event (plus events
              associated with the Response) will be emitted when the timeout is reached.
              Idle timeout is currently only supported for `server_vad` mode.

            - `interrupt_response: optional boolean`

              Whether or not to automatically interrupt (cancel) any ongoing response with output to the default
              conversation (i.e. `conversation` of `auto`) when a VAD start event occurs. If `true` then the response will be cancelled, otherwise it will continue until complete.

              If both `create_response` and `interrupt_response` are set to `false`, the model will never respond automatically but VAD events will still be emitted.

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

            Server-side semantic turn detection which uses a model to determine when the user has finished speaking.

            - `type: "semantic_vad"`

              Type of turn detection, `semantic_vad` to turn on Semantic VAD.

              - `"semantic_vad"`

            - `create_response: optional boolean`

              Whether or not to automatically generate a response when a VAD stop event occurs.

            - `eagerness: optional "low" or "medium" or "high" or "auto"`

              Used only for `semantic_vad` mode. The eagerness of the model to respond. `low` will wait longer for the user to continue speaking, `high` will respond more quickly. `auto` is the default and is equivalent to `medium`. `low`, `medium`, and `high` have max timeouts of 8s, 4s, and 2s respectively.

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `interrupt_response: optional boolean`

              Whether or not to automatically interrupt any ongoing response with output to the default
              conversation (i.e. `conversation` of `auto`) when a VAD start event occurs.

    - `include: optional array of "item.input_audio_transcription.logprobs"`

      Additional fields to include in server outputs.

      `item.input_audio_transcription.logprobs`: Include logprobs for input audio transcription.

      - `"item.input_audio_transcription.logprobs"`

- `type: "session.update"`

  The event type, must be `session.update`.

  - `"session.update"`

- `event_id: optional string`

  Optional client-generated ID used to identify this event. This is an arbitrary string that a client may assign. It will be passed back if there is an error with the event, but the corresponding `session.updated` event will not include it.

### Example

```json
{
  "type": "session.update",
  "session": {
    "type": "realtime",
    "instructions": "You are a creative assistant that helps with design tasks.",
    "tools": [
      {
        "type": "function",
        "name": "display_color_palette",
        "description": "Call this function when a user asks for a color palette.",
        "parameters": {
          "type": "object",
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
    "tool_choice": "auto"
  }
}
```

<a id="input_audio_buffer.append"></a>

## input_audio_buffer.append

Send this event to append audio bytes to the input audio buffer. The audio
buffer is temporary storage you can write to and later commit. A "commit" will create a new
user message item in the conversation history from the buffer content and clear the buffer.
Input audio transcription (if enabled) will be generated when the buffer is committed.

If VAD is enabled the audio buffer is used to detect speech and the server will decide
when to commit. When Server VAD is disabled, you must commit the audio buffer
manually. Input audio noise reduction operates on writes to the audio buffer.

The client may choose how much audio to place in each event up to a maximum
of 15 MiB, for example streaming smaller chunks from the client may allow the
VAD to be more responsive. Unlike most other client events, the server will
not send a confirmation response to this event.

### Schema

Schema name: `RealtimeClientEventInputAudioBufferAppend`

- `audio: string`

  Base64-encoded audio bytes. This must be in the format specified by the
  `input_audio_format` field in the session configuration.

- `type: "input_audio_buffer.append"`

  The event type, must be `input_audio_buffer.append`.

  - `"input_audio_buffer.append"`

- `event_id: optional string`

  Optional client-generated ID used to identify this event.

### Example

```json
{
    "event_id": "event_456",
    "type": "input_audio_buffer.append",
    "audio": "Base64EncodedAudioData"
}
```

<a id="input_audio_buffer.commit"></a>

## input_audio_buffer.commit

Send this event to commit the user input audio buffer, which will create a  new user message item in the conversation. This event will produce an error  if the input audio buffer is empty. When in Server VAD mode, the client does  not need to send this event, the server will commit the audio buffer  automatically.

Committing the input audio buffer will trigger input audio transcription  (if enabled in session configuration), but it will not create a response  from the model. The server will respond with an `input_audio_buffer.committed` event.

### Schema

Schema name: `RealtimeClientEventInputAudioBufferCommit`

- `type: "input_audio_buffer.commit"`

  The event type, must be `input_audio_buffer.commit`.

  - `"input_audio_buffer.commit"`

- `event_id: optional string`

  Optional client-generated ID used to identify this event.

### Example

```json
{
    "event_id": "event_789",
    "type": "input_audio_buffer.commit"
}
```

<a id="input_audio_buffer.clear"></a>

## input_audio_buffer.clear

Send this event to clear the audio bytes in the buffer. The server will
respond with an `input_audio_buffer.cleared` event.

### Schema

Schema name: `RealtimeClientEventInputAudioBufferClear`

- `type: "input_audio_buffer.clear"`

  The event type, must be `input_audio_buffer.clear`.

  - `"input_audio_buffer.clear"`

- `event_id: optional string`

  Optional client-generated ID used to identify this event.

### Example

```json
{
    "event_id": "event_012",
    "type": "input_audio_buffer.clear"
}
```

<a id="conversation.item.create"></a>

## conversation.item.create

Add a new Item to the Conversation's context, including messages, function
calls, and function call responses. This event can be used both to populate a
"history" of the conversation and to add new items mid-stream, but has the
current limitation that it cannot populate assistant audio messages.

If successful, the server will respond with a `conversation.item.created`
event, otherwise an `error` event will be sent.

### Schema

Schema name: `RealtimeClientEventConversationItemCreate`

- `item: ConversationItem`

  A single item within a Realtime conversation.

  - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

    A system message in a Realtime conversation can be used to provide additional context or instructions to the model. This is similar but distinct from the instruction prompt provided at the start of a conversation, as system messages can be added at any point in the conversation. For major changes to the conversation's behavior, use instructions, but for smaller updates (e.g. "the user is now asking about a different topic"), use system messages.

    - `content: array of object { text, type }`

      The content of the message.

      - `text: optional string`

        The text content.

      - `type: optional "input_text"`

        The content type. Always `input_text` for system messages.

        - `"input_text"`

    - `role: "system"`

      The role of the message sender. Always `system`.

      - `"system"`

    - `type: "message"`

      The type of the item. Always `message`.

      - `"message"`

    - `id: optional string`

      The unique ID of the item. This may be provided by the client or generated by the server.

    - `object: optional "realtime.item"`

      Identifier for the API object being returned - always `realtime.item`. Optional when creating a new item.

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      The status of the item. Has no effect on the conversation.

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

    A user message item in a Realtime conversation.

    - `content: array of object { audio, detail, image_url, 3 more }`

      The content of the message.

      - `audio: optional string`

        Base64-encoded audio bytes (for `input_audio`), these will be parsed as the format specified in the session input audio type configuration. This defaults to PCM 16-bit 24kHz mono if not specified.

      - `detail: optional "auto" or "low" or "high"`

        The detail level of the image (for `input_image`). `auto` will default to `high`.

        - `"auto"`

        - `"low"`

        - `"high"`

      - `image_url: optional string`

        Base64-encoded image bytes (for `input_image`) as a data URI. For example `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`. Supported formats are PNG and JPEG.

      - `text: optional string`

        The text content (for `input_text`).

      - `transcript: optional string`

        Transcript of the audio (for `input_audio`). This is not sent to the model, but will be attached to the message item for reference.

      - `type: optional "input_text" or "input_audio" or "input_image"`

        The content type (`input_text`, `input_audio`, or `input_image`).

        - `"input_text"`

        - `"input_audio"`

        - `"input_image"`

    - `role: "user"`

      The role of the message sender. Always `user`.

      - `"user"`

    - `type: "message"`

      The type of the item. Always `message`.

      - `"message"`

    - `id: optional string`

      The unique ID of the item. This may be provided by the client or generated by the server.

    - `object: optional "realtime.item"`

      Identifier for the API object being returned - always `realtime.item`. Optional when creating a new item.

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      The status of the item. Has no effect on the conversation.

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

    An assistant message item in a Realtime conversation.

    - `content: array of object { audio, text, transcript, type }`

      The content of the message.

      - `audio: optional string`

        Base64-encoded audio bytes, these will be parsed as the format specified in the session output audio type configuration. This defaults to PCM 16-bit 24kHz mono if not specified.

      - `text: optional string`

        The text content.

      - `transcript: optional string`

        The transcript of the audio content, this will always be present if the output type is `audio`.

      - `type: optional "output_text" or "output_audio"`

        The content type, `output_text` or `output_audio` depending on the session `output_modalities` configuration.

        - `"output_text"`

        - `"output_audio"`

    - `role: "assistant"`

      The role of the message sender. Always `assistant`.

      - `"assistant"`

    - `type: "message"`

      The type of the item. Always `message`.

      - `"message"`

    - `id: optional string`

      The unique ID of the item. This may be provided by the client or generated by the server.

    - `object: optional "realtime.item"`

      Identifier for the API object being returned - always `realtime.item`. Optional when creating a new item.

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      The status of the item. Has no effect on the conversation.

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

    A function call item in a Realtime conversation.

    - `arguments: string`

      The arguments of the function call. This is a JSON-encoded string representing the arguments passed to the function, for example `{"arg1": "value1", "arg2": 42}`.

    - `name: string`

      The name of the function being called.

    - `type: "function_call"`

      The type of the item. Always `function_call`.

      - `"function_call"`

    - `id: optional string`

      The unique ID of the item. This may be provided by the client or generated by the server.

    - `call_id: optional string`

      The ID of the function call.

    - `object: optional "realtime.item"`

      Identifier for the API object being returned - always `realtime.item`. Optional when creating a new item.

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      The status of the item. Has no effect on the conversation.

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

    A function call output item in a Realtime conversation.

    - `call_id: string`

      The ID of the function call this output is for.

    - `output: string`

      The output of the function call, this is free text and can contain any information or simply be empty.

    - `type: "function_call_output"`

      The type of the item. Always `function_call_output`.

      - `"function_call_output"`

    - `id: optional string`

      The unique ID of the item. This may be provided by the client or generated by the server.

    - `object: optional "realtime.item"`

      Identifier for the API object being returned - always `realtime.item`. Optional when creating a new item.

      - `"realtime.item"`

    - `status: optional "completed" or "incomplete" or "in_progress"`

      The status of the item. Has no effect on the conversation.

      - `"completed"`

      - `"incomplete"`

      - `"in_progress"`

  - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

    A Realtime item responding to an MCP approval request.

    - `id: string`

      The unique ID of the approval response.

    - `approval_request_id: string`

      The ID of the approval request being answered.

    - `approve: boolean`

      Whether the request was approved.

    - `type: "mcp_approval_response"`

      The type of the item. Always `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `reason: optional string or null`

      Optional reason for the decision.

  - `RealtimeMcpListTools object { server_label, tools, type, id }`

    A Realtime item listing tools available on an MCP server.

    - `server_label: string`

      The label of the MCP server.

    - `tools: array of object { input_schema, name, annotations, description }`

      The tools available on the server.

      - `input_schema: unknown`

        The JSON schema describing the tool's input.

      - `name: string`

        The name of the tool.

      - `annotations: optional unknown or null`

        Additional annotations about the tool.

      - `description: optional string or null`

        The description of the tool.

    - `type: "mcp_list_tools"`

      The type of the item. Always `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `id: optional string`

      The unique ID of the list.

  - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

    A Realtime item representing an invocation of a tool on an MCP server.

    - `id: string`

      The unique ID of the tool call.

    - `arguments: string`

      A JSON string of the arguments passed to the tool.

    - `name: string`

      The name of the tool that was run.

    - `server_label: string`

      The label of the MCP server running the tool.

    - `type: "mcp_call"`

      The type of the item. Always `mcp_call`.

      - `"mcp_call"`

    - `approval_request_id: optional string or null`

      The ID of an associated approval request, if any.

    - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

      The error from the tool call, if any.

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

      The output from the tool call.

  - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

    A Realtime item requesting human approval of a tool invocation.

    - `id: string`

      The unique ID of the approval request.

    - `arguments: string`

      A JSON string of arguments for the tool.

    - `name: string`

      The name of the tool to run.

    - `server_label: string`

      The label of the MCP server making the request.

    - `type: "mcp_approval_request"`

      The type of the item. Always `mcp_approval_request`.

      - `"mcp_approval_request"`

- `type: "conversation.item.create"`

  The event type, must be `conversation.item.create`.

  - `"conversation.item.create"`

- `event_id: optional string`

  Optional client-generated ID used to identify this event.

- `previous_item_id: optional string`

  The ID of the preceding item after which the new item will be inserted. If not set, the new item will be appended to the end of the conversation.

  If set to `root`, the new item will be added to the beginning of the conversation.

  If set to an existing ID, it allows an item to be inserted mid-conversation. If the ID cannot be found, an error will be returned and the item will not be added.

### Example

```json
{
  "type": "conversation.item.create",
  "item": {
    "type": "message",
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

<a id="conversation.item.retrieve"></a>

## conversation.item.retrieve

Send this event when you want to retrieve the server's representation of a specific item in the conversation history. This is useful, for example, to inspect user audio after noise cancellation and VAD.
The server will respond with a `conversation.item.retrieved` event,
unless the item does not exist in the conversation history, in which case the
server will respond with an error.

### Schema

Schema name: `RealtimeClientEventConversationItemRetrieve`

- `item_id: string`

  The ID of the item to retrieve.

- `type: "conversation.item.retrieve"`

  The event type, must be `conversation.item.retrieve`.

  - `"conversation.item.retrieve"`

- `event_id: optional string`

  Optional client-generated ID used to identify this event.

### Example

```json
{
    "event_id": "event_901",
    "type": "conversation.item.retrieve",
    "item_id": "item_003"
}
```

<a id="conversation.item.truncate"></a>

## conversation.item.truncate

Send this event to truncate a previous assistant message’s audio. The server
will produce audio faster than realtime, so this event is useful when the user
interrupts to truncate audio that has already been sent to the client but not
yet played. This will synchronize the server's understanding of the audio with
the client's playback.

Truncating audio will delete the server-side text transcript to ensure there
is not text in the context that hasn't been heard by the user.

If successful, the server will respond with a `conversation.item.truncated`
event.

### Schema

Schema name: `RealtimeClientEventConversationItemTruncate`

- `audio_end_ms: number`

  Inclusive duration up to which audio is truncated, in milliseconds. If
  the audio_end_ms is greater than the actual audio duration, the server
  will respond with an error.

- `content_index: number`

  The index of the content part to truncate. Set this to `0`.

- `item_id: string`

  The ID of the assistant message item to truncate. Only assistant message
  items can be truncated.

- `type: "conversation.item.truncate"`

  The event type, must be `conversation.item.truncate`.

  - `"conversation.item.truncate"`

- `event_id: optional string`

  Optional client-generated ID used to identify this event.

### Example

```json
{
    "event_id": "event_678",
    "type": "conversation.item.truncate",
    "item_id": "item_002",
    "content_index": 0,
    "audio_end_ms": 1500
}
```

<a id="conversation.item.delete"></a>

## conversation.item.delete

Send this event when you want to remove any item from the conversation
history. The server will respond with a `conversation.item.deleted` event,
unless the item does not exist in the conversation history, in which case the
server will respond with an error.

### Schema

Schema name: `RealtimeClientEventConversationItemDelete`

- `item_id: string`

  The ID of the item to delete.

- `type: "conversation.item.delete"`

  The event type, must be `conversation.item.delete`.

  - `"conversation.item.delete"`

- `event_id: optional string`

  Optional client-generated ID used to identify this event.

### Example

```json
{
    "event_id": "event_901",
    "type": "conversation.item.delete",
    "item_id": "item_003"
}
```

<a id="response.create"></a>

## response.create

This event instructs the server to create a Response, which means triggering
model inference. When in Server VAD mode, the server will create Responses
automatically.

A Response will include at least one Item, and may have two, in which case
the second will be a function call. These Items will be appended to the
conversation history by default.

The server will respond with a `response.created` event, events for Items
and content created, and finally a `response.done` event to indicate the
Response is complete.

The `response.create` event includes inference configuration like
`instructions` and `tools`. If these are set, they will override the Session's
configuration for this Response only.

Responses can be created out-of-band of the default Conversation, meaning that they can
have arbitrary input, and it's possible to disable writing the output to the Conversation.
Only one Response can write to the default Conversation at a time, but otherwise multiple
Responses can be created in parallel. The `metadata` field is a good way to disambiguate
multiple simultaneous Responses.

Clients can set `conversation` to `none` to create a Response that does not write to the default
Conversation. Arbitrary input can be provided with the `input` field, which is an array accepting
raw Items and references to existing Items.

### Schema

Schema name: `RealtimeClientEventResponseCreate`

- `type: "response.create"`

  The event type, must be `response.create`.

  - `"response.create"`

- `event_id: optional string`

  Optional client-generated ID used to identify this event.

- `response: optional RealtimeResponseCreateParams`

  Create a new Realtime response with these parameters

  - `audio: optional RealtimeResponseCreateAudioOutput`

    Configuration for audio input and output.

    - `output: optional object { format, voice }`

      - `format: optional RealtimeAudioFormats`

        The format of the output audio.

        - `PCMAudio object { rate, type }`

          The PCM audio format. Only a 24kHz sample rate is supported.

          - `rate: optional 24000`

            The sample rate of the audio. Always `24000`.

            - `24000`

          - `type: optional "audio/pcm"`

            The audio format. Always `audio/pcm`.

            - `"audio/pcm"`

        - `PCMUAudio object { type }`

          The G.711 μ-law format.

          - `type: optional "audio/pcmu"`

            The audio format. Always `audio/pcmu`.

            - `"audio/pcmu"`

        - `PCMAAudio object { type }`

          The G.711 A-law format.

          - `type: optional "audio/pcma"`

            The audio format. Always `audio/pcma`.

            - `"audio/pcma"`

      - `voice: optional string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

        The voice the model uses to respond. Supported built-in voices are
        `alloy`, `ash`, `ballad`, `coral`, `echo`, `sage`, `shimmer`, `verse`,
        `marin`, and `cedar`. You may also provide a custom voice object with
        an `id`, for example `{ "id": "voice_1234" }`. Voice cannot be changed
        during the session once the model has responded with audio at least once.
        We recommend `marin` and `cedar` for best quality.

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

          Custom voice reference.

          - `id: string`

            The custom voice ID, e.g. `voice_1234`.

  - `conversation: optional string or "auto" or "none"`

    Controls which conversation the response is added to. Currently supports
    `auto` and `none`, with `auto` as the default value. The `auto` value
    means that the contents of the response will be added to the default
    conversation. Set this to `none` to create an out-of-band response which
    will not add items to default conversation.

    - `string`

    - `"auto" or "none"`

      Controls which conversation the response is added to. Currently supports
      `auto` and `none`, with `auto` as the default value. The `auto` value
      means that the contents of the response will be added to the default
      conversation. Set this to `none` to create an out-of-band response which
      will not add items to default conversation.

      - `"auto"`

      - `"none"`

  - `input: optional array of ConversationItem`

    Input items to include in the prompt for the model. Using this field
    creates a new context for this Response instead of using the default
    conversation. An empty array `[]` will clear the context for this Response.
    Note that this can include references to items that previously appeared in the session
    using their id.

    - `RealtimeConversationItemSystemMessage object { content, role, type, 3 more }`

      A system message in a Realtime conversation can be used to provide additional context or instructions to the model. This is similar but distinct from the instruction prompt provided at the start of a conversation, as system messages can be added at any point in the conversation. For major changes to the conversation's behavior, use instructions, but for smaller updates (e.g. "the user is now asking about a different topic"), use system messages.

      - `content: array of object { text, type }`

        The content of the message.

        - `text: optional string`

          The text content.

        - `type: optional "input_text"`

          The content type. Always `input_text` for system messages.

          - `"input_text"`

      - `role: "system"`

        The role of the message sender. Always `system`.

        - `"system"`

      - `type: "message"`

        The type of the item. Always `message`.

        - `"message"`

      - `id: optional string`

        The unique ID of the item. This may be provided by the client or generated by the server.

      - `object: optional "realtime.item"`

        Identifier for the API object being returned - always `realtime.item`. Optional when creating a new item.

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        The status of the item. Has no effect on the conversation.

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemUserMessage object { content, role, type, 3 more }`

      A user message item in a Realtime conversation.

      - `content: array of object { audio, detail, image_url, 3 more }`

        The content of the message.

        - `audio: optional string`

          Base64-encoded audio bytes (for `input_audio`), these will be parsed as the format specified in the session input audio type configuration. This defaults to PCM 16-bit 24kHz mono if not specified.

        - `detail: optional "auto" or "low" or "high"`

          The detail level of the image (for `input_image`). `auto` will default to `high`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `image_url: optional string`

          Base64-encoded image bytes (for `input_image`) as a data URI. For example `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...`. Supported formats are PNG and JPEG.

        - `text: optional string`

          The text content (for `input_text`).

        - `transcript: optional string`

          Transcript of the audio (for `input_audio`). This is not sent to the model, but will be attached to the message item for reference.

        - `type: optional "input_text" or "input_audio" or "input_image"`

          The content type (`input_text`, `input_audio`, or `input_image`).

          - `"input_text"`

          - `"input_audio"`

          - `"input_image"`

      - `role: "user"`

        The role of the message sender. Always `user`.

        - `"user"`

      - `type: "message"`

        The type of the item. Always `message`.

        - `"message"`

      - `id: optional string`

        The unique ID of the item. This may be provided by the client or generated by the server.

      - `object: optional "realtime.item"`

        Identifier for the API object being returned - always `realtime.item`. Optional when creating a new item.

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        The status of the item. Has no effect on the conversation.

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemAssistantMessage object { content, role, type, 3 more }`

      An assistant message item in a Realtime conversation.

      - `content: array of object { audio, text, transcript, type }`

        The content of the message.

        - `audio: optional string`

          Base64-encoded audio bytes, these will be parsed as the format specified in the session output audio type configuration. This defaults to PCM 16-bit 24kHz mono if not specified.

        - `text: optional string`

          The text content.

        - `transcript: optional string`

          The transcript of the audio content, this will always be present if the output type is `audio`.

        - `type: optional "output_text" or "output_audio"`

          The content type, `output_text` or `output_audio` depending on the session `output_modalities` configuration.

          - `"output_text"`

          - `"output_audio"`

      - `role: "assistant"`

        The role of the message sender. Always `assistant`.

        - `"assistant"`

      - `type: "message"`

        The type of the item. Always `message`.

        - `"message"`

      - `id: optional string`

        The unique ID of the item. This may be provided by the client or generated by the server.

      - `object: optional "realtime.item"`

        Identifier for the API object being returned - always `realtime.item`. Optional when creating a new item.

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        The status of the item. Has no effect on the conversation.

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCall object { arguments, name, type, 4 more }`

      A function call item in a Realtime conversation.

      - `arguments: string`

        The arguments of the function call. This is a JSON-encoded string representing the arguments passed to the function, for example `{"arg1": "value1", "arg2": 42}`.

      - `name: string`

        The name of the function being called.

      - `type: "function_call"`

        The type of the item. Always `function_call`.

        - `"function_call"`

      - `id: optional string`

        The unique ID of the item. This may be provided by the client or generated by the server.

      - `call_id: optional string`

        The ID of the function call.

      - `object: optional "realtime.item"`

        Identifier for the API object being returned - always `realtime.item`. Optional when creating a new item.

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        The status of the item. Has no effect on the conversation.

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeConversationItemFunctionCallOutput object { call_id, output, type, 3 more }`

      A function call output item in a Realtime conversation.

      - `call_id: string`

        The ID of the function call this output is for.

      - `output: string`

        The output of the function call, this is free text and can contain any information or simply be empty.

      - `type: "function_call_output"`

        The type of the item. Always `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        The unique ID of the item. This may be provided by the client or generated by the server.

      - `object: optional "realtime.item"`

        Identifier for the API object being returned - always `realtime.item`. Optional when creating a new item.

        - `"realtime.item"`

      - `status: optional "completed" or "incomplete" or "in_progress"`

        The status of the item. Has no effect on the conversation.

        - `"completed"`

        - `"incomplete"`

        - `"in_progress"`

    - `RealtimeMcpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      A Realtime item responding to an MCP approval request.

      - `id: string`

        The unique ID of the approval response.

      - `approval_request_id: string`

        The ID of the approval request being answered.

      - `approve: boolean`

        Whether the request was approved.

      - `type: "mcp_approval_response"`

        The type of the item. Always `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        Optional reason for the decision.

    - `RealtimeMcpListTools object { server_label, tools, type, id }`

      A Realtime item listing tools available on an MCP server.

      - `server_label: string`

        The label of the MCP server.

      - `tools: array of object { input_schema, name, annotations, description }`

        The tools available on the server.

        - `input_schema: unknown`

          The JSON schema describing the tool's input.

        - `name: string`

          The name of the tool.

        - `annotations: optional unknown or null`

          Additional annotations about the tool.

        - `description: optional string or null`

          The description of the tool.

      - `type: "mcp_list_tools"`

        The type of the item. Always `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `id: optional string`

        The unique ID of the list.

    - `RealtimeMcpToolCall object { id, arguments, name, 5 more }`

      A Realtime item representing an invocation of a tool on an MCP server.

      - `id: string`

        The unique ID of the tool call.

      - `arguments: string`

        A JSON string of the arguments passed to the tool.

      - `name: string`

        The name of the tool that was run.

      - `server_label: string`

        The label of the MCP server running the tool.

      - `type: "mcp_call"`

        The type of the item. Always `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        The ID of an associated approval request, if any.

      - `error: optional RealtimeMcpProtocolError or RealtimeMcpToolExecutionError or RealtimeMcphttpError or null`

        The error from the tool call, if any.

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

        The output from the tool call.

    - `RealtimeMcpApprovalRequest object { id, arguments, name, 2 more }`

      A Realtime item requesting human approval of a tool invocation.

      - `id: string`

        The unique ID of the approval request.

      - `arguments: string`

        A JSON string of arguments for the tool.

      - `name: string`

        The name of the tool to run.

      - `server_label: string`

        The label of the MCP server making the request.

      - `type: "mcp_approval_request"`

        The type of the item. Always `mcp_approval_request`.

        - `"mcp_approval_request"`

  - `instructions: optional string`

    The default system instructions (i.e. system message) prepended to model calls. This field allows the client to guide the model on desired responses. The model can be instructed on response content and format, (e.g. "be extremely succinct", "act friendly", "here are examples of good responses") and on audio behavior (e.g. "talk quickly", "inject emotion into your voice", "laugh frequently"). The instructions are not guaranteed to be followed by the model, but they provide guidance to the model on the desired behavior.
    Note that the server sets default instructions which will be used if this field is not set and are visible in the `session.created` event at the start of the session.

  - `max_output_tokens: optional number or "inf"`

    Maximum number of output tokens for a single assistant response,
    inclusive of tool calls. Provide an integer between 1 and 4096 to
    limit output tokens, or `inf` for the maximum available tokens for a
    given model. Defaults to `inf`.

    - `number`

    - `"inf"`

      - `"inf"`

  - `metadata: optional Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `output_modalities: optional array of "text" or "audio"`

    The set of modalities the model used to respond, currently the only possible values are
    `[\"audio\"]`, `[\"text\"]`. Audio output always include a text transcript. Setting the
    output to mode `text` will disable audio output from the model.

    - `"text"`

    - `"audio"`

  - `parallel_tool_calls: optional boolean`

    Whether the model may call multiple tools in parallel. Only supported by
    reasoning Realtime models such as `gpt-realtime-2`.

  - `prompt: optional ResponsePrompt or null`

    Reference to a prompt template and its variables.
    [Learn more](https://developers.openai.com/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

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

        An image input to the model. Learn about [image inputs](https://developers.openai.com/api/docs/guides/images-vision).

        - `detail: ImageDetail`

          The detail level of the image to be sent to the model. One of `high`, `low`, `auto`, or `original`. Defaults to `auto`.

          - `"low"`

          - `"high"`

          - `"auto"`

          - `"original"`

        - `type: "input_image"`

          The type of the input item. Always `input_image`.

          - `"input_image"`

        - `file_id: optional string or null`

          The ID of the file to be sent to the model.

        - `image_url: optional string or null`

          The URL of the image to be sent to the model. A fully qualified URL or base64 encoded image in a data URL.

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

          - `mode: "explicit"`

            The breakpoint mode. Always `explicit`.

            - `"explicit"`

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        A file input to the model.

        - `type: "input_file"`

          The type of the input item. Always `input_file`.

          - `"input_file"`

        - `detail: optional "auto" or "low" or "high"`

          The detail level of the file to be sent to the model. Use `auto` to let the system select the detail level; for GPT-5.6 and later models, `auto` uses high-quality rendering, which may increase input token usage. Use `low` for lower-cost rendering, or `high` to render the file at higher quality. Defaults to `auto`.

          - `"auto"`

          - `"low"`

          - `"high"`

        - `file_data: optional string`

          The content of the file to be sent to the model.

        - `file_id: optional string or null`

          The ID of the file to be sent to the model.

        - `file_url: optional string`

          The URL of the file to be sent to the model.

        - `filename: optional string`

          The name of the file to be sent to the model.

        - `prompt_cache_breakpoint: optional object { mode }`

          Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

          - `mode: "explicit"`

            The breakpoint mode. Always `explicit`.

            - `"explicit"`

    - `version: optional string or null`

      Optional version of the prompt template.

  - `reasoning: optional RealtimeReasoning`

    Configuration for reasoning-capable Realtime models such as `gpt-realtime-2`.

    - `effort: optional RealtimeReasoningEffort`

      Constrains effort on reasoning for reasoning-capable Realtime models such as
      `gpt-realtime-2`.

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

  - `tool_choice: optional ToolChoiceOptions or ToolChoiceFunction or ToolChoiceMcp`

    How the model chooses tools. Provide one of the string modes or force a specific
    function/MCP tool.

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      Controls which (if any) tool is called by the model.

      `none` means the model will not call any tool and instead generates a message.

      `auto` means the model can pick between generating a message or calling one or
      more tools.

      `required` means the model must call one or more tools.

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceFunction object { name, type }`

      Use this option to force the model to call a specific function.

      - `name: string`

        The name of the function to call.

      - `type: "function"`

        For function calling, the type is always `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      Use this option to force the model to call a specific tool on a remote MCP server.

      - `server_label: string`

        The label of the MCP server to use.

      - `type: "mcp"`

        For MCP tools, the type is always `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        The name of the tool to call on the server.

  - `tools: optional array of RealtimeFunctionTool or object { server_label, type, allowed_callers, 9 more }`

    Tools available to the model.

    - `RealtimeFunctionTool object { description, name, parameters, type }`

      - `description: optional string`

        The description of the function, including guidance on when and how
        to call it, and guidance about what to tell the user when calling
        (if anything).

      - `name: optional string`

        The name of the function.

      - `parameters: optional unknown`

        Parameters of the function in JSON Schema.

      - `type: optional "function"`

        The type of the tool, i.e. `function`.

        - `"function"`

    - `McpTool object { server_label, type, allowed_callers, 9 more }`

      Give the model access to additional tools via remote Model Context Protocol
      (MCP) servers. [Learn more about MCP](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

      - `server_label: string`

        A label for this MCP server, used to identify it in tool calls.

      - `type: "mcp"`

        The type of the MCP tool. Always `mcp`.

        - `"mcp"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        The tool invocation context(s).

        - `"direct"`

        - `"programmatic"`

      - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

        List of allowed tool names or a filter object.

        - `McpAllowedTools = array of string`

          A string array of allowed tool names

        - `McpToolFilter object { read_only, tool_names }`

          A filter object to specify which tools are allowed.

          - `read_only: optional boolean`

            Indicates whether or not a tool modifies data or is read-only. If an
            MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            it will match this filter.

          - `tool_names: optional array of string`

            List of allowed tool names.

      - `authorization: optional string`

        An OAuth access token that can be used with a remote MCP server, either
        with a custom MCP server URL or a service connector. Your application
        must handle the OAuth authorization flow and provide the token here.

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        Identifier for service connectors, like those available in ChatGPT. One of
        `server_url`, `connector_id`, or `tunnel_id` must be provided. Learn more
        about service connectors [here](https://developers.openai.com/api/docs/guides/tools-connectors-mcp#connectors).

        Currently supported `connector_id` values are:

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

        Whether this MCP tool is deferred and discovered via tool search.

      - `headers: optional map[string] or null`

        Optional HTTP headers to send to the MCP server. Use for authentication
        or other purposes.

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        Specify which of the MCP server's tools require approval.

        - `McpToolApprovalFilter object { always, never }`

          Specify which of the MCP server's tools require approval. Can be
          `always`, `never`, or a filter object associated with tools
          that require approval.

          - `always: optional object { read_only, tool_names }`

            A filter object to specify which tools are allowed.

            - `read_only: optional boolean`

              Indicates whether or not a tool modifies data or is read-only. If an
              MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              it will match this filter.

            - `tool_names: optional array of string`

              List of allowed tool names.

          - `never: optional object { read_only, tool_names }`

            A filter object to specify which tools are allowed.

            - `read_only: optional boolean`

              Indicates whether or not a tool modifies data or is read-only. If an
              MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              it will match this filter.

            - `tool_names: optional array of string`

              List of allowed tool names.

        - `McpToolApprovalSetting = "always" or "never"`

          Specify a single approval policy for all tools. One of `always` or
          `never`. When set to `always`, all tools will require approval. When
          set to `never`, all tools will not require approval.

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        Optional description of the MCP server, used to provide more context.

      - `server_url: optional string`

        The URL for the MCP server. One of `server_url`, `connector_id`, or
        `tunnel_id` must be provided.

      - `tunnel_id: optional string`

        The Secure MCP Tunnel ID to use instead of a direct server URL. One of
        `server_url`, `connector_id`, or `tunnel_id` must be provided.

### Example

```json
// Trigger a response with the default Conversation and no special parameters
{
  "type": "response.create",
}

// Trigger an out-of-band response that does not write to the default Conversation
{
  "type": "response.create",
  "response": {
    "instructions": "Provide a concise answer.",
    "tools": [], // clear any session tools
    "conversation": "none",
    "output_modalities": ["text"],
    "metadata": {
      "response_purpose": "summarization"
    },
    "input": [
      {
        "type": "item_reference",
        "id": "item_12345"
      },
      {
        "type": "message",
        "role": "user",
        "content": [
          {
            "type": "input_text",
            "text": "Summarize the above message in one sentence."
          }
        ]
      }
    ]
  }
}
```

<a id="response.cancel"></a>

## response.cancel

Send this event to cancel an in-progress response. The server will respond
with a `response.done` event with a status of `response.status=cancelled`. If
there is no response to cancel, the server will respond with an error. It's safe
to call `response.cancel` even if no response is in progress, an error will be
returned the session will remain unaffected.

### Schema

Schema name: `RealtimeClientEventResponseCancel`

- `type: "response.cancel"`

  The event type, must be `response.cancel`.

  - `"response.cancel"`

- `event_id: optional string`

  Optional client-generated ID used to identify this event.

- `response_id: optional string`

  A specific response ID to cancel - if not provided, will cancel an
  in-progress response in the default conversation.

### Example

```json
{
    "type": "response.cancel",
    "response_id": "resp_12345"
}
```

<a id="output_audio_buffer.clear"></a>

## output_audio_buffer.clear

**WebRTC/SIP Only:** Emit to cut off the current audio response. This will trigger the server to
stop generating audio and emit a `output_audio_buffer.cleared` event. This
event should be preceded by a `response.cancel` client event to stop the
generation of the current response.
[Learn more](https://developers.openai.com/api/docs/guides/realtime-conversations#client-and-server-events-for-audio-in-webrtc).

### Schema

Schema name: `RealtimeClientEventOutputAudioBufferClear`

- `type: "output_audio_buffer.clear"`

  The event type, must be `output_audio_buffer.clear`.

  - `"output_audio_buffer.clear"`

- `event_id: optional string`

  The unique ID of the client event used for error handling.

### Example

```json
{
    "event_id": "optional_client_event_id",
    "type": "output_audio_buffer.clear"
}
```
