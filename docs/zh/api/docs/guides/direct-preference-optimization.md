# 直接偏好优化

> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

[直接偏好优化](https://arxiv.org/abs/2305.18290) （DPO）微调允许你根据提示和响应对来微调模型。这种方法使模型能够从更主观的人类偏好中学习，优化输出结果以更受欢迎。DPO 目前仅支持文本输入和输出。

OpenAI 正在逐步关闭微调平台。该平台不再对
  新用户开放，但现有微调平台用户仍
  能在未来几个月内创建训练任务。
  

  所有微调模型在其基础
  模型 [弃用](https://developers.openai.com/api/docs/deprecations)。之前仍可用于推理。完整时间线请
  [点击此处](https://developers.openai.com/api/docs/deprecations).




<table>
<tbody>
<tr>
<th>How it works</th>
<th>Best for</th>
<th>Use with</th>
</tr>

<tr>
<td>
Provide both a correct and incorrect example response for a prompt. Indicate the correct response to help the model perform better.
</td>
<td>
- Summarizing text, focusing on the right things
- Generating chat messages with the right tone and style
</td>
<td>
`gpt-4.1-2025-04-14`
`gpt-4.1-mini-2025-04-14`
`gpt-4.1-nano-2025-04-14`
</td>
</tr>
</tbody>
</table>

## 数据格式

你的数据集中的每个示例都应包含：

- 一个提示，类似于用户消息。
- 首选输出（理想的助手响应）。
- 非首选输出（次优的助手响应）。

数据应采用 JSONL 格式，每一行 [表示一个示例](https://developers.openai.com/api/reference/resources/fine_tuning) ，结构如下：

```json
{
  "input": {
    "messages": [
      {
        "role": "user",
        "content": "Hello, can you tell me how cold San Francisco is today?"
      }
    ],
    "tools": [],
    "parallel_tool_calls": true
  },
  "preferred_output": [
    {
      "role": "assistant",
      "content": "Today in San Francisco, it is not quite cold as expected. Morning clouds will give away to sunshine, with a high near 68°F (20°C) and a low around 57°F (14°C)."
    }
  ],
  "non_preferred_output": [
    {
      "role": "assistant",
      "content": "It is not particularly cold in San Francisco today."
    }
  ]
}
```

目前，我们仅针对每个示例的单轮对话进行训练，其中偏好与非偏好的消息必须为最后一条助手消息。

## 创建 DPO 微调任务

上传训练数据并使用通过 DPO 微调的模型，遵循 [此处描述的相同流程](https://developers.openai.com/api/docs/guides/model-optimization).

要创建 DPO 微调任务，请使用 `method` 字段，在 [微调任务创建端点](https://developers.openai.com/api/reference/resources/fine_tuning)，中，你可以指定 `type` 以及任何相关的 `hyperparameters`。对于 DPO：

- 将 `type` 参数设置为 `dpo`
- 可选地设置 `hyperparameters` 属性，并配置你希望使用的任何选项。

该 `beta` 超参数是一个仅适用于 DPO 的新选项，它是一个介于 `0` 与 `2` 之间的浮点数，用于控制新模型在多大程度上严格遵循其先前行为，而非与提供的偏好对齐。数值较高时会更保守（偏向先前行为），数值较低时会更激进（更常偏向新提供的偏好）。

你还可以将此值设置为 `auto` （默认值），以使用由平台配置的值。

下面的示例展示了如何使用 OpenAI SDK 配置 DPO 微调任务。

使用 DPO 创建微调任务

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const job = await openai.fineTuning.jobs.create({
  training_file: "file-all-about-the-weather",
  model: "gpt-4o-2024-08-06",
  method: {
    type: "dpo",
    dpo: {
      hyperparameters: { beta: 0.1 },
    },
  },
});
```

```python
from openai import OpenAI

client = OpenAI()

job = client.fine_tuning.jobs.create(
    training_file="file-all-about-the-weather",
    model="gpt-4o-2024-08-06",
    method={
        "type": "dpo",
        "dpo": {
            "hyperparameters": {"beta": 0.1},
        },
    },
)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	job, err := client.FineTuning.Jobs.New(context.Background(), openai.FineTuningJobNewParams{
		TrainingFile: "file-all-about-the-weather",
		Model:        "gpt-4o-2024-08-06",
		Method: openai.FineTuningJobNewParamsMethod{
			Type: "dpo",
			Dpo: openai.DpoMethodParam{Hyperparameters: openai.DpoHyperparameters{
				Beta: openai.DpoHyperparametersBetaUnion{OfFloat: openai.Float(0.1)},
			}},
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(job.ID)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.finetuning.jobs.JobCreateParams;
import com.openai.models.finetuning.methods.DpoHyperparameters;
import com.openai.models.finetuning.methods.DpoMethod;

String fileId = "file-all-about-the-weather";

var job =
    client
        .fineTuning()
        .jobs()
        .create(
            JobCreateParams.builder()
                .model("gpt-4.1-mini-2025-04-14")
                .trainingFile(fileId)
                .method(
                    JobCreateParams.Method.builder()
                        .type(JobCreateParams.Method.Type.DPO)
                        .dpo(
                            DpoMethod.builder()
                                .hyperparameters(DpoHyperparameters.builder().beta(0.1).build())
                                .build())
                        .build())
                .build());

System.out.println(job.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
job = client.fine_tuning.jobs.create(
  model: "gpt-4.1-mini-2025-04-14",
  training_file: "file-all-about-the-weather",
  method_: {
    type: :dpo,
    dpo: {hyperparameters: {beta: 0.1}}
  }
)
puts(job.id)
```


## 结合使用 SFT 和 DPO

目前，OpenAI 提供 [监督微调（SFT）](https://developers.openai.com/api/docs/guides/supervised-fine-tuning) 作为微调任务的默认方法。在运行另一个 DPO 任务之前，先在你偏好的响应（或子集）上执行 SFT，可以显著增强模型的对齐和性能。通过在期望的响应上先微调模型，它可以更好地识别正确的模式，为 DPO 提供坚实的基础来优化行为。

推荐的工作流如下：

1. 使用你首选响应的子集，通过 SFT 对基础模型进行微调。重点确保数据质量和任务的代表性。
2. 以 SFT 微调后的模型为起点，应用 DPO 基于偏好比较来调整模型。

## 安全检查

在生产环境发布之前，请查看并遵循以下安全信息。



### 我们如何进行安全评估



微调作业完成后，我们会评估所得模型在13个不同安全类别中的行为。每个类别代表一个关键领域，在这些领域中，如果控制不当，AI输出可能造成危害。

| 名称                   | 描述                                                                                                                                                                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| advice                 | 违反我们政策的建议或指导。                                                                                                                                                                                                 |
| harassment/threatening | 包含针对任何目标的暴力或严重伤害的骚扰内容。                                                                                                                                                             |
| hate                   | 基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓表达、煽动或宣扬仇恨的内容。针对非受保护群体（如棋手）的仇恨内容属于骚扰。 |
| hate/threatening       | 基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓，对目标群体包含暴力或严重伤害的仇恨内容。                                               |
| highly-sensitive       | 违反我们政策的高度敏感数据。                                                                                                                                                                                              |
| illicit                | 就如何实施非法行为提供建议或指导的内容。类似“如何入店行窃”的表述即属此类。                                                                                                               |
| propaganda             | 对违反我们政策的意识形态的赞扬或协助。                                                                                                                                                                                  |
| self-harm/instructions | 鼓励实施自残行为（如自杀、割伤和进食障碍），或就如何实施此类行为提供指导或建议的内容。                                                                         |
| self-harm/intent       | 说话者表示正在或意图实施自残行为（如自杀、割伤和进食障碍）的内容。                                                                                           |
| 敏感              | 违反我们政策的敏感数据。                                                                                                                                                                                                     |
| 性内容/未成年人          | 包含未满18岁个人的性内容。                                                                                                                                                                          |
| 性内容                 | 旨在引起性兴奋的内容，例如性活动描述，或推广性服务的内容（不包括性教育和健康）。                                                                                |
| 暴力               | 描绘死亡、暴力或身体伤害的内容。                                                                                                                                                                                      |

每个类别都有预定义的通过阈值；如果某个类别中评估失败的示例过多，OpenAI将阻止微调模型部署。如果您的微调模型未通过安全检查，OpenAI会在微调作业中发送消息，说明哪些类别未达到要求的阈值。您可以在微调作业的审核检查部分查看结果。







### 如何通过安全检查



除了查看微调作业对象中任何失败的安全检查外，你还可以通过查询 [微调 API 事件端点](https://platform.openai.com/docs/api-reference/fine-tuning/list-events)。来检索哪些类别失败的详细信息。查找类型为 `moderation_checks` 的事件，以获取类别结果和执行详情。此信息可以帮助你缩小需要针对再训练和改进的类别范围。 [模型规范](https://cdn.openai.com/spec/model-spec-2024-05-08.html#overview) 中包含的规则和示例有助于识别需要额外训练数据的领域。

虽然这些评估涵盖了广泛的安全类别，但你仍应对微调后的模型进行自己的评估，以确保其适用于你的用例。





## 后续步骤

现在你已经了解了 DPO 的基础知识，也可以探索以下其他方法。

[监督微调



      Fine-tune a model by providing correct outputs for sample inputs.](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)

[视觉微调



      Learn to fine-tune for computer vision with image inputs.](https://developers.openai.com/api/docs/guides/vision-fine-tuning)

[强化学习微调



      Fine-tune a reasoning model by grading its outputs.](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)