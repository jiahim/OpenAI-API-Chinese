# Voice activity detection (VAD)

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Voice activity detection (VAD) is a feature available in the Realtime API allowing to automatically detect when the user has started or stopped speaking.
It is enabled by default in [speech-to-speech](https://developers.openai.com/api/docs/guides/realtime-conversations) Realtime sessions, but is optional and can be turned off.
In [transcription](https://developers.openai.com/api/docs/guides/realtime-transcription) Realtime sessions, turn detection support depends on the transcription model. Models that support VAD default to `server_vad`, while `gpt-realtime-whisper` requires turn detection to be omitted or set to `null`.

## Overview

When VAD is enabled, the audio is chunked automatically and the Realtime API sends events to indicate when the user has started or stopped speaking:

- `input_audio_buffer.speech_started`: The start of a speech turn
- `input_audio_buffer.speech_stopped`: The end of a speech turn

You can use these events to handle speech turns in your application. For example, you can use them to manage conversation state or process transcripts in chunks.

You can configure VAD with the [`session.update`](https://developers.openai.com/api/reference/resources/realtime) client event by setting `session.audio.input.turn_detection`.

There are two modes for VAD:

- `server_vad`: Automatically chunks the audio based on periods of silence.
- `semantic_vad`: Chunks the audio when the model believes based on the words said by the user that they have completed their utterance.

For sessions and models that support VAD, the default value is `server_vad`.

Read below to learn more about the different modes.

## Server VAD

Server VAD is the default mode for speech-to-speech sessions, and for transcription sessions on models that support turn detection. It uses periods of silence to automatically chunk the audio.

You can adjust the following properties to fine-tune the VAD settings:

- `threshold`: Activation threshold (0 to 1). A higher threshold will require louder audio to activate the model, and thus might perform better in noisy environments.
- `prefix_padding_ms`: Amount of audio (in milliseconds) to include before the VAD detected speech.
- `silence_duration_ms`: Duration of silence (in milliseconds) to detect speech stop. With shorter values turns will be detected more quickly.

Here is an example VAD configuration:

```json
{
  "type": "session.update",
  "session": {
    "type": "realtime",
    "audio": {
      "input": {
        "turn_detection": {
          "type": "server_vad",
          "threshold": 0.5,
          "prefix_padding_ms": 300,
          "silence_duration_ms": 500,
          "create_response": true, // only in conversation mode
          "interrupt_response": true // only in conversation mode
        }
      }
    }
  }
}
```

Use the same `session.audio.input.turn_detection` field in transcription sessions. For `gpt-realtime-whisper`, omit turn detection or set it to `null`.

The `create_response` and `interrupt_response` fields are only used in speech-to-speech conversations. In transcription sessions, VAD only controls how audio is chunked.

## Semantic VAD

Semantic VAD is a new mode that uses a semantic classifier to detect when the user has finished speaking, based on the words they have uttered.
This classifier scores the input audio based on the probability that the user is done speaking. When the probability is low, the model will wait for a timeout, whereas when it is high, there is no need to wait.
For example, user audio that trails off with an "ummm..." would result in a longer timeout than a definitive statement.

With this mode, the model is less likely to interrupt the user during a speech-to-speech conversation, or chunk a transcript before the user is done speaking.

Semantic VAD can be activated by setting `session.audio.input.turn_detection.type` to `semantic_vad`.

It can be configured like this:

```json
{
  "type": "session.update",
  "session": {
    "type": "realtime",
    "audio": {
      "input": {
        "turn_detection": {
          "type": "semantic_vad",
          "eagerness": "low" | "medium" | "high" | "auto", // optional
          "create_response": true, // only in conversation mode
          "interrupt_response": true, // only in conversation mode
        }
      }
    }
  }
}
```

The same `session.audio.input.turn_detection` field applies in transcription sessions. The `create_response` and `interrupt_response` fields are conversation-only.

The optional `eagerness` property is a way to control how eager the model is to interrupt the user, tuning the maximum wait timeout. In transcription mode, even if the model doesn't reply, it affects how the audio is chunked.

- `auto` is the default value, and is equivalent to `medium`.
- `low` will let the user take their time to speak.
- `high` will chunk the audio as soon as possible.

If you want the model to respond more often in conversation mode, or to return transcription events faster in transcription mode, you can set `eagerness` to `high`.

On the other hand, if you want to let the user speak uninterrupted in conversation mode, or if you would like larger transcript chunks in transcription mode, you can set `eagerness` to `low`.