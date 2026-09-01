> 完整文档索引请参见 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

## 创建模型响应

**post** `/responses`

创建模型响应。提供 [文本](/docs/guides/text) 或
[图像](/docs/guides/images) 作为输入以生成 [文本](/docs/guides/text)
或 [JSON](/docs/guides/structured-outputs) 输出。让模型调用
你自己的 [自定义代码](/docs/guides/function-calling) 或使用内置的
[工具](/docs/guides/tools) ，例如 [网页搜索](/docs/guides/tools-web-search)
或 [文件搜索](/docs/guides/tools-file-search) 以使用你自己的数据
作为模型响应的输入。

### Body Parameters

- `background: optional boolean or null`

  是否在后台运行模型响应。
  [了解更多](/docs/guides/background).

- `context_management: optional array of object { type, compact_threshold }  or null`

  此请求的上下文管理配置。

  - `type: string`

    上下文管理的条目类型。目前仅支持 'compaction'。

  - `compact_threshold: optional number or null`

    触发此条目压缩的令牌阈值。

- `conversation: optional string or ResponseConversationParam or null`

  此响应所属的对话。此对话中的项会前置到 `input_items` 本次响应请求。
  此响应的输入项和输出项会在本次响应完成后自动添加到此对话中。

  - `ConversationID = string`

    对话的唯一 ID。

  - `ResponseConversationParam object { id }`

    此响应所属的对话。

    - `id: string`

      对话的唯一 ID。

- `include: optional array of ResponseIncludable or null`

  指定要包含在模型响应中的附加输出数据。目前支持的值包括：

  - `web_search_call.action.sources`：包含 网页搜索 工具调用的来源。
  - `code_interpreter_call.outputs`：在代码解释器工具调用项中包含 Python 代码执行的输出。
  - `computer_call_output.output.image_url`：包含来自计算机调用输出的图像 URL。
  - `file_search_call.results`：包含 文件搜索 工具调用的搜索结果。
  - `message.input_image.image_url`：包含来自输入消息的图像 URL。
  - `message.output_text.logprobs`：在助手消息中包含 logprobs。
  - `reasoning.encrypted_content`：在推理项输出中包含加密版本的推理令牌。这样可以在无状态使用 Responses API 时（例如 `store` 参数设置为 `false`，或组织已加入零数据保留计划时）在多轮对话中使用推理项。

  - `"file_search_call.results"`

  - `"web_search_call.results"`

  - `"web_search_call.action.sources"`

  - `"message.input_image.image_url"`

  - `"computer_call_output.output.image_url"`

  - `"code_interpreter_call.outputs"`

  - `"reasoning.encrypted_content"`

  - `"message.output_text.logprobs"`

