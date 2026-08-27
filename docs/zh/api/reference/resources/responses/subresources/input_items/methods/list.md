> 完整的文档索引请参见 [llms.txt](/llms.txt)。通过附加在页面 URL 后，可获取文档页面的 Markdown 版本。 `.md` 即可访问。

## 列出输入条目

**get** `/responses/{response_id}/input_items`

返回给定响应的输入项列表。

### 路径参数

- `response_id: string`

### 查询参数

- `after: optional string`

  用于列出后续项目（分页）的项目 ID。

- `include: optional array of ResponseIncludable`

  响应中包含的附加字段。请参阅 `include`
  上面用于创建 Response 的参数以获取更多信息。

  - `"file_search_call.results"`

  - `"web_search_call.results"`

  - `"web_search_call.action.sources"`

  - `"message.input_image.image_url"`

  - `"computer_call_output.output.image_url"`

  - `"code_interpreter_call.outputs"`

  - `"reasoning.encrypted_content"`

  - `"message.output_text.logprobs"`

- `limit: optional number`

  返回对象数量的限制。限制范围为
  1 到 100，默认值为 20。

- `order: optional "asc" or "desc"`

  返回输入项的顺序。默认为 `desc`.

  - `asc`: 按升序返回输入项。
  - `desc`: 按降序返回输入项。

  - `"asc"`

  - `"desc"`

### 返回

