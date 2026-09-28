> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## 取消评估运行

**post** `/evals/{eval_id}/runs/{run_id}`

取消正在运行的评估运行。

### 路径参数

- `eval_id: string`

- `run_id: string`

### 返回值

- `id: string`

  评估运行的唯一标识符。

- `created_at: number`

  评估运行创建时的 Unix 时间戳（以秒为单位）。

- `data_source: CreateEvalJSONLRunDataSource or CreateEvalCompletionsRunDataSource or object { source, type, input_messages, 2 more }`

  有关该运行数据源的信息。

  - `CreateEvalJSONLRunDataSource object { source, type }`

    一个 JsonlRunDataSource 对象，指定与该评估匹配的 JSONL 文件

    - `source: object { content, type }  or object { id, type }`

      确定填充数据源中 `item` 命名空间的内容。

      - `EvalJSONLFileContentSource object { content, type }`

        - `content: array of object { item, sample }`

          jsonl 文件的内容。

          - `item: map[unknown]`

          - `sample: optional map[unknown]`

        - `type: "file_content"`

          jsonl 源的类型。始终为 `file_content`.

          - `"file_content"`

      - `EvalJSONLFileIDSource object { id, type }`

        - `id: string`

          文件的标识符。

        - `type: "file_id"`

          jsonl 源的类型。始终为 `file_id`.

          - `"file_id"`

    - `type: "jsonl"`

      数据源的类型。始终为 `jsonl`.

      - `"jsonl"`

  - `CreateEvalCompletionsRunDataSource object { source, type, input_messages, 2 more }`

    一个 CompletionsRunDataSource 对象，用于描述模型采样配置。

    - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 3 more }`

      确定填充数据源中 `item` 该运行数据源中的命名空间。

      - `EvalJSONLFileContentSource object { content, type }`

        - `content: array of object { item, sample }`

          jsonl 文件的内容。

          - `item: map[unknown]`

          - `sample: optional map[unknown]`

        - `type: "file_content"`

          jsonl 源的类型。始终为 `file_content`.

          - `"file_content"`

      - `EvalJSONLFileIDSource object { id, type }`

        - `id: string`

          文件的标识符。

        - `type: "file_id"`

          jsonl 源的类型。始终为 `file_id`.

          - `"file_id"`

      - `StoredCompletionsRunDataSource object { type, created_after, created_before, 3 more }`

        描述一组过滤条件的 StoredCompletionsRunDataSource 配置

        - `type: "stored_completions"`

          源的类型。始终为 `stored_completions`.

          - `"stored_completions"`

        - `created_after: optional number or null`

          可选的 Unix 时间戳，用于筛选在此时间之后创建的项。

        - `created_before: optional number or null`

          可选的 Unix 时间戳，用于筛选在此时间之前创建的项。

        - `limit: optional number or null`

          可选的要返回的最大项数。

        - `metadata: optional Metadata or null`

          可以附加到对象的 16 组键值对。可用于
          以结构化格式存储对象的附加信息，
          并通过 API 或控制台查询对象。

          键为字符串，最大长度为 64 个字符。值为字符串
          ，最大长度为 512 个字符。

        - `model: optional string or null`

          用于筛选的可选模型（例如 'gpt-6-astra'）。

    - `type: "completions"`

      运行数据源的类型。始终为 `completions`.

      - `"completions"`

    - `input_messages: optional object { template, type }  or object { item_reference, type }`

      在对模型进行采样时使用。决定传入模型的消息结构。可以引用预构建的轨迹（即， `item.input_trajectory`），也可以是带有对 `item` 命名空间变量引用的模板。

      - `TemplateInputMessages object { template, type }`

        - `template: array of EasyInputMessage or object { content, role, type }`

          构成提示或上下文的聊天消息列表。可以包含对 `item` 命名空间的变量引用，例如 {{item.name}}。

          - `EasyInputMessage object { content, role, phase, type }`

            输入到模型的消息，其角色用于指示指令遵循
            的层级关系。使用 `developer` 或 `system` 角色提供的指令优先于使用
            角色提供的指令。具有 `user` 角色的消息被假定为模型在之前
            `assistant` 的交互中生成的消息。
            交互。

            - `content: string or ResponseInputMessageContentList`

              输入到模型的文本、图像或音频，用于生成响应。
              也可以包含之前的助手响应。

              - `TextInput = string`

                输入到模型的文本。

              - `ResponseInputMessageContentList = array of ResponseInputContent`

                一个包含一项或多项内容的输入项列表，发送给模型，包含不同的内容
                类型。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                  - `text: string`

                    发送给模型的文本输入。

                  - `type: "input_text"`

                    输入项的类型。始终为 `input_text`.

                    - `"input_text"`

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

                - `ResponseInputImage object { detail, type, file_id, 2 more }`

                  发送给模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

                  - `detail: ImageDetail`

                    发送给模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

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

                    标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

                - `ResponseInputFile object { type, detail, file_data, 4 more }`

                  发送给模型的文件输入。

                  - `type: "input_file"`

                    输入项的类型。始终为 `input_file`.

                    - `"input_file"`

                  - `detail: optional "auto" or "low" or "high"`

                    发送给模型的文件细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 使用量。使用 `low` 以获得更低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

                    标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

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

              将 `assistant` 消息标记为中间评论（`commentary`）或最终答案（`final_answer`).
              对于像 `gpt-5.3-codex` 及更高版本的模型，在发送后续请求时，请保留并重新发送所有助手消息上的
              阶段——删除它可能导致性能下降。不适用于用户消息。

              - `"commentary"`

              - `"final_answer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

          - `EvalMessageObject object { content, role, type }`

            输入到模型的消息，其角色用于指示指令遵循
            的层级关系。使用 `developer` 或 `system` 角色提供的指令优先于使用
            角色提供的指令。具有 `user` 角色的消息被假定为模型在之前
            `assistant` 的交互中生成的消息。
            交互。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入——可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项的数组。

              - `TextInput = string`

                输入到模型的文本。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                输入到模型的文本。

              - `OutputText object { text, type }`

                模型的文本输出。

                - `text: string`

                  模型的文本输出内容。

                - `type: "output_text"`

                  输出文本的类型。始终为 `output_text`.

                  - `"output_text"`

              - `InputImage object { image_url, type, detail }`

                在 EvalItem 内容数组中使用的图像输入块。

                - `image_url: string`

                  图像输入的 URL。

                - `type: "input_image"`

                  图像输入的类型。始终为 `input_image`.

                  - `"input_image"`

                - `detail: optional string`

                  发送给模型的图像细节级别。可选值为 `high`, `low`，或 `auto`。默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                模型的音频输入。

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64 编码的音频数据。

                  - `format: "mp3" or "wav"`

                    音频数据的格式。目前支持的格式有 `mp3` 和
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  输入项的类型。始终为 `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，其中每个元素可以是输入文本、输出文本、输入
                图像或输入音频对象。

                - `TextInput = string`

                  输入到模型的文本。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  输入到模型的文本。

                - `OutputText object { text, type }`

                  模型的文本输出。

                  - `text: string`

                    模型的文本输出内容。

                  - `type: "output_text"`

                    输出文本的类型。始终为 `output_text`.

                    - `"output_text"`

                - `InputImage object { image_url, type, detail }`

                  在 EvalItem 内容数组中使用的图像输入块。

                  - `image_url: string`

                    图像输入的 URL。

                  - `type: "input_image"`

                    图像输入的类型。始终为 `input_image`.

                    - `"input_image"`

                  - `detail: optional string`

                    发送给模型的图像细节级别。可选值为 `high`, `low`，或 `auto`。默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  模型的音频输入。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。可选值为 `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

        - `type: "template"`

          输入消息的类型。始终为 `template`.

          - `"template"`

      - `ItemReferenceInputMessages object { item_reference, type }`

        - `item_reference: string`

          对 `item` 命名空间中某个变量的引用。例如 "item.input_trajectory"

        - `type: "item_reference"`

          输入消息的类型。始终为 `item_reference`.

          - `"item_reference"`

    - `model: optional string`

      用于生成补全的模型名称（例如 "o3-mini"）。

    - `sampling_params: optional object { max_completion_tokens, reasoning_effort, response_format, 4 more }`

      - `max_completion_tokens: optional number`

        生成输出中的最大 token 数。

      - `reasoning_effort: optional ReasoningEffort or null`

        约束推理模型在推理上的投入程度。目前支持
        取值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
        降低推理力度可以带来更快的响应和更少的
        用于推理的 token。并非所有推理模型都支持每个
        取值。请参阅
        [推理指南](/api/docs/guides/reasoning)
        了解模型支持情况。

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
        Structured Outputs，用于确保模型会匹配你提供的 JSON
        schema（数据模式）。有关详细信息，请参阅 [Structured Outputs
        指南](/api/docs/guides/structured-outputs).

        设置为 `{ "type": "json_object" }` 启用较旧的 JSON 模式，该模式可
        确保模型生成的消息是有效的 JSON。对于支持它的模型，首选使用 `json_schema`
        是更推荐的做法。

        - `ResponseFormatText object { type }`

          默认响应格式。用于生成文本响应。

          - `type: "text"`

            正在定义的响应格式的类型。始终为 `text`.

            - `"text"`

        - `ResponseFormatJSONSchema object { json_schema, type }`

          JSON Schema 响应格式。用于生成结构化 JSON 响应。
          了解更多关于 [Structured Outputs](/api/docs/guides/structured-outputs).

          - `json_schema: object { name, description, schema, strict }`

            Structured Outputs 配置选项，包括 JSON Schema。

            - `name: string`

              响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
              下划线和短划线，最大长度为 64。

            - `description: optional string`

              对响应格式用途的描述，供模型用来
              确定如何按该格式进行响应。

            - `schema: optional map[unknown]`

              响应格式的 schema，以 JSON Schema 对象描述。
              了解如何构建 JSON schema [请参见此处](https://json-schema.org/).

            - `strict: optional boolean or null`

              是否在生成输出时启用严格的 schema 遵从。
              若设置为 true，模型将始终遵循所定义的确切架构。
              字段，仅支持 JSON Schema 的一个子集，当 `schema` 字段，仅支持 JSON Schema 的一个子集，当
              `strict` 为 `true`。时，了解更多信息请参阅 [Structured Outputs
              指南](/api/docs/guides/structured-outputs).

          - `type: "json_schema"`

            正在定义的响应格式的类型。始终为 `json_schema`.

            - `"json_schema"`

        - `ResponseFormatJSONObject object { type }`

          JSON 对象响应格式。生成 JSON 响应的较旧方法。
          对于支持 `json_schema` 的模型，建议使用它。请注意，
          模型在没有系统或用户消息指示的情况下不会生成 JSON。
          这样做。

          - `type: "json_object"`

            正在定义的响应格式的类型。始终为 `json_object`.

            - `"json_object"`

      - `seed: optional number`

        用于在采样过程中初始化随机性的种子值。

      - `temperature: optional number`

        较高的 temperature 会增加输出的随机性。

      - `tools: optional array of ChatCompletionFunctionTool`

        模型可以调用的工具列表。目前，作为工具仅支持函数。使用它可以提供模型可能为其生成 JSON 输入的函数列表，最多支持 128 个函数。

        - `function: FunctionDefinition`

          - `name: string`

            要调用的函数名称。必须为 a-z、A-Z、0-9 或包含下划线和连字符，最大长度为 64。

          - `description: optional string`

            函数用途的描述，模型据此决定何时以及如何调用该函数。

          - `parameters: optional FunctionParameters`

            函数接受的参数，以 JSON Schema 对象描述。请参阅 [指南](/api/docs/guides/function-calling) 中的示例，以及 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) ，查阅有关该格式的文档。

            省略 `parameters` 定义一个空参数列表的函数。

          - `strict: optional boolean or null`

            是否在生成函数调用时启用严格的模式遵循。如果设置为 true，模型将遵循 `parameters` 字段，仅支持 JSON Schema 的一个子集，当 `strict` 为 `true`。中定义的确切模式。详细了解结构化输出，请参阅 [函数调用指南](/api/docs/guides/function-calling).

        - `type: "function"`

          工具的类型。目前仅支持 `function` 。

          - `"function"`

      - `top_p: optional number`

        温度采样的替代方案，用于核心采样；1.0 表示包含所有 token。

  - `ResponsesRunDataSource object { source, type, input_messages, 2 more }`

    描述模型采样配置的 ResponsesRunDataSource 对象。

    - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 8 more }`

      确定填充数据源中 `item` 该运行数据源中的命名空间。

      - `EvalJSONLFileContentSource object { content, type }`

        - `content: array of object { item, sample }`

          jsonl 文件的内容。

          - `item: map[unknown]`

          - `sample: optional map[unknown]`

        - `type: "file_content"`

          jsonl 源的类型。始终为 `file_content`.

          - `"file_content"`

      - `EvalJSONLFileIDSource object { id, type }`

        - `id: string`

          文件的标识符。

        - `type: "file_id"`

          jsonl 源的类型。始终为 `file_id`.

          - `"file_id"`

      - `EvalResponsesSource object { type, created_after, created_before, 8 more }`

        描述运行数据源配置的 EvalResponsesSource 对象。

        - `type: "responses"`

          运行数据源的类型。始终为 `responses`.

          - `"responses"`

        - `created_after: optional number or null`

          仅包含此时间戳之后（含）创建的项。这是一个用于筛选响应的查询参数。

        - `created_before: optional number or null`

          仅包含此时间戳之前（含）创建的项。这是一个用于筛选响应的查询参数。

        - `instructions_search: optional string or null`

          用于搜索“instructions”字段的可选字符串。这是一个用于筛选响应的查询参数。

        - `metadata: optional unknown or null`

          响应的元数据过滤器。这是一个用于筛选响应的查询参数。

        - `model: optional string or null`

          用于查找响应的模型名称。这是一个用于筛选响应的查询参数。

        - `reasoning_effort: optional ReasoningEffort or null`

          约束推理模型在推理上的投入程度。目前支持
          取值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理力度可以带来更快的响应和更少的
          用于推理的 token。并非所有推理模型都支持每个
          取值。请参阅
          [推理指南](/api/docs/guides/reasoning)
          了解模型支持情况。

        - `temperature: optional number or null`

          采样温度。这是一个用于筛选响应的查询参数。

        - `tools: optional array of string or null`

          工具名称列表。这是一个用于筛选响应的查询参数。

        - `top_p: optional number or null`

          核心采样参数。这是一个用于筛选响应的查询参数。

        - `users: optional array of string or null`

          用户标识符列表。这是一个用于筛选响应的查询参数。

    - `type: "responses"`

      运行数据源的类型。始终为 `responses`.

      - `"responses"`

    - `input_messages: optional object { template, type }  or object { item_reference, type }`

      在对模型进行采样时使用。决定传入模型的消息结构。可以引用预构建的轨迹（即， `item.input_trajectory`），也可以是带有对 `item` 命名空间变量引用的模板。

      - `InputMessagesTemplate object { template, type }`

        - `template: array of object { content, role }  or object { content, role, type }`

          构成提示或上下文的聊天消息列表。可以包含对 `item` 命名空间的变量引用，例如 {{item.name}}。

          - `ChatMessage object { content, role }`

            - `content: string`

              消息的内容。

            - `role: string`

              消息的角色（例如 "system"、"assistant"、"user"）。

          - `EvalMessageObject object { content, role, type }`

            输入到模型的消息，其角色用于指示指令遵循
            的层级关系。使用 `developer` 或 `system` 角色提供的指令优先于使用
            角色提供的指令。具有 `user` 角色的消息被假定为模型在之前
            `assistant` 的交互中生成的消息。
            交互。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入——可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项，也可以是项的数组。

              - `TextInput = string`

                输入到模型的文本。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                输入到模型的文本。

              - `OutputText object { text, type }`

                模型的文本输出。

                - `text: string`

                  模型的文本输出内容。

                - `type: "output_text"`

                  输出文本的类型。始终为 `output_text`.

                  - `"output_text"`

              - `InputImage object { image_url, type, detail }`

                在 EvalItem 内容数组中使用的图像输入块。

                - `image_url: string`

                  图像输入的 URL。

                - `type: "input_image"`

                  图像输入的类型。始终为 `input_image`.

                  - `"input_image"`

                - `detail: optional string`

                  发送给模型的图像细节级别。可选值为 `high`, `low`，或 `auto`。默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                模型的音频输入。

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，其中每个元素可以是输入文本、输出文本、输入
                图像或输入音频对象。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。可选值为 `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

        - `type: "template"`

          输入消息的类型。始终为 `template`.

          - `"template"`

      - `InputMessagesItemReference object { item_reference, type }`

        - `item_reference: string`

          对 `item` 命名空间。即 "item.name"

        - `type: "item_reference"`

          输入消息的类型。始终为 `item_reference`.

          - `"item_reference"`

    - `model: optional string`

      用于生成补全的模型名称（例如 "o3-mini"）。

    - `sampling_params: optional object { max_completion_tokens, reasoning_effort, seed, 4 more }`

      - `max_completion_tokens: optional number`

        生成输出中的最大 token 数。

      - `reasoning_effort: optional ReasoningEffort or null`

        约束推理模型在推理上的投入程度。目前支持
        取值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
        降低推理力度可以带来更快的响应和更少的
        用于推理的 token。并非所有推理模型都支持每个
        取值。请参阅
        [推理指南](/api/docs/guides/reasoning)
        了解模型支持情况。

      - `seed: optional number`

        用于在采样过程中初始化随机性的种子值。

      - `temperature: optional number`

        较高的 temperature 会增加输出的随机性。

      - `text: optional object { format }`

        模型文本响应的配置选项。可以是纯
        文本或结构化 JSON 数据。了解更多：

        - [文本输入和输出](/api/docs/guides/text)
        - [结构化输出](/api/docs/guides/structured-outputs)

        - `format: optional ResponseFormatTextConfig`

          用于指定模型必须输出的格式的对象。

          配置 `{ "type": "json_schema" }` 启用结构化输出，
          可确保模型匹配你提供的 JSON schema。详见
          [结构化输出指南](/api/docs/guides/structured-outputs).

          默认格式为 `{ "type": "text" }` ，无其他选项。

          **不推荐用于 gpt-4o 及更新的模型：**

          设置为 `{ "type": "json_object" }` 启用较旧的 JSON 模式，该模式可
          确保模型生成的消息是有效的 JSON。对于支持它的模型，首选使用 `json_schema`
          是更推荐的做法。

          - `ResponseFormatText object { type }`

            默认响应格式。用于生成文本响应。

          - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

            JSON Schema 响应格式。用于生成结构化 JSON 响应。
            了解更多关于 [Structured Outputs](/api/docs/guides/structured-outputs).

            - `name: string`

              响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
              下划线和短划线，最大长度为 64。

            - `schema: map[unknown]`

              响应格式的 schema，以 JSON Schema 对象描述。
              了解如何构建 JSON schema [请参见此处](https://json-schema.org/).

            - `type: "json_schema"`

              正在定义的响应格式的类型。始终为 `json_schema`.

              - `"json_schema"`

            - `description: optional string`

              对响应格式用途的描述，供模型用来
              确定如何按该格式进行响应。

            - `strict: optional boolean or null`

              是否在生成输出时启用严格的 schema 遵从。
              若设置为 true，模型将始终遵循所定义的确切架构。
              字段，仅支持 JSON Schema 的一个子集，当 `schema` 字段，仅支持 JSON Schema 的一个子集，当
              `strict` 为 `true`。时，了解更多信息请参阅 [Structured Outputs
              指南](/api/docs/guides/structured-outputs).

          - `ResponseFormatJSONObject object { type }`

            JSON 对象响应格式。生成 JSON 响应的较旧方法。
            对于支持 `json_schema` 的模型，建议使用它。请注意，
            模型在没有系统或用户消息指示的情况下不会生成 JSON。
            这样做。

      - `tools: optional array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        模型在生成响应时可以调用的工具数组。你可以
        通过设置 `tool_choice` 参数来指定使用的工具。

        你可以提供给模型的工具分为两类：

        - **内置工具**：由 OpenAI 提供的工具，用于扩展
          模型的能力，例如 [网页搜索](/api/docs/guides/tools-web-search)
          或 [文件搜索](/api/docs/guides/tools-file-search)。详细了解
          [内置工具](/api/docs/guides/tools).
        - **函数调用（自定义工具）**：由你定义的函数，
          使模型能够调用你自己的代码。详细了解
          [函数调用](/api/docs/guides/function-calling).

        - `Function object { name, parameters, strict, 6 more }`

          定义你自己代码中模型可以选择调用的函数。详细了解 [函数调用](/api/docs/guides/function-calling).

          - `name: string`

            要调用的函数名称。

          - `parameters: map[unknown] or null`

            描述该函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否对此函数工具强制执行严格的参数校验。

          - `type: "function"`

            函数工具的类型，恒为 `function`.

            - `"function"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

          - `defer_loading: optional boolean`

            此函数是否被延迟加载，并通过工具搜索加载。

          - `description: optional string or null`

            函数的描述，由模型用于判断是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 工具](/api/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索 工具的类型，恒为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的过滤器。

            - `ComparisonFilter object { key, type, value }`

              用于将指定的属性键与给定值使用定义的比较运算进行比较的过滤器。

              - `key: string`

                用于与值进行比较的键。

              - `type: "eq" or "ne" or "gt" or 5 more`

                指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

                - `eq`：等于
                - `ne`：不等于
                - `gt`：大于
                - `gte`：大于等于
                - `lt`：小于
                - `lte`：小于等于
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

                用于与属性键进行比较的值；支持字符串、数字或布尔类型。

                - `string`

                - `number`

                - `boolean`

                - `array of string or number`

                  - `string`

                  - `number`

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个过滤器 `and` 或 `or`.

              - `filters: array of ComparisonFilter or CompoundFilter`

                要组合的过滤器数组。其中的项可以是 `ComparisonFilter` 或 `CompoundFilter`.

                - `ComparisonFilter object { key, type, value }`

                  用于将指定的属性键与给定值使用定义的比较运算进行比较的过滤器。

                - `CompoundFilter object { filters, type }`

                  使用以下方式组合多个过滤器 `and` 或 `or`.

              - `type: "and" or "or"`

                运算类型： `and` 或 `or`.

                - `"and"`

                - `"or"`

          - `max_num_results: optional number`

            要返回的最大结果数。该数值应在 1 到 50 之间（含两端）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              用于在启用混合搜索时，控制倒数排名融合在语义嵌入匹配与稀疏关键词匹配之间平衡程度的权重。

              - `embedding_weight: number`

                嵌入在倒数排名融合中的权重。

              - `text_weight: number`

                倒数排名融合中文本的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，介于 0 和 1 之间的数值。数值越接近 1，尝试仅返回最相关的结果，但返回的结果数量可能会减少。

        - `Computer object { type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer tool](/api/docs/guides/tools-computer-use).

          - `type: "computer"`

            computer 工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer tool](/api/docs/guides/tools-computer-use).

          - `display_height: number`

            计算机显示器的高度。

          - `display_width: number`

            计算机显示器的宽度。

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

          在互联网上搜索与提示相关的来源。了解更多关于
          [网页搜索 工具](/api/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。可选值为 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许 网页搜索 进行实时互联网访问。省略时默认为 true。当值为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的过滤条件。

            - `allowed_domains: optional array of string or null`

              搜索所允许的域名。如果未提供，则允许所有域名。
              同时允许所提供域名的子域名。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间使用量的高级指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。如果省略或为 null，则默认为
            美国。若要避免该回退，请传入 `{"type": "approximate"}` 时不带
            字段。若要本地化结果，请提供相应的 location 字段。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似类型，始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          允许模型通过远程 Model Context Protocol
          （MCP）服务器访问更多工具。 [详细了解 MCP](/api/docs/guides/tools-connectors-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型，始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或是只读的。如果某个
                MCP 服务器 [被标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可与自定义 MCP 服务器 URL
            或服务连接器配合使用。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的连接器。其中的某一项
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。了解更多
            关于服务连接器的信息 [请参见此处](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段对于 2026 年 9 月 1 日之后发布的模型已弃用。
            使用 `server_url` 连接到远程 MCP 服务器，或使用 `tunnel_id` 通过
            通过安全 MCP 隧道进行连接。

            当前支持的 `connector_id` 值为：

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

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是只读的。如果某个
                  MCP 服务器 [被标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或是只读的。如果某个
                  MCP 服务器 [被标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              Specify a single approval policy for all tools. One of `always` 或
              `never`. When set to `always`, all tools will require approval. When
              set to `never`, all tools will not require approval.

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            Optional description of the MCP server, used to provide more context.

          - `server_url: optional string`

            The URL for the MCP server. One of `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            要使用的安全 MCP 隧道 ID，用来替代直接的服务端 URL。二选一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `CodeInterpreter object { container, type, allowed_callers }`

          一个用于运行 Python 代码以帮助生成对提示词回应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID，也可以是一个用于
            指定可供你的代码使用的已上传文件 ID，以及一个
            可选的 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择性地指定要对其运行代码的文件 ID。

              - `type: "auto"`

                始终 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                一个可选的上传文件列表，供你的代码使用。

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

                    禁用出站网络访问。始终为 `disabled`.

                    - `"disabled"`

                - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

                  - `allowed_domains: array of string`

                    当 type 为 `allowlist`.

                  - `type: "allowlist"`

                    仅允许向指定域发出站网络访问。始终为 `allowlist`.

                    - `"allowlist"`

                  - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                    针对允许列表中域的可选域范围密钥。

                    - `domain: string`

                      与密钥关联的域。

                    - `name: string`

                      要为该域注入的密钥名称。

                    - `value: string`

                      要为该域注入的密钥值。

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

            是生成新图像还是编辑现有图像。默认值： `auto`.

            - `"generate"`

            - `"edit"`

            - `"auto"`

          - `background: optional "transparent" or "opaque" or "auto"`

            设置生成图像的背景。可选值为 `transparent`, `opaque`,
            或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
            其 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
            背景。受支持的 GPT 图像模型可使用透明背景。对于
            模型，此支持处于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，该支持处于预览阶段。使用
            时，将输出格式设置为 `transparent`，时，将输出格式设置为 `png` 或 `webp`.
            默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所投入的精力。此参数仅在 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型中受支持，在 `gpt-image-1-mini`。中不受支持。支持 `high` 和 `low`。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于修复的可选蒙版。包含 `image_url`
            （字符串，可选）和 `file_id` (string, optional).

            - `file_id: optional string`

              遮罩图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的遮罩图像。

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

            生成图像的审核级别。默认值： `auto`.

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

            在流式模式下生成的部分图像数量，范围从 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or 3 more`

            生成图像的质量。GPT 图像模型支持 `low`,
            `medium`，以及 `high`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`,
            ，包括其 `2026-09-08` 快照，也支持 `xhigh` 和 `max`.
            默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

            - `"max"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以 `WIDTHxHEIGHT` 字符串形式指定任意分辨率，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性，最大支持的分辨率为 `3840x2160`。所请求的尺寸也必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 受允许自动调整尺寸的模型支持。对于 `dall-e-2`，请使用 `256x256`, `512x512`，或 `1024x1024`。如需 `dall-e-3`，请使用 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以 `WIDTHxHEIGHT` 字符串形式指定任意分辨率，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性，最大支持的分辨率为 `3840x2160`。所请求的尺寸也必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 受允许自动调整尺寸的模型支持。对于 `dall-e-2`，请使用 `256x256`, `512x512`，或 `1024x1024`。如需 `dall-e-3`，请使用 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

                自动为本次请求创建一个容器

                - `"container_auto"`

              - `file_ids: optional array of string`

                一个可选的上传文件列表，供你的代码使用。

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

                    可选的技能版本。使用正整数或“latest”。省略则使用默认值。

                - `InlineSkill object { description, name, source, type }`

                  - `description: string`

                    技能的描述。

                  - `name: string`

                    技能的名称。

                  - `source: InlineSkillSource`

                    内联技能负载

                    - `data: string`

                      Base64 编码的技能 zip 包。

                    - `media_type: "application/zip"`

                      内联技能负载的媒体类型。必须为 `application/zip`.

                      - `"application/zip"`

                    - `type: "base64"`

                      内联技能来源的类型。必须为 `base64`.

                      - `"base64"`

                  - `type: "inline"`

                    为本次请求定义一个内联技能。

                    - `"inline"`

            - `LocalEnvironment object { type, skills }`

              - `type: "local"`

                使用本地计算机环境。

                - `"local"`

              - `skills: optional array of LocalSkill`

                可选的技能列表。

                - `description: string`

                  技能的描述。

                - `name: string`

                  技能的名称。

                - `path: string`

                  包含该技能的目录路径。

            - `ContainerReference object { container_id, type }`

              - `container_id: string`

                所引用的容器的 ID。

              - `type: "container_reference"`

                引用通过 /v1/containers 端点创建的容器

                - `"container_reference"`

        - `Custom object { name, type, allowed_callers, 4 more }`

          使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

          - `name: string`

            自定义工具的名称，用于在工具调用中标识它。

          - `type: "custom"`

            自定义工具的类型。始终为 `custom`.

            - `"custom"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

            工具响应是否可以异步返回，还是在下次创建响应时立即返回。

          - `defer_loading: optional boolean`

            此工具是否应延迟，并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认为无约束文本。

            - `Text object { type }`

              无约束的自由格式文本。

              - `type: "text"`

                无约束文本格式。始终为 `text`.

                - `"text"`

            - `Grammar object { definition, syntax, type }`

              由用户定义的语法。

              - `definition: string`

                语法定义。

              - `syntax: "lark" or "regex"`

                语法定义的语法格式。可选值为 `lark` 或 `regex`.

                - `"lark"`

                - `"regex"`

              - `type: "grammar"`

                语法格式。始终为 `grammar`.

                - `"grammar"`

        - `Namespace object { description, name, tools, type }`

          将函数/自定义工具归入共享命名空间。

          - `description: string`

            展示给模型的命名空间描述。

          - `name: string`

            工具调用中使用的命名空间名称（例如， `crm`).

          - `tools: array of object { name, type, allowed_callers, 6 more }  or object { name, type, allowed_callers, 4 more }`

            此命名空间内可用的函数/自定义工具。

            - `Function object { name, type, allowed_callers, 6 more }`

              - `name: string`

              - `type: "function"`

                - `"function"`

              - `allowed_callers: optional array of "direct" or "programmatic" or null`

                工具调用上下文。

                - `"direct"`

                - `"programmatic"`

              - `async: optional boolean`

                工具响应是否可以异步返回，还是在下次创建响应时立即返回。

              - `defer_loading: optional boolean`

                是否应将此函数延迟并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                描述此函数工具字符串输出中所编码 JSON 值的 JSON Schema。这并不描述 content-array 输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。若省略，Responses 会尝试在 schema 兼容时使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 4 more }`

              使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/api/docs/guides/function-calling#custom-tools)

              - `name: string`

                自定义工具的名称，用于在工具调用中标识它。

              - `type: "custom"`

                自定义工具的类型。始终为 `custom`.

                - `"custom"`

              - `allowed_callers: optional array of "direct" or "programmatic" or null`

                工具调用上下文。

                - `"direct"`

                - `"programmatic"`

              - `async: optional boolean`

                工具响应是否可以异步返回，还是在下次创建响应时立即返回。

              - `defer_loading: optional boolean`

                此工具是否应延迟，并通过工具搜索发现。

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

            向模型展示的、用于客户端执行的工具搜索工具描述。

          - `execution: optional "server" or "client"`

            工具搜索由服务端还是客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具可在网页中搜索与响应相关的结果。详细了解 [网页搜索 工具](/api/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。可选值为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间使用量的高级指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户的大致位置。若省略或为 null，则默认为美国。若要避免该回退，请传入 `{"type": "approximate"}` 时不包含 location 字段。若要本地化结果，请提供相应的 location 字段。

            - `type: "approximate"`

              位置近似类型，始终为 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

        - `ApplyPatch object { type, allowed_callers }`

          允许助手使用统一差异格式创建、删除或更新文件。

          - `type: "apply_patch"`

            工具的类型。始终为 `apply_patch`.

            - `"apply_patch"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

      - `top_p: optional number`

        温度采样的替代方案，用于核心采样；1.0 表示包含所有 token。

