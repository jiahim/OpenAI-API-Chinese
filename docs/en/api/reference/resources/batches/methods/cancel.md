> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Cancel batch

**post** `/batches/{batch_id}/cancel`

Cancels an in-progress batch. The batch will be in status `cancelling` for up to 10 minutes, before changing to `cancelled`, where it will have partial results (if any) available in the output file.

### Path Parameters

- `batch_id: string`

### Returns

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    The time frame within which the batch should be processed.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the batch was created.

  - `endpoint: string`

    The OpenAI API endpoint used by the batch.

  - `input_file_id: string`

    The ID of the input file for the batch.

  - `object: "batch"`

    The object type, which is always `batch`.

    - `"batch"`

  - `status: "validating" or "failed" or "in_progress" or 5 more`

    The current status of the batch.

    - `"validating"`

    - `"failed"`

    - `"in_progress"`

    - `"finalizing"`

    - `"completed"`

    - `"expired"`

    - `"cancelling"`

    - `"cancelled"`

  - `cancelled_at: optional number`

    The Unix timestamp (in seconds) for when the batch was cancelled.

  - `cancelling_at: optional number`

    The Unix timestamp (in seconds) for when the batch started cancelling.

  - `completed_at: optional number`

    The Unix timestamp (in seconds) for when the batch was completed.

  - `error_file_id: optional string`

    The ID of the file containing the outputs of requests with errors.

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        An error code identifying the error type.

      - `line: optional number or null`

        The line number of the input file where the error occurred, if applicable.

      - `message: optional string`

        A human-readable message providing more details about the error.

      - `param: optional string or null`

        The name of the parameter that caused the error, if applicable.

    - `object: optional string`

      The object type, which is always `list`.

  - `expired_at: optional number`

    The Unix timestamp (in seconds) for when the batch expired.

  - `expires_at: optional number`

    The Unix timestamp (in seconds) for when the batch will expire.

  - `failed_at: optional number`

    The Unix timestamp (in seconds) for when the batch failed.

  - `finalizing_at: optional number`

    The Unix timestamp (in seconds) for when the batch started finalizing.

  - `in_progress_at: optional number`

    The Unix timestamp (in seconds) for when the batch started processing.

  - `metadata: optional Metadata or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `model: optional string`

    Model ID used to process the batch, like `gpt-5-2025-08-07`. OpenAI
    offers a wide range of models with different capabilities, performance
    characteristics, and price points. Refer to the [model
    guide](/docs/models) to browse and compare available models.

  - `output_file_id: optional string`

    The ID of the file containing the outputs of successfully executed requests.

  - `request_counts: optional BatchRequestCounts`

    The request counts for different statuses within the batch.

    - `completed: number`

      Number of requests that have been completed successfully.

    - `failed: number`

      Number of requests that have failed.

    - `total: number`

      Total number of requests in the batch.

  - `usage: optional BatchUsage`

    Represents token usage details including input tokens, output tokens, a
    breakdown of output tokens, and the total tokens used. Only populated on
    batches created after September 7, 2025.

    - `input_tokens: number`

      The number of input tokens.

    - `input_tokens_details: object { cached_tokens }`

      A detailed breakdown of the input tokens.

      - `cached_tokens: number`

        The number of tokens that were retrieved from the cache. [More on
        prompt caching](/docs/guides/prompt-caching).

    - `output_tokens: number`

      The number of output tokens.

    - `output_tokens_details: object { reasoning_tokens }`

      A detailed breakdown of the output tokens.

      - `reasoning_tokens: number`

        The number of reasoning tokens.

    - `total_tokens: number`

      The total number of tokens used.

### Example

```http
curl https://api.openai.com/v1/batches/$BATCH_ID/cancel \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "completion_window": "completion_window",
  "created_at": 0,
  "endpoint": "endpoint",
  "input_file_id": "input_file_id",
  "object": "batch",
  "status": "validating",
  "cancelled_at": 0,
  "cancelling_at": 0,
  "completed_at": 0,
  "error_file_id": "error_file_id",
  "errors": {
    "data": [
      {
        "code": "code",
        "line": 0,
        "message": "message",
        "param": "param"
      }
    ],
    "object": "object"
  },
  "expired_at": 0,
  "expires_at": 0,
  "failed_at": 0,
  "finalizing_at": 0,
  "in_progress_at": 0,
  "metadata": {
    "foo": "string"
  },
  "model": "model",
  "output_file_id": "output_file_id",
  "request_counts": {
    "completed": 0,
    "failed": 0,
    "total": 0
  },
  "usage": {
    "input_tokens": 0,
    "input_tokens_details": {
      "cached_tokens": 0
    },
    "output_tokens": 0,
    "output_tokens_details": {
      "reasoning_tokens": 0
    },
    "total_tokens": 0
  }
}
```

### Example

```http
curl https://api.openai.com/v1/batches/batch_abc123/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -X POST
```

#### Response

```json
{
  "id": "batch_abc123",
  "object": "batch",
  "endpoint": "/v1/chat/completions",
  "errors": null,
  "input_file_id": "file-abc123",
  "completion_window": "24h",
  "status": "cancelling",
  "output_file_id": null,
  "error_file_id": null,
  "created_at": 1711471533,
  "in_progress_at": 1711471538,
  "expires_at": 1711557933,
  "finalizing_at": null,
  "completed_at": null,
  "failed_at": null,
  "expired_at": null,
  "cancelling_at": 1711475133,
  "cancelled_at": null,
  "request_counts": {
    "total": 100,
    "completed": 23,
    "failed": 1
  },
  "metadata": {
    "customer_id": "user_123456789",
    "batch_description": "Nightly eval job",
  }
}
```
