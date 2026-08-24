# Orchestration and handoffs

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Multi-agent workflows are useful when specialists should own different parts of the job. The first design choice is deciding who owns the final user-facing answer at each branch of the workflow.

## Choose the orchestration pattern

| Pattern         | Use it when                                                                   | What happens                             |
| --------------- | ----------------------------------------------------------------------------- | ---------------------------------------- |
| Handoffs        | A specialist should take over the conversation for that branch of the work    | Control moves to the specialist agent    |
| Agents as tools | A manager should stay in control and call specialists as bounded capabilities | The manager keeps ownership of the reply |

## Use handoffs for delegated ownership

Handoffs are the clearest fit when a specialist should own the next response rather than merely helping behind the scenes.

Delegate with handoffs

```javascript
import { Agent, handoff } from "@openai/agents";

const billingAgent = new Agent({ name: "Billing agent" });
const refundAgent = new Agent({ name: "Refund agent" });

const triageAgent = Agent.create({
  name: "Triage agent",
  handoffs: [billingAgent, handoff(refundAgent)],
});
```

```python
from agents import Agent, handoff

billing_agent = Agent(name="Billing agent")
refund_agent = Agent(name="Refund agent")

triage_agent = Agent(
    name="Triage agent",
    handoffs=[billing_agent, handoff(refund_agent)],
)
```


Keep the routing surface legible:

- Give each specialist a narrow job.
- Keep `handoffDescription` in TypeScript or `handoff_description` in Python short and concrete.
- Split only when the next branch truly needs different instructions, tools, or policy.

At the advanced end, handoffs can also carry structured metadata or filtered history. Those exact APIs stay in the SDK docs because the wiring differs by language.

## Use agents as tools for manager-style workflows

Use `agent.asTool()` in TypeScript or `agent.as_tool()` in Python when the main agent should stay responsible for the final answer and call specialists as helpers.

Call a specialist as a tool

```javascript
import { Agent } from "@openai/agents";

const summarizer = new Agent({
  name: "Summarizer",
  instructions: "Generate a concise summary of the supplied text.",
});

const mainAgent = new Agent({
  name: "Research assistant",
  tools: [
    summarizer.asTool({
      toolName: "summarize_text",
      toolDescription: "Generate a concise summary of the supplied text.",
    }),
  ],
});
```

```python
from agents import Agent

summarizer = Agent(
    name="Summarizer",
    instructions="Generate a concise summary of the supplied text.",
)

main_agent = Agent(
    name="Research assistant",
    tools=[
        summarizer.as_tool(
            tool_name="summarize_text",
            tool_description="Generate a concise summary of the supplied text.",
        )
    ],
)
```


This is usually the better fit when:

- the manager should synthesize the final answer
- the specialist is doing a bounded task like summarization or classification
- you want one stable outer workflow with nested specialist calls instead of ownership transfer

## Add specialists only when the contract changes

Start with one agent whenever you can. Add specialists only when they materially improve capability isolation, policy isolation, prompt clarity, or trace legibility.

Splitting too early creates more prompts, more traces, and more approval surfaces without necessarily making the workflow better.

## Next steps

Once the ownership pattern is clear, continue with the guide that covers the adjacent runtime or state question.



  [Agent definitions



        Refine each specialist's instructions, tools, and output contract.](https://developers.openai.com/api/docs/guides/agents/define-agents)
  [Running agents



        Understand how handoffs and tools behave inside a run.](https://developers.openai.com/api/docs/guides/agents/running-agents)
  [Results and state



        See how 
      `lastAgent` in TypeScript or `last_agent` in Python 
      and resumable state affect the next turn.](https://developers.openai.com/api/docs/guides/agents/results)