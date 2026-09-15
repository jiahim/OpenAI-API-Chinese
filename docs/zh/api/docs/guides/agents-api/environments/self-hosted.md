# Self-hosted sandboxes

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取该页面的 Markdown 版本。

当你希望对智能体的环境拥有更多控制权，或者希望使用你信任的计算资源时，可以连接你自己的环境。该环境可以是一台笔记本电脑、一个容器，或是一个远程沙箱。若希望由OpenAI 来预置环境，请使用 [OpenAI 托管的沙箱](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted).




## 连接工作原理

OpenAI 运行 [智能体 运行框架](https://developers.openai.com/api/docs/guides/agents-api/architecture#the-pieces)。你在自己的环境中运行 `codex exec-server`，即执行器。它运行 shell 命令、读写文件,并按运行框架的请求使用本地 MCP 服务器。

执行器使用环境 ID 和受限的 API 密钥向 API 注册,然后通过 WebSocket 建立连接以接收命令并返回结果。所有连接均为出站连接。如果连接断开,执行器会重新连接。

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/self-hosted-sandboxes-1-mobile.webp"
    width="680"
    height="876"
  />
  <img src="https://developers.openai.com/images/api/agents-api/self-hosted-sandboxes-1.webp"
    width="1400"
    height="444"
    alt="The sandbox executor initiates an outbound connection to the Agents API and exchanges commands and results. The sandbox holds the environment key and environment ID."
    loading="lazy"
  />
</picture>




## 准备环境

准备好你的智能体所需的文件和依赖项。按用户或工作负载隔离环境。共享同一环境的智能体可以访问相同的文件、凭据及其他资源。

创建工作目录并在环境中安装 Codex CLI。本示例使用 `/workspace`:

```bash
mkdir -p /workspace
npm install -g @openai/codex@alpha
```




### 网络访问

允许到以下主机的出站连接：

- `https://api.openai.com` 用于环境注册。
- `wss://codex-cloud-environments.chatgpt.com` 用于命令和结果。

### 身份验证

使用 `OPENAI_API_KEY` 用于应用请求。为其授予 `api.agents.read` 和 `api.agents.write` 权限用于会话操作，并授予 `api.responses.write` 用于模型推理。如果你的应用管理 vault，请添加 `api.vaults.read` 和 `api.vaults.write` 。

在平台仪表板的 [智能体 标签页](https://platform.openai.com/agents?tab=environments&environment_view=keys) 中创建一个独立的环境密钥。它必须归属于拥有该会话的同一组织、项目以及用户或服务账号。将其余所有权限设置为 **None**.

在你的应用或配置服务中将 `OPENAI_EXECUTOR_API_KEY` 设置为此环境密钥。将其值作为 `CODEX_API_KEY`，传入沙箱，沙箱会读取该值。将你应用的 `codex exec-server` 保留在沙箱之外。 `OPENAI_API_KEY` 保留在沙箱外部。

智能体 生成的代码可以读取该环境密钥，但该密钥仅允许连接环境，无法授权任何其他 API 操作。请勿将其写入源代码、容器镜像或日志中，并在需要时轮换或撤销。




## 创建会话

在你的应用中、而非环境内运行此示例。如果你已有自托管会话，可复用它。

使用你自己的环境创建会话

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


存储 `session.id` 与应用的会话状态一起。将其传递给 `session.environment.id` 和 `session.environment.remote_url` 执行器。远程 URL 需原样使用，包括重新连接时也是如此。参见 [配置 智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration#reuse-an-agent-across-sessions) 以使用已存储的 智能体。




你可以在会话之间复用环境镜像、 `workspace_directory`，以及 `capability_directories` 。每个会话都有独立的环境 ID，并需要各自的执行器。API [环境模板](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins#reuse-a-hosted-plugin-setup) 仅适用于 OpenAI 托管的环境。

## 启动执行器

打开 [会话事件流](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#consume-a-stream) 从你的应用接收连接事件。然后在已配置环境密钥的环境中运行此命令： `CODEX_API_KEY` 上文。将会由 API 返回的环境值替换占位符：

```bash
codex exec-server \
  --remote "<session.environment.remote_url>" \
  --environment-id "<session.environment.id>"
```

让执行器在 智能体 工作期间保持运行。




## 发送工作并监视连接

[发送输入](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input) 在事件流保持打开状态时从你的应用发送输入。智能体需要同时具备已连接的环境和用户输入才能开始工作。

流会报告以下连接状态：

- `agent.session.environment.pending`: 会话正在等待执行器连接。
- `agent.session.environment.connected`: 环境已就绪。
- `agent.session.environment.failed`: 连接失败。请检查环境错误信息和执行器日志。

继续监听流以获取该轮的结果与输出。详见 [环境生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) ，以便在你的应用中或通过 Webhook 管理启动、重连与关闭。

## 沙盒提供商

选择一个沙箱提供程序来运行代码并处理文件。请参阅 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以比较由应用管理和由 Webhook 管理的预置方式。

| Provider                          | 指南                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| Modal                             | [Modal 设置](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/modal)               |
| Cloudflare                        | [Cloudflare 设置](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/cloudflare)     |
| Vercel                            | [Vercel 设置](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/vercel)             |
| Daytona                           | [Daytona 设置](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/daytona)           |
| Blaxel                            | [Blaxel 设置](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/blaxel)             |
| E2B                               | [E2B 设置](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/e2b)                   |
| Runloop                           | [Runloop 设置](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/runloop)           |
| DigitalOcean                      | [DigitalOcean 设置](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/digitalocean) |
| Oracle Cloud Infrastructure (OCI) | [OCI 设置](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/oci)                   |

对于由 webhook 管理的配置，请使用以下方式实现处理器 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#start-compute-from-webhooks) 以及你的提供商的 SDK 或 API。请明确配置所有权和清理策略。