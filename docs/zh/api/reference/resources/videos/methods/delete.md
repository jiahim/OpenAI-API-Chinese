> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 来获取。

## 删除视频

**delete** `/videos/{video_id}`

永久删除已完成或失败的视频及其存储资源。

### 路径参数

- `video_id: string`

### 返回

- `id: string`

  已删除视频的标识符。

- `deleted: boolean`

  表示视频资源已被删除。

- `object: "video.deleted"`

  表示删除响应的对象类型。

  - `"video.deleted"`

### Example

```http
curl https://api.openai.com/v1/videos/$VIDEO_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "deleted": true,
  "object": "video.deleted"
}
```
