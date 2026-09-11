# 自定义语音

> 完整的文档索引请参见 [llms.txt](/llms.txt). 可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

自定义声音可让你为智能体或应用程序打造独特的声音。这些声音可用于 [Text to Speech API](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create)、 [Realtime API](https://developers.openai.com/api/reference/resources/realtime)，或 [Chat Completions API 的音频输出](https://developers.openai.com/api/docs/guides/audio-chat-completions).

要创建自定义声音，你需要提供一段简短的音频参考样本，供模型尝试复刻。



    {"Custom voices are limited to eligible customers. Contact our "}
    [{"sales team"}](https://openai.com/contact-sales/)
    {
      " to learn more. Once enabled for your organization, you’ll have access to the "
    }
    [{"Voices"}](https://platform.openai.com/audio/voices)
    {" tab under Audio."}
  


## 创建语音

目前，语音必须通过 API 请求创建。有关完整的 API 操作集，请参阅 API 参考文档。

创建一个语音需要两段独立的音频录制：

1. **同意录音：** 此录音记录了配音演员同意创建其声音的拟声样本。演员必须朗读下方提供的同意语句之一。
2. **样本录音：** 模型将尝试遵循的实际音频样本。声音必须与同意录音一致。

**创建高质量语音的技巧**

自定义语音的质量在很大程度上取决于你所提供样本的质量。优化录音质量可以带来显著差异。

- 在安静、回声极少的空间内录制。
- 使用专业的 XLR 麦克风。
- 与麦克风保持约 7–8 英寸的距离，中间放置防喷罩，并保持距离一致。
- 模型会原样复制你提供的内容——语气、节奏、能量、停顿、习惯——因此请录制出你想要的真实声音。整段录音在能量、风格和口音上要保持一致。
- 音频样本中的细微差异都可能导致生成语音的质量差别。请尝试多个样本，找到最合适的那一个。

**要求与限制**

- 每个组织最多可创建 20 个音色。
- 音频样本时长不得超过 30 秒。
- 音频样本必须是以下类型之一： `mpeg`, `wav`, `ogg`, `aac`, `flac`, `webm`，或 `mp4`.

其他使用条款请参阅 Text-to-Speech 补充协议。

**创建语音授权**

授权录音必须仅包含以下任一短语。任何偏离脚本的情况都将导致失败。

| 语言 | 短语                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `de`     | Ich bin der Eigentümer dieser Stimme und bin damit einverstanden, dass OpenAI diese Stimme zur Erstellung eines synthetischen Stimmmodells verwendet. |
| `en`     | I am the owner of this voice and I consent to OpenAI using this voice to create a synthetic voice model.                                              |
| `es`     | Soy el propietario de esta voz y doy mi consentimiento para que OpenAI la utilice para crear un modelo de voz sintética.                              |
| `fr`     | Je suis le propriétaire de cette voix et j'autorise OpenAI à utiliser cette voix pour créer un modèle de voix synthétique.                            |
| `hi`     | मैं इस आवाज का मालिक हूं और मैं सिंथेटिक आवाज मॉडल बनाने के लिए OpenAI को इस आवाज का उपयोग करने की सहमति देता हूं                                     |
| `id`     | Saya adalah pemilik suara ini dan saya memberikan persetujuan kepada OpenAI untuk menggunakan suara ini guna membuat model suara sintetis.            |
| `it`     | Sono il proprietario di questa voce e acconsento che OpenAI la utilizzi per creare un modello di voce sintetica.                                      |
| `ja`     | 私はこの音声の所有者であり、OpenAIがこの音声を使用して音声合成 モデルを作成することを承認します。                                                     |
| `ko`     | 나는 이 음성의 소유자이며 OpenAI가 이 음성을 사용하여 음성 합성 모델을 생성할 것을 허용합니다.                                                        |
| `nl`     | Ik ben de eigenaar van deze stem en ik geef OpenAI toestemming om deze stem te gebruiken om een synthetisch stemmodel te maken.                       |
| `pl`     | Jestem właścicielem tego głosu i wyrażam zgodę na wykorzystanie go przez OpenAI w celu utworzenia syntetycznego modelu głosu.                         |
| `pt`     | Eu sou o proprietário desta voz e autorizo o OpenAI a usá-la para criar um modelo de voz sintética.                                                   |
| `ru`     | Я являюсь владельцем этого голоса и даю согласие OpenAI на использование этого голоса для создания модели синтетического голоса.                      |
| `uk`     | Я є власником цього голосу і даю згоду OpenAI використовувати цей голос для створення синтетичної голосової моделі.                                   |
| `vi`     | Tôi là chủ sở hữu giọng nói này và tôi đồng ý cho OpenAI sử dụng giọng nói này để tạo mô hình giọng nói tổng hợp.                                     |
| `zh`     | 我是此声音的拥有者并授权OpenAI使用此声音创建语音合成模型                                                                                              |

然后通过 API 上传录音。上传成功后会返回同意录音 ID,你稍后会引用它。请注意,如果同一配音演员进行多次尝试,该同意可用于多次不同的语音创建。

```bash
curl https://api.openai.com/v1/audio/voice_consents \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "name=test_consent" \
  -F "language=en" \
  -F "recording=@$HOME/tmp/voice_consent/consent_recording.wav;type=audio/x-wav"
```


**创建语音**

接下来,你将通过引用同意录音 ID 并提供语音样本来创建实际的语音。

```bash
curl https://api.openai.com/v1/audio/voices \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "name=test_voice" \
  -F "audio_sample=@$HOME/tmp/voice_consent/audio_sample_recording.wav;type=audio/x-wav" \
  -F "consent=cons_123abc"
```


如果成功,创建的语音将列在 [音频选项卡](https://platform.openai.com/audio/voices).

## 在语音生成过程中使用语音

语音生成将照常工作。在创建语音时，于 `voice` 参数中指定语音的 ID， [创建语音](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create)，或在发起 [实时会话](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/create#realtime_create_call-session-audio-output-voice).

**文字转语音示例**

```bash
curl https://api.openai.com/v1/audio/speech \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini-tts",
    "voice": {
      "id": "voice_123abc"
    },
    "input": "Maple est le meilleur golden retriever du monde entier.",
    "language": "fr",
    "format": "wav"
  }' \
  --output sample.wav
```


**Realtime API 示例**

对于 Ruby，在运行示例之前设置 `OPENAI_VOICE_ID` 为你的自定义语音 ID。

```javascript
const sessionConfig = JSON.stringify({
  session: {
    type: "realtime",
    model: "gpt-realtime-2",
    audio: {
      output: {
        voice: { id: "voice_123abc" },
      },
    },
  },
});
```

```ruby
require "json"

session_config = JSON.generate(
  session: {
    type: "realtime",
    model: "gpt-realtime-2",
    audio: { output: { voice: { id: ENV.fetch("OPENAI_VOICE_ID") } } }
  }
)
puts(session_config)
```


## 在 GPT-Live 中使用自定义音色

使用经批准同时用于 GPT-Live 和自定义语音创建的项目级 API 密钥
。读取同意用语和使用自定义语音需要
`api.voices.read`；创建同意和语音需要 `api.voices.write` 以及
自定义语音 API 访问权限。每个请求都使用同一项目，并将 API
密钥放在受信服务器上。

### 准备录音

在录音前先列出当前支持的同意用语：

```bash
curl https://api.openai.com/v1/audio/consent_phrases \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

同意录音与参考样本必须来自同一个人。该
样本需要至少 5 秒的实际语音以及至少 15 个转写
文本 token，静音不计入时长。建议录制 10–30 秒
的音频，并包含若干完整句子。每次上传大小上限为 10 MiB。
参考转写文本由服务端提取，请勿上传转写 token，
配置解码器或添加自定义请求头。

浏览器录音器可能会将音频标记为 `audio/webm;codecs=opus`，而上传
端点会拒绝此类文件。构造上传时，请使用受支持的基础 MIME 类型
`audio/webm` ，同时保留原始音频字节。使用上述同意和语音
创建请求，然后保存返回的语音 ID。

### 在创建会话时选择语音

将自定义语音作为对象 `{ "id": "voice_123" }`，传递，而不是字符串
`"voice_123"`。命名语音（如 `"marin"` ）使用字符串。

`gpt-live-1` 支持带有英语口音的自定义语音。若要使用口音，还需在
中指定，例如“Speak British English”或“Speak `session.instructions`，Irish English”。
下面的示例使用英式英语；请修改指令
以匹配你希望自定义语音使用的口音。

在初始会话中包含以下配置：

```json
{
  "model": "gpt-live-1",
  "instructions": "You are a helpful voice assistant. Speak British English.",
  "audio": { "output": { "voice": { "id": "voice_123" } } }
}
```

对于 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live)，受信会话代理会将此配置放入
的 JSON 中，与 `session` 字段一起。 `transport`.
Live 端点需要使用 JSON，而不是 multipart 或原始 SDP。请从
中读取创建的 `session.id` 会话 ID，从 `transport.sdp`。中读取 SDP 应答。请使用应用凭据对
托管代理的请求进行身份验证；切勿泄露 OpenAI 的 接口 密钥。
将API key 发送到浏览器。

对于 [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=live),将配置
放入第一个 `session.start` 事件中。建立连接时不带查询参数,然后等待
以 `session.started` 后再开始流式传输音频。通过
`session.input_audio.append`。发送音频。发送完成后, `session.close`，持续接收,直到收到
`session.closed` 提供最终用量信息为止。

### 处理访问和生命周期失败

- Live 会话开始后无法更改输出语音。若要使用其他语音，请启动新会话。
- 已删除或已撤销的语音、来自其他项目的授权，或缺少自定义语音访问权限，都可能显示为 `404`.
- 格式错误的音频、不匹配的说话人，或非项目范围内的密钥将被拒绝。

在创建语音之前，请确认你项目的权限、录制时长下限和上传上限。
请参阅 [GPT-Live 入门指南](https://developers.openai.com/api/docs/guides/live)
了解会话设置要求。