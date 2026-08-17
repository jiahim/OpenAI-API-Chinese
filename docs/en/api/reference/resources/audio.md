# Audio

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Domain Types

### Audio Model

- `AudioModel = "whisper-1" or "gpt-transcribe" or "gpt-4o-transcribe" or 3 more`

  - `"whisper-1"`

  - `"gpt-transcribe"`

  - `"gpt-4o-transcribe"`

  - `"gpt-4o-mini-transcribe"`

  - `"gpt-4o-mini-transcribe-2025-12-15"`

  - `"gpt-4o-transcribe-diarize"`

### Audio Response Format

- `AudioResponseFormat = "json" or "text" or "srt" or 3 more`

  The format of the output, in one of these options: `json`, `text`, `srt`, `verbose_json`, `vtt`, or `diarized_json`. For `gpt-4o-transcribe` and `gpt-4o-mini-transcribe`, the only supported format is `json`. For `gpt-4o-transcribe-diarize`, the supported formats are `json`, `text`, and `diarized_json`, with `diarized_json` required to receive speaker annotations.

  - `"json"`

  - `"text"`

  - `"srt"`

  - `"verbose_json"`

  - `"vtt"`

  - `"diarized_json"`

# Speech

## Create speech

**post** `/audio/speech`

Generates audio from the input text.

Returns the audio file content, or a stream of audio events.

### Body Parameters

- `input: string`

  The text to generate audio for. The maximum length is 4096 characters.

