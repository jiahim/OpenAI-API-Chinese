# 视频

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 。

## Create a video

**post** `/videos`

根据提示词和可选的参考素材创建一个新的视频生成任务。

### Body Parameters

- `prompt: string`

  用于描述要生成视频的文本提示词。

- `input_reference: optional ImageInputReferenceParam`

  用于引导生成的可选参考对象。需提供以下其中之一 `image_url` 或 `file_id`.

  - `file_id: optional string`

  - `image_url: optional string`

    完全限定的 URL 或 base64 编码的 data URL。

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

  片段时长（单位：秒；允许的值：4、8、12）。默认为 4 秒。

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

    - `misalignment: optional object { detailed_explanation, error_type, steer }`

      - `detailed_explanation: optional string`

        针对此阻止操作的对外公开说明。

      - `error_type: optional string or "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

        一个可选的分类；客户端必须接受额外的值。

        - `string`

        - `SafetyAlertErrorType = "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

          一个可选的分类；客户端必须接受额外的值。

          - `"potentially_unintended_data_transfer"`

          - `"potentially_unintended_data_access"`

          - `"potentially_unintended_destructive_activity"`

          - `"other"`

      - `steer: optional object { message }`

        可选的对外公开延续指令。

        - `message: string`

          对外公开的延续指令。

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

    用于生成视频的提示词。

  - `remixed_from_video_id: string or null`

    如果该视频为二次创作，则为源视频的标识符。

  - `seconds: string`

    生成片段的时长（以秒为单位）。对于扩展片段，这是拼接后的总时长。

  - `size: VideoSize`

    生成视频的分辨率。

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
    "message": "message",
    "misalignment": {
      "detailed_explanation": "detailed_explanation",
      "error_type": "potentially_unintended_data_transfer",
      "steer": {
        "message": "message"
      }
    }
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

## 创建一个角色

**post** `/videos/characters`

根据上传的视频创建一个角色。

### Returns

- `id: string or null`

  角色创建的 cameo 标识符。

- `created_at: number`

  创建该角色的 Unix 时间戳（单位为秒）。

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

永久删除已完成或失败的视频及其存储资源。

### 路径参数

- `video_id: string`

### Returns

- `id: string`

  已删除视频的标识符。

- `deleted: boolean`

  表示视频资源已被删除。

- `object: "video.deleted"`

  用于表示删除响应的对象类型。

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

## 下载视频内容

**get** `/videos/{video_id}/content`

下载生成的视频字节或派生的预览资源。

为指定的视频任务流式传输渲染后的视频内容。

### 路径参数

- `video_id: string`

### 查询参数

- `variant: optional "video" or "thumbnail" or "spritesheet"`

  要返回的下载资源。默认为 MP4 视频。

  - `"video"`

  - `"thumbnail"`

  - `"spritesheet"`

### 示例

