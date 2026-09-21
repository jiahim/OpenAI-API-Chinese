# Getting started with GPT-Live

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

GPT-Live handles a spoken conversation while a backend agent looks up information, uses tools, and completes tasks. It can listen while speaking (**full duplex**). Sending work to the backend is called **delegation**.

For example, a user can ask about an order and add a detail while the backend checks its status. GPT-Live can keep talking with the user and explain the result when it arrives. You choose the backend model or agent independently of the voice model.

## Understand the two parts

- **GPT-Live handles conversation.** It listens, speaks, and decides when to ask the backend for help. Give it a short prompt for conversation style and when to delegate.
- **The backend handles delegated tasks.** With Responses delegation, use a supported Responses model. With client delegation, connect any model, agent harness, or service your application runs. The backend reasons, uses tools, and returns results for GPT-Live to communicate. Keep detailed instructions, business rules, and tool workflows here.

Your application checks permissions, obtains required confirmations, runs functions that access your systems, and saves task progress. Backend work can continue when the caller interrupts the assistant; your application decides whether to finish or cancel it. See [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents) to compare GPT-Live with Realtime and chained voice applications.





## Choose how to run the backend

Start with **[Responses delegation](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=responses#configure-responses-delegation)** to have OpenAI run the backend model and pass conversation context and results between it and GPT-Live. Your application still runs your own function tools. Choose **[client delegation](https://developers.openai.com/api/docs/guides/live-delegation?delegation-mode=client#configure-client-delegation)** to connect an existing agent or control the backend’s context, execution, and returned results yourself.

See [Choose a delegation mode](https://developers.openai.com/api/docs/guides/live-delegation#choose-a-delegation-mode) for the comparison and configuration details. Choose the mode when you create the session; to change modes, start a new session.

## Connect your first session

Start with the [GPT-Live WebRTC quickstart](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live). Its browser and server example connects microphone input and speaker output, with a Responses backend that can search the web.

You need a microphone, a browser page served over HTTPS or localhost, and a trusted server with an OpenAI project API key. Keep the key on the server.

1. Write a short [conversation prompt](https://developers.openai.com/api/docs/guides/live-prompting) that tells GPT-Live when to ask the backend for help.
2. Follow the quickstart to connect the browser's microphone, audio playback, and event channel. Your server creates the session and exchanges the browser's connection offer for an answer.
3. Wait for `session.started`, then speak and listen to a reply. Ask a question that needs current information to try the web search backend.
4. End the conversation and [close the session](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close) to collect final usage and release the connection.

For your first test, listen to the assistant and check that its answer reflects the backend’s search result.

GPT-Live voice sessions are billed by duration, per second. See the [model pricing](https://developers.openai.com/api/docs/models/gpt-live-1) for the current rate. Backend model and tool usage is billed separately. See [Cost optimization](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live) for usage accounting and ways to reduce costs.

## Choose a connection

- **[WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live)** for browser voice applications. It carries microphone and speaker audio on media tracks and JSON events on a data channel.
- **[WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)** for server-side audio integrations. One connection carries audio and control events.
- **[Telephony and SIP](https://developers.openai.com/api/docs/guides/voice-sip?api=live)** for connecting phone calls.

To monitor or control an existing session from your backend, add a [server-side connection](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live). This additional WebSocket is called a **sideband**; audio continues through the session’s primary connection.

## Partner integrations

If your application already uses **LiveKit**, **Twilio**, **Telnyx**, or **Daily/Pipecat**, follow the [partner integration overview](https://developers.openai.com/api/docs/guides/live-partner-integrations) to connect its existing calls or audio streams to GPT-Live.

## Continue building

- Shape conversation style and delegation behavior in [Prompting GPT-Live](https://developers.openai.com/api/docs/guides/live-prompting).
- Connect tools and reduce backend latency in [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation).
- Manage context, transcripts, and session lifecycle in [Managing sessions](https://developers.openai.com/api/docs/guides/live-conversations).
- Choose a migration path for your Realtime or text-based agent in [Migrate to GPT-Live](https://developers.openai.com/api/docs/guides/live-migration).
- Test conversation and task outcomes in [Evaluating voice agents](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation).