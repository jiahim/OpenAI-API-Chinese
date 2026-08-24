# Fine Tuning

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

# Alpha

# Graders

## Run grader

**post** `/fine_tuning/alpha/graders/run`

Run a grader.

### Body Parameters

- `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

  The grader used for the fine-tuning job.

  - `StringCheckGrader object { input, name, operation, 2 more }`

    A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

    - `input: string`

      The input text. This may include template strings.

    - `name: string`

      The name of the grader.

    - `operation: "eq" or "ne" or "like" or "ilike"`

      The string check operation to perform. One of `eq`, `ne`, `like`, or `ilike`.

      - `"eq"`

      - `"ne"`

      - `"like"`

      - `"ilike"`

    - `reference: string`

      The reference text. This may include template strings.

    - `type: "string_check"`

      The object type, which is always `string_check`.

      - `"string_check"`

  - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

    A TextSimilarityGrader object which grades text based on similarity metrics.

    - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

      The evaluation metric to use. One of `cosine`, `fuzzy_match`, `bleu`,
      `gleu`, `meteor`, `rouge_1`, `rouge_2`, `rouge_3`, `rouge_4`, `rouge_5`,
      or `rouge_l`.

      - `"cosine"`

      - `"fuzzy_match"`

      - `"bleu"`

      - `"gleu"`

      - `"meteor"`

      - `"rouge_1"`

      - `"rouge_2"`

      - `"rouge_3"`

      - `"rouge_4"`

      - `"rouge_5"`

      - `"rouge_l"`

    - `input: string`

      The text being graded.

    - `name: string`

      The name of the grader.

    - `reference: string`

      The text being graded against.

    - `type: "text_similarity"`

      The type of grader.

      - `"text_similarity"`

  - `PythonGrader object { name, source, type, image_tag }`

    A PythonGrader object that runs a python script on the input.

    - `name: string`

      The name of the grader.

    - `source: string`

      The source code of the python script.

    - `type: "python"`

      The object type, which is always `python`.

      - `"python"`

    - `image_tag: optional string`

      The image tag to use for the python script.

  - `ScoreModelGrader object { input, model, name, 3 more }`

    A ScoreModelGrader object that uses a model to assign a score to the input.

    - `input: array of object { content, role, type }`

      The input messages evaluated by the grader. Supports text, output text, input image, and input audio content blocks, and may include template strings.

      - `content: string or ResponseInputText or object { text, type }  or 3 more`

        Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

        - `TextInput = string`

          A text input to the model.

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          A text input to the model.

          - `text: string`

            The text input to the model.

          - `type: "input_text"`

            The type of the input item. Always `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

            - `mode: "explicit"`

              The breakpoint mode. Always `explicit`.

              - `"explicit"`

        - `OutputText object { text, type }`

          A text output from the model.

          - `text: string`

            The text output from the model.

          - `type: "output_text"`

            The type of the output text. Always `output_text`.

            - `"output_text"`

        - `InputImage object { image_url, type, detail }`

          An image input block used within EvalItem content arrays.

          - `image_url: string`

            The URL of the image input.

          - `type: "input_image"`

            The type of the image input. Always `input_image`.

            - `"input_image"`

          - `detail: optional string`

            The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

        - `ResponseInputAudio object { input_audio, type }`

          An audio input to the model.

          - `input_audio: object { data, format }`

            - `data: string`

              Base64-encoded audio data.

            - `format: "mp3" or "wav"`

              The format of the audio data. Currently supported formats are `mp3` and
              `wav`.

              - `"mp3"`

              - `"wav"`

          - `type: "input_audio"`

            The type of the input item. Always `input_audio`.

            - `"input_audio"`

        - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

          A list of inputs, each of which may be either an input text, output text, input
          image, or input audio object.

          - `TextInput = string`

            A text input to the model.

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            A text input to the model.

          - `OutputText object { text, type }`

            A text output from the model.

            - `text: string`

              The text output from the model.

            - `type: "output_text"`

              The type of the output text. Always `output_text`.

              - `"output_text"`

          - `InputImage object { image_url, type, detail }`

            An image input block used within EvalItem content arrays.

            - `image_url: string`

              The URL of the image input.

            - `type: "input_image"`

              The type of the image input. Always `input_image`.

              - `"input_image"`

            - `detail: optional string`

              The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            An audio input to the model.

      - `role: "user" or "assistant" or "system" or "developer"`

        The role of the message input. One of `user`, `assistant`, `system`, or
        `developer`.

        - `"user"`

        - `"assistant"`

        - `"system"`

        - `"developer"`

      - `type: optional "message"`

        The type of the message input. Always `message`.

        - `"message"`

    - `model: string`

      The model to use for the evaluation.

    - `name: string`

      The name of the grader.

    - `type: "score_model"`

      The object type, which is always `score_model`.

      - `"score_model"`

    - `range: optional array of number`

      The range of the score. Defaults to `[0, 1]`.

    - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

      The sampling parameters for the model.

      - `max_completions_tokens: optional number or null`

        The maximum number of tokens the grader model may generate in its response.

      - `reasoning_effort: optional ReasoningEffort or null`

        Constrains effort on reasoning for reasoning models. Currently supported
        values are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`.
        Reducing reasoning effort can result in faster responses and fewer tokens
        used on reasoning in a response. Not all reasoning models support every
        value. See the
        [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
        for model-specific support.

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `seed: optional number or null`

        A seed value to initialize the randomness, during sampling.

      - `temperature: optional number or null`

        A higher temperature increases randomness in the outputs.

      - `top_p: optional number or null`

        An alternative to temperature for nucleus sampling; 1.0 includes all tokens.

  - `MultiGrader object { calculate_output, graders, name, type }`

    A MultiGrader object combines the output of multiple graders to produce a single score.

    - `calculate_output: string`

      A formula to calculate the output based on grader results.

    - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

      A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

      - `StringCheckGrader object { input, name, operation, 2 more }`

        A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

      - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

        A TextSimilarityGrader object which grades text based on similarity metrics.

      - `PythonGrader object { name, source, type, image_tag }`

        A PythonGrader object that runs a python script on the input.

      - `ScoreModelGrader object { input, model, name, 3 more }`

        A ScoreModelGrader object that uses a model to assign a score to the input.

      - `LabelModelGrader object { input, labels, model, 3 more }`

        A LabelModelGrader object which uses a model to assign labels to each item
        in the evaluation.

        - `input: array of object { content, role, type }`

          - `content: string or ResponseInputText or object { text, type }  or 3 more`

            Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

            - `TextInput = string`

              A text input to the model.

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              A text input to the model.

            - `OutputText object { text, type }`

              A text output from the model.

              - `text: string`

                The text output from the model.

              - `type: "output_text"`

                The type of the output text. Always `output_text`.

                - `"output_text"`

            - `InputImage object { image_url, type, detail }`

              An image input block used within EvalItem content arrays.

              - `image_url: string`

                The URL of the image input.

              - `type: "input_image"`

                The type of the image input. Always `input_image`.

                - `"input_image"`

              - `detail: optional string`

                The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              An audio input to the model.

            - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

              A list of inputs, each of which may be either an input text, output text, input
              image, or input audio object.

          - `role: "user" or "assistant" or "system" or "developer"`

            The role of the message input. One of `user`, `assistant`, `system`, or
            `developer`.

            - `"user"`

            - `"assistant"`

            - `"system"`

            - `"developer"`

          - `type: optional "message"`

            The type of the message input. Always `message`.

            - `"message"`

        - `labels: array of string`

          The labels to assign to each item in the evaluation.

        - `model: string`

          The model to use for the evaluation. Must support structured outputs.

        - `name: string`

          The name of the grader.

        - `passing_labels: array of string`

          The labels that indicate a passing result. Must be a subset of labels.

        - `type: "label_model"`

          The object type, which is always `label_model`.

          - `"label_model"`

    - `name: string`

      The name of the grader.

    - `type: "multi"`

      The object type, which is always `multi`.

      - `"multi"`

- `model_sample: string`

  The model sample to be evaluated. This value will be used to populate
  the `sample` namespace. See [the guide](/docs/guides/graders) for more details.
  The `output_json` variable will be populated if the model sample is a
  valid JSON string.

- `item: optional unknown`

  The dataset item provided to the grader. This will be used to populate
  the `item` namespace. See [the guide](/docs/guides/graders) for more details.

### Returns

- `metadata: object { errors, execution_time, name, 4 more }`

  - `errors: object { formula_parse_error, invalid_variable_error, model_grader_parse_error, 11 more }`

    - `formula_parse_error: boolean`

    - `invalid_variable_error: boolean`

    - `model_grader_parse_error: boolean`

    - `model_grader_refusal_error: boolean`

    - `model_grader_server_error: boolean`

    - `model_grader_server_error_details: string or null`

    - `other_error: boolean`

    - `python_grader_runtime_error: boolean`

    - `python_grader_runtime_error_details: string or null`

    - `python_grader_server_error: boolean`

    - `python_grader_server_error_type: string or null`

    - `sample_parse_error: boolean`

    - `truncated_observation_error: boolean`

    - `unresponsive_reward_error: boolean`

  - `execution_time: number`

  - `name: string`

  - `sampled_model_name: string or null`

  - `scores: map[unknown]`

  - `token_usage: number or null`

  - `type: string`

- `model_grader_token_usage_per_model: map[unknown]`

- `reward: number`

- `sub_rewards: map[unknown]`

### Example

```http
curl https://api.openai.com/v1/fine_tuning/alpha/graders/run \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "grader": {
            "input": "input",
            "name": "name",
            "operation": "eq",
            "reference": "reference",
            "type": "string_check"
          },
          "model_sample": "model_sample"
        }'
```

#### Response

```json
{
  "metadata": {
    "errors": {
      "formula_parse_error": true,
      "invalid_variable_error": true,
      "model_grader_parse_error": true,
      "model_grader_refusal_error": true,
      "model_grader_server_error": true,
      "model_grader_server_error_details": "model_grader_server_error_details",
      "other_error": true,
      "python_grader_runtime_error": true,
      "python_grader_runtime_error_details": "python_grader_runtime_error_details",
      "python_grader_server_error": true,
      "python_grader_server_error_type": "python_grader_server_error_type",
      "sample_parse_error": true,
      "truncated_observation_error": true,
      "unresponsive_reward_error": true
    },
    "execution_time": 0,
    "name": "name",
    "sampled_model_name": "sampled_model_name",
    "scores": {
      "foo": "bar"
    },
    "token_usage": 0,
    "type": "type"
  },
  "model_grader_token_usage_per_model": {
    "foo": "bar"
  },
  "reward": 0,
  "sub_rewards": {
    "foo": "bar"
  }
}
```

### Score an audio response

```http
curl -X POST https://api.openai.com/v1/fine_tuning/alpha/graders/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "grader": {
      "type": "score_model",
      "name": "Audio clarity grader",
      "input": [
        {
          "role": "user",
          "content": [
            {
              "type": "input_text",
              "text": "Listen to the clip and return a confidence score from 0 to 1 that the speaker said: {{item.target_phrase}}"
            },
            {
              "type": "input_audio",
              "input_audio": {
                "data": "{{item.audio_clip_b64}}",
                "format": "mp3"
              }
            }
          ]
        }
      ],
      "model": "gpt-audio",
      "sampling_params": {
        "temperature": 0.2,
        "top_p": 1,
        "seed": 123
      }
    },
    "item": {
      "target_phrase": "Please deliver the package on Tuesday",
      "audio_clip_b64": "<base64-encoded mp3>"
    },
    "model_sample": "Please deliver the package on Tuesday"
  }'
```

### Score an image caption

```http
curl -X POST https://api.openai.com/v1/fine_tuning/alpha/graders/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "grader": {
      "type": "score_model",
      "name": "Image caption grader",
      "input": [
        {
          "role": "user",
          "content": [
            {
              "type": "input_text",
              "text": "Score how well the provided caption matches the image on a 0-1 scale. Only return the score.\n\nCaption: {{sample.output_text}}"
            },
            {
              "type": "input_image",
              "image_url": "https://example.com/dog-catching-ball.png",
              "file_id": null,
              "detail": "high"
            }
          ]
        }
      ],
      "model": "gpt-5-mini",
      "sampling_params": {
        "temperature": 0.2
      }
    },
    "item": {
      "expected_caption": "A golden retriever jumps to catch a tennis ball"
    },
    "model_sample": "A dog leaps to grab a tennis ball mid-air"
  }'
```

### Score text alignment

```http
curl -X POST https://api.openai.com/v1/fine_tuning/alpha/graders/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "grader": {
      "type": "score_model",
      "name": "Example score model grader",
      "input": [
        {
          "role": "user",
          "content": [
            {
              "type": "input_text",
              "text": "Score how close the reference answer is to the model answer on a 0-1 scale. Return only the score.\n\nReference answer: {{item.reference_answer}}\n\nModel answer: {{sample.output_text}}"
            }
          ]
        }
      ],
      "model": "gpt-5-mini",
      "sampling_params": {
        "temperature": 1,
        "top_p": 1,
        "seed": 42
      }
    },
    "item": {
      "reference_answer": "fuzzy wuzzy was a bear"
    },
    "model_sample": "fuzzy wuzzy was a bear"
  }'
