> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 列出微调作业

**获取** `/fine_tuning/jobs`

列出你组织的微调作业

### 查询参数

- `after: optional string`

  上一次分页请求中最后一个任务的标识符。

- `limit: optional number`

  要检索的微调任务数量。

- `metadata: optional map[string] or null`

  可选的元数据过滤器。要过滤，请使用语法 `metadata[k]=v`。或者，设置 `metadata=null` 以表示无元数据。

### 返回

- `data: array of FineTuningJob`

  - `id: string`

    对象标识符，可在API端点中引用。

  - `created_at: number`

    创建微调作业时的 Unix 时间戳（以秒为单位）。

  - `error: object { code, message, param }  or null`

    对于已 `failed`，的微调作业，此处将包含有关失败原因的更多信息。

    - `code: string`

      机器可读的错误代码。

    - `message: string`

      人类可读的错误消息。

    - `param: string or null`

      无效的参数，通常是 `training_file` 或 `validation_file`。如果失败与参数无关，此字段将为 null。

  - `fine_tuned_model: string or null`

    正在创建的微调模型的名称。如果微调作业仍在运行，该值将为 null。

  - `finished_at: number or null`

    微调作业完成时的 Unix 时间戳（以秒为单位）。如果微调作业仍在运行，该值将为 null。

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    用于微调作业的超参数。仅当运行 `supervised` 作业时才会返回此值。

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

      训练模型的周期数。一个周期指完整遍历
      训练数据集一次。

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    正在被微调的基础模型。

  - `object: "fine_tuning.job"`

    对象类型，始终为 "fine_tuning.job"。

    - `"fine_tuning.job"`

  - `organization_id: string`

    拥有该微调作业的组织。

  - `result_files: array of string`

    微调作业的已编译结果文件 ID。你可以通过以下方式检索结果： [Files API](/docs/api-reference/files/retrieve-contents).

  - `seed: number`

    用于微调作业的种子。

  - `status: "validating_files" or "queued" or "running" or 3 more`

    微调作业的当前状态，可以是 `validating_files`, `queued`, `running`, `succeeded`, `failed`，或 `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    此微调作业处理的可计费 token 总数。如果微调作业仍在运行，该值将为 null。

  - `training_file: string`

    用于训练的文件 ID。你可以通过以下方式检索训练数据： [Files API](/docs/api-reference/files/retrieve-contents).

  - `validation_file: string or null`

    用于验证的文件 ID。你可以通过以下方式检索验证结果： [Files API](/docs/api-reference/files/retrieve-contents).

  - `estimated_finish: optional number or null`

    微调作业预计完成的 Unix 时间戳（秒）。如果微调作业未在运行，该值将为 null。

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    为此微调作业启用的集成列表。

    - `type: "wandb"`

      为微调作业启用的集成类型

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      用于与 Weights and Biases 集成的设置。此负载指定了指标将发送到的
      项目。可选地，你可以为运行设置显式显示名称、为运行添加标签，
      并设置要与运行关联的默认实体（团队、用户名等）。

      - `project: string`

        新运行将在其下创建的项目的名称。

      - `entity: optional string or null`

        用于运行的实体。这允许你设置希望与运行关联的 WandB 用户的团队或用户名。
        如果未设置，将使用注册的 WandB API 密钥的默认实体。

      - `name: optional string or null`

        为运行设置的显示名称。如果未设置，我们将使用作业 ID 作为名称。

      - `tags: optional array of string`

        要附加到新创建运行的一组标签。这些标签会直接传递给 WandB。部分
        OpenAI会生成默认标签："openai/finetune"、"openai/{base-model}"、"openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    可附加到对象上的16个键值对集合。这可以
    用于以结构化格式存储有关对象的额外信息，
    并通过API或仪表板查询对象。

    键是字符串，最大长度为64个字符。值是字符串
    ，最大长度为512个字符。

  - `method: optional object { type, dpo, reinforcement, supervised }`

    用于微调的方法。

    - `type: "supervised" or "dpo" or "reinforcement"`

      方法的类型。可以是 `supervised`, `dpo`，或 `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      DPO微调方法的配置。

      - `hyperparameters: optional DpoHyperparameters`

        用于DPO微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每个批次中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          DPO方法的beta值。较高的beta值会增加策略模型与参考模型之间惩罚的权重。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一轮是指对训练数据集进行的一次完整循环。

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      强化微调方法的配置。

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        用于微调作业的评分器。

        - `StringCheckGrader object { input, name, operation, 2 more }`

          一个StringCheckGrader对象，使用指定的操作对输入和参考进行字符串比较。

          - `input: string`

            输入文本。这可能包含模板字符串。

          - `name: string`

            评分器的名称。

          - `operation: "eq" or "ne" or "like" or "ilike"`

            要执行的字符串检查操作。可选值之一： `eq`, `ne`, `like`，或 `ilike`.

            - `"eq"`

            - `"ne"`

            - `"like"`

            - `"ilike"`

          - `reference: string`

            参考文本。可能包含模板字符串。

          - `type: "string_check"`

            对象类型，始终为 `string_check`.

            - `"string_check"`

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

          - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

            要使用的评估指标。可选值之一： `cosine`, `fuzzy_match`, `bleu`,
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

            正在被评分的文本。

          - `name: string`

            评分器的名称。

          - `reference: string`

            用于对照评分的文本。

          - `type: "text_similarity"`

            评分器的类型。

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          一个 PythonGrader 对象，对输入运行 python 脚本。

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

          一个 ScoreModelGrader 对象，使用模型为输入分配分数。

          - `input: array of object { content, role, type }`

            评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，可能包含模板字符串。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单项或项数组。

              - `TextInput = string`

                模型的文本输入。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                模型的文本输入。

                - `text: string`

                  模型的文本输入。

                - `type: "input_text"`

                  输入项的类型。始终为 `input_text`.

                  - `"input_text"`

                - `prompt_cache_breakpoint: optional object { mode }`

                  标记可重用提示前缀的精确结束位置。断点继承请求的 `prompt_cache_options.ttl`；的 TTL；边界不会四舍五入到令牌块。

                  - `mode: "explicit"`

                    断点模式。始终 `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                来自模型的文本输出。

                - `text: string`

                  来自模型的文本输出。

                - `type: "output_text"`

                  输出文本的类型。始终 `output_text`.

                  - `"output_text"`

              - `InputImage object { image_url, type, detail }`

                用于 EvalItem 内容数组中的图像输入块。

                - `image_url: string`

                  图像输入的 URL。

                - `type: "input_image"`

                  图像输入的类型。始终 `input_image`.

                  - `"input_image"`

                - `detail: optional string`

                  发送给模型的图像的细节级别。以下之一 `high`, `low`，或 `auto`。默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                模型的音频输入。

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

                输入列表，每一项可以是输入文本、输出文本、输入
                图像或输入音频对象。

                - `TextInput = string`

                  模型的文本输入。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  模型的文本输入。

                - `OutputText object { text, type }`

                  来自模型的文本输出。

                  - `text: string`

                    来自模型的文本输出。

                  - `type: "output_text"`

                    输出文本的类型。始终 `output_text`.

                    - `"output_text"`

                - `InputImage object { image_url, type, detail }`

                  用于 EvalItem 内容数组中的图像输入块。

                  - `image_url: string`

                    图像输入的 URL。

                  - `type: "input_image"`

                    图像输入的类型。始终 `input_image`.

                    - `"input_image"`

                  - `detail: optional string`

                    发送给模型的图像的细节级别。以下之一 `high`, `low`，或 `auto`。默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  模型的音频输入。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。以下之一 `user`, `assistant`, `system`，或
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              消息输入的类型。始终 `message`.

              - `"message"`

          - `model: string`

            用于评估的模型。

          - `name: string`

            评分器的名称。

          - `type: "score_model"`

            对象类型，始终为 `score_model`.

            - `"score_model"`

          - `range: optional array of number`

            分数的范围。默认为 `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            模型的采样参数。

            - `max_completions_tokens: optional number or null`

              评分模型在其响应中可生成的最大 token 数。

            - `reasoning_effort: optional ReasoningEffort or null`

              限制推理模型在推理上的投入。当前支持
              的值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
              降低推理投入可导致更快的响应和更少的 token
              用于响应中的推理。并非所有推理模型都支持每个
              值。请参阅
              [推理指南](https://platform.openai.com/docs/guides/reasoning)
              以了解模型特定支持。

              - `"none"`

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

            - `seed: optional number or null`

              用于初始化采样随机性的种子值。

            - `temperature: optional number or null`

              较高的温度会增加输出的随机性。

            - `top_p: optional number or null`

              使用核采样时替代温度的一种方式；1.0 包含所有 token。

        - `MultiGrader object { calculate_output, graders, name, type }`

          MultiGrader 对象组合多个评分器的输出以产生单一分数。

          - `calculate_output: string`

            根据评分器结果计算输出的公式。

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            一个StringCheckGrader对象，使用指定的操作对输入和参考进行字符串比较。

            - `StringCheckGrader object { input, name, operation, 2 more }`

              一个StringCheckGrader对象，使用指定的操作对输入和参考进行字符串比较。

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              一个 TextSimilarityGrader 对象，根据相似度指标对文本进行评分。

            - `PythonGrader object { name, source, type, image_tag }`

              一个 PythonGrader 对象，对输入运行 python 脚本。

            - `ScoreModelGrader object { input, model, name, 3 more }`

              一个 ScoreModelGrader 对象，使用模型为输入分配分数。

            - `LabelModelGrader object { input, labels, model, 3 more }`

              LabelModelGrader 对象，使用模型为评估中的每个项目
              分配标签。

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  模型的输入 - 可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单项或项数组。

                  - `TextInput = string`

                    模型的文本输入。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    模型的文本输入。

                  - `OutputText object { text, type }`

                    来自模型的文本输出。

                    - `text: string`

                      来自模型的文本输出。

                    - `type: "output_text"`

                      输出文本的类型。始终 `output_text`.

                      - `"output_text"`

                  - `InputImage object { image_url, type, detail }`

                    用于 EvalItem 内容数组中的图像输入块。

                    - `image_url: string`

                      图像输入的 URL。

                    - `type: "input_image"`

                      图像输入的类型。始终 `input_image`.

                      - `"input_image"`

                    - `detail: optional string`

                      发送给模型的图像的细节级别。以下之一 `high`, `low`，或 `auto`。默认为 `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    模型的音频输入。

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    输入列表，每一项可以是输入文本、输出文本、输入
                    图像或输入音频对象。

                - `role: "user" or "assistant" or "system" or "developer"`

                  消息输入的角色。以下之一 `user`, `assistant`, `system`，或
                  `developer`.

                  - `"user"`

                  - `"assistant"`

                  - `"system"`

                  - `"developer"`

                - `type: optional "message"`

                  消息输入的类型。始终 `message`.

                  - `"message"`

              - `labels: array of string`

                评估中每个项目要分配的标签。

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

        强化微调作业使用的超参数。

        - `batch_size: optional "auto" or number`

          每个批次中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          训练期间用于探索搜索空间的计算量乘数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          两次评估运行之间的训练步数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_samples: optional "auto" or number`

          每个训练步生成的评估样本数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一轮是指对训练数据集进行的一次完整循环。

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

          每个批次中的示例数量。较大的批次大小意味着模型参数更新的频率较低，但方差较小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的轮数。一轮是指对训练数据集进行的一次完整循环。

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
