> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。许多文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 获取模型响应

**get** `/responses/{response_id}`

使用给定 ID 检索模型响应。

### 路径参数

- `response_id: string`

### 查询参数

- `include: optional array of ResponseIncludable`

  要在响应中额外包含的字段。参见 `include`
  上方创建 Response 的参数以了解更多信息。

  - `"file_search_call.results"`

  - `"web_search_call.results"`

  - `"web_search_call.action.sources"`

  - `"message.input_image.image_url"`

  - `"computer_call_output.output.image_url"`

  - `"code_interpreter_call.outputs"`

  - `"reasoning.encrypted_content"`

  - `"message.output_text.logprobs"`

- `include_obfuscation: optional boolean`

  当为 true 时，将启用流混淆。流混淆会向
  添加随机字符到 `obfuscation` 流式增量事件的字段上
  以归一化负载大小，作为对某些侧信道攻击的缓解措施
  这些混淆字段默认包含在内，但会给数据流增加
  少量开销。你可以将
  `include_obfuscation` 设为 false 以优化带宽，如果你信任
  你的应用与OpenAI API之间的网络链路。

- `starting_after: optional number`

  开始流式传输之后所发生事件的序列号。

- `stream: optional false`

  如果设为 true，模型响应数据将在生成时
  通过 [服务器发送事件](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format).
  流式传输到客户端。参见 [下方的流式传输章节](/docs/api-reference/responses-streaming)
  以了解更多信息。

  - `false`

### 返回

