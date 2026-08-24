# Direct preference optimization

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

[Direct Preference Optimization](https://arxiv.org/abs/2305.18290) (DPO) fine-tuning allows you to fine-tune models based on prompts and pairs of responses. This approach enables the model to learn from more subjective human preferences, optimizing for outputs that are more likely to be favored. DPO is currently only supported for text inputs and outputs.

OpenAI is winding down the fine-tuning platform. The platform is no longer
  accessible to new users, but existing users of the fine-tuning platform will
  be able to create training jobs for the coming months.
  

  All fine-tuned models will remain available for inference until their base
  models are [deprecated](https://developers.openai.com/api/docs/deprecations). The full timeline is
  [here](https://developers.openai.com/api/docs/deprecations).




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

## Data format

Each example in your dataset should contain:

- A prompt, like a user message.
- A preferred output (an ideal assistant response).
- A non-preferred output (a suboptimal assistant response).

The data should be formatted in JSONL format, with each line [representing an example](https://developers.openai.com/api/reference/resources/fine_tuning) in the following structure:

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

Currently, we only train on one-turn conversations for each example, where the preferred and non-preferred messages need to be the last assistant message.

## Create a DPO fine-tune job

Uploading training data and using a model fine-tuned with DPO follows the [same flow described here](https://developers.openai.com/api/docs/guides/model-optimization).

To create a DPO fine-tune job, use the `method` field in the [fine-tuning job creation endpoint](https://developers.openai.com/api/reference/resources/fine_tuning), where you can specify `type` as well as any associated `hyperparameters`. For DPO:

- set the `type` parameter to `dpo`
- optionally set the `hyperparameters` property with any options you'd like to configure.

The `beta` hyperparameter is a new option that is only available for DPO. It's a floating point number between `0` and `2` that controls how strictly the new model will adhere to its previous behavior, versus aligning with the provided preferences. A high number will be more conservative (favoring previous behavior), and a lower number will be more aggressive (favor the newly provided preferences more often).

You can also set this value to `auto` (the default) to use a value configured by the platform.

The example below shows how to configure a DPO fine-tuning job using the OpenAI SDK.

Create a fine-tuning job with DPO

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


## Use SFT and DPO together

Currently, OpenAI offers [supervised fine-tuning (SFT)](https://developers.openai.com/api/docs/guides/supervised-fine-tuning) as the default method for fine-tuning jobs. Performing SFT on your preferred responses (or a subset) before running another DPO job afterwards can significantly enhance model alignment and performance. By first fine-tuning the model on the desired responses, it can better identify correct patterns, providing a strong foundation for DPO to refine behavior.

A recommended workflow is as follows:

1. Fine-tune the base model with SFT using a subset of your preferred responses. Focus on ensuring the data quality and representativeness of the tasks.
2. Use the SFT fine-tuned model as the starting point, and apply DPO to adjust the model based on preference comparisons.

## Safety checks

Before launching in production, review and follow the following safety information.

How we assess for safety

Once a fine-tuning job is completed, we assess the resulting model’s behavior across 13 distinct safety categories. Each category represents a critical area where AI outputs could potentially cause harm if not properly controlled.

| Name                   | Description                                                                                                                                                                                                                                    |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| advice                 | Advice or guidance that violates our policies.                                                                                                                                                                                                 |
| harassment/threatening | Harassment content that also includes violence or serious harm towards any target.                                                                                                                                                             |
| hate                   | Content that expresses, incites, or promotes hate based on race, gender, ethnicity, religion, nationality, sexual orientation, disability status, or caste. Hateful content aimed at non-protected groups (e.g., chess players) is harassment. |
| hate/threatening       | Hateful content that also includes violence or serious harm towards the targeted group based on race, gender, ethnicity, religion, nationality, sexual orientation, disability status, or caste.                                               |
| highly-sensitive       | Highly sensitive data that violates our policies.                                                                                                                                                                                              |
| illicit                | Content that gives advice or instruction on how to commit illicit acts. A phrase like "how to shoplift" would fit this category.                                                                                                               |
| propaganda             | Praise or assistance for ideology that violates our policies.                                                                                                                                                                                  |
| self-harm/instructions | Content that encourages performing acts of self-harm, such as suicide, cutting, and eating disorders, or that gives instructions or advice on how to commit such acts.                                                                         |
| self-harm/intent       | Content where the speaker expresses that they are engaging or intend to engage in acts of self-harm, such as suicide, cutting, and eating disorders.                                                                                           |
| sensitive              | Sensitive data that violates our policies.                                                                                                                                                                                                     |
| sexual/minors          | Sexual content that includes an individual who is under 18 years old.                                                                                                                                                                          |
| sexual                 | Content meant to arouse sexual excitement, such as the description of sexual activity, or that promotes sexual services (excluding sex education and wellness).                                                                                |
| violence               | Content that depicts death, violence, or physical injury.                                                                                                                                                                                      |

Each category has a predefined pass threshold; if too many evaluated examples in a given category fail, OpenAI blocks the fine-tuned model from deployment. If your fine-tuned model does not pass the safety checks, OpenAI sends a message in the fine-tuning job explaining which categories don't meet the required thresholds. You can view the results in the moderation checks section of the fine-tuning job.

How to pass safety checks

In addition to reviewing any failed safety checks in the fine-tuning job object, you can retrieve details about which categories failed by querying the [fine-tuning API events endpoint](https://platform.openai.com/docs/api-reference/fine-tuning/list-events). Look for events of type `moderation_checks` for details about category results and enforcement. This information can help you narrow down which categories to target for retraining and improvement. The [model spec](https://cdn.openai.com/spec/model-spec-2024-05-08.html#overview) has rules and examples that can help identify areas for additional training data.

While these evaluations cover a broad range of safety categories, conduct your own evaluations of the fine-tuned model to ensure it's appropriate for your use case.

## Next steps

Now that you know the basics of DPO, explore these other methods as well.

[Supervised fine-tuning



      Fine-tune a model by providing correct outputs for sample inputs.](https://developers.openai.com/api/docs/guides/supervised-fine-tuning)

[Vision fine-tuning



      Learn to fine-tune for computer vision with image inputs.](https://developers.openai.com/api/docs/guides/vision-fine-tuning)

[Reinforcement fine-tuning



      Fine-tune a reasoning model by grading its outputs.](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)