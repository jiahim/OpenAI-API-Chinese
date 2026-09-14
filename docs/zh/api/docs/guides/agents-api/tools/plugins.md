# 插件

> 完整文档索引请参阅 [llms.txt](/llms.txt)。你可以在页面 URL 末尾追加 `.md` 来获取对应页面的 Markdown 版本。

插件用于打包技能、MCP 配置或两者。将其文件加载到你自己的环境中，或将 ZIP 上传到由 OpenAI 托管的环境中。

## 打包插件

该插件将文档搜索技能与 OpenAI 文档 MCP 结合在一起。它需要网络访问权限，但不需要凭证或本地服务器依赖项。

```text
docs-helper/
├── .codex-plugin/plugin.json
├── .mcp.json
└── skills/docs-search/SKILL.md
```

在以下位置声明技能目录和 MCP 配置 `.codex-plugin/plugin.json`:

```json
{
  "name": "docs-helper",
  "version": "1.0.0",
  "description": "Find answers in OpenAI developer documentation.",
  "skills": "./skills/",
  "mcpServers": "./.mcp.json"
}
```

路径从插件根目录解析。它们必须以 `./`，开头，位于插件内部，并且不包含 `..` 组件。参见 [打包你的插件](https://developers.openai.com/plugins/build/plugins) 了解完整的清单格式。

将服务器添加到 `.mcp.json`。该文件使用插件格式，与 `agent.tools`:

```json
{
  "mcpServers": {
    "openai_docs": {
      "type": "http",
      "url": "https://developers.openai.com/mcp"
    }
  }
}
```

将说明添加到 `skills/docs-search/SKILL.md`:

```markdown
---
name: docs-search
description: Find answers in OpenAI developer documentation.
---

Use the openai_docs MCP server to find relevant documentation.
Answer the question and link to the sources you used.
```

## Register plugins in a self-hosted sandbox

将插件复制到 `/workspace/plugins/docs-helper` ，并将绝对路径添加到 `environment.capability_directories`。选择插件根目录，其中包含 `.codex-plugin/plugin.json`.

注册插件

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const result = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
  },
  environment: {
    type: "self_hosted",
    workspace_directory: "/workspace",
    capability_directories: ["/workspace/plugins/docs-helper"],
  },
});
console.log(result.id);
```

```python
from openai import OpenAI

client = OpenAI()

result = client.beta.agents.sessions.create(
    agent={"model": "gpt-6-astra"},
    environment={
        "type": "self_hosted",
        "workspace_directory": "/workspace",
        "capability_directories": ["/workspace/plugins/docs-helper"],
    },
)
print(result.id)
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
		Agent: openai.BetaAgentSessionNewParamsAgent{Model: openai.String("gpt-6-astra")},
		Environment: openai.EnvironmentParamUnion{
			OfParamSelfHosted: &openai.EnvironmentParamSelfHosted{
				WorkspaceDirectory:    "/workspace",
				CapabilityDirectories: []string{"/workspace/plugins/docs-helper"},
			},
		},
	})
if err != nil {
	panic(err)
}
fmt.Println(result.ID)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.EnvironmentParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;
import java.util.List;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var result =
    client
        .beta()
        .agents()
        .sessions()
        .create(
            SessionCreateParams.builder()
                .agent(SessionCreateParams.Agent.builder().model("gpt-6-astra").build())
                .environment(
                    EnvironmentParam.SelfHosted.builder()
                        .workspaceDirectory("/workspace")
                        .capabilityDirectories(List.of("/workspace/plugins/docs-helper"))
                        .build())
                .build());
System.out.println(result.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
result = client.beta.agents.sessions.create(
  agent: { model: "gpt-6-astra" },
  environment: {
    type: "self_hosted",
    workspace_directory: "/workspace",
    capability_directories: ["/workspace/plugins/docs-helper"]
  }
)
puts result.id
```


[连接执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 在 智能体 使用插件之前完成，并允许环境访问 `https://developers.openai.com/mcp`.

对于多个插件，请列出每个根目录。父目录可以发现嵌套的技能，但不会加载每个子插件的 MCP 配置。

## 将插件上传到 OpenAI 托管的沙箱

为每个插件提供一个 ZIP，ZIP 中需包含 `environment.plugins`。每个 ZIP 必须包含一个插件文件夹，其中应放置 `.codex-plugin/plugin.json` 。请求中的名称和描述必须与清单匹配。

此辅助函数会打包你的文件夹并创建一个会话。传入你的 API 客户端以及 `docs-helper`。的路径。OpenAI 会自动解压并注册插件。

上传插件文件夹

```python
import base64
import json
import shutil
from pathlib import Path
from tempfile import TemporaryDirectory


def upload_plugin(client, plugin_directory):
    plugin_directory = Path(plugin_directory).resolve()
    manifest = json.loads((plugin_directory / ".codex-plugin/plugin.json").read_text())
    with TemporaryDirectory() as temporary:
        archive = shutil.make_archive(
            str(Path(temporary) / "plugin"),
            "zip",
            root_dir=plugin_directory.parent,
            base_dir=plugin_directory.name,
        )
        return client.beta.agents.sessions.create(
            agent={"model": "gpt-6-astra"},
            environment={
                "type": "openai_hosted",
                "plugins": [
                    {
                        "type": "inline",
                        "name": manifest["name"],
                        "description": manifest["description"],
                        "source": {
                            "type": "base64",
                            "media_type": "application/zip",
                            "data": base64.b64encode(
                                Path(archive).read_bytes()
                            ).decode(),
                        },
                    }
                ],
            },
        )
```


## 复用托管插件设置

[创建环境模板](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/environments/subresources/templates/methods/create) 并附带插件列表。对于后续会话，将 `environment.environment_template_id` 设置为已保存的模板 ID。

省略 `environment.plugins` 可继承模板的插件列表。如果提供列表则会替换原有列表。每个会话都会获得自己的环境；根 智能体 及其子智能体共享该环境。

## 对 MCP 服务器进行身份验证

该示例不需要身份验证。对于其他插件 MCP 服务器：

- **HTTP:** `bearer_token_env_var` 读取环境变量并将其值作为 bearer 令牌发送。其他 `http_headers` 值均为字面值； `env_http_headers` 不被支持。
- **Stdio:** `env_vars` 列出要传递给服务器进程的环境变量。在环境中安装可执行文件及其依赖项。相对 `cwd` 从插件根目录解析。

请勿在插件文件和归档中存放密钥。插件 MCP 连接在会话的环境中发起。详见 [MCP 身份验证](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#add-authentication) 以了解凭据边界。

对于托管 stdio MCP，请省略网络策略或将其设置为 `enabled`。 `disabled` 和 `restricted` 网络策略不支持用于这些连接。

## 测试插件

发送一条普通的会话消息，请求该技能：

> 使用 docs-search 解释如何流式输出 Responses API 的输出。请附上指向文档的链接。

检查该轮次已完成，并且其 [已保存条目](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#fetch-items-and-turns) 包含对以下项的成功调用： `openai_docs`。答案应遵循该技能的说明并引用文档。对于仅含技能的插件，请根据说明检查其输出；无需进行 MCP 调用。

在更改插件文件或模板后创建一个新会话。已有会话不会重新加载工具。有关连接错误，请参阅 [MCP 故障排查](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#troubleshoot-connections). [删除测试会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage) 并在使用完毕后停止自托管计算资源。