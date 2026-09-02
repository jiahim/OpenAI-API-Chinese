> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## 取消批处理

**post** `/batches/{batch_id}/cancel`

取消正在进行的批量任务。批量任务将处于 `cancelling` 状态最长 10 分钟，然后变为 `cancelled`，状态，届时其输出文件中将提供部分结果（如果有）。

### 路径参数

- `batch_id: string`

### 返回值

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    应在该时间窗口内处理该批量任务。

  - `created_at: number`

    批量任务创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    该批量任务所使用的 OpenAI API 端点。

  - `input_file_id: string`

    该批量任务的输入文件 ID。

  - `object: "batch"`

    对象类型，始终为 `batch`.

    - `"batch"`

  - `status: "validating" or "failed" or "in_progress" or 5 more`

    该批量任务的当前状态。

    - `"validating"`

    - `"failed"`

    - `"in_progress"`

    - `"finalizing"`

    - `"completed"`

    - `"expired"`

    - `"cancelling"`

    - `"cancelled"`

  - `cancelled_at: optional number`

    批量任务被取消时的 Unix 时间戳（以秒为单位）。

  - `cancelling_at: optional number`

    批量任务开始取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: optional number`

    批量任务完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string`

    包含出错请求输出的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        发生错误的输入文件行号（如果适用）。

      - `message: optional string`

        提供有关错误更多详情的人工可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如果适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number`

    批量任务过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number`

    批量任务将要过期的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number`

    批量任务失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number`

    批量任务开始终态化时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number`

    批量任务开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    可附加到对象的 16 个键值对。这可以
    可用于以结构化格式存储关于对象的附加信息，并通过 API 或仪表板查询对象。
    通过 接口 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，最大长度为 512 个字符。
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批次的模型 ID，例如 `gpt-5.6-sol`。OpenAI
    提供了多种具有不同能力、性能特征和定价的模型。请参阅
    模型 [指南
    指南](/docs/models) 以浏览和比较可用的模型。

  - `output_file_id: optional string`

    包含已成功执行请求输出的文件的 ID。

  - `request_counts: optional BatchRequestCounts`

    该批次中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      该批次中的请求总数。

  - `usage: optional BatchUsage`

    表示 token 使用详情，包括输入 token、输出 token、输出 token 的细分以及使用的总 token。仅在
    总 token。仅在 2025 年 9 月 7 日之后创建的批次上填充。
    2025 年 9 月 7 日之后创建的批次上填充。

    - `input_tokens: number`

      输入 token 的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入令牌的详细明细。

      - `cached_tokens: number`

        从缓存中检索到的令牌数量。 [了解更多
        提示缓存](/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出令牌的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出令牌的详细明细。

      - `reasoning_tokens: number`

        推理令牌的数量。

    - `total_tokens: number`

      使用的令牌总数。

### 示例

```http
curl https://api.openai.com/v1/batches/$BATCH_ID/cancel \
    -X POST \
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
curl https://api.openai.com/v1/batches/batch_abc123/cancel \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -X POST
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
