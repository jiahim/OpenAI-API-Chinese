# Custom voices

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Custom voices enable you to create a unique voice for your agent or application. These voices can be used for audio output with the [Text to Speech API](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create), the [Realtime API](https://developers.openai.com/api/reference/resources/realtime), or the [Chat Completions API with audio output](https://developers.openai.com/api/docs/guides/audio-chat-completions).

To create a custom voice, you’ll provide a short sample audio reference that the model will seek to replicate.



    {"Custom voices are limited to eligible customers. Contact our "}
    [{"sales team"}](https://openai.com/contact-sales/)
    {
      " to learn more. Once enabled for your organization, you’ll have access to the "
    }
    [{"Voices"}](https://platform.openai.com/audio/voices)
    {" tab under Audio."}
  


## Creating a voice

Currently, voices must be created through an API request. See the API reference for the full set of API operations.

Creating a voice requires two separate audio recordings:

1. **Consent recording:** This recording captures the voice actor providing consent to create a likeness of their voice. The actor must read one of the consent phrases provided below.
2. **Sample recording:** The actual audio sample that the model will try to adhere to. The voice must match the consent recording.

**Tips for creating a high-quality voice**

The quality of your custom voice is highly dependent on the quality of the sample you provide. Optimizing the recording quality can make a big difference.

- Record in a quiet space with minimal echo.
- Use a professional XLR microphone.
- Stay about 7–8 inches from the mic with a pop filter in between, and keep that distance consistent.
- The model copies exactly what you give it—tone, cadence, energy, pauses, habits—so record the exact voice you want. Be consistent in energy, style, and accent throughout.
- Small variations in the audio sample can result in quality differences with the generated voice. Try multiple examples to find the best fit.

**Requirements and limitations**

- At most 20 voices can be created per organization.
- The audio samples must be 30 seconds or less.
- The audio samples must be one of the following types: `mpeg`, `wav`, `ogg`, `aac`, `flac`, `webm`, or `mp4`.

Refer to the Text-to-Speech Supplemental Agreement for additional terms of use.

**Creating a voice consent**

The consent audio recording must only include one of the following phrases. Any divergence from the script will lead to a failure.

| Language | Phrase                                                                                                                                                |
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

Then upload the recording via the API. A successful upload will return the consent recording ID that you’ll reference later. Note the consent can be used for multiple different voice creations if the same voice actor is making multiple attempts.

```bash
curl https://api.openai.com/v1/audio/voice_consents \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "name=test_consent" \
  -F "language=en" \
  -F "recording=@$HOME/tmp/voice_consent/consent_recording.wav;type=audio/x-wav"
```


**Creating a voice**

Next, you’ll create the actual voice by referencing the consent recording ID, and providing the voice sample.

```bash
curl https://api.openai.com/v1/audio/voices \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "name=test_voice" \
  -F "audio_sample=@$HOME/tmp/voice_consent/audio_sample_recording.wav;type=audio/x-wav" \
  -F "consent=cons_123abc"
```


If successful, the created voice will be listed under the [Audio tab](https://platform.openai.com/audio/voices).

## Using a voice during speech generation

Speech generation will work as usual. Specify the ID of the voice in the `voice` parameter when [creating speech](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create), or when initiating a [realtime session](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/create#realtime_create_call-session-audio-output-voice).

**Text to speech example**

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


**Realtime API example**

For Ruby, set `OPENAI_VOICE_ID` to your custom voice ID before running the example.

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


## Use a custom voice with GPT-Live

Use a project-scoped API key approved for both GPT-Live and custom voice
creation. Reading consent phrases and using a custom voice require
`api.voices.read`; creating consents and voices requires `api.voices.write` and
custom-voice API access. Use the same project for every request and keep the API
key on a trusted server.

### Prepare the recordings

List the current supported consent phrases before recording:

```bash
curl https://api.openai.com/v1/audio/consent_phrases \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

The consent recording and reference sample must come from the same person. The
sample needs at least five seconds of actual speech and at least 15 transcribed
text tokens; silence does not count. Use a 10–30-second
recording with several complete sentences. Each upload is limited to 10 MiB.
The service extracts the reference transcript; do not upload transcript tokens,
configure a decoder, or add custom request headers.

Browser recorders may label audio `audio/webm;codecs=opus`, which the upload
endpoint rejects. When constructing an upload, use the supported base MIME type
`audio/webm` while preserving the original audio bytes. Use the consent and voice
creation requests above, then save the returned voice ID.

### Select the voice at session creation

Pass a custom voice as the object `{ "id": "voice_123" }`, not the string
`"voice_123"`. Named voices such as `"marin"` use strings.

`gpt-live-1` supports custom voices with English accents. To use an accent, also
specify it in `session.instructions`, such as "Speak British English" or "Speak
Irish English." The example below uses British English; change the instruction
to match the accent you want for your custom voice.

Include the following configuration in the initial session:

```json
{
  "model": "gpt-live-1",
  "instructions": "You are a helpful voice assistant. Speak British English.",
  "audio": { "output": { "voice": { "id": "voice_123" } } }
}
```

For [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live), the trusted session broker
places this configuration in the JSON `session` field alongside `transport`.
The Live endpoint requires JSON, not multipart or raw SDP. Read the created
session ID from `session.id` and the SDP answer from `transport.sdp`. Authenticate
hosted broker requests with application credentials; never expose the OpenAI
API key to the browser.

For [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=live), put the configuration
in the first `session.start` event. Connect without query parameters and wait
for `session.started` before streaming audio. Send audio with
`session.input_audio.append`. After sending `session.close`, keep receiving until
`session.closed` supplies final usage.

### Handle access and lifecycle failures

- The output voice cannot be changed after the Live session starts. Start a new session to use a different voice.
- A deleted or revoked voice, a consent from another project, or missing custom-voice access can appear as a `404`.
- Malformed audio, a mismatched speaker, or a non-project-scoped key is rejected.

Confirm your project's permissions, recording minimums, and upload limits
before creating a voice. See [GPT-Live getting started](https://developers.openai.com/api/docs/guides/live)
for session setup requirements.