```

#### Response

```json
{
  "reward": 1.0,
  "metadata": {
    "name": "Example score model grader",
    "type": "score_model",
    "errors": {
      "formula_parse_error": false,
      "sample_parse_error": false,
      "truncated_observation_error": false,
      "unresponsive_reward_error": false,
      "invalid_variable_error": false,
      "other_error": false,
      "python_grader_server_error": false,
      "python_grader_server_error_type": null,
      "python_grader_runtime_error": false,
      "python_grader_runtime_error_details": null,
      "model_grader_server_error": false,
      "model_grader_refusal_error": false,
      "model_grader_parse_error": false,
      "model_grader_server_error_details": null
    },
    "execution_time": 4.365238428115845,
    "scores": {},
    "token_usage": {
      "prompt_tokens": 190,
      "total_tokens": 324,
      "completion_tokens": 134,
      "cached_tokens": 0
    },
    "sampled_model_name": "gpt-4o-2024-08-06"
  },
  "sub_rewards": {},
  "model_grader_token_usage_per_model": {
    "gpt-4o-2024-08-06": {
      "prompt_tokens": 190,
      "total_tokens": 324,
      "completion_tokens": 134,
      "cached_tokens": 0
    }
  }
}
```

## Validate grader

**post** `/fine_tuning/alpha/graders/validate`

Validate a grader.

### Body Parameters

- `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

  The grader used for the fine-tuning job.

  - `StringCheckGrader object { input, name, operation, 2 more }`

    A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

    - `input: string`

      The input text. This may include template strings.

    - `name: string`

      The name of the grader.

    - `operation: "eq" or "ne" or "like" or "ilike"`

      The string check operation to perform. One of `eq`, `ne`, `like`, or `ilike`.

      - `"eq"`

      - `"ne"`

      - `"like"`

      - `"ilike"`

    - `reference: string`

      The reference text. This may include template strings.

    - `type: "string_check"`

      The object type, which is always `string_check`.

      - `"string_check"`

  - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

    A TextSimilarityGrader object which grades text based on similarity metrics.

    - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

      The evaluation metric to use. One of `cosine`, `fuzzy_match`, `bleu`,
      `gleu`, `meteor`, `rouge_1`, `rouge_2`, `rouge_3`, `rouge_4`, `rouge_5`,
      or `rouge_l`.

      - `"cosine"`

      - `"fuzzy_match"`

      - `"bleu"`

      - `"gleu"`

      - `"meteor"`

      - `"rouge_1"`

      - `"rouge_2"`

      - `"rouge_3"`

      - `"rouge_4"`

      - `"rouge_5"`

      - `"rouge_l"`

    - `input: string`

      The text being graded.

    - `name: string`

      The name of the grader.

    - `reference: string`

      The text being graded against.

    - `type: "text_similarity"`

      The type of grader.

      - `"text_similarity"`

  - `PythonGrader object { name, source, type, image_tag }`

    A PythonGrader object that runs a python script on the input.

    - `name: string`

      The name of the grader.

    - `source: string`

      The source code of the python script.

    - `type: "python"`

      The object type, which is always `python`.

      - `"python"`

    - `image_tag: optional string`

      The image tag to use for the python script.

  - `ScoreModelGrader object { input, model, name, 3 more }`

    A ScoreModelGrader object that uses a model to assign a score to the input.

    - `input: array of object { content, role, type }`

      The input messages evaluated by the grader. Supports text, output text, input image, and input audio content blocks, and may include template strings.

      - `content: string or ResponseInputText or object { text, type }  or 3 more`

        Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

        - `TextInput = string`

          A text input to the model.

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          A text input to the model.

          - `text: string`

            The text input to the model.

          - `type: "input_text"`

            The type of the input item. Always `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

            - `mode: "explicit"`

              The breakpoint mode. Always `explicit`.

              - `"explicit"`

        - `OutputText object { text, type }`

          A text output from the model.

          - `text: string`

            The text output from the model.

          - `type: "output_text"`

            The type of the output text. Always `output_text`.

            - `"output_text"`

        - `InputImage object { image_url, type, detail }`

          An image input block used within EvalItem content arrays.

          - `image_url: string`

            The URL of the image input.

          - `type: "input_image"`

            The type of the image input. Always `input_image`.

            - `"input_image"`

          - `detail: optional string`

            The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

        - `ResponseInputAudio object { input_audio, type }`

          An audio input to the model.

          - `input_audio: object { data, format }`

            - `data: string`

              Base64-encoded audio data.

            - `format: "mp3" or "wav"`

              The format of the audio data. Currently supported formats are `mp3` and
              `wav`.

              - `"mp3"`

              - `"wav"`

          - `type: "input_audio"`

            The type of the input item. Always `input_audio`.

            - `"input_audio"`

        - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

          A list of inputs, each of which may be either an input text, output text, input
          image, or input audio object.

          - `TextInput = string`

            A text input to the model.

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            A text input to the model.

          - `OutputText object { text, type }`

            A text output from the model.

            - `text: string`

              The text output from the model.

            - `type: "output_text"`

              The type of the output text. Always `output_text`.

              - `"output_text"`

          - `InputImage object { image_url, type, detail }`

            An image input block used within EvalItem content arrays.

            - `image_url: string`

              The URL of the image input.

            - `type: "input_image"`

              The type of the image input. Always `input_image`.

              - `"input_image"`

            - `detail: optional string`

              The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            An audio input to the model.

      - `role: "user" or "assistant" or "system" or "developer"`

        The role of the message input. One of `user`, `assistant`, `system`, or
        `developer`.

        - `"user"`

        - `"assistant"`

        - `"system"`

        - `"developer"`

      - `type: optional "message"`

        The type of the message input. Always `message`.

        - `"message"`

    - `model: string`

      The model to use for the evaluation.

    - `name: string`

      The name of the grader.

    - `type: "score_model"`

      The object type, which is always `score_model`.

      - `"score_model"`

    - `range: optional array of number`

      The range of the score. Defaults to `[0, 1]`.

    - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

      The sampling parameters for the model.

      - `max_completions_tokens: optional number or null`

        The maximum number of tokens the grader model may generate in its response.

      - `reasoning_effort: optional ReasoningEffort or null`

        Constrains effort on reasoning for reasoning models. Currently supported
        values are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`.
        Reducing reasoning effort can result in faster responses and fewer tokens
        used on reasoning in a response. Not all reasoning models support every
        value. See the
        [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
        for model-specific support.

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `seed: optional number or null`

        A seed value to initialize the randomness, during sampling.

      - `temperature: optional number or null`

        A higher temperature increases randomness in the outputs.

      - `top_p: optional number or null`

        An alternative to temperature for nucleus sampling; 1.0 includes all tokens.

  - `MultiGrader object { calculate_output, graders, name, type }`

    A MultiGrader object combines the output of multiple graders to produce a single score.

    - `calculate_output: string`

      A formula to calculate the output based on grader results.

    - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

      A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

      - `StringCheckGrader object { input, name, operation, 2 more }`

        A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

      - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

        A TextSimilarityGrader object which grades text based on similarity metrics.

      - `PythonGrader object { name, source, type, image_tag }`

        A PythonGrader object that runs a python script on the input.

      - `ScoreModelGrader object { input, model, name, 3 more }`

        A ScoreModelGrader object that uses a model to assign a score to the input.

      - `LabelModelGrader object { input, labels, model, 3 more }`

        A LabelModelGrader object which uses a model to assign labels to each item
        in the evaluation.

        - `input: array of object { content, role, type }`

          - `content: string or ResponseInputText or object { text, type }  or 3 more`

            Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

            - `TextInput = string`

              A text input to the model.

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              A text input to the model.

            - `OutputText object { text, type }`

              A text output from the model.

              - `text: string`

                The text output from the model.

              - `type: "output_text"`

                The type of the output text. Always `output_text`.

                - `"output_text"`

            - `InputImage object { image_url, type, detail }`

              An image input block used within EvalItem content arrays.

              - `image_url: string`

                The URL of the image input.

              - `type: "input_image"`

                The type of the image input. Always `input_image`.

                - `"input_image"`

              - `detail: optional string`

                The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              An audio input to the model.

            - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

              A list of inputs, each of which may be either an input text, output text, input
              image, or input audio object.

          - `role: "user" or "assistant" or "system" or "developer"`

            The role of the message input. One of `user`, `assistant`, `system`, or
            `developer`.

            - `"user"`

            - `"assistant"`

            - `"system"`

            - `"developer"`

          - `type: optional "message"`

            The type of the message input. Always `message`.

            - `"message"`

        - `labels: array of string`

          The labels to assign to each item in the evaluation.

        - `model: string`

          The model to use for the evaluation. Must support structured outputs.

        - `name: string`

          The name of the grader.

        - `passing_labels: array of string`

          The labels that indicate a passing result. Must be a subset of labels.

        - `type: "label_model"`

          The object type, which is always `label_model`.

          - `"label_model"`

    - `name: string`

      The name of the grader.

    - `type: "multi"`

      The object type, which is always `multi`.

      - `"multi"`

### Returns

- `grader: optional StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

  The grader used for the fine-tuning job.

  - `StringCheckGrader object { input, name, operation, 2 more }`

    A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

    - `input: string`

      The input text. This may include template strings.

    - `name: string`

      The name of the grader.

    - `operation: "eq" or "ne" or "like" or "ilike"`

      The string check operation to perform. One of `eq`, `ne`, `like`, or `ilike`.

      - `"eq"`

      - `"ne"`

      - `"like"`

      - `"ilike"`

    - `reference: string`

      The reference text. This may include template strings.

    - `type: "string_check"`

      The object type, which is always `string_check`.

      - `"string_check"`

  - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

    A TextSimilarityGrader object which grades text based on similarity metrics.

    - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

      The evaluation metric to use. One of `cosine`, `fuzzy_match`, `bleu`,
      `gleu`, `meteor`, `rouge_1`, `rouge_2`, `rouge_3`, `rouge_4`, `rouge_5`,
      or `rouge_l`.

      - `"cosine"`

      - `"fuzzy_match"`

      - `"bleu"`

      - `"gleu"`

      - `"meteor"`

      - `"rouge_1"`

      - `"rouge_2"`

      - `"rouge_3"`

      - `"rouge_4"`

      - `"rouge_5"`

      - `"rouge_l"`

    - `input: string`

      The text being graded.

    - `name: string`

      The name of the grader.

    - `reference: string`

      The text being graded against.

    - `type: "text_similarity"`

      The type of grader.

      - `"text_similarity"`

  - `PythonGrader object { name, source, type, image_tag }`

    A PythonGrader object that runs a python script on the input.

    - `name: string`

      The name of the grader.

    - `source: string`

      The source code of the python script.

    - `type: "python"`

      The object type, which is always `python`.

      - `"python"`

    - `image_tag: optional string`

      The image tag to use for the python script.

  - `ScoreModelGrader object { input, model, name, 3 more }`

    A ScoreModelGrader object that uses a model to assign a score to the input.

    - `input: array of object { content, role, type }`

      The input messages evaluated by the grader. Supports text, output text, input image, and input audio content blocks, and may include template strings.

      - `content: string or ResponseInputText or object { text, type }  or 3 more`

        Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

        - `TextInput = string`

          A text input to the model.

        - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

          A text input to the model.

          - `text: string`

            The text input to the model.

          - `type: "input_text"`

            The type of the input item. Always `input_text`.

            - `"input_text"`

          - `prompt_cache_breakpoint: optional object { mode }`

            Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

            - `mode: "explicit"`

              The breakpoint mode. Always `explicit`.

              - `"explicit"`

        - `OutputText object { text, type }`

          A text output from the model.

          - `text: string`

            The text output from the model.

          - `type: "output_text"`

            The type of the output text. Always `output_text`.

            - `"output_text"`

        - `InputImage object { image_url, type, detail }`

          An image input block used within EvalItem content arrays.

          - `image_url: string`

            The URL of the image input.

          - `type: "input_image"`

            The type of the image input. Always `input_image`.

            - `"input_image"`

          - `detail: optional string`

            The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

        - `ResponseInputAudio object { input_audio, type }`

          An audio input to the model.

          - `input_audio: object { data, format }`

            - `data: string`

              Base64-encoded audio data.

            - `format: "mp3" or "wav"`

              The format of the audio data. Currently supported formats are `mp3` and
              `wav`.

              - `"mp3"`

              - `"wav"`

          - `type: "input_audio"`

            The type of the input item. Always `input_audio`.

            - `"input_audio"`

        - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

          A list of inputs, each of which may be either an input text, output text, input
          image, or input audio object.

          - `TextInput = string`

            A text input to the model.

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            A text input to the model.

          - `OutputText object { text, type }`

            A text output from the model.

            - `text: string`

              The text output from the model.

            - `type: "output_text"`

              The type of the output text. Always `output_text`.

              - `"output_text"`

          - `InputImage object { image_url, type, detail }`

            An image input block used within EvalItem content arrays.

            - `image_url: string`

              The URL of the image input.

            - `type: "input_image"`

              The type of the image input. Always `input_image`.

              - `"input_image"`

            - `detail: optional string`

              The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            An audio input to the model.

      - `role: "user" or "assistant" or "system" or "developer"`

        The role of the message input. One of `user`, `assistant`, `system`, or
        `developer`.

        - `"user"`

        - `"assistant"`

        - `"system"`

        - `"developer"`

      - `type: optional "message"`

        The type of the message input. Always `message`.

        - `"message"`

    - `model: string`

      The model to use for the evaluation.

    - `name: string`

      The name of the grader.

    - `type: "score_model"`

      The object type, which is always `score_model`.

      - `"score_model"`

    - `range: optional array of number`

      The range of the score. Defaults to `[0, 1]`.

    - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

      The sampling parameters for the model.

      - `max_completions_tokens: optional number or null`

        The maximum number of tokens the grader model may generate in its response.

      - `reasoning_effort: optional ReasoningEffort or null`

        Constrains effort on reasoning for reasoning models. Currently supported
        values are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`.
        Reducing reasoning effort can result in faster responses and fewer tokens
        used on reasoning in a response. Not all reasoning models support every
        value. See the
        [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
        for model-specific support.

        - `"none"`

        - `"minimal"`

        - `"low"`

        - `"medium"`

        - `"high"`

        - `"xhigh"`

        - `"max"`

      - `seed: optional number or null`

        A seed value to initialize the randomness, during sampling.

      - `temperature: optional number or null`

        A higher temperature increases randomness in the outputs.

      - `top_p: optional number or null`

        An alternative to temperature for nucleus sampling; 1.0 includes all tokens.

  - `MultiGrader object { calculate_output, graders, name, type }`

    A MultiGrader object combines the output of multiple graders to produce a single score.

    - `calculate_output: string`

      A formula to calculate the output based on grader results.

    - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

      A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

      - `StringCheckGrader object { input, name, operation, 2 more }`

        A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

      - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

        A TextSimilarityGrader object which grades text based on similarity metrics.

      - `PythonGrader object { name, source, type, image_tag }`

        A PythonGrader object that runs a python script on the input.

      - `ScoreModelGrader object { input, model, name, 3 more }`

        A ScoreModelGrader object that uses a model to assign a score to the input.

      - `LabelModelGrader object { input, labels, model, 3 more }`

        A LabelModelGrader object which uses a model to assign labels to each item
        in the evaluation.

        - `input: array of object { content, role, type }`

          - `content: string or ResponseInputText or object { text, type }  or 3 more`

            Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

            - `TextInput = string`

              A text input to the model.

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              A text input to the model.

            - `OutputText object { text, type }`

              A text output from the model.

              - `text: string`

                The text output from the model.

              - `type: "output_text"`

                The type of the output text. Always `output_text`.

                - `"output_text"`

            - `InputImage object { image_url, type, detail }`

              An image input block used within EvalItem content arrays.

              - `image_url: string`

                The URL of the image input.

              - `type: "input_image"`

                The type of the image input. Always `input_image`.

                - `"input_image"`

              - `detail: optional string`

                The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              An audio input to the model.

            - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

              A list of inputs, each of which may be either an input text, output text, input
              image, or input audio object.

          - `role: "user" or "assistant" or "system" or "developer"`

            The role of the message input. One of `user`, `assistant`, `system`, or
            `developer`.

            - `"user"`

            - `"assistant"`

            - `"system"`

            - `"developer"`

          - `type: optional "message"`

            The type of the message input. Always `message`.

            - `"message"`

        - `labels: array of string`

          The labels to assign to each item in the evaluation.

        - `model: string`

          The model to use for the evaluation. Must support structured outputs.

        - `name: string`

          The name of the grader.

        - `passing_labels: array of string`

          The labels that indicate a passing result. Must be a subset of labels.

        - `type: "label_model"`

          The object type, which is always `label_model`.

          - `"label_model"`

    - `name: string`

      The name of the grader.

    - `type: "multi"`

      The object type, which is always `multi`.

      - `"multi"`

### Example

```http
curl https://api.openai.com/v1/fine_tuning/alpha/graders/validate \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "grader": {
            "input": "input",
            "name": "name",
            "operation": "eq",
            "reference": "reference",
            "type": "string_check"
          }
        }'
```

#### Response

```json
{
  "grader": {
    "input": "input",
    "name": "name",
    "operation": "eq",
    "reference": "reference",
    "type": "string_check"
  }
}
```

### Example

```http
curl https://api.openai.com/v1/fine_tuning/alpha/graders/validate \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "grader": {
      "type": "string_check",
      "name": "Example string check grader",
      "input": "{{sample.output_text}}",
      "reference": "{{item.label}}",
      "operation": "eq"
    }
  }'
```

#### Response

```json
{
  "grader": {
    "type": "string_check",
    "name": "Example string check grader",
    "input": "{{sample.output_text}}",
    "reference": "{{item.label}}",
    "operation": "eq"
  }
}
```

## Domain Types

### Grader Run Response

- `GraderRunResponse object { metadata, model_grader_token_usage_per_model, reward, sub_rewards }`

  - `metadata: object { errors, execution_time, name, 4 more }`

    - `errors: object { formula_parse_error, invalid_variable_error, model_grader_parse_error, 11 more }`

      - `formula_parse_error: boolean`

      - `invalid_variable_error: boolean`

      - `model_grader_parse_error: boolean`

      - `model_grader_refusal_error: boolean`

      - `model_grader_server_error: boolean`

      - `model_grader_server_error_details: string or null`

      - `other_error: boolean`

      - `python_grader_runtime_error: boolean`

      - `python_grader_runtime_error_details: string or null`

      - `python_grader_server_error: boolean`

      - `python_grader_server_error_type: string or null`

      - `sample_parse_error: boolean`

      - `truncated_observation_error: boolean`

      - `unresponsive_reward_error: boolean`

    - `execution_time: number`

    - `name: string`

    - `sampled_model_name: string or null`

    - `scores: map[unknown]`

    - `token_usage: number or null`

    - `type: string`

  - `model_grader_token_usage_per_model: map[unknown]`

  - `reward: number`

  - `sub_rewards: map[unknown]`

### Grader Validate Response

- `GraderValidateResponse object { grader }`

  - `grader: optional StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

    The grader used for the fine-tuning job.

    - `StringCheckGrader object { input, name, operation, 2 more }`

      A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

      - `input: string`

        The input text. This may include template strings.

      - `name: string`

        The name of the grader.

      - `operation: "eq" or "ne" or "like" or "ilike"`

        The string check operation to perform. One of `eq`, `ne`, `like`, or `ilike`.

        - `"eq"`

        - `"ne"`

        - `"like"`

        - `"ilike"`

      - `reference: string`

        The reference text. This may include template strings.

      - `type: "string_check"`

        The object type, which is always `string_check`.

        - `"string_check"`

    - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

      A TextSimilarityGrader object which grades text based on similarity metrics.

      - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

        The evaluation metric to use. One of `cosine`, `fuzzy_match`, `bleu`,
        `gleu`, `meteor`, `rouge_1`, `rouge_2`, `rouge_3`, `rouge_4`, `rouge_5`,
        or `rouge_l`.

        - `"cosine"`

        - `"fuzzy_match"`

        - `"bleu"`

        - `"gleu"`

        - `"meteor"`

        - `"rouge_1"`

        - `"rouge_2"`

        - `"rouge_3"`

        - `"rouge_4"`

        - `"rouge_5"`

        - `"rouge_l"`

      - `input: string`

        The text being graded.

      - `name: string`

        The name of the grader.

      - `reference: string`

        The text being graded against.

      - `type: "text_similarity"`

        The type of grader.

        - `"text_similarity"`

    - `PythonGrader object { name, source, type, image_tag }`

      A PythonGrader object that runs a python script on the input.

      - `name: string`

        The name of the grader.

      - `source: string`

        The source code of the python script.

      - `type: "python"`

        The object type, which is always `python`.

        - `"python"`

      - `image_tag: optional string`

        The image tag to use for the python script.

    - `ScoreModelGrader object { input, model, name, 3 more }`

      A ScoreModelGrader object that uses a model to assign a score to the input.

      - `input: array of object { content, role, type }`

        The input messages evaluated by the grader. Supports text, output text, input image, and input audio content blocks, and may include template strings.

        - `content: string or ResponseInputText or object { text, type }  or 3 more`

          Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

          - `TextInput = string`

            A text input to the model.

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            A text input to the model.

            - `text: string`

              The text input to the model.

            - `type: "input_text"`

              The type of the input item. Always `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

              - `mode: "explicit"`

                The breakpoint mode. Always `explicit`.

                - `"explicit"`

          - `OutputText object { text, type }`

            A text output from the model.

            - `text: string`

              The text output from the model.

            - `type: "output_text"`

              The type of the output text. Always `output_text`.

              - `"output_text"`

          - `InputImage object { image_url, type, detail }`

            An image input block used within EvalItem content arrays.

            - `image_url: string`

              The URL of the image input.

            - `type: "input_image"`

              The type of the image input. Always `input_image`.

              - `"input_image"`

            - `detail: optional string`

              The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            An audio input to the model.

            - `input_audio: object { data, format }`

              - `data: string`

                Base64-encoded audio data.

              - `format: "mp3" or "wav"`

                The format of the audio data. Currently supported formats are `mp3` and
                `wav`.

                - `"mp3"`

                - `"wav"`

            - `type: "input_audio"`

              The type of the input item. Always `input_audio`.

              - `"input_audio"`

          - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

            A list of inputs, each of which may be either an input text, output text, input
            image, or input audio object.

            - `TextInput = string`

              A text input to the model.

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              A text input to the model.

            - `OutputText object { text, type }`

              A text output from the model.

              - `text: string`

                The text output from the model.

              - `type: "output_text"`

                The type of the output text. Always `output_text`.

                - `"output_text"`

            - `InputImage object { image_url, type, detail }`

              An image input block used within EvalItem content arrays.

              - `image_url: string`

                The URL of the image input.

              - `type: "input_image"`

                The type of the image input. Always `input_image`.

                - `"input_image"`

              - `detail: optional string`

                The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              An audio input to the model.

        - `role: "user" or "assistant" or "system" or "developer"`

          The role of the message input. One of `user`, `assistant`, `system`, or
          `developer`.

          - `"user"`

          - `"assistant"`

          - `"system"`

          - `"developer"`

        - `type: optional "message"`

          The type of the message input. Always `message`.

          - `"message"`

      - `model: string`

        The model to use for the evaluation.

      - `name: string`

        The name of the grader.

      - `type: "score_model"`

        The object type, which is always `score_model`.

        - `"score_model"`

      - `range: optional array of number`

        The range of the score. Defaults to `[0, 1]`.

      - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

        The sampling parameters for the model.

        - `max_completions_tokens: optional number or null`

          The maximum number of tokens the grader model may generate in its response.

        - `reasoning_effort: optional ReasoningEffort or null`

          Constrains effort on reasoning for reasoning models. Currently supported
          values are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`.
          Reducing reasoning effort can result in faster responses and fewer tokens
          used on reasoning in a response. Not all reasoning models support every
          value. See the
          [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
          for model-specific support.

          - `"none"`

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

        - `seed: optional number or null`

          A seed value to initialize the randomness, during sampling.

        - `temperature: optional number or null`

          A higher temperature increases randomness in the outputs.

        - `top_p: optional number or null`

          An alternative to temperature for nucleus sampling; 1.0 includes all tokens.

    - `MultiGrader object { calculate_output, graders, name, type }`

      A MultiGrader object combines the output of multiple graders to produce a single score.

      - `calculate_output: string`

        A formula to calculate the output based on grader results.

      - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

        - `StringCheckGrader object { input, name, operation, 2 more }`

          A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          A TextSimilarityGrader object which grades text based on similarity metrics.

        - `PythonGrader object { name, source, type, image_tag }`

          A PythonGrader object that runs a python script on the input.

        - `ScoreModelGrader object { input, model, name, 3 more }`

          A ScoreModelGrader object that uses a model to assign a score to the input.

        - `LabelModelGrader object { input, labels, model, 3 more }`

          A LabelModelGrader object which uses a model to assign labels to each item
          in the evaluation.

          - `input: array of object { content, role, type }`

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

              - `TextInput = string`

                A text input to the model.

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                A text input to the model.

              - `OutputText object { text, type }`

                A text output from the model.

                - `text: string`

                  The text output from the model.

                - `type: "output_text"`

                  The type of the output text. Always `output_text`.

                  - `"output_text"`

              - `InputImage object { image_url, type, detail }`

                An image input block used within EvalItem content arrays.

                - `image_url: string`

                  The URL of the image input.

                - `type: "input_image"`

                  The type of the image input. Always `input_image`.

                  - `"input_image"`

                - `detail: optional string`

                  The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                An audio input to the model.

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                A list of inputs, each of which may be either an input text, output text, input
                image, or input audio object.

            - `role: "user" or "assistant" or "system" or "developer"`

              The role of the message input. One of `user`, `assistant`, `system`, or
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              The type of the message input. Always `message`.

              - `"message"`

          - `labels: array of string`

            The labels to assign to each item in the evaluation.

          - `model: string`

            The model to use for the evaluation. Must support structured outputs.

          - `name: string`

            The name of the grader.

          - `passing_labels: array of string`

            The labels that indicate a passing result. Must be a subset of labels.

          - `type: "label_model"`

            The object type, which is always `label_model`.

            - `"label_model"`

      - `name: string`

        The name of the grader.

      - `type: "multi"`

        The object type, which is always `multi`.

        - `"multi"`

# Checkpoints

# Permissions

## Create checkpoint permissions

**post** `/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions`

**NOTE:** Calling this endpoint requires an [admin API key](../admin-api-keys).

This enables organization owners to share fine-tuned models with other projects in their organization.

### Path Parameters

- `fine_tuned_model_checkpoint: string`

### Body Parameters

- `project_ids: array of string`

  The project identifiers to grant access to.

### Returns

- `data: array of object { id, created_at, object, project_id }`

  - `id: string`

    The permission identifier, which can be referenced in the API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the permission was created.

  - `object: "checkpoint.permission"`

    The object type, which is always "checkpoint.permission".

    - `"checkpoint.permission"`

  - `project_id: string`

    The project identifier that the permission is for.

- `has_more: boolean`

- `object: "list"`

  - `"list"`

- `first_id: optional string or null`

- `last_id: optional string or null`

### Example

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/$FINE_TUNED_MODEL_CHECKPOINT/permissions \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "project_ids": [
            "string"
          ]
        }'
```

#### Response

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "object": "checkpoint.permission",
      "project_id": "project_id"
    }
  ],
  "has_more": true,
  "object": "list",
  "first_id": "first_id",
  "last_id": "last_id"
}
```

### Example

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd/permissions \
  -H "Authorization: Bearer $OPENAI_API_KEY"
  -d '{"project_ids": ["proj_abGMw1llN8IrBb6SvvY5A1iH"]}'
```

#### Response

```json
{
  "object": "list",
  "data": [
    {
      "object": "checkpoint.permission",
      "id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
      "created_at": 1721764867,
      "project_id": "proj_abGMw1llN8IrBb6SvvY5A1iH"
    }
  ],
  "first_id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
  "last_id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
  "has_more": false
}
```

## Delete checkpoint permission

**delete** `/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions/{permission_id}`

**NOTE:** This endpoint requires an [admin API key](../admin-api-keys).

Organization owners can use this endpoint to delete a permission for a fine-tuned model checkpoint.

### Path Parameters

- `fine_tuned_model_checkpoint: string`

- `permission_id: string`

### Returns

- `id: string`

  The ID of the fine-tuned model checkpoint permission that was deleted.

- `deleted: boolean`

  Whether the fine-tuned model checkpoint permission was successfully deleted.

- `object: "checkpoint.permission"`

  The object type, which is always "checkpoint.permission".

  - `"checkpoint.permission"`

### Example

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/$FINE_TUNED_MODEL_CHECKPOINT/permissions/$PERMISSION_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "deleted": true,
  "object": "checkpoint.permission"
}
```

### Example

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd/permissions/cp_zc4Q7MP6XxulcVzj4MZdwsAB \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "object": "checkpoint.permission",
  "id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
  "deleted": true
}
```

## List checkpoint permissions

**get** `/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions`

**NOTE:** This endpoint requires an [admin API key](../admin-api-keys).

Organization owners can use this endpoint to view all permissions for a fine-tuned model checkpoint.

### Path Parameters

- `fine_tuned_model_checkpoint: string`

### Query Parameters

- `after: optional string`

  Identifier for the last permission ID from the previous pagination request.

- `limit: optional number`

  Number of permissions to retrieve.

- `order: optional "ascending" or "descending"`

  The order in which to retrieve permissions.

  - `"ascending"`

  - `"descending"`

- `project_id: optional string`

  The ID of the project to get permissions for.

### Returns

- `data: array of object { id, created_at, object, project_id }`

  - `id: string`

    The permission identifier, which can be referenced in the API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the permission was created.

  - `object: "checkpoint.permission"`

    The object type, which is always "checkpoint.permission".

    - `"checkpoint.permission"`

  - `project_id: string`

    The project identifier that the permission is for.

- `has_more: boolean`

- `object: "list"`

  - `"list"`

- `first_id: optional string or null`

- `last_id: optional string or null`

### Example

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/$FINE_TUNED_MODEL_CHECKPOINT/permissions \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "object": "checkpoint.permission",
      "project_id": "project_id"
    }
  ],
  "has_more": true,
  "object": "list",
  "first_id": "first_id",
  "last_id": "last_id"
}
```

### Example

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd/permissions \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "object": "list",
  "data": [
    {
      "object": "checkpoint.permission",
      "id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
      "created_at": 1721764867,
      "project_id": "proj_abGMw1llN8IrBb6SvvY5A1iH"
    },
    {
      "object": "checkpoint.permission",
      "id": "cp_enQCFmOTGj3syEpYVhBRLTSy",
      "created_at": 1721764800,
      "project_id": "proj_iqGMw1llN8IrBb6SvvY5A1oF"
    },
  ],
  "first_id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
  "last_id": "cp_enQCFmOTGj3syEpYVhBRLTSy",
  "has_more": false
}
```

## List checkpoint permissions

**get** `/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions`

**NOTE:** This endpoint requires an [admin API key](../admin-api-keys).

Organization owners can use this endpoint to view all permissions for a fine-tuned model checkpoint.

### Path Parameters

- `fine_tuned_model_checkpoint: string`

### Query Parameters

- `after: optional string`

  Identifier for the last permission ID from the previous pagination request.

- `limit: optional number`

  Number of permissions to retrieve.

- `order: optional "ascending" or "descending"`

  The order in which to retrieve permissions.

  - `"ascending"`

  - `"descending"`

- `project_id: optional string`

  The ID of the project to get permissions for.

### Returns

- `data: array of object { id, created_at, object, project_id }`

  - `id: string`

    The permission identifier, which can be referenced in the API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the permission was created.

  - `object: "checkpoint.permission"`

    The object type, which is always "checkpoint.permission".

    - `"checkpoint.permission"`

  - `project_id: string`

    The project identifier that the permission is for.

- `has_more: boolean`

- `object: "list"`

  - `"list"`

- `first_id: optional string or null`

- `last_id: optional string or null`

### Example

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/$FINE_TUNED_MODEL_CHECKPOINT/permissions \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "object": "checkpoint.permission",
      "project_id": "project_id"
    }
  ],
  "has_more": true,
  "object": "list",
  "first_id": "first_id",
  "last_id": "last_id"
}
```

### Example

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd/permissions \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "object": "list",
  "data": [
    {
      "object": "checkpoint.permission",
      "id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
      "created_at": 1721764867,
      "project_id": "proj_abGMw1llN8IrBb6SvvY5A1iH"
    },
    {
      "object": "checkpoint.permission",
      "id": "cp_enQCFmOTGj3syEpYVhBRLTSy",
      "created_at": 1721764800,
      "project_id": "proj_iqGMw1llN8IrBb6SvvY5A1oF"
    },
  ],
  "first_id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
  "last_id": "cp_enQCFmOTGj3syEpYVhBRLTSy",
  "has_more": false
}
```

## Domain Types

### Permission Create Response

- `PermissionCreateResponse object { id, created_at, object, project_id }`

  The `checkpoint.permission` object represents a permission for a fine-tuned model checkpoint.

  - `id: string`

    The permission identifier, which can be referenced in the API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the permission was created.

  - `object: "checkpoint.permission"`

    The object type, which is always "checkpoint.permission".

    - `"checkpoint.permission"`

  - `project_id: string`

    The project identifier that the permission is for.

