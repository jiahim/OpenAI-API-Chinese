> 完整的文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 列出批次

**get** `/batches`

列出你所在组织的批次。

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发起列表请求并收到 100 个对象，以 obj_foo 结尾，那么你可以在后续调用中包含 after=obj_foo 以获取列表的下一页。

- `limit: optional number`

  要返回的对象数量的上限。Limit 的取值范围为 1 到 100，默认值为 20。

### Returns

- `data: array of Batch`

  - `id: string`

  - `completion_window: string`

    处理该批次的时间窗口。

  - `created_at: number`

    该批次创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    该批次所使用的OpenAI API 端点。

  - `input_file_id: string`

    该批次的输入文件 ID。

  - `object: "batch"`

    对象类型，固定为 `batch`.

    - `"batch"`

  - `status: "validating" or "failed" or "in_progress" or 5 more`

    该批次当前的状态。

    - `"validating"`

    - `"failed"`

    - `"in_progress"`

    - `"finalizing"`

    - `"completed"`

    - `"expired"`

    - `"cancelling"`

    - `"cancelled"`

  - `cancelled_at: optional number`

    该批次被取消时的 Unix 时间戳（以秒为单位）。

  - `cancelling_at: optional number`

    该批次开始取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: optional number`

    该批次完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string`

    包含请求错误输出的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        发生错误的输入文件行号（如果适用）。

      - `message: optional string`

        提供有关错误更多详情的人类可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如果适用）。

    - `object: optional string`

      对象类型，固定为 `list`.

  - `expired_at: optional number`

    该批次过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number`

    该批次将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number`

    该批次失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number`

    该批次开始进入最终化阶段的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number`

    该批次开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    可附加到对象的 16 组键值对。可用于
    用于以结构化格式存储有关对象的附加信息，并通过 API 或控制台查询对象。
    格式，并通过 接口 或控制台查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批处理的模型 ID，例如 `gpt-6-astra`。OpenAI
    提供了一系列具有不同能力、性能
    特征和定价的模型。请参阅 [模型
    指南](/api/docs/models) 以浏览和比较可用的模型。

  - `output_file_id: optional string`

    包含已成功执行请求的输出文件的 ID。

  - `request_counts: optional BatchRequestCounts`

    批处理中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      批处理中的请求总数。

  - `usage: optional BatchUsage`

    表示令牌使用详情，包括输入令牌、输出令牌、
    输出令牌的细分以及所使用的令牌总数。仅在
    2025 年 9 月 7 日之后创建的批处理中填充。

    - `input_tokens: number`

      输入令牌的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入令牌的详细分类。

      - `cached_tokens: number`

        从缓存中检索到的令牌数量。 [详细了解
        prompt caching](/api/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出令牌的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出令牌的详细分类。

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

#### 响应

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

#### 响应

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
