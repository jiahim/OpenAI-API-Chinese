# 文本转语音

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

Audio API 提供了一个 [`speech`](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create) 基于我们的端点， [GPT-4o mini TTS（文本转语音）模型](https://developers.openai.com/api/docs/models/gpt-4o-mini-tts)。它带有 11 种内置语音，可用于：

- 撰写一篇书面博客文章
- 用多种语言生成语音音频
- 使用流式传输提供实时音频输出

以下是 `alloy` 语音的示例：

我们的 [使用政策](https://openai.com/policies/usage-policies) 要求你
  向最终用户明确披露，他们听到的 TTS 语音
  是由 AI 生成的，而非人类声音。

## 快速入门

该 `speech` 端点接收三个关键输入：

1. 该 [模型](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create#audio-createspeech-model) 你正在使用
1. 该 [文本](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create#audio-createspeech-input) 要转换为音频的内容
1. 该 [声音](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create#audio-createspeech-voice) 将朗读输出的内容

这里是一个简单的请求示例：

从输入文本生成语音音频

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


默认情况下，端点输出语音音频的 MP3 格式，但你可以将其配置为输出任何 [支持的格式](#supported-output-formats).

### 文本转语音模型

对于智能实时应用，请使用 `gpt-4o-mini-tts` 模型，这是我们最新、最可靠的文本转语音模型。你可以提示模型控制语音的各个方面，包括：

- 口音
- 情感范围
- 语调
- 印象
- 语速
- 语气
- 低语

我们的其他文本转语音模型 `tts-1` 和 `tts-1-hd`。该 `tts-1` 模型提供更低的延迟，但质量低于 `tts-1-hd` 模型。

### 语音选项

TTS 端点提供 13 种内置声音，用于控制文本的语音渲染方式。 **你可以在 [OpenAI.fm](https://openai.fm)，中试听和体验这些声音，这是我们用于尝试最新文本转语音模型的互动演示，基于 OpenAI API**。目前这些声音针对英语进行了优化。

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

为了获得最佳质量，我们建议使用 `marin` 或 `cedar`.

声音的可用性取决于模型。 `tts-1` 和 `tts-1-hd` 模型支持的声音集合较小： `alloy`, `ash`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`，以及 `shimmer`.

如果你使用的是 [Realtime API](https://developers.openai.com/api/docs/guides/realtime)，请注意可用声音的集合略有不同——请参阅 [实时对话指南](https://developers.openai.com/api/docs/guides/realtime-conversations#voice-options) 以了解当前实时的声音。

### 流式传输实时音频

语音 API 支持使用 [分块传输编码](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Transfer-Encoding)。进行实时音频流式传输。这意味着音频可以在完整文件生成并可访问之前播放。

直接将输入文本的语音音频流式传输到你的扬声器

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


为了获得最快的响应时间，我们建议使用 `wav` 或 `pcm` 作为响应格式。

## 支持的输出格式

默认响应格式为 `mp3`，但其他格式如 `opus` 和 `wav` 也可用。

- **MP3**：适用于一般用例的默认响应格式。
- **Opus**：用于互联网流媒体和通信，低延迟。
- **AAC**：用于数字音频压缩，YouTube、Android、iOS 首选。
- **FLAC**：用于无损音频压缩，受到音频爱好者归档时的青睐。
- **WAV**：未压缩的 WAV 音频，适用于低延迟应用以避免解码开销。
- **PCM**：与 WAV 类似，但包含 24kHz（16 位有符号，小端）的原始采样，没有头部。

## 支持的语言

TTS 模型在语言支持方面大体上遵循 Whisper 模型。Whisper [支持以下语言](https://github.com/openai/whisper#available-models-and-languages) ，并且表现良好，尽管语音针对英语进行了优化：

南非荷兰语、阿拉伯语、亚美尼亚语、阿塞拜疆语、白俄罗斯语、波斯尼亚语、保加利亚语、加泰罗尼亚语、中文、克罗地亚语、捷克语、丹麦语、荷兰语、英语、爱沙尼亚语、芬兰语、法语、加利西亚语、德语、希腊语、希伯来语、印地语、匈牙利语、冰岛语、印度尼西亚语、意大利语、日语、卡纳达语、哈萨克语、韩语、拉脱维亚语、立陶宛语、马其顿语、马来语、马拉地语、毛利语、尼泊尔语、挪威语、波斯语、波兰语、葡萄牙语、罗马尼亚语、俄语、塞尔维亚语、斯洛伐克语、斯洛文尼亚语、西班牙语、斯瓦希里语、瑞典语、他加禄语、泰米尔语、泰语、土耳其语、乌克兰语、乌尔都语、越南语和威尔士语。

你可以通过提供所选语言的输入文本来生成这些语言的语音音频。

## 自定义语音

自定义声音使你能为你的智能体或应用创建独特的声音。这些声音可用于音频输出，配合 [文本转语音API](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create)、 [实时API](https://developers.openai.com/api/reference/resources/realtime)，或 [带音频输出的Chat Completions API](https://developers.openai.com/api/docs/guides/audio).

要创建自定义声音，你需要提供一段简短的示例音频参考，模型会尝试复制该音频。

自定义声音仅限于符合条件的客户使用。请联系我们的 [销售
  团队](https://openai.com/contact-sales/) 了解更多。一旦为你的
  组织启用后，你将可以访问
  [声音](https://platform.openai.com/audio/voices) 选项卡下的音频设置。

#### 创建语音

目前，语音必须通过 API 请求创建。请参阅 API 参考文档以了解完整的 API 操作集。

创建语音需要两份独立的音频录音：

1. **同意录音** ——此录音用于捕捉配音演员同意创建其语音相似物的意愿。演员必须朗读下方提供的同意短语之一。
2. **示例录音** ——模型将尝试遵循的实际音频样本。声音必须与同意录音匹配。

**创建高品质语音的技巧**

你的自定义语音质量在很大程度上取决于所提供的样本质量。优化录音质量可以带来很大的不同。

- 在安静且回声较小的空间中录音。
- 使用专业的 XLR 麦克风。
- 与麦克风保持约 7–8 英寸的距离，并在中间使用防喷罩，且保持该距离一致。
- 模型会完全复刻你提供的内容——语调、节奏、能量、停顿、习惯——因此请录制你真正想要的声音。在整个过程中保持能量、风格和口音的一致性。
- 音频样本的细微差异可能导致生成声音的质量出现差异，因此值得尝试多个示例以找到最佳匹配。

**要求与限制**

- 每个组织最多可创建 20 个语音。
- 音频样本必须为 30 秒或更短。
- 音频样本必须是以下类型之一： `mpeg`, `wav`, `ogg`, `aac`, `flac`, `webm`，或 `mp4`.

有关其他使用条款，请参阅《文本转语音补充协议》。

**创建语音同意书**

同意音频录制只能包含以下短语之一。任何与脚本的偏差都将导致失败。

| 语言 | 短语                                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `de`     | 我是此声音的所有者，并同意OpenAI使用此声音创建语音合成模型。 |
| `en`     | 我是此声音的所有者，并同意OpenAI使用此声音创建语音合成模型。                                              |
| `es`     | 我是此声音的所有者，并同意OpenAI使用此声音创建语音合成模型。                              |
| `fr`     | 我是此声音的所有者，并授权OpenAI使用此声音创建语音合成模型。                            |
| `hi`     | 我是此声音的所有者，并同意OpenAI使用此声音创建语音合成模型。                                     |
| `id`     | 我是此声音的所有者，并同意OpenAI使用此声音创建语音合成模型。            |
| `it`     | 我是此声音的所有者，并同意OpenAI使用此声音创建语音合成模型。                                      |
| `ja`     | 我是此声音的所有者，并同意OpenAI使用此声音创建语音合成模型。                                                     |
| `ko`     | 我是此声音的所有者，并同意OpenAI使用此声音创建语音合成模型。                                                        |
| `nl`     | 我是此声音的所有者，并同意OpenAI使用此声音创建语音合成模型。                       |
| `pl`     | 我是此声音的所有者，并同意OpenAI使用此声音创建语音合成模型。                         |
| `pt`     | 我是此声音的所有者，并授权OpenAI使用此声音创建语音合成模型。                                                   |
| `ru`     | 我是此声音的所有者，并同意OpenAI使用此声音创建语音合成模型。                      |
| `uk`     | 我是此声音的所有者，并同意OpenAI使用此声音创建语音合成模型。                                   |
| `vi`     | 我是此声音的所有者，并同意OpenAI使用此声音创建语音合成模型。                                     |
| `zh`     | 我是此声音的拥有者并授权OpenAI使用此声音创建语音合成模型                                                                                              |

然后通过 API 上传录音。上传成功后将返回同意录音 ID，供你稍后引用。请注意，如果同一配音演员进行多次尝试，该同意可用于多个不同的语音创建。

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


如果成功，创建的语音将列在 [Audio 选项卡](https://platform.openai.com/audio/voices).

#### 在语音生成过程中使用声音

语音生成将照常工作。只需在 `voice` 参数中指定语音的 ID， [创建语音](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create)，时，或在启动 [实时会话](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/create#realtime_create_call-session-audio-output-voice).

**文本转语音示例**

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

实时与音频概览



      Choose the right path for voice agents, translation, transcription, and
    speech generation.](https://developers.openai.com/api/docs/guides/realtime)

音频与语音概念



      Review audio modalities, speech tasks, streaming, and request-based APIs.](https://developers.openai.com/api/docs/guides/audio)