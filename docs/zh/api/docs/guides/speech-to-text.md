# 文件转写

> 完整的文档索引请参见 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取该页面的 Markdown 版本。

当你已有录制完成的音频或一个有边界的音频请求时，可使用文件转写。上传音频并获取最终转写文本，或者在模型处理文件时流式接收文本。

建议从 [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)。开始。这是用于以原始语言转写已录制语音的推荐模型。仅当需要说话人标签、词级时间戳、字幕格式或翻译成英文时，才使用专门的模型。

文件大小可达 25 MB。支持的输入格式包括 `mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `wav`，以及 `webm`.

对于仍在从麦克风、通话或媒体流输入的音频，请使用
  [实时转写](https://developers.openai.com/api/docs/guides/realtime-transcription).

## 快速入门

### 转录

将音频文件发送到 `/v1/audio/transcriptions` 以 `gpt-transcribe`:

转录音频

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream("fixtures/audio.wav"),
  model: "gpt-transcribe",
});

console.log(transcription.text);
```

```python
from openai import OpenAI

client = OpenAI()
audio_file = open("audio.wav", "rb")

transcription = client.audio.transcriptions.create(
    model="gpt-transcribe", file=audio_file
)

print(transcription.text)
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	file, err := os.Open("fixtures/audio.wav")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	client := openai.NewClient()
	transcription, err := client.Audio.Transcriptions.New(context.Background(), openai.AudioTranscriptionNewParams{
		File:  file,
		Model: "gpt-transcribe",
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(transcription.Text)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.audio.transcriptions.TranscriptionCreateParams;
import java.nio.file.Path;

var result =
    client
        .audio()
        .transcriptions()
        .create(
            TranscriptionCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_AUDIO_PATH")))
                .model("gpt-transcribe")
                .build());

System.out.println(result.asTranscription().text());
```

```csharp
using OpenAI.Audio;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-transcribe";
AudioClient client = new(model, key);

await using FileStream audio = File.OpenRead("audio.wav");
AudioTranscription transcription = await client.TranscribeAudioAsync(
    audio,
    "audio.wav"
);

Console.WriteLine(transcription.Text);
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
audio = Pathname("audio.wav")
transcript = client.audio.transcriptions.create(
  file: audio,
  model: "gpt-transcribe"
)
puts(transcript.text)
```

```bash
openai audio:transcriptions create \
  --model gpt-transcribe \
  --file /path/to/file/audio.mp3 \
  --raw-output \
  --transform text
```

```bash
curl --request POST \
  --url https://api.openai.com/v1/audio/transcriptions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-Type: multipart/form-data' \
  --form file=@/path/to/file/audio.mp3 \
  --form model=gpt-transcribe
```


模型会以 JSON 格式返回转录文本和检测到的语言：

```json
{
  "text": "Bonjour, pouvez-vous m'entendre ?",
  "languages": [{ "code": "fr" }]
}
```

