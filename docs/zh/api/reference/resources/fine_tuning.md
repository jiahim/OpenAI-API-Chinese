# 微调

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

# Alpha

# 评分器

## 运行评分器

**post** `/fine_tuning/alpha/graders/run`

运行一个评分器。

### 请求体参数

- `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

  用于微调作业的评分器。

  - `StringCheckGrader object { input, name, operation, 2 more }`

    一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

    - `input: string`

      输入文本。这可能包括模板字符串。

    - `name: string`

      评分器的名称。

    - `operation: "eq" or "ne" or "like" or "ilike"`

      要执行的字符串检查操作。以下之一 `eq`, `ne`, `like`，或 `ilike`.

      - `"eq"`

      - `"ne"`

      - `"like"`

      - `"ilike"`

    - `reference: string`

      参考文本。这可能包括模板字符串。

    - `type: "string_check"`

      对象类型，始终为 `string_check`.

      - `"string_check"`

  - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

    一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

    - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

      要使用的评估指标。以下之一 `cosine`, `fuzzy_match`, `bleu`,
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

      用作评分参考的文本。

    - `type: "text_similarity"`

      评分器的类型。

      - `"text_similarity"`

  - `PythonGrader object { name, source, type, image_tag }`

    一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

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

    一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

    - `input: array of object { content, role, type }`

      由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可能包括模板字符串。

      - `content: string or ResponseInputText or object { text, type }  or 3 more`

        模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

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

            标记可重用提示前缀的精确结束位置。断点继承请求的 `prompt_cache_options.ttl`；TTL；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `OutputText object { text, type }`

          模型的文本输出。

          - `text: string`

            模型的文本输出。

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

            发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

        - `ResponseInputAudio object { input_audio, type }`

          发送给模型的音频输入。

          - `input_audio: object { data, format }`

            - `data: string`

              Base64 编码的音频数据。

            - `format: "mp3" or "wav"`

              音频数据的格式。目前支持的格式为 `mp3` 和
              `wav`.

              - `"mp3"`

              - `"wav"`

          - `type: "input_audio"`

            输入项的类型。始终为 `input_audio`.

            - `"input_audio"`

        - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

          输入列表，每一项可以是输入文本、输出文本、输入
          图像或输入音频对象。

          - `TextInput = string`

            发送给模型的文本输入。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

          - `OutputText object { text, type }`

            模型的文本输出。

            - `text: string`

              模型的文本输出。

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

              发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            发送给模型的音频输入。

      - `role: "user" or "assistant" or "system" or "developer"`

        消息输入的角色。值为 `user`, `assistant`, `system`，或
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

      评分的范围。默认值为 `[0, 1]`.

    - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

      模型的采样参数。

      - `max_completions_tokens: optional number or null`

        评分模型在其响应中可生成的最大令牌数。

      - `reasoning_effort: optional ReasoningEffort or null`

        限制推理模型在推理上的投入。目前支持的
        值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
        降低推理投入可以加快响应速度并减少响应中用于推理的令牌
        数量。并非所有推理模型都支持每个
        值。请参阅
        [推理指南](https://platform.openai.com/docs/guides/reasoning)
        了解各模型的支持情况。

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `seed: optional number or null`

        用于在采样期间初始化随机性的种子值。

      - `temperature: optional number or null`

        较高的温度会增加输出中的随机性。

      - `top_p: optional number or null`

        用于核采样的温度替代方案；1.0 包含所有令牌。

  - `MultiGrader object { calculate_output, graders, name, type }`

    MultiGrader 对象结合多个评分器的输出来生成单个分数。

    - `calculate_output: string`

      用于根据评分器结果计算输出的公式。

    - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

      一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

      - `StringCheckGrader object { input, name, operation, 2 more }`

        一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

      - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

        一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

      - `PythonGrader object { name, source, type, image_tag }`

        一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

      - `ScoreModelGrader object { input, model, name, 3 more }`

        一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

      - `LabelModelGrader object { input, labels, model, 3 more }`

        一个 LabelModelGrader 对象，它使用模型为每个项目分配标签
        在评估中。

        - `input: array of object { content, role, type }`

          - `content: string or ResponseInputText or object { text, type }  or 3 more`

            模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

            - `TextInput = string`

              发送给模型的文本输入。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              发送给模型的文本输入。

            - `OutputText object { text, type }`

              模型的文本输出。

              - `text: string`

                模型的文本输出。

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

                发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              发送给模型的音频输入。

            - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

              输入列表，每一项可以是输入文本、输出文本、输入
              图像或输入音频对象。

          - `role: "user" or "assistant" or "system" or "developer"`

            消息输入的角色。值为 `user`, `assistant`, `system`，或
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

- `model_sample: string`

  要评估的模型样本。该值将用于填充
  该 `sample` 命名空间。请参阅 [该指南](/docs/guides/graders) 了解更多详情。
  该 `output_json` 如果模型样本是
  有效的 JSON 字符串，该变量将被填充。

- `item: optional unknown`

  提供给评分器的数据集项目。这将用于填充
  该 `item` 命名空间。请参阅 [该指南](/docs/guides/graders) 了解更多详情。

### 返回值

- `metadata: object { errors, execution_time, name, 4 more }`

  - `errors: object { formula_parse_error, invalid_variable_error, model_grader_parse_error, 11 more }`

    - `formula_parse_error: boolean`

    - `invalid_variable_error: boolean`

    - `model_grader_parse_error: boolean`

    - `model_grader_refusal_error: boolean`

    - `model_grader_server_error: boolean`

    - `model_grader_server_error_details: string or null`

    - `other_error: boolean`

    - `python_grader_runtime_error: boolean`

    - `python_grader_runtime_error_details: string or null`

    - `python_grader_server_error: boolean`

    - `python_grader_server_error_type: string or null`

    - `sample_parse_error: boolean`

    - `truncated_observation_error: boolean`

    - `unresponsive_reward_error: boolean`

  - `execution_time: number`

  - `name: string`

  - `sampled_model_name: string or null`

  - `scores: map[unknown]`

  - `token_usage: number or null`

  - `type: string`

- `model_grader_token_usage_per_model: map[unknown]`

- `reward: number`

- `sub_rewards: map[unknown]`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/alpha/graders/run \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "grader": {
            "input": "input",
            "name": "name",
            "operation": "eq",
            "reference": "reference",
            "type": "string_check"
          },
          "model_sample": "model_sample"
        }'
```

#### 响应

```json
{
  "metadata": {
    "errors": {
      "formula_parse_error": true,
      "invalid_variable_error": true,
      "model_grader_parse_error": true,
      "model_grader_refusal_error": true,
      "model_grader_server_error": true,
      "model_grader_server_error_details": "model_grader_server_error_details",
      "other_error": true,
      "python_grader_runtime_error": true,
      "python_grader_runtime_error_details": "python_grader_runtime_error_details",
      "python_grader_server_error": true,
      "python_grader_server_error_type": "python_grader_server_error_type",
      "sample_parse_error": true,
      "truncated_observation_error": true,
      "unresponsive_reward_error": true
    },
    "execution_time": 0,
    "name": "name",
    "sampled_model_name": "sampled_model_name",
    "scores": {
      "foo": "bar"
    },
    "token_usage": 0,
    "type": "type"
  },
  "model_grader_token_usage_per_model": {
    "foo": "bar"
  },
  "reward": 0,
  "sub_rewards": {
    "foo": "bar"
  }
}
```

### 对音频响应进行评分

```http
curl -X POST https://api.openai.com/v1/fine_tuning/alpha/graders/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "grader": {
      "type": "score_model",
      "name": "Audio clarity grader",
      "input": [
        {
          "role": "user",
          "content": [
            {
              "type": "input_text",
              "text": "Listen to the clip and return a confidence score from 0 to 1 that the speaker said: {{item.target_phrase}}"
            },
            {
              "type": "input_audio",
              "input_audio": {
                "data": "{{item.audio_clip_b64}}",
                "format": "mp3"
              }
            }
          ]
        }
      ],
      "model": "gpt-audio",
      "sampling_params": {
        "temperature": 0.2,
        "top_p": 1,
        "seed": 123
      }
    },
    "item": {
      "target_phrase": "Please deliver the package on Tuesday",
      "audio_clip_b64": "<base64-encoded mp3>"
    },
    "model_sample": "Please deliver the package on Tuesday"
  }'
```

### 对图像标题进行评分

```http
curl -X POST https://api.openai.com/v1/fine_tuning/alpha/graders/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "grader": {
      "type": "score_model",
      "name": "Image caption grader",
      "input": [
        {
          "role": "user",
          "content": [
            {
              "type": "input_text",
              "text": "Score how well the provided caption matches the image on a 0-1 scale. Only return the score.\n\nCaption: {{sample.output_text}}"
            },
            {
              "type": "input_image",
              "image_url": "https://example.com/dog-catching-ball.png",
              "file_id": null,
              "detail": "high"
            }
          ]
        }
      ],
      "model": "gpt-5-mini",
      "sampling_params": {
        "temperature": 0.2
      }
    },
    "item": {
      "expected_caption": "A golden retriever jumps to catch a tennis ball"
    },
    "model_sample": "A dog leaps to grab a tennis ball mid-air"
  }'
```

### 对文本对齐进行评分

```http
curl -X POST https://api.openai.com/v1/fine_tuning/alpha/graders/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "grader": {
      "type": "score_model",
      "name": "Example score model grader",
      "input": [
        {
          "role": "user",
          "content": [
            {
              "type": "input_text",
              "text": "Score how close the reference answer is to the model answer on a 0-1 scale. Return only the score.\n\nReference answer: {{item.reference_answer}}\n\nModel answer: {{sample.output_text}}"
            }
          ]
        }
      ],
      "model": "gpt-5-mini",
      "sampling_params": {
        "temperature": 1,
        "top_p": 1,
        "seed": 42
      }
    },
    "item": {
      "reference_answer": "fuzzy wuzzy was a bear"
    },
    "model_sample": "fuzzy wuzzy was a bear"
  }'
```

#### 响应

```json
{
  "reward": 1.0,
  "metadata": {
    "name": "Example score model grader",
    "type": "score_model",
    "errors": {
      "formula_parse_error": false,
      "sample_parse_error": false,
      "truncated_observation_error": false,
      "unresponsive_reward_error": false,
      "invalid_variable_error": false,
      "other_error": false,
      "python_grader_server_error": false,
      "python_grader_server_error_type": null,
      "python_grader_runtime_error": false,
      "python_grader_runtime_error_details": null,
      "model_grader_server_error": false,
      "model_grader_refusal_error": false,
      "model_grader_parse_error": false,
      "model_grader_server_error_details": null
    },
    "execution_time": 4.365238428115845,
    "scores": {},
    "token_usage": {
      "prompt_tokens": 190,
      "total_tokens": 324,
      "completion_tokens": 134,
      "cached_tokens": 0
    },
    "sampled_model_name": "gpt-4o-2024-08-06"
  },
  "sub_rewards": {},
  "model_grader_token_usage_per_model": {
    "gpt-4o-2024-08-06": {
      "prompt_tokens": 190,
      "total_tokens": 324,
      "completion_tokens": 134,
      "cached_tokens": 0
    }
  }
}
```

## 验证评分器

**post** `/fine_tuning/alpha/graders/validate`

验证评分器。

### 请求体参数

- `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

  用于微调作业的评分器。

  - `StringCheckGrader object { input, name, operation, 2 more }`

    一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

    - `input: string`

      输入文本。这可能包括模板字符串。

    - `name: string`

      评分器的名称。

    - `operation: "eq" or "ne" or "like" or "ilike"`

      要执行的字符串检查操作。以下之一 `eq`, `ne`, `like`，或 `ilike`.

      - `"eq"`

      - `"ne"`

      - `"like"`

      - `"ilike"`

    - `reference: string`

      参考文本。这可能包括模板字符串。

    - `type: "string_check"`

      对象类型，始终为 `string_check`.

      - `"string_check"`

  - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

    一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

    - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

      要使用的评估指标。以下之一 `cosine`, `fuzzy_match`, `bleu`,
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

      用作评分参考的文本。

    - `type: "text_similarity"`

      评分器的类型。

      - `"text_similarity"`

  - `PythonGrader object { name, source, type, image_tag }`

    一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

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

    一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

    - `input: array of object { content, role, type }`

      由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可能包括模板字符串。

      - `content: string or ResponseInputText or object { text, type }  or 3 more`

        模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

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

            标记可重用提示前缀的精确结束位置。断点继承请求的 `prompt_cache_options.ttl`；TTL；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `OutputText object { text, type }`

          模型的文本输出。

          - `text: string`

            模型的文本输出。

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

            发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

        - `ResponseInputAudio object { input_audio, type }`

          发送给模型的音频输入。

          - `input_audio: object { data, format }`

            - `data: string`

              Base64 编码的音频数据。

            - `format: "mp3" or "wav"`

              音频数据的格式。目前支持的格式为 `mp3` 和
              `wav`.

              - `"mp3"`

              - `"wav"`

          - `type: "input_audio"`

            输入项的类型。始终为 `input_audio`.

            - `"input_audio"`

        - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

          输入列表，每一项可以是输入文本、输出文本、输入
          图像或输入音频对象。

          - `TextInput = string`

            发送给模型的文本输入。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

          - `OutputText object { text, type }`

            模型的文本输出。

            - `text: string`

              模型的文本输出。

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

              发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            发送给模型的音频输入。

      - `role: "user" or "assistant" or "system" or "developer"`

        消息输入的角色。值为 `user`, `assistant`, `system`，或
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

      评分的范围。默认值为 `[0, 1]`.

    - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

      模型的采样参数。

      - `max_completions_tokens: optional number or null`

        评分模型在其响应中可生成的最大令牌数。

      - `reasoning_effort: optional ReasoningEffort or null`

        限制推理模型在推理上的投入。目前支持的
        值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
        降低推理投入可以加快响应速度并减少响应中用于推理的令牌
        数量。并非所有推理模型都支持每个
        值。请参阅
        [推理指南](https://platform.openai.com/docs/guides/reasoning)
        了解各模型的支持情况。

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `seed: optional number or null`

        用于在采样期间初始化随机性的种子值。

      - `temperature: optional number or null`

        较高的温度会增加输出中的随机性。

      - `top_p: optional number or null`

        用于核采样的温度替代方案；1.0 包含所有令牌。

  - `MultiGrader object { calculate_output, graders, name, type }`

    MultiGrader 对象结合多个评分器的输出来生成单个分数。

    - `calculate_output: string`

      用于根据评分器结果计算输出的公式。

    - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

      一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

      - `StringCheckGrader object { input, name, operation, 2 more }`

        一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

      - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

        一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

      - `PythonGrader object { name, source, type, image_tag }`

        一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

      - `ScoreModelGrader object { input, model, name, 3 more }`

        一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

      - `LabelModelGrader object { input, labels, model, 3 more }`

        一个 LabelModelGrader 对象，它使用模型为每个项目分配标签
        在评估中。

        - `input: array of object { content, role, type }`

          - `content: string or ResponseInputText or object { text, type }  or 3 more`

            模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

            - `TextInput = string`

              发送给模型的文本输入。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              发送给模型的文本输入。

            - `OutputText object { text, type }`

              模型的文本输出。

              - `text: string`

                模型的文本输出。

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

                发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              发送给模型的音频输入。

            - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

              输入列表，每一项可以是输入文本、输出文本、输入
              图像或输入音频对象。

          - `role: "user" or "assistant" or "system" or "developer"`

            消息输入的角色。值为 `user`, `assistant`, `system`，或
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

### 返回值

- `grader: optional StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

  用于微调作业的评分器。

  - `StringCheckGrader object { input, name, operation, 2 more }`

    一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

    - `input: string`

      输入文本。这可能包括模板字符串。

    - `name: string`

      评分器的名称。

    - `operation: "eq" or "ne" or "like" or "ilike"`

      要执行的字符串检查操作。以下之一 `eq`, `ne`, `like`，或 `ilike`.

      - `"eq"`

      - `"ne"`

      - `"like"`

      - `"ilike"`

    - `reference: string`

      参考文本。这可能包括模板字符串。

    - `type: "string_check"`

      对象类型，始终为 `string_check`.

      - `"string_check"`

  - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

    一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

    - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

      要使用的评估指标。以下之一 `cosine`, `fuzzy_match`, `bleu`,
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

      用作评分参考的文本。

    - `type: "text_similarity"`

      评分器的类型。

      - `"text_similarity"`

  - `PythonGrader object { name, source, type, image_tag }`

    一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

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

    一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

    - `input: array of object { content, role, type }`

      由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可能包括模板字符串。

      - `content: string or ResponseInputText or object { text, type }  or 3 more`

        模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

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

            标记可重用提示前缀的精确结束位置。断点继承请求的 `prompt_cache_options.ttl`；TTL；边界不会四舍五入到令牌块。

            - `mode: "explicit"`

              断点模式。始终为 `explicit`.

              - `"explicit"`

        - `OutputText object { text, type }`

          模型的文本输出。

          - `text: string`

            模型的文本输出。

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

            发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

        - `ResponseInputAudio object { input_audio, type }`

          发送给模型的音频输入。

          - `input_audio: object { data, format }`

            - `data: string`

              Base64 编码的音频数据。

            - `format: "mp3" or "wav"`

              音频数据的格式。目前支持的格式为 `mp3` 和
              `wav`.

              - `"mp3"`

              - `"wav"`

          - `type: "input_audio"`

            输入项的类型。始终为 `input_audio`.

            - `"input_audio"`

        - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

          输入列表，每一项可以是输入文本、输出文本、输入
          图像或输入音频对象。

          - `TextInput = string`

            发送给模型的文本输入。

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            发送给模型的文本输入。

          - `OutputText object { text, type }`

            模型的文本输出。

            - `text: string`

              模型的文本输出。

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

              发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            发送给模型的音频输入。

      - `role: "user" or "assistant" or "system" or "developer"`

        消息输入的角色。值为 `user`, `assistant`, `system`，或
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

      评分的范围。默认值为 `[0, 1]`.

    - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

      模型的采样参数。

      - `max_completions_tokens: optional number or null`

        评分模型在其响应中可生成的最大令牌数。

      - `reasoning_effort: optional ReasoningEffort or null`

        限制推理模型在推理上的投入。目前支持的
        值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
        降低推理投入可以加快响应速度并减少响应中用于推理的令牌
        数量。并非所有推理模型都支持每个
        值。请参阅
        [推理指南](https://platform.openai.com/docs/guides/reasoning)
        了解各模型的支持情况。

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `seed: optional number or null`

        用于在采样期间初始化随机性的种子值。

      - `temperature: optional number or null`

        较高的温度会增加输出中的随机性。

      - `top_p: optional number or null`

        用于核采样的温度替代方案；1.0 包含所有令牌。

  - `MultiGrader object { calculate_output, graders, name, type }`

    MultiGrader 对象结合多个评分器的输出来生成单个分数。

    - `calculate_output: string`

      用于根据评分器结果计算输出的公式。

    - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

      一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

      - `StringCheckGrader object { input, name, operation, 2 more }`

        一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

      - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

        一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

      - `PythonGrader object { name, source, type, image_tag }`

        一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

      - `ScoreModelGrader object { input, model, name, 3 more }`

        一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

      - `LabelModelGrader object { input, labels, model, 3 more }`

        一个 LabelModelGrader 对象，它使用模型为每个项目分配标签
        在评估中。

        - `input: array of object { content, role, type }`

          - `content: string or ResponseInputText or object { text, type }  or 3 more`

            模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

            - `TextInput = string`

              发送给模型的文本输入。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              发送给模型的文本输入。

            - `OutputText object { text, type }`

              模型的文本输出。

              - `text: string`

                模型的文本输出。

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

                发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              发送给模型的音频输入。

            - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

              输入列表，每一项可以是输入文本、输出文本、输入
              图像或输入音频对象。

          - `role: "user" or "assistant" or "system" or "developer"`

            消息输入的角色。值为 `user`, `assistant`, `system`，或
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

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/alpha/graders/validate \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "grader": {
            "input": "input",
            "name": "name",
            "operation": "eq",
            "reference": "reference",
            "type": "string_check"
          }
        }'