### Permission Delete Response

- `PermissionDeleteResponse object { id, deleted, object }`

  - `id: string`

    The ID of the fine-tuned model checkpoint permission that was deleted.

  - `deleted: boolean`

    Whether the fine-tuned model checkpoint permission was successfully deleted.

  - `object: "checkpoint.permission"`

    The object type, which is always "checkpoint.permission".

    - `"checkpoint.permission"`

### Permission List Response

- `PermissionListResponse object { id, created_at, object, project_id }`

  The `checkpoint.permission` object represents a permission for a fine-tuned model checkpoint.

  - `id: string`

    The permission identifier, which can be referenced in the API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the permission was created.

  - `object: "checkpoint.permission"`

    The object type, which is always "checkpoint.permission".

    - `"checkpoint.permission"`

  - `project_id: string`

    The project identifier that the permission is for.

### Permission Retrieve Response

- `PermissionRetrieveResponse object { data, has_more, object, 2 more }`

  - `data: array of object { id, created_at, object, project_id }`

    - `id: string`

      The permission identifier, which can be referenced in the API endpoints.

    - `created_at: number`

      The Unix timestamp (in seconds) for when the permission was created.

    - `object: "checkpoint.permission"`

      The object type, which is always "checkpoint.permission".

      - `"checkpoint.permission"`

    - `project_id: string`

      The project identifier that the permission is for.

  - `has_more: boolean`

  - `object: "list"`

    - `"list"`

  - `first_id: optional string or null`

  - `last_id: optional string or null`

# Jobs

## Cancel fine-tuning

**post** `/fine_tuning/jobs/{fine_tuning_job_id}/cancel`

Immediately cancel a fine-tune job.

### Path Parameters

- `fine_tuning_job_id: string`

### Returns

- `FineTuningJob object { id, created_at, error, 16 more }`

  The `fine_tuning.job` object represents a fine-tuning job that has been created through the API.

  - `id: string`

    The object identifier, which can be referenced in the API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the fine-tuning job was created.

  - `error: object { code, message, param }  or null`

    For fine-tuning jobs that have `failed`, this will contain more information on the cause of the failure.

    - `code: string`

      A machine-readable error code.

    - `message: string`

      A human-readable error message.

    - `param: string or null`

      The parameter that was invalid, usually `training_file` or `validation_file`. This field will be null if the failure was not parameter-specific.

  - `fine_tuned_model: string or null`

    The name of the fine-tuned model that is being created. The value will be null if the fine-tuning job is still running.

  - `finished_at: number or null`

    The Unix timestamp (in seconds) for when the fine-tuning job was finished. The value will be null if the fine-tuning job is still running.

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    The hyperparameters used for the fine-tuning job. This value will only be returned when running `supervised` jobs.

    - `batch_size: optional "auto" or number or null`

      Number of examples in each batch. A larger batch size means that model parameters
      are updated less frequently, but with lower variance.

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      Scaling factor for the learning rate. A smaller learning rate may be useful to avoid
      overfitting.

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      The number of epochs to train the model for. An epoch refers to one full cycle
      through the training dataset.

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    The base model that is being fine-tuned.

  - `object: "fine_tuning.job"`

    The object type, which is always "fine_tuning.job".

    - `"fine_tuning.job"`

  - `organization_id: string`

    The organization that owns the fine-tuning job.

  - `result_files: array of string`

    The compiled results file ID(s) for the fine-tuning job. You can retrieve the results with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `seed: number`

    The seed used for the fine-tuning job.

  - `status: "validating_files" or "queued" or "running" or 3 more`

    The current status of the fine-tuning job, which can be either `validating_files`, `queued`, `running`, `succeeded`, `failed`, or `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    The total number of billable tokens processed by this fine-tuning job. The value will be null if the fine-tuning job is still running.

  - `training_file: string`

    The file ID used for training. You can retrieve the training data with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `validation_file: string or null`

    The file ID used for validation. You can retrieve the validation results with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `estimated_finish: optional number or null`

    The Unix timestamp (in seconds) for when the fine-tuning job is estimated to finish. The value will be null if the fine-tuning job is not running.

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    A list of integrations to enable for this fine-tuning job.

    - `type: "wandb"`

      The type of the integration being enabled for the fine-tuning job

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      The settings for your integration with Weights and Biases. This payload specifies the project that
      metrics will be sent to. Optionally, you can set an explicit display name for your run, add tags
      to your run, and set a default entity (team, username, etc) to be associated with your run.

      - `project: string`

        The name of the project that the new run will be created under.

      - `entity: optional string or null`

        The entity to use for the run. This allows you to set the team or username of the WandB user that you would
        like associated with the run. If not set, the default entity for the registered WandB API key is used.

      - `name: optional string or null`

        A display name to set for the run. If not set, we will use the Job ID as the name.

      - `tags: optional array of string`

        A list of tags to be attached to the newly created run. These tags are passed through directly to WandB. Some
        default tags are generated by OpenAI: "openai/finetune", "openai/{base-model}", "openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `method: optional object { type, dpo, reinforcement, supervised }`

    The method used for fine-tuning.

    - `type: "supervised" or "dpo" or "reinforcement"`

      The type of method. Is either `supervised`, `dpo`, or `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      Configuration for the DPO fine-tuning method.

      - `hyperparameters: optional DpoHyperparameters`

        The hyperparameters used for the DPO fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          The beta value for the DPO method. A higher beta value will increase the weight of the penalty between the policy and reference model.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      Configuration for the reinforcement fine-tuning method.

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        The grader used for the fine-tuning job.

        - `StringCheckGrader object { input, name, operation, 2 more }`

          A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

          - `input: string`

            The input text. This may include template strings.

          - `name: string`

            The name of the grader.

          - `operation: "eq" or "ne" or "like" or "ilike"`

            The string check operation to perform. One of `eq`, `ne`, `like`, or `ilike`.

            - `"eq"`

            - `"ne"`

            - `"like"`

            - `"ilike"`

          - `reference: string`

            The reference text. This may include template strings.

          - `type: "string_check"`

            The object type, which is always `string_check`.

            - `"string_check"`

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          A TextSimilarityGrader object which grades text based on similarity metrics.

          - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

            The evaluation metric to use. One of `cosine`, `fuzzy_match`, `bleu`,
            `gleu`, `meteor`, `rouge_1`, `rouge_2`, `rouge_3`, `rouge_4`, `rouge_5`,
            or `rouge_l`.

            - `"cosine"`

            - `"fuzzy_match"`

            - `"bleu"`

            - `"gleu"`

            - `"meteor"`

            - `"rouge_1"`

            - `"rouge_2"`

            - `"rouge_3"`

            - `"rouge_4"`

            - `"rouge_5"`

            - `"rouge_l"`

          - `input: string`

            The text being graded.

          - `name: string`

            The name of the grader.

          - `reference: string`

            The text being graded against.

          - `type: "text_similarity"`

            The type of grader.

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          A PythonGrader object that runs a python script on the input.

          - `name: string`

            The name of the grader.

          - `source: string`

            The source code of the python script.

          - `type: "python"`

            The object type, which is always `python`.

            - `"python"`

          - `image_tag: optional string`

            The image tag to use for the python script.

        - `ScoreModelGrader object { input, model, name, 3 more }`

          A ScoreModelGrader object that uses a model to assign a score to the input.

          - `input: array of object { content, role, type }`

            The input messages evaluated by the grader. Supports text, output text, input image, and input audio content blocks, and may include template strings.

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

              - `TextInput = string`

                A text input to the model.

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                A text input to the model.

                - `text: string`

                  The text input to the model.

                - `type: "input_text"`

                  The type of the input item. Always `input_text`.

                  - `"input_text"`

                - `prompt_cache_breakpoint: optional object { mode }`

                  Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

                  - `mode: "explicit"`

                    The breakpoint mode. Always `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                A text output from the model.

                - `text: string`

                  The text output from the model.

                - `type: "output_text"`

                  The type of the output text. Always `output_text`.

                  - `"output_text"`

              - `InputImage object { image_url, type, detail }`

                An image input block used within EvalItem content arrays.

                - `image_url: string`

                  The URL of the image input.

                - `type: "input_image"`

                  The type of the image input. Always `input_image`.

                  - `"input_image"`

                - `detail: optional string`

                  The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                An audio input to the model.

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64-encoded audio data.

                  - `format: "mp3" or "wav"`

                    The format of the audio data. Currently supported formats are `mp3` and
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  The type of the input item. Always `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                A list of inputs, each of which may be either an input text, output text, input
                image, or input audio object.

                - `TextInput = string`

                  A text input to the model.

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  A text input to the model.

                - `OutputText object { text, type }`

                  A text output from the model.

                  - `text: string`

                    The text output from the model.

                  - `type: "output_text"`

                    The type of the output text. Always `output_text`.

                    - `"output_text"`

                - `InputImage object { image_url, type, detail }`

                  An image input block used within EvalItem content arrays.

                  - `image_url: string`

                    The URL of the image input.

                  - `type: "input_image"`

                    The type of the image input. Always `input_image`.

                    - `"input_image"`

                  - `detail: optional string`

                    The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  An audio input to the model.

            - `role: "user" or "assistant" or "system" or "developer"`

              The role of the message input. One of `user`, `assistant`, `system`, or
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              The type of the message input. Always `message`.

              - `"message"`

          - `model: string`

            The model to use for the evaluation.

          - `name: string`

            The name of the grader.

          - `type: "score_model"`

            The object type, which is always `score_model`.

            - `"score_model"`

          - `range: optional array of number`

            The range of the score. Defaults to `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            The sampling parameters for the model.

            - `max_completions_tokens: optional number or null`

              The maximum number of tokens the grader model may generate in its response.

            - `reasoning_effort: optional ReasoningEffort or null`

              Constrains effort on reasoning for reasoning models. Currently supported
              values are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`.
              Reducing reasoning effort can result in faster responses and fewer tokens
              used on reasoning in a response. Not all reasoning models support every
              value. See the
              [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
              for model-specific support.

              - `"none"`

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

            - `seed: optional number or null`

              A seed value to initialize the randomness, during sampling.

            - `temperature: optional number or null`

              A higher temperature increases randomness in the outputs.

            - `top_p: optional number or null`

              An alternative to temperature for nucleus sampling; 1.0 includes all tokens.

        - `MultiGrader object { calculate_output, graders, name, type }`

          A MultiGrader object combines the output of multiple graders to produce a single score.

          - `calculate_output: string`

            A formula to calculate the output based on grader results.

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

            - `StringCheckGrader object { input, name, operation, 2 more }`

              A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              A TextSimilarityGrader object which grades text based on similarity metrics.

            - `PythonGrader object { name, source, type, image_tag }`

              A PythonGrader object that runs a python script on the input.

            - `ScoreModelGrader object { input, model, name, 3 more }`

              A ScoreModelGrader object that uses a model to assign a score to the input.

            - `LabelModelGrader object { input, labels, model, 3 more }`

              A LabelModelGrader object which uses a model to assign labels to each item
              in the evaluation.

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

                  - `TextInput = string`

                    A text input to the model.

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    A text input to the model.

                  - `OutputText object { text, type }`

                    A text output from the model.

                    - `text: string`

                      The text output from the model.

                    - `type: "output_text"`

                      The type of the output text. Always `output_text`.

                      - `"output_text"`

                  - `InputImage object { image_url, type, detail }`

                    An image input block used within EvalItem content arrays.

                    - `image_url: string`

                      The URL of the image input.

                    - `type: "input_image"`

                      The type of the image input. Always `input_image`.

                      - `"input_image"`

                    - `detail: optional string`

                      The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    An audio input to the model.

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    A list of inputs, each of which may be either an input text, output text, input
                    image, or input audio object.

                - `role: "user" or "assistant" or "system" or "developer"`

                  The role of the message input. One of `user`, `assistant`, `system`, or
                  `developer`.

                  - `"user"`

                  - `"assistant"`

                  - `"system"`

                  - `"developer"`

                - `type: optional "message"`

                  The type of the message input. Always `message`.

                  - `"message"`

              - `labels: array of string`

                The labels to assign to each item in the evaluation.

              - `model: string`

                The model to use for the evaluation. Must support structured outputs.

              - `name: string`

                The name of the grader.

              - `passing_labels: array of string`

                The labels that indicate a passing result. Must be a subset of labels.

              - `type: "label_model"`

                The object type, which is always `label_model`.

                - `"label_model"`

          - `name: string`

            The name of the grader.

          - `type: "multi"`

            The object type, which is always `multi`.

            - `"multi"`

      - `hyperparameters: optional ReinforcementHyperparameters`

        The hyperparameters used for the reinforcement fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          Multiplier on amount of compute used for exploring search space during training.

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          The number of training steps between evaluation runs.

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_samples: optional "auto" or number`

          Number of evaluation samples to generate per training step.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

        - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

          Level of reasoning effort.

          - `"default"`

          - `"low"`

          - `"medium"`

          - `"high"`

    - `supervised: optional SupervisedMethod`

      Configuration for the supervised fine-tuning method.

      - `hyperparameters: optional SupervisedHyperparameters`

        The hyperparameters used for the fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

### Example

```http
curl https://api.openai.com/v1/fine_tuning/jobs/$FINE_TUNING_JOB_ID/cancel \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "error": {
    "code": "code",
    "message": "message",
    "param": "param"
  },
  "fine_tuned_model": "fine_tuned_model",
  "finished_at": 0,
  "hyperparameters": {
    "batch_size": "auto",
    "learning_rate_multiplier": "auto",
    "n_epochs": "auto"
  },
  "model": "model",
  "object": "fine_tuning.job",
  "organization_id": "organization_id",
  "result_files": [
    "file-abc123"
  ],
  "seed": 0,
  "status": "validating_files",
  "trained_tokens": 0,
  "training_file": "training_file",
  "validation_file": "validation_file",
  "estimated_finish": 0,
  "integrations": [
    {
      "type": "wandb",
      "wandb": {
        "project": "my-wandb-project",
        "entity": "entity",
        "name": "name",
        "tags": [
          "custom-tag"
        ]
      }
    }
  ],
  "metadata": {
    "foo": "string"
  },
  "method": {
    "type": "supervised",
    "dpo": {
      "hyperparameters": {
        "batch_size": "auto",
        "beta": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    },
    "reinforcement": {
      "grader": {
        "input": "input",
        "name": "name",
        "operation": "eq",
        "reference": "reference",
        "type": "string_check"
      },
      "hyperparameters": {
        "batch_size": "auto",
        "compute_multiplier": "auto",
        "eval_interval": "auto",
        "eval_samples": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
        "reasoning_effort": "default"
      }
    },
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    }
  }
}
```

### Example

```http
curl -X POST https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "cancelled",
  "validation_file": "file-abc123",
  "training_file": "file-abc123"
}
```

## Create fine-tuning job

**post** `/fine_tuning/jobs`

Creates a fine-tuning job which begins the process of creating a new model from a given dataset.

Response includes details of the enqueued job including job status and the name of the fine-tuned models once complete.

[Learn more about fine-tuning](/docs/guides/model-optimization)

### Body Parameters

- `model: string or "babbage-002" or "davinci-002" or "gpt-3.5-turbo" or "gpt-4o-mini"`

  The name of the model to fine-tune. You can select one of the
  [supported models](/docs/guides/fine-tuning#which-models-can-be-fine-tuned).

  - `string`

  - `"babbage-002" or "davinci-002" or "gpt-3.5-turbo" or "gpt-4o-mini"`

    The name of the model to fine-tune. You can select one of the
    [supported models](/docs/guides/fine-tuning#which-models-can-be-fine-tuned).

    - `"babbage-002"`

    - `"davinci-002"`

    - `"gpt-3.5-turbo"`

    - `"gpt-4o-mini"`

- `training_file: string`

  The ID of an uploaded file that contains training data.

  See [upload file](/docs/api-reference/files/create) for how to upload a file.

  Your dataset must be formatted as a JSONL file. Additionally, you must upload your file with the purpose `fine-tune`.

  The contents of the file should differ depending on if the model uses the [chat](/docs/api-reference/fine-tuning/chat-input), [completions](/docs/api-reference/fine-tuning/completions-input) format, or if the fine-tuning method uses the [preference](/docs/api-reference/fine-tuning/preference-input) format.

  See the [fine-tuning guide](/docs/guides/model-optimization) for more details.

- `hyperparameters: optional object { batch_size, learning_rate_multiplier, n_epochs }`

  The hyperparameters used for the fine-tuning job.
  This value is now deprecated in favor of `method`, and should be passed in under the `method` parameter.

  - `batch_size: optional "auto" or number`

    Number of examples in each batch. A larger batch size means that model parameters
    are updated less frequently, but with lower variance.

    - `"auto"`

      - `"auto"`

    - `number`

  - `learning_rate_multiplier: optional "auto" or number`

    Scaling factor for the learning rate. A smaller learning rate may be useful to avoid
    overfitting.

    - `"auto"`

      - `"auto"`

    - `number`

  - `n_epochs: optional "auto" or number`

    The number of epochs to train the model for. An epoch refers to one full cycle
    through the training dataset.

    - `"auto"`

      - `"auto"`

    - `number`

- `integrations: optional array of object { type, wandb }  or null`

  A list of integrations to enable for your fine-tuning job.

  - `type: "wandb"`

    The type of integration to enable. Currently, only "wandb" (Weights and Biases) is supported.

    - `"wandb"`

  - `wandb: object { project, entity, name, tags }`

    The settings for your integration with Weights and Biases. This payload specifies the project that
    metrics will be sent to. Optionally, you can set an explicit display name for your run, add tags
    to your run, and set a default entity (team, username, etc) to be associated with your run.

    - `project: string`

      The name of the project that the new run will be created under.

    - `entity: optional string or null`

      The entity to use for the run. This allows you to set the team or username of the WandB user that you would
      like associated with the run. If not set, the default entity for the registered WandB API key is used.

    - `name: optional string or null`

      A display name to set for the run. If not set, we will use the Job ID as the name.

    - `tags: optional array of string`

      A list of tags to be attached to the newly created run. These tags are passed through directly to WandB. Some
      default tags are generated by OpenAI: "openai/finetune", "openai/{base-model}", "openai/{ftjob-abcdef}".

- `metadata: optional Metadata or null`

  Set of 16 key-value pairs that can be attached to an object. This can be
  useful for storing additional information about the object in a structured
  format, and querying for objects via API or the dashboard.

  Keys are strings with a maximum length of 64 characters. Values are strings
  with a maximum length of 512 characters.

- `method: optional object { type, dpo, reinforcement, supervised }`

  The method used for fine-tuning.

  - `type: "supervised" or "dpo" or "reinforcement"`

    The type of method. Is either `supervised`, `dpo`, or `reinforcement`.

    - `"supervised"`

    - `"dpo"`

    - `"reinforcement"`

  - `dpo: optional DpoMethod`

    Configuration for the DPO fine-tuning method.

    - `hyperparameters: optional DpoHyperparameters`

      The hyperparameters used for the DPO fine-tuning job.

      - `batch_size: optional "auto" or number`

        Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

        - `"auto"`

          - `"auto"`

        - `number`

      - `beta: optional "auto" or number`

        The beta value for the DPO method. A higher beta value will increase the weight of the penalty between the policy and reference model.

        - `"auto"`

          - `"auto"`

        - `number`

      - `learning_rate_multiplier: optional "auto" or number`

        Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

        - `"auto"`

          - `"auto"`

        - `number`

      - `n_epochs: optional "auto" or number`

        The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

        - `"auto"`

          - `"auto"`

        - `number`

  - `reinforcement: optional ReinforcementMethod`

    Configuration for the reinforcement fine-tuning method.

    - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

      The grader used for the fine-tuning job.

      - `StringCheckGrader object { input, name, operation, 2 more }`

        A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

        - `input: string`

          The input text. This may include template strings.

        - `name: string`

          The name of the grader.

        - `operation: "eq" or "ne" or "like" or "ilike"`

          The string check operation to perform. One of `eq`, `ne`, `like`, or `ilike`.

          - `"eq"`

          - `"ne"`

          - `"like"`

          - `"ilike"`

        - `reference: string`

          The reference text. This may include template strings.

        - `type: "string_check"`

          The object type, which is always `string_check`.

          - `"string_check"`

      - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

        A TextSimilarityGrader object which grades text based on similarity metrics.

        - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

          The evaluation metric to use. One of `cosine`, `fuzzy_match`, `bleu`,
          `gleu`, `meteor`, `rouge_1`, `rouge_2`, `rouge_3`, `rouge_4`, `rouge_5`,
          or `rouge_l`.

          - `"cosine"`

          - `"fuzzy_match"`

          - `"bleu"`

          - `"gleu"`

          - `"meteor"`

          - `"rouge_1"`

          - `"rouge_2"`

          - `"rouge_3"`

          - `"rouge_4"`

          - `"rouge_5"`

          - `"rouge_l"`

        - `input: string`

          The text being graded.

        - `name: string`

          The name of the grader.

        - `reference: string`

          The text being graded against.

        - `type: "text_similarity"`

          The type of grader.

          - `"text_similarity"`

      - `PythonGrader object { name, source, type, image_tag }`

        A PythonGrader object that runs a python script on the input.

        - `name: string`

          The name of the grader.

        - `source: string`

          The source code of the python script.

        - `type: "python"`

          The object type, which is always `python`.

          - `"python"`

        - `image_tag: optional string`

          The image tag to use for the python script.

      - `ScoreModelGrader object { input, model, name, 3 more }`

        A ScoreModelGrader object that uses a model to assign a score to the input.

        - `input: array of object { content, role, type }`

          The input messages evaluated by the grader. Supports text, output text, input image, and input audio content blocks, and may include template strings.

          - `content: string or ResponseInputText or object { text, type }  or 3 more`

            Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

            - `TextInput = string`

              A text input to the model.

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              A text input to the model.

              - `text: string`

                The text input to the model.

              - `type: "input_text"`

                The type of the input item. Always `input_text`.

                - `"input_text"`

              - `prompt_cache_breakpoint: optional object { mode }`

                Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

                - `mode: "explicit"`

                  The breakpoint mode. Always `explicit`.

                  - `"explicit"`

            - `OutputText object { text, type }`

              A text output from the model.

              - `text: string`

                The text output from the model.

              - `type: "output_text"`

                The type of the output text. Always `output_text`.

                - `"output_text"`

            - `InputImage object { image_url, type, detail }`

              An image input block used within EvalItem content arrays.

              - `image_url: string`

                The URL of the image input.

              - `type: "input_image"`

                The type of the image input. Always `input_image`.

                - `"input_image"`

              - `detail: optional string`

                The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              An audio input to the model.

              - `input_audio: object { data, format }`

                - `data: string`

                  Base64-encoded audio data.

                - `format: "mp3" or "wav"`

                  The format of the audio data. Currently supported formats are `mp3` and
                  `wav`.

                  - `"mp3"`

                  - `"wav"`

              - `type: "input_audio"`

                The type of the input item. Always `input_audio`.

                - `"input_audio"`

            - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

              A list of inputs, each of which may be either an input text, output text, input
              image, or input audio object.

              - `TextInput = string`

                A text input to the model.

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                A text input to the model.

              - `OutputText object { text, type }`

                A text output from the model.

                - `text: string`

                  The text output from the model.

                - `type: "output_text"`

                  The type of the output text. Always `output_text`.

                  - `"output_text"`

              - `InputImage object { image_url, type, detail }`

                An image input block used within EvalItem content arrays.

                - `image_url: string`

                  The URL of the image input.

                - `type: "input_image"`

                  The type of the image input. Always `input_image`.

                  - `"input_image"`

                - `detail: optional string`

                  The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                An audio input to the model.

          - `role: "user" or "assistant" or "system" or "developer"`

            The role of the message input. One of `user`, `assistant`, `system`, or
            `developer`.

            - `"user"`

            - `"assistant"`

            - `"system"`

            - `"developer"`

          - `type: optional "message"`

            The type of the message input. Always `message`.

            - `"message"`

        - `model: string`

          The model to use for the evaluation.

        - `name: string`

          The name of the grader.

        - `type: "score_model"`

          The object type, which is always `score_model`.

          - `"score_model"`

        - `range: optional array of number`

          The range of the score. Defaults to `[0, 1]`.

        - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

          The sampling parameters for the model.

          - `max_completions_tokens: optional number or null`

            The maximum number of tokens the grader model may generate in its response.

          - `reasoning_effort: optional ReasoningEffort or null`

            Constrains effort on reasoning for reasoning models. Currently supported
            values are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`.
            Reducing reasoning effort can result in faster responses and fewer tokens
            used on reasoning in a response. Not all reasoning models support every
            value. See the
            [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
            for model-specific support.

            - `"none"`

            - `"minimal"`

            - `"low"`

            - `"medium"`

            - `"high"`

            - `"xhigh"`

            - `"max"`

          - `seed: optional number or null`

            A seed value to initialize the randomness, during sampling.

          - `temperature: optional number or null`

            A higher temperature increases randomness in the outputs.

          - `top_p: optional number or null`

            An alternative to temperature for nucleus sampling; 1.0 includes all tokens.

      - `MultiGrader object { calculate_output, graders, name, type }`

        A MultiGrader object combines the output of multiple graders to produce a single score.

        - `calculate_output: string`

          A formula to calculate the output based on grader results.

        - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

          A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

          - `StringCheckGrader object { input, name, operation, 2 more }`

            A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

          - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

            A TextSimilarityGrader object which grades text based on similarity metrics.

          - `PythonGrader object { name, source, type, image_tag }`

            A PythonGrader object that runs a python script on the input.

          - `ScoreModelGrader object { input, model, name, 3 more }`

            A ScoreModelGrader object that uses a model to assign a score to the input.

          - `LabelModelGrader object { input, labels, model, 3 more }`

            A LabelModelGrader object which uses a model to assign labels to each item
            in the evaluation.

            - `input: array of object { content, role, type }`

              - `content: string or ResponseInputText or object { text, type }  or 3 more`

                Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

                - `TextInput = string`

                  A text input to the model.

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  A text input to the model.

                - `OutputText object { text, type }`

                  A text output from the model.

                  - `text: string`

                    The text output from the model.

                  - `type: "output_text"`

                    The type of the output text. Always `output_text`.

                    - `"output_text"`

                - `InputImage object { image_url, type, detail }`

                  An image input block used within EvalItem content arrays.

                  - `image_url: string`

                    The URL of the image input.

                  - `type: "input_image"`

                    The type of the image input. Always `input_image`.

                    - `"input_image"`

                  - `detail: optional string`

                    The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  An audio input to the model.

                - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                  A list of inputs, each of which may be either an input text, output text, input
                  image, or input audio object.

              - `role: "user" or "assistant" or "system" or "developer"`

                The role of the message input. One of `user`, `assistant`, `system`, or
                `developer`.

                - `"user"`

                - `"assistant"`

                - `"system"`

                - `"developer"`

              - `type: optional "message"`

                The type of the message input. Always `message`.

                - `"message"`

            - `labels: array of string`

              The labels to assign to each item in the evaluation.

            - `model: string`

              The model to use for the evaluation. Must support structured outputs.

            - `name: string`

              The name of the grader.

            - `passing_labels: array of string`

              The labels that indicate a passing result. Must be a subset of labels.

            - `type: "label_model"`

              The object type, which is always `label_model`.

              - `"label_model"`

        - `name: string`

          The name of the grader.

        - `type: "multi"`

          The object type, which is always `multi`.

          - `"multi"`

    - `hyperparameters: optional ReinforcementHyperparameters`

      The hyperparameters used for the reinforcement fine-tuning job.

      - `batch_size: optional "auto" or number`

        Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

        - `"auto"`

          - `"auto"`

        - `number`

      - `compute_multiplier: optional "auto" or number`

        Multiplier on amount of compute used for exploring search space during training.

        - `"auto"`

          - `"auto"`

        - `number`

      - `eval_interval: optional "auto" or number`

        The number of training steps between evaluation runs.

        - `"auto"`

          - `"auto"`

        - `number`

      - `eval_samples: optional "auto" or number`

        Number of evaluation samples to generate per training step.

        - `"auto"`

          - `"auto"`

        - `number`

      - `learning_rate_multiplier: optional "auto" or number`

        Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

        - `"auto"`

          - `"auto"`

        - `number`

      - `n_epochs: optional "auto" or number`

        The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

        - `"auto"`

          - `"auto"`

        - `number`

      - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

        Level of reasoning effort.

        - `"default"`

        - `"low"`

        - `"medium"`

        - `"high"`

  - `supervised: optional SupervisedMethod`

    Configuration for the supervised fine-tuning method.

    - `hyperparameters: optional SupervisedHyperparameters`

      The hyperparameters used for the fine-tuning job.

      - `batch_size: optional "auto" or number`

        Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

        - `"auto"`

          - `"auto"`

        - `number`

      - `learning_rate_multiplier: optional "auto" or number`

        Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

        - `"auto"`

          - `"auto"`

        - `number`

      - `n_epochs: optional "auto" or number`

        The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

        - `"auto"`

          - `"auto"`

        - `number`

- `seed: optional number or null`

  The seed controls the reproducibility of the job. Passing in the same seed and job parameters should produce the same results, but may differ in rare cases.
  If a seed is not specified, one will be generated for you.

- `suffix: optional string or null`

  A string of up to 64 characters that will be added to your fine-tuned model name.

  For example, a `suffix` of "custom-model-name" would produce a model name like `ft:gpt-4o-mini:openai:custom-model-name:7p4lURel`.

- `validation_file: optional string or null`

  The ID of an uploaded file that contains validation data.

  If you provide this file, the data is used to generate validation
  metrics periodically during fine-tuning. These metrics can be viewed in
  the fine-tuning results file.
  The same data should not be present in both train and validation files.

  Your dataset must be formatted as a JSONL file. You must upload your file with the purpose `fine-tune`.

  See the [fine-tuning guide](/docs/guides/model-optimization) for more details.

### Returns

- `FineTuningJob object { id, created_at, error, 16 more }`

  The `fine_tuning.job` object represents a fine-tuning job that has been created through the API.

  - `id: string`

    The object identifier, which can be referenced in the API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the fine-tuning job was created.

  - `error: object { code, message, param }  or null`

    For fine-tuning jobs that have `failed`, this will contain more information on the cause of the failure.

    - `code: string`

      A machine-readable error code.

    - `message: string`

      A human-readable error message.

    - `param: string or null`

      The parameter that was invalid, usually `training_file` or `validation_file`. This field will be null if the failure was not parameter-specific.

  - `fine_tuned_model: string or null`

    The name of the fine-tuned model that is being created. The value will be null if the fine-tuning job is still running.

  - `finished_at: number or null`

    The Unix timestamp (in seconds) for when the fine-tuning job was finished. The value will be null if the fine-tuning job is still running.

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    The hyperparameters used for the fine-tuning job. This value will only be returned when running `supervised` jobs.

    - `batch_size: optional "auto" or number or null`

      Number of examples in each batch. A larger batch size means that model parameters
      are updated less frequently, but with lower variance.

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      Scaling factor for the learning rate. A smaller learning rate may be useful to avoid
      overfitting.

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      The number of epochs to train the model for. An epoch refers to one full cycle
      through the training dataset.

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    The base model that is being fine-tuned.

  - `object: "fine_tuning.job"`

    The object type, which is always "fine_tuning.job".

    - `"fine_tuning.job"`

  - `organization_id: string`

    The organization that owns the fine-tuning job.

  - `result_files: array of string`

    The compiled results file ID(s) for the fine-tuning job. You can retrieve the results with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `seed: number`

    The seed used for the fine-tuning job.

  - `status: "validating_files" or "queued" or "running" or 3 more`

    The current status of the fine-tuning job, which can be either `validating_files`, `queued`, `running`, `succeeded`, `failed`, or `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    The total number of billable tokens processed by this fine-tuning job. The value will be null if the fine-tuning job is still running.

  - `training_file: string`

    The file ID used for training. You can retrieve the training data with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `validation_file: string or null`

    The file ID used for validation. You can retrieve the validation results with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `estimated_finish: optional number or null`

    The Unix timestamp (in seconds) for when the fine-tuning job is estimated to finish. The value will be null if the fine-tuning job is not running.

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    A list of integrations to enable for this fine-tuning job.

    - `type: "wandb"`

      The type of the integration being enabled for the fine-tuning job

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      The settings for your integration with Weights and Biases. This payload specifies the project that
      metrics will be sent to. Optionally, you can set an explicit display name for your run, add tags
      to your run, and set a default entity (team, username, etc) to be associated with your run.

      - `project: string`

        The name of the project that the new run will be created under.

      - `entity: optional string or null`

        The entity to use for the run. This allows you to set the team or username of the WandB user that you would
        like associated with the run. If not set, the default entity for the registered WandB API key is used.

      - `name: optional string or null`

        A display name to set for the run. If not set, we will use the Job ID as the name.

      - `tags: optional array of string`

        A list of tags to be attached to the newly created run. These tags are passed through directly to WandB. Some
        default tags are generated by OpenAI: "openai/finetune", "openai/{base-model}", "openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `method: optional object { type, dpo, reinforcement, supervised }`

    The method used for fine-tuning.

    - `type: "supervised" or "dpo" or "reinforcement"`

      The type of method. Is either `supervised`, `dpo`, or `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      Configuration for the DPO fine-tuning method.

      - `hyperparameters: optional DpoHyperparameters`

        The hyperparameters used for the DPO fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          The beta value for the DPO method. A higher beta value will increase the weight of the penalty between the policy and reference model.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      Configuration for the reinforcement fine-tuning method.

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        The grader used for the fine-tuning job.

        - `StringCheckGrader object { input, name, operation, 2 more }`

          A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

          - `input: string`

            The input text. This may include template strings.

          - `name: string`

            The name of the grader.

          - `operation: "eq" or "ne" or "like" or "ilike"`

            The string check operation to perform. One of `eq`, `ne`, `like`, or `ilike`.

            - `"eq"`

            - `"ne"`

            - `"like"`

            - `"ilike"`

          - `reference: string`

            The reference text. This may include template strings.

          - `type: "string_check"`

            The object type, which is always `string_check`.

            - `"string_check"`

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          A TextSimilarityGrader object which grades text based on similarity metrics.

          - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

            The evaluation metric to use. One of `cosine`, `fuzzy_match`, `bleu`,
            `gleu`, `meteor`, `rouge_1`, `rouge_2`, `rouge_3`, `rouge_4`, `rouge_5`,
            or `rouge_l`.

            - `"cosine"`

            - `"fuzzy_match"`

            - `"bleu"`

            - `"gleu"`

            - `"meteor"`

            - `"rouge_1"`

            - `"rouge_2"`

            - `"rouge_3"`

            - `"rouge_4"`

            - `"rouge_5"`

            - `"rouge_l"`

          - `input: string`

            The text being graded.

          - `name: string`

            The name of the grader.

          - `reference: string`

            The text being graded against.

          - `type: "text_similarity"`

            The type of grader.

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          A PythonGrader object that runs a python script on the input.

          - `name: string`

            The name of the grader.

          - `source: string`

            The source code of the python script.

          - `type: "python"`

            The object type, which is always `python`.

            - `"python"`

          - `image_tag: optional string`

            The image tag to use for the python script.

        - `ScoreModelGrader object { input, model, name, 3 more }`

          A ScoreModelGrader object that uses a model to assign a score to the input.

          - `input: array of object { content, role, type }`

            The input messages evaluated by the grader. Supports text, output text, input image, and input audio content blocks, and may include template strings.

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

              - `TextInput = string`

                A text input to the model.

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                A text input to the model.

                - `text: string`

                  The text input to the model.

                - `type: "input_text"`

                  The type of the input item. Always `input_text`.

                  - `"input_text"`

                - `prompt_cache_breakpoint: optional object { mode }`

                  Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

                  - `mode: "explicit"`

                    The breakpoint mode. Always `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                A text output from the model.

                - `text: string`

                  The text output from the model.

                - `type: "output_text"`

                  The type of the output text. Always `output_text`.

                  - `"output_text"`

              - `InputImage object { image_url, type, detail }`

                An image input block used within EvalItem content arrays.

                - `image_url: string`

                  The URL of the image input.

                - `type: "input_image"`

                  The type of the image input. Always `input_image`.

                  - `"input_image"`

                - `detail: optional string`

                  The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                An audio input to the model.

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64-encoded audio data.

                  - `format: "mp3" or "wav"`

                    The format of the audio data. Currently supported formats are `mp3` and
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  The type of the input item. Always `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                A list of inputs, each of which may be either an input text, output text, input
                image, or input audio object.

                - `TextInput = string`

                  A text input to the model.

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  A text input to the model.

                - `OutputText object { text, type }`

                  A text output from the model.

                  - `text: string`

                    The text output from the model.

                  - `type: "output_text"`

                    The type of the output text. Always `output_text`.

                    - `"output_text"`

                - `InputImage object { image_url, type, detail }`

                  An image input block used within EvalItem content arrays.

                  - `image_url: string`

                    The URL of the image input.

                  - `type: "input_image"`

                    The type of the image input. Always `input_image`.

                    - `"input_image"`

                  - `detail: optional string`

                    The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  An audio input to the model.

            - `role: "user" or "assistant" or "system" or "developer"`

              The role of the message input. One of `user`, `assistant`, `system`, or
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              The type of the message input. Always `message`.

              - `"message"`

          - `model: string`

            The model to use for the evaluation.

          - `name: string`

            The name of the grader.

          - `type: "score_model"`

            The object type, which is always `score_model`.

            - `"score_model"`

          - `range: optional array of number`

            The range of the score. Defaults to `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            The sampling parameters for the model.

            - `max_completions_tokens: optional number or null`

              The maximum number of tokens the grader model may generate in its response.

            - `reasoning_effort: optional ReasoningEffort or null`

              Constrains effort on reasoning for reasoning models. Currently supported
              values are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`.
              Reducing reasoning effort can result in faster responses and fewer tokens
              used on reasoning in a response. Not all reasoning models support every
              value. See the
              [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
              for model-specific support.

              - `"none"`

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

            - `seed: optional number or null`

              A seed value to initialize the randomness, during sampling.

            - `temperature: optional number or null`

              A higher temperature increases randomness in the outputs.

            - `top_p: optional number or null`

              An alternative to temperature for nucleus sampling; 1.0 includes all tokens.

        - `MultiGrader object { calculate_output, graders, name, type }`

          A MultiGrader object combines the output of multiple graders to produce a single score.

          - `calculate_output: string`

            A formula to calculate the output based on grader results.

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

            - `StringCheckGrader object { input, name, operation, 2 more }`

              A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              A TextSimilarityGrader object which grades text based on similarity metrics.

            - `PythonGrader object { name, source, type, image_tag }`

              A PythonGrader object that runs a python script on the input.

            - `ScoreModelGrader object { input, model, name, 3 more }`

              A ScoreModelGrader object that uses a model to assign a score to the input.

            - `LabelModelGrader object { input, labels, model, 3 more }`

              A LabelModelGrader object which uses a model to assign labels to each item
              in the evaluation.

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

                  - `TextInput = string`

                    A text input to the model.

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    A text input to the model.

                  - `OutputText object { text, type }`

                    A text output from the model.

                    - `text: string`

                      The text output from the model.

                    - `type: "output_text"`

                      The type of the output text. Always `output_text`.

                      - `"output_text"`

                  - `InputImage object { image_url, type, detail }`

                    An image input block used within EvalItem content arrays.

                    - `image_url: string`

                      The URL of the image input.

                    - `type: "input_image"`

                      The type of the image input. Always `input_image`.

                      - `"input_image"`

                    - `detail: optional string`

                      The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    An audio input to the model.

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    A list of inputs, each of which may be either an input text, output text, input
                    image, or input audio object.

                - `role: "user" or "assistant" or "system" or "developer"`

                  The role of the message input. One of `user`, `assistant`, `system`, or
                  `developer`.

                  - `"user"`

                  - `"assistant"`

                  - `"system"`

                  - `"developer"`

                - `type: optional "message"`

                  The type of the message input. Always `message`.

                  - `"message"`

              - `labels: array of string`

                The labels to assign to each item in the evaluation.

              - `model: string`

                The model to use for the evaluation. Must support structured outputs.

              - `name: string`

                The name of the grader.

              - `passing_labels: array of string`

                The labels that indicate a passing result. Must be a subset of labels.

              - `type: "label_model"`

                The object type, which is always `label_model`.

                - `"label_model"`

          - `name: string`

            The name of the grader.

          - `type: "multi"`

            The object type, which is always `multi`.

            - `"multi"`

      - `hyperparameters: optional ReinforcementHyperparameters`

        The hyperparameters used for the reinforcement fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          Multiplier on amount of compute used for exploring search space during training.

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          The number of training steps between evaluation runs.

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_samples: optional "auto" or number`

          Number of evaluation samples to generate per training step.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

        - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

          Level of reasoning effort.

          - `"default"`

          - `"low"`

          - `"medium"`

          - `"high"`

    - `supervised: optional SupervisedMethod`

      Configuration for the supervised fine-tuning method.

      - `hyperparameters: optional SupervisedHyperparameters`

        The hyperparameters used for the fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

### Example

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "model": "gpt-4o-mini",
          "training_file": "file-abc123",
          "seed": 42,
          "validation_file": "file-abc123"
        }'
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "error": {
    "code": "code",
    "message": "message",
    "param": "param"
  },
  "fine_tuned_model": "fine_tuned_model",
  "finished_at": 0,
  "hyperparameters": {
    "batch_size": "auto",
    "learning_rate_multiplier": "auto",
    "n_epochs": "auto"
  },
  "model": "model",
  "object": "fine_tuning.job",
  "organization_id": "organization_id",
  "result_files": [
    "file-abc123"
  ],
  "seed": 0,
  "status": "validating_files",
  "trained_tokens": 0,
  "training_file": "training_file",
  "validation_file": "validation_file",
  "estimated_finish": 0,
  "integrations": [
    {
      "type": "wandb",
      "wandb": {
        "project": "my-wandb-project",
        "entity": "entity",
        "name": "name",
        "tags": [
          "custom-tag"
        ]
      }
    }
  ],
  "metadata": {
    "foo": "string"
  },
  "method": {
    "type": "supervised",
    "dpo": {
      "hyperparameters": {
        "batch_size": "auto",
        "beta": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    },
    "reinforcement": {
      "grader": {
        "input": "input",
        "name": "name",
        "operation": "eq",
        "reference": "reference",
        "type": "string_check"
      },
      "hyperparameters": {
        "batch_size": "auto",
        "compute_multiplier": "auto",
        "eval_interval": "auto",
        "eval_samples": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
        "reasoning_effort": "default"
      }
    },
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    }
  }
}
```

### DPO

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-abc123",
    "validation_file": "file-abc123",
    "model": "gpt-4o-mini",
    "method": {
      "type": "dpo",
      "dpo": {
        "hyperparameters": {
          "beta": 0.1
        }
      }
    }
  }'
```

#### Response

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc",
  "model": "gpt-4o-mini",
  "created_at": 1746130590,
  "fine_tuned_model": null,
  "organization_id": "org-abc",
  "result_files": [],
  "status": "queued",
  "validation_file": "file-123",
  "training_file": "file-abc",
  "method": {
    "type": "dpo",
    "dpo": {
      "hyperparameters": {
        "beta": 0.1,
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    }
  },
  "metadata": null,
  "error": {
    "code": null,
    "message": null,
    "param": null
  },
  "finished_at": null,
  "hyperparameters": null,
  "seed": 1036326793,
  "estimated_finish": null,
  "integrations": [],
  "user_provided_suffix": null,
  "usage_metrics": null,
  "shared_with_openai": false
}
```

### Example

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-BK7bzQj3FfZFXr7DbL6xJwfo",
    "model": "gpt-4o-mini"
  }'
