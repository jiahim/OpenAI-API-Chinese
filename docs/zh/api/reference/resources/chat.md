# Chat

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

# Completions

## 创建聊天补全

**post** `/chat/completions`

**开始新项目？** 我们推荐使用 [Responses](/api/reference/resources/responses)
以充分利用 OpenAI 平台的最新功能。比较
[Chat Completions 与 Responses](/api/docs/guides/migrate-to-responses?api-mode=responses).

---

为给定的聊天对话创建模型响应。更多信息请参阅
[文本生成](/api/docs/guides/text), [视觉](/api/docs/guides/images-vision),
和 [音频](/api/docs/guides/audio) 指南。

参数支持可能因用于生成响应的模型而异，
尤其是较新的推理模型。仅由推理模型支持的
参数已在下方注明。有关推理模型中不受支持的
参数的当前情况，请参阅，
[推理指南](/api/docs/guides/reasoning).

返回一个聊天完成对象，如果请求是流式的，则
返回一系列聊天完成的块对象。

### 请求体参数

- `messages: array of ChatCompletionMessageParam`

  由一系列消息组成的会话历史。根据你使用的
  [model](/api/docs/models) 的不同，支持不同的消息类型（模态），例如
  支持的类型包括 [text](/api/docs/guides/text),
  [images](/api/docs/guides/images-vision)，和 [audio](/api/docs/guides/audio).

  - `ChatCompletionDeveloperMessageParam object { content, role, name }`

    开发者提供的指令，模型应遵循这些指令，而不论用户发送了什么消息。对于 o1 及更新的
    模型，使用 developer 角色取代 system 角色。 `developer` messages
    替换之前的 `system` messages。

    - `content: string or array of ChatCompletionContentPartText`

      开发者消息的内容。

      - `TextContent = string`

        开发者消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        由已定义类型组成的内容分块数组。对于开发者消息，仅支持 type `text` 类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容分块的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `role: "developer"`

      消息作者的角色，本例中为 `developer`.

      - `"developer"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息，用于区分同一角色的不同参与者。

  - `ChatCompletionSystemMessageParam object { content, role, name }`

    开发者提供的指令，模型应遵循这些指令，而不论用户发送了什么消息。对于 o1 及更新的
    用户发送的消息。对于 o1 及更新的模型，请改用 `developer` messages
    来实现此目的。

    - `content: string or array of ChatCompletionContentPartText`

      系统消息的内容。

      - `TextContent = string`

        系统消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        具有指定类型的内容部分数组。对于系统消息，仅支持类型 `text` 类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容分块的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

    - `role: "system"`

      消息作者的角色，本例中为 `system`.

      - `"system"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息，用于区分同一角色的不同参与者。

  - `ChatCompletionUserMessageParam object { content, role, name }`

    由终端用户发送的消息，包含提示或额外的上下文
    信息。

    - `content: string or array of ChatCompletionContentPart`

      用户消息的内容。

      - `TextContent = string`

        消息的文本内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPart`

        具有指定类型的内容部分数组。支持选项因用于生成响应的 [model](/api/docs/models) 而异。可以包含文本、图像或音频输入。

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/api/docs/guides/text).

          - `text: string`

            文本内容。

          - `type: "text"`

            内容分块的类型。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

        - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

          了解 [图像输入](/api/docs/guides/images-vision).

          - `image_url: object { url, detail }`

            - `url: string`

              图像的 URL 或 base64 编码的图像数据。

            - `detail: optional "auto" or "low" or "high"`

              指定图像的细节级别。在 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_url"`

            内容分块的类型。

            - `"image_url"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ChatCompletionContentPartInputAudio object { input_audio, type, prompt_cache_breakpoint }`

          了解 [音频输入](/api/docs/guides/audio).

          - `input_audio: object { data, format }`

            - `data: string`

              Base64 编码的音频数据。

            - `format: "wav" or "mp3"`

              编码音频数据的格式。目前支持 "wav" 和 "mp3"。

              - `"wav"`

              - `"mp3"`

          - `type: "input_audio"`

            内容部分的类型。始终为 `input_audio`.

            - `"input_audio"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `FileContentPart object { file, type, prompt_cache_breakpoint }`

          了解 [文件输入](/api/docs/guides/text) 用于文本生成。

          - `file: object { file_data, file_id, filename }`

            - `file_data: optional string`

              Base64 编码的文件数据，在将文件以字符串形式传递给模型时使用
              。

            - `file_id: optional string`

              用作输入的上传文件 ID。

            - `filename: optional string`

              文件名，在将文件以字符串形式传递给模型时使用，
              。

          - `type: "file"`

            内容部分的类型。始终为 `file`.

            - `"file"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

    - `role: "user"`

      消息作者的角色，本例中为 `user`.

      - `"user"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息，用于区分同一角色的不同参与者。

  - `ChatCompletionAssistantMessageParam object { role, audio, content, 4 more }`

    模型针对用户消息发送的消息。

    - `role: "assistant"`

      消息作者的角色，本例中为 `assistant`.

      - `"assistant"`

    - `audio: optional object { id }  or null`

      模型先前的音频响应相关的数据。
      [了解更多](/api/docs/guides/audio).

      - `id: string`

        模型先前音频响应的唯一标识符。

    - `content: optional string or array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal or null`

      助手消息的内容。除非指定了 `tool_calls` ，否则必填。 `function_call` 。

      - `TextContent = string`

        助手消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal`

        具有指定类型的内容分块数组。可以是以下类型的一个或多个 `text`，或以下类型中的恰好一个 `refusal`.

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/api/docs/guides/text).

        - `ChatCompletionContentPartRefusal object { refusal, type }`

          - `refusal: string`

            模型生成的拒绝消息。

          - `type: "refusal"`

            内容分块的类型。

            - `"refusal"`

    - `function_call: optional object { arguments, name }  or null`

      已弃用，并被替换为 `tool_calls`。模型生成的应被调用的函数的名称和参数。

      - `arguments: string`

        调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

      - `name: string`

        要调用的函数名称。

    - `name: optional string`

      参与者的可选名称。为模型提供信息，用于区分同一角色的不同参与者。

    - `refusal: optional string or null`

      助手给出的拒绝消息。

    - `tool_calls: optional array of ChatCompletionMessageToolCall`

      模型生成的工具调用，例如函数调用。

      - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

        对模型创建的函数工具的调用。

        - `id: string`

          工具调用的 ID。

        - `function: object { arguments, name }`

          模型调用的函数。

          - `arguments: string`

            调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

          - `name: string`

            要调用的函数名称。

        - `type: "function"`

          工具的类型。目前，仅有 `function` 类型。

          - `"function"`

      - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

        对模型创建的自定义工具的调用。

        - `id: string`

          工具调用的 ID。

        - `custom: object { input, name }`

          模型调用的自定义工具。

          - `input: string`

            模型生成的自定义工具调用的输入。

          - `name: string`

            要调用的自定义工具的名称。

        - `type: "custom"`

          工具的类型。始终为 `custom`.

          - `"custom"`

  - `ChatCompletionToolMessageParam object { content, role, tool_call_id }`

    - `content: string or array of ChatCompletionContentPartText`

      工具消息的内容。

      - `TextContent = string`

        工具消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        具有指定类型的内容部分数组。对于工具消息，只有类型 `text` 类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容分块的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

    - `role: "tool"`

      消息作者的角色，本例中为 `tool`.

      - `"tool"`

    - `tool_call_id: string`

      此消息正在响应的工具调用。

  - `ChatCompletionFunctionMessageParam object { content, name, role }`

    - `content: string or null`

      函数消息的内容。

    - `name: string`

      要调用的函数名称。

    - `role: "function"`

      消息作者的角色，本例中为 `function`.

      - `"function"`

- `model: string or "gpt-6-astra" or "gpt-6.1-sol" or "gpt-6-sol" or 86 more`

  用于生成响应的模型 ID，例如 `gpt-6-astra` ，否则必填。 `o3`。 OpenAI
  提供了多种不同能力、性能
  特性和价位的模型。请参阅 [模型指南](/api/docs/models)
  以浏览和比较可用的模型。

  - `string`

  - `"gpt-6-astra" or "gpt-6.1-sol" or "gpt-6-sol" or 86 more`

    用于生成响应的模型 ID，例如 `gpt-6-astra` ，否则必填。 `o3`。 OpenAI
    提供了多种不同能力、性能
    特性和价位的模型。请参阅 [模型指南](/api/docs/models)
    以浏览和比较可用的模型。

    - `"gpt-6-astra"`

    - `"gpt-6.1-sol"`

    - `"gpt-6-sol"`

    - `"gpt-6-luna"`

    - `"gpt-5.6-sol"`

    - `"gpt-5.6-terra"`

    - `"gpt-5.6-luna"`

    - `"gpt-5.5"`

    - `"gpt-5.5-2026-04-23"`

    - `"gpt-5.4"`

    - `"gpt-5.4-mini"`

    - `"gpt-5.4-nano"`

    - `"gpt-5.4-mini-2026-03-17"`

    - `"gpt-5.4-nano-2026-03-17"`

    - `"gpt-5.3-chat-latest"`

    - `"gpt-5.2"`

    - `"gpt-5.2-2025-12-11"`

    - `"gpt-5.2-chat-latest"`

    - `"gpt-5.2-pro"`

    - `"gpt-5.2-pro-2025-12-11"`

    - `"gpt-5.1"`

    - `"gpt-5.1-2025-11-13"`

    - `"gpt-5.1-codex"`

    - `"gpt-5.1-mini"`

    - `"gpt-5.1-chat-latest"`

    - `"gpt-5"`

    - `"gpt-5-mini"`

    - `"gpt-5-nano"`

    - `"gpt-5-2025-08-07"`

    - `"gpt-5-mini-2025-08-07"`

    - `"gpt-5-nano-2025-08-07"`

    - `"gpt-5-chat-latest"`

    - `"gpt-4.1"`

    - `"gpt-4.1-mini"`

    - `"gpt-4.1-nano"`

    - `"gpt-4.1-2025-04-14"`

    - `"gpt-4.1-mini-2025-04-14"`

    - `"gpt-4.1-nano-2025-04-14"`

    - `"o4-mini"`

    - `"o4-mini-2025-04-16"`

    - `"o3"`

    - `"o3-2025-04-16"`

    - `"o3-mini"`

    - `"o3-mini-2025-01-31"`

    - `"o1"`

    - `"o1-2024-12-17"`

    - `"o1-preview"`

    - `"o1-preview-2024-09-12"`

    - `"o1-mini"`

    - `"o1-mini-2024-09-12"`

    - `"gpt-4o"`

    - `"gpt-4o-2024-11-20"`

    - `"gpt-4o-2024-08-06"`

    - `"gpt-4o-2024-05-13"`

    - `"gpt-audio-mini"`

    - `"gpt-audio-mini-2025-12-15"`

    - `"gpt-4o-audio-preview"`

    - `"gpt-4o-audio-preview-2024-10-01"`

    - `"gpt-4o-audio-preview-2024-12-17"`

    - `"gpt-4o-audio-preview-2025-06-03"`

    - `"gpt-4o-mini-audio-preview"`

    - `"gpt-4o-mini-audio-preview-2024-12-17"`

    - `"gpt-4o-search-preview"`

    - `"gpt-4o-mini-search-preview"`

    - `"gpt-4o-search-preview-2025-03-11"`

    - `"gpt-4o-mini-search-preview-2025-03-11"`

    - `"chatgpt-4o-latest"`

    - `"codex-mini-latest"`

    - `"gpt-4o-mini"`

    - `"gpt-4o-mini-2024-07-18"`

    - `"gpt-4-turbo"`

    - `"gpt-4-turbo-2024-04-09"`

    - `"gpt-4-0125-preview"`

    - `"gpt-4-turbo-preview"`

    - `"gpt-4-1106-preview"`

    - `"gpt-4-vision-preview"`

    - `"gpt-4"`

    - `"gpt-4-0314"`

    - `"gpt-4-0613"`

    - `"gpt-4-32k"`

    - `"gpt-4-32k-0314"`

    - `"gpt-4-32k-0613"`

    - `"gpt-3.5-turbo"`

    - `"gpt-3.5-turbo-16k"`

    - `"gpt-3.5-turbo-0301"`

    - `"gpt-3.5-turbo-0613"`

    - `"gpt-3.5-turbo-1106"`

    - `"gpt-3.5-turbo-0125"`

    - `"gpt-3.5-turbo-16k-0613"`