```

#### 响应

```json
{
  "grader": {
    "input": "input",
    "name": "name",
    "operation": "eq",
    "reference": "reference",
    "type": "string_check"
  }
}
```

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/alpha/graders/validate \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "grader": {
      "type": "string_check",
      "name": "Example string check grader",
      "input": "{{sample.output_text}}",
      "reference": "{{item.label}}",
      "operation": "eq"
    }
  }'
```

#### 响应

```json
{
  "grader": {
    "type": "string_check",
    "name": "Example string check grader",
    "input": "{{sample.output_text}}",
    "reference": "{{item.label}}",
    "operation": "eq"
  }
}
```

## 领域类型

### 评分器运行响应

- `GraderRunResponse object { metadata, model_grader_token_usage_per_model, reward, sub_rewards }`

  - `metadata: object { errors, execution_time, name, 4 more }`

    - `errors: object { formula_parse_error, invalid_variable_error, model_grader_parse_error, 11 more }`

      - `formula_parse_error: boolean`

      - `invalid_variable_error: boolean`

      - `model_grader_parse_error: boolean`

      - `model_grader_refusal_error: boolean`

      - `model_grader_server_error: boolean`

      - `model_grader_server_error_details: string or null`

      - `other_error: boolean`

      - `python_grader_runtime_error: boolean`

      - `python_grader_runtime_error_details: string or null`

      - `python_grader_server_error: boolean`

      - `python_grader_server_error_type: string or null`

      - `sample_parse_error: boolean`

      - `truncated_observation_error: boolean`

      - `unresponsive_reward_error: boolean`

    - `execution_time: number`

    - `name: string`

    - `sampled_model_name: string or null`

    - `scores: map[unknown]`

    - `token_usage: number or null`

    - `type: string`

  - `model_grader_token_usage_per_model: map[unknown]`

  - `reward: number`

  - `sub_rewards: map[unknown]`

### 评分器验证响应

- `GraderValidateResponse object { grader }`

  - `grader: optional StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

    用于微调作业的评分器。

    - `StringCheckGrader object { input, name, operation, 2 more }`

      一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

      - `input: string`

        输入文本。这可能包括模板字符串。

      - `name: string`

        评分器的名称。

      - `operation: "eq" or "ne" or "like" or "ilike"`

        要执行的字符串检查操作。以下之一 `eq`, `ne`, `like`，或 `ilike`.

        - `"eq"`

        - `"ne"`

        - `"like"`

        - `"ilike"`

      - `reference: string`

        参考文本。这可能包括模板字符串。

      - `type: "string_check"`

        对象类型，始终为 `string_check`.

        - `"string_check"`

    - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

      一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

      - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

        要使用的评估指标。以下之一 `cosine`, `fuzzy_match`, `bleu`,
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

        用作评分参考的文本。

      - `type: "text_similarity"`

        评分器的类型。

        - `"text_similarity"`

    - `PythonGrader object { name, source, type, image_tag }`

      一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

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

      一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

      - `input: array of object { content, role, type }`

        由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可能包括模板字符串。

        - `content: string or ResponseInputText or object { text, type }  or 3 more`

          模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

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

              标记可重用提示前缀的精确结束位置。断点继承请求的 `prompt_cache_options.ttl`；TTL；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `OutputText object { text, type }`

            模型的文本输出。

            - `text: string`

              模型的文本输出。

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

              发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            发送给模型的音频输入。

            - `input_audio: object { data, format }`

              - `data: string`

                Base64 编码的音频数据。

              - `format: "mp3" or "wav"`

                音频数据的格式。目前支持的格式为 `mp3` 和
                `wav`.

                - `"mp3"`

                - `"wav"`

            - `type: "input_audio"`

              输入项的类型。始终为 `input_audio`.

              - `"input_audio"`

          - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

            输入列表，每一项可以是输入文本、输出文本、输入
            图像或输入音频对象。

            - `TextInput = string`

              发送给模型的文本输入。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              发送给模型的文本输入。

            - `OutputText object { text, type }`

              模型的文本输出。

              - `text: string`

                模型的文本输出。

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

                发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              发送给模型的音频输入。

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色。值为 `user`, `assistant`, `system`，或
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

        评分的范围。默认值为 `[0, 1]`.

      - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

        模型的采样参数。

        - `max_completions_tokens: optional number or null`

          评分模型在其响应中可生成的最大令牌数。

        - `reasoning_effort: optional ReasoningEffort or null`

          限制推理模型在推理上的投入。目前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
          降低推理投入可以加快响应速度并减少响应中用于推理的令牌
          数量。并非所有推理模型都支持每个
          值。请参阅
          [推理指南](https://platform.openai.com/docs/guides/reasoning)
          了解各模型的支持情况。

          - `"none"`

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

        - `seed: optional number or null`

          用于在采样期间初始化随机性的种子值。

        - `temperature: optional number or null`

          较高的温度会增加输出中的随机性。

        - `top_p: optional number or null`

          用于核采样的温度替代方案；1.0 包含所有令牌。

    - `MultiGrader object { calculate_output, graders, name, type }`

      MultiGrader 对象结合多个评分器的输出来生成单个分数。

      - `calculate_output: string`

        用于根据评分器结果计算输出的公式。

      - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

        - `StringCheckGrader object { input, name, operation, 2 more }`

          一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

        - `PythonGrader object { name, source, type, image_tag }`

          一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

        - `ScoreModelGrader object { input, model, name, 3 more }`

          一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

        - `LabelModelGrader object { input, labels, model, 3 more }`

          一个 LabelModelGrader 对象，它使用模型为每个项目分配标签
          在评估中。

          - `input: array of object { content, role, type }`

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

              - `TextInput = string`

                发送给模型的文本输入。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                发送给模型的文本输入。

              - `OutputText object { text, type }`

                模型的文本输出。

                - `text: string`

                  模型的文本输出。

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

                  发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                发送给模型的音频输入。

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，每一项可以是输入文本、输出文本、输入
                图像或输入音频对象。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。值为 `user`, `assistant`, `system`，或
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

# 检查点

# 权限

## 创建检查点权限

**post** `/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions`

**注意：** 调用此端点需要 [管理员 API 密钥](../admin-api-keys).

这使组织所有者能够与组织内的其他项目共享微调模型。

### 路径参数

- `fine_tuned_model_checkpoint: string`

### 请求体参数

- `project_ids: array of string`

  要授予访问权限的项目标识符。

### 返回值

- `data: array of object { id, created_at, object, project_id }`

  - `id: string`

    权限标识符，可在 API 端点中引用。

  - `created_at: number`

    权限创建时的 Unix 时间戳（以秒为单位）。

  - `object: "checkpoint.permission"`

    对象类型，始终为 "checkpoint.permission"。

    - `"checkpoint.permission"`

  - `project_id: string`

    该权限对应的项目标识符。

- `has_more: boolean`

- `object: "list"`

  - `"list"`

- `first_id: optional string or null`

- `last_id: optional string or null`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/$FINE_TUNED_MODEL_CHECKPOINT/permissions \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "project_ids": [
            "string"
          ]
        }'
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "object": "checkpoint.permission",
      "project_id": "project_id"
    }
  ],
  "has_more": true,
  "object": "list",
  "first_id": "first_id",
  "last_id": "last_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd/permissions \
  -H "Authorization: Bearer $OPENAI_API_KEY"
  -d '{"project_ids": ["proj_abGMw1llN8IrBb6SvvY5A1iH"]}'
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "object": "checkpoint.permission",
      "id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
      "created_at": 1721764867,
      "project_id": "proj_abGMw1llN8IrBb6SvvY5A1iH"
    }
  ],
  "first_id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
  "last_id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
  "has_more": false
}
```

## 删除检查点权限

**删除** `/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions/{permission_id}`

**注意：** 此端点需要一个 [管理员 API 密钥](../admin-api-keys).

组织所有者可以使用此端点删除针对已微调模型检查点的权限。

### 路径参数

- `fine_tuned_model_checkpoint: string`

- `permission_id: string`

### 返回值

- `id: string`

  已删除的微调模型检查点权限的 ID。

- `deleted: boolean`

  微调模型检查点权限是否已成功删除。

- `object: "checkpoint.permission"`

  对象类型，始终为 "checkpoint.permission"。

  - `"checkpoint.permission"`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/$FINE_TUNED_MODEL_CHECKPOINT/permissions/$PERMISSION_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "checkpoint.permission"
}
```

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd/permissions/cp_zc4Q7MP6XxulcVzj4MZdwsAB \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "checkpoint.permission",
  "id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
  "deleted": true
}
```

## 列出检查点权限

**get** `/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions`

**注意：** 此端点需要一个 [管理员 API 密钥](../admin-api-keys).

组织所有者可以使用此端点查看微调模型检查点的所有权限。

### 路径参数

- `fine_tuned_model_checkpoint: string`

### 查询参数

- `after: optional string`

  上一次分页请求中最后一个权限 ID 的标识符。

- `limit: optional number`

  要检索的权限数量。

- `order: optional "ascending" or "descending"`

  检索权限的顺序。

  - `"ascending"`

  - `"descending"`

- `project_id: optional string`

  要获取权限的项目 ID。

### 返回值

- `data: array of object { id, created_at, object, project_id }`

  - `id: string`

    权限标识符，可在 API 端点中引用。

  - `created_at: number`

    权限创建时的 Unix 时间戳（以秒为单位）。

  - `object: "checkpoint.permission"`

    对象类型，始终为 "checkpoint.permission"。

    - `"checkpoint.permission"`

  - `project_id: string`

    该权限对应的项目标识符。

- `has_more: boolean`

- `object: "list"`

  - `"list"`

- `first_id: optional string or null`

- `last_id: optional string or null`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/$FINE_TUNED_MODEL_CHECKPOINT/permissions \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "object": "checkpoint.permission",
      "project_id": "project_id"
    }
  ],
  "has_more": true,
  "object": "list",
  "first_id": "first_id",
  "last_id": "last_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd/permissions \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "object": "checkpoint.permission",
      "id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
      "created_at": 1721764867,
      "project_id": "proj_abGMw1llN8IrBb6SvvY5A1iH"
    },
    {
      "object": "checkpoint.permission",
      "id": "cp_enQCFmOTGj3syEpYVhBRLTSy",
      "created_at": 1721764800,
      "project_id": "proj_iqGMw1llN8IrBb6SvvY5A1oF"
    },
  ],
  "first_id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
  "last_id": "cp_enQCFmOTGj3syEpYVhBRLTSy",
  "has_more": false
}
```

## 列出检查点权限

**get** `/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions`

**注意：** 此端点需要一个 [管理员 API 密钥](../admin-api-keys).

组织所有者可以使用此端点查看微调模型检查点的所有权限。

### 路径参数

- `fine_tuned_model_checkpoint: string`

### 查询参数

- `after: optional string`

  上一次分页请求中最后一个权限 ID 的标识符。

- `limit: optional number`

  要检索的权限数量。

- `order: optional "ascending" or "descending"`

  检索权限的顺序。

  - `"ascending"`

  - `"descending"`

- `project_id: optional string`

  要获取权限的项目 ID。

### 返回值

- `data: array of object { id, created_at, object, project_id }`

  - `id: string`

    权限标识符，可在 API 端点中引用。

  - `created_at: number`

    权限创建时的 Unix 时间戳（以秒为单位）。

  - `object: "checkpoint.permission"`

    对象类型，始终为 "checkpoint.permission"。

    - `"checkpoint.permission"`

  - `project_id: string`

    该权限对应的项目标识符。

- `has_more: boolean`

- `object: "list"`

  - `"list"`

- `first_id: optional string or null`

- `last_id: optional string or null`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/$FINE_TUNED_MODEL_CHECKPOINT/permissions \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "object": "checkpoint.permission",
      "project_id": "project_id"
    }
  ],
  "has_more": true,
  "object": "list",
  "first_id": "first_id",
  "last_id": "last_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd/permissions \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "object": "checkpoint.permission",
      "id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
      "created_at": 1721764867,
      "project_id": "proj_abGMw1llN8IrBb6SvvY5A1iH"
    },
    {
      "object": "checkpoint.permission",
      "id": "cp_enQCFmOTGj3syEpYVhBRLTSy",
      "created_at": 1721764800,
      "project_id": "proj_iqGMw1llN8IrBb6SvvY5A1oF"
    },
  ],
  "first_id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
  "last_id": "cp_enQCFmOTGj3syEpYVhBRLTSy",
  "has_more": false
}
```

## 领域类型

### 权限 创建响应

- `PermissionCreateResponse object { id, created_at, object, project_id }`

  该 `checkpoint.permission` 对象表示微调模型检查点的权限。

  - `id: string`

    权限标识符，可在 API 端点中引用。

  - `created_at: number`

    权限创建时的 Unix 时间戳（以秒为单位）。

  - `object: "checkpoint.permission"`

    对象类型，始终为 "checkpoint.permission"。

    - `"checkpoint.permission"`

  - `project_id: string`

    该权限对应的项目标识符。

### 权限删除响应

- `PermissionDeleteResponse object { id, deleted, object }`

  - `id: string`

    已删除的微调模型检查点权限的 ID。

  - `deleted: boolean`

    微调模型检查点权限是否已成功删除。

  - `object: "checkpoint.permission"`

    对象类型，始终为 "checkpoint.permission"。

    - `"checkpoint.permission"`

### 权限列表响应

- `PermissionListResponse object { id, created_at, object, project_id }`

  该 `checkpoint.permission` 对象表示微调模型检查点的权限。

  - `id: string`

    权限标识符，可在 API 端点中引用。

  - `created_at: number`

    权限创建时的 Unix 时间戳（以秒为单位）。

  - `object: "checkpoint.permission"`

    对象类型，始终为 "checkpoint.permission"。

    - `"checkpoint.permission"`

  - `project_id: string`

    该权限对应的项目标识符。

### 权限检索响应

- `PermissionRetrieveResponse object { data, has_more, object, 2 more }`

  - `data: array of object { id, created_at, object, project_id }`

    - `id: string`

      权限标识符，可在 API 端点中引用。

    - `created_at: number`

      权限创建时的 Unix 时间戳（以秒为单位）。

    - `object: "checkpoint.permission"`

      对象类型，始终为 "checkpoint.permission"。

      - `"checkpoint.permission"`

    - `project_id: string`

      该权限对应的项目标识符。

  - `has_more: boolean`

  - `object: "list"`

    - `"list"`

  - `first_id: optional string or null`

  - `last_id: optional string or null`

