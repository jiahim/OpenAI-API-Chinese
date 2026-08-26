# 视频

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

## 创建视频

**post** `/videos`

根据提示词和可选的参考素材创建新的视频生成任务。

### 请求体参数

- `prompt: string`

  描述要生成的视频的文本提示。

- `input_reference: optional ImageInputReferenceParam`

  用于指导生成的可选参考对象。请提供且仅提供以下之一： `image_url` 或 `file_id`.

  - `file_id: optional string`

  - `image_url: optional string`

    一个完全限定的 URL 或 base64 编码的数据 URL。

- `model: optional VideoModel`

  用于视频生成的模型（允许值：sora-2、sora-2-pro）。默认为 `sora-2`.

  - `string`

  - `"sora-2" or "sora-2-pro" or "sora-2-2025-10-06" or 2 more`

    - `"sora-2"`

    - `"sora-2-pro"`

    - `"sora-2-2025-10-06"`

    - `"sora-2-pro-2025-10-06"`

    - `"sora-2-2025-12-08"`

- `seconds: optional VideoSeconds`

  片段时长（秒）（允许值：4、8、12）。默认为 4 秒。

  - `"4"`

  - `"8"`

  - `"12"`

- `size: optional VideoSize`

  输出分辨率，格式为宽 x 高（允许值：720x1280、1280x720、1024x1792、1792x1024）。默认为 720x1280。

  - `"720x1280"`

  - `"1280x720"`

  - `"1024x1792"`

  - `"1792x1024"`

### 返回

- `Video object { id, completed_at, created_at, 10 more }`

  描述所生成视频任务的结构化信息。

  - `id: string`

    视频任务的唯一标识符。

  - `completed_at: number or null`

    任务完成时的 Unix 时间戳（秒），如果已结束。

  - `created_at: number`

    任务创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    解释生成失败原因的错误负载，如果适用。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回的错误的可读描述。

  - `expires_at: number or null`

    可下载资产过期时的 Unix 时间戳（秒），如果已设置。

  - `model: VideoModel`

    生成该任务的视频生成模型。

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

    生成任务的近似完成百分比。

  - `prompt: string or null`

    用于生成视频的提示词。

  - `remixed_from_video_id: string or null`

    如果此视频是混剪，则为源视频的标识符。

  - `seconds: string`

    生成剪辑的时长（秒）。对于扩展，这是拼接后的总时长。

  - `size: VideoSize`

    生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    视频任务的当前生命周期状态。

    - `"queued"`

    - `"in_progress"`

    - `"completed"`

    - `"failed"`

### 示例

```http
curl https://api.openai.com/v1/videos \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "prompt": "x"
        }'
```

#### 响应

```json
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
```

### 示例

```http
curl https://api.openai.com/v1/videos \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "model=sora-2" \
  -F "prompt=A calico cat playing a piano on stage"
```

#### 响应

```json
{
  "id": "video_123",
  "object": "video",
  "model": "sora-2",
  "status": "queued",
  "progress": 0,
  "created_at": 1712697600,
  "size": "1024x1792",
  "seconds": "8",
  "quality": "standard"
}
```

## 从上传的视频创建角色。

**post** `/videos/characters`

从上传的视频创建角色。

### 返回

- `id: string or null`

  角色创建客串的标识符。

- `created_at: number`

  角色创建时的 Unix 时间戳（秒）。

- `name: string or null`

  角色的显示名称。

### 示例

```http
curl https://api.openai.com/v1/videos/characters \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F name=x \
    -F 'video=@/path/to/video'
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "name": "name"
}
```

## 删除视频

**删除** `/videos/{video_id}`

永久删除已完成或失败的视频及其存储的资产。

### 路径参数

- `video_id: string`

### 返回

- `id: string`

  已删除视频的标识符。

- `deleted: boolean`

  表示视频资源已被删除。

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

## 检索视频内容

**获取** `/videos/{video_id}/content`

下载生成的视频字节或派生预览资源。

流式传输指定视频作业的渲染视频内容。

### 路径参数

- `video_id: string`

### 查询参数