- `audio: optional ChatCompletionAudioParam or null`

  音频输出的参数。在使用以下方式请求音频输出时为必填项
  `modalities: ["audio"]`. [了解更多](/api/docs/guides/audio).

  - `format: "wav" or "aac" or "mp3" or 3 more`

    指定输出音频格式。必须是以下之一 `wav`, `mp3`, `flac`,
    `opus`，或 `pcm16`.

    - `"wav"`

    - `"aac"`

    - `"mp3"`

    - `"flac"`

    - `"opus"`

    - `"pcm16"`

  - `voice: string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

    模型用于响应的声音。支持的内置声音包括
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `nova`, `onyx`,
    `sage`, `shimmer`, `marin`，和 `cedar`。你也可以提供一个
    带有以下字段的自定义声音对象 `id`，例如 `{ "id": "voice_1234" }`.

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

      自定义声音引用。

      - `id: string`

        自定义声音 ID，例如 `voice_1234`.

- `frequency_penalty: optional number or null`

  介于 -2.0 和 2.0 之间的数字。正值会根据新词元在
  目前文本中的已有出现频率对其进行惩罚，从而降低模型
  逐字重复相同内容的可能性。

- `function_call: optional "none" or "auto" or ChatCompletionFunctionCallOption`

  已弃用，推荐使用 `tool_choice`.

  控制模型调用哪个函数（如果有）。

  `none` 表示模型不会调用函数，而是生成一条
  消息。

  `auto` 表示模型可以在生成消息和调用某个
  函数之间选择。

  通过 `{"name": "my_function"}` 指定某个特定函数会强制
  模型调用该函数。

  `none` 是未提供函数时的默认值。 `auto` 是默认
  值（如果提供了函数）。

  - `"none" or "auto"`

    `none` 表示模型不会调用函数，而是生成一条消息。 `auto` 表示模型可以在生成消息和调用函数之间选择。

    - `"none"`

    - `"auto"`

  - `ChatCompletionFunctionCallOption object { name }`

    通过 `{"name": "my_function"}` 会强制模型调用该函数。

    - `name: string`

      要调用的函数名称。

- `functions: optional array of object { name, description, parameters }`

  已弃用，推荐使用 `tools`.

  模型可为其生成 JSON 输入的函数列表。

  - `name: string`

    要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和连字符，最大长度为 64。

  - `description: optional string`

    对函数功能的描述，模型据此选择何时以及如何调用该函数。

  - `parameters: optional FunctionParameters`

    函数接受的参数，以 JSON Schema 对象描述。参见 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 获取有关该格式的文档。

    省略 `parameters` 定义一个参数列表为空的函数。

- `logit_bias: optional map[number] or null`

  修改指定 token 在补全中出现的可能性。

  接受一个 JSON 对象，将 token（通过其在
  分词器中的 token ID 指定）映射到介于 -100 到 100 的关联偏差值。数学上，
  该偏差会在模型采样之前加到模型生成的 logits 上。
  具体效果因模型而异，但介于 -1 到 1 之间的值应
  降低或提高被选中的可能性；像 -100 或 100 这类
  的值应导致相关 token 被禁止或被排他性选中。

- `logprobs: optional boolean or null`

  是否返回输出 token 的对数概率。如果为 true，
  会返回所返回的每个输出 token 的对数概率
  `content` 的 `message`.

- `max_completion_tokens: optional number or null`

  一次补全可生成 token 数量的上限，包括可见的输出 token 以及 [推理 token](/api/docs/guides/reasoning).

- `max_tokens: optional number or null`

  可在 [聊天补全](https://platform.openai.com/tokenizer) 中生成的最大
  token 数。此值可用于控制
  [成本](https://openai.com/api/pricing/) 用于通过 API 生成的文本。

  此值现已弃用，改用 `max_completion_tokens`，并且
  与 [o 系列模型](/api/docs/guides/reasoning).

- `metadata: optional Metadata or null`

  可附加到对象的 16 个键值对集合。可用于
  以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
  格式，以及通过 接口 或仪表板查询对象。

  键为字符串，最大长度为 64 个字符。值为字符串，
  最大长度为 512 个字符。

- `modalities: optional array of "text" or "audio" or null`

  你希望模型生成的输出类型。
  大多数模型都能生成文本，这也是默认输出类型：

  `["text"]`

  该 `gpt-4o-audio-preview` 该模型也可用于
  [生成音频](/api/docs/guides/audio)。要请求该模型生成
  同时处理文本和音频响应，你可以使用：

  `["text", "audio"]`

  - `"text"`

  - `"audio"`

- `moderation: optional object { model, policy }  or null`

  对请求输入和生成输出运行审核的配置。

  - `model: string`

    用于审核补全的审核模型，例如 'omni-moderation-latest'。

  - `policy: optional object { input, output }  or null`

    应用于审核响应输入和输出的策略。

    - `input: optional object { mode }  or null`

      响应输入的内容审核策略。

      - `mode: "score" or "block"`

        - `"score"`

        - `"block"`

    - `output: optional object { mode }  or null`

      响应输出的内容审核策略。

      - `mode: "score" or "block"`

        - `"score"`

        - `"block"`

- `n: optional number or null`

  为每条输入消息生成多少个聊天补全选项。请注意，费用将根据所有选项生成的 token 总数计算。请将 `n` as `1` 设为较低的值以最小化成本。

- `parallel_tool_calls: optional boolean`

  是否启用 [并行函数调用](/api/docs/guides/function-calling#parallel-function-calling) 在工具使用期间。

- `prediction: optional ChatCompletionPredictionContent or null`

  一个 [预测输出](/api/docs/guides/predicted-outputs),
  的配置，当模型响应的大部分内容事先已知时，它可以显著提升响应速度。当你
  重新生成一个文件且大部分内容只有微小的改动时，这种情况最为常见。
  重新生成一个文件且大部分内容只有微小的改动时，这种情况最为常见。

  - `content: string or array of ChatCompletionContentPartText`

    生成模型响应时应匹配的内容。
    如果生成的 token 与该内容匹配，整个模型响应
    可以更快地返回。

    - `TextContent = string`

      用于预测输出的内容。这通常是
      你正在重新生成且只有微小改动的文件的文本。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      具有指定类型的内容部分数组。支持选项因用于生成响应的 [model](/api/docs/models) 用于生成响应的内容。可以包含文本输入。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容分块的类型。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

  - `type: "content"`

    你要提供的预测内容的类型。该类型
    目前始终是 `content`.

    - `"content"`

- `presence_penalty: optional number or null`

  介于 -2.0 和 2.0 之间的数字。正值会根据新词元在
  迄今为止它们是否出现在文本中，从而增加模型谈论
  新话题的可能性。

- `prompt_cache_key: optional string or null`

  由 OpenAI 用于缓存相似请求的响应，以优化你的缓存命中率。取代了 `user` 字段。 [了解更多](/api/docs/guides/prompt-caching).

- `prompt_cache_options: optional object { mode, ttl }`

  提示缓存的选项。支持 `gpt-5.6` 及更高版本的模型。默认情况下，OpenAI 会自动选择一个隐式缓存断点。你可以使用 `prompt_cache_breakpoint`。为内容块添加显式断点。每个请求最多可写入四个断点。对于缓存匹配，OpenAI 会考虑对话中最多最近的 80 个断点，没有内容块回溯限制。将 `mode` 设为 `explicit` 以禁用隐式断点。 `ttl` 默认为 `30m`，这是当前唯一支持的值。请参阅 [提示缓存指南](/api/docs/guides/prompt-caching) 了解最新详情。

  - `mode: optional "implicit" or "explicit"`

    控制 OpenAI 是否自动创建隐式缓存断点。默认为 `implicit`。使用 `implicit`，时，OpenAI 会创建一个隐式断点，并在请求中写入最多最近的三个显式断点。使用 `explicit`，时，OpenAI 不会创建隐式断点，并写入最多最近的四个显式断点。如果没有显式断点，则该请求不会使用提示缓存。

    - `"implicit"`

    - `"explicit"`

  - `ttl: optional "30m"`

    请求写入的每个隐式和显式缓存断点所应用的最小生存时间。默认为 `30m`，这是当前唯一支持的值。后端可能会将缓存条目保留更长时间。

    - `"30m"`

- `prompt_cache_retention: optional "in_memory" or "24h" or null`

  已弃用。请使用 `prompt_cache_options.ttl` 代替。

  提示缓存的保留策略。设置为 `24h` 以启用扩展提示缓存，使缓存的前缀保持更长时间的活跃状态，最长可达 24 小时。 [了解更多](/api/docs/guides/prompt-caching#prompt-cache-retention).
  此字段表示最大保留策略，而
  `prompt_cache_options.ttl` 表示最小缓存生命周期。这两个
  字段相互独立，不会互相影响。
  对于 `gpt-5.5`, `gpt-5.5-pro`，以及未来的模型，仅 `24h` 类型。

  对于同时支持 `in_memory` 和 `24h`，的较旧模型，默认值取决于你所在组织的数据保留策略：

  - 未启用 ZDR 的组织默认为 `24h`.
  - 启用 ZDR 的组织默认为 `in_memory` 当 `prompt_cache_retention` 未指定时。

  - `"in_memory"`

  - `"24h"`

- `reasoning_effort: optional ReasoningEffort or null`

  约束推理模型在推理上的投入程度。当前支持的
  取值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
  降低推理投入程度可以带来更快的响应，并在响应中使用更少的推理 token。并非所有推理模型都支持每个
  推理模型都支持每种
  值。参见
  [reasoning guide](/api/docs/guides/reasoning)
  以了解特定模型的支持情况。

  - `"none"`

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

- `response_format: optional ResponseFormatText or ResponseFormatJSONSchema or ResponseFormatJSONObject`

  指定模型必须输出的格式的对象。

  设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用
  结构化输出（Structured Outputs），确保模型匹配你提供的 JSON
  schema。更多信息请参阅 [Structured Outputs
  指南](/api/docs/guides/structured-outputs).

  设置为 `{ "type": "json_object" }` 可启用旧的 JSON 模式，这会
  确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
  的模型，建议优先使用它。

  - `ResponseFormatText object { type }`

    默认响应格式。用于生成文本响应。

    - `type: "text"`

      正在定义的响应格式的类型。始终为 `text`.

      - `"text"`

  - `ResponseFormatJSONSchema object { json_schema, type }`

    JSON Schema 响应格式。用于生成结构化的 JSON 响应。
    了解更多关于 [Structured Outputs](/api/docs/guides/structured-outputs).

    - `json_schema: object { name, description, schema, strict }`

      结构化输出配置选项的信息，包括 JSON Schema。

      - `name: string`

        响应格式的名称。必须为 a-z、A-Z、0-9，或包含
        下划线和短横线，最大长度为 64。

      - `description: optional string`

        响应格式用途的描述，模型使用它来
        确定如何按指定格式进行响应。

      - `schema: optional map[unknown]`

        响应格式的 schema，以 JSON Schema 对象形式描述。
        了解如何构建 JSON schema [此处](https://json-schema.org/).

      - `strict: optional boolean or null`

        是否在生成输出时启用严格的 schema 遵循。
        若设置为 true，模型将始终遵循所定义的精确 schema
        字段。当 `schema` 时，仅支持 JSON Schema 的一个子集。了解更多信息，请参阅
        `strict` 为 `true`。的文档。 [Structured Outputs
        指南](/api/docs/guides/structured-outputs).

    - `type: "json_schema"`

      正在定义的响应格式的类型。始终为 `json_schema`.

      - `"json_schema"`

  - `ResponseFormatJSONObject object { type }`

    JSON 对象响应格式。一种较旧的 JSON 响应生成方式。
    对于支持的模型，推荐使用 `json_schema` 。请注意，如果没有系统或用户消息指示模型生成 JSON，
    模型将不会生成 JSON。
    。

    - `type: "json_object"`

      正在定义的响应格式的类型。始终为 `json_object`.

      - `"json_object"`

- `safety_identifier: optional string or null`

  一个稳定的标识符，用于帮助检测可能违反 OpenAI 使用政策的应用用户。
  该 ID 应为一个字符串，唯一标识每位用户，最大长度为 64 个字符。我们建议对其用户名或电子邮件地址进行哈希处理，以避免向我们发送任何可识别信息。 [了解更多](/api/docs/guides/safety-best-practices#implement-safety-identifiers).

- `seed: optional number or null`

  此功能处于 Beta 阶段。
  如果指定，系统将尽力进行确定性采样，即使用相同 `seed` 和参数的重复请求应返回相同的结果。
  无法保证确定性，你应该参考 `system_fingerprint` 参数来监控后端的变化。

- `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

  指定用于处理该请求的处理类型。

  - 如果设置为 'auto'，则该请求将使用在项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
  - 如果设置为 'default'，则该请求将使用所选模型的标准定价和性能进行处理。
  - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则该请求将使用 Flex Processing 服务层级进行处理。
  - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 请求中包含 `service_tier=fast` ，否则必填。 `service_tier=priority` 参数。响应中会显示 `service_tier=priority` ，无论你是否在请求中指定 `service_tier=fast` ，否则必填。 `priority` 。
  - 当未设置时，默认行为为 'auto'。

  当设置了 `service_tier` 参数时，响应体将包含基于实际用于处理该请求的处理模式得出的 `service_tier` 值。该响应值可能与参数中设置的值不同。

  - `"auto"`

  - `"default"`

  - `"flex"`

  - `"scale"`

  - `"priority"`

  - `"fast"`

- `stop: optional string or array of string or null`

  最新的推理模型不支持该参数 `o3` 和 `o4-mini`.

  最多 4 个序列，API 将在这些位置停止生成更多 token。该
  返回的文本将不会包含停止序列。

  - `string`

  - `array of string`

- `store: optional boolean or null`

  是否存储本次 Chat Completions 请求的输出，以用于我们的
  用于我们的 [模型蒸馏](/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model) ，否则必填。
  [evals](/api/docs/guides/evals) 产品。

  支持文本和图像输入。注意：超过 8MB 的图像输入将被丢弃。

- `stream: optional boolean or null`

  如果设置为 true，模型响应数据将通过
  边生成边流式传输给客户端，使用 [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format).
  请参阅下文 [Streaming 章节](/api/reference/resources/chat/subresources/completions/streaming-events)
  了解更多信息，以及 [streaming responses](/api/docs/guides/streaming-responses)
  指南，了解如何处理流式事件。

- `stream_options: optional ChatCompletionStreamOptions or null`

  流式响应的相关选项。仅当设置了 `stream: true`.

  - `include_obfuscation: optional boolean`

    当该值为 true 时，将启用流混淆。流混淆会在流式 delta 事件的
    字段中添加随机字符，以 `obfuscation` 字段添加随机字符到流式 delta 事件上，以
    规范化负载大小，作为针对某些侧信道攻击的缓解措施。
    这些混淆字段默认包含，但会增加少量
    数据传输的开销。如果信任你的应用与OpenAI API之间的网络链路，可以设置 `include_obfuscation` 设为
    为 false 以优化带宽，如果信任你的应用与该公司 接口
    之间的网络链路。

  - `include_usage: optional boolean`

    如果设置了该参数，将在 `data: [DONE]`
    消息之前流式传输一个额外的分块。该分块上的 `usage` 字段显示整个请求的令牌使用情况统计信息，
    字段将始终是 `choices` 一个空
    数组。

    所有其他块也会包含一个 `usage` 字段，但值为
    null。 **注意：** 如果流被中断，你可能无法接收到包含该请求总 token 使用量的
    最终 usage 块。

- `temperature: optional number or null`

  使用的采样温度，介于 0 到 2 之间。较高的值（如 0.8）会使输出更加随机，而较低的值（如 0.2）会使输出更加聚焦和确定。
  我们通常建议修改此项或 `top_p` ，但不要同时修改两者。

- `tool_choice: optional ChatCompletionToolChoiceOption`

  控制模型调用哪些工具（如果有）。
  `none` 表示模型不会调用任何工具，而是生成一条消息。
  `auto` 表示模型可以在生成消息和调用一个或多个工具之间进行选择。
  `required` 表示模型必须调用一个或多个工具。
  通过以下方式指定特定工具 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

  `none` 在没有工具时的默认设置。 `auto` 在存在工具时的默认设置。

  - `ToolChoiceMode = "none" or "auto" or "required"`

    `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以在生成消息和调用一个或多个工具之间进行选择。 `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ChatCompletionAllowedToolChoice object { allowed_tools, type }`

    将模型可用的工具限制为预定义的集合。

    - `allowed_tools: ChatCompletionAllowedTools`

      将模型可用的工具限制为预定义的集合。

      - `mode: "auto" or "required"`

        将模型可用的工具限制为预定义的集合。

        `auto` 允许模型从允许的工具中选择并生成一条
        消息。

        `required` 要求模型调用一个或多个允许的工具。

        - `"auto"`

        - `"required"`

      - `tools: array of map[unknown]`

        模型应被允许调用的工具定义列表。

        对于 Chat Completions API，工具定义列表可能如下所示：

        ```json
        [
          { "type": "function", "function": { "name": "get_weather" } },
          { "type": "function", "function": { "name": "get_time" } }
        ]
        ```

    - `type: "allowed_tools"`

      允许的工具配置类型。始终为 `allowed_tools`.

      - `"allowed_tools"`

  - `ChatCompletionNamedToolChoice object { function, type }`

    指定模型应使用的工具。用于强制模型调用特定函数。

    - `function: object { name }`

      - `name: string`

        要调用的函数名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ChatCompletionNamedToolChoiceCustom object { custom, type }`

    指定模型应使用的工具。用于强制模型调用特定的自定义工具。

    - `custom: object { name }`

      - `name: string`

        要调用的自定义工具的名称。

    - `type: "custom"`

      对于自定义工具调用，类型始终为 `custom`.

      - `"custom"`

