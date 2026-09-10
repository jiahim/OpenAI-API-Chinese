# Getting started with the Realtime API

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Build a speech-to-speech voice agent with the Realtime API. The model works directly with audio, maintains conversation state, and can call tools. This guide starts with the Agents SDK for a browser application; use the lower-level connection guides when you need direct control.

For full-duplex conversations with a separate delegated backend, see [GPT-Live](https://developers.openai.com/api/docs/guides/live). To compare voice architectures and chained pipelines, see [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents).

## Build a speech-to-speech voice agent

Use the Realtime API when the interaction should feel conversational and immediate. This is the best starting point for voice agents that need barge-in, low first-audio latency, natural turn taking, and realtime tool use.

The usual browser flow is:

1. Your application server creates an ephemeral client secret for the Realtime session.
2. Your frontend creates a `RealtimeSession`.
3. The session connects over WebRTC in the browser or WebSocket on the server.
4. The agent handles audio turns, tools, interruptions, and handoffs inside that session.

Start a realtime voice session

```javascript
import { RealtimeAgent, RealtimeSession } from "@openai/agents/realtime";

const agent = new RealtimeAgent({
  name: "Assistant",
  instructions: "You are a helpful voice assistant.",
});

const session = new RealtimeSession(agent, {
  model: "gpt-realtime-2.1",
});

await session.connect({
  apiKey: "ek_...(ephemeral key from your server)",
});
```


From there, attach tools, handoffs, and guardrails to the `RealtimeAgent` the same way you would attach them to a text agent. Keep audio transport concerns in the session layer, and keep business logic in the agent definition.

Start with the transport docs when you need lower-level control:

- [Audio and voice overview](https://developers.openai.com/api/docs/guides/audio)
- [Realtime API with WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime)
- [Realtime API with WebSocket](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime)

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
- If you are moving a speech-to-speech app forward, start from the [browser example](#build-a-speech-to-speech-voice-agent). If you are moving a transcription workflow forward, use [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription).

See the [Realtime client events reference](https://developers.openai.com/api/reference/resources/realtime/client-events), [Realtime sessions reference](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets), and [browser example](#build-a-speech-to-speech-voice-agent) for the current GA flow.





## Next steps

- [Managing conversations](https://developers.openai.com/api/docs/guides/realtime-conversations): Configure sessions and handle audio, text, and events.
- [Voice activity detection](https://developers.openai.com/api/docs/guides/realtime-vad): Configure automatic turn detection.
- [Tools and MCP](https://developers.openai.com/api/docs/guides/realtime-mcp): Add functions, MCP servers, and connectors.
- [Prompting voice models](https://developers.openai.com/api/docs/guides/voice-prompting): Use the guide for your Realtime model.
- [Cost optimization](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=realtime): Understand Realtime accounting and caching.
- [Server-side controls](https://developers.openai.com/api/docs/guides/voice-server-controls?api=realtime): Keep tool execution and session control on your server.























## Other audio workflows

The workflow chooser and shared audio vocabulary now live in [Audio and voice](https://developers.openai.com/api/docs/guides/audio). For continuous translation, use [Live translation](https://developers.openai.com/api/docs/guides/realtime-translation). For live captions, use [Live transcription](https://developers.openai.com/api/docs/guides/realtime-transcription); for recorded audio, use [File transcription](https://developers.openai.com/api/docs/guides/speech-to-text).