- `variant: optional "video" or "thumbnail" or "spritesheet"`

  要返回哪个可下载资源。默认为 MP4 视频。

  - `"video"`

  - `"thumbnail"`

  - `"spritesheet"`

### 示例

```http
curl https://api.openai.com/v1/videos/$VIDEO_ID/content \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

## 通过编辑源视频或已生成的视频来创建新的视频生成任务。

**post** `/videos/edits`

通过编辑源视频或已有的生成视频来创建新的视频生成任务。

### 请求体参数

- `prompt: string`

  描述如何编辑源视频的文本提示。

- `video: object { id }`

  对要编辑的已完成视频的引用。

  - `id: string`

    已完成视频的标识符。

### 返回

- `Video object { id, completed_at, created_at, 10 more }`

  描述所生成视频任务的结构化信息。

  - `id: string`

    视频任务的唯一标识符。

  - `completed_at: number or null`

    任务完成时的 Unix 时间戳（秒），如果已结束。

  - `created_at: number`

    任务创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    解释生成失败原因的错误负载，如果适用。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回的错误的可读描述。

  - `expires_at: number or null`

    可下载资产过期时的 Unix 时间戳（秒），如果已设置。

  - `model: VideoModel`

    生成该任务的视频生成模型。

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

    生成任务的近似完成百分比。

  - `prompt: string or null`

    用于生成视频的提示词。

  - `remixed_from_video_id: string or null`

    如果此视频是混剪，则为源视频的标识符。

  - `seconds: string`

    生成剪辑的时长（秒）。对于扩展，这是拼接后的总时长。

  - `size: VideoSize`

    生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    视频任务的当前生命周期状态。

    - `"queued"`

    - `"in_progress"`

    - `"completed"`

    - `"failed"`

### 示例

```http
curl https://api.openai.com/v1/videos/edits \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "prompt": "x",
          "video": {
            "id": "video_123"
          }
        }'
```

#### 响应

```json
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
```

## 创建已完成视频的扩展。

**post** `/videos/extensions`

创建已完成视频的扩展。

### 请求体参数

- `prompt: string`

  更新后的文本提示，用于指导扩展生成。

- `seconds: VideoSeconds`

  新生成的扩展片段长度（秒）（允许值：4、8、12、16、20）。

  - `"4"`

  - `"8"`

  - `"12"`

- `video: object { id }`

  对要扩展的已完成视频的引用。

  - `id: string`

    已完成视频的标识符。

### 返回

- `Video object { id, completed_at, created_at, 10 more }`

  描述所生成视频任务的结构化信息。

  - `id: string`

    视频任务的唯一标识符。

  - `completed_at: number or null`

    任务完成时的 Unix 时间戳（秒），如果已结束。

  - `created_at: number`

    任务创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    解释生成失败原因的错误负载，如果适用。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回的错误的可读描述。

  - `expires_at: number or null`

    可下载资产过期时的 Unix 时间戳（秒），如果已设置。

  - `model: VideoModel`

    生成该任务的视频生成模型。

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

    生成任务的近似完成百分比。

  - `prompt: string or null`

    用于生成视频的提示词。

  - `remixed_from_video_id: string or null`

    如果此视频是混剪，则为源视频的标识符。

  - `seconds: string`

    生成剪辑的时长（秒）。对于扩展，这是拼接后的总时长。

  - `size: VideoSize`

    生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    视频任务的当前生命周期状态。

    - `"queued"`

    - `"in_progress"`

    - `"completed"`

    - `"failed"`

### 示例

```http
curl https://api.openai.com/v1/videos/extensions \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "prompt": "x",
          "seconds": "4",
          "video": {
            "id": "video_123"
          }
        }'
