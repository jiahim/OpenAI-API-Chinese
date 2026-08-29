# 微调最佳实践

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取相应页面的 Markdown 版本。

如果微调模型未取得理想效果，可以考虑对流程进行以下迭代。

OpenAI 正在逐步停用微调平台。该平台已不再
  向新用户开放，但现有微调平台用户在未来几个月内仍可
  创建训练任务。
  

  所有微调模型在其基础
  模型被 [弃用](https://developers.openai.com/api/docs/deprecations)。之前都将持续可用于推理。完整时间表请参见
  [此处](https://developers.openai.com/api/docs/deprecations).

### 迭代优化数据质量

以下是几种可以考虑提升你的训练数据集质量的方法：

- 收集示例，以针对剩余问题。
  - 如果模型在某些方面仍然表现不佳，请添加直接展示模型如何正确完成这些方面的训练示例。
- 仔细检查现有示例中存在的问题。
  - 如果你的模型存在语法、逻辑或风格方面的问题，请检查你的数据是否也存在相同的问题。例如，如果模型现在会说“我将为你安排这次会议”（而它本不该这么说），请查看现有示例是否在教导模型可以说自己能够做到它实际上无法做到的事
- 考虑数据的平衡性和多样性。
  - 如果数据中 60% 的助手回复都说“我无法回答这个问题”，但推理时只有 5% 的回复应该这样表示，那么你很可能会得到过多的拒绝回复。
- 确保你的训练示例包含生成回复所需的全部信息。
  - 如果我们希望模型根据用户的个人特质来夸赞用户，而某个训练示例中包含了针对前文对话中未出现的特质的助手夸赞，模型可能会学会凭空捏造信息。
- 查看训练示例之间的一致性和协调性。
  - 如果训练数据由多个人创建，模型的表现很可能受限于人与人之间的一致性和协调程度。例如，在文本提取任务中，如果人们只对 70% 的提取片段达成一致，模型的表现很可能也无法超过这一水平。
- 确保你的所有训练示例采用与推理时一致的格式。

### 迭代数据量

当你对示例的质量和分布感到满意后，可以考虑增加训练示例的数量。这通常有助于模型更好地学习任务，尤其是在应对可能出现的“边界情况”时。我们预计每当你将训练示例数量翻倍时，都会有相近幅度的提升。你可以粗略估算通过增加训练数据规模所能带来的预期质量提升：

- 在当前数据集上进行微调
- 在当前数据集的一半上进行微调
- 观察两者之间的质量差距

一般来说，如果你需要做出取舍，数量较少的高质量数据通常比数量较多的低质量数据更有效。

### 迭代优化超参数

超参数控制着模型权重在训练过程中的更新方式。几个常见的选项包括：

- **训练轮次**：训练轮次是指模型在训练过程中对整个训练数据集完成的一次完整遍历。通常你需要运行多个训练轮次，让模型能够迭代地优化其权重。
- **学习率倍率**：调整模型学习参数更新幅度的系数。较大的倍率可以加快训练速度，而较小的倍率则倾向于使训练更慢但更稳定。
- **批大小**：模型在更新权重之前，在一次前向和反向传播中处理的样本数量。较大的批大小会减慢训练速度，但可能带来更稳定的结果。

我们建议在初始训练时不要指定这些参数中的任何一个，以便我们根据数据集规模为你选择默认值，然后在观察到以下情况时再进行调整：

- 如果模型没有尽可能地遵循训练数据，请将训练轮数增加 1 或 2。
  - 这在存在单一理想补全（或一小组相近的理想补全）的任务中更为常见。一些示例包括分类、实体抽取或结构化解析。这些通常是相对参考答案可以计算最终准确率指标的任务。
- 如果模型的多样性低于预期，请将训练轮数减少 1 或 2。
  - 这在可能存在多种合理补全的任务中更为常见。
- 如果模型似乎没有收敛，请提高学习率倍率。

你可以按如下方式设置超参数：

设置超参数

```javascript
const fineTune = await openai.fineTuning.jobs.create({
  training_file: "file-abc123",
  model: "gpt-4o-mini-2024-07-18",
  method: {
    type: "supervised",
    supervised: {
      hyperparameters: { n_epochs: 2 },
    },
  },
});
```

```python
from openai import OpenAI

client = OpenAI()

client.fine_tuning.jobs.create(
    training_file="file-abc123",
    model="gpt-4o-mini-2024-07-18",
    method={
        "type": "supervised",
        "supervised": {
            "hyperparameters": {"n_epochs": 2},
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
		TrainingFile: "file-abc123",
		Model:        "gpt-4o-mini-2024-07-18",
		Method: openai.FineTuningJobNewParamsMethod{
			Type: "supervised",
			Supervised: openai.SupervisedMethodParam{Hyperparameters: openai.SupervisedHyperparameters{
				NEpochs: openai.SupervisedHyperparametersNEpochsUnion{OfInt: openai.Int(2)},
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
import com.openai.models.finetuning.methods.SupervisedHyperparameters;
import com.openai.models.finetuning.methods.SupervisedMethod;

String fileId = "file-abc123";

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
                        .type(JobCreateParams.Method.Type.SUPERVISED)
                        .supervised(
                            SupervisedMethod.builder()
                                .hyperparameters(
                                    SupervisedHyperparameters.builder().nEpochs(2).build())
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
  training_file: "file-abc123",
  method_: {
    type: :supervised,
    supervised: {hyperparameters: {n_epochs: 2}}
  }
)
puts(job.id)
```


## 调整你的数据集

如果你没有看到理想的微调效果，另一个选择是回头修改你的训练数据。在收集用于数据集的示例时，可以参考以下一些最佳实践。

### 训练数据集与测试数据集

收集完示例后，将数据集拆分为训练集和测试集。训练集用于微调作业，测试集用于 [评估](https://developers.openai.com/api/docs/guides/evals).

当你提交同时包含训练文件和测试文件的微调作业时，我们会在训练过程中提供两者的相关统计数据。这些统计数据能让你了解模型的提升幅度。尽早构建测试集有助于你 [在训练后评估模型](https://developers.openai.com/api/docs/guides/evals) ，通过与测试集基准进行对比。

### 为训练数据编写提示词

将微调之前对模型最有效的指令和提示词集合包含在每个训练示例中。这有助于你获得最佳且最通用的结果，尤其是在训练示例较少（少于 100 个）的情况下。

你可能倾向于缩短每个示例中重复的指令或提示词以节省成本。如果没有重复的指令，可能需要更多的训练示例才能取得良好效果，因为模型必须完全通过示例来学习。

### 训练数据中的多轮对话

要在 [多轮对话](https://developers.openai.com/api/docs/guides/conversation-state)，上进行模型微调，请在训练数据的每一行中包含多个 `user` 和 `assistant` 消息组成的 `messages` 数组。

使用可选的 `weight` 键（值设为 0 或 1）可针对特定的助手消息禁用微调。下面给出一些在聊天格式中控制 `weight` 的示例：

```jsonl
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already.", "weight": 1}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'Romeo and Juliet'?"}, {"role": "assistant", "content": "William Shakespeare", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Oh, just some guy named William Shakespeare. Ever heard of him?", "weight": 1}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "How far is the Moon from Earth?"}, {"role": "assistant", "content": "384,400 kilometers", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Around 384,400 kilometers. Give or take a few, like that really matters.", "weight": 1}]}
```

### Token limits

Token 数量限制取决于模型。以下是各模型允许的最大上下文长度概览：

| Model                     | 推理上下文长度 | 示例上下文长度 |
| ------------------------- | ------------------------ | ----------------------- |
| `gpt-4.1-2025-04-14`      | 128,000 tokens           | 65,536 tokens           |
| `gpt-4.1-mini-2025-04-14` | 128,000 tokens           | 65,536 tokens           |
| `gpt-4.1-nano-2025-04-14` | 128,000 tokens           | 65,536 tokens           |
| `gpt-4o-2024-08-06`       | 128,000 tokens           | 65,536 tokens           |
| `gpt-4o-mini-2024-07-18`  | 128,000 tokens           | 65,536 tokens           |

超过默认长度的示例会被截断到最大上下文长度，训练示例末尾的 token 会被移除。为确保整个训练示例能放入上下文中，请让消息内容中的 token 总数保持在限制范围内。

使用 [分词器工具](https://platform.openai.com/tokenizer) 计算 token 数，或通过代码计算，示例见这个 [cookbook 示例](https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken).

在上传数据之前，你可能希望检查格式和潜在的 token 成本——cookbook 中提供了相关操作示例。

[微调数据格式校验



      Learn about fine-tuning data formatting](https://developers.openai.com/cookbook/examples/chat_finetuning_data_prep)