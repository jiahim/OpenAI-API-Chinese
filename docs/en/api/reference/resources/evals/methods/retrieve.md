> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Get an eval

**get** `/evals/{eval_id}`

Get an evaluation by ID.

### Path Parameters

- `eval_id: string`

### Returns

- `id: string`

  Unique identifier for the evaluation.

- `created_at: number`

  The Unix timestamp (in seconds) for when the eval was created.

- `data_source_config: EvalCustomDataSourceConfig or object { schema, type, metadata }  or EvalStoredCompletionsDataSourceConfig`

  Configuration of data sources used in runs of the evaluation.

  - `EvalCustomDataSourceConfig object { schema, type }`

    A CustomDataSourceConfig which specifies the schema of your `item` and optionally `sample` namespaces.
    The response schema defines the shape of the data that will be:

    - Used to define your testing criteria and
    - What data is required when creating a run

    - `schema: map[unknown]`

      The json schema for the run data source items.
      Learn how to build JSON schemas [here](https://json-schema.org/).

    - `type: "custom"`

      The type of data source. Always `custom`.

      - `"custom"`

  - `LogsDataSourceConfig object { schema, type, metadata }`

    A LogsDataSourceConfig which specifies the metadata property of your logs query.
    This is usually metadata like `usecase=chatbot` or `prompt-version=v2`, etc.
    The schema returned by this data source config is used to defined what variables are available in your evals.
    `item` and `sample` are both defined when using this data source config.

    - `schema: map[unknown]`

      The json schema for the run data source items.
      Learn how to build JSON schemas [here](https://json-schema.org/).

    - `type: "logs"`

      The type of data source. Always `logs`.

      - `"logs"`

    - `metadata: optional Metadata or null`

      Set of 16 key-value pairs that can be attached to an object. This can be
      useful for storing additional information about the object in a structured
      format, and querying for objects via API or the dashboard.

      Keys are strings with a maximum length of 64 characters. Values are strings
      with a maximum length of 512 characters.

  - `EvalStoredCompletionsDataSourceConfig object { schema, type, metadata }`

    Deprecated in favor of LogsDataSourceConfig.

    - `schema: map[unknown]`

      The json schema for the run data source items.
      Learn how to build JSON schemas [here](https://json-schema.org/).

    - `type: "stored_completions"`

      The type of data source. Always `stored_completions`.

      - `"stored_completions"`

    - `metadata: optional Metadata or null`

      Set of 16 key-value pairs that can be attached to an object. This can be
      useful for storing additional information about the object in a structured
      format, and querying for objects via API or the dashboard.

      Keys are strings with a maximum length of 64 characters. Values are strings
      with a maximum length of 512 characters.

- `metadata: Metadata or null`

  Set of 16 key-value pairs that can be attached to an object. This can be
  useful for storing additional information about the object in a structured
  format, and querying for objects via API or the dashboard.

  Keys are strings with a maximum length of 64 characters. Values are strings
  with a maximum length of 512 characters.

- `name: string`

  The name of the evaluation.

- `object: "eval"`

  The object type.

  - `"eval"`

- `testing_criteria: array of LabelModelGrader or StringCheckGrader or TextSimilarityGrader or 2 more`

  A list of testing criteria.

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

  - `TextSimilarityGrader = TextSimilarityGrader`

    A TextSimilarityGrader object which grades text based on similarity metrics.

    - `pass_threshold: number`

      The threshold for the score.

  - `PythonGrader = PythonGrader`

    A PythonGrader object that runs a python script on the input.

    - `pass_threshold: optional number`

      The threshold for the score.

  - `ScoreModelGrader = ScoreModelGrader`

    A ScoreModelGrader object that uses a model to assign a score to the input.

    - `pass_threshold: optional number`

      The threshold for the score.

### Example

```http
curl https://api.openai.com/v1/evals/$EVAL_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "data_source_config": {
    "schema": {
      "foo": "bar"
    },
    "type": "custom"
  },
  "metadata": {
    "foo": "string"
  },
  "name": "Chatbot effectiveness Evaluation",
  "object": "eval",
  "testing_criteria": [
    {
      "input": [
        {
          "content": "string",
          "role": "user",
          "type": "message"
        }
      ],
      "labels": [
        "string"
      ],
      "model": "model",
      "name": "name",
      "passing_labels": [
        "string"
      ],
      "type": "label_model"
    }
  ]
}
```

### Example

```http
curl https://api.openai.com/v1/evals/eval_67abd54d9b0081909a86353f6fb9317a \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### Response

```json
{
  "object": "eval",
  "id": "eval_67abd54d9b0081909a86353f6fb9317a",
  "data_source_config": {
    "type": "custom",
    "schema": {
      "type": "object",
      "properties": {
        "item": {
          "type": "object",
          "properties": {
            "input": {
              "type": "string"
            },
            "ground_truth": {
              "type": "string"
            }
          },
          "required": [
            "input",
            "ground_truth"
          ]
        }
      },
      "required": [
        "item"
      ]
    }
  },
  "testing_criteria": [
    {
      "name": "String check",
      "id": "String check-2eaf2d8d-d649-4335-8148-9535a7ca73c2",
      "type": "string_check",
      "input": "{{item.input}}",
      "reference": "{{item.ground_truth}}",
      "operation": "eq"
    }
  ],
  "name": "External Data Eval",
  "created_at": 1739314509,
  "metadata": {},
}
```