- `tools: optional array of ChatCompletionTool`

  模型可以调用的工具列表。你可以提供
  [自定义工具](/api/docs/guides/function-calling#custom-tools) ，否则必填。
  [函数工具](/api/docs/guides/function-calling).

  - `ChatCompletionFunctionTool object { function, type }`

    用于生成响应的函数工具。

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和连字符，最大长度为 64。

      - `description: optional string`

        对函数功能的描述，模型据此选择何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，以 JSON Schema 对象描述。参见 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 获取有关该格式的文档。

        省略 `parameters` 定义一个参数列表为空的函数。

      - `strict: optional boolean or null`

        是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循在中定义的精确模式 `parameters` 时，仅支持 JSON Schema 的一个子集。了解更多信息，请参阅 `strict` 为 `true`。在以下文档中详细了解结构化输出： [函数调用指南](/api/docs/guides/function-calling).

    - `type: "function"`

      工具的类型。目前，仅有 `function` 类型。

      - `"function"`

  - `ChatCompletionCustomTool object { custom, type }`

    使用指定格式处理输入的自定义工具。

    - `custom: object { name, description, format }`

      自定义工具的属性。

      - `name: string`

        自定义工具的名称，用于在工具调用中标识它。

      - `description: optional string`

        自定义工具的可选描述，用于提供更多上下文。

      - `format: optional object { type }  or object { grammar, type }`

        自定义工具的输入格式。默认情况下为无约束文本。

        - `Text object { type }`

          无约束自由格式文本。

          - `type: "text"`

            无约束文本格式。始终为 `text`.

            - `"text"`

        - `Grammar object { grammar, type }`

          由用户定义的语法。

          - `grammar: object { definition, syntax }`

            你选择的语法。

            - `definition: string`

              语法定义。

            - `syntax: "lark" or "regex"`

              语法定义的语法格式。可选值之一： `lark` ，否则必填。 `regex`.

              - `"lark"`

              - `"regex"`

          - `type: "grammar"`

            语法格式。始终为 `grammar`.

            - `"grammar"`

    - `type: "custom"`

      自定义工具的类型。始终为 `custom`.

      - `"custom"`

- `top_logprobs: optional number or null`

  一个介于 0 到 20 之间的整数，指定在每个 token 位置返回的最可能的
  token 数量，每个 token 都带有对应的对数
  概率。在某些情况下，返回的 token 数量可能少于
  被请求。
  `logprobs` 必须设置为 `true` 如果使用了此参数。

- `top_p: optional number or null`

  一种称为核采样的温度采样替代方法，
  模型会考虑具有 top_p 概率质量的 token 结果。
  因此 0.1 表示仅考虑构成前 10% 概率质量的 token。
  被考虑。

  我们通常建议修改此项或 `temperature` ，但不要同时修改两者。

- `user: optional string or null`

  此字段正在被替换为 `safety_identifier` 和 `prompt_cache_key`。请使用 `prompt_cache_key` 代替以维持缓存优化。
  你最终用户的稳定标识符。
  通过更好地对相似请求进行分桶来提高缓存命中率，并帮助 OpenAI 检测和防止滥用。 [了解更多](/api/docs/guides/safety-best-practices#implement-safety-identifiers).

- `verbosity: optional "low" or "medium" or "high" or null`

  约束模型响应的详细程度。较低的值将产生
  更简洁的响应，而较高的值将产生更详细的响应。
  当前支持的值有 `low`, `medium`，和 `high`。默认值为
  `medium`.

  - `"low"`

  - `"medium"`

  - `"high"`

- `web_search_options: optional object { search_context_size, user_location }`

  此工具会在网络上搜索可用于响应的相关结果。
  详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

  - `search_context_size: optional "low" or "medium" or "high"`

    用于指定响应所需上下文窗口空间的高级指导。
    search. One of `low`, `medium`，或 `high`. `medium` is the default.

    - `"low"`

    - `"medium"`

    - `"high"`

  - `user_location: optional object { approximate, type }  or null`

    搜索的近似位置参数。

    - `approximate: object { city, country, region, timezone }`

      搜索的近似位置参数。

      - `city: optional string`

        用户所在城市的自由文本输入，例如 `San Francisco`.

      - `country: optional string`

        The two-letter
        [ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1) 用户的，
        例如。 `US`.

      - `region: optional string`

        用户所在地区的自由文本输入，例如 `California`.

      - `timezone: optional string`

        该 [IANA 时区](https://timeapi.io/documentation/iana-timezones)
        用户的，例如。 `America/Los_Angeles`.

    - `type: "approximate"`

      位置近似值的类型。始终为 `approximate`.

      - `"approximate"`

### 返回

- `ChatCompletion object { id, choices, created, 7 more }`

  表示由模型根据所提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项的列表。如果 `n` 大于 1，则可以多于一个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成令牌的原因。该值将 `stop` ：模型遇到自然停止点或提供了停止序列时为，
      `length` ：达到请求中指定的最大令牌数时为，
      `content_filter` ：由于我们的内容过滤器标记而省略内容时为，
      `tool_calls` ：模型调用了工具时为 `function_call` （已弃用）：模型调用了函数时为。
      阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      该选项的日志概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        包含日志概率信息的消息内容令牌列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

        - `logprob: number`

          该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置上可能性最高的 token 列表及其对数概率。条目数量可能少于请求中指定的 `top_logprobs`.

          - `token: string`

            该令牌。

          - `bytes: array of number or null`

            一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

          - `logprob: number`

            该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含消息拒绝 token 及其对数概率信息的列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

        - `logprob: number`

          该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置上可能性最高的 token 列表及其对数概率。条目数量可能少于请求中指定的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        该消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注解（如适用），例如使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用第一个字符的索引。

          - `title: string`

            网络资源的标题。

          - `url: string`

            网络资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含来自模型的音频
        响应的相关数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式为请求中
          指定的格式。

        - `expires_at: number`

          此音频响应在服务端不再可用于多轮
          对话时的 Unix 时间戳（秒）。
          conversations.

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，并被替换为 `tool_calls`。模型生成的应被调用的函数的名称和参数。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。目前，仅有 `function` 类型。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          对模型创建的自定义工具的调用。

          - `id: string`

            工具调用的 ID。

          - `custom: object { input, name }`

            模型调用的自定义工具。

            - `input: string`

              模型生成的自定义工具调用的输入。

            - `name: string`

              要调用的自定义工具的名称。

          - `type: "custom"`

            工具的类型。始终为 `custom`.

            - `"custom"`

  - `created: number`

    创建该聊天补全时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于该聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对集合。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
    格式，以及通过 接口 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入与生成输出的审核结果（如果请求了
    completions 审核）。

    - `input: object { model, results, type }  or object { code, message, type }`

      针对请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        针对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，若输入被该类别标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到得分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （针对成功的审核结果）。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

    - `output: object { model, results, type }  or object { code, message, type }`

      对生成输出的内容审核。

      - `ModerationResults object { model, results, type }`

        针对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，若输入被该类别标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到得分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （针对成功的审核结果）。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的处理类型。

    - 如果设置为 'auto'，则该请求将使用在项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
    - 如果设置为 'default'，则该请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则该请求将使用 Flex Processing 服务层级进行处理。
    - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 请求中包含 `service_tier=fast` ，否则必填。 `service_tier=priority` 参数。响应中会显示 `service_tier=priority` ，无论你是否在请求中指定 `service_tier=fast` ，否则必填。 `priority` 。
    - 当未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体将包含基于实际用于处理该请求的处理模式得出的 `service_tier` 值。该响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    该指纹表示模型运行所采用的后端配置。

    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    该补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数。

    - `prompt_tokens: number`

      提示词中的 token 数。

    - `total_tokens: number`

      请求中使用的 token 总数（提示词 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        出现在补全中的预测部分所对应的 token 数。

      - `audio_tokens: optional number`

        模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        模型为推理生成的 token。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全中的预测部分。然而，与
        推理 token 类似，这些 token 仍会计入用于计费、输出和上下文窗口
        限制统计的总补全 token 数中。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的、未调整过的提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的已缓存 token。

      - `image_tokens: optional number`

        提示中存在的图像输入 token。

      - `text_tokens: optional number`

        提示中存在的文本输入 token。

### 示例

```http
curl https://api.openai.com/v1/chat/completions \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "messages": [
            {
              "content": "string",
              "role": "developer"
            }
          ],
          "model": "gpt-6-astra",
          "n": 1,
          "prompt_cache_key": "prompt-cache-key-1234",
          "safety_identifier": "safety-identifier-1234",
          "temperature": 1,
          "top_p": 1,
          "user": "user-1234"
        }'
```

#### 响应

```json
{
  "id": "id",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "logprobs": {
        "content": [
          {
            "token": "token",
            "bytes": [
              0
            ],
            "logprob": 0,
            "top_logprobs": [
              {
                "token": "token",
                "bytes": [
                  0
                ],
                "logprob": 0
              }
            ]
          }
        ],
        "refusal": [
          {
            "token": "token",
            "bytes": [
              0
            ],
            "logprob": 0,
            "top_logprobs": [
              {
                "token": "token",
                "bytes": [
                  0
                ],
                "logprob": 0
              }
            ]
          }
        ]
      },
      "message": {
        "content": "content",
        "refusal": "refusal",
        "role": "assistant",
        "annotations": [
          {
            "type": "url_citation",
            "url_citation": {
              "end_index": 0,
              "start_index": 0,
              "title": "title",
              "url": "https://example.com"
            }
          }
        ],
        "audio": {
          "id": "id",
          "data": "data",
          "expires_at": 0,
          "transcript": "transcript"
        },
        "function_call": {
          "arguments": "arguments",
          "name": "name"
        },
        "tool_calls": [
          {
            "id": "id",
            "function": {
              "arguments": "arguments",
              "name": "name"
            },
            "type": "function"
          }
        ]
      }
    }
  ],
  "created": 0,
  "model": "model",
  "object": "chat.completion",
  "metadata": {
    "foo": "string"
  },
  "moderation": {
    "input": {
      "model": "model",
      "results": [
        {
          "categories": {
            "foo": true
          },
          "category_applied_input_types": {
            "foo": [
              "text"
            ]
          },
          "category_scores": {
            "foo": 0
          },
          "flagged": true,
          "model": "model",
          "type": "moderation_result"
        }
      ],
      "type": "moderation_results"
    },
    "output": {
      "model": "model",
      "results": [
        {
          "categories": {
            "foo": true
          },
          "category_applied_input_types": {
            "foo": [
              "text"
            ]
          },
          "category_scores": {
            "foo": 0
          },
          "flagged": true,
          "model": "model",
          "type": "moderation_result"
        }
      ],
      "type": "moderation_results"
    }
  },
  "service_tier": "auto",
  "system_fingerprint": "system_fingerprint",
  "usage": {
    "completion_tokens": 0,
    "prompt_tokens": 0,
    "total_tokens": 0,
    "completion_tokens_details": {
      "accepted_prediction_tokens": 0,
      "audio_tokens": 0,
      "reasoning_tokens": 0,
      "rejected_prediction_tokens": 0,
      "text_tokens": 0
    },
    "prompt_tokens_details": {
      "audio_tokens": 0,
      "cache_write_tokens": 0,
      "cached_tokens": 0,
      "image_tokens": 0,
      "text_tokens": 0
    }
  }
}
```

### 示例

```http
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "messages": [
      {
        "role": "developer",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }'
```

#### 响应

```json
{
  "id": "chatcmpl-B9MBs8CjcvOU2jLn4n570S5qMJKcT",
  "object": "chat.completion",
  "created": 1741569952,
  "model": "gpt-6-astra",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I assist you today?",
        "refusal": null,
        "annotations": []
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 19,
    "completion_tokens": 10,
    "total_tokens": 29,
    "prompt_tokens_details": {
      "cached_tokens": 0,
      "audio_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  },
  "service_tier": "default"
}
```

### 函数

```http
curl https://api.openai.com/v1/chat/completions \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
  "model": "gpt-6-astra",
  "messages": [
    {
      "role": "user",
      "content": "What is the weather like in Boston today?"
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_current_weather",
        "description": "Get the current weather in a given location",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "The city and state, e.g. San Francisco, CA"
            },
            "unit": {
              "type": "string",
              "enum": ["celsius", "fahrenheit"]
            }
          },
          "required": ["location"]
        }
      }
    }
  ],
  "tool_choice": "auto"
}'
```

#### 响应

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1699896916,
  "model": "gpt-6-astra",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": null,
        "tool_calls": [
          {
            "id": "call_abc123",
            "type": "function",
            "function": {
              "name": "get_current_weather",
              "arguments": "{\n\"location\": \"Boston, MA\"\n}"
            }
          }
        ]
      },
      "logprobs": null,
      "finish_reason": "tool_calls"
    }
  ],
  "usage": {
    "prompt_tokens": 82,
    "completion_tokens": 17,
    "total_tokens": 99,
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  }
}
```

### 图像输入

```http
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "What is in this image?"
          },
          {
            "type": "image_url",
            "image_url": {
              "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
            }
          }
        ]
      }
    ],
    "max_tokens": 300
  }'
```

#### 响应

```json
{
  "id": "chatcmpl-B9MHDbslfkBeAs8l4bebGdFOJ6PeG",
  "object": "chat.completion",
  "created": 1741570283,
  "model": "gpt-6-astra",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The image shows a wooden boardwalk path running through a lush green field or meadow. The sky is bright blue with some scattered clouds, giving the scene a serene and peaceful atmosphere. Trees and shrubs are visible in the background.",
        "refusal": null,
        "annotations": []
      },
      "logprobs": null,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 1117,
    "completion_tokens": 46,
    "total_tokens": 1163,
    "prompt_tokens_details": {
      "cached_tokens": 0,
      "audio_tokens": 0
    },
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "audio_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  },
  "service_tier": "default"
}
```

### 对数概率

```http
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-sol",
    "messages": [
      {
        "role": "user",
        "content": "Hello!"
      }
    ],
    "reasoning_effort": "none",
    "logprobs": true,
    "top_logprobs": 2
  }'
