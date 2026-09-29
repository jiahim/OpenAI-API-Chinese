# OpenAI 托管沙箱

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾添加 `.md` 来获取。

由 OpenAI 托管的沙箱为你的 智能体 提供一个配备 Python、Node.js 的 Linux 工作区，
以及命令行工具。OpenAI 负责配置并连接它；你的应用负责提供
任务并获取结果。选择 [自托管沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted)
当你需要使用自己的镜像、算力或私有网络时。

对于通过浏览器与网站交互的任务，请参阅
[计算机使用](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use).

## 配置沙盒

Set `environment.type` to `openai_hosted` 并仅添加你的工作负载所需
的设置。工作目录是 `/workspace`.

- `packages`: 安装 Python、系统级或全局 `npm` 包，使用 `python`, `system`，或 `npm` 列表。必要时固定版本，例如 `pandas==2.2.3`.
- `setup_commands`: 在 智能体 启动之前按顺序运行 shell 命令，例如 `[{ "command": "mkdir -p reports" }]`。每个命令都有自己的可选 `cwd`，默认值为 `/workspace`.
- `files`: [提供输入文件](https://developers.openai.com/api/docs/guides/agents-api/environments/files#upload-files) 可通过 Files API ID 或内联 base64 内容提供。
- `env`: 设置字符串值的环境变量。智能体 生成的代码可以读取这些值。重要提示：对于机密信息，请使用 [保管库凭据](https://developers.openai.com/api/docs/guides/agents-api/tools/vaults#use-vault-secrets-for-api-requests-from-a-sandbox) 以将真实值保留在沙箱之外。运行时保留名称，包括 `PATH`, `CODEX_*`，以及 `OPENAI_API_KEY`，都会被拒绝。
- `skills`, `plugins`, `capability_directories`: 添加 [技能](https://developers.openai.com/api/docs/guides/tools-skills#agents-api) 和 [插件](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins).
- `environment_template_id`: [跨会话复用已保存的配置](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins#reuse-a-hosted-plugin-setup) 。省略的设置将继承模板；网络覆盖不能放宽其策略。

包和输入文件在 setup 命令运行之前准备就绪。如果 setup 命令以非零退出状态结束，则会阻止智能体启动。请使用 setup 命令来检查必需的
依赖项或文件。模板保存的是配置，而不是正在运行的工作区。
依赖项或文件。模板保存的是配置，而不是正在运行的工作区。

### 选择容器大小

Set `environment.container_size` 创建会话时，选择沙箱可用的 CPU 和
内存。默认值为 `medium`.

| Size     | vCPU | Memory |
| -------- | ---- | ------ |
| `small`  | 1    | 1 GB   |
| `medium` | 2    | 4 GB   |
| `large`  | 4    | 16 GB  |

例如，在你的请求中包含此环境以选择
`POST /v1/agents/sessions` request to select `small`:

```json
{
  "environment": {
    "type": "openai_hosted",
    "container_size": "small"
  }
}
```

The returned session reports the selected size in `environment.container_size`.
This setting applies only to OpenAI-hosted sandboxes.

### 控制网络访问

| `network.access` | 行为                                                                         |
| ---------------- | -------------------------------------------------------------------------------- |
| `enabled`        | 允许出站访问。除非你继承了模板策略，否则这是默认行为。 |
| `disabled`       | 阻止出站访问。                                                           |
| `restricted`     | 仅允许访问列出的主机 `allowed_domains`.                                |

受限模式接受 1–100 个精确的主机名，例如 `api.example.com`.
不要包含通配符、协议、路径或端口。子域名和重定向
目标需要各自单独的条目。托管 stdio MCP 服务器当前需要
`enabled` 访问；请参阅 [stdio MCP 要求](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#start-a-server-over-stdio).

### 检查设置是否成功

create-session 响应表示已开始初始化。获取
`GET /v1/agents/environments/{environment_id}` 使用会话的 `environment.id`:
`provisioning` 表示初始化正在进行中； `connected` 表示初始化已成功完成。
如需 `failed`,请参阅 `environment.error` 中的 `agent.session.environment.failed`
事件。请等待 `connected` 之后再添加或列出实时文件。

## 文件与生命周期

每个会话都有独立的工作区。在沙箱存在期间，文件会在多个回合之间持续保留。
沙箱下的文件 `/workspace/outputs` 会在回合结束时作为不可变工件发布；
这些副本在沙箱过期后仍可下载。
沙箱过期后仍可下载。

使用 [文件和工件](https://developers.openai.com/api/docs/guides/agents-api/environments/files) 了解上传、
路径规则、实时文件操作、下载及限制的相关说明。请在删除会话前保存你需要保留的输出。
了解上传、路径规则、实时文件操作、下载及限制的相关说明。请在删除会话前保存你需要保留的输出。

### Sandbox expiry

已连接的沙箱会接收 keep-alive，包括轮次之间。如果活动以及
keep-alive 停止一小时，沙箱可能会被删除。该超时不可
配置。

使用完毕后请删除会话以请求清理沙箱。如果删除
返回 `409` 在初始化或执行完成时，请稍候重试，并限制
重试次数。关闭事件流不会取消任务。

## 定价

OpenAI 托管的沙箱使用标准 [容器费率](https://developers.openai.com/api/docs/pricing#built-in-tools).
模型使用按所选模型的 [API 费率单独计费](https://developers.openai.com/api/docs/pricing).

## 示例：创建一份报告

向智能体提供一个包含以下内容的 CSV： `10`, `20`，然后 `30`。它会运行 Python 来计算
总和并写入 `/workspace/outputs/summary.json`.

Set `OPENAI_API_KEY` 在你的应用终端中，使用
[quickstart prerequisites](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites).
请将此密钥保存在沙箱之外。使用包含 beta 版 智能体 API 的 OpenAI SDK 版本。
[该公司 开发工具包](https://developers.openai.com/api/docs/libraries) 它包含 beta 版 智能体 接口。

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


其中的 base64 值 `files` 包含 CSV 输入。代码会打印会话事件。
保存 `session.id` 从 `agent.session.created`。之后 `agent.session.turn.completed`,
[列出制品](https://developers.openai.com/api/docs/guides/agents-api/environments/files#list-artifacts)，找到 `summary.json`,
并 [下载它](https://developers.openai.com/api/docs/guides/agents-api/environments/files#download-an-artifact)。其内容应为：

```json
{ "total": 60 }
```

已完成的回合并不保证每个工具都执行成功。如果任务失败，或者
流在完成之前就结束了， [请检查已保存的会话项](https://developers.openai.com/api/docs/guides/agents-api/sessions#retrieve-session-items).
[删除会话](https://developers.openai.com/api/docs/guides/agents-api/quickstart#4-clean-up) 完成后即可删除会话。

## 故障排除

| 问题                                     | 排查内容                                                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 启动失败                                 | 检查环境失败事件，并修复软件包、输入文件或启动命令中的错误，再创建新的会话。 |
| 沙箱请求被阻止                | 检查 `network` 以及通过重定向访问到的任何主机。                                                                       |
| 实时文件操作失败                 | 确认沙箱处于 `connected`。如果已过期，请创建新会话并重新提供输入。                           |
| 状态或文件列表请求返回 `5xx` | 使用逐渐增加的延迟和最终截止时间进行重试。如果错误仍然存在，请保留请求 ID。                                        |