# Fine-tuning best practices

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

If you're not getting strong results with a fine-tuned model, consider the following iterations on your process.

OpenAI is winding down the fine-tuning platform. The platform is no longer
  accessible to new users, but existing users of the fine-tuning platform will
  be able to create training jobs for the coming months.
  

  All fine-tuned models will remain available for inference until their base
  models are [deprecated](https://developers.openai.com/api/docs/deprecations). The full timeline is
  [here](https://developers.openai.com/api/docs/deprecations).

### Iterating on data quality

Below are a few ways to consider improving the quality of your training data set:

- Collect examples to target remaining issues.
  - If the model still isn't good at certain aspects, add training examples that directly show the model how to do these aspects correctly.
- Scrutinize existing examples for issues.
  - If your model has grammar, logic, or style issues, check if your data has any of the same issues. For instance, if the model now says "I will schedule this meeting for you" (when it shouldn't), see if existing examples teach the model to say it can do new things that it can't do
- Consider the balance and diversity of data.
  - If 60% of the assistant responses in the data says "I cannot answer this", but at inference time only 5% of responses should say that, you will likely get an overabundance of refusals.
- Make sure your training examples contain all of the information needed for the response.
  - If we want the model to compliment a user based on their personal traits and a training example includes assistant compliments for traits not found in the preceding conversation, the model may learn to hallucinate information.
- Look at the agreement and consistency in the training examples.
  - If multiple people created the training data, it's likely that model performance will be limited by the level of agreement and consistency between people. For instance, in a text extraction task, if people only agreed on 70% of extracted snippets, the model would likely not be able to do better than this.
- Make sure your all of your training examples are in the same format, as expected for inference.

### Iterating on data quantity

Once you're satisfied with the quality and distribution of the examples, you can consider scaling up the number of training examples. This tends to help the model learn the task better, especially around possible "edge cases". We expect a similar amount of improvement every time you double the number of training examples. You can loosely estimate the expected quality gain from increasing the training data size by:

- Fine-tuning on your current dataset
- Fine-tuning on half of your current dataset
- Observing the quality gap between the two

In general, if you have to make a tradeoff, a smaller amount of high-quality data is generally more effective than a larger amount of low-quality data.

### Iterating on hyperparameters

Hyperparameters control how the model's weights are updated during the training process. A few common options are:

- **Epochs**: An epoch is a single complete pass through your entire training dataset during model training. You will typically run multiple epochs so the model can iteratively refine its weights.
- **Learning rate multiplier**: Adjusts the size of changes made to the model's learned parameters. A larger multiplier can speed up training, while a smaller one can lean to slower but more stable training.
- **Batch size**: The number of examples the model processes in one forward and backward pass before updating its weights. Larger batches slow down training, but may produce more stable results.

We recommend initially training without specifying any of these, allowing us to pick a default for you based on dataset size, then adjusting if you observe the following:

- If the model doesn't follow the training data as much as expected, increase the number of epochs by 1 or 2.
  - This is more common for tasks for which there is a single ideal completion (or a small set of ideal completions which are similar). Some examples include classification, entity extraction, or structured parsing. These are often tasks for which you can compute a final accuracy metric against a reference answer.
- If the model becomes less diverse than expected, decrease the number of epochs by 1 or 2.
  - This is more common for tasks for which there are a wide range of possible good completions.
- If the model doesn't appear to be converging, increase the learning rate multiplier.

You can set the hyperparameters as shown below:

Setting hyperparameters

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


## Adjust your dataset

Another option if you're not seeing strong fine-tuning results is to go back and revise your training data. Here are a few best practices as you collect examples to use in your dataset.

### Training vs. testing datasets

After collecting your examples, split the dataset into training and test portions. The training set is for fine-tuning jobs, and the test set is for [evals](https://developers.openai.com/api/docs/guides/evals).

When you submit a fine-tuning job with both training and test files, we'll provide statistics on both during the course of training. These statistics give you signal on how much the model's improving. Constructing a test set early on helps you [evaluate the model after training](https://developers.openai.com/api/docs/guides/evals) by comparing with the test set benchmark.

### Crafting prompts for training data

Take the set of instructions and prompts that worked best for the model prior to fine-tuning, and include them in every training example. This should let you reach the best and most general results, especially if you have relatively few (under 100) training examples.

You may be tempted to shorten the instructions or prompts repeated in every example to save costs. Without repeated instructions, it may take more training examples to arrive at good results, as the model has to learn entirely through demonstration.

### Multi-turn chat in training data

To train the model on [multi-turn conversations](https://developers.openai.com/api/docs/guides/conversation-state), include multiple `user` and `assistant` messages in the `messages` array for each line of your training data.

Use the optional `weight` key (value set to either 0 or 1) to disable fine-tuning on specific assistant messages. Here are some examples of controlling `weight` in a chat format:

```jsonl
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "What's the capital of France?"}, {"role": "assistant", "content": "Paris", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Paris, as if everyone doesn't know that already.", "weight": 1}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "Who wrote 'Romeo and Juliet'?"}, {"role": "assistant", "content": "William Shakespeare", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Oh, just some guy named William Shakespeare. Ever heard of him?", "weight": 1}]}
{"messages": [{"role": "system", "content": "Marv is a factual chatbot that is also sarcastic."}, {"role": "user", "content": "How far is the Moon from Earth?"}, {"role": "assistant", "content": "384,400 kilometers", "weight": 0}, {"role": "user", "content": "Can you be more sarcastic?"}, {"role": "assistant", "content": "Around 384,400 kilometers. Give or take a few, like that really matters.", "weight": 1}]}
```

### Token limits

Token limits depend on model. Here's an overview of the maximum allowed context lengths:

| Model                     | Inference context length | Examples context length |
| ------------------------- | ------------------------ | ----------------------- |
| `gpt-4.1-2025-04-14`      | 128,000 tokens           | 65,536 tokens           |
| `gpt-4.1-mini-2025-04-14` | 128,000 tokens           | 65,536 tokens           |
| `gpt-4.1-nano-2025-04-14` | 128,000 tokens           | 65,536 tokens           |
| `gpt-4o-2024-08-06`       | 128,000 tokens           | 65,536 tokens           |
| `gpt-4o-mini-2024-07-18`  | 128,000 tokens           | 65,536 tokens           |

Examples longer than the default are truncated to the maximum context length, which removes tokens from the end of the training example. To make sure your entire training example fits in context, keep the total token counts in the message contents under the limit.

Compute token counts with [the tokenizer tool](https://platform.openai.com/tokenizer) or by using code, as in this [cookbook example](https://developers.openai.com/cookbook/examples/how_to_count_tokens_with_tiktoken).

Before uploading your data, you may want to check formatting and potential token costs - an example of how to do this can be found in the cookbook.

[Fine-tuning data format validation



      Learn about fine-tuning data formatting](https://developers.openai.com/cookbook/examples/chat_finetuning_data_prep)