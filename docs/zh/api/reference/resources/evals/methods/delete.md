> 关于完整的文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 来访问。

## 删除评估

**删除** `/evals/{eval_id}`

删除一个评估。

### 路径参数

- `eval_id: string`

### 返回

- `deleted: boolean`

- `eval_id: string`

- `object: string`

### 示例

```http
curl https://api.openai.com/v1/evals/$EVAL_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "deleted": true,
  "eval_id": "eval_abc123",
  "object": "eval.deleted"
}
```

### 示例

```http
curl https://api.openai.com/v1/evals/eval_abc123 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "eval.deleted",
  "deleted": true,
  "eval_id": "eval_abc123"
}
```
