# Supervised fine-tuning

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Supervised fine-tuning (SFT) lets you train an OpenAI model with examples for your specific use case. The result is a customized model that more reliably produces your desired style and content.

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

## Overview

Supervised fine-tuning has four major parts:

1. Build your training dataset to determine what "good" looks like
1. Upload a training dataset containing example prompts and desired model output
1. Create a fine-tuning job for a base model using your training data
1. Evaluate your results using the fine-tuned model

**Good evals first!** Only invest in fine-tuning after setting up evals. You
  need a reliable way to determine whether your fine-tuned model is performing
  better than a base model.
  

  [Set up evals →](https://developers.openai.com/api/docs/guides/evals)

## Build your dataset

Build a robust, representative dataset to get useful results from a fine-tuned model. Use the following techniques and considerations.

### Right number of examples

- The minimum number of examples you can provide for fine-tuning is 10
- We see improvements from fine-tuning on 50–100 examples, but the right number for you varies greatly and depends on the use case
- We recommend starting with 50 well-crafted demonstrations and [evaluating the results](https://developers.openai.com/api/docs/guides/evals)

If performance improves with 50 good examples, try adding examples to see further results. If 50 examples have no impact, rethink your task or prompt before adding training data.

### What makes a good example

- Whatever prompts and outputs you expect in your application, as realistic as possible
- Specific, clear questions and answers
- Use historical data, expert data, logged data, or [other types of collected data](https://developers.openai.com/api/docs/guides/evals)

### Formatting your data

- Use [JSONL format](https://jsonlines.org/), with one complete JSON structure on every line of the training data file
- Use the [chat completions format](https://developers.openai.com/api/reference/resources/fine_tuning)
- Your file must have at least 10 lines



JSONL format example file

    

An example of JSONL training data, where the model calls a `get_weather` function:

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


  

  

    
Corresponding JSON data

    

Each line of the training data file contains a JSON structure like the following, containing both an example user prompt and a correct response from the model as an `assistant` message.

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



### Distilling from a larger model

One way to build a training data set for a smaller model is to distill the results of a large model to create training data for supervised fine tuning. The general flow of this technique is:

- Tune a prompt for a larger model (like `gpt-4.1`) until you get great performance against your eval criteria.
- Capture results generated from your model using whatever technique is convenient - note that the [Responses API](https://developers.openai.com/api/reference/resources/responses) stores model responses for 30 days by default.
- Use the captured responses from the large model that fit your criteria to generate a dataset using the tools and techniques described above.
- Tune a smaller model (like `gpt-4.1-mini`) using the dataset you created from the large model.

This technique can enable you to train a small model to perform similarly on a specific task to a larger, more costly model.

## Upload training data

Upload your dataset of examples to OpenAI. We use it to update the model's weights and produce outputs like the ones included in your data.

In addition to text completions, you can train the model to more effectively generate [structured JSON output](https://developers.openai.com/api/docs/guides/structured-outputs) or [function calls](https://developers.openai.com/api/docs/guides/function-calling).



Upload your data with button clicks

    

1. Navigate to the dashboard > **[fine-tuning](https://platform.openai.com/finetune)**.
1. Click **+ Create**.
1. Under **Training data**, upload your JSONL file.


  

  

    
Call the API to upload your data

    

Assuming the data above is saved to a file called `mydata.jsonl`, you can upload it to the OpenAI platform using the code below. Note that the `purpose` of the uploaded file is set to `fine-tune`:

```bash
curl https://api.openai.com/v1/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F purpose="fine-tune" \
  -F file="@mydata.jsonl"
```


Note the `id` of the file that is uploaded in the data returned from the API - you'll need that file identifier in subsequent API requests.

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



## Create a fine-tuning job

With your test data uploaded, [create a fine-tuning job](https://developers.openai.com/api/reference/resources/fine_tuning) to customize a base model using the training data you provide. When creating a fine-tuning job, you must specify:

- A base model (`model`) to use for fine-tuning. This can be either an OpenAI model ID or the ID of a previously fine-tuned model. See which models support fine-tuning in the [model docs](https://developers.openai.com/api/docs/models).
- A training file (`training_file`) ID. This is the file you uploaded in the previous step.
- A fine-tuning method (`method`). This specifies which fine-tuning method you want to use to customize the model. Supervised fine-tuning is the default.



Upload your data with button clicks

    

1. In the same **+ Create** modal as above, complete the required fields.
1. Select supervised fine-tuning as the method and whichever model you want to train.
1. When you're ready, click **Create** to start the job.


  

  

    
Call the API to upload your data

    

Create a supervised fine-tuning job by calling the [fine-tuning API](https://developers.openai.com/api/reference/resources/fine_tuning):

```bash
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-RCnFCYRhFDcq1aHxiYkBHw",
    "model": "gpt-4.1-nano-2025-04-14"
  }'
```


The API responds with information about the fine-tuning job in progress. Depending on the size of your training data, the training process may take several minutes or hours. You can [poll the API](https://developers.openai.com/api/reference/resources/fine_tuning) for updates on a specific job.

When the fine-tuning job finishes, your fine-tuned model is ready to use. A completed fine-tune job returns data like this:

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

Note the `fine_tuned_model` property. This is the model ID to use in [Responses](https://developers.openai.com/api/reference/resources/responses) or [Chat Completions](https://developers.openai.com/api/reference/resources/chat) to make API requests using your fine-tuned model.

Here's an example of calling the Responses API with your fine-tuned model ID:

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



## Evaluate the result

Use the approaches below to check how your fine-tuned model performs. Adjust your prompts, data, and fine-tuning job as needed until you get the results you want. The best way to fine-tune is to continue iterating.

### Compare to evals

To see if your fine-tuned model performs better than the original base model, [use evals](https://developers.openai.com/api/docs/guides/evals). Before running your fine-tuning job, carve out data from the same training dataset you collected in step 1. This holdout data acts as a control group when you use it for evals. Make sure the training and holdout data have roughly the same diversity of user input types and model responses.

[Learn more about running evals](https://developers.openai.com/api/docs/guides/evals).

### Monitor the status

Check the status of a fine-tuning job in the dashboard or by polling the job ID in the API.



Monitor in the UI

    

1. Navigate to the [fine-tuning dashboard](https://platform.openai.com/finetune).
1. Select the job you want to monitor.
1. Review the status, checkpoints, message, and metrics.


  

  

    
Monitor with API calls

    

Use this curl command to get information about your fine-tuning job:

```bash
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-uL1VKpwx7maorHNbOiDwFIn6 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


The job contains a `fine_tuned_model` property, which is your new fine-tuned model's unique ID.

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



### Try using your fine-tuned model

Evaluate your newly optimized model by using it! When the fine-tuned model finishes training, use its ID in either the [Responses](https://developers.openai.com/api/reference/resources/responses) or [Chat Completions](https://developers.openai.com/api/reference/resources/chat) API, just as you would an OpenAI base model.



Use your model in the Playground

    

1. Navigate to your fine-tuning job in [the dashboard](https://platform.openai.com/finetune).
1. In the right pane, navigate to **Output model** and copy the model ID. It should start with `ft:…`
1. Open the [Playground](https://platform.openai.com/playground).
1. In the **Model** dropdown menu, paste the model ID. Here, you should also see other fine-tuned models you've created.
1. Run some prompts and see how your fine-tuned performs!


  

  

    
Use your model with an API call

    

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "ft:gpt-4.1-nano-2025-04-14:openai::BTz2REMH",
    "input": "What is 4+4?"
  }'
```



### Use checkpoints if needed

Checkpoints are models you can use. We create a full model checkpoint for you at the end of each training epoch. They're useful in cases where your fine-tuned model improves early on but then memorizes the dataset instead of learning generalizable knowledge—called \_overfitting. Checkpoints provide versions of your customized model from various moments in the process.



Find checkpoints in the dashboard

    

1. Navigate to the [fine-tuning dashboard](https://platform.openai.com/finetune).
1. In the left panel, select the job you want to investigate. Wait until it succeeds.
1. In the right panel, scroll to the list of checkpoints.
1. Hover over any checkpoint to see a link to launch in the Playground.
1. Test the checkpoint model's behavior by prompting it in the Playground.


  

  

    
Query the API for checkpoints

    

1. Wait until a job succeeds, which you can verify by [querying the status of a job](https://developers.openai.com/api/reference/resources/fine_tuning).
1. [Query the checkpoints endpoint](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/subresources/checkpoints/methods/list) with your fine-tuning job ID to access a list of model checkpoints for the fine-tuning job.
1. Find the `fine_tuned_model_checkpoint` field for the name of the model checkpoint.
1. Use this model just like you would the final fine-tuned model.

The checkpoint object contains `metrics` data to help you determine the usefulness of this model. As an example, the response looks like this:

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

Each checkpoint specifies:

- `step_number`: The step at which the checkpoint was created (where each epoch is number of steps in the training set divided by the batch size)
- `metrics`: An object containing the metrics for your fine-tuning job at the step when the checkpoint was created



Currently, only the checkpoints for the last three epochs of the job are saved and available for use.

## Safety checks

Before launching in production, review and follow the following safety information.



### How we assess for safety



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







### How to pass safety checks



In addition to reviewing any failed safety checks in the fine-tuning job object, you can retrieve details about which categories failed by querying the [fine-tuning API events endpoint](https://developers.openai.com/api/reference/resources/fine_tuning/subresources/jobs/methods/list). Look for events of type `moderation_checks` for details about category results and enforcement. This information can help you narrow down which categories to target for retraining and improvement. The [model spec](https://cdn.openai.com/spec/model-spec-2024-05-08.html#overview) has rules and examples that can help identify areas for additional training data.

While these evaluations cover a broad range of safety categories, conduct your own evaluations of the fine-tuned model to ensure it's appropriate for your use case.





## Next steps

Now that you know the basics of supervised fine-tuning, explore these other methods as well.

[Vision fine-tuning



      Learn to fine-tune for computer vision with image inputs.](https://developers.openai.com/api/docs/guides/vision-fine-tuning)

[Direct preference optimization



      Fine-tune a model using direct preference optimization (DPO).](https://developers.openai.com/api/docs/guides/direct-preference-optimization)

[Reinforcement fine-tuning



      Fine-tune a reasoning model by grading its outputs.](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning)