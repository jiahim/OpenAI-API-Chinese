# DigitalOcean

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

参阅 [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/digitalocean/application_managed) 以及 [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/digitalocean/webhook_managed) 示例，请参考 OpenAI Cookbook。

## 工作原理

DigitalOcean 的托管 智能体 Runtime Services (M.A.R.S.) 使用以下镜像启动 Firecracker microVM `codex-agentapi` 镜像。该镜像包含 Codex 并启动执行器，执行器会向外连接到 智能体 API。

选择 **[webhook-managed](#webhook-managed)** provisioning 以从 OpenAI 事件启动或恢复沙盒，或 **[application-managed](#application-managed)** provisioning 以从你的应用中控制这些沙盒。如需交互式快速入门，请使用可选的 [DigitalOcean CLI 流程](#try-it-with-the-digitalocean-cli)。请参阅 [Sandbox 生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 了解连接和恢复行为。

DigitalOcean 托管 智能体 处于公共预览阶段。请参阅 [DigitalOcean 的文档](https://docs.digitalocean.com/products/managed-agents/) 了解访问与设置方式。

## 准备工作

你需要一个已启用沙箱功能的 DigitalOcean 账户，并可访问 `codex-agentapi` 以及一个具有 智能体 API 访问权限的 OpenAI 项目。

使用 `OPENAI_API_KEY` 用于你的应用或 CLI。将 `OPENAI_EXECUTOR_API_KEY` 设置为某个 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)。仅将环境密钥作为以下内容传入沙箱： `CODEX_API_KEY`.

对于 webhook 控制器或 Python 应用，请设置 `DIGITALOCEAN_TOKEN` 并安装 [PyDo SDK](https://github.com/digitalocean/pydo/releases) 0.41.0 或更高版本，并支持异步（`pydo[aio]`）。使用 [OpenAI SDK](https://developers.openai.com/api/docs/libraries#install-an-official-sdk) 进行智能体 API 请求。仅在使用 CLI 流程时才需要安装 CLI。

## Webhook-managed

1. [创建一个已存储的 智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration#reuse-an-agent-across-sessions) 并将其 ID 保存为 `OPENAI_AGENT_ID`。在 DigitalOcean App Platform 中部署一个使用此 ID 的 HTTPS webhook 控制器， `OPENAI_API_KEY` 用于会话读取， `DIGITALOCEAN_TOKEN`，以及 `OPENAI_EXECUTOR_API_KEY`.
2. [注册其 `/webhook` 端点](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks) 到你的 OpenAI 项目中。启用 `agent.session.action_required` 和 `agent.session.failed`，然后将签名密钥存储为 `OPENAI_WEBHOOK_SECRET` 并重新部署控制器。
3. 按照 [会话步骤](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#run-a-session) 使用相同的 `OPENAI_AGENT_ID` 和 `/workspace` 作为工作目录。打开事件流并发送输入。当 OpenAI 请求一个 `environment_connection`，时，控制器会验证签名、检索当前会话，并检查其 智能体 ID 和所需操作。它会在 DigitalOcean 中查找 `mars-{session_id}` ，并恢复已暂停的沙盒，或者在没有活跃沙盒时创建一个。
4. 在 `agent.session.failed`，时，再次检索会话，并且仅当当前会话状态仍为 `failed`.

镜像将执行器连接到会话的环境。你的应用通过 智能体 API 发送输入并流式返回结果；控制器负责预配置与重连。请按会话序列化预配置，以处理重复和并发的交付。详见 [webhook 管理的生命周期指南](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes) 以了解控制器要求。

## 使用 DigitalOcean CLI 试用

CLI 会创建这两种资源，并允许你从终端与该智能体交互。它直接预配沙盒，无需 webhook controller。

安装 [`doctl`](https://github.com/digitalocean/doctl/releases) version 1.170.0 或更高版本，其中包含 `harness-runtime`，然后进行身份验证：

```bash
doctl auth init
```

将该清单保存为 `environment.yaml`:

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

该 `config` block 是 OpenAI create-session 请求。CLI 使用 `OPENAI_API_KEY`，对该请求进行身份验证，并填充 `${ENV_ID}` 从响应中获取的内容，且仅将环境密钥传递给沙盒。请勿将已解析的清单写入日志或纳入源代码管理。将你的工具所需的任何目标添加到 `egress`.

创建 session 和沙盒：

```bash
doctl harness-runtime create --spec environment.yaml
```

默认情况下，该命令最多等待 300 秒以就绪。请从 session 详情中保存 OpenAI session ID 和 DigitalOcean session ID，然后附加：

```bash
doctl harness-runtime launch openai-codex-session
```

让该智能体写入 `hello` 到 `/workspace/hello.txt` 并将其读回。按下 **Ctrl+D** 可在不删除 session 的情况下分离，并运行相同的 `launch` 命令以重新附加。完成后请按照 [清理](#cleanup) 操作。

## Application-managed

在你的应用负责创建会话和预置沙箱时使用该路径。首先创建 OpenAI 会话：

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


保存 `session.id` 以及环境 ID，如 [连接沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session)。中所述。将这个仅含沙箱的清单保存为 `sandbox.yaml`；智能体 配置已经发送到 OpenAI：

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

1. 创建一个 `pydo.aio.Client` ，使用 `DIGITALOCEAN_TOKEN` 并调用 `client.agents.create_session`。将 `params.openai_session_id` 设置为 OpenAI 会话 ID， `body.manifest` 设置为 `sandbox.yaml`，以及 `body.variables` 为 `ENV_ID` 和 `OPENAI_EXECUTOR_API_KEY` 到它们的值。保存返回的 DigitalOcean `session_id`.
2. [打开事件流并发送输入](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input)，请求 智能体 写入并读取 `/workspace/hello.txt`。输入会等待执行器连接。确认连接事件和已完成的轮次，并检查 智能体 输出中的工具失败情况。
3. 使用 `workspace_download`，检索文件，使用相对路径 `hello.txt`。保留这两个资源以便后续轮次使用，或 [清理](#cleanup).

使用有界的设置与执行超时，并在你的应用中处理连接失败。请勿将预配 webhook 处理器挂载到由你的应用或 CLI 直接管理的会话上。

## 清理

保存所需的文件后 [删除 OpenAI 会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并销毁 DigitalOcean 沙箱。会话删除不会触发 webhook，因此请同时执行这两个操作并报告清理失败情况。

使用 PyDo 时，调用 `client.agents.destroy_session` 并传入 DigitalOcean 会话 ID。使用 CLI 时，传入该 ID 或沙箱的名称：

```bash
doctl harness-runtime remove openai-codex-session
```

在删除 webhook 控制器之前，请先移除 OpenAI 的 webhook 注册。

## 参考资料

- 阅读 [DigitalOcean 沙盒设置](https://github.com/digitalocean/pydo/tree/main/examples/agents/doc_python_sdk)
- 阅读 [DigitalOcean Python SDK](https://github.com/digitalocean/pydo)
- 阅读 [DigitalOcean CLI 发布](https://github.com/digitalocean/doctl/releases)