- `model: string or SpeechModel`

  One of the available [TTS models](/docs/models#tts): `tts-1`, `tts-1-hd`, `gpt-4o-mini-tts`, or `gpt-4o-mini-tts-2025-12-15`.

  - `string`

  - `SpeechModel = "tts-1" or "tts-1-hd" or "gpt-4o-mini-tts" or "gpt-4o-mini-tts-2025-12-15"`

    - `"tts-1"`

    - `"tts-1-hd"`

    - `"gpt-4o-mini-tts"`

    - `"gpt-4o-mini-tts-2025-12-15"`

- `voice: string or "alloy" or "ash" or "ballad" or 7 more or object { id }`

  The voice to use when generating the audio. Supported built-in voices are `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer`, `verse`, `marin`, and `cedar`. You may also provide a custom voice object with an `id`, for example `{ "id": "voice_1234" }`. Previews of the voices are available in the [Text to speech guide](/docs/guides/text-to-speech#voice-options).

  - `string`

  - `"alloy" or "ash" or "ballad" or 7 more`

    - `"alloy"`

    - `"ash"`

    - `"ballad"`

    - `"coral"`

    - `"echo"`

    - `"sage"`

    - `"shimmer"`

    - `"verse"`

    - `"marin"`

    - `"cedar"`

  - `ID object { id }`

    Custom voice reference.

    - `id: string`

      The custom voice ID, e.g. `voice_1234`.

- `instructions: optional string`

  Control the voice of your generated audio with additional instructions. Does not work with `tts-1` or `tts-1-hd`.

- `response_format: optional "mp3" or "opus" or "aac" or 3 more`

  The format to audio in. Supported formats are `mp3`, `opus`, `aac`, `flac`, `wav`, and `pcm`.

  - `"mp3"`

  - `"opus"`

  - `"aac"`

  - `"flac"`

  - `"wav"`

  - `"pcm"`

- `speed: optional number`

  The speed of the generated audio. Select a value from `0.25` to `4.0`. `1.0` is the default.

- `stream_format: optional "sse" or "audio"`

  The format to stream the audio in. Supported formats are `sse` and `audio`. `sse` is not supported for `tts-1` or `tts-1-hd`.

  - `"sse"`

  - `"audio"`

### Example

```http
curl https://api.openai.com/v1/audio/speech \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "input": "input",
          "model": "tts-1",
          "voice": "alloy"
        }'
```

### Example

```http
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini-tts",
    "input": "The quick brown fox jumped over the lazy dog.",
    "voice": "alloy"
  }' \
  --output speech.mp3
```

### SSE Stream Format

```http
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini-tts",
    "input": "The quick brown fox jumped over the lazy dog.",
    "voice": "alloy",
    "stream_format": "sse"
  }'
```

## Domain Types

### Speech Model

- `SpeechModel = "tts-1" or "tts-1-hd" or "gpt-4o-mini-tts" or "gpt-4o-mini-tts-2025-12-15"`

  - `"tts-1"`

  - `"tts-1-hd"`

  - `"gpt-4o-mini-tts"`

  - `"gpt-4o-mini-tts-2025-12-15"`

# Transcriptions

## Create transcription

**post** `/audio/transcriptions`

Transcribes audio into the input language.

Returns a transcription object in `json`, `diarized_json`, or `verbose_json`
format, or a stream of transcript events.

### Returns

- `Transcription object { text, languages, logprobs, usage }`

  Represents a transcription response returned by model, based on the provided input.

  - `text: string`

    The transcribed text.

  - `languages: optional array of TranscriptionLanguage`

    The languages detected in the audio. Returned by `gpt-transcribe`. An empty array indicates that no language could be reliably detected.

    - `code: string`

      The code of a language detected in the audio.

  - `logprobs: optional array of object { token, bytes, logprob }`

    The log probabilities of the tokens in the transcription. Only returned with the models `gpt-4o-transcribe` and `gpt-4o-mini-transcribe` if `logprobs` is added to the `include` array.

    - `token: optional string`

      The token in the transcription.

    - `bytes: optional array of number`

      The bytes of the token.

    - `logprob: optional number`

      The log probability of the token.

  - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    Token usage statistics for the request.

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      Usage statistics for models billed by token usage.

      - `input_tokens: number`

        Number of input tokens billed for this request.

      - `output_tokens: number`

        Number of output tokens generated.

      - `total_tokens: number`

        Total number of tokens used (input + output).

      - `type: "tokens"`

        The type of the usage object. Always `tokens` for this variant.

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        Details about the input tokens billed for this request.

        - `audio_tokens: optional number`

          Number of audio tokens billed for this request.

        - `text_tokens: optional number`

          Number of text tokens billed for this request.

    - `Duration object { seconds, type }`

      Usage statistics for models billed by audio input duration.

      - `seconds: number`

        Duration of the input audio in seconds.

      - `type: "duration"`

        The type of the usage object. Always `duration` for this variant.

        - `"duration"`

- `TranscriptionDiarized object { duration, segments, task, 2 more }`

  Represents a diarized transcription response returned by the model, including the combined transcript and speaker-segment annotations.

  - `duration: number`

    Duration of the input audio in seconds.

  - `segments: array of TranscriptionDiarizedSegment`

    Segments of the transcript annotated with timestamps and speaker labels.

    - `id: string`

      Unique identifier for the segment.

    - `end: number`

      End timestamp of the segment in seconds.

    - `speaker: string`

      Speaker label for this segment. When known speakers are provided, the label matches `known_speaker_names[]`. Otherwise speakers are labeled sequentially using capital letters (`A`, `B`, ...).

    - `start: number`

      Start timestamp of the segment in seconds.

    - `text: string`

      Transcript text for this segment.

    - `type: "transcript.text.segment"`

      The type of the segment. Always `transcript.text.segment`.

      - `"transcript.text.segment"`

  - `task: "transcribe"`

    The type of task that was run. Always `transcribe`.

    - `"transcribe"`

  - `text: string`

    The concatenated transcript text for the entire audio input.

  - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    Token or duration usage statistics for the request.

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      Usage statistics for models billed by token usage.

      - `input_tokens: number`

        Number of input tokens billed for this request.

      - `output_tokens: number`

        Number of output tokens generated.

      - `total_tokens: number`

        Total number of tokens used (input + output).

      - `type: "tokens"`

        The type of the usage object. Always `tokens` for this variant.

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        Details about the input tokens billed for this request.

        - `audio_tokens: optional number`

          Number of audio tokens billed for this request.

        - `text_tokens: optional number`

          Number of text tokens billed for this request.

    - `Duration object { seconds, type }`

      Usage statistics for models billed by audio input duration.

      - `seconds: number`

        Duration of the input audio in seconds.

      - `type: "duration"`

        The type of the usage object. Always `duration` for this variant.

        - `"duration"`

- `TranscriptionVerbose object { duration, language, text, 3 more }`

  Represents a verbose json transcription response returned by model, based on the provided input.

  - `duration: number`

    The duration of the input audio.

  - `language: string`

    The language of the input audio.

  - `text: string`

    The transcribed text.

  - `segments: optional array of TranscriptionSegment`

    Segments of the transcribed text and their corresponding details.

    - `id: number`

      Unique identifier of the segment.

    - `avg_logprob: number`

      Average logprob of the segment. If the value is lower than -1, consider the logprobs failed.

    - `compression_ratio: number`

      Compression ratio of the segment. If the value is greater than 2.4, consider the compression failed.

    - `end: number`

      End time of the segment in seconds.

    - `no_speech_prob: number`

      Probability of no speech in the segment. If the value is higher than 1.0 and the `avg_logprob` is below -1, consider this segment silent.

    - `seek: number`

      Seek offset of the segment.

    - `start: number`

      Start time of the segment in seconds.

    - `temperature: number`

      Temperature parameter used for generating the segment.

    - `text: string`

      Text content of the segment.

    - `tokens: array of number`

      Array of token IDs for the text content.

  - `usage: optional object { seconds, type }`

    Usage statistics for models billed by audio input duration.

    - `seconds: number`

      Duration of the input audio in seconds.

    - `type: "duration"`

      The type of the usage object. Always `duration` for this variant.

      - `"duration"`

  - `words: optional array of TranscriptionWord`

    Extracted words and their corresponding timestamps.

    - `end: number`

      End time of the word in seconds.

    - `start: number`

      Start time of the word in seconds.

    - `word: string`

      The text content of the word.

### Example

```http
curl https://api.openai.com/v1/audio/transcriptions \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'file=@/path/to/file' \
    -F model=gpt-4o-transcribe
```

#### Response

```json
{
  "text": "text",
  "languages": [
    {
      "code": "code"
    }
  ],
  "logprobs": [
    {
      "token": "token",
      "bytes": [
        0
      ],
      "logprob": 0
    }
  ],
  "usage": {
    "input_tokens": 0,
    "output_tokens": 0,
    "total_tokens": 0,
    "type": "tokens",
    "input_token_details": {
      "audio_tokens": 0,
      "text_tokens": 0
    }
  }
}
```

### Example

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F model="gpt-4o-transcribe"
```

#### Response

```json
{
  "text": "Imagine the wildest idea that you've ever had, and you're curious about how it might scale to something that's a 100, a 1,000 times bigger. This is a place where you can get to do that.",
  "usage": {
    "type": "tokens",
    "input_tokens": 14,
    "input_token_details": {
      "text_tokens": 0,
      "audio_tokens": 14
    },
    "output_tokens": 45,
    "total_tokens": 59
  }
}
```

### Diarization

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/meeting.wav" \
  -F model="gpt-4o-transcribe-diarize" \
  -F response_format="diarized_json" \
  -F chunking_strategy=auto \
  -F 'known_speaker_names[]=agent' \
  -F 'known_speaker_references[]=data:audio/wav;base64,AAA...'
```

#### Response

```json
{
  "task": "transcribe",
  "duration": 27.4,
  "text": "Agent: Thanks for calling OpenAI support.\nA: Hi, I'm trying to enable diarization.\nAgent: Happy to walk you through the steps.",
  "segments": [
    {
      "type": "transcript.text.segment",
      "id": "seg_001",
      "start": 0.0,
      "end": 4.7,
      "text": "Thanks for calling OpenAI support.",
      "speaker": "agent"
    },
    {
      "type": "transcript.text.segment",
      "id": "seg_002",
      "start": 4.7,
      "end": 11.8,
      "text": "Hi, I'm trying to enable diarization.",
      "speaker": "A"
    },
    {
      "type": "transcript.text.segment",
      "id": "seg_003",
      "start": 12.1,
      "end": 18.5,
      "text": "Happy to walk you through the steps.",
      "speaker": "agent"
    }
  ],
  "usage": {
    "type": "duration",
    "seconds": 27
  }
}
```

### Logprobs

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F "include[]=logprobs" \
  -F model="gpt-4o-transcribe" \
  -F response_format="json"
```

#### Response

```json
{
  "text": "Hey, my knee is hurting and I want to see the doctor tomorrow ideally.",
  "logprobs": [
    { "token": "Hey", "logprob": -1.0415299, "bytes": [72, 101, 121] },
    { "token": ",", "logprob": -9.805982e-5, "bytes": [44] },
    { "token": " my", "logprob": -0.00229799, "bytes": [32, 109, 121] },
    {
      "token": " knee",
      "logprob": -4.7159858e-5,
      "bytes": [32, 107, 110, 101, 101]
    },
    { "token": " is", "logprob": -0.043909557, "bytes": [32, 105, 115] },
    {
      "token": " hurting",
      "logprob": -1.1041146e-5,
      "bytes": [32, 104, 117, 114, 116, 105, 110, 103]
    },
    { "token": " and", "logprob": -0.011076359, "bytes": [32, 97, 110, 100] },
    { "token": " I", "logprob": -5.3193703e-6, "bytes": [32, 73] },
    {
      "token": " want",
      "logprob": -0.0017156356,
      "bytes": [32, 119, 97, 110, 116]
    },
    { "token": " to", "logprob": -7.89631e-7, "bytes": [32, 116, 111] },
    { "token": " see", "logprob": -5.5122365e-7, "bytes": [32, 115, 101, 101] },
    { "token": " the", "logprob": -0.0040786397, "bytes": [32, 116, 104, 101] },
    {
      "token": " doctor",
      "logprob": -2.3392786e-6,
      "bytes": [32, 100, 111, 99, 116, 111, 114]
    },
    {
      "token": " tomorrow",
      "logprob": -7.89631e-7,
      "bytes": [32, 116, 111, 109, 111, 114, 114, 111, 119]
    },
    {
      "token": " ideally",
      "logprob": -0.5800861,
      "bytes": [32, 105, 100, 101, 97, 108, 108, 121]
    },
    { "token": ".", "logprob": -0.00011093382, "bytes": [46] }
  ],
  "usage": {
    "type": "tokens",
    "input_tokens": 14,
    "input_token_details": {
      "text_tokens": 0,
      "audio_tokens": 14
    },
    "output_tokens": 45,
    "total_tokens": 59
  }
}
```

### Segment timestamps

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F "timestamp_granularities[]=segment" \
  -F model="whisper-1" \
  -F response_format="verbose_json"
```

#### Response

```json
{
  "task": "transcribe",
  "language": "english",
  "duration": 8.470000267028809,
  "text": "The beach was a popular spot on a hot summer day. People were swimming in the ocean, building sandcastles, and playing beach volleyball.",
  "segments": [
    {
      "id": 0,
      "seek": 0,
      "start": 0.0,
      "end": 3.319999933242798,
      "text": " The beach was a popular spot on a hot summer day.",
      "tokens": [
        50364, 440, 7534, 390, 257, 3743, 4008, 322, 257, 2368, 4266, 786, 13, 50530
      ],
      "temperature": 0.0,
      "avg_logprob": -0.2860786020755768,
      "compression_ratio": 1.2363636493682861,
      "no_speech_prob": 0.00985979475080967
    },
    ...
  ],
  "usage": {
    "type": "duration",
    "seconds": 9
  }
}
```

### Streaming

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F model="gpt-4o-mini-transcribe" \
  -F stream=true
```

#### Response

```json
data: {"type":"transcript.text.delta","delta":"I","logprobs":[{"token":"I","logprob":-0.00007588794,"bytes":[73]}]}

data: {"type":"transcript.text.delta","delta":" see","logprobs":[{"token":" see","logprob":-3.1281633e-7,"bytes":[32,115,101,101]}]}

data: {"type":"transcript.text.delta","delta":" skies","logprobs":[{"token":" skies","logprob":-2.3392786e-6,"bytes":[32,115,107,105,101,115]}]}

data: {"type":"transcript.text.delta","delta":" of","logprobs":[{"token":" of","logprob":-3.1281633e-7,"bytes":[32,111,102]}]}

data: {"type":"transcript.text.delta","delta":" blue","logprobs":[{"token":" blue","logprob":-1.0280384e-6,"bytes":[32,98,108,117,101]}]}

data: {"type":"transcript.text.delta","delta":" and","logprobs":[{"token":" and","logprob":-0.0005108566,"bytes":[32,97,110,100]}]}

data: {"type":"transcript.text.delta","delta":" clouds","logprobs":[{"token":" clouds","logprob":-1.9361265e-7,"bytes":[32,99,108,111,117,100,115]}]}

data: {"type":"transcript.text.delta","delta":" of","logprobs":[{"token":" of","logprob":-1.9361265e-7,"bytes":[32,111,102]}]}

data: {"type":"transcript.text.delta","delta":" white","logprobs":[{"token":" white","logprob":-7.89631e-7,"bytes":[32,119,104,105,116,101]}]}

data: {"type":"transcript.text.delta","delta":",","logprobs":[{"token":",","logprob":-0.0014890312,"bytes":[44]}]}

data: {"type":"transcript.text.delta","delta":" the","logprobs":[{"token":" the","logprob":-0.0110956915,"bytes":[32,116,104,101]}]}

data: {"type":"transcript.text.delta","delta":" bright","logprobs":[{"token":" bright","logprob":0.0,"bytes":[32,98,114,105,103,104,116]}]}

data: {"type":"transcript.text.delta","delta":" blessed","logprobs":[{"token":" blessed","logprob":-0.000045848617,"bytes":[32,98,108,101,115,115,101,100]}]}

data: {"type":"transcript.text.delta","delta":" days","logprobs":[{"token":" days","logprob":-0.000010802739,"bytes":[32,100,97,121,115]}]}

data: {"type":"transcript.text.delta","delta":",","logprobs":[{"token":",","logprob":-0.00001700133,"bytes":[44]}]}

data: {"type":"transcript.text.delta","delta":" the","logprobs":[{"token":" the","logprob":-0.0000118755715,"bytes":[32,116,104,101]}]}

data: {"type":"transcript.text.delta","delta":" dark","logprobs":[{"token":" dark","logprob":-5.5122365e-7,"bytes":[32,100,97,114,107]}]}

data: {"type":"transcript.text.delta","delta":" sacred","logprobs":[{"token":" sacred","logprob":-5.4385737e-6,"bytes":[32,115,97,99,114,101,100]}]}

data: {"type":"transcript.text.delta","delta":" nights","logprobs":[{"token":" nights","logprob":-4.00813e-6,"bytes":[32,110,105,103,104,116,115]}]}

data: {"type":"transcript.text.delta","delta":",","logprobs":[{"token":",","logprob":-0.0036910512,"bytes":[44]}]}

data: {"type":"transcript.text.delta","delta":" and","logprobs":[{"token":" and","logprob":-0.0031903093,"bytes":[32,97,110,100]}]}

data: {"type":"transcript.text.delta","delta":" I","logprobs":[{"token":" I","logprob":-1.504853e-6,"bytes":[32,73]}]}

data: {"type":"transcript.text.delta","delta":" think","logprobs":[{"token":" think","logprob":-4.3202e-7,"bytes":[32,116,104,105,110,107]}]}

data: {"type":"transcript.text.delta","delta":" to","logprobs":[{"token":" to","logprob":-1.9361265e-7,"bytes":[32,116,111]}]}

data: {"type":"transcript.text.delta","delta":" myself","logprobs":[{"token":" myself","logprob":-1.7432603e-6,"bytes":[32,109,121,115,101,108,102]}]}

data: {"type":"transcript.text.delta","delta":",","logprobs":[{"token":",","logprob":-0.29254505,"bytes":[44]}]}

data: {"type":"transcript.text.delta","delta":" what","logprobs":[{"token":" what","logprob":-0.016815351,"bytes":[32,119,104,97,116]}]}

data: {"type":"transcript.text.delta","delta":" a","logprobs":[{"token":" a","logprob":-3.1281633e-7,"bytes":[32,97]}]}

data: {"type":"transcript.text.delta","delta":" wonderful","logprobs":[{"token":" wonderful","logprob":-2.1008714e-6,"bytes":[32,119,111,110,100,101,114,102,117,108]}]}

data: {"type":"transcript.text.delta","delta":" world","logprobs":[{"token":" world","logprob":-8.180258e-6,"bytes":[32,119,111,114,108,100]}]}

data: {"type":"transcript.text.delta","delta":".","logprobs":[{"token":".","logprob":-0.014231676,"bytes":[46]}]}

data: {"type":"transcript.text.done","text":"I see skies of blue and clouds of white, the bright blessed days, the dark sacred nights, and I think to myself, what a wonderful world.","logprobs":[{"token":"I","logprob":-0.00007588794,"bytes":[73]},{"token":" see","logprob":-3.1281633e-7,"bytes":[32,115,101,101]},{"token":" skies","logprob":-2.3392786e-6,"bytes":[32,115,107,105,101,115]},{"token":" of","logprob":-3.1281633e-7,"bytes":[32,111,102]},{"token":" blue","logprob":-1.0280384e-6,"bytes":[32,98,108,117,101]},{"token":" and","logprob":-0.0005108566,"bytes":[32,97,110,100]},{"token":" clouds","logprob":-1.9361265e-7,"bytes":[32,99,108,111,117,100,115]},{"token":" of","logprob":-1.9361265e-7,"bytes":[32,111,102]},{"token":" white","logprob":-7.89631e-7,"bytes":[32,119,104,105,116,101]},{"token":",","logprob":-0.0014890312,"bytes":[44]},{"token":" the","logprob":-0.0110956915,"bytes":[32,116,104,101]},{"token":" bright","logprob":0.0,"bytes":[32,98,114,105,103,104,116]},{"token":" blessed","logprob":-0.000045848617,"bytes":[32,98,108,101,115,115,101,100]},{"token":" days","logprob":-0.000010802739,"bytes":[32,100,97,121,115]},{"token":",","logprob":-0.00001700133,"bytes":[44]},{"token":" the","logprob":-0.0000118755715,"bytes":[32,116,104,101]},{"token":" dark","logprob":-5.5122365e-7,"bytes":[32,100,97,114,107]},{"token":" sacred","logprob":-5.4385737e-6,"bytes":[32,115,97,99,114,101,100]},{"token":" nights","logprob":-4.00813e-6,"bytes":[32,110,105,103,104,116,115]},{"token":",","logprob":-0.0036910512,"bytes":[44]},{"token":" and","logprob":-0.0031903093,"bytes":[32,97,110,100]},{"token":" I","logprob":-1.504853e-6,"bytes":[32,73]},{"token":" think","logprob":-4.3202e-7,"bytes":[32,116,104,105,110,107]},{"token":" to","logprob":-1.9361265e-7,"bytes":[32,116,111]},{"token":" myself","logprob":-1.7432603e-6,"bytes":[32,109,121,115,101,108,102]},{"token":",","logprob":-0.29254505,"bytes":[44]},{"token":" what","logprob":-0.016815351,"bytes":[32,119,104,97,116]},{"token":" a","logprob":-3.1281633e-7,"bytes":[32,97]},{"token":" wonderful","logprob":-2.1008714e-6,"bytes":[32,119,111,110,100,101,114,102,117,108]},{"token":" world","logprob":-8.180258e-6,"bytes":[32,119,111,114,108,100]},{"token":".","logprob":-0.014231676,"bytes":[46]}],"usage":{"input_tokens":14,"input_token_details":{"text_tokens":0,"audio_tokens":14},"output_tokens":45,"total_tokens":59}}
```

### Word timestamps

```http
curl https://api.openai.com/v1/audio/transcriptions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/audio.mp3" \
  -F "timestamp_granularities[]=word" \
  -F model="whisper-1" \
  -F response_format="verbose_json"
```

#### Response

```json
{
  "task": "transcribe",
  "language": "english",
  "duration": 8.470000267028809,
  "text": "The beach was a popular spot on a hot summer day. People were swimming in the ocean, building sandcastles, and playing beach volleyball.",
  "words": [
    {
      "word": "The",
      "start": 0.0,
      "end": 0.23999999463558197
    },
    ...
    {
      "word": "volleyball",
      "start": 7.400000095367432,
      "end": 7.900000095367432
    }
  ],
  "usage": {
    "type": "duration",
    "seconds": 9
  }
}
```

## Domain Types

### Transcription

- `Transcription object { text, languages, logprobs, usage }`

  Represents a transcription response returned by model, based on the provided input.

  - `text: string`

    The transcribed text.

  - `languages: optional array of TranscriptionLanguage`

    The languages detected in the audio. Returned by `gpt-transcribe`. An empty array indicates that no language could be reliably detected.

    - `code: string`

      The code of a language detected in the audio.

  - `logprobs: optional array of object { token, bytes, logprob }`

    The log probabilities of the tokens in the transcription. Only returned with the models `gpt-4o-transcribe` and `gpt-4o-mini-transcribe` if `logprobs` is added to the `include` array.

    - `token: optional string`

      The token in the transcription.

    - `bytes: optional array of number`

      The bytes of the token.

    - `logprob: optional number`

      The log probability of the token.

  - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    Token usage statistics for the request.

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      Usage statistics for models billed by token usage.

      - `input_tokens: number`

        Number of input tokens billed for this request.

      - `output_tokens: number`

        Number of output tokens generated.

      - `total_tokens: number`

        Total number of tokens used (input + output).

      - `type: "tokens"`

        The type of the usage object. Always `tokens` for this variant.

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        Details about the input tokens billed for this request.

        - `audio_tokens: optional number`

          Number of audio tokens billed for this request.

        - `text_tokens: optional number`

          Number of text tokens billed for this request.

    - `Duration object { seconds, type }`

      Usage statistics for models billed by audio input duration.

      - `seconds: number`

        Duration of the input audio in seconds.

      - `type: "duration"`

        The type of the usage object. Always `duration` for this variant.

        - `"duration"`

### Transcription Create Response

- `TranscriptionCreateResponse = Transcription or TranscriptionDiarized or TranscriptionVerbose`

  Represents a transcription response returned by model, based on the provided input.

  - `Transcription object { text, languages, logprobs, usage }`

    Represents a transcription response returned by model, based on the provided input.

    - `text: string`

      The transcribed text.

    - `languages: optional array of TranscriptionLanguage`

      The languages detected in the audio. Returned by `gpt-transcribe`. An empty array indicates that no language could be reliably detected.

      - `code: string`

        The code of a language detected in the audio.

    - `logprobs: optional array of object { token, bytes, logprob }`

      The log probabilities of the tokens in the transcription. Only returned with the models `gpt-4o-transcribe` and `gpt-4o-mini-transcribe` if `logprobs` is added to the `include` array.

      - `token: optional string`

        The token in the transcription.

      - `bytes: optional array of number`

        The bytes of the token.

      - `logprob: optional number`

        The log probability of the token.

    - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

      Token usage statistics for the request.

      - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

        Usage statistics for models billed by token usage.

        - `input_tokens: number`

          Number of input tokens billed for this request.

        - `output_tokens: number`

          Number of output tokens generated.

        - `total_tokens: number`

          Total number of tokens used (input + output).

        - `type: "tokens"`

          The type of the usage object. Always `tokens` for this variant.

          - `"tokens"`

        - `input_token_details: optional object { audio_tokens, text_tokens }`

          Details about the input tokens billed for this request.

          - `audio_tokens: optional number`

            Number of audio tokens billed for this request.

          - `text_tokens: optional number`

            Number of text tokens billed for this request.

      - `Duration object { seconds, type }`

        Usage statistics for models billed by audio input duration.

        - `seconds: number`

          Duration of the input audio in seconds.

        - `type: "duration"`

          The type of the usage object. Always `duration` for this variant.

          - `"duration"`

  - `TranscriptionDiarized object { duration, segments, task, 2 more }`

    Represents a diarized transcription response returned by the model, including the combined transcript and speaker-segment annotations.

    - `duration: number`

      Duration of the input audio in seconds.

    - `segments: array of TranscriptionDiarizedSegment`

      Segments of the transcript annotated with timestamps and speaker labels.

      - `id: string`

        Unique identifier for the segment.

      - `end: number`

        End timestamp of the segment in seconds.

      - `speaker: string`

        Speaker label for this segment. When known speakers are provided, the label matches `known_speaker_names[]`. Otherwise speakers are labeled sequentially using capital letters (`A`, `B`, ...).

      - `start: number`

        Start timestamp of the segment in seconds.

      - `text: string`

        Transcript text for this segment.

      - `type: "transcript.text.segment"`

        The type of the segment. Always `transcript.text.segment`.

        - `"transcript.text.segment"`

    - `task: "transcribe"`

      The type of task that was run. Always `transcribe`.

      - `"transcribe"`

    - `text: string`

      The concatenated transcript text for the entire audio input.

    - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

      Token or duration usage statistics for the request.

      - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

        Usage statistics for models billed by token usage.

        - `input_tokens: number`

          Number of input tokens billed for this request.

        - `output_tokens: number`

          Number of output tokens generated.

        - `total_tokens: number`

          Total number of tokens used (input + output).

        - `type: "tokens"`

          The type of the usage object. Always `tokens` for this variant.

          - `"tokens"`

        - `input_token_details: optional object { audio_tokens, text_tokens }`

          Details about the input tokens billed for this request.

          - `audio_tokens: optional number`

            Number of audio tokens billed for this request.

          - `text_tokens: optional number`

            Number of text tokens billed for this request.

      - `Duration object { seconds, type }`

        Usage statistics for models billed by audio input duration.

        - `seconds: number`

          Duration of the input audio in seconds.

        - `type: "duration"`

          The type of the usage object. Always `duration` for this variant.

          - `"duration"`

  - `TranscriptionVerbose object { duration, language, text, 3 more }`

    Represents a verbose json transcription response returned by model, based on the provided input.

    - `duration: number`

      The duration of the input audio.

    - `language: string`

      The language of the input audio.

    - `text: string`

      The transcribed text.

    - `segments: optional array of TranscriptionSegment`

      Segments of the transcribed text and their corresponding details.

      - `id: number`

        Unique identifier of the segment.

      - `avg_logprob: number`

        Average logprob of the segment. If the value is lower than -1, consider the logprobs failed.

      - `compression_ratio: number`

        Compression ratio of the segment. If the value is greater than 2.4, consider the compression failed.

      - `end: number`

        End time of the segment in seconds.

      - `no_speech_prob: number`

        Probability of no speech in the segment. If the value is higher than 1.0 and the `avg_logprob` is below -1, consider this segment silent.

      - `seek: number`

        Seek offset of the segment.

      - `start: number`

        Start time of the segment in seconds.

      - `temperature: number`

        Temperature parameter used for generating the segment.

      - `text: string`

        Text content of the segment.

      - `tokens: array of number`

        Array of token IDs for the text content.

    - `usage: optional object { seconds, type }`

      Usage statistics for models billed by audio input duration.

      - `seconds: number`

        Duration of the input audio in seconds.

      - `type: "duration"`

        The type of the usage object. Always `duration` for this variant.

        - `"duration"`

    - `words: optional array of TranscriptionWord`

      Extracted words and their corresponding timestamps.

      - `end: number`

        End time of the word in seconds.

      - `start: number`

        Start time of the word in seconds.

      - `word: string`

        The text content of the word.

### Transcription Diarized

- `TranscriptionDiarized object { duration, segments, task, 2 more }`

  Represents a diarized transcription response returned by the model, including the combined transcript and speaker-segment annotations.

  - `duration: number`

    Duration of the input audio in seconds.

  - `segments: array of TranscriptionDiarizedSegment`

    Segments of the transcript annotated with timestamps and speaker labels.

    - `id: string`

      Unique identifier for the segment.

    - `end: number`

      End timestamp of the segment in seconds.

    - `speaker: string`

      Speaker label for this segment. When known speakers are provided, the label matches `known_speaker_names[]`. Otherwise speakers are labeled sequentially using capital letters (`A`, `B`, ...).

    - `start: number`

      Start timestamp of the segment in seconds.

    - `text: string`

      Transcript text for this segment.

    - `type: "transcript.text.segment"`

      The type of the segment. Always `transcript.text.segment`.

      - `"transcript.text.segment"`

  - `task: "transcribe"`

    The type of task that was run. Always `transcribe`.

    - `"transcribe"`

  - `text: string`

    The concatenated transcript text for the entire audio input.

  - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }  or object { seconds, type }`

    Token or duration usage statistics for the request.

    - `Tokens object { input_tokens, output_tokens, total_tokens, 2 more }`

      Usage statistics for models billed by token usage.

      - `input_tokens: number`

        Number of input tokens billed for this request.

      - `output_tokens: number`

        Number of output tokens generated.

      - `total_tokens: number`

        Total number of tokens used (input + output).

      - `type: "tokens"`

        The type of the usage object. Always `tokens` for this variant.

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        Details about the input tokens billed for this request.

        - `audio_tokens: optional number`

          Number of audio tokens billed for this request.

        - `text_tokens: optional number`

          Number of text tokens billed for this request.

    - `Duration object { seconds, type }`

      Usage statistics for models billed by audio input duration.

      - `seconds: number`

        Duration of the input audio in seconds.

      - `type: "duration"`

        The type of the usage object. Always `duration` for this variant.

        - `"duration"`

### Transcription Diarized Segment

- `TranscriptionDiarizedSegment object { id, end, speaker, 3 more }`

  A segment of diarized transcript text with speaker metadata.

  - `id: string`

    Unique identifier for the segment.

  - `end: number`

    End timestamp of the segment in seconds.

  - `speaker: string`

    Speaker label for this segment. When known speakers are provided, the label matches `known_speaker_names[]`. Otherwise speakers are labeled sequentially using capital letters (`A`, `B`, ...).

  - `start: number`

    Start timestamp of the segment in seconds.

  - `text: string`

    Transcript text for this segment.

  - `type: "transcript.text.segment"`

    The type of the segment. Always `transcript.text.segment`.

    - `"transcript.text.segment"`

### Transcription Include

- `TranscriptionInclude = "logprobs"`

  - `"logprobs"`

### Transcription Language

- `TranscriptionLanguage object { code }`

  A language detected in transcribed audio.

  - `code: string`

    The code of a language detected in the audio.

### Transcription Segment

- `TranscriptionSegment object { id, avg_logprob, compression_ratio, 7 more }`

  - `id: number`

    Unique identifier of the segment.

  - `avg_logprob: number`

    Average logprob of the segment. If the value is lower than -1, consider the logprobs failed.

  - `compression_ratio: number`

    Compression ratio of the segment. If the value is greater than 2.4, consider the compression failed.

  - `end: number`

    End time of the segment in seconds.

  - `no_speech_prob: number`

    Probability of no speech in the segment. If the value is higher than 1.0 and the `avg_logprob` is below -1, consider this segment silent.

  - `seek: number`

    Seek offset of the segment.

  - `start: number`

    Start time of the segment in seconds.

  - `temperature: number`

    Temperature parameter used for generating the segment.

  - `text: string`

    Text content of the segment.

  - `tokens: array of number`

    Array of token IDs for the text content.

### Transcription Stream Event

- `TranscriptionStreamEvent = TranscriptionTextSegmentEvent or TranscriptionTextDeltaEvent or TranscriptionTextDoneEvent`

  Emitted when a diarized transcription returns a completed segment with speaker information. Only emitted when you [create a transcription](/docs/api-reference/audio/create-transcription) with `stream` set to `true` and `response_format` set to `diarized_json`.

  - `TranscriptionTextSegmentEvent object { id, end, speaker, 3 more }`

    Emitted when a diarized transcription returns a completed segment with speaker information. Only emitted when you [create a transcription](/docs/api-reference/audio/create-transcription) with `stream` set to `true` and `response_format` set to `diarized_json`.

    - `id: string`

      Unique identifier for the segment.

    - `end: number`

      End timestamp of the segment in seconds.

    - `speaker: string`

      Speaker label for this segment.

    - `start: number`

      Start timestamp of the segment in seconds.

    - `text: string`

      Transcript text for this segment.

    - `type: "transcript.text.segment"`

      The type of the event. Always `transcript.text.segment`.

      - `"transcript.text.segment"`

  - `TranscriptionTextDeltaEvent object { delta, type, logprobs, segment_id }`

    Emitted when there is an additional text delta. This is also the first event emitted when the transcription starts. Only emitted when you [create a transcription](/docs/api-reference/audio/create-transcription) with the `Stream` parameter set to `true`.

    - `delta: string`

      The text delta that was additionally transcribed.

    - `type: "transcript.text.delta"`

      The type of the event. Always `transcript.text.delta`.

      - `"transcript.text.delta"`

    - `logprobs: optional array of object { token, bytes, logprob }`

      The log probabilities of the delta. Only included if you [create a transcription](/docs/api-reference/audio/create-transcription) with the `include[]` parameter set to `logprobs`.

      - `token: optional string`

        The token that was used to generate the log probability.

      - `bytes: optional array of number`

        The bytes that were used to generate the log probability.

      - `logprob: optional number`

        The log probability of the token.

    - `segment_id: optional string`

      Identifier of the diarized segment that this delta belongs to. Only present when using `gpt-4o-transcribe-diarize`.

  - `TranscriptionTextDoneEvent object { text, type, languages, 2 more }`

    Emitted when the transcription is complete. Contains the complete transcription text. Only emitted when you [create a transcription](/docs/api-reference/audio/create-transcription) with the `Stream` parameter set to `true`.

    - `text: string`

      The text that was transcribed.

    - `type: "transcript.text.done"`

      The type of the event. Always `transcript.text.done`.

      - `"transcript.text.done"`

    - `languages: optional array of TranscriptionLanguage`

      The languages detected in the audio. Returned by `gpt-transcribe`. An empty array indicates that no language could be reliably detected.

      - `code: string`

        The code of a language detected in the audio.

    - `logprobs: optional array of object { token, bytes, logprob }`

      The log probabilities of the individual tokens in the transcription. Only included if you [create a transcription](/docs/api-reference/audio/create-transcription) with the `include[]` parameter set to `logprobs`.

      - `token: optional string`

        The token that was used to generate the log probability.

      - `bytes: optional array of number`

        The bytes that were used to generate the log probability.

      - `logprob: optional number`

        The log probability of the token.

    - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }`

      Usage statistics for models billed by token usage.

      - `input_tokens: number`

        Number of input tokens billed for this request.

      - `output_tokens: number`

        Number of output tokens generated.

      - `total_tokens: number`

        Total number of tokens used (input + output).

      - `type: "tokens"`

        The type of the usage object. Always `tokens` for this variant.

        - `"tokens"`

      - `input_token_details: optional object { audio_tokens, text_tokens }`

        Details about the input tokens billed for this request.

        - `audio_tokens: optional number`

          Number of audio tokens billed for this request.

        - `text_tokens: optional number`

          Number of text tokens billed for this request.

### Transcription Text Delta Event

- `TranscriptionTextDeltaEvent object { delta, type, logprobs, segment_id }`

  Emitted when there is an additional text delta. This is also the first event emitted when the transcription starts. Only emitted when you [create a transcription](/docs/api-reference/audio/create-transcription) with the `Stream` parameter set to `true`.

  - `delta: string`

    The text delta that was additionally transcribed.

  - `type: "transcript.text.delta"`

    The type of the event. Always `transcript.text.delta`.

    - `"transcript.text.delta"`

  - `logprobs: optional array of object { token, bytes, logprob }`

    The log probabilities of the delta. Only included if you [create a transcription](/docs/api-reference/audio/create-transcription) with the `include[]` parameter set to `logprobs`.

    - `token: optional string`

      The token that was used to generate the log probability.

    - `bytes: optional array of number`

      The bytes that were used to generate the log probability.

    - `logprob: optional number`

      The log probability of the token.

  - `segment_id: optional string`

    Identifier of the diarized segment that this delta belongs to. Only present when using `gpt-4o-transcribe-diarize`.

### Transcription Text Done Event

- `TranscriptionTextDoneEvent object { text, type, languages, 2 more }`

  Emitted when the transcription is complete. Contains the complete transcription text. Only emitted when you [create a transcription](/docs/api-reference/audio/create-transcription) with the `Stream` parameter set to `true`.

  - `text: string`

    The text that was transcribed.

  - `type: "transcript.text.done"`

    The type of the event. Always `transcript.text.done`.

    - `"transcript.text.done"`

  - `languages: optional array of TranscriptionLanguage`

    The languages detected in the audio. Returned by `gpt-transcribe`. An empty array indicates that no language could be reliably detected.

    - `code: string`

      The code of a language detected in the audio.

  - `logprobs: optional array of object { token, bytes, logprob }`

    The log probabilities of the individual tokens in the transcription. Only included if you [create a transcription](/docs/api-reference/audio/create-transcription) with the `include[]` parameter set to `logprobs`.

    - `token: optional string`

      The token that was used to generate the log probability.

    - `bytes: optional array of number`

      The bytes that were used to generate the log probability.

    - `logprob: optional number`

      The log probability of the token.

  - `usage: optional object { input_tokens, output_tokens, total_tokens, 2 more }`

    Usage statistics for models billed by token usage.

    - `input_tokens: number`

      Number of input tokens billed for this request.

    - `output_tokens: number`

      Number of output tokens generated.

    - `total_tokens: number`

      Total number of tokens used (input + output).

    - `type: "tokens"`

      The type of the usage object. Always `tokens` for this variant.

      - `"tokens"`

    - `input_token_details: optional object { audio_tokens, text_tokens }`

      Details about the input tokens billed for this request.

      - `audio_tokens: optional number`

        Number of audio tokens billed for this request.

      - `text_tokens: optional number`

        Number of text tokens billed for this request.

### Transcription Text Segment Event

- `TranscriptionTextSegmentEvent object { id, end, speaker, 3 more }`

  Emitted when a diarized transcription returns a completed segment with speaker information. Only emitted when you [create a transcription](/docs/api-reference/audio/create-transcription) with `stream` set to `true` and `response_format` set to `diarized_json`.

  - `id: string`

    Unique identifier for the segment.

  - `end: number`

    End timestamp of the segment in seconds.

  - `speaker: string`

    Speaker label for this segment.

  - `start: number`

    Start timestamp of the segment in seconds.

  - `text: string`

    Transcript text for this segment.

  - `type: "transcript.text.segment"`

    The type of the event. Always `transcript.text.segment`.

    - `"transcript.text.segment"`

### Transcription Verbose

- `TranscriptionVerbose object { duration, language, text, 3 more }`

  Represents a verbose json transcription response returned by model, based on the provided input.

  - `duration: number`

    The duration of the input audio.

  - `language: string`

    The language of the input audio.

  - `text: string`

    The transcribed text.

  - `segments: optional array of TranscriptionSegment`

    Segments of the transcribed text and their corresponding details.

    - `id: number`

      Unique identifier of the segment.

    - `avg_logprob: number`

      Average logprob of the segment. If the value is lower than -1, consider the logprobs failed.

    - `compression_ratio: number`

      Compression ratio of the segment. If the value is greater than 2.4, consider the compression failed.

    - `end: number`

      End time of the segment in seconds.

    - `no_speech_prob: number`

      Probability of no speech in the segment. If the value is higher than 1.0 and the `avg_logprob` is below -1, consider this segment silent.

    - `seek: number`

      Seek offset of the segment.

    - `start: number`

      Start time of the segment in seconds.

    - `temperature: number`

      Temperature parameter used for generating the segment.

    - `text: string`

      Text content of the segment.

    - `tokens: array of number`

      Array of token IDs for the text content.

  - `usage: optional object { seconds, type }`

    Usage statistics for models billed by audio input duration.

    - `seconds: number`

      Duration of the input audio in seconds.

    - `type: "duration"`

      The type of the usage object. Always `duration` for this variant.

      - `"duration"`

  - `words: optional array of TranscriptionWord`

    Extracted words and their corresponding timestamps.

    - `end: number`

      End time of the word in seconds.

    - `start: number`

      Start time of the word in seconds.

    - `word: string`

      The text content of the word.

### Transcription Word

- `TranscriptionWord object { end, start, word }`

  - `end: number`

    End time of the word in seconds.

  - `start: number`

    Start time of the word in seconds.

  - `word: string`

    The text content of the word.

# Translations

## Create translation

**post** `/audio/translations`

Translates audio into English.

### Returns

- `Translation object { text }`

  - `text: string`

- `TranslationVerbose object { duration, language, text, segments }`

  - `duration: number`

    The duration of the input audio.

  - `language: string`

    The language of the output translation (always `english`).

  - `text: string`

    The translated text.

  - `segments: optional array of TranscriptionSegment`

    Segments of the translated text and their corresponding details.

    - `id: number`

      Unique identifier of the segment.

    - `avg_logprob: number`

      Average logprob of the segment. If the value is lower than -1, consider the logprobs failed.

    - `compression_ratio: number`

      Compression ratio of the segment. If the value is greater than 2.4, consider the compression failed.

    - `end: number`

      End time of the segment in seconds.

    - `no_speech_prob: number`

      Probability of no speech in the segment. If the value is higher than 1.0 and the `avg_logprob` is below -1, consider this segment silent.

    - `seek: number`

      Seek offset of the segment.

    - `start: number`

      Start time of the segment in seconds.

    - `temperature: number`

      Temperature parameter used for generating the segment.

    - `text: string`

      Text content of the segment.

    - `tokens: array of number`

      Array of token IDs for the text content.

### Example

```http
curl https://api.openai.com/v1/audio/translations \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'file=@/path/to/file' \
    -F model=whisper-1
```

#### Response

```json
{
  "text": "text"
}
```

### Example

```http
curl https://api.openai.com/v1/audio/translations \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F file="@/path/to/file/german.m4a" \
  -F model="whisper-1"
```

#### Response

```json
{
  "text": "Hello, my name is Wolfgang and I come from Germany. Where are you heading today?"
}
```

## Domain Types

### Translation

- `Translation object { text }`

  - `text: string`

### Translation Create Response

- `TranslationCreateResponse = Translation or TranslationVerbose`

  - `Translation object { text }`

    - `text: string`

  - `TranslationVerbose object { duration, language, text, segments }`

    - `duration: number`

      The duration of the input audio.

    - `language: string`

      The language of the output translation (always `english`).

    - `text: string`

      The translated text.

    - `segments: optional array of TranscriptionSegment`

      Segments of the translated text and their corresponding details.

      - `id: number`

        Unique identifier of the segment.

      - `avg_logprob: number`

        Average logprob of the segment. If the value is lower than -1, consider the logprobs failed.

      - `compression_ratio: number`

        Compression ratio of the segment. If the value is greater than 2.4, consider the compression failed.

      - `end: number`

        End time of the segment in seconds.

      - `no_speech_prob: number`

        Probability of no speech in the segment. If the value is higher than 1.0 and the `avg_logprob` is below -1, consider this segment silent.

      - `seek: number`

        Seek offset of the segment.

      - `start: number`

        Start time of the segment in seconds.

      - `temperature: number`

        Temperature parameter used for generating the segment.

      - `text: string`

        Text content of the segment.

      - `tokens: array of number`

        Array of token IDs for the text content.

### Translation Verbose

- `TranslationVerbose object { duration, language, text, segments }`

  - `duration: number`

    The duration of the input audio.

  - `language: string`

    The language of the output translation (always `english`).

  - `text: string`

    The translated text.

  - `segments: optional array of TranscriptionSegment`

    Segments of the translated text and their corresponding details.

    - `id: number`

      Unique identifier of the segment.

    - `avg_logprob: number`

      Average logprob of the segment. If the value is lower than -1, consider the logprobs failed.

    - `compression_ratio: number`

      Compression ratio of the segment. If the value is greater than 2.4, consider the compression failed.

    - `end: number`

      End time of the segment in seconds.

    - `no_speech_prob: number`

      Probability of no speech in the segment. If the value is higher than 1.0 and the `avg_logprob` is below -1, consider this segment silent.

    - `seek: number`

      Seek offset of the segment.

    - `start: number`

      Start time of the segment in seconds.

    - `temperature: number`

      Temperature parameter used for generating the segment.

    - `text: string`

      Text content of the segment.

    - `tokens: array of number`

      Array of token IDs for the text content.

# Voice Consents

## Create voice consent

**post** `/audio/voice_consents`

Upload a voice consent recording.

### Returns

- `id: string`

  The consent recording identifier.

- `created_at: number`

  The Unix timestamp (in seconds) for when the consent recording was created.

- `language: string`

  The BCP 47 language tag for the consent phrase (for example, `en-US`).

- `name: string`

  The label provided when the consent recording was uploaded.

- `object: "audio.voice_consent"`

  The object type, which is always `audio.voice_consent`.

  - `"audio.voice_consent"`

### Example

```http
curl https://api.openai.com/v1/audio/voice_consents \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F language=language \
    -F name=name \
    -F 'recording=@/path/to/recording'
```

#### Response

```json
{
  "id": "cons_1234",
  "created_at": 0,
  "language": "language",
  "name": "name",
  "object": "audio.voice_consent"
}
```

### Example

```http
curl https://api.openai.com/v1/audio/voice_consents \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "name=John Doe" \
  -F "language=en-US" \
  -F "recording=@$HOME/consent_recording.wav;type=audio/x-wav"
```

## Delete voice consent

**delete** `/audio/voice_consents/{consent_id}`

Deletes a voice consent recording.

### Path Parameters

- `consent_id: string`

### Returns

- `id: string`

  The consent recording identifier.

- `deleted: boolean`

- `object: "audio.voice_consent"`

  - `"audio.voice_consent"`

### Example

```http
curl https://api.openai.com/v1/audio/voice_consents/$CONSENT_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "cons_1234",
  "deleted": true,
  "object": "audio.voice_consent"
}
```

### Example

```http
curl https://api.openai.com/v1/audio/voice_consents/cons_1234 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## List voice consents

