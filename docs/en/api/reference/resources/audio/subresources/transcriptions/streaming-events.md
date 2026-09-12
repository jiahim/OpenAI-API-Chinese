# Transcription streaming events

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

<a id="transcript.text.segment"></a>

## transcript.text.segment

Emitted when a diarized transcription returns a completed segment with speaker information. Only emitted when you [create a transcription](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) with `stream` set to `true` and `response_format` set to `diarized_json`.

### Schema

Schema name: `TranscriptTextSegmentEvent`

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

### Example

```json
{
  "type": "transcript.text.segment",
  "id": "seg_002",
  "start": 5.2,
  "end": 12.8,
  "text": "Hi, I need help with diarization.",
  "speaker": "A"
}
```

<a id="transcript.text.delta"></a>

## transcript.text.delta

Emitted when there is an additional text delta. This is also the first event emitted when the transcription starts. Only emitted when you [create a transcription](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) with the `Stream` parameter set to `true`.

### Schema

Schema name: `TranscriptTextDeltaEvent`

- `delta: string`

  The text delta that was additionally transcribed.

- `type: "transcript.text.delta"`

  The type of the event. Always `transcript.text.delta`.

  - `"transcript.text.delta"`

- `logprobs: optional array of object { token, bytes, logprob }`

  The log probabilities of the delta. Only included if you [create a transcription](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) with the `include[]` parameter set to `logprobs`.

  - `token: optional string`

    The token that was used to generate the log probability.

  - `bytes: optional array of number`

    The bytes that were used to generate the log probability.

  - `logprob: optional number`

    The log probability of the token.

- `segment_id: optional string`

  Identifier of the diarized segment that this delta belongs to. Only present when using `gpt-4o-transcribe-diarize`.

### Example

```json
{
  "type": "transcript.text.delta",
  "delta": " wonderful"
}
```

<a id="transcript.text.done"></a>

## transcript.text.done

Emitted when the transcription is complete. Contains the complete transcription text. Only emitted when you [create a transcription](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) with the `Stream` parameter set to `true`.

### Schema

Schema name: `TranscriptTextDoneEvent`

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

  The log probabilities of the individual tokens in the transcription. Only included if you [create a transcription](https://developers.openai.com/api/reference/resources/audio/subresources/transcriptions/methods/create) with the `include[]` parameter set to `logprobs`.

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

### Example

```json
{
  "type": "transcript.text.done",
  "text": "I see skies of blue and clouds of white, the bright blessed days, the dark sacred nights, and I think to myself, what a wonderful world.",
  "usage": {
    "type": "tokens",
    "input_tokens": 14,
    "input_token_details": {
      "text_tokens": 10,
      "audio_tokens": 4
    },
    "output_tokens": 31,
    "total_tokens": 45
  }
}
```
