> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## 检索批次

**获取** `/batches/{batch_id}`

检索一个批次。

### 路径参数

- `batch_id: string`

### 返回

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批处理应被处理的时间范围。

  - `created_at: number`

    批处理创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    批处理使用的 OpenAI API 端点。

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

    批处理被取消时的 Unix 时间戳（以秒为单位）。

  - `cancelling_at: optional number`

    批处理开始取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: optional number`

    批处理完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string`

    包含出错请求输出的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        标识错误类型的错误代码。

      - `line: optional number or null`

        如果适用，输入文件中发生错误的行号。

      - `message: optional string`

        提供错误更多详情的人类可读消息。

      - `param: optional string or null`

        如果适用，导致错误的参数名称。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number`

    批处理过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number`

    批处理将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number`

    批处理失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number`

    批处理开始最终确定时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number`

    批处理开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    一组最多 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于该对象的额外信息，
    并可通过 API 或仪表盘查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理批次（batch）的模型 ID，例如 `gpt-5-2025-08-07`。OpenAI
    提供了多种具有不同能力、性能特性和价格点的模型。
    请参阅 [模型
    指南](/docs/models) 以浏览并比较可用模型。

  - `output_file_id: optional string`

    包含成功执行的请求输出的文件 ID。

  - `request_counts: optional BatchRequestCounts`

    批次中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      失败的请求数量。

    - `total: number`

      批次中的请求总数。

  - `usage: optional BatchUsage`

    表示令牌使用详情，包括输入令牌、输出令牌、
    输出令牌的细分以及所使用的令牌总数。仅在
    2025 年 9 月 7 日之后创建的批次中填充。

    - `input_tokens: number`

      输入令牌的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入令牌的详细分解。

      - `cached_tokens: number`

        从缓存中检索到的令牌数量。 [更多关于
        提示缓存](/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出令牌的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出令牌的详细分解。

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
