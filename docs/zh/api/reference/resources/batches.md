# Batches

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

## Cancel batch

**post** `/batches/{batch_id}/cancel`

取消正在进行的批量任务。该批量的状态将变为 `cancelling` ，持续最多 10 分钟，然后变为 `cancelled`，此时输出文件中将提供部分结果（如果有）。

### 路径参数

- `batch_id: string`

### 返回

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批量应在该时间范围内被处理。

  - `created_at: number`

    批量创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    批量所使用的 OpenAI API 端点。

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

    批量完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string`

    包含出错请求输出内容的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        错误在输入文件中发生的行号（如果适用）。

      - `message: optional string`

        提供关于该错误更多细节的人类可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如果适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number`

    批量过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number`

    批量将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number`

    批量失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number`

    批量开始完成时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number`

    批量开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    可以附加到对象的 16 个键值对的集合。这可以
    用于以结构化格式存储对象的附加信息
    ，并通过 API 或控制台查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批处理的模型 ID，例如 `gpt-6-astra`。OpenAI
    提供了一系列具有不同能力、性能特性和价格点的模型。请参阅
    [模型 [模型
    指南](/api/docs/models) ](#) 以浏览和比较可用的模型。

  - `output_file_id: optional string`

    包含成功执行请求输出的文件 ID。

  - `request_counts: optional BatchRequestCounts`

    该批处理中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      该批处理中的请求总数。

  - `usage: optional BatchUsage`

    表示 token 使用情况详细信息，包括输入 token、输出 token
    的细分以及使用的 token 总数。仅在
    2025 年 9 月 7 日之后创建的批处理中填充。

    - `input_tokens: number`

      输入 token 的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入 token 的详细明细。

      - `cached_tokens: number`

        从缓存中检索到的 token 数量。 [更多相关内容
        提示缓存](/api/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出 token 的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出 token 的详细明细。

      - `reasoning_tokens: number`

        推理 token 的数量。

    - `total_tokens: number`

      使用的 token 总数。

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

## 创建批量任务

**post** `/batches`

根据已上传的请求文件创建并执行批量任务

### 请求体参数

- `completion_window: "24h"`

  批次应在该时间窗口内完成处理。当前仅支持 `24h` 。

  - `"24h"`

- `endpoint: "/v1/responses" or "/v1/chat/completions" or "/v1/embeddings" or 5 more`

  批次中所有请求所使用的端点。当前 `/v1/responses`, `/v1/chat/completions`, `/v1/embeddings`, `/v1/completions`, `/v1/moderations`, `/v1/images/generations`, `/v1/images/edits`，和 `/v1/videos` 受支持。请注意， `/v1/embeddings` 批次还限制整个批次中嵌入输入总数最多为 50,000 个。

  - `"/v1/responses"`

  - `"/v1/chat/completions"`

  - `"/v1/embeddings"`

  - `"/v1/completions"`

  - `"/v1/moderations"`

  - `"/v1/images/generations"`

  - `"/v1/images/edits"`

  - `"/v1/videos"`

- `input_file_id: string`

  已上传文件的 ID，其中包含新批次的请求。

  参见 [上传文件](/api/reference/resources/files/methods/create) 了解如何上传文件。

  输入文件必须按 [JSONL 文件](/api/docs/guides/batch#1-prepare-your-batch-file)，格式进行格式化，并且必须以 `batch`。用途上传。该文件最多可包含 50,000 个请求，大小可达 200 MB。

- `metadata: optional Metadata or null`

  可以附加到对象的 16 个键值对的集合。这可以
  用于以结构化格式存储对象的附加信息
  ，并通过 API 或控制台查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串
  ，最大长度为 512 个字符。

- `output_expires_after: optional object { anchor, seconds }`

  为批次生成输出文件和/或错误文件的过期策略。

  - `anchor: "created_at"`

    应用过期策略的锚定时间戳。支持的时间锚点： `created_at`。请注意，时间锚点为文件创建时间，而非批次创建时间。

    - `"created_at"`

  - `seconds: number`

    在该锚定时间之后文件过期的秒数。必须介于 3600（1 小时）到 2592000（30 天）之间。

### 返回

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批量应在该时间范围内被处理。

  - `created_at: number`

    批量创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    批量所使用的 OpenAI API 端点。

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

    批量完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string`

    包含出错请求输出内容的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        错误在输入文件中发生的行号（如果适用）。

      - `message: optional string`

        提供关于该错误更多细节的人类可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如果适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number`

    批量过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number`

    批量将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number`

    批量失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number`

    批量开始完成时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number`

    批量开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    可以附加到对象的 16 个键值对的集合。这可以
    用于以结构化格式存储对象的附加信息
    ，并通过 API 或控制台查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批处理的模型 ID，例如 `gpt-6-astra`。OpenAI
    提供了一系列具有不同能力、性能特性和价格点的模型。请参阅
    [模型 [模型
    指南](/api/docs/models) ](#) 以浏览和比较可用的模型。

  - `output_file_id: optional string`

    包含成功执行请求输出的文件 ID。

  - `request_counts: optional BatchRequestCounts`

    该批处理中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      该批处理中的请求总数。

  - `usage: optional BatchUsage`

    表示 token 使用情况详细信息，包括输入 token、输出 token
    的细分以及使用的 token 总数。仅在
    2025 年 9 月 7 日之后创建的批处理中填充。

    - `input_tokens: number`

      输入 token 的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入 token 的详细明细。

      - `cached_tokens: number`

        从缓存中检索到的 token 数量。 [更多相关内容
        提示缓存](/api/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出 token 的数量。

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
    "batch_description": "Nightly eval job"
  }
}
```

## 列出批量任务

**get** `/batches`

列出你所在组织的批量任务。

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中所处的位置。例如，如果你发起列表请求并收到 100 个对象，以 obj_foo 结尾，则后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `limit: optional number`

  返回对象数量的上限。Limit 的范围为 1 到 100，默认值为 20。

### 返回

- `data: array of Batch`

  - `id: string`

  - `completion_window: string`

    批量应在该时间范围内被处理。

  - `created_at: number`

    批量创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    批量所使用的 OpenAI API 端点。

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

    批量完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string`

    包含出错请求输出内容的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        错误在输入文件中发生的行号（如果适用）。

      - `message: optional string`

        提供关于该错误更多细节的人类可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如果适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number`

    批量过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number`

    批量将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number`

    批量失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number`

    批量开始完成时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number`

    批量开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    可以附加到对象的 16 个键值对的集合。这可以
    用于以结构化格式存储对象的附加信息
    ，并通过 API 或控制台查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批处理的模型 ID，例如 `gpt-6-astra`。OpenAI
    提供了一系列具有不同能力、性能特性和价格点的模型。请参阅
    [模型 [模型
    指南](/api/docs/models) ](#) 以浏览和比较可用的模型。

  - `output_file_id: optional string`

    包含成功执行请求输出的文件 ID。

  - `request_counts: optional BatchRequestCounts`

    该批处理中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      该批处理中的请求总数。

  - `usage: optional BatchUsage`

    表示 token 使用情况详细信息，包括输入 token、输出 token
    的细分以及使用的 token 总数。仅在
    2025 年 9 月 7 日之后创建的批处理中填充。

    - `input_tokens: number`

      输入 token 的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入 token 的详细明细。

      - `cached_tokens: number`

        从缓存中检索到的 token 数量。 [更多相关内容
        提示缓存](/api/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出 token 的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出 token 的详细明细。

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

### 返回

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批量应在该时间范围内被处理。

  - `created_at: number`

    批量创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    批量所使用的 OpenAI API 端点。

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

    批量完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string`

    包含出错请求输出内容的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        错误在输入文件中发生的行号（如果适用）。

      - `message: optional string`

        提供关于该错误更多细节的人类可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如果适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number`

    批量过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number`

    批量将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number`

    批量失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number`

    批量开始完成时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number`

    批量开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    可以附加到对象的 16 个键值对的集合。这可以
    用于以结构化格式存储对象的附加信息
    ，并通过 API 或控制台查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批处理的模型 ID，例如 `gpt-6-astra`。OpenAI
    提供了一系列具有不同能力、性能特性和价格点的模型。请参阅
    [模型 [模型
    指南](/api/docs/models) ](#) 以浏览和比较可用的模型。

  - `output_file_id: optional string`

    包含成功执行请求输出的文件 ID。

  - `request_counts: optional BatchRequestCounts`

    该批处理中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      该批处理中的请求总数。

  - `usage: optional BatchUsage`

    表示 token 使用情况详细信息，包括输入 token、输出 token
    的细分以及使用的 token 总数。仅在
    2025 年 9 月 7 日之后创建的批处理中填充。

    - `input_tokens: number`

      输入 token 的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入 token 的详细明细。

      - `cached_tokens: number`

        从缓存中检索到的 token 数量。 [更多相关内容
        提示缓存](/api/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出 token 的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出 token 的详细明细。

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
    "batch_description": "Nightly eval job"
  }
}
```

## 域类型

### Batch

- `Batch object { id, completion_window, created_at, 19 more }`

  - `id: string`

  - `completion_window: string`

    批量应在该时间范围内被处理。

  - `created_at: number`

    批量创建时的 Unix 时间戳（以秒为单位）。

  - `endpoint: string`

    批量所使用的 OpenAI API 端点。

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

    批量完成时的 Unix 时间戳（以秒为单位）。

  - `error_file_id: optional string`

    包含出错请求输出内容的文件 ID。

  - `errors: optional object { data, object }`

    - `data: optional array of BatchError`

      - `code: optional string`

        用于标识错误类型的错误代码。

      - `line: optional number or null`

        错误在输入文件中发生的行号（如果适用）。

      - `message: optional string`

        提供关于该错误更多细节的人类可读消息。

      - `param: optional string or null`

        导致错误的参数名称（如果适用）。

    - `object: optional string`

      对象类型，始终为 `list`.

  - `expired_at: optional number`

    批量过期时的 Unix 时间戳（以秒为单位）。

  - `expires_at: optional number`

    批量将过期时的 Unix 时间戳（以秒为单位）。

  - `failed_at: optional number`

    批量失败时的 Unix 时间戳（以秒为单位）。

  - `finalizing_at: optional number`

    批量开始完成时的 Unix 时间戳（以秒为单位）。

  - `in_progress_at: optional number`

    批量开始处理时的 Unix 时间戳（以秒为单位）。

  - `metadata: optional Metadata or null`

    可以附加到对象的 16 个键值对的集合。这可以
    用于以结构化格式存储对象的附加信息
    ，并通过 API 或控制台查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

  - `model: optional string`

    用于处理该批处理的模型 ID，例如 `gpt-6-astra`。OpenAI
    提供了一系列具有不同能力、性能特性和价格点的模型。请参阅
    [模型 [模型
    指南](/api/docs/models) ](#) 以浏览和比较可用的模型。

  - `output_file_id: optional string`

    包含成功执行请求输出的文件 ID。

  - `request_counts: optional BatchRequestCounts`

    该批处理中不同状态的请求计数。

    - `completed: number`

      已成功完成的请求数量。

    - `failed: number`

      已失败的请求数量。

    - `total: number`

      该批处理中的请求总数。

  - `usage: optional BatchUsage`

    表示 token 使用情况详细信息，包括输入 token、输出 token
    的细分以及使用的 token 总数。仅在
    2025 年 9 月 7 日之后创建的批处理中填充。

    - `input_tokens: number`

      输入 token 的数量。

    - `input_tokens_details: object { cached_tokens }`

      输入 token 的详细明细。

      - `cached_tokens: number`

        从缓存中检索到的 token 数量。 [更多相关内容
        提示缓存](/api/docs/guides/prompt-caching).

    - `output_tokens: number`

      输出 token 的数量。

    - `output_tokens_details: object { reasoning_tokens }`

      输出 token 的详细明细。

      - `reasoning_tokens: number`

        推理 token 的数量。

    - `total_tokens: number`

      使用的 token 总数。

### Batch Error

- `BatchError object { code, line, message, param }`

  - `code: optional string`

    用于标识错误类型的错误代码。

  - `line: optional number or null`

    错误在输入文件中发生的行号（如果适用）。

  - `message: optional string`

    提供关于该错误更多细节的人类可读消息。

  - `param: optional string or null`

    导致错误的参数名称（如果适用）。

### Batch Request Counts

- `BatchRequestCounts object { completed, failed, total }`

  该批处理中不同状态的请求计数。

  - `completed: number`

    已成功完成的请求数量。

  - `failed: number`

    已失败的请求数量。

  - `total: number`

    该批处理中的请求总数。

### Batch Usage

- `BatchUsage object { input_tokens, input_tokens_details, output_tokens, 2 more }`

  表示 token 使用情况详细信息，包括输入 token、输出 token
  的细分以及使用的 token 总数。仅在
  2025 年 9 月 7 日之后创建的批处理中填充。

  - `input_tokens: number`

    输入 token 的数量。

  - `input_tokens_details: object { cached_tokens }`

    输入 token 的详细明细。

    - `cached_tokens: number`

      从缓存中检索到的 token 数量。 [更多相关内容
      提示缓存](/api/docs/guides/prompt-caching).

  - `output_tokens: number`

    输出 token 的数量。

  - `output_tokens_details: object { reasoning_tokens }`

    输出 token 的详细明细。

    - `reasoning_tokens: number`

      推理 token 的数量。

  - `total_tokens: number`

    使用的 token 总数。
