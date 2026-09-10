# Embeddings

> 完整文档索引请参阅 [llms.txt](/llms.txt)。各文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

## 创建嵌入

**post** `/embeddings`

创建表示输入文本的嵌入向量。

### Body Parameters

- `input: string or array of string or array of number or array of array of number`

  待嵌入的输入，编码为字符串或 token 数组。如需在单次请求中嵌入多个输入，请传入字符串数组或 token 数组。输入不得超过该模型的单次最大输入 token 数（所有嵌入模型均为 8192 个 token），不能为空字符串，任何数组的维度不得超过 2048。 [Python 代码示例](https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken) 以计算 token。除每个输入的 token 上限外，所有嵌入模型在单次请求中对所有输入的 token 总和还设有 300,000 个 token 的上限。

  - `String = string`

    将被转换为嵌入向量的字符串。

  - `Array = array of string`

    将被转换为嵌入向量的字符串数组。

  - `Array = array of number`

    将被转换为嵌入向量的整数数组。

  - `Array = array of array of number`

    将被转换为嵌入向量的、包含整数的数组所组成的数组。

- `model: string or EmbeddingModel`

  要使用的模型 ID。你可以使用 [模型列表](/api/reference/resources/models/methods/list) API 查看所有可用模型，或参阅我们的 [模型概述](/api/docs/models) 了解相关说明。

  - `string`

  - `EmbeddingModel = "text-embedding-ada-002" or "text-embedding-3-small" or "text-embedding-3-large"`

    - `"text-embedding-ada-002"`

    - `"text-embedding-3-small"`

    - `"text-embedding-3-large"`

- `dimensions: optional number`

  生成的输出嵌入向量的维度数。仅 `text-embedding-3` 及更高版本的模型支持。

- `encoding_format: optional "float" or "base64"`

  返回嵌入向量的格式。可以是 `float` 或 [`base64`](https://pypi.org/project/pybase64/).

  - `"float"`

  - `"base64"`

- `user: optional string`

  用于标识你终端用户的唯一标识符，可帮助 OpenAI 监控并检测滥用行为。 [了解更多](/api/docs/guides/safety-best-practices#implement-safety-identifiers).

### Returns

- `CreateEmbeddingResponse object { data, model, object, usage }`

  - `data: array of Embedding`

    模型生成的 embedding 列表。

    - `embedding: array of number`

      embedding 向量，是一个浮点数列表。向量的长度取决于模型，详见 [embedding 指南](/api/docs/guides/embeddings).

    - `index: number`

      embedding 在 embedding 列表中的索引。

    - `object: "embedding"`

      对象类型，始终为 "embedding"。

      - `"embedding"`

  - `model: string`

    用于生成 embedding 的模型名称。

  - `object: "list"`

    对象类型，始终为 "list"。

    - `"list"`

  - `usage: object { prompt_tokens, total_tokens }`

    本次请求的使用量信息。

    - `prompt_tokens: number`

      提示词使用的 token 数。

    - `total_tokens: number`

      本次请求使用的 token 总数。

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

#### Response

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

#### Response

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

### Create Embedding Response

- `CreateEmbeddingResponse object { data, model, object, usage }`

  - `data: array of Embedding`

    模型生成的 embedding 列表。

    - `embedding: array of number`

      embedding 向量，是一个浮点数列表。向量的长度取决于模型，详见 [embedding 指南](/api/docs/guides/embeddings).

    - `index: number`

      embedding 在 embedding 列表中的索引。

    - `object: "embedding"`

      对象类型，始终为 "embedding"。

      - `"embedding"`

  - `model: string`

    用于生成 embedding 的模型名称。

  - `object: "list"`

    对象类型，始终为 "list"。

    - `"list"`

  - `usage: object { prompt_tokens, total_tokens }`

    本次请求的使用量信息。

    - `prompt_tokens: number`

      提示词使用的 token 数。

    - `total_tokens: number`

      本次请求使用的 token 总数。

### Embedding

- `Embedding object { embedding, index, object }`

  表示由嵌入端点返回的嵌入向量。

  - `embedding: array of number`

    embedding 向量，是一个浮点数列表。向量的长度取决于模型，详见 [embedding 指南](/api/docs/guides/embeddings).

  - `index: number`

    embedding 在 embedding 列表中的索引。

  - `object: "embedding"`

    对象类型，始终为 "embedding"。

    - `"embedding"`

### Embedding Model

- `EmbeddingModel = "text-embedding-ada-002" or "text-embedding-3-small" or "text-embedding-3-large"`

  - `"text-embedding-ada-002"`

  - `"text-embedding-3-small"`

  - `"text-embedding-3-large"`
