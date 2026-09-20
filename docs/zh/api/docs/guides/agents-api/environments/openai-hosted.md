# OpenAI 托管沙箱

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

一个 OpenAI 托管的沙箱为你的 智能体 提供一个带有 Python、Node.js 的 Linux 工作区，
以及命令行工具。OpenAI 负责配置并连接它；你的应用负责
提供任务并获取结果。请选择 [自托管沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted)
当你需要自己的镜像、计算资源或专用网络时。

## 配置沙箱

设置 `environment.type` 为 `openai_hosted` 并仅添加你的工作负载所需的设置
。工作目录为 `/workspace`.

- `packages`: 安装 Python、系统或全局 `npm` 软件包， `python`, `system`，或 `npm` 列表。必要时固定版本，例如 `pandas==2.2.3`.
- `setup_commands`: 在 智能体 启动之前按顺序运行 shell 命令，例如 `[{ "command": "mkdir -p reports" }]`。每个命令都有自己的可选 `cwd`，默认为 `/workspace`.
- `files`: [提供输入文件](https://developers.openai.com/api/docs/guides/agents-api/environments/files#upload-files) ，方式为通过 Files API ID 或内联 base64 内容。
- `env`: 设置字符串类型的环境变量。智能体 生成的代码可以读取这些值。重要提示：对于密钥，请使用 [vault 凭据](https://developers.openai.com/api/docs/guides/agents-api/tools/vaults#use-vault-secrets-for-api-requests-from-a-sandbox) 以将真实值保留在沙箱外部。运行时保留名称，包括 `PATH`, `CODEX_*`，和 `OPENAI_API_KEY`，将被拒绝。
- `skills`, `plugins`, `capability_directories`: 添加 [skills](https://developers.openai.com/api/docs/guides/tools-skills#agents-api) 和 [plugins](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins).
- `environment_template_id`: [跨会话复用已保存的配置](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins#reuse-a-hosted-plugin-setup) 。省略的设置将继承该模板；网络覆盖不能放宽其策略。

软件包和输入文件会在 setup 命令运行之前准备好。非零的 setup
退出状态会阻止智能体启动。可以使用 setup 命令来检查所需的
依赖项或文件。模板保存的是配置，而非运行中的工作区。

### 控制网络访问

| `network.access` | 行为                                                                         |
| ---------------- | -------------------------------------------------------------------------------- |
| `enabled`        | 允许出站访问。除非你继承了模板策略，否则这是默认设置。 |
| `disabled`       | 阻止出站访问。                                                           |
| `restricted`     | 仅允许列出的主机 `allowed_domains`.                                |

Restricted 模式接受 1–100 个精确的主机名，例如 `api.example.com`.
请勿包含通配符、协议、路径或端口。子域名和重定向
目标需要单独的条目。托管的 stdio MCP 服务器目前需要
`enabled` 访问权限；请参阅 [stdio MCP 要求](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#start-a-server-over-stdio).

### 检查设置是否成功

create-session 响应意味着安装已开始。检索
`GET /v1/agents/environments/{environment_id}` 使用该会话的 `environment.id`:
`provisioning` 表示安装正在进行； `connected` 表示安装成功。
有关 `failed`,请阅读 `environment.error` 事件中的相关内容。 `agent.session.environment.failed`
事件。在添加或列出 live 文件之前,请等待 `connected` 再添加或列出 live 文件。

## 文件与生命周期

每个会话都有独立的工作区。在其沙箱存在期间，文件会在多轮交互中持续保留，而
沙箱存在期间，文件会在多轮交互中持续保留，而位于 `/workspace/outputs` 下的文件会以不可变 原文方式发布
某个回合完成时的 artifacts；这些副本在
沙箱过期后仍可下载。

使用 [文件和制品](https://developers.openai.com/api/docs/guides/agents-api/environments/files) 了解上传、
路径规则、实时文件操作、下载和限制。保存你需要保留的输出，
之后再删除会话。

### Sandbox expiry

已连接的沙箱会接收 keep-alive，包括轮次之间。如果活动和
keep-alive 停止一小时，沙箱可能会被删除。此超时不可
配置。

使用完毕后请删除会话以请求清理沙箱。如果删除
返回 `409` 当设置或执行尚未完成时，等待并重试，并限制重试次数
。关闭事件流不会取消任务。

## 定价

OpenAI 托管的沙箱使用标准的 [容器费率](https://developers.openai.com/api/docs/pricing#built-in-tools).
模型使用按所选模型的 [API 费率单独计费](https://developers.openai.com/api/docs/pricing).

## 示例：创建一份报告

向智能体提供一个包含 `10`, `20`，的 CSV，它会 `30`。运行 Python 来计算
总和，并将结果写入 `/workspace/outputs/summary.json`.

设置 `OPENAI_API_KEY` 在你的应用终端中使用
[快速入门前置条件](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites).
请将此密钥放在沙箱之外。请使用包含 beta 智能体 API 的 OpenAI SDK 版本。
[该公司 开发工具包](https://developers.openai.com/api/docs/libraries) 创建 summary.json。

中的 base64 值

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


包含 CSV 输入。代码会打印会话事件。 `files` 保存。
从 `session.id` 之后 `agent.session.created`。列出制品 `agent.session.turn.completed`,
[中找到](https://developers.openai.com/api/docs/guides/agents-api/environments/files#list-artifacts)，并 `summary.json`,
下载它 [。其内容应为：](https://developers.openai.com/api/docs/guides/agents-api/environments/files#download-an-artifact). Its contents should be:

```json
{ "total": 60 }
```

一个轮次完成并不保证所有工具都执行成功。如果任务失败，或者
流在完成之前就结束了， [请检查已保存的会话项](https://developers.openai.com/api/docs/guides/agents-api/sessions#retrieve-session-items).
[删除会话](https://developers.openai.com/api/docs/guides/agents-api/quickstart#4-clean-up) 即可完成清理。

## 故障排除

| 问题                                     | 排查要点                                                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 安装失败                                 | 检查环境失败事件并修复软件包、输入文件或安装命令错误，然后再创建一个新的会话。 |
| 沙箱请求被拦截                | 检查 `network` 以及通过重定向到达的任何主机。                                                                       |
| 实时文件操作失败                 | 确认沙箱处于 `connected`。状态。如果已过期，请创建一个新会话并重新提供输入。                           |
| 状态或文件列表请求返回 `5xx` | 按递增的延迟和截止时间重试。如果错误仍然存在，请保留请求 ID。                                        |