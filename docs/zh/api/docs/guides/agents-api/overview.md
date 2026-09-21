# 智能体 API

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取 Markdown 版本的文档页面。

智能体 API 让你的应用通过 OpenAI 托管的 API 访问 Codex harness。

OpenAI 负责管理会话、编排、上下文压缩与恢复，而你的应用负责提供工具并选择其执行环境。

智能体 可以在沙箱中运行，执行代码、编辑文件、连接 MCP 服务器并生成产物。

## 定价

模型使用费用按所选模型的 [API 费率计费](https://developers.openai.com/api/docs/pricing)。OpenAI 工具使用其 [标准费率](https://developers.openai.com/api/docs/pricing#built-in-tools)，而 OpenAI 托管的沙盒使用标准 [容器费率](https://developers.openai.com/api/docs/pricing#built-in-tools).

## 尝试示例

试用以下完整示例：

- [创建并运行目录树脚本](https://developers.openai.com/api/docs/guides/agents-api/quickstart#1-run-a-task) 在 OpenAI 托管的沙箱中。
- [使用子智能体比较发布说明](https://developers.openai.com/api/docs/guides/agents-api/multi-agent#example-compare-release-notes) 并将它们的发现合并为一个答案。

探索完整应用：

- [事件响应智能体](https://developers.openai.com/cookbook/examples/agents_api/apps/sev_bot/readme)：调查告警，并请求批准恢复操作。
- [Slack 机器人](https://developers.openai.com/cookbook/examples/agents_api/apps/slack_bot/readme)：使用已连接的工作场所工具调查请求。
- [数据分析师](https://developers.openai.com/cookbook/examples/agents_api/apps/data_analyst/readme)：使用只读 SQL 回答数据仓库相关问题。
- 使用 [GitHub issue 调查器](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/apps/github_issues) 来复现上报的 Bug，并在 GitHub 上分享调查结果。
- 使用 [文档审阅器](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/apps/document_review) ，结合策略技能和专家智能体来审阅文档。

## 核心概念

智能体 API 围绕四个核心概念构建：

- **智能体：** 可供 智能体 使用的模型、指令、工具和 MCP 服务器。
- **环境：** 供 智能体 访问文件、加载技能以及运行命令的可选沙箱或计算机。
- **会话：** 一个持久的 智能体 实例，用于处理任务并响应输入。
- **事件与条目：** 发送给 智能体 的输入以及会话期间生成的输出。

### 一个从头到尾的会话

从 OpenAI 托管的沙箱开始，在 [快速入门](https://developers.openai.com/api/docs/guides/agents-api/quickstart):

1. **创建一个会话。** 配置智能体；OpenAI 会自动准备其运行环境。
2. **为其分配一个任务。** 环境就绪后，用户输入即开启一轮工作。
3. **跟踪进度。** 流式获取输出，或通过 webhook 获知智能体何时完成或需要输入。
4. **继续或引导。** 向同一会话发送新任务，或在当前轮次中引导智能体。

在 OpenAI 托管的会话中，你的应用负责发送输入并接收事件，而 OpenAI 负责运行 智能体 并提供和管理其沙箱。详见 [环境选项](https://developers.openai.com/api/docs/guides/agents-api/configuration#environment-settings) 了解设置方式和相关限制。

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/overview-1-mobile.webp"
    width="680"
    height="1288"
  />
  <img src="https://developers.openai.com/images/api/agents-api/overview-1.webp"
    width="1400"
    height="552"
    alt="Your application starts sessions and receives events and output from the Agents API. OpenAI runs the managed Codex harness and provisions and manages its sandbox."
    loading="lazy"
  />
</picture>

## 托管运行框架提供的功能

托管的 Codex 运行框架支持：

- 在沙箱中运行命令和代码。
- 应用相关的技能和指令。
- 通过工具或 MCP 连接到外部数据。
- 在 智能体 工作时对其进行引导。
- 总结之前的工作以管理其上下文窗口。
- 将工作拆分为子任务并委派给子智能体。
- 从上次中断的地方恢复会话。

查看 [快速入门的前置条件](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites) 了解 API 密钥权限和 SDK 配置。在创建会话时配置以下能力：

配置托管执行环境能力

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const session = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    instructions:
      "Use the OpenAI documentation MCP and web search to answer technical questions accurately. Delegate independent research tasks to subagents when useful.",
    tools: [
      { type: "programmatic_tool_calling" },
      {
        type: "mcp",
        server_label: "openai_docs",
        transport: {
          type: "http",
          server_url: "https://developers.openai.com/mcp",
        },
      },
      { type: "web_search" },
    ],
    multi_agent: { enabled: true, max_concurrent_subagents: 4 },
  },
  environment: {
    type: "self_hosted",
    workspace_directory: "/workspace",
    capability_directories: ["/workspace/capabilities/skills"],
  },
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Research how to connect an MCP server to an OpenAI agent, check for recent updates, and summarize the recommended setup.",
        },
      ],
    },
  ],
});
console.log(session.id);
```

```python
from openai import OpenAI

client = OpenAI()

session = client.beta.agents.sessions.create(
    agent={
        "model": "gpt-6-astra",
        "instructions": "Use the OpenAI documentation MCP and web search to answer technical questions accurately. Delegate independent research tasks to subagents when useful.",
        "tools": [
            {"type": "programmatic_tool_calling"},
            {
                "type": "mcp",
                "server_label": "openai_docs",
                "transport": {
                    "type": "http",
                    "server_url": "https://developers.openai.com/mcp",
                },
            },
            {"type": "web_search"},
        ],
        "multi_agent": {"enabled": True, "max_concurrent_subagents": 4},
    },
    environment={
        "type": "self_hosted",
        "workspace_directory": "/workspace",
        "capability_directories": ["/workspace/capabilities/skills"],
    },
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Research how to connect an MCP server to an OpenAI agent, check for recent updates, and summarize the recommended setup.",
                }
            ],
        }
    ],
)
print(session.id)
```

```go
import (
	"context"
	"fmt"
	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
session, err := client.Beta.Agents.Sessions.New(ctx, openai.BetaAgentSessionNewParams{Agent: openai.BetaAgentSessionNewParamsAgent{Model: openai.String("gpt-6-astra"),
	Instructions: openai.String("Use the OpenAI documentation MCP and web search to answer technical questions accurately. Delegate independent research tasks to subagents when useful."),
	Tools: []openai.AgentToolParamUnion{openai.AgentToolParamUnion{OfParamProgrammaticToolCalling: &openai.AgentToolParamProgrammaticToolCalling{}},
		openai.AgentToolParamUnion{OfParamMcp: &openai.AgentToolParamMcp{ServerLabel: "openai_docs",
			Transport: openai.McpTransportParamUnion{OfParamHTTP: &openai.McpTransportParamHTTP{ServerURL: "https://developers.openai.com/mcp"}}}},
		openai.AgentToolParamUnion{OfParamWebSearch: &openai.AgentToolParamWebSearch{}}},
	MultiAgent: openai.MultiAgentConfigParam{Enabled: true,
		MaxConcurrentSubagents: openai.Int(4)}},
	Environment: openai.EnvironmentParamUnion{OfParamSelfHosted: &openai.EnvironmentParamSelfHosted{WorkspaceDirectory: "/workspace",
		CapabilityDirectories: []string{"/workspace/capabilities/skills"}}},
	Input: openai.BetaAgentSessionNewParamsInputUnion{OfArrayOfInputMessages: []openai.AgentSessionInputMessageParam{openai.AgentSessionInputMessageParam{Content: []openai.InputContentParamUnion{openai.InputContentParamUnion{OfParamInputText: &openai.InputContentParamInputText{Text: "Research how to connect an MCP server to an OpenAI agent, check for recent updates, and summarize the recommended setup."}}}}}}})
if err != nil {
	panic(err)
}
fmt.Println(session.ID)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.AgentToolParam;
import com.openai.models.beta.agents.EnvironmentParam;
import com.openai.models.beta.agents.McpTransportParam;
import com.openai.models.beta.agents.MultiAgentConfigParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;
import java.util.List;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var session =
    client
        .beta()
        .agents()
        .sessions()
        .create(
            SessionCreateParams.builder()
                .agent(
                    SessionCreateParams.Agent.builder()
                        .model("gpt-6-astra")
                        .instructions(
                            "Use the OpenAI documentation MCP and web search to answer"
                                + " technical questions accurately. Delegate independent"
                                + " research tasks to subagents when useful.")
                        .addTool(AgentToolParam.ProgrammaticToolCalling.builder().build())
                        .addTool(
                            AgentToolParam.Mcp.builder()
                                .serverLabel("openai_docs")
                                .transport(
                                    McpTransportParam.Http.builder()
                                        .serverUrl("https://developers.openai.com/mcp")
                                        .build())
                                .build())
                        .addTool(AgentToolParam.WebSearch.builder().build())
                        .multiAgent(
                            MultiAgentConfigParam.builder()
                                .enabled(true)
                                .maxConcurrentSubagents(4L)
                                .build())
                        .build())
                .environment(
                    EnvironmentParam.SelfHosted.builder()
                        .workspaceDirectory("/workspace")
                        .capabilityDirectories(List.of("/workspace/capabilities/skills"))
                        .build())
                .input(
                    "Research how to connect an MCP server to an OpenAI agent, check for recent"
                        + " updates, and summarize the recommended setup.")
                .build());
System.out.println(session.id());
```

```ruby
require "openai"

client = OpenAI::Client.new

session = client.beta.agents.sessions.create(
  agent: {
    model: "gpt-6-astra",
    instructions: "Use the OpenAI documentation MCP and web search to answer technical questions accurately. Delegate independent research tasks to subagents when useful.",
    tools: [
      { type: "programmatic_tool_calling" },
      {
        type: "mcp",
        server_label: "openai_docs",
        transport: {
          type: "http",
          server_url: "https://developers.openai.com/mcp"
        }
      },
      { type: "web_search" }
    ],
    multi_agent: {
      enabled: true,
      max_concurrent_subagents: 4
    }
  },
  environment: {
    type: "self_hosted",
    workspace_directory: "/workspace",
    capability_directories: ["/workspace/capabilities/skills"]
  },
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Research how to connect an MCP server to an OpenAI agent, check for recent updates, and summarize the recommended setup."
        }
      ]
    }
  ]
)
puts session.id
```

```bash
curl -sS -X POST "https://api.openai.com/v1/agents/sessions" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": {
      "model": "gpt-6-astra",
      "instructions": "Use the OpenAI documentation MCP and web search to answer technical questions accurately. Delegate independent research tasks to subagents when useful.",
      "tools": [
        {
          "type": "programmatic_tool_calling"
        },
        {
          "type": "mcp",
          "server_label": "openai_docs",
          "transport": {
            "type": "http",
            "server_url": "https://developers.openai.com/mcp"
          }
        },
        {
          "type": "web_search"
        }
      ],
      "multi_agent": {
        "enabled": true,
        "max_concurrent_subagents": 4
      }
    },
    "environment": {
      "type": "self_hosted",
      "workspace_directory": "/workspace",
      "capability_directories": ["/workspace/capabilities/skills"]
    },
    "input": [
      {
        "role": "user",
        "content": [
          {
            "type": "input_text",
            "text": "Research how to connect an MCP server to an OpenAI agent, check for recent updates, and summarize the recommended setup."
          }
        ]
      }
    ]
  }'
```





有关运行时对比，请参阅 [智能体概述](https://developers.openai.com/api/docs/guides/agents#compare-agent-runtimes).

智能体 API 会保留会话状态，使你可以在多个轮次之间继续工作，而无需
  重建对话上下文。当不再需要时，你可以删除会话和已发布的
  制品。
  智能体 API 目前仅支持美国的数据驻留，且
  不支持零数据保留 (ZDR)。选择自托管沙箱并不会
  使 智能体 API 符合 ZDR 条件。请参阅 [数据控制
  在 OpenAI 平台中](https://developers.openai.com/api/docs/guides/your-data#storage-requirements-and-retention-controls-per-endpoint)
  了解数据驻留和保留的详细信息。