```

#### Response

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "queued",
  "validation_file": null,
  "training_file": "file-abc123",
  "method": {
    "type": "supervised",
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
      }
    }
  },
  "metadata": null
}
```

### Epochs

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-abc123",
    "model": "gpt-4o-mini",
    "method": {
      "type": "supervised",
      "supervised": {
        "hyperparameters": {
          "n_epochs": 2
        }
      }
    }
  }'
```

#### Response

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "queued",
  "validation_file": null,
  "training_file": "file-abc123",
  "hyperparameters": {
    "batch_size": "auto",
    "learning_rate_multiplier": "auto",
    "n_epochs": 2
  },
  "method": {
    "type": "supervised",
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": 2
      }
    }
  },
  "metadata": null,
  "error": {
    "code": null,
    "message": null,
    "param": null
  },
  "finished_at": null,
  "seed": 683058546,
  "trained_tokens": null,
  "estimated_finish": null,
  "integrations": [],
  "user_provided_suffix": null,
  "usage_metrics": null,
  "shared_with_openai": false
}
```

### Reinforcement

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-abc",
    "validation_file": "file-123",
    "model": "o4-mini",
    "method": {
      "type": "reinforcement",
      "reinforcement": {
        "grader": {
          "type": "string_check",
          "name": "Example string check grader",
          "input": "{{sample.output_text}}",
          "reference": "{{item.label}}",
          "operation": "eq"
        },
        "hyperparameters": {
          "reasoning_effort": "medium"
        }
      }
    }
  }'
```

#### Response

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "o4-mini",
  "created_at": 1721764800,
  "finished_at": null,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "validating_files",
  "validation_file": "file-123",
  "training_file": "file-abc",
  "trained_tokens": null,
  "error": {},
  "user_provided_suffix": null,
  "seed": 950189191,
  "estimated_finish": null,
  "integrations": [],
  "method": {
    "type": "reinforcement",
    "reinforcement": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
        "eval_interval": "auto",
        "eval_samples": "auto",
        "compute_multiplier": "auto",
        "reasoning_effort": "medium"
      },
      "grader": {
        "type": "string_check",
        "name": "Example string check grader",
        "input": "{{sample.output_text}}",
        "reference": "{{item.label}}",
        "operation": "eq"
      },
      "response_format": null
    }
  },
  "metadata": null,
  "usage_metrics": null,
  "shared_with_openai": false
}
      
```

### Validation file

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-abc123",
    "validation_file": "file-abc123",
    "model": "gpt-4o-mini"
  }'
