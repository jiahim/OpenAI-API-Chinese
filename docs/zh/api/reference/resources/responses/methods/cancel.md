> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 获取文档页面的 Markdown 版本。

## 取消响应

**post** `/responses/{response_id}/cancel`

取消具有给定 ID 的模型响应。仅取消使用
该 `background` 参数设置为 `true` 创建的响应。
[了解更多](/api/docs/guides/background).

### 路径参数

- `response_id: string`

### 返回

- `Response object { id, access_programs, created_at, 34 more }`

  - `id: string`

    此 Response 的唯一标识符。

  - `access_programs: object { cyber }  or null`

    - `cyber: "standard" or "daybreak_blue" or "daybreak_red"`

      用于此响应的有效 Cyber 访问程序。

      - `"standard"`

      - `"daybreak_blue"`

      - `"daybreak_red"`

  - `created_at: number`

    此 Response 创建时的 Unix 时间戳（以秒为单位）。

  - `error: ResponseError or null`

    当模型未能生成 Response 时返回的错误对象。

    - `code: "server_error" or "rate_limit_exceeded" or "invalid_prompt" or 18 more`

      响应的错误代码。

      - `"server_error"`

      - `"rate_limit_exceeded"`

      - `"invalid_prompt"`

      - `"data_residency_mismatch"`

      - `"bio_policy"`

      - `"misalignment_policy_violation"`

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

      人类可读的错误描述。

    - `misalignment: optional object { detailed_explanation, error_type, steer }`

      - `detailed_explanation: optional string`

        此拦截的公开说明。

      - `error_type: optional string or "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

        可选的分类；客户端必须接受额外的取值。

        - `string`

        - `SafetyAlertErrorType = "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

          可选的分类；客户端必须接受额外的取值。

          - `"potentially_unintended_data_transfer"`

          - `"potentially_unintended_data_access"`

          - `"potentially_unintended_destructive_activity"`

          - `"other"`

      - `steer: optional object { message }`

        可选的公开 延续 指令。

        - `message: string`

          公开的 延续 指令。

  - `incomplete_details: object { reason }  or null`

    有关响应未完成原因的详细信息。

    - `reason: optional "max_output_tokens" or "max_messages" or "content_filter" or "steered"`

      响应未完成的原因。 `steered` 表示
      响应在一个
      WebSocket `response.steer` 事件后的安全输出边界处停止。然后服务器可以使用队列中的输入自动创建
      一个后续响应。

      - `"max_output_tokens"`

      - `"max_messages"`

      - `"content_filter"`

      - `"steered"`

  - `instructions: string or array of EasyInputMessage or object { content, role, status, type }  or ResponseOutputMessage or 30 more or null`

    插入到模型上下文中的系统（或开发者）消息。

    当与 `previous_response_id`，一起使用时，来自上一个的指令
    响应不会延续到下一次响应中。这样便于你在新的响应中替换 system（或 developer）消息。
    在新的响应中替换 system（或 developer）消息。

    - `string`

      向模型传入的文本输入，等价于带有
      `developer` role 的文本输入。

    - `InputItemList = array of EasyInputMessage or object { content, role, status, type }  or ResponseOutputMessage or 30 more`

      向模型传入的一个或多个输入项的列表，其中包含
      不同的内容类型。

      - `EasyInputMessage object { content, role, phase, type }`

        向模型传入的消息输入，带有指示指令层级关系的
        role。使用 `developer` 或 `system` role 提供的指令
        优先于使用 `user` role 提供的指令。带有
        `assistant` role 的消息被假定为模型在之前
        交互中生成的内容。

        - `content: string or ResponseInputMessageContentList`

          向模型传入的文本、图像或音频输入，用于生成响应。
          也可以包含之前的助手响应。

          - `TextInput = string`

            向模型传入的文本输入。

          - `ResponseInputMessageContentList = array of ResponseInputContent`

            向模型传入的一个或多个输入项的列表，包含不同的内容
            类型。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              向模型传入的文本输入。

              - `text: string`

                向模型传入的文本输入。

              - `type: "input_text"`

                输入项的类型。始终为 `input_text`.

                - `"input_text"`

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会对齐到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputImage object { detail, type, file_id, 2 more }`

              发送到模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

              - `detail: ImageDetail`

                发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。之一。默认为 `auto`.

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

                要发送给模型的图片的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图片。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会对齐到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputFile object { type, detail, file_data, 4 more }`

              发送给模型的文件输入。

              - `type: "input_file"`

                输入项的类型。始终为 `input_file`.

                - `"input_file"`

              - `detail: optional "auto" or "low" or "high"`

                发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 会使用高质量渲染，这可能会增加输入 token 用量。使用 `low` 可获得更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

                - `"auto"`

                - `"low"`

                - `"high"`

              - `file_data: optional string`

                要发送给模型的文件内容。

              - `file_id: optional string or null`

                发送给模型的文件的 ID。

              - `file_url: optional string`

                要发送给模型的文件的 URL。

              - `filename: optional string`

                要发送给模型的文件的名称。

              - `prompt_cache_breakpoint: optional object { mode }`

                标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会对齐到 token 块。

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

          将消息标记为 `assistant` 中间推理（`commentary`）或最终答案（`final_answer`).
          对于类似 `gpt-5.3-codex` 及更高模型，在发送后续请求时，请保留并重新发送
          阶段于所有助手消息——丢弃它可能会降低性能。不用于用户消息。

          - `"commentary"`

          - `"final_answer"`

        - `type: optional "message"`

          消息输入的类型，恒为 `message`.

          - `"message"`

      - `Message object { content, role, status, type }`

        向模型传入的消息输入，带有指示指令层级关系的
        role。使用 `developer` 或 `system` role 提供的指令
        优先于使用 `user` role 的文本输入。

        - `content: ResponseInputMessageContentList`

          向模型传入的一个或多个输入项的列表，包含不同的内容
          类型。

        - `role: "user" or "system" or "developer"`

          消息输入的角色，取值为 `user`, `system`，或 `developer`.

          - `"user"`

          - `"system"`

          - `"developer"`

        - `status: optional "in_progress" or "completed" or "incomplete"`

          项的状态，取值为 `in_progress`, `completed`，或
          `incomplete`。当通过 API 返回项时填充。

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

        - `type: optional "message"`

          消息输入的类型，恒设为 `message`.

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

                  被引用文件的文件名。

                - `index: number`

                  在输出文本中插入文件引用的位置索引。

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

            模型的拒绝回复。

            - `refusal: string`

              模型给出的拒绝原因说明。

            - `type: "refusal"`

              拒绝的类型。始终为 `refusal`.

              - `"refusal"`

        - `role: "assistant"`

          输出消息的角色。始终为 `assistant`.

          - `"assistant"`

        - `status: "in_progress" or "completed" or "incomplete"`

          输入消息的状态，取值之一 `in_progress`, `completed`，或
          `incomplete`。当输入项通过 API 返回时填充。

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

        - `type: "message"`

          输出消息的类型。始终为 `message`.

          - `"message"`

        - `phase: optional "commentary" or "final_answer" or null`

          将消息标记为 `assistant` 中间推理（`commentary`）或最终答案（`final_answer`).
          对于类似 `gpt-5.3-codex` 及更高模型，在发送后续请求时，请保留并重新发送
          阶段于所有助手消息——丢弃它可能会降低性能。不用于用户消息。

          - `"commentary"`

          - `"final_answer"`

      - `FileSearchCall object { id, queries, status, 2 more }`

        文件搜索 工具调用的结果。详见
        [文件搜索 指南](/api/docs/guides/tools-file-search) 了解更多信息。

        - `id: string`

          文件搜索 工具调用的唯一 ID。

        - `queries: array of string`

          用于搜索文件的查询语句。

        - `status: "in_progress" or "searching" or "completed" or 2 more`

          文件搜索 工具调用的状态。取值之一 `in_progress`,
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

            可以附加到对象的 16 个键值对。可用于
            以结构化格式存储有关对象的附加信息，以及
            通过 API 或控制台查询对象。键为字符串，
            最大长度为 64 个字符。值为字符串，最大
            长度为 512 个字符、布尔值或数字。

            - `string`

            - `number`

            - `boolean`

          - `file_id: optional string`

            文件的唯一 ID。

          - `filename: optional string`

            文件的名称。

          - `score: optional number`

            文件的相关性得分，取值范围为 0 到 1。

          - `text: optional string`

            从文件中检索到的文本。

      - `ComputerCall object { id, call_id, pending_safety_checks, 4 more }`

        对 computer use 工具的工具调用。参阅
        [computer use 指南](/api/docs/guides/tools-computer-use) 了解更多信息。

        - `id: string`

          计算机调用的唯一 ID。

        - `call_id: string`

          在向工具调用返回输出时使用的标识符。

        - `pending_safety_checks: array of object { id, code, message }`

          针对计算机调用的待处理安全检查。

          - `id: string`

            待处理安全检查的 ID。

          - `code: optional string or null`

            待处理安全检查的类型。

          - `message: optional string or null`

            关于待处理安全检查的详细信息。

        - `status: "in_progress" or "completed" or "incomplete"`

          该项的状态。取值为以下之一： `in_progress`, `completed`，或
          `incomplete`。当通过 API 返回项时填充。

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

              表示点击时按下的鼠标按键。取值为以下之一： `left`, `right`, `wheel`, `back`，或 `forward`.

              - `"left"`

              - `"right"`

              - `"wheel"`

              - `"back"`

              - `"forward"`

            - `type: "click"`

              指定事件类型。对于点击操作，该属性始终为 `click`.

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

            模型希望执行的一组按键操作。

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

          的扁平化批量操作。每个操作都包含一个 `computer_use`。鉴别器字段以及操作特有的字段。
          `type` 鉴别器字段以及操作特有的字段。

          - `Click object { button, type, x, 2 more }`

            点击操作。

          - `DoubleClick object { keys, type, x, y }`

            双击操作。

          - `Drag object { path, type, keys }`

            拖动操作。

          - `Keypress object { keys, type }`

            模型希望执行的一组按键操作。

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

            包含截图的上传文件的标识符。

          - `image_url: optional string`

            截图图片的 URL。

        - `type: "computer_call_output"`

          计算机工具调用输出的类型。始终为 `computer_call_output`.

          - `"computer_call_output"`

        - `id: optional string or null`

          计算机工具调用输出的 ID。

        - `acknowledged_safety_checks: optional array of object { id, code, message }  or null`

          已由开发者确认的 API 上报的安全检查结果。

          - `id: string`

            待处理安全检查的 ID。

          - `code: optional string or null`

            待处理安全检查的类型。

          - `message: optional string or null`

            关于待处理安全检查的详细信息。

        - `status: optional "in_progress" or "completed" or "incomplete" or null`

          输入消息的状态，取值之一 `in_progress`, `completed`，或 `incomplete`。当输入项通过 API 返回时填充。

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

      - `WebSearchCall object { id, status, type, action }`

        网页搜索 工具调用的结果。详见
        [网页搜索 指南](/api/docs/guides/tools-web-search) 了解更多信息。

        - `id: string`

          网页搜索 工具调用的唯一 ID。

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

        - `action: optional object { type, queries, query, sources }  or object { type, url }  or object { pattern, type, url }`

          描述本次 网页搜索 调用中所执行具体操作的对象。
          包含模型使用网络的方式的详细信息（search、open_page、find_in_page）。

          - `Search object { type, queries, query, sources }`

            操作类型 "search" - 执行 网页搜索 查询。

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

            操作类型 "open_page" - 打开搜索结果中的指定 URL。

            - `type: "open_page"`

              操作类型。

              - `"open_page"`

            - `url: optional string or null`

              模型打开的 URL。

          - `FindInPage object { pattern, type, url }`

            Action type "find_in_page"：在已加载的页面中搜索某个模式。

            - `pattern: string`

              要在页面内搜索的模式或文本。

            - `type: "find_in_page"`

              操作类型。

              - `"find_in_page"`

            - `url: string`

              搜索该模式的目标页面的 URL。

      - `FunctionCall object { arguments, call_id, name, 6 more }`

        用于运行函数的工具调用。参见
        [function calling guide](/api/docs/guides/function-calling) 了解更多信息。

        - `arguments: string`

          传递给该函数的参数的 JSON 字符串。

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

          该函数工具调用是否异步运行。

        - `caller: optional object { type }  or object { caller_id, type }  or null`

          产生该工具调用的执行上下文。

          - `Direct object { type }`

            - `type: "direct"`

              - `"direct"`

          - `Program object { caller_id, type }`

            - `caller_id: string`

              产生该工具调用的程序项的调用 ID。

            - `type: "program"`

              - `"program"`

        - `namespace: optional string`

          要运行的函数的命名空间。

        - `status: optional "in_progress" or "completed" or "incomplete"`

          该项的状态。取值为以下之一： `in_progress`, `completed`，或
          `incomplete`。当通过 API 返回项时填充。

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

              向模型传入的文本输入。

              - `text: string`

                向模型传入的文本输入。

              - `type: "input_text"`

                输入项的类型。始终为 `input_text`.

                - `"input_text"`

              - `prompt_cache_breakpoint: optional object { mode }  or null`

                标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会对齐到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputImageContent object { type, detail, file_id, 2 more }`

              发送到模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision)

              - `type: "input_image"`

                输入项的类型。始终为 `input_image`.

                - `"input_image"`

              - `detail: optional ImageDetail or null`

                发送给模型的图像的细节级别。可选值为 `high`, `low`, `auto`，或 `original`。之一。默认为 `auto`.

              - `file_id: optional string or null`

                发送给模型的文件的 ID。

              - `image_url: optional string or null`

                要发送给模型的图片的 URL。可以是完全限定的 URL，也可以是 data URL 中的 base64 编码图片。

              - `prompt_cache_breakpoint: optional object { mode }  or null`

                标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会对齐到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `ResponseInputFileContent object { type, detail, file_data, 4 more }`

              发送给模型的文件输入。

              - `type: "input_file"`

                输入项的类型。始终为 `input_file`.

                - `"input_file"`

              - `detail: optional "auto" or "low" or "high"`

                发送给模型的文件的细节级别。使用 `auto` 可让系统选择细节级别；对于 GPT-5.6 及更高版本的模型， `auto` 会使用高质量渲染，这可能会增加输入 token 用量。使用 `low` 可获得更低成本的渲染，或使用 `high` 以更高质量渲染文件。默认为 `auto`.

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

                标记可复用提示前缀的精确结束位置。该断点从请求的 `prompt_cache_options.ttl`；继承其 TTL；边界不会对齐到 token 块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

        - `type: "function_call_output"`

          函数工具调用输出的类型。始终为 `function_call_output`.

          - `"function_call_output"`

        - `id: optional string or null`

          函数工具调用的唯一 ID。当此条目通过 API 返回时填充。

        - `call_id: optional string or null`

          由模型生成的函数工具调用的唯一 ID。

        - `caller: optional object { type }  or object { caller_id, type }  or null`

          产生该工具调用的执行上下文。

          - `Direct object { type }`

            - `type: "direct"`

              调用方类型。始终为 `direct`.

              - `"direct"`

          - `Program object { caller_id, type }`

            - `caller_id: string`

              产生该工具调用的程序项的调用 ID。

            - `type: "program"`

              调用方类型。始终为 `program`.

              - `"program"`

        - `name: optional string or null`

          生成该输出的工具的名称。

        - `namespace: optional string or null`

          生成该输出的工具的命名空间。

        - `status: optional "in_progress" or "completed" or "incomplete" or null`

          该项的状态。取值为以下之一： `in_progress`, `completed`，或 `incomplete`。当通过 API 返回项时填充。

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

            在你自己的代码中定义一个可供模型选择调用的函数。了解更多关于 [函数调用](/api/docs/guides/function-calling).

            - `name: string`

              要调用的函数的名称。

            - `parameters: map[unknown] or null`

              描述函数参数的 JSON schema 对象。

            - `strict: boolean or null`

              是否对此函数工具强制执行严格的参数校验。

            - `type: "function"`

              函数工具的类型。始终为 `function`.

              - `"function"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

            - `defer_loading: optional boolean`

              此函数是否被延迟并通过工具搜索加载。

            - `description: optional string or null`

              函数的描述。供模型用于判断是否调用该函数。

            - `output_schema: optional map[unknown] or null`

              描述此函数字符串输出中所编码 JSON 值的 JSON schema 对象。

          - `FileSearch object { type, vector_store_ids, filters, 2 more }`

            从已上传文件中搜索相关内容的工具。详细了解 [文件搜索工具](/api/docs/guides/tools-file-search).

            - `type: "file_search"`

              文件搜索工具的类型，始终 `file_search`.

              - `"file_search"`

            - `vector_store_ids: array of string`

              要搜索的向量存储的 ID。

            - `filters: optional ComparisonFilter or CompoundFilter or null`

              要应用的筛选条件。

              - `ComparisonFilter object { key, type, value }`

                用于使用已定义的比较操作将指定属性键与给定值进行比较的筛选条件。

                - `key: string`

                  要与值进行比较的键。

                - `type: "eq" or "ne" or "gt" or 5 more`

                  指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

                  - `eq`：等于
                  - `ne`：不等于
                  - `gt`：大于
                  - `gte`：大于等于
                  - `lt`：小于
                  - `lte`：小于等于
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

                - `filters: array of ComparisonFilter or CompoundFilter`

                  要组合的筛选条件数组。项可以是 `ComparisonFilter` 或 `CompoundFilter`.

                  - `ComparisonFilter object { key, type, value }`

                    用于使用已定义的比较操作将指定属性键与给定值进行比较的筛选条件。

                  - `CompoundFilter object { filters, type }`

                    使用以下方式组合多个筛选条件 `and` 或 `or`.

                - `type: "and" or "or"`

                  操作类型： `and` 或 `or`.

                  - `"and"`

                  - `"or"`

            - `max_num_results: optional number`

              返回结果的最大数量。该数量应在 1 到 50 之间（含两端）。

            - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

              搜索的排序选项。

              - `hybrid_search: optional object { embedding_weight, text_weight }`

                控制倒数排名融合在启用混合搜索时如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

                - `embedding_weight: number`

                  倒数排名融合中嵌入的权重。

                - `text_weight: number`

                  倒数排名融合中文本的权重。

              - `ranker: optional "auto" or "default-2024-11-15"`

                用于文件搜索的排序器。

                - `"auto"`

                - `"default-2024-11-15"`

              - `score_threshold: optional number`

                文件搜索的分数阈值，取值范围为 0 到 1。越接近 1 的数值会尝试仅返回最相关的结果，但可能返回的结果更少。

          - `Computer object { type }`

            用于控制虚拟计算机的工具。了解更多关于 [computer 工具](/api/docs/guides/tools-computer-use).

            - `type: "computer"`

              computer 工具的类型。始终为 `computer`.

              - `"computer"`

          - `ComputerUsePreview object { display_height, display_width, environment, type }`

            用于控制虚拟计算机的工具。了解更多关于 [computer 工具](/api/docs/guides/tools-computer-use).

            - `display_height: number`

              计算机显示的高度。

            - `display_width: number`

              计算机显示的宽度。

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
            [网页搜索工具](/api/docs/guides/tools-web-search).

            - `type: "web_search" or "web_search_2025_08_26"`

              网页搜索工具的类型之一，为 `web_search` 或 `web_search_2025_08_26`.

              - `"web_search"`

              - `"web_search_2025_08_26"`

            - `external_web_access: optional boolean`

              允许 网页搜索 进行实时互联网访问。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

            - `filters: optional object { allowed_domains }  or null`

              搜索的筛选条件。

              - `allowed_domains: optional array of string or null`

                搜索所允许的域名。如果未提供，则允许所有域名。
                所提供域名的子域名同样允许。

                示例： `["pubmed.ncbi.nlm.nih.gov"]`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高层级用量指导。可选值为 `low`, `medium`，或 `high`. `medium` 是默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { city, country, region, 2 more }  or null`

              用户的大致位置。如果省略或为 null，则默认为
              美国。若要避免该回退，请传入 `{"type": "approximate"}` 不包含
              字段的位置。若要本地化结果，请提供相关的位置字段。

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

            通过远程模型上下文协议
            (MCP) 服务器为模型提供对额外工具的访问。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

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

              允许的工具名称列表或筛选对象。

              - `McpAllowedTools = array of string`

                允许的工具名称组成的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是修改数据还是只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，配合
              自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
              必须处理 OAuth 授权流程并在此提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中提供的那些。必须提供
              `server_url`, `connector_id`，或 `tunnel_id` 其中之一。详细了解
              关于服务连接器的信息 [here](/api/docs/guides/tools-connectors-mcp#connectors).

              此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
              请使用 `server_url` 以连接到远程 MCP 服务器，或 `tunnel_id` 通过
              安全 MCP 隧道进行连接。

              当前支持 `connector_id` 的取值：

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

              此 MCP 工具是否被延迟，并通过工具搜索被发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器中哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器的哪些工具需要审批。可以是
                `always`, `never`,或与需要审批的工具关联的筛选对象
                。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的筛选对象。

                  - `read_only: optional boolean`

                    指示工具是修改数据还是只读。如果某个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    它将匹配此筛选条件。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的筛选对象。

                  - `read_only: optional boolean`

                    指示工具是修改数据还是只读。如果某个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    它将匹配此筛选条件。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。可选值为 `always` 或
                `never`. When set to `always`，所有工具都需要审批。When
                set to `never`，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。必须提供以下之一： `server_url`, `connector_id`，或
              `tunnel_id` 其中之一。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的 Secure MCP Tunnel ID。必须提供以下之一：
              `server_url`, `connector_id`，或 `tunnel_id` 其中之一。

          - `CodeInterpreter object { container, type, allowed_callers }`

            运行 Python 代码以帮助生成对提示词响应的工具。

            - `container: string or object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器。可以是容器 ID，也可以是一个对象，用于指定可供代码使用的已上传文件 ID，以及一个
              指定可供代码使用的已上传文件 ID 以及一个可选的
              可选的 `memory_limit` 设置。

              - `string`

                容器 ID。

              - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

                代码解释器容器的配置。可选择指定要运行代码的文件 ID。

                - `type: "auto"`

                  始终为 `auto`.

                  - `"auto"`

                - `file_ids: optional array of string`

                  可供代码使用的已上传文件可选列表。

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

                      当 type 为时的允许域名列表 `allowlist`.

                    - `type: "allowlist"`

                      仅允许对指定域名进行出站网络访问。始终 `allowlist`.

                      - `"allowlist"`

                    - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

                      允许列表中域名可选的作用域密钥。

                      - `domain: string`

                        与密钥关联的域名。

                      - `name: string`

                        要为该域名注入的密钥名称。

                      - `value: string`

                        要为该域名注入的密钥值。

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

              是生成新图像还是编辑现有图像。默认： `auto`.

              - `"generate"`

              - `"edit"`

              - `"auto"`

            - `background: optional "transparent" or "opaque" or "auto"`

              设置生成图像的背景。可选值为 `transparent`, `opaque`,
              或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
              它们的 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
              背景。受支持的 GPT Image
              模型可使用透明背景。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，此支持处于
              预览阶段。当使用 `transparent`，将输出格式设置为 `png` 或 `webp`.
              默认值： `auto`.

              - `"transparent"`

              - `"opaque"`

              - `"auto"`

            - `input_fidelity: optional "high" or "low" or null`

              控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所付出的努力程度。该参数仅支持 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不支持 `gpt-image-1-mini`。支持 `high` 和 `low`。之一。默认为 `low`.

              - `"high"`

              - `"low"`

            - `input_image_mask: optional object { file_id, image_url }`

              用于局部重绘的可选遮罩。包含 `image_url`
              （字符串，可选）和 `file_id` （字符串，可选）。

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

              在流式模式下生成的部分图像数量，范围为 0（默认值）到 3。

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

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，例如以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的长宽比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。对于 `dall-e-2`，请使用 `256x256`, `512x512`，或 `1024x1024`。之一。对于 `dall-e-3`，请使用 `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `string`

              - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

                生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，例如以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的长宽比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。对于 `dall-e-2`，请使用 `256x256`, `512x512`，或 `1024x1024`。之一。对于 `dall-e-3`，请使用 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

                  自动为该请求创建一个容器

                  - `"container_auto"`

                - `file_ids: optional array of string`

                  可供代码使用的已上传文件可选列表。

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

                      被引用技能的 ID。

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

                      内联技能载荷

                      - `data: string`

                        Base64 编码的技能 zip 包。

                      - `media_type: "application/zip"`

                        内联技能载荷的媒体类型，必须为 `application/zip`.

                        - `"application/zip"`

                      - `type: "base64"`

                        内联技能源的类型，必须为 `base64`.

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

                    包含技能的目录的路径。

              - `ContainerReference object { container_id, type }`

                - `container_id: string`

                  所引用容器的 ID。

                - `type: "container_reference"`

                  引用通过 /v1/containers 端点创建的容器

                  - `"container_reference"`

          - `Custom object { name, type, allowed_callers, 4 more }`

            使用指定格式处理输入的自定义工具。了解有关   [自定义工具](/api/docs/guides/function-calling#custom-tools)

            - `name: string`

              自定义工具的名称，用于在工具调用中标识它。

            - `type: "custom"`

              自定义工具的类型，始终为 `custom`.

              - `"custom"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

              工具响应是否可以异步返回，还是在下次创建响应时立即返回。

            - `defer_loading: optional boolean`

              此工具是否应被延迟，并通过工具搜索发现。

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

                  语法定义的语法。其一为 `lark` 或 `regex`.

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

                  此函数是否应被推迟并通过工具搜索发现。

                - `description: optional string or null`

                - `output_schema: optional map[unknown] or null`

                  描述此函数工具中以字符串形式编码的 JSON 值的 JSON Schema。此描述不适用于 content 数组形式的输出。

                - `parameters: optional unknown or null`

                - `strict: optional boolean or null`

                  是否强制执行严格的参数校验。如果省略，当 schema 兼容时，Responses 尝试使用严格校验，否则回退到非严格校验。

              - `Custom object { name, type, allowed_callers, 4 more }`

                使用指定格式处理输入的自定义工具。了解有关   [自定义工具](/api/docs/guides/function-calling#custom-tools)

                - `name: string`

                  自定义工具的名称，用于在工具调用中标识它。

                - `type: "custom"`

                  自定义工具的类型，始终为 `custom`.

                  - `"custom"`

                - `allowed_callers: optional array of "direct" or "programmatic" or null`

                  工具调用上下文。

                  - `"direct"`

                  - `"programmatic"`

                - `async: optional boolean`

                  工具响应是否可以异步返回，还是在下次创建响应时立即返回。

                - `defer_loading: optional boolean`

                  此工具是否应被延迟，并通过工具搜索发现。

                - `description: optional string`

                  自定义工具的可选描述，用于提供更多上下文。

                - `format: optional CustomToolInputFormat`

                  自定义工具的输入格式。默认为无约束文本。

            - `type: "namespace"`

              工具的类型。始终 `namespace`.

              - `"namespace"`

          - `ToolSearch object { type, description, execution, parameters }`

            针对延迟工具的托管或 BYOT 工具搜索配置。

            - `type: "tool_search"`

              工具的类型。始终 `tool_search`.

              - `"tool_search"`

            - `description: optional string or null`

              展示给模型的、用于客户端执行工具搜索工具的描述。

            - `execution: optional "server" or "client"`

              工具搜索由服务端还是由客户端执行。

              - `"server"`

              - `"client"`

            - `parameters: optional unknown or null`

              客户端执行工具搜索工具的参数 schema。

          - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

            此工具会搜索网页以查找用于回复中的相关结果。详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

            - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

              网页搜索工具的类型之一，为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

              - `"web_search_preview"`

              - `"web_search_preview_2025_03_11"`

            - `search_content_types: optional array of "text" or "image"`

              - `"text"`

              - `"image"`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高层级用量指导。可选值为 `low`, `medium`，或 `high`. `medium` 是默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { type, city, country, 2 more }  or null`

              用户的大致位置。如果省略或为 null，则默认为 United States。若要避免该回退行为，请传入 `{"type": "approximate"}` 且不包含 location 字段。若要对结果进行本地化，请提供相应的 location 字段。

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

            允许助手使用统一差异（unified diff）创建、删除或更新文件。

            - `type: "apply_patch"`

              工具的类型。始终 `apply_patch`.

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

          提供这些附加工具的角色。仅 `developer` 受支持。

          - `"developer"`

        - `tools: array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

          在此项中提供的附加工具列表。

          - `Function object { name, parameters, strict, 6 more }`

            在你自己的代码中定义一个可供模型选择调用的函数。了解更多关于 [函数调用](/api/docs/guides/function-calling).

            - `name: string`

              要调用的函数的名称。

            - `parameters: map[unknown] or null`

              描述函数参数的 JSON schema 对象。

            - `strict: boolean or null`

              是否对此函数工具强制执行严格的参数校验。

            - `type: "function"`

              函数工具的类型。始终为 `function`.

              - `"function"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

            - `defer_loading: optional boolean`

              此函数是否被延迟并通过工具搜索加载。

            - `description: optional string or null`

              函数的描述。供模型用于判断是否调用该函数。

            - `output_schema: optional map[unknown] or null`

              描述此函数字符串输出中所编码 JSON 值的 JSON schema 对象。

          - `FileSearch object { type, vector_store_ids, filters, 2 more }`

            从已上传文件中搜索相关内容的工具。详细了解 [文件搜索工具](/api/docs/guides/tools-file-search).

            - `type: "file_search"`

              文件搜索工具的类型，始终 `file_search`.

              - `"file_search"`

            - `vector_store_ids: array of string`

              要搜索的向量存储的 ID。

            - `filters: optional ComparisonFilter or CompoundFilter or null`

              要应用的筛选条件。

              - `ComparisonFilter object { key, type, value }`

                用于使用已定义的比较操作将指定属性键与给定值进行比较的筛选条件。

              - `CompoundFilter object { filters, type }`

                使用以下方式组合多个筛选条件 `and` 或 `or`.

            - `max_num_results: optional number`

              返回结果的最大数量。该数量应在 1 到 50 之间（含两端）。

            - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

              搜索的排序选项。

              - `hybrid_search: optional object { embedding_weight, text_weight }`

                控制倒数排名融合在启用混合搜索时如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

                - `embedding_weight: number`

                  倒数排名融合中嵌入的权重。

                - `text_weight: number`

                  倒数排名融合中文本的权重。

              - `ranker: optional "auto" or "default-2024-11-15"`

                用于文件搜索的排序器。

                - `"auto"`

                - `"default-2024-11-15"`

              - `score_threshold: optional number`

                文件搜索的分数阈值，取值范围为 0 到 1。越接近 1 的数值会尝试仅返回最相关的结果，但可能返回的结果更少。

          - `Computer object { type }`

            用于控制虚拟计算机的工具。了解更多关于 [computer 工具](/api/docs/guides/tools-computer-use).

            - `type: "computer"`

              computer 工具的类型。始终为 `computer`.

              - `"computer"`

          - `ComputerUsePreview object { display_height, display_width, environment, type }`

            用于控制虚拟计算机的工具。了解更多关于 [computer 工具](/api/docs/guides/tools-computer-use).

            - `display_height: number`

              计算机显示的高度。

            - `display_width: number`

              计算机显示的宽度。

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
            [网页搜索工具](/api/docs/guides/tools-web-search).

            - `type: "web_search" or "web_search_2025_08_26"`

              网页搜索工具的类型之一，为 `web_search` 或 `web_search_2025_08_26`.

              - `"web_search"`

              - `"web_search_2025_08_26"`

            - `external_web_access: optional boolean`

              允许 网页搜索 进行实时互联网访问。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

            - `filters: optional object { allowed_domains }  or null`

              搜索的筛选条件。

              - `allowed_domains: optional array of string or null`

                搜索所允许的域名。如果未提供，则允许所有域名。
                所提供域名的子域名同样允许。

                示例： `["pubmed.ncbi.nlm.nih.gov"]`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高层级用量指导。可选值为 `low`, `medium`，或 `high`. `medium` 是默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { city, country, region, 2 more }  or null`

              用户的大致位置。如果省略或为 null，则默认为
              美国。若要避免该回退，请传入 `{"type": "approximate"}` 不包含
              字段的位置。若要本地化结果，请提供相关的位置字段。

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

            通过远程模型上下文协议
            (MCP) 服务器为模型提供对额外工具的访问。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

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

              允许的工具名称列表或筛选对象。

              - `McpAllowedTools = array of string`

                允许的工具名称组成的字符串数组

              - `McpToolFilter object { read_only, tool_names }`

                用于指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是修改数据还是只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `authorization: optional string`

              可用于远程 MCP 服务器的 OAuth 访问令牌，配合
              自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
              必须处理 OAuth 授权流程并在此提供令牌。

            - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

              服务连接器的标识符，例如 ChatGPT 中提供的那些。必须提供
              `server_url`, `connector_id`，或 `tunnel_id` 其中之一。详细了解
              关于服务连接器的信息 [here](/api/docs/guides/tools-connectors-mcp#connectors).

              此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
              请使用 `server_url` 以连接到远程 MCP 服务器，或 `tunnel_id` 通过
              安全 MCP 隧道进行连接。

              当前支持 `connector_id` 的取值：

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

              此 MCP 工具是否被延迟，并通过工具搜索被发现。

            - `headers: optional map[string] or null`

              发送到 MCP 服务器的可选 HTTP 头。用于身份验证
              或其他用途。

            - `require_approval: optional object { always, never }  or "always" or "never" or null`

              指定 MCP 服务器中哪些工具需要审批。

              - `McpToolApprovalFilter object { always, never }`

                指定 MCP 服务器的哪些工具需要审批。可以是
                `always`, `never`,或与需要审批的工具关联的筛选对象
                。

                - `always: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的筛选对象。

                  - `read_only: optional boolean`

                    指示工具是修改数据还是只读。如果某个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    它将匹配此筛选条件。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

                - `never: optional object { read_only, tool_names }`

                  用于指定允许哪些工具的筛选对象。

                  - `read_only: optional boolean`

                    指示工具是修改数据还是只读。如果某个
                    MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                    它将匹配此筛选条件。

                  - `tool_names: optional array of string`

                    允许的工具名称列表。

              - `McpToolApprovalSetting = "always" or "never"`

                为所有工具指定统一的审批策略。可选值为 `always` 或
                `never`. When set to `always`，所有工具都需要审批。When
                set to `never`，所有工具都不需要审批。

                - `"always"`

                - `"never"`

            - `server_description: optional string`

              MCP 服务器的可选描述，用于提供更多上下文。

            - `server_url: optional string`

              MCP 服务器的 URL。必须提供以下之一： `server_url`, `connector_id`，或
              `tunnel_id` 其中之一。

            - `tunnel_id: optional string`

              用于替代直接服务器 URL 的 Secure MCP Tunnel ID。必须提供以下之一：
              `server_url`, `connector_id`，或 `tunnel_id` 其中之一。

          - `CodeInterpreter object { container, type, allowed_callers }`

            运行 Python 代码以帮助生成对提示词响应的工具。

            - `container: string or object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器。可以是容器 ID，也可以是一个对象，用于指定可供代码使用的已上传文件 ID，以及一个
              指定可供代码使用的已上传文件 ID 以及一个可选的
              可选的 `memory_limit` 设置。

              - `string`

                容器 ID。

              - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

                代码解释器容器的配置。可选择指定要运行代码的文件 ID。

                - `type: "auto"`

                  始终为 `auto`.

                  - `"auto"`

                - `file_ids: optional array of string`

                  可供代码使用的已上传文件可选列表。

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

              是生成新图像还是编辑现有图像。默认： `auto`.

              - `"generate"`

              - `"edit"`

              - `"auto"`

            - `background: optional "transparent" or "opaque" or "auto"`

              设置生成图像的背景。可选值为 `transparent`, `opaque`,
              或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
              它们的 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
              背景。受支持的 GPT Image
              模型可使用透明背景。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，此支持处于
              预览阶段。当使用 `transparent`，将输出格式设置为 `png` 或 `webp`.
              默认值： `auto`.

              - `"transparent"`

              - `"opaque"`

              - `"auto"`

            - `input_fidelity: optional "high" or "low" or null`

              控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所付出的努力程度。该参数仅支持 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不支持 `gpt-image-1-mini`。支持 `high` 和 `low`。之一。默认为 `low`.

              - `"high"`

              - `"low"`

            - `input_image_mask: optional object { file_id, image_url }`

              用于局部重绘的可选遮罩。包含 `image_url`
              （字符串，可选）和 `file_id` （字符串，可选）。

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

              在流式模式下生成的部分图像数量，范围为 0（默认值）到 3。

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

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，例如以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的长宽比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。对于 `dall-e-2`，请使用 `256x256`, `512x512`，或 `1024x1024`。之一。对于 `dall-e-3`，请使用 `1024x1024`, `1792x1024`，或 `1024x1792`.

              - `string`

              - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

                生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，例如以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的长宽比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。对于 `dall-e-2`，请使用 `256x256`, `512x512`，或 `1024x1024`。之一。对于 `dall-e-3`，请使用 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

            使用指定格式处理输入的自定义工具。了解有关   [自定义工具](/api/docs/guides/function-calling#custom-tools)

            - `name: string`

              自定义工具的名称，用于在工具调用中标识它。

            - `type: "custom"`

              自定义工具的类型，始终为 `custom`.

              - `"custom"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

            - `async: optional boolean`

              工具响应是否可以异步返回，还是在下次创建响应时立即返回。

            - `defer_loading: optional boolean`

              此工具是否应被延迟，并通过工具搜索发现。

            - `description: optional string`

              自定义工具的可选描述，用于提供更多上下文。

            - `format: optional CustomToolInputFormat`

              自定义工具的输入格式。默认为无约束文本。

          - `Namespace object { description, name, tools, type }`

            在共享命名空间下对函数/自定义工具进行分组。

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

                  此函数是否应被推迟并通过工具搜索发现。

                - `description: optional string or null`

                - `output_schema: optional map[unknown] or null`

                  描述此函数工具中以字符串形式编码的 JSON 值的 JSON Schema。此描述不适用于 content 数组形式的输出。

                - `parameters: optional unknown or null`

                - `strict: optional boolean or null`

                  是否强制执行严格的参数校验。如果省略，当 schema 兼容时，Responses 尝试使用严格校验，否则回退到非严格校验。

              - `Custom object { name, type, allowed_callers, 4 more }`

                使用指定格式处理输入的自定义工具。了解有关   [自定义工具](/api/docs/guides/function-calling#custom-tools)

                - `name: string`

                  自定义工具的名称，用于在工具调用中标识它。

                - `type: "custom"`

                  自定义工具的类型，始终为 `custom`.

                  - `"custom"`

                - `allowed_callers: optional array of "direct" or "programmatic" or null`

                  工具调用上下文。

                  - `"direct"`

                  - `"programmatic"`

                - `async: optional boolean`

                  工具响应是否可以异步返回，还是在下次创建响应时立即返回。

                - `defer_loading: optional boolean`

                  此工具是否应被延迟，并通过工具搜索发现。

                - `description: optional string`

                  自定义工具的可选描述，用于提供更多上下文。

                - `format: optional CustomToolInputFormat`

                  自定义工具的输入格式。默认为无约束文本。

            - `type: "namespace"`

              工具的类型。始终 `namespace`.

              - `"namespace"`

          - `ToolSearch object { type, description, execution, parameters }`

            针对延迟工具的托管或 BYOT 工具搜索配置。

            - `type: "tool_search"`

              工具的类型。始终 `tool_search`.

              - `"tool_search"`

            - `description: optional string or null`

              展示给模型的、用于客户端执行工具搜索工具的描述。

            - `execution: optional "server" or "client"`

              工具搜索由服务端还是由客户端执行。

              - `"server"`

              - `"client"`

            - `parameters: optional unknown or null`

              客户端执行工具搜索工具的参数 schema。

          - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

            此工具会搜索网页以查找用于回复中的相关结果。详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

            - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

              网页搜索工具的类型之一，为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

              - `"web_search_preview"`

              - `"web_search_preview_2025_03_11"`

            - `search_content_types: optional array of "text" or "image"`

              - `"text"`

              - `"image"`

            - `search_context_size: optional "low" or "medium" or "high"`

              用于搜索的上下文窗口空间的高层级用量指导。可选值为 `low`, `medium`，或 `high`. `medium` 是默认值。

              - `"low"`

              - `"medium"`

              - `"high"`

            - `user_location: optional object { type, city, country, 2 more }  or null`

              用户的大致位置。如果省略或为 null，则默认为 United States。若要避免该回退行为，请传入 `{"type": "approximate"}` 且不包含 location 字段。若要对结果进行本地化，请提供相应的 location 字段。

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

            允许助手使用统一差异（unified diff）创建、删除或更新文件。

            - `type: "apply_patch"`

              工具的类型。始终 `apply_patch`.

              - `"apply_patch"`

            - `allowed_callers: optional array of "direct" or "programmatic" or null`

              工具调用上下文。

              - `"direct"`

              - `"programmatic"`

        - `type: "additional_tools"`

          条目类型。始终为 `additional_tools`.

          - `"additional_tools"`

        - `id: optional string or null`

          此附加工具项的唯一 ID。

      - `ConfigurationUpdate object { type, id, reasoning }`

        对话响应配置的更新。该配置
        在后续响应中持续生效，直至被另一次
        配置更新所替换。

        - `type: "configuration_update"`

          条目类型。始终为 `configuration_update`.

          - `"configuration_update"`

        - `id: optional string or null`

          配置更新项的唯一 ID。

        - `reasoning: optional object { effort }`

          推理配置的更新。目前仅支持 effort。

          - `effort: optional ReasoningEffort or null`

            后续响应所使用的推理 effort，直至另一次
            配置更新将其替换。

            - `"none"`

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

            - `"max"`

      - `Reasoning object { id, summary, type, 3 more }`

        推理模型在生成响应时所使用的思维链说明。如果你正在手动
        管理上下文，请务必将这些项包含在你发往 Responses API `input` 至 响应接口
        的请求中，以便保留对话后续轮次的
        [上下文](/api/docs/guides/conversation-state).

        - `id: string`

          推理内容的唯一标识符。

        - `summary: array of SummaryTextContent`

          推理摘要内容。

          - `text: string`

            模型迄今为止推理输出的摘要。

          - `type: "summary_text"`

            对象的类型。始终为 `summary_text`.

            - `"summary_text"`

        - `type: "reasoning"`

          对象的类型。始终为 `reasoning`.

          - `"reasoning"`

        - `content: optional array of object { text, type }`

          推理文本内容。

          - `text: string`

            模型产生的推理文本。

          - `type: "reasoning_text"`

            推理文本的类型。始终为 `reasoning_text`.

            - `"reasoning_text"`

        - `encrypted_content: optional string or null`

          推理条目的加密内容。默认情况下会填充此字段
          针对通过 `POST /v1/responses` 和 WebSocket
          `response.create` 请求返回的推理条目。

          在流式传输时，请使用已完成的推理条目及其
          `encrypted_content` 来自 `response.output_item.done` 事件，用于
          后续请求。该 `encrypted_content` 在
          `response.output_item.added` 可能不完整。在以下情况中这一点尤为
          重要：当 `store` 为 `false` 时，或使用 Zero Data Retention 时。

        - `status: optional "in_progress" or "completed" or "incomplete"`

          该项的状态。取值为以下之一： `in_progress`, `completed`，或
          `incomplete`。当通过 API 返回项时填充。

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

      - `Compaction object { encrypted_content, type, id }`

        由 [`v1/responses/compact` API](/api/reference/resources/responses/methods/compact).

        - `encrypted_content: string`

          压缩摘要的加密内容。

        - `type: "compaction"`

          该项的类型。始终为 `compaction`.

          - `"compaction"`

        - `id: optional string or null`

          压缩项的 ID。

      - `ImageGenerationCall object { id, result, status, 7 more }`

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

        - `action: optional "generate" or "edit" or "auto" or null`

          用于图像生成的动作。

          - `"generate"`

          - `"edit"`

          - `"auto"`

        - `background: optional "transparent" or "opaque" or "auto" or null`

          用于生成的背景设置。

          - `"transparent"`

          - `"opaque"`

          - `"auto"`

        - `output_format: optional "png" or "webp" or "jpeg" or null`

          用于生成的输出格式。

          - `"png"`

          - `"webp"`

          - `"jpeg"`

        - `quality: optional "low" or "medium" or "high" or 3 more or null`

          由图像生成工具调用所生成图像的质量，取值为 `low`, `medium`, `high`, `xhigh`, `max`，或 `auto`.

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

          - `"auto"`

        - `revised_prompt: optional string or null`

          经过任何模型提示重写后使用的提示。

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

          要运行的代码，若不可用则为 null。

        - `container_id: string`

          用于运行代码的容器 ID。

        - `outputs: array of object { logs, type }  or object { type, url }  or null`

          由代码解释器生成的输出，例如日志或图像。
          如果没有可用输出，可以为 null。

          - `Logs object { logs, type }`

            从代码解释器输出的日志。

            - `logs: string`

              从代码解释器输出的日志。

            - `type: "logs"`

              输出的类型。始终为 `logs`.

              - `"logs"`

          - `Image object { type, url }`

            从代码解释器输出的图像。

            - `type: "image"`

              输出的类型。始终为 `image`.

              - `"image"`

            - `url: string`

              从代码解释器输出的图像的 URL。

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

            为该命令设置的环境变量。

          - `type: "exec"`

            本地 shell 操作的类型。始终为 `exec`.

            - `"exec"`

          - `timeout_ms: optional number or null`

            该命令的可选超时时间（毫秒）。

          - `user: optional string or null`

            运行该命令的可选用户。

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

          该项的状态。取值为以下之一： `in_progress`, `completed`，或 `incomplete`.

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

      - `ShellCall object { action, call_id, type, 4 more }`

        表示执行一条或多条 shell 命令请求的工具。

        - `action: object { commands, max_output_length, timeout_ms }`

          描述如何运行该工具调用的 shell 命令和限制。

          - `commands: array of string`

            供执行环境运行的、有序的 shell 命令。

          - `max_output_length: optional number or null`

            从合并的 stdout 和 stderr 输出中捕获的最大 UTF-8 字符数。

          - `timeout_ms: optional number or null`

            允许 shell 命令运行的最长实际耗时（毫秒）。

        - `call_id: string`

          模型生成的 shell 工具调用的唯一 ID。

        - `type: "shell_call"`

          该项的类型。始终为 `shell_call`.

          - `"shell_call"`

        - `id: optional string or null`

          shell 工具调用的唯一 ID。当此条目通过 API 返回时填充。

        - `caller: optional object { type }  or object { caller_id, type }  or null`

          产生该工具调用的执行上下文。

          - `Direct object { type }`

            - `type: "direct"`

              调用方类型。始终为 `direct`.

              - `"direct"`

          - `Program object { caller_id, type }`

            - `caller_id: string`

              产生该工具调用的程序项的调用 ID。

            - `type: "program"`

              调用方类型。始终为 `program`.

              - `"program"`

        - `environment: optional LocalEnvironment or ContainerReference or null`

          执行 shell 命令所处的环境。

          - `LocalEnvironment object { type, skills }`

          - `ContainerReference object { container_id, type }`

        - `status: optional "in_progress" or "completed" or "incomplete" or null`

          shell 调用的状态。取值为 `in_progress`, `completed`，或 `incomplete`.

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

      - `ShellCallOutput object { call_id, output, type, 4 more }`

        shell 工具调用发出的流式输出条目。

        - `call_id: string`

          模型生成的 shell 工具调用的唯一 ID。

        - `output: array of ResponseFunctionShellCallOutputContent`

          捕获的 stdout 和 stderr 输出块及其对应的结果。

          - `outcome: object { type }  or object { exit_code, type }`

            与此 shell 调用关联的退出或超时结果。

            - `Timeout object { type }`

              表示 shell 调用超出了其配置的时间限制。

              - `type: "timeout"`

                结果类型。始终为 `timeout`.

                - `"timeout"`

            - `Exit object { exit_code, type }`

              表示 shell 命令已结束并返回了退出码。

              - `exit_code: number`

                shell 进程返回的退出码。

              - `type: "exit"`

                结果类型。始终为 `exit`.

                - `"exit"`

          - `stderr: string`

            为该 shell 调用捕获的 stderr 输出。

          - `stdout: string`

            shell 调用的已捕获 stdout 输出。

        - `type: "shell_call_output"`

          该项的类型。始终为 `shell_call_output`.

          - `"shell_call_output"`

        - `id: optional string or null`

          shell 工具调用输出的唯一 ID。通过 API 返回此条目时填充。

        - `caller: optional object { type }  or object { caller_id, type }  or null`

          产生该工具调用的执行上下文。

          - `Direct object { type }`

            - `type: "direct"`

              调用方类型。始终为 `direct`.

              - `"direct"`

          - `Program object { caller_id, type }`

            - `caller_id: string`

              产生该工具调用的程序项的调用 ID。

            - `type: "program"`

              调用方类型。始终为 `program`.

              - `"program"`

        - `max_output_length: optional number or null`

          为此 shell 调用合并输出所捕获的最大 UTF-8 字符数。

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

              创建文件时要应用的统一 diff 内容。

            - `path: string`

              相对于工作区根目录的要创建的文件的路径。

            - `type: "create_file"`

              操作类型。始终为 `create_file`.

              - `"create_file"`

          - `DeleteFile object { path, type }`

            通过 apply_patch 工具删除现有文件的指令。

            - `path: string`

              相对于工作区根目录的要删除的文件的路径。

            - `type: "delete_file"`

              操作类型。始终为 `delete_file`.

              - `"delete_file"`

          - `UpdateFile object { diff, path, type }`

            通过 apply_patch 工具更新现有文件的指令。

            - `diff: string`

              要应用于现有文件的统一 diff 内容。

            - `path: string`

              相对于工作区根目录的要更新的文件的路径。

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

          apply patch 工具调用的唯一 ID。通过 API 返回此条目时填充。

        - `caller: optional object { type }  or object { caller_id, type }  or null`

          产生该工具调用的执行上下文。

          - `Direct object { type }`

            - `type: "direct"`

              调用方类型。始终为 `direct`.

              - `"direct"`

          - `Program object { caller_id, type }`

            - `caller_id: string`

              产生该工具调用的程序项的调用 ID。

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

          apply patch 工具调用输出的唯一 ID。当此条目通过 API 返回时填充。

        - `caller: optional object { type }  or object { caller_id, type }  or null`

          产生该工具调用的执行上下文。

          - `Direct object { type }`

            - `type: "direct"`

              调用方类型。始终为 `direct`.

              - `"direct"`

          - `Program object { caller_id, type }`

            - `caller_id: string`

              产生该工具调用的程序项的调用 ID。

            - `type: "program"`

              调用方类型。始终为 `program`.

              - `"program"`

        - `output: optional string or null`

          来自 apply patch 工具的可选人类可读日志文本（例如补丁结果或错误）。

      - `McpListTools object { id, server_label, tools, 2 more }`

        MCP 服务器上可用的工具列表。

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

            有关该工具的其他注解。

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

          该工具参数的 JSON 字符串。

        - `name: string`

          要运行的工具的名称。

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

          决策的可选原因。

      - `McpCall object { id, arguments, name, 6 more }`

        对 MCP 服务器上某个工具的一次调用。

        - `id: string`

          工具调用的唯一 ID。

        - `arguments: string`

          传递给该工具的参数，格式为 JSON 字符串。

        - `name: string`

          已运行工具的名称。

        - `server_label: string`

          运行该工具的 MCP 服务器的标签。

        - `type: "mcp_call"`

          该项的类型。始终为 `mcp_call`.

          - `"mcp_call"`

        - `approval_request_id: optional string or null`

          MCP 工具调用审批请求的唯一标识符。
          在后续输入中包含此值，以批准或拒绝相应的工具调用。 `mcp_approval_response` 以批准或拒绝相应的工具调用。

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

          工具调用的状态，取值之一为 `in_progress`, `completed`, `incomplete`, `calling`，或 `failed`.

          - `"in_progress"`

          - `"completed"`

          - `"incomplete"`

          - `"calling"`

          - `"failed"`

      - `CustomToolCallOutput object { call_id, output, type, 2 more }`

        你在代码中自定义工具调用的输出，将被发送回模型。

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

              向模型传入的文本输入。

            - `ResponseInputImage object { detail, type, file_id, 2 more }`

              发送到模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

            - `ResponseInputFile object { type, detail, file_data, 4 more }`

              发送给模型的文件输入。

        - `type: "custom_tool_call_output"`

          自定义工具调用输出的类型，恒为 `custom_tool_call_output`.

          - `"custom_tool_call_output"`

        - `id: optional string`

          OpenAI 平台上此自定义工具调用输出的唯一 ID。

        - `caller: optional object { type }  or object { caller_id, type }  or null`

          产生该工具调用的执行上下文。

          - `Direct object { type }`

            - `type: "direct"`

              调用方类型。始终为 `direct`.

              - `"direct"`

          - `Program object { caller_id, type }`

            - `caller_id: string`

              产生该工具调用的程序项的调用 ID。

            - `type: "program"`

              调用方类型。始终为 `program`.

              - `"program"`

      - `CustomToolCall object { call_id, input, name, 5 more }`

        对模型创建的自定义工具的调用。

        - `call_id: string`

          用于将此自定义工具调用映射到工具调用输出的标识符。

        - `input: string`

          模型生成的自定义工具调用的输入。

        - `name: string`

          被调用的自定义工具的名称。

        - `type: "custom_tool_call"`

          自定义工具调用的类型。始终为 `custom_tool_call`.

          - `"custom_tool_call"`

        - `id: optional string`

          OpenAI 平台中此自定义工具调用的唯一 ID。

        - `async: optional boolean`

          自定义工具调用是否异步运行。

        - `caller: optional object { type }  or object { caller_id, type }  or null`

          产生该工具调用的执行上下文。

          - `Direct object { type }`

            - `type: "direct"`

              - `"direct"`

          - `Program object { caller_id, type }`

            - `caller_id: string`

              产生该工具调用的程序项的调用 ID。

            - `type: "program"`

              - `"program"`

        - `namespace: optional string`

          被调用的自定义工具的命名空间。

      - `CompactionTrigger object { type, id }`

        压缩当前上下文。必须是最后一个输入项。

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

          此程序条目的唯一 ID。

        - `call_id: string`

          该程序条目的稳定调用 ID。

        - `code: string`

          由程序化工具调用执行的 JavaScript 源码。

        - `fingerprint: string`

          必须原样往返（round-trip）的程序回放不透明指纹。

        - `type: "program"`

          条目类型。始终为 `program`.

          - `"program"`

      - `ProgramOutput object { id, call_id, result, 2 more }`

        - `id: string`

          此程序输出条目的唯一 ID。

        - `call_id: string`

          程序条目的调用 ID。

        - `result: string`

          程序条目生成的结果。

        - `status: "completed" or "incomplete"`

          程序输出的最终状态。

          - `"completed"`

          - `"incomplete"`

        - `type: "program_output"`

          条目类型。始终为 `program_output`.

          - `"program_output"`

  - `metadata: Metadata or null`

    可以附加到对象的 16 个键值对。可用于
    以结构化格式存储有关对象的附加信息，以及
    format，并可通过 API 或控制台查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    最大长度为 512 个字符。

  - `model: ResponsesModel`

    用于生成响应的模型 ID，例如 `gpt-6-astra`。 OpenAI
    提供多种具备不同能力、性能
    特性和定价的模型。请参阅 [模型指南](/api/docs/models)
    以浏览和比较可用模型。

    - `string`

    - `"gpt-6-astra" or "gpt-6.1-sol" or "gpt-6-sol" or 86 more`

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

    - `ResponsesOnlyModel = "o1-pro" or "o1-pro-2025-03-19" or "o3-pro" or 17 more`

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

      - `"gpt-rosalind-research"`

  - `object: "response"`

    此资源的对象类型——始终设置为 `response`.

    - `"response"`

  - `output: array of ResponseOutputItem`

    由模型生成的内容项数组。

    - 该数组中项的长度 `output` 和顺序取决于
      模型的响应。
    - 与访问数组中的第一项 `output` 并假设它是
      包含模型生成内容 `assistant` 的消息不同，你或许可以考虑使用
      Responses `output_text` 属性，其中
      在 SDK 中受支持。

    - `ResponseOutputMessage object { id, content, role, 3 more }`

      来自模型的输出消息。

    - `FileSearchCall object { id, queries, status, 2 more }`

      文件搜索 工具调用的结果。详见
      [文件搜索 指南](/api/docs/guides/tools-file-search) 了解更多信息。

      - `id: string`

        文件搜索 工具调用的唯一 ID。

      - `queries: array of string`

        用于搜索文件的查询语句。

      - `status: "in_progress" or "searching" or "completed" or 2 more`

        文件搜索 工具调用的状态。取值之一 `in_progress`,
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

          可以附加到对象的 16 个键值对。可用于
          以结构化格式存储有关对象的附加信息，以及
          通过 API 或控制台查询对象。键为字符串，
          最大长度为 64 个字符。值为字符串，最大
          长度为 512 个字符、布尔值或数字。

          - `string`

          - `number`

          - `boolean`

        - `file_id: optional string`

          文件的唯一 ID。

        - `filename: optional string`

          文件的名称。

        - `score: optional number`

          文件的相关性得分，取值范围为 0 到 1。

        - `text: optional string`

          从文件中检索到的文本。

    - `FunctionCall object { arguments, call_id, name, 6 more }`

      用于运行函数的工具调用。参见
      [function calling guide](/api/docs/guides/function-calling) 了解更多信息。

      - `arguments: string`

        传递给该函数的参数的 JSON 字符串。

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

        该函数工具调用是否异步运行。

      - `caller: optional object { type }  or object { caller_id, type }  or null`

        产生该工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            产生该工具调用的程序项的调用 ID。

          - `type: "program"`

            - `"program"`

      - `namespace: optional string`

        要运行的函数的命名空间。

      - `status: optional "in_progress" or "completed" or "incomplete"`

        该项的状态。取值为以下之一： `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回项时填充。

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

            向模型传入的文本输入。

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送到模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

      - `status: "in_progress" or "completed" or "incomplete"`

        该项的状态。取值为以下之一： `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回项时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "function_call_output"`

        函数工具调用输出的类型。始终为 `function_call_output`.

        - `"function_call_output"`

      - `call_id: optional string`

        由模型生成的函数工具调用的唯一 ID。

      - `caller: optional object { type }  or object { caller_id, type }  or null`

        产生该工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            调用方类型。始终为 `direct`.

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            产生该工具调用的程序项的调用 ID。

          - `type: "program"`

            调用方类型。始终为 `program`.

            - `"program"`

      - `created_by: optional string`

        创建该条目的参与者的标识符。

      - `name: optional string`

        生成该输出的工具的名称。

      - `namespace: optional string`

        生成该输出的工具的命名空间。

    - `WebSearchCall object { id, status, type, action }`

      网页搜索 工具调用的结果。详见
      [网页搜索 指南](/api/docs/guides/tools-web-search) 了解更多信息。

      - `id: string`

        网页搜索 工具调用的唯一 ID。

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

      - `action: optional object { type, queries, query, sources }  or object { type, url }  or object { pattern, type, url }`

        描述本次 网页搜索 调用中所执行具体操作的对象。
        包含模型使用网络的方式的详细信息（search、open_page、find_in_page）。

        - `Search object { type, queries, query, sources }`

          操作类型 "search" - 执行 网页搜索 查询。

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

          操作类型 "open_page" - 打开搜索结果中的指定 URL。

          - `type: "open_page"`

            操作类型。

            - `"open_page"`

          - `url: optional string or null`

            模型打开的 URL。

        - `FindInPage object { pattern, type, url }`

          Action type "find_in_page"：在已加载的页面中搜索某个模式。

          - `pattern: string`

            要在页面内搜索的模式或文本。

          - `type: "find_in_page"`

            操作类型。

            - `"find_in_page"`

          - `url: string`

            搜索该模式的目标页面的 URL。

    - `ComputerCall object { id, call_id, pending_safety_checks, 4 more }`

      对 computer use 工具的工具调用。参阅
      [computer use 指南](/api/docs/guides/tools-computer-use) 了解更多信息。

      - `id: string`

        计算机调用的唯一 ID。

      - `call_id: string`

        在向工具调用返回输出时使用的标识符。

      - `pending_safety_checks: array of object { id, code, message }`

        针对计算机调用的待处理安全检查。

        - `id: string`

          待处理安全检查的 ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          关于待处理安全检查的详细信息。

      - `status: "in_progress" or "completed" or "incomplete"`

        该项的状态。取值为以下之一： `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回项时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "computer_call"`

        计算机调用的类型。始终为 `computer_call`.

        - `"computer_call"`

      - `action: optional ComputerAction`

        点击操作。

      - `actions: optional ComputerActionList`

        的扁平化批量操作。每个操作都包含一个 `computer_use`。鉴别器字段以及操作特有的字段。
        `type` 鉴别器字段以及操作特有的字段。

    - `ComputerCallOutput object { id, call_id, output, 4 more }`

      - `id: string`

        计算机调用工具输出的唯一 ID。

      - `call_id: string`

        生成该输出的计算机工具调用的 ID。

      - `output: ResponseComputerToolCallOutputScreenshot`

        与计算机使用工具配合使用的计算机截图图像。

      - `status: "completed" or "incomplete" or "failed" or "in_progress"`

        输入消息的状态，取值之一 `in_progress`, `completed`，或
        `incomplete`。当输入项通过 API 返回时填充。

        - `"completed"`

        - `"incomplete"`

        - `"failed"`

        - `"in_progress"`

      - `type: "computer_call_output"`

        计算机工具调用输出的类型。始终为 `computer_call_output`.

        - `"computer_call_output"`

      - `acknowledged_safety_checks: optional array of object { id, code, message }`

        由 API 报告并已被
        开发者确认的安全检查。

        - `id: string`

          待处理安全检查的 ID。

        - `code: optional string or null`

          待处理安全检查的类型。

        - `message: optional string or null`

          关于待处理安全检查的详细信息。

      - `created_by: optional string`

        创建该条目的参与者的标识符。

    - `Reasoning object { id, summary, type, 3 more }`

      推理模型在生成响应时所使用的思维链说明。如果你正在手动
      管理上下文，请务必将这些项包含在你发往 Responses API `input` 至 响应接口
      的请求中，以便保留对话后续轮次的
      [上下文](/api/docs/guides/conversation-state).

      - `id: string`

        推理内容的唯一标识符。

      - `summary: array of SummaryTextContent`

        推理摘要内容。

        - `text: string`

          模型迄今为止推理输出的摘要。

        - `type: "summary_text"`

          对象的类型。始终为 `summary_text`.

      - `type: "reasoning"`

        对象的类型。始终为 `reasoning`.

        - `"reasoning"`

      - `content: optional array of object { text, type }`

        推理文本内容。

        - `text: string`

          模型产生的推理文本。

        - `type: "reasoning_text"`

          推理文本的类型。始终为 `reasoning_text`.

          - `"reasoning_text"`

      - `encrypted_content: optional string or null`

        推理条目的加密内容。默认情况下会填充此字段
        针对通过 `POST /v1/responses` 和 WebSocket
        `response.create` 请求返回的推理条目。

        在流式传输时，请使用已完成的推理条目及其
        `encrypted_content` 来自 `response.output_item.done` 事件，用于
        后续请求。该 `encrypted_content` 在
        `response.output_item.added` 可能不完整。在以下情况中这一点尤为
        重要：当 `store` 为 `false` 时，或使用 Zero Data Retention 时。

      - `status: optional "in_progress" or "completed" or "incomplete"`

        该项的状态。取值为以下之一： `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回项时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `Program object { id, call_id, code, 2 more }`

      - `id: string`

        程序条目的唯一 ID。

      - `call_id: string`

        该程序条目的稳定调用 ID。

      - `code: string`

        由程序化工具调用执行的 JavaScript 源码。

      - `fingerprint: string`

        必须原样往返（round-trip）的程序回放不透明指纹。

      - `type: "program"`

        该项的类型。始终为 `program`.

        - `"program"`

    - `ProgramOutput object { id, call_id, result, 2 more }`

      - `id: string`

        程序输出条目的唯一 ID。

      - `call_id: string`

        程序条目的调用 ID。

      - `result: string`

        程序条目生成的结果。

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

        创建该条目的参与者的标识符。

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

      - `tools: array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        工具搜索返回的已加载工具定义。

        - `Function object { name, parameters, strict, 6 more }`

          在你自己的代码中定义一个可供模型选择调用的函数。了解更多关于 [函数调用](/api/docs/guides/function-calling).

          - `name: string`

            要调用的函数的名称。

          - `parameters: map[unknown] or null`

            描述函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否对此函数工具强制执行严格的参数校验。

          - `type: "function"`

            函数工具的类型。始终为 `function`.

            - `"function"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

          - `defer_loading: optional boolean`

            此函数是否被延迟并通过工具搜索加载。

          - `description: optional string or null`

            函数的描述。供模型用于判断是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            描述此函数字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          从已上传文件中搜索相关内容的工具。详细了解 [文件搜索工具](/api/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索工具的类型，始终 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选条件。

            - `ComparisonFilter object { key, type, value }`

              用于使用已定义的比较操作将指定属性键与给定值进行比较的筛选条件。

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个筛选条件 `and` 或 `or`.

          - `max_num_results: optional number`

            返回结果的最大数量。该数量应在 1 到 50 之间（含两端）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              控制倒数排名融合在启用混合搜索时如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

              - `embedding_weight: number`

                倒数排名融合中嵌入的权重。

              - `text_weight: number`

                倒数排名融合中文本的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，取值范围为 0 到 1。越接近 1 的数值会尝试仅返回最相关的结果，但可能返回的结果更少。

        - `Computer object { type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer 工具](/api/docs/guides/tools-computer-use).

          - `type: "computer"`

            computer 工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer 工具](/api/docs/guides/tools-computer-use).

          - `display_height: number`

            计算机显示的高度。

          - `display_width: number`

            计算机显示的宽度。

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
          [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型之一，为 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许 网页搜索 进行实时互联网访问。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的筛选条件。

            - `allowed_domains: optional array of string or null`

              搜索所允许的域名。如果未提供，则允许所有域名。
              所提供域名的子域名同样允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高层级用量指导。可选值为 `low`, `medium`，或 `high`. `medium` 是默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。如果省略或为 null，则默认为
            美国。若要避免该回退，请传入 `{"type": "approximate"}` 不包含
            字段的位置。若要本地化结果，请提供相关的位置字段。

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

          通过远程模型上下文协议
          (MCP) 服务器为模型提供对额外工具的访问。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

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

            允许的工具名称列表或筛选对象。

            - `McpAllowedTools = array of string`

              允许的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是修改数据还是只读。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此筛选条件。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，配合
            自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程并在此提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的那些。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 其中之一。详细了解
            关于服务连接器的信息 [here](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
            请使用 `server_url` 以连接到远程 MCP 服务器，或 `tunnel_id` 通过
            安全 MCP 隧道进行连接。

            当前支持 `connector_id` 的取值：

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

            此 MCP 工具是否被延迟，并通过工具搜索被发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`,或与需要审批的工具关联的筛选对象
              。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是修改数据还是只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是修改数据还是只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`. When set to `always`，所有工具都需要审批。When
              set to `never`，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。必须提供以下之一： `server_url`, `connector_id`，或
            `tunnel_id` 其中之一。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的 Secure MCP Tunnel ID。必须提供以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 其中之一。

        - `CodeInterpreter object { container, type, allowed_callers }`

          运行 Python 代码以帮助生成对提示词响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID，也可以是一个对象，用于指定可供代码使用的已上传文件 ID，以及一个
            指定可供代码使用的已上传文件 ID 以及一个可选的
            可选的 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定要运行代码的文件 ID。

              - `type: "auto"`

                始终为 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                可供代码使用的已上传文件可选列表。

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

            是生成新图像还是编辑现有图像。默认： `auto`.

            - `"generate"`

            - `"edit"`

            - `"auto"`

          - `background: optional "transparent" or "opaque" or "auto"`

            设置生成图像的背景。可选值为 `transparent`, `opaque`,
            或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
            它们的 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
            背景。受支持的 GPT Image
            模型可使用透明背景。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，此支持处于
            预览阶段。当使用 `transparent`，将输出格式设置为 `png` 或 `webp`.
            默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所付出的努力程度。该参数仅支持 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不支持 `gpt-image-1-mini`。支持 `high` 和 `low`。之一。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于局部重绘的可选遮罩。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

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

            在流式模式下生成的部分图像数量，范围为 0（默认值）到 3。

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

            生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，例如以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的长宽比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。对于 `dall-e-2`，请使用 `256x256`, `512x512`，或 `1024x1024`。之一。对于 `dall-e-3`，请使用 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，例如以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的长宽比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。对于 `dall-e-2`，请使用 `256x256`, `512x512`，或 `1024x1024`。之一。对于 `dall-e-3`，请使用 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

          使用指定格式处理输入的自定义工具。了解有关   [自定义工具](/api/docs/guides/function-calling#custom-tools)

          - `name: string`

            自定义工具的名称，用于在工具调用中标识它。

          - `type: "custom"`

            自定义工具的类型，始终为 `custom`.

            - `"custom"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

            工具响应是否可以异步返回，还是在下次创建响应时立即返回。

          - `defer_loading: optional boolean`

            此工具是否应被延迟，并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认为无约束文本。

        - `Namespace object { description, name, tools, type }`

          在共享命名空间下对函数/自定义工具进行分组。

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

                此函数是否应被推迟并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                描述此函数工具中以字符串形式编码的 JSON 值的 JSON Schema。此描述不适用于 content 数组形式的输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。如果省略，当 schema 兼容时，Responses 尝试使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 4 more }`

              使用指定格式处理输入的自定义工具。了解有关   [自定义工具](/api/docs/guides/function-calling#custom-tools)

              - `name: string`

                自定义工具的名称，用于在工具调用中标识它。

              - `type: "custom"`

                自定义工具的类型，始终为 `custom`.

                - `"custom"`

              - `allowed_callers: optional array of "direct" or "programmatic" or null`

                工具调用上下文。

                - `"direct"`

                - `"programmatic"`

              - `async: optional boolean`

                工具响应是否可以异步返回，还是在下次创建响应时立即返回。

              - `defer_loading: optional boolean`

                此工具是否应被延迟，并通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认为无约束文本。

          - `type: "namespace"`

            工具的类型。始终 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          针对延迟工具的托管或 BYOT 工具搜索配置。

          - `type: "tool_search"`

            工具的类型。始终 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            展示给模型的、用于客户端执行工具搜索工具的描述。

          - `execution: optional "server" or "client"`

            工具搜索由服务端还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具会搜索网页以查找用于回复中的相关结果。详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型之一，为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高层级用量指导。可选值为 `low`, `medium`，或 `high`. `medium` 是默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户的大致位置。如果省略或为 null，则默认为 United States。若要避免该回退行为，请传入 `{"type": "approximate"}` 且不包含 location 字段。若要对结果进行本地化，请提供相应的 location 字段。

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

          允许助手使用统一差异（unified diff）创建、删除或更新文件。

          - `type: "apply_patch"`

            工具的类型。始终 `apply_patch`.

            - `"apply_patch"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

      - `type: "tool_search_output"`

        该项的类型。始终为 `tool_search_output`.

        - `"tool_search_output"`

      - `created_by: optional string`

        创建该条目的参与者的标识符。

    - `AdditionalTools object { id, role, tools, type }`

      - `id: string`

        其他工具条目的唯一 ID。

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

      - `tools: array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

        在此条目中可用的附加工具定义。

        - `Function object { name, parameters, strict, 6 more }`

          在你自己的代码中定义一个可供模型选择调用的函数。了解更多关于 [函数调用](/api/docs/guides/function-calling).

          - `name: string`

            要调用的函数的名称。

          - `parameters: map[unknown] or null`

            描述函数参数的 JSON schema 对象。

          - `strict: boolean or null`

            是否对此函数工具强制执行严格的参数校验。

          - `type: "function"`

            函数工具的类型。始终为 `function`.

            - `"function"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

          - `defer_loading: optional boolean`

            此函数是否被延迟并通过工具搜索加载。

          - `description: optional string or null`

            函数的描述。供模型用于判断是否调用该函数。

          - `output_schema: optional map[unknown] or null`

            描述此函数字符串输出中所编码 JSON 值的 JSON schema 对象。

        - `FileSearch object { type, vector_store_ids, filters, 2 more }`

          从已上传文件中搜索相关内容的工具。详细了解 [文件搜索工具](/api/docs/guides/tools-file-search).

          - `type: "file_search"`

            文件搜索工具的类型，始终 `file_search`.

            - `"file_search"`

          - `vector_store_ids: array of string`

            要搜索的向量存储的 ID。

          - `filters: optional ComparisonFilter or CompoundFilter or null`

            要应用的筛选条件。

            - `ComparisonFilter object { key, type, value }`

              用于使用已定义的比较操作将指定属性键与给定值进行比较的筛选条件。

            - `CompoundFilter object { filters, type }`

              使用以下方式组合多个筛选条件 `and` 或 `or`.

          - `max_num_results: optional number`

            返回结果的最大数量。该数量应在 1 到 50 之间（含两端）。

          - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

            搜索的排序选项。

            - `hybrid_search: optional object { embedding_weight, text_weight }`

              控制倒数排名融合在启用混合搜索时如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

              - `embedding_weight: number`

                倒数排名融合中嵌入的权重。

              - `text_weight: number`

                倒数排名融合中文本的权重。

            - `ranker: optional "auto" or "default-2024-11-15"`

              用于文件搜索的排序器。

              - `"auto"`

              - `"default-2024-11-15"`

            - `score_threshold: optional number`

              文件搜索的分数阈值，取值范围为 0 到 1。越接近 1 的数值会尝试仅返回最相关的结果，但可能返回的结果更少。

        - `Computer object { type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer 工具](/api/docs/guides/tools-computer-use).

          - `type: "computer"`

            computer 工具的类型。始终为 `computer`.

            - `"computer"`

        - `ComputerUsePreview object { display_height, display_width, environment, type }`

          用于控制虚拟计算机的工具。了解更多关于 [computer 工具](/api/docs/guides/tools-computer-use).

          - `display_height: number`

            计算机显示的高度。

          - `display_width: number`

            计算机显示的宽度。

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
          [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search" or "web_search_2025_08_26"`

            网页搜索工具的类型之一，为 `web_search` 或 `web_search_2025_08_26`.

            - `"web_search"`

            - `"web_search_2025_08_26"`

          - `external_web_access: optional boolean`

            允许 网页搜索 进行实时互联网访问。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

          - `filters: optional object { allowed_domains }  or null`

            搜索的筛选条件。

            - `allowed_domains: optional array of string or null`

              搜索所允许的域名。如果未提供，则允许所有域名。
              所提供域名的子域名同样允许。

              示例： `["pubmed.ncbi.nlm.nih.gov"]`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高层级用量指导。可选值为 `low`, `medium`，或 `high`. `medium` 是默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { city, country, region, 2 more }  or null`

            用户的大致位置。如果省略或为 null，则默认为
            美国。若要避免该回退，请传入 `{"type": "approximate"}` 不包含
            字段的位置。若要本地化结果，请提供相关的位置字段。

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

          通过远程模型上下文协议
          (MCP) 服务器为模型提供对额外工具的访问。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

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

            允许的工具名称列表或筛选对象。

            - `McpAllowedTools = array of string`

              允许的工具名称组成的字符串数组

            - `McpToolFilter object { read_only, tool_names }`

              用于指定允许哪些工具的筛选对象。

              - `read_only: optional boolean`

                指示工具是修改数据还是只读。如果某个
                MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                它将匹配此筛选条件。

              - `tool_names: optional array of string`

                允许的工具名称列表。

          - `authorization: optional string`

            可用于远程 MCP 服务器的 OAuth 访问令牌，配合
            自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
            必须处理 OAuth 授权流程并在此提供令牌。

          - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

            服务连接器的标识符，例如 ChatGPT 中提供的那些。必须提供
            `server_url`, `connector_id`，或 `tunnel_id` 其中之一。详细了解
            关于服务连接器的信息 [here](/api/docs/guides/tools-connectors-mcp#connectors).

            此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
            请使用 `server_url` 以连接到远程 MCP 服务器，或 `tunnel_id` 通过
            安全 MCP 隧道进行连接。

            当前支持 `connector_id` 的取值：

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

            此 MCP 工具是否被延迟，并通过工具搜索被发现。

          - `headers: optional map[string] or null`

            发送到 MCP 服务器的可选 HTTP 头。用于身份验证
            或其他用途。

          - `require_approval: optional object { always, never }  or "always" or "never" or null`

            指定 MCP 服务器中哪些工具需要审批。

            - `McpToolApprovalFilter object { always, never }`

              指定 MCP 服务器的哪些工具需要审批。可以是
              `always`, `never`,或与需要审批的工具关联的筛选对象
              。

              - `always: optional object { read_only, tool_names }`

                用于指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是修改数据还是只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

              - `never: optional object { read_only, tool_names }`

                用于指定允许哪些工具的筛选对象。

                - `read_only: optional boolean`

                  指示工具是修改数据还是只读。如果某个
                  MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
                  它将匹配此筛选条件。

                - `tool_names: optional array of string`

                  允许的工具名称列表。

            - `McpToolApprovalSetting = "always" or "never"`

              为所有工具指定统一的审批策略。可选值为 `always` 或
              `never`. When set to `always`，所有工具都需要审批。When
              set to `never`，所有工具都不需要审批。

              - `"always"`

              - `"never"`

          - `server_description: optional string`

            MCP 服务器的可选描述，用于提供更多上下文。

          - `server_url: optional string`

            MCP 服务器的 URL。必须提供以下之一： `server_url`, `connector_id`，或
            `tunnel_id` 其中之一。

          - `tunnel_id: optional string`

            用于替代直接服务器 URL 的 Secure MCP Tunnel ID。必须提供以下之一：
            `server_url`, `connector_id`，或 `tunnel_id` 其中之一。

        - `CodeInterpreter object { container, type, allowed_callers }`

          运行 Python 代码以帮助生成对提示词响应的工具。

          - `container: string or object { type, file_ids, memory_limit, network_policy }`

            代码解释器容器。可以是容器 ID，也可以是一个对象，用于指定可供代码使用的已上传文件 ID，以及一个
            指定可供代码使用的已上传文件 ID 以及一个可选的
            可选的 `memory_limit` 设置。

            - `string`

              容器 ID。

            - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

              代码解释器容器的配置。可选择指定要运行代码的文件 ID。

              - `type: "auto"`

                始终为 `auto`.

                - `"auto"`

              - `file_ids: optional array of string`

                可供代码使用的已上传文件可选列表。

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

            是生成新图像还是编辑现有图像。默认： `auto`.

            - `"generate"`

            - `"edit"`

            - `"auto"`

          - `background: optional "transparent" or "opaque" or "auto"`

            设置生成图像的背景。可选值为 `transparent`, `opaque`,
            或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
            它们的 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
            背景。受支持的 GPT Image
            模型可使用透明背景。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，此支持处于
            预览阶段。当使用 `transparent`，将输出格式设置为 `png` 或 `webp`.
            默认值： `auto`.

            - `"transparent"`

            - `"opaque"`

            - `"auto"`

          - `input_fidelity: optional "high" or "low" or null`

            控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所付出的努力程度。该参数仅支持 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不支持 `gpt-image-1-mini`。支持 `high` 和 `low`。之一。默认为 `low`.

            - `"high"`

            - `"low"`

          - `input_image_mask: optional object { file_id, image_url }`

            用于局部重绘的可选遮罩。包含 `image_url`
            （字符串，可选）和 `file_id` （字符串，可选）。

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

            在流式模式下生成的部分图像数量，范围为 0（默认值）到 3。

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

            生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，例如以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的长宽比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。对于 `dall-e-2`，请使用 `256x256`, `512x512`，或 `1024x1024`。之一。对于 `dall-e-3`，请使用 `1024x1024`, `1792x1024`，或 `1024x1792`.

            - `string`

            - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

              生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，例如以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的长宽比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。对于 `dall-e-2`，请使用 `256x256`, `512x512`，或 `1024x1024`。之一。对于 `dall-e-3`，请使用 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

          使用指定格式处理输入的自定义工具。了解有关   [自定义工具](/api/docs/guides/function-calling#custom-tools)

          - `name: string`

            自定义工具的名称，用于在工具调用中标识它。

          - `type: "custom"`

            自定义工具的类型，始终为 `custom`.

            - `"custom"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

            工具响应是否可以异步返回，还是在下次创建响应时立即返回。

          - `defer_loading: optional boolean`

            此工具是否应被延迟，并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认为无约束文本。

        - `Namespace object { description, name, tools, type }`

          在共享命名空间下对函数/自定义工具进行分组。

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

                此函数是否应被推迟并通过工具搜索发现。

              - `description: optional string or null`

              - `output_schema: optional map[unknown] or null`

                描述此函数工具中以字符串形式编码的 JSON 值的 JSON Schema。此描述不适用于 content 数组形式的输出。

              - `parameters: optional unknown or null`

              - `strict: optional boolean or null`

                是否强制执行严格的参数校验。如果省略，当 schema 兼容时，Responses 尝试使用严格校验，否则回退到非严格校验。

            - `Custom object { name, type, allowed_callers, 4 more }`

              使用指定格式处理输入的自定义工具。了解有关   [自定义工具](/api/docs/guides/function-calling#custom-tools)

              - `name: string`

                自定义工具的名称，用于在工具调用中标识它。

              - `type: "custom"`

                自定义工具的类型，始终为 `custom`.

                - `"custom"`

              - `allowed_callers: optional array of "direct" or "programmatic" or null`

                工具调用上下文。

                - `"direct"`

                - `"programmatic"`

              - `async: optional boolean`

                工具响应是否可以异步返回，还是在下次创建响应时立即返回。

              - `defer_loading: optional boolean`

                此工具是否应被延迟，并通过工具搜索发现。

              - `description: optional string`

                自定义工具的可选描述，用于提供更多上下文。

              - `format: optional CustomToolInputFormat`

                自定义工具的输入格式。默认为无约束文本。

          - `type: "namespace"`

            工具的类型。始终 `namespace`.

            - `"namespace"`

        - `ToolSearch object { type, description, execution, parameters }`

          针对延迟工具的托管或 BYOT 工具搜索配置。

          - `type: "tool_search"`

            工具的类型。始终 `tool_search`.

            - `"tool_search"`

          - `description: optional string or null`

            展示给模型的、用于客户端执行工具搜索工具的描述。

          - `execution: optional "server" or "client"`

            工具搜索由服务端还是由客户端执行。

            - `"server"`

            - `"client"`

          - `parameters: optional unknown or null`

            客户端执行工具搜索工具的参数 schema。

        - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

          此工具会搜索网页以查找用于回复中的相关结果。详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

          - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

            网页搜索工具的类型之一，为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

            - `"web_search_preview"`

            - `"web_search_preview_2025_03_11"`

          - `search_content_types: optional array of "text" or "image"`

            - `"text"`

            - `"image"`

          - `search_context_size: optional "low" or "medium" or "high"`

            用于搜索的上下文窗口空间的高层级用量指导。可选值为 `low`, `medium`，或 `high`. `medium` 是默认值。

            - `"low"`

            - `"medium"`

            - `"high"`

          - `user_location: optional object { type, city, country, 2 more }  or null`

            用户的大致位置。如果省略或为 null，则默认为 United States。若要避免该回退行为，请传入 `{"type": "approximate"}` 且不包含 location 字段。若要对结果进行本地化，请提供相应的 location 字段。

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

          允许助手使用统一差异（unified diff）创建、删除或更新文件。

          - `type: "apply_patch"`

            工具的类型。始终 `apply_patch`.

            - `"apply_patch"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

      - `type: "additional_tools"`

        该项的类型。始终为 `additional_tools`.

        - `"additional_tools"`

    - `Compaction object { id, encrypted_content, type, created_by }`

      由 [`v1/responses/compact` API](/api/reference/resources/responses/methods/compact).

      - `id: string`

        压缩条目的唯一 ID。

      - `encrypted_content: string`

        由压缩产生的已加密内容。

      - `type: "compaction"`

        该项的类型。始终为 `compaction`.

        - `"compaction"`

      - `created_by: optional string`

        创建该条目的参与者的标识符。

    - `ImageGenerationCall object { id, result, status, 7 more }`

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

      - `action: optional "generate" or "edit" or "auto" or null`

        用于图像生成的动作。

        - `"generate"`

        - `"edit"`

        - `"auto"`

      - `background: optional "transparent" or "opaque" or "auto" or null`

        用于生成的背景设置。

        - `"transparent"`

        - `"opaque"`

        - `"auto"`

      - `output_format: optional "png" or "webp" or "jpeg" or null`

        用于生成的输出格式。

        - `"png"`

        - `"webp"`

        - `"jpeg"`

      - `quality: optional "low" or "medium" or "high" or 3 more or null`

        由图像生成工具调用所生成图像的质量，取值为 `low`, `medium`, `high`, `xhigh`, `max`，或 `auto`.

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

        - `"auto"`

      - `revised_prompt: optional string or null`

        经过任何模型提示重写后使用的提示。

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

        要运行的代码，若不可用则为 null。

      - `container_id: string`

        用于运行代码的容器 ID。

      - `outputs: array of object { logs, type }  or object { type, url }  or null`

        由代码解释器生成的输出，例如日志或图像。
        如果没有可用输出，可以为 null。

        - `Logs object { logs, type }`

          从代码解释器输出的日志。

          - `logs: string`

            从代码解释器输出的日志。

          - `type: "logs"`

            输出的类型。始终为 `logs`.

            - `"logs"`

        - `Image object { type, url }`

          从代码解释器输出的图像。

          - `type: "image"`

            输出的类型。始终为 `image`.

            - `"image"`

          - `url: string`

            从代码解释器输出的图像的 URL。

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

          为该命令设置的环境变量。

        - `type: "exec"`

          本地 shell 操作的类型。始终为 `exec`.

          - `"exec"`

        - `timeout_ms: optional number or null`

          该命令的可选超时时间（毫秒）。

        - `user: optional string or null`

          运行该命令的可选用户。

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

        该项的状态。取值为以下之一： `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

    - `ShellCall object { id, action, call_id, 5 more }`

      在托管环境中执行一条或多条 shell 命令的工具调用。

      - `id: string`

        shell 工具调用的唯一 ID。当此条目通过 API 返回时填充。

      - `action: object { commands, max_output_length, timeout_ms }`

        描述如何运行该工具调用的 shell 命令和限制。

        - `commands: array of string`

        - `max_output_length: number or null`

          可选的每个命令返回的最大字符数。

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

        产生该工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            产生该工具调用的程序项的调用 ID。

          - `type: "program"`

            - `"program"`

      - `created_by: optional string`

        创建此工具调用的实体 ID。

    - `ShellCallOutput object { id, call_id, max_output_length, 5 more }`

      已发出的 shell 工具调用的输出。

      - `id: string`

        shell 调用输出的唯一 ID。通过 API 返回此条目时填充。

      - `call_id: string`

        模型生成的 shell 工具调用的唯一 ID。

      - `max_output_length: number or null`

        shell 命令输出的最大长度。这由模型生成，应与原始输出一起回传。

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

            表示 shell 命令已结束并返回了退出码。

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

          创建该条目的参与者的标识符。

      - `status: "in_progress" or "completed" or "incomplete"`

        shell 调用输出的状态。值为 `in_progress`, `completed`，或 `incomplete`.

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "shell_call_output"`

        shell 调用输出的类型。始终 `shell_call_output`.

        - `"shell_call_output"`

      - `caller: optional object { type }  or object { caller_id, type }  or null`

        产生该工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            产生该工具调用的程序项的调用 ID。

          - `type: "program"`

            - `"program"`

      - `created_by: optional string`

        创建该条目的参与者的标识符。

    - `ApplyPatchCall object { id, call_id, operation, 4 more }`

      通过创建、删除或更新文件来应用文件差异的工具调用。

      - `id: string`

        apply patch 工具调用的唯一 ID。通过 API 返回此条目时填充。

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

            使用提供的差异创建一个新文件。

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

            使用提供的差异更新一个现有文件。

            - `"update_file"`

      - `status: "in_progress" or "completed"`

        apply patch 工具调用的状态。取值为 `in_progress` 或 `completed`.

        - `"in_progress"`

        - `"completed"`

      - `type: "apply_patch_call"`

        该项的类型。始终为 `apply_patch_call`.

        - `"apply_patch_call"`

      - `caller: optional object { type }  or object { caller_id, type }  or null`

        产生该工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            产生该工具调用的程序项的调用 ID。

          - `type: "program"`

            - `"program"`

      - `created_by: optional string`

        创建此工具调用的实体 ID。

    - `ApplyPatchCallOutput object { id, call_id, status, 4 more }`

      apply_patch 工具调用发出的输出。

      - `id: string`

        apply patch 工具调用输出的唯一 ID。当此条目通过 API 返回时填充。

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

        产生该工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            产生该工具调用的程序项的调用 ID。

          - `type: "program"`

            - `"program"`

      - `created_by: optional string`

        创建此工具调用输出的实体的 ID。

      - `output: optional string or null`

        apply_patch 工具返回的可选文本输出。

    - `McpCall object { id, arguments, name, 6 more }`

      对 MCP 服务器上某个工具的一次调用。

      - `id: string`

        工具调用的唯一 ID。

      - `arguments: string`

        传递给该工具的参数，格式为 JSON 字符串。

      - `name: string`

        已运行工具的名称。

      - `server_label: string`

        运行该工具的 MCP 服务器的标签。

      - `type: "mcp_call"`

        该项的类型。始终为 `mcp_call`.

        - `"mcp_call"`

      - `approval_request_id: optional string or null`

        MCP 工具调用审批请求的唯一标识符。
        在后续输入中包含此值，以批准或拒绝相应的工具调用。 `mcp_approval_response` 以批准或拒绝相应的工具调用。

      - `error: optional McpToolCallError or null`

        工具调用产生的错误（如有）。

      - `output: optional string or null`

        工具调用的输出。

      - `status: optional "in_progress" or "completed" or "incomplete" or 2 more`

        工具调用的状态，取值之一为 `in_progress`, `completed`, `incomplete`, `calling`，或 `failed`.

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

          描述该工具输入的 JSON schema。

        - `name: string`

          工具的名称。

        - `annotations: optional unknown or null`

          有关该工具的其他注解。

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

        该工具参数的 JSON 字符串。

      - `name: string`

        要运行的工具的名称。

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

        决策的可选原因。

    - `CustomToolCall object { call_id, input, name, 5 more }`

      对模型创建的自定义工具的调用。

      - `call_id: string`

        用于将此自定义工具调用映射到工具调用输出的标识符。

      - `input: string`

        模型生成的自定义工具调用的输入。

      - `name: string`

        被调用的自定义工具的名称。

      - `type: "custom_tool_call"`

        自定义工具调用的类型。始终为 `custom_tool_call`.

        - `"custom_tool_call"`

      - `id: optional string`

        OpenAI 平台中此自定义工具调用的唯一 ID。

      - `async: optional boolean`

        自定义工具调用是否异步运行。

      - `caller: optional object { type }  or object { caller_id, type }  or null`

        产生该工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            产生该工具调用的程序项的调用 ID。

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

            向模型传入的文本输入。

          - `ResponseInputImage object { detail, type, file_id, 2 more }`

            发送到模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

          - `ResponseInputFile object { type, detail, file_data, 4 more }`

            发送给模型的文件输入。

      - `status: "in_progress" or "completed" or "incomplete"`

        该项的状态。取值为以下之一： `in_progress`, `completed`，或
        `incomplete`。当通过 API 返回项时填充。

        - `"in_progress"`

        - `"completed"`

        - `"incomplete"`

      - `type: "custom_tool_call_output"`

        自定义工具调用输出的类型，恒为 `custom_tool_call_output`.

        - `"custom_tool_call_output"`

      - `caller: optional object { type }  or object { caller_id, type }  or null`

        产生该工具调用的执行上下文。

        - `Direct object { type }`

          - `type: "direct"`

            调用方类型。始终为 `direct`.

            - `"direct"`

        - `Program object { caller_id, type }`

          - `caller_id: string`

            产生该工具调用的程序项的调用 ID。

          - `type: "program"`

            调用方类型。始终为 `program`.

            - `"program"`

      - `created_by: optional string`

        创建该条目的参与者的标识符。

  - `parallel_tool_calls: boolean`

    是否允许模型并行运行工具调用。

  - `temperature: number or null`

    使用的采样温度，介于 0 和 2 之间。较高的值（如 0.8）会使输出更加随机，而较低的值（如 0.2）会使其更加集中和确定性更强。
    我们通常建议修改此参数或 `top_p` 但不能同时使用两者。

  - `tool_choice: ToolChoiceOptions or ToolChoiceAllowed or ToolChoiceTypes or 6 more`

    指定模型在生成响应时应如何选择使用哪个工具（或哪些工具）
    请参阅 `tools` 参数以了解如何指定模型可以调用的工具
    。

    - `ToolChoiceOptions = "none" or "auto" or "required"`

      控制模型调用哪个工具（如果有）。

      `none` 表示模型将不调用任何工具，而是生成一条消息。

      `auto` 表示模型可以在生成消息与调用一个或多个工具之间进行选择。
      多个工具。

      `required` 表示模型必须调用一个或多个工具。

      - `"none"`

      - `"auto"`

      - `"required"`

    - `ToolChoiceAllowed object { mode, tools, type }`

      将模型可用的工具限制为预定义集合。

      - `mode: "auto" or "required"`

        将模型可用的工具限制为预定义集合。

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

        模型应使用的托管工具类型。了解有关
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

      使用此选项可强制模型调用特定的函数。

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

        要在服务器上调用的工具名称。

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

  - `tools: array of object { name, parameters, strict, 6 more }  or object { type, vector_store_ids, filters, 2 more }  or object { type }  or 13 more`

    模型在生成响应时可以调用的工具数组。你可以
    通过设置 `tool_choice` 参数来指定要使用的工具。

    我们支持以下类别的工具：

    - **内置工具**: 由 OpenAI 提供的工具，用于扩展
      模型的能力,例如 [网页搜索](/api/docs/guides/tools-web-search)
      或 [文件搜索](/api/docs/guides/tools-file-search)。详细了解
      [内置工具](/api/docs/guides/tools).
    - **MCP 工具**:通过自定义 MCP 服务端或 Google Drive、SharePoint 等预定义连接器与第三方系统集成。详细了解
      或 Google Drive、SharePoint 等预定义连接器与第三方系统集成。详细了解
      [MCP 工具](/api/docs/guides/tools-connectors-mcp).
    - **函数调用(自定义工具)**:由你定义的函数,
      使模型能够使用强类型参数和返回值调用你自己的代码。详细了解
      。详细了解
      [函数调用](/api/docs/guides/function-calling)。你也可以使用
      自定义工具来调用你自己的代码。

    - `Function object { name, parameters, strict, 6 more }`

      在你自己的代码中定义一个可供模型选择调用的函数。了解更多关于 [函数调用](/api/docs/guides/function-calling).

      - `name: string`

        要调用的函数的名称。

      - `parameters: map[unknown] or null`

        描述函数参数的 JSON schema 对象。

      - `strict: boolean or null`

        是否对此函数工具强制执行严格的参数校验。

      - `type: "function"`

        函数工具的类型。始终为 `function`.

        - `"function"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

      - `async: optional boolean`

      - `defer_loading: optional boolean`

        此函数是否被延迟并通过工具搜索加载。

      - `description: optional string or null`

        函数的描述。供模型用于判断是否调用该函数。

      - `output_schema: optional map[unknown] or null`

        描述此函数字符串输出中所编码 JSON 值的 JSON schema 对象。

    - `FileSearch object { type, vector_store_ids, filters, 2 more }`

      从已上传文件中搜索相关内容的工具。详细了解 [文件搜索工具](/api/docs/guides/tools-file-search).

      - `type: "file_search"`

        文件搜索工具的类型，始终 `file_search`.

        - `"file_search"`

      - `vector_store_ids: array of string`

        要搜索的向量存储的 ID。

      - `filters: optional ComparisonFilter or CompoundFilter or null`

        要应用的筛选条件。

        - `ComparisonFilter object { key, type, value }`

          用于使用已定义的比较操作将指定属性键与给定值进行比较的筛选条件。

        - `CompoundFilter object { filters, type }`

          使用以下方式组合多个筛选条件 `and` 或 `or`.

      - `max_num_results: optional number`

        返回结果的最大数量。该数量应在 1 到 50 之间（含两端）。

      - `ranking_options: optional object { hybrid_search, ranker, score_threshold }`

        搜索的排序选项。

        - `hybrid_search: optional object { embedding_weight, text_weight }`

          控制倒数排名融合在启用混合搜索时如何平衡语义嵌入匹配与稀疏关键词匹配的权重。

          - `embedding_weight: number`

            倒数排名融合中嵌入的权重。

          - `text_weight: number`

            倒数排名融合中文本的权重。

        - `ranker: optional "auto" or "default-2024-11-15"`

          用于文件搜索的排序器。

          - `"auto"`

          - `"default-2024-11-15"`

        - `score_threshold: optional number`

          文件搜索的分数阈值，取值范围为 0 到 1。越接近 1 的数值会尝试仅返回最相关的结果，但可能返回的结果更少。

    - `Computer object { type }`

      用于控制虚拟计算机的工具。了解更多关于 [computer 工具](/api/docs/guides/tools-computer-use).

      - `type: "computer"`

        computer 工具的类型。始终为 `computer`.

        - `"computer"`

    - `ComputerUsePreview object { display_height, display_width, environment, type }`

      用于控制虚拟计算机的工具。了解更多关于 [computer 工具](/api/docs/guides/tools-computer-use).

      - `display_height: number`

        计算机显示的高度。

      - `display_width: number`

        计算机显示的宽度。

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
      [网页搜索工具](/api/docs/guides/tools-web-search).

      - `type: "web_search" or "web_search_2025_08_26"`

        网页搜索工具的类型之一，为 `web_search` 或 `web_search_2025_08_26`.

        - `"web_search"`

        - `"web_search_2025_08_26"`

      - `external_web_access: optional boolean`

        允许 网页搜索 进行实时互联网访问。省略时默认为 true。当为 false 时，网页搜索工具以离线/仅缓存模式运行，不会获取新的外部内容。

      - `filters: optional object { allowed_domains }  or null`

        搜索的筛选条件。

        - `allowed_domains: optional array of string or null`

          搜索所允许的域名。如果未提供，则允许所有域名。
          所提供域名的子域名同样允许。

          示例： `["pubmed.ncbi.nlm.nih.gov"]`

      - `search_context_size: optional "low" or "medium" or "high"`

        用于搜索的上下文窗口空间的高层级用量指导。可选值为 `low`, `medium`，或 `high`. `medium` 是默认值。

        - `"low"`

        - `"medium"`

        - `"high"`

      - `user_location: optional object { city, country, region, 2 more }  or null`

        用户的大致位置。如果省略或为 null，则默认为
        美国。若要避免该回退，请传入 `{"type": "approximate"}` 不包含
        字段的位置。若要本地化结果，请提供相关的位置字段。

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

      通过远程模型上下文协议
      (MCP) 服务器为模型提供对额外工具的访问。 [了解有关 MCP 的更多信息](/api/docs/guides/tools-connectors-mcp).

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

        允许的工具名称列表或筛选对象。

        - `McpAllowedTools = array of string`

          允许的工具名称组成的字符串数组

        - `McpToolFilter object { read_only, tool_names }`

          用于指定允许哪些工具的筛选对象。

          - `read_only: optional boolean`

            指示工具是修改数据还是只读。如果某个
            MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
            它将匹配此筛选条件。

          - `tool_names: optional array of string`

            允许的工具名称列表。

      - `authorization: optional string`

        可用于远程 MCP 服务器的 OAuth 访问令牌，配合
        自定义 MCP 服务器 URL 或服务连接器一起使用。你的应用
        必须处理 OAuth 授权流程并在此提供令牌。

      - `connector_id: optional "connector_dropbox" or "connector_gmail" or "connector_googlecalendar" or 5 more`

        服务连接器的标识符，例如 ChatGPT 中提供的那些。必须提供
        `server_url`, `connector_id`，或 `tunnel_id` 其中之一。详细了解
        关于服务连接器的信息 [here](/api/docs/guides/tools-connectors-mcp#connectors).

        此字段对 2026 年 9 月 1 日之后发布的模型已弃用。
        请使用 `server_url` 以连接到远程 MCP 服务器，或 `tunnel_id` 通过
        安全 MCP 隧道进行连接。

        当前支持 `connector_id` 的取值：

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

        此 MCP 工具是否被延迟，并通过工具搜索被发现。

      - `headers: optional map[string] or null`

        发送到 MCP 服务器的可选 HTTP 头。用于身份验证
        或其他用途。

      - `require_approval: optional object { always, never }  or "always" or "never" or null`

        指定 MCP 服务器中哪些工具需要审批。

        - `McpToolApprovalFilter object { always, never }`

          指定 MCP 服务器的哪些工具需要审批。可以是
          `always`, `never`,或与需要审批的工具关联的筛选对象
          。

          - `always: optional object { read_only, tool_names }`

            用于指定允许哪些工具的筛选对象。

            - `read_only: optional boolean`

              指示工具是修改数据还是只读。如果某个
              MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此筛选条件。

            - `tool_names: optional array of string`

              允许的工具名称列表。

          - `never: optional object { read_only, tool_names }`

            用于指定允许哪些工具的筛选对象。

            - `read_only: optional boolean`

              指示工具是修改数据还是只读。如果某个
              MCP 服务器被 [annotated with `readOnlyHint`](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations-readonlyhint),
              它将匹配此筛选条件。

            - `tool_names: optional array of string`

              允许的工具名称列表。

        - `McpToolApprovalSetting = "always" or "never"`

          为所有工具指定统一的审批策略。可选值为 `always` 或
          `never`. When set to `always`，所有工具都需要审批。When
          set to `never`，所有工具都不需要审批。

          - `"always"`

          - `"never"`

      - `server_description: optional string`

        MCP 服务器的可选描述，用于提供更多上下文。

      - `server_url: optional string`

        MCP 服务器的 URL。必须提供以下之一： `server_url`, `connector_id`，或
        `tunnel_id` 其中之一。

      - `tunnel_id: optional string`

        用于替代直接服务器 URL 的 Secure MCP Tunnel ID。必须提供以下之一：
        `server_url`, `connector_id`，或 `tunnel_id` 其中之一。

    - `CodeInterpreter object { container, type, allowed_callers }`

      运行 Python 代码以帮助生成对提示词响应的工具。

      - `container: string or object { type, file_ids, memory_limit, network_policy }`

        代码解释器容器。可以是容器 ID，也可以是一个对象，用于指定可供代码使用的已上传文件 ID，以及一个
        指定可供代码使用的已上传文件 ID 以及一个可选的
        可选的 `memory_limit` 设置。

        - `string`

          容器 ID。

        - `CodeInterpreterToolAuto object { type, file_ids, memory_limit, network_policy }`

          代码解释器容器的配置。可选择指定要运行代码的文件 ID。

          - `type: "auto"`

            始终为 `auto`.

            - `"auto"`

          - `file_ids: optional array of string`

            可供代码使用的已上传文件可选列表。

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

        是生成新图像还是编辑现有图像。默认： `auto`.

        - `"generate"`

        - `"edit"`

        - `"auto"`

      - `background: optional "transparent" or "opaque" or "auto"`

        设置生成图像的背景。可选值为 `transparent`, `opaque`,
        或 `auto`. `gpt-image-2.5-sunburst` 和 `gpt-image-2.5-flare`，包括
        它们的 `2026-09-08` 快照，支持 `opaque` 和 `transparent`
        背景。受支持的 GPT Image
        模型可使用透明背景。对于 `gpt-image-2` 和 `gpt-image-2-2026-04-21`，此支持处于
        预览阶段。当使用 `transparent`，将输出格式设置为 `png` 或 `webp`.
        默认值： `auto`.

        - `"transparent"`

        - `"opaque"`

        - `"auto"`

      - `input_fidelity: optional "high" or "low" or null`

        控制模型在匹配输入图像的风格和特征（尤其是面部特征）时所付出的努力程度。该参数仅支持 `gpt-image-1` 和 `gpt-image-1.5` 及更高版本的模型，不支持 `gpt-image-1-mini`。支持 `high` 和 `low`。之一。默认为 `low`.

        - `"high"`

        - `"low"`

      - `input_image_mask: optional object { file_id, image_url }`

        用于局部重绘的可选遮罩。包含 `image_url`
        （字符串，可选）和 `file_id` （字符串，可选）。

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

        在流式模式下生成的部分图像数量，范围为 0（默认值）到 3。

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

        生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，例如以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的长宽比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。对于 `dall-e-2`，请使用 `256x256`, `512x512`，或 `1024x1024`。之一。对于 `dall-e-3`，请使用 `1024x1024`, `1792x1024`，或 `1024x1792`.

        - `string`

        - `"1024x1024" or "1024x1536" or "1536x1024" or "auto"`

          生成图像的尺寸。对于 `gpt-image-2`, `gpt-image-2-2026-04-21`, `gpt-image-2.5-sunburst`, `gpt-image-2.5-sunburst-2026-09-08`, `gpt-image-2.5-flare`，以及 `gpt-image-2.5-flare-2026-09-08`，支持任意分辨率，例如以 `WIDTHxHEIGHT` 字符串形式指定，例如 `1536x864`。宽度和高度都必须能被 16 整除，且所请求的长宽比必须在 1:3 到 3:1 之间。超过 `2560x1440` 的分辨率为实验性功能，最大支持的分辨率为 `3840x2160`。请求的尺寸还必须满足模型当前的像素和边长限制。标准尺寸 `1024x1024`, `1536x1024`，以及 `1024x1536` 受 GPT 图像模型支持； `auto` 适用于支持自动尺寸的模型。对于 `dall-e-2`，请使用 `256x256`, `512x512`，或 `1024x1024`。之一。对于 `dall-e-3`，请使用 `1024x1024`, `1792x1024`，或 `1024x1792`.

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

      使用指定格式处理输入的自定义工具。了解有关   [自定义工具](/api/docs/guides/function-calling#custom-tools)

      - `name: string`

        自定义工具的名称，用于在工具调用中标识它。

      - `type: "custom"`

        自定义工具的类型，始终为 `custom`.

        - `"custom"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

      - `async: optional boolean`

        工具响应是否可以异步返回，还是在下次创建响应时立即返回。

      - `defer_loading: optional boolean`

        此工具是否应被延迟，并通过工具搜索发现。

      - `description: optional string`

        自定义工具的可选描述，用于提供更多上下文。

      - `format: optional CustomToolInputFormat`

        自定义工具的输入格式。默认为无约束文本。

    - `Namespace object { description, name, tools, type }`

      在共享命名空间下对函数/自定义工具进行分组。

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

            此函数是否应被推迟并通过工具搜索发现。

          - `description: optional string or null`

          - `output_schema: optional map[unknown] or null`

            描述此函数工具中以字符串形式编码的 JSON 值的 JSON Schema。此描述不适用于 content 数组形式的输出。

          - `parameters: optional unknown or null`

          - `strict: optional boolean or null`

            是否强制执行严格的参数校验。如果省略，当 schema 兼容时，Responses 尝试使用严格校验，否则回退到非严格校验。

        - `Custom object { name, type, allowed_callers, 4 more }`

          使用指定格式处理输入的自定义工具。了解有关   [自定义工具](/api/docs/guides/function-calling#custom-tools)

          - `name: string`

            自定义工具的名称，用于在工具调用中标识它。

          - `type: "custom"`

            自定义工具的类型，始终为 `custom`.

            - `"custom"`

          - `allowed_callers: optional array of "direct" or "programmatic" or null`

            工具调用上下文。

            - `"direct"`

            - `"programmatic"`

          - `async: optional boolean`

            工具响应是否可以异步返回，还是在下次创建响应时立即返回。

          - `defer_loading: optional boolean`

            此工具是否应被延迟，并通过工具搜索发现。

          - `description: optional string`

            自定义工具的可选描述，用于提供更多上下文。

          - `format: optional CustomToolInputFormat`

            自定义工具的输入格式。默认为无约束文本。

      - `type: "namespace"`

        工具的类型。始终 `namespace`.

        - `"namespace"`

    - `ToolSearch object { type, description, execution, parameters }`

      针对延迟工具的托管或 BYOT 工具搜索配置。

      - `type: "tool_search"`

        工具的类型。始终 `tool_search`.

        - `"tool_search"`

      - `description: optional string or null`

        展示给模型的、用于客户端执行工具搜索工具的描述。

      - `execution: optional "server" or "client"`

        工具搜索由服务端还是由客户端执行。

        - `"server"`

        - `"client"`

      - `parameters: optional unknown or null`

        客户端执行工具搜索工具的参数 schema。

    - `WebSearchPreview object { type, search_content_types, search_context_size, user_location }`

      此工具会搜索网页以查找用于回复中的相关结果。详细了解 [网页搜索工具](/api/docs/guides/tools-web-search).

      - `type: "web_search_preview" or "web_search_preview_2025_03_11"`

        网页搜索工具的类型之一，为 `web_search_preview` 或 `web_search_preview_2025_03_11`.

        - `"web_search_preview"`

        - `"web_search_preview_2025_03_11"`

      - `search_content_types: optional array of "text" or "image"`

        - `"text"`

        - `"image"`

      - `search_context_size: optional "low" or "medium" or "high"`

        用于搜索的上下文窗口空间的高层级用量指导。可选值为 `low`, `medium`，或 `high`. `medium` 是默认值。

        - `"low"`

        - `"medium"`

        - `"high"`

      - `user_location: optional object { type, city, country, 2 more }  or null`

        用户的大致位置。如果省略或为 null，则默认为 United States。若要避免该回退行为，请传入 `{"type": "approximate"}` 且不包含 location 字段。若要对结果进行本地化，请提供相应的 location 字段。

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

      允许助手使用统一差异（unified diff）创建、删除或更新文件。

      - `type: "apply_patch"`

        工具的类型。始终 `apply_patch`.

        - `"apply_patch"`

      - `allowed_callers: optional array of "direct" or "programmatic" or null`

        工具调用上下文。

        - `"direct"`

        - `"programmatic"`

  - `top_p: number or null`

    温度采样的替代方法,称为核采样,
    其中模型仅考虑 top_p 概率质量范围内的标记结果。
    因此 0.1 表示仅考虑构成前 10% 概率质量的标记。
    。

    我们通常建议修改此参数或 `temperature` 但不能同时使用两者。

  - `background: optional boolean or null`

    是否在后台运行模型响应。
    [详细了解](/api/docs/guides/background).

  - `completed_at: optional number or null`

    该 Response 完成时的 Unix 时间戳（单位为秒）。
    仅在状态为 `completed`.

  - `conversation: optional object { id }  or null`

    该 Response 所属的对话。该 Response 中的输入项和输出项已自动添加到该对话中。

    - `id: string`

      该 Response 所关联对话的唯一 ID。

  - `max_output_tokens: optional number or null`

    可为响应生成的最大 token 数上限，包括可见输出 token 和 [推理 token](/api/docs/guides/reasoning).

  - `max_tool_calls: optional number or null`

    可在一次响应中处理的内置工具调用总次数上限。该上限适用于所有内置工具调用，而非按单个工具计算。模型后续任何进一步的工具调用尝试都将被忽略。

  - `moderation: optional object { input, output }  or null`

    如果请求了审核补全，则为响应输入和输出的审核结果。

    - `input: object { categories, category_applied_input_types, category_scores, 3 more }  or object { code, message, type }`

      针对响应输入的审核。

      - `ModerationResult object { categories, category_applied_input_types, category_scores, 3 more }`

        为响应输入或输出生成的审核结果。

        - `categories: map[boolean]`

          由审核类别映射到布尔值的字典，若输入在该类别下被标记则为 True。

        - `category_applied_input_types: map[array of "text" or "image"]`

          每个类别的分数所反映的输入模态。

          - `"text"`

          - `"image"`

        - `category_scores: map[number]`

          由审核类别映射到分数的字典。

        - `flagged: boolean`

          指示内容是否被任何类别标记的布尔值。

        - `model: string`

          生成该结果的审核模型。

        - `type: "moderation_result"`

          对象类型，始终为 `moderation_result` （表示成功的审核结果）。

          - `"moderation_result"`

      - `Error object { code, message, type }`

        在为响应输入或输出执行审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误信息。

        - `type: "error"`

          对象类型，始终为 `error` 用于审核失败。

          - `"error"`

    - `output: object { categories, category_applied_input_types, category_scores, 3 more }  or object { code, message, type }`

      对响应输出进行审核。

      - `ModerationResult object { categories, category_applied_input_types, category_scores, 3 more }`

        为响应输入或输出生成的审核结果。

        - `categories: map[boolean]`

          由审核类别映射到布尔值的字典，若输入在该类别下被标记则为 True。

        - `category_applied_input_types: map[array of "text" or "image"]`

          每个类别的分数所反映的输入模态。

          - `"text"`

          - `"image"`

        - `category_scores: map[number]`

          由审核类别映射到分数的字典。

        - `flagged: boolean`

          指示内容是否被任何类别标记的布尔值。

        - `model: string`

          生成该结果的审核模型。

        - `type: "moderation_result"`

          对象类型，始终为 `moderation_result` （表示成功的审核结果）。

          - `"moderation_result"`

      - `Error object { code, message, type }`

        在为响应输入或输出执行审核时产生的错误。

        - `code: string`

          错误代码。

        - `message: string`

          错误信息。

        - `type: "error"`

          对象类型，始终为 `error` 用于审核失败。

          - `"error"`

  - `output_text: optional string or null`

    仅 SDK 提供的便捷属性，包含来自所有
    输出项的 `output_text` 数组（若存在）中的聚合 `output` 文本输出。
    受 Python 和 JavaScript SDK 支持。

  - `previous_response_id: optional string or null`

    上一条模型响应的唯一 ID。使用它可以
    创建多轮对话。详细了解
    [对话状态](/api/docs/guides/conversation-state)。不能与 `conversation`.

  - `prompt: optional ResponsePrompt or null`

    对提示模板及其变量的引用。
    [详细了解](/api/docs/guides/text?api-mode=responses#version-prompts-in-code).

    - `id: string`

      要使用的提示模板的唯一标识符。

    - `variables: optional map[string or ResponseInputText or ResponseInputImage or ResponseInputFile] or null`

      可选的映射值，用于替换你的
      提示中的变量。替换值可以是字符串，也可以是其他
      响应输入类型，例如图像或文件。

      - `string`

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        向模型传入的文本输入。

      - `ResponseInputImage object { detail, type, file_id, 2 more }`

        发送到模型的图像输入。了解有关 [图像输入](/api/docs/guides/images-vision).

      - `ResponseInputFile object { type, detail, file_data, 4 more }`

        发送给模型的文件输入。

    - `version: optional string or null`

      提示模板的可选版本。

  - `prompt_cache_diagnostics: optional object { cache_missed_tokens, reason, type, comparison_reusable_tokens }  or object { type }  or object { type }  or object { type }`

    本次响应请求的提示缓存诊断信息。

    - `CacheMiss object { cache_missed_tokens, reason, type, comparison_reusable_tokens }`

      - `cache_missed_tokens: number`

        在首次检测到的分歧之后，受影响的输入 token 的估计数量。

      - `reason: "model_changed" or "prompt_cache_key_changed" or "tools_changed" or 6 more`

        未发生提示缓存复用 的原因。

        - `"model_changed"`

        - `"prompt_cache_key_changed"`

        - `"tools_changed"`

        - `"text_format_changed"`

        - `"reasoning_effort_changed"`

        - `"verbosity_changed"`

        - `"context_compacted"`

        - `"input_changed"`

        - `"service_tier_changed"`

      - `type: "cache_miss"`

        - `"cache_miss"`

      - `comparison_reusable_tokens: optional number`

        对比响应中可复用前缀的原始 token 数。

    - `CacheHit object { type }`

      - `type: "cache_hit"`

        - `"cache_hit"`

    - `ComparisonResponseNotFound object { type }`

      - `type: "comparison_response_not_found"`

        - `"comparison_response_not_found"`

    - `Unavailable object { type }`

      - `type: "unavailable"`

        - `"unavailable"`

  - `prompt_cache_key: optional string or null`

    由 OpenAI 用于缓存相似请求的响应，以优化你的缓存命中率。取代了 `user` 字段。 [详细了解](/api/docs/guides/prompt-caching).

  - `prompt_cache_options: optional object { mode, ttl, comparison_response_id }`

    应用于该响应的 prompt 缓存选项。支持 `gpt-5.6` 及更高版本模型。

    - `mode: "implicit" or "explicit"`

      是否启用了隐式 prompt 缓存断点。

      - `"implicit"`

      - `"explicit"`

    - `ttl: "30m"`

      应用于每个缓存断点的最短保留时间。

      - `"30m"`

    - `comparison_response_id: optional string or null`

      作为 prompt 缓存诊断对比提供的响应 ID。

  - `prompt_cache_retention: optional "in_memory" or "24h" or null`

    已弃用。请使用 `prompt_cache_options.ttl` 替代。

    prompt 缓存的保留策略。设置为 `24h` 以启用扩展 prompt 缓存，使缓存的前缀保持更长时间的活跃状态，最长可达 24 小时。 [详细了解](/api/docs/guides/prompt-caching#prompt-cache-retention).
    该字段表示最长保留策略，而
    `prompt_cache_options.ttl` 表示最短缓存生命周期。两个
    字段相互独立，不会相互影响。
    对于 `gpt-5.5`, `gpt-5.5-pro`，及未来模型，仅 `24h` 受支持。

    对于同时支持 `in_memory` 和 `24h`，的较旧模型，默认值取决于你所在组织的数据保留策略：

    - 未启用 ZDR 的组织默认为 `24h`.
    - 启用 ZDR 的组织默认使用 `in_memory` 当 `prompt_cache_retention` 未指定时。

    - `"in_memory"`

    - `"24h"`

  - `reasoning: optional Reasoning or null`

    针对
    [推理模型](/api/docs/guides/reasoning).

    - `context: optional "auto" or "current_turn" or "all_turns" or null`

      控制在后续轮次中哪些推理项会被传回给模型。
      如果省略或设置为 `auto`，由模型自行决定上下文模式。
      `gpt-5.6` 模型系列默认为 `all_turns`；较早的模型默认为
      `current_turn`.

      在响应中返回时，这就是该响应实际使用的推理上下文模式
      。

      - `"auto"`

      - `"current_turn"`

      - `"all_turns"`

    - `effort: optional ReasoningEffort or null`

      限制推理模型在推理上的投入程度。当前支持
      的值包括 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
      降低推理投入程度可以带来更快的响应，并在响应中使用更少的推理 token
      。并非所有推理模型都支持每个
      值。请参阅
      [推理指南](/api/docs/guides/reasoning)
      以了解特定模型的支持情况。

    - `generate_summary: optional "auto" or "concise" or "detailed" or null`

      **已弃用：** 使用 `summary` 替代。

      对模型所执行推理的摘要。可用于调试和理解模型的推理过程。
      useful for debugging and understanding the model's reasoning process.
      以下值之一 `auto`, `concise`，或 `detailed`.

      - `"auto"`

      - `"concise"`

      - `"detailed"`

    - `mode: optional string or "standard" or "pro"`

      控制请求的推理执行模式。

      在响应中返回时，表示实际生效的执行模式。

      - `string`

      - `"standard" or "pro"`

        控制请求的推理执行模式。

        在响应中返回时，表示实际生效的执行模式。

        - `"standard"`

        - `"pro"`

    - `summary: optional "auto" or "concise" or "detailed" or null`

      对模型所执行推理的摘要。可用于调试和理解模型的推理过程。
      useful for debugging and understanding the model's reasoning process.
      以下值之一 `auto`, `concise`，或 `detailed`.

      `concise` 支持以下模型 `computer-use-preview` 及之后的所有推理模型 `gpt-5`.

      - `"auto"`

      - `"concise"`

      - `"detailed"`

  - `safety_identifier: optional string or null`

    一个稳定的标识符，用于帮助检测可能违反 OpenAI 使用政策的应用用户。
    该 ID 应为可唯一标识每位用户的字符串，最大长度为 64 个字符。我们建议对用户名或电子邮件地址进行哈希处理，以避免向我们发送任何身份信息。 [详细了解](/api/docs/guides/safety-best-practices#implement-safety-identifiers).

  - `service_tier: optional ServiceTier or null`

    指定用于处理请求的处理类型。

    - 若设置为 'auto'，则请求将使用在项目设置中配置的服务层级进行处理。除非另行配置，否则项目将使用 'default'。
    - 若设置为 'default'，则请求将按所选模型的标准定价和性能进行处理。
    - 若设置为 '[flex](/api/docs/guides/flex-processing)'，则请求将使用 Flex Processing 服务层级进行处理。
    - 若要在请求级别启用 [快速模式](/api/docs/guides/fast-mode) ，请在 Responses 或 Chat Completions 请求中包含该 `service_tier=fast` 或 `service_tier=priority` 参数。响应中将显示 `service_tier=priority` 无论你是否指定 `service_tier=fast` 或 `priority` 于你的请求中。
    - 如果设置为 'ultrafast'，则请求将使用受访问控制的 Ultrafast Processing 服务层级进行处理。该层级目前可用于 `gpt-5.6-sol`；通过该层级返回的响应将显示 `service_tier=ultrafast`.
    - 未设置时，默认行为为 'auto'。

    当 `service_tier` 参数被设置时，响应正文将包含基于实际用于处理该请求的处理模式的 `service_tier` 值。此响应值可能与参数中设置的值不同。

    - `"auto"`

    - `"default"`

    - `"flex"`

    - `"scale"`

    - `"priority"`

    - `"fast"`

    - `"ultrafast"`

  - `status: optional ResponseStatus`

    响应生成的状态。之一 `completed`, `failed`,
    `in_progress`, `cancelled`, `queued`，或 `incomplete`.

    - `"completed"`

    - `"failed"`

    - `"in_progress"`

    - `"cancelled"`

    - `"queued"`

    - `"incomplete"`

  - `text: optional ResponseTextConfig`

    来自模型的文本响应的配置选项。可以是纯
    文本或结构化的 JSON 数据。了解更多：

    - [文本输入与输出](/api/docs/guides/text)
    - [结构化输出](/api/docs/guides/structured-outputs)

    - `format: optional ResponseFormatTextConfig`

      指定模型必须输出的格式的对象。

      配置 `{ "type": "json_schema" }` 可启用结构化输出，
      从而确保模型与你提供的 JSON schema 匹配。详见
      [结构化输出指南](/api/docs/guides/structured-outputs).

      默认格式为 `{ "type": "text" }` ，且无其他选项。

      **不建议用于 gpt-4o 及更新的模型：**

      设置为 `{ "type": "json_object" }` 可启用旧的 JSON 模式，该模式
      可确保模型生成的消息是有效的 JSON。对于支持 `json_schema`
      的模型，建议优先使用它。

      - `ResponseFormatText object { type }`

        默认响应格式。用于生成文本响应。

        - `type: "text"`

          正在定义的响应格式的类型。始终为 `text`.

          - `"text"`

      - `ResponseFormatTextJSONSchemaConfig object { name, schema, type, 2 more }`

        JSON Schema 响应格式。用于生成结构化 JSON 响应。
        详细了解 [结构化输出](/api/docs/guides/structured-outputs).

        - `name: string`

          响应格式的名称。必须由 a-z、A-Z、0-9 组成，或包含
          下划线和短横线，最大长度为 64。

        - `schema: map[unknown]`

          响应格式的架构，以 JSON Schema 对象描述。
          了解如何构建 JSON 架构 [here](https://json-schema.org/).

        - `type: "json_schema"`

          正在定义的响应格式的类型。始终为 `json_schema`.

          - `"json_schema"`

        - `description: optional string`

          对响应格式用途的描述，供模型用于
          确定如何按该格式进行响应。

        - `strict: optional boolean or null`

          是否在生成输出时启用严格的架构遵循。
          如果设置为 true，模型将始终遵循
          字段中 `schema` 定义的确切架构。当设置为
          `strict` 为 `true`. 如需了解更多信息，请阅读 [结构化输出
          指南](/api/docs/guides/structured-outputs).

      - `ResponseFormatJSONObject object { type }`

        JSON 对象响应格式。一种较旧的生成 JSON 响应的方法。
        使用 `json_schema` 推荐用于支持它的模型。请注意，
        模型在没有系统或用户消息指示的情况下不会生成 JSON
        这样做。

        - `type: "json_object"`

          正在定义的响应格式的类型。始终为 `json_object`.

          - `"json_object"`

    - `verbosity: optional "low" or "medium" or "high" or null`

      限制模型响应的详细程度。较低的值将产生
      更简洁的响应，而较高的值将产生更详细的响应。
      当前支持的值包括 `low`, `medium`，以及 `high`。默认值为
      `medium`.

      - `"low"`

      - `"medium"`

      - `"high"`

  - `top_logprobs: optional number or null`

    一个介于 0 到 20 之间的整数，指定在每个 token 位置返回的最可能
    token 的最大数量，每个 token 都附带一个对应的对数
    概率。在某些情况下，返回的 token 数量可能会少于
    请求的数量。

  - `truncation: optional "auto" or "disabled" or null`

    用于模型响应的截断策略。

    - `auto`：如果此 Response 的输入超出
      模型的上下文窗口大小，模型将通过从对话开头丢弃条目来截断
      响应以适配上下文窗口。
    - `disabled` （默认）：如果输入大小将超出上下文窗口
      模型的大小，请求将失败并返回 400 错误。

    - `"auto"`

    - `"disabled"`

  - `usage: optional ResponseUsage or null`

    表示令牌使用详情，包括输入令牌、输出令牌、
    输出令牌的明细，以及使用的令牌总数。

    - `input_tokens: number`

      输入令牌的数量。

    - `input_tokens_details: object { cache_write_tokens, cached_tokens }`

      输入令牌的详细明细。

      - `cache_write_tokens: number`

        写入缓存的输入令牌数量。

      - `cached_tokens: number`

        从缓存中检索到的令牌数量。
        [了解更多关于提示缓存的信息](/api/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出令牌的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出令牌的详细明细。

      - `reasoning_tokens: number`

        推理令牌的数量。

    - `total_tokens: number`

      使用的令牌总数。

  - `user: optional string or null`

    该字段将被 `safety_identifier` 和 `prompt_cache_key`。取代。请使用 `prompt_cache_key` 以维持缓存优化。
    你最终用户的稳定标识符。
    用于通过对相似请求进行更好的分桶以提高缓存命中率，并帮助 OpenAI 检测和防止滥用。 [详细了解](/api/docs/guides/safety-best-practices#implement-safety-identifiers).

### 示例

```http
curl https://api.openai.com/v1/responses/$RESPONSE_ID/cancel \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "resp_67ccd3a9da748190baa7f1570fe91ac604becb25c45c1d41",
  "object": "response",
  "access_programs": null,
  "created_at": 1741476777,
  "status": "completed",
  "completed_at": 1741476778,
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "model": "gpt-6-astra",
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
          "annotations": [],
          "logprobs": []
        }
      ]
    }
  ],
  "parallel_tool_calls": true,
  "previous_response_id": null,
  "reasoning": {
    "effort": null,
    "summary": null,
    "context": null
  },
  "store": true,
  "temperature": 1,
  "text": {
    "format": {
      "type": "text"
    }
  },
  "tool_choice": "auto",
  "tools": [],
  "top_p": 1,
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
  "metadata": {},
  "conversation": {
    "id": "id"
  },
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
  "prompt_cache_diagnostics": {
    "cache_missed_tokens": 0,
    "reason": "model_changed",
    "type": "cache_miss",
    "comparison_reusable_tokens": 0
  },
  "prompt_cache_options": {
    "mode": "implicit",
    "ttl": "30m",
    "comparison_response_id": "comparison_response_id"
  },
  "service_tier": "auto"
}
```

### 示例

```http
curl -X POST https://api.openai.com/v1/responses/resp_123/cancel \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "resp_67cb71b351908190a308f3859487620d06981a8637e6bc44",
  "object": "response",
  "access_programs": null,
  "created_at": 1741386163,
  "status": "cancelled",
  "background": true,
  "completed_at": null,
  "error": null,
  "incomplete_details": null,
  "instructions": null,
  "max_output_tokens": null,
  "model": "gpt-6-astra",
  "output": [
    {
      "type": "message",
      "id": "msg_67cb71b3c2b0819084d481baaaf148f206981a8637e6bc44",
      "status": "in_progress",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "Silent circuits hum,  \nThoughts emerge in data streams—  \nDigital dawn breaks.",
          "annotations": [],
          "logprobs": []
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
  "usage": null,
  "user": null,
  "metadata": {}
}
```
