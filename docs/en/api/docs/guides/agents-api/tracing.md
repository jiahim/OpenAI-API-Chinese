# Tracing

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

A **session** keeps your agent's conversation and work together. A session can contain several **turns**, each a cycle of work. A **trace** shows the steps within one turn: model responses, tool calls, and work delegated to other agents.

The [tracing dashboard](https://platform.openai.com/logs?api=agents) shows what your agent did, including each step's recorded inputs, outputs, duration, and status.

For session status, live events, saved output, and usage through the API, start with [Observability](https://developers.openai.com/api/docs/guides/agents-api/observability).

Tracing is enabled by default for new sessions. The public beta API does not expose tracing configuration or external trace exporters.

## Open a trace

1. Open [Logs → Agents](https://platform.openai.com/logs?api=agents) and select the project where you ran your agent.
2. Find your session with **Search logs**. Use **Add filter** to filter by model, status, or date.
3. Select the session to open its timeline and list of turns.
4. Expand a turn, then select a step in the timeline or event list to see its details.

The session summary shows its status, model, start time, last activity, number of turns, and recorded token usage.

## Read a trace

Start with the session, then work your way into a turn:

1. **Session:** each entry in Logs → Agents is a session. Open it to see its timeline and list of turns. For example, a user can ask about an order, then ask a follow-up question in the same session.
2. **Turn:** expand a turn to see the work done during that cycle. One turn can include several model responses and tool calls. A follow-up message sent after the turn finishes starts another turn in the same session.
3. **Steps within the turn:** the trace groups model responses and tool calls under the root agent or the subagent that performed them. Each recorded step is called a **span**.

Select a span to see its status, duration, start and end times, and recorded data:

| Select                                           | What you can inspect                                                           |
| ------------------------------------------------ | ------------------------------------------------------------------------------ |
| [**Agent**](#agent)                              | The agent's details, instructions, and recorded token usage                    |
| [**Generation**](#generation) (a model response) | The recorded input and output for a model response                             |
| [**Tool**](#tool)                                | Which tool was called, the arguments sent to it, and the result when available |

### Agent

An agent span groups the work done by the **root agent** or a **subagent**: another agent asked to handle part of the task. Model responses and tool calls appear under the agent that performed them.

The details panel shows:

- **Agent type:** root agent (`root`) or subagent (`subagent`).
- **Agent:** its ID, name, model, and instructions when recorded.
- **Usage:** that agent's recorded token counts. These counts cover the agent itself; they do not include its subagents.
- **Duration** and **Outcome status:** how long the recorded work took and whether it completed, failed, or is incomplete.

### Generation

A generation span groups recorded model inputs and outputs. Each turn can have several generations.

During model inference, the model reads its input and produces a response. That response can request a tool. After the tool returns, the model can produce another response in a new generation.

- **Input:** recorded inputs associated with that response, such as a user message or a tool result.
- **Output:** recorded items produced by the model, such as answer text or a tool call.
- **Model:** the model used for the response, when recorded.

### Tool

A tool span describes a tool call and its recorded result.

Tool spans include calls to your functions and to tools on **MCP (Model Context Protocol)** servers. Web searches and command execution can also appear as tool spans.

- **Call:** the tool request, including the tool name and arguments when present.
- **Result:** the recorded response from the tool, when available.
- **Outcome status** and **Error:** the recorded outcome and error details, when present.

For an MCP tool call, **Call** contains the server label (`server_label`), tool name (`name`), and arguments (`arguments`). Its response and error are recorded there as `output` and `error`, when available. The separate **Result** panel can be empty because the MCP response is stored in **Call**.

## Timing and status

The timeline shows the order of the steps and which ones overlap. **Zoom in** shows shorter steps in more detail. **Fit timeline** shows the whole session.

Each span shows its duration and outcome status. Failed spans can also include recorded error details.

An agent span's duration includes its child steps. Steps can overlap: two subagents running together for 10 seconds cover about 10 seconds of elapsed time.

## Token usage

**Tokens** in the session summary shows session usage. **Usage** in an agent span shows that agent's recorded token counts.

Usage can arrive after the turn ends. A blank value or `null` means the count is unknown. It does not mean the agent used zero tokens. Counts can change as more usage becomes available and are not a final bill.

## When traces are ready

Traces are built after a turn ends. The agent's answer can appear before its trace or token usage is ready.

[Live session events](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) show progress while the agent is still working.

## Example: One turn with two subagents

This example is based on a recorded session. The root agent calls an MCP tool while two subagents run a command and fetch documents. The subagent names are simplified below; the counts and durations come from the recorded trace.

### Session and turn

The session header shows **1 turn**, **10 tool calls**, and **252,468 tokens**. The session status is **Idle**, and **Turn 1** is **Completed** with a duration of **1m 37s**.

Expanding the turn reveals the root agent and its child steps. The trace contains **3 agent spans** (the root and two subagents), **11 generation spans**, and **10 tool spans**.

This tree groups repeated generations and tool calls together. It shows parent relationships; the timeline shows when each step ran.

```text
Session: Idle
└── Turn 1: Completed                              1m 37s
    └── Root agent                                1m 37s
        ├── 6 generations
        ├── 2 tools: spawn_agent_call
        ├── Subagent A                               24s
        │   ├── 2 generations
        │   └── Tool: command_execution               2s
        ├── Subagent B                               21s
        │   ├── 3 generations
        │   ├── 2 tools: notion.fetch              2s each
        │   └── Tool: send_input_call                 0ms
        ├── Tool: demo_capability_probe              87ms
        └── 3 tools: wait_for_agents_call
```

### Model work and delegation

The root agent's first **Generation** includes the user's message in **Input**. Its **Output** contains messages and two `spawn_agent_call` items. Those calls also appear as **Tool** spans, and the resulting subagents appear as **Agent** spans under the root.

Subagent A has its own generations and a `command_execution` tool call. Subagent B has three generations, two `notion.fetch` MCP calls, and a `send_input_call`. Their model responses and tools belong to their respective subagent spans.

The root agent also has three `wait_for_agents_call` tool spans. Its final generation contains a message and has a recorded duration of **6s**.

### An MCP tool call

The root agent's `demo_capability_probe` span is a completed **Tool** span with a duration of **87ms**. Its **Tool type** is `mcp_call`.

The **Call** panel includes these fields:

```json
{
  "type": "mcp_call",
  "server_label": "demo_local",
  "name": "demo_capability_probe",
  "status": "completed"
}
```

This excerpt shows part of the recorded call. The same panel contains its `arguments` and the MCP response in `output`. The separate **Result** panel is `null`. The span's **Parent span** points to the root agent.

Subagent B's two `notion.fetch` spans have the same structure: `mcp_call` as the tool type, the MCP response in **Call**, and the subagent as their parent.

### Timing and usage in this session

The two subagent spans overlap on the timeline. Subagent A takes **24s** and Subagent B takes **21s**, both within the root agent's **1m 37s** span. The dashboard rounds these displayed durations.

The **Usage** panel on each agent span shows its own recorded token counts:

| Agent      | Input tokens | Output tokens | Total tokens |
| ---------- | ------------ | ------------- | ------------ |
| Root agent | 126,390      | 1,567         | 127,957      |
| Subagent A | 34,075       | 465           | 34,540       |
| Subagent B | 89,304       | 667           | 89,971       |

In this recorded session, the three agent totals add up to the **252,468 tokens** shown in the session header.