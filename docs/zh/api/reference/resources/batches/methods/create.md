> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取该页面的 Markdown 版本。

## Create batch

**post** `/batches`

根据已上传的请求文件创建并执行批次

### 请求体参数

- `completion_window: "24h"`

  批量任务应在此时间窗口内被处理。目前仅支持 `24h` 。

  - `"24h"`

- `endpoint: "/v1/responses" or "/v1/chat/completions" or "/v1/embeddings" or 5 more`

  批量中所有请求所使用的端点。目前支持 `/v1/responses`, `/v1/chat/completions`, `/v1/embeddings`, `/v1/completions`, `/v1/moderations`, `/v1/images/generations`, `/v1/images/edits`，和 `/v1/videos` 。请注意， `/v1/embeddings` 批量还限制批量中所有请求的嵌入输入总数不得超过 50,000 个。

  - `"/v1/responses"`

  - `"/v1/chat/completions"`

  - `"/v1/embeddings"`

  - `"/v1/completions"`

  - `"/v1/moderations"`

  - `"/v1/images/generations"`

  - `"/v1/images/edits"`

  - `"/v1/videos"`

- `input_file_id: string`

  已上传文件的 ID，其中包含新批量的请求。

  请参阅 [上传文件](/docs/api-reference/files/create) 了解如何上传文件。

  你的输入文件必须以 [JSONL 文件](/docs/api-reference/batch/request-input)，格式进行格式化，并且必须以用途 `batch`。进行上传。该文件最多可包含 50,000 个请求，文件大小可达 200 MB。

- `metadata: optional Metadata or null`

  可附加到对象的 16 个键值对集合。这可用于
  以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
  格式，以及通过 接口 或仪表板查询对象。

  键为字符串，最大长度为 64 个字符。值为字符串
  ，最大长度为 512 个字符。

- `output_expires_after: optional object { anchor, seconds }`

  为批量生成的输出文件和/或错误文件的过期策略。

  - `anchor: "created_at"`

    过期策略所基于的锚点时间戳。支持以下锚点： `created_at`。请注意，该锚点是文件创建时间，而不是批处理任务的创建时间。

    - `"created_at"`

  - `seconds: number`

    锚点时间之后文件过期的秒数。必须介于 3600（1 小时）到 2592000（30 天）之间。

### Returns

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

    该批量的当前状态。

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

    批量已完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string`

    包含出错请求输出的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        如适用，错误发生时输入文件中的行号。

      - `message: optional string`

        提供有关错误更多详情的人工可读消息。

      - `param: optional string or null`

        如适用，导致该错误的参数名称。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number`

    批量已过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number`

    批量将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number`

    批量失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number`

    批量开始完成时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number`

    批量开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对集合。这可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。
    格式，以及通过 接口 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串
    ，最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批量的模型 ID，例如 `gpt-5-2025-08-07`。OpenAI
    提供多种不同能力、性能
    特性和价位的模型。请参阅 [模型
    指南](/docs/models) 以浏览和比较可用的模型。

  - `output_file_id: optional string`

    包含已成功执行请求输出内容的文件 ID。

  - `request_counts: optional BatchRequestCounts`

    该批次中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      该批次中的请求总数。

  - `usage: optional BatchUsage`

    表示令牌使用详情，包括输入令牌、输出令牌、
    输出令牌的细分以及使用的令牌总数。仅在
    2025 年 9 月 7 日之后创建的批次上填充。

    - `input_tokens: number`

      输入令牌的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入令牌的详细细分。

      - `cached_tokens: number`

        从缓存中检索到的令牌数量。 [详细了解
        提示缓存](/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出令牌的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出 token 的详细明细。

      - `reasoning_tokens: number`

        推理 token 的数量。

    - `total_tokens: number`

      使用的 token 总数。

### 示例

```http
curl https://api.openai.com/v1/batches \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "completion_window": "24h",
          "endpoint": "/v1/responses",
          "input_file_id": "input_file_id"
        }'
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
curl https://api.openai.com/v1/batches \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input_file_id": "file-abc123",
    "endpoint": "/v1/chat/completions",
    "completion_window": "24h"
  }'
```

#### 响应

```json
{
  "id": "batch_abc123",
  "object": "batch",
  "endpoint": "/v1/chat/completions",
  "errors": null,
  "input_file_id": "file-abc123",
  "completion_window": "24h",
  "status": "validating",
  "output_file_id": null,
  "error_file_id": null,
  "created_at": 1711471533,
  "in_progress_at": null,
  "expires_at": null,
  "finalizing_at": null,
  "completed_at": null,
  "failed_at": null,
  "expired_at": null,
  "cancelling_at": null,
  "cancelled_at": null,
  "request_counts": {
    "total": 0,
    "completed": 0,
    "failed": 0
  },
  "metadata": {
    "customer_id": "user_123456789",
    "batch_description": "Nightly eval job",
  }
}
```
