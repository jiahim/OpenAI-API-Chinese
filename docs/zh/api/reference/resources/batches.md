# Batches

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 来获得。

## 取消批处理

**post** `/batches/{batch_id}/cancel`

取消正在进行中的批次。该批次将处于 status `cancelling` 状态最长 10 分钟，然后变为 `cancelled`，状态，届时输出文件中将提供部分结果（如果有）。

### 路径参数

- `batch_id: string`

### 返回

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批次应在此时间范围内完成处理。

  - `created_at: number`

    批次创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    该批次使用的 OpenAI API 端点。

  - `input_file_id: string`

    该批次输入文件的 ID。

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

  - `cancelled_at: optional number or null`

    批次被取消时的 Unix 时间戳（以秒为单位）。

  - `cancelling_at: optional number or null`

    批次开始取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: optional number or null`

    批次完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string or null`

    包含出错请求输出的文件 ID。

  - `errors: optional object { data, object }  or null`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        发生错误的输入文件的行号（如果适用）。

      - `message: optional string`

        提供有关错误详细信息的可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如果适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number or null`

    批次过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number or null`

    批次将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number or null`

    批次失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number or null`

    批次开始完成最终处理时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number or null`

    批次开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    可以附加到对象的 16 组键值对。可用于
    可用于以结构化格式存储有关对象的附加信息，
    并通过 API 或控制面板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批次的模型 ID，例如 `gpt-6-astra`。OpenAI
    提供了具有不同能力、性能特征和价格点的大量模型。请参阅
    模型 [模型
    指南](/api/docs/models) 以浏览和比较可用的模型。

  - `output_file_id: optional string or null`

    包含成功执行请求输出的文件的 ID。

  - `request_counts: optional BatchRequestCounts`

    该批次中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      批次中的请求总数。

  - `usage: optional BatchUsage`

    表示令牌使用详情，包括输入令牌、输出令牌、
    输出令牌的细分以及使用的总令牌。仅在 2025 年 9 月 7 日之后创建的批次上填充。
    2025 年 9 月 7 日之后创建的批次上填充。

    - `input_tokens: number`

      输入令牌的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入令牌的详细明细。

      - `cached_tokens: number`

        从缓存中检索到的令牌数量。 [详细了解
        提示缓存](/api/docs/guides/prompt-caching).

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
    "batch_description": "Nightly eval job"
  }
}
```

## 创建批处理

**post** `/batches`

从已上传的请求文件创建并执行批量任务

### Body Parameters

- `completion_window: "24h"`

  处理该批任务的时间窗口。目前仅支持 `24h` 。

  - `"24h"`

- `endpoint: "/v1/responses" or "/v1/chat/completions" or "/v1/embeddings" or 5 more`

  该批任务中所有请求所使用的端点。目前 `/v1/responses`, `/v1/chat/completions`, `/v1/embeddings`, `/v1/completions`, `/v1/moderations`, `/v1/images/generations`, `/v1/images/edits`，和 `/v1/videos` 受支持。请注意， `/v1/embeddings` 批任务在整个批的所有请求中最多包含 50,000 个嵌入输入。

  - `"/v1/responses"`

  - `"/v1/chat/completions"`

  - `"/v1/embeddings"`

  - `"/v1/completions"`

  - `"/v1/moderations"`

  - `"/v1/images/generations"`

  - `"/v1/images/edits"`

  - `"/v1/videos"`

