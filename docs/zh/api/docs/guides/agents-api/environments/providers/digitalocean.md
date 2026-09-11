# DigitalOcean

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

在 DigitalOcean 沙盒中运行命令并操作文件，同时 OpenAI 运行 智能体 并维护会话状态。

## 工作原理

DigitalOcean 的托管 智能体 运行时服务（M.A.R.S.）使用以下镜像启动一个 Firecracker microVM `codex-agentapi` 。该镜像包含 Codex 并启动执行器，执行器会主动向外连接到 智能体 API。

选择 **[webhook-managed](#webhook-managed)** 配置方式，可通过 OpenAI 事件启动或恢复沙箱；或选择 **[application-managed](#application-managed)** 配置方式，由你的应用控制沙箱。如需交互式快速入门，请使用可选的 [DigitalOcean CLI 流程](#try-it-with-the-digitalocean-cli)。详见 [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以了解连接和恢复行为。

M.A.R.S. 目前仅限受邀用户参与私有预览。可通过 [DigitalOcean 的私有预览公告](https://www.digitalocean.com/blog/managed-agents-runtime-services-private-preview).

## 准备工作

你需要一个已启用沙箱功能的 DigitalOcean 账户，并可访问 `codex-agentapi` 以及一个具有 智能体 API 访问权限的 OpenAI 项目。

设置 `OPENAI_API_KEY` 用于你的应用或 CLI，并为沙箱设置一个单独的受限 `OPENAI_EXECUTOR_API_KEY` 。这些密钥必须具有相同的所有者、组织和项目。仅将执行器密钥存储在沙箱的 `CODEX_API_KEY` 密钥中。参见 [执行器身份验证](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication).

对于 Webhook 控制器或 Python 应用，请设置 `DIGITALOCEAN_TOKEN` 并安装 [PyDo beta SDK](https://github.com/digitalocean/pydo/releases/tag/v0.40.0-beta.7) （支持异步，`pydo[aio]`）。使用 [OpenAI SDK](https://developers.openai.com/api/docs/libraries#install-an-official-sdk) 发起 智能体 API 请求。CLI 安装仅在 CLI 流程中需要。

## Webhook-managed

1. [创建一个已存储的智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration#reuse-an-agent-across-sessions) 并将其 ID 保存为 `OPENAI_AGENT_ID`。在 DigitalOcean App Platform 中使用该 ID 部署一个 HTTPS webhook 控制器， `OPENAI_API_KEY` 用于读取会话， `DIGITALOCEAN_TOKEN`，以及 `OPENAI_EXECUTOR_API_KEY`.
2. [注册其 `/webhook` endpoint](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks) 到你的 OpenAI 项目中。启用 `agent.session.action_required` 和 `agent.session.failed`，然后将签名密钥存储为 `OPENAI_WEBHOOK_SECRET` 并重新部署控制器。
3. 按照 [会话步骤](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#run-a-session) 使用相同的 `OPENAI_AGENT_ID` 和 `/workspace` 作为工作目录。打开事件流并发送输入。当 OpenAI 请求一个 `environment_connection`，控制器会验证签名、检索当前会话，并检查其 智能体 ID 及所需操作。它会查找 `mars-{session_id}` 在 DigitalOcean 中的记录，恢复已暂停的沙盒，或在没有活动沙盒时新建一个。
4. 当 `agent.session.failed`，时，再次检索会话，仅当当前会话状态仍为 `failed`.

该镜像将执行器连接到会话的环境。 你的应用通过 智能体 API 发送输入并流式传输结果；控制器负责置备和重连。 请按会话序列化置备，以处理重复和并发交付。 参见 [webhook 管理生命周期指南](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes) 了解控制器要求。

## 使用 DigitalOcean CLI 试用

CLI 会创建相关资源，并允许你在终端中与该智能体交互。它直接预配沙箱，无需 webhook 控制器。

安装 [doctl beta release](https://github.com/digitalocean/doctl/releases/tag/v1.168.0-beta.8) 其中包含 `harness-runtime`，然后完成身份验证：

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

该 `config` 块就是 OpenAI create-session 请求。CLI 会使用 `OPENAI_API_KEY`，对该请求进行身份验证，从响应中填充 `${ENV_ID}` ，并将受限执行器密钥传递给沙箱。请勿将已解析的清单写入日志或纳入源码管理。将你的工具所需的任何目标添加到 `egress`.

创建会话和沙箱：

```bash
doctl harness-runtime create --spec agents.yaml
```

默认情况下，该命令最长会等待 300 秒以就绪。从会话详情中保存 OpenAI 会话 ID 和 DigitalOcean 会话 ID，然后进行挂载：

```bash
doctl harness-runtime launch openai-codex-session
```

让智能体写入 `hello` 到 `/workspace/hello.txt` 并读取回来。按下 **Ctrl+D** 可在不删除会话的情况下分离，然后运行相同的 `launch` 命令以重新挂载。完成后按 [清理](#cleanup) 操作。

## 应用管理

在你的应用负责创建会话和沙箱预置时使用此路径。先创建 OpenAI 会话：

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


Save `session.id` 以及环境 ID，如 [连接沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session)。中所述。将仅沙箱的清单保存为 `sandbox.yaml`；智能体 配置已经发送到 OpenAI：

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

1. 创建一个 `pydo.aio.Client` 使用 `DIGITALOCEAN_TOKEN` 并调用 `client.agents.create_session`。将 `params.openai_session_id` 设置为 OpenAI 会话 ID， `body.manifest` 设置为 `sandbox.yaml`，以及 `body.variables` 设置为 `ENV_ID` 和 `OPENAI_EXECUTOR_API_KEY` 的映射关系。保存返回的 DigitalOcean `session_id`.
2. [打开事件流并发送输入](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input)，要求 智能体 读写 `/workspace/hello.txt`。输入会等待执行器连接。确认连接事件和已完成的轮次，并检查 智能体 的输出中是否存在工具失败。
3. 使用 `workspace_download`，检索文件，使用相对路径 `hello.txt`。保留这两个资源用于后续轮次，或 [清理](#cleanup).

在应用中使用有界的设置和执行超时，并处理连接失败。不要为你的应用或 CLI 直接管理的会话附加预配 webhook 处理器。

## 清理

保存你需要的任何文件，然后 [删除 OpenAI 会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并销毁 DigitalOcean 沙箱。会话删除不会发出 webhook，因此请同时执行这两个操作并报告清理失败情况。

使用 PyDo 时，调用 `client.agents.destroy_session` 并传入 DigitalOcean 会话 ID。使用 CLI 时，传入该 ID 或沙箱的名称：

```bash
doctl harness-runtime remove openai-codex-session
```

在删除 webhook 控制器之前，先移除 OpenAI 的 webhook 注册。

## 参考

- 阅读 [DigitalOcean 沙盒环境搭建](https://github.com/digitalocean/pydo/tree/v0.40.0-beta.7/examples/agents/doc_python_sdk)
- 阅读 [DigitalOcean Python SDK](https://github.com/digitalocean/pydo)
- 阅读 [DigitalOcean CLI Beta 版发布](https://github.com/digitalocean/doctl/releases/tag/v1.168.0-beta.8)