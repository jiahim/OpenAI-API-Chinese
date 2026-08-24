# File transcription

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use file transcription when you have a completed recording or a bounded audio request. Upload the audio and receive a final transcript, or stream text while the model processes the file.

Start with [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe). This is the recommended model for transcribing recorded speech in its original language. Use a specialized model only if you need speaker labels, word timestamps, subtitle formats, or translation into English.

Files can be up to 25 MB. Supported input formats are `mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `wav`, and `webm`.

For audio that is still arriving from a microphone, call, or media stream, use
  [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription).

## Quickstart

### Transcriptions

Send the audio file to `/v1/audio/transcriptions` with `gpt-transcribe`:

Transcribe audio

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


The model returns the transcript and the detected languages as JSON:

```json
{
  "text": "Bonjour, pouvez-vous m'entendre ?",
  "languages": [{ "code": "fr" }]
}
```

When the model can't make a reliable language prediction, it returns `"languages": []`. See the [Audio API reference](https://developers.openai.com/api/reference/resources/audio) for the complete request and response fields.

## Add transcription context

Use `prompt`, `keywords`, and `languages` with `gpt-transcribe` to improve transcription of domain terms and multilingual audio:

Add context and language hints

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


- Use `prompt` for unstructured context about the recording.
- Use `keywords` for literal terms you expect to hear.
- Use `languages` for the expected input languages.

Keywords are hints, not required output. Include only relevant terms, and evaluate whether they improve accuracy without causing unspoken terms to appear.

For `gpt-transcribe`, `languages` replaces the singular `language` field. Don't send both fields. Keep each keyword on one line and don't include `<`, `>`, a carriage return, or a line feed. The API rejects the entire request when it encounters one of these characters or when `prompt` exceeds the model's length limit.

## Speaker diarization

Use `gpt-4o-transcribe-diarize` only when you need to identify who speaks during different parts of a recording. This specialized speaker-labeling model isn't the recommended model for ordinary file transcription.

Request the `diarized_json` response format to receive segments with `speaker`, `start`, and `end` metadata. For audio longer than 30 seconds, set `chunking_strategy` to `"auto"` or a voice activity detection configuration.

You can optionally supply up to four short audio references with `known_speaker_names[]` and `known_speaker_references[]` to map segments onto known speakers. Provide reference clips between 2–10 seconds in any input format supported by the main audio upload; encode them as [data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) when using multipart form data.

Diarize a meeting recording

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
segments = Array(transcript.to_h.fetch(:segments) do
  raise "The transcription did not include speaker segments"
end)
segments.each do |segment|
  segment = Hash.try_convert(segment) or raise "Invalid speaker segment"
  puts(
    "#{segment.fetch(:speaker)}: #{segment.fetch(:text)} " \
      "(#{segment.fetch(:start)}-#{segment.fetch(:end)})"
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


When `stream=true`, speaker-labeled responses emit `transcript.text.segment` events whenever a segment completes. `transcript.text.delta` events include a `segment_id` field, but deltas don't include partial speaker assignments. The model assigns a speaker only when it finalizes the segment.

Speaker labeling is available through `/v1/audio/transcriptions`. It isn't
  supported in Realtime transcription sessions.

## Translations

To translate a completed audio recording into English, use `/v1/audio/translations` with `whisper-1`. Unlike transcription, which preserves the recording's original language, this endpoint returns English text.

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


For an audio recording in another language, the response contains the English translation:

```example-content
Hello, my name is Wolfgang and I come from Germany. Where are you heading today?
```

This endpoint supports translation into English only.

## Supported languages

Use `languages` with `gpt-transcribe` when you know which input languages to expect. Supported language-code formats include:

- ISO 639-1 codes, such as `en`, `es`, and `fr`.
- Selected ISO 639-3 codes, such as `eng`, `spa`, `yue`, and `cmn`.
- Regional `zh` locale codes, such as `zh-cn`, `zh-tw`, and `zh-hk`.

The API rejects unsupported or incorrectly formatted language codes. The response also identifies any languages that the model can reliably detect.

For `whisper-1`, consult the [Whisper language list](https://github.com/openai/whisper#available-models-and-languages). Whisper supports 98 languages, but accuracy varies by language. Existing models that accept one language hint use `language` instead of `languages`.

## Timestamps

Use `whisper-1` when you need word or segment timestamps. The [`timestamp_granularities[]` parameter](/api/docs/api-reference/audio/createTranscription#audio-createtranscription-timestamp_granularities) returns structured timestamp data for captioning and video editing.

Timestamp options

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


The `timestamp_granularities[]` parameter is only supported for `whisper-1`.

## Longer inputs

The Transcriptions API accepts files up to 25 MB. For larger recordings, use a compressed audio format or split the file into chunks of 25 MB or less. Avoid splitting in the middle of a sentence, which can remove context and reduce accuracy.

One way to handle this is to use the [PyDub open source Python package](https://github.com/jiaaro/pydub) to split the audio:

```python
from pydub import AudioSegment