- `Response object { id, created_at, error, 32 more }`

  - `id: string`

    此响应的唯一标识符。

  - `created_at: number`

    此响应创建时的 Unix 时间戳（以秒为单位）。

  - `error: ResponseError or null`

    模型未能生成响应时返回的错误对象。

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

      错误的人类可读描述。

  - `incomplete_details: object { reason }  or null`

    关于响应不完整的详细信息。

    - `reason: optional "max_output_tokens" or "content_filter"`

      响应不完整的原因。

      - `"max_output_tokens"`

      - `"content_filter"`

  - `instructions: string or array of EasyInputMessage or object { content, role, status, type }  or ResponseOutputMessage or 29 more or null`

    插入到模型上下文中的系统（或开发者）消息。

    当与 `previous_response_id`，一起使用时，之前
    响应中的指令不会延续到下一个响应。这样可以轻松
    在新响应中替换系统（或开发者）消息。

    - `string`

      模型的文本输入，等同于角色为
      `developer` 的文本输入。

    - `InputItemList = array of EasyInputMessage or object { content, role, status, type }  or ResponseOutputMessage or 29 more`

      一个或多个输入项的列表，包含
      不同的内容类型。

      - `EasyInputMessage object { content, role, phase, type }`

        模型的角色消息输入，其角色指示指令遵循
        层级。使用 `developer` 或 `system` 角色给出的指令
        优先于通过 `user` 角色提供的指令。具有
        `assistant` 角色的消息被假定为之前由模型生成，
        即先前交互的结果。

        - `content: string or ResponseInputMessageContentList`

          提供给模型的文本、图像或音频输入，用于生成响应。
          也可以包含先前助手的响应。

          - `TextInput = string`

            模型的文本输入。

          - `ResponseInputMessageContentList = array of ResponseInputContent`

            一个或多个输入项的列表，提供给模型，包含不同类型的内容
            类型。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              模型的文本输入。

              - `text: string`

                模型的文本输入。

              - `type: "input_text"`

                输入项的类型。始终 `input_text`.

                - `"input_text"`

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的确切结束位置。断点继承自请求的 `prompt_cache_options.ttl`；边界不会取整到标记块。

                - `mode: "explicit"`

                  断点模式。始终 `explicit`.

                  - `"explicit"`

            - `ResponseInputImage object { detail, type, file_id, 2 more }`

              发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

              - `detail: ImageDetail`

                发送给模型的图像的细节级别。可选项为 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

                - `"low"`

                - `"high"`

                - `"auto"`

                - `"original"`

              - `type: "input_image"`

                输入项的类型。始终 `input_image`.

                - `"input_image"`

              - `file_id: optional string or null`

                要发送给模型的文件的 ID。

              - `image_url: optional string or null`

                发送给模型的图片 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图片。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的确切结束位置。断点继承自请求的 `prompt_cache_options.ttl`；边界不会取整到标记块。

                - `mode: "explicit"`

                  断点模式。始终 `explicit`.

                  - `"explicit"`

            - `ResponseInputFile object { type, detail, file_data, 4 more }`

              发送给模型的文件输入。

              - `type: "input_file"`

                输入项的类型。始终 `input_file`.

                - `"input_file"`

              - `detail: optional "auto" or "low" or "high"`

                发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本模型， `auto` 使用高质量渲染，这可能会增加输入 token 的使用量。使用 `low` 以降低渲染成本，或使用 `high` 以更高品质渲染文件。默认为 `auto`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `file_data: optional string`

                发送给模型的文件内容。

              - `file_id: optional string or null`

                要发送给模型的文件的 ID。

              - `file_url: optional string`

                发送给模型的文件的 URL。

              - `filename: optional string`

                发送给模型的文件的名称。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的确切结束位置。断点继承自请求的 `prompt_cache_options.ttl`；边界不会取整到标记块。

                - `mode: "explicit"`

                  断点模式。始终 `explicit`.

                  - `"explicit"`

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色。可以是 `user`, `assistant`, `system`，或
          `developer`.

          - `"user"`

          - `"assistant"`

          - `"system"`

          - `"developer"`

        - `phase: optional "commentary" or "final_answer" or null`

          将 `assistant` 消息标记为中间评论（`commentary`）或最终答案（`final_answer`).
          对于像 `gpt-5.3-codex` 及更高版本的模型，在发送后续请求时，请保留并重新发送
          到所有助手消息上——丢弃它可能会降低性能。不用于用户消息。

          - `"commentary"`

          - `"final_answer"`

        - `type: optional "message"`

          消息输入的类型。始终为 `message`.

          - `"message"`

      - `Message object { content, role, status, type }`

        模型的角色消息输入，其角色指示指令遵循
        层级。使用 `developer` 或 `system` 角色给出的指令
        优先于通过 `user` 的文本输入。

        - `content: ResponseInputMessageContentList`

          一个或多个输入项的列表，提供给模型，包含不同类型的内容
          类型。

        - `role: "user" or "system" or "developer"`

          消息输入的角色。可以是 `user`, `system`，或 `developer`.

          - `"user"`

          - `"system"`

          - `"developer"`

        - `status: optional "in_progress" or "completed" or "incomplete"`

          项目的状态。可以是 `in_progress`, `completed`，或
          `incomplete`。当项目通过 API 返回时填充。

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

                  文件引用的类型。始终 `file_citation`.

                  - `"file_citation"`

              - `URLCitation object { end_index, start_index, title, 2 more }`

                用于生成模型响应的 Web 资源的引用。

                - `end_index: number`

                  URL 引用在消息中最后一个字符的索引。

                - `start_index: number`

                  URL 引用在消息中第一个字符的索引。

                - `title: string`

                  Web 资源的标题。

                - `type: "url_citation"`

                  URL 引用的类型。始终 `url_citation`.

                  - `"url_citation"`

                - `url: string`

                  Web 资源的 URL。

              - `ContainerFileCitation object { container_id, end_index, file_id, 3 more }`

                用于生成模型响应的容器文件的引用。

                - `container_id: string`

                  容器文件的 ID。

                - `end_index: number`

                  容器文件引用在消息中最后一个字符的索引。

                - `file_id: string`

                  文件的 ID。

                - `filename: string`

                  所引用容器文件的文件名。

                - `start_index: number`

                  消息中容器文件引用的首字符索引。

                - `type: "container_file_citation"`

                  容器文件引用的类型。始终为 `container_file_citation`.

                  - `"container_file_citation"`

              - `FilePath object { file_id, index, type }`

                文件路径。

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

            模型的拒绝内容。

            - `refusal: string`

              模型的拒绝解释。

            - `type: "refusal"`

              拒绝的类型。始终为 `refusal`.

              - `"refusal"`

        - `role: "assistant"`

          输出消息的角色。始终 `assistant`.

          - `"assistant"`

        - `status: "in_progress" or "completed" or "incomplete"`

          消息输入的状态。取值为 `in_progress`, `completed`，或
          `incomplete`。当输入项通过 API 返回时填充。

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

        - `type: "message"`

          输出消息的类型。始终 `message`.

          - `"message"`

        - `phase: optional "commentary" or "final_answer" or null`

          将 `assistant` 消息标记为中间评论（`commentary`）或最终答案（`final_answer`).
          对于像 `gpt-5.3-codex` 及更高版本的模型，在发送后续请求时，请保留并重新发送
          到所有助手消息上——丢弃它可能会降低性能。不用于用户消息。

          - `"commentary"`

          - `"final_answer"`

      - `FileSearchCall object { id, queries, status, 2 more }`

        文件搜索 工具调用的结果。参见
        [文件搜索 指南](/docs/guides/tools-file-search) 以了解更多信息。

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

          文件搜索 工具调用的类型。始终 `file_search_call`.

          - `"file_search_call"`

        - `results: optional array of object { attributes, file_id, filename, 2 more }  or null`

          文件搜索工具调用的结果。

          - `attributes: optional map[string or number or boolean] or null`

            可附加到对象上的16组键值对。这可以
            用于以结构化
            格式存储关于对象的附加信息，并通过API或仪表板查询对象。键是字符串
            ，最大长度为64个字符。值是字符串，最大
            长度为512个字符、布尔值或数字。

            - `string`

            - `number`

            - `boolean`

          - `file_id: optional string`

            文件的唯一标识ID。

          - `filename: optional string`

            文件的名称。

          - `score: optional number`

            文件的相关性评分——一个介于0和1之间的值。

          - `text: optional string`

            从文件中检索到的文本。

      - `ComputerCall object { id, call_id, pending_safety_checks, 4 more }`

        对计算机使用工具的工具调用。参见
        [计算机使用指南](/docs/guides/tools-computer-use) 以了解更多信息。

        - `id: string`

          计算机调用的唯一标识ID。

        - `call_id: string`

          用于响应工具调用输出时的标识符。

        - `pending_safety_checks: array of object { id, code, message }`

          计算机调用的待处理安全检查。

          - `id: string`

            待处理安全检查的ID。

          - `code: optional string or null`

            待处理安全检查的类型。

          - `message: optional string or null`

            关于待处理安全检查的详细信息。

        - `status: "in_progress" or "completed" or "incomplete"`

          项目的状态。以下之一： `in_progress`, `completed`，或
          `incomplete`。当项目通过 API 返回时填充。

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

        - `type: "computer_call"`

          计算机调用的类型。始终为 `computer_call`.

          - `"computer_call"`

        - `action: optional ComputerAction`

          一次点击操作。

          - `Click object { button, type, x, 2 more }`

            一次点击操作。

            - `button: "left" or "right" or "wheel" or 2 more`

              指示点击期间按下了哪个鼠标按钮。其一为 `left`, `right`, `wheel`, `back`，或 `forward`.

              - `"left"`

              - `"right"`

              - `"wheel"`

              - `"back"`

              - `"forward"`

            - `type: "click"`

              指定事件类型。对于点击操作，此属性始终为 `click`.

              - `"click"`

            - `x: number`

              发生点击处的x坐标。

            - `y: number`

              发生点击处的y坐标。

            - `keys: optional array of string or null`

              点击时按住按键。

          - `DoubleClick object { keys, type, x, y }`

            一次双击操作。

            - `keys: array of string or null`

              双击时按住按键。

            - `type: "double_click"`

              指定事件类型。对于双击操作，此属性始终设置为 `double_click`.

              - `"double_click"`

            - `x: number`

              发生双击处的x坐标。

            - `y: number`

              发生双击处的y坐标。

          - `Drag object { path, type, keys }`

            一次拖拽操作。

            - `path: array of object { x, y }`

              表示拖拽操作路径的坐标数组。坐标将显示为对象数组，例如

              ```
              [
                { x: 100, y: 200 },
                { x: 200, y: 300 }
              ]
              ```

              - `x: number`

                x坐标。

              - `y: number`

                y坐标。

            - `type: "drag"`

              指定事件类型。对于拖拽操作，此属性始终设置为 `drag`.

              - `"drag"`

            - `keys: optional array of string or null`

              拖拽鼠标时按住按键。

          - `Keypress object { keys, type }`

            模型希望执行的一组按键操作。

            - `keys: array of string`

              模型请求按下的按键组合。这是一个字符串数组，每个字符串代表一个键。

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

            屏幕截图操作。

            - `type: "screenshot"`

              指定事件类型。对于屏幕截图操作，此属性始终设置为 `screenshot`.

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

              滚动发生的 x 坐标。

            - `y: number`

              滚动发生的 y 坐标。

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

          扁平化的批量操作，用于 `computer_use`. 每个操作包含一个
          `type` 鉴别器和操作特有字段。

          - `Click object { button, type, x, 2 more }`

            一次点击操作。

          - `DoubleClick object { keys, type, x, y }`

            一次双击操作。

          - `Drag object { path, type, keys }`

            一次拖拽操作。

          - `Keypress object { keys, type }`

            模型希望执行的一组按键操作。

          - `Move object { type, x, y, keys }`

            鼠标移动操作。

          - `Screenshot object { type }`

            屏幕截图操作。

          - `Scroll object { scroll_x, scroll_y, type, 3 more }`

            滚动操作。

          - `Type object { text, type }`

            输入文本的操作。

          - `Wait object { type }`

            等待操作。

      - `ComputerCallOutput object { call_id, output, type, 3 more }`

        计算机工具调用的输出。

        - `call_id: string`

          产生输出的计算机工具调用的 ID。

        - `output: ResponseComputerToolCallOutputScreenshot`

          用于计算机使用工具的计算机截图图像。

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

          API 报告且开发者已确认的安全检查。

          - `id: string`

            待处理安全检查的ID。

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

        网页搜索 工具调用的结果。参见
        [网页搜索 指南](/docs/guides/tools-web-search) 以了解更多信息。

        - `id: string`

          网页搜索 工具调用的唯一 ID。

        - `action: object { type, queries, query, sources }  or object { type, url }  or object { pattern, type, url }`

          描述此网页搜索调用中采取的具体操作的对象。
          包括模型如何使用网络的详细信息（搜索、打开页面、页内查找）。

          - `Search object { type, queries, query, sources }`

            操作类型“搜索” - 执行网页搜索查询。

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

            操作类型"open_page" - 打开搜索结果中的特定 URL。

            - `type: "open_page"`

              操作类型。

              - `"open_page"`

            - `url: optional string or null`

              模型打开的 URL。

          - `FindInPage object { pattern, type, url }`

            操作类型"find_in_page"：在已加载页面中搜索模式。

            - `pattern: string`

              要在页面内搜索的模式或文本。

            - `type: "find_in_page"`

              操作类型。

              - `"find_in_page"`

            - `url: string`

              搜索该模式所针对页面的 URL。

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

        运行函数的工具调用。参见
        [函数调用指南](/docs/guides/function-calling) 以了解更多信息。

        - `arguments: string`

          要传递给函数的参数的 JSON 字符串。

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

              产生此工具调用的程序项调用 ID。

            - `type: "program"`

              - `"program"`

        - `namespace: optional string`

          要运行的函数命名空间。

        - `status: optional "in_progress" or "completed" or "incomplete"`

          项目的状态。以下之一： `in_progress`, `completed`，或
          `incomplete`。当项目通过 API 返回时填充。

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

            函数工具调用的内容输出数组（文本、图像、文件）。

            - `ResponseInputTextContent object { text, type, prompt_cache_breakpoint }`

              模型的文本输入。

              - `text: string`

                模型的文本输入。

              - `type: "input_text"`

                输入项的类型。始终 `input_text`.

                - `"input_text"`

              - `prompt_cache_breakpoint: optional object { mode }  or null`

                标记可复用提示前缀的确切结束位置。断点继承自请求的 `prompt_cache_options.ttl`；边界不会取整到标记块。

                - `mode: "explicit"`

                  断点模式。始终 `explicit`.

                  - `"explicit"`

            - `ResponseInputImageContent object { type, detail, file_id, 2 more }`

              发送给模型的图像输入。了解 [图像输入](/docs/guides/vision)

              - `type: "input_image"`

                输入项的类型。始终 `input_image`.

                - `"input_image"`

              - `detail: optional ImageDetail or null`

                发送给模型的图像的细节级别。可选项为 `high`, `low`, `auto`，或 `original`。默认值为 `auto`.

              - `file_id: optional string or null`

                要发送给模型的文件的 ID。

              - `image_url: optional string or null`

                发送给模型的图片 URL。可以是完全限定的 URL，也可以是 data URL 中 base64 编码的图片。

              - `prompt_cache_breakpoint: optional object { mode }  or null`

                标记可复用提示前缀的确切结束位置。断点继承自请求的 `prompt_cache_options.ttl`；边界不会取整到标记块。

                - `mode: "explicit"`

                  断点模式。始终 `explicit`.

                  - `"explicit"`

            - `ResponseInputFileContent object { type, detail, file_data, 4 more }`

              发送给模型的文件输入。

              - `type: "input_file"`

                输入项的类型。始终 `input_file`.

                - `"input_file"`

              - `detail: optional "auto" or "low" or "high"`

                发送给模型的文件的细节级别。使用 `auto` 让系统选择细节级别；对于 GPT-5.6 及更高版本模型， `auto` 使用高质量渲染，这可能会增加输入 token 的使用量。使用 `low` 以降低渲染成本，或使用 `high` 以更高品质渲染文件。默认为 `auto`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `file_data: optional string or null`

                要发送给模型的文件的 base64 编码数据。

              - `file_id: optional string or null`

                要发送给模型的文件的 ID。

              - `file_url: optional string or null`

                发送给模型的文件的 URL。

              - `filename: optional string or null`

                发送给模型的文件的名称。

              - `prompt_cache_breakpoint: optional object { mode }  or null`

                标记可复用提示前缀的确切结束位置。断点继承自请求的 `prompt_cache_options.ttl`；边界不会取整到标记块。

                - `mode: "explicit"`

                  断点模式。始终 `explicit`.

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

              产生此工具调用的程序项调用 ID。

            - `type: "program"`

              调用方类型。始终为 `program`.

              - `"program"`

        - `name: optional string or null`

          产生输出的工具名称。

        - `namespace: optional string or null`

          产生输出的工具的命名空间。

        - `status: optional "in_progress" or "completed" or "incomplete" or null`

          项目的状态。以下之一： `in_progress`, `completed`，或 `incomplete`。当项目通过 API 返回时填充。

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

            在你自己的代码中定义一个模型可以选择调用的函数。了解更多 [函数调用](https://platform.openai.com/docs/guides/function-calling).

            - `name: string`

              要调用的函数名称。

            - `parameters: map[unknown] or null`

              描述函数参数的 JSON schema 对象。

            - `strict: boolean or null`

              是否对此函数工具强制执行严格的参数验证。

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

              描述此函数字符串输出中编码的 JSON 值的 JSON schema 对象。

          - `FileSearch object { type, vector_store_ids, filters, 2 more }`

            一种从上传文件中搜索相关内容工具。了解有关 [文件搜索 工具](https://platform.openai.com/docs/guides/tools-file-search).

            - `type: "file_search"`

              文件搜索 工具的类型。始终为 `file_search`.

              - `"file_search"`

            - `vector_store_ids: array of string`

              要搜索的向量存储的 ID。

            - `filters: optional ComparisonFilter or CompoundFilter or null`

              要应用的过滤器。

              - `ComparisonFilter object { key, type, value }`

                用于使用定义的比较操作将指定的属性键与给定值进行比较的过滤器。

                - `key: string`

                  要与值进行比较的键。

                - `type: "eq" or "ne" or "gt" or 5 more`

                  指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

                  - `eq`: 等于
                  - `ne`: 不等于
                  - `gt`: 大于
                  - `gte`: 大于或等于
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

                  与属性键进行比较的值；支持字符串、数字或布尔类型。

                  - `string`

                  - `number`

                  - `boolean`

                  - `array of string or number`

                    - `string`

                    - `number`

              - `CompoundFilter object { filters, type }`

                组合多个过滤器，使用 `and` 或 `or`.

                - `filters: array of ComparisonFilter or unknown`

                  要组合的过滤器数组。项目可以是 `ComparisonFilter` 或 `CompoundFilter`.

                  - `ComparisonFilter object { key, type, value }`

                    用于使用定义的比较操作将指定的属性键与给定值进行比较的过滤器。

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

                控制混合搜索时，倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

                - `embedding_weight: number`

                  嵌入在倒数排名融合中的权重。

                - `text_weight: number`

                  文本在倒数排名融合中的权重。

              - `ranker: optional "auto" or "default-2024-11-15"`

                用于文件搜索的排名器。

                - `"auto"`

                - `"default-2024-11-15"`

              - `score_threshold: optional number`

                文件搜索的得分阈值，一个介于 0 和 1 之间的数字。接近 1 的数字将尝试仅返回最相关的结果，但可能返回较少的结果。

          - `Computer object { type }`

            一种控制虚拟计算机的工具。了解更多关于 [计算机工具](https://platform.openai.com/docs/guides/tools-computer-use).

            - `type: "computer"`

              计算机工具的类型。始终 `computer`.

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

              计算机使用工具的类型。始终 `computer_use_preview`.

              - `"computer_use_preview"`

          - `WebSearch object { type, external_web_access, filters, 2 more }`

            搜索互联网以查找与提示相关的来源。了解更多关于
            [网页搜索 工具](/docs/guides/tools-web-search).

            - `type: "web_search" or "web_search_2025_08_26"`

              网页搜索 工具的类型。其中之一 `web_search` 或 `web_search_2025_08_26`.

              - `"web_search"`

              - `"web_search_2025_08_26"`

            - `external_web_access: optional boolean`

              为 网页搜索 允许实时互联网访问。省略时默认为 true。为 false 时，网页搜索 工具以离线/仅缓存模式运行，不会获取新的外部内容。

            - `filters: optional object { allowed_domains }  or null`

              搜索的过滤器。

              - `allowed_domains: optional array of string or null`

                搜索允许的域名。如果未提供，则允许所有域名。
                提供的域名的子域也允许。

                示例： `["pubmed.ncbi.nlm.nih.gov"]`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间使用量的高级指导。其中之一 `low`, `medium`，或 `high`. `medium` 是默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { city, country, region, 2 more }  or null`

              用户的大致位置。

              - `city: optional string or null`

                用户的城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 的用户，例如。 `US`.

              - `region: optional string or null`

                用户的地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 的用户，例如。 `America/Los_Angeles`.

              - `type: optional "approximate"`

                位置近似类型的取值。始终为 `approximate`.

                - `"approximate"`

          - `Mcp object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol
            (MCP) 服务器，为模型提供额外的工具访问权限。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中标识该服务器。

            - `type: "mcp"`

              MCP 工具的类型。始终为 `mcp`.

              - `"mcp"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

              允许的工具名称列表，或一个过滤器对象。

              - `McpAllowedTools = array of string`

                允许的工具名称字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许哪些工具的过滤器对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果某个
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，则将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
              自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
              必须处理 OAuth 授权流程，并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
              `server_url`, `connector_id`，或 `tunnel_id` 其中之一。详细了解
              服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

              当前支持的 `connector_id` 值包括：

              - Dropbox： `connector_dropbox`
              - Gmail： `connector_gmail`
              - Google 日历： `connector_googlecalendar`
              - Google Drive： `connector_googledrive`
              - Microsoft Teams： `connector_microsoftteams`
              - Outlook 日历： `connector_outlookcalendar`
              - Outlook 邮件： `connector_outlookemail`
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

              此 MCP 工具是否已延迟并通过工具搜索发现。

            - `headers: optional map[string] or null`

              要发送到 MCP 服务器的可选 HTTP 头。用于认证
              或其他目的。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器的哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器的哪些工具需要审批。可以是
                `always`, `never`，或与需要审批的工具关联的筛选器对象
                。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤器对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或为只读。如果某个
                    MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，则将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤器对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或为只读。如果某个
                    MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，则将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定单一审批策略。可选值为 `always` 或
                `never`。当设置为 `always`，则所有工具都需要审批。当
                设为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供。

            - `tunnel_id: optional string`

              要使用的安全 MCP 隧道 ID，而不是直接服务器 URL。以下之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

          - `CodeInterpreter object { container, type, allowed_callers }`

            一种运行 Python 代码以帮助生成提示响应的工具。

            - `container: string or object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器。可以是容器 ID 或一个对象，该对象
              指定上传的文件 ID 以供你的代码使用，以及一个
              可选的 `memory_limit` 设置。

              - `string`

                容器 ID。

              - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

                代码解释器容器的配置。可以选择指定要运行代码的文件的 ID。

                - `type: "auto"`

                  始终 `auto`.

                  - `"auto"`

                - `file_ids: optional array of string`

                  可选的上传文件列表，以供你的代码使用。

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

                      仅允许对指定域名进行出站网络访问。始终 `allowlist`.

                      - `"allowlist"`

                    - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                      用于允许列表域名的可选域名范围密钥。

                      - `domain: string`

                        与该密钥关联的域名。

                      - `name: string`

                        为该域名注入的密钥名称。

                      - `value: string`

                        为该域名注入的密钥值。

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

              设置生成图像的背景。取值之一为 `transparent`,
              `opaque`，或 `auto`。透明背景适用于
              支持的 GPT 图像模型。对于 `gpt-image-2` 和
              `gpt-image-2-2026-04-21`，此支持处于预览阶段。使用
              `transparent`，时，请将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

              - `"transparent"`

              - `"opaque"`

              - `"auto"`

            - `input_fidelity: optional "high" or "low" or null`

              控制模型在匹配输入图像的风格和特征（尤其是面部特征）上付出的努力程度。此参数仅受 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本模型支持，不受 `gpt-image-1-mini`。支持。支持 `high` 和 `low`。默认值为 `low`.

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

              要使用的图像生成模型。之一 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
              `gpt-image-1`.

              - `string`

              - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

                要使用的图像生成模型。之一 `gpt-image-1`,
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

              生成图像的输出格式。之一 `png`, `webp`，或
              `jpeg`。默认值： `png`.

              - `"png"`

              - `"webp"`

              - `"jpeg"`

            - `partial_images: optional number`

              流式模式下生成的部分图像数量，范围从 0（默认值）到 3。

            - `quality: optional "low" or "medium" or "high" or "auto"`

              生成图像的质量。之一 `low`, `medium`, `high`,
              或 `auto`。默认值： `auto`.

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的大小。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，作为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率是实验性的，最大支持分辨率为 `3840x2160`。请求的大小还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，和 `1024x1536` 受 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，使用其中之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用其中之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `string`

              - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

                生成图像的大小。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，作为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率是实验性的，最大支持分辨率为 `3840x2160`。请求的大小还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，和 `1024x1536` 受 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，使用其中之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用其中之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

                  可选的上传文件列表，以供你的代码使用。

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

                  一个可选的技能列表，通过 id 或内联数据引用。

                  - `SkillReference object { skill_id, type, version }`

                    - `skill_id: string`

                      被引用技能的 ID。

                    - `type: "skill_reference"`

                      引用通过 /v1/skills 端点创建的技能。

                      - `"skill_reference"`

                    - `version: optional string`

                      可选的技能版本。使用正整数或 'latest'。省略时使用默认值。

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

                      为此请求定义一个内联技能。

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

                    包含该技能的目录路径。

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

              此工具是否应延迟处理并通过工具搜索发现。

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

                  语法定义的语法。之一为 `lark` 或 `regex`.

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

                  是否应延迟此函数并通过工具搜索发现。

                - `description: optional string or null`

                - `output_schema: optional map[unknown] or null`

                  一个 JSON Schema，描述此函数工具字符串输出中编码的 JSON 值。这不描述内容数组输出。

                - `parameters: optional unknown or null`

                - `strict: optional boolean or null`

                  是否强制执行严格的参数验证。如果省略，Responses 会在 schema 兼容时尝试使用严格验证，否则回退到非严格验证。

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

                  此工具是否应延迟处理并通过工具搜索发现。

                - `description: optional string`

                  自定义工具的可选描述，用于提供更多上下文。

                - `format: optional CustomToolInputFormat`

                  自定义工具的输入格式。默认是无约束文本。

            - `type: "namespace"`

              工具的类型。始终 `namespace`.

              - `"namespace"`

          - `ToolSearch object { type, description, execution, parameters }`

            用于延迟工具的托管或 BYOT 工具搜索配置。

            - `type: "tool_search"`

              工具的类型。始终 `tool_search`.

              - `"tool_search"`

            - `description: optional string or null`

              为客户端执行的工具搜索工具向模型显示的描述。

            - `execution: optional "server" or "client"`

              工具搜索是由服务端还是客户端执行的。

              - `"server"`

              - `"client"`

            - `parameters: optional unknown or null`

              客户端执行的工具搜索工具的参数 schema。

          - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

            此工具搜索网页以获取响应中使用的相关结果。了解更多关于 [网页搜索 工具](https://platform.openai.com/docs/guides/tools-web-search).

            - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

              网页搜索 工具的类型。其中之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

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

                位置近似类型的取值。始终为 `approximate`.

                - `"approximate"`

              - `city: optional string or null`

                用户的城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 的用户，例如。 `US`.

              - `region: optional string or null`

                用户的地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 的用户，例如。 `America/Los_Angeles`.

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

          提供附加工具的角色。仅 `developer` 受支持。

          - `"developer"`

        - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

          在此项中可用的附加工具列表。

          - `Function object { name, parameters, strict, 5 more }`

            在你自己的代码中定义一个模型可以选择调用的函数。了解更多 [函数调用](https://platform.openai.com/docs/guides/function-calling).

            - `name: string`

              要调用的函数名称。

            - `parameters: map[unknown] or null`

              描述函数参数的 JSON schema 对象。

            - `strict: boolean or null`

              是否对此函数工具强制执行严格的参数验证。

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

              描述此函数字符串输出中编码的 JSON 值的 JSON schema 对象。

          - `FileSearch object { type, vector_store_ids, filters, 2 more }`

            一种从上传文件中搜索相关内容工具。了解有关 [文件搜索 工具](https://platform.openai.com/docs/guides/tools-file-search).

            - `type: "file_search"`

              文件搜索 工具的类型。始终为 `file_search`.

              - `"file_search"`

            - `vector_store_ids: array of string`

              要搜索的向量存储的 ID。

            - `filters: optional ComparisonFilter or CompoundFilter or null`

              要应用的过滤器。

              - `ComparisonFilter object { key, type, value }`

                用于使用定义的比较操作将指定的属性键与给定值进行比较的过滤器。

              - `CompoundFilter object { filters, type }`

                组合多个过滤器，使用 `and` 或 `or`.

            - `max_num_results: optional number`

              要返回的最大结果数。此数字应在 1 到 50 之间（含）。

            - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

              搜索的排名选项。

              - `hybrid_search: optional object { embedding_weight, text_weight }`

                控制混合搜索时，倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

                - `embedding_weight: number`

                  嵌入在倒数排名融合中的权重。

                - `text_weight: number`

                  文本在倒数排名融合中的权重。

              - `ranker: optional "auto" or "default-2024-11-15"`

                用于文件搜索的排名器。

                - `"auto"`

                - `"default-2024-11-15"`

              - `score_threshold: optional number`

                文件搜索的得分阈值，一个介于 0 和 1 之间的数字。接近 1 的数字将尝试仅返回最相关的结果，但可能返回较少的结果。

          - `Computer object { type }`

            一种控制虚拟计算机的工具。了解更多关于 [计算机工具](https://platform.openai.com/docs/guides/tools-computer-use).

            - `type: "computer"`

              计算机工具的类型。始终 `computer`.

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

              计算机使用工具的类型。始终 `computer_use_preview`.

              - `"computer_use_preview"`

          - `WebSearch object { type, external_web_access, filters, 2 more }`

            搜索互联网以查找与提示相关的来源。了解更多关于
            [网页搜索 工具](/docs/guides/tools-web-search).

            - `type: "web_search" or "web_search_2025_08_26"`

              网页搜索 工具的类型。其中之一 `web_search` 或 `web_search_2025_08_26`.

              - `"web_search"`

              - `"web_search_2025_08_26"`

            - `external_web_access: optional boolean`

              为 网页搜索 允许实时互联网访问。省略时默认为 true。为 false 时，网页搜索 工具以离线/仅缓存模式运行，不会获取新的外部内容。

            - `filters: optional object { allowed_domains }  or null`

              搜索的过滤器。

              - `allowed_domains: optional array of string or null`

                搜索允许的域名。如果未提供，则允许所有域名。
                提供的域名的子域也允许。

                示例： `["pubmed.ncbi.nlm.nih.gov"]`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间使用量的高级指导。其中之一 `low`, `medium`，或 `high`. `medium` 是默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { city, country, region, 2 more }  or null`

              用户的大致位置。

              - `city: optional string or null`

                用户的城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 的用户，例如。 `US`.

              - `region: optional string or null`

                用户的地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 的用户，例如。 `America/Los_Angeles`.

              - `type: optional "approximate"`

                位置近似类型的取值。始终为 `approximate`.

                - `"approximate"`

          - `Mcp object { server_label, type, allowed_callers, 9 more }`

            通过远程 Model Context Protocol
            (MCP) 服务器，为模型提供额外的工具访问权限。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

            - `server_label: string`

              此 MCP 服务器的标签，用于在工具调用中标识该服务器。

            - `type: "mcp"`

              MCP 工具的类型。始终为 `mcp`.

              - `"mcp"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

              允许的工具名称列表，或一个过滤器对象。

              - `McpAllowedTools = array of string`

                允许的工具名称字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许哪些工具的过滤器对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果某个
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，则将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
              自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
              必须处理 OAuth 授权流程，并在此处提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
              `server_url`, `connector_id`，或 `tunnel_id` 其中之一。详细了解
              服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

              当前支持的 `connector_id` 值包括：

              - Dropbox： `connector_dropbox`
              - Gmail： `connector_gmail`
              - Google 日历： `connector_googlecalendar`
              - Google Drive： `connector_googledrive`
              - Microsoft Teams： `connector_microsoftteams`
              - Outlook 日历： `connector_outlookcalendar`
              - Outlook 邮件： `connector_outlookemail`
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

              此 MCP 工具是否已延迟并通过工具搜索发现。

            - `headers: optional map[string] or null`

              要发送到 MCP 服务器的可选 HTTP 头。用于认证
              或其他目的。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器的哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器的哪些工具需要审批。可以是
                `always`, `never`，或与需要审批的工具关联的筛选器对象
                。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤器对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或为只读。如果某个
                    MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，则将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的过滤器对象。

                  - `read_only: optional boolean`

                    指示工具是否修改数据或为只读。如果某个
                    MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    ，则将匹配此过滤器。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定单一审批策略。可选值为 `always` 或
                `never`。当设置为 `always`，则所有工具都需要审批。当
                设为 `never`，时，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
              `tunnel_id` 必须提供。

            - `tunnel_id: optional string`

              要使用的安全 MCP 隧道 ID，而不是直接服务器 URL。以下之一
              `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

          - `CodeInterpreter object { container, type, allowed_callers }`

            一种运行 Python 代码以帮助生成提示响应的工具。

            - `container: string or object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器。可以是容器 ID 或一个对象，该对象
              指定上传的文件 ID 以供你的代码使用，以及一个
              可选的 `memory_limit` 设置。

              - `string`

                容器 ID。

              - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

                代码解释器容器的配置。可以选择指定要运行代码的文件的 ID。

                - `type: "auto"`

                  始终 `auto`.

                  - `"auto"`

                - `file_ids: optional array of string`

                  可选的上传文件列表，以供你的代码使用。

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

              设置生成图像的背景。取值之一为 `transparent`,
              `opaque`，或 `auto`。透明背景适用于
              支持的 GPT 图像模型。对于 `gpt-image-2` 和
              `gpt-image-2-2026-04-21`，此支持处于预览阶段。使用
              `transparent`，时，请将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

              - `"transparent"`

              - `"opaque"`

              - `"auto"`

            - `input_fidelity: optional "high" or "low" or null`

              控制模型在匹配输入图像的风格和特征（尤其是面部特征）上付出的努力程度。此参数仅受 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本模型支持，不受 `gpt-image-1-mini`。支持。支持 `high` 和 `low`。默认值为 `low`.

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

              要使用的图像生成模型。之一 `gpt-image-1`,
              `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
              `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
              `gpt-image-1`.

              - `string`

              - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

                要使用的图像生成模型。之一 `gpt-image-1`,
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

              生成图像的输出格式。之一 `png`, `webp`，或
              `jpeg`。默认值： `png`.

              - `"png"`

              - `"webp"`

              - `"jpeg"`

            - `partial_images: optional number`

              流式模式下生成的部分图像数量，范围从 0（默认值）到 3。

            - `quality: optional "low" or "medium" or "high" or "auto"`

              生成图像的质量。之一 `low`, `medium`, `high`,
              或 `auto`。默认值： `auto`.

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"auto"`

            - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的大小。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，作为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率是实验性的，最大支持分辨率为 `3840x2160`。请求的大小还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，和 `1024x1536` 受 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，使用其中之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用其中之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `string`

              - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

                生成图像的大小。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，作为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率是实验性的，最大支持分辨率为 `3840x2160`。请求的大小还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，和 `1024x1536` 受 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，使用其中之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用其中之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

              此工具是否应延迟处理并通过工具搜索发现。

            - `description: optional string`

              自定义工具的可选描述，用于提供更多上下文。

            - `format: optional CustomToolInputFormat`

              自定义工具的输入格式。默认是无约束文本。

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

                  是否应延迟此函数并通过工具搜索发现。

                - `description: optional string or null`

                - `output_schema: optional map[unknown] or null`

                  一个 JSON Schema，描述此函数工具字符串输出中编码的 JSON 值。这不描述内容数组输出。

                - `parameters: optional unknown or null`

                - `strict: optional boolean or null`

                  是否强制执行严格的参数验证。如果省略，Responses 会在 schema 兼容时尝试使用严格验证，否则回退到非严格验证。

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

                  此工具是否应延迟处理并通过工具搜索发现。

                - `description: optional string`

                  自定义工具的可选描述，用于提供更多上下文。

                - `format: optional CustomToolInputFormat`

                  自定义工具的输入格式。默认是无约束文本。

            - `type: "namespace"`

              工具的类型。始终 `namespace`.

              - `"namespace"`

          - `ToolSearch object { type, description, execution, parameters }`

            用于延迟工具的托管或 BYOT 工具搜索配置。

            - `type: "tool_search"`

              工具的类型。始终 `tool_search`.

              - `"tool_search"`

            - `description: optional string or null`

              为客户端执行的工具搜索工具向模型显示的描述。

            - `execution: optional "server" or "client"`

              工具搜索是由服务端还是客户端执行的。

              - `"server"`

              - `"client"`

            - `parameters: optional unknown or null`

              客户端执行的工具搜索工具的参数 schema。

          - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

            此工具搜索网页以获取响应中使用的相关结果。了解更多关于 [网页搜索 工具](https://platform.openai.com/docs/guides/tools-web-search).

            - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

              网页搜索 工具的类型。其中之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

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

                位置近似类型的取值。始终为 `approximate`.

                - `"approximate"`

              - `city: optional string or null`

                用户的城市的自由文本输入，例如 `San Francisco`.

              - `country: optional string or null`

                两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 的用户，例如。 `US`.

              - `region: optional string or null`

                用户的地区的自由文本输入，例如 `California`.

              - `timezone: optional string or null`

                该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 的用户，例如。 `America/Los_Angeles`.

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

          此附加工具项的唯一 ID。

      - `Reasoning object { id, summary, type, 3 more }`

        推理模型在生成
        响应时使用的思维链描述。请确保在您的 `input` 中包含这些项目到 Responses API
        如果你手动
        [管理上下文](/docs/guides/conversation-state).

        - `id: string`

          推理内容的唯一标识符。

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

            来自模型的推理文本。

          - `type: "reasoning_text"`

            推理文本的类型。始终为 `reasoning_text`.

            - `"reasoning_text"`

        - `encrypted_content: optional string or null`

          推理项的加密内容。此内容默认填充
          用于由 `POST /v1/responses` 和 WebSocket
          `response.create` 请求返回的推理项。

          当流式传输时，使用完成的推理项及其
          `encrypted_content` 中的 `response.output_item.done` 事件
          在后续请求中。此 `encrypted_content` 中的
          `response.output_item.added` 可能不完整。这一点尤其
          重要，当 `store` 是 `false` 或在使用零数据保留时。

        - `status: optional "in_progress" or "completed" or "incomplete"`

          项目的状态。以下之一： `in_progress`, `completed`，或
          `incomplete`。当项目通过 API 返回时填充。

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

      - `Compaction object { encrypted_content, type, id }`

        由 [`v1/responses/compact` API](/docs/api-reference/responses/compact).

        - `encrypted_content: string`

          压缩摘要的加密内容。

        - `type: "compaction"`

          项目类型。始终为 `compaction`.

          - `"compaction"`

        - `id: optional string or null`

          压缩项目的 ID。

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

          要运行的代码，如果不可用则为 null。

        - `container_id: string`

          用于运行代码的容器 ID。

        - `outputs: array of object { logs, type }  or object { type, url }  or null`

          代码解释器生成的输出，例如日志或图像。
          如果没有可用输出，则为 null。

          - `Logs object { logs, type }`

            代码解释器输出的日志。

            - `logs: string`

              代码解释器输出的日志。

            - `type: "logs"`

              输出类型。始终为 `logs`.

              - `"logs"`

          - `Image object { type, url }`

            代码解释器输出的图像。

            - `type: "image"`

              输出类型。始终为 `image`.

              - `"image"`

            - `url: string`

              代码解释器输出的图像的 URL。

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

            为命令设置的环境变量。

          - `type: "exec"`

            本地 shell 操作的类型。始终为 `exec`.

            - `"exec"`

          - `timeout_ms: optional number or null`

            命令的可选超时时间（毫秒）。

          - `user: optional string or null`

            可选：运行命令的用户。

          - `working_directory: optional string or null`

            可选：运行命令的工作目录。

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

          项目的状态。以下之一： `in_progress`, `completed`，或 `incomplete`.

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

      - `ShellCall object { action, call_id, type, 4 more }`

        表示执行一个或多个 shell 命令请求的工具。

        - `action: object { commands, max_output_length, timeout_ms }`

          描述如何运行工具调用的 shell 命令和限制。

          - `commands: array of string`

            供执行环境运行的有序 shell 命令。

          - `max_output_length: optional number or null`

            从组合的 stdout 和 stderr 输出中捕获的最大 UTF-8 字符数。

          - `timeout_ms: optional number or null`

            允许 shell 命令运行的最大墙钟时间（毫秒）。

        - `call_id: string`

          模型生成的 shell 工具调用的唯一 ID。

        - `type: "shell_call"`

          项目类型。始终为 `shell_call`.

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

              产生此工具调用的程序项调用 ID。

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

          捕获的 stdout 和 stderr 输出块，以及它们相关的结局。

          - `outcome: object { type }  or object { exit_code, type }`

            与此 shell 调用关联的退出或超时结局。

            - `Timeout object { type }`

              表示 shell 调用超过了其配置的时间限制。

              - `type: "timeout"`

                结局类型。始终为 `timeout`.

                - `"timeout"`

            - `Exit object { exit_code, type }`

              表示 shell 命令已完成并返回退出代码。

              - `exit_code: number`

                shell 进程返回的退出代码。

              - `type: "exit"`

                结局类型。始终为 `exit`.

                - `"exit"`

          - `stderr: string`

            为 shell 调用捕获的 stderr 输出。

          - `stdout: string`

            为 shell 调用捕获的 stdout 输出。

        - `type: "shell_call_output"`

          项目类型。始终为 `shell_call_output`.

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

              产生此工具调用的程序项调用 ID。

            - `type: "program"`

              调用方类型。始终为 `program`.

              - `"program"`

        - `max_output_length: optional number or null`

          为此 shell 调用的组合输出捕获的最大 UTF-8 字符数。

        - `status: optional "in_progress" or "completed" or "incomplete" or null`

          shell 调用输出的状态。

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

      - `ApplyPatchCall object { call_id, operation, status, 3 more }`

        表示使用差异补丁创建、删除或更新文件的工具调用。

        - `call_id: string`

          由模型生成的 apply_patch 工具调用的唯一 ID。

        - `operation: object { diff, path, type }  or object { path, type }  or object { diff, path, type }`

          apply_patch 工具调用的具体创建、删除或更新指令。

          - `CreateFile object { diff, path, type }`

            通过 apply_patch 工具创建新文件的指令。

            - `diff: string`

              创建文件时要应用的统一差异补丁内容。

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

              要应用到现有文件的统一差异补丁内容。

            - `path: string`

              要更新的文件相对于工作区根目录的路径。

            - `type: "update_file"`

              操作类型。始终为 `update_file`.

              - `"update_file"`

        - `status: "in_progress" or "completed"`

          apply_patch 工具调用的状态。可以是 `in_progress` 或 `completed`.

          - `"in_progress"`

          - `"completed"`

        - `type: "apply_patch_call"`

          项目类型。始终为 `apply_patch_call`.

          - `"apply_patch_call"`

        - `id: optional string or null`

          apply_patch 工具调用的唯一 ID。当此项通过 API 返回时填充。

        - `caller: optional object { type }  or object { caller_id, type }  or null`

          产生此工具调用的执行上下文。

          - `Direct object { type }`

            - `type: "direct"`

              调用方类型。始终为 `direct`.

              - `"direct"`

          - `Program object { caller_id, type }`

            - `caller_id: string`

              产生此工具调用的程序项调用 ID。

            - `type: "program"`

              调用方类型。始终为 `program`.

              - `"program"`

      - `ApplyPatchCallOutput object { call_id, status, type, 3 more }`

        apply_patch 工具调用产生的流式输出。

        - `call_id: string`

          由模型生成的 apply_patch 工具调用的唯一 ID。

        - `status: "completed" or "failed"`

          apply_patch 工具调用输出的状态。可以是 `completed` 或 `failed`.

          - `"completed"`

          - `"failed"`

        - `type: "apply_patch_call_output"`

          项目类型。始终为 `apply_patch_call_output`.

          - `"apply_patch_call_output"`

        - `id: optional string or null`

          apply_patch 工具调用输出的唯一 ID。当此项通过 API 返回时填充。

        - `caller: optional object { type }  or object { caller_id, type }  or null`

          产生此工具调用的执行上下文。

          - `Direct object { type }`

            - `type: "direct"`

              调用方类型。始终为 `direct`.

              - `"direct"`

          - `Program object { caller_id, type }`

            - `caller_id: string`

              产生此工具调用的程序项调用 ID。

            - `type: "program"`

              调用方类型。始终为 `program`.

              - `"program"`

        - `output: optional string or null`

          apply_patch 工具可选的人类可读日志文本（例如补丁结果或错误）。

      - `McpListTools object { id, server_label, tools, 2 more }`

        MCP 服务器上可用的工具列表。

        - `id: string`

          列表的唯一 ID。

        - `server_label: string`

          MCP 服务器的标签。

        - `tools: array of object { input_schema, name, annotations, description }`

          服务器上可用的工具。

          - `input_schema: unknown`

            描述工具输入的 JSON 模式。

          - `name: string`

            工具的名称。

          - `annotations: optional unknown or null`

            关于工具的附加注释。

          - `description: optional string or null`

            工具的描述。

        - `type: "mcp_list_tools"`

          项目类型。始终为 `mcp_list_tools`.

          - `"mcp_list_tools"`

        - `error: optional string or null`

          如果服务器无法列出工具，则返回错误消息。

      - `McpApprovalRequest object { id, arguments, name, 2 more }`

        请求人工批准工具调用。

        - `id: string`

          审批请求的唯一 ID。

        - `arguments: string`

          工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具的名称。

        - `server_label: string`

          发出请求的 MCP 服务器的标签。

        - `type: "mcp_approval_request"`

          项目类型。始终为 `mcp_approval_request`.

          - `"mcp_approval_request"`

      - `McpApprovalResponse object { approval_request_id, approve, type, 2 more }`

        对 MCP 审批请求的响应。

        - `approval_request_id: string`

          正在答复的审批请求的 ID。

        - `approve: boolean`

          请求是否被批准。

        - `type: "mcp_approval_response"`

          项目类型。始终为 `mcp_approval_response`.

          - `"mcp_approval_response"`

        - `id: optional string or null`

          审批响应的唯一 ID。

        - `reason: optional string or null`

          决策的可选原因。

      - `McpCall object { id, arguments, name, 6 more }`

        在 MCP 服务器上调用工具。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给工具的参数的 JSON 字符串。

        - `name: string`

          已运行的工具名称。

        - `server_label: string`

          运行该工具的 MCP 服务器标签。

        - `type: "mcp_call"`

          项目类型。始终为 `mcp_call`.

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

          工具调用的状态。以下之一： `in_progress`, `completed`, `incomplete`, `calling`，或 `failed`.

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

          - `"calling"`

          - `"failed"`

      - `CustomToolCallOutput object { call_id, output, type, 2 more }`

        来自你的代码的自定义工具调用的输出，正在发送回模型。

        - `call_id: string`

          调用 ID，用于将此自定义工具调用的输出映射到自定义工具调用。

        - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

          由你的代码生成的自定义工具调用的输出。
          可以是字符串或输出内容的列表。

          - `StringOutput = string`

            自定义工具调用输出的字符串。

          - `OutputContentList = array of ResponseInputText or ResponseInputImage or ResponseInputFile`

            自定义工具调用的文本、图像或文件输出。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              模型的文本输入。

            - `ResponseInputImage object { detail, type, file_id, 2 more }`

              发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

            - `ResponseInputFile object { type, detail, file_data, 4 more }`

              发送给模型的文件输入。

        - `type: "custom_tool_call_output"`

          自定义工具调用输出的类型。始终为 `custom_tool_call_output`.

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

              产生此工具调用的程序项调用 ID。

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

          自定义工具调用的类型。始终 `custom_tool_call`.

          - `"custom_tool_call"`

        - `id: optional string`

          OpenAI 平台中自定义工具调用的唯一 ID。

        - `caller: optional object { type }  or object { caller_id, type }  or null`

          产生此工具调用的执行上下文。

          - `Direct object { type }`

            - `type: "direct"`

              - `"direct"`

          - `Program object { caller_id, type }`

            - `caller_id: string`

              产生此工具调用的程序项调用 ID。

            - `type: "program"`

              - `"program"`

        - `namespace: optional string`

          所调用自定义工具的命名空间。

      - `CompactionTrigger object { type }`

        压缩当前上下文。必须是最后一个输入项。

        - `type: "compaction_trigger"`

          项目类型。始终为 `compaction_trigger`.

          - `"compaction_trigger"`

      - `ItemReference object { id, type }`

        用于引用某个项的内部标识符。

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

          由编程式工具调用执行的 JavaScript 源代码。

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

          程序输出的最终状态。

          - `"completed"`

          - `"incomplete"`

        - `type: "program_output"`

          项目类型。始终为 `program_output`.

          - `"program_output"`

  - `metadata: Metadata or null`

    可附加到对象上的16组键值对。这可以
    用于以结构化
    格式，并通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

  - `model: ResponsesModel`

    用于生成响应的模型 ID，例如 `gpt-4o` 或 `o3`。OpenAI
    提供多种模型，能力、性能各异
    ，且价格不同。请参阅 [模型指南](/docs/models)
    浏览并比较可用模型。

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

    模型生成的内容项数组。

    - 数组中内容的长度和顺序取决于 `output` 模型响应
      。
    - 建议不要直接访问 `output` 数组中的第一个元素，也
      不要假定它就是包含模型生成内容的 `assistant` 消息，而可以考虑使用
      属性，在 `output_text` 支持的
      SDK中获取。

    - `ResponseOutputMessage object { id, content, role, 3 more }`

      来自模型的输出消息。

    - `FileSearchCall object { id, queries, status, 2 more }`

      文件搜索 工具调用的结果。参见
      [文件搜索 指南](/docs/guides/tools-file-search) 以了解更多信息。

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

        文件搜索 工具调用的类型。始终 `file_search_call`.

        - `"file_search_call"`

      - `results: optional array of object { attributes, file_id, filename, 2 more }  or null`

        文件搜索工具调用的结果。

        - `attributes: optional map[string or number or boolean] or null`

          可附加到对象上的16组键值对。这可以
          用于以结构化
          格式存储关于对象的附加信息，并通过API或仪表板查询对象。键是字符串
          ，最大长度为64个字符。值是字符串，最大
          长度为512个字符、布尔值或数字。

          - `string`

          - `number`

          - `boolean`

        - `file_id: optional string`

          文件的唯一标识ID。

        - `filename: optional string`

          文件的名称。

        - `score: optional number`

          文件的相关性评分——一个介于0和1之间的值。

        - `text: optional string`

          从文件中检索到的文本。

    - `FunctionCall object { arguments, call_id, name, 5 more }`

      运行函数的工具调用。参见
      [函数调用指南](/docs/guides/function-calling) 以了解更多信息。

      - `arguments: string`

        要传递给函数的参数的 JSON 字符串。

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

            产生此工具调用的程序项调用 ID。

          - `type: "program"`

            - `"program"`

      - `namespace: optional string`

        要运行的函数命名空间。

      - `status: optional "in_progress" or "completed" or "incomplete"`

        项目的状态。以下之一： `in_progress`, `completed`，或
        `incomplete`。当项目通过 API 返回时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `FunctionCallOutput object { id, output, status, 6 more }`

      - `id: string`

        函数调用工具输出的唯一 ID。

      - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

        你的代码生成的函数调用输出。
        可以是字符串或输出内容的列表。

        - `StringOutput = string`

          函数调用输出的字符串。

        - `OutputContentList = array of ResponseInputText or ResponseInputImage or ResponseInputFile`

          函数调用的文本、图像或文件输出。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

      - `status: "in_progress" or "completed" or "incomplete"`

        项目的状态。以下之一： `in_progress`, `completed`，或
        `incomplete`。当项目通过 API 返回时填充。

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

            产生此工具调用的程序项调用 ID。

          - `type: "program"`

            调用方类型。始终为 `program`.

            - `"program"`

      - `created_by: optional string`

        创建该项的操作者标识符。

      - `name: optional string`

        产生输出的工具名称。

      - `namespace: optional string`

        产生输出的工具的命名空间。

    - `WebSearchCall object { id, action, status, type }`

      网页搜索 工具调用的结果。参见
      [网页搜索 指南](/docs/guides/tools-web-search) 以了解更多信息。

      - `id: string`

        网页搜索 工具调用的唯一 ID。

      - `action: object { type, queries, query, sources }  or object { type, url }  or object { pattern, type, url }`

        描述此网页搜索调用中采取的具体操作的对象。
        包括模型如何使用网络的详细信息（搜索、打开页面、页内查找）。

        - `Search object { type, queries, query, sources }`

          操作类型“搜索” - 执行网页搜索查询。

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

          操作类型"open_page" - 打开搜索结果中的特定 URL。

          - `type: "open_page"`

            操作类型。

            - `"open_page"`

          - `url: optional string or null`

            模型打开的 URL。

        - `FindInPage object { pattern, type, url }`

          操作类型"find_in_page"：在已加载页面中搜索模式。

          - `pattern: string`

            要在页面内搜索的模式或文本。

          - `type: "find_in_page"`

            操作类型。

            - `"find_in_page"`

          - `url: string`

            搜索该模式所针对页面的 URL。

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
      [计算机使用指南](/docs/guides/tools-computer-use) 以了解更多信息。

      - `id: string`

        计算机调用的唯一标识ID。

      - `call_id: string`

        用于响应工具调用输出时的标识符。

      - `pending_safety_checks: array of object { id, code, message }`

        计算机调用的待处理安全检查。

        - `id: string`

          待处理安全检查的ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          关于待处理安全检查的详细信息。

      - `status: "in_progress" or "completed" or "incomplete"`

        项目的状态。以下之一： `in_progress`, `completed`，或
        `incomplete`。当项目通过 API 返回时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "computer_call"`

        计算机调用的类型。始终为 `computer_call`.

        - `"computer_call"`

      - `action: optional ComputerAction`

        一次点击操作。

      - `actions: optional ComputerActionList`

        扁平化的批量操作，用于 `computer_use`. 每个操作包含一个
        `type` 鉴别器和操作特有字段。

    - `ComputerCallOutput object { id, call_id, output, 4 more }`

      - `id: string`

        计算机调用工具输出的唯一 ID。

      - `call_id: string`

        产生输出的计算机工具调用的 ID。

      - `output: ResponseComputerToolCallOutputScreenshot`

        用于计算机使用工具的计算机截图图像。

      - `status: "completed" or "incomplete" or "failed" or "in_progress"`

        消息输入的状态。取值为 `in_progress`, `completed`，或
        `incomplete`。当输入项通过 API 返回时填充。

        - `"completed"`

        - `"incomplete"`

        - `"failed"`

        - `"in_progress"`

      - `type: "computer_call_output"`

        计算机工具调用输出的类型。始终为 `computer_call_output`.

        - `"computer_call_output"`

      - `acknowledged_safety_checks: optional array of object { id, code, message }`

        API 报告且已被
        开发者确认的安全检查。

        - `id: string`

          待处理安全检查的ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          关于待处理安全检查的详细信息。

      - `created_by: optional string`

        创建该项的操作者标识符。

    - `Reasoning object { id, summary, type, 3 more }`

      推理模型在生成
      响应时使用的思维链描述。请确保在您的 `input` 中包含这些项目到 Responses API
      如果你手动
      [管理上下文](/docs/guides/conversation-state).

      - `id: string`

        推理内容的唯一标识符。

      - `summary: array of SummaryTextContent`

        推理摘要内容。

        - `text: string`

          模型迄今为止的推理输出摘要。

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

        推理项的加密内容。此内容默认填充
        用于由 `POST /v1/responses` 和 WebSocket
        `response.create` 请求返回的推理项。

        当流式传输时，使用完成的推理项及其
        `encrypted_content` 中的 `response.output_item.done` 事件
        在后续请求中。此 `encrypted_content` 中的
        `response.output_item.added` 可能不完整。这一点尤其
        重要，当 `store` 是 `false` 或在使用零数据保留时。

      - `status: optional "in_progress" or "completed" or "incomplete"`

        项目的状态。以下之一： `in_progress`, `completed`，或
        `incomplete`。当项目通过 API 返回时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `Program object { id, call_id, code, 2 more }`

      - `id: string`

        程序项的唯一 ID。

      - `call_id: string`

        程序项的稳定调用 ID。

      - `code: string`

        由编程式工具调用执行的 JavaScript 源代码。

      - `fingerprint: string`

        不透明的程序重放指纹，必须进行往返传递。

      - `type: "program"`

        项目类型。始终为 `program`.

        - `"program"`

    - `ProgramOutput object { id, call_id, result, 2 more }`

      - `id: string`

        程序输出项的唯一 ID。

      - `call_id: string`

        程序项的调用 ID。

      - `result: string`

        程序项产生的结果。

      - `status: "completed" or "incomplete"`

        程序输出项的最终状态。

        - `"completed"`

        - `"incomplete"`

      - `type: "program_output"`

        项目类型。始终为 `program_output`.

        - `"program_output"`

    - `ToolSearchCall object { id, arguments, call_id, 4 more }`

      - `id: string`

        工具搜索调用项的唯一 ID。

      - `arguments: unknown`

        用于工具搜索调用的参数。

      - `call_id: string or null`

        由模型生成的工具搜索调用的唯一 ID。

      - `execution: "server" or "client"`

        工具搜索是由服务端还是客户端执行的。

        - `"server"`

        - `"client"`

      - `status: "in_progress" or "completed" or "incomplete"`

        已记录的工具搜索调用项状态。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "tool_search_call"`

        项目类型。始终为 `tool_search_call`.

        - `"tool_search_call"`

      - `created_by: optional string`

        创建该项的操作者标识符。

    - `ToolSearchOutput object { id, call_id, execution, 4 more }`

      - `id: string`

        工具搜索输出项的唯一 ID。

      - `call_id: string or null`

        由模型生成的工具搜索调用的唯一 ID。

      - `execution: "server" or "client"`

        工具搜索是由服务端还是客户端执行的。

        - `"server"`

        - `"client"`

      - `status: "in_progress" or "completed" or "incomplete"`

        已记录的工具搜索输出项状态。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        工具搜索返回的已加载工具定义。

        - `Function object { name, parameters, strict, 5 more }`

          在你自己的代码中定义一个模型可以选择调用的函数。了解更多 [函数调用](https://platform.openai.com/docs/guides/function-calling).

          - `name: string`

            要调用的函数名称。

          - `parameters: map[unknown] or null`

            描述函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否对此函数工具强制执行严格的参数验证。

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

            描述此函数字符串输出中编码的 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          一种从上传文件中搜索相关内容工具。了解有关 [文件搜索 工具](https://platform.openai.com/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索 工具的类型。始终为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的过滤器。

            - `ComparisonFilter object { key, type, value }`

              用于使用定义的比较操作将指定的属性键与给定值进行比较的过滤器。

            - `CompoundFilter object { filters, type }`

              组合多个过滤器，使用 `and` 或 `or`.

          - `max_num_results: optional number`

            要返回的最大结果数。此数字应在 1 到 50 之间（含）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排名选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              控制混合搜索时，倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

              - `embedding_weight: number`

                嵌入在倒数排名融合中的权重。

              - `text_weight: number`

                文本在倒数排名融合中的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排名器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的得分阈值，一个介于 0 和 1 之间的数字。接近 1 的数字将尝试仅返回最相关的结果，但可能返回较少的结果。

        - `Computer object { type }`

          一种控制虚拟计算机的工具。了解更多关于 [计算机工具](https://platform.openai.com/docs/guides/tools-computer-use).

          - `type: "computer"`

            计算机工具的类型。始终 `computer`.

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

            计算机使用工具的类型。始终 `computer_use_preview`.

            - `"computer_use_preview"`

        - `WebSearch object { type, external_web_access, filters, 2 more }`

          搜索互联网以查找与提示相关的来源。了解更多关于
          [网页搜索 工具](/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索 工具的类型。其中之一 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            为 网页搜索 允许实时互联网访问。省略时默认为 true。为 false 时，网页搜索 工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的过滤器。

            - `allowed_domains: optional array of string or null`

              搜索允许的域名。如果未提供，则允许所有域名。
              提供的域名的子域也允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间使用量的高级指导。其中之一 `low`, `medium`，或 `high`. `medium` 是默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户的城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 的用户，例如。 `US`.

            - `region: optional string or null`

              用户的地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 的用户，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似类型的取值。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          (MCP) 服务器，为模型提供额外的工具访问权限。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识该服务器。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许的工具名称列表，或一个过滤器对象。

            - `McpAllowedTools = array of string`

              允许的工具名称字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果某个
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，则将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
            自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
            必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 其中之一。详细了解
            服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

            当前支持的 `connector_id` 值包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google 日历： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook 日历： `connector_outlookcalendar`
            - Outlook 邮件： `connector_outlookemail`
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

            此 MCP 工具是否已延迟并通过工具搜索发现。

          - `headers: optional map[string] or null`

            要发送到 MCP 服务器的可选 HTTP 头。用于认证
            或其他目的。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`，或与需要审批的工具关联的筛选器对象
              。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤器对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果某个
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，则将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤器对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果某个
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，则将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一审批策略。可选值为 `always` 或
              `never`。当设置为 `always`，则所有工具都需要审批。当
              设为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            要使用的安全 MCP 隧道 ID，而不是直接服务器 URL。以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `CodeInterpreter object { container, type, allowed_callers }`

          一种运行 Python 代码以帮助生成提示响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID 或一个对象，该对象
            指定上传的文件 ID 以供你的代码使用，以及一个
            可选的 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可以选择指定要运行代码的文件的 ID。

              - `type: "auto"`

                始终 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                可选的上传文件列表，以供你的代码使用。

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

            设置生成图像的背景。取值之一为 `transparent`,
            `opaque`，或 `auto`。透明背景适用于
            支持的 GPT 图像模型。对于 `gpt-image-2` 和
            `gpt-image-2-2026-04-21`，此支持处于预览阶段。使用
            `transparent`，时，请将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）上付出的努力程度。此参数仅受 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本模型支持，不受 `gpt-image-1-mini`。支持。支持 `high` 和 `low`。默认值为 `low`.

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

            要使用的图像生成模型。之一 `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
            `gpt-image-1`.

            - `string`

            - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

              要使用的图像生成模型。之一 `gpt-image-1`,
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

            生成图像的输出格式。之一 `png`, `webp`，或
            `jpeg`。默认值： `png`.

            - `"png"`

            - `"webp"`

            - `"jpeg"`

          - `partial_images: optional number`

            流式模式下生成的部分图像数量，范围从 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or "auto"`

            生成图像的质量。之一 `low`, `medium`, `high`,
            或 `auto`。默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的大小。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，作为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率是实验性的，最大支持分辨率为 `3840x2160`。请求的大小还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，和 `1024x1536` 受 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，使用其中之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用其中之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的大小。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，作为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率是实验性的，最大支持分辨率为 `3840x2160`。请求的大小还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，和 `1024x1536` 受 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，使用其中之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用其中之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

            此工具是否应延迟处理并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认是无约束文本。

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

                是否应延迟此函数并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                一个 JSON Schema，描述此函数工具字符串输出中编码的 JSON 值。这不描述内容数组输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数验证。如果省略，Responses 会在 schema 兼容时尝试使用严格验证，否则回退到非严格验证。

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

                此工具是否应延迟处理并通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认是无约束文本。

          - `type: "namespace"`

            工具的类型。始终 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          用于延迟工具的托管或 BYOT 工具搜索配置。

          - `type: "tool_search"`

            工具的类型。始终 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            为客户端执行的工具搜索工具向模型显示的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端还是客户端执行的。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具搜索网页以获取响应中使用的相关结果。了解更多关于 [网页搜索 工具](https://platform.openai.com/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索 工具的类型。其中之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

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

              位置近似类型的取值。始终为 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户的城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 的用户，例如。 `US`.

            - `region: optional string or null`

              用户的地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 的用户，例如。 `America/Los_Angeles`.

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

      - `created_by: optional string`

        创建该项的操作者标识符。

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

          在你自己的代码中定义一个模型可以选择调用的函数。了解更多 [函数调用](https://platform.openai.com/docs/guides/function-calling).

          - `name: string`

            要调用的函数名称。

          - `parameters: map[unknown] or null`

            描述函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否对此函数工具强制执行严格的参数验证。

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

            描述此函数字符串输出中编码的 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          一种从上传文件中搜索相关内容工具。了解有关 [文件搜索 工具](https://platform.openai.com/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索 工具的类型。始终为 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的过滤器。

            - `ComparisonFilter object { key, type, value }`

              用于使用定义的比较操作将指定的属性键与给定值进行比较的过滤器。

            - `CompoundFilter object { filters, type }`

              组合多个过滤器，使用 `and` 或 `or`.

          - `max_num_results: optional number`

            要返回的最大结果数。此数字应在 1 到 50 之间（含）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排名选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              控制混合搜索时，倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

              - `embedding_weight: number`

                嵌入在倒数排名融合中的权重。

              - `text_weight: number`

                文本在倒数排名融合中的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排名器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的得分阈值，一个介于 0 和 1 之间的数字。接近 1 的数字将尝试仅返回最相关的结果，但可能返回较少的结果。

        - `Computer object { type }`

          一种控制虚拟计算机的工具。了解更多关于 [计算机工具](https://platform.openai.com/docs/guides/tools-computer-use).

          - `type: "computer"`

            计算机工具的类型。始终 `computer`.

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

            计算机使用工具的类型。始终 `computer_use_preview`.

            - `"computer_use_preview"`

        - `WebSearch object { type, external_web_access, filters, 2 more }`

          搜索互联网以查找与提示相关的来源。了解更多关于
          [网页搜索 工具](/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索 工具的类型。其中之一 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            为 网页搜索 允许实时互联网访问。省略时默认为 true。为 false 时，网页搜索 工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的过滤器。

            - `allowed_domains: optional array of string or null`

              搜索允许的域名。如果未提供，则允许所有域名。
              提供的域名的子域也允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间使用量的高级指导。其中之一 `low`, `medium`，或 `high`. `medium` 是默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。

            - `city: optional string or null`

              用户的城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 的用户，例如。 `US`.

            - `region: optional string or null`

              用户的地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 的用户，例如。 `America/Los_Angeles`.

            - `type: optional "approximate"`

              位置近似类型的取值。始终为 `approximate`.

              - `"approximate"`

        - `Mcp object { server_label, type, allowed_callers, 9 more }`

          通过远程 Model Context Protocol
          (MCP) 服务器，为模型提供额外的工具访问权限。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

          - `server_label: string`

            此 MCP 服务器的标签，用于在工具调用中标识该服务器。

          - `type: "mcp"`

            MCP 工具的类型。始终为 `mcp`.

            - `"mcp"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

            允许的工具名称列表，或一个过滤器对象。

            - `McpAllowedTools = array of string`

              允许的工具名称字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的过滤器对象。

              - `read_only: optional boolean`

                指示工具是否修改数据或为只读。如果某个
                MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                ，则将匹配此过滤器。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
            自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
            必须处理 OAuth 授权流程，并在此处提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 其中之一。详细了解
            服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

            当前支持的 `connector_id` 值包括：

            - Dropbox： `connector_dropbox`
            - Gmail： `connector_gmail`
            - Google 日历： `connector_googlecalendar`
            - Google Drive： `connector_googledrive`
            - Microsoft Teams： `connector_microsoftteams`
            - Outlook 日历： `connector_outlookcalendar`
            - Outlook 邮件： `connector_outlookemail`
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

            此 MCP 工具是否已延迟并通过工具搜索发现。

          - `headers: optional map[string] or null`

            要发送到 MCP 服务器的可选 HTTP 头。用于认证
            或其他目的。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器的哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`，或与需要审批的工具关联的筛选器对象
              。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤器对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果某个
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，则将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的过滤器对象。

                - `read_only: optional boolean`

                  指示工具是否修改数据或为只读。如果某个
                  MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  ，则将匹配此过滤器。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定单一审批策略。可选值为 `always` 或
              `never`。当设置为 `always`，则所有工具都需要审批。当
              设为 `never`，时，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
            `tunnel_id` 必须提供。

          - `tunnel_id: optional string`

            要使用的安全 MCP 隧道 ID，而不是直接服务器 URL。以下之一
            `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

        - `CodeInterpreter object { container, type, allowed_callers }`

          一种运行 Python 代码以帮助生成提示响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID 或一个对象，该对象
            指定上传的文件 ID 以供你的代码使用，以及一个
            可选的 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可以选择指定要运行代码的文件的 ID。

              - `type: "auto"`

                始终 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                可选的上传文件列表，以供你的代码使用。

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

            设置生成图像的背景。取值之一为 `transparent`,
            `opaque`，或 `auto`。透明背景适用于
            支持的 GPT 图像模型。对于 `gpt-image-2` 和
            `gpt-image-2-2026-04-21`，此支持处于预览阶段。使用
            `transparent`，时，请将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）上付出的努力程度。此参数仅受 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本模型支持，不受 `gpt-image-1-mini`。支持。支持 `high` 和 `low`。默认值为 `low`.

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

            要使用的图像生成模型。之一 `gpt-image-1`,
            `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
            `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
            `gpt-image-1`.

            - `string`

            - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

              要使用的图像生成模型。之一 `gpt-image-1`,
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

            生成图像的输出格式。之一 `png`, `webp`，或
            `jpeg`。默认值： `png`.

            - `"png"`

            - `"webp"`

            - `"jpeg"`

          - `partial_images: optional number`

            流式模式下生成的部分图像数量，范围从 0（默认值）到 3。

          - `quality: optional "low" or "medium" or "high" or "auto"`

            生成图像的质量。之一 `low`, `medium`, `high`,
            或 `auto`。默认值： `auto`.

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"auto"`

          - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

            生成图像的大小。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，作为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率是实验性的，最大支持分辨率为 `3840x2160`。请求的大小还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，和 `1024x1536` 受 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，使用其中之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用其中之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的大小。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，作为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率是实验性的，最大支持分辨率为 `3840x2160`。请求的大小还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，和 `1024x1536` 受 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，使用其中之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用其中之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

            此工具是否应延迟处理并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认是无约束文本。

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

                是否应延迟此函数并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                一个 JSON Schema，描述此函数工具字符串输出中编码的 JSON 值。这不描述内容数组输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数验证。如果省略，Responses 会在 schema 兼容时尝试使用严格验证，否则回退到非严格验证。

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

                此工具是否应延迟处理并通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认是无约束文本。

          - `type: "namespace"`

            工具的类型。始终 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          用于延迟工具的托管或 BYOT 工具搜索配置。

          - `type: "tool_search"`

            工具的类型。始终 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            为客户端执行的工具搜索工具向模型显示的描述。

          - `execution: optional "server" or "client"`

            工具搜索是由服务端还是客户端执行的。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行的工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具搜索网页以获取响应中使用的相关结果。了解更多关于 [网页搜索 工具](https://platform.openai.com/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索 工具的类型。其中之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

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

              位置近似类型的取值。始终为 `approximate`.

              - `"approximate"`

            - `city: optional string or null`

              用户的城市的自由文本输入，例如 `San Francisco`.

            - `country: optional string or null`

              两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 的用户，例如。 `US`.

            - `region: optional string or null`

              用户的地区的自由文本输入，例如 `California`.

            - `timezone: optional string or null`

              该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 的用户，例如。 `America/Los_Angeles`.

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

    - `Compaction object { id, encrypted_content, type, created_by }`

      由 [`v1/responses/compact` API](/docs/api-reference/responses/compact).

      - `id: string`

        压缩项的唯一 ID。

      - `encrypted_content: string`

        压缩产生的加密内容。

      - `type: "compaction"`

        项目类型。始终为 `compaction`.

        - `"compaction"`

      - `created_by: optional string`

        创建该项的操作者标识符。

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

        要运行的代码，如果不可用则为 null。

      - `container_id: string`

        用于运行代码的容器 ID。

      - `outputs: array of object { logs, type }  or object { type, url }  or null`

        代码解释器生成的输出，例如日志或图像。
        如果没有可用输出，则为 null。

        - `Logs object { logs, type }`

          代码解释器输出的日志。

          - `logs: string`

            代码解释器输出的日志。

          - `type: "logs"`

            输出类型。始终为 `logs`.

            - `"logs"`

        - `Image object { type, url }`

          代码解释器输出的图像。

          - `type: "image"`

            输出类型。始终为 `image`.

            - `"image"`

          - `url: string`

            代码解释器输出的图像的 URL。

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

          为命令设置的环境变量。

        - `type: "exec"`

          本地 shell 操作的类型。始终为 `exec`.

          - `"exec"`

        - `timeout_ms: optional number or null`

          命令的可选超时时间（毫秒）。

        - `user: optional string or null`

          可选：运行命令的用户。

        - `working_directory: optional string or null`

          可选：运行命令的工作目录。

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

        项目的状态。以下之一： `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `ShellCall object { id, action, call_id, 5 more }`

      在受管环境中执行一条或多条 shell 命令的工具调用。

      - `id: string`

        shell 工具调用的唯一 ID。当此项目通过 API 返回时填充。

      - `action: object { commands, max_output_length, timeout_ms }`

        描述如何运行工具调用的 shell 命令和限制。

        - `commands: array of string`

        - `max_output_length: number or null`

          每条命令可选的最大返回字符数。

        - `timeout_ms: number or null`

          命令的可选超时时间（毫秒）。

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

          表示使用 /v1/containers 创建的容器。

          - `container_id: string`

          - `type: "container_reference"`

            环境类型。始终为 `container_reference`.

            - `"container_reference"`

      - `status: "in_progress" or "completed" or "incomplete"`

        shell 调用的状态。以下之一： `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "shell_call"`

        项目类型。始终为 `shell_call`.

        - `"shell_call"`

      - `caller: optional object { type }  or object { caller_id, type }  or null`

        产生此工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            产生此工具调用的程序项调用 ID。

          - `type: "program"`

            - `"program"`

      - `created_by: optional string`

        创建此工具调用的实体的 ID。

    - `ShellCallOutput object { id, call_id, max_output_length, 5 more }`

      发出的 shell 工具调用的输出。

      - `id: string`

        shell 调用输出的唯一 ID。当此项目通过 API 返回时填充。

      - `call_id: string`

        模型生成的 shell 工具调用的唯一 ID。

      - `max_output_length: number or null`

        shell 命令输出的最大长度。此值由模型生成，应随原始输出一起传回。

      - `output: array of object { outcome, stderr, stdout, created_by }`

        shell 调用输出内容的数组

        - `outcome: object { type }  or object { exit_code, type }`

          表示 shell 调用输出块的退出结果（带退出代码）或超时结果。

          - `Timeout object { type }`

            表示 shell 调用超过了其配置的时间限制。

            - `type: "timeout"`

              结局类型。始终为 `timeout`.

              - `"timeout"`

          - `Exit object { exit_code, type }`

            表示 shell 命令已完成并返回退出代码。

            - `exit_code: number`

              来自 shell 进程的退出代码。

            - `type: "exit"`

              结局类型。始终为 `exit`.

              - `"exit"`

        - `stderr: string`

          捕获的标准错误输出。

        - `stdout: string`

          捕获的标准输出。

        - `created_by: optional string`

          创建该项的操作者标识符。

      - `status: "in_progress" or "completed" or "incomplete"`

        shell 调用输出的状态。其中之一为 `in_progress`, `completed`，或 `incomplete`.

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

            产生此工具调用的程序项调用 ID。

          - `type: "program"`

            - `"program"`

      - `created_by: optional string`

        创建该项的操作者标识符。

    - `ApplyPatchCall object { id, call_id, operation, 4 more }`

      通过创建、删除或更新文件来应用文件差异的工具调用。

      - `id: string`

        apply_patch 工具调用的唯一 ID。当此项通过 API 返回时填充。

      - `call_id: string`

        由模型生成的 apply_patch 工具调用的唯一 ID。

      - `operation: object { diff, path, type }  or object { path, type }  or object { diff, path, type }`

        通过 apply_patch 执行的 create_file、delete_file 或 update_file 操作之一。

        - `CreateFile object { diff, path, type }`

          描述如何通过 apply_patch 工具创建文件的指令。

          - `diff: string`

            要应用的差异。

          - `path: string`

            要创建的文件的路径。

          - `type: "create_file"`

            使用所提供的差异创建新文件。

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

            使用所提供的差异更新现有文件。

            - `"update_file"`

      - `status: "in_progress" or "completed"`

        apply_patch 工具调用的状态。可以是 `in_progress` 或 `completed`.

        - `"in_progress"`

        - `"completed"`

      - `type: "apply_patch_call"`

        项目类型。始终为 `apply_patch_call`.

        - `"apply_patch_call"`

      - `caller: optional object { type }  or object { caller_id, type }  or null`

        产生此工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            产生此工具调用的程序项调用 ID。

          - `type: "program"`

            - `"program"`

      - `created_by: optional string`

        创建此工具调用的实体的 ID。

    - `ApplyPatchCallOutput object { id, call_id, status, 4 more }`

      apply patch 工具调用所发出的输出。

      - `id: string`

        apply_patch 工具调用输出的唯一 ID。当此项通过 API 返回时填充。

      - `call_id: string`

        由模型生成的 apply_patch 工具调用的唯一 ID。

      - `status: "completed" or "failed"`

        apply_patch 工具调用输出的状态。可以是 `completed` 或 `failed`.

        - `"completed"`

        - `"failed"`

      - `type: "apply_patch_call_output"`

        项目类型。始终为 `apply_patch_call_output`.

        - `"apply_patch_call_output"`

      - `caller: optional object { type }  or object { caller_id, type }  or null`

        产生此工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            产生此工具调用的程序项调用 ID。

          - `type: "program"`

            - `"program"`

      - `created_by: optional string`

        创建此工具调用输出的实体的 ID。

      - `output: optional string or null`

        apply patch 工具返回的可选文本输出。

    - `McpCall object { id, arguments, name, 6 more }`

      在 MCP 服务器上调用工具。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给工具的参数的 JSON 字符串。

      - `name: string`

        已运行的工具名称。

      - `server_label: string`

        运行该工具的 MCP 服务器标签。

      - `type: "mcp_call"`

        项目类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        MCP 工具调用审批请求的唯一标识符。
        在后续 `mcp_approval_response` 输入中包含此值，以批准或拒绝相应的工具调用。

      - `error: optional McpToolCallError or null`

        工具调用产生的错误（如有）。

      - `output: optional string or null`

        工具调用的输出。

      - `status: optional "in_progress" or "completed" or "incomplete" or 2 more`

        工具调用的状态。以下之一： `in_progress`, `completed`, `incomplete`, `calling`，或 `failed`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

        - `"calling"`

        - `"failed"`

    - `McpListTools object { id, server_label, tools, 2 more }`

      MCP 服务器上可用的工具列表。

      - `id: string`

        列表的唯一 ID。

      - `server_label: string`

        MCP 服务器的标签。

      - `tools: array of object { input_schema, name, annotations, description }`

        服务器上可用的工具。

        - `input_schema: unknown`

          描述工具输入的 JSON 模式。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          关于工具的附加注释。

        - `description: optional string or null`

          工具的描述。

      - `type: "mcp_list_tools"`

        项目类型。始终为 `mcp_list_tools`.

        - `"mcp_list_tools"`

      - `error: optional string or null`

        如果服务器无法列出工具，则返回错误消息。

    - `McpApprovalRequest object { id, arguments, name, 2 more }`

      请求人工批准工具调用。

      - `id: string`

        审批请求的唯一 ID。

      - `arguments: string`

        工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具的名称。

      - `server_label: string`

        发出请求的 MCP 服务器的标签。

      - `type: "mcp_approval_request"`

        项目类型。始终为 `mcp_approval_request`.

        - `"mcp_approval_request"`

    - `McpApprovalResponse object { id, approval_request_id, approve, 2 more }`

      对 MCP 审批请求的响应。

      - `id: string`

        审批响应的唯一 ID。

      - `approval_request_id: string`

        正在答复的审批请求的 ID。

      - `approve: boolean`

        请求是否被批准。

      - `type: "mcp_approval_response"`

        项目类型。始终为 `mcp_approval_response`.

        - `"mcp_approval_response"`

      - `reason: optional string or null`

        决策的可选原因。

    - `CustomToolCall object { call_id, input, name, 4 more }`

      对模型创建的自定义工具的调用。

      - `call_id: string`

        用于将此自定义工具调用映射到工具调用输出的标识符。

      - `input: string`

        由模型生成的自定义工具调用的输入。

      - `name: string`

        被调用的自定义工具的名称。

      - `type: "custom_tool_call"`

        自定义工具调用的类型。始终 `custom_tool_call`.

        - `"custom_tool_call"`

      - `id: optional string`

        OpenAI 平台中自定义工具调用的唯一 ID。

      - `caller: optional object { type }  or object { caller_id, type }  or null`

        产生此工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            产生此工具调用的程序项调用 ID。

          - `type: "program"`

            - `"program"`

      - `namespace: optional string`

        所调用自定义工具的命名空间。

    - `CustomToolCallOutput object { id, call_id, output, 4 more }`

      - `id: string`

        自定义工具调用输出项的唯一 ID。

      - `call_id: string`

        调用 ID，用于将此自定义工具调用的输出映射到自定义工具调用。

      - `output: string or array of ResponseInputText or ResponseInputImage or ResponseInputFile`

        由你的代码生成的自定义工具调用的输出。
        可以是字符串或输出内容的列表。

        - `StringOutput = string`

          自定义工具调用输出的字符串。

        - `OutputContentList = array of ResponseInputText or ResponseInputImage or ResponseInputFile`

          自定义工具调用的文本、图像或文件输出。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            模型的文本输入。

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

      - `status: "in_progress" or "completed" or "incomplete"`

        项目的状态。以下之一： `in_progress`, `completed`，或
        `incomplete`。当项目通过 API 返回时填充。

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

            产生此工具调用的程序项调用 ID。

          - `type: "program"`

            调用方类型。始终为 `program`.

            - `"program"`

      - `created_by: optional string`

        创建该项的操作者标识符。

  - `parallel_tool_calls: boolean`

    是否允许模型并行运行工具调用。

  - `temperature: number or null`

    使用何种采样温度，介于 0 和 2 之间。较高的值（如 0.8）会使输出更加随机，而较低的值（如 0.2）会使其更加集中和确定。
    我们通常建议修改此参数或 `top_p` 但不要同时修改两者。

  - `tool_choice: ToolChoiceOptions or ToolChoiceAllowed or ToolChoiceTypes or 6 more`

    模型在生成
    响应时应如何选择要使用的工具（或工具集）。请参阅 `tools` 参数以了解如何指定模型可以调用
    哪些工具。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个（如果有）工具。

      `none` 表示模型不会调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息或调用一个或多个
      工具之间进行选择。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceAllowed object { mode, tools, type }`

      将可供模型使用的工具限制为预定义的集合。

      - `mode: "auto" or "required"`

        将可供模型使用的工具限制为预定义的集合。

        `auto` 允许模型在允许的工具中进行选择，并生成
        消息。

        `required` 要求模型调用一个或多个允许的工具。

        - `"auto"`

        - `"required"`

      - `tools: array of map[unknown]`

        应允许模型调用的工具定义列表。

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
      [了解有关内置工具的更多信息](/docs/guides/tools).

      - `type: "file_search" or "web_search_preview" or "computer" or 5 more`

        模型应使用的托管工具的类型。了解有关
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

      使用此选项强制模型调用特定函数。

      - `name: string`

        要调用的函数名称。

      - `type: "function"`

        对于函数调用，类型始终为 `function`.

        - `"function"`

    - `ToolChoiceMcp object { server_label, type, name }`

      使用此选项强制模型在远程 MCP 服务器上调用特定工具。

      - `server_label: string`

        要使用的 MCP 服务器的标签。

      - `type: "mcp"`

        对于 MCP 工具，类型始终为 `mcp`.

        - `"mcp"`

      - `name: optional string or null`

        要在服务器上调用的工具名称。

    - `ToolChoiceCustom object { name, type }`

      使用此选项强制模型调用特定的自定义工具。

      - `name: string`

        要调用的自定义工具名称。

      - `type: "custom"`

        对于自定义工具调用，类型始终为 `custom`.

        - `"custom"`

    - `SpecificProgrammaticToolCallingParam object { type }`

      - `type: "programmatic_tool_calling"`

        要调用的工具。始终 `programmatic_tool_calling`.

        - `"programmatic_tool_calling"`

    - `ToolChoiceApplyPatch object { type }`

      强制模型在执行工具调用时调用 apply_patch 工具。

      - `type: "apply_patch"`

        要调用的工具。始终 `apply_patch`.

        - `"apply_patch"`

    - `ToolChoiceShell object { type }`

      当需要工具调用时，强制模型调用 shell 工具。

      - `type: "shell"`

        要调用的工具。始终 `shell`.

        - `"shell"`

  - `tools: array of object { name, parameters, strict, 5 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

    模型在生成响应时可以调用的工具数组。你
    可以通过设置 `tool_choice` 参数来指定使用哪个工具。

    我们支持以下工具类别：

    - **内置工具**：由 OpenAI 提供的扩展
      模型能力的工具，如 [网页搜索](/docs/guides/tools-web-search)
      或 [文件搜索](/docs/guides/tools-file-search)。了解更多关于
      [内置工具](/docs/guides/tools).
    - **MCP 工具**：通过自定义 MCP 服务器与第三方系统的集成
      或预定义连接器（如 Google Drive 和 SharePoint）。了解更多关于
      [MCP 工具](/docs/guides/tools-connectors-mcp).
    - **函数调用（自定义工具）**：由你定义的函数，
      使模型能够以强类型参数调用你自己的代码
      并输出。了解更多关于
      [函数调用](/docs/guides/function-calling)。你也可以使用
      自定义工具来调用你自己的代码。

    - `Function object { name, parameters, strict, 5 more }`

      在你自己的代码中定义一个模型可以选择调用的函数。了解更多 [函数调用](https://platform.openai.com/docs/guides/function-calling).

      - `name: string`

        要调用的函数名称。

      - `parameters: map[unknown] or null`

        描述函数参数的 JSON schema 对象。

      - `strict: boolean or null`

        是否对此函数工具强制执行严格的参数验证。

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

        描述此函数字符串输出中编码的 JSON 值的 JSON schema 对象。

    - `FileSearch object { type, vector_store_ids, filters, 2 more }`

      一种从上传文件中搜索相关内容工具。了解有关 [文件搜索 工具](https://platform.openai.com/docs/guides/tools-file-search).

      - `type: "file_search"`

        文件搜索 工具的类型。始终为 `file_search`.

        - `"file_search"`

      - `vector_store_ids: array of string`

        要搜索的向量存储的 ID。

      - `filters: optional ComparisonFilter or CompoundFilter or null`

        要应用的过滤器。

        - `ComparisonFilter object { key, type, value }`

          用于使用定义的比较操作将指定的属性键与给定值进行比较的过滤器。

        - `CompoundFilter object { filters, type }`

          组合多个过滤器，使用 `and` 或 `or`.

      - `max_num_results: optional number`

        要返回的最大结果数。此数字应在 1 到 50 之间（含）。

      - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

        搜索的排名选项。

        - `hybrid_search: optional object { embedding_weight, text_weight }`

          控制混合搜索时，倒数排名融合如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

          - `embedding_weight: number`

            嵌入在倒数排名融合中的权重。

          - `text_weight: number`

            文本在倒数排名融合中的权重。

        - `ranker: optional "auto" or "default-2024-11-15"`

          用于文件搜索的排名器。

          - `"auto"`

          - `"default-2024-11-15"`

        - `score_threshold: optional number`

          文件搜索的得分阈值，一个介于 0 和 1 之间的数字。接近 1 的数字将尝试仅返回最相关的结果，但可能返回较少的结果。

    - `Computer object { type }`

      一种控制虚拟计算机的工具。了解更多关于 [计算机工具](https://platform.openai.com/docs/guides/tools-computer-use).

      - `type: "computer"`

        计算机工具的类型。始终 `computer`.

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

        计算机使用工具的类型。始终 `computer_use_preview`.

        - `"computer_use_preview"`

    - `WebSearch object { type, external_web_access, filters, 2 more }`

      搜索互联网以查找与提示相关的来源。了解更多关于
      [网页搜索 工具](/docs/guides/tools-web-search).

      - `type: "web_search" or "web_search_2025_08_26"`

        网页搜索 工具的类型。其中之一 `web_search` 或 `web_search_2025_08_26`.

        - `"web_search"`

        - `"web_search_2025_08_26"`

      - `external_web_access: optional boolean`

        为 网页搜索 允许实时互联网访问。省略时默认为 true。为 false 时，网页搜索 工具以离线/仅缓存模式运行，不会获取新的外部内容。

      - `filters: optional object { allowed_domains }  or null`

        搜索的过滤器。

        - `allowed_domains: optional array of string or null`

          搜索允许的域名。如果未提供，则允许所有域名。
          提供的域名的子域也允许。

          示例： `["pubmed.ncbi.nlm.nih.gov"]`

      - `search_context_size: optional "low" or "medium" or "high"`

        用于搜索的上下文窗口空间使用量的高级指导。其中之一 `low`, `medium`，或 `high`. `medium` 是默认值。

        - `"low"`

        - `"medium"`

        - `"high"`

      - `user_location: optional object { city, country, region, 2 more }  or null`

        用户的大致位置。

        - `city: optional string or null`

          用户的城市的自由文本输入，例如 `San Francisco`.

        - `country: optional string or null`

          两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 的用户，例如。 `US`.

        - `region: optional string or null`

          用户的地区的自由文本输入，例如 `California`.

        - `timezone: optional string or null`

          该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 的用户，例如。 `America/Los_Angeles`.

        - `type: optional "approximate"`

          位置近似类型的取值。始终为 `approximate`.

          - `"approximate"`

    - `Mcp object { server_label, type, allowed_callers, 9 more }`

      通过远程 Model Context Protocol
      (MCP) 服务器，为模型提供额外的工具访问权限。 [详细了解 MCP](/docs/guides/tools-remote-mcp).

      - `server_label: string`

        此 MCP 服务器的标签，用于在工具调用中标识该服务器。

      - `type: "mcp"`

        MCP 工具的类型。始终为 `mcp`.

        - `"mcp"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

      - `allowed_tools: optional array of string or object { read_only, tool_names }  or null`

        允许的工具名称列表，或一个过滤器对象。

        - `McpAllowedTools = array of string`

          允许的工具名称字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许哪些工具的过滤器对象。

          - `read_only: optional boolean`

            指示工具是否修改数据或为只读。如果某个
            MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            ，则将匹配此过滤器。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，既可用于
        自定义 MCP 服务器 URL，也可用于服务连接器。你的应用程序
        必须处理 OAuth 授权流程，并在此处提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中可用的那些。必须提供
        `server_url`, `connector_id`，或 `tunnel_id` 其中之一。详细了解
        服务连接器 [此处](/docs/guides/tools-remote-mcp#connectors).

        当前支持的 `connector_id` 值包括：

        - Dropbox： `connector_dropbox`
        - Gmail： `connector_gmail`
        - Google 日历： `connector_googlecalendar`
        - Google Drive： `connector_googledrive`
        - Microsoft Teams： `connector_microsoftteams`
        - Outlook 日历： `connector_outlookcalendar`
        - Outlook 邮件： `connector_outlookemail`
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

        此 MCP 工具是否已延迟并通过工具搜索发现。

      - `headers: optional map[string] or null`

        要发送到 MCP 服务器的可选 HTTP 头。用于认证
        或其他目的。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器的哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器的哪些工具需要审批。可以是
          `always`, `never`，或与需要审批的工具关联的筛选器对象
          。

          - `always: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤器对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果某个
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，则将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许哪些工具的过滤器对象。

            - `read_only: optional boolean`

              指示工具是否修改数据或为只读。如果某个
              MCP 服务器被 [标注为 `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              ，则将匹配此过滤器。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定单一审批策略。可选值为 `always` 或
          `never`。当设置为 `always`，则所有工具都需要审批。当
          设为 `never`，时，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。以下之一 `server_url`, `connector_id`，或
        `tunnel_id` 必须提供。

      - `tunnel_id: optional string`

        要使用的安全 MCP 隧道 ID，而不是直接服务器 URL。以下之一
        `server_url`, `connector_id`，或 `tunnel_id` 必须提供。

    - `CodeInterpreter object { container, type, allowed_callers }`

      一种运行 Python 代码以帮助生成提示响应的工具。

      - `container: string or object { type, file_ids, memory_limit, network_policy }`

        代码解释器容器。可以是容器 ID 或一个对象，该对象
        指定上传的文件 ID 以供你的代码使用，以及一个
        可选的 `memory_limit` 设置。

        - `string`

          容器 ID。

        - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

          代码解释器容器的配置。可以选择指定要运行代码的文件的 ID。

          - `type: "auto"`

            始终 `auto`.

            - `"auto"`

          - `file_ids: optional array of string`

            可选的上传文件列表，以供你的代码使用。

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

        设置生成图像的背景。取值之一为 `transparent`,
        `opaque`，或 `auto`。透明背景适用于
        支持的 GPT 图像模型。对于 `gpt-image-2` 和
        `gpt-image-2-2026-04-21`，此支持处于预览阶段。使用
        `transparent`，时，请将输出格式设置为 `png` 或 `webp`。默认值： `auto`.

        - `"transparent"`

        - `"opaque"`

        - `"auto"`

      - `input_fidelity: optional "high" or "low" or null`

        控制模型在匹配输入图像的风格和特征（尤其是面部特征）上付出的努力程度。此参数仅受 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本模型支持，不受 `gpt-image-1-mini`。支持。支持 `high` 和 `low`。默认值为 `low`.

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

        要使用的图像生成模型。之一 `gpt-image-1`,
        `gpt-image-1-mini`, `gpt-image-1.5`, `gpt-image-2`,
        `gpt-image-2-2026-04-21`，或 `chatgpt-image-latest`。默认值：
        `gpt-image-1`.

        - `string`

        - `"gpt-image-1" or "gpt-image-1-mini" or "gpt-image-1.5" or 2 more`

          要使用的图像生成模型。之一 `gpt-image-1`,
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

        生成图像的输出格式。之一 `png`, `webp`，或
        `jpeg`。默认值： `png`.

        - `"png"`

        - `"webp"`

        - `"jpeg"`

      - `partial_images: optional number`

        流式模式下生成的部分图像数量，范围从 0（默认值）到 3。

      - `quality: optional "low" or "medium" or "high" or "auto"`

        生成图像的质量。之一 `low`, `medium`, `high`,
        或 `auto`。默认值： `auto`.

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"auto"`

      - `size: optional string or "1024x1024" or "1024x1536" or "1536x1024" or "auto"`

        生成图像的大小。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，作为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率是实验性的，最大支持分辨率为 `3840x2160`。请求的大小还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，和 `1024x1536` 受 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，使用其中之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用其中之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

        - `string`

        - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

          生成图像的大小。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，支持任意分辨率，作为 `WIDTHxHEIGHT` 字符串，例如 `1536x864`。宽度和高度都必须能被 16 整除，且请求的宽高比必须在 1:3 到 3:1 之间。高于 `2560x1440` 的分辨率是实验性的，最大支持分辨率为 `3840x2160`。请求的大小还必须满足模型当前的像素和边缘限制。标准尺寸 `1024x1024`, `1536x1024`，和 `1024x1536` 受 GPT 图像模型支持； `auto` 支持允许自动调整大小的模型。对于 `dall-e-2`，使用其中之一 `256x256`, `512x512`，或 `1024x1024`。对于 `dall-e-3`，使用其中之一 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

        此工具是否应延迟处理并通过工具搜索发现。

      - `description: optional string`

        自定义工具的可选描述，用于提供更多上下文。

      - `format: optional CustomToolInputFormat`

        自定义工具的输入格式。默认是无约束文本。

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

            是否应延迟此函数并通过工具搜索发现。

          - `description: optional string or null`

          - `output_schema: optional map[unknown] or null`

            一个 JSON Schema，描述此函数工具字符串输出中编码的 JSON 值。这不描述内容数组输出。

          - `parameters: optional unknown or null`

          - `strict: optional boolean or null`

            是否强制执行严格的参数验证。如果省略，Responses 会在 schema 兼容时尝试使用严格验证，否则回退到非严格验证。

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

            此工具是否应延迟处理并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认是无约束文本。

      - `type: "namespace"`

        工具的类型。始终 `namespace`.

        - `"namespace"`

    - `ToolSearch object { type, description, execution, parameters }`

      用于延迟工具的托管或 BYOT 工具搜索配置。

      - `type: "tool_search"`

        工具的类型。始终 `tool_search`.

        - `"tool_search"`

      - `description: optional string or null`

        为客户端执行的工具搜索工具向模型显示的描述。

      - `execution: optional "server" or "client"`

        工具搜索是由服务端还是客户端执行的。

        - `"server"`

        - `"client"`

      - `parameters: optional unknown or null`

        客户端执行的工具搜索工具的参数 schema。

    - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

      此工具搜索网页以获取响应中使用的相关结果。了解更多关于 [网页搜索 工具](https://platform.openai.com/docs/guides/tools-web-search).

      - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

        网页搜索 工具的类型。其中之一 `web_search_preview` 或 `web_search_preview_2025_03_11`.

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

          位置近似类型的取值。始终为 `approximate`.

          - `"approximate"`

        - `city: optional string or null`

          用户的城市的自由文本输入，例如 `San Francisco`.

        - `country: optional string or null`

          两个字母的 [ISO 国家代码](https://en.wikipedia.org/wiki/ISO_3166-1) 的用户，例如。 `US`.

        - `region: optional string or null`

          用户的地区的自由文本输入，例如 `California`.

        - `timezone: optional string or null`

          该 [IANA 时区](https://timeapi.io/documentation/iana-timezones) 的用户，例如。 `America/Los_Angeles`.

    - `ApplyPatch object { type, allowed_callers }`

      允许助手使用统一差异创建、删除或更新文件。

      - `type: "apply_patch"`

        工具的类型。始终 `apply_patch`.

        - `"apply_patch"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

  - `top_p: number or null`

    一种替代温度采样的方法，称为核采样，
    其中模型考虑具有 top_p 概率质量的 token 结果
    。因此 0.1 意味着只考虑构成前 10% 概率质量的 token
    。

    我们通常建议修改此参数或 `temperature` 但不要同时修改两者。

  - `background: optional boolean or null`

    是否在后台运行模型响应。
    [了解更多](/docs/guides/background).

  - `completed_at: optional number or null`

    此响应完成时的 Unix 时间戳（秒）。
    仅在状态为 `completed`.

  - `conversation: optional object { id }  or null`

    此响应所属的对话。此响应的输入项和输出项会自动添加到该对话中。

    - `id: string`

      与此响应关联的对话的唯一 ID。

  - `max_output_tokens: optional number or null`

    响应可生成的 token 数量上限，包括可见的输出 token 和 [推理 token](/docs/guides/reasoning).

  - `max_tool_calls: optional number or null`

    单个响应中可处理的内置工具调用总次数的上限。此上限适用于所有内置工具调用，而非针对单个工具。模型后续任何调用工具的尝试都将被忽略。

  - `moderation: optional object { input, output }  or null`

    如果请求了经审核的补全，则为响应输入和输出的审核结果。

    - `input: object { categories, category_applied_input_types, category_scores, 3 more }  or object { code, message, type }`

      响应输入的审核结果。

      - `ModerationResult object { categories, category_applied_input_types, category_scores, 3 more }`

        对响应输入或输出产生的审核结果。

        - `categories: map[boolean]`

          将审核类别映射到布尔值的字典，如果输入在该类别下被标记，则为 True。

        - `category_applied_input_types: map[array of "text" or "image"]`

          每个类别的分数反映了哪些输入模态。

          - `"text"`

          - `"image"`

        - `category_scores: map[number]`

          将审核类别映射到分数的字典。

        - `flagged: boolean`

          指示内容是否被任何类别标记的布尔值。

        - `model: string`

          产生该结果的审核模型。

        - `type: "moderation_result"`

          对象类型，始终为 `moderation_result` 对于成功的审核结果。

          - `"moderation_result"`

      - `Error object { code, message, type }`

        尝试对响应输入或输出进行审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error` 对于审核失败。

          - `"error"`

    - `output: object { categories, category_applied_input_types, category_scores, 3 more }  or object { code, message, type }`

      响应输出的审核结果。

      - `ModerationResult object { categories, category_applied_input_types, category_scores, 3 more }`

        对响应输入或输出产生的审核结果。

        - `categories: map[boolean]`

          将审核类别映射到布尔值的字典，如果输入在该类别下被标记，则为 True。

        - `category_applied_input_types: map[array of "text" or "image"]`

          每个类别的分数反映了哪些输入模态。

          - `"text"`

          - `"image"`

        - `category_scores: map[number]`

          将审核类别映射到分数的字典。

        - `flagged: boolean`

          指示内容是否被任何类别标记的布尔值。

        - `model: string`

          产生该结果的审核模型。

        - `type: "moderation_result"`

          对象类型，始终为 `moderation_result` 对于成功的审核结果。

          - `"moderation_result"`

      - `Error object { code, message, type }`

        尝试对响应输入或输出进行审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误消息。

        - `type: "error"`

          对象类型，始终为 `error` 对于审核失败。

          - `"error"`

  - `output_text: optional string or null`

    SDK 独有的便捷属性，包含聚合的文本输出
    来自所有 `output_text` 数组中的 `output` 项目（如果有）。
    Python 和 JavaScript SDK 支持此功能。

  - `previous_response_id: optional string or null`

    先前发送给模型的响应的唯一 ID。使用此 ID
    可创建多轮对话。了解更多
    [对话状态](/docs/guides/conversation-state)。不能与 `conversation`.

  - `prompt: optional ResponsePrompt or null`

    对提示词模板及其变量的引用。
    [了解更多](/docs/guides/text?api-mode=responses#reusable-prompts).

    - `id: string`

      要使用的提示词模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的值映射，用于替换你的
      提示词中的变量。替换值可以是字符串，也可以是其他
      Responses 输入类型，如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        模型的文本输入。

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送给模型的图像输入。了解 [图像输入](/docs/guides/vision).

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

    - `version: optional string or null`

      提示词模板的可选版本。

  - `prompt_cache_key: optional string or null`

    OpenAI 使用此字段为相似请求缓存响应，以优化缓存命中率。替代 `user` 字段。 [了解更多](/docs/guides/prompt-caching).

  - `prompt_cache_options: optional object { mode, ttl }`

    应用于响应的提示缓存选项。适用于 `gpt-5.6` 及更高版本的模型。

    - `mode: "implicit" or "explicit"`

      是否启用了隐式提示缓存断点。

      - `"implicit"`

      - `"explicit"`

    - `ttl: "30m"`

      应用于每个缓存断点的最短生命周期。

      - `"30m"`

  - `prompt_cache_retention: optional "in_memory" or "24h" or null`

    已弃用。请使用 `prompt_cache_options.ttl` 代替。

    提示缓存的保留策略。设置为 `24h` 以启用扩展提示缓存，其可使缓存的提示前缀保持更长时间的活跃，最长可达24小时。 [了解更多](/docs/guides/prompt-caching#prompt-cache-retention).
    该字段表示最长保留策略，而
    `prompt_cache_options.ttl` 表示最短缓存生命周期。这两个
    字段相互独立，互不影响。
    对于 `gpt-5.5`, `gpt-5.5-pro`，以及未来的模型，仅有 `24h` 受支持。

    对于同时支持这两个参数的较旧模型， `in_memory` 和 `24h`，默认值取决于你所在组织的数据保留策略：

    - 未启用ZDR的组织默认为 `24h`.
    - 启用ZDR的组织默认为 `in_memory` 当 `prompt_cache_retention` 未被指定时。

    - `"in_memory"`

    - `"24h"`

  - `reasoning: optional Reasoning or null`

    **仅适用于gpt-5和o系列模型**

    的配置选项
    [推理模型](https://platform.openai.com/docs/guides/reasoning).

    - `context: optional "auto" or "current_turn" or "all_turns" or null`

      控制在后续轮次中哪些推理项会被回传给模型。
      如果省略或设置为 `auto`，则模型自行决定上下文模式。
      `gpt-5.6` 模型系列默认为 `all_turns`；较早的模型默认为
      `current_turn`.

      当在响应中返回时，这是有效的推理上下文模式
      用于该响应。

      - `"auto"`

      - `"current_turn"`

      - `"all_turns"`

    - `effort: optional ReasoningEffort or null`

      限制推理模型的推理努力程度。目前支持
      的值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
      降低推理努力程度可以带来更快的响应和更少的令牌消耗
      用于响应中的推理。并非所有推理模型都支持每个
      值。请参阅
      [推理指南](https://platform.openai.com/docs/guides/reasoning)
      以了解模型特定的支持情况。

      - `"none"`

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

      - `"max"`

    - `generate_summary: optional "auto" or "concise" or "detailed" or null`

      **已弃用：** 请使用 `summary` 代替。

      模型执行的推理摘要。这对于
      调试和理解模型的推理过程很有帮助。
      之一 `auto`, `concise`，或 `detailed`.

      - `"auto"`

      - `"concise"`

      - `"detailed"`

    - `mode: optional string or "standard" or "pro"`

      控制请求的推理执行模式。

      当在响应中返回时，这是有效的执行模式。

      - `string`

      - `"standard" or "pro"`

        控制请求的推理执行模式。

        当在响应中返回时，这是有效的执行模式。

        - `"standard"`

        - `"pro"`

    - `summary: optional "auto" or "concise" or "detailed" or null`

      模型执行的推理摘要。这对于
      调试和理解模型的推理过程很有帮助。
      之一 `auto`, `concise`，或 `detailed`.

      `concise` 支持用于 `computer-use-preview` 模型以及之后的所有推理模型 `gpt-5`.

      - `"auto"`

      - `"concise"`

      - `"detailed"`

  - `safety_identifier: optional string or null`

    一个稳定的标识符，用于帮助检测可能违反 OpenAI 使用政策的应用程序用户。
    该 ID 应为唯一标识每个用户的字符串，最大长度为 64 个字符。我们建议对用户名或电子邮件地址进行哈希处理，以避免向我们发送任何可识别信息。 [了解更多](/docs/guides/safety-best-practices#safety-identifiers).

  - `service_tier: optional ServiceTier or null`

    指定用于处理请求的处理类型。

    - 如果设置为 'auto'，则请求将使用项目设置中配置的服务层级进行处理。除非另有配置，否则项目将使用 'default'。
    - 如果设置为 'default'，则请求将按所选模型的标准定价和性能进行处理。
    - 如果设置为 '[flex](/docs/guides/flex-processing)'，则请求将使用 Flex 处理服务层级进行处理。
    - 要在请求级别选择 [快速模式](/api/docs/guides/fast-mode) ，请为 Responses 或 Chat Completions 包含 `service_tier=fast` 或 `service_tier=priority` 参数。响应将显示 `service_tier=priority` ，无论你是否指定 `service_tier=fast` 或 `priority` 在请求中。
    - 如果设置为 'ultrafast'，则请求将使用访问受控的 Ultrafast 处理服务层级进行处理。该层级目前可用于 `gpt-5.6-sol`；通过它提供的响应将显示 `service_tier=ultrafast`.
    - 未设置时，默认行为为 'auto'。

    当 `service_tier` 参数设置后，响应正文将包含 `service_tier` 值，该值基于实际用于处理请求的处理模式。此响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

    - `"ultrafast"`

  - `status: optional ResponseStatus`

    响应生成的状态。可选值之一为 `completed`, `failed`,
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

    - [文本输入和输出](/docs/guides/text)
    - [结构化输出](/docs/guides/structured-outputs)

    - `format: optional ResponseFormatTextConfig`

      一个对象，指定模型必须输出的格式。

      配置 `{ "type": "json_schema" }` 启用结构化输出，
      这确保模型将匹配你提供的 JSON schema。在
      [结构化输出指南](/docs/guides/structured-outputs).

      默认格式为 `{ "type": "text" }` ，无额外选项。

      **不建议用于 gpt-4o 及更新模型：**

      设置为 `{ "type": "json_object" }` 启用旧的 JSON 模式，该模式
      确保模型生成的消息是有效的 JSON。使用 `json_schema`
      对于支持该模式的模型是首选。

      - `ResponseFormatText object { type }`

        默认响应格式。用于生成文本响应。

        - `type: "text"`

          所定义的响应格式的类型。始终为 `text`.

          - `"text"`

      - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

        JSON Schema 响应格式。用于生成结构化 JSON 响应。
        了解更多关于 [结构化输出](/docs/guides/structured-outputs).

        - `name: string`

          响应格式的名称。必须为 a-z、A-Z、0-9 或包含
          下划线和短划线，最大长度为 64。

        - `schema: map[unknown]`

          响应格式的模式，以 JSON Schema 对象描述。
          了解如何构建 JSON schema [此处](https://json-schema.org/).

        - `type: "json_schema"`

          所定义的响应格式的类型。始终为 `json_schema`.

          - `"json_schema"`

        - `description: optional string`

          响应格式用途的描述，模型将据此
          决定如何以该格式进行响应。

        - `strict: optional boolean or null`

          是否在生成输出时启用严格模式模式遵循。
          如果设置为 true，模型将始终遵循定义的精确模式
          ，位于 `schema` 字段中。当
          `strict` 是 `true`。时，仅支持 JSON Schema 的一个子集。要了解更多，请阅读 [结构化输出
          指南](/docs/guides/structured-outputs).

      - `ResponseFormatJSONObject object { type }`

        JSON 对象响应格式。一种生成 JSON 响应的较旧方法。
        建议对支持该格式的模型使用 `json_schema` 。请注意，该
        模型在没有系统或用户消息指示它
        这样做时，不会生成 JSON。

        - `type: "json_object"`

          所定义的响应格式的类型。始终为 `json_object`.

          - `"json_object"`

    - `verbosity: optional "low" or "medium" or "high" or null`

      限制模型响应的详细程度。较低的值将导致
      更简洁的响应，而较高的值将导致更冗长的响应。
      当前支持的值有 `low`, `medium`，和 `high`。默认值为
      `medium`.

      - `"low"`

      - `"medium"`

      - `"high"`

  - `top_logprobs: optional number or null`

    一个介于 0 和 20 之间的整数，指定每个 token 位置上最可能的
    token 返回的最大数量，每个 token 附带相关的对数
    概率。在某些情况下，返回的 token 数量可能少于
    请求的数量。

  - `truncation: optional "auto" or "disabled" or null`

    模型响应使用的截断策略。

    - `auto`：如果此响应的输入超过
      模型的上下文窗口大小，模型将通过从对话开头丢弃条目来截断
      响应以适配上下文窗口。
    - `disabled` （默认）：如果输入大小会超过模型的上下文窗口
      大小，则请求将以 400 错误失败。

    - `"auto"`

    - `"disabled"`

  - `usage: optional ResponseUsage`

    表示 token 使用详情，包括输入 token、输出 token、
    输出 token 的细分以及使用的总 token 数。

    - `input_tokens: number`

      输入 token 的数量。

    - `input_tokens_details: object { cache_write_tokens, cached_tokens }`

      输入 token 的详细细分。

      - `cache_write_tokens: number`

        已写入缓存的输入 token 数量。

      - `cached_tokens: number`

        从缓存中检索到的 token 数量。
        [有关提示缓存的更多信息](/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出 token 的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出 token 的详细细分。

      - `reasoning_tokens: number`

        推理令牌的数量。

    - `total_tokens: number`

      使用的令牌总数。

  - `user: optional string`

    此字段正被 `safety_identifier` 和 `prompt_cache_key`。取代。请使用 `prompt_cache_key` 以维持缓存优化。
    用于标识最终用户的稳定标识符。
    通过更好地对相似请求进行分桶来提高缓存命中率，并帮助 OpenAI 检测和防止滥用。 [了解更多](/docs/guides/safety-best-practices#safety-identifiers).

### 示例

```http
curl https://api.openai.com/v1/responses/$RESPONSE_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
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
    "total_tokens": 0
  },
  "user": "user-1234"
}
```

### 示例

```http
curl https://api.openai.com/v1/responses/resp_123 \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "resp_67cb71b351908190a308f3859487620d06981a8637e6bc44",
  "object": "response",
  "created_at": 1741386163,
  "status": "completed",
  "completed_at": 1741386164,
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "model": "gpt-4o-2024-08-06",
  "output": [
    {
      "type": "message",
      "id": "msg_67cb71b3c2b0819084d481baaaf148f206981a8637e6bc44",
      "status": "completed",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "Silent circuits hum,  \nThoughts emerge in data streams—  \nDigital dawn breaks.",
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
    "input_tokens": 32,
    "input_tokens_details": {
      "cached_tokens": 0,
      "cache_write_tokens": 0
    },
    "output_tokens": 18,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 50
  },
  "user": null,
  "metadata": {}
}
```
