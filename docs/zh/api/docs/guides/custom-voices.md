# Custom voices

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

自定义语音让你可以为你的智能体或应用打造独特的声音。这些语音可用于 [Text to Speech API](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create)，的音频输出、 [Realtime API](https://developers.openai.com/api/reference/resources/realtime)，或 [Chat Completions API with audio output](https://developers.openai.com/api/docs/guides/audio-chat-completions).

若要创建自定义语音，你需要提供一段简短的音频参考样本，模型将据此进行复刻。



    {"Custom voices are limited to eligible customers. Contact our "}
    [{"sales team"}](https://openai.com/contact-sales/)
    {
      " to learn more. Once enabled for your organization, you’ll have access to the "
    }
    [{"Voices"}](https://platform.openai.com/audio/voices)
    {" tab under Audio."}
  


## 创建语音

目前，必须通过 API 请求来创建语音。完整的 API 操作列表请参阅 API 参考。

创建一个语音需要两段独立的音频录音：

1. **知情同意录音：** 该录音记录了配音演员同意制作其声音复刻的过程。演员必须朗读下面提供的知情同意用语之一。
2. **样本录音：** 模型将尝试参照的实际音频样本。该声音必须与知情同意录音一致。

**打造高质量语音的技巧**

自定义语音的质量在很大程度上取决于你所提供样本的质量。优化录音质量会带来明显的提升。

- 在安静、回声较少的空间中录音。
- 使用专业的 XLR 麦克风。
- 与麦克风保持约 7–8 英寸的距离，中间放置防喷罩，并始终保持该距离。
- 模型会完全复制你提供的音色——语气、节奏、能量、停顿、习惯——因此请录制你真正想要的声音。在整个录制过程中保持能量、风格和口音的一致性。
- 音频样本中的细微差异都会导致生成声音的质量有所不同。请尝试多个样本以找到最佳匹配。

**要求与限制**

- 每个组织最多可创建 20 个语音。
- 音频样本时长不得超过 30 秒。
- 音频样本必须是以下类型之一： `mpeg`, `wav`, `ogg`, `aac`, `flac`, `webm`，或 `mp4`.

更多使用条款请参阅 Text-to-Speech 补充协议。

**录制声音授权**

授权音频录音只能包含以下其中一种表述。任何偏离脚本的内容都会导致失败。

| 语言 | 短语                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `de`     | 我是该声音的拥有者，并同意OpenAI使用该声音来创建合成声音模型。 |
| `en`     | 我是该声音的拥有者，并同意OpenAI使用该声音来创建合成声音模型。                                              |
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

然后通过 API 上传录音。上传成功后会返回同意录音 ID，你稍后会引用该 ID。请注意，如果同一配音演员进行多次尝试，同意录音可用于多次不同的语音创建。

```bash
curl https://api.openai.com/v1/audio/voice_consents \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "name=test_consent" \
  -F "language=en" \
  -F "recording=@$HOME/tmp/voice_consent/consent_recording.wav;type=audio/x-wav"
```


**创建语音**

接下来，你将通过引用同意录音 ID 并提供语音样本来创建实际的语音。

```bash
curl https://api.openai.com/v1/audio/voices \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "name=test_voice" \
  -F "audio_sample=@$HOME/tmp/voice_consent/audio_sample_recording.wav;type=audio/x-wav" \
  -F "consent=cons_123abc"
```


如果成功，创建的语音将列在 [音频选项卡](https://platform.openai.com/audio/voices).

## 在语音生成过程中使用语音

语音生成将照常工作。在创建语音 `voice` 时，在参数中指定语音的 ID， [创建语音](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create)，或在发起 [实时会话](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/create#realtime_create_call-session-audio-output-voice).

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


**实时 API 示例**

对于 Ruby，请将 `voice_123` 替换为你自定义的语音 ID 后再运行该示例。

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
# Replace the illustrative IDs and URLs below with your own resource values.
require "json"

session_config = JSON.generate(
  session: {
    type: "realtime",
    model: "gpt-realtime-2",
    audio: { output: { voice: { id: "voice_123" } } }
  }
)
puts(session_config)
```


## 在 GPT-Live 中使用自定义语音

使用一个项目作用域的、同时获得 GPT-Live 和自定义语音授权的 API 密钥
创建。读取授权短语和使用自定义语音需要
`api.voices.read`；创建授权和语音需要 `api.voices.write` 和
custom-voice API 访问权限。所有请求都使用同一个项目，并将 API
密钥保存在受信服务器上。

### Prepare the recordings

在录制前列出当前支持的同意语：

```bash
curl https://api.openai.com/v1/audio/consent_phrases \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

同意语录制和参考样本必须来自同一个人。
样本需要至少包含五秒的实际语音以及至少 15 个转写文本 token，静音不计入；请使用包含若干完整句子的 10–30 秒
录制。每次上传大小上限为 10 MiB。
录制。每次上传大小上限为 10 MiB。
服务会提取参考转写文本；不要上传转写 token、
配置解码器或添加自定义请求头。

浏览器录音工具可能将音频标记为 `audio/webm;codecs=opus`，上传端点会拒绝此类请求。构造上传时，请使用支持的基础 MIME 类型，
同时保留原始音频字节。请使用上文中的同意语和声音
`audio/webm` 创建请求，然后保存返回的声音 ID。
创建请求，然后保存返回的声音 ID。

### 在会话创建时选择语音

将自定义语音作为对象传入 `{ "id": "voice_123" }`，而不是字符串
`"voice_123"`。命名语音使用字符串 `"marin"` 表示。

`gpt-live-1` 支持带有英语口音的自定义语音。若要使用某种口音，还需要在指令中
指定该口音 `session.instructions`，例如 "Speak British English" 或 "Speak
Irish English."。下面的示例使用英式英语；请根据需要更改指令
以匹配你为自定义语音希望使用的口音。

在初始会话中包含以下配置：

```json
{
  "model": "gpt-live-1",
  "instructions": "You are a helpful voice assistant. Speak British English.",
  "audio": { "output": { "voice": { "id": "voice_123" } } }
}
```

对于 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live)，受信任的会话代理
将此配置放入 JSON `session` 字段中，与 `transport`.
实时端点要求使用 JSON，而不是 multipart 或原始 SDP。读取所创建的
会话 ID 从 `session.id` ，以及 SDP 应答从 `transport.sdp`。请使用应用程序凭据对
托管代理请求进行身份验证；切勿公开 OpenAI
把 API key 暴露给浏览器。

对于 [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)，将配置信息放入第一个
事件中。使用时不附带 `session.start` 查询参数建立连接，并等待
在开始 `session.started` 流式音频前完成。使用
`session.input_audio.append`。发送音频。发送完毕后 `session.close`，继续接收直到
`session.closed` 提供最终的用量信息。

### 处理访问和生命周期故障

- Live 会话开始后，无法更改输出语音。请开启新会话以使用其他语音。
- 已删除或已撤销的语音、来自其他项目的授权，或缺少自定义语音访问权限，都可能显示为 `404`.
- 格式错误的音频、不匹配的说话人，或非项目范围的密钥将被拒绝。

确认你的项目权限、录制时长下限和上传限制
再创建语音。参见 [GPT-Live 入门指南](https://developers.openai.com/api/docs/guides/live)
了解会话设置要求。