# Graders

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Graders are a way to evaluate your model's performance against reference answers. Our [graders API](https://developers.openai.com/api/reference/resources/graders) is a way to test your graders, experiment with results, and improve your fine-tuning or evaluation framework to get the results you want.

OpenAI is deprecating graders as part of the evals and fine-tuning workflows
  they support. See the [deprecations page](https://developers.openai.com/api/docs/deprecations) for the
  current transition timelines.

## Overview

Graders let you compare reference answers to the corresponding model-generated answer and return a grade in the range from 0 to 1. It's sometimes helpful to give the model partial credit for an answer, rather than a binary 0 or 1.

Graders are specified in JSON format, and there are several types:

- [String check](#string-check-graders)
- [Text similarity](#text-similarity-graders)
- [Score model grader](#score-model-graders)
- [Python code execution](#python-graders)

In reinforcement fine-tuning, you can nest and combine graders by using [`multigrader` objects](#combined-graders).

Use this guide to learn about each grader type and see starter examples. To build a grader and get started with reinforcement fine-tuning, see the [RFT guide](https://developers.openai.com/api/docs/guides/reinforcement-fine-tuning). Or to get started with evals, see the [Evals guide](https://developers.openai.com/api/docs/guides/evals).

## Templating

The inputs to certain graders use a templating syntax to grade multiple examples with the same configuration. Any string with `{{ }}` double curly braces will be substituted with the variable value.

Each input inside the `{{}}` must include a _namespace_ and a _variable_ with the following format `{{ namespace.variable }}`. The only supported namespace values are `item` and `sample`.

All nested variables can be accessed with JSON path like syntax.

### Item namespace

The item namespace will be populated with variables from the input data source for evals, and from each dataset item for fine-tuning. For example, if a row contains the following

```json
{
  "reference_answer": "..."
}
```

This can be used within the grader as `{{ item.reference_answer }}`.

### Sample namespace

The sample namespace will be populated with variables from the model sampling step during evals or during the fine-tuning step. The following variables are included

- `output_text`, the model output content as a string.
- `output_json`, the model output content as a JSON object, only if `response_format` is included in the sample.
- `output_tools`, the model output `tool_calls`, which have the same structure as output tool calls in the [chat completions API](https://developers.openai.com/api/reference/resources/chat).
- `choices`, the output choices, which has the same structure as output choices in the [chat completions API](https://developers.openai.com/api/reference/resources/chat).
- `output_audio`, the model audio output object containing Base64-encoded `data` and a `transcript`.

For example, to access the model output content as a string, `{{ sample.output_text }}` can be used within the grader.

Details on grading tool calls

When training a model to improve tool-calling behavior, you will need to write your grader to operate over the `sample.output_tools` variable. The contents of this variable will be the same as the contents of the `response.choices[0].message.tool_calls` ([see function calling docs](https://developers.openai.com/api/docs/guides/function-calling?api-mode=chat)).

A common way of grading tool calls is to use two graders, one that checks the name of the tool that is called and another that checks the arguments of the called function. An example of a grader that does this is shown below:

```json
{
  "type": "multi",
  "graders": {
    "function_name": {
      "name": "function_name",
      "type": "string_check",
      "input": "get_acceptors",
      "reference": "{{sample.output_tools[0].function.name}}",
      "operation": "eq"
    },
    "arguments": {
      "name": "arguments",
      "type": "string_check",
      "input": "{\"smiles\": \"{{item.smiles}}\"}",
      "reference": "{{sample.output_tools[0].function.arguments}}",
      "operation": "eq"
    }
  },
  "calculate_output": "0.5 * function_name + 0.5 * arguments"
}
```

This is a `multi` grader that combined two simple `string_check` graders, the first checks the name of the tool called via the `sample.output_tools[0].function.name` variable, and the second checks the arguments of the called function via the `sample.output_tools[0].function.arguments` variable. The `calculate_output` field is used to combine the two scores into a single score.

The `arguments` grader is prone to under-rewarding the model if the function arguments are subtly incorrect, like if `1` is submitted instead of the floating point `1.0`, or if a state name is given as an abbreviation instead of spelling it out. To avoid this, you can use a `text_similarity` grader instead of a `string_check` grader, or a `score_model` grader to have a LLM check for semantic similarity.

## String check graders

Use these basic string operations to return a 0 or 1. String check graders are good for scoring straightforward pass or fail answers—for example, the correct name of a city, a yes or no answer, or an answer containing or starting with the correct information.

```json
{
    "type": "string_check",
    "name": string,
    "operation": "eq" | "ne" | "like" | "ilike",
    "input": string,
    "reference": string,
}
```

Operations supported for string-check-grader are:

- `eq`: Returns 1 if the input matches the reference (case-sensitive), 0 otherwise
- `neq`: Returns 1 if the input does not match the reference (case-sensitive), 0 otherwise
- `like`: Returns 1 if the input contains the reference (case-sensitive), 0 otherwise
- `ilike`: Returns 1 if the input contains the reference (not case-sensitive), 0 otherwise

## Text similarity graders

Use text similarity graders when to evaluate how close the model-generated output is to the reference, scored with various evaluation frameworks.

This is useful for open-ended text responses. For example, if your dataset contains reference answers from experts in paragraph form, it's helpful to see how close your model-generated answer is to that content, in numerical form.

```json
{
    "type": "text_similarity",
    "name": string,
    "input": string,
    "reference": string,
    "pass_threshold": number,
    "evaluation_metric": "fuzzy_match" | "bleu" | "gleu" | "meteor" | "cosine" | "rouge_1" | "rouge_2" | "rouge_3" | "rouge_4" | "rouge_5" | "rouge_l"
}
```

Operations supported for `string-similarity-grader` are:

- `fuzzy_match`: Fuzzy string match between input and reference, using `rapidfuzz`
- `bleu`: Computes the BLEU score between input and reference
- `gleu`: Computes the Google BLEU score between input and reference
- `meteor`: Computes the METEOR score between input and reference
- `cosine`: Computes Cosine similarity between embedded input and reference, using `text-embedding-3-large`. Only available for evals.
- `rouge-*`: Computes the ROUGE score between input and reference

## Model graders

In general, using a model grader means prompting a separate model to grade the outputs of the model you're fine-tuning. Your two models work together to do reinforcement fine-tuning. The _grader model_ evaluates the _training model_.

### Score model graders

A score model grader will take the input and return a numeric score based on the prompt within the given range.

```json
{
    "type": "score_model",
    "name": string,
    "input": Message[],
    "model": string,
    "pass_threshold": number,
    "range": number[],
    "sampling_params": {
        "seed": number,
        "top_p": number,
        "temperature": number,
        "max_completions_tokens": number,
        "reasoning_effort": "minimal" | "low" | "medium" | "high"
    }
}
```

Where each message is of the following form:

```json
{
    "role": "system" | "developer" | "user" | "assistant",
    "content": str
}

```

To use a score model grader, the input is a list of chat messages, each containing a `role` and `content`. The output of the grader will be truncated to the given `range`, and default to 0 for all non-numeric outputs.
Within each message, the same templating can be used as with other common graders to reference the ground truth or model sample.

Here’s a full runnable code sample:

```python
import os
import requests

# get the API key from environment
api_key = os.environ["OPENAI_API_KEY"]
headers = {"Authorization": f"Bearer {api_key}"}

# Define a score-model grader.
grader = {
    "type": "score_model",
    "name": "my_score_model",
    "input": [
        {
            "role": "system",
            "content": "You are an expert grader. If the reference and model answer are exact matches, output a score of 1. If they are somewhat similar in meaning, output a score in 0.5. Otherwise, give a score of 0.",
        },
        {
            "role": "user",
            "content": "Reference: {{ item.reference_answer }}. Model answer: {{ sample.output_text }}",
        },
    ],
    "pass_threshold": 0.5,
    "model": "o4-mini-2025-04-16",
    "range": [0, 1],
    "sampling_params": {
        "max_completions_tokens": 32768,
        "top_p": 1,
        "reasoning_effort": "medium",
    },
}

# validate the grader
payload = {"grader": grader}
response = requests.post(
    "https://api.openai.com/v1/fine_tuning/alpha/graders/validate",
    json=payload,
    headers=headers,
)
print("validate response:", response.text)

# run the grader with a test reference and sample
payload = {"grader": grader, "item": {"reference_answer": 1.0}, "model_sample": "0.9"}
response = requests.post(
    "https://api.openai.com/v1/fine_tuning/alpha/graders/run",
    json=payload,
    headers=headers,
)
print("run response:", response.text)
```


#### Score model grader outputs

Under the hood, the `score_model` grader will query the requested model with the provided prompt and sampling parameters and will request a response in a specific response format. The response format that is used is provided below

```json
{
  "result": float,
  "steps": ReasoningStep[],
}
```

Where each reasoning step is of the form

```json
{
    description: string,
    conclusion: string
}
```

This format queries the model not just for the numeric `result` (the reward value for the query), but also provides the model some space to think through the reasoning behind the score. When you are writing your grader prompt, it may be useful to refer to these two fields by name explicitly (for example, “include reasoning about the type of chemical bonds present in the molecule in the conclusion of your reasoning step,” or “return a value of −1.0 in the `result` field if the inputs do not satisfy condition X”).

### Model grader constraints

- Only the following models are supported for the `model` parameter
  - `gpt-4o-2024-08-06`
  - `gpt-4o-mini-2024-07-18`
  - `gpt-4.1-2025-04-14`
  - `gpt-4.1-mini-2025-04-14`
  - `gpt-4.1-nano-2025-04-14`
  - `o1-2024-12-17`
  - `o3-mini-2025-01-31`
  - `o3-2025-04-16`
  - `o4-mini-2025-04-16`
- `temperature` changes not supported for reasoning models.
- `reasoning_effort` is not supported for non-reasoning models.

### How to write grader prompts

Writing grader prompts is an iterative process. The best way to iterate on a model grader prompt is to create a model grader eval. To do this, you need:

1. **Task prompts**: Write extremely detailed prompts for the desired task, with step-by-step instructions and many specific examples in context.
1. **Answers generated by a model or human expert**: Provide many high quality examples of answers, both from the model and trusted human experts.
1. **Corresponding ground truth grades for those answers**: Establish what a good grade looks like. For example, your human expert grades should be 1.

Then you can automatically evaluate how effectively the model grader distinguishes answers of different quality levels. Over time, add edge cases into your model grader eval as you discover and patch them with changes to the prompt.

For example, say you know from your human experts which answers are best:

```
answer_1 > answer_2 > answer_3
```

Verify that the model grader's answers match that:

```
model_grader(answer_1, reference_answer) > model_grader(answer_2, reference_answer) > model_grader(answer_3, reference_answer)
```

### Grader hacking

Models being trained sometimes learn to exploit weaknesses in model graders, also known as “grader hacking” or “reward hacking." You can detect this by checking the model's performance across model grader evals and expert human evals. A model that's hacked the grader will score highly on model grader evals but score poorly on expert human evaluations. Over time, we intend to improve observability in the API to make it easier to detect this during training.

## Python graders

This grader allows you to execute arbitrary python code to grade the model output. The grader expects a grade function to be present that takes in two arguments and outputs a float value. Any other result (exception, invalid float value, etc.) will be marked as invalid and return a 0 grade.

```json
{
  "type": "python",
  "source": "def grade(sample, item):\n    return 1.0",
  "image_tag": "2025-05-08"
}
```

The python source code must contain a grade function that takes in exactly two arguments and returns a float value as a grade.

```python
from typing import Any


def grade(sample: dict[str, Any], item: dict[str, Any]) -> float:
    # your logic here
    return 1.0
```


The first argument supplied to the grading function will be a dictionary populated with the model’s output during training for you to grade. `output_json` will only be populated if the output uses `response_format`.

```json
{
    "choices": [...],
    "output_text": "...",
    "output_json": {},
    "output_tools": [...],
    "output_audio": {}
}
```

The second argument supplied is a dictionary populated with input grading context. For evals, this will include keys from the data source. For fine-tuning this will include keys from each training data row.

```json
{
    "reference_answer": "...",
    "my_key": {...}
}
```

Here's a working example:

```python
import os
import requests

# get the API key from environment
api_key = os.environ["OPENAI_API_KEY"]
headers = {"Authorization": f"Bearer {api_key}"}

grading_function = """
from rapidfuzz import fuzz, utils

def grade(sample, item) -> float:
    output_text = sample["output_text"]
    reference_answer = item["reference_answer"]
    return fuzz.WRatio(output_text, reference_answer, processor=utils.default_process) / 100.0
"""

# Define a Python grader.
grader = {"type": "python", "source": grading_function}

# validate the grader
payload = {"grader": grader}
response = requests.post(
    "https://api.openai.com/v1/fine_tuning/alpha/graders/validate",
    json=payload,
    headers=headers,
)
print("validate request_id:", response.headers["x-request-id"])
print("validate response:", response.text)

# run the grader with a test reference and sample
payload = {
    "grader": grader,
    "item": {"reference_answer": "fuzzy wuzzy had no hair"},
    "model_sample": "fuzzy wuzzy was a bear",
}
response = requests.post(
    "https://api.openai.com/v1/fine_tuning/alpha/graders/run",
    json=payload,
    headers=headers,
)
print("run request_id:", response.headers["x-request-id"])
print("run response:", response.text)
```


**Tip:**
If you don't want to manually put your grading function in a string, you can also load it from a Python file using `importlib` and `inspect`. For example, if your grader function is in a file named `grader.py`, you can do:

```python
import importlib
import inspect

grader_module = importlib.import_module("grader")
grader = {"type": "python", "source": inspect.getsource(grader_module)}
```


This will automatically use the entire source code of your `grader.py` file as the grader which can be helpful for longer graders.

### Technical constraints

- Your uploaded code must be less than `256kB` and will not have network access.
- The grading execution itself is limited to 2 minutes.
- At runtime you will be given a limit of 2Gb of memory and 1Gb of disk space to use.
- There's a limit of 2 CPU cores—any usage above this amount will result in throttling

The following third-party packages are available at execution time for the image tag `2025-05-08`

```
numpy==2.2.4
scipy==1.15.2
sympy==1.13.3
pandas==2.2.3
rapidfuzz==3.10.1
scikit-learn==1.6.1
rouge-score==0.1.2
deepdiff==8.4.2
jsonschema==4.23.0
pydantic==2.10.6
pyyaml==6.0.2
nltk==3.9.1
sqlparse==0.5.3
rdkit==2024.9.6
scikit-bio==0.6.3
ast-grep-py==0.36.2
```

Additionally, the following NLTK corpora are available:

```
punkt
stopwords
wordnet
omw-1.4
names
```

## Combined graders

> Currently, this grader is only used for Reinforcement fine-tuning

A `multigrader` object combines the output of multiple graders to produce a single score. Combined graders compute grades over the fields of other grader objects and turn those sub-grades into an overall grade. This is useful when a correct answer depends on multiple things being true—for example, that the text is similar _and_ that the answer contains a specific string.

As an example, say you wanted the model to output JSON with the following two fields:

```json
{
  "name": "John Doe",
  "email": "john.doe@gmail.com"
}
```

You'd want your grader to compare the two fields and then take the average between them.

You can do this by combining multiple graders into an object grader, and then defining a formula to calculate the output score based on each field:

```json
{
  "type": "multi",
  "graders": {
    "name": {
      "name": "name_grader",
      "type": "text_similarity",
      "input": "{{sample.output_json.name}}",
      "reference": "{{item.name}}",
      "evaluation_metric": "fuzzy_match",
      "pass_threshold": 0.9
    },
    "email": {
      "name": "email_grader",
      "type": "string_check",
      "input": "{{sample.output_json.email}}",
      "reference": "{{item.email}}",
      "operation": "eq"
    }
  },
  "calculate_output": "(name + email) / 2"
}
```

In this example, it’s important for the model to get the email exactly right (`string_check` returns either 0 or 1) but we tolerate some misspellings on the name (`text_similarity` returns range from 0 to 1). Samples that get the email wrong will score between 0-0.5, and samples that get the email right will score between 0.5-1.0.

You cannot nest one `multigrader` inside another.

The calculate output field will have the keys of the input `graders` as possible variables and the following features are supported:

**Operators**

- `+` (addition)
- `-` (subtraction)
- `*` (multiplication)
- `/` (division)
- `^` (power)

**Functions**

- `min`
- `max`
- `abs`
- `floor`
- `ceil`
- `exp`
- `sqrt`
- `log`

## Limitations and tips

Designing and creating graders is an iterative process. Start small, experiment, and continue to make changes to get better results.

### Design tips

To get the most value from your graders, use these design principles:

- **Produce a smooth score, not a pass/fail stamp**. A score that shifts gradually as answers improve helps the optimizer see which changes matter.
- **Guard against reward hacking**. This happens when the model finds a shortcut that earns high scores without real skill. Make it hard to loophole your grading system.
- **Avoid skewed data**. Datasets in which one label shows up most of the time invite the model to guess that label. Balance the set or up‑weight rare cases so the model must think.
- **Use an LLM‑as‑a-judge when code falls short**. For rich, open‑ended answers, ask another language model to grade. When building LLM graders, run multiple candidate responses and ground truths through your LLM judge to ensure grading is stable and aligned with preference. Provide few-shot examples of great, fair, and poor answers in the prompt.