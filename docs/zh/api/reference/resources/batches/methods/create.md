> 完整的文档索引，请参见 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 创建批次

**post** `/batches`

根据上传的请求文件创建并执行一个批次

### 正文参数

- `completion_window: "24h"`

  批次应处理的时间范围。目前仅支持 `24h` 。

  - `"24h"`

- `endpoint: "/v1/responses" or "/v1/chat/completions" or "/v1/embeddings" or 5 more`

  批次中所有请求使用的端点。目前支持 `/v1/responses`, `/v1/chat/completions`, `/v1/embeddings`, `/v1/completions`, `/v1/moderations`, `/v1/images/generations`, `/v1/images/edits`，和 `/v1/videos` 。请注意， `/v1/embeddings` 批次在所有请求中还限制为最多 50,000 个嵌入输入。

  - `"/v1/responses"`

  - `"/v1/chat/completions"`

  - `"/v1/embeddings"`

  - `"/v1/completions"`

  - `"/v1/moderations"`

  - `"/v1/images/generations"`

  - `"/v1/images/edits"`

  - `"/v1/videos"`

- `input_file_id: string`

  包含新批次请求的上传文件的 ID。

  参见 [上传文件](/docs/api-reference/files/create) 了解如何上传文件。

  你的输入文件必须格式化为 [JSONL 文件](/docs/api-reference/batch/request-input)，并且必须以上传目的 `batch`。上传。文件最多可包含 50,000 个请求，且大小可达 200 MB。

- `metadata: optional Metadata or null`

  可附加到对象上的 16 组键值对。这可用于
  以结构化格式存储有关对象的额外信息，
  并通过 API 或仪表板查询对象。

  键为字符串，最大长度为 64 个字符。值为字符串，
  最大长度为 512 个字符。

- `output_expires_after: optional object { anchor, seconds }`

  批次生成的输出文件和/或错误文件的过期策略。

  - `anchor: "created_at"`

    过期策略开始生效的锚点时间戳。支持的锚点： `created_at`。请注意，锚点是文件创建时间，而非批次创建时间。

    - `"created_at"`

  - `seconds: number`

    锚点时间之后文件过期的秒数。必须在 3600（1 小时）到 2592000（30 天）之间。

### 返回值

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批处理应处理的时间范围。

  - `created_at: number`

    批处理创建时的 Unix 时间戳（秒）。

  - `endpoint: string`

    批处理使用的OpenAI API端点。

  - `input_file_id: string`

    批处理的输入文件 ID。

  - `object: "batch"`

    对象类型，始终为 `batch`.

    - `"batch"`

  - `status: "validating" or "failed" or "in_progress" or 5 more`

    批处理的当前状态。

    - `"validating"`

    - `"failed"`

    - `"in_progress"`

    - `"finalizing"`

    - `"completed"`

    - `"expired"`

    - `"cancelling"`

    - `"cancelled"`

  - `cancelled_at: optional number`

    批处理取消时的 Unix 时间戳（秒）。

  - `cancelling_at: optional number`

    批处理开始取消时的 Unix 时间戳（秒）。

  - `completed_at: optional number`

    批处理完成时的 Unix 时间戳（秒）。

  - `error_file_id: optional string`

    包含出错请求输出的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        标识错误类型的错误代码。

      - `line: optional number or null`

        错误发生时输入文件的行号（如适用）。

      - `message: optional string`

        提供错误更多详细信息的人类可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number`

    批处理过期时的 Unix 时间戳（秒）。

  - `expires_at: optional number`

    批处理将过期时的 Unix 时间戳（秒）。

  - `failed_at: optional number`

    批处理失败时的 Unix 时间戳（秒）。

  - `finalizing_at: optional number`

    批处理开始定稿时的 Unix 时间戳（秒）。

  - `in_progress_at: optional number`

    批处理开始处理时的 Unix 时间戳（秒）。

  - `metadata: optional Metadata or null`

    一组最多 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储有关该对象的额外信息，
    并通过 API 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理批次的模型 ID，例如 `gpt-5-2025-08-07`。OpenAI
    提供多种具有不同能力、性能
    特性和价格点的模型。请参阅 [模型
    指南](/docs/models) 以浏览和比较可用的模型。

  - `output_file_id: optional string`

    包含成功执行请求输出的文件 ID。

  - `request_counts: optional BatchRequestCounts`

    批处理中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数。

    - `failed: number`

      失败的请求数。

    - `total: number`

      批处理中的请求总数。

  - `usage: optional BatchUsage`

    表示令牌使用详情，包括输入令牌、输出令牌、输出令牌的
    明细以及使用的总令牌数。仅在
    2025 年 9 月 7 日之后创建的批次中填充。

    - `input_tokens: number`

      输入 token 的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入 token 的详细细分。

      - `cached_tokens: number`

        从缓存中检索到的 token 数量。 [更多信息见
        提示缓存](/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出 token 的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出 token 的详细细分。

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