```

#### 响应

```json
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
```

## 获取一个字符。

**获取** `/videos/characters/{character_id}`

获取一个字符。

### 路径参数

- `character_id: string`

### 返回

- `id: string or null`

  角色创建客串的标识符。

- `created_at: number`

  角色创建时的 Unix 时间戳（秒）。

- `name: string or null`

  角色的显示名称。

### 示例

```http
curl https://api.openai.com/v1/videos/characters/$CHARACTER_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "name": "name"
}
```

## 列出视频

**获取** `/videos`

列出当前项目最近生成的视频。

### 查询参数

- `after: optional string`

  上一次分页请求中最后一项的标识符

- `limit: optional number`

  要检索的项目数量

- `order: optional "asc" or "desc"`

  按时间戳对结果进行排序。使用 `asc` 表示升序，或 `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of Video`

  项目列表

  - `id: string`

    视频任务的唯一标识符。

  - `completed_at: number or null`

    任务完成时的 Unix 时间戳（秒），如果已结束。

  - `created_at: number`

    任务创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    解释生成失败原因的错误负载，如果适用。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回的错误的可读描述。

  - `expires_at: number or null`

    可下载资产过期时的 Unix 时间戳（秒），如果已设置。

  - `model: VideoModel`

    生成该任务的视频生成模型。

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

    生成任务的近似完成百分比。

  - `prompt: string or null`

    用于生成视频的提示词。

  - `remixed_from_video_id: string or null`

    如果此视频是混剪，则为源视频的标识符。

  - `seconds: string`

    生成剪辑的时长（秒）。对于扩展，这是拼接后的总时长。

  - `size: VideoSize`

    生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    视频任务的当前生命周期状态。

    - `"queued"`

    - `"in_progress"`

    - `"completed"`

    - `"failed"`

- `first_id: string or null`

  列表中第一个项目的 ID。

- `has_more: boolean`

  是否还有更多可用项目。

- `last_id: string or null`

  列表中最后一个项目的 ID。

- `object: "list"`

  返回的对象类型，必须是 `list`.

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

## Remix 视频

**post** `/videos/{video_id}/remix`

使用刷新后的提示词，为已完成的视频创建一个混剪版本。

### 路径参数

- `video_id: string`

### 请求体参数

- `prompt: string`

  用于指导混音生成的更新文本提示。

### 返回

- `Video object { id, completed_at, created_at, 10 more }`

  描述所生成视频任务的结构化信息。

  - `id: string`

    视频任务的唯一标识符。

  - `completed_at: number or null`

    任务完成时的 Unix 时间戳（秒），如果已结束。

  - `created_at: number`

    任务创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    解释生成失败原因的错误负载，如果适用。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回的错误的可读描述。

  - `expires_at: number or null`

    可下载资产过期时的 Unix 时间戳（秒），如果已设置。

  - `model: VideoModel`

    生成该任务的视频生成模型。

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

    生成任务的近似完成百分比。

  - `prompt: string or null`

    用于生成视频的提示词。

  - `remixed_from_video_id: string or null`

    如果此视频是混剪，则为源视频的标识符。

  - `seconds: string`

    生成剪辑的时长（秒）。对于扩展，这是拼接后的总时长。

  - `size: VideoSize`

    生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    视频任务的当前生命周期状态。

    - `"queued"`

    - `"in_progress"`

    - `"completed"`

    - `"failed"`

### 示例

```http
curl https://api.openai.com/v1/videos/$VIDEO_ID/remix \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "prompt": "x"
        }'
```

#### 响应

```json
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
```

### 示例

```http
curl -X POST https://api.openai.com/v1/videos/video_123/remix \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Extend the scene with the cat taking a bow to the cheering audience"
  }'
