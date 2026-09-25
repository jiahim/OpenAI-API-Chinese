# 微调最佳实践

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

如果你的微调模型没有获得理想的结果，可以考虑在流程上进行以下迭代。

OpenAI 正在逐步关闭微调平台。该平台已不再
  向新用户开放，但现有微调平台的用户在未来几个月内仍可
  创建训练任务。
  

  所有微调模型在其基础
  模型被 [弃用](https://developers.openai.com/api/docs/deprecations)。之前都将保持可用于推理。完整的时间表请参见
  [此处](https://developers.openai.com/api/docs/deprecations).

### 优化数据质量

以下是一些可以考虑改进训练数据集质量的方法：

- 收集示例以针对剩余的问题。
  - 如果模型在某些方面仍然表现不佳，可以添加直接展示如何正确完成这些方面的训练示例。
- 仔细检查现有示例中存在的问题。
  - 如果你的模型存在语法、逻辑或风格方面的问题，请检查你的数据是否也存在相同的问题。例如，如果模型现在说“我将为你安排这次会议”（本不应该这么说），请查看现有示例是否教会了模型说它能做到它实际做不到的新事情。
- 考虑数据的平衡性和多样性。
  - 如果数据中 60% 的助手回复都是“我无法回答这个问题”，但推理时只有 5% 的回复应该这么说，那么模型很可能会出现过度拒绝的情况。
- 确保你的训练示例包含生成回复所需的全部信息。
  - 如果我们希望模型根据用户的个人特质来夸赞用户，而某个训练示例中助手夸赞的特质并未在之前的对话中出现，那么模型可能会学会凭空捏造信息。
- 查看训练示例之间的一致性和连贯性。
  - 如果训练数据由多个人创建，那么模型性能很可能会受到人员之间一致性和共识程度的限制。例如，在文本提取任务中，如果人们对提取的片段只有 70% 的一致性，那么模型的表现在很大程度上也不会超过这一水平。
- 确保你所有的训练示例采用与推理时预期的相同格式。

### 迭代数据量

一旦你对示例的质量和分布感到满意，就可以考虑增加训练示例的数量。这通常有助于模型更好地学习任务，尤其是在可能的“边界情况”方面。我们预计每次将训练示例数量翻倍时，都会获得类似的改进幅度。你可以通过以下方式粗略估算增加训练数据规模所带来的预期质量提升：

- 在你当前的数据集上进行微调
- 在你当前数据集的一半上进行微调
- 观察两者之间的质量差距

一般来说，如果必须做出权衡，少量高质量数据通常比大量低质量数据更有效。

### 迭代超参数

超参数控制着模型权重在训练过程中的更新方式。一些常见的选项包括：

- **训练轮次**：一个训练轮次是指模型在训练过程中对完整训练数据集进行一次完整的遍历。你通常会运行多个训练轮次，以便模型能够迭代地优化其权重。
- **学习率乘数**：用于调整模型已学习参数更新的幅度。较大的乘数可以加快训练速度，而较小的乘数虽然训练较慢，但可能更稳定。
- **批量大小**：指模型在一次前向和反向传播中处理、然后再更新权重的样本数量。较大的批量会减慢训练速度，但可能产生更稳定的结果。

我们建议在初始训练时不要指定这些参数中的任何一个，让我们根据数据集大小为你选择一个默认值，然后如果你观察到以下情况再进行调整：

- 如果模型未充分遵循训练数据，可将训练轮次（epoch）增加 1 或 2。
  - 这种情况更常见于存在单一理想补全（或一小组相近的理想补全）的任务。例如分类、实体抽取或结构化解析。这些任务通常可以针对参考答案计算最终的准确率指标。
- 如果模型的多样性低于预期，可将训练轮次（epoch）减少 1 或 2。
  - 这种情况更常见于存在大量可能优质补全的任务。
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

如果你没有看到理想的微调效果，另一个选择是回去修改你的训练数据。在收集用于数据集的示例时，以下是一些最佳实践。

### 训练数据集与测试数据集

收集完示例后，将数据集拆分为训练集和测试集。训练集用于微调任务，测试集用于 [评估](https://developers.openai.com/api/docs/guides/evals).

当你提交同时包含训练文件和测试文件的微调任务时，我们会在训练过程中提供两者的统计数据。这些统计数据能让你了解模型的改进程度。尽早构建测试集有助于你 [在训练后评估模型](https://developers.openai.com/api/docs/guides/evals) ，方法是与测试集基准进行比较。

### Crafting prompts for training data

将微调前对该模型最有效的指令和提示整理出来，并在每个训练样本中都保留它们。这样通常能获得最佳且泛化能力最强的结果，尤其是在训练样本较少（少于 100 个）时。

你可能会想为了节省成本而精简每个样本中重复出现的指令或提示。如果不保留这些重复的指令，可能需要更多训练样本才能得到理想效果，因为模型只能完全通过示例来学习。

### 训练数据中的多轮对话

若要在 [多轮对话](https://developers.openai.com/api/docs/guides/conversation-state)，上进行训练，请在 `user` 和 `assistant` 数组中为每条训练数据包含多条 `messages` 消息。

使用可选的 `weight` 键（值设置为 0 或 1）可以禁用对特定助手消息的微调。以下是在聊天格式中控制 `weight` 的一些示例：

```jsonl
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already.", "weight": 1}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'Romeo and Juliet'?"}, {"role": "assistant", "content": "William Shakespeare", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Oh, just some guy named William Shakespeare. Ever heard of him?", "weight": 1}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "How far is the Moon from Earth?"}, {"role": "assistant", "content": "384,400 kilometers", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Around 384,400 kilometers. Give or take a few, like that really matters.", "weight": 1}]}
```

### Token limits

令牌上限取决于所用模型。以下是最大允许上下文长度的概览：

| Model                     | 推理上下文长度 | 示例上下文长度 |
| ------------------------- | ------------------------ | ----------------------- |
| `gpt-4.1-2025-04-14`      | 128,000 tokens           | 65,536 tokens           |
| `gpt-4.1-mini-2025-04-14` | 128,000 tokens           | 65,536 tokens           |
| `gpt-4.1-nano-2025-04-14` | 128,000 tokens           | 65,536 tokens           |
| `gpt-4o-2024-08-06`       | 128,000 tokens           | 65,536 tokens           |
| `gpt-4o-mini-2024-07-18`  | 128,000 tokens           | 65,536 tokens           |

超过默认长度的示例会被截断到最大上下文长度，这会从训练示例末尾移除 token。为了确保你的整个训练示例能放入上下文，请将消息内容中的 token 总数控制在限制以内。

使用以下工具计算 token 数 [分词器工具](https://platform.openai.com/tokenizer) 或通过编写代码计算，例如参考这个 [cookbook 示例](https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken).

在上传数据之前，你可能需要检查格式以及可能的 token 成本——关于如何操作的示例可以在 cookbook 中找到。

[微调数据格式验证



      Learn about fine-tuning data formatting](https://developers.openai.com/cookbook/examples/chat_finetuning_data_prep)