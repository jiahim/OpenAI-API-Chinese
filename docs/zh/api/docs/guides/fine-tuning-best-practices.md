# 微调最佳实践

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

如果你使用微调模型没有获得理想效果，可以考虑对流程进行以下迭代调整。

OpenAI 正在逐步关闭微调平台。该平台不再
  向新用户开放，但现有微调平台用户仍可在
  未来数月内创建训练任务。
  

  所有微调模型将继续可用于推理，直到其基础
  模型被 [弃用](https://developers.openai.com/api/docs/deprecations)。完整时间线见
  [此处](https://developers.openai.com/api/docs/deprecations).

### 迭代数据质量

以下是一些可以考虑提高训练数据集质量的方法：

- 收集示例以针对剩余问题。
  - 如果模型在某些方面仍不擅长，添加直接展示模型如何正确完成这些方面的训练示例。
- 仔细检查现有示例中的问题。
  - 如果你的模型存在语法、逻辑或风格问题，请检查你的数据是否也有相同的问题。例如，如果模型现在说“我会为你安排这次会议”（尽管它不应该这样做），请查看现有示例是否教会了模型去声称它能做它实际上无法做到的新事情。
- 考虑数据的平衡性和多样性。
  - 如果数据中 60% 的助手回复是“我无法回答这个问题”，但在推理时只有 5% 的回复应该这么说，那么你很可能会得到过多的拒绝。
- 确保你的训练示例包含响应所需的所有信息。
  - 如果我们希望模型根据用户的个人特质来称赞用户，而训练示例中包含了对前面对话中未出现的特质的助手称赞，那么模型可能会学会虚构信息。
- 检查训练示例的一致性和连贯性。
  - 如果多人创建了训练数据，模型性能很可能会受到人们之间一致性和连贯性水平的限制。例如，在文本提取任务中，如果人们仅在 70% 的提取片段上达成一致，模型可能无法做得比这更好。
- 确保你所有的训练示例都采用与推理时预期相同的格式。

### 迭代数据量

当你对示例的质量和分布感到满意后，可以考虑增加训练示例的数量。这通常有助于模型更好地学习任务，尤其是在可能的“边缘情况”上。我们预计每次将训练示例数量翻倍时，改进幅度大致相似。你可以通过以下方式粗略估计增加训练数据规模可带来的预期质量提升：

- 在当前数据集上进行微调
- 在当前数据集的一半上进行微调
- 观察两者之间的质量差距

一般来说，如果必须做出取舍，少量的高质量数据通常比大量的低质量数据更有效。

### 迭代超参数

超参数控制模型权重在训练过程中的更新方式。一些常见的选项包括：

- **周期**：周期是指在模型训练期间对整个训练数据集的一次完整遍历。你通常会运行多个周期，以便模型能够迭代地调整其权重。
- **学习率乘数**：调整模型学习参数的变化幅度。较大的乘数可以加速训练，而较小的乘数可能导致训练变慢但更稳定。
- **批量大小**：模型在更新权重之前，一次前向和后向传播中处理的示例数量。较大的批量会减慢训练速度，但可能产生更稳定的结果。

我们建议最初训练时不指定任何这些参数，让我们根据数据集大小为你选择默认值，然后在观察到以下情况时进行调整：

- 如果模型对训练数据的遵循程度未达到预期，请将训练轮数增加 1 或 2。
  - 这在具有单一理想补全（或一组相似的小型理想补全集合）的任务中更为常见。一些示例包括分类、实体提取或结构化解析。这些通常是你可以根据参考答案计算最终准确度指标的任务。
- 如果模型的输出多样性低于预期，请将训练轮数减少 1 或 2。
  - 这在存在广泛可能的好补全任务中更为常见。
- 如果模型似乎未在收敛，请提高学习率乘数。

你可以如下所示设置超参数：

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

如果你没有看到显著的微调结果，另一个选择是回头修订你的训练数据。以下是你在收集用于数据集的示例时的一些最佳实践。

### 训练数据集与测试数据集

收集示例后，将数据集分为训练集和测试集。训练集用于微调作业，测试集用于 [评估](https://developers.openai.com/api/docs/guides/evals).

当你同时提交包含训练文件和测试文件的微调作业时，我们将在训练过程中提供两者的统计数据。这些统计信息为你提供模型改进程度的信号。及早构建测试集有助于你 [在训练后评估模型](https://developers.openai.com/api/docs/guides/evals) 通过与测试集基准进行比较。

### 为训练数据编写提示词

采用在微调前对模型效果最佳的那套指令和提示，并将它们包含在每个训练示例中。这样应能让你获得最佳且最通用的结果，尤其是在训练示例相对较少（不足 100 个）的情况下。

你可能会为了节省成本而缩短每个示例中重复的指令或提示。但若不重复这些指令，模型可能就需要更多训练示例才能达到良好效果，因为它必须完全通过演示来学习。

### 训练数据中的多轮对话

要基于 [多轮对话](https://developers.openai.com/api/docs/guides/conversation-state)，训练模型，请在 `user` 和 `assistant` 中为训练数据的每一行包含多条 `messages` 数组消息。

使用可选的 `weight` 键（值设为 0 或 1）可禁用对特定助手消息的微调。以下是一些控制 `weight` 的聊天格式示例：

```jsonl
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already.", "weight": 1}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'Romeo and Juliet'?"}, {"role": "assistant", "content": "William Shakespeare", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Oh, just some guy named William Shakespeare. Ever heard of him?", "weight": 1}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "How far is the Moon from Earth?"}, {"role": "assistant", "content": "384,400 kilometers", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Around 384,400 kilometers. Give or take a few, like that really matters.", "weight": 1}]}
```

### Token 限制

令牌限制取决于模型。以下是允许的最大上下文长度概览：

| 模型                     | 推理上下文长度 | 示例上下文长度 |
| ------------------------- | ------------------------ | ----------------------- |
| `gpt-4.1-2025-04-14`      | 128,000 个令牌           | 65,536 个令牌           |
| `gpt-4.1-mini-2025-04-14` | 128,000 个令牌           | 65,536 个令牌           |
| `gpt-4.1-nano-2025-04-14` | 128,000 个令牌           | 65,536 个令牌           |
| `gpt-4o-2024-08-06`       | 128,000 个令牌           | 65,536 个令牌           |
| `gpt-4o-mini-2024-07-18`  | 128,000 个令牌           | 65,536 个令牌           |

超过默认长度的示例会被截断至最大上下文长度，这会从训练示例的末尾移除 token。为确保整个训练示例能够放入上下文，请将消息内容中的 token 总数控制在限制以内。

使用 [tokenizer 工具](https://platform.openai.com/tokenizer) 或通过代码计算 token 数量，如本 [cookbook 示例](https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken).

在上传数据之前，你可能需要检查格式和潜在的 token 成本——如何执行此操作的示例可在 cookbook 中找到。

[微调数据格式验证



      Learn about fine-tuning data formatting](https://developers.openai.com/cookbook/examples/chat_finetuning_data_prep)