```

#### 响应

```json
{
  "id": "video_456",
  "object": "video",
  "model": "sora-2",
  "status": "queued",
  "progress": 0,
  "created_at": 1712698600,
  "size": "720x1280",
  "seconds": "8",
  "remixed_from_video_id": "video_123"
}
```

## 检索视频

**获取** `/videos/{video_id}`

获取已生成视频的最新元数据。

### 路径参数

- `video_id: string`

### 返回

- `Video object { id, completed_at, created_at, 10 more }`

  描述所生成视频任务的结构化信息。

  - `id: string`

    视频任务的唯一标识符。

  - `completed_at: number or null`

    任务完成时的 Unix 时间戳（秒），如果已结束。

  - `created_at: number`

    任务创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    解释生成失败原因的错误负载，如果适用。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回的错误的可读描述。

  - `expires_at: number or null`

    可下载资产过期时的 Unix 时间戳（秒），如果已设置。

  - `model: VideoModel`

    生成该任务的视频生成模型。

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

    生成任务的近似完成百分比。

  - `prompt: string or null`

    用于生成视频的提示词。

  - `remixed_from_video_id: string or null`

    如果此视频是混剪，则为源视频的标识符。

  - `seconds: string`

    生成剪辑的时长（秒）。对于扩展，这是拼接后的总时长。

  - `size: VideoSize`

    生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    视频任务的当前生命周期状态。

    - `"queued"`

    - `"in_progress"`

    - `"completed"`

    - `"failed"`

### 示例

```http
curl https://api.openai.com/v1/videos/$VIDEO_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
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
```

## 领域类型

### 图像输入参考参数

- `ImageInputReferenceParam object { file_id, image_url }`

  - `file_id: optional string`

  - `image_url: optional string`

    一个完全限定的 URL 或 base64 编码的数据 URL。

### 视频

- `Video object { id, completed_at, created_at, 10 more }`

  描述所生成视频任务的结构化信息。

  - `id: string`

    视频任务的唯一标识符。

  - `completed_at: number or null`

    任务完成时的 Unix 时间戳（秒），如果已结束。

  - `created_at: number`

    任务创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    解释生成失败原因的错误负载，如果适用。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回的错误的可读描述。

  - `expires_at: number or null`

    可下载资产过期时的 Unix 时间戳（秒），如果已设置。

  - `model: VideoModel`

    生成该任务的视频生成模型。

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

    生成任务的近似完成百分比。

  - `prompt: string or null`

    用于生成视频的提示词。

  - `remixed_from_video_id: string or null`

    如果此视频是混剪，则为源视频的标识符。

  - `seconds: string`

    生成剪辑的时长（秒）。对于扩展，这是拼接后的总时长。

  - `size: VideoSize`

    生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    视频任务的当前生命周期状态。

    - `"queued"`

    - `"in_progress"`

    - `"completed"`

    - `"failed"`

### 视频创建角色响应

- `VideoCreateCharacterResponse object { id, created_at, name }`

  - `id: string or null`

    角色创建客串的标识符。

  - `created_at: number`

    角色创建时的 Unix 时间戳（秒）。

  - `name: string or null`

    角色的显示名称。

### 视频创建错误

- `VideoCreateError object { code, message }`

  生成响应时发生的错误。

  - `code: string`

    返回的机器可读错误代码。

  - `message: string`

    返回的错误的可读描述。

### 视频删除响应

- `VideoDeleteResponse object { id, deleted, object }`

  删除视频后返回的确认负载。

  - `id: string`

    已删除视频的标识符。

  - `deleted: boolean`

    表示视频资源已被删除。

  - `object: "video.deleted"`

    指示删除响应的对象类型。

    - `"video.deleted"`

### 视频获取角色响应

- `VideoGetCharacterResponse object { id, created_at, name }`

  - `id: string or null`

    角色创建客串的标识符。

  - `created_at: number`

    角色创建时的 Unix 时间戳（秒）。

  - `name: string or null`

    角色的显示名称。

### 视频模型

- `VideoModel = string or "sora-2" or "sora-2-pro" or "sora-2-2025-10-06" or 2 more`

  - `string`

  - `"sora-2" or "sora-2-pro" or "sora-2-2025-10-06" or 2 more`

    - `"sora-2"`

    - `"sora-2-pro"`

    - `"sora-2-2025-10-06"`

    - `"sora-2-pro-2025-10-06"`

    - `"sora-2-2025-12-08"`

### 视频秒数

- `VideoSeconds = "4" or "8" or "12"`

  - `"4"`

  - `"8"`

  - `"12"`

### 视频大小

- `VideoSize = "720x1280" or "1280x720" or "1024x1792" or "1792x1024"`

  - `"720x1280"`

  - `"1280x720"`

  - `"1024x1792"`

  - `"1792x1024"`
