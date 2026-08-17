# Voice agents

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Voice agents turn the same agent concepts into spoken, low-latency interactions. The key design choice is deciding whether the model should work directly with live audio or whether your application should explicitly chain speech-to-text, text reasoning, and text-to-speech.

## Choose the right architecture

| Architecture                              | Best for                                                  | Why                                                                                   |
| ----------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Speech-to-speech with live audio sessions | Natural, low-latency conversations                        | The model handles live audio input and output directly                                |
| Chained voice pipeline                    | Predictable workflows or extending an existing text agent | Your app keeps explicit control over transcription, text reasoning, and speech output |

Voice workflows are an SDK-first surface. If you're migrating a related Agent Builder project, see [Migrate from Agent Builder](https://developers.openai.com/api/docs/guides/agent-builder/migrate-from-agent-builder) for the current transition path.

## Recommended starting points

The examples below are intentionally different architectures, not matching language tabs. The JavaScript and Python libraries expose different voice helpers today:

- In JavaScript, the fastest path to a browser-based voice assistant is a `RealtimeAgent` and `RealtimeSession`.
- In Python, the simplest path to extending an existing text agent into voice is a chained `VoicePipeline`.





## Build a speech-to-speech voice agent

Use the live audio API path when the interaction should feel conversational and immediate. This is the best starting point for voice agents that need barge-in, low first-audio latency, natural turn taking, and realtime tool use.

The usual browser flow is:

1. Your application server creates an ephemeral client secret for the live audio session.
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

- [Realtime and audio overview](https://developers.openai.com/api/docs/guides/realtime)
- [Live audio API with WebRTC](https://developers.openai.com/api/docs/guides/realtime-webrtc)
- [Live audio API with WebSocket](https://developers.openai.com/api/docs/guides/realtime-websocket)

## Build a chained voice workflow

Use the chained path when you want stronger control over intermediate text, existing text-agent reuse, or a simpler extension path from a non-voice workflow. In that design, your application explicitly manages:

1. speech-to-text
2. the agent workflow itself
3. text-to-speech

This is often the better fit for support flows, approval-heavy flows, or cases where you want durable transcripts and deterministic logic between each stage.

Run a chained voice pipeline

```python
import asyncio
import numpy as np

from agents import Agent, function_tool
from agents.voice import AudioInput, SingleAgentVoiceWorkflow, VoicePipeline


@function_tool
def get_weather(city: str) -> str:
    """Get the weather for a given city."""
    return f"The weather in {city} is sunny."


agent = Agent(
    name="Assistant",
    instructions="You are a helpful voice assistant.",
    model="gpt-5.6",
    tools=[get_weather],
)


async def main() -> None:
    pipeline = VoicePipeline(workflow=SingleAgentVoiceWorkflow(agent))
    audio_input = AudioInput(buffer=np.zeros(24000 * 3, dtype=np.int16))
    result = await pipeline.run(audio_input)
    async for event in result.stream():
        if event.type == "voice_stream_event_audio":
            print("Received audio bytes", len(event.data))


if __name__ == "__main__":
    asyncio.run(main())
```


Use this path when each stage needs to be visible or replaceable. For example, you might store the transcript, run policy checks before the text agent responds, call internal systems, then generate speech only after the workflow reaches an approved answer.

## Voice agents still use the same core agent building blocks

The voice surface changes the transport and audio loop, but the core workflow decisions are the same:

- Use [Using tools](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) when the voice agent needs external capabilities.
- Use [Running agents](https://developers.openai.com/api/docs/guides/agents/running-agents) when spoken workflows need streaming, continuation, or durable state.
- Use [Orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration) when spoken workflows branch across specialists.
- Use [Guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals) when spoken workflows need safety checks or approvals.
- Use [Integrations and observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability) when you need MCP-backed capabilities or want to inspect how the voice workflow behaved.

The practical rule is: choose the audio architecture first, then design the rest of the agent workflow the same way you would for text.

## Next steps

[Realtime and audio overview



      Choose the right realtime or audio guide for your use case.](https://developers.openai.com/api/docs/guides/realtime)

[Managing conversations



      Work with the Realtime session lifecycle and event model.](https://developers.openai.com/api/docs/guides/realtime-conversations)

[WebRTC connection



      Connect browser and mobile audio directly to a Realtime session.](https://developers.openai.com/api/docs/guides/realtime-webrtc)

[Realtime prompting guide



      Tune reasoning, preambles, tools, entity capture, and voice behavior.](https://developers.openai.com/api/docs/guides/realtime-models-prompting)