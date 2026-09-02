> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## 压缩响应

**post** `/responses/compact`

压缩对话。返回一个压缩后的响应对象。

了解在何时以及如何压缩长时间运行的对话，请参阅 [对话状态指南](/docs/guides/conversation-state#managing-the-context-window).关于兼容 ZDR 的压缩细节，请参阅 [压缩（高级）](/docs/guides/conversation-state#compaction-advanced).

### 请求体参数

- `model: "gpt-5.6-sol" or "gpt-5.6-terra" or "gpt-5.6-luna" or 99 more or string or null`

  用于生成响应的模型 ID，例如 `gpt-5.6-sol`。OpenAI 提供多种具有不同能力、性能特征和价格区间的模型。请参阅 [模型指南](/docs/models) 以浏览和比较可用模型。

  - `"gpt-5.6-sol" or "gpt-5.6-terra" or "gpt-5.6-luna" or 99 more`

    用于生成响应的模型 ID，例如 `gpt-5.6-sol`。OpenAI 提供多种具有不同能力、性能特征和价格区间的模型。请参阅 [模型指南](/docs/models) 以浏览和比较可用模型。

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

    - `"o1-pro"`

    - `"o1-pro-2025-03-19"`

    - `"o3-pro"`

    - `"o3-pro-2025-06-10"`

    - `"o3-deep-research"`

    - `"o3-deep-research-2025-06-26"`

    - `"o4-mini-deep-research"`

    - `"o4-mini-deep-research-2025-06-26"`

    - `"computer-use-preview"`

    - `"computer-use-preview-2025-03-11"`

    - `"gpt-5.5-pro"`

    - `"gpt-5.5-pro-2026-04-23"`

    - `"gpt-5-codex"`

    - `"gpt-5-pro"`

    - `"gpt-5-pro-2025-10-06"`

    - `"gpt-5.1-codex-max"`

    - `"gpt-daybreak-blue-latest"`

    - `"gpt-daybreak-red-latest"`

    - `"gpt-5.6-cyber"`

  - `string`

- `input: optional string or array of EasyInputMessage or object { content, role, status, type }  or ResponseOutputMessage or 29 more or null`

  提供给模型的文本、图像或文件输入，用于生成响应

  - `string`

    提供给模型的文本输入，等同于带有 `user` 角色的文本输入。

  - `array of EasyInputMessage or object { content, role, status, type }  or ResponseOutputMessage or 29 more`

    提供给模型的一个或多个输入项的列表，包含不同的内容类型。

    - `EasyInputMessage object { content, role, phase, type }`

      提供给模型的消息输入，带有表示指令遵循
      层级的角色。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
      角色给出的指令。带有 `user` 角色的消息被假定为在之前的
      `assistant` 交互中由模型生成。
      中由模型生成。

      - `content: string or ResponseInputMessageContentList`

        提供给模型的文本、图像或音频输入，用于生成响应。
        也可以包含之前的助手响应。

        - `TextInput = string`

          提供给模型的文本输入。

        - `ResponseInputMessageContentList = array of ResponseInputContent`

          提供给模型的一个或多个输入项的列表，包含不同的内容
          类型。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            提供给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

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

              发送给模型的文件的 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 用量。使用 `low` 可获得更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              发送给模型的文件内容。

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `file_url: optional string`

              要发送给模型的文件的 URL。

            - `filename: optional string`

              要发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

      - `role: "user" or "assistant" or "system" or "developer"`

        消息输入的角色。取值之一为 `user`, `assistant`, `system`，或
        `developer`.

        - `"user"`

        - `"assistant"`

        - `"system"`

        - `"developer"`

      - `phase: optional "commentary" or "final_answer" or null`

        将消息标记为 `assistant` 中间评论（`commentary`）或最终回答（`final_answer`).
        对于类似 `gpt-5.3-codex` 及更高版本的模型，在发送后续请求时，保留并重新发送
        阶段到所有助手消息上 —— 丢弃它可能会降低性能。不用于用户消息。

        - `"commentary"`

        - `"final_answer"`

      - `type: optional "message"`

        消息输入的类型。始终为 `message`.

        - `"message"`

    - `Message object { content, role, status, type }`

      提供给模型的消息输入，带有表示指令遵循
      层级的角色。使用 `developer` 或 `system` 角色给出的指令优先级高于使用
      角色给出的指令。带有 `user` 角色的文本输入。

      - `content: ResponseInputMessageContentList`

        提供给模型的一个或多个输入项的列表，包含不同的内容
        类型。

      - `role: "user" or "system" or "developer"`

        消息输入的角色。取值之一为 `user`, `system`，或 `developer`.

        - `"user"`

        - `"system"`

        - `"developer"`

      - `status: optional "in_progress" or "completed" or "incomplete"`

        条目的状态。取值之一为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回条目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: optional "message"`

        消息输入的类型。始终设置为 `message`.

        - `"message"`

    - `ResponseOutputMessage object { id, content, role, 3 more }`

      模型的一条输出消息。

      - `id: string`

        输出消息的唯一 ID。

      - `content: array of ResponseOutputText or ResponseOutputRefusal`

        输出消息的内容。

        - `ResponseOutputText object { annotations, logprobs, text, type }`

          模型的一条文本输出。

          - `annotations: array of object { file_id, filename, index, type }  or object { end_index, start_index, title, 2 more }  or object { container_id, end_index, file_id, 3 more }  or object { file_id, index, type }`

            文本输出的注释。

            - `FileCitation object { file_id, filename, index, type }`

              对一个文件的引用。

              - `file_id: string`

                文件的 ID。

              - `filename: string`

                所引用文件的文件名。

              - `index: number`

                文件列表中该文件的索引。

              - `type: "file_citation"`

                文件引用的类型。始终为 `file_citation`.

                - `"file_citation"`

            - `URLCitation object { end_index, start_index, title, 2 more }`

              用于生成模型回复的网页资源引用。

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

              用于生成模型回复的容器文件引用。

              - `container_id: string`

                容器文件的 ID。

              - `end_index: number`

                消息中容器文件引用最后一个字符的索引。

              - `file_id: string`

                文件的 ID。

              - `filename: string`

                所引用容器文件的文件名。

              - `start_index: number`

                消息中容器文件引用第一个字符的索引。

              - `type: "container_file_citation"`

                容器文件引用的类型。始终为 `container_file_citation`.

                - `"container_file_citation"`

            - `FilePath object { file_id, index, type }`

              文件的路径。

              - `file_id: string`

                文件的 ID。

              - `index: number`

                文件列表中该文件的索引。

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

          模型的拒绝回复。

          - `refusal: string`

            模型给出的拒绝说明。

          - `type: "refusal"`

            拒绝的类型。始终为 `refusal`.

            - `"refusal"`

      - `role: "assistant"`

        输出消息的角色。始终为 `assistant`.

        - `"assistant"`

      - `status: "in_progress" or "completed" or "incomplete"`

        输入消息的状态。取值为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回输入项时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "message"`

        输出消息的类型。始终为 `message`.

        - `"message"`

      - `phase: optional "commentary" or "final_answer" or null`

        将消息标记为 `assistant` 中间评论（`commentary`）或最终回答（`final_answer`).
        对于类似 `gpt-5.3-codex` 及更高版本的模型，在发送后续请求时，保留并重新发送
        阶段到所有助手消息上 —— 丢弃它可能会降低性能。不用于用户消息。

        - `"commentary"`

        - `"final_answer"`

    - `FileSearchCall object { id, queries, status, 2 more }`

      文件搜索 工具调用的结果。参见
      [文件搜索 指南](/docs/guides/tools-file-search) 了解更多信息。

      - `id: string`

        文件搜索 工具调用的唯一 ID。

      - `queries: array of string`

        用于搜索文件的查询语句。

      - `status: "in_progress" or "searching" or "completed" or 2 more`

        文件搜索 工具调用的状态。取值为 `in_progress`,
        `searching`, `incomplete` 或 `failed`,

        - `"in_progress"`

        - `"searching"`

        - `"completed"`

        - `"incomplete"`

        - `"failed"`

      - `type: "file_search_call"`

        文件搜索 工具调用的类型。始终为 `file_search_call`.

        - `"file_search_call"`

      - `results: optional array of object { attributes, file_id, filename, 2 more }  or null`

        文件搜索 工具调用的结果。

        - `attributes: optional map[string or number or boolean] or null`

          可以附加到对象的 16 组键值对。这对于以结构化
          格式存储对象的附加信息，以及通过 API 或仪表板查询对象非常有用。键为字符串，
          最大长度为 64 个字符。值为字符串，最大
          长度为 512 个字符、布尔值或数字。
          长度为 512 个字符、布尔值或数字。

          - `string`

          - `number`

          - `boolean`

        - `file_id: optional string`

          文件的唯一 ID。

        - `filename: optional string`

          文件的名称。

        - `score: optional number`

          文件的相关性评分，取值在 0 到 1 之间。

        - `text: optional string`

          从文件中检索到的文本。

    - `ComputerCall object { id, call_id, pending_safety_checks, 4 more }`

      对计算机使用工具的工具调用。参见
      [计算机使用指南](/docs/guides/tools-computer-use) 了解更多信息。

      - `id: string`

        计算机调用的唯一 ID。

      - `call_id: string`

        在向工具调用返回输出时所使用的标识符。

      - `pending_safety_checks: array of object { id, code, message }`

        计算机调用的待处理安全检查。

        - `id: string`

          待处理安全检查的 ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          待处理安全检查的详细信息。

      - `status: "in_progress" or "completed" or "incomplete"`

        该项的状态。取值之一为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回条目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "computer_call"`

        计算机调用的类型。始终为 `computer_call`.

        - `"computer_call"`

      - `action: optional ComputerAction`

        点击操作。

        - `Click object { button, type, x, 2 more }`

          点击操作。

          - `button: "left" or "right" or "wheel" or 2 more`

            指示在点击时按下了哪个鼠标按钮。取值之一为 `left`, `right`, `wheel`, `back`，或 `forward`.

            - `"left"`

            - `"right"`

            - `"wheel"`

            - `"back"`

            - `"forward"`

          - `type: "click"`

            指定事件类型。对于点击操作，该属性始终为 `click`.

            - `"click"`

          - `x: number`

            发生点击的 x 坐标。

          - `y: number`

            发生点击的 y 坐标。

          - `keys: optional array of string or null`

            点击时按住的按键。

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

            表示拖动操作路径的坐标数组。坐标将以对象数组的形式出现，例如

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

          模型希望执行的一系列按键操作。

          - `keys: array of string`

            模型请求按下的按键组合。这是一个字符串数组，每个字符串代表一个按键。

          - `type: "keypress"`

            指定事件类型。对于按键操作，此属性始终设置为 `keypress`.

            - `"keypress"`

        - `Move object { type, x, y, keys }`

          鼠标移动操作。

          - `type: "move"`

            指定事件类型。对于移动操作，此属性始终设置为 `move`.

            - `"move"`

          - `x: number`

            要移至的 x 坐标。

          - `y: number`

            要移至的 y 坐标。

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

            发生滚动时的 x 坐标。

          - `y: number`

            发生滚动时的 y 坐标。

          - `keys: optional array of string or null`

            滚动时按住的按键。

        - `Type object { text, type }`

          用于输入文本的操作。

          - `text: string`

            要输入的文本。

          - `type: "type"`

            指定事件类型。对于输入操作，此属性始终设置为 `type`.

            - `"type"`

        - `Wait object { type }`

          等待操作。

          - `type: "wait"`

            指定事件类型。对于等待操作，此属性始终设置为 `wait`.

            - `"wait"`

      - `actions: optional ComputerActionList`

        针对 `computer_use`。的扁平化批量操作。每个操作都包含一个
        `type` 鉴别字段以及操作专属字段。

        - `Click object { button, type, x, 2 more }`

          点击操作。

        - `DoubleClick object { keys, type, x, y }`

          双击操作。

        - `Drag object { path, type, keys }`

          拖动操作。

        - `Keypress object { keys, type }`

          模型希望执行的一系列按键操作。

        - `Move object { type, x, y, keys }`

          鼠标移动操作。

        - `Screenshot object { type }`

          截图操作。

        - `Scroll object { scroll_x, scroll_y, type, 3 more }`

          滚动操作。

        - `Type object { text, type }`

          用于输入文本的操作。

        - `Wait object { type }`

          等待操作。

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

          包含截图的已上传文件的标识符。

        - `image_url: optional string`

          截图图片的 URL。

      - `type: "computer_call_output"`

        计算机工具调用输出的类型。始终为 `computer_call_output`.

        - `"computer_call_output"`

      - `id: optional string or null`

        计算机工具调用输出的 ID。

      - `acknowledged_safety_checks: optional array of object { id, code, message }  or null`

        已被开发者确认的 API 报告的安全检查。

        - `id: string`

          待处理安全检查的 ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          待处理安全检查的详细信息。

      - `status: optional "in_progress" or "completed" or "incomplete" or null`

        输入消息的状态。取值为 `in_progress`, `completed`，或 `incomplete`。当通过 API 返回输入项时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `WebSearchCall object { id, action, status, type }`

      网页搜索工具调用的结果。参阅
      [网页搜索指南](/docs/guides/tools-web-search) 了解更多信息。

      - `id: string`

        网页搜索工具调用的唯一 ID。

      - `action: object { type, queries, query, sources }  or object { type, url }  or object { pattern, type, url }`

        描述此次 网页搜索调用中所执行的具体操作的对象。
        包含模型使用网页方式的详细信息（search、open_page、find_in_page）。

        - `Search object { type, queries, query, sources }`

          操作类型 "search" - 执行 网页搜索查询。

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

              来源类型。始终为 `url`.

              - `"url"`

            - `url: string`

              来源的 URL。

        - `OpenPage object { type, url }`

          操作类型 "open_page" - 从搜索结果中打开特定 URL。

          - `type: "open_page"`

            操作类型。

            - `"open_page"`

          - `url: optional string or null`

            模型打开的 URL。

        - `FindInPage object { pattern, type, url }`

          操作类型 "find_in_page"：在已加载页面内搜索匹配模式。

          - `pattern: string`

            在页面中要搜索的模式或文本。

          - `type: "find_in_page"`

            操作类型。

            - `"find_in_page"`

          - `url: string`

            搜索该模式的页面的 URL。

      - `status: "in_progress" or "searching" or "completed" or "failed"`

        网页搜索工具调用的状态。

        - `"in_progress"`

        - `"searching"`

        - `"completed"`

        - `"failed"`

      - `type: "web_search_call"`

        网页搜索工具调用的类型。始终为 `web_search_call`.

        - `"web_search_call"`

    - `FunctionCall object { arguments, call_id, name, 5 more }`

      用于运行函数的工具调用。请参阅
      [函数调用指南](/docs/guides/function-calling) 了解更多信息。

      - `arguments: string`

        传递给函数的参数的 JSON 字符串。

      - `call_id: string`

        模型生成的函数工具调用的唯一 ID。

      - `name: string`

        要运行的函数名称。

      - `type: "function_call"`

        函数工具调用的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        函数工具调用的唯一 ID。

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

        该项的状态。取值之一为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回条目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `FunctionCallOutput object { output, type, id, 5 more }`

      函数工具调用的输出。

      - `output: string or array of ResponseInputTextContent or ResponseInputImageContent or ResponseInputFileContent`

        函数工具调用的文本、图片或文件输出。

        - `string`

          函数工具调用输出的 JSON 字符串。

        - `array of ResponseInputTextContent or ResponseInputImageContent or ResponseInputFileContent`

          函数工具调用的内容输出（文本、图片、文件）数组。

          - `ResponseInputTextContent object { text, type, prompt_cache_breakpoint }`

            提供给模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }  or null`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImageContent object { type, detail, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/docs/guides/vision)

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional ImageDetail or null`

              发送给模型的图像细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }  or null`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFileContent object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 用量。使用 `low` 可获得更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string or null`

              要发送给模型的文件的 base64 编码数据。

            - `file_id: optional string or null`

              发送给模型的文件的 ID。

            - `file_url: optional string or null`

              要发送给模型的文件的 URL。

            - `filename: optional string or null`

              要发送给模型的文件的名称。

            - `prompt_cache_breakpoint: optional object { mode }  or null`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

      - `type: "function_call_output"`

        函数工具调用输出的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string or null`

        函数工具调用的唯一 ID。当此条目通过 API 返回时填充。

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

        生成该输出的工具名称。

      - `namespace: optional string or null`

        生成该输出的工具命名空间。

      - `status: optional "in_progress" or "completed" or "incomplete" or null`

        该项的状态。取值之一为 `in_progress`, `completed`，或 `incomplete`。当通过 API 返回条目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `ToolSearchCall object { arguments, type, id, 3 more }`

      - `arguments: unknown`

        提供给工具搜索调用的参数。

      - `type: "tool_search_call"`

        条目类型。始终为 `tool_search_call`.

        - `"tool_search_call"`

      - `id: optional string or null`

        此工具搜索调用的唯一 ID。

      - `call_id: optional string or null`

        由模型生成的工具搜索调用的唯一 ID。

      - `execution: optional "server" or "client"`

        工具搜索由服务端还是客户端执行。

        - `"server"`

        - `"client"`

      - `status: optional "in_progress" or "completed" or "incomplete" or null`

        工具搜索调用的状态。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `ToolSearchOutput object { tools, type, id, 3 more }`

      - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        工具搜索输出返回的已加载工具定义。

        - `Function object { name, parameters, strict, 5 more }`

          在你自己的代码中定义一个可供模型选择调用的函数。详细了解 [函数调用](https://platform.openai.com/docs/guides/function-calling).

          - `name: string`

            要调用的函数名称。

          - `parameters: map[unknown] or null`

            用于描述函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            此函数工具是否启用严格的参数校验。

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

            函数的描述，供模型用来决定是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            描述此函数的字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          用于从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 tool](https://platform.openai.com/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索 工具的类型。通常为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选条件。

            - `ComparisonFilter object { key, type, value }`

              用于通过定义的比较操作将指定的属性键与给定值进行比较的筛选条件。

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
                - `in`：包含于
                - `nin`：不包含于

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

              使用以下方式组合多个筛选条件 `and` 或 `or`.

              - `filters: array of ComparisonFilter or unknown`

                要组合的筛选条件数组。各项可以为 `ComparisonFilter` 或 `CompoundFilter`.

                - `ComparisonFilter object { key, type, value }`

                  用于通过定义的比较操作将指定的属性键与给定值进行比较的筛选条件。

                - `unknown`

              - `type: "and" or "or"`

                操作类型： `and` 或 `or`.

                - `"and"`

                - `"or"`

          - `max_num_results: optional number`

            要返回的最大结果数。该数值应介于 1 到 50 之间（含端点）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              在启用混合搜索时，用于控制互逆排名融合（reciprocal rank fusion）在语义嵌入匹配与稀疏关键词匹配之间平衡程度的权重。

              - `embedding_weight: number`

                互逆排名融合中嵌入的权重。

              - `text_weight: number`

                互逆排名融合中文本匹配的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，取值范围为 0 到 1。越接近 1 的数值会尝试仅返回相关性最高的结果，但返回的结果数量可能会更少。

        - `Computer object { type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

          - `type: "computer"`

            计算机工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

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

            计算机使用工具的类型。始终为 `computer_use_preview`.

            - `"computer_use_preview"`

        - `WebSearch object { type, external_web_access, filters, 2 more }`

          在互联网上搜索与提示词相关的来源。了解更多关于
          [网页搜索工具](/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。取值为 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许网页搜索实时访问互联网。省略时默认值为 true。当值为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的筛选条件。

            - `allowed_domains: optional array of string or null`

              允许搜索的域名。如果未提供，则允许所有域名。
              所提供域名的子域名同样被允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            搜索所使用的上下文窗口空间的高级指引。可选值为以下之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              近似位置的类型。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议
          （MCP）服务器，为模型提供对其他工具的访问能力。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            该 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的筛选器对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或为只读。如果某个
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此筛选器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可与远程 MCP 服务器一起使用的 OAuth 访问令牌，可搭配
            自定义 MCP 服务器 URL 或服务连接器使用。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的那些连接器。必须提供其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 。了解更多
            关于服务连接器的 [信息](/docs/guides/tools-remote-mcp#connectors).

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

            此 MCP 工具是否被延迟，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的筛选器对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的筛选器对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或为只读。如果某个
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的筛选器对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或为只读。如果某个
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `CodeInterpreter object { container, type, allowed_callers }`

          运行 Python 代码以帮助生成对提示词响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID 或一个对象，该对象
            指定可供你的代码使用的已上传文件 ID，以及一个
            可选的 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定要用于运行代码的文件 ID。

              - `type: "auto"`

                始终为 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                可供你的代码使用的已上传文件的可选列表。

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

                    当类型为时允许访问的域名列表 `allowlist`.

                  - `type: "allowlist"`

                    仅允许向指定域进行出站网络访问。始终为 `allowlist`.

                    - `"allowlist"`

                  - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                    用于已加入白名单域的可选域范围密钥。

                    - `domain: string`

                      与该密钥关联的域。

                    - `name: string`

                      为该域注入的密钥名称。

                    - `value: string`

                      为该域注入的密钥值。

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

            设置生成图像的背景。可选值为 `transparent`,
            `opaque`，或 `auto`。之一。受支持的 GPT Image 模型可使用透明背景。对于
            受支持的 GPT Image 模型。对于 `gpt-image-2` 和
            `gpt-image-2-2026-04-21`，该功能处于预览阶段。当使用
            `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像风格和特征（尤其是面部特征）时所投入的精力。该参数仅在 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本模型中受支持，在 `gpt-image-1-mini`。中不受支持。支持的值包括 `high` 和 `low`。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于局部重绘的可选蒙版。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

            - `file_id: optional string`

              蒙版图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的蒙版图像。

          - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

            要使用的图像生成模型。可选值为 `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
            `gpt-image-1`.

            - `string`

            - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

              要使用的图像生成模型。可选值为 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
              `gpt-image-1`.

              - `"gpt-image-1"`

              - `"gpt-image-1-mini"`

              - `"gpt-image-1.5"`

              - `"gpt-image-2"`

              - `"gpt-image-2-2026-04-21"`

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

            在流式模式下要生成的中间图片数量，范围为 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or "auto"`

            生成图像的质量。可选值为 `low`, `medium`, `high`,
            或 `auto`。默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式指定的任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 由 GPT 图像模型支持； `auto` 由允许自动调整尺寸的模型支持。对于 `dall-e-2`，使用以下值之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下值之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式指定的任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 由 GPT 图像模型支持； `auto` 由允许自动调整尺寸的模型支持。对于 `dall-e-2`，使用以下值之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下值之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

                为此请求自动创建一个容器

                - `"container_auto"`

              - `file_ids: optional array of string`

                可供你的代码使用的已上传文件的可选列表。

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

                      Base64 编码的技能 zip 包。

                    - `media_type: "application/zip"`

                      内联技能负载的媒体类型，必须为 `application/zip`.

                      - `"application/zip"`

                    - `type: "base64"`

                      内联技能来源的类型，必须为 `base64`.

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

                所引用容器的 ID。

              - `type: "container_reference"`

                引用通过 /v1/containers 端点创建的容器。

                - `"container_reference"`

        - `Custom object { name, type, allowed_callers, 3 more }`

          使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/docs/guides/function-calling#custom-tools)

          - `name: string`

            自定义工具的名称，用于在工具调用中识别它。

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

          在共享命名空间下对函数/自定义工具进行分组。

          - `description: string`

            展示给模型的命名空间描述。

          - `name: string`

            用于工具调用中的命名空间名称（例如， `crm`).

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

                此函数是否应被延迟并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                用于描述此函数工具字符串输出中所编码 JSON 值的 JSON Schema。该字段不描述 content 数组形式的输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。如果省略，对于兼容的 schema，Responses 会尝试使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 3 more }`

              使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/docs/guides/function-calling#custom-tools)

              - `name: string`

                自定义工具的名称，用于在工具调用中识别它。

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

            展示给模型的、由客户端执行的工具搜索工具的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端执行还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具会在网页中搜索可在响应中使用的相关结果。详细了解 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。取值为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            搜索所使用的上下文窗口空间的高级指引。可选值为以下之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户所在位置。

            - `type: "approximate"`

              近似位置的类型。始终为 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

        - `ApplyPatch object { type, allowed_callers }`

          允许助手使用 unified diff 创建、删除或更新文件。

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

        此工具搜索输出的唯一 ID。

      - `call_id: optional string or null`

        由模型生成的工具搜索调用的唯一 ID。

      - `execution: optional "server" or "client"`

        工具搜索由服务端还是客户端执行。

        - `"server"`

        - `"client"`

      - `status: optional "in_progress" or "completed" or "incomplete" or null`

        工具搜索输出的状态。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `AdditionalTools object { role, tools, type, id }`

      - `role: "developer"`

        提供这些额外工具的角色。仅支持 `developer` 。

        - `"developer"`

      - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        在此项中可用的额外工具列表。

        - `Function object { name, parameters, strict, 5 more }`

          在你自己的代码中定义一个可供模型选择调用的函数。详细了解 [函数调用](https://platform.openai.com/docs/guides/function-calling).

          - `name: string`

            要调用的函数名称。

          - `parameters: map[unknown] or null`

            用于描述函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            此函数工具是否启用严格的参数校验。

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

            函数的描述，供模型用来决定是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            描述此函数的字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          用于从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 tool](https://platform.openai.com/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索 工具的类型。通常为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选条件。

            - `ComparisonFilter object { key, type, value }`

              用于通过定义的比较操作将指定的属性键与给定值进行比较的筛选条件。

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个筛选条件 `and` 或 `or`.

          - `max_num_results: optional number`

            要返回的最大结果数。该数值应介于 1 到 50 之间（含端点）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              在启用混合搜索时，用于控制互逆排名融合（reciprocal rank fusion）在语义嵌入匹配与稀疏关键词匹配之间平衡程度的权重。

              - `embedding_weight: number`

                互逆排名融合中嵌入的权重。

              - `text_weight: number`

                互逆排名融合中文本匹配的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，取值范围为 0 到 1。越接近 1 的数值会尝试仅返回相关性最高的结果，但返回的结果数量可能会更少。

        - `Computer object { type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

          - `type: "computer"`

            计算机工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

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

            计算机使用工具的类型。始终为 `computer_use_preview`.

            - `"computer_use_preview"`

        - `WebSearch object { type, external_web_access, filters, 2 more }`

          在互联网上搜索与提示词相关的来源。了解更多关于
          [网页搜索工具](/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。取值为 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许网页搜索实时访问互联网。省略时默认值为 true。当值为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的筛选条件。

            - `allowed_domains: optional array of string or null`

              允许搜索的域名。如果未提供，则允许所有域名。
              所提供域名的子域名同样被允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            搜索所使用的上下文窗口空间的高级指引。可选值为以下之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              近似位置的类型。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议
          （MCP）服务器，为模型提供对其他工具的访问能力。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            该 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的筛选器对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或为只读。如果某个
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此筛选器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可与远程 MCP 服务器一起使用的 OAuth 访问令牌，可搭配
            自定义 MCP 服务器 URL 或服务连接器使用。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的那些连接器。必须提供其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 。了解更多
            关于服务连接器的 [信息](/docs/guides/tools-remote-mcp#connectors).

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

            此 MCP 工具是否被延迟，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的筛选器对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的筛选器对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或为只读。如果某个
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的筛选器对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或为只读。如果某个
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `CodeInterpreter object { container, type, allowed_callers }`

          运行 Python 代码以帮助生成对提示词响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID 或一个对象，该对象
            指定可供你的代码使用的已上传文件 ID，以及一个
            可选的 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定要用于运行代码的文件 ID。

              - `type: "auto"`

                始终为 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                可供你的代码使用的已上传文件的可选列表。

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

            设置生成图像的背景。可选值为 `transparent`,
            `opaque`，或 `auto`。之一。受支持的 GPT Image 模型可使用透明背景。对于
            受支持的 GPT Image 模型。对于 `gpt-image-2` 和
            `gpt-image-2-2026-04-21`，该功能处于预览阶段。当使用
            `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像风格和特征（尤其是面部特征）时所投入的精力。该参数仅在 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本模型中受支持，在 `gpt-image-1-mini`。中不受支持。支持的值包括 `high` 和 `low`。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于局部重绘的可选蒙版。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

            - `file_id: optional string`

              蒙版图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的蒙版图像。

          - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

            要使用的图像生成模型。可选值为 `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
            `gpt-image-1`.

            - `string`

            - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

              要使用的图像生成模型。可选值为 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
              `gpt-image-1`.

              - `"gpt-image-1"`

              - `"gpt-image-1-mini"`

              - `"gpt-image-1.5"`

              - `"gpt-image-2"`

              - `"gpt-image-2-2026-04-21"`

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

            在流式模式下要生成的中间图片数量，范围为 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or "auto"`

            生成图像的质量。可选值为 `low`, `medium`, `high`,
            或 `auto`。默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式指定的任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 由 GPT 图像模型支持； `auto` 由允许自动调整尺寸的模型支持。对于 `dall-e-2`，使用以下值之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下值之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式指定的任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 由 GPT 图像模型支持； `auto` 由允许自动调整尺寸的模型支持。对于 `dall-e-2`，使用以下值之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下值之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

        - `Custom object { name, type, allowed_callers, 3 more }`

          使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/docs/guides/function-calling#custom-tools)

          - `name: string`

            自定义工具的名称，用于在工具调用中识别它。

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

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认为无约束文本。

        - `Namespace object { description, name, tools, type }`

          在共享命名空间下对函数/自定义工具进行分组。

          - `description: string`

            展示给模型的命名空间描述。

          - `name: string`

            用于工具调用中的命名空间名称（例如， `crm`).

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

                此函数是否应被延迟并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                用于描述此函数工具字符串输出中所编码 JSON 值的 JSON Schema。该字段不描述 content 数组形式的输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。如果省略，对于兼容的 schema，Responses 会尝试使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 3 more }`

              使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/docs/guides/function-calling#custom-tools)

              - `name: string`

                自定义工具的名称，用于在工具调用中识别它。

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

            展示给模型的、由客户端执行的工具搜索工具的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端执行还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具会在网页中搜索可在响应中使用的相关结果。详细了解 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。取值为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            搜索所使用的上下文窗口空间的高级指引。可选值为以下之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户所在位置。

            - `type: "approximate"`

              近似位置的类型。始终为 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

        - `ApplyPatch object { type, allowed_callers }`

          允许助手使用 unified diff 创建、删除或更新文件。

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

        此额外工具项的唯一 ID。

    - `Reasoning object { id, summary, type, 3 more }`

      推理模型在生成响应时使用的思维链描述。请务必将这些项包含在
      传回给 Responses API `input` 的输入中，以便在手动管理
      上下文时用于对话的后续轮次。
      [管理上下文](/docs/guides/conversation-state).

      - `id: string`

        推理内容的唯一标识符。

      - `summary: array of SummaryTextContent`

        推理摘要内容。

        - `text: string`

          到目前为止模型推理输出的摘要。

        - `type: "summary_text"`

          对象的类型。始终为 `summary_text`.

          - `"summary_text"`

      - `type: "reasoning"`

        对象的类型。始终为 `reasoning`.

        - `"reasoning"`

      - `content: optional array of object { text, type }`

        推理文本内容。

        - `text: string`

          来自模型的推理文本。

        - `type: "reasoning_text"`

          推理文本的类型。始终为 `reasoning_text`.

          - `"reasoning_text"`

      - `encrypted_content: optional string or null`

        推理项的加密内容。默认情况下会填充该字段
        用于通过 `POST /v1/responses` 和 WebSocket
        `response.create` 请求返回的推理项。

        流式传输时，请在后续请求中使用已完成的推理项及其
        `encrypted_content` 中的 `response.output_item.done` 事件。
        后续请求。该 `encrypted_content` 中的
        `response.output_item.added` 可能不完整。这一点尤其
        重要，当 `store` 为 `false` 或使用 Zero Data Retention 时。

      - `status: optional "in_progress" or "completed" or "incomplete"`

        该项的状态。取值之一为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回条目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `Compaction object { encrypted_content, type, id }`

      由该模型生成的压缩项 [`v1/responses/compact` API](/docs/api-reference/responses/compact).

      - `encrypted_content: string`

        压缩摘要的加密内容。

      - `type: "compaction"`

        该项的类型。始终为 `compaction`.

        - `"compaction"`

      - `id: optional string or null`

        压缩项的 ID。

    - `ImageGenerationCall object { id, result, status, type }`

      模型发起的图像生成请求。

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

    - `CodeInterpreterCall object { id, code, container_id, 3 more }`

      用于运行代码的工具调用。

      - `id: string`

        代码解释器工具调用的唯一 ID。

      - `code: string or null`

        要运行的代码，若不可用则为 null。

      - `container_id: string`

        用于运行代码的容器 ID。

      - `outputs: array of object { logs, type }  or object { type, url }  or null`

        代码解释器生成的输出，例如日志或图像。
        如果没有可用输出，可以为 null。

        - `Logs object { logs, type }`

          代码解释器输出的日志。

          - `logs: string`

            代码解释器输出的日志。

          - `type: "logs"`

            输出的类型。始终为 `logs`.

            - `"logs"`

        - `Image object { type, url }`

          代码解释器输出的图像。

          - `type: "image"`

            输出的类型。始终为 `image`.

            - `"image"`

          - `url: string`

            代码解释器输出图像的 URL。

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

      在本地 shell 上运行命令的工具调用。

      - `id: string`

        本地 shell 调用的唯一 ID。

      - `action: object { command, env, type, 3 more }`

        在服务端执行 shell 命令。

        - `command: array of string`

          要运行的命令。

        - `env: map[string]`

          为该命令设置的环境变量。

        - `type: "exec"`

          本地 shell 操作的类型。始终为 `exec`.

          - `"exec"`

        - `timeout_ms: optional number or null`

          该命令的可选超时时间（毫秒）。

        - `user: optional string or null`

          运行该命令所使用的可选用户。

        - `working_directory: optional string or null`

          运行该命令的可选工作目录。

      - `call_id: string`

        由模型生成的本地 shell 工具调用的唯一 ID。

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

        由模型生成的本地 shell 工具调用的唯一 ID。

      - `output: string`

        本地 shell 工具调用输出的 JSON 字符串。

      - `type: "local_shell_call_output"`

        本地 shell 工具调用输出的类型。始终为 `local_shell_call_output`.

        - `"local_shell_call_output"`

      - `status: optional "in_progress" or "completed" or "incomplete" or null`

        该项的状态。取值之一为 `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `ShellCall object { action, call_id, type, 4 more }`

      表示执行一个或多个 shell 命令请求的工具。

      - `action: object { commands, max_output_length, timeout_ms }`

        描述如何运行该工具调用的 shell 命令和限制。

        - `commands: array of string`

          由执行环境按顺序运行的 shell 命令。

        - `max_output_length: optional number or null`

          从合并的 stdout 和 stderr 输出中捕获的最大 UTF-8 字符数。

        - `timeout_ms: optional number or null`

          允许 shell 命令运行的最大挂钟时间（毫秒）。

      - `call_id: string`

        由模型生成的 shell 工具调用的唯一 ID。

      - `type: "shell_call"`

        该项的类型。始终为 `shell_call`.

        - `"shell_call"`

      - `id: optional string or null`

        shell 工具调用的唯一 ID。当此项通过 API 返回时填充。

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

        执行 shell 命令的环境。

        - `LocalEnvironment object { type, skills }`

        - `ContainerReference object { container_id, type }`

      - `status: optional "in_progress" or "completed" or "incomplete" or null`

        shell 调用的状态。取值之一 `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `ShellCallOutput object { call_id, output, type, 4 more }`

      由 shell 工具调用发出的流式输出项。

      - `call_id: string`

        由模型生成的 shell 工具调用的唯一 ID。

      - `output: array of ResponseFunctionShellCallOutputContent`

        捕获的 stdout 和 stderr 输出块及其相关结果。

        - `outcome: object { type }  or object { exit_code, type }`

          与此 shell 调用关联的退出或超时结果。

          - `Timeout object { type }`

            表示 shell 调用超出了其配置的时间限制。

            - `type: "timeout"`

              结果类型。始终为 `timeout`.

              - `"timeout"`

          - `Exit object { exit_code, type }`

            表示 shell 命令已执行完毕并返回了退出码。

            - `exit_code: number`

              shell 进程返回的退出码。

            - `type: "exit"`

              结果类型。始终为 `exit`.

              - `"exit"`

        - `stderr: string`

          为该 shell 调用捕获的 stderr 输出。

        - `stdout: string`

          为该 shell 调用捕获的 stdout 输出。

      - `type: "shell_call_output"`

        该项的类型。始终为 `shell_call_output`.

        - `"shell_call_output"`

      - `id: optional string or null`

        shell 工具调用输出的唯一 ID。当通过 API 返回此项时填充。

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

        为此 shell 调用的 combined output 捕获的最大 UTF-8 字符数。

      - `status: optional "in_progress" or "completed" or "incomplete" or null`

        shell 调用输出的状态。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `ApplyPatchCall object { call_id, operation, status, 3 more }`

      表示使用 diff 补丁创建、删除或更新文件的工具调用。

      - `call_id: string`

        模型生成的 apply patch 工具调用的唯一 ID。

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

            相对于工作区根目录的要删除的文件路径。

          - `type: "delete_file"`

            操作类型。始终为 `delete_file`.

            - `"delete_file"`

        - `UpdateFile object { diff, path, type }`

          通过 apply_patch 工具更新现有文件的指令。

          - `diff: string`

            要应用到现有文件的 unified diff 内容。

          - `path: string`

            相对于工作区根目录的要更新的文件路径。

          - `type: "update_file"`

            操作类型。始终为 `update_file`.

            - `"update_file"`

      - `status: "in_progress" or "completed"`

        apply patch 工具调用的状态。取值为 `in_progress` 或 `completed`.

        - `"in_progress"`

        - `"completed"`

      - `type: "apply_patch_call"`

        该项的类型。始终为 `apply_patch_call`.

        - `"apply_patch_call"`

      - `id: optional string or null`

        apply patch 工具调用的唯一 ID。当通过 API 返回此条目时填充。

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

        模型生成的 apply patch 工具调用的唯一 ID。

      - `status: "completed" or "failed"`

        apply patch 工具调用输出的状态。取值为 `completed` 或 `failed`.

        - `"completed"`

        - `"failed"`

      - `type: "apply_patch_call_output"`

        该项的类型。始终为 `apply_patch_call_output`.

        - `"apply_patch_call_output"`

      - `id: optional string or null`

        apply patch 工具调用输出的唯一 ID。当通过 API 返回此条目时填充。

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

        apply patch 工具的可读日志文本（例如补丁结果或错误）。

    - `McpListTools object { id, server_label, tools, 2 more }`

      MCP 服务器上可用的工具列表。

      - `id: string`

        该列表的唯一 ID。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        该项的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `error: optional string or null`

        服务器无法列出工具时的错误消息。

    - `McpApprovalRequest object { id, arguments, name, 2 more }`

      对工具调用的人工审批请求。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        该工具的参数 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        该项的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

    - `McpApprovalResponse object { approval_request_id, approve, type, 2 more }`

      对 MCP 审批请求的响应。

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        该项的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `id: optional string or null`

        审批响应的唯一 ID

      - `reason: optional string or null`

        可选的决策原因。

    - `McpCall object { id, arguments, name, 6 more }`

      对 MCP 服务器上工具的调用。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数 JSON 字符串。

      - `name: string`

        已运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        该项的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        MCP 工具调用审批请求的唯一标识符。
        在后续的 `mcp_approval_response` 输入中包含此值以批准或拒绝相应的工具调用。

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

        工具调用的状态。取值之一 `in_progress`, `completed`, `incomplete`, `calling`，或 `failed`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

        - `"calling"`

        - `"failed"`

    - `CustomToolCallOutput object { call_id, output, type, 2 more }`

      你代码中自定义工具调用的输出，被发回给模型。

      - `call_id: string`

        调用 ID，用于将此自定义工具调用输出映射到自定义工具调用。

      - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

        由你的代码产生的自定义工具调用的输出。
        可以是字符串或输出内容列表。

        - `StringOutput = string`

          自定义工具调用输出的字符串。

        - `OutputContentList = array of ResponseInputText or ResponseInputImage or ResponseInputFile`

          自定义工具调用的文本、图片或文件输出。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            提供给模型的文本输入。

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

      - `type: "custom_tool_call_output"`

        自定义工具调用输出的类型。始终为 `custom_tool_call_output`.

        - `"custom_tool_call_output"`

      - `id: optional string`

        在 OpenAI 平台上自定义工具调用输出的唯一 ID。

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

    - `CustomToolCall object { call_id, input, name, 4 more }`

      对模型创建的自定义工具的调用。

      - `call_id: string`

        用于将此自定义工具调用映射到工具调用输出的标识符。

      - `input: string`

        由模型生成的自定义工具调用的输入。

      - `name: string`

        正在调用的自定义工具的名称。

      - `type: "custom_tool_call"`

        自定义工具调用的类型。始终为 `custom_tool_call`.

        - `"custom_tool_call"`

      - `id: optional string`

        在 OpenAI 平台上自定义工具调用的唯一 ID。

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

        正在调用的自定义工具的命名空间。

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

        要引用的项的 ID。

      - `type: optional "item_reference" or null`

        要引用的条目类型。始终为 `item_reference`.

        - `"item_reference"`

    - `Program object { id, call_id, code, 2 more }`

      - `id: string`

        该程序条目的唯一 ID。

      - `call_id: string`

        该程序条目的稳定调用 ID。

      - `code: string`

        由程序化工具调用执行的 JavaScript 源代码。

      - `fingerprint: string`

        必须原样回传的不透明程序重放指纹。

      - `type: "program"`

        条目类型。始终为 `program`.

        - `"program"`

    - `ProgramOutput object { id, call_id, result, 2 more }`

      - `id: string`

        该程序输出条目的唯一 ID。

      - `call_id: string`

        该程序条目的调用 ID。

      - `result: string`

        该程序条目生成的结果。

      - `status: "completed" or "incomplete"`

        程序输出的终态状态。

        - `"completed"`

        - `"incomplete"`

      - `type: "program_output"`

        条目类型。始终为 `program_output`.

        - `"program_output"`

- `instructions: optional string or null`

  插入到模型上下文中的系统（或开发者）消息。
  。当与 `previous_response_id`，一起使用时，上一次响应中的指令不会延续到下一次响应。这样可以方便地在新响应中替换系统（或开发者）消息。

- `previous_response_id: optional string or null`

  上一次模型响应的唯一 ID。使用它来创建多轮对话。详细了解 [对话状态](/docs/guides/conversation-state)。不能与 `conversation`.

- `prompt_cache_key: optional string or null`

  读取或写入提示缓存时使用的密钥。

- `prompt_cache_options: optional object { mode, ttl }  or null`

  提示缓存选项。支持 `gpt-5.6` 及更高版本模型。默认情况下，OpenAI 会自动选择一个隐式缓存断点。可以使用 `prompt_cache_breakpoint`。为内容块添加显式断点。每个请求最多可写入四个断点。在缓存匹配时，OpenAI 会考虑对话中最多最近的 80 个断点，且不限制内容块回溯范围。将 `mode` 设置为 `explicit` 以禁用隐式断点。 `ttl` 默认为 `30m`，这是当前唯一支持的值。参见 [提示缓存指南](/docs/guides/prompt-caching) 了解最新详情。

  - `mode: optional "implicit" or "explicit"`

    控制是否允许 OpenAI 自动创建隐式缓存断点。默认为 `implicit`。设置为 `implicit`，时，OpenAI 会创建一个隐式断点，并写入请求中最近的最多三个显式断点。设置为 `explicit`，时，OpenAI 不会创建隐式断点，并写入请求中最近的最多四个显式断点。如果没有显式断点，则该请求不使用提示缓存。

    - `"implicit"`

    - `"explicit"`

  - `ttl: optional "30m"`

    应用于该请求所写入的每个隐式和显式缓存断点的最短生存时间。默认为 `30m`，这是当前唯一支持的值。后端可能会将缓存条目保留更长时间。

    - `"30m"`

- `prompt_cache_retention: optional "in_memory" or "24h" or null`

  本次请求所创建的提示缓存条目的保留时长。

  - `"in_memory"`

  - `"24h"`

- `service_tier: optional "auto" or "default" or "fast" or 2 more or null`

  指定用于处理该请求的处理类型。   - 若设置为 'auto'，则请求将使用项目设置中配置的服务层级。除非另行配置，项目将使用 'default'。   - 若设置为 'default'，则请求将按所选模型的标准定价和性能进行处理。   - 若设置为 '[flex](/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。   - 若要在请求级别启用 [Fast 模式](/api/docs/guides/fast-mode) ，请为 Responses 或 Chat Completions 包含 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你是否在请求中指定了 `service_tier=fast` 或 `priority` 。   - 若未设置，默认行为为 'auto'。
  当 `service_tier` 参数时，响应正文将包含基于实际用于处理请求的处理模式的 `service_tier` 值。此响应值可能与参数中设置的值不同。

  - `"auto"`

  - `"default"`

  - `"fast"`

  - `"flex"`

  - `"priority"`

### Returns

- `CompactedResponse object { id, created_at, object, 2 more }`

  - `id: string`

    压缩响应的唯一标识符。

  - `created_at: number`

    创建压缩对话时的 Unix 时间戳（以秒为单位）。

  - `object: "response.compaction"`

    对象类型。始终为 `response.compaction`.

    - `"response.compaction"`

  - `output: array of Message or object { id, call_id, code, 2 more }  or object { id, call_id, result, 2 more }  or 25 more`

    压缩后的输出项列表。

    - `Message object { id, content, role, 3 more }`

      与模型之间发送或接收的消息。

      - `id: string`

        消息的唯一 ID。

      - `content: array of ResponseInputText or ResponseOutputText or TextContent or 6 more`

        消息内容

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          提供给模型的文本输入。

          - `text: string`

            发送给模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseOutputText object { annotations, logprobs, text, type }`

          模型的一条文本输出。

          - `annotations: array of object { file_id, filename, index, type }  or object { end_index, start_index, title, 2 more }  or object { container_id, end_index, file_id, 3 more }  or object { file_id, index, type }`

            文本输出的注释。

            - `FileCitation object { file_id, filename, index, type }`

              对一个文件的引用。

              - `file_id: string`

                文件的 ID。

              - `filename: string`

                所引用文件的文件名。

              - `index: number`

                文件列表中该文件的索引。

              - `type: "file_citation"`

                文件引用的类型。始终为 `file_citation`.

                - `"file_citation"`

            - `URLCitation object { end_index, start_index, title, 2 more }`

              用于生成模型回复的网页资源引用。

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

              用于生成模型回复的容器文件引用。

              - `container_id: string`

                容器文件的 ID。

              - `end_index: number`

                消息中容器文件引用最后一个字符的索引。

              - `file_id: string`

                文件的 ID。

              - `filename: string`

                所引用容器文件的文件名。

              - `start_index: number`

                消息中容器文件引用第一个字符的索引。

              - `type: "container_file_citation"`

                容器文件引用的类型。始终为 `container_file_citation`.

                - `"container_file_citation"`

            - `FilePath object { file_id, index, type }`

              文件的路径。

              - `file_id: string`

                文件的 ID。

              - `index: number`

                文件列表中该文件的索引。

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

        - `TextContent object { text, type }`

          文本内容。

          - `text: string`

          - `type: "text"`

            - `"text"`

        - `SummaryTextContent object { text, type }`

          模型生成的摘要文本。

          - `text: string`

            到目前为止模型推理输出的摘要。

          - `type: "summary_text"`

            对象的类型。始终为 `summary_text`.

            - `"summary_text"`

        - `ReasoningText object { text, type }`

          模型生成的推理文本。

          - `text: string`

            来自模型的推理文本。

          - `type: "reasoning_text"`

            推理文本的类型。始终为 `reasoning_text`.

            - `"reasoning_text"`

        - `ResponseOutputRefusal object { refusal, type }`

          模型的拒绝回复。

          - `refusal: string`

            模型给出的拒绝说明。

          - `type: "refusal"`

            拒绝的类型。始终为 `refusal`.

            - `"refusal"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

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

            发送给模型的文件的 ID。

          - `image_url: optional string or null`

            发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ComputerScreenshotContent object { detail, file_id, image_url, 2 more }`

          计算机屏幕截图。

          - `detail: ImageDetail`

            发送给模型的截图图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `file_id: string or null`

            包含截图的已上传文件的标识符。

          - `image_url: string or null`

            截图图片的 URL。

          - `type: "computer_screenshot"`

            指定事件类型。对于计算机截图，此属性始终设置为 `computer_screenshot`.

            - `"computer_screenshot"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 用量。使用 `low` 可获得更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            发送给模型的文件内容。

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `file_url: optional string`

            要发送给模型的文件的 URL。

          - `filename: optional string`

            要发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `role: "unknown" or "user" or "assistant" or 5 more`

        消息的角色。可选值为 `unknown`, `user`, `assistant`, `system`, `critic`, `discriminator`, `developer`，或 `tool`.

        - `"unknown"`

        - `"user"`

        - `"assistant"`

        - `"system"`

        - `"critic"`

        - `"discriminator"`

        - `"developer"`

        - `"tool"`

      - `status: "in_progress" or "completed" or "incomplete"`

        条目的状态。取值之一为 `in_progress`, `completed`，或 `incomplete`。当通过 API 返回条目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "message"`

        消息的类型。始终设置为 `message`.

        - `"message"`

      - `phase: optional "commentary" or "final_answer" or null`

        将消息标记为 `assistant` 中间评论（`commentary`）或最终回答（`final_answer`)。对于类似 `gpt-5.3-codex` 等模型，在发送后续请求时，请在所有助手消息上保留并重新发送 phase 参数——省略它可能会降低性能。该参数不用于用户消息。

        - `"commentary"`

        - `"final_answer"`

    - `Program object { id, call_id, code, 2 more }`

      - `id: string`

        程序项的唯一 ID。

      - `call_id: string`

        该程序条目的稳定调用 ID。

      - `code: string`

        由程序化工具调用执行的 JavaScript 源代码。

      - `fingerprint: string`

        必须原样回传的不透明程序重放指纹。

      - `type: "program"`

        该项的类型。始终为 `program`.

        - `"program"`

    - `ProgramOutput object { id, call_id, result, 2 more }`

      - `id: string`

        程序输出项的唯一 ID。

      - `call_id: string`

        该程序条目的调用 ID。

      - `result: string`

        该程序条目生成的结果。

      - `status: "completed" or "incomplete"`

        程序输出项的终止状态。

        - `"completed"`

        - `"incomplete"`

      - `type: "program_output"`

        该项的类型。始终为 `program_output`.

        - `"program_output"`

    - `FunctionCall object { arguments, call_id, name, 5 more }`

      用于运行函数的工具调用。请参阅
      [函数调用指南](/docs/guides/function-calling) 了解更多信息。

      - `arguments: string`

        传递给函数的参数的 JSON 字符串。

      - `call_id: string`

        模型生成的函数工具调用的唯一 ID。

      - `name: string`

        要运行的函数名称。

      - `type: "function_call"`

        函数工具调用的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        函数工具调用的唯一 ID。

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

        该项的状态。取值之一为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回条目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `ToolSearchCall object { id, arguments, call_id, 4 more }`

      - `id: string`

        工具搜索调用条目的唯一 ID。

      - `arguments: unknown`

        用于工具搜索调用的参数。

      - `call_id: string or null`

        由模型生成的工具搜索调用的唯一 ID。

      - `execution: "server" or "client"`

        工具搜索由服务端还是客户端执行。

        - `"server"`

        - `"client"`

      - `status: "in_progress" or "completed" or "incomplete"`

        已记录的工具搜索调用条目的状态。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "tool_search_call"`

        该项的类型。始终为 `tool_search_call`.

        - `"tool_search_call"`

      - `created_by: optional string`

        创建该条目的行为者的标识符。

    - `ToolSearchOutput object { id, call_id, execution, 4 more }`

      - `id: string`

        工具搜索输出条目的唯一 ID。

      - `call_id: string or null`

        由模型生成的工具搜索调用的唯一 ID。

      - `execution: "server" or "client"`

        工具搜索由服务端还是客户端执行。

        - `"server"`

        - `"client"`

      - `status: "in_progress" or "completed" or "incomplete"`

        已记录的工具搜索输出条目的状态。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        工具搜索返回的已加载工具定义。

        - `Function object { name, parameters, strict, 5 more }`

          在你自己的代码中定义一个可供模型选择调用的函数。详细了解 [函数调用](https://platform.openai.com/docs/guides/function-calling).

          - `name: string`

            要调用的函数名称。

          - `parameters: map[unknown] or null`

            用于描述函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            此函数工具是否启用严格的参数校验。

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

            函数的描述，供模型用来决定是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            描述此函数的字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          用于从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 tool](https://platform.openai.com/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索 工具的类型。通常为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选条件。

            - `ComparisonFilter object { key, type, value }`

              用于通过定义的比较操作将指定的属性键与给定值进行比较的筛选条件。

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
                - `in`：包含于
                - `nin`：不包含于

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

              使用以下方式组合多个筛选条件 `and` 或 `or`.

              - `filters: array of ComparisonFilter or unknown`

                要组合的筛选条件数组。各项可以为 `ComparisonFilter` 或 `CompoundFilter`.

                - `ComparisonFilter object { key, type, value }`

                  用于通过定义的比较操作将指定的属性键与给定值进行比较的筛选条件。

                - `unknown`

              - `type: "and" or "or"`

                操作类型： `and` 或 `or`.

                - `"and"`

                - `"or"`

          - `max_num_results: optional number`

            要返回的最大结果数。该数值应介于 1 到 50 之间（含端点）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              在启用混合搜索时，用于控制互逆排名融合（reciprocal rank fusion）在语义嵌入匹配与稀疏关键词匹配之间平衡程度的权重。

              - `embedding_weight: number`

                互逆排名融合中嵌入的权重。

              - `text_weight: number`

                互逆排名融合中文本匹配的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，取值范围为 0 到 1。越接近 1 的数值会尝试仅返回相关性最高的结果，但返回的结果数量可能会更少。

        - `Computer object { type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

          - `type: "computer"`

            计算机工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

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

            计算机使用工具的类型。始终为 `computer_use_preview`.

            - `"computer_use_preview"`

        - `WebSearch object { type, external_web_access, filters, 2 more }`

          在互联网上搜索与提示词相关的来源。了解更多关于
          [网页搜索工具](/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。取值为 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许网页搜索实时访问互联网。省略时默认值为 true。当值为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的筛选条件。

            - `allowed_domains: optional array of string or null`

              允许搜索的域名。如果未提供，则允许所有域名。
              所提供域名的子域名同样被允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            搜索所使用的上下文窗口空间的高级指引。可选值为以下之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              近似位置的类型。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议
          （MCP）服务器，为模型提供对其他工具的访问能力。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            该 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的筛选器对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或为只读。如果某个
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此筛选器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可与远程 MCP 服务器一起使用的 OAuth 访问令牌，可搭配
            自定义 MCP 服务器 URL 或服务连接器使用。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的那些连接器。必须提供其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 。了解更多
            关于服务连接器的 [信息](/docs/guides/tools-remote-mcp#connectors).

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

            此 MCP 工具是否被延迟，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的筛选器对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的筛选器对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或为只读。如果某个
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的筛选器对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或为只读。如果某个
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `CodeInterpreter object { container, type, allowed_callers }`

          运行 Python 代码以帮助生成对提示词响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID 或一个对象，该对象
            指定可供你的代码使用的已上传文件 ID，以及一个
            可选的 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定要用于运行代码的文件 ID。

              - `type: "auto"`

                始终为 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                可供你的代码使用的已上传文件的可选列表。

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

                    当类型为时允许访问的域名列表 `allowlist`.

                  - `type: "allowlist"`

                    仅允许向指定域进行出站网络访问。始终为 `allowlist`.

                    - `"allowlist"`

                  - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                    用于已加入白名单域的可选域范围密钥。

                    - `domain: string`

                      与该密钥关联的域。

                    - `name: string`

                      为该域注入的密钥名称。

                    - `value: string`

                      为该域注入的密钥值。

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

            设置生成图像的背景。可选值为 `transparent`,
            `opaque`，或 `auto`。之一。受支持的 GPT Image 模型可使用透明背景。对于
            受支持的 GPT Image 模型。对于 `gpt-image-2` 和
            `gpt-image-2-2026-04-21`，该功能处于预览阶段。当使用
            `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像风格和特征（尤其是面部特征）时所投入的精力。该参数仅在 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本模型中受支持，在 `gpt-image-1-mini`。中不受支持。支持的值包括 `high` 和 `low`。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于局部重绘的可选蒙版。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

            - `file_id: optional string`

              蒙版图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的蒙版图像。

          - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

            要使用的图像生成模型。可选值为 `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
            `gpt-image-1`.

            - `string`

            - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

              要使用的图像生成模型。可选值为 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
              `gpt-image-1`.

              - `"gpt-image-1"`

              - `"gpt-image-1-mini"`

              - `"gpt-image-1.5"`

              - `"gpt-image-2"`

              - `"gpt-image-2-2026-04-21"`

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

            在流式模式下要生成的中间图片数量，范围为 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or "auto"`

            生成图像的质量。可选值为 `low`, `medium`, `high`,
            或 `auto`。默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式指定的任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 由 GPT 图像模型支持； `auto` 由允许自动调整尺寸的模型支持。对于 `dall-e-2`，使用以下值之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下值之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式指定的任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 由 GPT 图像模型支持； `auto` 由允许自动调整尺寸的模型支持。对于 `dall-e-2`，使用以下值之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下值之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

                为此请求自动创建一个容器

                - `"container_auto"`

              - `file_ids: optional array of string`

                可供你的代码使用的已上传文件的可选列表。

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

                      Base64 编码的技能 zip 包。

                    - `media_type: "application/zip"`

                      内联技能负载的媒体类型，必须为 `application/zip`.

                      - `"application/zip"`

                    - `type: "base64"`

                      内联技能来源的类型，必须为 `base64`.

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

                所引用容器的 ID。

              - `type: "container_reference"`

                引用通过 /v1/containers 端点创建的容器。

                - `"container_reference"`

        - `Custom object { name, type, allowed_callers, 3 more }`

          使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/docs/guides/function-calling#custom-tools)

          - `name: string`

            自定义工具的名称，用于在工具调用中识别它。

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

          在共享命名空间下对函数/自定义工具进行分组。

          - `description: string`

            展示给模型的命名空间描述。

          - `name: string`

            用于工具调用中的命名空间名称（例如， `crm`).

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

                此函数是否应被延迟并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                用于描述此函数工具字符串输出中所编码 JSON 值的 JSON Schema。该字段不描述 content 数组形式的输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。如果省略，对于兼容的 schema，Responses 会尝试使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 3 more }`

              使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/docs/guides/function-calling#custom-tools)

              - `name: string`

                自定义工具的名称，用于在工具调用中识别它。

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

            展示给模型的、由客户端执行的工具搜索工具的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端执行还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具会在网页中搜索可在响应中使用的相关结果。详细了解 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。取值为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            搜索所使用的上下文窗口空间的高级指引。可选值为以下之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户所在位置。

            - `type: "approximate"`

              近似位置的类型。始终为 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

        - `ApplyPatch object { type, allowed_callers }`

          允许助手使用 unified diff 创建、删除或更新文件。

          - `type: "apply_patch"`

            工具的类型。始终为 `apply_patch`.

            - `"apply_patch"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

      - `type: "tool_search_output"`

        该项的类型。始终为 `tool_search_output`.

        - `"tool_search_output"`

      - `created_by: optional string`

        创建该条目的行为者的标识符。

    - `AdditionalTools object { id, role, tools, type }`

      - `id: string`

        附加工具条目的唯一 ID。

      - `role: "unknown" or "user" or "assistant" or 5 more`

        提供附加工具的角色。

        - `"unknown"`

        - `"user"`

        - `"assistant"`

        - `"system"`

        - `"critic"`

        - `"discriminator"`

        - `"developer"`

        - `"tool"`

      - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        在此条目中可用的附加工具定义。

        - `Function object { name, parameters, strict, 5 more }`

          在你自己的代码中定义一个可供模型选择调用的函数。详细了解 [函数调用](https://platform.openai.com/docs/guides/function-calling).

          - `name: string`

            要调用的函数名称。

          - `parameters: map[unknown] or null`

            用于描述函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            此函数工具是否启用严格的参数校验。

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

            函数的描述，供模型用来决定是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            描述此函数的字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          用于从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 tool](https://platform.openai.com/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索 工具的类型。通常为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选条件。

            - `ComparisonFilter object { key, type, value }`

              用于通过定义的比较操作将指定的属性键与给定值进行比较的筛选条件。

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个筛选条件 `and` 或 `or`.

          - `max_num_results: optional number`

            要返回的最大结果数。该数值应介于 1 到 50 之间（含端点）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              在启用混合搜索时，用于控制互逆排名融合（reciprocal rank fusion）在语义嵌入匹配与稀疏关键词匹配之间平衡程度的权重。

              - `embedding_weight: number`

                互逆排名融合中嵌入的权重。

              - `text_weight: number`

                互逆排名融合中文本匹配的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，取值范围为 0 到 1。越接近 1 的数值会尝试仅返回相关性最高的结果，但返回的结果数量可能会更少。

        - `Computer object { type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

          - `type: "computer"`

            计算机工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

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

            计算机使用工具的类型。始终为 `computer_use_preview`.

            - `"computer_use_preview"`

        - `WebSearch object { type, external_web_access, filters, 2 more }`

          在互联网上搜索与提示词相关的来源。了解更多关于
          [网页搜索工具](/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。取值为 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许网页搜索实时访问互联网。省略时默认值为 true。当值为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的筛选条件。

            - `allowed_domains: optional array of string or null`

              允许搜索的域名。如果未提供，则允许所有域名。
              所提供域名的子域名同样被允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            搜索所使用的上下文窗口空间的高级指引。可选值为以下之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              近似位置的类型。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议
          （MCP）服务器，为模型提供对其他工具的访问能力。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            该 MCP 服务器的标签，用于在工具调用中标识它。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许使用的工具名称列表或过滤对象。

            - `McpAllowedTools = array of string`

              允许的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的筛选器对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或为只读。如果某个
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此筛选器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可与远程 MCP 服务器一起使用的 OAuth 访问令牌，可搭配
            自定义 MCP 服务器 URL 或服务连接器使用。你的应用
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的那些连接器。必须提供其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 。了解更多
            关于服务连接器的 [信息](/docs/guides/tools-remote-mcp#connectors).

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

            此 MCP 工具是否被延迟，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与工具关联的筛选器对象
              ，这些工具需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的筛选器对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或为只读。如果某个
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的筛选器对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或为只读。如果某个
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此筛选器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `CodeInterpreter object { container, type, allowed_callers }`

          运行 Python 代码以帮助生成对提示词响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID 或一个对象，该对象
            指定可供你的代码使用的已上传文件 ID，以及一个
            可选的 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定要用于运行代码的文件 ID。

              - `type: "auto"`

                始终为 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                可供你的代码使用的已上传文件的可选列表。

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

            设置生成图像的背景。可选值为 `transparent`,
            `opaque`，或 `auto`。之一。受支持的 GPT Image 模型可使用透明背景。对于
            受支持的 GPT Image 模型。对于 `gpt-image-2` 和
            `gpt-image-2-2026-04-21`，该功能处于预览阶段。当使用
            `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像风格和特征（尤其是面部特征）时所投入的精力。该参数仅在 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本模型中受支持，在 `gpt-image-1-mini`。中不受支持。支持的值包括 `high` 和 `low`。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于局部重绘的可选蒙版。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

            - `file_id: optional string`

              蒙版图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的蒙版图像。

          - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

            要使用的图像生成模型。可选值为 `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
            `gpt-image-1`.

            - `string`

            - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

              要使用的图像生成模型。可选值为 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
              `gpt-image-1`.

              - `"gpt-image-1"`

              - `"gpt-image-1-mini"`

              - `"gpt-image-1.5"`

              - `"gpt-image-2"`

              - `"gpt-image-2-2026-04-21"`

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

            在流式模式下要生成的中间图片数量，范围为 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or "auto"`

            生成图像的质量。可选值为 `low`, `medium`, `high`,
            或 `auto`。默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式指定的任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 由 GPT 图像模型支持； `auto` 由允许自动调整尺寸的模型支持。对于 `dall-e-2`，使用以下值之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下值之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式指定的任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 由 GPT 图像模型支持； `auto` 由允许自动调整尺寸的模型支持。对于 `dall-e-2`，使用以下值之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下值之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

        - `Custom object { name, type, allowed_callers, 3 more }`

          使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/docs/guides/function-calling#custom-tools)

          - `name: string`

            自定义工具的名称，用于在工具调用中识别它。

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

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认为无约束文本。

        - `Namespace object { description, name, tools, type }`

          在共享命名空间下对函数/自定义工具进行分组。

          - `description: string`

            展示给模型的命名空间描述。

          - `name: string`

            用于工具调用中的命名空间名称（例如， `crm`).

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

                此函数是否应被延迟并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                用于描述此函数工具字符串输出中所编码 JSON 值的 JSON Schema。该字段不描述 content 数组形式的输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。如果省略，对于兼容的 schema，Responses 会尝试使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 3 more }`

              使用指定格式处理输入的自定义工具。了解更多关于   [自定义工具](/docs/guides/function-calling#custom-tools)

              - `name: string`

                自定义工具的名称，用于在工具调用中识别它。

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

            展示给模型的、由客户端执行的工具搜索工具的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端执行还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具会在网页中搜索可在响应中使用的相关结果。详细了解 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。取值为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            搜索所使用的上下文窗口空间的高级指引。可选值为以下之一 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户所在位置。

            - `type: "approximate"`

              近似位置的类型。始终为 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

        - `ApplyPatch object { type, allowed_callers }`

          允许助手使用 unified diff 创建、删除或更新文件。

          - `type: "apply_patch"`

            工具的类型。始终为 `apply_patch`.

            - `"apply_patch"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

      - `type: "additional_tools"`

        该项的类型。始终为 `additional_tools`.

        - `"additional_tools"`

    - `FunctionCallOutput object { output, type, id, 5 more }`

      函数工具调用的输出。

      - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

        由你的代码生成的函数调用的输出。
        可以是字符串或输出内容列表。

        - `StringOutput = string`

          函数调用输出的字符串。

        - `OutputContentList = array of ResponseInputText or ResponseInputImage or ResponseInputFile`

          函数调用的文本、图片或文件输出。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            提供给模型的文本输入。

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

      - `type: "function_call_output"`

        函数工具调用输出的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string`

        函数工具调用输出的唯一 ID。当此条目
        通过 API 返回时填充。

      - `call_id: optional string`

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

      - `name: optional string`

        生成该输出的工具名称。

      - `namespace: optional string`

        生成该输出的工具命名空间。

      - `status: optional "in_progress" or "completed" or "incomplete"`

        该项的状态。取值之一为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回条目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `FileSearchCall object { id, queries, status, 2 more }`

      文件搜索 工具调用的结果。参见
      [文件搜索 指南](/docs/guides/tools-file-search) 了解更多信息。

      - `id: string`

        文件搜索 工具调用的唯一 ID。

      - `queries: array of string`

        用于搜索文件的查询语句。

      - `status: "in_progress" or "searching" or "completed" or 2 more`

        文件搜索 工具调用的状态。取值为 `in_progress`,
        `searching`, `incomplete` 或 `failed`,

        - `"in_progress"`

        - `"searching"`

        - `"completed"`

        - `"incomplete"`

        - `"failed"`

      - `type: "file_search_call"`

        文件搜索 工具调用的类型。始终为 `file_search_call`.

        - `"file_search_call"`

      - `results: optional array of object { attributes, file_id, filename, 2 more }  or null`

        文件搜索 工具调用的结果。

        - `attributes: optional map[string or number or boolean] or null`

          可以附加到对象的 16 组键值对。这对于以结构化
          格式存储对象的附加信息，以及通过 API 或仪表板查询对象非常有用。键为字符串，
          最大长度为 64 个字符。值为字符串，最大
          长度为 512 个字符、布尔值或数字。
          长度为 512 个字符、布尔值或数字。

          - `string`

          - `number`

          - `boolean`

        - `file_id: optional string`

          文件的唯一 ID。

        - `filename: optional string`

          文件的名称。

        - `score: optional number`

          文件的相关性评分，取值在 0 到 1 之间。

        - `text: optional string`

          从文件中检索到的文本。

    - `WebSearchCall object { id, action, status, type }`

      网页搜索工具调用的结果。参阅
      [网页搜索指南](/docs/guides/tools-web-search) 了解更多信息。

      - `id: string`

        网页搜索工具调用的唯一 ID。

      - `action: object { type, queries, query, sources }  or object { type, url }  or object { pattern, type, url }`

        描述此次 网页搜索调用中所执行的具体操作的对象。
        包含模型使用网页方式的详细信息（search、open_page、find_in_page）。

        - `Search object { type, queries, query, sources }`

          操作类型 "search" - 执行 网页搜索查询。

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

              来源类型。始终为 `url`.

              - `"url"`

            - `url: string`

              来源的 URL。

        - `OpenPage object { type, url }`

          操作类型 "open_page" - 从搜索结果中打开特定 URL。

          - `type: "open_page"`

            操作类型。

            - `"open_page"`

          - `url: optional string or null`

            模型打开的 URL。

        - `FindInPage object { pattern, type, url }`

          操作类型 "find_in_page"：在已加载页面内搜索匹配模式。

          - `pattern: string`

            在页面中要搜索的模式或文本。

          - `type: "find_in_page"`

            操作类型。

            - `"find_in_page"`

          - `url: string`

            搜索该模式的页面的 URL。

      - `status: "in_progress" or "searching" or "completed" or "failed"`

        网页搜索工具调用的状态。

        - `"in_progress"`

        - `"searching"`

        - `"completed"`

        - `"failed"`

      - `type: "web_search_call"`

        网页搜索工具调用的类型。始终为 `web_search_call`.

        - `"web_search_call"`

    - `ImageGenerationCall object { id, result, status, type }`

      模型发起的图像生成请求。

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

    - `ComputerCall object { id, call_id, pending_safety_checks, 4 more }`

      对计算机使用工具的工具调用。参见
      [计算机使用指南](/docs/guides/tools-computer-use) 了解更多信息。

      - `id: string`

        计算机调用的唯一 ID。

      - `call_id: string`

        在向工具调用返回输出时所使用的标识符。

      - `pending_safety_checks: array of object { id, code, message }`

        计算机调用的待处理安全检查。

        - `id: string`

          待处理安全检查的 ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          待处理安全检查的详细信息。

      - `status: "in_progress" or "completed" or "incomplete"`

        该项的状态。取值之一为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回条目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "computer_call"`

        计算机调用的类型。始终为 `computer_call`.

        - `"computer_call"`

      - `action: optional ComputerAction`

        点击操作。

        - `Click object { button, type, x, 2 more }`

          点击操作。

          - `button: "left" or "right" or "wheel" or 2 more`

            指示在点击时按下了哪个鼠标按钮。取值之一为 `left`, `right`, `wheel`, `back`，或 `forward`.

            - `"left"`

            - `"right"`

            - `"wheel"`

            - `"back"`

            - `"forward"`

          - `type: "click"`

            指定事件类型。对于点击操作，该属性始终为 `click`.

            - `"click"`

          - `x: number`

            发生点击的 x 坐标。

          - `y: number`

            发生点击的 y 坐标。

          - `keys: optional array of string or null`

            点击时按住的按键。

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

            表示拖动操作路径的坐标数组。坐标将以对象数组的形式出现，例如

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

          模型希望执行的一系列按键操作。

          - `keys: array of string`

            模型请求按下的按键组合。这是一个字符串数组，每个字符串代表一个按键。

          - `type: "keypress"`

            指定事件类型。对于按键操作，此属性始终设置为 `keypress`.

            - `"keypress"`

        - `Move object { type, x, y, keys }`

          鼠标移动操作。

          - `type: "move"`

            指定事件类型。对于移动操作，此属性始终设置为 `move`.

            - `"move"`

          - `x: number`

            要移至的 x 坐标。

          - `y: number`

            要移至的 y 坐标。

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

            发生滚动时的 x 坐标。

          - `y: number`

            发生滚动时的 y 坐标。

          - `keys: optional array of string or null`

            滚动时按住的按键。

        - `Type object { text, type }`

          用于输入文本的操作。

          - `text: string`

            要输入的文本。

          - `type: "type"`

            指定事件类型。对于输入操作，此属性始终设置为 `type`.

            - `"type"`

        - `Wait object { type }`

          等待操作。

          - `type: "wait"`

            指定事件类型。对于等待操作，此属性始终设置为 `wait`.

            - `"wait"`

      - `actions: optional ComputerActionList`

        针对 `computer_use`。的扁平化批量操作。每个操作都包含一个
        `type` 鉴别字段以及操作专属字段。

        - `Click object { button, type, x, 2 more }`

          点击操作。

        - `DoubleClick object { keys, type, x, y }`

          双击操作。

        - `Drag object { path, type, keys }`

          拖动操作。

        - `Keypress object { keys, type }`

          模型希望执行的一系列按键操作。

        - `Move object { type, x, y, keys }`

          鼠标移动操作。

        - `Screenshot object { type }`

          截图操作。

        - `Scroll object { scroll_x, scroll_y, type, 3 more }`

          滚动操作。

        - `Type object { text, type }`

          用于输入文本的操作。

        - `Wait object { type }`

          等待操作。

    - `ComputerCallOutput object { id, call_id, output, 4 more }`

      - `id: string`

        计算机调用工具输出的唯一 ID。

      - `call_id: string`

        生成该输出的计算机工具调用的 ID。

      - `output: ResponseComputerToolCallOutputScreenshot`

        与计算机使用工具配合使用的计算机截图图像。

        - `type: "computer_screenshot"`

          指定事件类型。对于计算机截图，此属性
          始终设置为 `computer_screenshot`.

          - `"computer_screenshot"`

        - `file_id: optional string`

          包含截图的已上传文件的标识符。

        - `image_url: optional string`

          截图图片的 URL。

      - `status: "completed" or "incomplete" or "failed" or "in_progress"`

        输入消息的状态。取值为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回输入项时填充。

        - `"completed"`

        - `"incomplete"`

        - `"failed"`

        - `"in_progress"`

      - `type: "computer_call_output"`

        计算机工具调用输出的类型。始终为 `computer_call_output`.

        - `"computer_call_output"`

      - `acknowledged_safety_checks: optional array of object { id, code, message }`

        由 API 上报的、已被
        开发者确认的安全检查。

        - `id: string`

          待处理安全检查的 ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          待处理安全检查的详细信息。

      - `created_by: optional string`

        创建该条目的行为者的标识符。

    - `Reasoning object { id, summary, type, 3 more }`

      推理模型在生成响应时使用的思维链描述。请务必将这些项包含在
      传回给 Responses API `input` 的输入中，以便在手动管理
      上下文时用于对话的后续轮次。
      [管理上下文](/docs/guides/conversation-state).

      - `id: string`

        推理内容的唯一标识符。

      - `summary: array of SummaryTextContent`

        推理摘要内容。

        - `text: string`

          到目前为止模型推理输出的摘要。

        - `type: "summary_text"`

          对象的类型。始终为 `summary_text`.

      - `type: "reasoning"`

        对象的类型。始终为 `reasoning`.

        - `"reasoning"`

      - `content: optional array of object { text, type }`

        推理文本内容。

        - `text: string`

          来自模型的推理文本。

        - `type: "reasoning_text"`

          推理文本的类型。始终为 `reasoning_text`.

          - `"reasoning_text"`

      - `encrypted_content: optional string or null`

        推理项的加密内容。默认情况下会填充该字段
        用于通过 `POST /v1/responses` 和 WebSocket
        `response.create` 请求返回的推理项。

        流式传输时，请在后续请求中使用已完成的推理项及其
        `encrypted_content` 中的 `response.output_item.done` 事件。
        后续请求。该 `encrypted_content` 中的
        `response.output_item.added` 可能不完整。这一点尤其
        重要，当 `store` 为 `false` 或使用 Zero Data Retention 时。

      - `status: optional "in_progress" or "completed" or "incomplete"`

        该项的状态。取值之一为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回条目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `Compaction object { id, encrypted_content, type, created_by }`

      由该模型生成的压缩项 [`v1/responses/compact` API](/docs/api-reference/responses/compact).

      - `id: string`

        压缩条目的唯一 ID。

      - `encrypted_content: string`

        由压缩产生的加密内容。

      - `type: "compaction"`

        该项的类型。始终为 `compaction`.

        - `"compaction"`

      - `created_by: optional string`

        创建该条目的行为者的标识符。

    - `CodeInterpreterCall object { id, code, container_id, 3 more }`

      用于运行代码的工具调用。

      - `id: string`

        代码解释器工具调用的唯一 ID。

      - `code: string or null`

        要运行的代码，若不可用则为 null。

      - `container_id: string`

        用于运行代码的容器 ID。

      - `outputs: array of object { logs, type }  or object { type, url }  or null`

        代码解释器生成的输出，例如日志或图像。
        如果没有可用输出，可以为 null。

        - `Logs object { logs, type }`

          代码解释器输出的日志。

          - `logs: string`

            代码解释器输出的日志。

          - `type: "logs"`

            输出的类型。始终为 `logs`.

            - `"logs"`

        - `Image object { type, url }`

          代码解释器输出的图像。

          - `type: "image"`

            输出的类型。始终为 `image`.

            - `"image"`

          - `url: string`

            代码解释器输出图像的 URL。

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

      在本地 shell 上运行命令的工具调用。

      - `id: string`

        本地 shell 调用的唯一 ID。

      - `action: object { command, env, type, 3 more }`

        在服务端执行 shell 命令。

        - `command: array of string`

          要运行的命令。

        - `env: map[string]`

          为该命令设置的环境变量。

        - `type: "exec"`

          本地 shell 操作的类型。始终为 `exec`.

          - `"exec"`

        - `timeout_ms: optional number or null`

          该命令的可选超时时间（毫秒）。

        - `user: optional string or null`

          运行该命令所使用的可选用户。

        - `working_directory: optional string or null`

          运行该命令的可选工作目录。

      - `call_id: string`

        由模型生成的本地 shell 工具调用的唯一 ID。

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

        由模型生成的本地 shell 工具调用的唯一 ID。

      - `output: string`

        本地 shell 工具调用输出的 JSON 字符串。

      - `type: "local_shell_call_output"`

        本地 shell 工具调用输出的类型。始终为 `local_shell_call_output`.

        - `"local_shell_call_output"`

      - `status: optional "in_progress" or "completed" or "incomplete" or null`

        该项的状态。取值之一为 `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `ShellCall object { id, action, call_id, 5 more }`

      在托管环境中执行一个或多个 shell 命令的工具调用。

      - `id: string`

        shell 工具调用的唯一 ID。当此项通过 API 返回时填充。

      - `action: object { commands, max_output_length, timeout_ms }`

        描述如何运行该工具调用的 shell 命令和限制。

        - `commands: array of string`

        - `max_output_length: number or null`

          每个命令返回结果的可选最大字符数。

        - `timeout_ms: number or null`

          命令的可选超时时间（毫秒）。

      - `call_id: string`

        由模型生成的 shell 工具调用的唯一 ID。

      - `environment: ResponseLocalEnvironment or ResponseContainerReference or null`

        表示使用本地环境执行 shell 操作。

        - `ResponseLocalEnvironment object { type }`

          表示使用本地环境执行 shell 操作。

          - `type: "local"`

            环境类型。始终为 `local`.

            - `"local"`

        - `ResponseContainerReference object { container_id, type }`

          表示通过 /v1/containers 创建的容器。

          - `container_id: string`

          - `type: "container_reference"`

            环境类型。始终为 `container_reference`.

            - `"container_reference"`

      - `status: "in_progress" or "completed" or "incomplete"`

        shell 调用的状态。取值之一 `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "shell_call"`

        该项的类型。始终为 `shell_call`.

        - `"shell_call"`

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

      - `created_by: optional string`

        创建此工具调用的实体 ID。

    - `ShellCallOutput object { id, call_id, max_output_length, 5 more }`

      已发出的 shell 工具调用的输出。

      - `id: string`

        shell 调用输出的唯一 ID。当此条目通过 API 返回时填充。

      - `call_id: string`

        由模型生成的 shell 工具调用的唯一 ID。

      - `max_output_length: number or null`

        shell 命令输出的最大长度。此值由模型生成，应与原始输出一起传回。

      - `output: array of object { outcome, stderr, stdout, created_by }`

        shell 调用输出内容的数组

        - `outcome: object { type }  or object { exit_code, type }`

          表示 shell 调用输出块的结果（带有退出码）或超时结果。

          - `Timeout object { type }`

            表示 shell 调用超出了其配置的时间限制。

            - `type: "timeout"`

              结果类型。始终为 `timeout`.

              - `"timeout"`

          - `Exit object { exit_code, type }`

            表示 shell 命令已执行完毕并返回了退出码。

            - `exit_code: number`

              shell 进程的退出码。

            - `type: "exit"`

              结果类型。始终为 `exit`.

              - `"exit"`

        - `stderr: string`

          捕获到的标准错误输出。

        - `stdout: string`

          捕获到的标准输出。

        - `created_by: optional string`

          创建该条目的行为者的标识符。

      - `status: "in_progress" or "completed" or "incomplete"`

        shell 调用输出的状态。取值为 `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "shell_call_output"`

        shell 调用输出的类型。始终为 `shell_call_output`.

        - `"shell_call_output"`

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

      - `created_by: optional string`

        创建该条目的行为者的标识符。

    - `ApplyPatchCall object { id, call_id, operation, 4 more }`

      通过创建、删除或更新文件来应用文件差异的工具调用。

      - `id: string`

        apply patch 工具调用的唯一 ID。当通过 API 返回此条目时填充。

      - `call_id: string`

        模型生成的 apply patch 工具调用的唯一 ID。

      - `operation: object { diff, path, type }  or object { path, type }  or object { diff, path, type }`

        通过 apply_patch 应用的 create_file、delete_file 或 update_file 操作之一。

        - `CreateFile object { diff, path, type }`

          描述如何通过 apply_patch 工具创建文件的指令。

          - `diff: string`

            Diff to apply.

          - `path: string`

            Path of the file to create.

          - `type: "create_file"`

            Create a new file with the provided diff.

            - `"create_file"`

        - `DeleteFile object { path, type }`

          Instruction describing how to delete a file via the apply_patch tool.

          - `path: string`

            Path of the file to delete.

          - `type: "delete_file"`

            Delete the specified file.

            - `"delete_file"`

        - `UpdateFile object { diff, path, type }`

          Instruction describing how to update a file via the apply_patch tool.

          - `diff: string`

            Diff to apply.

          - `path: string`

            Path of the file to update.

          - `type: "update_file"`

            Update an existing file with the provided diff.

            - `"update_file"`

      - `status: "in_progress" or "completed"`

        apply patch 工具调用的状态。取值为 `in_progress` 或 `completed`.

        - `"in_progress"`

        - `"completed"`

      - `type: "apply_patch_call"`

        该项的类型。始终为 `apply_patch_call`.

        - `"apply_patch_call"`

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

      - `created_by: optional string`

        创建此工具调用的实体 ID。

    - `ApplyPatchCallOutput object { id, call_id, status, 4 more }`

      The output emitted by an apply patch tool call.

      - `id: string`

        apply patch 工具调用输出的唯一 ID。当通过 API 返回此条目时填充。

      - `call_id: string`

        模型生成的 apply patch 工具调用的唯一 ID。

      - `status: "completed" or "failed"`

        apply patch 工具调用输出的状态。取值为 `completed` 或 `failed`.

        - `"completed"`

        - `"failed"`

      - `type: "apply_patch_call_output"`

        该项的类型。始终为 `apply_patch_call_output`.

        - `"apply_patch_call_output"`

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

      - `created_by: optional string`

        The ID of the entity that created this tool call output.

      - `output: optional string or null`

        Optional textual output returned by the apply patch tool.

    - `McpListTools object { id, server_label, tools, 2 more }`

      MCP 服务器上可用的工具列表。

      - `id: string`

        该列表的唯一 ID。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于该工具的附加注解。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        该项的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `error: optional string or null`

        服务器无法列出工具时的错误消息。

    - `McpApprovalRequest object { id, arguments, name, 2 more }`

      对工具调用的人工审批请求。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        该工具的参数 JSON 字符串。

      - `name: string`

        要运行的工具名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        该项的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

    - `McpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      对 MCP 审批请求的响应。

      - `id: string`

        审批响应的唯一 ID

      - `approval_request_id: string`

        正在回复的审批请求的 ID。

      - `approve: boolean`

        请求是否已批准。

      - `type: "mcp_approval_response"`

        该项的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `McpCall object { id, arguments, name, 6 more }`

      对 MCP 服务器上工具的调用。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数 JSON 字符串。

      - `name: string`

        已运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        该项的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        MCP 工具调用审批请求的唯一标识符。
        在后续的 `mcp_approval_response` 输入中包含此值以批准或拒绝相应的工具调用。

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

        工具调用的状态。取值之一 `in_progress`, `completed`, `incomplete`, `calling`，或 `failed`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

        - `"calling"`

        - `"failed"`

    - `CustomToolCall object { call_id, input, name, 4 more }`

      对模型创建的自定义工具的调用。

      - `call_id: string`

        用于将此自定义工具调用映射到工具调用输出的标识符。

      - `input: string`

        由模型生成的自定义工具调用的输入。

      - `name: string`

        正在调用的自定义工具的名称。

      - `type: "custom_tool_call"`

        自定义工具调用的类型。始终为 `custom_tool_call`.

        - `"custom_tool_call"`

      - `id: optional string`

        在 OpenAI 平台上自定义工具调用的唯一 ID。

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

        正在调用的自定义工具的命名空间。

    - `CustomToolCallOutput object { call_id, output, type, 2 more }`

      你代码中自定义工具调用的输出，被发回给模型。

      - `call_id: string`

        调用 ID，用于将此自定义工具调用输出映射到自定义工具调用。

      - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

        由你的代码产生的自定义工具调用的输出。
        可以是字符串或输出内容列表。

        - `StringOutput = string`

          自定义工具调用输出的字符串。

        - `OutputContentList = array of ResponseInputText or ResponseInputImage or ResponseInputFile`

          自定义工具调用的文本、图片或文件输出。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            提供给模型的文本输入。

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

      - `type: "custom_tool_call_output"`

        自定义工具调用输出的类型。始终为 `custom_tool_call_output`.

        - `"custom_tool_call_output"`

      - `id: optional string`

        在 OpenAI 平台上自定义工具调用输出的唯一 ID。

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

  - `usage: ResponseUsage`

    Token accounting for the compaction pass, including cached, reasoning, and total tokens.

    - `input_tokens: number`

      The number of input tokens.

    - `input_tokens_details: object { cache_write_tokens, cached_tokens }`

      A detailed breakdown of the input tokens.

      - `cache_write_tokens: number`

        The number of input tokens that were written to the cache.

      - `cached_tokens: number`

        The number of tokens that were retrieved from the cache.
        [More on prompt caching](/docs/guides/prompt-caching).

    - `output_tokens: number`

      The number of output tokens.

    - `output_tokens_details: object { reasoning_tokens }`

      A detailed breakdown of the output tokens.

      - `reasoning_tokens: number`

        推理 token 的数量。

    - `total_tokens: number`

      使用的 token 总数。

    - `compute_units: optional number or null`

      本次请求的计算单元。在可用时，当前为 null。

### 示例

```http
curl https://api.openai.com/v1/responses/compact \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "model": "gpt-5.6-sol",
          "previous_response_id": "resp_123"
        }'
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "object": "response.compaction",
  "output": [
    {
      "id": "id",
      "content": [
        {
          "text": "text",
          "type": "input_text",
          "prompt_cache_breakpoint": {
            "mode": "explicit"
          }
        }
      ],
      "role": "unknown",
      "status": "in_progress",
      "type": "message",
      "phase": "commentary"
    }
  ],
  "usage": {
    "input_tokens": 0,
    "input_tokens_details": {
      "cache_write_tokens": 0,
      "cached_tokens": 0
    },
    "output_tokens": 0,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 0,
    "compute_units": 0
  }
}
```

### 示例

```http
curl -X POST https://api.openai.com/v1/responses/compact \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
      "model": "gpt-5.6-sol",
      "input": [
        {
          "role": "user",
          "content": "Create a simple landing page for a dog petting café."
        },
        {
          "id": "msg_001",
          "type": "message",
          "status": "completed",
          "content": [
            {
              "type": "output_text",
              "annotations": [],
              "logprobs": [],
              "text": "Below is a single file, ready-to-use landing page for a dog petting café:..."
            }
          ],
          "role": "assistant"
        }
      ]
    }'
```

#### 响应

```json
{
  "id": "resp_001",
  "object": "response.compaction",
  "created_at": 1764967971,
  "output": [
    {
      "id": "msg_000",
      "type": "message",
      "status": "completed",
      "content": [
        {
          "type": "input_text",
          "text": "Create a simple landing page for a dog petting cafe."
        }
      ],
      "role": "user"
    },
    {
      "id": "cmp_001",
      "type": "compaction",
      "encrypted_content": "gAAAAABpM0Yj-...="
    }
  ],
  "usage": {
    "input_tokens": 139,
    "input_tokens_details": {
      "cached_tokens": 0,
      "cache_write_tokens": 0
    },
    "output_tokens": 438,
    "output_tokens_details": {
      "reasoning_tokens": 64
    },
    "total_tokens": 577
  }
}
```
