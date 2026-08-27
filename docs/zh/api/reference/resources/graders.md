# 评分器

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

# 评分模型

## 领域类型

### 评分输入

- `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

  输入项列表，每个输入项可以是输入文本、输出文本、输入
  图像或输入音频对象。

  - `TextInput = string`

    输入给模型的文本。

  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

    输入给模型的文本。

    - `text: string`

      输入给模型的文本。

    - `type: "input_text"`

      输入项的类型。始终为 `input_text`.

      - `"input_text"`

    - `prompt_cache_breakpoint: optional object { mode }`

      标记可重用提示前缀的精确结尾。断点继承自请求的 `prompt_cache_options.ttl`；该边界不四舍五入到令牌块。

      - `mode: "explicit"`

        断点模式。始终为 `explicit`.

        - `"explicit"`

  - `OutputText object { text, type }`

    来自模型的文本输出。

    - `text: string`

      来自模型的文本输出。

    - `type: "output_text"`

      输出文本的类型。始终为 `output_text`.

      - `"output_text"`

  - `InputImage object { image_url, type, detail }`

    用于 EvalItem 内容数组中的图像输入块。

    - `image_url: string`

      图像输入的 URL。

    - `type: "input_image"`

      图像输入的类型。始终为 `input_image`.

      - `"input_image"`

    - `detail: optional string`

      发送给模型的图像的细节级别。可为 `high`, `low`，或 `auto`。默认为 `auto`.

  - `ResponseInputAudio object { input_audio, type }`

    输入给模型的音频。

    - `input_audio: object { data, format }`

      - `data: string`

        Base64 编码的音频数据。

      - `format: "mp3" or "wav"`

        音频数据的格式。当前支持的格式为 `mp3` 和
        `wav`.

        - `"mp3"`

        - `"wav"`

    - `type: "input_audio"`

      输入项的类型。始终为 `input_audio`.

      - `"input_audio"`

### 标签模型评分器

- `LabelModelGrader object { input, labels, model, 3 more }`

  一个 LabelModelGrader 对象，使用模型为每个项目分配标签
  在评估中。

  - `input: array of object { content, role, type }`

    - `content: string or ResponseInputText or object { text, type }  or 3 more`

      模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

      - `TextInput = string`

        输入给模型的文本。

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        输入给模型的文本。

        - `text: string`

          输入给模型的文本。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可重用提示前缀的精确结尾。断点继承自请求的 `prompt_cache_options.ttl`；该边界不四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `OutputText object { text, type }`

        来自模型的文本输出。

        - `text: string`

          来自模型的文本输出。

        - `type: "output_text"`

          输出文本的类型。始终为 `output_text`.

          - `"output_text"`

      - `InputImage object { image_url, type, detail }`

        用于 EvalItem 内容数组中的图像输入块。

        - `image_url: string`

          图像输入的 URL。

        - `type: "input_image"`

          图像输入的类型。始终为 `input_image`.

          - `"input_image"`

        - `detail: optional string`

          发送给模型的图像的细节级别。可为 `high`, `low`，或 `auto`。默认为 `auto`.

      - `ResponseInputAudio object { input_audio, type }`

        输入给模型的音频。

        - `input_audio: object { data, format }`

          - `data: string`

            Base64 编码的音频数据。

          - `format: "mp3" or "wav"`

            音频数据的格式。当前支持的格式为 `mp3` 和
            `wav`.

            - `"mp3"`

            - `"wav"`

        - `type: "input_audio"`

          输入项的类型。始终为 `input_audio`.

          - `"input_audio"`

      - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

        输入项列表，每个输入项可以是输入文本、输出文本、输入
        图像或输入音频对象。

        - `TextInput = string`

          输入给模型的文本。

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          输入给模型的文本。

        - `OutputText object { text, type }`

          来自模型的文本输出。

          - `text: string`

            来自模型的文本输出。

          - `type: "output_text"`

            输出文本的类型。始终为 `output_text`.

            - `"output_text"`

        - `InputImage object { image_url, type, detail }`

          用于 EvalItem 内容数组中的图像输入块。

          - `image_url: string`

            图像输入的 URL。

          - `type: "input_image"`

            图像输入的类型。始终为 `input_image`.

            - `"input_image"`

          - `detail: optional string`

            发送给模型的图像的细节级别。可为 `high`, `low`，或 `auto`。默认为 `auto`.

        - `ResponseInputAudio object { input_audio, type }`

          输入给模型的音频。

    - `role: "user" or "assistant" or "system" or "developer"`

      消息输入的角色。取值为 `user`, `assistant`, `system`，或
      `developer`.

      - `"user"`

      - `"assistant"`

      - `"system"`

      - `"developer"`

    - `type: optional "message"`

      消息输入的类型。始终为 `message`.

      - `"message"`

  - `labels: array of string`

    要分配给评估中每个项目的标签。

  - `model: string`

    用于评估的模型。必须支持结构化输出。

  - `name: string`

    评分器的名称。

  - `passing_labels: array of string`

    表示通过结果的标签。必须是标签的子集。

  - `type: "label_model"`

    对象类型，始终为 `label_model`.

    - `"label_model"`

### 多评分器

- `MultiGrader object { calculate_output, graders, name, type }`

  MultiGrader 对象结合多个评分器的输出来生成单一评分。

  - `calculate_output: string`

    根据评分器结果计算输出的公式。

  - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

    StringCheckGrader 对象，使用指定操作对输入和参考进行字符串比较。

    - `StringCheckGrader object { input, name, operation, 2 more }`

      StringCheckGrader 对象，使用指定操作对输入和参考进行字符串比较。

      - `input: string`

        输入文本。可以包含模板字符串。

      - `name: string`

        评分器的名称。

      - `operation: "eq" or "ne" or "like" or "ilike"`

        要执行的字符串检查操作。其中之一： `eq`, `ne`, `like`，或 `ilike`.

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

      TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

      - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

        要使用的评估指标。其中之一： `cosine`, `fuzzy_match`, `bleu`,
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

        被评分的文本。

      - `name: string`

        评分器的名称。

      - `reference: string`

        用于评分的对照文本。

      - `type: "text_similarity"`

        评分器的类型。

        - `"text_similarity"`

    - `PythonGrader object { name, source, type, image_tag }`

      PythonGrader 对象，在输入上运行 Python 脚本。

      - `name: string`

        评分器的名称。

      - `source: string`

        Python 脚本的源代码。

      - `type: "python"`

        对象类型，始终为 `python`.

        - `"python"`

      - `image_tag: optional string`

        用于 Python 脚本的镜像标签。

    - `ScoreModelGrader object { input, model, name, 3 more }`

      ScoreModelGrader 对象，使用模型为输入分配评分。

      - `input: array of object { content, role, type }`

        由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可以包含模板字符串。

        - `content: string or ResponseInputText or object { text, type }  or 3 more`

          模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

          - `TextInput = string`

            输入给模型的文本。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            输入给模型的文本。

            - `text: string`

              输入给模型的文本。

            - `type: "input_text"`

              输入项的类型。始终为 `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              标记可重用提示前缀的精确结尾。断点继承自请求的 `prompt_cache_options.ttl`；该边界不四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `OutputText object { text, type }`

            来自模型的文本输出。

            - `text: string`

              来自模型的文本输出。

            - `type: "output_text"`

              输出文本的类型。始终为 `output_text`.

              - `"output_text"`

          - `InputImage object { image_url, type, detail }`

            用于 EvalItem 内容数组中的图像输入块。

            - `image_url: string`

              图像输入的 URL。

            - `type: "input_image"`

              图像输入的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional string`

              发送给模型的图像的细节级别。可为 `high`, `low`，或 `auto`。默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            输入给模型的音频。

            - `input_audio: object { data, format }`

              - `data: string`

                Base64 编码的音频数据。

              - `format: "mp3" or "wav"`

                音频数据的格式。当前支持的格式为 `mp3` 和
                `wav`.

                - `"mp3"`

                - `"wav"`

            - `type: "input_audio"`

              输入项的类型。始终为 `input_audio`.

              - `"input_audio"`

          - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

            输入项列表，每个输入项可以是输入文本、输出文本、输入
            图像或输入音频对象。

            - `TextInput = string`

              输入给模型的文本。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              输入给模型的文本。

            - `OutputText object { text, type }`

              来自模型的文本输出。

              - `text: string`

                来自模型的文本输出。

              - `type: "output_text"`

                输出文本的类型。始终为 `output_text`.

                - `"output_text"`

            - `InputImage object { image_url, type, detail }`

              用于 EvalItem 内容数组中的图像输入块。

              - `image_url: string`

                图像输入的 URL。

              - `type: "input_image"`

                图像输入的类型。始终为 `input_image`.

                - `"input_image"`

              - `detail: optional string`

                发送给模型的图像的细节级别。可为 `high`, `low`，或 `auto`。默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              输入给模型的音频。

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色。取值为 `user`, `assistant`, `system`，或
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

        评分的范围。默认为 `[0, 1]`.

      - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

        模型的采样参数。

        - `max_completions_tokens: optional number or null`

          评分模型在其响应中可生成的最大 token 数。

        - `reasoning_effort: optional ReasoningEffort or null`

          限制推理模型在推理上的投入。目前支持的
          值有 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
          降低推理投入可以加快响应速度并减少 token
          在响应中的使用量。并非所有推理模型都支持每个
          值。参见
          [推理指南](https://platform.openai.com/docs/guides/reasoning)
          了解模型特定的支持情况。

          - `"none"`

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

        - `seed: optional number or null`

          在采样期间用于初始化随机性的种子值。

        - `temperature: optional number or null`

          较高的温度会增加输出的随机性。

        - `top_p: optional number or null`

          温度在核心采样中的替代方案；1.0 包含所有 token。

    - `LabelModelGrader object { input, labels, model, 3 more }`

      一个 LabelModelGrader 对象，使用模型为每个项目分配标签
      在评估中。

      - `input: array of object { content, role, type }`

        - `content: string or ResponseInputText or object { text, type }  or 3 more`

          模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

          - `TextInput = string`

            输入给模型的文本。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            输入给模型的文本。

          - `OutputText object { text, type }`

            来自模型的文本输出。

            - `text: string`

              来自模型的文本输出。

            - `type: "output_text"`

              输出文本的类型。始终为 `output_text`.

              - `"output_text"`

          - `InputImage object { image_url, type, detail }`

            用于 EvalItem 内容数组中的图像输入块。

            - `image_url: string`

              图像输入的 URL。

            - `type: "input_image"`

              图像输入的类型。始终为 `input_image`.

              - `"input_image"`

            - `detail: optional string`

              发送给模型的图像的细节级别。可为 `high`, `low`，或 `auto`。默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            输入给模型的音频。

          - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

            输入项列表，每个输入项可以是输入文本、输出文本、输入
            图像或输入音频对象。

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色。取值为 `user`, `assistant`, `system`，或
          `developer`.

          - `"user"`

          - `"assistant"`

          - `"system"`

          - `"developer"`

        - `type: optional "message"`

          消息输入的类型。始终为 `message`.

          - `"message"`

      - `labels: array of string`

        要分配给评估中每个项目的标签。

      - `model: string`

        用于评估的模型。必须支持结构化输出。

      - `name: string`

        评分器的名称。

      - `passing_labels: array of string`

        表示通过结果的标签。必须是标签的子集。

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

  PythonGrader 对象，在输入上运行 Python 脚本。

  - `name: string`

    评分器的名称。

  - `source: string`

    Python 脚本的源代码。

  - `type: "python"`

    对象类型，始终为 `python`.

    - `"python"`

  - `image_tag: optional string`

    用于 Python 脚本的镜像标签。

### 分数模型评分器

- `ScoreModelGrader object { input, model, name, 3 more }`

  ScoreModelGrader 对象，使用模型为输入分配评分。

  - `input: array of object { content, role, type }`

    由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可以包含模板字符串。

    - `content: string or ResponseInputText or object { text, type }  or 3 more`

      模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

      - `TextInput = string`

        输入给模型的文本。

      - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

        输入给模型的文本。

        - `text: string`

          输入给模型的文本。

        - `type: "input_text"`

          输入项的类型。始终为 `input_text`.

          - `"input_text"`

        - `prompt_cache_breakpoint: optional object { mode }`

          标记可重用提示前缀的精确结尾。断点继承自请求的 `prompt_cache_options.ttl`；该边界不四舍五入到令牌块。

          - `mode: "explicit"`

            断点模式。始终为 `explicit`.

            - `"explicit"`

      - `OutputText object { text, type }`

        来自模型的文本输出。

        - `text: string`

          来自模型的文本输出。

        - `type: "output_text"`

          输出文本的类型。始终为 `output_text`.

          - `"output_text"`

      - `InputImage object { image_url, type, detail }`

        用于 EvalItem 内容数组中的图像输入块。

        - `image_url: string`

          图像输入的 URL。

        - `type: "input_image"`

          图像输入的类型。始终为 `input_image`.

          - `"input_image"`

        - `detail: optional string`

          发送给模型的图像的细节级别。可为 `high`, `low`，或 `auto`。默认为 `auto`.

      - `ResponseInputAudio object { input_audio, type }`

        输入给模型的音频。

        - `input_audio: object { data, format }`

          - `data: string`

            Base64 编码的音频数据。

          - `format: "mp3" or "wav"`

            音频数据的格式。当前支持的格式为 `mp3` 和
            `wav`.

            - `"mp3"`

            - `"wav"`

        - `type: "input_audio"`

          输入项的类型。始终为 `input_audio`.

          - `"input_audio"`

      - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

        输入项列表，每个输入项可以是输入文本、输出文本、输入
        图像或输入音频对象。

        - `TextInput = string`

          输入给模型的文本。

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          输入给模型的文本。

        - `OutputText object { text, type }`

          来自模型的文本输出。

          - `text: string`

            来自模型的文本输出。

          - `type: "output_text"`

            输出文本的类型。始终为 `output_text`.

            - `"output_text"`

        - `InputImage object { image_url, type, detail }`

          用于 EvalItem 内容数组中的图像输入块。

          - `image_url: string`

            图像输入的 URL。

          - `type: "input_image"`

            图像输入的类型。始终为 `input_image`.

            - `"input_image"`

          - `detail: optional string`

            发送给模型的图像的细节级别。可为 `high`, `low`，或 `auto`。默认为 `auto`.

        - `ResponseInputAudio object { input_audio, type }`

          输入给模型的音频。

    - `role: "user" or "assistant" or "system" or "developer"`

      消息输入的角色。取值为 `user`, `assistant`, `system`，或
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

    评分的范围。默认为 `[0, 1]`.

  - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

    模型的采样参数。

    - `max_completions_tokens: optional number or null`

      评分模型在其响应中可生成的最大 token 数。

    - `reasoning_effort: optional ReasoningEffort or null`

      限制推理模型在推理上的投入。目前支持的
      值有 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
      降低推理投入可以加快响应速度并减少 token
      在响应中的使用量。并非所有推理模型都支持每个
      值。参见
      [推理指南](https://platform.openai.com/docs/guides/reasoning)
      了解模型特定的支持情况。

      - `"none"`

      - `"minimal"`

      - `"low"`

      - `"medium"`

      - `"high"`

      - `"xhigh"`

      - `"max"`

    - `seed: optional number or null`

      在采样期间用于初始化随机性的种子值。

    - `temperature: optional number or null`

      较高的温度会增加输出的随机性。

    - `top_p: optional number or null`

      温度在核心采样中的替代方案；1.0 包含所有 token。

### 字符串检查评分器

- `StringCheckGrader object { input, name, operation, 2 more }`

  StringCheckGrader 对象，使用指定操作对输入和参考进行字符串比较。

  - `input: string`

    输入文本。可以包含模板字符串。

  - `name: string`

    评分器的名称。

  - `operation: "eq" or "ne" or "like" or "ilike"`

    要执行的字符串检查操作。其中之一： `eq`, `ne`, `like`，或 `ilike`.

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

  TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

  - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

    要使用的评估指标。其中之一： `cosine`, `fuzzy_match`, `bleu`,
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

    被评分的文本。

  - `name: string`

    评分器的名称。

  - `reference: string`

    用于评分的对照文本。

  - `type: "text_similarity"`

    评分器的类型。

    - `"text_similarity"`
