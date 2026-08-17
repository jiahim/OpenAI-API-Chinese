# Running agents

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Defining an agent is only the setup step. The runtime questions are what a single run does, how the next turn continues, and how the workflow behaves when it pauses for approvals or tool work.

## The agent loop

One SDK run is one application-level turn. The runner keeps looping until it reaches a real stopping point:

1. Call the current agent's model with the prepared input.
2. Inspect the model output.
3. If the model produced tool calls, execute them and continue.
4. If the model handed off to another specialist, switch agents and continue.
5. If the model produced a final answer with no more tool work, return a result.

That loop is the core concept behind the SDK. Tools, handoffs, approvals, and streaming all build on top of it rather than replacing it.

## Choose one conversation strategy

There are four common ways to carry state into the next turn:

| Strategy                                                                                                           | Where state lives         | Best for                                                               | What you pass on the next turn                 |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------- |
| `result.history` in TypeScript or `result.to_input_list()` in Python   | Your application          | Small chat loops and maximum control                                   | The replay-ready history                       |
| `session`                                                                                                          | Your storage plus the SDK | Persistent chat state, resumable runs, and storage you control         | The same session                               |
| `conversationId`                                                                                                   | OpenAI Conversations API  | Shared server-managed state across workers or services                 | The same conversation ID and only the new turn |
| `previousResponseId` in TypeScript or `previous_response_id` in Python | OpenAI Responses API      | The lightest server-managed continuation from one response to the next | The last response ID and only the new turn     |

In most applications, pick one strategy per conversation. Mixing local replay with server-managed state can duplicate context unless you are deliberately reconciling both layers.

Persist multi-turn state with sessions

```javascript
import { Agent, MemorySession, run } from "@openai/agents";

const agent = new Agent({
  name: "Tour guide",
  instructions: "Answer with compact travel facts.",
});

const session = new MemorySession();

const firstTurn = await run(agent, "What city is the Golden Gate Bridge in?", {
  session,
});
console.log(firstTurn.finalOutput);

const secondTurn = await run(agent, "What state is it in?", { session });
console.log(secondTurn.finalOutput);
```

```python
import asyncio

from agents import Agent, Runner, SQLiteSession

agent = Agent(
    name="Tour guide",
    instructions="Answer with compact travel facts.",
)

session = SQLiteSession("conversation_123")


async def main() -> None:
    first_turn = await Runner.run(
        agent,
        "What city is the Golden Gate Bridge in?",
        session=session,
    )
    print(first_turn.final_output)

    second_turn = await Runner.run(
        agent,
        "What state is it in?",
        session=session,
    )
    print(second_turn.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```


Sessions are the best default when you want durable memory, resumable approval flows, or storage that your application controls.

Continue with server-managed state

```javascript
import { Agent, run } from "@openai/agents";
import OpenAI from "openai";

const agent = new Agent({
  name: "Assistant",
  instructions: "Reply very concisely.",
});

const client = new OpenAI();
const { id: conversationId } = await client.conversations.create({});

const first = await run(agent, "What city is the Golden Gate Bridge in?", {
  conversationId,
});
console.log(first.finalOutput);

const second = await run(agent, "What state is it in?", {
  conversationId,
});
console.log(second.finalOutput);
```

```python
import asyncio

from agents import Agent, Runner

agent = Agent(
    name="Assistant",
    instructions="Reply very concisely.",
)


async def main() -> None:
    first = await Runner.run(
        agent,
        "What city is the Golden Gate Bridge in?",
    )
    print(first.final_output)

    second = await Runner.run(
        agent,
        "What state is it in?",
        previous_response_id=first.last_response_id,
    )
    print(second.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```


Use `conversationId` when multiple systems should share one named conversation. Use `previousResponseId` in TypeScript or `previous_response_id` in Python when you want the cheapest response-to-response continuation option.

## Stream runs incrementally

Streaming uses the same agent loop and the same state strategies. The only difference is that you consume events while the run is still happening.

Stream a run as text arrives

```javascript
import { Agent, run } from "@openai/agents";

const agent = new Agent({
  name: "Planet guide",
  instructions: "Answer with short facts.",
});

const stream = await run(agent, "Give me three short facts about Saturn.", {
  stream: true,
});

for await (const event of stream) {
  if (
    event.type === "raw_model_stream_event" &&
    event.data.type === "output_text_delta"
  ) {
    process.stdout.write(event.data.delta);
  }
}

await stream.completed;
console.log("\nFinal:", stream.finalOutput);
```

```python
import asyncio

from openai.types.responses import ResponseTextDeltaEvent

from agents import Agent, Runner

agent = Agent(
    name="Planet guide",
    instructions="Answer with short facts.",
)


async def main() -> None:
    stream = Runner.run_streamed(
        agent,
        "Give me three short facts about Saturn.",
    )

    async for event in stream.stream_events():
        if event.type == "raw_response_event" and isinstance(
            event.data, ResponseTextDeltaEvent
        ):
            print(event.data.delta, end="", flush=True)

    print(f"\nFinal: {stream.final_output}")


if __name__ == "__main__":
    asyncio.run(main())
```


Three practical rules matter:

- Wait for the stream to finish before treating the run as settled.
- If the run pauses for approval, resolve `interruptions` and resume from `state` rather than starting a fresh user turn.
- If you cancel a stream mid-turn, resume the unfinished turn from `state` if you want the same turn to continue later.

## Handle pauses and failures deliberately

Two broad classes of non-happy-path outcomes matter:

- **Runtime or validation failures** such as max-turn limits, guardrail exceptions, or tool errors.
- **Expected pauses** such as human approval requests, where the run is intentionally interrupted and should later resume from the same state.

Treat approvals as paused runs, not as new turns. That distinction keeps turn counts, history, and server-managed continuation IDs consistent.

## Next steps

Once the runtime loop is clear, move to the guide that matches the next workflow boundary you need to design.



  [Results and state



        Learn which result surfaces your application should carry into the next
      turn.](https://developers.openai.com/api/docs/guides/agents/results)
  [Orchestration and handoffs



        Decide how multiple specialists behave inside the same runtime loop.](https://developers.openai.com/api/docs/guides/agents/orchestration)
  [Guardrails and human review



        Add validation and approval pauses without breaking turn continuity.](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)