# 作业

## 取消微调

**post** `/fine_tuning/jobs/{fine_tuning_job_id}/cancel`

立即取消微调任务。

### 路径参数

- `fine_tuning_job_id: string`

### 返回值

- `FineTuningJob object { id, created_at, error, 16 more }`

  该 `fine_tuning.job` 对象表示一个已通过 API 创建的微调作业。

  - `id: string`

    对象标识符，可在 API 端点中引用。

  - `created_at: number`

    创建微调作业时的 Unix 时间戳（以秒为单位）。

  - `error: object { code, message, param }  or null`

    对于已失败的微调作业 `failed`，此处将包含有关失败原因的更多信息。

    - `code: string`

      机器可读的错误代码。

    - `message: string`

      人类可读的错误消息。

    - `param: string or null`

      无效的参数，通常为 `training_file` 或 `validation_file`。如果失败与特定参数无关，此字段将为 null。

  - `fine_tuned_model: string or null`

    正在创建的微调模型的名称。如果微调作业仍在运行，此值将为 null。

  - `finished_at: number or null`

    微调作业完成时的 Unix 时间戳（以秒为单位）。如果微调作业仍在运行，此值将为 null。

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    用于微调作业的超参数。此值仅在运行 `supervised` 作业时返回。

    - `batch_size: optional "auto" or number or null`

      每个批次中的示例数量。较大的批次大小意味着模型参数
      更新的频率较低，但方差较小。

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      学习率的缩放因子。较小的学习率可能有助于避免
      过拟合。

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      训练模型的轮数。一个 epoch 指完整遍历训练数据集
      一次。

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    正在进行微调的基础模型。

  - `object: "fine_tuning.job"`

    对象类型，始终为 "fine_tuning.job"。

    - `"fine_tuning.job"`

  - `organization_id: string`

    拥有此微调作业的组织。

  - `result_files: array of string`

    微调作业的编译结果文件 ID。你可以通过以下方式检索结果： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `seed: number`

    微调作业使用的种子。

  - `status: "validating_files" or "queued" or "running" or 3 more`

    微调作业的当前状态，可以是 `validating_files`, `queued`, `running`, `succeeded`, `failed`，或 `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    此微调作业处理的可计费令牌总数。如果微调作业仍在运行，该值将为 null。

  - `training_file: string`

    用于训练的文件 ID。你可以通过以下方式检索训练数据： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `validation_file: string or null`

    用于验证的文件 ID。你可以通过以下方式检索验证结果： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `estimated_finish: optional number or null`

    微调作业预计完成的 Unix 时间戳（秒）。如果微调作业未在运行，该值将为 null。

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    为此微调作业启用的集成列表。

    - `type: "wandb"`

      为微调作业启用的集成类型

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      与 Weights and Biases 集成的设置。此负载指定了将
      指标发送到的项目。可选地，你可以为运行设置显式显示名称，添加标签
      到运行中，并设置要与运行关联的默认实体（团队、用户名等）。

      - `project: string`

        新运行将创建于的项目名称。

      - `entity: optional string or null`

        用于运行的实体。这允许你设置与运行关联的 WandB 用户的团队或用户名，
        如果未设置，则使用已注册的 WandB API 密钥的默认实体。

      - `name: optional string or null`

        为运行设置的显示名称。如果未设置，我们将使用作业 ID 作为名称。

      - `tags: optional array of string`

        要附加到新创建的运行的标签列表。这些标签直接传递给 WandB。部分
        默认标签由 OpenAI 生成："openai/finetune"、"openai/{base-model}"、"openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    可附加到对象上的 16 对键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `method: optional object { type, dpo, reinforcement, supervised }`

    用于微调的方法。

    - `type: "supervised" or "dpo" or "reinforcement"`

      方法的类型。可以是 `supervised`, `dpo`，或 `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      DPO 微调方法的配置。

      - `hyperparameters: optional DpoHyperparameters`

        用于 DPO 微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          DPO 方法的 beta 值。较高的 beta 值会增加策略模型和参考模型之间惩罚的权重。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      强化微调方法的配置。

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        用于微调作业的评分器。

        - `StringCheckGrader object { input, name, operation, 2 more }`

          一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

          - `input: string`

            输入文本。这可能包括模板字符串。

          - `name: string`

            评分器的名称。

          - `operation: "eq" or "ne" or "like" or "ilike"`

            要执行的字符串检查操作。以下之一 `eq`, `ne`, `like`，或 `ilike`.

            - `"eq"`

            - `"ne"`

            - `"like"`

            - `"ilike"`

          - `reference: string`

            参考文本。这可能包括模板字符串。

          - `type: "string_check"`

            对象类型，始终为 `string_check`.

            - `"string_check"`

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

          - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

            要使用的评估指标。以下之一 `cosine`, `fuzzy_match`, `bleu`,
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

            用作评分参考的文本。

          - `type: "text_similarity"`

            评分器的类型。

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

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

          一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

          - `input: array of object { content, role, type }`

            由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可能包括模板字符串。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

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

                  标记可重用提示前缀的精确结束位置。断点继承请求的 `prompt_cache_options.ttl`；TTL；边界不会四舍五入到令牌块。

                  - `mode: "explicit"`

                    断点模式。始终为 `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                模型的文本输出。

                - `text: string`

                  模型的文本输出。

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

                  发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                发送给模型的音频输入。

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64 编码的音频数据。

                  - `format: "mp3" or "wav"`

                    音频数据的格式。目前支持的格式为 `mp3` 和
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  输入项的类型。始终为 `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，每一项可以是输入文本、输出文本、输入
                图像或输入音频对象。

                - `TextInput = string`

                  发送给模型的文本输入。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  发送给模型的文本输入。

                - `OutputText object { text, type }`

                  模型的文本输出。

                  - `text: string`

                    模型的文本输出。

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

                    发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  发送给模型的音频输入。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。值为 `user`, `assistant`, `system`，或
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

            评分的范围。默认值为 `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            模型的采样参数。

            - `max_completions_tokens: optional number or null`

              评分模型在其响应中可生成的最大令牌数。

            - `reasoning_effort: optional ReasoningEffort or null`

              限制推理模型在推理上的投入。目前支持的
              值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
              降低推理投入可以加快响应速度并减少响应中用于推理的令牌
              数量。并非所有推理模型都支持每个
              值。请参阅
              [推理指南](https://platform.openai.com/docs/guides/reasoning)
              了解各模型的支持情况。

              - `"none"`

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

            - `seed: optional number or null`

              用于在采样期间初始化随机性的种子值。

            - `temperature: optional number or null`

              较高的温度会增加输出中的随机性。

            - `top_p: optional number or null`

              用于核采样的温度替代方案；1.0 包含所有令牌。

        - `MultiGrader object { calculate_output, graders, name, type }`

          MultiGrader 对象结合多个评分器的输出来生成单个分数。

          - `calculate_output: string`

            用于根据评分器结果计算输出的公式。

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

            - `StringCheckGrader object { input, name, operation, 2 more }`

              一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

            - `PythonGrader object { name, source, type, image_tag }`

              一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

            - `ScoreModelGrader object { input, model, name, 3 more }`

              一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

            - `LabelModelGrader object { input, labels, model, 3 more }`

              一个 LabelModelGrader 对象，它使用模型为每个项目分配标签
              在评估中。

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

                  - `TextInput = string`

                    发送给模型的文本输入。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    发送给模型的文本输入。

                  - `OutputText object { text, type }`

                    模型的文本输出。

                    - `text: string`

                      模型的文本输出。

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

                      发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    发送给模型的音频输入。

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    输入列表，每一项可以是输入文本、输出文本、输入
                    图像或输入音频对象。

                - `role: "user" or "assistant" or "system" or "developer"`

                  消息输入的角色。值为 `user`, `assistant`, `system`，或
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

      - `hyperparameters: optional ReinforcementHyperparameters`

        用于强化微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          训练期间用于探索搜索空间的计算量乘数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          评估运行之间的训练步数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_samples: optional "auto" or number`

          每个训练步生成的评估样本数量。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

        - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

          推理努力程度。

          - `"default"`

          - `"low"`

          - `"medium"`

          - `"high"`

    - `supervised: optional SupervisedMethod`

      监督微调方法的配置。

      - `hyperparameters: optional SupervisedHyperparameters`

        用于微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/jobs/$FINE_TUNING_JOB_ID/cancel \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "error": {
    "code": "code",
    "message": "message",
    "param": "param"
  },
  "fine_tuned_model": "fine_tuned_model",
  "finished_at": 0,
  "hyperparameters": {
    "batch_size": "auto",
    "learning_rate_multiplier": "auto",
    "n_epochs": "auto"
  },
  "model": "model",
  "object": "fine_tuning.job",
  "organization_id": "organization_id",
  "result_files": [
    "file-abc123"
  ],
  "seed": 0,
  "status": "validating_files",
  "trained_tokens": 0,
  "training_file": "training_file",
  "validation_file": "validation_file",
  "estimated_finish": 0,
  "integrations": [
    {
      "type": "wandb",
      "wandb": {
        "project": "my-wandb-project",
        "entity": "entity",
        "name": "name",
        "tags": [
          "custom-tag"
        ]
      }
    }
  ],
  "metadata": {
    "foo": "string"
  },
  "method": {
    "type": "supervised",
    "dpo": {
      "hyperparameters": {
        "batch_size": "auto",
        "beta": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    },
    "reinforcement": {
      "grader": {
        "input": "input",
        "name": "name",
        "operation": "eq",
        "reference": "reference",
        "type": "string_check"
      },
      "hyperparameters": {
        "batch_size": "auto",
        "compute_multiplier": "auto",
        "eval_interval": "auto",
        "eval_samples": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
        "reasoning_effort": "default"
      }
    },
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    }
  }
}
```

### 示例

```http
curl -X POST https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "cancelled",
  "validation_file": "file-abc123",
  "training_file": "file-abc123"
}
```

## 创建微调作业

**post** `/fine_tuning/jobs`

创建微调作业，该作业将开始从给定数据集创建新模型的过程。

响应包含排队作业的详细信息，包括作业状态以及完成后的微调模型名称。

[了解更多关于微调的信息](/docs/guides/model-optimization)

### 请求体参数

- `model: string or "babbage-002" or "davinci-002" or "gpt-3.5-turbo" or "gpt-4o-mini"`

  用于微调的模型名称。你可以选择以下
  [受支持的模型](/docs/guides/fine-tuning#which-models-can-be-fine-tuned).

  - `string`

  - `"babbage-002" or "davinci-002" or "gpt-3.5-turbo" or "gpt-4o-mini"`

    用于微调的模型名称。你可以选择以下
    [受支持的模型](/docs/guides/fine-tuning#which-models-can-be-fine-tuned).

    - `"babbage-002"`

    - `"davinci-002"`

    - `"gpt-3.5-turbo"`

    - `"gpt-4o-mini"`

- `training_file: string`

  包含训练数据的已上传文件的 ID。

  参见 [上传文件](/docs/api-reference/files/create) 了解如何上传文件。

  你的数据集必须格式化为 JSONL 文件。此外，你必须以上传目的 `fine-tune`.

  上传文件。文件内容应根据模型使用的是 [聊天](/docs/api-reference/fine-tuning/chat-input), [补全](/docs/api-reference/fine-tuning/completions-input) 格式，还是微调方法使用的是 [偏好](/docs/api-reference/fine-tuning/preference-input) 格式而有所不同。

  参见 [微调指南](/docs/guides/model-optimization) 了解更多详情。

- `hyperparameters: optional object { batch_size, learning_rate_multiplier, n_epochs }`

  用于微调作业的超参数。
  此值已弃用，请改用 `method`，应将其传入 `method` 参数。

  - `batch_size: optional "auto" or number`

    每个批次中的示例数量。较大的批次大小意味着模型参数
    更新的频率较低，但方差较小。

    - `"auto"`

      - `"auto"`

    - `number`

  - `learning_rate_multiplier: optional "auto" or number`

    学习率的缩放因子。较小的学习率可能有助于避免
    过拟合。

    - `"auto"`

      - `"auto"`

    - `number`

  - `n_epochs: optional "auto" or number`

    训练模型的轮数。一个 epoch 指完整遍历训练数据集
    一次。

    - `"auto"`

      - `"auto"`

    - `number`

- `integrations: optional array of object { type, wandb }  or null`

  要为你的微调作业启用的集成列表。

  - `type: "wandb"`

    要启用的集成类型。目前仅支持“wandb”（Weights and Biases）。

    - `"wandb"`

  - `wandb: object { project, entity, name, tags }`

    与 Weights and Biases 集成的设置。此负载指定了将
    指标发送到的项目。可选地，你可以为运行设置显式显示名称，添加标签
    到运行中，并设置要与运行关联的默认实体（团队、用户名等）。

    - `project: string`

      新运行将创建于的项目名称。

    - `entity: optional string or null`

      用于运行的实体。这允许你设置与运行关联的 WandB 用户的团队或用户名，
      如果未设置，则使用已注册的 WandB API 密钥的默认实体。

    - `name: optional string or null`

      为运行设置的显示名称。如果未设置，我们将使用作业 ID 作为名称。

    - `tags: optional array of string`

      要附加到新创建的运行的标签列表。这些标签直接传递给 WandB。部分
      默认标签由 OpenAI 生成："openai/finetune"、"openai/{base-model}"、"openai/{ftjob-abcdef}".

- `metadata: optional Metadata or null`

  可附加到对象上的 16 对键值对。这可以
  用于以结构化格式存储关于对象的额外信息，
  并通过 API 或仪表盘查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串，
  最大长度为 512 个字符。

- `method: optional object { type, dpo, reinforcement, supervised }`

  用于微调的方法。

  - `type: "supervised" or "dpo" or "reinforcement"`

    方法的类型。可以是 `supervised`, `dpo`，或 `reinforcement`.

    - `"supervised"`

    - `"dpo"`

    - `"reinforcement"`

  - `dpo: optional DpoMethod`

    DPO 微调方法的配置。

    - `hyperparameters: optional DpoHyperparameters`

      用于 DPO 微调作业的超参数。

      - `batch_size: optional "auto" or number`

        每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

        - `"auto"`

          - `"auto"`

        - `number`

      - `beta: optional "auto" or number`

        DPO 方法的 beta 值。较高的 beta 值会增加策略模型和参考模型之间惩罚的权重。

        - `"auto"`

          - `"auto"`

        - `number`

      - `learning_rate_multiplier: optional "auto" or number`

        学习率的缩放因子。较小的学习率可能有助于避免过拟合。

        - `"auto"`

          - `"auto"`

        - `number`

      - `n_epochs: optional "auto" or number`

        训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

        - `"auto"`

          - `"auto"`

        - `number`

  - `reinforcement: optional ReinforcementMethod`

    强化微调方法的配置。

    - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

      用于微调作业的评分器。

      - `StringCheckGrader object { input, name, operation, 2 more }`

        一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

        - `input: string`

          输入文本。这可能包括模板字符串。

        - `name: string`

          评分器的名称。

        - `operation: "eq" or "ne" or "like" or "ilike"`

          要执行的字符串检查操作。以下之一 `eq`, `ne`, `like`，或 `ilike`.

          - `"eq"`

          - `"ne"`

          - `"like"`

          - `"ilike"`

        - `reference: string`

          参考文本。这可能包括模板字符串。

        - `type: "string_check"`

          对象类型，始终为 `string_check`.

          - `"string_check"`

      - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

        一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

        - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

          要使用的评估指标。以下之一 `cosine`, `fuzzy_match`, `bleu`,
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

          用作评分参考的文本。

        - `type: "text_similarity"`

          评分器的类型。

          - `"text_similarity"`

      - `PythonGrader object { name, source, type, image_tag }`

        一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

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

        一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

        - `input: array of object { content, role, type }`

          由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可能包括模板字符串。

          - `content: string or ResponseInputText or object { text, type }  or 3 more`

            模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

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

                标记可重用提示前缀的精确结束位置。断点继承请求的 `prompt_cache_options.ttl`；TTL；边界不会四舍五入到令牌块。

                - `mode: "explicit"`

                  断点模式。始终为 `explicit`.

                  - `"explicit"`

            - `OutputText object { text, type }`

              模型的文本输出。

              - `text: string`

                模型的文本输出。

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

                发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              发送给模型的音频输入。

              - `input_audio: object { data, format }`

                - `data: string`

                  Base64 编码的音频数据。

                - `format: "mp3" or "wav"`

                  音频数据的格式。目前支持的格式为 `mp3` 和
                  `wav`.

                  - `"mp3"`

                  - `"wav"`

              - `type: "input_audio"`

                输入项的类型。始终为 `input_audio`.

                - `"input_audio"`

            - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

              输入列表，每一项可以是输入文本、输出文本、输入
              图像或输入音频对象。

              - `TextInput = string`

                发送给模型的文本输入。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                发送给模型的文本输入。

              - `OutputText object { text, type }`

                模型的文本输出。

                - `text: string`

                  模型的文本输出。

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

                  发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                发送给模型的音频输入。

          - `role: "user" or "assistant" or "system" or "developer"`

            消息输入的角色。值为 `user`, `assistant`, `system`，或
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

          评分的范围。默认值为 `[0, 1]`.

        - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

          模型的采样参数。

          - `max_completions_tokens: optional number or null`

            评分模型在其响应中可生成的最大令牌数。

          - `reasoning_effort: optional ReasoningEffort or null`

            限制推理模型在推理上的投入。目前支持的
            值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
            降低推理投入可以加快响应速度并减少响应中用于推理的令牌
            数量。并非所有推理模型都支持每个
            值。请参阅
            [推理指南](https://platform.openai.com/docs/guides/reasoning)
            了解各模型的支持情况。

            - `"none"`

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

            - `"max"`

          - `seed: optional number or null`

            用于在采样期间初始化随机性的种子值。

          - `temperature: optional number or null`

            较高的温度会增加输出中的随机性。

          - `top_p: optional number or null`

            用于核采样的温度替代方案；1.0 包含所有令牌。

      - `MultiGrader object { calculate_output, graders, name, type }`

        MultiGrader 对象结合多个评分器的输出来生成单个分数。

        - `calculate_output: string`

          用于根据评分器结果计算输出的公式。

        - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

          一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

          - `StringCheckGrader object { input, name, operation, 2 more }`

            一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

          - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

            一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

          - `PythonGrader object { name, source, type, image_tag }`

            一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

          - `ScoreModelGrader object { input, model, name, 3 more }`

            一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

          - `LabelModelGrader object { input, labels, model, 3 more }`

            一个 LabelModelGrader 对象，它使用模型为每个项目分配标签
            在评估中。

            - `input: array of object { content, role, type }`

              - `content: string or ResponseInputText or object { text, type }  or 3 more`

                模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

                - `TextInput = string`

                  发送给模型的文本输入。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  发送给模型的文本输入。

                - `OutputText object { text, type }`

                  模型的文本输出。

                  - `text: string`

                    模型的文本输出。

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

                    发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  发送给模型的音频输入。

                - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                  输入列表，每一项可以是输入文本、输出文本、输入
                  图像或输入音频对象。

              - `role: "user" or "assistant" or "system" or "developer"`

                消息输入的角色。值为 `user`, `assistant`, `system`，或
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

    - `hyperparameters: optional ReinforcementHyperparameters`

      用于强化微调作业的超参数。

      - `batch_size: optional "auto" or number`

        每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

        - `"auto"`

          - `"auto"`

        - `number`

      - `compute_multiplier: optional "auto" or number`

        训练期间用于探索搜索空间的计算量乘数。

        - `"auto"`

          - `"auto"`

        - `number`

      - `eval_interval: optional "auto" or number`

        评估运行之间的训练步数。

        - `"auto"`

          - `"auto"`

        - `number`

      - `eval_samples: optional "auto" or number`

        每个训练步生成的评估样本数量。

        - `"auto"`

          - `"auto"`

        - `number`

      - `learning_rate_multiplier: optional "auto" or number`

        学习率的缩放因子。较小的学习率可能有助于避免过拟合。

        - `"auto"`

          - `"auto"`

        - `number`

      - `n_epochs: optional "auto" or number`

        训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

        - `"auto"`

          - `"auto"`

        - `number`

      - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

        推理努力程度。

        - `"default"`

        - `"low"`

        - `"medium"`

        - `"high"`

  - `supervised: optional SupervisedMethod`

    监督微调方法的配置。

    - `hyperparameters: optional SupervisedHyperparameters`

      用于微调作业的超参数。

      - `batch_size: optional "auto" or number`

        每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

        - `"auto"`

          - `"auto"`

        - `number`

      - `learning_rate_multiplier: optional "auto" or number`

        学习率的缩放因子。较小的学习率可能有助于避免过拟合。

        - `"auto"`

          - `"auto"`

        - `number`

      - `n_epochs: optional "auto" or number`

        训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

        - `"auto"`

          - `"auto"`

        - `number`

- `seed: optional number or null`

  该种子控制任务的复现性。传入相同的种子和任务参数应产生相同的结果，但在极少数情况下可能会有所不同。
  如果未指定种子，将为你生成一个。

- `suffix: optional string or null`

  一个最多 64 个字符的字符串，将添加到你的微调模型名称中。

  例如，一个 `suffix` 为“custom-model-name”的 `ft:gpt-4o-mini:openai:custom-model-name:7p4lURel`.

- `validation_file: optional string or null`

  包含验证数据的上传文件的 ID。

  如果提供此文件，则数据将用于在微调期间定期生成验证
  指标。这些指标可以在
  微调结果文件中查看。
  相同的数据不应同时出现在训练文件和验证文件中。

  你的数据集必须格式化为 JSONL 文件。你必须以 `fine-tune`.

  参见 [微调指南](/docs/guides/model-optimization) 了解更多详情。

### 返回值

- `FineTuningJob object { id, created_at, error, 16 more }`

  该 `fine_tuning.job` 对象表示一个已通过 API 创建的微调作业。

  - `id: string`

    对象标识符，可在 API 端点中引用。

  - `created_at: number`

    创建微调作业时的 Unix 时间戳（以秒为单位）。

  - `error: object { code, message, param }  or null`

    对于已失败的微调作业 `failed`，此处将包含有关失败原因的更多信息。

    - `code: string`

      机器可读的错误代码。

    - `message: string`

      人类可读的错误消息。

    - `param: string or null`

      无效的参数，通常为 `training_file` 或 `validation_file`。如果失败与特定参数无关，此字段将为 null。

  - `fine_tuned_model: string or null`

    正在创建的微调模型的名称。如果微调作业仍在运行，此值将为 null。

  - `finished_at: number or null`

    微调作业完成时的 Unix 时间戳（以秒为单位）。如果微调作业仍在运行，此值将为 null。

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    用于微调作业的超参数。此值仅在运行 `supervised` 作业时返回。

    - `batch_size: optional "auto" or number or null`

      每个批次中的示例数量。较大的批次大小意味着模型参数
      更新的频率较低，但方差较小。

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      学习率的缩放因子。较小的学习率可能有助于避免
      过拟合。

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      训练模型的轮数。一个 epoch 指完整遍历训练数据集
      一次。

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    正在进行微调的基础模型。

  - `object: "fine_tuning.job"`

    对象类型，始终为 "fine_tuning.job"。

    - `"fine_tuning.job"`

  - `organization_id: string`

    拥有此微调作业的组织。

  - `result_files: array of string`

    微调作业的编译结果文件 ID。你可以通过以下方式检索结果： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `seed: number`

    微调作业使用的种子。

  - `status: "validating_files" or "queued" or "running" or 3 more`

    微调作业的当前状态，可以是 `validating_files`, `queued`, `running`, `succeeded`, `failed`，或 `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    此微调作业处理的可计费令牌总数。如果微调作业仍在运行，该值将为 null。

  - `training_file: string`

    用于训练的文件 ID。你可以通过以下方式检索训练数据： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `validation_file: string or null`

    用于验证的文件 ID。你可以通过以下方式检索验证结果： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `estimated_finish: optional number or null`

    微调作业预计完成的 Unix 时间戳（秒）。如果微调作业未在运行，该值将为 null。

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    为此微调作业启用的集成列表。

    - `type: "wandb"`

      为微调作业启用的集成类型

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      与 Weights and Biases 集成的设置。此负载指定了将
      指标发送到的项目。可选地，你可以为运行设置显式显示名称，添加标签
      到运行中，并设置要与运行关联的默认实体（团队、用户名等）。

      - `project: string`

        新运行将创建于的项目名称。

      - `entity: optional string or null`

        用于运行的实体。这允许你设置与运行关联的 WandB 用户的团队或用户名，
        如果未设置，则使用已注册的 WandB API 密钥的默认实体。

      - `name: optional string or null`

        为运行设置的显示名称。如果未设置，我们将使用作业 ID 作为名称。

      - `tags: optional array of string`

        要附加到新创建的运行的标签列表。这些标签直接传递给 WandB。部分
        默认标签由 OpenAI 生成："openai/finetune"、"openai/{base-model}"、"openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    可附加到对象上的 16 对键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `method: optional object { type, dpo, reinforcement, supervised }`

    用于微调的方法。

    - `type: "supervised" or "dpo" or "reinforcement"`

      方法的类型。可以是 `supervised`, `dpo`，或 `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      DPO 微调方法的配置。

      - `hyperparameters: optional DpoHyperparameters`

        用于 DPO 微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          DPO 方法的 beta 值。较高的 beta 值会增加策略模型和参考模型之间惩罚的权重。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      强化微调方法的配置。

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        用于微调作业的评分器。

        - `StringCheckGrader object { input, name, operation, 2 more }`

          一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

          - `input: string`

            输入文本。这可能包括模板字符串。

          - `name: string`

            评分器的名称。

          - `operation: "eq" or "ne" or "like" or "ilike"`

            要执行的字符串检查操作。以下之一 `eq`, `ne`, `like`，或 `ilike`.

            - `"eq"`

            - `"ne"`

            - `"like"`

            - `"ilike"`

          - `reference: string`

            参考文本。这可能包括模板字符串。

          - `type: "string_check"`

            对象类型，始终为 `string_check`.

            - `"string_check"`

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

          - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

            要使用的评估指标。以下之一 `cosine`, `fuzzy_match`, `bleu`,
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

            用作评分参考的文本。

          - `type: "text_similarity"`

            评分器的类型。

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

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

          一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

          - `input: array of object { content, role, type }`

            由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可能包括模板字符串。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

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

                  标记可重用提示前缀的精确结束位置。断点继承请求的 `prompt_cache_options.ttl`；TTL；边界不会四舍五入到令牌块。

                  - `mode: "explicit"`

                    断点模式。始终为 `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                模型的文本输出。

                - `text: string`

                  模型的文本输出。

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

                  发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                发送给模型的音频输入。

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64 编码的音频数据。

                  - `format: "mp3" or "wav"`

                    音频数据的格式。目前支持的格式为 `mp3` 和
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  输入项的类型。始终为 `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，每一项可以是输入文本、输出文本、输入
                图像或输入音频对象。

                - `TextInput = string`

                  发送给模型的文本输入。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  发送给模型的文本输入。

                - `OutputText object { text, type }`

                  模型的文本输出。

                  - `text: string`

                    模型的文本输出。

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

                    发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  发送给模型的音频输入。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。值为 `user`, `assistant`, `system`，或
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

            评分的范围。默认值为 `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            模型的采样参数。

            - `max_completions_tokens: optional number or null`

              评分模型在其响应中可生成的最大令牌数。

            - `reasoning_effort: optional ReasoningEffort or null`

              限制推理模型在推理上的投入。目前支持的
              值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
              降低推理投入可以加快响应速度并减少响应中用于推理的令牌
              数量。并非所有推理模型都支持每个
              值。请参阅
              [推理指南](https://platform.openai.com/docs/guides/reasoning)
              了解各模型的支持情况。

              - `"none"`

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

            - `seed: optional number or null`

              用于在采样期间初始化随机性的种子值。

            - `temperature: optional number or null`

              较高的温度会增加输出中的随机性。

            - `top_p: optional number or null`

              用于核采样的温度替代方案；1.0 包含所有令牌。

        - `MultiGrader object { calculate_output, graders, name, type }`

          MultiGrader 对象结合多个评分器的输出来生成单个分数。

          - `calculate_output: string`

            用于根据评分器结果计算输出的公式。

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

            - `StringCheckGrader object { input, name, operation, 2 more }`

              一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

            - `PythonGrader object { name, source, type, image_tag }`

              一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

            - `ScoreModelGrader object { input, model, name, 3 more }`

              一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

            - `LabelModelGrader object { input, labels, model, 3 more }`

              一个 LabelModelGrader 对象，它使用模型为每个项目分配标签
              在评估中。

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

                  - `TextInput = string`

                    发送给模型的文本输入。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    发送给模型的文本输入。

                  - `OutputText object { text, type }`

                    模型的文本输出。

                    - `text: string`

                      模型的文本输出。

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

                      发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    发送给模型的音频输入。

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    输入列表，每一项可以是输入文本、输出文本、输入
                    图像或输入音频对象。

                - `role: "user" or "assistant" or "system" or "developer"`

                  消息输入的角色。值为 `user`, `assistant`, `system`，或
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

      - `hyperparameters: optional ReinforcementHyperparameters`

        用于强化微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          训练期间用于探索搜索空间的计算量乘数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          评估运行之间的训练步数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_samples: optional "auto" or number`

          每个训练步生成的评估样本数量。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

        - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

          推理努力程度。

          - `"default"`

          - `"low"`

          - `"medium"`

          - `"high"`

    - `supervised: optional SupervisedMethod`

      监督微调方法的配置。

      - `hyperparameters: optional SupervisedHyperparameters`

        用于微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "model": "gpt-4o-mini",
          "training_file": "file-abc123",
          "seed": 42,
          "validation_file": "file-abc123"
        }'
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "error": {
    "code": "code",
    "message": "message",
    "param": "param"
  },
  "fine_tuned_model": "fine_tuned_model",
  "finished_at": 0,
  "hyperparameters": {
    "batch_size": "auto",
    "learning_rate_multiplier": "auto",
    "n_epochs": "auto"
  },
  "model": "model",
  "object": "fine_tuning.job",
  "organization_id": "organization_id",
  "result_files": [
    "file-abc123"
  ],
  "seed": 0,
  "status": "validating_files",
  "trained_tokens": 0,
  "training_file": "training_file",
  "validation_file": "validation_file",
  "estimated_finish": 0,
  "integrations": [
    {
      "type": "wandb",
      "wandb": {
        "project": "my-wandb-project",
        "entity": "entity",
        "name": "name",
        "tags": [
          "custom-tag"
        ]
      }
    }
  ],
  "metadata": {
    "foo": "string"
  },
  "method": {
    "type": "supervised",
    "dpo": {
      "hyperparameters": {
        "batch_size": "auto",
        "beta": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    },
    "reinforcement": {
      "grader": {
        "input": "input",
        "name": "name",
        "operation": "eq",
        "reference": "reference",
        "type": "string_check"
      },
      "hyperparameters": {
        "batch_size": "auto",
        "compute_multiplier": "auto",
        "eval_interval": "auto",
        "eval_samples": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
        "reasoning_effort": "default"
      }
    },
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    }
  }
}
```

### DPO

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-abc123",
    "validation_file": "file-abc123",
    "model": "gpt-4o-mini",
    "method": {
      "type": "dpo",
      "dpo": {
        "hyperparameters": {
          "beta": 0.1
        }
      }
    }
  }'