当模型无法做出可靠的语言预测时，它会返回 `"languages": []`。请参阅 [音频 API 参考](https://developers.openai.com/api/reference/resources/audio) 了解完整的请求和响应字段。

## 添加转录上下文

使用 `prompt`, `keywords`，以及 `languages` 以 `gpt-transcribe` 以提升领域术语和多语言音频的转录效果：

添加上下文和语言提示

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const request = {
  model: "gpt-transcribe",
  file: fs.createReadStream("fixtures/audio.wav"),
  prompt: "A customer support call about a premium plan and account AC-42.",
};

const transcription = await openai.audio.transcriptions.create(request, {
  body: {
    ...request,
    keywords: ["premium plan", "AC-42", "billing"],
    languages: ["en", "fr"],
  },
});

console.log(transcription.text);
```

```python
from openai import OpenAI

client = OpenAI()

with open("meeting.wav", "rb") as audio_file:
    transcription = client.audio.transcriptions.create(
        model="gpt-transcribe",
        file=audio_file,
        prompt="A customer support call about a premium plan and account AC-42.",
        extra_body={
            "keywords": ["premium plan", "AC-42", "billing"],
            "languages": ["en", "fr"],
        },
    )

print(transcription.text)
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	file, err := os.Open("fixtures/audio.wav")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	parameters := openai.AudioTranscriptionNewParams{
		File:   file,
		Model:  "gpt-transcribe",
		Prompt: openai.String("A customer support call about a premium plan and account AC-42."),
	}
	parameters.SetExtraFields(map[string]any{
		"keywords":  []string{"premium plan", "AC-42", "billing"},
		"languages": []string{"en", "fr"},
	})
	client := openai.NewClient()
	transcription, err := client.Audio.Transcriptions.New(context.Background(), parameters)
	if err != nil {
		panic(err)
	}
	fmt.Println(transcription.Text)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.audio.transcriptions.TranscriptionCreateParams;
import java.nio.file.Path;
import java.util.List;

var result =
    client
        .audio()
        .transcriptions()
        .create(
            TranscriptionCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_AUDIO_PATH")))
                .model("gpt-transcribe")
                .prompt("A customer support call about a premium plan and account AC-42.")
                .putAdditionalBodyProperty(
                    "keywords", JsonValue.from(List.of("premium plan", "AC-42", "billing")))
                .putAdditionalBodyProperty("languages", JsonValue.from(List.of("en", "fr")))
                .build());

System.out.println(result.asTranscription().text());
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
audio = Pathname("audio.wav")
transcript = client.audio.transcriptions.create(
  file: audio,
  model: "gpt-transcribe",
  keywords: ["OpenAI", "Responses API", "Codex"]
)
puts(transcript.text)
```

```bash
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F model="gpt-transcribe" \
  -F file="@/path/to/file/meeting.wav" \
  -F 'prompt=A customer support call about a premium plan and account AC-42.' \
  -F 'keywords[]=premium plan' \
  -F 'keywords[]=AC-42' \
  -F 'keywords[]=billing' \
  -F 'languages[]=en' \
  -F 'languages[]=fr'
```


- 使用 `prompt` 提供关于录制的非结构化上下文。
- 使用 `keywords` 提供你预期会听到的字面术语。
- 使用 `languages` 指定预期的输入语言。

关键词只是提示，并非必填输出。只包含相关术语，并评估它们能否在不让未提及的术语出现的前提下提升准确率。

对于 `gpt-transcribe`, `languages` 字段会替换原来的单数 `language` 字段。不要同时发送这两个字段。每个关键词单独成一行，不要包含 `<`, `>`、回车符或换行符。API 在遇到这些字符之一时，会拒绝整个请求；同样在 `prompt` 超出模型长度限制时，也会拒绝整个请求。

## 说话人分离

使用 `gpt-4o-transcribe-diarize` 仅当你需要识别一段录音中不同部分由谁发言时才会用到它。这个专门的说话人标记模型并不推荐用于普通的文件转录。

请求 `diarized_json` 响应格式以接收带有 `speaker`, `start`，以及 `end` 元数据的片段。对于超过 30 秒的音频，请将 `chunking_strategy` 设置为 `"auto"` 或一个语音活动检测配置。

你可以通过 `known_speaker_names[]` 和 `known_speaker_references[]` 可选地提供最多四个短音频参考，将片段映射到已知说话人。请提供长度在 2–10 秒之间的参考片段，格式可为主音频上传所支持的任意输入格式；在使用 multipart 表单数据时，请将其编码为 [data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) 。

对一段会议录音进行说话人分离

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const agentRef = fs.readFileSync("fixtures/agent.wav").toString("base64");

const transcript = /** @type {OpenAI.Audio.TranscriptionDiarized} */ (
  await openai.audio.transcriptions.create({
    file: fs.createReadStream("fixtures/meeting.wav"),
    model: "gpt-4o-transcribe-diarize",
    response_format: "diarized_json",
    chunking_strategy: "auto",
    known_speaker_names: ["agent"],
    known_speaker_references: ["data:audio/wav;base64," + agentRef],
  })
);

for (const segment of transcript.segments) {
  if (!("speaker" in segment)) continue;

  console.log(
    `${segment.speaker}: ${segment.text}`,
    segment.start,
    segment.end
  );
}
```

```python
import base64
from openai import OpenAI

client = OpenAI()


def to_data_url(path: str) -> str:
    with open(path, "rb") as fh:
        return "data:audio/wav;base64," + base64.b64encode(fh.read()).decode("utf-8")


with open("meeting.wav", "rb") as audio_file:
    transcript = client.audio.transcriptions.create(
        model="gpt-4o-transcribe-diarize",
        file=audio_file,
        response_format="diarized_json",
        chunking_strategy="auto",
        extra_body={
            "known_speaker_names": ["agent"],
            "known_speaker_references": [to_data_url("agent.wav")],
        },
    )

for segment in transcript.segments:
    print(segment.speaker, segment.text, segment.start, segment.end)
```

```go
package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/shared/constant"
)

type diarizedTranscript struct {
	Segments []struct {
		Speaker string  `json:"speaker"`
		Text    string  `json:"text"`
		Start   float64 `json:"start"`
		End     float64 `json:"end"`
	} `json:"segments"`
}

func main() {
	agentAudio, err := os.ReadFile("fixtures/agent.wav")
	if err != nil {
		panic(err)
	}
	meeting, err := os.Open("fixtures/meeting.wav")
	if err != nil {
		panic(err)
	}
	defer meeting.Close()

	client := openai.NewClient()
	transcription, err := client.Audio.Transcriptions.New(context.Background(), openai.AudioTranscriptionNewParams{
		File:           meeting,
		Model:          "gpt-4o-transcribe-diarize",
		ResponseFormat: openai.AudioResponseFormatDiarizedJSON,
		ChunkingStrategy: openai.AudioTranscriptionNewParamsChunkingStrategyUnion{
			OfAuto: constant.ValueOf[constant.Auto](),
		},
		KnownSpeakerNames:      []string{"agent"},
		KnownSpeakerReferences: []string{"data:audio/wav;base64," + base64.StdEncoding.EncodeToString(agentAudio)},
	})
	if err != nil {
		panic(err)
	}
	var result diarizedTranscript
	if err := json.Unmarshal([]byte(transcription.RawJSON()), &result); err != nil {
		panic(err)
	}
	for _, segment := range result.Segments {
		fmt.Println(segment.Speaker+":", segment.Text, segment.Start, segment.End)
	}
}
```

```java
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.audio.AudioResponseFormat;
import com.openai.models.audio.transcriptions.TranscriptionCreateParams;
import com.openai.models.audio.transcriptions.TranscriptionDiarized;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

Path audio = Path.of(System.getenv("OPENAI_EXAMPLE_AUDIO_PATH"));
Path speakerAudio = Path.of(System.getenv("OPENAI_EXAMPLE_SPEAKER_AUDIO_PATH"));
String speakerReference =
    "data:audio/wav;base64,"
        + Base64.getEncoder().encodeToString(Files.readAllBytes(speakerAudio));

var result =
    client
        .audio()
        .transcriptions()
        .create(
            TranscriptionCreateParams.builder()
                .file(audio)
                .model("gpt-4o-transcribe-diarize")
                .responseFormat(AudioResponseFormat.DIARIZED_JSON)
                .chunkingStrategyAuto()
                .addKnownSpeakerName("agent")
                .addKnownSpeakerReference(speakerReference)
                .build());

TranscriptionDiarized diarized =
    result.isDiarized()
        ? result.asDiarized()
        : new JsonMapper()
            .readValue(result.asTranscription().text(), TranscriptionDiarized.class);
for (var segment : diarized.segments()) {
  System.out.println(
      segment.speaker()
          + ": "
          + segment.text()
          + " ("
          + segment.start()
          + "-"
          + segment.end()
          + ")");
}
```

```ruby
require "base64"
require "openai"
require "pathname"

client = OpenAI::Client.new
audio = Pathname("meeting.wav")
speaker_reference = Base64.strict_encode64(File.binread("agent.wav"))
transcript = client.audio.transcriptions.create(
  file: audio,
  model: "gpt-4o-transcribe-diarize",
  response_format: :diarized_json,
  chunking_strategy: :auto,
  known_speaker_names: ["agent"],
  known_speaker_references: ["data:audio/wav;base64,#{speaker_reference}"]
)
segments = Array(
  transcript.to_h.fetch(:segments) do
    raise "The transcription did not include speaker segments"
  end
)
segments.each do |segment|
  segment = Hash.try_convert(segment) or raise "Invalid speaker segment"
  puts(
    "#{segment.fetch(:speaker)}: #{segment.fetch(:text)} " \
      "(#{segment.fetch(:start)}-#{segment.fetch(:end_)})"
  )
end
```

```bash
curl --request POST \
  --url https://api.openai.com/v1/audio/transcriptions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-Type: multipart/form-data' \
  --form file=@/path/to/file/meeting.wav \
  --form model=gpt-4o-transcribe-diarize \
  --form response_format=diarized_json \
  --form chunking_strategy=auto \
  --form 'known_speaker_names[]=agent' \
  --form 'known_speaker_references[]=data:audio/wav;base64,AAA...'
```


当 `stream=true`，时，带有说话人标记的响应会在每个片段完成时发出 `transcript.text.segment` 事件。 `transcript.text.delta` 事件包含一个 `segment_id` 字段，但增量不包含部分的说话人分配。模型只有在片段最终确定后才会分配说话人。

说话人标记功能可通过 `/v1/audio/transcriptions`。使用。它不
  支持在 Realtime 转录会话中使用。

## Translations

要将已完成的音频录音翻译成英文，请使用 `/v1/audio/translations` 以 `whisper-1`. 与保留录音原始语言的转写不同，此接口返回的是英文文本。

Translate audio

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const translation = await openai.audio.translations.create({
  file: fs.createReadStream("fixtures/german.wav"),
  model: "whisper-1",
});

console.log(translation.text);
```

```python
from openai import OpenAI

client = OpenAI()
audio_file = open("german.wav", "rb")

translation = client.audio.translations.create(
    model="whisper-1",
    file=audio_file,
)

print(translation.text)
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	file, err := os.Open("fixtures/german.wav")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	client := openai.NewClient()
	translation, err := client.Audio.Translations.New(context.Background(), openai.AudioTranslationNewParams{
		File:  file,
		Model: openai.AudioModelWhisper1,
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(translation.Text)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.audio.translations.TranslationCreateParams;
import java.nio.file.Path;

var result =
    client
        .audio()
        .translations()
        .create(
            TranslationCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_AUDIO_PATH")))
                .model("whisper-1")
                .build());

System.out.println(result.asTranslation().text());
```

```csharp
using OpenAI.Audio;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
AudioClient client = new("whisper-1", key);

await using FileStream audio = File.OpenRead("german.wav");
AudioTranslation translation = await client.TranslateAudioAsync(
    audio,
    "german.wav"
);

Console.WriteLine(translation.Text);
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
audio = Pathname("german.wav")
translation = client.audio.translations.create(file: audio, model: "whisper-1")
puts(translation.text)
```

```bash
curl --request POST \
  --url https://api.openai.com/v1/audio/translations \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-Type: multipart/form-data' \
  --form file=@/path/to/file/german.mp3 \
  --form model=whisper-1 \
```


对于其他语言的音频录音，响应中包含英文翻译：

```example-content
Hello, my name is Wolfgang and I come from Germany. Where are you heading today?
```

此接口仅支持翻译为英文。

## 支持的语言

使用 `languages` 以 `gpt-transcribe` 当你明确知道预期接收的输入语言时使用。支持的语言代码格式包括：

- ISO 639-1 代码，例如 `en`, `es`，以及 `fr`.
- 选定的 ISO 639-3 代码，例如 `eng`, `spa`, `yue`，以及 `cmn`.
- 地区 `zh` 区域代码，例如 `zh-cn`, `zh-tw`，以及 `zh-hk`.

API 会拒绝不受支持或格式不正确的语言代码。响应还会指出模型能够可靠检测到的语言。

对于 `whisper-1`，请参阅 [Whisper 语言列表](https://github.com/openai/whisper#available-models-and-languages)。Whisper 支持 98 种语言，但不同语言的准确率有所差异。现有模型在接收语言提示时使用 `language` 而非 `languages`.

## 时间戳

使用 `whisper-1` 当你需要词级或片段级时间戳时使用。 [`timestamp_granularities[]` parameter](/api/docs/api-reference/audio/createTranscription#audio-createtranscription-timestamp_granularities) 返回用于字幕生成和视频编辑的结构化时间戳数据。

时间戳选项

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream("fixtures/audio.wav"),
  model: "whisper-1",
  response_format: "verbose_json",
  timestamp_granularities: ["word"],
});

console.log(transcription.words);
```

```python
from openai import OpenAI

client = OpenAI()
audio_file = open("speech.wav", "rb")

transcription = client.audio.transcriptions.create(
    file=audio_file,
    model="whisper-1",
    response_format="verbose_json",
    timestamp_granularities=["word"],
)

print(transcription.words)
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	file, err := os.Open("fixtures/audio.wav")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	client := openai.NewClient()
	transcription, err := client.Audio.Transcriptions.New(context.Background(), openai.AudioTranscriptionNewParams{
		File:                   file,
		Model:                  openai.AudioModelWhisper1,
		ResponseFormat:         openai.AudioResponseFormatVerboseJSON,
		TimestampGranularities: []string{"word"},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(transcription.Words)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.audio.AudioResponseFormat;
import com.openai.models.audio.transcriptions.TranscriptionCreateParams;
import java.nio.file.Path;

var result =
    client
        .audio()
        .transcriptions()
        .create(
            TranscriptionCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_AUDIO_PATH")))
                .model("whisper-1")
                .responseFormat(AudioResponseFormat.VERBOSE_JSON)
                .addTimestampGranularity(TranscriptionCreateParams.TimestampGranularity.WORD)
                .build());

result
    .asVerbose()
    .words()
    .orElseThrow()
    .forEach(
        word -> System.out.println(word.word() + ": " + word.start() + " - " + word.end()));
```

```csharp
using OpenAI.Audio;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "whisper-1";
AudioClient client = new(model, key);

await using FileStream audio = File.OpenRead("speech.wav");
AudioTranscriptionOptions options = new()
{
    ResponseFormat = AudioTranscriptionFormat.Verbose,
    TimestampGranularities = AudioTimestampGranularities.Word,
};
AudioTranscription transcription = await client.TranscribeAudioAsync(
    audio,
    "speech.wav",
    options
);

foreach (TranscribedWord word in transcription.Words)
{
    Console.WriteLine(
        $"{word.Word}: {word.StartTime.TotalSeconds:0.00}s - {word.EndTime.TotalSeconds:0.00}s"
    );
}
```

```ruby
require "openai"
require "pathname"
require "pp"

client = OpenAI::Client.new
audio = Pathname("audio.wav")
transcript = client.audio.transcriptions.create(
  file: audio,
  model: "whisper-1",
  response_format: :verbose_json,
  timestamp_granularities: [:word]
)
pp(transcript[:words])
```

```bash
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F "timestamp_granularities[]=word" \
  -F model="whisper-1" \
  -F response_format="verbose_json"
```


该 `timestamp_granularities[]` 参数仅受支持于 `whisper-1`.

## 较长的输入

Transcriptions API 接受最大 25 MB 的文件。对于更大的录音，请使用压缩音频格式，或将文件拆分为不超过 25 MB 的片段。避免在句子中间进行拆分，以免丢失上下文并降低准确率。

一种处理方法是使用 [PyDub 开源 Python 包](https://github.com/jiaaro/pydub) 来拆分音频：

```python
from pydub import AudioSegment

song = AudioSegment.from_wav("good_morning.wav")

# PyDub handles time in milliseconds
ten_minutes = 10 * 60 * 1000

first_10_minutes = song[:ten_minutes]

first_10_minutes.export("good_morning_10.wav", format="wav")
```


_OpenAI 对 PyDub 等第三方软件的可用性或安全性不作任何保证。_

## 提示工程

使用 [prompt](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create#audio/createTranscription-prompt) 来提升对姓名、缩写、格式或录音相关专有词汇的识别效果。结合 `gpt-transcribe`，将该 prompt 与 `keywords` 和 `languages` 中所示的 [添加转录上下文](#add-transcription-context).

现有的 `gpt-4o-transcribe` 和 `gpt-4o-mini-transcribe` 集成也支持 prompt。 `gpt-4o-transcribe-diarize` 不支持 prompt。

常见的 prompt 使用场景包括：

- 正确转写产品名称、技术术语和缩写。
- 承接较长录音中前一段的上下文。
- 保留标点、大小写和填充词。
- 为某种语言选择首选的书写系统。

对于 `whisper-1`，提示有 224 个 token 的限制，且控制能力弱于推荐的转写模型。详见 [提升可靠性](#improving-reliability) 如果你的工作流需要使用 Whisper。



流式转写



文件转写可以在模型处理已完成的录音时流式输出部分文本。这不需要 Realtime 会话。

### 流式传输已完成的音频录制的转录

Set `stream=true` 以 `gpt-transcribe`. Transcriptions API 会返回 [转录事件](https://developers.openai.com/api/reference/resources/audio) ，模型会在转录音频各部分时发送这些事件。

流式转录

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const stream = await openai.audio.transcriptions.create({
  file: fs.createReadStream("fixtures/speech.wav"),
  model: "gpt-transcribe",
  // highlight-start
  stream: true,
  // highlight-end
});

// highlight-start
for await (const event of stream) {
  console.log(event);
}
// highlight-end
```

```python
from openai import OpenAI

client = OpenAI()
audio_file = open("speech.wav", "rb")

stream = client.audio.transcriptions.create(
    model="gpt-transcribe",
    file=audio_file,
    # highlight-start
    stream=True,
    # highlight-end
)

# highlight-start
for event in stream:
    print(event)
# highlight-end
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	file, err := os.Open("fixtures/speech.wav")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	client := openai.NewClient()
	stream := client.Audio.Transcriptions.NewStreaming(context.Background(), openai.AudioTranscriptionNewParams{
		File:  file,
		Model: "gpt-transcribe",
	})
	for stream.Next() {
		fmt.Println(stream.Current().Type)
	}
	if err := stream.Err(); err != nil {
		panic(err)
	}
}
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
audio = Pathname("speech.wav")
stream = client.audio.transcriptions.create_streaming(
  file: audio,
  model: "gpt-transcribe"
)

stream.each { |event| puts(event.type) }
```

```bash
curl --request POST \
  --url https://api.openai.com/v1/audio/transcriptions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-Type: multipart/form-data' \
  --form file=@example.wav \
  --form model=gpt-transcribe \
  # highlight-start
  --form stream=true
```


模型会发出 `transcript.text.delta` 事件来转录音频，然后在最终的 `transcript.text.done` 事件中返回完整转录文本。使用 `response_format="diarized_json"`，进行说话人标注的转录时，说话人分离模型还会在确定一个片段时发出一个 `transcript.text.segment` 事件。

对于 `gpt-transcribe`，最终事件还会包含检测到的语言：

```json
{
  "type": "transcript.text.done",
  "text": "Bonjour, pouvez-vous m'entendre ?",
  "languages": [{ "code": "fr" }]
}
```

现有的 `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`，以及
  `gpt-4o-transcribe-diarize` 集成也支持文件流式处理。
  `whisper-1` 不支持。

### 对正在进行的音频录制进行流式转录

对于来自麦克风、通话或媒体流的实时音频，请使用 [实时转写](https://developers.openai.com/api/docs/guides/realtime-transcription) 指南，而不是上面面向文件的流式处理路径。它涵盖了当前的转录会话流程以及推荐的实时路径，并附带 [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe).

## 提升可靠性

如果你使用 `whisper-1` 进行时间戳、字幕或翻译，这些技巧可以提升对不常见词汇和缩略语的识别。对于新的通用转录，从 `gpt-transcribe` 开始并使用 [转录上下文](#add-transcription-context) 。



### 使用 prompt 参数



第一种方法是使用可选的 prompt 参数，传入一个包含正确拼写的字典。

Whisper 不会像通用的文本模型那样遵循指令，它接受的 prompt 最长为 224 个 token。

prompt 参数

```javascript
import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI();

const transcription = await openai.audio.transcriptions.create({
  file: fs.createReadStream("fixtures/speech.wav"),
  model: "whisper-1",
  response_format: "text",
  prompt:
    "ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T.",
});

console.log(transcription);
```

```python
from openai import OpenAI

client = OpenAI()
audio_file = open("speech.wav", "rb")

transcription = client.audio.transcriptions.create(
    model="whisper-1",
    file=audio_file,
    response_format="text",
    prompt="ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T.",
)

print(transcription.text)
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	file, err := os.Open("fixtures/speech.wav")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	client := openai.NewClient()
	var transcription []byte
	err = client.Post(context.Background(), "audio/transcriptions", openai.AudioTranscriptionNewParams{
		File:           file,
		Model:          openai.AudioModelWhisper1,
		ResponseFormat: openai.AudioResponseFormatText,
		Prompt:         openai.String("ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T."),
	}, &transcription)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(transcription))
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.HttpResponse;
import com.openai.models.audio.AudioResponseFormat;
import com.openai.models.audio.transcriptions.TranscriptionCreateParams;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;

try (HttpResponse result =
    client
        .audio()
        .transcriptions()
        .withRawResponse()
        .create(
            TranscriptionCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_AUDIO_PATH")))
                .model("whisper-1")
                .responseFormat(AudioResponseFormat.TEXT)
                .prompt(
                    "ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, "
                        + "OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., "
                        + "Q.U.A.R.T.Z., F.L.I.N.T.")
                .build())) {
  System.out.println(new String(result.body().readAllBytes(), StandardCharsets.UTF_8));
}
```

```csharp
using OpenAI.Audio;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "whisper-1";
AudioClient client = new(model, key);

await using FileStream audio = File.OpenRead("speech.wav");
AudioTranscriptionOptions options = new()
{
    ResponseFormat = AudioTranscriptionFormat.Text,
    Prompt = "ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T.",
};
AudioTranscription transcription = await client.TranscribeAudioAsync(
    audio,
    "speech.wav",
    options
);

Console.WriteLine(transcription.Text);
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
audio = Pathname("speech.wav")
transcript = client.audio.transcriptions.create(
  file: audio,
  model: "whisper-1",
  prompt: "The speaker says OpenAI and Responses API"
)
puts(transcript.text)
```

```bash
curl --request POST \
  --url https://api.openai.com/v1/audio/transcriptions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-Type: multipart/form-data' \
  --form file=@/path/to/file/speech.mp3 \
  --form model=whisper-1 \
  --form prompt="ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T."
```


虽然这种方法提高了可靠性，但它仅限于 224 个 token，因此要使其成为一种可扩展的方案，你的 SKU 列表需要相对较小。







### 使用文本模型进行后处理



第二种方法使用文本模型对转录文本进行后处理。

通过 `system_prompt` 变量提供指令。与转录提示一样，你可以包含公司和产品名称。

后处理

```javascript
const systemPrompt = `
You are a helpful assistant for the company ZyntriQix. Your task is
to correct any spelling discrepancies in the transcribed text. Make
sure that the names of the following products are spelled correctly:
ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array,
OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K.,
Q.U.A.R.T.Z., F.L.I.N.T. Only add necessary punctuation such as
periods, commas, and capitalization, and use only the context provided.
`;

const transcript = await transcribe(audioFile);
const completion = await openai.chat.completions.create({
  model: "gpt-4.1",
  temperature: temperature,
  messages: [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: transcript,
    },
  ],
  store: true,
});

console.log(completion.choices[0].message.content);
```

```python
system_prompt = """
You are a helpful assistant for the company ZyntriQix. Your task is to correct
any spelling discrepancies in the transcribed text. Make sure that the names of
the following products are spelled correctly: ZyntriQix, Digique Plus,
CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven, DigiFractal
Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T. Only add necessary
punctuation such as periods, commas, and capitalization, and use only the
context provided.
"""


def generate_corrected_transcript(temperature, system_prompt, audio_file):
    response = client.chat.completions.create(
        model="gpt-4.1",
        temperature=temperature,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": transcribe(audio_file, "")},
        ],
    )
    return response.choices[0].message.content


corrected_text = generate_corrected_transcript(0, system_prompt, fake_company_filepath)
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

const systemPrompt = `
You are a helpful assistant for the company ZyntriQix. Your task is
to correct any spelling discrepancies in the transcribed text. Make
sure that the names of the following products are spelled correctly:
ZyntriQix, Digique Plus, CynapseFive, VortiQore V8, EchoNix Array,
OrbitalLink Seven, DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K.,
Q.U.A.R.T.Z., F.L.I.N.T. Only add necessary punctuation such as
periods, commas, and capitalization, and use only the context provided.
`

func main() {
	file, err := os.Open("fixtures/speech.wav")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	client := openai.NewClient()
	transcription, err := client.Audio.Transcriptions.New(context.Background(), openai.AudioTranscriptionNewParams{
		File:  file,
		Model: openai.AudioModelGPT4oTranscribe,
	})
	if err != nil {
		panic(err)
	}
	completion, err := client.Chat.Completions.New(context.Background(), openai.ChatCompletionNewParams{
		Model:       "gpt-4.1",
		Temperature: openai.Float(0),
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(systemPrompt),
			openai.UserMessage(transcription.Text),
		},
		Store: openai.Bool(true),
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(completion.Choices[0].Message.Content)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.audio.transcriptions.TranscriptionCreateParams;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import java.nio.file.Path;

String systemPrompt =
    """
    You are a helpful assistant for the company ZyntriQix. Your task is to
    correct any spelling discrepancies in the transcribed text. Make sure that
    the names of the following products are spelled correctly: ZyntriQix,
    Digique Plus, CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven,
    DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T.
    Only add necessary punctuation such as periods, commas, and capitalization,
    and use only the context provided.
    """;

var result =
    client
        .audio()
        .transcriptions()
        .create(
            TranscriptionCreateParams.builder()
                .file(Path.of(System.getenv("OPENAI_EXAMPLE_AUDIO_PATH")))
                .model("gpt-4o-transcribe")
                .build());

var completion =
    client
        .chat()
        .completions()
        .create(
            ChatCompletionCreateParams.builder()
                .model("gpt-4.1")
                .temperature(0.0)
                .store(true)
                .addSystemMessage(systemPrompt)
                .addUserMessage(result.asTranscription().text())
                .build());
completion.choices().stream()
    .flatMap(choice -> choice.message().content().stream())
    .forEach(System.out::println);
```

```csharp
using OpenAI.Audio;
using OpenAI.Chat;

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
string model = "gpt-4.1";
ChatClient client = new(model, key);

string transcriptionModel = "gpt-4o-transcribe";
AudioClient audio = new(transcriptionModel, key);

await using FileStream source = File.OpenRead("speech.wav");
AudioTranscription transcription = await audio.TranscribeAudioAsync(source, "speech.wav");

string systemPrompt =
    """
    You are a helpful assistant for the company ZyntriQix. Correct any
    spelling discrepancies in the transcribed text. Make sure the names
    of these products are spelled correctly: ZyntriQix, Digique Plus,
    CynapseFive, VortiQore V8, EchoNix Array, OrbitalLink Seven,
    DigiFractal Matrix, PULSE, RAPT, B.R.I.C.K., Q.U.A.R.T.Z., F.L.I.N.T.
    Only add necessary punctuation such as periods, commas, and
    capitalization, and use only the context provided.
    """;
ChatCompletionOptions correctionOptions = new() { Temperature = 0 };
ChatCompletion completion = await client.CompleteChatAsync(
    [
        new SystemChatMessage(systemPrompt),
        new UserChatMessage(transcription.Text),
    ],
    correctionOptions
);
Console.WriteLine(completion.Content[0].Text);
```

```ruby
require "openai"
require "pathname"

client = OpenAI::Client.new
audio = Pathname("speech.wav")
transcript = client.audio.transcriptions.create(
  file: audio,
  model: "gpt-4o-mini-transcribe"
)

response = client.responses.create(
  model: "gpt-4.1",
  input: "Add punctuation and paragraph breaks without changing the words:\n#{transcript.text}"
)
puts(response.output_text)
```


文本模型可以纠正拼写错误，并处理比 Whisper 的 224 token 提示窗口更长的术语列表。请对照原始音频评估修正结果，避免改变说话者的原意。