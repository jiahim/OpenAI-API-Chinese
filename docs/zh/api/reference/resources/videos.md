# Videos

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## 创建视频

**post** `/videos`

根据提示词和可选的参考素材创建一个新的视频生成任务。

### 正文参数

- `prompt: string`

  描述要生成的视频的文本提示。

- `input_reference: optional ImageInputReferenceParam`

  用于引导生成的可选参考对象。只能提供以下之一 `image_url` 或 `file_id`.

  - `file_id: optional string`

  - `image_url: optional string`

    完整的 URL 或 base64 编码的 data URL。

- `model: optional VideoModel`

  要使用的视频生成模型（允许的值：sora-2、sora-2-pro）。默认为 `sora-2`.

  - `string`

  - `"sora-2" or "sora-2-pro" or "sora-2-2025-10-06" or 2 more`

    - `"sora-2"`

    - `"sora-2-pro"`

    - `"sora-2-2025-10-06"`

    - `"sora-2-pro-2025-10-06"`

    - `"sora-2-2025-12-08"`

- `seconds: optional VideoSeconds`

  片段时长（单位：秒，允许的值：4、8、12）。默认为 4 秒。

  - `"4"`

  - `"8"`

  - `"12"`

- `size: optional VideoSize`

  输出分辨率，格式为 宽 x 高（允许的值：720x1280、1280x720、1024x1792、1792x1024）。默认为 720x1280。

  - `"720x1280"`

  - `"1280x720"`

  - `"1024x1792"`

  - `"1792x1024"`

### Returns

- `Video object { id, completed_at, created_at, 10 more }`

  描述生成的视频任务的结构化信息。

  - `id: string`

    视频任务的唯一标识符。

  - `completed_at: number or null`

    任务完成时的 Unix 时间戳（秒），如果已完成。

  - `created_at: number`

    任务创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    用于解释生成失败原因的错误负载（如适用）。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回错误的人类可读描述。

  - `expires_at: number or null`

    可下载资源过期时的 Unix 时间戳（秒），如果已设置。

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

    用于生成该视频的提示词。

  - `remixed_from_video_id: string or null`

    如果该视频为二次创作，则为源视频的标识符。

  - `seconds: string`

    生成片段的时长（秒）。对于扩展，这是拼接后的总时长。

  - `size: VideoSize`

    所生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    视频任务当前的生命周期状态。

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

Create a character from an uploaded video.

### Returns

- `id: string or null`

  角色创建 cameo 的标识符。

- `created_at: number`

  角色创建时的 Unix 时间戳（以秒为单位）。

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

**delete** `/videos/{video_id}`

永久删除已完成的或失败的视频及其存储的资源。

### 路径参数

- `video_id: string`

### Returns

- `id: string`

  已删除视频的标识符。

- `deleted: boolean`

  指示视频资源已被删除。

- `object: "video.deleted"`

  表示删除响应的对象类型。

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

**get** `/videos/{video_id}/content`

下载生成的视频字节或派生的预览资源。

为指定视频任务流式传输已渲染的视频内容。

### 路径参数

- `video_id: string`

### 查询参数

- `variant: optional "video" or "thumbnail" or "spritesheet"`

  要返回的可下载资源。默认为 MP4 视频。

  - `"video"`

  - `"thumbnail"`

  - `"spritesheet"`

### 示例

