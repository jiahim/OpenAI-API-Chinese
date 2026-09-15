# DigitalOcean

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。通过在页面 URL 后追加 `.md` 即可获得文档页面的 Markdown 版本。

请参阅 [应用管理](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/digitalocean) 和 [Webhook 管理](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/digitalocean) 示例，请参见 OpenAI Cookbook。

## 工作原理

DigitalOcean 的托管 智能体 运行时服务（M.A.R.S.）使用以下镜像启动 Firecracker microVM： `codex-agentapi` 镜像中包含 Codex 并启动执行器，该执行器会主动连接到 智能体 API。

选择 **[Webhook 管理](#webhook-managed)** provisioning 以根据 OpenAI 事件启动或恢复沙箱，或 **[应用管理](#application-managed)** provisioning 以从你的应用程序控制它们。如需交互式快速入门，请使用可选的 [DigitalOcean CLI 流程](#try-it-with-the-digitalocean-cli)。请参阅 [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 了解连接与恢复行为。

M.A.R.S. 目前为仅限受邀的私有预览阶段。可通过 [DigitalOcean 的私有预览公告](https://www.digitalocean.com/blog/managed-agents-runtime-services-private-preview).

## 准备工作

你需要一个已启用 sandbox 的 DigitalOcean 账户，并具有对 `codex-agentapi` 的访问权限，以及一个具有 智能体 API 访问权限的 OpenAI 项目。

使用 `OPENAI_API_KEY` 为你的应用或 CLI 进行配置。将 `OPENAI_EXECUTOR_API_KEY` 设置为一个 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)。仅将环境密钥作为 `CODEX_API_KEY`.

传入 sandbox。对于 webhook 控制器或 Python 应用，请设置 `DIGITALOCEAN_TOKEN` 并安装 [支持异步的 PyDo beta SDK](https://github.com/digitalocean/pydo/releases) （`pydo[aio]`）。使用 [OpenAI SDK](https://developers.openai.com/api/docs/libraries#install-an-official-sdk) 进行 智能体 API 请求。CLI 安装仅在 CLI 流程中需要。

## Webhook-managed

1. [创建一个已存储的智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration#reuse-an-agent-across-sessions) 并将其 ID 保存为 `OPENAI_AGENT_ID`。在 DigitalOcean App Platform 中使用此 ID 部署一个 HTTPS webhook 控制器， `OPENAI_API_KEY` 用于会话读取， `DIGITALOCEAN_TOKEN`，和 `OPENAI_EXECUTOR_API_KEY`.
2. [注册其 `/webhook` 端点](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks) 到你的 OpenAI 项目。启用 `agent.session.action_required` 和 `agent.session.failed`，然后将签名密钥存储为 `OPENAI_WEBHOOK_SECRET` 并重新部署控制器。
3. 按照 [会话步骤](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#run-a-session) 使用相同的 `OPENAI_AGENT_ID` 和 `/workspace` 作为工作目录。打开事件流并发送输入。当 OpenAI 请求一个 `environment_connection`，时，控制器会验证签名，检索当前会话，并检查其 智能体 ID 和所需操作。它会查找 `mars-{session_id}` 在 DigitalOcean 中并恢复已暂停的沙盒，如果没有处于活动状态的沙盒则创建一个。
4. 在 `agent.session.failed`，时，再次检索会话，并且仅当当前会话状态仍为 `failed`.

该镜像将执行器连接到会话的环境。你的应用通过 智能体 API 发送输入并流式传输结果；控制器负责资源调配与重连。需要按会话对资源调配进行序列化，以处理重复投递和并发投递的情况。详见 [webhook 管理生命周期指南](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes) 了解控制器相关要求。

## 使用 DigitalOcean CLI 试用

CLI 会创建这两个资源，并让你在终端中与 智能体 交互。它会直接置备沙箱，无需 webhook 控制器。

安装 [`doctl` beta 版](https://github.com/digitalocean/doctl/releases) 其中包含 `harness-runtime`，然后进行身份验证：

```bash
doctl auth init
```

将此清单另存为 `agents.yaml`:

```yaml
name: openai-codex-session
agent: codex-agentapi
config:
  agent:
    model: gpt-5.6-sol
    instructions: Work from the files in /workspace.
  environment:
    type: self_hosted
    workspace_directory: /workspace
egress:
  - api.openai.com
  - codex-cloud-environments.chatgpt.com
env:
  CODEX_ENVIRONMENT_ID: ${ENV_ID}
secrets:
  CODEX_API_KEY: ${OPENAI_EXECUTOR_API_KEY}
```

该 `config` 块是 OpenAI create-session 请求。CLI 使用 `OPENAI_API_KEY`，对该请求进行身份验证，填充 `${ENV_ID}` 从响应中获取，并将环境密钥传递给沙箱。请勿将已解析的清单写入日志或纳入源码管理。工具所需的任何目标地址可添加到 `egress`.

创建会话和沙箱：

```bash
doctl harness-runtime create --spec agents.yaml
```

默认情况下，该命令会等待最多 300 秒直至就绪。从会话详情中保存 OpenAI 会话 ID 和 DigitalOcean 会话 ID，然后附加：

```bash
doctl harness-runtime launch openai-codex-session
```

让 智能体 写入 `hello` 到 `/workspace/hello.txt` 并读取回来。按 **Ctrl+D** 可在不删除会话的情况下分离，然后运行相同的 `launch` 命令以重新附加。完成后请执行 [清理](#cleanup) 。

## Application-managed

当你的应用自行负责会话创建和沙箱配置时，请使用此路径。首先创建 OpenAI 会话：

创建自托管会话

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const session = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    instructions:
      "You are a helpful coding assistant. Write clean code and verify that it works.",
  },
  environment: {
    type: "self_hosted",
    workspace_directory: "/workspace",
  },
});

console.log(session);
```

```python
from openai import OpenAI

client = OpenAI()

session = client.beta.agents.sessions.create(
    agent={
        "model": "gpt-6-astra",
        "instructions": "You are a helpful coding assistant. Write clean code and verify that it works.",
    },
    environment={"type": "self_hosted", "workspace_directory": "/workspace"},
)
print(session.to_json())
```

```go
import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
result, err := client.Beta.Agents.Sessions.New(ctx,
	openai.BetaAgentSessionNewParams{
		Agent: openai.BetaAgentSessionNewParamsAgent{
			Model:        openai.String("gpt-6-astra"),
			Instructions: openai.String("You are a helpful coding assistant. Write clean code and verify that it works."),
		},
		Environment: openai.EnvironmentParamUnion{
			OfParamSelfHosted: &openai.EnvironmentParamSelfHosted{WorkspaceDirectory: "/workspace"},
		},
	})
if err != nil {
	panic(err)
}
fmt.Println(result)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.EnvironmentParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var result =
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
                            "You are a helpful coding assistant. Write clean code and verify"
                                + " that it works.")
                        .build())
                .environment(
                    EnvironmentParam.SelfHosted.builder()
                        .workspaceDirectory("/workspace")
                        .build())
                .build());