**get** `/audio/voice_consents`

Returns a list of voice consent recordings.

### Query Parameters

- `after: optional string`

  A cursor for use in pagination. `after` is an object ID that defines your place in the list. For instance, if you make a list request and receive 100 objects, ending with obj_foo, your subsequent call can include after=obj_foo in order to fetch the next page of the list.

- `limit: optional number`

  A limit on the number of objects to be returned. Limit can range between 1 and 100, and the default is 20.

### Returns

- `data: array of object { id, created_at, language, 2 more }`

  - `id: string`

    The consent recording identifier.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the consent recording was created.

  - `language: string`

    The BCP 47 language tag for the consent phrase (for example, `en-US`).

  - `name: string`

    The label provided when the consent recording was uploaded.

  - `object: "audio.voice_consent"`

    The object type, which is always `audio.voice_consent`.

    - `"audio.voice_consent"`

- `has_more: boolean`

- `object: "list"`

  - `"list"`

- `first_id: optional string or null`

- `last_id: optional string or null`

### Example

```http
curl https://api.openai.com/v1/audio/voice_consents \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "data": [
    {
      "id": "cons_1234",
      "created_at": 0,
      "language": "language",
      "name": "name",
      "object": "audio.voice_consent"
    }
  ],
  "has_more": true,
  "object": "list",
  "first_id": "first_id",
  "last_id": "last_id"
}
```

