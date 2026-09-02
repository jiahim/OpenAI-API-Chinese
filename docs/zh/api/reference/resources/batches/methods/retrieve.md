> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

## Retrieve batch

**get** `/batches/{batch_id}`

检索一个批次。

### 路径参数

- `batch_id: string`

### 返回值

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批量应在此时间范围内被处理。

  - `created_at: number`

    批量创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    该批量所使用的 OpenAI API 端点。

  - `input_file_id: string`

    该批量的输入文件 ID。

  - `object: "batch"`

    对象类型，始终为 `batch`.

    - `"batch"`

  - `status: "validating" or "failed" or "in_progress" or 5 more`

    批量当前的状态。

    - `"validating"`

    - `"failed"`

    - `"in_progress"`

    - `"finalizing"`

    - `"completed"`

    - `"expired"`

    - `"cancelling"`

    - `"cancelled"`

  - `cancelled_at: optional number`

    批量被取消时的 Unix 时间戳（以秒为单位）。

  - `cancelling_at: optional number`

    批量开始取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: optional number`

    批量完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string`

    包含请求出错时所产生输出的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        发生错误的输入文件行号（如果适用）。

      - `message: optional string`

        提供有关该错误更多详细信息的人类可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如果适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number`

    批量过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number`

    批量将要过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number`

    批量失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number`

    批量开始进入最终完成阶段时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number`

    批量开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对集合。可用于
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard.

    Keys are strings with a maximum length of 64 characters. Values are strings
    with a maximum length of 512 characters.

  - `model: optional string`

    Model ID used to process the batch, like `gpt-5.6-sol`. OpenAI
    offers a wide range of models with different capabilities, performance
    characteristics, and price points. Refer to the [model
    guide](/docs/models) to browse and compare available models.

  - `output_file_id: optional string`

    包含成功执行请求输出内容的文件 ID。

  - `request_counts: optional BatchRequestCounts`

    该批次中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      该批次中的请求总数。

  - `usage: optional BatchUsage`

    Represents token usage details including input tokens, output tokens, a
    breakdown of output tokens, and the total tokens used. Only populated on
    batches created after September 7, 2025.

    - `input_tokens: number`

      输入 token 数量。

    - `input_tokens_details: object { cached_tokens }`

      输入令牌的详细分类。

      - `cached_tokens: number`

        从缓存中检索到的令牌数量。 [了解更多
        提示词缓存](/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出令牌的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出令牌的详细分类。

      - `reasoning_tokens: number`

        推理令牌的数量。

    - `total_tokens: number`

      使用的令牌总数。

### 示例

```http
curl https://api.openai.com/v1/batches/$BATCH_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

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

### 示例

```http
curl https://api.openai.com/v1/batches/batch_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
```

#### 响应

```json
{
  "id": "batch_abc123",
  "object": "batch",
  "endpoint": "/v1/completions",
  "errors": null,
  "input_file_id": "file-abc123",
  "completion_window": "24h",
  "status": "completed",
  "output_file_id": "file-cvaTdG",
  "error_file_id": "file-HOWS94",
  "created_at": 1711471533,
  "in_progress_at": 1711471538,
  "expires_at": 1711557933,
  "finalizing_at": 1711493133,
  "completed_at": 1711493163,
  "failed_at": null,
  "expired_at": null,
  "cancelling_at": null,
  "cancelled_at": null,
  "request_counts": {
    "total": 100,
    "completed": 95,
    "failed": 5
  },
  "metadata": {
    "customer_id": "user_123456789",
    "batch_description": "Nightly eval job",
  }
}
```
