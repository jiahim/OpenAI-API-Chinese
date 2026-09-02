# Text to speech

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾添加 `.md` 来获取。

音频 API 提供一个 [`speech`](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create) 基于我们的 [GPT-4o mini TTS（文本转语音）模型](https://developers.openai.com/api/docs/models/gpt-4o-mini-tts)。它内置 11 种语音，可用于：

- 叙述一篇书面博客文章
- 使用多种语言生成口语音频
- 通过流式传输提供实时音频输出

以下是一个使用 `alloy` 语音的示例：

我们的 [使用政策](https://openai.com/policies/usage-policies) 要求你
  向最终用户清楚地披露他们正在收听的 TTS 语音
  由 AI 生成，不是人声。

## 快速入门

该 `speech` 端点接受三个关键输入：

1. 该 [模型](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create#audio-createspeech-model) 你正在使用的
1. 该 [文本](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create#audio-createspeech-input) 转换为音频
1. 该 [声音](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create#audio-createspeech-voice) 朗读输出内容

下面是一个简单的请求示例：

根据输入文本生成语音音频

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


默认情况下，该接口会输出 MP3 格式的语音音频，但你也可以将其配置为输出任意 [支持的格式](#supported-output-formats).

### 文本转语音模型

对于智能实时应用，请使用 `gpt-4o-mini-tts` 模型，它是我们最新且最可靠的文本转语音模型。你可以提示该模型来控制语音的多个方面，包括：

- 口音
- 情绪范围
- 语调
- 印象
- 语速
- 语气
- 耳语

我们的其他文本转语音模型包括 `tts-1` 和 `tts-1-hd`。该 `tts-1` 模型延迟更低，但质量低于 `tts-1-hd` 模型。

### Voice options

TTS 端点提供 13 种内置语音，用于控制如何从文本生成语音。 **在交互式演示中聆听并试用这些语音 [OpenAI.fm](https://openai.fm)，这是在 OpenAI API 中试用最新文本转语音模型的交互式演示**。目前的语音针对英文进行了优化。

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

为获得最佳质量，我们建议使用 `marin` 或 `cedar`.

可用语音取决于所使用模型。以下 `tts-1` 和 `tts-1-hd` 模型支持的语音数量较少： `alloy`, `ash`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`、以及 `shimmer`.

如果你正在使用 [Realtime API](https://developers.openai.com/api/docs/guides/realtime)，请注意可用的语音集略有不同——请参阅 [实时对话指南](https://developers.openai.com/api/docs/guides/realtime-conversations#voice-options) 了解当前的实时语音。

### 流式实时音频

Speech API 提供了使用 [分块传输编码](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding)。进行实时音频流式传输的支持。这意味着音频可以在完整文件生成并可供访问之前就开始播放。

将输入文本直接流式播放为语音音频到你的扬声器

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


为了获得最快的响应速度，我们建议使用 `wav` 或 `pcm` 作为响应格式。

## 支持输出格式

默认响应格式为 `mp3`，但也提供其他格式，例如 `opus` 和 `wav` 。

- **MP3**：通用场景下的默认响应格式。
- **Opus**：用于网络流媒体和实时通信，低延迟。
- **AAC**：用于数字音频压缩，是 YouTube、Android、iOS 首选的格式。
- **FLAC**：用于无损音频压缩，深受音频爱好者喜爱，适合用于归档。
- **WAV**：未压缩的 WAV 音频，适合对延迟敏感的应用，可避免解码开销。
- **PCM**：与 WAV 类似，但包含 24kHz（16 位有符号、小端序）的原始样本，且不含头部信息。

## 支持的语言

TTS 模型在语言支持方面总体上沿用 Whisper 模型。Whisper [支持以下语言](https://github.com/openai/whisper#available-models-and-languages) 并表现良好，尽管声音针对英语进行了优化：

南非语、阿拉伯语、亚美尼亚语、阿塞拜疆语、白俄罗斯语、波斯尼亚语、保加利亚语、加泰罗尼亚语、中文、克罗地亚语、捷克语、丹麦语、荷兰语、英语、爱沙尼亚语、芬兰语、法语、加利西亚语、德语、希腊语、希伯来语、印地语、匈牙利语、冰岛语、印度尼西亚语、意大利语、日语、卡纳达语、哈萨克语、韩语、拉脱维亚语、立陶宛语、马其顿语、马来语、马拉地语、毛利语、尼泊尔语、挪威语、波斯语、波兰语、葡萄牙语、罗马尼亚语、俄语、塞尔维亚语、斯洛伐克语、斯洛文尼亚语、西班牙语、斯瓦希里语、瑞典语、他加禄语、泰米尔语、泰语、土耳其语、乌克兰语、乌尔都语、越南语和威尔士语。

你可以通过提供所选语言的输入文本来用这些语言生成语音音频。

## 自定义语音

自定义语音可让你为你的智能体或应用打造独特的声音。这些语音可用于以下接口的音频输出： [Text to Speech API](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create)、 [Realtime API](https://developers.openai.com/api/reference/resources/realtime)，或 [Chat Completions API with audio output](https://developers.openai.com/api/docs/guides/audio).

若要创建自定义语音，你需要提供一段简短的音频参考样本，模型会尝试复刻该声音。

自定义语音仅向符合条件的客户提供。请联系我们的 [sales
  team](https://openai.com/contact-sales/) 团队以了解更多信息。为你的组织开通权限后，你即可访问
  音频下的
  [Voices](https://platform.openai.com/audio/voices) 选项卡。

#### 创建语音

目前，语音必须通过 API 请求创建。有关完整的 API 操作集，请参阅 API 参考。

创建语音需要两段单独的音频录音：

1. **同意录制** ——这段录音会记录配音演员同意制作其声音复刻的内容。演员必须朗读下方提供的某一段同意用语。
2. **样本录制** ——即模型将尝试遵循的实际音频样本。该声音必须与同意录制一致。

**创建高质量语音的技巧**

自定义语音的质量在很大程度上取决于你提供的样本质量。优化录制质量可以带来很大的改善。

- 在回声极少的安静空间中录制。
- 使用专业 XLR 麦克风。
- 与麦克风保持约 7–8 英寸距离，中间放置防喷罩，并保持距离一致。
- 模型会原样复制你提供的内容——语气、节奏、能量、停顿、习惯——因此请录制你想要的确切声音。整段录音在能量、风格和口音上要保持一致。
- 音频样本中的细微差异都会导致生成的声音质量不同，值得尝试多个示例以找到最佳效果。

**要求与限制**

- 每个组织最多可创建 20 个语音。
- 音频样本时长不得超过 30 秒。
- 音频样本必须为以下类型之一： `mpeg`, `wav`, `ogg`, `aac`, `flac`, `webm`,或 `mp4`.

有关其他使用条款，请参阅 Text-to-Speech 补充协议。

**创建声音授权**

授权音频录制只能包含以下其中一句台词。任何偏离脚本的情况都会导致失败。

| 语言 | 短语                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `de`     | Ich bin der Eigentümer dieser Stimme und bin damit einverstanden, dass OpenAI diese Stimme zur Erstellung eines synthetischen Stimmmodells verwendet. |
| `en`     | 我是该声音的拥有者，同意 OpenAI 使用此声音创建合成语音模型。                                              |
| `es`     | Soy el propietario de esta voz y doy mi consentimiento para que OpenAI la utilice para crear un modelo de voz sintética.                              |
| `fr`     | Je suis le propriétaire de cette voix et j'autorise OpenAI à utiliser cette voix pour créer un modèle de voix synthétique.                            |
| `hi`     | मैं इस आवाज का मालिक हूं और मैं सिंथेटिक आवाज मडल बनाने के लिए OpenAI को इस आवाज का उपयोग करने की सहमति देता हूं                                     |
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

然后通过 API 上传录音。上传成功后会返回一个同意录音 ID，供你后续引用。注意，如果同一配音演员进行多次尝试，该同意录音可用于多个不同的语音创建。

```bash
curl https://api.openai.com/v1/audio/voice_consents \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "name=test_consent" \
  -F "language=en" \
  -F "recording=@$HOME/tmp/voice_consent/consent_recording.wav;type=audio/x-wav"
```


**创建语音**

接下来，你将通过引用同意录音 ID，并提供语音样本来创建实际的语音。

```bash
curl https://api.openai.com/v1/audio/voices \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "name=test_voice" \
  -F "audio_sample=@$HOME/tmp/voice_consent/audio_sample_recording.wav;type=audio/x-wav" \
  -F "consent=cons_123abc"
```


如果成功，创建的语音将列在 [音频选项卡](https://platform.openai.com/audio/voices).

#### 在语音生成期间使用语音

语音生成功能将照常工作。只需在 `voice` 参数中指定要使用的语音 ID， [创建语音](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create)，或在发起 [实时会话](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/create#realtime_create_call-session-audio-output-voice).

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


## 相关指南

[实时与音频概览



      Choose the right path for voice agents, translation, transcription, and
    speech generation.](https://developers.openai.com/api/docs/guides/realtime)

[音频与语音概念



      Review audio modalities, speech tasks, streaming, and request-based APIs.](https://developers.openai.com/api/docs/guides/audio)