System.out.println(result);
```

```ruby
require "openai"

client = OpenAI::Client.new
result = client.beta.agents.sessions.create(
  agent: {
    model: "gpt-6-astra",
    instructions: "You are a helpful coding assistant. Write clean code and verify that it works."
  },
  environment: {
    type: "self_hosted",
    workspace_directory: "/workspace"
  }
)
puts result
```


保存 `session.id` 以及环境 ID，如 [连接沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session)。将此仅包含沙箱的清单保存为 `sandbox.yaml`；智能体 配置已经发送到 OpenAI：

```yaml
agent: codex-agentapi
egress:
  - api.openai.com
  - codex-cloud-environments.chatgpt.com
env:
  CODEX_ENVIRONMENT_ID: ${ENV_ID}
secrets:
  CODEX_API_KEY: ${OPENAI_EXECUTOR_API_KEY}
```

1. 创建一个 `pydo.aio.Client` 使用 `DIGITALOCEAN_TOKEN` 并调用 `client.agents.create_session`。将 `params.openai_session_id` 设置为 OpenAI 会话 ID， `body.manifest` 设置为 `sandbox.yaml`，和 `body.variables` 为一个映射， `ENV_ID` 和 `OPENAI_EXECUTOR_API_KEY` 为其值。保存返回的 DigitalOcean `session_id`.
2. [打开事件流并发送输入](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input)，让 智能体 执行写入和读取 `/workspace/hello.txt`。输入会等待执行器连接。确认连接事件以及一轮已完成，并检查该 智能体 的输出中是否存在工具调用失败。
3. 使用以下方式检索文件： `workspace_download`，使用相对路径 `hello.txt`。保留这两个资源以供后续轮次使用，或 [清理资源](#cleanup).

在应用中使用有界的安装和执行超时，并处理连接失败。不要将配置 webhook 处理程序直接附加到你的应用或 CLI 管理的会话上。

## 清理

保存你需要的文件，然后 [删除 OpenAI 会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并销毁 DigitalOcean 沙箱。会话删除不会触发 webhook，因此你需要同时执行这两个操作并报告清理失败情况。

使用 PyDo 时，调用 `client.agents.destroy_session` 并传入 DigitalOcean 会话 ID。使用 CLI 时，传入该 ID 或沙箱的名称：

```bash
doctl harness-runtime remove openai-codex-session
```

在删除 webhook 控制器之前，先移除 OpenAI 的 webhook 注册。

## References

- 阅读 [DigitalOcean 沙箱搭建](https://github.com/digitalocean/pydo/tree/v0.40.0-beta.8/examples/agents/doc_python_sdk)
- 阅读 [DigitalOcean Python SDK](https://github.com/digitalocean/pydo)
- 阅读 [DigitalOcean CLI beta 版发布](https://github.com/digitalocean/doctl/releases)