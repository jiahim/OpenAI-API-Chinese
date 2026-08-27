> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 取消评估运行

**post** `/evals/{eval_id}/runs/{run_id}`

取消正在进行的评估运行。

### 路径参数

- `eval_id: string`

- `run_id: string`

### 返回值

- `id: string`

  评估运行的唯一标识符。

- `created_at: number`

  评估运行创建时的 Unix 时间戳（以秒为单位）。

- `data_source: CreateEvalJSONLRunDataSource or CreateEvalCompletionsRunDataSource or object { source, type, input_messages, 2 more }`

  关于运行数据源的信息。

  - `CreateEvalJSONLRunDataSource object { source, type }`

    一个 JsonlRunDataSource 对象，指定与评估匹配的 JSONL 文件。

    - `source: object { content, type }  or object { id, type }`

      决定哪些内容填充 `item` 数据源中的命名空间。

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

    一个 CompletionsRunDataSource 对象，描述模型采样配置。

    - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 3 more }`

      决定哪些内容填充 `item` 此运行数据源中的命名空间。

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

        一个 StoredCompletionsRunDataSource 配置，描述一组筛选条件。

        - `type: "stored_completions"`

          源的类型。始终为 `stored_completions`.

          - `"stored_completions"`

        - `created_after: optional number or null`

          可选的 Unix 时间戳，用于筛选此后创建的条目。

        - `created_before: optional number or null`

          可选的 Unix 时间戳，用于筛选此前创建的条目。

        - `limit: optional number or null`

          可选的最大返回条目数。

        - `metadata: optional Metadata or null`

          一组 16 个键值对，可附加到对象上。这可用于
          以结构化方式存储对象的附加信息，
          并通过API或仪表盘查询对象。

          键是字符串，最大长度为 64 个字符。值是字符串
          ，最大长度为 512 个字符。

        - `model: optional string or null`

          用于筛选的可选模型（例如 'gpt-4o'）。

    - `type: "completions"`

      运行数据源的类型。始终为 `completions`.

      - `"completions"`

    - `input_messages: optional object { template, type }  or object { item_reference, type }`

      从模型采样时使用。决定传递给模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` 命名空间变量引用的模板。

      - `TemplateInputMessages object { template, type }`

        - `template: array of EasyInputMessage or object { content, role, type }`

          构成提示或上下文的聊天消息列表。可能包含对 `item` 命名空间的变量引用，即 {{item.name}}。

          - `EasyInputMessage object { content, role, phase, type }`

            传递给模型的消息输入，带有表明指令遵循
            层级的角色。以 `developer` 或 `system` 角色给出的指令
            优先于以 `user` 角色给出的指令。具有
            `assistant` 角色的消息被假定为模型在之前的
            交互中生成的。

            - `content: string or ResponseInputMessageContentList`

              传递给模型的文本、图像或音频输入，用于生成响应。
              也可以包含之前的助手响应。

              - `TextInput = string`

                传递给模型的文本输入。

              - `ResponseInputMessageContentList = array of ResponseInputContent`

                给模型的一个或多个输入项的列表，包含不同的内容
                类型。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  传递给模型的文本输入。

                  - `text: string`

                    给模型的文本输入。

                  - `type: "input_text"`

                    输入项的类型。始终为 `input_text`.

                    - `"input_text"`

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示词前缀的确切结尾。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

                - `ResponseInputImage object { detail, type, file_id, 2 more }`

                  给模型的图像输入。了解 [图像输入](/docs/guides/vision).

                  - `detail: ImageDetail`

                    发送给模型的图像的细节级别。以下之一 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

                    - `"low"`

                    - `"high"`

                    - `"auto"`

                    - `"original"`

                  - `type: "input_image"`

                    输入项的类型。始终为 `input_image`.

                    - `"input_image"`

                  - `file_id: optional string or null`

                    要发送给模型的文件的 ID。

                  - `image_url: optional string or null`

                    要发送给模型的图像的 URL。完全限定的 URL 或数据 URL 中的 base64 编码图像。

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示词前缀的确切结尾。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

                - `ResponseInputFile object { type, detail, file_data, 4 more }`

                  给模型的文件输入。

                  - `type: "input_file"`

                    输入项的类型。始终为 `input_file`.

                    - `"input_file"`

                  - `detail: optional "auto" or "low" or "high"`

                    要发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌的使用量。使用 `low` 进行低成本渲染，或 `high` 以更高质量渲染文件。默认值为 `auto`.

                    - `"auto"`

                    - `"low"`

                    - `"high"`

                  - `file_data: optional string`

                    要发送给模型的文件内容。

                  - `file_id: optional string or null`

                    要发送给模型的文件的 ID。

                  - `file_url: optional string`

                    要发送给模型的文件的 URL。

                  - `filename: optional string`

                    要发送给模型的文件的名称。

                  - `prompt_cache_breakpoint: optional object { mode }`

                    标记可复用提示词前缀的确切结尾。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

                    - `mode: "explicit"`

                      断点模式。始终为 `explicit`.

                      - `"explicit"`

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。可以是以下之一： `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `phase: optional "commentary" or "final_answer" or null`

              将 `assistant` 消息标记为中间评论（`commentary`）或最终答案（`final_answer`).
              对于像 `gpt-5.3-codex` 及更高版本的模型，在发送后续请求时，请保留并重新发送
              阶段的所有助手消息——省略它可能会降低性能。不适用于用户消息。

              - `"commentary"`

              - `"final_answer"`

            - `type: optional "message"`

              消息输入的类型。始终为 `message`.

              - `"message"`

          - `EvalMessageObject object { content, role, type }`

            传递给模型的消息输入，带有表明指令遵循
            层级的角色。以 `developer` 或 `system` 角色给出的指令
            优先于以 `user` 角色给出的指令。具有
            `assistant` 角色的消息被假定为模型在之前的
            交互中生成的。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入——可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

              - `TextInput = string`

                传递给模型的文本输入。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                传递给模型的文本输入。

              - `OutputText object { text, type }`

                模型的文本输出。

                - `text: string`

                  模型的文本输出。

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

                  发送给模型的图像的细节级别。以下之一 `high`, `low`，或 `auto`。默认值为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                模型的音频输入。

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64 编码的音频数据。

                  - `format: "mp3" or "wav"`

                    音频数据的格式。目前支持的格式为 `mp3` 以及
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  输入项的类型。始终为 `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，其中每个输入可以是输入文本、输出文本、输入
                图像或输入音频对象。

                - `TextInput = string`

                  传递给模型的文本输入。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  传递给模型的文本输入。

                - `OutputText object { text, type }`

                  模型的文本输出。

                  - `text: string`

                    模型的文本输出。

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

                    发送给模型的图像的细节级别。以下之一 `high`, `low`，或 `auto`。默认值为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  模型的音频输入。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。可以是以下之一： `user`, `assistant`, `system`，或
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

          对 `item` 命名空间中变量的引用。例如，"item.input_trajectory"

        - `type: "item_reference"`

          输入消息的类型。始终为 `item_reference`.

          - `"item_reference"`

    - `model: optional string`

      用于生成补全的模型名称（例如 "o3-mini"）。

    - `sampling_params: optional object { max_completion_tokens, reasoning_effort, response_format, 4 more }`

      - `max_completion_tokens: optional number`

        生成的输出中的最大 token 数。

      - `reasoning_effort: optional ReasoningEffort or null`

        限制推理模型的推理投入程度。目前支持的
        值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
        降低推理投入可以加快响应速度，并减少响应中用于推理的
        token 数。并非所有推理模型都支持每个
        值。请参阅
        [推理指南](https://platform.openai.com/docs/guides/reasoning)
        了解各模型的特定支持情况。

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `response_format: optional ResponseFormatText or ResponseFormatJSONSchema or ResponseFormatJSONObject`

        指定模型必须输出的格式的对象。

        设置为 `{ "type": "json_schema", "json_schema": {...} }` 时启用
        结构化输出，确保模型将匹配你提供的 JSON
        架构。更多信息请参阅 [Structured Outputs
        指南](/docs/guides/structured-outputs).

        设置为 `{ "type": "json_object" }` 启用较旧的 JSON 模式，该模式
        确保模型生成的消息是有效的 JSON。对于支持该功能的模型，建议使用 `json_schema`
        更为合适。

        - `ResponseFormatText object { type }`

          默认响应格式。用于生成文本响应。

          - `type: "text"`

            正在定义的响应格式类型。始终为 `text`.

            - `"text"`

        - `ResponseFormatJSONSchema object { json_schema, type }`

          JSON Schema 响应格式。用于生成结构化的 JSON 响应。
          了解有关 [Structured Outputs](/docs/guides/structured-outputs).

          - `json_schema: object { name, description, schema, strict }`

            Structured Outputs 配置选项（包括 JSON Schema）的更多信息。

            - `name: string`

              响应格式的名称。必须是 a-z、A-Z、0-9，或包含
              下划线和短横线，最大长度为 64。

            - `description: optional string`

              对响应格式用途的描述，模型会使用该描述来
              确定如何按该格式进行响应。

            - `schema: optional map[unknown]`

              响应格式的架构，描述为 JSON Schema 对象。
              了解如何构建 JSON 架构 [此处](https://json-schema.org/).

            - `strict: optional boolean or null`

              是否在生成输出时启用严格的架构遵循。
              如果设置为 true，模型将始终遵循定义的确切 schema
              中的 `schema` 字段。仅支持 JSON Schema 的子集，当
              `strict` 为 `true`。要了解更多信息，请阅读 [Structured Outputs
              指南](/docs/guides/structured-outputs).

          - `type: "json_schema"`

            正在定义的响应格式类型。始终为 `json_schema`.

            - `"json_schema"`

        - `ResponseFormatJSONObject object { type }`

          JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
          使用 `json_schema` 对于支持它的模型是推荐的。请注意，
          模型在没有系统或用户消息指示时不会生成 JSON
          。

          - `type: "json_object"`

            正在定义的响应格式类型。始终为 `json_object`.

            - `"json_object"`

      - `seed: optional number`

        用于在采样时初始化随机性的种子值。

      - `temperature: optional number`

        较高的温度会增加输出的随机性。

      - `tools: optional array of ChatCompletionFunctionTool`

        模型可以调用的工具列表。目前仅支持函数作为工具。使用此参数提供模型可以为其生成 JSON 输入的函数列表。最多支持 128 个函数。

        - `function: FunctionDefinition`

          - `name: string`

            要调用的函数名称。必须为 a-z、A-Z、0-9，或包含下划线和短划线，最大长度为 64。

          - `description: optional string`

            函数功能的描述，模型用于选择何时以及如何调用该函数。

          - `parameters: optional FunctionParameters`

            函数接受的参数，描述为 JSON Schema 对象。请参阅 [指南](/docs/guides/function-calling) 获取示例，并参阅 [JSON Schema 参考](https://json-schema.org/understanding-json-schema/) 获取关于该格式的文档。

            省略 `parameters` 定义一个具有空参数列表的函数。

          - `strict: optional boolean or null`

            是否在生成函数调用时启用严格模式校验。如果设为 true，模型将遵循 `parameters` 字段。仅支持 JSON Schema 的子集，当 `strict` 为 `true`。中定义的确切模式。有关结构化输出的更多信息，请参阅 [函数调用指南](/docs/guides/function-calling).

        - `type: "function"`

          工具的类型。目前仅支持 `function` 。

          - `"function"`

      - `top_p: optional number`

        用于核采样的温度替代参数；1.0 包含所有令牌。

  - `ResponsesRunDataSource object { source, type, input_messages, 2 more }`

    一个描述模型采样配置的 ResponsesRunDataSource 对象。

    - `source: object { content, type }  or object { id, type }  or object { type, created_after, created_before, 8 more }`

      决定哪些内容填充 `item` 此运行数据源中的命名空间。

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

        一个描述运行数据源配置的 EvalResponsesSource 对象。

        - `type: "responses"`

          运行数据源的类型。始终为 `responses`.

          - `"responses"`

        - `created_after: optional number or null`

          仅包含在此时间戳（含）之后创建的条目。这是一个用于选择响应的查询参数。

        - `created_before: optional number or null`

          仅包含在此时间戳（含）之前创建的条目。这是一个用于选择响应的查询参数。

        - `instructions_search: optional string or null`

          用于搜索 'instructions' 字段的可选字符串。这是一个用于选择响应的查询参数。

        - `metadata: optional unknown or null`

          响应的元数据过滤器。这是一个用于选择响应的查询参数。

        - `model: optional string or null`

          要查找响应的模型名称。这是一个用于选择响应的查询参数。

        - `reasoning_effort: optional ReasoningEffort or null`

          限制推理模型的推理投入程度。目前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入可以加快响应速度，并减少响应中用于推理的
          token 数。并非所有推理模型都支持每个
          值。请参阅
          [推理指南](https://platform.openai.com/docs/guides/reasoning)
          了解各模型的特定支持情况。

        - `temperature: optional number or null`

          采样温度。这是一个用于选择响应的查询参数。

        - `tools: optional array of string or null`

          工具名称列表。这是一个用于选择响应的查询参数。

        - `top_p: optional number or null`

          核采样参数。这是一个用于选择响应的查询参数。

        - `users: optional array of string or null`

          用户标识符列表。这是一个用于选择响应的查询参数。

    - `type: "responses"`

      运行数据源的类型。始终为 `responses`.

      - `"responses"`

    - `input_messages: optional object { template, type }  or object { item_reference, type }`

      从模型采样时使用。决定传递给模型的消息结构。可以是预构建轨迹的引用（即， `item.input_trajectory`），也可以是带有对 `item` 命名空间变量引用的模板。

      - `InputMessagesTemplate object { template, type }`

        - `template: array of object { content, role }  or object { content, role, type }`

          构成提示或上下文的聊天消息列表。可能包含对 `item` 命名空间的变量引用，即 {{item.name}}。

          - `ChatMessage object { content, role }`

            - `content: string`

              消息的内容。

            - `role: string`

              消息的角色（例如 "system"、"assistant"、"user"）。

          - `EvalMessageObject object { content, role, type }`

            传递给模型的消息输入，带有表明指令遵循
            层级的角色。以 `developer` 或 `system` 角色给出的指令
            优先于以 `user` 角色给出的指令。具有
            `assistant` 角色的消息被假定为模型在之前的
            交互中生成的。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入——可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

              - `TextInput = string`

                传递给模型的文本输入。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                传递给模型的文本输入。

              - `OutputText object { text, type }`

                模型的文本输出。

                - `text: string`

                  模型的文本输出。

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

                  发送给模型的图像的细节级别。以下之一 `high`, `low`，或 `auto`。默认值为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                模型的音频输入。

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，其中每个输入可以是输入文本、输出文本、输入
                图像或输入音频对象。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。可以是以下之一： `user`, `assistant`, `system`，或
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

          对 `item` 命名空间。例如，"item.name"

        - `type: "item_reference"`

          输入消息的类型。始终为 `item_reference`.

          - `"item_reference"`

    - `model: optional string`

      用于生成补全的模型名称（例如 "o3-mini"）。

    - `sampling_params: optional object { max_completion_tokens, reasoning_effort, seed, 4 more }`

      - `max_completion_tokens: optional number`

        生成的输出中的最大 token 数。

      - `reasoning_effort: optional ReasoningEffort or null`

        限制推理模型的推理投入程度。目前支持的
        值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
        降低推理投入可以加快响应速度，并减少响应中用于推理的
        token 数。并非所有推理模型都支持每个
        值。请参阅
        [推理指南](https://platform.openai.com/docs/guides/reasoning)
        了解各模型的特定支持情况。

      - `seed: optional number`

        用于在采样时初始化随机性的种子值。

      - `temperature: optional number`

        较高的温度会增加输出的随机性。

      - `text: optional object { format }`

        模型文本响应的配置选项。可以是纯
        文本或结构化 JSON 数据。了解更多：

        - [文本输入和输出](/docs/guides/text)
        - [结构化输出](/docs/guides/structured-outputs)

        - `format: optional ResponseFormatTextConfig`

          指定模型必须输出的格式的对象。

          配置 `{ "type": "json_schema" }` 启用结构化输出，
          这确保模型将匹配你提供的 JSON 模式。在以下指南中了解更多：
          [结构化输出指南](/docs/guides/structured-outputs).

          默认格式为 `{ "type": "text" }` ，无额外选项。

          **不建议用于 gpt-4o 及更新模型：**

          设置为 `{ "type": "json_object" }` 启用较旧的 JSON 模式，该模式
          确保模型生成的消息是有效的 JSON。对于支持该功能的模型，建议使用 `json_schema`
          更为合适。

          - `ResponseFormatText object { type }`

            默认响应格式。用于生成文本响应。

          - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

            JSON Schema 响应格式。用于生成结构化的 JSON 响应。
            了解有关 [Structured Outputs](/docs/guides/structured-outputs).

            - `name: string`

              响应格式的名称。必须是 a-z、A-Z、0-9，或包含
              下划线和短横线，最大长度为 64。

            - `schema: map[unknown]`

              响应格式的架构，描述为 JSON Schema 对象。
              了解如何构建 JSON 架构 [此处](https://json-schema.org/).

            - `type: "json_schema"`

              正在定义的响应格式类型。始终为 `json_schema`.

              - `"json_schema"`

            - `description: optional string`

              对响应格式用途的描述，模型会使用该描述来
              确定如何按该格式进行响应。

            - `strict: optional boolean or null`

              是否在生成输出时启用严格的架构遵循。
              如果设置为 true，模型将始终遵循定义的确切 schema
              中的 `schema` 字段。仅支持 JSON Schema 的子集，当
              `strict` 为 `true`。要了解更多信息，请阅读 [Structured Outputs
              指南](/docs/guides/structured-outputs).

          - `ResponseFormatJSONObject object { type }`

            JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
            使用 `json_schema` 对于支持它的模型是推荐的。请注意，
            模型在没有系统或用户消息指示时不会生成 JSON
            。

      - `tools: optional array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        模型在生成响应时可能调用的工具数组。你可以通过设置
        来指定使用哪个工具，通过设置 `tool_choice` 参数。

        你可以提供给模型的两类工具是：

        - **内置工具**：由 OpenAI 提供的工具，扩展了
          模型的能力，如 [网页搜索](/docs/guides/tools-web-search)
          或 [文件搜索](/docs/guides/tools-file-search)。了解更多关于
          [内置工具](/docs/guides/tools).
        - **函数调用（自定义工具）**：由你定义的函数，
          使模型能够调用你自己的代码。了解更多关于
          [函数调用](/docs/guides/function-calling).

        - `Function object { name, parameters, strict, 5 more }`

          在你自己的代码中定义一个模型可以选择调用的函数。了解更多关于 [函数调用](https://platform.openai.com/docs/guides/function-calling).

          - `name: string`

            要调用的函数的名称。

          - `parameters: map[unknown] or null`

            描述函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否对此函数工具强制进行严格的参数验证。

          - `type: "function"`

            函数工具的类型。始终为 `function`.

            - `"function"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `defer_loading: optional boolean`

            此函数是否被延迟并通过工具搜索加载。

          - `description: optional string or null`

            函数的描述。模型用它来决定是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            描述此函数字符串输出中编码的 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          一种搜索上传文件中相关内容的工具。了解更多关于 [文件搜索工具](https://platform.openai.com/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索工具的类型。始终为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选器。

            - `ComparisonFilter object { key, type, value }`

              用于通过定义的比较操作将指定属性键与给定值进行比较的筛选器。

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
                - `in`：在集合中
                - `nin`：不在集合中

                - `"eq"`

                - `"ne"`

                - `"gt"`

                - `"gte"`

                - `"lt"`

                - `"lte"`

                - `"in"`

                - `"nin"`

              - `value: string or number or boolean or array of string or number`

                要与属性键进行比较的值；支持字符串、数字或布尔类型。

                - `string`

                - `number`

                - `boolean`

                - `array of string or number`

                  - `string`

                  - `number`

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个筛选器 `and` 或 `or`.

              - `filters: array of ComparisonFilter or unknown`

                要组合的筛选器数组。项目可以是 `ComparisonFilter` 或 `CompoundFilter`.

                - `ComparisonFilter object { key, type, value }`

                  用于通过定义的比较操作将指定属性键与给定值进行比较的筛选器。

                - `unknown`

              - `type: "and" or "or"`

                操作类型： `and` 或 `or`.

                - `"and"`

                - `"or"`

          - `max_num_results: optional number`

            要返回的最大结果数。此数字应在 1 到 50 之间（含）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排名选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              当启用混合搜索时，控制倒数排名融合如何平衡语义嵌入匹配与稀疏关键字匹配的权重。

              - `embedding_weight: number`

                倒数排名融合中嵌入的权重。

              - `text_weight: number`

                文本在倒数排名融合中的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，为0到1之间的数字。越接近1的数字将尝试仅返回最相关的结果，但可能返回较少的结果。

        - `Computer object { type }`

          控制虚拟计算机的工具。了解更多关于 [计算机工具](https://platform.openai.com/docs/guides/tools-computer-use).

          - `type: "computer"`

            计算机工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          控制虚拟计算机的工具。了解更多关于 [计算机工具](https://platform.openai.com/docs/guides/tools-computer-use).

          - `display_height: number`

            计算机显示器的高度。

          - `display_width: number`

            计算机显示器的宽度。

          - `environment: "windows" or "mac" or "linux" or 2 more`

            要控制的计算机环境的类型。

            - `"windows"`

            - `"mac"`

            - `"linux"`

            - `"ubuntu"`

            - `"browser"`

          - `type: "computer_use_preview"`

            计算机使用工具的类型。始终为 `computer_use_preview`.

            - `"computer_use_preview"`

        - `WebSearch object { type, external_web_access, filters, 2 more }`

          搜索互联网以获取与提示相关的来源。了解更多关于
          [网页搜索工具](/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。其中之一 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许网页搜索实时访问互联网。省略时默认为true。当为false时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的过滤器。

            - `allowed_domains: optional array of string or null`

              搜索允许的域名。如果未提供，则允许所有域名。
              所提供的域名的子域名也允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间使用量的高级指导。其中之一 `low`, `medium`，或 `high`. `medium` 是默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似类型。始终 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议为模型提供附加工具
          （MCP）服务器。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型。始终 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许的工具名称列表或筛选对象。

            - `McpAllowedTools = array of string`

              允许的工具名称字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            一个 OAuth 访问令牌，可用于远程 MCP 服务器，
            无论是自定义 MCP 服务器 URL 还是服务连接器。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，如 ChatGPT 中可用的那些。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
            关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

            当前支持的 `connector_id` 值有：

            - Dropbox: `connector_dropbox`
            - Gmail: `connector_gmail`
            - Google 日历： `connector_googlecalendar`
            - Google 云端硬盘： `connector_googledrive`
            - Microsoft Teams: `connector_microsoftteams`
            - Outlook 日历： `connector_outlookcalendar`
            - Outlook 电子邮件： `connector_outlookemail`
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

            此 MCP 工具是否被延迟并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`，或一个与需要审批的工具关联的过滤器对象
              。

              - `always: optional object { read_only, tool_names }`

                指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一的审批策略。取值为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。其中 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            要使用的安全 MCP 隧道 ID，而不是直接使用服务器 URL。其中
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `CodeInterpreter object { container, type, allowed_callers }`

          一个运行 Python 代码以帮助生成提示词响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID，也可以是对象，
            指定要提供给你的代码的上传文件 ID，以及一个
            可选 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选指定要运行代码的文件 ID。

              - `type: "auto"`

                始终 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                可选的上传文件列表，供你的代码使用。

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

                    当类型为 `allowlist`.

                  - `type: "allowlist"`

                    仅允许对指定域进行出站网络访问。始终 `allowlist`.

                    - `"allowlist"`

                  - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                    可选的域作用域机密，用于允许列表中的域。

                    - `domain: string`

                      与机密关联的域。

                    - `name: string`

                      要注入该域的机密名称。

                    - `value: string`

                      要注入该域的机密值。

          - `type: "code_interpreter"`

            代码解释器工具的类型。始终 `code_interpreter`.

            - `"code_interpreter"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

        - `ProgrammaticToolCalling object { type }`

          - `type: "programmatic_tool_calling"`

            工具的类型。始终 `programmatic_tool_calling`.

            - `"programmatic_tool_calling"`

        - `ImageGeneration object { type, action, background, 9 more }`

          使用 GPT 图像模型生成图像的工具。

          - `type: "image_generation"`

            图像生成工具的类型。始终 `image_generation`.

            - `"image_generation"`

          - `action: optional "generate" or "edit" or "auto"`

            是生成新图像还是编辑现有图像。默认值： `auto`.

            - `"generate"`

            - `"edit"`

            - `"auto"`

          - `background: optional "transparent" or "opaque" or "auto"`

            设置生成图像的背景。选项之一为 `transparent`,
            `opaque`，或 `auto`。透明背景可用于
            支持的 GPT 图像模型。对于 `gpt-image-2` 以及
            `gpt-image-2-2026-04-21`，此支持目前处于预览阶段。使用
            `transparent`，时，请将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）方面投入的努力程度。此参数仅受 `gpt-image-1` 以及 `gpt-image-1.5` 及更高版本模型支持，不适用于 `gpt-image-1-mini`。支持 `high` 以及 `low`。默认值为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于修复的可选遮罩。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

            - `file_id: optional string`

              遮罩图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的遮罩图像。

          - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

            要使用的图像生成模型。可选值之一为 `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
            `gpt-image-1`.

            - `string`

            - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

              要使用的图像生成模型。可选值之一为 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
              `gpt-image-1`.

              - `"gpt-image-1"`

              - `"gpt-image-1-mini"`

              - `"gpt-image-1.5"`

              - `"gpt-image-2"`

              - `"gpt-image-2-2026-04-21"`

          - `moderation: optional "auto" or "low"`

            生成图像的审核级别。默认值： `auto`.

            - `"auto"`

            - `"low"`

          - `output_compression: optional number`

            输出图像的压缩级别。默认值：100。

          - `output_format: optional "png" or "webp" or "jpeg"`

            生成图像的输出格式。可选值之一为 `png`, `webp`，或
            `jpeg`。默认值： `png`.

            - `"png"`

            - `"webp"`

            - `"jpeg"`

          - `partial_images: optional number`

            流式模式下生成的局部图像数量，范围从 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or "auto"`

            生成图像的质量。可选值之一为 `low`, `medium`, `high`,
            或 `auto`。默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2` 以及 `gpt-image-2-2026-04-21`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`. 宽度和高度都必须能被16整除，且请求的宽高比必须在1:3到3:1之间。高于 `2560x1440` 的分辨率是实验性的，支持的最大分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于允许自动调整大小的模型。对于 `dall-e-2`，使用 `256x256`, `512x512`，或 `1024x1024`。之一。对于 `dall-e-3`，使用 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2` 以及 `gpt-image-2-2026-04-21`，支持任意分辨率，以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`. 宽度和高度都必须能被16整除，且请求的宽高比必须在1:3到3:1之间。高于 `2560x1440` 的分辨率是实验性的，支持的最大分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于允许自动调整大小的模型。对于 `dall-e-2`，使用 `256x256`, `512x512`，或 `1024x1024`。之一。对于 `dall-e-3`，使用 `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `"1024x1024"`

              - `"1024x1536"`

              - `"1536x1024"`

              - `"auto"`

        - `LocalShell object { type }`

          一种允许模型在本地环境中执行 shell 命令的工具。

          - `type: "local_shell"`

            本地 shell 工具的类型。始终为 `local_shell`.

            - `"local_shell"`

        - `Shell object { type, allowed_callers, environment }`

          一种允许模型执行 shell 命令的工具。

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

                为此请求自动创建容器

                - `"container_auto"`

              - `file_ids: optional array of string`

                可选的上传文件列表，供你的代码使用。

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

                一个可选的技能列表，可通过 ID 或内联数据引用。

                - `SkillReference object { skill_id, type, version }`

                  - `skill_id: string`

                    引用的技能的 ID。

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

                      Base64 编码的技能 zip 压缩包。

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

                被引用的容器 ID。

              - `type: "container_reference"`

                引用通过 /v1/containers 端点创建的容器

                - `"container_reference"`

        - `Custom object { name, type, allowed_callers, 3 more }`

          一种使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/docs/guides/function-calling#custom-tools)

          - `name: string`

            自定义工具的名称，用于在工具调用中标识它。

          - `type: "custom"`

            自定义工具的类型。始终为 `custom`.

            - `"custom"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `defer_loading: optional boolean`

            此工具是否应被延迟并通过工具搜索发现。

          - `description: optional string`

            可选的自定义工具描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认为无约束文本。

            - `Text object { type }`

              无约束的自由格式文本。

              - `type: "text"`

                无约束的文本格式。始终为 `text`.

                - `"text"`

            - `Grammar object { definition, syntax, type }`

              由用户定义的语法。

              - `definition: string`

                语法定义。

              - `syntax: "lark" or "regex"`

                语法定义的语法。之一 `lark` 或 `regex`.

                - `"lark"`

                - `"regex"`

              - `type: "grammar"`

                语法格式。始终 `grammar`.

                - `"grammar"`

        - `Namespace object { description, name, tools, type }`

          将函数/自定义工具分组到共享命名空间下。

          - `description: string`

            向模型显示的命名空间描述。

          - `name: string`

            工具调用中使用的命名空间名称（例如， `crm`).

          - `tools: array of object { name, type, allowed_callers, 5 more }  or object { name, type, allowed_callers, 3 more }`

            此命名空间内可用的函数/自定义工具。

            - `Function object { name, type, allowed_callers, 5 more }`

              - `name: string`

              - `type: "function"`

                - `"function"`

              - `allowed_callers: optional array of "direct" or "programmatic" or null`

                工具调用上下文。

                - `"direct"`

                - `"programmatic"`

              - `defer_loading: optional boolean`

                此函数是否应延迟并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                描述此函数工具字符串输出中编码的 JSON 值的 JSON Schema。这不描述内容数组输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制严格参数验证。如果省略，Responses 会尝试在模式兼容时使用严格验证，否则回退到非严格验证。

            - `Custom object { name, type, allowed_callers, 3 more }`

              一种使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/docs/guides/function-calling#custom-tools)

              - `name: string`

                自定义工具的名称，用于在工具调用中标识它。

              - `type: "custom"`

                自定义工具的类型。始终为 `custom`.

                - `"custom"`

              - `allowed_callers: optional array of "direct" or "programmatic" or null`

                工具调用上下文。

                - `"direct"`

                - `"programmatic"`

              - `defer_loading: optional boolean`

                此工具是否应被延迟并通过工具搜索发现。

              - `description: optional string`

                可选的自定义工具描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认为无约束文本。

          - `type: "namespace"`

            工具的类型。始终 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          托管或 BYOT 工具搜索配置，用于延迟工具。

          - `type: "tool_search"`

            工具的类型。始终 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            向模型显示的客户端执行工具搜索工具的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端还是客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行工具搜索工具的参数模式。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具在网络上搜索相关结果以用于响应。了解更多关于 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。其中之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间使用量的高级指导。其中之一 `low`, `medium`，或 `high`. `medium` 是默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户的位置。

            - `type: "approximate"`

              位置近似类型。始终 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

        - `ApplyPatch object { type, allowed_callers }`

          允许助手使用统一差异创建、删除或更新文件。

          - `type: "apply_patch"`

            工具的类型。始终 `apply_patch`.

            - `"apply_patch"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

      - `top_p: optional number`

        用于核采样的温度替代参数；1.0 包含所有令牌。

- `error: EvalAPIError`

  表示 Eval API 错误响应的对象。

  - `code: string`

    错误代码。

  - `message: string`

    错误消息。

- `eval_id: string`

  关联评估的标识符。

- `metadata: Metadata or null`

  一组 16 个键值对，可附加到对象上。这可用于
  以结构化方式存储对象的附加信息，
  并通过API或仪表盘查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串
  ，最大长度为 512 个字符。

- `model: string`

  被评估的模型（如适用）。

- `name: string`

  评估运行的名称。

- `object: "eval.run"`

  对象的类型。始终为 "eval.run"。

  - `"eval.run"`

- `per_model_usage: array of object { cached_tokens, completion_tokens, invocation_count, 3 more }`

  评估运行期间每个模型的用量统计。

  - `cached_tokens: number`

    从缓存中检索的令牌数量。

  - `completion_tokens: number`

    生成的完成令牌数量。

  - `invocation_count: number`

    调用次数。

  - `model_name: string`

    模型的名称。

  - `prompt_tokens: number`

    使用的提示令牌数量。

  - `total_tokens: number`

    使用的令牌总数。

- `per_testing_criteria_results: array of object { failed, passed, testing_criteria }`

  评估运行期间应用的每个测试标准的结果。

  - `failed: number`

    此标准失败的测试数。

  - `passed: number`

    此标准通过的测试数。

  - `testing_criteria: string`

    测试标准的描述。

- `report_url: string`

  UI 仪表盘上渲染的评估运行报告的 URL。

- `result_counts: object { errored, failed, passed, total }`

  汇总评估运行结果的计数器。

  - `errored: number`

    导致错误的输出项数量。

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
  "model": "gpt-4o-mini",
  "name": "gpt-4o-mini",
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
    "model": "gpt-4o-mini",
    "sampling_params": {
      "seed": 42,
      "temperature": 1.0,
      "top_p": 1.0,
      "max_completions_tokens": 2048
    }
  },
  "error": null,
  "metadata": {}
}
```
