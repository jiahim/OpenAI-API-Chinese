# Agents SDK

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Agents are applications that plan, call tools, collaborate across specialists, and keep enough state to complete multi-step work.

## Get your first agent running

Start with the [Agents SDK quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart) to install the SDK, define one agent, and run it. Once that works, return here to choose the next capability your application needs.

## Get the Agents SDK

Use the GitHub repositories for more examples, issues, and language-specific reference details.



  [TypeScript SDK



        Open the TypeScript SDK repository on GitHub.](https://github.com/openai/openai-agents-js)
  [Python SDK



        Open the Python SDK repository on GitHub.](https://github.com/openai/openai-agents-python)



## Choose your starting point

| If you want to                           | Start here                                                                                                                                             | Why                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Build a code-first agent app             | [Quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart)                                                                                                       | This is the shortest path to a working SDK integration.                                        |
| Define one specialist cleanly            | [Agent definitions](https://developers.openai.com/api/docs/guides/agents/define-agents)                                                                                             | Start here when you are still shaping the contract for a single agent.                         |
| Choose models, defaults, and transport   | [Models and providers](https://developers.openai.com/api/docs/guides/agents/models)                                                                                                 | Use this when model choice, provider setup, or transport strategy affects the workflow.        |
| Understand the runtime loop and state    | [Running agents](https://developers.openai.com/api/docs/guides/agents/running-agents)                                                                                               | This is where the agent loop, streaming, and continuation strategies live.                     |
| Run work in a container-based environment | [Sandbox agents](https://developers.openai.com/api/docs/guides/agents/sandboxes)                                                                                                    | Use this when the agent needs files, commands, packages, snapshots, mounts, or provider links. |
| Design specialist ownership              | [Orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration)                                                                                    | Use this when you need more than one agent and must decide who owns the reply.                 |
| Add validation or human review           | [Guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)                                                                            | Use this when the workflow should block or pause before risky work continues.                  |
| Understand what a run returns            | [Results and state](https://developers.openai.com/api/docs/guides/agents/results)                                                                                                   | This page explains final output, resumable state, and next-turn surfaces.                      |
| Add hosted tools, function tools, or MCP | [Using tools](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) and [Integrations and observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability) | Tool semantics live in the platform tools docs; SDK-specific MCP and tracing live here.        |
| Inspect and improve runs                 | [Integrations and observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability) and [evaluate agent workflows](https://developers.openai.com/api/docs/guides/agent-evals)      | Use traces for debugging first, then move into evaluation loops.                               |
| Build a voice-first workflow             | [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents)                                                                                                          | Use the SDK's voice pipeline and realtime agent patterns.                                      |

## Build with the SDK

Use the SDK track when your server owns deployment, tool implementations, state storage, and approval decisions, while the SDK runs the agent loop and invokes those tools. That path is the best fit when you want:

- typed application code in TypeScript or Python
- direct control over tools, MCP servers, and runtime behavior
- custom storage or server-managed conversation strategies
- tight integration with existing product logic or infrastructure

A typical SDK reading order is:

- Start with [Quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart) to get one working run on screen.
- Use [Agent definitions](https://developers.openai.com/api/docs/guides/agents/define-agents) and [Models and providers](https://developers.openai.com/api/docs/guides/agents/models) to shape one specialist cleanly.
- Continue to [Running agents](https://developers.openai.com/api/docs/guides/agents/running-agents), [Orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration), and [Guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals) as the workflow grows more complex.
- Use [Results and state](https://developers.openai.com/api/docs/guides/agents/results) and [Integrations and observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability) when application logic depends on the run object or deeper visibility into behavior.

## Agents SDK vs. Responses API

Use the Responses API when you want to own the loop. Use the Agents SDK when you want the SDK to run it.

### Choose the Responses API when

- You want direct control over model interactions, output items, tools, state, and orchestration, whether the workflow takes one call or many.
- You want to implement custom tool routing, loops, or branching directly in your application.

In the [Responses function-calling flow](https://developers.openai.com/api/docs/guides/function-calling#the-tool-calling-flow), your application receives function calls, executes them, returns their output, and calls the model again.

For example, a Responses API workflow might search a knowledge base and generate a cited answer.

### Choose the Agents SDK when

- You want the SDK to manage the agent loop and recurring orchestration such as repeated tool calls or branching.
- Different specialists need different instructions, tools, or policies.
- You want built-in sessions, tracing, guardrails, or resumable approval flows.

The [Agents SDK runner](https://developers.openai.com/api/docs/guides/agents/running-agents#the-agent-loop) performs the tool loop, switches agents after handoffs, and stops when the run finishes or pauses for approval.

For example, an Agents SDK workflow might investigate a support request, hand it to the correct specialist, call internal systems, request approval for a refund, and record the result.

### Compare the Responses API and Agents SDK

|                            | Responses API                                                                                                          | Agents SDK                                                                                                                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Best for**               | Custom model-powered features and workflows                                                                            | Bounded conversational or transactional workflows with defined tools and recurring orchestration patterns                                                                                             |
| **Core abstraction**       | A model response                                                                                                       | An agent run                                                                                                                                                                                        |
| **Tools**                  | Platform tools, function calling, and remote [Model Context Protocol (MCP)](https://developers.openai.com/api/docs/guides/tools-connectors-mcp)     | Platform tools attached to reusable agents, plus tool wrappers, local MCP connections, and [agents as tools](https://developers.openai.com/api/docs/guides/agents/orchestration#use-agents-as-tools-for-manager-style-workflows) |
| **Workflow orchestration** | You manage custom loops and branching                                                                                  | The SDK provides the agent loop and lifecycle                                                                                                                                                       |
| **Multi-agent workflows**  | Build routing and delegation yourself                                                                                  | Built-in agents-as-tools and [handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration#use-handoffs-for-delegated-ownership)                                                                                 |
| **State**                  | Manual history, response chaining, or [Conversations](https://developers.openai.com/api/docs/guides/conversation-state#using-the-conversations-api) | The same options, plus [SDK sessions and resumable run state](https://developers.openai.com/api/docs/guides/agents/running-agents#choose-one-conversation-strategy)                                                              |
| **Safety and approvals**   | Tool-specific approvals; you build broader controls                                                                    | Input, output, and tool [guardrails plus resumable approval flows](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)                                                                                    |
| **Debugging and tracing**  | Response objects and API logs                                                                                          | [Built-in traces](https://developers.openai.com/api/docs/guides/agents/integrations-observability#tracing) across model calls, tools, agents, guardrails, and handoffs                                                           |