- `error: EvalAPIError`

  表示来自 Eval API 错误响应的对象。

  - `code: string`

    错误代码。

  - `message: string`

    错误消息。

- `eval_id: string`

  关联评估的标识符。

- `metadata: Metadata or null`

  可以附加到对象的 16 组键值对。可用于
  以结构化格式存储对象的附加信息，
  并通过 API 或控制台查询对象。

  键为字符串，最大长度为 64 个字符。值为字符串
  ，最大长度为 512 个字符。

- `model: string`

  被评估的模型（如果适用）。

- `name: string`

  评估运行的名称。

- `object: "eval.run"`

  对象的类型。始终为 "eval.run"。

  - `"eval.run"`

- `per_model_usage: array of object { cached_tokens, completion_tokens, invocation_count, 3 more }`

  评估运行期间每个模型的使用统计信息。

  - `cached_tokens: number`

    从缓存中检索到的 token 数量。

  - `completion_tokens: number`

    生成的完成 token 数量。

  - `invocation_count: number`

    调用次数。

  - `model_name: string`

    模型的名称。

  - `prompt_tokens: number`

    使用的提示 token 数量。

  - `total_tokens: number`

    使用的 token 总数。

- `per_testing_criteria_results: array of object { failed, passed, testing_criteria }`

  评估运行期间应用的每个测试条件的结果。

  - `failed: number`

    此条件未通过的测试数量。

  - `passed: number`

    此条件通过的测试数量。

  - `testing_criteria: string`

    测试条件的描述。

