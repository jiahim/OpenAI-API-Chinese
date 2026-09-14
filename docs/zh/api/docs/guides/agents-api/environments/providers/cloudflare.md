# Cloudflare

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

本指南使用 **Webhook 管理的预配** 与 Cloudflare 的参考 Worker。

请参阅 [应用管理](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/cloudflare) 和 [Webhook 管理](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/cloudflare) 示例，详见 OpenAI Cookbook。

## 工作原理

1. 你的应用创建一个智能体 API 会话并发送输入。
2. OpenAI 向你 Cloudflare 账户中的 Worker 发送会话 webhook。
3. 该 Worker 启动或重新连接一个会话专用的容器，该容器运行 `codex exec-server`。执行器主动外连到 OpenAI，以便 智能体 可以执行命令并处理文件。

你的应用程序使用 智能体 API；参考 Worker 负责管理沙箱预置。详见 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) 以了解连接和恢复行为。

## 准备工作

你需要一个具有 Containers 访问权限的 Cloudflare 账户、一个 OpenAI 应用程序 API 密钥，以及一个单独的受限执行器密钥。请遵循 [执行器身份验证](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) 来配置这些密钥。请将应用程序密钥保存在 Container 外部。

[创建一个 智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration#reuse-an-agent-across-sessions) 并将其 ID 保存为 `OPENAI_AGENT_ID`。在你的应用程序和参考 Worker 中使用相同的 智能体 ID。

## 部署参考 Worker

Cloudflare 的 [参考 Worker](https://github.com/cloudflare/sandbox-sdk/tree/main/openai/agents-api) 包含 webhook 处理器、Container 镜像、部署配置和清理端点。

为清理端点生成一个密钥并将其保存为 `EXECUTOR_CLIENT_SECRET`:

```bash
openssl rand -hex 32
```

在你的 Cloudflare 账户中部署 Worker：



部署到 Cloudflare



按提示输入以下值：

| 变量                  | 值                                                   |
| ------------------------- | ------------------------------------------------------- |
| `OPENAI_API_KEY`          | Worker 用于检索会话状态的键        |
| `OPENAI_EXECUTOR_API_KEY` | 传递给 `codex exec-server`            |
| `OPENAI_AGENT_ID`         | 该 Worker 所服务的 智能体 ID                          |
| `OPENAI_WEBHOOK_SECRET`   | `pending-webhook-registration` 用于首次部署 |
| `EXECUTOR_CLIENT_SECRET`  | 为清理操作生成的密钥                            |

将已部署的 Worker URL 保存为 `WORKER_URL`.

### 注册 Webhook

按照 [webhook 设置](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks#set-up-a-webhook) 在OpenAI 项目中注册 `$WORKER_URL/webhook` 并启用 Cloudflare 参考集成所列出的事件：

- `agent.session.created`
- `agent.session.action_required`
- `agent.session.in_progress`
- `agent.session.idle`
- `agent.session.failed`

将 `OPENAI_WEBHOOK_SECRET` 替换为 OpenAI 返回的签名密钥，然后部署新的 Worker 版本。检查其配置。这些示例使用标准的 HTTP 客户端调用 Worker：

检查 Worker 健康状态

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.

const response = await fetch(
  "https://worker.example.com".replace(/\/+$/, "") + "/health",
  { method: "GET" }
);
if (!response.ok) throw new Error(`Request failed: ${response.status}`);
console.log(await response.text());
```

```python
# Replace the illustrative IDs and URLs below with your own resource values.
import urllib.request

url = "https://worker.example.com".rstrip("/") + "/health"
request = urllib.request.Request(url, method="GET")
with urllib.request.urlopen(request) as response:
    print(response.read().decode())
```

```go
// Replace the illustrative IDs and URLs below with your own resource values.
import (
	"io"
	"net/http"
	"os"
	"strings"
)

endpoint := strings.TrimRight("https://worker.example.com", "/") + "/health"
request, err := http.NewRequest("GET", endpoint, nil)
if err != nil {
	panic(err)
}
response, err := http.DefaultClient.Do(request)
if err != nil {
	panic(err)
}
defer response.Body.Close()
if response.StatusCode/100 != 2 {
	panic(response.Status)
}
if _, err := io.Copy(os.Stdout, response.Body); err != nil {
	panic(err)
}
```

```java
// Replace the illustrative IDs and URLs below with your own resource values.
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

String endpoint = "https://worker.example.com".replaceAll("/+$", "") + "/health";
var request =
    HttpRequest.newBuilder(URI.create(endpoint))
        .method("GET", HttpRequest.BodyPublishers.noBody())
        .build();
var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
if (response.statusCode() / 100 != 2)
  throw new IllegalStateException("Request failed: " + response.statusCode());
System.out.println(response.body());
```

```ruby
# Replace the illustrative IDs and URLs below with your own resource values.
require "uri"
require "net/http"

uri = URI("https://worker.example.com".sub(%r{/+\z}, "") + "/health")
request = Net::HTTP::Get.new(uri)
response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") { |http| http.request(request) }
raise "Request failed: #{response.code}" unless response.is_a?(Net::HTTPSuccess)

puts response.body
```

```bash
curl --fail-with-body "$WORKER_URL/health"
```


响应中应同时包含 `"configured": true` 和 `"webhook_configured": true`.

一个 `environment_connection` required action 是用于重新连接已离线执行器的信号。仅 idle 事件本身并不构成安全的关闭信号；请参阅 [生命周期行为](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#lifecycle-behavior).

## 运行会话

按照 [会话步骤](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#run-a-session) 将你的应用的 `OPENAI_API_KEY` 以及在 Worker 中配置的相同的 `OPENAI_AGENT_ID` 。创建一个自托管会话，并让 智能体 写入和读取 `/workspace/hello.txt`.

Worker 接收会话 Webhook 并连接沙箱执行器。你的应用通过 智能体 API 流式传输 智能体 的输出。

将会话 ID 保存为 `SESSION_ID`。若要继续对话，请在发送后续输入之前打开会话事件流。如果执行器处于离线状态，新输入会请求环境连接，并等待 Worker 重新连接它。重新连接本身不会恢复先前容器中的文件。

### 在 Worker 中运行你的应用

Cloudflare 的 [基础 Worker 应用](https://github.com/cloudflare/sandbox-sdk/tree/main/openai/agents-api/basic) 使用 `@openai/agents-api` TypeScript SDK 创建会话、发送初次和后续输入，并清理资源。其 `POST /demo` 端点运行 工作流。

此应用也使用了 webhook 管理的预配。在 Worker 中运行你的应用并不意味着必须直接预配沙箱。

## 清理

当应用不再需要沙箱时，调用引用 Worker 的已认证清理接口：

清理 Worker 沙箱

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.

const response = await fetch("https://worker.example.com/executors/sess_123", {
  method: "DELETE",
  headers: { Authorization: `Bearer ${process.env.EXECUTOR_CLIENT_SECRET}` },
});
if (!response.ok) throw new Error(`Request failed: ${response.status}`);
console.log(await response.text());
```

```python
# Replace the illustrative IDs and URLs below with your own resource values.
import os
from urllib.parse import quote
import urllib.request

url = (
    "https://worker.example.com".rstrip("/")
    + "/executors/"
    + quote("sess_123", safe="")
)
request = urllib.request.Request(
    url,
    method="DELETE",
    headers={"Authorization": "Bearer " + os.environ["EXECUTOR_CLIENT_SECRET"]},
)
with urllib.request.urlopen(request) as response:
    print(response.read().decode())
```

```go
// Replace the illustrative IDs and URLs below with your own resource values.
import (
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
)

endpoint := strings.TrimRight("https://worker.example.com", "/") + "/executors/" + url.PathEscape("sess_123")
request, err := http.NewRequest("DELETE", endpoint, nil)
if err != nil {
	panic(err)
}
request.Header.Set("Authorization", "Bearer "+os.Getenv("EXECUTOR_CLIENT_SECRET"))
response, err := http.DefaultClient.Do(request)
if err != nil {
	panic(err)
}
defer response.Body.Close()
if response.StatusCode/100 != 2 {
	panic(response.Status)
}
if _, err := io.Copy(os.Stdout, response.Body); err != nil {
	panic(err)
}
```

```java
// Replace the illustrative IDs and URLs below with your own resource values.
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

String endpoint =
    "https://worker.example.com".replaceAll("/+$", "")
        + "/executors/"
        + URLEncoder.encode("sess_123", StandardCharsets.UTF_8).replace("+", "%20");
var request =
    HttpRequest.newBuilder(URI.create(endpoint))
        .header("Authorization", "Bearer " + System.getenv("EXECUTOR_CLIENT_SECRET"))
        .method("DELETE", HttpRequest.BodyPublishers.noBody())
        .build();
var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
if (response.statusCode() / 100 != 2)
  throw new IllegalStateException("Request failed: " + response.statusCode());
System.out.println(response.body());
```

```ruby
# Replace the illustrative IDs and URLs below with your own resource values.
require "uri"
require "net/http"

uri = URI("https://worker.example.com".sub(%r{/+\z}, "") + "/executors/" + URI.encode_www_form_component("sess_123").gsub("+", "%20"))
request = Net::HTTP::Delete.new(uri)
request["Authorization"] = "Bearer #{ENV.fetch("EXECUTOR_CLIENT_SECRET")}"
response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") { |http| http.request(request) }
raise "Request failed: #{response.code}" unless response.is_a?(Net::HTTPSuccess)

puts response.body
```

```bash
curl --fail-with-body \
  --request DELETE \
  --header "Authorization: Bearer $EXECUTOR_CLIENT_SECRET" \
  "$WORKER_URL/executors/$SESSION_ID"
```


[删除 智能体 API 会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 单独进行。会话删除不会发出 webhook，因此如需立即清理，请同时执行这两个操作。请在释放 Container 之前获取你需要的文件。

## 进阶：应用自行管理配置

如需直接控制沙箱的配置，请使用 Cloudflare Sandbox SDK 并结合 [应用管理的生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#manage-sandboxes-from-your-application) 和 [执行器连接说明](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted)。每个会话使用一个配置控制器。

## 参考文档

- 阅读 [配合 OpenAI 智能体 API 使用 Cloudflare Containers](https://developers.cloudflare.com/sandbox/guides/openai-agents-api/) ，了解配置、生命周期行为、快照以及镜像自定义。
- 阅读 [Cloudflare Sandbox 文档](https://developers.cloudflare.com/sandbox/).
- 阅读 [Cloudflare Sandbox TypeScript SDK 参考](https://developers.cloudflare.com/sandbox/api/).