```

#### 响应

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc",
  "model": "gpt-4o-mini",
  "created_at": 1746130590,
  "fine_tuned_model": null,
  "organization_id": "org-abc",
  "result_files": [],
  "status": "queued",
  "validation_file": "file-123",
  "training_file": "file-abc",
  "method": {
    "type": "dpo",
    "dpo": {
      "hyperparameters": {
        "beta": 0.1,
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    }
  },
  "metadata": null,
  "error": {
    "code": null,
    "message": null,
    "param": null
  },
  "finished_at": null,
  "hyperparameters": null,
  "seed": 1036326793,
  "estimated_finish": null,
  "integrations": [],
  "user_provided_suffix": null,
  "usage_metrics": null,
  "shared_with_openai": false
}
```

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-BK7bzQj3FfZFXr7DbL6xJwfo",
    "model": "gpt-4o-mini"
  }'
```

#### 响应

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "queued",
  "validation_file": null,
  "training_file": "file-abc123",
  "method": {
    "type": "supervised",
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
      }
    }
  },
  "metadata": null
}
```

### 周期

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-abc123",
    "model": "gpt-4o-mini",
    "method": {
      "type": "supervised",
      "supervised": {
        "hyperparameters": {
          "n_epochs": 2
        }
      }
    }
  }'
```

#### 响应

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "queued",
  "validation_file": null,
  "training_file": "file-abc123",
  "hyperparameters": {
    "batch_size": "auto",
    "learning_rate_multiplier": "auto",
    "n_epochs": 2
  },
  "method": {
    "type": "supervised",
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": 2
      }
    }
  },
  "metadata": null,
  "error": {
    "code": null,
    "message": null,
    "param": null
  },
  "finished_at": null,
  "seed": 683058546,
  "trained_tokens": null,
  "estimated_finish": null,
  "integrations": [],
  "user_provided_suffix": null,
  "usage_metrics": null,
  "shared_with_openai": false
}
```

### 强化

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-abc",
    "validation_file": "file-123",
    "model": "o4-mini",
    "method": {
      "type": "reinforcement",
      "reinforcement": {
        "grader": {
          "type": "string_check",
          "name": "Example string check grader",
          "input": "{{sample.output_text}}",
          "reference": "{{item.label}}",
          "operation": "eq"
        },
        "hyperparameters": {
          "reasoning_effort": "medium"
        }
      }
    }
  }'
```

#### 响应

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "o4-mini",
  "created_at": 1721764800,
  "finished_at": null,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "validating_files",
  "validation_file": "file-123",
  "training_file": "file-abc",
  "trained_tokens": null,
  "error": {},
  "user_provided_suffix": null,
  "seed": 950189191,
  "estimated_finish": null,
  "integrations": [],
  "method": {
    "type": "reinforcement",
    "reinforcement": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
        "eval_interval": "auto",
        "eval_samples": "auto",
        "compute_multiplier": "auto",
        "reasoning_effort": "medium"
      },
      "grader": {
        "type": "string_check",
        "name": "Example string check grader",
        "input": "{{sample.output_text}}",
        "reference": "{{item.label}}",
        "operation": "eq"
      },
      "response_format": null
    }
  },
  "metadata": null,
  "usage_metrics": null,
  "shared_with_openai": false
}
      
```