```

#### 响应

```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1702685778,
  "model": "gpt-6-sol",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I assist you today?"
      },
      "logprobs": {
        "content": [
          {
            "token": "Hello",
            "logprob": -0.31725305,
            "bytes": [72, 101, 108, 108, 111],
            "top_logprobs": [
              {
                "token": "Hello",
                "logprob": -0.31725305,
                "bytes": [72, 101, 108, 108, 111]
              },
              {
                "token": "Hi",
                "logprob": -1.3190403,
                "bytes": [72, 105]
              }
            ]
          },
          {
            "token": "!",
            "logprob": -0.02380986,
            "bytes": [
              33
            ],
            "top_logprobs": [
              {
                "token": "!",
                "logprob": -0.02380986,
                "bytes": [33]
              },
              {
                "token": " there",
                "logprob": -3.787621,
                "bytes": [32, 116, 104, 101, 114, 101]
              }
            ]
          },
          {
            "token": " How",
            "logprob": -0.000054669687,
            "bytes": [32, 72, 111, 119],
            "top_logprobs": [
              {
                "token": " How",
                "logprob": -0.000054669687,
                "bytes": [32, 72, 111, 119]
              },
              {
                "token": "<|end|>",
                "logprob": -10.953937,
                "bytes": null
              }
            ]
          },
          {
            "token": " can",
            "logprob": -0.015801601,
            "bytes": [32, 99, 97, 110],
            "top_logprobs": [
              {
                "token": " can",
                "logprob": -0.015801601,
                "bytes": [32, 99, 97, 110]
              },
              {
                "token": " may",
                "logprob": -4.161023,
                "bytes": [32, 109, 97, 121]
              }
            ]
          },
          {
            "token": " I",
            "logprob": -3.7697225e-6,
            "bytes": [
              32,
              73
            ],
            "top_logprobs": [
              {
                "token": " I",
                "logprob": -3.7697225e-6,
                "bytes": [32, 73]
              },
              {
                "token": " assist",
                "logprob": -13.596657,
                "bytes": [32, 97, 115, 115, 105, 115, 116]
              }
            ]
          },
          {
            "token": " assist",
            "logprob": -0.04571125,
            "bytes": [32, 97, 115, 115, 105, 115, 116],
            "top_logprobs": [
              {
                "token": " assist",
                "logprob": -0.04571125,
                "bytes": [32, 97, 115, 115, 105, 115, 116]
              },
              {
                "token": " help",
                "logprob": -3.1089056,
                "bytes": [32, 104, 101, 108, 112]
              }
            ]
          },
          {
            "token": " you",
            "logprob": -5.4385737e-6,
            "bytes": [32, 121, 111, 117],
            "top_logprobs": [
              {
                "token": " you",
                "logprob": -5.4385737e-6,
                "bytes": [32, 121, 111, 117]
              },
              {
                "token": " today",
                "logprob": -12.807695,
                "bytes": [32, 116, 111, 100, 97, 121]
              }
            ]
          },
          {
            "token": " today",
            "logprob": -0.0040071653,
            "bytes": [32, 116, 111, 100, 97, 121],
            "top_logprobs": [
              {
                "token": " today",
                "logprob": -0.0040071653,
                "bytes": [32, 116, 111, 100, 97, 121]
              },
              {
                "token": "?",
                "logprob": -5.5247097,
                "bytes": [63]
              }
            ]
          },
          {
            "token": "?",
            "logprob": -0.0008108172,
            "bytes": [63],
            "top_logprobs": [
              {
                "token": "?",
                "logprob": -0.0008108172,
                "bytes": [63]
              },
              {
                "token": "?\n",
                "logprob": -7.184561,
                "bytes": [63, 10]
              }
            ]
          }
        ],
        "refusal": null
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 9,
    "total_tokens": 18,
    "completion_tokens_details": {
      "reasoning_tokens": 0,
      "accepted_prediction_tokens": 0,
      "rejected_prediction_tokens": 0
    }
  }
}
```

### 流式传输

```http
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "messages": [
      {
        "role": "developer",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Hello!"
      }
    ],
    "stream": true
  }'
```

#### 响应

```json
data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-6-astra", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"role":"assistant","content":""},"logprobs":null,"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-6-astra", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"content":"Hello"},"logprobs":null,"finish_reason":null}]}

: Intermediate chat completion chunks omitted.

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-6-astra", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{},"logprobs":null,"finish_reason":"stop"}]}

data: [DONE]

```

## 删除聊天补全

**delete** `/chat/completions/{completion_id}`

删除已存储的 Chat Completions。仅当 Chat Completions 在创建时设置了
参数方可删除。 `store` 参数方可删除。 `true` 参数方可删除。

### 路径参数

- `completion_id: string`

### 返回

- `ChatCompletionDeleted object { id, deleted, object }`

  - `id: string`

    被删除的聊天补全的 ID。

  - `deleted: boolean`

    聊天补全是否已被删除。

  - `object: "chat.completion.deleted"`

    被删除对象的类型。

    - `"chat.completion.deleted"`

### 示例

```http
curl https://api.openai.com/v1/chat/completions/$COMPLETION_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "chat.completion.deleted"
}
```

### 示例

```http
curl -X DELETE https://api.openai.com/v1/chat/completions/chat_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### 响应

```json
{
  "object": "chat.completion.deleted",
  "id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
  "deleted": true
}
```

## 列出 Chat Completions

**get** `/chat/completions`

列出已存储的 Chat Completions。仅返回已通过
存储的 Chat Completions。 `store` 参数方可删除。 `true` 才会被返回。

### 查询参数

- `after: optional string`

  上一次分页请求中最后一个聊天补全的标识符。

- `limit: optional number`

  要检索的 Chat Completions 数量。

- `metadata: optional Metadata or null`

  用于按元数据键筛选 Chat Completions 的键列表。示例：

  `metadata[key1]=value1&metadata[key2]=value2`

- `model: optional string`

  用于生成 Chat Completions 的模型。

- `order: optional "asc" or "desc"`

  按时间戳对 Chat Completions 排序的顺序。使用 `asc` 表示升序，或 `desc` 表示降序。默认为 `asc`.

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of ChatCompletion`

  一个由聊天补全对象组成的数组。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项的列表。如果 `n` 大于 1，则可以多于一个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成令牌的原因。该值将 `stop` ：模型遇到自然停止点或提供了停止序列时为，
      `length` ：达到请求中指定的最大令牌数时为，
      `content_filter` ：由于我们的内容过滤器标记而省略内容时为，
      `tool_calls` ：模型调用了工具时为 `function_call` （已弃用）：模型调用了函数时为。
      阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      该选项的日志概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        包含日志概率信息的消息内容令牌列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

        - `logprob: number`

          该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置上可能性最高的 token 列表及其对数概率。条目数量可能少于请求中指定的 `top_logprobs`.

          - `token: string`

            该令牌。

          - `bytes: array of number or null`

            一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

          - `logprob: number`

            该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含消息拒绝 token 及其对数概率信息的列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

        - `logprob: number`

          该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置上可能性最高的 token 列表及其对数概率。条目数量可能少于请求中指定的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        该消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注解（如适用），例如使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用第一个字符的索引。

          - `title: string`

            网络资源的标题。

          - `url: string`

            网络资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含来自模型的音频
        响应的相关数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式为请求中
          指定的格式。

        - `expires_at: number`

          此音频响应在服务端不再可用于多轮
          对话时的 Unix 时间戳（秒）。
          conversations.

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，并被替换为 `tool_calls`。模型生成的应被调用的函数的名称和参数。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。目前，仅有 `function` 类型。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          对模型创建的自定义工具的调用。

          - `id: string`

            工具调用的 ID。

          - `custom: object { input, name }`

            模型调用的自定义工具。

            - `input: string`

              模型生成的自定义工具调用的输入。

            - `name: string`

              要调用的自定义工具的名称。

          - `type: "custom"`

            工具的类型。始终为 `custom`.

            - `"custom"`

  - `created: number`

    创建该聊天补全时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于该聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对集合。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
    格式，以及通过 接口 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入与生成输出的审核结果（如果请求了
    completions 审核）。

    - `input: object { model, results, type }  or object { code, message, type }`

      针对请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        针对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，若输入被该类别标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到得分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （针对成功的审核结果）。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

    - `output: object { model, results, type }  or object { code, message, type }`

      对生成输出的内容审核。

      - `ModerationResults object { model, results, type }`

        针对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，若输入被该类别标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到得分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （针对成功的审核结果）。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的处理类型。

    - 如果设置为 'auto'，则该请求将使用在项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
    - 如果设置为 'default'，则该请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则该请求将使用 Flex Processing 服务层级进行处理。
    - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 请求中包含 `service_tier=fast` ，否则必填。 `service_tier=priority` 参数。响应中会显示 `service_tier=priority` ，无论你是否在请求中指定 `service_tier=fast` ，否则必填。 `priority` 。
    - 当未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体将包含基于实际用于处理该请求的处理模式得出的 `service_tier` 值。该响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    该指纹表示模型运行所采用的后端配置。

    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    该补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数。

    - `prompt_tokens: number`

      提示词中的 token 数。

    - `total_tokens: number`

      请求中使用的 token 总数（提示词 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        出现在补全中的预测部分所对应的 token 数。

      - `audio_tokens: optional number`

        模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        模型为推理生成的 token。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全中的预测部分。然而，与
        推理 token 类似，这些 token 仍会计入用于计费、输出和上下文窗口
        限制统计的总补全 token 数中。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的、未调整过的提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的已缓存 token。

      - `image_tokens: optional number`

        提示中存在的图像输入 token。

      - `text_tokens: optional number`

        提示中存在的文本输入 token。

- `first_id: string`

  数据数组中第一个聊天补全的标识符。

- `has_more: boolean`

  指示是否还有更多可用的 Chat Completions。

- `last_id: string`

  数据数组中最后一个聊天补全的标识符。

- `object: "list"`

  此对象的类型，始终设置为 "list"。

  - `"list"`

### 示例

```http
curl https://api.openai.com/v1/chat/completions \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "choices": [
        {
          "finish_reason": "stop",
          "index": 0,
          "logprobs": {
            "content": [
              {
                "token": "token",
                "bytes": [
                  0
                ],
                "logprob": 0,
                "top_logprobs": [
                  {
                    "token": "token",
                    "bytes": [
                      0
                    ],
                    "logprob": 0
                  }
                ]
              }
            ],
            "refusal": [
              {
                "token": "token",
                "bytes": [
                  0
                ],
                "logprob": 0,
                "top_logprobs": [
                  {
                    "token": "token",
                    "bytes": [
                      0
                    ],
                    "logprob": 0
                  }
                ]
              }
            ]
          },
          "message": {
            "content": "content",
            "refusal": "refusal",
            "role": "assistant",
            "annotations": [
              {
                "type": "url_citation",
                "url_citation": {
                  "end_index": 0,
                  "start_index": 0,
                  "title": "title",
                  "url": "https://example.com"
                }
              }
            ],
            "audio": {
              "id": "id",
              "data": "data",
              "expires_at": 0,
              "transcript": "transcript"
            },
            "function_call": {
              "arguments": "arguments",
              "name": "name"
            },
            "tool_calls": [
              {
                "id": "id",
                "function": {
                  "arguments": "arguments",
                  "name": "name"
                },
                "type": "function"
              }
            ]
          }
        }
      ],
      "created": 0,
      "model": "model",
      "object": "chat.completion",
      "metadata": {
        "foo": "string"
      },
      "moderation": {
        "input": {
          "model": "model",
          "results": [
            {
              "categories": {
                "foo": true
              },
              "category_applied_input_types": {
                "foo": [
                  "text"
                ]
              },
              "category_scores": {
                "foo": 0
              },
              "flagged": true,
              "model": "model",
              "type": "moderation_result"
            }
          ],
          "type": "moderation_results"
        },
        "output": {
          "model": "model",
          "results": [
            {
              "categories": {
                "foo": true
              },
              "category_applied_input_types": {
                "foo": [
                  "text"
                ]
              },
              "category_scores": {
                "foo": 0
              },
              "flagged": true,
              "model": "model",
              "type": "moderation_result"
            }
          ],
          "type": "moderation_results"
        }
      },
      "service_tier": "auto",
      "system_fingerprint": "system_fingerprint",
      "usage": {
        "completion_tokens": 0,
        "prompt_tokens": 0,
        "total_tokens": 0,
        "completion_tokens_details": {
          "accepted_prediction_tokens": 0,
          "audio_tokens": 0,
          "reasoning_tokens": 0,
          "rejected_prediction_tokens": 0,
          "text_tokens": 0
        },
        "prompt_tokens_details": {
          "audio_tokens": 0,
          "cache_write_tokens": 0,
          "cached_tokens": 0,
          "image_tokens": 0,
          "text_tokens": 0
        }
      }
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id",
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "object": "chat.completion",
      "id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
      "model": "gpt-6-astra",
      "created": 1738960610,
      "request_id": "req_ded8ab984ec4bf840f37566c1011c417",
      "tool_choice": null,
      "usage": {
        "total_tokens": 31,
        "completion_tokens": 18,
        "prompt_tokens": 13
      },
      "seed": 4944116822809979520,
      "top_p": 1.0,
      "temperature": 1.0,
      "presence_penalty": 0.0,
      "frequency_penalty": 0.0,
      "system_fingerprint": "fp_50cad350e4",
      "input_user": null,
      "service_tier": "default",
      "tools": null,
      "metadata": {},
      "choices": [
        {
          "index": 0,
          "message": {
            "content": "Mind of circuits hum,  \nLearning patterns in silence—  \nFuture's quiet spark.",
            "role": "assistant",
            "tool_calls": null,
            "function_call": null
          },
          "finish_reason": "stop",
          "logprobs": null
        }
      ],
      "response_format": null
    }
  ],
  "first_id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
  "last_id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
  "has_more": false
}
```

## 获取聊天补全

**get** `/chat/completions/{completion_id}`

获取已存储的聊天补全。仅获取已创建的 Chat Completions
存储的 Chat Completions。 `store` 参数方可删除。 `true` 才会被返回。

### 路径参数

- `completion_id: string`

### 返回

- `ChatCompletion object { id, choices, created, 7 more }`

  表示由模型根据所提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项的列表。如果 `n` 大于 1，则可以多于一个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成令牌的原因。该值将 `stop` ：模型遇到自然停止点或提供了停止序列时为，
      `length` ：达到请求中指定的最大令牌数时为，
      `content_filter` ：由于我们的内容过滤器标记而省略内容时为，
      `tool_calls` ：模型调用了工具时为 `function_call` （已弃用）：模型调用了函数时为。
      阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      该选项的日志概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        包含日志概率信息的消息内容令牌列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

        - `logprob: number`

          该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置上可能性最高的 token 列表及其对数概率。条目数量可能少于请求中指定的 `top_logprobs`.

          - `token: string`

            该令牌。

          - `bytes: array of number or null`

            一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

          - `logprob: number`

            该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含消息拒绝 token 及其对数概率信息的列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

        - `logprob: number`

          该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置上可能性最高的 token 列表及其对数概率。条目数量可能少于请求中指定的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        该消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注解（如适用），例如使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用第一个字符的索引。

          - `title: string`

            网络资源的标题。

          - `url: string`

            网络资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含来自模型的音频
        响应的相关数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式为请求中
          指定的格式。

        - `expires_at: number`

          此音频响应在服务端不再可用于多轮
          对话时的 Unix 时间戳（秒）。
          conversations.

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，并被替换为 `tool_calls`。模型生成的应被调用的函数的名称和参数。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。目前，仅有 `function` 类型。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          对模型创建的自定义工具的调用。

          - `id: string`

            工具调用的 ID。

          - `custom: object { input, name }`

            模型调用的自定义工具。

            - `input: string`

              模型生成的自定义工具调用的输入。

            - `name: string`

              要调用的自定义工具的名称。

          - `type: "custom"`

            工具的类型。始终为 `custom`.

            - `"custom"`

  - `created: number`

    创建该聊天补全时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于该聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对集合。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
    格式，以及通过 接口 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入与生成输出的审核结果（如果请求了
    completions 审核）。

    - `input: object { model, results, type }  or object { code, message, type }`

      针对请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        针对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，若输入被该类别标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到得分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （针对成功的审核结果）。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

    - `output: object { model, results, type }  or object { code, message, type }`

      对生成输出的内容审核。

      - `ModerationResults object { model, results, type }`

        针对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，若输入被该类别标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到得分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （针对成功的审核结果）。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的处理类型。

    - 如果设置为 'auto'，则该请求将使用在项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
    - 如果设置为 'default'，则该请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则该请求将使用 Flex Processing 服务层级进行处理。
    - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 请求中包含 `service_tier=fast` ，否则必填。 `service_tier=priority` 参数。响应中会显示 `service_tier=priority` ，无论你是否在请求中指定 `service_tier=fast` ，否则必填。 `priority` 。
    - 当未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体将包含基于实际用于处理该请求的处理模式得出的 `service_tier` 值。该响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    该指纹表示模型运行所采用的后端配置。

    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    该补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数。

    - `prompt_tokens: number`

      提示词中的 token 数。

    - `total_tokens: number`

      请求中使用的 token 总数（提示词 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        出现在补全中的预测部分所对应的 token 数。

      - `audio_tokens: optional number`

        模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        模型为推理生成的 token。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全中的预测部分。然而，与
        推理 token 类似，这些 token 仍会计入用于计费、输出和上下文窗口
        限制统计的总补全 token 数中。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的、未调整过的提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的已缓存 token。

      - `image_tokens: optional number`

        提示中存在的图像输入 token。

      - `text_tokens: optional number`

        提示中存在的文本输入 token。

### 示例

```http
curl https://api.openai.com/v1/chat/completions/$COMPLETION_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "logprobs": {
        "content": [
          {
            "token": "token",
            "bytes": [
              0
            ],
            "logprob": 0,
            "top_logprobs": [
              {
                "token": "token",
                "bytes": [
                  0
                ],
                "logprob": 0
              }
            ]
          }
        ],
        "refusal": [
          {
            "token": "token",
            "bytes": [
              0
            ],
            "logprob": 0,
            "top_logprobs": [
              {
                "token": "token",
                "bytes": [
                  0
                ],
                "logprob": 0
              }
            ]
          }
        ]
      },
      "message": {
        "content": "content",
        "refusal": "refusal",
        "role": "assistant",
        "annotations": [
          {
            "type": "url_citation",
            "url_citation": {
              "end_index": 0,
              "start_index": 0,
              "title": "title",
              "url": "https://example.com"
            }
          }
        ],
        "audio": {
          "id": "id",
          "data": "data",
          "expires_at": 0,
          "transcript": "transcript"
        },
        "function_call": {
          "arguments": "arguments",
          "name": "name"
        },
        "tool_calls": [
          {
            "id": "id",
            "function": {
              "arguments": "arguments",
              "name": "name"
            },
            "type": "function"
          }
        ]
      }
    }
  ],
  "created": 0,
  "model": "model",
  "object": "chat.completion",
  "metadata": {
    "foo": "string"
  },
  "moderation": {
    "input": {
      "model": "model",
      "results": [
        {
          "categories": {
            "foo": true
          },
          "category_applied_input_types": {
            "foo": [
              "text"
            ]
          },
          "category_scores": {
            "foo": 0
          },
          "flagged": true,
          "model": "model",
          "type": "moderation_result"
        }
      ],
      "type": "moderation_results"
    },
    "output": {
      "model": "model",
      "results": [
        {
          "categories": {
            "foo": true
          },
          "category_applied_input_types": {
            "foo": [
              "text"
            ]
          },
          "category_scores": {
            "foo": 0
          },
          "flagged": true,
          "model": "model",
          "type": "moderation_result"
        }
      ],
      "type": "moderation_results"
    }
  },
  "service_tier": "auto",
  "system_fingerprint": "system_fingerprint",
  "usage": {
    "completion_tokens": 0,
    "prompt_tokens": 0,
    "total_tokens": 0,
    "completion_tokens_details": {
      "accepted_prediction_tokens": 0,
      "audio_tokens": 0,
      "reasoning_tokens": 0,
      "rejected_prediction_tokens": 0,
      "text_tokens": 0
    },
    "prompt_tokens_details": {
      "audio_tokens": 0,
      "cache_write_tokens": 0,
      "cached_tokens": 0,
      "image_tokens": 0,
      "text_tokens": 0
    }
  }
}
```

### 示例

```http
curl https://api.openai.com/v1/chat/completions/chatcmpl-abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### 响应