```

#### Response

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "queued",
  "validation_file": "file-abc123",
  "training_file": "file-abc123",
  "method": {
    "type": "supervised",
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
      }
    }
  },
  "metadata": null
}
```

### W&B Integration

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "training_file": "file-abc123",
    "validation_file": "file-abc123",
    "model": "gpt-4o-mini",
    "integrations": [
      {
        "type": "wandb",
        "wandb": {
          "project": "my-wandb-project",
          "name": "ft-run-display-name"
          "tags": [
            "first-experiment", "v2"
          ]
        }
      }
    ]
  }'
```

#### Response

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "queued",
  "validation_file": "file-abc123",
  "training_file": "file-abc123",
  "integrations": [
    {
      "type": "wandb",
      "wandb": {
        "project": "my-wandb-project",
        "entity": None,
        "run_id": "ftjob-abc123"
      }
    }
  ],
  "method": {
    "type": "supervised",
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
      }
    }
  },
  "metadata": null
}
```

## List fine-tuning jobs

**get** `/fine_tuning/jobs`

List your organization's fine-tuning jobs

### Query Parameters

- `after: optional string`

  Identifier for the last job from the previous pagination request.

- `limit: optional number`

  Number of fine-tuning jobs to retrieve.

- `metadata: optional map[string] or null`

  Optional metadata filter. To filter, use the syntax `metadata[k]=v`. Alternatively, set `metadata=null` to indicate no metadata.

### Returns

- `data: array of FineTuningJob`

  - `id: string`

    The object identifier, which can be referenced in the API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the fine-tuning job was created.

  - `error: object { code, message, param }  or null`

    For fine-tuning jobs that have `failed`, this will contain more information on the cause of the failure.

    - `code: string`

      A machine-readable error code.

    - `message: string`

      A human-readable error message.

    - `param: string or null`

      The parameter that was invalid, usually `training_file` or `validation_file`. This field will be null if the failure was not parameter-specific.

  - `fine_tuned_model: string or null`

    The name of the fine-tuned model that is being created. The value will be null if the fine-tuning job is still running.

  - `finished_at: number or null`

    The Unix timestamp (in seconds) for when the fine-tuning job was finished. The value will be null if the fine-tuning job is still running.

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    The hyperparameters used for the fine-tuning job. This value will only be returned when running `supervised` jobs.

    - `batch_size: optional "auto" or number or null`

      Number of examples in each batch. A larger batch size means that model parameters
      are updated less frequently, but with lower variance.

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      Scaling factor for the learning rate. A smaller learning rate may be useful to avoid
      overfitting.

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      The number of epochs to train the model for. An epoch refers to one full cycle
      through the training dataset.

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    The base model that is being fine-tuned.

  - `object: "fine_tuning.job"`

    The object type, which is always "fine_tuning.job".

    - `"fine_tuning.job"`

  - `organization_id: string`

    The organization that owns the fine-tuning job.

  - `result_files: array of string`

    The compiled results file ID(s) for the fine-tuning job. You can retrieve the results with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `seed: number`

    The seed used for the fine-tuning job.

  - `status: "validating_files" or "queued" or "running" or 3 more`

    The current status of the fine-tuning job, which can be either `validating_files`, `queued`, `running`, `succeeded`, `failed`, or `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    The total number of billable tokens processed by this fine-tuning job. The value will be null if the fine-tuning job is still running.

  - `training_file: string`

    The file ID used for training. You can retrieve the training data with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `validation_file: string or null`

    The file ID used for validation. You can retrieve the validation results with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `estimated_finish: optional number or null`

    The Unix timestamp (in seconds) for when the fine-tuning job is estimated to finish. The value will be null if the fine-tuning job is not running.

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    A list of integrations to enable for this fine-tuning job.

    - `type: "wandb"`

      The type of the integration being enabled for the fine-tuning job

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      The settings for your integration with Weights and Biases. This payload specifies the project that
      metrics will be sent to. Optionally, you can set an explicit display name for your run, add tags
      to your run, and set a default entity (team, username, etc) to be associated with your run.

      - `project: string`

        The name of the project that the new run will be created under.

      - `entity: optional string or null`

        The entity to use for the run. This allows you to set the team or username of the WandB user that you would
        like associated with the run. If not set, the default entity for the registered WandB API key is used.

      - `name: optional string or null`

        A display name to set for the run. If not set, we will use the Job ID as the name.

      - `tags: optional array of string`

        A list of tags to be attached to the newly created run. These tags are passed through directly to WandB. Some
        default tags are generated by OpenAI: "openai/finetune", "openai/{base-model}", "openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `method: optional object { type, dpo, reinforcement, supervised }`

    The method used for fine-tuning.

    - `type: "supervised" or "dpo" or "reinforcement"`

      The type of method. Is either `supervised`, `dpo`, or `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      Configuration for the DPO fine-tuning method.

      - `hyperparameters: optional DpoHyperparameters`

        The hyperparameters used for the DPO fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          The beta value for the DPO method. A higher beta value will increase the weight of the penalty between the policy and reference model.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      Configuration for the reinforcement fine-tuning method.

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        The grader used for the fine-tuning job.

        - `StringCheckGrader object { input, name, operation, 2 more }`

          A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

          - `input: string`

            The input text. This may include template strings.

          - `name: string`

            The name of the grader.

          - `operation: "eq" or "ne" or "like" or "ilike"`

            The string check operation to perform. One of `eq`, `ne`, `like`, or `ilike`.

            - `"eq"`

            - `"ne"`

            - `"like"`

            - `"ilike"`

          - `reference: string`

            The reference text. This may include template strings.

          - `type: "string_check"`

            The object type, which is always `string_check`.

            - `"string_check"`

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          A TextSimilarityGrader object which grades text based on similarity metrics.

          - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

            The evaluation metric to use. One of `cosine`, `fuzzy_match`, `bleu`,
            `gleu`, `meteor`, `rouge_1`, `rouge_2`, `rouge_3`, `rouge_4`, `rouge_5`,
            or `rouge_l`.

            - `"cosine"`

            - `"fuzzy_match"`

            - `"bleu"`

            - `"gleu"`

            - `"meteor"`

            - `"rouge_1"`

            - `"rouge_2"`

            - `"rouge_3"`

            - `"rouge_4"`

            - `"rouge_5"`

            - `"rouge_l"`

          - `input: string`

            The text being graded.

          - `name: string`

            The name of the grader.

          - `reference: string`

            The text being graded against.

          - `type: "text_similarity"`

            The type of grader.

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          A PythonGrader object that runs a python script on the input.

          - `name: string`

            The name of the grader.

          - `source: string`

            The source code of the python script.

          - `type: "python"`

            The object type, which is always `python`.

            - `"python"`

          - `image_tag: optional string`

            The image tag to use for the python script.

        - `ScoreModelGrader object { input, model, name, 3 more }`

          A ScoreModelGrader object that uses a model to assign a score to the input.

          - `input: array of object { content, role, type }`

            The input messages evaluated by the grader. Supports text, output text, input image, and input audio content blocks, and may include template strings.

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

              - `TextInput = string`

                A text input to the model.

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                A text input to the model.

                - `text: string`

                  The text input to the model.

                - `type: "input_text"`

                  The type of the input item. Always `input_text`.

                  - `"input_text"`

                - `prompt_cache_breakpoint: optional object { mode }`

                  Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

                  - `mode: "explicit"`

                    The breakpoint mode. Always `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                A text output from the model.

                - `text: string`

                  The text output from the model.

                - `type: "output_text"`

                  The type of the output text. Always `output_text`.

                  - `"output_text"`

              - `InputImage object { image_url, type, detail }`

                An image input block used within EvalItem content arrays.

                - `image_url: string`

                  The URL of the image input.

                - `type: "input_image"`

                  The type of the image input. Always `input_image`.

                  - `"input_image"`

                - `detail: optional string`

                  The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                An audio input to the model.

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64-encoded audio data.

                  - `format: "mp3" or "wav"`

                    The format of the audio data. Currently supported formats are `mp3` and
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  The type of the input item. Always `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                A list of inputs, each of which may be either an input text, output text, input
                image, or input audio object.

                - `TextInput = string`

                  A text input to the model.

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  A text input to the model.

                - `OutputText object { text, type }`

                  A text output from the model.

                  - `text: string`

                    The text output from the model.

                  - `type: "output_text"`

                    The type of the output text. Always `output_text`.

                    - `"output_text"`

                - `InputImage object { image_url, type, detail }`

                  An image input block used within EvalItem content arrays.

                  - `image_url: string`

                    The URL of the image input.

                  - `type: "input_image"`

                    The type of the image input. Always `input_image`.

                    - `"input_image"`

                  - `detail: optional string`

                    The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  An audio input to the model.

            - `role: "user" or "assistant" or "system" or "developer"`

              The role of the message input. One of `user`, `assistant`, `system`, or
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              The type of the message input. Always `message`.

              - `"message"`

          - `model: string`

            The model to use for the evaluation.

          - `name: string`

            The name of the grader.

          - `type: "score_model"`

            The object type, which is always `score_model`.

            - `"score_model"`

          - `range: optional array of number`

            The range of the score. Defaults to `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            The sampling parameters for the model.

            - `max_completions_tokens: optional number or null`

              The maximum number of tokens the grader model may generate in its response.

            - `reasoning_effort: optional ReasoningEffort or null`

              Constrains effort on reasoning for reasoning models. Currently supported
              values are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`.
              Reducing reasoning effort can result in faster responses and fewer tokens
              used on reasoning in a response. Not all reasoning models support every
              value. See the
              [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
              for model-specific support.

              - `"none"`

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

            - `seed: optional number or null`

              A seed value to initialize the randomness, during sampling.

            - `temperature: optional number or null`

              A higher temperature increases randomness in the outputs.

            - `top_p: optional number or null`

              An alternative to temperature for nucleus sampling; 1.0 includes all tokens.

        - `MultiGrader object { calculate_output, graders, name, type }`

          A MultiGrader object combines the output of multiple graders to produce a single score.

          - `calculate_output: string`

            A formula to calculate the output based on grader results.

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

            - `StringCheckGrader object { input, name, operation, 2 more }`

              A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              A TextSimilarityGrader object which grades text based on similarity metrics.

            - `PythonGrader object { name, source, type, image_tag }`

              A PythonGrader object that runs a python script on the input.

            - `ScoreModelGrader object { input, model, name, 3 more }`

              A ScoreModelGrader object that uses a model to assign a score to the input.

            - `LabelModelGrader object { input, labels, model, 3 more }`

              A LabelModelGrader object which uses a model to assign labels to each item
              in the evaluation.

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

                  - `TextInput = string`

                    A text input to the model.

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    A text input to the model.

                  - `OutputText object { text, type }`

                    A text output from the model.

                    - `text: string`

                      The text output from the model.

                    - `type: "output_text"`

                      The type of the output text. Always `output_text`.

                      - `"output_text"`

                  - `InputImage object { image_url, type, detail }`

                    An image input block used within EvalItem content arrays.

                    - `image_url: string`

                      The URL of the image input.

                    - `type: "input_image"`

                      The type of the image input. Always `input_image`.

                      - `"input_image"`

                    - `detail: optional string`

                      The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    An audio input to the model.

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    A list of inputs, each of which may be either an input text, output text, input
                    image, or input audio object.

                - `role: "user" or "assistant" or "system" or "developer"`

                  The role of the message input. One of `user`, `assistant`, `system`, or
                  `developer`.

                  - `"user"`

                  - `"assistant"`

                  - `"system"`

                  - `"developer"`

                - `type: optional "message"`

                  The type of the message input. Always `message`.

                  - `"message"`

              - `labels: array of string`

                The labels to assign to each item in the evaluation.

              - `model: string`

                The model to use for the evaluation. Must support structured outputs.

              - `name: string`

                The name of the grader.

              - `passing_labels: array of string`

                The labels that indicate a passing result. Must be a subset of labels.

              - `type: "label_model"`

                The object type, which is always `label_model`.

                - `"label_model"`

          - `name: string`

            The name of the grader.

          - `type: "multi"`

            The object type, which is always `multi`.

            - `"multi"`

      - `hyperparameters: optional ReinforcementHyperparameters`

        The hyperparameters used for the reinforcement fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          Multiplier on amount of compute used for exploring search space during training.

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          The number of training steps between evaluation runs.

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_samples: optional "auto" or number`

          Number of evaluation samples to generate per training step.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

        - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

          Level of reasoning effort.

          - `"default"`

          - `"low"`

          - `"medium"`

          - `"high"`

    - `supervised: optional SupervisedMethod`

      Configuration for the supervised fine-tuning method.

      - `hyperparameters: optional SupervisedHyperparameters`

        The hyperparameters used for the fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

- `has_more: boolean`

- `object: "list"`

  - `"list"`

### Example

```http
curl https://api.openai.com/v1/fine_tuning/jobs \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "error": {
        "code": "code",
        "message": "message",
        "param": "param"
      },
      "fine_tuned_model": "fine_tuned_model",
      "finished_at": 0,
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      },
      "model": "model",
      "object": "fine_tuning.job",
      "organization_id": "organization_id",
      "result_files": [
        "file-abc123"
      ],
      "seed": 0,
      "status": "validating_files",
      "trained_tokens": 0,
      "training_file": "training_file",
      "validation_file": "validation_file",
      "estimated_finish": 0,
      "integrations": [
        {
          "type": "wandb",
          "wandb": {
            "project": "my-wandb-project",
            "entity": "entity",
            "name": "name",
            "tags": [
              "custom-tag"
            ]
          }
        }
      ],
      "metadata": {
        "foo": "string"
      },
      "method": {
        "type": "supervised",
        "dpo": {
          "hyperparameters": {
            "batch_size": "auto",
            "beta": "auto",
            "learning_rate_multiplier": "auto",
            "n_epochs": "auto"
          }
        },
        "reinforcement": {
          "grader": {
            "input": "input",
            "name": "name",
            "operation": "eq",
            "reference": "reference",
            "type": "string_check"
          },
          "hyperparameters": {
            "batch_size": "auto",
            "compute_multiplier": "auto",
            "eval_interval": "auto",
            "eval_samples": "auto",
            "learning_rate_multiplier": "auto",
            "n_epochs": "auto",
            "reasoning_effort": "default"
          }
        },
        "supervised": {
          "hyperparameters": {
            "batch_size": "auto",
            "learning_rate_multiplier": "auto",
            "n_epochs": "auto"
          }
        }
      }
    }
  ],
  "has_more": true,
  "object": "list"
}
```

### Example

```http
curl https://api.openai.com/v1/fine_tuning/jobs?limit=2&metadata[key]=value \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "object": "list",
  "data": [
    {
      "object": "fine_tuning.job",
      "id": "ftjob-abc123",
      "model": "gpt-4o-mini-2024-07-18",
      "created_at": 1721764800,
      "fine_tuned_model": null,
      "organization_id": "org-123",
      "result_files": [],
      "status": "queued",
      "validation_file": null,
      "training_file": "file-abc123",
      "metadata": {
        "key": "value"
      }
    },
    { ... },
    { ... }
  ], "has_more": true
}
```

## List fine-tuning events

**get** `/fine_tuning/jobs/{fine_tuning_job_id}/events`

Get status updates for a fine-tuning job.

### Path Parameters

- `fine_tuning_job_id: string`

### Query Parameters

- `after: optional string`

  Identifier for the last event from the previous pagination request.

- `limit: optional number`

  Number of events to retrieve.

### Returns

- `data: array of FineTuningJobEvent`

  - `id: string`

    The object identifier.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the fine-tuning job was created.

  - `level: "info" or "warn" or "error"`

    The log level of the event.

    - `"info"`

    - `"warn"`

    - `"error"`

  - `message: string`

    The message of the event.

  - `object: "fine_tuning.job.event"`

    The object type, which is always "fine_tuning.job.event".

    - `"fine_tuning.job.event"`

  - `data: optional unknown`

    The data associated with the event.

  - `type: optional "message" or "metrics"`

    The type of event.

    - `"message"`

    - `"metrics"`

- `has_more: boolean`

- `object: "list"`

  - `"list"`

### Example

```http
curl https://api.openai.com/v1/fine_tuning/jobs/$FINE_TUNING_JOB_ID/events \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "level": "info",
      "message": "message",
      "object": "fine_tuning.job.event",
      "data": {},
      "type": "message"
    }
  ],
  "has_more": true,
  "object": "list"
}
```

### Example

```http
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/events \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "object": "list",
  "data": [
    {
      "object": "fine_tuning.job.event",
      "id": "ft-event-ddTJfwuMVpfLXseO0Am0Gqjm",
      "created_at": 1721764800,
      "level": "info",
      "message": "Fine tuning job successfully completed",
      "data": null,
      "type": "message"
    },
    {
      "object": "fine_tuning.job.event",
      "id": "ft-event-tyiGuB72evQncpH87xe505Sv",
      "created_at": 1721764800,
      "level": "info",
      "message": "New fine-tuned model created: ft:gpt-4o-mini:openai::7p4lURel",
      "data": null,
      "type": "message"
    }
  ],
  "has_more": true
}
```

## Pause fine-tuning

**post** `/fine_tuning/jobs/{fine_tuning_job_id}/pause`

Pause a fine-tune job.

### Path Parameters

- `fine_tuning_job_id: string`

### Returns

- `FineTuningJob object { id, created_at, error, 16 more }`

  The `fine_tuning.job` object represents a fine-tuning job that has been created through the API.

  - `id: string`

    The object identifier, which can be referenced in the API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the fine-tuning job was created.

  - `error: object { code, message, param }  or null`

    For fine-tuning jobs that have `failed`, this will contain more information on the cause of the failure.

    - `code: string`

      A machine-readable error code.

    - `message: string`

      A human-readable error message.

    - `param: string or null`

      The parameter that was invalid, usually `training_file` or `validation_file`. This field will be null if the failure was not parameter-specific.

  - `fine_tuned_model: string or null`

    The name of the fine-tuned model that is being created. The value will be null if the fine-tuning job is still running.

  - `finished_at: number or null`

    The Unix timestamp (in seconds) for when the fine-tuning job was finished. The value will be null if the fine-tuning job is still running.

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    The hyperparameters used for the fine-tuning job. This value will only be returned when running `supervised` jobs.

    - `batch_size: optional "auto" or number or null`

      Number of examples in each batch. A larger batch size means that model parameters
      are updated less frequently, but with lower variance.

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      Scaling factor for the learning rate. A smaller learning rate may be useful to avoid
      overfitting.

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      The number of epochs to train the model for. An epoch refers to one full cycle
      through the training dataset.

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    The base model that is being fine-tuned.

  - `object: "fine_tuning.job"`

    The object type, which is always "fine_tuning.job".

    - `"fine_tuning.job"`

  - `organization_id: string`

    The organization that owns the fine-tuning job.

  - `result_files: array of string`

    The compiled results file ID(s) for the fine-tuning job. You can retrieve the results with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `seed: number`

    The seed used for the fine-tuning job.

  - `status: "validating_files" or "queued" or "running" or 3 more`

    The current status of the fine-tuning job, which can be either `validating_files`, `queued`, `running`, `succeeded`, `failed`, or `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    The total number of billable tokens processed by this fine-tuning job. The value will be null if the fine-tuning job is still running.

  - `training_file: string`

    The file ID used for training. You can retrieve the training data with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `validation_file: string or null`

    The file ID used for validation. You can retrieve the validation results with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `estimated_finish: optional number or null`

    The Unix timestamp (in seconds) for when the fine-tuning job is estimated to finish. The value will be null if the fine-tuning job is not running.

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    A list of integrations to enable for this fine-tuning job.

    - `type: "wandb"`

      The type of the integration being enabled for the fine-tuning job

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      The settings for your integration with Weights and Biases. This payload specifies the project that
      metrics will be sent to. Optionally, you can set an explicit display name for your run, add tags
      to your run, and set a default entity (team, username, etc) to be associated with your run.

      - `project: string`

        The name of the project that the new run will be created under.

      - `entity: optional string or null`

        The entity to use for the run. This allows you to set the team or username of the WandB user that you would
        like associated with the run. If not set, the default entity for the registered WandB API key is used.

      - `name: optional string or null`

        A display name to set for the run. If not set, we will use the Job ID as the name.

      - `tags: optional array of string`

        A list of tags to be attached to the newly created run. These tags are passed through directly to WandB. Some
        default tags are generated by OpenAI: "openai/finetune", "openai/{base-model}", "openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `method: optional object { type, dpo, reinforcement, supervised }`

    The method used for fine-tuning.

    - `type: "supervised" or "dpo" or "reinforcement"`

      The type of method. Is either `supervised`, `dpo`, or `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      Configuration for the DPO fine-tuning method.

      - `hyperparameters: optional DpoHyperparameters`

        The hyperparameters used for the DPO fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          The beta value for the DPO method. A higher beta value will increase the weight of the penalty between the policy and reference model.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      Configuration for the reinforcement fine-tuning method.

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        The grader used for the fine-tuning job.

        - `StringCheckGrader object { input, name, operation, 2 more }`

          A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

          - `input: string`

            The input text. This may include template strings.

          - `name: string`

            The name of the grader.

          - `operation: "eq" or "ne" or "like" or "ilike"`

            The string check operation to perform. One of `eq`, `ne`, `like`, or `ilike`.

            - `"eq"`

            - `"ne"`

            - `"like"`

            - `"ilike"`

          - `reference: string`

            The reference text. This may include template strings.

          - `type: "string_check"`

            The object type, which is always `string_check`.

            - `"string_check"`

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          A TextSimilarityGrader object which grades text based on similarity metrics.

          - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

            The evaluation metric to use. One of `cosine`, `fuzzy_match`, `bleu`,
            `gleu`, `meteor`, `rouge_1`, `rouge_2`, `rouge_3`, `rouge_4`, `rouge_5`,
            or `rouge_l`.

            - `"cosine"`

            - `"fuzzy_match"`

            - `"bleu"`

            - `"gleu"`

            - `"meteor"`

            - `"rouge_1"`

            - `"rouge_2"`

            - `"rouge_3"`

            - `"rouge_4"`

            - `"rouge_5"`

            - `"rouge_l"`

          - `input: string`

            The text being graded.

          - `name: string`

            The name of the grader.

          - `reference: string`

            The text being graded against.

          - `type: "text_similarity"`

            The type of grader.

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          A PythonGrader object that runs a python script on the input.

          - `name: string`

            The name of the grader.

          - `source: string`

            The source code of the python script.

          - `type: "python"`

            The object type, which is always `python`.

            - `"python"`

          - `image_tag: optional string`

            The image tag to use for the python script.

        - `ScoreModelGrader object { input, model, name, 3 more }`

          A ScoreModelGrader object that uses a model to assign a score to the input.

          - `input: array of object { content, role, type }`

            The input messages evaluated by the grader. Supports text, output text, input image, and input audio content blocks, and may include template strings.

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

              - `TextInput = string`

                A text input to the model.

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                A text input to the model.

                - `text: string`

                  The text input to the model.

                - `type: "input_text"`

                  The type of the input item. Always `input_text`.

                  - `"input_text"`

                - `prompt_cache_breakpoint: optional object { mode }`

                  Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

                  - `mode: "explicit"`

                    The breakpoint mode. Always `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                A text output from the model.

                - `text: string`

                  The text output from the model.

                - `type: "output_text"`

                  The type of the output text. Always `output_text`.

                  - `"output_text"`

              - `InputImage object { image_url, type, detail }`

                An image input block used within EvalItem content arrays.

                - `image_url: string`

                  The URL of the image input.

                - `type: "input_image"`

                  The type of the image input. Always `input_image`.

                  - `"input_image"`

                - `detail: optional string`

                  The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                An audio input to the model.

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64-encoded audio data.

                  - `format: "mp3" or "wav"`

                    The format of the audio data. Currently supported formats are `mp3` and
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  The type of the input item. Always `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                A list of inputs, each of which may be either an input text, output text, input
                image, or input audio object.

                - `TextInput = string`

                  A text input to the model.

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  A text input to the model.

                - `OutputText object { text, type }`

                  A text output from the model.

                  - `text: string`

                    The text output from the model.

                  - `type: "output_text"`

                    The type of the output text. Always `output_text`.

                    - `"output_text"`

                - `InputImage object { image_url, type, detail }`

                  An image input block used within EvalItem content arrays.

                  - `image_url: string`

                    The URL of the image input.

                  - `type: "input_image"`

                    The type of the image input. Always `input_image`.

                    - `"input_image"`

                  - `detail: optional string`

                    The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  An audio input to the model.

            - `role: "user" or "assistant" or "system" or "developer"`

              The role of the message input. One of `user`, `assistant`, `system`, or
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              The type of the message input. Always `message`.

              - `"message"`

          - `model: string`

            The model to use for the evaluation.

          - `name: string`

            The name of the grader.

          - `type: "score_model"`

            The object type, which is always `score_model`.

            - `"score_model"`

          - `range: optional array of number`

            The range of the score. Defaults to `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            The sampling parameters for the model.

            - `max_completions_tokens: optional number or null`

              The maximum number of tokens the grader model may generate in its response.

            - `reasoning_effort: optional ReasoningEffort or null`

              Constrains effort on reasoning for reasoning models. Currently supported
              values are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`.
              Reducing reasoning effort can result in faster responses and fewer tokens
              used on reasoning in a response. Not all reasoning models support every
              value. See the
              [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
              for model-specific support.

              - `"none"`

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

            - `seed: optional number or null`

              A seed value to initialize the randomness, during sampling.

            - `temperature: optional number or null`

              A higher temperature increases randomness in the outputs.

            - `top_p: optional number or null`

              An alternative to temperature for nucleus sampling; 1.0 includes all tokens.

        - `MultiGrader object { calculate_output, graders, name, type }`

          A MultiGrader object combines the output of multiple graders to produce a single score.

          - `calculate_output: string`

            A formula to calculate the output based on grader results.

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

            - `StringCheckGrader object { input, name, operation, 2 more }`

              A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              A TextSimilarityGrader object which grades text based on similarity metrics.

            - `PythonGrader object { name, source, type, image_tag }`

              A PythonGrader object that runs a python script on the input.

            - `ScoreModelGrader object { input, model, name, 3 more }`

              A ScoreModelGrader object that uses a model to assign a score to the input.

            - `LabelModelGrader object { input, labels, model, 3 more }`

              A LabelModelGrader object which uses a model to assign labels to each item
              in the evaluation.

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

                  - `TextInput = string`

                    A text input to the model.

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    A text input to the model.

                  - `OutputText object { text, type }`

                    A text output from the model.

                    - `text: string`

                      The text output from the model.

                    - `type: "output_text"`

                      The type of the output text. Always `output_text`.

                      - `"output_text"`

                  - `InputImage object { image_url, type, detail }`

                    An image input block used within EvalItem content arrays.

                    - `image_url: string`

                      The URL of the image input.

                    - `type: "input_image"`

                      The type of the image input. Always `input_image`.

                      - `"input_image"`

                    - `detail: optional string`

                      The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    An audio input to the model.

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    A list of inputs, each of which may be either an input text, output text, input
                    image, or input audio object.

                - `role: "user" or "assistant" or "system" or "developer"`

                  The role of the message input. One of `user`, `assistant`, `system`, or
                  `developer`.

                  - `"user"`

                  - `"assistant"`

                  - `"system"`

                  - `"developer"`

                - `type: optional "message"`

                  The type of the message input. Always `message`.

                  - `"message"`

              - `labels: array of string`

                The labels to assign to each item in the evaluation.

              - `model: string`

                The model to use for the evaluation. Must support structured outputs.

              - `name: string`

                The name of the grader.

              - `passing_labels: array of string`

                The labels that indicate a passing result. Must be a subset of labels.

              - `type: "label_model"`

                The object type, which is always `label_model`.

                - `"label_model"`

          - `name: string`

            The name of the grader.

          - `type: "multi"`

            The object type, which is always `multi`.

            - `"multi"`

      - `hyperparameters: optional ReinforcementHyperparameters`

        The hyperparameters used for the reinforcement fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          Multiplier on amount of compute used for exploring search space during training.

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          The number of training steps between evaluation runs.

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_samples: optional "auto" or number`

          Number of evaluation samples to generate per training step.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

        - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

          Level of reasoning effort.

          - `"default"`

          - `"low"`

          - `"medium"`

          - `"high"`

    - `supervised: optional SupervisedMethod`

      Configuration for the supervised fine-tuning method.

      - `hyperparameters: optional SupervisedHyperparameters`

        The hyperparameters used for the fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

