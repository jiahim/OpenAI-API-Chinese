# OpenAI 托管的沙箱

> 完整文档索引请参见 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾添加 `.md` 。

由 OpenAI 托管的沙箱为你的 智能体 提供一个配备 Python、Node.js 的 Linux 工作环境，
以及命令行工具。OpenAI 负责配置并连接该沙箱，你的应用负责
提供任务并获取结果。选择一个 [自托管沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted)
当你需要自己的图像、计算资源或私有网络时。

对于通过浏览器与网站交互的任务，请参阅
[Computer use](https://developers.openai.com/api/docs/guides/agents-api/tools/computer-use).

## 配置沙箱

Set `environment.type` to `openai_hosted` in your create-session request. Add
only the settings your workload needs. The sandbox's working directory is
`/workspace`.

Choose the resources and network access your task needs with `container_size`
and `network`. If you use an environment template, omitted settings inherit the
template.

### 准备包和文件

使用这些设置可以使依赖和输入在沙箱中可用：

- `packages`: 安装 Python、system 或 global `npm` 包时使用 `python`, `system`，或 `npm` 列表。必要时固定版本，例如 `pandas==2.2.3`.
- `files`: [提供输入文件](https://developers.openai.com/api/docs/guides/agents-api/environments/files#upload-files) 通过 Files API ID 或内联 base64 内容。

### 运行设置命令

使用 `setup_commands` 在 智能体 启动之前按顺序运行 shell 命令。例如
示例： `[{ "command": "mkdir -p reports" }]` 会创建一个目录。每条命令
可以设置自己的 `cwd`；默认值为 `/workspace`.

软件包和输入文件会在 setup 命令运行之前准备就绪。可以使用 setup
命令检查所需的依赖项或文件。如果 setup 的退出状态码非零，
则会阻止 智能体 启动。

### 设置环境变量

使用 `env` 用于设置字符串值的环境变量。智能体生成的代码可以
读取这些值。

对于密钥，请使用 [vault 凭据](https://developers.openai.com/api/docs/guides/agents-api/tools/vaults#use-vault-secrets-for-api-requests-from-a-sandbox)
以将真实值保持在沙箱之外。运行时保留名称，包括
`PATH`, `CODEX_*`，和 `OPENAI_API_KEY`，将被拒绝。

### 选择容器大小

Set `environment.container_size` 在创建会话时用于选择沙箱可用的 CPU 和
内存。默认值为 `medium`.

| 规格     | vCPU | 内存 |
| -------- | ---- | ------ |
| `small`  | 1    | 1 GB   |
| `medium` | 2    | 4 GB   |
| `large`  | 4    | 16 GB  |

例如，请在请求中包含此环境
`POST /v1/agents/sessions` 以选择 `small`:

```json
{
  "environment": {
    "type": "openai_hosted",
    "container_size": "small"
  }
}
```

返回的会话会在 `environment.container_size`.
此设置仅适用于 OpenAI 托管的沙箱。

### 控制网络访问

| `network.access` | 行为                                                                         |
| ---------------- | -------------------------------------------------------------------------------- |
| `enabled`        | 允许出站访问。除非继承模板策略，否则这是默认设置。 |
| `disabled`       | 阻止出站访问。                                                           |
| `restricted`     | 仅允许 中列出的主机 `allowed_domains`.                                |

Restricted 模式接受 1–100 个精确的主机名，例如 `api.example.com`.
不要包含通配符、协议、路径或端口。子域名和重定向
目标各自需要单独的条目。托管 stdio MCP 服务器目前需要
`enabled` 访问；请参阅 [stdio MCP 要求](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#start-a-server-over-stdio).

### 添加技能与插件

使用 `skills`, `plugins`，和 `capability_directories` 以添加
[技能](https://developers.openai.com/api/docs/guides/tools-skills#agents-api) and
[插件](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins).

### 跨会话复用配置

Set `environment_template_id` to [复用已保存的配置](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins#reuse-a-hosted-plugin-setup).
未指定的设置将继承模板。网络相关覆盖不能放宽其策略。
模板保存的是配置，而不是正在运行的工作区。

### 检查设置是否成功

create-session 响应表示已开始设置。要检查其状态，请检索
`GET /v1/agents/environments/{environment_id}` 使用该会话的 `environment.id`.

| 状态         | 操作说明                                                                |
| -------------- | ------------------------------------------------------------------------- |
| `provisioning` | 等待设置运行完成。                                                    |
| `connected`    | 设置成功。你可以添加或列出实时文件。                          |
| `failed`       | 读取 `environment.error` 中的 `agent.session.environment.failed` 事件。 |

等待 `connected` 后再添加或列出实时文件。

## 文件与生命周期

每个会话都有独立的工作区。在沙箱存在期间，文件会在各轮次之间持续保存。
下的文件在沙箱存在期间会跨轮次保留。 `/workspace/outputs` 会在某轮次完成时作为不可变制品发布。
这些副本在沙箱过期后仍然可以下载。
沙箱过期后仍可下载。

使用 [文件和制品](https://developers.openai.com/api/docs/guides/agents-api/environments/files) 以了解上传、
路径规则、实时文件操作、下载和限制的详细信息。删除会话前请先保存所需输出。
删除会话前请先保存所需输出。

### Sandbox expiry

已连接的沙箱会接收 keep-alives，包括在两次回合之间。如果活动和
keep-alives 停止一小时，沙箱可能会被删除。该超时不可
配置。

完成后请删除会话以请求清理沙箱。如果删除
returns `409` 等待设置或执行完成，然后重试，并限制重试次数。
关闭事件流不会取消该任务。

## 定价

OpenAI 托管的沙箱使用标准 [容器费率](https://developers.openai.com/api/docs/pricing#built-in-tools).
模型使用按所选模型的 [API 费率单独计费](https://developers.openai.com/api/docs/pricing).

## 示例：创建报告

给智能体一个包含 `10`, `20`，和 `30`。的 CSV 文件。它会运行 Python 来计算
总和并写入 `/workspace/outputs/summary.json`.

Set `OPENAI_API_KEY` 在你的应用程序终端中，使用
[快速入门前置条件](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites).
请将此密钥保存在沙箱外部。使用包含 beta 版 智能体API 的版本的
[OpenAI SDK](https://developers.openai.com/api/docs/libraries) 。

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


中的 base64 值 `files` 包含 CSV 输入。代码会输出会话事件。
保存 `session.id` 从 `agent.session.created`。之后 `agent.session.turn.completed`,
[列出制品](https://developers.openai.com/api/docs/guides/agents-api/environments/files#list-artifacts)，找到 `summary.json`,
and [下载它](https://developers.openai.com/api/docs/guides/agents-api/environments/files#download-an-artifact)。其内容应为：

```json
{ "total": 60 }
```

一个完成的回合并不保证每个工具都执行成功。如果任务失败或
流在完成前结束， [inspect the saved session items](https://developers.openai.com/api/docs/guides/agents-api/sessions#retrieve-session-items).
[Delete the session](https://developers.openai.com/api/docs/guides/agents-api/quickstart#4-clean-up) 完成后，你可以删除该会话。

## 故障排除

| 问题                                     | 检查项                                                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 初始化失败                                 | 检查环境失败事件并在创建新会话之前修复包、输入文件或初始化命令错误。 |
| 沙盒请求被阻止                | 检查 `network` 以及通过重定向访问到的任何主机。                                                                       |
| 实时文件操作失败                 | 确认沙盒处于 `connected`。状态。如果已过期，请新建会话并重新提供输入。                           |
| 状态或文件列表请求返回 `5xx` | 以逐渐递增的延迟和截止时间进行重试。如果错误仍然存在，请保留请求 ID。                                        |