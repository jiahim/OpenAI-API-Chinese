# Agents

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Agents can plan and complete tasks using tools, work with other agents, and maintain context across steps. Choose a runtime based on where you want orchestration to run and who should manage the state between tasks.

## Choose your starting point

| You want to                                                                          | Start here                                             |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| Run an agent with the Codex harness managed by OpenAI                                | [Agents API](https://developers.openai.com/api/docs/guides/agents-api/quickstart)   |
| Control the agent loop in your application with reusable agents, tools, and handoffs | [Agents SDK](https://developers.openai.com/api/docs/guides/agents/quickstart)       |
| Work directly with model responses and control your integration                      | [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) |
| Add an embedded chat experience                                                      | [ChatKit](https://developers.openai.com/api/docs/guides/chatkit)                    |

<a id="agents-sdk-vs-responses-api"></a>

<a id="compare-agent-runtimes"></a>

## Compare agent runtime options

|                          | Agents API                                                                      | Agents SDK                                                          | Responses API                                             |
| ------------------------ | ------------------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| **Use for**              | Long-running tasks where OpenAI manages the agent and saves its progress        | Building agents with custom tools and workflows in your application | Calling models directly or building an agent from scratch |
| Where the agent runs     | OpenAI runs a managed Codex harness                                             | The SDK runs inside your application                                | Your application, with optional hosted orchestration      |
| Agent integration effort | Low                                                                             | Medium                                                              | High                                                      |
| State between tasks      | Saved session configuration, turns, and items                                   | Your storage and SDK sessions, or Responses conversation state      | Manual history, response chaining, or Conversations       |
| Tool execution           | Service-connected tools, application function handlers, and an optional sandbox | Tools and integrations configured in your application               | Hosted tools and tools your application runs              |
| Execution environment    | OpenAI hosted sandbox, self-hosted sandbox, or no sandbox                       | Your runtime and sandbox provider integrations                      | Your own execution environment                            |
| Start here               | [Agents API overview](https://developers.openai.com/api/docs/guides/agents-api/overview)                     | [Agents SDK overview](https://developers.openai.com/api/docs/guides/agents/sdk)                  | [Responses guide](https://developers.openai.com/api/docs/guides/migrate-to-responses)  |

The Agents API runs the Codex harness and manages the underlying agent infrastructure so you can focus on what your agents do. It includes automatic context compaction, multi-agent orchestration, programmatic tool calling, and support for MCP servers. See [Architecture](https://developers.openai.com/api/docs/guides/agents-api/architecture).

The Agents SDK gives your application control over deployment, storage, approvals, and runtime integration. Its runner handles the agent loop and handoffs. See [Running agents](https://developers.openai.com/api/docs/guides/agents/running-agents).




## Add tools, skills, and prompt caching

Tool design, reusable skills, and prompt caching apply across agent workflows. Their configuration and lifecycle can differ by API.

- Start with [Using tools](https://developers.openai.com/api/docs/guides/tools) for function calling, MCP, and hosted capabilities.
- Read [Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) for orchestration with JavaScript and the configuration for each API.
- Use [Skills](https://developers.openai.com/api/docs/guides/tools-skills) for reusable instructions and the supported loading mechanisms.
- Read [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) for shared caching behavior, then [Agents API observability and usage](https://developers.openai.com/api/docs/guides/agents-api/observability) for session accounting.

An Agents API session, an SDK session, a Responses conversation, and a sandbox are different resources. Follow the state and cleanup instructions for the runtime you choose.