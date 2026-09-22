> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## Retrieve a video

**get** `/videos/{video_id}`

获取生成视频的最新元数据。

### 路径参数

- `video_id: string`

### 返回值

- `Video object { id, completed_at, created_at, 10 more }`

  描述已生成视频任务的结构化信息。

  - `id: string`

    视频任务的唯一标识符。

  - `completed_at: number or null`

    任务完成时的 Unix 时间戳（秒），如果已完成。

  - `created_at: number`

    任务创建时的 Unix 时间戳（秒）。

  - `error: VideoCreateError or null`

    用于解释生成失败原因的错误负载（如果适用）。

    - `code: string`

      返回的机器可读错误代码。

    - `message: string`

      返回的错误的人类可读描述。

    - `headers: optional map[string]`

      原始错误返回的 Retry-After 和 Retry-After-Ms 标头（如果有）。

    - `misalignment: optional object { detailed_explanation, error_type, steer }`

      - `detailed_explanation: optional string`

        此拦截的公开说明。

      - `error_type: optional string or "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

        一个可选的分类；客户端必须接受其他值。

        - `string`

        - `SafetyAlertErrorType = "potentially_unintended_data_transfer" or "potentially_unintended_data_access" or "potentially_unintended_destructive_activity" or "other"`

          一个可选的分类；客户端必须接受其他值。

          - `"potentially_unintended_data_transfer"`

          - `"potentially_unintended_data_access"`

          - `"potentially_unintended_destructive_activity"`

          - `"other"`

      - `steer: optional object { message }`

        一个可选的公开 延续 指令。

        - `message: string`

          公开的 延续 指令。

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

    所生成视频的分辨率。

    - `"720x1280"`

    - `"1280x720"`

    - `"1024x1792"`

    - `"1792x1024"`

  - `status: "queued" or "in_progress" or "completed" or "failed"`

    该视频任务的当前生命周期状态。

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
    "headers": {
      "foo": "string"
    },
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