### Example

```http
curl https://api.openai.com/v1/audio/voice_consents?limit=20 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Retrieve voice consent

**get** `/audio/voice_consents/{consent_id}`

Retrieves a voice consent recording.

### Path Parameters

- `consent_id: string`

### Returns

- `id: string`

  The consent recording identifier.

- `created_at: number`

  The Unix timestamp (in seconds) for when the consent recording was created.

- `language: string`

  The BCP 47 language tag for the consent phrase (for example, `en-US`).

- `name: string`

  The label provided when the consent recording was uploaded.

- `object: "audio.voice_consent"`

  The object type, which is always `audio.voice_consent`.

  - `"audio.voice_consent"`

### Example

```http
curl https://api.openai.com/v1/audio/voice_consents/$CONSENT_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "cons_1234",
  "created_at": 0,
  "language": "language",
  "name": "name",
  "object": "audio.voice_consent"
}
```

### Example

```http
curl https://api.openai.com/v1/audio/voice_consents/cons_1234 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

## Update voice consent

**post** `/audio/voice_consents/{consent_id}`

Updates a voice consent recording (metadata only).

### Path Parameters

- `consent_id: string`

### Body Parameters

- `name: string`

  The updated label for this consent recording.

### Returns

- `id: string`

  The consent recording identifier.

