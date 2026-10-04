# Graders

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面提供 Markdown 版本，可在页面 URL 后追加 `.md` 来获取。

# Grader Models

## Domain Types

### Grader Inputs

- `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

  输入列表，其中每一项可以是输入文本、输出文本、输入
  图像或输入音频对象。

  - `TextInput = string`

    发送给模型的文本输入。

  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

    发送给模型的文本输入。

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

  - `OutputText object { text, type }`

    模型输出的文本。

    - `text: string`

      模型输出的文本。

    - `type: "output_text"`

      输出文本的类型。始终为 `output_text`.

      - `"output_text"`

  - `InputImage object { image_url, type, detail }`

    EvalItem 内容数组中使用的图像输入块。

    - `image_url: string`

      图像输入的 URL。

    - `type: "input_image"`

      图像输入的类型。始终为 `input_image`.

      - `"input_image"`

    - `detail: optional string`

      发送给模型的图像的细节级别。可选值为 `high`, `low`，或 `auto`。默认为 `auto`.

  - `ResponseInputAudio object { input_audio, type }`

    发送给模型的音频输入。

    - `input_audio: object { data, format }`

      - `data: string`

        Base64 编码的音频数据。

      - `format: "mp3" or "wav"`

        音频数据的格式。目前支持的格式包括 `mp3` 和
        `wav`.

        - `"mp3"`

        - `"wav"`

    - `type: "input_audio"`

      输入项的类型。始终为 `input_audio`.

      - `"input_audio"`

### 标签模型评分器

- `LabelModelGrader object { input, labels, model, 3 more }`

  一个 LabelModelGrader 对象，使用模型为评估中的每个项目分配标签
  。

  - `input: array of object { content, role, type }`

    - `content: string or ResponseInputText or object { text, type }  or 3 more`

      模型的输入——可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目，也可以是项目数组。

      - `TextInput = string`

        发送给模型的文本输入。

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        发送给模型的文本输入。

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

      - `OutputText object { text, type }`

        模型输出的文本。

        - `text: string`

          模型输出的文本。

        - `type: "output_text"`

          输出文本的类型。始终为 `output_text`.

          - `"output_text"`

      - `InputImage object { image_url, type, detail }`

        EvalItem 内容数组中使用的图像输入块。

        - `image_url: string`

          图像输入的 URL。

        - `type: "input_image"`

          图像输入的类型。始终为 `input_image`.

          - `"input_image"`

        - `detail: optional string`

          发送给模型的图像的细节级别。可选值为 `high`, `low`，或 `auto`。默认为 `auto`.

      - `ResponseInputAudio object { input_audio, type }`

        发送给模型的音频输入。

        - `input_audio: object { data, format }`

          - `data: string`

            Base64 编码的音频数据。

          - `format: "mp3" or "wav"`

            音频数据的格式。目前支持的格式包括 `mp3` 和
            `wav`.

            - `"mp3"`

            - `"wav"`

        - `type: "input_audio"`

          输入项的类型。始终为 `input_audio`.

          - `"input_audio"`

      - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

        输入列表，其中每一项可以是输入文本、输出文本、输入
        图像或输入音频对象。

        - `TextInput = string`

          发送给模型的文本输入。

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

        - `OutputText object { text, type }`

          模型输出的文本。

          - `text: string`

            模型输出的文本。

          - `type: "output_text"`

            输出文本的类型。始终为 `output_text`.

            - `"output_text"`

        - `InputImage object { image_url, type, detail }`

          EvalItem 内容数组中使用的图像输入块。

          - `image_url: string`

            图像输入的 URL。

          - `type: "input_image"`

            图像输入的类型。始终为 `input_image`.

            - `"input_image"`

          - `detail: optional string`

            发送给模型的图像的细节级别。可选值为 `high`, `low`，或 `auto`。默认为 `auto`.

        - `ResponseInputAudio object { input_audio, type }`

          发送给模型的音频输入。

    - `role: "user" or "assistant" or "system" or "developer"`

      消息输入的角色。取值之一： `user`, `assistant`, `system`，或
      `developer`.

      - `"user"`

      - `"assistant"`

      - `"system"`

      - `"developer"`

    - `type: optional "message"`

      消息输入的类型。始终为 `message`.

      - `"message"`

  - `labels: array of string`

    为评估中每个项目分配的标签。

  - `model: string`

    用于评估的模型。必须支持结构化输出。

  - `name: string`

    评分器的名称。

  - `passing_labels: array of string`

    表示通过结果的标签。必须是 labels 的子集。

  - `type: "label_model"`

    对象类型，始终为 `label_model`.

    - `"label_model"`

### 多重评分器

- `MultiGrader object { calculate_output, graders, name, type }`

  一个 MultiGrader 对象，它将多个评分器的输出合并为单个分数。

  - `calculate_output: string`

    用于根据评分器结果计算输出的公式。

  - `graders: map[StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more]`

    - `StringCheckGrader object { input, name, operation, 2 more }`

      一个 StringCheckGrader 对象，使用指定的操作在输入与参考之间执行字符串比较。

      - `input: string`

        输入文本。可以包含模板字符串。

      - `name: string`

        评分器的名称。

      - `operation: "eq" or "ne" or "like" or "ilike"`

        要执行的字符串检查操作。可选值为 `eq`, `ne`, `like`，或 `ilike`.

        - `"eq"`

        - `"ne"`

        - `"like"`

        - `"ilike"`

      - `reference: string`

        参考文本。可以包含模板字符串。

      - `type: "string_check"`

        对象类型，始终为 `string_check`.

        - `"string_check"`

    - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

      一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

      - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

        要使用的评估指标。可选值为 `cosine`, `fuzzy_match`, `bleu`,
        `gleu`, `meteor`, `rouge_1`, `rouge_2`, `rouge_3`, `rouge_4`, `rouge_5`,
        或 `rouge_l`.

        - `"cosine"`

        - `"fuzzy_match"`

        - `"bleu"`

        - `"gleu"`

        - `"meteor"`

        - `"rouge_1"`

        - `"rouge_2"`

        - `"rouge_3"`

        - `"rouge_4"`

        - `"rouge_5"`

        - `"rouge_l"`

      - `input: string`

        正在评分的文本。

      - `name: string`

        评分器的名称。

      - `reference: string`

        作为评分基准的文本。

      - `type: "text_similarity"`

        评分器的类型。

        - `"text_similarity"`

    - `PythonGrader object { name, source, type, image_tag }`

      一个 PythonGrader 对象，它在输入上运行 python 脚本。

      - `name: string`

        评分器的名称。

      - `source: string`

        python 脚本的源代码。

      - `type: "python"`

        对象类型，始终为 `python`.

        - `"python"`

      - `image_tag: optional string`

        用于 python 脚本的镜像标签。

    - `ScoreModelGrader object { input, model, name, 3 more }`

      一个 ScoreModelGrader 对象，它使用模型为输入打分。

      - `input: array of object { content, role, type }`

        评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可以包含模板字符串。

        - `content: string or ResponseInputText or object { text, type }  or 3 more`

          模型的输入——可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目，也可以是项目数组。

          - `TextInput = string`

            发送给模型的文本输入。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

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

          - `OutputText object { text, type }`

            模型输出的文本。

            - `text: string`

              模型输出的文本。

            - `type: "output_text"`

              输出文本的类型。始终为 `output_text`.

              - `"output_text"`

          - `InputImage object { image_url, type, detail }`

            EvalItem 内容数组中使用的图像输入块。

            - `image_url: string`

              图像输入的 URL。

            - `type: "input_image"`

              图像输入的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional string`

              发送给模型的图像的细节级别。可选值为 `high`, `low`，或 `auto`。默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            发送给模型的音频输入。

            - `input_audio: object { data, format }`

              - `data: string`

                Base64 编码的音频数据。

              - `format: "mp3" or "wav"`

                音频数据的格式。目前支持的格式包括 `mp3` 和
                `wav`.

                - `"mp3"`

                - `"wav"`

            - `type: "input_audio"`

              输入项的类型。始终为 `input_audio`.

              - `"input_audio"`

          - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

            输入列表，其中每一项可以是输入文本、输出文本、输入
            图像或输入音频对象。

            - `TextInput = string`

              发送给模型的文本输入。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              发送给模型的文本输入。

            - `OutputText object { text, type }`

              模型输出的文本。

              - `text: string`

                模型输出的文本。

              - `type: "output_text"`

                输出文本的类型。始终为 `output_text`.

                - `"output_text"`

            - `InputImage object { image_url, type, detail }`

              EvalItem 内容数组中使用的图像输入块。

              - `image_url: string`

                图像输入的 URL。

              - `type: "input_image"`

                图像输入的类型。始终为 `input_image`.

                - `"input_image"`

              - `detail: optional string`

                发送给模型的图像的细节级别。可选值为 `high`, `low`，或 `auto`。默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              发送给模型的音频输入。

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色。取值之一： `user`, `assistant`, `system`，或
          `developer`.

          - `"user"`

          - `"assistant"`

          - `"system"`

          - `"developer"`

        - `type: optional "message"`

          消息输入的类型。始终为 `message`.

          - `"message"`

      - `model: string`

        用于评估的模型。

      - `name: string`

        评分器的名称。

      - `type: "score_model"`

        对象类型，始终为 `score_model`.

        - `"score_model"`

      - `range: optional array of number`

        该服务要求为分数范围提供两个数字。默认为 `[0, 1]`.

      - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

        模型的采样参数。

        - `max_completions_tokens: optional number or null`

          评分模型在其响应中可生成的最大令牌数。

        - `reasoning_effort: optional ReasoningEffort or null`

          限制推理模型在推理上的投入程度。目前支持
          的取值有 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入程度可以让响应更快，并减少在响应中用于推理的令牌数。并非所有推理模型都支持每个
          取值。有关具体模型的支持情况，请参阅
          推理指南
          [推理指南](/api/docs/guides/reasoning)
          。

          - `"none"`

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

        - `seed: optional number or null`

          用于在采样过程中初始化随机性的种子值。

        - `temperature: optional number or null`

          较高的温度会使输出更加随机。

        - `top_p: optional number or null`

          用于核采样的温度替代方案；1.0 表示包含所有令牌。

    - `LabelModelGrader object { input, labels, model, 3 more }`

      一个 LabelModelGrader 对象，使用模型为评估中的每个项目分配标签
      。

      - `input: array of object { content, role, type }`

        - `content: string or ResponseInputText or object { text, type }  or 3 more`

          模型的输入——可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目，也可以是项目数组。

          - `TextInput = string`

            发送给模型的文本输入。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

          - `OutputText object { text, type }`

            模型输出的文本。

            - `text: string`

              模型输出的文本。

            - `type: "output_text"`

              输出文本的类型。始终为 `output_text`.

              - `"output_text"`

          - `InputImage object { image_url, type, detail }`

            EvalItem 内容数组中使用的图像输入块。

            - `image_url: string`

              图像输入的 URL。

            - `type: "input_image"`

              图像输入的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional string`

              发送给模型的图像的细节级别。可选值为 `high`, `low`，或 `auto`。默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            发送给模型的音频输入。

          - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

            输入列表，其中每一项可以是输入文本、输出文本、输入
            图像或输入音频对象。

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色。取值之一： `user`, `assistant`, `system`，或
          `developer`.

          - `"user"`

          - `"assistant"`

          - `"system"`

          - `"developer"`

        - `type: optional "message"`

          消息输入的类型。始终为 `message`.

          - `"message"`

      - `labels: array of string`

        为评估中每个项目分配的标签。

      - `model: string`

        用于评估的模型。必须支持结构化输出。

      - `name: string`

        评分器的名称。

      - `passing_labels: array of string`

        表示通过结果的标签。必须是 labels 的子集。

      - `type: "label_model"`

        对象类型，始终为 `label_model`.

        - `"label_model"`

  - `name: string`

    评分器的名称。

  - `type: "multi"`

    对象类型，始终为 `multi`.

    - `"multi"`

### Python 评分器

- `PythonGrader object { name, source, type, image_tag }`

  一个 PythonGrader 对象，它在输入上运行 python 脚本。

  - `name: string`

    评分器的名称。

  - `source: string`

    python 脚本的源代码。

  - `type: "python"`

    对象类型，始终为 `python`.

    - `"python"`

  - `image_tag: optional string`

    用于 python 脚本的镜像标签。

### 评分模型评分器

- `ScoreModelGrader object { input, model, name, 3 more }`

  一个 ScoreModelGrader 对象，它使用模型为输入打分。

  - `input: array of object { content, role, type }`

    评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可以包含模板字符串。

    - `content: string or ResponseInputText or object { text, type }  or 3 more`

      模型的输入——可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目，也可以是项目数组。

      - `TextInput = string`

        发送给模型的文本输入。

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        发送给模型的文本输入。

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

      - `OutputText object { text, type }`

        模型输出的文本。

        - `text: string`

          模型输出的文本。

        - `type: "output_text"`

          输出文本的类型。始终为 `output_text`.

          - `"output_text"`

      - `InputImage object { image_url, type, detail }`

        EvalItem 内容数组中使用的图像输入块。

        - `image_url: string`

          图像输入的 URL。

        - `type: "input_image"`

          图像输入的类型。始终为 `input_image`.

          - `"input_image"`

        - `detail: optional string`

          发送给模型的图像的细节级别。可选值为 `high`, `low`，或 `auto`。默认为 `auto`.

      - `ResponseInputAudio object { input_audio, type }`

        发送给模型的音频输入。

        - `input_audio: object { data, format }`

          - `data: string`

            Base64 编码的音频数据。

          - `format: "mp3" or "wav"`

            音频数据的格式。目前支持的格式包括 `mp3` 和
            `wav`.

            - `"mp3"`

            - `"wav"`

        - `type: "input_audio"`

          输入项的类型。始终为 `input_audio`.

          - `"input_audio"`

      - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

        输入列表，其中每一项可以是输入文本、输出文本、输入
        图像或输入音频对象。

        - `TextInput = string`

          发送给模型的文本输入。

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          发送给模型的文本输入。

        - `OutputText object { text, type }`

          模型输出的文本。

          - `text: string`

            模型输出的文本。

          - `type: "output_text"`

            输出文本的类型。始终为 `output_text`.

            - `"output_text"`

        - `InputImage object { image_url, type, detail }`

          EvalItem 内容数组中使用的图像输入块。

          - `image_url: string`

            图像输入的 URL。

          - `type: "input_image"`

            图像输入的类型。始终为 `input_image`.

            - `"input_image"`

          - `detail: optional string`

            发送给模型的图像的细节级别。可选值为 `high`, `low`，或 `auto`。默认为 `auto`.

        - `ResponseInputAudio object { input_audio, type }`

          发送给模型的音频输入。

    - `role: "user" or "assistant" or "system" or "developer"`

      消息输入的角色。取值之一： `user`, `assistant`, `system`，或
      `developer`.

      - `"user"`

      - `"assistant"`

      - `"system"`

      - `"developer"`

    - `type: optional "message"`

      消息输入的类型。始终为 `message`.

      - `"message"`

  - `model: string`

    用于评估的模型。

  - `name: string`

    评分器的名称。

  - `type: "score_model"`

    对象类型，始终为 `score_model`.

    - `"score_model"`

  - `range: optional array of number`

    该服务要求为分数范围提供两个数字。默认为 `[0, 1]`.

  - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

    模型的采样参数。

    - `max_completions_tokens: optional number or null`

      评分模型在其响应中可生成的最大令牌数。

    - `reasoning_effort: optional ReasoningEffort or null`

      限制推理模型在推理上的投入程度。目前支持
      的取值有 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
      降低推理投入程度可以让响应更快，并减少在响应中用于推理的令牌数。并非所有推理模型都支持每个
      取值。有关具体模型的支持情况，请参阅
      推理指南
      [推理指南](/api/docs/guides/reasoning)
      。

      - `"none"`

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

      - `"max"`

    - `seed: optional number or null`

      用于在采样过程中初始化随机性的种子值。

    - `temperature: optional number or null`

      较高的温度会使输出更加随机。

    - `top_p: optional number or null`

      用于核采样的温度替代方案；1.0 表示包含所有令牌。

### 字符串检查评分器

- `StringCheckGrader object { input, name, operation, 2 more }`

  一个 StringCheckGrader 对象，使用指定的操作在输入与参考之间执行字符串比较。

  - `input: string`

    输入文本。可以包含模板字符串。

  - `name: string`

    评分器的名称。

  - `operation: "eq" or "ne" or "like" or "ilike"`

    要执行的字符串检查操作。可选值为 `eq`, `ne`, `like`，或 `ilike`.

    - `"eq"`

    - `"ne"`

    - `"like"`

    - `"ilike"`

  - `reference: string`

    参考文本。可以包含模板字符串。

  - `type: "string_check"`

    对象类型，始终为 `string_check`.

    - `"string_check"`

### 文本相似度评分器

- `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

  一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

  - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

    要使用的评估指标。可选值为 `cosine`, `fuzzy_match`, `bleu`,
    `gleu`, `meteor`, `rouge_1`, `rouge_2`, `rouge_3`, `rouge_4`, `rouge_5`,
    或 `rouge_l`.

    - `"cosine"`

    - `"fuzzy_match"`

    - `"bleu"`

    - `"gleu"`

    - `"meteor"`

    - `"rouge_1"`

    - `"rouge_2"`

    - `"rouge_3"`

    - `"rouge_4"`

    - `"rouge_5"`

    - `"rouge_l"`

  - `input: string`

    正在评分的文本。

  - `name: string`

    评分器的名称。

  - `reference: string`

    作为评分基准的文本。

  - `type: "text_similarity"`

    评分器的类型。

    - `"text_similarity"`
