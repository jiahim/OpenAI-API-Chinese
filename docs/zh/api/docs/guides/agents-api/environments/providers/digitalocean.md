# DigitalOcean

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

请参阅 [由应用管理](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/digitalocean) 和 [由 Webhook 管理](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/digitalocean) 相关示例，请参见 OpenAI Cookbook。

## 工作原理

DigitalOcean 的托管 智能体 运行时服务（M.A.R.S.）使用以下镜像启动 Firecracker microVM： `codex-agentapi` image。该镜像包含 Codex 并启动 executor，executor 会向 智能体 API 建立出站连接。

选择 **[由 Webhook 管理](#webhook-managed)** provisioning 以根据 OpenAI 事件启动或恢复沙箱，或者使用 **[由应用管理](#application-managed)** provisioning 从你的应用控制它们。如需交互式快速上手，可使用可选的 [DigitalOcean CLI 流程](#try-it-with-the-digitalocean-cli)。参见 [Sandbox 生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 了解连接和恢复行为。

M.A.R.S. 目前为仅限邀请的私有预览。可通过 [DigitalOcean 私有预览公告](https://www.digitalocean.com/blog/managed-agents-runtime-services-private-preview).

## 开始之前

你需要一个已启用沙箱的 DigitalOcean 账户，并拥有对 `codex-agentapi` 的访问权限，以及一个具备 智能体 API 访问权限的 OpenAI 项目。

设置 `OPENAI_API_KEY` 分别用于你的应用或 CLI，以及一个受限的 `OPENAI_EXECUTOR_API_KEY` 用于沙箱。这些密钥必须具有相同的所有者、组织和项目。仅将执行器密钥存储在沙箱的 `CODEX_API_KEY` secret 中。参见 [执行器身份验证](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication).

对于 webhook 控制器或 Python 应用程序，请设置 `DIGITALOCEAN_TOKEN` 并安装支持异步的 [PyDo beta SDK](https://github.com/digitalocean/pydo/releases/tag/v0.40.0-beta.7) （`pydo[aio]`）。使用 [OpenAI SDK](https://developers.openai.com/api/docs/libraries#install-an-official-sdk) 发起 智能体 API 请求。仅在 CLI 流程中需要安装 CLI。

## Webhook 托管

1. [创建存储型智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration#reuse-an-agent-across-sessions) 并保存其 ID 为 `OPENAI_AGENT_ID`。在 DigitalOcean App Platform 中部署一个使用此 ID 的 HTTPS webhook 控制器， `OPENAI_API_KEY` 用于会话读取， `DIGITALOCEAN_TOKEN`，以及 `OPENAI_EXECUTOR_API_KEY`.
2. [注册其 `/webhook` endpoint](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks) 到你的OpenAI项目。启用 `agent.session.action_required` 和 `agent.session.failed`，然后将签名密钥存储为 `OPENAI_WEBHOOK_SECRET` 并重新部署控制器。
3. 按照 [会话步骤](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#run-a-session) 使用相同的 `OPENAI_AGENT_ID` 和 `/workspace` 作为工作目录。打开事件流并发送输入。当 OpenAI 请求 `environment_connection`，时，控制器会验证签名、检索当前会话，并检查其 智能体 ID 和必需的操作。然后查找 `mars-{session_id}` 在 DigitalOcean 中的沙箱，如果没有处于活动状态的沙箱，则恢复已暂停的沙箱或新建一个。
4. 在 `agent.session.failed`，时，再次检索会话，并在当前会话状态仍为 `failed`.

该镜像将执行器连接到会话的环境。你的应用通过 智能体 API 发送输入并流式返回结果；控制器负责预配和重连。每个会话需串行化预配逻辑，以处理重复与并发投递。详见 [webhook 管理的生命周期指南](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes) 了解控制器要求。

## 使用 DigitalOcean CLI 试一试

CLI 会创建这两类资源，并让你在终端里与该智能体进行交互。它直接置备沙箱，无需 webhook 控制器。

安装 [`doctl` beta 版本](https://github.com/digitalocean/doctl/releases/tag/v1.168.0-beta.8) ，其中包含 `harness-runtime`，然后进行身份验证：

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

该 `config` 块是 OpenAI create-session 请求。CLI 使用 `OPENAI_API_KEY`，对该请求进行身份验证，从响应中填充 `${ENV_ID}` ，并仅将受限的执行器密钥传递给沙箱。请勿将已解析的清单写入日志或纳入源代码管理。将工具所需的任何目标地址添加到 `egress`.

创建会话和沙箱：

```bash
doctl harness-runtime create --spec agents.yaml
```

该命令默认最多等待 300 秒以完成就绪。从会话详情中保存 OpenAI 会话 ID 和 DigitalOcean 会话 ID，然后附加：

```bash
doctl harness-runtime launch openai-codex-session
```

让该智能体将内容写入 `hello` ，然后 `/workspace/hello.txt` 回读。按下 **Ctrl+D** 可在不删除会话的情况下分离，并运行相同的 `launch` 命令以重新附加。完成后请按照 [清理](#cleanup) 进行操作。

## 应用管理

在你的应用负责会话创建和沙箱配置时使用此路径。先创建 OpenAI 会话：

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


保存 `session.id` 以及环境 ID，方法如 [连接沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session)。中所述。将仅沙箱清单另存为 `sandbox.yaml`；智能体 配置已发送给 OpenAI：

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

1. 创建一个 `pydo.aio.Client` 使用 `DIGITALOCEAN_TOKEN` 并调用 `client.agents.create_session`。将 `params.openai_session_id` 设置为 OpenAI 会话 ID， `body.manifest` 设置为 `sandbox.yaml`，以及 `body.variables` 设置为 `ENV_ID` 和 `OPENAI_EXECUTOR_API_KEY` 的映射。保存返回的 DigitalOcean `session_id`.
2. [打开事件流并发送输入](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input)，要求 智能体 编写并读取 `/workspace/hello.txt`。输入会等待执行器连接。确认连接事件和已完成的回合，并检查 智能体 输出中的工具失败情况。
3. 使用 `workspace_download`，检索文件，使用相对路径 `hello.txt`。保留这两个资源以供后续回合使用，或 [清理](#cleanup).

使用有限的设置和执行超时，并在你的应用程序中处理连接失败。不要将预配 webhook 处理程序附加到你的应用程序或 CLI 直接管理的会话。

## Cleanup

保存你需要的任何文件，然后 [删除 OpenAI 会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并销毁 DigitalOcean 沙箱。会话删除不会触发 webhook，因此请同时执行这两项操作并报告清理失败情况。

使用 PyDo 时，调用 `client.agents.destroy_session` 时传入 DigitalOcean 会话 ID。使用 CLI 时，传入该 ID 或沙箱的名称：

```bash
doctl harness-runtime remove openai-codex-session
```

在删除 webhook 控制器之前，请移除 OpenAI 的 webhook 注册。

## 参考

- 阅读 [DigitalOcean sandbox setup](https://github.com/digitalocean/pydo/tree/v0.40.0-beta.7/examples/agents/doc_python_sdk)
- 阅读 [DigitalOcean Python SDK](https://github.com/digitalocean/pydo)
- 阅读 [DigitalOcean CLI beta release](https://github.com/digitalocean/doctl/releases/tag/v1.168.0-beta.8)