> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## Create voice

**post** `/audio/voices`

根据文本提示或同意录音和音频样本创建语音。

对于基于提示的创建，请发送 `type: "prompt"` 以及一个 `name` ，作为 `prompt` 的 JSON 或 multipart 表单数据。基于同意的创建需要 multipart 表单数据，并且在省略时默认为 `type` 。

返回已保存语音的元数据。请在支持的音频输出端点中使用该语音 ID。响应中不包含预览音频。

### Body 参数

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

  语音在创建过程中朗读的可选文本。如果省略，则会根据提示生成脚本。去除首尾空白后不能为空；过短的脚本会被拒绝。

### 返回值

- `Voice object { id, created_at, name, object }`

  可用于音频输出的自定义语音。

  - `id: string`

    语音标识符，可在 API 端点中引用。

  - `created_at: number`

    语音创建时的 Unix 时间戳（以秒为单位）。

  - `name: string`

    语音的名称。

  - `object: "audio.voice"`

    对象类型，始终为 `audio.voice`.

    - `"audio.voice"`

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
  "object": "audio.voice"
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
