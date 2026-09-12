# 微调最佳实践

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

如果微调模型没有取得理想效果，可以考虑在流程上进行以下迭代。

OpenAI 正在逐步停用微调平台。该平台已不再
  向新用户开放，但现有用户在未来几个月内仍可
  创建训练任务。
  

  所有微调模型在其基础模型被弃用之前将持续可用，
  用于推理， [直至被弃用](https://developers.openai.com/api/docs/deprecations)。完整时间表请参阅
  [此处](https://developers.openai.com/api/docs/deprecations).

### 迭代优化数据质量

以下是一些可以考虑提升你训练数据集质量的方法：

- 收集示例以针对仍然存在的问题。
  - 如果模型在某些方面仍然表现不佳，请添加直接展示模型如何正确处理这些方面的训练示例。
- 仔细审查现有示例中的问题。
  - 如果你的模型存在语法、逻辑或风格方面的问题，请检查数据中是否也存在同样的问题。例如，如果模型现在说"I will schedule this meeting for you"（而它本不应这样说），请查看现有示例是否教会了模型做出它实际上无法完成的新事情
- 考虑数据平衡性和多样性。
  - 如果数据中 60% 的助手回复都说"I cannot answer this"，但推理时只有 5% 的回复应当这样，你很可能会得到过多的拒绝回答。
- 确保训练示例包含生成回复所需的全部信息。
  - 如果我们希望模型根据用户的个人特质来赞美用户，而训练示例中助手对未在之前的对话中出现的特质进行了赞美，那么模型可能会学会凭空捏造信息。
- 查看训练示例中的一致性和连贯性。
  - 如果训练数据由多人创建，模型的性能很可能受限于人员之间的一致性和连贯性水平。例如，在文本抽取任务中，如果人们仅在 70% 的抽取片段上达成一致，模型很可能也无法超越这一水平。
- 确保所有训练示例采用与推理时一致的格式。

### 迭代数据量

一旦你对示例的质量和分布感到满意，就可以考虑增加训练示例的数量。这通常有助于模型更好地学习任务，尤其是在可能的“边界情况”方面。我们预期每次将训练示例数量翻倍时，模型都会带来类似的提升。你可以大致按以下方式估算增加训练数据规模所带来的预期质量提升：

- 在当前数据集上进行微调
- 在当前数据集的一半上进行微调
- 观察两者之间的质量差距

一般来说，如果你必须做出权衡，较少量的高质量数据通常比较大的低质量数据更有效。

### 迭代超参数

超参数控制模型在训练过程中权重更新的方式。一些常见的选项包括：

- **训练轮次**：在模型训练过程中，一个 epoch 是对整个训练数据集的一次完整遍历。你通常会运行多个 epoch，以便模型能够迭代地优化其权重。
- **学习率乘数**：调整模型已学习参数的变化幅度。较大的乘数可以加快训练速度，而较小的乘数则可能带来更慢但更稳定的训练。
- **批次大小**：模型在一次前向和反向传播中处理的样本数量，之后才会更新其权重。较大的批次会减慢训练速度，但可能产生更稳定的结果。

我们建议在初始训练时不要指定这些参数中的任何一个，从而让我们根据数据集规模为你选择一个默认值，然后在观察到以下情况时再进行调整：

- 如果模型没有像预期那样紧跟训练数据，可将 epochs 数量增加 1 或 2。
  - 这种情况更常见于存在单一理想补全（或少量相近的理想补全）的任务。例如分类、实体抽取或结构化解析。这些任务通常是你可以基于参考答案计算最终准确率指标的任务。
- 如果模型生成结果的多样性低于预期，可将 epochs 数量减少 1 或 2。
  - 这种情况更常见于存在多种可能优质补全的任务。
- 如果模型似乎没有收敛，可增大学习率乘数。

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
    supervised: { hyperparameters: { n_epochs: 2 } }
  }
)
puts(job.id)
```


## 调整你的数据集

如果你没有看到理想的微调效果，另一种选择是回过头去修订你的训练数据。在收集用于数据集的示例时，以下是一些最佳实践。

### 训练数据集与测试数据集

收集示例后，将数据集拆分为训练集和测试集。训练集用于微调任务，测试集用于 [评估](https://developers.openai.com/api/docs/guides/evals).

当你提交同时包含训练文件和测试文件的微调任务时，我们将在训练过程中提供两者的统计数据。这些数据可以帮助你了解模型的提升幅度。尽早构建测试集有助于你 [在训练后评估模型](https://developers.openai.com/api/docs/guides/evals) ，通过与测试集基准进行对比。

### Crafting prompts for training data

采用在微调之前对该模型效果最好的指令和提示，并将其包含在每个训练示例中。这可以让你获得最佳且最通用的结果，尤其是在训练样本较少（少于 100 个）的情况下。

你可能会想缩短每个示例中重复出现的指令或提示以节省成本。如果没有重复的指令，可能需要更多训练示例才能获得良好效果，因为模型必须完全通过示例来学习。

### 训练数据中的多轮对话

要在 [多轮对话](https://developers.openai.com/api/docs/guides/conversation-state)，上训练模型，请在每行训练数据的 `user` 数组 `assistant` 中包含多条 `messages` 消息。

使用可选的 `weight` 键（值设为 0 或 1）来禁用对特定助手消息的微调。以下是在聊天格式中控制 `weight` 的示例：

```jsonl
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already.", "weight": 1}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'Romeo and Juliet'?"}, {"role": "assistant", "content": "William Shakespeare", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Oh, just some guy named William Shakespeare. Ever heard of him?", "weight": 1}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "How far is the Moon from Earth?"}, {"role": "assistant", "content": "384,400 kilometers", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Around 384,400 kilometers. Give or take a few, like that really matters.", "weight": 1}]}
```

### Token limits

Token 上限因模型而异。以下是各模型所允许的最大上下文长度概览：

| Model                     | 推理上下文长度 | 示例上下文长度 |
| ------------------------- | ------------------------ | ----------------------- |
| `gpt-4.1-2025-04-14`      | 128,000 tokens           | 65,536 tokens           |
| `gpt-4.1-mini-2025-04-14` | 128,000 tokens           | 65,536 tokens           |
| `gpt-4.1-nano-2025-04-14` | 128,000 tokens           | 65,536 tokens           |
| `gpt-4o-2024-08-06`       | 128,000 tokens           | 65,536 tokens           |
| `gpt-4o-mini-2024-07-18`  | 128,000 tokens           | 65,536 tokens           |

超过默认长度的示例会被截断到最大上下文长度，这会从训练示例末尾移除 token。为确保你的整个训练示例能放入上下文，请将消息内容中的 token 总数控制在限制以内。

可通过以下方式计算 token 数量 [分词器工具](https://platform.openai.com/tokenizer) 或使用代码，参考此 [cookbook 示例](https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken).

在上传数据之前，你可能需要检查格式以及潜在的 token 成本 —— cookbook 中提供了一个如何操作的示例。

[微调数据格式验证



      Learn about fine-tuning data formatting](https://developers.openai.com/cookbook/examples/chat_finetuning_data_prep)