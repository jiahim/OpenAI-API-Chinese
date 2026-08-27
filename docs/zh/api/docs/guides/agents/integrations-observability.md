# 集成与可观测性

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

工作流形态明确后，接下来的问题是哪些外部表面应位于智能体循环内部，以及你如何在运行时检查实际发生了什么。

## 选择什么在 SDK 中

| 需要                                                      | 从以下开始                                            | 原因                                                                 |
| --------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------- |
| 让智能体访问公共的、远程托管的 MCP 工具 | SDK 中的托管 MCP 工具                           | 模型可以通过托管界面调用远程 MCP 服务器 |
| 从你的运行时连接本地或私有 MCP 服务器    | SDK 管理的 MCP 服务器，通过 stdio 或流式 HTTP | 你的运行时拥有连接、审批和网络边界的控制权 |
| 调试提示词、工具、交接或审批              | 内置追踪                                      | 追踪显示端到端的记录，之后你再正式化评估        |

工具能力语义仍然存在于 [使用工具](https://developers.openai.com/api/docs/guides/tools)。中。本页重点介绍 SDK 特定的 MCP 连接与可观测性循环。

## MCP

当远程服务器应通过模型界面运行时，请使用托管 MCP 工具。

附加托管 MCP 服务器

```javascript
import { Agent, hostedMcpTool } from "@openai/agents";

const agent = new Agent({
  name: "MCP assistant",
  instructions: "Use the MCP tools to answer questions.",
  tools: [
    hostedMcpTool({
      serverLabel: "gitmcp",
      serverUrl: "https://gitmcp.io/openai/codex",
    }),
  ],
});
```

```python
from agents import Agent, HostedMCPTool

agent = Agent(
    name="MCP assistant",
    instructions="Use the MCP tools to answer questions.",
    tools=[
        HostedMCPTool(
            tool_config={
                "type": "mcp",
                "server_label": "gitmcp",
                "server_url": "https://gitmcp.io/openai/codex",
                "require_approval": "never",
            }
        )
    ],
)
```


当你的应用应直接连接到 MCP 服务器时，请使用本地传输方式。

连接本地 MCP 服务器

```javascript
import { Agent, MCPServerStdio, run } from "@openai/agents";

const server = new MCPServerStdio({
  name: "Filesystem MCP Server",
  fullCommand:
    "npx -y @modelcontextprotocol/server-filesystem fixtures/sample_files",
});

await server.connect();

try {
  const agent = new Agent({
    name: "Filesystem assistant",
    instructions: "Read files with the MCP tools before answering.",
    mcpServers: [server],
  });

  const result = await run(agent, "Read the files and list them.");
  console.log(result.finalOutput);
} finally {
  await server.close();
}
```

```python
import asyncio

from agents import Agent, Runner
from agents.mcp import MCPServerStdio


async def main() -> None:
    async with MCPServerStdio(
        name="Filesystem MCP Server",
        params={
            "command": "npx",
            "args": [
                "-y",
                "@modelcontextprotocol/server-filesystem",
                "./sample_files",
            ],
        },
    ) as server:
        agent = Agent(
            name="Filesystem assistant",
            instructions="Read files with the MCP tools before answering.",
            mcp_servers=[server],
        )
        result = await Runner.run(agent, "Read the files and list them.")
        print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```


实际的分工如下：

- 使用 **托管 MCP** 用于适合平台信任模型的公共远程服务器。
- 使用 **本地或私有 MCP** 当你的运行时应该拥有连接性、过滤或审批权限时。

关于平台级概念、信任模型和产品支持说明，请以 [MCP 与 Connectors](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 作为权威参考。

## 追踪

追踪功能内置于 Agents SDK，并在正常的服务端 SDK 路径中默认启用。每次运行都可以发出模型调用、工具调用、交接、护栏和自定义追踪片段的结构化记录，你可以查看这些记录于 [追踪仪表板](https://platform.openai.com/traces).

默认追踪通常提供以下内容：

- 整个运行或工作流
- 每次模型调用
- 工具调用及其输出
- 交接和护栏
- 你在工作流周围包裹的任何自定义跨度

如果你需要更少的追踪，请使用SDK级别或每次运行的追踪控制，而不是从工作流中移除所有可观测性。

在一个追踪中封装多次运行

```javascript
import { Agent, run, withTrace } from "@openai/agents";

const agent = new Agent({
  name: "Joke generator",
  instructions: "Tell funny jokes.",
});

await withTrace("Joke workflow", async () => {
  const first = await run(agent, "Tell me a joke");
  const second = await run(agent, `Rate this joke: ${first.finalOutput}`);
  console.log(first.finalOutput);
  console.log(second.finalOutput);
});
```

```python
import asyncio

from agents import Agent, Runner, trace

agent = Agent(
    name="Joke generator",
    instructions="Tell funny jokes.",
)


async def main() -> None:
    with trace("Joke workflow"):
        first = await Runner.run(agent, "Tell me a joke")
        second = await Runner.run(
            agent,
            f"Rate this joke: {first.final_output}",
        )
        print(first.final_output)
        print(second.final_output)


if __name__ == "__main__":
    asyncio.run(main())
```


使用追踪有两个用途：

- 调试一次工作流运行，并理解发生了什么。
- 将更高信号的示例输入到 [智能体工作流评估](https://developers.openai.com/api/docs/guides/agent-evals) ，一旦你准备好系统地评分行为时。

## 后续步骤

外部接口接入后，继续阅读涵盖能力设计、审查边界或评估的指南。



  [使用工具



        了解托管工具、函数工具和智能体即工具如何与 MCP 结合使用。](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)
  [护栏和人工审查



        在敏感能力周围添加批准或验证边界。](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)
  [智能体工作流评估



        行为稳定后，从一次性追踪转向可重复的评估。](https://developers.openai.com/api/docs/guides/agent-evals)