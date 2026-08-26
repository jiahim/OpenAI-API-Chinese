> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## 删除视频

**删除** `/videos/{video_id}`

永久删除已完成的或失败的视频及其存储的资源。

### 路径参数

- `video_id: string`

### 返回

- `id: string`

  已删除视频的标识符。

- `deleted: boolean`

  表示该视频资源已被删除。

- `object: "video.deleted"`

  指示删除响应的对象类型。

  - `"video.deleted"`

### 示例

```http
curl https://api.openai.com/v1/videos/$VIDEO_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "video.deleted"
}
```
