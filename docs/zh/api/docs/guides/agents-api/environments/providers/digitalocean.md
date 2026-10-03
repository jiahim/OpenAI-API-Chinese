# DigitalOcean

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

请参阅 [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/digitalocean/application_managed) 以及 [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/digitalocean/webhook_managed) 示例，参见 OpenAI Cookbook。

## 工作原理

DigitalOcean 的托管智能体运行时服务 (M.A.R.S.) 使用以下镜像启动 Firecracker microVM： `codex-agentapi` 该镜像包含 Codex 并启动执行器，执行器会向外连接到智能体 API。

选择 **[webhook-managed](#webhook-managed)** provisioning 以从OpenAI事件启动或恢复沙箱，或 **[application-managed](#application-managed)** provisioning 以从你的应用中控制这些沙箱。如需交互式快速入门，可使用可选的 [DigitalOcean CLI 流程](#try-it-with-the-digitalocean-cli)。请参阅 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 了解连接与恢复行为。

DigitalOcean 托管智能体目前为公开预览阶段。请参阅 [DigitalOcean 文档](https://docs.digitalocean.com/products/managed-agents/) 了解访问与设置方式。

## 准备工作

你需要一个已启用沙箱功能的 DigitalOcean 账户，并能够访问 `codex-agentapi` ，以及一个拥有 智能体 API 访问权限的 OpenAI 项目。

使用 `OPENAI_API_KEY` 配置你的应用或 CLI。将 `OPENAI_EXECUTOR_API_KEY` 设置为某个 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)。仅将环境密钥作为 `CODEX_API_KEY`.

对于 webhook 控制器或 Python 应用，请设置 `DIGITALOCEAN_TOKEN` 并安装 [PyDo SDK](https://github.com/digitalocean/pydo/releases) 0.41.0 或更高版本，并支持异步（`pydo[aio]`）。使用 [OpenAI SDK](https://developers.openai.com/api/docs/libraries#install-an-official-sdk) 发起 智能体 API 请求。CLI 安装仅在 CLI 流程中需要。

## Webhook 托管

1. [创建已存储的智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration#reuse-an-agent-across-sessions) 并保存其 ID 为 `OPENAI_AGENT_ID`。在 DigitalOcean App Platform 中使用此 ID 部署一个 HTTPS webhook 控制器， `OPENAI_API_KEY` 用于会话读取， `DIGITALOCEAN_TOKEN`，以及 `OPENAI_EXECUTOR_API_KEY`.
2. [注册其 `/webhook` endpoint](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks) 到你的 OpenAI 项目。启用 `agent.session.action_required` 和 `agent.session.failed`，然后将签名密钥存储为 `OPENAI_WEBHOOK_SECRET` 并重新部署控制器。
3. 遵循 [会话步骤](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#run-a-session) 使用相同的 `OPENAI_AGENT_ID` 和 `/workspace` 作为工作目录。打开事件流并发送输入。当 OpenAI 请求一个 `environment_connection`，时，控制器会验证签名，检索当前会话，并检查其 智能体 ID 和所需操作。它会在 DigitalOcean 中查找 `mars-{session_id}` ，恢复已暂停的沙盒；如果没有活跃的沙盒，则创建一个。
4. 在 `agent.session.failed`，时，再次检索会话，并且仅当当前会话状态仍为 `failed`.

该镜像将执行器连接到会话的运行环境。你的应用通过 智能体 API 发送输入并以流式方式获取结果；控制器负责预置与重连。按会话序列化预置操作，以处理重复与并发投递。详见 [webhook 生命周期管理指南](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes) 了解控制器要求。

## 使用 DigitalOcean CLI 试一试

CLI 会创建这两类资源，并允许你在终端中与该 智能体 进行交互。它直接预配置沙盒，无需 webhook controller。

安装 [`doctl`](https://github.com/digitalocean/doctl/releases) 版本 1.170.0 或更高版本，其中包含 `harness-runtime`，然后进行身份验证：

```bash
doctl auth init
```

将此清单保存为 `environment.yaml`:

```yaml
name: openai-codex-session
agent: codex-agentapi
config:
  agent:
    model: gpt-6.1-sol
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

该 `config` 块是 OpenAI 的 create-session 请求。CLI 使用 `OPENAI_API_KEY`，对请求进行身份验证，填写 `${ENV_ID}` 响应中的内容，并将仅包含环境密钥的部分传递给沙盒。请勿将解析后的清单写入日志或纳入源代码管理。将工具所需的任何目标添加到 `egress`.

创建会话和沙盒：

```bash
doctl harness-runtime create --spec environment.yaml
```

默认情况下，该命令会等待最多 300 秒以完成就绪。从会话详情中保存 OpenAI session ID 和 DigitalOcean session ID，然后连接：

```bash
doctl harness-runtime launch openai-codex-session
```

让该 智能体 写入 `hello` 到 `/workspace/hello.txt` 并将其读回。按下 **Ctrl+D** 可在不删除会话的情况下分离，然后运行相同的 `launch` 命令重新连接。完成后按照 [清理](#cleanup) 步骤操作。

## Application-managed

当你的应用负责会话创建和沙箱配置时，请使用此路径。先创建 OpenAI 会话：

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


保存 `session.id` 以及环境 ID，方法见 [连接沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session)。将此仅含沙箱的清单保存为 `sandbox.yaml`；智能体 配置已发送到 OpenAI：

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

1. Create a `pydo.aio.Client` 使用 `DIGITALOCEAN_TOKEN` 并调用 `client.agents.create_session`. 将 `params.openai_session_id` 设置为 OpenAI 会话 ID, `body.manifest` 为 的内容 `sandbox.yaml`，以及 `body.variables` 为 的映射 `ENV_ID` 和 `OPENAI_EXECUTOR_API_KEY` 为其值。保存返回的 DigitalOcean `session_id`.
2. [打开事件流并发送输入](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input)，让 智能体 进行写入和读取 `/workspace/hello.txt`。输入会等待执行器连接。确认连接事件和已完成的回合，并检查 智能体 的输出是否存在工具调用失败。
3. 使用 `workspace_download`，检索文件，并使用相对路径 `hello.txt`。保留这两个资源以便后续回合使用，或 [清理](#cleanup).

在应用中使用有界的设置和执行超时，并处理连接失败。不要将预配 webhook 处理程序附加到你的应用或 CLI 直接管理的会话上。

## 清理

保存所需文件，然后 [删除 OpenAI 会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并销毁 DigitalOcean 沙箱。会话删除不会发送 webhook，因此请同时执行这两项操作，并报告清理失败的情况。

使用 PyDo 时，调用 `client.agents.destroy_session` 并传入 DigitalOcean 会话 ID。使用 CLI 时，传入该 ID 或沙箱的名称：

```bash
doctl harness-runtime remove openai-codex-session
```

在删除 webhook 控制器之前，请移除 OpenAI 的 webhook 注册。

## 参考资料

- 阅读 [DigitalOcean 沙箱设置](https://github.com/digitalocean/pydo/tree/main/examples/agents/doc_python_sdk)
- 阅读 [DigitalOcean Python SDK](https://github.com/digitalocean/pydo)
- 阅读 [DigitalOcean CLI 版本发布](https://github.com/digitalocean/doctl/releases)