```json
{
  "object": "chat.completion",
  "id": "chatcmpl-abc123",
  "model": "gpt-6-astra",
  "created": 1738960610,
  "request_id": "req_ded8ab984ec4bf840f37566c1011c417",
  "tool_choice": null,
  "usage": {
    "total_tokens": 31,
    "completion_tokens": 18,
    "prompt_tokens": 13
  },
  "seed": 4944116822809979520,
  "top_p": 1.0,
  "temperature": 1.0,
  "presence_penalty": 0.0,
  "frequency_penalty": 0.0,
  "system_fingerprint": "fp_50cad350e4",
  "input_user": null,
  "service_tier": "default",
  "tools": null,
  "metadata": {},
  "choices": [
    {
      "index": 0,
      "message": {
        "content": "Mind of circuits hum,  \nLearning patterns in silence—  \nFuture's quiet spark.",
        "role": "assistant",
        "tool_calls": null,
        "function_call": null
      },
      "finish_reason": "stop",
      "logprobs": null
    }
  ],
  "response_format": null
}
```

## Update chat completion

**post** `/chat/completions/{completion_id}`

修改已存储的 Chat Completions。仅限已
参数方可删除。 `store` 参数方可删除。 `true` 可以进行修改。目前，
唯一支持的修改是更新 `metadata` 字段。

### 路径参数

- `completion_id: string`

### 请求体参数

- `metadata: Metadata or null`

  可附加到对象的 16 个键值对集合。可用于
  以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
  格式，以及通过 接口 或仪表板查询对象。

  键为字符串，最大长度为 64 个字符。值为字符串，
  最大长度为 512 个字符。

### 返回

- `ChatCompletion object { id, choices, created, 7 more }`

  表示由模型根据所提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项的列表。如果 `n` 大于 1，则可以多于一个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成令牌的原因。该值将 `stop` ：模型遇到自然停止点或提供了停止序列时为，
      `length` ：达到请求中指定的最大令牌数时为，
      `content_filter` ：由于我们的内容过滤器标记而省略内容时为，
      `tool_calls` ：模型调用了工具时为 `function_call` （已弃用）：模型调用了函数时为。
      阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      该选项的日志概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        包含日志概率信息的消息内容令牌列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

        - `logprob: number`

          该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置上可能性最高的 token 列表及其对数概率。条目数量可能少于请求中指定的 `top_logprobs`.

          - `token: string`

            该令牌。

          - `bytes: array of number or null`

            一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

          - `logprob: number`

            该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含消息拒绝 token 及其对数概率信息的列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

        - `logprob: number`

          该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置上可能性最高的 token 列表及其对数概率。条目数量可能少于请求中指定的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        该消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注解（如适用），例如使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用第一个字符的索引。

          - `title: string`

            网络资源的标题。

          - `url: string`

            网络资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含来自模型的音频
        响应的相关数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式为请求中
          指定的格式。

        - `expires_at: number`

          此音频响应在服务端不再可用于多轮
          对话时的 Unix 时间戳（秒）。
          conversations.

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，并被替换为 `tool_calls`。模型生成的应被调用的函数的名称和参数。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。目前，仅有 `function` 类型。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          对模型创建的自定义工具的调用。

          - `id: string`

            工具调用的 ID。

          - `custom: object { input, name }`

            模型调用的自定义工具。

            - `input: string`

              模型生成的自定义工具调用的输入。

            - `name: string`

              要调用的自定义工具的名称。

          - `type: "custom"`

            工具的类型。始终为 `custom`.

            - `"custom"`

  - `created: number`

    创建该聊天补全时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于该聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对集合。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
    格式，以及通过 接口 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入与生成输出的审核结果（如果请求了
    completions 审核）。

    - `input: object { model, results, type }  or object { code, message, type }`

      针对请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        针对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，若输入被该类别标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到得分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （针对成功的审核结果）。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

    - `output: object { model, results, type }  or object { code, message, type }`

      对生成输出的内容审核。

      - `ModerationResults object { model, results, type }`

        针对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，若输入被该类别标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到得分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （针对成功的审核结果）。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的处理类型。

    - 如果设置为 'auto'，则该请求将使用在项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
    - 如果设置为 'default'，则该请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则该请求将使用 Flex Processing 服务层级进行处理。
    - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 请求中包含 `service_tier=fast` ，否则必填。 `service_tier=priority` 参数。响应中会显示 `service_tier=priority` ，无论你是否在请求中指定 `service_tier=fast` ，否则必填。 `priority` 。
    - 当未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体将包含基于实际用于处理该请求的处理模式得出的 `service_tier` 值。该响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    该指纹表示模型运行所采用的后端配置。

    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    该补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数。

    - `prompt_tokens: number`

      提示词中的 token 数。

    - `total_tokens: number`

      请求中使用的 token 总数（提示词 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        出现在补全中的预测部分所对应的 token 数。

      - `audio_tokens: optional number`

        模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        模型为推理生成的 token。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全中的预测部分。然而，与
        推理 token 类似，这些 token 仍会计入用于计费、输出和上下文窗口
        限制统计的总补全 token 数中。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的、未调整过的提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的已缓存 token。

      - `image_tokens: optional number`

        提示中存在的图像输入 token。

      - `text_tokens: optional number`

        提示中存在的文本输入 token。

### 示例

```http
curl https://api.openai.com/v1/chat/completions/$COMPLETION_ID \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "metadata": {
            "foo": "string"
          }
        }'
```

#### 响应

```json
{
  "id": "id",
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "logprobs": {
        "content": [
          {
            "token": "token",
            "bytes": [
              0
            ],
            "logprob": 0,
            "top_logprobs": [
              {
                "token": "token",
                "bytes": [
                  0
                ],
                "logprob": 0
              }
            ]
          }
        ],
        "refusal": [
          {
            "token": "token",
            "bytes": [
              0
            ],
            "logprob": 0,
            "top_logprobs": [
              {
                "token": "token",
                "bytes": [
                  0
                ],
                "logprob": 0
              }
            ]
          }
        ]
      },
      "message": {
        "content": "content",
        "refusal": "refusal",
        "role": "assistant",
        "annotations": [
          {
            "type": "url_citation",
            "url_citation": {
              "end_index": 0,
              "start_index": 0,
              "title": "title",
              "url": "https://example.com"
            }
          }
        ],
        "audio": {
          "id": "id",
          "data": "data",
          "expires_at": 0,
          "transcript": "transcript"
        },
        "function_call": {
          "arguments": "arguments",
          "name": "name"
        },
        "tool_calls": [
          {
            "id": "id",
            "function": {
              "arguments": "arguments",
              "name": "name"
            },
            "type": "function"
          }
        ]
      }
    }
  ],
  "created": 0,
  "model": "model",
  "object": "chat.completion",
  "metadata": {
    "foo": "string"
  },
  "moderation": {
    "input": {
      "model": "model",
      "results": [
        {
          "categories": {
            "foo": true
          },
          "category_applied_input_types": {
            "foo": [
              "text"
            ]
          },
          "category_scores": {
            "foo": 0
          },
          "flagged": true,
          "model": "model",
          "type": "moderation_result"
        }
      ],
      "type": "moderation_results"
    },
    "output": {
      "model": "model",
      "results": [
        {
          "categories": {
            "foo": true
          },
          "category_applied_input_types": {
            "foo": [
              "text"
            ]
          },
          "category_scores": {
            "foo": 0
          },
          "flagged": true,
          "model": "model",
          "type": "moderation_result"
        }
      ],
      "type": "moderation_results"
    }
  },
  "service_tier": "auto",
  "system_fingerprint": "system_fingerprint",
  "usage": {
    "completion_tokens": 0,
    "prompt_tokens": 0,
    "total_tokens": 0,
    "completion_tokens_details": {
      "accepted_prediction_tokens": 0,
      "audio_tokens": 0,
      "reasoning_tokens": 0,
      "rejected_prediction_tokens": 0,
      "text_tokens": 0
    },
    "prompt_tokens_details": {
      "audio_tokens": 0,
      "cache_write_tokens": 0,
      "cached_tokens": 0,
      "image_tokens": 0,
      "text_tokens": 0
    }
  }
}
```

### 示例

```http
curl -X POST https://api.openai.com/v1/chat/completions/chat_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"metadata": {"foo": "bar"}}'
```

#### 响应

```json
{
  "object": "chat.completion",
  "id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2",
  "model": "gpt-6-astra",
  "created": 1738960610,
  "request_id": "req_ded8ab984ec4bf840f37566c1011c417",
  "tool_choice": null,
  "usage": {
    "total_tokens": 31,
    "completion_tokens": 18,
    "prompt_tokens": 13
  },
  "seed": 4944116822809979520,
  "top_p": 1.0,
  "temperature": 1.0,
  "presence_penalty": 0.0,
  "frequency_penalty": 0.0,
  "system_fingerprint": "fp_50cad350e4",
  "input_user": null,
  "service_tier": "default",
  "tools": null,
  "metadata": {
    "foo": "bar"
  },
  "choices": [
    {
      "index": 0,
      "message": {
        "content": "Mind of circuits hum,  \nLearning patterns in silence—  \nFuture's quiet spark.",
        "role": "assistant",
        "tool_calls": null,
        "function_call": null
      },
      "finish_reason": "stop",
      "logprobs": null
    }
  ],
  "response_format": null
}
```

## 域类型

### 聊天完成允许工具

- `ChatCompletionAllowedTools object { mode, tools }`

  将模型可用的工具限制为预定义的集合。

  - `mode: "auto" or "required"`

    将模型可用的工具限制为预定义的集合。

    `auto` 允许模型从允许的工具中选择并生成一条
    消息。

    `required` 要求模型调用一个或多个允许的工具。

    - `"auto"`

    - `"required"`

  - `tools: array of map[unknown]`

    模型应被允许调用的工具定义列表。

    对于 Chat Completions API，工具定义列表可能如下所示：

    ```json
    [
      { "type": "function", "function": { "name": "get_weather" } },
      { "type": "function", "function": { "name": "get_time" } }
    ]
    ```

### 聊天完成

- `ChatCompletion object { id, choices, created, 7 more }`

  表示由模型根据所提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项的列表。如果 `n` 大于 1，则可以多于一个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成令牌的原因。该值将 `stop` ：模型遇到自然停止点或提供了停止序列时为，
      `length` ：达到请求中指定的最大令牌数时为，
      `content_filter` ：由于我们的内容过滤器标记而省略内容时为，
      `tool_calls` ：模型调用了工具时为 `function_call` （已弃用）：模型调用了函数时为。
      阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      该选项的日志概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        包含日志概率信息的消息内容令牌列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

        - `logprob: number`

          该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置上可能性最高的 token 列表及其对数概率。条目数量可能少于请求中指定的 `top_logprobs`.

          - `token: string`

            该令牌。

          - `bytes: array of number or null`

            一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

          - `logprob: number`

            该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含消息拒绝 token 及其对数概率信息的列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

        - `logprob: number`

          该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置上可能性最高的 token 列表及其对数概率。条目数量可能少于请求中指定的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        该消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注解（如适用），例如使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用第一个字符的索引。

          - `title: string`

            网络资源的标题。

          - `url: string`

            网络资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含来自模型的音频
        响应的相关数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式为请求中
          指定的格式。

        - `expires_at: number`

          此音频响应在服务端不再可用于多轮
          对话时的 Unix 时间戳（秒）。
          conversations.

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，并被替换为 `tool_calls`。模型生成的应被调用的函数的名称和参数。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。目前，仅有 `function` 类型。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          对模型创建的自定义工具的调用。

          - `id: string`

            工具调用的 ID。

          - `custom: object { input, name }`

            模型调用的自定义工具。

            - `input: string`

              模型生成的自定义工具调用的输入。

            - `name: string`

              要调用的自定义工具的名称。

          - `type: "custom"`

            工具的类型。始终为 `custom`.

            - `"custom"`

  - `created: number`

    创建该聊天补全时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于该聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对集合。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
    格式，以及通过 接口 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入与生成输出的审核结果（如果请求了
    completions 审核）。

    - `input: object { model, results, type }  or object { code, message, type }`

      针对请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        针对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，若输入被该类别标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到得分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （针对成功的审核结果）。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

    - `output: object { model, results, type }  or object { code, message, type }`

      对生成输出的内容审核。

      - `ModerationResults object { model, results, type }`

        针对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，若输入被该类别标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到得分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （针对成功的审核结果）。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的处理类型。

    - 如果设置为 'auto'，则该请求将使用在项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
    - 如果设置为 'default'，则该请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则该请求将使用 Flex Processing 服务层级进行处理。
    - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 请求中包含 `service_tier=fast` ，否则必填。 `service_tier=priority` 参数。响应中会显示 `service_tier=priority` ，无论你是否在请求中指定 `service_tier=fast` ，否则必填。 `priority` 。
    - 当未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体将包含基于实际用于处理该请求的处理模式得出的 `service_tier` 值。该响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    该指纹表示模型运行所采用的后端配置。

    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    该补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数。

    - `prompt_tokens: number`

      提示词中的 token 数。

    - `total_tokens: number`

      请求中使用的 token 总数（提示词 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        出现在补全中的预测部分所对应的 token 数。

      - `audio_tokens: optional number`

        模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        模型为推理生成的 token。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全中的预测部分。然而，与
        推理 token 类似，这些 token 仍会计入用于计费、输出和上下文窗口
        限制统计的总补全 token 数中。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的、未调整过的提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的已缓存 token。

      - `image_tokens: optional number`

        提示中存在的图像输入 token。

      - `text_tokens: optional number`

        提示中存在的文本输入 token。