### Example

```http
curl https://api.openai.com/v1/fine_tuning/jobs/$FINE_TUNING_JOB_ID/pause \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "error": {
    "code": "code",
    "message": "message",
    "param": "param"
  },
  "fine_tuned_model": "fine_tuned_model",
  "finished_at": 0,
  "hyperparameters": {
    "batch_size": "auto",
    "learning_rate_multiplier": "auto",
    "n_epochs": "auto"
  },
  "model": "model",
  "object": "fine_tuning.job",
  "organization_id": "organization_id",
  "result_files": [
    "file-abc123"
  ],
  "seed": 0,
  "status": "validating_files",
  "trained_tokens": 0,
  "training_file": "training_file",
  "validation_file": "validation_file",
  "estimated_finish": 0,
  "integrations": [
    {
      "type": "wandb",
      "wandb": {
        "project": "my-wandb-project",
        "entity": "entity",
        "name": "name",
        "tags": [
          "custom-tag"
        ]
      }
    }
  ],
  "metadata": {
    "foo": "string"
  },
  "method": {
    "type": "supervised",
    "dpo": {
      "hyperparameters": {
        "batch_size": "auto",
        "beta": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    },
    "reinforcement": {
      "grader": {
        "input": "input",
        "name": "name",
        "operation": "eq",
        "reference": "reference",
        "type": "string_check"
      },
      "hyperparameters": {
        "batch_size": "auto",
        "compute_multiplier": "auto",
        "eval_interval": "auto",
        "eval_samples": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
        "reasoning_effort": "default"
      }
    },
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    }
  }
}
```

### Example

```http
curl -X POST https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/pause \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "paused",
  "validation_file": "file-abc123",
  "training_file": "file-abc123"
}
```

## Resume fine-tuning

**post** `/fine_tuning/jobs/{fine_tuning_job_id}/resume`

Resume a fine-tune job.

### Path Parameters

- `fine_tuning_job_id: string`

### Returns

- `FineTuningJob object { id, created_at, error, 16 more }`

  The `fine_tuning.job` object represents a fine-tuning job that has been created through the API.

  - `id: string`

    The object identifier, which can be referenced in the API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the fine-tuning job was created.

  - `error: object { code, message, param }  or null`

    For fine-tuning jobs that have `failed`, this will contain more information on the cause of the failure.

    - `code: string`

      A machine-readable error code.

    - `message: string`

      A human-readable error message.

    - `param: string or null`

      The parameter that was invalid, usually `training_file` or `validation_file`. This field will be null if the failure was not parameter-specific.

  - `fine_tuned_model: string or null`

    The name of the fine-tuned model that is being created. The value will be null if the fine-tuning job is still running.

  - `finished_at: number or null`

    The Unix timestamp (in seconds) for when the fine-tuning job was finished. The value will be null if the fine-tuning job is still running.

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    The hyperparameters used for the fine-tuning job. This value will only be returned when running `supervised` jobs.

    - `batch_size: optional "auto" or number or null`

      Number of examples in each batch. A larger batch size means that model parameters
      are updated less frequently, but with lower variance.

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      Scaling factor for the learning rate. A smaller learning rate may be useful to avoid
      overfitting.

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      The number of epochs to train the model for. An epoch refers to one full cycle
      through the training dataset.

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    The base model that is being fine-tuned.

  - `object: "fine_tuning.job"`

    The object type, which is always "fine_tuning.job".

    - `"fine_tuning.job"`

  - `organization_id: string`

    The organization that owns the fine-tuning job.

  - `result_files: array of string`

    The compiled results file ID(s) for the fine-tuning job. You can retrieve the results with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `seed: number`

    The seed used for the fine-tuning job.

  - `status: "validating_files" or "queued" or "running" or 3 more`

    The current status of the fine-tuning job, which can be either `validating_files`, `queued`, `running`, `succeeded`, `failed`, or `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    The total number of billable tokens processed by this fine-tuning job. The value will be null if the fine-tuning job is still running.

  - `training_file: string`

    The file ID used for training. You can retrieve the training data with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `validation_file: string or null`

    The file ID used for validation. You can retrieve the validation results with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `estimated_finish: optional number or null`

    The Unix timestamp (in seconds) for when the fine-tuning job is estimated to finish. The value will be null if the fine-tuning job is not running.

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    A list of integrations to enable for this fine-tuning job.

    - `type: "wandb"`

      The type of the integration being enabled for the fine-tuning job

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      The settings for your integration with Weights and Biases. This payload specifies the project that
      metrics will be sent to. Optionally, you can set an explicit display name for your run, add tags
      to your run, and set a default entity (team, username, etc) to be associated with your run.

      - `project: string`

        The name of the project that the new run will be created under.

      - `entity: optional string or null`

        The entity to use for the run. This allows you to set the team or username of the WandB user that you would
        like associated with the run. If not set, the default entity for the registered WandB API key is used.

      - `name: optional string or null`

        A display name to set for the run. If not set, we will use the Job ID as the name.

      - `tags: optional array of string`

        A list of tags to be attached to the newly created run. These tags are passed through directly to WandB. Some
        default tags are generated by OpenAI: "openai/finetune", "openai/{base-model}", "openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `method: optional object { type, dpo, reinforcement, supervised }`

    The method used for fine-tuning.

    - `type: "supervised" or "dpo" or "reinforcement"`

      The type of method. Is either `supervised`, `dpo`, or `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      Configuration for the DPO fine-tuning method.

      - `hyperparameters: optional DpoHyperparameters`

        The hyperparameters used for the DPO fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          The beta value for the DPO method. A higher beta value will increase the weight of the penalty between the policy and reference model.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      Configuration for the reinforcement fine-tuning method.

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        The grader used for the fine-tuning job.

        - `StringCheckGrader object { input, name, operation, 2 more }`

          A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

          - `input: string`

            The input text. This may include template strings.

          - `name: string`

            The name of the grader.

          - `operation: "eq" or "ne" or "like" or "ilike"`

            The string check operation to perform. One of `eq`, `ne`, `like`, or `ilike`.

            - `"eq"`

            - `"ne"`

            - `"like"`

            - `"ilike"`

          - `reference: string`

            The reference text. This may include template strings.

          - `type: "string_check"`

            The object type, which is always `string_check`.

            - `"string_check"`

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          A TextSimilarityGrader object which grades text based on similarity metrics.

          - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

            The evaluation metric to use. One of `cosine`, `fuzzy_match`, `bleu`,
            `gleu`, `meteor`, `rouge_1`, `rouge_2`, `rouge_3`, `rouge_4`, `rouge_5`,
            or `rouge_l`.

            - `"cosine"`

            - `"fuzzy_match"`

            - `"bleu"`

            - `"gleu"`

            - `"meteor"`

            - `"rouge_1"`

            - `"rouge_2"`

            - `"rouge_3"`

            - `"rouge_4"`

            - `"rouge_5"`

            - `"rouge_l"`

          - `input: string`

            The text being graded.

          - `name: string`

            The name of the grader.

          - `reference: string`

            The text being graded against.

          - `type: "text_similarity"`

            The type of grader.

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          A PythonGrader object that runs a python script on the input.

          - `name: string`

            The name of the grader.

          - `source: string`

            The source code of the python script.

          - `type: "python"`

            The object type, which is always `python`.

            - `"python"`

          - `image_tag: optional string`

            The image tag to use for the python script.

        - `ScoreModelGrader object { input, model, name, 3 more }`

          A ScoreModelGrader object that uses a model to assign a score to the input.

          - `input: array of object { content, role, type }`

            The input messages evaluated by the grader. Supports text, output text, input image, and input audio content blocks, and may include template strings.

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

              - `TextInput = string`

                A text input to the model.

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                A text input to the model.

                - `text: string`

                  The text input to the model.

                - `type: "input_text"`

                  The type of the input item. Always `input_text`.

                  - `"input_text"`

                - `prompt_cache_breakpoint: optional object { mode }`

                  Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

                  - `mode: "explicit"`

                    The breakpoint mode. Always `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                A text output from the model.

                - `text: string`

                  The text output from the model.

                - `type: "output_text"`

                  The type of the output text. Always `output_text`.

                  - `"output_text"`

              - `InputImage object { image_url, type, detail }`

                An image input block used within EvalItem content arrays.

                - `image_url: string`

                  The URL of the image input.

                - `type: "input_image"`

                  The type of the image input. Always `input_image`.

                  - `"input_image"`

                - `detail: optional string`

                  The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                An audio input to the model.

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64-encoded audio data.

                  - `format: "mp3" or "wav"`

                    The format of the audio data. Currently supported formats are `mp3` and
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  The type of the input item. Always `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                A list of inputs, each of which may be either an input text, output text, input
                image, or input audio object.

                - `TextInput = string`

                  A text input to the model.

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  A text input to the model.

                - `OutputText object { text, type }`

                  A text output from the model.

                  - `text: string`

                    The text output from the model.

                  - `type: "output_text"`

                    The type of the output text. Always `output_text`.

                    - `"output_text"`

                - `InputImage object { image_url, type, detail }`

                  An image input block used within EvalItem content arrays.

                  - `image_url: string`

                    The URL of the image input.

                  - `type: "input_image"`

                    The type of the image input. Always `input_image`.

                    - `"input_image"`

                  - `detail: optional string`

                    The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  An audio input to the model.

            - `role: "user" or "assistant" or "system" or "developer"`

              The role of the message input. One of `user`, `assistant`, `system`, or
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              The type of the message input. Always `message`.

              - `"message"`

          - `model: string`

            The model to use for the evaluation.

          - `name: string`

            The name of the grader.

          - `type: "score_model"`

            The object type, which is always `score_model`.

            - `"score_model"`

          - `range: optional array of number`

            The range of the score. Defaults to `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            The sampling parameters for the model.

            - `max_completions_tokens: optional number or null`

              The maximum number of tokens the grader model may generate in its response.

            - `reasoning_effort: optional ReasoningEffort or null`

              Constrains effort on reasoning for reasoning models. Currently supported
              values are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`.
              Reducing reasoning effort can result in faster responses and fewer tokens
              used on reasoning in a response. Not all reasoning models support every
              value. See the
              [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
              for model-specific support.

              - `"none"`

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

            - `seed: optional number or null`

              A seed value to initialize the randomness, during sampling.

            - `temperature: optional number or null`

              A higher temperature increases randomness in the outputs.

            - `top_p: optional number or null`

              An alternative to temperature for nucleus sampling; 1.0 includes all tokens.

        - `MultiGrader object { calculate_output, graders, name, type }`

          A MultiGrader object combines the output of multiple graders to produce a single score.

          - `calculate_output: string`

            A formula to calculate the output based on grader results.

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

            - `StringCheckGrader object { input, name, operation, 2 more }`

              A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              A TextSimilarityGrader object which grades text based on similarity metrics.

            - `PythonGrader object { name, source, type, image_tag }`

              A PythonGrader object that runs a python script on the input.

            - `ScoreModelGrader object { input, model, name, 3 more }`

              A ScoreModelGrader object that uses a model to assign a score to the input.

            - `LabelModelGrader object { input, labels, model, 3 more }`

              A LabelModelGrader object which uses a model to assign labels to each item
              in the evaluation.

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

                  - `TextInput = string`

                    A text input to the model.

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    A text input to the model.

                  - `OutputText object { text, type }`

                    A text output from the model.

                    - `text: string`

                      The text output from the model.

                    - `type: "output_text"`

                      The type of the output text. Always `output_text`.

                      - `"output_text"`

                  - `InputImage object { image_url, type, detail }`

                    An image input block used within EvalItem content arrays.

                    - `image_url: string`

                      The URL of the image input.

                    - `type: "input_image"`

                      The type of the image input. Always `input_image`.

                      - `"input_image"`

                    - `detail: optional string`

                      The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    An audio input to the model.

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    A list of inputs, each of which may be either an input text, output text, input
                    image, or input audio object.

                - `role: "user" or "assistant" or "system" or "developer"`

                  The role of the message input. One of `user`, `assistant`, `system`, or
                  `developer`.

                  - `"user"`

                  - `"assistant"`

                  - `"system"`

                  - `"developer"`

                - `type: optional "message"`

                  The type of the message input. Always `message`.

                  - `"message"`

              - `labels: array of string`

                The labels to assign to each item in the evaluation.

              - `model: string`

                The model to use for the evaluation. Must support structured outputs.

              - `name: string`

                The name of the grader.

              - `passing_labels: array of string`

                The labels that indicate a passing result. Must be a subset of labels.

              - `type: "label_model"`

                The object type, which is always `label_model`.

                - `"label_model"`

          - `name: string`

            The name of the grader.

          - `type: "multi"`

            The object type, which is always `multi`.

            - `"multi"`

      - `hyperparameters: optional ReinforcementHyperparameters`

        The hyperparameters used for the reinforcement fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          Multiplier on amount of compute used for exploring search space during training.

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          The number of training steps between evaluation runs.

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_samples: optional "auto" or number`

          Number of evaluation samples to generate per training step.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

        - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

          Level of reasoning effort.

          - `"default"`

          - `"low"`

          - `"medium"`

          - `"high"`

    - `supervised: optional SupervisedMethod`

      Configuration for the supervised fine-tuning method.

      - `hyperparameters: optional SupervisedHyperparameters`

        The hyperparameters used for the fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

### Example

```http
curl https://api.openai.com/v1/fine_tuning/jobs/$FINE_TUNING_JOB_ID/resume \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "error": {
    "code": "code",
    "message": "message",
    "param": "param"
  },
  "fine_tuned_model": "fine_tuned_model",
  "finished_at": 0,
  "hyperparameters": {
    "batch_size": "auto",
    "learning_rate_multiplier": "auto",
    "n_epochs": "auto"
  },
  "model": "model",
  "object": "fine_tuning.job",
  "organization_id": "organization_id",
  "result_files": [
    "file-abc123"
  ],
  "seed": 0,
  "status": "validating_files",
  "trained_tokens": 0,
  "training_file": "training_file",
  "validation_file": "validation_file",
  "estimated_finish": 0,
  "integrations": [
    {
      "type": "wandb",
      "wandb": {
        "project": "my-wandb-project",
        "entity": "entity",
        "name": "name",
        "tags": [
          "custom-tag"
        ]
      }
    }
  ],
  "metadata": {
    "foo": "string"
  },
  "method": {
    "type": "supervised",
    "dpo": {
      "hyperparameters": {
        "batch_size": "auto",
        "beta": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    },
    "reinforcement": {
      "grader": {
        "input": "input",
        "name": "name",
        "operation": "eq",
        "reference": "reference",
        "type": "string_check"
      },
      "hyperparameters": {
        "batch_size": "auto",
        "compute_multiplier": "auto",
        "eval_interval": "auto",
        "eval_samples": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
        "reasoning_effort": "default"
      }
    },
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    }
  }
}
```

### Example

```http
curl -X POST https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/resume \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "gpt-4o-mini-2024-07-18",
  "created_at": 1721764800,
  "fine_tuned_model": null,
  "organization_id": "org-123",
  "result_files": [],
  "status": "queued",
  "validation_file": "file-abc123",
  "training_file": "file-abc123"
}
```

## Retrieve fine-tuning job

**get** `/fine_tuning/jobs/{fine_tuning_job_id}`

Get info about a fine-tuning job.

[Learn more about fine-tuning](/docs/guides/model-optimization)

### Path Parameters

- `fine_tuning_job_id: string`

### Returns

- `FineTuningJob object { id, created_at, error, 16 more }`

  The `fine_tuning.job` object represents a fine-tuning job that has been created through the API.

  - `id: string`

    The object identifier, which can be referenced in the API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the fine-tuning job was created.

  - `error: object { code, message, param }  or null`

    For fine-tuning jobs that have `failed`, this will contain more information on the cause of the failure.

    - `code: string`

      A machine-readable error code.

    - `message: string`

      A human-readable error message.

    - `param: string or null`

      The parameter that was invalid, usually `training_file` or `validation_file`. This field will be null if the failure was not parameter-specific.

  - `fine_tuned_model: string or null`

    The name of the fine-tuned model that is being created. The value will be null if the fine-tuning job is still running.

  - `finished_at: number or null`

    The Unix timestamp (in seconds) for when the fine-tuning job was finished. The value will be null if the fine-tuning job is still running.

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    The hyperparameters used for the fine-tuning job. This value will only be returned when running `supervised` jobs.

    - `batch_size: optional "auto" or number or null`

      Number of examples in each batch. A larger batch size means that model parameters
      are updated less frequently, but with lower variance.

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      Scaling factor for the learning rate. A smaller learning rate may be useful to avoid
      overfitting.

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      The number of epochs to train the model for. An epoch refers to one full cycle
      through the training dataset.

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    The base model that is being fine-tuned.

  - `object: "fine_tuning.job"`

    The object type, which is always "fine_tuning.job".

    - `"fine_tuning.job"`

  - `organization_id: string`

    The organization that owns the fine-tuning job.

  - `result_files: array of string`

    The compiled results file ID(s) for the fine-tuning job. You can retrieve the results with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `seed: number`

    The seed used for the fine-tuning job.

  - `status: "validating_files" or "queued" or "running" or 3 more`

    The current status of the fine-tuning job, which can be either `validating_files`, `queued`, `running`, `succeeded`, `failed`, or `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    The total number of billable tokens processed by this fine-tuning job. The value will be null if the fine-tuning job is still running.

  - `training_file: string`

    The file ID used for training. You can retrieve the training data with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `validation_file: string or null`

    The file ID used for validation. You can retrieve the validation results with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `estimated_finish: optional number or null`

    The Unix timestamp (in seconds) for when the fine-tuning job is estimated to finish. The value will be null if the fine-tuning job is not running.

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    A list of integrations to enable for this fine-tuning job.

    - `type: "wandb"`

      The type of the integration being enabled for the fine-tuning job

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      The settings for your integration with Weights and Biases. This payload specifies the project that
      metrics will be sent to. Optionally, you can set an explicit display name for your run, add tags
      to your run, and set a default entity (team, username, etc) to be associated with your run.

      - `project: string`

        The name of the project that the new run will be created under.

      - `entity: optional string or null`

        The entity to use for the run. This allows you to set the team or username of the WandB user that you would
        like associated with the run. If not set, the default entity for the registered WandB API key is used.

      - `name: optional string or null`

        A display name to set for the run. If not set, we will use the Job ID as the name.

      - `tags: optional array of string`

        A list of tags to be attached to the newly created run. These tags are passed through directly to WandB. Some
        default tags are generated by OpenAI: "openai/finetune", "openai/{base-model}", "openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `method: optional object { type, dpo, reinforcement, supervised }`

    The method used for fine-tuning.

    - `type: "supervised" or "dpo" or "reinforcement"`

      The type of method. Is either `supervised`, `dpo`, or `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      Configuration for the DPO fine-tuning method.

      - `hyperparameters: optional DpoHyperparameters`

        The hyperparameters used for the DPO fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          The beta value for the DPO method. A higher beta value will increase the weight of the penalty between the policy and reference model.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      Configuration for the reinforcement fine-tuning method.

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        The grader used for the fine-tuning job.

        - `StringCheckGrader object { input, name, operation, 2 more }`

          A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

          - `input: string`

            The input text. This may include template strings.

          - `name: string`

            The name of the grader.

          - `operation: "eq" or "ne" or "like" or "ilike"`

            The string check operation to perform. One of `eq`, `ne`, `like`, or `ilike`.

            - `"eq"`

            - `"ne"`

            - `"like"`

            - `"ilike"`

          - `reference: string`

            The reference text. This may include template strings.

          - `type: "string_check"`

            The object type, which is always `string_check`.

            - `"string_check"`

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          A TextSimilarityGrader object which grades text based on similarity metrics.

          - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

            The evaluation metric to use. One of `cosine`, `fuzzy_match`, `bleu`,
            `gleu`, `meteor`, `rouge_1`, `rouge_2`, `rouge_3`, `rouge_4`, `rouge_5`,
            or `rouge_l`.

            - `"cosine"`

            - `"fuzzy_match"`

            - `"bleu"`

            - `"gleu"`

            - `"meteor"`

            - `"rouge_1"`

            - `"rouge_2"`

            - `"rouge_3"`

            - `"rouge_4"`

            - `"rouge_5"`

            - `"rouge_l"`

          - `input: string`

            The text being graded.

          - `name: string`

            The name of the grader.

          - `reference: string`

            The text being graded against.

          - `type: "text_similarity"`

            The type of grader.

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          A PythonGrader object that runs a python script on the input.

          - `name: string`

            The name of the grader.

          - `source: string`

            The source code of the python script.

          - `type: "python"`

            The object type, which is always `python`.

            - `"python"`

          - `image_tag: optional string`

            The image tag to use for the python script.

        - `ScoreModelGrader object { input, model, name, 3 more }`

          A ScoreModelGrader object that uses a model to assign a score to the input.

          - `input: array of object { content, role, type }`

            The input messages evaluated by the grader. Supports text, output text, input image, and input audio content blocks, and may include template strings.

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

              - `TextInput = string`

                A text input to the model.

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                A text input to the model.

                - `text: string`

                  The text input to the model.

                - `type: "input_text"`

                  The type of the input item. Always `input_text`.

                  - `"input_text"`

                - `prompt_cache_breakpoint: optional object { mode }`

                  Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

                  - `mode: "explicit"`

                    The breakpoint mode. Always `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                A text output from the model.

                - `text: string`

                  The text output from the model.

                - `type: "output_text"`

                  The type of the output text. Always `output_text`.

                  - `"output_text"`

              - `InputImage object { image_url, type, detail }`

                An image input block used within EvalItem content arrays.

                - `image_url: string`

                  The URL of the image input.

                - `type: "input_image"`

                  The type of the image input. Always `input_image`.

                  - `"input_image"`

                - `detail: optional string`

                  The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                An audio input to the model.

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64-encoded audio data.

                  - `format: "mp3" or "wav"`

                    The format of the audio data. Currently supported formats are `mp3` and
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  The type of the input item. Always `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                A list of inputs, each of which may be either an input text, output text, input
                image, or input audio object.

                - `TextInput = string`

                  A text input to the model.

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  A text input to the model.

                - `OutputText object { text, type }`

                  A text output from the model.

                  - `text: string`

                    The text output from the model.

                  - `type: "output_text"`

                    The type of the output text. Always `output_text`.

                    - `"output_text"`

                - `InputImage object { image_url, type, detail }`

                  An image input block used within EvalItem content arrays.

                  - `image_url: string`

                    The URL of the image input.

                  - `type: "input_image"`

                    The type of the image input. Always `input_image`.

                    - `"input_image"`

                  - `detail: optional string`

                    The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  An audio input to the model.

            - `role: "user" or "assistant" or "system" or "developer"`

              The role of the message input. One of `user`, `assistant`, `system`, or
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              The type of the message input. Always `message`.

              - `"message"`

          - `model: string`

            The model to use for the evaluation.

          - `name: string`

            The name of the grader.

          - `type: "score_model"`

            The object type, which is always `score_model`.

            - `"score_model"`

          - `range: optional array of number`

            The range of the score. Defaults to `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            The sampling parameters for the model.

            - `max_completions_tokens: optional number or null`

              The maximum number of tokens the grader model may generate in its response.

            - `reasoning_effort: optional ReasoningEffort or null`

              Constrains effort on reasoning for reasoning models. Currently supported
              values are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`.
              Reducing reasoning effort can result in faster responses and fewer tokens
              used on reasoning in a response. Not all reasoning models support every
              value. See the
              [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
              for model-specific support.

              - `"none"`

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

            - `seed: optional number or null`

              A seed value to initialize the randomness, during sampling.

            - `temperature: optional number or null`

              A higher temperature increases randomness in the outputs.

            - `top_p: optional number or null`

              An alternative to temperature for nucleus sampling; 1.0 includes all tokens.

        - `MultiGrader object { calculate_output, graders, name, type }`

          A MultiGrader object combines the output of multiple graders to produce a single score.

          - `calculate_output: string`

            A formula to calculate the output based on grader results.

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

            - `StringCheckGrader object { input, name, operation, 2 more }`

              A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              A TextSimilarityGrader object which grades text based on similarity metrics.

            - `PythonGrader object { name, source, type, image_tag }`

              A PythonGrader object that runs a python script on the input.

            - `ScoreModelGrader object { input, model, name, 3 more }`

              A ScoreModelGrader object that uses a model to assign a score to the input.

            - `LabelModelGrader object { input, labels, model, 3 more }`

              A LabelModelGrader object which uses a model to assign labels to each item
              in the evaluation.

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

                  - `TextInput = string`

                    A text input to the model.

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    A text input to the model.

                  - `OutputText object { text, type }`

                    A text output from the model.

                    - `text: string`

                      The text output from the model.

                    - `type: "output_text"`

                      The type of the output text. Always `output_text`.

                      - `"output_text"`

                  - `InputImage object { image_url, type, detail }`

                    An image input block used within EvalItem content arrays.

                    - `image_url: string`

                      The URL of the image input.

                    - `type: "input_image"`

                      The type of the image input. Always `input_image`.

                      - `"input_image"`

                    - `detail: optional string`

                      The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    An audio input to the model.

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    A list of inputs, each of which may be either an input text, output text, input
                    image, or input audio object.

                - `role: "user" or "assistant" or "system" or "developer"`

                  The role of the message input. One of `user`, `assistant`, `system`, or
                  `developer`.

                  - `"user"`

                  - `"assistant"`

                  - `"system"`

                  - `"developer"`

                - `type: optional "message"`

                  The type of the message input. Always `message`.

                  - `"message"`

              - `labels: array of string`

                The labels to assign to each item in the evaluation.

              - `model: string`

                The model to use for the evaluation. Must support structured outputs.

              - `name: string`

                The name of the grader.

              - `passing_labels: array of string`

                The labels that indicate a passing result. Must be a subset of labels.

              - `type: "label_model"`

                The object type, which is always `label_model`.

                - `"label_model"`

          - `name: string`

            The name of the grader.

          - `type: "multi"`

            The object type, which is always `multi`.

            - `"multi"`

      - `hyperparameters: optional ReinforcementHyperparameters`

        The hyperparameters used for the reinforcement fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          Multiplier on amount of compute used for exploring search space during training.

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          The number of training steps between evaluation runs.

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_samples: optional "auto" or number`

          Number of evaluation samples to generate per training step.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

        - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

          Level of reasoning effort.

          - `"default"`

          - `"low"`

          - `"medium"`

          - `"high"`

    - `supervised: optional SupervisedMethod`

      Configuration for the supervised fine-tuning method.

      - `hyperparameters: optional SupervisedHyperparameters`

        The hyperparameters used for the fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