- `report_url: string`

  指向 UI 仪表板上已渲染评估运行报告的 URL。

- `result_counts: object { errored, failed, passed, total }`

  汇总评估运行结果的计数器。

  - `errored: number`

    产生错误的输出项数量。

  - `failed: number`

    未通过评估的输出项数量。

  - `passed: number`

    通过评估的输出项数量。

  - `total: number`

    已执行的输出项总数。

- `status: string`

  评估运行的状态。

### 示例

```http
curl https://api.openai.com/v1/evals/$EVAL_ID/runs/$RUN_ID \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "data_source": {
    "source": {
      "content": [
        {
          "item": {
            "foo": "bar"
          },
          "sample": {
            "foo": "bar"
          }
        }
      ],
      "type": "file_content"
    },
    "type": "jsonl"
  },
  "error": {
    "code": "code",
    "message": "message"
  },
  "eval_id": "eval_id",
  "metadata": {
    "foo": "string"
  },
  "model": "model",
  "name": "name",
  "object": "eval.run",
  "per_model_usage": [
    {
      "cached_tokens": 0,
      "completion_tokens": 0,
      "invocation_count": 0,
      "model_name": "model_name",
      "prompt_tokens": 0,
      "total_tokens": 0
    }
  ],
  "per_testing_criteria_results": [
    {
      "failed": 0,
      "passed": 0,
      "testing_criteria": "testing_criteria"
    }
  ],
  "report_url": "https://example.com",
  "result_counts": {
    "errored": 0,
    "failed": 0,
    "passed": 0,
    "total": 0
  },
  "status": "status"
}
```

