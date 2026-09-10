# Chat

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾添加 `.md` 。

# Completions

## Create chat completion

**post** `/chat/completions`

**开始新项目？** 我们推荐使用 [Responses](/api/reference/resources/responses)
以使用最新的 OpenAI 平台特性。对比
[Chat Completions 与 Responses](/api/docs/guides/migrate-to-responses?api-mode=responses).

---

为给定的聊天对话创建模型响应。详细了解请参阅
[文本生成](/api/docs/guides/text), [视觉](/api/docs/guides/images-vision),
和 [音频](/api/docs/guides/audio) 指南。

参数支持可能因用于生成响应的模型而异，尤其是较新的推理模型。仅
推理模型支持的参数会在下方注明。关于推理模型中当前
不支持的参数状态，请
参阅推理指南，
[refer to the reasoning guide](/api/docs/guides/reasoning).

返回一个聊天补全对象；如果请求以流式传输，则返回一组按顺序
排列的聊天补全分块对象。

### Body 参数

- `messages: array of ChatCompletionMessageParam`

  迄今为止组成对话的消息列表。根据所使用的
  [model](/api/docs/models) 不同，支持不同的消息类型（模态），例如
  支持 [text](/api/docs/guides/text),
  [images](/api/docs/guides/images-vision)，和 [audio](/api/docs/guides/audio).

  - `ChatCompletionDeveloperMessageParam object { content, role, name }`

    开发者提供的指令，模型应遵循这些指令，无论用户发送什么
    消息。对于 o1 及更高版本的模型， `developer` messages
    取代之前的 `system` messages。

    - `content: string or array of ChatCompletionContentPartText`

      开发者消息的内容。

      - `TextContent = string`

        开发者消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        由已定义类型组成的内容部分数组。对于开发者消息，仅支持 type 为 `text` 的类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

    - `role: "developer"`

      消息作者的角色，此处为 `developer`.

      - `"developer"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分同一角色的不同参与者。

  - `ChatCompletionSystemMessageParam object { content, role, name }`

    开发者提供的指令，模型应遵循这些指令，无论用户发送什么
    用户发送的消息。对于 o1 及更高模型，请改用 `developer` messages
    来完成此目的。

    - `content: string or array of ChatCompletionContentPartText`

      系统消息的内容。

      - `TextContent = string`

        系统消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        由已定义类型组成的内容部分数组。对于系统消息，仅支持类型 `text` 的类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

    - `role: "system"`

      消息作者的角色，此处为 `system`.

      - `"system"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分同一角色的不同参与者。

  - `ChatCompletionUserMessageParam object { content, role, name }`

    由终端用户发送的消息，包含提示词或额外的上下文
    信息。

    - `content: string or array of ChatCompletionContentPart`

      用户消息的内容。

      - `TextContent = string`

        消息的文本内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPart`

        由已定义类型组成的内容部分数组。支持的内容因用于生成响应的 [model](/api/docs/models) 而异。可以包含文本、图像或音频输入。

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/api/docs/guides/text).

          - `text: string`

            文本内容。

          - `type: "text"`

            内容部分的类型。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

        - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

          了解 [图像输入](/api/docs/guides/images-vision).

          - `image_url: object { url, detail }`

            - `url: string`

              图像的 URL 或 base64 编码的图像数据。

            - `detail: optional "auto" or "low" or "high"`

              指定图像的细节级别。了解更多，请参阅 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_url"`

            内容部分的类型。

            - `"image_url"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ChatCompletionContentPartInputAudio object { input_audio, type, prompt_cache_breakpoint }`

          了解 [音频输入](/api/docs/guides/audio).

          - `input_audio: object { data, format }`

            - `data: string`

              Base64 编码的音频数据。

            - `format: "wav" or "mp3"`

              编码音频数据的格式。当前支持 "wav" 和 "mp3"。

              - `"wav"`

              - `"mp3"`

          - `type: "input_audio"`

            内容部分的类型。始终为 `input_audio`.

            - `"input_audio"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `FileContentPart object { file, type, prompt_cache_breakpoint }`

          了解 [文件输入](/api/docs/guides/text) 用于文本生成。

          - `file: object { file_data, file_id, filename }`

            - `file_data: optional string`

              Base64 编码的文件数据，在将文件作为字符串传递给模型时使用
              。

            - `file_id: optional string`

              用作输入的上传文件的 ID。

            - `filename: optional string`

              文件的名称，在将文件作为
              字符串传递给模型时使用。

          - `type: "file"`

            内容部分的类型。始终为 `file`.

            - `"file"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

    - `role: "user"`

      消息作者的角色，此处为 `user`.

      - `"user"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分同一角色的不同参与者。

  - `ChatCompletionAssistantMessageParam object { role, audio, content, 4 more }`

    模型针对用户消息回复时发送的消息。

    - `role: "assistant"`

      消息作者的角色，此处为 `assistant`.

      - `"assistant"`

    - `audio: optional object { id }  or null`

      关于模型先前音频响应的数据。
      [了解更多](/api/docs/guides/audio).

      - `id: string`

        模型先前音频响应的唯一标识符。

    - `content: optional string or array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal or null`

      助手消息的内容。除非指定了 `tool_calls` 或 `function_call` ，否则此项为必需。

      - `TextContent = string`

        助手消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal`

        由已定义类型组成的内容部分数组。可以是以下类型的一个或多个 `text`，或以下类型的恰好一个 `refusal`.

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/api/docs/guides/text).

        - `ChatCompletionContentPartRefusal object { refusal, type }`

          - `refusal: string`

            模型生成的拒绝消息。

          - `type: "refusal"`

            内容部分的类型。

            - `"refusal"`

    - `function_call: optional object { arguments, name }  or null`

      已弃用并替换为 `tool_calls`。模型生成的、应当被调用的函数名称及其参数。

      - `arguments: string`

        调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

      - `name: string`

        要调用的函数名称。

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分同一角色的不同参与者。

    - `refusal: optional string or null`

      助手给出的拒绝消息。

    - `tool_calls: optional array of ChatCompletionMessageToolCall`

      模型生成的工具调用，例如函数调用。

      - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

        对模型创建的函数工具的调用。

        - `id: string`

          工具调用的 ID。

        - `function: object { arguments, name }`

          模型所调用的函数。

          - `arguments: string`

            调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

          - `name: string`

            要调用的函数名称。

        - `type: "function"`

          工具的类型。当前，仅 `function` 的类型。

          - `"function"`

      - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

        对模型创建的自定义工具的调用。

        - `id: string`

          工具调用的 ID。

        - `custom: object { input, name }`

          模型所调用的自定义工具。

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

        包含已定义类型的若干内容片段组成的数组。对于工具消息，仅支持类型为 `text` 的类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

    - `role: "tool"`

      消息作者的角色，此处为 `tool`.

      - `"tool"`

    - `tool_call_id: string`

      此消息所响应的工具调用。

  - `ChatCompletionFunctionMessageParam object { content, name, role }`

    - `content: string or null`

      函数消息的内容。

    - `name: string`

      要调用的函数名称。

    - `role: "function"`

      消息作者的角色，此处为 `function`.

      - `"function"`

- `model: string or "gpt-6-astra" or "gpt-5.6-sol" or "gpt-5.6-terra" or 81 more`

  用于生成响应的模型 ID，例如 `gpt-6-astra` 或 `o3`。 OpenAI
  提供了众多能力、性能特点各异的模型，价格档位也不同。请参阅
  模型指南 [模型指南](/api/docs/models)
  以浏览和比较可用的模型。

  - `string`

  - `"gpt-6-astra" or "gpt-5.6-sol" or "gpt-5.6-terra" or 81 more`

    用于生成响应的模型 ID，例如 `gpt-6-astra` 或 `o3`。 OpenAI
    提供了众多能力、性能特点各异的模型，价格档位也不同。请参阅
    模型指南 [模型指南](/api/docs/models)
    以浏览和比较可用的模型。

    - `"gpt-6-astra"`

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

  音频输出的参数。当使用以下方式请求音频输出时为必填
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

    模型用于回复的声音。支持的内置声音包括
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `nova`, `onyx`,
    `sage`, `shimmer`, `marin`，和 `cedar`。你也可以提供
    自定义声音对象，并附带 `id`，例如 `{ "id": "voice_1234" }`.

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

  介于 -2.0 和 2.0 之间的数值。正值会基于新 token 在
  已有文本中的出现频率对其进行惩罚，从而降低模型
  逐字重复相同语句的可能性。

- `function_call: optional "none" or "auto" or ChatCompletionFunctionCallOption`

  已弃用，推荐使用 `tool_choice`.

  控制模型调用哪个函数（如果有）。

  `none` 表示模型不会调用函数，而是生成一条
  消息。

  `auto` 表示模型可以在生成消息和调用某个
  函数之间选择。

  通过 {"type": "function"} 指定某个具体函数 `{"name": "my_function"}` 会强制
  模型调用该函数。

  `none` 在没有函数存在时是默认值。 `auto` 是默认
  值（如果存在函数的话）。

  - `"none" or "auto"`

    `none` 表示模型不会调用函数，而是生成一条消息。 `auto` 表示模型可以在生成消息和调用函数之间选择。

    - `"none"`

    - `"auto"`

  - `ChatCompletionFunctionCallOption object { name }`

    通过 {"type": "function"} 指定某个具体函数 `{"name": "my_function"}` 会强制模型调用该函数。

    - `name: string`

      要调用的函数名称。

- `functions: optional array of object { name, description, parameters }`

  已弃用，推荐使用 `tools`.

  模型可能为其生成 JSON 输入的函数列表。

  - `name: string`

    要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短横线，最大长度为 64。

  - `description: optional string`

    对函数作用的描述，供模型用来决定何时以及如何调用该函数。

  - `parameters: optional FunctionParameters`

    函数接受的参数，以 JSON Schema 对象形式描述。参见 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 关于该格式的文档，请参阅。

    省略 `parameters` 用于定义一个空参数列表的函数。

- `logit_bias: optional map[number] or null`

  修改指定 token 出现在补全中的可能性。

  接受一个 JSON 对象，将 token（由其 token ID 在
  分词器中指定）映射到 -100 到 100 之间的关联偏置值。从数学上讲，
  该偏置会在采样之前被加到模型生成的 logits 上。
  具体效果因模型而异，但介于 -1 和 1 之间的值应
  降低或提高被选中的可能性；而 -100 或 100
  这样的值应导致禁用或独占选择相关 token。

