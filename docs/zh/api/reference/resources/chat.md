# Chat

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取相应文档页面的 Markdown 版本。

# Completions

## Create chat completion

**post** `/chat/completions`

**开始一个新项目？** 我们推荐你试用 [Responses](/docs/api-reference/responses)
以充分利用 OpenAI 平台的最新功能。比较
[Chat Completions 与 Responses](/docs/guides/responses-vs-chat-completions?api-mode=responses).

---

为给定的聊天会话创建模型响应。详见
[文本生成](/docs/guides/text-generation), [视觉](/docs/guides/vision),
和 [音频](/docs/guides/audio) 指南。

参数支持可能因用于生成
响应的模型而异，尤其是较新的推理模型。仅
推理模型支持的参数将在下方注明。有关推理模型中
不受支持参数的当前情况，请，
[参阅推理指南](/docs/guides/reasoning).

返回一个聊天补全对象，如果请求以流式传输，则返回聊天补全
分块对象的流式序列。

### 正文参数

- `messages: array of ChatCompletionMessageParam`

  包含到目前为止对话内容的消息列表。根据你使用的
  [model](/docs/models) ，支持不同的消息类型（模态），例如
  支持，诸如 [text](/docs/guides/text-generation),
  [images](/docs/guides/vision)、和 [audio](/docs/guides/audio).

  - `ChatCompletionDeveloperMessageParam object { content, role, name }`

    开发者提供的指令，模型应当遵循这些指令，而无论用户发送了什么样的
    消息。在 o1 及更新模型上，developer， `developer` 消息取代了原先的
    消息中的 `system` messages。

    - `content: string or array of ChatCompletionContentPartText`

      developer 消息的内容。

      - `TextContent = string`

        developer 消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        具有指定类型的 content part 数组。对于 developer 消息，仅支持 type 为 input_text 的 `text` 内容。

        - `text: string`

          文本内容。

        - `type: "text"`

          content part 的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `role: "developer"`

      消息作者的角色，在本例中为 `developer`.

      - `"developer"`

    - `name: optional string`

      参与者可选的名称。为模型提供信息，以区分同一角色的不同参与者。

  - `ChatCompletionSystemMessageParam object { content, role, name }`

    开发者提供的指令，模型应当遵循这些指令，而无论用户发送了什么样的
    用户发送的消息。对于 o1 及更新模型，请使用 `developer` 消息取代了原先的
    来替代此用途。

    - `content: string or array of ChatCompletionContentPartText`

      系统消息的内容。

      - `TextContent = string`

        系统消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        包含已定义类型的 content 部件数组。对于系统消息，仅支持 type `text` 内容。

        - `text: string`

          文本内容。

        - `type: "text"`

          content part 的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

    - `role: "system"`

      消息作者的角色，在本例中为 `system`.

      - `"system"`

    - `name: optional string`

      参与者可选的名称。为模型提供信息，以区分同一角色的不同参与者。

  - `ChatCompletionUserMessageParam object { content, role, name }`

    由终端用户发送的消息，包含提示词或其他上下文
    信息。

    - `content: string or array of ChatCompletionContentPart`

      用户消息的内容。

      - `TextContent = string`

        消息的文本内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPart`

        包含已定义类型的 content 部件数组。可选项取决于用于生成响应的 [model](/docs/models) 。可以包含文本、图像或音频输入。

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/docs/guides/text-generation).

          - `text: string`

            文本内容。

          - `type: "text"`

            content part 的类型。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

        - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

          了解 [图像输入](/docs/guides/vision).

          - `image_url: object { url, detail }`

            - `url: string`

              图像的 URL 或 base64 编码后的图像数据。

            - `detail: optional "auto" or "low" or "high"`

              指定图像的细节级别。详见 [视觉指南](/docs/guides/vision#low-or-high-fidelity-image-understanding).

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_url"`

            content part 的类型。

            - `"image_url"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ChatCompletionContentPartInputAudio object { input_audio, type, prompt_cache_breakpoint }`

          了解 [音频输入](/docs/guides/audio).

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

            标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `FileContentPart object { file, type, prompt_cache_breakpoint }`

          了解 [文件输入](/docs/guides/text) 用于文本生成。

          - `file: object { file_data, file_id, filename }`

            - `file_data: optional string`

              Base64 编码的文件数据，在将文件传递给模型时使用
              字符串形式。

            - `file_id: optional string`

              用作输入的上传文件的 ID。

            - `filename: optional string`

              文件的名称，在将文件作为以下形式传递给模型时使用
              字符串。

          - `type: "file"`

            内容部分的类型。始终为 `file`.

            - `"file"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

    - `role: "user"`

      消息作者的角色，在本例中为 `user`.

      - `"user"`

    - `name: optional string`

      参与者可选的名称。为模型提供信息，以区分同一角色的不同参与者。

  - `ChatCompletionAssistantMessageParam object { role, audio, content, 4 more }`

    模型为响应用户消息而发送的消息。

    - `role: "assistant"`

      消息作者的角色，在本例中为 `assistant`.

      - `"assistant"`

    - `audio: optional object { id }  or null`

      关于模型先前音频响应的数据。
      [了解更多](/docs/guides/audio).

      - `id: string`

        模型先前音频响应的唯一标识符。

    - `content: optional string or array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal or null`

      助手消息的内容。除非指定了 `tool_calls` 或 `function_call` ，否则此项为必填。

      - `TextContent = string`

        助手消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal`

        由已定义类型组成的内容部分数组。可以是一或多个以下类型 `text`，或恰好一个以下类型 `refusal`.

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/docs/guides/text-generation).

        - `ChatCompletionContentPartRefusal object { refusal, type }`

          - `refusal: string`

            模型生成的拒绝消息。

          - `type: "refusal"`

            content part 的类型。

            - `"refusal"`

    - `function_call: optional object { arguments, name }  or null`

      已弃用，已由 `tool_calls`。替代。应调用的函数的名称和参数，由模型生成。

      - `arguments: string`

        调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

      - `name: string`

        要调用的函数的名称。

    - `name: optional string`

      参与者可选的名称。为模型提供信息，以区分同一角色的不同参与者。

    - `refusal: optional string or null`

      助手返回的拒绝消息。

    - `tool_calls: optional array of ChatCompletionMessageToolCall`

      模型生成的工具调用，例如函数调用。

      - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

        对模型创建的函数工具的调用。

        - `id: string`

          工具调用的 ID。

        - `function: object { arguments, name }`

          模型调用的函数。

          - `arguments: string`

            调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

          - `name: string`

            要调用的函数的名称。

        - `type: "function"`

          工具的类型。目前，仅支持 `function` 内容。

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

        具有已定义类型的内容片段数组。对于工具消息，仅类型 `text` 内容。

        - `text: string`

          文本内容。

        - `type: "text"`

          content part 的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

    - `role: "tool"`

      消息作者的角色，在本例中为 `tool`.

      - `"tool"`

    - `tool_call_id: string`

      此消息正在响应的工具调用。

  - `ChatCompletionFunctionMessageParam object { content, name, role }`

    - `content: string or null`

      函数消息的内容。

    - `name: string`

      要调用的函数的名称。

    - `role: "function"`

      消息作者的角色，在本例中为 `function`.

      - `"function"`

