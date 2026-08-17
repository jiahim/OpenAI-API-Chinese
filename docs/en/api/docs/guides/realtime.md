# Realtime and audio

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Start with the outcome you want to build. Realtime sessions are best for live audio that needs low latency. Request-based audio APIs are best for files, bounded requests, or generated speech that doesn't need a live session.

## Common use cases



  - **[Voice agents](https://developers.openai.com/api/docs/guides/voice-agents)**: Build speech-to-speech agents that listen, reason, speak, and call tools.
- **[Live translation](https://developers.openai.com/api/docs/guides/realtime-translation)**: Translate live speech with a dedicated realtime translation session.
- **[Transcription](https://developers.openai.com/api/docs/guides/transcription)**: Stream live transcript deltas or process audio files into text.
- **[Speech generation](https://developers.openai.com/api/docs/guides/text-to-speech)**: Turn text into natural-sounding spoken audio.



## Understand different architectures

<table>
  <thead>
    <tr>
      <th>Goal</th>
      <th>Model or API</th>
      <th>Start here</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Build a low-latency voice agent</td>
      <td className="whitespace-nowrap">
        [`gpt-realtime-2.1`](https://developers.openai.com/api/docs/models/gpt-realtime-2.1)
      </td>
      <td>
        [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents)
      </td>
    </tr>
    <tr>
      <td>Translate live speech into another language</td>
      <td className="whitespace-nowrap">
        [`gpt-realtime-translate`](https://developers.openai.com/api/docs/models/gpt-realtime-translate)
      </td>
      <td>
        [Realtime translation](https://developers.openai.com/api/docs/guides/realtime-translation)
      </td>
    </tr>
    <tr>
      <td>Transcribe live audio into streaming text</td>
      <td className="whitespace-nowrap">
        [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe)
      </td>
      <td>
        [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription)
      </td>
    </tr>
    <tr>
      <td>Transcribe files or bounded audio requests</td>
      <td>Audio transcription models</td>
      <td>
        [File transcription](https://developers.openai.com/api/docs/guides/speech-to-text)
      </td>
    </tr>
    <tr>
      <td>Generate speech from text</td>
      <td>Speech generation models</td>
      <td>
        [Text to speech](https://developers.openai.com/api/docs/guides/text-to-speech)
      </td>
    </tr>
    <tr>
      <td>Add audio to an existing Chat Completions app</td>
      <td>Audio-capable chat models</td>
      <td>
        [Audio and speech](https://developers.openai.com/api/docs/guides/audio#add-audio-to-your-existing-application)
      </td>
    </tr>
  </tbody>
</table>

## Choose a realtime session

Realtime sessions keep a connection open while your application sends audio, receives events, and updates session state.

<table>
  <thead>
    <tr>
      <th>Session type</th>
      <th>Use when</th>
      <th>Endpoint or pattern</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Voice-agent session</td>
      <td>
        The model should respond to the user, call tools, and manage
        conversation state.
      </td>
      <td>
        Conversation session on `/v1/realtime`
      </td>
    </tr>
    <tr>
      <td>Translation session</td>
      <td>The app should continuously translate speech as it arrives.</td>
      <td>
        Continuous translation session on `/v1/realtime/translations`
      </td>
    </tr>
    <tr>
      <td>Transcription session</td>
      <td>
        The app needs streaming transcript deltas without model-generated spoken
        responses.
      </td>
      <td>Transcription session that emits transcript deltas</td>
    </tr>
  </tbody>
</table>

Use a voice-agent session when your application needs an assistant that responds to the user. Use a translation session when your application needs an interpreter that translates the speaker. Use a transcription session when your application needs text from audio without model-generated responses.

### Voice-agent sessions

Voice-agent sessions use the standard Realtime API conversation lifecycle. The client connects to `/v1/realtime`, sends audio or text, and listens for model responses, tool calls, and session events.

For most browser voice agents, start with the [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents) guide. It uses the Agents SDK with WebRTC for browser audio and can connect to server-side tools.

Realtime 2 adds reasoning to speech-to-speech workflows. Start with
  `reasoning.effort` set to `low` for most production voice agents, then adjust
  based on latency tolerance and task complexity. Use the [Realtime prompting
  guide](https://developers.openai.com/api/docs/guides/realtime-models-prompting) to tune reasoning,
  preambles, tool use, unclear audio, and exact entity capture.

### Translation sessions

Realtime translation uses a dedicated translation endpoint instead of the standard voice-agent endpoint. Translation sessions are continuous: the client streams audio into the session, and the service streams translated audio and transcript deltas out.

Translation sessions don't use the normal assistant turn lifecycle. Don't call `response.create`, and don't wait for the client to commit a user turn before translation begins. For browser media, use WebRTC. For server media pipelines such as phone calls or broadcast ingest, use WebSockets.

See [Realtime translation](https://developers.openai.com/api/docs/guides/realtime-translation) for the dedicated endpoint, session configuration, and architecture patterns.

### Transcription sessions

You can transcribe audio in more than one way. Use a realtime transcription session when your application needs live transcript deltas from streaming audio. Use the [File transcription](https://developers.openai.com/api/docs/guides/speech-to-text) guide for file uploads, request-based transcription, translation, or speaker-labeling workflows.

For realtime transcription, [`gpt-live-transcribe`](https://developers.openai.com/api/docs/models/gpt-live-transcribe) gives you controllable latency. Lower delay settings produce earlier partial text, while higher delay settings can improve transcript quality. Test with your real audio conditions, target languages, accents, and domain vocabulary before choosing a production default.

See [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription) for session configuration and event handling.

## Choose a connection method

Choose the transport based on where your application captures and plays audio:

[WebRTC



      Use for browser and mobile clients that capture or play audio directly.](https://developers.openai.com/api/docs/guides/realtime-webrtc)

[WebSocket



      Use when your server already receives raw audio from a media pipeline, call
    system, or worker.](https://developers.openai.com/api/docs/guides/realtime-websocket)

[SIP



      Use for telephony voice agents. Confirm model support before using SIP for
    translation or transcription.](https://developers.openai.com/api/docs/guides/realtime-sip)

## Safety identifiers

If your application identifies individual end users, include a [safety identifier](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) with Realtime API requests. OpenAI recommends safety identifiers but doesn't require them. They help OpenAI detect harmful behavior and target enforcement to an individual user rather than your entire organization. Use a stable, privacy-preserving value, such as a hashed internal user ID.

For Realtime API requests, send the identifier in the `OpenAI-Safety-Identifier` header. When using ephemeral tokens, set the header on the server-side request that creates the client secret to associate the identifier with the session. When connecting from a trusted server with WebSocket or the unified WebRTC interface, set the header on the connection request.

Safety identifiers don't carry over from Responses API requests or other sessions. If you use the Responses API `safety_identifier` parameter elsewhere in your application, pass the same stable value when you create or connect each Realtime session.

## Beta to GA migration

If you still have a beta Realtime integration, migrate it to the GA interface before moving forward with new work. The most important changes are:

- Remove the `OpenAI-Beta: realtime=v1` header when calling the GA interface.
- Use [`POST /v1/realtime/client_secrets`](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create) to create ephemeral credentials for browser or mobile clients.
- Use `/v1/realtime/calls` when establishing WebRTC sessions.
- Update session and event shapes for the GA interface. In particular, set `session.type`, move output audio configuration under `session.audio.output`, and use the newer response event names like `response.output_text.delta`, `response.output_audio.delta`, and `response.output_audio_transcript.delta`.
- If you are moving a speech-to-speech app forward, start from the [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents) guide. If you are moving a transcription workflow forward, use [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription).

See the [Realtime client events reference](https://developers.openai.com/api/reference/resources/realtime/client-events), [Realtime sessions reference](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets), and [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents) guide for the current GA flow.

## Related guides

- [Realtime prompting guide](https://developers.openai.com/api/docs/guides/realtime-models-prompting): Prompt and tune Realtime voice models.
- [Managing conversations](https://developers.openai.com/api/docs/guides/realtime-conversations): Work with the Realtime session lifecycle.
- [Realtime translation](https://developers.openai.com/api/docs/guides/realtime-translation): Translate live speech with a dedicated translation session.
- [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription): Stream live transcript deltas from audio.
- [Realtime with tools](https://developers.openai.com/api/docs/guides/realtime-mcp): Connect function tools, MCP servers, and connectors to a Realtime session.
- [Webhooks and server-side controls](https://developers.openai.com/api/docs/guides/realtime-server-controls): Control Realtime sessions from your server.
- [Managing costs](https://developers.openai.com/api/docs/guides/realtime-costs): Track and optimize Realtime API usage.

Use [Audio and speech](https://developers.openai.com/api/docs/guides/audio) for the core concepts behind
  audio input, audio output, streaming, latency, transcripts, and speech
  generation. Use this overview when you are ready to choose an implementation
  path.