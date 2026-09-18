# 集成与可观测性

> 完整的文档索引请参见 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取文档页面的 Markdown 版本。

在工作流形态明确之后，下一个问题是哪些外部接口应该放在智能体循环内部，以及你将如何在运行时检视实际发生的情况。

## 选择要在 SDK 中保留的内容

| 需求                                                      | 入门方式                                            | 原因                                                                 |
| --------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------- |
| 为 智能体 提供对公开远程托管 MCP 工具的访问 | SDK 中的托管 MCP 工具                           | 模型可以通过托管接口调用远程 MCP 服务器 |
| 在你的运行时中连接本地或私有的 MCP 服务器    | 通过 stdio 或可流式传输的 HTTP 由 SDK 管理的 MCP 服务器 | 由你的运行时管理连接、审批和网络边界 |
| 调试提示、工具、交接或审批              | 内置 追踪                                      | 在你正式构建评测之前，追踪会展示端到端的完整记录        |

工具能力语义仍然在 [使用工具](https://developers.openai.com/api/docs/guides/tools)。本页重点介绍 SDK 专属的 MCP 配置与可观测性闭环。

## MCP

当远程服务器需要通过模型表面运行时，使用托管 MCP 工具。

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


当你的应用需要直接连接到 MCP 服务器时，使用本地传输方式。

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


实际的划分方式是：

- 使用 **托管 MCP** 处理符合平台信任模型的公共远程服务器。
- 使用 **本地或私有 MCP** 当你的运行时需要自行管理连接、过滤或审批时。

有关平台级概念、信任模型和产品支持说明，请参阅 [MCP 服务器](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 作为权威参考。

## 追踪

追踪功能内置于 Agents SDK 中，并在默认的 服务端 SDK 路径中默认开启。每次运行都可以生成结构化的记录，包含模型调用、工具调用、交接、护栏以及自定义 span，你可以在 [追踪仪表板](https://platform.openai.com/traces).

默认的 追踪 通常会提供给你：

- 整个运行或工作流
- 每次模型调用
- 工具调用及其输出
- 交接和护栏
- 你在工作流周围包裹的任何自定义 span

如果你需要减少追踪，可以使用 SDK 级别或单次运行的 追踪 控制，而不是完全移除工作流的可观测性。

将多次运行合并到同一个 追踪 中

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


使用追踪来完成两项工作：

- 调试单次工作流运行并理解发生了什么。
- 将更高质量的示例输入到 [智能体工作流评估](https://developers.openai.com/api/docs/guides/agent-evals) 中，当准备好系统性地评估行为时使用。

## 后续步骤

在接入外部接口后，继续阅读涵盖能力设计、审查边界或评估的指南。



  [使用工具



        了解托管工具、函数工具以及 智能体-as-tools 如何与 MCP 配合使用。](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk)
  [护栏与人工审查



        为敏感能力添加审批或校验边界。](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)
  [智能体 工作流 评估



        在行为稳定后，从零散的追踪转向可复用的评分流程。](https://developers.openai.com/api/docs/guides/agent-evals)