```http
curl https://api.openai.com/v1/videos/$VIDEO_ID/content \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Create a video edit

**post** `/videos/edits`

通过编辑源视频或已有的已生成视频，创建一个新的视频生成任务。

### Body Parameters

- `prompt: string`

  用于描述如何编辑源视频的文本提示。

- `video: object { id }`

  引用要编辑的已完成视频。

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

    - `misalignment: optional object { detailed_explanation, error_type, steer }`

      - `detailed_explanation: optional string`

        针对此阻止操作的对外公开说明。

      - `error_type: optional string or "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

        一个可选的分类；客户端必须接受额外的值。

        - `string`

        - `SafetyAlertErrorType = "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

          一个可选的分类；客户端必须接受额外的值。

          - `"potentially_unintended_data_transfer"`

          - `"potentially_unintended_data_access"`

          - `"potentially_unintended_destructive_activity"`

          - `"other"`

      - `steer: optional object { message }`

        可选的对外公开延续指令。

        - `message: string`

          对外公开的延续指令。

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

    用于生成视频的提示词。

  - `remixed_from_video_id: string or null`

    如果该视频为二次创作，则为源视频的标识符。

  - `seconds: string`

    生成片段的时长（以秒为单位）。对于扩展片段，这是拼接后的总时长。

  - `size: VideoSize`

    生成视频的分辨率。

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
    "message": "message",
    "misalignment": {
      "detailed_explanation": "detailed_explanation",
      "error_type": "potentially_unintended_data_transfer",
      "steer": {
        "message": "message"
      }
    }
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

## 创建视频扩展

**post** `/videos/extensions`

创建一个已完成视频的扩展。

### Body Parameters

- `prompt: string`

  用于指导扩展生成的更新后文本提示词。

- `seconds: VideoSeconds`

  新生成扩展片段的时长（以秒为单位，允许的值：4、8、12、16、20）。

  - `"4"`

  - `"8"`

  - `"12"`

- `video: object { id }`

  对已完成的视频的引用，用于扩展。

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

    - `misalignment: optional object { detailed_explanation, error_type, steer }`

      - `detailed_explanation: optional string`

        针对此阻止操作的对外公开说明。

      - `error_type: optional string or "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

        一个可选的分类；客户端必须接受额外的值。

        - `string`

        - `SafetyAlertErrorType = "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

          一个可选的分类；客户端必须接受额外的值。

          - `"potentially_unintended_data_transfer"`

          - `"potentially_unintended_data_access"`

          - `"potentially_unintended_destructive_activity"`

          - `"other"`

      - `steer: optional object { message }`

        可选的对外公开延续指令。

        - `message: string`

          对外公开的延续指令。

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

    用于生成视频的提示词。

  - `remixed_from_video_id: string or null`

    如果该视频为二次创作，则为源视频的标识符。

  - `seconds: string`

    生成片段的时长（以秒为单位）。对于扩展片段，这是拼接后的总时长。

  - `size: VideoSize`

    生成视频的分辨率。

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
    "message": "message",
    "misalignment": {
      "detailed_explanation": "detailed_explanation",
      "error_type": "potentially_unintended_data_transfer",
      "steer": {
        "message": "message"
      }
    }
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

## 获取一个字符

**get** `/videos/characters/{character_id}`

获取一个字符。

### 路径参数

- `character_id: string`

### Returns

- `id: string or null`

  角色创建的 cameo 标识符。

- `created_at: number`

  创建该角色的 Unix 时间戳（单位为秒）。

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

  按时间戳对结果进行排序。使用 `asc` 表示升序，或 `desc` 表示降序。

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

    - `misalignment: optional object { detailed_explanation, error_type, steer }`

      - `detailed_explanation: optional string`

        针对此阻止操作的对外公开说明。

      - `error_type: optional string or "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

        一个可选的分类；客户端必须接受额外的值。

        - `string`

        - `SafetyAlertErrorType = "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

          一个可选的分类；客户端必须接受额外的值。

          - `"potentially_unintended_data_transfer"`

          - `"potentially_unintended_data_access"`

          - `"potentially_unintended_destructive_activity"`

          - `"other"`

      - `steer: optional object { message }`

        可选的对外公开延续指令。

        - `message: string`

          对外公开的延续指令。

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

    用于生成视频的提示词。

  - `remixed_from_video_id: string or null`

    如果该视频为二次创作，则为源视频的标识符。

  - `seconds: string`

    生成片段的时长（以秒为单位）。对于扩展片段，这是拼接后的总时长。

  - `size: VideoSize`

    生成视频的分辨率。

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
        "message": "message",
        "misalignment": {
          "detailed_explanation": "detailed_explanation",
          "error_type": "potentially_unintended_data_transfer",
          "steer": {
            "message": "message"
          }
        }
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

## Create a video remix

**post** `/videos/{video_id}/remix`

使用新的提示创建一个已完成视频的混剪版本。

### 路径参数

- `video_id: string`

### Body Parameters

- `prompt: string`

  用于引导混音版本生成的更新后文本提示词。

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

    - `misalignment: optional object { detailed_explanation, error_type, steer }`

      - `detailed_explanation: optional string`

        针对此阻止操作的对外公开说明。

      - `error_type: optional string or "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

        一个可选的分类；客户端必须接受额外的值。

        - `string`

        - `SafetyAlertErrorType = "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

          一个可选的分类；客户端必须接受额外的值。

          - `"potentially_unintended_data_transfer"`

          - `"potentially_unintended_data_access"`

          - `"potentially_unintended_destructive_activity"`

          - `"other"`

      - `steer: optional object { message }`

        可选的对外公开延续指令。

        - `message: string`

          对外公开的延续指令。

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

    用于生成视频的提示词。

  - `remixed_from_video_id: string or null`

    如果该视频为二次创作，则为源视频的标识符。

  - `seconds: string`

    生成片段的时长（以秒为单位）。对于扩展片段，这是拼接后的总时长。

  - `size: VideoSize`

    生成视频的分辨率。

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
    "message": "message",
    "misalignment": {
      "detailed_explanation": "detailed_explanation",
      "error_type": "potentially_unintended_data_transfer",
      "steer": {
        "message": "message"
      }
    }
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

获取已生成视频的最新元数据。

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

    - `misalignment: optional object { detailed_explanation, error_type, steer }`

      - `detailed_explanation: optional string`

        针对此阻止操作的对外公开说明。

      - `error_type: optional string or "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

        一个可选的分类；客户端必须接受额外的值。

        - `string`

        - `SafetyAlertErrorType = "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

          一个可选的分类；客户端必须接受额外的值。

          - `"potentially_unintended_data_transfer"`

          - `"potentially_unintended_data_access"`

          - `"potentially_unintended_destructive_activity"`

          - `"other"`

      - `steer: optional object { message }`

        可选的对外公开延续指令。

        - `message: string`

          对外公开的延续指令。

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

    用于生成视频的提示词。

  - `remixed_from_video_id: string or null`

    如果该视频为二次创作，则为源视频的标识符。

  - `seconds: string`

    生成片段的时长（以秒为单位）。对于扩展片段，这是拼接后的总时长。

  - `size: VideoSize`

    生成视频的分辨率。

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
    "message": "message",
    "misalignment": {
      "detailed_explanation": "detailed_explanation",
      "error_type": "potentially_unintended_data_transfer",
      "steer": {
        "message": "message"
      }
    }
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

### 图像输入参考参数

- `ImageInputReferenceParam object { file_id, image_url }`

  - `file_id: optional string`

  - `image_url: optional string`

    完全限定的 URL 或 base64 编码的 data URL。

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

    - `misalignment: optional object { detailed_explanation, error_type, steer }`

      - `detailed_explanation: optional string`

        针对此阻止操作的对外公开说明。

      - `error_type: optional string or "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

        一个可选的分类；客户端必须接受额外的值。

        - `string`

        - `SafetyAlertErrorType = "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

          一个可选的分类；客户端必须接受额外的值。

          - `"potentially_unintended_data_transfer"`

          - `"potentially_unintended_data_access"`

          - `"potentially_unintended_destructive_activity"`

          - `"other"`

      - `steer: optional object { message }`

        可选的对外公开延续指令。

        - `message: string`

          对外公开的延续指令。

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

    用于生成视频的提示词。

  - `remixed_from_video_id: string or null`

    如果该视频为二次创作，则为源视频的标识符。

  - `seconds: string`

    生成片段的时长（以秒为单位）。对于扩展片段，这是拼接后的总时长。

  - `size: VideoSize`

    生成视频的分辨率。

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

### 视频创建角色响应

- `VideoCreateCharacterResponse object { id, created_at, name }`

  - `id: string or null`

    角色创建的 cameo 标识符。

  - `created_at: number`

    创建该角色的 Unix 时间戳（单位为秒）。

  - `name: string or null`

    角色的显示名称。

### 视频创建错误

- `VideoCreateError object { code, message, misalignment }`

  生成响应时发生的错误。

  - `code: string`

    返回的机器可读错误代码。

  - `message: string`

    返回错误的人类可读描述。

  - `misalignment: optional object { detailed_explanation, error_type, steer }`

    - `detailed_explanation: optional string`

      针对此阻止操作的对外公开说明。

    - `error_type: optional string or "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

      一个可选的分类；客户端必须接受额外的值。

      - `string`

      - `SafetyAlertErrorType = "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

        一个可选的分类；客户端必须接受额外的值。

        - `"potentially_unintended_data_transfer"`

        - `"potentially_unintended_data_access"`

        - `"potentially_unintended_destructive_activity"`

        - `"other"`

    - `steer: optional object { message }`

      可选的对外公开延续指令。

      - `message: string`

        对外公开的延续指令。

### 视频删除响应

- `VideoDeleteResponse object { id, deleted, object }`

  删除视频后返回的确认载荷。

  - `id: string`

    已删除视频的标识符。

  - `deleted: boolean`

    表示视频资源已被删除。

  - `object: "video.deleted"`

    用于表示删除响应的对象类型。

    - `"video.deleted"`

### 视频获取角色响应

- `VideoGetCharacterResponse object { id, created_at, name }`

  - `id: string or null`

    角色创建的 cameo 标识符。

  - `created_at: number`

    创建该角色的 Unix 时间戳（单位为秒）。

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

### 视频尺寸

- `VideoSize = "720x1280" or "1280x720" or "1024x1792" or "1792x1024"`

  - `"720x1280"`

  - `"1280x720"`

  - `"1024x1792"`

  - `"1792x1024"`
