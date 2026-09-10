> 完整文档索引请参见 [llms.txt](/llms.txt)。在页面 URL 末尾追加以下内容即可获取 Markdown 版本的文档页面： `.md` （追加到页面 URL 末尾）。

## 列出微调任务

**get** `/fine_tuning/jobs`

列出你组织的微调任务

### 查询参数

- `after: optional string`

  上一次分页请求中最后一个任务的标识符。

- `limit: optional number`

  要检索的微调任务数量。

- `metadata: optional map[string] or null`

  可选的元数据筛选条件。若要筛选，请使用以下语法 `metadata[k]=v`。或者，将 `metadata=null` 设置为表示无元数据。

### Returns

- `data: array of FineTuningJob`

  - `id: string`

    对象标识符，可在 API 端点中引用。

  - `created_at: number`

    微调任务创建时的 Unix 时间戳（以秒为单位）。

  - `error: object { code, message, param }  or null`

    对于已 `failed`，的微调任务，这里将包含有关失败原因的更多信息。

    - `code: string`

      机器可读的错误代码。

    - `message: string`

      人类可读的错误消息。

    - `param: string or null`

      无效的参数，通常为 `training_file` 或 `validation_file`。如果失败不是由特定参数引起的，此字段将为 null。

  - `fine_tuned_model: string or null`

    正在创建的微调模型的名称。如果微调任务仍在运行，则该值为 null。

  - `finished_at: number or null`

    微调任务完成时的 Unix 时间戳（以秒为单位）。如果微调任务仍在运行，则该值为 null。

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    用于微调任务的超参数。仅当运行 `supervised` 任务时才会返回该值。

    - `batch_size: optional "auto" or number or null`

      每个批次中的样本数量。更大的批量大小意味着模型参数
      更新频率降低，但方差更小。

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      学习率的缩放因子。使用较小的学习率有助于避免
      过拟合。

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      训练模型的轮次（epoch）数。一个 epoch 指的是对训练数据集进行
      一次完整遍历。

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    正在被微调的基础模型。

  - `object: "fine_tuning.job"`

    对象类型，始终为 "fine_tuning.job"。

    - `"fine_tuning.job"`

  - `organization_id: string`

    拥有该微调任务的组织。

  - `result_files: array of string`

    该微调任务的编译结果文件 ID。你可以前往 [Files API](/api/reference/resources/files/methods/content).

  - `seed: number`

    该微调任务使用的随机种子。

  - `status: "validating_files" or "queued" or "running" or 3 more`

    该微调任务的当前状态，可能为 `validating_files`, `queued`, `running`, `succeeded`, `failed`，或 `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    该微调任务处理的计费 token 总数。如果该微调任务仍在进行中，则该值为 null。

  - `training_file: string`

    用于训练的文件 ID。你可以前往 [Files API](/api/reference/resources/files/methods/content).

  - `validation_file: string or null`

    用于验证的文件 ID。你可以前往 [Files API](/api/reference/resources/files/methods/content).

  - `estimated_finish: optional number or null`

    微调作业预计完成的 Unix 时间戳（以秒为单位）。如果微调作业未运行，则该值为 null。

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    为本次微调作业启用的集成列表。

    - `type: "wandb"`

      为微调作业启用的集成类型。

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      与 Weights and Biases 集成的设置。此载荷指定项目，
      指标将发送至该项目。你也可以为运行设置显式显示名称、添加标签
      到你的运行，并设置要与运行关联的默认实体（团队、用户名等）。

      - `project: string`

        新建运行所属项目的名称。

      - `entity: optional string or null`

        运行所使用的实体。这允许你设置你希望与该运行关联的 WandB 用户的团队或用户名，
        如果未设置，将使用已注册 WandB API 密钥对应的默认实体。

      - `name: optional string or null`

        为运行设置的显示名称。如果未设置，我们将使用作业 ID 作为名称。

      - `tags: optional array of string`

        要附加到新创建运行上的一组标签。这些标签会直接传递给 WandB。某些
        默认标签由 OpenAI 生成："openai/finetune"、"openai/{base-model}"、"openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    可附加到对象的 16 组键值对。可用于以结构化
    格式存储对象的附加信息，并通过 API 或仪表板查询对象。
    格式存储对象的附加信息，并通过 接口 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `method: optional object { type, dpo, reinforcement, supervised }`

    用于微调的方法。

    - `type: "supervised" or "dpo" or "reinforcement"`

      方法的类型。为以下两者之一： `supervised`, `dpo`，或 `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      DPO 微调方法的配置。

      - `hyperparameters: optional DpoHyperparameters`

        用于 DPO 微调作业的超参数。

        - `batch_size: optional "auto" or number`

          每个批次中的样本数量。更大的批次大小意味着模型参数更新频率更低，但方差更小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          DPO 方法的 beta 值。更高的 beta 值会增加策略模型与参考模型之间惩罚项的权重。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的 epoch 数。一个 epoch 指的是完整遍历训练数据集一次。

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      强化微调方法的配置。

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        用于微调作业的评分器。

        - `StringCheckGrader object { input, name, operation, 2 more }`

          一个 StringCheckGrader 对象，使用指定的操作在输入与参考答案之间执行字符串比较。

          - `input: string`

            输入文本。可能包含模板字符串。

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

          一个 TextSimilarityGrader 对象，基于相似度指标对文本进行评分。

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

            被评分的文本。

          - `name: string`

            评分器的名称。

          - `reference: string`

            作为评分参照的文本。

          - `type: "text_similarity"`

            评分器的类型。

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          一个 PythonGrader 对象，用于在输入上运行 python 脚本。

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

          一个 ScoreModelGrader 对象，使用模型为输入打分。

          - `input: array of object { content, role, type }`

            由评分器评估的输入消息。支持文本、输出文本、输入图像和输入音频内容块，也可以包含模板字符串。

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              模型的输入，可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个条目，也可以是条目数组。

              - `TextInput = string`

                发送给模型的文本输入。

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                发送给模型的文本输入。

                - `text: string`

                  发送给模型的文本输入。

                - `type: "input_text"`

                  输入条目的类型，始终为 `input_text`.

                  - `"input_text"`

                - `prompt_cache_breakpoint: optional object { mode }`

                  标记可复用提示前缀的精确结束位置。该断点的 TTL 继承自请求的 `prompt_cache_options.ttl`；边界不会取整到 token 块。

                  - `mode: "explicit"`

                    断点模式。始终为 `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                模型生成的文本输出。

                - `text: string`

                  模型生成的文本输出。

                - `type: "output_text"`

                  输出文本的类型。始终为 `output_text`.

                  - `"output_text"`

              - `InputImage object { image_url, type, detail }`

                在 EvalItem 内容数组中使用的图像输入块。

                - `image_url: string`

                  图像输入的 URL。

                - `type: "input_image"`

                  图像输入的类型。始终为 `input_image`.

                  - `"input_image"`

                - `detail: optional string`

                  发送给模型的图像的细节级别。可选值为 `high`, `low`，或 `auto`。默认为 `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                模型的音频输入。

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64 编码的音频数据。

                  - `format: "mp3" or "wav"`

                    音频数据的格式。当前支持的格式包括 `mp3` 和
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  输入条目的类型，始终为 `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                输入列表，其中每一项可以是输入文本、输出文本、输入
                图像或输入音频对象。

                - `TextInput = string`

                  发送给模型的文本输入。

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  发送给模型的文本输入。

                - `OutputText object { text, type }`

                  模型生成的文本输出。

                  - `text: string`

                    模型生成的文本输出。

                  - `type: "output_text"`

                    输出文本的类型。始终为 `output_text`.

                    - `"output_text"`

                - `InputImage object { image_url, type, detail }`

                  在 EvalItem 内容数组中使用的图像输入块。

                  - `image_url: string`

                    图像输入的 URL。

                  - `type: "input_image"`

                    图像输入的类型。始终为 `input_image`.

                    - `"input_image"`

                  - `detail: optional string`

                    发送给模型的图像的细节级别。可选值为 `high`, `low`，或 `auto`。默认为 `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  模型的音频输入。

            - `role: "user" or "assistant" or "system" or "developer"`

              消息输入的角色。可选值为 `user`, `assistant`, `system`，或
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

            分数的取值范围。默认为 `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            模型的采样参数。

            - `max_completions_tokens: optional number or null`

              评分模型在其响应中可生成的最大 token 数。

            - `reasoning_effort: optional ReasoningEffort or null`

              限制推理模型在推理上的投入程度。当前支持
              的取值为 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`，和 `max`.
              降低推理投入程度可以带来更快的响应，并在响应中使用更少的 token
              用于推理。并非所有推理模型都支持每个
              取值。请参阅
              [reasoning guide](/api/docs/guides/reasoning)
              以了解各模型的支持情况。

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

              较高的 temperature 会增加输出中的随机性。

            - `top_p: optional number or null`

              用于核采样的 temperature 替代方案；1.0 表示包含所有 token。

        - `MultiGrader object { calculate_output, graders, name, type }`

          MultiGrader 对象会将多个评分器的输出合并为单个分数。

          - `calculate_output: string`

            用于根据评分器结果计算输出的公式。

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            一个 StringCheckGrader 对象，使用指定的操作在输入与参考答案之间执行字符串比较。

            - `StringCheckGrader object { input, name, operation, 2 more }`

              一个 StringCheckGrader 对象，使用指定的操作在输入与参考答案之间执行字符串比较。

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              一个 TextSimilarityGrader 对象，基于相似度指标对文本进行评分。

            - `PythonGrader object { name, source, type, image_tag }`

              一个 PythonGrader 对象，用于在输入上运行 python 脚本。

            - `ScoreModelGrader object { input, model, name, 3 more }`

              一个 ScoreModelGrader 对象，使用模型为输入打分。

            - `LabelModelGrader object { input, labels, model, 3 more }`

              LabelModelGrader 对象，使用一个模型为评估中的每个条目分配标签
              。

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  模型的输入，可以包含模板字符串。支持文本、输出文本、输入图像和输入音频，可以是单个条目，也可以是条目数组。

                  - `TextInput = string`

                    发送给模型的文本输入。

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    发送给模型的文本输入。

                  - `OutputText object { text, type }`

                    模型生成的文本输出。

                    - `text: string`

                      模型生成的文本输出。

                    - `type: "output_text"`

                      输出文本的类型。始终为 `output_text`.

                      - `"output_text"`

                  - `InputImage object { image_url, type, detail }`

                    在 EvalItem 内容数组中使用的图像输入块。

                    - `image_url: string`

                      图像输入的 URL。

                    - `type: "input_image"`

                      图像输入的类型。始终为 `input_image`.

                      - `"input_image"`

                    - `detail: optional string`

                      发送给模型的图像的细节级别。可选值为 `high`, `low`，或 `auto`。默认为 `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    模型的音频输入。

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    输入列表，其中每一项可以是输入文本、输出文本、输入
                    图像或输入音频对象。

                - `role: "user" or "assistant" or "system" or "developer"`

                  消息输入的角色。可选值为 `user`, `assistant`, `system`，或
                  `developer`.

                  - `"user"`

                  - `"assistant"`

                  - `"system"`

                  - `"developer"`

                - `type: optional "message"`

                  消息输入的类型。始终为 `message`.

                  - `"message"`

              - `labels: array of string`

                分配给评估中每个条目的标签。

              - `model: string`

                用于评估的模型。必须支持结构化输出。

              - `name: string`

                评分器的名称。

              - `passing_labels: array of string`

                表示通过结果的标签。必须是 labels 的一个子集。

              - `type: "label_model"`

                对象类型，始终为 `label_model`.

                - `"label_model"`

          - `name: string`

            评分器的名称。

          - `type: "multi"`

            对象类型，始终为 `multi`.

            - `"multi"`

      - `hyperparameters: optional ReinforcementHyperparameters`

        用于强化微调任务的超参数。

        - `batch_size: optional "auto" or number`

          每个批次中的样本数量。更大的批次大小意味着模型参数更新频率更低，但方差更小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          训练期间用于探索搜索空间的算力倍数。

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          两次评估运行之间间隔的训练步数。

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

          训练模型的 epoch 数。一个 epoch 指的是完整遍历训练数据集一次。

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

        用于微调任务的超参数。

        - `batch_size: optional "auto" or number`

          每个批次中的样本数量。更大的批次大小意味着模型参数更新频率更低，但方差更小。

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          学习率的缩放因子。较小的学习率可能有助于避免过拟合。

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          训练模型的 epoch 数。一个 epoch 指的是完整遍历训练数据集一次。

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
