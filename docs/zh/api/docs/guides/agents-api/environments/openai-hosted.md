# OpenAI 托管的沙箱

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

一个 OpenAI 托管的沙箱会为你的 智能体 提供一个包含 Python、Node.js 的 Linux 工作区，
以及命令行工具。OpenAI 负责预置并连接该沙箱；你的应用提供
任务并获取结果。选择一个 [自托管沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted)
当你需要自定义镜像、计算资源或私有网络时。

## 配置沙箱

将 `environment.type` 设置为 `openai_hosted` ，并仅添加你的工作负载所需
的设置。工作目录为 `/workspace`.

- `packages`：安装 Python、系统或全局 `npm` 包，使用 `python`, `system`，或 `npm` 列表。必要时固定版本，例如 `pandas==2.2.3`.
- `setup_commands`：在 智能体 启动前按顺序运行 shell 命令，例如 `[{ "command": "mkdir -p reports" }]`。每个命令都有自己的可选 `cwd`，默认为 `/workspace`.
- `files`: [提供输入文件](https://developers.openai.com/api/docs/guides/agents-api/environments/files#upload-files) ，可通过 Files API ID 或内联 base64 内容传入。
- `env`：设置字符串值的环境变量。运行时保留的名称（包括 `PATH`, `CODEX_*`）和 `OPENAI_API_KEY`，将被拒绝。
- `skills`, `plugins`, `capability_directories`：添加 [技能](https://developers.openai.com/api/docs/guides/tools-skills#agents-api) 和 [插件](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins).
- `environment_template_id`: [跨会话复用已保存的配置](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins#reuse-a-hosted-plugin-setup) 。省略的设置将继承该模板；网络相关覆盖项不得放宽其策略。

软件包和输入文件会在 setup 命令运行之前准备好。非零的 setup
退出状态会阻止智能体启动。可以使用 setup 命令来检查所需的
依赖项或文件。模板保存的是配置，而不是正在运行的工作区。

### 控制网络访问

| `network.access` | 行为                                                                         |
| ---------------- | -------------------------------------------------------------------------------- |
| `enabled`        | 允许出站访问。除非继承了模板策略，否则这是默认行为。 |
| `disabled`       | 阻止出站访问。                                                           |
| `restricted`     | 仅允许列出的主机 `allowed_domains`.                                |

Restricted 模式接受 1–100 个精确的主机名，例如 `api.example.com`.
不要包含通配符、协议、路径或端口。子域名和重定向
目标地址需要单独的条目。托管的 stdio MCP 服务器当前需要
`enabled` 访问权限；请参阅 [stdio MCP 要求](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#start-a-server-over-stdio).

### 检查设置是否成功

create-session 响应表示安装已开始。检索
`GET /v1/agents/environments/{environment_id}` 使用该会话的 `environment.id`:
`provisioning` 表示安装正在运行； `connected` 表示安装成功。
有关 `failed`,请阅读 `environment.error` 中的 `agent.session.environment.failed`
事件。等待 `connected` 后再添加或列出实时文件。

## 文件与生命周期

每个会话都有独立的工作区。在其沙箱存在期间，文件会在各轮之间保留。
下的文件会在某个轮次 `/workspace/outputs` 完成时发布为不可变的
制品；在沙箱过期后，这些副本仍可下载。
沙箱过期后仍可下载。

请参阅 [文件和制品](https://developers.openai.com/api/docs/guides/agents-api/environments/files) 以了解上传、
路径规则、实时文件操作、下载及限制的相关信息。请在删除会话之前保存你需要
的输出。

### 沙盒到期

已连接的沙箱会接收保活信号，包括各轮次之间。如果活动和
保活信号停止一小时，沙箱可能会被删除。该超时不可
配置。

使用完毕后请删除会话以请求清理沙箱。如果删除
返回 `409` 在设置或执行尚未完成时，请等待并重试，同时限制
重试次数。关闭事件流不会取消任务。

## 定价

OpenAI 托管的沙箱使用标准 [容器费率](https://developers.openai.com/api/docs/pricing#built-in-tools).
模型使用费用按所选模型的 [API 费率单独计费](https://developers.openai.com/api/docs/pricing).

## 示例：创建一份报告

给智能体一个包含 `10`, `20`，的 CSV， `30`。它会运行 Python 来计算
总和并写入 `/workspace/outputs/summary.json`.

将 `OPENAI_API_KEY` 在你应用的终端中，使用
[快速入门前置条件](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites).
请将此密钥保存在沙箱外。使用包含测试版
[OpenAI SDK](https://developers.openai.com/api/docs/libraries) 的版本，其中包含测试版 智能体 API。

创建 summary.json

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const stream = await client.beta.agents.sessions.create({
  agent: { model: "gpt-6-astra" },
  environment: {
    type: "openai_hosted",
    network: { access: "disabled" },
    files: [
      {
        type: "inline",
        path: "/workspace/amounts.csv",
        data: "YW1vdW50CjEwCjIwCjMwCg==",
      },
    ],
  },
  input:
    "Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it.",
  stream: true,
});

for await (const event of stream) {
  console.log(event);
}
```

```python
from openai import OpenAI

client = OpenAI()
stream = client.beta.agents.sessions.create(
    agent={"model": "gpt-6-astra"},
    environment={
        "type": "openai_hosted",
        "network": {"access": "disabled"},
        "files": [
            {
                "type": "inline",
                "path": "/workspace/amounts.csv",
                "data": "YW1vdW50CjEwCjIwCjMwCg==",
            }
        ],
    },
    input="Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it.",
    stream=True,
)

with stream:
    for event in stream:
        print(event.model_dump_json())
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	ctx := context.Background()
	client := openai.NewClient()
	stream := client.Beta.Agents.Sessions.NewStreaming(ctx, openai.BetaAgentSessionNewParams{
		Agent: openai.BetaAgentSessionNewParamsAgent{Model: openai.String("gpt-6-astra")},
		Environment: openai.EnvironmentParamUnion{OfParamOpenAIHosted: &openai.EnvironmentParamOpenAIHosted{
			Network: openai.EnvironmentParamOpenAIHostedNetwork{Access: "disabled"},
			Files: []openai.HostedEnvironmentFileParamUnion{{OfParamInline: &openai.HostedEnvironmentFileParamInline{
				Path: "/workspace/amounts.csv",
				Data: "YW1vdW50CjEwCjIwCjMwCg==",
			}}},
		}},
		Input: openai.BetaAgentSessionNewParamsInputUnion{OfString: openai.String("Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it.")},
	})
	defer stream.Close()

	for stream.Next() {
		fmt.Println(stream.Current().RawJSON())
	}
	if err := stream.Err(); err != nil {
		panic(err)
	}
}
```

```java
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.EnvironmentParam;
import com.openai.models.beta.agents.HostedEnvironmentFileParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;

public class HostedReport {
  public static void main(String[] args) throws Exception {
    var client = OpenAIOkHttpClient.fromEnv();
    var params =
        SessionCreateParams.builder()
            .agent(SessionCreateParams.Agent.builder().model("gpt-6-astra").build())
            .environment(
                EnvironmentParam.OpenAIHosted.builder()
                    .network(
                        EnvironmentParam.OpenAIHosted.Network.builder()
                            .access(EnvironmentParam.OpenAIHosted.Network.Access.DISABLED)
                            .build())
                    .addFile(
                        HostedEnvironmentFileParam.Inline.builder()
                            .path("/workspace/amounts.csv")
                            .data("YW1vdW50CjEwCjIwCjMwCg==")
                            .build())
                    .build())
            .input(
                "Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object"
                    + " with the total to /workspace/outputs/summary.json, then read it back to"
                    + " verify it.")
            .build();

    try (var stream = client.beta().agents().sessions().createStreaming(params)) {
      stream.stream().forEach(System.out::println);
    }
  }
}
```

```ruby
require "openai"
require "json"

client = OpenAI::Client.new
stream = client.beta.agents.sessions.create_streaming(
  agent: { model: "gpt-6-astra" },
  environment: {
    type: :openai_hosted,
    network: { access: :disabled },
    files: [
      {
        type: :inline,
        path: "/workspace/amounts.csv",
        data: "YW1vdW50CjEwCjIwCjMwCg=="
      }
    ]
  },
  input: "Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it."
)

begin
  stream.each { |event| puts event.to_json }
ensure
  stream.close
end
```

```bash
curl --no-buffer --fail-with-body https://api.openai.com/v1/agents/sessions \\\n  -H "OpenAI-Beta: agents=v1" \\\n  -H "Authorization: Bearer $OPENAI_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n  "agent": {\n    "model": "gpt-6-astra"\n  },\n  "environment": {\n    "type": "openai_hosted",\n    "network": {\n      "access": "disabled"\n    },\n    "files": [\n      {\n        "type": "inline",\n        "path": "/workspace/amounts.csv",\n        "data": "YW1vdW50CjEwCjIwCjMwCg=="\n      }\n    ]\n  },\n  "input": "Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it.",\n  "stream": true\n}\'
```


中的 base64 值 `files` 包含 CSV 输入。代码会打印会话事件。
保存 `session.id` 从 `agent.session.created`。之后 `agent.session.turn.completed`,
[列出产物](https://developers.openai.com/api/docs/guides/agents-api/environments/files#list-artifacts)，找到 `summary.json`,
并 [下载它](https://developers.openai.com/api/docs/guides/agents-api/environments/files#download-an-artifact)。其内容应为：

```json
{ "total": 60 }
```

完成的轮次并不保证每个工具都成功。如果任务失败或
流在完成前结束， [检查已保存的会话项](https://developers.openai.com/api/docs/guides/agents-api/sessions#retrieve-session-items).
[删除会话](https://developers.openai.com/api/docs/guides/agents-api/quickstart#4-clean-up) 完成后删除。

## 故障排除

| 问题                                     | 检查内容                                                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 安装失败                                 | 检查环境失败事件，并在创建新会话之前修复包、输入文件或安装命令相关的错误。 |
| 沙箱请求被拦截                | 检查 `network` 以及通过重定向到达的任何主机。                                                                       |
| 实时文件操作失败                 | 确认沙箱处于 `connected`。状态。如果已过期，请新建会话并重新提供输入。                           |
| 状态或文件列表请求返回 `5xx` | 请以递增的延迟和截止时间进行重试。若错误仍然存在，请保留请求 ID。                                        |