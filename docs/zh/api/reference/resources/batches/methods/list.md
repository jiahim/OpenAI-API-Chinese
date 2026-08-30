> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取该页面的 Markdown 版本。

## 列出批次

**get** `/batches`

列出你所在组织的批次。

### 查询参数

- `after: optional string`

  用于分页游标的对象 ID。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发起一次列表请求并收到 100 个对象，以 obj_foo 结尾，那么你的下一次调用可以在 after 参数中传入 obj_foo，以获取列表的下一页。

- `limit: optional number`

  返回对象数量的上限。范围为 1 到 100，默认值为 20。

### Returns

- `data: array of Batch`

  - `id: string`

  - `completion_window: string`

    批处理应在该时间范围内完成。

  - `created_at: number`

    批处理创建时的 Unix 时间戳（单位：秒）。

  - `endpoint: string`

    批处理所使用的 OpenAI API 端点。

  - `input_file_id: string`

    批处理输入文件的 ID。

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

    批处理被取消时的 Unix 时间戳（单位：秒）。

  - `cancelling_at: optional number`

    批处理开始取消时的 Unix 时间戳（单位：秒）。

  - `completed_at: optional number`

    批处理完成时的 Unix 时间戳（单位：秒）。

  - `error_file_id: optional string`

    包含出错请求输出内容的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        发生错误的输入文件行号（如果适用）。

      - `message: optional string`

        提供更多错误详情的人类可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如果适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number`

    批处理过期时的 Unix 时间戳（单位：秒）。

  - `expires_at: optional number`

    批处理将要过期的 Unix 时间戳（单位：秒）。

  - `failed_at: optional number`

    批处理失败时的 Unix 时间戳（单位：秒）。

  - `finalizing_at: optional number`

    批处理开始进入终态时的 Unix 时间戳（单位：秒）。

  - `in_progress_at: optional number`

    批处理开始处理时的 Unix 时间戳（单位：秒）。

  - `metadata: optional Metadata or null`

    可附加到对象的 16 组键值对。可用于
    用于以结构化方式存储有关对象的附加信息，
    并通过 API 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批次的模型 ID，例如 `gpt-5-2025-08-07`。OpenAI
    提供多种具有不同能力、性能
    特性和价格的模型。请参阅 [模型
    指南](/docs/models) 以浏览和比较可用的模型。

  - `output_file_id: optional string`

    包含成功执行的请求输出内容的文件 ID。

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
    输出令牌的细分以及所使用的总令牌。仅在
    2025-09-07 之后创建的批次上填充。

    - `input_tokens: number`

      输入令牌的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入令牌的详细分类统计。

      - `cached_tokens: number`

        从缓存中检索到的令牌数量。 [了解更多
        提示缓存](/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出令牌的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出令牌的详细分类统计。

      - `reasoning_tokens: number`

        推理令牌的数量。

    - `total_tokens: number`

      使用的令牌总数。

- `has_more: boolean`

- `object: "list"`

  - `"list"`

- `first_id: optional string`

- `last_id: optional string`

### 示例

```http
curl https://api.openai.com/v1/batches \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
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
  ],
  "has_more": true,
  "object": "list",
  "first_id": "batch_abc123",
  "last_id": "batch_abc456"
}
```

### 示例

```http
curl https://api.openai.com/v1/batches?limit=2 \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json"
```

#### Response

```json
{
  "object": "list",
  "data": [
    {
      "id": "batch_abc123",
      "object": "batch",
      "endpoint": "/v1/chat/completions",
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
        "batch_description": "Nightly job",
      }
    },
    { ... },
  ],
  "first_id": "batch_abc123",
  "last_id": "batch_abc456",
  "has_more": true
}
```
