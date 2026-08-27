# 嵌入

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

## 创建嵌入

**post** `/embeddings`

创建表示输入文本的嵌入向量。

### 请求体参数

- `input: string or array of string or array of number or array of array of number`

  要嵌入的输入文本，编码为字符串或 token 数组。要在单个请求中嵌入多个输入，请传递字符串数组或 token 数组的数组。输入不得超过模型的最大输入 token 数（所有嵌入模型为 8192 个 token），不能是空字符串，且任何数组的维度不得超过 2048。 [Python 代码示例](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken) 用于计算 token 数。除了每次输入的限制外，所有嵌入模型还强制要求单个请求中所有输入的总 token 数不超过 300,000。

  - `String = string`

    将被转换为嵌入的字符串。

  - `Array = array of string`

    将被转换为嵌入的字符串数组。

  - `Array = array of number`

    将被转换为嵌入的整数数组。

  - `Array = array of array of number`

    包含将被转换为嵌入的整数的数组的数组。

- `model: string or EmbeddingModel`

  要使用的模型 ID。你可以使用 [列出模型](/docs/api-reference/models/list) API 查看所有可用模型，或查看我们的 [模型概览](/docs/models) 了解它们的描述。

  - `string`

  - `EmbeddingModel = "text-embedding-ada-002" or "text-embedding-3-small" or "text-embedding-3-large"`

    - `"text-embedding-ada-002"`

    - `"text-embedding-3-small"`

    - `"text-embedding-3-large"`

- `dimensions: optional number`

  生成的输出嵌入应具有的维度数。仅在以下模型中支持 `text-embedding-3` 及更高版本模型。

- `encoding_format: optional "float" or "base64"`

  返回嵌入的格式。可以是 `float` 或 [`base64`](https://pypi.org/project/pybase64/).

  - `"float"`

  - `"base64"`

- `user: optional string`

  代表最终用户的唯一标识符，可帮助 OpenAI 监控和检测滥用。 [了解更多](/docs/guides/safety-best-practices#end-user-ids).

### 返回

- `CreateEmbeddingResponse object { data, model, object, usage }`

  - `data: array of Embedding`

    模型生成的嵌入向量列表。

    - `embedding: array of number`

      嵌入向量，为一个浮点数列表。向量的长度取决于模型，详见 [嵌入指南](/docs/guides/embeddings).

    - `index: number`

      嵌入在嵌入列表中的索引。

    - `object: "embedding"`

      对象类型，始终为 "embedding"。

      - `"embedding"`

  - `model: string`

    用于生成嵌入的模型名称。

  - `object: "list"`

    对象类型，始终为 "list"。

    - `"list"`

  - `usage: object { prompt_tokens, total_tokens }`

    请求的使用情况信息。

    - `prompt_tokens: number`

      提示词所用的令牌数量。

    - `total_tokens: number`

      请求所用的令牌总数。

### 示例

```http
curl https://api.openai.com/v1/embeddings \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "input": "The quick brown fox jumped over the lazy dog",
          "model": "text-embedding-3-small",
          "encoding_format": "float",
          "user": "user-1234"
        }'
```

#### 响应

```json
{
  "data": [
    {
      "embedding": [
        0
      ],
      "index": 0,
      "object": "embedding"
    }
  ],
  "model": "model",
  "object": "list",
  "usage": {
    "prompt_tokens": 0,
    "total_tokens": 0
  }
}
```

### 示例

```http
curl https://api.openai.com/v1/embeddings \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "input": "The food was delicious and the waiter...",
    "model": "text-embedding-ada-002",
    "encoding_format": "float"
  }'
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "embedding": [
        0.0023064255,
        -0.009327292,
        .... (1536 floats total for ada-002)
        -0.0028842222,
      ],
      "index": 0
    }
  ],
  "model": "text-embedding-ada-002",
  "usage": {
    "prompt_tokens": 8,
    "total_tokens": 8
  }
}
```

## 域类型

### 创建嵌入响应

- `CreateEmbeddingResponse object { data, model, object, usage }`

  - `data: array of Embedding`

    模型生成的嵌入列表。

    - `embedding: array of number`

      嵌入向量，即浮点数列表。向量的长度取决于模型，具体参见 [嵌入指南](/docs/guides/embeddings).

    - `index: number`

      嵌入在嵌入列表中的索引。

    - `object: "embedding"`

      对象类型，始终为 "embedding"。

      - `"embedding"`

  - `model: string`

    用于生成嵌入的模型名称。

  - `object: "list"`

    对象类型，始终为 "list"。

    - `"list"`

  - `usage: object { prompt_tokens, total_tokens }`

    请求的使用情况信息。

    - `prompt_tokens: number`

      提示词使用的令牌数。

    - `total_tokens: number`

      请求使用的令牌总数。

### 嵌入

- `Embedding object { embedding, index, object }`

  表示由嵌入端点返回的嵌入向量。

  - `embedding: array of number`

    嵌入向量，即浮点数列表。向量的长度取决于模型，详见 [嵌入指南](/docs/guides/embeddings).

  - `index: number`

    嵌入在嵌入列表中的索引。

  - `object: "embedding"`

    对象类型，始终为 "embedding"。

    - `"embedding"`

### 嵌入模型

- `EmbeddingModel = "text-embedding-ada-002" or "text-embedding-3-small" or "text-embedding-3-large"`

  - `"text-embedding-ada-002"`

  - `"text-embedding-3-small"`

  - `"text-embedding-3-large"`
