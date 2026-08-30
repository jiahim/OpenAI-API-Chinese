# 直接偏好优化

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

[直接偏好优化](https://arxiv.org/abs/2305.18290) (DPO) 微调允许你根据提示和成对的回复对模型进行微调。这种方法使模型能够从更主观的人类偏好中学习，优化生成更受偏好的输出。DPO 目前仅支持文本输入和输出。

OpenAI 正在逐步关停微调平台。该平台已不再
  对新用户开放，但现有微调平台的用户在未来几个月内仍
  可以创建训练任务。
  

  所有微调模型在其基础模型被
  弃用 [弃用前](https://developers.openai.com/api/docs/deprecations)。完整的时间表请参见
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

数据集中的每个示例都应包含：

- 一个提示（prompt），类似于用户消息。
- 一个首选输出（一份理想的助手回复）。
- 一个非首选输出（一份欠佳的助手回复）。

数据应采用 JSONL 格式，每一行 [表示一个示例](https://developers.openai.com/api/reference/resources/fine_tuning) 结构如下：

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

目前，我们仅针对每个示例训练单轮对话，其中首选和非首选消息必须是最后一条助手消息。

## 创建 DPO 微调任务

上传训练数据并使用通过 DPO 微调的模型，按照 [此处所述的相同流程](https://developers.openai.com/api/docs/guides/model-optimization).

若要创建 DPO 微调任务，请使用 `method` 字段，调用 [微调任务创建端点](https://developers.openai.com/api/reference/resources/fine_tuning)，在其中你可以指定 `type` 以及任何相关的 `hyperparameters`。对于 DPO：

- 将 `type` 参数设置为 `dpo`
- 可选地设置 `hyperparameters` 属性，并配置你需要的任何选项。

该 `beta` hyperparameter 是一个仅在 DPO 中可用的新选项。它是一个介于 `0` 和 `2` 之间的浮点数，用于控制新模型在多大程度上保持其先前行为，又在多大程度上与所提供的偏好对齐。较高的数值会更为保守（倾向于保持先前行为），较低的数值则会更为激进（更频繁地倾向于新提供的偏好）。

你也可以将该值设置为 `auto` （默认值），以使用平台配置的数值。

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


## 同时使用 SFT 和 DPO

目前，OpenAI 提供 [监督微调（SFT）](https://developers.openai.com/api/docs/guides/supervised-fine-tuning) 作为微调任务的默认方法。先对首选响应（或其子集）执行 SFT，然后再运行另一个 DPO 任务，可以显著增强模型对齐效果和性能。通过首先在期望响应上对模型进行微调，它能够更好地识别正确的模式，从而为 DPO 优化行为奠定坚实基础。

推荐的一个工作流如下：

1. 使用你偏好的回复子集，通过 SFT 微调基础模型。重点关注数据质量以及任务数据的代表性。
2. 以 SFT 微调后的模型为起点，再应用 DPO，根据偏好对比对模型进行调整。

## 安全检查

在投入生产之前，请查看并遵循以下安全信息。



### 我们的安全评估方式



一旦微调任务完成，我们会跨 13 个不同的安全类别评估所得到模型的行为。每个类别都代表一个关键领域，如果未加以适当控制，AI 输出可能会在其中造成潜在危害。

| 名称                   | 描述                                                                                                                                                                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| advice                 | 违反我们策略的建议或指导。                                                                                                                                                                                                 |
| harassment/threatening | 骚扰内容，且包含针对任何目标的暴力或严重伤害。                                                                                                                                                             |
| hate                   | 基于种族、性别、民族、宗教、国籍、性取向、残障状况或种姓表达、煽动或宣扬仇恨的内容。针对非受保护群体（例如棋手）的仇恨内容属于骚扰。 |
| hate/threatening       | 针对基于种族、性别、民族、宗教、国籍、性取向、残障状况或种姓的目标群体，仇恨内容且包含暴力或严重伤害。                                               |
| highly-sensitive       | 违反我们策略的高敏感数据。                                                                                                                                                                                              |
| illicit                | 提供如何实施违法行为的建议或指引的内容。例如"如何入店行窃"之类的表述即属于此类。                                                                                                               |
| propaganda             | 对违反我们策略的意识形态的赞美或协助。                                                                                                                                                                                  |
| self-harm/instructions | 鼓励实施自我伤害行为（例如自杀、自残和饮食失调）的内容，或提供实施此类行为的指导或建议。                                                                         |
| self-harm/intent       | 说话者表示正在实施或打算实施自我伤害行为（例如自杀、自残和饮食失调）的内容。                                                                                           |
| 敏感类              | 违反我们政策的敏感数据。                                                                                                                                                                                                     |
| 性相关/未成年人          | 涉及未满 18 岁个人的性相关内容。                                                                                                                                                                          |
| 性相关                 | 旨在引发性兴奋的内容，例如对性行为的描述，或推广性服务的内容（不包括性教育和性健康）。                                                                                |
| 暴力               | 描绘死亡、暴力或人身伤害的内容。                                                                                                                                                                                      |

每个类别都有一个预定义的通过阈值；如果某个类别中评估未通过的例子过多，OpenAI 会阻止该微调模型部署。如果你的微调模型未通过安全检查，OpenAI 会在微调任务中发送一条消息，说明哪些类别未达到所需阈值。你可以在微调任务的审核检查部分查看结果。







### 如何通过安全检查



除了查看微调任务对象中任何失败的安全检查之外，你还可以通过查询以下接口来检索失败的类别详细信息： [fine-tuning API 事件端点](https://platform.openai.com/docs/api-reference/fine-tuning/list-events)。查找类型为 `moderation_checks` 的事件，以获取类别结果和强制执行情况的详细信息。这些信息可以帮助你缩小需要针对再训练和改进的类别范围。 [模型规范](https://cdn.openai.com/spec/model-spec-2024-05-08.html#overview) 提供了相关规则和示例，可以帮助你识别需要补充训练数据的领域。

虽然这些评估涵盖了广泛的安全类别，但你仍应对微调后的模型进行自己的评估，以确保它适用于你的用例。





## 后续步骤

既然你已经了解了 DPO 的基础知识，也可以探索以下其他方法。

[监督微调



      Fine-tune a model by providing correct outputs for sample inputs.](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)

[视觉微调



      Learn to fine-tune for computer vision with image inputs.](https://developers.openai.com/api/docs/guides/vision-fine-tuning)

[强化微调



      Fine-tune a reasoning model by grading its outputs.](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)