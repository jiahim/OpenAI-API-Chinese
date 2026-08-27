# 批量

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 取消批次

**post** `/batches/{batch_id}/cancel`

取消进行中的批次。批次将保持 `cancelling` 状态最多 10 分钟，然后变为 `cancelled`，在此状态下，输出文件中可获取部分结果（如果有）。

### 路径参数

- `batch_id: string`

### 返回

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批处理应在该时间范围内进行处理。

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

    批处理取消时的 Unix 时间戳（以秒为单位）。

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

        错误发生时输入文件的行号（如适用）。

      - `message: optional string`

        提供有关错误更多详细信息的人类可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如适用）。

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

    可附加到对象上的 16 组键值对。这可用于
    以结构化格式存储关于该对象的额外信息，
    并通过 API 或控制面板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理批次的模型 ID，例如 `gpt-5-2025-08-07`。OpenAI
    提供多种具有不同能力、性能特点
    和价格点的模型。请参阅 [模型
    指南](/docs/models) 以浏览和比较可用模型。

  - `output_file_id: optional string`

    包含成功执行请求输出的文件 ID。

  - `request_counts: optional BatchRequestCounts`

    批次中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数。

    - `failed: number`

      已失败的请求数。

    - `total: number`

      批次中的请求总数。

  - `usage: optional BatchUsage`

    表示令牌使用详情，包括输入令牌、输出令牌、
    输出令牌的明细以及使用的令牌总数。仅填补于
    2025 年 9 月 7 日之后创建的批次。

    - `input_tokens: number`

      输入令牌数。

    - `input_tokens_details: object { cached_tokens }`

      输入令牌的详细细分。

      - `cached_tokens: number`

        从缓存中检索的令牌数。 [更多信息
        提示缓存](/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出令牌数。

    - `output_tokens_details: object { reasoning_tokens }`

      输出令牌的详细细分。

      - `reasoning_tokens: number`

        推理令牌数。

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

## 创建批次

**post** `/batches`

根据上传的请求文件创建并执行一个批次

### 正文参数

- `completion_window: "24h"`

  批处理应被处理的时间范围。目前仅支持 `24h` 。

  - `"24h"`

- `endpoint: "/v1/responses" or "/v1/chat/completions" or "/v1/embeddings" or 5 more`

  批处理中所有请求将使用的端点。目前支持 `/v1/responses`, `/v1/chat/completions`, `/v1/embeddings`, `/v1/completions`, `/v1/moderations`, `/v1/images/generations`, `/v1/images/edits`，以及 `/v1/videos` 。请注意， `/v1/embeddings` 批处理中的所有请求合计最多只能包含 50,000 个嵌入输入。

  - `"/v1/responses"`

  - `"/v1/chat/completions"`

  - `"/v1/embeddings"`

  - `"/v1/completions"`

  - `"/v1/moderations"`

  - `"/v1/images/generations"`

  - `"/v1/images/edits"`

  - `"/v1/videos"`

- `input_file_id: string`

  已上传文件的 ID，该文件包含新批处理的请求。

  请参阅 [上传文件](/docs/api-reference/files/create) 了解如何上传文件。

  你的输入文件必须格式化为 [JSONL 文件](/docs/api-reference/batch/request-input)，并且必须以上传目的 `batch`。进行上传。该文件最多可包含 50,000 个请求，大小可达 200 MB。

- `metadata: optional Metadata or null`

  一组 16 个键值对，可附加到对象上。这可以
  用于以结构化格式存储关于对象的附加信息，
  并通过 API 或仪表板查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串，
  最大长度为 512 个字符。

- `output_expires_after: optional object { anchor, seconds }`

  为批处理生成的输出文件和/或错误文件的过期策略。

  - `anchor: "created_at"`

    过期策略开始生效的锚点时间戳。支持的锚点： `created_at`。请注意，锚点是文件创建时间，而非批次创建时间。

    - `"created_at"`

  - `seconds: number`

    锚点时间之后文件过期的秒数。必须在 3600（1小时）到 2592000（30天）之间。

### 返回

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批次应在该时间范围内处理。

  - `created_at: number`

    批次创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    批次使用的 OpenAI API 端点。

  - `input_file_id: string`

    批次输入文件的 ID。

  - `object: "batch"`

    对象类型，始终为 `batch`.

    - `"batch"`

  - `status: "validating" or "failed" or "in_progress" or 5 more`

    批次的当前状态。

    - `"validating"`

    - `"failed"`

    - `"in_progress"`

    - `"finalizing"`

    - `"completed"`

    - `"expired"`

    - `"cancelling"`

    - `"cancelled"`

  - `cancelled_at: optional number`

    批次被取消时的 Unix 时间戳（以秒为单位）。

  - `cancelling_at: optional number`

    批次开始取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: optional number`

    批次完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string`

    包含出错请求输出内容的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        错误发生时输入文件中对应的行号（如适用）。

      - `message: optional string`

        提供有关错误更多详细信息的人类可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number`

    批次过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number`

    批次即将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number`

    批次失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number`

    批次开始定稿时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number`

    批次开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化方式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

  - `model: optional string`

    用于处理批次的模型 ID，如 `gpt-5-2025-08-07`。OpenAI
    提供多种模型，具有不同的功能、性能
    特征和价格点。请参阅 [模型
    指南](/docs/models) 以浏览和比较可用模型。

  - `output_file_id: optional string`

    包含成功执行请求输出的文件的 ID。

  - `request_counts: optional BatchRequestCounts`

    批次内不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      失败的请求数量。

    - `total: number`

      批次中的请求总数。

  - `usage: optional BatchUsage`

    表示令牌使用详情，包括输入令牌、输出令牌、输出令牌的
    细分以及使用的总令牌。仅在
    2025 年 9 月 7 日之后创建的批次中填充。

    - `input_tokens: number`

      输入 token 的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入 token 的详细分解。

      - `cached_tokens: number`

        从缓存中检索的 token 数量。 [更多关于
        提示缓存](/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出 token 的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出 token 的详细分解。

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

## 列出批次

**get** `/batches`

列出你所在组织的批次。

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出一个列表请求并收到 100 个对象，以 obj_foo 结尾，那么你随后的调用可以包含 after=obj_foo，以便获取列表的下一页。

- `limit: optional number`

  对返回对象数量的限制。限制范围可以在 1 到 100 之间，默认值为 20。

### 返回

- `data: array of Batch`

  - `id: string`

  - `completion_window: string`

    批处理应被处理的时间范围。

  - `created_at: number`

    批处理创建时的 Unix 时间戳（秒）。

  - `endpoint: string`

    批处理使用的 OpenAI API 端点。

  - `input_file_id: string`

    批处理的输入文件的 ID。

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

    批处理被取消时的 Unix 时间戳（秒）。

  - `cancelling_at: optional number`

    批处理开始取消时的 Unix 时间戳（秒）。

  - `completed_at: optional number`

    批处理完成时的 Unix 时间戳（秒）。

  - `error_file_id: optional string`

    包含请求错误输出的文件的 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        标识错误类型的错误代码。

      - `line: optional number or null`

        错误发生的输入文件行号（如适用）。

      - `message: optional string`

        提供有关错误的更多信息的人类可读消息。

      - `param: optional string or null`

        导致错误的参数的名称（如适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number`

    批处理过期时的 Unix 时间戳（秒）。

  - `expires_at: optional number`

    批处理将过期时的 Unix 时间戳（秒）。

  - `failed_at: optional number`

    批处理失败时的 Unix 时间戳（秒）。

  - `finalizing_at: optional number`

    批处理开始完成时的 Unix 时间戳（秒）。

  - `in_progress_at: optional number`

    批处理开始处理时的 Unix 时间戳（秒）。

  - `metadata: optional Metadata or null`

    可附加到对象上的 16 个键值对集合。这可用于
    以结构化格式存储有关该对象的附加信息，并可通过
    API 或仪表盘查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理批次的模型 ID，例如 `gpt-5-2025-08-07`。OpenAI
    提供多种具有不同能力、性能特征和价格点的模型。请参阅
    模型 [指南
    以浏览和比较可用模型。](/docs/models) 以浏览和比较可用模型。

  - `output_file_id: optional string`

    包含成功执行请求输出结果的文件 ID。

  - `request_counts: optional BatchRequestCounts`

    批次内不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      批次中的请求总数。

  - `usage: optional BatchUsage`

    表示令牌使用详情，包括输入令牌、输出令牌、输出令牌的细分以及使用的总令牌数。仅在
    2025 年 9 月 7 日之后创建的批次上填充。
    2025 年 9 月 7 日之后创建的批次上填充。

    - `input_tokens: number`

      输入令牌的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入令牌的详细分解。

      - `cached_tokens: number`

        从缓存中检索到的令牌数量。 [更多信息
        提示缓存](/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出令牌的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出令牌的详细分解。

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

## 检索批次

**get** `/batches/{batch_id}`

检索一个批次。

### 路径参数

- `batch_id: string`

### 返回值

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批处理应被处理的时间范围。

  - `created_at: number`

    批次创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    批次使用的 OpenAI API 端点。

  - `input_file_id: string`

    批次输入文件的 ID。

  - `object: "batch"`

    对象类型，始终为 `batch`.

    - `"batch"`

  - `status: "validating" or "failed" or "in_progress" or 5 more`

    批次的当前状态。

    - `"validating"`

    - `"failed"`

    - `"in_progress"`

    - `"finalizing"`

    - `"completed"`

    - `"expired"`

    - `"cancelling"`

    - `"cancelled"`

  - `cancelled_at: optional number`

    批次被取消时的 Unix 时间戳（以秒为单位）。

  - `cancelling_at: optional number`

    批次开始取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: optional number`

    批次完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string`

    包含错误请求输出的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        标识错误类型的错误代码。

      - `line: optional number or null`

        发生错误的输入文件行号，如果适用的话。

      - `message: optional string`

        提供关于错误的更多详细信息的人类可读消息。

      - `param: optional string or null`

        导致错误的参数名称，如果适用的话。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number`

    批次过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number`

    批次将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number`

    批次失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number`

    批次开始最终确定时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number`

    批次开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    一组最多 16 个键值对，可附加到对象上。这
    有助于以结构化格式存储有关该对象的额外信息，
    并可通过 API 或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理批次的模型 ID，例如 `gpt-5-2025-08-07`。OpenAI
    提供多种具有不同能力、性能
    特性和价格点的模型。请参阅 [模型
    指南](/docs/models) 以浏览和比较可用模型。

  - `output_file_id: optional string`

    包含成功执行请求输出的文件的 ID。

  - `request_counts: optional BatchRequestCounts`

    批次中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数。

    - `failed: number`

      失败的请求数。

    - `total: number`

      批次中的请求总数。

  - `usage: optional BatchUsage`

    表示令牌使用详情，包括输入令牌、输出令牌、输出令牌的
    细分以及使用的令牌总数。仅对 2025 年 9 月 7 日之后创建
    的批次填充。

    - `input_tokens: number`

      输入 token 的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入 token 的详细分类。

      - `cached_tokens: number`

        从缓存中检索的 token 数量。 [更多关于
        提示缓存](/docs/guides/prompt-caching).

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

## 域类型

### 批处理

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批次应在该时间范围内处理。

  - `created_at: number`

    批次创建时的 Unix 时间戳（秒）。

  - `endpoint: string`

    批次使用的 OpenAI API 端点。

  - `input_file_id: string`

    批次输入文件的 ID。

  - `object: "batch"`

    对象类型，始终为 `batch`.

    - `"batch"`

  - `status: "validating" or "failed" or "in_progress" or 5 more`

    批次的当前状态。

    - `"validating"`

    - `"failed"`

    - `"in_progress"`

    - `"finalizing"`

    - `"completed"`

    - `"expired"`

    - `"cancelling"`

    - `"cancelled"`

  - `cancelled_at: optional number`

    批次取消时的 Unix 时间戳（秒）。

  - `cancelling_at: optional number`

    批次开始取消时的 Unix 时间戳（秒）。

  - `completed_at: optional number`

    批次完成时的 Unix 时间戳（秒）。

  - `error_file_id: optional string`

    包含出错请求输出的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        标识错误类型的错误代码。

      - `line: optional number or null`

        错误发生时输入文件的行号（如适用）。

      - `message: optional string`

        提供错误更多细节的人类可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number`

    批次过期时的 Unix 时间戳（秒）。

  - `expires_at: optional number`

    批次将过期时的 Unix 时间戳（秒）。

  - `failed_at: optional number`

    批次失败时的 Unix 时间戳（秒）。

  - `finalizing_at: optional number`

    批次开始定稿时的 Unix 时间戳（秒）。

  - `in_progress_at: optional number`

    批次开始处理时的 Unix 时间戳（秒）。

  - `metadata: optional Metadata or null`

    可附加到对象上的 16 个键值对集合。这可以
    用于以结构化格式存储有关该对象的额外信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理批次的模型 ID，如 `gpt-5-2025-08-07`。OpenAI
    提供多种具有不同能力、性能和
    价格点的模型。请参阅 [模型
    指南](/docs/models) 浏览并比较可用模型。

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

    表示令牌使用详情，包括输入令牌、输出令牌、输出令牌的
    细分以及使用的总令牌数。仅在
    2025年9月7日之后创建的批次中填充。

    - `input_tokens: number`

      输入 token 的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入 token 的详细分解。

      - `cached_tokens: number`

        从缓存中检索的 token 数量。 [更多关于
        提示缓存](/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出 token 的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出 token 的详细分解。

      - `reasoning_tokens: number`

        推理 token 的数量。

    - `total_tokens: number`

      使用的 token 总数。

### 批处理错误

- `BatchError object { code, line, message, param }`

  - `code: optional string`

    标识错误类型的错误代码。

  - `line: optional number or null`

    发生错误的输入文件的行号（如适用）。

  - `message: optional string`

    提供有关错误的更多详细信息的人类可读消息。

  - `param: optional string or null`

    导致错误的参数名称（如适用）。

### 批量请求计数

- `BatchRequestCounts object { completed, failed, total }`

  批次中不同状态的请求计数。

  - `completed: number`

    已成功完成的请求数量。

  - `failed: number`

    已失败的请求数量。

  - `total: number`

    批次中的请求总数。

### 批量使用

- `BatchUsage object { input_tokens, input_tokens_details, output_tokens, 2 more }`

  表示令牌用量明细，包括输入令牌、输出令牌、
  输出令牌的拆分以及所用令牌总数。仅在
  2025年9月7日之后创建的批次中填充。

  - `input_tokens: number`

    输入令牌的数量。

  - `input_tokens_details: object { cached_tokens }`

    输入令牌的详细拆分。

    - `cached_tokens: number`

      从缓存中检索到的令牌数量。 [更多关于
      提示缓存](/docs/guides/prompt-caching).

  - `output_tokens: number`

    输出令牌的数量。

  - `output_tokens_details: object { reasoning_tokens }`

    输出令牌的详细拆分。

    - `reasoning_tokens: number`

      推理令牌的数量。

  - `total_tokens: number`

    所用令牌的总数。