- `created_at: number`

  The Unix timestamp (in seconds) for when the consent recording was created.

- `language: string`

  The BCP 47 language tag for the consent phrase (for example, `en-US`).

- `name: string`

  The label provided when the consent recording was uploaded.

- `object: "audio.voice_consent"`

  The object type, which is always `audio.voice_consent`.

  - `"audio.voice_consent"`

### Example

```http
curl https://api.openai.com/v1/audio/voice_consents/$CONSENT_ID \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "name": "name"
        }'
```

#### Response

```json
{
  "id": "cons_1234",
  "created_at": 0,
  "language": "language",
  "name": "name",
  "object": "audio.voice_consent"
}
```

### Example

```http
curl https://api.openai.com/v1/audio/voice_consents/cons_1234 \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe"
  }'
```

## Domain Types

### Voice Consent Create Response

- `VoiceConsentCreateResponse object { id, created_at, language, 2 more }`

  A consent recording used to authorize creation of a custom voice.

  - `id: string`

    The consent recording identifier.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the consent recording was created.

  - `language: string`

    The BCP 47 language tag for the consent phrase (for example, `en-US`).

  - `name: string`

    The label provided when the consent recording was uploaded.

  - `object: "audio.voice_consent"`

    The object type, which is always `audio.voice_consent`.

    - `"audio.voice_consent"`

