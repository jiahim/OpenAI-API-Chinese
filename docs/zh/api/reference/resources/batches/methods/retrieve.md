> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## Retrieve batch

**get** `/batches/{batch_id}`

检索批次。

### 路径参数

- `batch_id: string`

### 返回

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批处理应当被处理的时间窗口。

  - `created_at: number`

    批处理创建时的 Unix 时间戳（单位为秒）。

  - `endpoint: string`

    批处理所使用的 OpenAI API 端点。

  - `input_file_id: string`

    批处理的输入文件 ID。

  - `object: "batch"`

    对象类型，恒为 `batch`.

    - `"batch"`

  - `status: "validating" or "failed" or "in_progress" or 5 more`

    批处理当前的状态。

    - `"validating"`

    - `"failed"`

    - `"in_progress"`

    - `"finalizing"`

    - `"completed"`

    - `"expired"`

    - `"cancelling"`

    - `"cancelled"`

  - `cancelled_at: optional number`

    批处理被取消时的 Unix 时间戳（单位为秒）。

  - `cancelling_at: optional number`

    批处理开始取消时的 Unix 时间戳（单位为秒）。

  - `completed_at: optional number`

    批处理完成时的 Unix 时间戳（单位为秒）。

  - `error_file_id: optional string`

    包含出错请求输出的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        发生错误的输入文件行号（若适用）。

      - `message: optional string`

        提供更多错误细节的人类可读消息。

      - `param: optional string or null`

        导致错误的参数名称（若适用）。

    - `object: optional string`

      对象类型，恒为 `list`.

  - `expired_at: optional number`

    批处理过期时的 Unix 时间戳（单位为秒）。

  - `expires_at: optional number`

    批处理即将过期时的 Unix 时间戳（单位为秒）。

  - `failed_at: optional number`

    批处理失败时的 Unix 时间戳（单位为秒）。

  - `finalizing_at: optional number`

    批处理开始完成时的 Unix 时间戳（单位为秒）。

  - `in_progress_at: optional number`

    批处理开始处理时的 Unix 时间戳（单位为秒）。

  - `metadata: optional Metadata or null`

    可以附加到对象的 16 组键值对。可用于
    用于以结构化格式存储对象的附加信息，
    并通过 API 或控制台查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批次的模型 ID，例如 `gpt-6-astra`。OpenAI
    提供多种不同能力、性能特征和价格的模型。
    请参阅 [模型
    指南](/api/docs/models) 以浏览和比较可用模型。

  - `output_file_id: optional string`

    包含已成功执行的请求输出文件的 ID。

  - `request_counts: optional BatchRequestCounts`

    该批次中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数。

    - `failed: number`

      已失败的请求数。

    - `total: number`

      该批次中的请求总数。

  - `usage: optional BatchUsage`

    表示 token 使用详情，包括输入 token、输出 token、
    输出 token 的细分以及使用的 token 总数。仅在
    2025 年 9 月 7 日之后创建的批次中填充。

    - `input_tokens: number`

      输入 token 的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入令牌的详细分类。

      - `cached_tokens: number`

        从缓存中检索到的令牌数量。 [了解更多
        提示词缓存](/api/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出 token 的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出 token 的详细分类。

      - `reasoning_tokens: number`

        推理 token 的数量。

    - `total_tokens: number`

      使用的 token 总数。

### 示例

```http
curl https://api.openai.com/v1/batches/$BATCH_ID \
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

### 示例

```http
curl https://api.openai.com/v1/batches/batch_abc123 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
```

#### Response

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