- `input: optional string or array of EasyInputMessage or object { content, role, status, type }  or ResponseOutputMessage or 29 more`

  发送给模型的文本、图片或文件输入，用于生成响应。

  了解更多：

  - [文本输入与输出](/docs/guides/text)
  - [图片输入](/docs/guides/images)
  - [文件输入](/docs/guides/pdf-files)
  - [会话状态](/docs/guides/conversation-state)
  - [函数调用](/docs/guides/function-calling)

  - `TextInput = string`

    发送给模型的文本输入，等同于带有以下角色的文本输入：
    `user` 。

  - `InputItemList = array of EasyInputMessage or object { content, role, status, type }  or ResponseOutputMessage or 29 more`

    发送给模型的一个或多个输入项列表，包含
    不同的内容类型。

    - `EasyInputMessage object { content, role, phase, type }`

      发送给模型的消息输入，其角色指示了指令的
      优先级层次。使用 `developer` 或 `system` 角色给出的指令
      优先于使用以下角色给出的指令 `user` 。带有
      `assistant` 角色的消息假定为模型在之前交互中
      生成的内容。

      - `content: string or ResponseInputMessageContentList`

        发送给模型的文本、图片或音频输入，用于生成响应。
        也可以包含之前的助手响应。

        - `TextInput = string`

          模型的文本输入。

        - `ResponseInputMessageContentList = array of ResponseInputContent`

          发送给模型的一个或多个输入项的列表，包含不同的内容
          类型。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            模型的图像输入。了解 [图像输入](/docs/guides/vision).

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

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的使用量。使用 `low` 用于降低渲染成本，或 `high` 以更高质量渲染文件。默认值为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string`

              要发送给模型的文件内容。

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `file_url: optional string`

              要发送给模型的文件的 URL。

            - `filename: optional string`

              要发送给模型的文件名称。

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

      - `role: "user" or "assistant" or "system" or "developer"`

        消息输入的角色，取值为 `user`, `assistant`, `system`，或
        `developer`.

        - `"user"`

        - `"assistant"`

        - `"system"`

        - `"developer"`

      - `phase: optional "commentary" or "final_answer" or null`

        将消息标记为 `assistant` 中间评论（`commentary`）或最终答案（`final_answer`).
        对于类似 `gpt-5.3-codex` 及以上的模型，在发送后续请求时，请保留并重新发送
        字段作用于所有助手消息——丢弃该字段可能导致性能下降。该字段不用于用户消息。

        - `"commentary"`

        - `"final_answer"`

      - `type: optional "message"`

        消息输入的类型，始终为 `message`.

        - `"message"`

    - `Message object { content, role, status, type }`

      发送给模型的消息输入，其角色指示了指令的
      优先级层次。使用 `developer` 或 `system` 角色给出的指令
      优先于使用以下角色给出的指令 `user` 。

      - `content: ResponseInputMessageContentList`

        发送给模型的一个或多个输入项的列表，包含不同的内容
        类型。

      - `role: "user" or "system" or "developer"`

        消息输入的角色，取值为 `user`, `system`，或 `developer`.

        - `"user"`

        - `"system"`

        - `"developer"`

      - `status: optional "in_progress" or "completed" or "incomplete"`

        项的状态，取值为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回项时会填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: optional "message"`

        消息输入的类型，始终设置为 `message`.

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

            文本输出的注解。

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

                被引用容器文件的文件名。

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

            模型输出的文本内容。

          - `type: "output_text"`

            输出文本的类型。始终为 `output_text`.

            - `"output_text"`

        - `ResponseOutputRefusal object { refusal, type }`

          模型的拒绝响应。

          - `refusal: string`

            模型给出的拒绝原因说明。

          - `type: "refusal"`

            拒绝响应的类型。始终为 `refusal`.

            - `"refusal"`

      - `role: "assistant"`

        输出消息的角色。始终为 `assistant`.

        - `"assistant"`

      - `status: "in_progress" or "completed" or "incomplete"`

        消息输入的状态。可选值为以下之一： `in_progress`, `completed`，或
        `incomplete`。当输入项通过 API 返回时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "message"`

        输出消息的类型。始终为 `message`.

        - `"message"`

      - `phase: optional "commentary" or "final_answer" or null`

        将消息标记为 `assistant` 中间评论（`commentary`）或最终答案（`final_answer`).
        对于类似 `gpt-5.3-codex` 及以上的模型，在发送后续请求时，请保留并重新发送
        字段作用于所有助手消息——丢弃该字段可能导致性能下降。该字段不用于用户消息。

        - `"commentary"`

        - `"final_answer"`

    - `FileSearchCall object { id, queries, status, 2 more }`

      文件搜索 工具调用的结果。请参阅
      [文件搜索 指南](/docs/guides/tools-file-search) 了解更多信息。

      - `id: string`

        文件搜索 工具调用的唯一 ID。

      - `queries: array of string`

        用于搜索文件的查询语句。

      - `status: "in_progress" or "searching" or "completed" or 2 more`

        文件搜索 工具调用的状态。可选值为以下之一： `in_progress`,
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

          可附加到对象的 16 个键值对集合。这可以
          以结构化格式存储关于对象的附加信息，
          并通过 API 或仪表板查询对象。键为字符串
          最大长度为 64 个字符。值为最大长度
          为 512 个字符的字符串、布尔值或数字。

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

          从文件中检索到的文本。

    - `ComputerCall object { id, call_id, pending_safety_checks, 4 more }`

      对计算机使用工具的工具调用。参见
      [computer use guide](/docs/guides/tools-computer-use) 了解更多信息。

      - `id: string`

        计算机调用的唯一 ID。

      - `call_id: string`

        使用输出响应工具调用时所使用的标识符。

      - `pending_safety_checks: array of object { id, code, message }`

        计算机调用中待处理的安全检查。

        - `id: string`

          待处理安全检查的 ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          有关待处理安全检查的详细信息。

      - `status: "in_progress" or "completed" or "incomplete"`

        条目的状态。取值为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回项时会填充。

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

            指示点击时按下的鼠标按键。取值为 `left`, `right`, `wheel`, `back`，或 `forward`.

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

            点击发生位置的 y 坐标。

          - `keys: optional array of string or null`

            点击时按住的按键。

        - `DoubleClick object { keys, type, x, y }`

          双击动作。

          - `keys: array of string or null`

            双击时按住的按键。

          - `type: "double_click"`

            指定事件类型。对于双击动作，此属性始终设置为 `double_click`.

            - `"double_click"`

          - `x: number`

            双击发生位置的 x 坐标。

          - `y: number`

            双击发生位置的 y 坐标。

        - `Drag object { path, type, keys }`

          拖动动作。

          - `path: array of object { x, y }`

            表示拖动动作路径的坐标数组。坐标将以对象数组的形式出现，例如

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

            指定事件类型。对于拖动动作，此属性始终设置为 `drag`.

            - `"drag"`

          - `keys: optional array of string or null`

            拖动鼠标时按住的按键。

        - `Keypress object { keys, type }`

          模型希望执行的一组按键操作。

          - `keys: array of string`

            模型请求按下的按键组合。这是一个字符串数组，每个字符串代表一个按键。

          - `type: "keypress"`

            指定事件类型。对于按键动作，此属性始终设置为 `keypress`.

            - `"keypress"`

        - `Move object { type, x, y, keys }`

          鼠标移动动作。

          - `type: "move"`

            指定事件类型。对于移动动作，此属性始终设置为 `move`.

            - `"move"`

          - `x: number`

            要移至的 x 坐标。

          - `y: number`

            要移至的 y 坐标。

          - `keys: optional array of string or null`

            在移动鼠标时按住的按键。

        - `Screenshot object { type }`

          截屏动作。

          - `type: "screenshot"`

            指定事件类型。对于截屏动作，此属性始终设置为 `screenshot`.

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

            发生滚动位置的 x 坐标。

          - `y: number`

            发生滚动位置的 y 坐标。

          - `keys: optional array of string or null`

            滚动时按住的按键。

        - `Type object { text, type }`

          用于输入文本的动作。

          - `text: string`

            要输入的文本。

          - `type: "type"`

            指定事件类型。对于输入动作，此属性始终设置为 `type`.

            - `"type"`

        - `Wait object { type }`

          等待动作。

          - `type: "wait"`

            指定事件类型。对于等待动作，此属性始终设置为 `wait`.

            - `"wait"`

      - `actions: optional ComputerActionList`

        为 `computer_use`。扁平化后的批量动作。每个动作包含一个
        `type` 判别字段以及动作专属字段。

        - `Click object { button, type, x, 2 more }`

          点击操作。

        - `DoubleClick object { keys, type, x, y }`

          双击动作。

        - `Drag object { path, type, keys }`

          拖动动作。

        - `Keypress object { keys, type }`

          模型希望执行的一组按键操作。

        - `Move object { type, x, y, keys }`

          鼠标移动动作。

        - `Screenshot object { type }`

          截屏动作。

        - `Scroll object { scroll_x, scroll_y, type, 3 more }`

          滚动动作。

        - `Type object { text, type }`

          用于输入文本的动作。

        - `Wait object { type }`

          等待动作。

    - `ComputerCallOutput object { call_id, output, type, 3 more }`

      计算机工具调用的输出。

      - `call_id: string`

        产生该输出的计算机工具调用的 ID。

      - `output: ResponseComputerToolCallOutputScreenshot`

        与计算机使用工具配合使用的计算机截图图像。

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

        由开发者确认的 API 报告的安全检查。

        - `id: string`

          待处理安全检查的 ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          有关待处理安全检查的详细信息。

      - `status: optional "in_progress" or "completed" or "incomplete" or null`

        消息输入的状态。可选值为以下之一： `in_progress`, `completed`，或 `incomplete`。当输入项通过 API 返回时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `WebSearchCall object { id, action, status, type }`

      网页搜索工具调用的结果。请参阅
      [网页搜索指南](/docs/guides/tools-web-search) 了解更多信息。

      - `id: string`

        该 网页搜索 工具调用的唯一 ID。

      - `action: object { type, queries, query, sources }  or object { type, url }  or object { pattern, type, url }`

        描述本次 网页搜索 调用中所执行具体操作的对象。
        包含模型如何使用网页的详细信息（search、open_page、find_in_page）。

        - `Search object { type, queries, query, sources }`

          操作类型 “search”——执行一次 网页搜索 查询。

          - `type: "search"`

            操作类型。

            - `"search"`

          - `queries: optional array of string`

            搜索查询语句。

          - `query: optional string`

            搜索查询语句。

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

            操作类型。

            - `"open_page"`

          - `url: optional string or null`

            模型打开的 URL。

        - `FindInPage object { pattern, type, url }`

          操作类型 "find_in_page"：在已加载的页面中搜索某个模式。

          - `pattern: string`

            要在页面内搜索的模式或文本。

          - `type: "find_in_page"`

            操作类型。

            - `"find_in_page"`

          - `url: string`

            搜索该模式的页面 URL。

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

        条目的状态。取值为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回项时会填充。

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

            模型的文本输入。

            - `text: string`

              发送给模型的文本输入。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }  or null`

              标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputImageContent object { type, detail, file_id, 2 more }`

            模型的图像输入。了解 [图像输入](/docs/guides/vision)

            - `type: "input_image"`

              输入项的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional ImageDetail or null`

              发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `image_url: optional string or null`

              发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

            - `prompt_cache_breakpoint: optional object { mode }  or null`

              标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `ResponseInputFileContent object { type, detail, file_data, 4 more }`

            模型的文件输入。

            - `type: "input_file"`

              输入项的类型。始终为 `input_file`.

              - `"input_file"`

            - `detail: optional "auto" or "low" or "high"`

              发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的使用量。使用 `low` 用于降低渲染成本，或 `high` 以更高质量渲染文件。默认值为 `auto`.

              - `"auto"`

              - `"low"`

              - `"high"`

            - `file_data: optional string or null`

              要发送给模型的文件的 base64 编码数据。

            - `file_id: optional string or null`

              发送给模型的文件 ID。

            - `file_url: optional string or null`

              要发送给模型的文件的 URL。

            - `filename: optional string or null`

              要发送给模型的文件名称。

            - `prompt_cache_breakpoint: optional object { mode }  or null`

              标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

      - `type: "function_call_output"`

        函数工具调用输出的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `id: optional string or null`

        函数工具调用输出的唯一 ID。当此条目通过 API 返回时会填充该字段。

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

        产生该输出的工具的名称。

      - `namespace: optional string or null`

        产生该输出的工具的命名空间。

      - `status: optional "in_progress" or "completed" or "incomplete" or null`

        条目的状态。取值为 `in_progress`, `completed`，或 `incomplete`。当通过 API 返回项时会填充。

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

      - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        工具搜索输出返回的已加载工具定义。

        - `Function object { name, parameters, strict, 5 more }`

          在你自己代码中定义一个可由模型选择调用的函数。了解更多关于 [函数调用](https://platform.openai.com/docs/guides/function-calling).

          - `name: string`

            要调用的函数的名称。

          - `parameters: map[unknown] or null`

            描述该函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否对此函数工具强制执行严格的参数校验。

          - `type: "function"`

            函数工具的类型。始终为 `function`.

            - `"function"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `defer_loading: optional boolean`

            该函数是否延迟加载并通过工具搜索加载。

          - `description: optional string or null`

            对函数的描述，供模型用于判断是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            用于描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          用于从已上传文件中搜索相关内容文件搜索工具的工具。详细了解 [文件搜索 tool](https://platform.openai.com/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索工具的类型，始终为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储库的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选器。

            - `ComparisonFilter object { key, type, value }`

              用于将指定属性键与给定值通过定义的比较运算进行比较的筛选器。

              - `key: string`

                用于与值进行比较的键。

              - `type: "eq" or "ne" or "gt" or 5 more`

                指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

                - `eq`: 等于
                - `ne`: 不等于
                - `gt`: 大于
                - `gte`: 大于等于
                - `lt`: 小于
                - `lte`: 小于等于
                - `in`: 包含于
                - `nin`: 不包含于

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

              使用以下方式组合多个筛选器 `and` 或 `or`.

              - `filters: array of ComparisonFilter or unknown`

                要组合的筛选器数组。项可以是 `ComparisonFilter` 或 `CompoundFilter`.

                - `ComparisonFilter object { key, type, value }`

                  用于将指定属性键与给定值通过定义的比较运算进行比较的筛选器。

                - `unknown`

              - `type: "and" or "or"`

                操作类型： `and` 或 `or`.

                - `"and"`

                - `"or"`

          - `max_num_results: optional number`

            要返回的最大结果数。该数值应介于 1 到 50 之间（含两端）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              用于控制在启用混合搜索时，倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

              - `embedding_weight: number`

                倒数排名融合中嵌入的权重。

              - `text_weight: number`

                倒数排名融合中文本的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，介于 0 到 1 之间的数字。越接近 1 的数值会试图仅返回最相关的结果，但可能会返回更少的结果。

        - `Computer object { type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

          - `type: "computer"`

            computer 工具的类型。始终为 `computer`.

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

            computer use 工具的类型。始终为 `computer_use_preview`.

            - `"computer_use_preview"`

        - `WebSearch object { type, external_web_access, filters, 2 more }`

          在互联网上搜索与提示相关的来源。了解更多关于
          [网页搜索工具](/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。可选值为 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许网页搜索访问实时互联网。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的筛选条件。

            - `allowed_domains: optional array of string or null`

              允许搜索的域名。如果未提供，则允许所有域名。
              所提供的域名的子域名也同样允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议
          （MCP）服务器为模型提供访问其他工具的能力。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

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

              允许使用的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示该工具是否会修改数据，或是否为只读。如果一个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合
            自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程，并在此处提供该令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 。详细了解
            关于服务连接器的 [信息](/docs/guides/tools-remote-mcp#connectors).

            当前支持的 `connector_id` 取值包括：

            - Dropbox: `connector_dropbox`
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

            该 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与需要审批的工具关联的过滤器对象
              。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示该工具是否会修改数据，或是否为只读。如果一个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示该工具是否会修改数据，或是否为只读。如果一个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。必须提供以下其中一项 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其中之一。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。必须提供以下其中一项
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

        - `CodeInterpreter object { container, type, allowed_callers }`

          一个用于运行 Python 代码以帮助生成提示响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID 或一个用于指定上传文件 ID（以供你的代码使用）以及一个
            可选
            设置的对象。 `memory_limit` 设置的对象。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定用于运行代码的文件 ID。

              - `type: "auto"`

                Always `auto`.

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

                    当 type 为 `allowlist`.

                  - `type: "allowlist"`

                    仅允许向指定域进行出站网络访问。始终 `allowlist`.

                    - `"allowlist"`

                  - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                    针对已加入允许列表的域的可选域作用域密钥。

                    - `domain: string`

                      与该密钥关联的域。

                    - `name: string`

                      为该域注入的密钥名称。

                    - `value: string`

                      为该域名注入的密钥值。

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

            设置生成图像的背景。可选值为 `transparent`,
            `opaque`，或 `auto`。之一。透明背景可用于受支持的
            GPT 图像模型。对于 `gpt-image-2` 和
            `gpt-image-2-2026-04-21`，该支持处于预览阶段。当使用
            `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所投入的精力。此参数仅受 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型支持，不受 `gpt-image-1-mini`。支持。支持 `high` 和 `low`。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于局部重绘的可选蒙版。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

            - `file_id: optional string`

              蒙版图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的遮罩图像。

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

            生成图像的内容审核等级。默认值： `auto`.

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

            在流式模式下生成的中间图像数量，范围为 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or "auto"`

            生成图像的质量。可选值为 `low`, `medium`, `high`,
            或 `auto`。默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

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

                通过 id 或内联数据引用的可选技能列表。

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

                一个可选的技能列表。

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

                引用通过 /v1/containers 端点创建的容器

                - `"container_reference"`

        - `Custom object { name, type, allowed_callers, 3 more }`

          一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

            是否应延迟此工具并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认是无约束文本。

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

                语法定义的语法。取值之一为 `lark` 或 `regex`.

                - `"lark"`

                - `"regex"`

              - `type: "grammar"`

                语法格式。始终为 `grammar`.

                - `"grammar"`

        - `Namespace object { description, name, tools, type }`

          将函数/自定义工具归入共享命名空间。

          - `description: string`

            向模型展示的命名空间描述。

          - `name: string`

            在工具调用中使用的命名空间名称（例如， `crm`).

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

                是否应延迟此函数并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                用于描述此函数工具中字符串输出所编码的 JSON 值的 JSON Schema。这不描述内容数组输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。如果省略，则当 schema 兼容时 Responses 会尝试使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 3 more }`

              一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

                是否应延迟此工具并通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认是无约束文本。

          - `type: "namespace"`

            工具的类型。始终为 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          用于延迟工具的托管或 BYOT 工具搜索配置。

          - `type: "tool_search"`

            工具的类型。始终为 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            在客户端执行的工具搜索工具中，向模型展示的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端执行还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具会在网页中搜索相关结果以用于回复。详细了解 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。可选值为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

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

              两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

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

      - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        此条目中可用的额外工具列表。

        - `Function object { name, parameters, strict, 5 more }`

          在你自己代码中定义一个可由模型选择调用的函数。了解更多关于 [函数调用](https://platform.openai.com/docs/guides/function-calling).

          - `name: string`

            要调用的函数的名称。

          - `parameters: map[unknown] or null`

            描述该函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否对此函数工具强制执行严格的参数校验。

          - `type: "function"`

            函数工具的类型。始终为 `function`.

            - `"function"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `defer_loading: optional boolean`

            该函数是否延迟加载并通过工具搜索加载。

          - `description: optional string or null`

            对函数的描述，供模型用于判断是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            用于描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          用于从已上传文件中搜索相关内容文件搜索工具的工具。详细了解 [文件搜索 tool](https://platform.openai.com/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索工具的类型，始终为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储库的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选器。

            - `ComparisonFilter object { key, type, value }`

              用于将指定属性键与给定值通过定义的比较运算进行比较的筛选器。

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个筛选器 `and` 或 `or`.

          - `max_num_results: optional number`

            要返回的最大结果数。该数值应介于 1 到 50 之间（含两端）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              用于控制在启用混合搜索时，倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

              - `embedding_weight: number`

                倒数排名融合中嵌入的权重。

              - `text_weight: number`

                倒数排名融合中文本的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，介于 0 到 1 之间的数字。越接近 1 的数值会试图仅返回最相关的结果，但可能会返回更少的结果。

        - `Computer object { type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

          - `type: "computer"`

            computer 工具的类型。始终为 `computer`.

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

            computer use 工具的类型。始终为 `computer_use_preview`.

            - `"computer_use_preview"`

        - `WebSearch object { type, external_web_access, filters, 2 more }`

          在互联网上搜索与提示相关的来源。了解更多关于
          [网页搜索工具](/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。可选值为 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许网页搜索访问实时互联网。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的筛选条件。

            - `allowed_domains: optional array of string or null`

              允许搜索的域名。如果未提供，则允许所有域名。
              所提供的域名的子域名也同样允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议
          （MCP）服务器为模型提供访问其他工具的能力。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

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

              允许使用的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示该工具是否会修改数据，或是否为只读。如果一个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合
            自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程，并在此处提供该令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 。详细了解
            关于服务连接器的 [信息](/docs/guides/tools-remote-mcp#connectors).

            当前支持的 `connector_id` 取值包括：

            - Dropbox: `connector_dropbox`
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

            该 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与需要审批的工具关联的过滤器对象
              。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示该工具是否会修改数据，或是否为只读。如果一个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示该工具是否会修改数据，或是否为只读。如果一个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。必须提供以下其中一项 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其中之一。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。必须提供以下其中一项
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

        - `CodeInterpreter object { container, type, allowed_callers }`

          一个用于运行 Python 代码以帮助生成提示响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID 或一个用于指定上传文件 ID（以供你的代码使用）以及一个
            可选
            设置的对象。 `memory_limit` 设置的对象。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定用于运行代码的文件 ID。

              - `type: "auto"`

                Always `auto`.

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

            设置生成图像的背景。可选值为 `transparent`,
            `opaque`，或 `auto`。之一。透明背景可用于受支持的
            GPT 图像模型。对于 `gpt-image-2` 和
            `gpt-image-2-2026-04-21`，该支持处于预览阶段。当使用
            `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所投入的精力。此参数仅受 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型支持，不受 `gpt-image-1-mini`。支持。支持 `high` 和 `low`。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于局部重绘的可选蒙版。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

            - `file_id: optional string`

              蒙版图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的遮罩图像。

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

            生成图像的内容审核等级。默认值： `auto`.

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

            在流式模式下生成的中间图像数量，范围为 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or "auto"`

            生成图像的质量。可选值为 `low`, `medium`, `high`,
            或 `auto`。默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

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

          一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

            是否应延迟此工具并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认是无约束文本。

        - `Namespace object { description, name, tools, type }`

          将函数/自定义工具归入共享命名空间。

          - `description: string`

            向模型展示的命名空间描述。

          - `name: string`

            在工具调用中使用的命名空间名称（例如， `crm`).

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

                是否应延迟此函数并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                用于描述此函数工具中字符串输出所编码的 JSON 值的 JSON Schema。这不描述内容数组输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。如果省略，则当 schema 兼容时 Responses 会尝试使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 3 more }`

              一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

                是否应延迟此工具并通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认是无约束文本。

          - `type: "namespace"`

            工具的类型。始终为 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          用于延迟工具的托管或 BYOT 工具搜索配置。

          - `type: "tool_search"`

            工具的类型。始终为 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            在客户端执行的工具搜索工具中，向模型展示的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端执行还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具会在网页中搜索相关结果以用于回复。详细了解 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。可选值为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

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

              两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

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

        此额外工具条目的唯一 ID。

    - `Reasoning object { id, summary, type, 3 more }`

      推理模型在生成回复时所使用的思维链描述。请务必将这些条目包含在你的
      中，以便在后续对话轮次中传递给 Responses API `input` 至 响应接口
      ，如果你正在手动管理
      [上下文](/docs/guides/conversation-state).

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

        推理项的加密内容。该字段默认填充
        用于由 `POST /v1/responses` 和 WebSocket
        `response.create` 请求返回的推理项。

        在流式传输时，使用已完成的推理项及其
        `encrypted_content` 从 `response.output_item.done` 事件中
        后续请求。该 `encrypted_content` 中
        `response.output_item.added` 可能不完整。这一点尤其
        重要，在 `store` 被 `false` 截断，或者使用 Zero Data Retention 时。

      - `status: optional "in_progress" or "completed" or "incomplete"`

        条目的状态。取值为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回项时会填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `Compaction object { encrypted_content, type, id }`

      由 API 生成的压缩项 [`v1/responses/compact` 接口](/docs/api-reference/responses/compact).

      - `encrypted_content: string`

        压缩摘要的加密内容。

      - `type: "compaction"`

        该项的类型。始终为 `compaction`.

        - `"compaction"`

      - `id: optional string or null`

        压缩条目的 ID。

    - `ImageGenerationCall object { id, result, status, type }`

      由模型发起的图像生成请求。

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

        代码解释器工具调用的状态。有效值为 `in_progress`, `completed`, `incomplete`, `interpreting`、以及 `failed`.

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

          运行命令所在的可选工作目录。

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

        条目的状态。取值为 `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `ShellCall object { action, call_id, type, 4 more }`

      表示执行一条或多条 shell 命令请求的工具。

      - `action: object { commands, max_output_length, timeout_ms }`

        描述如何运行该工具调用的 shell 命令和限制。

        - `commands: array of string`

          供执行环境按顺序运行的 shell 命令。

        - `max_output_length: optional number or null`

          从合并后的 stdout 和 stderr 输出中捕获的最大 UTF-8 字符数。

        - `timeout_ms: optional number or null`

          允许 shell 命令运行的最大挂钟时间（毫秒）。

      - `call_id: string`

        模型生成的 shell 工具调用的唯一 ID。

      - `type: "shell_call"`

        该项的类型。始终为 `shell_call`.

        - `"shell_call"`

      - `id: optional string or null`

        shell 工具调用的唯一 ID。当通过 API 返回该条目时填充。

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

        shell 调用的状态。取值为 `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `ShellCallOutput object { call_id, output, type, 4 more }`

      shell 工具调用发出的流式输出项。

      - `call_id: string`

        模型生成的 shell 工具调用的唯一 ID。

      - `output: array of ResponseFunctionShellCallOutputContent`

        捕获的 stdout 和 stderr 输出块及其关联结果。

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

        shell 工具调用输出的唯一 ID。当通过 API 返回该条目时填充。

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

            创建文件时要应用的统一差异内容。

          - `path: string`

            相对于工作区根目录要创建的文件的路径。

          - `type: "create_file"`

            操作类型。始终为 `create_file`.

            - `"create_file"`

        - `DeleteFile object { path, type }`

          通过 apply_patch 工具删除现有文件的指令。

          - `path: string`

            相对于工作区根目录要删除的文件的路径。

          - `type: "delete_file"`

            操作类型。始终为 `delete_file`.

            - `"delete_file"`

        - `UpdateFile object { diff, path, type }`

          通过 apply_patch 工具更新现有文件的指令。

          - `diff: string`

            要应用到现有文件的统一差异内容。

          - `path: string`

            相对于工作区根目录要更新的文件的路径。

          - `type: "update_file"`

            操作类型。始终为 `update_file`.

            - `"update_file"`

      - `status: "in_progress" or "completed"`

        apply patch 工具调用的状态。取值之一为 `in_progress` 或 `completed`.

        - `"in_progress"`

        - `"completed"`

      - `type: "apply_patch_call"`

        该项的类型。始终为 `apply_patch_call`.

        - `"apply_patch_call"`

      - `id: optional string or null`

        apply patch 工具调用的唯一 ID。当该条目通过 API 返回时填充。

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

      apply patch 工具调用产生的流式输出。

      - `call_id: string`

        模型生成的 apply patch 工具调用的唯一 ID。

      - `status: "completed" or "failed"`

        apply patch 工具调用输出的状态。取值之一为 `completed` 或 `failed`.

        - `"completed"`

        - `"failed"`

      - `type: "apply_patch_call_output"`

        该项的类型。始终为 `apply_patch_call_output`.

        - `"apply_patch_call_output"`

      - `id: optional string or null`

        apply patch 工具调用输出的唯一 ID。当该条目通过 API 返回时填充。

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

        apply patch 工具的可选人类可读日志文本（例如补丁结果或错误）。

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

          关于该工具的附加注释。

        - `description: optional string or null`

          该工具的描述。

      - `type: "mcp_list_tools"`

        该项的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `error: optional string or null`

        如果服务器无法列出工具，则返回错误消息。

    - `McpApprovalRequest object { id, arguments, name, 2 more }`

      对工具调用的人工审批请求。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        用于该工具的参数的 JSON 字符串。

      - `name: string`

        要运行的工具的名称。

      - `server_label: string`

        发起该请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        该项的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

    - `McpApprovalResponse object { approval_request_id, approve, type, 2 more }`

      对 MCP 审批请求的响应。

      - `approval_request_id: string`

        正在响应的审批请求的 ID。

      - `approve: boolean`

        该请求是否已批准。

      - `type: "mcp_approval_response"`

        该项的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `id: optional string or null`

        审批响应的唯一 ID

      - `reason: optional string or null`

        可选的决策原因。

    - `McpCall object { id, arguments, name, 6 more }`

      对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        已运行的工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        该项的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        MCP 工具调用审批请求的唯一标识符。
        在后续的 `mcp_approval_response` 用于批准或拒绝相应工具调用的输入。

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

      由你的代码生成的自定义工具调用的输出，将被发送回模型。

      - `call_id: string`

        调用 ID，用于将此自定义工具调用输出映射到对应的自定义工具调用。

      - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

        由你的代码生成的自定义工具调用的输出。
        可以是字符串或输出内容列表。

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

      - `type: "custom_tool_call_output"`

        自定义工具调用输出的类型。始终为 `custom_tool_call_output`.

        - `"custom_tool_call_output"`

      - `id: optional string`

        自定义工具调用输出在 OpenAI 平台上的唯一 ID。

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

        由模型生成的自定义工具调用的输入。

      - `name: string`

        被调用的自定义工具的名称。

      - `type: "custom_tool_call"`

        自定义工具调用的类型。始终为 `custom_tool_call`.

        - `"custom_tool_call"`

      - `id: optional string`

        自定义工具调用在 OpenAI 平台上的唯一 ID。

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

    - `CompactionTrigger object { type, id }`

      压缩当前上下文。必须是最后的输入项。

      - `type: "compaction_trigger"`

        该项的类型。始终为 `compaction_trigger`.

        - `"compaction_trigger"`

      - `id: optional string or null`

        此压缩触发器的唯一 ID。

    - `ItemReference object { id, type }`

      用于引用某个条目的内部标识符。

      - `id: string`

        要引用的条目的 ID。

      - `type: optional "item_reference" or null`

        要引用的条目的类型。始终为 `item_reference`.

        - `"item_reference"`

    - `Program object { id, call_id, code, 2 more }`

      - `id: string`

        该程序条目的唯一 ID。

      - `call_id: string`

        该程序条目的稳定调用 ID。

      - `code: string`

        由编程式工具调用执行的 JavaScript 源代码。

      - `fingerprint: string`

        必须来回透传的不透明程序回放指纹。

      - `type: "program"`

        条目类型。始终为 `program`.

        - `"program"`

    - `ProgramOutput object { id, call_id, result, 2 more }`

      - `id: string`

        此程序输出条目的唯一 ID。

      - `call_id: string`

        该程序条目的调用 ID。

      - `result: string`

        由该程序条目生成的结果。

      - `status: "completed" or "incomplete"`

        程序输出的终止状态。

        - `"completed"`

        - `"incomplete"`

      - `type: "program_output"`

        条目类型。始终为 `program_output`.

        - `"program_output"`

- `instructions: optional string or null`

  插入到模型上下文中的系统（或开发者）消息。

  当与 `previous_response_id`，一起使用时，来自上一次
  响应的指令将不会延续到下一个响应。这样可以方便地
  在新的响应中替换系统（或开发者）消息。

- `max_output_tokens: optional number or null`

  响应可生成 token 数量的上限，包括可见输出 token 以及 [推理 token](/docs/guides/reasoning).

- `max_tool_calls: optional number or null`

  在一次响应中可处理的内置工具调用总次数上限。此上限适用于所有内置工具调用，而非按单个工具计算。模型后续任何进一步的工具调用尝试都将被忽略。

- `metadata: optional Metadata or null`

  可附加到对象的 16 个键值对集合。这可以
  以结构化格式存储关于对象的附加信息，
  格式，以及通过 API 或仪表板查询对象。

  键为字符串，最大长度为 64 个字符。值为字符串
  最大长度为 512 个字符。

- `model: optional ResponsesModel`

  用于生成响应的模型 ID，例如 `gpt-4o` 或 `o3`。OpenAI
  提供多种不同能力、性能
  特征和价格的模型。请参阅 [模型指南](/docs/models)
  以浏览和比较可用模型。

  - `string`

  - `"gpt-5.6-sol" or "gpt-5.6-terra" or "gpt-5.6-luna" or 80 more`

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

  - `ResponsesOnlyModel = "o1-pro" or "o1-pro-2025-03-19" or "o3-pro" or 16 more`

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

- `moderation: optional object { model, policy }  or null`

  用于对此响应的输入和输出运行审核的配置。

  - `model: string`

    用于已审核补全的审核模型，例如 'omni-moderation-latest'。

  - `policy: optional object { input, output }  or null`

    应用于已审核响应输入和输出的策略。

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

- `parallel_tool_calls: optional boolean or null`

  是否允许模型并行运行工具调用。

- `previous_response_id: optional string or null`

  模型上一次响应的唯一 ID。使用此 ID 可
  创建多轮对话。详细了解
  [对话状态](/docs/guides/conversation-state)。无法与 `conversation`.

- `prompt: optional ResponsePrompt or null`

  对提示模板及其变量的引用。
  [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

  - `id: string`

    要使用的提示词模板的唯一标识符。

  - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

    可选的值映射，用于替换你的
    提示词中的变量。替换值可以是字符串，也可以是其他
    Response 输入类型，例如图片或文件。

    - `string`

    - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

      模型的文本输入。

    - `ResponseInputImage object { detail, type, file_id, 2 more }`

      模型的图像输入。了解 [图像输入](/docs/guides/vision).

    - `ResponseInputFile object { type, detail, file_data, 4 more }`

      模型的文件输入。

  - `version: optional string or null`

    可选的提示词模板版本。

- `prompt_cache_key: optional string or null`

  由 OpenAI 用于缓存相似请求的响应，以优化你的缓存命中率。取代 `user` 字段。 [了解更多](/docs/guides/prompt-caching).

- `prompt_cache_options: optional object { mode, ttl }`

  提示词缓存选项。受支持 `gpt-5.6` 及更高版本模型。默认情况下，OpenAI 会自动选择一个隐式缓存断点。你可以通过 `prompt_cache_breakpoint`。在内容块上添加显式断点。每个请求最多可写入四个断点。在缓存匹配时，OpenAI 会考虑对话中最多最近的 80 个断点，且不受内容块回溯长度限制。将 `mode` 设置为 `explicit` 可禁用隐式断点。 `ttl` 默认为 `30m`，这是当前唯一受支持的值。详见 [提示词缓存指南](/docs/guides/prompt-caching) 了解最新详情。

  - `mode: optional "implicit" or "explicit"`

    控制 OpenAI 是否自动创建隐式缓存断点。默认为 `implicit`。使用 `implicit`，时，OpenAI 会创建一个隐式断点，并在请求中写入最多最近的三个显式断点。使用 `explicit`，时，OpenAI 不会创建隐式断点，并写入最多最近的四个显式断点。如果没有显式断点，则该请求不使用提示词缓存。

    - `"implicit"`

    - `"explicit"`

  - `ttl: optional "30m"`

    应用于请求写入的每个隐式和显式缓存断点的最短生命周期。默认为 `30m`，这是当前唯一支持的值。后端可能会将缓存条目保留更长时间。

    - `"30m"`

- `prompt_cache_retention: optional "in_memory" or "24h" or null`

  已弃用。请使用 `prompt_cache_options.ttl` 替代。

  提示缓存的保留策略。设置为 `24h` 以启用扩展提示缓存，将缓存前缀保持更长时间，最长可达 24 小时。 [了解更多](/docs/guides/prompt-caching#prompt-cache-retention).
  该字段表示最长保留策略，而
  `prompt_cache_options.ttl` 表示最短缓存生命周期。这两个字段彼此独立且互不影响。
  字段彼此独立且互不影响。
  对于 `gpt-5.5`, `gpt-5.5-pro`，及未来模型，仅支持 `24h` 。

  对于同时支持两者的较旧模型 `in_memory` 和 `24h`，默认值取决于你所在组织的数据保留策略：

  - 未启用 ZDR 的组织默认使用 `24h`.
  - 已启用 ZDR 的组织默认使用 `in_memory` 当 `prompt_cache_retention` 未指定时。

  - `"in_memory"`

  - `"24h"`

- `reasoning: optional Reasoning or null`

  **仅限 gpt-5 和 o 系列模型**

  用于
  [推理模型](https://platform.openai.com/docs/guides/reasoning).

  - `context: optional "auto" or "current_turn" or "all_turns" or null`

    控制在后续轮次中向模型回传的推理项。
    如果省略或设置为 `auto`，则由模型决定上下文模式。该
    `gpt-5.6` 模型系列默认为 `all_turns`；更早的模型默认为
    `current_turn`.

    在响应中返回时，这是该响应实际使用的有效推理上下文模式。
    用于该响应。

    - `"auto"`

    - `"current_turn"`

    - `"all_turns"`

  - `effort: optional ReasoningEffort or null`

    限制推理模型在推理上的投入程度。当前支持的值
    为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`、以及 `max`.
    降低推理投入程度可以带来更快的响应，并在响应中消耗更少的
    推理 tokens 并非所有推理模型都支持每个
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

  - `generate_summary: optional "auto" or "concise" or "detailed" or null`

    **已弃用：** 使用 `summary` 替代。

    对模型所执行推理的摘要。这可以
    有助于调试和理解模型的推理过程。
    以下之一 `auto`, `concise`，或 `detailed`.

    - `"auto"`

    - `"concise"`

    - `"detailed"`

  - `mode: optional string or "standard" or "pro"`

    控制该请求的推理执行模式。

    在响应中返回时，这是实际生效的执行模式。

    - `string`

    - `"standard" or "pro"`

      控制该请求的推理执行模式。

      在响应中返回时，这是实际生效的执行模式。

      - `"standard"`

      - `"pro"`

  - `summary: optional "auto" or "concise" or "detailed" or null`

    对模型所执行推理的摘要。这可以
    有助于调试和理解模型的推理过程。
    以下之一 `auto`, `concise`，或 `detailed`.

    `concise` 可用于 `computer-use-preview` 模型以及之后发布的所有推理模型 `gpt-5`.

    - `"auto"`

    - `"concise"`

    - `"detailed"`

- `safety_identifier: optional string or null`

  一个稳定的标识符，用于帮助检测可能违反 OpenAI 使用政策的应用用户。
  该 ID 应为能够唯一标识每个用户的字符串，最大长度为 64 个字符。我们建议对其用户名或电子邮件地址进行哈希处理，以避免向我们发送任何可识别身份的信息。 [了解更多](/docs/guides/safety-best-practices#safety-identifiers).

- `service_tier: optional ServiceTier or null`

  指定用于处理该请求的处理类型。

  - 如果设置为 'auto'，则该请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则项目将使用 'default'。
  - 如果设置为 'default'，则该请求将使用所选模型的标准定价和性能进行处理。
  - 如果设置为 '[flex](/docs/guides/flex-processing)'，则该请求将使用 Flex Processing 服务层级进行处理。
  - 若要在请求级别启用 [快速模式](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 请求中包含 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你是否在请求中指定 `service_tier=fast` 或 `priority` 。
  - 如果设置为 'ultrafast'，则该请求将使用受访问控制的 Ultrafast Processing 服务层级进行处理。此层级当前可用于 `gpt-5.6-sol`；通过该层级提供的响应将显示 `service_tier=ultrafast`.
  - 未设置时，默认行为为 'auto'。

  当 `service_tier` 参数被设置时，响应体将根据实际用于处理该请求的处理模式包含相应的 `service_tier` 值。此响应值可能与该参数中设置的值不同。

  - `"auto"`

  - `"default"`

  - `"flex"`

  - `"scale"`

  - `"priority"`

  - `"fast"`

  - `"ultrafast"`

- `store: optional boolean or null`

  是否存储生成的模型响应，以便稍后通过
  API 进行检索。

- `stream: optional boolean or null`

  如果设置为 true，模型响应数据将在生成时
  通过 [服务器发送事件](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format).
  参见下文 [流式部分](/docs/api-reference/responses-streaming)
  了解更多信息。

- `stream_options: optional object { include_obfuscation }  or null`

  流式响应的选项。仅当你设置 `stream: true`.

  - `include_obfuscation: optional boolean`

    为 true 时启用流式混淆。流式混淆会向
    字段添加 `obfuscation` 随机字符，以规范化流式增量事件上的载荷大小，从而缓解某些侧信道攻击。
    这些混淆字段默认包含在内，但会增加数据流的一小部分开销。
    如果你信任你的应用程序与
    之间的网络链路，可以将 `include_obfuscation` 设置为
    设置为 false 以优化带宽。
    OpenAI API。

- `temperature: optional number or null`

  使用的采样温度，介于 0 到 2 之间。较高的值（如 0.8）会使输出更加随机，而较低的值（如 0.2）会使输出更加聚焦和确定性。
  我们通常建议修改此设置或 `top_p` 但不要同时修改两者。

- `text: optional ResponseTextConfig`

  模型文本响应的配置选项。可以是纯
  文本或结构化 JSON 数据。了解更多：

  - [文本输入与输出](/docs/guides/text)
  - [结构化输出](/docs/guides/structured-outputs)

  - `format: optional ResponseFormatTextConfig`

    一个对象，用于指定模型必须输出的格式。

    配置 `{ "type": "json_schema" }` 会启用结构化输出，
    从而确保模型与你提供的 JSON schema 匹配。详见
    [结构化输出指南](/docs/guides/structured-outputs).

    默认格式为 `{ "type": "text" }` 且无其他选项。

    **不推荐用于 gpt-4o 及更新的模型：**

    设置为 `{ "type": "json_object" }` 会启用旧的 JSON 模式，该模式
    确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
    的模型，建议优先使用该模式。

    - `ResponseFormatText object { type }`

      默认响应格式。用于生成文本响应。

      - `type: "text"`

        正在定义的响应格式的类型。始终为 `text`.

        - `"text"`

    - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

      JSON Schema 响应格式。用于生成结构化 JSON 响应。
      了解更多信息 [结构化输出](/docs/guides/structured-outputs).

      - `name: string`

        响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
        下划线和短横线，最大长度为 64。

      - `schema: map[unknown]`

        响应格式的架构，以 JSON 架构对象描述。
        了解如何构建 JSON 架构 [信息](https://json-schema.org/).

      - `type: "json_schema"`

        正在定义的响应格式的类型。始终为 `json_schema`.

        - `"json_schema"`

      - `description: optional string`

        响应格式用途的描述，模型使用该描述
        确定如何按该格式进行响应。

      - `strict: optional boolean or null`

        生成输出时是否启用严格的架构遵循。
        如果设置为 true，模型将始终遵循所定义的确切架构
        中的 `schema` 字段。仅支持 JSON Schema 的一个子集，
        `strict` 被 `true`。要了解更多信息，请参阅 [结构化输出
        指南](/docs/guides/structured-outputs).

    - `ResponseFormatJSONObject object { type }`

      JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
      建议在支持的模型上使用 `json_schema` 。请注意，
      模型在收到系统或用户消息明确指示前不会生成 JSON，
      因此需要相应指令。

      - `type: "json_object"`

        正在定义的响应格式的类型。始终为 `json_object`.

        - `"json_object"`

  - `verbosity: optional "low" or "medium" or "high" or null`

    约束模型响应的详细程度。较低的值将导致
    更高的值将生成更简洁的响应，而较低的值将生成更冗长的响应。
    当前支持的值包括 `low`, `medium`、以及 `high`。默认值为
    `medium`.

    - `"low"`

    - `"medium"`

    - `"high"`

- `tool_choice: optional ToolChoiceOptions or ToolChoiceAllowed or ToolChoiceTypes or 6 more`

  模型在生成响应时应如何选择要使用的工具（一个或多个）。请参阅
  参数，了解如何指定模型可以调用的工具。 `tools` 参数以了解如何指定哪些工具
  模型可以调用。

  - `ToolChoiceOptions = "none" or "auto" or "required"`

    控制模型调用哪个工具（如果有的话）。

    `none` 表示模型将不调用任何工具，而是生成一条消息。

    `auto` 表示模型可以在生成消息与调用一个或
    多个工具之间进行选择。

    `required` 表示模型必须调用一个或多个工具。

    - `"none"`

    - `"auto"`

    - `"required"`

  - `ToolChoiceAllowed object { mode, tools, type }`

    将模型可用的工具限制为预定义的集合。

    - `mode: "auto" or "required"`

      将模型可用的工具限制为预定义的集合。

      `auto` 允许模型从允许的工具中进行选择，并生成一条
      消息。

      `required` 要求模型调用一个或多个允许的工具。

      - `"auto"`

      - `"required"`

    - `tools: array of map[unknown]`

      模型应被允许调用的工具定义列表。

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

    指示模型应使用内置工具生成响应。
    [了解有关内置工具的更多信息](/docs/guides/tools).

    - `type: "file_search" or "web_search_preview" or "computer" or 5 more`

      模型应使用的托管工具类型。了解有关
      [内置工具](/docs/guides/tools).

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

      要调用的工具。始终 `programmatic_tool_calling`.

      - `"programmatic_tool_calling"`

  - `ToolChoiceApplyPatch object { type }`

    在执行工具调用时强制模型调用 apply_patch 工具。

    - `type: "apply_patch"`

      要调用的工具。始终 `apply_patch`.

      - `"apply_patch"`

  - `ToolChoiceShell object { type }`

    在需要工具调用时强制模型调用 shell 工具。

    - `type: "shell"`

      要调用的工具。始终 `shell`.

      - `"shell"`

- `tools: optional array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

  模型在生成响应时可以调用的工具数组。你
  可以通过设置 `tool_choice` 参数来指定要使用的工具。

  我们支持以下类别的工具：

  - **内置工具**：由 OpenAI 提供、可扩展模型能力的工具，例如
    模型的各项能力，例如 [网页搜索](/docs/guides/tools-web-search)
    或 [文件搜索](/docs/guides/tools-file-search)。了解更多信息
    [内置工具](/docs/guides/tools).
  - **MCP 工具**：通过自定义 MCP 服务器与第三方系统集成
    ，或使用 Google Drive 和 SharePoint 等预定义连接器。了解更多信息
    [MCP 工具](/docs/guides/tools-connectors-mcp).
  - **函数调用（自定义工具）**：由你定义的函数，
    使模型能够使用强类型参数和输出调用你自己的代码。了解更多信息
    和输出。了解更多信息
    [函数调用](/docs/guides/function-calling)。你也可以使用
    自定义工具调用你自己的代码。

  - `Function object { name, parameters, strict, 5 more }`

    在你自己代码中定义一个可由模型选择调用的函数。了解更多关于 [函数调用](https://platform.openai.com/docs/guides/function-calling).

    - `name: string`

      要调用的函数的名称。

    - `parameters: map[unknown] or null`

      描述该函数参数的 JSON schema 对象。

    - `strict: boolean or null`

      是否对此函数工具强制执行严格的参数校验。

    - `type: "function"`

      函数工具的类型。始终为 `function`.

      - `"function"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用上下文。

      - `"direct"`

      - `"programmatic"`

    - `defer_loading: optional boolean`

      该函数是否延迟加载并通过工具搜索加载。

    - `description: optional string or null`

      对函数的描述，供模型用于判断是否调用该函数。

    - `output_schema: optional map[unknown] or null`

      用于描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

  - `FileSearch object { type, vector_store_ids, filters, 2 more }`

    用于从已上传文件中搜索相关内容文件搜索工具的工具。详细了解 [文件搜索 tool](https://platform.openai.com/docs/guides/tools-file-search).

    - `type: "file_search"`

      文件搜索工具的类型，始终为 `file_search`.

      - `"file_search"`

    - `vector_store_ids: array of string`

      要搜索的向量存储库的 ID。

    - `filters: optional ComparisonFilter or CompoundFilter or null`

      要应用的筛选器。

      - `ComparisonFilter object { key, type, value }`

        用于将指定属性键与给定值通过定义的比较运算进行比较的筛选器。

      - `CompoundFilter object { filters, type }`

        使用以下方式组合多个筛选器 `and` 或 `or`.

    - `max_num_results: optional number`

      要返回的最大结果数。该数值应介于 1 到 50 之间（含两端）。

    - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

      搜索的排序选项。

      - `hybrid_search: optional object { embedding_weight, text_weight }`

        用于控制在启用混合搜索时，倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

        - `embedding_weight: number`

          倒数排名融合中嵌入的权重。

        - `text_weight: number`

          倒数排名融合中文本的权重。

      - `ranker: optional "auto" or "default-2024-11-15"`

        用于文件搜索的排序器。

        - `"auto"`

        - `"default-2024-11-15"`

      - `score_threshold: optional number`

        文件搜索的分数阈值，介于 0 到 1 之间的数字。越接近 1 的数值会试图仅返回最相关的结果，但可能会返回更少的结果。

  - `Computer object { type }`

    用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

    - `type: "computer"`

      computer 工具的类型。始终为 `computer`.

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

      computer use 工具的类型。始终为 `computer_use_preview`.

      - `"computer_use_preview"`

  - `WebSearch object { type, external_web_access, filters, 2 more }`

    在互联网上搜索与提示相关的来源。了解更多关于
    [网页搜索工具](/docs/guides/tools-web-search).

    - `type: "web_search" or "web_search_2025_08_26"`

      网页搜索工具的类型。可选值为 `web_search` 或 `web_search_2025_08_26`.

      - `"web_search"`

      - `"web_search_2025_08_26"`

    - `external_web_access: optional boolean`

      允许网页搜索访问实时互联网。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

    - `filters: optional object { allowed_domains }  or null`

      搜索的筛选条件。

      - `allowed_domains: optional array of string or null`

        允许搜索的域名。如果未提供，则允许所有域名。
        所提供的域名的子域名也同样允许。

        示例： `["pubmed.ncbi.nlm.nih.gov"]`

    - `search_context_size: optional "low" or "medium" or "high"`

      用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

      - `"low"`

      - `"medium"`

      - `"high"`

    - `user_location: optional object { city, country, region, 2 more }  or null`

      用户的大致位置。

      - `city: optional string or null`

        用户所在城市的自由文本输入，例如 `San Francisco`.

      - `country: optional string or null`

        两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

      - `region: optional string or null`

        用户所在地区的自由文本输入，例如 `California`.

      - `timezone: optional string or null`

        该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

      - `type: optional "approximate"`

        位置近似值的类型。始终为 `approximate`.

        - `"approximate"`

  - `Mcp object { server_label, type, allowed_callers, 9 more }`

    通过远程模型上下文协议
    （MCP）服务器为模型提供访问其他工具的能力。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

    - `server_label: string`

      此 MCP 服务器的标签，用于在工具调用中识别它。

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

        允许使用的工具名称组成的字符串数组

      - `McpToolFilter object { read_only, tool_names }`

        用于指定允许哪些工具的过滤对象。

        - `read_only: optional boolean`

          指示该工具是否会修改数据，或是否为只读。如果一个
          MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
          ，它将匹配此过滤器。

        - `tool_names: optional array of string`

          允许使用的工具名称列表。

    - `authorization: optional string`

      可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合
      自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
      必须处理 OAuth 授权流程，并在此处提供该令牌。

    - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

      服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供其中之一
      `server_url`, `connector_id`，或 `tunnel_id` 。详细了解
      关于服务连接器的 [信息](/docs/guides/tools-remote-mcp#connectors).

      当前支持的 `connector_id` 取值包括：

      - Dropbox: `connector_dropbox`
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

      该 MCP 工具是否为延迟加载，并通过工具搜索发现。

    - `headers: optional map[string] or null`

      发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
      或其他用途。

    - `require_approval: optional object { always, never }  or "always" or "never" or null`

      指定 MCP 服务器中哪些工具需要审批。

      - `McpToolApprovalFilter object { always, never }`

        指定 MCP 服务器中哪些工具需要审批。可以是
        `always`, `never`，或与需要审批的工具关联的过滤器对象
        。

        - `always: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示该工具是否会修改数据，或是否为只读。如果一个
            MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

        - `never: optional object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示该工具是否会修改数据，或是否为只读。如果一个
            MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `McpToolApprovalSetting = "always" or "never"`

        为所有工具指定统一的审批策略。可选值为 `always` 或
        `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
        设置为 `never`，时，所有工具都不需要审批。

        - `"always"`

        - `"never"`

    - `server_description: optional string`

      MCP 服务器的可选描述，用于提供更多上下文。

    - `server_url: optional string`

      MCP 服务器的 URL。必须提供以下其中一项 `server_url`, `connector_id`，或
      `tunnel_id` 必须提供其中之一。

    - `tunnel_id: optional string`

      用于替代直接服务器 URL 的安全 MCP 隧道 ID。必须提供以下其中一项
      `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

  - `CodeInterpreter object { container, type, allowed_callers }`

    一个用于运行 Python 代码以帮助生成提示响应的工具。

    - `container: string or object { type, file_ids, memory_limit, network_policy }`

      代码解释器容器。可以是容器 ID 或一个用于指定上传文件 ID（以供你的代码使用）以及一个
      可选
      设置的对象。 `memory_limit` 设置的对象。

      - `string`

        容器 ID。

      - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

        代码解释器容器的配置。可选择指定用于运行代码的文件 ID。

        - `type: "auto"`

          Always `auto`.

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

      设置生成图像的背景。可选值为 `transparent`,
      `opaque`，或 `auto`。之一。透明背景可用于受支持的
      GPT 图像模型。对于 `gpt-image-2` 和
      `gpt-image-2-2026-04-21`，该支持处于预览阶段。当使用
      `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

      - `"transparent"`

      - `"opaque"`

      - `"auto"`

    - `input_fidelity: optional "high" or "low" or null`

      控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所投入的精力。此参数仅受 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型支持，不受 `gpt-image-1-mini`。支持。支持 `high` 和 `low`。默认为 `low`.

      - `"high"`

      - `"low"`

    - `input_image_mask: optional object { file_id, image_url }`

      用于局部重绘的可选蒙版。包含 `image_url`
      （字符串，可选）和 `file_id` （字符串，可选）。

      - `file_id: optional string`

        蒙版图像的文件 ID。

      - `image_url: optional string`

        Base64 编码的遮罩图像。

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

      生成图像的内容审核等级。默认值： `auto`.

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

      在流式模式下生成的中间图像数量，范围为 0（默认值）到 3。

    - `quality: optional "low" or "medium" or "high" or "auto"`

      生成图像的质量。可选值为 `low`, `medium`, `high`,
      或 `auto`。默认值： `auto`.

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"auto"`

    - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

      生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

      - `string`

      - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

        生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

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

    一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

      是否应延迟此工具并通过工具搜索发现。

    - `description: optional string`

      自定义工具的可选描述，用于提供更多上下文。

    - `format: optional CustomToolInputFormat`

      自定义工具的输入格式。默认是无约束文本。

  - `Namespace object { description, name, tools, type }`

    将函数/自定义工具归入共享命名空间。

    - `description: string`

      向模型展示的命名空间描述。

    - `name: string`

      在工具调用中使用的命名空间名称（例如， `crm`).

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

          是否应延迟此函数并通过工具搜索发现。

        - `description: optional string or null`

        - `output_schema: optional map[unknown] or null`

          用于描述此函数工具中字符串输出所编码的 JSON 值的 JSON Schema。这不描述内容数组输出。

        - `parameters: optional unknown or null`

        - `strict: optional boolean or null`

          是否强制执行严格的参数校验。如果省略，则当 schema 兼容时 Responses 会尝试使用严格校验，否则回退到非严格校验。

      - `Custom object { name, type, allowed_callers, 3 more }`

        一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

          是否应延迟此工具并通过工具搜索发现。

        - `description: optional string`

          自定义工具的可选描述，用于提供更多上下文。

        - `format: optional CustomToolInputFormat`

          自定义工具的输入格式。默认是无约束文本。

    - `type: "namespace"`

      工具的类型。始终为 `namespace`.

      - `"namespace"`

  - `ToolSearch object { type, description, execution, parameters }`

    用于延迟工具的托管或 BYOT 工具搜索配置。

    - `type: "tool_search"`

      工具的类型。始终为 `tool_search`.

      - `"tool_search"`

    - `description: optional string or null`

      在客户端执行的工具搜索工具中，向模型展示的描述。

    - `execution: optional "server" or "client"`

      工具搜索是由服务端执行还是由客户端执行。

      - `"server"`

      - `"client"`

    - `parameters: optional unknown or null`

      客户端执行的工具搜索工具的参数 schema。

  - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

    此工具会在网页中搜索相关结果以用于回复。详细了解 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

    - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

      网页搜索工具的类型。可选值为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

      - `"web_search_preview"`

      - `"web_search_preview_2025_03_11"`

    - `search_content_types: optional array of "text" or "image"`

      - `"text"`

      - `"image"`

    - `search_context_size: optional "low" or "medium" or "high"`

      用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

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

        两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

      - `region: optional string or null`

        用户所在地区的自由文本输入，例如 `California`.

      - `timezone: optional string or null`

        该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

  - `ApplyPatch object { type, allowed_callers }`

    允许助手使用 unified diff 创建、删除或更新文件。

    - `type: "apply_patch"`

      工具的类型。始终为 `apply_patch`.

      - `"apply_patch"`

    - `allowed_callers: optional array of "direct" or "programmatic" or null`

      工具调用上下文。

      - `"direct"`

      - `"programmatic"`

- `top_logprobs: optional number or null`

  一个介于 0 和 20 之间的整数，指定在每个词元位置最多返回的词元数量，每个词元都有一个关联的对数
  词元，每个词元都有一个关联的对数概率
  概率。在某些情况下，返回的词元数量可能少于
  请求的数量。

- `top_p: optional number or null`

  一种温度采样的替代方法，称为核采样（nucleus sampling），
  模型会考虑概率质量排名前 top_p 的词元的结果。
  因此 0.1 表示仅考虑概率质量排名前 10% 的词元
  。

  我们通常建议修改此设置或 `temperature` 但不要同时修改两者。

- `truncation: optional "auto" or "disabled" or null`

  用于模型响应的截断策略。

  - `auto`：如果此 Response 的输入超过
    模型的上下文窗口大小，模型将通过丢弃对话开头的条目来
    截断响应以适配上下文窗口。
  - `disabled` （默认）：如果输入大小将超过模型的上下文窗口
    大小，请求将失败并返回 400 错误。

  - `"auto"`

  - `"disabled"`

- `user: optional string`

  该字段正在被替换为 `safety_identifier` 和 `prompt_cache_key`。请使用 `prompt_cache_key` 代替以维持缓存优化。
  你的最终用户的稳定标识符。
  用于通过更好地对相似请求进行分桶来提高缓存命中率，并帮助 OpenAI 检测和防止滥用。 [了解更多](/docs/guides/safety-best-practices#safety-identifiers).

### Returns

- `Response object { id, created_at, error, 32 more }`

  - `id: string`

    此 Response 的唯一标识符。

  - `created_at: number`

    此 Response 创建时的 Unix 时间戳（以秒为单位）。

  - `error: ResponseError or null`

    当模型未能生成 Response 时返回的错误对象。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt" or 17 more`

      响应的错误代码。

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

      - `"data_residency_mismatch"`

      - `"bio_policy"`

      - `"vector_store_timeout"`

      - `"invalid_image"`

      - `"invalid_image_format"`

      - `"invalid_base64_image"`

      - `"invalid_image_url"`

      - `"image_too_large"`

      - `"image_too_small"`

      - `"image_parse_error"`

      - `"image_content_policy_violation"`

      - `"invalid_image_mode"`

      - `"image_file_too_large"`

      - `"unsupported_image_media_type"`

      - `"empty_image_file"`

      - `"failed_to_download_image"`

      - `"image_file_not_found"`

    - `message: string`

      错误的可读描述。

  - `incomplete_details: object { reason }  or null`

    关于响应为何未完成的详细信息。

    - `reason: optional "max_output_tokens" or "content_filter"`

      响应未完成的原因。

      - `"max_output_tokens"`

      - `"content_filter"`

  - `instructions: string or array of EasyInputMessage or object { content, role, status, type }  or ResponseOutputMessage or 29 more or null`

    插入到模型上下文中的系统（或开发者）消息。

    当与 `previous_response_id`，一起使用时，来自上一次
    响应的指令将不会延续到下一个响应。这样可以方便地
    在新的响应中替换系统（或开发者）消息。

    - `string`

      发送给模型的文本输入，等同于带有以下角色的文本输入：
      `developer` 。

    - `InputItemList = array of EasyInputMessage or object { content, role, status, type }  or ResponseOutputMessage or 29 more`

      发送给模型的一个或多个输入项列表，包含
      不同的内容类型。

      - `EasyInputMessage object { content, role, phase, type }`

        发送给模型的消息输入，其角色指示了指令的
        优先级层次。使用 `developer` 或 `system` 角色给出的指令
        优先于使用以下角色给出的指令 `user` 。带有
        `assistant` 角色的消息假定为模型在之前交互中
        生成的内容。

        - `content: string or ResponseInputMessageContentList`

          发送给模型的文本、图片或音频输入，用于生成响应。
          也可以包含之前的助手响应。

          - `TextInput = string`

            模型的文本输入。

          - `ResponseInputMessageContentList = array of ResponseInputContent`

            发送给模型的一个或多个输入项的列表，包含不同的内容
            类型。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              模型的文本输入。

              - `text: string`

                发送给模型的文本输入。

              - `type: "input_text"`

                输入项的类型。始终为 `input_text`.

                - `"input_text"`

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputImage object { detail, type, file_id, 2 more }`

              模型的图像输入。了解 [图像输入](/docs/guides/vision).

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

                发送给模型的文件 ID。

              - `image_url: optional string or null`

                发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputFile object { type, detail, file_data, 4 more }`

              模型的文件输入。

              - `type: "input_file"`

                输入项的类型。始终为 `input_file`.

                - `"input_file"`

              - `detail: optional "auto" or "low" or "high"`

                发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的使用量。使用 `low` 用于降低渲染成本，或 `high` 以更高质量渲染文件。默认值为 `auto`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `file_data: optional string`

                要发送给模型的文件内容。

              - `file_id: optional string or null`

                发送给模型的文件 ID。

              - `file_url: optional string`

                要发送给模型的文件的 URL。

              - `filename: optional string`

                要发送给模型的文件名称。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色，取值为 `user`, `assistant`, `system`，或
          `developer`.

          - `"user"`

          - `"assistant"`

          - `"system"`

          - `"developer"`

        - `phase: optional "commentary" or "final_answer" or null`

          将消息标记为 `assistant` 中间评论（`commentary`）或最终答案（`final_answer`).
          对于类似 `gpt-5.3-codex` 及以上的模型，在发送后续请求时，请保留并重新发送
          字段作用于所有助手消息——丢弃该字段可能导致性能下降。该字段不用于用户消息。

          - `"commentary"`

          - `"final_answer"`

        - `type: optional "message"`

          消息输入的类型，始终为 `message`.

          - `"message"`

      - `Message object { content, role, status, type }`

        发送给模型的消息输入，其角色指示了指令的
        优先级层次。使用 `developer` 或 `system` 角色给出的指令
        优先于使用以下角色给出的指令 `user` 。

        - `content: ResponseInputMessageContentList`

          发送给模型的一个或多个输入项的列表，包含不同的内容
          类型。

        - `role: "user" or "system" or "developer"`

          消息输入的角色，取值为 `user`, `system`，或 `developer`.

          - `"user"`

          - `"system"`

          - `"developer"`

        - `status: optional "in_progress" or "completed" or "incomplete"`

          项的状态，取值为 `in_progress`, `completed`，或
          `incomplete`。当通过 API 返回项时会填充。

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

        - `type: optional "message"`

          消息输入的类型，始终设置为 `message`.

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

              文本输出的注解。

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

                  被引用容器文件的文件名。

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

              模型输出的文本内容。

            - `type: "output_text"`

              输出文本的类型。始终为 `output_text`.

              - `"output_text"`

          - `ResponseOutputRefusal object { refusal, type }`

            模型的拒绝响应。

            - `refusal: string`

              模型给出的拒绝原因说明。

            - `type: "refusal"`

              拒绝响应的类型。始终为 `refusal`.

              - `"refusal"`

        - `role: "assistant"`

          输出消息的角色。始终为 `assistant`.

          - `"assistant"`

        - `status: "in_progress" or "completed" or "incomplete"`

          消息输入的状态。可选值为以下之一： `in_progress`, `completed`，或
          `incomplete`。当输入项通过 API 返回时填充。

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

        - `type: "message"`

          输出消息的类型。始终为 `message`.

          - `"message"`

        - `phase: optional "commentary" or "final_answer" or null`

          将消息标记为 `assistant` 中间评论（`commentary`）或最终答案（`final_answer`).
          对于类似 `gpt-5.3-codex` 及以上的模型，在发送后续请求时，请保留并重新发送
          字段作用于所有助手消息——丢弃该字段可能导致性能下降。该字段不用于用户消息。

          - `"commentary"`

          - `"final_answer"`

      - `FileSearchCall object { id, queries, status, 2 more }`

        文件搜索 工具调用的结果。请参阅
        [文件搜索 指南](/docs/guides/tools-file-search) 了解更多信息。

        - `id: string`

          文件搜索 工具调用的唯一 ID。

        - `queries: array of string`

          用于搜索文件的查询语句。

        - `status: "in_progress" or "searching" or "completed" or 2 more`

          文件搜索 工具调用的状态。可选值为以下之一： `in_progress`,
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

            可附加到对象的 16 个键值对集合。这可以
            以结构化格式存储关于对象的附加信息，
            并通过 API 或仪表板查询对象。键为字符串
            最大长度为 64 个字符。值为最大长度
            为 512 个字符的字符串、布尔值或数字。

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

            从文件中检索到的文本。

      - `ComputerCall object { id, call_id, pending_safety_checks, 4 more }`

        对计算机使用工具的工具调用。参见
        [computer use guide](/docs/guides/tools-computer-use) 了解更多信息。

        - `id: string`

          计算机调用的唯一 ID。

        - `call_id: string`

          使用输出响应工具调用时所使用的标识符。

        - `pending_safety_checks: array of object { id, code, message }`

          计算机调用中待处理的安全检查。

          - `id: string`

            待处理安全检查的 ID。

          - `code: optional string or null`

            待处理安全检查的类型。

          - `message: optional string or null`

            有关待处理安全检查的详细信息。

        - `status: "in_progress" or "completed" or "incomplete"`

          条目的状态。取值为 `in_progress`, `completed`，或
          `incomplete`。当通过 API 返回项时会填充。

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

              指示点击时按下的鼠标按键。取值为 `left`, `right`, `wheel`, `back`，或 `forward`.

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

              点击发生位置的 y 坐标。

            - `keys: optional array of string or null`

              点击时按住的按键。

          - `DoubleClick object { keys, type, x, y }`

            双击动作。

            - `keys: array of string or null`

              双击时按住的按键。

            - `type: "double_click"`

              指定事件类型。对于双击动作，此属性始终设置为 `double_click`.

              - `"double_click"`

            - `x: number`

              双击发生位置的 x 坐标。

            - `y: number`

              双击发生位置的 y 坐标。

          - `Drag object { path, type, keys }`

            拖动动作。

            - `path: array of object { x, y }`

              表示拖动动作路径的坐标数组。坐标将以对象数组的形式出现，例如

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

              指定事件类型。对于拖动动作，此属性始终设置为 `drag`.

              - `"drag"`

            - `keys: optional array of string or null`

              拖动鼠标时按住的按键。

          - `Keypress object { keys, type }`

            模型希望执行的一组按键操作。

            - `keys: array of string`

              模型请求按下的按键组合。这是一个字符串数组，每个字符串代表一个按键。

            - `type: "keypress"`

              指定事件类型。对于按键动作，此属性始终设置为 `keypress`.

              - `"keypress"`

          - `Move object { type, x, y, keys }`

            鼠标移动动作。

            - `type: "move"`

              指定事件类型。对于移动动作，此属性始终设置为 `move`.

              - `"move"`

            - `x: number`

              要移至的 x 坐标。

            - `y: number`

              要移至的 y 坐标。

            - `keys: optional array of string or null`

              在移动鼠标时按住的按键。

          - `Screenshot object { type }`

            截屏动作。

            - `type: "screenshot"`

              指定事件类型。对于截屏动作，此属性始终设置为 `screenshot`.

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

              发生滚动位置的 x 坐标。

            - `y: number`

              发生滚动位置的 y 坐标。

            - `keys: optional array of string or null`

              滚动时按住的按键。

          - `Type object { text, type }`

            用于输入文本的动作。

            - `text: string`

              要输入的文本。

            - `type: "type"`

              指定事件类型。对于输入动作，此属性始终设置为 `type`.

              - `"type"`

          - `Wait object { type }`

            等待动作。

            - `type: "wait"`

              指定事件类型。对于等待动作，此属性始终设置为 `wait`.

              - `"wait"`

        - `actions: optional ComputerActionList`

          为 `computer_use`。扁平化后的批量动作。每个动作包含一个
          `type` 判别字段以及动作专属字段。

          - `Click object { button, type, x, 2 more }`

            点击操作。

          - `DoubleClick object { keys, type, x, y }`

            双击动作。

          - `Drag object { path, type, keys }`

            拖动动作。

          - `Keypress object { keys, type }`

            模型希望执行的一组按键操作。

          - `Move object { type, x, y, keys }`

            鼠标移动动作。

          - `Screenshot object { type }`

            截屏动作。

          - `Scroll object { scroll_x, scroll_y, type, 3 more }`

            滚动动作。

          - `Type object { text, type }`

            用于输入文本的动作。

          - `Wait object { type }`

            等待动作。

      - `ComputerCallOutput object { call_id, output, type, 3 more }`

        计算机工具调用的输出。

        - `call_id: string`

          产生该输出的计算机工具调用的 ID。

        - `output: ResponseComputerToolCallOutputScreenshot`

          与计算机使用工具配合使用的计算机截图图像。

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

          由开发者确认的 API 报告的安全检查。

          - `id: string`

            待处理安全检查的 ID。

          - `code: optional string or null`

            待处理安全检查的类型。

          - `message: optional string or null`

            有关待处理安全检查的详细信息。

        - `status: optional "in_progress" or "completed" or "incomplete" or null`

          消息输入的状态。可选值为以下之一： `in_progress`, `completed`，或 `incomplete`。当输入项通过 API 返回时填充。

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

      - `WebSearchCall object { id, action, status, type }`

        网页搜索工具调用的结果。请参阅
        [网页搜索指南](/docs/guides/tools-web-search) 了解更多信息。

        - `id: string`

          该 网页搜索 工具调用的唯一 ID。

        - `action: object { type, queries, query, sources }  or object { type, url }  or object { pattern, type, url }`

          描述本次 网页搜索 调用中所执行具体操作的对象。
          包含模型如何使用网页的详细信息（search、open_page、find_in_page）。

          - `Search object { type, queries, query, sources }`

            操作类型 “search”——执行一次 网页搜索 查询。

            - `type: "search"`

              操作类型。

              - `"search"`

            - `queries: optional array of string`

              搜索查询语句。

            - `query: optional string`

              搜索查询语句。

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

              操作类型。

              - `"open_page"`

            - `url: optional string or null`

              模型打开的 URL。

          - `FindInPage object { pattern, type, url }`

            操作类型 "find_in_page"：在已加载的页面中搜索某个模式。

            - `pattern: string`

              要在页面内搜索的模式或文本。

            - `type: "find_in_page"`

              操作类型。

              - `"find_in_page"`

            - `url: string`

              搜索该模式的页面 URL。

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

          条目的状态。取值为 `in_progress`, `completed`，或
          `incomplete`。当通过 API 返回项时会填充。

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

              模型的文本输入。

              - `text: string`

                发送给模型的文本输入。

              - `type: "input_text"`

                输入项的类型。始终为 `input_text`.

                - `"input_text"`

              - `prompt_cache_breakpoint: optional object { mode }  or null`

                标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputImageContent object { type, detail, file_id, 2 more }`

              模型的图像输入。了解 [图像输入](/docs/guides/vision)

              - `type: "input_image"`

                输入项的类型。始终为 `input_image`.

                - `"input_image"`

              - `detail: optional ImageDetail or null`

                发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。默认为 `auto`.

              - `file_id: optional string or null`

                发送给模型的文件 ID。

              - `image_url: optional string or null`

                发送给模型的图像 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图像。

              - `prompt_cache_breakpoint: optional object { mode }  or null`

                标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputFileContent object { type, detail, file_data, 4 more }`

              模型的文件输入。

              - `type: "input_file"`

                输入项的类型。始终为 `input_file`.

                - `"input_file"`

              - `detail: optional "auto" or "low" or "high"`

                发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 使用高质量渲染，这可能会增加输入 token 的使用量。使用 `low` 用于降低渲染成本，或 `high` 以更高质量渲染文件。默认值为 `auto`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `file_data: optional string or null`

                要发送给模型的文件的 base64 编码数据。

              - `file_id: optional string or null`

                发送给模型的文件 ID。

              - `file_url: optional string or null`

                要发送给模型的文件的 URL。

              - `filename: optional string or null`

                要发送给模型的文件名称。

              - `prompt_cache_breakpoint: optional object { mode }  or null`

                标记可复用提示前缀的精确结束位置。该断点继承请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

        - `type: "function_call_output"`

          函数工具调用输出的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string or null`

          函数工具调用输出的唯一 ID。当此条目通过 API 返回时会填充该字段。

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

          产生该输出的工具的名称。

        - `namespace: optional string or null`

          产生该输出的工具的命名空间。

        - `status: optional "in_progress" or "completed" or "incomplete" or null`

          条目的状态。取值为 `in_progress`, `completed`，或 `incomplete`。当通过 API 返回项时会填充。

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

        - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

          工具搜索输出返回的已加载工具定义。

          - `Function object { name, parameters, strict, 5 more }`

            在你自己代码中定义一个可由模型选择调用的函数。了解更多关于 [函数调用](https://platform.openai.com/docs/guides/function-calling).

            - `name: string`

              要调用的函数的名称。

            - `parameters: map[unknown] or null`

              描述该函数参数的 JSON schema 对象。

            - `strict: boolean or null`

              是否对此函数工具强制执行严格的参数校验。

            - `type: "function"`

              函数工具的类型。始终为 `function`.

              - `"function"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `defer_loading: optional boolean`

              该函数是否延迟加载并通过工具搜索加载。

            - `description: optional string or null`

              对函数的描述，供模型用于判断是否调用该函数。

            - `output_schema: optional map[unknown] or null`

              用于描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

          - `FileSearch object { type, vector_store_ids, filters, 2 more }`

            用于从已上传文件中搜索相关内容文件搜索工具的工具。详细了解 [文件搜索 tool](https://platform.openai.com/docs/guides/tools-file-search).

            - `type: "file_search"`

              文件搜索工具的类型，始终为 `file_search`.

              - `"file_search"`

            - `vector_store_ids: array of string`

              要搜索的向量存储库的 ID。

            - `filters: optional ComparisonFilter or CompoundFilter or null`

              要应用的筛选器。

              - `ComparisonFilter object { key, type, value }`

                用于将指定属性键与给定值通过定义的比较运算进行比较的筛选器。

                - `key: string`

                  用于与值进行比较的键。

                - `type: "eq" or "ne" or "gt" or 5 more`

                  指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

                  - `eq`: 等于
                  - `ne`: 不等于
                  - `gt`: 大于
                  - `gte`: 大于等于
                  - `lt`: 小于
                  - `lte`: 小于等于
                  - `in`: 包含于
                  - `nin`: 不包含于

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

                使用以下方式组合多个筛选器 `and` 或 `or`.

                - `filters: array of ComparisonFilter or unknown`

                  要组合的筛选器数组。项可以是 `ComparisonFilter` 或 `CompoundFilter`.

                  - `ComparisonFilter object { key, type, value }`

                    用于将指定属性键与给定值通过定义的比较运算进行比较的筛选器。

                  - `unknown`

                - `type: "and" or "or"`

                  操作类型： `and` 或 `or`.

                  - `"and"`

                  - `"or"`

            - `max_num_results: optional number`

              要返回的最大结果数。该数值应介于 1 到 50 之间（含两端）。

            - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

              搜索的排序选项。

              - `hybrid_search: optional object { embedding_weight, text_weight }`

                用于控制在启用混合搜索时，倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

                - `embedding_weight: number`

                  倒数排名融合中嵌入的权重。

                - `text_weight: number`

                  倒数排名融合中文本的权重。

              - `ranker: optional "auto" or "default-2024-11-15"`

                用于文件搜索的排序器。

                - `"auto"`

                - `"default-2024-11-15"`

              - `score_threshold: optional number`

                文件搜索的分数阈值，介于 0 到 1 之间的数字。越接近 1 的数值会试图仅返回最相关的结果，但可能会返回更少的结果。

          - `Computer object { type }`

            用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

            - `type: "computer"`

              computer 工具的类型。始终为 `computer`.

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

              computer use 工具的类型。始终为 `computer_use_preview`.

              - `"computer_use_preview"`

          - `WebSearch object { type, external_web_access, filters, 2 more }`

            在互联网上搜索与提示相关的来源。了解更多关于
            [网页搜索工具](/docs/guides/tools-web-search).

            - `type: "web_search" or "web_search_2025_08_26"`

              网页搜索工具的类型。可选值为 `web_search` 或 `web_search_2025_08_26`.

              - `"web_search"`

              - `"web_search_2025_08_26"`

            - `external_web_access: optional boolean`

              允许网页搜索访问实时互联网。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

            - `filters: optional object { allowed_domains }  or null`

              搜索的筛选条件。

              - `allowed_domains: optional array of string or null`

                允许搜索的域名。如果未提供，则允许所有域名。
                所提供的域名的子域名也同样允许。

                示例： `["pubmed.ncbi.nlm.nih.gov"]`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { city, country, region, 2 more }  or null`

              用户的大致位置。

              - `city: optional string or null`

                用户所在城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

              - `region: optional string or null`

                用户所在地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

              - `type: optional "approximate"`

                位置近似值的类型。始终为 `approximate`.

                - `"approximate"`

          - `Mcp object { server_label, type, allowed_callers, 9 more }`

            通过远程模型上下文协议
            （MCP）服务器为模型提供访问其他工具的能力。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中识别它。

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

                允许使用的工具名称组成的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示该工具是否会修改数据，或是否为只读。如果一个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合
              自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
              必须处理 OAuth 授权流程，并在此处提供该令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供其中之一
              `server_url`, `connector_id`，或 `tunnel_id` 。详细了解
              关于服务连接器的 [信息](/docs/guides/tools-remote-mcp#connectors).

              当前支持的 `connector_id` 取值包括：

              - Dropbox: `connector_dropbox`
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

              该 MCP 工具是否为延迟加载，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器中哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器中哪些工具需要审批。可以是
                `always`, `never`，或与需要审批的工具关联的过滤器对象
                。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示该工具是否会修改数据，或是否为只读。如果一个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示该工具是否会修改数据，或是否为只读。如果一个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。可选值为 `always` 或
                `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
                设置为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。必须提供以下其中一项 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供其中之一。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的安全 MCP 隧道 ID。必须提供以下其中一项
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

          - `CodeInterpreter object { container, type, allowed_callers }`

            一个用于运行 Python 代码以帮助生成提示响应的工具。

            - `container: string or object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器。可以是容器 ID 或一个用于指定上传文件 ID（以供你的代码使用）以及一个
              可选
              设置的对象。 `memory_limit` 设置的对象。

              - `string`

                容器 ID。

              - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

                代码解释器容器的配置。可选择指定用于运行代码的文件 ID。

                - `type: "auto"`

                  Always `auto`.

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

                      当 type 为 `allowlist`.

                    - `type: "allowlist"`

                      仅允许向指定域进行出站网络访问。始终 `allowlist`.

                      - `"allowlist"`

                    - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                      针对已加入允许列表的域的可选域作用域密钥。

                      - `domain: string`

                        与该密钥关联的域。

                      - `name: string`

                        为该域注入的密钥名称。

                      - `value: string`

                        为该域名注入的密钥值。

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

              设置生成图像的背景。可选值为 `transparent`,
              `opaque`，或 `auto`。之一。透明背景可用于受支持的
              GPT 图像模型。对于 `gpt-image-2` 和
              `gpt-image-2-2026-04-21`，该支持处于预览阶段。当使用
              `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

              - `"transparent"`

              - `"opaque"`

              - `"auto"`

            - `input_fidelity: optional "high" or "low" or null`

              控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所投入的精力。此参数仅受 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型支持，不受 `gpt-image-1-mini`。支持。支持 `high` 和 `low`。默认为 `low`.

              - `"high"`

              - `"low"`

            - `input_image_mask: optional object { file_id, image_url }`

              用于局部重绘的可选蒙版。包含 `image_url`
              （字符串，可选）和 `file_id` （字符串，可选）。

              - `file_id: optional string`

                蒙版图像的文件 ID。

              - `image_url: optional string`

                Base64 编码的遮罩图像。

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

              生成图像的内容审核等级。默认值： `auto`.

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

              在流式模式下生成的中间图像数量，范围为 0（默认值）到 3。

            - `quality: optional "low" or "medium" or "high" or "auto"`

              生成图像的质量。可选值为 `low`, `medium`, `high`,
              或 `auto`。默认值： `auto`.

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `string`

              - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

                生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

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

                  通过 id 或内联数据引用的可选技能列表。

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

                  一个可选的技能列表。

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

                  引用通过 /v1/containers 端点创建的容器

                  - `"container_reference"`

          - `Custom object { name, type, allowed_callers, 3 more }`

            一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

              是否应延迟此工具并通过工具搜索发现。

            - `description: optional string`

              自定义工具的可选描述，用于提供更多上下文。

            - `format: optional CustomToolInputFormat`

              自定义工具的输入格式。默认是无约束文本。

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

                  语法定义的语法。取值之一为 `lark` 或 `regex`.

                  - `"lark"`

                  - `"regex"`

                - `type: "grammar"`

                  语法格式。始终为 `grammar`.

                  - `"grammar"`

          - `Namespace object { description, name, tools, type }`

            将函数/自定义工具归入共享命名空间。

            - `description: string`

              向模型展示的命名空间描述。

            - `name: string`

              在工具调用中使用的命名空间名称（例如， `crm`).

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

                  是否应延迟此函数并通过工具搜索发现。

                - `description: optional string or null`

                - `output_schema: optional map[unknown] or null`

                  用于描述此函数工具中字符串输出所编码的 JSON 值的 JSON Schema。这不描述内容数组输出。

                - `parameters: optional unknown or null`

                - `strict: optional boolean or null`

                  是否强制执行严格的参数校验。如果省略，则当 schema 兼容时 Responses 会尝试使用严格校验，否则回退到非严格校验。

              - `Custom object { name, type, allowed_callers, 3 more }`

                一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

                  是否应延迟此工具并通过工具搜索发现。

                - `description: optional string`

                  自定义工具的可选描述，用于提供更多上下文。

                - `format: optional CustomToolInputFormat`

                  自定义工具的输入格式。默认是无约束文本。

            - `type: "namespace"`

              工具的类型。始终为 `namespace`.

              - `"namespace"`

          - `ToolSearch object { type, description, execution, parameters }`

            用于延迟工具的托管或 BYOT 工具搜索配置。

            - `type: "tool_search"`

              工具的类型。始终为 `tool_search`.

              - `"tool_search"`

            - `description: optional string or null`

              在客户端执行的工具搜索工具中，向模型展示的描述。

            - `execution: optional "server" or "client"`

              工具搜索是由服务端执行还是由客户端执行。

              - `"server"`

              - `"client"`

            - `parameters: optional unknown or null`

              客户端执行的工具搜索工具的参数 schema。

          - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

            此工具会在网页中搜索相关结果以用于回复。详细了解 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

            - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

              网页搜索工具的类型。可选值为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

              - `"web_search_preview"`

              - `"web_search_preview_2025_03_11"`

            - `search_content_types: optional array of "text" or "image"`

              - `"text"`

              - `"image"`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

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

                两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

              - `region: optional string or null`

                用户所在地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

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

        - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

          此条目中可用的额外工具列表。

          - `Function object { name, parameters, strict, 5 more }`

            在你自己代码中定义一个可由模型选择调用的函数。了解更多关于 [函数调用](https://platform.openai.com/docs/guides/function-calling).

            - `name: string`

              要调用的函数的名称。

            - `parameters: map[unknown] or null`

              描述该函数参数的 JSON schema 对象。

            - `strict: boolean or null`

              是否对此函数工具强制执行严格的参数校验。

            - `type: "function"`

              函数工具的类型。始终为 `function`.

              - `"function"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `defer_loading: optional boolean`

              该函数是否延迟加载并通过工具搜索加载。

            - `description: optional string or null`

              对函数的描述，供模型用于判断是否调用该函数。

            - `output_schema: optional map[unknown] or null`

              用于描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

          - `FileSearch object { type, vector_store_ids, filters, 2 more }`

            用于从已上传文件中搜索相关内容文件搜索工具的工具。详细了解 [文件搜索 tool](https://platform.openai.com/docs/guides/tools-file-search).

            - `type: "file_search"`

              文件搜索工具的类型，始终为 `file_search`.

              - `"file_search"`

            - `vector_store_ids: array of string`

              要搜索的向量存储库的 ID。

            - `filters: optional ComparisonFilter or CompoundFilter or null`

              要应用的筛选器。

              - `ComparisonFilter object { key, type, value }`

                用于将指定属性键与给定值通过定义的比较运算进行比较的筛选器。

              - `CompoundFilter object { filters, type }`

                使用以下方式组合多个筛选器 `and` 或 `or`.

            - `max_num_results: optional number`

              要返回的最大结果数。该数值应介于 1 到 50 之间（含两端）。

            - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

              搜索的排序选项。

              - `hybrid_search: optional object { embedding_weight, text_weight }`

                用于控制在启用混合搜索时，倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

                - `embedding_weight: number`

                  倒数排名融合中嵌入的权重。

                - `text_weight: number`

                  倒数排名融合中文本的权重。

              - `ranker: optional "auto" or "default-2024-11-15"`

                用于文件搜索的排序器。

                - `"auto"`

                - `"default-2024-11-15"`

              - `score_threshold: optional number`

                文件搜索的分数阈值，介于 0 到 1 之间的数字。越接近 1 的数值会试图仅返回最相关的结果，但可能会返回更少的结果。

          - `Computer object { type }`

            用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

            - `type: "computer"`

              computer 工具的类型。始终为 `computer`.

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

              computer use 工具的类型。始终为 `computer_use_preview`.

              - `"computer_use_preview"`

          - `WebSearch object { type, external_web_access, filters, 2 more }`

            在互联网上搜索与提示相关的来源。了解更多关于
            [网页搜索工具](/docs/guides/tools-web-search).

            - `type: "web_search" or "web_search_2025_08_26"`

              网页搜索工具的类型。可选值为 `web_search` 或 `web_search_2025_08_26`.

              - `"web_search"`

              - `"web_search_2025_08_26"`

            - `external_web_access: optional boolean`

              允许网页搜索访问实时互联网。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

            - `filters: optional object { allowed_domains }  or null`

              搜索的筛选条件。

              - `allowed_domains: optional array of string or null`

                允许搜索的域名。如果未提供，则允许所有域名。
                所提供的域名的子域名也同样允许。

                示例： `["pubmed.ncbi.nlm.nih.gov"]`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { city, country, region, 2 more }  or null`

              用户的大致位置。

              - `city: optional string or null`

                用户所在城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

              - `region: optional string or null`

                用户所在地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

              - `type: optional "approximate"`

                位置近似值的类型。始终为 `approximate`.

                - `"approximate"`

          - `Mcp object { server_label, type, allowed_callers, 9 more }`

            通过远程模型上下文协议
            （MCP）服务器为模型提供访问其他工具的能力。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中识别它。

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

                允许使用的工具名称组成的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示该工具是否会修改数据，或是否为只读。如果一个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合
              自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
              必须处理 OAuth 授权流程，并在此处提供该令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供其中之一
              `server_url`, `connector_id`，或 `tunnel_id` 。详细了解
              关于服务连接器的 [信息](/docs/guides/tools-remote-mcp#connectors).

              当前支持的 `connector_id` 取值包括：

              - Dropbox: `connector_dropbox`
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

              该 MCP 工具是否为延迟加载，并通过工具搜索发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器中哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器中哪些工具需要审批。可以是
                `always`, `never`，或与需要审批的工具关联的过滤器对象
                。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示该工具是否会修改数据，或是否为只读。如果一个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤对象。

                  - `read_only: optional boolean`

                    指示该工具是否会修改数据，或是否为只读。如果一个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，它将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许使用的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。可选值为 `always` 或
                `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
                设置为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。必须提供以下其中一项 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供其中之一。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的安全 MCP 隧道 ID。必须提供以下其中一项
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

          - `CodeInterpreter object { container, type, allowed_callers }`

            一个用于运行 Python 代码以帮助生成提示响应的工具。

            - `container: string or object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器。可以是容器 ID 或一个用于指定上传文件 ID（以供你的代码使用）以及一个
              可选
              设置的对象。 `memory_limit` 设置的对象。

              - `string`

                容器 ID。

              - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

                代码解释器容器的配置。可选择指定用于运行代码的文件 ID。

                - `type: "auto"`

                  Always `auto`.

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

              设置生成图像的背景。可选值为 `transparent`,
              `opaque`，或 `auto`。之一。透明背景可用于受支持的
              GPT 图像模型。对于 `gpt-image-2` 和
              `gpt-image-2-2026-04-21`，该支持处于预览阶段。当使用
              `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

              - `"transparent"`

              - `"opaque"`

              - `"auto"`

            - `input_fidelity: optional "high" or "low" or null`

              控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所投入的精力。此参数仅受 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型支持，不受 `gpt-image-1-mini`。支持。支持 `high` 和 `low`。默认为 `low`.

              - `"high"`

              - `"low"`

            - `input_image_mask: optional object { file_id, image_url }`

              用于局部重绘的可选蒙版。包含 `image_url`
              （字符串，可选）和 `file_id` （字符串，可选）。

              - `file_id: optional string`

                蒙版图像的文件 ID。

              - `image_url: optional string`

                Base64 编码的遮罩图像。

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

              生成图像的内容审核等级。默认值： `auto`.

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

              在流式模式下生成的中间图像数量，范围为 0（默认值）到 3。

            - `quality: optional "low" or "medium" or "high" or "auto"`

              生成图像的质量。可选值为 `low`, `medium`, `high`,
              或 `auto`。默认值： `auto`.

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `string`

              - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

                生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

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

            一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

              是否应延迟此工具并通过工具搜索发现。

            - `description: optional string`

              自定义工具的可选描述，用于提供更多上下文。

            - `format: optional CustomToolInputFormat`

              自定义工具的输入格式。默认是无约束文本。

          - `Namespace object { description, name, tools, type }`

            将函数/自定义工具归入共享命名空间。

            - `description: string`

              向模型展示的命名空间描述。

            - `name: string`

              在工具调用中使用的命名空间名称（例如， `crm`).

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

                  是否应延迟此函数并通过工具搜索发现。

                - `description: optional string or null`

                - `output_schema: optional map[unknown] or null`

                  用于描述此函数工具中字符串输出所编码的 JSON 值的 JSON Schema。这不描述内容数组输出。

                - `parameters: optional unknown or null`

                - `strict: optional boolean or null`

                  是否强制执行严格的参数校验。如果省略，则当 schema 兼容时 Responses 会尝试使用严格校验，否则回退到非严格校验。

              - `Custom object { name, type, allowed_callers, 3 more }`

                一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

                  是否应延迟此工具并通过工具搜索发现。

                - `description: optional string`

                  自定义工具的可选描述，用于提供更多上下文。

                - `format: optional CustomToolInputFormat`

                  自定义工具的输入格式。默认是无约束文本。

            - `type: "namespace"`

              工具的类型。始终为 `namespace`.

              - `"namespace"`

          - `ToolSearch object { type, description, execution, parameters }`

            用于延迟工具的托管或 BYOT 工具搜索配置。

            - `type: "tool_search"`

              工具的类型。始终为 `tool_search`.

              - `"tool_search"`

            - `description: optional string or null`

              在客户端执行的工具搜索工具中，向模型展示的描述。

            - `execution: optional "server" or "client"`

              工具搜索是由服务端执行还是由客户端执行。

              - `"server"`

              - `"client"`

            - `parameters: optional unknown or null`

              客户端执行的工具搜索工具的参数 schema。

          - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

            此工具会在网页中搜索相关结果以用于回复。详细了解 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

            - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

              网页搜索工具的类型。可选值为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

              - `"web_search_preview"`

              - `"web_search_preview_2025_03_11"`

            - `search_content_types: optional array of "text" or "image"`

              - `"text"`

              - `"image"`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

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

                两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

              - `region: optional string or null`

                用户所在地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

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

          此额外工具条目的唯一 ID。

      - `Reasoning object { id, summary, type, 3 more }`

        推理模型在生成回复时所使用的思维链描述。请务必将这些条目包含在你的
        中，以便在后续对话轮次中传递给 Responses API `input` 至 响应接口
        ，如果你正在手动管理
        [上下文](/docs/guides/conversation-state).

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

          推理项的加密内容。该字段默认填充
          用于由 `POST /v1/responses` 和 WebSocket
          `response.create` 请求返回的推理项。

          在流式传输时，使用已完成的推理项及其
          `encrypted_content` 从 `response.output_item.done` 事件中
          后续请求。该 `encrypted_content` 中
          `response.output_item.added` 可能不完整。这一点尤其
          重要，在 `store` 被 `false` 截断，或者使用 Zero Data Retention 时。

        - `status: optional "in_progress" or "completed" or "incomplete"`

          条目的状态。取值为 `in_progress`, `completed`，或
          `incomplete`。当通过 API 返回项时会填充。

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

      - `Compaction object { encrypted_content, type, id }`

        由 API 生成的压缩项 [`v1/responses/compact` 接口](/docs/api-reference/responses/compact).

        - `encrypted_content: string`

          压缩摘要的加密内容。

        - `type: "compaction"`

          该项的类型。始终为 `compaction`.

          - `"compaction"`

        - `id: optional string or null`

          压缩条目的 ID。

      - `ImageGenerationCall object { id, result, status, type }`

        由模型发起的图像生成请求。

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

          代码解释器工具调用的状态。有效值为 `in_progress`, `completed`, `incomplete`, `interpreting`、以及 `failed`.

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

            运行命令所在的可选工作目录。

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

          条目的状态。取值为 `in_progress`, `completed`，或 `incomplete`.

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

      - `ShellCall object { action, call_id, type, 4 more }`

        表示执行一条或多条 shell 命令请求的工具。

        - `action: object { commands, max_output_length, timeout_ms }`

          描述如何运行该工具调用的 shell 命令和限制。

          - `commands: array of string`

            供执行环境按顺序运行的 shell 命令。

          - `max_output_length: optional number or null`

            从合并后的 stdout 和 stderr 输出中捕获的最大 UTF-8 字符数。

          - `timeout_ms: optional number or null`

            允许 shell 命令运行的最大挂钟时间（毫秒）。

        - `call_id: string`

          模型生成的 shell 工具调用的唯一 ID。

        - `type: "shell_call"`

          该项的类型。始终为 `shell_call`.

          - `"shell_call"`

        - `id: optional string or null`

          shell 工具调用的唯一 ID。当通过 API 返回该条目时填充。

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

          shell 调用的状态。取值为 `in_progress`, `completed`，或 `incomplete`.

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

      - `ShellCallOutput object { call_id, output, type, 4 more }`

        shell 工具调用发出的流式输出项。

        - `call_id: string`

          模型生成的 shell 工具调用的唯一 ID。

        - `output: array of ResponseFunctionShellCallOutputContent`

          捕获的 stdout 和 stderr 输出块及其关联结果。

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

          shell 工具调用输出的唯一 ID。当通过 API 返回该条目时填充。

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

              创建文件时要应用的统一差异内容。

            - `path: string`

              相对于工作区根目录要创建的文件的路径。

            - `type: "create_file"`

              操作类型。始终为 `create_file`.

              - `"create_file"`

          - `DeleteFile object { path, type }`

            通过 apply_patch 工具删除现有文件的指令。

            - `path: string`

              相对于工作区根目录要删除的文件的路径。

            - `type: "delete_file"`

              操作类型。始终为 `delete_file`.

              - `"delete_file"`

          - `UpdateFile object { diff, path, type }`

            通过 apply_patch 工具更新现有文件的指令。

            - `diff: string`

              要应用到现有文件的统一差异内容。

            - `path: string`

              相对于工作区根目录要更新的文件的路径。

            - `type: "update_file"`

              操作类型。始终为 `update_file`.

              - `"update_file"`

        - `status: "in_progress" or "completed"`

          apply patch 工具调用的状态。取值之一为 `in_progress` 或 `completed`.

          - `"in_progress"`

          - `"completed"`

        - `type: "apply_patch_call"`

          该项的类型。始终为 `apply_patch_call`.

          - `"apply_patch_call"`

        - `id: optional string or null`

          apply patch 工具调用的唯一 ID。当该条目通过 API 返回时填充。

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

        apply patch 工具调用产生的流式输出。

        - `call_id: string`

          模型生成的 apply patch 工具调用的唯一 ID。

        - `status: "completed" or "failed"`

          apply patch 工具调用输出的状态。取值之一为 `completed` 或 `failed`.

          - `"completed"`

          - `"failed"`

        - `type: "apply_patch_call_output"`

          该项的类型。始终为 `apply_patch_call_output`.

          - `"apply_patch_call_output"`

        - `id: optional string or null`

          apply patch 工具调用输出的唯一 ID。当该条目通过 API 返回时填充。

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

          apply patch 工具的可选人类可读日志文本（例如补丁结果或错误）。

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

            关于该工具的附加注释。

          - `description: optional string or null`

            该工具的描述。

        - `type: "mcp_list_tools"`

          该项的类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `error: optional string or null`

          如果服务器无法列出工具，则返回错误消息。

      - `McpApprovalRequest object { id, arguments, name, 2 more }`

        对工具调用的人工审批请求。

        - `id: string`

          审批请求的唯一 ID。

        - `arguments: string`

          用于该工具的参数的 JSON 字符串。

        - `name: string`

          要运行的工具的名称。

        - `server_label: string`

          发起该请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          该项的类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

      - `McpApprovalResponse object { approval_request_id, approve, type, 2 more }`

        对 MCP 审批请求的响应。

        - `approval_request_id: string`

          正在响应的审批请求的 ID。

        - `approve: boolean`

          该请求是否已批准。

        - `type: "mcp_approval_response"`

          该项的类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `id: optional string or null`

          审批响应的唯一 ID

        - `reason: optional string or null`

          可选的决策原因。

      - `McpCall object { id, arguments, name, 6 more }`

        对 MCP 服务器上某个工具的调用。

        - `id: string`

          该工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数的 JSON 字符串。

        - `name: string`

          已运行的工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          该项的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          MCP 工具调用审批请求的唯一标识符。
          在后续的 `mcp_approval_response` 用于批准或拒绝相应工具调用的输入。

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

        由你的代码生成的自定义工具调用的输出，将被发送回模型。

        - `call_id: string`

          调用 ID，用于将此自定义工具调用输出映射到对应的自定义工具调用。

        - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

          由你的代码生成的自定义工具调用的输出。
          可以是字符串或输出内容列表。

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

        - `type: "custom_tool_call_output"`

          自定义工具调用输出的类型。始终为 `custom_tool_call_output`.

          - `"custom_tool_call_output"`

        - `id: optional string`

          自定义工具调用输出在 OpenAI 平台上的唯一 ID。

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

          由模型生成的自定义工具调用的输入。

        - `name: string`

          被调用的自定义工具的名称。

        - `type: "custom_tool_call"`

          自定义工具调用的类型。始终为 `custom_tool_call`.

          - `"custom_tool_call"`

        - `id: optional string`

          自定义工具调用在 OpenAI 平台上的唯一 ID。

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

      - `CompactionTrigger object { type, id }`

        压缩当前上下文。必须是最后的输入项。

        - `type: "compaction_trigger"`

          该项的类型。始终为 `compaction_trigger`.

          - `"compaction_trigger"`

        - `id: optional string or null`

          此压缩触发器的唯一 ID。

      - `ItemReference object { id, type }`

        用于引用某个条目的内部标识符。

        - `id: string`

          要引用的条目的 ID。

        - `type: optional "item_reference" or null`

          要引用的条目的类型。始终为 `item_reference`.

          - `"item_reference"`

      - `Program object { id, call_id, code, 2 more }`

        - `id: string`

          该程序条目的唯一 ID。

        - `call_id: string`

          该程序条目的稳定调用 ID。

        - `code: string`

          由编程式工具调用执行的 JavaScript 源代码。

        - `fingerprint: string`

          必须来回透传的不透明程序回放指纹。

        - `type: "program"`

          条目类型。始终为 `program`.

          - `"program"`

      - `ProgramOutput object { id, call_id, result, 2 more }`

        - `id: string`

          此程序输出条目的唯一 ID。

        - `call_id: string`

          该程序条目的调用 ID。

        - `result: string`

          由该程序条目生成的结果。

        - `status: "completed" or "incomplete"`

          程序输出的终止状态。

          - `"completed"`

          - `"incomplete"`

        - `type: "program_output"`

          条目类型。始终为 `program_output`.

          - `"program_output"`

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对集合。这可以
    以结构化格式存储关于对象的附加信息，
    格式，以及通过 API 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串
    最大长度为 512 个字符。

  - `model: ResponsesModel`

    用于生成响应的模型 ID，例如 `gpt-4o` 或 `o3`。OpenAI
    提供多种不同能力、性能
    特征和价格的模型。请参阅 [模型指南](/docs/models)
    以浏览和比较可用模型。

    - `string`

    - `"gpt-5.6-sol" or "gpt-5.6-terra" or "gpt-5.6-luna" or 80 more`

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

    - `ResponsesOnlyModel = "o1-pro" or "o1-pro-2025-03-19" or "o3-pro" or 16 more`

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

  - `object: "response"`

    此资源的对象类型——始终设置为 `response`.

    - `"response"`

  - `output: array of ResponseOutputItem`

    由模型生成的内容项数组。

    - 以下各项的长度和顺序 `output` 数组取决于
      模型的响应。
    - 与其访问数组中的第一项并 `output` 假设它是一个
      包含由 `assistant` 模型生成的内容的
      消息，不如考虑使用 `output_text` 属性（在
      SDK 支持时）。

    - `ResponseOutputMessage object { id, content, role, 3 more }`

      来自模型的输出消息。

    - `FileSearchCall object { id, queries, status, 2 more }`

      文件搜索 工具调用的结果。请参阅
      [文件搜索 指南](/docs/guides/tools-file-search) 了解更多信息。

      - `id: string`

        文件搜索 工具调用的唯一 ID。

      - `queries: array of string`

        用于搜索文件的查询语句。

      - `status: "in_progress" or "searching" or "completed" or 2 more`

        文件搜索 工具调用的状态。可选值为以下之一： `in_progress`,
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

          可附加到对象的 16 个键值对集合。这可以
          以结构化格式存储关于对象的附加信息，
          并通过 API 或仪表板查询对象。键为字符串
          最大长度为 64 个字符。值为最大长度
          为 512 个字符的字符串、布尔值或数字。

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

          从文件中检索到的文本。

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

        条目的状态。取值为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回项时会填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `FunctionCallOutput object { id, output, status, 6 more }`

      - `id: string`

        函数调用工具输出的唯一 ID。

      - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

        由你的代码生成的函数调用的输出。
        可以是字符串或输出内容列表。

        - `StringOutput = string`

          函数调用输出的字符串。

        - `OutputContentList = array of ResponseInputText or ResponseInputImage or ResponseInputFile`

          函数调用的文本、图像或文件输出。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            模型的图像输入。了解 [图像输入](/docs/guides/vision).

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            模型的文件输入。

      - `status: "in_progress" or "completed" or "incomplete"`

        条目的状态。取值为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回项时会填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "function_call_output"`

        函数工具调用输出的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `call_id: optional string`

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

      - `created_by: optional string`

        创建该条目的行为者的标识符。

      - `name: optional string`

        产生该输出的工具的名称。

      - `namespace: optional string`

        产生该输出的工具的命名空间。

    - `WebSearchCall object { id, action, status, type }`

      网页搜索工具调用的结果。请参阅
      [网页搜索指南](/docs/guides/tools-web-search) 了解更多信息。

      - `id: string`

        该 网页搜索 工具调用的唯一 ID。

      - `action: object { type, queries, query, sources }  or object { type, url }  or object { pattern, type, url }`

        描述本次 网页搜索 调用中所执行具体操作的对象。
        包含模型如何使用网页的详细信息（search、open_page、find_in_page）。

        - `Search object { type, queries, query, sources }`

          操作类型 “search”——执行一次 网页搜索 查询。

          - `type: "search"`

            操作类型。

            - `"search"`

          - `queries: optional array of string`

            搜索查询语句。

          - `query: optional string`

            搜索查询语句。

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

            操作类型。

            - `"open_page"`

          - `url: optional string or null`

            模型打开的 URL。

        - `FindInPage object { pattern, type, url }`

          操作类型 "find_in_page"：在已加载的页面中搜索某个模式。

          - `pattern: string`

            要在页面内搜索的模式或文本。

          - `type: "find_in_page"`

            操作类型。

            - `"find_in_page"`

          - `url: string`

            搜索该模式的页面 URL。

      - `status: "in_progress" or "searching" or "completed" or "failed"`

        网页搜索工具调用的状态。

        - `"in_progress"`

        - `"searching"`

        - `"completed"`

        - `"failed"`

      - `type: "web_search_call"`

        网页搜索工具调用的类型。始终为 `web_search_call`.

        - `"web_search_call"`

    - `ComputerCall object { id, call_id, pending_safety_checks, 4 more }`

      对计算机使用工具的工具调用。参见
      [computer use guide](/docs/guides/tools-computer-use) 了解更多信息。

      - `id: string`

        计算机调用的唯一 ID。

      - `call_id: string`

        使用输出响应工具调用时所使用的标识符。

      - `pending_safety_checks: array of object { id, code, message }`

        计算机调用中待处理的安全检查。

        - `id: string`

          待处理安全检查的 ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          有关待处理安全检查的详细信息。

      - `status: "in_progress" or "completed" or "incomplete"`

        条目的状态。取值为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回项时会填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "computer_call"`

        计算机调用的类型。始终为 `computer_call`.

        - `"computer_call"`

      - `action: optional ComputerAction`

        点击操作。

      - `actions: optional ComputerActionList`

        为 `computer_use`。扁平化后的批量动作。每个动作包含一个
        `type` 判别字段以及动作专属字段。

    - `ComputerCallOutput object { id, call_id, output, 4 more }`

      - `id: string`

        计算机调用工具输出的唯一 ID。

      - `call_id: string`

        产生该输出的计算机工具调用的 ID。

      - `output: ResponseComputerToolCallOutputScreenshot`

        与计算机使用工具配合使用的计算机截图图像。

      - `status: "completed" or "incomplete" or "failed" or "in_progress"`

        消息输入的状态。可选值为以下之一： `in_progress`, `completed`，或
        `incomplete`。当输入项通过 API 返回时填充。

        - `"completed"`

        - `"incomplete"`

        - `"failed"`

        - `"in_progress"`

      - `type: "computer_call_output"`

        计算机工具调用输出的类型。始终为 `computer_call_output`.

        - `"computer_call_output"`

      - `acknowledged_safety_checks: optional array of object { id, code, message }`

        已被开发者确认的 API 所报告的安全检查。
        developer.

        - `id: string`

          待处理安全检查的 ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          有关待处理安全检查的详细信息。

      - `created_by: optional string`

        创建该条目的行为者的标识符。

    - `Reasoning object { id, summary, type, 3 more }`

      推理模型在生成回复时所使用的思维链描述。请务必将这些条目包含在你的
      中，以便在后续对话轮次中传递给 Responses API `input` 至 响应接口
      ，如果你正在手动管理
      [上下文](/docs/guides/conversation-state).

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

        推理项的加密内容。该字段默认填充
        用于由 `POST /v1/responses` 和 WebSocket
        `response.create` 请求返回的推理项。

        在流式传输时，使用已完成的推理项及其
        `encrypted_content` 从 `response.output_item.done` 事件中
        后续请求。该 `encrypted_content` 中
        `response.output_item.added` 可能不完整。这一点尤其
        重要，在 `store` 被 `false` 截断，或者使用 Zero Data Retention 时。

      - `status: optional "in_progress" or "completed" or "incomplete"`

        条目的状态。取值为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回项时会填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `Program object { id, call_id, code, 2 more }`

      - `id: string`

        程序条目的唯一 ID。

      - `call_id: string`

        该程序条目的稳定调用 ID。

      - `code: string`

        由编程式工具调用执行的 JavaScript 源代码。

      - `fingerprint: string`

        必须来回透传的不透明程序回放指纹。

      - `type: "program"`

        该项的类型。始终为 `program`.

        - `"program"`

    - `ProgramOutput object { id, call_id, result, 2 more }`

      - `id: string`

        程序输出条目的唯一 ID。

      - `call_id: string`

        该程序条目的调用 ID。

      - `result: string`

        由该程序条目生成的结果。

      - `status: "completed" or "incomplete"`

        程序输出条目的终止状态。

        - `"completed"`

        - `"incomplete"`

      - `type: "program_output"`

        该项的类型。始终为 `program_output`.

        - `"program_output"`

    - `ToolSearchCall object { id, arguments, call_id, 4 more }`

      - `id: string`

        工具搜索调用条目的唯一 ID。

      - `arguments: unknown`

        用于工具搜索调用的参数。

      - `call_id: string or null`

        由模型生成的工具搜索调用的唯一 ID。

      - `execution: "server" or "client"`

        工具搜索是由服务端还是由客户端执行的。

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

        工具搜索是由服务端还是由客户端执行的。

        - `"server"`

        - `"client"`

      - `status: "in_progress" or "completed" or "incomplete"`

        已记录的工具搜索输出条目的状态。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        由工具搜索返回的已加载工具定义。

        - `Function object { name, parameters, strict, 5 more }`

          在你自己代码中定义一个可由模型选择调用的函数。了解更多关于 [函数调用](https://platform.openai.com/docs/guides/function-calling).

          - `name: string`

            要调用的函数的名称。

          - `parameters: map[unknown] or null`

            描述该函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否对此函数工具强制执行严格的参数校验。

          - `type: "function"`

            函数工具的类型。始终为 `function`.

            - `"function"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `defer_loading: optional boolean`

            该函数是否延迟加载并通过工具搜索加载。

          - `description: optional string or null`

            对函数的描述，供模型用于判断是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            用于描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          用于从已上传文件中搜索相关内容文件搜索工具的工具。详细了解 [文件搜索 tool](https://platform.openai.com/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索工具的类型，始终为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储库的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选器。

            - `ComparisonFilter object { key, type, value }`

              用于将指定属性键与给定值通过定义的比较运算进行比较的筛选器。

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个筛选器 `and` 或 `or`.

          - `max_num_results: optional number`

            要返回的最大结果数。该数值应介于 1 到 50 之间（含两端）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              用于控制在启用混合搜索时，倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

              - `embedding_weight: number`

                倒数排名融合中嵌入的权重。

              - `text_weight: number`

                倒数排名融合中文本的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，介于 0 到 1 之间的数字。越接近 1 的数值会试图仅返回最相关的结果，但可能会返回更少的结果。

        - `Computer object { type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

          - `type: "computer"`

            computer 工具的类型。始终为 `computer`.

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

            computer use 工具的类型。始终为 `computer_use_preview`.

            - `"computer_use_preview"`

        - `WebSearch object { type, external_web_access, filters, 2 more }`

          在互联网上搜索与提示相关的来源。了解更多关于
          [网页搜索工具](/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。可选值为 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许网页搜索访问实时互联网。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的筛选条件。

            - `allowed_domains: optional array of string or null`

              允许搜索的域名。如果未提供，则允许所有域名。
              所提供的域名的子域名也同样允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议
          （MCP）服务器为模型提供访问其他工具的能力。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

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

              允许使用的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示该工具是否会修改数据，或是否为只读。如果一个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合
            自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程，并在此处提供该令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 。详细了解
            关于服务连接器的 [信息](/docs/guides/tools-remote-mcp#connectors).

            当前支持的 `connector_id` 取值包括：

            - Dropbox: `connector_dropbox`
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

            该 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与需要审批的工具关联的过滤器对象
              。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示该工具是否会修改数据，或是否为只读。如果一个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示该工具是否会修改数据，或是否为只读。如果一个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。必须提供以下其中一项 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其中之一。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。必须提供以下其中一项
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

        - `CodeInterpreter object { container, type, allowed_callers }`

          一个用于运行 Python 代码以帮助生成提示响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID 或一个用于指定上传文件 ID（以供你的代码使用）以及一个
            可选
            设置的对象。 `memory_limit` 设置的对象。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定用于运行代码的文件 ID。

              - `type: "auto"`

                Always `auto`.

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

            设置生成图像的背景。可选值为 `transparent`,
            `opaque`，或 `auto`。之一。透明背景可用于受支持的
            GPT 图像模型。对于 `gpt-image-2` 和
            `gpt-image-2-2026-04-21`，该支持处于预览阶段。当使用
            `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所投入的精力。此参数仅受 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型支持，不受 `gpt-image-1-mini`。支持。支持 `high` 和 `low`。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于局部重绘的可选蒙版。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

            - `file_id: optional string`

              蒙版图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的遮罩图像。

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

            生成图像的内容审核等级。默认值： `auto`.

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

            在流式模式下生成的中间图像数量，范围为 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or "auto"`

            生成图像的质量。可选值为 `low`, `medium`, `high`,
            或 `auto`。默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

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

          一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

            是否应延迟此工具并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认是无约束文本。

        - `Namespace object { description, name, tools, type }`

          将函数/自定义工具归入共享命名空间。

          - `description: string`

            向模型展示的命名空间描述。

          - `name: string`

            在工具调用中使用的命名空间名称（例如， `crm`).

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

                是否应延迟此函数并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                用于描述此函数工具中字符串输出所编码的 JSON 值的 JSON Schema。这不描述内容数组输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。如果省略，则当 schema 兼容时 Responses 会尝试使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 3 more }`

              一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

                是否应延迟此工具并通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认是无约束文本。

          - `type: "namespace"`

            工具的类型。始终为 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          用于延迟工具的托管或 BYOT 工具搜索配置。

          - `type: "tool_search"`

            工具的类型。始终为 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            在客户端执行的工具搜索工具中，向模型展示的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端执行还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具会在网页中搜索相关结果以用于回复。详细了解 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。可选值为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

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

              两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

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

        额外工具条目的唯一 ID。

      - `role: "unknown" or "user" or "assistant" or 5 more`

        提供额外工具的角色。

        - `"unknown"`

        - `"user"`

        - `"assistant"`

        - `"system"`

        - `"critic"`

        - `"discriminator"`

        - `"developer"`

        - `"tool"`

      - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        在该条目处可用的额外工具定义。

        - `Function object { name, parameters, strict, 5 more }`

          在你自己代码中定义一个可由模型选择调用的函数。了解更多关于 [函数调用](https://platform.openai.com/docs/guides/function-calling).

          - `name: string`

            要调用的函数的名称。

          - `parameters: map[unknown] or null`

            描述该函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否对此函数工具强制执行严格的参数校验。

          - `type: "function"`

            函数工具的类型。始终为 `function`.

            - `"function"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `defer_loading: optional boolean`

            该函数是否延迟加载并通过工具搜索加载。

          - `description: optional string or null`

            对函数的描述，供模型用于判断是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            用于描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          用于从已上传文件中搜索相关内容文件搜索工具的工具。详细了解 [文件搜索 tool](https://platform.openai.com/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索工具的类型，始终为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储库的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选器。

            - `ComparisonFilter object { key, type, value }`

              用于将指定属性键与给定值通过定义的比较运算进行比较的筛选器。

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个筛选器 `and` 或 `or`.

          - `max_num_results: optional number`

            要返回的最大结果数。该数值应介于 1 到 50 之间（含两端）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              用于控制在启用混合搜索时，倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

              - `embedding_weight: number`

                倒数排名融合中嵌入的权重。

              - `text_weight: number`

                倒数排名融合中文本的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，介于 0 到 1 之间的数字。越接近 1 的数值会试图仅返回最相关的结果，但可能会返回更少的结果。

        - `Computer object { type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

          - `type: "computer"`

            computer 工具的类型。始终为 `computer`.

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

            computer use 工具的类型。始终为 `computer_use_preview`.

            - `"computer_use_preview"`

        - `WebSearch object { type, external_web_access, filters, 2 more }`

          在互联网上搜索与提示相关的来源。了解更多关于
          [网页搜索工具](/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型。可选值为 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许网页搜索访问实时互联网。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的筛选条件。

            - `allowed_domains: optional array of string or null`

              允许搜索的域名。如果未提供，则允许所有域名。
              所提供的域名的子域名也同样允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户所在城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似值的类型。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程模型上下文协议
          （MCP）服务器为模型提供访问其他工具的能力。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中识别它。

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

              允许使用的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤对象。

              - `read_only: optional boolean`

                指示该工具是否会修改数据，或是否为只读。如果一个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，它将匹配此过滤器。

              - `tool_names: optional array of string`

                允许使用的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合
            自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程，并在此处提供该令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供其中之一
            `server_url`, `connector_id`，或 `tunnel_id` 。详细了解
            关于服务连接器的 [信息](/docs/guides/tools-remote-mcp#connectors).

            当前支持的 `connector_id` 取值包括：

            - Dropbox: `connector_dropbox`
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

            该 MCP 工具是否为延迟加载，并通过工具搜索发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器中哪些工具需要审批。可以是
              `always`, `never`，或与需要审批的工具关联的过滤器对象
              。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示该工具是否会修改数据，或是否为只读。如果一个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤对象。

                - `read_only: optional boolean`

                  指示该工具是否会修改数据，或是否为只读。如果一个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，它将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许使用的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
              设置为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。必须提供以下其中一项 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供其中之一。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的安全 MCP 隧道 ID。必须提供以下其中一项
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

        - `CodeInterpreter object { container, type, allowed_callers }`

          一个用于运行 Python 代码以帮助生成提示响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID 或一个用于指定上传文件 ID（以供你的代码使用）以及一个
            可选
            设置的对象。 `memory_limit` 设置的对象。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定用于运行代码的文件 ID。

              - `type: "auto"`

                Always `auto`.

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

            设置生成图像的背景。可选值为 `transparent`,
            `opaque`，或 `auto`。之一。透明背景可用于受支持的
            GPT 图像模型。对于 `gpt-image-2` 和
            `gpt-image-2-2026-04-21`，该支持处于预览阶段。当使用
            `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所投入的精力。此参数仅受 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型支持，不受 `gpt-image-1-mini`。支持。支持 `high` 和 `low`。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于局部重绘的可选蒙版。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

            - `file_id: optional string`

              蒙版图像的文件 ID。

            - `image_url: optional string`

              Base64 编码的遮罩图像。

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

            生成图像的内容审核等级。默认值： `auto`.

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

            在流式模式下生成的中间图像数量，范围为 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or "auto"`

            生成图像的质量。可选值为 `low`, `medium`, `high`,
            或 `auto`。默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

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

          一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

            是否应延迟此工具并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认是无约束文本。

        - `Namespace object { description, name, tools, type }`

          将函数/自定义工具归入共享命名空间。

          - `description: string`

            向模型展示的命名空间描述。

          - `name: string`

            在工具调用中使用的命名空间名称（例如， `crm`).

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

                是否应延迟此函数并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                用于描述此函数工具中字符串输出所编码的 JSON 值的 JSON Schema。这不描述内容数组输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。如果省略，则当 schema 兼容时 Responses 会尝试使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 3 more }`

              一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

                是否应延迟此工具并通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认是无约束文本。

          - `type: "namespace"`

            工具的类型。始终为 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          用于延迟工具的托管或 BYOT 工具搜索配置。

          - `type: "tool_search"`

            工具的类型。始终为 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            在客户端执行的工具搜索工具中，向模型展示的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端执行还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具会在网页中搜索相关结果以用于回复。详细了解 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型。可选值为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

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

              两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

            - `region: optional string or null`

              用户所在地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

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

    - `Compaction object { id, encrypted_content, type, created_by }`

      由 API 生成的压缩项 [`v1/responses/compact` 接口](/docs/api-reference/responses/compact).

      - `id: string`

        压缩条目的唯一 ID。

      - `encrypted_content: string`

        由压缩生成的加密内容。

      - `type: "compaction"`

        该项的类型。始终为 `compaction`.

        - `"compaction"`

      - `created_by: optional string`

        创建该条目的行为者的标识符。

    - `ImageGenerationCall object { id, result, status, type }`

      由模型发起的图像生成请求。

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

        代码解释器工具调用的状态。有效值为 `in_progress`, `completed`, `incomplete`, `interpreting`、以及 `failed`.

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

          运行命令所在的可选工作目录。

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

        条目的状态。取值为 `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `ShellCall object { id, action, call_id, 5 more }`

      在托管环境中执行一个或多个 shell 命令的工具调用。

      - `id: string`

        shell 工具调用的唯一 ID。当通过 API 返回该条目时填充。

      - `action: object { commands, max_output_length, timeout_ms }`

        描述如何运行该工具调用的 shell 命令和限制。

        - `commands: array of string`

        - `max_output_length: number or null`

          可选参数，每个命令返回内容的最大字符数。

        - `timeout_ms: number or null`

          可选参数，命令的超时时间（毫秒）。

      - `call_id: string`

        模型生成的 shell 工具调用的唯一 ID。

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

        shell 调用的状态。取值为 `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "shell_call"`

        该项的类型。始终为 `shell_call`.

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

        创建此工具调用的实体 ID。

    - `ShellCallOutput object { id, call_id, max_output_length, 5 more }`

      已发出的 shell 工具调用的输出。

      - `id: string`

        shell 调用输出的唯一 ID。当此条目通过 API 返回时会填充该字段。

      - `call_id: string`

        模型生成的 shell 工具调用的唯一 ID。

      - `max_output_length: number or null`

        shell 命令输出的最大长度。该值由模型生成，并应与原始输出一起传回。

      - `output: array of object { outcome, stderr, stdout, created_by }`

        shell 调用输出内容的数组

        - `outcome: object { type }  or object { exit_code, type }`

          表示 shell 调用输出块的结果，可以是退出结果（带有退出码）或超时结果。

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

        shell 调用输出的状态。可选值为 `in_progress`, `completed`，或 `incomplete`.

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

        创建该条目的行为者的标识符。

    - `ApplyPatchCall object { id, call_id, operation, 4 more }`

      通过创建、删除或更新文件来应用文件差异的工具调用。

      - `id: string`

        apply patch 工具调用的唯一 ID。当该条目通过 API 返回时填充。

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

        apply patch 工具调用的状态。取值之一为 `in_progress` 或 `completed`.

        - `"in_progress"`

        - `"completed"`

      - `type: "apply_patch_call"`

        该项的类型。始终为 `apply_patch_call`.

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

        创建此工具调用的实体 ID。

    - `ApplyPatchCallOutput object { id, call_id, status, 4 more }`

      apply patch 工具调用所输出的结果。

      - `id: string`

        apply patch 工具调用输出的唯一 ID。当该条目通过 API 返回时填充。

      - `call_id: string`

        模型生成的 apply patch 工具调用的唯一 ID。

      - `status: "completed" or "failed"`

        apply patch 工具调用输出的状态。取值之一为 `completed` 或 `failed`.

        - `"completed"`

        - `"failed"`

      - `type: "apply_patch_call_output"`

        该项的类型。始终为 `apply_patch_call_output`.

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

        创建此工具调用输出的实体的 ID。

      - `output: optional string or null`

        apply patch 工具返回的可选文本输出。

    - `McpCall object { id, arguments, name, 6 more }`

      对 MCP 服务器上某个工具的调用。

      - `id: string`

        该工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数的 JSON 字符串。

      - `name: string`

        已运行的工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        该项的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        MCP 工具调用审批请求的唯一标识符。
        在后续的 `mcp_approval_response` 用于批准或拒绝相应工具调用的输入。

      - `error: optional McpToolCallError or null`

        工具调用的错误（如果有）。

      - `output: optional string or null`

        工具调用的输出。

      - `status: optional "in_progress" or "completed" or "incomplete" or 2 more`

        工具调用的状态。取值为 `in_progress`, `completed`, `incomplete`, `calling`，或 `failed`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

        - `"calling"`

        - `"failed"`

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

          关于该工具的附加注释。

        - `description: optional string or null`

          该工具的描述。

      - `type: "mcp_list_tools"`

        该项的类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `error: optional string or null`

        如果服务器无法列出工具，则返回错误消息。

    - `McpApprovalRequest object { id, arguments, name, 2 more }`

      对工具调用的人工审批请求。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        用于该工具的参数的 JSON 字符串。

      - `name: string`

        要运行的工具的名称。

      - `server_label: string`

        发起该请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        该项的类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

    - `McpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      对 MCP 审批请求的响应。

      - `id: string`

        审批响应的唯一 ID

      - `approval_request_id: string`

        正在响应的审批请求的 ID。

      - `approve: boolean`

        该请求是否已批准。

      - `type: "mcp_approval_response"`

        该项的类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        可选的决策原因。

    - `CustomToolCall object { call_id, input, name, 4 more }`

      对模型创建的自定义工具的调用。

      - `call_id: string`

        用于将此自定义工具调用映射到工具调用输出的标识符。

      - `input: string`

        由模型生成的自定义工具调用的输入。

      - `name: string`

        被调用的自定义工具的名称。

      - `type: "custom_tool_call"`

        自定义工具调用的类型。始终为 `custom_tool_call`.

        - `"custom_tool_call"`

      - `id: optional string`

        自定义工具调用在 OpenAI 平台上的唯一 ID。

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

    - `CustomToolCallOutput object { id, call_id, output, 4 more }`

      - `id: string`

        自定义工具调用输出项的唯一 ID。

      - `call_id: string`

        调用 ID，用于将此自定义工具调用输出映射到对应的自定义工具调用。

      - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

        由你的代码生成的自定义工具调用的输出。
        可以是字符串或输出内容列表。

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

        条目的状态。取值为 `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回项时会填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "custom_tool_call_output"`

        自定义工具调用输出的类型。始终为 `custom_tool_call_output`.

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

        创建该条目的行为者的标识符。

  - `parallel_tool_calls: boolean`

    是否允许模型并行运行工具调用。

  - `temperature: number or null`

    使用的采样温度，介于 0 到 2 之间。较高的值（如 0.8）会使输出更加随机，而较低的值（如 0.2）会使输出更加聚焦和确定性。
    我们通常建议修改此设置或 `top_p` 但不要同时修改两者。

  - `tool_choice: ToolChoiceOptions or ToolChoiceAllowed or ToolChoiceTypes or 6 more`

    模型在生成响应时应如何选择要使用的工具（一个或多个）。请参阅
    参数，了解如何指定模型可以调用的工具。 `tools` 参数以了解如何指定哪些工具
    模型可以调用。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个工具（如果有的话）。

      `none` 表示模型将不调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息与调用一个或
      多个工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceAllowed object { mode, tools, type }`

      将模型可用的工具限制为预定义的集合。

      - `mode: "auto" or "required"`

        将模型可用的工具限制为预定义的集合。

        `auto` 允许模型从允许的工具中进行选择，并生成一条
        消息。

        `required` 要求模型调用一个或多个允许的工具。

        - `"auto"`

        - `"required"`

      - `tools: array of map[unknown]`

        模型应被允许调用的工具定义列表。

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

      指示模型应使用内置工具生成响应。
      [了解有关内置工具的更多信息](/docs/guides/tools).

      - `type: "file_search" or "web_search_preview" or "computer" or 5 more`

        模型应使用的托管工具类型。了解有关
        [内置工具](/docs/guides/tools).

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

        要调用的工具。始终 `programmatic_tool_calling`.

        - `"programmatic_tool_calling"`

    - `ToolChoiceApplyPatch object { type }`

      在执行工具调用时强制模型调用 apply_patch 工具。

      - `type: "apply_patch"`

        要调用的工具。始终 `apply_patch`.

        - `"apply_patch"`

    - `ToolChoiceShell object { type }`

      在需要工具调用时强制模型调用 shell 工具。

      - `type: "shell"`

        要调用的工具。始终 `shell`.

        - `"shell"`

  - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

    模型在生成响应时可以调用的工具数组。你
    可以通过设置 `tool_choice` 参数来指定要使用的工具。

    我们支持以下类别的工具：

    - **内置工具**：由 OpenAI 提供、可扩展模型能力的工具，例如
      模型的各项能力，例如 [网页搜索](/docs/guides/tools-web-search)
      或 [文件搜索](/docs/guides/tools-file-search)。了解更多信息
      [内置工具](/docs/guides/tools).
    - **MCP 工具**：通过自定义 MCP 服务器与第三方系统集成
      ，或使用 Google Drive 和 SharePoint 等预定义连接器。了解更多信息
      [MCP 工具](/docs/guides/tools-connectors-mcp).
    - **函数调用（自定义工具）**：由你定义的函数，
      使模型能够使用强类型参数和输出调用你自己的代码。了解更多信息
      和输出。了解更多信息
      [函数调用](/docs/guides/function-calling)。你也可以使用
      自定义工具调用你自己的代码。

    - `Function object { name, parameters, strict, 5 more }`

      在你自己代码中定义一个可由模型选择调用的函数。了解更多关于 [函数调用](https://platform.openai.com/docs/guides/function-calling).

      - `name: string`

        要调用的函数的名称。

      - `parameters: map[unknown] or null`

        描述该函数参数的 JSON schema 对象。

      - `strict: boolean or null`

        是否对此函数工具强制执行严格的参数校验。

      - `type: "function"`

        函数工具的类型。始终为 `function`.

        - `"function"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

      - `defer_loading: optional boolean`

        该函数是否延迟加载并通过工具搜索加载。

      - `description: optional string or null`

        对函数的描述，供模型用于判断是否调用该函数。

      - `output_schema: optional map[unknown] or null`

        用于描述该函数字符串输出中所编码 JSON 值的 JSON schema 对象。

    - `FileSearch object { type, vector_store_ids, filters, 2 more }`

      用于从已上传文件中搜索相关内容文件搜索工具的工具。详细了解 [文件搜索 tool](https://platform.openai.com/docs/guides/tools-file-search).

      - `type: "file_search"`

        文件搜索工具的类型，始终为 `file_search`.

        - `"file_search"`

      - `vector_store_ids: array of string`

        要搜索的向量存储库的 ID。

      - `filters: optional ComparisonFilter or CompoundFilter or null`

        要应用的筛选器。

        - `ComparisonFilter object { key, type, value }`

          用于将指定属性键与给定值通过定义的比较运算进行比较的筛选器。

        - `CompoundFilter object { filters, type }`

          使用以下方式组合多个筛选器 `and` 或 `or`.

      - `max_num_results: optional number`

        要返回的最大结果数。该数值应介于 1 到 50 之间（含两端）。

      - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

        搜索的排序选项。

        - `hybrid_search: optional object { embedding_weight, text_weight }`

          用于控制在启用混合搜索时，倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

          - `embedding_weight: number`

            倒数排名融合中嵌入的权重。

          - `text_weight: number`

            倒数排名融合中文本的权重。

        - `ranker: optional "auto" or "default-2024-11-15"`

          用于文件搜索的排序器。

          - `"auto"`

          - `"default-2024-11-15"`

        - `score_threshold: optional number`

          文件搜索的分数阈值，介于 0 到 1 之间的数字。越接近 1 的数值会试图仅返回最相关的结果，但可能会返回更少的结果。

    - `Computer object { type }`

      用于控制虚拟计算机的工具。了解更多关于 [computer tool](https://platform.openai.com/docs/guides/tools-computer-use).

      - `type: "computer"`

        computer 工具的类型。始终为 `computer`.

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

        computer use 工具的类型。始终为 `computer_use_preview`.

        - `"computer_use_preview"`

    - `WebSearch object { type, external_web_access, filters, 2 more }`

      在互联网上搜索与提示相关的来源。了解更多关于
      [网页搜索工具](/docs/guides/tools-web-search).

      - `type: "web_search" or "web_search_2025_08_26"`

        网页搜索工具的类型。可选值为 `web_search` 或 `web_search_2025_08_26`.

        - `"web_search"`

        - `"web_search_2025_08_26"`

      - `external_web_access: optional boolean`

        允许网页搜索访问实时互联网。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

      - `filters: optional object { allowed_domains }  or null`

        搜索的筛选条件。

        - `allowed_domains: optional array of string or null`

          允许搜索的域名。如果未提供，则允许所有域名。
          所提供的域名的子域名也同样允许。

          示例： `["pubmed.ncbi.nlm.nih.gov"]`

      - `search_context_size: optional "low" or "medium" or "high"`

        用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

        - `"low"`

        - `"medium"`

        - `"high"`

      - `user_location: optional object { city, country, region, 2 more }  or null`

        用户的大致位置。

        - `city: optional string or null`

          用户所在城市的自由文本输入，例如 `San Francisco`.

        - `country: optional string or null`

          两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

        - `region: optional string or null`

          用户所在地区的自由文本输入，例如 `California`.

        - `timezone: optional string or null`

          该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

        - `type: optional "approximate"`

          位置近似值的类型。始终为 `approximate`.

          - `"approximate"`

    - `Mcp object { server_label, type, allowed_callers, 9 more }`

      通过远程模型上下文协议
      （MCP）服务器为模型提供访问其他工具的能力。 [了解更多关于 MCP 的信息](/docs/guides/tools-remote-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中识别它。

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

          允许使用的工具名称组成的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许哪些工具的过滤对象。

          - `read_only: optional boolean`

            指示该工具是否会修改数据，或是否为只读。如果一个
            MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，它将匹配此过滤器。

          - `tool_names: optional array of string`

            允许使用的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，可以配合
        自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
        必须处理 OAuth 授权流程，并在此处提供该令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供其中之一
        `server_url`, `connector_id`，或 `tunnel_id` 。详细了解
        关于服务连接器的 [信息](/docs/guides/tools-remote-mcp#connectors).

        当前支持的 `connector_id` 取值包括：

        - Dropbox: `connector_dropbox`
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

        该 MCP 工具是否为延迟加载，并通过工具搜索发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 标头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器中哪些工具需要审批。可以是
          `always`, `never`，或与需要审批的工具关联的过滤器对象
          。

          - `always: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示该工具是否会修改数据，或是否为只读。如果一个
              MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤对象。

            - `read_only: optional boolean`

              指示该工具是否会修改数据，或是否为只读。如果一个
              MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，它将匹配此过滤器。

            - `tool_names: optional array of string`

              允许使用的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值为 `always` 或
          `never`。之一。当设置为 `always`，时，所有工具都需要审批。当
          设置为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。必须提供以下其中一项 `server_url`, `connector_id`，或
        `tunnel_id` 必须提供其中之一。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的安全 MCP 隧道 ID。必须提供以下其中一项
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供其中之一。

    - `CodeInterpreter object { container, type, allowed_callers }`

      一个用于运行 Python 代码以帮助生成提示响应的工具。

      - `container: string or object { type, file_ids, memory_limit, network_policy }`

        代码解释器容器。可以是容器 ID 或一个用于指定上传文件 ID（以供你的代码使用）以及一个
        可选
        设置的对象。 `memory_limit` 设置的对象。

        - `string`

          容器 ID。

        - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

          代码解释器容器的配置。可选择指定用于运行代码的文件 ID。

          - `type: "auto"`

            Always `auto`.

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

        设置生成图像的背景。可选值为 `transparent`,
        `opaque`，或 `auto`。之一。透明背景可用于受支持的
        GPT 图像模型。对于 `gpt-image-2` 和
        `gpt-image-2-2026-04-21`，该支持处于预览阶段。当使用
        `transparent`，时，将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

        - `"transparent"`

        - `"opaque"`

        - `"auto"`

      - `input_fidelity: optional "high" or "low" or null`

        控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所投入的精力。此参数仅受 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型支持，不受 `gpt-image-1-mini`。支持。支持 `high` 和 `low`。默认为 `low`.

        - `"high"`

        - `"low"`

      - `input_image_mask: optional object { file_id, image_url }`

        用于局部重绘的可选蒙版。包含 `image_url`
        （字符串，可选）和 `file_id` （字符串，可选）。

        - `file_id: optional string`

          蒙版图像的文件 ID。

        - `image_url: optional string`

          Base64 编码的遮罩图像。

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

        生成图像的内容审核等级。默认值： `auto`.

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

        在流式模式下生成的中间图像数量，范围为 0（默认值）到 3。

      - `quality: optional "low" or "medium" or "high" or "auto"`

        生成图像的质量。可选值为 `low`, `medium`, `high`,
        或 `auto`。默认值： `auto`.

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

        生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

        - `string`

        - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

          生成图像的尺寸。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持以字符串形式传入任意分辨率，例如 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，并且请求的宽高比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性支持，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素与边长限制。GPT 图像模型支持的标准尺寸为 `1024x1024`, `1536x1024`、以及 `1024x1536` ； `auto` 支持用于允许自动尺寸的模型。对于 `dall-e-2`，使用以下之一： `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用以下之一： `1024x1024`, `1792x1024`，或 `1024x1792`.

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

      一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

        是否应延迟此工具并通过工具搜索发现。

      - `description: optional string`

        自定义工具的可选描述，用于提供更多上下文。

      - `format: optional CustomToolInputFormat`

        自定义工具的输入格式。默认是无约束文本。

    - `Namespace object { description, name, tools, type }`

      将函数/自定义工具归入共享命名空间。

      - `description: string`

        向模型展示的命名空间描述。

      - `name: string`

        在工具调用中使用的命名空间名称（例如， `crm`).

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

            是否应延迟此函数并通过工具搜索发现。

          - `description: optional string or null`

          - `output_schema: optional map[unknown] or null`

            用于描述此函数工具中字符串输出所编码的 JSON 值的 JSON Schema。这不描述内容数组输出。

          - `parameters: optional unknown or null`

          - `strict: optional boolean or null`

            是否强制执行严格的参数校验。如果省略，则当 schema 兼容时 Responses 会尝试使用严格校验，否则回退到非严格校验。

        - `Custom object { name, type, allowed_callers, 3 more }`

          一个使用指定格式处理输入的自定义工具。详细了解   [自定义工具](/docs/guides/function-calling#custom-tools)

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

            是否应延迟此工具并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认是无约束文本。

      - `type: "namespace"`

        工具的类型。始终为 `namespace`.

        - `"namespace"`

    - `ToolSearch object { type, description, execution, parameters }`

      用于延迟工具的托管或 BYOT 工具搜索配置。

      - `type: "tool_search"`

        工具的类型。始终为 `tool_search`.

        - `"tool_search"`

      - `description: optional string or null`

        在客户端执行的工具搜索工具中，向模型展示的描述。

      - `execution: optional "server" or "client"`

        工具搜索是由服务端执行还是由客户端执行。

        - `"server"`

        - `"client"`

      - `parameters: optional unknown or null`

        客户端执行的工具搜索工具的参数 schema。

    - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

      此工具会在网页中搜索相关结果以用于回复。详细了解 [网页搜索工具](https://platform.openai.com/docs/guides/tools-web-search).

      - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

        网页搜索工具的类型。可选值为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

        - `"web_search_preview"`

        - `"web_search_preview_2025_03_11"`

      - `search_content_types: optional array of "text" or "image"`

        - `"text"`

        - `"image"`

      - `search_context_size: optional "low" or "medium" or "high"`

        用于搜索的上下文窗口空间的高级使用指导。可选值为 `low`, `medium`，或 `high`. `medium` 为默认值。

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

          两字母 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 所在国家，例如。 `US`.

        - `region: optional string or null`

          用户所在地区的自由文本输入，例如 `California`.

        - `timezone: optional string or null`

          该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 所在国家，例如。 `America/Los_Angeles`.

    - `ApplyPatch object { type, allowed_callers }`

      允许助手使用 unified diff 创建、删除或更新文件。

      - `type: "apply_patch"`

        工具的类型。始终为 `apply_patch`.

        - `"apply_patch"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

  - `top_p: number or null`

    一种温度采样的替代方法，称为核采样（nucleus sampling），
    模型会考虑概率质量排名前 top_p 的词元的结果。
    因此 0.1 表示仅考虑概率质量排名前 10% 的词元
    。

    我们通常建议修改此设置或 `temperature` 但不要同时修改两者。

  - `background: optional boolean or null`

    是否在后台运行模型响应。
    [了解更多](/docs/guides/background).

  - `completed_at: optional number or null`

    该 Response 完成时的 Unix 时间戳（以秒为单位）。
    仅在状态为 `completed`.

  - `conversation: optional object { id }  or null`

    此 response 所属的对话。该 response 中的输入项和输出项已自动添加到此对话中。

    - `id: string`

      与此 response 相关联的对话的唯一 ID。

  - `max_output_tokens: optional number or null`

    响应可生成 token 数量的上限，包括可见输出 token 以及 [推理 token](/docs/guides/reasoning).

  - `max_tool_calls: optional number or null`

    在一次响应中可处理的内置工具调用总次数上限。此上限适用于所有内置工具调用，而非按单个工具计算。模型后续任何进一步的工具调用尝试都将被忽略。

  - `moderation: optional object { input, output }  or null`

    针对该 response 输入和输出的审核结果（如果请求了带审核的 completions）。

    - `input: object { categories, category_applied_input_types, category_scores, 3 more }  or object { code, message, type }`

      针对该 response 输入的审核。

      - `ModerationResult object { categories, category_applied_input_types, category_scores, 3 more }`

        为响应输入或输出生成的审核结果。

        - `categories: map[boolean]`

          从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

        - `category_applied_input_types: map[array of "text" or "image"]`

          每个类别的评分反映了哪些输入模态。

          - `"text"`

          - `"image"`

        - `category_scores: map[number]`

          从审核类别到评分的字典。

        - `flagged: boolean`

          指示内容是否被任何类别标记的布尔值。

        - `model: string`

          生成此结果的审核模型。

        - `type: "moderation_result"`

          对象类型，对于成功的审核结果始终为 `moderation_result` 。

          - `"moderation_result"`

      - `Error object { code, message, type }`

        在为响应输入或输出尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，对于成功的审核结果始终为 `error` ，用于审核失败的情况。

          - `"error"`

    - `output: object { categories, category_applied_input_types, category_scores, 3 more }  or object { code, message, type }`

      对响应输出进行的审核。

      - `ModerationResult object { categories, category_applied_input_types, category_scores, 3 more }`

        为响应输入或输出生成的审核结果。

        - `categories: map[boolean]`

          从审核类别到布尔值的字典，如果输入在该类别下被标记则为 True。

        - `category_applied_input_types: map[array of "text" or "image"]`

          每个类别的评分反映了哪些输入模态。

          - `"text"`

          - `"image"`

        - `category_scores: map[number]`

          从审核类别到评分的字典。

        - `flagged: boolean`

          指示内容是否被任何类别标记的布尔值。

        - `model: string`

          生成此结果的审核模型。

        - `type: "moderation_result"`

          对象类型，对于成功的审核结果始终为 `moderation_result` 。

          - `"moderation_result"`

      - `Error object { code, message, type }`

        在为响应输入或输出尝试审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，对于成功的审核结果始终为 `error` ，用于审核失败的情况。

          - `"error"`

  - `output_text: optional string or null`

    仅SDK提供的便捷属性，包含来自数组中所有项的聚合文本输出（如果存在）。
    来自所有 `output_text` 项的 `output` ，如果存在的话。
    在 Python 和 JavaScript SDK 中受支持。

  - `previous_response_id: optional string or null`

    模型上一次响应的唯一 ID。使用此 ID 可
    创建多轮对话。详细了解
    [对话状态](/docs/guides/conversation-state)。无法与 `conversation`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

    - `id: string`

      要使用的提示词模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的值映射，用于替换你的
      提示词中的变量。替换值可以是字符串，也可以是其他
      Response 输入类型，例如图片或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        模型的文本输入。

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        模型的图像输入。了解 [图像输入](/docs/guides/vision).

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        模型的文件输入。

    - `version: optional string or null`

      可选的提示词模板版本。

  - `prompt_cache_key: optional string or null`

    由 OpenAI 用于缓存相似请求的响应，以优化你的缓存命中率。取代 `user` 字段。 [了解更多](/docs/guides/prompt-caching).

  - `prompt_cache_options: optional object { mode, ttl }`

    应用于该响应的提示缓存选项。支持以下及更高版本 `gpt-5.6` 的模型。

    - `mode: "implicit" or "explicit"`

      是否启用了隐式 prompt 缓存断点。

      - `"implicit"`

      - `"explicit"`

    - `ttl: "30m"`

      应用于每个缓存断点的最短生命周期。

      - `"30m"`

  - `prompt_cache_retention: optional "in_memory" or "24h" or null`

    已弃用。请使用 `prompt_cache_options.ttl` 替代。

    提示缓存的保留策略。设置为 `24h` 以启用扩展提示缓存，将缓存前缀保持更长时间，最长可达 24 小时。 [了解更多](/docs/guides/prompt-caching#prompt-cache-retention).
    该字段表示最长保留策略，而
    `prompt_cache_options.ttl` 表示最短缓存生命周期。这两个字段彼此独立且互不影响。
    字段彼此独立且互不影响。
    对于 `gpt-5.5`, `gpt-5.5-pro`，及未来模型，仅支持 `24h` 。

    对于同时支持两者的较旧模型 `in_memory` 和 `24h`，默认值取决于你所在组织的数据保留策略：

    - 未启用 ZDR 的组织默认使用 `24h`.
    - 已启用 ZDR 的组织默认使用 `in_memory` 当 `prompt_cache_retention` 未指定时。

    - `"in_memory"`

    - `"24h"`

  - `reasoning: optional Reasoning or null`

    **仅限 gpt-5 和 o 系列模型**

    用于
    [推理模型](https://platform.openai.com/docs/guides/reasoning).

    - `context: optional "auto" or "current_turn" or "all_turns" or null`

      控制在后续轮次中向模型回传的推理项。
      如果省略或设置为 `auto`，则由模型决定上下文模式。该
      `gpt-5.6` 模型系列默认为 `all_turns`；更早的模型默认为
      `current_turn`.

      在响应中返回时，这是该响应实际使用的有效推理上下文模式。
      用于该响应。

      - `"auto"`

      - `"current_turn"`

      - `"all_turns"`

    - `effort: optional ReasoningEffort or null`

      限制推理模型在推理上的投入程度。当前支持的值
      为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`、以及 `max`.
      降低推理投入程度可以带来更快的响应，并在响应中消耗更少的
      推理 tokens 并非所有推理模型都支持每个
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

    - `generate_summary: optional "auto" or "concise" or "detailed" or null`

      **已弃用：** 使用 `summary` 替代。

      对模型所执行推理的摘要。这可以
      有助于调试和理解模型的推理过程。
      以下之一 `auto`, `concise`，或 `detailed`.

      - `"auto"`

      - `"concise"`

      - `"detailed"`

    - `mode: optional string or "standard" or "pro"`

      控制该请求的推理执行模式。

      在响应中返回时，这是实际生效的执行模式。

      - `string`

      - `"standard" or "pro"`

        控制该请求的推理执行模式。

        在响应中返回时，这是实际生效的执行模式。

        - `"standard"`

        - `"pro"`

    - `summary: optional "auto" or "concise" or "detailed" or null`

      对模型所执行推理的摘要。这可以
      有助于调试和理解模型的推理过程。
      以下之一 `auto`, `concise`，或 `detailed`.

      `concise` 可用于 `computer-use-preview` 模型以及之后发布的所有推理模型 `gpt-5`.

      - `"auto"`

      - `"concise"`

      - `"detailed"`

  - `safety_identifier: optional string or null`

    一个稳定的标识符，用于帮助检测可能违反 OpenAI 使用政策的应用用户。
    该 ID 应为能够唯一标识每个用户的字符串，最大长度为 64 个字符。我们建议对其用户名或电子邮件地址进行哈希处理，以避免向我们发送任何可识别身份的信息。 [了解更多](/docs/guides/safety-best-practices#safety-identifiers).

  - `service_tier: optional ServiceTier or null`

    指定用于处理该请求的处理类型。

    - 如果设置为 'auto'，则该请求将使用项目设置中配置的服务层级进行处理。除非另行配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则该请求将使用所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/docs/guides/flex-processing)'，则该请求将使用 Flex Processing 服务层级进行处理。
    - 若要在请求级别启用 [快速模式](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 请求中包含 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` ，无论你是否在请求中指定 `service_tier=fast` 或 `priority` 。
    - 如果设置为 'ultrafast'，则该请求将使用受访问控制的 Ultrafast Processing 服务层级进行处理。此层级当前可用于 `gpt-5.6-sol`；通过该层级提供的响应将显示 `service_tier=ultrafast`.
    - 未设置时，默认行为为 'auto'。

    当 `service_tier` 参数被设置时，响应体将根据实际用于处理该请求的处理模式包含相应的 `service_tier` 值。此响应值可能与该参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

    - `"ultrafast"`

  - `status: optional ResponseStatus`

    响应生成的状态。取值为 `completed`, `failed`,
    `in_progress`, `cancelled`, `queued`，或 `incomplete`.

    - `"completed"`

    - `"failed"`

    - `"in_progress"`

    - `"cancelled"`

    - `"queued"`

    - `"incomplete"`

  - `text: optional ResponseTextConfig`

    模型文本响应的配置选项。可以是纯
    文本或结构化 JSON 数据。了解更多：

    - [文本输入与输出](/docs/guides/text)
    - [结构化输出](/docs/guides/structured-outputs)

    - `format: optional ResponseFormatTextConfig`

      一个对象，用于指定模型必须输出的格式。

      配置 `{ "type": "json_schema" }` 会启用结构化输出，
      从而确保模型与你提供的 JSON schema 匹配。详见
      [结构化输出指南](/docs/guides/structured-outputs).

      默认格式为 `{ "type": "text" }` 且无其他选项。

      **不推荐用于 gpt-4o 及更新的模型：**

      设置为 `{ "type": "json_object" }` 会启用旧的 JSON 模式，该模式
      确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
      的模型，建议优先使用该模式。

      - `ResponseFormatText object { type }`

        默认响应格式。用于生成文本响应。

        - `type: "text"`

          正在定义的响应格式的类型。始终为 `text`.

          - `"text"`

      - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

        JSON Schema 响应格式。用于生成结构化 JSON 响应。
        了解更多信息 [结构化输出](/docs/guides/structured-outputs).

        - `name: string`

          响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
          下划线和短横线，最大长度为 64。

        - `schema: map[unknown]`

          响应格式的架构，以 JSON 架构对象描述。
          了解如何构建 JSON 架构 [信息](https://json-schema.org/).

        - `type: "json_schema"`

          正在定义的响应格式的类型。始终为 `json_schema`.

          - `"json_schema"`

        - `description: optional string`

          响应格式用途的描述，模型使用该描述
          确定如何按该格式进行响应。

        - `strict: optional boolean or null`

          生成输出时是否启用严格的架构遵循。
          如果设置为 true，模型将始终遵循所定义的确切架构
          中的 `schema` 字段。仅支持 JSON Schema 的一个子集，
          `strict` 被 `true`。要了解更多信息，请参阅 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `ResponseFormatJSONObject object { type }`

        JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
        建议在支持的模型上使用 `json_schema` 。请注意，
        模型在收到系统或用户消息明确指示前不会生成 JSON，
        因此需要相应指令。

        - `type: "json_object"`

          正在定义的响应格式的类型。始终为 `json_object`.

          - `"json_object"`

    - `verbosity: optional "low" or "medium" or "high" or null`

      约束模型响应的详细程度。较低的值将导致
      更高的值将生成更简洁的响应，而较低的值将生成更冗长的响应。
      当前支持的值包括 `low`, `medium`、以及 `high`。默认值为
      `medium`.

      - `"low"`

      - `"medium"`

      - `"high"`

  - `top_logprobs: optional number or null`

    一个介于 0 和 20 之间的整数，指定在每个词元位置最多返回的词元数量，每个词元都有一个关联的对数
    词元，每个词元都有一个关联的对数概率
    概率。在某些情况下，返回的词元数量可能少于
    请求的数量。

  - `truncation: optional "auto" or "disabled" or null`

    用于模型响应的截断策略。

    - `auto`：如果此 Response 的输入超过
      模型的上下文窗口大小，模型将通过丢弃对话开头的条目来
      截断响应以适配上下文窗口。
    - `disabled` （默认）：如果输入大小将超过模型的上下文窗口
      大小，请求将失败并返回 400 错误。

    - `"auto"`

    - `"disabled"`

  - `usage: optional ResponseUsage`

    表示 token 使用详情，包括输入 token、输出 token、
    输出 token 的细分，以及使用的 token 总数。

    - `input_tokens: number`

      输入 token 的数量。

    - `input_tokens_details: object { cache_write_tokens, cached_tokens }`

      输入 token 的详细细分。

      - `cache_write_tokens: number`

        写入缓存的输入 token 数量。

      - `cached_tokens: number`

        从缓存中检索到的 token 数量。
        [详细了解 prompt 缓存](/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出 token 的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出 token 的详细细分。

      - `reasoning_tokens: number`

        推理 token 的数量。

    - `total_tokens: number`

      使用的 token 总数。

    - `compute_units: optional number or null`

      请求的计算单元。当前可用时为 null。

  - `user: optional string`

    该字段正在被替换为 `safety_identifier` 和 `prompt_cache_key`。请使用 `prompt_cache_key` 代替以维持缓存优化。
    你的最终用户的稳定标识符。
    用于通过更好地对相似请求进行分桶来提高缓存命中率，并帮助 OpenAI 检测和防止滥用。 [了解更多](/docs/guides/safety-best-practices#safety-identifiers).

### 示例

```http
curl https://api.openai.com/v1/responses \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "model": "gpt-5.1",
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
  "created_at": 0,
  "error": {
    "code": "server_error",
    "message": "message"
  },
  "incomplete_details": {
    "reason": "max_output_tokens"
  },
  "instructions": "string",
  "metadata": {
    "foo": "string"
  },
  "model": "gpt-5.1",
  "object": "response",
  "output": [
    {
      "id": "id",
      "content": [
        {
          "annotations": [
            {
              "file_id": "file_id",
              "filename": "filename",
              "index": 0,
              "type": "file_citation"
            }
          ],
          "logprobs": [
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
          "text": "text",
          "type": "output_text"
        }
      ],
      "role": "assistant",
      "status": "in_progress",
      "type": "message",
      "phase": "commentary"
    }
  ],
  "parallel_tool_calls": true,
  "temperature": 1,
  "tool_choice": "none",
  "tools": [
    {
      "name": "name",
      "parameters": {
        "foo": "bar"
      },
      "strict": true,
      "type": "function",
      "allowed_callers": [
        "direct"
      ],
      "defer_loading": true,
      "description": "description",
      "output_schema": {
        "foo": "bar"
      }
    }
  ],
  "top_p": 1,
  "background": true,
  "completed_at": 0,
  "conversation": {
    "id": "id"
  },
  "max_output_tokens": 0,
  "max_tool_calls": 0,
  "moderation": {
    "input": {
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
    },
    "output": {
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
  },
  "output_text": "output_text",
  "previous_response_id": "previous_response_id",
  "prompt": {
    "id": "id",
    "variables": {
      "foo": "string"
    },
    "version": "version"
  },
  "prompt_cache_key": "prompt-cache-key-1234",
  "prompt_cache_options": {
    "mode": "implicit",
    "ttl": "30m"
  },
  "prompt_cache_retention": "in_memory",
  "reasoning": {
    "context": "auto",
    "effort": "none",
    "generate_summary": "auto",
    "mode": "standard",
    "summary": "auto"
  },
  "safety_identifier": "safety-identifier-1234",
  "service_tier": "auto",
  "status": "completed",
  "text": {
    "format": {
      "type": "text"
    },
    "verbosity": "low"
  },
  "top_logprobs": 0,
  "truncation": "auto",
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
  },
  "user": "user-1234"
}
```

### 文件输入

```http
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.4",
    "input": [
      {
        "role": "user",
        "content": [
          {"type": "input_text", "text": "what is in this file?"},
          {
            "type": "input_file",
            "file_url": "https://www.berkshirehathaway.com/letters/2024ltr.pdf",
            "detail": "auto"
          }
        ]
      }
    ]
  }'
```

#### 响应

```json
{
  "id": "resp_686eef60237881a2bd1180bb8b13de430e34c516d176ff86",
  "object": "response",
  "created_at": 1752100704,
  "status": "completed",
  "completed_at": 1752100705,
  "background": false,
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "max_tool_calls": null,
  "model": "gpt-5.4",
  "output": [
    {
      "id": "msg_686eef60d3e081a29283bdcbc4322fd90e34c516d176ff86",
      "type": "message",
      "status": "completed",
      "content": [
        {
          "type": "output_text",
          "annotations": [],
          "logprobs": [],
          "text": "The file seems to contain excerpts from a letter to the shareholders of Berkshire Hathaway Inc., likely written by Warren Buffett. It covers several topics:\n\n1. **Communication Philosophy**: Buffett emphasizes the importance of transparency and candidness in reporting mistakes and successes to shareholders.\n\n2. **Mistakes and Learnings**: The letter acknowledges past mistakes in business assessments and management hires, highlighting the importance of correcting errors promptly.\n\n3. **CEO Succession**: Mention of Greg Abel stepping in as the new CEO and continuing the tradition of honest communication.\n\n4. **Pete Liegl Story**: A detailed account of acquiring Forest River and the relationship with its founder, highlighting trust and effective business decisions.\n\n5. **2024 Performance**: Overview of business performance, particularly in insurance and investment activities, with a focus on GEICO's improvement.\n\n6. **Tax Contributions**: Discussion of significant tax payments to the U.S. Treasury, credited to shareholders' reinvestments.\n\n7. **Investment Strategy**: A breakdown of Berkshire\u2019s investments in both controlled subsidiaries and marketable equities, along with a focus on long-term holding strategies.\n\n8. **American Capitalism**: Reflections on America\u2019s economic development and Berkshire\u2019s role within it.\n\n9. **Property-Casualty Insurance**: Insights into the P/C insurance business model and its challenges and benefits.\n\n10. **Japanese Investments**: Information about Berkshire\u2019s investments in Japanese companies and future plans.\n\n11. **Annual Meeting**: Details about the upcoming annual gathering in Omaha, including schedule changes and new book releases.\n\n12. **Personal Anecdotes**: Light-hearted stories about family and interactions, conveying Buffett's personable approach.\n\n13. **Financial Performance Data**: Tables comparing Berkshire\u2019s annual performance to the S&P 500, showing impressive long-term gains.\n\nOverall, the letter reinforces Berkshire Hathaway's commitment to transparency, investment in both its businesses and the wider economy, and emphasizes strong leadership and prudent financial management."
        }
      ],
      "role": "assistant"
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "reasoning": {
    "effort": null,
    "summary": null
  },
  "service_tier": "default",
  "store": true,
  "temperature": 1.0,
  "text": {
    "format": {
      "type": "text"
    }
  },
  "tool_choice": "auto",
  "tools": [],
  "top_logprobs": 0,
  "top_p": 1.0,
  "truncation": "disabled",
  "usage": {
    "input_tokens": 8438,
    "input_tokens_details": {
      "cached_tokens": 0,
      "cache_write_tokens": 0
    },
    "output_tokens": 398,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 8836
  },
  "user": null,
  "metadata": {}
}
```

### 文件搜索

```http
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.4",
    "tools": [{
      "type": "file_search",
      "vector_store_ids": ["vs_1234567890"],
      "max_num_results": 20
    }],
    "input": "What are the attributes of an ancient brown dragon?"
  }'
```

#### 响应

```json
{
  "id": "resp_67ccf4c55fc48190b71bd0463ad3306d09504fb6872380d7",
  "object": "response",
  "created_at": 1741485253,
  "status": "completed",
  "completed_at": 1741485254,
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "model": "gpt-5.4",
  "output": [
    {
      "type": "file_search_call",
      "id": "fs_67ccf4c63cd08190887ef6464ba5681609504fb6872380d7",
      "status": "completed",
      "queries": [
        "attributes of an ancient brown dragon"
      ],
      "results": null
    },
    {
      "type": "message",
      "id": "msg_67ccf4c93e5c81909d595b369351a9d309504fb6872380d7",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "The attributes of an ancient brown dragon include...",
          "annotations": [
            {
              "type": "file_citation",
              "index": 320,
              "file_id": "file-4wDz5b167pAf72nx1h9eiN",
              "filename": "dragons.pdf"
            },
            {
              "type": "file_citation",
              "index": 576,
              "file_id": "file-4wDz5b167pAf72nx1h9eiN",
              "filename": "dragons.pdf"
            },
            {
              "type": "file_citation",
              "index": 815,
              "file_id": "file-4wDz5b167pAf72nx1h9eiN",
              "filename": "dragons.pdf"
            },
            {
              "type": "file_citation",
              "index": 815,
              "file_id": "file-4wDz5b167pAf72nx1h9eiN",
              "filename": "dragons.pdf"
            },
            {
              "type": "file_citation",
              "index": 1030,
              "file_id": "file-4wDz5b167pAf72nx1h9eiN",
              "filename": "dragons.pdf"
            },
            {
              "type": "file_citation",
              "index": 1030,
              "file_id": "file-4wDz5b167pAf72nx1h9eiN",
              "filename": "dragons.pdf"
            },
            {
              "type": "file_citation",
              "index": 1156,
              "file_id": "file-4wDz5b167pAf72nx1h9eiN",
              "filename": "dragons.pdf"
            },
            {
              "type": "file_citation",
              "index": 1225,
              "file_id": "file-4wDz5b167pAf72nx1h9eiN",
              "filename": "dragons.pdf"
            }
          ]
        }
      ]
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "reasoning": {
    "effort": null,
    "summary": null
  },
  "store": true,
  "temperature": 1.0,
  "text": {
    "format": {
      "type": "text"
    }
  },
  "tool_choice": "auto",
  "tools": [
    {
      "type": "file_search",
      "filters": null,
      "max_num_results": 20,
      "ranking_options": {
        "ranker": "auto",
        "score_threshold": 0.0
      },
      "vector_store_ids": [
        "vs_1234567890"
      ]
    }
  ],
  "top_p": 1.0,
  "truncation": "disabled",
  "usage": {
    "input_tokens": 18307,
    "input_tokens_details": {
      "cached_tokens": 0,
      "cache_write_tokens": 0
    },
    "output_tokens": 348,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 18655
  },
  "user": null,
  "metadata": {}
}
```

### 函数

```http
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.4",
    "input": "What is the weather like in Boston today?",
    "tools": [
      {
        "type": "function",
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
          "required": ["location", "unit"]
        }
      }
    ],
    "tool_choice": "auto"
  }'
```

#### 响应

```json
{
  "id": "resp_67ca09c5efe0819096d0511c92b8c890096610f474011cc0",
  "object": "response",
  "created_at": 1741294021,
  "status": "completed",
  "completed_at": 1741294022,
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "model": "gpt-5.4",
  "output": [
    {
      "type": "function_call",
      "id": "fc_67ca09c6bedc8190a7abfec07b1a1332096610f474011cc0",
      "call_id": "call_unLAR8MvFNptuiZK6K6HCy5k",
      "name": "get_current_weather",
      "arguments": "{\"location\":\"Boston, MA\",\"unit\":\"celsius\"}",
      "status": "completed"
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "reasoning": {
    "effort": null,
    "summary": null
  },
  "store": true,
  "temperature": 1.0,
  "text": {
    "format": {
      "type": "text"
    }
  },
  "tool_choice": "auto",
  "tools": [
    {
      "type": "function",
      "description": "Get the current weather in a given location",
      "name": "get_current_weather",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "The city and state, e.g. San Francisco, CA"
          },
          "unit": {
            "type": "string",
            "enum": [
              "celsius",
              "fahrenheit"
            ]
          }
        },
        "required": [
          "location",
          "unit"
        ]
      },
      "strict": true
    }
  ],
  "top_p": 1.0,
  "truncation": "disabled",
  "usage": {
    "input_tokens": 291,
    "output_tokens": 23,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 314
  },
  "user": null,
  "metadata": {}
}
```

### 图像输入

```http
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.4",
    "input": [
      {
        "role": "user",
        "content": [
          {"type": "input_text", "text": "what is in this image?"},
          {
            "type": "input_image",
            "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg"
          }
        ]
      }
    ]
  }'
```

#### 响应

```json
{
  "id": "resp_67ccd3a9da748190baa7f1570fe91ac604becb25c45c1d41",
  "object": "response",
  "created_at": 1741476777,
  "status": "completed",
  "completed_at": 1741476778,
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "model": "gpt-5.4",
  "output": [
    {
      "type": "message",
      "id": "msg_67ccd3acc8d48190a77525dc6de64b4104becb25c45c1d41",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "The image depicts a scenic landscape with a wooden boardwalk or pathway leading through lush, green grass under a blue sky with some clouds. The setting suggests a peaceful natural area, possibly a park or nature reserve. There are trees and shrubs in the background.",
          "annotations": []
        }
      ]
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "reasoning": {
    "effort": null,
    "summary": null
  },
  "store": true,
  "temperature": 1.0,
  "text": {
    "format": {
      "type": "text"
    }
  },
  "tool_choice": "auto",
  "tools": [],
  "top_p": 1.0,
  "truncation": "disabled",
  "usage": {
    "input_tokens": 328,
    "input_tokens_details": {
      "cached_tokens": 0,
      "cache_write_tokens": 0
    },
    "output_tokens": 52,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 380
  },
  "user": null,
  "metadata": {}
}
```

### 推理

```http
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "o3-mini",
    "input": "How much wood would a woodchuck chuck?",
    "reasoning": {
      "effort": "high"
    }
  }'
```

#### 响应

```json
{
  "id": "resp_67ccd7eca01881908ff0b5146584e408072912b2993db808",
  "object": "response",
  "created_at": 1741477868,
  "status": "completed",
  "completed_at": 1741477869,
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "model": "o1-2024-12-17",
  "output": [
    {
      "type": "message",
      "id": "msg_67ccd7f7b5848190a6f3e95d809f6b44072912b2993db808",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "The classic tongue twister...",
          "annotations": []
        }
      ]
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "reasoning": {
    "effort": "high",
    "summary": null
  },
  "store": true,
  "temperature": 1.0,
  "text": {
    "format": {
      "type": "text"
    }
  },
  "tool_choice": "auto",
  "tools": [],
  "top_p": 1.0,
  "truncation": "disabled",
  "usage": {
    "input_tokens": 81,
    "input_tokens_details": {
      "cached_tokens": 0,
      "cache_write_tokens": 0
    },
    "output_tokens": 1035,
    "output_tokens_details": {
      "reasoning_tokens": 832
    },
    "total_tokens": 1116
  },
  "user": null,
  "metadata": {}
}
```

### 流式传输

```http
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.4",
    "instructions": "You are a helpful assistant.",
    "input": "Hello!",
    "stream": true
  }'
```

#### 响应

```json
event: response.created
data: {"type":"response.created","response":{"id":"resp_67c9fdcecf488190bdd9a0409de3a1ec07b8b0ad4e5eb654","object":"response","created_at":1741290958,"status":"in_progress","error":null,"incomplete_details":null,"instructions":"You are a helpful assistant.","max_output_tokens":null,"model":"gpt-5.4","output":[],"parallel_tool_calls":true,"previous_response_id":null,"reasoning":{"effort":null,"summary":null},"store":true,"temperature":1.0,"text":{"format":{"type":"text"}},"tool_choice":"auto","tools":[],"top_p":1.0,"truncation":"disabled","usage":null,"user":null,"metadata":{}}}

event: response.in_progress
data: {"type":"response.in_progress","response":{"id":"resp_67c9fdcecf488190bdd9a0409de3a1ec07b8b0ad4e5eb654","object":"response","created_at":1741290958,"status":"in_progress","error":null,"incomplete_details":null,"instructions":"You are a helpful assistant.","max_output_tokens":null,"model":"gpt-5.4","output":[],"parallel_tool_calls":true,"previous_response_id":null,"reasoning":{"effort":null,"summary":null},"store":true,"temperature":1.0,"text":{"format":{"type":"text"}},"tool_choice":"auto","tools":[],"top_p":1.0,"truncation":"disabled","usage":null,"user":null,"metadata":{}}}

event: response.output_item.added
data: {"type":"response.output_item.added","output_index":0,"item":{"id":"msg_67c9fdcf37fc8190ba82116e33fb28c507b8b0ad4e5eb654","type":"message","status":"in_progress","role":"assistant","content":[]}}

event: response.content_part.added
data: {"type":"response.content_part.added","item_id":"msg_67c9fdcf37fc8190ba82116e33fb28c507b8b0ad4e5eb654","output_index":0,"content_index":0,"part":{"type":"output_text","text":"","annotations":[]}}

event: response.output_text.delta
data: {"type":"response.output_text.delta","item_id":"msg_67c9fdcf37fc8190ba82116e33fb28c507b8b0ad4e5eb654","output_index":0,"content_index":0,"delta":"Hi"}

...

event: response.output_text.done
data: {"type":"response.output_text.done","item_id":"msg_67c9fdcf37fc8190ba82116e33fb28c507b8b0ad4e5eb654","output_index":0,"content_index":0,"text":"Hi there! How can I assist you today?"}

event: response.content_part.done
data: {"type":"response.content_part.done","item_id":"msg_67c9fdcf37fc8190ba82116e33fb28c507b8b0ad4e5eb654","output_index":0,"content_index":0,"part":{"type":"output_text","text":"Hi there! How can I assist you today?","annotations":[]}}

event: response.output_item.done
data: {"type":"response.output_item.done","output_index":0,"item":{"id":"msg_67c9fdcf37fc8190ba82116e33fb28c507b8b0ad4e5eb654","type":"message","status":"completed","role":"assistant","content":[{"type":"output_text","text":"Hi there! How can I assist you today?","annotations":[]}]}}

event: response.completed
data: {"type":"response.completed","response":{"id":"resp_67c9fdcecf488190bdd9a0409de3a1ec07b8b0ad4e5eb654","object":"response","created_at":1741290958,"status":"completed","error":null,"incomplete_details":null,"instructions":"You are a helpful assistant.","max_output_tokens":null,"model":"gpt-5.4","output":[{"id":"msg_67c9fdcf37fc8190ba82116e33fb28c507b8b0ad4e5eb654","type":"message","status":"completed","role":"assistant","content":[{"type":"output_text","text":"Hi there! How can I assist you today?","annotations":[]}]}],"parallel_tool_calls":true,"previous_response_id":null,"reasoning":{"effort":null,"summary":null},"store":true,"temperature":1.0,"text":{"format":{"type":"text"}},"tool_choice":"auto","tools":[],"top_p":1.0,"truncation":"disabled","usage":{"input_tokens":37,"output_tokens":11,"output_tokens_details":{"reasoning_tokens":0},"total_tokens":48},"user":null,"metadata":{}}}
```

### 文本输入

```http
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.4",
    "input": "Tell me a three sentence bedtime story about a unicorn."
  }'
```

#### 响应

```json
{
  "id": "resp_67ccd2bed1ec8190b14f964abc0542670bb6a6b452d3795b",
  "object": "response",
  "created_at": 1741476542,
  "status": "completed",
  "completed_at": 1741476543,
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "model": "gpt-5.4",
  "output": [
    {
      "type": "message",
      "id": "msg_67ccd2bf17f0819081ff3bb2cf6508e60bb6a6b452d3795b",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "In a peaceful grove beneath a silver moon, a unicorn named Lumina discovered a hidden pool that reflected the stars. As she dipped her horn into the water, the pool began to shimmer, revealing a pathway to a magical realm of endless night skies. Filled with wonder, Lumina whispered a wish for all who dream to find their own hidden magic, and as she glanced back, her hoofprints sparkled like stardust.",
          "annotations": []
        }
      ]
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "reasoning": {
    "effort": null,
    "summary": null
  },
  "store": true,
  "temperature": 1.0,
  "text": {
    "format": {
      "type": "text"
    }
  },
  "tool_choice": "auto",
  "tools": [],
  "top_p": 1.0,
  "truncation": "disabled",
  "usage": {
    "input_tokens": 36,
    "input_tokens_details": {
      "cached_tokens": 0,
      "cache_write_tokens": 0
    },
    "output_tokens": 87,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 123
  },
  "user": null,
  "metadata": {}
}
```

### 网页搜索

```http
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.4",
    "tools": [{ "type": "web_search_preview" }],
    "input": "What was a positive news story from today?"
  }'
```

#### 响应

```json
{
  "id": "resp_67ccf18ef5fc8190b16dbee19bc54e5f087bb177ab789d5c",
  "object": "response",
  "created_at": 1741484430,
  "status": "completed",
  "completed_at": 1741484431,
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "model": "gpt-5.4",
  "output": [
    {
      "type": "web_search_call",
      "id": "ws_67ccf18f64008190a39b619f4c8455ef087bb177ab789d5c",
      "status": "completed"
    },
    {
      "type": "message",
      "id": "msg_67ccf190ca3881909d433c50b1f6357e087bb177ab789d5c",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "As of today, March 9, 2025, one notable positive news story...",
          "annotations": [
            {
              "type": "url_citation",
              "start_index": 442,
              "end_index": 557,
              "url": "https://.../?utm_source=chatgpt.com",
              "title": "..."
            },
            {
              "type": "url_citation",
              "start_index": 962,
              "end_index": 1077,
              "url": "https://.../?utm_source=chatgpt.com",
              "title": "..."
            },
            {
              "type": "url_citation",
              "start_index": 1336,
              "end_index": 1451,
              "url": "https://.../?utm_source=chatgpt.com",
              "title": "..."
            }
          ]
        }
      ]
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "reasoning": {
    "effort": null,
    "summary": null
  },
  "store": true,
  "temperature": 1.0,
  "text": {
    "format": {
      "type": "text"
    }
  },
  "tool_choice": "auto",
  "tools": [
    {
      "type": "web_search_preview",
      "domains": [],
      "search_context_size": "medium",
      "user_location": {
        "type": "approximate",
        "city": null,
        "country": "US",
        "region": null,
        "timezone": null
      }
    }
  ],
  "top_p": 1.0,
  "truncation": "disabled",
  "usage": {
    "input_tokens": 328,
    "input_tokens_details": {
      "cached_tokens": 0,
      "cache_write_tokens": 0
    },
    "output_tokens": 356,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 684
  },
  "user": null,
  "metadata": {}
}
```