### 验证文件

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-abc123",
    "validation_file": "file-abc123",
    "model": "gpt-4o-mini"
  }'
```

#### 响应

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "queued",
  "validation_file": "file-abc123",
  "training_file": "file-abc123",
  "method": {
    "type": "supervised",
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
      }
    }
  },
  "metadata": null
}
```

### W&B 集成

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-abc123",
    "validation_file": "file-abc123",
    "model": "gpt-4o-mini",
    "integrations": [
      {
        "type": "wandb",
        "wandb": {
          "project": "my-wandb-project",
          "name": "ft-run-display-name"
          "tags": [
            "first-experiment", "v2"
          ]
        }
      }
    ]
  }'
```

#### 响应

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "queued",
  "validation_file": "file-abc123",
  "training_file": "file-abc123",
  "integrations": [
    {
      "type": "wandb",
      "wandb": {
        "project": "my-wandb-project",
        "entity": None,
        "run_id": "ftjob-abc123"
      }
    }
  ],
  "method": {
    "type": "supervised",
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
      }
    }
  },
  "metadata": null
}
```

## 列出微调作业

**get** `/fine_tuning/jobs`

列出你所在组织的微调作业

### 查询参数

- `after: optional string`

  上一次分页请求中最后一个作业的标识符。

- `limit: optional number`

  要检索的微调作业数量。

- `metadata: optional map[string] or null`

  可选的元数据过滤器。要使用过滤器，请使用语法 `metadata[k]=v`。或者，设置 `metadata=null` 以表示无元数据。

### 返回值

- `data: array of FineTuningJob`

  - `id: string`

    对象标识符，可在 API 端点中引用。

  - `created_at: number`

    创建微调作业时的 Unix 时间戳（以秒为单位）。

  - `error: object { code, message, param }  or null`

    对于已失败的微调作业 `failed`，此处将包含有关失败原因的更多信息。

    - `code: string`

      机器可读的错误代码。

    - `message: string`

      人类可读的错误消息。

    - `param: string or null`

      无效的参数，通常为 `training_file` 或 `validation_file`。如果失败与特定参数无关，此字段将为 null。

  - `fine_tuned_model: string or null`

    正在创建的微调模型的名称。如果微调作业仍在运行，此值将为 null。

  - `finished_at: number or null`

    微调作业完成时的 Unix 时间戳（以秒为单位）。如果微调作业仍在运行，此值将为 null。

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    用于微调作业的超参数。此值仅在运行 `supervised` 作业时返回。

    - `batch_size: optional "auto" or number or null`

      每个批次中的示例数量。较大的批次大小意味着模型参数
      更新的频率较低，但方差较小。

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      学习率的缩放因子。较小的学习率可能有助于避免
      过拟合。

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      训练模型的轮数。一个 epoch 指完整遍历训练数据集
      一次。

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    正在进行微调的基础模型。

  - `object: "fine_tuning.job"`

    对象类型，始终为 "fine_tuning.job"。

    - `"fine_tuning.job"`

  - `organization_id: string`

    拥有此微调作业的组织。

  - `result_files: array of string`

    微调作业的编译结果文件 ID。你可以通过以下方式检索结果： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `seed: number`

    微调作业使用的种子。

  - `status: "validating_files" or "queued" or "running" or 3 more`

    微调作业的当前状态，可以是 `validating_files`, `queued`, `running`, `succeeded`, `failed`，或 `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    此微调作业处理的可计费令牌总数。如果微调作业仍在运行，该值将为 null。

  - `training_file: string`

    用于训练的文件 ID。你可以通过以下方式检索训练数据： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `validation_file: string or null`

    用于验证的文件 ID。你可以通过以下方式检索验证结果： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `estimated_finish: optional number or null`

    微调作业预计完成的 Unix 时间戳（秒）。如果微调作业未在运行，该值将为 null。

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    为此微调作业启用的集成列表。

    - `type: "wandb"`

      为微调作业启用的集成类型

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      与 Weights and Biases 集成的设置。此负载指定了将
      指标发送到的项目。可选地，你可以为运行设置显式显示名称，添加标签
      到运行中，并设置要与运行关联的默认实体（团队、用户名等）。

      - `project: string`

        新运行将创建于的项目名称。

      - `entity: optional string or null`

        用于运行的实体。这允许你设置与运行关联的 WandB 用户的团队或用户名，
        如果未设置，则使用已注册的 WandB API 密钥的默认实体。

      - `name: optional string or null`

        为运行设置的显示名称。如果未设置，我们将使用作业 ID 作为名称。

      - `tags: optional array of string`

        要附加到新创建的运行的标签列表。这些标签直接传递给 WandB。部分
        默认标签由 OpenAI 生成："openai/finetune"、"openai/{base-model}"、"openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    可附加到对象上的 16 对键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `method: optional object { type, dpo, reinforcement, supervised }`

    用于微调的方法。

    - `type: "supervised" or "dpo" or "reinforcement"`

      方法的类型。可以是 `supervised`, `dpo`，或 `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      DPO 微调方法的配置。

      - `hyperparameters: optional DpoHyperparameters`

        用于 DPO 微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          DPO 方法的 beta 值。较高的 beta 值会增加策略模型和参考模型之间惩罚的权重。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      强化微调方法的配置。

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        用于微调作业的评分器。

        - `StringCheckGrader object { input, name, operation, 2 more }`

          一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

          - `input: string`

            输入文本。这可能包括模板字符串。

          - `name: string`

            评分器的名称。

          - `operation: "eq" or "ne" or "like" or "ilike"`

            要执行的字符串检查操作。以下之一 `eq`, `ne`, `like`，或 `ilike`.

            - `"eq"`

            - `"ne"`

            - `"like"`

            - `"ilike"`

          - `reference: string`

            参考文本。这可能包括模板字符串。

          - `type: "string_check"`

            对象类型，始终为 `string_check`.

            - `"string_check"`

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

          - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

            要使用的评估指标。以下之一 `cosine`, `fuzzy_match`, `bleu`,
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

            用作评分参考的文本。

          - `type: "text_similarity"`

            评分器的类型。

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

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

          一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

          - `input: array of object { content, role, type }`

            由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可能包括模板字符串。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

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

                  标记可重用提示前缀的精确结束位置。断点继承请求的 `prompt_cache_options.ttl`；TTL；边界不会四舍五入到令牌块。

                  - `mode: "explicit"`

                    断点模式。始终为 `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                模型的文本输出。

                - `text: string`

                  模型的文本输出。

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

                  发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                发送给模型的音频输入。

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64 编码的音频数据。

                  - `format: "mp3" or "wav"`

                    音频数据的格式。目前支持的格式为 `mp3` 和
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  输入项的类型。始终为 `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，每一项可以是输入文本、输出文本、输入
                图像或输入音频对象。

                - `TextInput = string`

                  发送给模型的文本输入。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  发送给模型的文本输入。

                - `OutputText object { text, type }`

                  模型的文本输出。

                  - `text: string`

                    模型的文本输出。

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

                    发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  发送给模型的音频输入。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。值为 `user`, `assistant`, `system`，或
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

            评分的范围。默认值为 `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            模型的采样参数。

            - `max_completions_tokens: optional number or null`

              评分模型在其响应中可生成的最大令牌数。

            - `reasoning_effort: optional ReasoningEffort or null`

              限制推理模型在推理上的投入。目前支持的
              值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
              降低推理投入可以加快响应速度并减少响应中用于推理的令牌
              数量。并非所有推理模型都支持每个
              值。请参阅
              [推理指南](https://platform.openai.com/docs/guides/reasoning)
              了解各模型的支持情况。

              - `"none"`

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

            - `seed: optional number or null`

              用于在采样期间初始化随机性的种子值。

            - `temperature: optional number or null`

              较高的温度会增加输出中的随机性。

            - `top_p: optional number or null`

              用于核采样的温度替代方案；1.0 包含所有令牌。

        - `MultiGrader object { calculate_output, graders, name, type }`

          MultiGrader 对象结合多个评分器的输出来生成单个分数。

          - `calculate_output: string`

            用于根据评分器结果计算输出的公式。

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

            - `StringCheckGrader object { input, name, operation, 2 more }`

              一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

            - `PythonGrader object { name, source, type, image_tag }`

              一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

            - `ScoreModelGrader object { input, model, name, 3 more }`

              一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

            - `LabelModelGrader object { input, labels, model, 3 more }`

              一个 LabelModelGrader 对象，它使用模型为每个项目分配标签
              在评估中。

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

                  - `TextInput = string`

                    发送给模型的文本输入。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    发送给模型的文本输入。

                  - `OutputText object { text, type }`

                    模型的文本输出。

                    - `text: string`

                      模型的文本输出。

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

                      发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    发送给模型的音频输入。

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    输入列表，每一项可以是输入文本、输出文本、输入
                    图像或输入音频对象。

                - `role: "user" or "assistant" or "system" or "developer"`

                  消息输入的角色。值为 `user`, `assistant`, `system`，或
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

      - `hyperparameters: optional ReinforcementHyperparameters`

        用于强化微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          训练期间用于探索搜索空间的计算量乘数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          评估运行之间的训练步数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_samples: optional "auto" or number`

          每个训练步生成的评估样本数量。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

        - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

          推理努力程度。

          - `"default"`

          - `"low"`

          - `"medium"`

          - `"high"`

    - `supervised: optional SupervisedMethod`

      监督微调方法的配置。

      - `hyperparameters: optional SupervisedHyperparameters`

        用于微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

- `has_more: boolean`

- `object: "list"`

  - `"list"`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "error": {
        "code": "code",
        "message": "message",
        "param": "param"
      },
      "fine_tuned_model": "fine_tuned_model",
      "finished_at": 0,
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      },
      "model": "model",
      "object": "fine_tuning.job",
      "organization_id": "organization_id",
      "result_files": [
        "file-abc123"
      ],
      "seed": 0,
      "status": "validating_files",
      "trained_tokens": 0,
      "training_file": "training_file",
      "validation_file": "validation_file",
      "estimated_finish": 0,
      "integrations": [
        {
          "type": "wandb",
          "wandb": {
            "project": "my-wandb-project",
            "entity": "entity",
            "name": "name",
            "tags": [
              "custom-tag"
            ]
          }
        }
      ],
      "metadata": {
        "foo": "string"
      },
      "method": {
        "type": "supervised",
        "dpo": {
          "hyperparameters": {
            "batch_size": "auto",
            "beta": "auto",
            "learning_rate_multiplier": "auto",
            "n_epochs": "auto"
          }
        },
        "reinforcement": {
          "grader": {
            "input": "input",
            "name": "name",
            "operation": "eq",
            "reference": "reference",
            "type": "string_check"
          },
          "hyperparameters": {
            "batch_size": "auto",
            "compute_multiplier": "auto",
            "eval_interval": "auto",
            "eval_samples": "auto",
            "learning_rate_multiplier": "auto",
            "n_epochs": "auto",
            "reasoning_effort": "default"
          }
        },
        "supervised": {
          "hyperparameters": {
            "batch_size": "auto",
            "learning_rate_multiplier": "auto",
            "n_epochs": "auto"
          }
        }
      }
    }
  ],
  "has_more": true,
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/jobs?limit=2&metadata[key]=value \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "object": "fine_tuning.job",
      "id": "ftjob-abc123",
      "model": "gpt-4o-mini-2024-07-18",
      "created_at": 1721764800,
      "fine_tuned_model": null,
      "organization_id": "org-123",
      "result_files": [],
      "status": "queued",
      "validation_file": null,
      "training_file": "file-abc123",
      "metadata": {
        "key": "value"
      }
    },
    { ... },
    { ... }
  ], "has_more": true
}
```

## 列出微调事件

**get** `/fine_tuning/jobs/{fine_tuning_job_id}/events`

获取微调作业的状态更新。

### 路径参数

- `fine_tuning_job_id: string`

### 查询参数

- `after: optional string`

  上一次分页请求中最后一个事件的标识符。

- `limit: optional number`

  要检索的事件数量。

### 返回值

- `data: array of FineTuningJobEvent`

  - `id: string`

    对象标识符。

  - `created_at: number`

    创建微调作业时的 Unix 时间戳（以秒为单位）。

  - `level: "info" or "warn" or "error"`

    事件的日志级别。

    - `"info"`

    - `"warn"`

    - `"error"`

  - `message: string`

    事件的消息。

  - `object: "fine_tuning.job.event"`

    对象类型，始终为 "fine_tuning.job.event"。

    - `"fine_tuning.job.event"`

  - `data: optional unknown`

    与该事件关联的数据。

  - `type: optional "message" or "metrics"`

    事件类型。

    - `"message"`

    - `"metrics"`

- `has_more: boolean`

- `object: "list"`

  - `"list"`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/jobs/$FINE_TUNING_JOB_ID/events \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "level": "info",
      "message": "message",
      "object": "fine_tuning.job.event",
      "data": {},
      "type": "message"
    }
  ],
  "has_more": true,
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/events \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "object": "fine_tuning.job.event",
      "id": "ft-event-ddTJfwuMVpfLXseO0Am0Gqjm",
      "created_at": 1721764800,
      "level": "info",
      "message": "Fine tuning job successfully completed",
      "data": null,
      "type": "message"
    },
    {
      "object": "fine_tuning.job.event",
      "id": "ft-event-tyiGuB72evQncpH87xe505Sv",
      "created_at": 1721764800,
      "level": "info",
      "message": "New fine-tuned model created: ft:gpt-4o-mini:openai::7p4lURel",
      "data": null,
      "type": "message"
    }
  ],
  "has_more": true
}
```

## 暂停微调

**post** `/fine_tuning/jobs/{fine_tuning_job_id}/pause`

暂停一个微调任务。

### 路径参数

- `fine_tuning_job_id: string`

### 返回值

