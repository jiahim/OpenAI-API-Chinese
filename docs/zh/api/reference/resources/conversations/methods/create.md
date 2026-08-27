> 完整的文档索引请参见 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 创建对话

**post** `/conversations`

创建对话。

### 正文参数

- `items: optional array of EasyInputMessage or object { content, role, status, type }  or ResponseOutputMessage or 29 more or null`

  要包含在对话上下文中的初始项目。你一次最多可以添加 20 个项目。

  - `EasyInputMessage object { content, role, phase, type }`

    向模型输入的消息，角色指示指令遵循
    层级。使用 `developer` 或 `system` 角色的指令
    优先于使用 `user` 角色的指令。使用
    `assistant` 角色的消息被假定为模型在之前的
    交互中生成的。

    - `content: string or ResponseInputMessageContentList`

      向模型输入的文本、图像或音频，用于生成响应。
      也可以包含之前的助手响应。

      - `TextInput = string`

        向模型输入的文本。

      - `ResponseInputMessageContentList = array of ResponseInputContent`

        向模型输入的一个或多个项目列表，包含不同的内容
        类型。

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          向模型输入的文本。

          - `text: string`

            向模型输入的文本。

          - `type: "input_text"`

            输入项目的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的准确结束位置。断点继承请求的 `prompt_cache_options.ttl`；边界不四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          向模型输入的图像。了解 [图像输入](/docs/guides/vision).

          - `detail: ImageDetail`

            发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `"low"`

            - `"high"`

            - `"auto"`

            - `"original"`

          - `type: "input_image"`

            输入项目的类型。始终为 `input_image`.

            - `"input_image"`

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `image_url: optional string or null`

            发送给模型的图像的 URL。可以是完全限定的 URL，也可以是数据 URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的准确结束位置。断点继承请求的 `prompt_cache_options.ttl`；边界不四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项目的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌的使用量。使用 `low` 进行低成本渲染，或使用 `high` 以更高品质渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string`

            发送给模型的文件内容。

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `file_url: optional string`

            发送给模型的文件的 URL。

          - `filename: optional string`

            发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的准确结束位置。断点继承请求的 `prompt_cache_options.ttl`；边界不四舍五入到令牌块。

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
      对于像 `gpt-5.3-codex` 以及后续请求中，发送后续请求时，请保留并重新发送
      阶段设置于所有助手消息中——省略它可能会降低性能。不用于用户消息。

      - `"commentary"`

      - `"final_answer"`

    - `type: optional "message"`

      消息输入的类型。始终为 `message`.

      - `"message"`

  - `Message object { content, role, status, type }`

    向模型输入的消息，角色指示指令遵循
    层级。使用 `developer` 或 `system` 角色的指令
    优先于使用 `user` 角色。

    - `content: ResponseInputMessageContentList`

      向模型输入的一个或多个项目列表，包含不同的内容
      类型。

    - `role: "user" or "system" or "developer"`

      消息输入的角色。可选值为 `user`, `system`，或 `developer`.

      - `"user"`

      - `"system"`

      - `"developer"`

    - `status: optional "in_progress" or "completed" or "incomplete"`

      项目的状态。取值为 `in_progress`, `completed`，或
      `incomplete`。当项目通过API返回时填充此字段。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

    - `type: optional "message"`

      消息输入的类型。始终设置为 `message`.

      - `"message"`

  - `ResponseOutputMessage object { id, content, role, 3 more }`

    来自模型的输出消息。

    - `id: string`

      输出消息的唯一 ID。

    - `content: array of ResponseOutputText or ResponseOutputRefusal`

      输出消息的内容。

      - `ResponseOutputText object { annotations, logprobs, text, type }`

        来自模型的文本输出。

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

            用于生成模型响应的网络资源的引用。

            - `end_index: number`

              消息中 URL 引用的最后一个字符的索引。

            - `start_index: number`

              消息中 URL 引用的第一个字符的索引。

            - `title: string`

              网页资源的标题。

            - `type: "url_citation"`

              URL 引用的类型。始终 `url_citation`.

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

              所引用容器文件的文件名。

            - `start_index: number`

              消息中容器文件引用的第一个字符的索引。

            - `type: "container_file_citation"`

              容器文件引用的类型。始终 `container_file_citation`.

              - `"container_file_citation"`

          - `FilePath object { file_id, index, type }`

            文件的路径。

            - `file_id: string`

              文件的 ID。

            - `index: number`

              文件在文件列表中的索引。

            - `type: "file_path"`

              文件路径的类型。始终 `file_path`.

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

          模型的文本输出。

        - `type: "output_text"`

          输出文本的类型。始终 `output_text`.

          - `"output_text"`

      - `ResponseOutputRefusal object { refusal, type }`

        模型的拒绝。

        - `refusal: string`

          模型的拒绝解释。

        - `type: "refusal"`

          拒绝的类型。始终 `refusal`.

          - `"refusal"`

    - `role: "assistant"`

      输出消息的角色。始终 `assistant`.

      - `"assistant"`

    - `status: "in_progress" or "completed" or "incomplete"`

      消息输入的状态。其中之一 `in_progress`, `completed`，或
      `incomplete`。当输入项通过 API 返回时填充。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

    - `type: "message"`

      输出消息的类型。始终 `message`.

      - `"message"`

    - `phase: optional "commentary" or "final_answer" or null`

      将 `assistant` 消息标记为中间评论（`commentary`）或最终答案（`final_answer`).
      对于像 `gpt-5.3-codex` 以及后续请求中，发送后续请求时，请保留并重新发送
      阶段设置于所有助手消息中——省略它可能会降低性能。不用于用户消息。

      - `"commentary"`

      - `"final_answer"`

  - `FileSearchCall object { id, queries, status, 2 more }`

    文件搜索工具调用的结果。请参阅
    [文件搜索指南](/docs/guides/tools-file-search) 以获取更多信息。

    - `id: string`

      文件搜索工具调用的唯一 ID。

    - `queries: array of string`

      用于搜索文件的查询。

    - `status: "in_progress" or "searching" or "completed" or 2 more`

      文件搜索工具调用的状态。 `in_progress`,
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

        可附加到对象上的 16 个键值对集合。这可用于
        以结构化格式存储有关对象的附加信息，
        并通过 API 或仪表盘查询对象。键是字符串
        ，最大长度为 64 个字符。值是字符串，最大
        长度为 512 个字符、布尔值或数字。

        - `string`

        - `number`

        - `boolean`

      - `file_id: optional string`

        文件的唯一 ID。

      - `filename: optional string`

        文件的名称。

      - `score: optional number`

        文件的相关性评分——介于 0 和 1 之间的值。

      - `text: optional string`

        从文件中检索到的文本。

  - `ComputerCall object { id, call_id, pending_safety_checks, 4 more }`

    对计算机使用工具的工具调用。请参阅
    [计算机使用指南](/docs/guides/tools-computer-use) 以获取更多信息。

    - `id: string`

      计算机调用的唯一 ID。

    - `call_id: string`

      用于向工具调用返回输出时使用的标识符。

    - `pending_safety_checks: array of object { id, code, message }`

      计算机调用的待处理安全检查。

      - `id: string`

        待处理安全检查的ID。

      - `code: optional string or null`

        待处理安全检查的类型。

      - `message: optional string or null`

        关于待处理安全检查的详细信息。

    - `status: "in_progress" or "completed" or "incomplete"`

      项目的状态。取值为 `in_progress`, `completed`，或
      `incomplete`。当项目通过API返回时填充此字段。

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

          指示点击期间按下的鼠标按钮。取值为 `left`, `right`, `wheel`, `back`，或 `forward`.

          - `"left"`

          - `"right"`

          - `"wheel"`

          - `"back"`

          - `"forward"`

        - `type: "click"`

          指定事件类型。对于点击操作，此属性始终为 `click`.

          - `"click"`

        - `x: number`

          点击发生位置的x坐标。

        - `y: number`

          点击发生位置的y坐标。

        - `keys: optional array of string or null`

          点击时按住的键。

      - `DoubleClick object { keys, type, x, y }`

        双击操作。

        - `keys: array of string or null`

          双击时按住的键。

        - `type: "double_click"`

          指定事件类型。对于双击操作，此属性始终设置为 `double_click`.

          - `"double_click"`

        - `x: number`

          双击发生位置的x坐标。

        - `y: number`

          双击发生位置的y坐标。

      - `Drag object { path, type, keys }`

        拖动操作。

        - `path: array of object { x, y }`

          表示拖动操作路径的坐标数组。坐标将以对象数组形式出现，例如

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

          指定事件类型。对于拖拽动作，此属性始终设置为 `drag`.

          - `"drag"`

        - `keys: optional array of string or null`

          拖动鼠标时按住的按键。

      - `Keypress object { keys, type }`

        模型希望执行的一系列按键操作。

        - `keys: array of string`

          模型请求按下的按键组合。这是一个字符串数组，每个字符串表示一个按键。

        - `type: "keypress"`

          指定事件类型。对于按键动作，此属性始终设置为 `keypress`.

          - `"keypress"`

      - `Move object { type, x, y, keys }`

        鼠标移动动作。

        - `type: "move"`

          指定事件类型。对于移动动作，此属性始终设置为 `move`.

          - `"move"`

        - `x: number`

          要移动到的 x 坐标。

        - `y: number`

          要移动到的 y 坐标。

        - `keys: optional array of string or null`

          移动鼠标时按住的按键。

      - `Screenshot object { type }`

        截图动作。

        - `type: "screenshot"`

          指定事件类型。对于截图动作，此属性始终设置为 `screenshot`.

          - `"screenshot"`

      - `Scroll object { scroll_x, scroll_y, type, 3 more }`

        滚动动作。

        - `scroll_x: number`

          水平滚动距离。

        - `scroll_y: number`

          垂直滚动距离。

        - `type: "scroll"`

          指定事件类型。对于滚动动作，此属性始终设置为 `scroll`.

          - `"scroll"`

        - `x: number`

          发生滚动的 x 坐标。

        - `y: number`

          发生滚动的 y 坐标。

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

      用于 `computer_use`。的扁平化批量操作。每个操作都包含一个
      `type` 判别器以及操作特定的字段。

      - `Click object { button, type, x, 2 more }`

        点击操作。

      - `DoubleClick object { keys, type, x, y }`

        双击操作。

      - `Drag object { path, type, keys }`

        拖动操作。

      - `Keypress object { keys, type }`

        模型希望执行的一系列按键操作。

      - `Move object { type, x, y, keys }`

        鼠标移动动作。

      - `Screenshot object { type }`

        截图动作。

      - `Scroll object { scroll_x, scroll_y, type, 3 more }`

        滚动动作。

      - `Type object { text, type }`

        用于输入文本的操作。

      - `Wait object { type }`

        等待操作。

  - `ComputerCallOutput object { call_id, output, type, 3 more }`

    计算机工具调用的输出。

    - `call_id: string`

      产生该输出的计算机工具调用的 ID。

    - `output: ResponseComputerToolCallOutputScreenshot`

      与计算机使用工具一起使用的计算机截图图像。

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

      开发者已确认的、由 API 报告的安全检查。

      - `id: string`

        待处理安全检查的ID。

      - `code: optional string or null`

        待处理安全检查的类型。

      - `message: optional string or null`

        关于待处理安全检查的详细信息。

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      消息输入的状态。其中之一 `in_progress`, `completed`，或 `incomplete`。当输入项通过 API 返回时填充。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `WebSearchCall object { id, action, status, type }`

    网页搜索 工具调用的结果。参见
    [网页搜索指南](/docs/guides/tools-web-search) 以获取更多信息。

    - `id: string`

      此网页搜索工具调用的唯一 ID。

    - `action: object { type, queries, query, sources }  or object { type, url }  or object { pattern, type, url }`

      描述此网页搜索调用中所采取特定操作的对象。
      包括模型如何使用网络（search、open_page、find_in_page）的详细信息。

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

        操作类型 "find_in_page"：在已加载的页面中搜索模式。

        - `pattern: string`

          要在页面中搜索的模式或文本。

        - `type: "find_in_page"`

          操作类型。

          - `"find_in_page"`

        - `url: string`

          在其中搜索模式的页面的 URL。

    - `status: "in_progress" or "searching" or "completed" or "failed"`

      此网页搜索工具调用的状态。

      - `"in_progress"`

      - `"searching"`

      - `"completed"`

      - `"failed"`

    - `type: "web_search_call"`

      此网页搜索工具调用的类型。始终为 `web_search_call`.

      - `"web_search_call"`

  - `FunctionCall object { arguments, call_id, name, 5 more }`

    用于运行函数的工具调用。请参阅
    [函数调用指南](/docs/guides/function-calling) 以获取更多信息。

    - `arguments: string`

      要传递给函数的参数的 JSON 字符串。

    - `call_id: string`

      模型生成的函数工具调用的唯一 ID。

    - `name: string`

      要运行的函数的名称。

    - `type: "function_call"`

      函数工具调用的类型。始终为 `function_call`.

      - `"function_call"`

    - `id: optional string`

      函数工具调用的唯一 ID。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      产生此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          产生此工具调用的程序项的调用 ID。

        - `type: "program"`

          - `"program"`

    - `namespace: optional string`

      要运行的函数的命名空间。

    - `status: optional "in_progress" or "completed" or "incomplete"`

      项目的状态。取值为 `in_progress`, `completed`，或
      `incomplete`。当项目通过API返回时填充此字段。

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

        函数工具调用的内容输出（文本、图像、文件）数组。

        - `ResponseInputTextContent object { text, type, prompt_cache_breakpoint }`

          向模型输入的文本。

          - `text: string`

            向模型输入的文本。

          - `type: "input_text"`

            输入项目的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }  or null`

            标记可复用提示前缀的准确结束位置。断点继承请求的 `prompt_cache_options.ttl`；边界不四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImageContent object { type, detail, file_id, 2 more }`

          向模型输入的图像。了解 [图像输入](/docs/guides/vision)

          - `type: "input_image"`

            输入项目的类型。始终为 `input_image`.

            - `"input_image"`

          - `detail: optional ImageDetail or null`

            发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `image_url: optional string or null`

            发送给模型的图像的 URL。可以是完全限定的 URL，也可以是数据 URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }  or null`

            标记可复用提示前缀的准确结束位置。断点继承请求的 `prompt_cache_options.ttl`；边界不四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFileContent object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

          - `type: "input_file"`

            输入项目的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入令牌的使用量。使用 `low` 进行低成本渲染，或使用 `high` 以更高品质渲染文件。默认为 `auto`.

            - `"auto"`

            - `"low"`

            - `"high"`

          - `file_data: optional string or null`

            要发送给模型的文件的 Base64 编码数据。

          - `file_id: optional string or null`

            发送给模型的文件的 ID。

          - `file_url: optional string or null`

            发送给模型的文件的 URL。

          - `filename: optional string or null`

            发送给模型的文件的名称。

          - `prompt_cache_breakpoint: optional object { mode }  or null`

            标记可复用提示前缀的准确结束位置。断点继承请求的 `prompt_cache_options.ttl`；边界不四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

    - `type: "function_call_output"`

      函数工具调用输出的类型。始终为 `function_call_output`.

      - `"function_call_output"`

    - `id: optional string or null`

      函数工具调用输出的唯一 ID。当此项目通过 API 返回时填充。

    - `call_id: optional string or null`

      模型生成的函数工具调用的唯一 ID。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      产生此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          调用方类型。始终为 `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          产生此工具调用的程序项的调用 ID。

        - `type: "program"`

          调用方类型。始终为 `program`.

          - `"program"`

    - `name: optional string or null`

      产生输出的工具的名称。

    - `namespace: optional string or null`

      产生输出的工具的命名空间。

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      项目的状态。取值为 `in_progress`, `completed`，或 `incomplete`。当项目通过API返回时填充此字段。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `ToolSearchCall object { arguments, type, id, 3 more }`

    - `arguments: unknown`

      提供给工具搜索调用的参数。

    - `type: "tool_search_call"`

      项目类型。始终为 `tool_search_call`.

      - `"tool_search_call"`

    - `id: optional string or null`

      此工具搜索调用的唯一 ID。

    - `call_id: optional string or null`

      由模型生成的工具搜索调用的唯一 ID。

    - `execution: optional "server" or "client"`

      工具搜索是由服务端还是客户端执行的。

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

        在你的代码中定义一个模型可以选择调用的函数。了解更多关于 [函数调用](https://platform.openai.com/docs/guides/function-calling).

        - `name: string`

          要调用的函数名称。

        - `parameters: map[unknown] or null`

          描述函数参数的 JSON Schema 对象。

        - `strict: boolean or null`

          是否对此函数工具强制执行严格参数验证。

        - `type: "function"`

          函数工具的类型。始终为 `function`.

          - `"function"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `defer_loading: optional boolean`

          此函数是否延迟并通过工具搜索加载。

        - `description: optional string or null`

          函数的描述。模型据此判断是否调用该函数。

        - `output_schema: optional map[unknown] or null`

          描述此函数字符串输出中编码的 JSON 值的 JSON Schema 对象。

      - `FileSearch object { type, vector_store_ids, filters, 2 more }`

        一种从上传文件中搜索相关内容的工具。了解更多关于 [文件搜索工具](https://platform.openai.com/docs/guides/tools-file-search).

        - `type: "file_search"`

          文件搜索工具的类型。始终为 `file_search`.

          - `"file_search"`

        - `vector_store_ids: array of string`

          要搜索的向量存储的 ID。

        - `filters: optional ComparisonFilter or CompoundFilter or null`

          要应用的筛选器。

          - `ComparisonFilter object { key, type, value }`

            一个过滤器，使用定义的比较操作将指定的属性键与给定值进行比较。

            - `key: string`

              与值进行比较的键。

            - `type: "eq" or "ne" or "gt" or 5 more`

              指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

              - `eq`：等于
              - `ne`：不等于
              - `gt`：大于
              - `gte`：大于或等于
              - `lt`：小于
              - `lte`：小于或等于
              - `in`：在...中
              - `nin`：不在...中

              - `"eq"`

              - `"ne"`

              - `"gt"`

              - `"gte"`

              - `"lt"`

              - `"lte"`

              - `"in"`

              - `"nin"`

            - `value: string or number or boolean or array of string or number`

              与属性键进行比较的值；支持字符串、数字或布尔类型。

              - `string`

              - `number`

              - `boolean`

              - `array of string or number`

                - `string`

                - `number`

          - `CompoundFilter object { filters, type }`

            使用 `and` 或 `or`.

            - `filters: array of ComparisonFilter or unknown`

              要组合的过滤器数组。项目可以是 `ComparisonFilter` 或 `CompoundFilter`.

              - `ComparisonFilter object { key, type, value }`

                一个过滤器，使用定义的比较操作将指定的属性键与给定值进行比较。

              - `unknown`

            - `type: "and" or "or"`

              操作类型： `and` 或 `or`.

              - `"and"`

              - `"or"`

        - `max_num_results: optional number`

          要返回的最大结果数。此数字应在1到50（含）之间。

        - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

          搜索的排名选项。

          - `hybrid_search: optional object { embedding_weight, text_weight }`

            当启用混合搜索时，控制倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

            - `embedding_weight: number`

              倒数排名融合中嵌入的权重。

            - `text_weight: number`

              倒数排名融合中文本的权重。

          - `ranker: optional "auto" or "default-2024-11-15"`

            用于文件搜索的排序器。

            - `"auto"`

            - `"default-2024-11-15"`

          - `score_threshold: optional number`

            文件搜索的分数阈值，为介于 0 和 1 之间的数字。越接近 1 的数字将尝试仅返回最相关的结果，但可能返回更少的结果。

      - `Computer object { type }`

        一种控制虚拟计算机的工具。了解更多关于 [计算机工具](https://platform.openai.com/docs/guides/tools-computer-use).

        - `type: "computer"`

          计算机工具的类型。始终为 `computer`.

          - `"computer"`

      - `ComputerUsePreview object { display_height, display_width, environment, type }`

        一种控制虚拟计算机的工具。了解更多关于 [计算机工具](https://platform.openai.com/docs/guides/tools-computer-use).

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

        搜索与提示相关的互联网来源。了解更多关于
        [网页搜索工具](/docs/guides/tools-web-search).

        - `type: "web_search" or "web_search_2025_08_26"`

          网页搜索工具的类型。其中之一为 `web_search` 或 `web_search_2025_08_26`.

          - `"web_search"`

          - `"web_search_2025_08_26"`

        - `external_web_access: optional boolean`

          允许网页搜索进行实时互联网访问。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

        - `filters: optional object { allowed_domains }  or null`

          搜索的过滤器。

          - `allowed_domains: optional array of string or null`

            搜索允许的域名。如果未提供，则允许所有域名。
            所提供的域名的子域名也允许。

            示例： `["pubmed.ncbi.nlm.nih.gov"]`

        - `search_context_size: optional "low" or "medium" or "high"`

          用于搜索的上下文窗口空间量的高级指导。其中之一为 `low`, `medium`，或 `high`. `medium` 是默认值。

          - `"low"`

          - `"medium"`

          - `"high"`

        - `user_location: optional object { city, country, region, 2 more }  or null`

          用户的大致位置。

          - `city: optional string or null`

            用户的自由文本城市输入，例如 `San Francisco`.

          - `country: optional string or null`

            两位字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在，例如。 `US`.

          - `region: optional string or null`

            用户的自由文本地区输入，例如 `California`.

          - `timezone: optional string or null`

            该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 用户所在，例如。 `America/Los_Angeles`.

          - `type: optional "approximate"`

            位置近似的类型。始终 `approximate`.

            - `"approximate"`

      - `Mcp object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol 让模型访问额外的工具
        （MCP）服务器。 [了解更多关于 MCP](/docs/guides/tools-remote-mcp).

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

          允许的工具名称列表或过滤器对象。

          - `McpAllowedTools = array of string`

            允许的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的过滤器对象。

            - `read_only: optional boolean`

              指示一个工具是否修改数据或为只读。如果
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          一个 OAuth 访问令牌，可用于远程 MCP 服务器，既
          可与自定义 MCP 服务器 URL 一起使用，也可与服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程，并将令牌提供在此处。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，类似于 ChatGPT 中可用的那些。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
          关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

          目前支持的 `connector_id` 值为：

          - Dropbox： `connector_dropbox`
          - Gmail： `connector_gmail`
          - Google Calendar： `connector_googlecalendar`
          - Google Drive： `connector_googledrive`
          - Microsoft Teams： `connector_microsoftteams`
          - Outlook Calendar： `connector_outlookcalendar`
          - Outlook Email： `connector_outlookemail`
          - SharePoint： `connector_sharepoint`

          - `"connector_dropbox"`

          - `"connector_gmail"`

          - `"connector_googlecalendar"`

          - `"connector_googledrive"`

          - `"connector_microsoftteams"`

          - `"connector_outlookcalendar"`

          - `"connector_outlookemail"`

          - `"connector_sharepoint"`

        - `defer_loading: optional boolean`

          此 MCP 工具是否延迟并通过工具搜索发现。

        - `headers: optional map[string] or null`

          要发送到 MCP 服务器的可选 HTTP 头。用于认证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要审批。可以是
            `always`, `never`，或与需要审批的工具关联的过滤器对象
            。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示一个工具是否修改数据或为只读。如果
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示一个工具是否修改数据或为只读。如果
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定单一审批策略。可以是 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。必须提供 `server_url`, `connector_id`，或
          `tunnel_id` 其中之一。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的安全 MCP 隧道 ID。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 其中之一。

      - `CodeInterpreter object { container, type, allowed_callers }`

        一种运行 Python 代码以帮助生成提示响应的工具。

        - `container: string or object { type, file_ids, memory_limit, network_policy }`

          代码解释器容器。可以是容器 ID 或
          一个指定上传文件 ID 以使其对你的代码可用，以及一个
          可选 `memory_limit` 设置。

          - `string`

            容器 ID。

          - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器的配置。可选择指定要运行代码的文件 ID。

            - `type: "auto"`

              始终 `auto`.

              - `"auto"`

            - `file_ids: optional array of string`

              可选的已上传文件列表，供你的代码使用。

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

                  仅允许对指定域进行出站网络访问。始终 `allowlist`.

                  - `"allowlist"`

                - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                  用于允许列表中域的可选域范围密钥。

                  - `domain: string`

                    与密钥关联的域。

                  - `name: string`

                    要为域注入的密钥名称。

                  - `value: string`

                    要为域注入的密钥值。

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
          支持的 GPT 图像模型。对于 `gpt-image-2` 和
          `gpt-image-2-2026-04-21`，此支持为预览版。使用
          `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

          - `"transparent"`

          - `"opaque"`

          - `"auto"`

        - `input_fidelity: optional "high" or "low" or null`

          控制模型在匹配输入图像的风格和特征（尤其是面部特征）时投入的努力程度。此参数仅支持 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不支持 `gpt-image-1-mini`。支持 `high` 和 `low`。默认为 `low`.

          - `"high"`

          - `"low"`

        - `input_image_mask: optional object { file_id, image_url }`

          用于修补的可选遮罩。包含 `image_url`
          （字符串，可选）和 `file_id` （字符串，可选）。

          - `file_id: optional string`

            遮罩图像的文件 ID。

          - `image_url: optional string`

            Base64 编码的遮罩图像。

        - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

          用于图像生成的模型。可选值之一为 `gpt-image-1`,
          `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
          `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
          `gpt-image-1`.

          - `string`

          - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

            用于图像生成的模型。可选值之一为 `gpt-image-1`,
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

          流式模式下生成的部分图像数量，范围为 0（默认值）到 3。

        - `quality: optional "low" or "medium" or "high" or "auto"`

          生成图像的质量。可选值之一为 `low`, `medium`, `high`,
          或 `auto`。默认值： `auto`.

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

          生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，形式为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度必须均能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。分辨率高于 `2560x1440` 为实验性，支持的最大分辨率为 `3840x2160`。请求的大小还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，和 `1024x1536` 由 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

          - `string`

          - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，形式为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度必须均能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。分辨率高于 `2560x1440` 为实验性，支持的最大分辨率为 `3840x2160`。请求的大小还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，和 `1024x1536` 由 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

              为此请求自动创建容器

              - `"container_auto"`

            - `file_ids: optional array of string`

              可选的已上传文件列表，供你的代码使用。

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

              按 id 或内联数据引用的可选技能列表。

              - `SkillReference object { skill_id, type, version }`

                - `skill_id: string`

                  所引用技能的 ID。

                - `type: "skill_reference"`

                  引用通过 /v1/skills 端点创建的技能。

                  - `"skill_reference"`

                - `version: optional string`

                  可选的技能版本。使用正整数或 'latest'。省略以使用默认值。

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

              可选技能列表。

              - `description: string`

                技能的描述。

              - `name: string`

                技能的名称。

              - `path: string`

                包含技能的目录路径。

          - `ContainerReference object { container_id, type }`

            - `container_id: string`

              引用的容器 ID。

            - `type: "container_reference"`

              引用通过 /v1/containers 端点创建的容器

              - `"container_reference"`

      - `Custom object { name, type, allowed_callers, 3 more }`

        一种自定义工具，使用指定格式处理输入。了解更多关于   [自定义工具](/docs/guides/function-calling#custom-tools)

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

          此工具是否应延迟并通过工具搜索发现。

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

              语法定义的语法。其中之一为 `lark` 或 `regex`.

              - `"lark"`

              - `"regex"`

            - `type: "grammar"`

              语法格式。始终为 `grammar`.

              - `"grammar"`

      - `Namespace object { description, name, tools, type }`

        将函数/自定义工具归组到共享命名空间下。

        - `description: string`

          展示给模型的命名空间描述。

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

              一个 JSON Schema，描述此函数工具的字符串输出中编码的 JSON 值。这不描述 content-array 输出。

            - `parameters: optional unknown or null`

            - `strict: optional boolean or null`

              是否强制执行严格的参数验证。如果省略，Responses 在 schema 兼容时尝试使用严格验证，否则回退到非严格验证。

          - `Custom object { name, type, allowed_callers, 3 more }`

            一种自定义工具，使用指定格式处理输入。了解更多关于   [自定义工具](/docs/guides/function-calling#custom-tools)

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

              此工具是否应延迟并通过工具搜索发现。

            - `description: optional string`

              自定义工具的可选描述，用于提供更多上下文。

            - `format: optional CustomToolInputFormat`

              自定义工具的输入格式。默认为无约束文本。

        - `type: "namespace"`

          工具的类型。始终 `namespace`.

          - `"namespace"`

      - `ToolSearch object { type, description, execution, parameters }`

        用于延迟工具的托管或 BYOT 工具搜索配置。

        - `type: "tool_search"`

          工具的类型。始终 `tool_search`.

          - `"tool_search"`

        - `description: optional string or null`

          展示给模型的客户端执行工具搜索工具的描述。

        - `execution: optional "server" or "client"`

          工具搜索是由服务端执行还是由客户端执行。

          - `"server"`

          - `"client"`

        - `parameters: optional unknown or null`

          客户端执行工具搜索工具的参数 schema。

      - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

        此工具搜索网络以获取相关结果用于响应。了解更多关于 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

        - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

          网页搜索工具的类型。其中之一为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

          - `"web_search_preview"`

          - `"web_search_preview_2025_03_11"`

        - `search_content_types: optional array of "text" or "image"`

          - `"text"`

          - `"image"`

        - `search_context_size: optional "low" or "medium" or "high"`

          用于搜索的上下文窗口空间量的高级指导。其中之一为 `low`, `medium`，或 `high`. `medium` 是默认值。

          - `"low"`

          - `"medium"`

          - `"high"`

        - `user_location: optional object { type, city, country, 2 more }  or null`

          用户的位置。

          - `type: "approximate"`

            位置近似的类型。始终 `approximate`.

            - `"approximate"`

          - `city: optional string or null`

            用户的自由文本城市输入，例如 `San Francisco`.

          - `country: optional string or null`

            两位字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在，例如。 `US`.

          - `region: optional string or null`

            用户的自由文本地区输入，例如 `California`.

          - `timezone: optional string or null`

            该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 用户所在，例如。 `America/Los_Angeles`.

      - `ApplyPatch object { type, allowed_callers }`

        允许助手使用统一差异创建、删除或更新文件。

        - `type: "apply_patch"`

          工具的类型。始终 `apply_patch`.

          - `"apply_patch"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

    - `type: "tool_search_output"`

      项目类型。始终为 `tool_search_output`.

      - `"tool_search_output"`

    - `id: optional string or null`

      此工具搜索输出的唯一 ID。

    - `call_id: optional string or null`

      由模型生成的工具搜索调用的唯一 ID。

    - `execution: optional "server" or "client"`

      工具搜索是由服务端还是客户端执行的。

      - `"server"`

      - `"client"`

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      工具搜索输出的状态。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `AdditionalTools object { role, tools, type, id }`

    - `role: "developer"`

      提供附加工具的角色。仅支持 `developer` 。

      - `"developer"`

    - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

      此条目中可用的附加工具列表。

      - `Function object { name, parameters, strict, 5 more }`

        在你的代码中定义一个模型可以选择调用的函数。了解更多关于 [函数调用](https://platform.openai.com/docs/guides/function-calling).

        - `name: string`

          要调用的函数名称。

        - `parameters: map[unknown] or null`

          描述函数参数的 JSON Schema 对象。

        - `strict: boolean or null`

          是否对此函数工具强制执行严格参数验证。

        - `type: "function"`

          函数工具的类型。始终为 `function`.

          - `"function"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

        - `defer_loading: optional boolean`

          此函数是否延迟并通过工具搜索加载。

        - `description: optional string or null`

          函数的描述。模型据此判断是否调用该函数。

        - `output_schema: optional map[unknown] or null`

          描述此函数字符串输出中编码的 JSON 值的 JSON Schema 对象。

      - `FileSearch object { type, vector_store_ids, filters, 2 more }`

        一种从上传文件中搜索相关内容的工具。了解更多关于 [文件搜索工具](https://platform.openai.com/docs/guides/tools-file-search).

        - `type: "file_search"`

          文件搜索工具的类型。始终为 `file_search`.

          - `"file_search"`

        - `vector_store_ids: array of string`

          要搜索的向量存储的 ID。

        - `filters: optional ComparisonFilter or CompoundFilter or null`

          要应用的筛选器。

          - `ComparisonFilter object { key, type, value }`

            一个过滤器，使用定义的比较操作将指定的属性键与给定值进行比较。

          - `CompoundFilter object { filters, type }`

            使用 `and` 或 `or`.

        - `max_num_results: optional number`

          要返回的最大结果数。此数字应在1到50（含）之间。

        - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

          搜索的排名选项。

          - `hybrid_search: optional object { embedding_weight, text_weight }`

            当启用混合搜索时，控制倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

            - `embedding_weight: number`

              倒数排名融合中嵌入的权重。

            - `text_weight: number`

              倒数排名融合中文本的权重。

          - `ranker: optional "auto" or "default-2024-11-15"`

            用于文件搜索的排序器。

            - `"auto"`

            - `"default-2024-11-15"`

          - `score_threshold: optional number`

            文件搜索的分数阈值，为介于 0 和 1 之间的数字。越接近 1 的数字将尝试仅返回最相关的结果，但可能返回更少的结果。

      - `Computer object { type }`

        一种控制虚拟计算机的工具。了解更多关于 [计算机工具](https://platform.openai.com/docs/guides/tools-computer-use).

        - `type: "computer"`

          计算机工具的类型。始终为 `computer`.

          - `"computer"`

      - `ComputerUsePreview object { display_height, display_width, environment, type }`

        一种控制虚拟计算机的工具。了解更多关于 [计算机工具](https://platform.openai.com/docs/guides/tools-computer-use).

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

        搜索与提示相关的互联网来源。了解更多关于
        [网页搜索工具](/docs/guides/tools-web-search).

        - `type: "web_search" or "web_search_2025_08_26"`

          网页搜索工具的类型。其中之一为 `web_search` 或 `web_search_2025_08_26`.

          - `"web_search"`

          - `"web_search_2025_08_26"`

        - `external_web_access: optional boolean`

          允许网页搜索进行实时互联网访问。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

        - `filters: optional object { allowed_domains }  or null`

          搜索的过滤器。

          - `allowed_domains: optional array of string or null`

            搜索允许的域名。如果未提供，则允许所有域名。
            所提供的域名的子域名也允许。

            示例： `["pubmed.ncbi.nlm.nih.gov"]`

        - `search_context_size: optional "low" or "medium" or "high"`

          用于搜索的上下文窗口空间量的高级指导。其中之一为 `low`, `medium`，或 `high`. `medium` 是默认值。

          - `"low"`

          - `"medium"`

          - `"high"`

        - `user_location: optional object { city, country, region, 2 more }  or null`

          用户的大致位置。

          - `city: optional string or null`

            用户的自由文本城市输入，例如 `San Francisco`.

          - `country: optional string or null`

            两位字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在，例如。 `US`.

          - `region: optional string or null`

            用户的自由文本地区输入，例如 `California`.

          - `timezone: optional string or null`

            该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 用户所在，例如。 `America/Los_Angeles`.

          - `type: optional "approximate"`

            位置近似的类型。始终 `approximate`.

            - `"approximate"`

      - `Mcp object { server_label, type, allowed_callers, 9 more }`

        通过远程 Model Context Protocol 让模型访问额外的工具
        （MCP）服务器。 [了解更多关于 MCP](/docs/guides/tools-remote-mcp).

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

          允许的工具名称列表或过滤器对象。

          - `McpAllowedTools = array of string`

            允许的工具名称的字符串数组

          - `McpToolFilter object { read_only, tool_names }`

            用于指定允许哪些工具的过滤器对象。

            - `read_only: optional boolean`

              指示一个工具是否修改数据或为只读。如果
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `authorization: optional string`

          一个 OAuth 访问令牌，可用于远程 MCP 服务器，既
          可与自定义 MCP 服务器 URL 一起使用，也可与服务连接器一起使用。你的应用
          必须处理 OAuth 授权流程，并将令牌提供在此处。

        - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

          服务连接器的标识符，类似于 ChatGPT 中可用的那些。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
          关于服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

          目前支持的 `connector_id` 值为：

          - Dropbox： `connector_dropbox`
          - Gmail： `connector_gmail`
          - Google Calendar： `connector_googlecalendar`
          - Google Drive： `connector_googledrive`
          - Microsoft Teams： `connector_microsoftteams`
          - Outlook Calendar： `connector_outlookcalendar`
          - Outlook Email： `connector_outlookemail`
          - SharePoint： `connector_sharepoint`

          - `"connector_dropbox"`

          - `"connector_gmail"`

          - `"connector_googlecalendar"`

          - `"connector_googledrive"`

          - `"connector_microsoftteams"`

          - `"connector_outlookcalendar"`

          - `"connector_outlookemail"`

          - `"connector_sharepoint"`

        - `defer_loading: optional boolean`

          此 MCP 工具是否延迟并通过工具搜索发现。

        - `headers: optional map[string] or null`

          要发送到 MCP 服务器的可选 HTTP 头。用于认证
          或其他用途。

        - `require_approval: optional object { always, never }  or "always" or "never" or null`

          指定 MCP 服务器的哪些工具需要审批。

          - `McpToolApprovalFilter object { always, never }`

            指定 MCP 服务器的哪些工具需要审批。可以是
            `always`, `never`，或与需要审批的工具关联的过滤器对象
            。

            - `always: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示一个工具是否修改数据或为只读。如果
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

            - `never: optional object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示一个工具是否修改数据或为只读。如果
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `McpToolApprovalSetting = "always" or "never"`

            为所有工具指定单一审批策略。可以是 `always` 或
            `never`。当设置为 `always`，时，所有工具都需要审批。当
            设置为 `never`，时，所有工具都不需要审批。

            - `"always"`

            - `"never"`

        - `server_description: optional string`

          MCP 服务器的可选描述，用于提供更多上下文。

        - `server_url: optional string`

          MCP 服务器的 URL。必须提供 `server_url`, `connector_id`，或
          `tunnel_id` 其中之一。

        - `tunnel_id: optional string`

          用于替代直接服务器 URL 的安全 MCP 隧道 ID。必须提供
          `server_url`, `connector_id`，或 `tunnel_id` 其中之一。

      - `CodeInterpreter object { container, type, allowed_callers }`

        一种运行 Python 代码以帮助生成提示响应的工具。

        - `container: string or object { type, file_ids, memory_limit, network_policy }`

          代码解释器容器。可以是容器 ID 或
          一个指定上传文件 ID 以使其对你的代码可用，以及一个
          可选 `memory_limit` 设置。

          - `string`

            容器 ID。

          - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器的配置。可选择指定要运行代码的文件 ID。

            - `type: "auto"`

              始终 `auto`.

              - `"auto"`

            - `file_ids: optional array of string`

              可选的已上传文件列表，供你的代码使用。

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
          支持的 GPT 图像模型。对于 `gpt-image-2` 和
          `gpt-image-2-2026-04-21`，此支持为预览版。使用
          `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

          - `"transparent"`

          - `"opaque"`

          - `"auto"`

        - `input_fidelity: optional "high" or "low" or null`

          控制模型在匹配输入图像的风格和特征（尤其是面部特征）时投入的努力程度。此参数仅支持 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不支持 `gpt-image-1-mini`。支持 `high` 和 `low`。默认为 `low`.

          - `"high"`

          - `"low"`

        - `input_image_mask: optional object { file_id, image_url }`

          用于修补的可选遮罩。包含 `image_url`
          （字符串，可选）和 `file_id` （字符串，可选）。

          - `file_id: optional string`

            遮罩图像的文件 ID。

          - `image_url: optional string`

            Base64 编码的遮罩图像。

        - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

          用于图像生成的模型。可选值之一为 `gpt-image-1`,
          `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
          `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
          `gpt-image-1`.

          - `string`

          - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

            用于图像生成的模型。可选值之一为 `gpt-image-1`,
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

          流式模式下生成的部分图像数量，范围为 0（默认值）到 3。

        - `quality: optional "low" or "medium" or "high" or "auto"`

          生成图像的质量。可选值之一为 `low`, `medium`, `high`,
          或 `auto`。默认值： `auto`.

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"auto"`

        - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

          生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，形式为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度必须均能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。分辨率高于 `2560x1440` 为实验性，支持的最大分辨率为 `3840x2160`。请求的大小还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，和 `1024x1536` 由 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

          - `string`

          - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，形式为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度必须均能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。分辨率高于 `2560x1440` 为实验性，支持的最大分辨率为 `3840x2160`。请求的大小还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，和 `1024x1536` 由 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，请使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，请使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

        一种自定义工具，使用指定格式处理输入。了解更多关于   [自定义工具](/docs/guides/function-calling#custom-tools)

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

          此工具是否应延迟并通过工具搜索发现。

        - `description: optional string`

          自定义工具的可选描述，用于提供更多上下文。

        - `format: optional CustomToolInputFormat`

          自定义工具的输入格式。默认为无约束文本。

      - `Namespace object { description, name, tools, type }`

        将函数/自定义工具归组到共享命名空间下。

        - `description: string`

          展示给模型的命名空间描述。

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

              一个 JSON Schema，描述此函数工具的字符串输出中编码的 JSON 值。这不描述 content-array 输出。

            - `parameters: optional unknown or null`

            - `strict: optional boolean or null`

              是否强制执行严格的参数验证。如果省略，Responses 在 schema 兼容时尝试使用严格验证，否则回退到非严格验证。

          - `Custom object { name, type, allowed_callers, 3 more }`

            一种自定义工具，使用指定格式处理输入。了解更多关于   [自定义工具](/docs/guides/function-calling#custom-tools)

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

              此工具是否应延迟并通过工具搜索发现。

            - `description: optional string`

              自定义工具的可选描述，用于提供更多上下文。

            - `format: optional CustomToolInputFormat`

              自定义工具的输入格式。默认为无约束文本。

        - `type: "namespace"`

          工具的类型。始终 `namespace`.

          - `"namespace"`

      - `ToolSearch object { type, description, execution, parameters }`

        用于延迟工具的托管或 BYOT 工具搜索配置。

        - `type: "tool_search"`

          工具的类型。始终 `tool_search`.

          - `"tool_search"`

        - `description: optional string or null`

          展示给模型的客户端执行工具搜索工具的描述。

        - `execution: optional "server" or "client"`

          工具搜索是由服务端执行还是由客户端执行。

          - `"server"`

          - `"client"`

        - `parameters: optional unknown or null`

          客户端执行工具搜索工具的参数 schema。

      - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

        此工具搜索网络以获取相关结果用于响应。了解更多关于 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

        - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

          网页搜索工具的类型。其中之一为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

          - `"web_search_preview"`

          - `"web_search_preview_2025_03_11"`

        - `search_content_types: optional array of "text" or "image"`

          - `"text"`

          - `"image"`

        - `search_context_size: optional "low" or "medium" or "high"`

          用于搜索的上下文窗口空间量的高级指导。其中之一为 `low`, `medium`，或 `high`. `medium` 是默认值。

          - `"low"`

          - `"medium"`

          - `"high"`

        - `user_location: optional object { type, city, country, 2 more }  or null`

          用户的位置。

          - `type: "approximate"`

            位置近似的类型。始终 `approximate`.

            - `"approximate"`

          - `city: optional string or null`

            用户的自由文本城市输入，例如 `San Francisco`.

          - `country: optional string or null`

            两位字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户所在，例如。 `US`.

          - `region: optional string or null`

            用户的自由文本地区输入，例如 `California`.

          - `timezone: optional string or null`

            该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 用户所在，例如。 `America/Los_Angeles`.

      - `ApplyPatch object { type, allowed_callers }`

        允许助手使用统一差异创建、删除或更新文件。

        - `type: "apply_patch"`

          工具的类型。始终 `apply_patch`.

          - `"apply_patch"`

        - `allowed_callers: optional array of "direct" or "programmatic" or null`

          工具调用上下文。

          - `"direct"`

          - `"programmatic"`

    - `type: "additional_tools"`

      项目类型。始终为 `additional_tools`.

      - `"additional_tools"`

    - `id: optional string or null`

      此附加工具条目的唯一 ID。

  - `Reasoning object { id, summary, type, 3 more }`

    推理模型在生成响应时使用的思维链描述。如果你手动
    管理上下文，请务必在 `input` 中向 Responses API
    后续对话轮次中包含这些项目
    [（手动管理上下文）](/docs/guides/conversation-state).

    - `id: string`

      推理内容的唯一标识符。

    - `summary: array of SummaryTextContent`

      推理摘要内容。

      - `text: string`

        模型迄今为止的推理输出摘要。

      - `type: "summary_text"`

        对象类型。始终为 `summary_text`.

        - `"summary_text"`

    - `type: "reasoning"`

      对象类型。始终为 `reasoning`.

      - `"reasoning"`

    - `content: optional array of object { text, type }`

      推理文本内容。

      - `text: string`

        模型的推理文本。

      - `type: "reasoning_text"`

        推理文本的类型。始终为 `reasoning_text`.

        - `"reasoning_text"`

    - `encrypted_content: optional string or null`

      推理条目的加密内容。默认情况下，对于由
      返回的推理条目 `POST /v1/responses` 以及 WebSocket
      `response.create` 请求，此字段会被填充。

      流式传输时，使用已完成推理项及其
      `encrypted_content` 来自 `response.output_item.done` 事件中的
      后续请求。该 `encrypted_content` 中的
      `response.output_item.added` 可能不完整。这在以下情况下尤为重要
      当 `store` 为 `false` 或使用零数据保留时。

    - `status: optional "in_progress" or "completed" or "incomplete"`

      项目的状态。取值为 `in_progress`, `completed`，或
      `incomplete`。当项目通过API返回时填充此字段。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `Compaction object { encrypted_content, type, id }`

    由 [`v1/responses/compact` API](/docs/api-reference/responses/compact).

    - `encrypted_content: string`

      压缩摘要的加密内容。

    - `type: "compaction"`

      该项的类型。始终为 `compaction`.

      - `"compaction"`

    - `id: optional string or null`

      压缩项的 ID。

  - `ImageGenerationCall object { id, result, status, type }`

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

  - `CodeInterpreterCall object { id, code, container_id, 3 more }`

    运行代码的工具调用。

    - `id: string`

      代码解释器工具调用的唯一 ID。

    - `code: string or null`

      要运行的代码，如果不可用则为 null。

    - `container_id: string`

      用于运行代码的容器 ID。

    - `outputs: array of object { logs, type }  or object { type, url }  or null`

      代码解释器生成的输出，例如日志或图像。
      如果没有可用输出，则可以为 null。

      - `Logs object { logs, type }`

        代码解释器输出的日志。

        - `logs: string`

          代码解释器输出的日志。

        - `type: "logs"`

          输出的类型。始终为 `logs`.

          - `"logs"`

      - `Image object { type, url }`

        代码解释器的图像输出。

        - `type: "image"`

          输出的类型。始终为 `image`.

          - `"image"`

        - `url: string`

          代码解释器图像输出的 URL。

    - `status: "in_progress" or "completed" or "incomplete" or 2 more`

      代码解释器工具调用的状态。有效值为 `in_progress`, `completed`, `incomplete`, `interpreting`，和 `failed`.

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

      在服务器上执行 shell 命令。

      - `command: array of string`

        要运行的命令。

      - `env: map[string]`

        要为命令设置的环境变量。

      - `type: "exec"`

        本地 shell 操作的类型。始终为 `exec`.

        - `"exec"`

      - `timeout_ms: optional number or null`

        命令的可选超时时间（毫秒）。

      - `user: optional string or null`

        可选的要运行命令的用户。

      - `working_directory: optional string or null`

        可选的运行命令的工作目录。

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

      项目的状态。取值为 `in_progress`, `completed`，或 `incomplete`.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `ShellCall object { action, call_id, type, 4 more }`

    表示执行一个或多个 shell 命令请求的工具。

    - `action: object { commands, max_output_length, timeout_ms }`

      描述如何运行工具调用的 shell 命令和限制。

      - `commands: array of string`

        供执行环境运行的按顺序排列的 shell 命令。

      - `max_output_length: optional number or null`

        从合并的 stdout 和 stderr 输出中捕获的最大 UTF-8 字符数。

      - `timeout_ms: optional number or null`

        允许 shell 命令运行的最大挂钟时间（毫秒）。

    - `call_id: string`

      模型生成的 shell 工具调用的唯一 ID。

    - `type: "shell_call"`

      该项的类型。始终为 `shell_call`.

      - `"shell_call"`

    - `id: optional string or null`

      shell 工具调用的唯一 ID。当此项目通过 API 返回时填充。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      产生此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          调用方类型。始终为 `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          产生此工具调用的程序项的调用 ID。

        - `type: "program"`

          调用方类型。始终为 `program`.

          - `"program"`

    - `environment: optional LocalEnvironment or ContainerReference or null`

      执行 shell 命令的环境。

      - `LocalEnvironment object { type, skills }`

      - `ContainerReference object { container_id, type }`

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      shell 调用的状态。以下之一： `in_progress`, `completed`，或 `incomplete`.

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `ShellCallOutput object { call_id, output, type, 4 more }`

    shell 工具调用发出的流式输出项目。

    - `call_id: string`

      模型生成的 shell 工具调用的唯一 ID。

    - `output: array of ResponseFunctionShellCallOutputContent`

      捕获的 stdout 和 stderr 输出块，以及它们关联的结果。

      - `outcome: object { type }  or object { exit_code, type }`

        与此 shell 调用关联的退出或超时结果。

        - `Timeout object { type }`

          指示 shell 调用超出了其配置的时间限制。

          - `type: "timeout"`

            结果类型。始终为 `timeout`.

            - `"timeout"`

        - `Exit object { exit_code, type }`

          表示 shell 命令已完成并返回了退出码。

          - `exit_code: number`

            shell 进程返回的退出码。

          - `type: "exit"`

            结果类型。始终为 `exit`.

            - `"exit"`

      - `stderr: string`

        捕获的 shell 调用的 stderr 输出。

      - `stdout: string`

        捕获的 shell 调用的 stdout 输出。

    - `type: "shell_call_output"`

      该项的类型。始终为 `shell_call_output`.

      - `"shell_call_output"`

    - `id: optional string or null`

      shell 工具调用输出的唯一 ID。当此项目通过 API 返回时填充。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      产生此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          调用方类型。始终为 `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          产生此工具调用的程序项的调用 ID。

        - `type: "program"`

          调用方类型。始终为 `program`.

          - `"program"`

    - `max_output_length: optional number or null`

      为此 shell 调用的合并输出捕获的最大 UTF-8 字符数。

    - `status: optional "in_progress" or "completed" or "incomplete" or null`

      shell 调用输出的状态。

      - `"in_progress"`

      - `"completed"`

      - `"incomplete"`

  - `ApplyPatchCall object { call_id, operation, status, 3 more }`

    表示使用 diff 补丁创建、删除或更新文件的工具调用。

    - `call_id: string`

      模型生成的 apply_patch 工具调用的唯一 ID。

    - `operation: object { diff, path, type }  or object { path, type }  or object { diff, path, type }`

      apply_patch 工具调用的具体创建、删除或更新指令。

      - `CreateFile object { diff, path, type }`

        通过 apply_patch 工具创建新文件的指令。

        - `diff: string`

          创建文件时要应用的统一 diff 内容。

        - `path: string`

          要创建的文件相对于工作区根目录的路径。

        - `type: "create_file"`

          操作类型。始终为 `create_file`.

          - `"create_file"`

      - `DeleteFile object { path, type }`

        通过 apply_patch 工具删除现有文件的指令。

        - `path: string`

          要删除的文件相对于工作区根目录的路径。

        - `type: "delete_file"`

          操作类型。始终为 `delete_file`.

          - `"delete_file"`

      - `UpdateFile object { diff, path, type }`

        通过 apply_patch 工具更新现有文件的指令。

        - `diff: string`

          要应用于现有文件的统一 diff 内容。

        - `path: string`

          要更新的文件相对于工作区根目录的路径。

        - `type: "update_file"`

          操作类型。始终为 `update_file`.

          - `"update_file"`

    - `status: "in_progress" or "completed"`

      apply_patch 工具调用的状态。以下之一： `in_progress` 或 `completed`.

      - `"in_progress"`

      - `"completed"`

    - `type: "apply_patch_call"`

      该项的类型。始终为 `apply_patch_call`.

      - `"apply_patch_call"`

    - `id: optional string or null`

      apply patch 工具调用的唯一 ID。当此项目通过 API返回时填充。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      产生此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          调用方类型。始终为 `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          产生此工具调用的程序项的调用 ID。

        - `type: "program"`

          调用方类型。始终为 `program`.

          - `"program"`

  - `ApplyPatchCallOutput object { call_id, status, type, 3 more }`

    由 apply patch 工具调用发出的流式输出。

    - `call_id: string`

      模型生成的 apply_patch 工具调用的唯一 ID。

    - `status: "completed" or "failed"`

      apply patch 工具调用输出的状态。可为 `completed` 或 `failed`.

      - `"completed"`

      - `"failed"`

    - `type: "apply_patch_call_output"`

      该项的类型。始终为 `apply_patch_call_output`.

      - `"apply_patch_call_output"`

    - `id: optional string or null`

      apply patch 工具调用输出的唯一 ID。当此项目通过 API返回时填充。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      产生此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          调用方类型。始终为 `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          产生此工具调用的程序项的调用 ID。

        - `type: "program"`

          调用方类型。始终为 `program`.

          - `"program"`

    - `output: optional string or null`

      来自 apply patch 工具的可选人类可读日志文本（例如 patch 结果或错误）。

  - `McpListTools object { id, server_label, tools, 2 more }`

    MCP 服务器上可用的工具列表。

    - `id: string`

      列表的唯一 ID。

    - `server_label: string`

      MCP 服务器的标签。

    - `tools: array of object { input_schema, name, annotations, description }`

      服务器上可用的工具。

      - `input_schema: unknown`

        描述工具输入的 JSON 架构。

      - `name: string`

        工具的名称。

      - `annotations: optional unknown or null`

        关于工具的附加注释。

      - `description: optional string or null`

        工具的描述。

    - `type: "mcp_list_tools"`

      该项的类型。始终为 `mcp_list_tools`.

      - `"mcp_list_tools"`

    - `error: optional string or null`

      如果服务器无法列出工具时的错误消息。

  - `McpApprovalRequest object { id, arguments, name, 2 more }`

    对工具调用请求人工批准。

    - `id: string`

      审批请求的唯一 ID。

    - `arguments: string`

      工具参数的 JSON 字符串。

    - `name: string`

      要运行的工具的名称。

    - `server_label: string`

      发出请求的 MCP 服务器的标签。

    - `type: "mcp_approval_request"`

      该项的类型。始终为 `mcp_approval_request`.

      - `"mcp_approval_request"`

  - `McpApprovalResponse object { approval_request_id, approve, type, 2 more }`

    对 MCP 审批请求的响应。

    - `approval_request_id: string`

      正在回答的审批请求的 ID。

    - `approve: boolean`

      该请求是否已获批准。

    - `type: "mcp_approval_response"`

      该项的类型。始终为 `mcp_approval_response`.

      - `"mcp_approval_response"`

    - `id: optional string or null`

      审批响应的唯一 ID

    - `reason: optional string or null`

      决定的可选原因。

  - `McpCall object { id, arguments, name, 6 more }`

    在 MCP 服务器上调用工具。

    - `id: string`

      工具调用的唯一 ID。

    - `arguments: string`

      传递给工具的参数的 JSON 字符串。

    - `name: string`

      所运行的工具的名称。

    - `server_label: string`

      运行该工具的 MCP 服务器的标签。

    - `type: "mcp_call"`

      该项的类型。始终为 `mcp_call`.

      - `"mcp_call"`

    - `approval_request_id: optional string or null`

      MCP 工具调用审批请求的唯一标识符。
      在后续 `mcp_approval_response` 输入中包含此值，以批准或拒绝相应的工具调用。

    - `error: optional McpToolCallError or null`

      工具调用产生的错误（如有）。

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

    来自你的代码的自定义工具调用的输出，正在发送回模型。

    - `call_id: string`

      调用 ID，用于将此自定义工具调用输出映射到自定义工具调用。

    - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

      由你的代码生成的自定义工具调用的输出。
      可以是字符串或输出内容列表。

      - `StringOutput = string`

        自定义工具调用的输出的字符串。

      - `OutputContentList = array of ResponseInputText or ResponseInputImage or ResponseInputFile`

        自定义工具调用的文本、图像或文件输出。

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          向模型输入的文本。

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          向模型输入的图像。了解 [图像输入](/docs/guides/vision).

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          发送给模型的文件输入。

    - `type: "custom_tool_call_output"`

      自定义工具调用输出的类型。始终 `custom_tool_call_output`.

      - `"custom_tool_call_output"`

    - `id: optional string`

      自定义工具调用输出在 OpenAI 平台中的唯一 ID。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      产生此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          调用方类型。始终为 `direct`.

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          产生此工具调用的程序项的调用 ID。

        - `type: "program"`

          调用方类型。始终为 `program`.

          - `"program"`

  - `CustomToolCall object { call_id, input, name, 4 more }`

    对模型创建的自定义工具的调用。

    - `call_id: string`

      用于将此自定义工具调用映射到工具调用输出的标识符。

    - `input: string`

      模型生成的自定义工具调用的输入。

    - `name: string`

      被调用的自定义工具的名称。

    - `type: "custom_tool_call"`

      自定义工具调用的类型。始终 `custom_tool_call`.

      - `"custom_tool_call"`

    - `id: optional string`

      自定义工具调用在 OpenAI 平台中的唯一 ID。

    - `caller: optional object { type }  or object { caller_id, type }  or null`

      产生此工具调用的执行上下文。

      - `Direct object { type }`

        - `type: "direct"`

          - `"direct"`

      - `Program object { caller_id, type }`

        - `caller_id: string`

          产生此工具调用的程序项的调用 ID。

        - `type: "program"`

          - `"program"`

    - `namespace: optional string`

      被调用的自定义工具的命名空间。

  - `CompactionTrigger object { type }`

    压缩当前上下文。必须是最后一个输入项。

    - `type: "compaction_trigger"`

      该项的类型。始终为 `compaction_trigger`.

      - `"compaction_trigger"`

  - `ItemReference object { id, type }`

    用于引用某项的内部标识符。

    - `id: string`

      要引用的项的 ID。

    - `type: optional "item_reference" or null`

      要引用的项的类型。始终 `item_reference`.

      - `"item_reference"`

  - `Program object { id, call_id, code, 2 more }`

    - `id: string`

      此程序项的唯一 ID。

    - `call_id: string`

      程序项的稳定调用 ID。

    - `code: string`

      由程序化工具调用执行的 JavaScript 源代码。

    - `fingerprint: string`

      不透明的程序重放指纹，必须进行往返传递。

    - `type: "program"`

      项目类型。始终为 `program`.

      - `"program"`

  - `ProgramOutput object { id, call_id, result, 2 more }`

    - `id: string`

      此程序输出项的唯一 ID。

    - `call_id: string`

      程序项的调用 ID。

    - `result: string`

      程序项产生的结果。

    - `status: "completed" or "incomplete"`

      程序输出的终端状态。

      - `"completed"`

      - `"incomplete"`

    - `type: "program_output"`

      项目类型。始终为 `program_output`.

      - `"program_output"`

- `metadata: optional Metadata or null`

  可附加到对象上的 16 个键值对集合。这可用于
  以结构化格式存储有关对象的附加信息，
  格式，以及通过 API 或仪表盘查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串
  ，最大长度为 512 个字符。

### 返回

- `Conversation object { id, created_at, metadata, object }`

  - `id: string`

    对话的唯一 ID。

  - `created_at: number`

    对话创建的时间，以 Unix 纪元以来的秒数衡量。

  - `metadata: unknown`

    一组 16 个键值对，可附加到对象上。这可用于以结构化格式存储关于对象的额外信息，并通过 API 或仪表板查询对象。
    键是字符串，最大长度为 64 个字符。值是字符串，最大长度为 512 个字符。

  - `object: "conversation"`

    对象类型，始终为 `conversation`.

    - `"conversation"`

### 示例

```http
curl https://api.openai.com/v1/conversations \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "metadata": {},
  "object": "conversation"
}
```

### 示例

```http
curl https://api.openai.com/v1/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "metadata": {"topic": "demo"},
    "items": [
      {
        "type": "message",
        "role": "user",
        "content": "Hello!"
      }
    ]
  }'
```

#### 响应

```json
{
  "id": "conv_123",
  "object": "conversation",
  "created_at": 1741900000,
  "metadata": {"topic": "demo"}
}
```
