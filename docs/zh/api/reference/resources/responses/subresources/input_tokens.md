# Input Tokens

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

## 获取输入令牌计数

**后** `/responses/input_tokens`

返回请求的输入 token 数。

返回一个对象，其中 `object` 设置为 `response.input_tokens` 以及一个 `input_tokens` 计数。

### Body Parameters

- `conversation: optional string or ResponseConversationParam or null`

  此响应所属的对话。来自该对话的项目会被前置到 `input_items` 本次响应请求中。
  此响应的输入项和输出项会在本次响应完成后自动添加到此对话中。

  - `ConversationID = string`

    对话的唯一 ID。

  - `ResponseConversationParam object { id }`

    此响应所属的对话。

    - `id: string`

      对话的唯一 ID。

- `input: optional string or array of EasyInputMessage or object { content, role, status, type }  or ResponseOutputMessage or 30 more or null`

  提供给模型的文本、图像或文件输入，用于生成响应

  - `string`

    对模型的文本输入，等价于带有 `user` 角色的文本输入。

  - `array of EasyInputMessage or object { content, role, status, type }  or ResponseOutputMessage or 30 more`

    包含不同内容类型的一个或多个对模型输入项的列表。

    - `EasyInputMessage object { content, role, phase, type }`

      对模型的消息输入，其角色用于指示指令遵循
      的层级关系。使用 `developer` 或 `system` 角色给出的指令优先于使用
      角色给出的指令。带有 `user` 角色的消息假定为模型在之前
      `assistant` 交互中生成的内容。
      交互中生成的内容。

      - `content: string or ResponseInputMessageContentList`

        对模型的文本、图像或音频输入，用于生成响应。
        也可以包含之前的助手响应。

        - `TextInput = string`

          对模型的文本输入。

        - `ResponseInputMessageContentList = array of ResponseInputContent`

          发送给模型的一个或多个输入项列表，包含不同的内容
          类型。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            对模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

            - `detail: ImageDetail`

              发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

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

              要发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

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

              要发送给模型的文件名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

      - `role: "user" or "assistant" or "system" or "developer"`

        消息输入的角色，取值之一 `user`, `assistant`, `system`，或
        `developer`.

        - `"user"`

        - `"assistant"`

        - `"system"`

        - `"developer"`

      - `phase: optional "commentary" or "final_answer" or null`

        将 `assistant` 消息标记为中间评论（`commentary`）或最终答案（`final_answer`).
        对于类似 `gpt-5.3-codex` 及更高版本，发送后续请求时，请在所有助手消息上保留并重新发送
        phase——删除它可能会降低性能。不用于用户消息。

        - `"commentary"`

        - `"final_answer"`

      - `type: optional "message"`

        消息输入的类型，始终为 `message`.

        - `"message"`

    - `Message object { content, role, status, type }`

      对模型的消息输入，其角色用于指示指令遵循
      的层级关系。使用 `developer` 或 `system` 角色给出的指令优先于使用
      角色给出的指令。带有 `user` 角色的文本输入。

      - `content: ResponseInputMessageContentList`

        发送给模型的一个或多个输入项列表，包含不同的内容
        类型。

      - `role: "user" or "system" or "developer"`

        消息输入的角色，取值之一 `user`, `system`，或 `developer`.

        - `"user"`

        - `"system"`

        - `"developer"`

      - `status: optional "in_progress" or "completed" or "incomplete"`

        条目的状态，取值之一 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回条目时填充。

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

          模型输出的文本。

          - `annotations: array of object { file_id, filename, index, type }  or object { end_index, start_index, title, 2 more }  or object { container_id, end_index, file_id, 3 more }  or object { file_id, index, type }`

            文本输出的注释。

            - `FileCitation object { file_id, filename, index, type }`

              对文件的引用。

              - `file_id: string`

                文件的 ID。

              - `filename: string`

                所引用文件的文件名。

              - `index: number`

                文件在文件列表中的索引。

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

          模型返回的拒绝信息。

          - `refusal: string`

            模型返回的拒绝说明。

          - `type: "refusal"`

            拒绝的类型。始终为 `refusal`.

            - `"refusal"`

      - `role: "assistant"`

        输出消息的角色。始终为 `assistant`.

        - `"assistant"`

      - `status: "in_progress" or "completed" or "incomplete"`

        消息输入的状态。取值为 `in_progress`, `completed`，或
        `incomplete`。当输入项通过 API 返回时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "message"`

        输出消息的类型。始终为 `message`.

        - `"message"`

      - `phase: optional "commentary" or "final_answer" or null`

        将 `assistant` 消息标记为中间评论（`commentary`）或最终答案（`final_answer`).
        对于类似 `gpt-5.3-codex` 及更高版本，发送后续请求时，请在所有助手消息上保留并重新发送
        phase——删除它可能会降低性能。不用于用户消息。

        - `"commentary"`

        - `"final_answer"`

    - `FileSearchCall object { id, queries, status, 2 more }`

      文件搜索 工具调用的结果。详见
      [文件搜索 指南](/api/docs/guides/tools-file-search) 以获取更多信息。

      - `id: string`

        文件搜索 工具调用的唯一 ID。

      - `queries: array of string`

        用于搜索文件的查询。

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

          可以附加到对象的 16 个键值对集合。可用于
          以结构化格式存储关于对象的附加信息，并通过
          API 或仪表板查询对象。键为字符串，
          最大长度为 64 个字符。值为字符串（最大
          长度 512 个字符）、布尔值或数字。

          - `string`

          - `number`

          - `boolean`

        - `file_id: optional string`

          文件的唯一 ID。

        - `filename: optional string`

          文件的名称。

        - `score: optional number`

          文件的相关性评分，取值范围为 0 到 1。

        - `text: optional string`

          从该文件中检索到的文本。

    - `ComputerCall object { id, call_id, pending_safety_checks, 4 more }`

      对计算机使用工具的工具调用。参见
      [computer use guide](/api/docs/guides/tools-computer-use) 以获取更多信息。

      - `id: string`

        计算机调用的唯一 ID。

      - `call_id: string`

        在响应工具调用并提供输出时使用的标识符。

      - `pending_safety_checks: array of object { id, code, message }`

        针对该计算机调用的待处理安全检查。

        - `id: string`

          待处理安全检查的 ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          关于待处理安全检查的详细信息。

      - `status: "in_progress" or "completed" or "incomplete"`

        该项的状态。可选值为 `in_progress`, `completed`，或
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

            指明点击时按下了哪个鼠标按键。可选值为 `left`, `right`, `wheel`, `back`，或 `forward`.

            - `"left"`

            - `"right"`

            - `"wheel"`

            - `"back"`

            - `"forward"`

          - `type: "click"`

            指定事件类型。对于点击操作，此属性始终为 `click`.

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

          模型希望执行的按键操作的集合。

          - `keys: array of string`

            模型请求按下的按键组合。这是一组字符串，每个字符串代表一个按键。

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

            发生滚动处的 x 坐标。

          - `y: number`

            发生滚动处的 y 坐标。

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

        为 `computer_use`。扁平化后的批量操作。每个操作都包含一个
        `type` 判别字段以及操作特有的字段。

        - `Click object { button, type, x, 2 more }`

          点击操作。

        - `DoubleClick object { keys, type, x, y }`

          双击操作。

        - `Drag object { path, type, keys }`

          拖动操作。

        - `Keypress object { keys, type }`

          模型希望执行的按键操作的集合。

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

      一次计算机工具调用的输出。

      - `call_id: string`

        产生该输出的计算机工具调用的 ID。

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

        计算机工具调用输出的类型。始终 `computer_call_output`.

        - `"computer_call_output"`

      - `id: optional string or null`

        计算机工具调用输出的 ID。

      - `acknowledged_safety_checks: optional array of object { id, code, message }  or null`

        开发者已确认的 API 所报告的安全检查。

        - `id: string`

          待处理安全检查的 ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          关于待处理安全检查的详细信息。

      - `status: optional "in_progress" or "completed" or "incomplete" or null`

        消息输入的状态。取值为 `in_progress`, `completed`，或 `incomplete`。当输入项通过 API 返回时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `WebSearchCall object { id, action, status, type }`

      网页搜索 工具调用的结果。请参阅
      [网页搜索 指南](/api/docs/guides/tools-web-search) 以获取更多信息。

      - `id: string`

        网页搜索 工具调用的唯一 ID。

      - `action: object { type, queries, query, sources }  or object { type, url }  or object { pattern, type, url }`

        描述本次 网页搜索 调用中所执行具体操作的对象。
        包含模型如何使用网页的详细信息（search、open_page、find_in_page）。

        - `Search object { type, queries, query, sources }`

          操作类型 "search" - 执行一次 网页搜索 查询。

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

              来源的类型。始终 `url`.

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

            在其中搜索该模式的页面的 URL。

      - `status: "in_progress" or "searching" or "completed" or 2 more`

        网页搜索 工具调用的状态。

        - `"in_progress"`

        - `"searching"`

        - `"completed"`

        - `"failed"`

        - `"incomplete"`

      - `type: "web_search_call"`

        网页搜索 工具调用的类型。始终为 `web_search_call`.

        - `"web_search_call"`

    - `FunctionCall object { arguments, call_id, name, 6 more }`

      运行某个函数的工具调用。请参阅
      [函数调用指南](/api/docs/guides/function-calling) 以获取更多信息。

      - `arguments: string`

        传递给函数的参数的 JSON 字符串。

      - `call_id: string`

        由模型生成的函数工具调用的唯一 ID。

      - `name: string`

        要运行的函数名称。

      - `type: "function_call"`

        函数工具调用的类型。始终为 `function_call`.

        - `"function_call"`

      - `id: optional string`

        函数工具调用的唯一 ID。

      - `async: optional boolean`

        该函数工具调用是否以异步方式运行。

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

        该项的状态。可选值为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回条目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `FunctionCallOutput object { output, type, id, 5 more }`

      函数工具调用的输出。

      - `output: string or array of ResponseInputTextContent or ResponseInputImageContent or ResponseInputFileContent`

        函数工具调用的文本、图像或文件输出。

        - `string`

          函数工具调用输出的 JSON 字符串。

        - `array of ResponseInputTextContent or ResponseInputImageContent or ResponseInputFileContent`

          该函数工具调用的内容输出（文本、图像、文件）数组。

          - `ResponseInputTextContent object { text, type, prompt_cache_breakpoint }`

            对模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }  or null`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImageContent object { type, detail, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision)

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional ImageDetail or null`

              发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `file_id: optional string or null`

              要发送给模型的文件 ID。

            - `image_url: optional string or null`

              要发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图像。

            - `prompt_cache_breakpoint: optional object { mode }  or null`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFileContent object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入 token 用量。使用 `low` 进行较低成本的渲染，或 `high` 以更高质量渲染文件。默认为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string or null`

              要发送到模型的文件的 base64 编码数据。

            - `file_id: optional string or null`

              要发送给模型的文件 ID。

            - `file_url: optional string or null`

              要发送给模型的文件的 URL。

            - `filename: optional string or null`

              要发送给模型的文件名称。

            - `prompt_cache_breakpoint: optional object { mode }  or null`

              标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会对齐到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

      - `type: "function_call_output"`

        函数工具调用输出的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string or null`

        函数工具调用输出的唯一 ID。当此条目通过 API 返回时填充。

      - `call_id: optional string or null`

        由模型生成的函数工具调用的唯一 ID。

      - `caller: optional object { type }  or object { caller_id, type }  or null`

        生成此工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            调用者类型。始终为 `direct`.

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            生成此工具调用的程序项的调用 ID。

          - `type: "program"`

            调用者类型。始终为 `program`.

            - `"program"`

      - `name: optional string or null`

        生成该输出的工具的名称。

      - `namespace: optional string or null`

        生成该输出的工具的命名空间。

      - `status: optional "in_progress" or "completed" or "incomplete" or null`

        该项的状态。可选值为 `in_progress`, `completed`，或 `incomplete`。当通过 API 返回条目时填充。

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

        工具搜索输出返回的已加载工具定义。

        - `Function object { name, parameters, strict, 6 more }`

          在你自己代码中定义一个可供模型选择调用的函数。了解更多关于 [函数调用](/api/docs/guides/function-calling).

          - `name: string`

            要调用的函数的名称。

          - `parameters: map[unknown] or null`

            描述该函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否为此函数工具强制执行严格的参数校验。

          - `type: "function"`

            函数工具的类型。始终为 `function`.

            - `"function"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

          - `defer_loading: optional boolean`

            该函数是否延迟加载并通过工具搜索加载。

          - `description: optional string or null`

            对该函数的描述。由模型用于判断是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            用于描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 工具](/api/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索工具的类型。始终为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选器。

            - `ComparisonFilter object { key, type, value }`

              用于将指定的属性键与给定值通过定义的比较运算进行比较的筛选器。

              - `key: string`

                要与该值进行比较的键。

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

              使用以下方式组合多个筛选条件 `and` 或 `or`.

              - `filters: array of ComparisonFilter or unknown`

                要组合的筛选条件数组。项可以是 `ComparisonFilter` 或 `CompoundFilter`.

                - `ComparisonFilter object { key, type, value }`

                  用于将指定的属性键与给定值通过定义的比较运算进行比较的筛选器。

                - `unknown`

              - `type: "and" or "or"`

                操作类型： `and` 或 `or`.

                - `"and"`

                - `"or"`

          - `max_num_results: optional number`

            返回结果的最大数量。该数值应介于 1 到 50 之间（含端点）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              在启用混合搜索时，用于控制倒数排名融合在语义嵌入匹配与稀疏关键词匹配之间平衡权重的权重。

              - `embedding_weight: number`

                倒数排名融合中嵌入的权重。

              - `text_weight: number`

                倒数排名融合中文本的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，介于 0 到 1 之间的一个数值。越接近 1 的数值会尝试仅返回相关性最高的结果，但可能会返回更少的结果。

        - `Computer object { type }`

          控制虚拟计算机的工具。了解更多关于 [计算机工具](/api/docs/guides/tools-computer-use).

          - `type: "computer"`

            计算机工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          控制虚拟计算机的工具。了解更多关于 [计算机工具](/api/docs/guides/tools-computer-use).

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

          在互联网上搜索与提示相关的来源。了解更多关于
          [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。取值之一为 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许网页搜索访问实时互联网。省略时默认为 true。当为 false 时，网页搜索工具将以离线/仅缓存模式运行，并且不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的过滤器。

            - `allowed_domains: optional array of string or null`

              允许搜索的域名。如果未提供，则允许所有域名。
              所提供域名的子域名也同样允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高级指导量。可选值之一为 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              用户所在地的两位字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          允许模型通过远程 Model Context Protocol
          （MCP）服务器访问更多工具。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

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

            允许的工具名称列表或过滤器对象。

            - `McpAllowedTools = array of string`

              允许的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可配合
            自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 中的任意一个。了解更多信息
            关于服务连接器 [这里](/api/docs/guides/tools-connectors-mcp#connectors).

            当前支持 `connector_id` 的值为：

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

            该 MCP 工具是否被延迟，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务端的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务端中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务端中哪些工具需要审批。可以是
              `always`, `never`,也可以是与需要审批的工具关联的过滤对象
              需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤器对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤器对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务端的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务端的 URL。可选值之一为 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            要使用的安全 MCP 隧道 ID，而不是直接的服务器 URL。以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `CodeInterpreter object { container, type, allowed_callers }`

          一个运行 Python 代码以帮助生成提示响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID，或是用于指定要提供给代码的已上传文件 ID 以及可选设置的
            指定要提供给代码的已上传文件 ID 以及
            可选的 `memory_limit` 设置的对象。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定要用于运行代码的文件 ID。

              - `type: "auto"`

                始终为 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                一个可选的已上传文件列表，供代码使用。

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

                    仅允许向指定域进行出站网络访问。始终为 `allowlist`.

                    - `"allowlist"`

                  - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                    用于已加入允许列表域的可选域作用域密钥。

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

            生成新图像还是编辑现有图像。默认值： `auto`.

            - `"generate"`

            - `"edit"`

            - `"auto"`

          - `background: optional "transparent" or "opaque" or "auto"`

            设置生成图像的背景。可选值为 `transparent`, `opaque`,
            或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
            其 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
            背景。受支持的 GPT Image
            模型可使用透明背景。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，此支持处于
            预览阶段。使用 `transparent`，时，请将输出格式设置为 `png` 或 `webp`.
            默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所投入的精力。此参数仅支持 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本模型，不支持 `gpt-image-1-mini`。支持 `high` 和 `low`。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于局部重绘的可选蒙版。包含 `image_url`
            (string, optional) 和 `file_id` (string, optional)。

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

            生成图像的内容审核等级。默认值： `auto`.

            - `"auto"`

            - `"low"`

          - `output_compression: optional number`

            输出图像的压缩等级。默认值：100。

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
            包括它们的 `2026-09-08` 快照，也支持 `xhigh` 和 `max`.
            默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

            - `"max"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以字符串形式指定任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须介于 1:3 和 3:1 之间。高于 `2560x1440` 的分辨率为实验性，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边数限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 在支持自动调整大小的模型中受支持。对于 `dall-e-2`,请使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`,请使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以字符串形式指定任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须介于 1:3 和 3:1 之间。高于 `2560x1440` 的分辨率为实验性，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边数限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 在支持自动调整大小的模型中受支持。对于 `dall-e-2`,请使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`,请使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

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

                为本次请求自动创建一个容器

                - `"container_auto"`

              - `file_ids: optional array of string`

                一个可选的已上传文件列表，供代码使用。

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

                      内联技能负载的媒体类型。必须为 `application/zip`.

                      - `"application/zip"`

                    - `type: "base64"`

                      内联技能源的类型。必须为 `base64`.

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

                引用使用 /v1/containers 端点创建的容器

                - `"container_reference"`

        - `Custom object { name, type, allowed_callers, 4 more }`

          使用指定格式处理输入的自定义工具。详细了解   [custom tools](/api/docs/guides/function-calling#custom-tools)

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

            工具响应是否可以异步返回，还是在下次创建响应时立即返回。

          - `defer_loading: optional boolean`

            此工具是否应被延迟并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认是无约束文本。

            - `Text object { type }`

              无约束的自由形式文本。

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

          将函数/自定义工具归入共享命名空间下。

          - `description: string`

            展示给模型的命名空间描述。

          - `name: string`

            用于工具调用中的命名空间名称（例如， `crm`).

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

                工具响应是否可以异步返回，还是在下次创建响应时立即返回。

              - `defer_loading: optional boolean`

                该函数是否应被延迟并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                用于描述该函数工具中以字符串形式输出的 JSON 值的 JSON Schema。这并不描述 content 数组形式的输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。如果省略，Responses 会尝试在 schema 兼容时使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 4 more }`

              使用指定格式处理输入的自定义工具。详细了解   [custom tools](/api/docs/guides/function-calling#custom-tools)

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

                工具响应是否可以异步返回，还是在下次创建响应时立即返回。

              - `defer_loading: optional boolean`

                此工具是否应被延迟并通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认是无约束文本。

          - `type: "namespace"`

            工具的类型。始终为 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          针对延迟工具的托管或 BYOT 工具搜索配置。

          - `type: "tool_search"`

            工具的类型。始终为 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            展示给模型的、用于客户端执行的工具搜索工具的描述。

          - `execution: optional "server" or "client"`

            工具搜索由服务端执行还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            用于客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          该工具会在网页上搜索相关结果以用于回复。了解更多关于 [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。取值之一为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高级指导量。可选值之一为 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户所在的位置。

            - `type: "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              用户所在地的两位字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

        - `ApplyPatch object { type, allowed_callers }`

          允许助手使用统一差异（unified diff）来创建、删除或更新文件。

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

        工具搜索是由服务端还是由客户端执行的。

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

      - `tools: array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        在此条目中提供的额外工具列表。

        - `Function object { name, parameters, strict, 6 more }`

          在你自己代码中定义一个可供模型选择调用的函数。了解更多关于 [函数调用](/api/docs/guides/function-calling).

          - `name: string`

            要调用的函数的名称。

          - `parameters: map[unknown] or null`

            描述该函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否为此函数工具强制执行严格的参数校验。

          - `type: "function"`

            函数工具的类型。始终为 `function`.

            - `"function"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

          - `defer_loading: optional boolean`

            该函数是否延迟加载并通过工具搜索加载。

          - `description: optional string or null`

            对该函数的描述。由模型用于判断是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            用于描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 工具](/api/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索工具的类型。始终为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选器。

            - `ComparisonFilter object { key, type, value }`

              用于将指定的属性键与给定值通过定义的比较运算进行比较的筛选器。

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个筛选条件 `and` 或 `or`.

          - `max_num_results: optional number`

            返回结果的最大数量。该数值应介于 1 到 50 之间（含端点）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              在启用混合搜索时，用于控制倒数排名融合在语义嵌入匹配与稀疏关键词匹配之间平衡权重的权重。

              - `embedding_weight: number`

                倒数排名融合中嵌入的权重。

              - `text_weight: number`

                倒数排名融合中文本的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，介于 0 到 1 之间的一个数值。越接近 1 的数值会尝试仅返回相关性最高的结果，但可能会返回更少的结果。

        - `Computer object { type }`

          控制虚拟计算机的工具。了解更多关于 [计算机工具](/api/docs/guides/tools-computer-use).

          - `type: "computer"`

            计算机工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          控制虚拟计算机的工具。了解更多关于 [计算机工具](/api/docs/guides/tools-computer-use).

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

          在互联网上搜索与提示相关的来源。了解更多关于
          [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。取值之一为 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许网页搜索访问实时互联网。省略时默认为 true。当为 false 时，网页搜索工具将以离线/仅缓存模式运行，并且不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的过滤器。

            - `allowed_domains: optional array of string or null`

              允许搜索的域名。如果未提供，则允许所有域名。
              所提供域名的子域名也同样允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高级指导量。可选值之一为 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              用户所在地的两位字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          允许模型通过远程 Model Context Protocol
          （MCP）服务器访问更多工具。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

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

            允许的工具名称列表或过滤器对象。

            - `McpAllowedTools = array of string`

              允许的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示工具是否会修改数据或是否为只读。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可配合
            自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 中的任意一个。了解更多信息
            关于服务连接器 [这里](/api/docs/guides/tools-connectors-mcp#connectors).

            当前支持 `connector_id` 的值为：

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

            该 MCP 工具是否被延迟，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务端的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务端中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务端中哪些工具需要审批。可以是
              `always`, `never`,也可以是与需要审批的工具关联的过滤对象
              需要审批。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤器对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤器对象。

                - `read_only: optional boolean`

                  指示工具是否会修改数据或是否为只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值之一为 `always` 或
              `never`。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务端的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务端的 URL。可选值之一为 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            要使用的安全 MCP 隧道 ID，而不是直接的服务器 URL。以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `CodeInterpreter object { container, type, allowed_callers }`

          一个运行 Python 代码以帮助生成提示响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID，或是用于指定要提供给代码的已上传文件 ID 以及可选设置的
            指定要提供给代码的已上传文件 ID 以及
            可选的 `memory_limit` 设置的对象。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定要用于运行代码的文件 ID。

              - `type: "auto"`

                始终为 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                一个可选的已上传文件列表，供代码使用。

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

            生成新图像还是编辑现有图像。默认值： `auto`.

            - `"generate"`

            - `"edit"`

            - `"auto"`

          - `background: optional "transparent" or "opaque" or "auto"`

            设置生成图像的背景。可选值为 `transparent`, `opaque`,
            或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
            其 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
            背景。受支持的 GPT Image
            模型可使用透明背景。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，此支持处于
            预览阶段。使用 `transparent`，时，请将输出格式设置为 `png` 或 `webp`.
            默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所投入的精力。此参数仅支持 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本模型，不支持 `gpt-image-1-mini`。支持 `high` 和 `low`。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于局部重绘的可选蒙版。包含 `image_url`
            (string, optional) 和 `file_id` (string, optional)。

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

            生成图像的内容审核等级。默认值： `auto`.

            - `"auto"`

            - `"low"`

          - `output_compression: optional number`

            输出图像的压缩等级。默认值：100。

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
            包括它们的 `2026-09-08` 快照，也支持 `xhigh` 和 `max`.
            默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

            - `"max"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以字符串形式指定任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须介于 1:3 和 3:1 之间。高于 `2560x1440` 的分辨率为实验性，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边数限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 在支持自动调整大小的模型中受支持。对于 `dall-e-2`,请使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`,请使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以字符串形式指定任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须介于 1:3 和 3:1 之间。高于 `2560x1440` 的分辨率为实验性，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边数限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 在支持自动调整大小的模型中受支持。对于 `dall-e-2`,请使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`,请使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

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

          使用指定格式处理输入的自定义工具。详细了解   [custom tools](/api/docs/guides/function-calling#custom-tools)

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

            工具响应是否可以异步返回，还是在下次创建响应时立即返回。

          - `defer_loading: optional boolean`

            此工具是否应被延迟并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认是无约束文本。

        - `Namespace object { description, name, tools, type }`

          将函数/自定义工具归入共享命名空间下。

          - `description: string`

            展示给模型的命名空间描述。

          - `name: string`

            用于工具调用中的命名空间名称（例如， `crm`).

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

                工具响应是否可以异步返回，还是在下次创建响应时立即返回。

              - `defer_loading: optional boolean`

                该函数是否应被延迟并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                用于描述该函数工具中以字符串形式输出的 JSON 值的 JSON Schema。这并不描述 content 数组形式的输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。如果省略，Responses 会尝试在 schema 兼容时使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 4 more }`

              使用指定格式处理输入的自定义工具。详细了解   [custom tools](/api/docs/guides/function-calling#custom-tools)

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

                工具响应是否可以异步返回，还是在下次创建响应时立即返回。

              - `defer_loading: optional boolean`

                此工具是否应被延迟并通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认是无约束文本。

          - `type: "namespace"`

            工具的类型。始终为 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          针对延迟工具的托管或 BYOT 工具搜索配置。

          - `type: "tool_search"`

            工具的类型。始终为 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            展示给模型的、用于客户端执行的工具搜索工具的描述。

          - `execution: optional "server" or "client"`

            工具搜索由服务端执行还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            用于客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          该工具会在网页上搜索相关结果以用于回复。了解更多关于 [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。取值之一为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高级指导量。可选值之一为 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户所在的位置。

            - `type: "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              用户所在地的两位字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

        - `ApplyPatch object { type, allowed_callers }`

          允许助手使用统一差异（unified diff）来创建、删除或更新文件。

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

        此额外工具条目的唯一 ID。

    - `ConfigurationUpdate object { type, id, reasoning }`

      对话响应配置的更新项。该配置
      在后续响应中持续生效，直到被另一次配置更新替
      换为止。

      - `type: "configuration_update"`

        条目类型。始终为 `configuration_update`.

        - `"configuration_update"`

      - `id: optional string or null`

        该配置更新项的唯一 ID。

      - `reasoning: optional object { effort }`

        推理配置的更新。目前仅支持 effort。

        - `effort: optional ReasoningEffort or null`

          后续响应所使用的推理 effort，直到另一次
          配置更新将其替换。

          - `"none"`

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

    - `Reasoning object { id, summary, type, 3 more }`

      推理模型在生成响应时使用的思维链的描述。生成
      响应后，如果你正在手动管理上下文，请务必将这些项 `input` 包含到后续对话轮次的 Responses API
      请求中，以便
      [管理上下文](/api/docs/guides/conversation-state).

      - `id: string`

        该推理内容的唯一标识符。

      - `summary: array of SummaryTextContent`

        推理摘要内容。

        - `text: string`

          模型迄今为止的推理输出摘要。

        - `type: "summary_text"`

          对象的类型。始终为 `summary_text`.

          - `"summary_text"`

      - `type: "reasoning"`

        对象的类型。始终为 `reasoning`.

        - `"reasoning"`

      - `content: optional array of object { text, type }`

        推理文本内容。

        - `text: string`

          模型输出的推理文本。

        - `type: "reasoning_text"`

          推理文本的类型。始终为 `reasoning_text`.

          - `"reasoning_text"`

      - `encrypted_content: optional string or null`

        推理项的加密内容。默认情况下会填充该字段
        用于 `POST /v1/responses` 和 WebSocket
        `response.create` 请求中返回的推理条目。

        流式传输时，请在后续请求中使用已完成的推理条目及其
        `encrypted_content` 来自 `response.output_item.done` 事件。
        后续请求中的 `encrypted_content` 在
        `response.output_item.added` 可能不完整。这在以下情况中尤为
        重要： `store` 是 `false` ，或使用 Zero Data Retention 时。

      - `status: optional "in_progress" or "completed" or "incomplete"`

        该项的状态。可选值为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回条目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `Compaction object { encrypted_content, type, id }`

      由 API 生成的压缩条目 [`v1/responses/compact` 接口](/api/reference/resources/responses/methods/compact).

      - `encrypted_content: string`

        压缩摘要的加密内容。

      - `type: "compaction"`

        条目类型。始终为 `compaction`.

        - `"compaction"`

      - `id: optional string or null`

        压缩条目的 ID。

    - `ImageGenerationCall object { id, result, status, 7 more }`

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

      - `action: optional "generate" or "edit" or "auto" or null`

        用于图像生成的操作。

        - `"generate"`

        - `"edit"`

        - `"auto"`

      - `background: optional "transparent" or "opaque" or "auto" or null`

        生成时使用的背景设置。

        - `"transparent"`

        - `"opaque"`

        - `"auto"`

      - `output_format: optional "png" or "webp" or "jpeg" or null`

        生成时使用的输出格式。

        - `"png"`

        - `"webp"`

        - `"jpeg"`

      - `quality: optional "low" or "medium" or "high" or 3 more or null`

        图像生成工具调用所生成图像的质量。可选值为 `low`, `medium`, `high`, `xhigh`, `max`，或 `auto`.

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

        - `"auto"`

      - `revised_prompt: optional string or null`

        经过任何模型提示词重写后所使用的提示词。

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

        要运行的代码，如果不可用则为 null。

      - `container_id: string`

        用于运行代码的容器 ID。

      - `outputs: array of object { logs, type }  or object { type, url }  or null`

        代码解释器生成的输出，例如日志或图像。
        如果没有可用输出，可能为 null。

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

        该项的状态。可选值为 `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `ShellCall object { action, call_id, type, 4 more }`

      表示请求执行一个或多个 shell 命令的工具。

      - `action: object { commands, max_output_length, timeout_ms }`

        描述如何运行该工具调用的 shell 命令和限制。

        - `commands: array of string`

          供执行环境运行的有序 shell 命令。

        - `max_output_length: optional number or null`

          从合并后的 stdout 和 stderr 输出中捕获的最大 UTF-8 字符数。

        - `timeout_ms: optional number or null`

          允许 shell 命令运行的最长实际经过时间（毫秒）。

      - `call_id: string`

        模型生成的 shell 工具调用的唯一 ID。

      - `type: "shell_call"`

        条目类型。始终为 `shell_call`.

        - `"shell_call"`

      - `id: optional string or null`

        shell 工具调用的唯一 ID。在通过 API 返回此条目时填充。

      - `caller: optional object { type }  or object { caller_id, type }  or null`

        生成此工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            调用者类型。始终为 `direct`.

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            生成此工具调用的程序项的调用 ID。

          - `type: "program"`

            调用者类型。始终为 `program`.

            - `"program"`

      - `environment: optional LocalEnvironment or ContainerReference or null`

        用于执行 shell 命令的环境。

        - `LocalEnvironment object { type, skills }`

        - `ContainerReference object { container_id, type }`

      - `status: optional "in_progress" or "completed" or "incomplete" or null`

        shell 调用的状态，取以下值之一 `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `ShellCallOutput object { call_id, output, type, 4 more }`

      shell 工具调用发出的流式输出条目。

      - `call_id: string`

        模型生成的 shell 工具调用的唯一 ID。

      - `output: array of ResponseFunctionShellCallOutputContent`

        捕获到的 stdout 和 stderr 输出块及其关联的结果。

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

        条目类型。始终为 `shell_call_output`.

        - `"shell_call_output"`

      - `id: optional string or null`

        shell 工具调用输出的唯一 ID。在通过 API 返回此条目时填充。

      - `caller: optional object { type }  or object { caller_id, type }  or null`

        生成此工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            调用者类型。始终为 `direct`.

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            生成此工具调用的程序项的调用 ID。

          - `type: "program"`

            调用者类型。始终为 `program`.

            - `"program"`

      - `max_output_length: optional number or null`

        为该 shell 调用的合并输出捕获的最大 UTF-8 字符数。

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

            创建文件时应用的统一差异（unified diff）内容。

          - `path: string`

            相对于工作区根目录的要创建的文件的路径。

          - `type: "create_file"`

            操作类型。始终 `create_file`.

            - `"create_file"`

        - `DeleteFile object { path, type }`

          通过 apply_patch 工具删除现有文件的指令。

          - `path: string`

            相对于工作区根目录的要删除的文件的路径。

          - `type: "delete_file"`

            操作类型。始终 `delete_file`.

            - `"delete_file"`

        - `UpdateFile object { diff, path, type }`

          通过 apply_patch 工具更新现有文件的指令。

          - `diff: string`

            要应用到现有文件的统一差异（unified diff）内容。

          - `path: string`

            相对于工作区根目录的要更新的文件的路径。

          - `type: "update_file"`

            操作类型。始终 `update_file`.

            - `"update_file"`

      - `status: "in_progress" or "completed"`

        apply patch 工具调用的状态。可选值为 `in_progress` 或 `completed`.

        - `"in_progress"`

        - `"completed"`

      - `type: "apply_patch_call"`

        条目类型。始终为 `apply_patch_call`.

        - `"apply_patch_call"`

      - `id: optional string or null`

        apply patch 工具调用的唯一 ID。当通过 API 返回此条目时填充。

      - `caller: optional object { type }  or object { caller_id, type }  or null`

        生成此工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            调用者类型。始终为 `direct`.

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            生成此工具调用的程序项的调用 ID。

          - `type: "program"`

            调用者类型。始终为 `program`.

            - `"program"`

    - `ApplyPatchCallOutput object { call_id, status, type, 3 more }`

      apply patch 工具调用发出的流式输出。

      - `call_id: string`

        模型生成的 apply patch 工具调用的唯一 ID。

      - `status: "completed" or "failed"`

        apply patch 工具调用输出的状态。可选值为 `completed` 或 `failed`.

        - `"completed"`

        - `"failed"`

      - `type: "apply_patch_call_output"`

        条目类型。始终为 `apply_patch_call_output`.

        - `"apply_patch_call_output"`

      - `id: optional string or null`

        apply patch 工具调用输出的唯一 ID。当通过 API 返回此条目时填充。

      - `caller: optional object { type }  or object { caller_id, type }  or null`

        生成此工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            调用者类型。始终为 `direct`.

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            生成此工具调用的程序项的调用 ID。

          - `type: "program"`

            调用者类型。始终为 `program`.

            - `"program"`

      - `output: optional string or null`

        来自 apply patch 工具的可读的日志文本（例如，补丁结果或错误）。

    - `McpListTools object { id, server_label, tools, 2 more }`

      MCP 服务器上可用工具的列表。

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

          有关该工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        条目类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `error: optional string or null`

        如果服务端无法列出工具，则返回错误信息。

    - `McpApprovalRequest object { id, arguments, name, 2 more }`

      对工具调用进行人工审批的请求。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        要运行的工具的名称。

      - `server_label: string`

        发起请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        条目类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

    - `McpApprovalResponse object { approval_request_id, approve, type, 2 more }`

      对 MCP 审批请求的响应。

      - `approval_request_id: string`

        正在被响应的审批请求的 ID。

      - `approve: boolean`

        请求是否已被批准。

      - `type: "mcp_approval_response"`

        条目类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `id: optional string or null`

        审批响应的唯一 ID

      - `reason: optional string or null`

        可选的决策原因。

    - `McpCall object { id, arguments, name, 6 more }`

      在 MCP 服务器上对某个工具的调用。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        已运行的工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        条目类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        MCP 工具调用审批请求的唯一标识符。
        在后续的 `mcp_approval_response` 输入中包含该值，以批准或拒绝相应的工具调用。

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

      由你的代码生成的自定义工具调用输出，将发送回模型。

      - `call_id: string`

        调用 ID，用于将此自定义工具调用输出映射到自定义工具调用。

      - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

        由你的代码生成的自定义工具调用的输出。
        可以是字符串或输出内容列表。

        - `StringOutput = string`

          自定义工具调用输出的字符串。

        - `OutputContentList = array of ResponseInputText or ResponseInputImage or ResponseInputFile`

          自定义工具调用的文本、图像或文件输出。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            对模型的文本输入。

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/api/docs/guides/images-vision).

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

            调用者类型。始终为 `direct`.

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            生成此工具调用的程序项的调用 ID。

          - `type: "program"`

            调用者类型。始终为 `program`.

            - `"program"`

    - `CustomToolCall object { call_id, input, name, 5 more }`

      对模型创建的自定义工具的调用。

      - `call_id: string`

        用于将此自定义工具调用映射到工具调用输出的标识符。

      - `input: string`

        模型生成的自定义工具调用的输入。

      - `name: string`

        正在调用的自定义工具的名称。

      - `type: "custom_tool_call"`

        自定义工具调用的类型。始终为 `custom_tool_call`.

        - `"custom_tool_call"`

      - `id: optional string`

        在 OpenAI 平台上自定义工具调用的唯一 ID。

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

        被调用的自定义工具的命名空间。

    - `CompactionTrigger object { type, id }`

      压缩当前上下文。必须是最后一个输入项。

      - `type: "compaction_trigger"`

        条目类型。始终为 `compaction_trigger`.

        - `"compaction_trigger"`

      - `id: optional string or null`

        此压缩触发器的唯一 ID。

    - `ItemReference object { id, type }`

      用于引用某项的内部标识符。

      - `id: string`

        要引用的项的 ID。

      - `type: optional "item_reference" or null`

        要引用的项的类型。始终为 `item_reference`.

        - `"item_reference"`

    - `Program object { id, call_id, code, 2 more }`

      - `id: string`

        此程序项的唯一 ID。

      - `call_id: string`

        程序项的稳定调用 ID。

      - `code: string`

        由程序化工具调用执行的 JavaScript 源代码。

      - `fingerprint: string`

        必须往返透传的不透明程序重放指纹。

      - `type: "program"`

        条目类型。始终为 `program`.

        - `"program"`

    - `ProgramOutput object { id, call_id, result, 2 more }`

      - `id: string`

        此程序输出项的唯一 ID。

      - `call_id: string`

        程序项的调用 ID。

      - `result: string`

        由程序项生成的结果。

      - `status: "completed" or "incomplete"`

        程序输出的终态。

        - `"completed"`

        - `"incomplete"`

      - `type: "program_output"`

        条目类型。始终为 `program_output`.

        - `"program_output"`

- `instructions: optional string or null`

  插入到模型上下文中的系统（或开发者）消息。
  当与 `previous_response_id`，一起使用时，上一次响应中的指令不会延续到下一次响应。这便于在新响应中替换系统（或开发者）消息。

- `model: optional string or null`

  用于生成响应的模型 ID，例如 `gpt-4o` 或 `o3`。OpenAI 提供了众多具备不同能力、性能特征和价位的模型，请参阅 [模型指南](/api/docs/models) 以浏览和比较可用的模型。

- `parallel_tool_calls: optional boolean or null`

  是否允许模型并行运行工具调用。

- `personality: optional string or "friendly" or "pragmatic"`

  应用于本次请求的模型自有样式预设。省略此参数将使用模型的默认样式。支持的取值未来可能会增加。取值长度最多为 64 个字符。

  - `string`

  - `"friendly" or "pragmatic"`

    应用于本次请求的模型自有样式预设。省略此参数将使用模型的默认样式。支持的取值未来可能会增加。取值长度最多为 64 个字符。

    - `"friendly"`

    - `"pragmatic"`

- `previous_response_id: optional string or null`

  上一次模型响应的唯一 ID。使用此参数可创建多轮对话。详细了解 [对话状态](/api/docs/guides/conversation-state)。不能与 `conversation`.

- `reasoning: optional Reasoning or null`

  **仅限 gpt-5 和 o 系列模型** 针对以下模型的配置选项： [推理模型](/api/docs/guides/reasoning).

  - `context: optional "auto" or "current_turn" or "all_turns" or null`

    控制在后续轮次中哪些推理项会被回传给模型。
    如果省略或设置为 `auto`，模型将自行决定上下文模式。该
    `gpt-5.6` 模型系列默认为 `all_turns`；较早的模型默认为
    `current_turn`.

    在响应中返回时，这是该响应实际使用的有效推理上下文模式
    。

    - `"auto"`

    - `"current_turn"`

    - `"all_turns"`

  - `effort: optional ReasoningEffort or null`

    限制推理模型在推理上的投入程度。当前支持
    的取值包括 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
    降低推理投入程度可以让响应更快，并减少在单次响应中用于推理的 token 数量
    。并非所有推理模型都支持上述全部取值。
    值。参见
    [推理指南](/api/docs/guides/reasoning)
    以了解模型特定支持情况。

  - `generate_summary: optional "auto" or "concise" or "detailed" or null`

    **已弃用：** 请改用 `summary` 。

    模型执行的推理摘要。这可以用于
    调试和理解模型的推理过程。
    以下值之一： `auto`, `concise`，或 `detailed`.

    - `"auto"`

    - `"concise"`

    - `"detailed"`

  - `mode: optional string or "standard" or "pro"`

    控制请求的推理执行模式。

    在响应中返回时，这是有效的执行模式。

    - `string`

    - `"standard" or "pro"`

      控制请求的推理执行模式。

      在响应中返回时，这是有效的执行模式。

      - `"standard"`

      - `"pro"`

  - `summary: optional "auto" or "concise" or "detailed" or null`

    模型执行的推理摘要。这可以用于
    调试和理解模型的推理过程。
    以下值之一： `auto`, `concise`，或 `detailed`.

    `concise` 支持 `computer-use-preview` 模型及之后的所有推理模型。 `gpt-5`.

    - `"auto"`

    - `"concise"`

    - `"detailed"`

- `text: optional object { format, verbosity }  or null`

  模型文本响应的配置选项。可以是纯
  文本或结构化 JSON 数据。了解更多信息：

  - [文本输入和输出](/api/docs/guides/text)
  - [结构化输出](/api/docs/guides/structured-outputs)

  - `format: optional ResponseFormatTextConfig`

    用于指定模型必须输出的格式的对象。

    配置 `{ "type": "json_schema" }` 可启用结构化输出，
    它能确保模型匹配你提供的 JSON schema。更多信息请参阅
    [Structured Outputs 指南](/api/docs/guides/structured-outputs).

    默认格式为 `{ "type": "text" }` ，不包含其他选项。

    **不建议在 gpt-4o 及更高版本模型上使用：**

    设置为 `{ "type": "json_object" }` 可启用旧版 JSON 模式，它会
    确保模型生成的消息是有效的 JSON。对于支持该模式的模型，推荐使用 `json_schema`
    。

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        正在定义的响应格式的类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

      JSON Schema 响应格式。用于生成结构化的 JSON 响应。
      详细了解 [Structured Outputs](/api/docs/guides/structured-outputs).

      - `name: string`

        响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
        下划线和短横线，最大长度为 64。

      - `schema: map[unknown]`

        响应格式的 schema，以 JSON Schema 对象描述。
        了解如何构建 JSON schema [这里](https://json-schema.org/).

      - `type: "json_schema"`

        正在定义的响应格式的类型。始终为 `json_schema`.

        - `"json_schema"`

      - `description: optional string`

        对响应格式用途的描述，模型据此
        决定如何按该格式进行响应。

      - `strict: optional boolean or null`

        是否在生成输出时启用严格的模式遵循。
        如果设置为 true，模型将始终遵循在 text.format 字段中定义的
        精确模式。支持 JSON Schema 的 `schema` 一个子集。仅当 strict 设置为 true 时才支持。
        `strict` 是 `true`。要了解更多信息，请阅读 [Structured Outputs
        指南](/api/docs/guides/structured-outputs).

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
      建议对支持 `json_schema` 的模型使用 json_schema。请注意，
      如果没有系统或用户消息指示，模型不会生成 JSON
      这样做。

      - `type: "json_object"`

        正在定义的响应格式的类型。始终为 `json_object`.

        - `"json_object"`

  - `verbosity: optional "low" or "medium" or "high" or null`

    约束模型响应的详细程度。较低的值会生成
    更简洁的响应，较高的值会生成更详细的响应。
    当前支持的值有 `low`, `medium`，以及 `high`。默认值为
    `medium`.

    - `"low"`

    - `"medium"`

    - `"high"`

- `tool_choice: optional ToolChoiceOptions or ToolChoiceAllowed or ToolChoiceTypes or 6 more or null`

  控制模型应使用的工具（若有）。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用的工具（若有）。

    `none` 表示模型不会调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息或调用一个或
    多个工具之间选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceAllowed object { mode, tools, type }`

    将模型可用的工具限制为预定义的集合。

    - `mode: "auto" or "required"`

      将模型可用的工具限制为预定义的集合。

      `auto` 允许模型从允许的工具中选取并生成一条
      消息。

      `required` 要求模型调用一个或多个允许的工具。

      - `"auto"`

      - `"required"`

    - `tools: array of map[unknown]`

      允许模型调用的工具定义列表。

      对于 Responses API，工具定义列表可能如下所示：

      ```json
      [
        { "type": "function", "name": "get_weather" },
        { "type": "mcp", "server_label": "deepwiki" },
        { "type": "image_generation" }
      ]
      ```

    - `type: "allowed_tools"`

      允许的工具配置类型。始终为 `allowed_tools`.

      - `"allowed_tools"`

  - `ToolChoiceTypes object { type }`

    指示模型应使用内置工具来生成响应。
    [了解有关内置工具的更多信息](/api/docs/guides/tools).

    - `type: "file_search" or "web_search_preview" or "computer" or 5 more`

      模型应使用的托管工具的类型。了解有关
      [内置工具](/api/docs/guides/tools).

      允许的值为：

      - `file_search`
      - `web_search_preview`
      - `computer`
      - `computer_use_preview`
      - `computer_use`
      - `code_interpreter`
      - `image_generation`

      - `"file_search"`

      - `"web_search_preview"`

      - `"computer"`

      - `"computer_use_preview"`

      - `"computer_use"`

      - `"web_search_preview_2025_03_11"`

      - `"image_generation"`

      - `"code_interpreter"`

  - `ToolChoiceFunction object { name, type }`

    使用此选项可强制模型调用特定函数。

    - `name: string`

      要调用的函数的名称。

    - `type: "function"`

      对于函数调用，类型始终为 `function`.

      - `"function"`

  - `ToolChoiceMcp object { server_label, type, name }`

    使用此选项可强制模型调用远程 MCP 服务器上的特定工具。

    - `server_label: string`

      要使用的 MCP 服务器的标签。

    - `type: "mcp"`

      对于 MCP 工具，类型始终为 `mcp`.

      - `"mcp"`

    - `name: optional string or null`

      要在服务器上调用的工具的名称。

  - `ToolChoiceCustom object { name, type }`

    使用此选项可强制模型调用特定的自定义工具。

    - `name: string`

      要调用的自定义工具的名称。

    - `type: "custom"`

      对于自定义工具调用，类型始终为 `custom`.

      - `"custom"`

  - `SpecificProgrammaticToolCallingParam object { type }`

    - `type: "programmatic_tool_calling"`

      要调用的工具。始终为 `programmatic_tool_calling`.

      - `"programmatic_tool_calling"`

  - `ToolChoiceApplyPatch object { type }`

    在执行工具调用时强制模型调用 apply_patch 工具。

    - `type: "apply_patch"`

      要调用的工具。始终为 `apply_patch`.

      - `"apply_patch"`

  - `ToolChoiceShell object { type }`

    当需要工具调用时，强制模型调用 shell 工具。

    - `type: "shell"`

      要调用的工具。始终为 `shell`.

      - `"shell"`

- `tools: optional array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more or null`

  模型在生成响应时可以调用的工具数组。你可以通过设置 `tool_choice` 参数来指定要使用的工具。

  - `Function object { name, parameters, strict, 6 more }`

    在你自己代码中定义一个可供模型选择调用的函数。了解更多关于 [函数调用](/api/docs/guides/function-calling).

    - `name: string`

      要调用的函数的名称。

    - `parameters: map[unknown] or null`

      描述该函数参数的 JSON schema 对象。

    - `strict: boolean or null`

      是否为此函数工具强制执行严格的参数校验。

    - `type: "function"`

      函数工具的类型。始终为 `function`.

      - `"function"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用上下文。

      - `"direct"`

      - `"programmatic"`

    - `async: optional boolean`

    - `defer_loading: optional boolean`

      该函数是否延迟加载并通过工具搜索加载。

    - `description: optional string or null`

      对该函数的描述。由模型用于判断是否调用该函数。

    - `output_schema: optional map[unknown] or null`

      用于描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

  - `FileSearch object { type, vector_store_ids, filters, 2 more }`

    从已上传文件中搜索相关内容的工具。详细了解 [文件搜索 工具](/api/docs/guides/tools-file-search).

    - `type: "file_search"`

      文件搜索工具的类型。始终为 `file_search`.

      - `"file_search"`

    - `vector_store_ids: array of string`

      要搜索的向量存储的 ID。

    - `filters: optional ComparisonFilter or CompoundFilter or null`

      要应用的筛选器。

      - `ComparisonFilter object { key, type, value }`

        用于将指定的属性键与给定值通过定义的比较运算进行比较的筛选器。

      - `CompoundFilter object { filters, type }`

        使用以下方式组合多个筛选条件 `and` 或 `or`.

    - `max_num_results: optional number`

      返回结果的最大数量。该数值应介于 1 到 50 之间（含端点）。

    - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

      搜索的排序选项。

      - `hybrid_search: optional object { embedding_weight, text_weight }`

        在启用混合搜索时，用于控制倒数排名融合在语义嵌入匹配与稀疏关键词匹配之间平衡权重的权重。

        - `embedding_weight: number`

          倒数排名融合中嵌入的权重。

        - `text_weight: number`

          倒数排名融合中文本的权重。

      - `ranker: optional "auto" or "default-2024-11-15"`

        用于文件搜索的排序器。

        - `"auto"`

        - `"default-2024-11-15"`

      - `score_threshold: optional number`

        文件搜索的分数阈值，介于 0 到 1 之间的一个数值。越接近 1 的数值会尝试仅返回相关性最高的结果，但可能会返回更少的结果。

  - `Computer object { type }`

    控制虚拟计算机的工具。了解更多关于 [计算机工具](/api/docs/guides/tools-computer-use).

    - `type: "computer"`

      计算机工具的类型。始终为 `computer`.

      - `"computer"`

  - `ComputerUsePreview object { display_height, display_width, environment, type }`

    控制虚拟计算机的工具。了解更多关于 [计算机工具](/api/docs/guides/tools-computer-use).

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

    在互联网上搜索与提示相关的来源。了解更多关于
    [网页搜索工具](/api/docs/guides/tools-web-search).

    - `type: "web_search" or "web_search_2025_08_26"`

      网页搜索工具的类型。取值之一为 `web_search` 或 `web_search_2025_08_26`.

      - `"web_search"`

      - `"web_search_2025_08_26"`

    - `external_web_access: optional boolean`

      允许网页搜索访问实时互联网。省略时默认为 true。当为 false 时，网页搜索工具将以离线/仅缓存模式运行，并且不会获取新的外部内容。

    - `filters: optional object { allowed_domains }  or null`

      搜索的过滤器。

      - `allowed_domains: optional array of string or null`

        允许搜索的域名。如果未提供，则允许所有域名。
        所提供域名的子域名也同样允许。

        示例： `["pubmed.ncbi.nlm.nih.gov"]`

    - `search_context_size: optional "low" or "medium" or "high"`

      用于搜索的上下文窗口空间的高级指导量。可选值之一为 `low`, `medium`，或 `high`. `medium` 为默认值。

      - `"low"`

      - `"medium"`

      - `"high"`

    - `user_location: optional object { city, country, region, 2 more }  or null`

      用户的大致位置。

      - `city: optional string or null`

        用户所在城市的自由文本输入，例如 `San Francisco`.

      - `country: optional string or null`

        用户所在地的两位字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

      - `region: optional string or null`

        用户所在地区的自由文本输入，例如 `California`.

      - `timezone: optional string or null`

        该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

      - `type: optional "approximate"`

        位置近似值的类型。始终为 `approximate`.

        - `"approximate"`

  - `Mcp object { server_label, type, allowed_callers, 9 more }`

    允许模型通过远程 Model Context Protocol
    （MCP）服务器访问更多工具。 [了解更多关于 MCP 的信息](/api/docs/guides/tools-connectors-mcp).

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

      允许的工具名称列表或过滤器对象。

      - `McpAllowedTools = array of string`

        允许的工具名称组成的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许哪些工具的过滤器对象。

        - `read_only: optional boolean`

          指示工具是否会修改数据或是否为只读。如果某个
          MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可配合
      自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
      必须处理 OAuth 授权流程，并在此处提供令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中提供的连接器。必须提供
      `server_url`, `connector_id`，或 `tunnel_id` 中的任意一个。了解更多信息
      关于服务连接器 [这里](/api/docs/guides/tools-connectors-mcp#connectors).

      当前支持 `connector_id` 的值为：

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

      该 MCP 工具是否被延迟，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务端的可选 HTTP 标头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务端中哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务端中哪些工具需要审批。可以是
        `always`, `never`,也可以是与需要审批的工具关联的过滤对象
        需要审批。

        - `always: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤器对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤器对象。

          - `read_only: optional boolean`

            指示工具是否会修改数据或是否为只读。如果某个
            MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值之一为 `always` 或
        `never`。当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务端的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务端的 URL。可选值之一为 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供。

    - `tunnel_id: optional string`

      要使用的安全 MCP 隧道 ID，而不是直接的服务器 URL。以下之一
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

  - `CodeInterpreter object { container, type, allowed_callers }`

    一个运行 Python 代码以帮助生成提示响应的工具。

    - `container: string or object { type, file_ids, memory_limit, network_policy }`

      代码解释器容器。可以是容器 ID，或是用于指定要提供给代码的已上传文件 ID 以及可选设置的
      指定要提供给代码的已上传文件 ID 以及
      可选的 `memory_limit` 设置的对象。

      - `string`

        容器 ID。

      - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

        代码解释器容器的配置。可选择指定要用于运行代码的文件 ID。

        - `type: "auto"`

          始终为 `auto`.

          - `"auto"`

        - `file_ids: optional array of string`

          一个可选的已上传文件列表，供代码使用。

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

      生成新图像还是编辑现有图像。默认值： `auto`.

      - `"generate"`

      - `"edit"`

      - `"auto"`

    - `background: optional "transparent" or "opaque" or "auto"`

      设置生成图像的背景。可选值为 `transparent`, `opaque`,
      或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
      其 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
      背景。受支持的 GPT Image
      模型可使用透明背景。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，此支持处于
      预览阶段。使用 `transparent`，时，请将输出格式设置为 `png` 或 `webp`.
      默认值： `auto`.

      - `"transparent"`

      - `"opaque"`

      - `"auto"`

    - `input_fidelity: optional "high" or "low" or null`

      控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所投入的精力。此参数仅支持 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本模型，不支持 `gpt-image-1-mini`。支持 `high` 和 `low`。默认为 `low`.

      - `"high"`

      - `"low"`

    - `input_image_mask: optional object { file_id, image_url }`

      用于局部重绘的可选蒙版。包含 `image_url`
      (string, optional) 和 `file_id` (string, optional)。

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

      生成图像的内容审核等级。默认值： `auto`.

      - `"auto"`

      - `"low"`

    - `output_compression: optional number`

      输出图像的压缩等级。默认值：100。

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
      包括它们的 `2026-09-08` 快照，也支持 `xhigh` 和 `max`.
      默认值： `auto`.

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

      - `"max"`

      - `"auto"`

    - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

      生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以字符串形式指定任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须介于 1:3 和 3:1 之间。高于 `2560x1440` 的分辨率为实验性，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边数限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 在支持自动调整大小的模型中受支持。对于 `dall-e-2`,请使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`,请使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

      - `string`

      - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

        生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持以字符串形式指定任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须介于 1:3 和 3:1 之间。高于 `2560x1440` 的分辨率为实验性，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边数限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 在支持自动调整大小的模型中受支持。对于 `dall-e-2`,请使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`,请使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

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

    使用指定格式处理输入的自定义工具。详细了解   [custom tools](/api/docs/guides/function-calling#custom-tools)

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

      工具响应是否可以异步返回，还是在下次创建响应时立即返回。

    - `defer_loading: optional boolean`

      此工具是否应被延迟并通过工具搜索发现。

    - `description: optional string`

      自定义工具的可选描述，用于提供更多上下文。

    - `format: optional CustomToolInputFormat`

      自定义工具的输入格式。默认是无约束文本。

  - `Namespace object { description, name, tools, type }`

    将函数/自定义工具归入共享命名空间下。

    - `description: string`

      展示给模型的命名空间描述。

    - `name: string`

      用于工具调用中的命名空间名称（例如， `crm`).

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

          工具响应是否可以异步返回，还是在下次创建响应时立即返回。

        - `defer_loading: optional boolean`

          该函数是否应被延迟并通过工具搜索发现。

        - `description: optional string or null`

        - `output_schema: optional map[unknown] or null`

          用于描述该函数工具中以字符串形式输出的 JSON 值的 JSON Schema。这并不描述 content 数组形式的输出。

        - `parameters: optional unknown or null`

        - `strict: optional boolean or null`

          是否强制执行严格的参数校验。如果省略，Responses 会尝试在 schema 兼容时使用严格校验，否则回退到非严格校验。

      - `Custom object { name, type, allowed_callers, 4 more }`

        使用指定格式处理输入的自定义工具。详细了解   [custom tools](/api/docs/guides/function-calling#custom-tools)

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

          工具响应是否可以异步返回，还是在下次创建响应时立即返回。

        - `defer_loading: optional boolean`

          此工具是否应被延迟并通过工具搜索发现。

        - `description: optional string`

          自定义工具的可选描述，用于提供更多上下文。

        - `format: optional CustomToolInputFormat`

          自定义工具的输入格式。默认是无约束文本。

    - `type: "namespace"`

      工具的类型。始终为 `namespace`.

      - `"namespace"`

  - `ToolSearch object { type, description, execution, parameters }`

    针对延迟工具的托管或 BYOT 工具搜索配置。

    - `type: "tool_search"`

      工具的类型。始终为 `tool_search`.

      - `"tool_search"`

    - `description: optional string or null`

      展示给模型的、用于客户端执行的工具搜索工具的描述。

    - `execution: optional "server" or "client"`

      工具搜索由服务端执行还是由客户端执行。

      - `"server"`

      - `"client"`

    - `parameters: optional unknown or null`

      用于客户端执行的工具搜索工具的参数 schema。

  - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

    该工具会在网页上搜索相关结果以用于回复。了解更多关于 [网页搜索工具](/api/docs/guides/tools-web-search).

    - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

      网页搜索工具的类型。取值之一为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

      - `"web_search_preview"`

      - `"web_search_preview_2025_03_11"`

    - `search_content_types: optional array of "text" or "image"`

      - `"text"`

      - `"image"`

    - `search_context_size: optional "low" or "medium" or "high"`

      用于搜索的上下文窗口空间的高级指导量。可选值之一为 `low`, `medium`，或 `high`. `medium` 为默认值。

      - `"low"`

      - `"medium"`

      - `"high"`

    - `user_location: optional object { type, city, country, 2 more }  or null`

      用户所在的位置。

      - `type: "approximate"`

        位置近似值的类型。始终为 `approximate`.

        - `"approximate"`

      - `city: optional string or null`

        用户所在城市的自由文本输入，例如 `San Francisco`.

      - `country: optional string or null`

        用户所在地的两位字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) ，例如。 `US`.

      - `region: optional string or null`

        用户所在地区的自由文本输入，例如 `California`.

      - `timezone: optional string or null`

        该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) ，例如。 `America/Los_Angeles`.

  - `ApplyPatch object { type, allowed_callers }`

    允许助手使用统一差异（unified diff）来创建、删除或更新文件。

    - `type: "apply_patch"`

      工具的类型。始终为 `apply_patch`.

      - `"apply_patch"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用上下文。

      - `"direct"`

      - `"programmatic"`

- `truncation: optional "auto" or "disabled"`

  用于模型响应的截断策略。 - `auto`：如果此响应的输入超出模型的上下文窗口大小，模型将通过丢弃对话开头的部分来截断响应，以适配上下文窗口。 - `disabled` （默认）：如果输入大小将超出模型的上下文窗口大小，请求将失败并返回 400 错误。

  - `"auto"`

  - `"disabled"`

### Returns

- `input_tokens: number`

- `object: "response.input_tokens"`

  - `"response.input_tokens"`

### 示例

```http
curl https://api.openai.com/v1/responses/input_tokens \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "input_tokens": 123,
  "object": "response.input_tokens"
}
```

### 示例

```http
curl -X POST https://api.openai.com/v1/responses/input_tokens \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
      "model": "gpt-6-astra",
      "input": "Tell me a joke."
    }'
```

#### 响应

```json
{
  "object": "response.input_tokens",
  "input_tokens": 11
}
```

## Domain Types

### 输入 Token 计数响应

- `InputTokenCountResponse object { input_tokens, object }`

  - `input_tokens: number`

  - `object: "response.input_tokens"`

    - `"response.input_tokens"`
