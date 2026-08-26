# Text to speech

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

The Audio API provides a [`speech`](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create) endpoint based on our [GPT-4o mini TTS (text-to-speech) model](https://developers.openai.com/api/docs/models/gpt-4o-mini-tts). It comes with 11 built-in voices and can be used to:

- Narrate a written blog post
- Produce spoken audio in multiple languages
- Give realtime audio output using streaming

Here's an example of the `alloy` voice:

Our [usage policies](https://openai.com/policies/usage-policies) require you
  to provide a clear disclosure to end users that the TTS voice they are hearing
  is AI-generated and not a human voice.

## Quickstart

The `speech` endpoint takes three key inputs:

1. The [model](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create#audio-createspeech-model) you're using
1. The [text](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create#audio-createspeech-input) to be turned into audio
1. The [voice](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create#audio-createspeech-voice) that will speak the output

Here's a simple request example:

Generate spoken audio from input text

```javascript
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI();
const speechFile = path.resolve("./speech.mp3");

const mp3 = await openai.audio.speech.create({
  model: "gpt-4o-mini-tts",
  voice: "coral",
  input: "Today is a wonderful day to build something people love!",
  instructions: "Speak in a cheerful and positive tone.",
});

const buffer = Buffer.from(await mp3.arrayBuffer());
await fs.promises.writeFile(speechFile, buffer);
```

```python
from pathlib import Path
from openai import OpenAI

client = OpenAI()
speech_file_path = Path(__file__).parent / "speech.mp3"

with client.audio.speech.with_streaming_response.create(
    model="gpt-4o-mini-tts",
    voice="coral",
    input="Today is a wonderful day to build something people love!",
    instructions="Speak in a cheerful and positive tone.",
) as response:
    response.stream_to_file(speech_file_path)
```

```go
package main

import (
	"context"
	"io"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	response, err := client.Audio.Speech.New(context.Background(), openai.AudioSpeechNewParams{
		Model:        openai.SpeechModelGPT4oMiniTTS,
		Voice:        openai.AudioSpeechNewParamsVoiceUnion{OfAudioSpeechNewsVoiceString2: openai.String("coral")},
		Input:        "Today is a wonderful day to build something people love!",
		Instructions: openai.String("Speak in a cheerful and positive tone."),
	})
	if err != nil {
		panic(err)
	}
	defer response.Body.Close()

	file, err := os.Create("speech.mp3")
	if err != nil {
		panic(err)
	}
	if _, err := io.Copy(file, response.Body); err != nil {
		panic(err)
	}
	if err := file.Close(); err != nil {
		panic(err)
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.HttpResponse;
import com.openai.models.audio.speech.SpeechCreateParams;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

try (HttpResponse audio =
    client
        .audio()
        .speech()
        .create(
            SpeechCreateParams.builder()
                .model("gpt-4o-mini-tts")
                .voice("coral")
                .input("Today is a wonderful day to build something people love!")
                .instructions("Speak in a cheerful and positive tone.")
                .build())) {
  Files.copy(audio.body(), Path.of("speech.mp3"), StandardCopyOption.REPLACE_EXISTING);
}
```

```csharp
using OpenAI.Audio;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-4o-mini-tts";
AudioClient client = new(model, key);

BinaryData audio = await client.GenerateSpeechAsync(
    "Today is a wonderful day to build something people love!",
    GeneratedSpeechVoice.Coral,
    new SpeechGenerationOptions
    {
        Instructions = "Speak in a cheerful and positive tone.",
    }
);

await File.WriteAllBytesAsync("speech.mp3", audio.ToArray());
```

```ruby
require "openai"

client = OpenAI::Client.new
audio = client.audio.speech.create(
  model: "gpt-4o-mini-tts",
  voice: "coral",
  input: "Today is a wonderful day to build something people love!",
  instructions: "Speak in a cheerful and positive tone."
)
File.binwrite("speech.mp3", audio.read)
```

```bash
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini-tts",
    "input": "Today is a wonderful day to build something people love!",
    "voice": "coral",
    "instructions": "Speak in a cheerful and positive tone."
  }' \
  --output speech.mp3
```

```bash
openai audio:speech create \
  --model gpt-4o-mini-tts \
  --voice coral \
  --instructions "Speak in a cheerful and positive tone." \
  --input "Today is a wonderful day to build something people love!" \
  --output speech.mp3
```


By default, the endpoint outputs an MP3 of the spoken audio, but you can configure it to output any [supported format](#supported-output-formats).

### Text-to-speech models

For intelligent realtime applications, use the `gpt-4o-mini-tts` model, our newest and most reliable text-to-speech model. You can prompt the model to control aspects of speech, including:

- Accent
- Emotional range
- Intonation
- Impressions
- Speed of speech
- Tone
- Whispering

Our other text-to-speech models are `tts-1` and `tts-1-hd`. The `tts-1` model provides lower latency, but at a lower quality than the `tts-1-hd` model.

### Voice options

The TTS endpoint provides 13 built‑in voices to control how speech is rendered from text. **Hear and play with these voices in [OpenAI.fm](https://openai.fm), our interactive demo for trying the latest text-to-speech model in the OpenAI API**. Voices are currently optimized for English.

- `alloy`
- `ash`
- `ballad`
- `coral`
- `echo`
- `fable`
- `nova`
- `onyx`
- `sage`
- `shimmer`
- `verse`
- `marin`
- `cedar`

For best quality, we recommend using `marin` or `cedar`.

Voice availability depends on the model. The `tts-1` and `tts-1-hd` models support a smaller set: `alloy`, `ash`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, and `shimmer`.

If you're using the [Realtime API](https://developers.openai.com/api/docs/guides/realtime), note that the set of available voices is slightly different—see the [realtime conversations guide](https://developers.openai.com/api/docs/guides/realtime-conversations#voice-options) for current realtime voices.

### Streaming realtime audio

The Speech API provides support for realtime audio streaming using [chunk transfer encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding). This means the audio can be played before the full file is generated and made accessible.

Stream spoken audio from input text directly to your speakers

```javascript
import OpenAI from "openai";
import { playAudio } from "openai/helpers/audio";

const openai = new OpenAI();

const response = await openai.audio.speech.create({
  model: "gpt-4o-mini-tts",
  voice: "coral",
  input: "Today is a wonderful day to build something people love!",
  instructions: "Speak in a cheerful and positive tone.",
  response_format: "wav",
});

await playAudio(response);
```

```python
import asyncio

from openai import AsyncOpenAI
from openai.helpers import LocalAudioPlayer

openai = AsyncOpenAI()


async def main() -> None:
    async with openai.audio.speech.with_streaming_response.create(
        model="gpt-4o-mini-tts",
        voice="coral",
        input="Today is a wonderful day to build something people love!",
        instructions="Speak in a cheerful and positive tone.",
        response_format="pcm",
    ) as response:
        await LocalAudioPlayer().play(response)


if __name__ == "__main__":
    asyncio.run(main())
```

```go
package main

import (
	"context"
	"io"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	response, err := client.Audio.Speech.New(context.Background(), openai.AudioSpeechNewParams{
		Model:          openai.SpeechModelGPT4oMiniTTS,
		Voice:          openai.AudioSpeechNewParamsVoiceUnion{OfAudioSpeechNewsVoiceString2: openai.String("coral")},
		Input:          "Today is a wonderful day to build something people love!",
		Instructions:   openai.String("Speak in a cheerful and positive tone."),
		ResponseFormat: openai.AudioSpeechNewParamsResponseFormatWAV,
	})
	if err != nil {
		panic(err)
	}
	defer response.Body.Close()
	if _, err := io.Copy(os.Stdout, response.Body); err != nil {
		panic(err)
	}
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.HttpResponse;
import com.openai.models.audio.speech.SpeechCreateParams;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.SourceDataLine;

try (HttpResponse audio =
    client
        .audio()
        .speech()
        .create(
            SpeechCreateParams.builder()
                .model("gpt-4o-mini-tts")
                .voice("coral")
                .input("Today is a wonderful day to build something people love!")
                .instructions("Speak in a cheerful and positive tone.")
                .responseFormat(SpeechCreateParams.ResponseFormat.PCM)
                .streamFormat(SpeechCreateParams.StreamFormat.AUDIO)
                .build())) {
  AudioFormat format = new AudioFormat(24_000, 16, 1, true, false);
  String outputPath = System.getenv("OPENAI_EXAMPLE_AUDIO_OUTPUT_PATH");
  if (outputPath == null || outputPath.isBlank()) {
    try (SourceDataLine speakers = AudioSystem.getSourceDataLine(format)) {
      speakers.open(format);
      speakers.start();
      byte[] chunk = new byte[1024];
      int bytesRead;
      while ((bytesRead = audio.body().read(chunk)) != -1) {
        speakers.write(chunk, 0, bytesRead);
      }
      speakers.drain();
    }
  } else {
    try (OutputStream output = Files.newOutputStream(Path.of(outputPath))) {
      long bytes = audio.body().transferTo(output);
      System.out.println(bytes + " audio bytes");
    }
  }
}
```

```ruby
require "openai"

client = OpenAI::Client.new
audio = client.audio.speech.create(
  model: "gpt-4o-mini-tts",
  voice: "alloy",
  input: "Welcome to the OpenAI API.",
  response_format: :pcm,
  stream_format: :audio
)
while (chunk = audio.read(1_024))
  puts(chunk.bytesize)
end
```

```bash
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini-tts",
    "input": "Today is a wonderful day to build something people love!",
    "voice": "coral",
    "instructions": "Speak in a cheerful and positive tone.",
    "response_format": "wav"
  }' | ffplay -i -
```


For the fastest response times, we recommend using `wav` or `pcm` as the response format.

## Supported output formats

The default response format is `mp3`, but other formats like `opus` and `wav` are available.

- **MP3**: The default response format for general use cases.
- **Opus**: For internet streaming and communication, low latency.
- **AAC**: For digital audio compression, preferred by YouTube, Android, iOS.
- **FLAC**: For lossless audio compression, favored by audio enthusiasts for archiving.
- **WAV**: Uncompressed WAV audio, suitable for low-latency applications to avoid decoding overhead.
- **PCM**: Similar to WAV but contains the raw samples in 24kHz (16-bit signed, low-endian), without the header.

## Supported languages

The TTS model generally follows the Whisper model in terms of language support. Whisper [supports the following languages](https://github.com/openai/whisper#available-models-and-languages) and performs well, despite voices being optimized for English:

Afrikaans, Arabic, Armenian, Azerbaijani, Belarusian, Bosnian, Bulgarian, Catalan, Chinese, Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, Galician, German, Greek, Hebrew, Hindi, Hungarian, Icelandic, Indonesian, Italian, Japanese, Kannada, Kazakh, Korean, Latvian, Lithuanian, Macedonian, Malay, Marathi, Maori, Nepali, Norwegian, Persian, Polish, Portuguese, Romanian, Russian, Serbian, Slovak, Slovenian, Spanish, Swahili, Swedish, Tagalog, Tamil, Thai, Turkish, Ukrainian, Urdu, Vietnamese, and Welsh.

You can generate spoken audio in these languages by providing input text in the language of your choice.

## Custom voices

Custom voices enable you to create a unique voice for your agent or application. These voices can be used for audio output with the [Text to Speech API](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create), the [Realtime API](https://developers.openai.com/api/reference/resources/realtime), or the [Chat Completions API with audio output](https://developers.openai.com/api/docs/guides/audio).

To create a custom voice, you’ll provide a short sample audio reference that the model will seek to replicate.

Custom voices are limited to eligible customers. Contact our [sales
  team](https://openai.com/contact-sales/) to learn more. Once enabled for your
  organization, you’ll have access to the
  [Voices](https://platform.openai.com/audio/voices) tab under Audio.

#### Creating a voice

Currently, voices must be created through an API request. See the API reference for the full set of API operations.

Creating a voice requires two separate audio recordings:

1. **Consent recording** — this recording captures the voice actor providing consent to create a likeness of their voice. The actor must read one of the consent phrases provided below.
2. **Sample recording** — the actual audio sample that the model will try to adhere to. The voice must match the consent recording.

**Tips for creating a high-quality voice**

The quality of your custom voice is highly dependent on the quality of the sample you provide. Optimizing the recording quality can make a big difference.

- Record in a quiet space with minimal echo.
- Use a professional XLR microphone.
- Stay about 7–8 inches from the mic with a pop filter in between, and keep that distance consistent.
- The model copies exactly what you give it—tone, cadence, energy, pauses, habits—so record the exact voice you want. Be consistent in energy, style, and accent throughout.
- Small variations in the audio sample can result in quality differences with the generated voice, it's worth trying multiple examples to find the best fit.

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

#### Using a voice during speech generation

Speech generation will work as usual. Simply specify the ID of the voice in the `voice` parameter when [creating speech](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create), or when initiating a [realtime session](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/create#realtime_create_call-session-audio-output-voice).

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


## Related guides

[Realtime and audio overview



      Choose the right path for voice agents, translation, transcription, and
    speech generation.](https://developers.openai.com/api/docs/guides/realtime)

[Audio and speech concepts



      Review audio modalities, speech tasks, streaming, and request-based APIs.](https://developers.openai.com/api/docs/guides/audio)