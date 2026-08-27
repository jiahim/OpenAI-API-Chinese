> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

## 删除容器

**删除** `/containers/{container_id}`

删除容器

### 路径参数

- `container_id: string`

### 示例

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

### 示例

```http
curl -X DELETE https://api.openai.com/v1/containers/cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
    "id": "cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863",
    "object": "container.deleted",
    "deleted": true
}
```
