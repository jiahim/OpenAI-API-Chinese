# Primary WebSocket

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取该页面的 Markdown 版本。

在你的后端服务器上使用你的 OpenAI API key 连接，以启动 Live 会话。在同一个 WebSocket 连接上发送和接收音频与控制事件。

WS `/v1/live/sessions`

## Connection

`wss://api.openai.com/v1/live/sessions`

在你的后端使用你的 OpenAI API 密钥进行身份验证， `Authorization: Bearer $OPENAI_API_KEY` header。将密钥保存在你的服务器上。

无查询参数。连接后，使用你的模型和会话配置发送 session.start。等待 session.started 后再发送音频。

## Inputs

在连接后必须立即发送一次。在此配置会话，然后发送音频和其他客户端事件。

### First message: session.start

```json
{
  "type": "session.start",
  "event_id": "evt_start_001",
  "session": {
    "model": "gpt-live-1",
    "instructions": "Help the caller plan a restaurant reservation. Confirm details before booking.",
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

[所有客户端事件](#client-events)

## Outputs

服务端确认会话已开始。会话运行期间，会随之返回音频、转录以及其他服务端事件。

### Session ready · 摘要：session.started

```json
{
  "type": "session.started",
  "event_id": "event_started_1",
  "session": {
    "id": "live_123",
    "expires_at": 1788307200,
    "status": "active",
    "model": "gpt-live-1"
  }
}
```

[所有服务端事件](#server-events)

[前端使用 WebRTC？通过你的后端附加一个边带 WebSocket。](https://developers.openai.com/api/reference/resources/live/sideband-websocket)

<a id="client-events"></a>

## 客户端事件

<a id="session.start"></a>

### session.start

在主 WebSocket 上启动一个 Live 会话。请在其他命令之前发送此事件，并等待 `session.started`.

#### Schema

Schema name: `LiveSessionStartEvent`

- `session: SessionConfig`

  主 WebSocket 的初始配置。先发送 session.start，并等待 session.started 之后再发送应用命令。WebRTC 创建流程已经会启动会话，因此不要在其数据通道上再次发送此事件。

  - `model: string or "gpt-live-1"`

    Live 模型。在每种传输方式的会话配置中均为必填；不要将其作为 URL 查询参数传递。

    - `string`

    - `"gpt-live-1"`

      Live 模型。在每种传输方式的会话配置中均为必填；不要将其作为 URL 查询参数传递。

      - `"gpt-live-1"`

  - `audio: optional object { format, output }`

    启动时的音频配置。仅主 WebSocket 接受 audio.format；WebRTC 和 SIP 会自行协商媒体格式。voice 和 format 在启动后不可更改。

    - `format: optional AudioFormat`

      通过 Live WebSocket 连接发送和接收的音频编码及采样率。WebRTC 和 SIP 分别协商其媒体格式。

      - `AudioPCM object { rate, type }`

        Live WebSocket 连接使用的原始单声道 16 位小端 PCM 音频。

        - `rate: 16000 or 24000`

          音频采样率，单位为赫兹。Live WebSocket 的 PCM 音频支持 16000 或 24000 Hz。

          - `16000`

          - `24000`

        - `type: "audio/pcm"`

          音频编码。始终为 `audio/pcm`.

          - `"audio/pcm"`

      - `AudioPCMU object { rate, type }`

        Live WebSocket 连接使用的原始单声道 G.711 μ-law 音频。

        - `rate: number`

          音频采样率，单位为赫兹。G.711 音频使用 8000 Hz。

        - `type: "audio/pcmu"`

          音频编码。始终为 `audio/pcmu`.

          - `"audio/pcmu"`

      - `AudioPCMA object { rate, type }`

        Live WebSocket 连接使用的原始单声道 G.711 A-law 音频。

        - `rate: number`

          音频采样率，单位为赫兹。G.711 音频使用 8000 Hz。

        - `type: "audio/pcma"`

          音频编码。始终为 `audio/pcma`.

          - `"audio/pcma"`

    - `output: optional object { voice }`

      由 Live 模型生成的语音所使用的声音。

      - `voice: optional string or "alloy" or "ash" or "aube" or 29 more or CustomVoice`

        用于 Live 语音的声音，可以是内置声音名称，也可以是包含其 ID 的自定义声音对象。默认为 `marin` ，且启动后不可更改。

        - `string`

        - `"alloy" or "ash" or "aube" or 29 more`

          用于 Live 语音的声音，可以是内置声音名称，也可以是包含其 ID 的自定义声音对象。默认为 `marin` ，且启动后不可更改。

          - `"alloy"`

          - `"ash"`

          - `"aube"`

          - `"ballad"`

          - `"beacon"`

          - `"bossa"`

          - `"brise"`

          - `"cedar"`

          - `"cinder"`

          - `"coral"`

          - `"delta"`

          - `"echo"`

          - `"flitz"`

          - `"gleam"`

          - `"harema"`

          - `"juni"`

          - `"marin"`

          - `"meridian"`

          - `"nira"`

          - `"noeul"`

          - `"nuri"`

          - `"quartz"`

          - `"ripple"`

          - `"sage"`

          - `"shimmer"`

          - `"shitan"`

          - `"sillage"`

          - `"stone"`

          - `"tempo"`

          - `"verse"`

          - `"vesper"`

          - `"willow"`

        - `CustomVoice object { id }`

          - `id: string`

  - `client: optional ClientConfig`

    附加到统一 WebRTC 会话的不可信前端的仅启动时生效的能力。可信的旁路连接不受影响。

    - `data_channel: DataChannelConfig`

      WebRTC 前端数据通道的客户端和服务器事件权限。

      - `allowed_client_events: optional "all" or array of string`

        前端数据通道可以发送的客户端事件类型。使用 'all' 允许所有客户端事件；空数组表示不允许任何事件。省略时保持现有的全允许行为。

        - `"all"`

          - `"all"`

        - `array of string`

      - `allowed_server_events: optional "all" or array of ServerEventSelector`

        可以发送到前端数据通道的服务器事件。使用 'all' 允许所有服务器事件；空数组表示不允许任何事件。省略时保持现有的全允许行为。Responses 事件使用一个 type 为 'response.event' 的对象，并附带 response_event 选择器。

        - `"all"`

          - `"all"`

        - `array of ServerEventSelector`

          - `type: string`

            外层的 Live 服务器事件类型。对于 Responses 事件，请使用 'response.event'。

          - `response_event: optional string`

            嵌套的 Responses 事件类型。当 type 为 'response.event' 时必填；对于其他事件类型禁止使用。

  - `delegation: optional ClientDelegation or object { responses, type }  or null`

    处理由 Live 模型委派的任务的对象。省略或为 null 表示由你的应用处理；使用 `responses` 以便让 API 管理一个 Responses 后端。

    - `ClientDelegation object { type }`

      将任务委托给你的应用。Live 会话会发出委托事件,由你的后端处理。

      - `type: "client"`

        委托的所有者。始终 `client` 用于由你的应用处理的任务。

        - `"client"`

    - `Responses object { responses, type }`

      将任务委托给由 Live 会话管理的 Responses 模型。

      - `responses: ResponsesDelegationConfig`

        当 Live 会话将任务委托给 Responses 时使用的后端模型、提示和工具。

        - `model: string`

          用于服务端 Responses 委托的模型。

        - `instructions: optional string or null`

          委托给 Responses 模型的指令,与 Live 指令分开。请参阅 [后端提示](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt).

        - `max_output_tokens: optional number or null`

          每个委托响应的最大输出 token 数。

        - `parallel_tool_calls: optional boolean or null`

          委托的 Responses 模型是否可以在单个响应中请求多个工具调用。

        - `reasoning: optional object { effort, summary }  or null`

          传递给每个委托 Responses 请求的推理设置。

          - `effort: optional "none" or "minimal" or "low" or 3 more or null`

            委托的 Responses 模型应使用的推理力度。支持的值取决于后端模型。

            - `"none"`

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `summary: optional "concise" or "detailed" or "auto" or null`

            在受支持时,从委托的 Responses 模型请求的推理摘要。

            - `"concise"`

            - `"detailed"`

            - `"auto"`

        - `service_tier: optional "auto" or "default" or "fast_tier_temp_pilot" or 3 more or null`

          委托的 Responses 请求的服务层级。

          - `"auto"`

          - `"default"`

          - `"fast_tier_temp_pilot"`

          - `"flex"`

          - `"priority"`

          - `"ultrafast"`

        - `text: optional object { verbosity }  or null`

          传递给每个委托 Responses 请求的文本生成设置。

          - `verbosity: optional "low" or "medium" or "high" or null`

            Responses 后端生成文本的详细程度。这不会配置 Live 模型的口头表达方式。

            - `"low"`

            - `"medium"`

            - `"high"`

        - `tool_choice: optional "auto" or "none" or "required" or object { name, type }  or object { name, server_label, type }`

          控制 Responses 后端在处理 Live 模型委托的任务时所使用的工具。

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

        - `tools: optional array of FunctionTool or object { type }  or object { type }  or 3 more`

          在 Responses 后端处理 Live 模型委托的任务时可用的工具。

          - `FunctionTool object { name, type, description, 2 more }`

            当 Live 模型委托任务时,Responses 后端可用的函数工具。

            - `name: string`

              被委托的 Responses 模型在调用此函数时使用的名称。

            - `type: "function"`

              工具类型。始终为 `function`.

              - `"function"`

            - `description: optional string or null`

              该函数的功能以及何时应被被委托的 Responses 模型调用。

            - `parameters: optional map[unknown] or null`

              一个描述该函数所接受参数的 JSON Schema 对象。

            - `strict: optional boolean or null`

              被委托的 Responses 模型是否必须严格按照函数的参数模式执行。

          - `WebSearch object { type }`

            Live 会话的 Responses 后端可用的一个网页搜索工具。

            - `type: "web_search"`

              工具类型。始终为 `web_search`.

              - `"web_search"`

          - `FileSearch object { type }`

            - `type: "file_search"`

              - `"file_search"`

          - `CodeInterpreter object { type }`

            - `type: "code_interpreter"`

              - `"code_interpreter"`

          - `Shell object { environment, type }`

            一个带有 container_auto 或 container_reference 环境的 Responses shell 工具。不支持本地执行和域密钥。

            - `environment: map[unknown]`

            - `type: "shell"`

              - `"shell"`

          - `ImageGeneration object { type }`

            - `type: "image_generation"`

              - `"image_generation"`

      - `type: "responses"`

        委托的所有者。始终 `responses` 用于由 Responses API 处理的任务。

        - `"responses"`

  - `input: optional array of InitialItem`

    启动前提供的纯文本有序历史记录。支持 developer、user 和 assistant 消息，每条消息仅含一个文本部分；总计最多 128 条消息，渲染后的 token 总数不超过 8,192。

    - `Developer object { content, role, id, 2 more }`

      包含在 Live 会话初始文本历史记录中的一条 developer 消息。

      - `content: array of object { text, type }`

        消息内容。为初始 Live 对话历史记录提供恰好一个文本部分。

        - `text: string`

          要包含在 Live 会话初始对话历史记录中的消息文本。

        - `type: optional "input_text"`

          文本内容类型。始终为 `input_text`.

          - `"input_text"`

      - `role: "developer"`

        此历史消息的作者。始终为 `developer`.

        - `"developer"`

      - `id: optional string or null`

        所提供历史消息的可选标识符。Live 使用该消息的角色和文本来初始化对话。

      - `status: optional "incomplete" or "completed" or null`

        所提供消息的状态。Live 将其文本用作历史记录，但不会恢复未完成的消息。

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        历史记录项的类型。始终为 `message`.

        - `"message"`

    - `User object { content, role, id, 2 more }`

      包含在 Live 会话初始文本历史记录中的一条 user 消息。

      - `content: array of object { text, type }`

        消息内容。为初始 Live 对话历史记录提供恰好一个文本部分。

        - `text: string`

          要包含在 Live 会话初始对话历史记录中的消息文本。

        - `type: optional "input_text"`

          文本内容类型。始终为 `input_text`.

          - `"input_text"`

      - `role: "user"`

        此历史消息的作者。始终为 `user`.

        - `"user"`

      - `id: optional string or null`

        所提供历史消息的可选标识符。Live 使用该消息的角色和文本来初始化对话。

      - `status: optional "incomplete" or "completed" or null`

        所提供消息的状态。Live 将其文本用作历史记录，但不会恢复未完成的消息。

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        历史记录项的类型。始终为 `message`.

        - `"message"`

    - `Assistant object { content, role, id, 2 more }`

      包含在 Live 会话初始文本历史记录中的一条 assistant 消息。

      - `content: array of object { text, type }  or object { text, type }`

        消息内容。为初始 Live 对话历史记录提供恰好一个文本部分。

        - `Text object { text, type }`

          启动 Live 会话时作为对话历史提供的 assistant 文本。

          - `text: string`

            要包含在 Live 会话初始对话历史记录中的消息文本。

          - `type: optional "text"`

            文本内容类型。始终为 `text`.

            - `"text"`

        - `OutputText object { text, type }`

          在启动 Live 会话时，作为对话历史提供的助手输出文本。

          - `text: string`

            要包含在 Live 会话初始对话历史记录中的消息文本。

          - `type: "output_text"`

            文本内容类型。始终为 `output_text`.

            - `"output_text"`

      - `role: "assistant"`

        此历史消息的作者。始终为 `assistant`.

        - `"assistant"`

      - `id: optional string or null`

        所提供历史消息的可选标识符。Live 使用该消息的角色和文本来初始化对话。

      - `status: optional "incomplete" or "completed" or null`

        所提供消息的状态。Live 将其文本用作历史记录，但不会恢复未完成的消息。

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        历史记录项的类型。始终为 `message`.

        - `"message"`

  - `instructions: optional string or null`

    用于语音、对话、被打断以及何时进行委托的前端指令。首先从 [Live 提示指南](https://developers.openai.com/api/docs/guides/live-prompting)；入手；将业务规则和工具工作流放在单独的 [后端提示](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt)。中。最多 16,384 个客户端提供的 token。如果省略或留空，则使用服务端默认值。启动后不可修改。

  - `store: optional boolean`

    是否存储该会话，以便后续派生分支和下载录制内容。新会话默认为 false。

- `type: "session.start"`

  Live 客户端事件类型。始终为 `session.start`.

  - `"session.start"`

- `event_id: optional string or null`

  可选的客户端标识符，用于将此命令与服务端事件的 client_event_id 或 error.client_event_id 进行关联。

#### 示例

```json
{
  "type": "session.start",
  "event_id": "evt_start_001",
  "session": {
    "model": "gpt-live-1",
    "instructions": "Help the caller plan a restaurant reservation. Confirm details before booking.",
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

<a id="session.update"></a>

### session.update

更新正在进行的 Live 会话的委托设置。服务器会通过以下响应确认已接受的更改： `session.updated`.

#### Schema

Schema name: `LiveSessionUpdateParam`

- `session: SessionUpdateConfig`

  稀疏的委托更新。省略的设置保留其原值。委托类型不可更改，包括将 Responses 委托重置为 null 或 client。Model、frontend instructions、audio 和 startup input 均不可更改。

  - `delegation: optional ClientDelegation or object { type, responses }  or null`

    要更新的委托设置。委托类型必须与当前会话匹配；省略的设置保留其原值。

    - `ClientDelegation object { type }`

      将任务委托给你的应用。Live 会话会发出委托事件,由你的后端处理。

      - `type: "client"`

        委托的所有者。始终 `client` 用于由你的应用处理的任务。

        - `"client"`

    - `Responses object { type, responses }`

      在不更改委托归属的情况下，更新现有 Live 会话的 Responses 后端。

      - `type: "responses"`

        委托的所有者。始终 `responses` 用于由 Responses API 处理的任务。

        - `"responses"`

      - `responses: optional ResponsesDelegationUpdateConfig`

        要更新的 Responses 后端设置。省略的设置保留其现有值。

        - `instructions: optional string or null`

          委托给 Responses 模型的指令,与 Live 指令分开。请参阅 [后端提示](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt).

        - `max_output_tokens: optional number or null`

          每个委托响应的最大输出 token 数。

        - `model: optional string`

          用于后续委托请求的 Responses 后端模型。省略以保留当前的后端模型。

        - `parallel_tool_calls: optional boolean or null`

          委托的 Responses 模型是否可以在单个响应中请求多个工具调用。

        - `reasoning: optional object { effort, summary }  or null`

          传递给每个委托 Responses 请求的推理设置。

          - `effort: optional "none" or "minimal" or "low" or 3 more or null`

            委托的 Responses 模型应使用的推理力度。支持的值取决于后端模型。

            - `"none"`

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `summary: optional "concise" or "detailed" or "auto" or null`

            在受支持时,从委托的 Responses 模型请求的推理摘要。

            - `"concise"`

            - `"detailed"`

            - `"auto"`

        - `service_tier: optional "auto" or "default" or "fast_tier_temp_pilot" or 3 more or null`

          委托的 Responses 请求的服务层级。

          - `"auto"`

          - `"default"`

          - `"fast_tier_temp_pilot"`

          - `"flex"`

          - `"priority"`

          - `"ultrafast"`

        - `text: optional object { verbosity }  or null`

          传递给每个委托 Responses 请求的文本生成设置。

          - `verbosity: optional "low" or "medium" or "high" or null`

            Responses 后端生成文本的详细程度。这不会配置 Live 模型的口头表达方式。

            - `"low"`

            - `"medium"`

            - `"high"`

        - `tool_choice: optional "auto" or "none" or "required" or object { name, type }  or object { name, server_label, type }`

          控制 Responses 后端在处理 Live 模型委托的任务时所使用的工具。

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

        - `tools: optional array of FunctionTool or object { type }  or object { type }  or 3 more`

          在 Responses 后端处理 Live 模型委托的任务时可用的工具。

          - `FunctionTool object { name, type, description, 2 more }`

            当 Live 模型委托任务时,Responses 后端可用的函数工具。

            - `name: string`

              被委托的 Responses 模型在调用此函数时使用的名称。

            - `type: "function"`

              工具类型。始终为 `function`.

              - `"function"`

            - `description: optional string or null`

              该函数的功能以及何时应被被委托的 Responses 模型调用。

            - `parameters: optional map[unknown] or null`

              一个描述该函数所接受参数的 JSON Schema 对象。

            - `strict: optional boolean or null`

              被委托的 Responses 模型是否必须严格按照函数的参数模式执行。

          - `WebSearch object { type }`

            Live 会话的 Responses 后端可用的一个网页搜索工具。

            - `type: "web_search"`

              工具类型。始终为 `web_search`.

              - `"web_search"`

          - `FileSearch object { type }`

            - `type: "file_search"`

              - `"file_search"`

          - `CodeInterpreter object { type }`

            - `type: "code_interpreter"`

              - `"code_interpreter"`

          - `Shell object { environment, type }`

            一个带有 container_auto 或 container_reference 环境的 Responses shell 工具。不支持本地执行和域密钥。

            - `environment: map[unknown]`

            - `type: "shell"`

              - `"shell"`

          - `ImageGeneration object { type }`

            - `type: "image_generation"`

              - `"image_generation"`

- `type: "session.update"`

  Live 客户端事件类型。始终为 `session.update`.

  - `"session.update"`

- `event_id: optional string or null`

  可选的客户端标识符，用于将此命令与服务端事件的 client_event_id 或 error.client_event_id 进行关联。

#### 示例

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

通过主 WebSocket 向 Live 会话发送音频。WebRTC 和 SIP 会话通过其媒体传输发送音频。

#### Schema

Schema name: `LiveInputAudioAppendEvent`

- `audio: string`

  启动时所选格式下的 Base64 编码原始音频，不包含 WAV 或其他容器头部。仅限主 WebSocket；媒体传输使用其各自的音频轨道。音频追加不发送确认。反射式边带服务端事件会复用此事件类型和音频键，没有 timestamp 或 event_id；其音频始终为 24 kHz 的单声道 PCM16LE。

- `type: "session.input_audio.append"`

  Live 客户端事件类型。始终为 `session.input_audio.append`.

  - `"session.input_audio.append"`

- `event_id: optional string or null`

  可选的客户端标识符，用于将此命令与服务端事件的 client_event_id 或 error.client_event_id 进行关联。

#### 示例

```json
{
  "type": "session.input_audio.append",
  "audio": "AACAAIAAAIAAAP9/AIAAgA=="
}
```

<a id="session.input_audio.mute"></a>

### session.input_audio.mute

在不关闭会话的情况下将音频输入静音到 Live 模型。服务器通过 `session.input_audio.muted`.

#### Schema

Schema name: `LiveInputAudioMuteParam`

- `type: "session.input_audio.mute"`

  Live 客户端事件类型。始终为 `session.input_audio.mute`.

  - `"session.input_audio.mute"`

- `event_id: optional string or null`

  可选的客户端标识符，用于将此命令与服务端事件的 client_event_id 或 error.client_event_id 进行关联。

#### 示例

```json
{
  "type": "session.input_audio.mute",
  "event_id": "evt_mute_001"
}
```

<a id="session.input_audio.unmute"></a>

### session.input_audio.unmute

将音频输入从静音状态恢复到 Live 模型。服务端以 `session.input_audio.unmuted`.

#### Schema

Schema name: `LiveInputAudioUnmuteParam`

- `type: "session.input_audio.unmute"`

  Live 客户端事件类型。始终为 `session.input_audio.unmute`.

  - `"session.input_audio.unmute"`

- `event_id: optional string or null`

  可选的客户端标识符，用于将此命令与服务端事件的 client_event_id 或 error.client_event_id 进行关联。

#### 示例

```json
{
  "type": "session.input_audio.unmute",
  "event_id": "evt_unmute_001"
}
```

<a id="session.instructions.append"></a>

### session.instructions.append

在 Live 对话运行期间向其追加指令，可选择将这些指令与已有的客户端委派关联起来。

#### Schema

Schema name: `LiveInstructionsAppendParam`

- `content: string`

  要追加的指令文本，上限为 500 个 token。这是一个纯字符串,不是内容部分的数组。

- `delegation_id: string or null`

  必填，可为 null。设为 null 表示通用会话上下文，或使用 session.delegation.created 中的 ID 来关联已存在的客户端委托。非 null 的 ID 不能与 Responses 委托一起使用。

- `type: "session.instructions.append"`

  Live 客户端事件类型。始终为 `session.instructions.append`.

  - `"session.instructions.append"`

- `event_id: optional string or null`

  可选的客户端标识符，用于将此命令与服务端事件的 client_event_id 或 error.client_event_id 进行关联。

#### 示例

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

向 Live 模型提供静默推理或进度上下文，可选地用于现有的客户端委托。

#### Schema

Schema name: `LiveThinkingAppendParam`

- `content: string`

  静默推理或进度上下文，限制为 500 个 token。它不会直接请求语音，但可能影响后续语音，且不构成保密边界。

- `delegation_id: string or null`

  必填，可为 null。设为 null 表示通用会话上下文，或使用 session.delegation.created 中的 ID 来关联已存在的客户端委托。非 null 的 ID 不能与 Responses 委托一起使用。

- `type: "session.thinking.append"`

  Live 客户端事件类型。始终为 `session.thinking.append`.

  - `"session.thinking.append"`

- `event_id: optional string or null`

  可选的客户端标识符，用于将此命令与服务端事件的 client_event_id 或 error.client_event_id 进行关联。

#### 示例

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

向 Live 模型提供可向用户传达的上下文，可选地用于现有的客户端委托。

#### Schema

Schema name: `LiveCommentaryAppendParam`

- `content: string`

  Speakable context for the Live model, limited to 500 tokens. Use this for a result the model should communicate; use session.thinking.append for silent context.

- `delegation_id: string or null`

  必填，可为 null。设为 null 表示通用会话上下文，或使用 session.delegation.created 中的 ID 来关联已存在的客户端委托。非 null 的 ID 不能与 Responses 委托一起使用。

- `type: "session.commentary.append"`

  Live 客户端事件类型。始终为 `session.commentary.append`.

  - `"session.commentary.append"`

- `event_id: optional string or null`

  可选的客户端标识符，用于将此命令与服务端事件的 client_event_id 或 error.client_event_id 进行关联。

#### 示例

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

向 Live 会话的 Responses 后端添加一个输入项。需要 Responses 委托，请使用 `response.create` 来请求响应。

#### Schema

Schema name: `LiveResponseItemCreateParam`

- `item: EasyInputMessage or object { content, role, status, type }  or ResponseOutputMessage or 30 more`

  要附加到 Responses 后端对话的输入项，例如用户消息或函数工具结果。

  - `EasyInputMessage object { content, role, phase, type }`

    发送给模型的消息输入，带有用于指示遵循指令的 role
    层级。通过 `developer` 或 `system` role 给出的指令优先级高于通过
    role 给出的指令。带有 `user` role 的消息被视为模型在之前
    `assistant` 的交互中生成的内容。
    交互中所生成的。

    - `content: string or ResponseInputMessageContentList`

      发送给模型的文本、图像或音频输入，用于生成响应。
      也可以包含之前的助手响应。

      - `TextInput = string`

        发送给模型的文本输入。

      - `ResponseInputMessageContentList = array of ResponseInputContent`

        发送给模型的一个或多个输入项的列表，包含不同的内容
        类型。

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解 [image inputs](https://developers.openai.com/api/docs/guides/images-vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            要发送给模型的文件 ID。

          - `image_url: optional string or null`

            要发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 可让系统选择详情级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可降低渲染成本，或使用 `high` 以更高质量渲染文件。默认值为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            要发送给模型的文件内容。

          - `file_id: optional string or null`

            要发送给模型的文件 ID。

          - `file_url: optional string`

            要发送给模型的文件的 URL。

          - `filename: optional string`

            要发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

    - `role: "user" or "assistant" or "system" or "developer"`

      消息输入的角色。可选值为 `user`, `assistant`, `system`，或
      `developer`.

      - `"user"`

      - `"assistant"`

      - `"system"`

      - `"developer"`

    - `phase: optional "commentary" or "final_answer" or null`

      将一条 `assistant` 消息标记为中间注释（`commentary`）或最终答案（`final_answer`).
      对于像 `gpt-5.3-codex` 以及之后的请求中，发送后续请求时保留并重新发送
      阶段应用于所有助手消息 —— 删除它可能会降低性能。不用于用户消息。

      - `"commentary"`

      - `"final_answer"`

    - `type: optional "message"`

      消息输入的类型。始终 `message`.

      - `"message"`

  - `Message object { content, role, status, type }`

    发送给模型的消息输入，带有用于指示遵循指令的 role
    层级。通过 `developer` 或 `system` role 给出的指令优先级高于通过
    role 给出的指令。带有 `user` 角色。

    - `content: ResponseInputMessageContentList`

      发送给模型的一个或多个输入项的列表，包含不同的内容
      类型。

    - `role: "user" or "system" or "developer"`

      消息输入的角色。可选值为 `user`, `system`，或 `developer`.

      - `"user"`

      - `"system"`

      - `"developer"`

    - `status: optional "in_progress" or "completed" or "incomplete"`

      项目的状态。取值之一 `in_progress`, `completed`，或
      `incomplete`。当通过 API 返回项目时填充。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

    - `type: optional "message"`

      消息输入的类型。始终设置为 `message`.

      - `"message"`

  - `ResponseOutputMessage object { id, content, role, 3 more }`

    模型的输出消息。

    - `id: string`

      输出消息的唯一 ID。

    - `content: array of ResponseOutputText or ResponseOutputRefusal`

      输出消息的内容。

      - `ResponseOutputText object { annotations, logprobs, text, type }`

        模型的文本输出。

        - `annotations: array of object { file_id, filename, index, type }  or object { end_index, start_index, title, 2 more }  or object { container_id, end_index, file_id, 3 more }  or object { file_id, index, type }`

          文本输出的注释。

          - `FileCitation object { file_id, filename, index, type }`

            对文件的引用。

            - `file_id: string`

              文件的 ID。

            - `filename: string`

              所引用文件的文件名。

            - `index: number`

              在输出文本中插入文件引用的索引位置。

            - `type: "file_citation"`

              文件引用的类型。始终 `file_citation`.

              - `"file_citation"`

          - `URLCitation object { end_index, start_index, title, 2 more }`

            用于生成模型响应的网络资源的引用。

            - `end_index: number`

              消息中 URL 引用最后一个字符的索引。

            - `start_index: number`

              消息中 URL 引用第一个字符的索引。

            - `title: string`

              网页资源的标题。

            - `type: "url_citation"`

              URL 引用的类型。始终为 `url_citation`.

              - `"url_citation"`

            - `url: string`

              网页资源的 URL。

          - `ContainerFileCitation object { container_id, end_index, file_id, 3 more }`

            用于生成模型响应的容器文件的引用。

            - `container_id: string`

              容器文件的 ID。

            - `end_index: number`

              消息中容器文件引用的最后一个字符的索引。

            - `file_id: string`

              文件的 ID。

            - `filename: string`

              所引用的容器文件的文件名。

            - `start_index: number`

              消息中容器文件引用的第一个字符的索引。

            - `type: "container_file_citation"`

              容器文件引用的类型。始终为 `container_file_citation`.

              - `"container_file_citation"`

          - `FilePath object { file_id, index, type }`

            文件的路径。

            - `file_id: string`

              文件的 ID。

            - `index: number`

              文件在文件列表中的索引。

            - `type: "file_path"`

              文件路径的类型。始终为 `file_path`.

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

          模型输出的文本。

        - `type: "output_text"`

          输出文本的类型。始终为 `output_text`.

          - `"output_text"`

      - `ResponseOutputRefusal object { refusal, type }`

        模型给出的拒绝。

        - `refusal: string`

          模型给出的拒绝说明。

        - `type: "refusal"`

          拒绝的类型。始终为 `refusal`.

          - `"refusal"`

    - `role: "assistant"`

      输出消息的角色。始终为 `assistant`.

      - `"assistant"`

    - `status: "in_progress" or "completed" or "incomplete"`

      消息输入的状态。取值为 `in_progress`, `completed`，或
      `incomplete`。之一。当输入项通过API返回时填充。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

    - `type: "message"`

      输出消息的类型。始终为 `message`.

      - `"message"`

    - `phase: optional "commentary" or "final_answer" or null`

      将一条 `assistant` 消息标记为中间注释（`commentary`）或最终答案（`final_answer`).
      对于像 `gpt-5.3-codex` 以及之后的请求中，发送后续请求时保留并重新发送
      阶段应用于所有助手消息 —— 删除它可能会降低性能。不用于用户消息。

      - `"commentary"`

      - `"final_answer"`

  - `FileSearchCall object { id, queries, status, 2 more }`

    文件搜索工具调用的结果。请参阅
    [文件搜索指南](https://developers.openai.com/api/docs/guides/tools-file-search) 了解更多信息。

    - `id: string`

      文件搜索工具调用的唯一 ID。

    - `queries: array of string`

      用于搜索文件的查询。

    - `status: "in_progress" or "searching" or "completed" or 2 more`

      文件搜索工具调用的状态。值为 `in_progress`,
      `searching`, `incomplete` 或 `failed`,

      - `"in_progress"`

      - `"searching"`

      - `"completed"`

      - `"incomplete"`

      - `"failed"`

    - `type: "file_search_call"`

      文件搜索工具调用的类型。始终为 `file_search_call`.

      - `"file_search_call"`

    - `results: optional array of object { attributes, file_id, filename, 2 more }  or null`

      文件搜索工具调用的结果。

      - `attributes: optional map[string or number or boolean] or null`

        可附加到对象的 16 组键值对。这可用于
        以结构化格式存储有关对象的附加信息，并通过API或仪表板查询对象。键为字符串，
        格式，并通过接口或仪表板查询对象。键为字符串，
        最大长度为 64 个字符。值为最大长度 512 个字符的字符串、
        布尔值或数字。

        - `string`

        - `number`

        - `boolean`

      - `file_id: optional string`

        文件的唯一 ID。

      - `filename: optional string`

        文件的名称。

      - `score: optional number`

        文件的相关性评分，介于 0 和 1 之间。

      - `text: optional string`

        从文件中检索到的文本。

  - `ComputerCall object { id, call_id, pending_safety_checks, 4 more }`

    对计算机使用工具的工具调用。请参阅
    [计算机使用指南](https://developers.openai.com/api/docs/guides/tools-computer-use) 了解更多信息。

    - `id: string`

      该计算机调用的唯一 ID。

    - `call_id: string`

      用于在向工具调用返回输出时进行标识的标识符。

    - `pending_safety_checks: array of object { id, code, message }`

      针对该计算机调用的待处理安全检查。

      - `id: string`

        待处理安全检查的 ID。

      - `code: optional string or null`

        待处理安全检查的类型。

      - `message: optional string or null`

        关于待处理安全检查的详细信息。

    - `status: "in_progress" or "completed" or "incomplete"`

      该项的状态。值为以下之一 `in_progress`, `completed`，或
      `incomplete`。当通过 API 返回项目时填充。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

    - `type: "computer_call"`

      计算机调用的类型。始终为 `computer_call`.

      - `"computer_call"`

    - `action: optional ComputerAction`

      单击操作。

      - `Click object { button, type, x, 2 more }`

        单击操作。

        - `button: "left" or "right" or "wheel" or 2 more`

          指示在单击过程中按下了哪个鼠标按键。值为以下之一 `left`, `right`, `wheel`, `back`，或 `forward`.

          - `"left"`

          - `"right"`

          - `"wheel"`

          - `"back"`

          - `"forward"`

        - `type: "click"`

          指定事件类型。对于单击操作，此属性始终为 `click`.

          - `"click"`

        - `x: number`

          发生单击的 x 坐标。

        - `y: number`

          发生单击的 y 坐标。

        - `keys: optional array of string or null`

          单击时按住的按键。

      - `DoubleClick object { keys, type, x, y }`

        双击操作。

        - `keys: array of string or null`

          双击时按住的按键。

        - `type: "double_click"`

          指定事件类型。对于双击操作，此属性始终设置为 `double_click`.

          - `"double_click"`

        - `x: number`

          发生双击的 x 坐标。

        - `y: number`

          发生双击的 y 坐标。

      - `Drag object { path, type, keys }`

        拖动操作。

        - `path: array of object { x, y }`

          表示拖动操作路径的坐标数组。坐标将以对象数组的形式呈现，例如

          ```
          [
            { x: 100, y: 200 },
            { x: 200, y: 300 }
          ]
          ```

          - `x: number`

            x 坐标。

          - `y: number`

            y 坐标。

        - `type: "drag"`

          指定事件类型。对于拖动操作，此属性始终设置为 `drag`.

          - `"drag"`

        - `keys: optional array of string or null`

          拖动鼠标时按住的按键。

      - `Keypress object { keys, type }`

        模型希望执行的一组按键操作。

        - `keys: array of string`

          模型请求按下的按键组合。这是一个字符串数组，每个字符串表示一个按键。

        - `type: "keypress"`

          指定事件类型。对于按键操作，此属性始终设置为 `keypress`.

          - `"keypress"`

      - `Move object { type, x, y, keys }`

        鼠标移动操作。

        - `type: "move"`

          指定事件类型。对于移动操作，此属性始终设置为 `move`.

          - `"move"`

        - `x: number`

          要移动到的 x 坐标。

        - `y: number`

          要移动到的 y 坐标。

        - `keys: optional array of string or null`

          移动鼠标时按住的按键。

      - `Screenshot object { type }`

        截图操作。

        - `type: "screenshot"`

          指定事件类型。对于截图操作，此属性始终设置为 `screenshot`.

          - `"screenshot"`

      - `Scroll object { scroll_x, scroll_y, type, 3 more }`

        滚动操作。

        - `scroll_x: number`

          水平滚动距离。

        - `scroll_y: number`

          垂直滚动距离。

        - `type: "scroll"`

          指定事件类型。对于滚动操作，此属性始终设置为 `scroll`.

          - `"scroll"`

        - `x: number`

          发生滚动位置的 x 坐标。

        - `y: number`

          发生滚动时的 y 坐标。

        - `keys: optional array of string or null`

          滚动时按住的按键。

      - `Type object { text, type }`

        用于输入文本的动作。

        - `text: string`

          要输入的文本。

        - `type: "type"`

          指定事件类型。对于输入动作，此属性始终设置为 `type`.

          - `"type"`

      - `Wait object { type }`

        等待动作。

        - `type: "wait"`

          指定事件类型。对于等待动作，此属性始终设置为 `wait`.

          - `"wait"`

    - `actions: optional ComputerActionList`

      针对 `computer_use`。的扁平化批量动作。每个动作都包含一个
      `type` 判别字段以及动作特有的字段。

      - `Click object { button, type, x, 2 more }`

        单击操作。

      - `DoubleClick object { keys, type, x, y }`

        双击操作。

      - `Drag object { path, type, keys }`

        拖动操作。

      - `Keypress object { keys, type }`

        模型希望执行的一组按键操作。

      - `Move object { type, x, y, keys }`

        鼠标移动操作。

      - `Screenshot object { type }`

        截图操作。

      - `Scroll object { scroll_x, scroll_y, type, 3 more }`

        滚动操作。

      - `Type object { text, type }`

        用于输入文本的动作。

      - `Wait object { type }`

        等待动作。

  - `ComputerCallOutput object { call_id, output, type, 3 more }`

    计算机工具调用的输出。

    - `call_id: string`

      生成该输出的计算机工具调用的 ID。

    - `output: ResponseComputerToolCallOutputScreenshot`

      与计算机使用工具配合使用的计算机截图图像。

      - `type: "computer_screenshot"`

        指定事件类型。对于计算机截图，此属性
        始终设置为 `computer_screenshot`.

        - `"computer_screenshot"`

      - `file_id: optional string`

        包含截图的上传文件的标识符。

      - `image_url: optional string`

        截图图像的 URL。

    - `type: "computer_call_output"`

      计算机工具调用输出的类型。始终为 `computer_call_output`.

      - `"computer_call_output"`

    - `id: optional string or null`

      计算机工具调用输出的 ID。

    - `acknowledged_safety_checks: optional array of object { id, code, message }  or null`

      开发者已确认的 API 报告的安全检查。

      - `id: string`

        待处理安全检查的 ID。

      - `code: optional string or null`

        待处理安全检查的类型。

      - `message: optional string or null`

        关于待处理安全检查的详细信息。

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      消息输入的状态。取值为 `in_progress`, `completed`，或 `incomplete`。之一。当输入项通过API返回时填充。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `WebSearchCall object { id, status, type, action }`

    网页搜索工具调用的结果。请参阅
    [网页搜索指南](https://developers.openai.com/api/docs/guides/tools-web-search) 了解更多信息。

    - `id: string`

      网页搜索工具调用的唯一 ID。

    - `status: "in_progress" or "searching" or "completed" or 2 more`

      网页搜索工具调用的状态。

      - `"in_progress"`

      - `"searching"`

      - `"completed"`

      - `"failed"`

      - `"incomplete"`

    - `type: "web_search_call"`

      网页搜索工具调用的类型。始终为 `web_search_call`.

      - `"web_search_call"`

    - `action: optional object { type, queries, query, sources }  or object { type, url }  or object { pattern, type, url }`

      描述本次网页搜索调用中具体执行操作的对象。
      包含模型如何使用网页的详细信息（search、open_page、find_in_page）。

      - `Search object { type, queries, query, sources }`

        操作类型 "search" - 执行网页搜索查询。

        - `type: "search"`

          操作类型。

          - `"search"`

        - `queries: optional array of string`

          搜索查询。

        - `query: optional string`

          搜索查询。

        - `sources: optional array of object { type, url }`

          搜索中使用的来源。

          - `type: "url"`

            来源的类型。始终为 `url`.

            - `"url"`

          - `url: string`

            来源的 URL。

      - `OpenPage object { type, url }`

        操作类型 "open_page" - 打开搜索结果中的特定 URL。

        - `type: "open_page"`

          操作类型。

          - `"open_page"`

        - `url: optional string or null`

          模型打开的 URL。

      - `FindInPage object { pattern, type, url }`

        操作类型 "find_in_page"：在已加载的页面中搜索某个模式。

        - `pattern: string`

          要在页面中搜索的模式或文本。

        - `type: "find_in_page"`

          操作类型。

          - `"find_in_page"`

        - `url: string`

          在其中搜索模式的页面 URL。

  - `FunctionCall object { arguments, call_id, name, 6 more }`

    用于运行函数的工具调用。请参阅
    [function calling guide](https://developers.openai.com/api/docs/guides/function-calling) 了解更多信息。

    - `arguments: string`

      传递给函数的参数的 JSON 字符串。

    - `call_id: string`

      模型生成的函数工具调用的唯一 ID。

    - `name: string`

      要运行的函数的名称。

    - `type: "function_call"`

      函数工具调用的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      函数工具调用的唯一 ID。

    - `async: optional boolean`

      函数工具调用是否异步运行。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      生成此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          生成此工具调用的程序项的调用 ID。

        - `type: "program"`

          - `"program"`

    - `namespace: optional string`

      要运行的函数的命名空间。

    - `status: optional "in_progress" or "completed" or "incomplete"`

      该项的状态。值为以下之一 `in_progress`, `completed`，或
      `incomplete`。当通过 API 返回项目时填充。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `FunctionCallOutput object { output, type, id, 5 more }`

    函数工具调用的输出。

    - `output: string or array of ResponseInputTextContent or ResponseInputImageContent or ResponseInputFileContent`

      函数工具调用的文本、图片或文件输出。

      - `string`

        函数工具调用的输出的 JSON 字符串。

      - `array of ResponseInputTextContent or ResponseInputImageContent or ResponseInputFileContent`

        函数工具调用的内容输出（文本、图片、文件）数组。

        - `ResponseInputTextContent object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }  or null`

            标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImageContent object { type, detail, file_id, 2 more }`

          发送给模型的图像输入。了解 [image inputs](https://developers.openai.com/api/docs/guides/images-vision)

          - `type: "input_image"`

            输入项的类型。始终为 `input_image`.

            - `"input_image"`

          - `detail: optional ImageDetail or null`

            发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

          - `file_id: optional string or null`

            要发送给模型的文件 ID。

          - `image_url: optional string or null`

            要发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

          - `prompt_cache_breakpoint: optional object { mode }  or null`

            标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFileContent object { type, detail, file_data, 4 more }`

          模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 可让系统选择详情级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 使用量。使用 `low` 可降低渲染成本，或使用 `high` 以更高质量渲染文件。默认值为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string or null`

            要发送给模型的文件的 base64 编码数据。

          - `file_id: optional string or null`

            要发送给模型的文件 ID。

          - `file_url: optional string or null`

            要发送给模型的文件的 URL。

          - `filename: optional string or null`

            要发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }  or null`

            标记可复用提示前缀的确切结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

    - `type: "function_call_output"`

      函数工具调用输出的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string or null`

      函数工具调用输出的唯一 ID。当此项通过 API 返回时填充。

    - `call_id: optional string or null`

      模型生成的函数工具调用的唯一 ID。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      生成此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          调用方类型。始终为 `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          生成此工具调用的程序项的调用 ID。

        - `type: "program"`

          调用方类型。始终为 `program`.

          - `"program"`

    - `name: optional string or null`

      生成输出的工具的名称。

    - `namespace: optional string or null`

      生成输出的工具的命名空间。

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      该项的状态。值为以下之一 `in_progress`, `completed`，或 `incomplete`。当通过 API 返回项目时填充。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `ToolSearchCall object { arguments, type, id, 3 more }`

    - `arguments: unknown`

      传递给工具搜索调用的参数。

    - `type: "tool_search_call"`

      条目类型。始终为 `tool_search_call`.

      - `"tool_search_call"`

    - `id: optional string or null`

      此工具搜索调用的唯一 ID。

    - `call_id: optional string or null`

      由模型生成的工具搜索调用的唯一 ID。

    - `execution: optional "server" or "client"`

      工具搜索是由服务端还是由客户端执行的。

      - `"server"`

      - `"client"`

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      工具搜索调用的状态。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `ToolSearchOutput object { tools, type, id, 3 more }`

    - `tools: array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

      由工具搜索输出返回的已加载工具定义。

      - `Function object { name, parameters, strict, 6 more }`

        定义你自己代码中可供模型选择调用的函数。详细了解 [函数调用](https://developers.openai.com/api/docs/guides/function-calling).

        - `name: string`

          要调用的函数的名称。

        - `parameters: map[unknown] or null`

          描述该函数参数的 JSON schema 对象。

        - `strict: boolean or null`

          是否对该函数工具强制执行严格的参数校验。

        - `type: "function"`

          函数工具的类型。始终为 `function`.

          - `"function"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `async: optional boolean`

        - `defer_loading: optional boolean`

          此函数是否为延迟加载并通过工具搜索加载。

        - `description: optional string or null`

          函数的描述。供模型用于判断是否调用该函数。

        - `output_schema: optional map[unknown] or null`

          描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

      - `FileSearch object { type, vector_store_ids, filters, 2 more }`

        从已上传文件中搜索相关内容的工具。详细了解 [文件搜索工具](https://developers.openai.com/api/docs/guides/tools-file-search).

        - `type: "file_search"`

          文件搜索工具的类型。始终为 `file_search`.

          - `"file_search"`

        - `vector_store_ids: array of string`

          要搜索的向量存储的 ID。

        - `filters: optional ComparisonFilter or CompoundFilter or null`

          要应用的过滤器。

          - `ComparisonFilter object { key, type, value }`

            用于将指定的属性键与给定值按定义的比较运算进行比较的过滤器。

            - `key: string`

              要与值进行比较的键。

            - `type: "eq" or "ne" or "gt" or 5 more`

              指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

              - `eq`：等于
              - `ne`：不等于
              - `gt`：大于
              - `gte`：大于或等于
              - `lt`：小于
              - `lte`：小于或等于
              - `in`：属于
              - `nin`：不属于

              - `"eq"`

              - `"ne"`

              - `"gt"`

              - `"gte"`

              - `"lt"`

              - `"lte"`

              - `"in"`

              - `"nin"`

            - `value: string or number or boolean or array of string or number`

              要与属性键进行比较的值；支持 string、number 或 boolean 类型。

              - `string`

              - `number`

              - `boolean`

              - `array of string or number`

                - `string`

                - `number`

          - `CompoundFilter object { filters, type }`

            使用以下方式组合多个过滤器 `and` 或 `or`.

            - `filters: array of ComparisonFilter or CompoundFilter`

              要组合的过滤器数组。元素可以是 `ComparisonFilter` 或 `CompoundFilter`.

              - `ComparisonFilter object { key, type, value }`

                用于将指定的属性键与给定值按定义的比较运算进行比较的过滤器。

              - `CompoundFilter object { filters, type }`

                使用以下方式组合多个过滤器 `and` 或 `or`.

            - `type: "and" or "or"`

              操作类型： `and` 或 `or`.

              - `"and"`

              - `"or"`

        - `max_num_results: optional number`

          要返回的最大结果数。该数值应介于 1 到 50 之间（含两端）。

        - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

          搜索的排序选项。

          - `hybrid_search: optional object { embedding_weight, text_weight }`

            在启用混合搜索时，用于控制互逆排名融合在语义嵌入匹配与稀疏关键词匹配之间平衡的权重。

            - `embedding_weight: number`

              嵌入在倒数排名融合中的权重。

            - `text_weight: number`

              文本在倒数排名融合中的权重。

          - `ranker: optional "auto" or "default-2024-11-15"`

            用于文件搜索的排序器。

            - `"auto"`

            - `"default-2024-11-15"`

          - `score_threshold: optional number`

            文件搜索的分数阈值，取值范围为 0 到 1。数值越接近 1，越会尝试只返回最相关的结果，但返回的结果数量可能更少。

      - `Computer object { type }`

        用于控制虚拟计算机的工具。详细了解 [computer 工具](https://developers.openai.com/api/docs/guides/tools-computer-use).

        - `type: "computer"`

          computer 工具的类型。始终为 `computer`.

          - `"computer"`

      - `ComputerUsePreview object { display_height, display_width, environment, type }`

        用于控制虚拟计算机的工具。详细了解 [computer 工具](https://developers.openai.com/api/docs/guides/tools-computer-use).

        - `display_height: number`

          计算机显示屏的高度。

        - `display_width: number`

          计算机显示屏的宽度。

        - `environment: "windows" or "mac" or "linux" or 2 more`

          要控制的计算机环境类型。

          - `"windows"`

          - `"mac"`

          - `"linux"`

          - `"ubuntu"`

          - `"browser"`

        - `type: "computer_use_preview"`

          computer use 工具的类型。始终为 `computer_use_preview`.

          - `"computer_use_preview"`

      - `WebSearch object { type, external_web_access, filters, 2 more }`

        在互联网上搜索与提示相关的来源。详细了解
        [网页搜索工具](https://developers.openai.com/api/docs/guides/tools-web-search).

        - `type: "web_search" or "web_search_2025_08_26"`

          网页搜索工具的类型，取值为下列之一： `web_search` 或 `web_search_2025_08_26`.

          - `"web_search"`

          - `"web_search_2025_08_26"`

        - `external_web_access: optional boolean`

          允许 网页搜索访问实时互联网。省略时默认为 true。当设置为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

        - `filters: optional object { allowed_domains }  or null`

          搜索的筛选条件。

          - `allowed_domains: optional array of string or null`

            搜索允许的域名。如果未提供，则允许所有域名。
            所提供域名的子域名同样被允许。

            示例： `["pubmed.ncbi.nlm.nih.gov"]`

        - `search_context_size: optional "low" or "medium" or "high"`

          用于搜索的上下文窗口空间使用量的高级指导，取值为下列之一： `low`, `medium`，或 `high`. `medium` 是默认值。

          - `"low"`

          - `"medium"`

          - `"high"`

        - `user_location: optional object { city, country, region, 2 more }  or null`

          用户的大致位置。如果省略或为 null，则默认为
          美国。若要避免此回退，请传入 `{"type": "approximate"}` 时不带
          location 字段。若要对结果进行本地化，请提供相关的 location 字段。

          - `city: optional string or null`

            用户所在城市的自由文本输入，例如。 `San Francisco`.

          - `country: optional string or null`

            两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户的，例如。 `US`.

          - `region: optional string or null`

            用户所在地区的自由文本输入，例如。 `California`.

          - `timezone: optional string or null`

            该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 用户的，例如。 `America/Los_Angeles`.

          - `type: optional "approximate"`

            位置近似值的类型。始终为 `approximate`.

            - `"approximate"`

      - `Mcp object { server_label, type, allowed_callers, 9 more }`

        通过远程模型上下文协议
        （MCP）服务器授予模型对其他工具的访问权限。 [了解更多关于 MCP 的信息](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

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

          允许的工具名称列表或筛选对象。

          - `McpAllowedTools = array of string`

            允许的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的过滤器对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，则会匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可与远程 MCP server 配合使用的 OAuth 访问令牌，可与自定义 MCP server
          URL 或服务连接器配合使用。你的应用程序必须处理 OAuth 授权流程，
          并在此处提供该令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的那些连接器。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 其一。了解更多
          about service connectors [here](https://developers.openai.com/api/docs/guides/tools-connectors-mcp#connectors).

          此字段对 2026-09-01 之后发布的模型已弃用。
          使用 `server_url` 连接到远程 MCP server，或使用 `tunnel_id` 通过
          Secure MCP Tunnel 进行连接。目前支持。

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

          此 MCP 工具是否为延迟工具，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要批准。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要批准。可以是
            `always`, `never`,或与需要批准的工具关联的筛选器对象
            。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定单个批准策略。可选值之一为 `always` 或
            `never`。当设置为 `always`，时,所有工具都需要批准。当
            设置为 `never`，时,所有工具都不需要批准。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
          `tunnel_id` 必须提供。

        - `tunnel_id: optional string`

          用于代替直接服务器 URL 的安全 MCP 隧道 ID。以下之一
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

      - `CodeInterpreter object { container, type, allowed_callers }`

        运行 Python 代码以帮助生成对提示词回复的工具。

        - `container: string or object { type, file_ids, memory_limit, network_policy }`

          代码解释器容器。可以是容器 ID，也可以是一个对象，该对象
          指定可供代码使用的已上传文件 ID，并包含一个
          可选的 `memory_limit` 设置。

          - `string`

            容器 ID。

          - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器的配置。可选择指定要对其运行代码的文件 ID。

            - `type: "auto"`

              始终 `auto`.

              - `"auto"`

            - `file_ids: optional array of string`

              可供代码使用的已上传文件的可选列表。

            - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

              代码解释器容器的内存限制。

              - `"1g"`

              - `"4g"`

              - `"16g"`

              - `"64g"`

            - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

              容器的网络访问策略。

              - `ContainerNetworkPolicyDisabled object { type }`

                - `type: "disabled"`

                  禁用出站网络访问。始终 `disabled`.

                  - `"disabled"`

              - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                - `allowed_domains: array of string`

                  当 type 为 `allowlist`.

                - `type: "allowlist"`

                  仅允许向指定域进行出站网络访问。始终 `allowlist`.

                  - `"allowlist"`

                - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                  用于已加入允许列表的域的可选域级密钥。

                  - `domain: string`

                    与该密钥关联的域。

                  - `name: string`

                    要为该域名注入的密钥名称。

                  - `value: string`

                    要为该域名注入的密钥值。

        - `type: "code_interpreter"`

          代码解释器工具的类型。始终为 `code_interpreter`.

          - `"code_interpreter"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

      - `ProgrammaticToolCalling object { type }`

        - `type: "programmatic_tool_calling"`

          工具的类型。始终为 `programmatic_tool_calling`.

          - `"programmatic_tool_calling"`

      - `ImageGeneration object { type, action, background, 9 more }`

        使用 GPT 图像模型生成图像的工具。

        - `type: "image_generation"`

          图像生成工具的类型。始终为 `image_generation`.

          - `"image_generation"`

        - `action: optional "generate" or "edit" or "auto"`

          生成新图像还是编辑已有图像。默认值： `auto`.

          - `"generate"`

          - `"edit"`

          - `"auto"`

        - `background: optional "transparent" or "opaque" or "auto"`

          设置所生成图像的背景。可选值为 `transparent`, `opaque`,
          或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
          它们的 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
          背景。支持透明背景的 GPT Image
          模型。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，此支持处于
          预览阶段。使用 `transparent`，时，请将输出格式设置为 `png` 或 `webp`.
          默认值： `auto`.

          - `"transparent"`

          - `"opaque"`

          - `"auto"`

        - `input_fidelity: optional "high" or "low" or null`

          控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所投入的努力程度。支持 `high` 和 `low` 在 `gpt-image-1` 和 `gpt-image-1.5`; `gpt-image-1-mini` 仅支持 `low`。对于 `gpt-image-2`，请省略此参数。默认为 `low` 在受支持的模型上。

          - `"high"`

          - `"low"`

        - `input_image_mask: optional object { file_id, image_url }`

          用于修复的可选蒙版。包含 `image_url`
          （字符串，可选）和 `file_id` （字符串，可选）。

          - `file_id: optional string`

            蒙版图像的文件 ID。

          - `image_url: optional string`

            Base64 编码的蒙版图像。

        - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

          要使用的图像生成模型。可选值为 `gpt-image-1`,
          `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
          `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
          `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
          `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。默认值：
          `gpt-image-1`.

          - `string`

          - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

            要使用的图像生成模型。可选值为 `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
            `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
            `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。默认值：
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

          生成图像的内容审核级别。默认值： `auto`.

          - `"auto"`

          - `"low"`

        - `output_compression: optional number`

          输出图像的压缩级别。默认值：100。

        - `output_format: optional "png" or "webp" or "jpeg"`

          生成图像的输出格式。可选值为 `png`, `webp`，或
          `jpeg`。默认值： `png`.

          - `"png"`

          - `"webp"`

          - `"jpeg"`

        - `partial_images: optional number`

          在流式模式下生成的中间图像数量，取值范围为 0（默认值）到 3。

        - `quality: optional "low" or "medium" or "high" or 3 more`

          生成图像的质量。GPT 图像模型支持 `low`,
          `medium`，以及 `high`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`,
          包括它们的 `2026-09-08` 快照，也支持 `xhigh` 和 `max`.
          默认值： `auto`.

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

          - `"auto"`

        - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

          生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，例如 `WIDTHxHEIGHT` 字符串形式，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且所请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率属于实验性质，且最大支持的分辨率为 `3840x2160`。所请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 由 GPT 图像模型支持； `auto` 适用于允许自动调整大小的模型。

          - `string`

          - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，例如 `WIDTHxHEIGHT` 字符串形式，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且所请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率属于实验性质，且最大支持的分辨率为 `3840x2160`。所请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 由 GPT 图像模型支持； `auto` 适用于允许自动调整大小的模型。

            - `"1024x1024"`

            - `"1024x1536"`

            - `"1536x1024"`

            - `"auto"`

      - `LocalShell object { type }`

        允许模型在本地环境中执行 shell 命令的工具。

        - `type: "local_shell"`

          本地 shell 工具的类型。始终为 `local_shell`.

          - `"local_shell"`

      - `Shell object { type, allowed_callers, environment }`

        允许模型执行 shell 命令的工具。

        - `type: "shell"`

          shell 工具的类型。始终为 `shell`.

          - `"shell"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `environment: optional ContainerAuto or LocalEnvironment or ContainerReference or null`

          - `ContainerAuto object { type, file_ids, memory_limit, 2 more }`

            - `type: "container_auto"`

              自动为本次请求创建容器

              - `"container_auto"`

            - `file_ids: optional array of string`

              可供代码使用的已上传文件的可选列表。

            - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

              容器的内存限制。

              - `"1g"`

              - `"4g"`

              - `"16g"`

              - `"64g"`

            - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

              容器的网络访问策略。

              - `ContainerNetworkPolicyDisabled object { type }`

              - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

            - `skills: optional array of SkillReference or InlineSkill`

              通过 ID 或内联数据引用的可选技能列表。

              - `SkillReference object { skill_id, type, version }`

                - `skill_id: string`

                  所引用技能的 ID。

                - `type: "skill_reference"`

                  引用通过 /v1/skills 端点创建的技能。

                  - `"skill_reference"`

                - `version: optional string`

                  可选的技能版本。使用正整数或 'latest'。省略则使用默认值。

              - `InlineSkill object { description, name, source, type }`

                - `description: string`

                  技能的描述。

                - `name: string`

                  技能的名称。

                - `source: InlineSkillSource`

                  内联技能负载

                  - `data: string`

                    Base64 编码的 skill zip 包。

                  - `media_type: "application/zip"`

                    内联 skill 负载的媒体类型。必须为 `application/zip`.

                    - `"application/zip"`

                  - `type: "base64"`

                    内联 skill 源的类型。必须为 `base64`.

                    - `"base64"`

                - `type: "inline"`

                  为本次请求定义一个内联 skill。

                  - `"inline"`

          - `LocalEnvironment object { type, skills }`

            - `type: "local"`

              使用本地计算机环境。

              - `"local"`

            - `skills: optional array of LocalSkill`

              可选的 skill 列表。

              - `description: string`

                技能的描述。

              - `name: string`

                技能的名称。

              - `path: string`

                包含 skill 的目录路径。

          - `ContainerReference object { container_id, type }`

            - `container_id: string`

              所引用容器的 ID。

            - `type: "container_reference"`

              引用通过 /v1/containers 端点创建的容器

              - `"container_reference"`

      - `Custom object { name, type, allowed_callers, 4 more }`

        使用指定格式处理输入的自定义工具。详细了解   [自定义工具](https://developers.openai.com/api/docs/guides/function-calling#custom-tools)

        - `name: string`

          自定义工具的名称，用于在工具调用中识别它。

        - `type: "custom"`

          自定义工具的类型。始终为 `custom`.

          - `"custom"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `async: optional boolean`

          工具响应是否可以异步返回，还是在下次响应创建时立即返回。

        - `defer_loading: optional boolean`

          此工具是否应被推迟并通过工具搜索发现。

        - `description: optional string`

          自定义工具的可选描述，用于提供更多上下文。

        - `format: optional CustomToolInputFormat`

          自定义工具的输入格式。默认为无约束文本。

          - `Text object { type }`

            无约束自由格式文本。

            - `type: "text"`

              无约束文本格式。始终为 `text`.

              - `"text"`

          - `Grammar object { definition, syntax, type }`

            由用户定义的语法。

            - `definition: string`

              该语法定义。

            - `syntax: "lark" or "regex"`

              语法定义的语法。可选值为 `lark` 或 `regex`.

              - `"lark"`

              - `"regex"`

            - `type: "grammar"`

              语法格式。始终为 `grammar`.

              - `"grammar"`

      - `Namespace object { description, name, tools, type }`

        在共享命名空间下对函数工具/自定义工具进行分组。

        - `description: string`

          向模型展示的命名空间描述。

        - `name: string`

          工具调用中使用的命名空间名称（例如 `crm`).

        - `tools: array of object { name, type, allowed_callers, 6 more }  or object { name, type, allowed_callers, 4 more }`

          该命名空间内可用的函数/自定义工具。

          - `Function object { name, type, allowed_callers, 6 more }`

            - `name: string`

            - `type: "function"`

              - `"function"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

              工具响应是否可以异步返回，还是在下次响应创建时立即返回。

            - `defer_loading: optional boolean`

              该函数是否应被延迟并通过工具搜索发现。

            - `description: optional string or null`

            - `output_schema: optional map[unknown] or null`

              用于描述该函数工具在字符串输出中所编码 JSON 值的 JSON Schema。此 Schema 不描述 content 数组输出。

            - `parameters: optional unknown or null`

            - `strict: optional boolean or null`

              是否强制执行严格的参数校验。若省略，当 Schema 兼容时 Responses 会尝试使用严格校验，否则回退到非严格校验。

          - `Custom object { name, type, allowed_callers, 4 more }`

            使用指定格式处理输入的自定义工具。详细了解   [自定义工具](https://developers.openai.com/api/docs/guides/function-calling#custom-tools)

            - `name: string`

              自定义工具的名称，用于在工具调用中识别它。

            - `type: "custom"`

              自定义工具的类型。始终为 `custom`.

              - `"custom"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

              工具响应是否可以异步返回，还是在下次响应创建时立即返回。

            - `defer_loading: optional boolean`

              此工具是否应被推迟并通过工具搜索发现。

            - `description: optional string`

              自定义工具的可选描述，用于提供更多上下文。

            - `format: optional CustomToolInputFormat`

              自定义工具的输入格式。默认为无约束文本。

        - `type: "namespace"`

          工具的类型。始终为 `namespace`.

          - `"namespace"`

      - `ToolSearch object { type, description, execution, parameters }`

        用于延迟工具的托管或 BYOT 工具搜索配置。

        - `type: "tool_search"`

          工具的类型。始终为 `tool_search`.

          - `"tool_search"`

        - `description: optional string or null`

          向模型展示的客户端执行工具搜索工具的描述。

        - `execution: optional "server" or "client"`

          工具搜索是由服务端执行还是由客户端执行。

          - `"server"`

          - `"client"`

        - `parameters: optional unknown or null`

          客户端执行工具搜索工具的参数 Schema。

      - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

        该工具会在网页上搜索与响应相关的结果。了解更多关于 [网页搜索工具](https://developers.openai.com/api/docs/guides/tools-web-search).

        - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

          网页搜索工具的类型，取值为下列之一： `web_search_preview` 或 `web_search_preview_2025_03_11`.

          - `"web_search_preview"`

          - `"web_search_preview_2025_03_11"`

        - `search_content_types: optional array of "text" or "image"`

          - `"text"`

          - `"image"`

        - `search_context_size: optional "low" or "medium" or "high"`

          用于搜索的上下文窗口空间使用量的高级指导，取值为下列之一： `low`, `medium`，或 `high`. `medium` 是默认值。

          - `"low"`

          - `"medium"`

          - `"high"`

        - `user_location: optional object { type, city, country, 2 more }  or null`

          用户的近似位置。若省略或为 null，则默认为美国。若希望避免该回退行为，请传入 `{"type": "approximate"}` 且不包含位置字段。若要使结果本地化，请提供相应的位置字段。

          - `type: "approximate"`

            位置近似值的类型。始终为 `approximate`.

            - `"approximate"`

          - `city: optional string or null`

            用户所在城市的自由文本输入，例如。 `San Francisco`.

          - `country: optional string or null`

            两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户的，例如。 `US`.

          - `region: optional string or null`

            用户所在地区的自由文本输入，例如。 `California`.

          - `timezone: optional string or null`

            该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 用户的，例如。 `America/Los_Angeles`.

      - `ApplyPatch object { type, allowed_callers }`

        允许助手使用统一差异（unified diff）创建、删除或更新文件。

        - `type: "apply_patch"`

          工具的类型。始终为 `apply_patch`.

          - `"apply_patch"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

    - `type: "tool_search_output"`

      条目类型。始终为 `tool_search_output`.

      - `"tool_search_output"`

    - `id: optional string or null`

      该工具搜索输出的唯一 ID。

    - `call_id: optional string or null`

      由模型生成的工具搜索调用的唯一 ID。

    - `execution: optional "server" or "client"`

      工具搜索是由服务端还是由客户端执行的。

      - `"server"`

      - `"client"`

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      该工具搜索输出的状态。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `AdditionalTools object { role, tools, type, id }`

    - `role: "developer"`

      提供附加工具的角色。仅 `developer` 受支持。

      - `"developer"`

    - `tools: array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

      此条目中可用的附加工具列表。

      - `Function object { name, parameters, strict, 6 more }`

        定义你自己代码中可供模型选择调用的函数。详细了解 [函数调用](https://developers.openai.com/api/docs/guides/function-calling).

        - `name: string`

          要调用的函数的名称。

        - `parameters: map[unknown] or null`

          描述该函数参数的 JSON schema 对象。

        - `strict: boolean or null`

          是否对该函数工具强制执行严格的参数校验。

        - `type: "function"`

          函数工具的类型。始终为 `function`.

          - `"function"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `async: optional boolean`

        - `defer_loading: optional boolean`

          此函数是否为延迟加载并通过工具搜索加载。

        - `description: optional string or null`

          函数的描述。供模型用于判断是否调用该函数。

        - `output_schema: optional map[unknown] or null`

          描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

      - `FileSearch object { type, vector_store_ids, filters, 2 more }`

        从已上传文件中搜索相关内容的工具。详细了解 [文件搜索工具](https://developers.openai.com/api/docs/guides/tools-file-search).

        - `type: "file_search"`

          文件搜索工具的类型。始终为 `file_search`.

          - `"file_search"`

        - `vector_store_ids: array of string`

          要搜索的向量存储的 ID。

        - `filters: optional ComparisonFilter or CompoundFilter or null`

          要应用的过滤器。

          - `ComparisonFilter object { key, type, value }`

            用于将指定的属性键与给定值按定义的比较运算进行比较的过滤器。

          - `CompoundFilter object { filters, type }`

            使用以下方式组合多个过滤器 `and` 或 `or`.

        - `max_num_results: optional number`

          要返回的最大结果数。该数值应介于 1 到 50 之间（含两端）。

        - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

          搜索的排序选项。

          - `hybrid_search: optional object { embedding_weight, text_weight }`

            在启用混合搜索时，用于控制互逆排名融合在语义嵌入匹配与稀疏关键词匹配之间平衡的权重。

            - `embedding_weight: number`

              嵌入在倒数排名融合中的权重。

            - `text_weight: number`

              文本在倒数排名融合中的权重。

          - `ranker: optional "auto" or "default-2024-11-15"`

            用于文件搜索的排序器。

            - `"auto"`

            - `"default-2024-11-15"`

          - `score_threshold: optional number`

            文件搜索的分数阈值，取值范围为 0 到 1。数值越接近 1，越会尝试只返回最相关的结果，但返回的结果数量可能更少。

      - `Computer object { type }`

        用于控制虚拟计算机的工具。详细了解 [computer 工具](https://developers.openai.com/api/docs/guides/tools-computer-use).

        - `type: "computer"`

          computer 工具的类型。始终为 `computer`.

          - `"computer"`

      - `ComputerUsePreview object { display_height, display_width, environment, type }`

        用于控制虚拟计算机的工具。详细了解 [computer 工具](https://developers.openai.com/api/docs/guides/tools-computer-use).

        - `display_height: number`

          计算机显示屏的高度。

        - `display_width: number`

          计算机显示屏的宽度。

        - `environment: "windows" or "mac" or "linux" or 2 more`

          要控制的计算机环境类型。

          - `"windows"`

          - `"mac"`

          - `"linux"`

          - `"ubuntu"`

          - `"browser"`

        - `type: "computer_use_preview"`

          computer use 工具的类型。始终为 `computer_use_preview`.

          - `"computer_use_preview"`

      - `WebSearch object { type, external_web_access, filters, 2 more }`

        在互联网上搜索与提示相关的来源。详细了解
        [网页搜索工具](https://developers.openai.com/api/docs/guides/tools-web-search).

        - `type: "web_search" or "web_search_2025_08_26"`

          网页搜索工具的类型，取值为下列之一： `web_search` 或 `web_search_2025_08_26`.

          - `"web_search"`

          - `"web_search_2025_08_26"`

        - `external_web_access: optional boolean`

          允许 网页搜索访问实时互联网。省略时默认为 true。当设置为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

        - `filters: optional object { allowed_domains }  or null`

          搜索的筛选条件。

          - `allowed_domains: optional array of string or null`

            搜索允许的域名。如果未提供，则允许所有域名。
            所提供域名的子域名同样被允许。

            示例： `["pubmed.ncbi.nlm.nih.gov"]`

        - `search_context_size: optional "low" or "medium" or "high"`

          用于搜索的上下文窗口空间使用量的高级指导，取值为下列之一： `low`, `medium`，或 `high`. `medium` 是默认值。

          - `"low"`

          - `"medium"`

          - `"high"`

        - `user_location: optional object { city, country, region, 2 more }  or null`

          用户的大致位置。如果省略或为 null，则默认为
          美国。若要避免此回退，请传入 `{"type": "approximate"}` 时不带
          location 字段。若要对结果进行本地化，请提供相关的 location 字段。

          - `city: optional string or null`

            用户所在城市的自由文本输入，例如。 `San Francisco`.

          - `country: optional string or null`

            两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户的，例如。 `US`.

          - `region: optional string or null`

            用户所在地区的自由文本输入，例如。 `California`.

          - `timezone: optional string or null`

            该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 用户的，例如。 `America/Los_Angeles`.

          - `type: optional "approximate"`

            位置近似值的类型。始终为 `approximate`.

            - `"approximate"`

      - `Mcp object { server_label, type, allowed_callers, 9 more }`

        通过远程模型上下文协议
        （MCP）服务器授予模型对其他工具的访问权限。 [了解更多关于 MCP 的信息](https://developers.openai.com/api/docs/guides/tools-connectors-mcp).

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

          允许的工具名称列表或筛选对象。

          - `McpAllowedTools = array of string`

            允许的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的过滤器对象。

            - `read_only: optional boolean`

              指示工具是否会修改数据或是否为只读。如果某个
              MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，则会匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `authorization: optional string`

          可与远程 MCP server 配合使用的 OAuth 访问令牌，可与自定义 MCP server
          URL 或服务连接器配合使用。你的应用程序必须处理 OAuth 授权流程，
          并在此处提供该令牌。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，例如 ChatGPT 中提供的那些连接器。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 其一。了解更多
          about service connectors [here](https://developers.openai.com/api/docs/guides/tools-connectors-mcp#connectors).

          此字段对 2026-09-01 之后发布的模型已弃用。
          使用 `server_url` 连接到远程 MCP server，或使用 `tunnel_id` 通过
          Secure MCP Tunnel 进行连接。目前支持。

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

          此 MCP 工具是否为延迟工具，并通过工具搜索发现。

        - `headers: optional map[string] or null`

          发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器中哪些工具需要批准。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要批准。可以是
            `always`, `never`,或与需要批准的工具关联的筛选器对象
            。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP server is [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，则会匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定单个批准策略。可选值之一为 `always` 或
            `never`。当设置为 `always`，时,所有工具都需要批准。当
            设置为 `never`，时,所有工具都不需要批准。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
          `tunnel_id` 必须提供。

        - `tunnel_id: optional string`

          用于代替直接服务器 URL 的安全 MCP 隧道 ID。以下之一
          `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

      - `CodeInterpreter object { container, type, allowed_callers }`

        运行 Python 代码以帮助生成对提示词回复的工具。

        - `container: string or object { type, file_ids, memory_limit, network_policy }`

          代码解释器容器。可以是容器 ID，也可以是一个对象，该对象
          指定可供代码使用的已上传文件 ID，并包含一个
          可选的 `memory_limit` 设置。

          - `string`

            容器 ID。

          - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器的配置。可选择指定要对其运行代码的文件 ID。

            - `type: "auto"`

              始终 `auto`.

              - `"auto"`

            - `file_ids: optional array of string`

              可供代码使用的已上传文件的可选列表。

            - `memory_limit: optional "1g" or "4g" or "16g" or "64g" or null`

              代码解释器容器的内存限制。

              - `"1g"`

              - `"4g"`

              - `"16g"`

              - `"64g"`

            - `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

              容器的网络访问策略。

              - `ContainerNetworkPolicyDisabled object { type }`

              - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

        - `type: "code_interpreter"`

          代码解释器工具的类型。始终为 `code_interpreter`.

          - `"code_interpreter"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

      - `ProgrammaticToolCalling object { type }`

        - `type: "programmatic_tool_calling"`

          工具的类型。始终为 `programmatic_tool_calling`.

          - `"programmatic_tool_calling"`

      - `ImageGeneration object { type, action, background, 9 more }`

        使用 GPT 图像模型生成图像的工具。

        - `type: "image_generation"`

          图像生成工具的类型。始终为 `image_generation`.

          - `"image_generation"`

        - `action: optional "generate" or "edit" or "auto"`

          生成新图像还是编辑已有图像。默认值： `auto`.

          - `"generate"`

          - `"edit"`

          - `"auto"`

        - `background: optional "transparent" or "opaque" or "auto"`

          设置所生成图像的背景。可选值为 `transparent`, `opaque`,
          或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
          它们的 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
          背景。支持透明背景的 GPT Image
          模型。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，此支持处于
          预览阶段。使用 `transparent`，时，请将输出格式设置为 `png` 或 `webp`.
          默认值： `auto`.

          - `"transparent"`

          - `"opaque"`

          - `"auto"`

        - `input_fidelity: optional "high" or "low" or null`

          控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所投入的努力程度。支持 `high` 和 `low` 在 `gpt-image-1` 和 `gpt-image-1.5`; `gpt-image-1-mini` 仅支持 `low`。对于 `gpt-image-2`，请省略此参数。默认为 `low` 在受支持的模型上。

          - `"high"`

          - `"low"`

        - `input_image_mask: optional object { file_id, image_url }`

          用于修复的可选蒙版。包含 `image_url`
          （字符串，可选）和 `file_id` （字符串，可选）。

          - `file_id: optional string`

            蒙版图像的文件 ID。

          - `image_url: optional string`

            Base64 编码的蒙版图像。

        - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

          要使用的图像生成模型。可选值为 `gpt-image-1`,
          `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
          `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
          `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
          `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。默认值：
          `gpt-image-1`.

          - `string`

          - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 6 more`

            要使用的图像生成模型。可选值为 `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`,
            `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`,
            `gpt-image-2.5-flare-2026-09-08`，或 `chatgpt-image-latest`。默认值：
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

          生成图像的内容审核级别。默认值： `auto`.

          - `"auto"`

          - `"low"`

        - `output_compression: optional number`

          输出图像的压缩级别。默认值：100。

        - `output_format: optional "png" or "webp" or "jpeg"`

          生成图像的输出格式。可选值为 `png`, `webp`，或
          `jpeg`。默认值： `png`.

          - `"png"`

          - `"webp"`

          - `"jpeg"`

        - `partial_images: optional number`

          在流式模式下生成的中间图像数量，取值范围为 0（默认值）到 3。

        - `quality: optional "low" or "medium" or "high" or 3 more`

          生成图像的质量。GPT 图像模型支持 `low`,
          `medium`，以及 `high`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`,
          包括它们的 `2026-09-08` 快照，也支持 `xhigh` 和 `max`.
          默认值： `auto`.

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

          - `"auto"`

        - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

          生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，例如 `WIDTHxHEIGHT` 字符串形式，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且所请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率属于实验性质，且最大支持的分辨率为 `3840x2160`。所请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 由 GPT 图像模型支持； `auto` 适用于允许自动调整大小的模型。

          - `string`

          - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，例如 `WIDTHxHEIGHT` 字符串形式，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且所请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率属于实验性质，且最大支持的分辨率为 `3840x2160`。所请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 由 GPT 图像模型支持； `auto` 适用于允许自动调整大小的模型。

            - `"1024x1024"`

            - `"1024x1536"`

            - `"1536x1024"`

            - `"auto"`

      - `LocalShell object { type }`

        允许模型在本地环境中执行 shell 命令的工具。

        - `type: "local_shell"`

          本地 shell 工具的类型。始终为 `local_shell`.

          - `"local_shell"`

      - `Shell object { type, allowed_callers, environment }`

        允许模型执行 shell 命令的工具。

        - `type: "shell"`

          shell 工具的类型。始终为 `shell`.

          - `"shell"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `environment: optional ContainerAuto or LocalEnvironment or ContainerReference or null`

          - `ContainerAuto object { type, file_ids, memory_limit, 2 more }`

          - `LocalEnvironment object { type, skills }`

          - `ContainerReference object { container_id, type }`

      - `Custom object { name, type, allowed_callers, 4 more }`

        使用指定格式处理输入的自定义工具。详细了解   [自定义工具](https://developers.openai.com/api/docs/guides/function-calling#custom-tools)

        - `name: string`

          自定义工具的名称，用于在工具调用中识别它。

        - `type: "custom"`

          自定义工具的类型。始终为 `custom`.

          - `"custom"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `async: optional boolean`

          工具响应是否可以异步返回，还是在下次响应创建时立即返回。

        - `defer_loading: optional boolean`

          此工具是否应被推迟并通过工具搜索发现。

        - `description: optional string`

          自定义工具的可选描述，用于提供更多上下文。

        - `format: optional CustomToolInputFormat`

          自定义工具的输入格式。默认为无约束文本。

      - `Namespace object { description, name, tools, type }`

        在共享命名空间下对函数工具/自定义工具进行分组。

        - `description: string`

          向模型展示的命名空间描述。

        - `name: string`

          工具调用中使用的命名空间名称（例如 `crm`).

        - `tools: array of object { name, type, allowed_callers, 6 more }  or object { name, type, allowed_callers, 4 more }`

          该命名空间内可用的函数/自定义工具。

          - `Function object { name, type, allowed_callers, 6 more }`

            - `name: string`

            - `type: "function"`

              - `"function"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

              工具响应是否可以异步返回，还是在下次响应创建时立即返回。

            - `defer_loading: optional boolean`

              该函数是否应被延迟并通过工具搜索发现。

            - `description: optional string or null`

            - `output_schema: optional map[unknown] or null`

              用于描述该函数工具在字符串输出中所编码 JSON 值的 JSON Schema。此 Schema 不描述 content 数组输出。

            - `parameters: optional unknown or null`

            - `strict: optional boolean or null`

              是否强制执行严格的参数校验。若省略，当 Schema 兼容时 Responses 会尝试使用严格校验，否则回退到非严格校验。

          - `Custom object { name, type, allowed_callers, 4 more }`

            使用指定格式处理输入的自定义工具。详细了解   [自定义工具](https://developers.openai.com/api/docs/guides/function-calling#custom-tools)

            - `name: string`

              自定义工具的名称，用于在工具调用中识别它。

            - `type: "custom"`

              自定义工具的类型。始终为 `custom`.

              - `"custom"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

              工具响应是否可以异步返回，还是在下次响应创建时立即返回。

            - `defer_loading: optional boolean`

              此工具是否应被推迟并通过工具搜索发现。

            - `description: optional string`

              自定义工具的可选描述，用于提供更多上下文。

            - `format: optional CustomToolInputFormat`

              自定义工具的输入格式。默认为无约束文本。

        - `type: "namespace"`

          工具的类型。始终为 `namespace`.

          - `"namespace"`

      - `ToolSearch object { type, description, execution, parameters }`

        用于延迟工具的托管或 BYOT 工具搜索配置。

        - `type: "tool_search"`

          工具的类型。始终为 `tool_search`.

          - `"tool_search"`

        - `description: optional string or null`

          向模型展示的客户端执行工具搜索工具的描述。

        - `execution: optional "server" or "client"`

          工具搜索是由服务端执行还是由客户端执行。

          - `"server"`

          - `"client"`

        - `parameters: optional unknown or null`

          客户端执行工具搜索工具的参数 Schema。

      - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

        该工具会在网页上搜索与响应相关的结果。了解更多关于 [网页搜索工具](https://developers.openai.com/api/docs/guides/tools-web-search).

        - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

          网页搜索工具的类型，取值为下列之一： `web_search_preview` 或 `web_search_preview_2025_03_11`.

          - `"web_search_preview"`

          - `"web_search_preview_2025_03_11"`

        - `search_content_types: optional array of "text" or "image"`

          - `"text"`

          - `"image"`

        - `search_context_size: optional "low" or "medium" or "high"`

          用于搜索的上下文窗口空间使用量的高级指导，取值为下列之一： `low`, `medium`，或 `high`. `medium` 是默认值。

          - `"low"`

          - `"medium"`

          - `"high"`

        - `user_location: optional object { type, city, country, 2 more }  or null`

          用户的近似位置。若省略或为 null，则默认为美国。若希望避免该回退行为，请传入 `{"type": "approximate"}` 且不包含位置字段。若要使结果本地化，请提供相应的位置字段。

          - `type: "approximate"`

            位置近似值的类型。始终为 `approximate`.

            - `"approximate"`

          - `city: optional string or null`

            用户所在城市的自由文本输入，例如。 `San Francisco`.

          - `country: optional string or null`

            两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户的，例如。 `US`.

          - `region: optional string or null`

            用户所在地区的自由文本输入，例如。 `California`.

          - `timezone: optional string or null`

            该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 用户的，例如。 `America/Los_Angeles`.

      - `ApplyPatch object { type, allowed_callers }`

        允许助手使用统一差异（unified diff）创建、删除或更新文件。

        - `type: "apply_patch"`

          工具的类型。始终为 `apply_patch`.

          - `"apply_patch"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

    - `type: "additional_tools"`

      条目类型。始终为 `additional_tools`.

      - `"additional_tools"`

    - `id: optional string or null`

      此附加工具条目的唯一 ID。

  - `ConfigurationUpdate object { type, id, reasoning }`

    对对话响应配置的更新。该配置
    在后续响应中持续生效，直到被另一个
    配置更新替换。

    - `type: "configuration_update"`

      条目类型。始终为 `configuration_update`.

      - `"configuration_update"`

    - `id: optional string or null`

      此配置更新条目的唯一 ID。

    - `reasoning: optional object { effort }`

      推理配置的更新。仅支持 effort。

      - `effort: optional ReasoningEffort or null`

        在后续响应中使用的推理 effort，直到另一次
        configuration update replaces it.

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

  - `Reasoning object { id, summary, type, 3 more }`

    推理模型在生成响应时使用的思维链描述
    响应时，请务必将这些项包含在你 `input` 对 Responses API 的
    中，以便在手动管理上下文
    [管理上下文](https://developers.openai.com/api/docs/guides/conversation-state).

    - `id: string`

      推理内容的唯一标识符。

    - `summary: array of SummaryTextContent`

      推理摘要内容。

      - `text: string`

        模型迄今为止推理输出的摘要。

      - `type: "summary_text"`

        对象的类型。始终为 `summary_text`.

        - `"summary_text"`

    - `type: "reasoning"`

      对象的类型。始终为 `reasoning`.

      - `"reasoning"`

    - `content: optional array of object { text, type }`

      推理文本内容。

      - `text: string`

        模型生成的推理文本。

      - `type: "reasoning_text"`

        推理文本的类型。始终为 `reasoning_text`.

        - `"reasoning_text"`

    - `encrypted_content: optional string or null`

      推理项的加密内容。默认填充
      由返回的推理项 `POST /v1/responses` 和 WebSocket
      `response.create` 请求。

      流式传输时，请在后续请求中使用已完成的推理项及其
      `encrypted_content` 中的 `response.output_item.done` 事件。
      后续请求。 `encrypted_content` 中的
      `response.output_item.added` 可能不完整。这一点在
      时尤为 `store` 是 `false` 或使用零数据保留时尤其重要。

    - `status: optional "in_progress" or "completed" or "incomplete"`

      该项的状态。值为以下之一 `in_progress`, `completed`，或
      `incomplete`。当通过 API 返回项目时填充。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `Compaction object { encrypted_content, type, id }`

    由 [`v1/responses/compact` API](https://developers.openai.com/api/reference/resources/responses/methods/compact).

    - `encrypted_content: string`

      压缩项摘要的加密内容。

    - `type: "compaction"`

      该项的类型。始终为 `compaction`.

      - `"compaction"`

    - `id: optional string or null`

      压缩项的 ID。

  - `ImageGenerationCall object { id, result, status, 7 more }`

    模型发出的图像生成请求。

    - `id: string`

      图像生成调用的唯一 ID。

    - `result: string or null`

      以 base64 编码的生成图像。

    - `status: "in_progress" or "completed" or "generating" or "failed"`

      图像生成调用的状态。

      - `"in_progress"`

      - `"completed"`

      - `"generating"`

      - `"failed"`

    - `type: "image_generation_call"`

      图像生成调用的类型。始终为 `image_generation_call`.

      - `"image_generation_call"`

    - `action: optional "generate" or "edit" or "auto" or null`

      用于图像生成的操作。

      - `"generate"`

      - `"edit"`

      - `"auto"`

    - `background: optional "transparent" or "opaque" or "auto" or null`

      用于生成的背景设置。

      - `"transparent"`

      - `"opaque"`

      - `"auto"`

    - `output_format: optional "png" or "webp" or "jpeg" or null`

      用于生成的输出格式。

      - `"png"`

      - `"webp"`

      - `"jpeg"`

    - `quality: optional "low" or "medium" or "high" or 3 more or null`

      由图像生成工具调用所生成图像的质量。取值之一： `low`, `medium`, `high`, `xhigh`, `max`，或 `auto`.

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

      - `"max"`

      - `"auto"`

    - `revised_prompt: optional string or null`

      经过任何模型提示重写后所使用的提示。

    - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or null`

      图像尺寸，以 `WIDTHxHEIGHT` 字符串形式表示，例如 `1536x864`.

      - `string`

      - `"1024x1024" or "1024x1536" or "1536x1024"`

        图像尺寸，以 `WIDTHxHEIGHT` 字符串形式表示，例如 `1536x864`.

        - `"1024x1024"`

        - `"1024x1536"`

        - `"1536x1024"`

  - `CodeInterpreterCall object { id, code, container_id, 3 more }`

    用于运行代码的工具调用。

    - `id: string`

      代码解释器工具调用的唯一 ID。

    - `code: string or null`

      要运行的代码，若不可用则为 null。

    - `container_id: string`

      用于运行代码的容器 ID。

    - `outputs: array of object { logs, type }  or object { type, url }  or null`

      由代码解释器生成的输出，例如日志或图像。
      如果没有可用输出，可能为 null。

      - `Logs object { logs, type }`

        代码解释器输出的日志。

        - `logs: string`

          代码解释器输出的日志。

        - `type: "logs"`

          输出的类型。始终为 `logs`.

          - `"logs"`

      - `Image object { type, url }`

        来自代码解释器的图像输出。

        - `type: "image"`

          输出的类型。始终为 `image`.

          - `"image"`

        - `url: string`

          来自代码解释器的图像输出的 URL。

    - `status: "in_progress" or "completed" or "incomplete" or 2 more`

      代码解释器工具调用的状态。有效值为 `in_progress`, `completed`, `incomplete`, `interpreting`，以及 `failed`.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

      - `"interpreting"`

      - `"failed"`

    - `type: "code_interpreter_call"`

      代码解释器工具调用的类型。始终为 `code_interpreter_call`.

      - `"code_interpreter_call"`

  - `LocalShellCall object { id, action, call_id, 2 more }`

    用于在本地 shell 上运行命令的工具调用。

    - `id: string`

      本地 shell 调用的唯一 ID。

    - `action: object { command, env, type, 3 more }`

      在服务端执行 shell 命令。

      - `command: array of string`

        要运行的命令。

      - `env: map[string]`

        为命令设置的环境变量。

      - `type: "exec"`

        本地 shell 操作的类型。始终为 `exec`.

        - `"exec"`

      - `timeout_ms: optional number or null`

        命令的可选超时时间（毫秒）。

      - `user: optional string or null`

        运行命令时使用的可选用户。

      - `working_directory: optional string or null`

        运行命令时使用的可选工作目录。

    - `call_id: string`

      模型生成的本地 shell 工具调用的唯一 ID。

    - `status: "in_progress" or "completed" or "incomplete"`

      本地 shell 调用的状态。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

    - `type: "local_shell_call"`

      本地 shell 调用的类型。始终为 `local_shell_call`.

      - `"local_shell_call"`

  - `LocalShellCallOutput object { id, output, type, status }`

    本地 shell 工具调用的输出。

    - `id: string`

      模型生成的本地 shell 工具调用的唯一 ID。

    - `output: string`

      本地 shell 工具调用输出的 JSON 字符串。

    - `type: "local_shell_call_output"`

      本地 shell 工具调用输出的类型。始终为 `local_shell_call_output`.

      - `"local_shell_call_output"`

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      该项的状态。值为以下之一 `in_progress`, `completed`，或 `incomplete`.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `ShellCall object { action, call_id, type, 4 more }`

    表示请求执行一条或多条 shell 命令的工具。

    - `action: object { commands, max_output_length, timeout_ms }`

      描述如何运行该工具调用的 shell 命令及其限制。

      - `commands: array of string`

        供执行环境按序运行的 shell 命令。

      - `max_output_length: optional number or null`

        从合并后的 stdout 和 stderr 输出中捕获的最大 UTF-8 字符数。

      - `timeout_ms: optional number or null`

        允许 shell 命令运行的最长墙钟时间（毫秒）。

    - `call_id: string`

      由模型生成的 shell 工具调用的唯一 ID。

    - `type: "shell_call"`

      该项的类型。始终为 `shell_call`.

      - `"shell_call"`

    - `id: optional string or null`

      shell 工具调用的唯一 ID。当该条目通过 API 返回时被填充。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      生成此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          调用方类型。始终为 `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          生成此工具调用的程序项的调用 ID。

        - `type: "program"`

          调用方类型。始终为 `program`.

          - `"program"`

    - `environment: optional LocalEnvironment or ContainerReference or null`

      用于执行 shell 命令的环境。

      - `LocalEnvironment object { type, skills }`

      - `ContainerReference object { container_id, type }`

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      shell 调用的状态，取值之一 `in_progress`, `completed`，或 `incomplete`.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `ShellCallOutput object { call_id, output, type, 4 more }`

    由 shell 工具调用发出的流式输出条目。

    - `call_id: string`

      由模型生成的 shell 工具调用的唯一 ID。

    - `output: array of ResponseFunctionShellCallOutputContent`

      捕获的 stdout 和 stderr 输出块及其关联的结果。

      - `outcome: object { type }  or object { exit_code, type }`

        与此 shell 调用关联的退出或超时结果。

        - `Timeout object { type }`

          表示 shell 调用超出了其配置的时间限制。

          - `type: "timeout"`

            结果类型，始终为 `timeout`.

            - `"timeout"`

        - `Exit object { exit_code, type }`

          表示 shell 命令已完成并返回了退出码。

          - `exit_code: number`

            shell 进程返回的退出码。

          - `type: "exit"`

            结果类型，始终为 `exit`.

            - `"exit"`

      - `stderr: string`

        该 shell 调用捕获的 stderr 输出。

      - `stdout: string`

        该 shell 调用捕获的 stdout 输出。

    - `type: "shell_call_output"`

      该项的类型。始终为 `shell_call_output`.

      - `"shell_call_output"`

    - `id: optional string or null`

      shell 工具调用输出的唯一 ID。当该条目通过 API 返回时被填充。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      生成此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          调用方类型。始终为 `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          生成此工具调用的程序项的调用 ID。

        - `type: "program"`

          调用方类型。始终为 `program`.

          - `"program"`

    - `max_output_length: optional number or null`

      此次 shell 调用合并输出所捕获的最大 UTF-8 字符数。

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      shell 调用输出的状态。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `ApplyPatchCall object { call_id, operation, status, 3 more }`

    表示通过 diff 补丁来创建、删除或更新文件的工具调用。

    - `call_id: string`

      由模型生成的 apply patch 工具调用的唯一 ID。

    - `operation: object { diff, path, type }  or object { path, type }  or object { diff, path, type }`

      apply_patch 工具调用的具体创建、删除或更新指令。

      - `CreateFile object { diff, path, type }`

        通过 apply_patch 工具创建新文件的指令。

        - `diff: string`

          创建文件时要应用的 unified diff 内容。

        - `path: string`

          相对于工作区根目录的要创建文件的路径。

        - `type: "create_file"`

          操作类型。始终为 `create_file`.

          - `"create_file"`

      - `DeleteFile object { path, type }`

        通过 apply_patch 工具删除现有文件的指令。

        - `path: string`

          相对于工作区根目录的要删除文件的路径。

        - `type: "delete_file"`

          操作类型。始终为 `delete_file`.

          - `"delete_file"`

      - `UpdateFile object { diff, path, type }`

        通过 apply_patch 工具更新现有文件的指令。

        - `diff: string`

          要应用到现有文件的 unified diff 内容。

        - `path: string`

          相对于工作区根目录的要更新文件的路径。

        - `type: "update_file"`

          操作类型。始终为 `update_file`.

          - `"update_file"`

    - `status: "in_progress" or "completed"`

      apply patch 工具调用的状态。值为 `in_progress` 或 `completed`.

      - `"in_progress"`

      - `"completed"`

    - `type: "apply_patch_call"`

      该项的类型。始终为 `apply_patch_call`.

      - `"apply_patch_call"`

    - `id: optional string or null`

      apply patch 工具调用的唯一 ID。当此条目通过 API 返回时填充。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      生成此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          调用方类型。始终为 `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          生成此工具调用的程序项的调用 ID。

        - `type: "program"`

          调用方类型。始终为 `program`.

          - `"program"`

  - `ApplyPatchCallOutput object { call_id, status, type, 3 more }`

    apply patch 工具调用发出的流式输出。

    - `call_id: string`

      由模型生成的 apply patch 工具调用的唯一 ID。

    - `status: "completed" or "failed"`

      apply patch 工具调用输出的状态。值为 `completed` 或 `failed`.

      - `"completed"`

      - `"failed"`

    - `type: "apply_patch_call_output"`

      该项的类型。始终为 `apply_patch_call_output`.

      - `"apply_patch_call_output"`

    - `id: optional string or null`

      apply patch 工具调用输出的唯一 ID。当此条目通过 API 返回时填充。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      生成此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          调用方类型。始终为 `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          生成此工具调用的程序项的调用 ID。

        - `type: "program"`

          调用方类型。始终为 `program`.

          - `"program"`

    - `output: optional string or null`

      apply patch 工具的可读的日志文本（例如补丁结果或错误）。

  - `McpListTools object { id, server_label, tools, 2 more }`

    MCP 服务器上可用的工具列表。

    - `id: string`

      列表的唯一 ID。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述该工具输入的 JSON schema。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        关于该工具的附加注释。

      - `description: optional string or null`

        工具的描述。

    - `type: "mcp_list_tools"`

      该项的类型。始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `error: optional string or null`

      若服务器无法列出工具，则返回错误消息。

  - `McpApprovalRequest object { id, arguments, name, 2 more }`

    请求人工审批一次工具调用。

    - `id: string`

      审批请求的唯一 ID。

    - `arguments: string`

      工具参数的 JSON 字符串。

    - `name: string`

      要运行的工具的名称。

    - `server_label: string`

      发起请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      该项的类型。始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

  - `McpApprovalResponse object { approval_request_id, approve, type, 2 more }`

    对 MCP 审批请求的响应。

    - `approval_request_id: string`

      正在被回应的审批请求的 ID。

    - `approve: boolean`

      请求是否被批准。

    - `type: "mcp_approval_response"`

      该项的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `id: optional string or null`

      审批响应的唯一 ID

    - `reason: optional string or null`

      可选的决策原因。

  - `McpCall object { id, arguments, name, 6 more }`

    在 MCP 服务器上调用一次工具。

    - `id: string`

      工具调用的唯一 ID。

    - `arguments: string`

      传递给该工具的参数的 JSON 字符串。

    - `name: string`

      已运行的工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      该项的类型。始终为 `mcp_call`.

      - `"mcp_call"`

    - `approval_request_id: optional string or null`

      MCP 工具调用审批请求的唯一标识符。
      在后续的 `mcp_approval_response` 输入中包含此值，以批准或拒绝相应的工具调用。

    - `error: optional McpToolCallError or null`

      工具调用的错误（如果有）。

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

      工具调用的输出。

    - `status: optional "in_progress" or "completed" or "incomplete" or 2 more`

      工具调用的状态。取值为 `in_progress`, `completed`, `incomplete`, `calling`，或 `failed`.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

      - `"calling"`

      - `"failed"`

  - `CustomToolCallOutput object { call_id, output, type, 2 more }`

    由你的代码生成的自定义工具调用输出，会被回传给模型。

    - `call_id: string`

      调用 ID，用于将此自定义工具调用输出映射到某个自定义工具调用。

    - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

      由你的代码生成的自定义工具调用的输出。
      可以是字符串或输出内容列表。

      - `StringOutput = string`

        自定义工具调用输出的字符串。

      - `OutputContentList = array of ResponseInputText or ResponseInputImage or ResponseInputFile`

        自定义工具调用的文本、图像或文件输出。

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解 [image inputs](https://developers.openai.com/api/docs/guides/images-vision).

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          模型的文件输入。

    - `type: "custom_tool_call_output"`

      自定义工具调用输出的类型。始终为 `custom_tool_call_output`.

      - `"custom_tool_call_output"`

    - `id: optional string`

      该自定义工具调用输出在 OpenAI 平台中的唯一 ID。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      生成此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          调用方类型。始终为 `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          生成此工具调用的程序项的调用 ID。

        - `type: "program"`

          调用方类型。始终为 `program`.

          - `"program"`

  - `CustomToolCall object { call_id, input, name, 5 more }`

    对模型创建的自定义工具的调用。

    - `call_id: string`

      用于将此自定义工具调用映射到工具调用输出的标识符。

    - `input: string`

      模型生成的自定义工具调用的输入。

    - `name: string`

      所调用的自定义工具的名称。

    - `type: "custom_tool_call"`

      自定义工具调用的类型。始终为 `custom_tool_call`.

      - `"custom_tool_call"`

    - `id: optional string`

      OpenAI 平台中此自定义工具调用的唯一 ID。

    - `async: optional boolean`

      自定义工具调用是否异步运行。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      生成此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          生成此工具调用的程序项的调用 ID。

        - `type: "program"`

          - `"program"`

    - `namespace: optional string`

      所调用的自定义工具的命名空间。

  - `CompactionTrigger object { type, id }`

    压缩当前上下文。必须是最后一个输入项。

    - `type: "compaction_trigger"`

      该项的类型。始终为 `compaction_trigger`.

      - `"compaction_trigger"`

    - `id: optional string or null`

      此压缩触发器的唯一 ID。

  - `ItemReference object { id, type }`

    用于引用某个项的内部标识符。

    - `id: string`

      所引用项的 ID。

    - `type: optional "item_reference" or null`

      所引用项的类型。始终为 `item_reference`.

      - `"item_reference"`

  - `Program object { id, call_id, code, 2 more }`

    - `id: string`

      此 program 项的唯一 ID。

    - `call_id: string`

      此 program 项的稳定调用 ID。

    - `code: string`

      由程序化工具调用执行的 JavaScript 源代码。

    - `fingerprint: string`

      必须来回传递的 opaque 程序回放指纹。

    - `type: "program"`

      条目类型。始终为 `program`.

      - `"program"`

  - `ProgramOutput object { id, call_id, result, 2 more }`

    - `id: string`

      此 program 输出项的唯一 ID。

    - `call_id: string`

      此 program 项的调用 ID。

    - `result: string`

      此 program 项生成的结果。

    - `status: "completed" or "incomplete"`

      program 输出的最终状态。

      - `"completed"`

      - `"incomplete"`

    - `type: "program_output"`

      条目类型。始终为 `program_output`.

      - `"program_output"`

- `type: "response.item.create"`

  Live 客户端事件类型。始终为 `response.item.create`.

  - `"response.item.create"`

- `event_id: optional string or null`

  可选的客户端标识符，用于将此命令与服务端事件的 client_event_id 或 error.client_event_id 进行关联。

#### 示例

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

向 Live 会话的 Responses 后端请求响应，或继续等待工具结果的已委派响应。需要启用 Responses 委派。

#### Schema

Schema name: `LiveResponseCreateParam`

- `type: "response.create"`

  Live 客户端事件类型。始终为 `response.create`.

  - `"response.create"`

- `event_id: optional string or null`

  可选的客户端标识符，用于将此命令与服务端事件的 client_event_id 或 error.client_event_id 进行关联。

#### 示例

```json
{
  "type": "response.create",
  "event_id": "evt_response_001"
}
```

<a id="session.close"></a>

### session.close

请求 Live 会话关闭。该终结 `session.closed` 事件包含关闭原因和最终使用情况。

#### Schema

Schema name: `LiveSessionCloseParam`

- `type: "session.close"`

  Live 客户端事件类型。始终为 `session.close`.

  - `"session.close"`

- `event_id: optional string or null`

  可选的客户端标识符，用于将此命令与服务端事件的 client_event_id 或 error.client_event_id 进行关联。

#### 示例

```json
{
  "type": "session.close",
  "event_id": "evt_close_001"
}
```

<a id="server-events"></a>

## 服务端事件

<a id="transport.ringing"></a>

### transport.ringing

出站 SIP 提供方链路正在响铃或提供早期媒体。仅发送给旁路观察者。

#### Schema

Schema name: `LiveTransportRinging`

- `event_id: string`

- `session_id: string`

  规范的 Live 会话 ID。

- `type: "transport.ringing"`

  - `"transport.ringing"`

#### 示例

```json
{
  "type": "transport.ringing",
  "event_id": "event_call_1",
  "session_id": "live_u0_123"
}
```

<a id="transport.answered"></a>

### transport.answered

出站 SIP 提供商线路已应答并建立媒体。仅发送给边带观察者。

#### Schema

Schema name: `LiveTransportAnswered`

- `event_id: string`

- `session_id: string`

  规范的 Live 会话 ID。

- `type: "transport.answered"`

  - `"transport.answered"`

#### 示例

```json
{
  "type": "transport.answered",
  "event_id": "event_call_2",
  "session_id": "live_u0_123"
}
```

<a id="transport.failed"></a>

### transport.failed

异步呼出 SIP 建立失败。仅发送给旁路观察者。

#### Schema

Schema name: `LiveTransportFailed`

- `error: object { code, message, type, param }`

  - `code: string`

    调用设置失败代码。

  - `message: string`

  - `type: "call_error"`

    - `"call_error"`

  - `param: optional string`

    与错误相关的参数（如果有）。在无适用参数时为空。

- `event_id: string`

- `session_id: string`

  规范的 Live 会话 ID。

- `type: "transport.failed"`

  - `"transport.failed"`

#### 示例

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

<a id="session.started"></a>

### session.started

在 Live 会话已开始时返回。包含已解析的会话配置，包括服务端默认值。

#### Schema

Schema name: `LiveSessionStarted`

- `event_id: string`

  Live 服务器事件的唯一 ID。

- `session: SessionResource`

  已解析的 Live 会话配置以及服务器分配的会话元数据。

  - `id: string`

    Live 会话的唯一 ID。用于旁路连接、分叉和录音下载。

  - `expires_at: number`

    Live 会话过期的 Unix 时间戳（以秒为单位）。

  - `model: string or "gpt-live-1"`

    Live 模型。在每种传输方式的会话配置中均为必填；不要将其作为 URL 查询参数传递。

    - `string`

    - `"gpt-live-1"`

      Live 模型。在每种传输方式的会话配置中均为必填；不要将其作为 URL 查询参数传递。

      - `"gpt-live-1"`

  - `status: "active"`

    会话快照的状态。始终 `active`，包括 session.closed 中的最终快照；可使用事件类型判断会话已关闭。

    - `"active"`

  - `audio: optional object { format, output }`

    启动时的音频配置。仅主 WebSocket 接受 audio.format；WebRTC 和 SIP 会自行协商媒体格式。voice 和 format 在启动后不可更改。

    - `format: optional AudioFormat`

      通过 Live WebSocket 连接发送和接收的音频编码及采样率。WebRTC 和 SIP 分别协商其媒体格式。

      - `AudioPCM object { rate, type }`

        Live WebSocket 连接使用的原始单声道 16 位小端 PCM 音频。

        - `rate: 16000 or 24000`

          音频采样率，单位为赫兹。Live WebSocket 的 PCM 音频支持 16000 或 24000 Hz。

          - `16000`

          - `24000`

        - `type: "audio/pcm"`

          音频编码。始终为 `audio/pcm`.

          - `"audio/pcm"`

      - `AudioPCMU object { rate, type }`

        Live WebSocket 连接使用的原始单声道 G.711 μ-law 音频。

        - `rate: number`

          音频采样率，单位为赫兹。G.711 音频使用 8000 Hz。

        - `type: "audio/pcmu"`

          音频编码。始终为 `audio/pcmu`.

          - `"audio/pcmu"`

      - `AudioPCMA object { rate, type }`

        Live WebSocket 连接使用的原始单声道 G.711 A-law 音频。

        - `rate: number`

          音频采样率，单位为赫兹。G.711 音频使用 8000 Hz。

        - `type: "audio/pcma"`

          音频编码。始终为 `audio/pcma`.

          - `"audio/pcma"`

    - `output: optional object { voice }`

      由 Live 模型生成的语音所使用的声音。

      - `voice: optional string or "alloy" or "ash" or "aube" or 29 more or CustomVoice`

        用于 Live 语音的声音，可以是内置声音名称，也可以是包含其 ID 的自定义声音对象。默认为 `marin` ，且启动后不可更改。

        - `string`

        - `"alloy" or "ash" or "aube" or 29 more`

          用于 Live 语音的声音，可以是内置声音名称，也可以是包含其 ID 的自定义声音对象。默认为 `marin` ，且启动后不可更改。

          - `"alloy"`

          - `"ash"`

          - `"aube"`

          - `"ballad"`

          - `"beacon"`

          - `"bossa"`

          - `"brise"`

          - `"cedar"`

          - `"cinder"`

          - `"coral"`

          - `"delta"`

          - `"echo"`

          - `"flitz"`

          - `"gleam"`

          - `"harema"`

          - `"juni"`

          - `"marin"`

          - `"meridian"`

          - `"nira"`

          - `"noeul"`

          - `"nuri"`

          - `"quartz"`

          - `"ripple"`

          - `"sage"`

          - `"shimmer"`

          - `"shitan"`

          - `"sillage"`

          - `"stone"`

          - `"tempo"`

          - `"verse"`

          - `"vesper"`

          - `"willow"`

        - `CustomVoice object { id }`

          - `id: string`

  - `client: optional ClientConfig`

    附加到统一 WebRTC 会话的不可信前端的仅启动时生效的能力。可信的旁路连接不受影响。

    - `data_channel: DataChannelConfig`

      WebRTC 前端数据通道的客户端和服务器事件权限。

      - `allowed_client_events: optional "all" or array of string`

        前端数据通道可以发送的客户端事件类型。使用 'all' 允许所有客户端事件；空数组表示不允许任何事件。省略时保持现有的全允许行为。

        - `"all"`

          - `"all"`

        - `array of string`

      - `allowed_server_events: optional "all" or array of ServerEventSelector`

        可以发送到前端数据通道的服务器事件。使用 'all' 允许所有服务器事件；空数组表示不允许任何事件。省略时保持现有的全允许行为。Responses 事件使用一个 type 为 'response.event' 的对象，并附带 response_event 选择器。

        - `"all"`

          - `"all"`

        - `array of ServerEventSelector`

          - `type: string`

            外层的 Live 服务器事件类型。对于 Responses 事件，请使用 'response.event'。

          - `response_event: optional string`

            嵌套的 Responses 事件类型。当 type 为 'response.event' 时必填；对于其他事件类型禁止使用。

  - `delegation: optional ClientDelegation or object { responses, type }  or null`

    处理由 Live 模型委派的任务的对象。省略或为 null 表示由你的应用处理；使用 `responses` 以便让 API 管理一个 Responses 后端。

    - `ClientDelegation object { type }`

      将任务委托给你的应用。Live 会话会发出委托事件,由你的后端处理。

      - `type: "client"`

        委托的所有者。始终 `client` 用于由你的应用处理的任务。

        - `"client"`

    - `Responses object { responses, type }`

      将任务委托给由 Live 会话管理的 Responses 模型。

      - `responses: ResponsesDelegationConfig`

        当 Live 会话将任务委托给 Responses 时使用的后端模型、提示和工具。

        - `model: string`

          用于服务端 Responses 委托的模型。

        - `instructions: optional string or null`

          委托给 Responses 模型的指令,与 Live 指令分开。请参阅 [后端提示](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt).

        - `max_output_tokens: optional number or null`

          每个委托响应的最大输出 token 数。

        - `parallel_tool_calls: optional boolean or null`

          委托的 Responses 模型是否可以在单个响应中请求多个工具调用。

        - `reasoning: optional object { effort, summary }  or null`

          传递给每个委托 Responses 请求的推理设置。

          - `effort: optional "none" or "minimal" or "low" or 3 more or null`

            委托的 Responses 模型应使用的推理力度。支持的值取决于后端模型。

            - `"none"`

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `summary: optional "concise" or "detailed" or "auto" or null`

            在受支持时,从委托的 Responses 模型请求的推理摘要。

            - `"concise"`

            - `"detailed"`

            - `"auto"`

        - `service_tier: optional "auto" or "default" or "fast_tier_temp_pilot" or 3 more or null`

          委托的 Responses 请求的服务层级。

          - `"auto"`

          - `"default"`

          - `"fast_tier_temp_pilot"`

          - `"flex"`

          - `"priority"`

          - `"ultrafast"`

        - `text: optional object { verbosity }  or null`

          传递给每个委托 Responses 请求的文本生成设置。

          - `verbosity: optional "low" or "medium" or "high" or null`

            Responses 后端生成文本的详细程度。这不会配置 Live 模型的口头表达方式。

            - `"low"`

            - `"medium"`

            - `"high"`

        - `tool_choice: optional "auto" or "none" or "required" or object { name, type }  or object { name, server_label, type }`

          控制 Responses 后端在处理 Live 模型委托的任务时所使用的工具。

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

        - `tools: optional array of FunctionTool or object { type }  or object { type }  or 3 more`

          在 Responses 后端处理 Live 模型委托的任务时可用的工具。

          - `FunctionTool object { name, type, description, 2 more }`

            当 Live 模型委托任务时,Responses 后端可用的函数工具。

            - `name: string`

              被委托的 Responses 模型在调用此函数时使用的名称。

            - `type: "function"`

              工具类型。始终为 `function`.

              - `"function"`

            - `description: optional string or null`

              该函数的功能以及何时应被被委托的 Responses 模型调用。

            - `parameters: optional map[unknown] or null`

              一个描述该函数所接受参数的 JSON Schema 对象。

            - `strict: optional boolean or null`

              被委托的 Responses 模型是否必须严格按照函数的参数模式执行。

          - `WebSearch object { type }`

            Live 会话的 Responses 后端可用的一个网页搜索工具。

            - `type: "web_search"`

              工具类型。始终为 `web_search`.

              - `"web_search"`

          - `FileSearch object { type }`

            - `type: "file_search"`

              - `"file_search"`

          - `CodeInterpreter object { type }`

            - `type: "code_interpreter"`

              - `"code_interpreter"`

          - `Shell object { environment, type }`

            一个带有 container_auto 或 container_reference 环境的 Responses shell 工具。不支持本地执行和域密钥。

            - `environment: map[unknown]`

            - `type: "shell"`

              - `"shell"`

          - `ImageGeneration object { type }`

            - `type: "image_generation"`

              - `"image_generation"`

      - `type: "responses"`

        委托的所有者。始终 `responses` 用于由 Responses API 处理的任务。

        - `"responses"`

  - `input: optional array of InitialItem`

    启动前提供的纯文本有序历史记录。支持 developer、user 和 assistant 消息，每条消息仅含一个文本部分；总计最多 128 条消息，渲染后的 token 总数不超过 8,192。

    - `Developer object { content, role, id, 2 more }`

      包含在 Live 会话初始文本历史记录中的一条 developer 消息。

      - `content: array of object { text, type }`

        消息内容。为初始 Live 对话历史记录提供恰好一个文本部分。

        - `text: string`

          要包含在 Live 会话初始对话历史记录中的消息文本。

        - `type: optional "input_text"`

          文本内容类型。始终为 `input_text`.

          - `"input_text"`

      - `role: "developer"`

        此历史消息的作者。始终为 `developer`.

        - `"developer"`

      - `id: optional string or null`

        所提供历史消息的可选标识符。Live 使用该消息的角色和文本来初始化对话。

      - `status: optional "incomplete" or "completed" or null`

        所提供消息的状态。Live 将其文本用作历史记录，但不会恢复未完成的消息。

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        历史记录项的类型。始终为 `message`.

        - `"message"`

    - `User object { content, role, id, 2 more }`

      包含在 Live 会话初始文本历史记录中的一条 user 消息。

      - `content: array of object { text, type }`

        消息内容。为初始 Live 对话历史记录提供恰好一个文本部分。

        - `text: string`

          要包含在 Live 会话初始对话历史记录中的消息文本。

        - `type: optional "input_text"`

          文本内容类型。始终为 `input_text`.

          - `"input_text"`

      - `role: "user"`

        此历史消息的作者。始终为 `user`.

        - `"user"`

      - `id: optional string or null`

        所提供历史消息的可选标识符。Live 使用该消息的角色和文本来初始化对话。

      - `status: optional "incomplete" or "completed" or null`

        所提供消息的状态。Live 将其文本用作历史记录，但不会恢复未完成的消息。

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        历史记录项的类型。始终为 `message`.

        - `"message"`

    - `Assistant object { content, role, id, 2 more }`

      包含在 Live 会话初始文本历史记录中的一条 assistant 消息。

      - `content: array of object { text, type }  or object { text, type }`

        消息内容。为初始 Live 对话历史记录提供恰好一个文本部分。

        - `Text object { text, type }`

          启动 Live 会话时作为对话历史提供的 assistant 文本。

          - `text: string`

            要包含在 Live 会话初始对话历史记录中的消息文本。

          - `type: optional "text"`

            文本内容类型。始终为 `text`.

            - `"text"`

        - `OutputText object { text, type }`

          在启动 Live 会话时，作为对话历史提供的助手输出文本。

          - `text: string`

            要包含在 Live 会话初始对话历史记录中的消息文本。

          - `type: "output_text"`

            文本内容类型。始终为 `output_text`.

            - `"output_text"`

      - `role: "assistant"`

        此历史消息的作者。始终为 `assistant`.

        - `"assistant"`

      - `id: optional string or null`

        所提供历史消息的可选标识符。Live 使用该消息的角色和文本来初始化对话。

      - `status: optional "incomplete" or "completed" or null`

        所提供消息的状态。Live 将其文本用作历史记录，但不会恢复未完成的消息。

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        历史记录项的类型。始终为 `message`.

        - `"message"`

  - `instructions: optional string or null`

    用于语音、对话、被打断以及何时进行委托的前端指令。首先从 [Live 提示指南](https://developers.openai.com/api/docs/guides/live-prompting)；入手；将业务规则和工具工作流放在单独的 [后端提示](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt)。中。最多 16,384 个客户端提供的 token。如果省略或留空，则使用服务端默认值。启动后不可修改。

  - `store: optional boolean`

    是否存储该会话，以便后续派生分支和下载录制内容。新会话默认为 false。

- `type: "session.started"`

  事件类型，始终为 `session.started`.

  - `"session.started"`

- `client_event_id: optional string`

  与此服务器事件关联的客户端命令的 event_id（如果提供）。

#### 示例

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

在 Live 会话更新被接受时返回。包含更新后已解析的会话配置。

#### Schema

Schema name: `LiveSessionUpdated`

- `event_id: string`

  Live 服务器事件的唯一 ID。

- `session: SessionResource`

  已解析的 Live 会话配置以及服务器分配的会话元数据。

  - `id: string`

    Live 会话的唯一 ID。用于旁路连接、分叉和录音下载。

  - `expires_at: number`

    Live 会话过期的 Unix 时间戳（以秒为单位）。

  - `model: string or "gpt-live-1"`

    Live 模型。在每种传输方式的会话配置中均为必填；不要将其作为 URL 查询参数传递。

    - `string`

    - `"gpt-live-1"`

      Live 模型。在每种传输方式的会话配置中均为必填；不要将其作为 URL 查询参数传递。

      - `"gpt-live-1"`

  - `status: "active"`

    会话快照的状态。始终 `active`，包括 session.closed 中的最终快照；可使用事件类型判断会话已关闭。

    - `"active"`

  - `audio: optional object { format, output }`

    启动时的音频配置。仅主 WebSocket 接受 audio.format；WebRTC 和 SIP 会自行协商媒体格式。voice 和 format 在启动后不可更改。

    - `format: optional AudioFormat`

      通过 Live WebSocket 连接发送和接收的音频编码及采样率。WebRTC 和 SIP 分别协商其媒体格式。

      - `AudioPCM object { rate, type }`

        Live WebSocket 连接使用的原始单声道 16 位小端 PCM 音频。

        - `rate: 16000 or 24000`

          音频采样率，单位为赫兹。Live WebSocket 的 PCM 音频支持 16000 或 24000 Hz。

          - `16000`

          - `24000`

        - `type: "audio/pcm"`

          音频编码。始终为 `audio/pcm`.

          - `"audio/pcm"`

      - `AudioPCMU object { rate, type }`

        Live WebSocket 连接使用的原始单声道 G.711 μ-law 音频。

        - `rate: number`

          音频采样率，单位为赫兹。G.711 音频使用 8000 Hz。

        - `type: "audio/pcmu"`

          音频编码。始终为 `audio/pcmu`.

          - `"audio/pcmu"`

      - `AudioPCMA object { rate, type }`

        Live WebSocket 连接使用的原始单声道 G.711 A-law 音频。

        - `rate: number`

          音频采样率，单位为赫兹。G.711 音频使用 8000 Hz。

        - `type: "audio/pcma"`

          音频编码。始终为 `audio/pcma`.

          - `"audio/pcma"`

    - `output: optional object { voice }`

      由 Live 模型生成的语音所使用的声音。

      - `voice: optional string or "alloy" or "ash" or "aube" or 29 more or CustomVoice`

        用于 Live 语音的声音，可以是内置声音名称，也可以是包含其 ID 的自定义声音对象。默认为 `marin` ，且启动后不可更改。

        - `string`

        - `"alloy" or "ash" or "aube" or 29 more`

          用于 Live 语音的声音，可以是内置声音名称，也可以是包含其 ID 的自定义声音对象。默认为 `marin` ，且启动后不可更改。

          - `"alloy"`

          - `"ash"`

          - `"aube"`

          - `"ballad"`

          - `"beacon"`

          - `"bossa"`

          - `"brise"`

          - `"cedar"`

          - `"cinder"`

          - `"coral"`

          - `"delta"`

          - `"echo"`

          - `"flitz"`

          - `"gleam"`

          - `"harema"`

          - `"juni"`

          - `"marin"`

          - `"meridian"`

          - `"nira"`

          - `"noeul"`

          - `"nuri"`

          - `"quartz"`

          - `"ripple"`

          - `"sage"`

          - `"shimmer"`

          - `"shitan"`

          - `"sillage"`

          - `"stone"`

          - `"tempo"`

          - `"verse"`

          - `"vesper"`

          - `"willow"`

        - `CustomVoice object { id }`

          - `id: string`

  - `client: optional ClientConfig`

    附加到统一 WebRTC 会话的不可信前端的仅启动时生效的能力。可信的旁路连接不受影响。

    - `data_channel: DataChannelConfig`

      WebRTC 前端数据通道的客户端和服务器事件权限。

      - `allowed_client_events: optional "all" or array of string`

        前端数据通道可以发送的客户端事件类型。使用 'all' 允许所有客户端事件；空数组表示不允许任何事件。省略时保持现有的全允许行为。

        - `"all"`

          - `"all"`

        - `array of string`

      - `allowed_server_events: optional "all" or array of ServerEventSelector`

        可以发送到前端数据通道的服务器事件。使用 'all' 允许所有服务器事件；空数组表示不允许任何事件。省略时保持现有的全允许行为。Responses 事件使用一个 type 为 'response.event' 的对象，并附带 response_event 选择器。

        - `"all"`

          - `"all"`

        - `array of ServerEventSelector`

          - `type: string`

            外层的 Live 服务器事件类型。对于 Responses 事件，请使用 'response.event'。

          - `response_event: optional string`

            嵌套的 Responses 事件类型。当 type 为 'response.event' 时必填；对于其他事件类型禁止使用。

  - `delegation: optional ClientDelegation or object { responses, type }  or null`

    处理由 Live 模型委派的任务的对象。省略或为 null 表示由你的应用处理；使用 `responses` 以便让 API 管理一个 Responses 后端。

    - `ClientDelegation object { type }`

      将任务委托给你的应用。Live 会话会发出委托事件,由你的后端处理。

      - `type: "client"`

        委托的所有者。始终 `client` 用于由你的应用处理的任务。

        - `"client"`

    - `Responses object { responses, type }`

      将任务委托给由 Live 会话管理的 Responses 模型。

      - `responses: ResponsesDelegationConfig`

        当 Live 会话将任务委托给 Responses 时使用的后端模型、提示和工具。

        - `model: string`

          用于服务端 Responses 委托的模型。

        - `instructions: optional string or null`

          委托给 Responses 模型的指令,与 Live 指令分开。请参阅 [后端提示](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt).

        - `max_output_tokens: optional number or null`

          每个委托响应的最大输出 token 数。

        - `parallel_tool_calls: optional boolean or null`

          委托的 Responses 模型是否可以在单个响应中请求多个工具调用。

        - `reasoning: optional object { effort, summary }  or null`

          传递给每个委托 Responses 请求的推理设置。

          - `effort: optional "none" or "minimal" or "low" or 3 more or null`

            委托的 Responses 模型应使用的推理力度。支持的值取决于后端模型。

            - `"none"`

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `summary: optional "concise" or "detailed" or "auto" or null`

            在受支持时,从委托的 Responses 模型请求的推理摘要。

            - `"concise"`

            - `"detailed"`

            - `"auto"`

        - `service_tier: optional "auto" or "default" or "fast_tier_temp_pilot" or 3 more or null`

          委托的 Responses 请求的服务层级。

          - `"auto"`

          - `"default"`

          - `"fast_tier_temp_pilot"`

          - `"flex"`

          - `"priority"`

          - `"ultrafast"`

        - `text: optional object { verbosity }  or null`

          传递给每个委托 Responses 请求的文本生成设置。

          - `verbosity: optional "low" or "medium" or "high" or null`

            Responses 后端生成文本的详细程度。这不会配置 Live 模型的口头表达方式。

            - `"low"`

            - `"medium"`

            - `"high"`

        - `tool_choice: optional "auto" or "none" or "required" or object { name, type }  or object { name, server_label, type }`

          控制 Responses 后端在处理 Live 模型委托的任务时所使用的工具。

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

        - `tools: optional array of FunctionTool or object { type }  or object { type }  or 3 more`

          在 Responses 后端处理 Live 模型委托的任务时可用的工具。

          - `FunctionTool object { name, type, description, 2 more }`

            当 Live 模型委托任务时,Responses 后端可用的函数工具。

            - `name: string`

              被委托的 Responses 模型在调用此函数时使用的名称。

            - `type: "function"`

              工具类型。始终为 `function`.

              - `"function"`

            - `description: optional string or null`

              该函数的功能以及何时应被被委托的 Responses 模型调用。

            - `parameters: optional map[unknown] or null`

              一个描述该函数所接受参数的 JSON Schema 对象。

            - `strict: optional boolean or null`

              被委托的 Responses 模型是否必须严格按照函数的参数模式执行。

          - `WebSearch object { type }`

            Live 会话的 Responses 后端可用的一个网页搜索工具。

            - `type: "web_search"`

              工具类型。始终为 `web_search`.

              - `"web_search"`

          - `FileSearch object { type }`

            - `type: "file_search"`

              - `"file_search"`

          - `CodeInterpreter object { type }`

            - `type: "code_interpreter"`

              - `"code_interpreter"`

          - `Shell object { environment, type }`

            一个带有 container_auto 或 container_reference 环境的 Responses shell 工具。不支持本地执行和域密钥。

            - `environment: map[unknown]`

            - `type: "shell"`

              - `"shell"`

          - `ImageGeneration object { type }`

            - `type: "image_generation"`

              - `"image_generation"`

      - `type: "responses"`

        委托的所有者。始终 `responses` 用于由 Responses API 处理的任务。

        - `"responses"`

  - `input: optional array of InitialItem`

    启动前提供的纯文本有序历史记录。支持 developer、user 和 assistant 消息，每条消息仅含一个文本部分；总计最多 128 条消息，渲染后的 token 总数不超过 8,192。

    - `Developer object { content, role, id, 2 more }`

      包含在 Live 会话初始文本历史记录中的一条 developer 消息。

      - `content: array of object { text, type }`

        消息内容。为初始 Live 对话历史记录提供恰好一个文本部分。

        - `text: string`

          要包含在 Live 会话初始对话历史记录中的消息文本。

        - `type: optional "input_text"`

          文本内容类型。始终为 `input_text`.

          - `"input_text"`

      - `role: "developer"`

        此历史消息的作者。始终为 `developer`.

        - `"developer"`

      - `id: optional string or null`

        所提供历史消息的可选标识符。Live 使用该消息的角色和文本来初始化对话。

      - `status: optional "incomplete" or "completed" or null`

        所提供消息的状态。Live 将其文本用作历史记录，但不会恢复未完成的消息。

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        历史记录项的类型。始终为 `message`.

        - `"message"`

    - `User object { content, role, id, 2 more }`

      包含在 Live 会话初始文本历史记录中的一条 user 消息。

      - `content: array of object { text, type }`

        消息内容。为初始 Live 对话历史记录提供恰好一个文本部分。

        - `text: string`

          要包含在 Live 会话初始对话历史记录中的消息文本。

        - `type: optional "input_text"`

          文本内容类型。始终为 `input_text`.

          - `"input_text"`

      - `role: "user"`

        此历史消息的作者。始终为 `user`.

        - `"user"`

      - `id: optional string or null`

        所提供历史消息的可选标识符。Live 使用该消息的角色和文本来初始化对话。

      - `status: optional "incomplete" or "completed" or null`

        所提供消息的状态。Live 将其文本用作历史记录，但不会恢复未完成的消息。

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        历史记录项的类型。始终为 `message`.

        - `"message"`

    - `Assistant object { content, role, id, 2 more }`

      包含在 Live 会话初始文本历史记录中的一条 assistant 消息。

      - `content: array of object { text, type }  or object { text, type }`

        消息内容。为初始 Live 对话历史记录提供恰好一个文本部分。

        - `Text object { text, type }`

          启动 Live 会话时作为对话历史提供的 assistant 文本。

          - `text: string`

            要包含在 Live 会话初始对话历史记录中的消息文本。

          - `type: optional "text"`

            文本内容类型。始终为 `text`.

            - `"text"`

        - `OutputText object { text, type }`

          在启动 Live 会话时，作为对话历史提供的助手输出文本。

          - `text: string`

            要包含在 Live 会话初始对话历史记录中的消息文本。

          - `type: "output_text"`

            文本内容类型。始终为 `output_text`.

            - `"output_text"`

      - `role: "assistant"`

        此历史消息的作者。始终为 `assistant`.

        - `"assistant"`

      - `id: optional string or null`

        所提供历史消息的可选标识符。Live 使用该消息的角色和文本来初始化对话。

      - `status: optional "incomplete" or "completed" or null`

        所提供消息的状态。Live 将其文本用作历史记录，但不会恢复未完成的消息。

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        历史记录项的类型。始终为 `message`.

        - `"message"`

  - `instructions: optional string or null`

    用于语音、对话、被打断以及何时进行委托的前端指令。首先从 [Live 提示指南](https://developers.openai.com/api/docs/guides/live-prompting)；入手；将业务规则和工具工作流放在单独的 [后端提示](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt)。中。最多 16,384 个客户端提供的 token。如果省略或留空，则使用服务端默认值。启动后不可修改。

  - `store: optional boolean`

    是否存储该会话，以便后续派生分支和下载录制内容。新会话默认为 false。

- `type: "session.updated"`

  事件类型，始终为 `session.updated`.

  - `"session.updated"`

- `client_event_id: optional string`

  与此服务器事件关联的客户端命令的 event_id（如果提供）。

#### 示例

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

当 session.input_audio.mute 命令被接受时返回。输入音频将不再发送给模型；边带音频回放继续。

#### Schema

Schema name: `LiveInputAudioMuted`

- `event_id: string`

  Live 服务器事件的唯一 ID。

- `type: "session.input_audio.muted"`

  事件类型，始终为 `session.input_audio.muted`.

  - `"session.input_audio.muted"`

- `client_event_id: optional string`

  与此服务器事件关联的客户端命令的 event_id（如果提供）。

#### 示例

```json
{
  "type": "session.input_audio.muted",
  "event_id": "evt_muted_001",
  "client_event_id": "evt_mute_001"
}
```

<a id="session.input_audio.unmuted"></a>

### session.input_audio.unmuted

当 session.input_audio.unmute 命令被接受时返回。输入音频会再次发送给模型。

#### Schema

Schema name: `LiveInputAudioUnmuted`

- `event_id: string`

  Live 服务器事件的唯一 ID。

- `type: "session.input_audio.unmuted"`

  事件类型，始终为 `session.input_audio.unmuted`.

  - `"session.input_audio.unmuted"`

- `client_event_id: optional string`

  与此服务器事件关联的客户端命令的 event_id（如果提供）。

#### 示例

```json
{
  "type": "session.input_audio.unmuted",
  "event_id": "evt_unmuted_001",
  "client_event_id": "evt_unmute_001"
}
```

<a id="session.instructions.appended"></a>

### session.instructions.appended

当 session.instructions.append 命令被接受并写入 Live 会话时间线时返回。该返回值确认指令已被追加，但不保证模型已据此执行。

#### Schema

Schema name: `LiveInstructionsAppended`

- `end_ms: number`

  该事件在 Live 会话时间轴上的结束位置（自会话开始起的毫秒数）。对于追加的上下文，该值可以等于 start_ms。

- `event_id: string`

  Live 服务器事件的唯一 ID。

- `start_ms: number`

  该事件在 Live 会话时间轴上的起始位置（自会话开始起的毫秒数）。

- `type: "session.instructions.appended"`

  事件类型，始终为 `session.instructions.appended`.

  - `"session.instructions.appended"`

- `client_event_id: optional string`

  与此服务器事件关联的客户端命令的 event_id（如果提供）。

#### 示例

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

当 session.thinking.append 命令被接受并写入实时会话时间线时返回。此事件用于确认已添加的推理上下文，但不保证会产生任何语音输出。

#### Schema

Schema name: `LiveThinkingAppended`

- `end_ms: number`

  该事件在 Live 会话时间轴上的结束位置（自会话开始起的毫秒数）。对于追加的上下文，该值可以等于 start_ms。

- `event_id: string`

  Live 服务器事件的唯一 ID。

- `start_ms: number`

  该事件在 Live 会话时间轴上的起始位置（自会话开始起的毫秒数）。

- `type: "session.thinking.appended"`

  事件类型，始终为 `session.thinking.appended`.

  - `"session.thinking.appended"`

- `client_event_id: optional string`

  与此服务器事件关联的客户端命令的 event_id（如果提供）。

#### 示例

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

当 session.commentary.append 命令被接受并加入 Live 会话时间线时返回。该事件确认已添加的旁白，但不保证具体措辞或音频是否已播放完毕。

#### Schema

Schema name: `LiveCommentaryAppended`

- `end_ms: number`

  该事件在 Live 会话时间轴上的结束位置（自会话开始起的毫秒数）。对于追加的上下文，该值可以等于 start_ms。

- `event_id: string`

  Live 服务器事件的唯一 ID。

- `start_ms: number`

  该事件在 Live 会话时间轴上的起始位置（自会话开始起的毫秒数）。

- `type: "session.commentary.appended"`

  事件类型，始终为 `session.commentary.appended`.

  - `"session.commentary.appended"`

- `client_event_id: optional string`

  与此服务器事件关联的客户端命令的 event_id（如果提供）。

#### 示例

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

由 Live 模型生成的音频片段。使用配置的会话音频格式按送达顺序解码并播放主要的 WebSocket 片段。旁路连接会收到带时间戳的反射输出音频。

#### Schema

Schema name: `LiveOutputAudioDelta`

- `delta: string`

  Base64 编码的原始音频。主 WebSocket 事件使用会话配置的格式；反射的边带事件使用 24 kHz 的单声道 PCM16LE。

- `type: "session.output_audio.delta"`

  事件类型，始终为 `session.output_audio.delta`.

  - `"session.output_audio.delta"`

- `end_ms: optional number`

  会话相对的独占结束时间（毫秒）。在反射的边带事件中为必填；在主 WebSocket 上省略。丢弃的输出帧会在反射范围之间留下间隙。

- `start_ms: optional number`

  会话相对的包含性起始时间（毫秒）。在反射的边带事件中为必填；在主 WebSocket 上省略。

#### 示例

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

Live 会话中用户输入音频的转写片段。按交付顺序累积这些片段；这些事件不定义完整的轮次，也不包含转写完成事件。

#### Schema

Schema name: `LiveInputTranscriptDelta`

- `delta: string`

  该时间范围内音频的转录文本片段。按交付顺序追加片段以构建转录文本。

- `end_ms: number`

  该事件在 Live 会话时间轴上的结束位置（自会话开始起的毫秒数）。对于追加的上下文，该值可以等于 start_ms。

- `event_id: string`

  Live 服务器事件的唯一 ID。

- `start_ms: number`

  该事件在 Live 会话时间轴上的起始位置（自会话开始起的毫秒数）。

- `type: "session.input_transcript.delta"`

  事件类型，始终为 `session.input_transcript.delta`.

  - `"session.input_transcript.delta"`

- `client_event_id: optional string`

  与此服务器事件关联的客户端命令的 event_id（如果提供）。

#### 示例

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

Live 会话中助手输出音频的转录片段。按交付顺序累积这些片段；这些事件不定义完整的轮次，也不包含转录完成事件。

#### Schema

Schema name: `LiveOutputTranscriptDelta`

- `delta: string`

  该时间范围内音频的转录文本片段。按交付顺序追加片段以构建转录文本。

- `end_ms: number`

  该事件在 Live 会话时间轴上的结束位置（自会话开始起的毫秒数）。对于追加的上下文，该值可以等于 start_ms。

- `event_id: string`

  Live 服务器事件的唯一 ID。

- `start_ms: number`

  该事件在 Live 会话时间轴上的起始位置（自会话开始起的毫秒数）。

- `type: "session.output_transcript.delta"`

  事件类型，始终为 `session.output_transcript.delta`.

  - `"session.output_transcript.delta"`

- `client_event_id: optional string`

  与此服务器事件关联的客户端命令的 event_id（如果提供）。

#### 示例

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

当 Live 模型将任务委托给你的应用或 Responses 后端时返回。包含委托元数据以及会话时间轴中发生委托的位置。

#### Schema

Schema name: `LiveDelegationCreated`

- `delegation: object { id, target, type, response_id }`

  被委托工作的标识符和目标位置。该对象包含的是元数据，而非任务文本。

  - `id: string`

    该委托的唯一定位 ID。在回复客户端持有的工作或将 Responses 事件进行关联时，可将其用作 delegation_id。

  - `target: "client" or "responses"`

    Live 模型将工作委托给的： `client` 你的应用，或 `responses` 已配置的 Responses 后端。

    - `"client" or "responses"`

      Live 模型将工作委托给的： `client` 你的应用，或 `responses` 已配置的 Responses 后端。

      - `"client"`

      - `"responses"`

  - `type: "delegation"`

    对象类型，始终为 `delegation`.

    - `"delegation"`

  - `response_id: optional string`

    与某次 Responses 委托关联的 Responses API 响应 ID。对于客户端委托则省略。

- `event_id: string`

  Live 服务器事件的唯一 ID。

- `offset_ms: number`

  在 Live 会话时间轴上创建该委托的位置，以会话开始起的毫秒数表示。

- `type: "session.delegation.created"`

  事件类型，始终为 `session.delegation.created`.

  - `"session.delegation.created"`

- `client_event_id: optional string`

  与此服务器事件关联的客户端命令的 event_id（如果提供）。

#### 示例

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

来自 Live 会话委托的后端的流式 Responses API 事件。使用外部 delegation_id 将嵌套流关联到其 Live 委托。

#### Schema

Schema name: `LiveResponseEvent`

- `event: map[unknown]`

  嵌套的 Responses 流式事件。根据其 type 字段进行分发。响应生命周期快照省略输入并清空 instructions、tools 和 output，以保持消息体积较小；如需获取生成内容，请消费细粒度的输出事件。

- `event_id: string`

  Live 服务器事件的唯一 ID。

- `type: "response.event"`

  事件类型，始终为 `response.event`.

  - `"response.event"`

- `client_event_id: optional string`

  与此服务器事件关联的客户端命令的 event_id（如果提供）。

- `delegation_id: optional string or null`

  与嵌套 Responses 事件关联的 Live 委托。当事件无法与某个委托关联时，可能为 null 或被省略。

#### 示例

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

报告累计的实时音频用量，并在可用时报告最近一次的上下文窗口用量。委托 Responses 的令牌用量在 response.event 事件中单独报告。

#### Schema

Schema name: `LiveSessionUsageUpdated`

- `event_id: string`

  Live 服务器事件的唯一 ID。

- `type: "session.usage.updated"`

  事件类型，始终为 `session.usage.updated`.

  - `"session.usage.updated"`

- `usage: SessionUsage`

  截至目前的累计 Live 音频用量。

  - `seconds: number`

    累计 Live 音频时长（秒）。不要在不同的用量事件之间对这一字段进行累加。

- `client_event_id: optional string`

  与此服务器事件关联的客户端命令的 event_id（如果提供）。

- `context_window: optional object { usage_ratio }`

  最近一次测得的 Live 上下文窗口使用量。当上下文上限未知时省略。

  - `usage_ratio: number`

    当前活跃上下文的 token 数除以 Live 模型的上下文上限。该值在压缩后可能会下降，并可能在测得的音频帧之间存在滞后。

#### 示例

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

在 Live 会话完成最终化后返回，包含关闭原因、最终会话快照以及累计的音频用量。仅断开连接而未收到此事件并不能确认已成功完成最终化。

#### Schema

Schema name: `LiveSessionClosed`

- `event_id: string`

  Live 服务器事件的唯一 ID。

- `reason: "close_requested" or "expired" or "content" or 2 more`

  实时会话结束的原因： `close_requested` 由于应用关闭或挂断请求， `expired` 由于达到会话时长限制， `content` 由于安全过滤器， `remote_hangup` 由于远程正常断开，或 `connection_lost` 由于主连接或上游连接意外断开。

  - `"close_requested" or "expired" or "content" or 2 more`

    实时会话结束的原因： `close_requested` 由于应用关闭或挂断请求， `expired` 由于达到会话时长限制， `content` 由于安全过滤器， `remote_hangup` 由于远程正常断开，或 `connection_lost` 由于主连接或上游连接意外断开。

    - `"close_requested"`

    - `"expired"`

    - `"content"`

    - `"remote_hangup"`

    - `"connection_lost"`

- `session: SessionResource`

  已解析的 Live 会话配置以及服务器分配的会话元数据。

  - `id: string`

    Live 会话的唯一 ID。用于旁路连接、分叉和录音下载。

  - `expires_at: number`

    Live 会话过期的 Unix 时间戳（以秒为单位）。

  - `model: string or "gpt-live-1"`

    Live 模型。在每种传输方式的会话配置中均为必填；不要将其作为 URL 查询参数传递。

    - `string`

    - `"gpt-live-1"`

      Live 模型。在每种传输方式的会话配置中均为必填；不要将其作为 URL 查询参数传递。

      - `"gpt-live-1"`

  - `status: "active"`

    会话快照的状态。始终 `active`，包括 session.closed 中的最终快照；可使用事件类型判断会话已关闭。

    - `"active"`

  - `audio: optional object { format, output }`

    启动时的音频配置。仅主 WebSocket 接受 audio.format；WebRTC 和 SIP 会自行协商媒体格式。voice 和 format 在启动后不可更改。

    - `format: optional AudioFormat`

      通过 Live WebSocket 连接发送和接收的音频编码及采样率。WebRTC 和 SIP 分别协商其媒体格式。

      - `AudioPCM object { rate, type }`

        Live WebSocket 连接使用的原始单声道 16 位小端 PCM 音频。

        - `rate: 16000 or 24000`

          音频采样率，单位为赫兹。Live WebSocket 的 PCM 音频支持 16000 或 24000 Hz。

          - `16000`

          - `24000`

        - `type: "audio/pcm"`

          音频编码。始终为 `audio/pcm`.

          - `"audio/pcm"`

      - `AudioPCMU object { rate, type }`

        Live WebSocket 连接使用的原始单声道 G.711 μ-law 音频。

        - `rate: number`

          音频采样率，单位为赫兹。G.711 音频使用 8000 Hz。

        - `type: "audio/pcmu"`

          音频编码。始终为 `audio/pcmu`.

          - `"audio/pcmu"`

      - `AudioPCMA object { rate, type }`

        Live WebSocket 连接使用的原始单声道 G.711 A-law 音频。

        - `rate: number`

          音频采样率，单位为赫兹。G.711 音频使用 8000 Hz。

        - `type: "audio/pcma"`

          音频编码。始终为 `audio/pcma`.

          - `"audio/pcma"`

    - `output: optional object { voice }`

      由 Live 模型生成的语音所使用的声音。

      - `voice: optional string or "alloy" or "ash" or "aube" or 29 more or CustomVoice`

        用于 Live 语音的声音，可以是内置声音名称，也可以是包含其 ID 的自定义声音对象。默认为 `marin` ，且启动后不可更改。

        - `string`

        - `"alloy" or "ash" or "aube" or 29 more`

          用于 Live 语音的声音，可以是内置声音名称，也可以是包含其 ID 的自定义声音对象。默认为 `marin` ，且启动后不可更改。

          - `"alloy"`

          - `"ash"`

          - `"aube"`

          - `"ballad"`

          - `"beacon"`

          - `"bossa"`

          - `"brise"`

          - `"cedar"`

          - `"cinder"`

          - `"coral"`

          - `"delta"`

          - `"echo"`

          - `"flitz"`

          - `"gleam"`

          - `"harema"`

          - `"juni"`

          - `"marin"`

          - `"meridian"`

          - `"nira"`

          - `"noeul"`

          - `"nuri"`

          - `"quartz"`

          - `"ripple"`

          - `"sage"`

          - `"shimmer"`

          - `"shitan"`

          - `"sillage"`

          - `"stone"`

          - `"tempo"`

          - `"verse"`

          - `"vesper"`

          - `"willow"`

        - `CustomVoice object { id }`

          - `id: string`

  - `client: optional ClientConfig`

    附加到统一 WebRTC 会话的不可信前端的仅启动时生效的能力。可信的旁路连接不受影响。

    - `data_channel: DataChannelConfig`

      WebRTC 前端数据通道的客户端和服务器事件权限。

      - `allowed_client_events: optional "all" or array of string`

        前端数据通道可以发送的客户端事件类型。使用 'all' 允许所有客户端事件；空数组表示不允许任何事件。省略时保持现有的全允许行为。

        - `"all"`

          - `"all"`

        - `array of string`

      - `allowed_server_events: optional "all" or array of ServerEventSelector`

        可以发送到前端数据通道的服务器事件。使用 'all' 允许所有服务器事件；空数组表示不允许任何事件。省略时保持现有的全允许行为。Responses 事件使用一个 type 为 'response.event' 的对象，并附带 response_event 选择器。

        - `"all"`

          - `"all"`

        - `array of ServerEventSelector`

          - `type: string`

            外层的 Live 服务器事件类型。对于 Responses 事件，请使用 'response.event'。

          - `response_event: optional string`

            嵌套的 Responses 事件类型。当 type 为 'response.event' 时必填；对于其他事件类型禁止使用。

  - `delegation: optional ClientDelegation or object { responses, type }  or null`

    处理由 Live 模型委派的任务的对象。省略或为 null 表示由你的应用处理；使用 `responses` 以便让 API 管理一个 Responses 后端。

    - `ClientDelegation object { type }`

      将任务委托给你的应用。Live 会话会发出委托事件,由你的后端处理。

      - `type: "client"`

        委托的所有者。始终 `client` 用于由你的应用处理的任务。

        - `"client"`

    - `Responses object { responses, type }`

      将任务委托给由 Live 会话管理的 Responses 模型。

      - `responses: ResponsesDelegationConfig`

        当 Live 会话将任务委托给 Responses 时使用的后端模型、提示和工具。

        - `model: string`

          用于服务端 Responses 委托的模型。

        - `instructions: optional string or null`

          委托给 Responses 模型的指令,与 Live 指令分开。请参阅 [后端提示](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt).

        - `max_output_tokens: optional number or null`

          每个委托响应的最大输出 token 数。

        - `parallel_tool_calls: optional boolean or null`

          委托的 Responses 模型是否可以在单个响应中请求多个工具调用。

        - `reasoning: optional object { effort, summary }  or null`

          传递给每个委托 Responses 请求的推理设置。

          - `effort: optional "none" or "minimal" or "low" or 3 more or null`

            委托的 Responses 模型应使用的推理力度。支持的值取决于后端模型。

            - `"none"`

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

          - `summary: optional "concise" or "detailed" or "auto" or null`

            在受支持时,从委托的 Responses 模型请求的推理摘要。

            - `"concise"`

            - `"detailed"`

            - `"auto"`

        - `service_tier: optional "auto" or "default" or "fast_tier_temp_pilot" or 3 more or null`

          委托的 Responses 请求的服务层级。

          - `"auto"`

          - `"default"`

          - `"fast_tier_temp_pilot"`

          - `"flex"`

          - `"priority"`

          - `"ultrafast"`

        - `text: optional object { verbosity }  or null`

          传递给每个委托 Responses 请求的文本生成设置。

          - `verbosity: optional "low" or "medium" or "high" or null`

            Responses 后端生成文本的详细程度。这不会配置 Live 模型的口头表达方式。

            - `"low"`

            - `"medium"`

            - `"high"`

        - `tool_choice: optional "auto" or "none" or "required" or object { name, type }  or object { name, server_label, type }`

          控制 Responses 后端在处理 Live 模型委托的任务时所使用的工具。

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

        - `tools: optional array of FunctionTool or object { type }  or object { type }  or 3 more`

          在 Responses 后端处理 Live 模型委托的任务时可用的工具。

          - `FunctionTool object { name, type, description, 2 more }`

            当 Live 模型委托任务时,Responses 后端可用的函数工具。

            - `name: string`

              被委托的 Responses 模型在调用此函数时使用的名称。

            - `type: "function"`

              工具类型。始终为 `function`.

              - `"function"`

            - `description: optional string or null`

              该函数的功能以及何时应被被委托的 Responses 模型调用。

            - `parameters: optional map[unknown] or null`

              一个描述该函数所接受参数的 JSON Schema 对象。

            - `strict: optional boolean or null`

              被委托的 Responses 模型是否必须严格按照函数的参数模式执行。

          - `WebSearch object { type }`

            Live 会话的 Responses 后端可用的一个网页搜索工具。

            - `type: "web_search"`

              工具类型。始终为 `web_search`.

              - `"web_search"`

          - `FileSearch object { type }`

            - `type: "file_search"`

              - `"file_search"`

          - `CodeInterpreter object { type }`

            - `type: "code_interpreter"`

              - `"code_interpreter"`

          - `Shell object { environment, type }`

            一个带有 container_auto 或 container_reference 环境的 Responses shell 工具。不支持本地执行和域密钥。

            - `environment: map[unknown]`

            - `type: "shell"`

              - `"shell"`

          - `ImageGeneration object { type }`

            - `type: "image_generation"`

              - `"image_generation"`

      - `type: "responses"`

        委托的所有者。始终 `responses` 用于由 Responses API 处理的任务。

        - `"responses"`

  - `input: optional array of InitialItem`

    启动前提供的纯文本有序历史记录。支持 developer、user 和 assistant 消息，每条消息仅含一个文本部分；总计最多 128 条消息，渲染后的 token 总数不超过 8,192。

    - `Developer object { content, role, id, 2 more }`

      包含在 Live 会话初始文本历史记录中的一条 developer 消息。

      - `content: array of object { text, type }`

        消息内容。为初始 Live 对话历史记录提供恰好一个文本部分。

        - `text: string`

          要包含在 Live 会话初始对话历史记录中的消息文本。

        - `type: optional "input_text"`

          文本内容类型。始终为 `input_text`.

          - `"input_text"`

      - `role: "developer"`

        此历史消息的作者。始终为 `developer`.

        - `"developer"`

      - `id: optional string or null`

        所提供历史消息的可选标识符。Live 使用该消息的角色和文本来初始化对话。

      - `status: optional "incomplete" or "completed" or null`

        所提供消息的状态。Live 将其文本用作历史记录，但不会恢复未完成的消息。

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        历史记录项的类型。始终为 `message`.

        - `"message"`

    - `User object { content, role, id, 2 more }`

      包含在 Live 会话初始文本历史记录中的一条 user 消息。

      - `content: array of object { text, type }`

        消息内容。为初始 Live 对话历史记录提供恰好一个文本部分。

        - `text: string`

          要包含在 Live 会话初始对话历史记录中的消息文本。

        - `type: optional "input_text"`

          文本内容类型。始终为 `input_text`.

          - `"input_text"`

      - `role: "user"`

        此历史消息的作者。始终为 `user`.

        - `"user"`

      - `id: optional string or null`

        所提供历史消息的可选标识符。Live 使用该消息的角色和文本来初始化对话。

      - `status: optional "incomplete" or "completed" or null`

        所提供消息的状态。Live 将其文本用作历史记录，但不会恢复未完成的消息。

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        历史记录项的类型。始终为 `message`.

        - `"message"`

    - `Assistant object { content, role, id, 2 more }`

      包含在 Live 会话初始文本历史记录中的一条 assistant 消息。

      - `content: array of object { text, type }  or object { text, type }`

        消息内容。为初始 Live 对话历史记录提供恰好一个文本部分。

        - `Text object { text, type }`

          启动 Live 会话时作为对话历史提供的 assistant 文本。

          - `text: string`

            要包含在 Live 会话初始对话历史记录中的消息文本。

          - `type: optional "text"`

            文本内容类型。始终为 `text`.

            - `"text"`

        - `OutputText object { text, type }`

          在启动 Live 会话时，作为对话历史提供的助手输出文本。

          - `text: string`

            要包含在 Live 会话初始对话历史记录中的消息文本。

          - `type: "output_text"`

            文本内容类型。始终为 `output_text`.

            - `"output_text"`

      - `role: "assistant"`

        此历史消息的作者。始终为 `assistant`.

        - `"assistant"`

      - `id: optional string or null`

        所提供历史消息的可选标识符。Live 使用该消息的角色和文本来初始化对话。

      - `status: optional "incomplete" or "completed" or null`

        所提供消息的状态。Live 将其文本用作历史记录，但不会恢复未完成的消息。

        - `"incomplete"`

        - `"completed"`

      - `type: optional "message"`

        历史记录项的类型。始终为 `message`.

        - `"message"`

  - `instructions: optional string or null`

    用于语音、对话、被打断以及何时进行委托的前端指令。首先从 [Live 提示指南](https://developers.openai.com/api/docs/guides/live-prompting)；入手；将业务规则和工具工作流放在单独的 [后端提示](https://developers.openai.com/api/docs/guides/live-delegation#start-with-your-existing-backend-prompt)。中。最多 16,384 个客户端提供的 token。如果省略或留空，则使用服务端默认值。启动后不可修改。

  - `store: optional boolean`

    是否存储该会话，以便后续派生分支和下载录制内容。新会话默认为 false。

- `type: "session.closed"`

  事件类型，始终为 `session.closed`.

  - `"session.closed"`

- `usage: SessionUsage`

  会话结束后累计的实时音频用量。

  - `seconds: number`

    累计 Live 音频时长（秒）。不要在不同的用量事件之间对这一字段进行累加。

- `client_event_id: optional string`

  与此服务器事件关联的客户端命令的 event_id（如果提供）。

#### 示例

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

上报 Live 会话中的错误，例如无效的客户端命令。如果存在，请使用 error.client_event_id 来标识导致该错误的命令。

#### Schema

Schema name: `LiveErrorEvent`

- `error: Error`

  已知时的 Live 错误详情以及导致该错误的客户端命令。

  - `code: string`

    用于标识 Live 错误的机器可读代码，例如 `unknown_parameter`.

  - `message: string`

    对 Live 错误的人类可读解释。

  - `type: string`

    错误的类别，例如 `invalid_request_error` 表示无效的 Live 客户端命令。

  - `client_event_id: optional string`

    导致错误的客户端命令的 event_id（如果提供）。

  - `param: optional string`

    导致错误的参数（如果适用），例如 `session.voice`.

- `event_id: string`

  Live 服务器事件的唯一 ID。

- `type: "error"`

  事件类型，始终为 `error`.

  - `"error"`

- `client_event_id: optional string`

  与此服务器事件关联的客户端命令的 event_id（如果提供）。

#### 示例

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

关于 Live 会话的信息性通知，例如应用于前端数据通道的事件权限。

#### Schema

Schema name: `LiveInfoEvent`

- `code: string`

  用于该通知的可机器读取代码，例如 `data_channel_permissions`.

- `event_id: string`

  Live 服务器事件的唯一 ID。

- `message: string`

  对 Live 会话通知的可读说明。

- `type: "info"`

  事件类型，始终为 `info`.

  - `"info"`

- `client_event_id: optional string`

  与此服务器事件关联的客户端命令的 event_id（如果提供）。

#### 示例

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

从主传输接收的输入音频，在模型输入静音之前，会反射到一个 Live 边带连接。

#### Schema

Schema name: `LiveInputAudioAppend`

- `audio: string`

  来自主传输的 Base64 编码原始 mono PCM16LE（24 kHz），在模型输入静音之前反射到旁带。此服务端事件使用与客户端命令相同的音频键，但并不是对该命令的确认。

- `type: "session.input_audio.append"`

  事件类型，始终为 `session.input_audio.append`.

  - `"session.input_audio.append"`

#### 示例

```json
{
  "type": "session.input_audio.append",
  "audio": "AACAAIAAAIAAAP9/AIAAgA=="
}
```

<a id="transport.dtmf.received"></a>

### transport.dtmf.received

来自呼叫方的 SIP DTMF 按键。仅发送给旁路观察者。

#### Schema

Schema name: `LiveTransportDTMFReceived`

- `event: string`

- `event_id: string`

- `type: "transport.dtmf.received"`

  - `"transport.dtmf.received"`

#### 示例

```json
{
  "type": "transport.dtmf.received",
  "event_id": "event_dtmf_1",
  "event": "5"
}
```

<a id="transport.dtmf.send"></a>

### transport.dtmf.send

SIP DTMF 按键已成功发送到 SIP 中继。仅传递给侧带观察者；这不是客户端命令。

#### Schema

Schema name: `LiveTransportDTMFSend`

- `event: string`

- `event_id: string`

- `type: "transport.dtmf.send"`

  - `"transport.dtmf.send"`

- `client_event_id: optional string`

  客户端命令的 event_id（如已提供）。

#### 示例

```json
{
  "type": "transport.dtmf.send",
  "event_id": "event_dtmf_2",
  "event": "#"
}
```