### Example

```http
curl https://api.openai.com/v1/fine_tuning/jobs/$FINE_TUNING_JOB_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "error": {
    "code": "code",
    "message": "message",
    "param": "param"
  },
  "fine_tuned_model": "fine_tuned_model",
  "finished_at": 0,
  "hyperparameters": {
    "batch_size": "auto",
    "learning_rate_multiplier": "auto",
    "n_epochs": "auto"
  },
  "model": "model",
  "object": "fine_tuning.job",
  "organization_id": "organization_id",
  "result_files": [
    "file-abc123"
  ],
  "seed": 0,
  "status": "validating_files",
  "trained_tokens": 0,
  "training_file": "training_file",
  "validation_file": "validation_file",
  "estimated_finish": 0,
  "integrations": [
    {
      "type": "wandb",
      "wandb": {
        "project": "my-wandb-project",
        "entity": "entity",
        "name": "name",
        "tags": [
          "custom-tag"
        ]
      }
    }
  ],
  "metadata": {
    "foo": "string"
  },
  "method": {
    "type": "supervised",
    "dpo": {
      "hyperparameters": {
        "batch_size": "auto",
        "beta": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    },
    "reinforcement": {
      "grader": {
        "input": "input",
        "name": "name",
        "operation": "eq",
        "reference": "reference",
        "type": "string_check"
      },
      "hyperparameters": {
        "batch_size": "auto",
        "compute_multiplier": "auto",
        "eval_interval": "auto",
        "eval_samples": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto",
        "reasoning_effort": "default"
      }
    },
    "supervised": {
      "hyperparameters": {
        "batch_size": "auto",
        "learning_rate_multiplier": "auto",
        "n_epochs": "auto"
      }
    }
  }
}
```

### Example

```http
curl https://api.openai.com/v1/fine_tuning/jobs/ft-AF1WoRqd3aJAHsqc9NY7iL8F \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "object": "fine_tuning.job",
  "id": "ftjob-abc123",
  "model": "davinci-002",
  "created_at": 1692661014,
  "finished_at": 1692661190,
  "fine_tuned_model": "ft:davinci-002:my-org:custom_suffix:7q8mpxmy",
  "organization_id": "org-123",
  "result_files": [
      "file-abc123"
  ],
  "status": "succeeded",
  "validation_file": null,
  "training_file": "file-abc123",
  "hyperparameters": {
      "n_epochs": 4,
      "batch_size": 1,
      "learning_rate_multiplier": 1.0
  },
  "trained_tokens": 5768,
  "integrations": [],
  "seed": 0,
  "estimated_finish": 0,
  "method": {
    "type": "supervised",
    "supervised": {
      "hyperparameters": {
        "n_epochs": 4,
        "batch_size": 1,
        "learning_rate_multiplier": 1.0
      }
    }
  }
}
```

## Domain Types

### Fine Tuning Job

