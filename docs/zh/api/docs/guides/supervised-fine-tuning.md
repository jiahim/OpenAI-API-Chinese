# 监督微调

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾附加 `.md` 来获取。

监督微调（SFT）允许你使用针对特定用例的示例来训练 OpenAI 模型。得到的是一个定制化模型，能够更可靠地生成你期望的风格和内容。

OpenAI 正在逐步关停微调平台。该平台不再
  对新增用户开放，但现有微调平台的用户在
  未来数月内仍可创建训练任务。
  

  所有微调模型在其基座
  模型被 [弃用](https://developers.openai.com/api/docs/deprecations)。之前都将保持可用。完整的时间表请参阅
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

监督微调包含四个主要部分：

1. 构建你的训练数据集，确定什么是“良好”的输出
1. 上传一个包含示例提示和期望模型输出的训练数据集
1. 使用你的训练数据为基础模型创建一个微调任务
1. 使用微调后的模型评估你的结果

**先把评估做好！** 只有在搭建好评估之后，再投入微调。你
  需要一种可靠的方式来判断你的微调模型是否表现
  优于基础模型。
  

  [搭建评估 →](https://developers.openai.com/api/docs/guides/evals)

## 构建你的数据集

构建一个稳健且具有代表性的数据集，以从微调模型中获得有用的结果。使用以下技术和注意事项。

### 恰到好处的示例数量

- 微调至少需要提供 10 个示例
- 在 50–100 个示例上进行微调可以看到改进，但合适的数量差异很大，取决于具体用例
- 我们建议从 50 个精心设计的演示开始，并 [评估结果](https://developers.openai.com/api/docs/guides/evals)

如果使用 50 个优质示例后性能有所提升，可以尝试增加更多示例以获取进一步的改进。如果 50 个示例没有产生任何效果，请在添加训练数据之前重新思考你的任务或提示。

### 优秀示例的特征

- 应用预期出现的提示与输出，应尽可能贴近真实
- 具体、清晰的问题与回答
- 使用历史数据、专家数据、日志数据，或 [其他类型的采集数据](https://developers.openai.com/api/docs/guides/evals)

### Formatting your data

- 使用 [JSONL 格式](https://jsonlines.org/)，训练数据文件的每一行包含一个完整的 JSON 结构
- 使用 [chat completions 格式](https://developers.openai.com/api/reference/resources/fine_tuning)
- 你的文件至少需要 10 行



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

    

训练数据文件的每一行都包含如下所示的 JSON 结构，其中同时包含一个示例用户提示词和模型返回的正确响应，形式为 `assistant` 消息。

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



### 从更大的模型中蒸馏

为较小的模型构建训练数据集的一种方法是将大模型的输出进行蒸馏，从而生成用于监督微调的训练数据。该技术的一般流程如下：

- 针对更大的模型调整提示词（例如 `gpt-4.1`），直到它能在你的评估标准下表现出色。
- 使用任何方便的技术捕获模型生成的结果——请注意， [Responses API](https://developers.openai.com/api/reference/resources/responses) 默认将模型响应存储 30 天。
- 使用上述工具和技术，根据符合你标准的大模型捕获的响应生成数据集。
- 针对更小的模型调整提示词（例如 `gpt-4.1-mini`），使用你从大模型创建的数据集。

借助此技术，你可以训练一个小模型，使其在特定任务上的表现接近更大、成本更高的模型。

## 上传训练数据

将你的示例数据集上传到 OpenAI。我们用它来更新模型的权重，并生成与你数据中所包含内容相似的输出。

除了文本补全之外，你还可以训练模型更高效地生成 [结构化的 JSON 输出](https://developers.openai.com/api/docs/guides/structured-outputs) 或 [函数调用](https://developers.openai.com/api/docs/guides/function-calling).



通过点击按钮上传你的数据

    

1. 进入控制面板 > **[微调](https://platform.openai.com/finetune)**.
1. 点击 **+ 创建**.
1. 在 **训练数据**，下，上传你的 JSONL 文件。


  

  

    
调用API上传你的数据

    

假设上述数据已保存到一个文件中 `mydata.jsonl`，你可以使用以下代码将其上传到 OpenAI 平台。注意， `purpose` 设置上传文件的 `fine-tune`:

```bash
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="fine-tune" \
  -F file="@mydata.jsonl"
```


请注意 `id` 在 API 返回的数据中上传文件的——后续的 API 请求中会用到该文件标识符。

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



## 创建微调任务

上传测试数据后， [创建微调任务](https://developers.openai.com/api/reference/resources/fine_tuning) 以使用你提供的训练数据自定义基础模型。创建微调任务时,你必须指定:

- 基础模型（`model`），用于微调。可以是 OpenAI 模型 ID，也可以是先前微调过的模型 ID。请参阅 [模型文档](https://developers.openai.com/api/docs/models).
- 训练文件（`training_file`）ID。这是你在上一步上传的文件。
- 微调方法（`method`）。指定你希望用于定制模型的微调方法。监督微调是默认方法。



通过点击按钮上传你的数据

    

1. 在同一个 **+ 创建** 对话框中，填写必填字段。
1. 将方法选择为监督微调，并选择你想要训练的模型。
1. 准备就绪后，点击 **创建** 以启动任务。


  

  

    
调用API上传你的数据

    

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


API 会返回正在进行的微调任务的相关信息。根据你的训练数据规模，训练过程可能需要数分钟到数小时。你可以 [轮询 API](https://developers.openai.com/api/reference/resources/fine_tuning) 以获取特定任务的最新进度。

当微调任务完成后，你的微调模型即可使用。已完成的微调任务会返回如下数据：

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

请注意 `fine_tuned_model` 属性。这是用于在 [Responses](https://developers.openai.com/api/reference/resources/responses) 或 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) 中发起 API 请求时使用的模型 ID。

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

使用以下方法来检查微调模型的效果。根据需要调整你的提示、数据和微调任务，直到获得满意的结果。微调的最佳方式是持续迭代。

### 与 evals 对比

若要查看你的微调模型是否比原始基础模型表现更好， [请使用评估](https://developers.openai.com/api/docs/guides/evals)。在运行微调作业之前，从步骤 1 收集的同一训练数据集中划分出一部分数据。这部分留出数据在用于评估时充当对照组。请确保训练数据和留出数据在用户输入类型和模型回复的多样性上大致相当。

[详细了解如何运行评估](https://developers.openai.com/api/docs/guides/evals).

### 监控状态

在仪表板中检查微调作业的状态，或通过轮询作业 ID 在API中检查。



在界面中监控

    

1. 前往 [微调仪表板](https://platform.openai.com/finetune).
1. 选择你要监控的任务。
1. 查看状态、检查点、消息和指标。


  

  

    
通过 API 调用进行监控

    

使用以下 curl 命令获取有关你的微调作业的信息：

```bash
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-uL1VKpwx7maorHNbOiDwFIn6 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


该作业包含一个 `fine_tuned_model` 属性，它是你新微调模型的唯一 ID。

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



### 试用你微调后的模型

立即使用你新优化的模型来评估它！当微调模型完成训练后，你可以在任一中使用其 ID，就像使用基础模型一样。 [Responses](https://developers.openai.com/api/reference/resources/responses) 或 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) API 中使用它，就像使用 OpenAI 基础模型一样。



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



### 如需要可使用检查点

Checkpoints 是你以使用的模型。我们会在每个训练轮次结束时为你创建一个完整的模型 checkpoint。当你的微调模型在训练早期表现良好，但随后开始记忆数据集而非学习可泛化知识时——即所谓的 \_过拟合，Checkpoints 非常有用。它们提供了训练过程中不同时间点的自定义模型版本。



在仪表板中查找 checkpoints

    

1. 前往 [微调仪表板](https://platform.openai.com/finetune).
1. 在左侧面板中，选择你要调查的任务。等待任务成功完成。
1. 在右侧面板中，滚动到检查点列表。
1. 将鼠标悬停在任意检查点上，即可看到在 Playground 中启动的链接。
1. 在 Playground 中通过提示测试检查点模型的行为。


  

  

    
查询 API 中的检查点

    

1. 等待作业成功，你可以通过 [查询作业状态](https://developers.openai.com/api/reference/resources/fine_tuning).
1. [查询检查点端点](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 并使用你的微调作业 ID 来访问该微调作业的模型检查点列表。
1. 查找 `fine_tuned_model_checkpoint` 字段以获取模型检查点的名称。
1. 像使用最终的微调模型一样使用此模型。

checkpoint 对象包含 `metrics` 一些数据，可帮助你判断该模型是否有用。示例响应如下：

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

每个 checkpoint 指定以下内容：

- `step_number`: 创建检查点所在的步骤（其中每个 epoch 表示训练集中的步数除以批量大小）
- `metrics`: 一个对象，包含在创建检查点时微调作业在该步骤的指标



目前，仅保存该任务最后三个 epoch 的检查点并可供使用。

## 安全检查

在投入生产环境之前，请审阅并遵循以下安全信息。



### 我们如何评估安全性



微调任务完成后，我们会从 13 个不同的安全类别评估所得到模型的行为。每个类别代表了一个关键领域，如果不对 AI 输出加以适当控制，可能会造成潜在危害。

| 名称                   | 描述                                                                                                                                                                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| advice                 | 违反我们政策的建议或指导。                                                                                                                                                                                                 |
| harassment/threatening | 包含针对任何目标的暴力或严重伤害的骚扰内容。                                                                                                                                                             |
| hate                   | 基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓表达、煽动或宣扬仇恨的内容。针对非受保护群体（例如国际象棋选手）的仇恨内容属于骚扰。 |
| hate/threatening       | 基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓，针对目标群体同时包含暴力或严重伤害的仇恨内容。                                               |
| highly-sensitive       | 违反我们政策的高度敏感数据。                                                                                                                                                                                              |
| illicit                | 提供如何实施违法行为的建议或指导的内容。诸如“如何在商店行窃”的表述就属于此类。                                                                                                               |
| propaganda             | 对违反我们政策的意识形态的赞美或协助。                                                                                                                                                                                  |
| self-harm/instructions | 鼓励实施自杀、自残、进食障碍等自残行为，或为实施此类行为提供指导或建议的内容。                                                                         |
| self-harm/intent       | 说话者表示正在实施或打算实施自杀、自残、进食障碍等自残行为的内容。                                                                                           |
| sensitive              | 违反我们政策的敏感数据。                                                                                                                                                                                                     |
| sexual/minors          | 包含 18 岁以下未成年人的性内容。                                                                                                                                                                          |
| sexual                 | 旨在引发性兴奋的内容，例如对性行为的描述，或推广性服务的内容（性教育和健康内容除外）。                                                                                |
| violence               | 描绘死亡、暴力或人身伤害的内容。                                                                                                                                                                                      |

每个类别都有一个预定义的通过阈值；如果在某个类别中有过多已评估示例未通过，OpenAI 会阻止该微调模型部署。如果你的微调模型未通过安全检查，OpenAI 会在微调任务中发送一条消息，说明哪些类别未达到所需阈值。你可以在微调任务的 moderation checks（审核检查）部分查看结果。







### 如何通过安全检查



除了查看微调任务对象中任何失败的安全检查外，你还可以通过查询来获取失败类别的详细信息： [fine-tuning API events endpoint](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/methods/list)。查找类型为以下的事件： `moderation_checks` 以获取类别结果和强制执行情况的详细信息。此信息可以帮助你缩小需要针对再训练和改进的类别范围。 [model spec](https://cdn.openai.com/spec/model-spec-2024-05-08.html#overview) 其中包含有助于识别需要补充训练数据的规则和示例。

虽然这些评估涵盖了广泛的安全类别，但你仍需对微调后的模型进行自行评估，以确保它适用于你的具体用例。





## 后续步骤

现在你已经掌握了监督微调的基础知识，也可以探索以下其他方法。

[视觉微调



      Learn to fine-tune for computer vision with image inputs.](https://developers.openai.com/api/docs/guides/vision-fine-tuning)

[直接偏好优化



      Fine-tune a model using direct preference optimization (DPO).](https://developers.openai.com/api/docs/guides/direct-preference-optimization)

[强化微调



      Fine-tune a reasoning model by grading its outputs.](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)