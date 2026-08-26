# 监督微调

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过将 `.md` 附加到页面 URL 来获取文档页面的 Markdown 版本。

监督式微调（SFT）允许你使用针对特定用例的示例来训练 OpenAI 模型。结果是定制化的模型，能够更可靠地生成你期望的风格和内容。

OpenAI 正在逐步关闭微调平台。该平台将不再
  对新用户开放，但现有的微调平台用户在未来几个月内仍将
  能够创建训练任务。
  

  所有微调后的模型在其基础
  模型被 [弃用](https://developers.openai.com/api/docs/deprecations)。之前，仍可用于推理。完整的时间线见
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

监督式微调包含四个主要部分：

1. 构建你的训练数据集，以确定“良好”的标准
1. 上传包含示例提示和期望模型输出的训练数据集
1. 使用你的训练数据为基础模型创建微调作业
1. 使用微调后的模型评估你的结果

**先做好评测！** 只有在设置好评测之后，才投入微调。你
  需要一种可靠的方法来确定你的微调模型是否表现
  优于基础模型。
  

  [设置评测 →](https://developers.openai.com/api/docs/guides/evals)

## 构建你的数据集

构建一个健壮、具有代表性的数据集，以便从微调模型中获得有用的结果。请使用以下技巧和注意事项。

### 示例数量正确

- 微调可提供的最少示例数量为 10
- 50–100 个示例上进行微调可带来改进，但适合你的数量因用例而异
- 我们建议从 50 个精心设计的演示开始，并 [评估结果](https://developers.openai.com/api/docs/guides/evals)

如果性能在 50 个优质示例下有所提升，可尝试增加示例以观察进一步效果。若 50 个示例毫无影响，则应在添加训练数据前重新考虑任务或提示词。

### 什么构成了好的示例

- 无论你的应用预期会处理哪些提示和输出，都应尽可能贴近实际情况
- 具体、清晰的问题与回答
- 使用历史数据、专家数据、日志数据，或 [其他类型的收集数据](https://developers.openai.com/api/docs/guides/evals)

### 格式化你的数据

- 使用 [JSONL 格式](https://jsonlines.org/)，训练数据文件的每一行包含一个完整的 JSON 结构
- 使用 [聊天补全格式](https://developers.openai.com/api/reference/resources/fine_tuning)
- 你的文件必须至少有 10 行



JSONL 格式示例文件

    

一个 JSONL 训练数据示例，其中模型调用一个 `get_weather` 函数：

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

    

训练数据文件的每一行包含如下的一个 JSON 结构，其中既包含一个示例用户提示词，也包含模型给出的正确响应（作为 `assistant` 消息）。

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

为较小模型构建训练数据集的一种方法是对大模型的结果进行蒸馏，以创建用于监督微调的训练数据。该技术的一般流程为：

- 为较大的模型（如 `gpt-4.1`）调整提示词，直到在评估标准上表现优异。
- 使用任何方便的技术捕获模型生成的结果——请注意， [Responses API](https://developers.openai.com/api/reference/resources/responses) 默认将模型响应存储 30 天。
- 使用符合标准的大模型捕获的响应，按照上述工具和技术生成数据集。
- 使用从大模型创建的数据集调整较小的模型（如 `gpt-4.1-mini`）。

这种技术可以让你训练一个小模型，使其在特定任务上的表现与更大、更昂贵的模型类似。

## 上传训练数据

将你的示例数据集上传到 OpenAI。我们使用它来更新模型的权重，并生成与你的数据中类似的输出。

除了文本补全之外，你还可以训练模型以更有效地生成 [结构化 JSON 输出](https://developers.openai.com/api/docs/guides/structured-outputs) 或 [函数调用](https://developers.openai.com/api/docs/guides/function-calling).



通过按钮点击上传你的数据

    

1. 导航到仪表盘 > **[微调](https://platform.openai.com/finetune)**.
1. 点击 **+ 创建**.
1. 在 **训练数据**，下，上传你的 JSONL 文件。


  

  

    
调用 API 上传你的数据

    

假设上述数据已保存到名为 `mydata.jsonl`，的文件中，你可以使用以下代码将其上传到 OpenAI 平台。请注意， `purpose` 上传文件的 `fine-tune`:

```bash
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="fine-tune" \
  -F file="@mydata.jsonl"
```


请注意 `id` 从 API 返回的数据中上传文件的，后续的 API 请求中需要用到该文件标识符。

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

上传测试数据后， [创建微调任务](https://developers.openai.com/api/reference/resources/fine_tuning) 以使用你提供的训练数据自定义基础模型。创建微调任务时，你必须指定：

- 一个基础模型（`model`）用于微调。这可以是 OpenAI 模型 ID，也可以是先前微调过的模型 ID。请参阅 [模型文档](https://developers.openai.com/api/docs/models).
- 一个训练文件（`training_file`）ID。这是你在上一步中上传的文件。
- 一种微调方法（`method`）。这指定了你想要用于自定义模型的微调方法。监督微调是默认方法。



通过按钮点击上传你的数据

    

1. 在同一个 **+ 创建** 模态框中，如上所述，填写必填字段。
1. 选择监督微调作为方法，并选择你希望训练的模型。
1. 准备好后，点击 **创建** 以启动作业。


  

  

    
调用 API 上传你的数据

    

通过调用 [fine-tuning API](https://developers.openai.com/api/reference/resources/fine_tuning):

```bash
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-RCnFCYRhFDcq1aHxiYkBHw",
    "model": "gpt-4.1-nano-2025-04-14"
  }'
```


API 会返回正在进行的微调作业的信息。根据训练数据的大小，训练过程可能需要几分钟或几小时。你可以 [轮询 API](https://developers.openai.com/api/reference/resources/fine_tuning) 以获取特定作业的更新。

当微调作业完成时，你的微调模型即可使用。完成的微调作业会返回如下数据：

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

注意 `fine_tuned_model` 属性。这是用于 [Responses](https://developers.openai.com/api/reference/resources/responses) 或 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) 中使用微调模型发出 API 请求的模型 ID。

以下是使用你的微调模型 ID 调用 Responses API 的示例：

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

使用下面的方法检查你的微调模型表现如何。根据需要调整你的提示词、数据和微调任务，直到得到你想要的结果。微调的最佳方式是持续迭代。

### 与评测对比

要查看你的微调模型是否优于原始基础模型， [使用 evals](https://developers.openai.com/api/docs/guides/evals)。在运行微调作业之前，请从你在步骤 1 中收集的同一训练数据集中划分出部分数据。当你将这部分留出数据用于 evals 时，它作为对照组。确保训练数据和留出数据在用户输入类型和模型响应方面具有大致相同的多样性。

[了解有关运行 evals 的更多信息](https://developers.openai.com/api/docs/guides/evals).

### 监控状态

在仪表板中检查微调作业的状态，或通过轮询 API 中的作业 ID 来检查。



在界面中监控

    

1. 导航到 [微调仪表盘](https://platform.openai.com/finetune).
1. 选择你要监控的任务。
1. 查看状态、检查点、消息和指标。


  

  

    
使用 API 调用进行监控

    

使用此 curl 命令获取微调作业的相关信息：

```bash
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-uL1VKpwx7maorHNbOiDwFIn6 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


该作业包含一个 `fine_tuned_model` 属性，即你的新微调模型的唯一 ID。

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



### 尝试使用你微调后的模型

使用新优化后的模型来评估它！当微调模型完成训练后，在 [Responses](https://developers.openai.com/api/reference/resources/responses) 或 [Chat Completions](https://developers.openai.com/api/reference/resources/chat) API 中使用其 ID，就像使用 OpenAI 基础模型一样。



在 Playground 中使用你的模型

    

1. 导航到你的微调作业，位置在 [仪表盘](https://platform.openai.com/finetune).
1. 在右侧面板中，导航到 **输出模型** 并复制模型 ID。它应以 `ft:…`
1. 打开 [Playground](https://platform.openai.com/playground).
1. 在 **模型** 下拉菜单中，粘贴模型 ID。在这里，你还应看到创建的其他微调模型。
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



### 如需，可使用检查点

检查点是你可以使用的模型。在每个训练轮次结束时，我们会为你创建完整的模型检查点。当你的微调模型早期表现良好，但后来却开始记忆数据集而非学习可泛化的知识时，检查点非常有用——这种情况称为 \_过拟合。检查点提供了过程中不同时刻的自定义模型版本。



在仪表盘中查找检查点

    

1. 导航到 [微调仪表盘](https://platform.openai.com/finetune).
1. 在左侧面板中，选择要调查的作业。等待其完成。
1. 在右侧面板中，滚动到检查点列表。
1. 悬停在任何检查点上，即可看到在 Playground 中启动的链接。
1. 通过在 Playground 中提示来测试检查点模型的行为。


  

  

    
查询 API 以获取检查点

    

1. 等待任务成功，你可以通过 [查询任务状态](https://developers.openai.com/api/reference/resources/fine_tuning).
1. [查询检查点端点](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) 使用你的微调任务 ID 来访问该微调任务的模型检查点列表。
1. 找到 `fine_tuned_model_checkpoint` 字段以获取模型检查点的名称。
1. 像使用最终微调模型一样使用这个模型。

检查点对象包含 `metrics` 有助于你判断该模型有用性的数据。例如，响应看起来如下：

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

每个检查点指定：

- `step_number`：创建检查点时所处的步骤（其中每个 epoch 为训练集中的步骤数除以批次大小）
- `metrics`：一个对象，包含创建检查点时微调作业在该步骤的指标



目前，仅保存并提供该任务最后三个轮次的检查点可供使用。

## 安全检查

在生产环境中启动之前，请审阅并遵循以下安全信息。

我们如何进行安全评估

一旦微调作业完成，我们会在13个不同的安全类别中评估所得模型的行为。每个类别代表一个关键领域，如果未加以适当控制，AI输出可能在这些领域造成伤害。

| 名称                   | 描述                                                                                                                                                                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| advice                 | 违反我们政策的建议或指导。                                                                                                                                                                                                 |
| harassment/threatening | 包含针对任何目标的暴力或严重伤害的骚扰内容。                                                                                                                                                             |
| hate                   | 基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓表达、煽动或宣扬仇恨的内容。针对非受保护群体（如国际象棋玩家）的仇恨内容属于骚扰。 |
| hate/threatening       | 基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓，包含针对目标群体的暴力或严重伤害的仇恨内容。                                               |
| highly-sensitive       | 违反我们政策的高度敏感数据。                                                                                                                                                                                              |
| illicit                | 提供如何实施非法行为建议或指导的内容。像“如何入店行窃”这样的短语就属于此类别。                                                                                                               |
| propaganda             | 对违反我们政策的意识形态的赞扬或协助。                                                                                                                                                                                  |
| self-harm/instructions | 鼓励实施自残行为（如自杀、割伤和饮食失调）或提供如何实施此类行为指导或建议的内容。                                                                         |
| self-harm/intent       | 说话者表示自己正在或打算实施自残行为（如自杀、割伤和饮食失调）的内容。                                                                                           |
| 敏感              | 违反我们政策的敏感数据。                                                                                                                                                                                                     |
| 性相关/未成年人          | 包含未满 18 岁个人的性相关内容。                                                                                                                                                                          |
| 性相关                 | 旨在引起性兴奋的内容，例如性活动描述，或宣传性服务（不包括性教育和健康内容）。                                                                                |
| 暴力               | 描绘死亡、暴力或身体伤害的内容。                                                                                                                                                                                      |

每个类别都有预定义的通过阈值；如果某个类别中评估示例的失败数量过多，OpenAI将阻止微调模型部署。如果你的微调模型未通过安全检查，OpenAI会在微调作业中发送一条消息，说明哪些类别未达到所需阈值。你可以在微调作业的审核检查部分查看结果。

如何通过安全检查

除了查看微调作业对象中失败的安全检查结果外，你还可以通过查询 [微调 API 事件接口](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/methods/list)。来获取失败类别的详细信息。查找类型为 `moderation_checks` 的事件，以了解类别结果和执行详情。这些信息可以帮助你缩小需要针对性重新训练和改进的类别范围。 [模型规范](https://cdn.openai.com/spec/model-spec-2024-05-08.html#overview) 中包含的规则和示例可以帮助你识别需要补充训练数据的领域。

虽然这些评估涵盖了广泛的安全类别，但你也应对微调模型进行自己的评估，以确保它适合你的使用场景。

## 后续步骤

既然你已经了解了监督式微调的基础知识，也请探索以下其他方法。

[视觉微调



      Learn to fine-tune for computer vision with image inputs.](https://developers.openai.com/api/docs/guides/vision-fine-tuning)

[直接偏好优化



      Fine-tune a model using direct preference optimization (DPO).](https://developers.openai.com/api/docs/guides/direct-preference-optimization)

[强化微调



      Fine-tune a reasoning model by grading its outputs.](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)