- `FineTuningJob object { id, created_at, error, 16 more }`

  The `fine_tuning.job` object represents a fine-tuning job that has been created through the API.

  - `id: string`

    The object identifier, which can be referenced in the API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the fine-tuning job was created.

  - `error: object { code, message, param }  or null`

    For fine-tuning jobs that have `failed`, this will contain more information on the cause of the failure.

    - `code: string`

      A machine-readable error code.

    - `message: string`

      A human-readable error message.

    - `param: string or null`

      The parameter that was invalid, usually `training_file` or `validation_file`. This field will be null if the failure was not parameter-specific.

  - `fine_tuned_model: string or null`

    The name of the fine-tuned model that is being created. The value will be null if the fine-tuning job is still running.

  - `finished_at: number or null`

    The Unix timestamp (in seconds) for when the fine-tuning job was finished. The value will be null if the fine-tuning job is still running.

  - `hyperparameters: object { batch_size, learning_rate_multiplier, n_epochs }`

    The hyperparameters used for the fine-tuning job. This value will only be returned when running `supervised` jobs.

    - `batch_size: optional "auto" or number or null`

      Number of examples in each batch. A larger batch size means that model parameters
      are updated less frequently, but with lower variance.

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      Scaling factor for the learning rate. A smaller learning rate may be useful to avoid
      overfitting.

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      The number of epochs to train the model for. An epoch refers to one full cycle
      through the training dataset.

      - `"auto"`

        - `"auto"`

      - `number`

  - `model: string`

    The base model that is being fine-tuned.

  - `object: "fine_tuning.job"`

    The object type, which is always "fine_tuning.job".

    - `"fine_tuning.job"`

  - `organization_id: string`

    The organization that owns the fine-tuning job.

  - `result_files: array of string`

    The compiled results file ID(s) for the fine-tuning job. You can retrieve the results with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `seed: number`

    The seed used for the fine-tuning job.

  - `status: "validating_files" or "queued" or "running" or 3 more`

    The current status of the fine-tuning job, which can be either `validating_files`, `queued`, `running`, `succeeded`, `failed`, or `cancelled`.

    - `"validating_files"`

    - `"queued"`

    - `"running"`

    - `"succeeded"`

    - `"failed"`

    - `"cancelled"`

  - `trained_tokens: number or null`

    The total number of billable tokens processed by this fine-tuning job. The value will be null if the fine-tuning job is still running.

  - `training_file: string`

    The file ID used for training. You can retrieve the training data with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `validation_file: string or null`

    The file ID used for validation. You can retrieve the validation results with the [Files API](/docs/api-reference/files/retrieve-contents).

  - `estimated_finish: optional number or null`

    The Unix timestamp (in seconds) for when the fine-tuning job is estimated to finish. The value will be null if the fine-tuning job is not running.

  - `integrations: optional array of FineTuningJobWandbIntegrationObject or null`

    A list of integrations to enable for this fine-tuning job.

    - `type: "wandb"`

      The type of the integration being enabled for the fine-tuning job

      - `"wandb"`

    - `wandb: FineTuningJobWandbIntegration`

      The settings for your integration with Weights and Biases. This payload specifies the project that
      metrics will be sent to. Optionally, you can set an explicit display name for your run, add tags
      to your run, and set a default entity (team, username, etc) to be associated with your run.

      - `project: string`

        The name of the project that the new run will be created under.

      - `entity: optional string or null`

        The entity to use for the run. This allows you to set the team or username of the WandB user that you would
        like associated with the run. If not set, the default entity for the registered WandB API key is used.

      - `name: optional string or null`

        A display name to set for the run. If not set, we will use the Job ID as the name.

      - `tags: optional array of string`

        A list of tags to be attached to the newly created run. These tags are passed through directly to WandB. Some
        default tags are generated by OpenAI: "openai/finetune", "openai/{base-model}", "openai/{ftjob-abcdef}".

  - `metadata: optional Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `method: optional object { type, dpo, reinforcement, supervised }`

    The method used for fine-tuning.

    - `type: "supervised" or "dpo" or "reinforcement"`

      The type of method. Is either `supervised`, `dpo`, or `reinforcement`.

      - `"supervised"`

      - `"dpo"`

      - `"reinforcement"`

    - `dpo: optional DpoMethod`

      Configuration for the DPO fine-tuning method.

      - `hyperparameters: optional DpoHyperparameters`

        The hyperparameters used for the DPO fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `beta: optional "auto" or number`

          The beta value for the DPO method. A higher beta value will increase the weight of the penalty between the policy and reference model.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

    - `reinforcement: optional ReinforcementMethod`

      Configuration for the reinforcement fine-tuning method.

      - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        The grader used for the fine-tuning job.

        - `StringCheckGrader object { input, name, operation, 2 more }`

          A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

          - `input: string`

            The input text. This may include template strings.

          - `name: string`

            The name of the grader.

          - `operation: "eq" or "ne" or "like" or "ilike"`

            The string check operation to perform. One of `eq`, `ne`, `like`, or `ilike`.

            - `"eq"`

            - `"ne"`

            - `"like"`

            - `"ilike"`

          - `reference: string`

            The reference text. This may include template strings.

          - `type: "string_check"`

            The object type, which is always `string_check`.

            - `"string_check"`

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          A TextSimilarityGrader object which grades text based on similarity metrics.

          - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

            The evaluation metric to use. One of `cosine`, `fuzzy_match`, `bleu`,
            `gleu`, `meteor`, `rouge_1`, `rouge_2`, `rouge_3`, `rouge_4`, `rouge_5`,
            or `rouge_l`.

            - `"cosine"`

            - `"fuzzy_match"`

            - `"bleu"`

            - `"gleu"`

            - `"meteor"`

            - `"rouge_1"`

            - `"rouge_2"`

            - `"rouge_3"`

            - `"rouge_4"`

            - `"rouge_5"`

            - `"rouge_l"`

          - `input: string`

            The text being graded.

          - `name: string`

            The name of the grader.

          - `reference: string`

            The text being graded against.

          - `type: "text_similarity"`

            The type of grader.

            - `"text_similarity"`

        - `PythonGrader object { name, source, type, image_tag }`

          A PythonGrader object that runs a python script on the input.

          - `name: string`

            The name of the grader.

          - `source: string`

            The source code of the python script.

          - `type: "python"`

            The object type, which is always `python`.

            - `"python"`

          - `image_tag: optional string`

            The image tag to use for the python script.

        - `ScoreModelGrader object { input, model, name, 3 more }`

          A ScoreModelGrader object that uses a model to assign a score to the input.

          - `input: array of object { content, role, type }`

            The input messages evaluated by the grader. Supports text, output text, input image, and input audio content blocks, and may include template strings.

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

              - `TextInput = string`

                A text input to the model.

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                A text input to the model.

                - `text: string`

                  The text input to the model.

                - `type: "input_text"`

                  The type of the input item. Always `input_text`.

                  - `"input_text"`

                - `prompt_cache_breakpoint: optional object { mode }`

                  Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

                  - `mode: "explicit"`

                    The breakpoint mode. Always `explicit`.

                    - `"explicit"`

              - `OutputText object { text, type }`

                A text output from the model.

                - `text: string`

                  The text output from the model.

                - `type: "output_text"`

                  The type of the output text. Always `output_text`.

                  - `"output_text"`

              - `InputImage object { image_url, type, detail }`

                An image input block used within EvalItem content arrays.

                - `image_url: string`

                  The URL of the image input.

                - `type: "input_image"`

                  The type of the image input. Always `input_image`.

                  - `"input_image"`

                - `detail: optional string`

                  The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                An audio input to the model.

                - `input_audio: object { data, format }`

                  - `data: string`

                    Base64-encoded audio data.

                  - `format: "mp3" or "wav"`

                    The format of the audio data. Currently supported formats are `mp3` and
                    `wav`.

                    - `"mp3"`

                    - `"wav"`

                - `type: "input_audio"`

                  The type of the input item. Always `input_audio`.

                  - `"input_audio"`

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                A list of inputs, each of which may be either an input text, output text, input
                image, or input audio object.

                - `TextInput = string`

                  A text input to the model.

                - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                  A text input to the model.

                - `OutputText object { text, type }`

                  A text output from the model.

                  - `text: string`

                    The text output from the model.

                  - `type: "output_text"`

                    The type of the output text. Always `output_text`.

                    - `"output_text"`

                - `InputImage object { image_url, type, detail }`

                  An image input block used within EvalItem content arrays.

                  - `image_url: string`

                    The URL of the image input.

                  - `type: "input_image"`

                    The type of the image input. Always `input_image`.

                    - `"input_image"`

                  - `detail: optional string`

                    The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

                - `ResponseInputAudio object { input_audio, type }`

                  An audio input to the model.

            - `role: "user" or "assistant" or "system" or "developer"`

              The role of the message input. One of `user`, `assistant`, `system`, or
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              The type of the message input. Always `message`.

              - `"message"`

          - `model: string`

            The model to use for the evaluation.

          - `name: string`

            The name of the grader.

          - `type: "score_model"`

            The object type, which is always `score_model`.

            - `"score_model"`

          - `range: optional array of number`

            The range of the score. Defaults to `[0, 1]`.

          - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

            The sampling parameters for the model.

            - `max_completions_tokens: optional number or null`

              The maximum number of tokens the grader model may generate in its response.

            - `reasoning_effort: optional ReasoningEffort or null`

              Constrains effort on reasoning for reasoning models. Currently supported
              values are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`.
              Reducing reasoning effort can result in faster responses and fewer tokens
              used on reasoning in a response. Not all reasoning models support every
              value. See the
              [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
              for model-specific support.

              - `"none"`

              - `"minimal"`

              - `"low"`

              - `"medium"`

              - `"high"`

              - `"xhigh"`

              - `"max"`

            - `seed: optional number or null`

              A seed value to initialize the randomness, during sampling.

            - `temperature: optional number or null`

              A higher temperature increases randomness in the outputs.

            - `top_p: optional number or null`

              An alternative to temperature for nucleus sampling; 1.0 includes all tokens.

        - `MultiGrader object { calculate_output, graders, name, type }`

          A MultiGrader object combines the output of multiple graders to produce a single score.

          - `calculate_output: string`

            A formula to calculate the output based on grader results.

          - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

            A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

            - `StringCheckGrader object { input, name, operation, 2 more }`

              A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

            - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

              A TextSimilarityGrader object which grades text based on similarity metrics.

            - `PythonGrader object { name, source, type, image_tag }`

              A PythonGrader object that runs a python script on the input.

            - `ScoreModelGrader object { input, model, name, 3 more }`

              A ScoreModelGrader object that uses a model to assign a score to the input.

            - `LabelModelGrader object { input, labels, model, 3 more }`

              A LabelModelGrader object which uses a model to assign labels to each item
              in the evaluation.

              - `input: array of object { content, role, type }`

                - `content: string or ResponseInputText or object { text, type }  or 3 more`

                  Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

                  - `TextInput = string`

                    A text input to the model.

                  - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                    A text input to the model.

                  - `OutputText object { text, type }`

                    A text output from the model.

                    - `text: string`

                      The text output from the model.

                    - `type: "output_text"`

                      The type of the output text. Always `output_text`.

                      - `"output_text"`

                  - `InputImage object { image_url, type, detail }`

                    An image input block used within EvalItem content arrays.

                    - `image_url: string`

                      The URL of the image input.

                    - `type: "input_image"`

                      The type of the image input. Always `input_image`.

                      - `"input_image"`

                    - `detail: optional string`

                      The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

                  - `ResponseInputAudio object { input_audio, type }`

                    An audio input to the model.

                  - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                    A list of inputs, each of which may be either an input text, output text, input
                    image, or input audio object.

                - `role: "user" or "assistant" or "system" or "developer"`

                  The role of the message input. One of `user`, `assistant`, `system`, or
                  `developer`.

                  - `"user"`

                  - `"assistant"`

                  - `"system"`

                  - `"developer"`

                - `type: optional "message"`

                  The type of the message input. Always `message`.

                  - `"message"`

              - `labels: array of string`

                The labels to assign to each item in the evaluation.

              - `model: string`

                The model to use for the evaluation. Must support structured outputs.

              - `name: string`

                The name of the grader.

              - `passing_labels: array of string`

                The labels that indicate a passing result. Must be a subset of labels.

              - `type: "label_model"`

                The object type, which is always `label_model`.

                - `"label_model"`

          - `name: string`

            The name of the grader.

          - `type: "multi"`

            The object type, which is always `multi`.

            - `"multi"`

      - `hyperparameters: optional ReinforcementHyperparameters`

        The hyperparameters used for the reinforcement fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `compute_multiplier: optional "auto" or number`

          Multiplier on amount of compute used for exploring search space during training.

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_interval: optional "auto" or number`

          The number of training steps between evaluation runs.

          - `"auto"`

            - `"auto"`

          - `number`

        - `eval_samples: optional "auto" or number`

          Number of evaluation samples to generate per training step.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

        - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

          Level of reasoning effort.

          - `"default"`

          - `"low"`

          - `"medium"`

          - `"high"`

    - `supervised: optional SupervisedMethod`

      Configuration for the supervised fine-tuning method.

      - `hyperparameters: optional SupervisedHyperparameters`

        The hyperparameters used for the fine-tuning job.

        - `batch_size: optional "auto" or number`

          Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

          - `"auto"`

            - `"auto"`

          - `number`

        - `learning_rate_multiplier: optional "auto" or number`

          Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

          - `"auto"`

            - `"auto"`

          - `number`

        - `n_epochs: optional "auto" or number`

          The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

          - `"auto"`

            - `"auto"`

          - `number`

### Fine Tuning Job Event

- `FineTuningJobEvent object { id, created_at, level, 4 more }`

  Fine-tuning job event object

  - `id: string`

    The object identifier.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the fine-tuning job was created.

  - `level: "info" or "warn" or "error"`

    The log level of the event.

    - `"info"`

    - `"warn"`

    - `"error"`

  - `message: string`

    The message of the event.

  - `object: "fine_tuning.job.event"`

    The object type, which is always "fine_tuning.job.event".

    - `"fine_tuning.job.event"`

  - `data: optional unknown`

    The data associated with the event.

  - `type: optional "message" or "metrics"`

    The type of event.

    - `"message"`

    - `"metrics"`

### Fine Tuning Job Wandb Integration

- `FineTuningJobWandbIntegration object { project, entity, name, tags }`

  The settings for your integration with Weights and Biases. This payload specifies the project that
  metrics will be sent to. Optionally, you can set an explicit display name for your run, add tags
  to your run, and set a default entity (team, username, etc) to be associated with your run.

  - `project: string`

    The name of the project that the new run will be created under.

  - `entity: optional string or null`

    The entity to use for the run. This allows you to set the team or username of the WandB user that you would
    like associated with the run. If not set, the default entity for the registered WandB API key is used.

  - `name: optional string or null`

    A display name to set for the run. If not set, we will use the Job ID as the name.

  - `tags: optional array of string`

    A list of tags to be attached to the newly created run. These tags are passed through directly to WandB. Some
    default tags are generated by OpenAI: "openai/finetune", "openai/{base-model}", "openai/{ftjob-abcdef}".

### Fine Tuning Job Wandb Integration Object

- `FineTuningJobWandbIntegrationObject object { type, wandb }`

  - `type: "wandb"`

    The type of the integration being enabled for the fine-tuning job

    - `"wandb"`

  - `wandb: FineTuningJobWandbIntegration`

    The settings for your integration with Weights and Biases. This payload specifies the project that
    metrics will be sent to. Optionally, you can set an explicit display name for your run, add tags
    to your run, and set a default entity (team, username, etc) to be associated with your run.

    - `project: string`

      The name of the project that the new run will be created under.

    - `entity: optional string or null`

      The entity to use for the run. This allows you to set the team or username of the WandB user that you would
      like associated with the run. If not set, the default entity for the registered WandB API key is used.

    - `name: optional string or null`

      A display name to set for the run. If not set, we will use the Job ID as the name.

    - `tags: optional array of string`

      A list of tags to be attached to the newly created run. These tags are passed through directly to WandB. Some
      default tags are generated by OpenAI: "openai/finetune", "openai/{base-model}", "openai/{ftjob-abcdef}".

# Checkpoints

## List fine-tuning checkpoints

**get** `/fine_tuning/jobs/{fine_tuning_job_id}/checkpoints`

List checkpoints for a fine-tuning job.

### Path Parameters

- `fine_tuning_job_id: string`

### Query Parameters

- `after: optional string`

  Identifier for the last checkpoint ID from the previous pagination request.

- `limit: optional number`

  Number of checkpoints to retrieve.

### Returns

- `data: array of FineTuningJobCheckpoint`

  - `id: string`

    The checkpoint identifier, which can be referenced in the API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the checkpoint was created.

  - `fine_tuned_model_checkpoint: string`

    The name of the fine-tuned checkpoint model that is created.

  - `fine_tuning_job_id: string`

    The name of the fine-tuning job that this checkpoint was created from.

  - `metrics: object { full_valid_loss, full_valid_mean_token_accuracy, step, 4 more }`

    Metrics at the step number during the fine-tuning job.

    - `full_valid_loss: optional number`

    - `full_valid_mean_token_accuracy: optional number`

    - `step: optional number`

    - `train_loss: optional number`

    - `train_mean_token_accuracy: optional number`

    - `valid_loss: optional number`

    - `valid_mean_token_accuracy: optional number`

  - `object: "fine_tuning.job.checkpoint"`

    The object type, which is always "fine_tuning.job.checkpoint".

    - `"fine_tuning.job.checkpoint"`

  - `step_number: number`

    The step number that the checkpoint was created at.

- `has_more: boolean`

- `object: "list"`

  - `"list"`

- `first_id: optional string or null`

- `last_id: optional string or null`

### Example

```http
curl https://api.openai.com/v1/fine_tuning/jobs/$FINE_TUNING_JOB_ID/checkpoints \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "fine_tuned_model_checkpoint": "fine_tuned_model_checkpoint",
      "fine_tuning_job_id": "fine_tuning_job_id",
      "metrics": {
        "full_valid_loss": 0,
        "full_valid_mean_token_accuracy": 0,
        "step": 0,
        "train_loss": 0,
        "train_mean_token_accuracy": 0,
        "valid_loss": 0,
        "valid_mean_token_accuracy": 0
      },
      "object": "fine_tuning.job.checkpoint",
      "step_number": 0
    }
  ],
  "has_more": true,
  "object": "list",
  "first_id": "first_id",
  "last_id": "last_id"
}
```

### Example

```http
curl https://api.openai.com/v1/fine_tuning/jobs/ftjob-abc123/checkpoints \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "object": "list",
  "data": [
    {
      "object": "fine_tuning.job.checkpoint",
      "id": "ftckpt_zc4Q7MP6XxulcVzj4MZdwsAB",
      "created_at": 1721764867,
      "fine_tuned_model_checkpoint": "ft:gpt-4o-mini-2024-07-18:my-org:custom-suffix:96olL566:ckpt-step-2000",
      "metrics": {
        "full_valid_loss": 0.134,
        "full_valid_mean_token_accuracy": 0.874
      },
      "fine_tuning_job_id": "ftjob-abc123",
      "step_number": 2000
    },
    {
      "object": "fine_tuning.job.checkpoint",
      "id": "ftckpt_enQCFmOTGj3syEpYVhBRLTSy",
      "created_at": 1721764800,
      "fine_tuned_model_checkpoint": "ft:gpt-4o-mini-2024-07-18:my-org:custom-suffix:7q8mpxmy:ckpt-step-1000",
      "metrics": {
        "full_valid_loss": 0.167,
        "full_valid_mean_token_accuracy": 0.781
      },
      "fine_tuning_job_id": "ftjob-abc123",
      "step_number": 1000
    }
  ],
  "first_id": "ftckpt_zc4Q7MP6XxulcVzj4MZdwsAB",
  "last_id": "ftckpt_enQCFmOTGj3syEpYVhBRLTSy",
  "has_more": true
}
```

## Domain Types

### Fine Tuning Job Checkpoint

- `FineTuningJobCheckpoint object { id, created_at, fine_tuned_model_checkpoint, 4 more }`

  The `fine_tuning.job.checkpoint` object represents a model checkpoint for a fine-tuning job that is ready to use.

  - `id: string`

    The checkpoint identifier, which can be referenced in the API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the checkpoint was created.

  - `fine_tuned_model_checkpoint: string`

    The name of the fine-tuned checkpoint model that is created.

  - `fine_tuning_job_id: string`

    The name of the fine-tuning job that this checkpoint was created from.

  - `metrics: object { full_valid_loss, full_valid_mean_token_accuracy, step, 4 more }`

    Metrics at the step number during the fine-tuning job.

    - `full_valid_loss: optional number`

    - `full_valid_mean_token_accuracy: optional number`

    - `step: optional number`

    - `train_loss: optional number`

    - `train_mean_token_accuracy: optional number`

    - `valid_loss: optional number`

    - `valid_mean_token_accuracy: optional number`

  - `object: "fine_tuning.job.checkpoint"`

    The object type, which is always "fine_tuning.job.checkpoint".

    - `"fine_tuning.job.checkpoint"`

  - `step_number: number`

    The step number that the checkpoint was created at.

# Methods

## Domain Types

### Dpo Hyperparameters

- `DpoHyperparameters object { batch_size, beta, learning_rate_multiplier, n_epochs }`

  The hyperparameters used for the DPO fine-tuning job.

  - `batch_size: optional "auto" or number`

    Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

    - `"auto"`

      - `"auto"`

    - `number`

  - `beta: optional "auto" or number`

    The beta value for the DPO method. A higher beta value will increase the weight of the penalty between the policy and reference model.

    - `"auto"`

      - `"auto"`

    - `number`

  - `learning_rate_multiplier: optional "auto" or number`

    Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

    - `"auto"`

      - `"auto"`

    - `number`

  - `n_epochs: optional "auto" or number`

    The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

    - `"auto"`

      - `"auto"`

    - `number`

### Dpo Method

- `DpoMethod object { hyperparameters }`

  Configuration for the DPO fine-tuning method.

  - `hyperparameters: optional DpoHyperparameters`

    The hyperparameters used for the DPO fine-tuning job.

    - `batch_size: optional "auto" or number`

      Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

      - `"auto"`

        - `"auto"`

      - `number`

    - `beta: optional "auto" or number`

      The beta value for the DPO method. A higher beta value will increase the weight of the penalty between the policy and reference model.

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

      - `"auto"`

        - `"auto"`

      - `number`

### Reinforcement Hyperparameters

- `ReinforcementHyperparameters object { batch_size, compute_multiplier, eval_interval, 4 more }`

  The hyperparameters used for the reinforcement fine-tuning job.

  - `batch_size: optional "auto" or number`

    Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

    - `"auto"`

      - `"auto"`

    - `number`

  - `compute_multiplier: optional "auto" or number`

    Multiplier on amount of compute used for exploring search space during training.

    - `"auto"`

      - `"auto"`

    - `number`

  - `eval_interval: optional "auto" or number`

    The number of training steps between evaluation runs.

    - `"auto"`

      - `"auto"`

    - `number`

  - `eval_samples: optional "auto" or number`

    Number of evaluation samples to generate per training step.

    - `"auto"`

      - `"auto"`

    - `number`

  - `learning_rate_multiplier: optional "auto" or number`

    Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

    - `"auto"`

      - `"auto"`

    - `number`

  - `n_epochs: optional "auto" or number`

    The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

    - `"auto"`

      - `"auto"`

    - `number`

  - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

    Level of reasoning effort.

    - `"default"`

    - `"low"`

    - `"medium"`

    - `"high"`

### Reinforcement Method

- `ReinforcementMethod object { grader, hyperparameters }`

  Configuration for the reinforcement fine-tuning method.

  - `grader: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

    The grader used for the fine-tuning job.

    - `StringCheckGrader object { input, name, operation, 2 more }`

      A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

      - `input: string`

        The input text. This may include template strings.

      - `name: string`

        The name of the grader.

      - `operation: "eq" or "ne" or "like" or "ilike"`

        The string check operation to perform. One of `eq`, `ne`, `like`, or `ilike`.

        - `"eq"`

        - `"ne"`

        - `"like"`

        - `"ilike"`

      - `reference: string`

        The reference text. This may include template strings.

      - `type: "string_check"`

        The object type, which is always `string_check`.

        - `"string_check"`

    - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

      A TextSimilarityGrader object which grades text based on similarity metrics.

      - `evaluation_metric: "cosine" or "fuzzy_match" or "bleu" or 8 more`

        The evaluation metric to use. One of `cosine`, `fuzzy_match`, `bleu`,
        `gleu`, `meteor`, `rouge_1`, `rouge_2`, `rouge_3`, `rouge_4`, `rouge_5`,
        or `rouge_l`.

        - `"cosine"`

        - `"fuzzy_match"`

        - `"bleu"`

        - `"gleu"`

        - `"meteor"`

        - `"rouge_1"`

        - `"rouge_2"`

        - `"rouge_3"`

        - `"rouge_4"`

        - `"rouge_5"`

        - `"rouge_l"`

      - `input: string`

        The text being graded.

      - `name: string`

        The name of the grader.

      - `reference: string`

        The text being graded against.

      - `type: "text_similarity"`

        The type of grader.

        - `"text_similarity"`

    - `PythonGrader object { name, source, type, image_tag }`

      A PythonGrader object that runs a python script on the input.

      - `name: string`

        The name of the grader.

      - `source: string`

        The source code of the python script.

      - `type: "python"`

        The object type, which is always `python`.

        - `"python"`

      - `image_tag: optional string`

        The image tag to use for the python script.

    - `ScoreModelGrader object { input, model, name, 3 more }`

      A ScoreModelGrader object that uses a model to assign a score to the input.

      - `input: array of object { content, role, type }`

        The input messages evaluated by the grader. Supports text, output text, input image, and input audio content blocks, and may include template strings.

        - `content: string or ResponseInputText or object { text, type }  or 3 more`

          Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

          - `TextInput = string`

            A text input to the model.

          - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

            A text input to the model.

            - `text: string`

              The text input to the model.

            - `type: "input_text"`

              The type of the input item. Always `input_text`.

              - `"input_text"`

            - `prompt_cache_breakpoint: optional object { mode }`

              Marks the exact end of a reusable prompt prefix. The breakpoint inherits its TTL from the request's `prompt_cache_options.ttl`; the boundary is not rounded to a token block.

              - `mode: "explicit"`

                The breakpoint mode. Always `explicit`.

                - `"explicit"`

          - `OutputText object { text, type }`

            A text output from the model.

            - `text: string`

              The text output from the model.

            - `type: "output_text"`

              The type of the output text. Always `output_text`.

              - `"output_text"`

          - `InputImage object { image_url, type, detail }`

            An image input block used within EvalItem content arrays.

            - `image_url: string`

              The URL of the image input.

            - `type: "input_image"`

              The type of the image input. Always `input_image`.

              - `"input_image"`

            - `detail: optional string`

              The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

          - `ResponseInputAudio object { input_audio, type }`

            An audio input to the model.

            - `input_audio: object { data, format }`

              - `data: string`

                Base64-encoded audio data.

              - `format: "mp3" or "wav"`

                The format of the audio data. Currently supported formats are `mp3` and
                `wav`.

                - `"mp3"`

                - `"wav"`

            - `type: "input_audio"`

              The type of the input item. Always `input_audio`.

              - `"input_audio"`

          - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

            A list of inputs, each of which may be either an input text, output text, input
            image, or input audio object.

            - `TextInput = string`

              A text input to the model.

            - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

              A text input to the model.

            - `OutputText object { text, type }`

              A text output from the model.

              - `text: string`

                The text output from the model.

              - `type: "output_text"`

                The type of the output text. Always `output_text`.

                - `"output_text"`

            - `InputImage object { image_url, type, detail }`

              An image input block used within EvalItem content arrays.

              - `image_url: string`

                The URL of the image input.

              - `type: "input_image"`

                The type of the image input. Always `input_image`.

                - `"input_image"`

              - `detail: optional string`

                The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

            - `ResponseInputAudio object { input_audio, type }`

              An audio input to the model.

        - `role: "user" or "assistant" or "system" or "developer"`

          The role of the message input. One of `user`, `assistant`, `system`, or
          `developer`.

          - `"user"`

          - `"assistant"`

          - `"system"`

          - `"developer"`

        - `type: optional "message"`

          The type of the message input. Always `message`.

          - `"message"`

      - `model: string`

        The model to use for the evaluation.

      - `name: string`

        The name of the grader.

      - `type: "score_model"`

        The object type, which is always `score_model`.

        - `"score_model"`

      - `range: optional array of number`

        The range of the score. Defaults to `[0, 1]`.

      - `sampling_params: optional object { max_completions_tokens, reasoning_effort, seed, 2 more }`

        The sampling parameters for the model.

        - `max_completions_tokens: optional number or null`

          The maximum number of tokens the grader model may generate in its response.

        - `reasoning_effort: optional ReasoningEffort or null`

          Constrains effort on reasoning for reasoning models. Currently supported
          values are `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, and `max`.
          Reducing reasoning effort can result in faster responses and fewer tokens
          used on reasoning in a response. Not all reasoning models support every
          value. See the
          [reasoning guide](https://platform.openai.com/docs/guides/reasoning)
          for model-specific support.

          - `"none"`

          - `"minimal"`

          - `"low"`

          - `"medium"`

          - `"high"`

          - `"xhigh"`

          - `"max"`

        - `seed: optional number or null`

          A seed value to initialize the randomness, during sampling.

        - `temperature: optional number or null`

          A higher temperature increases randomness in the outputs.

        - `top_p: optional number or null`

          An alternative to temperature for nucleus sampling; 1.0 includes all tokens.

    - `MultiGrader object { calculate_output, graders, name, type }`

      A MultiGrader object combines the output of multiple graders to produce a single score.

      - `calculate_output: string`

        A formula to calculate the output based on grader results.

      - `graders: StringCheckGrader or TextSimilarityGrader or PythonGrader or 2 more`

        A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

        - `StringCheckGrader object { input, name, operation, 2 more }`

          A StringCheckGrader object that performs a string comparison between input and reference using a specified operation.

        - `TextSimilarityGrader object { evaluation_metric, input, name, 2 more }`

          A TextSimilarityGrader object which grades text based on similarity metrics.

        - `PythonGrader object { name, source, type, image_tag }`

          A PythonGrader object that runs a python script on the input.

        - `ScoreModelGrader object { input, model, name, 3 more }`

          A ScoreModelGrader object that uses a model to assign a score to the input.

        - `LabelModelGrader object { input, labels, model, 3 more }`

          A LabelModelGrader object which uses a model to assign labels to each item
          in the evaluation.

          - `input: array of object { content, role, type }`

            - `content: string or ResponseInputText or object { text, type }  or 3 more`

              Inputs to the model - can contain template strings. Supports text, output text, input images, and input audio, either as a single item or an array of items.

              - `TextInput = string`

                A text input to the model.

              - `ResponseInputText object { text, type, prompt_cache_breakpoint }`

                A text input to the model.

              - `OutputText object { text, type }`

                A text output from the model.

                - `text: string`

                  The text output from the model.

                - `type: "output_text"`

                  The type of the output text. Always `output_text`.

                  - `"output_text"`

              - `InputImage object { image_url, type, detail }`

                An image input block used within EvalItem content arrays.

                - `image_url: string`

                  The URL of the image input.

                - `type: "input_image"`

                  The type of the image input. Always `input_image`.

                  - `"input_image"`

                - `detail: optional string`

                  The detail level of the image to be sent to the model. One of `high`, `low`, or `auto`. Defaults to `auto`.

              - `ResponseInputAudio object { input_audio, type }`

                An audio input to the model.

              - `GraderInputs = array of string or ResponseInputText or object { text, type }  or 2 more`

                A list of inputs, each of which may be either an input text, output text, input
                image, or input audio object.

            - `role: "user" or "assistant" or "system" or "developer"`

              The role of the message input. One of `user`, `assistant`, `system`, or
              `developer`.

              - `"user"`

              - `"assistant"`

              - `"system"`

              - `"developer"`

            - `type: optional "message"`

              The type of the message input. Always `message`.

              - `"message"`

          - `labels: array of string`

            The labels to assign to each item in the evaluation.

          - `model: string`

            The model to use for the evaluation. Must support structured outputs.

          - `name: string`

            The name of the grader.

          - `passing_labels: array of string`

            The labels that indicate a passing result. Must be a subset of labels.

          - `type: "label_model"`

            The object type, which is always `label_model`.

            - `"label_model"`

      - `name: string`

        The name of the grader.

      - `type: "multi"`

        The object type, which is always `multi`.

        - `"multi"`

  - `hyperparameters: optional ReinforcementHyperparameters`

    The hyperparameters used for the reinforcement fine-tuning job.

    - `batch_size: optional "auto" or number`

      Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

      - `"auto"`

        - `"auto"`

      - `number`

    - `compute_multiplier: optional "auto" or number`

      Multiplier on amount of compute used for exploring search space during training.

      - `"auto"`

        - `"auto"`

      - `number`

    - `eval_interval: optional "auto" or number`

      The number of training steps between evaluation runs.

      - `"auto"`

        - `"auto"`

      - `number`

    - `eval_samples: optional "auto" or number`

      Number of evaluation samples to generate per training step.

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

      - `"auto"`

        - `"auto"`

      - `number`

    - `reasoning_effort: optional "default" or "low" or "medium" or "high"`

      Level of reasoning effort.

      - `"default"`

      - `"low"`

      - `"medium"`

      - `"high"`

### Supervised Hyperparameters

- `SupervisedHyperparameters object { batch_size, learning_rate_multiplier, n_epochs }`

  The hyperparameters used for the fine-tuning job.

  - `batch_size: optional "auto" or number`

    Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

    - `"auto"`

      - `"auto"`

    - `number`

  - `learning_rate_multiplier: optional "auto" or number`

    Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

    - `"auto"`

      - `"auto"`

    - `number`

  - `n_epochs: optional "auto" or number`

    The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

    - `"auto"`

      - `"auto"`

    - `number`

### Supervised Method

- `SupervisedMethod object { hyperparameters }`

  Configuration for the supervised fine-tuning method.

  - `hyperparameters: optional SupervisedHyperparameters`

    The hyperparameters used for the fine-tuning job.

    - `batch_size: optional "auto" or number`

      Number of examples in each batch. A larger batch size means that model parameters are updated less frequently, but with lower variance.

      - `"auto"`

        - `"auto"`

      - `number`

    - `learning_rate_multiplier: optional "auto" or number`

      Scaling factor for the learning rate. A smaller learning rate may be useful to avoid overfitting.

      - `"auto"`

        - `"auto"`

      - `number`

    - `n_epochs: optional "auto" or number`

      The number of epochs to train the model for. An epoch refers to one full cycle through the training dataset.

      - `"auto"`

        - `"auto"`

      - `number`
