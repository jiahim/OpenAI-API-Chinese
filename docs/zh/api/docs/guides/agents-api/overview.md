# 智能体 API

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾添加 `.md` 获取。

智能体 API 让你的应用通过由 OpenAI 管理的 API 访问 Codex harness。

OpenAI 负责管理会话、编排、上下文压缩与恢复，而你只需提供工具并选择执行环境。

智能体 可以在沙箱中运行，执行代码、编辑文件、连接 MCP 服务器并产出产物。

## 定价

模型使用按所选模型的费率计费，请参阅我们的 [API 定价](https://developers.openai.com/api/docs/pricing)。OpenAI 工具使用其 [标准费率](https://developers.openai.com/api/docs/pricing#built-in-tools)，由 OpenAI 托管的沙盒使用标准 [容器费率](https://developers.openai.com/api/docs/pricing#built-in-tools).

## Try an example

可参考以下完整示例：

- [创建并运行一个目录树脚本](https://developers.openai.com/api/docs/guides/agents-api/quickstart#1-run-a-task) 在 OpenAI 托管的沙箱中。
- [使用子智能体对比发布说明](https://developers.openai.com/api/docs/guides/agents-api/multi-agent#example-compare-release-notes) 并将它们的发现合并为一个答案。

探索完整的应用：

- [事件响应 智能体](https://developers.openai.com/cookbook/examples/agents_api/apps/sev_bot/readme)：调查告警并申请恢复操作的审批。
- [Slack 机器人](https://developers.openai.com/cookbook/examples/agents_api/apps/slack_bot/readme)：使用已连接的工作场所工具调查请求。
- [数据分析师](https://developers.openai.com/cookbook/examples/agents_api/apps/data_analyst/readme)：以只读 SQL 回答数据仓库问题。
- 使用 [GitHub 问题调查器](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/apps/github_issues) 以复现已报告的 bug，并在 GitHub 上分享发现。
- 使用 [文档审阅者](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/apps/document_review) 以借助策略技能和专属 智能体 审阅文档。

## 核心概念

The 智能体 API is built around four main concepts:

- **智能体：** 可供 智能体 使用的模型、指令、工具和 MCP 服务器。
- **环境：** 可选的沙箱或计算机，智能体 在其中访问文件、加载技能并运行命令。
- **会话：** 一个可持久存在的 智能体 实例，用于处理任务并响应输入。
- **事件与条目：** 在会话期间发送给 智能体 的输入以及生成的输出。

### 一个从头到尾的会话

从一个 OpenAI 托管沙箱开始 [快速入门](https://developers.openai.com/api/docs/guides/agents-api/quickstart):

1. **创建一个会话。** 配置 智能体；OpenAI 会为其准备运行环境。
2. **给它一个任务。** 环境就绪后，用户输入会开启一轮工作。
3. **跟踪进度。** 流式输出或使用 webhook，以便在 智能体 完成或需要输入时收到通知。
4. **继续或引导。** 向同一会话发送另一个任务，或在当前轮次中引导该 智能体。

使用 OpenAI 托管的会话时，你的应用负责发送输入并接收事件，而 OpenAI 负责运行 智能体 并提供与管理其沙箱。详见 [环境选项](https://developers.openai.com/api/docs/guides/agents-api/configuration#environment-settings) 以了解设置与限制。

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

## 托管工具栏提供的能力

托管的 Codex 运行框架支持：

- 在沙箱中运行命令和代码。
- 应用相关的技能和指令。
- 通过工具或 MCP 连接外部数据。
- 在智能体工作时对其进行引导。
- 总结之前的工作以管理其上下文窗口。
- 将工作拆分为子任务并委派给子智能体。
- 恢复上次中断的会话。

查看 [快速入门前提条件](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites) 了解 API 密钥权限和 SDK 配置。创建会话时配置这些能力：

配置托管 harness 能力

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

有关基于 智能体 API 构建的 AWS 服务，请参阅
[Bedrock 托管 智能体](https://developers.openai.com/api/docs/guides/agents-api/bedrock-managed-agents).

智能体 API 会保留会话状态，这样你无需
  重新构建对话上下文即可跨轮次继续工作。当不再需要时，你可以删除会话和已发布的
  制品。
  智能体 API 目前仅在美国支持数据驻留，
  且不支持零数据保留（ZDR）。选择自托管沙箱并
  不会使 智能体 API 符合 ZDR 条件。有关详情，请参阅 OpenAI 平台中的 [数据控制
  文档](https://developers.openai.com/api/docs/guides/your-data#storage-requirements-and-retention-controls-per-endpoint)
  ，了解数据驻留和保留方面的详细信息。