- `FineTuningJob object { id, created_at, error, 16 more }`

  该 `fine_tuning.job` 对象表示一个已通过 API 创建的微调作业。

  - `id: string`

    对象标识符，可在 API 端点中引用。

  - `created_at: number`

    创建微调作业时的 Unix 时间戳（以秒为单位）。

  - `error: object { code, message, param }  or null`

    对于已失败的微调作业 `failed`，此处将包含有关失败原因的更多信息。

    - `code: string`

      机器可读的错误代码。

    - `message: string`

      人类可读的错误消息。

    - `param: string or null`

      无效的参数，通常为 `training_file` 或 `validation_file`。如果失败与特定参数无关，此字段将为 null。

  - `fine_tuned_model: string or null`

    正在创建的微调模型的名称。如果微调作业仍在运行，此值将为 null。

  - `finished_at: number or null`

    微调作业完成时的 Unix 时间戳（以秒为单位）。如果微调作业仍在运行，此值将为 null。

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    用于微调作业的超参数。此值仅在运行 `supervised` 作业时返回。

    - `batch_size: optional "auto" or number or null`

      每个批次中的示例数量。较大的批次大小意味着模型参数
      更新的频率较低，但方差较小。

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      学习率的缩放因子。较小的学习率可能有助于避免
      过拟合。

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      训练模型的轮数。一个 epoch 指完整遍历训练数据集
      一次。

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    正在进行微调的基础模型。

  - `object: "fine_tuning.job"`

    对象类型，始终为 "fine_tuning.job"。

    - `"fine_tuning.job"`

  - `organization_id: string`

    拥有此微调作业的组织。

  - `result_files: array of string`

    微调作业的编译结果文件 ID。你可以通过以下方式检索结果： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `seed: number`

    微调作业使用的种子。

  - `status: "validating_files" or "queued" or "running" or 3 more`

    微调作业的当前状态，可以是 `validating_files`, `queued`, `running`, `succeeded`, `failed`，或 `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    此微调作业处理的可计费令牌总数。如果微调作业仍在运行，该值将为 null。

  - `training_file: string`

    用于训练的文件 ID。你可以通过以下方式检索训练数据： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `validation_file: string or null`

    用于验证的文件 ID。你可以通过以下方式检索验证结果： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `estimated_finish: optional number or null`

    微调作业预计完成的 Unix 时间戳（秒）。如果微调作业未在运行，该值将为 null。

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    为此微调作业启用的集成列表。

    - `type: "wandb"`

      为微调作业启用的集成类型

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      与 Weights and Biases 集成的设置。此负载指定了将
      指标发送到的项目。可选地，你可以为运行设置显式显示名称，添加标签
      到运行中，并设置要与运行关联的默认实体（团队、用户名等）。

      - `project: string`

        新运行将创建于的项目名称。

      - `entity: optional string or null`

        用于运行的实体。这允许你设置与运行关联的 WandB 用户的团队或用户名，
        如果未设置，则使用已注册的 WandB API 密钥的默认实体。

      - `name: optional string or null`

        为运行设置的显示名称。如果未设置，我们将使用作业 ID 作为名称。

      - `tags: optional array of string`

        要附加到新创建的运行的标签列表。这些标签直接传递给 WandB。部分
        默认标签由 OpenAI 生成："openai/finetune"、"openai/{base-model}"、"openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    可附加到对象上的 16 对键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `method: optional object { type, dpo, reinforcement, supervised }`

    用于微调的方法。

    - `type: "supervised" or "dpo" or "reinforcement"`

      方法的类型。可以是 `supervised`, `dpo`，或 `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      DPO 微调方法的配置。

      - `hyperparameters: optional DpoHyperparameters`

        用于 DPO 微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          DPO 方法的 beta 值。较高的 beta 值会增加策略模型和参考模型之间惩罚的权重。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      强化微调方法的配置。

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        用于微调作业的评分器。

        - `StringCheckGrader object { input, name, operation, 2 more }`

          一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

          - `input: string`

            输入文本。这可能包括模板字符串。

          - `name: string`

            评分器的名称。

          - `operation: "eq" or "ne" or "like" or "ilike"`

            要执行的字符串检查操作。以下之一 `eq`, `ne`, `like`，或 `ilike`.

            - `"eq"`

            - `"ne"`

            - `"like"`

            - `"ilike"`

          - `reference: string`

            参考文本。这可能包括模板字符串。

          - `type: "string_check"`

            对象类型，始终为 `string_check`.

            - `"string_check"`

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

          - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

            要使用的评估指标。以下之一 `cosine`, `fuzzy_match`, `bleu`,
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

            用作评分参考的文本。

          - `type: "text_similarity"`

            评分器的类型。

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

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

          一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

          - `input: array of object { content, role, type }`

            由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可能包括模板字符串。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

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

                  标记可重用提示前缀的精确结束位置。断点继承请求的 `prompt_cache_options.ttl`；TTL；边界不会四舍五入到令牌块。

                  - `mode: "explicit"`

                    断点模式。始终为 `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                模型的文本输出。

                - `text: string`

                  模型的文本输出。

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

                  发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                发送给模型的音频输入。

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64 编码的音频数据。

                  - `format: "mp3" or "wav"`

                    音频数据的格式。目前支持的格式为 `mp3` 和
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  输入项的类型。始终为 `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，每一项可以是输入文本、输出文本、输入
                图像或输入音频对象。

                - `TextInput = string`

                  发送给模型的文本输入。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  发送给模型的文本输入。

                - `OutputText object { text, type }`

                  模型的文本输出。

                  - `text: string`

                    模型的文本输出。

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

                    发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  发送给模型的音频输入。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。值为 `user`, `assistant`, `system`，或
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

            评分的范围。默认值为 `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            模型的采样参数。

            - `max_completions_tokens: optional number or null`

              评分模型在其响应中可生成的最大令牌数。

            - `reasoning_effort: optional ReasoningEffort or null`

              限制推理模型在推理上的投入。目前支持的
              值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
              降低推理投入可以加快响应速度并减少响应中用于推理的令牌
              数量。并非所有推理模型都支持每个
              值。请参阅
              [推理指南](https://platform.openai.com/docs/guides/reasoning)
              了解各模型的支持情况。

              - `"none"`

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

            - `seed: optional number or null`

              用于在采样期间初始化随机性的种子值。

            - `temperature: optional number or null`

              较高的温度会增加输出中的随机性。

            - `top_p: optional number or null`

              用于核采样的温度替代方案；1.0 包含所有令牌。

        - `MultiGrader object { calculate_output, graders, name, type }`

          MultiGrader 对象结合多个评分器的输出来生成单个分数。

          - `calculate_output: string`

            用于根据评分器结果计算输出的公式。

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

            - `StringCheckGrader object { input, name, operation, 2 more }`

              一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

            - `PythonGrader object { name, source, type, image_tag }`

              一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

            - `ScoreModelGrader object { input, model, name, 3 more }`

              一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

            - `LabelModelGrader object { input, labels, model, 3 more }`

              一个 LabelModelGrader 对象，它使用模型为每个项目分配标签
              在评估中。

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

                  - `TextInput = string`

                    发送给模型的文本输入。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    发送给模型的文本输入。

                  - `OutputText object { text, type }`

                    模型的文本输出。

                    - `text: string`

                      模型的文本输出。

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

                      发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    发送给模型的音频输入。

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    输入列表，每一项可以是输入文本、输出文本、输入
                    图像或输入音频对象。

                - `role: "user" or "assistant" or "system" or "developer"`

                  消息输入的角色。值为 `user`, `assistant`, `system`，或
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

      - `hyperparameters: optional ReinforcementHyperparameters`

        用于强化微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          训练期间用于探索搜索空间的计算量乘数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          评估运行之间的训练步数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_samples: optional "auto" or number`

          每个训练步生成的评估样本数量。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

        - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

          推理努力程度。

          - `"default"`

          - `"low"`

          - `"medium"`

          - `"high"`

    - `supervised: optional SupervisedMethod`

      监督微调方法的配置。

      - `hyperparameters: optional SupervisedHyperparameters`

        用于微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/jobs/$FINE_TUNING_JOB_ID/pause \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "error": {
    "code": "code",
    "message": "message",
    "param": "param"
  },
  "fine_tuned_model": "fine_tuned_model",
  "finished_at": 0,
  "hyperparameters": {
    "batch_size": "auto",
    "learning_rate_multiplier": "auto",
    "n_epochs": "auto"
  },
  "model": "model",
  "object": "fine_tuning.job",
  "organization_id": "organization_id",
  "result_files": [
    "file-abc123"
  ],
  "seed": 0,
  "status": "validating_files",
  "trained_tokens": 0,
  "training_file": "training_file",
  "validation_file": "validation_file",
  "estimated_finish": 0,
  "integrations": [
    {
      "type": "wandb",
      "wandb": {
        "project": "my-wandb-project",
        "entity": "entity",
        "name": "name",
        "tags": [
          "custom-tag"
        ]
      }
    }
  ],
  "metadata": {
    "foo": "string"
  },
  "method": {
    "type": "supervised",
    "dpo": {
      "hyperparameters": {
        "batch_size": "auto",
        "beta": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    },
    "reinforcement": {
      "grader": {
        "input": "input",
        "name": "name",
        "operation": "eq",
        "reference": "reference",
        "type": "string_check"
      },
      "hyperparameters": {
        "batch_size": "auto",
        "compute_multiplier": "auto",
        "eval_interval": "auto",
        "eval_samples": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
        "reasoning_effort": "default"
      }
    },
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    }
  }
}
```

### 示例

```http
curl -X POST https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/pause \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "paused",
  "validation_file": "file-abc123",
  "training_file": "file-abc123"
}
```

## 恢复微调

**post** `/fine_tuning/jobs/{fine_tuning_job_id}/resume`

恢复微调作业。

### 路径参数

- `fine_tuning_job_id: string`

### 返回值

- `FineTuningJob object { id, created_at, error, 16 more }`

  该 `fine_tuning.job` 对象表示一个已通过 API 创建的微调作业。

  - `id: string`

    对象标识符，可在 API 端点中引用。

  - `created_at: number`

    创建微调作业时的 Unix 时间戳（以秒为单位）。

  - `error: object { code, message, param }  or null`

    对于已失败的微调作业 `failed`，此处将包含有关失败原因的更多信息。

    - `code: string`

      机器可读的错误代码。

    - `message: string`

      人类可读的错误消息。

    - `param: string or null`

      无效的参数，通常为 `training_file` 或 `validation_file`。如果失败与特定参数无关，此字段将为 null。

  - `fine_tuned_model: string or null`

    正在创建的微调模型的名称。如果微调作业仍在运行，此值将为 null。

  - `finished_at: number or null`

    微调作业完成时的 Unix 时间戳（以秒为单位）。如果微调作业仍在运行，此值将为 null。

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    用于微调作业的超参数。此值仅在运行 `supervised` 作业时返回。

    - `batch_size: optional "auto" or number or null`

      每个批次中的示例数量。较大的批次大小意味着模型参数
      更新的频率较低，但方差较小。

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      学习率的缩放因子。较小的学习率可能有助于避免
      过拟合。

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      训练模型的轮数。一个 epoch 指完整遍历训练数据集
      一次。

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    正在进行微调的基础模型。

  - `object: "fine_tuning.job"`

    对象类型，始终为 "fine_tuning.job"。

    - `"fine_tuning.job"`

  - `organization_id: string`

    拥有此微调作业的组织。

  - `result_files: array of string`

    微调作业的编译结果文件 ID。你可以通过以下方式检索结果： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `seed: number`

    微调作业使用的种子。

  - `status: "validating_files" or "queued" or "running" or 3 more`

    微调作业的当前状态，可以是 `validating_files`, `queued`, `running`, `succeeded`, `failed`，或 `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    此微调作业处理的可计费令牌总数。如果微调作业仍在运行，该值将为 null。

  - `training_file: string`

    用于训练的文件 ID。你可以通过以下方式检索训练数据： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `validation_file: string or null`

    用于验证的文件 ID。你可以通过以下方式检索验证结果： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `estimated_finish: optional number or null`

    微调作业预计完成的 Unix 时间戳（秒）。如果微调作业未在运行，该值将为 null。

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    为此微调作业启用的集成列表。

    - `type: "wandb"`

      为微调作业启用的集成类型

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      与 Weights and Biases 集成的设置。此负载指定了将
      指标发送到的项目。可选地，你可以为运行设置显式显示名称，添加标签
      到运行中，并设置要与运行关联的默认实体（团队、用户名等）。

      - `project: string`

        新运行将创建于的项目名称。

      - `entity: optional string or null`

        用于运行的实体。这允许你设置与运行关联的 WandB 用户的团队或用户名，
        如果未设置，则使用已注册的 WandB API 密钥的默认实体。

      - `name: optional string or null`

        为运行设置的显示名称。如果未设置，我们将使用作业 ID 作为名称。

      - `tags: optional array of string`

        要附加到新创建的运行的标签列表。这些标签直接传递给 WandB。部分
        默认标签由 OpenAI 生成："openai/finetune"、"openai/{base-model}"、"openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    可附加到对象上的 16 对键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `method: optional object { type, dpo, reinforcement, supervised }`

    用于微调的方法。

    - `type: "supervised" or "dpo" or "reinforcement"`

      方法的类型。可以是 `supervised`, `dpo`，或 `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      DPO 微调方法的配置。

      - `hyperparameters: optional DpoHyperparameters`

        用于 DPO 微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          DPO 方法的 beta 值。较高的 beta 值会增加策略模型和参考模型之间惩罚的权重。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      强化微调方法的配置。

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        用于微调作业的评分器。

        - `StringCheckGrader object { input, name, operation, 2 more }`

          一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

          - `input: string`

            输入文本。这可能包括模板字符串。

          - `name: string`

            评分器的名称。

          - `operation: "eq" or "ne" or "like" or "ilike"`

            要执行的字符串检查操作。以下之一 `eq`, `ne`, `like`，或 `ilike`.

            - `"eq"`

            - `"ne"`

            - `"like"`

            - `"ilike"`

          - `reference: string`

            参考文本。这可能包括模板字符串。

          - `type: "string_check"`

            对象类型，始终为 `string_check`.

            - `"string_check"`

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

          - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

            要使用的评估指标。以下之一 `cosine`, `fuzzy_match`, `bleu`,
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

            用作评分参考的文本。

          - `type: "text_similarity"`

            评分器的类型。

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

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

          一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

          - `input: array of object { content, role, type }`

            由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可能包括模板字符串。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

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

                  标记可重用提示前缀的精确结束位置。断点继承请求的 `prompt_cache_options.ttl`；TTL；边界不会四舍五入到令牌块。

                  - `mode: "explicit"`

                    断点模式。始终为 `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                模型的文本输出。

                - `text: string`

                  模型的文本输出。

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

                  发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                发送给模型的音频输入。

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64 编码的音频数据。

                  - `format: "mp3" or "wav"`

                    音频数据的格式。目前支持的格式为 `mp3` 和
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  输入项的类型。始终为 `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，每一项可以是输入文本、输出文本、输入
                图像或输入音频对象。

                - `TextInput = string`

                  发送给模型的文本输入。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  发送给模型的文本输入。

                - `OutputText object { text, type }`

                  模型的文本输出。

                  - `text: string`

                    模型的文本输出。

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

                    发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  发送给模型的音频输入。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。值为 `user`, `assistant`, `system`，或
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

            评分的范围。默认值为 `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            模型的采样参数。

            - `max_completions_tokens: optional number or null`

              评分模型在其响应中可生成的最大令牌数。

            - `reasoning_effort: optional ReasoningEffort or null`

              限制推理模型在推理上的投入。目前支持的
              值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
              降低推理投入可以加快响应速度并减少响应中用于推理的令牌
              数量。并非所有推理模型都支持每个
              值。请参阅
              [推理指南](https://platform.openai.com/docs/guides/reasoning)
              了解各模型的支持情况。

              - `"none"`

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

            - `seed: optional number or null`

              用于在采样期间初始化随机性的种子值。

            - `temperature: optional number or null`

              较高的温度会增加输出中的随机性。

            - `top_p: optional number or null`

              用于核采样的温度替代方案；1.0 包含所有令牌。

        - `MultiGrader object { calculate_output, graders, name, type }`

          MultiGrader 对象结合多个评分器的输出来生成单个分数。

          - `calculate_output: string`

            用于根据评分器结果计算输出的公式。

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

            - `StringCheckGrader object { input, name, operation, 2 more }`

              一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

            - `PythonGrader object { name, source, type, image_tag }`

              一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

            - `ScoreModelGrader object { input, model, name, 3 more }`

              一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

            - `LabelModelGrader object { input, labels, model, 3 more }`

              一个 LabelModelGrader 对象，它使用模型为每个项目分配标签
              在评估中。

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

                  - `TextInput = string`

                    发送给模型的文本输入。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    发送给模型的文本输入。

                  - `OutputText object { text, type }`

                    模型的文本输出。

                    - `text: string`

                      模型的文本输出。

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

                      发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    发送给模型的音频输入。

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    输入列表，每一项可以是输入文本、输出文本、输入
                    图像或输入音频对象。

                - `role: "user" or "assistant" or "system" or "developer"`

                  消息输入的角色。值为 `user`, `assistant`, `system`，或
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

      - `hyperparameters: optional ReinforcementHyperparameters`

        用于强化微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          训练期间用于探索搜索空间的计算量乘数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          评估运行之间的训练步数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_samples: optional "auto" or number`

          每个训练步生成的评估样本数量。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

        - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

          推理努力程度。

          - `"default"`

          - `"low"`

          - `"medium"`

          - `"high"`

    - `supervised: optional SupervisedMethod`

      监督微调方法的配置。

      - `hyperparameters: optional SupervisedHyperparameters`

        用于微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/jobs/$FINE_TUNING_JOB_ID/resume \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "error": {
    "code": "code",
    "message": "message",
    "param": "param"
  },
  "fine_tuned_model": "fine_tuned_model",
  "finished_at": 0,
  "hyperparameters": {
    "batch_size": "auto",
    "learning_rate_multiplier": "auto",
    "n_epochs": "auto"
  },
  "model": "model",
  "object": "fine_tuning.job",
  "organization_id": "organization_id",
  "result_files": [
    "file-abc123"
  ],
  "seed": 0,
  "status": "validating_files",
  "trained_tokens": 0,
  "training_file": "training_file",
  "validation_file": "validation_file",
  "estimated_finish": 0,
  "integrations": [
    {
      "type": "wandb",
      "wandb": {
        "project": "my-wandb-project",
        "entity": "entity",
        "name": "name",
        "tags": [
          "custom-tag"
        ]
      }
    }
  ],
  "metadata": {
    "foo": "string"
  },
  "method": {
    "type": "supervised",
    "dpo": {
      "hyperparameters": {
        "batch_size": "auto",
        "beta": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    },
    "reinforcement": {
      "grader": {
        "input": "input",
        "name": "name",
        "operation": "eq",
        "reference": "reference",
        "type": "string_check"
      },
      "hyperparameters": {
        "batch_size": "auto",
        "compute_multiplier": "auto",
        "eval_interval": "auto",
        "eval_samples": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
        "reasoning_effort": "default"
      }
    },
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    }
  }
}
```

### 示例

```http
curl -X POST https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/resume \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "queued",
  "validation_file": "file-abc123",
  "training_file": "file-abc123"
}
```

## 检索微调作业

**get** `/fine_tuning/jobs/{fine_tuning_job_id}`

获取有关微调作业的信息。

[了解更多关于微调的信息](/docs/guides/model-optimization)

### 路径参数

- `fine_tuning_job_id: string`

### 返回值

- `FineTuningJob object { id, created_at, error, 16 more }`

  该 `fine_tuning.job` 对象表示一个已通过 API 创建的微调作业。

  - `id: string`

    对象标识符，可在 API 端点中引用。

  - `created_at: number`

    创建微调作业时的 Unix 时间戳（以秒为单位）。

  - `error: object { code, message, param }  or null`

    对于已失败的微调作业 `failed`，此处将包含有关失败原因的更多信息。

    - `code: string`

      机器可读的错误代码。

    - `message: string`

      人类可读的错误消息。

    - `param: string or null`

      无效的参数，通常为 `training_file` 或 `validation_file`。如果失败与特定参数无关，此字段将为 null。

  - `fine_tuned_model: string or null`

    正在创建的微调模型的名称。如果微调作业仍在运行，此值将为 null。

  - `finished_at: number or null`

    微调作业完成时的 Unix 时间戳（以秒为单位）。如果微调作业仍在运行，此值将为 null。

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    用于微调作业的超参数。此值仅在运行 `supervised` 作业时返回。

    - `batch_size: optional "auto" or number or null`

      每个批次中的示例数量。较大的批次大小意味着模型参数
      更新的频率较低，但方差较小。

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      学习率的缩放因子。较小的学习率可能有助于避免
      过拟合。

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      训练模型的轮数。一个 epoch 指完整遍历训练数据集
      一次。

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    正在进行微调的基础模型。

  - `object: "fine_tuning.job"`

    对象类型，始终为 "fine_tuning.job"。

    - `"fine_tuning.job"`

  - `organization_id: string`

    拥有此微调作业的组织。

  - `result_files: array of string`

    微调作业的编译结果文件 ID。你可以通过以下方式检索结果： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `seed: number`

    微调作业使用的种子。

  - `status: "validating_files" or "queued" or "running" or 3 more`

    微调作业的当前状态，可以是 `validating_files`, `queued`, `running`, `succeeded`, `failed`，或 `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    此微调作业处理的可计费令牌总数。如果微调作业仍在运行，该值将为 null。

  - `training_file: string`

    用于训练的文件 ID。你可以通过以下方式检索训练数据： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `validation_file: string or null`

    用于验证的文件 ID。你可以通过以下方式检索验证结果： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `estimated_finish: optional number or null`

    微调作业预计完成的 Unix 时间戳（秒）。如果微调作业未在运行，该值将为 null。

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    为此微调作业启用的集成列表。

    - `type: "wandb"`

      为微调作业启用的集成类型

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      与 Weights and Biases 集成的设置。此负载指定了将
      指标发送到的项目。可选地，你可以为运行设置显式显示名称，添加标签
      到运行中，并设置要与运行关联的默认实体（团队、用户名等）。

      - `project: string`

        新运行将创建于的项目名称。

      - `entity: optional string or null`

        用于运行的实体。这允许你设置与运行关联的 WandB 用户的团队或用户名，
        如果未设置，则使用已注册的 WandB API 密钥的默认实体。

      - `name: optional string or null`

        为运行设置的显示名称。如果未设置，我们将使用作业 ID 作为名称。

      - `tags: optional array of string`

        要附加到新创建的运行的标签列表。这些标签直接传递给 WandB。部分
        默认标签由 OpenAI 生成："openai/finetune"、"openai/{base-model}"、"openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    可附加到对象上的 16 对键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `method: optional object { type, dpo, reinforcement, supervised }`

    用于微调的方法。

    - `type: "supervised" or "dpo" or "reinforcement"`

      方法的类型。可以是 `supervised`, `dpo`，或 `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      DPO 微调方法的配置。

      - `hyperparameters: optional DpoHyperparameters`

        用于 DPO 微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          DPO 方法的 beta 值。较高的 beta 值会增加策略模型和参考模型之间惩罚的权重。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      强化微调方法的配置。

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        用于微调作业的评分器。

        - `StringCheckGrader object { input, name, operation, 2 more }`

          一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

          - `input: string`

            输入文本。这可能包括模板字符串。

          - `name: string`

            评分器的名称。

          - `operation: "eq" or "ne" or "like" or "ilike"`

            要执行的字符串检查操作。以下之一 `eq`, `ne`, `like`，或 `ilike`.

            - `"eq"`

            - `"ne"`

            - `"like"`

            - `"ilike"`

          - `reference: string`

            参考文本。这可能包括模板字符串。

          - `type: "string_check"`

            对象类型，始终为 `string_check`.

            - `"string_check"`

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

          - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

            要使用的评估指标。以下之一 `cosine`, `fuzzy_match`, `bleu`,
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

            用作评分参考的文本。

          - `type: "text_similarity"`

            评分器的类型。

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

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

          一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

          - `input: array of object { content, role, type }`

            由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可能包括模板字符串。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

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

                  标记可重用提示前缀的精确结束位置。断点继承请求的 `prompt_cache_options.ttl`；TTL；边界不会四舍五入到令牌块。

                  - `mode: "explicit"`

                    断点模式。始终为 `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                模型的文本输出。

                - `text: string`

                  模型的文本输出。

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

                  发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                发送给模型的音频输入。

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64 编码的音频数据。

                  - `format: "mp3" or "wav"`

                    音频数据的格式。目前支持的格式为 `mp3` 和
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  输入项的类型。始终为 `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，每一项可以是输入文本、输出文本、输入
                图像或输入音频对象。

                - `TextInput = string`

                  发送给模型的文本输入。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  发送给模型的文本输入。

                - `OutputText object { text, type }`

                  模型的文本输出。

                  - `text: string`

                    模型的文本输出。

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

                    发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  发送给模型的音频输入。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。值为 `user`, `assistant`, `system`，或
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

            评分的范围。默认值为 `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            模型的采样参数。

            - `max_completions_tokens: optional number or null`

              评分模型在其响应中可生成的最大令牌数。

            - `reasoning_effort: optional ReasoningEffort or null`

              限制推理模型在推理上的投入。目前支持的
              值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
              降低推理投入可以加快响应速度并减少响应中用于推理的令牌
              数量。并非所有推理模型都支持每个
              值。请参阅
              [推理指南](https://platform.openai.com/docs/guides/reasoning)
              了解各模型的支持情况。

              - `"none"`

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

            - `seed: optional number or null`

              用于在采样期间初始化随机性的种子值。

            - `temperature: optional number or null`

              较高的温度会增加输出中的随机性。

            - `top_p: optional number or null`

              用于核采样的温度替代方案；1.0 包含所有令牌。

        - `MultiGrader object { calculate_output, graders, name, type }`

          MultiGrader 对象结合多个评分器的输出来生成单个分数。

          - `calculate_output: string`

            用于根据评分器结果计算输出的公式。

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

            - `StringCheckGrader object { input, name, operation, 2 more }`

              一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

            - `PythonGrader object { name, source, type, image_tag }`

              一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

            - `ScoreModelGrader object { input, model, name, 3 more }`

              一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

            - `LabelModelGrader object { input, labels, model, 3 more }`

              一个 LabelModelGrader 对象，它使用模型为每个项目分配标签
              在评估中。

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

                  - `TextInput = string`

                    发送给模型的文本输入。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    发送给模型的文本输入。

                  - `OutputText object { text, type }`

                    模型的文本输出。

                    - `text: string`

                      模型的文本输出。

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

                      发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    发送给模型的音频输入。

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    输入列表，每一项可以是输入文本、输出文本、输入
                    图像或输入音频对象。

                - `role: "user" or "assistant" or "system" or "developer"`

                  消息输入的角色。值为 `user`, `assistant`, `system`，或
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

      - `hyperparameters: optional ReinforcementHyperparameters`

        用于强化微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          训练期间用于探索搜索空间的计算量乘数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          评估运行之间的训练步数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_samples: optional "auto" or number`

          每个训练步生成的评估样本数量。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

        - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

          推理努力程度。

          - `"default"`

          - `"low"`

          - `"medium"`

          - `"high"`

    - `supervised: optional SupervisedMethod`

      监督微调方法的配置。

      - `hyperparameters: optional SupervisedHyperparameters`

        用于微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/jobs/$FINE_TUNING_JOB_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "error": {
    "code": "code",
    "message": "message",
    "param": "param"
  },
  "fine_tuned_model": "fine_tuned_model",
  "finished_at": 0,
  "hyperparameters": {
    "batch_size": "auto",
    "learning_rate_multiplier": "auto",
    "n_epochs": "auto"
  },
  "model": "model",
  "object": "fine_tuning.job",
  "organization_id": "organization_id",
  "result_files": [
    "file-abc123"
  ],
  "seed": 0,
  "status": "validating_files",
  "trained_tokens": 0,
  "training_file": "training_file",
  "validation_file": "validation_file",
  "estimated_finish": 0,
  "integrations": [
    {
      "type": "wandb",
      "wandb": {
        "project": "my-wandb-project",
        "entity": "entity",
        "name": "name",
        "tags": [
          "custom-tag"
        ]
      }
    }
  ],
  "metadata": {
    "foo": "string"
  },
  "method": {
    "type": "supervised",
    "dpo": {
      "hyperparameters": {
        "batch_size": "auto",
        "beta": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    },
    "reinforcement": {
      "grader": {
        "input": "input",
        "name": "name",
        "operation": "eq",
        "reference": "reference",
        "type": "string_check"
      },
      "hyperparameters": {
        "batch_size": "auto",
        "compute_multiplier": "auto",
        "eval_interval": "auto",
        "eval_samples": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
        "reasoning_effort": "default"
      }
    },
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    }
  }
}
```

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/jobs/ft-AF1WoRqd3aJAHsqc9NY7iL8F \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "davinci-002",
  "created_at": 1692661014,
  "finished_at": 1692661190,
  "fine_tuned_model": "ft:davinci-002:my-org:custom_suffix:7q8mpxmy",
  "organization_id": "org-123",
  "result_files": [
      "file-abc123"
  ],
  "status": "succeeded",
  "validation_file": null,
  "training_file": "file-abc123",
  "hyperparameters": {
      "n_epochs": 4,
      "batch_size": 1,
      "learning_rate_multiplier": 1.0
  },
  "trained_tokens": 5768,
  "integrations": [],
  "seed": 0,
  "estimated_finish": 0,
  "method": {
    "type": "supervised",
    "supervised": {
      "hyperparameters": {
        "n_epochs": 4,
        "batch_size": 1,
        "learning_rate_multiplier": 1.0
      }
    }
  }
}
```

