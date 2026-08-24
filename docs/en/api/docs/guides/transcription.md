# Transcription

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Transcription converts speech into text. Choose a workflow based on whether your audio is already recorded or is arriving live. Each workflow has one recommended starting model.

## Choose a transcription workflow

<table>
  <thead>
    <tr>
      <th>Workflow</th>
      <th>Use when</th>
      <th>Recommended model</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        [File transcription](https://developers.openai.com/api/docs/guides/speech-to-text)
      </td>
      <td>
        You have a completed recording or a bounded audio request. Upload the
        file and receive a final transcript, or stream text while the file is
        processed.
      </td>
      <td>
        [`gpt-transcribe`](https://developers.openai.com/api/docs/models/gpt-transcribe)
      </td>
    </tr>
    <tr>
      <td>
        [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription)
      </td>
      <td>
        You have a microphone, call, or other live audio stream and need text as
        speech arrives.
      </td>
      <td>
        [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe)
      </td>
    </tr>
  </tbody>
</table>

Streaming output and live audio are separate decisions. You can stream the transcription of a completed file without opening a Realtime session. Use Realtime only when your audio is arriving live or you need a persistent connection.

## Choose a specialized capability

Start with the recommended model for your workflow. Switch models only when your application requires a capability that the default doesn't provide.

| If you need                                       | Use                                                                                                                  |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Speaker-labeled transcripts                       | `gpt-4o-transcribe-diarize` with [file transcription](https://developers.openai.com/api/docs/guides/speech-to-text#speaker-diarization).          |
| Word timestamps or `srt` and `vtt` subtitles      | `whisper-1` with [file transcription](https://developers.openai.com/api/docs/guides/speech-to-text#timestamps).                                   |
| Translation of a completed recording into English | `whisper-1` with the [audio translations endpoint](https://developers.openai.com/api/docs/guides/speech-to-text#translations).                    |
| Detected input languages                          | `gpt-transcribe` with [file transcription](https://developers.openai.com/api/docs/guides/speech-to-text).                                         |
| Committed-turn transcription over WebSocket       | `gpt-transcribe` with [realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription#transcribe-a-committed-turn). |

Existing integrations can continue to use [`gpt-4o-transcribe`](https://developers.openai.com/api/docs/models/gpt-4o-transcribe), [`gpt-4o-mini-transcribe`](https://developers.openai.com/api/docs/models/gpt-4o-mini-transcribe), or [`gpt-realtime-whisper`](https://developers.openai.com/api/docs/models/gpt-realtime-whisper) where supported. These aren't the recommended starting models for a new transcription integration.

See [transcription pricing](https://developers.openai.com/api/docs/pricing#transcription-and-speech) and test the recommended path with representative audio before moving production traffic.

## Improve transcription quality

`gpt-transcribe` and `gpt-live-transcribe` accept three kinds of context:

- `prompt`: Free-form context about the recording, such as its topic or setting.
- `keywords`: Literal terms that may appear in the audio, such as product names, medications, or acronyms.
- `languages`: A list of expected input languages when the recording may contain more than one language.

Use these inputs only for context relevant to the audio; don't restate the transcription task. Keywords are hints, not required output. The transcript should include a keyword only when the audio contains it.

These models use `languages` instead of the singular `language` field. Existing transcription models that accept one language hint continue to use `language`.

When `gpt-transcribe` performs input transcription in a Realtime API session or runs in a dedicated transcription session, it automatically uses earlier transcribed turns as context.

## Test with representative audio

Test transcription under the audio conditions your application will encounter. Include:

- Target languages, accents, and code-switching patterns.
- Background noise, microphone quality, and telephony audio.
- Names, numbers, dates, alphanumeric strings, and domain terminology.
- Short utterances, long recordings, and interrupted speech.

Track errors that matter to the application instead of relying only on word error rate. For example, test medication names in a healthcare workflow or order numbers in a support workflow.

## Next steps

- [File transcription](https://developers.openai.com/api/docs/guides/speech-to-text).
- [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription).