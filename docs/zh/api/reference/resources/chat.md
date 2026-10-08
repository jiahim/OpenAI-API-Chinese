# Chat

> 完整文档索引请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 。

# Completions

## Create chat completion

**文章** `/chat/completions`

**刚开始一个项目？** 我们推荐你试用 [Responses](/api/reference/resources/responses)
以充分利用最新的 OpenAI 平台功能。比较
[Chat Completions 与 Responses](/api/docs/guides/migrate-to-responses?api-mode=responses).

---

为给定的对话创建模型响应。在
[文本生成](/api/docs/guides/text), [视觉](/api/docs/guides/images-vision),
和 [音频](/api/docs/guides/audio) 指南中了解更多。

参数支持可能因用于生成响应的模型而异，尤其是更新的推理模型。仅
由推理模型支持的参数会在下方注明。有关推理模型中不受支持参数的当前情况，
请
参考推理指南，
[。](/api/docs/guides/reasoning).

返回一个对话补全对象；如果请求以流式传输，则返回一组按序的对话补全分块
对象。

### 请求体参数

- `messages: array of ChatCompletionMessageParam`

  到目前为止，构成对话的消息列表。取决于你使用的
  [模型](/api/docs/models) ，支持不同的消息类型（模态），例如
  ，例如 [文本](/api/docs/guides/text),
  [图像](/api/docs/guides/images-vision)、和 [音频](/api/docs/guides/audio).

  - `ChatCompletionDeveloperMessageParam object { content, role, name }`

    开发者提供的指令，无论用户发送什么消息，模型都应遵循这些指令。对于 o1 及更新的模型，
    消息， `developer` 取代了之前的
    消息 `system` 消息。

    - `content: string or array of ChatCompletionContentPartText`

      开发者消息的内容。

      - `TextContent = string`

        开发者消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        具有已定义类型的 content parts 数组。对于开发者消息，仅支持 type `text` 类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `role: "developer"`

      消息作者的角色，此处为 `developer`.

      - `"developer"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的不同参与者。

  - `ChatCompletionSystemMessageParam object { content, role, name }`

    开发者提供的指令，无论用户发送什么消息，模型都应遵循这些指令。对于 o1 及更新的模型，
    用户发送的消息。对于 o1 及更新的模型，请改用 `developer` 取代了之前的
    来实现此目的。

    - `content: string or array of ChatCompletionContentPartText`

      系统消息的内容。

      - `TextContent = string`

        系统消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        具有指定类型的内容部分数组。对于系统消息，仅支持 type 为 `text` 类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

    - `role: "system"`

      消息作者的角色，此处为 `system`.

      - `"system"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的不同参与者。

  - `ChatCompletionUserMessageParam object { content, role, name }`

    由终端用户发送的消息，包含提示或额外的上下文
    信息。

    - `content: string or array of ChatCompletionContentPart`

      用户消息的内容。

      - `TextContent = string`

        消息的文本内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPart`

        具有指定类型的内容部分数组。支持的可选项取决于用于生成响应的 [模型](/api/docs/models) ，可以包含文本、图像或音频输入。

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/api/docs/guides/text).

          - `text: string`

            文本内容。

          - `type: "text"`

            内容部分的类型。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

          了解 [图像输入](/api/docs/guides/images-vision).

          - `image_url: object { url, detail }`

            - `url: string`

              图像的 URL 或 base64 编码的图像数据。

            - `detail: optional "auto" or "low" or "high" or "original"`

              指定图像的细节级别。在 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

              - `"auto"`

              - `"low"`

              - `"high"`

              - `"original"`

          - `type: "image_url"`

            内容部分的类型。

            - `"image_url"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `FileContentPart object { file, type, prompt_cache_breakpoint }`

          了解 [文件输入](/api/docs/guides/text) 用于文本生成。

          - `file: object { file_data, file_id, filename }`

            - `file_data: optional string`

              Base64 编码的文件数据，将文件以字符串形式传递给模型时使用
              。

            - `file_id: optional string`

              用作输入的已上传文件的 ID。

            - `filename: optional string`

              文件名，将文件以字符串形式传递给模型时使用
              。

          - `type: "file"`

            内容部分的类型。始终为 `file`.

            - `"file"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

    - `role: "user"`

      消息作者的角色，此处为 `user`.

      - `"user"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的不同参与者。

  - `ChatCompletionAssistantMessageParam object { role, audio, content, 4 more }`

    模型响应用户消息时发送的消息。

    - `role: "assistant"`

      消息作者的角色，此处为 `assistant`.

      - `"assistant"`

    - `audio: optional object { id }  or null`

      有关模型先前音频响应的数据。
      [了解更多](/api/docs/guides/audio).

      - `id: string`

        模型先前音频响应的唯一标识符。

    - `content: optional string or array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal or null`

      助手消息的内容。除非指定了 `tool_calls` 或 `function_call` ，否则为必填项。

      - `TextContent = string`

        助手消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal`

        由内容部分组成的数组，每个部分都有明确的类型。可以是以下一个或多个类型： `text`，或以下类型中的恰好一个： `refusal`.

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/api/docs/guides/text).

        - `ChatCompletionContentPartRefusal object { refusal, type }`

          - `refusal: string`

            模型生成的拒绝消息。

          - `type: "refusal"`

            内容部分的类型。

            - `"refusal"`

    - `function_call: optional object { arguments, name }  or null`

      已弃用，由 `tool_calls`。取代。应调用的函数的名称和参数，由模型生成。

      - `arguments: string`

        调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

      - `name: string`

        要调用的函数名称。

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的不同参与者。

    - `refusal: optional string or null`

      助手发出的拒绝消息。

    - `tool_calls: optional array of ChatCompletionMessageToolCall`

      模型生成的工具调用，例如函数调用。

      - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

        模型创建的对函数工具的调用。

        - `id: string`

          工具调用的 ID。

        - `function: object { arguments, name }`

          模型调用的函数。

          - `arguments: string`

            调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

          - `name: string`

            要调用的函数名称。

        - `type: "function"`

          工具的类型。目前，仅 `function` 类型。

          - `"function"`

      - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

        模型创建的对自定义工具的调用。

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

        由已定义类型组成的内容部分数组。对于工具消息，仅支持 type 为 `text` 类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

    - `role: "tool"`

      消息作者的角色，此处为 `tool`.

      - `"tool"`

    - `tool_call_id: string`

      此消息正在响应的工具调用。

  - `ChatCompletionFunctionMessageParam object { content, name, role }`

    - `content: string or null`

      函数消息的内容。

    - `name: string`

      要调用的函数名称。

    - `role: "function"`

      消息作者的角色，此处为 `function`.

      - `"function"`

- `model: string or "gpt-6-astra" or "gpt-6.1-sol" or "gpt-6-sol" or 86 more`

  用于生成响应的模型 ID，例如 `gpt-6-astra` 或 `o3`。OpenAI
  提供多种具有不同能力、性能
  特性和价位的模型。请参阅 [模型指南](/api/docs/models)
  以浏览和比较可用的模型。

  - `string`

  - `"gpt-6-astra" or "gpt-6.1-sol" or "gpt-6-sol" or 86 more`

    用于生成响应的模型 ID，例如 `gpt-6-astra` 或 `o3`。OpenAI
    提供多种具有不同能力、性能
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

  音频输出的参数。在使用以下参数请求音频输出时为必填项：
  `modalities: ["audio"]`. [了解更多](/api/docs/guides/audio).

  - `format: "wav" or "aac" or "mp3" or 3 more`

    指定输出音频格式。必须是以下之一： `wav`, `mp3`, `flac`,
    `opus`，或 `pcm16`.

    - `"wav"`

    - `"aac"`

    - `"mp3"`

    - `"flac"`

    - `"opus"`

    - `"pcm16"`

  - `voice: string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

    模型用于响应的语音。支持的内置语音有：
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `nova`, `onyx`,
    `sage`, `shimmer`, `marin`、和 `cedar`。你也可以提供一个
    自定义语音对象，并附带 `id`，例如： `{ "id": "voice_1234" }`.
    自定义语音必须由音频样本创建。

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

        自定义语音 ID，例如： `voice_1234`.

- `frequency_penalty: optional number or null`

  介于 -2.0 到 2.0 之间的数值。正值会根据新词元
  在当前文本中已出现的频率对其进行惩罚，从而降低模型
  逐字重复相同内容的可能性。

- `function_call: optional "none" or "auto" or ChatCompletionFunctionCallOption`

  已弃用，请改用 `tool_choice`.

  控制模型调用哪个函数（如果有）。

  `none` 表示模型不会调用函数，而是生成
  消息。

  `auto` 表示模型可以在生成消息或调用
  函数之间进行选择。

  通过指定特定函数 `{"name": "my_function"}` 会强制
  模型调用该函数。

  `none` 在没有任何函数时是默认值。 `auto` 是默认值
  如果存在函数。

  - `"none" or "auto"`

    `none` 表示模型不会调用函数，而是生成消息。 `auto` 表示模型可以在生成消息或调用函数之间进行选择。

    - `"none"`

    - `"auto"`

  - `ChatCompletionFunctionCallOption object { name }`

    通过指定特定函数 `{"name": "my_function"}` 强制模型调用该函数。

    - `name: string`

      要调用的函数名称。

- `functions: optional array of object { name, description, parameters }`

  已弃用，请改用 `tools`.

  模型可为这些函数生成 JSON 输入的列表。

  - `name: string`

    要调用的函数的名称。必须是 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

  - `description: optional string`

    函数功能的描述，供模型用于选择何时以及如何调用该函数。

  - `parameters: optional FunctionParameters`

    函数接受的参数，以 JSON Schema 对象形式描述。请参阅 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解该格式的相关文档。

    省略 `parameters` 会定义一个参数列表为空的函数。

- `logit_bias: optional map[number] or null`

  修改指定 token 在生成结果中出现的可能性。

  接受一个 JSON 对象，将 token（在
  分词器中通过其 token ID 指定）映射到 -100 到 100 之间的关联偏差值。数学上，
  在模型采样之前，该偏差会加到模型生成的 logits 上。
  具体效果因模型而异，但 -1 到 1 之间的值应当
  会降低或提高被选中的可能性；而 -100 或 100 这类值
  应当会完全禁止或强制选中相应 token。

- `logprobs: optional boolean or null`

  是否返回输出 token 的对数概率。如果为 true，
  则返回所返回的每个输出 token 的对数概率，输出 token 包含在
  `content` 的 `message`.

- `max_completion_tokens: optional number or null`

  针对一次生成可生成的 token 总数的上限，包含可见输出 token 和 [推理 token](/api/docs/guides/reasoning).

