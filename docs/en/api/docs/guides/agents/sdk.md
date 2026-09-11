# Agents SDK

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Agents can plan and complete tasks using tools, work with other agents, and maintain context across steps.

## Get your first agent running

Start with the [Agents SDK quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart) to install the SDK, define one agent, and run it. Once that works, return here to choose the next capability your application needs.

## Get the Agents SDK

Use the GitHub repositories for more examples, issues, and language-specific reference details.



  [TypeScript SDK



        Open the TypeScript SDK repository on GitHub.](https://github.com/openai/openai-agents-js)
  [Python SDK



        Open the Python SDK repository on GitHub.](https://github.com/openai/openai-agents-python)



## Choose your starting point

| If you want to                            | Start here                                                                                                                                             | Why                                                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Build a code-first agent app              | [Quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart)                                                                                                       | This is the shortest path to a working SDK integration.                                        |
| Define one specialist cleanly             | [Agent definitions](https://developers.openai.com/api/docs/guides/agents/define-agents)                                                                                             | Start here when you are still shaping the contract for a single agent.                         |
| Choose models, defaults, and transport    | [Models and providers](https://developers.openai.com/api/docs/guides/agents/models)                                                                                                 | Use this when model choice, provider setup, or transport strategy affects the workflow.        |
| Understand the runtime loop and state     | [Running agents](https://developers.openai.com/api/docs/guides/agents/running-agents)                                                                                               | This is where the agent loop, streaming, and continuation strategies live.                     |
| Run work in a container-based environment | [Sandbox agents](https://developers.openai.com/api/docs/guides/agents/sandboxes)                                                                                                    | Use this when the agent needs files, commands, packages, snapshots, mounts, or provider links. |
| Design specialist ownership               | [Orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration)                                                                                    | Use this when you need more than one agent and must decide who owns the reply.                 |
| Add validation or human review            | [Guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)                                                                            | Use this when the workflow should block or pause before risky work continues.                  |
| Understand what a run returns             | [Results and state](https://developers.openai.com/api/docs/guides/agents/results)                                                                                                   | This page explains final output, resumable state, and next-turn surfaces.                      |
| Add hosted tools, function tools, or MCP  | [Using tools](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk) and [Integrations and observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability) | Tool semantics live in the platform tools docs; SDK-specific MCP and tracing live here.        |
| Inspect and improve runs                  | [Integrations and observability](https://developers.openai.com/api/docs/guides/agents/integrations-observability) and [evaluate agent workflows](https://developers.openai.com/api/docs/guides/agent-evals)      | Use traces for debugging first, then move into evaluation loops.                               |
| Build a voice-first workflow              | [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents)                                                                                                          | Use the SDK voice pipeline and realtime agent patterns.                                        |

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

<a id="compare-agent-runtimes"></a>

## Compare agent runtime options

Use the [Agents overview](https://developers.openai.com/api/docs/guides/agents#compare-agent-runtimes) to compare the Agents SDK, Agents API, and Responses API. The Agents SDK runs in your application; the Agents API runs a managed harness in OpenAI's service.