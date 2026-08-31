> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## 删除评估

**delete** `/evals/{eval_id}`

删除评估。

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