- `ResponseItemList object { data, first_id, has_more, 2 more }`

  Response 项目列表。

  - `data: array of ResponseInputMessageItem or ResponseOutputMessage or object { id, queries, status, 2 more }  or 26 more`

    用于生成此响应的项目列表。

    - `ResponseInputMessageItem object { id, content, role, 2 more }`

      - `id: string`

        消息输入的唯一 ID。

      - `content: ResponseInputMessageContentList`

        一个或多个输入项列表，包含不同类型的内容
        类型。

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          模型的文本输入。

          - `text: string`

            模型的文本输入。

          - `type: "input_text"`

            输入项的类型。始终为 `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputImage object { detail, type, file_id, 2 more }`

          模型的图像输入。了解 [图像输入](/docs/guides/vision).

          - `detail: ImageDetail`

            要发送给模型的图像的详细级别。可选值： `high`, `low`, `auto`，或 `original`。默认值： `auto`.

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

            要发送给模型的图像的 URL。可以是完全限定的 URL，也可以是数据 URL 中的 base64 编码图像。

          - `prompt_cache_breakpoint: optional object { mode }`

            标记可复用提示前缀的精确结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `ResponseInputFile object { type, detail, file_data, 4 more }`

          模型的文件输入。

          - `type: "input_file"`

            输入项的类型。始终为 `input_file`.

            - `"input_file"`

          - `detail: optional "auto" or "low" or "high"`

            要发送给模型的文件的详细级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，可能会增加输入令牌用量。使用 `low` 进行低成本渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

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

            标记可复用提示前缀的精确结束位置。断点继承请求的 TTL `prompt_cache_options.ttl`；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

      - `role: "user" or "system" or "developer"`

        消息输入的角色。可选值包括 `user`, `system`，或 `developer`.

        - `"user"`

        - `"system"`

        - `"developer"`

      - `type: "message"`

        消息输入的类型。始终设置为 `message`.

        - `"message"`

      - `status: optional "in_progress" or "completed" or "incomplete"`

        项目状态。可选值包括 `in_progress`, `completed`，或
        `incomplete`。通过 API 返回项目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

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

                被引用文件的文件名。

              - `index: number`

                该文件在文件列表中的索引。

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

                网络资源的标题。

              - `type: "url_citation"`

                URL 引用的类型。始终为 `url_citation`.

                - `"url_citation"`

              - `url: string`

                网络资源的 URL。

            - `ContainerFileCitation object { container_id, end_index, file_id, 3 more }`

              用于生成模型响应的容器文件的引用。

              - `container_id: string`

                容器文件的 ID。

              - `end_index: number`

                消息中容器文件引用的最后一个字符的索引。

              - `file_id: string`

                文件的 ID。

              - `filename: string`

                所引用的容器文件的文件名。

              - `start_index: number`

                消息中容器文件引用的第一个字符的索引。

              - `type: "container_file_citation"`

                容器文件引用的类型。始终为 `container_file_citation`.

                - `"container_file_citation"`

            - `FilePath object { file_id, index, type }`

              文件的路径。

              - `file_id: string`

                文件的 ID。

              - `index: number`

                该文件在文件列表中的索引。

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

            模型的文本输出。

          - `type: "output_text"`

            输出文本的类型。始终为 `output_text`.

            - `"output_text"`

        - `ResponseOutputRefusal object { refusal, type }`

          模型的拒绝。

          - `refusal: string`

            模型的拒绝解释。

          - `type: "refusal"`

            拒绝的类型。始终为 `refusal`.

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
        对于像 `gpt-5.3-codex` 及更高版本，发送后续请求时，保留并重新发送
        所有助手消息上的阶段 — 删除它可能会降低性能。不用于用户消息。

        - `"commentary"`

        - `"final_answer"`

    - `FileSearchCall object { id, queries, status, 2 more }`

      一次 文件搜索 工具调用的结果。参见
      [文件搜索指南](/docs/guides/tools-file-search) 了解更多信息。

      - `id: string`

        文件搜索工具调用的唯一ID。

      - `queries: array of string`

        用于搜索文件的查询。

      - `status: "in_progress" or "searching" or "completed" or 2 more`

        文件搜索工具调用的状态。其中之一 `in_progress`,
        `searching`, `incomplete` 或 `failed`,

        - `"in_progress"`

        - `"searching"`

        - `"completed"`

        - `"incomplete"`

        - `"failed"`

      - `type: "file_search_call"`

        文件搜索工具调用的类型。始终 `file_search_call`.

        - `"file_search_call"`

      - `results: optional array of object { attributes, file_id, filename, 2 more }  or null`

        文件搜索工具调用的结果。

        - `attributes: optional map[string or number or boolean] or null`

          可附加到对象的一组16个键值对。这可以
          用于以结构化
          格式存储有关对象的附加信息，并通过API或仪表板查询对象。键是字符串
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

          文件的相关性分数——介于 0 和 1 之间的值。

        - `text: optional string`

          从文件中检索到的文本。

    - `ComputerCall object { id, call_id, pending_safety_checks, 4 more }`

      对计算机使用工具的工具调用。请参阅
      [computer use guide](/docs/guides/tools-computer-use) 了解更多信息。

      - `id: string`

        计算机调用的唯一 ID。

      - `call_id: string`

        用于在响应工具调用时提供输出的标识符。

      - `pending_safety_checks: array of object { id, code, message }`

        计算机调用待处理的安全检查。

        - `id: string`

          待处理安全检查的 ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          有关待处理安全检查的详细信息。

      - `status: "in_progress" or "completed" or "incomplete"`

        项目的状态。以下之一： `in_progress`, `completed`，或
        `incomplete`。通过 API 返回项目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "computer_call"`

        计算机调用的类型。始终 `computer_call`.

        - `"computer_call"`

      - `action: optional ComputerAction`

        点击操作。

        - `Click object { button, type, x, 2 more }`

          点击操作。

          - `button: "left" or "right" or "wheel" or 2 more`

            指示点击期间按下了哪个鼠标按钮。以下之一： `left`, `right`, `wheel`, `back`，或 `forward`.

            - `"left"`

            - `"right"`

            - `"wheel"`

            - `"back"`

            - `"forward"`

          - `type: "click"`

            指定事件类型。对于点击操作，此属性始终为 `click`.

            - `"click"`

          - `x: number`

            点击发生的 x 坐标。

          - `y: number`

            点击发生的 y 坐标。

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

            双击发生的 x 坐标。

          - `y: number`

            双击发生的 y 坐标。

        - `Drag object { path, type, keys }`

          拖动操作。

          - `path: array of object { x, y }`

            一个坐标数组，表示拖动操作的路径。坐标将以对象数组的形式出现，例如

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

          模型希望执行的按键操作集合。

          - `keys: array of string`

            模型请求按下的按键组合。这是一个字符串数组，每个字符串表示一个按键。

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

            发生滚动的 x 坐标。

          - `y: number`

            发生滚动的 y 坐标。

          - `keys: optional array of string or null`

            滚动时按住的按键。

        - `Type object { text, type }`

          输入文本的操作。

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

        展平的批处理操作，用于 `computer_use`。每个操作包括一个
        `type` 判别器和操作特定字段。

        - `Click object { button, type, x, 2 more }`

          点击操作。

        - `DoubleClick object { keys, type, x, y }`

          双击操作。

        - `Drag object { path, type, keys }`

          拖动操作。

        - `Keypress object { keys, type }`

          模型希望执行的按键操作集合。

        - `Move object { type, x, y, keys }`

          鼠标移动操作。

        - `Screenshot object { type }`

          截图操作。

        - `Scroll object { scroll_x, scroll_y, type, 3 more }`

          滚动操作。

        - `Type object { text, type }`

          输入文本的操作。

        - `Wait object { type }`

          等待操作。

    - `ComputerCallOutput object { id, call_id, output, 4 more }`

      - `id: string`

        计算机调用工具输出的唯一 ID。

      - `call_id: string`

        产生该输出的计算机工具调用的 ID。

      - `output: ResponseComputerToolCallOutputScreenshot`

        与计算机使用工具一起使用的计算机截图图像。

        - `type: "computer_screenshot"`

          指定事件类型。对于计算机截图，此属性
          始终设置为 `computer_screenshot`.

          - `"computer_screenshot"`

        - `file_id: optional string`

          包含截图的已上传文件的标识符。

        - `image_url: optional string`

          截图图像的 URL。

      - `status: "completed" or "incomplete" or "failed" or "in_progress"`

        消息输入的状态。其中之一 `in_progress`, `completed`，或
        `incomplete`。当输入项通过 API 返回时填充。

        - `"completed"`

        - `"incomplete"`

        - `"failed"`

        - `"in_progress"`

      - `type: "computer_call_output"`

        计算机工具调用输出的类型。始终为 `computer_call_output`.

        - `"computer_call_output"`

      - `acknowledged_safety_checks: optional array of object { id, code, message }`

        API 报告并已由
        开发者确认的安全检查。

        - `id: string`

          待处理安全检查的 ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          有关待处理安全检查的详细信息。

      - `created_by: optional string`

        创建该项的执行者标识符。

    - `WebSearchCall object { id, action, status, type }`

      网页搜索工具调用的结果。参见
      [网页搜索指南](/docs/guides/tools-web-search) 了解更多信息。

      - `id: string`

        网页搜索工具调用的唯一 ID。

      - `action: object { type, queries, query, sources }  or object { type, url }  or object { pattern, type, url }`

        描述本次网页搜索调用中采取的具体操作的对象。
        包括模型如何使用网络（search、open_page、find_in_page）的详细信息。

        - `Search object { type, queries, query, sources }`

          动作类型"search" - 执行网页搜索查询。

          - `type: "search"`

            动作类型。

            - `"search"`

          - `queries: optional array of string`

            搜索查询。

          - `query: optional string`

            搜索查询。

          - `sources: optional array of object { type, url }`

            搜索中使用的来源。

            - `type: "url"`

              来源的类型。始终为 `url`.

              - `"url"`

            - `url: string`

              来源的 URL。

        - `OpenPage object { type, url }`

          操作类型 "open_page" - 打开搜索结果中的特定 URL。

          - `type: "open_page"`

            动作类型。

            - `"open_page"`

          - `url: optional string or null`

            由模型打开的 URL。

        - `FindInPage object { pattern, type, url }`

          操作类型 "find_in_page"：在已加载的页面中搜索模式。

          - `pattern: string`

            要在页面中搜索的模式或文本。

          - `type: "find_in_page"`

            动作类型。

            - `"find_in_page"`

          - `url: string`

            搜索了该模式的页面的 URL。

      - `status: "in_progress" or "searching" or "completed" or "failed"`

        网页搜索 工具调用的状态。

        - `"in_progress"`

        - `"searching"`

        - `"completed"`

        - `"failed"`

      - `type: "web_search_call"`

        网页搜索 工具调用的类型。始终为 `web_search_call`.

        - `"web_search_call"`

    - `FunctionCall object { id, arguments, call_id, 6 more }`

      - `id: string`

        函数工具调用的唯一 ID。

      - `arguments: string`

        要传递给函数的参数的 JSON 字符串。

      - `call_id: string`

        由模型生成的函数工具调用的唯一 ID。

      - `name: string`

        要运行的函数的名称。

      - `status: "in_progress" or "completed" or "incomplete"`

        项目的状态。以下之一： `in_progress`, `completed`，或
        `incomplete`。通过 API 返回项目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "function_call"`

        函数工具调用的类型。始终为 `function_call`.

        - `"function_call"`

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

      - `created_by: optional string`

        创建该项的执行者标识符。

      - `namespace: optional string`

        要运行的函数的命名空间。

    - `FunctionCallOutput object { id, output, status, 6 more }`

      - `id: string`

        函数调用工具输出的唯一 ID。

      - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

        由你的代码生成的函数调用的输出。
        可以是字符串或输出内容的列表。

        - `StringOutput = string`

          函数调用的输出字符串。

        - `OutputContentList = array of ResponseInputText or ResponseInputImage or ResponseInputFile`

          函数调用的文本、图像或文件输出。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            模型的图像输入。了解 [图像输入](/docs/guides/vision).

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            模型的文件输入。

      - `status: "in_progress" or "completed" or "incomplete"`

        项目的状态。以下之一： `in_progress`, `completed`，或
        `incomplete`。通过 API 返回项目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "function_call_output"`

        函数工具调用输出的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `call_id: optional string`

        由模型生成的函数工具调用的唯一 ID。

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

      - `created_by: optional string`

        创建该项的执行者标识符。

      - `name: optional string`

        产生输出的工具名称。

      - `namespace: optional string`

        产生输出的工具的命名空间。

    - `ToolSearchCall object { id, arguments, call_id, 4 more }`

      - `id: string`

        工具搜索调用项的唯一 ID。

      - `arguments: unknown`

        工具搜索调用使用的参数。

      - `call_id: string or null`

        模型生成的工具搜索调用的唯一 ID。

      - `execution: "server" or "client"`

        工具搜索是由服务端执行还是由客户端执行。

        - `"server"`

        - `"client"`

      - `status: "in_progress" or "completed" or "incomplete"`

        记录的工具搜索调用项的状态。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "tool_search_call"`

        项的类型。始终为 `tool_search_call`.

        - `"tool_search_call"`

      - `created_by: optional string`

        创建该项的执行者标识符。

    - `ToolSearchOutput object { id, call_id, execution, 4 more }`

      - `id: string`

        工具搜索输出项的唯一 ID。

      - `call_id: string or null`

        模型生成的工具搜索调用的唯一 ID。

      - `execution: "server" or "client"`

        工具搜索是由服务端执行还是由客户端执行。

        - `"server"`

        - `"client"`

      - `status: "in_progress" or "completed" or "incomplete"`

        记录的工具搜索输出项的状态。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        工具搜索返回的已加载工具定义。

        - `Function object { name, parameters, strict, 5 more }`

          定义你代码中模型可选择调用的函数。了解有关 [函数调用](https://platform.openai.com/docs/guides/function-calling).

          - `name: string`

            要调用的函数的名称。

          - `parameters: map[unknown] or null`

            描述函数参数的 JSON schema 对象。

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

            函数的描述。模型据此决定是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            一个 JSON schema 对象，描述此函数字符串输出中编码的 JSON 值。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          一个从上传文件中搜索相关内容的工具。了解更多关于 [文件搜索 工具](https://platform.openai.com/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索 工具的类型。始终为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的过滤器。

            - `ComparisonFilter object { key, type, value }`

              用于通过定义的比较操作将指定属性键与给定值进行比较的过滤器。

              - `key: string`

                用于与值进行比较的键。

              - `type: "eq" or "ne" or "gt" or 5 more`

                指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

                - `eq`：等于
                - `ne`：不等于
                - `gt`：大于
                - `gte`：大于或等于
                - `lt`：小于
                - `lte`：小于或等于
                - `in`：在
                - `nin`：不在

                - `"eq"`

                - `"ne"`

                - `"gt"`

                - `"gte"`

                - `"lt"`

                - `"lte"`

                - `"in"`

                - `"nin"`

              - `value: string or number or boolean or array of string or number`

                要与属性键比较的值；支持字符串、数字或布尔类型。

                - `string`

                - `number`

                - `boolean`

                - `array of string or number`

                  - `string`

                  - `number`

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个过滤器 `and` 或 `or`.

              - `filters: array of ComparisonFilter or unknown`

                要组合的过滤器数组。项目可以是 `ComparisonFilter` 或 `CompoundFilter`.

                - `ComparisonFilter object { key, type, value }`

                  用于通过定义的比较操作将指定属性键与给定值进行比较的过滤器。

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

              当启用混合搜索时，控制倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

              - `embedding_weight: number`

                倒数排名融合中嵌入的权重。

              - `text_weight: number`

                倒数排名融合中文本的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排名器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，一个介于 0 和 1 之间的数字。更接近 1 的数字将尝试仅返回最相关的结果，但可能返回较少的结果。

        - `Computer object { type }`

          一个控制虚拟计算机的工具。了解有关 [计算机工具](https://platform.openai.com/docs/guides/tools-computer-use).

          - `type: "computer"`

            计算机工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          一个控制虚拟计算机的工具。了解有关 [计算机工具](https://platform.openai.com/docs/guides/tools-computer-use).

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

          搜索互联网以获取与提示相关的来源。详细了解
          [网页搜索工具](/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。之一 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许网页搜索进行实时互联网访问。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的过滤器。

            - `allowed_domains: optional array of string or null`

              允许搜索的域名。如果未提供，则允许所有域名。
              所提供域名的子域名也允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间量的高级指导。之一 `low`, `medium`，或 `high`. `medium` 是默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户的，例如。 `US`.

            - `region: optional string or null`

              用户地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 用户的，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似类型。始终 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议为模型提供额外工具
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

            允许的工具名称列表或过滤器对象。

            - `McpAllowedTools = array of string`

              允许的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器被 [注释为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            一个 OAuth 访问令牌，可与远程 MCP 服务器一起使用，
            可与自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用程序
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，如 ChatGPT 中可用的那些。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
            关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

            目前支持 `connector_id` 支持的值为：

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

            此 MCP 工具是否被延迟并通过工具搜索发现。

          - `headers: optional map[string] or null`

            要发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`，或与需要审批的工具关联的过滤器对象
              。

              - `always: optional object { read_only, tool_names }`

                指定允许哪些工具的过滤器对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [注释为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                指定允许哪些工具的过滤器对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [注释为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定一个审批策略。可以是 `always` 或
              `never`。之一。当设置为 `always`，时，所有工具都需要审批。当设置为
              时 `never`，所有工具均无需审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。必须提供 `server_url`, `connector_id`，或
            `tunnel_id` 之一。

          - `tunnel_id: optional string`

            安全 MCP 隧道 ID，用于替代直接服务器 URL。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。

        - `CodeInterpreter object { container, type, allowed_callers }`

          一个运行 Python 代码以帮助生成提示响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID 或一个
            指定上传文件 ID 的对象，以使这些文件可供你的代码使用，并附带
            可选 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定要运行代码的文件的 ID。

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

                    仅允许对指定域名的出站网络访问。始终 `allowlist`.

                    - `"allowlist"`

                  - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                    可选的范围限定于域的密钥，用于允许列表中的域名。

                    - `domain: string`

                      与该密钥关联的域名。

                    - `name: string`

                      要为该域名注入的密钥名称。

                    - `value: string`

                      要为该域名注入的密钥值。

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

            设置生成图像的背景。选项之一： `transparent`,
            `opaque`，或 `auto`。透明背景可用于
            支持的 GPT 图像模型。对于 `gpt-image-2` 和
            `gpt-image-2-2026-04-21`，此支持处于预览阶段。使用
            `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）方面投入多少努力。此参数仅支持 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不支持 `gpt-image-1-mini`。支持 `high` 和 `low`。默认值： `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于修复的可选蒙版。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

            - `file_id: optional string`

              掩码图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的掩码图像。

          - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

            要使用的图像生成模型。之一为 `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
            `gpt-image-1`.

            - `string`

            - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

              要使用的图像生成模型。之一为 `gpt-image-1`,
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

            生成图像的输出格式。之一为 `png`, `webp`，或
            `jpeg`。默认值： `png`.

            - `"png"`

            - `"webp"`

            - `"jpeg"`

          - `partial_images: optional number`

            在流式模式下生成的部分图像数量，范围为 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or "auto"`

            生成图像的质量。之一为 `low`, `medium`, `high`,
            或 `auto`。默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，作为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性，支持的最大分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`, 以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于允许自动调整尺寸的模型。对于 `dall-e-2`，使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，作为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性，支持的最大分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`, 以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于允许自动调整尺寸的模型。对于 `dall-e-2`，使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

                自动为此请求创建容器

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

                可选的技能列表，按 ID 或内联数据引用。

                - `SkillReference object { skill_id, type, version }`

                  - `skill_id: string`

                    所引用技能的 ID。

                  - `type: "skill_reference"`

                    引用通过 /v1/skills 端点创建的技能。

                    - `"skill_reference"`

                  - `version: optional string`

                    可选的技能版本。使用正整数或 'latest'。省略时使用默认值。

                - `InlineSkill object { description, name, source, type }`

                  - `description: string`

                    该技能的描述。

                  - `name: string`

                    该技能的名称。

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

                    为此请求定义内联技能。

                    - `"inline"`

            - `LocalEnvironment object { type, skills }`

              - `type: "local"`

                使用本地计算机环境。

                - `"local"`

              - `skills: optional array of LocalSkill`

                可选的技能列表。

                - `description: string`

                  该技能的描述。

                - `name: string`

                  该技能的名称。

                - `path: string`

                  包含该技能的目录的路径。

            - `ContainerReference object { container_id, type }`

              - `container_id: string`

                所引用容器的 ID。

              - `type: "container_reference"`

                引用使用 /v1/containers 端点创建的容器

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

            是否应延迟此工具并可通过工具搜索发现。

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

          将函数/自定义工具分组到共享命名空间下。

          - `description: string`

            显示给模型的命名空间描述。

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

                是否应延迟此函数并可通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                一个 JSON Schema，描述此函数工具的字符串输出中编码的 JSON 值。这不描述内容数组输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制严格参数验证。如果省略，Responses 会在 schema 兼容时尝试使用严格验证，否则回退到非严格验证。

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

                是否应延迟此工具并可通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认为无约束文本。

          - `type: "namespace"`

            工具的类型。始终为 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          托管工具或 BYOT 工具搜索配置，用于延迟工具。

          - `type: "tool_search"`

            工具的类型。始终为 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            为客户端执行的工具搜索工具显示的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端还是客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具搜索网页以获取相关结果用于响应。了解更多关于 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间量的高级指导。之一 `low`, `medium`，或 `high`. `medium` 是默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户的位置。

            - `type: "approximate"`

              位置近似类型。始终 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户的，例如。 `US`.

            - `region: optional string or null`

              用户地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 用户的，例如。 `America/Los_Angeles`.

        - `ApplyPatch object { type, allowed_callers }`

          允许助手使用统一 diff 创建、删除或更新文件。

          - `type: "apply_patch"`

            工具的类型。始终为 `apply_patch`.

            - `"apply_patch"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

      - `type: "tool_search_output"`

        项的类型。始终为 `tool_search_output`.

        - `"tool_search_output"`

      - `created_by: optional string`

        创建该项的执行者标识符。

    - `AdditionalTools object { id, role, tools, type }`

      - `id: string`

        附加工具项的唯一 ID。

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

        在此项中提供的附加工具定义。

        - `Function object { name, parameters, strict, 5 more }`

          定义你代码中模型可选择调用的函数。了解有关 [函数调用](https://platform.openai.com/docs/guides/function-calling).

          - `name: string`

            要调用的函数的名称。

          - `parameters: map[unknown] or null`

            描述函数参数的 JSON schema 对象。

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

            函数的描述。模型据此决定是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            一个 JSON schema 对象，描述此函数字符串输出中编码的 JSON 值。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          一个从上传文件中搜索相关内容的工具。了解更多关于 [文件搜索 工具](https://platform.openai.com/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索 工具的类型。始终为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的过滤器。

            - `ComparisonFilter object { key, type, value }`

              用于通过定义的比较操作将指定属性键与给定值进行比较的过滤器。

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个过滤器 `and` 或 `or`.

          - `max_num_results: optional number`

            要返回的最大结果数。此数字应在 1 到 50 之间（含）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排名选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              当启用混合搜索时，控制倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

              - `embedding_weight: number`

                倒数排名融合中嵌入的权重。

              - `text_weight: number`

                倒数排名融合中文本的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排名器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，一个介于 0 和 1 之间的数字。更接近 1 的数字将尝试仅返回最相关的结果，但可能返回较少的结果。

        - `Computer object { type }`

          一个控制虚拟计算机的工具。了解有关 [计算机工具](https://platform.openai.com/docs/guides/tools-computer-use).

          - `type: "computer"`

            计算机工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          一个控制虚拟计算机的工具。了解有关 [计算机工具](https://platform.openai.com/docs/guides/tools-computer-use).

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

          搜索互联网以获取与提示相关的来源。详细了解
          [网页搜索工具](/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。之一 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许网页搜索进行实时互联网访问。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的过滤器。

            - `allowed_domains: optional array of string or null`

              允许搜索的域名。如果未提供，则允许所有域名。
              所提供域名的子域名也允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间量的高级指导。之一 `low`, `medium`，或 `high`. `medium` 是默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户的，例如。 `US`.

            - `region: optional string or null`

              用户地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 用户的，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似类型。始终 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议为模型提供额外工具
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

            允许的工具名称列表或过滤器对象。

            - `McpAllowedTools = array of string`

              允许的工具名称的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果
                MCP 服务器被 [注释为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            一个 OAuth 访问令牌，可与远程 MCP 服务器一起使用，
            可与自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用程序
            必须处理 OAuth 授权流程并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，如 ChatGPT 中可用的那些。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 其中之一。了解更多
            关于服务连接器的信息 [此处](/docs/guides/tools-remote-mcp#connectors).

            目前支持 `connector_id` 支持的值为：

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

            此 MCP 工具是否被延迟并通过工具搜索发现。

          - `headers: optional map[string] or null`

            要发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`，或与需要审批的工具关联的过滤器对象
              。

              - `always: optional object { read_only, tool_names }`

                指定允许哪些工具的过滤器对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [注释为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                指定允许哪些工具的过滤器对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果
                  MCP 服务器被 [注释为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定一个审批策略。可以是 `always` 或
              `never`。之一。当设置为 `always`，时，所有工具都需要审批。当设置为
              时 `never`，所有工具均无需审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。必须提供 `server_url`, `connector_id`，或
            `tunnel_id` 之一。

          - `tunnel_id: optional string`

            安全 MCP 隧道 ID，用于替代直接服务器 URL。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 之一。

        - `CodeInterpreter object { container, type, allowed_callers }`

          一个运行 Python 代码以帮助生成提示响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID 或一个
            指定上传文件 ID 的对象，以使这些文件可供你的代码使用，并附带
            可选 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定要运行代码的文件的 ID。

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

            设置生成图像的背景。选项之一： `transparent`,
            `opaque`，或 `auto`。透明背景可用于
            支持的 GPT 图像模型。对于 `gpt-image-2` 和
            `gpt-image-2-2026-04-21`，此支持处于预览阶段。使用
            `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）方面投入多少努力。此参数仅支持 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不支持 `gpt-image-1-mini`。支持 `high` 和 `low`。默认值： `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于修复的可选蒙版。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

            - `file_id: optional string`

              掩码图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的掩码图像。

          - `model: optional string or "gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

            要使用的图像生成模型。之一为 `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
            `gpt-image-1`.

            - `string`

            - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

              要使用的图像生成模型。之一为 `gpt-image-1`,
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

            生成图像的输出格式。之一为 `png`, `webp`，或
            `jpeg`。默认值： `png`.

            - `"png"`

            - `"webp"`

            - `"jpeg"`

          - `partial_images: optional number`

            在流式模式下生成的部分图像数量，范围为 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or "auto"`

            生成图像的质量。之一为 `low`, `medium`, `high`,
            或 `auto`。默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，作为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性，支持的最大分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`, 以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于允许自动调整尺寸的模型。对于 `dall-e-2`，使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，作为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率为实验性，支持的最大分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`, 以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于允许自动调整尺寸的模型。对于 `dall-e-2`，使用以下之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

            - `LocalEnvironment object { type, skills }`

            - `ContainerReference object { container_id, type }`

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

            是否应延迟此工具并可通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认为无约束文本。

        - `Namespace object { description, name, tools, type }`

          将函数/自定义工具分组到共享命名空间下。

          - `description: string`

            显示给模型的命名空间描述。

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

                是否应延迟此函数并可通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                一个 JSON Schema，描述此函数工具的字符串输出中编码的 JSON 值。这不描述内容数组输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制严格参数验证。如果省略，Responses 会在 schema 兼容时尝试使用严格验证，否则回退到非严格验证。

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

                是否应延迟此工具并可通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认为无约束文本。

          - `type: "namespace"`

            工具的类型。始终为 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          托管工具或 BYOT 工具搜索配置，用于延迟工具。

          - `type: "tool_search"`

            工具的类型。始终为 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            为客户端执行的工具搜索工具显示的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端还是客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具搜索网页以获取相关结果用于响应。了解更多关于 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间量的高级指导。之一 `low`, `medium`，或 `high`. `medium` 是默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户的位置。

            - `type: "approximate"`

              位置近似类型。始终 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两位 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 用户的，例如。 `US`.

            - `region: optional string or null`

              用户地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 用户的，例如。 `America/Los_Angeles`.

        - `ApplyPatch object { type, allowed_callers }`

          允许助手使用统一 diff 创建、删除或更新文件。

          - `type: "apply_patch"`

            工具的类型。始终为 `apply_patch`.

            - `"apply_patch"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

      - `type: "additional_tools"`

        项的类型。始终为 `additional_tools`.

        - `"additional_tools"`

    - `Reasoning object { id, summary, type, 3 more }`

      推理模型生成时使用的思维链的描述
      响应。请确保在手动管理上下文时将这些项目包含在 `input` Responses API
      用于对话的后续轮次，如果你手动
      [管理上下文](/docs/guides/conversation-state).

      - `id: string`

        推理内容的唯一标识符。

      - `summary: array of SummaryTextContent`

        推理摘要内容。

        - `text: string`

          模型迄今为止的推理输出的摘要。

        - `type: "summary_text"`

          对象类型。始终为 `summary_text`.

          - `"summary_text"`

      - `type: "reasoning"`

        对象类型。始终为 `reasoning`.

        - `"reasoning"`

      - `content: optional array of object { text, type }`

        推理文本内容。

        - `text: string`

          来自模型的推理文本。

        - `type: "reasoning_text"`

          推理文本的类型。始终为 `reasoning_text`.

          - `"reasoning_text"`

      - `encrypted_content: optional string or null`

        推理项目的加密内容。默认情况下，此字段由以下请求填充
        对于由以下请求返回的推理项目， `POST /v1/responses` 和 WebSocket
        `response.create` 请求。

        当进行流式传输时，请使用完整的推理项目及其
        `encrypted_content` 来自 `response.output_item.done` 事件，在
        后续请求中。 `encrypted_content` 中的
        `response.output_item.added` 可能不完整。这一点尤其重要
        当 `store` 为 `false` 或使用零数据保留时。

      - `status: optional "in_progress" or "completed" or "incomplete"`

        项目的状态。以下之一： `in_progress`, `completed`，或
        `incomplete`。通过 API 返回项目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `Program object { id, call_id, code, 2 more }`

      - `id: string`

        程序项目的唯一 ID。

      - `call_id: string`

        程序项目的稳定调用 ID。

      - `code: string`

        由编程工具调用执行的 JavaScript 源代码。

      - `fingerprint: string`

        Opaque program replay fingerprint that must be round-tripped.

      - `type: "program"`

        项的类型。始终为 `program`.

        - `"program"`

    - `ProgramOutput object { id, call_id, result, 2 more }`

      - `id: string`

        The unique ID of the program output item.

      - `call_id: string`

        The call ID of the program item.

      - `result: string`

        The result produced by the program item.

      - `status: "completed" or "incomplete"`

        The terminal status of the program output item.

        - `"completed"`

        - `"incomplete"`

      - `type: "program_output"`

        项的类型。始终为 `program_output`.

        - `"program_output"`

    - `Compaction object { id, encrypted_content, type, created_by }`

      A compaction item generated by the [`v1/responses/compact` API](/docs/api-reference/responses/compact).

      - `id: string`

        The unique ID of the compaction item.

      - `encrypted_content: string`

        The encrypted content that was produced by compaction.

      - `type: "compaction"`

        项的类型。始终为 `compaction`.

        - `"compaction"`

      - `created_by: optional string`

        创建该项的执行者标识符。

    - `ImageGenerationCall object { id, result, status, type }`

      An image generation request made by the model.

      - `id: string`

        The unique ID of the image generation call.

      - `result: string or null`

        The generated image encoded in base64.

      - `status: "in_progress" or "completed" or "generating" or "failed"`

        The status of the image generation call.

        - `"in_progress"`

        - `"completed"`

        - `"generating"`

        - `"failed"`

      - `type: "image_generation_call"`

        The type of the image generation call. Always `image_generation_call`.

        - `"image_generation_call"`

    - `CodeInterpreterCall object { id, code, container_id, 3 more }`

      A tool call to run code.

      - `id: string`

        The unique ID of the code interpreter tool call.

      - `code: string or null`

        The code to run, or null if not available.

      - `container_id: string`

        The ID of the container used to run the code.

      - `outputs: array of object { logs, type }  or object { type, url }  or null`

        The outputs generated by the code interpreter, such as logs or images.
        Can be null if no outputs are available.

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

        代码解释器工具调用的状态。有效值为 `in_progress`, `completed`, `incomplete`, `interpreting`, 以及 `failed`.

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

          为命令设置的环境变量。

        - `type: "exec"`

          本地 shell 操作的类型。始终为 `exec`.

          - `"exec"`

        - `timeout_ms: optional number or null`

          命令的可选超时时间（毫秒）。

        - `user: optional string or null`

          运行命令的可选用户。

        - `working_directory: optional string or null`

          运行命令的可选工作目录。

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

        本地 shell 工具调用输出的类型。始终 `local_shell_call_output`.

        - `"local_shell_call_output"`

      - `status: optional "in_progress" or "completed" or "incomplete" or null`

        项目的状态。以下之一： `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `ShellCall object { id, action, call_id, 5 more }`

      在托管环境中执行一条或多条 shell 命令的工具调用。

      - `id: string`

        shell 工具调用的唯一 ID。当此项目通过 API 返回时填充。

      - `action: object { commands, max_output_length, timeout_ms }`

        描述如何运行工具调用的 shell 命令和限制。

        - `commands: array of string`

        - `max_output_length: number or null`

          每条命令返回的最大字符数（可选）。

        - `timeout_ms: number or null`

          命令的超时时间（毫秒，可选）。

      - `call_id: string`

        由模型生成的 shell 工具调用的唯一 ID。

      - `environment: ResponseLocalEnvironment or ResponseContainerReference or null`

        表示使用本地环境执行 shell 操作。

        - `ResponseLocalEnvironment object { type }`

          表示使用本地环境执行 shell 操作。

          - `type: "local"`

            环境类型。始终 `local`.

            - `"local"`

        - `ResponseContainerReference object { container_id, type }`

          表示通过 /v1/containers 创建的容器。

          - `container_id: string`

          - `type: "container_reference"`

            环境类型。始终 `container_reference`.

            - `"container_reference"`

      - `status: "in_progress" or "completed" or "incomplete"`

        shell 调用的状态。以下几种之一： `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "shell_call"`

        项的类型。始终为 `shell_call`.

        - `"shell_call"`

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

      - `created_by: optional string`

        创建此工具调用的实体的 ID。

    - `ShellCallOutput object { id, call_id, max_output_length, 5 more }`

      已发出的 shell 工具调用的输出。

      - `id: string`

        shell 调用输出的唯一 ID。当此项目通过 API 返回时填充。

      - `call_id: string`

        由模型生成的 shell 工具调用的唯一 ID。

      - `max_output_length: number or null`

        shell 命令输出的最大长度。这是由模型生成的，应与原始输出一起传回。

      - `output: array of object { outcome, stderr, stdout, created_by }`

        shell 调用输出内容数组

        - `outcome: object { type }  or object { exit_code, type }`

          表示 shell 调用输出块的退出结果（带退出码）或超时结果。

          - `Timeout object { type }`

            表示 shell 调用超过了其配置的时间限制。

            - `type: "timeout"`

              结果类型。始终 `timeout`.

              - `"timeout"`

          - `Exit object { exit_code, type }`

            表示 shell 命令已完成并返回退出码。

            - `exit_code: number`

              shell 进程的退出码。

            - `type: "exit"`

              结果类型。始终 `exit`.

              - `"exit"`

        - `stderr: string`

          捕获的标准错误输出。

        - `stdout: string`

          捕获的标准输出。

        - `created_by: optional string`

          创建该项的执行者标识符。

      - `status: "in_progress" or "completed" or "incomplete"`

        shell 调用输出的状态。取值之一： `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "shell_call_output"`

        shell 调用输出的类型。始终为 `shell_call_output`.

        - `"shell_call_output"`

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

      - `created_by: optional string`

        创建该项的执行者标识符。

    - `ApplyPatchCall object { id, call_id, operation, 4 more }`

      通过创建、删除或更新文件来应用文件差异的工具调用。

      - `id: string`

        apply patch 工具调用的唯一 ID。当此项目通过 API 返回时填充。

      - `call_id: string`

        模型生成的 apply patch 工具调用的唯一 ID。

      - `operation: object { diff, path, type }  or object { path, type }  or object { diff, path, type }`

        通过 apply_patch 应用的 create_file、delete_file 或 update_file 操作之一。

        - `CreateFile object { diff, path, type }`

          描述如何通过 apply_patch 工具创建文件的指令。

          - `diff: string`

            要应用的差异。

          - `path: string`

            要创建的文件的路径。

          - `type: "create_file"`

            使用提供的差异创建新文件。

            - `"create_file"`

        - `DeleteFile object { path, type }`

          描述如何通过 apply_patch 工具删除文件的指令。

          - `path: string`

            要删除的文件的路径。

          - `type: "delete_file"`

            删除指定的文件。

            - `"delete_file"`

        - `UpdateFile object { diff, path, type }`

          描述如何通过 apply_patch 工具更新文件的指令。

          - `diff: string`

            要应用的差异。

          - `path: string`

            要更新的文件的路径。

          - `type: "update_file"`

            使用提供的差异更新现有文件。

            - `"update_file"`

      - `status: "in_progress" or "completed"`

        apply patch 工具调用的状态。取值之一： `in_progress` 或 `completed`.

        - `"in_progress"`

        - `"completed"`

      - `type: "apply_patch_call"`

        项的类型。始终为 `apply_patch_call`.

        - `"apply_patch_call"`

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

      - `created_by: optional string`

        创建此工具调用的实体的 ID。

    - `ApplyPatchCallOutput object { id, call_id, status, 4 more }`

      apply patch 工具调用所输出的内容。

      - `id: string`

        apply patch 工具调用输出的唯一 ID。当此项目通过 API 返回时填充此字段。

      - `call_id: string`

        模型生成的 apply patch 工具调用的唯一 ID。

      - `status: "completed" or "failed"`

        apply patch 工具调用输出的状态。可选值为 `completed` 或 `failed`.

        - `"completed"`

        - `"failed"`

      - `type: "apply_patch_call_output"`

        项的类型。始终为 `apply_patch_call_output`.

        - `"apply_patch_call_output"`

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

      - `created_by: optional string`

        创建此工具调用输出的实体 ID。

      - `output: optional string or null`

        apply patch 工具返回的可选文本输出。

    - `McpListTools object { id, server_label, tools, 2 more }`

      MCP 服务器上可用工具的列表。

      - `id: string`

        列表的唯一 ID。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        项的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `error: optional string or null`

        如果服务器无法列出工具，则显示错误消息。

    - `McpApprovalRequest object { id, arguments, name, 2 more }`

      请求人工批准工具调用的请求。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具的名称。

      - `server_label: string`

        发出请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        项的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

    - `McpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      对 MCP 审批请求的响应。

      - `id: string`

        审批响应的唯一 ID

      - `approval_request_id: string`

        正在回答的审批请求的 ID。

      - `approve: boolean`

        请求是否已获批准。

      - `type: "mcp_approval_response"`

        项的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        决策的可选原因。

    - `McpCall object { id, arguments, name, 6 more }`

      在 MCP 服务器上调用工具。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数的 JSON 字符串。

      - `name: string`

        所运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        项的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        MCP 工具调用审批请求的唯一标识符。
        在后续 `mcp_approval_response` 输入中包含此值以批准或拒绝相应的工具调用。

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

        工具调用的状态。以下之一： `in_progress`, `completed`, `incomplete`, `calling`，或 `failed`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

        - `"calling"`

        - `"failed"`

    - `CustomToolCall object { id, call_id, input, 6 more }`

      - `id: string`

        自定义工具调用项目的唯一 ID。

      - `call_id: string`

        用于将此自定义工具调用映射到工具调用输出的标识符。

      - `input: string`

        模型生成的自定义工具调用的输入。

      - `name: string`

        正在调用的自定义工具的名称。

      - `status: "in_progress" or "completed" or "incomplete"`

        项目的状态。以下之一： `in_progress`, `completed`，或
        `incomplete`。通过 API 返回项目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "custom_tool_call"`

        自定义工具调用的类型。始终为 `custom_tool_call`.

        - `"custom_tool_call"`

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

      - `created_by: optional string`

        创建该项的执行者标识符。

      - `namespace: optional string`

        正在调用的自定义工具所在的命名空间。

    - `CustomToolCallOutput object { id, call_id, output, 4 more }`

      - `id: string`

        自定义工具调用输出项的唯一 ID。

      - `call_id: string`

        调用 ID，用于将此自定义工具调用输出映射到自定义工具调用。

      - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

        你的代码生成的自定义工具调用的输出。
        可以是字符串或输出内容的列表。

        - `StringOutput = string`

          自定义工具调用输出的字符串。

        - `OutputContentList = array of ResponseInputText or ResponseInputImage or ResponseInputFile`

          自定义工具调用的文本、图像或文件输出。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            模型的图像输入。了解 [图像输入](/docs/guides/vision).

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            模型的文件输入。

      - `status: "in_progress" or "completed" or "incomplete"`

        项目的状态。以下之一： `in_progress`, `completed`，或
        `incomplete`。通过 API 返回项目时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "custom_tool_call_output"`

        自定义工具调用输出的类型。始终 `custom_tool_call_output`.

        - `"custom_tool_call_output"`

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

      - `created_by: optional string`

        创建该项的执行者标识符。

  - `first_id: string`

    列表中第一项的 ID。

  - `has_more: boolean`

    是否还有更多可用的项。

  - `last_id: string`

    列表中最后一项的 ID。

  - `object: "list"`

    返回的对象类型，必须为 `list`.

    - `"list"`

### 示例

```http
curl https://api.openai.com/v1/responses/$RESPONSE_ID/input_items \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
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
      "role": "user",
      "type": "message",
      "status": "in_progress"
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
curl https://api.openai.com/v1/responses/resp_abc123/input_items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "id": "msg_abc123",
      "type": "message",
      "role": "user",
      "content": [
        {
          "type": "input_text",
          "text": "Tell me a three sentence bedtime story about a unicorn."
        }
      ]
    }
  ],
  "first_id": "msg_abc123",
  "last_id": "msg_abc123",
  "has_more": false
}
```
