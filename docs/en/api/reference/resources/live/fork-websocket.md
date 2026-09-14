# Fork WebSocket

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Start a new Live session from stored conversation state. Send and receive audio and control events on the new WebSocket connection.

WS `/v1/live/sessions/{session_id}/fork`

## Connection

`wss://api.openai.com/v1/live/sessions/{session_id}/fork`

Authenticate from your backend with your OpenAI API key in the `Authorization: Bearer $OPENAI_API_KEY` header. Keep the key on your server.

`session_id` (required path parameter): The ID of the stored source session to fork. The fork receives a new session ID.

No query parameters. After connecting, send session.start with a session overrides object. An empty object inherits the stored configuration. Do not supply a new model. Wait for session.started before sending audio or other commands.

## Inputs

Required once after connecting. Omitted settings are inherited, including store. You may override Responses delegation settings, storage, and the new WebSocket audio format. Frontend client permissions apply only to WebRTC forks.

### First message: session.start

```json
{
  "type": "session.start",
  "session": {}
}
```

[All client events](#client-events)

## Outputs

The server confirms the new session is ready. Use its new ID for subsequent sideband connections and session controls.

### Fork ready · excerpt: session.started

```json
{
  "type": "session.started",
  "event_id": "event_started_1",
  "session": {
    "id": "live_fork_123",
    "expires_at": 1788307200,
    "status": "active",
    "model": "gpt-live-1"
  }
}
```

[All server events](#server-events)

[Learn how to store a session and fork its conversation.](https://developers.openai.com/api/docs/guides/live-conversations#store-and-fork-a-session)

<a id="client-events"></a>

## Client events

<a id="session.start"></a>

### session.start

Start a Live session after connecting to a stored session’s fork WebSocket. Send an empty `session` object to use the stored configuration.

#### Schema

Schema name: `LiveForkSessionStartEvent`

- `session: ForkSessionConfig`

  Overrides for a stored session after connecting to the fork WebSocket. An empty object inherits the stored configuration; do not supply a new model. audio.format applies only to the new WebSocket connection. client overrides are only supported for WebRTC forks.

  - `audio: optional object { format }`

    Audio format for a WebSocket fork. WebRTC forks negotiate their audio format and must omit this field.

    - `format: optional AudioFormat`

      Audio encoding and sample rate for audio sent and received over a Live WebSocket connection. WebRTC and SIP negotiate their media format separately.

      - `AudioPCM object { rate, type }`

        Raw, mono 16-bit little-endian PCM audio for a Live WebSocket connection.

        - `rate: 16000 or 24000`

          Audio sample rate in hertz. Live WebSocket PCM audio supports 16000 or 24000 Hz.

          - `16000`

          - `24000`

        - `type: "audio/pcm"`

          The audio encoding. Always `audio/pcm`.

          - `"audio/pcm"`

      - `AudioPCMU object { rate, type }`

        Raw, mono G.711 μ-law audio for a Live WebSocket connection.

        - `rate: number`

          Audio sample rate in hertz. G.711 audio uses 8000 Hz.

        - `type: "audio/pcmu"`

          The audio encoding. Always `audio/pcmu`.

          - `"audio/pcmu"`

      - `AudioPCMA object { rate, type }`

        Raw, mono G.711 A-law audio for a Live WebSocket connection.

        - `rate: number`

          Audio sample rate in hertz. G.711 audio uses 8000 Hz.

        - `type: "audio/pcma"`

          The audio encoding. Always `audio/pcma`.

          - `"audio/pcma"`

  - `client: optional ClientConfig`

    Frontend data-channel permissions for a WebRTC fork. Omitted permissions inherit the stored values. Not supported for WebSocket forks.

    - `data_channel: DataChannelConfig`

      Client and server event permissions for the WebRTC frontend data channel.

      - `allowed_client_events: optional "all" or array of string`

        Client event types that the frontend data channel may send. Use 'all' to allow every client event; an empty array allows none. Omission preserves the existing allow-all behavior.

        - `"all"`

          - `"all"`

        - `array of string`

      - `allowed_server_events: optional "all" or array of ServerEventSelector`

        Server events that may be sent to the frontend data channel. Use 'all' to allow every server event; an empty array allows none. Omission preserves the existing allow-all behavior. Responses events use an object with type 'response.event' and a response_event selector.

        - `"all"`

          - `"all"`

        - `array of ServerEventSelector`

          - `type: string`

            The outer Live server event type. Use 'response.event' for Responses events.

          - `response_event: optional string`

            The nested Responses event type. Required when type is 'response.event'; forbidden for other event types.

  - `delegation: optional object { type, responses }`

    Overrides for the stored session’s Responses backend. Only supported when the stored session already uses Responses delegation; the delegation type cannot change.

    - `type: "responses"`

      The delegation owner. Always `responses` for tasks handled by the Responses API.

      - `"responses"`

    - `responses: optional ResponsesDelegationUpdateConfig`

      Responses backend settings to update. Omitted settings keep their existing values.

      - `instructions: optional string or null`

        Instructions for the delegated Responses model, separate from Live instructions. See [backend prompting](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt).

      - `max_output_tokens: optional number or null`

        Maximum number of output tokens for each delegated response.

      - `model: optional string`

        The Responses backend model to use for subsequent delegated requests. Omit to keep the current backend model.

      - `parallel_tool_calls: optional boolean or null`

        Whether the delegated Responses model may request multiple tool calls in a single response.

      - `reasoning: optional object { effort, summary }  or null`

        Reasoning settings passed to each delegated Responses request.

        - `effort: optional "none" or "minimal" or "low" or 3 more or null`

          How much reasoning effort the delegated Responses model should use. Supported values depend on the backend model.

          - `"none"`

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

        - `summary: optional "concise" or "detailed" or "auto" or null`

          The reasoning summary to request from the delegated Responses model, when supported.

          - `"concise"`

          - `"detailed"`

          - `"auto"`

      - `service_tier: optional "auto" or "default" or "fast_tier_temp_pilot" or 3 more or null`

        Service tier for delegated Responses requests.

        - `"auto"`

        - `"default"`

        - `"fast_tier_temp_pilot"`

        - `"flex"`

        - `"priority"`

        - `"ultrafast"`

      - `text: optional object { verbosity }  or null`

        Text generation settings passed to each delegated Responses request.

        - `verbosity: optional "low" or "medium" or "high" or null`

          The amount of detail in text generated by the Responses backend. This does not configure the Live model’s spoken delivery.

          - `"low"`

          - `"medium"`

          - `"high"`

      - `tool_choice: optional "auto" or "none" or "required" or object { name, type }  or object { name, server_label, type }`

        Controls which tool the Responses backend uses when handling a task delegated by the Live model.

        - `LiveToolChoiceEnum = "auto" or "none" or "required"`

          - `"auto"`

          - `"none"`

          - `"required"`

        - `LiveFunctionToolChoiceParam object { name, type }`

          - `name: string`

          - `type: "function"`

            - `"function"`

        - `LiveMCPToolChoiceParam object { name, server_label, type }`

          - `name: string`

          - `server_label: string`

          - `type: "mcp"`

            - `"mcp"`

      - `tools: optional array of FunctionTool or object { type }`

        Tools available to the Responses backend while it handles tasks delegated by the Live model.

        - `FunctionTool object { name, type, description, 2 more }`

          A function tool available to the Responses backend when the Live model delegates a task.

          - `name: string`

            The name the delegated Responses model uses when calling this function.

          - `type: "function"`

            The tool type. Always `function`.

            - `"function"`

          - `description: optional string or null`

            What the function does and when the delegated Responses model should call it.

          - `parameters: optional map[unknown] or null`

            A JSON Schema object describing the arguments accepted by the function.

          - `strict: optional boolean or null`

            Whether the delegated Responses model must follow the function’s parameter schema exactly.

        - `WebSearch object { type }`

          A web search tool available to the Live session’s Responses backend.

          - `type: "web_search"`

            The tool type. Always `web_search`.

            - `"web_search"`

  - `store: optional boolean`

    Whether to store the forked session. Omission inherits the stored session's setting.

- `type: "session.start"`

  The Live client event type. Always `session.start`.

  - `"session.start"`

- `event_id: optional string or null`

  Optional client identifier for correlating this command with a server event's client_event_id or error.client_event_id.

#### Example

```json
{
  "type": "session.start",
  "session": {}
}
```

<a id="session.update"></a>

### session.update

Update the delegation settings of an active Live session. The server acknowledges accepted changes with `session.updated`.

#### Schema

Schema name: `LiveSessionUpdateParam`

- `session: SessionUpdateConfig`

  Sparse delegation updates. Omitted settings retain their values. The delegation type cannot change, including resetting Responses delegation to null or client. Model, frontend instructions, audio, and startup input are immutable.

  - `delegation: optional ClientDelegation or object { type, responses }  or null`

    Delegation settings to update. The delegation type must match the current session; omitted settings retain their values.

    - `ClientDelegation object { type }`

      Delegate tasks to your application. The Live session emits delegation events that your backend handles.

      - `type: "client"`

        The delegation owner. Always `client` for tasks handled by your application.

        - `"client"`

    - `Responses object { type, responses }`

      Update the Responses backend for an existing Live session without changing delegation ownership.

      - `type: "responses"`

        The delegation owner. Always `responses` for tasks handled by the Responses API.

        - `"responses"`

      - `responses: optional ResponsesDelegationUpdateConfig`

        Responses backend settings to update. Omitted settings keep their existing values.

        - `instructions: optional string or null`

          Instructions for the delegated Responses model, separate from Live instructions. See [backend prompting](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt).

        - `max_output_tokens: optional number or null`

          Maximum number of output tokens for each delegated response.

        - `model: optional string`

          The Responses backend model to use for subsequent delegated requests. Omit to keep the current backend model.

        - `parallel_tool_calls: optional boolean or null`

          Whether the delegated Responses model may request multiple tool calls in a single response.

        - `reasoning: optional object { effort, summary }  or null`

          Reasoning settings passed to each delegated Responses request.

          - `effort: optional "none" or "minimal" or "low" or 3 more or null`

            How much reasoning effort the delegated Responses model should use. Supported values depend on the backend model.

            - `"none"`

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `summary: optional "concise" or "detailed" or "auto" or null`

            The reasoning summary to request from the delegated Responses model, when supported.

            - `"concise"`

            - `"detailed"`

            - `"auto"`

        - `service_tier: optional "auto" or "default" or "fast_tier_temp_pilot" or 3 more or null`

          Service tier for delegated Responses requests.

          - `"auto"`

          - `"default"`

          - `"fast_tier_temp_pilot"`

          - `"flex"`

          - `"priority"`

          - `"ultrafast"`

        - `text: optional object { verbosity }  or null`

          Text generation settings passed to each delegated Responses request.

          - `verbosity: optional "low" or "medium" or "high" or null`

            The amount of detail in text generated by the Responses backend. This does not configure the Live model’s spoken delivery.

            - `"low"`

            - `"medium"`

            - `"high"`

        - `tool_choice: optional "auto" or "none" or "required" or object { name, type }  or object { name, server_label, type }`

          Controls which tool the Responses backend uses when handling a task delegated by the Live model.

          - `LiveToolChoiceEnum = "auto" or "none" or "required"`

            - `"auto"`

            - `"none"`

            - `"required"`

          - `LiveFunctionToolChoiceParam object { name, type }`

            - `name: string`

            - `type: "function"`

              - `"function"`

          - `LiveMCPToolChoiceParam object { name, server_label, type }`

            - `name: string`

            - `server_label: string`

            - `type: "mcp"`

              - `"mcp"`

        - `tools: optional array of FunctionTool or object { type }`

          Tools available to the Responses backend while it handles tasks delegated by the Live model.

          - `FunctionTool object { name, type, description, 2 more }`

            A function tool available to the Responses backend when the Live model delegates a task.

            - `name: string`

              The name the delegated Responses model uses when calling this function.

            - `type: "function"`

              The tool type. Always `function`.

              - `"function"`

            - `description: optional string or null`

              What the function does and when the delegated Responses model should call it.

            - `parameters: optional map[unknown] or null`

              A JSON Schema object describing the arguments accepted by the function.

            - `strict: optional boolean or null`

              Whether the delegated Responses model must follow the function’s parameter schema exactly.

          - `WebSearch object { type }`

            A web search tool available to the Live session’s Responses backend.

            - `type: "web_search"`

              The tool type. Always `web_search`.

              - `"web_search"`

- `type: "session.update"`

  The Live client event type. Always `session.update`.

  - `"session.update"`

- `event_id: optional string or null`

  Optional client identifier for correlating this command with a server event's client_event_id or error.client_event_id.

#### Example

```json
{
  "type": "session.update",
  "event_id": "evt_update_001",
  "session": {
    "delegation": {
      "type": "responses",
      "responses": {
        "instructions": "Check restaurant availability. Ask before confirming a booking.",
        "max_output_tokens": 1024
      }
    }
  }
}
```

<a id="session.input_audio.append"></a>

### session.input_audio.append

Send audio to a Live session over its primary WebSocket. WebRTC and SIP sessions send audio over their media transport.

#### Schema

Schema name: `LiveInputAudioAppendEvent`

- `audio: string`

  Base64-encoded raw audio in the startup-selected format, without a WAV or other container header. Primary WebSocket only; media transports use their audio track. Audio appends have no acknowledgment. Reflected sideband server events reuse this event type and audio key, with no timestamps or event_id; their audio is always mono PCM16LE at 24 kHz.

- `type: "session.input_audio.append"`

  The Live client event type. Always `session.input_audio.append`.

  - `"session.input_audio.append"`

- `event_id: optional string or null`

  Optional client identifier for correlating this command with a server event's client_event_id or error.client_event_id.

#### Example

```json
{
  "type": "session.input_audio.append",
  "audio": "AACAAIAAAIAAAP9/AIAAgA=="
}
```

<a id="session.input_audio.mute"></a>

### session.input_audio.mute

Mute audio input to the Live model without closing the session. The server acknowledges with `session.input_audio.muted`.

#### Schema

Schema name: `LiveInputAudioMuteParam`

- `type: "session.input_audio.mute"`

  The Live client event type. Always `session.input_audio.mute`.

  - `"session.input_audio.mute"`

- `event_id: optional string or null`

  Optional client identifier for correlating this command with a server event's client_event_id or error.client_event_id.

#### Example

```json
{
  "type": "session.input_audio.mute",
  "event_id": "evt_mute_001"
}
```

<a id="session.input_audio.unmute"></a>

### session.input_audio.unmute

Resume audio input to a Live model after muting it. The server acknowledges with `session.input_audio.unmuted`.

#### Schema

Schema name: `LiveInputAudioUnmuteParam`

- `type: "session.input_audio.unmute"`

  The Live client event type. Always `session.input_audio.unmute`.

  - `"session.input_audio.unmute"`

- `event_id: optional string or null`

  Optional client identifier for correlating this command with a server event's client_event_id or error.client_event_id.

#### Example

```json
{
  "type": "session.input_audio.unmute",
  "event_id": "evt_unmute_001"
}
```

<a id="session.instructions.append"></a>

### session.instructions.append

Append instructions to the Live conversation while it is running, optionally associating them with an existing client delegation.

#### Schema

Schema name: `LiveInstructionsAppendParam`

- `content: string`

  Instruction text to append, limited to 500 tokens. This is a plain string, not an array of content parts.

- `delegation_id: string or null`

  Required, nullable. Set null for general session context, or use the ID from session.delegation.created for an existing client delegation. Non-null IDs are not accepted with Responses delegation.

- `type: "session.instructions.append"`

  The Live client event type. Always `session.instructions.append`.

  - `"session.instructions.append"`

- `event_id: optional string or null`

  Optional client identifier for correlating this command with a server event's client_event_id or error.client_event_id.

#### Example

```json
{
  "type": "session.instructions.append",
  "event_id": "evt_instructions_001",
  "delegation_id": null,
  "content": "The caller prefers outdoor seating."
}
```

<a id="session.thinking.append"></a>

### session.thinking.append

Provide silent reasoning or progress context to the Live model, optionally for an existing client delegation.

#### Schema

Schema name: `LiveThinkingAppendParam`

- `content: string`

  Silent reasoning or progress context, limited to 500 tokens. It does not directly request speech, but can influence later speech and is not a secrecy boundary.

- `delegation_id: string or null`

  Required, nullable. Set null for general session context, or use the ID from session.delegation.created for an existing client delegation. Non-null IDs are not accepted with Responses delegation.

- `type: "session.thinking.append"`

  The Live client event type. Always `session.thinking.append`.

  - `"session.thinking.append"`

- `event_id: optional string or null`

  Optional client identifier for correlating this command with a server event's client_event_id or error.client_event_id.

#### Example

```json
{
  "type": "session.thinking.append",
  "event_id": "evt_thinking_001",
  "delegation_id": "del_abc123",
  "content": "Checking availability for two guests at 7 PM."
}
```

<a id="session.commentary.append"></a>

### session.commentary.append

Provide context the Live model can communicate to the user, optionally for an existing client delegation.

#### Schema

Schema name: `LiveCommentaryAppendParam`

- `content: string`

  Speakable context for the Live model, limited to 500 tokens. Use this for a result the model should communicate; use session.thinking.append for silent context.

- `delegation_id: string or null`

  Required, nullable. Set null for general session context, or use the ID from session.delegation.created for an existing client delegation. Non-null IDs are not accepted with Responses delegation.

- `type: "session.commentary.append"`

  The Live client event type. Always `session.commentary.append`.

  - `"session.commentary.append"`

- `event_id: optional string or null`

  Optional client identifier for correlating this command with a server event's client_event_id or error.client_event_id.

#### Example

```json
{
  "type": "session.commentary.append",
  "event_id": "evt_commentary_001",
  "delegation_id": "del_abc123",
  "content": "There is an outdoor table for two at 7 PM. Ask whether to reserve it."
}
```

<a id="response.item.create"></a>

### response.item.create

Add an input item to the Live session’s Responses backend. Requires Responses delegation; use `response.create` to request a response.

#### Schema

Schema name: `LiveResponseItemCreateParam`

- `item: EasyInputMessage or object { content, role, status, type }  or ResponseOutputMessage or 30 more`

  An input item to append to the Responses backend conversation, such as a user message or a function tool result.

  - `EasyInputMessage object { content, role, phase, type }`

    A message input to the model with a role indicating instruction following
    hierarchy. Instructions given with the `developer` or `system` role take
    precedence over instructions given with the `user` role. Messages with the
    `assistant` role are presumed to have been generated by the model in previous
    interactions.

    - `content: string or ResponseInputMessageContentList`

      Text, image, or audio input to the model, used to generate a response.
      Can also contain previous assistant responses.

      - `TextInput = string`

        A text input to the model.

      - `ResponseInputMessageContentList = array of ResponseInputContent`

        A list of one or many input items to the model, containing different content
        types.

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

    - `role: "user" or "assistant" or "system" or "developer"`

      The role of the message input. One of `user`, `assistant`, `system`, or
      `developer`.

      - `"user"`

      - `"assistant"`

      - `"system"`

      - `"developer"`

    - `phase: optional "commentary" or "final_answer" or null`

      Labels an `assistant` message as intermediate commentary (`commentary`) or the final answer (`final_answer`).
      For models like `gpt-5.3-codex` and beyond, when sending follow-up requests, preserve and resend
      phase on all assistant messages — dropping it can degrade performance. Not used for user messages.

      - `"commentary"`

      - `"final_answer"`

    - `type: optional "message"`

      The type of the message input. Always `message`.

      - `"message"`

  - `Message object { content, role, status, type }`

    A message input to the model with a role indicating instruction following
    hierarchy. Instructions given with the `developer` or `system` role take
    precedence over instructions given with the `user` role.

    - `content: ResponseInputMessageContentList`

      A list of one or many input items to the model, containing different content
      types.

    - `role: "user" or "system" or "developer"`

      The role of the message input. One of `user`, `system`, or `developer`.

      - `"user"`

      - `"system"`

      - `"developer"`

    - `status: optional "in_progress" or "completed" or "incomplete"`

      The status of item. One of `in_progress`, `completed`, or
      `incomplete`. Populated when items are returned via API.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

    - `type: optional "message"`

      The type of the message input. Always set to `message`.

      - `"message"`

  - `ResponseOutputMessage object { id, content, role, 3 more }`

    An output message from the model.

    - `id: string`

      The unique ID of the output message.

    - `content: array of ResponseOutputText or ResponseOutputRefusal`

      The content of the output message.

      - `ResponseOutputText object { annotations, logprobs, text, type }`

        A text output from the model.

        - `annotations: array of object { file_id, filename, index, type }  or object { end_index, start_index, title, 2 more }  or object { container_id, end_index, file_id, 3 more }  or object { file_id, index, type }`

          The annotations of the text output.

          - `FileCitation object { file_id, filename, index, type }`

            A citation to a file.

            - `file_id: string`

              The ID of the file.

            - `filename: string`

              The filename of the file cited.

            - `index: number`

              The index of the file in the list of files.

            - `type: "file_citation"`

              The type of the file citation. Always `file_citation`.

              - `"file_citation"`

          - `URLCitation object { end_index, start_index, title, 2 more }`

            A citation for a web resource used to generate a model response.

            - `end_index: number`

              The index of the last character of the URL citation in the message.

            - `start_index: number`

              The index of the first character of the URL citation in the message.

            - `title: string`

              The title of the web resource.

            - `type: "url_citation"`

              The type of the URL citation. Always `url_citation`.

              - `"url_citation"`

            - `url: string`

              The URL of the web resource.

          - `ContainerFileCitation object { container_id, end_index, file_id, 3 more }`

            A citation for a container file used to generate a model response.

            - `container_id: string`

              The ID of the container file.

            - `end_index: number`

              The index of the last character of the container file citation in the message.

            - `file_id: string`

              The ID of the file.

            - `filename: string`

              The filename of the container file cited.

            - `start_index: number`

              The index of the first character of the container file citation in the message.

            - `type: "container_file_citation"`

              The type of the container file citation. Always `container_file_citation`.

              - `"container_file_citation"`

          - `FilePath object { file_id, index, type }`

            A path to a file.

            - `file_id: string`

              The ID of the file.

            - `index: number`

              The index of the file in the list of files.

            - `type: "file_path"`

              The type of the file path. Always `file_path`.

              - `"file_path"`

        - `logprobs: array of object { token, bytes, logprob, top_logprobs }`

          - `token: string`

          - `bytes: array of number`

          - `logprob: number`

          - `top_logprobs: array of object { token, bytes, logprob }`

            - `token: string`

            - `bytes: array of number`

            - `logprob: number`

        - `text: string`

          The text output from the model.

        - `type: "output_text"`

          The type of the output text. Always `output_text`.

          - `"output_text"`

      - `ResponseOutputRefusal object { refusal, type }`

        A refusal from the model.

        - `refusal: string`

          The refusal explanation from the model.

        - `type: "refusal"`

          The type of the refusal. Always `refusal`.

          - `"refusal"`

    - `role: "assistant"`

      The role of the output message. Always `assistant`.

      - `"assistant"`

    - `status: "in_progress" or "completed" or "incomplete"`

      The status of the message input. One of `in_progress`, `completed`, or
      `incomplete`. Populated when input items are returned via API.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

    - `type: "message"`

      The type of the output message. Always `message`.

      - `"message"`

    - `phase: optional "commentary" or "final_answer" or null`

      Labels an `assistant` message as intermediate commentary (`commentary`) or the final answer (`final_answer`).
      For models like `gpt-5.3-codex` and beyond, when sending follow-up requests, preserve and resend
      phase on all assistant messages — dropping it can degrade performance. Not used for user messages.

      - `"commentary"`

      - `"final_answer"`

  - `FileSearchCall object { id, queries, status, 2 more }`

    The results of a file search tool call. See the
    [file search guide](https://developers.openai.com/api/docs/guides/tools-file-search) for more information.

    - `id: string`

      The unique ID of the file search tool call.

    - `queries: array of string`

      The queries used to search for files.

    - `status: "in_progress" or "searching" or "completed" or 2 more`

      The status of the file search tool call. One of `in_progress`,
      `searching`, `incomplete` or `failed`,

      - `"in_progress"`

      - `"searching"`

      - `"completed"`

      - `"incomplete"`

      - `"failed"`

    - `type: "file_search_call"`

      The type of the file search tool call. Always `file_search_call`.

      - `"file_search_call"`

    - `results: optional array of object { attributes, file_id, filename, 2 more }  or null`

      The results of the file search tool call.

      - `attributes: optional map[string or number or boolean] or null`

        Set of 16 key-value pairs that can be attached to an object. This can be
        useful for storing additional information about the object in a structured
        format, and querying for objects via API or the dashboard. Keys are strings
        with a maximum length of 64 characters. Values are strings with a maximum
        length of 512 characters, booleans, or numbers.

        - `string`

        - `number`

        - `boolean`

      - `file_id: optional string`

        The unique ID of the file.

      - `filename: optional string`

        The name of the file.

      - `score: optional number`

        The relevance score of the file - a value between 0 and 1.

      - `text: optional string`

        The text that was retrieved from the file.

  - `ComputerCall object { id, call_id, pending_safety_checks, 4 more }`

    A tool call to a computer use tool. See the
    [computer use guide](https://developers.openai.com/api/docs/guides/tools-computer-use) for more information.

    - `id: string`

      The unique ID of the computer call.

    - `call_id: string`

      An identifier used when responding to the tool call with output.

    - `pending_safety_checks: array of object { id, code, message }`

      The pending safety checks for the computer call.

      - `id: string`

        The ID of the pending safety check.

      - `code: optional string or null`

        The type of the pending safety check.

      - `message: optional string or null`

        Details about the pending safety check.

    - `status: "in_progress" or "completed" or "incomplete"`

      The status of the item. One of `in_progress`, `completed`, or
      `incomplete`. Populated when items are returned via API.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

    - `type: "computer_call"`

      The type of the computer call. Always `computer_call`.

      - `"computer_call"`

    - `action: optional ComputerAction`

      A click action.

      - `Click object { button, type, x, 2 more }`

        A click action.

        - `button: "left" or "right" or "wheel" or 2 more`

          Indicates which mouse button was pressed during the click. One of `left`, `right`, `wheel`, `back`, or `forward`.

          - `"left"`

          - `"right"`

          - `"wheel"`

          - `"back"`

          - `"forward"`

        - `type: "click"`

          Specifies the event type. For a click action, this property is always `click`.

          - `"click"`

        - `x: number`

          The x-coordinate where the click occurred.

        - `y: number`

          The y-coordinate where the click occurred.

        - `keys: optional array of string or null`

          The keys being held while clicking.

      - `DoubleClick object { keys, type, x, y }`

        A double click action.

        - `keys: array of string or null`

          The keys being held while double-clicking.

        - `type: "double_click"`

          Specifies the event type. For a double click action, this property is always set to `double_click`.

          - `"double_click"`

        - `x: number`

          The x-coordinate where the double click occurred.

        - `y: number`

          The y-coordinate where the double click occurred.

      - `Drag object { path, type, keys }`

        A drag action.

        - `path: array of object { x, y }`

          An array of coordinates representing the path of the drag action. Coordinates will appear as an array of objects, eg

          ```
          [
            { x: 100, y: 200 },
            { x: 200, y: 300 }
          ]
          ```

          - `x: number`

            The x-coordinate.

          - `y: number`

            The y-coordinate.

        - `type: "drag"`

          Specifies the event type. For a drag action, this property is always set to `drag`.

          - `"drag"`

        - `keys: optional array of string or null`

          The keys being held while dragging the mouse.

      - `Keypress object { keys, type }`

        A collection of keypresses the model would like to perform.

        - `keys: array of string`

          The combination of keys the model is requesting to be pressed. This is an array of strings, each representing a key.

        - `type: "keypress"`

          Specifies the event type. For a keypress action, this property is always set to `keypress`.

          - `"keypress"`

      - `Move object { type, x, y, keys }`

        A mouse move action.

        - `type: "move"`

          Specifies the event type. For a move action, this property is always set to `move`.

          - `"move"`

        - `x: number`

          The x-coordinate to move to.

        - `y: number`

          The y-coordinate to move to.

        - `keys: optional array of string or null`

          The keys being held while moving the mouse.

      - `Screenshot object { type }`

        A screenshot action.

        - `type: "screenshot"`

          Specifies the event type. For a screenshot action, this property is always set to `screenshot`.

          - `"screenshot"`

      - `Scroll object { scroll_x, scroll_y, type, 3 more }`

        A scroll action.

        - `scroll_x: number`

          The horizontal scroll distance.

        - `scroll_y: number`

          The vertical scroll distance.

        - `type: "scroll"`

          Specifies the event type. For a scroll action, this property is always set to `scroll`.

          - `"scroll"`

        - `x: number`

          The x-coordinate where the scroll occurred.

        - `y: number`

          The y-coordinate where the scroll occurred.

        - `keys: optional array of string or null`

          The keys being held while scrolling.

      - `Type object { text, type }`

        An action to type in text.

        - `text: string`

          The text to type.

        - `type: "type"`

          Specifies the event type. For a type action, this property is always set to `type`.

          - `"type"`

      - `Wait object { type }`

        A wait action.

        - `type: "wait"`

          Specifies the event type. For a wait action, this property is always set to `wait`.

          - `"wait"`

    - `actions: optional ComputerActionList`

      Flattened batched actions for `computer_use`. Each action includes an
      `type` discriminator and action-specific fields.

      - `Click object { button, type, x, 2 more }`

        A click action.

      - `DoubleClick object { keys, type, x, y }`

        A double click action.

      - `Drag object { path, type, keys }`

        A drag action.

      - `Keypress object { keys, type }`

        A collection of keypresses the model would like to perform.

      - `Move object { type, x, y, keys }`

        A mouse move action.

      - `Screenshot object { type }`

        A screenshot action.

      - `Scroll object { scroll_x, scroll_y, type, 3 more }`

        A scroll action.

      - `Type object { text, type }`

        An action to type in text.

      - `Wait object { type }`

        A wait action.

  - `ComputerCallOutput object { call_id, output, type, 3 more }`

    The output of a computer tool call.

    - `call_id: string`

      The ID of the computer tool call that produced the output.

    - `output: ResponseComputerToolCallOutputScreenshot`

      A computer screenshot image used with the computer use tool.

      - `type: "computer_screenshot"`

        Specifies the event type. For a computer screenshot, this property is
        always set to `computer_screenshot`.

        - `"computer_screenshot"`

      - `file_id: optional string`

        The identifier of an uploaded file that contains the screenshot.

      - `image_url: optional string`

        The URL of the screenshot image.

    - `type: "computer_call_output"`

      The type of the computer tool call output. Always `computer_call_output`.

      - `"computer_call_output"`

    - `id: optional string or null`

      The ID of the computer tool call output.

    - `acknowledged_safety_checks: optional array of object { id, code, message }  or null`

      The safety checks reported by the API that have been acknowledged by the developer.

      - `id: string`

        The ID of the pending safety check.

      - `code: optional string or null`

        The type of the pending safety check.

      - `message: optional string or null`

        Details about the pending safety check.

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      The status of the message input. One of `in_progress`, `completed`, or `incomplete`. Populated when input items are returned via API.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `WebSearchCall object { id, action, status, type }`

    The results of a web search tool call. See the
    [web search guide](https://developers.openai.com/api/docs/guides/tools-web-search) for more information.

    - `id: string`

      The unique ID of the web search tool call.

    - `action: object { type, queries, query, sources }  or object { type, url }  or object { pattern, type, url }`

      An object describing the specific action taken in this web search call.
      Includes details on how the model used the web (search, open_page, find_in_page).

      - `Search object { type, queries, query, sources }`

        Action type "search" - Performs a web search query.

        - `type: "search"`

          The action type.

          - `"search"`

        - `queries: optional array of string`

          The search queries.

        - `query: optional string`

          The search query.

        - `sources: optional array of object { type, url }`

          The sources used in the search.

          - `type: "url"`

            The type of source. Always `url`.

            - `"url"`

          - `url: string`

            The URL of the source.

      - `OpenPage object { type, url }`

        Action type "open_page" - Opens a specific URL from search results.

        - `type: "open_page"`

          The action type.

          - `"open_page"`

        - `url: optional string or null`

          The URL opened by the model.

      - `FindInPage object { pattern, type, url }`

        Action type "find_in_page": Searches for a pattern within a loaded page.

        - `pattern: string`

          The pattern or text to search for within the page.

        - `type: "find_in_page"`

          The action type.

          - `"find_in_page"`

        - `url: string`

          The URL of the page searched for the pattern.

    - `status: "in_progress" or "searching" or "completed" or 2 more`

      The status of the web search tool call.

      - `"in_progress"`

      - `"searching"`

      - `"completed"`

      - `"failed"`

      - `"incomplete"`

    - `type: "web_search_call"`

      The type of the web search tool call. Always `web_search_call`.

      - `"web_search_call"`

  - `FunctionCall object { arguments, call_id, name, 6 more }`

    A tool call to run a function. See the
    [function calling guide](https://developers.openai.com/api/docs/guides/function-calling) for more information.

    - `arguments: string`

      A JSON string of the arguments to pass to the function.

    - `call_id: string`

      The unique ID of the function tool call generated by the model.

    - `name: string`

      The name of the function to run.

    - `type: "function_call"`

      The type of the function tool call. Always `function_call`.

      - `"function_call"`

    - `id: optional string`

      The unique ID of the function tool call.

    - `async: optional boolean`

      Whether the function tool call runs asynchronously.

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      The execution context that produced this tool call.

      - `Direct object { type }`

        - `type: "direct"`

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          The call ID of the program item that produced this tool call.

        - `type: "program"`

          - `"program"`

    - `namespace: optional string`

      The namespace of the function to run.

    - `status: optional "in_progress" or "completed" or "incomplete"`

      The status of the item. One of `in_progress`, `completed`, or
      `incomplete`. Populated when items are returned via API.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `FunctionCallOutput object { output, type, id, 5 more }`

    The output of a function tool call.

    - `output: string or array of ResponseInputTextContent or ResponseInputImageContent or ResponseInputFileContent`

      Text, image, or file output of the function tool call.

      - `string`

        A JSON string of the output of the function tool call.

      - `array of ResponseInputTextContent or ResponseInputImageContent or ResponseInputFileContent`

        An array of content outputs (text, image, file) for the function tool call.

        - `ResponseInputTextContent object { text, type, prompt_cache_breakpoint }`

          A text input to the model.

          - `text: string`

            The text input to the model.

          - `type: "input_text"`

            The type of the input item. Always `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }  or null`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

            - `mode: "explicit"`

              The breakpoint mode. Always `explicit`.

              - `"explicit"`

        - `ResponseInputImageContent object { type, detail, file_id, 2 more }`

          An image input to the model. Learn about [image inputs](https://developers.openai.com/api/docs/guides/images-vision)

          - `type: "input_image"`

            The type of the input item. Always `input_image`.

            - `"input_image"`

          - `detail: optional ImageDetail or null`

            The detail level of the image to be sent to the model. One of `high`, `low`, `auto`, or `original`. Defaults to `auto`.

          - `file_id: optional string or null`

            The ID of the file to be sent to the model.

          - `image_url: optional string or null`

            The URL of the image to be sent to the model. A fully qualified URL or base64 encoded image in a data URL.

          - `prompt_cache_breakpoint: optional object { mode }  or null`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

            - `mode: "explicit"`

              The breakpoint mode. Always `explicit`.

              - `"explicit"`

        - `ResponseInputFileContent object { type, detail, file_data, 4 more }`

          A file input to the model.

          - `type: "input_file"`

            The type of the input item. Always `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            The detail level of the file to be sent to the model. Use `auto` to let the system select the detail level; for GPT-5.6 and later models, `auto` uses high-quality rendering, which may increase input token usage. Use `low` for lower-cost rendering, or `high` to render the file at higher quality. Defaults to `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string or null`

            The base64-encoded data of the file to be sent to the model.

          - `file_id: optional string or null`

            The ID of the file to be sent to the model.

          - `file_url: optional string or null`

            The URL of the file to be sent to the model.

          - `filename: optional string or null`

            The name of the file to be sent to the model.

          - `prompt_cache_breakpoint: optional object { mode }  or null`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

            - `mode: "explicit"`

              The breakpoint mode. Always `explicit`.

              - `"explicit"`

    - `type: "function_call_output"`

      The type of the function tool call output. Always `function_call_output`.

      - `"function_call_output"`

    - `id: optional string or null`

      The unique ID of the function tool call output. Populated when this item is returned via API.

    - `call_id: optional string or null`

      The unique ID of the function tool call generated by the model.

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      The execution context that produced this tool call.

      - `Direct object { type }`

        - `type: "direct"`

          The caller type. Always `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          The call ID of the program item that produced this tool call.

        - `type: "program"`

          The caller type. Always `program`.

          - `"program"`

    - `name: optional string or null`

      The name of the tool that produced the output.

    - `namespace: optional string or null`

      The namespace of the tool that produced the output.

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      The status of the item. One of `in_progress`, `completed`, or `incomplete`. Populated when items are returned via API.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `ToolSearchCall object { arguments, type, id, 3 more }`

    - `arguments: unknown`

      The arguments supplied to the tool search call.

    - `type: "tool_search_call"`

      The item type. Always `tool_search_call`.

      - `"tool_search_call"`

    - `id: optional string or null`

      The unique ID of this tool search call.

    - `call_id: optional string or null`

      The unique ID of the tool search call generated by the model.

    - `execution: optional "server" or "client"`

      Whether tool search was executed by the server or by the client.

      - `"server"`

      - `"client"`

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      The status of the tool search call.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `ToolSearchOutput object { tools, type, id, 3 more }`

    - `tools: array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

      The loaded tool definitions returned by the tool search output.

      - `Function object { name, parameters, strict, 6 more }`

        Defines a function in your own code the model can choose to call. Learn more about [function calling](https://developers.openai.com/api/docs/guides/function-calling).

        - `name: string`

          The name of the function to call.

        - `parameters: map[unknown] or null`

          A JSON schema object describing the parameters of the function.

        - `strict: boolean or null`

          Whether strict parameter validation is enforced for this function tool.

        - `type: "function"`

          The type of the function tool. Always `function`.

          - `"function"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          The tool invocation context(s).

          - `"direct"`

          - `"programmatic"`

        - `async: optional boolean`

        - `defer_loading: optional boolean`

          Whether this function is deferred and loaded via tool search.

        - `description: optional string or null`

          A description of the function. Used by the model to determine whether or not to call the function.

        - `output_schema: optional map[unknown] or null`

          A JSON schema object describing the JSON value encoded in string outputs for this function.

      - `FileSearch object { type, vector_store_ids, filters, 2 more }`

        A tool that searches for relevant content from uploaded files. Learn more about the [file search tool](https://developers.openai.com/api/docs/guides/tools-file-search).

        - `type: "file_search"`

          The type of the file search tool. Always `file_search`.

          - `"file_search"`

        - `vector_store_ids: array of string`

          The IDs of the vector stores to search.

        - `filters: optional ComparisonFilter or CompoundFilter or null`

          A filter to apply.

          - `ComparisonFilter object { key, type, value }`

            A filter used to compare a specified attribute key to a given value using a defined comparison operation.

            - `key: string`

              The key to compare against the value.

            - `type: "eq" or "ne" or "gt" or 5 more`

              Specifies the comparison operator: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

              - `eq`: equals
              - `ne`: not equal
              - `gt`: greater than
              - `gte`: greater than or equal
              - `lt`: less than
              - `lte`: less than or equal
              - `in`: in
              - `nin`: not in

              - `"eq"`

              - `"ne"`

              - `"gt"`

              - `"gte"`

              - `"lt"`

              - `"lte"`

              - `"in"`

              - `"nin"`

            - `value: string or number or boolean or array of string or number`

              The value to compare against the attribute key; supports string, number, or boolean types.

              - `string`

              - `number`

              - `boolean`

              - `array of string or number`

                - `string`

                - `number`

          - `CompoundFilter object { filters, type }`

            Combine multiple filters using `and` or `or`.

            - `filters: array of ComparisonFilter or unknown`

              Array of filters to combine. Items can be `ComparisonFilter` or `CompoundFilter`.

              - `ComparisonFilter object { key, type, value }`

                A filter used to compare a specified attribute key to a given value using a defined comparison operation.

              - `unknown`

            - `type: "and" or "or"`

              Type of operation: `and` or `or`.

              - `"and"`

              - `"or"`

        - `max_num_results: optional number`

          The maximum number of results to return. This number should be between 1 and 50 inclusive.

        - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

          Ranking options for search.

          - `hybrid_search: optional object { embedding_weight, text_weight }`

            Weights that control how reciprocal rank fusion balances semantic embedding matches versus sparse keyword matches when hybrid search is enabled.

            - `embedding_weight: number`

              The weight of the embedding in the reciprocal ranking fusion.

            - `text_weight: number`

              The weight of the text in the reciprocal ranking fusion.

          - `ranker: optional "auto" or "default-2024-11-15"`

            The ranker to use for the file search.

            - `"auto"`

            - `"default-2024-11-15"`

          - `score_threshold: optional number`

            The score threshold for the file search, a number between 0 and 1. Numbers closer to 1 will attempt to return only the most relevant results, but may return fewer results.

      - `Computer object { type }`

        A tool that controls a virtual computer. Learn more about the [computer tool](https://developers.openai.com/api/docs/guides/tools-computer-use).

        - `type: "computer"`

          The type of the computer tool. Always `computer`.

          - `"computer"`

      - `ComputerUsePreview object { display_height, display_width, environment, type }`

        A tool that controls a virtual computer. Learn more about the [computer tool](https://developers.openai.com/api/docs/guides/tools-computer-use).

        - `display_height: number`

          The height of the computer display.

        - `display_width: number`

          The width of the computer display.

        - `environment: "windows" or "mac" or "linux" or 2 more`

          The type of computer environment to control.

          - `"windows"`

          - `"mac"`

          - `"linux"`

          - `"ubuntu"`

          - `"browser"`

        - `type: "computer_use_preview"`

          The type of the computer use tool. Always `computer_use_preview`.

          - `"computer_use_preview"`

      - `WebSearch object { type, external_web_access, filters, 2 more }`

        Search the Internet for sources related to the prompt. Learn more about the
        [web search tool](https://developers.openai.com/api/docs/guides/tools-web-search).

        - `type: "web_search" or "web_search_2025_08_26"`

          The type of the web search tool. One of `web_search` or `web_search_2025_08_26`.

          - `"web_search"`

          - `"web_search_2025_08_26"`

        - `external_web_access: optional boolean`

          Allow live internet access for web search. Defaults to true when omitted. When false, the web search tool runs in offline/cache-only mode and will not fetch new external content.

        - `filters: optional object { allowed_domains }  or null`

          Filters for the search.

          - `allowed_domains: optional array of string or null`

            Allowed domains for the search. If not provided, all domains are allowed.
            Subdomains of the provided domains are allowed as well.

            Example: `["pubmed.ncbi.nlm.nih.gov"]`

        - `search_context_size: optional "low" or "medium" or "high"`

          High level guidance for the amount of context window space to use for the search. One of `low`, `medium`, or `high`. `medium` is the default.

          - `"low"`

          - `"medium"`

          - `"high"`

        - `user_location: optional object { city, country, region, 2 more }  or null`

          The approximate location of the user.

          - `city: optional string or null`

            Free text input for the city of the user, e.g. `San Francisco`.

          - `country: optional string or null`

            The two-letter [ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1) of the user, e.g. `US`.

          - `region: optional string or null`

            Free text input for the region of the user, e.g. `California`.

          - `timezone: optional string or null`

            The [IANA timezone](https://timeapi.io/documentation/iana-timezones) of the user, e.g. `America/Los_Angeles`.

          - `type: optional "approximate"`

            The type of location approximation. Always `approximate`.

            - `"approximate"`

      - `Mcp object { server_label, type, allowed_callers, 9 more }`

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

      - `CodeInterpreter object { container, type, allowed_callers }`

        A tool that runs Python code to help generate a response to a prompt.

        - `container: string or object { type, file_ids, memory_limit, network_policy }`

          The code interpreter container. Can be a container ID or an object that
          specifies uploaded file IDs to make available to your code, along with an
          optional `memory_limit` setting.

          - `string`

            The container ID.

          - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

            Configuration for a code interpreter container. Optionally specify the IDs of the files to run the code on.

            - `type: "auto"`

              Always `auto`.

              - `"auto"`

            - `file_ids: optional array of string`

              An optional list of uploaded files to make available to your code.

            - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

              The memory limit for the code interpreter container.

              - `"1g"`

              - `"4g"`

              - `"16g"`

              - `"64g"`

            - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

              Network access policy for the container.

              - `ContainerNetworkPolicyDisabled object { type }`

                - `type: "disabled"`

                  Disable outbound network access. Always `disabled`.

                  - `"disabled"`

              - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                - `allowed_domains: array of string`

                  A list of allowed domains when type is `allowlist`.

                - `type: "allowlist"`

                  Allow outbound network access only to specified domains. Always `allowlist`.

                  - `"allowlist"`

                - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                  Optional domain-scoped secrets for allowlisted domains.

                  - `domain: string`

                    The domain associated with the secret.

                  - `name: string`

                    The name of the secret to inject for the domain.

                  - `value: string`

                    The secret value to inject for the domain.

        - `type: "code_interpreter"`

          The type of the code interpreter tool. Always `code_interpreter`.

          - `"code_interpreter"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          The tool invocation context(s).

          - `"direct"`

          - `"programmatic"`

      - `ProgrammaticToolCalling object { type }`

        - `type: "programmatic_tool_calling"`

          The type of the tool. Always `programmatic_tool_calling`.

          - `"programmatic_tool_calling"`

      - `ImageGeneration object { type, action, background, 9 more }`

        A tool that generates images using the GPT image models.

        - `type: "image_generation"`

          The type of the image generation tool. Always `image_generation`.

          - `"image_generation"`

        - `action: optional "generate" or "edit" or "auto"`

          Whether to generate a new image or edit an existing image. Default: `auto`.

          - `"generate"`

          - `"edit"`

          - `"auto"`

        - `background: optional "transparent" or "opaque" or "auto"`

          Set the background of the generated image. One of `transparent`, `opaque`,
          or `auto`. `gpt-image-2.5-sunburst` and `gpt-image-2.5-flare`, including
          their `2026-09-08` snapshots, support `opaque` and `transparent`
          backgrounds. Transparent backgrounds are available for supported GPT Image
          models. For `gpt-image-2` and `gpt-image-2-2026-04-21`, this support is in
          preview. When using `transparent`, set the output format to `png` or `webp`.
          Default: `auto`.

          - `"transparent"`

          - `"opaque"`

          - `"auto"`

        - `input_fidelity: optional "high" or "low" or null`

          Control how much effort the model will exert to match the style and features, especially facial features, of input images. This parameter is only supported for `gpt-image-1` and `gpt-image-1.5` and later models, unsupported for `gpt-image-1-mini`. Supports `high` and `low`. Defaults to `low`.

          - `"high"`

          - `"low"`

        - `input_image_mask: optional object { file_id, image_url }`

          Optional mask for inpainting. Contains `image_url`
          (string, optional) and `file_id` (string, optional).

          - `file_id: optional string`

            File ID for the mask image.

          - `image_url: optional string`

            Base64-encoded mask image.

        - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

          The image generation model to use. One of `gpt-image-1`,
          `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
          `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
          `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
          `gpt-image-2.5-flare-2026-09-08`, or `chatgpt-image-latest`. Default:
          `gpt-image-1`.

          - `string`

          - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

            The image generation model to use. One of `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
            `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
            `gpt-image-2.5-flare-2026-09-08`, or `chatgpt-image-latest`. Default:
            `gpt-image-1`.

            - `"gpt-image-1"`

            - `"gpt-image-1-mini"`

            - `"gpt-image-1.5"`

            - `"gpt-image-2"`

            - `"gpt-image-2-2026-04-21"`

            - `"gpt-image-2.5-sunburst"`

            - `"gpt-image-2.5-sunburst-2026-09-08"`

            - `"gpt-image-2.5-flare"`

            - `"gpt-image-2.5-flare-2026-09-08"`

        - `moderation: optional "auto" or "low"`

          Moderation level for the generated image. Default: `auto`.

          - `"auto"`

          - `"low"`

        - `output_compression: optional number`

          Compression level for the output image. Default: 100.

        - `output_format: optional "png" or "webp" or "jpeg"`

          The output format of the generated image. One of `png`, `webp`, or
          `jpeg`. Default: `png`.

          - `"png"`

          - `"webp"`

          - `"jpeg"`

        - `partial_images: optional number`

          Number of partial images to generate in streaming mode, from 0 (default value) to 3.

        - `quality: optional "low" or "medium" or "high" or 3 more`

          The quality of the generated image. The GPT image models support `low`,
          `medium`, and `high`. `gpt-image-2.5-sunburst` and `gpt-image-2.5-flare`,
          including their `2026-09-08` snapshots, also support `xhigh` and `max`.
          Default: `auto`.

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

          - `"auto"`

        - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

          The size of the generated images. For `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, and `gpt-image-2.5-flare-2026-09-08`, arbitrary resolutions are supported as `WIDTHxHEIGHT` strings, for example `1536x864`. Width and height must both be divisible by 16 and the requested aspect ratio must be between 1:3 and 3:1. Resolutions above `2560x1440` are experimental, and the maximum supported resolution is `3840x2160`. The requested size must also satisfy the model's current pixel and edge limits. The standard sizes `1024x1024`, `1536x1024`, and `1024x1536` are supported by the GPT image models; `auto` is supported for models that allow automatic sizing. For `dall-e-2`, use one of `256x256`, `512x512`, or `1024x1024`. For `dall-e-3`, use one of `1024x1024`, `1792x1024`, or `1024x1792`.

          - `string`

          - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            The size of the generated images. For `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, and `gpt-image-2.5-flare-2026-09-08`, arbitrary resolutions are supported as `WIDTHxHEIGHT` strings, for example `1536x864`. Width and height must both be divisible by 16 and the requested aspect ratio must be between 1:3 and 3:1. Resolutions above `2560x1440` are experimental, and the maximum supported resolution is `3840x2160`. The requested size must also satisfy the model's current pixel and edge limits. The standard sizes `1024x1024`, `1536x1024`, and `1024x1536` are supported by the GPT image models; `auto` is supported for models that allow automatic sizing. For `dall-e-2`, use one of `256x256`, `512x512`, or `1024x1024`. For `dall-e-3`, use one of `1024x1024`, `1792x1024`, or `1024x1792`.

            - `"1024x1024"`

            - `"1024x1536"`

            - `"1536x1024"`

            - `"auto"`

      - `LocalShell object { type }`

        A tool that allows the model to execute shell commands in a local environment.

        - `type: "local_shell"`

          The type of the local shell tool. Always `local_shell`.

          - `"local_shell"`

      - `Shell object { type, allowed_callers, environment }`

        A tool that allows the model to execute shell commands.

        - `type: "shell"`

          The type of the shell tool. Always `shell`.

          - `"shell"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          The tool invocation context(s).

          - `"direct"`

          - `"programmatic"`

        - `environment: optional ContainerAuto or LocalEnvironment or ContainerReference or null`

          - `ContainerAuto object { type, file_ids, memory_limit, 2 more }`

            - `type: "container_auto"`

              Automatically creates a container for this request

              - `"container_auto"`

            - `file_ids: optional array of string`

              An optional list of uploaded files to make available to your code.

            - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

              The memory limit for the container.

              - `"1g"`

              - `"4g"`

              - `"16g"`

              - `"64g"`

            - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

              Network access policy for the container.

              - `ContainerNetworkPolicyDisabled object { type }`

              - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

            - `skills: optional array of SkillReference or InlineSkill`

              An optional list of skills referenced by id or inline data.

              - `SkillReference object { skill_id, type, version }`

                - `skill_id: string`

                  The ID of the referenced skill.

                - `type: "skill_reference"`

                  References a skill created with the /v1/skills endpoint.

                  - `"skill_reference"`

                - `version: optional string`

                  Optional skill version. Use a positive integer or 'latest'. Omit for default.

              - `InlineSkill object { description, name, source, type }`

                - `description: string`

                  The description of the skill.

                - `name: string`

                  The name of the skill.

                - `source: InlineSkillSource`

                  Inline skill payload

                  - `data: string`

                    Base64-encoded skill zip bundle.

                  - `media_type: "application/zip"`

                    The media type of the inline skill payload. Must be `application/zip`.

                    - `"application/zip"`

                  - `type: "base64"`

                    The type of the inline skill source. Must be `base64`.

                    - `"base64"`

                - `type: "inline"`

                  Defines an inline skill for this request.

                  - `"inline"`

          - `LocalEnvironment object { type, skills }`

            - `type: "local"`

              Use a local computer environment.

              - `"local"`

            - `skills: optional array of LocalSkill`

              An optional list of skills.

              - `description: string`

                The description of the skill.

              - `name: string`

                The name of the skill.

              - `path: string`

                The path to the directory containing the skill.

          - `ContainerReference object { container_id, type }`

            - `container_id: string`

              The ID of the referenced container.

            - `type: "container_reference"`

              References a container created with the /v1/containers endpoint

              - `"container_reference"`

      - `Custom object { name, type, allowed_callers, 4 more }`

        A custom tool that processes input using a specified format. Learn more about   [custom tools](https://developers.openai.com/api/docs/guides/function-calling#custom-tools)

        - `name: string`

          The name of the custom tool, used to identify it in tool calls.

        - `type: "custom"`

          The type of the custom tool. Always `custom`.

          - `"custom"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          The tool invocation context(s).

          - `"direct"`

          - `"programmatic"`

        - `async: optional boolean`

          Whether the tool response can be returned asynchronously versus immediately returned on next response creation.

        - `defer_loading: optional boolean`

          Whether this tool should be deferred and discovered via tool search.

        - `description: optional string`

          Optional description of the custom tool, used to provide more context.

        - `format: optional CustomToolInputFormat`

          The input format for the custom tool. Default is unconstrained text.

          - `Text object { type }`

            Unconstrained free-form text.

            - `type: "text"`

              Unconstrained text format. Always `text`.

              - `"text"`

          - `Grammar object { definition, syntax, type }`

            A grammar defined by the user.

            - `definition: string`

              The grammar definition.

            - `syntax: "lark" or "regex"`

              The syntax of the grammar definition. One of `lark` or `regex`.

              - `"lark"`

              - `"regex"`

            - `type: "grammar"`

              Grammar format. Always `grammar`.

              - `"grammar"`

      - `Namespace object { description, name, tools, type }`

        Groups function/custom tools under a shared namespace.

        - `description: string`

          A description of the namespace shown to the model.

        - `name: string`

          The namespace name used in tool calls (for example, `crm`).

        - `tools: array of object { name, type, allowed_callers, 6 more }  or object { name, type, allowed_callers, 4 more }`

          The function/custom tools available inside this namespace.

          - `Function object { name, type, allowed_callers, 6 more }`

            - `name: string`

            - `type: "function"`

              - `"function"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              The tool invocation context(s).

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

              Whether the tool response can be returned asynchronously versus immediately returned on next response creation.

            - `defer_loading: optional boolean`

              Whether this function should be deferred and discovered via tool search.

            - `description: optional string or null`

            - `output_schema: optional map[unknown] or null`

              A JSON Schema describing the JSON value encoded in string outputs for this function tool. This does not describe content-array outputs.

            - `parameters: optional unknown or null`

            - `strict: optional boolean or null`

              Whether to enforce strict parameter validation. If omitted, Responses attempts to use strict validation when the schema is compatible, and falls back to non-strict validation otherwise.

          - `Custom object { name, type, allowed_callers, 4 more }`

            A custom tool that processes input using a specified format. Learn more about   [custom tools](https://developers.openai.com/api/docs/guides/function-calling#custom-tools)

            - `name: string`

              The name of the custom tool, used to identify it in tool calls.

            - `type: "custom"`

              The type of the custom tool. Always `custom`.

              - `"custom"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              The tool invocation context(s).

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

              Whether the tool response can be returned asynchronously versus immediately returned on next response creation.

            - `defer_loading: optional boolean`

              Whether this tool should be deferred and discovered via tool search.

            - `description: optional string`

              Optional description of the custom tool, used to provide more context.

            - `format: optional CustomToolInputFormat`

              The input format for the custom tool. Default is unconstrained text.

        - `type: "namespace"`

          The type of the tool. Always `namespace`.

          - `"namespace"`

      - `ToolSearch object { type, description, execution, parameters }`

        Hosted or BYOT tool search configuration for deferred tools.

        - `type: "tool_search"`

          The type of the tool. Always `tool_search`.

          - `"tool_search"`

        - `description: optional string or null`

          Description shown to the model for a client-executed tool search tool.

        - `execution: optional "server" or "client"`

          Whether tool search is executed by the server or by the client.

          - `"server"`

          - `"client"`

        - `parameters: optional unknown or null`

          Parameter schema for a client-executed tool search tool.

      - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

        This tool searches the web for relevant results to use in a response. Learn more about the [web search tool](https://developers.openai.com/api/docs/guides/tools-web-search).

        - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

          The type of the web search tool. One of `web_search_preview` or `web_search_preview_2025_03_11`.

          - `"web_search_preview"`

          - `"web_search_preview_2025_03_11"`

        - `search_content_types: optional array of "text" or "image"`

          - `"text"`

          - `"image"`

        - `search_context_size: optional "low" or "medium" or "high"`

          High level guidance for the amount of context window space to use for the search. One of `low`, `medium`, or `high`. `medium` is the default.

          - `"low"`

          - `"medium"`

          - `"high"`

        - `user_location: optional object { type, city, country, 2 more }  or null`

          The user's location.

          - `type: "approximate"`

            The type of location approximation. Always `approximate`.

            - `"approximate"`

          - `city: optional string or null`

            Free text input for the city of the user, e.g. `San Francisco`.

          - `country: optional string or null`

            The two-letter [ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1) of the user, e.g. `US`.

          - `region: optional string or null`

            Free text input for the region of the user, e.g. `California`.

          - `timezone: optional string or null`

            The [IANA timezone](https://timeapi.io/documentation/iana-timezones) of the user, e.g. `America/Los_Angeles`.

      - `ApplyPatch object { type, allowed_callers }`

        Allows the assistant to create, delete, or update files using unified diffs.

        - `type: "apply_patch"`

          The type of the tool. Always `apply_patch`.

          - `"apply_patch"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          The tool invocation context(s).

          - `"direct"`

          - `"programmatic"`

    - `type: "tool_search_output"`

      The item type. Always `tool_search_output`.

      - `"tool_search_output"`

    - `id: optional string or null`

      The unique ID of this tool search output.

    - `call_id: optional string or null`

      The unique ID of the tool search call generated by the model.

    - `execution: optional "server" or "client"`

      Whether tool search was executed by the server or by the client.

      - `"server"`

      - `"client"`

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      The status of the tool search output.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `AdditionalTools object { role, tools, type, id }`

    - `role: "developer"`

      The role that provided the additional tools. Only `developer` is supported.

      - `"developer"`

    - `tools: array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

      A list of additional tools made available at this item.

      - `Function object { name, parameters, strict, 6 more }`

        Defines a function in your own code the model can choose to call. Learn more about [function calling](https://developers.openai.com/api/docs/guides/function-calling).

        - `name: string`

          The name of the function to call.

        - `parameters: map[unknown] or null`

          A JSON schema object describing the parameters of the function.

        - `strict: boolean or null`

          Whether strict parameter validation is enforced for this function tool.

        - `type: "function"`

          The type of the function tool. Always `function`.

          - `"function"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          The tool invocation context(s).

          - `"direct"`

          - `"programmatic"`

        - `async: optional boolean`

        - `defer_loading: optional boolean`

          Whether this function is deferred and loaded via tool search.

        - `description: optional string or null`

          A description of the function. Used by the model to determine whether or not to call the function.

        - `output_schema: optional map[unknown] or null`

          A JSON schema object describing the JSON value encoded in string outputs for this function.

      - `FileSearch object { type, vector_store_ids, filters, 2 more }`

        A tool that searches for relevant content from uploaded files. Learn more about the [file search tool](https://developers.openai.com/api/docs/guides/tools-file-search).

        - `type: "file_search"`

          The type of the file search tool. Always `file_search`.

          - `"file_search"`

        - `vector_store_ids: array of string`

          The IDs of the vector stores to search.

        - `filters: optional ComparisonFilter or CompoundFilter or null`

          A filter to apply.

          - `ComparisonFilter object { key, type, value }`

            A filter used to compare a specified attribute key to a given value using a defined comparison operation.

          - `CompoundFilter object { filters, type }`

            Combine multiple filters using `and` or `or`.

        - `max_num_results: optional number`

          The maximum number of results to return. This number should be between 1 and 50 inclusive.

        - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

          Ranking options for search.

          - `hybrid_search: optional object { embedding_weight, text_weight }`

            Weights that control how reciprocal rank fusion balances semantic embedding matches versus sparse keyword matches when hybrid search is enabled.

            - `embedding_weight: number`

              The weight of the embedding in the reciprocal ranking fusion.

            - `text_weight: number`

              The weight of the text in the reciprocal ranking fusion.

          - `ranker: optional "auto" or "default-2024-11-15"`

            The ranker to use for the file search.

            - `"auto"`

            - `"default-2024-11-15"`

          - `score_threshold: optional number`

            The score threshold for the file search, a number between 0 and 1. Numbers closer to 1 will attempt to return only the most relevant results, but may return fewer results.

      - `Computer object { type }`

        A tool that controls a virtual computer. Learn more about the [computer tool](https://developers.openai.com/api/docs/guides/tools-computer-use).

        - `type: "computer"`

          The type of the computer tool. Always `computer`.

          - `"computer"`

      - `ComputerUsePreview object { display_height, display_width, environment, type }`

        A tool that controls a virtual computer. Learn more about the [computer tool](https://developers.openai.com/api/docs/guides/tools-computer-use).

        - `display_height: number`

          The height of the computer display.

        - `display_width: number`

          The width of the computer display.

        - `environment: "windows" or "mac" or "linux" or 2 more`

          The type of computer environment to control.

          - `"windows"`

          - `"mac"`

          - `"linux"`

          - `"ubuntu"`

          - `"browser"`

        - `type: "computer_use_preview"`

          The type of the computer use tool. Always `computer_use_preview`.

          - `"computer_use_preview"`

      - `WebSearch object { type, external_web_access, filters, 2 more }`

        Search the Internet for sources related to the prompt. Learn more about the
        [web search tool](https://developers.openai.com/api/docs/guides/tools-web-search).

        - `type: "web_search" or "web_search_2025_08_26"`

          The type of the web search tool. One of `web_search` or `web_search_2025_08_26`.

          - `"web_search"`

          - `"web_search_2025_08_26"`

        - `external_web_access: optional boolean`

          Allow live internet access for web search. Defaults to true when omitted. When false, the web search tool runs in offline/cache-only mode and will not fetch new external content.

        - `filters: optional object { allowed_domains }  or null`

          Filters for the search.

          - `allowed_domains: optional array of string or null`

            Allowed domains for the search. If not provided, all domains are allowed.
            Subdomains of the provided domains are allowed as well.

            Example: `["pubmed.ncbi.nlm.nih.gov"]`

        - `search_context_size: optional "low" or "medium" or "high"`

          High level guidance for the amount of context window space to use for the search. One of `low`, `medium`, or `high`. `medium` is the default.

          - `"low"`

          - `"medium"`

          - `"high"`

        - `user_location: optional object { city, country, region, 2 more }  or null`

          The approximate location of the user.

          - `city: optional string or null`

            Free text input for the city of the user, e.g. `San Francisco`.

          - `country: optional string or null`

            The two-letter [ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1) of the user, e.g. `US`.

          - `region: optional string or null`

            Free text input for the region of the user, e.g. `California`.

          - `timezone: optional string or null`

            The [IANA timezone](https://timeapi.io/documentation/iana-timezones) of the user, e.g. `America/Los_Angeles`.

          - `type: optional "approximate"`

            The type of location approximation. Always `approximate`.

            - `"approximate"`

      - `Mcp object { server_label, type, allowed_callers, 9 more }`

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

      - `CodeInterpreter object { container, type, allowed_callers }`

        A tool that runs Python code to help generate a response to a prompt.

        - `container: string or object { type, file_ids, memory_limit, network_policy }`

          The code interpreter container. Can be a container ID or an object that
          specifies uploaded file IDs to make available to your code, along with an
          optional `memory_limit` setting.

          - `string`

            The container ID.

          - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

            Configuration for a code interpreter container. Optionally specify the IDs of the files to run the code on.

            - `type: "auto"`

              Always `auto`.

              - `"auto"`

            - `file_ids: optional array of string`

              An optional list of uploaded files to make available to your code.

            - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

              The memory limit for the code interpreter container.

              - `"1g"`

              - `"4g"`

              - `"16g"`

              - `"64g"`

            - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

              Network access policy for the container.

              - `ContainerNetworkPolicyDisabled object { type }`

              - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

        - `type: "code_interpreter"`

          The type of the code interpreter tool. Always `code_interpreter`.

          - `"code_interpreter"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          The tool invocation context(s).

          - `"direct"`

          - `"programmatic"`

      - `ProgrammaticToolCalling object { type }`

        - `type: "programmatic_tool_calling"`

          The type of the tool. Always `programmatic_tool_calling`.

          - `"programmatic_tool_calling"`

      - `ImageGeneration object { type, action, background, 9 more }`

        A tool that generates images using the GPT image models.

        - `type: "image_generation"`

          The type of the image generation tool. Always `image_generation`.

          - `"image_generation"`

        - `action: optional "generate" or "edit" or "auto"`

          Whether to generate a new image or edit an existing image. Default: `auto`.

          - `"generate"`

          - `"edit"`

          - `"auto"`

        - `background: optional "transparent" or "opaque" or "auto"`

          Set the background of the generated image. One of `transparent`, `opaque`,
          or `auto`. `gpt-image-2.5-sunburst` and `gpt-image-2.5-flare`, including
          their `2026-09-08` snapshots, support `opaque` and `transparent`
          backgrounds. Transparent backgrounds are available for supported GPT Image
          models. For `gpt-image-2` and `gpt-image-2-2026-04-21`, this support is in
          preview. When using `transparent`, set the output format to `png` or `webp`.
          Default: `auto`.

          - `"transparent"`

          - `"opaque"`

          - `"auto"`

        - `input_fidelity: optional "high" or "low" or null`

          Control how much effort the model will exert to match the style and features, especially facial features, of input images. This parameter is only supported for `gpt-image-1` and `gpt-image-1.5` and later models, unsupported for `gpt-image-1-mini`. Supports `high` and `low`. Defaults to `low`.

          - `"high"`

          - `"low"`

        - `input_image_mask: optional object { file_id, image_url }`

          Optional mask for inpainting. Contains `image_url`
          (string, optional) and `file_id` (string, optional).

          - `file_id: optional string`

            File ID for the mask image.

          - `image_url: optional string`

            Base64-encoded mask image.

        - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

          The image generation model to use. One of `gpt-image-1`,
          `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
          `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
          `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
          `gpt-image-2.5-flare-2026-09-08`, or `chatgpt-image-latest`. Default:
          `gpt-image-1`.

          - `string`

          - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

            The image generation model to use. One of `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
            `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
            `gpt-image-2.5-flare-2026-09-08`, or `chatgpt-image-latest`. Default:
            `gpt-image-1`.

            - `"gpt-image-1"`

            - `"gpt-image-1-mini"`

            - `"gpt-image-1.5"`

            - `"gpt-image-2"`

            - `"gpt-image-2-2026-04-21"`

            - `"gpt-image-2.5-sunburst"`

            - `"gpt-image-2.5-sunburst-2026-09-08"`

            - `"gpt-image-2.5-flare"`

            - `"gpt-image-2.5-flare-2026-09-08"`

        - `moderation: optional "auto" or "low"`

          Moderation level for the generated image. Default: `auto`.

          - `"auto"`

          - `"low"`

        - `output_compression: optional number`

          Compression level for the output image. Default: 100.

        - `output_format: optional "png" or "webp" or "jpeg"`

          The output format of the generated image. One of `png`, `webp`, or
          `jpeg`. Default: `png`.

          - `"png"`

          - `"webp"`

          - `"jpeg"`

        - `partial_images: optional number`

          Number of partial images to generate in streaming mode, from 0 (default value) to 3.

        - `quality: optional "low" or "medium" or "high" or 3 more`

          The quality of the generated image. The GPT image models support `low`,
          `medium`, and `high`. `gpt-image-2.5-sunburst` and `gpt-image-2.5-flare`,
          including their `2026-09-08` snapshots, also support `xhigh` and `max`.
          Default: `auto`.

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

          - `"auto"`

        - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

          The size of the generated images. For `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, and `gpt-image-2.5-flare-2026-09-08`, arbitrary resolutions are supported as `WIDTHxHEIGHT` strings, for example `1536x864`. Width and height must both be divisible by 16 and the requested aspect ratio must be between 1:3 and 3:1. Resolutions above `2560x1440` are experimental, and the maximum supported resolution is `3840x2160`. The requested size must also satisfy the model's current pixel and edge limits. The standard sizes `1024x1024`, `1536x1024`, and `1024x1536` are supported by the GPT image models; `auto` is supported for models that allow automatic sizing. For `dall-e-2`, use one of `256x256`, `512x512`, or `1024x1024`. For `dall-e-3`, use one of `1024x1024`, `1792x1024`, or `1024x1792`.

          - `string`

          - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            The size of the generated images. For `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`, and `gpt-image-2.5-flare-2026-09-08`, arbitrary resolutions are supported as `WIDTHxHEIGHT` strings, for example `1536x864`. Width and height must both be divisible by 16 and the requested aspect ratio must be between 1:3 and 3:1. Resolutions above `2560x1440` are experimental, and the maximum supported resolution is `3840x2160`. The requested size must also satisfy the model's current pixel and edge limits. The standard sizes `1024x1024`, `1536x1024`, and `1024x1536` are supported by the GPT image models; `auto` is supported for models that allow automatic sizing. For `dall-e-2`, use one of `256x256`, `512x512`, or `1024x1024`. For `dall-e-3`, use one of `1024x1024`, `1792x1024`, or `1024x1792`.

            - `"1024x1024"`

            - `"1024x1536"`

            - `"1536x1024"`

            - `"auto"`

      - `LocalShell object { type }`

        A tool that allows the model to execute shell commands in a local environment.

        - `type: "local_shell"`

          The type of the local shell tool. Always `local_shell`.

          - `"local_shell"`

      - `Shell object { type, allowed_callers, environment }`

        A tool that allows the model to execute shell commands.

        - `type: "shell"`

          The type of the shell tool. Always `shell`.

          - `"shell"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          The tool invocation context(s).

          - `"direct"`

          - `"programmatic"`

        - `environment: optional ContainerAuto or LocalEnvironment or ContainerReference or null`

          - `ContainerAuto object { type, file_ids, memory_limit, 2 more }`

          - `LocalEnvironment object { type, skills }`

          - `ContainerReference object { container_id, type }`

      - `Custom object { name, type, allowed_callers, 4 more }`

        A custom tool that processes input using a specified format. Learn more about   [custom tools](https://developers.openai.com/api/docs/guides/function-calling#custom-tools)

        - `name: string`

          The name of the custom tool, used to identify it in tool calls.

        - `type: "custom"`

          The type of the custom tool. Always `custom`.

          - `"custom"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          The tool invocation context(s).

          - `"direct"`

          - `"programmatic"`

        - `async: optional boolean`

          Whether the tool response can be returned asynchronously versus immediately returned on next response creation.

        - `defer_loading: optional boolean`

          Whether this tool should be deferred and discovered via tool search.

        - `description: optional string`

          Optional description of the custom tool, used to provide more context.

        - `format: optional CustomToolInputFormat`

          The input format for the custom tool. Default is unconstrained text.

      - `Namespace object { description, name, tools, type }`

        Groups function/custom tools under a shared namespace.

        - `description: string`

          A description of the namespace shown to the model.

        - `name: string`

          The namespace name used in tool calls (for example, `crm`).

        - `tools: array of object { name, type, allowed_callers, 6 more }  or object { name, type, allowed_callers, 4 more }`

          The function/custom tools available inside this namespace.

          - `Function object { name, type, allowed_callers, 6 more }`

            - `name: string`

            - `type: "function"`

              - `"function"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              The tool invocation context(s).

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

              Whether the tool response can be returned asynchronously versus immediately returned on next response creation.

            - `defer_loading: optional boolean`

              Whether this function should be deferred and discovered via tool search.

            - `description: optional string or null`

            - `output_schema: optional map[unknown] or null`

              A JSON Schema describing the JSON value encoded in string outputs for this function tool. This does not describe content-array outputs.

            - `parameters: optional unknown or null`

            - `strict: optional boolean or null`

              Whether to enforce strict parameter validation. If omitted, Responses attempts to use strict validation when the schema is compatible, and falls back to non-strict validation otherwise.

          - `Custom object { name, type, allowed_callers, 4 more }`

            A custom tool that processes input using a specified format. Learn more about   [custom tools](https://developers.openai.com/api/docs/guides/function-calling#custom-tools)

            - `name: string`

              The name of the custom tool, used to identify it in tool calls.

            - `type: "custom"`

              The type of the custom tool. Always `custom`.

              - `"custom"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              The tool invocation context(s).

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

              Whether the tool response can be returned asynchronously versus immediately returned on next response creation.

            - `defer_loading: optional boolean`

              Whether this tool should be deferred and discovered via tool search.

            - `description: optional string`

              Optional description of the custom tool, used to provide more context.

            - `format: optional CustomToolInputFormat`

              The input format for the custom tool. Default is unconstrained text.

        - `type: "namespace"`

          The type of the tool. Always `namespace`.

          - `"namespace"`

      - `ToolSearch object { type, description, execution, parameters }`

        Hosted or BYOT tool search configuration for deferred tools.

        - `type: "tool_search"`

          The type of the tool. Always `tool_search`.

          - `"tool_search"`

        - `description: optional string or null`

          Description shown to the model for a client-executed tool search tool.

        - `execution: optional "server" or "client"`

          Whether tool search is executed by the server or by the client.

          - `"server"`

          - `"client"`

        - `parameters: optional unknown or null`

          Parameter schema for a client-executed tool search tool.

      - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

        This tool searches the web for relevant results to use in a response. Learn more about the [web search tool](https://developers.openai.com/api/docs/guides/tools-web-search).

        - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

          The type of the web search tool. One of `web_search_preview` or `web_search_preview_2025_03_11`.

          - `"web_search_preview"`

          - `"web_search_preview_2025_03_11"`

        - `search_content_types: optional array of "text" or "image"`

          - `"text"`

          - `"image"`

        - `search_context_size: optional "low" or "medium" or "high"`

          High level guidance for the amount of context window space to use for the search. One of `low`, `medium`, or `high`. `medium` is the default.

          - `"low"`

          - `"medium"`

          - `"high"`

        - `user_location: optional object { type, city, country, 2 more }  or null`

          The user's location.

          - `type: "approximate"`

            The type of location approximation. Always `approximate`.

            - `"approximate"`

          - `city: optional string or null`

            Free text input for the city of the user, e.g. `San Francisco`.

          - `country: optional string or null`

            The two-letter [ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1) of the user, e.g. `US`.

          - `region: optional string or null`

            Free text input for the region of the user, e.g. `California`.

          - `timezone: optional string or null`

            The [IANA timezone](https://timeapi.io/documentation/iana-timezones) of the user, e.g. `America/Los_Angeles`.

      - `ApplyPatch object { type, allowed_callers }`

        Allows the assistant to create, delete, or update files using unified diffs.

        - `type: "apply_patch"`

          The type of the tool. Always `apply_patch`.

          - `"apply_patch"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          The tool invocation context(s).

          - `"direct"`

          - `"programmatic"`

    - `type: "additional_tools"`

      The item type. Always `additional_tools`.

      - `"additional_tools"`

    - `id: optional string or null`

      The unique ID of this additional tools item.

  - `ConfigurationUpdate object { type, id, reasoning }`

    An update to the conversation's response configuration. The configuration
    remains in effect for subsequent responses until it is replaced by another
    configuration update.

    - `type: "configuration_update"`

      The item type. Always `configuration_update`.

      - `"configuration_update"`

    - `id: optional string or null`

      The unique ID of the configuration update item.

    - `reasoning: optional object { effort }`

      Updates to reasoning configuration. Only effort is supported.

      - `effort: optional ReasoningEffort or null`

        The reasoning effort to use for subsequent responses until another
        configuration update replaces it.

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

  - `Reasoning object { id, summary, type, 3 more }`

    A description of the chain of thought used by a reasoning model while generating
    a response. Be sure to include these items in your `input` to the Responses API
    for subsequent turns of a conversation if you are manually
    [managing context](https://developers.openai.com/api/docs/guides/conversation-state).

    - `id: string`

      The unique identifier of the reasoning content.

    - `summary: array of SummaryTextContent`

      Reasoning summary content.

      - `text: string`

        A summary of the reasoning output from the model so far.

      - `type: "summary_text"`

        The type of the object. Always `summary_text`.

        - `"summary_text"`

    - `type: "reasoning"`

      The type of the object. Always `reasoning`.

      - `"reasoning"`

    - `content: optional array of object { text, type }`

      Reasoning text content.

      - `text: string`

        The reasoning text from the model.

      - `type: "reasoning_text"`

        The type of the reasoning text. Always `reasoning_text`.

        - `"reasoning_text"`

    - `encrypted_content: optional string or null`

      The encrypted content of the reasoning item. This is populated by default
      for reasoning items returned by `POST /v1/responses` and WebSocket
      `response.create` requests.

      When streaming, use the completed reasoning item and its
      `encrypted_content` from the `response.output_item.done` event in
      subsequent requests. The `encrypted_content` in
      `response.output_item.added` may be incomplete. This is especially
      important when `store` is `false` or when using Zero Data Retention.

    - `status: optional "in_progress" or "completed" or "incomplete"`

      The status of the item. One of `in_progress`, `completed`, or
      `incomplete`. Populated when items are returned via API.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `Compaction object { encrypted_content, type, id }`

    A compaction item generated by the [`v1/responses/compact` API](https://developers.openai.com/api/reference/resources/responses/methods/compact).

    - `encrypted_content: string`

      The encrypted content of the compaction summary.

    - `type: "compaction"`

      The type of the item. Always `compaction`.

      - `"compaction"`

    - `id: optional string or null`

      The ID of the compaction item.

  - `ImageGenerationCall object { id, result, status, 7 more }`

    An image generation request made by the model.

    - `id: string`

      The unique ID of the image generation call.

    - `result: string or null`

      The generated image encoded in base64.

    - `status: "in_progress" or "completed" or "generating" or "failed"`

      The status of the image generation call.

      - `"in_progress"`

      - `"completed"`

      - `"generating"`

      - `"failed"`

    - `type: "image_generation_call"`

      The type of the image generation call. Always `image_generation_call`.

      - `"image_generation_call"`

    - `action: optional "generate" or "edit" or "auto" or null`

      The action used for image generation.

      - `"generate"`

      - `"edit"`

      - `"auto"`

    - `background: optional "transparent" or "opaque" or "auto" or null`

      The background setting used for generation.

      - `"transparent"`

      - `"opaque"`

      - `"auto"`

    - `output_format: optional "png" or "webp" or "jpeg" or null`

      The output format used for generation.

      - `"png"`

      - `"webp"`

      - `"jpeg"`

    - `quality: optional "low" or "medium" or "high" or 3 more or null`

      The quality of the image generated by the image generation tool call. One of `low`, `medium`, `high`, `xhigh`, `max`, or `auto`.

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

      - `"max"`

      - `"auto"`

    - `revised_prompt: optional string or null`

      The prompt that was used after any model prompt rewriting.

    - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or null`

      The image dimensions as a `WIDTHxHEIGHT` string, for example `1536x864`.

      - `string`

      - `"1024x1024" or "1024x1536" or "1536x1024"`

        The image dimensions as a `WIDTHxHEIGHT` string, for example `1536x864`.

        - `"1024x1024"`

        - `"1024x1536"`

        - `"1536x1024"`

  - `CodeInterpreterCall object { id, code, container_id, 3 more }`

    A tool call to run code.

    - `id: string`

      The unique ID of the code interpreter tool call.

    - `code: string or null`

      The code to run, or null if not available.

    - `container_id: string`

      The ID of the container used to run the code.

    - `outputs: array of object { logs, type }  or object { type, url }  or null`

      The outputs generated by the code interpreter, such as logs or images.
      Can be null if no outputs are available.

      - `Logs object { logs, type }`

        The logs output from the code interpreter.

        - `logs: string`

          The logs output from the code interpreter.

        - `type: "logs"`

          The type of the output. Always `logs`.

          - `"logs"`

      - `Image object { type, url }`

        The image output from the code interpreter.

        - `type: "image"`

          The type of the output. Always `image`.

          - `"image"`

        - `url: string`

          The URL of the image output from the code interpreter.

    - `status: "in_progress" or "completed" or "incomplete" or 2 more`

      The status of the code interpreter tool call. Valid values are `in_progress`, `completed`, `incomplete`, `interpreting`, and `failed`.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

      - `"interpreting"`

      - `"failed"`

    - `type: "code_interpreter_call"`

      The type of the code interpreter tool call. Always `code_interpreter_call`.

      - `"code_interpreter_call"`

  - `LocalShellCall object { id, action, call_id, 2 more }`

    A tool call to run a command on the local shell.

    - `id: string`

      The unique ID of the local shell call.

    - `action: object { command, env, type, 3 more }`

      Execute a shell command on the server.

      - `command: array of string`

        The command to run.

      - `env: map[string]`

        Environment variables to set for the command.

      - `type: "exec"`

        The type of the local shell action. Always `exec`.

        - `"exec"`

      - `timeout_ms: optional number or null`

        Optional timeout in milliseconds for the command.

      - `user: optional string or null`

        Optional user to run the command as.

      - `working_directory: optional string or null`

        Optional working directory to run the command in.

    - `call_id: string`

      The unique ID of the local shell tool call generated by the model.

    - `status: "in_progress" or "completed" or "incomplete"`

      The status of the local shell call.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

    - `type: "local_shell_call"`

      The type of the local shell call. Always `local_shell_call`.

      - `"local_shell_call"`

  - `LocalShellCallOutput object { id, output, type, status }`

    The output of a local shell tool call.

    - `id: string`

      The unique ID of the local shell tool call generated by the model.

    - `output: string`

      A JSON string of the output of the local shell tool call.

    - `type: "local_shell_call_output"`

      The type of the local shell tool call output. Always `local_shell_call_output`.

      - `"local_shell_call_output"`

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      The status of the item. One of `in_progress`, `completed`, or `incomplete`.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `ShellCall object { action, call_id, type, 4 more }`

    A tool representing a request to execute one or more shell commands.

    - `action: object { commands, max_output_length, timeout_ms }`

      The shell commands and limits that describe how to run the tool call.

      - `commands: array of string`

        Ordered shell commands for the execution environment to run.

      - `max_output_length: optional number or null`

        Maximum number of UTF-8 characters to capture from combined stdout and stderr output.

      - `timeout_ms: optional number or null`

        Maximum wall-clock time in milliseconds to allow the shell commands to run.

    - `call_id: string`

      The unique ID of the shell tool call generated by the model.

    - `type: "shell_call"`

      The type of the item. Always `shell_call`.

      - `"shell_call"`

    - `id: optional string or null`

      The unique ID of the shell tool call. Populated when this item is returned via API.

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      The execution context that produced this tool call.

      - `Direct object { type }`

        - `type: "direct"`

          The caller type. Always `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          The call ID of the program item that produced this tool call.

        - `type: "program"`

          The caller type. Always `program`.

          - `"program"`

    - `environment: optional LocalEnvironment or ContainerReference or null`

      The environment to execute the shell commands in.

      - `LocalEnvironment object { type, skills }`

      - `ContainerReference object { container_id, type }`

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      The status of the shell call. One of `in_progress`, `completed`, or `incomplete`.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `ShellCallOutput object { call_id, output, type, 4 more }`

    The streamed output items emitted by a shell tool call.

    - `call_id: string`

      The unique ID of the shell tool call generated by the model.

    - `output: array of ResponseFunctionShellCallOutputContent`

      Captured chunks of stdout and stderr output, along with their associated outcomes.

      - `outcome: object { type }  or object { exit_code, type }`

        The exit or timeout outcome associated with this shell call.

        - `Timeout object { type }`

          Indicates that the shell call exceeded its configured time limit.

          - `type: "timeout"`

            The outcome type. Always `timeout`.

            - `"timeout"`

        - `Exit object { exit_code, type }`

          Indicates that the shell commands finished and returned an exit code.

          - `exit_code: number`

            The exit code returned by the shell process.

          - `type: "exit"`

            The outcome type. Always `exit`.

            - `"exit"`

      - `stderr: string`

        Captured stderr output for the shell call.

      - `stdout: string`

        Captured stdout output for the shell call.

    - `type: "shell_call_output"`

      The type of the item. Always `shell_call_output`.

      - `"shell_call_output"`

    - `id: optional string or null`

      The unique ID of the shell tool call output. Populated when this item is returned via API.

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      The execution context that produced this tool call.

      - `Direct object { type }`

        - `type: "direct"`

          The caller type. Always `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          The call ID of the program item that produced this tool call.

        - `type: "program"`

          The caller type. Always `program`.

          - `"program"`

    - `max_output_length: optional number or null`

      The maximum number of UTF-8 characters captured for this shell call's combined output.

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      The status of the shell call output.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `ApplyPatchCall object { call_id, operation, status, 3 more }`

    A tool call representing a request to create, delete, or update files using diff patches.

    - `call_id: string`

      The unique ID of the apply patch tool call generated by the model.

    - `operation: object { diff, path, type }  or object { path, type }  or object { diff, path, type }`

      The specific create, delete, or update instruction for the apply_patch tool call.

      - `CreateFile object { diff, path, type }`

        Instruction for creating a new file via the apply_patch tool.

        - `diff: string`

          Unified diff content to apply when creating the file.

        - `path: string`

          Path of the file to create relative to the workspace root.

        - `type: "create_file"`

          The operation type. Always `create_file`.

          - `"create_file"`

      - `DeleteFile object { path, type }`

        Instruction for deleting an existing file via the apply_patch tool.

        - `path: string`

          Path of the file to delete relative to the workspace root.

        - `type: "delete_file"`

          The operation type. Always `delete_file`.

          - `"delete_file"`

      - `UpdateFile object { diff, path, type }`

        Instruction for updating an existing file via the apply_patch tool.

        - `diff: string`

          Unified diff content to apply to the existing file.

        - `path: string`

          Path of the file to update relative to the workspace root.

        - `type: "update_file"`

          The operation type. Always `update_file`.

          - `"update_file"`

    - `status: "in_progress" or "completed"`

      The status of the apply patch tool call. One of `in_progress` or `completed`.

      - `"in_progress"`

      - `"completed"`

    - `type: "apply_patch_call"`

      The type of the item. Always `apply_patch_call`.

      - `"apply_patch_call"`

    - `id: optional string or null`

      The unique ID of the apply patch tool call. Populated when this item is returned via API.

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      The execution context that produced this tool call.

      - `Direct object { type }`

        - `type: "direct"`

          The caller type. Always `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          The call ID of the program item that produced this tool call.

        - `type: "program"`

          The caller type. Always `program`.

          - `"program"`

  - `ApplyPatchCallOutput object { call_id, status, type, 3 more }`

    The streamed output emitted by an apply patch tool call.

    - `call_id: string`

      The unique ID of the apply patch tool call generated by the model.

    - `status: "completed" or "failed"`

      The status of the apply patch tool call output. One of `completed` or `failed`.

      - `"completed"`

      - `"failed"`

    - `type: "apply_patch_call_output"`

      The type of the item. Always `apply_patch_call_output`.

      - `"apply_patch_call_output"`

    - `id: optional string or null`

      The unique ID of the apply patch tool call output. Populated when this item is returned via API.

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      The execution context that produced this tool call.

      - `Direct object { type }`

        - `type: "direct"`

          The caller type. Always `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          The call ID of the program item that produced this tool call.

        - `type: "program"`

          The caller type. Always `program`.

          - `"program"`

    - `output: optional string or null`

      Optional human-readable log text from the apply patch tool (e.g., patch results or errors).

  - `McpListTools object { id, server_label, tools, 2 more }`

    A list of tools available on an MCP server.

    - `id: string`

      The unique ID of the list.

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

    - `error: optional string or null`

      Error message if the server could not list tools.

  - `McpApprovalRequest object { id, arguments, name, 2 more }`

    A request for human approval of a tool invocation.

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

  - `McpApprovalResponse object { approval_request_id, approve, type, 2 more }`

    A response to an MCP approval request.

    - `approval_request_id: string`

      The ID of the approval request being answered.

    - `approve: boolean`

      Whether the request was approved.

    - `type: "mcp_approval_response"`

      The type of the item. Always `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `id: optional string or null`

      The unique ID of the approval response

    - `reason: optional string or null`

      Optional reason for the decision.

  - `McpCall object { id, arguments, name, 6 more }`

    An invocation of a tool on an MCP server.

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

      Unique identifier for the MCP tool call approval request.
      Include this value in a subsequent `mcp_approval_response` input to approve or reject the corresponding tool call.

    - `error: optional McpToolCallError or null`

      The error from the tool call, if any.

      - `McpProtocolError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "mcp_protocol_error"`

          - `"mcp_protocol_error"`

      - `McpToolExecutionError object { content, type }`

        - `content: unknown`

        - `type: "mcp_tool_execution_error"`

          - `"mcp_tool_execution_error"`

      - `HTTPError object { code, message, type }`

        - `code: number`

        - `message: string`

        - `type: "http_error"`

          - `"http_error"`

    - `output: optional string or null`

      The output from the tool call.

    - `status: optional "in_progress" or "completed" or "incomplete" or 2 more`

      The status of the tool call. One of `in_progress`, `completed`, `incomplete`, `calling`, or `failed`.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

      - `"calling"`

      - `"failed"`

  - `CustomToolCallOutput object { call_id, output, type, 2 more }`

    The output of a custom tool call from your code, being sent back to the model.

    - `call_id: string`

      The call ID, used to map this custom tool call output to a custom tool call.

    - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

      The output from the custom tool call generated by your code.
      Can be a string or an list of output content.

      - `StringOutput = string`

        A string of the output of the custom tool call.

      - `OutputContentList = array of ResponseInputText or ResponseInputImage or ResponseInputFile`

        Text, image, or file output of the custom tool call.

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          A text input to the model.

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          An image input to the model. Learn about [image inputs](https://developers.openai.com/api/docs/guides/images-vision).

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          A file input to the model.

    - `type: "custom_tool_call_output"`

      The type of the custom tool call output. Always `custom_tool_call_output`.

      - `"custom_tool_call_output"`

    - `id: optional string`

      The unique ID of the custom tool call output in the OpenAI platform.

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      The execution context that produced this tool call.

      - `Direct object { type }`

        - `type: "direct"`

          The caller type. Always `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          The call ID of the program item that produced this tool call.

        - `type: "program"`

          The caller type. Always `program`.

          - `"program"`

  - `CustomToolCall object { call_id, input, name, 5 more }`

    A call to a custom tool created by the model.

    - `call_id: string`

      An identifier used to map this custom tool call to a tool call output.

    - `input: string`

      The input for the custom tool call generated by the model.

    - `name: string`

      The name of the custom tool being called.

    - `type: "custom_tool_call"`

      The type of the custom tool call. Always `custom_tool_call`.

      - `"custom_tool_call"`

    - `id: optional string`

      The unique ID of the custom tool call in the OpenAI platform.

    - `async: optional boolean`

      Whether the custom tool call runs asynchronously.

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      The execution context that produced this tool call.

      - `Direct object { type }`

        - `type: "direct"`

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          The call ID of the program item that produced this tool call.

        - `type: "program"`

          - `"program"`

    - `namespace: optional string`

      The namespace of the custom tool being called.

  - `CompactionTrigger object { type, id }`

    Compacts the current context. Must be the final input item.

    - `type: "compaction_trigger"`

      The type of the item. Always `compaction_trigger`.

      - `"compaction_trigger"`

    - `id: optional string or null`

      The unique ID of this compaction trigger.

  - `ItemReference object { id, type }`

    An internal identifier for an item to reference.

    - `id: string`

      The ID of the item to reference.

    - `type: optional "item_reference" or null`

      The type of item to reference. Always `item_reference`.

      - `"item_reference"`

  - `Program object { id, call_id, code, 2 more }`

    - `id: string`

      The unique ID of this program item.

    - `call_id: string`

      The stable call ID of the program item.

    - `code: string`

      The JavaScript source executed by programmatic tool calling.

    - `fingerprint: string`

      Opaque program replay fingerprint that must be round-tripped.

    - `type: "program"`

      The item type. Always `program`.

      - `"program"`

  - `ProgramOutput object { id, call_id, result, 2 more }`

    - `id: string`

      The unique ID of this program output item.

    - `call_id: string`

      The call ID of the program item.

    - `result: string`

      The result produced by the program item.

    - `status: "completed" or "incomplete"`

      The terminal status of the program output.

      - `"completed"`

      - `"incomplete"`

    - `type: "program_output"`

      The item type. Always `program_output`.

      - `"program_output"`

- `type: "response.item.create"`

  The Live client event type. Always `response.item.create`.

  - `"response.item.create"`

- `event_id: optional string or null`

  Optional client identifier for correlating this command with a server event's client_event_id or error.client_event_id.

#### Example

```json
{
  "type": "response.item.create",
  "event_id": "evt_item_001",
  "item": {
    "type": "message",
    "role": "user",
    "content": [
      {
        "type": "input_text",
        "text": "Please check for a table for two at 7 PM."
      }
    ]
  }
}
```

<a id="response.create"></a>

### response.create

Request a response from the Live session’s Responses backend, or continue a delegated response waiting for tool results. Requires Responses delegation.

#### Schema

Schema name: `LiveResponseCreateParam`

- `type: "response.create"`

  The Live client event type. Always `response.create`.

  - `"response.create"`

- `event_id: optional string or null`

  Optional client identifier for correlating this command with a server event's client_event_id or error.client_event_id.

#### Example

```json
{
  "type": "response.create",
  "event_id": "evt_response_001"
}
```

<a id="session.close"></a>

### session.close

Request that the Live session close. The terminal `session.closed` event contains the close reason and final usage.

#### Schema

Schema name: `LiveSessionCloseParam`

- `type: "session.close"`

  The Live client event type. Always `session.close`.

  - `"session.close"`

- `event_id: optional string or null`

  Optional client identifier for correlating this command with a server event's client_event_id or error.client_event_id.

#### Example

```json
{
  "type": "session.close",
  "event_id": "evt_close_001"
}
```

<a id="server-events"></a>

## Server events

<a id="session.started"></a>

### session.started

Returned when a Live session has started. Contains the resolved session configuration, including server defaults.

#### Schema

Schema name: `LiveSessionStarted`

- `event_id: string`

  The unique ID of the Live server event.

- `session: SessionResource`

  The resolved Live session configuration and server-assigned session metadata.

  - `id: string`

    The unique ID of the Live session. Use this ID for sideband connections, forking, and recording download.

  - `expires_at: number`

    The Unix timestamp, in seconds, at which the Live session expires.

  - `model: string or "gpt-live-1"`

    The Live model. Required in the session configuration for every transport; do not pass it as a URL query parameter.

    - `string`

    - `"gpt-live-1"`

      The Live model. Required in the session configuration for every transport; do not pass it as a URL query parameter.

      - `"gpt-live-1"`

  - `status: "active"`

    The status of the session snapshot. Always `active`, including the final snapshot in session.closed; use the event type to determine that the session has closed.

    - `"active"`

  - `audio: optional object { format, output }`

    Startup audio configuration. Only primary WebSockets accept audio.format; WebRTC and SIP negotiate their media format. Voice and format are immutable after startup.

    - `format: optional AudioFormat`

      Audio encoding and sample rate for audio sent and received over a Live WebSocket connection. WebRTC and SIP negotiate their media format separately.

      - `AudioPCM object { rate, type }`

        Raw, mono 16-bit little-endian PCM audio for a Live WebSocket connection.

        - `rate: 16000 or 24000`

          Audio sample rate in hertz. Live WebSocket PCM audio supports 16000 or 24000 Hz.

          - `16000`

          - `24000`

        - `type: "audio/pcm"`

          The audio encoding. Always `audio/pcm`.

          - `"audio/pcm"`

      - `AudioPCMU object { rate, type }`

        Raw, mono G.711 μ-law audio for a Live WebSocket connection.

        - `rate: number`

          Audio sample rate in hertz. G.711 audio uses 8000 Hz.

        - `type: "audio/pcmu"`

          The audio encoding. Always `audio/pcmu`.

          - `"audio/pcmu"`

      - `AudioPCMA object { rate, type }`

        Raw, mono G.711 A-law audio for a Live WebSocket connection.

        - `rate: number`

          Audio sample rate in hertz. G.711 audio uses 8000 Hz.

        - `type: "audio/pcma"`

          The audio encoding. Always `audio/pcma`.

          - `"audio/pcma"`

    - `output: optional object { voice }`

      The voice used for speech generated by the Live model.

      - `voice: optional string or "alloy" or "ash" or "ballad" or 19 more or CustomVoice`

        The voice used for Live speech, as a built-in voice name or a custom voice object containing its ID. Defaults to `marin` and cannot change after startup.

        - `string`

        - `"alloy" or "ash" or "ballad" or 19 more`

          The voice used for Live speech, as a built-in voice name or a custom voice object containing its ID. Defaults to `marin` and cannot change after startup.

          - `"alloy"`

          - `"ash"`

          - `"ballad"`

          - `"beacon"`

          - `"bossa"`

          - `"cedar"`

          - `"cinder"`

          - `"coral"`

          - `"delta"`

          - `"echo"`

          - `"gleam"`

          - `"marin"`

          - `"meridian"`

          - `"quartz"`

          - `"ripple"`

          - `"sage"`

          - `"shimmer"`

          - `"stone"`

          - `"tempo"`

          - `"verse"`

          - `"vesper"`

          - `"willow"`

        - `CustomVoice object { id }`

          - `id: string`

  - `client: optional ClientConfig`

    Startup-only capabilities for an untrusted frontend attached to a unified WebRTC session. Trusted sideband connections are unaffected.

    - `data_channel: DataChannelConfig`

      Client and server event permissions for the WebRTC frontend data channel.

      - `allowed_client_events: optional "all" or array of string`

        Client event types that the frontend data channel may send. Use 'all' to allow every client event; an empty array allows none. Omission preserves the existing allow-all behavior.

        - `"all"`

          - `"all"`

        - `array of string`

      - `allowed_server_events: optional "all" or array of ServerEventSelector`

        Server events that may be sent to the frontend data channel. Use 'all' to allow every server event; an empty array allows none. Omission preserves the existing allow-all behavior. Responses events use an object with type 'response.event' and a response_event selector.

        - `"all"`

          - `"all"`

        - `array of ServerEventSelector`

          - `type: string`

            The outer Live server event type. Use 'response.event' for Responses events.

          - `response_event: optional string`

            The nested Responses event type. Required when type is 'response.event'; forbidden for other event types.

  - `delegation: optional ClientDelegation or object { responses, type }  or null`

    Who handles tasks delegated by the Live model. Omitted or null selects your application; use `responses` to let the API manage a Responses backend.

    - `ClientDelegation object { type }`

      Delegate tasks to your application. The Live session emits delegation events that your backend handles.

      - `type: "client"`

        The delegation owner. Always `client` for tasks handled by your application.

        - `"client"`

    - `Responses object { responses, type }`

      Delegate tasks to a Responses model managed by the Live session.

      - `responses: ResponsesDelegationConfig`

        Backend model, prompt, and tools used when the Live session delegates a task to Responses.

        - `model: string`

          The model used for server-owned Responses delegations.

        - `instructions: optional string or null`

          Instructions for the delegated Responses model, separate from Live instructions. See [backend prompting](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt).

        - `max_output_tokens: optional number or null`

          Maximum number of output tokens for each delegated response.

        - `parallel_tool_calls: optional boolean or null`

          Whether the delegated Responses model may request multiple tool calls in a single response.

        - `reasoning: optional object { effort, summary }  or null`

          Reasoning settings passed to each delegated Responses request.

          - `effort: optional "none" or "minimal" or "low" or 3 more or null`

            How much reasoning effort the delegated Responses model should use. Supported values depend on the backend model.

            - `"none"`

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `summary: optional "concise" or "detailed" or "auto" or null`

            The reasoning summary to request from the delegated Responses model, when supported.

            - `"concise"`

            - `"detailed"`

            - `"auto"`

        - `service_tier: optional "auto" or "default" or "fast_tier_temp_pilot" or 3 more or null`

          Service tier for delegated Responses requests.

          - `"auto"`

          - `"default"`

          - `"fast_tier_temp_pilot"`

          - `"flex"`

          - `"priority"`

          - `"ultrafast"`

        - `text: optional object { verbosity }  or null`

          Text generation settings passed to each delegated Responses request.

          - `verbosity: optional "low" or "medium" or "high" or null`

            The amount of detail in text generated by the Responses backend. This does not configure the Live model’s spoken delivery.

            - `"low"`

            - `"medium"`

            - `"high"`

        - `tool_choice: optional "auto" or "none" or "required" or object { name, type }  or object { name, server_label, type }`

          Controls which tool the Responses backend uses when handling a task delegated by the Live model.

          - `LiveToolChoiceEnum = "auto" or "none" or "required"`

            - `"auto"`

            - `"none"`

            - `"required"`

          - `LiveFunctionToolChoiceParam object { name, type }`

            - `name: string`

            - `type: "function"`

              - `"function"`

          - `LiveMCPToolChoiceParam object { name, server_label, type }`

            - `name: string`

            - `server_label: string`

            - `type: "mcp"`

              - `"mcp"`

        - `tools: optional array of FunctionTool or object { type }`

          Tools available to the Responses backend while it handles tasks delegated by the Live model.

          - `FunctionTool object { name, type, description, 2 more }`

            A function tool available to the Responses backend when the Live model delegates a task.

            - `name: string`

              The name the delegated Responses model uses when calling this function.

            - `type: "function"`

              The tool type. Always `function`.

              - `"function"`

            - `description: optional string or null`

              What the function does and when the delegated Responses model should call it.

            - `parameters: optional map[unknown] or null`

              A JSON Schema object describing the arguments accepted by the function.

            - `strict: optional boolean or null`

              Whether the delegated Responses model must follow the function’s parameter schema exactly.

          - `WebSearch object { type }`

            A web search tool available to the Live session’s Responses backend.

            - `type: "web_search"`

              The tool type. Always `web_search`.

              - `"web_search"`

      - `type: "responses"`

        The delegation owner. Always `responses` for tasks handled by the Responses API.

        - `"responses"`

  - `input: optional array of InitialItem`

    Ordered text-only history supplied before startup. Supports developer, user, and assistant messages with one text part each; at most 128 messages and 8,192 rendered tokens in total.

    - `Developer object { content, role, id, 2 more }`

      A developer message included in the initial text history of a Live session.

      - `content: array of object { text, type }`

        The message content. Supply exactly one text part for the initial Live conversation history.

        - `text: string`

          The message text to include in the Live session’s initial conversation history.

        - `type: optional "input_text"`

          The text content type. Always `input_text`.

          - `"input_text"`

      - `role: "developer"`

        The author of this history message. Always `developer`.

        - `"developer"`

      - `id: optional string or null`

        An optional identifier for the supplied history message. Live uses the message’s role and text to initialize the conversation.

      - `status: optional "incomplete" or "completed" or null`

        The supplied message’s status. Live uses its text as history and does not resume an incomplete message.

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        The history item type. Always `message`.

        - `"message"`

    - `User object { content, role, id, 2 more }`

      A user message included in the initial text history of a Live session.

      - `content: array of object { text, type }`

        The message content. Supply exactly one text part for the initial Live conversation history.

        - `text: string`

          The message text to include in the Live session’s initial conversation history.

        - `type: optional "input_text"`

          The text content type. Always `input_text`.

          - `"input_text"`

      - `role: "user"`

        The author of this history message. Always `user`.

        - `"user"`

      - `id: optional string or null`

        An optional identifier for the supplied history message. Live uses the message’s role and text to initialize the conversation.

      - `status: optional "incomplete" or "completed" or null`

        The supplied message’s status. Live uses its text as history and does not resume an incomplete message.

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        The history item type. Always `message`.

        - `"message"`

    - `Assistant object { content, role, id, 2 more }`

      An assistant message included in the initial text history of a Live session.

      - `content: array of object { text, type }  or object { text, type }`

        The message content. Supply exactly one text part for the initial Live conversation history.

        - `Text object { text, type }`

          Assistant text supplied as conversation history when starting a Live session.

          - `text: string`

            The message text to include in the Live session’s initial conversation history.

          - `type: optional "text"`

            The text content type. Always `text`.

            - `"text"`

        - `OutputText object { text, type }`

          Assistant output text supplied as conversation history when starting a Live session.

          - `text: string`

            The message text to include in the Live session’s initial conversation history.

          - `type: "output_text"`

            The text content type. Always `output_text`.

            - `"output_text"`

      - `role: "assistant"`

        The author of this history message. Always `assistant`.

        - `"assistant"`

      - `id: optional string or null`

        An optional identifier for the supplied history message. Live uses the message’s role and text to initialize the conversation.

      - `status: optional "incomplete" or "completed" or null`

        The supplied message’s status. Live uses its text as history and does not resume an incomplete message.

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        The history item type. Always `message`.

        - `"message"`

  - `instructions: optional string or null`

    Frontend instructions for voice, conversation, interruptions, and when to delegate. Start with the [Live prompting guide](https://developers.openai.com/api/docs/guides/live-prompting); put business rules and tool workflows in a separate [backend prompt](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt). Limited to 16,384 client-supplied tokens. Omitted or blank instructions use server defaults. Immutable after startup.

  - `store: optional boolean`

    Whether to store the session for later forking and recording download. Defaults to false for new sessions.

- `type: "session.started"`

  The event type, always `session.started`.

  - `"session.started"`

- `client_event_id: optional string`

  The event_id of the client command associated with this server event, when supplied.

#### Example

```json
{
  "type": "session.started",
  "event_id": "evt_started_001",
  "client_event_id": "evt_start_001",
  "session": {
    "id": "live_abc123",
    "model": "gpt-live-1",
    "status": "active",
    "expires_at": 1788555600,
    "instructions": "Help the caller plan a restaurant reservation. Confirm details before booking.",
    "input": [],
    "audio": {
      "format": {
        "type": "audio/pcm",
        "rate": 24000
      },
      "output": {
        "voice": "marin"
      }
    },
    "delegation": {
      "type": "client"
    }
  }
}
```

<a id="session.updated"></a>

### session.updated

Returned when a Live session update is accepted. Contains the resolved session configuration after the update.

#### Schema

Schema name: `LiveSessionUpdated`

- `event_id: string`

  The unique ID of the Live server event.

- `session: SessionResource`

  The resolved Live session configuration and server-assigned session metadata.

  - `id: string`

    The unique ID of the Live session. Use this ID for sideband connections, forking, and recording download.

  - `expires_at: number`

    The Unix timestamp, in seconds, at which the Live session expires.

  - `model: string or "gpt-live-1"`

    The Live model. Required in the session configuration for every transport; do not pass it as a URL query parameter.

    - `string`

    - `"gpt-live-1"`

      The Live model. Required in the session configuration for every transport; do not pass it as a URL query parameter.

      - `"gpt-live-1"`

  - `status: "active"`

    The status of the session snapshot. Always `active`, including the final snapshot in session.closed; use the event type to determine that the session has closed.

    - `"active"`

  - `audio: optional object { format, output }`

    Startup audio configuration. Only primary WebSockets accept audio.format; WebRTC and SIP negotiate their media format. Voice and format are immutable after startup.

    - `format: optional AudioFormat`

      Audio encoding and sample rate for audio sent and received over a Live WebSocket connection. WebRTC and SIP negotiate their media format separately.

      - `AudioPCM object { rate, type }`

        Raw, mono 16-bit little-endian PCM audio for a Live WebSocket connection.

        - `rate: 16000 or 24000`

          Audio sample rate in hertz. Live WebSocket PCM audio supports 16000 or 24000 Hz.

          - `16000`

          - `24000`

        - `type: "audio/pcm"`

          The audio encoding. Always `audio/pcm`.

          - `"audio/pcm"`

      - `AudioPCMU object { rate, type }`

        Raw, mono G.711 μ-law audio for a Live WebSocket connection.

        - `rate: number`

          Audio sample rate in hertz. G.711 audio uses 8000 Hz.

        - `type: "audio/pcmu"`

          The audio encoding. Always `audio/pcmu`.

          - `"audio/pcmu"`

      - `AudioPCMA object { rate, type }`

        Raw, mono G.711 A-law audio for a Live WebSocket connection.

        - `rate: number`

          Audio sample rate in hertz. G.711 audio uses 8000 Hz.

        - `type: "audio/pcma"`

          The audio encoding. Always `audio/pcma`.

          - `"audio/pcma"`

    - `output: optional object { voice }`

      The voice used for speech generated by the Live model.

      - `voice: optional string or "alloy" or "ash" or "ballad" or 19 more or CustomVoice`

        The voice used for Live speech, as a built-in voice name or a custom voice object containing its ID. Defaults to `marin` and cannot change after startup.

        - `string`

        - `"alloy" or "ash" or "ballad" or 19 more`

          The voice used for Live speech, as a built-in voice name or a custom voice object containing its ID. Defaults to `marin` and cannot change after startup.

          - `"alloy"`

          - `"ash"`

          - `"ballad"`

          - `"beacon"`

          - `"bossa"`

          - `"cedar"`

          - `"cinder"`

          - `"coral"`

          - `"delta"`

          - `"echo"`

          - `"gleam"`

          - `"marin"`

          - `"meridian"`

          - `"quartz"`

          - `"ripple"`

          - `"sage"`

          - `"shimmer"`

          - `"stone"`

          - `"tempo"`

          - `"verse"`

          - `"vesper"`

          - `"willow"`

        - `CustomVoice object { id }`

          - `id: string`

  - `client: optional ClientConfig`

    Startup-only capabilities for an untrusted frontend attached to a unified WebRTC session. Trusted sideband connections are unaffected.

    - `data_channel: DataChannelConfig`

      Client and server event permissions for the WebRTC frontend data channel.

      - `allowed_client_events: optional "all" or array of string`

        Client event types that the frontend data channel may send. Use 'all' to allow every client event; an empty array allows none. Omission preserves the existing allow-all behavior.

        - `"all"`

          - `"all"`

        - `array of string`

      - `allowed_server_events: optional "all" or array of ServerEventSelector`

        Server events that may be sent to the frontend data channel. Use 'all' to allow every server event; an empty array allows none. Omission preserves the existing allow-all behavior. Responses events use an object with type 'response.event' and a response_event selector.

        - `"all"`

          - `"all"`

        - `array of ServerEventSelector`

          - `type: string`

            The outer Live server event type. Use 'response.event' for Responses events.

          - `response_event: optional string`

            The nested Responses event type. Required when type is 'response.event'; forbidden for other event types.

  - `delegation: optional ClientDelegation or object { responses, type }  or null`

    Who handles tasks delegated by the Live model. Omitted or null selects your application; use `responses` to let the API manage a Responses backend.

    - `ClientDelegation object { type }`

      Delegate tasks to your application. The Live session emits delegation events that your backend handles.

      - `type: "client"`

        The delegation owner. Always `client` for tasks handled by your application.

        - `"client"`

    - `Responses object { responses, type }`

      Delegate tasks to a Responses model managed by the Live session.

      - `responses: ResponsesDelegationConfig`

        Backend model, prompt, and tools used when the Live session delegates a task to Responses.

        - `model: string`

          The model used for server-owned Responses delegations.

        - `instructions: optional string or null`

          Instructions for the delegated Responses model, separate from Live instructions. See [backend prompting](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt).

        - `max_output_tokens: optional number or null`

          Maximum number of output tokens for each delegated response.

        - `parallel_tool_calls: optional boolean or null`

          Whether the delegated Responses model may request multiple tool calls in a single response.

        - `reasoning: optional object { effort, summary }  or null`

          Reasoning settings passed to each delegated Responses request.

          - `effort: optional "none" or "minimal" or "low" or 3 more or null`

            How much reasoning effort the delegated Responses model should use. Supported values depend on the backend model.

            - `"none"`

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `summary: optional "concise" or "detailed" or "auto" or null`

            The reasoning summary to request from the delegated Responses model, when supported.

            - `"concise"`

            - `"detailed"`

            - `"auto"`

        - `service_tier: optional "auto" or "default" or "fast_tier_temp_pilot" or 3 more or null`

          Service tier for delegated Responses requests.

          - `"auto"`

          - `"default"`

          - `"fast_tier_temp_pilot"`

          - `"flex"`

          - `"priority"`

          - `"ultrafast"`

        - `text: optional object { verbosity }  or null`

          Text generation settings passed to each delegated Responses request.

          - `verbosity: optional "low" or "medium" or "high" or null`

            The amount of detail in text generated by the Responses backend. This does not configure the Live model’s spoken delivery.

            - `"low"`

            - `"medium"`

            - `"high"`

        - `tool_choice: optional "auto" or "none" or "required" or object { name, type }  or object { name, server_label, type }`

          Controls which tool the Responses backend uses when handling a task delegated by the Live model.

          - `LiveToolChoiceEnum = "auto" or "none" or "required"`

            - `"auto"`

            - `"none"`

            - `"required"`

          - `LiveFunctionToolChoiceParam object { name, type }`

            - `name: string`

            - `type: "function"`

              - `"function"`

          - `LiveMCPToolChoiceParam object { name, server_label, type }`

            - `name: string`

            - `server_label: string`

            - `type: "mcp"`

              - `"mcp"`

        - `tools: optional array of FunctionTool or object { type }`

          Tools available to the Responses backend while it handles tasks delegated by the Live model.

          - `FunctionTool object { name, type, description, 2 more }`

            A function tool available to the Responses backend when the Live model delegates a task.

            - `name: string`

              The name the delegated Responses model uses when calling this function.

            - `type: "function"`

              The tool type. Always `function`.

              - `"function"`

            - `description: optional string or null`

              What the function does and when the delegated Responses model should call it.

            - `parameters: optional map[unknown] or null`

              A JSON Schema object describing the arguments accepted by the function.

            - `strict: optional boolean or null`

              Whether the delegated Responses model must follow the function’s parameter schema exactly.

          - `WebSearch object { type }`

            A web search tool available to the Live session’s Responses backend.

            - `type: "web_search"`

              The tool type. Always `web_search`.

              - `"web_search"`

      - `type: "responses"`

        The delegation owner. Always `responses` for tasks handled by the Responses API.

        - `"responses"`

  - `input: optional array of InitialItem`

    Ordered text-only history supplied before startup. Supports developer, user, and assistant messages with one text part each; at most 128 messages and 8,192 rendered tokens in total.

    - `Developer object { content, role, id, 2 more }`

      A developer message included in the initial text history of a Live session.

      - `content: array of object { text, type }`

        The message content. Supply exactly one text part for the initial Live conversation history.

        - `text: string`

          The message text to include in the Live session’s initial conversation history.

        - `type: optional "input_text"`

          The text content type. Always `input_text`.

          - `"input_text"`

      - `role: "developer"`

        The author of this history message. Always `developer`.

        - `"developer"`

      - `id: optional string or null`

        An optional identifier for the supplied history message. Live uses the message’s role and text to initialize the conversation.

      - `status: optional "incomplete" or "completed" or null`

        The supplied message’s status. Live uses its text as history and does not resume an incomplete message.

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        The history item type. Always `message`.

        - `"message"`

    - `User object { content, role, id, 2 more }`

      A user message included in the initial text history of a Live session.

      - `content: array of object { text, type }`

        The message content. Supply exactly one text part for the initial Live conversation history.

        - `text: string`

          The message text to include in the Live session’s initial conversation history.

        - `type: optional "input_text"`

          The text content type. Always `input_text`.

          - `"input_text"`

      - `role: "user"`

        The author of this history message. Always `user`.

        - `"user"`

      - `id: optional string or null`

        An optional identifier for the supplied history message. Live uses the message’s role and text to initialize the conversation.

      - `status: optional "incomplete" or "completed" or null`

        The supplied message’s status. Live uses its text as history and does not resume an incomplete message.

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        The history item type. Always `message`.

        - `"message"`

    - `Assistant object { content, role, id, 2 more }`

      An assistant message included in the initial text history of a Live session.

      - `content: array of object { text, type }  or object { text, type }`

        The message content. Supply exactly one text part for the initial Live conversation history.

        - `Text object { text, type }`

          Assistant text supplied as conversation history when starting a Live session.

          - `text: string`

            The message text to include in the Live session’s initial conversation history.

          - `type: optional "text"`

            The text content type. Always `text`.

            - `"text"`

        - `OutputText object { text, type }`

          Assistant output text supplied as conversation history when starting a Live session.

          - `text: string`

            The message text to include in the Live session’s initial conversation history.

          - `type: "output_text"`

            The text content type. Always `output_text`.

            - `"output_text"`

      - `role: "assistant"`

        The author of this history message. Always `assistant`.

        - `"assistant"`

      - `id: optional string or null`

        An optional identifier for the supplied history message. Live uses the message’s role and text to initialize the conversation.

      - `status: optional "incomplete" or "completed" or null`

        The supplied message’s status. Live uses its text as history and does not resume an incomplete message.

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        The history item type. Always `message`.

        - `"message"`

  - `instructions: optional string or null`

    Frontend instructions for voice, conversation, interruptions, and when to delegate. Start with the [Live prompting guide](https://developers.openai.com/api/docs/guides/live-prompting); put business rules and tool workflows in a separate [backend prompt](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt). Limited to 16,384 client-supplied tokens. Omitted or blank instructions use server defaults. Immutable after startup.

  - `store: optional boolean`

    Whether to store the session for later forking and recording download. Defaults to false for new sessions.

- `type: "session.updated"`

  The event type, always `session.updated`.

  - `"session.updated"`

- `client_event_id: optional string`

  The event_id of the client command associated with this server event, when supplied.

#### Example

```json
{
  "type": "session.updated",
  "event_id": "evt_updated_001",
  "client_event_id": "evt_update_001",
  "session": {
    "id": "live_def456",
    "model": "gpt-live-1",
    "status": "active",
    "expires_at": 1788555600,
    "instructions": "Help the caller plan a restaurant reservation. Confirm details before booking.",
    "input": [],
    "audio": {
      "format": {
        "type": "audio/pcm",
        "rate": 24000
      },
      "output": {
        "voice": "marin"
      }
    },
    "delegation": {
      "type": "responses",
      "responses": {
        "model": "gpt-6-astra",
        "instructions": "Check restaurant availability. Ask before confirming a booking.",
        "max_output_tokens": 1024,
        "tools": []
      }
    }
  }
}
```

<a id="session.input_audio.muted"></a>

### session.input_audio.muted

Returned when a session.input_audio.mute command is accepted. Input audio is no longer sent to the model; sideband audio reflection continues.

#### Schema

Schema name: `LiveInputAudioMuted`

- `event_id: string`

  The unique ID of the Live server event.

- `type: "session.input_audio.muted"`

  The event type, always `session.input_audio.muted`.

  - `"session.input_audio.muted"`

- `client_event_id: optional string`

  The event_id of the client command associated with this server event, when supplied.

#### Example

```json
{
  "type": "session.input_audio.muted",
  "event_id": "evt_muted_001",
  "client_event_id": "evt_mute_001"
}
```

<a id="session.input_audio.unmuted"></a>

### session.input_audio.unmuted

Returned when a session.input_audio.unmute command is accepted. Input audio is sent to the model again.

#### Schema

Schema name: `LiveInputAudioUnmuted`

- `event_id: string`

  The unique ID of the Live server event.

- `type: "session.input_audio.unmuted"`

  The event type, always `session.input_audio.unmuted`.

  - `"session.input_audio.unmuted"`

- `client_event_id: optional string`

  The event_id of the client command associated with this server event, when supplied.

#### Example

```json
{
  "type": "session.input_audio.unmuted",
  "event_id": "evt_unmuted_001",
  "client_event_id": "evt_unmute_001"
}
```

<a id="session.instructions.appended"></a>

### session.instructions.appended

Returned when a session.instructions.append command is accepted into the Live session timeline. Acknowledges the appended instructions without guaranteeing that the model has acted on them.

#### Schema

Schema name: `LiveInstructionsAppended`

- `end_ms: number`

  The end of this event on the Live session timeline, in milliseconds from the beginning of the session. For appended context, this can equal start_ms.

- `event_id: string`

  The unique ID of the Live server event.

- `start_ms: number`

  The start of this event on the Live session timeline, in milliseconds from the beginning of the session.

- `type: "session.instructions.appended"`

  The event type, always `session.instructions.appended`.

  - `"session.instructions.appended"`

- `client_event_id: optional string`

  The event_id of the client command associated with this server event, when supplied.

#### Example

```json
{
  "type": "session.instructions.appended",
  "event_id": "evt_instructions_002",
  "client_event_id": "evt_instructions_001",
  "start_ms": 1200,
  "end_ms": 1400
}
```

<a id="session.thinking.appended"></a>

### session.thinking.appended

Returned when a session.thinking.append command is accepted into the Live session timeline. Acknowledges the added reasoning context without guaranteeing any spoken output.

#### Schema

Schema name: `LiveThinkingAppended`

- `end_ms: number`

  The end of this event on the Live session timeline, in milliseconds from the beginning of the session. For appended context, this can equal start_ms.

- `event_id: string`

  The unique ID of the Live server event.

- `start_ms: number`

  The start of this event on the Live session timeline, in milliseconds from the beginning of the session.

- `type: "session.thinking.appended"`

  The event type, always `session.thinking.appended`.

  - `"session.thinking.appended"`

- `client_event_id: optional string`

  The event_id of the client command associated with this server event, when supplied.

#### Example

```json
{
  "type": "session.thinking.appended",
  "event_id": "evt_thinking_002",
  "client_event_id": "evt_thinking_001",
  "start_ms": 4600,
  "end_ms": 4800
}
```

<a id="session.commentary.appended"></a>

### session.commentary.appended

Returned when a session.commentary.append command is accepted into the Live session timeline. Acknowledges the added commentary without guaranteeing exact wording or completed audio playback.

#### Schema

Schema name: `LiveCommentaryAppended`

- `end_ms: number`

  The end of this event on the Live session timeline, in milliseconds from the beginning of the session. For appended context, this can equal start_ms.

- `event_id: string`

  The unique ID of the Live server event.

- `start_ms: number`

  The start of this event on the Live session timeline, in milliseconds from the beginning of the session.

- `type: "session.commentary.appended"`

  The event type, always `session.commentary.appended`.

  - `"session.commentary.appended"`

- `client_event_id: optional string`

  The event_id of the client command associated with this server event, when supplied.

#### Example

```json
{
  "type": "session.commentary.appended",
  "event_id": "evt_commentary_002",
  "client_event_id": "evt_commentary_001",
  "start_ms": 5200,
  "end_ms": 5400
}
```

<a id="session.output_audio.delta"></a>

### session.output_audio.delta

An audio chunk generated by the Live model. Decode and play primary WebSocket chunks in delivery order using the configured session audio format. Sideband connections receive reflected output audio with timestamps.

#### Schema

Schema name: `LiveOutputAudioDelta`

- `delta: string`

  Base64-encoded raw audio. Primary WebSocket events use the session's configured format; reflected sideband events use mono PCM16LE at 24 kHz.

- `type: "session.output_audio.delta"`

  The event type, always `session.output_audio.delta`.

  - `"session.output_audio.delta"`

- `end_ms: optional number`

  Exclusive session-relative end in milliseconds. Required on reflected sideband events; omitted on the primary WebSocket. Dropped output frames leave gaps between reflected ranges.

- `start_ms: optional number`

  Inclusive session-relative start in milliseconds. Required on reflected sideband events; omitted on the primary WebSocket.

#### Example

```json
{
  "type": "session.output_audio.delta",
  "delta": "AACAAIAAAIAAAP9/AIAAgA==",
  "start_ms": 1000,
  "end_ms": 1200
}
```

<a id="session.input_transcript.delta"></a>

### session.input_transcript.delta

A transcript fragment for user input audio in the Live session. Accumulate fragments in delivery order; these events do not define complete turns or include a transcript-done event.

#### Schema

Schema name: `LiveInputTranscriptDelta`

- `delta: string`

  The transcript text fragment for the audio in this time range. Append fragments in delivery order to build the transcript.

- `end_ms: number`

  The end of this event on the Live session timeline, in milliseconds from the beginning of the session. For appended context, this can equal start_ms.

- `event_id: string`

  The unique ID of the Live server event.

- `start_ms: number`

  The start of this event on the Live session timeline, in milliseconds from the beginning of the session.

- `type: "session.input_transcript.delta"`

  The event type, always `session.input_transcript.delta`.

  - `"session.input_transcript.delta"`

- `client_event_id: optional string`

  The event_id of the client command associated with this server event, when supplied.

#### Example

```json
{
  "type": "session.input_transcript.delta",
  "event_id": "evt_input_transcript_001",
  "delta": "A table for two at seven, please.",
  "start_ms": 1600,
  "end_ms": 3400
}
```

<a id="session.output_transcript.delta"></a>

### session.output_transcript.delta

A transcript fragment for assistant output audio in the Live session. Accumulate fragments in delivery order; these events do not define complete turns or include a transcript-done event.

#### Schema

Schema name: `LiveOutputTranscriptDelta`

- `delta: string`

  The transcript text fragment for the audio in this time range. Append fragments in delivery order to build the transcript.

- `end_ms: number`

  The end of this event on the Live session timeline, in milliseconds from the beginning of the session. For appended context, this can equal start_ms.

- `event_id: string`

  The unique ID of the Live server event.

- `start_ms: number`

  The start of this event on the Live session timeline, in milliseconds from the beginning of the session.

- `type: "session.output_transcript.delta"`

  The event type, always `session.output_transcript.delta`.

  - `"session.output_transcript.delta"`

- `client_event_id: optional string`

  The event_id of the client command associated with this server event, when supplied.

#### Example

```json
{
  "type": "session.output_transcript.delta",
  "event_id": "evt_output_transcript_001",
  "delta": "Would you like me to reserve that table?",
  "start_ms": 5400,
  "end_ms": 7200
}
```

<a id="session.delegation.created"></a>

### session.delegation.created

Returned when the Live model delegates work to your application or a Responses backend. Contains delegation metadata and the position on the session timeline where the work was delegated.

#### Schema

Schema name: `LiveDelegationCreated`

- `delegation: object { id, target, type, response_id }`

  The delegated work identifier and destination. This object contains metadata, not the task text.

  - `id: string`

    The unique ID of the delegation. Use this as delegation_id when replying to client-owned work or correlating Responses events.

  - `target: "client" or "responses"`

    Where the Live model delegated the work: `client` for your application, or `responses` for the configured Responses backend.

    - `"client" or "responses"`

      Where the Live model delegated the work: `client` for your application, or `responses` for the configured Responses backend.

      - `"client"`

      - `"responses"`

  - `type: "delegation"`

    The object type, always `delegation`.

    - `"delegation"`

  - `response_id: optional string`

    The ID of the Responses API response associated with a Responses delegation. Omitted for client delegations.

- `event_id: string`

  The unique ID of the Live server event.

- `offset_ms: number`

  The position on the Live session timeline where the delegation was created, in milliseconds from the beginning of the session.

- `type: "session.delegation.created"`

  The event type, always `session.delegation.created`.

  - `"session.delegation.created"`

- `client_event_id: optional string`

  The event_id of the client command associated with this server event, when supplied.

#### Example

```json
{
  "type": "session.delegation.created",
  "event_id": "evt_delegation_001",
  "offset_ms": 3600,
  "delegation": {
    "id": "del_abc123",
    "type": "delegation",
    "target": "client"
  }
}
```

<a id="response.event"></a>

### response.event

A streaming Responses API event from a backend delegated to by the Live session. Use the outer delegation_id to associate the nested stream with its Live delegation.

#### Schema

Schema name: `LiveResponseEvent`

- `event: map[unknown]`

  The nested Responses streaming event. Dispatch on its type field. Response lifecycle snapshots omit input and clear instructions, tools, and output to keep messages small; consume granular output events for the generated content.

- `event_id: string`

  The unique ID of the Live server event.

- `type: "response.event"`

  The event type, always `response.event`.

  - `"response.event"`

- `client_event_id: optional string`

  The event_id of the client command associated with this server event, when supplied.

- `delegation_id: optional string or null`

  The Live delegation associated with the nested Responses event. May be null or omitted when the event cannot be correlated with a delegation.

#### Example

```json
{
  "type": "response.event",
  "event_id": "evt_response_002",
  "delegation_id": "del_responses123",
  "event": {
    "type": "response.output_text.delta",
    "item_id": "msg_abc123",
    "output_index": 0,
    "content_index": 0,
    "delta": "An outdoor table is available at 7 PM.",
    "sequence_number": 3,
    "logprobs": []
  }
}
```

<a id="session.usage.updated"></a>

### session.usage.updated

Reports cumulative Live audio usage and, when available, the most recent context-window usage. Delegated Responses token usage is reported separately in response.event events.

#### Schema

Schema name: `LiveSessionUsageUpdated`

- `event_id: string`

  The unique ID of the Live server event.

- `type: "session.usage.updated"`

  The event type, always `session.usage.updated`.

  - `"session.usage.updated"`

- `usage: SessionUsage`

  The cumulative Live audio usage so far.

  - `seconds: number`

    The cumulative Live audio duration in seconds. Do not sum this value across usage events.

- `client_event_id: optional string`

  The event_id of the client command associated with this server event, when supplied.

- `context_window: optional object { usage_ratio }`

  The latest measured Live context-window usage. Omitted when the context limit is unknown.

  - `usage_ratio: number`

    The latest active context token count divided by the Live model context limit. Can decrease after compaction and may lag between measured audio frames.

#### Example

```json
{
  "type": "session.usage.updated",
  "event_id": "evt_usage_001",
  "usage": {
    "seconds": 32.5
  },
  "context_window": {
    "usage_ratio": 0.12
  }
}
```

<a id="session.closed"></a>

### session.closed

Returned after the Live session finishes finalizing, with the close reason, final session snapshot, and cumulative audio usage. A connection closing without this event does not confirm successful finalization.

#### Schema

Schema name: `LiveSessionClosed`

- `event_id: string`

  The unique ID of the Live server event.

- `reason: "close_requested" or "expired" or "content" or 2 more`

  Why the Live session ended: `close_requested` for an application close or hangup request, `expired` for the session duration limit, `content` for a safety filter, `remote_hangup` for a graceful remote disconnect, or `connection_lost` for an unexpected primary or upstream disconnection.

  - `"close_requested" or "expired" or "content" or 2 more`

    Why the Live session ended: `close_requested` for an application close or hangup request, `expired` for the session duration limit, `content` for a safety filter, `remote_hangup` for a graceful remote disconnect, or `connection_lost` for an unexpected primary or upstream disconnection.

    - `"close_requested"`

    - `"expired"`

    - `"content"`

    - `"remote_hangup"`

    - `"connection_lost"`

- `session: SessionResource`

  The resolved Live session configuration and server-assigned session metadata.

  - `id: string`

    The unique ID of the Live session. Use this ID for sideband connections, forking, and recording download.

  - `expires_at: number`

    The Unix timestamp, in seconds, at which the Live session expires.

  - `model: string or "gpt-live-1"`

    The Live model. Required in the session configuration for every transport; do not pass it as a URL query parameter.

    - `string`

    - `"gpt-live-1"`

      The Live model. Required in the session configuration for every transport; do not pass it as a URL query parameter.

      - `"gpt-live-1"`

  - `status: "active"`

    The status of the session snapshot. Always `active`, including the final snapshot in session.closed; use the event type to determine that the session has closed.

    - `"active"`

  - `audio: optional object { format, output }`

    Startup audio configuration. Only primary WebSockets accept audio.format; WebRTC and SIP negotiate their media format. Voice and format are immutable after startup.

    - `format: optional AudioFormat`

      Audio encoding and sample rate for audio sent and received over a Live WebSocket connection. WebRTC and SIP negotiate their media format separately.

      - `AudioPCM object { rate, type }`

        Raw, mono 16-bit little-endian PCM audio for a Live WebSocket connection.

        - `rate: 16000 or 24000`

          Audio sample rate in hertz. Live WebSocket PCM audio supports 16000 or 24000 Hz.

          - `16000`

          - `24000`

        - `type: "audio/pcm"`

          The audio encoding. Always `audio/pcm`.

          - `"audio/pcm"`

      - `AudioPCMU object { rate, type }`

        Raw, mono G.711 μ-law audio for a Live WebSocket connection.

        - `rate: number`

          Audio sample rate in hertz. G.711 audio uses 8000 Hz.

        - `type: "audio/pcmu"`

          The audio encoding. Always `audio/pcmu`.

          - `"audio/pcmu"`

      - `AudioPCMA object { rate, type }`

        Raw, mono G.711 A-law audio for a Live WebSocket connection.

        - `rate: number`

          Audio sample rate in hertz. G.711 audio uses 8000 Hz.

        - `type: "audio/pcma"`

          The audio encoding. Always `audio/pcma`.

          - `"audio/pcma"`

    - `output: optional object { voice }`

      The voice used for speech generated by the Live model.

      - `voice: optional string or "alloy" or "ash" or "ballad" or 19 more or CustomVoice`

        The voice used for Live speech, as a built-in voice name or a custom voice object containing its ID. Defaults to `marin` and cannot change after startup.

        - `string`

        - `"alloy" or "ash" or "ballad" or 19 more`

          The voice used for Live speech, as a built-in voice name or a custom voice object containing its ID. Defaults to `marin` and cannot change after startup.

          - `"alloy"`

          - `"ash"`

          - `"ballad"`

          - `"beacon"`

          - `"bossa"`

          - `"cedar"`

          - `"cinder"`

          - `"coral"`

          - `"delta"`

          - `"echo"`

          - `"gleam"`

          - `"marin"`

          - `"meridian"`

          - `"quartz"`

          - `"ripple"`

          - `"sage"`

          - `"shimmer"`

          - `"stone"`

          - `"tempo"`

          - `"verse"`

          - `"vesper"`

          - `"willow"`

        - `CustomVoice object { id }`

          - `id: string`

  - `client: optional ClientConfig`

    Startup-only capabilities for an untrusted frontend attached to a unified WebRTC session. Trusted sideband connections are unaffected.

    - `data_channel: DataChannelConfig`

      Client and server event permissions for the WebRTC frontend data channel.

      - `allowed_client_events: optional "all" or array of string`

        Client event types that the frontend data channel may send. Use 'all' to allow every client event; an empty array allows none. Omission preserves the existing allow-all behavior.

        - `"all"`

          - `"all"`

        - `array of string`

      - `allowed_server_events: optional "all" or array of ServerEventSelector`

        Server events that may be sent to the frontend data channel. Use 'all' to allow every server event; an empty array allows none. Omission preserves the existing allow-all behavior. Responses events use an object with type 'response.event' and a response_event selector.

        - `"all"`

          - `"all"`

        - `array of ServerEventSelector`

          - `type: string`

            The outer Live server event type. Use 'response.event' for Responses events.

          - `response_event: optional string`

            The nested Responses event type. Required when type is 'response.event'; forbidden for other event types.

  - `delegation: optional ClientDelegation or object { responses, type }  or null`

    Who handles tasks delegated by the Live model. Omitted or null selects your application; use `responses` to let the API manage a Responses backend.

    - `ClientDelegation object { type }`

      Delegate tasks to your application. The Live session emits delegation events that your backend handles.

      - `type: "client"`

        The delegation owner. Always `client` for tasks handled by your application.

        - `"client"`

    - `Responses object { responses, type }`

      Delegate tasks to a Responses model managed by the Live session.

      - `responses: ResponsesDelegationConfig`

        Backend model, prompt, and tools used when the Live session delegates a task to Responses.

        - `model: string`

          The model used for server-owned Responses delegations.

        - `instructions: optional string or null`

          Instructions for the delegated Responses model, separate from Live instructions. See [backend prompting](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt).

        - `max_output_tokens: optional number or null`

          Maximum number of output tokens for each delegated response.

        - `parallel_tool_calls: optional boolean or null`

          Whether the delegated Responses model may request multiple tool calls in a single response.

        - `reasoning: optional object { effort, summary }  or null`

          Reasoning settings passed to each delegated Responses request.

          - `effort: optional "none" or "minimal" or "low" or 3 more or null`

            How much reasoning effort the delegated Responses model should use. Supported values depend on the backend model.

            - `"none"`

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `summary: optional "concise" or "detailed" or "auto" or null`

            The reasoning summary to request from the delegated Responses model, when supported.

            - `"concise"`

            - `"detailed"`

            - `"auto"`

        - `service_tier: optional "auto" or "default" or "fast_tier_temp_pilot" or 3 more or null`

          Service tier for delegated Responses requests.

          - `"auto"`

          - `"default"`

          - `"fast_tier_temp_pilot"`

          - `"flex"`

          - `"priority"`

          - `"ultrafast"`

        - `text: optional object { verbosity }  or null`

          Text generation settings passed to each delegated Responses request.

          - `verbosity: optional "low" or "medium" or "high" or null`

            The amount of detail in text generated by the Responses backend. This does not configure the Live model’s spoken delivery.

            - `"low"`

            - `"medium"`

            - `"high"`

        - `tool_choice: optional "auto" or "none" or "required" or object { name, type }  or object { name, server_label, type }`

          Controls which tool the Responses backend uses when handling a task delegated by the Live model.

          - `LiveToolChoiceEnum = "auto" or "none" or "required"`

            - `"auto"`

            - `"none"`

            - `"required"`

          - `LiveFunctionToolChoiceParam object { name, type }`

            - `name: string`

            - `type: "function"`

              - `"function"`

          - `LiveMCPToolChoiceParam object { name, server_label, type }`

            - `name: string`

            - `server_label: string`

            - `type: "mcp"`

              - `"mcp"`

        - `tools: optional array of FunctionTool or object { type }`

          Tools available to the Responses backend while it handles tasks delegated by the Live model.

          - `FunctionTool object { name, type, description, 2 more }`

            A function tool available to the Responses backend when the Live model delegates a task.

            - `name: string`

              The name the delegated Responses model uses when calling this function.

            - `type: "function"`

              The tool type. Always `function`.

              - `"function"`

            - `description: optional string or null`

              What the function does and when the delegated Responses model should call it.

            - `parameters: optional map[unknown] or null`

              A JSON Schema object describing the arguments accepted by the function.

            - `strict: optional boolean or null`

              Whether the delegated Responses model must follow the function’s parameter schema exactly.

          - `WebSearch object { type }`

            A web search tool available to the Live session’s Responses backend.

            - `type: "web_search"`

              The tool type. Always `web_search`.

              - `"web_search"`

      - `type: "responses"`

        The delegation owner. Always `responses` for tasks handled by the Responses API.

        - `"responses"`

  - `input: optional array of InitialItem`

    Ordered text-only history supplied before startup. Supports developer, user, and assistant messages with one text part each; at most 128 messages and 8,192 rendered tokens in total.

    - `Developer object { content, role, id, 2 more }`

      A developer message included in the initial text history of a Live session.

      - `content: array of object { text, type }`

        The message content. Supply exactly one text part for the initial Live conversation history.

        - `text: string`

          The message text to include in the Live session’s initial conversation history.

        - `type: optional "input_text"`

          The text content type. Always `input_text`.

          - `"input_text"`

      - `role: "developer"`

        The author of this history message. Always `developer`.

        - `"developer"`

      - `id: optional string or null`

        An optional identifier for the supplied history message. Live uses the message’s role and text to initialize the conversation.

      - `status: optional "incomplete" or "completed" or null`

        The supplied message’s status. Live uses its text as history and does not resume an incomplete message.

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        The history item type. Always `message`.

        - `"message"`

    - `User object { content, role, id, 2 more }`

      A user message included in the initial text history of a Live session.

      - `content: array of object { text, type }`

        The message content. Supply exactly one text part for the initial Live conversation history.

        - `text: string`

          The message text to include in the Live session’s initial conversation history.

        - `type: optional "input_text"`

          The text content type. Always `input_text`.

          - `"input_text"`

      - `role: "user"`

        The author of this history message. Always `user`.

        - `"user"`

      - `id: optional string or null`

        An optional identifier for the supplied history message. Live uses the message’s role and text to initialize the conversation.

      - `status: optional "incomplete" or "completed" or null`

        The supplied message’s status. Live uses its text as history and does not resume an incomplete message.

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        The history item type. Always `message`.

        - `"message"`

    - `Assistant object { content, role, id, 2 more }`

      An assistant message included in the initial text history of a Live session.

      - `content: array of object { text, type }  or object { text, type }`

        The message content. Supply exactly one text part for the initial Live conversation history.

        - `Text object { text, type }`

          Assistant text supplied as conversation history when starting a Live session.

          - `text: string`

            The message text to include in the Live session’s initial conversation history.

          - `type: optional "text"`

            The text content type. Always `text`.

            - `"text"`

        - `OutputText object { text, type }`

          Assistant output text supplied as conversation history when starting a Live session.

          - `text: string`

            The message text to include in the Live session’s initial conversation history.

          - `type: "output_text"`

            The text content type. Always `output_text`.

            - `"output_text"`

      - `role: "assistant"`

        The author of this history message. Always `assistant`.

        - `"assistant"`

      - `id: optional string or null`

        An optional identifier for the supplied history message. Live uses the message’s role and text to initialize the conversation.

      - `status: optional "incomplete" or "completed" or null`

        The supplied message’s status. Live uses its text as history and does not resume an incomplete message.

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        The history item type. Always `message`.

        - `"message"`

  - `instructions: optional string or null`

    Frontend instructions for voice, conversation, interruptions, and when to delegate. Start with the [Live prompting guide](https://developers.openai.com/api/docs/guides/live-prompting); put business rules and tool workflows in a separate [backend prompt](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt). Limited to 16,384 client-supplied tokens. Omitted or blank instructions use server defaults. Immutable after startup.

  - `store: optional boolean`

    Whether to store the session for later forking and recording download. Defaults to false for new sessions.

- `type: "session.closed"`

  The event type, always `session.closed`.

  - `"session.closed"`

- `usage: SessionUsage`

  The final cumulative Live audio usage after session finalization.

  - `seconds: number`

    The cumulative Live audio duration in seconds. Do not sum this value across usage events.

- `client_event_id: optional string`

  The event_id of the client command associated with this server event, when supplied.

#### Example

```json
{
  "type": "session.closed",
  "event_id": "evt_closed_001",
  "client_event_id": "evt_close_001",
  "reason": "close_requested",
  "session": {
    "id": "live_abc123",
    "model": "gpt-live-1",
    "status": "active",
    "expires_at": 1788555600,
    "instructions": "Help the caller plan a restaurant reservation. Confirm details before booking.",
    "input": [],
    "audio": {
      "format": {
        "type": "audio/pcm",
        "rate": 24000
      },
      "output": {
        "voice": "marin"
      }
    },
    "delegation": {
      "type": "client"
    }
  },
  "usage": {
    "seconds": 45.8
  }
}
```

<a id="error"></a>

### error

Reports an error in the Live session, such as an invalid client command. Use error.client_event_id, when present, to identify the command that caused the error.

#### Schema

Schema name: `LiveErrorEvent`

- `error: Error`

  Details of the Live error and the client command that caused it, when known.

  - `code: string`

    A machine-readable code identifying the Live error, such as `unknown_parameter`.

  - `message: string`

    A human-readable explanation of the Live error.

  - `type: string`

    The category of error, such as `invalid_request_error` for an invalid Live client command.

  - `client_event_id: optional string`

    The event_id of the client command that caused the error, when supplied.

  - `param: optional string`

    The parameter that caused the error, when applicable, such as `session.voice`.

- `event_id: string`

  The unique ID of the Live server event.

- `type: "error"`

  The event type, always `error`.

  - `"error"`

- `client_event_id: optional string`

  The event_id of the client command associated with this server event, when supplied.

#### Example

```json
{
  "type": "error",
  "event_id": "evt_error_001",
  "error": {
    "type": "invalid_request_error",
    "code": "unknown_parameter",
    "message": "Unknown parameter: 'session.voice'.",
    "param": "session.voice",
    "client_event_id": "evt_invalid_001"
  }
}
```

<a id="info"></a>

### info

An informational notice about the Live session, such as the event permissions applied to a frontend data channel.

#### Schema

Schema name: `LiveInfoEvent`

- `code: string`

  A machine-readable code for the notice, such as `data_channel_permissions`.

- `event_id: string`

  The unique ID of the Live server event.

- `message: string`

  A human-readable explanation of the Live session notice.

- `type: "info"`

  The event type, always `info`.

  - `"info"`

- `client_event_id: optional string`

  The event_id of the client command associated with this server event, when supplied.

#### Example

```json
{
  "type": "info",
  "event_id": "evt_info_001",
  "code": "data_channel_permissions",
  "message": "The frontend data channel is configured with restricted event permissions."
}
```

<a id="server-events-session.input_audio.append"></a>

### session.input_audio.append

Input audio received from the primary transport and reflected to a Live sideband connection before model-input muting.

#### Schema

Schema name: `LiveInputAudioAppend`

- `audio: string`

  Base64-encoded raw mono PCM16LE at 24 kHz received from the primary transport, reflected to the sideband before model-input muting. This server event uses the same audio key as the client command, but is not an acknowledgment of it.

- `type: "session.input_audio.append"`

  The event type, always `session.input_audio.append`.

  - `"session.input_audio.append"`

#### Example

```json
{
  "type": "session.input_audio.append",
  "audio": "AACAAIAAAIAAAP9/AIAAgA=="
}
```

<a id="transport.dtmf.received"></a>

### transport.dtmf.received

A SIP DTMF keypress received from the caller. Delivered only to sideband observers.

#### Schema

Schema name: `LiveTransportDTMFReceived`

- `event: string`

- `event_id: string`

- `type: "transport.dtmf.received"`

  - `"transport.dtmf.received"`

#### Example

```json
{
  "type": "transport.dtmf.received",
  "event_id": "event_dtmf_1",
  "event": "5"
}
```

<a id="transport.dtmf.send"></a>

### transport.dtmf.send

A SIP DTMF keypress successfully sent by the hosted tool. Delivered only to sideband observers; this is not a client command.

#### Schema

Schema name: `LiveTransportDTMFSend`

- `event: string`

- `event_id: string`

- `type: "transport.dtmf.send"`

  - `"transport.dtmf.send"`

#### Example

```json
{
  "type": "transport.dtmf.send",
  "event_id": "event_dtmf_2",
  "event": "#"
}
```

<a id="transport.ringing"></a>

### transport.ringing

The outbound SIP provider leg is ringing or providing early media. Delivered only to sideband observers.

#### Schema

Schema name: `LiveTransportRinging`

- `event_id: string`

- `session_id: string`

  The canonical Live session ID.

- `type: "transport.ringing"`

  - `"transport.ringing"`

#### Example

```json
{
  "type": "transport.ringing",
  "event_id": "event_call_1",
  "session_id": "live_u0_123"
}
```

<a id="transport.answered"></a>

### transport.answered

The outbound SIP provider leg answered and media is established. Delivered only to sideband observers.

#### Schema

Schema name: `LiveTransportAnswered`

- `event_id: string`

- `session_id: string`

  The canonical Live session ID.

- `type: "transport.answered"`

  - `"transport.answered"`

#### Example

```json
{
  "type": "transport.answered",
  "event_id": "event_call_2",
  "session_id": "live_u0_123"
}
```

<a id="transport.failed"></a>

### transport.failed

An asynchronous outbound SIP setup failure. Delivered only to sideband observers.

#### Schema

Schema name: `LiveTransportFailed`

- `error: object { code, message, type, param }`

  - `code: string`

    The call setup failure code.

  - `message: string`

  - `type: "call_error"`

    - `"call_error"`

  - `param: optional string`

    The parameter related to the error, if any. Empty when no parameter applies.

- `event_id: string`

- `session_id: string`

  The canonical Live session ID.

- `type: "transport.failed"`

  - `"transport.failed"`

#### Example

```json
{
  "type": "transport.failed",
  "event_id": "event_call_4",
  "session_id": "live_u0_123",
  "error": {
    "type": "call_error",
    "code": "provider_invite_failed",
    "message": "provider rejected the call",
    "param": ""
  }
}
```