### 聊天完成允许工具选择

- `ChatCompletionAllowedToolChoice object { allowed_tools, type }`

  将模型可用的工具限制为预定义的集合。

  - `allowed_tools: ChatCompletionAllowedTools`

    将模型可用的工具限制为预定义的集合。

    - `mode: "auto" or "required"`

      将模型可用的工具限制为预定义的集合。

      `auto` 允许模型从允许的工具中选择并生成一条
      消息。

      `required` 要求模型调用一个或多个允许的工具。

      - `"auto"`

      - `"required"`

    - `tools: array of map[unknown]`

      模型应被允许调用的工具定义列表。

      对于 Chat Completions API，工具定义列表可能如下所示：

      ```json
      [
        { "type": "function", "function": { "name": "get_weather" } },
        { "type": "function", "function": { "name": "get_time" } }
      ]
      ```

  - `type: "allowed_tools"`

    允许的工具配置类型。始终为 `allowed_tools`.

    - `"allowed_tools"`

### 聊天完成助手消息参数

- `ChatCompletionAssistantMessageParam object { role, audio, content, 4 more }`

  模型针对用户消息发送的消息。

  - `role: "assistant"`

    消息作者的角色，本例中为 `assistant`.

    - `"assistant"`

  - `audio: optional object { id }  or null`

    模型先前的音频响应相关的数据。
    [了解更多](/api/docs/guides/audio).

    - `id: string`

      模型先前音频响应的唯一标识符。

  - `content: optional string or array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal or null`

    助手消息的内容。除非指定了 `tool_calls` ，否则必填。 `function_call` 。

    - `TextContent = string`

      助手消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal`

      具有指定类型的内容分块数组。可以是以下类型的一个或多个 `text`，或以下类型中的恰好一个 `refusal`.

      - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

        了解 [文本输入](/api/docs/guides/text).

        - `text: string`

          文本内容。

        - `type: "text"`

          内容分块的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ChatCompletionContentPartRefusal object { refusal, type }`

        - `refusal: string`

          模型生成的拒绝消息。

        - `type: "refusal"`

          内容分块的类型。

          - `"refusal"`

  - `function_call: optional object { arguments, name }  or null`

    已弃用，并被替换为 `tool_calls`。模型生成的应被调用的函数的名称和参数。

    - `arguments: string`

      调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

    - `name: string`

      要调用的函数名称。

  - `name: optional string`

    参与者的可选名称。为模型提供信息，用于区分同一角色的不同参与者。

  - `refusal: optional string or null`

    助手给出的拒绝消息。

  - `tool_calls: optional array of ChatCompletionMessageToolCall`

    模型生成的工具调用，例如函数调用。

    - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

      对模型创建的函数工具的调用。

      - `id: string`

        工具调用的 ID。

      - `function: object { arguments, name }`

        模型调用的函数。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `type: "function"`

        工具的类型。目前，仅有 `function` 类型。

        - `"function"`

    - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

      对模型创建的自定义工具的调用。

      - `id: string`

        工具调用的 ID。

      - `custom: object { input, name }`

        模型调用的自定义工具。

        - `input: string`

          模型生成的自定义工具调用的输入。

        - `name: string`

          要调用的自定义工具的名称。

      - `type: "custom"`

        工具的类型。始终为 `custom`.

        - `"custom"`

### 聊天完成音频

- `ChatCompletionAudio object { id, data, expires_at, transcript }`

  如果请求了音频输出模态，则此对象包含来自模型的音频
  响应的相关数据。 [了解更多](/api/docs/guides/audio).

  - `id: string`

    此音频响应的唯一标识符。

  - `data: string`

    由模型生成的 Base64 编码音频字节，格式为请求中
    指定的格式。

  - `expires_at: number`

    此音频响应在服务端不再可用于多轮
    对话时的 Unix 时间戳（秒）。
    conversations.

  - `transcript: string`

    模型生成的音频转录文本。

### 聊天完成音频参数

- `ChatCompletionAudioParam object { format, voice }`

  音频输出的参数。在使用以下方式请求音频输出时为必填项
  `modalities: ["audio"]`. [了解更多](/api/docs/guides/audio).

  - `format: "wav" or "aac" or "mp3" or 3 more`

    指定输出音频格式。必须是以下之一 `wav`, `mp3`, `flac`,
    `opus`，或 `pcm16`.

    - `"wav"`

    - `"aac"`

    - `"mp3"`

    - `"flac"`

    - `"opus"`

    - `"pcm16"`

  - `voice: string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

    模型用于响应的声音。支持的内置声音包括
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `nova`, `onyx`,
    `sage`, `shimmer`, `marin`，和 `cedar`。你也可以提供一个
    带有以下字段的自定义声音对象 `id`，例如 `{ "id": "voice_1234" }`.

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

      自定义声音引用。

      - `id: string`

        自定义声音 ID，例如 `voice_1234`.

### 聊天完成分块

- `ChatCompletionChunk object { id, choices, created, 7 more }`

  表示模型根据所提供输入返回的聊天补全响应的流式分块
  。
  [了解更多](/api/docs/guides/streaming-responses).

  - `id: string`

    聊天补全的唯一标识符。每个分块具有相同的 ID。

  - `choices: array of object { delta, finish_reason, index, logprobs }`

    聊天补全选择的列表。如果 `n` 大于 1，则可以包含多个元素。如果设置了
    ，则最后一个分块也可以为空。 `stream_options: {"include_usage": true}`.

    - `delta: object { content, function_call, refusal, 2 more }`

      由流式模型响应生成的聊天补全增量。

      - `content: optional string or null`

        分块消息的内容。

      - `function_call: optional object { arguments, name }`

        已弃用，并被替换为 `tool_calls`。模型生成的应被调用的函数的名称和参数。

        - `arguments: optional string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

        - `name: optional string`

          要调用的函数名称。

      - `refusal: optional string or null`

        模型生成的拒绝消息。

      - `role: optional "developer" or "system" or "user" or 2 more`

        该消息作者的角色。

        - `"developer"`

        - `"system"`

        - `"user"`

        - `"assistant"`

        - `"tool"`

      - `tool_calls: optional array of object { index, id, function, type }`

        - `index: number`

        - `id: optional string`

          工具调用的 ID。

        - `function: optional object { arguments, name }`

          - `arguments: optional string`

            调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

          - `name: optional string`

            要调用的函数名称。

        - `type: optional "function"`

          工具的类型。目前，仅有 `function` 类型。

          - `"function"`

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more or null`

      模型停止生成令牌的原因。该值将 `stop` ：模型遇到自然停止点或提供了停止序列时为，
      `length` ：达到请求中指定的最大令牌数时为，
      `content_filter` ：由于我们的内容过滤器标记而省略内容时为，
      `tool_calls` ：模型调用了工具时为 `function_call` （已弃用）：模型调用了函数时为。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      选项在选项列表中的索引。

    - `logprobs: optional object { content, refusal }  or null`

      该选项的日志概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        包含日志概率信息的消息内容令牌列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

        - `logprob: number`

          该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置上可能性最高的 token 列表及其对数概率。条目数量可能少于请求中指定的 `top_logprobs`.

          - `token: string`

            该令牌。

          - `bytes: array of number or null`

            一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

          - `logprob: number`

            该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含消息拒绝 token 及其对数概率信息的列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

        - `logprob: number`

          该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置上可能性最高的 token 列表及其对数概率。条目数量可能少于请求中指定的 `top_logprobs`.

  - `created: number`

    聊天补全创建时的 Unix 时间戳（以秒为单位）。每个分块具有相同的时间戳。

  - `model: string`

    用于生成补全的模型。

  - `object: "chat.completion.chunk"`

    对象类型，始终为 `chat.completion.chunk`.

    - `"chat.completion.chunk"`

  - `moderation: optional object { input, output }  or null`

    针对请求输入和生成输出的审核结果。在请求了已审核补全时
    会出现在审核分块上。

    - `input: object { model, results, type }  or object { code, message, type }`

      针对请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        针对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，若输入被该类别标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到得分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （针对成功的审核结果）。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

    - `output: object { model, results, type }  or object { code, message, type }`

      对生成输出的内容审核。

      - `ModerationResults object { model, results, type }`

        针对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，若输入被该类别标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到得分的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （针对成功的审核结果）。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

  - `obfuscation: optional string`

    添加的混淆字符串，用于将流式分块的大小规范化，作为
    对某些侧信道攻击的缓解措施。该字段默认包含，
    在以下情况下省略 `stream_options.include_obfuscation` 为 `false`.

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的处理类型。

    - 如果设置为 'auto'，则该请求将使用在项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
    - 如果设置为 'default'，则该请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则该请求将使用 Flex Processing 服务层级进行处理。
    - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 请求中包含 `service_tier=fast` ，否则必填。 `service_tier=priority` 参数。响应中会显示 `service_tier=priority` ，无论你是否在请求中指定 `service_tier=fast` ，否则必填。 `priority` 。
    - 当未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体将包含基于实际用于处理该请求的处理模式得出的 `service_tier` 值。该响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行所用的后端配置。
    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage or null`

    一个可选字段，仅当你设置了
    `stream_options: {"include_usage": true}` 时才会出现在请求中。当出现时，它
    包含一个 null 值 **，最后一个分块除外** 其中包含整个请求的
    token 使用统计信息。

    **注意：** 如果流被中断或取消，你可能无法
    接收最终的用量数据块，其中包含本次请求的总 token 用量
    信息。

    - `completion_tokens: number`

      生成补全中的 token 数。

    - `prompt_tokens: number`

      提示词中的 token 数。

    - `total_tokens: number`

      请求中使用的 token 总数（提示词 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        出现在补全中的预测部分所对应的 token 数。

      - `audio_tokens: optional number`

        模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        模型为推理生成的 token。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全中的预测部分。然而，与
        推理 token 类似，这些 token 仍会计入用于计费、输出和上下文窗口
        限制统计的总补全 token 数中。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的、未调整过的提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的已缓存 token。

      - `image_tokens: optional number`

        提示中存在的图像输入 token。

      - `text_tokens: optional number`

        提示中存在的文本输入 token。

### Chat Completion Content Part

- `ChatCompletionContentPart = ChatCompletionContentPartText or ChatCompletionContentPartImage or ChatCompletionContentPartInputAudio or object { file, type, prompt_cache_breakpoint }`

  了解 [文本输入](/api/docs/guides/text).

  - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

    了解 [文本输入](/api/docs/guides/text).

    - `text: string`

      文本内容。

    - `type: "text"`

      内容分块的类型。

      - `"text"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

      - `mode: "explicit"`

        断点模式。始终为 `explicit`.

        - `"explicit"`

  - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

    了解 [图像输入](/api/docs/guides/images-vision).

    - `image_url: object { url, detail }`

      - `url: string`

        图像的 URL 或 base64 编码的图像数据。

      - `detail: optional "auto" or "low" or "high"`

        指定图像的细节级别。在 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

        - `"auto"`

        - `"low"`

        - `"high"`

    - `type: "image_url"`

      内容分块的类型。

      - `"image_url"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

      - `mode: "explicit"`

        断点模式。始终为 `explicit`.

        - `"explicit"`

  - `ChatCompletionContentPartInputAudio object { input_audio, type, prompt_cache_breakpoint }`

    了解 [音频输入](/api/docs/guides/audio).

    - `input_audio: object { data, format }`

      - `data: string`

        Base64 编码的音频数据。

      - `format: "wav" or "mp3"`

        编码音频数据的格式。目前支持 "wav" 和 "mp3"。

        - `"wav"`

        - `"mp3"`

    - `type: "input_audio"`

      内容部分的类型。始终为 `input_audio`.

      - `"input_audio"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

      - `mode: "explicit"`

        断点模式。始终为 `explicit`.

        - `"explicit"`

  - `FileContentPart object { file, type, prompt_cache_breakpoint }`

    了解 [文件输入](/api/docs/guides/text) 用于文本生成。

    - `file: object { file_data, file_id, filename }`

      - `file_data: optional string`

        Base64 编码的文件数据，在将文件以字符串形式传递给模型时使用
        。

      - `file_id: optional string`

        用作输入的上传文件 ID。

      - `filename: optional string`

        文件名，在将文件以字符串形式传递给模型时使用，
        。

    - `type: "file"`

      内容部分的类型。始终为 `file`.

      - `"file"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

      - `mode: "explicit"`

        断点模式。始终为 `explicit`.

        - `"explicit"`

### Chat Completion Content Part Image

- `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

  了解 [图像输入](/api/docs/guides/images-vision).

  - `image_url: object { url, detail }`

    - `url: string`

      图像的 URL 或 base64 编码的图像数据。

    - `detail: optional "auto" or "low" or "high"`

      指定图像的细节级别。在 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

      - `"auto"`

      - `"low"`

      - `"high"`

  - `type: "image_url"`

    内容分块的类型。

    - `"image_url"`

  - `prompt_cache_breakpoint: optional object { mode }`

    标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

    - `mode: "explicit"`

      断点模式。始终为 `explicit`.

      - `"explicit"`

### Chat Completion Content Part Input Audio

- `ChatCompletionContentPartInputAudio object { input_audio, type, prompt_cache_breakpoint }`

  了解 [音频输入](/api/docs/guides/audio).

  - `input_audio: object { data, format }`

    - `data: string`

      Base64 编码的音频数据。

    - `format: "wav" or "mp3"`

      编码音频数据的格式。目前支持 "wav" 和 "mp3"。

      - `"wav"`

      - `"mp3"`

  - `type: "input_audio"`

    内容部分的类型。始终为 `input_audio`.

    - `"input_audio"`

  - `prompt_cache_breakpoint: optional object { mode }`

    标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

    - `mode: "explicit"`

      断点模式。始终为 `explicit`.

      - `"explicit"`

### Chat Completion Content Part Refusal

- `ChatCompletionContentPartRefusal object { refusal, type }`

  - `refusal: string`

    模型生成的拒绝消息。

  - `type: "refusal"`

    内容分块的类型。

    - `"refusal"`

### Chat Completion Content Part Text

- `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

  了解 [文本输入](/api/docs/guides/text).

  - `text: string`

    文本内容。

  - `type: "text"`

    内容分块的类型。

    - `"text"`

  - `prompt_cache_breakpoint: optional object { mode }`

    标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

    - `mode: "explicit"`

      断点模式。始终为 `explicit`.

      - `"explicit"`

