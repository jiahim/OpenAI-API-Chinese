# Voice agents

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Voice agents let users ask questions and complete tasks by speaking with your application. The key design choice is how speech connects to reasoning and tools: a continuous conversation with a separate backend, a single voice model, or a pipeline you control stage by stage.

## Choose the right architecture

| Architecture           | Best for                                          | Why choose it                                                                                           |
| ---------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| GPT-Live               | Full-duplex conversations with a separate backend | Keep your existing text workflow and choose its backend independently while the conversation continues. |
| Realtime API           | Speech, reasoning, and tool use in one session    | Use one model to interpret audio, decide what to do, and respond in speech.                             |
| Chained voice pipeline | Control over each speech and text stage           | Inspect or transform intermediate text and replace each component independently.                        |





## Build a full-duplex voice agent

GPT-Live can listen and speak at the same time, a capability called **full duplex**. The live model handles the spoken interaction and delegates reasoning and tool use to a separate backend. Users can keep talking while backend work runs.

You can keep your existing text workflow, including its business logic and tools, and add GPT-Live as the voice interface. Your **delegation mode** determines who runs the backend work and supplies its conversation context:

- **Client delegation:** Connect your own agent or workflow, using the backend model and provider you choose. Your application runs the work and returns results to GPT-Live.
- **Responses delegation:** Choose an OpenAI-hosted Responses model for backend reasoning and tool use. GPT-Live supplies conversation context and manages calls to that model; your application still runs custom functions.

In both modes, your application controls permissions and business records. Keep speaking behavior in the live model's prompt and business rules in the backend prompt.

Start with [Getting started with GPT-Live](https://developers.openai.com/api/docs/guides/live). See [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation) for backend setup and [Prompting voice models](https://developers.openai.com/api/docs/guides/live-prompting) for speaking behavior.





## Build a speech-to-speech voice agent

For the Realtime API, a `RealtimeAgent` and `RealtimeSession` provide a browser-first starting point. The session handles audio turns, tools, interruptions, and handoffs. The complete starter now lives in [Realtime API getting started](https://developers.openai.com/api/docs/guides/realtime#build-a-speech-to-speech-voice-agent).

## Build a chained voice workflow

Use the chained path when you want to inspect or transform text between speech recognition, your agent, and speech generation. Your application manages three stages:

1. Speech-to-text
2. The agent workflow itself
3. Text-to-speech

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
    model="gpt-6-astra",
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

## Evaluate your voice agent

Test conversation quality and task outcomes separately. A natural-sounding response does not prove that a tool ran or that application state changed.

1. Choose representative scenarios with expected outcomes, tool calls, and permissions.
2. Save the audio, events, tool results, and application state needed to verify each outcome. Distinguish a failed evaluation run from a valid run in which the agent fails the task.
3. Repeat scenarios and compare task completion, audible response latency, interruptions, and unwanted silence. Keep the caller, model configuration, tools, and transport consistent when comparing changes.

For GPT-Live, measure these dimensions independently:

- **Task and tool outcomes:** Check intent preservation, delegated work, tool arguments, permissions, and final application state. Verify that spoken confirmations match completed actions.
- **Conversational timing:** Measure [audible response timing](#measure-latency), unwanted silence, overlap, and yielding to interruptions, including corrections while backend work runs.
- **Speech and language:** Test input recognition across accents, background noise, language switches, names, and numbers. Assess output intelligibility and language choice separately from recognition.
- **Session reliability:** Track connection failures, dropped audio, timeouts, and incomplete sessions separately from task scores.

Use **Crawl, Walk, and Run** to add complexity in stages:

1. **Crawl:** Use synthetic speech for controlled, single-turn requests. Keep the generated audio, application context, and expected outcome fixed for repeatable comparisons.
2. **Walk:** Replay representative human recordings of single-turn requests to test how voices, microphones, pauses, and acoustic conditions affect behavior.
3. **Run:** Use an independent simulated caller for continuous, multi-turn conversations. Test clarification, changing requirements, interruptions, and recovery while conversation and backend work overlap.

Complement automated scores with human listening to assess pronunciation, naturalness, and whether the conversation feels appropriately paced.

For a GPT-Live evaluation harness, see the [voice agent evaluation Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation).

For a Realtime evaluation harness and worked examples, use the [Realtime evaluation guide in the OpenAI Cookbook](https://developers.openai.com/cookbook/examples/realtime_eval_guide). The Cookbook owns the runnable evaluation recipes; this page provides the shared testing checklist.

### Measure latency

Define an observed start and end event for every latency metric. Time to first
audible response, time to delegation, interruption yield, backend completion,
and verified task completion measure different boundaries. Use one monotonic
timeline and report the eligible population, median, and tail latency. Do not
substitute a backend-only timer for end-to-end response time.

Keep the caller, recording, backend model, prompt, transport, audio cadence, and
grader fixed when comparing frontend models.

For GPT-Live, record the stages your application can observe: delegation receipt,
backend request start, first useful result, tool start and end, result submission,
audio arrival, and client playback. Client delegation gives your application
direct visibility into its backend requests; Responses delegation exposes nested
response events and the custom tools your application runs.

Use the intervals to locate delays in connection setup, model work, tools,
application buffering, and playback. Measure the first useful spoken answer
separately from an acknowledgment such as “I'm checking.” An earlier
acknowledgment does not show that the requested result arrived sooner.

Change one factor at a time and repeat the same scenarios. Compare median and
tail time to useful spoken responses alongside task success, tool correctness,
and interruptions. See [Reduce backend latency](https://developers.openai.com/api/docs/guides/live-delegation#reduce-backend-latency)
for implementation guidance.

## Voice agents still use the same core agent building blocks

The voice surface changes the transport and audio loop, but the core workflow decisions are the same:

- Use [Using tools](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) when the voice agent needs external capabilities.
- Use [Running agents](https://developers.openai.com/api/docs/guides/agents/running-agents) when spoken workflows need streaming, continuation, or durable state.
- Use [Orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration) when spoken workflows branch across specialists.
- Use [Guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals) when spoken workflows need safety checks or approvals.
- Use [Integrations and observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability) when you need MCP-backed capabilities or want to inspect how the voice workflow behaved.

The practical rule is: choose the audio architecture first, then design the rest of the agent workflow the same way you would for text.

## Next steps

[Audio and voice overview



      Choose the right realtime or audio guide for your use case.](https://developers.openai.com/api/docs/guides/audio)

[Managing conversations



      Work with the Realtime session lifecycle and event model.](https://developers.openai.com/api/docs/guides/realtime-conversations)

[WebRTC connection



      Connect browser and mobile audio directly to a Realtime session.](https://developers.openai.com/api/docs/guides/voice-webrtc)

[Realtime prompting guide



      Tune reasoning, preambles, tools, entity capture, and voice behavior.](https://developers.openai.com/api/docs/guides/voice-prompting)