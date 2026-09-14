# Direct preference optimization

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

[Direct Preference Optimization](https://arxiv.org/abs/2305.18290) （DPO）微调允许你根据提示和成对的回复对模型进行微调。这种方法使模型能够从更具主观性的人类偏好中学习，优化为更可能受到青睐的输出。DPO 目前仅支持文本输入和输出。

OpenAI 正在逐步关停微调平台。该平台不再
  向新用户开放，但现有微调平台的用户在未来几个月
  内仍可创建训练任务。
  

  所有微调后的模型在对应的基座模型被弃用
  之前将继续可用于 [弃用](https://developers.openai.com/api/docs/deprecations)。完整的时间表请参见
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

数据集中的每个示例应包含：

- 一个提示词，例如用户消息。
- 一个首选输出（理想的助手回复）。
- 一个非首选输出（欠佳的助手回复）。

数据应以 JSONL 格式编排，每一行 [表示一个示例](https://developers.openai.com/api/reference/resources/fine_tuning) 采用如下结构：

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

目前，我们仅针对每个示例训练一轮对话，其中首选和非首选消息需要作为最后一条助手消息。

## 创建 DPO 微调任务

上传训练数据并使用通过 DPO 微调的模型遵循本页 [此处描述的相同流程](https://developers.openai.com/api/docs/guides/model-optimization).

要创建 DPO 微调任务，请使用 `method` 字段，在 [微调任务创建端点](https://developers.openai.com/api/reference/resources/fine_tuning)，中，你可以指定 `type` 以及任何关联的 `hyperparameters`。对于 DPO:

- 设置 `type` 参数为 `dpo`
- （可选）设置 `hyperparameters` 属性，并传入你想要配置的任何选项。

该 `beta` hyperparameter 是一个仅适用于 DPO 的新选项。它是一个介于 `0` 和 `2` 之间的浮点数，用于控制新模型在多大程度上保持其原有行为，而不是与所提供的偏好对齐。数值越高越保守（偏向原有行为），数值越低则越激进（更频繁地偏向新提供的偏好）。

你也可以将该值设置为 `auto` （默认值），以使用平台配置的值。

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
    dpo: { hyperparameters: { beta: 0.1 } }
  }
)
puts(job.id)
```


## 同时使用 SFT 和 DPO

目前，OpenAI 提供 [监督微调（SFT）](https://developers.openai.com/api/docs/guides/supervised-fine-tuning) 作为微调任务的默认方法。在运行另一个 DPO 任务之前，先对你期望的回复（或其子集）执行 SFT，可以显著增强模型对齐效果和性能。通过先在期望的回复上微调模型，可以让模型更好地识别正确的模式，从而为 DPO 进一步优化行为打下坚实的基础。

推荐使用以下工作流：

1. 使用你偏好的部分回复，通过 SFT 微调基础模型。重点确保数据质量以及任务的多样性和代表性。
2. 以 SFT 微调后的模型作为起点，并应用 DPO 根据偏好比较对模型进行调整。

## 安全检查

在生产环境中上线前，请查阅并遵循以下安全信息。



### 我们如何进行安全评估



一旦微调任务完成，我们会从 13 个不同的安全类别评估所生成模型的行为。每个类别都代表一个关键领域，在这些领域中，如果没有得到适当控制，AI 输出可能会造成潜在危害。

| 名称                   | 描述                                                                                                                                                                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| advice                 | 违反我们政策的建议或指导。                                                                                                                                                                                                 |
| harassment/threatening | 骚扰内容，同时包含针对任何目标的暴力或严重伤害。                                                                                                                                                             |
| hate                   | 基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓表达、煽动或宣扬仇恨的内容。针对非受保护群体（例如国际象棋玩家）的仇恨内容属于骚扰。 |
| hate/threatening       | 基于种族、性别、民族、宗教、国籍、性取向、残疾状况或种姓，针对目标群体同时包含暴力或严重伤害的仇恨内容。                                               |
| highly-sensitive       | 违反我们政策的高度敏感数据。                                                                                                                                                                                              |
| illicit                | 提供如何实施违法行为的建议或指导的内容。像“如何入店行窃”这样的短语就属于这一类。                                                                                                               |
| propaganda             | 对违反我们政策的意识形态的赞美或协助。                                                                                                                                                                                  |
| self-harm/instructions | 鼓励实施自我伤害行为（例如自杀、自残和饮食失调）的内容，或提供如何实施此类行为的指导或建议的内容。                                                                         |
| self-harm/intent       | 说话者表达他们正在或打算实施自我伤害行为（例如自杀、自残和饮食失调）的内容。                                                                                           |
| 敏感              | 违反我们政策的敏感数据。                                                                                                                                                                                                     |
| sexual/minors          | 包含 18 岁以下未成年人的性内容。                                                                                                                                                                          |
| sexual                 | 旨在引发性兴奋的内容，例如对性行为的描述，或推广性服务的内容（不包括性教育和性健康）。                                                                                |
| violence               | 描绘死亡、暴力或身体伤害的内容。                                                                                                                                                                                      |

每个类别都有一个预定义的通过阈值；如果某个类别中评估失败的样本过多，OpenAI 会阻止该微调模型上线。如果你的微调模型未通过安全检查，OpenAI 会在微调任务中发送一条消息，说明哪些类别未达到所需阈值。你可以在微调任务的 moderation checks（内容审核检查）部分查看结果。







### 如何通过安全检查



除了查看微调作业对象中任何未通过的安全检查之外，你还可以通过查询 [微调 API 事件端点](https://platform.openai.com/docs/api-reference/fine-tuning/list-events)。来获取有关哪些类别未通过的详细信息。查找类型为 `moderation_checks` 的事件，以了解类别结果和强制执行的详细信息。这些信息可以帮助你缩小需要重新训练和改进的目标类别范围。 [模型规范](https://cdn.openai.com/spec/model-spec-2024-05-08.html#overview) 提供了可帮助你识别需要补充训练数据的领域的规则和示例。

虽然这些评估涵盖了广泛的安全类别，但请对微调后的模型进行你自己的评估，以确保它适合你的用例。





## 后续步骤

现在你已经了解了 DPO 的基础知识，还可以探索以下其他方法。

[Supervised fine-tuning



      Fine-tune a model by providing correct outputs for sample inputs.](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)

[Vision fine-tuning



      Learn to fine-tune for computer vision with image inputs.](https://developers.openai.com/api/docs/guides/vision-fine-tuning)

[Reinforcement fine-tuning



      Fine-tune a reasoning model by grading its outputs.](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)