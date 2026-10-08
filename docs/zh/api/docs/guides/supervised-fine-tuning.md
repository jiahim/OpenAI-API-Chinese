# 监督微调

> 完整文档索引请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾追加 `.md` 可获取文档页面的 Markdown 版本。

监督微调（SFT）让你可以使用示例训练 OpenAI 模型以适配你的具体用例。其结果是一个定制化的模型，能够更可靠地生成你期望的风格和内容。

OpenAI 正在逐步关停微调平台。该平台不再
  向新用户开放，但现有微调平台用户仍可
  在未来几个月内创建训练任务。
  

  所有微调模型在其基础
  模型被 [弃用](https://developers.openai.com/api/docs/deprecations)。前都可继续用于推理。完整时间表请参见
  [此处](https://developers.openai.com/api/docs/deprecations).




<table>
<tbody>
<tr>
<th>How it works</th>
<th>Best for</th>
<th>Use with</th>
</tr>

<tr>
<td>
Provide examples of correct responses to prompts to guide the model's behavior.

Often uses human-generated "ground truth" responses to show the model how it should respond.

</td>
<td>
- Classification
- Nuanced translation
- Generating content in a specific format
- Correcting instruction-following failures
</td>
<td>
`gpt-4.1-2025-04-14`
`gpt-4.1-mini-2025-04-14`
`gpt-4.1-nano-2025-04-14`
</td>
</tr>

</tbody>
</table>

## 概述

监督微调主要有四个部分：

1. 构建你的训练数据集，以确定"良好"输出的标准
1. 上传包含示例提示和期望模型输出的训练数据集
1. 使用你的训练数据为基础模型创建微调任务
1. 使用微调后的模型评估你的结果

**先做好评估！** 只有在设置好评估之后，再投入微调。你
  需要一个可靠的方法来判断你的微调模型是否表现
  优于基础模型。
  

  [设置评估 →](https://developers.openai.com/api/docs/guides/evals)

## 构建你的数据集

构建一个稳健且具有代表性的数据集，以从微调模型中获得有用的结果。使用以下技术和注意事项。

### 恰当数量的示例

- 微调时最少需要提供 10 个示例
- 我们看到使用 50–100 个示例进行微调就能带来改进，但适合你的数量差异很大，取决于具体用例
- 我们建议从 50 个精心编写的示例开始，然后 [评估结果](https://developers.openai.com/api/docs/guides/evals)

如果 50 个优质示例能带来性能提升，可尝试添加更多示例以观察进一步的改进。如果 50 个示例没有效果，请在添加训练数据之前重新审视你的任务或提示。

### 什么样的示例才算好

- 你的应用程序中预期出现的提示与输出，越贴近真实越好
- 具体、明确的问题与回答
- 使用历史数据、专家数据、记录的数据或 [其他类型的采集数据](https://developers.openai.com/api/docs/guides/evals)

### 格式化你的数据

- 使用 [JSONL 格式](https://jsonlines.org/)，训练数据文件的每一行包含一条完整的 JSON 结构
- 使用 [chat completions 格式](https://developers.openai.com/api/reference/resources/fine_tuning)
- 你的文件必须至少包含 10 行



JSONL 格式示例文件

    

JSONL 训练数据示例，其中模型调用一个 `get_weather` 函数：

```
{"messages":[{"role":"user","content":"What is the weather in San Francisco?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"San Francisco, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. San Francisco, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
{"messages":[{"role":"user","content":"What is the weather in Minneapolis?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"Minneapolis, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. Minneapolis, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
{"messages":[{"role":"user","content":"What is the weather in San Diego?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"San Diego, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. San Diego, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
{"messages":[{"role":"user","content":"What is the weather in Memphis?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"Memphis, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. Memphis, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
{"messages":[{"role":"user","content":"What is the weather in Atlanta?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"Atlanta, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. Atlanta, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
{"messages":[{"role":"user","content":"What is the weather in Sunnyvale?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"Sunnyvale, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. Sunnyvale, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
{"messages":[{"role":"user","content":"What is the weather in Chicago?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"Chicago, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. Chicago, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
{"messages":[{"role":"user","content":"What is the weather in Boston?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"Boston, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. Boston, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
{"messages":[{"role":"user","content":"What is the weather in Honolulu?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"Honolulu, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. Honolulu, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
{"messages":[{"role":"user","content":"What is the weather in San Antonio?"},{"role":"assistant","tool_calls":[{"id":"call_id","type":"function","function":{"name":"get_current_weather","arguments":"{\"location\": \"San Antonio, USA\", \"format\": \"celsius\"}"}}]}],"parallel_tool_calls":false,"tools":[{"type":"function","function":{"name":"get_current_weather","description":"Get the current weather","parameters":{"type":"object","properties":{"location":{"type":"string","description":"The city and country, eg. San Antonio, USA"},"format":{"type":"string","enum":["celsius","fahrenheit"]}},"required":["location","format"]}}}]}
```


  

  

    
对应的 JSON 数据

    

训练数据文件的每一行都包含如下 JSON 结构，其中包含一条用户提示示例以及模型给出的正确响应，形式为一条 `assistant` 消息。

```json
{
  "messages": [
    { "role": "user", "content": "What is the weather in San Francisco?" },
    {
      "role": "assistant",
      "tool_calls": [
        {
          "id": "call_id",
          "type": "function",
          "function": {
            "name": "get_current_weather",
            "arguments": "{\"location\": \"San Francisco, USA\", \"format\": \"celsius\"}"
          }
        }
      ]
    }
  ],
  "parallel_tool_calls": false,
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_current_weather",
        "description": "Get the current weather",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "The city and country, eg. San Francisco, USA"
            },
            "format": { "type": "string", "enum": ["celsius", "fahrenheit"] }
          },
          "required": ["location", "format"]
        }
      }
    }
  ]
}
```



### 从更大的模型蒸馏

为较小的模型构建训练数据集的一种方法是将大模型的结果蒸馏，作为监督微调的训练数据。该技术的一般流程如下：

- 针对更大的模型（例如 `gpt-4.1`）调整提示词，直到在你的评估标准下表现良好。
- 使用任何方便的方式捕获模型生成的结果——注意 Responses API [响应接口](https://developers.openai.com/api/reference/resources/responses) 默认会将模型响应存储 30 天。
- 使用上述工具和技术，从符合你标准的大模型捕获的响应中生成数据集。
- 针对更小的模型（例如 `gpt-4.1-mini`），使用你从大模型创建的数据集进行微调。

这种技术可以让你训练一个小模型，使其在特定任务上的表现接近更大、成本更高的模型。

## 上传训练数据

将你的示例数据集上传到 OpenAI。我们使用该数据来更新模型权重，并生成与你数据中包含的示例类似的输出。

除了文本补全之外，你还可以训练模型更有效地生成 [结构化 JSON 输出](https://developers.openai.com/api/docs/guides/structured-outputs) 或 [函数调用](https://developers.openai.com/api/docs/guides/function-calling).



通过点击按钮上传数据

    

1. 前往控制台 > **[微调](https://platform.openai.com/finetune)**.
1. 点击 **+ 创建**.
1. 在 **训练数据**，下，上传你的 JSONL 文件。


  

  

    
调用 API 上传你的数据

    

假设上面的数据已保存到文件 `mydata.jsonl`，中，你可以使用下面的代码将其上传到 OpenAI 平台。请注意，上传文件 `purpose` 的 `fine-tune`:

```bash
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="fine-tune" \
  -F file="@mydata.jsonl"
```


请注意，从 API 返回的数据中上传文件的 `id` ——在后续的 API 请求中会用到该文件标识符。

```json
{
  "object": "file",
  "id": "file-RCnFCYRhFDcq1aHxiYkBHw",
  "purpose": "fine-tune",
  "filename": "mydata.jsonl",
  "bytes": 1058,
  "created_at": 1746484901,
  "expires_at": null,
  "status": "processed",
  "status_details": null
}
```



## 创建微调作业

在你的测试数据上传完成后， [创建一个微调任务](https://developers.openai.com/api/reference/resources/fine_tuning) 以使用你提供的训练数据定制一个基础模型。创建微调任务时，你必须指定：

- 基础模型 (`model`) 用于微调。可以是 OpenAI 模型 ID,也可以是之前微调过的模型 ID。请参阅 [模型文档](https://developers.openai.com/api/docs/models).
- 训练文件 (`training_file`) ID。这是上一步中你上传的文件。
- 微调方法 (`method`)。此项指定你希望用于自定义模型的微调方法,默认为监督微调。



通过点击按钮上传数据

    

1. 在上述 **+ 创建** 同一个模态框中填写必填字段。
1. 选择监督微调作为方法,并选择你想要训练的模型。
1. 准备就绪后,点击 **创建** 以启动任务。


  

  

    
调用 API 上传你的数据

    

通过调用 [微调 API](https://developers.openai.com/api/reference/resources/fine_tuning):

```bash
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-RCnFCYRhFDcq1aHxiYkBHw",
    "model": "gpt-4.1-nano-2025-04-14"
  }'
```


API 会返回有关正在进行的微调作业的信息。根据你的训练数据规模，训练过程可能需要数分钟到数小时不等。你可以 [轮询 API](https://developers.openai.com/api/reference/resources/fine_tuning) 以获取特定作业的更新。

微调作业完成后，你就可以使用微调后的模型了。已完成的微调作业会返回如下数据：

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-uL1VKpwx7maorHNbOiDwFIn6",
  "model": "gpt-4.1-nano-2025-04-14",
  "created_at": 1746484925,
  "finished_at": 1746485841,
  "fine_tuned_model": "ft:gpt-4.1-nano-2025-04-14:openai::BTz2REMH",
  "organization_id": "org-abc123",
  "result_files": ["file-9TLxKY2A8tC5YE1RULYxf6"],
  "status": "succeeded",
  "validation_file": null,
  "training_file": "file-RCnFCYRhFDcq1aHxiYkBHw",
  "hyperparameters": {
    "n_epochs": 10,
    "batch_size": 1,
    "learning_rate_multiplier": 1
  },
  "trained_tokens": 1700,
  "error": {},
  "user_provided_suffix": null,
  "seed": 1935755117,
  "estimated_finish": null,
  "integrations": [],
  "metadata": null,
  "usage_metrics": null,
  "shared_with_openai": false,
  "method": {
    "type": "supervised",
    "supervised": {
      "hyperparameters": {
        "n_epochs": 10,
        "batch_size": 1,
        "learning_rate_multiplier": 1.0
      }
    }
  }
}
```

请注意，从 API 返回的数据中上传文件的 `fine_tuned_model` 属性。这是用于在 [Responses](https://developers.openai.com/api/reference/resources/responses) 或 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) 中发起 API 请求时使用的模型 ID。

下面是使用你的微调模型 ID 调用 Responses API 的示例：

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "ft:gpt-4.1-nano-2025-04-14:openai::BTz2REMH",
    "input": "What is the weather like in Boston today?",
    "tools": [
      {
        "name": "get_current_weather",
        "description": "Get the current weather",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
                "type": "string",
                "description": "The city and country, eg. San Francisco, USA"
            },
            "format": { "type": "string", "enum": ["celsius", "fahrenheit"] }
          },
          "required": ["location", "format"]
        }
      }
    ],
    "tool_choice": "auto"
  }'
```



## 评估结果

使用以下方法来检查微调模型的性能。根据需要调整你的提示、数据和微调任务，直到获得满意的结果。微调的最佳方式是持续迭代。

### 与评估对比

若要判断你的微调模型是否优于原始的基础模型， [请使用 evals](https://developers.openai.com/api/docs/guides/evals)。在运行微调任务之前，请从第 1 步中收集的同一训练数据集中划分出一部分数据。这部分留出数据在用于 evals 时充当对照组。确保训练数据和留出数据在用户输入类型和模型回答的多样性上大致相当。

[详细了解如何运行 evals](https://developers.openai.com/api/docs/guides/evals).

### 监控状态

在仪表板中检查微调任务的状态，或通过任务 ID 在 API 中轮询其状态。



在界面中监控

    

1. 前往 [微调仪表板](https://platform.openai.com/finetune).
1. 选择你要监控的任务。
1. 查看状态、检查点、消息和指标。


  

  

    
通过 API 调用进行监控

    

使用以下 curl 命令获取你的微调作业信息：

```bash
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-uL1VKpwx7maorHNbOiDwFIn6 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


该作业包含一个 `fine_tuned_model` 属性，该属性是你新微调模型的唯一 ID。

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-uL1VKpwx7maorHNbOiDwFIn6",
  "model": "gpt-4.1-nano-2025-04-14",
  "created_at": 1746484925,
  "finished_at": 1746485841,
  "fine_tuned_model": "ft:gpt-4.1-nano-2025-04-14:openai::BTz2REMH",
  "organization_id": "org-abc123",
  "result_files": ["file-9TLxKY2A8tC5YE1RULYxf6"],
  "status": "succeeded",
  "validation_file": null,
  "training_file": "file-RCnFCYRhFDcq1aHxiYkBHw",
  "hyperparameters": {
    "n_epochs": 10,
    "batch_size": 1,
    "learning_rate_multiplier": 1
  },
  "trained_tokens": 1700,
  "error": {},
  "user_provided_suffix": null,
  "seed": 1935755117,
  "estimated_finish": null,
  "integrations": [],
  "metadata": null,
  "usage_metrics": null,
  "shared_with_openai": false,
  "method": {
    "type": "supervised",
    "supervised": {
      "hyperparameters": {
        "n_epochs": 10,
        "batch_size": 1,
        "learning_rate_multiplier": 1.0
      }
    }
  }
}
```



### 试用你微调的模型

使用你新优化的模型来评估效果！当微调模型完成训练后，可以在 [Responses](https://developers.openai.com/api/reference/resources/responses) 或 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) API中使用其 ID，就像使用 OpenAI 基础模型一样。



在 Playground 中使用你的模型

    

1. 在控制面板中导航到你的微调任务 [控制面板](https://platform.openai.com/finetune).
1. 在右侧面板中，导航到 **Output model** 并复制模型 ID。它应该以 `ft:…`
1. 打开 [Playground](https://platform.openai.com/playground).
1. 在 **Model** 下拉菜单中，粘贴模型 ID。在这里，你还可以看到你创建的其他微调模型。
1. 运行一些提示，看看你的微调模型表现如何！


  

  

    
通过 API 调用使用你的模型

    

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "ft:gpt-4.1-nano-2025-04-14:openai::BTz2REMH",
    "input": "What is 4+4?"
  }'
```



### 如有需要可使用检查点

检查点是你可以使用的模型。我们会在每个训练轮次结束时为你创建一个完整的模型检查点。当你的微调模型在早期有所改进、之后却只是记忆训练数据而没有学到可泛化的知识（即过拟合）时，检查点会很有用。检查点会提供训练过程中不同时刻的定制模型版本。



在控制台中查找检查点

    

1. 前往 [微调仪表板](https://platform.openai.com/finetune).
1. 在左侧面板中，选择你要调查的任务，等待任务成功完成。
1. 在右侧面板中，向下滚动查看检查点列表。
1. 将鼠标悬停在任意检查点上，会出现一个可在 Playground 中启动的链接。
1. 在 Playground 中向该检查点模型发送提示，测试其行为。


  

  

    
查询 API 中的检查点

    

1. 等待任务成功，你可以通过 [查询任务状态](https://developers.openai.com/api/reference/resources/fine_tuning).
1. [查询检查点端点](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 使用你的微调任务 ID 来访问该微调任务的模型检查点列表。
1. 找到 `fine_tuned_model_checkpoint` 字段，获取模型检查点的名称。
1. 像使用最终的微调模型一样使用此模型。

checkpoint 对象包含 `metrics` 数据，可帮助你判断此模型的实用性。例如，响应如下所示：

```json
{
  "object": "fine_tuning.job.checkpoint",
  "id": "ftckpt_zc4Q7MP6XxulcVzj4MZdwsAB",
  "created_at": 1519129973,
  "fine_tuned_model_checkpoint": "ft:gpt-3.5-turbo-0125:my-org:custom-suffix:96olL566:ckpt-step-2000",
  "metrics": {
    "full_valid_loss": 0.134,
    "full_valid_mean_token_accuracy": 0.874
  },
  "fine_tuning_job_id": "ftjob-abc123",
  "step_number": 2000
}
```

每个 checkpoint 指定了以下内容：

- `step_number`: 创建检查点时所对应的训练步数（其中每个 epoch 表示训练集的样本数除以 batch size 所得到的步数）
- `metrics`: 一个对象，包含在该检查点创建时所对应的训练步数下，你的微调任务的指标



目前，只有该任务的最后三个 epoch 的检查点会被保存并可供使用。

## 安全检查

在生产环境上线之前，请查看并遵循以下安全信息。



### 我们如何评估安全性



微调任务完成后，我们会评估所得模型在 13 个不同安全类别下的表现。每个类别都代表一个关键领域，如果 AI 输出未能得到适当控制，可能会造成危害。

| 名称                   | 描述                                                                                                                                                                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| advice                 | 违反我们政策的建议或指导。                                                                                                                                                                                                 |
| harassment/threatening | 包含针对任何目标的暴力或严重伤害的骚扰内容。                                                                                                                                                             |
| hate                   | 基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓表达、煽动或宣扬仇恨的内容。针对非受保护群体（例如国际象棋棋手）的仇恨内容属于骚扰。 |
| hate/threatening       | 同时包含针对基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓的目标群体的暴力或严重伤害的仇恨内容。                                               |
| highly-sensitive       | 违反我们政策的高度敏感数据。                                                                                                                                                                                              |
| illicit                | 提供如何实施违法行为的建议或指导的内容。例如“如何入店行窃”这样的短语就属于此类。                                                                                                               |
| propaganda             | 对违反我们政策的意识形态的赞扬或协助。                                                                                                                                                                                  |
| self-harm/instructions | 鼓励实施自杀、自残和饮食失调等自残行为，或提供如何实施此类行为的指导或建议的内容。                                                                         |
| self-harm/intent       | 说话者表示自己正在或打算实施自杀、自残和饮食失调等自残行为的内容。                                                                                           |
| sensitive              | 违反我们政策的敏感数据。                                                                                                                                                                                                     |
| sexual/minors          | 包含 18 岁以下未成年人的性相关内容。                                                                                                                                                                          |
| sexual                 | 旨在引起性兴奋的内容，例如对性行为的描述，或推广性服务的内容（不包括性教育和性健康）。                                                                                |
| violence               | 描绘死亡、暴力或人身伤害的内容。                                                                                                                                                                                      |

每个类别都有一个预定义的通过阈值；如果某个类别中评估的失败样本过多，OpenAI 将阻止该微调模型部署。如果你的微调模型未通过安全检查，OpenAI 会在微调任务中发送一条消息，说明哪些类别未达到所需阈值。你可以在微调任务的审核检查部分查看结果。







### 如何通过安全检查



除了在微调任务对象中查看任何失败的安全检查之外，你还可以通过查询微调 [API 事件端点](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/methods/list)。来获取关于哪些类别失败的详细信息。查找类型为 `moderation_checks` 的事件，以了解类别结果和强制执行相关的详细信息。这些信息可以帮助你缩小需要重新训练和改进的目标类别范围。 [模型规范](https://cdn.openai.com/spec/model-spec-2024-05-08.html#overview) 提供了相关规则和示例，可帮助你识别需要补充训练数据的领域。

虽然这些评估涵盖了广泛的安全类别，但你应当自行对微调后的模型进行评估，以确保它适合你的用例。





## 下一步

现在你已经了解了监督微调的基础知识，也可以探索以下其他方法。

[视觉微调



      Learn to fine-tune for computer vision with image inputs.](https://developers.openai.com/api/docs/guides/vision-fine-tuning)

[直接偏好优化



      Fine-tune a model using direct preference optimization (DPO).](https://developers.openai.com/api/docs/guides/direct-preference-optimization)

[强化微调



      Fine-tune a reasoning model by grading its outputs.](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)