- `model: string or "gpt-5.6-sol" or "gpt-5.6-terra" or "gpt-5.6-luna" or 80 more`

  用于生成响应的模型 ID，例如 `gpt-5.6-sol` 或 `o3`。 OpenAI
  提供多种具备不同能力、性能
  特征和价位的模型。请参阅 [模型指南](/docs/models)
  以浏览和比较可用的模型。

  - `string`

  - `"gpt-5.6-sol" or "gpt-5.6-terra" or "gpt-5.6-luna" or 80 more`

    用于生成响应的模型 ID，例如 `gpt-5.6-sol` 或 `o3`。 OpenAI
    提供多种具备不同能力、性能
    特征和价位的模型。请参阅 [模型指南](/docs/models)
    以浏览和比较可用的模型。

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

  音频输出的参数。在使用以下参数请求音频输出时必填：
  `modalities: ["audio"]`. [了解更多](/docs/guides/audio).

  - `format: "wav" or "aac" or "mp3" or 3 more`

    指定输出音频格式。必须是以下之一： `wav`, `mp3`, `flac`,
    `opus`，或 `pcm16`.

    - `"wav"`

    - `"aac"`

    - `"mp3"`

    - `"flac"`

    - `"opus"`

    - `"pcm16"`

  - `voice: string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

    模型用于响应的语音。支持的内置语音有
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `nova`, `onyx`,
    `sage`, `shimmer`, `marin`、和 `cedar`。你也可以提供带有
    的自定义语音对象， `id`，例如 `{ "id": "voice_1234" }`.

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

      自定义语音引用。

      - `id: string`

        自定义语音 ID，例如 `voice_1234`.

- `frequency_penalty: optional number or null`

  介于 -2.0 和 2.0 之间的数字。正值会根据
  新 token 在已有文本中的出现频率对其进行惩罚，从而降低模型
  逐字重复相同内容的可能性。

- `function_call: optional "none" or "auto" or ChatCompletionFunctionCallOption`

  已弃用，推荐使用 `tool_choice`.

  控制模型调用哪些函数（如果有的话）。

  `none` 意味着模型不会调用函数，而是生成一条
  消息。

  `auto` 意味着模型可以自行选择生成消息或调用
  函数。

  通过 `{"name": "my_function"}` 强制模型
  调用该函数。

  `none` 是在没有函数时的默认值。 `auto` 是存在函数
  时的默认值。

  - `"none" or "auto"`

    `none` 意味着模型不会调用函数，而是生成一条消息。 `auto` 意味着模型可以自行选择生成消息或调用函数。

    - `"none"`

    - `"auto"`

  - `ChatCompletionFunctionCallOption object { name }`

    通过 `{"name": "my_function"}` 强制模型调用该函数。

    - `name: string`

      要调用的函数的名称。

- `functions: optional array of object { name, description, parameters }`

  已弃用，推荐使用 `tools`.

  模型可为其生成 JSON 输入的函数列表。

  - `name: string`

    要调用的函数名称。只能包含 a-z、A-Z、0-9，或下划线和短横线，最大长度为 64。

  - `description: optional string`

    对函数功能的描述，供模型用于选择何时以及如何调用该函数。

  - `parameters: optional FunctionParameters`

    函数接受的参数，使用 JSON Schema 对象进行描述。详见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 有关此格式的文档。

    省略 `parameters` 定义一个参数列表为空的函数。

- `logit_bias: optional map[number] or null`

  修改指定 token 在补全中出现的可能性。

  接受一个 JSON 对象，将 token（在
  分词器中通过其 token ID 指定）映射到介于 -100 到 100 之间的关联偏差值。在数学上，
  该偏差会在采样之前被加到模型生成的 logits 上。
  具体效果因模型而异，但介于 -1 到 1 之间的值应该
  会降低或提高被选中的可能性；类似 -100 或 100 的值
  应导致相关 token 被禁止或被唯一选中。

- `logprobs: optional boolean or null`

  是否返回输出 token 的对数概率。如果为 true，
  返回每个输出 token 的对数概率，
  `content` of `message`.

- `max_completion_tokens: optional number or null`

  一次补全可生成的最大 token 数上限，包括可见的输出 token 和 [推理 token](/docs/guides/reasoning).

- `max_tokens: optional number or null`

  可生成的最大 [token](/tokenizer) 数（在
  聊天补全中生成。该值可用于控制
  [成本](https://openai.com/api/pricing/) 用于通过 API 生成的文本。

  此值现已弃用，改用 `max_completion_tokens`，并且
  不兼容于 [o 系列模型](/docs/guides/reasoning).

- `metadata: optional Metadata or null`

  附加到对象的 16 个键值对集合。可用于以结构化
  格式存储关于对象的附加信息，并通过 API 或仪表板查询对象。
  格式存储关于对象的附加信息，并通过 接口 或仪表板查询对象。

  键为字符串，最长 64 个字符。值
  为字符串，最长 512 个字符。

- `modalities: optional array of "text" or "audio" or null`

  你希望模型生成的输出类型。
  大多数模型都能生成文本，这是默认方式：

  `["text"]`

  该 `gpt-4o-audio-preview` 模型还可用于
  [generate audio](/docs/guides/audio)。若要让该模型生成
  同时包含文本和音频的响应，你可以使用：

  `["text", "audio"]`

  - `"text"`

  - `"audio"`

- `moderation: optional object { model, policy }  or null`

  对请求输入和生成输出运行审核的配置。

  - `model: string`

    用于受审核补全的审核模型，例如 'omni-moderation-latest'。

  - `policy: optional object { input, output }  or null`

    应用于受审核响应输入和输出的策略。

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

  针对每条输入消息要生成的聊天补全选项数量。注意，将根据所有选项中生成的 token 总数向你收费。请将 `n` n `1` 设为 1，以最大限度降低成本。

- `parallel_tool_calls: optional boolean`

  是否在工具使用期间启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 。

- `prediction: optional ChatCompletionPredictionContent or null`

  静态预测输出内容，例如正在被重新生成的文本文件内容。
  being regenerated.

  - `content: string or array of ChatCompletionContentPartText`

    生成模型响应时应匹配的内容。
    如果生成的 token 与该内容匹配，则可以更快地返回整个模型响应。
    can be returned much more quickly.

    - `TextContent = string`

      用于 Predicted Output 的内容。这通常是
      你正在重新生成且仅有少量改动的文件的文本。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      包含已定义类型的 content 部件数组。可选项取决于用于生成响应的 [model](/docs/models) 正在用于生成响应的输入消息。可以包含文本输入。

      - `text: string`

        文本内容。

      - `type: "text"`

        content part 的类型。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

  - `type: "content"`

    你要提供的预测内容的类型。该类型
    目前始终为 `content`.

    - `"content"`

- `presence_penalty: optional number or null`

  介于 -2.0 和 2.0 之间的数字。正值会根据
  到目前为止是否出现在文本中会增加模型谈论新话题的可能性。
  to talk about new topics.

- `prompt_cache_key: optional string or null`

  由 OpenAI 用于缓存相似请求的响应，以优化你的缓存命中率。取代了 `user` 字段。 [了解更多](/docs/guides/prompt-caching).

- `prompt_cache_options: optional object { mode, ttl }`

  提示缓存的选项。适用于 `gpt-5.6` 及更高版本模型。默认情况下，OpenAI 会自动选择一个隐式缓存断点。你可以使用 `prompt_cache_breakpoint`。为内容块添加显式断点。每个请求最多可写入四个断点。在缓存匹配时，OpenAI 会考虑对话中最多最近的 80 个断点，且没有内容块回溯限制。将 `mode` 设置为 `explicit` 可禁用隐式断点。 `ttl` 默认值为 `30m`，目前这是唯一支持的值。参阅 [提示缓存指南](/docs/guides/prompt-caching) 了解最新详情。

  - `mode: optional "implicit" or "explicit"`

    控制 OpenAI 是否自动创建隐式缓存断点。默认值为 `implicit`。使用 `implicit`，时，OpenAI 会创建一个隐式断点，并在请求中写入最多最近的三个显式断点。使用 `explicit`，时，OpenAI 不会创建隐式断点，并写入最多最近的四个显式断点。如果不存在显式断点，则该请求不会使用提示缓存。

    - `"implicit"`

    - `"explicit"`

  - `ttl: optional "30m"`

    应用于请求所写入的每个隐式和显式缓存断点的最短生命周期。默认值为 `30m`，目前这是唯一支持的值。后端可能会保留缓存条目更长时间。

    - `"30m"`

- `prompt_cache_retention: optional "in_memory" or "24h" or null`

  已弃用。请使用 `prompt_cache_options.ttl` 代替。

  提示缓存的保留策略。设置为 `24h` 以启用扩展提示缓存，使缓存的前缀保持更长时间，最长可达 24 小时。 [了解更多](/docs/guides/prompt-caching#prompt-cache-retention).
  该字段表示最大保留策略，而
  `prompt_cache_options.ttl` 表示最小缓存生命周期。两个
  字段相互独立，互不影响。
  对于 `gpt-5.5`, `gpt-5.5-pro`，及未来模型，仅 `24h` 内容。

  对于同时支持 `in_memory` 和 `24h`，的较旧模型，默认值取决于你所在组织的数据保留策略：

  - 未启用 ZDR 的组织默认为 `24h`.
  - 启用了 ZDR 的组织默认使用 `in_memory` 当 `prompt_cache_retention` 未指定时。

  - `"in_memory"`

  - `"24h"`

- `reasoning_effort: optional ReasoningEffort or null`

  限制推理模型在推理上的投入程度。当前支持的
  值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`、和 `max`.
  降低推理投入程度可以加快响应速度并减少
  响应中用于推理的令牌数。并非所有推理模型都支持每个
  值。请参阅
  [推理指南](https://platform.openai.com/docs/guides/reasoning)
  了解特定模型的支持情况。

  - `"none"`

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

- `response_format: optional ResponseFormatText or ResponseFormatJSONSchema or ResponseFormatJSONObject`

  用于指定模型必须输出的格式的对象。

  设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用
  结构化输出，确保模型输出与你提供的 JSON
  模式匹配。在 [结构化输出
  指南](/docs/guides/structured-outputs).

  设置为 `{ "type": "json_object" }` 启用旧版的 JSON 模式，它
  可确保模型生成的消息是合法 JSON。对于支持 `json_schema`
  的模型，推荐使用。

  - `ResponseFormatText object { type }`

    默认的响应格式。用于生成文本响应。

    - `type: "text"`

      正在定义的响应格式的类型。始终为 `text`.

      - `"text"`

  - `ResponseFormatJSONSchema object { json_schema, type }`

    JSON 模式响应格式。用于生成结构化的 JSON 响应。
    详细了解 [结构化输出](/docs/guides/structured-outputs).

    - `json_schema: object { name, description, schema, strict }`

      结构化输出的配置选项，包括 JSON 模式。

      - `name: string`

        响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
        下划线和短横线，最大长度为 64 个字符。

      - `description: optional string`

        关于该响应格式用途的描述，模型会根据它
        决定如何按该格式进行响应。

      - `schema: optional map[unknown]`

        响应格式的模式，以 JSON 模式对象描述。
        了解如何构建 JSON 模式 [此处](https://json-schema.org/).

      - `strict: optional boolean or null`

        是否在生成输出时启用严格的模式遵循。
        如果设置为 true，模型将始终遵循在
        字段中 `schema` 所定义的精确模式。当 strict
        `strict` 为 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多信息，请参阅 [结构化输出
        指南](/docs/guides/structured-outputs).

    - `type: "json_schema"`

      正在定义的响应格式的类型。始终为 `json_schema`.

      - `"json_schema"`

  - `ResponseFormatJSONObject object { type }`

    JSON 对象响应格式。这是一种较旧的 JSON 响应生成方式。
    对于支持该格式的 `json_schema` 模型，推荐使用 json_schema。请注意，在没有系统或用户消息指示的情况下，
    模型不会生成 JSON
    输出。

    - `type: "json_object"`

      正在定义的响应格式的类型。始终为 `json_object`.

      - `"json_object"`

- `safety_identifier: optional string or null`

  一个稳定的标识符，用于帮助检测可能违反 OpenAI 使用策略的应用程序用户。
  这些 ID 应为字符串，用于唯一标识每个用户，最大长度为 64 个字符。我们建议对其用户名或电子邮件地址进行哈希处理，以避免向我们发送任何可识别信息。 [了解更多](/docs/guides/safety-best-practices#safety-identifiers).

- `seed: optional number or null`

  此功能处于测试阶段。
  如果指定，我们的系统将尽力进行确定性采样，以便使用相同的 `seed` 和参数发起的重复请求应返回相同的结果。
  不保证确定性，你应当参考 `system_fingerprint` 响应参数来监控后端的变化。

- `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

  指定用于处理该请求的处理类型。

  - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则项目将使用 'default'。
  - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
  - 如果设置为'[flex](/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
  - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你在请求中是否指定 `service_tier=fast` 或 `priority` 。
  - 未设置时，默认行为为 'auto'。

  当 `service_tier` 参数被设置时，响应主体将根据实际用于处理该请求的处理模式返回 `service_tier` 值。该响应值可能与参数中设置的值不同。

  - `"auto"`

  - `"default"`

  - `"flex"`

  - `"scale"`

  - `"priority"`

  - `"fast"`

- `stop: optional string or array of string or null`

  最新的推理模型不支持此功能 `o3` 和 `o4-mini`.

  最多 4 个序列，API 将在这些位置停止生成更多 token。
  返回的文本不会包含停止序列。

  - `string`

  - `array of string`

- `store: optional boolean or null`

  是否存储本次聊天补全请求的输出以用于
  我们的 [模型蒸馏](/docs/guides/distillation) 或
  [evals](/docs/guides/evals) 产品。

  支持文本和图像输入。注意：超过 8MB 的图像输入将被丢弃。

- `stream: optional boolean or null`

  如果设置为 true，模型响应数据将通过
  生成时流式传输到客户端，使用 [服务端发送事件](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format).
  请参阅 [下面的流式传输部分](/docs/api-reference/chat/streaming)
  了解更多信息，以及 [流式响应](/docs/guides/streaming-responses)
  指南，了解如何处理流式事件的更多信息。

- `stream_options: optional ChatCompletionStreamOptions or null`

  流式响应的选项。仅当你设置 `stream: true`.

  - `include_obfuscation: optional boolean`

    当为 true 时，将启用流混淆。流混淆会向
    流式增量事件上的某个 `obfuscation` 字段添加随机字符，以
    规范化负载大小，作为对某些侧信道攻击的缓解措施。
    默认情况下会包含这些混淆字段，但会给数据流带来少量
    开销。如果你信任客户端与服务端之间的网络链路，可以将 `include_obfuscation` 设置为
    设置为 false 以优化带宽。
    你的应用与 OpenAI API 之间的。

  - `include_usage: optional boolean`

    如果设置了该参数，会在 `data: [DONE]`
    之前流式传输一个额外的分块 `usage` message。该分块上的
    字段显示整个请求的 token 使用统计信息，而 `choices` 字段将始终为空
    数组。

    所有其他分块也会包含一个 `usage` 字段，但其值为 null
    。 **注意：** 如果流被中断，你可能无法收到
    包含该请求总 token 使用量的最后一个 usage 分块。

- `temperature: optional number or null`

  使用的采样温度，介于 0 和 2 之间。较高的值（如 0.8）会使输出更加随机，而较低的值（如 0.2）会使输出更加聚焦和确定。
  我们通常建议修改此项或 `top_p` ，但不要同时修改两者。

- `tool_choice: optional ChatCompletionToolChoiceOption`

  控制模型调用哪个工具（如果有的话）。
  `none` 意味着模型不会调用任何工具，而是生成一条消息。
  `auto` 意味着模型可以在生成消息和调用一个或多个工具之间进行选择。
  `required` 意味着模型必须调用一个或多个工具。
  通过 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

  `none` 是没有工具时的默认值。 `auto` 是存在工具时的默认值。

  - `ToolChoiceMode = "none" or "auto" or "required"`

    `none` 意味着模型不会调用任何工具，而是生成一条消息。 `auto` 意味着模型可以在生成消息和调用一个或多个工具之间进行选择。 `required` 意味着模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ChatCompletionAllowedToolChoice object { allowed_tools, type }`

    将模型可用的工具限制为预定义的集合。

    - `allowed_tools: ChatCompletionAllowedTools`

      将模型可用的工具限制为预定义的集合。

      - `mode: "auto" or "required"`

        将模型可用的工具限制为预定义的集合。

        `auto` 允许模型从允许的工具中选取并生成
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

    指定模型应使用的工具。用于强制模型调用某个特定函数。

    - `function: object { name }`

      - `name: string`

        要调用的函数的名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ChatCompletionNamedToolChoiceCustom object { custom, type }`

    指定模型应使用的工具。用于强制模型调用某个特定的自定义工具。

    - `custom: object { name }`

      - `name: string`

        要调用的自定义工具的名称。

    - `type: "custom"`

      对于自定义工具调用，类型始终为 `custom`.

      - `"custom"`

- `tools: optional array of ChatCompletionTool`

  模型可调用的工具列表。你可以提供
  [自定义工具](/docs/guides/function-calling#custom-tools) 或
  [函数工具](/docs/guides/function-calling).

  - `ChatCompletionFunctionTool object { function, type }`

    可用于生成响应的函数工具。

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数名称。只能包含 a-z、A-Z、0-9，或下划线和短横线，最大长度为 64。

      - `description: optional string`

        对函数功能的描述，供模型用于选择何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，使用 JSON Schema 对象进行描述。详见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 有关此格式的文档。

        省略 `parameters` 定义一个参数列表为空的函数。

      - `strict: optional boolean or null`

        在生成函数调用时是否启用严格的 schema 遵循。如果设置为 true，模型将严格按照 `parameters` 所定义的精确模式。当 strict `strict` 为 `true`。中定义的 schema 执行。详细了解 Structured Outputs，请参阅 [function calling guide](/docs/guides/function-calling).

    - `type: "function"`

      工具的类型。目前，仅支持 `function` 内容。

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

        自定义工具的输入格式。默认情况下为不受约束的文本。

        - `Text object { type }`

          不受约束的自由格式文本。

          - `type: "text"`

            不受约束的文本格式。始终为 `text`.

            - `"text"`

        - `Grammar object { grammar, type }`

          由用户定义的语法。

          - `grammar: object { definition, syntax }`

            你选择的语法。

            - `definition: string`

              语法定义。

            - `syntax: "lark" or "regex"`

              语法定义的语法。可选值为 `lark` 或 `regex`.

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
  token 数量，每个 token 带有对应的对数
  概率。在某些情况下，返回的 token 数量可能少于
  请求的数量。
  `logprobs` 必须设置为 `true` 才能使用此参数。

- `top_p: optional number or null`

  一种温度采样的替代方法，称为核采样，
  模型只考虑概率累计达到 top_p 的标记结果
  质量。因此 0.1 表示只考虑构成前 10% 概率质量的标记
  被纳入考虑。

  我们通常建议修改此项或 `temperature` ，但不要同时修改两者。

- `user: optional string`

  此字段将被 `safety_identifier` 和 `prompt_cache_key`. 使用 `prompt_cache_key` 来维持缓存优化效果。
  终端用户的稳定标识符。
  通过更好地对相似请求进行分桶来提升缓存命中率，并帮助 OpenAI 检测和防止滥用。 [了解更多](/docs/guides/safety-best-practices#safety-identifiers).

- `verbosity: optional "low" or "medium" or "high" or null`

  限制模型响应的冗长度。较低的值会导致
  数值越低，回复越简洁；数值越高，回复越详细。
  当前支持的值包括 `low`, `medium`、和 `high`。默认值为
  `medium`.

  - `"low"`

  - `"medium"`

  - `"high"`

- `web_search_options: optional object { search_context_size, user_location }`

  该工具会搜索网页以获取可在回复中使用的相关结果。
  详细了解网页搜索工具 [网页搜索 工具](/docs/guides/tools-web-search?api-mode=chat).

  - `search_context_size: optional "low" or "medium" or "high"`

    用于搜索的上下文窗口空间使用量的大致指导，取值为
    之一。 `low`, `medium`，或 `high`. `medium` 为默认值。

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

        用户的两位字母
        [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如，
        例如。 `US`.

      - `region: optional string`

        用户所在地区的自由文本输入，例如 `California`.

      - `timezone: optional string`

        该 [IANA 时区](https://timeapi.io/documentation/iana-timezones)
        的用户，例如。 `America/Los_Angeles`.

    - `type: "approximate"`

      位置近似值的类型。始终为 `approximate`.

      - `"approximate"`

### Returns

- `ChatCompletion object { id, choices, created, 7 more }`

  表示模型根据提供的输入返回的聊天完成响应。

  - `id: string`

    聊天完成的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天完成选项的列表。如果 `n` 大于 1，则可以包含多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。该字段为 `stop` ，表示模型到达了自然停止点或遇到了提供的停止序列，
      `length` ，表示已达到请求中指定的最大 token 数，
      `content_filter` ，表示内容因我们的内容过滤器的标记而被省略，
      `tool_calls` ，表示模型调用了工具，或 `function_call` （已弃用），表示模型调用了函数。
      请阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

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

          表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处可能性最高的 token 列表及其对数概率。条目数量可能少于请求的 `top_logprobs`.

          - `token: string`

            该 token。

          - `bytes: array of number or null`

            表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

          - `logprob: number`

            该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息拒绝 token 列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处可能性最高的 token 列表及其对数概率。条目数量可能少于请求的 `top_logprobs`.

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

        消息的注释（如适用），例如在使用
        [网页搜索 工具](/docs/guides/tools-web-search?api-mode=chat).

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

            网页资源的标题。

          - `url: string`

            网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关模型音频响应的数据
        关于模型的音频响应。 [了解更多](/docs/guides/audio).

        - `id: string`

          该音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          该音频响应在服务端不再可用于多轮对话的 Unix 时间戳（秒）
          对话的 Unix 时间戳（以秒为单位）。
          conversations.

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，已由 `tool_calls`。替代。应调用的函数的名称和参数，由模型生成。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

        - `name: string`

          要调用的函数的名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

            - `name: string`

              要调用的函数的名称。

          - `type: "function"`

            工具的类型。目前，仅支持 `function` 内容。

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

    聊天补全创建时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    附加到对象的 16 个键值对集合。可用于以结构化
    格式存储关于对象的附加信息，并通过 API 或仪表板查询对象。
    格式存储关于对象的附加信息，并通过 接口 或仪表板查询对象。

    键为字符串，最长 64 个字符。值
    为字符串，最长 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入和生成输出的审核结果（如果请求了审核补全）
    补全。

    - `input: object { model, results, type }  or object { code, message, type }`

      请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到分数的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，过去始终为 `moderation_result` （针对成功的审核结果）。

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

      对生成内容的审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到分数的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，过去始终为 `moderation_result` （针对成功的审核结果）。

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
    - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为'[flex](/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你在请求中是否指定 `service_tier=fast` 或 `priority` 。
    - 未设置时，默认行为为 'auto'。

    当 `service_tier` 参数被设置时，响应主体将根据实际用于处理该请求的处理模式返回 `service_tier` 值。该响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    该指纹表示模型运行所使用到的服务端配置。

    可与以下 `seed` 请求参数配合使用，以了解何时进行了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数。

    - `prompt_tokens: number`

      提示词中的 token 数。

    - `total_tokens: number`

      请求中使用的总 token 数（提示词 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        补全中出现的预测 token 数。

      - `audio_tokens: optional number`

        模型生成的音频输入 token 数。

      - `reasoning_tokens: optional number`

        模型生成的用于推理的 token 数。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全中的预测 token。但与
        推理 token 类似，这些 token 仍会计入用于计费、
        输出以及上下文窗口限制的总补全 token 数中。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token 数。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数量。

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
          "model": "gpt-5.6-sol",
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
    "model": "gpt-5.6-sol",
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
  "model": "gpt-5.6-sol",
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
  "model": "gpt-5.6-sol",
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
  "model": "gpt-5.6-sol",
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
    "model": "gpt-5.6-sol",
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
  "model": "gpt-5.6-sol",
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
    "model": "gpt-5.6-sol",
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
  "model": "gpt-5.6-sol",
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
    "model": "gpt-5.6-sol",
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
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-5.6-sol", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"role":"assistant","content":""},"logprobs":null,"finish_reason":null}]}

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-5.6-sol", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"content":"Hello"},"logprobs":null,"finish_reason":null}]}

....

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-5.6-sol", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{},"logprobs":null,"finish_reason":"stop"}]}
```

## 删除聊天补全

**delete** `/chat/completions/{completion_id}`

删除已存储的 Chat Completions。仅当 Chat Completions 是通过设置
参数创建的 `store` 参数时才能被删除。 `true` 才能被删除。

### 路径参数

- `completion_id: string`

### Returns

- `ChatCompletionDeleted object { id, deleted, object }`

  - `id: string`

    已删除的聊天补全的 ID。

  - `deleted: boolean`

    聊天补全是否已删除。

  - `object: "chat.completion.deleted"`

    正在删除的对象的类型。

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

## List Chat Completions

**get** `/chat/completions`

列出已存储的 Chat Completions。仅返回使用
存储的 `store` 参数时才能被删除。 `true` 将被返回。

### 查询参数

- `after: optional string`

  上一次分页请求中最后一条聊天补全的标识符。

- `limit: optional number`

  要检索的聊天补全数量。

- `metadata: optional Metadata or null`

  用于按元数据键筛选聊天补全的列表。例如：

  `metadata[key1]=value1&metadata[key2]=value2`

- `model: optional string`

  用于生成聊天补全的模型。

- `order: optional "asc" or "desc"`

  按时间戳排序聊天补全的顺序。使用 `asc` 表示升序，或 `desc` 表示降序。默认为 `asc`.

  - `"asc"`

  - `"desc"`

### Returns

- `data: array of ChatCompletion`

  一个由聊天补全对象组成的数组。

  - `id: string`

    聊天完成的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天完成选项的列表。如果 `n` 大于 1，则可以包含多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。该字段为 `stop` ，表示模型到达了自然停止点或遇到了提供的停止序列，
      `length` ，表示已达到请求中指定的最大 token 数，
      `content_filter` ，表示内容因我们的内容过滤器的标记而被省略，
      `tool_calls` ，表示模型调用了工具，或 `function_call` （已弃用），表示模型调用了函数。
      请阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

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

          表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处可能性最高的 token 列表及其对数概率。条目数量可能少于请求的 `top_logprobs`.

          - `token: string`

            该 token。

          - `bytes: array of number or null`

            表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

          - `logprob: number`

            该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息拒绝 token 列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处可能性最高的 token 列表及其对数概率。条目数量可能少于请求的 `top_logprobs`.

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

        消息的注释（如适用），例如在使用
        [网页搜索 工具](/docs/guides/tools-web-search?api-mode=chat).

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

            网页资源的标题。

          - `url: string`

            网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关模型音频响应的数据
        关于模型的音频响应。 [了解更多](/docs/guides/audio).

        - `id: string`

          该音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          该音频响应在服务端不再可用于多轮对话的 Unix 时间戳（秒）
          对话的 Unix 时间戳（以秒为单位）。
          conversations.

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，已由 `tool_calls`。替代。应调用的函数的名称和参数，由模型生成。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

        - `name: string`

          要调用的函数的名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

            - `name: string`

              要调用的函数的名称。

          - `type: "function"`

            工具的类型。目前，仅支持 `function` 内容。

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

    聊天补全创建时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    附加到对象的 16 个键值对集合。可用于以结构化
    格式存储关于对象的附加信息，并通过 API 或仪表板查询对象。
    格式存储关于对象的附加信息，并通过 接口 或仪表板查询对象。

    键为字符串，最长 64 个字符。值
    为字符串，最长 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入和生成输出的审核结果（如果请求了审核补全）
    补全。

    - `input: object { model, results, type }  or object { code, message, type }`

      请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到分数的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，过去始终为 `moderation_result` （针对成功的审核结果）。

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

      对生成内容的审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到分数的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，过去始终为 `moderation_result` （针对成功的审核结果）。

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
    - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为'[flex](/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你在请求中是否指定 `service_tier=fast` 或 `priority` 。
    - 未设置时，默认行为为 'auto'。

    当 `service_tier` 参数被设置时，响应主体将根据实际用于处理该请求的处理模式返回 `service_tier` 值。该响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    该指纹表示模型运行所使用到的服务端配置。

    可与以下 `seed` 请求参数配合使用，以了解何时进行了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数。

    - `prompt_tokens: number`

      提示词中的 token 数。

    - `total_tokens: number`

      请求中使用的总 token 数（提示词 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        补全中出现的预测 token 数。

      - `audio_tokens: optional number`

        模型生成的音频输入 token 数。

      - `reasoning_tokens: optional number`

        模型生成的用于推理的 token 数。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全中的预测 token。但与
        推理 token 类似，这些 token 仍会计入用于计费、
        输出以及上下文窗口限制的总补全 token 数中。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token 数。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的已缓存 token。

      - `image_tokens: optional number`

        提示中存在的图像输入 token。

      - `text_tokens: optional number`

        提示中存在的文本输入 token。

- `first_id: string`

  数据数组中第一条聊天补全的标识符。

- `has_more: boolean`

  指示是否还有更多可用的聊天补全。

- `last_id: string`

  数据数组中最后一条聊天补全的标识符。

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
      "model": "gpt-5.6-sol",
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
存储的 `store` 参数时才能被删除。 `true` 将被返回。

### 路径参数

- `completion_id: string`

### Returns

- `ChatCompletion object { id, choices, created, 7 more }`

  表示模型根据提供的输入返回的聊天完成响应。

  - `id: string`

    聊天完成的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天完成选项的列表。如果 `n` 大于 1，则可以包含多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。该字段为 `stop` ，表示模型到达了自然停止点或遇到了提供的停止序列，
      `length` ，表示已达到请求中指定的最大 token 数，
      `content_filter` ，表示内容因我们的内容过滤器的标记而被省略，
      `tool_calls` ，表示模型调用了工具，或 `function_call` （已弃用），表示模型调用了函数。
      请阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

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

          表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处可能性最高的 token 列表及其对数概率。条目数量可能少于请求的 `top_logprobs`.

          - `token: string`

            该 token。

          - `bytes: array of number or null`

            表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

          - `logprob: number`

            该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息拒绝 token 列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处可能性最高的 token 列表及其对数概率。条目数量可能少于请求的 `top_logprobs`.

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

        消息的注释（如适用），例如在使用
        [网页搜索 工具](/docs/guides/tools-web-search?api-mode=chat).

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

            网页资源的标题。

          - `url: string`

            网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关模型音频响应的数据
        关于模型的音频响应。 [了解更多](/docs/guides/audio).

        - `id: string`

          该音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          该音频响应在服务端不再可用于多轮对话的 Unix 时间戳（秒）
          对话的 Unix 时间戳（以秒为单位）。
          conversations.

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，已由 `tool_calls`。替代。应调用的函数的名称和参数，由模型生成。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

        - `name: string`

          要调用的函数的名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

            - `name: string`

              要调用的函数的名称。

          - `type: "function"`

            工具的类型。目前，仅支持 `function` 内容。

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

    聊天补全创建时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    附加到对象的 16 个键值对集合。可用于以结构化
    格式存储关于对象的附加信息，并通过 API 或仪表板查询对象。
    格式存储关于对象的附加信息，并通过 接口 或仪表板查询对象。

    键为字符串，最长 64 个字符。值
    为字符串，最长 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入和生成输出的审核结果（如果请求了审核补全）
    补全。

    - `input: object { model, results, type }  or object { code, message, type }`

      请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到分数的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，过去始终为 `moderation_result` （针对成功的审核结果）。

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

      对生成内容的审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到分数的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，过去始终为 `moderation_result` （针对成功的审核结果）。

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
    - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为'[flex](/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你在请求中是否指定 `service_tier=fast` 或 `priority` 。
    - 未设置时，默认行为为 'auto'。

    当 `service_tier` 参数被设置时，响应主体将根据实际用于处理该请求的处理模式返回 `service_tier` 值。该响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    该指纹表示模型运行所使用到的服务端配置。

    可与以下 `seed` 请求参数配合使用，以了解何时进行了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数。

    - `prompt_tokens: number`

      提示词中的 token 数。

    - `total_tokens: number`

      请求中使用的总 token 数（提示词 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        补全中出现的预测 token 数。

      - `audio_tokens: optional number`

        模型生成的音频输入 token 数。

      - `reasoning_tokens: optional number`

        模型生成的用于推理的 token 数。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全中的预测 token。但与
        推理 token 类似，这些 token 仍会计入用于计费、
        输出以及上下文窗口限制的总补全 token 数中。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token 数。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数量。

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
  "model": "gpt-5.6-sol",
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

## 更新聊天补全

**post** `/chat/completions/{completion_id}`

修改已存储的 Chat Completions。只能修改
参数创建的 `store` 参数时才能被删除。 `true` 的 Chat Completion。当前，
唯一支持的修改是更新 `metadata` 字段。

### 路径参数

- `completion_id: string`

### 正文参数

- `metadata: Metadata or null`

  附加到对象的 16 个键值对集合。可用于以结构化
  格式存储关于对象的附加信息，并通过 API 或仪表板查询对象。
  格式存储关于对象的附加信息，并通过 接口 或仪表板查询对象。

  键为字符串，最长 64 个字符。值
  为字符串，最长 512 个字符。

### Returns

- `ChatCompletion object { id, choices, created, 7 more }`

  表示模型根据提供的输入返回的聊天完成响应。

  - `id: string`

    聊天完成的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天完成选项的列表。如果 `n` 大于 1，则可以包含多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。该字段为 `stop` ，表示模型到达了自然停止点或遇到了提供的停止序列，
      `length` ，表示已达到请求中指定的最大 token 数，
      `content_filter` ，表示内容因我们的内容过滤器的标记而被省略，
      `tool_calls` ，表示模型调用了工具，或 `function_call` （已弃用），表示模型调用了函数。
      请阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

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

          表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处可能性最高的 token 列表及其对数概率。条目数量可能少于请求的 `top_logprobs`.

          - `token: string`

            该 token。

          - `bytes: array of number or null`

            表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

          - `logprob: number`

            该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息拒绝 token 列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处可能性最高的 token 列表及其对数概率。条目数量可能少于请求的 `top_logprobs`.

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

        消息的注释（如适用），例如在使用
        [网页搜索 工具](/docs/guides/tools-web-search?api-mode=chat).

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

            网页资源的标题。

          - `url: string`

            网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关模型音频响应的数据
        关于模型的音频响应。 [了解更多](/docs/guides/audio).

        - `id: string`

          该音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          该音频响应在服务端不再可用于多轮对话的 Unix 时间戳（秒）
          对话的 Unix 时间戳（以秒为单位）。
          conversations.

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，已由 `tool_calls`。替代。应调用的函数的名称和参数，由模型生成。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

        - `name: string`

          要调用的函数的名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

            - `name: string`

              要调用的函数的名称。

          - `type: "function"`

            工具的类型。目前，仅支持 `function` 内容。

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

    聊天补全创建时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    附加到对象的 16 个键值对集合。可用于以结构化
    格式存储关于对象的附加信息，并通过 API 或仪表板查询对象。
    格式存储关于对象的附加信息，并通过 接口 或仪表板查询对象。

    键为字符串，最长 64 个字符。值
    为字符串，最长 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入和生成输出的审核结果（如果请求了审核补全）
    补全。

    - `input: object { model, results, type }  or object { code, message, type }`

      请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到分数的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，过去始终为 `moderation_result` （针对成功的审核结果）。

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

      对生成内容的审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到分数的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，过去始终为 `moderation_result` （针对成功的审核结果）。

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
    - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为'[flex](/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你在请求中是否指定 `service_tier=fast` 或 `priority` 。
    - 未设置时，默认行为为 'auto'。

    当 `service_tier` 参数被设置时，响应主体将根据实际用于处理该请求的处理模式返回 `service_tier` 值。该响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    该指纹表示模型运行所使用到的服务端配置。

    可与以下 `seed` 请求参数配合使用，以了解何时进行了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数。

    - `prompt_tokens: number`

      提示词中的 token 数。

    - `total_tokens: number`

      请求中使用的总 token 数（提示词 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        补全中出现的预测 token 数。

      - `audio_tokens: optional number`

        模型生成的音频输入 token 数。

      - `reasoning_tokens: optional number`

        模型生成的用于推理的 token 数。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全中的预测 token。但与
        推理 token 类似，这些 token 仍会计入用于计费、
        输出以及上下文窗口限制的总补全 token 数中。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token 数。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数量。

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
  "model": "gpt-5.6-sol",
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

  将模型可用的工具限制为预定义的集合。

  - `mode: "auto" or "required"`

    将模型可用的工具限制为预定义的集合。

    `auto` 允许模型从允许的工具中选取并生成
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

  表示模型根据提供的输入返回的聊天完成响应。

  - `id: string`

    聊天完成的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天完成选项的列表。如果 `n` 大于 1，则可以包含多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。该字段为 `stop` ，表示模型到达了自然停止点或遇到了提供的停止序列，
      `length` ，表示已达到请求中指定的最大 token 数，
      `content_filter` ，表示内容因我们的内容过滤器的标记而被省略，
      `tool_calls` ，表示模型调用了工具，或 `function_call` （已弃用），表示模型调用了函数。
      请阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

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

          表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处可能性最高的 token 列表及其对数概率。条目数量可能少于请求的 `top_logprobs`.

          - `token: string`

            该 token。

          - `bytes: array of number or null`

            表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

          - `logprob: number`

            该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息拒绝 token 列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处可能性最高的 token 列表及其对数概率。条目数量可能少于请求的 `top_logprobs`.

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

        消息的注释（如适用），例如在使用
        [网页搜索 工具](/docs/guides/tools-web-search?api-mode=chat).

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

            网页资源的标题。

          - `url: string`

            网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关模型音频响应的数据
        关于模型的音频响应。 [了解更多](/docs/guides/audio).

        - `id: string`

          该音频响应的唯一标识符。

        - `data: string`

          由模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          该音频响应在服务端不再可用于多轮对话的 Unix 时间戳（秒）
          对话的 Unix 时间戳（以秒为单位）。
          conversations.

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，已由 `tool_calls`。替代。应调用的函数的名称和参数，由模型生成。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

        - `name: string`

          要调用的函数的名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          对模型创建的函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

            - `name: string`

              要调用的函数的名称。

          - `type: "function"`

            工具的类型。目前，仅支持 `function` 内容。

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

    聊天补全创建时的 Unix 时间戳（以秒为单位）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    附加到对象的 16 个键值对集合。可用于以结构化
    格式存储关于对象的附加信息，并通过 API 或仪表板查询对象。
    格式存储关于对象的附加信息，并通过 接口 或仪表板查询对象。

    键为字符串，最长 64 个字符。值
    为字符串，最长 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入和生成输出的审核结果（如果请求了审核补全）
    补全。

    - `input: object { model, results, type }  or object { code, message, type }`

      请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到分数的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，过去始终为 `moderation_result` （针对成功的审核结果）。

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

      对生成内容的审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到分数的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，过去始终为 `moderation_result` （针对成功的审核结果）。

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
    - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为'[flex](/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你在请求中是否指定 `service_tier=fast` 或 `priority` 。
    - 未设置时，默认行为为 'auto'。

    当 `service_tier` 参数被设置时，响应主体将根据实际用于处理该请求的处理模式返回 `service_tier` 值。该响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    该指纹表示模型运行所使用到的服务端配置。

    可与以下 `seed` 请求参数配合使用，以了解何时进行了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage`

    补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数。

    - `prompt_tokens: number`

      提示词中的 token 数。

    - `total_tokens: number`

      请求中使用的总 token 数（提示词 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        补全中出现的预测 token 数。

      - `audio_tokens: optional number`

        模型生成的音频输入 token 数。

      - `reasoning_tokens: optional number`

        模型生成的用于推理的 token 数。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全中的预测 token。但与
        推理 token 类似，这些 token 仍会计入用于计费、
        输出以及上下文窗口限制的总补全 token 数中。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token 数。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的已缓存 token。

      - `image_tokens: optional number`

        提示中存在的图像输入 token。

      - `text_tokens: optional number`

        提示中存在的文本输入 token。

### Chat Completion Allowed Tool Choice

- `ChatCompletionAllowedToolChoice object { allowed_tools, type }`

  将模型可用的工具限制为预定义的集合。

  - `allowed_tools: ChatCompletionAllowedTools`

    将模型可用的工具限制为预定义的集合。

    - `mode: "auto" or "required"`

      将模型可用的工具限制为预定义的集合。

      `auto` 允许模型从允许的工具中选取并生成
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

  模型为响应用户消息而发送的消息。

  - `role: "assistant"`

    消息作者的角色，在本例中为 `assistant`.

    - `"assistant"`

  - `audio: optional object { id }  or null`

    关于模型先前音频响应的数据。
    [了解更多](/docs/guides/audio).

    - `id: string`

      模型先前音频响应的唯一标识符。

  - `content: optional string or array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal or null`

    助手消息的内容。除非指定了 `tool_calls` 或 `function_call` ，否则此项为必填。

    - `TextContent = string`

      助手消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal`

      由已定义类型组成的内容部分数组。可以是一或多个以下类型 `text`，或恰好一个以下类型 `refusal`.

      - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

        了解 [文本输入](/docs/guides/text-generation).

        - `text: string`

          文本内容。

        - `type: "text"`

          content part 的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ChatCompletionContentPartRefusal object { refusal, type }`

        - `refusal: string`

          模型生成的拒绝消息。

        - `type: "refusal"`

          content part 的类型。

          - `"refusal"`

  - `function_call: optional object { arguments, name }  or null`

    已弃用，已由 `tool_calls`。替代。应调用的函数的名称和参数，由模型生成。

    - `arguments: string`

      调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

    - `name: string`

      要调用的函数的名称。

  - `name: optional string`

    参与者可选的名称。为模型提供信息，以区分同一角色的不同参与者。

  - `refusal: optional string or null`

    助手返回的拒绝消息。

  - `tool_calls: optional array of ChatCompletionMessageToolCall`

    模型生成的工具调用，例如函数调用。

    - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

      对模型创建的函数工具的调用。

      - `id: string`

        工具调用的 ID。

      - `function: object { arguments, name }`

        模型调用的函数。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

        - `name: string`

          要调用的函数的名称。

      - `type: "function"`

        工具的类型。目前，仅支持 `function` 内容。

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

### Chat Completion Audio

- `ChatCompletionAudio object { id, data, expires_at, transcript }`

  如果请求了音频输出模态，则此对象包含有关模型音频响应的数据
  关于模型的音频响应。 [了解更多](/docs/guides/audio).

  - `id: string`

    该音频响应的唯一标识符。

  - `data: string`

    由模型生成的 Base64 编码音频字节，格式为
    请求中指定的格式。

  - `expires_at: number`

    该音频响应在服务端不再可用于多轮对话的 Unix 时间戳（秒）
    对话的 Unix 时间戳（以秒为单位）。
    conversations.

  - `transcript: string`

    模型生成的音频转录文本。

### Chat Completion Audio Param

- `ChatCompletionAudioParam object { format, voice }`

  音频输出的参数。在使用以下参数请求音频输出时必填：
  `modalities: ["audio"]`. [了解更多](/docs/guides/audio).

  - `format: "wav" or "aac" or "mp3" or 3 more`

    指定输出音频格式。必须是以下之一： `wav`, `mp3`, `flac`,
    `opus`，或 `pcm16`.

    - `"wav"`

    - `"aac"`

    - `"mp3"`

    - `"flac"`

    - `"opus"`

    - `"pcm16"`

  - `voice: string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

    模型用于响应的语音。支持的内置语音有
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `nova`, `onyx`,
    `sage`, `shimmer`, `marin`、和 `cedar`。你也可以提供带有
    的自定义语音对象， `id`，例如 `{ "id": "voice_1234" }`.

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

      自定义语音引用。

      - `id: string`

        自定义语音 ID，例如 `voice_1234`.

### Chat Completion Chunk

- `ChatCompletionChunk object { id, choices, created, 7 more }`

  表示模型根据所提供的输入返回的聊天补全响应的流式分块
  。
  [了解更多](/docs/guides/streaming-responses).

  - `id: string`

    聊天补全的唯一标识符。每个分块具有相同的 ID。

  - `choices: array of object { delta, finish_reason, index, logprobs }`

    聊天补全选项的列表。如果 `n` 大于 1，则可以包含多个元素。如果在
    最后一个分块中你设置了 `stream_options: {"include_usage": true}`.

    - `delta: object { content, function_call, refusal, 2 more }`

      由流式模型响应生成的聊天补全增量。

      - `content: optional string or null`

        分块消息的内容。

      - `function_call: optional object { arguments, name }`

        已弃用，已由 `tool_calls`。替代。应调用的函数的名称和参数，由模型生成。

        - `arguments: optional string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

        - `name: optional string`

          要调用的函数的名称。

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

            调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

          - `name: optional string`

            要调用的函数的名称。

        - `type: optional "function"`

          工具的类型。目前，仅支持 `function` 内容。

          - `"function"`

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more or null`

      模型停止生成 token 的原因。该字段为 `stop` ，表示模型到达了自然停止点或遇到了提供的停止序列，
      `length` ，表示已达到请求中指定的最大 token 数，
      `content_filter` ，表示内容因我们的内容过滤器的标记而被省略，
      `tool_calls` ，表示模型调用了工具，或 `function_call` （已弃用），表示模型调用了函数。

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

          表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处可能性最高的 token 列表及其对数概率。条目数量可能少于请求的 `top_logprobs`.

          - `token: string`

            该 token。

          - `bytes: array of number or null`

            表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

          - `logprob: number`

            该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息拒绝 token 列表。

        - `token: string`

          该 token。

        - `bytes: array of number or null`

          表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

        - `logprob: number`

          该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处可能性最高的 token 列表及其对数概率。条目数量可能少于请求的 `top_logprobs`.

  - `created: number`

    聊天补全创建时的 Unix 时间戳（以秒为单位）。每个分块具有相同的时间戳。

  - `model: string`

    用于生成补全的模型。

  - `object: "chat.completion.chunk"`

    对象类型，始终为 `chat.completion.chunk`.

    - `"chat.completion.chunk"`

  - `moderation: optional object { input, output }  or null`

    针对请求输入和生成输出的审核结果。当请求经过审核的补全时，
    该字段会出现在审核分块中。

    - `input: object { model, results, type }  or object { code, message, type }`

      请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到分数的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，过去始终为 `moderation_result` （针对成功的审核结果）。

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

      对生成内容的审核。

      - `ModerationResults object { model, results, type }`

        请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数反映了哪些输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            从审核类别到分数的字典。

          - `flagged: boolean`

            指示内容是否被任何类别标记的布尔值。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，过去始终为 `moderation_result` （针对成功的审核结果）。

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
    对某些侧信道攻击的缓解措施。该字段默认包含，并在
    时被省略 `stream_options.include_obfuscation` 为 `false`.

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的处理类型。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为'[flex](/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 若要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你在请求中是否指定 `service_tier=fast` 或 `priority` 。
    - 未设置时，默认行为为 'auto'。

    当 `service_tier` 参数被设置时，响应主体将根据实际用于处理该请求的处理模式返回 `service_tier` 值。该响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行所使用后端配置。
    可与以下 `seed` 请求参数配合使用，以了解何时进行了可能影响确定性的后端更改。

  - `usage: optional CompletionUsage or null`

    仅当你在请求中设置
    `stream_options: {"include_usage": true}` 时才会出现的可选字段。当存在时，它
    包含一个 null 值 **，但最后一个分块除外** 其中包含
    整个请求的 token 使用统计信息。

    **注意：** 如果流被中断或取消，你可能不会
    接收到包含本次请求总 token 用量的
    最后一个 usage 数据块。

    - `completion_tokens: number`

      生成补全中的 token 数。

    - `prompt_tokens: number`

      提示词中的 token 数。

    - `total_tokens: number`

      请求中使用的总 token 数（提示词 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        补全中出现的预测 token 数。

      - `audio_tokens: optional number`

        模型生成的音频输入 token 数。

      - `reasoning_tokens: optional number`

        模型生成的用于推理的 token 数。

      - `rejected_prediction_tokens: optional number`

        使用 Predicted Outputs 时，
        未出现在补全中的预测 token。但与
        推理 token 类似，这些 token 仍会计入用于计费、
        输出以及上下文窗口限制的总补全 token 数中。
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出 token 数。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示词中使用的 token 明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数量。

      - `cached_tokens: optional number`

        提示中存在的已缓存 token。

      - `image_tokens: optional number`

        提示中存在的图像输入 token。

      - `text_tokens: optional number`

        提示中存在的文本输入 token。

### Chat Completion Content Part

- `ChatCompletionContentPart = ChatCompletionContentPartText or ChatCompletionContentPartImage or ChatCompletionContentPartInputAudio or object { file, type, prompt_cache_breakpoint }`

  了解 [文本输入](/docs/guides/text-generation).

  - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

    了解 [文本输入](/docs/guides/text-generation).

    - `text: string`

      文本内容。

    - `type: "text"`

      content part 的类型。

      - `"text"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

      - `mode: "explicit"`

        断点模式。始终为 `explicit`.

        - `"explicit"`

  - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

    了解 [图像输入](/docs/guides/vision).

    - `image_url: object { url, detail }`

      - `url: string`

        图像的 URL 或 base64 编码后的图像数据。

      - `detail: optional "auto" or "low" or "high"`

        指定图像的细节级别。详见 [视觉指南](/docs/guides/vision#low-or-high-fidelity-image-understanding).

        - `"auto"`

        - `"low"`

        - `"high"`

    - `type: "image_url"`

      content part 的类型。

      - `"image_url"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

      - `mode: "explicit"`

        断点模式。始终为 `explicit`.

        - `"explicit"`

  - `ChatCompletionContentPartInputAudio object { input_audio, type, prompt_cache_breakpoint }`

    了解 [音频输入](/docs/guides/audio).

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

      标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

      - `mode: "explicit"`

        断点模式。始终为 `explicit`.

        - `"explicit"`

  - `FileContentPart object { file, type, prompt_cache_breakpoint }`

    了解 [文件输入](/docs/guides/text) 用于文本生成。

    - `file: object { file_data, file_id, filename }`

      - `file_data: optional string`

        Base64 编码的文件数据，在将文件传递给模型时使用
        字符串形式。

      - `file_id: optional string`

        用作输入的上传文件的 ID。

      - `filename: optional string`

        文件的名称，在将文件作为以下形式传递给模型时使用
        字符串。

    - `type: "file"`

      内容部分的类型。始终为 `file`.

      - `"file"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

      - `mode: "explicit"`

        断点模式。始终为 `explicit`.

        - `"explicit"`

### Chat Completion Content Part Image

- `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

  了解 [图像输入](/docs/guides/vision).

  - `image_url: object { url, detail }`

    - `url: string`

      图像的 URL 或 base64 编码后的图像数据。

    - `detail: optional "auto" or "low" or "high"`

      指定图像的细节级别。详见 [视觉指南](/docs/guides/vision#low-or-high-fidelity-image-understanding).

      - `"auto"`

      - `"low"`

      - `"high"`

  - `type: "image_url"`

    content part 的类型。

    - `"image_url"`

  - `prompt_cache_breakpoint: optional object { mode }`

    标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

    - `mode: "explicit"`

      断点模式。始终为 `explicit`.

      - `"explicit"`

### Chat Completion Content Part Input Audio

- `ChatCompletionContentPartInputAudio object { input_audio, type, prompt_cache_breakpoint }`

  了解 [音频输入](/docs/guides/audio).

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

    标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

    - `mode: "explicit"`

      断点模式。始终为 `explicit`.

      - `"explicit"`

### Chat Completion Content Part Refusal

- `ChatCompletionContentPartRefusal object { refusal, type }`

  - `refusal: string`

    模型生成的拒绝消息。

  - `type: "refusal"`

    content part 的类型。

    - `"refusal"`

### Chat Completion Content Part Text

- `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

  了解 [文本输入](/docs/guides/text-generation).

  - `text: string`

    文本内容。

  - `type: "text"`

    content part 的类型。

    - `"text"`

  - `prompt_cache_breakpoint: optional object { mode }`

    标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

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

      自定义工具的输入格式。默认情况下为不受约束的文本。

      - `Text object { type }`

        不受约束的自由格式文本。

        - `type: "text"`

          不受约束的文本格式。始终为 `text`.

          - `"text"`

      - `Grammar object { grammar, type }`

        由用户定义的语法。

        - `grammar: object { definition, syntax }`

          你选择的语法。

          - `definition: string`

            语法定义。

          - `syntax: "lark" or "regex"`

            语法定义的语法。可选值为 `lark` 或 `regex`.

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

    正在删除的对象的类型。

    - `"chat.completion.deleted"`

### Chat Completion Developer Message Param

- `ChatCompletionDeveloperMessageParam object { content, role, name }`

  开发者提供的指令，模型应当遵循这些指令，而无论用户发送了什么样的
  消息。在 o1 及更新模型上，developer， `developer` 消息取代了原先的
  消息中的 `system` messages。

  - `content: string or array of ChatCompletionContentPartText`

    developer 消息的内容。

    - `TextContent = string`

      developer 消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      具有指定类型的 content part 数组。对于 developer 消息，仅支持 type 为 input_text 的 `text` 内容。

      - `text: string`

        文本内容。

      - `type: "text"`

        content part 的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `role: "developer"`

    消息作者的角色，在本例中为 `developer`.

    - `"developer"`

  - `name: optional string`

    参与者可选的名称。为模型提供信息，以区分同一角色的不同参与者。

### Chat Completion Function Call Option

- `ChatCompletionFunctionCallOption object { name }`

  通过 `{"name": "my_function"}` 强制模型调用该函数。

  - `name: string`

    要调用的函数的名称。

### Chat Completion Function Message Param

- `ChatCompletionFunctionMessageParam object { content, name, role }`

  - `content: string or null`

    函数消息的内容。

  - `name: string`

    要调用的函数的名称。

  - `role: "function"`

    消息作者的角色，在本例中为 `function`.

    - `"function"`

### Chat Completion Function Tool

- `ChatCompletionFunctionTool object { function, type }`

  可用于生成响应的函数工具。

  - `function: FunctionDefinition`

    - `name: string`

      要调用的函数名称。只能包含 a-z、A-Z、0-9，或下划线和短横线，最大长度为 64。

    - `description: optional string`

      对函数功能的描述，供模型用于选择何时以及如何调用该函数。

    - `parameters: optional FunctionParameters`

      函数接受的参数，使用 JSON Schema 对象进行描述。详见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 有关此格式的文档。

      省略 `parameters` 定义一个参数列表为空的函数。

    - `strict: optional boolean or null`

      在生成函数调用时是否启用严格的 schema 遵循。如果设置为 true，模型将严格按照 `parameters` 所定义的精确模式。当 strict `strict` 为 `true`。中定义的 schema 执行。详细了解 Structured Outputs，请参阅 [function calling guide](/docs/guides/function-calling).

  - `type: "function"`

    工具的类型。目前，仅支持 `function` 内容。

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

    消息的注释（如适用），例如在使用
    [网页搜索 工具](/docs/guides/tools-web-search?api-mode=chat).

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

        网页资源的标题。

      - `url: string`

        网页资源的 URL。

  - `audio: optional ChatCompletionAudio or null`

    如果请求了音频输出模态，则此对象包含有关模型音频响应的数据
    关于模型的音频响应。 [了解更多](/docs/guides/audio).

    - `id: string`

      该音频响应的唯一标识符。

    - `data: string`

      由模型生成的 Base64 编码音频字节，格式为
      请求中指定的格式。

    - `expires_at: number`

      该音频响应在服务端不再可用于多轮对话的 Unix 时间戳（秒）
      对话的 Unix 时间戳（以秒为单位）。
      conversations.

    - `transcript: string`

      模型生成的音频转录文本。

  - `function_call: optional object { arguments, name }`

    已弃用，已由 `tool_calls`。替代。应调用的函数的名称和参数，由模型生成。

    - `arguments: string`

      调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

    - `name: string`

      要调用的函数的名称。

  - `tool_calls: optional array of ChatCompletionMessageToolCall`

    模型生成的工具调用，例如函数调用。

    - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

      对模型创建的函数工具的调用。

      - `id: string`

        工具调用的 ID。

      - `function: object { arguments, name }`

        模型调用的函数。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

        - `name: string`

          要调用的函数的名称。

      - `type: "function"`

        工具的类型。目前，仅支持 `function` 内容。

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

      调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

    - `name: string`

      要调用的函数的名称。

  - `type: "function"`

    工具的类型。目前，仅支持 `function` 内容。

    - `"function"`

### Chat Completion Message Param

- `ChatCompletionMessageParam = ChatCompletionDeveloperMessageParam or ChatCompletionSystemMessageParam or ChatCompletionUserMessageParam or 3 more`

  开发者提供的指令，模型应当遵循这些指令，而无论用户发送了什么样的
  消息。在 o1 及更新模型上，developer， `developer` 消息取代了原先的
  消息中的 `system` messages。

  - `ChatCompletionDeveloperMessageParam object { content, role, name }`

    开发者提供的指令，模型应当遵循这些指令，而无论用户发送了什么样的
    消息。在 o1 及更新模型上，developer， `developer` 消息取代了原先的
    消息中的 `system` messages。

    - `content: string or array of ChatCompletionContentPartText`

      developer 消息的内容。

      - `TextContent = string`

        developer 消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        具有指定类型的 content part 数组。对于 developer 消息，仅支持 type 为 input_text 的 `text` 内容。

        - `text: string`

          文本内容。

        - `type: "text"`

          content part 的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `role: "developer"`

      消息作者的角色，在本例中为 `developer`.

      - `"developer"`

    - `name: optional string`

      参与者可选的名称。为模型提供信息，以区分同一角色的不同参与者。

  - `ChatCompletionSystemMessageParam object { content, role, name }`

    开发者提供的指令，模型应当遵循这些指令，而无论用户发送了什么样的
    用户发送的消息。对于 o1 及更新模型，请使用 `developer` 消息取代了原先的
    来替代此用途。

    - `content: string or array of ChatCompletionContentPartText`

      系统消息的内容。

      - `TextContent = string`

        系统消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        包含已定义类型的 content 部件数组。对于系统消息，仅支持 type `text` 内容。

        - `text: string`

          文本内容。

        - `type: "text"`

          content part 的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

    - `role: "system"`

      消息作者的角色，在本例中为 `system`.

      - `"system"`

    - `name: optional string`

      参与者可选的名称。为模型提供信息，以区分同一角色的不同参与者。

  - `ChatCompletionUserMessageParam object { content, role, name }`

    由终端用户发送的消息，包含提示词或其他上下文
    信息。

    - `content: string or array of ChatCompletionContentPart`

      用户消息的内容。

      - `TextContent = string`

        消息的文本内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPart`

        包含已定义类型的 content 部件数组。可选项取决于用于生成响应的 [model](/docs/models) 。可以包含文本、图像或音频输入。

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/docs/guides/text-generation).

          - `text: string`

            文本内容。

          - `type: "text"`

            content part 的类型。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

        - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

          了解 [图像输入](/docs/guides/vision).

          - `image_url: object { url, detail }`

            - `url: string`

              图像的 URL 或 base64 编码后的图像数据。

            - `detail: optional "auto" or "low" or "high"`

              指定图像的细节级别。详见 [视觉指南](/docs/guides/vision#low-or-high-fidelity-image-understanding).

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_url"`

            content part 的类型。

            - `"image_url"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ChatCompletionContentPartInputAudio object { input_audio, type, prompt_cache_breakpoint }`

          了解 [音频输入](/docs/guides/audio).

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

            标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `FileContentPart object { file, type, prompt_cache_breakpoint }`

          了解 [文件输入](/docs/guides/text) 用于文本生成。

          - `file: object { file_data, file_id, filename }`

            - `file_data: optional string`

              Base64 编码的文件数据，在将文件传递给模型时使用
              字符串形式。

            - `file_id: optional string`

              用作输入的上传文件的 ID。

            - `filename: optional string`

              文件的名称，在将文件作为以下形式传递给模型时使用
              字符串。

          - `type: "file"`

            内容部分的类型。始终为 `file`.

            - `"file"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

    - `role: "user"`

      消息作者的角色，在本例中为 `user`.

      - `"user"`

    - `name: optional string`

      参与者可选的名称。为模型提供信息，以区分同一角色的不同参与者。

  - `ChatCompletionAssistantMessageParam object { role, audio, content, 4 more }`

    模型为响应用户消息而发送的消息。

    - `role: "assistant"`

      消息作者的角色，在本例中为 `assistant`.

      - `"assistant"`

    - `audio: optional object { id }  or null`

      关于模型先前音频响应的数据。
      [了解更多](/docs/guides/audio).

      - `id: string`

        模型先前音频响应的唯一标识符。

    - `content: optional string or array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal or null`

      助手消息的内容。除非指定了 `tool_calls` 或 `function_call` ，否则此项为必填。

      - `TextContent = string`

        助手消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal`

        由已定义类型组成的内容部分数组。可以是一或多个以下类型 `text`，或恰好一个以下类型 `refusal`.

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/docs/guides/text-generation).

        - `ChatCompletionContentPartRefusal object { refusal, type }`

          - `refusal: string`

            模型生成的拒绝消息。

          - `type: "refusal"`

            content part 的类型。

            - `"refusal"`

    - `function_call: optional object { arguments, name }  or null`

      已弃用，已由 `tool_calls`。替代。应调用的函数的名称和参数，由模型生成。

      - `arguments: string`

        调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

      - `name: string`

        要调用的函数的名称。

    - `name: optional string`

      参与者可选的名称。为模型提供信息，以区分同一角色的不同参与者。

    - `refusal: optional string or null`

      助手返回的拒绝消息。

    - `tool_calls: optional array of ChatCompletionMessageToolCall`

      模型生成的工具调用，例如函数调用。

      - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

        对模型创建的函数工具的调用。

        - `id: string`

          工具调用的 ID。

        - `function: object { arguments, name }`

          模型调用的函数。

          - `arguments: string`

            调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

          - `name: string`

            要调用的函数的名称。

        - `type: "function"`

          工具的类型。目前，仅支持 `function` 内容。

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

        具有已定义类型的内容片段数组。对于工具消息，仅类型 `text` 内容。

        - `text: string`

          文本内容。

        - `type: "text"`

          content part 的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

    - `role: "tool"`

      消息作者的角色，在本例中为 `tool`.

      - `"tool"`

    - `tool_call_id: string`

      此消息正在响应的工具调用。

  - `ChatCompletionFunctionMessageParam object { content, name, role }`

    - `content: string or null`

      函数消息的内容。

    - `name: string`

      要调用的函数的名称。

    - `role: "function"`

      消息作者的角色，在本例中为 `function`.

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

        调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构函数 schema 中未定义的参数。在调用函数之前，请先在代码中校验这些参数。

      - `name: string`

        要调用的函数的名称。

    - `type: "function"`

      工具的类型。目前，仅支持 `function` 内容。

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

  指定模型应使用的工具。用于强制模型调用某个特定函数。

  - `function: object { name }`

    - `name: string`

      要调用的函数的名称。

  - `type: "function"`

    对于函数调用，类型始终为 `function`.

    - `"function"`

### Chat Completion Named Tool Choice Custom

- `ChatCompletionNamedToolChoiceCustom object { custom, type }`

  指定模型应使用的工具。用于强制模型调用某个特定的自定义工具。

  - `custom: object { name }`

    - `name: string`

      要调用的自定义工具的名称。

  - `type: "custom"`

    对于自定义工具调用，类型始终为 `custom`.

    - `"custom"`

### Chat Completion Prediction Content

- `ChatCompletionPredictionContent object { content, type }`

  静态预测输出内容，例如正在被重新生成的文本文件内容。
  being regenerated.

  - `content: string or array of ChatCompletionContentPartText`

    生成模型响应时应匹配的内容。
    如果生成的 token 与该内容匹配，则可以更快地返回整个模型响应。
    can be returned much more quickly.

    - `TextContent = string`

      用于 Predicted Output 的内容。这通常是
      你正在重新生成且仅有少量改动的文件的文本。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      包含已定义类型的 content 部件数组。可选项取决于用于生成响应的 [model](/docs/models) 正在用于生成响应的输入消息。可以包含文本输入。

      - `text: string`

        文本内容。

      - `type: "text"`

        content part 的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `type: "content"`

    你要提供的预测内容的类型。该类型
    目前始终为 `content`.

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

- `ChatCompletionStoreMessage = ChatCompletionMessage`

  由模型生成的聊天补全消息。

  - `id: string`

    聊天消息的标识符。

  - `content_parts: optional array of ChatCompletionContentPartText or ChatCompletionContentPartImage or null`

    如果提供了 content parts 数组，则该字段为一个数组，元素为 `text` 和 `image_url` parts。
    否则为 null。

    - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

      了解 [文本输入](/docs/guides/text-generation).

      - `text: string`

        文本内容。

      - `type: "text"`

        content part 的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

      了解 [图像输入](/docs/guides/vision).

      - `image_url: object { url, detail }`

        - `url: string`

          图像的 URL 或 base64 编码后的图像数据。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。详见 [视觉指南](/docs/guides/vision#low-or-high-fidelity-image-understanding).

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        content part 的类型。

        - `"image_url"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

### Chat Completion 流选项

- `ChatCompletionStreamOptions object { include_obfuscation, include_usage }`

  流式响应的选项。仅当你设置 `stream: true`.

  - `include_obfuscation: optional boolean`

    当为 true 时，将启用流混淆。流混淆会向
    流式增量事件上的某个 `obfuscation` 字段添加随机字符，以
    规范化负载大小，作为对某些侧信道攻击的缓解措施。
    默认情况下会包含这些混淆字段，但会给数据流带来少量
    开销。如果你信任客户端与服务端之间的网络链路，可以将 `include_obfuscation` 设置为
    设置为 false 以优化带宽。
    你的应用与 OpenAI API 之间的。

  - `include_usage: optional boolean`

    如果设置了该参数，会在 `data: [DONE]`
    之前流式传输一个额外的分块 `usage` message。该分块上的
    字段显示整个请求的 token 使用统计信息，而 `choices` 字段将始终为空
    数组。

    所有其他分块也会包含一个 `usage` 字段，但其值为 null
    。 **注意：** 如果流被中断，你可能无法收到
    包含该请求总 token 使用量的最后一个 usage 分块。

### Chat Completion 系统消息参数

- `ChatCompletionSystemMessageParam object { content, role, name }`

  开发者提供的指令，模型应当遵循这些指令，而无论用户发送了什么样的
  用户发送的消息。对于 o1 及更新模型，请使用 `developer` 消息取代了原先的
  来替代此用途。

  - `content: string or array of ChatCompletionContentPartText`

    系统消息的内容。

    - `TextContent = string`

      系统消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      包含已定义类型的 content 部件数组。对于系统消息，仅支持 type `text` 内容。

      - `text: string`

        文本内容。

      - `type: "text"`

        content part 的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `role: "system"`

    消息作者的角色，在本例中为 `system`.

    - `"system"`

  - `name: optional string`

    参与者可选的名称。为模型提供信息，以区分同一角色的不同参与者。

### Chat Completion Token 概率

- `ChatCompletionTokenLogprob object { token, bytes, logprob, top_logprobs }`

  - `token: string`

    该 token。

  - `bytes: array of number or null`

    表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

  - `logprob: number`

    该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

  - `top_logprobs: array of object { token, bytes, logprob }`

    在该 token 位置处可能性最高的 token 列表及其对数概率。条目数量可能少于请求的 `top_logprobs`.

    - `token: string`

      该 token。

    - `bytes: array of number or null`

      表示该 token 的 UTF-8 字节表示的整数列表。在字符由多个 token 表示且必须组合其字节表示才能生成正确文本表示的场景下非常有用。可以为 `null` ，表示该 token 没有字节表示。

    - `logprob: number`

      该 token 的对数概率（若它处于概率最高的前 20 个 token 之列）。否则，值 `-9999.0` 用于表示该 token 出现的可能性极低。

### Chat Completion 工具

- `ChatCompletionTool = ChatCompletionFunctionTool or ChatCompletionCustomTool`

  可用于生成响应的函数工具。

  - `ChatCompletionFunctionTool object { function, type }`

    可用于生成响应的函数工具。

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数名称。只能包含 a-z、A-Z、0-9，或下划线和短横线，最大长度为 64。

      - `description: optional string`

        对函数功能的描述，供模型用于选择何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，使用 JSON Schema 对象进行描述。详见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 有关此格式的文档。

        省略 `parameters` 定义一个参数列表为空的函数。

      - `strict: optional boolean or null`

        在生成函数调用时是否启用严格的 schema 遵循。如果设置为 true，模型将严格按照 `parameters` 所定义的精确模式。当 strict `strict` 为 `true`。中定义的 schema 执行。详细了解 Structured Outputs，请参阅 [function calling guide](/docs/guides/function-calling).

    - `type: "function"`

      工具的类型。目前，仅支持 `function` 内容。

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

        自定义工具的输入格式。默认情况下为不受约束的文本。

        - `Text object { type }`

          不受约束的自由格式文本。

          - `type: "text"`

            不受约束的文本格式。始终为 `text`.

            - `"text"`

        - `Grammar object { grammar, type }`

          由用户定义的语法。

          - `grammar: object { definition, syntax }`

            你选择的语法。

            - `definition: string`

              语法定义。

            - `syntax: "lark" or "regex"`

              语法定义的语法。可选值为 `lark` 或 `regex`.

              - `"lark"`

              - `"regex"`

          - `type: "grammar"`

            语法格式。始终为 `grammar`.

            - `"grammar"`

    - `type: "custom"`

      自定义工具的类型。始终为 `custom`.

      - `"custom"`

### Chat Completion 工具选择选项

- `ChatCompletionToolChoiceOption = "none" or "auto" or "required" or ChatCompletionAllowedToolChoice or ChatCompletionNamedToolChoice or ChatCompletionNamedToolChoiceCustom`

  控制模型调用哪个工具（如果有的话）。
  `none` 意味着模型不会调用任何工具，而是生成一条消息。
  `auto` 意味着模型可以在生成消息和调用一个或多个工具之间进行选择。
  `required` 意味着模型必须调用一个或多个工具。
  通过 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

  `none` 是没有工具时的默认值。 `auto` 是存在工具时的默认值。

  - `ToolChoiceMode = "none" or "auto" or "required"`

    `none` 意味着模型不会调用任何工具，而是生成一条消息。 `auto` 意味着模型可以在生成消息和调用一个或多个工具之间进行选择。 `required` 意味着模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ChatCompletionAllowedToolChoice object { allowed_tools, type }`

    将模型可用的工具限制为预定义的集合。

    - `allowed_tools: ChatCompletionAllowedTools`

      将模型可用的工具限制为预定义的集合。

      - `mode: "auto" or "required"`

        将模型可用的工具限制为预定义的集合。

        `auto` 允许模型从允许的工具中选取并生成
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

    指定模型应使用的工具。用于强制模型调用某个特定函数。

    - `function: object { name }`

      - `name: string`

        要调用的函数的名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ChatCompletionNamedToolChoiceCustom object { custom, type }`

    指定模型应使用的工具。用于强制模型调用某个特定的自定义工具。

    - `custom: object { name }`

      - `name: string`

        要调用的自定义工具的名称。

    - `type: "custom"`

      对于自定义工具调用，类型始终为 `custom`.

      - `"custom"`

### Chat Completion 工具消息参数

- `ChatCompletionToolMessageParam object { content, role, tool_call_id }`

  - `content: string or array of ChatCompletionContentPartText`

    工具消息的内容。

    - `TextContent = string`

      工具消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      具有已定义类型的内容片段数组。对于工具消息，仅类型 `text` 内容。

      - `text: string`

        文本内容。

      - `type: "text"`

        content part 的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `role: "tool"`

    消息作者的角色，在本例中为 `tool`.

    - `"tool"`

  - `tool_call_id: string`

    此消息正在响应的工具调用。

### Chat Completion 用户消息参数

- `ChatCompletionUserMessageParam object { content, role, name }`

  由终端用户发送的消息，包含提示词或其他上下文
  信息。

  - `content: string or array of ChatCompletionContentPart`

    用户消息的内容。

    - `TextContent = string`

      消息的文本内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPart`

      包含已定义类型的 content 部件数组。可选项取决于用于生成响应的 [model](/docs/models) 。可以包含文本、图像或音频输入。

      - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

        了解 [文本输入](/docs/guides/text-generation).

        - `text: string`

          文本内容。

        - `type: "text"`

          content part 的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

        了解 [图像输入](/docs/guides/vision).

        - `image_url: object { url, detail }`

          - `url: string`

            图像的 URL 或 base64 编码后的图像数据。

          - `detail: optional "auto" or "low" or "high"`

            指定图像的细节级别。详见 [视觉指南](/docs/guides/vision#low-or-high-fidelity-image-understanding).

            - `"auto"`

            - `"low"`

            - `"high"`

        - `type: "image_url"`

          content part 的类型。

          - `"image_url"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ChatCompletionContentPartInputAudio object { input_audio, type, prompt_cache_breakpoint }`

        了解 [音频输入](/docs/guides/audio).

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

          标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `FileContentPart object { file, type, prompt_cache_breakpoint }`

        了解 [文件输入](/docs/guides/text) 用于文本生成。

        - `file: object { file_data, file_id, filename }`

          - `file_data: optional string`

            Base64 编码的文件数据，在将文件传递给模型时使用
            字符串形式。

          - `file_id: optional string`

            用作输入的上传文件的 ID。

          - `filename: optional string`

            文件的名称，在将文件作为以下形式传递给模型时使用
            字符串。

        - `type: "file"`

          内容部分的类型。始终为 `file`.

          - `"file"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

  - `role: "user"`

    消息作者的角色，在本例中为 `user`.

    - `"user"`

  - `name: optional string`

    参与者可选的名称。为模型提供信息，以区分同一角色的不同参与者。

# 消息

## 获取聊天消息

**get** `/chat/completions/{completion_id}/messages`

获取存储的聊天补全中的消息。仅返回使用
以下参数创建的 Chat Completions `store` 参数时才能被删除。 `true` 会被
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

### Returns

- `data: array of ChatCompletionStoreMessage`

  聊天补全消息对象的数组。

  - `id: string`

    聊天消息的标识符。

  - `content_parts: optional array of ChatCompletionContentPartText or ChatCompletionContentPartImage or null`

    如果提供了 content parts 数组，则该字段为一个数组，元素为 `text` 和 `image_url` parts。
    否则为 null。

    - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

      了解 [文本输入](/docs/guides/text-generation).

      - `text: string`

        文本内容。

      - `type: "text"`

        content part 的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

    - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

      了解 [图像输入](/docs/guides/vision).

      - `image_url: object { url, detail }`

        - `url: string`

          图像的 URL 或 base64 编码后的图像数据。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。详见 [视觉指南](/docs/guides/vision#low-or-high-fidelity-image-understanding).

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        content part 的类型。

        - `"image_url"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用 prompt 前缀的精确结束位置。该断点会沿用请求的 prompt_cache_key `prompt_cache_options.ttl`；所对应的 TTL；边界不会取整到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

- `first_id: string`

  数据数组中第一条聊天消息的标识符。

- `has_more: boolean`

  指示是否还有更多可用的聊天消息。

- `last_id: string`

  数据数组中最后一条聊天消息的标识符。

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