- `logprobs: optional boolean or null`

  是否返回输出 token 的对数概率。如果为 true，
  返回在
  `content` 中返回的每个输出 token 的对数概率。 `message`.

- `max_completion_tokens: optional number or null`

  针对一次补全可生成 token 数量的上限，包括可见的输出 token 以及 [推理 token](/api/docs/guides/reasoning).

- `max_tokens: optional number or null`

  可在 [聊天补全](https://platform.openai.com/tokenizer) 中生成的最大
  数量。该值可用于控制
  [成本](https://openai.com/api/pricing/) 针对通过API生成的文本。

  该字段已弃用,推荐使用 `max_completion_tokens`,且与
  不兼容 [o 系列模型](/api/docs/guides/reasoning).

- `metadata: optional Metadata or null`

  由 16 个键值对组成的集合，可以附加到对象上。可用于
  以结构化格式存储有关对象的附加信息，并通过
  API 或控制台查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串
  ，最大长度为 512 个字符。

- `modalities: optional array of "text" or "audio" or null`

  你希望模型生成的输出类型。
  大多数模型都能生成文本，这也是默认行为：

  `["text"]`

  该 `gpt-4o-audio-preview` 模型还可用于
  [生成音频](/api/docs/guides/audio)。要让此模型同时生成
  文本和音频响应，可以使用：

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

      用于响应输入的内容审核策略。

      - `mode: "score" or "block"`

        - `"score"`

        - `"block"`

    - `output: optional object { mode }  or null`

      用于响应输出的内容审核策略。

      - `mode: "score" or "block"`

        - `"score"`

        - `"block"`

- `n: optional number or null`

  为每条输入消息生成多少个聊天补全选项。请注意，你将根据所有选项中生成的 token 总数计费。Keep `n` as `1` 以降低成本。

- `parallel_tool_calls: optional boolean`

  是否启用 [并行函数调用](/api/docs/guides/function-calling#parallel-function-calling) 在工具使用期间。

- `prediction: optional ChatCompletionPredictionContent or null`

  静态预测的输出内容，例如正在重新生成的文本文件的内容。
  being regenerated.

  - `content: string or array of ChatCompletionContentPartText`

    生成模型响应时应匹配的内容。
    如果生成的 token 会匹配该内容，整个模型响应
    可以更快地返回。

    - `TextContent = string`

      用于 Predicted Output 的内容。通常是
      你正在重新生成且只有少量修改的文件文本。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      由已定义类型组成的内容部分数组。支持的内容因用于生成响应的 [model](/api/docs/models) 用于生成响应的内容。可以包含文本输入。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

  - `type: "content"`

    你想要提供的预测内容的类型。该类型
    目前始终为 `content`.

    - `"content"`

- `presence_penalty: optional number or null`

  介于 -2.0 和 2.0 之间的数值。正值会基于新 token 在
  到目前为止是否出现在文本中，从而增加模型谈论
  新话题的可能性。

- `prompt_cache_key: optional string or null`

  由 OpenAI 用于为相似请求缓存响应，以优化你的缓存命中率。取代 `user` 字段。 [了解更多](/api/docs/guides/prompt-caching).

- `prompt_cache_options: optional object { mode, ttl }`

  提示缓存的选项。支持 `gpt-5.6` 及更高版本的模型。默认情况下，OpenAI 会自动选择一个隐式缓存断点。你可以使用 `prompt_cache_breakpoint`。在内容块中添加显式断点。每个请求最多可写入四个断点。对于缓存匹配，OpenAI 会考虑对话中最多最近的 80 个断点，且没有内容块回溯限制。将 `mode` 设置为 `explicit` 可禁用隐式断点。 `ttl` 默认为 `30m`，这是当前唯一支持的值。参见 [提示缓存指南](/api/docs/guides/prompt-caching) 了解当前详情。

  - `mode: optional "implicit" or "explicit"`

    控制 OpenAI 是否自动创建隐式缓存断点。默认为 `implicit`。当设置为 `implicit`，时，OpenAI 会创建一个隐式断点，并在请求中写入最多最近的三个显式断点。当设置为 `explicit`，时，OpenAI 不会创建隐式断点，并写入最多最近的四个显式断点。如果没有显式断点，则该请求不使用提示缓存。

    - `"implicit"`

    - `"explicit"`

  - `ttl: optional "30m"`

    应用于该请求写入的每个隐式和显式缓存断点的最短生命周期。默认为 `30m`，这是当前唯一支持的值。后端可能会将缓存条目保留更长时间。

    - `"30m"`

- `prompt_cache_retention: optional "in_memory" or "24h" or null`

  已弃用。请使用 `prompt_cache_options.ttl` 替代。

  提示缓存的保留策略。设置为 `24h` 以启用扩展的提示缓存，使缓存的前缀保持更长时间，最长可达 24 小时。 [了解更多](/api/docs/guides/prompt-caching#prompt-cache-retention).
  该字段表示最大保留策略，而
  `prompt_cache_options.ttl` 表示最短缓存生命周期。两个
  字段相互独立，不会互相影响。
  对于 `gpt-5.5`, `gpt-5.5-pro`，以及未来的模型，仅 `24h` 的类型。

  对于同时支持 `in_memory` 和 `24h`，的较旧模型，默认值取决于你组织的数据保留策略：

  - 未启用 ZDR 的组织默认使用 `24h`.
  - 已启用 ZDR 的组织默认使用 `in_memory` 当 `prompt_cache_retention` 未指定时。

  - `"in_memory"`

  - `"24h"`

- `reasoning_effort: optional ReasoningEffort or null`

  限制推理模型在推理上的投入程度。当前支持的
  值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
  降低推理投入程度可以使响应更快，并在响应中消耗更少的推理 tokens。并非所有推理模型都支持每个
  值。请参阅
  中的
  [推理指南](/api/docs/guides/reasoning)
  以了解特定模型的支持情况。

  - `"none"`

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

- `response_format: optional ResponseFormatText or ResponseFormatJSONSchema or ResponseFormatJSONObject`

  一个用于指定模型必须输出的格式的对象。

  设置为 `{ "type": "json_schema", "json_schema": {...} }` 启用
  结构化输出，确保模型将匹配你提供的 JSON
  schema。了解更多，请参阅 [结构化输出
  指南](/api/docs/guides/structured-outputs).

  设置为 `{ "type": "json_object" }` 启用旧版 JSON 模式，该模式
  确保模型生成的消息是有效的 JSON。使用 `json_schema`
  是支持该功能的模型的首选。

  - `ResponseFormatText object { type }`

    默认响应格式。用于生成文本响应。

    - `type: "text"`

      正在定义的响应格式的类型。始终为 `text`.

      - `"text"`

  - `ResponseFormatJSONSchema object { json_schema, type }`

    JSON Schema 响应格式。用于生成结构化 JSON 响应。
    了解更多关于 [结构化输出](/api/docs/guides/structured-outputs).

    - `json_schema: object { name, description, schema, strict }`

      结构化输出配置选项的信息，包括 JSON Schema。

      - `name: string`

        响应格式的名称。必须为 a-z、A-Z、0-9，或包含
        下划线和短横线，最大长度为 64。

      - `description: optional string`

        响应格式用途的描述，由模型用于
        确定如何以该格式进行响应。

      - `schema: optional map[unknown]`

        响应格式的 schema，以 JSON Schema 对象描述。
        了解如何构建 JSON schema [此处](https://json-schema.org/).

      - `strict: optional boolean or null`

        是否在生成输出时启用严格的模式遵循。
        如果设置为 true，模型将始终遵循所定义的精确模式，
        在 `schema` 字段中。当 strict 为 true 时，仅支持 JSON Schema 的一个子集。
        `strict` 为 `true`。要了解更多信息，请阅读 [结构化输出
        指南](/api/docs/guides/structured-outputs).

    - `type: "json_schema"`

      正在定义的响应格式的类型。始终为 `json_schema`.

      - `"json_schema"`

  - `ResponseFormatJSONObject object { type }`

    JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
    使用 `json_schema` 推荐用于支持它的模型。请注意，
    模型在没有系统或用户消息指示的情况下不会生成 JSON，
    因此请这样做。

    - `type: "json_object"`

      正在定义的响应格式的类型。始终为 `json_object`.

      - `"json_object"`

- `safety_identifier: optional string or null`

  一个稳定的标识符，用于帮助检测可能违反 OpenAI 使用政策的应用用户。
  这些 ID 应为字符串，用于唯一标识每个用户，最大长度为 64 个字符。建议对其用户名或电子邮件地址进行哈希处理，以避免向我们发送任何身份识别信息。 [了解更多](/api/docs/guides/safety-best-practices#implement-safety-identifiers).

- `seed: optional number or null`

  此功能处于测试阶段。
  如果指定，我们的系统将尽最大努力进行确定性采样，使得使用相同 seed 和参数的重复请求应返回相同的结果。 `seed` 和参数的重复请求应返回相同的结果。
  无法保证确定性，你应参考 `system_fingerprint` 响应参数来监控后端的变化。

- `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

  指定用于处理该请求的处理类型。

  - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则项目将使用 'default'。
  - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
  - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
  - 如需在请求级别选择 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中包含 `service_tier=fast` 或 `service_tier=priority` 参数。响应将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。
  - 未设置时，默认行为为 'auto'。

  当设置了 `service_tier` 参数时，响应体将根据实际用于处理请求的处理模式包含相应的 `service_tier` 值。此响应值可能与参数中设置的值不同。

  - `"auto"`

  - `"default"`

  - `"flex"`

  - `"scale"`

  - `"priority"`

  - `"fast"`

- `stop: optional string or array of string or null`

  最新的推理模型不支持该参数 `o3` 和 `o4-mini`.

  最多 4 个 API 将停止生成更多令牌的序列。返回的
  文本不会包含停止序列。

  - `string`

  - `array of string`

- `store: optional boolean or null`

  是否存储此次聊天补全请求的输出以用于
  我们的 [模型蒸馏](/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model) 或
  [evals](/api/docs/guides/evals) 产品。

  支持文本和图像输入。注意：超过 8MB 的图像输入将被丢弃。

- `stream: optional boolean or null`

  如果设置为 true，模型响应数据将以流式方式发送到客户端
  在生成时使用 [服务端发送事件](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format).
  请参阅下方 [Streaming 章节](/api/reference/resources/chat/subresources/completions/streaming-events)
  以了解更多信息，以及 [流式响应](/api/docs/guides/streaming-responses)
  指南，了解如何处理流式事件。

- `stream_options: optional ChatCompletionStreamOptions or null`

  流式响应的选项。仅当设置 `stream: true`.

  - `include_obfuscation: optional boolean`

    当为 true 时，将启用流混淆。流混淆会向流式 delta 事件上的某个字段添加
    随机字符，以规范化负载大小，作为对某些侧信道攻击的缓解措施。 `obfuscation` 字段添加随机字符，以
    规范化负载大小，作为对某些侧信道攻击的缓解措施。
    这些混淆字段默认包含，但会为数据流带来少量
    开销。如果你信任客户端与服务端之间的网络链路，可以将 `include_obfuscation` 设置为
    设置为 false 以优化带宽。
    你的应用与 OpenAI API 之间。

  - `include_usage: optional boolean`

    如果设置，将在之前流式传输一个额外的分块 `data: [DONE]`
    消息。该 `usage` 字段表示整个请求的令牌用量统计，
    而该字段 `choices` 始终为一个空的
    数组。

    所有其他分块也将包含一个 `usage` 字段，但其值为
    null。 **注意：** 如果流被中断，你可能无法收到
    包含该请求总令牌用量的最终 usage 分块。

- `temperature: optional number or null`

  使用的采样温度，介于 0 到 2 之间。较高的值（例如 0.8）会使输出更加随机，而较低的值（例如 0.2）会使输出更加集中和确定。
  我们通常建议调整此项或 `top_p` ，但不要同时调整两者。

- `tool_choice: optional ChatCompletionToolChoiceOption`

  控制模型调用哪个工具（如果有）。
  `none` 表示模型不会调用任何工具，而是生成一条消息。
  `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
  `required` 表示模型必须调用一个或多个工具。
  通过 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

  `none` 是在没有工具时的默认值。 `auto` 是在有工具时的默认值。

  - `ToolChoiceMode = "none" or "auto" or "required"`

    `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。 `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ChatCompletionAllowedToolChoice object { allowed_tools, type }`

    将模型可用的工具限制为预定义集合。

    - `allowed_tools: ChatCompletionAllowedTools`

      将模型可用的工具限制为预定义集合。

      - `mode: "auto" or "required"`

        将模型可用的工具限制为预定义集合。

        `auto` 允许模型从允许的工具中选取并生成一个
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

    指定模型应使用的工具。可用于强制模型调用特定函数。

    - `function: object { name }`

      - `name: string`

        要调用的函数名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ChatCompletionNamedToolChoiceCustom object { custom, type }`

    指定模型应使用的工具。可用于强制模型调用特定的自定义工具。

    - `custom: object { name }`

      - `name: string`

        要调用的自定义工具的名称。

    - `type: "custom"`

      对于自定义工具调用，类型始终为 `custom`.

      - `"custom"`

- `tools: optional array of ChatCompletionTool`

  模型可调用的工具列表。你可以提供
  [自定义工具](/api/docs/guides/function-calling#custom-tools) 或
  [函数工具](/api/docs/guides/function-calling).

  - `ChatCompletionFunctionTool object { function, type }`

    可用于生成响应的函数工具。

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短横线，最大长度为 64。

      - `description: optional string`

        对函数作用的描述，供模型用来决定何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，以 JSON Schema 对象形式描述。参见 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 关于该格式的文档，请参阅。

        省略 `parameters` 用于定义一个空参数列表的函数。

      - `strict: optional boolean or null`

        在生成函数调用时是否启用严格的模式遵循。如果设置为 true，模型将遵循在 `parameters` 字段中。当 strict 为 true 时，仅支持 JSON Schema 的一个子集。 `strict` 为 `true`。中定义的精确模式。在 [函数调用指南](/api/docs/guides/function-calling).

    - `type: "function"`

      工具的类型。当前，仅 `function` 的类型。

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

        自定义工具的输入格式。默认为无约束文本。

        - `Text object { type }`

          无约束的自由格式文本。

          - `type: "text"`

            无约束文本格式。始终 `text`.

            - `"text"`

        - `Grammar object { grammar, type }`

          由用户定义的语法。

          - `grammar: object { definition, syntax }`

            你选择的语法。

            - `definition: string`

              语法定义。

            - `syntax: "lark" or "regex"`

              语法定义的语法。其一为 `lark` 或 `regex`.

              - `"lark"`

              - `"regex"`

          - `type: "grammar"`

            语法格式。始终为 `grammar`.

            - `"grammar"`

    - `type: "custom"`

      自定义工具的类型。始终为 `custom`.

      - `"custom"`

- `top_logprobs: optional number or null`

  一个介于 0 到 20 之间的整数，用于指定每个 token 位置返回的最大最可能
  token 数量，每个 token 带有对应的对数
  概率。在某些情况下，返回的 token 数量可能少于
  所请求的数量。
  `logprobs` 必须设置为 `true` 才能使用此参数。

- `top_p: optional number or null`

  一种 temperature 采样的替代方法，称为 nucleus 采样，
  模型会考虑具有 top_p 概率质量的 token 结果
  。因此 0.1 表示仅考虑构成前 10% 概率质量的 token
  。

  我们通常建议调整此项或 `temperature` ，但不要同时调整两者。

- `user: optional string`

  此字段正在被 `safety_identifier` 和 `prompt_cache_key`。替代。请使用 `prompt_cache_key` 以维持缓存优化效果。
  你终端用户的稳定标识符。
  用于通过更好地对相似请求进行分桶来提升缓存命中率，并帮助 OpenAI 检测和防止滥用。 [了解更多](/api/docs/guides/safety-best-practices#implement-safety-identifiers).

- `verbosity: optional "low" or "medium" or "high" or null`

  约束模型回复的详细程度。较低的值会产生
  更简洁的回复，而较高的值会产生更详尽的回复。
  当前支持的值包括 `low`, `medium`，和 `high`。默认值为
  `medium`.

  - `"low"`

  - `"medium"`

  - `"high"`

- `web_search_options: optional object { search_context_size, user_location }`

  此工具会搜索网页以获取可在回复中使用的相关结果。
  详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

  - `search_context_size: optional "low" or "medium" or "high"`

    用于搜索的上下文窗口空间使用量的高级指导。
    取值之一为 `low`, `medium`，或 `high`. `medium` 为默认值。

    - `"low"`

    - `"medium"`

    - `"high"`

  - `user_location: optional object { approximate, type }  or null`

    搜索所用的近似位置参数。

    - `approximate: object { city, country, region, timezone }`

      搜索所用的近似位置参数。

      - `city: optional string`

        用户所在城市的自由文本输入，例如 `San Francisco`.

      - `country: optional string`

        两位字母的
        [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户的，
        例如。 `US`.

      - `region: optional string`

        用户所在区域的自由文本输入，例如 `California`.

      - `timezone: optional string`

        该 [IANA timezone](https://timeapi.io/documentation/iana-timezones)
        的用户，例如。 `America/Los_Angeles`.

    - `type: "approximate"`

      位置近似值的类型。始终为 `approximate`.

      - `"approximate"`

### Returns

- `ChatCompletion object { id, choices, created, 7 more }`

  表示由模型根据提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项列表。如果 `n` 大于 1，则可以包含多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。该值为 `stop` 表示模型遇到自然停止点或提供了停止序列，
      `length` 表示已达到请求中指定的 token 上限，
      `content_filter` 表示内容因我们的内容过滤器标记而被省略，
      `tool_calls` 表示模型调用了工具，或者 `function_call` （已弃用）表示模型调用了函数。
      请阅读 [Model Spec](https://model-spec.openai.com/2025-12-18.html) 以了解更多信息。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      该选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      该选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息内容 token 列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

        - `logprob: number`

          该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 及其对数概率的列表。条目数量可能少于所请求的 `top_logprobs`.

          - `token: string`

            该 token。

          - `bytes: array of number or null`

            表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

          - `logprob: number`

            该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含拒绝消息 token 及其对数概率信息的列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

        - `logprob: number`

          该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 及其对数概率的列表。条目数量可能少于所请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        该消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        在适用情况下（例如使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          该 URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用第一个字符的索引。

          - `title: string`

            该网页资源的标题。

          - `url: string`

            该网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关
        模型音频响应的数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          该音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          该音频响应在服务端不再可用于多轮
          对话的 Unix 时间戳（秒）。
          对话。

        - `transcript: string`

          模型生成的音频的文字记录。

      - `function_call: optional object { arguments, name }`

        已弃用并替换为 `tool_calls`。模型生成的、应当被调用的函数名称及其参数。

        - `arguments: string`

          调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型所调用的函数。

            - `arguments: string`

              调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。当前，仅 `function` 的类型。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          对模型创建的自定义工具的调用。

          - `id: string`

            工具调用的 ID。

          - `custom: object { input, name }`

            模型所调用的自定义工具。

            - `input: string`

              模型生成的自定义工具调用的输入。

            - `name: string`

              要调用的自定义工具的名称。

          - `type: "custom"`

            工具的类型。始终为 `custom`.

            - `"custom"`

  - `created: number`

    聊天补全创建时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    由 16 个键值对组成的集合，可以附加到对象上。可用于
    以结构化格式存储有关对象的附加信息，并通过
    API 或控制台查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入和生成输出的审核结果（如果请求了审核补全）
    。

    - `input: object { model, results, type }  or object { code, message, type }`

      针对请求输入的审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任意类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （适用于成功的审核结果）。

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

      对生成输出进行内容审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任意类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （适用于成功的审核结果）。

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

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 如需在请求级别选择 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中包含 `service_tier=fast` 或 `service_tier=priority` 参数。响应将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。
    - 未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体将根据实际用于处理请求的处理模式包含相应的 `service_tier` 值。此响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行时所使用的后端配置。

    可与 `seed` request 参数结合使用，以了解何时进行了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    完成请求的使用情况统计信息。

    - `completion_tokens: number`

      生成完成内容中的令牌数。

    - `prompt_tokens: number`

      提示词中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示词 + 完成内容）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      完成内容中所使用令牌的明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        预测中出现在完成内容里的令牌数。

      - `audio_tokens: optional number`

        模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在完成内容中的预测。但是，与
        推理令牌一样，这些令牌仍计入
        用于计费、输出和上下文窗口的
        完成内容令牌总数中。

      - `text_tokens: optional number`

        模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中所使用令牌的明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的缓存 token。

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
    "model": "gpt-6-astra",
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
  "model": "gpt-6-astra",
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
        ]
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
  },
  "system_fingerprint": null
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
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-6-astra", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"role":"assistant","content":""},"logprobs":null,"finish_reason":null}]}

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-6-astra", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"content":"Hello"},"logprobs":null,"finish_reason":null}]}

....

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-6-astra", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{},"logprobs":null,"finish_reason":"stop"}]}
```

## 删除聊天补全

**delete** `/chat/completions/{completion_id}`

删除已存储的聊天补全。只能删除使用
参数设置为 `store` 参数创建的 `true` 聊天补全。

### 路径参数

- `completion_id: string`

### Returns

- `ChatCompletionDeleted object { id, deleted, object }`

  - `id: string`

    已删除的聊天补全的 ID。

  - `deleted: boolean`

    聊天补全是否已删除。

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

列出已存储的 Chat Completions。仅返回使用 store 参数存储的
参数存储的 Chat Completions `store` 参数创建的 `true` 的 Chat Completions。

### 查询参数

- `after: optional string`

  上一次分页请求中最后一条 Chat Completions 的标识符。

- `limit: optional number`

  要检索的 Chat Completions 数量。

- `metadata: optional Metadata or null`

  用于按元数据键筛选 Chat Completions 的列表。例如：

  `metadata[key1]=value1&metadata[key2]=value2`

- `model: optional string`

  用于生成这些 Chat Completions 的模型。

- `order: optional "asc" or "desc"`

  按时间戳对 Chat Completions 进行排序的顺序。使用 `asc` 表示升序，或使用 `desc` 表示降序。默认为 `asc`.

  - `"asc"`

  - `"desc"`

### Returns

- `data: array of ChatCompletion`

  一个包含 chat completion 对象的数组。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项列表。如果 `n` 大于 1，则可以包含多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。该值为 `stop` 表示模型遇到自然停止点或提供了停止序列，
      `length` 表示已达到请求中指定的 token 上限，
      `content_filter` 表示内容因我们的内容过滤器标记而被省略，
      `tool_calls` 表示模型调用了工具，或者 `function_call` （已弃用）表示模型调用了函数。
      请阅读 [Model Spec](https://model-spec.openai.com/2025-12-18.html) 以了解更多信息。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      该选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      该选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息内容 token 列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

        - `logprob: number`

          该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 及其对数概率的列表。条目数量可能少于所请求的 `top_logprobs`.

          - `token: string`

            该 token。

          - `bytes: array of number or null`

            表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

          - `logprob: number`

            该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含拒绝消息 token 及其对数概率信息的列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

        - `logprob: number`

          该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 及其对数概率的列表。条目数量可能少于所请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        该消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        在适用情况下（例如使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          该 URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用第一个字符的索引。

          - `title: string`

            该网页资源的标题。

          - `url: string`

            该网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关
        模型音频响应的数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          该音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          该音频响应在服务端不再可用于多轮
          对话的 Unix 时间戳（秒）。
          对话。

        - `transcript: string`

          模型生成的音频的文字记录。

      - `function_call: optional object { arguments, name }`

        已弃用并替换为 `tool_calls`。模型生成的、应当被调用的函数名称及其参数。

        - `arguments: string`

          调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型所调用的函数。

            - `arguments: string`

              调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。当前，仅 `function` 的类型。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          对模型创建的自定义工具的调用。

          - `id: string`

            工具调用的 ID。

          - `custom: object { input, name }`

            模型所调用的自定义工具。

            - `input: string`

              模型生成的自定义工具调用的输入。

            - `name: string`

              要调用的自定义工具的名称。

          - `type: "custom"`

            工具的类型。始终为 `custom`.

            - `"custom"`

  - `created: number`

    聊天补全创建时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    由 16 个键值对组成的集合，可以附加到对象上。可用于
    以结构化格式存储有关对象的附加信息，并通过
    API 或控制台查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入和生成输出的审核结果（如果请求了审核补全）
    。

    - `input: object { model, results, type }  or object { code, message, type }`

      针对请求输入的审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任意类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （适用于成功的审核结果）。

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

      对生成输出进行内容审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任意类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （适用于成功的审核结果）。

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

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 如需在请求级别选择 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中包含 `service_tier=fast` 或 `service_tier=priority` 参数。响应将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。
    - 未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体将根据实际用于处理请求的处理模式包含相应的 `service_tier` 值。此响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行时所使用的后端配置。

    可与 `seed` request 参数结合使用，以了解何时进行了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    完成请求的使用情况统计信息。

    - `completion_tokens: number`

      生成完成内容中的令牌数。

    - `prompt_tokens: number`

      提示词中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示词 + 完成内容）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      完成内容中所使用令牌的明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        预测中出现在完成内容里的令牌数。

      - `audio_tokens: optional number`

        模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在完成内容中的预测。但是，与
        推理令牌一样，这些令牌仍计入
        用于计费、输出和上下文窗口的
        完成内容令牌总数中。

      - `text_tokens: optional number`

        模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中所使用令牌的明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的缓存 token。

      - `image_tokens: optional number`

        提示中存在的图像输入 token。

      - `text_tokens: optional number`

        提示中存在的文本输入 token。

- `first_id: string`

  数据数组中第一条 chat completion 的标识符。

- `has_more: boolean`

  指示是否还有更多可用的 Chat Completions。

- `last_id: string`

  数据数组中最后一条 chat completion 的标识符。

- `object: "list"`

  此对象的类型。始终设置为 "list"。

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

获取已存储的聊天补全。仅限已创建的 Chat Completions
参数存储的 Chat Completions `store` 参数创建的 `true` 的 Chat Completions。

### 路径参数

- `completion_id: string`

### Returns

- `ChatCompletion object { id, choices, created, 7 more }`

  表示由模型根据提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项列表。如果 `n` 大于 1，则可以包含多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。该值为 `stop` 表示模型遇到自然停止点或提供了停止序列，
      `length` 表示已达到请求中指定的 token 上限，
      `content_filter` 表示内容因我们的内容过滤器标记而被省略，
      `tool_calls` 表示模型调用了工具，或者 `function_call` （已弃用）表示模型调用了函数。
      请阅读 [Model Spec](https://model-spec.openai.com/2025-12-18.html) 以了解更多信息。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      该选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      该选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息内容 token 列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

        - `logprob: number`

          该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 及其对数概率的列表。条目数量可能少于所请求的 `top_logprobs`.

          - `token: string`

            该 token。

          - `bytes: array of number or null`

            表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

          - `logprob: number`

            该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含拒绝消息 token 及其对数概率信息的列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

        - `logprob: number`

          该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 及其对数概率的列表。条目数量可能少于所请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        该消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        在适用情况下（例如使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          该 URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用第一个字符的索引。

          - `title: string`

            该网页资源的标题。

          - `url: string`

            该网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关
        模型音频响应的数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          该音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          该音频响应在服务端不再可用于多轮
          对话的 Unix 时间戳（秒）。
          对话。

        - `transcript: string`

          模型生成的音频的文字记录。

      - `function_call: optional object { arguments, name }`

        已弃用并替换为 `tool_calls`。模型生成的、应当被调用的函数名称及其参数。

        - `arguments: string`

          调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型所调用的函数。

            - `arguments: string`

              调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。当前，仅 `function` 的类型。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          对模型创建的自定义工具的调用。

          - `id: string`

            工具调用的 ID。

          - `custom: object { input, name }`

            模型所调用的自定义工具。

            - `input: string`

              模型生成的自定义工具调用的输入。

            - `name: string`

              要调用的自定义工具的名称。

          - `type: "custom"`

            工具的类型。始终为 `custom`.

            - `"custom"`

  - `created: number`

    聊天补全创建时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    由 16 个键值对组成的集合，可以附加到对象上。可用于
    以结构化格式存储有关对象的附加信息，并通过
    API 或控制台查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入和生成输出的审核结果（如果请求了审核补全）
    。

    - `input: object { model, results, type }  or object { code, message, type }`

      针对请求输入的审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任意类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （适用于成功的审核结果）。

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

      对生成输出进行内容审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任意类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （适用于成功的审核结果）。

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

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 如需在请求级别选择 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中包含 `service_tier=fast` 或 `service_tier=priority` 参数。响应将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。
    - 未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体将根据实际用于处理请求的处理模式包含相应的 `service_tier` 值。此响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行时所使用的后端配置。

    可与 `seed` request 参数结合使用，以了解何时进行了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    完成请求的使用情况统计信息。

    - `completion_tokens: number`

      生成完成内容中的令牌数。

    - `prompt_tokens: number`

      提示词中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示词 + 完成内容）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      完成内容中所使用令牌的明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        预测中出现在完成内容里的令牌数。

      - `audio_tokens: optional number`

        模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在完成内容中的预测。但是，与
        推理令牌一样，这些令牌仍计入
        用于计费、输出和上下文窗口的
        完成内容令牌总数中。

      - `text_tokens: optional number`

        模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中所使用令牌的明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的缓存 token。

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

修改已存储的聊天补全。仅限已
参数设置为 `store` 参数创建的 `true` 的聊天补全可被修改。目前，
唯一支持的修改是更新 `metadata` 字段。

### 路径参数

- `completion_id: string`

### Body 参数

- `metadata: Metadata or null`

  由 16 个键值对组成的集合，可以附加到对象上。可用于
  以结构化格式存储有关对象的附加信息，并通过
  API 或控制台查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串
  ，最大长度为 512 个字符。

### Returns

- `ChatCompletion object { id, choices, created, 7 more }`

  表示由模型根据提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项列表。如果 `n` 大于 1，则可以包含多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。该值为 `stop` 表示模型遇到自然停止点或提供了停止序列，
      `length` 表示已达到请求中指定的 token 上限，
      `content_filter` 表示内容因我们的内容过滤器标记而被省略，
      `tool_calls` 表示模型调用了工具，或者 `function_call` （已弃用）表示模型调用了函数。
      请阅读 [Model Spec](https://model-spec.openai.com/2025-12-18.html) 以了解更多信息。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      该选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      该选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息内容 token 列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

        - `logprob: number`

          该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 及其对数概率的列表。条目数量可能少于所请求的 `top_logprobs`.

          - `token: string`

            该 token。

          - `bytes: array of number or null`

            表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

          - `logprob: number`

            该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含拒绝消息 token 及其对数概率信息的列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

        - `logprob: number`

          该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 及其对数概率的列表。条目数量可能少于所请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        该消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        在适用情况下（例如使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          该 URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用第一个字符的索引。

          - `title: string`

            该网页资源的标题。

          - `url: string`

            该网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关
        模型音频响应的数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          该音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          该音频响应在服务端不再可用于多轮
          对话的 Unix 时间戳（秒）。
          对话。

        - `transcript: string`

          模型生成的音频的文字记录。

      - `function_call: optional object { arguments, name }`

        已弃用并替换为 `tool_calls`。模型生成的、应当被调用的函数名称及其参数。

        - `arguments: string`

          调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型所调用的函数。

            - `arguments: string`

              调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。当前，仅 `function` 的类型。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          对模型创建的自定义工具的调用。

          - `id: string`

            工具调用的 ID。

          - `custom: object { input, name }`

            模型所调用的自定义工具。

            - `input: string`

              模型生成的自定义工具调用的输入。

            - `name: string`

              要调用的自定义工具的名称。

          - `type: "custom"`

            工具的类型。始终为 `custom`.

            - `"custom"`

  - `created: number`

    聊天补全创建时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    由 16 个键值对组成的集合，可以附加到对象上。可用于
    以结构化格式存储有关对象的附加信息，并通过
    API 或控制台查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入和生成输出的审核结果（如果请求了审核补全）
    。

    - `input: object { model, results, type }  or object { code, message, type }`

      针对请求输入的审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任意类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （适用于成功的审核结果）。

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

      对生成输出进行内容审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任意类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （适用于成功的审核结果）。

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

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 如需在请求级别选择 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中包含 `service_tier=fast` 或 `service_tier=priority` 参数。响应将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。
    - 未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体将根据实际用于处理请求的处理模式包含相应的 `service_tier` 值。此响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行时所使用的后端配置。

    可与 `seed` request 参数结合使用，以了解何时进行了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    完成请求的使用情况统计信息。

    - `completion_tokens: number`

      生成完成内容中的令牌数。

    - `prompt_tokens: number`

      提示词中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示词 + 完成内容）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      完成内容中所使用令牌的明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        预测中出现在完成内容里的令牌数。

      - `audio_tokens: optional number`

        模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在完成内容中的预测。但是，与
        推理令牌一样，这些令牌仍计入
        用于计费、输出和上下文窗口的
        完成内容令牌总数中。

      - `text_tokens: optional number`

        模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中所使用令牌的明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的缓存 token。

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

## Domain Types

### Chat Completion Allowed Tools

- `ChatCompletionAllowedTools object { mode, tools }`

  将模型可用的工具限制为预定义集合。

  - `mode: "auto" or "required"`

    将模型可用的工具限制为预定义集合。

    `auto` 允许模型从允许的工具中选取并生成一个
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

### Chat Completion

- `ChatCompletion object { id, choices, created, 7 more }`

  表示由模型根据提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项列表。如果 `n` 大于 1，则可以包含多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。该值为 `stop` 表示模型遇到自然停止点或提供了停止序列，
      `length` 表示已达到请求中指定的 token 上限，
      `content_filter` 表示内容因我们的内容过滤器标记而被省略，
      `tool_calls` 表示模型调用了工具，或者 `function_call` （已弃用）表示模型调用了函数。
      请阅读 [Model Spec](https://model-spec.openai.com/2025-12-18.html) 以了解更多信息。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      该选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      该选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息内容 token 列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

        - `logprob: number`

          该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 及其对数概率的列表。条目数量可能少于所请求的 `top_logprobs`.

          - `token: string`

            该 token。

          - `bytes: array of number or null`

            表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

          - `logprob: number`

            该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含拒绝消息 token 及其对数概率信息的列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

        - `logprob: number`

          该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 及其对数概率的列表。条目数量可能少于所请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        该消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        在适用情况下（例如使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          该 URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用第一个字符的索引。

          - `title: string`

            该网页资源的标题。

          - `url: string`

            该网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关
        模型音频响应的数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          该音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          该音频响应在服务端不再可用于多轮
          对话的 Unix 时间戳（秒）。
          对话。

        - `transcript: string`

          模型生成的音频的文字记录。

      - `function_call: optional object { arguments, name }`

        已弃用并替换为 `tool_calls`。模型生成的、应当被调用的函数名称及其参数。

        - `arguments: string`

          调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型所调用的函数。

            - `arguments: string`

              调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。当前，仅 `function` 的类型。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          对模型创建的自定义工具的调用。

          - `id: string`

            工具调用的 ID。

          - `custom: object { input, name }`

            模型所调用的自定义工具。

            - `input: string`

              模型生成的自定义工具调用的输入。

            - `name: string`

              要调用的自定义工具的名称。

          - `type: "custom"`

            工具的类型。始终为 `custom`.

            - `"custom"`

  - `created: number`

    聊天补全创建时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    由 16 个键值对组成的集合，可以附加到对象上。可用于
    以结构化格式存储有关对象的附加信息，并通过
    API 或控制台查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入和生成输出的审核结果（如果请求了审核补全）
    。

    - `input: object { model, results, type }  or object { code, message, type }`

      针对请求输入的审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任意类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （适用于成功的审核结果）。

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

      对生成输出进行内容审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任意类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （适用于成功的审核结果）。

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

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 如需在请求级别选择 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中包含 `service_tier=fast` 或 `service_tier=priority` 参数。响应将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。
    - 未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体将根据实际用于处理请求的处理模式包含相应的 `service_tier` 值。此响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行时所使用的后端配置。

    可与 `seed` request 参数结合使用，以了解何时进行了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    完成请求的使用情况统计信息。

    - `completion_tokens: number`

      生成完成内容中的令牌数。

    - `prompt_tokens: number`

      提示词中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示词 + 完成内容）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      完成内容中所使用令牌的明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        预测中出现在完成内容里的令牌数。

      - `audio_tokens: optional number`

        模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在完成内容中的预测。但是，与
        推理令牌一样，这些令牌仍计入
        用于计费、输出和上下文窗口的
        完成内容令牌总数中。

      - `text_tokens: optional number`

        模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中所使用令牌的明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的缓存 token。

      - `image_tokens: optional number`

        提示中存在的图像输入 token。

      - `text_tokens: optional number`

        提示中存在的文本输入 token。

### Chat Completion Allowed Tool Choice

- `ChatCompletionAllowedToolChoice object { allowed_tools, type }`

  将模型可用的工具限制为预定义集合。

  - `allowed_tools: ChatCompletionAllowedTools`

    将模型可用的工具限制为预定义集合。

    - `mode: "auto" or "required"`

      将模型可用的工具限制为预定义集合。

      `auto` 允许模型从允许的工具中选取并生成一个
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

### Chat Completion Assistant Message Param

- `ChatCompletionAssistantMessageParam object { role, audio, content, 4 more }`

  模型针对用户消息回复时发送的消息。

  - `role: "assistant"`

    消息作者的角色，此处为 `assistant`.

    - `"assistant"`

  - `audio: optional object { id }  or null`

    关于模型先前音频响应的数据。
    [了解更多](/api/docs/guides/audio).

    - `id: string`

      模型先前音频响应的唯一标识符。

  - `content: optional string or array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal or null`

    助手消息的内容。除非指定了 `tool_calls` 或 `function_call` ，否则此项为必需。

    - `TextContent = string`

      助手消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal`

      由已定义类型组成的内容部分数组。可以是以下类型的一个或多个 `text`，或以下类型的恰好一个 `refusal`.

      - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

        了解 [文本输入](/api/docs/guides/text).

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ChatCompletionContentPartRefusal object { refusal, type }`

        - `refusal: string`

          模型生成的拒绝消息。

        - `type: "refusal"`

          内容部分的类型。

          - `"refusal"`

  - `function_call: optional object { arguments, name }  or null`

    已弃用并替换为 `tool_calls`。模型生成的、应当被调用的函数名称及其参数。

    - `arguments: string`

      调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

    - `name: string`

      要调用的函数名称。

  - `name: optional string`

    参与者的可选名称。为模型提供信息以区分同一角色的不同参与者。

  - `refusal: optional string or null`

    助手给出的拒绝消息。

  - `tool_calls: optional array of ChatCompletionMessageToolCall`

    模型生成的工具调用，例如函数调用。

    - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

      对模型创建的函数工具的调用。

      - `id: string`

        工具调用的 ID。

      - `function: object { arguments, name }`

        模型所调用的函数。

        - `arguments: string`

          调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `type: "function"`

        工具的类型。当前，仅 `function` 的类型。

        - `"function"`

    - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

      对模型创建的自定义工具的调用。

      - `id: string`

        工具调用的 ID。

      - `custom: object { input, name }`

        模型所调用的自定义工具。

        - `input: string`

          模型生成的自定义工具调用的输入。

        - `name: string`

          要调用的自定义工具的名称。

      - `type: "custom"`

        工具的类型。始终为 `custom`.

        - `"custom"`

### Chat Completion Audio

- `ChatCompletionAudio object { id, data, expires_at, transcript }`

  如果请求了音频输出模态，则此对象包含有关
  模型音频响应的数据。 [了解更多](/api/docs/guides/audio).

  - `id: string`

    该音频响应的唯一标识符。

  - `data: string`

    由模型生成的 Base64 编码音频字节，格式为
    请求中指定的格式。

  - `expires_at: number`

    该音频响应在服务端不再可用于多轮
    对话的 Unix 时间戳（秒）。
    对话。

  - `transcript: string`

    模型生成的音频的文字记录。

### Chat Completion Audio Param

- `ChatCompletionAudioParam object { format, voice }`

  音频输出的参数。当使用以下方式请求音频输出时为必填
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

    模型用于回复的声音。支持的内置声音包括
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `nova`, `onyx`,
    `sage`, `shimmer`, `marin`，和 `cedar`。你也可以提供
    自定义声音对象，并附带 `id`，例如 `{ "id": "voice_1234" }`.

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

### Chat Completion Chunk

- `ChatCompletionChunk object { id, choices, created, 7 more }`

  表示由模型基于提供的输入返回的聊天补全响应的流式分块。
  由模型基于提供的输入返回。
  [了解更多](/api/docs/guides/streaming-responses).

  - `id: string`

    聊天补全的唯一标识符。每个分块具有相同的 ID。

  - `choices: array of object { delta, finish_reason, index, logprobs }`

    聊天补全选项列表。如果 `n` 大于 1，则可以包含多个元素。如果你在
    中设置了 `stream_options: {"include_usage": true}`.

    - `delta: object { content, function_call, refusal, 2 more }`

      由流式模型响应生成的聊天补全增量。

      - `content: optional string or null`

        分块消息的内容。

      - `function_call: optional object { arguments, name }`

        已弃用并替换为 `tool_calls`。模型生成的、应当被调用的函数名称及其参数。

        - `arguments: optional string`

          调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

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

            调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

          - `name: optional string`

            要调用的函数名称。

        - `type: optional "function"`

          工具的类型。当前，仅 `function` 的类型。

          - `"function"`

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more or null`

      模型停止生成 token 的原因。该值为 `stop` 表示模型遇到自然停止点或提供了停止序列，
      `length` 表示已达到请求中指定的 token 上限，
      `content_filter` 表示内容因我们的内容过滤器标记而被省略，
      `tool_calls` 表示模型调用了工具，或者 `function_call` （已弃用）表示模型调用了函数。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      该选项在选项列表中的索引。

    - `logprobs: optional object { content, refusal }  or null`

      该选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息内容 token 列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

        - `logprob: number`

          该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 及其对数概率的列表。条目数量可能少于所请求的 `top_logprobs`.

          - `token: string`

            该 token。

          - `bytes: array of number or null`

            表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

          - `logprob: number`

            该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含拒绝消息 token 及其对数概率信息的列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

        - `logprob: number`

          该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 及其对数概率的列表。条目数量可能少于所请求的 `top_logprobs`.

  - `created: number`

    聊天补全创建时的 Unix 时间戳（以秒为单位）。每个分块具有相同的时间戳。

  - `model: string`

    用于生成补全的模型。

  - `object: "chat.completion.chunk"`

    对象类型，始终为 `chat.completion.chunk`.

    - `"chat.completion.chunk"`

  - `moderation: optional object { input, output }  or null`

    针对请求输入和生成输出的审核结果。在请求启用
    审核补全时，该字段会出现在审核分块上。

    - `input: object { model, results, type }  or object { code, message, type }`

      针对请求输入的审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任意类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （适用于成功的审核结果）。

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

      对生成输出进行内容审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任意类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，始终为 `moderation_result` （适用于成功的审核结果）。

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

    添加的混淆字符串，用于将流式分块的大小标准化，作为
    针对某些侧信道攻击的缓解措施。默认包含此字段，当
    时省略 `stream_options.include_obfuscation` 为 `false`.

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的处理类型。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 如需在请求级别选择 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中包含 `service_tier=fast` 或 `service_tier=priority` 参数。响应将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。
    - 未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体将根据实际用于处理请求的处理模式包含相应的 `service_tier` 值。此响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行所用的后端配置。
    可与 `seed` request 参数结合使用，以了解何时进行了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage or null`

    仅当你在请求中设置了
    `stream_options: {"include_usage": true}` 时才会出现的可选字段。出现时，它
    包含一个 null 值 **，最后一个分块除外** 其中包含
    整个请求的 token 使用统计信息。

    **注意：** 如果流被中断或取消，你可能无法
    收到包含
    整个请求 token 使用总量的最终 usage 数据块。

    - `completion_tokens: number`

      生成完成内容中的令牌数。

    - `prompt_tokens: number`

      提示词中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示词 + 完成内容）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      完成内容中所使用令牌的明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        预测中出现在完成内容里的令牌数。

      - `audio_tokens: optional number`

        模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在完成内容中的预测。但是，与
        推理令牌一样，这些令牌仍计入
        用于计费、输出和上下文窗口的
        完成内容令牌总数中。

      - `text_tokens: optional number`

        模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中所使用令牌的明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的缓存 token。

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

      内容部分的类型。

      - `"text"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

      - `mode: "explicit"`

        断点模式。始终 `explicit`.

        - `"explicit"`

  - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

    了解 [图像输入](/api/docs/guides/images-vision).

    - `image_url: object { url, detail }`

      - `url: string`

        图像的 URL 或 base64 编码的图像数据。

      - `detail: optional "auto" or "low" or "high"`

        指定图像的细节级别。了解更多，请参阅 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

        - `"auto"`

        - `"low"`

        - `"high"`

    - `type: "image_url"`

      内容部分的类型。

      - `"image_url"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

      - `mode: "explicit"`

        断点模式。始终 `explicit`.

        - `"explicit"`

  - `ChatCompletionContentPartInputAudio object { input_audio, type, prompt_cache_breakpoint }`

    了解 [音频输入](/api/docs/guides/audio).

    - `input_audio: object { data, format }`

      - `data: string`

        Base64 编码的音频数据。

      - `format: "wav" or "mp3"`

        编码音频数据的格式。当前支持 "wav" 和 "mp3"。

        - `"wav"`

        - `"mp3"`

    - `type: "input_audio"`

      内容部分的类型。始终为 `input_audio`.

      - `"input_audio"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

      - `mode: "explicit"`

        断点模式。始终 `explicit`.

        - `"explicit"`

  - `FileContentPart object { file, type, prompt_cache_breakpoint }`

    了解 [文件输入](/api/docs/guides/text) 用于文本生成。

    - `file: object { file_data, file_id, filename }`

      - `file_data: optional string`

        Base64 编码的文件数据，在将文件作为字符串传递给模型时使用
        。

      - `file_id: optional string`

        用作输入的上传文件的 ID。

      - `filename: optional string`

        文件的名称，在将文件作为
        字符串传递给模型时使用。

    - `type: "file"`

      内容部分的类型。始终为 `file`.

      - `"file"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

      - `mode: "explicit"`

        断点模式。始终 `explicit`.

        - `"explicit"`

### Chat Completion Content Part Image

- `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

  了解 [图像输入](/api/docs/guides/images-vision).

  - `image_url: object { url, detail }`

    - `url: string`

      图像的 URL 或 base64 编码的图像数据。

    - `detail: optional "auto" or "low" or "high"`

      指定图像的细节级别。了解更多，请参阅 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

      - `"auto"`

      - `"low"`

      - `"high"`

  - `type: "image_url"`

    内容部分的类型。

    - `"image_url"`

  - `prompt_cache_breakpoint: optional object { mode }`

    标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

    - `mode: "explicit"`

      断点模式。始终 `explicit`.

      - `"explicit"`

### Chat Completion Content Part Input Audio

- `ChatCompletionContentPartInputAudio object { input_audio, type, prompt_cache_breakpoint }`

  了解 [音频输入](/api/docs/guides/audio).

  - `input_audio: object { data, format }`

    - `data: string`

      Base64 编码的音频数据。

    - `format: "wav" or "mp3"`

      编码音频数据的格式。当前支持 "wav" 和 "mp3"。

      - `"wav"`

      - `"mp3"`

  - `type: "input_audio"`

    内容部分的类型。始终为 `input_audio`.

    - `"input_audio"`

  - `prompt_cache_breakpoint: optional object { mode }`

    标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

    - `mode: "explicit"`

      断点模式。始终 `explicit`.

      - `"explicit"`

### Chat Completion Content Part Refusal

- `ChatCompletionContentPartRefusal object { refusal, type }`

  - `refusal: string`

    模型生成的拒绝消息。

  - `type: "refusal"`

    内容部分的类型。

    - `"refusal"`

### Chat Completion Content Part Text

- `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

  了解 [文本输入](/api/docs/guides/text).

  - `text: string`

    文本内容。

  - `type: "text"`

    内容部分的类型。

    - `"text"`

  - `prompt_cache_breakpoint: optional object { mode }`

    标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

    - `mode: "explicit"`

      断点模式。始终 `explicit`.

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

      自定义工具的输入格式。默认为无约束文本。

      - `Text object { type }`

        无约束的自由格式文本。

        - `type: "text"`

          无约束文本格式。始终 `text`.

          - `"text"`

      - `Grammar object { grammar, type }`

        由用户定义的语法。

        - `grammar: object { definition, syntax }`

          你选择的语法。

          - `definition: string`

            语法定义。

          - `syntax: "lark" or "regex"`

            语法定义的语法。其一为 `lark` 或 `regex`.

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

    已删除的聊天补全的 ID。

  - `deleted: boolean`

    聊天补全是否已删除。

  - `object: "chat.completion.deleted"`

    被删除对象的类型。

    - `"chat.completion.deleted"`

### Chat Completion Developer Message Param

- `ChatCompletionDeveloperMessageParam object { content, role, name }`

  开发者提供的指令，模型应遵循这些指令，无论用户发送什么
  消息。对于 o1 及更高版本的模型， `developer` messages
  取代之前的 `system` messages。

  - `content: string or array of ChatCompletionContentPartText`

    开发者消息的内容。

    - `TextContent = string`

      开发者消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      由已定义类型组成的内容部分数组。对于开发者消息，仅支持 type 为 `text` 的类型。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

  - `role: "developer"`

    消息作者的角色，此处为 `developer`.

    - `"developer"`

  - `name: optional string`

    参与者的可选名称。为模型提供信息以区分同一角色的不同参与者。

### Chat Completion Function Call Option

- `ChatCompletionFunctionCallOption object { name }`

  通过 {"type": "function"} 指定某个具体函数 `{"name": "my_function"}` 会强制模型调用该函数。

  - `name: string`

    要调用的函数名称。

### Chat Completion Function Message Param

- `ChatCompletionFunctionMessageParam object { content, name, role }`

  - `content: string or null`

    函数消息的内容。

  - `name: string`

    要调用的函数名称。

  - `role: "function"`

    消息作者的角色，此处为 `function`.

    - `"function"`

### Chat Completion Function Tool

- `ChatCompletionFunctionTool object { function, type }`

  可用于生成响应的函数工具。

  - `function: FunctionDefinition`

    - `name: string`

      要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短横线，最大长度为 64。

    - `description: optional string`

      对函数作用的描述，供模型用来决定何时以及如何调用该函数。

    - `parameters: optional FunctionParameters`

      函数接受的参数，以 JSON Schema 对象形式描述。参见 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 关于该格式的文档，请参阅。

      省略 `parameters` 用于定义一个空参数列表的函数。

    - `strict: optional boolean or null`

      在生成函数调用时是否启用严格的模式遵循。如果设置为 true，模型将遵循在 `parameters` 字段中。当 strict 为 true 时，仅支持 JSON Schema 的一个子集。 `strict` 为 `true`。中定义的精确模式。在 [函数调用指南](/api/docs/guides/function-calling).

  - `type: "function"`

    工具的类型。当前，仅 `function` 的类型。

    - `"function"`

### Chat Completion Message

- `ChatCompletionMessage object { content, refusal, role, 4 more }`

  由模型生成的聊天补全消息。

  - `content: string or null`

    消息的内容。

  - `refusal: string or null`

    模型生成的拒绝消息。

  - `role: "assistant"`

    该消息作者的角色。

    - `"assistant"`

  - `annotations: optional array of object { type, url_citation }`

    在适用情况下（例如使用
    [网页搜索工具](/api/docs/guides/tools-web-search).

    - `type: "url_citation"`

      该 URL 引用的类型。始终为 `url_citation`.

      - `"url_citation"`

    - `url_citation: object { end_index, start_index, title, url }`

      使用网页搜索时的 URL 引用。

      - `end_index: number`

        消息中 URL 引用最后一个字符的索引。

      - `start_index: number`

        消息中 URL 引用第一个字符的索引。

      - `title: string`

        该网页资源的标题。

      - `url: string`

        该网页资源的 URL。

  - `audio: optional ChatCompletionAudio or null`

    如果请求了音频输出模态，则此对象包含有关
    模型音频响应的数据。 [了解更多](/api/docs/guides/audio).

    - `id: string`

      该音频响应的唯一标识符。

    - `data: string`

      由模型生成的 Base64 编码音频字节，格式为
      请求中指定的格式。

    - `expires_at: number`

      该音频响应在服务端不再可用于多轮
      对话的 Unix 时间戳（秒）。
      对话。

    - `transcript: string`

      模型生成的音频的文字记录。

  - `function_call: optional object { arguments, name }`

    已弃用并替换为 `tool_calls`。模型生成的、应当被调用的函数名称及其参数。

    - `arguments: string`

      调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

    - `name: string`

      要调用的函数名称。

  - `tool_calls: optional array of ChatCompletionMessageToolCall`

    模型生成的工具调用，例如函数调用。

    - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

      对模型创建的函数工具的调用。

      - `id: string`

        工具调用的 ID。

      - `function: object { arguments, name }`

        模型所调用的函数。

        - `arguments: string`

          调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `type: "function"`

        工具的类型。当前，仅 `function` 的类型。

        - `"function"`

    - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

      对模型创建的自定义工具的调用。

      - `id: string`

        工具调用的 ID。

      - `custom: object { input, name }`

        模型所调用的自定义工具。

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

    模型所调用的自定义工具。

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

    模型所调用的函数。

    - `arguments: string`

      调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

    - `name: string`

      要调用的函数名称。

  - `type: "function"`

    工具的类型。当前，仅 `function` 的类型。

    - `"function"`

### Chat Completion Message Param

- `ChatCompletionMessageParam = ChatCompletionDeveloperMessageParam or ChatCompletionSystemMessageParam or ChatCompletionUserMessageParam or 3 more`

  开发者提供的指令，模型应遵循这些指令，无论用户发送什么
  消息。对于 o1 及更高版本的模型， `developer` messages
  取代之前的 `system` messages。

  - `ChatCompletionDeveloperMessageParam object { content, role, name }`

    开发者提供的指令，模型应遵循这些指令，无论用户发送什么
    消息。对于 o1 及更高版本的模型， `developer` messages
    取代之前的 `system` messages。

    - `content: string or array of ChatCompletionContentPartText`

      开发者消息的内容。

      - `TextContent = string`

        开发者消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        由已定义类型组成的内容部分数组。对于开发者消息，仅支持 type 为 `text` 的类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

    - `role: "developer"`

      消息作者的角色，此处为 `developer`.

      - `"developer"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分同一角色的不同参与者。

  - `ChatCompletionSystemMessageParam object { content, role, name }`

    开发者提供的指令，模型应遵循这些指令，无论用户发送什么
    用户发送的消息。对于 o1 及更高模型，请改用 `developer` messages
    来完成此目的。

    - `content: string or array of ChatCompletionContentPartText`

      系统消息的内容。

      - `TextContent = string`

        系统消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        由已定义类型组成的内容部分数组。对于系统消息，仅支持类型 `text` 的类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

    - `role: "system"`

      消息作者的角色，此处为 `system`.

      - `"system"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分同一角色的不同参与者。

  - `ChatCompletionUserMessageParam object { content, role, name }`

    由终端用户发送的消息，包含提示词或额外的上下文
    信息。

    - `content: string or array of ChatCompletionContentPart`

      用户消息的内容。

      - `TextContent = string`

        消息的文本内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPart`

        由已定义类型组成的内容部分数组。支持的内容因用于生成响应的 [model](/api/docs/models) 而异。可以包含文本、图像或音频输入。

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/api/docs/guides/text).

          - `text: string`

            文本内容。

          - `type: "text"`

            内容部分的类型。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

        - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

          了解 [图像输入](/api/docs/guides/images-vision).

          - `image_url: object { url, detail }`

            - `url: string`

              图像的 URL 或 base64 编码的图像数据。

            - `detail: optional "auto" or "low" or "high"`

              指定图像的细节级别。了解更多，请参阅 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_url"`

            内容部分的类型。

            - `"image_url"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `ChatCompletionContentPartInputAudio object { input_audio, type, prompt_cache_breakpoint }`

          了解 [音频输入](/api/docs/guides/audio).

          - `input_audio: object { data, format }`

            - `data: string`

              Base64 编码的音频数据。

            - `format: "wav" or "mp3"`

              编码音频数据的格式。当前支持 "wav" 和 "mp3"。

              - `"wav"`

              - `"mp3"`

          - `type: "input_audio"`

            内容部分的类型。始终为 `input_audio`.

            - `"input_audio"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `FileContentPart object { file, type, prompt_cache_breakpoint }`

          了解 [文件输入](/api/docs/guides/text) 用于文本生成。

          - `file: object { file_data, file_id, filename }`

            - `file_data: optional string`

              Base64 编码的文件数据，在将文件作为字符串传递给模型时使用
              。

            - `file_id: optional string`

              用作输入的上传文件的 ID。

            - `filename: optional string`

              文件的名称，在将文件作为
              字符串传递给模型时使用。

          - `type: "file"`

            内容部分的类型。始终为 `file`.

            - `"file"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

    - `role: "user"`

      消息作者的角色，此处为 `user`.

      - `"user"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分同一角色的不同参与者。

  - `ChatCompletionAssistantMessageParam object { role, audio, content, 4 more }`

    模型针对用户消息回复时发送的消息。

    - `role: "assistant"`

      消息作者的角色，此处为 `assistant`.

      - `"assistant"`

    - `audio: optional object { id }  or null`

      关于模型先前音频响应的数据。
      [了解更多](/api/docs/guides/audio).

      - `id: string`

        模型先前音频响应的唯一标识符。

    - `content: optional string or array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal or null`

      助手消息的内容。除非指定了 `tool_calls` 或 `function_call` ，否则此项为必需。

      - `TextContent = string`

        助手消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal`

        由已定义类型组成的内容部分数组。可以是以下类型的一个或多个 `text`，或以下类型的恰好一个 `refusal`.

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/api/docs/guides/text).

        - `ChatCompletionContentPartRefusal object { refusal, type }`

          - `refusal: string`

            模型生成的拒绝消息。

          - `type: "refusal"`

            内容部分的类型。

            - `"refusal"`

    - `function_call: optional object { arguments, name }  or null`

      已弃用并替换为 `tool_calls`。模型生成的、应当被调用的函数名称及其参数。

      - `arguments: string`

        调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

      - `name: string`

        要调用的函数名称。

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分同一角色的不同参与者。

    - `refusal: optional string or null`

      助手给出的拒绝消息。

    - `tool_calls: optional array of ChatCompletionMessageToolCall`

      模型生成的工具调用，例如函数调用。

      - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

        对模型创建的函数工具的调用。

        - `id: string`

          工具调用的 ID。

        - `function: object { arguments, name }`

          模型所调用的函数。

          - `arguments: string`

            调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

          - `name: string`

            要调用的函数名称。

        - `type: "function"`

          工具的类型。当前，仅 `function` 的类型。

          - `"function"`

      - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

        对模型创建的自定义工具的调用。

        - `id: string`

          工具调用的 ID。

        - `custom: object { input, name }`

          模型所调用的自定义工具。

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

        包含已定义类型的若干内容片段组成的数组。对于工具消息，仅支持类型为 `text` 的类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

    - `role: "tool"`

      消息作者的角色，此处为 `tool`.

      - `"tool"`

    - `tool_call_id: string`

      此消息所响应的工具调用。

  - `ChatCompletionFunctionMessageParam object { content, name, role }`

    - `content: string or null`

      函数消息的内容。

    - `name: string`

      要调用的函数名称。

    - `role: "function"`

      消息作者的角色，此处为 `function`.

      - `"function"`

### Chat Completion Message Tool Call

- `ChatCompletionMessageToolCall = ChatCompletionMessageFunctionToolCall or ChatCompletionMessageCustomToolCall`

  对模型创建的函数工具的调用。

  - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

    对模型创建的函数工具的调用。

    - `id: string`

      工具调用的 ID。

    - `function: object { arguments, name }`

      模型所调用的函数。

      - `arguments: string`

        调用该函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是会生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

      - `name: string`

        要调用的函数名称。

    - `type: "function"`

      工具的类型。当前，仅 `function` 的类型。

      - `"function"`

  - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

    对模型创建的自定义工具的调用。

    - `id: string`

      工具调用的 ID。

    - `custom: object { input, name }`

      模型所调用的自定义工具。

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

  指定模型应使用的工具。可用于强制模型调用特定函数。

  - `function: object { name }`

    - `name: string`

      要调用的函数名称。

  - `type: "function"`

    对于函数调用，类型始终为 `function`.

    - `"function"`

### Chat Completion Named Tool Choice Custom

- `ChatCompletionNamedToolChoiceCustom object { custom, type }`

  指定模型应使用的工具。可用于强制模型调用特定的自定义工具。

  - `custom: object { name }`

    - `name: string`

      要调用的自定义工具的名称。

  - `type: "custom"`

    对于自定义工具调用，类型始终为 `custom`.

    - `"custom"`

### Chat Completion Prediction Content

- `ChatCompletionPredictionContent object { content, type }`

  静态预测的输出内容，例如正在重新生成的文本文件的内容。
  being regenerated.

  - `content: string or array of ChatCompletionContentPartText`

    生成模型响应时应匹配的内容。
    如果生成的 token 会匹配该内容，整个模型响应
    可以更快地返回。

    - `TextContent = string`

      用于 Predicted Output 的内容。通常是
      你正在重新生成且只有少量修改的文件文本。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      由已定义类型组成的内容部分数组。支持的内容因用于生成响应的 [model](/api/docs/models) 用于生成响应的内容。可以包含文本输入。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

  - `type: "content"`

    你想要提供的预测内容的类型。该类型
    目前始终为 `content`.

    - `"content"`

### 聊天完成角色

- `ChatCompletionRole = "developer" or "system" or "user" or 3 more`

  消息作者的角色

  - `"developer"`

  - `"system"`

  - `"user"`

  - `"assistant"`

  - `"tool"`

  - `"function"`

### 聊天补全存储消息

- `ChatCompletionStoreMessage = ChatCompletionMessage`

  由模型生成的聊天补全消息。

  - `id: string`

    聊天消息的标识符。

  - `content_parts: optional array of ChatCompletionContentPartText or ChatCompletionContentPartImage or null`

    如果提供了 content parts 数组，则此项为 `text` 和 `image_url` parts 数组。
    否则为 null。

    - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

      了解 [文本输入](/api/docs/guides/text).

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

    - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

      了解 [图像输入](/api/docs/guides/images-vision).

      - `image_url: object { url, detail }`

        - `url: string`

          图像的 URL 或 base64 编码的图像数据。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。了解更多，请参阅 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

### Chat Completion Stream Options

- `ChatCompletionStreamOptions object { include_obfuscation, include_usage }`

  流式响应的选项。仅当设置 `stream: true`.

  - `include_obfuscation: optional boolean`

    当为 true 时，将启用流混淆。流混淆会向流式 delta 事件上的某个字段添加
    随机字符，以规范化负载大小，作为对某些侧信道攻击的缓解措施。 `obfuscation` 字段添加随机字符，以
    规范化负载大小，作为对某些侧信道攻击的缓解措施。
    这些混淆字段默认包含，但会为数据流带来少量
    开销。如果你信任客户端与服务端之间的网络链路，可以将 `include_obfuscation` 设置为
    设置为 false 以优化带宽。
    你的应用与 OpenAI API 之间。

  - `include_usage: optional boolean`

    如果设置，将在之前流式传输一个额外的分块 `data: [DONE]`
    消息。该 `usage` 字段表示整个请求的令牌用量统计，
    而该字段 `choices` 始终为一个空的
    数组。

    所有其他分块也将包含一个 `usage` 字段，但其值为
    null。 **注意：** 如果流被中断，你可能无法收到
    包含该请求总令牌用量的最终 usage 分块。

### Chat Completion System Message Param

- `ChatCompletionSystemMessageParam object { content, role, name }`

  开发者提供的指令，模型应遵循这些指令，无论用户发送什么
  用户发送的消息。对于 o1 及更高模型，请改用 `developer` messages
  来完成此目的。

  - `content: string or array of ChatCompletionContentPartText`

    系统消息的内容。

    - `TextContent = string`

      系统消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      由已定义类型组成的内容部分数组。对于系统消息，仅支持类型 `text` 的类型。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

  - `role: "system"`

    消息作者的角色，此处为 `system`.

    - `"system"`

  - `name: optional string`

    参与者的可选名称。为模型提供信息以区分同一角色的不同参与者。

### Chat Completion Token Logprob

- `ChatCompletionTokenLogprob object { token, bytes, logprob, top_logprobs }`

  - `token: string`

    该 token。

  - `bytes: array of number or null`

    表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

  - `logprob: number`

    该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

  - `top_logprobs: array of object { token, bytes, logprob }`

    在该 token 位置处最可能的 token 及其对数概率的列表。条目数量可能少于所请求的 `top_logprobs`.

    - `token: string`

      该 token。

    - `bytes: array of number or null`

      表示该 token 的 UTF-8 字节表示形式的整数列表。在某些字符由多个 token 表示、且需要组合其字节表示才能生成正确文本表示的情况下非常有用。如果没有该 token 的字节表示形式，可为 `null` 。

    - `logprob: number`

      该 token 的对数概率（若它位于概率最高的前 20 个 token 之内）。否则，该值 `-9999.0` 用于表示该 token 极不可能出现。

### Chat Completion Tool

- `ChatCompletionTool = ChatCompletionFunctionTool or ChatCompletionCustomTool`

  可用于生成响应的函数工具。

  - `ChatCompletionFunctionTool object { function, type }`

    可用于生成响应的函数工具。

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短横线，最大长度为 64。

      - `description: optional string`

        对函数作用的描述，供模型用来决定何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，以 JSON Schema 对象形式描述。参见 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 关于该格式的文档，请参阅。

        省略 `parameters` 用于定义一个空参数列表的函数。

      - `strict: optional boolean or null`

        在生成函数调用时是否启用严格的模式遵循。如果设置为 true，模型将遵循在 `parameters` 字段中。当 strict 为 true 时，仅支持 JSON Schema 的一个子集。 `strict` 为 `true`。中定义的精确模式。在 [函数调用指南](/api/docs/guides/function-calling).

    - `type: "function"`

      工具的类型。当前，仅 `function` 的类型。

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

        自定义工具的输入格式。默认为无约束文本。

        - `Text object { type }`

          无约束的自由格式文本。

          - `type: "text"`

            无约束文本格式。始终 `text`.

            - `"text"`

        - `Grammar object { grammar, type }`

          由用户定义的语法。

          - `grammar: object { definition, syntax }`

            你选择的语法。

            - `definition: string`

              语法定义。

            - `syntax: "lark" or "regex"`

              语法定义的语法。其一为 `lark` 或 `regex`.

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

  控制模型调用哪个工具（如果有）。
  `none` 表示模型不会调用任何工具，而是生成一条消息。
  `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。
  `required` 表示模型必须调用一个或多个工具。
  通过 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

  `none` 是在没有工具时的默认值。 `auto` 是在有工具时的默认值。

  - `ToolChoiceMode = "none" or "auto" or "required"`

    `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以在生成消息或调用一个或多个工具之间进行选择。 `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ChatCompletionAllowedToolChoice object { allowed_tools, type }`

    将模型可用的工具限制为预定义集合。

    - `allowed_tools: ChatCompletionAllowedTools`

      将模型可用的工具限制为预定义集合。

      - `mode: "auto" or "required"`

        将模型可用的工具限制为预定义集合。

        `auto` 允许模型从允许的工具中选取并生成一个
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

    指定模型应使用的工具。可用于强制模型调用特定函数。

    - `function: object { name }`

      - `name: string`

        要调用的函数名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ChatCompletionNamedToolChoiceCustom object { custom, type }`

    指定模型应使用的工具。可用于强制模型调用特定的自定义工具。

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

      包含已定义类型的若干内容片段组成的数组。对于工具消息，仅支持类型为 `text` 的类型。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

  - `role: "tool"`

    消息作者的角色，此处为 `tool`.

    - `"tool"`

  - `tool_call_id: string`

    此消息所响应的工具调用。

### Chat Completion User Message Param

- `ChatCompletionUserMessageParam object { content, role, name }`

  由终端用户发送的消息，包含提示词或额外的上下文
  信息。

  - `content: string or array of ChatCompletionContentPart`

    用户消息的内容。

    - `TextContent = string`

      消息的文本内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPart`

      由已定义类型组成的内容部分数组。支持的内容因用于生成响应的 [model](/api/docs/models) 而异。可以包含文本、图像或音频输入。

      - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

        了解 [文本输入](/api/docs/guides/text).

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

        了解 [图像输入](/api/docs/guides/images-vision).

        - `image_url: object { url, detail }`

          - `url: string`

            图像的 URL 或 base64 编码的图像数据。

          - `detail: optional "auto" or "low" or "high"`

            指定图像的细节级别。了解更多，请参阅 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

            - `"auto"`

            - `"low"`

            - `"high"`

        - `type: "image_url"`

          内容部分的类型。

          - `"image_url"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ChatCompletionContentPartInputAudio object { input_audio, type, prompt_cache_breakpoint }`

        了解 [音频输入](/api/docs/guides/audio).

        - `input_audio: object { data, format }`

          - `data: string`

            Base64 编码的音频数据。

          - `format: "wav" or "mp3"`

            编码音频数据的格式。当前支持 "wav" 和 "mp3"。

            - `"wav"`

            - `"mp3"`

        - `type: "input_audio"`

          内容部分的类型。始终为 `input_audio`.

          - `"input_audio"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `FileContentPart object { file, type, prompt_cache_breakpoint }`

        了解 [文件输入](/api/docs/guides/text) 用于文本生成。

        - `file: object { file_data, file_id, filename }`

          - `file_data: optional string`

            Base64 编码的文件数据，在将文件作为字符串传递给模型时使用
            。

          - `file_id: optional string`

            用作输入的上传文件的 ID。

          - `filename: optional string`

            文件的名称，在将文件作为
            字符串传递给模型时使用。

        - `type: "file"`

          内容部分的类型。始终为 `file`.

          - `"file"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

  - `role: "user"`

    消息作者的角色，此处为 `user`.

    - `"user"`

  - `name: optional string`

    参与者的可选名称。为模型提供信息以区分同一角色的不同参与者。

# Messages

## Get chat messages

**get** `/chat/completions/{completion_id}/messages`

获取已存储聊天补全中的消息。仅返回使用
创建的 Chat Completions。 `store` 参数创建的 `true` 将被
返回。

### 路径参数

- `completion_id: string`

### 查询参数

- `after: optional string`

  上一次分页请求中最后一条消息的标识符。

- `limit: optional number`

  要获取的消息数量。

- `order: optional "asc" or "desc"`

  按时间戳排序消息的顺序。使用 `asc` 表示升序，或使用 `desc` 表示降序。默认为 `asc`.

  - `"asc"`

  - `"desc"`

### Returns

- `data: array of ChatCompletionStoreMessage`

  由聊天补全消息对象组成的数组。

  - `id: string`

    聊天消息的标识符。

  - `content_parts: optional array of ChatCompletionContentPartText or ChatCompletionContentPartImage or null`

    如果提供了 content parts 数组，则此项为 `text` 和 `image_url` parts 数组。
    否则为 null。

    - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

      了解 [文本输入](/api/docs/guides/text).

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

    - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

      了解 [图像输入](/api/docs/guides/images-vision).

      - `image_url: object { url, detail }`

        - `url: string`

          图像的 URL 或 base64 编码的图像数据。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。了解更多，请参阅 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

- `first_id: string`

  data 数组中第一条聊天消息的标识符。

- `has_more: boolean`

  指示是否还有更多可用的聊天消息。

- `last_id: string`

  data 数组中最后一条聊天消息的标识符。

- `object: "list"`

  此对象的类型。始终设置为 "list"。

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
      ],
      "id": "id",
      "content_parts": [
        {
          "text": "text",
          "type": "text",
          "prompt_cache_breakpoint": {
            "mode": "explicit"
          }
        }
      ]
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