### Chat Completion Custom Tool

- `ChatCompletionCustomTool object { custom, type }`

  使用指定格式处理输入的自定义工具。

  - `custom: object { name, description, format }`

    自定义工具的属性。

    - `name: string`

      自定义工具的名称，用于在工具调用中标识它。

    - `description: optional string`

      自定义工具的可选描述，用于提供更多上下文。

    - `format: optional object { type }  or object { grammar, type }`

      自定义工具的输入格式。默认情况下为无约束文本。

      - `Text object { type }`

        无约束自由格式文本。

        - `type: "text"`

          无约束文本格式。始终为 `text`.

          - `"text"`

      - `Grammar object { grammar, type }`

        由用户定义的语法。

        - `grammar: object { definition, syntax }`

          你选择的语法。

          - `definition: string`

            语法定义。

          - `syntax: "lark" or "regex"`

            语法定义的语法格式。可选值之一： `lark` ，否则必填。 `regex`.

            - `"lark"`

            - `"regex"`

        - `type: "grammar"`

          语法格式。始终为 `grammar`.

          - `"grammar"`

  - `type: "custom"`

    自定义工具的类型。始终为 `custom`.

    - `"custom"`

### Chat Completion Deleted

- `ChatCompletionDeleted object { id, deleted, object }`

  - `id: string`

    被删除的聊天补全的 ID。

  - `deleted: boolean`

    聊天补全是否已被删除。

  - `object: "chat.completion.deleted"`

    被删除对象的类型。

    - `"chat.completion.deleted"`

### Chat Completion Developer Message Param

- `ChatCompletionDeveloperMessageParam object { content, role, name }`

  开发者提供的指令，模型应遵循这些指令，而不论用户发送了什么消息。对于 o1 及更新的
  模型，使用 developer 角色取代 system 角色。 `developer` messages
  替换之前的 `system` messages。

  - `content: string or array of ChatCompletionContentPartText`

    开发者消息的内容。

    - `TextContent = string`

      开发者消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      由已定义类型组成的内容分块数组。对于开发者消息，仅支持 type `text` 类型。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容分块的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `role: "developer"`

    消息作者的角色，本例中为 `developer`.

    - `"developer"`

  - `name: optional string`

    参与者的可选名称。为模型提供信息，用于区分同一角色的不同参与者。

### Chat Completion Function Call Option

- `ChatCompletionFunctionCallOption object { name }`

  通过 `{"name": "my_function"}` 会强制模型调用该函数。

  - `name: string`

    要调用的函数名称。

### Chat Completion Function Message Param

- `ChatCompletionFunctionMessageParam object { content, name, role }`

  - `content: string or null`

    函数消息的内容。

  - `name: string`

    要调用的函数名称。

  - `role: "function"`

    消息作者的角色，本例中为 `function`.

    - `"function"`

### Chat Completion Function Tool

- `ChatCompletionFunctionTool object { function, type }`

  用于生成响应的函数工具。

  - `function: FunctionDefinition`

    - `name: string`

      要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和连字符，最大长度为 64。

    - `description: optional string`

      对函数功能的描述，模型据此选择何时以及如何调用该函数。

    - `parameters: optional FunctionParameters`

      函数接受的参数，以 JSON Schema 对象描述。参见 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 获取有关该格式的文档。

      省略 `parameters` 定义一个参数列表为空的函数。

    - `strict: optional boolean or null`

      是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循在中定义的精确模式 `parameters` 时，仅支持 JSON Schema 的一个子集。了解更多信息，请参阅 `strict` 为 `true`。在以下文档中详细了解结构化输出： [函数调用指南](/api/docs/guides/function-calling).

  - `type: "function"`

    工具的类型。目前，仅有 `function` 类型。

    - `"function"`

### Chat Completion Message

- `ChatCompletionMessage object { content, refusal, role, 4 more }`

  模型生成的聊天补全消息。

  - `content: string or null`

    消息的内容。

  - `refusal: string or null`

    模型生成的拒绝消息。

  - `role: "assistant"`

    该消息作者的角色。

    - `"assistant"`

  - `annotations: optional array of object { type, url_citation }`

    消息的注解（如适用），例如使用
    [网页搜索工具](/api/docs/guides/tools-web-search).

    - `type: "url_citation"`

      URL 引用的类型。始终为 `url_citation`.

      - `"url_citation"`

    - `url_citation: object { end_index, start_index, title, url }`

      使用网页搜索时的 URL 引用。

      - `end_index: number`

        消息中 URL 引用最后一个字符的索引。

      - `start_index: number`

        消息中 URL 引用第一个字符的索引。

      - `title: string`

        网络资源的标题。

      - `url: string`

        网络资源的 URL。

  - `audio: optional ChatCompletionAudio or null`

    如果请求了音频输出模态，则此对象包含来自模型的音频
    响应的相关数据。 [了解更多](/api/docs/guides/audio).

    - `id: string`

      此音频响应的唯一标识符。

    - `data: string`

      由模型生成的 Base64 编码音频字节，格式为请求中
      指定的格式。

    - `expires_at: number`

      此音频响应在服务端不再可用于多轮
      对话时的 Unix 时间戳（秒）。
      conversations.

    - `transcript: string`

      模型生成的音频转录文本。

  - `function_call: optional object { arguments, name }`

    已弃用，并被替换为 `tool_calls`。模型生成的应被调用的函数的名称和参数。

    - `arguments: string`

      调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

    - `name: string`

      要调用的函数名称。

  - `tool_calls: optional array of ChatCompletionMessageToolCall`

    模型生成的工具调用，例如函数调用。

    - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

      对模型创建的函数工具的调用。

      - `id: string`

        工具调用的 ID。

      - `function: object { arguments, name }`

        模型调用的函数。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `type: "function"`

        工具的类型。目前，仅有 `function` 类型。

        - `"function"`

    - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

      对模型创建的自定义工具的调用。

      - `id: string`

        工具调用的 ID。

      - `custom: object { input, name }`

        模型调用的自定义工具。

        - `input: string`

          模型生成的自定义工具调用的输入。

        - `name: string`

          要调用的自定义工具的名称。

      - `type: "custom"`

        工具的类型。始终为 `custom`.

        - `"custom"`

### Chat Completion Message Custom Tool Call

- `ChatCompletionMessageCustomToolCall object { id, custom, type }`

  对模型创建的自定义工具的调用。

  - `id: string`

    工具调用的 ID。

  - `custom: object { input, name }`

    模型调用的自定义工具。

    - `input: string`

      模型生成的自定义工具调用的输入。

    - `name: string`

      要调用的自定义工具的名称。

  - `type: "custom"`

    工具的类型。始终为 `custom`.

    - `"custom"`

### Chat Completion Message Function Tool Call

- `ChatCompletionMessageFunctionToolCall object { id, function, type }`

  对模型创建的函数工具的调用。

  - `id: string`

    工具调用的 ID。

  - `function: object { arguments, name }`

    模型调用的函数。

    - `arguments: string`

      调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

    - `name: string`

      要调用的函数名称。

  - `type: "function"`

    工具的类型。目前，仅有 `function` 类型。

    - `"function"`

### Chat Completion Message Param

- `ChatCompletionMessageParam = ChatCompletionDeveloperMessageParam or ChatCompletionSystemMessageParam or ChatCompletionUserMessageParam or 3 more`

  开发者提供的指令，模型应遵循这些指令，而不论用户发送了什么消息。对于 o1 及更新的
  模型，使用 developer 角色取代 system 角色。 `developer` messages
  替换之前的 `system` messages。

  - `ChatCompletionDeveloperMessageParam object { content, role, name }`

    开发者提供的指令，模型应遵循这些指令，而不论用户发送了什么消息。对于 o1 及更新的
    模型，使用 developer 角色取代 system 角色。 `developer` messages
    替换之前的 `system` messages。

    - `content: string or array of ChatCompletionContentPartText`

      开发者消息的内容。

      - `TextContent = string`

        开发者消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        由已定义类型组成的内容分块数组。对于开发者消息，仅支持 type `text` 类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容分块的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `role: "developer"`

      消息作者的角色，本例中为 `developer`.

      - `"developer"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息，用于区分同一角色的不同参与者。

  - `ChatCompletionSystemMessageParam object { content, role, name }`

    开发者提供的指令，模型应遵循这些指令，而不论用户发送了什么消息。对于 o1 及更新的
    用户发送的消息。对于 o1 及更新的模型，请改用 `developer` messages
    来实现此目的。

    - `content: string or array of ChatCompletionContentPartText`

      系统消息的内容。

      - `TextContent = string`

        系统消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        具有指定类型的内容部分数组。对于系统消息，仅支持类型 `text` 类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容分块的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

    - `role: "system"`

      消息作者的角色，本例中为 `system`.

      - `"system"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息，用于区分同一角色的不同参与者。

  - `ChatCompletionUserMessageParam object { content, role, name }`

    由终端用户发送的消息，包含提示或额外的上下文
    信息。

    - `content: string or array of ChatCompletionContentPart`

      用户消息的内容。

      - `TextContent = string`

        消息的文本内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPart`

        具有指定类型的内容部分数组。支持选项因用于生成响应的 [model](/api/docs/models) 而异。可以包含文本、图像或音频输入。

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/api/docs/guides/text).

          - `text: string`

            文本内容。

          - `type: "text"`

            内容分块的类型。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

        - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

          了解 [图像输入](/api/docs/guides/images-vision).

          - `image_url: object { url, detail }`

            - `url: string`

              图像的 URL 或 base64 编码的图像数据。

            - `detail: optional "auto" or "low" or "high"`

              指定图像的细节级别。在 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_url"`

            内容分块的类型。

            - `"image_url"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ChatCompletionContentPartInputAudio object { input_audio, type, prompt_cache_breakpoint }`

          了解 [音频输入](/api/docs/guides/audio).

          - `input_audio: object { data, format }`

            - `data: string`

              Base64 编码的音频数据。

            - `format: "wav" or "mp3"`

              编码音频数据的格式。目前支持 "wav" 和 "mp3"。

              - `"wav"`

              - `"mp3"`

          - `type: "input_audio"`

            内容部分的类型。始终为 `input_audio`.

            - `"input_audio"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `FileContentPart object { file, type, prompt_cache_breakpoint }`

          了解 [文件输入](/api/docs/guides/text) 用于文本生成。

          - `file: object { file_data, file_id, filename }`

            - `file_data: optional string`

              Base64 编码的文件数据，在将文件以字符串形式传递给模型时使用
              。

            - `file_id: optional string`

              用作输入的上传文件 ID。

            - `filename: optional string`

              文件名，在将文件以字符串形式传递给模型时使用，
              。

          - `type: "file"`

            内容部分的类型。始终为 `file`.

            - `"file"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

    - `role: "user"`

      消息作者的角色，本例中为 `user`.

      - `"user"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息，用于区分同一角色的不同参与者。

  - `ChatCompletionAssistantMessageParam object { role, audio, content, 4 more }`

    模型针对用户消息发送的消息。

    - `role: "assistant"`

      消息作者的角色，本例中为 `assistant`.

      - `"assistant"`

    - `audio: optional object { id }  or null`

      模型先前的音频响应相关的数据。
      [了解更多](/api/docs/guides/audio).

      - `id: string`

        模型先前音频响应的唯一标识符。

    - `content: optional string or array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal or null`

      助手消息的内容。除非指定了 `tool_calls` ，否则必填。 `function_call` 。

      - `TextContent = string`

        助手消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal`

        具有指定类型的内容分块数组。可以是以下类型的一个或多个 `text`，或以下类型中的恰好一个 `refusal`.

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/api/docs/guides/text).

        - `ChatCompletionContentPartRefusal object { refusal, type }`

          - `refusal: string`

            模型生成的拒绝消息。

          - `type: "refusal"`

            内容分块的类型。

            - `"refusal"`

    - `function_call: optional object { arguments, name }  or null`

      已弃用，并被替换为 `tool_calls`。模型生成的应被调用的函数的名称和参数。

      - `arguments: string`

        调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

      - `name: string`

        要调用的函数名称。

    - `name: optional string`

      参与者的可选名称。为模型提供信息，用于区分同一角色的不同参与者。

    - `refusal: optional string or null`

      助手给出的拒绝消息。

    - `tool_calls: optional array of ChatCompletionMessageToolCall`

      模型生成的工具调用，例如函数调用。

      - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

        对模型创建的函数工具的调用。

        - `id: string`

          工具调用的 ID。

        - `function: object { arguments, name }`

          模型调用的函数。

          - `arguments: string`

            调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

          - `name: string`

            要调用的函数名称。

        - `type: "function"`

          工具的类型。目前，仅有 `function` 类型。

          - `"function"`

      - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

        对模型创建的自定义工具的调用。

        - `id: string`

          工具调用的 ID。

        - `custom: object { input, name }`

          模型调用的自定义工具。

          - `input: string`

            模型生成的自定义工具调用的输入。

          - `name: string`

            要调用的自定义工具的名称。

        - `type: "custom"`

          工具的类型。始终为 `custom`.

          - `"custom"`

  - `ChatCompletionToolMessageParam object { content, role, tool_call_id }`

    - `content: string or array of ChatCompletionContentPartText`

      工具消息的内容。

      - `TextContent = string`

        工具消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        具有指定类型的内容部分数组。对于工具消息，只有类型 `text` 类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容分块的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

    - `role: "tool"`

      消息作者的角色，本例中为 `tool`.

      - `"tool"`

    - `tool_call_id: string`

      此消息正在响应的工具调用。

  - `ChatCompletionFunctionMessageParam object { content, name, role }`

    - `content: string or null`

      函数消息的内容。

    - `name: string`

      要调用的函数名称。

    - `role: "function"`

      消息作者的角色，本例中为 `function`.

      - `"function"`

### Chat Completion Message Tool Call

- `ChatCompletionMessageToolCall = ChatCompletionMessageFunctionToolCall or ChatCompletionMessageCustomToolCall`

  对模型创建的函数工具的调用。

  - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

    对模型创建的函数工具的调用。

    - `id: string`

      工具调用的 ID。

    - `function: object { arguments, name }`

      模型调用的函数。

      - `arguments: string`

        调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会生成未在你的函数 schema 中定义的参数（幻觉）。在调用函数之前，请在代码中校验这些参数。

      - `name: string`

        要调用的函数名称。

    - `type: "function"`

      工具的类型。目前，仅有 `function` 类型。

      - `"function"`

  - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

    对模型创建的自定义工具的调用。

    - `id: string`

      工具调用的 ID。

    - `custom: object { input, name }`

      模型调用的自定义工具。

      - `input: string`

        模型生成的自定义工具调用的输入。

      - `name: string`

        要调用的自定义工具的名称。

    - `type: "custom"`

      工具的类型。始终为 `custom`.

      - `"custom"`