### Voice Consent Delete Response

- `VoiceConsentDeleteResponse object { id, deleted, object }`

  - `id: string`

    The consent recording identifier.

  - `deleted: boolean`

  - `object: "audio.voice_consent"`

    - `"audio.voice_consent"`

### Voice Consent List Response

- `VoiceConsentListResponse object { id, created_at, language, 2 more }`

  A consent recording used to authorize creation of a custom voice.

  - `id: string`

    The consent recording identifier.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the consent recording was created.

  - `language: string`

    The BCP 47 language tag for the consent phrase (for example, `en-US`).

  - `name: string`

    The label provided when the consent recording was uploaded.

  - `object: "audio.voice_consent"`

    The object type, which is always `audio.voice_consent`.

    - `"audio.voice_consent"`

### Voice Consent Retrieve Response

- `VoiceConsentRetrieveResponse object { id, created_at, language, 2 more }`

  A consent recording used to authorize creation of a custom voice.

  - `id: string`

    The consent recording identifier.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the consent recording was created.

  - `language: string`

    The BCP 47 language tag for the consent phrase (for example, `en-US`).

  - `name: string`

    The label provided when the consent recording was uploaded.

  - `object: "audio.voice_consent"`

    The object type, which is always `audio.voice_consent`.

    - `"audio.voice_consent"`

