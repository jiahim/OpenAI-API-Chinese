# 聊天

> 完整文档索引，请参阅 [llms.txt](/llms.txt)。通过附加 `.md` 到页面 URL 获取文档页面的 Markdown 版本。

# 补全

## 创建聊天补全

**post** `/chat/completions`

**开始一个新项目？** 我们推荐尝试 [Responses](/docs/api-reference/responses)
以利用最新的 OpenAI 平台功能。比较
[Chat Completions 与 Responses](/docs/guides/responses-vs-chat-completions?api-mode=responses).

---

为给定的聊天对话创建模型响应。了解更多，请参阅
[文本生成](/docs/guides/text-generation), [视觉](/docs/guides/vision),
和 [音频](/docs/guides/audio) 指南。

参数支持可能因用于生成
响应的模型而异，尤其是对于较新的推理模型。仅
推理模型支持的参数在下方注明。关于推理模型中
不支持的参数的当前状态，
[请参阅推理指南](/docs/guides/reasoning).

返回聊天完成对象；如果请求是流式的，则返回流式序列的聊天完成
分块对象。

### 正文参数

- `messages: array of ChatCompletionMessageParam`

  一个消息列表，包含至今为止的对话内容。根据你使用的
  [模型](/docs/models) ，支持不同的消息类型（模态），如
  文本、 [文本](/docs/guides/text-generation),
  [图像](/docs/guides/vision)，和 [音频](/docs/guides/audio).

  - `ChatCompletionDeveloperMessageParam object { content, role, name }`

    开发者提供的指令，模型应遵循这些指令，无论用户发送什么消息。对于 o1 及更新版本的模型，
    消息， `developer` 消息
    会替换之前的 `system` 消息。

    - `content: string or array of ChatCompletionContentPartText`

      开发者消息的内容。

      - `TextContent = string`

        开发者消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        一个内容部分的数组，每个部分有定义的类型。对于开发者消息，仅支持类型 `text` 。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

    - `role: "developer"`

      消息作者的角色，在本例中为 `developer`.

      - `"developer"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的参与者。

  - `ChatCompletionSystemMessageParam object { content, role, name }`

    开发者提供的指令，模型应遵循这些指令，无论用户发送什么消息。对于 o1 及更新版本的模型，
    用户发送的消息。对于 o1 及更新模型，请改用 `developer` 消息
    用于此目的。

    - `content: string or array of ChatCompletionContentPartText`

      系统消息的内容。

      - `TextContent = string`

        系统消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        具有定义类型的内容部分数组。对于系统消息，仅类型 `text` 。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

    - `role: "system"`

      消息作者的角色，在本例中为 `system`.

      - `"system"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的参与者。

  - `ChatCompletionUserMessageParam object { content, role, name }`

    最终用户发送的消息，包含提示或额外上下文
    信息。

    - `content: string or array of ChatCompletionContentPart`

      用户消息的内容。

      - `TextContent = string`

        消息的文本内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPart`

        具有定义类型的内容部分数组。支持的选项因用于生成响应的 [模型](/docs/models) 而异。可以包含文本、图像或音频输入。

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/docs/guides/text-generation).

          - `text: string`

            文本内容。

          - `type: "text"`

            内容部分的类型。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

          了解 [图像输入](/docs/guides/vision).

          - `image_url: object { url, detail }`

            - `url: string`

              图像的 URL 或 base64 编码的图像数据。

            - `detail: optional "auto" or "low" or "high"`

              指定图像的细节级别。更多信息请参阅 [视觉指南](/docs/guides/vision#low-or-high-fidelity-image-understanding).

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_url"`

            内容部分的类型。

            - `"image_url"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

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

            标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `FileContentPart object { file, type, prompt_cache_breakpoint }`

          了解 [文件输入](/docs/guides/text) 用于文本生成。

          - `file: object { file_data, file_id, filename }`

            - `file_data: optional string`

              以字符串形式将文件传递给模型时使用的 Base64 编码文件数据，
              作为字符串。

            - `file_id: optional string`

              用作输入的已上传文件的 ID。

            - `filename: optional string`

              文件名，以字符串形式将文件传递给模型时使用
              字符串。

          - `type: "file"`

            内容部分的类型。始终为 `file`.

            - `"file"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

    - `role: "user"`

      消息作者的角色，在本例中为 `user`.

      - `"user"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的参与者。

  - `ChatCompletionAssistantMessageParam object { role, audio, content, 4 more }`

    模型响应用户消息时发送的消息。

    - `role: "assistant"`

      消息作者的角色，在本例中为 `assistant`.

      - `"assistant"`

    - `audio: optional object { id }  or null`

      关于模型先前音频响应的数据。
      [了解更多](/docs/guides/audio).

      - `id: string`

        模型先前音频响应的唯一标识符。

    - `content: optional string or array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal or null`

      助手消息的内容。除非指定了 `tool_calls` 或 `function_call` ，否则为必填。

      - `TextContent = string`

        助手消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal`

        一个具有已定义类型的内容部分数组。可以是一个或多个 `text`，类型，或恰好一个 `refusal`.

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/docs/guides/text-generation).

        - `ChatCompletionContentPartRefusal object { refusal, type }`

          - `refusal: string`

            模型生成的拒绝消息。

          - `type: "refusal"`

            内容部分的类型。

            - `"refusal"`

    - `function_call: optional object { arguments, name }  or null`

      已弃用，由 `tool_calls`。取代。模型生成的应调用函数的名称和参数。

      - `arguments: string`

        以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

      - `name: string`

        要调用的函数的名称。

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的参与者。

    - `refusal: optional string or null`

      助手生成的拒绝消息。

    - `tool_calls: optional array of ChatCompletionMessageToolCall`

      模型生成的工具调用，例如函数调用。

      - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

        模型创建的函数工具调用。

        - `id: string`

          工具调用的 ID。

        - `function: object { arguments, name }`

          模型调用的函数。

          - `arguments: string`

            以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

          - `name: string`

            要调用的函数的名称。

        - `type: "function"`

          工具的类型。目前仅 `function` 。

          - `"function"`

      - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

        模型创建的自定义工具调用。

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

        一组具有已定义类型的内容部分。对于工具消息，仅类型 `text` 。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

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

  用于生成响应的模型 ID，例如 `gpt-4o` 或 `o3`. OpenAI
  提供了一系列具有不同能力、性能
  特性和价格点的模型。请参阅 [模型指南](/docs/models)
  以浏览和比较可用的模型。

  - `string`

  - `"gpt-5.6-sol" or "gpt-5.6-terra" or "gpt-5.6-luna" or 80 more`

    用于生成响应的模型 ID，例如 `gpt-4o` 或 `o3`. OpenAI
    提供了一系列具有不同能力、性能
    特性和价格点的模型。请参阅 [模型指南](/docs/models)
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

  音频输出参数。当请求音频输出时必需，
  `modalities: ["audio"]`. [了解更多](/docs/guides/audio).

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

    模型用于响应的声音。支持的内置声音有
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `nova`, `onyx`,
    `sage`, `shimmer`, `marin`，和 `cedar`. 你也可以提供
    带有 `id`，的自定义声音对象，例如 `{ "id": "voice_1234" }`.

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

      自定义声音参考。

      - `id: string`

        自定义声音 ID，例如 `voice_1234`.

- `frequency_penalty: optional number or null`

  介于 -2.0 和 2.0 之间的数字。正值根据新 token 在
  当前文本中已有的频率对其进行惩罚，从而降低模型
  逐字重复同一行的可能性。

- `function_call: optional "none" or "auto" or ChatCompletionFunctionCallOption`

  已弃用，改用 `tool_choice`.

  控制模型调用哪个函数（如果有）。

  `none` 表示模型不会调用函数，而是生成一条
  消息。

  `auto` 表示模型可以在生成消息或调用
  函数之间进行选择。

  通过 `{"name": "my_function"}` 指定特定函数会
  强制模型调用该函数。

  `none` 在没有函数存在时是默认设置。 `auto` 在存在函数时是默认
  设置。

  - `"none" or "auto"`

    `none` 表示模型不会调用函数，而是生成一条消息。 `auto` 表示模型可以在生成消息或调用函数之间进行选择。

    - `"none"`

    - `"auto"`

  - `ChatCompletionFunctionCallOption object { name }`

    通过 `{"name": "my_function"}` 强制模型调用该函数。

    - `name: string`

      要调用的函数的名称。

- `functions: optional array of object { name, description, parameters }`

  已弃用，改用 `tools`.

  模型可以为其生成 JSON 输入的函数列表。

  - `name: string`

    要调用的函数的名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

  - `description: optional string`

    函数功能的描述，模型根据此描述来决定何时以及如何调用该函数。

  - `parameters: optional FunctionParameters`

    函数接受的参数，以 JSON Schema 对象的形式描述。参见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 有关格式的文档。

    省略 `parameters` 定义了一个参数列表为空的函数。

- `logit_bias: optional map[number] or null`

  修改指定 tokens 在补全中出现的可能性。

  接受一个 JSON 对象，该对象将 tokens（由 token ID 在
  分词器中指定）映射到 -100 到 100 之间的偏置值。从数学上讲，
  该偏置会在采样前添加到模型生成的 logits 中。
  具体效果因模型而异，但 -1 到 1 之间的值应该
  会降低或增加被选中的可能性；像 -100 或 100 这样的值
  应该会导致相关 token 被禁止或独占选择。

- `logprobs: optional boolean or null`

  是否返回输出 tokens 的对数概率。如果为 true，
  则返回输出中每个输出 token 的对数概率。
  `content` 的 `message`.

- `max_completion_tokens: optional number or null`

  一次补全能生成 token 数的上限，包括可见输出 tokens 和 [推理 tokens](/docs/guides/reasoning).