## 领域类型

### 微调任务

- `FineTuningJob object { id, created_at, error, 16 more }`

  该 `fine_tuning.job` 对象表示一个已通过 API 创建的微调作业。

  - `id: string`

    对象标识符，可在 API 端点中引用。

  - `created_at: number`

    创建微调作业时的 Unix 时间戳（以秒为单位）。

  - `error: object { code, message, param }  or null`

    对于已失败的微调作业 `failed`，此处将包含有关失败原因的更多信息。

    - `code: string`

      机器可读的错误代码。

    - `message: string`

      人类可读的错误消息。

    - `param: string or null`

      无效的参数，通常为 `training_file` 或 `validation_file`。如果失败与特定参数无关，此字段将为 null。

  - `fine_tuned_model: string or null`

    正在创建的微调模型的名称。如果微调作业仍在运行，此值将为 null。

  - `finished_at: number or null`

    微调作业完成时的 Unix 时间戳（以秒为单位）。如果微调作业仍在运行，此值将为 null。

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    用于微调作业的超参数。此值仅在运行 `supervised` 作业时返回。

    - `batch_size: optional "auto" or number or null`

      每个批次中的示例数量。较大的批次大小意味着模型参数
      更新的频率较低，但方差较小。

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      学习率的缩放因子。较小的学习率可能有助于避免
      过拟合。

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      训练模型的轮数。一个 epoch 指完整遍历训练数据集
      一次。

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    正在进行微调的基础模型。

  - `object: "fine_tuning.job"`

    对象类型，始终为 "fine_tuning.job"。

    - `"fine_tuning.job"`

  - `organization_id: string`

    拥有此微调作业的组织。

  - `result_files: array of string`

    微调作业的编译结果文件 ID。你可以通过以下方式检索结果： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `seed: number`

    微调作业使用的种子。

  - `status: "validating_files" or "queued" or "running" or 3 more`

    微调作业的当前状态，可以是 `validating_files`, `queued`, `running`, `succeeded`, `failed`，或 `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    此微调作业处理的可计费令牌总数。如果微调作业仍在运行，该值将为 null。

  - `training_file: string`

    用于训练的文件 ID。你可以通过以下方式检索训练数据： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `validation_file: string or null`

    用于验证的文件 ID。你可以通过以下方式检索验证结果： [文件 API](/docs/api-reference/files/retrieve-contents).

  - `estimated_finish: optional number or null`

    微调作业预计完成的 Unix 时间戳（秒）。如果微调作业未在运行，该值将为 null。

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    为此微调作业启用的集成列表。

    - `type: "wandb"`

      为微调作业启用的集成类型

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      与 Weights and Biases 集成的设置。此负载指定了将
      指标发送到的项目。可选地，你可以为运行设置显式显示名称，添加标签
      到运行中，并设置要与运行关联的默认实体（团队、用户名等）。

      - `project: string`

        新运行将创建于的项目名称。

      - `entity: optional string or null`

        用于运行的实体。这允许你设置与运行关联的 WandB 用户的团队或用户名，
        如果未设置，则使用已注册的 WandB API 密钥的默认实体。

      - `name: optional string or null`

        为运行设置的显示名称。如果未设置，我们将使用作业 ID 作为名称。

      - `tags: optional array of string`

        要附加到新创建的运行的标签列表。这些标签直接传递给 WandB。部分
        默认标签由 OpenAI 生成："openai/finetune"、"openai/{base-model}"、"openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    可附加到对象上的 16 对键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `method: optional object { type, dpo, reinforcement, supervised }`

    用于微调的方法。

    - `type: "supervised" or "dpo" or "reinforcement"`

      方法的类型。可以是 `supervised`, `dpo`，或 `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      DPO 微调方法的配置。

      - `hyperparameters: optional DpoHyperparameters`

        用于 DPO 微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          DPO 方法的 beta 值。较高的 beta 值会增加策略模型和参考模型之间惩罚的权重。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      强化微调方法的配置。

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        用于微调作业的评分器。

        - `StringCheckGrader object { input, name, operation, 2 more }`

          一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

          - `input: string`

            输入文本。这可能包括模板字符串。

          - `name: string`

            评分器的名称。

          - `operation: "eq" or "ne" or "like" or "ilike"`

            要执行的字符串检查操作。以下之一 `eq`, `ne`, `like`，或 `ilike`.

            - `"eq"`

            - `"ne"`

            - `"like"`

            - `"ilike"`

          - `reference: string`

            参考文本。这可能包括模板字符串。

          - `type: "string_check"`

            对象类型，始终为 `string_check`.

            - `"string_check"`

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

          - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

            要使用的评估指标。以下之一 `cosine`, `fuzzy_match`, `bleu`,
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

            用作评分参考的文本。

          - `type: "text_similarity"`

            评分器的类型。

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

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

          一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

          - `input: array of object { content, role, type }`

            由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可能包括模板字符串。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

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

                  标记可重用提示前缀的精确结束位置。断点继承请求的 `prompt_cache_options.ttl`；TTL；边界不会四舍五入到令牌块。

                  - `mode: "explicit"`

                    断点模式。始终为 `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                模型的文本输出。

                - `text: string`

                  模型的文本输出。

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

                  发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                发送给模型的音频输入。

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64 编码的音频数据。

                  - `format: "mp3" or "wav"`

                    音频数据的格式。目前支持的格式为 `mp3` 和
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  输入项的类型。始终为 `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，每一项可以是输入文本、输出文本、输入
                图像或输入音频对象。

                - `TextInput = string`

                  发送给模型的文本输入。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  发送给模型的文本输入。

                - `OutputText object { text, type }`

                  模型的文本输出。

                  - `text: string`

                    模型的文本输出。

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

                    发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  发送给模型的音频输入。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。值为 `user`, `assistant`, `system`，或
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

            评分的范围。默认值为 `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            模型的采样参数。

            - `max_completions_tokens: optional number or null`

              评分模型在其响应中可生成的最大令牌数。

            - `reasoning_effort: optional ReasoningEffort or null`

              限制推理模型在推理上的投入。目前支持的
              值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
              降低推理投入可以加快响应速度并减少响应中用于推理的令牌
              数量。并非所有推理模型都支持每个
              值。请参阅
              [推理指南](https://platform.openai.com/docs/guides/reasoning)
              了解各模型的支持情况。

              - `"none"`

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

            - `seed: optional number or null`

              用于在采样期间初始化随机性的种子值。

            - `temperature: optional number or null`

              较高的温度会增加输出中的随机性。

            - `top_p: optional number or null`

              用于核采样的温度替代方案；1.0 包含所有令牌。

        - `MultiGrader object { calculate_output, graders, name, type }`

          MultiGrader 对象结合多个评分器的输出来生成单个分数。

          - `calculate_output: string`

            用于根据评分器结果计算输出的公式。

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

            - `StringCheckGrader object { input, name, operation, 2 more }`

              一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

            - `PythonGrader object { name, source, type, image_tag }`

              一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

            - `ScoreModelGrader object { input, model, name, 3 more }`

              一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

            - `LabelModelGrader object { input, labels, model, 3 more }`

              一个 LabelModelGrader 对象，它使用模型为每个项目分配标签
              在评估中。

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

                  - `TextInput = string`

                    发送给模型的文本输入。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    发送给模型的文本输入。

                  - `OutputText object { text, type }`

                    模型的文本输出。

                    - `text: string`

                      模型的文本输出。

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

                      发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    发送给模型的音频输入。

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    输入列表，每一项可以是输入文本、输出文本、输入
                    图像或输入音频对象。

                - `role: "user" or "assistant" or "system" or "developer"`

                  消息输入的角色。值为 `user`, `assistant`, `system`，或
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

      - `hyperparameters: optional ReinforcementHyperparameters`

        用于强化微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          训练期间用于探索搜索空间的计算量乘数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          评估运行之间的训练步数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_samples: optional "auto" or number`

          每个训练步生成的评估样本数量。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

        - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

          推理努力程度。

          - `"default"`

          - `"low"`

          - `"medium"`

          - `"high"`

    - `supervised: optional SupervisedMethod`

      监督微调方法的配置。

      - `hyperparameters: optional SupervisedHyperparameters`

        用于微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