### Voice Consent Update Response

- `VoiceConsentUpdateResponse object { id, created_at, language, 2 more }`

  A consent recording used to authorize creation of a custom voice.

  - `id: string`

    The consent recording identifier.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the consent recording was created.

  - `language: string`

    The BCP 47 language tag for the consent phrase (for example, `en-US`).

  - `name: string`

    The label provided when the consent recording was uploaded.

  - `object: "audio.voice_consent"`

    The object type, which is always `audio.voice_consent`.

    - `"audio.voice_consent"`

# Voices

## Create voice

**post** `/audio/voices`

Creates a custom voice.

### Returns

- `id: string`

  The voice identifier, which can be referenced in API endpoints.

- `created_at: number`

  The Unix timestamp (in seconds) for when the voice was created.

- `name: string`

  The name of the voice.

- `object: "audio.voice"`

  The object type, which is always `audio.voice`.

  - `"audio.voice"`

### Example

```http
curl https://api.openai.com/v1/audio/voices \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'audio_sample=@/path/to/audio_sample' \
    -F consent=consent \
    -F name=name
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "name": "name",
  "object": "audio.voice"
}
```

### Example

```http
curl https://api.openai.com/v1/audio/voices \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "name=My new voice" \
  -F "consent=cons_1234" \
  -F "audio_sample=@$HOME/audio_sample.wav;type=audio/x-wav"
```

## Domain Types

### Voice Create Response

- `VoiceCreateResponse object { id, created_at, name, object }`

  A custom voice that can be used for audio output.

  - `id: string`

    The voice identifier, which can be referenced in API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the voice was created.

  - `name: string`

    The name of the voice.

  - `object: "audio.voice"`

    The object type, which is always `audio.voice`.

    - `"audio.voice"`
