# Realtime transcription

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use realtime transcription when your application needs text from a microphone, call, or other live audio stream without a spoken assistant response. The recommended model returns transcript deltas as speech arrives and a final transcript when your application commits each audio turn.

Start with [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe). Use [file transcription](https://developers.openai.com/api/docs/guides/speech-to-text) if your audio is already recorded, or see the [Transcription overview](https://developers.openai.com/api/docs/guides/transcription) to compare the workflows.

## Create a transcription session

Create a session with `type: "transcription"` and select `gpt-live-transcribe`. Connect with [WebSocket](https://developers.openai.com/api/docs/guides/realtime-websocket) for server-side audio pipelines or [WebRTC](https://developers.openai.com/api/docs/guides/realtime-webrtc) for browser audio.

```json
{
  "type": "session.update",
  "session": {
    "type": "transcription",
    "audio": {
      "input": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "transcription": {
          "model": "gpt-live-transcribe"
        },
        "turn_detection": null
      }
    }
  }
}
```


This example uses 24 kHz PCM audio and disables automatic turn detection so that you can explicitly commit each turn. For the full session configuration, see the [Realtime sessions reference](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets).

## Stream audio

Send audio chunks with `input_audio_buffer.append`:

```javascript
ws.send(
  JSON.stringify({
    type: "input_audio_buffer.append",
    audio: base64Pcm16,
  })
);
```


With automatic turn detection turned off, commit the buffer when you want to finish an audio turn:

```javascript
ws.send(
  JSON.stringify({
    type: "input_audio_buffer.commit",
  })
);
```


To let the server detect and commit turn boundaries, configure [voice activity detection](https://developers.openai.com/api/docs/guides/realtime-vad) instead.

## Handle transcript events

Listen for incremental transcript deltas and completion events:

```javascript
ws.on("message", (data) => {
  const event = JSON.parse(data);

  if (event.type === "conversation.item.input_audio_transcription.delta") {
    process.stdout.write(event.delta);
  }

  if (event.type === "conversation.item.input_audio_transcription.completed") {
    console.log("\nFinal transcript:", event.transcript);
  }
});
```


A delta event contains newly available transcript text:

```json
{
  "type": "conversation.item.input_audio_transcription.delta",
  "item_id": "item_003",
  "content_index": 0,
  "delta": "Hello,"
}
```

A completion event contains the final transcript for the committed item:

```json
{
  "type": "conversation.item.input_audio_transcription.completed",
  "item_id": "item_003",
  "content_index": 0,
  "transcript": "Hello, how are you?"
}
```

Ordering between completion events from different speech turns isn't guaranteed. Use `item_id` to match transcription events to committed input items.

## Add transcription context

Add context when the audio contains specialized vocabulary or more than one expected language. Send another `session.update` event to change the transcription configuration during an existing session.

```json
{
  "type": "session.update",
  "session": {
    "type": "transcription",
    "audio": {
      "input": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "transcription": {
          "model": "gpt-live-transcribe",
          "prompt": "A customer support call about a premium plan and account AC-42.",
          "keywords": ["premium plan", "AC-42", "billing"],
          "languages": ["en", "fr"],
          "delay": "low"
        },
        "turn_detection": null
      }
    }
  }
}
```


- Use `prompt` to describe the recording or its setting.
- Use `keywords` for product names, acronyms, and other literal terms that may appear in the audio.
- Use `languages` for expected input languages.

Supported language-code formats include:

- ISO 639-1 codes, such as `en`, `es`, and `fr`.
- Selected ISO 639-3 codes, such as `eng`, `spa`, `yue`, and `cmn`.
- Regional `zh` locale codes, such as `zh-cn`, `zh-tw`, and `zh-hk`.

The Realtime API rejects unsupported or incorrectly formatted language codes.

Keywords are hints, not required output. Keep each keyword on one line and don't include `<`, `>`, a carriage return, or a line feed. The Realtime API rejects the session update if a keyword contains one of these characters or `prompt` exceeds the model's length limit.

`gpt-live-transcribe` uses `languages` instead of the singular `language` field. Don't send both.

## Transcribe a committed turn

Use `gpt-transcribe` in a Realtime session only when you specifically need transcription to begin after a committed audio turn or need detected-language output. This specialized workflow requires a WebSocket connection.

When `gpt-transcribe` performs input transcription in a Realtime API session or runs in a dedicated transcription session, it automatically uses earlier transcribed turns as context.

```json
{
  "type": "session.update",
  "session": {
    "type": "transcription",
    "audio": {
      "input": {
        "format": {
          "type": "audio/pcm",
          "rate": 24000
        },
        "transcription": {
          "model": "gpt-transcribe"
        },
        "turn_detection": null
      }
    }
  }
}
```


Append audio and send `input_audio_buffer.commit`. The model can then emit transcript deltas before the final completion event. Its completion event also includes detected languages:

```json
{
  "type": "conversation.item.input_audio_transcription.completed",
  "item_id": "item_003",
  "content_index": 0,
  "transcript": "Bonjour, pouvez-vous m'entendre ?",
  "languages": [{ "code": "fr" }]
}
```

When `gpt-transcribe` can't make a reliable language prediction, `languages` is an empty array. `gpt-live-transcribe` doesn't return detected-language predictions.

## Tune latency and accuracy

Streaming transcription trades latency for transcript quality. Lower delay settings can produce earlier partial text. Higher delay settings give the model more audio context before emitting text and can improve word error rate.

Start by setting `audio.input.transcription.delay` and testing against your real audio. Useful starting points are:

- `minimal` for the most latency-sensitive interactions;
- `low` for low-latency live captions;
- `medium` for a balanced latency/accuracy tradeoff;
- `high` when accuracy matters more than immediate display;
- `xhigh` when your workflow can tolerate the most delay for more context.

The exact delay in milliseconds can vary by model configuration, so benchmark with representative audio instead of assuming a fixed timing per level.

Don't choose a setting from synthetic audio alone. Test with representative microphones, telephony audio, accents, background noise, code-switching, domain vocabulary, and long sessions.

## Handle confidence, timestamps, and speaker labels

`gpt-live-transcribe` doesn't return word-level timestamps, speaker labels, or transcription confidence scores. If your application requires timestamps or speaker labels, use a compatible [file transcription](https://developers.openai.com/api/docs/guides/speech-to-text) model or add an application-level fallback.

## Production checklist

- Pick a target latency and accuracy threshold before tuning.
- Test against real production audio, not only clean samples.
- Test each target language.
- Include numbers, dates, currency, email addresses, product names, and domain terms in your eval set.
- Track empty, truncated, and delayed transcripts apart from word error rate.
- Decide how your UI should revise partial text when later deltas correct earlier text.
- Use `item_id` to order and reconcile final transcripts.
- Keep a fallback path for unsupported timestamps, speaker labels, or confidence fields.

## Related guides

[Realtime and audio overview



      Compare voice-agent, translation, and transcription sessions.](https://developers.openai.com/api/docs/guides/realtime)

[Realtime translation



      Translate live speech with a dedicated translation session.](https://developers.openai.com/api/docs/guides/realtime-translation)

[WebSocket connection



      Stream raw audio through a server-side media pipeline.](https://developers.openai.com/api/docs/guides/realtime-websocket)

[Voice activity detection



      Configure turn detection for live audio streams.](https://developers.openai.com/api/docs/guides/realtime-vad)