- `max_tokens: optional number or null`

  可能生成的 [tokens](/tokenizer) 的最大数量
  在聊天补全中。该值可用于控制
  [成本](https://openai.com/api/pricing/) 通过 API 生成的文本。

  此值现已弃用，推荐使用 `max_completion_tokens`，并且
  不兼容 [o-series models](/docs/guides/reasoning).

- `metadata: optional Metadata or null`

  可以附加到对象的一组 16 个键值对。这可用于
  以结构化格式存储关于对象的额外信息，
  并通过 API 或仪表板查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串，
  最大长度为 512 个字符。

- `modalities: optional array of "text" or "audio" or null`

  你希望模型生成的输出类型。
  大多数模型能够生成文本，这是默认设置：

  `["text"]`

  该 `gpt-4o-audio-preview` 模型也可用于
  [生成音频](/docs/guides/audio)。要请求该模型生成
  文本和音频响应，你可以使用：

  `["text", "audio"]`

  - `"text"`

  - `"audio"`

- `moderation: optional object { model, policy }  or null`

  用于对请求输入和生成的输出运行审核的配置。

  - `model: string`

    用于审核完成的审核模型，例如 'omni-moderation-latest'。

  - `policy: optional object { input, output }  or null`

    应用于审核的响应输入和输出的策略。

    - `input: optional object { mode }  or null`

      响应输入的审核政策。

      - `mode: "score" or "block"`

        - `"score"`

        - `"block"`

    - `output: optional object { mode }  or null`

      响应输出的审核政策。

      - `mode: "score" or "block"`

        - `"score"`

        - `"block"`

- `n: optional number or null`

  为每条输入消息生成多少个聊天完成选项。注意，将根据所有选项中生成的令牌数量收费。保持 `n` 为 `1` 以降低成本。

- `parallel_tool_calls: optional boolean`

  是否启用 [并行函数调用](/docs/guides/function-calling#configuring-parallel-function-calling) 在工具使用期间。

- `prediction: optional ChatCompletionPredictionContent or null`

  静态预测输出内容，例如正在重新生成的文本文件的
  内容。

  - `content: string or array of ChatCompletionContentPartText`

    生成模型响应时应匹配的内容。
    如果生成的令牌与此内容匹配，则整个模型响应
    可以更快地返回。

    - `TextContent = string`

      用于预测输出的内容。这通常是
      你正在以微小更改重新生成的文件的文本。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      具有定义类型的内容部分数组。支持的选项因用于生成响应的 [模型](/docs/models) 用于生成响应。可以包含文本输入。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

  - `type: "content"`

    你想要提供的预测内容的类型。此类型
    目前始终为 `content`.

    - `"content"`

- `presence_penalty: optional number or null`

  介于 -2.0 和 2.0 之间的数字。正值根据新 token 在
  它们是否出现在当前文本中，增加模型
  谈论新主题的可能性。

- `prompt_cache_key: optional string or null`

  由 OpenAI 用于缓存相似请求的响应，以优化你的缓存命中率。取代 `user` 字段。 [了解更多](/docs/guides/prompt-caching).

- `prompt_cache_options: optional object { mode, ttl }`

  提示缓存的选项。支持 `gpt-5.6` 及更高版本的模型。默认情况下，OpenAI 自动选择一个隐式缓存断点。你可以使用 `prompt_cache_breakpoint`。向内容块添加显式断点。每个请求最多可写入四个断点。为进行缓存匹配，OpenAI 会考虑对话中最近的 80 个断点，无内容块回溯限制。将 `mode` 设置为 `explicit` 以禁用隐式断点。 `ttl` 默认为 `30m`，这是当前唯一支持的值。参见 [提示缓存指南](/docs/guides/prompt-caching) 以了解当前详情。

  - `mode: optional "implicit" or "explicit"`

    控制 OpenAI 是否自动创建隐式缓存断点。默认为 `implicit`。当设置为 `implicit`，时，OpenAI 会创建一个隐式断点，并写入请求中最多三个最近的显式断点。当设置为 `explicit`，时，OpenAI 不创建隐式断点，并写入最多四个最近的显式断点。如果没有显式断点，请求不会使用提示缓存。

    - `"implicit"`

    - `"explicit"`

  - `ttl: optional "30m"`

    适用于请求写入的每个隐式和显式缓存断点的最短生存时间。默认为 `30m`，这是当前唯一支持的值。后端可能保留缓存条目更长时间。

    - `"30m"`

- `prompt_cache_retention: optional "in_memory" or "24h" or null`

  已弃用。请使用 `prompt_cache_options.ttl` 代替。

  提示缓存的保留策略。设置为 `24h` 以启用扩展提示缓存，使缓存的提示前缀保持活跃更长时间，最长可达 24 小时。 [了解更多](/docs/guides/prompt-caching#prompt-cache-retention).
  此字段表示最长保留策略，而
  `prompt_cache_options.ttl` 表示最短缓存生命周期。这两个
  字段相互独立，互不影响。
  对于 `gpt-5.5`, `gpt-5.5-pro`，以及未来的模型，仅 `24h` 。

  对于同时支持这两者的较旧模型 `in_memory` 和 `24h`，默认值取决于你所在组织的数据保留策略：

  - 未启用 ZDR 的组织默认为 `24h`.
  - 已启用 ZDR 的组织默认为 `in_memory` 当 `prompt_cache_retention` 未指定时。

  - `"in_memory"`

  - `"24h"`

- `reasoning_effort: optional ReasoningEffort or null`

  限制推理模型在推理上的投入程度。当前支持的
  值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
  降低推理投入可以加快响应速度并减少响应中用于推理的
  令牌数量。并非所有推理模型都支持每个
  值。请参阅
  [推理指南](https://platform.openai.com/docs/guides/reasoning)
  了解各模型的支持情况。

  - `"none"`

  - `"minimal"`

  - `"low"`

  - `"medium"`

  - `"high"`

  - `"xhigh"`

  - `"max"`

- `response_format: optional ResponseFormatText or ResponseFormatJSONSchema or ResponseFormatJSONObject`

  一个对象，指定模型必须输出的格式。

  设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用
  Structured Outputs，它确保模型将匹配你提供的 JSON
  schema。了解更多请参阅 [Structured Outputs
  指南](/docs/guides/structured-outputs).

  设置为 `{ "type": "json_object" }` 可启用较旧的 JSON 模式，它
  确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
  的模型，优先使用它。

  - `ResponseFormatText object { type }`

    默认响应格式。用于生成文本响应。

    - `type: "text"`

      正在定义的响应格式的类型。始终为 `text`.

      - `"text"`

  - `ResponseFormatJSONSchema object { json_schema, type }`

    JSON Schema 响应格式。用于生成结构化的 JSON 响应。
    了解更多关于 [Structured Outputs](/docs/guides/structured-outputs).

    - `json_schema: object { name, description, schema, strict }`

      Structured Outputs 配置选项的信息，包括 JSON Schema。

      - `name: string`

        响应格式的名称。必须为 a-z、A-Z、0-9，或包含
        下划线和连字符，最大长度为 64。

      - `description: optional string`

        响应格式用途的描述，模型使用它来
        决定如何按该格式进行响应。

      - `schema: optional map[unknown]`

        响应格式的 schema，以 JSON Schema 对象描述。
        了解如何构建 JSON schemas [此处](https://json-schema.org/).

      - `strict: optional boolean or null`

        是否在生成输出时启用严格的架构遵循。
        如果设置为 true，模型将始终遵循定义的精确架构
        中的 `schema` 字段。当
        `strict` 为 `true`。时，仅支持 JSON Schema 的子集。要了解更多信息，请阅读 [Structured Outputs
        指南](/docs/guides/structured-outputs).

    - `type: "json_schema"`

      正在定义的响应格式的类型。始终为 `json_schema`.

      - `"json_schema"`

  - `ResponseFormatJSONObject object { type }`

    JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
    对于支持该方法的模型，建议使用 `json_schema` 。请注意，
    模型在没有系统或用户消息指示其
    生成 JSON 时，不会生成 JSON。

    - `type: "json_object"`

      正在定义的响应格式的类型。始终为 `json_object`.

      - `"json_object"`

- `safety_identifier: optional string or null`

  用于帮助检测可能违反 OpenAI 使用政策的应用程序用户的稳定标识符。
  这些 ID 应为唯一标识每个用户的字符串，最大长度为 64 个字符。我们建议对其用户名或电子邮件地址进行哈希处理，以避免向我们发送任何识别信息。 [了解更多](/docs/guides/safety-best-practices#safety-identifiers).

- `seed: optional number or null`

  此功能处于 Beta 阶段。
  如果指定，我们的系统将尽最大努力进行确定性采样，以便具有相同 `seed` 和参数的重复请求应返回相同的结果。
  不保证确定性，你应该参考 `system_fingerprint` 响应参数来监控后端的变化。

- `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

  指定用于处理请求的处理类型。

  - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另有配置，否则项目将使用 'default'。
  - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
  - 如果设置为 '[flex](/docs/guides/flex-processing)'，则请求将使用 Flex 处理服务层级进行处理。
  - 要在请求级别选择 [快速模式](/api/docs/guides/fast-mode) ，请在请求中包括 `service_tier=fast` 或 `service_tier=priority` 参数，用于 响应接口 或 聊天补全接口。响应将显示 `service_tier=priority` 无论你是否指定 `service_tier=fast` 或 `priority` 在你的请求中。
  - 当未设置时，默认行为为 'auto'。

  当 `service_tier` 参数被设置时，响应体将包括 `service_tier` 基于实际用于服务请求的处理模式的值。此响应值可能与参数中设置的值不同。

  - `"auto"`

  - `"default"`

  - `"flex"`

  - `"scale"`

  - `"priority"`

  - `"fast"`

- `stop: optional string or array of string or null`

  不支持最新的推理模型 `o3` 和 `o4-mini`.

  最多 4 个序列，API 将在这些序列处停止生成更多标记。
  返回的文本将不包含停止序列。

  - `string`

  - `array of string`

- `store: optional boolean or null`

  是否存储此聊天补全请求的输出，以供
  我们在 [模型蒸馏](/docs/guides/distillation) 或
  [评估](/docs/guides/evals) 产品。

  支持文本和图像输入。注意：超过 8MB 的图像输入将被丢弃。

- `stream: optional boolean or null`

  如果设置为 true，模型响应数据将通过
  流式传输到客户端， [服务器发送事件](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format).
  参见 [下文流式传输部分](/docs/api-reference/chat/streaming)
  了解更多信息，以及 [流式响应](/docs/guides/streaming-responses)
  指南，了解如何处理流式事件。

- `stream_options: optional ChatCompletionStreamOptions or null`

  流式响应的选项。仅在你设置 `stream: true`.

  - `include_obfuscation: optional boolean`

    当为 true 时，将启用流混淆。流混淆会向
    流式增量事件的 `obfuscation` 字段中添加随机字符，以
    规范化负载大小，作为对某些侧信道攻击的缓解措施。
    这些混淆字段默认包含，但会给数据流增加少量
    开销。如果你信任网络链接，可以设置 `include_obfuscation` 设置为
    为 false 以优化带宽
    你的应用程序与 OpenAI API。

  - `include_usage: optional boolean`

    如果设置，将在之前流式传输一个额外的块 `data: [DONE]`
    消息。该 `usage` 此块上的字段显示令牌使用统计信息
    针对整个请求，而 `choices` 字段将始终为空
    数组。

    所有其他块也将包含一个 `usage` 字段，但值为 null
    值。 **注意：** 如果流被中断，你可能不会收到
    包含请求总令牌使用量的最终使用情况块。

- `temperature: optional number or null`

  要使用的采样温度，介于 0 和 2 之间。较高的值如 0.8 会使输出更随机，而较低的值如 0.2 会使其更集中和确定。
  我们通常建议更改此项或 `top_p` 但不要同时更改。

- `tool_choice: optional ChatCompletionToolChoiceOption`

  控制模型调用哪个（如果有）工具。
  `none` 意味着模型不会调用任何工具，而是生成一条消息。
  `auto` 意味着模型可以在生成消息或调用一个或多个工具之间进行选择。
  `required` 意味着模型必须调用一个或多个工具。
  通过 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

  `none` 是当没有工具时的默认值。 `auto` 是当有工具时的默认值。

  - `ToolChoiceMode = "none" or "auto" or "required"`

    `none` 意味着模型不会调用任何工具，而是生成一条消息。 `auto` 意味着模型可以在生成消息或调用一个或多个工具之间进行选择。 `required` 意味着模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ChatCompletionAllowedToolChoice object { allowed_tools, type }`

    将模型可用的工具限制为预定义的集合。

    - `allowed_tools: ChatCompletionAllowedTools`

      将模型可用的工具限制为预定义的集合。

      - `mode: "auto" or "required"`

        将模型可用的工具限制为预定义的集合。

        `auto` 允许模型从允许的工具中选择并生成
        消息。

        `required` 要求模型调用一个或多个允许的工具。

        - `"auto"`

        - `"required"`

      - `tools: array of map[unknown]`

        一个模型应被允许调用的工具定义列表。

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

        要调用的函数的名称。

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

  一个模型可能调用的工具列表。你可以提供
  [自定义工具](/docs/guides/function-calling#custom-tools) 或
  [函数工具](/docs/guides/function-calling).

  - `ChatCompletionFunctionTool object { function, type }`

    一个可用于生成响应的函数工具。

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数的名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

      - `description: optional string`

        函数功能的描述，模型根据此描述来决定何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，以 JSON Schema 对象的形式描述。参见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 有关格式的文档。

        省略 `parameters` 定义了一个参数列表为空的函数。

      - `strict: optional boolean or null`

        是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循中定义的精确模式 `parameters` 字段。当 `strict` 为 `true`。在以下位置了解更多关于结构化输出的信息： [函数调用指南](/docs/guides/function-calling).

    - `type: "function"`

      工具的类型。目前仅 `function` 。

      - `"function"`

  - `ChatCompletionCustomTool object { custom, type }`

    一种使用指定格式处理输入的自定义工具。

    - `custom: object { name, description, format }`

      自定义工具的属性。

      - `name: string`

        自定义工具的名称，用于在工具调用中识别它。

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

              语法定义的语法。其中之一为 `lark` 或 `regex`.

              - `"lark"`

              - `"regex"`

          - `type: "grammar"`

            语法格式。始终 `grammar`.

            - `"grammar"`

    - `type: "custom"`

      自定义工具的类型。始终 `custom`.

      - `"custom"`

- `top_logprobs: optional number or null`

  一个介于 0 和 20 之间的整数，指定在每个 token 位置返回的最可能的
  tokens 的最大数量，每个 token 均带有相关的 log
  概率。在某些情况下，返回的 tokens 数量可能少于
  请求数量。
  `logprobs` 必须设置为 `true` 如果使用此参数。

- `top_p: optional number or null`

  一种替代使用温度采样的方法，称为核采样，
  其中模型考虑具有 top_p 概率
  质量的令牌结果。因此 0.1 意味着仅考虑构成前 10% 概率质量
  的令牌。

  我们通常建议更改此项或 `temperature` 但不要同时更改。

- `user: optional string`

  此字段正被 `safety_identifier` 和 `prompt_cache_key`。替代。使用 `prompt_cache_key` 以维持缓存优化。
  你的最终用户的稳定标识符。
  通过更好地对相似请求进行分桶来提高缓存命中率，并帮助 OpenAI 检测和防止滥用。 [了解更多](/docs/guides/safety-best-practices#safety-identifiers).

- `verbosity: optional "low" or "medium" or "high" or null`

  约束模型响应的详细程度。较低的值将导致
  更简洁的响应，而较高的值将导致更详细的响应。
  当前支持的值有 `low`, `medium`，和 `high`。默认值为
  `medium`.

  - `"low"`

  - `"medium"`

  - `"high"`

- `web_search_options: optional object { search_context_size, user_location }`

  此工具搜索网络以获取相关结果用于响应。
  了解更多关于 [网页搜索 工具](/docs/guides/tools-web-search?api-mode=chat).

  - `search_context_size: optional "low" or "medium" or "high"`

    用于搜索的上下文窗口空间量的高级指导。其中之一
    。搜索。其中 `low`, `medium`，或 `high`. `medium` 是默认值。

    - `"low"`

    - `"medium"`

    - `"high"`

  - `user_location: optional object { approximate, type }  or null`

    搜索的大致位置参数。

    - `approximate: object { city, country, region, timezone }`

      搜索的大致位置参数。

      - `city: optional string`

        用户的城市的自由文本输入，例如 `San Francisco`.

      - `country: optional string`

        两位字母
        [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如，
        例如。 `US`.

      - `region: optional string`

        用户的地区的自由文本输入，例如 `California`.

      - `timezone: optional string`

        该 [IANA 时区](https://timeapi.io/documentation/iana-timezones)
        ，例如。 `America/Los_Angeles`.

    - `type: "approximate"`

      位置近似的类型。始终 `approximate`.

      - `"approximate"`

### 返回

- `ChatCompletion object { id, choices, created, 7 more }`

  表示模型根据提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项的列表。如果 `n` 大于 1，则可以包含多个选项。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成令牌的原因。这将是 `stop` 如果模型达到自然停止点或提供的停止序列，
      `length` 如果达到请求中指定的最大令牌数，
      `content_filter` 如果由于内容过滤器的标志而省略了内容，
      `tool_calls` 如果模型调用了工具，或 `function_call` （已弃用）如果模型调用了函数。
      阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        带有对数概率信息的消息内容令牌列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

        - `logprob: number`

          该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置，最可能的 token 列表及其对数概率。条目数可能少于请求的 `top_logprobs`.

          - `token: string`

            该令牌。

          - `bytes: array of number or null`

            一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

          - `logprob: number`

            该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        带有对数概率信息的消息拒绝 token 列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

        - `logprob: number`

          该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置，最可能的 token 列表及其对数概率。条目数可能少于请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        此消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注释（如适用），例如使用
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

            Web 资源的标题。

          - `url: string`

            Web 资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含
        关于模型音频响应的数据。 [了解更多](/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          此音频响应将不再于服务器上可访问的 Unix 时间戳（以秒为单位），
          用于多轮
          对话。

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，由 `tool_calls`。取代。模型生成的应调用函数的名称和参数。

        - `arguments: string`

          以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

        - `name: string`

          要调用的函数的名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          模型创建的函数工具调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

            - `name: string`

              要调用的函数的名称。

          - `type: "function"`

            工具的类型。目前仅 `function` 。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          模型创建的自定义工具调用。

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

    可以附加到对象的一组 16 个键值对。这可用于
    以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    如果请求了审核补全，则返回对请求输入和生成输出的审核结果
    。

    - `input: object { model, results, type }  or object { code, message, type }`

      对请求输入的审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果，始终为 `moderation_result` 。

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

      对生成输出的审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果，始终为 `moderation_result` 。

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

    指定用于处理请求的处理类型。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另有配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/docs/guides/flex-processing)'，则请求将使用 Flex 处理服务层级进行处理。
    - 要在请求级别选择 [快速模式](/api/docs/guides/fast-mode) ，请在请求中包括 `service_tier=fast` 或 `service_tier=priority` 参数，用于 响应接口 或 聊天补全接口。响应将显示 `service_tier=priority` 无论你是否指定 `service_tier=fast` 或 `priority` 在你的请求中。
    - 当未设置时，默认行为为 'auto'。

    当 `service_tier` 参数被设置时，响应体将包括 `service_tier` 基于实际用于服务请求的处理模式的值。此响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹代表模型运行时所使用的后端配置。

    可与 `seed` 请求参数结合使用，以了解后端何时发生了可能影响确定性的更改。

  - `usage: optional CompletionUsage`

    完成请求的使用统计信息。

    - `completion_tokens: number`

      生成的完成内容中的令牌数。

    - `prompt_tokens: number`

      提示中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示 + 完成）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      完成内容中使用的令牌明细。

      - `accepted_prediction_tokens: optional number`

        使用预测输出时，
        出现在完成内容中的预测的令牌数。

      - `audio_tokens: optional number`

        模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用预测输出时，
        未出现在完成内容中的预测。但与
        推理令牌类似，这些令牌仍计入总
        完成令牌，用于计费、输出和上下文窗口
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的令牌明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入令牌。

      - `cache_write_tokens: optional number`

        写入缓存的提示令牌的未调整数量。

      - `cached_tokens: optional number`

        提示中存在的缓存令牌。

      - `image_tokens: optional number`

        提示中存在的图像输入令牌。

      - `text_tokens: optional number`

        提示中存在的文本输入令牌。

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
          "model": "gpt-5.4",
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
    "model": "VAR_chat_model_id",
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
  "model": "gpt-5.4",
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
  "model": "gpt-5.4",
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
  "model": "gpt-4o-mini",
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
    "model": "gpt-5.4",
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
  "model": "gpt-5.4",
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

### 日志概率

```http
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "VAR_chat_model_id",
    "messages": [
      {
        "role": "user",
        "content": "Hello!"
      }
    ],
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
  "model": "gpt-4o-mini",
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
    "model": "VAR_chat_model_id",
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
{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"role":"assistant","content":""},"logprobs":null,"finish_reason":null}]}

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{"content":"Hello"},"logprobs":null,"finish_reason":null}]}

....

{"id":"chatcmpl-123","object":"chat.completion.chunk","created":1694268190,"model":"gpt-4o-mini", "system_fingerprint": "fp_44709d6fcb", "choices":[{"index":0,"delta":{},"logprobs":null,"finish_reason":"stop"}]}
```

## 删除聊天补全

**删除** `/chat/completions/{completion_id}`

删除已存储的聊天补全。只有
使用 `store` 参数设置为 `true` 创建的聊天补全才能被删除。

### 路径参数

- `completion_id: string`

### 返回

- `ChatCompletionDeleted object { id, deleted, object }`

  - `id: string`

    已删除的聊天补全的 ID。

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

## 列出聊天补全

**获取** `/chat/completions`

列出已存储的 Chat Completions。只有已存储的 Chat Completions
才会被 `store` 参数设置为 `true` 返回。

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

  按时间戳对聊天补全进行排序。使用 `asc` 表示升序，或 `desc` 表示降序。默认为 `asc`.

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of ChatCompletion`

  聊天补全对象的数组。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项的列表。如果 `n` 大于 1，则可以包含多个选项。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成令牌的原因。这将是 `stop` 如果模型达到自然停止点或提供的停止序列，
      `length` 如果达到请求中指定的最大令牌数，
      `content_filter` 如果由于内容过滤器的标志而省略了内容，
      `tool_calls` 如果模型调用了工具，或 `function_call` （已弃用）如果模型调用了函数。
      阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        带有对数概率信息的消息内容令牌列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

        - `logprob: number`

          该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置，最可能的 token 列表及其对数概率。条目数可能少于请求的 `top_logprobs`.

          - `token: string`

            该令牌。

          - `bytes: array of number or null`

            一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

          - `logprob: number`

            该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        带有对数概率信息的消息拒绝 token 列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

        - `logprob: number`

          该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置，最可能的 token 列表及其对数概率。条目数可能少于请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        此消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注释（如适用），例如使用
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

            Web 资源的标题。

          - `url: string`

            Web 资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含
        关于模型音频响应的数据。 [了解更多](/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          此音频响应将不再于服务器上可访问的 Unix 时间戳（以秒为单位），
          用于多轮
          对话。

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，由 `tool_calls`。取代。模型生成的应调用函数的名称和参数。

        - `arguments: string`

          以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

        - `name: string`

          要调用的函数的名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          模型创建的函数工具调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

            - `name: string`

              要调用的函数的名称。

          - `type: "function"`

            工具的类型。目前仅 `function` 。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          模型创建的自定义工具调用。

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

    可以附加到对象的一组 16 个键值对。这可用于
    以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    如果请求了审核补全，则返回对请求输入和生成输出的审核结果
    。

    - `input: object { model, results, type }  or object { code, message, type }`

      对请求输入的审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果，始终为 `moderation_result` 。

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

      对生成输出的审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果，始终为 `moderation_result` 。

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

    指定用于处理请求的处理类型。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另有配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/docs/guides/flex-processing)'，则请求将使用 Flex 处理服务层级进行处理。
    - 要在请求级别选择 [快速模式](/api/docs/guides/fast-mode) ，请在请求中包括 `service_tier=fast` 或 `service_tier=priority` 参数，用于 响应接口 或 聊天补全接口。响应将显示 `service_tier=priority` 无论你是否指定 `service_tier=fast` 或 `priority` 在你的请求中。
    - 当未设置时，默认行为为 'auto'。

    当 `service_tier` 参数被设置时，响应体将包括 `service_tier` 基于实际用于服务请求的处理模式的值。此响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹代表模型运行时所使用的后端配置。

    可与 `seed` 请求参数结合使用，以了解后端何时发生了可能影响确定性的更改。

  - `usage: optional CompletionUsage`

    完成请求的使用统计信息。

    - `completion_tokens: number`

      生成的完成内容中的令牌数。

    - `prompt_tokens: number`

      提示中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示 + 完成）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      完成内容中使用的令牌明细。

      - `accepted_prediction_tokens: optional number`

        使用预测输出时，
        出现在完成内容中的预测的令牌数。

      - `audio_tokens: optional number`

        模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用预测输出时，
        未出现在完成内容中的预测。但与
        推理令牌类似，这些令牌仍计入总
        完成令牌，用于计费、输出和上下文窗口
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的令牌明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入令牌。

      - `cache_write_tokens: optional number`

        写入缓存的提示令牌的未调整数量。

      - `cached_tokens: optional number`

        提示中存在的缓存令牌。

      - `image_tokens: optional number`

        提示中存在的图像输入令牌。

      - `text_tokens: optional number`

        提示中存在的文本输入令牌。

- `first_id: string`

  数据数组中第一条聊天补全的标识符。

- `has_more: boolean`

  指示是否还有更多聊天补全可用。

- `last_id: string`

  数据数组中最后一条聊天补全的标识符。

- `object: "list"`

  此对象的类型。始终设置为"list"。

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
      "model": "gpt-5.4",
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

**获取** `/chat/completions/{completion_id}`

获取已存储的聊天补全。仅返回已创建的 Chat Completions
才会被 `store` 参数设置为 `true` 返回。

### 路径参数

- `completion_id: string`

### 返回

- `ChatCompletion object { id, choices, created, 7 more }`

  表示模型根据提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项的列表。如果 `n` 大于 1，则可以包含多个选项。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成令牌的原因。这将是 `stop` 如果模型达到自然停止点或提供的停止序列，
      `length` 如果达到请求中指定的最大令牌数，
      `content_filter` 如果由于内容过滤器的标志而省略了内容，
      `tool_calls` 如果模型调用了工具，或 `function_call` （已弃用）如果模型调用了函数。
      阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        带有对数概率信息的消息内容令牌列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

        - `logprob: number`

          该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置，最可能的 token 列表及其对数概率。条目数可能少于请求的 `top_logprobs`.

          - `token: string`

            该令牌。

          - `bytes: array of number or null`

            一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

          - `logprob: number`

            该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        带有对数概率信息的消息拒绝 token 列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

        - `logprob: number`

          该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置，最可能的 token 列表及其对数概率。条目数可能少于请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        此消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注释（如适用），例如使用
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

            Web 资源的标题。

          - `url: string`

            Web 资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含
        关于模型音频响应的数据。 [了解更多](/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          此音频响应将不再于服务器上可访问的 Unix 时间戳（以秒为单位），
          用于多轮
          对话。

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，由 `tool_calls`。取代。模型生成的应调用函数的名称和参数。

        - `arguments: string`

          以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

        - `name: string`

          要调用的函数的名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          模型创建的函数工具调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

            - `name: string`

              要调用的函数的名称。

          - `type: "function"`

            工具的类型。目前仅 `function` 。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          模型创建的自定义工具调用。

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

    可以附加到对象的一组 16 个键值对。这可用于
    以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    如果请求了审核补全，则返回对请求输入和生成输出的审核结果
    。

    - `input: object { model, results, type }  or object { code, message, type }`

      对请求输入的审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果，始终为 `moderation_result` 。

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

      对生成输出的审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果，始终为 `moderation_result` 。

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

    指定用于处理请求的处理类型。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另有配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/docs/guides/flex-processing)'，则请求将使用 Flex 处理服务层级进行处理。
    - 要在请求级别选择 [快速模式](/api/docs/guides/fast-mode) ，请在请求中包括 `service_tier=fast` 或 `service_tier=priority` 参数，用于 响应接口 或 聊天补全接口。响应将显示 `service_tier=priority` 无论你是否指定 `service_tier=fast` 或 `priority` 在你的请求中。
    - 当未设置时，默认行为为 'auto'。

    当 `service_tier` 参数被设置时，响应体将包括 `service_tier` 基于实际用于服务请求的处理模式的值。此响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹代表模型运行时所使用的后端配置。

    可与 `seed` 请求参数结合使用，以了解后端何时发生了可能影响确定性的更改。

  - `usage: optional CompletionUsage`

    完成请求的使用统计信息。

    - `completion_tokens: number`

      生成的完成内容中的令牌数。

    - `prompt_tokens: number`

      提示中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示 + 完成）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      完成内容中使用的令牌明细。

      - `accepted_prediction_tokens: optional number`

        使用预测输出时，
        出现在完成内容中的预测的令牌数。

      - `audio_tokens: optional number`

        模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用预测输出时，
        未出现在完成内容中的预测。但与
        推理令牌类似，这些令牌仍计入总
        完成令牌，用于计费、输出和上下文窗口
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的令牌明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入令牌。

      - `cache_write_tokens: optional number`

        写入缓存的提示令牌的未调整数量。

      - `cached_tokens: optional number`

        提示中存在的缓存令牌。

      - `image_tokens: optional number`

        提示中存在的图像输入令牌。

      - `text_tokens: optional number`

        提示中存在的文本输入令牌。

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
  "model": "gpt-4o-2024-08-06",
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

修改存储的聊天补全。仅已
使用 `store` 参数设置为 `true` 可被修改。目前，
唯一支持的修改是更新 `metadata` 字段。

### 路径参数

- `completion_id: string`

### 正文参数

- `metadata: Metadata or null`

  可以附加到对象的一组 16 个键值对。这可用于
  以结构化格式存储关于对象的额外信息，
  并通过 API 或仪表板查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串，
  最大长度为 512 个字符。

### 返回

- `ChatCompletion object { id, choices, created, 7 more }`

  表示模型根据提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项的列表。如果 `n` 大于 1，则可以包含多个选项。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成令牌的原因。这将是 `stop` 如果模型达到自然停止点或提供的停止序列，
      `length` 如果达到请求中指定的最大令牌数，
      `content_filter` 如果由于内容过滤器的标志而省略了内容，
      `tool_calls` 如果模型调用了工具，或 `function_call` （已弃用）如果模型调用了函数。
      阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        带有对数概率信息的消息内容令牌列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

        - `logprob: number`

          该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置，最可能的 token 列表及其对数概率。条目数可能少于请求的 `top_logprobs`.

          - `token: string`

            该令牌。

          - `bytes: array of number or null`

            一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

          - `logprob: number`

            该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        带有对数概率信息的消息拒绝 token 列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

        - `logprob: number`

          该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置，最可能的 token 列表及其对数概率。条目数可能少于请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        此消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注释（如适用），例如使用
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

            Web 资源的标题。

          - `url: string`

            Web 资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含
        关于模型音频响应的数据。 [了解更多](/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          此音频响应将不再于服务器上可访问的 Unix 时间戳（以秒为单位），
          用于多轮
          对话。

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，由 `tool_calls`。取代。模型生成的应调用函数的名称和参数。

        - `arguments: string`

          以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

        - `name: string`

          要调用的函数的名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          模型创建的函数工具调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

            - `name: string`

              要调用的函数的名称。

          - `type: "function"`

            工具的类型。目前仅 `function` 。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          模型创建的自定义工具调用。

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

    可以附加到对象的一组 16 个键值对。这可用于
    以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    如果请求了审核补全，则返回对请求输入和生成输出的审核结果
    。

    - `input: object { model, results, type }  or object { code, message, type }`

      对请求输入的审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果，始终为 `moderation_result` 。

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

      对生成输出的审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果，始终为 `moderation_result` 。

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

    指定用于处理请求的处理类型。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另有配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/docs/guides/flex-processing)'，则请求将使用 Flex 处理服务层级进行处理。
    - 要在请求级别选择 [快速模式](/api/docs/guides/fast-mode) ，请在请求中包括 `service_tier=fast` 或 `service_tier=priority` 参数，用于 响应接口 或 聊天补全接口。响应将显示 `service_tier=priority` 无论你是否指定 `service_tier=fast` 或 `priority` 在你的请求中。
    - 当未设置时，默认行为为 'auto'。

    当 `service_tier` 参数被设置时，响应体将包括 `service_tier` 基于实际用于服务请求的处理模式的值。此响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹代表模型运行时所使用的后端配置。

    可与 `seed` 请求参数结合使用，以了解后端何时发生了可能影响确定性的更改。

  - `usage: optional CompletionUsage`

    完成请求的使用统计信息。

    - `completion_tokens: number`

      生成的完成内容中的令牌数。

    - `prompt_tokens: number`

      提示中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示 + 完成）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      完成内容中使用的令牌明细。

      - `accepted_prediction_tokens: optional number`

        使用预测输出时，
        出现在完成内容中的预测的令牌数。

      - `audio_tokens: optional number`

        模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用预测输出时，
        未出现在完成内容中的预测。但与
        推理令牌类似，这些令牌仍计入总
        完成令牌，用于计费、输出和上下文窗口
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的令牌明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入令牌。

      - `cache_write_tokens: optional number`

        写入缓存的提示令牌的未调整数量。

      - `cached_tokens: optional number`

        提示中存在的缓存令牌。

      - `image_tokens: optional number`

        提示中存在的图像输入令牌。

      - `text_tokens: optional number`

        提示中存在的文本输入令牌。

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
  "model": "gpt-4o-2024-08-06",
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

### 聊天补全允许的工具

- `ChatCompletionAllowedTools object { mode, tools }`

  将模型可用的工具限制为预定义的集合。

  - `mode: "auto" or "required"`

    将模型可用的工具限制为预定义的集合。

    `auto` 允许模型从允许的工具中选择并生成
    消息。

    `required` 要求模型调用一个或多个允许的工具。

    - `"auto"`

    - `"required"`

  - `tools: array of map[unknown]`

    一个模型应被允许调用的工具定义列表。

    对于 Chat Completions API，工具定义列表可能如下所示：

    ```json
    [
      { "type": "function", "function": { "name": "get_weather" } },
      { "type": "function", "function": { "name": "get_time" } }
    ]
    ```

### 聊天补全

- `ChatCompletion object { id, choices, created, 7 more }`

  表示模型根据提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项的列表。如果 `n` 大于 1，则可以包含多个选项。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成令牌的原因。这将是 `stop` 如果模型达到自然停止点或提供的停止序列，
      `length` 如果达到请求中指定的最大令牌数，
      `content_filter` 如果由于内容过滤器的标志而省略了内容，
      `tool_calls` 如果模型调用了工具，或 `function_call` （已弃用）如果模型调用了函数。
      阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      选项在选项列表中的索引。

    - `logprobs: object { content, refusal }  or null`

      选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        带有对数概率信息的消息内容令牌列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

        - `logprob: number`

          该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置，最可能的 token 列表及其对数概率。条目数可能少于请求的 `top_logprobs`.

          - `token: string`

            该令牌。

          - `bytes: array of number or null`

            一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

          - `logprob: number`

            该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        带有对数概率信息的消息拒绝 token 列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

        - `logprob: number`

          该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置，最可能的 token 列表及其对数概率。条目数可能少于请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天补全消息。

      - `content: string or null`

        消息的内容。

      - `refusal: string or null`

        模型生成的拒绝消息。

      - `role: "assistant"`

        此消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注释（如适用），例如使用
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

            Web 资源的标题。

          - `url: string`

            Web 资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含
        关于模型音频响应的数据。 [了解更多](/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          此音频响应将不再于服务器上可访问的 Unix 时间戳（以秒为单位），
          用于多轮
          对话。

        - `transcript: string`

          模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }`

        已弃用，由 `tool_calls`。取代。模型生成的应调用函数的名称和参数。

        - `arguments: string`

          以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

        - `name: string`

          要调用的函数的名称。

      - `tool_calls: optional array of ChatCompletionMessageToolCall`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          模型创建的函数工具调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

            - `name: string`

              要调用的函数的名称。

          - `type: "function"`

            工具的类型。目前仅 `function` 。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          模型创建的自定义工具调用。

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

    可以附加到对象的一组 16 个键值对。这可用于
    以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    如果请求了审核补全，则返回对请求输入和生成输出的审核结果
    。

    - `input: object { model, results, type }  or object { code, message, type }`

      对请求输入的审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果，始终为 `moderation_result` 。

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

      对生成输出的审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果，始终为 `moderation_result` 。

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

    指定用于处理请求的处理类型。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另有配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/docs/guides/flex-processing)'，则请求将使用 Flex 处理服务层级进行处理。
    - 要在请求级别选择 [快速模式](/api/docs/guides/fast-mode) ，请在请求中包括 `service_tier=fast` 或 `service_tier=priority` 参数，用于 响应接口 或 聊天补全接口。响应将显示 `service_tier=priority` 无论你是否指定 `service_tier=fast` 或 `priority` 在你的请求中。
    - 当未设置时，默认行为为 'auto'。

    当 `service_tier` 参数被设置时，响应体将包括 `service_tier` 基于实际用于服务请求的处理模式的值。此响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹代表模型运行时所使用的后端配置。

    可与 `seed` 请求参数结合使用，以了解后端何时发生了可能影响确定性的更改。

  - `usage: optional CompletionUsage`

    完成请求的使用统计信息。

    - `completion_tokens: number`

      生成的完成内容中的令牌数。

    - `prompt_tokens: number`

      提示中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示 + 完成）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      完成内容中使用的令牌明细。

      - `accepted_prediction_tokens: optional number`

        使用预测输出时，
        出现在完成内容中的预测的令牌数。

      - `audio_tokens: optional number`

        模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用预测输出时，
        未出现在完成内容中的预测。但与
        推理令牌类似，这些令牌仍计入总
        完成令牌，用于计费、输出和上下文窗口
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的令牌明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入令牌。

      - `cache_write_tokens: optional number`

        写入缓存的提示令牌的未调整数量。

      - `cached_tokens: optional number`

        提示中存在的缓存令牌。

      - `image_tokens: optional number`

        提示中存在的图像输入令牌。

      - `text_tokens: optional number`

        提示中存在的文本输入令牌。

### 聊天补全允许的工具选择

- `ChatCompletionAllowedToolChoice object { allowed_tools, type }`

  将模型可用的工具限制为预定义的集合。

  - `allowed_tools: ChatCompletionAllowedTools`

    将模型可用的工具限制为预定义的集合。

    - `mode: "auto" or "required"`

      将模型可用的工具限制为预定义的集合。

      `auto` 允许模型从允许的工具中选择并生成
      消息。

      `required` 要求模型调用一个或多个允许的工具。

      - `"auto"`

      - `"required"`

    - `tools: array of map[unknown]`

      一个模型应被允许调用的工具定义列表。

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

### 聊天补全助手消息参数

- `ChatCompletionAssistantMessageParam object { role, audio, content, 4 more }`

  模型响应用户消息时发送的消息。

  - `role: "assistant"`

    消息作者的角色，在本例中为 `assistant`.

    - `"assistant"`

  - `audio: optional object { id }  or null`

    关于模型先前音频响应的数据。
    [了解更多](/docs/guides/audio).

    - `id: string`

      模型先前音频响应的唯一标识符。

  - `content: optional string or array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal or null`

    助手消息的内容。除非指定了 `tool_calls` 或 `function_call` ，否则为必填。

    - `TextContent = string`

      助手消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal`

      一个具有已定义类型的内容部分数组。可以是一个或多个 `text`，类型，或恰好一个 `refusal`.

      - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

        了解 [文本输入](/docs/guides/text-generation).

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

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

    已弃用，由 `tool_calls`。取代。模型生成的应调用函数的名称和参数。

    - `arguments: string`

      以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

    - `name: string`

      要调用的函数的名称。

  - `name: optional string`

    参与者的可选名称。为模型提供信息以区分相同角色的参与者。

  - `refusal: optional string or null`

    助手生成的拒绝消息。

  - `tool_calls: optional array of ChatCompletionMessageToolCall`

    模型生成的工具调用，例如函数调用。

    - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

      模型创建的函数工具调用。

      - `id: string`

        工具调用的 ID。

      - `function: object { arguments, name }`

        模型调用的函数。

        - `arguments: string`

          以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

        - `name: string`

          要调用的函数的名称。

      - `type: "function"`

        工具的类型。目前仅 `function` 。

        - `"function"`

    - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

      模型创建的自定义工具调用。

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

### 聊天补全音频

- `ChatCompletionAudio object { id, data, expires_at, transcript }`

  如果请求了音频输出模态，则此对象包含
  关于模型音频响应的数据。 [了解更多](/docs/guides/audio).

  - `id: string`

    此音频响应的唯一标识符。

  - `data: string`

    模型生成的 Base64 编码音频字节，格式为
    请求中指定的格式。

  - `expires_at: number`

    此音频响应将不再于服务器上可访问的 Unix 时间戳（以秒为单位），
    用于多轮
    对话。

  - `transcript: string`

    模型生成的音频转录文本。

### 聊天补全音频参数

- `ChatCompletionAudioParam object { format, voice }`

  音频输出参数。当请求音频输出时必需，
  `modalities: ["audio"]`. [了解更多](/docs/guides/audio).

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

    模型用于响应的声音。支持的内置声音有
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `nova`, `onyx`,
    `sage`, `shimmer`, `marin`，和 `cedar`. 你也可以提供
    带有 `id`，的自定义声音对象，例如 `{ "id": "voice_1234" }`.

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

      自定义声音参考。

      - `id: string`

        自定义声音 ID，例如 `voice_1234`.

### 聊天补全分块

- `ChatCompletionChunk object { id, choices, created, 7 more }`

  表示模型根据提供的输入返回的聊天补全响应的流式块
  。每个块都包含一部分连续的响应数据。
  [了解更多](/docs/guides/streaming-responses).

  - `id: string`

    聊天补全的唯一标识符。每个块具有相同的 ID。

  - `choices: array of object { delta, finish_reason, index, logprobs }`

    聊天补全的选择列表。如果 `n` 大于 1，则可以包含多个元素。对于
    如果你设置了 `stream_options: {"include_usage": true}`.

    - `delta: object { content, function_call, refusal, 2 more }`

      由流式模型响应生成的聊天补全增量。

      - `content: optional string or null`

        块消息的内容。

      - `function_call: optional object { arguments, name }`

        已弃用，由 `tool_calls`。取代。模型生成的应调用函数的名称和参数。

        - `arguments: optional string`

          以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

        - `name: optional string`

          要调用的函数的名称。

      - `refusal: optional string or null`

        模型生成的拒绝消息。

      - `role: optional "developer" or "system" or "user" or 2 more`

        此消息作者的角色。

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

            以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

          - `name: optional string`

            要调用的函数的名称。

        - `type: optional "function"`

          工具的类型。目前仅 `function` 。

          - `"function"`

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more or null`

      模型停止生成令牌的原因。这将是 `stop` 如果模型达到自然停止点或提供的停止序列，
      `length` 如果达到请求中指定的最大令牌数，
      `content_filter` 如果由于内容过滤器的标志而省略了内容，
      `tool_calls` 如果模型调用了工具，或 `function_call` （已弃用）如果模型调用了函数。

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `index: number`

      选项在选项列表中的索引。

    - `logprobs: optional object { content, refusal }  or null`

      选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        带有对数概率信息的消息内容令牌列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

        - `logprob: number`

          该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置，最可能的 token 列表及其对数概率。条目数可能少于请求的 `top_logprobs`.

          - `token: string`

            该令牌。

          - `bytes: array of number or null`

            一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

          - `logprob: number`

            该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        带有对数概率信息的消息拒绝 token 列表。

        - `token: string`

          该令牌。

        - `bytes: array of number or null`

          一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

        - `logprob: number`

          该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在此 token 位置，最可能的 token 列表及其对数概率。条目数可能少于请求的 `top_logprobs`.

  - `created: number`

    创建聊天补全时的 Unix 时间戳（以秒为单位）。每个块具有相同的时间戳。

  - `model: string`

    用于生成补全的模型。

  - `object: "chat.completion.chunk"`

    对象类型，始终为 `chat.completion.chunk`.

    - `"chat.completion.chunk"`

  - `moderation: optional object { input, output }  or null`

    请求输入和生成输出的审核结果。当请求审核补全时，
    在审核块中呈现。

    - `input: object { model, results, type }  or object { code, message, type }`

      对请求输入的审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果，始终为 `moderation_result` 。

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

      对生成输出的审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            审核类别到布尔值的字典，如果输入在该类别下被标记，则为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的分数所反映的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            审核类别到分数的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任何类别标记。

          - `model: string`

            生成此结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果，始终为 `moderation_result` 。

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

    为规范流式块大小而添加的混淆字符串，作为
    对某些侧信道攻击的缓解措施。默认包含该字段，当
    时省略。 `stream_options.include_obfuscation` 为 `false`.

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理请求的处理类型。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另有配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则请求将以所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/docs/guides/flex-processing)'，则请求将使用 Flex 处理服务层级进行处理。
    - 要在请求级别选择 [快速模式](/api/docs/guides/fast-mode) ，请在请求中包括 `service_tier=fast` 或 `service_tier=priority` 参数，用于 响应接口 或 聊天补全接口。响应将显示 `service_tier=priority` 无论你是否指定 `service_tier=fast` 或 `priority` 在你的请求中。
    - 当未设置时，默认行为为 'auto'。

    当 `service_tier` 参数被设置时，响应体将包括 `service_tier` 基于实际用于服务请求的处理模式的值。此响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行时的后端配置。
    可与 `seed` 请求参数结合使用，以了解后端何时发生了可能影响确定性的更改。

  - `usage: optional CompletionUsage or null`

    可选字段，仅当你设置了
    `stream_options: {"include_usage": true}` 时才会出现。当其存在时，它
    包含一个 null 值 **，但最后一块除外** 其中包含
    整个请求的令牌用量统计。

    **注意：** 如果流被中断或取消，你可能不会
    收到包含整个请求总令牌用量的最终用量数据块，
    该数据块针对请求本身。

    - `completion_tokens: number`

      生成的完成内容中的令牌数。

    - `prompt_tokens: number`

      提示中的令牌数。

    - `total_tokens: number`

      请求中使用的令牌总数（提示 + 完成）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      完成内容中使用的令牌明细。

      - `accepted_prediction_tokens: optional number`

        使用预测输出时，
        出现在完成内容中的预测的令牌数。

      - `audio_tokens: optional number`

        模型生成的音频输入令牌。

      - `reasoning_tokens: optional number`

        模型为推理生成的令牌。

      - `rejected_prediction_tokens: optional number`

        使用预测输出时，
        未出现在完成内容中的预测。但与
        推理令牌类似，这些令牌仍计入总
        完成令牌，用于计费、输出和上下文窗口
        限制。

      - `text_tokens: optional number`

        模型生成的文本输出令牌。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的令牌明细。

      - `audio_tokens: optional number`

        提示中存在的音频输入令牌。

      - `cache_write_tokens: optional number`

        写入缓存的提示令牌的未调整数量。

      - `cached_tokens: optional number`

        提示中存在的缓存令牌。

      - `image_tokens: optional number`

        提示中存在的图像输入令牌。

      - `text_tokens: optional number`

        提示中存在的文本输入令牌。

### 聊天完成内容部分

- `ChatCompletionContentPart = ChatCompletionContentPartText or ChatCompletionContentPartImage or ChatCompletionContentPartInputAudio or object { file, type, prompt_cache_breakpoint }`

  了解 [文本输入](/docs/guides/text-generation).

  - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

    了解 [文本输入](/docs/guides/text-generation).

    - `text: string`

      文本内容。

    - `type: "text"`

      内容部分的类型。

      - `"text"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

      - `mode: "explicit"`

        断点模式。始终 `explicit`.

        - `"explicit"`

  - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

    了解 [图像输入](/docs/guides/vision).

    - `image_url: object { url, detail }`

      - `url: string`

        图像的 URL 或 base64 编码的图像数据。

      - `detail: optional "auto" or "low" or "high"`

        指定图像的细节级别。更多信息请参阅 [视觉指南](/docs/guides/vision#low-or-high-fidelity-image-understanding).

        - `"auto"`

        - `"low"`

        - `"high"`

    - `type: "image_url"`

      内容部分的类型。

      - `"image_url"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

      - `mode: "explicit"`

        断点模式。始终 `explicit`.

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

      标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

      - `mode: "explicit"`

        断点模式。始终 `explicit`.

        - `"explicit"`

  - `FileContentPart object { file, type, prompt_cache_breakpoint }`

    了解 [文件输入](/docs/guides/text) 用于文本生成。

    - `file: object { file_data, file_id, filename }`

      - `file_data: optional string`

        以字符串形式将文件传递给模型时使用的 Base64 编码文件数据，
        作为字符串。

      - `file_id: optional string`

        用作输入的已上传文件的 ID。

      - `filename: optional string`

        文件名，以字符串形式将文件传递给模型时使用
        字符串。

    - `type: "file"`

      内容部分的类型。始终为 `file`.

      - `"file"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

      - `mode: "explicit"`

        断点模式。始终 `explicit`.

        - `"explicit"`

### 聊天完成内容部分图像

- `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

  了解 [图像输入](/docs/guides/vision).

  - `image_url: object { url, detail }`

    - `url: string`

      图像的 URL 或 base64 编码的图像数据。

    - `detail: optional "auto" or "low" or "high"`

      指定图像的细节级别。更多信息请参阅 [视觉指南](/docs/guides/vision#low-or-high-fidelity-image-understanding).

      - `"auto"`

      - `"low"`

      - `"high"`

  - `type: "image_url"`

    内容部分的类型。

    - `"image_url"`

  - `prompt_cache_breakpoint: optional object { mode }`

    标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

    - `mode: "explicit"`

      断点模式。始终 `explicit`.

      - `"explicit"`

### 聊天完成内容部分输入音频

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

    标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

    - `mode: "explicit"`

      断点模式。始终 `explicit`.

      - `"explicit"`

### 聊天完成内容部分拒绝

- `ChatCompletionContentPartRefusal object { refusal, type }`

  - `refusal: string`

    模型生成的拒绝消息。

  - `type: "refusal"`

    内容部分的类型。

    - `"refusal"`

### 聊天完成内容部分文本

- `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

  了解 [文本输入](/docs/guides/text-generation).

  - `text: string`

    文本内容。

  - `type: "text"`

    内容部分的类型。

    - `"text"`

  - `prompt_cache_breakpoint: optional object { mode }`

    标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

    - `mode: "explicit"`

      断点模式。始终 `explicit`.

      - `"explicit"`

### 聊天完成自定义工具

- `ChatCompletionCustomTool object { custom, type }`

  一种使用指定格式处理输入的自定义工具。

  - `custom: object { name, description, format }`

    自定义工具的属性。

    - `name: string`

      自定义工具的名称，用于在工具调用中识别它。

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

            语法定义的语法。其中之一为 `lark` 或 `regex`.

            - `"lark"`

            - `"regex"`

        - `type: "grammar"`

          语法格式。始终 `grammar`.

          - `"grammar"`

  - `type: "custom"`

    自定义工具的类型。始终 `custom`.

    - `"custom"`

### 聊天完成已删除

- `ChatCompletionDeleted object { id, deleted, object }`

  - `id: string`

    已删除的聊天补全的 ID。

  - `deleted: boolean`

    聊天补全是否已被删除。

  - `object: "chat.completion.deleted"`

    被删除对象的类型。

    - `"chat.completion.deleted"`

### 聊天完成开发者消息参数

- `ChatCompletionDeveloperMessageParam object { content, role, name }`

  开发者提供的指令，模型应遵循这些指令，无论用户发送什么消息。对于 o1 及更新版本的模型，
  消息， `developer` 消息
  会替换之前的 `system` 消息。

  - `content: string or array of ChatCompletionContentPartText`

    开发者消息的内容。

    - `TextContent = string`

      开发者消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      一个内容部分的数组，每个部分有定义的类型。对于开发者消息，仅支持类型 `text` 。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

  - `role: "developer"`

    消息作者的角色，在本例中为 `developer`.

    - `"developer"`

  - `name: optional string`

    参与者的可选名称。为模型提供信息以区分相同角色的参与者。

### 聊天完成函数调用选项

- `ChatCompletionFunctionCallOption object { name }`

  通过 `{"name": "my_function"}` 强制模型调用该函数。

  - `name: string`

    要调用的函数的名称。

### 聊天完成函数消息参数

- `ChatCompletionFunctionMessageParam object { content, name, role }`

  - `content: string or null`

    函数消息的内容。

  - `name: string`

    要调用的函数的名称。

  - `role: "function"`

    消息作者的角色，在本例中为 `function`.

    - `"function"`

### 聊天完成函数工具

- `ChatCompletionFunctionTool object { function, type }`

  一个可用于生成响应的函数工具。

  - `function: FunctionDefinition`

    - `name: string`

      要调用的函数的名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

    - `description: optional string`

      函数功能的描述，模型根据此描述来决定何时以及如何调用该函数。

    - `parameters: optional FunctionParameters`

      函数接受的参数，以 JSON Schema 对象的形式描述。参见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 有关格式的文档。

      省略 `parameters` 定义了一个参数列表为空的函数。

    - `strict: optional boolean or null`

      是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循中定义的精确模式 `parameters` 字段。当 `strict` 为 `true`。在以下位置了解更多关于结构化输出的信息： [函数调用指南](/docs/guides/function-calling).

  - `type: "function"`

    工具的类型。目前仅 `function` 。

    - `"function"`

### 聊天完成消息

- `ChatCompletionMessage object { content, refusal, role, 4 more }`

  由模型生成的聊天补全消息。

  - `content: string or null`

    消息的内容。

  - `refusal: string or null`

    模型生成的拒绝消息。

  - `role: "assistant"`

    此消息作者的角色。

    - `"assistant"`

  - `annotations: optional array of object { type, url_citation }`

    消息的注释（如适用），例如使用
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

        Web 资源的标题。

      - `url: string`

        Web 资源的 URL。

  - `audio: optional ChatCompletionAudio or null`

    如果请求了音频输出模态，则此对象包含
    关于模型音频响应的数据。 [了解更多](/docs/guides/audio).

    - `id: string`

      此音频响应的唯一标识符。

    - `data: string`

      模型生成的 Base64 编码音频字节，格式为
      请求中指定的格式。

    - `expires_at: number`

      此音频响应将不再于服务器上可访问的 Unix 时间戳（以秒为单位），
      用于多轮
      对话。

    - `transcript: string`

      模型生成的音频转录文本。

  - `function_call: optional object { arguments, name }`

    已弃用，由 `tool_calls`。取代。模型生成的应调用函数的名称和参数。

    - `arguments: string`

      以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

    - `name: string`

      要调用的函数的名称。

  - `tool_calls: optional array of ChatCompletionMessageToolCall`

    模型生成的工具调用，例如函数调用。

    - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

      模型创建的函数工具调用。

      - `id: string`

        工具调用的 ID。

      - `function: object { arguments, name }`

        模型调用的函数。

        - `arguments: string`

          以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

        - `name: string`

          要调用的函数的名称。

      - `type: "function"`

        工具的类型。目前仅 `function` 。

        - `"function"`

    - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

      模型创建的自定义工具调用。

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

### 聊天完成消息自定义工具调用

- `ChatCompletionMessageCustomToolCall object { id, custom, type }`

  模型创建的自定义工具调用。

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

### 聊天完成消息函数工具调用

- `ChatCompletionMessageFunctionToolCall object { id, function, type }`

  模型创建的函数工具调用。

  - `id: string`

    工具调用的 ID。

  - `function: object { arguments, name }`

    模型调用的函数。

    - `arguments: string`

      以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

    - `name: string`

      要调用的函数的名称。

  - `type: "function"`

    工具的类型。目前仅 `function` 。

    - `"function"`

### 聊天完成消息参数

- `ChatCompletionMessageParam = ChatCompletionDeveloperMessageParam or ChatCompletionSystemMessageParam or ChatCompletionUserMessageParam or 3 more`

  开发者提供的指令，模型应遵循这些指令，无论用户发送什么消息。对于 o1 及更新版本的模型，
  消息， `developer` 消息
  会替换之前的 `system` 消息。

  - `ChatCompletionDeveloperMessageParam object { content, role, name }`

    开发者提供的指令，模型应遵循这些指令，无论用户发送什么消息。对于 o1 及更新版本的模型，
    消息， `developer` 消息
    会替换之前的 `system` 消息。

    - `content: string or array of ChatCompletionContentPartText`

      开发者消息的内容。

      - `TextContent = string`

        开发者消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        一个内容部分的数组，每个部分有定义的类型。对于开发者消息，仅支持类型 `text` 。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

    - `role: "developer"`

      消息作者的角色，在本例中为 `developer`.

      - `"developer"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的参与者。

  - `ChatCompletionSystemMessageParam object { content, role, name }`

    开发者提供的指令，模型应遵循这些指令，无论用户发送什么消息。对于 o1 及更新版本的模型，
    用户发送的消息。对于 o1 及更新模型，请改用 `developer` 消息
    用于此目的。

    - `content: string or array of ChatCompletionContentPartText`

      系统消息的内容。

      - `TextContent = string`

        系统消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        具有定义类型的内容部分数组。对于系统消息，仅类型 `text` 。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

    - `role: "system"`

      消息作者的角色，在本例中为 `system`.

      - `"system"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的参与者。

  - `ChatCompletionUserMessageParam object { content, role, name }`

    最终用户发送的消息，包含提示或额外上下文
    信息。

    - `content: string or array of ChatCompletionContentPart`

      用户消息的内容。

      - `TextContent = string`

        消息的文本内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPart`

        具有定义类型的内容部分数组。支持的选项因用于生成响应的 [模型](/docs/models) 而异。可以包含文本、图像或音频输入。

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/docs/guides/text-generation).

          - `text: string`

            文本内容。

          - `type: "text"`

            内容部分的类型。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

          了解 [图像输入](/docs/guides/vision).

          - `image_url: object { url, detail }`

            - `url: string`

              图像的 URL 或 base64 编码的图像数据。

            - `detail: optional "auto" or "low" or "high"`

              指定图像的细节级别。更多信息请参阅 [视觉指南](/docs/guides/vision#low-or-high-fidelity-image-understanding).

              - `"auto"`

              - `"low"`

              - `"high"`

          - `type: "image_url"`

            内容部分的类型。

            - `"image_url"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

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

            标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

        - `FileContentPart object { file, type, prompt_cache_breakpoint }`

          了解 [文件输入](/docs/guides/text) 用于文本生成。

          - `file: object { file_data, file_id, filename }`

            - `file_data: optional string`

              以字符串形式将文件传递给模型时使用的 Base64 编码文件数据，
              作为字符串。

            - `file_id: optional string`

              用作输入的已上传文件的 ID。

            - `filename: optional string`

              文件名，以字符串形式将文件传递给模型时使用
              字符串。

          - `type: "file"`

            内容部分的类型。始终为 `file`.

            - `"file"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终 `explicit`.

              - `"explicit"`

    - `role: "user"`

      消息作者的角色，在本例中为 `user`.

      - `"user"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的参与者。

  - `ChatCompletionAssistantMessageParam object { role, audio, content, 4 more }`

    模型响应用户消息时发送的消息。

    - `role: "assistant"`

      消息作者的角色，在本例中为 `assistant`.

      - `"assistant"`

    - `audio: optional object { id }  or null`

      关于模型先前音频响应的数据。
      [了解更多](/docs/guides/audio).

      - `id: string`

        模型先前音频响应的唯一标识符。

    - `content: optional string or array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal or null`

      助手消息的内容。除非指定了 `tool_calls` 或 `function_call` ，否则为必填。

      - `TextContent = string`

        助手消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal`

        一个具有已定义类型的内容部分数组。可以是一个或多个 `text`，类型，或恰好一个 `refusal`.

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/docs/guides/text-generation).

        - `ChatCompletionContentPartRefusal object { refusal, type }`

          - `refusal: string`

            模型生成的拒绝消息。

          - `type: "refusal"`

            内容部分的类型。

            - `"refusal"`

    - `function_call: optional object { arguments, name }  or null`

      已弃用，由 `tool_calls`。取代。模型生成的应调用函数的名称和参数。

      - `arguments: string`

        以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

      - `name: string`

        要调用的函数的名称。

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的参与者。

    - `refusal: optional string or null`

      助手生成的拒绝消息。

    - `tool_calls: optional array of ChatCompletionMessageToolCall`

      模型生成的工具调用，例如函数调用。

      - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

        模型创建的函数工具调用。

        - `id: string`

          工具调用的 ID。

        - `function: object { arguments, name }`

          模型调用的函数。

          - `arguments: string`

            以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

          - `name: string`

            要调用的函数的名称。

        - `type: "function"`

          工具的类型。目前仅 `function` 。

          - `"function"`

      - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

        模型创建的自定义工具调用。

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

        一组具有已定义类型的内容部分。对于工具消息，仅类型 `text` 。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

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

### 聊天完成消息工具调用

- `ChatCompletionMessageToolCall = ChatCompletionMessageFunctionToolCall or ChatCompletionMessageCustomToolCall`

  模型创建的函数工具调用。

  - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

    模型创建的函数工具调用。

    - `id: string`

      工具调用的 ID。

    - `function: object { arguments, name }`

      模型调用的函数。

      - `arguments: string`

        以 JSON 格式生成的用于调用函数的参数。请注意，模型并不总是生成有效的 JSON，并且可能产生你函数模式中未定义的参数。在调用函数之前，请在你的代码中验证这些参数。

      - `name: string`

        要调用的函数的名称。

    - `type: "function"`

      工具的类型。目前仅 `function` 。

      - `"function"`

  - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

    模型创建的自定义工具调用。

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

### 聊天完成模态

- `ChatCompletionModality = "text" or "audio"`

  - `"text"`

  - `"audio"`

### 聊天完成具名工具选择

- `ChatCompletionNamedToolChoice object { function, type }`

  指定模型应使用的工具。用于强制模型调用特定函数。

  - `function: object { name }`

    - `name: string`

      要调用的函数的名称。

  - `type: "function"`

    对于函数调用，类型始终为 `function`.

    - `"function"`

### 聊天完成具名工具选择自定义

- `ChatCompletionNamedToolChoiceCustom object { custom, type }`

  指定模型应使用的工具。用于强制模型调用特定的自定义工具。

  - `custom: object { name }`

    - `name: string`

      要调用的自定义工具的名称。

  - `type: "custom"`

    对于自定义工具调用，类型始终为 `custom`.

    - `"custom"`

### 聊天完成预测内容

- `ChatCompletionPredictionContent object { content, type }`

  静态预测输出内容，例如正在重新生成的文本文件的
  内容。

  - `content: string or array of ChatCompletionContentPartText`

    生成模型响应时应匹配的内容。
    如果生成的令牌与此内容匹配，则整个模型响应
    可以更快地返回。

    - `TextContent = string`

      用于预测输出的内容。这通常是
      你正在以微小更改重新生成的文件的文本。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      具有定义类型的内容部分数组。支持的选项因用于生成响应的 [模型](/docs/models) 用于生成响应。可以包含文本输入。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

  - `type: "content"`

    你想要提供的预测内容的类型。此类型
    目前始终为 `content`.

    - `"content"`

### Chat Completion Role

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

    如果提供了内容部件数组，则这是一个 `text` 和 `image_url` 部件数组。
    否则为 null。

    - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

      了解 [文本输入](/docs/guides/text-generation).

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

    - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

      了解 [图像输入](/docs/guides/vision).

      - `image_url: object { url, detail }`

        - `url: string`

          图像的 URL 或 base64 编码的图像数据。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。更多信息请参阅 [视觉指南](/docs/guides/vision#low-or-high-fidelity-image-understanding).

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

### 聊天补全流选项

- `ChatCompletionStreamOptions object { include_obfuscation, include_usage }`

  流式响应的选项。仅在你设置 `stream: true`.

  - `include_obfuscation: optional boolean`

    当为 true 时，将启用流混淆。流混淆会向
    流式增量事件的 `obfuscation` 字段中添加随机字符，以
    规范化负载大小，作为对某些侧信道攻击的缓解措施。
    这些混淆字段默认包含，但会给数据流增加少量
    开销。如果你信任网络链接，可以设置 `include_obfuscation` 设置为
    为 false 以优化带宽
    你的应用程序与 OpenAI API。

  - `include_usage: optional boolean`

    如果设置，将在之前流式传输一个额外的块 `data: [DONE]`
    消息。该 `usage` 此块上的字段显示令牌使用统计信息
    针对整个请求，而 `choices` 字段将始终为空
    数组。

    所有其他块也将包含一个 `usage` 字段，但值为 null
    值。 **注意：** 如果流被中断，你可能不会收到
    包含请求总令牌使用量的最终使用情况块。

### 聊天补全系统消息参数

- `ChatCompletionSystemMessageParam object { content, role, name }`

  开发者提供的指令，模型应遵循这些指令，无论用户发送什么消息。对于 o1 及更新版本的模型，
  用户发送的消息。对于 o1 及更新模型，请改用 `developer` 消息
  用于此目的。

  - `content: string or array of ChatCompletionContentPartText`

    系统消息的内容。

    - `TextContent = string`

      系统消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      具有定义类型的内容部分数组。对于系统消息，仅类型 `text` 。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

  - `role: "system"`

    消息作者的角色，在本例中为 `system`.

    - `"system"`

  - `name: optional string`

    参与者的可选名称。为模型提供信息以区分相同角色的参与者。

### 聊天补全令牌对数概率

- `ChatCompletionTokenLogprob object { token, bytes, logprob, top_logprobs }`

  - `token: string`

    该令牌。

  - `bytes: array of number or null`

    一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

  - `logprob: number`

    该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

  - `top_logprobs: array of object { token, bytes, logprob }`

    在此 token 位置，最可能的 token 列表及其对数概率。条目数可能少于请求的 `top_logprobs`.

    - `token: string`

      该令牌。

    - `bytes: array of number or null`

      一个表示令牌 UTF-8 字节表示的整数列表。在字符由多个令牌表示且必须组合其字节表示以生成正确文本表示的情况下很有用。可以是 `null` 如果令牌没有字节表示。

    - `logprob: number`

      该令牌的对数概率，如果它位于前 20 个最可能的令牌中。否则，该值 `-9999.0` 用于表示该 token 的可能性极低。

### 聊天补全工具

- `ChatCompletionTool = ChatCompletionFunctionTool or ChatCompletionCustomTool`

  一个可用于生成响应的函数工具。

  - `ChatCompletionFunctionTool object { function, type }`

    一个可用于生成响应的函数工具。

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数的名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

      - `description: optional string`

        函数功能的描述，模型根据此描述来决定何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，以 JSON Schema 对象的形式描述。参见 [指南](/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 有关格式的文档。

        省略 `parameters` 定义了一个参数列表为空的函数。

      - `strict: optional boolean or null`

        是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循中定义的精确模式 `parameters` 字段。当 `strict` 为 `true`。在以下位置了解更多关于结构化输出的信息： [函数调用指南](/docs/guides/function-calling).

    - `type: "function"`

      工具的类型。目前仅 `function` 。

      - `"function"`

  - `ChatCompletionCustomTool object { custom, type }`

    一种使用指定格式处理输入的自定义工具。

    - `custom: object { name, description, format }`

      自定义工具的属性。

      - `name: string`

        自定义工具的名称，用于在工具调用中识别它。

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

              语法定义的语法。其中之一为 `lark` 或 `regex`.

              - `"lark"`

              - `"regex"`

          - `type: "grammar"`

            语法格式。始终 `grammar`.

            - `"grammar"`

    - `type: "custom"`

      自定义工具的类型。始终 `custom`.

      - `"custom"`

### 聊天补全工具选择选项

- `ChatCompletionToolChoiceOption = "none" or "auto" or "required" or ChatCompletionAllowedToolChoice or ChatCompletionNamedToolChoice or ChatCompletionNamedToolChoiceCustom`

  控制模型调用哪个（如果有）工具。
  `none` 意味着模型不会调用任何工具，而是生成一条消息。
  `auto` 意味着模型可以在生成消息或调用一个或多个工具之间进行选择。
  `required` 意味着模型必须调用一个或多个工具。
  通过 `{"type": "function", "function": {"name": "my_function"}}` 强制模型调用该工具。

  `none` 是当没有工具时的默认值。 `auto` 是当有工具时的默认值。

  - `ToolChoiceMode = "none" or "auto" or "required"`

    `none` 意味着模型不会调用任何工具，而是生成一条消息。 `auto` 意味着模型可以在生成消息或调用一个或多个工具之间进行选择。 `required` 意味着模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ChatCompletionAllowedToolChoice object { allowed_tools, type }`

    将模型可用的工具限制为预定义的集合。

    - `allowed_tools: ChatCompletionAllowedTools`

      将模型可用的工具限制为预定义的集合。

      - `mode: "auto" or "required"`

        将模型可用的工具限制为预定义的集合。

        `auto` 允许模型从允许的工具中选择并生成
        消息。

        `required` 要求模型调用一个或多个允许的工具。

        - `"auto"`

        - `"required"`

      - `tools: array of map[unknown]`

        一个模型应被允许调用的工具定义列表。

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

        要调用的函数的名称。

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

### 聊天补全工具消息参数

- `ChatCompletionToolMessageParam object { content, role, tool_call_id }`

  - `content: string or array of ChatCompletionContentPartText`

    工具消息的内容。

    - `TextContent = string`

      工具消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      一组具有已定义类型的内容部分。对于工具消息，仅类型 `text` 。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

  - `role: "tool"`

    消息作者的角色，在本例中为 `tool`.

    - `"tool"`

  - `tool_call_id: string`

    此消息正在响应的工具调用。

### 聊天补全用户消息参数

- `ChatCompletionUserMessageParam object { content, role, name }`

  最终用户发送的消息，包含提示或额外上下文
  信息。

  - `content: string or array of ChatCompletionContentPart`

    用户消息的内容。

    - `TextContent = string`

      消息的文本内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPart`

      具有定义类型的内容部分数组。支持的选项因用于生成响应的 [模型](/docs/models) 而异。可以包含文本、图像或音频输入。

      - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

        了解 [文本输入](/docs/guides/text-generation).

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

        了解 [图像输入](/docs/guides/vision).

        - `image_url: object { url, detail }`

          - `url: string`

            图像的 URL 或 base64 编码的图像数据。

          - `detail: optional "auto" or "low" or "high"`

            指定图像的细节级别。更多信息请参阅 [视觉指南](/docs/guides/vision#low-or-high-fidelity-image-understanding).

            - `"auto"`

            - `"low"`

            - `"high"`

        - `type: "image_url"`

          内容部分的类型。

          - `"image_url"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

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

          标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

      - `FileContentPart object { file, type, prompt_cache_breakpoint }`

        了解 [文件输入](/docs/guides/text) 用于文本生成。

        - `file: object { file_data, file_id, filename }`

          - `file_data: optional string`

            以字符串形式将文件传递给模型时使用的 Base64 编码文件数据，
            作为字符串。

          - `file_id: optional string`

            用作输入的已上传文件的 ID。

          - `filename: optional string`

            文件名，以字符串形式将文件传递给模型时使用
            字符串。

        - `type: "file"`

          内容部分的类型。始终为 `file`.

          - `"file"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终 `explicit`.

            - `"explicit"`

  - `role: "user"`

    消息作者的角色，在本例中为 `user`.

    - `"user"`

  - `name: optional string`

    参与者的可选名称。为模型提供信息以区分相同角色的参与者。

# 消息

## 获取聊天消息

**获取** `/chat/completions/{completion_id}/messages`

获取已存储聊天补全中的消息。仅返回使用
创建的聊天补全 `store` 参数设置为 `true` 结果
。

### 路径参数

- `completion_id: string`

### 查询参数

- `after: optional string`

  上一次分页请求的最后一条消息的标识符。

- `limit: optional number`

  要检索的消息数量。

- `order: optional "asc" or "desc"`

  按时间戳对消息的排序方式。使用 `asc` 表示升序，或 `desc` 表示降序。默认为 `asc`.

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of ChatCompletionStoreMessage`

  聊天补全消息对象数组。

  - `id: string`

    聊天消息的标识符。

  - `content_parts: optional array of ChatCompletionContentPartText or ChatCompletionContentPartImage or null`

    如果提供了内容部件数组，则这是一个 `text` 和 `image_url` 部件数组。
    否则为 null。

    - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

      了解 [文本输入](/docs/guides/text-generation).

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

    - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

      了解 [图像输入](/docs/guides/vision).

      - `image_url: object { url, detail }`

        - `url: string`

          图像的 URL 或 base64 编码的图像数据。

        - `detail: optional "auto" or "low" or "high"`

          指定图像的细节级别。更多信息请参阅 [视觉指南](/docs/guides/vision#low-or-high-fidelity-image-understanding).

          - `"auto"`

          - `"low"`

          - `"high"`

      - `type: "image_url"`

        内容部分的类型。

        - `"image_url"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的确切结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

        - `mode: "explicit"`

          断点模式。始终 `explicit`.

          - `"explicit"`

- `first_id: string`

  数据数组中第一条聊天消息的标识符。

- `has_more: boolean`

  指示是否还有更多聊天消息可用。

- `last_id: string`

  数据数组中最后一条聊天消息的标识符。

- `object: "list"`

  此对象的类型。始终设置为"list"。

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
