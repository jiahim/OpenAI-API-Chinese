> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## 列出视频

**get** `/videos`

列出当前项目最近生成的视频。

### 查询参数

- `after: optional string`

  上一分页请求中最后一项的标识符

- `limit: optional number`

  要检索的项数

- `order: optional "asc" or "desc"`

  按时间戳对结果进行排序。使用 `asc` 表示升序，或使用 `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### 返回值

- `data: array of Video`

  项目列表

  - `id: string`

    视频作业的唯一标识符。

  - `completed_at: number or null`

    作业完成时的 Unix 时间戳（秒），若已完成。

  - `created_at: number`

    作业创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    错误负载，解释生成失败的原因（如适用）。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回的人类可读错误描述。

  - `expires_at: number or null`

    可下载资产过期时的 Unix 时间戳（秒），若已设置。

  - `model: VideoModel`

    生成该作业的视频生成模型。

    - `string`

    - `"sora-2" or "sora-2-pro" or "sora-2-2025-10-06" or 2 more`

      - `"sora-2"`

      - `"sora-2-pro"`

      - `"sora-2-2025-10-06"`

      - `"sora-2-pro-2025-10-06"`

      - `"sora-2-2025-12-08"`

  - `object: "video"`

    对象类型，始终为 `video`.

    - `"video"`

  - `progress: number`

    生成任务的大致完成百分比。

  - `prompt: string or null`

    用于生成视频的提示词。

  - `remixed_from_video_id: string or null`

    如果此视频是混剪，则为源视频的标识符。

  - `seconds: string`

    生成片段的时长（秒）。对于扩展，这是拼接后的总时长。

  - `size: VideoSize`

    生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    视频作业的当前生命周期状态。

    - `"queued"`

    - `"in_progress"`

    - `"completed"`

    - `"failed"`

- `first_id: string or null`

  列表中第一项的 ID。

- `has_more: boolean`

  是否还有更多可用项目。

- `last_id: string or null`

  列表中最后一项的 ID。

- `object: "list"`

  返回对象的类型，必须为 `list`.

  - `"list"`

### 示例

```http
curl https://api.openai.com/v1/videos \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "completed_at": 0,
      "created_at": 0,
      "error": {
        "code": "code",
        "message": "message"
      },
      "expires_at": 0,
      "model": "sora-2",
      "object": "video",
      "progress": 0,
      "prompt": "prompt",
      "remixed_from_video_id": "remixed_from_video_id",
      "seconds": "string",
      "size": "720x1280",
      "status": "queued"
    }
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id",
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/videos \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "video_123",
      "object": "video",
      "model": "sora-2",
      "status": "completed"
    }
  ],
  "object": "list"
}
```