```http
curl https://api.openai.com/v1/videos/$VIDEO_ID/content \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

## 通过编辑源视频或现有的已生成视频，创建一个新的视频生成任务。

**post** `/videos/edits`

通过编辑源视频或已有生成视频来创建一个新的视频生成任务。

### 正文参数

- `prompt: string`

  描述如何编辑源视频的文本提示。

- `video: object { id }`

  指向已完成的待编辑视频的引用。

  - `id: string`

    已完成视频的标识符。

### Returns

- `Video object { id, completed_at, created_at, 10 more }`

  描述生成的视频任务的结构化信息。

  - `id: string`

    视频任务的唯一标识符。

  - `completed_at: number or null`

    任务完成时的 Unix 时间戳（秒），如果已完成。

  - `created_at: number`

    任务创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    用于解释生成失败原因的错误负载（如适用）。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回错误的人类可读描述。

  - `expires_at: number or null`

    可下载资源过期时的 Unix 时间戳（秒），如果已设置。

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

    用于生成该视频的提示词。

  - `remixed_from_video_id: string or null`

    如果该视频为二次创作，则为源视频的标识符。

  - `seconds: string`

    生成片段的时长（秒）。对于扩展，这是拼接后的总时长。

  - `size: VideoSize`

    所生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    视频任务当前的生命周期状态。

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

## Create an extension of a completed video.

**post** `/videos/extensions`

创建已完成视频的扩展。

### 正文参数

- `prompt: string`

  用于指导扩展生成环节的更新后文本提示词。

- `seconds: VideoSeconds`

  新生成的扩展片段时长（单位为秒，允许的值：4、8、12、16、20）。

  - `"4"`

  - `"8"`

  - `"12"`

- `video: object { id }`

  对已完成视频的引用，用于对其进行扩展。

  - `id: string`

    已完成视频的标识符。

### Returns

- `Video object { id, completed_at, created_at, 10 more }`

  描述生成的视频任务的结构化信息。

  - `id: string`

    视频任务的唯一标识符。

  - `completed_at: number or null`

    任务完成时的 Unix 时间戳（秒），如果已完成。

  - `created_at: number`

    任务创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    用于解释生成失败原因的错误负载（如适用）。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回错误的人类可读描述。

  - `expires_at: number or null`

    可下载资源过期时的 Unix 时间戳（秒），如果已设置。

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

    用于生成该视频的提示词。

  - `remixed_from_video_id: string or null`

    如果该视频为二次创作，则为源视频的标识符。

  - `seconds: string`

    生成片段的时长（秒）。对于扩展，这是拼接后的总时长。

  - `size: VideoSize`

    所生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    视频任务当前的生命周期状态。

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

**get** `/videos/characters/{character_id}`

获取一个字符。

### 路径参数

- `character_id: string`

### Returns

- `id: string or null`

  角色创建 cameo 的标识符。

- `created_at: number`

  角色创建时的 Unix 时间戳（以秒为单位）。

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

**get** `/videos`

列出当前项目最近生成的视频。

### 查询参数

- `after: optional string`

  上一次分页请求中最后一项的标识符

- `limit: optional number`

  要检索的项目数量

- `order: optional "asc" or "desc"`

  按时间戳对结果进行排序。使用 `asc` 表示升序，或使用 `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### Returns

- `data: array of Video`

  项目列表

  - `id: string`

    视频任务的唯一标识符。

  - `completed_at: number or null`

    任务完成时的 Unix 时间戳（秒），如果已完成。

  - `created_at: number`

    任务创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    用于解释生成失败原因的错误负载（如适用）。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回错误的人类可读描述。

  - `expires_at: number or null`

    可下载资源过期时的 Unix 时间戳（秒），如果已设置。

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

    用于生成该视频的提示词。

  - `remixed_from_video_id: string or null`

    如果该视频为二次创作，则为源视频的标识符。

  - `seconds: string`

    生成片段的时长（秒）。对于扩展，这是拼接后的总时长。

  - `size: VideoSize`

    所生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    视频任务当前的生命周期状态。

    - `"queued"`

    - `"in_progress"`

    - `"completed"`

    - `"failed"`

- `first_id: string or null`

  列表中第一项的 ID。

- `has_more: boolean`

  是否还有更多可用项。

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

## Remix video

**post** `/videos/{video_id}/remix`

使用更新后的提示词创建已生成视频的混剪版本。

### 路径参数

- `video_id: string`

### 正文参数

- `prompt: string`

  更新后的文本提示，用于引导 remix 生成。

### Returns

- `Video object { id, completed_at, created_at, 10 more }`

  描述生成的视频任务的结构化信息。

  - `id: string`

    视频任务的唯一标识符。

  - `completed_at: number or null`

    任务完成时的 Unix 时间戳（秒），如果已完成。

  - `created_at: number`

    任务创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    用于解释生成失败原因的错误负载（如适用）。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回错误的人类可读描述。

  - `expires_at: number or null`

    可下载资源过期时的 Unix 时间戳（秒），如果已设置。

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

    用于生成该视频的提示词。

  - `remixed_from_video_id: string or null`

    如果该视频为二次创作，则为源视频的标识符。

  - `seconds: string`

    生成片段的时长（秒）。对于扩展，这是拼接后的总时长。

  - `size: VideoSize`

    所生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    视频任务当前的生命周期状态。

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