- `max_tokens: optional number or null`

  可在 [生成中生成的最大](https://platform.openai.com/tokenizer) token 数。该值可用于控制
  聊天生成。该值可用于控制
  [成本](https://openai.com/api/pricing/) 通过 API 生成文本的费用。

  该字段现已弃用，推荐使用 `max_completion_tokens`，并且与
  不兼容 [o 系列模型](/api/docs/guides/reasoning).

- `metadata: optional Metadata or null`

  可附加到对象的 16 个键值对集合。可用于
  以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
  以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。

  键为字符串，最长 64 个字符。值为字符串
  最大长度为 512 个字符。

- `modalities: optional array of "text" or "audio" or null`

  你希望模型生成的输出类型。
  大多数模型都能生成文本，这也是默认类型：

  `["text"]`

  该 `gpt-4o-audio-preview` 模型还可用于
  [生成音频](/api/docs/guides/audio)。如需请求该模型同时生成
  文本和音频响应，可以使用：

  `["text", "audio"]`

  - `"text"`

  - `"audio"`

- `moderation: optional object { model, policy }  or null`

  用于对请求输入和生成输出运行审核的配置。

  - `model: string`

    用于审核补全的审核模型，例如 'omni-moderation-latest'。

  - `policy: optional object { input, output }  or null`

    应用于审核响应输入和输出的策略。

    - `input: optional object { mode }  or null`

      响应输入的审核策略。

      - `mode: "score" or "block"`

        - `"score"`

        - `"block"`

    - `output: optional object { mode }  or null`

      响应输出的审核策略。

      - `mode: "score" or "block"`

        - `"score"`

        - `"block"`

- `n: optional number or null`

  为每条输入消息生成的聊天补全选项数量。请注意，你将根据所有选项生成的词元总数计费。保持 `n` 为 `1` 以尽量降低费用。

- `parallel_tool_calls: optional boolean`

  是否启用 [并行函数调用](/api/docs/guides/function-calling#parallel-function-calling) ，请在工具使用期间启用。

- `prediction: optional ChatCompletionPredictionContent or null`

  的配置 [Predicted Output](/api/docs/guides/predicted-outputs),
  当模型的大部分输出在生成前就已知时，可以显著提升响应速度。
  响应内容已经提前确定的情况。这种情况最常见于你
  重新生成一个文件，且大部分内容只做了少量修改时。

  - `content: string or array of ChatCompletionContentPartText`

    生成模型响应时应匹配的内容。
    如果生成的 token 会匹配该内容，那么整个模型响应
    可以更快地返回。

    - `TextContent = string`

      用于 Predicted Output 的内容。这通常是
      你重新生成的文件文本，仅做了少量修改。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      具有指定类型的内容部分数组。支持的可选项取决于用于生成响应的 [模型](/api/docs/models) 用于生成响应的内容。可以包含文本输入。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

  - `type: "content"`

    你要提供的预测内容的类型。该类型
    当前始终为 `content`.

    - `"content"`

- `presence_penalty: optional number or null`

  介于 -2.0 到 2.0 之间的数值。正值会根据新词元
  无论它们是否已出现在当前文本中，都会增加模型谈论新主题的可能性
  。

- `prompt_cache_key: optional string or null`

  由 OpenAI 用于缓存响应，以优化对相似请求的缓存命中率。取代 `user` 字段。 [了解更多](/api/docs/guides/prompt-caching).

- `prompt_cache_options: optional object { mode, ttl }`

  用于提示缓存的选项。支持 `gpt-5.6` 及更高版本模型。默认情况下，OpenAI 会自动选择一个隐式缓存断点。你可以使用 `prompt_cache_breakpoint`。为内容块添加显式断点。每个请求最多可设置四个断点。在缓存匹配时，OpenAI 会考虑对话中最近最多 80 个断点，且没有内容块回溯限制。将 `mode` 设置为 `explicit` 以禁用隐式断点。 `ttl` 默认为 `30m`，这是当前唯一支持的值。参阅 [prompt caching 指南](/api/docs/guides/prompt-caching) 了解最新详情。

  - `mode: optional "implicit" or "explicit"`

    控制是否由 OpenAI 自动创建隐式缓存断点。默认为 `implicit`。当设置为 `implicit`，时，OpenAI 会创建一个隐式断点，并写入请求中最近的三个显式断点。当设置为 `explicit`，时，OpenAI 不会创建隐式断点，并写入最近的四个显式断点。如果没有显式断点，则该请求不使用 prompt caching。

    - `"implicit"`

    - `"explicit"`

  - `ttl: optional "30m"`

    应用于该请求写入的每个隐式和显式缓存断点的最短生命周期。默认为 `30m`，这是当前唯一支持的值。后端可能会将缓存条目保留更长时间。

    - `"30m"`

- `prompt_cache_retention: optional "in_memory" or "24h" or null`

  已弃用。请使用 `prompt_cache_options.ttl` 代替。

  提示缓存的保留策略。设置为 `24h` 以启用扩展的提示缓存，使缓存的前缀保持激活更长时间，最长可达 24 小时。 [了解更多](/api/docs/guides/prompt-caching#prompt-cache-retention).
  该字段表示最大保留策略，而
  `prompt_cache_options.ttl` 表示最小缓存生命周期。两个
  字段相互独立，不会相互影响。
  对于 `gpt-5.5`, `gpt-5.5-pro`，以及未来的模型，仅支持 `24h` 类型。

  对于同时支持 `in_memory` 和 `24h`，的旧模型，默认值取决于你组织的数据保留策略：

  - 未启用 ZDR 的组织默认使用 `24h`.
  - 已启用 ZDR 的组织默认使用 `in_memory` 当 `prompt_cache_retention` 未指定时。

  - `"in_memory"`

  - `"24h"`

- `reasoning_effort: optional ReasoningEffort or null`

  约束推理模型的推理努力程度。当前支持的值是
  ： `none`, `minimal`, `low`, `medium`, `high`, `xhigh`、和 `max`.
  降低推理努力程度可以让响应更快，并减少令牌
  用于响应中的推理。并非所有推理模型都支持每个
  值。请参阅
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

  一个用于指定模型必须输出的格式的对象。

  设置为 `{ "type": "json_schema", "json_schema": {...} }` 可启用
  Structured Outputs，从而确保模型匹配你提供的 JSON
  schema。更多信息请参阅 [Structured Outputs
  指南](/api/docs/guides/structured-outputs).

  设置为 `{ "type": "json_object" }` 可启用旧的 JSON 模式，该模式
  可确保模型生成的消息是有效的 JSON。对于支持的模型，推荐使用 `json_schema`
  。

  - `ResponseFormatText object { type }`

    默认响应格式。用于生成文本响应。

    - `type: "text"`

      正在定义的响应格式的类型。始终为 `text`.

      - `"text"`

  - `ResponseFormatJSONSchema object { json_schema, type }`

    JSON Schema 响应格式。用于生成结构化的 JSON 响应。
    了解更多关于 [Structured Outputs](/api/docs/guides/structured-outputs).

    - `json_schema: object { name, description, schema, strict }`

      Structured Outputs 配置选项的信息，包括 JSON Schema。

      - `name: string`

        响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
        下划线和短划线，最大长度为 64。

      - `description: optional string`

        对响应格式用途的描述，供模型用来
        确定如何按该格式进行响应。

      - `schema: optional map[unknown]`

        响应格式的架构，以 JSON Schema 对象形式描述。
        了解如何构建 JSON 架构 [请参阅此处](https://json-schema.org/).

      - `strict: optional boolean or null`

        是否在生成输出时启用严格的架构遵循。
        如果设置为 true，模型将始终遵循由
        字段定义的 `schema` 确切架构。当 strict 为 true 时，仅支持 JSON Schema 的
        `strict` 一个子集。若要了解更多信息，请参阅 `true`。文档。 [Structured Outputs
        指南](/api/docs/guides/structured-outputs).

    - `type: "json_schema"`

      正在定义的响应格式的类型。始终为 `json_schema`.

      - `"json_schema"`

  - `ResponseFormatJSONObject object { type }`

    JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
    对于支持 `json_schema` 的模型，建议使用。注意，模型在
    没有系统或用户消息指示的情况下不会生成 JSON，
    因此请确保进行相应指示。

    - `type: "json_object"`

      正在定义的响应格式的类型。始终为 `json_object`.

      - `"json_object"`

- `safety_identifier: optional string or null`

  一个稳定的标识符，用于帮助检测可能违反 OpenAI 使用政策的应用用户。
  该 ID 应为一个字符串，用于唯一标识每个用户，最大长度为 128 个字符。我们建议对其用户名或电子邮件地址进行哈希处理，以避免向我们发送任何可识别信息。 [了解更多](/api/docs/guides/safety-best-practices#implement-safety-identifiers).

- `seed: optional number or null`

  此功能处于 Beta 阶段。
  如果指定，我们的系统将尽最大努力进行确定性采样，以便在相同 `seed` 和参数应返回相同的结果。
  无法保证确定性，你应参考 `system_fingerprint` 响应参数以监测后端的变化。

- `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

  指定用于处理该请求的服务类型。

  - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
  - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
  - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
  - 要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。
  - 当未设置时，默认行为为 'auto'。

  当设置了 `service_tier` 参数时，响应体中将包含基于实际用于处理该请求的处理模式所对应的 `service_tier` 值。该响应值可能与该参数中设置的值不同。

  - `"auto"`

  - `"default"`

  - `"flex"`

  - `"scale"`

  - `"priority"`

  - `"fast"`

- `stop: optional string or array of string or null`

  最新的推理模型不支持 `o3` 和 `o4-mini`.

  最多 4 个序列，遇到这些序列时，API 将停止生成更多词元。返回的
  文本将不包含停止序列。

  - `string`

  - `array of string`

- `store: optional boolean or null`

  是否存储此聊天补全请求的输出以
  用于我们的 [模型蒸馏](/api/docs/guides/supervised-fine-tuning#distilling-from-a-larger-model) 或
  [评估](/api/docs/guides/evals) 产品。

  支持文本和图像输入。注意：超过 8MB 的图像输入将被丢弃。

- `stream: optional boolean or null`

  如果设置为 true，模型响应数据将在生成时通过
  以下方式流式传输给客户端： [服务器发送事件](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format).
  有关更多信息，请参阅下方的 [流式传输部分](/api/reference/resources/chat/subresources/completions/streaming-events)
  ，以及 [流式响应](/api/docs/guides/streaming-responses)
  指南，了解有关如何处理流式事件的更多信息。

- `stream_options: optional ChatCompletionStreamOptions or null`

  流式响应的选项。仅当你设置 `stream: true`.

  - `include_obfuscation: optional boolean`

    为 true 时，将启用流式混淆。流式混淆会向流式增量事件的
    字段添加随机字符，以 `obfuscation` 流式增量事件的字段中，从而
    将载荷大小标准化，作为对某些侧信道攻击的缓解措施。
    默认情况下会包含这些混淆字段，但会给数据流带来少量
    开销。你可以将 `include_obfuscation` 设置为
    设为 false，以在信任你的应用与OpenAI API之间的网络链路时优化带宽，
    你的应用与该公司 接口。

  - `include_usage: optional boolean`

    如果设置此项，将在 `data: [DONE]`
    消息之前流式传输一个额外的数据块。该 `usage` 字段会显示整个请求的令牌用量统计信息，
    整个请求的令牌用量统计信息，而 `choices` 字段将始终是一个空
    数组。

    所有其他数据块也会包含一个 `usage` 字段，但其值为 null
    。 **注意：** 如果流被中断，你可能无法收到包含整个请求令牌总用量的
    最终用量数据块。

- `temperature: optional number or null`

  使用的采样温度，介于 0 到 2 之间。较高的值（如 0.8）会使输出更随机，而较低的值（如 0.2）会使输出更聚焦和确定。
  我们通常建议调整此项或 `top_p` ，但不要同时调整两者。

- `tool_choice: optional ChatCompletionToolChoiceOption`

  控制模型调用哪个工具（如果有）。
  `none` 表示模型不会调用任何工具，而是生成一条消息。
  `auto` 表示模型可以在生成消息与调用一个或多个工具之间进行选择。
  `required` 表示模型必须调用一个或多个工具。
  通过以下方式指定特定工具 `{"type": "function", "function": {"name": "my_function"}}` 会强制模型调用该工具。

  `none` 是未提供工具时的默认值。 `auto` 是提供工具时的默认值。

  - `ToolChoiceMode = "none" or "auto" or "required"`

    `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以在生成消息与调用一个或多个工具之间进行选择。 `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ChatCompletionAllowedToolChoice object { allowed_tools, type }`

    将模型可用的工具限制为预先定义的集合。

    - `allowed_tools: ChatCompletionAllowedTools`

      将模型可用的工具限制为预先定义的集合。

      - `mode: "auto" or "required"`

        将模型可用的工具限制为预先定义的集合。

        `auto` 允许模型从允许的工具中进行选择并生成
        消息。

        `required` 要求模型调用一个或多个允许的工具。

        - `"auto"`

        - `"required"`

      - `tools: array of map[unknown]`

        允许模型调用的工具定义列表。

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
  [自定义工具](/api/docs/guides/function-calling#custom-tools) 或
  [函数工具](/api/docs/guides/function-calling).

  - `ChatCompletionFunctionTool object { function, type }`

    可用于生成响应的函数工具。

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数的名称。必须是 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

      - `description: optional string`

        函数功能的描述，供模型用于选择何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，以 JSON Schema 对象形式描述。请参阅 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解该格式的相关文档。

        省略 `parameters` 会定义一个参数列表为空的函数。

      - `strict: optional boolean or null`

        生成函数调用时是否启用严格模式架构遵循。如果设为 true，模型将遵循 `parameters` 确切架构。当 strict 为 true 时，仅支持 JSON Schema 的 `strict` 一个子集。若要了解更多信息，请参阅 `true`。中定义的精确架构。详细了解 [函数调用指南](/api/docs/guides/function-calling).

    - `type: "function"`

      工具的类型。目前，仅 `function` 类型。

      - `"function"`

  - `ChatCompletionCustomTool object { custom, type }`

    使用指定格式处理输入的自定义工具。

    - `custom: object { name, description, format }`

      自定义工具的属性。

      - `name: string`

        自定义工具的名称，用于在工具调用中标识该工具。

      - `description: optional string`

        自定义工具的可选描述，用于提供更多上下文。

      - `format: optional Text { type }  or Grammar { grammar, type }`

        自定义工具的输入格式。默认为无约束文本。

        - `Text object { type }`

          无约束自由形式文本。

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

              语法定义的语法。必须是以下之一： `lark` 或 `regex`.

              - `"lark"`

              - `"regex"`

          - `type: "grammar"`

            语法格式。始终为 `grammar`.

            - `"grammar"`

    - `type: "custom"`

      自定义工具的类型。始终为 `custom`.

      - `"custom"`

- `top_logprobs: optional number or null`

  介于 0 和 20 之间的整数，指定在每个令牌位置返回的最可能
  令牌的最大数量，每个令牌均附带关联的对数
  概率。在某些情况下，返回的 token 数量可能少于
  所请求的数量。
  `logprobs` 必须设置为 `true` 如果使用此参数。

- `top_p: optional number or null`

  一种替代使用温度采样的方法，称为核采样（nucleus sampling），
  模型会考虑具有 top_p 概率质量的 token 结果。
  因此 0.1 表示仅考虑构成前 10% 概率质量的 token。
  会被考虑。

  我们通常建议调整此项或 `temperature` ，但不要同时调整两者。

- `user: optional string or null`

  此字段正在被替换为 `safety_identifier` 和 `prompt_cache_key`。请使用 `prompt_cache_key` 来维持缓存优化。
  用于标识你的最终用户的稳定标识符。
  用于通过对相似请求进行更好的分桶来提升缓存命中率，并帮助 OpenAI 检测和防止滥用。 [了解更多](/api/docs/guides/safety-best-practices#implement-safety-identifiers).

- `verbosity: optional "low" or "medium" or "high" or null`

  约束模型响应的详尽程度。较低的值将导致
  更简洁的响应，而较高的值将导致更详细的响应。
  当前支持的值包括 `low`, `medium`、和 `high`。默认值为
  `medium`.

  - `"low"`

  - `"medium"`

  - `"high"`

- `web_search_options: optional object { search_context_size, user_location }`

  此工具可在网络中搜索相关内容以用于响应。
  详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

  - `search_context_size: optional "low" or "medium" or "high"`

    用于搜索的上下文窗口空间使用量的高级指引。
    为以下值之一 `low`, `medium`，或 `high`. `medium` 为默认值。

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

        两位字母的
        [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如，
        例如。 `US`.

      - `region: optional string`

        用户所在地区的自由文本输入，例如 `California`.

      - `timezone: optional string`

        该 [IANA 时区](https://timeapi.io/documentation/iana-timezones)
        ，例如。 `America/Los_Angeles`.

    - `type: "approximate"`

      位置近似的类型。始终为 `approximate`.

      - `"approximate"`

### 返回

- `ChatCompletion object { id, choices, created, 7 more }`

  表示模型根据提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项列表。如果 `n` 大于 1，则可以有多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。如果出现以下情况，则为 `stop` 模型达到自然停止点或指定的停止序列，
      `length` 达到请求中指定的最大 token 数，
      `content_filter` 由于我们的内容筛选器设置的标志而省略了内容，
      `tool_calls` 模型调用了工具，或 `function_call` （已弃用）模型调用了函数。
      阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

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

          token。

        - `bytes: array of number or null`

          表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

        - `logprob: number`

          如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 列表及其对数概率。条目数量可能少于所请求的 `top_logprobs`.

          - `token: string`

            token。

          - `bytes: array of number or null`

            表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

          - `logprob: number`

            如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的拒绝消息 token 列表。

        - `token: string`

          token。

        - `bytes: array of number or null`

          表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

        - `logprob: number`

          如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 列表及其对数概率。条目数量可能少于所请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天完成消息。

      - `content: string or null`

        消息的内容。

      - `role: "assistant"`

        该消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注释（如果适用），例如在使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用的第一个字符的索引。

          - `title: string`

            网页资源的标题。

          - `url: string`

            网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关模型
        音频响应的数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          此音频响应将不再可由服务器访问以用于多轮
          交互时的 Unix 时间戳（秒）。
          对话。

        - `transcript: string`

          由模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }  or null`

        已弃用，由 `tool_calls`。取代。应调用的函数的名称和参数，由模型生成。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `refusal: optional string or null`

        模型生成的拒绝消息。

      - `tool_calls: optional array of ChatCompletionMessageToolCall or null`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          模型创建的对函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。目前，仅 `function` 类型。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          模型创建的对自定义工具的调用。

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

    聊天补全创建时的 Unix 时间戳（秒）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对集合。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
    以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。

    键为字符串，最长 64 个字符。值为字符串
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入与生成输出的审核结果（如果请求了审核
    补全）。

    - `input: ModerationResults { model, results, type }  or Error { code, message, type }`

      对请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入被标记为属于该类别，则值为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到得分的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任一类别标记。

          - `model: string`

            生成该结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果始终为 `moderation_result` 。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误信息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

    - `output: ModerationResults { model, results, type }  or Error { code, message, type }`

      对生成输出的内容审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入被标记为属于该类别，则值为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到得分的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任一类别标记。

          - `model: string`

            生成该结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果始终为 `moderation_result` 。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误信息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的服务类型。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
    - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。
    - 当未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体中将包含基于实际用于处理该请求的处理模式所对应的 `service_tier` 值。该响应值可能与该参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行所用的后端配置。

    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端变更。

  - `usage: optional CompletionUsage`

    该补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数量。

    - `prompt_tokens: number`

      提示中的 token 数量。

    - `total_tokens: number`

      请求中使用的 token 总数（提示 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        在使用 Predicted Outputs 时，
        出现在补全中的预测部分的 token 数量。

      - `audio_tokens: optional number`

        由模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        由模型生成的用于推理的 token。

      - `rejected_prediction_tokens: optional number`

        在使用 Predicted Outputs 时，
        未出现在补全中的预测部分。然而，与
        推理 token 一样，这些 token 仍会计入
        用于计费、输出以及上下文窗口的
        总补全 token 数。

      - `text_tokens: optional number`

        由模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的 token 明细。

      - `audio_tokens: optional number`

        提示词中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数。

      - `cached_tokens: optional number`

        提示词中存在的缓存 token。

      - `image_tokens: optional number`

        提示词中存在的图像输入 token。

      - `text_tokens: optional number`

        提示词中存在的文本输入 token。

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
        "refusal": "refusal",
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

删除已存储的聊天补全。仅当 Chat Completions 在创建时设置了
参数时， `store` 参数方可被删除。 `true` 才能被删除。

### 路径参数

- `completion_id: string`

### 返回

- `ChatCompletionDeleted object { id, deleted, object }`

  - `id: string`

    已删除的聊天补全的 ID。

  - `deleted: boolean`

    聊天补全是否已删除。

  - `object: "chat.completion.deleted"`

    已删除对象的类型。

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

列出已存储的 Chat Completions。仅列出已存储的 Chat Completions
使用 `store` 参数方可被删除。 `true` 会被返回。

### 查询参数

- `after: optional string`

  上一次分页请求中最后一条 Chat Completions 的标识符。

- `limit: optional number`

  要检索的 Chat Completions 数量。

- `metadata: optional Metadata or null`

  用于按元数据键筛选 Chat Completions 的键列表。例如：

  `metadata[key1]=value1&metadata[key2]=value2`

- `model: optional string`

  用于生成这些 Chat Completions 的模型。

- `order: optional "asc" or "desc"`

  按时间戳对 Chat Completions 排序的顺序。使用 `asc` 表示升序，或 `desc` 表示降序。默认值为 `asc`.

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of ChatCompletion`

  chat completion 对象数组。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项列表。如果 `n` 大于 1，则可以有多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。如果出现以下情况，则为 `stop` 模型达到自然停止点或指定的停止序列，
      `length` 达到请求中指定的最大 token 数，
      `content_filter` 由于我们的内容筛选器设置的标志而省略了内容，
      `tool_calls` 模型调用了工具，或 `function_call` （已弃用）模型调用了函数。
      阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

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

          token。

        - `bytes: array of number or null`

          表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

        - `logprob: number`

          如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 列表及其对数概率。条目数量可能少于所请求的 `top_logprobs`.

          - `token: string`

            token。

          - `bytes: array of number or null`

            表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

          - `logprob: number`

            如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的拒绝消息 token 列表。

        - `token: string`

          token。

        - `bytes: array of number or null`

          表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

        - `logprob: number`

          如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 列表及其对数概率。条目数量可能少于所请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天完成消息。

      - `content: string or null`

        消息的内容。

      - `role: "assistant"`

        该消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注释（如果适用），例如在使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用的第一个字符的索引。

          - `title: string`

            网页资源的标题。

          - `url: string`

            网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关模型
        音频响应的数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          此音频响应将不再可由服务器访问以用于多轮
          交互时的 Unix 时间戳（秒）。
          对话。

        - `transcript: string`

          由模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }  or null`

        已弃用，由 `tool_calls`。取代。应调用的函数的名称和参数，由模型生成。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `refusal: optional string or null`

        模型生成的拒绝消息。

      - `tool_calls: optional array of ChatCompletionMessageToolCall or null`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          模型创建的对函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。目前，仅 `function` 类型。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          模型创建的对自定义工具的调用。

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

    聊天补全创建时的 Unix 时间戳（秒）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对集合。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
    以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。

    键为字符串，最长 64 个字符。值为字符串
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入与生成输出的审核结果（如果请求了审核
    补全）。

    - `input: ModerationResults { model, results, type }  or Error { code, message, type }`

      对请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入被标记为属于该类别，则值为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到得分的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任一类别标记。

          - `model: string`

            生成该结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果始终为 `moderation_result` 。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误信息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

    - `output: ModerationResults { model, results, type }  or Error { code, message, type }`

      对生成输出的内容审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入被标记为属于该类别，则值为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到得分的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任一类别标记。

          - `model: string`

            生成该结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果始终为 `moderation_result` 。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误信息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的服务类型。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
    - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。
    - 当未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体中将包含基于实际用于处理该请求的处理模式所对应的 `service_tier` 值。该响应值可能与该参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行所用的后端配置。

    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端变更。

  - `usage: optional CompletionUsage`

    该补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数量。

    - `prompt_tokens: number`

      提示中的 token 数量。

    - `total_tokens: number`

      请求中使用的 token 总数（提示 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        在使用 Predicted Outputs 时，
        出现在补全中的预测部分的 token 数量。

      - `audio_tokens: optional number`

        由模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        由模型生成的用于推理的 token。

      - `rejected_prediction_tokens: optional number`

        在使用 Predicted Outputs 时，
        未出现在补全中的预测部分。然而，与
        推理 token 一样，这些 token 仍会计入
        用于计费、输出以及上下文窗口的
        总补全 token 数。

      - `text_tokens: optional number`

        由模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的 token 明细。

      - `audio_tokens: optional number`

        提示词中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数。

      - `cached_tokens: optional number`

        提示词中存在的缓存 token。

      - `image_tokens: optional number`

        提示词中存在的图像输入 token。

      - `text_tokens: optional number`

        提示词中存在的文本输入 token。

- `first_id: string or null`

  数据数组中第一条 chat completion 的标识符。

- `has_more: boolean`

  指示是否还有更多 Chat Completions 可用。

- `last_id: string or null`

  数据数组中最后一条 chat completion 的标识符。

- `object: "list"`

  此对象的类型，始终为 "list"。

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
            "refusal": "refusal",
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
使用 `store` 参数方可被删除。 `true` 会被返回。

### 路径参数

- `completion_id: string`

### 返回

- `ChatCompletion object { id, choices, created, 7 more }`

  表示模型根据提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项列表。如果 `n` 大于 1，则可以有多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。如果出现以下情况，则为 `stop` 模型达到自然停止点或指定的停止序列，
      `length` 达到请求中指定的最大 token 数，
      `content_filter` 由于我们的内容筛选器设置的标志而省略了内容，
      `tool_calls` 模型调用了工具，或 `function_call` （已弃用）模型调用了函数。
      阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

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

          token。

        - `bytes: array of number or null`

          表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

        - `logprob: number`

          如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 列表及其对数概率。条目数量可能少于所请求的 `top_logprobs`.

          - `token: string`

            token。

          - `bytes: array of number or null`

            表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

          - `logprob: number`

            如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的拒绝消息 token 列表。

        - `token: string`

          token。

        - `bytes: array of number or null`

          表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

        - `logprob: number`

          如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 列表及其对数概率。条目数量可能少于所请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天完成消息。

      - `content: string or null`

        消息的内容。

      - `role: "assistant"`

        该消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注释（如果适用），例如在使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用的第一个字符的索引。

          - `title: string`

            网页资源的标题。

          - `url: string`

            网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关模型
        音频响应的数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          此音频响应将不再可由服务器访问以用于多轮
          交互时的 Unix 时间戳（秒）。
          对话。

        - `transcript: string`

          由模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }  or null`

        已弃用，由 `tool_calls`。取代。应调用的函数的名称和参数，由模型生成。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `refusal: optional string or null`

        模型生成的拒绝消息。

      - `tool_calls: optional array of ChatCompletionMessageToolCall or null`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          模型创建的对函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。目前，仅 `function` 类型。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          模型创建的对自定义工具的调用。

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

    聊天补全创建时的 Unix 时间戳（秒）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对集合。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
    以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。

    键为字符串，最长 64 个字符。值为字符串
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入与生成输出的审核结果（如果请求了审核
    补全）。

    - `input: ModerationResults { model, results, type }  or Error { code, message, type }`

      对请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入被标记为属于该类别，则值为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到得分的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任一类别标记。

          - `model: string`

            生成该结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果始终为 `moderation_result` 。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误信息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

    - `output: ModerationResults { model, results, type }  or Error { code, message, type }`

      对生成输出的内容审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入被标记为属于该类别，则值为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到得分的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任一类别标记。

          - `model: string`

            生成该结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果始终为 `moderation_result` 。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误信息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的服务类型。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
    - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。
    - 当未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体中将包含基于实际用于处理该请求的处理模式所对应的 `service_tier` 值。该响应值可能与该参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行所用的后端配置。

    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端变更。

  - `usage: optional CompletionUsage`

    该补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数量。

    - `prompt_tokens: number`

      提示中的 token 数量。

    - `total_tokens: number`

      请求中使用的 token 总数（提示 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        在使用 Predicted Outputs 时，
        出现在补全中的预测部分的 token 数量。

      - `audio_tokens: optional number`

        由模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        由模型生成的用于推理的 token。

      - `rejected_prediction_tokens: optional number`

        在使用 Predicted Outputs 时，
        未出现在补全中的预测部分。然而，与
        推理 token 一样，这些 token 仍会计入
        用于计费、输出以及上下文窗口的
        总补全 token 数。

      - `text_tokens: optional number`

        由模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的 token 明细。

      - `audio_tokens: optional number`

        提示词中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数。

      - `cached_tokens: optional number`

        提示词中存在的缓存 token。

      - `image_tokens: optional number`

        提示词中存在的图像输入 token。

      - `text_tokens: optional number`

        提示词中存在的文本输入 token。

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
        "refusal": "refusal",
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

**文章** `/chat/completions/{completion_id}`

修改已存储的聊天补全。只有已被
参数时， `store` 参数方可被删除。 `true` 可以修改。目前，
唯一支持的修改是更新 `metadata` 字段。

### 路径参数

- `completion_id: string`

### 请求体参数

- `metadata: Metadata or null`

  可附加到对象的 16 个键值对集合。可用于
  以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
  以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。

  键为字符串，最长 64 个字符。值为字符串
  最大长度为 512 个字符。

### 返回

- `ChatCompletion object { id, choices, created, 7 more }`

  表示模型根据提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项列表。如果 `n` 大于 1，则可以有多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。如果出现以下情况，则为 `stop` 模型达到自然停止点或指定的停止序列，
      `length` 达到请求中指定的最大 token 数，
      `content_filter` 由于我们的内容筛选器设置的标志而省略了内容，
      `tool_calls` 模型调用了工具，或 `function_call` （已弃用）模型调用了函数。
      阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

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

          token。

        - `bytes: array of number or null`

          表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

        - `logprob: number`

          如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 列表及其对数概率。条目数量可能少于所请求的 `top_logprobs`.

          - `token: string`

            token。

          - `bytes: array of number or null`

            表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

          - `logprob: number`

            如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的拒绝消息 token 列表。

        - `token: string`

          token。

        - `bytes: array of number or null`

          表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

        - `logprob: number`

          如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 列表及其对数概率。条目数量可能少于所请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天完成消息。

      - `content: string or null`

        消息的内容。

      - `role: "assistant"`

        该消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注释（如果适用），例如在使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用的第一个字符的索引。

          - `title: string`

            网页资源的标题。

          - `url: string`

            网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关模型
        音频响应的数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          此音频响应将不再可由服务器访问以用于多轮
          交互时的 Unix 时间戳（秒）。
          对话。

        - `transcript: string`

          由模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }  or null`

        已弃用，由 `tool_calls`。取代。应调用的函数的名称和参数，由模型生成。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `refusal: optional string or null`

        模型生成的拒绝消息。

      - `tool_calls: optional array of ChatCompletionMessageToolCall or null`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          模型创建的对函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。目前，仅 `function` 类型。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          模型创建的对自定义工具的调用。

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

    聊天补全创建时的 Unix 时间戳（秒）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对集合。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
    以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。

    键为字符串，最长 64 个字符。值为字符串
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入与生成输出的审核结果（如果请求了审核
    补全）。

    - `input: ModerationResults { model, results, type }  or Error { code, message, type }`

      对请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入被标记为属于该类别，则值为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到得分的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任一类别标记。

          - `model: string`

            生成该结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果始终为 `moderation_result` 。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误信息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

    - `output: ModerationResults { model, results, type }  or Error { code, message, type }`

      对生成输出的内容审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入被标记为属于该类别，则值为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到得分的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任一类别标记。

          - `model: string`

            生成该结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果始终为 `moderation_result` 。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误信息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的服务类型。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
    - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。
    - 当未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体中将包含基于实际用于处理该请求的处理模式所对应的 `service_tier` 值。该响应值可能与该参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行所用的后端配置。

    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端变更。

  - `usage: optional CompletionUsage`

    该补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数量。

    - `prompt_tokens: number`

      提示中的 token 数量。

    - `total_tokens: number`

      请求中使用的 token 总数（提示 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        在使用 Predicted Outputs 时，
        出现在补全中的预测部分的 token 数量。

      - `audio_tokens: optional number`

        由模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        由模型生成的用于推理的 token。

      - `rejected_prediction_tokens: optional number`

        在使用 Predicted Outputs 时，
        未出现在补全中的预测部分。然而，与
        推理 token 一样，这些 token 仍会计入
        用于计费、输出以及上下文窗口的
        总补全 token 数。

      - `text_tokens: optional number`

        由模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的 token 明细。

      - `audio_tokens: optional number`

        提示词中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数。

      - `cached_tokens: optional number`

        提示词中存在的缓存 token。

      - `image_tokens: optional number`

        提示词中存在的图像输入 token。

      - `text_tokens: optional number`

        提示词中存在的文本输入 token。

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
        "refusal": "refusal",
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

### Chat Completion Allowed Tools

- `ChatCompletionAllowedTools object { mode, tools }`

  将模型可用的工具限制为预先定义的集合。

  - `mode: "auto" or "required"`

    将模型可用的工具限制为预先定义的集合。

    `auto` 允许模型从允许的工具中进行选择并生成
    消息。

    `required` 要求模型调用一个或多个允许的工具。

    - `"auto"`

    - `"required"`

  - `tools: array of map[unknown]`

    允许模型调用的工具定义列表。

    对于 Chat Completions API，工具定义列表可能如下所示：

    ```json
    [
      { "type": "function", "function": { "name": "get_weather" } },
      { "type": "function", "function": { "name": "get_time" } }
    ]
    ```

### Chat Completion

- `ChatCompletion object { id, choices, created, 7 more }`

  表示模型根据提供的输入返回的聊天补全响应。

  - `id: string`

    聊天补全的唯一标识符。

  - `choices: array of object { finish_reason, index, logprobs, message }`

    聊天补全选项列表。如果 `n` 大于 1，则可以有多个。

    - `finish_reason: "stop" or "length" or "tool_calls" or 2 more`

      模型停止生成 token 的原因。如果出现以下情况，则为 `stop` 模型达到自然停止点或指定的停止序列，
      `length` 达到请求中指定的最大 token 数，
      `content_filter` 由于我们的内容筛选器设置的标志而省略了内容，
      `tool_calls` 模型调用了工具，或 `function_call` （已弃用）模型调用了函数。
      阅读 [模型规范](https://model-spec.openai.com/2025-12-18.html) 了解更多信息。

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

          token。

        - `bytes: array of number or null`

          表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

        - `logprob: number`

          如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 列表及其对数概率。条目数量可能少于所请求的 `top_logprobs`.

          - `token: string`

            token。

          - `bytes: array of number or null`

            表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

          - `logprob: number`

            如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的拒绝消息 token 列表。

        - `token: string`

          token。

        - `bytes: array of number or null`

          表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

        - `logprob: number`

          如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 列表及其对数概率。条目数量可能少于所请求的 `top_logprobs`.

    - `message: ChatCompletionMessage`

      由模型生成的聊天完成消息。

      - `content: string or null`

        消息的内容。

      - `role: "assistant"`

        该消息作者的角色。

        - `"assistant"`

      - `annotations: optional array of object { type, url_citation }`

        消息的注释（如果适用），例如在使用
        [网页搜索工具](/api/docs/guides/tools-web-search).

        - `type: "url_citation"`

          URL 引用的类型。始终为 `url_citation`.

          - `"url_citation"`

        - `url_citation: object { end_index, start_index, title, url }`

          使用网页搜索时的 URL 引用。

          - `end_index: number`

            消息中 URL 引用最后一个字符的索引。

          - `start_index: number`

            消息中 URL 引用的第一个字符的索引。

          - `title: string`

            网页资源的标题。

          - `url: string`

            网页资源的 URL。

      - `audio: optional ChatCompletionAudio or null`

        如果请求了音频输出模态，则此对象包含有关模型
        音频响应的数据。 [了解更多](/api/docs/guides/audio).

        - `id: string`

          此音频响应的唯一标识符。

        - `data: string`

          模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: number`

          此音频响应将不再可由服务器访问以用于多轮
          交互时的 Unix 时间戳（秒）。
          对话。

        - `transcript: string`

          由模型生成的音频转录文本。

      - `function_call: optional object { arguments, name }  or null`

        已弃用，由 `tool_calls`。取代。应调用的函数的名称和参数，由模型生成。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `refusal: optional string or null`

        模型生成的拒绝消息。

      - `tool_calls: optional array of ChatCompletionMessageToolCall or null`

        模型生成的工具调用，例如函数调用。

        - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

          模型创建的对函数工具的调用。

          - `id: string`

            工具调用的 ID。

          - `function: object { arguments, name }`

            模型调用的函数。

            - `arguments: string`

              调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

            - `name: string`

              要调用的函数名称。

          - `type: "function"`

            工具的类型。目前，仅 `function` 类型。

            - `"function"`

        - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

          模型创建的对自定义工具的调用。

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

    聊天补全创建时的 Unix 时间戳（秒）。

  - `model: string`

    用于聊天补全的模型。

  - `object: "chat.completion"`

    对象类型，始终为 `chat.completion`.

    - `"chat.completion"`

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对集合。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
    以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。

    键为字符串，最长 64 个字符。值为字符串
    最大长度为 512 个字符。

  - `moderation: optional object { input, output }  or null`

    请求输入与生成输出的审核结果（如果请求了审核
    补全）。

    - `input: ModerationResults { model, results, type }  or Error { code, message, type }`

      对请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入被标记为属于该类别，则值为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到得分的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任一类别标记。

          - `model: string`

            生成该结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果始终为 `moderation_result` 。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误信息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

    - `output: ModerationResults { model, results, type }  or Error { code, message, type }`

      对生成输出的内容审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入被标记为属于该类别，则值为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到得分的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任一类别标记。

          - `model: string`

            生成该结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果始终为 `moderation_result` 。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误信息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的服务类型。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
    - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。
    - 当未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体中将包含基于实际用于处理该请求的处理模式所对应的 `service_tier` 值。该响应值可能与该参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行所用的后端配置。

    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端变更。

  - `usage: optional CompletionUsage`

    该补全请求的使用统计信息。

    - `completion_tokens: number`

      生成补全中的 token 数量。

    - `prompt_tokens: number`

      提示中的 token 数量。

    - `total_tokens: number`

      请求中使用的 token 总数（提示 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        在使用 Predicted Outputs 时，
        出现在补全中的预测部分的 token 数量。

      - `audio_tokens: optional number`

        由模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        由模型生成的用于推理的 token。

      - `rejected_prediction_tokens: optional number`

        在使用 Predicted Outputs 时，
        未出现在补全中的预测部分。然而，与
        推理 token 一样，这些 token 仍会计入
        用于计费、输出以及上下文窗口的
        总补全 token 数。

      - `text_tokens: optional number`

        由模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的 token 明细。

      - `audio_tokens: optional number`

        提示词中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数。

      - `cached_tokens: optional number`

        提示词中存在的缓存 token。

      - `image_tokens: optional number`

        提示词中存在的图像输入 token。

      - `text_tokens: optional number`

        提示词中存在的文本输入 token。

### Chat Completion Allowed Tool Choice

- `ChatCompletionAllowedToolChoice object { allowed_tools, type }`

  将模型可用的工具限制为预先定义的集合。

  - `allowed_tools: ChatCompletionAllowedTools`

    将模型可用的工具限制为预先定义的集合。

    - `mode: "auto" or "required"`

      将模型可用的工具限制为预先定义的集合。

      `auto` 允许模型从允许的工具中进行选择并生成
      消息。

      `required` 要求模型调用一个或多个允许的工具。

      - `"auto"`

      - `"required"`

    - `tools: array of map[unknown]`

      允许模型调用的工具定义列表。

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

  模型响应用户消息时发送的消息。

  - `role: "assistant"`

    消息作者的角色，此处为 `assistant`.

    - `"assistant"`

  - `audio: optional object { id }  or null`

    有关模型先前音频响应的数据。
    [了解更多](/api/docs/guides/audio).

    - `id: string`

      模型先前音频响应的唯一标识符。

  - `content: optional string or array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal or null`

    助手消息的内容。除非指定了 `tool_calls` 或 `function_call` ，否则为必填项。

    - `TextContent = string`

      助手消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal`

      由内容部分组成的数组，每个部分都有明确的类型。可以是以下一个或多个类型： `text`，或以下类型中的恰好一个： `refusal`.

      - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

        了解 [文本输入](/api/docs/guides/text).

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ChatCompletionContentPartRefusal object { refusal, type }`

        - `refusal: string`

          模型生成的拒绝消息。

        - `type: "refusal"`

          内容部分的类型。

          - `"refusal"`

  - `function_call: optional object { arguments, name }  or null`

    已弃用，由 `tool_calls`。取代。应调用的函数的名称和参数，由模型生成。

    - `arguments: string`

      调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

    - `name: string`

      要调用的函数名称。

  - `name: optional string`

    参与者的可选名称。为模型提供信息以区分相同角色的不同参与者。

  - `refusal: optional string or null`

    助手发出的拒绝消息。

  - `tool_calls: optional array of ChatCompletionMessageToolCall`

    模型生成的工具调用，例如函数调用。

    - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

      模型创建的对函数工具的调用。

      - `id: string`

        工具调用的 ID。

      - `function: object { arguments, name }`

        模型调用的函数。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `type: "function"`

        工具的类型。目前，仅 `function` 类型。

        - `"function"`

    - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

      模型创建的对自定义工具的调用。

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

  如果请求了音频输出模态，则此对象包含有关模型
  音频响应的数据。 [了解更多](/api/docs/guides/audio).

  - `id: string`

    此音频响应的唯一标识符。

  - `data: string`

    模型生成的 Base64 编码音频字节，格式为
    请求中指定的格式。

  - `expires_at: number`

    此音频响应将不再可由服务器访问以用于多轮
    交互时的 Unix 时间戳（秒）。
    对话。

  - `transcript: string`

    由模型生成的音频转录文本。

### Chat Completion Audio Param

- `ChatCompletionAudioParam object { format, voice }`

  音频输出的参数。在使用以下参数请求音频输出时为必填项：
  `modalities: ["audio"]`. [了解更多](/api/docs/guides/audio).

  - `format: "wav" or "aac" or "mp3" or 3 more`

    指定输出音频格式。必须是以下之一： `wav`, `mp3`, `flac`,
    `opus`，或 `pcm16`.

    - `"wav"`

    - `"aac"`

    - `"mp3"`

    - `"flac"`

    - `"opus"`

    - `"pcm16"`

  - `voice: string or "alloy" or "ash" or "ballad" or 7 more or ID { id }`

    模型用于响应的语音。支持的内置语音有：
    `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `nova`, `onyx`,
    `sage`, `shimmer`, `marin`、和 `cedar`。你也可以提供一个
    自定义语音对象，并附带 `id`，例如： `{ "id": "voice_1234" }`.
    自定义语音必须由音频样本创建。

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

        自定义语音 ID，例如： `voice_1234`.

### Chat Completion Chunk

- `ChatCompletionChunk object { id, choices, created, 7 more }`

  表示模型基于所提供输入返回的聊天补全响应的流式分块
  。
  [了解更多](/api/docs/guides/streaming-responses).

  - `id: string`

    聊天补全的唯一标识符。每个分块具有相同的 ID。

  - `choices: array of object { delta, index, finish_reason, logprobs }`

    聊天补全选项列表。当 `n` 大于 1 时可以包含多个元素。如果你在
    最后一个分块中设置了 `stream_options: {"include_usage": true}`.

    - `delta: object { audio, content, function_call, 3 more }`

      流式模型响应生成的聊天补全增量。
      流式音频可以以包含 ID、base64 数据或
      转录文本的部分更新形式到达。最终的音频更新仅包含其过期时间戳。

      - `audio: optional object { id, data, expires_at, transcript }`

        部分音频响应。音频分块可能包含 ID、base64 数据或
        转录文本；最终的音频更新仅包含其过期时间戳。

        - `id: optional string`

          此音频响应的唯一标识符。

        - `data: optional string`

          模型生成的 Base64 编码音频字节，格式为
          请求中指定的格式。

        - `expires_at: optional number`

          此音频响应在服务端不再可用于多轮对话的 Unix 时间戳（以秒为单位
          ）。

        - `transcript: optional string`

          此音频分块中的转录文本。

      - `content: optional string or null`

        分块消息的内容。

      - `function_call: optional object { arguments, name }`

        已弃用，由 `tool_calls`。取代。应调用的函数的名称和参数，由模型生成。

        - `arguments: optional string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

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

            调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

          - `name: optional string`

            要调用的函数名称。

        - `type: optional "function"`

          工具的类型。目前，仅 `function` 类型。

          - `"function"`

    - `index: number`

      该选项在选项列表中的索引。

    - `finish_reason: optional "stop" or "length" or "tool_calls" or 2 more or null`

      模型停止生成 token 的原因。如果出现以下情况，则为 `stop` 模型达到自然停止点或指定的停止序列，
      `length` 达到请求中指定的最大 token 数，
      `content_filter` 由于我们的内容筛选器设置的标志而省略了内容，
      `tool_calls` 模型调用了工具，或 `function_call` （已弃用）模型调用了函数。
      在仅包含的最终音频更新中省略 `delta.audio.expires_at`.

      - `"stop"`

      - `"length"`

      - `"tool_calls"`

      - `"content_filter"`

      - `"function_call"`

    - `logprobs: optional object { content, refusal }  or null`

      该选项的对数概率信息。

      - `content: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的消息内容 token 列表。

        - `token: string`

          token。

        - `bytes: array of number or null`

          表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

        - `logprob: number`

          如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 列表及其对数概率。条目数量可能少于所请求的 `top_logprobs`.

          - `token: string`

            token。

          - `bytes: array of number or null`

            表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

          - `logprob: number`

            如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

      - `refusal: array of ChatCompletionTokenLogprob or null`

        包含对数概率信息的拒绝消息 token 列表。

        - `token: string`

          token。

        - `bytes: array of number or null`

          表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

        - `logprob: number`

          如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

        - `top_logprobs: array of object { token, bytes, logprob }`

          在该 token 位置处最可能的 token 列表及其对数概率。条目数量可能少于所请求的 `top_logprobs`.

  - `created: number`

    聊天补全创建时的 Unix 时间戳（以秒为单位）。每个分块具有相同的时间戳。

  - `model: string`

    用于生成补全的模型。

  - `object: "chat.completion.chunk"`

    对象类型，始终为 `chat.completion.chunk`.

    - `"chat.completion.chunk"`

  - `moderation: optional object { input, output }  or null`

    请求输入和生成输出的审核结果。当请求了已审核的补全时，
    出现在审核分块上。

    - `input: ModerationResults { model, results, type }  or Error { code, message, type }`

      对请求输入的审核结果。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入被标记为属于该类别，则值为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到得分的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任一类别标记。

          - `model: string`

            生成该结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果始终为 `moderation_result` 。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误信息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

    - `output: ModerationResults { model, results, type }  or Error { code, message, type }`

      对生成输出的内容审核。

      - `ModerationResults object { model, results, type }`

        对请求输入或生成输出的成功审核结果。

        - `model: string`

          用于生成结果的审核模型。

        - `results: array of object { categories, category_applied_input_types, category_scores, 3 more }`

          审核结果列表。

          - `categories: map[boolean]`

            一个由审核类别映射到布尔值的字典；如果输入被标记为属于该类别，则值为 True。

          - `category_applied_input_types: map[array of "text" or "image"]`

            每个类别的得分所对应的输入模态。

            - `"text"`

            - `"image"`

          - `category_scores: map[number]`

            一个由审核类别映射到得分的字典。

          - `flagged: boolean`

            一个布尔值，指示内容是否被任一类别标记。

          - `model: string`

            生成该结果的审核模型。

          - `type: "moderation_result"`

            对象类型，对于成功的审核结果始终为 `moderation_result` 。

            - `"moderation_result"`

        - `type: "moderation_results"`

          对象类型，始终为 `moderation_results`.

          - `"moderation_results"`

      - `Error object { code, message, type }`

        尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误信息。

        - `type: "error"`

          对象类型，始终为 `error`.

          - `"error"`

  - `obfuscation: optional string`

    用于规范化流式响应块大小的混淆字符串，作为
    针对某些侧信道攻击的缓解措施。该字段默认包含，
    并在以下情况下省略 `stream_options.include_obfuscation` 一个子集。若要了解更多信息，请参阅 `false`.

  - `service_tier: optional "auto" or "default" or "flex" or 3 more or null`

    指定用于处理该请求的服务类型。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则该项目将使用 'default'。
    - 如果设置为 'default'，则请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 要在请求级别启用 [Fast mode](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 中传入 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。
    - 当未设置时，默认行为为 'auto'。

    当设置了 `service_tier` 参数时，响应体中将包含基于实际用于处理该请求的处理模式所对应的 `service_tier` 值。该响应值可能与该参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

  - `system_fingerprint: optional string`

    此指纹表示模型运行所使用后端配置。
    可与 `seed` 请求参数结合使用，以了解何时发生了可能影响确定性的后端变更。

  - `usage: optional CompletionUsage or null`

    仅当你在请求中设置
    `stream_options: {"include_usage": true}` 时才会出现的可选字段。出现时，它
    包含一个 null 值， **除最后一个块外** ，最后一个块包含
    整个请求的 token 使用统计信息。

    **注意：** 如果流被中断或取消，你可能不会
    收到包含整个请求 token 使用总量的最终使用块，
    该块包含本次请求的总 token 用量。

    - `completion_tokens: number`

      生成补全中的 token 数量。

    - `prompt_tokens: number`

      提示中的 token 数量。

    - `total_tokens: number`

      请求中使用的 token 总数（提示 + 补全）。

    - `completion_tokens_details: optional object { accepted_prediction_tokens, audio_tokens, reasoning_tokens, 2 more }`

      补全中使用的 token 明细。

      - `accepted_prediction_tokens: optional number`

        在使用 Predicted Outputs 时，
        出现在补全中的预测部分的 token 数量。

      - `audio_tokens: optional number`

        由模型生成的音频输入 token。

      - `reasoning_tokens: optional number`

        由模型生成的用于推理的 token。

      - `rejected_prediction_tokens: optional number`

        在使用 Predicted Outputs 时，
        未出现在补全中的预测部分。然而，与
        推理 token 一样，这些 token 仍会计入
        用于计费、输出以及上下文窗口的
        总补全 token 数。

      - `text_tokens: optional number`

        由模型生成的文本输出 token。

    - `prompt_tokens_details: optional object { audio_tokens, cache_write_tokens, cached_tokens, 2 more }`

      提示中使用的 token 明细。

      - `audio_tokens: optional number`

        提示词中存在的音频输入 token。

      - `cache_write_tokens: optional number`

        写入缓存的未调整提示 token 数。

      - `cached_tokens: optional number`

        提示词中存在的缓存 token。

      - `image_tokens: optional number`

        提示词中存在的图像输入 token。

      - `text_tokens: optional number`

        提示词中存在的文本输入 token。

### Chat Completion Content Part

- `ChatCompletionContentPart = ChatCompletionContentPartText or ChatCompletionContentPartImage or ChatCompletionContentPartInputAudio or FileContentPart { file, type, prompt_cache_breakpoint }`

  了解 [文本输入](/api/docs/guides/text).

  - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

    了解 [文本输入](/api/docs/guides/text).

    - `text: string`

      文本内容。

    - `type: "text"`

      内容部分的类型。

      - `"text"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

      - `mode: "explicit"`

        断点模式。始终为 `explicit`.

        - `"explicit"`

  - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

    了解 [图像输入](/api/docs/guides/images-vision).

    - `image_url: object { url, detail }`

      - `url: string`

        图像的 URL 或 base64 编码的图像数据。

      - `detail: optional "auto" or "low" or "high" or "original"`

        指定图像的细节级别。在 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

        - `"auto"`

        - `"low"`

        - `"high"`

        - `"original"`

    - `type: "image_url"`

      内容部分的类型。

      - `"image_url"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

      标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

      - `mode: "explicit"`

        断点模式。始终为 `explicit`.

        - `"explicit"`

  - `FileContentPart object { file, type, prompt_cache_breakpoint }`

    了解 [文件输入](/api/docs/guides/text) 用于文本生成。

    - `file: object { file_data, file_id, filename }`

      - `file_data: optional string`

        Base64 编码的文件数据，将文件以字符串形式传递给模型时使用
        。

      - `file_id: optional string`

        用作输入的已上传文件的 ID。

      - `filename: optional string`

        文件名，将文件以字符串形式传递给模型时使用
        。

    - `type: "file"`

      内容部分的类型。始终为 `file`.

      - `"file"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

      - `mode: "explicit"`

        断点模式。始终为 `explicit`.

        - `"explicit"`

### Chat Completion Content Part Image

- `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

  了解 [图像输入](/api/docs/guides/images-vision).

  - `image_url: object { url, detail }`

    - `url: string`

      图像的 URL 或 base64 编码的图像数据。

    - `detail: optional "auto" or "low" or "high" or "original"`

      指定图像的细节级别。在 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

      - `"auto"`

      - `"low"`

      - `"high"`

      - `"original"`

  - `type: "image_url"`

    内容部分的类型。

    - `"image_url"`

  - `prompt_cache_breakpoint: optional object { mode }`

    标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

    标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

    - `mode: "explicit"`

      断点模式。始终为 `explicit`.

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

    标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

    - `mode: "explicit"`

      断点模式。始终为 `explicit`.

      - `"explicit"`

### Chat Completion Custom Tool

- `ChatCompletionCustomTool object { custom, type }`

  使用指定格式处理输入的自定义工具。

  - `custom: object { name, description, format }`

    自定义工具的属性。

    - `name: string`

      自定义工具的名称，用于在工具调用中标识该工具。

    - `description: optional string`

      自定义工具的可选描述，用于提供更多上下文。

    - `format: optional Text { type }  or Grammar { grammar, type }`

      自定义工具的输入格式。默认为无约束文本。

      - `Text object { type }`

        无约束自由形式文本。

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

            语法定义的语法。必须是以下之一： `lark` 或 `regex`.

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

    已删除对象的类型。

    - `"chat.completion.deleted"`

### Chat Completion Developer Message Param

- `ChatCompletionDeveloperMessageParam object { content, role, name }`

  开发者提供的指令，无论用户发送什么消息，模型都应遵循这些指令。对于 o1 及更新的模型，
  消息， `developer` 取代了之前的
  消息 `system` 消息。

  - `content: string or array of ChatCompletionContentPartText`

    开发者消息的内容。

    - `TextContent = string`

      开发者消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      具有已定义类型的 content parts 数组。对于开发者消息，仅支持 type `text` 类型。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `role: "developer"`

    消息作者的角色，此处为 `developer`.

    - `"developer"`

  - `name: optional string`

    参与者的可选名称。为模型提供信息以区分相同角色的不同参与者。

### Chat Completion Function Call Option

- `ChatCompletionFunctionCallOption object { name }`

  通过指定特定函数 `{"name": "my_function"}` 强制模型调用该函数。

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

      要调用的函数的名称。必须是 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

    - `description: optional string`

      函数功能的描述，供模型用于选择何时以及如何调用该函数。

    - `parameters: optional FunctionParameters`

      函数接受的参数，以 JSON Schema 对象形式描述。请参阅 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解该格式的相关文档。

      省略 `parameters` 会定义一个参数列表为空的函数。

    - `strict: optional boolean or null`

      生成函数调用时是否启用严格模式架构遵循。如果设为 true，模型将遵循 `parameters` 确切架构。当 strict 为 true 时，仅支持 JSON Schema 的 `strict` 一个子集。若要了解更多信息，请参阅 `true`。中定义的精确架构。详细了解 [函数调用指南](/api/docs/guides/function-calling).

  - `type: "function"`

    工具的类型。目前，仅 `function` 类型。

    - `"function"`

### Chat Completion Message

- `ChatCompletionMessage object { content, role, annotations, 4 more }`

  由模型生成的聊天完成消息。

  - `content: string or null`

    消息的内容。

  - `role: "assistant"`

    该消息作者的角色。

    - `"assistant"`

  - `annotations: optional array of object { type, url_citation }`

    消息的注释（如果适用），例如在使用
    [网页搜索工具](/api/docs/guides/tools-web-search).

    - `type: "url_citation"`

      URL 引用的类型。始终为 `url_citation`.

      - `"url_citation"`

    - `url_citation: object { end_index, start_index, title, url }`

      使用网页搜索时的 URL 引用。

      - `end_index: number`

        消息中 URL 引用最后一个字符的索引。

      - `start_index: number`

        消息中 URL 引用的第一个字符的索引。

      - `title: string`

        网页资源的标题。

      - `url: string`

        网页资源的 URL。

  - `audio: optional ChatCompletionAudio or null`

    如果请求了音频输出模态，则此对象包含有关模型
    音频响应的数据。 [了解更多](/api/docs/guides/audio).

    - `id: string`

      此音频响应的唯一标识符。

    - `data: string`

      模型生成的 Base64 编码音频字节，格式为
      请求中指定的格式。

    - `expires_at: number`

      此音频响应将不再可由服务器访问以用于多轮
      交互时的 Unix 时间戳（秒）。
      对话。

    - `transcript: string`

      由模型生成的音频转录文本。

  - `function_call: optional object { arguments, name }  or null`

    已弃用，由 `tool_calls`。取代。应调用的函数的名称和参数，由模型生成。

    - `arguments: string`

      调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

    - `name: string`

      要调用的函数名称。

  - `refusal: optional string or null`

    模型生成的拒绝消息。

  - `tool_calls: optional array of ChatCompletionMessageToolCall or null`

    模型生成的工具调用，例如函数调用。

    - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

      模型创建的对函数工具的调用。

      - `id: string`

        工具调用的 ID。

      - `function: object { arguments, name }`

        模型调用的函数。

        - `arguments: string`

          调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

        - `name: string`

          要调用的函数名称。

      - `type: "function"`

        工具的类型。目前，仅 `function` 类型。

        - `"function"`

    - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

      模型创建的对自定义工具的调用。

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

  模型创建的对自定义工具的调用。

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

  模型创建的对函数工具的调用。

  - `id: string`

    工具调用的 ID。

  - `function: object { arguments, name }`

    模型调用的函数。

    - `arguments: string`

      调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

    - `name: string`

      要调用的函数名称。

  - `type: "function"`

    工具的类型。目前，仅 `function` 类型。

    - `"function"`

### Chat Completion Message Param

- `ChatCompletionMessageParam = ChatCompletionDeveloperMessageParam or ChatCompletionSystemMessageParam or ChatCompletionUserMessageParam or 3 more`

  开发者提供的指令，无论用户发送什么消息，模型都应遵循这些指令。对于 o1 及更新的模型，
  消息， `developer` 取代了之前的
  消息 `system` 消息。

  - `ChatCompletionDeveloperMessageParam object { content, role, name }`

    开发者提供的指令，无论用户发送什么消息，模型都应遵循这些指令。对于 o1 及更新的模型，
    消息， `developer` 取代了之前的
    消息 `system` 消息。

    - `content: string or array of ChatCompletionContentPartText`

      开发者消息的内容。

      - `TextContent = string`

        开发者消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        具有已定义类型的 content parts 数组。对于开发者消息，仅支持 type `text` 类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

    - `role: "developer"`

      消息作者的角色，此处为 `developer`.

      - `"developer"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的不同参与者。

  - `ChatCompletionSystemMessageParam object { content, role, name }`

    开发者提供的指令，无论用户发送什么消息，模型都应遵循这些指令。对于 o1 及更新的模型，
    用户发送的消息。对于 o1 及更新的模型，请改用 `developer` 取代了之前的
    来实现此目的。

    - `content: string or array of ChatCompletionContentPartText`

      系统消息的内容。

      - `TextContent = string`

        系统消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText`

        具有指定类型的内容部分数组。对于系统消息，仅支持 type 为 `text` 类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

    - `role: "system"`

      消息作者的角色，此处为 `system`.

      - `"system"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的不同参与者。

  - `ChatCompletionUserMessageParam object { content, role, name }`

    由终端用户发送的消息，包含提示或额外的上下文
    信息。

    - `content: string or array of ChatCompletionContentPart`

      用户消息的内容。

      - `TextContent = string`

        消息的文本内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPart`

        具有指定类型的内容部分数组。支持的可选项取决于用于生成响应的 [模型](/api/docs/models) ，可以包含文本、图像或音频输入。

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/api/docs/guides/text).

          - `text: string`

            文本内容。

          - `type: "text"`

            内容部分的类型。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

          了解 [图像输入](/api/docs/guides/images-vision).

          - `image_url: object { url, detail }`

            - `url: string`

              图像的 URL 或 base64 编码的图像数据。

            - `detail: optional "auto" or "low" or "high" or "original"`

              指定图像的细节级别。在 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

              - `"auto"`

              - `"low"`

              - `"high"`

              - `"original"`

          - `type: "image_url"`

            内容部分的类型。

            - `"image_url"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `FileContentPart object { file, type, prompt_cache_breakpoint }`

          了解 [文件输入](/api/docs/guides/text) 用于文本生成。

          - `file: object { file_data, file_id, filename }`

            - `file_data: optional string`

              Base64 编码的文件数据，将文件以字符串形式传递给模型时使用
              。

            - `file_id: optional string`

              用作输入的已上传文件的 ID。

            - `filename: optional string`

              文件名，将文件以字符串形式传递给模型时使用
              。

          - `type: "file"`

            内容部分的类型。始终为 `file`.

            - `"file"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

    - `role: "user"`

      消息作者的角色，此处为 `user`.

      - `"user"`

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的不同参与者。

  - `ChatCompletionAssistantMessageParam object { role, audio, content, 4 more }`

    模型响应用户消息时发送的消息。

    - `role: "assistant"`

      消息作者的角色，此处为 `assistant`.

      - `"assistant"`

    - `audio: optional object { id }  or null`

      有关模型先前音频响应的数据。
      [了解更多](/api/docs/guides/audio).

      - `id: string`

        模型先前音频响应的唯一标识符。

    - `content: optional string or array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal or null`

      助手消息的内容。除非指定了 `tool_calls` 或 `function_call` ，否则为必填项。

      - `TextContent = string`

        助手消息的内容。

      - `ArrayOfContentParts = array of ChatCompletionContentPartText or ChatCompletionContentPartRefusal`

        由内容部分组成的数组，每个部分都有明确的类型。可以是以下一个或多个类型： `text`，或以下类型中的恰好一个： `refusal`.

        - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

          了解 [文本输入](/api/docs/guides/text).

        - `ChatCompletionContentPartRefusal object { refusal, type }`

          - `refusal: string`

            模型生成的拒绝消息。

          - `type: "refusal"`

            内容部分的类型。

            - `"refusal"`

    - `function_call: optional object { arguments, name }  or null`

      已弃用，由 `tool_calls`。取代。应调用的函数的名称和参数，由模型生成。

      - `arguments: string`

        调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

      - `name: string`

        要调用的函数名称。

    - `name: optional string`

      参与者的可选名称。为模型提供信息以区分相同角色的不同参与者。

    - `refusal: optional string or null`

      助手发出的拒绝消息。

    - `tool_calls: optional array of ChatCompletionMessageToolCall`

      模型生成的工具调用，例如函数调用。

      - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

        模型创建的对函数工具的调用。

        - `id: string`

          工具调用的 ID。

        - `function: object { arguments, name }`

          模型调用的函数。

          - `arguments: string`

            调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

          - `name: string`

            要调用的函数名称。

        - `type: "function"`

          工具的类型。目前，仅 `function` 类型。

          - `"function"`

      - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

        模型创建的对自定义工具的调用。

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

        由已定义类型组成的内容部分数组。对于工具消息，仅支持 type 为 `text` 类型。

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

    - `role: "tool"`

      消息作者的角色，此处为 `tool`.

      - `"tool"`

    - `tool_call_id: string`

      此消息正在响应的工具调用。

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

  模型创建的对函数工具的调用。

  - `ChatCompletionMessageFunctionToolCall object { id, function, type }`

    模型创建的对函数工具的调用。

    - `id: string`

      工具调用的 ID。

    - `function: object { arguments, name }`

      模型调用的函数。

      - `arguments: string`

        调用函数时使用的参数，由模型以 JSON 格式生成。请注意，模型并不总是生成有效的 JSON，并且可能会虚构你的函数 schema 中未定义的参数。在调用函数之前，请在代码中校验这些参数。

      - `name: string`

        要调用的函数名称。

    - `type: "function"`

      工具的类型。目前，仅 `function` 类型。

      - `"function"`

  - `ChatCompletionMessageCustomToolCall object { id, custom, type }`

    模型创建的对自定义工具的调用。

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

  静态预测输出内容，例如正在重新生成的文本文件内容
  重新生成的内容。

  - `content: string or array of ChatCompletionContentPartText`

    生成模型响应时应匹配的内容。
    如果生成的 token 会匹配该内容，那么整个模型响应
    可以更快地返回。

    - `TextContent = string`

      用于 Predicted Output 的内容。这通常是
      你重新生成的文件文本，仅做了少量修改。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      具有指定类型的内容部分数组。支持的可选项取决于用于生成响应的 [模型](/api/docs/models) 用于生成响应的内容。可以包含文本输入。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `type: "content"`

    你要提供的预测内容的类型。该类型
    当前始终为 `content`.

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

  流式响应的选项。仅当你设置 `stream: true`.

  - `include_obfuscation: optional boolean`

    为 true 时，将启用流式混淆。流式混淆会向流式增量事件的
    字段添加随机字符，以 `obfuscation` 流式增量事件的字段中，从而
    将载荷大小标准化，作为对某些侧信道攻击的缓解措施。
    默认情况下会包含这些混淆字段，但会给数据流带来少量
    开销。你可以将 `include_obfuscation` 设置为
    设为 false，以在信任你的应用与OpenAI API之间的网络链路时优化带宽，
    你的应用与该公司 接口。

  - `include_usage: optional boolean`

    如果设置此项，将在 `data: [DONE]`
    消息之前流式传输一个额外的数据块。该 `usage` 字段会显示整个请求的令牌用量统计信息，
    整个请求的令牌用量统计信息，而 `choices` 字段将始终是一个空
    数组。

    所有其他数据块也会包含一个 `usage` 字段，但其值为 null
    。 **注意：** 如果流被中断，你可能无法收到包含整个请求令牌总用量的
    最终用量数据块。

### Chat Completion System Message Param

- `ChatCompletionSystemMessageParam object { content, role, name }`

  开发者提供的指令，无论用户发送什么消息，模型都应遵循这些指令。对于 o1 及更新的模型，
  用户发送的消息。对于 o1 及更新的模型，请改用 `developer` 取代了之前的
  来实现此目的。

  - `content: string or array of ChatCompletionContentPartText`

    系统消息的内容。

    - `TextContent = string`

      系统消息的内容。

    - `ArrayOfContentParts = array of ChatCompletionContentPartText`

      具有指定类型的内容部分数组。对于系统消息，仅支持 type 为 `text` 类型。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `role: "system"`

    消息作者的角色，此处为 `system`.

    - `"system"`

  - `name: optional string`

    参与者的可选名称。为模型提供信息以区分相同角色的不同参与者。

### Chat Completion Token Logprob

- `ChatCompletionTokenLogprob object { token, bytes, logprob, top_logprobs }`

  - `token: string`

    token。

  - `bytes: array of number or null`

    表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

  - `logprob: number`

    如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

  - `top_logprobs: array of object { token, bytes, logprob }`

    在该 token 位置处最可能的 token 列表及其对数概率。条目数量可能少于所请求的 `top_logprobs`.

    - `token: string`

      token。

    - `bytes: array of number or null`

      表示 token 的 UTF-8 字节表示的整数列表。当一个字符由多个 token 表示，且必须将其字节表示合并才能生成正确的文本表示时，此字段很有用。可以为 `null` null，表示该 token 没有字节表示。

    - `logprob: number`

      如果该 token 位于最有可能的 20 个 token 之中，则为该 token 的对数概率。否则，该值为 `-9999.0` 用于表示该 token 出现的可能性极低。

### Chat Completion Tool

- `ChatCompletionTool = ChatCompletionFunctionTool or ChatCompletionCustomTool`

  可用于生成响应的函数工具。

  - `ChatCompletionFunctionTool object { function, type }`

    可用于生成响应的函数工具。

    - `function: FunctionDefinition`

      - `name: string`

        要调用的函数的名称。必须是 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

      - `description: optional string`

        函数功能的描述，供模型用于选择何时以及如何调用该函数。

      - `parameters: optional FunctionParameters`

        函数接受的参数，以 JSON Schema 对象形式描述。请参阅 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 了解该格式的相关文档。

        省略 `parameters` 会定义一个参数列表为空的函数。

      - `strict: optional boolean or null`

        生成函数调用时是否启用严格模式架构遵循。如果设为 true，模型将遵循 `parameters` 确切架构。当 strict 为 true 时，仅支持 JSON Schema 的 `strict` 一个子集。若要了解更多信息，请参阅 `true`。中定义的精确架构。详细了解 [函数调用指南](/api/docs/guides/function-calling).

    - `type: "function"`

      工具的类型。目前，仅 `function` 类型。

      - `"function"`

  - `ChatCompletionCustomTool object { custom, type }`

    使用指定格式处理输入的自定义工具。

    - `custom: object { name, description, format }`

      自定义工具的属性。

      - `name: string`

        自定义工具的名称，用于在工具调用中标识该工具。

      - `description: optional string`

        自定义工具的可选描述，用于提供更多上下文。

      - `format: optional Text { type }  or Grammar { grammar, type }`

        自定义工具的输入格式。默认为无约束文本。

        - `Text object { type }`

          无约束自由形式文本。

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

              语法定义的语法。必须是以下之一： `lark` 或 `regex`.

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
  `auto` 表示模型可以在生成消息与调用一个或多个工具之间进行选择。
  `required` 表示模型必须调用一个或多个工具。
  通过以下方式指定特定工具 `{"type": "function", "function": {"name": "my_function"}}` 会强制模型调用该工具。

  `none` 是未提供工具时的默认值。 `auto` 是提供工具时的默认值。

  - `ToolChoiceMode = "none" or "auto" or "required"`

    `none` 表示模型不会调用任何工具，而是生成一条消息。 `auto` 表示模型可以在生成消息与调用一个或多个工具之间进行选择。 `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ChatCompletionAllowedToolChoice object { allowed_tools, type }`

    将模型可用的工具限制为预先定义的集合。

    - `allowed_tools: ChatCompletionAllowedTools`

      将模型可用的工具限制为预先定义的集合。

      - `mode: "auto" or "required"`

        将模型可用的工具限制为预先定义的集合。

        `auto` 允许模型从允许的工具中进行选择并生成
        消息。

        `required` 要求模型调用一个或多个允许的工具。

        - `"auto"`

        - `"required"`

      - `tools: array of map[unknown]`

        允许模型调用的工具定义列表。

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

      由已定义类型组成的内容部分数组。对于工具消息，仅支持 type 为 `text` 类型。

      - `text: string`

        文本内容。

      - `type: "text"`

        内容部分的类型。

        - `"text"`

      - `prompt_cache_breakpoint: optional object { mode }`

        标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

        - `mode: "explicit"`

          断点模式。始终为 `explicit`.

          - `"explicit"`

  - `role: "tool"`

    消息作者的角色，此处为 `tool`.

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

      具有指定类型的内容部分数组。支持的可选项取决于用于生成响应的 [模型](/api/docs/models) ，可以包含文本、图像或音频输入。

      - `ChatCompletionContentPartText object { text, type, prompt_cache_breakpoint }`

        了解 [文本输入](/api/docs/guides/text).

        - `text: string`

          文本内容。

        - `type: "text"`

          内容部分的类型。

          - `"text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `ChatCompletionContentPartImage object { image_url, type, prompt_cache_breakpoint }`

        了解 [图像输入](/api/docs/guides/images-vision).

        - `image_url: object { url, detail }`

          - `url: string`

            图像的 URL 或 base64 编码的图像数据。

          - `detail: optional "auto" or "low" or "high" or "original"`

            指定图像的细节级别。在 [视觉指南](/api/docs/guides/images-vision#choose-an-image-detail-level).

            - `"auto"`

            - `"low"`

            - `"high"`

            - `"original"`

        - `type: "image_url"`

          内容部分的类型。

          - `"image_url"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

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

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `FileContentPart object { file, type, prompt_cache_breakpoint }`

        了解 [文件输入](/api/docs/guides/text) 用于文本生成。

        - `file: object { file_data, file_id, filename }`

          - `file_data: optional string`

            Base64 编码的文件数据，将文件以字符串形式传递给模型时使用
            。

          - `file_id: optional string`

            用作输入的已上传文件的 ID。

          - `filename: optional string`

            文件名，将文件以字符串形式传递给模型时使用
            。

        - `type: "file"`

          内容部分的类型。始终为 `file`.

          - `"file"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会四舍五入到 token 块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

  - `role: "user"`

    消息作者的角色，此处为 `user`.

    - `"user"`

  - `name: optional string`

    参与者的可选名称。为模型提供信息以区分相同角色的不同参与者。

# Messages

## 获取聊天消息

**get** `/chat/completions/{completion_id}/messages`

获取已存储聊天补全中的消息。仅返回使用
存储参数（store parameter）创建的 Chat `store` 参数方可被删除。 `true` 补全将被
返回。

### 路径参数

- `completion_id: string`

### 查询参数

- `after: optional string`

  上一次分页请求中最后一条消息的标识符。

- `limit: optional number`

  要检索的消息数量。

- `order: optional "asc" or "desc"`

  按时间戳排序消息的顺序。使用 `asc` 表示升序，或 `desc` 表示降序。默认值为 `asc`.

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of ChatCompletionStoreMessage`

  聊天补全消息对象数组。

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

  此对象的类型，始终为 "list"。

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