### 微调任务事件

- `FineTuningJobEvent object { id, created_at, level, 4 more }`

  微调任务事件对象

  - `id: string`

    对象标识符。

  - `created_at: number`

    创建微调作业时的 Unix 时间戳（以秒为单位）。

  - `level: "info" or "warn" or "error"`

    事件的日志级别。

    - `"info"`

    - `"warn"`

    - `"error"`

  - `message: string`

    事件的消息。

  - `object: "fine_tuning.job.event"`

    对象类型，始终为 "fine_tuning.job.event"。

    - `"fine_tuning.job.event"`

  - `data: optional unknown`

    与该事件关联的数据。

  - `type: optional "message" or "metrics"`

    事件类型。

    - `"message"`

    - `"metrics"`

### 微调任务 Wandb 集成

- `FineTuningJobWandbIntegration object { project, entity, name, tags }`

  与 Weights and Biases 集成的设置。此负载指定了将
  指标发送到的项目。可选地，你可以为运行设置显式显示名称，添加标签
  到运行中，并设置要与运行关联的默认实体（团队、用户名等）。

  - `project: string`

    新运行将创建于的项目名称。

  - `entity: optional string or null`

    用于运行的实体。这允许你设置与运行关联的 WandB 用户的团队或用户名，
    如果未设置，则使用已注册的 WandB API 密钥的默认实体。

  - `name: optional string or null`

    为运行设置的显示名称。如果未设置，我们将使用作业 ID 作为名称。

  - `tags: optional array of string`

    要附加到新创建的运行的标签列表。这些标签直接传递给 WandB。部分
    默认标签由 OpenAI 生成："openai/finetune"、"openai/{base-model}"、"openai/{ftjob-abcdef}".

### 微调任务 Wandb 集成对象

- `FineTuningJobWandbIntegrationObject object { type, wandb }`

  - `type: "wandb"`

    为微调作业启用的集成类型

    - `"wandb"`

  - `wandb: FineTuningJobWandbIntegration`

    与 Weights and Biases 集成的设置。此负载指定了将
    指标发送到的项目。可选地，你可以为运行设置显式显示名称，添加标签
    到运行中，并设置要与运行关联的默认实体（团队、用户名等）。

    - `project: string`

      新运行将创建于的项目名称。

    - `entity: optional string or null`

      用于运行的实体。这允许你设置与运行关联的 WandB 用户的团队或用户名，
      如果未设置，则使用已注册的 WandB API 密钥的默认实体。

    - `name: optional string or null`

      为运行设置的显示名称。如果未设置，我们将使用作业 ID 作为名称。

    - `tags: optional array of string`

      要附加到新创建的运行的标签列表。这些标签直接传递给 WandB。部分
      默认标签由 OpenAI 生成："openai/finetune"、"openai/{base-model}"、"openai/{ftjob-abcdef}".

# 检查点

## 列出微调检查点

**get** `/fine_tuning/jobs/{fine_tuning_job_id}/checkpoints`

列出微调作业的检查点。

### 路径参数

- `fine_tuning_job_id: string`

### 查询参数

- `after: optional string`

  上一次分页请求的最后一个检查点 ID 的标识符。

- `limit: optional number`

  要检索的检查点数量。

### 返回值

- `data: array of FineTuningJobCheckpoint`

  - `id: string`

    检查点标识符，可在 API 端点中引用。

  - `created_at: number`

    创建检查点时的 Unix 时间戳（秒）。

  - `fine_tuned_model_checkpoint: string`

    所创建的微调检查点模型的名称。

  - `fine_tuning_job_id: string`

    创建此检查点所依据的微调作业的名称。

  - `metrics: object { full_valid_loss, full_valid_mean_token_accuracy, step, 4 more }`

    微调作业期间在步骤编号处的指标。

    - `full_valid_loss: optional number`

    - `full_valid_mean_token_accuracy: optional number`

    - `step: optional number`

    - `train_loss: optional number`

    - `train_mean_token_accuracy: optional number`

    - `valid_loss: optional number`

    - `valid_mean_token_accuracy: optional number`

  - `object: "fine_tuning.job.checkpoint"`

    对象类型，始终为 "fine_tuning.job.checkpoint"。

    - `"fine_tuning.job.checkpoint"`

  - `step_number: number`

    创建检查点时所处的步骤编号。

- `has_more: boolean`

- `object: "list"`

  - `"list"`

- `first_id: optional string or null`

- `last_id: optional string or null`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/jobs/$FINE_TUNING_JOB_ID/checkpoints \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "fine_tuned_model_checkpoint": "fine_tuned_model_checkpoint",
      "fine_tuning_job_id": "fine_tuning_job_id",
      "metrics": {
        "full_valid_loss": 0,
        "full_valid_mean_token_accuracy": 0,
        "step": 0,
        "train_loss": 0,
        "train_mean_token_accuracy": 0,
        "valid_loss": 0,
        "valid_mean_token_accuracy": 0
      },
      "object": "fine_tuning.job.checkpoint",
      "step_number": 0
    }
  ],
  "has_more": true,
  "object": "list",
  "first_id": "first_id",
  "last_id": "last_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/checkpoints \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "object": "fine_tuning.job.checkpoint",
      "id": "ftckpt_zc4Q7MP6XxulcVzj4MZdwsAB",
      "created_at": 1721764867,
      "fine_tuned_model_checkpoint": "ft:gpt-4o-mini-2024-07-18:my-org:custom-suffix:96olL566:ckpt-step-2000",
      "metrics": {
        "full_valid_loss": 0.134,
        "full_valid_mean_token_accuracy": 0.874
      },
      "fine_tuning_job_id": "ftjob-abc123",
      "step_number": 2000
    },
    {
      "object": "fine_tuning.job.checkpoint",
      "id": "ftckpt_enQCFmOTGj3syEpYVhBRLTSy",
      "created_at": 1721764800,
      "fine_tuned_model_checkpoint": "ft:gpt-4o-mini-2024-07-18:my-org:custom-suffix:7q8mpxmy:ckpt-step-1000",
      "metrics": {
        "full_valid_loss": 0.167,
        "full_valid_mean_token_accuracy": 0.781
      },
      "fine_tuning_job_id": "ftjob-abc123",
      "step_number": 1000
    }
  ],
  "first_id": "ftckpt_zc4Q7MP6XxulcVzj4MZdwsAB",
  "last_id": "ftckpt_enQCFmOTGj3syEpYVhBRLTSy",
  "has_more": true
}
```

## 领域类型

### 微调作业检查点

- `FineTuningJobCheckpoint object { id, created_at, fine_tuned_model_checkpoint, 4 more }`

  该 `fine_tuning.job.checkpoint` 对象表示微调作业中可随时使用的模型检查点。

  - `id: string`

    检查点标识符，可在 API 端点中引用。

  - `created_at: number`

    创建检查点时的 Unix 时间戳（秒）。

  - `fine_tuned_model_checkpoint: string`

    所创建的微调检查点模型的名称。

  - `fine_tuning_job_id: string`

    创建此检查点所依据的微调作业的名称。

  - `metrics: object { full_valid_loss, full_valid_mean_token_accuracy, step, 4 more }`

    微调作业期间在步骤编号处的指标。

    - `full_valid_loss: optional number`

    - `full_valid_mean_token_accuracy: optional number`

    - `step: optional number`

    - `train_loss: optional number`

    - `train_mean_token_accuracy: optional number`

    - `valid_loss: optional number`

    - `valid_mean_token_accuracy: optional number`

  - `object: "fine_tuning.job.checkpoint"`

    对象类型，始终为 "fine_tuning.job.checkpoint"。

    - `"fine_tuning.job.checkpoint"`

  - `step_number: number`

    创建检查点时所处的步骤编号。

# 方法

## 领域类型

### DPO 超参数

- `DpoHyperparameters object { batch_size, beta, learning_rate_multiplier, n_epochs }`

  用于 DPO 微调作业的超参数。

  - `batch_size: optional "auto" or number`

    每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

    - `"auto"`

      - `"auto"`

    - `number`

  - `beta: optional "auto" or number`

    DPO 方法的 beta 值。较高的 beta 值会增加策略模型和参考模型之间惩罚的权重。

    - `"auto"`

      - `"auto"`

    - `number`

  - `learning_rate_multiplier: optional "auto" or number`

    学习率的缩放因子。较小的学习率可能有助于避免过拟合。

    - `"auto"`

      - `"auto"`

    - `number`

  - `n_epochs: optional "auto" or number`

    训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

    - `"auto"`

      - `"auto"`

    - `number`

### DPO 方法

- `DpoMethod object { hyperparameters }`

  DPO 微调方法的配置。

  - `hyperparameters: optional DpoHyperparameters`

    用于 DPO 微调作业的超参数。

    - `batch_size: optional "auto" or number`

      每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

      - `"auto"`

        - `"auto"`

      - `number`

    - `beta: optional "auto" or number`

      DPO 方法的 beta 值。较高的 beta 值会增加策略模型和参考模型之间惩罚的权重。

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      学习率的缩放因子。较小的学习率可能有助于避免过拟合。

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

      - `"auto"`

        - `"auto"`

      - `number`

### 强化学习超参数

- `ReinforcementHyperparameters object { batch_size, compute_multiplier, eval_interval, 4 more }`

  用于强化微调作业的超参数。

  - `batch_size: optional "auto" or number`

    每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

    - `"auto"`

      - `"auto"`

    - `number`

  - `compute_multiplier: optional "auto" or number`

    训练期间用于探索搜索空间的计算量乘数。

    - `"auto"`

      - `"auto"`

    - `number`

  - `eval_interval: optional "auto" or number`

    评估运行之间的训练步数。

    - `"auto"`

      - `"auto"`

    - `number`

  - `eval_samples: optional "auto" or number`

    每个训练步生成的评估样本数量。

    - `"auto"`

      - `"auto"`

    - `number`

  - `learning_rate_multiplier: optional "auto" or number`

    学习率的缩放因子。较小的学习率可能有助于避免过拟合。

    - `"auto"`

      - `"auto"`

    - `number`

  - `n_epochs: optional "auto" or number`

    训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

    - `"auto"`

      - `"auto"`

    - `number`

  - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

    推理努力程度。

    - `"default"`

    - `"low"`

    - `"medium"`

    - `"high"`

### 强化学习方法

- `ReinforcementMethod object { grader, hyperparameters }`

  强化微调方法的配置。

  - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

    用于微调作业的评分器。

    - `StringCheckGrader object { input, name, operation, 2 more }`

      一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

      - `input: string`

        输入文本。这可能包括模板字符串。

      - `name: string`

        评分器的名称。

      - `operation: "eq" or "ne" or "like" or "ilike"`

        要执行的字符串检查操作。以下之一 `eq`, `ne`, `like`，或 `ilike`.

        - `"eq"`

        - `"ne"`

        - `"like"`

        - `"ilike"`

      - `reference: string`

        参考文本。这可能包括模板字符串。

      - `type: "string_check"`

        对象类型，始终为 `string_check`.

        - `"string_check"`

    - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

      一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

      - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

        要使用的评估指标。以下之一 `cosine`, `fuzzy_match`, `bleu`,
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

        用作评分参考的文本。

      - `type: "text_similarity"`

        评分器的类型。

        - `"text_similarity"`

    - `PythonGrader object { name, source, type, image_tag }`

      一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

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

      一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

      - `input: array of object { content, role, type }`

        由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，并且可能包括模板字符串。

        - `content: string or ResponseInputText or object { text, type }  or 3 more`

          模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

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

              标记可重用提示前缀的精确结束位置。断点继承请求的 `prompt_cache_options.ttl`；TTL；边界不会四舍五入到令牌块。

              - `mode: "explicit"`

                断点模式。始终为 `explicit`.

                - `"explicit"`

          - `OutputText object { text, type }`

            模型的文本输出。

            - `text: string`

              模型的文本输出。

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

              发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            发送给模型的音频输入。

            - `input_audio: object { data, format }`

              - `data: string`

                Base64 编码的音频数据。

              - `format: "mp3" or "wav"`

                音频数据的格式。目前支持的格式为 `mp3` 和
                `wav`.

                - `"mp3"`

                - `"wav"`

            - `type: "input_audio"`

              输入项的类型。始终为 `input_audio`.

              - `"input_audio"`

          - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

            输入列表，每一项可以是输入文本、输出文本、输入
            图像或输入音频对象。

            - `TextInput = string`

              发送给模型的文本输入。

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              发送给模型的文本输入。

            - `OutputText object { text, type }`

              模型的文本输出。

              - `text: string`

                模型的文本输出。

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

                发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              发送给模型的音频输入。

        - `role: "user" or "assistant" or "system" or "developer"`

          消息输入的角色。值为 `user`, `assistant`, `system`，或
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

        评分的范围。默认值为 `[0, 1]`.

      - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

        模型的采样参数。

        - `max_completions_tokens: optional number or null`

          评分模型在其响应中可生成的最大令牌数。

        - `reasoning_effort: optional ReasoningEffort or null`

          限制推理模型在推理上的投入。目前支持的
          值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
          降低推理投入可以加快响应速度并减少响应中用于推理的令牌
          数量。并非所有推理模型都支持每个
          值。请参阅
          [推理指南](https://platform.openai.com/docs/guides/reasoning)
          了解各模型的支持情况。

          - `"none"`

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

        - `seed: optional number or null`

          用于在采样期间初始化随机性的种子值。

        - `temperature: optional number or null`

          较高的温度会增加输出中的随机性。

        - `top_p: optional number or null`

          用于核采样的温度替代方案；1.0 包含所有令牌。

    - `MultiGrader object { calculate_output, graders, name, type }`

      MultiGrader 对象结合多个评分器的输出来生成单个分数。

      - `calculate_output: string`

        用于根据评分器结果计算输出的公式。

      - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

        - `StringCheckGrader object { input, name, operation, 2 more }`

          一个 StringCheckGrader 对象，它使用指定的操作在输入和参考之间执行字符串比较。

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          一个 TextSimilarityGrader 对象，它根据相似度指标对文本进行评分。

        - `PythonGrader object { name, source, type, image_tag }`

          一个 PythonGrader 对象，它会对输入运行一个 python 脚本。

        - `ScoreModelGrader object { input, model, name, 3 more }`

          一个 ScoreModelGrader 对象，它使用一个模型为输入分配分数。

        - `LabelModelGrader object { input, labels, model, 3 more }`

          一个 LabelModelGrader 对象，它使用模型为每个项目分配标签
          在评估中。

          - `input: array of object { content, role, type }`

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个项目或项目数组。

              - `TextInput = string`

                发送给模型的文本输入。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                发送给模型的文本输入。

              - `OutputText object { text, type }`

                模型的文本输出。

                - `text: string`

                  模型的文本输出。

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

                  发送给模型的图像的细节级别。以下之一： `high`, `low`，或 `auto`. 默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                发送给模型的音频输入。

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，每一项可以是输入文本、输出文本、输入
                图像或输入音频对象。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。值为 `user`, `assistant`, `system`，或
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

  - `hyperparameters: optional ReinforcementHyperparameters`

    用于强化微调作业的超参数。

    - `batch_size: optional "auto" or number`

      每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

      - `"auto"`

        - `"auto"`

      - `number`

    - `compute_multiplier: optional "auto" or number`

      训练期间用于探索搜索空间的计算量乘数。

      - `"auto"`

        - `"auto"`

      - `number`

    - `eval_interval: optional "auto" or number`

      评估运行之间的训练步数。

      - `"auto"`

        - `"auto"`

      - `number`

    - `eval_samples: optional "auto" or number`

      每个训练步生成的评估样本数量。

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      学习率的缩放因子。较小的学习率可能有助于避免过拟合。

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

      - `"auto"`

        - `"auto"`

      - `number`

    - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

      推理努力程度。

      - `"default"`

      - `"low"`

      - `"medium"`

      - `"high"`

### 监督超参数

- `SupervisedHyperparameters object { batch_size, learning_rate_multiplier, n_epochs }`

  用于微调作业的超参数。

  - `batch_size: optional "auto" or number`

    每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

    - `"auto"`

      - `"auto"`

    - `number`

  - `learning_rate_multiplier: optional "auto" or number`

    学习率的缩放因子。较小的学习率可能有助于避免过拟合。

    - `"auto"`

      - `"auto"`

    - `number`

  - `n_epochs: optional "auto" or number`

    训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

    - `"auto"`

      - `"auto"`

    - `number`

### 监督方法

- `SupervisedMethod object { hyperparameters }`

  监督微调方法的配置。

  - `hyperparameters: optional SupervisedHyperparameters`

    用于微调作业的超参数。

    - `batch_size: optional "auto" or number`

      每批中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      学习率的缩放因子。较小的学习率可能有助于避免过拟合。

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      训练模型的轮数。一个 epoch 指的是对训练数据集的一次完整循环。

      - `"auto"`

        - `"auto"`

      - `number`