**get** `/videos/{video_id}`

获取所生成视频的最新元数据。

### 路径参数

- `video_id: string`

### Returns

- `Video object { id, completed_at, created_at, 10 more }`

  描述生成的视频任务的结构化信息。

  - `id: string`

    视频任务的唯一标识符。

  - `completed_at: number or null`

    任务完成时的 Unix 时间戳（秒），如果已完成。

  - `created_at: number`

    任务创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    用于解释生成失败原因的错误负载（如适用）。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回错误的人类可读描述。

  - `expires_at: number or null`

    可下载资源过期时的 Unix 时间戳（秒），如果已设置。

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

    用于生成该视频的提示词。

  - `remixed_from_video_id: string or null`

    如果该视频为二次创作，则为源视频的标识符。

  - `seconds: string`

    生成片段的时长（秒）。对于扩展，这是拼接后的总时长。

  - `size: VideoSize`

    所生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    视频任务当前的生命周期状态。

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

## 域类型

### 图片输入参考参数

- `ImageInputReferenceParam object { file_id, image_url }`

  - `file_id: optional string`

  - `image_url: optional string`

    完整的 URL 或 base64 编码的 data URL。

### 视频

- `Video object { id, completed_at, created_at, 10 more }`

  描述生成的视频任务的结构化信息。

  - `id: string`

    视频任务的唯一标识符。

  - `completed_at: number or null`

    任务完成时的 Unix 时间戳（秒），如果已完成。

  - `created_at: number`

    任务创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    用于解释生成失败原因的错误负载（如适用）。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回错误的人类可读描述。

  - `expires_at: number or null`

    可下载资源过期时的 Unix 时间戳（秒），如果已设置。

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

    用于生成该视频的提示词。

  - `remixed_from_video_id: string or null`

    如果该视频为二次创作，则为源视频的标识符。

  - `seconds: string`

    生成片段的时长（秒）。对于扩展，这是拼接后的总时长。

  - `size: VideoSize`

    所生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    视频任务当前的生命周期状态。

    - `"queued"`

    - `"in_progress"`

    - `"completed"`

    - `"failed"`

### Video Create Character 响应

- `VideoCreateCharacterResponse object { id, created_at, name }`

  - `id: string or null`

    角色创建 cameo 的标识符。

  - `created_at: number`

    角色创建时的 Unix 时间戳（以秒为单位）。

  - `name: string or null`

    角色的显示名称。

### Video Create 错误

- `VideoCreateError object { code, message }`

  生成响应过程中发生的错误。

  - `code: string`

    返回的机器可读错误代码。

  - `message: string`

    返回错误的人类可读描述。

### Video Delete Response

- `VideoDeleteResponse object { id, deleted, object }`

  删除视频后返回的确认负载。

  - `id: string`

    已删除视频的标识符。

  - `deleted: boolean`

    指示视频资源已被删除。

  - `object: "video.deleted"`

    表示删除响应的对象类型。

    - `"video.deleted"`

### Video Get Character Response

- `VideoGetCharacterResponse object { id, created_at, name }`

  - `id: string or null`

    角色创建 cameo 的标识符。

  - `created_at: number`

    角色创建时的 Unix 时间戳（以秒为单位）。

  - `name: string or null`

    角色的显示名称。

### Video Model

- `VideoModel = string or "sora-2" or "sora-2-pro" or "sora-2-2025-10-06" or 2 more`

  - `string`

  - `"sora-2" or "sora-2-pro" or "sora-2-2025-10-06" or 2 more`

    - `"sora-2"`

    - `"sora-2-pro"`

    - `"sora-2-2025-10-06"`

    - `"sora-2-pro-2025-10-06"`

    - `"sora-2-2025-12-08"`

### Video Seconds

- `VideoSeconds = "4" or "8" or "12"`

  - `"4"`

  - `"8"`

  - `"12"`

### Video Size

- `VideoSize = "720x1280" or "1280x720" or "1024x1792" or "1792x1024"`

  - `"720x1280"`

  - `"1280x720"`

  - `"1024x1792"`

  - `"1792x1024"`