- `input_file_id: string`

  已上传文件的 ID，其中包含用于新批任务的请求。

  请参阅 [upload file](/api/reference/resources/files/methods/create) 了解如何上传文件。

  你的输入文件必须格式化为 [JSONL file](/api/docs/guides/batch#1-prepare-your-batch-file)，并且必须使用用途 `batch`。上传。该文件最多可包含 50,000 个请求，大小可达 200 MB。

- `metadata: optional Metadata or null`

  可以附加到对象的 16 组键值对。可用于
  可用于以结构化格式存储有关对象的附加信息，
  并通过 API 或控制面板查询对象。

  键为字符串，最大长度为 64 个字符。值为字符串，
  最大长度为 512 个字符。

- `output_expires_after: optional object { anchor, seconds }`

  为批任务生成的输出文件和/或错误文件的过期策略。

  - `anchor: "created_at"`

    过期策略生效的锚定时间戳。支持以下锚点： `created_at`。请注意，锚点指的是文件创建时间，而非批任务的创建时间。

    - `"created_at"`

  - `seconds: number`

    文件在锚点时间之后过期的秒数。必须在 3600（1 小时）到 2592000（30 天）之间。

### 返回

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批次应在此时间范围内完成处理。

  - `created_at: number`

    批次创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    该批次使用的 OpenAI API 端点。

  - `input_file_id: string`

    该批次输入文件的 ID。

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

  - `cancelled_at: optional number or null`

    批次被取消时的 Unix 时间戳（以秒为单位）。

  - `cancelling_at: optional number or null`

    批次开始取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: optional number or null`

    批次完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string or null`

    包含出错请求输出的文件 ID。

  - `errors: optional object { data, object }  or null`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        发生错误的输入文件的行号（如果适用）。

      - `message: optional string`

        提供有关错误详细信息的可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如果适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number or null`

    批次过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number or null`

    批次将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number or null`

    批次失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number or null`

    批次开始完成最终处理时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number or null`

    批次开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    可以附加到对象的 16 组键值对。可用于
    可用于以结构化格式存储有关对象的附加信息，
    并通过 API 或控制面板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批次的模型 ID，例如 `gpt-6-astra`。OpenAI
    提供了具有不同能力、性能特征和价格点的大量模型。请参阅
    模型 [模型
    指南](/api/docs/models) 以浏览和比较可用的模型。

  - `output_file_id: optional string or null`

    包含成功执行请求输出的文件的 ID。

  - `request_counts: optional BatchRequestCounts`

    该批次中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      批次中的请求总数。

  - `usage: optional BatchUsage`

    表示令牌使用详情，包括输入令牌、输出令牌、
    输出令牌的细分以及使用的总令牌。仅在 2025 年 9 月 7 日之后创建的批次上填充。
    2025 年 9 月 7 日之后创建的批次上填充。

    - `input_tokens: number`

      输入令牌的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入令牌的详细明细。

      - `cached_tokens: number`

        从缓存中检索到的令牌数量。 [详细了解
        提示缓存](/api/docs/guides/prompt-caching).

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
    "batch_description": "Nightly eval job"
  }
}
```

## 列出批处理

**get** `/batches`

列出你所在组织的批次。

### 查询参数

- `after: optional string`

  用于分页查询的光标。 `after` 是一个对象 ID，用于指明你在列表中的位置。例如，如果你发起列表请求并收到 100 个对象，以 obj_foo 结尾，则后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `limit: optional number`

  限制要返回的对象数量。范围介于 1 到 100 之间，默认值为 20。

### 返回

- `data: array of Batch`

  - `id: string`

  - `completion_window: string`

    批次应在此时间范围内完成处理。

  - `created_at: number`

    批次创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    该批次使用的 OpenAI API 端点。

  - `input_file_id: string`

    该批次输入文件的 ID。

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

  - `cancelled_at: optional number or null`

    批次被取消时的 Unix 时间戳（以秒为单位）。

  - `cancelling_at: optional number or null`

    批次开始取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: optional number or null`

    批次完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string or null`

    包含出错请求输出的文件 ID。

  - `errors: optional object { data, object }  or null`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        发生错误的输入文件的行号（如果适用）。

      - `message: optional string`

        提供有关错误详细信息的可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如果适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number or null`

    批次过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number or null`

    批次将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number or null`

    批次失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number or null`

    批次开始完成最终处理时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number or null`

    批次开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    可以附加到对象的 16 组键值对。可用于
    可用于以结构化格式存储有关对象的附加信息，
    并通过 API 或控制面板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批次的模型 ID，例如 `gpt-6-astra`。OpenAI
    提供了具有不同能力、性能特征和价格点的大量模型。请参阅
    模型 [模型
    指南](/api/docs/models) 以浏览和比较可用的模型。

  - `output_file_id: optional string or null`

    包含成功执行请求输出的文件的 ID。

  - `request_counts: optional BatchRequestCounts`

    该批次中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      批次中的请求总数。

  - `usage: optional BatchUsage`

    表示令牌使用详情，包括输入令牌、输出令牌、
    输出令牌的细分以及使用的总令牌。仅在 2025 年 9 月 7 日之后创建的批次上填充。
    2025 年 9 月 7 日之后创建的批次上填充。

    - `input_tokens: number`

      输入令牌的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入令牌的详细明细。

      - `cached_tokens: number`

        从缓存中检索到的令牌数量。 [详细了解
        提示缓存](/api/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出令牌的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出令牌的详细明细。

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
        "batch_description": "Nightly job"
      }
    }
  ],
  "first_id": "batch_abc123",
  "last_id": "batch_abc123",
  "has_more": false
}
```

## Retrieve batch

**get** `/batches/{batch_id}`

检索一个批次。

### 路径参数

- `batch_id: string`

### 返回

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批次应在此时间范围内完成处理。

  - `created_at: number`

    批次创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    该批次使用的 OpenAI API 端点。

  - `input_file_id: string`

    该批次输入文件的 ID。

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

  - `cancelled_at: optional number or null`

    批次被取消时的 Unix 时间戳（以秒为单位）。

  - `cancelling_at: optional number or null`

    批次开始取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: optional number or null`

    批次完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string or null`

    包含出错请求输出的文件 ID。

  - `errors: optional object { data, object }  or null`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        发生错误的输入文件的行号（如果适用）。

      - `message: optional string`

        提供有关错误详细信息的可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如果适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number or null`

    批次过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number or null`

    批次将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number or null`

    批次失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number or null`

    批次开始完成最终处理时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number or null`

    批次开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    可以附加到对象的 16 组键值对。可用于
    可用于以结构化格式存储有关对象的附加信息，
    并通过 API 或控制面板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批次的模型 ID，例如 `gpt-6-astra`。OpenAI
    提供了具有不同能力、性能特征和价格点的大量模型。请参阅
    模型 [模型
    指南](/api/docs/models) 以浏览和比较可用的模型。

  - `output_file_id: optional string or null`

    包含成功执行请求输出的文件的 ID。

  - `request_counts: optional BatchRequestCounts`

    该批次中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      批次中的请求总数。

  - `usage: optional BatchUsage`

    表示令牌使用详情，包括输入令牌、输出令牌、
    输出令牌的细分以及使用的总令牌。仅在 2025 年 9 月 7 日之后创建的批次上填充。
    2025 年 9 月 7 日之后创建的批次上填充。

    - `input_tokens: number`

      输入令牌的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入令牌的详细明细。

      - `cached_tokens: number`

        从缓存中检索到的令牌数量。 [详细了解
        提示缓存](/api/docs/guides/prompt-caching).

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
    "batch_description": "Nightly eval job"
  }
}
```

## Domain Types

### Batch

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批次应在此时间范围内完成处理。

  - `created_at: number`

    批次创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    该批次使用的 OpenAI API 端点。

  - `input_file_id: string`

    该批次输入文件的 ID。

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

  - `cancelled_at: optional number or null`

    批次被取消时的 Unix 时间戳（以秒为单位）。

  - `cancelling_at: optional number or null`

    批次开始取消时的 Unix 时间戳（以秒为单位）。

  - `completed_at: optional number or null`

    批次完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string or null`

    包含出错请求输出的文件 ID。

  - `errors: optional object { data, object }  or null`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        发生错误的输入文件的行号（如果适用）。

      - `message: optional string`

        提供有关错误详细信息的可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如果适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number or null`

    批次过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number or null`

    批次将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number or null`

    批次失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number or null`

    批次开始完成最终处理时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number or null`

    批次开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    可以附加到对象的 16 组键值对。可用于
    可用于以结构化格式存储有关对象的附加信息，
    并通过 API 或控制面板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，
    最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批次的模型 ID，例如 `gpt-6-astra`。OpenAI
    提供了具有不同能力、性能特征和价格点的大量模型。请参阅
    模型 [模型
    指南](/api/docs/models) 以浏览和比较可用的模型。

  - `output_file_id: optional string or null`

    包含成功执行请求输出的文件的 ID。

  - `request_counts: optional BatchRequestCounts`

    该批次中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      批次中的请求总数。

  - `usage: optional BatchUsage`

    表示令牌使用详情，包括输入令牌、输出令牌、
    输出令牌的细分以及使用的总令牌。仅在 2025 年 9 月 7 日之后创建的批次上填充。
    2025 年 9 月 7 日之后创建的批次上填充。

    - `input_tokens: number`

      输入令牌的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入令牌的详细明细。

      - `cached_tokens: number`

        从缓存中检索到的令牌数量。 [详细了解
        提示缓存](/api/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出令牌的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出令牌的详细明细。

      - `reasoning_tokens: number`

        推理令牌的数量。

    - `total_tokens: number`

      使用的令牌总数。

### Batch Error

- `BatchError object { code, line, message, param }`

  - `code: optional string`

    用于标识错误类型的错误代码。

  - `line: optional number or null`

    发生错误的输入文件的行号（如果适用）。

  - `message: optional string`

    提供有关错误详细信息的可读消息。

  - `param: optional string or null`

    导致错误的参数名称（如果适用）。

### Batch Request Counts

- `BatchRequestCounts object { completed, failed, total }`

  该批次中不同状态的请求计数。

  - `completed: number`

    已成功完成的请求数量。

  - `failed: number`

    已失败的请求数量。

  - `total: number`

    批次中的请求总数。

### Batch Usage

- `BatchUsage object { input_tokens, input_tokens_details, output_tokens, 2 more }`

  表示令牌使用详情，包括输入令牌、输出令牌、
  输出令牌的细分以及使用的总令牌。仅在 2025 年 9 月 7 日之后创建的批次上填充。
  2025 年 9 月 7 日之后创建的批次上填充。

  - `input_tokens: number`

    输入令牌的数量。

  - `input_tokens_details: object { cached_tokens }`

    输入令牌的详细明细。

    - `cached_tokens: number`

      从缓存中检索到的令牌数量。 [详细了解
      提示缓存](/api/docs/guides/prompt-caching).

  - `output_tokens: number`

    输出令牌的数量。

  - `output_tokens_details: object { reasoning_tokens }`

    输出令牌的详细明细。

    - `reasoning_tokens: number`

      推理令牌的数量。

  - `total_tokens: number`

    使用的令牌总数。
