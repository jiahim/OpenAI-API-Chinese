# Guardrails and human review

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use guardrails for automatic checks and human review for approval decisions. Together, they define when a run should continue, pause, or stop.

- **Guardrails** validate input, output, or tool behavior automatically.
- **Human review** pauses the run so a person or policy can approve or reject a sensitive action.

## Choose the right control

| Use case                                                                                      | Start with                  |
| --------------------------------------------------------------------------------------------- | --------------------------- |
| Block disallowed user requests before the main model runs                                     | Input guardrails            |
| Validate or redact the final output before it leaves the system                               | Output guardrails           |
| Check arguments or results around a function tool call                                        | Tool guardrails             |
| Pause before side effects like cancellations, edits, shell commands, or sensitive MCP actions | Human-in-the-loop approvals |

## Add a blocking guardrail

Use input guardrails when you want a fast validation step to run before the expensive or side-effecting part of the workflow starts.

Block a request with an input guardrail

```javascript
import { Agent, InputGuardrailTripwireTriggered, run } from "@openai/agents";
import { z } from "zod";

const guardrailAgent = new Agent({
  name: "Homework check",
  instructions: "Detect whether the user is asking for math homework help.",
  outputType: z.object({
    isMathHomework: z.boolean(),
    reasoning: z.string(),
  }),
});

const agent = new Agent({
  name: "Customer support",
  instructions: "Help customers with support questions.",
  inputGuardrails: [
    {
      name: "Math homework guardrail",
      runInParallel: false,
      async execute({ input, context }) {
        const result = await run(guardrailAgent, input, { context });
        return {
          outputInfo: result.finalOutput,
          tripwireTriggered: result.finalOutput?.isMathHomework === true,
        };
      },
    },
  ],
});

try {
  await run(agent, "Can you solve 2x + 3 = 11 for me?");
} catch (error) {
  if (error instanceof InputGuardrailTripwireTriggered) {
    console.log("Guardrail blocked the request.");
  }
}
```

```python
import asyncio

from pydantic import BaseModel

from agents import (
    Agent,
    GuardrailFunctionOutput,
    InputGuardrailTripwireTriggered,
    RunContextWrapper,
    Runner,
    TResponseInputItem,
    input_guardrail,
)


class MathHomeworkOutput(BaseModel):
    is_math_homework: bool
    reasoning: str


guardrail_agent = Agent(
    name="Homework check",
    instructions="Detect whether the user is asking for math homework help.",
    output_type=MathHomeworkOutput,
)


@input_guardrail
async def math_guardrail(
    ctx: RunContextWrapper[None],
    agent: Agent,
    input: str | list[TResponseInputItem],
) -> GuardrailFunctionOutput:
    result = await Runner.run(guardrail_agent, input, context=ctx.context)
    return GuardrailFunctionOutput(
        output_info=result.final_output,
        tripwire_triggered=result.final_output.is_math_homework,
    )


agent = Agent(
    name="Customer support",
    instructions="Help customers with support questions.",
    input_guardrails=[math_guardrail],
)


async def main() -> None:
    try:
        await Runner.run(agent, "Can you solve 2x + 3 = 11 for me?")
    except InputGuardrailTripwireTriggered:
        print("Guardrail blocked the request.")


if __name__ == "__main__":
    asyncio.run(main())
```


Use blocking execution when the cost or risk of starting the main agent is too high. Use parallel guardrails when lower latency matters more than avoiding speculative work.

## Pause for human review

Approvals are the human-in-the-loop path for tool calls. The model can still decide that an action is needed, but the run pauses until you approve or reject it.

Pause for approval before a sensitive action