song = AudioSegment.from_wav("good_morning.wav")

# PyDub handles time in milliseconds
ten_minutes = 10 * 60 * 1000

first_10_minutes = song[:ten_minutes]

first_10_minutes.export("good_morning_10.wav", format="wav")
```


_OpenAI makes no guarantees about the usability or security of third-party software like PyDub._

## Prompting

Use a [prompt](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create#audio/createTranscription-prompt) to improve recognition of names, acronyms, formatting, or recording-specific vocabulary. With `gpt-transcribe`, combine the prompt with the `keywords` and `languages` shown in [Add transcription context](#add-transcription-context).

Existing `gpt-4o-transcribe` and `gpt-4o-mini-transcribe` integrations also support prompting. `gpt-4o-transcribe-diarize` doesn't support prompts.

Useful prompting scenarios include:

- Correctly transcribing product names, technical terms, and acronyms.
- Carrying context from a previous chunk of a longer recording.
- Preserving punctuation, capitalization, and filler words.
- Selecting a preferred writing system for a language.

For `whisper-1`, prompts have a 224-token limit and provide less control than the recommended transcription model. See [Improving reliability](#improving-reliability) if your workflow requires Whisper.



Streaming transcriptions



File transcription can stream partial text while the model processes a completed recording. This doesn't require a Realtime session.

### Streaming the transcription of a completed audio recording

Set `stream=true` with `gpt-transcribe`. The Transcriptions API returns [transcript events](https://developers.openai.com/api/reference/resources/audio) as the model transcribes each part of the recording.

Stream transcriptions

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


The model emits `transcript.text.delta` events as it transcribes the audio, then returns the full transcript in a final `transcript.text.done` event. For speaker-labeled transcription with `response_format="diarized_json"`, the diarization model also emits a `transcript.text.segment` event whenever it finalizes a segment.

For `gpt-transcribe`, the final event also includes detected languages:

```json
{
  "type": "transcript.text.done",
  "text": "Bonjour, pouvez-vous m'entendre ?",
  "languages": [{ "code": "fr" }]
}
```

Existing `gpt-4o-transcribe`, `gpt-4o-mini-transcribe`, and
  `gpt-4o-transcribe-diarize` integrations also support file streaming.
  `whisper-1` doesn't.

### Streaming the transcription of an ongoing audio recording

For live audio from a microphone, call, or media stream, use the [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription) guide instead of the file-oriented streaming path above. It covers the current transcription-session flow and the recommended realtime path with [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe).

## Improving reliability

If you use `whisper-1` for timestamps, subtitles, or translation, these techniques can improve recognition of uncommon words and acronyms. For new general-purpose transcription, start with `gpt-transcribe` and use [transcription context](#add-transcription-context) instead.

Using the prompt parameter

The first method involves using the optional prompt parameter to pass a dictionary of the correct spellings.

Whisper doesn't follow instructions like a general-purpose text model and accepts prompts of up to 224 tokens.

Prompt parameter

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


While it increases reliability, this technique is limited to 224 tokens, so your list of SKUs needs to be relatively small for this to be a scalable solution.

Post-processing with a text model

The second method uses a text model to post-process the transcript.

Provide instructions through the `system_prompt` variable. As with the transcription prompt, you can include company and product names.

Post-processing

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


A text model can correct misspellings and handle longer terminology lists than Whisper's 224-token prompt window. Evaluate corrections against the original audio to avoid changing what the speaker said.