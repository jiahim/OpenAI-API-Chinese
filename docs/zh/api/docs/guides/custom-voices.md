# 自定义语音

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

自定义声音可让你为你的智能体或应用创建独特的声音。这些声音可用于通过以下接口进行音频输出： [Text to Speech API](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create)、 [Realtime API](https://developers.openai.com/api/reference/resources/realtime)，或 [Chat Completions API with audio output](https://developers.openai.com/api/docs/guides/audio-chat-completions).

要创建自定义声音，你需要提供一段简短的音频参考样本，模型将尝试复刻该声音。



    {"Custom voices are limited to eligible customers. Contact our "}
    [{"sales team"}](https://openai.com/contact-sales/)
    {
      " to learn more. Once enabled for your organization, you’ll have access to the "
    }
    [{"Voices"}](https://platform.openai.com/audio/voices)
    {" tab under Audio."}
  


## 创建语音

目前，语音必须通过 API 请求来创建。有关完整的 API 操作集，请参阅 API 参考。

创建语音需要两段独立的音频录音：

1. **同意录音：** 该录音记录配音演员同意制作其声音的仿声素材。演员必须朗读下方提供的某一段同意语。
2. **样本录音：** 模型将尝试遵循的实际音频样本。声音必须与同意录音一致。

**创建高质量语音的技巧**

自定义语音的质量在很大程度上取决于你提供的样本质量。优化录制质量可以带来显著差异。

- 在安静、回声尽量少的空间中录音。
- 使用专业的 XLR 麦克风。
- 与麦克风保持约 7–8 英寸的距离，中间放置防喷罩，并保持该距离一致。
- 模型会原样复制你提供的内容——语气、节奏、能量、停顿、习惯——因此请录制你真正想要的声音。在整段录音中保持能量、风格和口音的一致。
- 音频样本中的细微差异都可能导致生成语音的质量差别。请尝试多份样本，找到最合适的那一个。

**要求与限制**

- 每个组织最多可创建 20 个语音。
- 音频样本时长不得超过 30 秒。
- 音频样本必须为以下类型之一： `mpeg`, `wav`, `ogg`, `aac`, `flac`, `webm`，或 `mp4`.

有关其他使用条款，请参阅 Text-to-Speech 补充协议。

**创建语音同意**

同意音频录音只能包含以下其中一种短语。任何偏离脚本的内容都会导致失败。


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

然后通过 API 上传录音。上传成功后会返回一个同意录音 ID，你后续会引用它。注意，如果同一位配音演员进行多次尝试，同一份同意录音可用于多次不同的语音创建。

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


如果成功，创建的语音将列在 [音频](https://platform.openai.com/audio/voices).

## 在语音生成过程中使用语音

语音生成将照常工作。在创建语音时，于 `voice` 参数中 [创建语音](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create)，或者在启动 [实时会话](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/create#realtime_create_call-session-audio-output-voice).

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

对于 Ruby，运行示例前请将 `voice_123` 替换为你的自定义语音 ID。

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


## 将自定义语音与 GPT-Live 结合使用

使用同时获批用于 GPT-Live 和自定义语音的项目级 API 密钥
创建。读取同意短语并使用自定义语音需要
`api.voices.read`；创建同意书和语音需要 `api.voices.write` 和
自定义语音 API 访问权限。所有请求使用同一项目，并将 API
密钥保存在受信任的服务器上。

### 准备录音

在录制前列出当前支持的同意语：

```bash
curl https://api.openai.com/v1/audio/consent_phrases \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

同意语录制和参考样本必须来自同一个人。该
样本需要至少 5 秒的实际语音以及至少 15 个转写
文本标记，静音部分不计入。使用 10–30 秒
的录制，包含若干完整语句。每次上传大小限制为 10 MiB。
该服务会从你的录制中提取参考转写文本。

浏览器录音器可能会标记音频 `audio/webm;codecs=opus`，而上传
接口会拒绝该音频。构建上传时，请使用受支持的基础 MIME 类型
`audio/webm` ，同时保留原始音频字节。请使用上述同意与音色
创建请求，然后保存返回的音色 ID。

### 在创建会话时选择语音

将自定义语音作为对象传入，例如 `{ "id": "voice_123" }`。命名语音
例如 `"marin"` 使用字符串。

`gpt-live-1` 支持带有英语口音的自定义语音。若要使用某种口音，还需要
在指令中同时 `session.instructions`，指定它，例如 "Speak British English" 或 "Speak
Irish English." 下面的示例使用的是英式英语；请修改指令
以匹配你希望自定义语音使用的口音。

在初始会话中加入以下配置：

```json
{
  "model": "gpt-live-1",
  "instructions": "You are a helpful voice assistant. Speak British English.",
  "audio": { "output": { "voice": { "id": "voice_123" } } }
}
```

对于 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live)，由你的应用服务器
将该配置放入 JSON 的 `session` 字段中，并同时 `transport`.
使用应用凭证对服务器的请求进行身份验证，同时将
OpenAI API key 保存在服务器上。

对于 [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)，将配置放在第一个
: `session.start` event. 按照连接指南进行流式传输
音频并关闭会话。

### 处理访问权限与生命周期相关的失败

- 在创建会话时选择语音。开始新会话以使用其他语音。
- 已删除或已撤销的语音、其他项目的同意或缺失的自定义语音访问可能显示为 `404`.
- 格式错误的音频、说话人不匹配或非项目范围的密钥将被拒绝。

确认你项目的权限、录制最低要求和上传限制
，然后再创建语音。详见 [GPT-Live 入门指南](https://developers.openai.com/api/docs/guides/live)
了解会话设置要求。