### Chat Completion Modality

- `ChatCompletionModality = "text" or "audio"`

  - `"text"`

  - `"audio"`

### Chat Completion Named Tool Choice

- `ChatCompletionNamedToolChoice object { function, type }`

  指定模型应使用的工具。用于强制模型调用特定函数。

  - `function: object { name }`

    - `name: string`

      要调用的函数名称。

  - `type: "function"`

    对于函数调用，类型始终为 `function`.

    - `"function"`

### Chat Completion Named Tool Choice Custom

- `ChatCompletionNamedToolChoiceCustom object { custom, type }`

  指定模型应使用的工具。用于强制模型调用特定的自定义工具。

  - `custom: object { name }`

    - `name: string`

      要调用的自定义工具的名称。

  - `type: "custom"`

    对于自定义工具调用，类型始终为 `custom`.

    - `"custom"`

### Chat Completion Prediction Content

- `ChatCompletionPredictionContent object { content, type }`

  静态预测输出内容，例如正在重新生成的文本文件的内容
  。

  - `content: string or array of ChatCompletionContentPartText`

    生成模型响应时应匹配的内容。
    如果生成的 token 与该内容匹配，整个模型响应
    可以更快地返回。

    - `TextContent = string`

      用于预测输出的内容。这通常是
      你正在重新生成且只有微小改动的文件的文本。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      具有指定类型的内容部分数组。支持选项因用于生成响应的 [model](/api/docs/models) 用于生成响应的内容。可以包含文本输入。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容分块的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `type: "content"`

    你要提供的预测内容的类型。该类型
    目前始终是 `content`.

    - `"content"`

### Chat Completion 角色

- `ChatCompletionRole = "developer" or "system" or "user" or 3 more`

  消息作者的角色

  - `"developer"`

  - `"system"`

  - `"user"`

  - `"assistant"`

  - `"tool"`

  - `"function"`

### Chat Completion Store Message

- `ChatCompletionStoreMessage object { id, content, content_parts, 2 more }`

  - `id: string`

  - `content: string or null`

  - `content_parts: array of object { type, file, image_url, 2 more }  or null`

    - `type: "text" or "image_url" or "input_audio" or "file"`

      - `"text"`

      - `"image_url"`

      - `"input_audio"`

      - `"file"`

    - `file: optional object { file_data, file_id, filename }  or null`

      - `file_data: optional string or null`

      - `file_id: optional string or null`

      - `filename: optional string or null`

    - `image_url: optional object { url, detail }  or null`

      - `url: string`

      - `detail: optional string or null`

    - `input_audio: optional object { data, format }  or null`

      - `data: string`

      - `format: string`

    - `text: optional string or null`

  - `role: "user" or "assistant" or "tool" or 3 more`

    - `"user"`

    - `"assistant"`

    - `"tool"`

    - `"system"`

    - `"function"`

    - `"developer"`

  - `name: optional string or null`

### Chat Completion Stream Options

- `ChatCompletionStreamOptions object { include_obfuscation, include_usage }`

  流式响应的相关选项。仅当设置了 `stream: true`.

  - `include_obfuscation: optional boolean`

    当该值为 true 时，将启用流混淆。流混淆会在流式 delta 事件的
    字段中添加随机字符，以 `obfuscation` 字段添加随机字符到流式 delta 事件上，以
    规范化负载大小，作为针对某些侧信道攻击的缓解措施。
    这些混淆字段默认包含，但会增加少量
    数据传输的开销。如果信任你的应用与OpenAI API之间的网络链路，可以设置 `include_obfuscation` 设为
    为 false 以优化带宽，如果信任你的应用与该公司 接口
    之间的网络链路。

  - `include_usage: optional boolean`

    如果设置了该参数，将在 `data: [DONE]`
    消息之前流式传输一个额外的分块。该分块上的 `usage` 字段显示整个请求的令牌使用情况统计信息，
    字段将始终是 `choices` 一个空
    数组。

    所有其他块也会包含一个 `usage` 字段，但值为
    null。 **注意：** 如果流被中断，你可能无法接收到包含该请求总 token 使用量的
    最终 usage 块。

### Chat Completion System Message Param

- `ChatCompletionSystemMessageParam object { content, role, name }`

  开发者提供的指令，模型应遵循这些指令，而不论用户发送了什么消息。对于 o1 及更新的
  用户发送的消息。对于 o1 及更新的模型，请改用 `developer` messages
  来实现此目的。

  - `content: string or array of ChatCompletionContentPartText`

    系统消息的内容。

    - `TextContent = string`

      系统消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      具有指定类型的内容部分数组。对于系统消息，仅支持类型 `text` 类型。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容分块的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `role: "system"`

    消息作者的角色，本例中为 `system`.

    - `"system"`

  - `name: optional string`

    参与者的可选名称。为模型提供信息，用于区分同一角色的不同参与者。

### Chat Completion Token Logprob

- `ChatCompletionTokenLogprob object { token, bytes, logprob, top_logprobs }`

  - `token: string`

    该令牌。

  - `bytes: array of number or null`

    一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

  - `logprob: number`

    该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

  - `top_logprobs: array of object { token, bytes, logprob }`

    在该 token 位置上可能性最高的 token 列表及其对数概率。条目数量可能少于请求中指定的 `top_logprobs`.

    - `token: string`

      该令牌。

    - `bytes: array of number or null`

      一个整数列表，表示该令牌的 UTF-8 字节表示。在字符由多个令牌表示且必须组合其字节表示才能生成正确文本表示的情况下非常有用。可以为 `null` （如果该令牌没有字节表示）。

    - `logprob: number`

      该令牌的日志概率（如果它位于前 20 个最可能的令牌中）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

### Chat Completion Tool

- `ChatCompletionTool = ChatCompletionFunctionTool or ChatCompletionCustomTool`

  用于生成响应的函数工具。

  - `ChatCompletionFunctionTool object { function, type }`

    用于生成响应的函数工具。

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和连字符，最大长度为 64。

      - `description: optional string`

        对函数功能的描述，模型据此选择何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，以 JSON Schema 对象描述。参见 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 获取有关该格式的文档。

        省略 `parameters` 定义一个参数列表为空的函数。

      - `strict: optional boolean or null`

        是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循在中定义的精确模式 `parameters` 时，仅支持 JSON Schema 的一个子集。了解更多信息，请参阅 `strict` 为 `true`。在以下文档中详细了解结构化输出： [函数调用指南](/api/docs/guides/function-calling).

    - `type: "function"`

      工具的类型。目前，仅有 `function` 类型。

      - `"function"`

  - `ChatCompletionCustomTool object { custom, type }`

    使用指定格式处理输入的自定义工具。

    - `custom: object { name, description, format }`

      自定义工具的属性。

      - `name: string`

        自定义工具的名称，用于在工具调用中标识它。

      - `description: optional string`

        自定义工具的可选描述，用于提供更多上下文。

      - `format: optional object { type }  or object { grammar, type }`

        自定义工具的输入格式。默认情况下为无约束文本。

        - `Text object { type }`

          无约束自由格式文本。

          - `type: "text"`

            无约束文本格式。始终为 `text`.

            - `"text"`

        - `Grammar object { grammar, type }`

          由用户定义的语法。

          - `grammar: object { definition, syntax }`

            你选择的语法。

            - `definition: string`

              语法定义。

            - `syntax: "lark" or "regex"`

              语法定义的语法格式。可选值之一： `lark` ，否则必填。 `regex`.

              - `"lark"`

              - `"regex"`

          - `type: "grammar"`

            语法格式。始终为 `grammar`.

            - `"grammar"`

    - `type: "custom"`

      自定义工具的类型。始终为 `custom`.

      - `"custom"`

### Chat Completion Tool Choice Option

- `ChatCompletionToolChoiceOption = "none" or "auto" or "required" or ChatCompletionAllowedToolChoice or ChatCompletionNamedToolChoice or ChatCompletionNamedToolChoiceCustom`

  控制模型调用哪些工具（如果有）。
  `none` 表示模型不会调用任何工具，而是生成一条消息。
  `auto` 表示模型可以在生成消息和调用一个或多个工具之间进行选择。
  `required` 表示模型必须调用一个或多个工具。
  通过以下方式指定特定工具 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

  `none` 在没有工具时的默认设置。 `auto` 在存在工具时的默认设置。

  - `ToolChoiceMode = "none" or "auto" or "required"`

    `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以在生成消息和调用一个或多个工具之间进行选择。 `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ChatCompletionAllowedToolChoice object { allowed_tools, type }`

    将模型可用的工具限制为预定义的集合。

    - `allowed_tools: ChatCompletionAllowedTools`

      将模型可用的工具限制为预定义的集合。

      - `mode: "auto" or "required"`

        将模型可用的工具限制为预定义的集合。

        `auto` 允许模型从允许的工具中选择并生成一条
        消息。

        `required` 要求模型调用一个或多个允许的工具。

        - `"auto"`

        - `"required"`

      - `tools: array of map[unknown]`

        模型应被允许调用的工具定义列表。

        对于 Chat Completions API，工具定义列表可能如下所示：

        ```json
        [
          { "type": "function", "function": { "name": "get_weather" } },
          { "type": "function", "function": { "name": "get_time" } }
        ]
        ```

    - `type: "allowed_tools"`

      允许的工具配置类型。始终为 `allowed_tools`.

      - `"allowed_tools"`

  - `ChatCompletionNamedToolChoice object { function, type }`

    指定模型应使用的工具。用于强制模型调用特定函数。

    - `function: object { name }`

      - `name: string`

        要调用的函数名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ChatCompletionNamedToolChoiceCustom object { custom, type }`

    指定模型应使用的工具。用于强制模型调用特定的自定义工具。

    - `custom: object { name }`

      - `name: string`

        要调用的自定义工具的名称。

    - `type: "custom"`

      对于自定义工具调用，类型始终为 `custom`.

      - `"custom"`

### Chat Completion Tool Message Param

- `ChatCompletionToolMessageParam object { content, role, tool_call_id }`

  - `content: string or array of ChatCompletionContentPartText`

    工具消息的内容。

    - `TextContent = string`

      工具消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      具有指定类型的内容部分数组。对于工具消息，只有类型 `text` 类型。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容分块的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `role: "tool"`

    消息作者的角色，本例中为 `tool`.

    - `"tool"`

  - `tool_call_id: string`

    此消息正在响应的工具调用。

### Chat Completion User Message Param

- `ChatCompletionUserMessageParam object { content, role, name }`

  由终端用户发送的消息，包含提示或额外的上下文
  信息。

  - `content: string or array of ChatCompletionContentPart`

    用户消息的内容。

    - `TextContent = string`

      消息的文本内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPart`

      具有指定类型的内容部分数组。支持选项因用于生成响应的 [model](/api/docs/models) 而异。可以包含文本、图像或音频输入。

      - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

        了解 [文本输入](/api/docs/guides/text).

        - `text: string`

          文本内容。

        - `type: "text"`

          内容分块的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

        了解 [图像输入](/api/docs/guides/images-vision).

        - `image_url: object { url, detail }`

          - `url: string`

            图像的 URL 或 base64 编码的图像数据。

          - `detail: optional "auto" or "low" or "high"`

            指定图像的细节级别。在 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

            - `"auto"`

            - `"low"`

            - `"high"`

        - `type: "image_url"`

          内容分块的类型。

          - `"image_url"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ChatCompletionContentPartInputAudio object { input_audio, type, prompt_cache_breakpoint }`

        了解 [音频输入](/api/docs/guides/audio).

        - `input_audio: object { data, format }`

          - `data: string`

            Base64 编码的音频数据。

          - `format: "wav" or "mp3"`

            编码音频数据的格式。目前支持 "wav" 和 "mp3"。

            - `"wav"`

            - `"mp3"`

        - `type: "input_audio"`

          内容部分的类型。始终为 `input_audio`.

          - `"input_audio"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `FileContentPart object { file, type, prompt_cache_breakpoint }`

        了解 [文件输入](/api/docs/guides/text) 用于文本生成。

        - `file: object { file_data, file_id, filename }`

          - `file_data: optional string`

            Base64 编码的文件数据，在将文件以字符串形式传递给模型时使用
            。

          - `file_id: optional string`

            用作输入的上传文件 ID。

          - `filename: optional string`

            文件名，在将文件以字符串形式传递给模型时使用，
            。

        - `type: "file"`

          内容部分的类型。始终为 `file`.

          - `"file"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承自请求的 `prompt_cache_options.ttl`；的 TTL；边界不会向上取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

  - `role: "user"`

    消息作者的角色，本例中为 `user`.

    - `"user"`

  - `name: optional string`

    参与者的可选名称。为模型提供信息，用于区分同一角色的不同参与者。

# Messages

## 获取聊天消息

**get** `/chat/completions/{completion_id}/messages`

获取存储的聊天补全中的消息。仅返回已使用
创建的 Chat Completions。 `store` 参数方可删除。 `true` 将会被
返回。

### 路径参数

- `completion_id: string`

### 查询参数

- `after: optional string`

  上一次分页请求中最后一条消息的标识符。

- `limit: optional number`

  要检索的消息数量。

- `order: optional "asc" or "desc"`

  按时间戳排序消息的顺序。使用 `asc` 表示升序，或 `desc` 表示降序。默认为 `asc`.

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of ChatCompletionStoreMessage`

  一个由聊天补全消息对象组成的数组。

  - `id: string`

  - `content: string or null`

  - `content_parts: array of object { type, file, image_url, 2 more }  or null`

    - `type: "text" or "image_url" or "input_audio" or "file"`

      - `"text"`

      - `"image_url"`

      - `"input_audio"`

      - `"file"`

    - `file: optional object { file_data, file_id, filename }  or null`

      - `file_data: optional string or null`

      - `file_id: optional string or null`

      - `filename: optional string or null`

    - `image_url: optional object { url, detail }  or null`

      - `url: string`

      - `detail: optional string or null`

    - `input_audio: optional object { data, format }  or null`

      - `data: string`

      - `format: string`

    - `text: optional string or null`

  - `role: "user" or "assistant" or "tool" or 3 more`

    - `"user"`

    - `"assistant"`

    - `"tool"`

    - `"system"`

    - `"function"`

    - `"developer"`

  - `name: optional string or null`

- `first_id: string or null`

  数据数组中第一条聊天消息的标识符。

- `has_more: boolean`

  指示是否还有更多可用的聊天消息。

- `last_id: string or null`

  数据数组中最后一条聊天消息的标识符。

- `object: "list"`

  此对象的类型，始终设置为 "list"。

  - `"list"`

### 示例

```http
curl https://api.openai.com/v1/chat/completions/$COMPLETION_ID/messages \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "content": "content",
      "content_parts": [
        {
          "type": "text",
          "file": {
            "file_data": "file_data",
            "file_id": "file_id",
            "filename": "filename"
          },
          "image_url": {
            "url": "url",
            "detail": "detail"
          },
          "input_audio": {
            "data": "data",
            "format": "format"
          },
          "text": "text"
        }
      ],
      "role": "user",
      "name": "name"
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id",
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/chat/completions/chat_abc123/messages \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2-0",
      "role": "user",
      "content": "write a haiku about ai",
      "name": null,
      "content_parts": null
    }
  ],
  "first_id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2-0",
  "last_id": "chatcmpl-AyPNinnUqUDYo9SAdA52NobMflmj2-0",
  "has_more": false
}
```