### 示例

```http
curl https://api.openai.com/v1/evals/eval_67abd54d9b0081909a86353f6fb9317a/runs/evalrun_67abd54d60ec8190832b46859da808f7/cancel \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### 响应

```json
{
  "object": "eval.run",
  "id": "evalrun_67abd54d60ec8190832b46859da808f7",
  "eval_id": "eval_67abd54d9b0081909a86353f6fb9317a",
  "report_url": "https://platform.openai.com/evaluations/eval_67abd54d9b0081909a86353f6fb9317a?run_id=evalrun_67abd54d60ec8190832b46859da808f7",
  "status": "canceled",
  "model": "gpt-6-astra",
  "name": "gpt-6-astra",
  "created_at": 1743092069,
  "result_counts": {
    "total": 0,
    "errored": 0,
    "failed": 0,
    "passed": 0
  },
  "per_model_usage": null,
  "per_testing_criteria_results": null,
  "data_source": {
    "type": "completions",
    "source": {
      "type": "file_content",
      "content": [
        {
          "item": {
            "input": "Tech Company Launches Advanced Artificial Intelligence Platform",
            "ground_truth": "Technology"
          }
        },
        {
          "item": {
            "input": "Central Bank Increases Interest Rates Amid Inflation Concerns",
            "ground_truth": "Markets"
          }
        },
        {
          "item": {
            "input": "International Summit Addresses Climate Change Strategies",
            "ground_truth": "World"
          }
        },
        {
          "item": {
            "input": "Major Retailer Reports Record-Breaking Holiday Sales",
            "ground_truth": "Business"
          }
        },
        {
          "item": {
            "input": "National Team Qualifies for World Championship Finals",
            "ground_truth": "Sports"
          }
        },
        {
          "item": {
            "input": "Stock Markets Rally After Positive Economic Data Released",
            "ground_truth": "Markets"
          }
        },
        {
          "item": {
            "input": "Global Manufacturer Announces Merger with Competitor",
            "ground_truth": "Business"
          }
        },
        {
          "item": {
            "input": "Breakthrough in Renewable Energy Technology Unveiled",
            "ground_truth": "Technology"
          }
        },
        {
          "item": {
            "input": "World Leaders Sign Historic Climate Agreement",
            "ground_truth": "World"
          }
        },
        {
          "item": {
            "input": "Professional Athlete Sets New Record in Championship Event",
            "ground_truth": "Sports"
          }
        },
        {
          "item": {
            "input": "Financial Institutions Adapt to New Regulatory Requirements",
            "ground_truth": "Business"
          }
        },
        {
          "item": {
            "input": "Tech Conference Showcases Advances in Artificial Intelligence",
            "ground_truth": "Technology"
          }
        },
        {
          "item": {
            "input": "Global Markets Respond to Oil Price Fluctuations",
            "ground_truth": "Markets"
          }
        },
        {
          "item": {
            "input": "International Cooperation Strengthened Through New Treaty",
            "ground_truth": "World"
          }
        },
        {
          "item": {
            "input": "Sports League Announces Revised Schedule for Upcoming Season",
            "ground_truth": "Sports"
          }
        }
      ]
    },
    "input_messages": {
      "type": "template",
      "template": [
        {
          "type": "message",
          "role": "developer",
          "content": {
            "type": "input_text",
            "text": "Categorize a given news headline into one of the following topics: Technology, Markets, World, Business, or Sports.\n\n# Steps\n\n1. Analyze the content of the news headline to understand its primary focus.\n2. Extract the subject matter, identifying any key indicators or keywords.\n3. Use the identified indicators to determine the most suitable category out of the five options: Technology, Markets, World, Business, or Sports.\n4. Ensure only one category is selected per headline.\n\n# Output Format\n\nRespond with the chosen category as a single word. For instance: \"Technology\", \"Markets\", \"World\", \"Business\", or \"Sports\".\n\n# Examples\n\n**Input**: \"Apple Unveils New iPhone Model, Featuring Advanced AI Features\"  \n**Output**: \"Technology\"\n\n**Input**: \"Global Stocks Mixed as Investors Await Central Bank Decisions\"  \n**Output**: \"Markets\"\n\n**Input**: \"War in Ukraine: Latest Updates on Negotiation Status\"  \n**Output**: \"World\"\n\n**Input**: \"Microsoft in Talks to Acquire Gaming Company for $2 Billion\"  \n**Output**: \"Business\"\n\n**Input**: \"Manchester United Secures Win in Premier League Football Match\"  \n**Output**: \"Sports\" \n\n# Notes\n\n- If the headline appears to fit into more than one category, choose the most dominant theme.\n- Keywords or phrases such as \"stocks\", \"company acquisition\", \"match\", or technological brands can be good indicators for classification.\n"
          }
        },
        {
          "type": "message",
          "role": "user",
          "content": {
            "type": "input_text",
            "text": "{{item.input}}"
          }
        }
      ]
    },
    "model": "gpt-6-astra",
    "sampling_params": {
      "max_completions_tokens": 2048
    }
  },
  "error": null,
  "metadata": {}
}
```
