# OpenAI 托管的沙箱

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 。

OpenAI 托管的沙箱为你的智能体提供一个 Linux 工作环境，内置 Python、Node.js 和命令行工具。
OpenAI 负责配置和连接，你只需提供任务并获取结果。
请选择 [自托管沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted)
当你需要自己的图像、计算资源或私有网络时。

对于通过浏览器与网站交互的任务，请参阅
[计算机使用](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use).

## 配置沙箱

将 `environment.type` 为 `openai_hosted` ，并仅添加你的工作负载所需的设置。工作目录为
。 `/workspace`.

- `packages`: 安装 Python、系统级或全局 `npm` 软件包，或 `python`, `system`，或 `npm` 列表。需要时固定版本，例如 `pandas==2.2.3`.
- `setup_commands`: 在智能体启动前按顺序运行 shell 命令，例如 `[{ "command": "mkdir -p reports" }]`。每个命令都有自己的可选 `cwd`，默认值为 `/workspace`.
- `files`: [提供输入文件](https://developers.openai.com/api/docs/guides/agents-api/environments/files#upload-files) ，可通过 Files API ID 或内联 base64 内容提供。
- `env`: 设置字符串类型的环境变量。智能体生成的代码可以读取这些值。重要提示：对于密钥，请使用 [保管库凭据](https://developers.openai.com/api/docs/guides/agents-api/tools/vaults#use-vault-secrets-for-api-requests-from-a-sandbox) 以将真实值保留在沙箱之外。运行时保留的名称，包括 `PATH`, `CODEX_*`，和 `OPENAI_API_KEY`，将被拒绝。
- `skills`, `plugins`, `capability_directories`: 添加 [技能](https://developers.openai.com/api/docs/guides/tools-skills#agents-api) 和 [插件](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins).
- `environment_template_id`: [复用已保存的配置](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins#reuse-a-hosted-plugin-setup) 跨会话使用。省略的设置将继承该模板；网络覆盖不能放宽其策略。

包和输入文件会在 setup 命令运行之前准备完成。 非零的 setup
退出状态会阻止智能体启动。可使用 setup 命令检查所需的依赖或文件。模板保存的是配置，
而不是正在运行的工作区。

### 选择容器大小

将 `environment.container_size` 在创建会话时用于选择沙箱可用的 CPU 和
内存。默认为 `medium`.

| 规格     | vCPU | 内存 |
| -------- | ---- | ------ |
| `small`  | 1    | 1 GB   |
| `medium` | 2    | 4 GB   |
| `large`  | 4    | 16 GB  |

例如，在你的请求中加入该环境以选择
`POST /v1/agents/sessions` 请求以选择 `small`:

```json
{
  "environment": {
    "type": "openai_hosted",
    "container_size": "small"
  }
}
```

返回的会话会在以下字段中报告所选大小： `environment.container_size`.
此设置仅适用于 OpenAI 托管的沙箱。

### 控制网络访问

| `network.access` | 行为                                                                         |
| ---------------- | -------------------------------------------------------------------------------- |
| `enabled`        | 允许出站访问。除非继承自模板策略，否则这是默认值。 |
| `disabled`       | 阻止出站访问。                                                           |
| `restricted`     | 仅允许列出的主机 `allowed_domains`.                                |

限制模式接受 1–100 个精确的主机名，例如 `api.example.com`.
不要包含通配符、协议、路径或端口。子域和重定向
目标地址需要各自的条目。托管 stdio MCP 服务器目前需要
`enabled` 访问权限；请参阅 [stdio MCP 要求](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#start-a-server-over-stdio).

### 检查设置是否成功

create-session 响应表示已开始设置。获取
`GET /v1/agents/environments/{environment_id}` 以使用该会话的 `environment.id`:
`provisioning` 表示设置正在进行； `connected` 表示设置已成功。
对于 `failed`，请阅读 `environment.error` 中的 `agent.session.environment.failed`
事件。等待 `connected` 后再添加或列出在线文件。

## 文件和生命周期

每个会话都有独立的工作区。只要其沙盒存在，文件会在各轮次之间保持持久化。在
下的文件会在某一轮完成时作为不可变工件发布；这些副本在沙盒过期后仍可下载。 `/workspace/outputs` 的文件会在某一轮完成时作为不可变工件发布；这些副本在沙盒过期后仍可下载。
沙盒过期后仍可下载。
沙盒过期。

使用 [文件和工件](https://developers.openai.com/api/docs/guides/agents-api/environments/files) 了解上传、路径规则、实时文件操作、下载和限制的相关信息。删除会话前，请保存你需要保留的输出。
了解上传、路径规则、实时文件操作、下载和限制的相关信息。删除会话前，请保存你需要保留的输出。
删除会话前，请保存你需要保留的输出。

### Sandbox expiry

已连接的沙箱会接收保活信号，包括回合之间。如果活动和
保活信号停止持续一小时，该沙箱可能会被删除。此超时时间不可
配置。

使用完毕后请删除会话以请求清理沙箱。如果删除
操作返回 `409` ，说明设置或执行尚未完成，请等待并重试，同时限制重试
次数。关闭事件流不会取消该任务。

## 定价

OpenAI 托管的沙箱使用标准 [容器费率](https://developers.openai.com/api/docs/pricing#built-in-tools).
模型使用按所选模型单独计费， [API 费率](https://developers.openai.com/api/docs/pricing).

## 示例：创建一份报告

给智能体一个包含 `10`, `20`，的 CSV， `30`。它会运行 Python 来计算
总和并写入 `/workspace/outputs/summary.json`.

将 `OPENAI_API_KEY` 在你的应用终端中使用
[快速入门前置条件](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites).
将该密钥放在沙箱之外。使用包含 beta 版OpenAI SDK 的版本
[该公司 开发工具包](https://developers.openai.com/api/docs/libraries) 其中包含 beta 版智能体 API。

创建 summary.json

```javascript
import OpenAI from "openai";
import { agentFileDestination } from "openai/helpers/beta/agents/filesystem";

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

stream.withResultCollection();
try {
  for await (const event of stream) {
    console.log(event);
  }
  const result = await stream.finalResult();
  await client.beta.agents.sessions.artifacts.forResult(result).download({
    path: "/workspace/outputs/summary.json",
    to: agentFileDestination("summary.json"),
  });
} finally {
  stream.controller.abort();
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

with stream.with_result_collection():
    for event in stream:
        print(event.model_dump_json())
    result = stream.get_final_result()

client.beta.agents.sessions.artifacts.for_result(result).download(
    "/workspace/outputs/summary.json", to="summary.json"
)
```

```go
package main

import (
	"context"
	"fmt"
	"os"

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
	openai.BetaAgentSessionWithResultCollection(stream)
	for stream.Next() {
		fmt.Println(stream.Current().RawJSON())
	}

	result, err := openai.BetaAgentSessionFinalResult(stream)
	if err != nil {
		panic(err)
	}
	destination, err := os.Create("summary.json")
	if err != nil {
		panic(err)
	}
	defer destination.Close()
	_, err = client.Beta.Agents.Sessions.Artifacts.ForResult(result).Download(ctx, "/workspace/outputs/summary.json", destination)
	if err != nil {
		panic(err)
	}
	if err := destination.Close(); err != nil {
		panic(err)
	}
}
```

```java
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.helpers.beta.agents.AgentArtifactDownloads;
import com.openai.models.beta.agents.EnvironmentParam;
import com.openai.models.beta.agents.HostedEnvironmentFileParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;
import com.openai.services.beta.agents.AgentTurnResults;
import java.nio.file.Path;

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
      AgentTurnResults.withResultCollection(stream);
      stream.stream().forEach(System.out::println);
      var result = AgentTurnResults.getFinalResult(stream);
      AgentArtifactDownloads.forResult(client.beta().agents().sessions().artifacts(), result)
          .download("/workspace/outputs/summary.json", Path.of("summary.json"));
    }
  }
}
```

```ruby
require "openai"
require "json"
require "pathname"

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
  stream.with_result_collection
  stream.each { |event| puts event.to_json }
  result = stream.get_final_result
  puts result.output_text
  client.beta.agents.sessions.artifacts.for_result(result).download(
    path: "/workspace/outputs/summary.json",
    to: Pathname("summary.json")
  )
ensure
  stream.close
end
```

```bash
curl --no-buffer --fail-with-body https://api.openai.com/v1/agents/sessions \\\n  -H "OpenAI-Beta: agents=v1" \\\n  -H "Authorization: Bearer $OPENAI_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n  "agent": {\n    "model": "gpt-6-astra"\n  },\n  "environment": {\n    "type": "openai_hosted",\n    "network": {\n      "access": "disabled"\n    },\n    "files": [\n      {\n        "type": "inline",\n        "path": "/workspace/amounts.csv",\n        "data": "YW1vdW50CjEwCjIwCjMwCg=="\n      }\n    ]\n  },\n  "input": "Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it.",\n  "stream": true\n}\'
```


中的 base64 值 `files` 包含 CSV 输入。代码会打印会话事件。
保存 `session.id` 从 `agent.session.created`。之后 `agent.session.turn.completed`,
[列出构件](https://developers.openai.com/api/docs/guides/agents-api/environments/files#list-artifacts)，找到 `summary.json`,
并 [下载它](https://developers.openai.com/api/docs/guides/agents-api/environments/files#download-an-artifact)。其内容应为：

```json
{ "total": 60 }
```

一轮对话完成并不能保证所有工具都成功执行。如果任务失败，或者
流在完成之前就结束了， [检查已保存的会话项](https://developers.openai.com/api/docs/guides/agents-api/sessions#retrieve-session-items).
[删除会话](https://developers.openai.com/api/docs/guides/agents-api/quickstart#4-clean-up) 完成后将其删除。

## 故障排查

| 问题                                     | 排查项                                                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Setup 失败                                 | 检查环境失败事件，并修正软件包、输入文件或 setup 命令中的错误，然后再创建新会话。 |
| 沙箱请求被阻止                | 检查 `network` 以及通过重定向到达的所有主机。                                                                       |
| 实时文件操作失败                 | 确认沙箱处于 `connected`。状态。如果已过期，请创建新会话并重新提供输入。                           |
| 状态或文件列表请求返回 `5xx` | 使用递增的延迟和最终截止时间进行重试。如果错误仍然存在，请保留请求 ID。                                        |