```javascript
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

const cancelOrder = tool({
  name: "cancel_order",
  description: "Cancel a customer order.",
  parameters: z.object({ orderId: z.number() }),
  needsApproval: true,
  async execute({ orderId }) {
    return `Cancelled order ${orderId}`;
  },
});

const agent = new Agent({
  name: "Support agent",
  instructions: "Handle support requests and ask for approval when needed.",
  tools: [cancelOrder],
});

let result = await run(agent, "Cancel order 123.");

if (result.interruptions?.length) {
  const state = result.state;
  for (const interruption of result.interruptions) {
    state.approve(interruption);
  }
  result = await run(agent, state);
}

console.log(result.finalOutput);
```

```python
import asyncio

from agents import Agent, Runner, function_tool


@function_tool(needs_approval=True)
async def cancel_order(order_id: int) -> str:
    return f"Cancelled order {order_id}"


agent = Agent(
    name="Support agent",
    instructions="Handle support requests and ask for approval when needed.",
    tools=[cancel_order],
)


async def main() -> None:
    result = await Runner.run(agent, "Cancel order 123.")

    if result.interruptions:
        state = result.to_state()
        for interruption in result.interruptions:
            state.approve(interruption)
        result = await Runner.run(agent, state)

    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```


This same interruption pattern applies even when the approving tool lives deeper in the workflow, such as after a handoff or inside a nested `agent.asTool()` in TypeScript or `agent.as_tool()` in Python call.

## Approval lifecycle

When a tool call needs review, the SDK follows the same pattern every time:

1. The run records an approval interruption instead of executing the tool.
2. The result returns `interruptions` plus a resumable `state`.
3. Your application approves or rejects the pending items.
4. You resume the same run from `state` instead of starting a new user turn.

If the review might take time, serialize `state`, store it, and resume later. That's still the same run.

## Workflow boundaries matter

Agent-level guardrails don't run everywhere:

- Input guardrails run only for the first agent in the chain.
- Output guardrails run only for the agent that produces the final output.
- Tool guardrails run on the function tools they're attached to.

If you need checks around every custom tool call in a manager-style workflow, don't rely only on agent-level input or output guardrails. Put validation next to the tool that creates the side effect.

## Review cybersecurity actions before execution

For authorized cybersecurity workflows, evaluate each sensitive tool call
before it executes. Use tool guardrails and approval interruptions to enforce
the written engagement scope at the boundary where side effects occur:

1. Check the proposed target, action, tool arguments, calling identity, and
   engagement window against the approved scope.
2. Give a separate policy component or reviewer the exact proposed action and
   only the context needed to evaluate it.
3. Deny out-of-scope hosts, credential theft, persistence, data exfiltration,
   destructive changes, production access, and attempts to bypass policy.
4. Pause ambiguous or high-risk actions for explicit human approval before the
   tool runs.
5. Enforce independent filesystem, network, identity, and project boundaries,
   record decisions and execution outcomes, and fail closed if review times out
   or becomes unavailable.

Responses API and Agents SDK applications don't automatically inherit
[Codex Auto-review](https://developers.openai.com/codex/sandboxing/auto-review). Add review and enforcement
to your own harness. The
[open-source Codex reviewer policy](https://github.com/openai/codex/blob/main/codex-rs/core/src/guardian/policy.md)
illustrates one approach. Review [Models and Trusted Access](https://developers.openai.com/codex/cyber-safety)
for approved model access and [Recommended configuration](https://developers.openai.com/codex/cyber-safety/recommended-configuration)
for safe engagement setup.

## Streaming and delayed review use the same state model

Streaming doesn't create a separate approval system. If a streamed run pauses, wait for it to settle, inspect `interruptions`, resolve the approvals, and resume from the same `state`. If the review happens later, store the serialized state and continue the same run when the decision arrives.

## Next steps

Once the control boundaries are clear, continue with the guide that covers the runtime or tool surface around them.



  [Running agents



        See how interruptions and resumptions fit into the runtime loop.](https://developers.openai.com/api/docs/guides/agents/running-agents)
  [Results and state



        Learn which result surfaces paused runs return to your application.](https://developers.openai.com/api/docs/guides/agents/results)
  [Using tools



        Decide which tool surfaces need validation or approval before side effects
      happen.](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)