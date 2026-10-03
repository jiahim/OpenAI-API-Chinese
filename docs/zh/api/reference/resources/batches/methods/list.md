> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## 列出批处理任务

**get** `/batches`

列出你所在组织的批次。

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发起列表请求并收到 100 个对象，以 obj_foo 结尾，则后续调用可以在 after=obj_foo 以获取列表的下一页。

- `limit: optional number`

  返回对象数量的上限。Limit 范围在 1 到 100 之间，默认为 20。

### Returns

- `data: array of Batch`

  - `id: string`

  - `completion_window: string`

    批量应在该时间范围内被处理。

  - `created_at: number`

    批量创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    批量使用的 OpenAI API 端点。

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

  - `cancelled_at: optional number or null`

    批量被取消时的 Unix 时间戳（以秒为单位）。

  - `cancelling_at: optional number or null`

    批量开始取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: optional number or null`

    批量完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string or null`

    包含出错请求输出的文件 ID。

  - `errors: optional object { data, object }  or null`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        输入文件中发生错误的行号（如果适用）。

      - `message: optional string`

        提供错误详情的人类可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如果适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number or null`

    批量过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number or null`

    批量将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number or null`

    批量失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number or null`

    批量开始进入终态时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number or null`

    批量开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    可附加到对象的 16 组键值对。可用于
    用于以结构化格式存储对象的附加信息
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批次的模型 ID，例如 `gpt-6-astra`. OpenAI
    提供涵盖不同能力、性能
    特性与价位区间的大量模型。请参阅 [模型
    指南](/api/docs/models) 以浏览和比较可用的模型。

  - `output_file_id: optional string or null`

    包含成功执行请求输出内容的文件 ID。

  - `request_counts: optional BatchRequestCounts`

    批次中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      批次中的请求总数。

  - `usage: optional BatchUsage`

    表示 token 使用详情，包括输入 token、输出 token
    输出 token 的细分以及使用的 token 总数。仅在
    2025 年 9 月 7 日之后创建的批次上填充。

    - `input_tokens: number`

      输入 token 的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入令牌的详细分解。

      - `cached_tokens: number`

        从缓存中检索到的令牌数量。 [了解更多
        提示缓存](/api/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出 token 的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出 token 的详细分类。

      - `reasoning_tokens: number`

        推理 token 的数量。

    - `total_tokens: number`

      使用的 token 总数。

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
        "batch_description": "Nightly job"
      }
    }
  ],
  "first_id": "batch_abc123",
  "last_id": "batch_abc123",
  "has_more": false
}
```
