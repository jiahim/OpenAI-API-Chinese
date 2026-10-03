> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## Create voice

**post** `/audio/voices`

通过文本提示或同意录音加音频样本来创建语音。

对于基于提示的创建，请发送 `type: "prompt"` 以及一个 `name` 和 `prompt` 作为 JSON 或 multipart 表单数据。对于从音频样本创建，请发送 `type: "audio_sample"` 以及一个 `name`, `audio_sample`，以及 `consent` 录音 ID 作为 multipart 表单数据。如果省略，类型默认为 `audio_sample` 。

返回已保存语音的元数据。通过文本提示创建的语音仅在 Live 中受支持，在 Realtime 或语音接口中不受支持。响应中不包含预览音频。

### Body Parameters

- `name: string`

  新语音的名称。

- `prompt: string`

  对所需语音的描述。不能仅包含空白字符。

- `type: "prompt"`

  设置为 `prompt` 以根据文本描述创建语音。

  - `"prompt"`

- `model: optional string or "auto" or "2026-10-01"`

  要使用的语音创建模型。默认为 `auto`.

  - `string`

  - `"auto" or "2026-10-01"`

    要使用的语音创建模型。默认为 `auto`.

    - `"auto"`

    - `"2026-10-01"`

- `script_hint: optional string`

  语音在创建过程中朗读的可选文本。若省略，则根据提示生成脚本。去除首尾空白后不能为空；过短的脚本将被拒绝。

### Returns

- `Voice object { id, created_at, name, 2 more }`

  一个可用于音频输出的自定义语音。仅 Live 支持通过文本提示创建的语音。

  - `id: string`

    语音标识符，可在 API 端点中引用。

  - `created_at: number`

    语音创建时的 Unix 时间戳（秒）。

  - `name: string`

    语音的名称。

  - `object: "audio.voice"`

    对象类型，始终为 `audio.voice`.

    - `"audio.voice"`

  - `type: "audio_sample" or "prompt"`

    语音的创建方式。仅 Live 支持通过文本提示创建的语音。

    - `"audio_sample"`

    - `"prompt"`

### 示例

```http
curl https://api.openai.com/v1/audio/voices \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "name": "x",
          "prompt": "x",
          "type": "prompt"
        }'
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "name": "name",
  "object": "audio.voice",
  "type": "audio_sample"
}
```

### 示例

```http
curl https://api.openai.com/v1/audio/voices \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "prompt",
    "name": "Warm narrator",
    "prompt": "A warm, calm narrator with a clear, measured delivery.",
    "model": "auto"
  }'
```
